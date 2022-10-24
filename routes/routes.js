const {Person, Sticker, StickerPerson} = require('../models/model');
const express = require('express');
const router = express.Router();
const utils = require('./utils');

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = router;

router.post('/register', jsonParser, async (req, res)=>{
    try{
        const name = req.body.username;
        const data = await Person.aggregate([{$match:{username: name}}]);
        console.log(data);
        if(data.length == 0){
            const user = new Person({
                username: name,
                city: req.body.city.normalize("NFD"),
                password: req.body.password
                });
            const dataToSave = await user.save();
            for(var i=0;i<447;i++){
                var figs = new StickerPerson({
                    username: name,
                    fidSticker: i+1,
                    option: "need"
                })
                const dataToSave = await figs.save();
            }
            res.status(200).json(dataToSave);
        }
        else{
            res.status(406).json("Usuário já cadastrado. Por favor, insira outro nome");
        }
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
        const data = await Person.aggregate([{$match:{username: req.header('username')}}]);
        res.json([data[0].username, data[0].city]);
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
        const c = await StickerPerson.deleteMany({username: data.username});
        res.send(`Usuário ${data.username} foi deletado com as relações ${c}`);
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})
router.post('/login', jsonParser, async (req, res)=>{
    try{
        const data = await Person.aggregate([{$match:{name: req.body.name}}]);
        if(data[0].password == req.body.password){
            res.status(202).json("Seja bem-vinde");
        }
        else{
            res.status(401).json("Senha incorreta");
        }
    }
    catch(error){
        res.status(500),json({message: error.message});
    }
})

router.post('/createSticker', jsonParser, async (req, res)=>{
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

router.get('/getAllStickerOnePerson', async(req,res)=>{
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
router.post('/postStickerPerson', jsonParser, async (req, res)=>{
    const idP = req.body.username;
    const opt = req.body.option;
    const idS = req.body.fidSticker;
    try{
        const user = await Person.aggregate([{$match:{username: idP}}]);
        if(user[0] == undefined) res.status(400).json("Usuário inexistente");
        else if(!["need", "give", "have"].includes(opt)) res.status(400).json("Opção incompatível");
        else{
            for(var i=0; i<idS.length; i++){
                if(idS[i]>=0&&idS[i]<=447){
                    var data = new StickerPerson({
                        username: idP,
                        fidSticker: idS[i],
                        option: opt
                    })
                    const dataToSave = await data.save();
                }
            }
            res.status(200).json("All relations saved");
        }
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

router.post('/match', jsonParser, async (req,res)=>{
    try{
        const name = req.header('username');
        const city = req.header("city");
        const data = await utils.AllRelationsOnePerson(name);//recebe [give,need]
        const giveCandidates = await utils.AllRelationsOneOption(data[0], name, city);
        const needCandidates = await utils.AllRelationsOneOption(data[1], name, city);
        console.log(giveCandidates);
        var match = [];
        for(var i=0; i<giveCandidates.length;i++){
            for(var j=0;j<needCandidates.length;j++){
                var aux = "Você dá a figurinha "+ needCandidates[j][1] + " e recebe a figurinha " + giveCandidates[i][1] + " do " + giveCandidates[i][0];
                if(giveCandidates[i].username==needCandidates[j].username&&!match.includes(aux)){
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