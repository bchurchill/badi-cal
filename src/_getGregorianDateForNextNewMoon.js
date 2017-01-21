
import BlueYonder from './extern/blueyonder';

import incrementGregorianDays from './_incrementGregorianDays';

export default function getGregorianDateForNextNewMoon(gregorianDate) {
  return recurse(gregorianDate, gregorianDate);
}

function recurse(gregorianDate, minGregorianDate) {
  const quarters = BlueYonder.MoonQuarters(
    gregorianDate.getUTCFullYear(),
    gregorianDate.getUTCMonth() + 1, // Month 0-based to 1-based indexing
    gregorianDate.getUTCDate(),
    0,
  );
  // QUESTION: What does this do?
  const newMoonDateComponents = BlueYonder.jdtocd(quarters[0]);
  const newMoonGregorianDate = new Date(Date.UTC(
    newMoonDateComponents[0],     // Year
    newMoonDateComponents[1] - 1, // Month 1-based to 0-based indexing
    newMoonDateComponents[2],     // Day
    newMoonDateComponents[4],     // Hour
    newMoonDateComponents[5],     // Minute
    newMoonDateComponents[6],     // Second
  ));

  // QUESTION: Why are we doing this?
  return (newMoonGregorianDate > minGregorianDate)
    ? newMoonGregorianDate
    : recurse(incrementGregorianDays(minGregorianDate, 30), minGregorianDate);
}
