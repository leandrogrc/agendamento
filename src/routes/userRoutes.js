const router = require("express").Router();
const {
  updateMyEmail,
  updateMyPass,
} = require("../controllers/userController");

router.route("/email").put(updateMyEmail);
router.route("/password").put(updateMyPass);

module.exports = router;
