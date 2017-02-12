'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _getGregorianDateForNawRuz = require('./_getGregorianDateForNawRuz');

var _getGregorianDateForNawRuz2 = _interopRequireDefault(_getGregorianDateForNawRuz);

var _getGregorianDateForSunset = require('./_getGregorianDateForSunset');

var _getGregorianDateForSunset2 = _interopRequireDefault(_getGregorianDateForSunset);

var _incrementGregorianDays = require('./_incrementGregorianDays');

var _incrementGregorianDays2 = _interopRequireDefault(_incrementGregorianDays);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MillisPerHour = 1000 * 60 * 60;
var MillisPerDay = MillisPerHour * 24;

var BadiDate = function () {
  _createClass(BadiDate, null, [{
    key: 'fromGregorianDate',
    value: function fromGregorianDate(gregorianDate, place) {
      // TODO: THIS LOGIC SHOULD GET MOVED TO NORMALIZE METHOD!!!

      // QUESTION: We are getting the UTC year here, is that what we want?
      // Shouldn't we be getting the year in OUR timezone.
      var gregorianYear = gregorianDate.getUTCFullYear();
      var gregorianNawRuz = (0, _getGregorianDateForNawRuz2.default)(gregorianYear);
      if (gregorianDate < gregorianNawRuz) {
        gregorianYear -= 1;
        gregorianNawRuz = (0, _getGregorianDateForNawRuz2.default)(gregorianYear);
      }
      var badiYear = badiFromGregorianYear(gregorianYear);

      var daysSinceNawRuz = Math.floor((gregorianDate - gregorianNawRuz) / MillisPerDay);
      var hoursAfterSunset = 0;

      // Count the days past Naw Ruz (@ 00:00:00 UTC) it is. If the sun
      // has already set on this day, we need to add one more day.
      if ((0, _getGregorianDateForSunset2.default)(gregorianDate, place) < gregorianDate) {
        daysSinceNawRuz += 1;
        var gregorianSunset = (0, _getGregorianDateForSunset2.default)(gregorianDate, place);
        hoursAfterSunset = (gregorianDate - gregorianSunset) / MillisPerHour;
      } else {
        var previousGregorianDate = new Date(gregorianDate.getTime() - MillisPerDay);
        var _gregorianSunset = (0, _getGregorianDateForSunset2.default)(previousGregorianDate, place);
        hoursAfterSunset = (gregorianDate - _gregorianSunset) / MillisPerHour;
      }
      var month = Math.floor(daysSinceNawRuz / 19);

      if (month > 19) {
        throw Error('Corrupt date');
      }

      if (month < 18) {
        var day = daysSinceNawRuz % 19 + 1;
        return new BadiDate(badiYear, month, day, hoursAfterSunset, place);
      }

      // month === 18 || month === 19
      var daysAfterMulk = daysSinceNawRuz - 18 * 19;
      var nextGregorianNawRuz = (0, _getGregorianDateForNawRuz2.default)(gregorianYear + 1);
      var daysInYear = (nextGregorianNawRuz - gregorianNawRuz) / MillisPerDay;
      var interclaryDays = daysInYear - 19 * 19;
      // Check if we are in ayyam-i-ha.
      return daysAfterMulk < interclaryDays ? new BadiDate(badiYear, 18, daysAfterMulk + 1, hoursAfterSunset, place) : new BadiDate(badiYear, 19, daysAfterMulk + 1 - interclaryDays, hoursAfterSunset, place);
    }
  }]);

  function BadiDate(year, month, day, hoursAfterSunset, place) {
    _classCallCheck(this, BadiDate);

    this._year = year;
    this._month = month;
    this._day = day;
    this._hoursAfterSunset = hoursAfterSunset;
    this._place = place;
  }

  _createClass(BadiDate, [{
    key: 'getYear',
    value: function getYear() {
      return this._year;
    }
  }, {
    key: 'getMonthName',
    value: function getMonthName() {
      return MonthNames[this._month];
    }
  }, {
    key: 'getMonth',
    value: function getMonth() {
      return this._month;
    }
  }, {
    key: 'getDay',
    value: function getDay() {
      return this._day;
    }
  }, {
    key: 'getHoursAfterSunset',
    value: function getHoursAfterSunset() {
      return this._hoursAfterSunset;
    }
  }, {
    key: 'getPlace',
    value: function getPlace() {
      return this._place;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this._day + ' ' + this.getMonthName() + ' ' + this.year;
    }
  }, {
    key: 'compare',
    value: function compare(other) {
      return (this._year - other._year) * 400 + (this._month - other._month) * 19 + (this._day - other._day);
    }
  }, {
    key: 'equals',
    value: function equals(other) {
      return this.compare(other) === 0;
    }
  }, {
    key: 'toGregorianDate',
    value: function toGregorianDate() {
      if (this.getMonth() > 19) {
        throw Error('Corrupt state in BadiDate.getMonth()');
      }

      // Month 18 is Interclary Days, this is a special case.
      if (this.getMonth() < 19) {
        var gregorianYear = gregorianFromBadiYear(this.getYear());
        var gregorianNawRuz = (0, _getGregorianDateForNawRuz2.default)(gregorianYear);
        // QUESTION: Why are we subtracting 2 days?
        var _daysToAdd = this.getMonth() * 19 + this.getDay() - 2;
        var _gregorianStartOfDay = (0, _incrementGregorianDays2.default)(gregorianNawRuz, _daysToAdd);
        var _gregorianSunset2 = (0, _getGregorianDateForSunset2.default)(_gregorianStartOfDay, this.getPlace());
        return (0, _incrementGregorianDays2.default)(_gregorianSunset2, this.getHoursAfterSunset() / 24);
      }

      // this.getMonth() === 19
      var gregorianEnd = gregorianFromBadiYear(this.getYear() + 1);
      var nextYearNawRuz = (0, _getGregorianDateForNawRuz2.default)(gregorianEnd);
      // QUESTION: Why are we subtracting 2 days?
      var daysToAdd = this.getDay() - 19 - 2; // Subtract 1 month.
      var gregorianStartOfDay = new Date(nextYearNawRuz.getTime() + daysToAdd * MillisPerDay);
      var gregorianSunset = (0, _getGregorianDateForSunset2.default)(gregorianStartOfDay, this.getPlace());
      return (0, _incrementGregorianDays2.default)(gregorianSunset, this.getHoursAfterSunset() / 24);
    }
  }]);

  return BadiDate;
}();

exports.default = BadiDate;


function badiFromGregorianYear(year) {
  return year - 1844 + 1;
}

function gregorianFromBadiYear(year) {
  return year - 1 + 1844;
}

var MonthNames = ['Bahá', 'Jalál', 'Jamál', '‘Aẓamat', 'Núr', 'Raḥmat', 'Kalimát', 'Kamál', 'Asmá’', '‘Izzat', 'Mashíyyat', '‘Ilm', 'Qudrat', 'Qawl', 'Masá’il', 'Sharaf', 'Sulṭán', 'Mulk', 'Ayyám-i-Há', '‘Alá’'];