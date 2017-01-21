
const MillisPerDay = 1000 * 60 * 60 * 24;

export default function incrementGregorianDays(gregorianDate, days) {
  return new Date(gregorianDate.getTime() + days * MillisPerDay);
}
