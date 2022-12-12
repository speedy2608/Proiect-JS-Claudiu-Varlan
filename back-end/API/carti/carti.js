var express = require('express');
var router = express.Router();
var db = require('../database')
var jwt = require('../node_modules/jsonwebtoken')
const bcrypt = require('../node_modules/bcrypt');
var faker = require('../node_modules/faker');


const secret = 'portocala'


//Check auth
function checkAuthorization(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, secret, (err, decoded) => {
            if (err) {
                if (err.expiredAt) {
                    res.json({ "message": "Your token expired!" });
                } else {
                    res.json({ "message": "Decoding error!" });
                }
            } else {
                console.log(decoded.email);
                next();
            }
        })
    } else {
        res.json({ "message": "Missing token!" })
    }
}

router.get('/carti', async (req, res) => {
    let carti = [];
    //Get all carti
    const response = await db.collection('Carti').get();
    //Iterate over
    response.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        let carte = {};
        carte.id = doc.id;
        carte.title = doc.data().title;
        carte.nrOfPages = doc.data().nrOfPages;
        carte.description = doc.data().description;
        carte.autorId = doc.data().autorId;
        //Push every elem into Obj Array 
        carti.push(carte);
    });

    //Respond with carti array
    res.json(carti);

})



// Create Carte
router.post('/carti', checkAuthorization, async (req, res) => {
    console.log('Vrei sa adaugi o carte.');
    const carte = req.body;
    const insert = await db.collection('Carti').add(carte);
    res.json({ "id": insert.id });
})

//Get Carte
router.get('/carti/:id', (req, res) => {
    console.log('Vrei sa primesti detalii despre cartea cu id-ul: ' + req.params.id);
})

//Edit carte
router.put('/carti/:id', checkAuthorization, async (req, res) => {
    console.log('Vrei sa actualizezi cartea cu id-ul: ' + req.params.id);

    const response = await db.collection("Carti").doc(req.params.id).update(req.body);

    res.json({ 'message': 'Am modificat cartea cu id-ul ' + req.body.id + ' de pe server!' });
})

//Delete Carte
router.delete('/carti/:id', checkAuthorization, (req, res) => {
    console.log('Vrei sa stergi cartea cu id-ul: ' + req.params.id);
    const id = req.params.id
    const carte = db.collection('Carti').doc(id).delete()
    res.json({ 'message': 'Am sters cartea cu id ul' + req.params.id + ' de pe server!' });
})
/* End - Carti operations */

module.exports = router;