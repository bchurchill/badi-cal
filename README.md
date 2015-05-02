# badi-cal

## Purpose

This project is, at heart, a reusable javascript library for
converting dates on the Badi calendar with the Gregorian calendar.

There's also a demo application which shows Holy days and the Badi months in a tabular listing.  It's hosted at https://bchurchill.github.io/badi-cal.
 * What day to host Feast on
 * What days the Holy Days fall on, taking into account the 10 July 2014 UHJ letter

## Status

This is in beta.  It has not been extensively tested.  Please let me know if ever you find an incorrect date -- that would be really bad!

Future work includes adding a location picker to the demo application to see sunrise/sunset times.

## Code

 * The extern/ folder has javascript to compute equinoxes, new moons, and sunrise/sunset times
 * `badi.js` is where the backend fun is: it defines a `BadiDate` class and functions `gregorian_to_badi`, `badi_to_gregorian` for converting JavaScript's built-in `Date` objects.
 * index.html and style.css have the demo application
 * harness.html runs several tests against the backend

## Specs

In a world ravaged by thousand-page Intel manuals, I'm happy to use the following letters from the Universal House of Justice as a specification:

 * The 10 July 2014 letter, http://universalhouseofjustice.bahai.org/activities-bahai-community/20140710_001
 * The 11 Dec 2014 letter, included in this repository
