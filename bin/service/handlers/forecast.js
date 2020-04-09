'use strict';

const format = require('../format');
const weatherbit = require('../weatherbit');

module.exports = async function(url, query) {
  const coord = query.coord.split(',').map(Number);
  const asl = +query.asl;

  const data = await weatherbit(coord[0], coord[1]);
  const result = format(coord[0], coord[1], asl, data);

  return result;
};
