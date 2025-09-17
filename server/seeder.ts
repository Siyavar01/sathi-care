import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { professionals } from './data/professionals.js';
import { questions } from './data/questions.js';
import { resources } from './data/resources.js';
import User from './models/userModel.js';
import Professional from './models/professionalModel.js';
import Question from './models/questionnaireModel.js';
import Resource from './models/resourceModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importProfessionals = async () => {
  await Professional.deleteMany();
  await User.deleteMany({ role: 'professional' });

  const createdUsers = [];
  for (const profData of professionals) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(profData.password, 'password123');

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
      ...profData,
      sessionTypes: sessionTypesWithIds,
      availability: availabilityWithSessionIds,
    };
  });

  await Professional.insertMany(professionalProfiles);
  console.log('Professional Data Imported!');
};

const importQuestions = async () => {
    await Question.deleteMany();
    await Question.insertMany(questions);
    console.log('Questionnaire Data Imported!');
}

const importResources = async () => {
    console.log('Importing resources...');
    await Resource.deleteMany();

    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
        console.error('Error: No admin user found. Please create an admin user before seeding resources.');
        process.exit(1);
    }

    const resourcesWithAdmin = resources.map(resource => {
        return { ...resource, addedBy: adminUser._id };
    });

    await Resource.insertMany(resourcesWithAdmin);
    console.log('Resource Data Imported!');
}


const main = async () => {
    try {
        const args = process.argv.slice(2);
        const importAll = args.length === 0;
        const destroyAll = args[0] === '-d';

        if (destroyAll) {
            await Professional.deleteMany();
            await User.deleteMany({ role: 'professional' });
            await Question.deleteMany();
            await Resource.deleteMany();
            console.log('All Seed Data Destroyed!');
        } else {
            if (importAll || args.includes('--professionals')) {
                await importProfessionals();
            }
            if (importAll || args.includes('--questions')) {
                await importQuestions();
            }
            if (importAll || args.includes('--resources')) {
                await importResources();
            }
        }
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
}

main();