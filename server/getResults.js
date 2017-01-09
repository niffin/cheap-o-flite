const firebase = require('firebase');

function getResults (res) {
  firebase.database()
    .ref('results').orderByKey().once('value')
    .then(snapshot => {
      const jsonResult = {};

      snapshot.forEach(child => {
        jsonResult[child.key] = child.val();
      });

      return jsonResult;
    })
    .then(json => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(json));
    });
}

module.exports = getResults;
