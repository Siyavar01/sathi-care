import { Schema, model, Document, Types } from 'mongoose';
import { ISessionType } from './professionalModel.ts';

export interface IAppointment extends Document {
  user: Types.ObjectId;
  professional: Types.ObjectId;
  sessionDetails: ISessionType;
  appointmentDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentId?: string;
  videoRoomUrl?: string;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    professional: { type: Schema.Types.ObjectId, required: true, ref: 'Professional' },
    sessionDetails: {
      type: { type: String, required: true },
      duration: { type: Number, required: true },
      price: { type: Number, required: true },
      isProBono: { type: Boolean, required: true },
    },
    appointmentDate: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentId: { type: String },
    videoRoomUrl: { type: String },
  },
  { timestamps: true }
);

const Appointment = model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;