import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Appointment, { IAppointment } from '../models/appointmentModel.js';
import Professional from '../models/professionalModel.js';
import { IUser } from '../models/userModel.js';

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

  const existingAppointment = await Appointment.findOne({
    professional: professionalId,
    appointmentDate: new Date(appointmentDate),
    status: { $in: ['pending', 'confirmed'] },
  });

  if (existingAppointment) {
    res.status(409);
    throw new Error('This time slot is no longer available. Please select another time.');
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

// @desc    Get appointments for the logged-in user
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

// @desc    Get all confirmed appointments for a specific professional
// @route   GET /api/appointments/professional/:id
// @access  Public
const getAppointmentsByProfessional = asyncHandler(async (req: Request, res: Response) => {
    const professionalId = req.params.id;
    const appointments = await Appointment.find({
        professional: professionalId,
        status: 'confirmed',
    });

    res.status(200).json(appointments);
});

export { createAppointment, getMyAppointments, getAppointmentsByProfessional };