const {Person, Sticker, StickerPerson} = require('../models/model');
const express = require('express');
const router = express.Router();
const utils = require('../utils');
const ObjectId = require('mongodb').ObjectId;

var getPeople = router.get('/getAllPerson', async (req, res)=>{
    try{
        const data = await Person.find({username: "a"});
        console.log(data[0].mail);
        return res.json(data);
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
})
var getPerson = router.get('/getOnePerson', async (req, res)=>{
    try{
        const data = await Person.aggregate([{$match:{username: req.header('username')}}]);
        return res.json([data[0].username, data[0].city]);
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
})
var updatePerson = router.patch('/updatePerson', async (req, res)=>{
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
        return res.status(400).json({message: error.message})
    }
})
var deletePerson = router.delete('/deletePerson', async (req, res)=>{
    try{
        const id = req.header('id');
        const data = await Person.findById(id);
        const c = await StickerPerson.deleteMany({username: data.username});
        if(c){const ret = await Person.findByIdAndDelete(id);}
        res.send(`Usuário ${data.username} foi deletado com as relações ${c}`);
    }
    catch(error){
        return res.status(400).json({message: error.message})
    }
})
var login = router.post('/login', async (req, res)=>{
    try{
        const data = await Person.aggregate([{$match:{username: req.body.name}}]);
        if(data.length == 0) return  res.status(404).json("Usuário não cadastrado");
        else if(data[0].password == req.body.password){
            var user = [data[0].username, data[0].city, data[0].mail];
            return  res.status(202).json(user);
        }
        else return  res.status(401).json("Senha incorreta");
    }
    catch(error){
        return  res.status(500).json({message: error.message});
    }
})
var register = router.post('/register', async (req, res)=>{
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
            return res.status(200).json({data: [dataToSave, a]});
        }
        else{
            return res.status(406).json("Usuário já cadastrado. Por favor, insira outro nome");
        }
    }catch(error){
        return res.status(400).json({message: error.message})
    }
})

var createSticker = router.post('/createSticker', async (req, res)=>{
    try{
        const num = req.body.number;
        const data = await Sticker.aggregate([{$match:{number: num}}]);
        if(data ==0){
            const sticker = new Sticker({
                number: req.body.number,
                image: req.body.image
            })
            const dataToSave = await sticker.save();
            return res.status(200).json(dataToSave);
        }
        else{
            return res.status(406).json("Figurinha já cadastrada");
        }    
    }catch(error){
        return res.status(400).json({message: error.message})
    }
    
})
var getStickers = router.get('/getAllSticker', async (req, res)=>{
    try{
        const data = await Sticker.find();
        res.json(data);
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
})
var getSicker = router.get('/getOneSticker', async (req, res)=>{
    try{
        const data = await Sticker.findById(req.header('id'));
        res.json(data);
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
})
var updateSticker = router.patch('/updateSticker', async (req, res)=>{
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
        return res.status(400).json({message: error.message})
    }
})
var deleteSticker = router.delete('/deleteSticker', async (req, res)=>{
    try{
        const id = req.header('id');
        const data = await Sticker.findByIdAndDelete(id);
        res.send(`Sticker number ${data.number} has been deleted`);
    }
    catch(error){
        return res.status(400).json({message: error.message})
    }
})

var album = router.get('/album', async(req,res)=>{
    try{
        const album = await utils.album(req.headers.username, req.headers.opt);
        if(album.length==0){
            return res.status(200).json({fig: [], message: "Vazio"});
        }
        else{
            return res.status(200).send({fig: album, message: "Tem figurinha"});
        }
    }catch(error){
        return res.status(400).json({message: error.message});
    }
})
var createStickerPerson = router.post('/createStickerPerson', async(req,res)=>{
    try{
        const name = req.body.username;
        const fid = req.body.fidSticker;
        if(fid>447||fid<1){return res.status(406).json({message: "Id Inexistente"});}
        const data = await StickerPerson.aggregate([{$match:{username: name, fidSticker: fid}}])
        console.log(req.body);
        if(data.length==0){return res.status(404).json({message: "Algo de errad onão está certo"})};
        if(data.length==1&&data[0].option=="need"){
            const ret = await StickerPerson.findOneAndUpdate(data[0]._id, {username: name, fidSticker: fid, option: "have"});
            return res.status(200).json("Agora tem");
        }
        else{
            const relation = new StickerPerson({
                fidSticker: fid,
                username: name,
                option: "give"
            });
            const dataToSave = await relation.save();
            return res.status(200).json({message: "Repetida", data: dataToSave});
        }
    }catch(error){
        console.log(error);
        return res.status(400).json(error);
    }
})
var updateSticekrPerson = router.patch('/updateStickerPerson', async (req, res)=>{
    const idP = req.body.username;
    const opt = req.body.option;
    const idS = req.body.fidSticker;
    const ret = await utils.UpdateRelations(idP, idS, opt);
    if(ret.includes("Relação")){
        return res.status(200).json(ret);
    }
    else{
        return res.status(400).json(ret);
    }
})
var getAllSticerPeson = router.get('/getAllStickerPerson', async (req, res)=>{
    try{
        const data = await StickerPerson.find();
        res.json(data);
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
})
var deleteSticekrPerson = router.delete('/deleteStickerPerson', async (req, res)=>{
    try{
        const id = req.header('id');
        const data = await StickerPerson.findByIdAndDelete(id);
        res.send(`Relation ${data.id} has been deleted`);
    }
    catch(error){
        return res.status(400).json({message: error.message})
    }
})

var match = router.get('/match', async (req,res)=>{
    try{
        const name = req.header('username');
        const city = req.header("city");
        const data = await utils.AllRelationsOnePerson(name);//recebe [give,need]
        const giveCandidates = await utils.AllRelationsOneOption(data[0], name, city, "need");
        const needCandidates = await utils.AllRelationsOneOption(data[2], name, city, "give");
        var match = [];
        for(var i=0; i<needCandidates.length;i++){
            for(var j=0;j<giveCandidates.length;j++){
                var aux = `Você dá a figurinha ${giveCandidates[j][1]} e recebe a figurinha ${needCandidates[i][1]} do ${needCandidates[i][0]}`;
                if(needCandidates[i][0]==giveCandidates[j][0]&&!match.includes(aux)){
                    match.push(aux);
                }
            }

        }                    
        if(match.length==0) return res.status(200).json({matches:[],message: "Infelizmente não encontramos ninguém no nosso banco de dados que possa dar match com você"});
        else return res.status(200).json({matches: match, message:""});
    }catch(error){
        return res.status(400).json({message: error.message});
    }
})
var matched = router.patch('/matched', async (req,res)=>{
    try{
        const users = req.body.users;
        for(i=0;i<2;i++){
            await utils.UpdateRelations(users[i][0], users[1-i][1], "have");
            var toDelete = await StickerPerson.find({username: users[i][0], fidSticker:users[i][1], option:"give"});
            console.log(toDelete);
            var data = await StickerPerson.findByIdAndDelete(toDelete[0].id);
        }
        return res.status(200).json("MATCHED");
    } catch(error){
        return res.status(400).json({error: error});
    }
})

module.exports = router;