const isOnline = require('is-online');
var cron = require('node-cron');
var firebase = require('./firebase');

let downStart = null;

const checkInternet = async () => {
  const online = await isOnline();
  var now = new Date();
  const timestamp = Math.round(now / 1000);
  var month = ('0' + (now.getUTCMonth() + 1)).slice(-2);
  var day = ('0' + now.getUTCDate()).slice(-2);
  var year = now.getUTCFullYear();

  console.log({ online, timestamp, day: year + '-' + month + '-' + day });

  if (!online && !downStart) {
    console.log(`OMG NO INTERNET START COUNTING SECONDS`);
    downStart = timestamp;
  }

  if (downStart && online) {
    console.log(`INTERNET BACK`);
    const downLength = timestamp - downStart;
    let monthRef = firebase.db.collection('months').doc(`${year}-${month}`);
    const setDoc = monthRef.update(
      {
        [`days.${year}-${month}-${day}`]: firebase.admin.firestore.FieldValue.arrayUnion(
          {
            timestamp,
            downLength,
          }
        ),
      },
      { merge: true }
    );

    setDoc
      .then((res) => {
        console.log(
          `Sync Done for ${year}-${month}-${day} length:${downLength} `
        );
        downStart = null;
      })
      .catch((err) => {
        console.log('err');
      });
  }
};
cron.schedule('0,10,20,30,40,50 * * * * *', () => {
  checkInternet();
});
