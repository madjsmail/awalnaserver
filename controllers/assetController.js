const bcrypt = require("bcryptjs");

const { v4: uuidv4 } = require('uuid');

const deleteAssetHelper = require("./helpers/deleteAsset");
const createAssetHelper = require("./helpers/createAsset");
const getAllAssetHelper = require("./helpers/getAllAssets");
const getOneAssetHelper = require("./helpers/getOneAsset");

exports.deleteAsset = async (req, res, next) => {
  try {
    deleteAssetHelper.deleteAsset(req.params.patientID);
    res.json({
      msg: "asset deleted",
    });
  } catch (error) {
    res.json({
      msg: "error invoking chain code delete method",
    });
    process.exit(1);
  }
};

exports.postAsset = async (req, res, next) => {
  /***
   *  submitTransaction to the createAssets in chain code
   *  args : patient ID and information  in string
   *  ! need to use JSON.stringify
   *
   */
  console.log(req.body);

  const patientID = uuidv4();
  createAssetHelper
    .createAsset(req.body, patientID)
    .then(() => {
      res.json({
        msg: "Transaction has been submitted",
      });
    })
    .catch((err) => {
      res.json({
        msg: "Failed to submit transaction",
        err: err,
      });
      process.exit(1);
    });
};

exports.getallAssets = async (req, res, next) => {
  getAllAssetHelper.getallAssets().then((data) => {
    res.json({
      data: JSON.parse(data),
    });
  });
};

exports.getOneAssets = async (req, res, next) => {
  getOneAssetHelper
    .getOneAssets(req.params.patientID)
    .then((data) => {
      res.json({
        msg: JSON.parse(data),
      });
    })
    .catch((err) => {
      res.json({
        msg: "error invoking chain code",
      });
    });
};

exports.updateAsset = async (req, res, next) => { };
