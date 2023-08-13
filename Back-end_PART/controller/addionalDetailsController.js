const AdditionalModel = require("../models/additionalModel");
const mongoose = require("mongoose");

const SaveDetails = async (req, res) => {
  const { about, skills, experiences, education } = req.body;
  const { userId } = req.params;
  
  // Validate data here
  if (!about || !skills || !experiences || !education) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }
  try {
    const additionalDetails = new AdditionalModel({
      user: userId,
      about,
      skills,
      experiences,
      education,
    });
    if (!additionalDetails) {
      return res.json({
        message: "Failed to save details",
        success: false,
      });
    }
    await additionalDetails.save();
    return res.json({
      message: "Details Saved successfully .",
      success: true,
      additionalDetails,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error !",
    });
  }
};
const getUserDetails = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.json({
      message: "Invalid user ID format",
      success: false,
    });
  }
  try {
    const details = await AdditionalModel.find({ user: userId });
   
    if (!details) {
      return res.json({
        message: "Details not found!",
        success: false,
      });
    }
    return res.json({
      message: "User details found",
      success: true,
      details: details,
    });
  } catch (error) {
    console.log("Error to get userdetaails",error);
     return res.json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};
// check details already
const checkDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const existingDetails = await AdditionalModel.findOne({ user: userId });
    if (existingDetails) {
      return res.json({
        hasDetails: true,
        details: existingDetails,
      });
    } else {
      return res.json({
        hasDetails: false,
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Error checking details ,Internaal Server Error !",
    });
  }
};

const updateDetails = async (req, res) => {
  const { userId } = req.params;
  const { about, skills, experiences, education } = req.body;

  try {
    // Validate data here
    if (!about || !skills || !experiences || !education) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const existingDetails = await AdditionalModel.findOne({ user: userId });

    if (!existingDetails) {
      return res.json({
        success: false,
        message: "Details not found",
      });
    }

    existingDetails.about = about;
    existingDetails.skills = skills;
    existingDetails.experiences = experiences;
    existingDetails.education = education;

    const updatedDetails = await existingDetails.save();

    return res.json({
      success: true,
      message: "Details updated successfully",
      updatedDetails,
    });
  } catch (error) {
    console.error("Error updating details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  SaveDetails: SaveDetails,
  getUserDetails: getUserDetails,
  checkDetails: checkDetails,
   updateDetails: updateDetails,
};
