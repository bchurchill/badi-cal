

import BlueYonder from './extern/blueyonder';
import LocationMap from './LocationMap';
import Stellafane from './extern/stellafane';

const MillisPerDay = 1000 * 60 * 60 * 24;

/**
 * Increment a gregorian date by the number of days specified.
 */
export function incrementGregorianDays(gregorianDate, days) {
  return new Date(gregorianDate.getTime() + days * MillisPerDay);
}

/**
 * Finds the time (sunset in Tehran) that twin birthdays start. Twin birthdays
 * occur at Sunset in tehran 8 new moons after Naw Ruz.
 */
export function getUTCDateForTwinBirthdaysOnYear(gregorianYear) {
  const gregorianNawRuz = getUTCDateForNawRuzOnYear(gregorianYear);

  let UTCNewMoons =
    getUTCDateForSunsetOnDate(gregorianNawRuz, LocationMap.Tehran);
  for (let i = 0; i < 8; ++i) {
    UTCNewMoons = getUTCDateForNextNewMoonFromDate(UTCNewMoons);
  }

  const UTCSunset =
    getUTCDateForSunsetOnDate(UTCNewMoons, LocationMap.Tehran);
  if (UTCNewMoons < UTCSunset) {
    UTCNewMoons = incrementGregorianDays(UTCNewMoons, 1);
  }
  else {
    UTCNewMoons = incrementGregorianDays(UTCNewMoons, 2);
  }

  UTCNewMoons = getUTCDateForSunsetOnDate(UTCNewMoons, LocationMap.Tehran);
  return new Date(Date.UTC(
    UTCNewMoons.getUTCFullYear(),
    UTCNewMoons.getUTCMonth(),
    UTCNewMoons.getUTCDate(),
  ));
}

export function getUTCDateForSunsetOnDate(gregorianDate, place) {

  const sunsetTime = BlueYonder.SunRiseSet(
    gregorianDate.getUTCFullYear(),
    gregorianDate.getUTCMonth() + 1,
    gregorianDate.getUTCDate(),
    place.latitude,
    place.longitude,
  )[1];

  const sunsetHours = Math.floor(sunsetTime);
  const sunsetMinutes = Math.floor((sunsetTime - sunsetHours) * 60);
  const sunsetSeconds =
    Math.floor(((sunsetTime - sunsetHours) * 60 - sunsetMinutes) * 60);

  return new Date(Date.UTC(
    gregorianDate.getUTCFullYear(),
    gregorianDate.getUTCMonth(),
    gregorianDate.getUTCDate(),
    sunsetHours,
    sunsetMinutes,
    sunsetSeconds,
  ));

}

/**
 * Takes a date and returns the date of the next new moon. This function is
 * recursive.  A client should call this function with two identical parameters.
 *
 * The detailed contract is this: find the first new moon during or after the
 * lunar cycle containing 'date' but occurring after the time 'min'.
 */
export function getUTCDateForNextNewMoonFromDate(UTCDate) {
  return recurse(UTCDate, UTCDate);
}

function recurse(UTCDate, minUTCDate) {
  const quarters = BlueYonder.MoonQuarters(
    UTCDate.getUTCFullYear(),
    UTCDate.getUTCMonth() + 1, // Month 0-based to 1-based indexing
    UTCDate.getUTCDate(),
    0,
  );
  const newMoonDateComponents = BlueYonder.jdtocd(quarters[0]);
  const UTCNewMoon = new Date(Date.UTC(
    newMoonDateComponents[0],     // Year
    newMoonDateComponents[1] - 1, // Month: 1-based to 0-based indexing
    newMoonDateComponents[2],     // Day
    newMoonDateComponents[4],     // Hour
    newMoonDateComponents[5],     // Minute
    newMoonDateComponents[6],     // Second
  ));

  if (UTCNewMoon > minUTCDate) {
    return UTCNewMoon;
  }
  return recurse(incrementGregorianDays(minUTCDate, 30), minUTCDate);
}


/**
 * Gets the day of Naw Ruz in a given gregorian year.  It returns the day at
 * 00:00:00 UTC.
 */
export function getUTCDateForNawRuzOnYear(gregorianYear) {

  // Step 0: Follow to the UHJ
  // In 2026, the equinox is less than a minute from sunset. The
  // algorithms from Meeus which we're using don't give accuraccy
  // better than one minute, and don't give us the right answer. The
  // UHJ has said that Naw Ruz this day is on the 21st.
  if(gregorianYear == 2026) {
    return new Date(Date.UTC(2026, 2, 21));
  }

  // Step 1: find UTC time of the equinox
  const UTCEquinox = Stellafane.vernal_equinox(gregorianYear);

  // Step 2: Find Tehran's sunset on the day of the equinox
  const UTCSunset = getUTCDateForSunsetOnDate(UTCEquinox, LocationMap.Tehran);

  // Step 3: Find the final day.
  if (UTCEquinox < UTCSunset) {
    return new Date(Date.UTC(
      UTCEquinox.getUTCFullYear(),
      UTCEquinox.getUTCMonth(),
      UTCEquinox.getUTCDate(),
    ));
  }
  return new Date(Date.UTC(
    UTCEquinox.getUTCFullYear(),
    UTCEquinox.getUTCMonth(),
    // NOTE: Date class handles the case where the day spills to the
    // next month.
    UTCEquinox.getUTCDate() + 1,
  ));
}
