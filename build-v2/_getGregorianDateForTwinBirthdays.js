'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getGregorianDateForTwinBirthdays;

var _LocationMap = require('./_LocationMap');

var _LocationMap2 = _interopRequireDefault(_LocationMap);

var _getGregorianDateForNawRuz = require('./_getGregorianDateForNawRuz');

var _getGregorianDateForNawRuz2 = _interopRequireDefault(_getGregorianDateForNawRuz);

var _getGregorianDateForNextNewMoon = require('./_getGregorianDateForNextNewMoon');

var _getGregorianDateForNextNewMoon2 = _interopRequireDefault(_getGregorianDateForNextNewMoon);

var _getGregorianDateForSunset = require('./_getGregorianDateForSunset');

var _getGregorianDateForSunset2 = _interopRequireDefault(_getGregorianDateForSunset);

var _incrementGregorianDays = require('./_incrementGregorianDays');

var _incrementGregorianDays2 = _interopRequireDefault(_incrementGregorianDays);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Twin birthdays occur at Sunset in tehran 8 new moons after Naw Ruz.
 */
function getGregorianDateForTwinBirthdays(gregorianYear) {
  var gregorianNawRuz = (0, _getGregorianDateForNawRuz2.default)(gregorianYear);

  // QUESTION: Why are we getting sunset for naw ruz date? Is it not already
  // sunset?
  var gregorian8NewMoons = (0, _getGregorianDateForSunset2.default)(gregorianNawRuz, _LocationMap2.default.Tehran);
  for (var i = 0; i < 8; ++i) {
    gregorian8NewMoons = (0, _getGregorianDateForNextNewMoon2.default)(gregorian8NewMoons);
  }

  var gregorianSunset = (0, _getGregorianDateForSunset2.default)(gregorian8NewMoons, _LocationMap2.default.Tehran);
  gregorian8NewMoons = gregorian8NewMoons < gregorianSunset ? (0, _incrementGregorianDays2.default)(gregorian8NewMoons, 1) : (0, _incrementGregorianDays2.default)(gregorian8NewMoons, 2);

  // QUESTION: Why are we setting to sunset in previous line if we are just
  // getting the day in the next line.
  gregorian8NewMoons = (0, _getGregorianDateForSunset2.default)(gregorian8NewMoons, _LocationMap2.default.Tehran);
  return new Date(Date.UTC(gregorian8NewMoons.getUTCFullYear(), gregorian8NewMoons.getUTCMonth(), gregorian8NewMoons.getUTCDate()));
}