
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require("./Fierbase_credentials/proiect-single-page-app---cv-firebase-adminsdk-lmblb-db23a470de.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(); //this is the reference to the database

module.exports = db;
