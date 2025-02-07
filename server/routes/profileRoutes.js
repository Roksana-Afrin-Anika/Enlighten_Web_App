const express = require("express");
const Profile = require("../models/Profile.js");
const User = require("../models/User.js");
const { protect } = require("../middleware/authMiddleware.js");
const upload = require("../config/multerConfig.js");

const router = express.Router();

// @route   POST /api/profile
// @desc    Create a new profile
// @access  Private
router.post("/", protect, async (req, res) => {
  const { name, tandemID, dateOfBirth, location, language, proficiencyLevel } =
    req.body;

  try {
    const existingProfile = await Profile.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profile = new Profile({
      user: req.user._id,
      name,
      tandemID,
      dateOfBirth,
      location,
      language,
      proficiencyLevel,
    });

    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    console.log("Fetching profile for user ID:", req.user._id); // Add this line
    const profile = await Profile.findOne({ user: req.user._id }).populate(
      "user",
      "name email"
    );
    if (!profile) {
      console.log("Profile not found for user ID:", req.user._id); // Add this line
      return res.status(404).json({ message: "Profile not found" });
    }
    console.log("Profile found:", profile); // Add this line
    res.json(profile);
  } catch (error) {
    console.error("Server error:", error); // Add this line
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update", protect, async (req, res) => {
  const {
    name,
    tandemID,
    dob,
    location,
    about,
    partnerPreference,
    learningGoals,
    nativeLanguage,
    fluentLanguage,
    learningLanguage,
    translateLanguage,
    communication,
    timeCommitment,
    learningSchedule,
    correctionPreference,
    topics,
    showLocation,
    showTandemID,
    notifications,
  } = req.body;

  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update profile fields
    profile.name = name ?? profile.name;
    profile.tandemID = tandemID ?? profile.tandemID;
    profile.dateOfBirth = dob ?? profile.dateOfBirth;
    profile.location = location ?? profile.location;
    profile.about = about ?? profile.about;
    profile.partnerPreference = partnerPreference ?? profile.partnerPreference;
    profile.learningGoals = learningGoals ?? profile.learningGoals;
    profile.nativeLanguage = nativeLanguage ?? profile.nativeLanguage;
    profile.fluentLanguage = fluentLanguage ?? profile.fluentLanguage;
    profile.learningLanguage = learningLanguage ?? profile.learningLanguage;
    profile.translateLanguage = translateLanguage ?? profile.translateLanguage;
    profile.communication = communication ?? profile.communication;
    profile.timeCommitment = timeCommitment ?? profile.timeCommitment;
    profile.learningSchedule = learningSchedule ?? profile.learningSchedule;
    profile.correctionPreference =
      correctionPreference ?? profile.correctionPreference;
    profile.topics = topics ?? profile.topics;
    profile.showLocation =
      showLocation !== undefined ? showLocation : profile.showLocation;
    profile.showTandemID =
      showTandemID !== undefined ? showTandemID : profile.showTandemID;
    profile.notificationsEnabled =
      notifications !== undefined
        ? notifications
        : profile.notificationsEnabled;

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// @route   POST /api/profile/follow/:id
// @desc    Follow a user
// @access  Private
router.post("/follow/:id", protect, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUserProfile = await Profile.findOne({ user: req.user._id });
    if (currentUserProfile.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    currentUserProfile.following.push(userToFollow._id);
    await currentUserProfile.save();
    res.json({ message: "Followed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/profile/unfollow/:id
// @desc    Unfollow a user
// @access  Private
router.post("/unfollow/:id", protect, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUserProfile = await Profile.findOne({ user: req.user._id });
    if (!currentUserProfile.following.includes(userToUnfollow._id)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    currentUserProfile.following.pull(userToUnfollow._id);
    await currentUserProfile.save();
    res.json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/profile/block/:id
// @desc    Block a user
// @access  Private
router.post("/block/:id", protect, async (req, res) => {
  try {
    const userToBlock = await User.findById(req.params.id);
    if (!userToBlock) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUserProfile = await Profile.findOne({ user: req.user._id });
    if (currentUserProfile.blocked.includes(userToBlock._id)) {
      return res.status(400).json({ message: "Already blocked this user" });
    }

    currentUserProfile.blocked.push(userToBlock._id);
    await currentUserProfile.save();
    res.json({ message: "Blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/profile/unblock/:id
// @desc    Unblock a user
// @access  Private
router.post("/unblock/:id", protect, async (req, res) => {
  try {
    const userToUnblock = await User.findById(req.params.id);
    if (!userToUnblock) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUserProfile = await Profile.findOne({ user: req.user._id });
    if (!currentUserProfile.blocked.includes(userToUnblock._id)) {
      return res.status(400).json({ message: "User not blocked" });
    }

    currentUserProfile.blocked.pull(userToUnblock._id);
    await currentUserProfile.save();
    res.json({ message: "Unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/profile/enable-notifications
// @desc    Enable notifications
// @access  Private
router.post("/enable-notifications", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.notificationsEnabled = true;
    await profile.save();
    res.json({ message: "Notifications enabled" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/profile/disable-notifications
// @desc    Disable notifications
// @access  Private
router.post("/disable-notifications", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.notificationsEnabled = false;
    await profile.save();
    res.json({ message: "Notifications disabled" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/upload-picture", protect, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const profile = await Profile.findOne({ user: req.user._id });
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      profile.profilePicture = `/uploads/profilePictures/${req.file.filename}`;
      await profile.save();

      res.json({ message: "Profile picture uploaded successfully", profile });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
});

module.exports = router;
