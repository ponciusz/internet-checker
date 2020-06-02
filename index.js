const isOnline = require("is-online");
var cron = require("node-cron");
var firebase = require("./firebase");
var localDb = require("./localDb");

let downStart = null;

const checkInternet = async () => {
  localDb.updateFromLocal();
  const online = await isOnline();
  const timestamp = Math.round(new Date() / 1000);

  console.log({ online, timestamp });

  if (!online && !downStart) {
    console.log(`OMG NO INTERNET START COUNTING SECONDS`);
    downStart = timestamp;
  }

  if (downStart && online) {
    console.log(`INTERNET BACK`);
    const downLength = timestamp - downStart;

    let setDoc = firebase.db
      .collection("downtime")
      .doc(timestamp.toString())
      .set({
        downLength,
      });

    setDoc
      .then((res) => {
        console.log("Sync Done");
        downStart = null;
      })
      .catch((err) => {
        localDb.get("dates").push({ timestamp: downStart, downLength }).write();
        console.log("err");
      });
  }
  console.log("------------------------");
};
cron.schedule("0,10,20,30,40,50 * * * * *", () => {
  checkInternet();
});
