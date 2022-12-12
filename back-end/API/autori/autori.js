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

router.get('/autori', async (req, res) => {
    let autori = [];
    //Get all autori
    const response = await db.collection('Autori').get();
    //Iterate over
    response.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        let autor = {};
        autor.id = doc.id;
        autor.firstName = doc.data().firstName;
        autor.lastName = doc.data().lastName;
        autor.age = doc.data().age;
        autor.city = doc.data().city;
        autor.descriptionAuthor = doc.data().descriptionAuthor;
        autor.booksId = doc.data().booksId;
        //Push every elem into Obj Array 
        autori.push(autor);
    });

    //Respond with autori array
    res.json(autori);

})



// Create autor
router.post('/autori', checkAuthorization, async (req, res) => {
    let autor = req.body;
    const insert = await db.collection('Autori').add(autor);
    res.json({ "id": insert.id });
})

//Get autor
router.get('/autori/:id', (req, res) => {
    console.log('Vrei sa primesti detalii despre autorul cu id-ul: ' + req.params.id);
})

//Edit autor
router.put('/autori/:id', checkAuthorization, async (req, res) => {
    console.log("Body autor: " + req.body)
    const id = req.params.id;
    const data = req.body;
    const response = await db.collection("Autori").doc(id);
    await response.update(data);


    res.status(200).json({
        success: true,
        data
    })
})

//Delete autori
router.delete('/autori/:id', checkAuthorization, (req, res) => {
    let id = req.params.id
    const autor = db.collection('Autori').doc(id).delete()
    res.json({ 'message': 'Am sters autorul cu id ul' + req.params.id + ' de pe server!' });
})
/* End - Autori operations */

module.exports = router;