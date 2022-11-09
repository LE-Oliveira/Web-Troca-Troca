const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    username:{type: String, required: true},
    mail: {type: String, required: true},
    city: {type: String, required: true},
    password: {type: String, required: true}
}, {versionKey: false})

const stickerSchema = new mongoose.Schema({
    number: Number,
    image: String
}, {versionKey: false})

const stickerPersonSchema = new mongoose.Schema({
    username: {type: String, required: true},
    fidSticker: {type: Number, required: true},
    option: {type: String, required: true}
}, {versionKey: false})

Person = mongoose.model('person', personSchema);
Sticker = mongoose.model('stickers', stickerSchema);
StickerPerson = mongoose.model('stickersPerson', stickerPersonSchema);

module.exports = {Person, Sticker, StickerPerson}
