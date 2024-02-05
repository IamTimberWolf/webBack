const bodyParser = require('body-parser');
const express = require('express');
const {MongoClient } = require('mongodb');

const uri = "mongodb+srv://hardouinmalo:gs5JVFI602YLuin2@mycluster.hwjzjmp.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
const port = 3000;

app.use((req, res, next)=> {
    console.log((`Requête reçue: ${req.method}, ${req.url}, ${JSON.stringify(req.body)}`));
    next();
});

const client = new MongoClient(uri);
    client.connect(err =>{
    if(err){
        console.log("Erreur à la connexion à la base de données");
    } else {
        console.log("connexion réussie");
    }
});

app.post('/utilisateurs', (req, res) => {
    const {nom, prenom} = req.body;

    if(!nom || !prenom){
        return res.status(400).json({ erreur : "veuillez fournir un nom et un prenom"});
    }

    const nouvelUtilisateur = {nom, prenom};
    const collection = client.db("myDB").collection("utilisateurs");

    try{
        const result = collection.insertOne(nouvelUtilisateur);
        console.log("utilisateur ajouté avec succès");
        res.status(201).json(nouvelUtilisateur);
    }catch (error){
        console.error("Erreur lors de l'ajout d'utilisateur");
        res.status(500).json({erreur : "Erreur lors de l'ajout d'utilisateur"});
    }
});

app.delete('/utilisateurs/:id', (res, req) => {
    
})

app.get('/utilisateurs', (req, res) => {
    const collection = client.db("myDB").collection("utilisateurs");
    collection.find().toArray((err, utilisateurs) => {
        if(err){
            console.log("erreur lors de la recherche utilisateurs : ",error);
            res.status(500).send("erreur interne du serveur");
        } else {
            res.json(utilisateurs);
        }
    })
})

app.listen(port, ()=>{
    console.log(`server en cour d'execution sur le port : ${port}`);
})

client.close();