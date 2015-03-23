
/** Add a fixed number of days to a Date object. */
Date.prototype.addDays = function(days)
{
    // don't want to setDate() because this will factor in local timezones
    // and mess up UTC computations
    var dat = new Date(this.getTime() + days*1000*24*60*60);
    return dat;
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
    { name: "Ascension of Bahá’u’lláh",
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
    { name: "Ascension of ‘Abdu’l-Bahá",
      month: 13, //qawl
      day: 6,
      suspend: false }
  ]

}

// just one giant namespace
var BadiCal = {

  /** Construct a date on the Badi Calendar.  Objects of this class
   * just have a 'year', 'month' and 'day' field, along with some 
   * helper functions and extra data (e.g. names of the months) */
  BadiDate: function (badi_year, badi_month, badi_day) {

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
  },

  /** Returns sunset in Tehran on a given gregorian day */
  tehran_sunset: function (date) {

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
  },

  /** Gets the day of Naw Ruz in a given gregorian year.  It returns the day at 00:00:00 UTC. */
  find_naw_ruz: function(gregorian_year) {

    // Step 0: Follow to the UHJ
    // In 2026, the equinox is less than a minute from sunset. The
    // algorithms from Meeus which we're using don't give accuraccy
    // better than one minute, and don't give us the right answer. The
    // UHJ has said that Naw Ruz this day is on the 21st.
    if(gregorian_year == 2026) {
      return new Date(Date.UTC(2026, 2, 21));
    }

    // Step 1: find UTC time of the equinox
    var equinox_utc = EquinoxCalc.vernal_equinox(gregorian_year);
    //$('#output').append("equinox: " + equinox_utc.toUTCString() + "<br />");

    // Step 2: find Tehran's sunset on the day of the equinox
    var sunset_utc = BadiCal.tehran_sunset(equinox_utc);
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
  },

  badi_year_to_gregorian: function (year) {
    return (year - 1) + 1844;
  },

  gregorian_year_to_badi: function (year) {
    return (year - 1844) + 1;
  },

  /** Takes a BadiDate and returns a Date.  This is timezone-independent,
   * since the BadiDate doesn't keep track of times.  It returns */
  badi_to_gregorian: function (badi) {

    if(badi.month < 19) {
      // normal computation, including for Ayyam-i-Ha
      var gregorian_start = BadiCal.badi_year_to_gregorian(badi.year);
      var naw_ruz = BadiCal.find_naw_ruz(gregorian_start);
      var add_days = badi.month*19 + badi.day - 1;
      return naw_ruz.addDays(add_days);
    } else if (badi.month == 19) {
      // month of `Ala (the fast): compute from next gregorian year
      var gregorian_end = BadiCal.badi_year_to_gregorian(badi.year + 1);
      var naw_ruz = BadiCal.find_naw_ruz(gregorian_end);
      var add_days = badi.day - 19 - 1;
      return naw_ruz.addDays(add_days);
    } 

    throw "Got invalid Badi month " + badi.month;
  },

  /** Takes a Date and returns a BadiDate.  We disregard the time and 
   * consider the date to be at 00:00:00. UTC This function is designed
   * to be an inverse of badi_to_gregorian for all inputs. */
  gregorian_to_badi: function (date) {

    // Figure out the correct Badi year and Naw Ruz
    var gregorian_year = date.getUTCFullYear();
    var naw_ruz = BadiCal.find_naw_ruz(gregorian_year);
    var badi_year = BadiCal.gregorian_year_to_badi(date.getUTCFullYear());
    if(date < naw_ruz) {
      badi_year = badi_year - 1;
      gregorian_year = gregorian_year - 1;
      naw_ruz = BadiCal.find_naw_ruz(gregorian_year);
    }

    // Count the days past Naw Ruz it is
    var diff = Math.floor((date - naw_ruz)/(1000*60*60*24));
    var month = Math.floor(diff/19);

    if(month < 18) {
      // the first 18 months are easy :)
      var day = diff - month*19 + 1;
      return new BadiCal.BadiDate(badi_year, month, day);
    }

    if(month == 18 || month == 19) {
      // Day offset from beginning of Ayyam-i-Ha / end of Mulk
      var after_mulk = diff - 18*19;

      // need to get next Naw-Ruz and count backward 
      var next_naw_ruz = BadiCal.find_naw_ruz(gregorian_year + 1);
      var year_length = (next_naw_ruz - naw_ruz)/(1000*60*60*24);
      var ayyam_days = year_length - 19*19;

      if (after_mulk < ayyam_days) {
        return new BadiCal.BadiDate(badi_year, 18, after_mulk + 1);
      } else {
        return new BadiCal.BadiDate(badi_year, 19, after_mulk + 1 - ayyam_days);
      }
    }

    throw "Bad month: " + month;

  },

  /** Takes a date and returns the date of the next new moon.
   *  This function is recursive.  A client should call this function with two
   *  identical parameters.  
   *
   *  The detailed contract is this: find the first new moon during or after 
   *  the lunar cycle containing 'date' but occurring after the time 'min'. */
  next_new_moon: function(date, min) {
    
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
      return BadiCal.next_new_moon(new_moon_date.addDays(30), min);
    }

  },

  /** Finds the first gregorian day of the twin birthdays */
  find_birthdays: function (gregorian_year) {

    // Compute 8 new moons past Naw Ruz
    var last_day = BadiCal.find_naw_ruz(gregorian_year);
    last_day = BadiCal.tehran_sunset(last_day);
    for(var i = 0; i < 8; i++) {
      last_day = BadiCal.next_new_moon(last_day, last_day);
    }

    var sunset = BadiCal.tehran_sunset(last_day);
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

  },


  /** Constructs an object that we'll render in the UI, somehow */
  DayUIObj: function(title, date, badi_date, type) {
    this.title = title;
    this.date = date;
    this.badi_date = badi_date;
    this.type = type;

    /** Get a simple text representation */
    this.toString = function() {

      // Since we represent a day at 00:00:00 UTC, for displaying local time we 
      // need to make sure we adjust the timezone 
      mydate = new Date(this.date.getTime() + this.date.getTimezoneOffset()*60*1000);

      return this.title + 
              ": sunset of " + mydate.addDays(-1).toLocaleDateString() + 
              " to sunset of " + mydate.toLocaleDateString(); 
    }
  },


  /** Find all the important days in Gregorian date range */
  find_days: function(start_date, end_date) {
    // 1. find start/end badi years
    var start_year = BadiCal.gregorian_year_to_badi(start_date.getUTCFullYear()) - 1;
    var end_year = BadiCal.gregorian_year_to_badi(end_date.getUTCFullYear()) + 1;

    var days = []

    for(var badi_year = start_year; badi_year <= end_year; badi_year++) {
      // 2. find all holy days fixed to the solar calendar
      for(var i = 0; i < BadiData.holy_days.length; i++) {
        var holy_day = BadiData.holy_days[i];
        var badi_day = new BadiCal.BadiDate(badi_year, holy_day.month, holy_day.day);
        var greg_day = BadiCal.badi_to_gregorian(badi_day);
        var day = new BadiCal.DayUIObj(holy_day.name, greg_day, badi_day, "Holy Day");
        days.push(day);
      }

      // 3. find the first day of each month
      for(var i = 0; i <= 19; i++) {
        var badi_day = new BadiCal.BadiDate(badi_year, i, 1);
        var greg_day = BadiCal.badi_to_gregorian(badi_day);
        var day = new BadiCal.DayUIObj(badi_day.toString(), greg_day, badi_day, "Feast Day");
        days.push(day);
      }

      // 4. Find Birth of the Báb and Birth of Bahá'u'lláh
      var bday = BadiCal.find_birthdays(BadiCal.badi_year_to_gregorian(badi_year));
      var badi_bday1 = BadiCal.gregorian_to_badi(bday);
      var badi_bday2 = BadiCal.gregorian_to_badi(bday.addDays(1));
      var day1 = new BadiCal.DayUIObj("Birth of the Báb", bday, badi_bday1, "Holy Day");
      var day2 = new BadiCal.DayUIObj("Birth of Bahá’u’lláh", bday.addDays(1), badi_bday2, "Holy Day");
      days.push(day1);
      days.push(day2);
    }

    // 5. filter through these to find those that are actually in provided date range
    days = days.filter(function(day) {
      return (start_date <= day.date.addDays(-1) && day.date <= end_date);
    });

    // 6. sort by gregorian date
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

}
