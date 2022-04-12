const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");
const isAuth = require("../middleware/isAuth");





router.get("/", assetController.getallAssets);
router.get("/:patientID", assetController.getOneAssets);

router.post("/", assetController.postAsset);
router.delete("/:patientID", assetController.deleteAsset);
// router.put("/aprove/:id", isAuth.isAdmin, assetController.updateassets);





// router.put("/aprove/:id", isAuth.isAdmin, assetController.updateassets);


module.exports = router;