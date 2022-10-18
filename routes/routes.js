const {Person, Sticker, StickerPerson} = require('../models/model');
const express = require('express');
const router = express.Router();

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = router;

router.post('/postPerson', jsonParser, async (req, res)=>{
    const data = new Person({
       name: req.body.name,
       city: req.body.city,
       password: req.body.password
    })
    try{
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }catch(error){
        res.status(400).json({message: error.message})
    }
})
router.get('/getAllPerson', async (req, res)=>{
    try{
        const data = await Person.find();
        res.json(data);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/getOnePerson', async (req, res)=>{
    try{
        const data = await Person.findById(req.header('id'));
        res.json([data.name, data.city]);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.patch('/updatePerson', jsonParser, async (req, res)=>{
    try{
        const id = req.header('id');
        const updatedData = req.body;
        const options = {new : true};
        const result = await Person.findByIdAndUpdate(
            id, updatedData, options
        )
        res.send([result.name, result.city])
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})
router.delete('/deletePerson', async (req, res)=>{
    try{
        const id = req.header('id');
        const data = await Person.findByIdAndDelete(id);
        res.send(`Document with ${data.name} has been deleted`);
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

router.post('/postSticker', jsonParser, async (req, res)=>{
    const data = new Sticker({
       number: req.body.number,
       image: req.body.image
    })
    try{
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }catch(error){
        res.status(400).json({message: error.message})
    }
})
router.get('/getAllSticker', async (req, res)=>{
    try{
        const data = await Sticker.find();
        res.json(data);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/getOneSticker', async (req, res)=>{
    try{
        const data = await Sticker.findById(req.header('id'));
        res.json(data);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.patch('/updateSticker', jsonParser, async (req, res)=>{
    try{
        const id = req.header('id');
        const updatedData = req.body;
        const options = {new : true};
        const result = await Sticker.findByIdAndUpdate(
            id, updatedData, options
        )
        res.send(result)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})
router.delete('/deleteSticker', async (req, res)=>{
    try{
        const id = req.header('id');
        const data = await Sticker.findByIdAndDelete(id);
        res.send(`Sticker number ${data.number} has been deleted`);
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

router.post('/postStickerPerson', jsonParser, async (req, res)=>{
    const data = new StickerPerson({
        fidPerson: req.body.fidPerson,
        fidSticker: req.body.fidSticker,
        option: req.body.option
    })
    try{
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }catch(error){
        res.status(400).json({message: error.message})
    }
})
router.get('/getAllStickerPerson', async (req, res)=>{
    try{
        const data = await StickerPerson.find();
        res.json(data);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.delete('/deleteStickerPerson', async (req, res)=>{
    try{
        const id = req.header('id');
        const data = await StickerPerson.findByIdAndDelete(id);
        res.send(`Relation ${data.id} has been deleted`);
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

