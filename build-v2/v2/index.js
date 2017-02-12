'use strict';

var _BadiDate = require('../BadiDate');

var _BadiDate2 = _interopRequireDefault(_BadiDate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof window === 'undefined') {
  throw Error('This version of badi-cal is only supported within browsers');
}

window.BadiDate = _BadiDate2.default;