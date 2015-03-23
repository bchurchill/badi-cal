
/** Add a fixed number of days to a Date object. */
Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

/** Construct a date on the Badi Calendar.  Objects of this class
 * just have a 'year', 'month' and 'day' field, along with some 
 * helper functions and extra data (e.g. names of the months) */
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

  /** Print text representation of this date. */
  this.toString = function() {
    return this.day + " " + this.monthNames[this.month] + " " + this.year;
  }

  /** Compare.  Returns negative if 'this' comes before 'other', zero if same,
   * positive if 'this' comes after 'other'. */
  this.compare = function(other) {
    return (this.year - other.year)*400 + (this.month - other.month)*19 + (this.day - other.day);
  }
}

/** Various data used by this application */
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

  // Put this into a Date object
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

function badi_year_to_gregorian(year) {
  return (year - 1) + 1844;
}

function gregorian_year_to_badi(year) {
  return (year - 1844) + 1;
}

function badi_to_gregorian(badi) {

  if(badi.month < 19) {
    // normal computation, including for Ayyam-i-Ha
    var gregorian_start = badi_year_to_gregorian(badi.year);
    var naw_ruz = find_naw_ruz(gregorian_start);
    var add_days = badi.month*19 + badi.day;
    return naw_ruz.addDays(add_days);
  } else if (badi.month == 19) {
    // month of `Ala (the fast): compute from next gregorian year
    var gregorian_end = badi_year_to_gregorian(badi.year + 1);
    var naw_ruz = find_naw_ruz(gregorian_end);
    var add_days = -19 + badi.day;
    return naw_ruz.addDays(add_days);
  } 

  throw "Got invalid Badi month " + badi.month;
}

/** Takes a date and returns the date of the next new moon.
 *  This function is recursive.  A client should call this function with two
 *  identical parameters.  
 *
 *  The detailed contract is this: find the first new moon during or after 
 *  the lunar cycle containing 'date' but occurring after the time 'min'. */
function next_new_moon(date, min) {
  
  // 1. Find the new moon during cycle 'date'
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

  // 2. If this new moon is in the future, we're done!
  if(new_moon_date > min) {
    return new_moon_date;
  } else {
    // 3. Otherwise, we need to look at the next lunar cycle
    return next_new_moon(new_moon_date.addDays(30), min);
  }

}

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


/** Constructs an object that we'll render in the UI, somehow */
function DayUIObj(title, date, badi_date, type) {
  this.title = title;
  this.date = date;
  this.badi_date = badi_date;
  this.type = type;

  /** Get a simple text representation */
  this.toString = function() {
    return this.title + 
            ": sunset of " + date.addDays(-1).toLocaleDateString() + 
            " to sunset of " + date.toLocaleDateString(); 
  }
}


/** Find all the important days in Gregorian date range */
function find_days(start_date, end_date) {
  // 1. find start/end badi years
  var start_year = gregorian_year_to_badi(start_date.getUTCFullYear()) - 1;
  var end_year = gregorian_year_to_badi(end_date.getUTCFullYear()) + 1;

  var days = []

  for(var badi_year = start_year; badi_year <= end_year; badi_year++) {
    // 2. find all holy days
    for(var i = 0; i < BadiData.holy_days.length; i++) {
      var holy_day = BadiData.holy_days[i];
      var badi_day = new BadiDate(badi_year, holy_day.month, holy_day.day);
      var greg_day = badi_to_gregorian(badi_day);
      var day = new DayUIObj(holy_day.name, greg_day, badi_day, "Holy Day");
      days.push(day);
    }

    // 3. find the first day of each month
    for(var i = 0; i <= 19; i++) {
      var badi_day = new BadiDate(badi_year, i, 1);
      var greg_day = badi_to_gregorian(badi_day);
      var day = new DayUIObj(badi_day.toString(), greg_day, badi_day, "Feast Day");
      days.push(day);
    }
  }

  // 4. filter through these to find those that are actually in provided date range
  days = days.filter(function(day) {
    return (start_date <= day.date.addDays(-1) && day.date <= end_date);
  });

  // 5. sort by gregorian date
  days = days.sort(function(x, y) {
    if (x.date.getTime() < y.date.getTime()) {
      return -1;
    } else if (x.date.getTime() == y.date.getTime()) {
      return 0;
    } else {
      return 1;
    }
  });

  return days;
}


