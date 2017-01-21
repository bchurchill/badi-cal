
import LocationMap from './_LocationMap';

import getGregorianDateForNawRuz from './_getGregorianDateForNawRuz';
import getGregorianDateForNextNewMoon from './_getGregorianDateForNextNewMoon';
import getGregorianDateForSunset from './_getGregorianDateForSunset';
import incrementGregorianDays from './_incrementGregorianDays';

/**
 * Twin birthdays occur at Sunset in tehran 8 new moons after Naw Ruz.
 */
export default function getGregorianDateForTwinBirthdays(gregorianYear) {
  const gregorianNawRuz = getGregorianDateForNawRuz(gregorianYear);

  // QUESTION: Why are we getting sunset for naw ruz date? Is it not already
  // sunset?
  let gregorian8NewMoons =
    getGregorianDateForSunset(gregorianNawRuz, LocationMap.Tehran);
  for (let i = 0; i < 8; ++i) {
    gregorian8NewMoons = getGregorianDateForNextNewMoon(gregorian8NewMoons);
  }

  const gregorianSunset =
    getGregorianDateForSunset(gregorian8NewMoons, LocationMap.Tehran);
  gregorian8NewMoons = (gregorian8NewMoons < gregorianSunset)
    ? incrementGregorianDays(gregorian8NewMoons, 1)
    : incrementGregorianDays(gregorian8NewMoons, 2);

  // QUESTION: Why are we setting to sunset in previous line if we are just
  // getting the day in the next line.
  gregorian8NewMoons =
    getGregorianDateForSunset(gregorian8NewMoons, LocationMap.Tehran);
  return new Date(Date.UTC(
    gregorian8NewMoons.getUTCFullYear(),
    gregorian8NewMoons.getUTCMonth(),
    gregorian8NewMoons.getUTCDate(),
  ));
}
