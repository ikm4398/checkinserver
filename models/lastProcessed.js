const mongoose = require("mongoose");

const lastProcessedSchema = new mongoose.Schema({
  lastProcessedId: { type: mongoose.Schema.Types.ObjectId, default: null },
});

const LastProcessed = mongoose.model("LastProcessed", lastProcessedSchema);

module.exports = LastProcessed;
