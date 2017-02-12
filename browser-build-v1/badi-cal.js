/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _BadiDate = __webpack_require__(2);

	var _BadiDate2 = _interopRequireDefault(_BadiDate);

	var _blueyonder = __webpack_require__(7);

	var _blueyonder2 = _interopRequireDefault(_blueyonder);

	var _HolyDays = __webpack_require__(9);

	var _HolyDays2 = _interopRequireDefault(_HolyDays);

	var _LocationMap = __webpack_require__(4);

	var _LocationMap2 = _interopRequireDefault(_LocationMap);

	var _stellafane = __webpack_require__(5);

	var _stellafane2 = _interopRequireDefault(_stellafane);

	var _getGregorianDateForNawRuz = __webpack_require__(3);

	var _getGregorianDateForNawRuz2 = _interopRequireDefault(_getGregorianDateForNawRuz);

	var _getGregorianDateForNextNewMoon = __webpack_require__(10);

	var _getGregorianDateForNextNewMoon2 = _interopRequireDefault(_getGregorianDateForNextNewMoon);

	var _getGregorianDateForSunset = __webpack_require__(6);

	var _getGregorianDateForSunset2 = _interopRequireDefault(_getGregorianDateForSunset);

	var _getGregorianDateForTwinBirthdays = __webpack_require__(11);

	var _getGregorianDateForTwinBirthdays2 = _interopRequireDefault(_getGregorianDateForTwinBirthdays);

	var _incrementGregorianDays = __webpack_require__(8);

	var _incrementGregorianDays2 = _interopRequireDefault(_incrementGregorianDays);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* eslint-disable camelcase */

	/*
	 * NOTE: Running this module will cause side-effects to happen!
	 *
	 * This module is meant specifically for browser environments! If you are using
	 * another environment (Node JS, React Native, etc...), please use the newer
	 * version of this API.
	 */

	if (typeof window === 'undefined') {
	  throw Error('This version of badi-cal is only supported within browsers');
	}

	// -----------------------------------------------------------------------------
	//
	// BADI DATE V1
	//
	// -----------------------------------------------------------------------------

	function BadiDateV1(badiYear, badiMonth, badiDay, hoursAfterSunset, place) {
	  this.year = badiYear;
	  this.month = badiMonth;
	  this.day = badiDay;
	  this.hours = hoursAfterSunset;
	  this.place = place;
	}

	BadiDateV1.prototype.monthNames = ['Bahá', 'Jalál', 'Jamál', '‘Aẓamat', 'Núr', 'Raḥmat', 'Kalimát', 'Kamál', 'Asmá’', '‘Izzat', 'Mashíyyat', '‘Ilm', 'Qudrat', 'Qawl', 'Masá’il', 'Sharaf', 'Sulṭán', 'Mulk', 'Ayyám-i-Há', '‘Alá’'];

	BadiDateV1.prototype.toString = function () {
	  return this.day + ' ' + this.monthToString() + ' ' + this.year;
	};

	BadiDateV1.prototype.monthToString = function () {
	  return this.monthNames[this.month];
	};

	BadiDateV1.prototype.compare = function (other) {
	  return (this.year - other.year) * 400 + (this.month - other.month) * 19 + (this.day - other.day);
	};

	// -----------------------------------------------------------------------------
	//
	// LOCATION
	//
	// -----------------------------------------------------------------------------

	function Location(latitude, longitude) {
	  this.latitude = latitude;
	  this.longitude = longitude;
	}

	Location.prototype.toString = function () {
	  return '(' + this.latitude + ', ' + this.longitude + ')';
	};

	// -----------------------------------------------------------------------------
	//
	// DAY UI OBJ
	//
	// -----------------------------------------------------------------------------

	function DayUIObj(title, startDate, endDate, badiDate, type) {
	  this.title = title;
	  this.start_date = startDate.adjustDay();
	  this.end_date = endDate.adjustDay();
	  this.badi_date = badiDate;
	  this.type = type;
	}

	DayUIObj.prototype.toString = function () {
	  var start = this.start_date.toLocaleDateString();
	  var end = this.end_date.toLocaleDateString();
	  return this.title + ': sunset of ' + start + ' to sunset of ' + end;
	};

	// -----------------------------------------------------------------------------
	//
	// UTILS
	//
	// -----------------------------------------------------------------------------

	function badiDateFromBadiDateV1(badiDateV1) {
	  return new _BadiDate2.default(badiDateV1.year, badiDateV1.month, badiDateV1.day, badiDateV1.hours, badiDateV1.place);
	}

	function badiDateV1FromBadiDate(badiDate) {
	  return new BadiDateV1(badiDate.getYear(), badiDate.getMonth(), badiDate.getDay(), badiDate.getHoursAfterSunset(), badiDate.getPlace());
	}

	// -----------------------------------------------------------------------------
	//
	// DATE PROTOTYPE CHANGES
	//
	// -----------------------------------------------------------------------------

	/** Add a fixed number of days to a Date object. */
	Date.prototype.addDays = function (days) {
	  // don't want to setDate() because this will factor in local timezones
	  // and mess up UTC computations
	  return (0, _incrementGregorianDays2.default)(this, days);
	};

	/** Adjust a Date object by the user's timezone offset */
	Date.prototype.adjustDay = function () {
	  // Typically, if you look at a date object, it gives you the time
	  // and day in UTC. If you want to extract the mm/dd/yyyy date from
	  // such an object, you need to be careful to make sure you get the
	  // date from the right timezone, because it's different in different
	  // places. This method adjusts a date object as follows: it moves
	  // it into the forward or the past, so that the day in UTC matches
	  // what the day in localtime originally was. This way, if you want
	  // to find what day of the month it is in localtime (for example)
	  // you can compute someDate.adjustDay().getDay(), and it will give
	  // your the right one. </oof>
	  return new Date(this.getTime() + this.getTimezoneOffset() * 60 * 1000);
	};

	// -----------------------------------------------------------------------------
	//
	// BadiData and BadiCal
	//
	// -----------------------------------------------------------------------------

	var BadiData = {

	  tehran_latitude: _LocationMap2.default.Tehran.latitude,

	  tehran_longitude: _LocationMap2.default.Tehran.longitude,

	  tehran: _LocationMap2.default.Tehran,

	  holy_days: _HolyDays2.default

	};

	var BadiCal = {
	  Location: Location,

	  BadiDate: BadiDateV1,

	  find_sunset: function find_sunset(gregorianDate, place) {
	    return (0, _getGregorianDateForSunset2.default)(gregorianDate, place);
	  },
	  tehran_sunset: function tehran_sunset(gregorianDate) {
	    return (0, _getGregorianDateForSunset2.default)(gregorianDate, _LocationMap2.default.Tehran);
	  },
	  find_naw_ruz: function find_naw_ruz(gregorianYear) {
	    return (0, _getGregorianDateForNawRuz2.default)(gregorianYear);
	  },
	  badi_year_to_gregorian: function badi_year_to_gregorian(badiYear) {
	    return badiYear - 1 + 1844;
	  },
	  gregorian_year_to_badi: function gregorian_year_to_badi(gregorianYear) {
	    return gregorianYear - 1844 + 1;
	  },
	  badi_to_gregorian: function badi_to_gregorian(badiDateV1) {
	    return badiDateFromBadiDateV1(badiDateV1).toGregorianDate();
	  },
	  gregorian_to_badi: function gregorian_to_badi(gregorianDate, place) {
	    var badiDate = _BadiDate2.default.fromGregorianDate(gregorianDate, place);
	    return badiDateV1FromBadiDate(badiDate);
	  },


	  // QUESTION: Why do we need a min date?
	  next_new_moon: function next_new_moon(gregorianDate, minGregorianDate) {
	    return (0, _getGregorianDateForNextNewMoon2.default)(gregorianDate > minGregorianDate ? gregorianDate : minGregorianDate);
	  },
	  find_birthdays: function find_birthdays(gregorianYear) {
	    return (0, _getGregorianDateForTwinBirthdays2.default)(gregorianYear);
	  },


	  DayUIObj: DayUIObj,

	  find_days: function find_days(gregorianStartDate, gregorianEndDate) {
	    // 1. Find start / end badi year
	    // QUESTION: Why are we adding / subtracting year
	    var badiStartYear = BadiCal.gregorian_year_to_badi(gregorianStartDate.getUTCFullYear()) - 1;
	    var badiEndYear = BadiCal.gregorian_year_to_badi(gregorianEndDate.getUTCFullYear()) + 1;

	    var uiObjects = [];

	    var _loop = function _loop(badiYear) {
	      // 2. Find all Holy Days fixed to the Solar Calendar.
	      _HolyDays2.default.forEach(function (holyDay) {
	        var badiDate = new BadiDateV1(badiYear, holyDay.month, holyDay.day, 12, _LocationMap2.default.Tehran);
	        var gregorianDate = BadiCal.badi_to_gregorian(badiDate);
	        var label = holyDay.suspend ? 'Holy Day - Work Suspended' : 'Holy Day';
	        var uiObject = new DayUIObj(holyDay.name, (0, _incrementGregorianDays2.default)(gregorianDate, -1), gregorianDate, badiDate, label);
	        uiObjects.push(uiObject);
	      });

	      // 3. Find the first day of each month.
	      for (var i = 0; i <= 19; ++i) {
	        var badiDate = new BadiDateV1(badiYear, i, 1, 12, _LocationMap2.default.Tehran);
	        var gregorianStart = (0, _incrementGregorianDays2.default)(BadiCal.badi_to_gregorian(badiDate), -1);
	        var uiObject = void 0;
	        if (i !== 18) {
	          var gregorianEnd = (0, _incrementGregorianDays2.default)(gregorianStart, 19);
	          uiObject = new DayUIObj('Month of ' + badiDate.monthToString(), gregorianStart, gregorianEnd, badiDate, 'Month');
	        } else {
	          var badiDateNextMonth = new BadiDateV1(badiYear, i + 1, 1, 12, _LocationMap2.default.Tehran);
	          var _gregorianEnd = (0, _incrementGregorianDays2.default)(BadiCal.badi_to_gregorian(badiDateNextMonth), -1);
	          uiObject = new DayUIObj('Ayyám-i-Há', gregorianStart, _gregorianEnd, badiDate, 'Month');
	        }
	        uiObjects.push(uiObject);
	      }

	      // 4. Birth of the Báb and Birth of Bahá'u'lláh
	      var gregorianBirthday = BadiCal.find_birthdays(BadiCal.badi_year_to_gregorian(badiYear));
	      var badiBirthday1 = BadiCal.gregorian_to_badi(gregorianBirthday, _LocationMap2.default.Tehran);
	      var badiBirthday2 = BadiCal.gregorian_to_badi((0, _incrementGregorianDays2.default)(gregorianBirthday, 1), _LocationMap2.default.Tehran);
	      var uiObject1 = new DayUIObj('Birth of the Báb', (0, _incrementGregorianDays2.default)(gregorianBirthday, -1), gregorianBirthday, badiBirthday1, 'Holy Day - Work Suspended');
	      var uiObject2 = new DayUIObj('Birth of the Bahá’u’lláh', gregorianBirthday, (0, _incrementGregorianDays2.default)(gregorianBirthday, 1), badiBirthday2, 'Holy Day - Work Suspended');
	      uiObjects.push(uiObject1, uiObject2);
	    };

	    for (var badiYear = badiStartYear; badiYear <= badiEndYear; ++badiYear) {
	      _loop(badiYear);
	    }

	    // 5. Filter through these to find those that are actually in provided date
	    // range.
	    uiObjects = uiObjects.filter(function (uiObject) {
	      var startDateInRange = gregorianStartDate <= uiObject.start_date && gregorianEndDate >= uiObject.start_date;
	      var endDateInRange = gregorianStartDate <= uiObject.end_date && gregorianEndDate >= uiObject.end_date;
	      return startDateInRange || endDateInRange;
	    });

	    // 6. Sort by Gregorian Date.
	    uiObjects = uiObjects.sort(function (x, y) {
	      if (x.start_date < y.start_date) {
	        return -1;
	      } else if (x.start_date.getTime() === y.start_date.getTime()) {
	        return 0;
	      }
	      return 1;
	    });

	    return uiObjects;
	  }
	};

	// -----------------------------------------------------------------------------
	//
	// GLOBAL NAMESPACE
	//
	// -----------------------------------------------------------------------------

	window.EquinoxCalc = _stellafane2.default;
	window.BlueYonder = _blueyonder2.default;
	window.BadiCal = BadiCal;
	window.BadiData = BadiData;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _getGregorianDateForNawRuz = __webpack_require__(3);

	var _getGregorianDateForNawRuz2 = _interopRequireDefault(_getGregorianDateForNawRuz);

	var _getGregorianDateForSunset = __webpack_require__(6);

	var _getGregorianDateForSunset2 = _interopRequireDefault(_getGregorianDateForSunset);

	var _incrementGregorianDays = __webpack_require__(8);

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = gregorianDateForNawRuz;

	var _LocationMap = __webpack_require__(4);

	var _LocationMap2 = _interopRequireDefault(_LocationMap);

	var _stellafane = __webpack_require__(5);

	var _stellafane2 = _interopRequireDefault(_stellafane);

	var _getGregorianDateForSunset = __webpack_require__(6);

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

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  Tehran: { latitude: 35.6944, longitude: 51.4215 }
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	/**
	The following code is brought to you by:
	<!--
	Stellafane Equinox & Solsticew Calculator for http://www.Stellafane.com
	2004-Mar-07 KHS Created by Ken Slater
	2006-Jun-15 KHS: New page format
	2008-Mar-21 KHS: Fixed to work with Safari
	2012-Feb-04 KHS: Updated to HTML5
	Copyright 1999-2012 The Springfield Telescope Makers, Inc., All Rights Reserved.
	-->

	It's been modified in 2015 by Berkeley Churchill for the Badi Calendar app
	*/

	var EquinoxCalc = {

	  vernal_equinox: function vernal_equinox(year) {
	    return EquinoxCalc.calcEquiSol(1, year);
	  },

	  //-----Utility Funtions------------------------------------------------------------
	  INT: function INT(n) {
	    return Math.floor(n);
	  }, // Emulates BASIC's INT Funtion
	  POW2: function POW2(n) {
	    return Math.pow(n, 2);
	  }, // Square a number
	  POW3: function POW3(n) {
	    return Math.pow(n, 3);
	  }, // Cube a number
	  POW4: function POW4(n) {
	    return Math.pow(n, 4);
	  }, // Number to the 4th power
	  COS: function COS(deg) {
	    // Cosine function with degrees as input
	    return Math.cos(deg * Math.PI / 180);
	  },

	  //-----Calculate and Display a single event for a single year (Either a Equiniox or Solstice)
	  // Meeus Astronmical Algorithms Chapter 27
	  calcEquiSol: function calcEquiSol(i, year) {
	    var k = i - 1;
	    var str;
	    var JDE0 = EquinoxCalc.calcInitial(k, year); // Initial estimate of date of event
	    var T = (JDE0 - 2451545.0) / 36525;
	    var W = 35999.373 * T - 2.47;
	    var dL = 1 + 0.0334 * EquinoxCalc.COS(W) + 0.0007 * EquinoxCalc.COS(2 * W);
	    var S = EquinoxCalc.periodic24(T);
	    var JDE = JDE0 + 0.00001 * S / dL; // This is the answer in Julian Emphemeris Days
	    var TDT = EquinoxCalc.fromJDtoUTC(JDE); // Convert Julian Days to TDT in a Date Object
	    var UTC = EquinoxCalc.fromTDTtoUTC(TDT); // Correct TDT to UTC, both as Date Objects
	    return UTC;
	  }, // End calcEquiSol

	  //-----Calcualte an initial guess as the JD of the Equinox or Solstice of a Given Year
	  // Meeus Astronmical Algorithms Chapter 27
	  calcInitial: function calcInitial(k, year) {
	    // Valid for years 1000 to 3000
	    var JDE0 = 0,
	        Y = (year - 2000) / 1000;
	    switch (k) {
	      case 0:
	        JDE0 = 2451623.80984 + 365242.37404 * Y + 0.05169 * EquinoxCalc.POW2(Y) - 0.00411 * EquinoxCalc.POW3(Y) - 0.00057 * EquinoxCalc.POW4(Y);break;
	      case 1:
	        JDE0 = 2451716.56767 + 365241.62603 * Y + 0.00325 * EquinoxCalc.POW2(Y) + 0.00888 * EquinoxCalc.POW3(Y) - 0.00030 * EquinoxCalc.POW4(Y);break;
	      case 2:
	        JDE0 = 2451810.21715 + 365242.01767 * Y - 0.11575 * EquinoxCalc.POW2(Y) + 0.00337 * EquinoxCalc.POW3(Y) + 0.00078 * EquinoxCalc.POW4(Y);break;
	      case 3:
	        JDE0 = 2451900.05952 + 365242.74049 * Y - 0.06223 * EquinoxCalc.POW2(Y) - 0.00823 * EquinoxCalc.POW3(Y) + 0.00032 * EquinoxCalc.POW4(Y);break;
	    }
	    return JDE0;
	  }, // End calcInitial

	  //-----Calculate 24 Periodic Terms----------------------------------------------------
	  // Meeus Astronmical Algorithms Chapter 27
	  periodic24: function periodic24(T) {
	    var A = new Array(485, 203, 199, 182, 156, 136, 77, 74, 70, 58, 52, 50, 45, 44, 29, 18, 17, 16, 14, 12, 12, 12, 9, 8);
	    var B = new Array(324.96, 337.23, 342.08, 27.85, 73.14, 171.52, 222.54, 296.72, 243.58, 119.81, 297.17, 21.02, 247.54, 325.15, 60.93, 155.12, 288.79, 198.04, 199.76, 95.39, 287.11, 320.81, 227.73, 15.45);
	    var C = new Array(1934.136, 32964.467, 20.186, 445267.112, 45036.886, 22518.443, 65928.934, 3034.906, 9037.513, 33718.147, 150.678, 2281.226, 29929.562, 31555.956, 4443.417, 67555.328, 4562.452, 62894.029, 31436.921, 14577.848, 31931.756, 34777.259, 1222.114, 16859.074);
	    var S = 0;
	    for (var i = 0; i < 24; i++) {
	      S += A[i] * EquinoxCalc.COS(B[i] + C[i] * T);
	    }
	    return S;
	  },

	  //-----Correct TDT to UTC----------------------------------------------------------------
	  fromTDTtoUTC: function fromTDTtoUTC(tobj) {
	    // from Meeus Astronmical Algroithms Chapter 10
	    // Correction lookup table has entry for every even year between TBLfirst and TBLlast
	    var TBLfirst = 1620,
	        TBLlast = 2002; // Range of years in lookup table
	    var TBL = new Array( // Corrections in Seconds
	    /*1620*/121, 112, 103, 95, 88, 82, 77, 72, 68, 63, 60, 56, 53, 51, 48, 46, 44, 42, 40, 38,
	    /*1660*/35, 33, 31, 29, 26, 24, 22, 20, 18, 16, 14, 12, 11, 10, 9, 8, 7, 7, 7, 7,
	    /*1700*/7, 7, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11,
	    /*1740*/11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16,
	    /*1780*/16, 16, 16, 16, 16, 16, 15, 15, 14, 13,
	    /*1800*/13.1, 12.5, 12.2, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 11.9, 11.6, 11.0, 10.2, 9.2, 8.2,
	    /*1830*/7.1, 6.2, 5.6, 5.4, 5.3, 5.4, 5.6, 5.9, 6.2, 6.5, 6.8, 7.1, 7.3, 7.5, 7.6,
	    /*1860*/7.7, 7.3, 6.2, 5.2, 2.7, 1.4, -1.2, -2.8, -3.8, -4.8, -5.5, -5.3, -5.6, -5.7, -5.9,
	    /*1890*/-6.0, -6.3, -6.5, -6.2, -4.7, -2.8, -0.1, 2.6, 5.3, 7.7, 10.4, 13.3, 16.0, 18.2, 20.2,
	    /*1920*/21.1, 22.4, 23.5, 23.8, 24.3, 24.0, 23.9, 23.9, 23.7, 24.0, 24.3, 25.3, 26.2, 27.3, 28.2,
	    /*1950*/29.1, 30.0, 30.7, 31.4, 32.2, 33.1, 34.0, 35.0, 36.5, 38.3, 40.2, 42.2, 44.5, 46.5, 48.5,
	    /*1980*/50.5, 52.5, 53.8, 54.9, 55.8, 56.9, 58.3, 60.0, 61.6, 63.0, 63.8, 64.3); /*2002 last entry*/
	    // Values for Delta T for 2000 thru 2002 from NASA
	    var deltaT = 0; // deltaT = TDT - UTC (in Seconds)
	    var Year = tobj.getUTCFullYear();
	    var t = (Year - 2000) / 100; // Centuries from the epoch 2000.0

	    if (Year >= TBLfirst && Year <= TBLlast) {
	      // Find correction in table
	      if (Year % 2) {
	        // Odd year - interpolate
	        deltaT = (TBL[(Year - TBLfirst - 1) / 2] + TBL[(Year - TBLfirst + 1) / 2]) / 2;
	      } else {
	        // Even year - direct table lookup
	        deltaT = TBL[(Year - TBLfirst) / 2];
	      }
	    } else if (Year < 948) {
	      deltaT = 2177 + 497 * t + 44.1 * EquinoxCalc.POW2(t);
	    } else if (Year >= 948) {
	      deltaT = 102 + 102 * t + 25.3 * EquinoxCalc.POW2(t);
	      if (Year >= 2000 && Year <= 2100) {
	        // Special correction to avoid discontinurity in 2000
	        deltaT += 0.37 * (Year - 2100);
	      }
	    } else {
	      alert("Error: TDT to UTC correction not computed");
	    }
	    return new Date(tobj.getTime() - deltaT * 1000); // JavaScript native time is in milliseonds
	  }, // End fromTDTtoUTC

	  //-----Julian Date to UTC Date Object----------------------------------------------------
	  // Meeus Astronmical Algorithms Chapter 7
	  fromJDtoUTC: function fromJDtoUTC(JD) {
	    // JD = Julian Date, possible with fractional days
	    // Output is a JavaScript UTC Date Object
	    var A, alpha;
	    var Z = EquinoxCalc.INT(JD + 0.5); // Integer JD's
	    var F = JD + 0.5 - Z; // Fractional JD's
	    if (Z < 2299161) {
	      A = Z;
	    } else {
	      alpha = EquinoxCalc.INT((Z - 1867216.25) / 36524.25);
	      A = Z + 1 + alpha - EquinoxCalc.INT(alpha / 4);
	    }
	    var B = A + 1524;
	    var C = EquinoxCalc.INT((B - 122.1) / 365.25);
	    var D = EquinoxCalc.INT(365.25 * C);
	    var E = EquinoxCalc.INT((B - D) / 30.6001);
	    var DT = B - D - EquinoxCalc.INT(30.6001 * E) + F; // Day of Month with decimals for time
	    var Mon = E - (E < 13.5 ? 1 : 13); // Month Number
	    var Yr = C - (Mon > 2.5 ? 4716 : 4715); // Year
	    var Day = EquinoxCalc.INT(DT); // Day of Month without decimals for time
	    var H = 24 * (DT - Day); // Hours and fractional hours
	    var Hr = EquinoxCalc.INT(H); // Integer Hours
	    var M = 60 * (H - Hr); // Minutes and fractional minutes
	    var Min = EquinoxCalc.INT(M); // Integer Minutes
	    var Sec = EquinoxCalc.INT(60 * (M - Min)); // Integer Seconds (Milliseconds discarded)
	    //Create and set a JavaScript Date Object and return it
	    var theDate = new Date(0);
	    theDate.setUTCFullYear(Yr, Mon - 1, Day);
	    theDate.setUTCHours(Hr, Min, Sec);
	    return theDate;
	  } //End fromJDtoUTC

	};

	exports.default = EquinoxCalc;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = getGregorianDateForSunset;

	var _blueyonder = __webpack_require__(7);

	var _blueyonder2 = _interopRequireDefault(_blueyonder);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function getGregorianDateForSunset(gregorianDate, place) {

	  var sunsetTime = _blueyonder2.default.SunRiseSet(gregorianDate.getUTCFullYear(), gregorianDate.getUTCMonth() + 1, gregorianDate.getUTCDate(), place.latitude, place.longitude)[1];

	  var sunsetHours = Math.floor(sunsetTime);
	  var sunsetMinutes = Math.floor((sunsetTime - sunsetHours) * 60);
	  var sunsetSeconds = Math.floor(((sunsetTime - sunsetHours) * 60 - sunsetMinutes) * 60);

	  return new Date(Date.UTC(gregorianDate.getUTCFullYear(), gregorianDate.getUTCMonth(), gregorianDate.getUTCDate(), sunsetHours, sunsetMinutes, sunsetSeconds));
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// Utility functions for astronomical programming.
	// JavaScript by Peter Hayes http://www.peter-hayes.freeserve.co.uk/
	// Copyright 2001-2002
	// This code is made freely available but please keep this notice.
	// I accept no liability for any errors in my coding but please
	// let me know of any errors you find. My address is on my home page.

	// Modifed (placed in namespace) by Berkeley Churchill March 2015

	var BlueYonder = {};

	function dayno(year, month, day, hours) {
	  // Day number is a modified Julian date, day 0 is 2000 January 0.0
	  // which corresponds to a Julian date of 2451543.5
	  var d = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) + Math.floor(275 * month / 9) + day - 730530 + hours / 24;
	  return d;
	}

	function julian(year, month, day, hours) {
	  return dayno(year, month, day, hours) + 2451543.5;
	}

	BlueYonder.jdtocd = function (jd) {
	  // The calendar date from julian date
	  // Returns year, month, day, day of week, hours, minutes, seconds
	  var Z = Math.floor(jd + 0.5);
	  var F = jd + 0.5 - Z;
	  if (Z < 2299161) {
	    var A = Z;
	  } else {
	    var alpha = Math.floor((Z - 1867216.25) / 36524.25);
	    var A = Z + 1 + alpha - Math.floor(alpha / 4);
	  }
	  var B = A + 1524;
	  var C = Math.floor((B - 122.1) / 365.25);
	  var D = Math.floor(365.25 * C);
	  var E = Math.floor((B - D) / 30.6001);
	  var d = B - D - Math.floor(30.6001 * E) + F;
	  if (E < 14) {
	    var month = E - 1;
	  } else {
	    var month = E - 13;
	  }
	  if (month > 2) {
	    var year = C - 4716;
	  } else {
	    var year = C - 4715;
	  }
	  var day = Math.floor(d);
	  var h = (d - day) * 24;
	  var hours = Math.floor(h);
	  var m = (h - hours) * 60;
	  var minutes = Math.floor(m);
	  var seconds = Math.round((m - minutes) * 60);
	  if (seconds >= 60) {
	    minutes = minutes + 1;seconds = seconds - 60;
	  }
	  if (minutes >= 60) {
	    hours = hours + 1;minutes = 0;
	  }
	  var dw = Math.floor(jd + 1.5) - 7 * Math.floor((jd + 1.5) / 7);
	  return new Array(year, month, day, dw, hours, minutes, seconds);
	};

	function local_sidereal(year, month, day, hours, lon) {
	  // Compute local siderial time in degrees
	  // year, month, day and hours are the Greenwich date and time
	  // lon is the observers longitude
	  var d = dayno(year, month, day, hours);
	  var lst = 98.9818 + 0.985647352 * d + hours * 15 + lon;
	  return rev(lst) / 15;
	}

	function radtoaa(ra, dec, year, month, day, hours, lat, lon) {
	  // convert ra and dec to altitude and azimuth
	  // year, month, day and hours are the Greenwich date and time
	  // lat and lon are the observers latitude and longitude
	  var lst = local_sidereal(year, month, day, hours, lon);
	  var x = cosd(15.0 * (lst - ra)) * cosd(dec);
	  var y = sind(15.0 * (lst - ra)) * cosd(dec);
	  var z = sind(dec);
	  // rotate so z is the local zenith
	  var xhor = x * sind(lat) - z * cosd(lat);
	  var yhor = y;
	  var zhor = x * cosd(lat) + z * sind(lat);
	  var azimuth = rev(atan2d(yhor, xhor) + 180.0); // so 0 degrees is north
	  var altitude = atan2d(zhor, Math.sqrt(xhor * xhor + yhor * yhor));
	  return new Array(altitude, azimuth);
	}

	// Utility functions for date and time programming.
	// JavaScript by Peter Hayes
	// http://www.aphayes.pwp.blueyonder.co.uk/
	// Copyright 2001-2010
	// This code is made freely available but please keep this notice.
	// I accept no liability for any errors in my coding but please
	// let me know of any errors you find. My address is on my home page.

	//  Javascript 1.2 includes getFullYear but Netscape 4.6 does not supply it.

	function getFullYear(now) {
	  var year = now.getYear();
	  if (year == 0) {
	    year = 2000;
	  };
	  if (year < 1900) {
	    year = year + 1900;
	  };
	  return year;
	}

	function datestring(year, month, day) {
	  // provides a locale independent format - year:month:day
	  var datestr = "";datestr += year;
	  datestr += (month < 10 ? ":0" : ":") + month;
	  datestr += (day < 10 ? ":0" : ":") + day;
	  return datestr;
	}

	function hmstring(t) {
	  // takes hours and returns hh:mm
	  var hours = t;
	  while (hours >= 24) {
	    hours -= 24;
	  }
	  while (hours < 0) {
	    hours += 24;
	  }
	  var minutes = Math.round(60.0 * (hours - Math.floor(hours)));
	  hours = Math.floor(hours);
	  if (minutes >= 60) {
	    hours += 1;minutes -= 60;
	  }
	  if (hours >= 24) {
	    hours -= 24;
	  }
	  var hmstr = t < 0 ? "-" : "";
	  hmstr += (hours < 10 ? "0" : "") + hours;
	  hmstr += (minutes < 10 ? ":0" : ":") + minutes;
	  return hmstr;
	}

	function hmsstring(t) {
	  // takes hours and returns hh:mm:ss
	  var hours = Math.abs(t);
	  var minutes = 60.0 * (hours - Math.floor(hours));
	  hours = Math.floor(hours);
	  var seconds = Math.round(60.0 * (minutes - Math.floor(minutes)));
	  minutes = Math.floor(minutes);
	  if (seconds >= 60) {
	    minutes += 1;seconds -= 60;
	  }
	  if (minutes >= 60) {
	    hours += 1;minutes -= 60;
	  }
	  if (hours >= 24) {
	    hours -= 24;
	  }
	  var hmsstr = t < 0 ? "-" : "";
	  hmsstr += (hours < 10 ? "0" : "") + hours;
	  hmsstr += (minutes < 10 ? ":0" : ":") + minutes;
	  hmsstr += (seconds < 10 ? ":0" : ":") + seconds;
	  return hmsstr;
	}

	// Extensions to the Math routines - Trig routines in degrees
	// JavaScript by Peter Hayes http://www.peter-hayes.freeserve.co.uk/
	// Copyright 2001-2002

	function rev(angle) {
	  return angle - Math.floor(angle / 360.0) * 360.0;
	}
	function sind(angle) {
	  return Math.sin(angle * Math.PI / 180.0);
	}
	function cosd(angle) {
	  return Math.cos(angle * Math.PI / 180.0);
	}
	function tand(angle) {
	  return Math.tan(angle * Math.PI / 180.0);
	}
	function asind(c) {
	  return 180.0 / Math.PI * Math.asin(c);
	}
	function acosd(c) {
	  return 180.0 / Math.PI * Math.acos(c);
	}
	function atan2d(y, x) {
	  return 180.0 / Math.PI * Math.atan(y / x) - 180.0 * (x < 0);
	}

	function anglestring(a, circle) {
	  // returns a in degrees as a string degrees:minutes
	  // circle is true for range between 0 and 360 and false for -90 to +90
	  var ar = Math.round(a * 60) / 60;
	  var deg = Math.abs(ar);
	  var min = Math.round(60.0 * (deg - Math.floor(deg)));
	  if (min >= 60) {
	    deg += 1;min = 0;
	  }
	  var anglestr = "";
	  if (!circle) anglestr += ar < 0 ? "-" : "+";
	  if (circle) anglestr += Math.floor(deg) < 100 ? "0" : "";
	  anglestr += (Math.floor(deg) < 10 ? "0" : "") + Math.floor(deg);
	  anglestr += (min < 10 ? ":0" : ":") + min;
	  return anglestr;
	}

	// JavaScript by Peter Hayes http://www.aphayes.pwp.blueyonder.co.uk/
	// Copyright 2001-2010
	// Unless otherwise stated this code is based on the methods in
	// Astronomical Algorithms, first edition, by Jean Meeus
	// Published by Willmann-Bell, Inc.
	// This code is made freely available but please keep this notice.
	// The calculations are approximate but should be good enough for general use,
	// I accept no responsibility for errors in astronomy or coding.

	// WARNING moonrise code changed on 6 May 2003 to correct a systematic error
	// these are now local times NOT UTC as the original code did.

	// Meeus first edition table 45.A Longitude and distance of the moon

	var T45AD = new Array(0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 1, 0, 2, 0, 0, 4, 0, 4, 2, 2, 1, 1, 2, 2, 4, 2, 0, 2, 2, 1, 2, 0, 0, 2, 2, 2, 4, 0, 3, 2, 4, 0, 2, 2, 2, 4, 0, 4, 1, 2, 0, 1, 3, 4, 2, 0, 1, 2, 2);

	var T45AM = new Array(0, 0, 0, 0, 1, 0, 0, -1, 0, -1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, -1, 0, 0, 0, 1, 0, -1, 0, -2, 1, 2, -2, 0, 0, -1, 0, 0, 1, -1, 2, 2, 1, -1, 0, 0, -1, 0, 1, 0, 1, 0, 0, -1, 2, 1, 0, 0);

	var T45AMP = new Array(1, -1, 0, 2, 0, 0, -2, -1, 1, 0, -1, 0, 1, 0, 1, 1, -1, 3, -2, -1, 0, -1, 0, 1, 2, 0, -3, -2, -1, -2, 1, 0, 2, 0, -1, 1, 0, -1, 2, -1, 1, -2, -1, -1, -2, 0, 1, 4, 0, -2, 0, 2, 1, -2, -3, 2, 1, -1, 3, -1);

	var T45AF = new Array(0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, -2, 2, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, -2, 2, 0, 2, 0, 0, 0, 0, 0, 0, -2, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, 0, -2);

	var T45AL = new Array(6288774, 1274027, 658314, 213618, -185116, -114332, 58793, 57066, 53322, 45758, -40923, -34720, -30383, 15327, -12528, 10980, 10675, 10034, 8548, -7888, -6766, -5163, 4987, 4036, 3994, 3861, 3665, -2689, -2602, 2390, -2348, 2236, -2120, -2069, 2048, -1773, -1595, 1215, -1110, -892, -810, 759, -713, -700, 691, 596, 549, 537, 520, -487, -399, -381, 351, -340, 330, 327, -323, 299, 294, 0);

	var T45AR = new Array(-20905355, -3699111, -2955968, -569925, 48888, -3149, 246158, -152138, -170733, -204586, -129620, 108743, 104755, 10321, 0, 79661, -34782, -23210, -21636, 24208, 30824, -8379, -16675, -12831, -10445, -11650, 14403, -7003, 0, 10056, 6322, -9884, 5751, 0, -4950, 4130, 0, -3958, 0, 3258, 2616, -1897, -2117, 2354, 0, 0, -1423, -1117, -1571, -1739, 0, -4421, 0, 0, 0, 0, 1165, 0, 0, 8752);

	// Meeus table 45B latitude of the moon

	var T45BD = new Array(0, 0, 0, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 4, 0, 0, 0, 1, 0, 0, 0, 1, 0, 4, 4, 0, 4, 2, 2, 2, 2, 0, 2, 2, 2, 2, 4, 2, 2, 0, 2, 1, 1, 0, 2, 1, 2, 0, 4, 4, 1, 4, 1, 4, 2);

	var T45BM = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 1, -1, -1, -1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 1, 0, -1, -2, 0, 1, 1, 1, 1, 1, 0, -1, 1, 0, -1, 0, 0, 0, -1, -2);

	var T45BMP = new Array(0, 1, 1, 0, -1, -1, 0, 2, 1, 2, 0, -2, 1, 0, -1, 0, -1, -1, -1, 0, 0, -1, 0, 1, 1, 0, 0, 3, 0, -1, 1, -2, 0, 2, 1, -2, 3, 2, -3, -1, 0, 0, 1, 0, 1, 1, 0, 0, -2, -1, 1, -2, 2, -2, -1, 1, 1, -1, 0, 0);

	var T45BF = new Array(1, 1, -1, -1, 1, -1, 1, 1, -1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 3, 1, 1, 1, -1, -1, -1, 1, -1, 1, -3, 1, -3, -1, -1, 1, -1, 1, -1, 1, 1, 1, 1, -1, 3, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1);

	var T45BL = new Array(5128122, 280602, 277693, 173237, 55413, 46271, 32573, 17198, 9266, 8822, 8216, 4324, 4200, -3359, 2463, 2211, 2065, -1870, 1828, -1794, -1749, -1565, -1491, -1475, -1410, -1344, -1335, 1107, 1021, 833, 777, 671, 607, 596, 491, -451, 439, 422, 421, -366, -351, 331, 315, 302, -283, -229, 223, 223, -220, -220, -185, 181, -177, 176, 166, -164, 132, -119, 115, 107);

	// MoonPos calculates the Moon position, based on Meeus chapter 45

	function MoonPos(year, month, day, hours) {
	  // julian date
	  var jd = julian(year, month, day, hours);
	  var T = (jd - 2451545.0) / 36525;
	  var T2 = T * T;
	  var T3 = T2 * T;
	  var T4 = T3 * T;
	  // Moons mean longitude L'
	  var LP = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841.0 - T4 / 65194000.0;
	  // Moons mean elongation
	  var D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868.0 - T4 / 113065000.0;
	  // Suns mean anomaly
	  var M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000.0;
	  // Moons mean anomaly M'
	  var MP = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699.0 - T4 / 14712000.0;
	  // Moons argument of latitude
	  var F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000.0 + T4 / 863310000.0;

	  // Additional arguments
	  var A1 = 119.75 + 131.849 * T;
	  var A2 = 53.09 + 479264.290 * T;
	  var A3 = 313.45 + 481266.484 * T;
	  var E = 1 - 0.002516 * T - 0.0000074 * T2;
	  var E2 = E * E;
	  // Sums of periodic terms from table 45.A and 45.B
	  var Sl = 0.0;
	  var Sr = 0.0;
	  for (var i = 0; i < 60; i++) {
	    var Eterm = 1;
	    if (Math.abs(T45AM[i]) == 1) Eterm = E;
	    if (Math.abs(T45AM[i]) == 2) Eterm = E2;
	    Sl += T45AL[i] * Eterm * sind(rev(T45AD[i] * D + T45AM[i] * M + T45AMP[i] * MP + T45AF[i] * F));
	    Sr += T45AR[i] * Eterm * cosd(rev(T45AD[i] * D + T45AM[i] * M + T45AMP[i] * MP + T45AF[i] * F));
	  }
	  var Sb = 0.0;
	  for (var i = 0; i < 60; i++) {
	    var Eterm = 1;
	    if (Math.abs(T45BM[i]) == 1) Eterm = E;
	    if (Math.abs(T45BM[i]) == 2) Eterm = E2;
	    Sb += T45BL[i] * Eterm * sind(rev(T45BD[i] * D + T45BM[i] * M + T45BMP[i] * MP + T45BF[i] * F));
	  }
	  // Additional additive terms
	  Sl = Sl + 3958 * sind(rev(A1)) + 1962 * sind(rev(LP - F)) + 318 * sind(rev(A2));
	  Sb = Sb - 2235 * sind(rev(LP)) + 382 * sind(rev(A3)) + 175 * sind(rev(A1 - F)) + 175 * sind(rev(A1 + F)) + 127 * sind(rev(LP - MP)) - 115 * sind(rev(LP + MP));
	  // geocentric longitude, latitude and distance
	  var mglong = rev(LP + Sl / 1000000.0);
	  var mglat = rev(Sb / 1000000.0);
	  if (mglat > 180.0) mglat = mglat - 360;
	  var mr = Math.round(385000.56 + Sr / 1000.0);
	  // Obliquity of Ecliptic
	  var obl = 23.4393 - 3.563E-9 * (jd - 2451543.5);
	  // RA and dec
	  var ra = rev(atan2d(sind(mglong) * cosd(obl) - tand(mglat) * sind(obl), cosd(mglong))) / 15.0;
	  var dec = rev(asind(sind(mglat) * cosd(obl) + cosd(mglat) * sind(obl) * sind(mglong)));
	  if (dec > 180.0) dec = dec - 360;
	  return new Array(ra, dec, mr);
	}

	function MoonRise(year, month, day, TZ, latitude, longitude) {
	  // returns an array containing rise and set times or one of the
	  // following codes.
	  // -1 rise or set event not found and moon was down at 00:00
	  // -2 rise or set event not found and moon was up   at 00:00
	  // WARNING code changes on 6/7 May 2003 these are now local times
	  // NOT UTC and rise/set not found codes changed.
	  var hours = 0;
	  var riseset = new Array();
	  // elh is the elevation at the hour elhdone is true if elh calculated
	  var elh = new Array();
	  var elhdone = new Array();
	  for (var i = 0; i <= 24; i++) {
	    elhdone[i] = false;
	  }
	  // Compute the moon elevation at start and end of day
	  // store elevation at the hours in an array elh to save search time
	  var rad = MoonPos(year, month, day, hours - TZ);
	  var altaz = radtoaa(rad[0], rad[1], year, month, day, hours - TZ, latitude, longitude);
	  elh[0] = altaz[0];elhdone[0] = true;
	  // set the return code to allow for always up or never rises
	  if (elh[0] > 0.0) {
	    riseset = new Array(-2, -2);
	  } else {
	    riseset = new Array(-1, -1);
	  }
	  hours = 24;
	  rad = MoonPos(year, month, day, hours - TZ);
	  altaz = radtoaa(rad[0], rad[1], year, month, day, hours - TZ, latitude, longitude);
	  elh[24] = altaz[0];elhdone[24] = true;
	  // search for moonrise and set
	  for (var rise = 0; rise < 2; rise++) {
	    var found = false;
	    var hfirst = 0;
	    var hlast = 24;
	    // Try a binary chop on the hours to speed the search
	    while (Math.ceil((hlast - hfirst) / 2) > 1) {
	      hmid = hfirst + Math.round((hlast - hfirst) / 2);
	      if (!elhdone[hmid]) {
	        hours = hmid;
	        rad = MoonPos(year, month, day, hours - TZ);
	        altaz = radtoaa(rad[0], rad[1], year, month, day, hours - TZ, latitude, longitude);
	        elh[hmid] = altaz[0];elhdone[hmid] = true;
	      }
	      if (rise == 0 && elh[hfirst] <= 0.0 && elh[hmid] >= 0.0 || rise == 1 && elh[hfirst] >= 0.0 && elh[hmid] <= 0.0) {
	        hlast = hmid;found = true;continue;
	      }
	      if (rise == 0 && elh[hmid] <= 0.0 && elh[hlast] >= 0.0 || rise == 1 && elh[hmid] >= 0.0 && elh[hlast] <= 0.0) {
	        hfirst = hmid;found = true;continue;
	      }
	      break;
	    }
	    // If the binary chop did not find a 1 hour interval
	    if (hlast - hfirst > 1) {
	      for (var i = hfirst; i < hlast; i++) {
	        found = false;
	        if (!elhdone[i + 1]) {
	          hours = i + 1;
	          rad = MoonPos(year, month, day, hours - TZ);
	          altaz = radtoaa(rad[0], rad[1], year, month, day, hours - TZ, latitude, longitude);
	          elh[hours] = altaz[0];elhdone[hours] = true;
	        }
	        if (rise == 0 && elh[i] <= 0.0 && elh[i + 1] >= 0.0 || rise == 1 && elh[i] >= 0.0 && elh[i + 1] <= 0.0) {
	          hfirst = i;hlast = i + 1;found = true;break;
	        }
	      }
	    }
	    // simple linear interpolation for the minutes
	    if (found) {
	      var elfirst = elh[hfirst];var ellast = elh[hlast];
	      hours = hfirst + 0.5;
	      rad = MoonPos(year, month, day, hours - TZ);
	      altaz = radtoaa(rad[0], rad[1], year, month, day, hours - TZ, latitude, longitude);
	      // alert("day ="+day+" hour ="+hours+" altaz="+altaz[0]+" "+altaz[1]);
	      if (rise == 0 && altaz[0] <= 0.0) {
	        hfirst = hours;elfirst = altaz[0];
	      }
	      if (rise == 0 && altaz[0] > 0.0) {
	        hlast = hours;ellast = altaz[0];
	      }
	      if (rise == 1 && altaz[0] <= 0.0) {
	        hlast = hours;ellast = altaz[0];
	      }
	      if (rise == 1 && altaz[0] > 0.0) {
	        hfirst = hours;elfirst = altaz[0];
	      }
	      var eld = Math.abs(elfirst) + Math.abs(ellast);
	      riseset[rise] = hfirst + (hlast - hfirst) * Math.abs(elfirst) / eld;
	    }
	  } // End of rise/set loop
	  return riseset;
	}

	function MoonPhase(year, month, day, hours) {
	  // the illuminated percentage from Meeus chapter 46
	  var j = dayno(year, month, day, hours) + 2451543.5;
	  var T = (j - 2451545.0) / 36525;
	  var T2 = T * T;
	  var T3 = T2 * T;
	  var T4 = T3 * T;
	  // Moons mean elongation Meeus first edition
	  // var D=297.8502042+445267.1115168*T-0.0016300*T2+T3/545868.0-T4/113065000.0;
	  // Moons mean elongation Meeus second edition
	  var D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868.0 - T4 / 113065000.0;
	  // Moons mean anomaly M' Meeus first edition
	  // var MP=134.9634114+477198.8676313*T+0.0089970*T2+T3/69699.0-T4/14712000.0;
	  // Moons mean anomaly M' Meeus second edition
	  var MP = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699.0 - T4 / 14712000.0;
	  // Suns mean anomaly
	  var M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000.0;
	  // phase angle
	  var pa = 180.0 - D - 6.289 * sind(MP) + 2.1 * sind(M) - 1.274 * sind(2 * D - MP) - 0.658 * sind(2 * D) - 0.214 * sind(2 * MP) - 0.11 * sind(D);
	  return rev(pa);
	}

	BlueYonder.MoonQuarters = function (year, month, day) {
	  // returns an array of Julian Ephemeris Days (JDE) for
	  // new moon, first quarter, full moon and last quarter
	  // Meeus first edition chapter 47 with only the most larger additional corrections
	  // Meeus code calculate Terrestrial Dynamic Time
	  // TDT = UTC + (number of leap seconds) + 32.184
	  // At the end of June 2012 the 25th leap second was added
	  //
	  var quarters = new Array();
	  // k is an integer for new moon incremented by 0.25 for first quarter 0.5 for new etc.
	  var k = Math.floor((year + (month - 1 + day / 30) / 12 - 2000) * 12.3685);
	  // Time in Julian centuries since 2000.0
	  var T = k / 1236.85;
	  // Sun's mean anomaly
	  var M = rev(2.5534 + 29.10535669 * k - 0.0000218 * T * T);
	  // Moon's mean anomaly (M' in Meeus)
	  var MP = rev(201.5643 + 385.81693528 * k + 0.0107438 * T * T + 0.00001239 * T * T * T - 0.00000011 * T * T * T);
	  var E = 1 - 0.002516 * T - 0.0000074 * T * T;
	  // Moons argument of latitude
	  var F = rev(160.7108 + 390.67050274 * k - 0.0016341 * T * T - 0.00000227 * T * T * T + 0.000000011 * T * T * T * T);
	  // Longitude of ascending node of lunar orbit
	  var Omega = rev(124.7746 - 1.56375580 * k + 0.0020691 * T * T + 0.00000215 * T * T * T);
	  // The full planetary arguments include 14 terms, only used the 7 most significant
	  var A = new Array();
	  A[1] = rev(299.77 + 0.107408 * k - 0.009173 * T * T);
	  A[2] = rev(251.88 + 0.016321 * k);
	  A[3] = rev(251.83 + 26.651886 * k);
	  A[4] = rev(349.42 + 36.412478 * k);
	  A[5] = rev(84.88 + 18.206239 * k);
	  A[6] = rev(141.74 + 53.303771 * k);
	  A[7] = rev(207.14 + 2.453732 * k);

	  // New moon
	  var JDE0 = 2451550.09765 + 29.530588853 * k + 0.0001337 * T * T - 0.000000150 * T * T * T + 0.00000000073 * T * T * T * T;
	  // Correct for TDT since 1 July 2012
	  JDE0 = JDE0 - 57.184 / (24 * 60 * 60);
	  var JDE = JDE0 - 0.40720 * sind(MP) + 0.17241 * E * sind(M) + 0.01608 * sind(2 * MP) + 0.01039 * sind(2 * F) + 0.00739 * E * sind(MP - M) - 0.00514 * E * sind(MP + M) + 0.00208 * E * E * sind(2 * M) - 0.00111 * sind(MP - 2 * F) - 0.00057 * sind(MP + 2 * F) + 0.00056 * E * sind(2 * MP + M) - 0.00042 * sind(3 * MP) + 0.00042 * E * sind(M + 2 * F) + 0.00038 * E * sind(M - 2 * F) - 0.00024 * E * sind(2 * MP - M) - 0.00017 * sind(Omega) - 0.00007 * sind(MP + 2 * M);

	  quarters[0] = JDE + 0.000325 * sind(A[1]) + 0.000165 * sind(A[2]) + 0.000164 * sind(A[3]) + 0.000126 * sind(A[4]) + 0.000110 * sind(A[5]) + 0.000062 * sind(A[6]) + 0.000060 * sind(A[7]);

	  // The following code needs tidying up with a loop and conditionals for each quarter
	  // First Quarter k=k+0.25
	  JDE = JDE0 + 29.530588853 * 0.25;
	  M = rev(M + 29.10535669 * 0.25);
	  MP = rev(MP + 385.81693528 * 0.25);
	  F = rev(F + 390.67050274 * 0.25);
	  Omega = rev(Omega - 1.56375580 * 0.25);
	  A[1] = rev(A[1] + 0.107408 * 0.25);A[2] = rev(A[2] + 0.016321 * 0.25);A[3] = rev(A[3] + 26.651886 * 0.25);
	  A[4] = rev(A[4] + 36.412478 * 0.25);A[5] = rev(A[5] + 18.206239 * 0.25);A[6] = rev(A[6] + 53.303771 * 0.25);
	  A[7] = rev(A[7] + 2.453732 * 0.25);

	  JDE = JDE - 0.62801 * sind(MP) + 0.17172 * E * sind(M) - 0.01183 * E * sind(MP + M) + 0.00862 * sind(2 * MP) + 0.00804 * sind(2 * F) + 0.00454 * E * sind(MP - M) + 0.00204 * E * E * sind(2 * M) - 0.00180 * sind(MP - 2 * F) - 0.00070 * sind(MP + 2 * F) - 0.00040 * sind(3 * MP) - 0.00034 * E * sind(2 * MP - M) + 0.00032 * E * sind(M + 2 * F) + 0.00032 * E * sind(M - 2 * F) - 0.00028 * E * E * sind(MP + 2 * M) + 0.00027 * E * sind(2 * MP + M) - 0.00017 * sind(Omega);
	  // Next term is w add for first quarter & subtract for second
	  JDE = JDE + (0.00306 - 0.00038 * E * cosd(M) + 0.00026 * cosd(MP) - 0.00002 * cosd(MP - M) + 0.00002 * cosd(MP + M) + 0.00002 * cosd(2 * F));

	  quarters[1] = JDE + 0.000325 * sind(A[1]) + 0.000165 * sind(A[2]) + 0.000164 * sind(A[3]) + 0.000126 * sind(A[4]) + 0.000110 * sind(A[5]) + 0.000062 * sind(A[6]) + 0.000060 * sind(A[7]);

	  // Full moon k=k+0.5
	  JDE = JDE0 + 29.530588853 * 0.5;
	  // Already added 0.25 for first quarter
	  M = rev(M + 29.10535669 * 0.25);
	  MP = rev(MP + 385.81693528 * 0.25);
	  F = rev(F + 390.67050274 * 0.25);
	  Omega = rev(Omega - 1.56375580 * 0.25);
	  A[1] = rev(A[1] + 0.107408 * 0.25);A[2] = rev(A[2] + 0.016321 * 0.25);A[3] = rev(A[3] + 26.651886 * 0.25);
	  A[4] = rev(A[4] + 36.412478 * 0.25);A[5] = rev(A[5] + 18.206239 * 0.25);A[6] = rev(A[6] + 53.303771 * 0.25);
	  A[7] = rev(A[7] + 2.453732 * 0.25);

	  JDE = JDE - 0.40614 * sind(MP) + 0.17302 * E * sind(M) + 0.01614 * sind(2 * MP) + 0.01043 * sind(2 * F) + 0.00734 * E * sind(MP - M) - 0.00515 * E * sind(MP + M) + 0.00209 * E * E * sind(2 * M) - 0.00111 * sind(MP - 2 * F) - 0.00057 * sind(MP + 2 * F) + 0.00056 * E * sind(2 * MP + M) - 0.00042 * sind(3 * MP) + 0.00042 * E * sind(M + 2 * F) + 0.00038 * E * sind(M - 2 * F) - 0.00024 * E * sind(2 * MP - M) - 0.00017 * sind(Omega) - 0.00007 * sind(MP + 2 * M);

	  quarters[2] = JDE + 0.000325 * sind(A[1]) + 0.000165 * sind(A[2]) + 0.000164 * sind(A[3]) + 0.000126 * sind(A[4]) + 0.000110 * sind(A[5]) + 0.000062 * sind(A[6]) + 0.000060 * sind(A[7]);

	  // Last Quarter k=k+0.75
	  JDE = JDE0 + 29.530588853 * 0.75;
	  // Already added 0.5 for full moon
	  M = rev(M + 29.10535669 * 0.25);
	  MP = rev(MP + 385.81693528 * 0.25);
	  F = rev(F + 390.67050274 * 0.25);
	  Omega = rev(Omega - 1.56375580 * 0.25);
	  A[1] = rev(A[1] + 0.107408 * 0.25);A[2] = rev(A[2] + 0.016321 * 0.25);A[3] = rev(A[3] + 26.651886 * 0.25);
	  A[4] = rev(A[4] + 36.412478 * 0.25);A[5] = rev(A[5] + 18.206239 * 0.25);A[6] = rev(A[6] + 53.303771 * 0.25);
	  A[7] = rev(A[7] + 2.453732 * 0.25);

	  JDE = JDE - 0.62801 * sind(MP) + 0.17172 * E * sind(M) - 0.01183 * E * sind(MP + M) + 0.00862 * sind(2 * MP) + 0.00804 * sind(2 * F) + 0.00454 * E * sind(MP - M) + 0.00204 * E * E * sind(2 * M) - 0.00180 * sind(MP - 2 * F) - 0.00070 * sind(MP + 2 * F) - 0.00040 * sind(3 * MP) - 0.00034 * E * sind(2 * MP - M) + 0.00032 * E * sind(M + 2 * F) + 0.00032 * E * sind(M - 2 * F) - 0.00028 * E * E * sind(MP + 2 * M) + 0.00027 * E * sind(2 * MP + M) - 0.00017 * sind(Omega);
	  // Next term is w add for first quarter & subtract for second
	  JDE = JDE - (0.00306 - 0.00038 * E * cosd(M) + 0.00026 * cosd(MP) - 0.00002 * cosd(MP - M) + 0.00002 * cosd(MP + M) + 0.00002 * cosd(2 * F));

	  quarters[3] = JDE + 0.000325 * sind(A[1]) + 0.000165 * sind(A[2]) + 0.000164 * sind(A[3]) + 0.000126 * sind(A[4]) + 0.000110 * sind(A[5]) + 0.000062 * sind(A[6]) + 0.000060 * sind(A[7]);

	  return quarters;
	};
	// JavaScript by Peter Hayes
	// http://www.aphayes.pwp.blueyonder.co.uk/
	// Copyright 2001-2012
	// This code is made freely available but please keep this notice.
	// The calculations are approximate but should be good enough for general use,
	// I accept no responsibility for errors in astronomy or coding.

	BlueYonder.SunRiseSet = function (year, month, day, latitude, longitude) {
	  // Based on method in sci.astro FAQ by Paul Schlyter
	  // returns an array holding rise and set times in UTC hours
	  // NOT accurate at high latitudes
	  // latitude = your local latitude: north positive, south negative
	  // longitude = your local longitude: east positive, west negative
	  // Calculate the Suns position at noon local zone time
	  var d = dayno(year, month, day, 12.0 - longitude / 15);
	  var oblecl = 23.4393 - 3.563E-7 * d;
	  var w = 282.9404 + 4.70935E-5 * d;
	  var M = 356.0470 + 0.9856002585 * d;
	  var e = 0.016709 - 1.151E-9 * d;
	  var E = M + e * (180 / Math.PI) * sind(M) * (1.0 + e * cosd(M));
	  var A = cosd(E) - e;
	  var B = Math.sqrt(1 - e * e) * sind(E);
	  var slon = w + atan2d(B, A);
	  var sRA = atan2d(sind(slon) * cosd(oblecl), cosd(slon));
	  while (sRA < 0) {
	    sRA += 360;
	  }while (sRA > 360) {
	    sRA -= 360;
	  }sRA = sRA / 15;
	  var sDec = asind(sind(oblecl) * sind(slon));
	  // Time sun is on the meridian
	  var lst = local_sidereal(year, month, day, 12 - longitude / 15, longitude);
	  var MT = 12.0 - longitude / 15 + sRA - lst;
	  while (MT < 0) {
	    MT += 24;
	  }while (MT > 24) {
	    MT -= 24;
	  } // hour angle
	  var cHA0 = (sind(-0.833) - sind(latitude) * sind(sDec)) / (cosd(latitude) * cosd(sDec));
	  var HA0 = acosd(cHA0);
	  HA0 = rev(HA0) / 15;
	  // return rise and set times
	  return new Array(MT - HA0, MT + HA0);
	};

	exports.default = BlueYonder;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = incrementGregorianDays;

	var MillisPerDay = 1000 * 60 * 60 * 24;

	function incrementGregorianDays(gregorianDate, days) {
	  return new Date(gregorianDate.getTime() + days * MillisPerDay);
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = [{
	  name: 'Naw Ruz',
	  month: 0, //baha
	  day: 1,
	  suspend: true
	}, {
	  name: 'First Day of Ridván',
	  month: 1, //jalal
	  day: 13,
	  suspend: true
	}, {
	  name: 'Ninth Day of Ridván',
	  month: 2, //jamal
	  day: 2,
	  suspend: true
	}, {
	  name: 'Twelfth Day of Ridván',
	  month: 2, //jamal
	  day: 5,
	  suspend: true
	}, {
	  name: 'Declaration of the Báb',
	  month: 3, //azamat
	  day: 8,
	  suspend: true
	}, {
	  name: 'Ascension of Bahá’u’lláh',
	  month: 3, //azamat
	  day: 13,
	  suspend: true
	}, {
	  name: 'Martyrdom of the Báb',
	  month: 5, //rahmat
	  day: 17,
	  suspend: true
	}, {
	  name: 'Day of the Covenant',
	  month: 13, //qawl
	  day: 4,
	  suspend: false
	}, {
	  name: 'Ascension of ‘Abdu’l-Bahá',
	  month: 13, //qawl
	  day: 6,
	  suspend: false
	}];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = getGregorianDateForNextNewMoon;

	var _blueyonder = __webpack_require__(7);

	var _blueyonder2 = _interopRequireDefault(_blueyonder);

	var _incrementGregorianDays = __webpack_require__(8);

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

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = getGregorianDateForTwinBirthdays;

	var _LocationMap = __webpack_require__(4);

	var _LocationMap2 = _interopRequireDefault(_LocationMap);

	var _getGregorianDateForNawRuz = __webpack_require__(3);

	var _getGregorianDateForNawRuz2 = _interopRequireDefault(_getGregorianDateForNawRuz);

	var _getGregorianDateForNextNewMoon = __webpack_require__(10);

	var _getGregorianDateForNextNewMoon2 = _interopRequireDefault(_getGregorianDateForNextNewMoon);

	var _getGregorianDateForSunset = __webpack_require__(6);

	var _getGregorianDateForSunset2 = _interopRequireDefault(_getGregorianDateForSunset);

	var _incrementGregorianDays = __webpack_require__(8);

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

/***/ }
/******/ ]);