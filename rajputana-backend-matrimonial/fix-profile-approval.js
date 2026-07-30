const mongoose = require("mongoose");
const User = require("./models/UserProfile.js");
require('dotenv').config();

async function fixProfileApproval() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/Matrimoni', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    // Update all user profiles to be unapproved by default, and admin profiles to be approved
    const resultUser = await User.updateMany(
      { role: { $ne: "admin" } },
      {
        $set: {
          isVisible: true,
          isbloacked: false,
          isApproved: false
        }
      }
    );
    console.log(`✅ Set isApproved to false for ${resultUser.modifiedCount} user profiles`);

    const resultAdmin = await User.updateMany(
      { role: "admin" },
      {
        $set: {
          isVisible: true,
          isbloacked: false,
          isApproved: true
        }
      }
    );
    console.log(`✅ Set isApproved to true for ${resultAdmin.modifiedCount} admin profiles`);


    // Count total profiles
    const totalProfiles = await User.countDocuments();
    console.log(`📊 Total profiles in database: ${totalProfiles}`);

    // Get some sample profiles
    const sampleProfiles = await User.find().limit(3);
    console.log('📝 Sample profiles:');
    sampleProfiles.forEach(profile => {
      console.log(`- ${profile.firstName} ${profile.lastName} (ID: ${profile.martrId}, Gender: ${profile.gender}, isApproved: ${profile.isApproved}, isVisible: ${profile.isVisible})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixProfileApproval();
