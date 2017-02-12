# badi-cal

## Purpose

This project is, at heart, a reusable javascript library for
converting dates on the Badi calendar with the Gregorian calendar.

There's also a demo application which shows Holy days and the Badi months in a tabular listing.  It's hosted at https://bchurchill.github.io/badi-cal.
 * What day to host Feast on
 * What days the Holy Days fall on, taking into account the 10 July 2014 UHJ letter

## Using the Code

* If you would like to use the code in this project, the "browser-build-v1" and
  "browser-build-v2" directories contain v1 and v2 of badi-cal that out-of-the-box
  box in browsers. If you would like to use this project in a browser environment,
  go ahead and import the javascript file from one of these directories into your
  html.
* If you have a more sophisticated javascript environment (node, webpack, etc...)
  then the "build-v2" directory can be used in your project. This will work with
  environments that support javascript modules (es6 imports, CommonJS, etc...)

## Setup Environment

* Make sure to have the following installed in your dev environment
  * [NodeJS](https://nodejs.org/en/download/)
  * [Yarn (optional, but you should really really do it)](https://yarnpkg.com/)

## Running the Examples

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

## Specs

In a world ravaged by thousand-page Intel manuals, I'm happy to use the following letters from the Universal House of Justice as a specification:

 * The 10 July 2014 letter, http://universalhouseofjustice.bahai.org/activities-bahai-community/20140710_001
 * The 11 Dec 2014 letter, included in this repository

## Before Committing Code

* Make sure that all the Unit Tests are Working

`npm run test`

* If making breaking changes, increment the version number in package.json, and
make sure all the examples still work

* Re-Bundle the downloadable javascript file

`npm run create-bundles`
