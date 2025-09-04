import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { professionals } from './data/professionals.ts';
import User from './models/userModel.ts';
import Professional from './models/professionalModel.ts';
import connectDB from './config/db.ts';

dotenv.config();

const importData = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected.');

    console.log('Destroying old professional data...');
    await Professional.deleteMany();
    await User.deleteMany({ role: 'professional' });
    console.log('Old data destroyed.');

    console.log('Creating professional user accounts...');
    const createdUsers = [];
    for (const profData of professionals) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(profData.password, salt);

      const user = new User({
        name: profData.name,
        email: profData.email,
        password: hashedPassword,
        role: 'professional',
      });
      createdUsers.push(user);
    }
    const insertedUsers = await User.insertMany(createdUsers);
    console.log(`${insertedUsers.length} professional user accounts created.`);

    console.log('Creating professional profiles...');
    const professionalProfiles = insertedUsers.map((user, index) => {
      const profData = professionals[index];
      const sessionTypesWithIds = profData.sessionTypes.map(st => ({
        ...st,
        _id: new mongoose.Types.ObjectId()
      }));

      const availabilityWithSessionIds = profData.availability.map(day => ({
        ...day,
        timeSlots: day.timeSlots.map(slot => ({
          ...slot,
          sessionTypeId: sessionTypesWithIds[0]._id
        }))
      }));

      return {
        user: user._id,
        title: profData.title,
        bio: profData.bio,
        specializations: profData.specializations,
        experience: profData.experience,
        languages: profData.languages,
        profilePictureUrl: profData.profilePictureUrl,
        isVerified: profData.isVerified,
        offersProBono: profData.offersProBono,
        sessionTypes: sessionTypesWithIds,
        acceptsInstitutionalOutreach: profData.acceptsInstitutionalOutreach,
        availability: availabilityWithSessionIds,
        credentials: profData.credentials,
      };
    });

    await Professional.insertMany(professionalProfiles);
    console.log(`${professionalProfiles.length} professional profiles created.`);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected.');

    await Professional.deleteMany();
    await User.deleteMany({ role: 'professional' });

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during data destruction: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}