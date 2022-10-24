const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    username: String,
    city: String,
    password: String
}, {versionKey: false})

const stickerSchema = new mongoose.Schema({
    number: Number,
    image: String
}, {versionKey: false})

const stickerPersonSchema = new mongoose.Schema({
    username: String,
    fidSticker: String,
    option: String
}, {versionKey: false})

Person = mongoose.model('person', personSchema);
Sticker = mongoose.model('stickers', stickerSchema);
StickerPerson = mongoose.model('stickersPerson', stickerPersonSchema);

module.exports = {Person, Sticker, StickerPerson}
