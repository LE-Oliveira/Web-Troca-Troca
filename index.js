require('dotenv').config();

const routes = require('./routes/routes')
const mongoString = process.env.DATABASE_URL;
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();

app.use('/api', routes);

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) =>{
    console.log(error);
})

database.once('connected', ()=>{
    console.log('Banco de Dados conectado');
})

app.use(cors());
app.use(express.json());

app.listen(3000, () =>{
    console.log(`Server iniciado em ${3000}`);
});