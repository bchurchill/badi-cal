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

import BadiDate from '../BadiDate';
import BlueYonder from '../extern/blueyonder';
import HolyDays from '../HolyDays';
import LocationMap from '../LocationMap';
import Stellafane from '../extern/stellafane';

import {
  getUTCDateForNawRuzOnYear,
  getUTCDateForNextNewMoonFromDate,
  getUTCDateForSunsetOnDate,
  getUTCDateForTwinBirthdaysOnYear,
  incrementGregorianDays,
} from '../Astronomy';

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

BadiDateV1.prototype.monthNames = [
  'Bahá',
  'Jalál',
  'Jamál',
  '‘Aẓamat',
  'Núr',
  'Raḥmat',
  'Kalimát',
  'Kamál',
  'Asmá’',
  '‘Izzat',
  'Mashíyyat',
  '‘Ilm',
  'Qudrat',
  'Qawl',
  'Masá’il',
  'Sharaf',
  'Sulṭán',
  'Mulk',
  'Ayyám-i-Há',
  '‘Alá’',
];

BadiDateV1.prototype.toString = function() {
  return `${this.day} ${this.monthToString()} ${this.year}`;
};

BadiDateV1.prototype.monthToString = function() {
  return this.monthNames[this.month];
};

BadiDateV1.prototype.compare = function(other) {
  return (
    (this.year - other.year) * 400 +
    (this.month - other.month) * 19 +
    (this.day - other.day)
  );
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

Location.prototype.toString = function() {
  return `(${this.latitude}, ${this.longitude})`;
}

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

DayUIObj.prototype.toString = function() {
  const start = this.start_date.toLocaleDateString();
  const end = this.end_date.toLocaleDateString();
  return `${this.title}: sunset of ${start} to sunset of ${end}`;
}

// -----------------------------------------------------------------------------
//
// UTILS
//
// -----------------------------------------------------------------------------

function badiDateFromBadiDateV1(badiDateV1) {
  return new BadiDate(
    badiDateV1.year,
    badiDateV1.month,
    badiDateV1.day,
    badiDateV1.hours,
    badiDateV1.place,
  );
}

function badiDateV1FromBadiDate(badiDate) {
  return new BadiDateV1(
    badiDate.getYear(),
    badiDate.getMonth(),
    badiDate.getDay(),
    badiDate.getHoursAfterSunset(),
    badiDate.getPlace(),
  );
}

// -----------------------------------------------------------------------------
//
// DATE PROTOTYPE CHANGES
//
// -----------------------------------------------------------------------------

/** Add a fixed number of days to a Date object. */
Date.prototype.addDays = function(days) {
    // don't want to setDate() because this will factor in local timezones
    // and mess up UTC computations
    return incrementGregorianDays(this, days);
}

/** Adjust a Date object by the user's timezone offset */
Date.prototype.adjustDay = function() {
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
  return new Date(this.getTime() + this.getTimezoneOffset()*60*1000);
}

// -----------------------------------------------------------------------------
//
// BadiData and BadiCal
//
// -----------------------------------------------------------------------------

const BadiData = {

  tehran_latitude: LocationMap.Tehran.latitude,

  tehran_longitude: LocationMap.Tehran.longitude,

  tehran: LocationMap.Tehran,

  holy_days: HolyDays,

};

const BadiCal = {
  Location,

  BadiDate: BadiDateV1,

  find_sunset(gregorianDate, place) {
    return getUTCDateForSunsetOnDate(gregorianDate, place);
  },

  tehran_sunset(gregorianDate) {
    return getUTCDateForSunsetOnDate(gregorianDate, LocationMap.Tehran);
  },

  find_naw_ruz(gregorianYear) {
    return getUTCDateForNawRuzOnYear(gregorianYear);
  },

  badi_year_to_gregorian(badiYear) {
    return (badiYear - 1) + 1844;
  },

  gregorian_year_to_badi(gregorianYear) {
    return (gregorianYear - 1844) + 1;
  },

  badi_to_gregorian(badiDateV1) {
    return badiDateFromBadiDateV1(badiDateV1).toGregorianDate();
  },

  gregorian_to_badi(gregorianDate, place) {
    const badiDate = BadiDate.fromGregorianDate(gregorianDate, place);
    return badiDateV1FromBadiDate(badiDate);
  },

  next_new_moon(gregorianDate, minGregorianDate) {
    return getUTCDateForNextNewMoonFromDate(
      gregorianDate > minGregorianDate ? gregorianDate : minGregorianDate,
    );
  },

  find_birthdays(gregorianYear) {
    return getUTCDateForTwinBirthdaysOnYear(gregorianYear);
  },

  DayUIObj,

  find_days(gregorianStartDate, gregorianEndDate) {
    // 1. Find start / end badi year
    const badiStartYear =
      BadiCal.gregorian_year_to_badi(gregorianStartDate.getUTCFullYear()) - 1;
    const badiEndYear =
      BadiCal.gregorian_year_to_badi(gregorianEndDate.getUTCFullYear()) + 1;

    let uiObjects = [];

    for (let badiYear = badiStartYear; badiYear <= badiEndYear; ++badiYear) {
      // 2. Find all Holy Days fixed to the Solar Calendar.
      HolyDays.forEach(holyDay => {
        const badiDate = new BadiDateV1(
          badiYear,
          holyDay.month,
          holyDay.day,
          12,
          LocationMap.Tehran,
        );
        const gregorianDate = BadiCal.badi_to_gregorian(badiDate);
        const label = holyDay.suspend
          ? 'Holy Day - Work Suspended'
          : 'Holy Day';
        const uiObject = new DayUIObj(
          holyDay.name,
          incrementGregorianDays(gregorianDate, -1),
          gregorianDate,
          badiDate,
          label,
        );
        uiObjects.push(uiObject)
      });

      // 3. Find the first day of each month.
      for (let i = 0; i <= 19; ++i) {
        const badiDate = new BadiDateV1(badiYear, i, 1, 12, LocationMap.Tehran);
        const gregorianStart = incrementGregorianDays(
          BadiCal.badi_to_gregorian(badiDate),
          -1
        );
        let uiObject;
        if (i !== 18) {
          const gregorianEnd = incrementGregorianDays(gregorianStart, 19);
          uiObject = new DayUIObj(
            `Month of ${badiDate.monthToString()}`,
            gregorianStart,
            gregorianEnd,
            badiDate,
            'Month',
          );
        }
        else {
          const badiDateNextMonth =
            new BadiDateV1(badiYear, i + 1, 1, 12, LocationMap.Tehran);
          const gregorianEnd = incrementGregorianDays(
            BadiCal.badi_to_gregorian(badiDateNextMonth),
            -1,
          );
          uiObject = new DayUIObj(
            'Ayyám-i-Há',
            gregorianStart,
            gregorianEnd,
            badiDate,
            'Month',
          );
        }
        uiObjects.push(uiObject);
      }

      // 4. Birth of the Báb and Birth of Bahá'u'lláh
      const gregorianBirthday =
        BadiCal.find_birthdays(BadiCal.badi_year_to_gregorian(badiYear));
      const badiBirthday1 = BadiCal.gregorian_to_badi(
        gregorianBirthday,
        LocationMap.Tehran,
      );
      const badiBirthday2 = BadiCal.gregorian_to_badi(
        incrementGregorianDays(gregorianBirthday, 1),
        LocationMap.Tehran,
      );
      const uiObject1 = new DayUIObj(
        'Birth of the Báb',
        incrementGregorianDays(gregorianBirthday, -1),
        gregorianBirthday,
        badiBirthday1,
        'Holy Day - Work Suspended',
      );
      const uiObject2 = new DayUIObj(
        'Birth of the Bahá’u’lláh',
        gregorianBirthday,
        incrementGregorianDays(gregorianBirthday, 1),
        badiBirthday2,
        'Holy Day - Work Suspended',
      );
      uiObjects.push(uiObject1, uiObject2);

    }

    // 5. Filter through these to find those that are actually in provided date
    // range.
    uiObjects = uiObjects.filter(uiObject => {
      const startDateInRange = (
        gregorianStartDate <= uiObject.start_date &&
        gregorianEndDate >= uiObject.start_date
      );
      const endDateInRange = (
        gregorianStartDate <= uiObject.end_date &&
        gregorianEndDate >= uiObject.end_date
      );
      return startDateInRange || endDateInRange;
    });

    // 6. Sort by Gregorian Date.
    uiObjects = uiObjects.sort((x, y) => {
      if (x.start_date < y.start_date) { return -1; }
      else if (x.start_date.getTime() === y.start_date.getTime()) { return 0; }
      return 1;
    });

    return uiObjects;
  },

};


// -----------------------------------------------------------------------------
//
// GLOBAL NAMESPACE
//
// -----------------------------------------------------------------------------

window.EquinoxCalc = Stellafane;
window.BlueYonder = BlueYonder;
window.BadiCal = BadiCal;
window.BadiData = BadiData;
