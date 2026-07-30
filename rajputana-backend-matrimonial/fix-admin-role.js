const mongoose = require('mongoose');
const User = require('./models/UserProfile');

const DB_URI = 'mongodb://localhost:27017/Matrimoni';

async function run() {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB');
    
    // Find all users
    const allUsers = await User.find();
    console.log(`Total users in DB: ${allUsers.length}`);

    // Update any user with role containing 'admin' or quotes to plain 'admin'
    let updatedCount = 0;
    for (const u of allUsers) {
      if (u.role && u.role.includes('admin')) {
        console.log(`User ID: ${u._id}, Email: ${u.email}, Current Role: [${u.role}]`);
        if (u.role !== 'admin') {
          // Direct update to bypass Mongoose validation
          await User.updateOne({ _id: u._id }, { $set: { role: 'admin' } });
          console.log(`-> Updated role to 'admin'`);
          updatedCount++;
        }
      }
    }
    console.log(`Finished. Updated ${updatedCount} users.`);
  } catch (err) {
    console.error('Error running script:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

run();
