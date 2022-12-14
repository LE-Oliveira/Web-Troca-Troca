const { json } = require('body-parser');
const {Person, Sticker, StickerPerson} = require('./models/model');

module.exports = {
    async AllRelationsOnePerson(req){
        try{
            const data = await StickerPerson.aggregate([{$match:{username: req}}])
            var stickersGive = [];
            var stickersNeed = [];
            var stickersHave = [];
            const tam = data.length;
            for(var i=0;i<tam;i++){
                if(data[i].option == "need") {
                    stickersNeed.push(data[i].fidSticker);
                } else if(data[i].option == "give"){
                    stickersGive.push(data[i].fidSticker);
                } else if(data[i].option == "have"){
                    stickersHave.push(data[i].fidSticker);
                }
            }
            var ret = [stickersGive, stickersHave, stickersNeed];
            return ret;
        }catch(error){
            return json({message: error.message});
        }
    },
    async AllRelationsOneOption(vector, selfName, town, opt){
        try{
            const data = await StickerPerson.find({fidSticker: {$in:vector}, option: opt});
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
    },
    async UpdateRelations(name, sticker, opt){
        try{
            const user = await Person.aggregate([{$match:{username: name}}]);
            if(user[0] == undefined) res.status(400).json("Usuário inexistente");
            else if(!["need", "give", "have"].includes(opt)) res.status(400).json("Opção incompatível");
            else if(sticker>=0&&sticker<=447){
                var data = new StickerPerson({
                    username: name,
                    fidSticker: sticker,
                    option: opt
                })
                const dataToSave = await data.save();
                return `Relação com a figurinha ${sticker} atualizada`;
            }
        }catch(error){
            return error.message;
        }
    },
    async album(req, opt){
        try{
            var data = await StickerPerson.aggregate([{$match:{username: req, option: opt}}]).sort({fidSticker: 1});
            var stickers = [];
            for(var i=0;i<data.length;i++){stickers.push(data[i].fidSticker);}
            return stickers;
        }catch(error){
            return json({message: error.message});
        }
    },
    async getMail(user){
        data = await Person.find({username: user});
        return data[0].mail;
    }
}