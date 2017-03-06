# badi-cal
[![Build Status](https://travis-ci.org/bchurchill/badi-cal.svg?branch=master)]

## Purpose

This project is a reusable javascript library for converting dates between
the Badi calendar and the Gregorian calendar.

There's also a demo application which shows Holy days and the Badi months in a tabular listing.  It's hosted at https://bchurchill.github.io/badi-cal.
 * What day to host Feast on
 * What days the Holy Days fall on, taking into account the 10 July 2014 UHJ letter

## Using the Code

* If you would like to use the code in this project, the
 "browser-build-v1" and "browser-build-v2" directories contain v1 and
 v2 of badi-cal that out-of-the-box box in browsers. If you would like
 to use this project in a browser environment, go ahead and import the
 javascript file from one of these directories into your html. The v1
 code has slightly more functionality than the v2 version, but this
 functionality is deprecated. The v2 API is cleaner.
* If you have a more sophisticated javascript environment (node, webpack, etc...)
 then the "build-v2" directory can be used in your project. This will work with
 environments that support javascript modules (es6 imports, CommonJS, etc...)

## Setup Environment

* Make sure to have the following installed in your dev environment
 * [NodeJS](https://nodejs.org/en/download/)
 * [Yarn (optional, but you should really really do it)](https://yarnpkg.com/)

## Getting a Clean Build

* Builds are created in the "browser-build-v1", "browser-build-v2", and "build-v2"
  directories, so you shouldn't have to build any code if you want to just use
  an existing build.
* If you are making changes to the code, then please do the following:
  * You can clean the builds with `npm run clean-build`
  * You can generate a new build with `npm run create-build`
  * It is not necessary to clean the build before creating one, but there may
    be stale files left over from the previous build, especially if you are
    adding / removing / deleting files between builds

## Running the Examples

* If you would like to build and run the examples, run the following from the
  command line:

```
cd path/to/repo
yarn # or "npm install" if you are not using yarn
npm run start-example1
```

* Go to localhost:8080 in your browser

**NOTE:** When loading pages in your browser, chrome tends to cache results, so
if refreshing some change, it may show you old content. Follow instruction
(here)[http://stackoverflow.com/questions/5690269/disabling-chrome-cache-for-website-development]
to disable browser caching.

## About the Code

#### src/index.js

* The root of the project that exports the modules. If you are using a browser
  build, then the project is exported using a different mechanism. Please
  see the section **src/v1 and src/v2**

#### src/BadiDate.js

* This contains the core API for the BadiDate class.

#### examples

* This contains all the example apps that you can run. These show you how to
  use the badi-cal API and helps confirm that it is working as expected.

#### src/extern

* This contains dependencies that could not be managed by npm. The dependencies
  in this directory are mostly astronomical calculations. In the future, this
  folder should be deprecated and all the dependencies of this project should
  be tracked by a package manager.

#### src/v1 and src/v2

* These directories contain some setup code for generating the browser builds.
  This is mostly responsible for exposing state to the window object. These
  directories are ignored for builds that are not browser-dependent and use a
  module system.
* From updating the project from V1 to V2, we have removed a lot of the
  functionality previously implemented in V1.
* V2 only contains the BadiDate class, and the API for this class is slightly
  different
* If there is some functionality that you would like to see in V2, please create
  a task.  

#### src/HolyDays.js and src/LocationMap.js

* These contain any data that the BadiCalendar needs for doing calculations.
  The location map contains longitude and latitude of important cities and
  HolyDays contains metadata about all the holy days.

#### src/Astronomy.js

* Contains calculations for Astronomical events, for example, sunset times.

## Before Committing Code

* Make sure that all the Unit Tests are Working

`npm run test`

* Ensure the first example still works.

* If making breaking changes, increment the version number in package.json.

* Re-Bundle the downloadable javascript file

```
npm run clean-build
npm run create-build
```

## Status

This code is probably stable enough to be used in a project. It has
been used in small projects over the last two years or so, and we've
yet to find any significant bugs (e.g. incorrect dates). However,
using the API correctly can take some effort and it can be confusing
(see, for example, https://github.com/bchurchill/badi-cal/issues/5).
Thus, it's important to make sure you carefully test any projects that
use this library to ensure that everything works right.

The underlying algorithms used for the astronomical computations,
which are taken from a famous text by Meeus, are typically accurate to
within a few minutes. However, it is inaccurate for very high and very
low lattitudes (those close to the poles). It also looses accuracy
going into the future. As a result of these issues, we verify the
dates of Naw-Ruz and the Twin Holy Days with those distributed from
the Baha'i World Centre, and ensure that whatever we generate matches
that.

## Specs

In a world ravaged by thousand-page Intel manuals, we're happy to
use the following letters from the Universal House of Justice as a
specification:

 * The 10 July 2014 letter, http://universalhouseofjustice.bahai.org/activities-bahai-community/20140710_001
 * The 11 Dec 2014 letter, included in this repository
