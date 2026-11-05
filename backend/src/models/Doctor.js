import mongoose from 'mongoose';
import { memoryDb, wrapDoctor } from '../data/store.js';

const { Schema, model } = mongoose;

const doctorSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialty: { type: String, required: true },
  qualifications: [{ type: String }],
  experienceYears: { type: Number, default: 0 },
  fees: { type: Number, required: true },
  locations: [{ type: String }],
  availability: [{
    day: { type: Number, min: 0, max: 6 },
    start: { type: String },
    end: { type: String }
  }]
}, { timestamps: true });

const MongooseDoctor = mongoose.models.Doctor || model('Doctor', doctorSchema);

const isMongoLive = () => mongoose.connection.readyState === 1;

const Doctor = {
  find: (query = {}) => {
    if (isMongoLive()) {
      return MongooseDoctor.find(query);
    }
    let list = memoryDb.doctors.map(wrapDoctor);
    if (query.specialty && query.specialty.$regex) {
      const reg = new RegExp(query.specialty.$regex, query.specialty.$options || 'i');
      list = list.filter(d => reg.test(d.specialty));
    }
    if (query['user.name'] && query['user.name'].$regex) {
      const reg = new RegExp(query['user.name'].$regex, query['user.name'].$options || 'i');
      list = list.filter(d => d.user && reg.test(d.user.name));
    }
    if (query.locations && query.locations.$elemMatch && query.locations.$elemMatch.$regex) {
      const reg = new RegExp(query.locations.$elemMatch.$regex, 'i');
      list = list.filter(d => d.locations.some(loc => reg.test(loc)));
    }
    if (query.availability && query.availability.$elemMatch) {
      const dayReq = query.availability.$elemMatch.day;
      list = list.filter(d => d.availability.some(slot => slot.day === dayReq));
    }

    return {
      populate: () => Promise.resolve(list),
      then: (onF, onR) => Promise.resolve(list).then(onF, onR),
      catch: (onR) => Promise.resolve(list).catch(onR)
    };
  },

  findById: (id) => {
    if (isMongoLive()) {
      return MongooseDoctor.findById(id);
    }
    const found = memoryDb.doctors.find(d => String(d._id) === String(id) || String(d.user?._id || d.user) === String(id));
    const wrapped = wrapDoctor(found);
    return {
      populate: () => Promise.resolve(wrapped),
      then: (onF, onR) => Promise.resolve(wrapped).then(onF, onR),
      catch: (onR) => Promise.resolve(wrapped).catch(onR)
    };
  },

  findOne: (query = {}) => {
    if (isMongoLive()) {
      return MongooseDoctor.findOne(query);
    }
    const found = memoryDb.doctors.find(d => {
      if (query._id && String(d._id) === String(query._id)) return true;
      if (query.user && String(d.user?._id || d.user) === String(query.user)) return true;
      return false;
    });
    const wrapped = wrapDoctor(found);
    return {
      populate: () => Promise.resolve(wrapped),
      then: (onF, onR) => Promise.resolve(wrapped).then(onF, onR),
      catch: (onR) => Promise.resolve(wrapped).catch(onR)
    };
  },

  distinct: async (field) => {
    if (isMongoLive()) {
      return MongooseDoctor.distinct(field);
    }
    if (field === 'specialty') {
      const set = new Set(memoryDb.doctors.map(d => d.specialty));
      return Array.from(set);
    }
    return [];
  },

  create: async (data) => {
    if (isMongoLive()) {
      return MongooseDoctor.create(data);
    }
    const newDoc = {
      _id: '66' + Math.random().toString(16).substring(2, 24).padStart(22, '0'),
      ...data
    };
    memoryDb.doctors.push(newDoc);
    return wrapDoctor(newDoc);
  },

  insertMany: async (docs) => {
    if (isMongoLive()) {
      return MongooseDoctor.insertMany(docs);
    }
    return docs.map(d => Doctor.create(d));
  }
};

export default Doctor;
