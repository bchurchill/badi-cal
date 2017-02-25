
import {
  getUTCDateForNawRuzOnYear,
  getUTCDateForSunsetOnDate,
  incrementGregorianDays,
} from './Astronomy';

const MillisPerHour = 1000 * 60 * 60;
const MillisPerDay = MillisPerHour * 24;

/**
 * Construct a date on the Badi Calendar.  Objects of this class just have a
 * 'year', 'month' and 'day' field, along with some helper functions and extra
 * data (e.g. names of the months)
 */
export default class BadiDate {

  static badiFromGregorianYear(year) { return (year - 1844) + 1; }

  static gregorianFromBadiYear(year) { return (year - 1) + 1844; }

  /**
   * Takes a Date and location and returns a BadiDate. badi_to_gregorian on the
   * returned value should produce an identical date object.
   */
  static fromGregorianDate(gregorianDate, place) {
    // TODO: THIS LOGIC SHOULD GET MOVED TO NORMALIZE METHOD!!!

    let gregorianYear = gregorianDate.getUTCFullYear();
    let gregorianNawRuz = getUTCDateForNawRuzOnYear(gregorianYear);
    if (gregorianDate < gregorianNawRuz) {
      gregorianYear -= 1;
      gregorianNawRuz = getUTCDateForNawRuzOnYear(gregorianYear);
    }
    const badiYear = BadiDate.badiFromGregorianYear(gregorianYear);

    let daysSinceNawRuz =
      Math.floor((gregorianDate - gregorianNawRuz) / MillisPerDay);
    let hoursAfterSunset = 0;

    // Count the days past Naw Ruz (@ 00:00:00 UTC) it is. If the sun
    // has already set on this day, we need to add one more day.
    if (getUTCDateForSunsetOnDate(gregorianDate, place) < gregorianDate) {
      daysSinceNawRuz += 1;
      const gregorianSunset = getUTCDateForSunsetOnDate(gregorianDate, place);
      hoursAfterSunset = (gregorianDate - gregorianSunset) / MillisPerHour;
    }
    else {
      const previousGregorianDate =
        new Date(gregorianDate.getTime() - MillisPerDay);
      const gregorianSunset =
        getUTCDateForSunsetOnDate(previousGregorianDate, place);
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
    const nextGregorianNawRuz = getUTCDateForNawRuzOnYear(gregorianYear + 1);
    const daysInYear = (nextGregorianNawRuz - gregorianNawRuz) / MillisPerDay;
    const interclaryDays = daysInYear - 19 * 19;
    // Check if we are in ayyam-i-ha.
    if (daysAfterMulk < interclaryDays) {
      return new BadiDate(
        badiYear,
        18,
        daysAfterMulk + 1,
        hoursAfterSunset,
        place,
      );
    }
    else {
      return new BadiDate(
        badiYear,
        19,
        daysAfterMulk + 1 - interclaryDays,
        hoursAfterSunset,
        place,
      );
    }
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


  /**
   * Returns a Date Object (which includes the time). Note that BadiDates
   * contain a latitude/longitude, and this latitude/longitude is used to
   * determine the corresponding UTC time.
   */
  toGregorianDate() {
    if (this.getMonth() > 19) {
      throw Error('Corrupt state in BadiDate.getMonth()');
    }

    // Month 18 is Interclary Days, this is a special case.
    if (this.getMonth() < 19) {
      const gregorianYear = BadiDate.gregorianFromBadiYear(this.getYear());
      const gregorianNawRuz = getUTCDateForNawRuzOnYear(gregorianYear);
      const daysToAdd = this.getMonth() * 19 + this.getDay() - 2;
      const gregorianStartOfDay =
        incrementGregorianDays(gregorianNawRuz, daysToAdd);
      const gregorianSunset = getUTCDateForSunsetOnDate(
        gregorianStartOfDay,
        this.getPlace(),
      );
      return incrementGregorianDays(
        gregorianSunset,
        this.getHoursAfterSunset() / 24,
      );
    }

    // this.getMonth() === 19
    const gregorianEnd = BadiDate.gregorianFromBadiYear(this.getYear() + 1);
    const nextYearNawRuz = getUTCDateForNawRuzOnYear(gregorianEnd);
    const daysToAdd = this.getDay() - 19 - 2; // Subtract 1 month.
    const gregorianStartOfDay = new Date(
      nextYearNawRuz.getTime() + daysToAdd * MillisPerDay,
    );
    const gregorianSunset = getUTCDateForSunsetOnDate(
      gregorianStartOfDay,
      this.getPlace(),
    );
    return incrementGregorianDays(
      gregorianSunset,
      this.getHoursAfterSunset() / 24,
    );
  }

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
