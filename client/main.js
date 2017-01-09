/* global d3 */

fetch('api/v/1/results')
  .then(res => res.json())
  .then(json => {
    const dates   = Object.keys(json),
          minDate = d3.min(dates),
          maxDate = d3.max(dates),
          minVal  = d3.min(dates, date => {
            return priceToNumber(json[date].depart) + priceToNumber(json[date].return);
          }),
          maxVal  = d3.max(dates, date => {
            return priceToNumber(json[date].depart) + priceToNumber(json[date].return);
          });

    console.log('max - ', maxVal);
    console.log('min - ', minVal);
  });


function priceToNumber (price) {
  return Number(price.replace(/[^0-9\.]+/g, ''));
}
