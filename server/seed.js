const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});

    await User.insertMany([
      { name: 'Admin User', username: 'admin', password: 'inspirante2026', role: 'admin' },
      { name: 'Asha Rao', username: 'asha.rao', password: 'student123', role: 'student' },
      { name: 'Ravi Shetty', username: 'ravi.shetty', password: 'student123', role: 'student' },
      { name: 'Meera Nair', username: 'meera.nair', password: 'student123', role: 'student' },
      { name: 'Kiran Bhat', username: 'kiran.bhat', password: 'student123', role: 'student' },
      { name: 'Divya Kamath', username: 'divya.kamath', password: 'student123', role: 'student' },
      { name: 'Suresh Pai', username: 'suresh.pai', password: 'student123', role: 'student' },
      { name: 'Ananya Hegde', username: 'ananya.hegde', password: 'student123', role: 'student' },
      { name: 'Rohan Shenoy', username: 'rohan.shenoy', password: 'student123', role: 'student' },
      { name: 'Nisha Prabhu', username: 'nisha.prabhu', password: 'student123', role: 'student' },
      { name: 'Tejas Mallya', username: 'tejas.mallya', password: 'student123', role: 'student' },
      { name: 'Priya Bangera', username: 'priya.bangera', password: 'student123', role: 'student' }
    ]);

    await Event.insertMany([
      { name: 'Tech Symposium 2026', date: new Date('2026-07-10'), venue: 'Main Auditorium', capacity: 120 },
      { name: 'Hackathon', date: new Date('2026-07-15'), venue: 'Lab Block C', capacity: 40 },
      { name: 'Cultural Fest', date: new Date('2026-07-20'), venue: 'Open Amphitheatre', capacity: 300 },
      { name: 'Workshop: React Basics', date: new Date('2026-07-22'), venue: 'Seminar Hall 2', capacity: 30 },
      { name: 'Placement Prep Talk', date: new Date('2026-07-25'), venue: 'Main Auditorium', capacity: 200 }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();