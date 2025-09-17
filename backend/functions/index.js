const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send({message: '안녕하세요! marry-check Firebase Functions가 응답합니다.'});
});
