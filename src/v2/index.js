
import BadiDate from '../BadiDate';

if (typeof window === 'undefined') {
  throw Error('This version of badi-cal is only supported within browsers');
}

window.BadiDate = BadiDate;
