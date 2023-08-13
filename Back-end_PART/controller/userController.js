const UserModel = require("../models/userModel");
const Friendship = require("../models/userFriends");
const bcrypt = require("bcrypt");
const { generateJwtToken } = require("../utils/generateToken");

const newUser = async (req, res) => {
  const { name, email, phoneNumber, password, confirmPassword ,profile_picture } = req.body;

  const emailRegex =
    /^([a-zA-z0-9._-]+)@(gmail|yahoo|hotmail|zohomail|hcl|live|outlook)\.(com)$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  const phoneRegex = /^\d{10}$/;

  if (!name) {
    return res.json({
      success: false,
      message: "Enter Valid Name.",
    });
  }
  if (!email && !emailRegex.test(email)) {
    return res.json({
      success: false,
      message: "Enter Valid Email Please.",
    });
  }
  if (!phoneRegex.test(phoneNumber)) {
    return res.json({
      success: false,
      message: "Invalid phone number format.",
    });
  }

  if (!passwordRegex.test(password)) {
    return res.json({
      success: false,
      message: "Enter Valid Password with special charector and min 6 digit",
    });
  }
  if (password !== confirmPassword) {
    return res.json({
      success: false,
      message: "Confirm Password and Password not matched !",
    });
  }

  //   securing password
  const hashedPassword = await bcrypt.hash(password, 10);
  //   email valid
  const validEmail = email.toLowerCase();
  // Format the phone number with the country code before saving
  const formattedPhoneNumber = "+91" + phoneNumber;
  try {
    const user = await UserModel.findOne({ email: validEmail });
    if (user) {
      return res.json({
        success: false,
        message: "User Already with this email , create with new . ",
      });
    }
    const newUserData = {
      name: name,
      email: validEmail,
      phoneNumber: formattedPhoneNumber,
      password: hashedPassword,
      profile_picture:profile_picture,
    };

    const newUser = await new UserModel(newUserData);
    await newUser.save();
   
 
    await newUser.save();
    return res.json({
      success: true,
      message: "Account Created successfully .",
      newUser:newUser
    });
  } catch (error) {
    console.log("ERRO IN SIGN UP",error)
    return res.json({
      success: false,
      message: "Internal Server Error !",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "All fields required *",
    });
  }
  const validEmail = email.toLowerCase();
  try {
    const user = await UserModel.findOne({ email: validEmail });
    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found with this email . ",
      });
    }
    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.json({
        status: false,
        message: "Incorrect Password Try Again !",
      });
    }
    const token = await generateJwtToken(user._id, user.name, user.email);
    return res.json({
      success: true,
      message: "Logged in successfull",
      token: token,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error !",
    });
  }
};

const allUsers = async (req, res) => {
  try {
    const loggedUserId = req.query.loggedUserId;
    const users = await UserModel.find({});
    let friends = new Array();
    if (loggedUserId) {
      let all_Friendships = await Friendship.find({
        $or: [{ from_user: loggedUserId }, { to_user: loggedUserId }],
      })
        .populate("from_user")
        .populate("to_user");

      // Stroring in array to show faster in front end
      for (let friend of all_Friendships) {
        if (friend.from_user._id.toString() == loggedUserId.toString()) {
          friends.push({
            friend_name: friend.to_user.name,
            friend_id: friend.to_user._id,
            friend_profile: friend.to_user.profile_picture,
          });
        } else if (friend.to_user._id.toString() == loggedUserId.toString()) {
          friends.push({
            friend_name: friend.from_user.name,
            friend_id: friend.from_user._id,
            friend_profile: friend.from_user.profile_picture,
          });
        }
      }
    }
    return res.json({
      success: true,
      message: "All users",
      users: users,
      friends: friends,
    });
  } catch (error) {
    console.log("Eror in user fetch", error);
    return res.json({
      success: false,
      message: "Internal Server Error !",
    });
  }
};    
const userDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const userDetails = await UserModel.findById(userId);
    if (!userDetails) {
      return res.json({
        message: "User Not Found !",
        success: false,
      });
    }
    userDetails.password = undefined;
    return res.json({
      success: true,
      message: "User Details ",
      userDetails: userDetails,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error !",
    });
  }
};
const updateUserPersonalDetails = async (req, res) => {
  const { name, email, phoneNumber, profile_picture } = req.body;
  const emailRegex = /^([a-zA-Z0-9._-]+)@(gmail|yahoo|hotmail|zohomail|hcl|live|outlook)\.(com)$/;
  const phoneRegex = /^\d{10}$/;

  if (!name) {
    return res.json({
      success: false,
      message: "Enter Valid Name.",
    });
  }
  if (!email || !emailRegex.test(email)) {
    return res.json({
      success: false,
      message: "Enter Valid Email Please.",
    });
  }
  if (!phoneRegex.test(phoneNumber)) {
    return res.json({
      success: false,
      message: "Invalid phone number format.",
    });
  }

  const { userId } = req.params;
  const validEmail = email.toLowerCase();
  const formattedPhoneNumber = "+91" + phoneNumber;

  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        name:name,
        email: validEmail,
        phoneNumber: formattedPhoneNumber,
        profile_picture:profile_picture, 
      },
      { new: true } // This option returns the updated document
    );

    if (!updateUser) {
      return res.json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "User details updated successfully.",
      updateUser: updateUser,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};


module.exports = {
  newUser: newUser,
  loginUser: loginUser,
  allUsers: allUsers,
  userDetails: userDetails,
   updateUserPersonalDetails: updateUserPersonalDetails,
};
