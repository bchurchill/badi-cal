"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = incrementGregorianDays;

var MillisPerDay = 1000 * 60 * 60 * 24;

function incrementGregorianDays(gregorianDate, days) {
  return new Date(gregorianDate.getTime() + days * MillisPerDay);
}