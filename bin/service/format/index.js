'use strict';

const icons = require('./icons');

module.exports = function format(lon, lat, asl, data) {
  const pad = (n, d, s) => n.toFixed(d).padStart(s);

  const header = [
    '',
    data[0].locationCity,
    lon,
    lat,
    asl,
    data[0].locationCountry,
    data[0].locationTimeZone,
    'UTC' + data[0].locationTimeDifference,
    data[0].sunrise,
    data[0].sunset,
    '',
  ];

  const registries = data.map((item) => {
    const localDate = item.localDate
      .split('-')
      .reverse()
      .join('.');

    return [
      localDate,
      item.localDay,
      item.localTime.substr(0, 2),
      pad(item.temperature, 1, 5),
      pad(item.temperatureApparent, 1, 5),
      pad(item.windSpeed * 3.6, 0, 3),
      pad(item.windDirection, 0, 3),
      pad(item.windGust * 3.6, 0, 3),
      pad(item.cloudsLow, 0, 3),
      pad(item.cloudsMid, 0, 3),
      pad(item.cloudsHigh, 0, 3),
      pad(item.precipitation, 1, 5),
      pad(item.precipitationProbability, 0, 3),
      pad(item.snowFraction, 1, 3),
      pad(item.pressure, 0, 4),
      pad(item.humidity, 0, 3),
      pad(item.cape, 0, 6),
      pad(icons[item.pictogram], 0, 2),
      pad(item.radiation, 0, 4),
      '',
    ];
  });

  const fullData = [
    '<station>',
    Object.values(header).join(';'),
    registries.map((r) => Object.values(r).join(';')).join('\n'),
    '</station>',
  ];

  return fullData.join('\n');
};
