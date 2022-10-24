const { json } = require('body-parser');
const {Person, Sticker, StickerPerson} = require('../models/model');

module.exports = {
    async AllRelationsOnePerson(req){
        try{
            const data = await StickerPerson.aggregate([{$match:{username: req}}])
            var stickersGive = [];
            var stickersNeed = [];
            const tam = data.length;
            for(var i=0;i<tam;i++){
                if(data[i].option == "need") {
                    stickersNeed.push(data[i].fidSticker);
                } else if(data[i].option == "give"){
                    stickersGive.push(data[i].fidSticker);
                }
            }
            var ret = [stickersGive, stickersNeed];
            return ret;
        }catch(error){
            return json({message: error.message});
        }
    },
    async AllRelationsOneOption(vector, selfName, town){
        try{
            const data = await StickerPerson.find({fidSticker: {$in:vector}});
            const available = await Person.find({city: town});
            var candidates = [];
            const tam = data.length;
            for(var i=0;i<tam;i++){
                const aux = data[i].username;
                var flag = false;
                for(var j=0;j<available.length;j++){
                    if(available[j].username == aux) flag = true;
                }
                if(!candidates.includes(aux)&&aux!=selfName&&flag){
                    candidates.push([aux, data[i].fidSticker]);
                }
            }
            return candidates;
        }catch(error){
            return json({message: error.message});
        }
    }
}