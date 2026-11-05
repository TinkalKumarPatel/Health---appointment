import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { memoryDb, wrapUser } from '../data/store.js';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const MongooseUser = mongoose.models.User || model('User', userSchema);

const isMongoLive = () => mongoose.connection.readyState === 1;

const User = {
  findOne: (query) => {
    if (isMongoLive()) {
      return MongooseUser.findOne(query);
    }
    const found = memoryDb.users.find(u => {
      if (query.email && u.email.toLowerCase() === query.email.toLowerCase()) return true;
      if (query._id && String(u._id) === String(query._id)) return true;
      return false;
    });
    const wrapped = wrapUser(found);
    return {
      select: () => Promise.resolve(wrapped),
      then: (onF, onR) => Promise.resolve(wrapped).then(onF, onR),
      catch: (onR) => Promise.resolve(wrapped).catch(onR)
    };
  },

  findById: (id) => {
    if (isMongoLive()) {
      return MongooseUser.findById(id);
    }
    const found = memoryDb.users.find(u => String(u._id) === String(id));
    const wrapped = wrapUser(found);
    return {
      select: () => Promise.resolve(wrapped),
      then: (onF, onR) => Promise.resolve(wrapped).then(onF, onR),
      catch: (onR) => Promise.resolve(wrapped).catch(onR)
    };
  },

  find: (query = {}) => {
    if (isMongoLive()) {
      return MongooseUser.find(query);
    }
    let list = memoryDb.users.map(wrapUser);
    if (query.role) list = list.filter(u => u.role === query.role);
    return {
      select: () => Promise.resolve(list.map(u => ({ _id: u._id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }))),
      then: (onF, onR) => Promise.resolve(list).then(onF, onR),
      catch: (onR) => Promise.resolve(list).catch(onR)
    };
  },

  create: async (data) => {
    if (isMongoLive()) {
      return MongooseUser.create(data);
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);
    const newUser = {
      _id: '65' + Math.random().toString(16).substring(2, 24).padStart(22, '0'),
      name: data.name,
      email: data.email,
      password: hash,
      role: data.role || 'patient',
      createdAt: new Date().toISOString()
    };
    memoryDb.users.push(newUser);
    return wrapUser(newUser);
  },

  insertMany: async (docs) => {
    if (isMongoLive()) {
      return MongooseUser.insertMany(docs);
    }
    const res = [];
    for (const d of docs) {
      res.push(await User.create(d));
    }
    return res;
  }
};

export default User;
