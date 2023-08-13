const { Schema, model } = require("mongoose");
const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: Number,
      require: true,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "Friendship",
      },
    ],
    additionalDetails: [
    {
      type: Schema.Types.ObjectId,
      ref: "AdditionalModel", 
    },
  ],
    profile_picture: {
      type: String,
    },
  },
  { timestamps: true }
);


const userModel = model("UserModel", userSchema);

module.exports = userModel;
