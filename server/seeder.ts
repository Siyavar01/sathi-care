import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { professionals } from './data/professionals.ts';
import User from './models/userModel.ts';
import Professional from './models/professionalModel.ts';
import connectDB from './config/db.ts';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Professional.deleteMany();
    await User.deleteMany({ role: 'professional' });

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

    const professionalProfiles = insertedUsers.map((user, index) => {
      const profData = professionals[index];
      return {
        user: user._id,
        title: profData.title,
        bio: profData.bio,
        specializations: profData.specializations,
        experience: profData.experience,
        languages: profData.languages,
        availability: profData.availability,
        profilePictureUrl: profData.profilePictureUrl,
        isVerified: true,
      };
    });

    await Professional.insertMany(professionalProfiles);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Professional.deleteMany();
    await User.deleteMany({ role: 'professional' });

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}