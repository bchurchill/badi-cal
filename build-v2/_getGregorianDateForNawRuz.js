'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = gregorianDateForNawRuz;

var _LocationMap = require('./_LocationMap');

var _LocationMap2 = _interopRequireDefault(_LocationMap);

var _stellafane = require('./extern/stellafane');

var _stellafane2 = _interopRequireDefault(_stellafane);

var _getGregorianDateForSunset = require('./_getGregorianDateForSunset');

var _getGregorianDateForSunset2 = _interopRequireDefault(_getGregorianDateForSunset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function gregorianDateForNawRuz(gregorianYear) {

  // Step 0: Follow to the UHJ
  // In 2026, the equinox is less than a minute from sunset. The
  // algorithms from Meeus which we're using don't give accuraccy
  // better than one minute, and don't give us the right answer. The
  // UHJ has said that Naw Ruz this day is on the 21st.
  if (gregorianYear == 2026) {
    return new Date(Date.UTC(2026, 2, 21));
  }

  // Step 1: find UTC time of the equinox
  var equinoxGregorianDate = _stellafane2.default.vernal_equinox(gregorianYear);

  // Step 2: Find Tehran's sunset on the day of the equinox
  var sunsetGregorianDate = (0, _getGregorianDateForSunset2.default)(equinoxGregorianDate, _LocationMap2.default.Tehran);

  // Step 3: Find the final day.
  return equinoxGregorianDate < sunsetGregorianDate ? new Date(Date.UTC(equinoxGregorianDate.getUTCFullYear(), equinoxGregorianDate.getUTCMonth(), equinoxGregorianDate.getUTCDate())) : new Date(Date.UTC(equinoxGregorianDate.getUTCFullYear(), equinoxGregorianDate.getUTCMonth(),
  // NOTE: Date class handles the case where the day spills to the
  // next month.
  equinoxGregorianDate.getUTCDate() + 1));
}