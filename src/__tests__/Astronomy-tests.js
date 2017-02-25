
import { getNawRuzTestUTCDates, getTwinBirthdaysTestUTCDates } from '../testUtils';
import { getUTCDateForNawRuzOnYear, getUTCDateForTwinBirthdaysOnYear } from '../Astronomy';

describe('Astronomy', () => {

  it('getUTCDateForNawRuzOnYear calculates Naw Ruz correctly', () => {
    getNawRuzTestUTCDates().forEach(nawRuzUTCDate => {
      const UTCYear = nawRuzUTCDate.getFullYear();
      const actual = getUTCDateForNawRuzOnYear(UTCYear);
      expect(actual).toEqual(nawRuzUTCDate);
    });

  });

  it('getUTCDateForTwinBirthdaysOnYear calculates birthdays correctly', () => {
    getTwinBirthdaysTestUTCDates().forEach(birthdaysUTCDate => {
      const UTCYear = birthdaysUTCDate.getFullYear();
      const actual = getUTCDateForTwinBirthdaysOnYear(UTCYear);
      expect(actual).toEqual(birthdaysUTCDate);
    });
  });

});
