const { model, Schema } = require("mongoose");

const friendshipSchema = new Schema(
  {
    // who sent request
    from_user: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
    },
    // Who Accept the Request
    to_user: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
    },
  },
  {
    timestamps: true,
  }
);

const friendship = model("Friendship", friendshipSchema);

module.exports = friendship;
