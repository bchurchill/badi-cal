# badi-cal

## Purpose

This project is, at heart, a reusable javascript library for
converting dates on the Badi calendar with the Gregorian calendar.

There's also a demo application which shows Holy days and the Badi months in a tabular listing.  It's hosted at https://bchurchill.github.io/badi-cal.
 * What day to host Feast on
 * What days the Holy Days fall on, taking into account the 10 July 2014 UHJ letter

## Setup Environment

* Make sure to have the following installed in your dev environment
  * [NodeJS](https://nodejs.org/en/download/)
  * [Yarn (optional, but you should really really do it)](https://yarnpkg.com/)

## Running the examples

* If you would like to build and run the examples, run the following from the
  command line:

```
cd path/to/repo
yarn # or "npm install" if you are not using yarn
npm run start-example1 # or "npm run start-example2"
```

* Go to localhost:8080 in your browser

**NOTE:** When loading pages in your browser, chrome tends to cache results, so
if refreshing some change, it may show you old content. Follow instruction
(here)[http://stackoverflow.com/questions/5690269/disabling-chrome-cache-for-website-development]
to disable browser caching.

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
