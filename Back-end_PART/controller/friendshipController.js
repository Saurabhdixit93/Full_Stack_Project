const UserModel = require("../models/userModel");
const Friendship = require("../models/userFriends");

const addNewFriend = async (req, res) => {
  let from_id = req.query.loggedUserId;
  let to_id = req.params.friendId;
  try {
    // find friendship
    let existing_Friendship = await Friendship.findOne({
      $or: [
        { from_user: from_id, to_user: to_id },
        { from_user: to_id, to_user: from_id },
      ],
    });

    // if already friendship
    if (existing_Friendship) {
      // Updating user in database
      let user1 = await UserModel.findByIdAndUpdate(from_id, {
        $pull: { friendships: existing_Friendship._id },
      });
      user1.save();
      let user2 = await UserModel.findByIdAndUpdate(to_id, {
        $pull: { friendships: existing_Friendship._id },
      });
      user2.save();
      // Updating Friendships in DATABASE
      let deleted = await Friendship.deleteOne({
        $or: [
          { from_user: from_id, to_user: to_id },
          { from_user: to_id, to_user: from_id },
        ],
      });
      return res.json({
        message: "Connection Removed",
        success: true,
        isFriend: false,
      });
    } else {
      // updating in database
      let new_friendships = await Friendship.create({
        from_user: from_id,
        to_user: to_id,
      });
      new_friendships.save();
      // updating in user database friendship
      let data = await UserModel.findByIdAndUpdate(from_id, {
        $push: { friendships: new_friendships._id },
      });
      // updating in user database friendship
      let data2 = UserModel.findByIdAndUpdate(to_id, {
        $push: { friendships: new_friendships._id },
      });
      return res.json({
        message: "Connection Added",
        success: true,
        isFriend: true,
      });
    }
  } catch (err) {
     console.log("Error In Add friend",err);
    return res.json({
      message: "Internal Server Error !",
      success: false,
    });
  }
};

module.exports = {
  addNewFriend: addNewFriend,
};
