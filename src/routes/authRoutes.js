const router = require("express").Router();
const { loginUser, registerUser } = require("../controllers/authController");

router.route("/registrar").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;
