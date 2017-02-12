'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getGregorianDateForNextNewMoon;

var _blueyonder = require('./extern/blueyonder');

var _blueyonder2 = _interopRequireDefault(_blueyonder);

var _incrementGregorianDays = require('./_incrementGregorianDays');

var _incrementGregorianDays2 = _interopRequireDefault(_incrementGregorianDays);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getGregorianDateForNextNewMoon(gregorianDate) {
  return recurse(gregorianDate, gregorianDate);
}

function recurse(gregorianDate, minGregorianDate) {
  var quarters = _blueyonder2.default.MoonQuarters(gregorianDate.getUTCFullYear(), gregorianDate.getUTCMonth() + 1, // Month 0-based to 1-based indexing
  gregorianDate.getUTCDate(), 0);
  // QUESTION: What does this do?
  var newMoonDateComponents = _blueyonder2.default.jdtocd(quarters[0]);
  var newMoonGregorianDate = new Date(Date.UTC(newMoonDateComponents[0], // Year
  newMoonDateComponents[1] - 1, // Month 1-based to 0-based indexing
  newMoonDateComponents[2], // Day
  newMoonDateComponents[4], // Hour
  newMoonDateComponents[5], // Minute
  newMoonDateComponents[6]));

  // QUESTION: Why are we doing this?
  return newMoonGregorianDate > minGregorianDate ? newMoonGregorianDate : recurse((0, _incrementGregorianDays2.default)(minGregorianDate, 30), minGregorianDate);
}