const mongoose = require("mongoose");

// Profile Schema
const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    // Change to match frontend
    tandemID: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    location: { type: String, default: "Not specified" },

    // Language section
    nativeLanguage: { type: String },
    fluentLanguage: { type: String },
    learningLanguage: { type: String },
    translateLanguage: { type: String },

    // Preferences
    communication: { type: String },
    timeCommitment: { type: String },
    learningSchedule: { type: String },
    correctionPreference: { type: String },

    // Optional fields
    about: { type: String },
    partnerPreference: { type: String },
    learningGoals: { type: String },

    // Privacy settings
    showLocation: { type: Boolean, default: true },
    showTandemID: { type: Boolean, default: true }, // Match frontend casing

    // Social features
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Topics (single declaration)
    topics: [{ type: String }],

    // Remove these if not needed
    language: { type: String }, // Make optional
    proficiencyLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Fluent"],
      default: "Beginner",
    },

    notifications: { type: Boolean, default: true },
    profilePicture: {
      type: String,
      default: "https://example.com/default-profile.png",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// Create Profile model
const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
