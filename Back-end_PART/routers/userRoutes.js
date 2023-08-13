const { Router } = require("express");
const router = Router();
const {
  newUser,
  loginUser,
  allUsers,
  userDetails,
  updateUserPersonalDetails,
} = require("../controller/userController");
const { upload } = require("../utils/UploadImages");
const { verifyToken } = require("../utils/authVerify");
const { addNewFriend } = require("../controller/friendshipController");
const {
  SaveDetails,
  getUserDetails,
  checkDetails,
  updateDetails
} = require("../controller/addionalDetailsController");

router.post("/sign_up", newUser);
router.post("/login", loginUser);
router.get("/get-user/:userId", verifyToken, userDetails);
router.post("/save-details/:userId", verifyToken, SaveDetails);
router.put("/update-user/:userId",verifyToken,updateUserPersonalDetails );
router.get("/get-user-datails/:userId", verifyToken, getUserDetails);
router.get("/check-details/:userId", verifyToken, checkDetails);
router.put("/update-details/:userId",verifyToken ,updateDetails);
router.get("/users-friends", verifyToken, allUsers);
router.get("/:friendId/add-friend", verifyToken, addNewFriend);


module.exports = router;
