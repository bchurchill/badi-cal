# badi-cal

## Purpose

For Bahá'ís trying to figure out:
 * If Feast is on day ABC or on sunset the night before
 * What days the Holy Days fall on, taking into account the 10 July 2014 UHJ letter
 * and things like that

## Status

Work in progress. The backend functionality is present and seems
robust: it can take a range of gregorian dates and return the
significant dates in the Badi calendar.

Work to be done:
 * Create the user interface

## Code

 * The extern/ folder has javascript to compute equinoxes, new moons, and sunrise/sunset times
 * `badi.js` is where the backend fun is: it defines a `BadiDate` class and functions `gregorian_to_badi`, `badi_to_gregorian` for converting JavaScript's built-in `Date` objects.
 * harness.html runs several tests against the backend

## Specs

In a world ravaged by thousand-page Intel manuals, I'm happy to use the following letters from the Universal House of Justice as a specification:

 * The 10 July 2014 letter, http://universalhouseofjustice.bahai.org/activities-bahai-community/20140710_001
 * The 11 Dec 2014 letter, included in this repository
