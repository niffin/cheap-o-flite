const flightOptions = require('../config/flightOptions');
const Horseman = require('node-horseman');
const firebase = require('firebase');


function getFlightPrice () {
  console.log('getFlightPrice start');
  
  const date = new Date().getTime();
  const horseman = new Horseman({
    timeout : 10 * 3000
  });

  horseman
    .on('timeout', err => {
      console.log('getFlightPrice failed because', err);
      console.log('retrying');
      horseman.close();
      getFlightPrice();
    })
    .on('urlChanged', url => console.log('redirected to ', url))

    .cookies([])
    .open('https://www.united.com/ual/en/us/')    

    .value('input[name="Origin"]', flightOptions.Origin)
    .value('input[name="Destination"]', flightOptions.Destination)
    .value('input[name="DepartDate"]', flightOptions.DepartDate)
    .value('input[name="ReturnDate"]', flightOptions.ReturnDate)
    .value('input[name="cabinType"]', flightOptions.cabinType)
    .value('input[name="NumOfAdults"]', flightOptions.NumOfAdults)
    .value('input[name="NumOfChildren01"]', flightOptions.NumOfChildren01)
    .value('input[name="NumOfChildren02"]', flightOptions.NumOfChildren02)
    .value('input[name="NonStopOnly"]', flightOptions.NonStopOnly)
    .click('#flightBookingSubmit')
    .log('submitted form')

    .waitForNextPage()
    .waitForSelector('.price-point')
    .log('depart page loaded')

    .text('div[data-column-description="(lowest)"]:first .price-point')
    .then(price => {
      firebase.database().ref('results/' + date).set({
        depart : String.prototype.trim.call(price)
      });
    })
    
    .click('div[data-column-description="(lowest)"]:first .price-point')
    .waitForNextPage()
    .waitForSelector('.flight-result-list .price-point')
    .log('return page loaded')
    
    .text('div[data-column-description="(lowest)"]:first .price-point')
    .then(price => {
      firebase.database().ref('results/' + date).update({
        return : String.prototype.trim.call(price)
      });
    })
    .close();
}

module.exports = getFlightPrice;
