const express = require('express');
var cors = require('cors')
var jwt = require('jsonwebtoken')
const app = express();
var morgan = require('morgan');
const { nextTick } = require('process');
var faker = require('faker');
const { v4: uuidv4 } = require('uuid');
const port = 3000;

var fromCustomModule = require('./customModules/message');
console.log(fromCustomModule.msg);

const bcrypt = require('bcrypt');
const { exists } = require('fs');
const saltRounds = 12;
const secret = 'portocala'

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
var db = require('./database')


var autoriRouter = require('./autori/autori');//ne trebuie
app.use('/', autoriRouter);//ne trebuie

var cartiRouter = require('./carti/carti');//ne trebuie
app.use('/', cartiRouter);//ne trebuie

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

//ruta GET de populare Bd

app.get('/generateRandomAutori/:noOfRecords', async (req, res) => {
  let number = req.params.noOfRecords

  for (let i = 0; i < number; i++) {
    let obj = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      age: 18 + Math.floor(Math.random() * 65),
      city: faker.address.city(),
      descriptionAuthor: faker.lorem.paragraph(2, 5),
      booksId: []
    }
    const res = await db.collection('Autori').add(obj);
    console.log('Added document with ID: ', res.id);
  }
  res.send('Vrei sa introduci urmatorul numar de date random : ' + number)

})

app.get('/generateRandomCarti/:noOfRecords', async (req, res) => {
  let number = req.params.noOfRecords
  const response = await db.collection('Autori').get();
  console.log(response)

  let autori = [];

  response.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
    autori.push(doc.id);
  });

  for (let i = 0; i < number; i++) {
    let obj = {
      autorId: autori[Math.floor(Math.random() * (autori.length - 1))],
      title: faker.random.words(3, 3),
      description: faker.lorem.paragraph(12, 15),
      nrOfPages: 100 + Math.floor(Math.random() * 400),
    }

    const res = await db.collection('Carti').add(obj);
    console.log('Added document with ID: ', res.id);

    let listaCarti = [];
    await db.collection('Autori').doc(obj.autorId).get().then(snapshot => {
      listaCarti = snapshot.data().booksId;
    });
    console.log(res.id);
    listaCarti.push(res.id);
    db.collection("Autori").doc(obj.autorId).update({ "booksId": listaCarti });
  }
  res.send('Vrei sa introduci urmatorul numar de date random : ' + number)

})



app.get('/users', (req, res) => {
  res.json(users);
})

app.post('/data', (req, res) => {
  let data = req.body
  console.log('trying to post the following data: ', data)
  res.send('Succes')
});

app.post('/user', async (req, res) => {
  let data = req.body;
  let emailExist = false;

  const userRef = db.collection('users');
  const snapshot = await userRef.where('email', '==', data.email).get();
  if (!snapshot.empty) {
    emailExist = true;
  };

  if (emailExist) {
    res.send('User already registered.')
  }
  else {
    bcrypt.hash(data.password, saltRounds).then(async function (hash) {
      data.password = hash;
      // Users.push(data);
      const user = await db.collection('users').add(data);
      console.log(`You've just register with id ${user.id}`);
      res.send('Succesfull registration');
    });
  }
});

app.post('/login', async (req, res) => {
  let data = req.body;

  let emailFound = false;

  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('email', '==', data.email).get();

  if (snapshot.empty) {
    let response = {};
    response.message = "No such email address.";
    res.json(response);
  } else {
    emailFound = true;
    snapshot.forEach(doc => {
      bcrypt.compare(data.password, doc.data().password).then(async function (result) {
        if (result) {
          let token = jwt.sign({
            email: doc.data().email
          }, secret, { expiresIn: 60 * 60 });

          let response = {};
          response.token = token;
          response.message = 'You have the right to access private resources'
          res.json(response);
        }
        else {
          let response = {};
          response.message = "Password missmatch";
          res.json(response)
        }
      });
    });
  }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

module.exports = app;
module.exports = db;
