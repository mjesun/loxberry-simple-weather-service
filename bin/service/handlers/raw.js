'use strict';

const weatherbit = require('../weatherbit');

module.exports = async function(url, query) {
  const coord = query.coord.split(',').map(Number);

  return JSON.stringify(await weatherbit(coord[0], coord[1]), null, 2);
};
