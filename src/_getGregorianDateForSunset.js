
import BlueYonder from './extern/blueyonder';

export default function getGregorianDateForSunset(gregorianDate, place) {

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
