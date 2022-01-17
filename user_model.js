const mongoose = require('mongoose');

const entryBench = new mongoose.Schema({
    lat: Number,
    long: Number,
    beschreibung: String,
    nickname: String,
});

module.exports = mongoose.model('dbBench', entryBench);

