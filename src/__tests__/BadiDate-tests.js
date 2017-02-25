
import BadiDate from '../BadiDate';
import LocationMap from '../LocationMap';

import { getNawRuzTestUTCDates } from '../testUtils';

const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
const RAND_DATE_COUNT = 50;

describe('BadiDate', () => {

  it('calculates Naw Ruz when converting from Gregorian to Badi', () => {
    getNawRuzTestUTCDates(nawRuzUTCDate => {
      const gregorianYear = nawRuzUTCDate.getFullYear();
      const badiYear = BadiDate.badiFromGregorianYear(gregorianYear);
      const badiDate = new BadiDate(badiYear, 0, 1, 0, LocationMap.Tehran);
      let gregorianDate = badiDate.toGregorianDate(badiYear);
      gregorianDate = new Date(gregorianDate.getTime() + MILLIS_PER_DAY);
      gregorianDate.setUTCHours(0);
      gregorianDate.setUTCMinutes(0);
      gregorianDate.setUTCSeconds(0);
      gregorianDate.setUTCMilliseconds(0);
      expect(gregorianDate).toEqual(nawRuzUTCDate);
    });
  });

  it(`converts to and from ${RAND_DATE_COUNT} random gregorian dates`, () => {

    for(let i = 0; i < RAND_DATE_COUNT; i++) {
      const randomDate = new Date(
        Date.now() + (Math.random() * (MILLIS_PER_DAY * 365 * RAND_DATE_COUNT)),
      );
      // Choose a random location on earth
      // NOTE: We fail for extreme latitudes
      const latitude = Math.random() * 130 - 65;
      const longitude = Math.random() * 360 - 180;
      const randomPlace = { latitude, longitude };

      const badiDate = BadiDate.fromGregorianDate(randomDate, randomPlace);
      const orig = badiDate.toGregorianDate();
      expect(orig).toEqual(randomDate);
    }
  });

});
