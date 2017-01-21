
import LocationMap from './_LocationMap';
import Stellafane from './extern/stellafane';

import getGregorianDateForSunset from './_getGregorianDateForSunset';

export default function gregorianDateForNawRuz(gregorianYear) {

  // Step 0: Follow to the UHJ
  // In 2026, the equinox is less than a minute from sunset. The
  // algorithms from Meeus which we're using don't give accuraccy
  // better than one minute, and don't give us the right answer. The
  // UHJ has said that Naw Ruz this day is on the 21st.
  if(gregorianYear == 2026) {
    return new Date(Date.UTC(2026, 2, 21));
  }

  // Step 1: find UTC time of the equinox
  const equinoxGregorianDate = Stellafane.vernal_equinox(gregorianYear);

  // Step 2: Find Tehran's sunset on the day of the equinox
  const sunsetGregorianDate = getGregorianDateForSunset(
    equinoxGregorianDate,
    LocationMap.Tehran,
  );

  // Step 3: Find the final day.
  return equinoxGregorianDate < sunsetGregorianDate
    ? new Date(Date.UTC(
      equinoxGregorianDate.getUTCFullYear(),
      equinoxGregorianDate.getUTCMonth(),
      equinoxGregorianDate.getUTCDate(),
    ))
    : new Date(Date.UTC(
      equinoxGregorianDate.getUTCFullYear(),
      equinoxGregorianDate.getUTCMonth(),
      // NOTE: Date class handles the case where the day spills to the
      // next month.
      equinoxGregorianDate.getUTCDate() + 1,
    ));
}
