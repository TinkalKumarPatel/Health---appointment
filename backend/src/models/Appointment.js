import mongoose from 'mongoose';
import { memoryDb, wrapAppointment } from '../data/store.js';

const { Schema, model } = mongoose;

const appointmentSchema = new Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  durationMinutes: { type: Number, default: 30 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: { type: String }
}, { timestamps: true });

const MongooseAppointment = mongoose.models.Appointment || model('Appointment', appointmentSchema);

const isMongoLive = () => mongoose.connection.readyState === 1;

const Appointment = {
  find: (query = {}) => {
    if (isMongoLive()) {
      return MongooseAppointment.find(query);
    }
    let list = memoryDb.appointments.map(wrapAppointment);
    if (query.patient) {
      list = list.filter(a => String(a.patient?._id || a.patient) === String(query.patient));
    }
    if (query.doctor) {
      list = list.filter(a => String(a.doctor?._id || a.doctor) === String(query.doctor));
    }

    const sortFn = (sortObj) => {
      if (sortObj && sortObj.date) {
        list.sort((a, b) => (new Date(b.date) - new Date(a.date)) * sortObj.date);
      }
      return Promise.resolve(list);
    };

    return {
      populate: () => ({
        populate: () => ({
          sort: (s) => sortFn(s),
          then: (onF, onR) => Promise.resolve(list).then(onF, onR),
          catch: (onR) => Promise.resolve(list).catch(onR)
        }),
        sort: (s) => sortFn(s),
        then: (onF, onR) => Promise.resolve(list).then(onF, onR),
        catch: (onR) => Promise.resolve(list).catch(onR)
      }),
      sort: (s) => sortFn(s),
      then: (onF, onR) => Promise.resolve(list).then(onF, onR),
      catch: (onR) => Promise.resolve(list).catch(onR)
    };
  },

  findById: (id) => {
    if (isMongoLive()) {
      return MongooseAppointment.findById(id);
    }
    const found = memoryDb.appointments.find(a => String(a._id) === String(id));
    const wrapped = wrapAppointment(found);
    return {
      populate: () => ({
        populate: () => Promise.resolve(wrapped),
        then: (onF, onR) => Promise.resolve(wrapped).then(onF, onR),
        catch: (onR) => Promise.resolve(wrapped).catch(onR)
      }),
      then: (onF, onR) => Promise.resolve(wrapped).then(onF, onR),
      catch: (onR) => Promise.resolve(wrapped).catch(onR)
    };
  },

  findOne: (query = {}) => {
    if (isMongoLive()) {
      return MongooseAppointment.findOne(query);
    }
    if (query.doctor && query.status) {
      const match = memoryDb.appointments.find(a => {
        if (String(a.doctor?._id || a.doctor) !== String(query.doctor)) return false;
        if (!['pending', 'confirmed'].includes(a.status)) return false;
        const apptStart = new Date(a.date).getTime();
        const reqStart = new Date(query.date?.$lt || 0).getTime();
        return Math.abs(apptStart - reqStart) < 30 * 60000;
      });
      return Promise.resolve(wrapAppointment(match));
    }
    const found = memoryDb.appointments[0];
    return Promise.resolve(wrapAppointment(found));
  },

  create: async (data) => {
    if (isMongoLive()) {
      return MongooseAppointment.create(data);
    }
    const newAppt = {
      _id: '67' + Math.random().toString(16).substring(2, 24).padStart(22, '0'),
      ...data,
      createdAt: new Date().toISOString()
    };
    memoryDb.appointments.push(newAppt);
    return wrapAppointment(newAppt);
  },

  insertMany: async (docs) => {
    if (isMongoLive()) {
      return MongooseAppointment.insertMany(docs);
    }
    return docs.map(d => Appointment.create(d));
  }
};

export default Appointment;
