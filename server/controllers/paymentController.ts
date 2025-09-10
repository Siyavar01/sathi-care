import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { IUser } from '../models/userModel.ts';
import Appointment from '../models/appointmentModel.ts';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// @desc    Create a new Razorpay order
// @route   POST /api/payments/orders
// @access  Private
const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { amount, currency = 'INR' } = req.body;

  if (!amount) {
    res.status(400);
    throw new Error('Amount is required');
  }

  const options = {
    amount: amount * 100,
    currency,
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  const order = await razorpay.orders.create(options);

  if (!order) {
    res.status(500);
    throw new Error('Could not create Razorpay order');
  }

  res.status(201).json(order);
});

// @desc    Verify payment and create the appointment
// @route   POST /api/payments/verify-and-book
// @access  Private
const verifyAndBookAppointment = asyncHandler(async (req: Request, res: Response) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    appointmentData,
  } = req.body;

  const user = req.user as IUser;

  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed. Invalid signature.');
  }

  const { professionalId, sessionDetails, appointmentDate } = appointmentData;

  const appointment = await Appointment.create({
    user: user._id,
    professional: professionalId,
    sessionDetails,
    appointmentDate,
    status: 'confirmed',
    paymentId: razorpay_payment_id,
    videoRoomUrl: `https://meet.jit.si/${crypto.randomBytes(16).toString('hex')}`,
  });

  res.status(201).json({
    message: 'Payment verified and appointment confirmed',
    appointment,
  });
});

export { createOrder, verifyAndBookAppointment };