var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var defaultApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://plusnetmonitor.firebaseio.com",
});
var db = defaultApp.firestore();

exports.db = db;
