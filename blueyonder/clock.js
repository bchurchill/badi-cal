// Utility functions for date and time programming.
// JavaScript by Peter Hayes
// http://www.aphayes.pwp.blueyonder.co.uk/
// Copyright 2001-2010
// This code is made freely available but please keep this notice.
// I accept no liability for any errors in my coding but please
// let me know of any errors you find. My address is on my home page.

//  Javascript 1.2 includes getFullYear but Netscape 4.6 does not supply it.

function getFullYear(now) {
  var year = now.getYear();
  if (year==0) {year=2000};
  if (year<1900) {year=year+1900};
  return year;
}

function datestring(year,month,day) {
// provides a locale independent format - year:month:day
  var datestr = "";  datestr += year;
  datestr += ((month < 10) ? ":0" : ":") + month;
  datestr += ((day < 10) ? ":0" : ":") + day;
  return datestr;
}

function hmstring(t) {
// takes hours and returns hh:mm
  var hours=t;
  while (hours >= 24) {hours-=24;}
  while (hours < 0) {hours+=24;}
  var minutes=Math.round(60.0*(hours-Math.floor(hours)));
  hours=Math.floor(hours);
  if (minutes >= 60) {hours+=1; minutes-=60;}
  if (hours >= 24) {hours-=24;}
  var hmstr=(t < 0) ? "-" : "";
  hmstr+=((hours < 10) ? "0" : "")+hours;
  hmstr+=((minutes < 10) ? ":0" : ":")+minutes;
  return hmstr;
}

function hmsstring(t) {
// takes hours and returns hh:mm:ss
  var hours = Math.abs(t);
  var minutes = 60.0*(hours-Math.floor(hours));
  hours=Math.floor(hours);
  var seconds = Math.round(60.0*(minutes-Math.floor(minutes)));
  minutes=Math.floor(minutes);
  if (seconds >= 60) { minutes+=1; seconds-=60; }
  if (minutes >= 60) { hours+=1; minutes-=60; }
  if (hours >= 24) { hours-=24; }
  var hmsstr=(t < 0) ? "-" : "";
  hmsstr+=((hours < 10) ? "0" : "" )+hours;
  hmsstr+=((minutes < 10) ? ":0" : ":" )+minutes;
  hmsstr+=((seconds < 10) ? ":0" : ":" )+seconds;
  return hmsstr;
}

