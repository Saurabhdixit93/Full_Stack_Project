const { Router } = require("express");
const router = Router();
const UserRoutes = require("./userRoutes");

router.use("/user", UserRoutes);
module.exports = router;
