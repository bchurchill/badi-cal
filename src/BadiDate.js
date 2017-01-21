
import getGregorianDateForNawRuz from './_getGregorianDateForNawRuz';
import getGregorianDateForSunset from './_getGregorianDateForSunset';
import incrementGregorianDays from './_incrementGregorianDays';

const MillisPerHour = 1000 * 60 * 60;
const MillisPerDay = MillisPerHour * 24;

export default class BadiDate {

  static fromGregorianDate(gregorianDate, place) {
    // TODO: THIS LOGIC SHOULD GET MOVED TO NORMALIZE METHOD!!!

    // QUESTION: We are getting the UTC year here, is that what we want?
    // Shouldn't we be getting the year in OUR timezone.
    let gregorianYear = gregorianDate.getUTCFullYear();
    let gregorianNawRuz = getGregorianDateForNawRuz(gregorianYear);
    if (gregorianDate < gregorianNawRuz) {
      gregorianYear -= 1;
      gregorianNawRuz = getGregorianDateForNawRuz(gregorianYear);
    }
    const badiYear = badiFromGregorianYear(gregorianYear);

    let daysSinceNawRuz =
      Math.floor((gregorianDate - gregorianNawRuz) / MillisPerDay);
    let hoursAfterSunset = 0;

    // Count the days past Naw Ruz (@ 00:00:00 UTC) it is. If the sun
    // has already set on this day, we need to add one more day.
    if (getGregorianDateForSunset(gregorianDate, place) < gregorianDate) {
      daysSinceNawRuz += 1;
      const gregorianSunset = getGregorianDateForSunset(gregorianDate, place);
      hoursAfterSunset = (gregorianDate - gregorianSunset) / MillisPerHour;
    }
    else {
      const previousGregorianDate =
        new Date(gregorianDate.getTime() - MillisPerDay);
      const gregorianSunset =
        getGregorianDateForSunset(previousGregorianDate, place);
      hoursAfterSunset = (gregorianDate - gregorianSunset) / MillisPerHour;
    }
    const month = Math.floor(daysSinceNawRuz / 19);

    if (month > 19) { throw Error('Corrupt date'); }

    if (month < 18) {
      const day = (daysSinceNawRuz % 19) + 1;
      return new BadiDate(badiYear, month, day, hoursAfterSunset, place);
    }

    // month === 18 || month === 19
    const daysAfterMulk = daysSinceNawRuz - 18 * 19;
    const nextGregorianNawRuz = getGregorianDateForNawRuz(gregorianYear + 1);
    const daysInYear = (nextGregorianNawRuz - gregorianNawRuz) / MillisPerDay;
    const interclaryDays = daysInYear - 19 * 19;
    // Check if we are in ayyam-i-ha.
    return daysAfterMulk < interclaryDays
      ? new BadiDate(badiYear, 18, daysAfterMulk + 1, hoursAfterSunset, place)
      : new BadiDate(
        badiYear,
        19,
        daysAfterMulk + 1 - interclaryDays,
        hoursAfterSunset,
        place,
      );
  }

  constructor(year, month, day, hoursAfterSunset, place) {
    this._year = year;
    this._month = month;
    this._day = day;
    this._hoursAfterSunset = hoursAfterSunset;
    this._place = place;
  }

  getYear() {
    return this._year;
  }

  getMonthName() {
    return MonthNames[this._month];
  }

  getMonth() {
    return this._month;
  }

  getDay() {
    return this._day;
  }

  getHoursAfterSunset() {
    return this._hoursAfterSunset;
  }

  getPlace() {
    return this._place;
  }

  toString() {
    return `${this._day} ${this.getMonthName()} ${this.year}`;
  }

  compare(other) {
    return (
      ((this._year - other._year) * 400) +
      ((this._month - other._month) * 19) +
      (this._day - other._day)
    );
  }

  equals(other) {
    return this.compare(other) === 0;
  }

  toGregorianDate() {
    if (this.getMonth() > 19) {
      throw Error('Corrupt state in BadiDate.getMonth()');
    }

    // Month 18 is Interclary Days, this is a special case.
    if (this.getMonth() < 19) {
      const gregorianYear = gregorianFromBadiYear(this.getYear());
      const gregorianNawRuz = getGregorianDateForNawRuz(gregorianYear);
      // QUESTION: Why are we subtracting 2 days?
      const daysToAdd = this.getMonth() * 19 + this.getDay() - 2;
      const gregorianStartOfDay =
        incrementGregorianDays(gregorianNawRuz, daysToAdd);
      const gregorianSunset = getGregorianDateForSunset(
        gregorianStartOfDay,
        this.getPlace(),
      );
      return incrementGregorianDays(
        gregorianSunset,
        this.getHoursAfterSunset() / 24,
      );
    }

    // this.getMonth() === 19
    const gregorianEnd = gregorianFromBadiYear(this.getYear() + 1);
    const nextYearNawRuz = getGregorianDateForNawRuz(gregorianEnd);
    // QUESTION: Why are we subtracting 2 days?
    const daysToAdd = this.getDay() - 19 - 2; // Subtract 1 month.
    const gregorianStartOfDay = new Date(
      nextYearNawRuz.getTime() + daysToAdd * MillisPerDay,
    );
    const gregorianSunset = getGregorianDateForSunset(
      gregorianStartOfDay,
      this.getPlace(),
    );
    return incrementGregorianDays(
      gregorianSunset,
      this.getHoursAfterSunset() / 24,
    );
  }

}

function badiFromGregorianYear(year) {
  return (year - 1844) + 1;
}

function gregorianFromBadiYear(year) {
  return (year - 1) + 1844;
}

const MonthNames = [
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
