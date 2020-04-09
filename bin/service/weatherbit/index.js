'use strict';

const path = require('path');
const querystring = require('querystring');

const cfg = require('../cfg');
const icons = require('./icons');
const request = require('../request');

const config = cfg.read(path.join('REPLACELBPCONFIGDIR', 'data.cfg'));
const key = config.data['weatherbit-api-key'];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ONE_SECOND_MS = 1000;
const ONE_MINUTE_MS = 60 * ONE_SECOND_MS;
const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;

const ONE_SECOND_S = 1;
const ONE_MINUTE_S = 60 * ONE_SECOND_S;
const ONE_HOUR_S = 60 * ONE_MINUTE_S;

module.exports = async function(lon, lat) {
  const data = querystring.stringify({key, lon, lat});

  const responses = await Promise.all([
    request('GET', `https://api.weatherbit.io/v2.0/current?${data}`),
    request('GET', `https://api.weatherbit.io/v2.0/forecast/hourly?${data}`),
    request('GET', `https://api.weatherbit.io/v2.0/forecast/daily?${data}`),
  ]);

  const [current, hourly, daily] = responses.map((text) => JSON.parse(text));

  // Check for errors.
  const error = current.error || hourly.error || daily.error;

  if (error) {
    throw new Error(error);
  }

  // Get all the data that will be used.
  const all = [].concat(
    current.data,

    Math.floor(current.data[0].ts / ONE_HOUR_S) ===
      Math.floor(hourly.data[0].ts / ONE_HOUR_S)
      ? hourly.data.slice(1)
      : hourly.data,

    +hourly.data[hourly.data.length - 1].timestamp_local.substr(11, 2) < 12
      ? daily.data.slice(Math.floor(hourly.data.length / 24))
      : daily.data.slice(Math.floor(hourly.data.length / 24) + 1),
  );

  // Compute local UTC difference.
  const {timestamp_local: tsLocal, timestamp_utc: tsUtc} = all.find(
    (item) => item.timestamp_local && item.timestamp_utc,
  );

  const diff = new Date(tsLocal + 'Z') - new Date(tsUtc + 'Z');

  // Enforce "current" to always be the first "hourly" - 1 hour.
  all[0].ts = all[1].ts - ONE_HOUR_S;

  // Return clean data.
  return all.map((item) => {
    if (item.clouds_low === undefined) {
      item.clouds_low = item.clouds;
    }

    if (item.clouds_mid === undefined) {
      item.clouds_mid = item.clouds;
    }

    if (item.clouds_hi === undefined) {
      item.clouds_hi = item.clouds;
    }

    if (item.pop === undefined) {
      item.pop = item.precip ? 100 : 0;
    }

    if (item.wind_gust_spd === undefined) {
      item.wind_gust_spd = 0;
    }

    if (item.temp === undefined) {
      item.temp = item.max_temp;
    }

    if (item.app_temp === undefined) {
      item.app_temp = item.app_max_temp;
    }

    if (item.solar_rad === undefined) {
      item.solar_rad = item.max_dhi || 0;
    }

    const time = item.valid_date
      ? new Date(new Date(item.valid_date + 'T12:00:00Z') - diff)
      : new Date(Math.floor(item.ts / ONE_MINUTE_S / 15) * 15 * ONE_MINUTE_MS);

    const diffSign = diff < 0 ? '-' : '+';

    const diffHour = Math.floor(Math.abs(diff) / ONE_HOUR_MS)
      .toFixed(0)
      .padStart(2, '0');

    const diffMin = Math.floor((Math.abs(diff) % ONE_HOUR_MS) / ONE_MINUTE_MS)
      .toFixed(0)
      .padStart(2, '0');

    return {
      locationCity: item.city_name || current.data[0].city_name,
      locationCountry: item.country_code || current.data[0].country_code,
      locationTimeZone: 'UTC',
      locationTimeDifference: diffSign + diffHour + ':' + diffMin,

      localDay: DAYS[time.getDay()],
      localDate: time.toISOString().substr(0, 10),
      localTime: time.toISOString().substr(11, 2) + ':00:00',

      sunrise: item.sunrise || null,
      sunset: item.sunset || null,

      temperature: item.temp,
      temperatureApparent: item.app_temp,

      windSpeed: item.wind_spd,
      windDirection: item.wind_dir,
      windGust: item.wind_gust_spd,

      cloudsLow: item.clouds_low,
      cloudsMid: item.clouds_mid,
      cloudsHigh: item.clouds_hi,

      precipitation: item.precip,
      precipitationProbability: item.pop,

      humidity: item.rh,
      pressure: item.slp,
      radiation: item.solar_rad,

      snowFraction: 0,
      cape: 0,

      pictogram: icons[item.weather.code],
    };
  });
};
