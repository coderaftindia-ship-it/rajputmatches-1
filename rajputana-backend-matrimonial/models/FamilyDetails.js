const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FamilyDetailsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "UserProfile", required: true },
  fatherName: { type: String, default: "" },
  occupation: { type: String, default: "" },
  fatherNativePlace: { type: String, default: "" },
  motherName: { type: String, default: "" },
  motherNativePlace: { type: String, default: "" },
  motherOccupation: { type: String, default: "" },
  maternalGotra: { type: String, default: "" },
  siblings: { type: String, default: "" },
  familyLocation: { type: String, default: "" },
  additionalMaternal: { type: String, default: "" },
  familyInfo: { type: String, default: "" },
  elderBrother: [
    {
      name: { type: String, default: "" },
      marriedto: { type: String, default: "" },
      daughterof: { type: String, default: "" },
      thikana: { type: String, default: "" },
    },
  ],
  elderSister: [
    {
      name: { type: String, default: "" },
      marriedto: { type: String, default: "" },
      sonof: { type: String, default: "" },
      thikana: { type: String, default: "" },
    },
  ],
  youngerBrother: [
    {
      name: { type: String, default: "" },
      marriedto: { type: String, default: "" },
      daughterof: { type: String, default: "" },
      thikana: { type: String, default: "" },
    },
  ],
  youngerSister: [
    {
      name: { type: String, default: "" },
      marriedto: { type: String, default: "" },
      sonof: { type: String, default: "" },
      thikana: { type: String, default: "" },
    },
  ],
});

module.exports = mongoose.model("FamilyDetails", FamilyDetailsSchema);

