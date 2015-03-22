# badi-cal

## Purpose

For Bahá'ís trying to figure out:
 * If Feast is on day ABC or on sunset the night before
 * What days the Holy Days fall on, taking into account the 10 July 2014 UHJ letter
 * and things like that

## Status

Work in progress.  The backend functionality is present: it can take a range of gregorian dates and return the significant dates in the Badi calendar.  

Work to be done:
 * Fix the 2025 Naw-Ruz off-by-one-minute bug.  On this day, the equinox and sunset are less than a minute apart in Tehran, and it looks like the way of calculating the dates I have just isn't accurate enough.
 * Create the user interface
 * Put dependencies in namespaces (they're kind of spaghetti code right now)
 * Clean up the code: make a BadiDate class that encapsulates the conversion between Gregorian dates and Badi dates

## Specs

In a world ravaged by thousand-page Intel manuals, I'm happy to use the following letters from the Universal House of Justice as a specification:

 * The 10 July 2014 letter, http://universalhouseofjustice.bahai.org/activities-bahai-community/20140710_001
 * The 11 Dec 2014 letter, included in this repository
