const bcrypt = require("bcryptjs");
const wordModel = require("../models/wordModel");
const jwt = require("jsonwebtoken");





exports.deleteWord = async (req, res, next) => {


    await wordModel.findOneAndDelete({
        _id: req.params.id
    }, (err) => {
        if (!err) {
            res.json({
                msg: "word deleted"
            });
        } else {
            console.log("Error removing :" + err);
        }
    });

};

exports.postWord = async (req, res, next) => {
    const {
        word,
        synonyms,
        Origin,
        description,
        AddBy
    } = req.body;


    try {
        const newWord = new wordModel({
            word: word,
            synonyms: synonyms,
            Origin: Origin,
            description: description,
            AddBy: AddBy
        });
        const result = await newWord.save();
        res.status(200).json({
            word: result
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};

exports.getallWords = async (req, res, next) => {

    const words = await wordModel.find({}).exec()

    res.send(words)
};

exports.updateWord = async (req, res, next) => {

    let doc = await wordModel.findOneAndUpdate({
        _id: req.params.id
    }, {
        status: req.body.status,
    }).then((doc) => {
        res.send(doc)
    })
};