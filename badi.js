
Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

function BadiDate(badi_year, badi_month, badi_day) {

  /** Year 1 is 1844 */
  this.year = badi_year;

  /** Month 0 = Baha, ..., 17 = Mulk, 18 = Ayyam-i-Ha, 19 = Ala */
  this.month = badi_month;

  /** The day of the month, 1-indexed. */
  this.day = badi_day;

  /** The names of the months */
  this.monthNames = [
    "Bahá",
    "Jalál",
    "Jamál",
    "‘Aẓamat",
    "Núr",
    "Raḥmat",
    "Kalimát",
    "Kamál",
    "Asmá’",
    "‘Izzat",
    "Mashíyyat",
    "‘Ilm",
    "Qudrat",
    "Qawl",
    "Masá’il",
    "Sharaf",
    "Sulṭán",
    "Mulk",
    "Ayyám-i-Há",
    "‘Alá’"
  ]

  this.toString = function() {
    this.day + " " + this.monthNames[this.month] + " " + this.year;
  }
}

var BadiData = {
  // Tehran is at 35°41′40″N 51°25′17″E
  tehran_latitude: 35.6944,
  tehran_longitude: 51.4215,

  holy_days: [
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

}

/** Returns sunset in Tehran on a given gregorian day */
function tehran_sunset(date) {

  // Get UTC hours of Sunset
  var sunset = SunRiseSet(
                date.getUTCFullYear(),
                date.getUTCMonth()+1,
                date.getUTCDate(),
                BadiData.tehran_latitude,
                BadiData.tehran_longitude)[1];

  var sunset_hours = Math.floor(sunset);
  var sunset_minutes = Math.floor((sunset - sunset_hours)*60);
  var sunset_seconds = Math.floor(((sunset - sunset_hours)*60 - sunset_minutes)*60);

  // When we put this information into a date, it treats it as local time
  var sunset_utc = new Date(Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                sunset_hours,
                sunset_minutes,
                sunset_seconds));

  return sunset_utc;
}

/** Gets the day of Naw Ruz in a given gregorian year */
function find_naw_ruz(gregorian_year) {

  // Step 0: Follow to the UHJ
  // In 2026, the equinox is less than a minute from sunset. The
  // algorithms from Meeus which we're using don't give accuraccy
  // better than one minute, and don't give us the right answer. The
  // UHJ has said that Naw Ruz this day is on the 21st.
  if(gregorian_year == 2026) {
    return new Date(Date.UTC(2026, 2, 21));
  }

  // Step 1: find UTC time of the equinox
  var equinox_utc = vernal_equinox(gregorian_year);
  //$('#output').append("equinox: " + equinox_utc.toUTCString() + "<br />");

  // Step 2: find Tehran's sunset on the day of the equinox
  var sunset_utc = tehran_sunset(equinox_utc);
  //$('#output').append("sunset_utc: " + sunset_utc.toUTCString() + "<br />");

  // Step 3: find the final day
  var sunset_day = new Date(Date.UTC(
    equinox_utc.getUTCFullYear(), 
    equinox_utc.getUTCMonth(), 
    equinox_utc.getUTCDate()));
  if(equinox_utc < sunset_utc) {
    // If equinox before sunset, we take the gregorian date from the day of sunset
    return sunset_day;
  } else {
    // if equinox after sunet, we take the gregorian date from day after sunset
    return sunset_day.addDays(1);
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

function badi_year_to_gregorian_year(year) {
  return (year - 1) + 1844;
}

function badi_to_gregorian(badi) {

  if(badi.month < 19) {
    // normal computation, including for Ayyam-i-Ha
    var gregorian_start = badi_year_to_gregorian_year(badi.year);
    var naw_ruz = find_naw_ruz(gregorian_start);
    var add_days = badi_month*19 + badi.day;
    return naw_ruz.addDays(add_days);
  } else if (badi_month == 19) {
    // month of `Ala (the fast): compute from next gregorian year
    var gregorian_end = badi_to_gregorian(badi.year + 1);
    var naw_ruz = find_naw_ruz(gregorian_end);
    var add_days = -19 + badi.day;
    return naw_ruz.addDays(add_days);
  } 

  throw "Got invalid Badi month " + badi.month;
}

/** Takes a date and returns the date of the next new moon */
function next_new_moon(date, min) {
  
  var quarters = MoonQuarters(
    date.getUTCFullYear(), 
    date.getUTCMonth()+1, 
    date.getUTCDate(), 
    0
  );

  var new_moon = jdtocd(quarters[0]);

  var new_moon_date = new Date(Date.UTC(
    new_moon[0],
    new_moon[1] - 1,
    new_moon[2],
    new_moon[4],
    new_moon[5],
    new_moon[6]));

  if(new_moon_date > min) {
    return new_moon_date;
  } else {
    return next_new_moon(new_moon_date.addDays(30), min);
  }

}

var debug_string = "";
/** Finds the first gregorian day of the twin birthdays */
function find_birthdays(gregorian_year) {

  // Compute 8 new moons past Naw Ruz
  var last_day = find_naw_ruz(gregorian_year);
  last_day = tehran_sunset(last_day);
  for(var i = 0; i < 8; i++) {
    last_day = next_new_moon(last_day, last_day);
  }

  var sunset = tehran_sunset(last_day);
  if(last_day < sunset) {
    last_day = last_day.addDays(1);
  } else {
    last_day = last_day.addDays(2);
  }

  var ret_date = new Date(Date.UTC(
    last_day.getUTCFullYear(), 
    last_day.getUTCMonth(), 
    last_day.getUTCDate()));
  return ret_date;

}





/** Find all the important days in Gregorian date range */
function find_days(start_date, end_date) {
  // 1. find start/end badi years
  var start_year = gregorian_to_badi(start_date.getUTCFullYear()) - 1;
  var end_year = gregorian_to_badi(end_date.getUTCFullYear()) + 1;

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
  var end = new Date(Date.UTC(
    day.date.getUTCFullYear(), 
    day.date.getUTCMonth(), 
    day.date.getUTCDate()));
  var start = end.addDays(-1);
  return day.name + ": sunset of " + start.toLocaleDateString() + " to sunset of " + end.toLocaleDateString(); 
}
