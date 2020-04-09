'use strict';

// Adapted from https://www.weatherbit.io/api/codes.
module.exports = {
  200: 'STORM_MEDIUM',
  201: 'STORM_MEDIUM',
  202: 'STORM_HEAVY',

  230: 'STORM_MEDIUM',
  231: 'STORM_MEDIUM',
  232: 'STORM_HEAVY',
  233: 'STORM_HEAVY',

  300: 'RAIN_LIGHT',
  301: 'RAIN_LIGHT',
  302: 'RAIN_MEDIUM',

  500: 'RAIN_LIGHT',
  501: 'RAIN_MEDIUM',
  502: 'RAIN_HEAVY',

  511: 'RAIN_MEDIUM',

  520: 'RAIN_LIGHT',
  521: 'RAIN_MEDIUM',
  522: 'RAIN_HEAVY',

  600: 'SNOW_LIGHT',
  601: 'SNOW_MEDIUM',
  602: 'SNOW_HEAVY',

  610: 'SNOW_LIGHT',
  611: 'SNOW_LIGHT',
  612: 'SNOW_MEDIUM',

  621: 'SNOW_MEDIUM',
  622: 'SNOW_HEAVY',
  623: 'SNOW_HEAVY',

  700: 'FOG',
  711: 'FOG',
  721: 'FOG',
  731: 'FOG',
  741: 'FOG',
  751: 'FOG',

  800: 'CLEAR',
  801: 'CLOUDS_LIGHT',
  802: 'CLOUDS_MEDIUM',
  803: 'CLOUDS_HEAVY',
  804: 'CLOUDY',

  900: 'RAIN_MEDIUM',
};