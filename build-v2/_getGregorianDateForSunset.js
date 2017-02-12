'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getGregorianDateForSunset;

var _blueyonder = require('./extern/blueyonder');

var _blueyonder2 = _interopRequireDefault(_blueyonder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getGregorianDateForSunset(gregorianDate, place) {

  var sunsetTime = _blueyonder2.default.SunRiseSet(gregorianDate.getUTCFullYear(), gregorianDate.getUTCMonth() + 1, gregorianDate.getUTCDate(), place.latitude, place.longitude)[1];

  var sunsetHours = Math.floor(sunsetTime);
  var sunsetMinutes = Math.floor((sunsetTime - sunsetHours) * 60);
  var sunsetSeconds = Math.floor(((sunsetTime - sunsetHours) * 60 - sunsetMinutes) * 60);

  return new Date(Date.UTC(gregorianDate.getUTCFullYear(), gregorianDate.getUTCMonth(), gregorianDate.getUTCDate(), sunsetHours, sunsetMinutes, sunsetSeconds));
}