
jest
  .dontMock('../extern/blueyonder')
  .dontMock('../extern/stellafane')
  .dontMock('../_getGregorianDateForNawRuz')
  .dontMock('../_getGregorianDateForSunset');


import getGregorianDateForNawRuz from '../_getGregorianDateForNawRuz';

describe('_getGregorianDateForNawRuz', () => {

  it('gets the correct naw ruz date', () => {
    const mar212015 = new Date(Date.UTC(2015, 2, 21));
    expect(getGregorianDateForNawRuz(2015)).toEqual(mar212015);

    const mar202016 = new Date(Date.UTC(2016, 2, 20));
    expect(getGregorianDateForNawRuz(2016)).toEqual(mar202016);

    const mar202024 = new Date(Date.UTC(2024, 2, 20));
    expect(getGregorianDateForNawRuz(2024)).toEqual(mar202024);

    const mar212027 = new Date(Date.UTC(2027, 2, 21));
    expect(getGregorianDateForNawRuz(2027)).toEqual(mar212027);
  });

  it('handles the edge case of year 2026', () => {
    const nawRuz2026GregorianDate = new Date(Date.UTC(2026, 2, 21));
    expect(getGregorianDateForNawRuz(2026)).toEqual(nawRuz2026GregorianDate);
  });

});
