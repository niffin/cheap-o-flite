const server          = require('server');
const getFlightPrices = require('./getFlightPrices');
const getResults      = require('./getResults');

const firebase = require('firebase');
const config   = require('../config/firebase');

firebase
  .initializeApp(config.firebaseConfig)
  .auth()
  .signInWithEmailAndPassword(
    config.firebaseCredentials.email, 
    config.firebaseCredentials.password
  );

getFlightPrices();
setInterval(getFlightPrices, 15 * (1000 * 60));

server({ public : './client/' }, 
  server.router.get('/', (req, res) => res.sendfile('../client/index.html')),
  server.router.get('/api/v/1/results', (req, res) => getResults(res))
);
