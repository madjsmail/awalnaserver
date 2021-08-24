const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WordSchema = new Schema({
  word: {
    type: String,
    required: true
  },

  synonyms: {
    type: String,
    required: false
  },
  Origin: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "pending",
    required: true
  },
  AddBy: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Word", WordSchema);