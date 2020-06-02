const firebase = require("./firebase");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
//local fallback DB
const adapter = new FileSync("db.json");
const localDb = low(adapter);
localDb.defaults({ dates: [] }).write();

const log = () => {
  localDb
    .get("dates")
    .value()
    .forEach((el) => {
      console.log("---");
      console.log(el);
    });
};

const updateFromLocal = () => {
  const dates = localDb.get("dates");

  if (dates.value().length === 0) {
    console.log("Nothing to sync");
  } else {
    dates.value().forEach((el) => {
      let setDoc = firebase.db
        .collection("downtime")
        .doc(el.timestamp.toString())
        .set({
          downLength: el.downLength,
        });

      setDoc
        .then((res) => {
          dates.remove({ timestamp: el.timestamp }).write();
          console.log("Sync Done");
        })
        .catch((err) => {
          console.log(err.message);
          console.log("err");
        });

      console.log("---");
      console.log(el.timestamp);
      console.log(el.downLength);
    });
  }
};

exports.log = log;
exports.updateFromLocal = updateFromLocal;
