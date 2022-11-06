const {Person, Sticker, StickerPerson} = require('../models/model');
const express = require('express');
const router = express.Router();
const utils = require('../utils');

var bodyParser = require("body-parser");
const { UpdateRelations } = require('../utils');
var jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({extended: false});

var getAllPesron = router.get('/getAllPerson', async (res)=>{
    try{
        const data = await Person.find();
        res.json(data);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
const getOnePerson = router.get('/getOnePerson', async (req, res)=>{
    try{
        const data = await Person.aggregate([{$match:{username: req.header('username')}}]);
        res.json([data[0].username, data[0].city]);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
const updatePerson = router.patch('/updatePerson', jsonParser, async (req, res)=>{
    try{
        const id = req.header('id');
        const updatedData = req.body;
        const options = {new : true};
        const result = await Person.findByIdAndUpdate(
            id, updatedData, options
        )
        res.send([result.username, result.city])
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})
const deletePerson = router.delete('/deletePerson', async (req, res)=>{
    try{
        const id = req.header('id');
        const data = await Person.findByIdAndDelete(id);
        const c = await StickerPerson.deleteMany({username: data.username});
        res.send(`Usuário ${data.username} foi deletado com as relações ${c}`);
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})
const login = router.post('/login', jsonParser, async (req, res)=>{
    try{
        const data = await Person.aggregate([{$match:{username: req.body.name}}]);
        if(data.length == 0) res.status(404).json("Usuário não cadastrado");
        else if(data[0].password == req.body.password) res.status(202).json("Seja bem-vinde");
        else res.status(401).json("Senha incorreta");
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
})
const register = router.post('/register', jsonParser, async (req, res)=>{
    try{
        const name = req.body.username;
        const data = await Person.aggregate([{$match:{username: name}}]);
        if(data.length == 0){
            const user = new Person({
                username: name,
                city: req.body.city.normalize("NFD"),
                password: req.body.password
                });
            const dataToSave = await user.save();
            var docs = [];
            for(var i=0;i<447;i++){
                docs.push(new StickerPerson({
                    username: name,
                    fidSticker: i+1,
                    option: "need"
                }));
            }
            const a = await StickerPerson.insertMany(docs);
            res.status(200).json(dataToSave);
        }
        else{
            res.status(406).json("Usuário já cadastrado. Por favor, insira outro nome");
        }
    }catch(error){
        res.status(400).json({message: error.message})
    }
})

const createSticker = router.post('/createSticker', jsonParser, async (req, res)=>{
    try{
        const num = req.body.number;
        const data = await Sticker.aggregate([{$match:{number: num}}]);
        if(data ==0){
            const sticker = new Sticker({
                number: req.body.number,
                image: req.body.image
            })
            const dataToSave = await sticker.save();
            res.status(200).json(dataToSave);
        }
        else{
            res.status(406).json("Figurinha já cadastrada");
        }    
    }catch(error){
        res.status(400).json({message: error.message})
    }
    
})
const getAllSticker = router.get('/getAllSticker', async (req, res)=>{
    try{
        const data = await Sticker.find();
        res.json(data);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
const getOneSticker = router.get('/getOneSticker', async (req, res)=>{
    try{
        const data = await Sticker.findById(req.header('id'));
        res.json(data);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
const updateSticker = router.patch('/updateSticker', jsonParser, async (req, res)=>{
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
const deleteSticker = router.delete('/deleteSticker', async (req, res)=>{
    try{
        const id = req.header('id');
        const data = await Sticker.findByIdAndDelete(id);
        res.send(`Sticker number ${data.number} has been deleted`);
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

const getAllStickerOnePerson = router.get('/getAllStickerOnePerson', async(req,res)=>{
    try{
        const ret = await utils.AllRelationsOnePerson(req.header('username'));
        if(ret.length==2){
            res.status(200).send(ret);
        }
        else{
            res.status(400).ret;
        }
    }catch(error){
        res.status(400).json({message: error.message});
    }
})
const updateStickerPerson = router.patch('/updateStickerPerson', jsonParser, async (req, res)=>{
    const idP = req.body.username;
    const opt = req.body.option;
    const idS = req.body.fidSticker;
    const ret = await utils.UpdateRelations(idP, idS, opt);
    if(ret.includes("Relação")){
        res.status(200).json(ret);
    }
    else{
        res.status(400).json(ret);
    }
})
const getAllStickerPerson = router.get('/getAllStickerPerson', async (req, res)=>{
    try{
        const data = await StickerPerson.find();
        res.json(data);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
const deleteStickerPerson = router.delete('/deleteStickerPerson', async (req, res)=>{
    try{
        const id = req.header('id');
        const data = await StickerPerson.findByIdAndDelete(id);
        res.send(`Relation ${data.id} has been deleted`);
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

const match = router.get('/match', jsonParser, async (req,res)=>{
    try{
        const name = req.header('username');
        const city = req.header("city");
        const data = await utils.AllRelationsOnePerson(name);//recebe [give,need]
        const giveCandidates = await utils.AllRelationsOneOption(data[0], name, city, "need");
        const needCandidates = await utils.AllRelationsOneOption(data[1], name, city, "give");
        var match = [];
        for(var i=0; i<needCandidates.length;i++){
            for(var j=0;j<giveCandidates.length;j++){
                var aux = `Você dá a figurinha ${giveCandidates[j][1]} e recebe a figurinha ${needCandidates[i][1]} do ${needCandidates[i][0]}`;
                if(needCandidates[i][0]==giveCandidates[j][0]&&!match.includes(aux)){
                    match.push(aux);
                }
            }
        }
        if(match.length==0) match.push("Infelizmente não encontramos ninguém no nosso banco de dados que possa dar match com você")
        res.status(200).json(match);
    }catch(error){
        res.status(400).json({message: error.message});
    }
})
const matched = router.patch('/matched', jsonParser, async (req,res)=>{
    try{
        const users = req.body.users;
        for(i=0;i<2;i++){
            await UpdateRelations(users[i][0], users[1-i][1], "have");
            var toDelete = await StickerPerson.find({username: users[i][0], fidSticker:users[i][1], option:"give"});
            console.log(toDelete);
            var data = await StickerPerson.findByIdAndDelete(toDelete[0].id);
        }
        res.status(200).json("MATCHED");
    } catch(error){
        res.status(400).json({error: error});
    }
})

module.exports = {
    getAllPesron, 
    getOnePerson, 
    updatePerson,
    deletePerson,
    login,
    register,
    createSticker,
    getAllSticker,
    getOneSticker,
    updateSticker,
    deleteSticker,
    getAllStickerOnePerson,
    updateStickerPerson,
    getAllStickerPerson,
    deleteStickerPerson,
    match,
    matched
};