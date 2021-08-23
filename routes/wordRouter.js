const express = require("express");
const router = express.Router();
const wordController = require("../controllers/wordController");
const isAuth = require("../middleware/isAuth");

router.get("/", wordController.getallWords);
router.post("/", /*isAuth.requireAuth, */wordController.postWord);
router.delete("/:id",/*isAuth.isAdmin, */wordController.deleteWord);
router.put("/aprove/:id",/* isAuth.isAdmin,*/ wordController.updateWord);


module.exports = router;