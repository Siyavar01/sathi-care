import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Appointment, { IAppointment } from '../models/appointmentModel.ts';
import Professional from '../models/professionalModel.ts';
import { IUser } from '../models/userModel.ts';

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private (User)
const createAppointment = asyncHandler(async (req: Request, res: Response) => {
  const { professionalId, sessionDetails, appointmentDate } = req.body;
  const user = req.user as IUser;

  if (!professionalId || !sessionDetails || !appointmentDate) {
    res.status(400);
    throw new Error('Please provide all required appointment details');
  }

  if (user.role !== 'user') {
    res.status(403);
    throw new Error('Only users can book appointments.');
  }

  const appointment = await Appointment.create({
    user: user._id,
    professional: professionalId,
    sessionDetails,
    appointmentDate,
    status: 'pending',
  });

  res.status(201).json(appointment);
});

// @desc    Get appointments for the logged-in user (as a client or professional)
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as IUser;
  let appointments: IAppointment[] = [];

  if (user.role === 'professional') {
    const professionalProfile = await Professional.findOne({ user: user._id });
    if (!professionalProfile) {
        res.status(404);
        throw new Error('Professional profile not found');
    }
    appointments = await Appointment.find({ professional: professionalProfile._id })
      .populate('user', 'name');
  } else if (user.role === 'user') {
    appointments = await Appointment.find({ user: user._id })
      .populate({
        path: 'professional',
        select: 'user',
        populate: {
            path: 'user',
            select: 'name'
        }
      });
  } else {
    appointments = [];
  }

  res.status(200).json(appointments);
});


export { createAppointment, getMyAppointments };