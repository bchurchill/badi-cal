
Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

/** Returns the corresponding Badi year to Naw Ruz of this Gregorian Year */
function gregorian_to_badi(gregorian_year) {
  //1843 is not a mistake!!  1844 was year 1.
  return gregorian_year - 1843;
}

/** Returns the gregorian year in which the corresponding Badi year starts */
function badi_to_gregorian(badi_year) {
  return 1843 + badi_year;
}

/** Gets the day of Naw Ruz in a given gregorian year */
function find_naw_ruz(gregorian_year) {

  // Step 1: find UTC time of the equinox
  var equinox_utc = vernal_equinox(gregorian_year);

  // Step 2: find Tehran's sunset on the gregorian day with the equinox
  // Tehran is at 35°41′46″N 51°25′23″E
  var latitude = 35.6961;
  var longitude = 61.42306;

  var times = SunCalc.getTimes(equinox_utc, latitude, longitude);
  var sunset = times.sunset;
  var sunset_date = new Date(sunset.getFullYear(), sunset.getMonth(), sunset.getDate());
  // Note: that the gregorian date of 'sunset' may be different from
  // the gregorian date of 'equinox_utc' because of time zones. e.g.
  // 2015: equinox is Mar 20 10pm UTC, but Mar 21 2am in Tehran.
  // SunCalc correctly gets sunset for the right day, causing 'sunset'
  // to be Mar 21 7pm in Tehran.

  if(equinox_utc < times.sunset) {
    // If equinox before sunset, we take the gregorian date from the day of sunset
    return sunset_date;
  } else {
    // if equinox after sunet, we take the gregorian date from day after sunset
    return sunset_date.addDays(1);
  }
}

/** Gets the Gregorian start date of a given badi month */
function find_month_start(badi_year, badi_month) {
  if(badi_month < 18) {
    // normal computation
    var gregorian_start = badi_to_gregorian(badi_year);
    var naw_ruz = find_naw_ruz(gregorian_start);
    var add_days = badi_month*19;
    return naw_ruz.addDays(add_days);
  } else if (badi_month == 18) {
    // month of `Ala (the fast): compute from next gregorian year
    var gregorian_end = badi_to_gregorian(badi_year + 1);
    var naw_ruz = find_naw_ruz(gregorian_end);
    return naw_ruz.addDays(-19);
  } 

  // TODO: error handling code here
  return 0;
}

/** Gets the Gregorian date of a particular Badi day.  Note: month is 0-indexed, day is 1-indexed. */
function find_day(badi_year, badi_month, badi_day) {
  return find_month_start(badi_year, badi_month).addDays(badi_day-1);
}

var debug_string = "";
/** Finds the first gregorian day of the twin birthdays */
function find_birthdays(gregorian_year) {

  // Strategy: start with sunset of Naw Ruz in Tehran. Get the phase
  // of the moon. Then, iterate day-by-day and get the phase of the
  // moon at sunset in Tehran Whenever it drops, that means a new moon
  // has occurred; increment the count. If the count of new moons has
  // reached 8, then increment the day again. That's the first of the
  // twin birthdays.
  var latitude = 35.6961;
  var longitude = 61.42306;

  // Find the phase of the moon at sunset on Naw Ruz in Tehran
  var last_day = find_naw_ruz(gregorian_year);
  var last_sunset = SunCalc.getTimes(last_day, latitude, longitude).sunset;
  var phase = SunCalc.getMoonIllumination(last_sunset).phase;
  var new_moon_count = 0;

  while(new_moon_count < 8) {
    last_day = last_day.addDays(1);  
    last_sunset = SunCalc.getTimes(last_day, latitude, longitude).sunset;
    var new_phase = MoonPhase(last_sunset.getFullYear(), last_sunset.getMonth() + 1, last_sunset.getDate(), last_sunset.getHours() + last_sunset.getMinutes()/60 + last_sunset.getSeconds()/3600);
    if(new_phase < 180 && phase >= 180) {
      debug_string = debug_string + "\nNew moon before sunset on " + last_sunset;
      new_moon_count++;
    }
    phase = new_phase;
  }
  return last_day.addDays(1);

}

var holy_days = [
  { name: "Naw Ruz",
    month: 0, //baha
    day: 1,
    suspend: true },
  { name: "First Day of Ridván",
    month: 1, //jalal
    day: 13,
    suspend: true },
  { name: "Ninth Day of Ridván",
    month: 2, //jamal
    day: 2,
    suspend: true },
  { name: "Twelfth Day of Ridván",
    month: 2, //jamal
    day: 5,
    suspend: true },
  { name: "Declaration of the Báb",
    month: 3, //azamat
    day: 8,
    suspend: true },
  { name: "Ascension of Bahá'u'lláh",
    month: 3, //azamat
    day: 13,
    suspend: true },
  { name: "Marytrdom of the Báb",
    month: 5, //rahmat
    day: 17,
    suspend: true },
  { name: "Day of the Covenant",
    month: 13, //qawl
    day: 4,
    suspend: false },
  { name: "Ascension of `Abdu'l-Bahá",
    month: 13, //qawl
    day: 6,
    suspend: false }
]

var months = [
  "Bahá",
  "Jalál",
  "Jamál",
  "`Azamat",
  "Núr",
  "Rahmat",
  "Kalimát",
  "Kamál",
  "Asmá`",
  "`Izzat",
  "Mashíyyat",
  "`Ilm",
  "Qudrat",
  "Qawl",
  "Masá'il",
  "Sharaf",
  "Sultán",
  "Mulk",
  "`Alá'"
]

/** Find all the important days in Gregorian date range */
function find_days(start_date, end_date) {
  // 1. find start/end badi years
  var start_year = gregorian_to_badi(start_date.getFullYear()) - 1;
  var end_year = gregorian_to_badi(end_date.getFullYear()) + 1;

  var days = []

  for(var badi_year = start_year; badi_year <= end_year; badi_year++) {
    // 2. find all holy days
    for(var i = 0; i < holy_days.length; i++) {
      var holy_day = holy_days[i];
      var day = {
        name: holy_day.name,
        date: find_day(badi_year, holy_day.month, holy_day.day),
        type: (holy_day.suspend ? "Holy Day - Work suspended" : "Holy Day - Work not suspended")
      };
      days.push(day);
    }

    // 3. find the first day of each month
    for(var i = 0; i < months.length; i++) {
      var day = {
        name: "1st of " + months[i],
        date: find_day(badi_year, i, 1),
        type: "Feast Day"
      };
      days.push(day);
    }

    // 4. Ayyam-i-Ha
    days.push({
      name: "First day of Ayyam-i-Ha",
      date: find_day(badi_year, 17, 20),
      type: "Other"
    });

    days.push({
      name: "Last day of Ayyam-i-Ha",
      date: find_day(badi_year, 18, 0),
      type: "Other"
    });
  }

  // filter through these to find those that are actually in provided date range
  days = days.filter(function(day) {
    return (start_date <= day.date && day.date <= end_date);
  });

  return days;
}

/** Get text representation of a "day" */
function day_to_string(day) {
  var end = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate());
  var start = end.addDays(-1);
  return day.name + ": sunset of " + start.toLocaleDateString() + " to sunset of " + end.toLocaleDateString(); 
}
