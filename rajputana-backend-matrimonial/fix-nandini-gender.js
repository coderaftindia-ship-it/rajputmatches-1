const mongoose = require("mongoose");
const User = require("./models/UserProfile.js");
require("dotenv").config();

async function fixGender() {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");

    const users = await User.find({
      $or: [
        { firstName: { $regex: "nandini", $options: "i" } },
        { mobile: "7023705170" },
        { martrId: 1017 }
      ]
    });

    console.log(`Found ${users.length} matching user(s):`);
    for (const u of users) {
      console.log(`Before update: ID: ${u._id}, Name: ${u.firstName} ${u.lastName}, MatriID: ${u.martrId}, Gender: ${u.gender}`);
      u.gender = "Female";
      await u.save();
      console.log(`After update: Gender set to: ${u.gender}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing gender:", error);
    process.exit(1);
  }
}

fixGender();
