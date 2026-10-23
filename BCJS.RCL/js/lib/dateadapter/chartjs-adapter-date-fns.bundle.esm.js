var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/date-fns/constants.js
var daysInYear, maxTime, minTime, millisecondsInWeek, millisecondsInDay, millisecondsInMinute, millisecondsInHour, millisecondsInSecond, secondsInHour, secondsInDay, secondsInWeek, secondsInYear, secondsInMonth, secondsInQuarter, constructFromSymbol;
var init_constants = __esm({
  "node_modules/date-fns/constants.js"() {
    daysInYear = 365.2425;
    maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1e3;
    minTime = -maxTime;
    millisecondsInWeek = 6048e5;
    millisecondsInDay = 864e5;
    millisecondsInMinute = 6e4;
    millisecondsInHour = 36e5;
    millisecondsInSecond = 1e3;
    secondsInHour = 3600;
    secondsInDay = secondsInHour * 24;
    secondsInWeek = secondsInDay * 7;
    secondsInYear = secondsInDay * daysInYear;
    secondsInMonth = secondsInYear / 12;
    secondsInQuarter = secondsInMonth * 3;
    constructFromSymbol = Symbol.for("constructDateFrom");
  }
});

// node_modules/date-fns/constructFrom.js
function constructFrom(date, value) {
  if (typeof date === "function") return date(value);
  if (date && typeof date === "object" && constructFromSymbol in date)
    return date[constructFromSymbol](value);
  if (date instanceof Date) return new date.constructor(value);
  return new Date(value);
}
var init_constructFrom = __esm({
  "node_modules/date-fns/constructFrom.js"() {
    init_constants();
  }
});

// node_modules/date-fns/toDate.js
function toDate(argument, context) {
  return constructFrom(context || argument, argument);
}
var init_toDate = __esm({
  "node_modules/date-fns/toDate.js"() {
    init_constructFrom();
  }
});

// node_modules/date-fns/addDays.js
function addDays(date, amount, options) {
  const _date = toDate(date, options?.in);
  if (isNaN(amount)) return constructFrom(options?.in || date, NaN);
  if (!amount) return _date;
  _date.setDate(_date.getDate() + amount);
  return _date;
}
var init_addDays = __esm({
  "node_modules/date-fns/addDays.js"() {
    init_constructFrom();
    init_toDate();
  }
});

// node_modules/date-fns/addMonths.js
function addMonths(date, amount, options) {
  const _date = toDate(date, options?.in);
  if (isNaN(amount)) return constructFrom(options?.in || date, NaN);
  if (!amount) {
    return _date;
  }
  const dayOfMonth = _date.getDate();
  const endOfDesiredMonth = constructFrom(options?.in || date, _date.getTime());
  endOfDesiredMonth.setMonth(_date.getMonth() + amount + 1, 0);
  const daysInMonth = endOfDesiredMonth.getDate();
  if (dayOfMonth >= daysInMonth) {
    return endOfDesiredMonth;
  } else {
    _date.setFullYear(
      endOfDesiredMonth.getFullYear(),
      endOfDesiredMonth.getMonth(),
      dayOfMonth
    );
    return _date;
  }
}
var init_addMonths = __esm({
  "node_modules/date-fns/addMonths.js"() {
    init_constructFrom();
    init_toDate();
  }
});

// node_modules/date-fns/add.js
var init_add = __esm({
  "node_modules/date-fns/add.js"() {
  }
});

// node_modules/date-fns/isSaturday.js
var init_isSaturday = __esm({
  "node_modules/date-fns/isSaturday.js"() {
  }
});

// node_modules/date-fns/isSunday.js
var init_isSunday = __esm({
  "node_modules/date-fns/isSunday.js"() {
  }
});

// node_modules/date-fns/isWeekend.js
var init_isWeekend = __esm({
  "node_modules/date-fns/isWeekend.js"() {
  }
});

// node_modules/date-fns/addBusinessDays.js
var init_addBusinessDays = __esm({
  "node_modules/date-fns/addBusinessDays.js"() {
  }
});

// node_modules/date-fns/addMilliseconds.js
function addMilliseconds(date, amount, options) {
  return constructFrom(options?.in || date, +toDate(date) + amount);
}
var init_addMilliseconds = __esm({
  "node_modules/date-fns/addMilliseconds.js"() {
    init_constructFrom();
    init_toDate();
  }
});

// node_modules/date-fns/addHours.js
function addHours(date, amount, options) {
  return addMilliseconds(date, amount * millisecondsInHour, options);
}
var init_addHours = __esm({
  "node_modules/date-fns/addHours.js"() {
    init_addMilliseconds();
    init_constants();
  }
});

// node_modules/date-fns/_lib/defaultOptions.js
function getDefaultOptions() {
  return defaultOptions;
}
var defaultOptions;
var init_defaultOptions = __esm({
  "node_modules/date-fns/_lib/defaultOptions.js"() {
    defaultOptions = {};
  }
});

// node_modules/date-fns/startOfWeek.js
function startOfWeek(date, options) {
  const defaultOptions2 = getDefaultOptions();
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  const _date = toDate(date, options?.in);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  _date.setDate(_date.getDate() - diff);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
var init_startOfWeek = __esm({
  "node_modules/date-fns/startOfWeek.js"() {
    init_defaultOptions();
    init_toDate();
  }
});

// node_modules/date-fns/startOfISOWeek.js
function startOfISOWeek(date, options) {
  return startOfWeek(date, { ...options, weekStartsOn: 1 });
}
var init_startOfISOWeek = __esm({
  "node_modules/date-fns/startOfISOWeek.js"() {
    init_startOfWeek();
  }
});

// node_modules/date-fns/getISOWeekYear.js
function getISOWeekYear(date, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();
  const fourthOfJanuaryOfNextYear = constructFrom(_date, 0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
  const fourthOfJanuaryOfThisYear = constructFrom(_date, 0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}
var init_getISOWeekYear = __esm({
  "node_modules/date-fns/getISOWeekYear.js"() {
    init_constructFrom();
    init_startOfISOWeek();
    init_toDate();
  }
});

// node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds()
    )
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}
var init_getTimezoneOffsetInMilliseconds = __esm({
  "node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/_lib/normalizeDates.js
function normalizeDates(context, ...dates) {
  const normalize = constructFrom.bind(
    null,
    context || dates.find((date) => typeof date === "object")
  );
  return dates.map(normalize);
}
var init_normalizeDates = __esm({
  "node_modules/date-fns/_lib/normalizeDates.js"() {
    init_constructFrom();
  }
});

// node_modules/date-fns/startOfDay.js
function startOfDay(date, options) {
  const _date = toDate(date, options?.in);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
var init_startOfDay = __esm({
  "node_modules/date-fns/startOfDay.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/differenceInCalendarDays.js
function differenceInCalendarDays(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  const laterStartOfDay = startOfDay(laterDate_);
  const earlierStartOfDay = startOfDay(earlierDate_);
  const laterTimestamp = +laterStartOfDay - getTimezoneOffsetInMilliseconds(laterStartOfDay);
  const earlierTimestamp = +earlierStartOfDay - getTimezoneOffsetInMilliseconds(earlierStartOfDay);
  return Math.round((laterTimestamp - earlierTimestamp) / millisecondsInDay);
}
var init_differenceInCalendarDays = __esm({
  "node_modules/date-fns/differenceInCalendarDays.js"() {
    init_getTimezoneOffsetInMilliseconds();
    init_normalizeDates();
    init_constants();
    init_startOfDay();
  }
});

// node_modules/date-fns/startOfISOWeekYear.js
function startOfISOWeekYear(date, options) {
  const year = getISOWeekYear(date, options);
  const fourthOfJanuary = constructFrom(options?.in || date, 0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  return startOfISOWeek(fourthOfJanuary);
}
var init_startOfISOWeekYear = __esm({
  "node_modules/date-fns/startOfISOWeekYear.js"() {
    init_constructFrom();
    init_getISOWeekYear();
    init_startOfISOWeek();
  }
});

// node_modules/date-fns/setISOWeekYear.js
var init_setISOWeekYear = __esm({
  "node_modules/date-fns/setISOWeekYear.js"() {
  }
});

// node_modules/date-fns/addISOWeekYears.js
var init_addISOWeekYears = __esm({
  "node_modules/date-fns/addISOWeekYears.js"() {
  }
});

// node_modules/date-fns/addMinutes.js
function addMinutes(date, amount, options) {
  const _date = toDate(date, options?.in);
  _date.setTime(_date.getTime() + amount * millisecondsInMinute);
  return _date;
}
var init_addMinutes = __esm({
  "node_modules/date-fns/addMinutes.js"() {
    init_constants();
    init_toDate();
  }
});

// node_modules/date-fns/addQuarters.js
function addQuarters(date, amount, options) {
  return addMonths(date, amount * 3, options);
}
var init_addQuarters = __esm({
  "node_modules/date-fns/addQuarters.js"() {
    init_addMonths();
  }
});

// node_modules/date-fns/addSeconds.js
function addSeconds(date, amount, options) {
  return addMilliseconds(date, amount * 1e3, options);
}
var init_addSeconds = __esm({
  "node_modules/date-fns/addSeconds.js"() {
    init_addMilliseconds();
  }
});

// node_modules/date-fns/addWeeks.js
function addWeeks(date, amount, options) {
  return addDays(date, amount * 7, options);
}
var init_addWeeks = __esm({
  "node_modules/date-fns/addWeeks.js"() {
    init_addDays();
  }
});

// node_modules/date-fns/addYears.js
function addYears(date, amount, options) {
  return addMonths(date, amount * 12, options);
}
var init_addYears = __esm({
  "node_modules/date-fns/addYears.js"() {
    init_addMonths();
  }
});

// node_modules/date-fns/areIntervalsOverlapping.js
var init_areIntervalsOverlapping = __esm({
  "node_modules/date-fns/areIntervalsOverlapping.js"() {
  }
});

// node_modules/date-fns/max.js
var init_max = __esm({
  "node_modules/date-fns/max.js"() {
  }
});

// node_modules/date-fns/min.js
var init_min = __esm({
  "node_modules/date-fns/min.js"() {
  }
});

// node_modules/date-fns/clamp.js
var init_clamp = __esm({
  "node_modules/date-fns/clamp.js"() {
  }
});

// node_modules/date-fns/closestIndexTo.js
var init_closestIndexTo = __esm({
  "node_modules/date-fns/closestIndexTo.js"() {
  }
});

// node_modules/date-fns/closestTo.js
var init_closestTo = __esm({
  "node_modules/date-fns/closestTo.js"() {
  }
});

// node_modules/date-fns/compareAsc.js
function compareAsc(dateLeft, dateRight) {
  const diff = +toDate(dateLeft) - +toDate(dateRight);
  if (diff < 0) return -1;
  else if (diff > 0) return 1;
  return diff;
}
var init_compareAsc = __esm({
  "node_modules/date-fns/compareAsc.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/compareDesc.js
var init_compareDesc = __esm({
  "node_modules/date-fns/compareDesc.js"() {
  }
});

// node_modules/date-fns/constructNow.js
var init_constructNow = __esm({
  "node_modules/date-fns/constructNow.js"() {
  }
});

// node_modules/date-fns/daysToWeeks.js
var init_daysToWeeks = __esm({
  "node_modules/date-fns/daysToWeeks.js"() {
  }
});

// node_modules/date-fns/isSameDay.js
var init_isSameDay = __esm({
  "node_modules/date-fns/isSameDay.js"() {
  }
});

// node_modules/date-fns/isDate.js
function isDate(value) {
  return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
}
var init_isDate = __esm({
  "node_modules/date-fns/isDate.js"() {
  }
});

// node_modules/date-fns/isValid.js
function isValid(date) {
  return !(!isDate(date) && typeof date !== "number" || isNaN(+toDate(date)));
}
var init_isValid = __esm({
  "node_modules/date-fns/isValid.js"() {
    init_isDate();
    init_toDate();
  }
});

// node_modules/date-fns/differenceInBusinessDays.js
var init_differenceInBusinessDays = __esm({
  "node_modules/date-fns/differenceInBusinessDays.js"() {
  }
});

// node_modules/date-fns/differenceInCalendarISOWeekYears.js
var init_differenceInCalendarISOWeekYears = __esm({
  "node_modules/date-fns/differenceInCalendarISOWeekYears.js"() {
  }
});

// node_modules/date-fns/differenceInCalendarISOWeeks.js
var init_differenceInCalendarISOWeeks = __esm({
  "node_modules/date-fns/differenceInCalendarISOWeeks.js"() {
  }
});

// node_modules/date-fns/differenceInCalendarMonths.js
function differenceInCalendarMonths(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  const yearsDiff = laterDate_.getFullYear() - earlierDate_.getFullYear();
  const monthsDiff = laterDate_.getMonth() - earlierDate_.getMonth();
  return yearsDiff * 12 + monthsDiff;
}
var init_differenceInCalendarMonths = __esm({
  "node_modules/date-fns/differenceInCalendarMonths.js"() {
    init_normalizeDates();
  }
});

// node_modules/date-fns/getQuarter.js
var init_getQuarter = __esm({
  "node_modules/date-fns/getQuarter.js"() {
  }
});

// node_modules/date-fns/differenceInCalendarQuarters.js
var init_differenceInCalendarQuarters = __esm({
  "node_modules/date-fns/differenceInCalendarQuarters.js"() {
  }
});

// node_modules/date-fns/differenceInCalendarWeeks.js
var init_differenceInCalendarWeeks = __esm({
  "node_modules/date-fns/differenceInCalendarWeeks.js"() {
  }
});

// node_modules/date-fns/differenceInCalendarYears.js
function differenceInCalendarYears(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  return laterDate_.getFullYear() - earlierDate_.getFullYear();
}
var init_differenceInCalendarYears = __esm({
  "node_modules/date-fns/differenceInCalendarYears.js"() {
    init_normalizeDates();
  }
});

// node_modules/date-fns/differenceInDays.js
function differenceInDays(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  const sign = compareLocalAsc(laterDate_, earlierDate_);
  const difference = Math.abs(
    differenceInCalendarDays(laterDate_, earlierDate_)
  );
  laterDate_.setDate(laterDate_.getDate() - sign * difference);
  const isLastDayNotFull = Number(
    compareLocalAsc(laterDate_, earlierDate_) === -sign
  );
  const result = sign * (difference - isLastDayNotFull);
  return result === 0 ? 0 : result;
}
function compareLocalAsc(laterDate, earlierDate) {
  const diff = laterDate.getFullYear() - earlierDate.getFullYear() || laterDate.getMonth() - earlierDate.getMonth() || laterDate.getDate() - earlierDate.getDate() || laterDate.getHours() - earlierDate.getHours() || laterDate.getMinutes() - earlierDate.getMinutes() || laterDate.getSeconds() - earlierDate.getSeconds() || laterDate.getMilliseconds() - earlierDate.getMilliseconds();
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return diff;
}
var init_differenceInDays = __esm({
  "node_modules/date-fns/differenceInDays.js"() {
    init_normalizeDates();
    init_differenceInCalendarDays();
  }
});

// node_modules/date-fns/_lib/getRoundingMethod.js
function getRoundingMethod(method) {
  return (number) => {
    const round = method ? Math[method] : Math.trunc;
    const result = round(number);
    return result === 0 ? 0 : result;
  };
}
var init_getRoundingMethod = __esm({
  "node_modules/date-fns/_lib/getRoundingMethod.js"() {
  }
});

// node_modules/date-fns/differenceInHours.js
function differenceInHours(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  const diff = (+laterDate_ - +earlierDate_) / millisecondsInHour;
  return getRoundingMethod(options?.roundingMethod)(diff);
}
var init_differenceInHours = __esm({
  "node_modules/date-fns/differenceInHours.js"() {
    init_getRoundingMethod();
    init_normalizeDates();
    init_constants();
  }
});

// node_modules/date-fns/subISOWeekYears.js
var init_subISOWeekYears = __esm({
  "node_modules/date-fns/subISOWeekYears.js"() {
  }
});

// node_modules/date-fns/differenceInISOWeekYears.js
var init_differenceInISOWeekYears = __esm({
  "node_modules/date-fns/differenceInISOWeekYears.js"() {
  }
});

// node_modules/date-fns/differenceInMilliseconds.js
function differenceInMilliseconds(laterDate, earlierDate) {
  return +toDate(laterDate) - +toDate(earlierDate);
}
var init_differenceInMilliseconds = __esm({
  "node_modules/date-fns/differenceInMilliseconds.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/differenceInMinutes.js
function differenceInMinutes(dateLeft, dateRight, options) {
  const diff = differenceInMilliseconds(dateLeft, dateRight) / millisecondsInMinute;
  return getRoundingMethod(options?.roundingMethod)(diff);
}
var init_differenceInMinutes = __esm({
  "node_modules/date-fns/differenceInMinutes.js"() {
    init_getRoundingMethod();
    init_constants();
    init_differenceInMilliseconds();
  }
});

// node_modules/date-fns/endOfDay.js
function endOfDay(date, options) {
  const _date = toDate(date, options?.in);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
var init_endOfDay = __esm({
  "node_modules/date-fns/endOfDay.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/endOfMonth.js
function endOfMonth(date, options) {
  const _date = toDate(date, options?.in);
  const month = _date.getMonth();
  _date.setFullYear(_date.getFullYear(), month + 1, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
var init_endOfMonth = __esm({
  "node_modules/date-fns/endOfMonth.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/isLastDayOfMonth.js
function isLastDayOfMonth(date, options) {
  const _date = toDate(date, options?.in);
  return +endOfDay(_date, options) === +endOfMonth(_date, options);
}
var init_isLastDayOfMonth = __esm({
  "node_modules/date-fns/isLastDayOfMonth.js"() {
    init_endOfDay();
    init_endOfMonth();
    init_toDate();
  }
});

// node_modules/date-fns/differenceInMonths.js
function differenceInMonths(laterDate, earlierDate, options) {
  const [laterDate_, workingLaterDate, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    laterDate,
    earlierDate
  );
  const sign = compareAsc(workingLaterDate, earlierDate_);
  const difference = Math.abs(
    differenceInCalendarMonths(workingLaterDate, earlierDate_)
  );
  if (difference < 1) return 0;
  if (workingLaterDate.getMonth() === 1 && workingLaterDate.getDate() > 27)
    workingLaterDate.setDate(30);
  workingLaterDate.setMonth(workingLaterDate.getMonth() - sign * difference);
  let isLastMonthNotFull = compareAsc(workingLaterDate, earlierDate_) === -sign;
  if (isLastDayOfMonth(laterDate_) && difference === 1 && compareAsc(laterDate_, earlierDate_) === 1) {
    isLastMonthNotFull = false;
  }
  const result = sign * (difference - +isLastMonthNotFull);
  return result === 0 ? 0 : result;
}
var init_differenceInMonths = __esm({
  "node_modules/date-fns/differenceInMonths.js"() {
    init_normalizeDates();
    init_compareAsc();
    init_differenceInCalendarMonths();
    init_isLastDayOfMonth();
  }
});

// node_modules/date-fns/differenceInQuarters.js
function differenceInQuarters(laterDate, earlierDate, options) {
  const diff = differenceInMonths(laterDate, earlierDate, options) / 3;
  return getRoundingMethod(options?.roundingMethod)(diff);
}
var init_differenceInQuarters = __esm({
  "node_modules/date-fns/differenceInQuarters.js"() {
    init_getRoundingMethod();
    init_differenceInMonths();
  }
});

// node_modules/date-fns/differenceInSeconds.js
function differenceInSeconds(laterDate, earlierDate, options) {
  const diff = differenceInMilliseconds(laterDate, earlierDate) / 1e3;
  return getRoundingMethod(options?.roundingMethod)(diff);
}
var init_differenceInSeconds = __esm({
  "node_modules/date-fns/differenceInSeconds.js"() {
    init_getRoundingMethod();
    init_differenceInMilliseconds();
  }
});

// node_modules/date-fns/differenceInWeeks.js
function differenceInWeeks(laterDate, earlierDate, options) {
  const diff = differenceInDays(laterDate, earlierDate, options) / 7;
  return getRoundingMethod(options?.roundingMethod)(diff);
}
var init_differenceInWeeks = __esm({
  "node_modules/date-fns/differenceInWeeks.js"() {
    init_getRoundingMethod();
    init_differenceInDays();
  }
});

// node_modules/date-fns/differenceInYears.js
function differenceInYears(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  const sign = compareAsc(laterDate_, earlierDate_);
  const diff = Math.abs(differenceInCalendarYears(laterDate_, earlierDate_));
  laterDate_.setFullYear(1584);
  earlierDate_.setFullYear(1584);
  const partial = compareAsc(laterDate_, earlierDate_) === -sign;
  const result = sign * (diff - +partial);
  return result === 0 ? 0 : result;
}
var init_differenceInYears = __esm({
  "node_modules/date-fns/differenceInYears.js"() {
    init_normalizeDates();
    init_compareAsc();
    init_differenceInCalendarYears();
  }
});

// node_modules/date-fns/eachDayOfInterval.js
var init_eachDayOfInterval = __esm({
  "node_modules/date-fns/eachDayOfInterval.js"() {
  }
});

// node_modules/date-fns/eachHourOfInterval.js
var init_eachHourOfInterval = __esm({
  "node_modules/date-fns/eachHourOfInterval.js"() {
  }
});

// node_modules/date-fns/eachMinuteOfInterval.js
var init_eachMinuteOfInterval = __esm({
  "node_modules/date-fns/eachMinuteOfInterval.js"() {
  }
});

// node_modules/date-fns/eachMonthOfInterval.js
var init_eachMonthOfInterval = __esm({
  "node_modules/date-fns/eachMonthOfInterval.js"() {
  }
});

// node_modules/date-fns/startOfQuarter.js
function startOfQuarter(date, options) {
  const _date = toDate(date, options?.in);
  const currentMonth = _date.getMonth();
  const month = currentMonth - currentMonth % 3;
  _date.setMonth(month, 1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
var init_startOfQuarter = __esm({
  "node_modules/date-fns/startOfQuarter.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/eachQuarterOfInterval.js
var init_eachQuarterOfInterval = __esm({
  "node_modules/date-fns/eachQuarterOfInterval.js"() {
  }
});

// node_modules/date-fns/eachWeekOfInterval.js
var init_eachWeekOfInterval = __esm({
  "node_modules/date-fns/eachWeekOfInterval.js"() {
  }
});

// node_modules/date-fns/eachWeekendOfInterval.js
var init_eachWeekendOfInterval = __esm({
  "node_modules/date-fns/eachWeekendOfInterval.js"() {
  }
});

// node_modules/date-fns/startOfMonth.js
function startOfMonth(date, options) {
  const _date = toDate(date, options?.in);
  _date.setDate(1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
var init_startOfMonth = __esm({
  "node_modules/date-fns/startOfMonth.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/eachWeekendOfMonth.js
var init_eachWeekendOfMonth = __esm({
  "node_modules/date-fns/eachWeekendOfMonth.js"() {
  }
});

// node_modules/date-fns/endOfYear.js
function endOfYear(date, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();
  _date.setFullYear(year + 1, 0, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
var init_endOfYear = __esm({
  "node_modules/date-fns/endOfYear.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/startOfYear.js
function startOfYear(date, options) {
  const date_ = toDate(date, options?.in);
  date_.setFullYear(date_.getFullYear(), 0, 1);
  date_.setHours(0, 0, 0, 0);
  return date_;
}
var init_startOfYear = __esm({
  "node_modules/date-fns/startOfYear.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/eachWeekendOfYear.js
var init_eachWeekendOfYear = __esm({
  "node_modules/date-fns/eachWeekendOfYear.js"() {
  }
});

// node_modules/date-fns/eachYearOfInterval.js
var init_eachYearOfInterval = __esm({
  "node_modules/date-fns/eachYearOfInterval.js"() {
  }
});

// node_modules/date-fns/endOfDecade.js
var init_endOfDecade = __esm({
  "node_modules/date-fns/endOfDecade.js"() {
  }
});

// node_modules/date-fns/endOfHour.js
function endOfHour(date, options) {
  const _date = toDate(date, options?.in);
  _date.setMinutes(59, 59, 999);
  return _date;
}
var init_endOfHour = __esm({
  "node_modules/date-fns/endOfHour.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/endOfWeek.js
function endOfWeek(date, options) {
  const defaultOptions2 = getDefaultOptions();
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  const _date = toDate(date, options?.in);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
  _date.setDate(_date.getDate() + diff);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
var init_endOfWeek = __esm({
  "node_modules/date-fns/endOfWeek.js"() {
    init_defaultOptions();
    init_toDate();
  }
});

// node_modules/date-fns/endOfISOWeek.js
var init_endOfISOWeek = __esm({
  "node_modules/date-fns/endOfISOWeek.js"() {
  }
});

// node_modules/date-fns/endOfISOWeekYear.js
var init_endOfISOWeekYear = __esm({
  "node_modules/date-fns/endOfISOWeekYear.js"() {
  }
});

// node_modules/date-fns/endOfMinute.js
function endOfMinute(date, options) {
  const _date = toDate(date, options?.in);
  _date.setSeconds(59, 999);
  return _date;
}
var init_endOfMinute = __esm({
  "node_modules/date-fns/endOfMinute.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/endOfQuarter.js
function endOfQuarter(date, options) {
  const _date = toDate(date, options?.in);
  const currentMonth = _date.getMonth();
  const month = currentMonth - currentMonth % 3 + 3;
  _date.setMonth(month, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
var init_endOfQuarter = __esm({
  "node_modules/date-fns/endOfQuarter.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/endOfSecond.js
function endOfSecond(date, options) {
  const _date = toDate(date, options?.in);
  _date.setMilliseconds(999);
  return _date;
}
var init_endOfSecond = __esm({
  "node_modules/date-fns/endOfSecond.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/endOfToday.js
var init_endOfToday = __esm({
  "node_modules/date-fns/endOfToday.js"() {
  }
});

// node_modules/date-fns/endOfTomorrow.js
var init_endOfTomorrow = __esm({
  "node_modules/date-fns/endOfTomorrow.js"() {
  }
});

// node_modules/date-fns/endOfYesterday.js
var init_endOfYesterday = __esm({
  "node_modules/date-fns/endOfYesterday.js"() {
  }
});

// node_modules/date-fns/locale/en-US/_lib/formatDistance.js
var formatDistanceLocale, formatDistance;
var init_formatDistance = __esm({
  "node_modules/date-fns/locale/en-US/_lib/formatDistance.js"() {
    formatDistanceLocale = {
      lessThanXSeconds: {
        one: "less than a second",
        other: "less than {{count}} seconds"
      },
      xSeconds: {
        one: "1 second",
        other: "{{count}} seconds"
      },
      halfAMinute: "half a minute",
      lessThanXMinutes: {
        one: "less than a minute",
        other: "less than {{count}} minutes"
      },
      xMinutes: {
        one: "1 minute",
        other: "{{count}} minutes"
      },
      aboutXHours: {
        one: "about 1 hour",
        other: "about {{count}} hours"
      },
      xHours: {
        one: "1 hour",
        other: "{{count}} hours"
      },
      xDays: {
        one: "1 day",
        other: "{{count}} days"
      },
      aboutXWeeks: {
        one: "about 1 week",
        other: "about {{count}} weeks"
      },
      xWeeks: {
        one: "1 week",
        other: "{{count}} weeks"
      },
      aboutXMonths: {
        one: "about 1 month",
        other: "about {{count}} months"
      },
      xMonths: {
        one: "1 month",
        other: "{{count}} months"
      },
      aboutXYears: {
        one: "about 1 year",
        other: "about {{count}} years"
      },
      xYears: {
        one: "1 year",
        other: "{{count}} years"
      },
      overXYears: {
        one: "over 1 year",
        other: "over {{count}} years"
      },
      almostXYears: {
        one: "almost 1 year",
        other: "almost {{count}} years"
      }
    };
    formatDistance = (token, count, options) => {
      let result;
      const tokenValue = formatDistanceLocale[token];
      if (typeof tokenValue === "string") {
        result = tokenValue;
      } else if (count === 1) {
        result = tokenValue.one;
      } else {
        result = tokenValue.other.replace("{{count}}", count.toString());
      }
      if (options?.addSuffix) {
        if (options.comparison && options.comparison > 0) {
          return "in " + result;
        } else {
          return result + " ago";
        }
      }
      return result;
    };
  }
});

// node_modules/date-fns/locale/_lib/buildFormatLongFn.js
function buildFormatLongFn(args) {
  return (options = {}) => {
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format2 = args.formats[width] || args.formats[args.defaultWidth];
    return format2;
  };
}
var init_buildFormatLongFn = __esm({
  "node_modules/date-fns/locale/_lib/buildFormatLongFn.js"() {
  }
});

// node_modules/date-fns/locale/en-US/_lib/formatLong.js
var dateFormats, timeFormats, dateTimeFormats, formatLong;
var init_formatLong = __esm({
  "node_modules/date-fns/locale/en-US/_lib/formatLong.js"() {
    init_buildFormatLongFn();
    dateFormats = {
      full: "EEEE, MMMM do, y",
      long: "MMMM do, y",
      medium: "MMM d, y",
      short: "MM/dd/yyyy"
    };
    timeFormats = {
      full: "h:mm:ss a zzzz",
      long: "h:mm:ss a z",
      medium: "h:mm:ss a",
      short: "h:mm a"
    };
    dateTimeFormats = {
      full: "{{date}} 'at' {{time}}",
      long: "{{date}} 'at' {{time}}",
      medium: "{{date}}, {{time}}",
      short: "{{date}}, {{time}}"
    };
    formatLong = {
      date: buildFormatLongFn({
        formats: dateFormats,
        defaultWidth: "full"
      }),
      time: buildFormatLongFn({
        formats: timeFormats,
        defaultWidth: "full"
      }),
      dateTime: buildFormatLongFn({
        formats: dateTimeFormats,
        defaultWidth: "full"
      })
    };
  }
});

// node_modules/date-fns/locale/en-US/_lib/formatRelative.js
var formatRelativeLocale, formatRelative;
var init_formatRelative = __esm({
  "node_modules/date-fns/locale/en-US/_lib/formatRelative.js"() {
    formatRelativeLocale = {
      lastWeek: "'last' eeee 'at' p",
      yesterday: "'yesterday at' p",
      today: "'today at' p",
      tomorrow: "'tomorrow at' p",
      nextWeek: "eeee 'at' p",
      other: "P"
    };
    formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];
  }
});

// node_modules/date-fns/locale/_lib/buildLocalizeFn.js
function buildLocalizeFn(args) {
  return (value, options) => {
    const context = options?.context ? String(options.context) : "standalone";
    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = options?.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = options?.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index];
  };
}
var init_buildLocalizeFn = __esm({
  "node_modules/date-fns/locale/_lib/buildLocalizeFn.js"() {
  }
});

// node_modules/date-fns/locale/en-US/_lib/localize.js
var eraValues, quarterValues, monthValues, dayValues, dayPeriodValues, formattingDayPeriodValues, ordinalNumber, localize;
var init_localize = __esm({
  "node_modules/date-fns/locale/en-US/_lib/localize.js"() {
    init_buildLocalizeFn();
    eraValues = {
      narrow: ["B", "A"],
      abbreviated: ["BC", "AD"],
      wide: ["Before Christ", "Anno Domini"]
    };
    quarterValues = {
      narrow: ["1", "2", "3", "4"],
      abbreviated: ["Q1", "Q2", "Q3", "Q4"],
      wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
    };
    monthValues = {
      narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
      abbreviated: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      wide: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
    };
    dayValues = {
      narrow: ["S", "M", "T", "W", "T", "F", "S"],
      short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      wide: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ]
    };
    dayPeriodValues = {
      narrow: {
        am: "a",
        pm: "p",
        midnight: "mi",
        noon: "n",
        morning: "morning",
        afternoon: "afternoon",
        evening: "evening",
        night: "night"
      },
      abbreviated: {
        am: "AM",
        pm: "PM",
        midnight: "midnight",
        noon: "noon",
        morning: "morning",
        afternoon: "afternoon",
        evening: "evening",
        night: "night"
      },
      wide: {
        am: "a.m.",
        pm: "p.m.",
        midnight: "midnight",
        noon: "noon",
        morning: "morning",
        afternoon: "afternoon",
        evening: "evening",
        night: "night"
      }
    };
    formattingDayPeriodValues = {
      narrow: {
        am: "a",
        pm: "p",
        midnight: "mi",
        noon: "n",
        morning: "in the morning",
        afternoon: "in the afternoon",
        evening: "in the evening",
        night: "at night"
      },
      abbreviated: {
        am: "AM",
        pm: "PM",
        midnight: "midnight",
        noon: "noon",
        morning: "in the morning",
        afternoon: "in the afternoon",
        evening: "in the evening",
        night: "at night"
      },
      wide: {
        am: "a.m.",
        pm: "p.m.",
        midnight: "midnight",
        noon: "noon",
        morning: "in the morning",
        afternoon: "in the afternoon",
        evening: "in the evening",
        night: "at night"
      }
    };
    ordinalNumber = (dirtyNumber, _options) => {
      const number = Number(dirtyNumber);
      const rem100 = number % 100;
      if (rem100 > 20 || rem100 < 10) {
        switch (rem100 % 10) {
          case 1:
            return number + "st";
          case 2:
            return number + "nd";
          case 3:
            return number + "rd";
        }
      }
      return number + "th";
    };
    localize = {
      ordinalNumber,
      era: buildLocalizeFn({
        values: eraValues,
        defaultWidth: "wide"
      }),
      quarter: buildLocalizeFn({
        values: quarterValues,
        defaultWidth: "wide",
        argumentCallback: (quarter) => quarter - 1
      }),
      month: buildLocalizeFn({
        values: monthValues,
        defaultWidth: "wide"
      }),
      day: buildLocalizeFn({
        values: dayValues,
        defaultWidth: "wide"
      }),
      dayPeriod: buildLocalizeFn({
        values: dayPeriodValues,
        defaultWidth: "wide",
        formattingValues: formattingDayPeriodValues,
        defaultFormattingWidth: "wide"
      })
    };
  }
});

// node_modules/date-fns/locale/_lib/buildMatchFn.js
function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;
    const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];
    const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : (
      // [TODO] -- I challenge you to fix the type
      findKey(parsePatterns, (pattern) => pattern.test(matchedString))
    );
    let value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      options.valueCallback(value)
    ) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
function findKey(object, predicate) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}
var init_buildMatchFn = __esm({
  "node_modules/date-fns/locale/_lib/buildMatchFn.js"() {
  }
});

// node_modules/date-fns/locale/_lib/buildMatchPatternFn.js
function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];
    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
var init_buildMatchPatternFn = __esm({
  "node_modules/date-fns/locale/_lib/buildMatchPatternFn.js"() {
  }
});

// node_modules/date-fns/locale/en-US/_lib/match.js
var matchOrdinalNumberPattern, parseOrdinalNumberPattern, matchEraPatterns, parseEraPatterns, matchQuarterPatterns, parseQuarterPatterns, matchMonthPatterns, parseMonthPatterns, matchDayPatterns, parseDayPatterns, matchDayPeriodPatterns, parseDayPeriodPatterns, match;
var init_match = __esm({
  "node_modules/date-fns/locale/en-US/_lib/match.js"() {
    init_buildMatchFn();
    init_buildMatchPatternFn();
    matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
    parseOrdinalNumberPattern = /\d+/i;
    matchEraPatterns = {
      narrow: /^(b|a)/i,
      abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
      wide: /^(before christ|before common era|anno domini|common era)/i
    };
    parseEraPatterns = {
      any: [/^b/i, /^(a|c)/i]
    };
    matchQuarterPatterns = {
      narrow: /^[1234]/i,
      abbreviated: /^q[1234]/i,
      wide: /^[1234](th|st|nd|rd)? quarter/i
    };
    parseQuarterPatterns = {
      any: [/1/i, /2/i, /3/i, /4/i]
    };
    matchMonthPatterns = {
      narrow: /^[jfmasond]/i,
      abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
      wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
    };
    parseMonthPatterns = {
      narrow: [
        /^j/i,
        /^f/i,
        /^m/i,
        /^a/i,
        /^m/i,
        /^j/i,
        /^j/i,
        /^a/i,
        /^s/i,
        /^o/i,
        /^n/i,
        /^d/i
      ],
      any: [
        /^ja/i,
        /^f/i,
        /^mar/i,
        /^ap/i,
        /^may/i,
        /^jun/i,
        /^jul/i,
        /^au/i,
        /^s/i,
        /^o/i,
        /^n/i,
        /^d/i
      ]
    };
    matchDayPatterns = {
      narrow: /^[smtwf]/i,
      short: /^(su|mo|tu|we|th|fr|sa)/i,
      abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
      wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
    };
    parseDayPatterns = {
      narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
      any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
    };
    matchDayPeriodPatterns = {
      narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
      any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
    };
    parseDayPeriodPatterns = {
      any: {
        am: /^a/i,
        pm: /^p/i,
        midnight: /^mi/i,
        noon: /^no/i,
        morning: /morning/i,
        afternoon: /afternoon/i,
        evening: /evening/i,
        night: /night/i
      }
    };
    match = {
      ordinalNumber: buildMatchPatternFn({
        matchPattern: matchOrdinalNumberPattern,
        parsePattern: parseOrdinalNumberPattern,
        valueCallback: (value) => parseInt(value, 10)
      }),
      era: buildMatchFn({
        matchPatterns: matchEraPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseEraPatterns,
        defaultParseWidth: "any"
      }),
      quarter: buildMatchFn({
        matchPatterns: matchQuarterPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseQuarterPatterns,
        defaultParseWidth: "any",
        valueCallback: (index) => index + 1
      }),
      month: buildMatchFn({
        matchPatterns: matchMonthPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseMonthPatterns,
        defaultParseWidth: "any"
      }),
      day: buildMatchFn({
        matchPatterns: matchDayPatterns,
        defaultMatchWidth: "wide",
        parsePatterns: parseDayPatterns,
        defaultParseWidth: "any"
      }),
      dayPeriod: buildMatchFn({
        matchPatterns: matchDayPeriodPatterns,
        defaultMatchWidth: "any",
        parsePatterns: parseDayPeriodPatterns,
        defaultParseWidth: "any"
      })
    };
  }
});

// node_modules/date-fns/locale/en-US.js
var enUS;
var init_en_US = __esm({
  "node_modules/date-fns/locale/en-US.js"() {
    init_formatDistance();
    init_formatLong();
    init_formatRelative();
    init_localize();
    init_match();
    enUS = {
      code: "en-US",
      formatDistance,
      formatLong,
      formatRelative,
      localize,
      match,
      options: {
        weekStartsOn: 0,
        firstWeekContainsDate: 1
      }
    };
  }
});

// node_modules/date-fns/_lib/defaultLocale.js
var init_defaultLocale = __esm({
  "node_modules/date-fns/_lib/defaultLocale.js"() {
    init_en_US();
  }
});

// node_modules/date-fns/getDayOfYear.js
function getDayOfYear(date, options) {
  const _date = toDate(date, options?.in);
  const diff = differenceInCalendarDays(_date, startOfYear(_date));
  const dayOfYear = diff + 1;
  return dayOfYear;
}
var init_getDayOfYear = __esm({
  "node_modules/date-fns/getDayOfYear.js"() {
    init_differenceInCalendarDays();
    init_startOfYear();
    init_toDate();
  }
});

// node_modules/date-fns/getISOWeek.js
function getISOWeek(date, options) {
  const _date = toDate(date, options?.in);
  const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);
  return Math.round(diff / millisecondsInWeek) + 1;
}
var init_getISOWeek = __esm({
  "node_modules/date-fns/getISOWeek.js"() {
    init_constants();
    init_startOfISOWeek();
    init_startOfISOWeekYear();
    init_toDate();
  }
});

// node_modules/date-fns/getWeekYear.js
function getWeekYear(date, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();
  const defaultOptions2 = getDefaultOptions();
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const firstWeekOfNextYear = constructFrom(options?.in || date, 0);
  firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);
  const firstWeekOfThisYear = constructFrom(options?.in || date, 0);
  firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);
  if (+_date >= +startOfNextYear) {
    return year + 1;
  } else if (+_date >= +startOfThisYear) {
    return year;
  } else {
    return year - 1;
  }
}
var init_getWeekYear = __esm({
  "node_modules/date-fns/getWeekYear.js"() {
    init_defaultOptions();
    init_constructFrom();
    init_startOfWeek();
    init_toDate();
  }
});

// node_modules/date-fns/startOfWeekYear.js
function startOfWeekYear(date, options) {
  const defaultOptions2 = getDefaultOptions();
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const year = getWeekYear(date, options);
  const firstWeek = constructFrom(options?.in || date, 0);
  firstWeek.setFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  const _date = startOfWeek(firstWeek, options);
  return _date;
}
var init_startOfWeekYear = __esm({
  "node_modules/date-fns/startOfWeekYear.js"() {
    init_defaultOptions();
    init_constructFrom();
    init_getWeekYear();
    init_startOfWeek();
  }
});

// node_modules/date-fns/getWeek.js
function getWeek(date, options) {
  const _date = toDate(date, options?.in);
  const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);
  return Math.round(diff / millisecondsInWeek) + 1;
}
var init_getWeek = __esm({
  "node_modules/date-fns/getWeek.js"() {
    init_constants();
    init_startOfWeek();
    init_startOfWeekYear();
    init_toDate();
  }
});

// node_modules/date-fns/_lib/addLeadingZeros.js
function addLeadingZeros(number, targetLength) {
  const sign = number < 0 ? "-" : "";
  const output = Math.abs(number).toString().padStart(targetLength, "0");
  return sign + output;
}
var init_addLeadingZeros = __esm({
  "node_modules/date-fns/_lib/addLeadingZeros.js"() {
  }
});

// node_modules/date-fns/_lib/format/lightFormatters.js
var lightFormatters;
var init_lightFormatters = __esm({
  "node_modules/date-fns/_lib/format/lightFormatters.js"() {
    init_addLeadingZeros();
    lightFormatters = {
      // Year
      y(date, token) {
        const signedYear = date.getFullYear();
        const year = signedYear > 0 ? signedYear : 1 - signedYear;
        return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
      },
      // Month
      M(date, token) {
        const month = date.getMonth();
        return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
      },
      // Day of the month
      d(date, token) {
        return addLeadingZeros(date.getDate(), token.length);
      },
      // AM or PM
      a(date, token) {
        const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
        switch (token) {
          case "a":
          case "aa":
            return dayPeriodEnumValue.toUpperCase();
          case "aaa":
            return dayPeriodEnumValue;
          case "aaaaa":
            return dayPeriodEnumValue[0];
          case "aaaa":
          default:
            return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
        }
      },
      // Hour [1-12]
      h(date, token) {
        return addLeadingZeros(date.getHours() % 12 || 12, token.length);
      },
      // Hour [0-23]
      H(date, token) {
        return addLeadingZeros(date.getHours(), token.length);
      },
      // Minute
      m(date, token) {
        return addLeadingZeros(date.getMinutes(), token.length);
      },
      // Second
      s(date, token) {
        return addLeadingZeros(date.getSeconds(), token.length);
      },
      // Fraction of second
      S(date, token) {
        const numberOfDigits = token.length;
        const milliseconds = date.getMilliseconds();
        const fractionalSeconds = Math.trunc(
          milliseconds * Math.pow(10, numberOfDigits - 3)
        );
        return addLeadingZeros(fractionalSeconds, token.length);
      }
    };
  }
});

// node_modules/date-fns/_lib/format/formatters.js
function formatTimezoneShort(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = Math.trunc(absOffset / 60);
  const minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset, delimiter) {
  if (offset % 60 === 0) {
    const sign = offset > 0 ? "-" : "+";
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
  }
  return formatTimezone(offset, delimiter);
}
function formatTimezone(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = addLeadingZeros(Math.trunc(absOffset / 60), 2);
  const minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}
var dayPeriodEnum, formatters;
var init_formatters = __esm({
  "node_modules/date-fns/_lib/format/formatters.js"() {
    init_getDayOfYear();
    init_getISOWeek();
    init_getISOWeekYear();
    init_getWeek();
    init_getWeekYear();
    init_addLeadingZeros();
    init_lightFormatters();
    dayPeriodEnum = {
      am: "am",
      pm: "pm",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    };
    formatters = {
      // Era
      G: function(date, token, localize2) {
        const era = date.getFullYear() > 0 ? 1 : 0;
        switch (token) {
          // AD, BC
          case "G":
          case "GG":
          case "GGG":
            return localize2.era(era, { width: "abbreviated" });
          // A, B
          case "GGGGG":
            return localize2.era(era, { width: "narrow" });
          // Anno Domini, Before Christ
          case "GGGG":
          default:
            return localize2.era(era, { width: "wide" });
        }
      },
      // Year
      y: function(date, token, localize2) {
        if (token === "yo") {
          const signedYear = date.getFullYear();
          const year = signedYear > 0 ? signedYear : 1 - signedYear;
          return localize2.ordinalNumber(year, { unit: "year" });
        }
        return lightFormatters.y(date, token);
      },
      // Local week-numbering year
      Y: function(date, token, localize2, options) {
        const signedWeekYear = getWeekYear(date, options);
        const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
        if (token === "YY") {
          const twoDigitYear = weekYear % 100;
          return addLeadingZeros(twoDigitYear, 2);
        }
        if (token === "Yo") {
          return localize2.ordinalNumber(weekYear, { unit: "year" });
        }
        return addLeadingZeros(weekYear, token.length);
      },
      // ISO week-numbering year
      R: function(date, token) {
        const isoWeekYear = getISOWeekYear(date);
        return addLeadingZeros(isoWeekYear, token.length);
      },
      // Extended year. This is a single number designating the year of this calendar system.
      // The main difference between `y` and `u` localizers are B.C. years:
      // | Year | `y` | `u` |
      // |------|-----|-----|
      // | AC 1 |   1 |   1 |
      // | BC 1 |   1 |   0 |
      // | BC 2 |   2 |  -1 |
      // Also `yy` always returns the last two digits of a year,
      // while `uu` pads single digit years to 2 characters and returns other years unchanged.
      u: function(date, token) {
        const year = date.getFullYear();
        return addLeadingZeros(year, token.length);
      },
      // Quarter
      Q: function(date, token, localize2) {
        const quarter = Math.ceil((date.getMonth() + 1) / 3);
        switch (token) {
          // 1, 2, 3, 4
          case "Q":
            return String(quarter);
          // 01, 02, 03, 04
          case "QQ":
            return addLeadingZeros(quarter, 2);
          // 1st, 2nd, 3rd, 4th
          case "Qo":
            return localize2.ordinalNumber(quarter, { unit: "quarter" });
          // Q1, Q2, Q3, Q4
          case "QQQ":
            return localize2.quarter(quarter, {
              width: "abbreviated",
              context: "formatting"
            });
          // 1, 2, 3, 4 (narrow quarter; could be not numerical)
          case "QQQQQ":
            return localize2.quarter(quarter, {
              width: "narrow",
              context: "formatting"
            });
          // 1st quarter, 2nd quarter, ...
          case "QQQQ":
          default:
            return localize2.quarter(quarter, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      // Stand-alone quarter
      q: function(date, token, localize2) {
        const quarter = Math.ceil((date.getMonth() + 1) / 3);
        switch (token) {
          // 1, 2, 3, 4
          case "q":
            return String(quarter);
          // 01, 02, 03, 04
          case "qq":
            return addLeadingZeros(quarter, 2);
          // 1st, 2nd, 3rd, 4th
          case "qo":
            return localize2.ordinalNumber(quarter, { unit: "quarter" });
          // Q1, Q2, Q3, Q4
          case "qqq":
            return localize2.quarter(quarter, {
              width: "abbreviated",
              context: "standalone"
            });
          // 1, 2, 3, 4 (narrow quarter; could be not numerical)
          case "qqqqq":
            return localize2.quarter(quarter, {
              width: "narrow",
              context: "standalone"
            });
          // 1st quarter, 2nd quarter, ...
          case "qqqq":
          default:
            return localize2.quarter(quarter, {
              width: "wide",
              context: "standalone"
            });
        }
      },
      // Month
      M: function(date, token, localize2) {
        const month = date.getMonth();
        switch (token) {
          case "M":
          case "MM":
            return lightFormatters.M(date, token);
          // 1st, 2nd, ..., 12th
          case "Mo":
            return localize2.ordinalNumber(month + 1, { unit: "month" });
          // Jan, Feb, ..., Dec
          case "MMM":
            return localize2.month(month, {
              width: "abbreviated",
              context: "formatting"
            });
          // J, F, ..., D
          case "MMMMM":
            return localize2.month(month, {
              width: "narrow",
              context: "formatting"
            });
          // January, February, ..., December
          case "MMMM":
          default:
            return localize2.month(month, { width: "wide", context: "formatting" });
        }
      },
      // Stand-alone month
      L: function(date, token, localize2) {
        const month = date.getMonth();
        switch (token) {
          // 1, 2, ..., 12
          case "L":
            return String(month + 1);
          // 01, 02, ..., 12
          case "LL":
            return addLeadingZeros(month + 1, 2);
          // 1st, 2nd, ..., 12th
          case "Lo":
            return localize2.ordinalNumber(month + 1, { unit: "month" });
          // Jan, Feb, ..., Dec
          case "LLL":
            return localize2.month(month, {
              width: "abbreviated",
              context: "standalone"
            });
          // J, F, ..., D
          case "LLLLL":
            return localize2.month(month, {
              width: "narrow",
              context: "standalone"
            });
          // January, February, ..., December
          case "LLLL":
          default:
            return localize2.month(month, { width: "wide", context: "standalone" });
        }
      },
      // Local week of year
      w: function(date, token, localize2, options) {
        const week = getWeek(date, options);
        if (token === "wo") {
          return localize2.ordinalNumber(week, { unit: "week" });
        }
        return addLeadingZeros(week, token.length);
      },
      // ISO week of year
      I: function(date, token, localize2) {
        const isoWeek = getISOWeek(date);
        if (token === "Io") {
          return localize2.ordinalNumber(isoWeek, { unit: "week" });
        }
        return addLeadingZeros(isoWeek, token.length);
      },
      // Day of the month
      d: function(date, token, localize2) {
        if (token === "do") {
          return localize2.ordinalNumber(date.getDate(), { unit: "date" });
        }
        return lightFormatters.d(date, token);
      },
      // Day of year
      D: function(date, token, localize2) {
        const dayOfYear = getDayOfYear(date);
        if (token === "Do") {
          return localize2.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
        }
        return addLeadingZeros(dayOfYear, token.length);
      },
      // Day of week
      E: function(date, token, localize2) {
        const dayOfWeek = date.getDay();
        switch (token) {
          // Tue
          case "E":
          case "EE":
          case "EEE":
            return localize2.day(dayOfWeek, {
              width: "abbreviated",
              context: "formatting"
            });
          // T
          case "EEEEE":
            return localize2.day(dayOfWeek, {
              width: "narrow",
              context: "formatting"
            });
          // Tu
          case "EEEEEE":
            return localize2.day(dayOfWeek, {
              width: "short",
              context: "formatting"
            });
          // Tuesday
          case "EEEE":
          default:
            return localize2.day(dayOfWeek, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      // Local day of week
      e: function(date, token, localize2, options) {
        const dayOfWeek = date.getDay();
        const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
        switch (token) {
          // Numerical value (Nth day of week with current locale or weekStartsOn)
          case "e":
            return String(localDayOfWeek);
          // Padded numerical value
          case "ee":
            return addLeadingZeros(localDayOfWeek, 2);
          // 1st, 2nd, ..., 7th
          case "eo":
            return localize2.ordinalNumber(localDayOfWeek, { unit: "day" });
          case "eee":
            return localize2.day(dayOfWeek, {
              width: "abbreviated",
              context: "formatting"
            });
          // T
          case "eeeee":
            return localize2.day(dayOfWeek, {
              width: "narrow",
              context: "formatting"
            });
          // Tu
          case "eeeeee":
            return localize2.day(dayOfWeek, {
              width: "short",
              context: "formatting"
            });
          // Tuesday
          case "eeee":
          default:
            return localize2.day(dayOfWeek, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      // Stand-alone local day of week
      c: function(date, token, localize2, options) {
        const dayOfWeek = date.getDay();
        const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
        switch (token) {
          // Numerical value (same as in `e`)
          case "c":
            return String(localDayOfWeek);
          // Padded numerical value
          case "cc":
            return addLeadingZeros(localDayOfWeek, token.length);
          // 1st, 2nd, ..., 7th
          case "co":
            return localize2.ordinalNumber(localDayOfWeek, { unit: "day" });
          case "ccc":
            return localize2.day(dayOfWeek, {
              width: "abbreviated",
              context: "standalone"
            });
          // T
          case "ccccc":
            return localize2.day(dayOfWeek, {
              width: "narrow",
              context: "standalone"
            });
          // Tu
          case "cccccc":
            return localize2.day(dayOfWeek, {
              width: "short",
              context: "standalone"
            });
          // Tuesday
          case "cccc":
          default:
            return localize2.day(dayOfWeek, {
              width: "wide",
              context: "standalone"
            });
        }
      },
      // ISO day of week
      i: function(date, token, localize2) {
        const dayOfWeek = date.getDay();
        const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
        switch (token) {
          // 2
          case "i":
            return String(isoDayOfWeek);
          // 02
          case "ii":
            return addLeadingZeros(isoDayOfWeek, token.length);
          // 2nd
          case "io":
            return localize2.ordinalNumber(isoDayOfWeek, { unit: "day" });
          // Tue
          case "iii":
            return localize2.day(dayOfWeek, {
              width: "abbreviated",
              context: "formatting"
            });
          // T
          case "iiiii":
            return localize2.day(dayOfWeek, {
              width: "narrow",
              context: "formatting"
            });
          // Tu
          case "iiiiii":
            return localize2.day(dayOfWeek, {
              width: "short",
              context: "formatting"
            });
          // Tuesday
          case "iiii":
          default:
            return localize2.day(dayOfWeek, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      // AM or PM
      a: function(date, token, localize2) {
        const hours = date.getHours();
        const dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
        switch (token) {
          case "a":
          case "aa":
            return localize2.dayPeriod(dayPeriodEnumValue, {
              width: "abbreviated",
              context: "formatting"
            });
          case "aaa":
            return localize2.dayPeriod(dayPeriodEnumValue, {
              width: "abbreviated",
              context: "formatting"
            }).toLowerCase();
          case "aaaaa":
            return localize2.dayPeriod(dayPeriodEnumValue, {
              width: "narrow",
              context: "formatting"
            });
          case "aaaa":
          default:
            return localize2.dayPeriod(dayPeriodEnumValue, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      // AM, PM, midnight, noon
      b: function(date, token, localize2) {
        const hours = date.getHours();
        let dayPeriodEnumValue;
        if (hours === 12) {
          dayPeriodEnumValue = dayPeriodEnum.noon;
        } else if (hours === 0) {
          dayPeriodEnumValue = dayPeriodEnum.midnight;
        } else {
          dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
        }
        switch (token) {
          case "b":
          case "bb":
            return localize2.dayPeriod(dayPeriodEnumValue, {
              width: "abbreviated",
              context: "formatting"
            });
          case "bbb":
            return localize2.dayPeriod(dayPeriodEnumValue, {
              width: "abbreviated",
              context: "formatting"
            }).toLowerCase();
          case "bbbbb":
            return localize2.dayPeriod(dayPeriodEnumValue, {
              width: "narrow",
              context: "formatting"
            });
          case "bbbb":
          default:
            return localize2.dayPeriod(dayPeriodEnumValue, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      // in the morning, in the afternoon, in the evening, at night
      B: function(date, token, localize2) {
        const hours = date.getHours();
        let dayPeriodEnumValue;
        if (hours >= 17) {
          dayPeriodEnumValue = dayPeriodEnum.evening;
        } else if (hours >= 12) {
          dayPeriodEnumValue = dayPeriodEnum.afternoon;
        } else if (hours >= 4) {
          dayPeriodEnumValue = dayPeriodEnum.morning;
        } else {
          dayPeriodEnumValue = dayPeriodEnum.night;
        }
        switch (token) {
          case "B":
          case "BB":
          case "BBB":
            return localize2.dayPeriod(dayPeriodEnumValue, {
              width: "abbreviated",
              context: "formatting"
            });
          case "BBBBB":
            return localize2.dayPeriod(dayPeriodEnumValue, {
              width: "narrow",
              context: "formatting"
            });
          case "BBBB":
          default:
            return localize2.dayPeriod(dayPeriodEnumValue, {
              width: "wide",
              context: "formatting"
            });
        }
      },
      // Hour [1-12]
      h: function(date, token, localize2) {
        if (token === "ho") {
          let hours = date.getHours() % 12;
          if (hours === 0) hours = 12;
          return localize2.ordinalNumber(hours, { unit: "hour" });
        }
        return lightFormatters.h(date, token);
      },
      // Hour [0-23]
      H: function(date, token, localize2) {
        if (token === "Ho") {
          return localize2.ordinalNumber(date.getHours(), { unit: "hour" });
        }
        return lightFormatters.H(date, token);
      },
      // Hour [0-11]
      K: function(date, token, localize2) {
        const hours = date.getHours() % 12;
        if (token === "Ko") {
          return localize2.ordinalNumber(hours, { unit: "hour" });
        }
        return addLeadingZeros(hours, token.length);
      },
      // Hour [1-24]
      k: function(date, token, localize2) {
        let hours = date.getHours();
        if (hours === 0) hours = 24;
        if (token === "ko") {
          return localize2.ordinalNumber(hours, { unit: "hour" });
        }
        return addLeadingZeros(hours, token.length);
      },
      // Minute
      m: function(date, token, localize2) {
        if (token === "mo") {
          return localize2.ordinalNumber(date.getMinutes(), { unit: "minute" });
        }
        return lightFormatters.m(date, token);
      },
      // Second
      s: function(date, token, localize2) {
        if (token === "so") {
          return localize2.ordinalNumber(date.getSeconds(), { unit: "second" });
        }
        return lightFormatters.s(date, token);
      },
      // Fraction of second
      S: function(date, token) {
        return lightFormatters.S(date, token);
      },
      // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
      X: function(date, token, _localize) {
        const timezoneOffset = date.getTimezoneOffset();
        if (timezoneOffset === 0) {
          return "Z";
        }
        switch (token) {
          // Hours and optional minutes
          case "X":
            return formatTimezoneWithOptionalMinutes(timezoneOffset);
          // Hours, minutes and optional seconds without `:` delimiter
          // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
          // so this token always has the same output as `XX`
          case "XXXX":
          case "XX":
            return formatTimezone(timezoneOffset);
          // Hours, minutes and optional seconds with `:` delimiter
          // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
          // so this token always has the same output as `XXX`
          case "XXXXX":
          case "XXX":
          // Hours and minutes with `:` delimiter
          default:
            return formatTimezone(timezoneOffset, ":");
        }
      },
      // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
      x: function(date, token, _localize) {
        const timezoneOffset = date.getTimezoneOffset();
        switch (token) {
          // Hours and optional minutes
          case "x":
            return formatTimezoneWithOptionalMinutes(timezoneOffset);
          // Hours, minutes and optional seconds without `:` delimiter
          // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
          // so this token always has the same output as `xx`
          case "xxxx":
          case "xx":
            return formatTimezone(timezoneOffset);
          // Hours, minutes and optional seconds with `:` delimiter
          // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
          // so this token always has the same output as `xxx`
          case "xxxxx":
          case "xxx":
          // Hours and minutes with `:` delimiter
          default:
            return formatTimezone(timezoneOffset, ":");
        }
      },
      // Timezone (GMT)
      O: function(date, token, _localize) {
        const timezoneOffset = date.getTimezoneOffset();
        switch (token) {
          // Short
          case "O":
          case "OO":
          case "OOO":
            return "GMT" + formatTimezoneShort(timezoneOffset, ":");
          // Long
          case "OOOO":
          default:
            return "GMT" + formatTimezone(timezoneOffset, ":");
        }
      },
      // Timezone (specific non-location)
      z: function(date, token, _localize) {
        const timezoneOffset = date.getTimezoneOffset();
        switch (token) {
          // Short
          case "z":
          case "zz":
          case "zzz":
            return "GMT" + formatTimezoneShort(timezoneOffset, ":");
          // Long
          case "zzzz":
          default:
            return "GMT" + formatTimezone(timezoneOffset, ":");
        }
      },
      // Seconds timestamp
      t: function(date, token, _localize) {
        const timestamp = Math.trunc(+date / 1e3);
        return addLeadingZeros(timestamp, token.length);
      },
      // Milliseconds timestamp
      T: function(date, token, _localize) {
        return addLeadingZeros(+date, token.length);
      }
    };
  }
});

// node_modules/date-fns/_lib/format/longFormatters.js
var dateLongFormatter, timeLongFormatter, dateTimeLongFormatter, longFormatters;
var init_longFormatters = __esm({
  "node_modules/date-fns/_lib/format/longFormatters.js"() {
    dateLongFormatter = (pattern, formatLong2) => {
      switch (pattern) {
        case "P":
          return formatLong2.date({ width: "short" });
        case "PP":
          return formatLong2.date({ width: "medium" });
        case "PPP":
          return formatLong2.date({ width: "long" });
        case "PPPP":
        default:
          return formatLong2.date({ width: "full" });
      }
    };
    timeLongFormatter = (pattern, formatLong2) => {
      switch (pattern) {
        case "p":
          return formatLong2.time({ width: "short" });
        case "pp":
          return formatLong2.time({ width: "medium" });
        case "ppp":
          return formatLong2.time({ width: "long" });
        case "pppp":
        default:
          return formatLong2.time({ width: "full" });
      }
    };
    dateTimeLongFormatter = (pattern, formatLong2) => {
      const matchResult = pattern.match(/(P+)(p+)?/) || [];
      const datePattern = matchResult[1];
      const timePattern = matchResult[2];
      if (!timePattern) {
        return dateLongFormatter(pattern, formatLong2);
      }
      let dateTimeFormat;
      switch (datePattern) {
        case "P":
          dateTimeFormat = formatLong2.dateTime({ width: "short" });
          break;
        case "PP":
          dateTimeFormat = formatLong2.dateTime({ width: "medium" });
          break;
        case "PPP":
          dateTimeFormat = formatLong2.dateTime({ width: "long" });
          break;
        case "PPPP":
        default:
          dateTimeFormat = formatLong2.dateTime({ width: "full" });
          break;
      }
      return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
    };
    longFormatters = {
      p: timeLongFormatter,
      P: dateTimeLongFormatter
    };
  }
});

// node_modules/date-fns/_lib/protectedTokens.js
function isProtectedDayOfYearToken(token) {
  return dayOfYearTokenRE.test(token);
}
function isProtectedWeekYearToken(token) {
  return weekYearTokenRE.test(token);
}
function warnOrThrowProtectedError(token, format2, input) {
  const _message = message(token, format2, input);
  console.warn(_message);
  if (throwTokens.includes(token)) throw new RangeError(_message);
}
function message(token, format2, input) {
  const subject = token[0] === "Y" ? "years" : "days of the month";
  return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format2}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
var dayOfYearTokenRE, weekYearTokenRE, throwTokens;
var init_protectedTokens = __esm({
  "node_modules/date-fns/_lib/protectedTokens.js"() {
    dayOfYearTokenRE = /^D+$/;
    weekYearTokenRE = /^Y+$/;
    throwTokens = ["D", "DD", "YY", "YYYY"];
  }
});

// node_modules/date-fns/format.js
function format(date, formatStr, options) {
  const defaultOptions2 = getDefaultOptions();
  const locale = options?.locale ?? defaultOptions2.locale ?? enUS;
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  const originalDate = toDate(date, options?.in);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  let parts = formatStr.match(longFormattingTokensRegExp).map((substring) => {
    const firstCharacter = substring[0];
    if (firstCharacter === "p" || firstCharacter === "P") {
      const longFormatter = longFormatters[firstCharacter];
      return longFormatter(substring, locale.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp).map((substring) => {
    if (substring === "''") {
      return { isToken: false, value: "'" };
    }
    const firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return { isToken: false, value: cleanEscapedString(substring) };
    }
    if (formatters[firstCharacter]) {
      return { isToken: true, value: substring };
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + firstCharacter + "`"
      );
    }
    return { isToken: false, value: substring };
  });
  if (locale.localize.preprocessor) {
    parts = locale.localize.preprocessor(originalDate, parts);
  }
  const formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale
  };
  return parts.map((part) => {
    if (!part.isToken) return part.value;
    const token = part.value;
    if (!options?.useAdditionalWeekYearTokens && isProtectedWeekYearToken(token) || !options?.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(token)) {
      warnOrThrowProtectedError(token, formatStr, String(date));
    }
    const formatter = formatters[token[0]];
    return formatter(originalDate, token, locale.localize, formatterOptions);
  }).join("");
}
function cleanEscapedString(input) {
  const matched = input.match(escapedStringRegExp);
  if (!matched) {
    return input;
  }
  return matched[1].replace(doubleQuoteRegExp, "'");
}
var formattingTokensRegExp, longFormattingTokensRegExp, escapedStringRegExp, doubleQuoteRegExp, unescapedLatinCharacterRegExp;
var init_format = __esm({
  "node_modules/date-fns/format.js"() {
    init_defaultLocale();
    init_defaultOptions();
    init_formatters();
    init_longFormatters();
    init_protectedTokens();
    init_isValid();
    init_toDate();
    formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
    longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
    escapedStringRegExp = /^'([^]*?)'?$/;
    doubleQuoteRegExp = /''/g;
    unescapedLatinCharacterRegExp = /[a-zA-Z]/;
  }
});

// node_modules/date-fns/formatDistance.js
var init_formatDistance2 = __esm({
  "node_modules/date-fns/formatDistance.js"() {
  }
});

// node_modules/date-fns/formatDistanceStrict.js
var init_formatDistanceStrict = __esm({
  "node_modules/date-fns/formatDistanceStrict.js"() {
  }
});

// node_modules/date-fns/formatDistanceToNow.js
var init_formatDistanceToNow = __esm({
  "node_modules/date-fns/formatDistanceToNow.js"() {
  }
});

// node_modules/date-fns/formatDistanceToNowStrict.js
var init_formatDistanceToNowStrict = __esm({
  "node_modules/date-fns/formatDistanceToNowStrict.js"() {
  }
});

// node_modules/date-fns/formatDuration.js
var init_formatDuration = __esm({
  "node_modules/date-fns/formatDuration.js"() {
  }
});

// node_modules/date-fns/formatISO.js
var init_formatISO = __esm({
  "node_modules/date-fns/formatISO.js"() {
  }
});

// node_modules/date-fns/formatISO9075.js
var init_formatISO9075 = __esm({
  "node_modules/date-fns/formatISO9075.js"() {
  }
});

// node_modules/date-fns/formatISODuration.js
var init_formatISODuration = __esm({
  "node_modules/date-fns/formatISODuration.js"() {
  }
});

// node_modules/date-fns/formatRFC3339.js
var init_formatRFC3339 = __esm({
  "node_modules/date-fns/formatRFC3339.js"() {
  }
});

// node_modules/date-fns/formatRFC7231.js
var init_formatRFC7231 = __esm({
  "node_modules/date-fns/formatRFC7231.js"() {
  }
});

// node_modules/date-fns/formatRelative.js
var init_formatRelative2 = __esm({
  "node_modules/date-fns/formatRelative.js"() {
  }
});

// node_modules/date-fns/fromUnixTime.js
var init_fromUnixTime = __esm({
  "node_modules/date-fns/fromUnixTime.js"() {
  }
});

// node_modules/date-fns/getDate.js
var init_getDate = __esm({
  "node_modules/date-fns/getDate.js"() {
  }
});

// node_modules/date-fns/getDay.js
var init_getDay = __esm({
  "node_modules/date-fns/getDay.js"() {
  }
});

// node_modules/date-fns/getDaysInMonth.js
var init_getDaysInMonth = __esm({
  "node_modules/date-fns/getDaysInMonth.js"() {
  }
});

// node_modules/date-fns/isLeapYear.js
var init_isLeapYear = __esm({
  "node_modules/date-fns/isLeapYear.js"() {
  }
});

// node_modules/date-fns/getDaysInYear.js
var init_getDaysInYear = __esm({
  "node_modules/date-fns/getDaysInYear.js"() {
  }
});

// node_modules/date-fns/getDecade.js
var init_getDecade = __esm({
  "node_modules/date-fns/getDecade.js"() {
  }
});

// node_modules/date-fns/getDefaultOptions.js
function getDefaultOptions2() {
  return Object.assign({}, getDefaultOptions());
}
var init_getDefaultOptions = __esm({
  "node_modules/date-fns/getDefaultOptions.js"() {
    init_defaultOptions();
  }
});

// node_modules/date-fns/getHours.js
var init_getHours = __esm({
  "node_modules/date-fns/getHours.js"() {
  }
});

// node_modules/date-fns/getISODay.js
function getISODay(date, options) {
  const day = toDate(date, options?.in).getDay();
  return day === 0 ? 7 : day;
}
var init_getISODay = __esm({
  "node_modules/date-fns/getISODay.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/getISOWeeksInYear.js
var init_getISOWeeksInYear = __esm({
  "node_modules/date-fns/getISOWeeksInYear.js"() {
  }
});

// node_modules/date-fns/getMilliseconds.js
var init_getMilliseconds = __esm({
  "node_modules/date-fns/getMilliseconds.js"() {
  }
});

// node_modules/date-fns/getMinutes.js
var init_getMinutes = __esm({
  "node_modules/date-fns/getMinutes.js"() {
  }
});

// node_modules/date-fns/getMonth.js
var init_getMonth = __esm({
  "node_modules/date-fns/getMonth.js"() {
  }
});

// node_modules/date-fns/getOverlappingDaysInIntervals.js
var init_getOverlappingDaysInIntervals = __esm({
  "node_modules/date-fns/getOverlappingDaysInIntervals.js"() {
  }
});

// node_modules/date-fns/getSeconds.js
var init_getSeconds = __esm({
  "node_modules/date-fns/getSeconds.js"() {
  }
});

// node_modules/date-fns/getTime.js
var init_getTime = __esm({
  "node_modules/date-fns/getTime.js"() {
  }
});

// node_modules/date-fns/getUnixTime.js
var init_getUnixTime = __esm({
  "node_modules/date-fns/getUnixTime.js"() {
  }
});

// node_modules/date-fns/getWeekOfMonth.js
var init_getWeekOfMonth = __esm({
  "node_modules/date-fns/getWeekOfMonth.js"() {
  }
});

// node_modules/date-fns/lastDayOfMonth.js
var init_lastDayOfMonth = __esm({
  "node_modules/date-fns/lastDayOfMonth.js"() {
  }
});

// node_modules/date-fns/getWeeksInMonth.js
var init_getWeeksInMonth = __esm({
  "node_modules/date-fns/getWeeksInMonth.js"() {
  }
});

// node_modules/date-fns/getYear.js
var init_getYear = __esm({
  "node_modules/date-fns/getYear.js"() {
  }
});

// node_modules/date-fns/hoursToMilliseconds.js
var init_hoursToMilliseconds = __esm({
  "node_modules/date-fns/hoursToMilliseconds.js"() {
  }
});

// node_modules/date-fns/hoursToMinutes.js
var init_hoursToMinutes = __esm({
  "node_modules/date-fns/hoursToMinutes.js"() {
  }
});

// node_modules/date-fns/hoursToSeconds.js
var init_hoursToSeconds = __esm({
  "node_modules/date-fns/hoursToSeconds.js"() {
  }
});

// node_modules/date-fns/interval.js
var init_interval = __esm({
  "node_modules/date-fns/interval.js"() {
  }
});

// node_modules/date-fns/intervalToDuration.js
var init_intervalToDuration = __esm({
  "node_modules/date-fns/intervalToDuration.js"() {
  }
});

// node_modules/date-fns/intlFormat.js
var init_intlFormat = __esm({
  "node_modules/date-fns/intlFormat.js"() {
  }
});

// node_modules/date-fns/intlFormatDistance.js
var init_intlFormatDistance = __esm({
  "node_modules/date-fns/intlFormatDistance.js"() {
  }
});

// node_modules/date-fns/isAfter.js
var init_isAfter = __esm({
  "node_modules/date-fns/isAfter.js"() {
  }
});

// node_modules/date-fns/isBefore.js
var init_isBefore = __esm({
  "node_modules/date-fns/isBefore.js"() {
  }
});

// node_modules/date-fns/isEqual.js
var init_isEqual = __esm({
  "node_modules/date-fns/isEqual.js"() {
  }
});

// node_modules/date-fns/isExists.js
var init_isExists = __esm({
  "node_modules/date-fns/isExists.js"() {
  }
});

// node_modules/date-fns/isFirstDayOfMonth.js
var init_isFirstDayOfMonth = __esm({
  "node_modules/date-fns/isFirstDayOfMonth.js"() {
  }
});

// node_modules/date-fns/isFriday.js
var init_isFriday = __esm({
  "node_modules/date-fns/isFriday.js"() {
  }
});

// node_modules/date-fns/isFuture.js
var init_isFuture = __esm({
  "node_modules/date-fns/isFuture.js"() {
  }
});

// node_modules/date-fns/transpose.js
function transpose(date, constructor) {
  const date_ = isConstructor(constructor) ? new constructor(0) : constructFrom(constructor, 0);
  date_.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  date_.setHours(
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
  return date_;
}
function isConstructor(constructor) {
  return typeof constructor === "function" && constructor.prototype?.constructor === constructor;
}
var init_transpose = __esm({
  "node_modules/date-fns/transpose.js"() {
    init_constructFrom();
  }
});

// node_modules/date-fns/parse/_lib/Setter.js
var TIMEZONE_UNIT_PRIORITY, Setter, ValueSetter, DateTimezoneSetter;
var init_Setter = __esm({
  "node_modules/date-fns/parse/_lib/Setter.js"() {
    init_constructFrom();
    init_transpose();
    TIMEZONE_UNIT_PRIORITY = 10;
    Setter = class {
      subPriority = 0;
      validate(_utcDate, _options) {
        return true;
      }
    };
    ValueSetter = class extends Setter {
      constructor(value, validateValue, setValue, priority, subPriority) {
        super();
        this.value = value;
        this.validateValue = validateValue;
        this.setValue = setValue;
        this.priority = priority;
        if (subPriority) {
          this.subPriority = subPriority;
        }
      }
      validate(date, options) {
        return this.validateValue(date, this.value, options);
      }
      set(date, flags, options) {
        return this.setValue(date, flags, this.value, options);
      }
    };
    DateTimezoneSetter = class extends Setter {
      priority = TIMEZONE_UNIT_PRIORITY;
      subPriority = -1;
      constructor(context, reference) {
        super();
        this.context = context || ((date) => constructFrom(reference, date));
      }
      set(date, flags) {
        if (flags.timestampIsSet) return date;
        return constructFrom(date, transpose(date, this.context));
      }
    };
  }
});

// node_modules/date-fns/parse/_lib/Parser.js
var Parser;
var init_Parser = __esm({
  "node_modules/date-fns/parse/_lib/Parser.js"() {
    init_Setter();
    Parser = class {
      run(dateString, token, match2, options) {
        const result = this.parse(dateString, token, match2, options);
        if (!result) {
          return null;
        }
        return {
          setter: new ValueSetter(
            result.value,
            this.validate,
            this.set,
            this.priority,
            this.subPriority
          ),
          rest: result.rest
        };
      }
      validate(_utcDate, _value, _options) {
        return true;
      }
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/EraParser.js
var EraParser;
var init_EraParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/EraParser.js"() {
    init_Parser();
    EraParser = class extends Parser {
      priority = 140;
      parse(dateString, token, match2) {
        switch (token) {
          // AD, BC
          case "G":
          case "GG":
          case "GGG":
            return match2.era(dateString, { width: "abbreviated" }) || match2.era(dateString, { width: "narrow" });
          // A, B
          case "GGGGG":
            return match2.era(dateString, { width: "narrow" });
          // Anno Domini, Before Christ
          case "GGGG":
          default:
            return match2.era(dateString, { width: "wide" }) || match2.era(dateString, { width: "abbreviated" }) || match2.era(dateString, { width: "narrow" });
        }
      }
      set(date, flags, value) {
        flags.era = value;
        date.setFullYear(value, 0, 1);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      incompatibleTokens = ["R", "u", "t", "T"];
    };
  }
});

// node_modules/date-fns/parse/_lib/constants.js
var numericPatterns, timezonePatterns;
var init_constants2 = __esm({
  "node_modules/date-fns/parse/_lib/constants.js"() {
    numericPatterns = {
      month: /^(1[0-2]|0?\d)/,
      // 0 to 12
      date: /^(3[0-1]|[0-2]?\d)/,
      // 0 to 31
      dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
      // 0 to 366
      week: /^(5[0-3]|[0-4]?\d)/,
      // 0 to 53
      hour23h: /^(2[0-3]|[0-1]?\d)/,
      // 0 to 23
      hour24h: /^(2[0-4]|[0-1]?\d)/,
      // 0 to 24
      hour11h: /^(1[0-1]|0?\d)/,
      // 0 to 11
      hour12h: /^(1[0-2]|0?\d)/,
      // 0 to 12
      minute: /^[0-5]?\d/,
      // 0 to 59
      second: /^[0-5]?\d/,
      // 0 to 59
      singleDigit: /^\d/,
      // 0 to 9
      twoDigits: /^\d{1,2}/,
      // 0 to 99
      threeDigits: /^\d{1,3}/,
      // 0 to 999
      fourDigits: /^\d{1,4}/,
      // 0 to 9999
      anyDigitsSigned: /^-?\d+/,
      singleDigitSigned: /^-?\d/,
      // 0 to 9, -0 to -9
      twoDigitsSigned: /^-?\d{1,2}/,
      // 0 to 99, -0 to -99
      threeDigitsSigned: /^-?\d{1,3}/,
      // 0 to 999, -0 to -999
      fourDigitsSigned: /^-?\d{1,4}/
      // 0 to 9999, -0 to -9999
    };
    timezonePatterns = {
      basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
      basic: /^([+-])(\d{2})(\d{2})|Z/,
      basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
      extended: /^([+-])(\d{2}):(\d{2})|Z/,
      extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
    };
  }
});

// node_modules/date-fns/parse/_lib/utils.js
function mapValue(parseFnResult, mapFn) {
  if (!parseFnResult) {
    return parseFnResult;
  }
  return {
    value: mapFn(parseFnResult.value),
    rest: parseFnResult.rest
  };
}
function parseNumericPattern(pattern, dateString) {
  const matchResult = dateString.match(pattern);
  if (!matchResult) {
    return null;
  }
  return {
    value: parseInt(matchResult[0], 10),
    rest: dateString.slice(matchResult[0].length)
  };
}
function parseTimezonePattern(pattern, dateString) {
  const matchResult = dateString.match(pattern);
  if (!matchResult) {
    return null;
  }
  if (matchResult[0] === "Z") {
    return {
      value: 0,
      rest: dateString.slice(1)
    };
  }
  const sign = matchResult[1] === "+" ? 1 : -1;
  const hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
  const minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
  const seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;
  return {
    value: sign * (hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * millisecondsInSecond),
    rest: dateString.slice(matchResult[0].length)
  };
}
function parseAnyDigitsSigned(dateString) {
  return parseNumericPattern(numericPatterns.anyDigitsSigned, dateString);
}
function parseNDigits(n, dateString) {
  switch (n) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigit, dateString);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigits, dateString);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigits, dateString);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigits, dateString);
    default:
      return parseNumericPattern(new RegExp("^\\d{1," + n + "}"), dateString);
  }
}
function parseNDigitsSigned(n, dateString) {
  switch (n) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigitSigned, dateString);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigitsSigned, dateString);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigitsSigned, dateString);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigitsSigned, dateString);
    default:
      return parseNumericPattern(new RegExp("^-?\\d{1," + n + "}"), dateString);
  }
}
function dayPeriodEnumToHours(dayPeriod) {
  switch (dayPeriod) {
    case "morning":
      return 4;
    case "evening":
      return 17;
    case "pm":
    case "noon":
    case "afternoon":
      return 12;
    case "am":
    case "midnight":
    case "night":
    default:
      return 0;
  }
}
function normalizeTwoDigitYear(twoDigitYear, currentYear) {
  const isCommonEra = currentYear > 0;
  const absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;
  let result;
  if (absCurrentYear <= 50) {
    result = twoDigitYear || 100;
  } else {
    const rangeEnd = absCurrentYear + 50;
    const rangeEndCentury = Math.trunc(rangeEnd / 100) * 100;
    const isPreviousCentury = twoDigitYear >= rangeEnd % 100;
    result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
  }
  return isCommonEra ? result : 1 - result;
}
function isLeapYearIndex(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
var init_utils = __esm({
  "node_modules/date-fns/parse/_lib/utils.js"() {
    init_constants();
    init_constants2();
  }
});

// node_modules/date-fns/parse/_lib/parsers/YearParser.js
var YearParser;
var init_YearParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/YearParser.js"() {
    init_Parser();
    init_utils();
    YearParser = class extends Parser {
      priority = 130;
      incompatibleTokens = ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"];
      parse(dateString, token, match2) {
        const valueCallback = (year) => ({
          year,
          isTwoDigitYear: token === "yy"
        });
        switch (token) {
          case "y":
            return mapValue(parseNDigits(4, dateString), valueCallback);
          case "yo":
            return mapValue(
              match2.ordinalNumber(dateString, {
                unit: "year"
              }),
              valueCallback
            );
          default:
            return mapValue(parseNDigits(token.length, dateString), valueCallback);
        }
      }
      validate(_date, value) {
        return value.isTwoDigitYear || value.year > 0;
      }
      set(date, flags, value) {
        const currentYear = date.getFullYear();
        if (value.isTwoDigitYear) {
          const normalizedTwoDigitYear = normalizeTwoDigitYear(
            value.year,
            currentYear
          );
          date.setFullYear(normalizedTwoDigitYear, 0, 1);
          date.setHours(0, 0, 0, 0);
          return date;
        }
        const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
        date.setFullYear(year, 0, 1);
        date.setHours(0, 0, 0, 0);
        return date;
      }
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/LocalWeekYearParser.js
var LocalWeekYearParser;
var init_LocalWeekYearParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/LocalWeekYearParser.js"() {
    init_getWeekYear();
    init_startOfWeek();
    init_Parser();
    init_utils();
    LocalWeekYearParser = class extends Parser {
      priority = 130;
      parse(dateString, token, match2) {
        const valueCallback = (year) => ({
          year,
          isTwoDigitYear: token === "YY"
        });
        switch (token) {
          case "Y":
            return mapValue(parseNDigits(4, dateString), valueCallback);
          case "Yo":
            return mapValue(
              match2.ordinalNumber(dateString, {
                unit: "year"
              }),
              valueCallback
            );
          default:
            return mapValue(parseNDigits(token.length, dateString), valueCallback);
        }
      }
      validate(_date, value) {
        return value.isTwoDigitYear || value.year > 0;
      }
      set(date, flags, value, options) {
        const currentYear = getWeekYear(date, options);
        if (value.isTwoDigitYear) {
          const normalizedTwoDigitYear = normalizeTwoDigitYear(
            value.year,
            currentYear
          );
          date.setFullYear(
            normalizedTwoDigitYear,
            0,
            options.firstWeekContainsDate
          );
          date.setHours(0, 0, 0, 0);
          return startOfWeek(date, options);
        }
        const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
        date.setFullYear(year, 0, options.firstWeekContainsDate);
        date.setHours(0, 0, 0, 0);
        return startOfWeek(date, options);
      }
      incompatibleTokens = [
        "y",
        "R",
        "u",
        "Q",
        "q",
        "M",
        "L",
        "I",
        "d",
        "D",
        "i",
        "t",
        "T"
      ];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/ISOWeekYearParser.js
var ISOWeekYearParser;
var init_ISOWeekYearParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/ISOWeekYearParser.js"() {
    init_startOfISOWeek();
    init_constructFrom();
    init_Parser();
    init_utils();
    ISOWeekYearParser = class extends Parser {
      priority = 130;
      parse(dateString, token) {
        if (token === "R") {
          return parseNDigitsSigned(4, dateString);
        }
        return parseNDigitsSigned(token.length, dateString);
      }
      set(date, _flags, value) {
        const firstWeekOfYear = constructFrom(date, 0);
        firstWeekOfYear.setFullYear(value, 0, 4);
        firstWeekOfYear.setHours(0, 0, 0, 0);
        return startOfISOWeek(firstWeekOfYear);
      }
      incompatibleTokens = [
        "G",
        "y",
        "Y",
        "u",
        "Q",
        "q",
        "M",
        "L",
        "w",
        "d",
        "D",
        "e",
        "c",
        "t",
        "T"
      ];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/ExtendedYearParser.js
var ExtendedYearParser;
var init_ExtendedYearParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/ExtendedYearParser.js"() {
    init_Parser();
    init_utils();
    ExtendedYearParser = class extends Parser {
      priority = 130;
      parse(dateString, token) {
        if (token === "u") {
          return parseNDigitsSigned(4, dateString);
        }
        return parseNDigitsSigned(token.length, dateString);
      }
      set(date, _flags, value) {
        date.setFullYear(value, 0, 1);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      incompatibleTokens = ["G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T"];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/QuarterParser.js
var QuarterParser;
var init_QuarterParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/QuarterParser.js"() {
    init_Parser();
    init_utils();
    QuarterParser = class extends Parser {
      priority = 120;
      parse(dateString, token, match2) {
        switch (token) {
          // 1, 2, 3, 4
          case "Q":
          case "QQ":
            return parseNDigits(token.length, dateString);
          // 1st, 2nd, 3rd, 4th
          case "Qo":
            return match2.ordinalNumber(dateString, { unit: "quarter" });
          // Q1, Q2, Q3, Q4
          case "QQQ":
            return match2.quarter(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.quarter(dateString, {
              width: "narrow",
              context: "formatting"
            });
          // 1, 2, 3, 4 (narrow quarter; could be not numerical)
          case "QQQQQ":
            return match2.quarter(dateString, {
              width: "narrow",
              context: "formatting"
            });
          // 1st quarter, 2nd quarter, ...
          case "QQQQ":
          default:
            return match2.quarter(dateString, {
              width: "wide",
              context: "formatting"
            }) || match2.quarter(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.quarter(dateString, {
              width: "narrow",
              context: "formatting"
            });
        }
      }
      validate(_date, value) {
        return value >= 1 && value <= 4;
      }
      set(date, _flags, value) {
        date.setMonth((value - 1) * 3, 1);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      incompatibleTokens = [
        "Y",
        "R",
        "q",
        "M",
        "L",
        "w",
        "I",
        "d",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/StandAloneQuarterParser.js
var StandAloneQuarterParser;
var init_StandAloneQuarterParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/StandAloneQuarterParser.js"() {
    init_Parser();
    init_utils();
    StandAloneQuarterParser = class extends Parser {
      priority = 120;
      parse(dateString, token, match2) {
        switch (token) {
          // 1, 2, 3, 4
          case "q":
          case "qq":
            return parseNDigits(token.length, dateString);
          // 1st, 2nd, 3rd, 4th
          case "qo":
            return match2.ordinalNumber(dateString, { unit: "quarter" });
          // Q1, Q2, Q3, Q4
          case "qqq":
            return match2.quarter(dateString, {
              width: "abbreviated",
              context: "standalone"
            }) || match2.quarter(dateString, {
              width: "narrow",
              context: "standalone"
            });
          // 1, 2, 3, 4 (narrow quarter; could be not numerical)
          case "qqqqq":
            return match2.quarter(dateString, {
              width: "narrow",
              context: "standalone"
            });
          // 1st quarter, 2nd quarter, ...
          case "qqqq":
          default:
            return match2.quarter(dateString, {
              width: "wide",
              context: "standalone"
            }) || match2.quarter(dateString, {
              width: "abbreviated",
              context: "standalone"
            }) || match2.quarter(dateString, {
              width: "narrow",
              context: "standalone"
            });
        }
      }
      validate(_date, value) {
        return value >= 1 && value <= 4;
      }
      set(date, _flags, value) {
        date.setMonth((value - 1) * 3, 1);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      incompatibleTokens = [
        "Y",
        "R",
        "Q",
        "M",
        "L",
        "w",
        "I",
        "d",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/MonthParser.js
var MonthParser;
var init_MonthParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/MonthParser.js"() {
    init_constants2();
    init_Parser();
    init_utils();
    MonthParser = class extends Parser {
      incompatibleTokens = [
        "Y",
        "R",
        "q",
        "Q",
        "L",
        "w",
        "I",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ];
      priority = 110;
      parse(dateString, token, match2) {
        const valueCallback = (value) => value - 1;
        switch (token) {
          // 1, 2, ..., 12
          case "M":
            return mapValue(
              parseNumericPattern(numericPatterns.month, dateString),
              valueCallback
            );
          // 01, 02, ..., 12
          case "MM":
            return mapValue(parseNDigits(2, dateString), valueCallback);
          // 1st, 2nd, ..., 12th
          case "Mo":
            return mapValue(
              match2.ordinalNumber(dateString, {
                unit: "month"
              }),
              valueCallback
            );
          // Jan, Feb, ..., Dec
          case "MMM":
            return match2.month(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.month(dateString, { width: "narrow", context: "formatting" });
          // J, F, ..., D
          case "MMMMM":
            return match2.month(dateString, {
              width: "narrow",
              context: "formatting"
            });
          // January, February, ..., December
          case "MMMM":
          default:
            return match2.month(dateString, { width: "wide", context: "formatting" }) || match2.month(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.month(dateString, { width: "narrow", context: "formatting" });
        }
      }
      validate(_date, value) {
        return value >= 0 && value <= 11;
      }
      set(date, _flags, value) {
        date.setMonth(value, 1);
        date.setHours(0, 0, 0, 0);
        return date;
      }
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/StandAloneMonthParser.js
var StandAloneMonthParser;
var init_StandAloneMonthParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/StandAloneMonthParser.js"() {
    init_constants2();
    init_Parser();
    init_utils();
    StandAloneMonthParser = class extends Parser {
      priority = 110;
      parse(dateString, token, match2) {
        const valueCallback = (value) => value - 1;
        switch (token) {
          // 1, 2, ..., 12
          case "L":
            return mapValue(
              parseNumericPattern(numericPatterns.month, dateString),
              valueCallback
            );
          // 01, 02, ..., 12
          case "LL":
            return mapValue(parseNDigits(2, dateString), valueCallback);
          // 1st, 2nd, ..., 12th
          case "Lo":
            return mapValue(
              match2.ordinalNumber(dateString, {
                unit: "month"
              }),
              valueCallback
            );
          // Jan, Feb, ..., Dec
          case "LLL":
            return match2.month(dateString, {
              width: "abbreviated",
              context: "standalone"
            }) || match2.month(dateString, { width: "narrow", context: "standalone" });
          // J, F, ..., D
          case "LLLLL":
            return match2.month(dateString, {
              width: "narrow",
              context: "standalone"
            });
          // January, February, ..., December
          case "LLLL":
          default:
            return match2.month(dateString, { width: "wide", context: "standalone" }) || match2.month(dateString, {
              width: "abbreviated",
              context: "standalone"
            }) || match2.month(dateString, { width: "narrow", context: "standalone" });
        }
      }
      validate(_date, value) {
        return value >= 0 && value <= 11;
      }
      set(date, _flags, value) {
        date.setMonth(value, 1);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      incompatibleTokens = [
        "Y",
        "R",
        "q",
        "Q",
        "M",
        "w",
        "I",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ];
    };
  }
});

// node_modules/date-fns/setWeek.js
function setWeek(date, week, options) {
  const date_ = toDate(date, options?.in);
  const diff = getWeek(date_, options) - week;
  date_.setDate(date_.getDate() - diff * 7);
  return toDate(date_, options?.in);
}
var init_setWeek = __esm({
  "node_modules/date-fns/setWeek.js"() {
    init_getWeek();
    init_toDate();
  }
});

// node_modules/date-fns/parse/_lib/parsers/LocalWeekParser.js
var LocalWeekParser;
var init_LocalWeekParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/LocalWeekParser.js"() {
    init_setWeek();
    init_startOfWeek();
    init_constants2();
    init_Parser();
    init_utils();
    LocalWeekParser = class extends Parser {
      priority = 100;
      parse(dateString, token, match2) {
        switch (token) {
          case "w":
            return parseNumericPattern(numericPatterns.week, dateString);
          case "wo":
            return match2.ordinalNumber(dateString, { unit: "week" });
          default:
            return parseNDigits(token.length, dateString);
        }
      }
      validate(_date, value) {
        return value >= 1 && value <= 53;
      }
      set(date, _flags, value, options) {
        return startOfWeek(setWeek(date, value, options), options);
      }
      incompatibleTokens = [
        "y",
        "R",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "I",
        "d",
        "D",
        "i",
        "t",
        "T"
      ];
    };
  }
});

// node_modules/date-fns/setISOWeek.js
function setISOWeek(date, week, options) {
  const _date = toDate(date, options?.in);
  const diff = getISOWeek(_date, options) - week;
  _date.setDate(_date.getDate() - diff * 7);
  return _date;
}
var init_setISOWeek = __esm({
  "node_modules/date-fns/setISOWeek.js"() {
    init_getISOWeek();
    init_toDate();
  }
});

// node_modules/date-fns/parse/_lib/parsers/ISOWeekParser.js
var ISOWeekParser;
var init_ISOWeekParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/ISOWeekParser.js"() {
    init_setISOWeek();
    init_startOfISOWeek();
    init_constants2();
    init_Parser();
    init_utils();
    ISOWeekParser = class extends Parser {
      priority = 100;
      parse(dateString, token, match2) {
        switch (token) {
          case "I":
            return parseNumericPattern(numericPatterns.week, dateString);
          case "Io":
            return match2.ordinalNumber(dateString, { unit: "week" });
          default:
            return parseNDigits(token.length, dateString);
        }
      }
      validate(_date, value) {
        return value >= 1 && value <= 53;
      }
      set(date, _flags, value) {
        return startOfISOWeek(setISOWeek(date, value));
      }
      incompatibleTokens = [
        "y",
        "Y",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "w",
        "d",
        "D",
        "e",
        "c",
        "t",
        "T"
      ];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/DateParser.js
var DAYS_IN_MONTH, DAYS_IN_MONTH_LEAP_YEAR, DateParser;
var init_DateParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/DateParser.js"() {
    init_constants2();
    init_Parser();
    init_utils();
    DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    DAYS_IN_MONTH_LEAP_YEAR = [
      31,
      29,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31
    ];
    DateParser = class extends Parser {
      priority = 90;
      subPriority = 1;
      parse(dateString, token, match2) {
        switch (token) {
          case "d":
            return parseNumericPattern(numericPatterns.date, dateString);
          case "do":
            return match2.ordinalNumber(dateString, { unit: "date" });
          default:
            return parseNDigits(token.length, dateString);
        }
      }
      validate(date, value) {
        const year = date.getFullYear();
        const isLeapYear = isLeapYearIndex(year);
        const month = date.getMonth();
        if (isLeapYear) {
          return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
        } else {
          return value >= 1 && value <= DAYS_IN_MONTH[month];
        }
      }
      set(date, _flags, value) {
        date.setDate(value);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      incompatibleTokens = [
        "Y",
        "R",
        "q",
        "Q",
        "w",
        "I",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/DayOfYearParser.js
var DayOfYearParser;
var init_DayOfYearParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/DayOfYearParser.js"() {
    init_constants2();
    init_Parser();
    init_utils();
    DayOfYearParser = class extends Parser {
      priority = 90;
      subpriority = 1;
      parse(dateString, token, match2) {
        switch (token) {
          case "D":
          case "DD":
            return parseNumericPattern(numericPatterns.dayOfYear, dateString);
          case "Do":
            return match2.ordinalNumber(dateString, { unit: "date" });
          default:
            return parseNDigits(token.length, dateString);
        }
      }
      validate(date, value) {
        const year = date.getFullYear();
        const isLeapYear = isLeapYearIndex(year);
        if (isLeapYear) {
          return value >= 1 && value <= 366;
        } else {
          return value >= 1 && value <= 365;
        }
      }
      set(date, _flags, value) {
        date.setMonth(0, value);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      incompatibleTokens = [
        "Y",
        "R",
        "q",
        "Q",
        "M",
        "L",
        "w",
        "I",
        "d",
        "E",
        "i",
        "e",
        "c",
        "t",
        "T"
      ];
    };
  }
});

// node_modules/date-fns/setDay.js
function setDay(date, day, options) {
  const defaultOptions2 = getDefaultOptions();
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  const date_ = toDate(date, options?.in);
  const currentDay = date_.getDay();
  const remainder = day % 7;
  const dayIndex = (remainder + 7) % 7;
  const delta = 7 - weekStartsOn;
  const diff = day < 0 || day > 6 ? day - (currentDay + delta) % 7 : (dayIndex + delta) % 7 - (currentDay + delta) % 7;
  return addDays(date_, diff, options);
}
var init_setDay = __esm({
  "node_modules/date-fns/setDay.js"() {
    init_defaultOptions();
    init_addDays();
    init_toDate();
  }
});

// node_modules/date-fns/parse/_lib/parsers/DayParser.js
var DayParser;
var init_DayParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/DayParser.js"() {
    init_setDay();
    init_Parser();
    DayParser = class extends Parser {
      priority = 90;
      parse(dateString, token, match2) {
        switch (token) {
          // Tue
          case "E":
          case "EE":
          case "EEE":
            return match2.day(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
          // T
          case "EEEEE":
            return match2.day(dateString, {
              width: "narrow",
              context: "formatting"
            });
          // Tu
          case "EEEEEE":
            return match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
          // Tuesday
          case "EEEE":
          default:
            return match2.day(dateString, { width: "wide", context: "formatting" }) || match2.day(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
        }
      }
      validate(_date, value) {
        return value >= 0 && value <= 6;
      }
      set(date, _flags, value, options) {
        date = setDay(date, value, options);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      incompatibleTokens = ["D", "i", "e", "c", "t", "T"];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/LocalDayParser.js
var LocalDayParser;
var init_LocalDayParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/LocalDayParser.js"() {
    init_setDay();
    init_Parser();
    init_utils();
    LocalDayParser = class extends Parser {
      priority = 90;
      parse(dateString, token, match2, options) {
        const valueCallback = (value) => {
          const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
          return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
        };
        switch (token) {
          // 3
          case "e":
          case "ee":
            return mapValue(parseNDigits(token.length, dateString), valueCallback);
          // 3rd
          case "eo":
            return mapValue(
              match2.ordinalNumber(dateString, {
                unit: "day"
              }),
              valueCallback
            );
          // Tue
          case "eee":
            return match2.day(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
          // T
          case "eeeee":
            return match2.day(dateString, {
              width: "narrow",
              context: "formatting"
            });
          // Tu
          case "eeeeee":
            return match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
          // Tuesday
          case "eeee":
          default:
            return match2.day(dateString, { width: "wide", context: "formatting" }) || match2.day(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
        }
      }
      validate(_date, value) {
        return value >= 0 && value <= 6;
      }
      set(date, _flags, value, options) {
        date = setDay(date, value, options);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      incompatibleTokens = [
        "y",
        "R",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "I",
        "d",
        "D",
        "E",
        "i",
        "c",
        "t",
        "T"
      ];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/StandAloneLocalDayParser.js
var StandAloneLocalDayParser;
var init_StandAloneLocalDayParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/StandAloneLocalDayParser.js"() {
    init_setDay();
    init_Parser();
    init_utils();
    StandAloneLocalDayParser = class extends Parser {
      priority = 90;
      parse(dateString, token, match2, options) {
        const valueCallback = (value) => {
          const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
          return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
        };
        switch (token) {
          // 3
          case "c":
          case "cc":
            return mapValue(parseNDigits(token.length, dateString), valueCallback);
          // 3rd
          case "co":
            return mapValue(
              match2.ordinalNumber(dateString, {
                unit: "day"
              }),
              valueCallback
            );
          // Tue
          case "ccc":
            return match2.day(dateString, {
              width: "abbreviated",
              context: "standalone"
            }) || match2.day(dateString, { width: "short", context: "standalone" }) || match2.day(dateString, { width: "narrow", context: "standalone" });
          // T
          case "ccccc":
            return match2.day(dateString, {
              width: "narrow",
              context: "standalone"
            });
          // Tu
          case "cccccc":
            return match2.day(dateString, { width: "short", context: "standalone" }) || match2.day(dateString, { width: "narrow", context: "standalone" });
          // Tuesday
          case "cccc":
          default:
            return match2.day(dateString, { width: "wide", context: "standalone" }) || match2.day(dateString, {
              width: "abbreviated",
              context: "standalone"
            }) || match2.day(dateString, { width: "short", context: "standalone" }) || match2.day(dateString, { width: "narrow", context: "standalone" });
        }
      }
      validate(_date, value) {
        return value >= 0 && value <= 6;
      }
      set(date, _flags, value, options) {
        date = setDay(date, value, options);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      incompatibleTokens = [
        "y",
        "R",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "I",
        "d",
        "D",
        "E",
        "i",
        "e",
        "t",
        "T"
      ];
    };
  }
});

// node_modules/date-fns/setISODay.js
function setISODay(date, day, options) {
  const date_ = toDate(date, options?.in);
  const currentDay = getISODay(date_, options);
  const diff = day - currentDay;
  return addDays(date_, diff, options);
}
var init_setISODay = __esm({
  "node_modules/date-fns/setISODay.js"() {
    init_addDays();
    init_getISODay();
    init_toDate();
  }
});

// node_modules/date-fns/parse/_lib/parsers/ISODayParser.js
var ISODayParser;
var init_ISODayParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/ISODayParser.js"() {
    init_setISODay();
    init_Parser();
    init_utils();
    ISODayParser = class extends Parser {
      priority = 90;
      parse(dateString, token, match2) {
        const valueCallback = (value) => {
          if (value === 0) {
            return 7;
          }
          return value;
        };
        switch (token) {
          // 2
          case "i":
          case "ii":
            return parseNDigits(token.length, dateString);
          // 2nd
          case "io":
            return match2.ordinalNumber(dateString, { unit: "day" });
          // Tue
          case "iii":
            return mapValue(
              match2.day(dateString, {
                width: "abbreviated",
                context: "formatting"
              }) || match2.day(dateString, {
                width: "short",
                context: "formatting"
              }) || match2.day(dateString, {
                width: "narrow",
                context: "formatting"
              }),
              valueCallback
            );
          // T
          case "iiiii":
            return mapValue(
              match2.day(dateString, {
                width: "narrow",
                context: "formatting"
              }),
              valueCallback
            );
          // Tu
          case "iiiiii":
            return mapValue(
              match2.day(dateString, {
                width: "short",
                context: "formatting"
              }) || match2.day(dateString, {
                width: "narrow",
                context: "formatting"
              }),
              valueCallback
            );
          // Tuesday
          case "iiii":
          default:
            return mapValue(
              match2.day(dateString, {
                width: "wide",
                context: "formatting"
              }) || match2.day(dateString, {
                width: "abbreviated",
                context: "formatting"
              }) || match2.day(dateString, {
                width: "short",
                context: "formatting"
              }) || match2.day(dateString, {
                width: "narrow",
                context: "formatting"
              }),
              valueCallback
            );
        }
      }
      validate(_date, value) {
        return value >= 1 && value <= 7;
      }
      set(date, _flags, value) {
        date = setISODay(date, value);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      incompatibleTokens = [
        "y",
        "Y",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "w",
        "d",
        "D",
        "E",
        "e",
        "c",
        "t",
        "T"
      ];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/AMPMParser.js
var AMPMParser;
var init_AMPMParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/AMPMParser.js"() {
    init_Parser();
    init_utils();
    AMPMParser = class extends Parser {
      priority = 80;
      parse(dateString, token, match2) {
        switch (token) {
          case "a":
          case "aa":
          case "aaa":
            return match2.dayPeriod(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.dayPeriod(dateString, {
              width: "narrow",
              context: "formatting"
            });
          case "aaaaa":
            return match2.dayPeriod(dateString, {
              width: "narrow",
              context: "formatting"
            });
          case "aaaa":
          default:
            return match2.dayPeriod(dateString, {
              width: "wide",
              context: "formatting"
            }) || match2.dayPeriod(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.dayPeriod(dateString, {
              width: "narrow",
              context: "formatting"
            });
        }
      }
      set(date, _flags, value) {
        date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
        return date;
      }
      incompatibleTokens = ["b", "B", "H", "k", "t", "T"];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/AMPMMidnightParser.js
var AMPMMidnightParser;
var init_AMPMMidnightParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/AMPMMidnightParser.js"() {
    init_Parser();
    init_utils();
    AMPMMidnightParser = class extends Parser {
      priority = 80;
      parse(dateString, token, match2) {
        switch (token) {
          case "b":
          case "bb":
          case "bbb":
            return match2.dayPeriod(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.dayPeriod(dateString, {
              width: "narrow",
              context: "formatting"
            });
          case "bbbbb":
            return match2.dayPeriod(dateString, {
              width: "narrow",
              context: "formatting"
            });
          case "bbbb":
          default:
            return match2.dayPeriod(dateString, {
              width: "wide",
              context: "formatting"
            }) || match2.dayPeriod(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.dayPeriod(dateString, {
              width: "narrow",
              context: "formatting"
            });
        }
      }
      set(date, _flags, value) {
        date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
        return date;
      }
      incompatibleTokens = ["a", "B", "H", "k", "t", "T"];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/DayPeriodParser.js
var DayPeriodParser;
var init_DayPeriodParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/DayPeriodParser.js"() {
    init_Parser();
    init_utils();
    DayPeriodParser = class extends Parser {
      priority = 80;
      parse(dateString, token, match2) {
        switch (token) {
          case "B":
          case "BB":
          case "BBB":
            return match2.dayPeriod(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.dayPeriod(dateString, {
              width: "narrow",
              context: "formatting"
            });
          case "BBBBB":
            return match2.dayPeriod(dateString, {
              width: "narrow",
              context: "formatting"
            });
          case "BBBB":
          default:
            return match2.dayPeriod(dateString, {
              width: "wide",
              context: "formatting"
            }) || match2.dayPeriod(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.dayPeriod(dateString, {
              width: "narrow",
              context: "formatting"
            });
        }
      }
      set(date, _flags, value) {
        date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
        return date;
      }
      incompatibleTokens = ["a", "b", "t", "T"];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/Hour1to12Parser.js
var Hour1to12Parser;
var init_Hour1to12Parser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/Hour1to12Parser.js"() {
    init_constants2();
    init_Parser();
    init_utils();
    Hour1to12Parser = class extends Parser {
      priority = 70;
      parse(dateString, token, match2) {
        switch (token) {
          case "h":
            return parseNumericPattern(numericPatterns.hour12h, dateString);
          case "ho":
            return match2.ordinalNumber(dateString, { unit: "hour" });
          default:
            return parseNDigits(token.length, dateString);
        }
      }
      validate(_date, value) {
        return value >= 1 && value <= 12;
      }
      set(date, _flags, value) {
        const isPM = date.getHours() >= 12;
        if (isPM && value < 12) {
          date.setHours(value + 12, 0, 0, 0);
        } else if (!isPM && value === 12) {
          date.setHours(0, 0, 0, 0);
        } else {
          date.setHours(value, 0, 0, 0);
        }
        return date;
      }
      incompatibleTokens = ["H", "K", "k", "t", "T"];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/Hour0to23Parser.js
var Hour0to23Parser;
var init_Hour0to23Parser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/Hour0to23Parser.js"() {
    init_constants2();
    init_Parser();
    init_utils();
    Hour0to23Parser = class extends Parser {
      priority = 70;
      parse(dateString, token, match2) {
        switch (token) {
          case "H":
            return parseNumericPattern(numericPatterns.hour23h, dateString);
          case "Ho":
            return match2.ordinalNumber(dateString, { unit: "hour" });
          default:
            return parseNDigits(token.length, dateString);
        }
      }
      validate(_date, value) {
        return value >= 0 && value <= 23;
      }
      set(date, _flags, value) {
        date.setHours(value, 0, 0, 0);
        return date;
      }
      incompatibleTokens = ["a", "b", "h", "K", "k", "t", "T"];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/Hour0To11Parser.js
var Hour0To11Parser;
var init_Hour0To11Parser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/Hour0To11Parser.js"() {
    init_constants2();
    init_Parser();
    init_utils();
    Hour0To11Parser = class extends Parser {
      priority = 70;
      parse(dateString, token, match2) {
        switch (token) {
          case "K":
            return parseNumericPattern(numericPatterns.hour11h, dateString);
          case "Ko":
            return match2.ordinalNumber(dateString, { unit: "hour" });
          default:
            return parseNDigits(token.length, dateString);
        }
      }
      validate(_date, value) {
        return value >= 0 && value <= 11;
      }
      set(date, _flags, value) {
        const isPM = date.getHours() >= 12;
        if (isPM && value < 12) {
          date.setHours(value + 12, 0, 0, 0);
        } else {
          date.setHours(value, 0, 0, 0);
        }
        return date;
      }
      incompatibleTokens = ["h", "H", "k", "t", "T"];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/Hour1To24Parser.js
var Hour1To24Parser;
var init_Hour1To24Parser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/Hour1To24Parser.js"() {
    init_constants2();
    init_Parser();
    init_utils();
    Hour1To24Parser = class extends Parser {
      priority = 70;
      parse(dateString, token, match2) {
        switch (token) {
          case "k":
            return parseNumericPattern(numericPatterns.hour24h, dateString);
          case "ko":
            return match2.ordinalNumber(dateString, { unit: "hour" });
          default:
            return parseNDigits(token.length, dateString);
        }
      }
      validate(_date, value) {
        return value >= 1 && value <= 24;
      }
      set(date, _flags, value) {
        const hours = value <= 24 ? value % 24 : value;
        date.setHours(hours, 0, 0, 0);
        return date;
      }
      incompatibleTokens = ["a", "b", "h", "H", "K", "t", "T"];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/MinuteParser.js
var MinuteParser;
var init_MinuteParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/MinuteParser.js"() {
    init_constants2();
    init_Parser();
    init_utils();
    MinuteParser = class extends Parser {
      priority = 60;
      parse(dateString, token, match2) {
        switch (token) {
          case "m":
            return parseNumericPattern(numericPatterns.minute, dateString);
          case "mo":
            return match2.ordinalNumber(dateString, { unit: "minute" });
          default:
            return parseNDigits(token.length, dateString);
        }
      }
      validate(_date, value) {
        return value >= 0 && value <= 59;
      }
      set(date, _flags, value) {
        date.setMinutes(value, 0, 0);
        return date;
      }
      incompatibleTokens = ["t", "T"];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/SecondParser.js
var SecondParser;
var init_SecondParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/SecondParser.js"() {
    init_constants2();
    init_Parser();
    init_utils();
    SecondParser = class extends Parser {
      priority = 50;
      parse(dateString, token, match2) {
        switch (token) {
          case "s":
            return parseNumericPattern(numericPatterns.second, dateString);
          case "so":
            return match2.ordinalNumber(dateString, { unit: "second" });
          default:
            return parseNDigits(token.length, dateString);
        }
      }
      validate(_date, value) {
        return value >= 0 && value <= 59;
      }
      set(date, _flags, value) {
        date.setSeconds(value, 0);
        return date;
      }
      incompatibleTokens = ["t", "T"];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/FractionOfSecondParser.js
var FractionOfSecondParser;
var init_FractionOfSecondParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/FractionOfSecondParser.js"() {
    init_Parser();
    init_utils();
    FractionOfSecondParser = class extends Parser {
      priority = 30;
      parse(dateString, token) {
        const valueCallback = (value) => Math.trunc(value * Math.pow(10, -token.length + 3));
        return mapValue(parseNDigits(token.length, dateString), valueCallback);
      }
      set(date, _flags, value) {
        date.setMilliseconds(value);
        return date;
      }
      incompatibleTokens = ["t", "T"];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/ISOTimezoneWithZParser.js
var ISOTimezoneWithZParser;
var init_ISOTimezoneWithZParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/ISOTimezoneWithZParser.js"() {
    init_constructFrom();
    init_getTimezoneOffsetInMilliseconds();
    init_constants2();
    init_Parser();
    init_utils();
    ISOTimezoneWithZParser = class extends Parser {
      priority = 10;
      parse(dateString, token) {
        switch (token) {
          case "X":
            return parseTimezonePattern(
              timezonePatterns.basicOptionalMinutes,
              dateString
            );
          case "XX":
            return parseTimezonePattern(timezonePatterns.basic, dateString);
          case "XXXX":
            return parseTimezonePattern(
              timezonePatterns.basicOptionalSeconds,
              dateString
            );
          case "XXXXX":
            return parseTimezonePattern(
              timezonePatterns.extendedOptionalSeconds,
              dateString
            );
          case "XXX":
          default:
            return parseTimezonePattern(timezonePatterns.extended, dateString);
        }
      }
      set(date, flags, value) {
        if (flags.timestampIsSet) return date;
        return constructFrom(
          date,
          date.getTime() - getTimezoneOffsetInMilliseconds(date) - value
        );
      }
      incompatibleTokens = ["t", "T", "x"];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/ISOTimezoneParser.js
var ISOTimezoneParser;
var init_ISOTimezoneParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/ISOTimezoneParser.js"() {
    init_constructFrom();
    init_getTimezoneOffsetInMilliseconds();
    init_constants2();
    init_Parser();
    init_utils();
    ISOTimezoneParser = class extends Parser {
      priority = 10;
      parse(dateString, token) {
        switch (token) {
          case "x":
            return parseTimezonePattern(
              timezonePatterns.basicOptionalMinutes,
              dateString
            );
          case "xx":
            return parseTimezonePattern(timezonePatterns.basic, dateString);
          case "xxxx":
            return parseTimezonePattern(
              timezonePatterns.basicOptionalSeconds,
              dateString
            );
          case "xxxxx":
            return parseTimezonePattern(
              timezonePatterns.extendedOptionalSeconds,
              dateString
            );
          case "xxx":
          default:
            return parseTimezonePattern(timezonePatterns.extended, dateString);
        }
      }
      set(date, flags, value) {
        if (flags.timestampIsSet) return date;
        return constructFrom(
          date,
          date.getTime() - getTimezoneOffsetInMilliseconds(date) - value
        );
      }
      incompatibleTokens = ["t", "T", "X"];
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/TimestampSecondsParser.js
var TimestampSecondsParser;
var init_TimestampSecondsParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/TimestampSecondsParser.js"() {
    init_constructFrom();
    init_Parser();
    init_utils();
    TimestampSecondsParser = class extends Parser {
      priority = 40;
      parse(dateString) {
        return parseAnyDigitsSigned(dateString);
      }
      set(date, _flags, value) {
        return [constructFrom(date, value * 1e3), { timestampIsSet: true }];
      }
      incompatibleTokens = "*";
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers/TimestampMillisecondsParser.js
var TimestampMillisecondsParser;
var init_TimestampMillisecondsParser = __esm({
  "node_modules/date-fns/parse/_lib/parsers/TimestampMillisecondsParser.js"() {
    init_constructFrom();
    init_Parser();
    init_utils();
    TimestampMillisecondsParser = class extends Parser {
      priority = 20;
      parse(dateString) {
        return parseAnyDigitsSigned(dateString);
      }
      set(date, _flags, value) {
        return [constructFrom(date, value), { timestampIsSet: true }];
      }
      incompatibleTokens = "*";
    };
  }
});

// node_modules/date-fns/parse/_lib/parsers.js
var parsers;
var init_parsers = __esm({
  "node_modules/date-fns/parse/_lib/parsers.js"() {
    init_EraParser();
    init_YearParser();
    init_LocalWeekYearParser();
    init_ISOWeekYearParser();
    init_ExtendedYearParser();
    init_QuarterParser();
    init_StandAloneQuarterParser();
    init_MonthParser();
    init_StandAloneMonthParser();
    init_LocalWeekParser();
    init_ISOWeekParser();
    init_DateParser();
    init_DayOfYearParser();
    init_DayParser();
    init_LocalDayParser();
    init_StandAloneLocalDayParser();
    init_ISODayParser();
    init_AMPMParser();
    init_AMPMMidnightParser();
    init_DayPeriodParser();
    init_Hour1to12Parser();
    init_Hour0to23Parser();
    init_Hour0To11Parser();
    init_Hour1To24Parser();
    init_MinuteParser();
    init_SecondParser();
    init_FractionOfSecondParser();
    init_ISOTimezoneWithZParser();
    init_ISOTimezoneParser();
    init_TimestampSecondsParser();
    init_TimestampMillisecondsParser();
    parsers = {
      G: new EraParser(),
      y: new YearParser(),
      Y: new LocalWeekYearParser(),
      R: new ISOWeekYearParser(),
      u: new ExtendedYearParser(),
      Q: new QuarterParser(),
      q: new StandAloneQuarterParser(),
      M: new MonthParser(),
      L: new StandAloneMonthParser(),
      w: new LocalWeekParser(),
      I: new ISOWeekParser(),
      d: new DateParser(),
      D: new DayOfYearParser(),
      E: new DayParser(),
      e: new LocalDayParser(),
      c: new StandAloneLocalDayParser(),
      i: new ISODayParser(),
      a: new AMPMParser(),
      b: new AMPMMidnightParser(),
      B: new DayPeriodParser(),
      h: new Hour1to12Parser(),
      H: new Hour0to23Parser(),
      K: new Hour0To11Parser(),
      k: new Hour1To24Parser(),
      m: new MinuteParser(),
      s: new SecondParser(),
      S: new FractionOfSecondParser(),
      X: new ISOTimezoneWithZParser(),
      x: new ISOTimezoneParser(),
      t: new TimestampSecondsParser(),
      T: new TimestampMillisecondsParser()
    };
  }
});

// node_modules/date-fns/parse.js
function parse(dateStr, formatStr, referenceDate, options) {
  const invalidDate = () => constructFrom(options?.in || referenceDate, NaN);
  const defaultOptions2 = getDefaultOptions2();
  const locale = options?.locale ?? defaultOptions2.locale ?? enUS;
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  if (!formatStr)
    return dateStr ? invalidDate() : toDate(referenceDate, options?.in);
  const subFnOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale
  };
  const setters = [new DateTimezoneSetter(options?.in, referenceDate)];
  const tokens = formatStr.match(longFormattingTokensRegExp2).map((substring) => {
    const firstCharacter = substring[0];
    if (firstCharacter in longFormatters) {
      const longFormatter = longFormatters[firstCharacter];
      return longFormatter(substring, locale.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp2);
  const usedTokens = [];
  for (let token of tokens) {
    if (!options?.useAdditionalWeekYearTokens && isProtectedWeekYearToken(token)) {
      warnOrThrowProtectedError(token, formatStr, dateStr);
    }
    if (!options?.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(token)) {
      warnOrThrowProtectedError(token, formatStr, dateStr);
    }
    const firstCharacter = token[0];
    const parser = parsers[firstCharacter];
    if (parser) {
      const { incompatibleTokens } = parser;
      if (Array.isArray(incompatibleTokens)) {
        const incompatibleToken = usedTokens.find(
          (usedToken) => incompatibleTokens.includes(usedToken.token) || usedToken.token === firstCharacter
        );
        if (incompatibleToken) {
          throw new RangeError(
            `The format string mustn't contain \`${incompatibleToken.fullToken}\` and \`${token}\` at the same time`
          );
        }
      } else if (parser.incompatibleTokens === "*" && usedTokens.length > 0) {
        throw new RangeError(
          `The format string mustn't contain \`${token}\` and any other token at the same time`
        );
      }
      usedTokens.push({ token: firstCharacter, fullToken: token });
      const parseResult = parser.run(
        dateStr,
        token,
        locale.match,
        subFnOptions
      );
      if (!parseResult) {
        return invalidDate();
      }
      setters.push(parseResult.setter);
      dateStr = parseResult.rest;
    } else {
      if (firstCharacter.match(unescapedLatinCharacterRegExp2)) {
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" + firstCharacter + "`"
        );
      }
      if (token === "''") {
        token = "'";
      } else if (firstCharacter === "'") {
        token = cleanEscapedString2(token);
      }
      if (dateStr.indexOf(token) === 0) {
        dateStr = dateStr.slice(token.length);
      } else {
        return invalidDate();
      }
    }
  }
  if (dateStr.length > 0 && notWhitespaceRegExp.test(dateStr)) {
    return invalidDate();
  }
  const uniquePrioritySetters = setters.map((setter) => setter.priority).sort((a, b) => b - a).filter((priority, index, array) => array.indexOf(priority) === index).map(
    (priority) => setters.filter((setter) => setter.priority === priority).sort((a, b) => b.subPriority - a.subPriority)
  ).map((setterArray) => setterArray[0]);
  let date = toDate(referenceDate, options?.in);
  if (isNaN(+date)) return invalidDate();
  const flags = {};
  for (const setter of uniquePrioritySetters) {
    if (!setter.validate(date, subFnOptions)) {
      return invalidDate();
    }
    const result = setter.set(date, flags, subFnOptions);
    if (Array.isArray(result)) {
      date = result[0];
      Object.assign(flags, result[1]);
    } else {
      date = result;
    }
  }
  return date;
}
function cleanEscapedString2(input) {
  return input.match(escapedStringRegExp2)[1].replace(doubleQuoteRegExp2, "'");
}
var formattingTokensRegExp2, longFormattingTokensRegExp2, escapedStringRegExp2, doubleQuoteRegExp2, notWhitespaceRegExp, unescapedLatinCharacterRegExp2;
var init_parse = __esm({
  "node_modules/date-fns/parse.js"() {
    init_defaultLocale();
    init_longFormatters();
    init_protectedTokens();
    init_constructFrom();
    init_getDefaultOptions();
    init_toDate();
    init_Setter();
    init_parsers();
    formattingTokensRegExp2 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
    longFormattingTokensRegExp2 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
    escapedStringRegExp2 = /^'([^]*?)'?$/;
    doubleQuoteRegExp2 = /''/g;
    notWhitespaceRegExp = /\S/;
    unescapedLatinCharacterRegExp2 = /[a-zA-Z]/;
  }
});

// node_modules/date-fns/isMatch.js
var init_isMatch = __esm({
  "node_modules/date-fns/isMatch.js"() {
  }
});

// node_modules/date-fns/isMonday.js
var init_isMonday = __esm({
  "node_modules/date-fns/isMonday.js"() {
  }
});

// node_modules/date-fns/isPast.js
var init_isPast = __esm({
  "node_modules/date-fns/isPast.js"() {
  }
});

// node_modules/date-fns/startOfHour.js
function startOfHour(date, options) {
  const _date = toDate(date, options?.in);
  _date.setMinutes(0, 0, 0);
  return _date;
}
var init_startOfHour = __esm({
  "node_modules/date-fns/startOfHour.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/isSameHour.js
var init_isSameHour = __esm({
  "node_modules/date-fns/isSameHour.js"() {
  }
});

// node_modules/date-fns/isSameWeek.js
var init_isSameWeek = __esm({
  "node_modules/date-fns/isSameWeek.js"() {
  }
});

// node_modules/date-fns/isSameISOWeek.js
var init_isSameISOWeek = __esm({
  "node_modules/date-fns/isSameISOWeek.js"() {
  }
});

// node_modules/date-fns/isSameISOWeekYear.js
var init_isSameISOWeekYear = __esm({
  "node_modules/date-fns/isSameISOWeekYear.js"() {
  }
});

// node_modules/date-fns/startOfMinute.js
function startOfMinute(date, options) {
  const date_ = toDate(date, options?.in);
  date_.setSeconds(0, 0);
  return date_;
}
var init_startOfMinute = __esm({
  "node_modules/date-fns/startOfMinute.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/isSameMinute.js
var init_isSameMinute = __esm({
  "node_modules/date-fns/isSameMinute.js"() {
  }
});

// node_modules/date-fns/isSameMonth.js
var init_isSameMonth = __esm({
  "node_modules/date-fns/isSameMonth.js"() {
  }
});

// node_modules/date-fns/isSameQuarter.js
var init_isSameQuarter = __esm({
  "node_modules/date-fns/isSameQuarter.js"() {
  }
});

// node_modules/date-fns/startOfSecond.js
function startOfSecond(date, options) {
  const date_ = toDate(date, options?.in);
  date_.setMilliseconds(0);
  return date_;
}
var init_startOfSecond = __esm({
  "node_modules/date-fns/startOfSecond.js"() {
    init_toDate();
  }
});

// node_modules/date-fns/isSameSecond.js
var init_isSameSecond = __esm({
  "node_modules/date-fns/isSameSecond.js"() {
  }
});

// node_modules/date-fns/isSameYear.js
var init_isSameYear = __esm({
  "node_modules/date-fns/isSameYear.js"() {
  }
});

// node_modules/date-fns/isThisHour.js
var init_isThisHour = __esm({
  "node_modules/date-fns/isThisHour.js"() {
  }
});

// node_modules/date-fns/isThisISOWeek.js
var init_isThisISOWeek = __esm({
  "node_modules/date-fns/isThisISOWeek.js"() {
  }
});

// node_modules/date-fns/isThisMinute.js
var init_isThisMinute = __esm({
  "node_modules/date-fns/isThisMinute.js"() {
  }
});

// node_modules/date-fns/isThisMonth.js
var init_isThisMonth = __esm({
  "node_modules/date-fns/isThisMonth.js"() {
  }
});

// node_modules/date-fns/isThisQuarter.js
var init_isThisQuarter = __esm({
  "node_modules/date-fns/isThisQuarter.js"() {
  }
});

// node_modules/date-fns/isThisSecond.js
var init_isThisSecond = __esm({
  "node_modules/date-fns/isThisSecond.js"() {
  }
});

// node_modules/date-fns/isThisWeek.js
var init_isThisWeek = __esm({
  "node_modules/date-fns/isThisWeek.js"() {
  }
});

// node_modules/date-fns/isThisYear.js
var init_isThisYear = __esm({
  "node_modules/date-fns/isThisYear.js"() {
  }
});

// node_modules/date-fns/isThursday.js
var init_isThursday = __esm({
  "node_modules/date-fns/isThursday.js"() {
  }
});

// node_modules/date-fns/isToday.js
var init_isToday = __esm({
  "node_modules/date-fns/isToday.js"() {
  }
});

// node_modules/date-fns/isTomorrow.js
var init_isTomorrow = __esm({
  "node_modules/date-fns/isTomorrow.js"() {
  }
});

// node_modules/date-fns/isTuesday.js
var init_isTuesday = __esm({
  "node_modules/date-fns/isTuesday.js"() {
  }
});

// node_modules/date-fns/isWednesday.js
var init_isWednesday = __esm({
  "node_modules/date-fns/isWednesday.js"() {
  }
});

// node_modules/date-fns/isWithinInterval.js
var init_isWithinInterval = __esm({
  "node_modules/date-fns/isWithinInterval.js"() {
  }
});

// node_modules/date-fns/subDays.js
var init_subDays = __esm({
  "node_modules/date-fns/subDays.js"() {
  }
});

// node_modules/date-fns/isYesterday.js
var init_isYesterday = __esm({
  "node_modules/date-fns/isYesterday.js"() {
  }
});

// node_modules/date-fns/lastDayOfDecade.js
var init_lastDayOfDecade = __esm({
  "node_modules/date-fns/lastDayOfDecade.js"() {
  }
});

// node_modules/date-fns/lastDayOfWeek.js
var init_lastDayOfWeek = __esm({
  "node_modules/date-fns/lastDayOfWeek.js"() {
  }
});

// node_modules/date-fns/lastDayOfISOWeek.js
var init_lastDayOfISOWeek = __esm({
  "node_modules/date-fns/lastDayOfISOWeek.js"() {
  }
});

// node_modules/date-fns/lastDayOfISOWeekYear.js
var init_lastDayOfISOWeekYear = __esm({
  "node_modules/date-fns/lastDayOfISOWeekYear.js"() {
  }
});

// node_modules/date-fns/lastDayOfQuarter.js
var init_lastDayOfQuarter = __esm({
  "node_modules/date-fns/lastDayOfQuarter.js"() {
  }
});

// node_modules/date-fns/lastDayOfYear.js
var init_lastDayOfYear = __esm({
  "node_modules/date-fns/lastDayOfYear.js"() {
  }
});

// node_modules/date-fns/lightFormat.js
var init_lightFormat = __esm({
  "node_modules/date-fns/lightFormat.js"() {
  }
});

// node_modules/date-fns/milliseconds.js
var init_milliseconds = __esm({
  "node_modules/date-fns/milliseconds.js"() {
  }
});

// node_modules/date-fns/millisecondsToHours.js
var init_millisecondsToHours = __esm({
  "node_modules/date-fns/millisecondsToHours.js"() {
  }
});

// node_modules/date-fns/millisecondsToMinutes.js
var init_millisecondsToMinutes = __esm({
  "node_modules/date-fns/millisecondsToMinutes.js"() {
  }
});

// node_modules/date-fns/millisecondsToSeconds.js
var init_millisecondsToSeconds = __esm({
  "node_modules/date-fns/millisecondsToSeconds.js"() {
  }
});

// node_modules/date-fns/minutesToHours.js
var init_minutesToHours = __esm({
  "node_modules/date-fns/minutesToHours.js"() {
  }
});

// node_modules/date-fns/minutesToMilliseconds.js
var init_minutesToMilliseconds = __esm({
  "node_modules/date-fns/minutesToMilliseconds.js"() {
  }
});

// node_modules/date-fns/minutesToSeconds.js
var init_minutesToSeconds = __esm({
  "node_modules/date-fns/minutesToSeconds.js"() {
  }
});

// node_modules/date-fns/monthsToQuarters.js
var init_monthsToQuarters = __esm({
  "node_modules/date-fns/monthsToQuarters.js"() {
  }
});

// node_modules/date-fns/monthsToYears.js
var init_monthsToYears = __esm({
  "node_modules/date-fns/monthsToYears.js"() {
  }
});

// node_modules/date-fns/nextDay.js
var init_nextDay = __esm({
  "node_modules/date-fns/nextDay.js"() {
  }
});

// node_modules/date-fns/nextFriday.js
var init_nextFriday = __esm({
  "node_modules/date-fns/nextFriday.js"() {
  }
});

// node_modules/date-fns/nextMonday.js
var init_nextMonday = __esm({
  "node_modules/date-fns/nextMonday.js"() {
  }
});

// node_modules/date-fns/nextSaturday.js
var init_nextSaturday = __esm({
  "node_modules/date-fns/nextSaturday.js"() {
  }
});

// node_modules/date-fns/nextSunday.js
var init_nextSunday = __esm({
  "node_modules/date-fns/nextSunday.js"() {
  }
});

// node_modules/date-fns/nextThursday.js
var init_nextThursday = __esm({
  "node_modules/date-fns/nextThursday.js"() {
  }
});

// node_modules/date-fns/nextTuesday.js
var init_nextTuesday = __esm({
  "node_modules/date-fns/nextTuesday.js"() {
  }
});

// node_modules/date-fns/nextWednesday.js
var init_nextWednesday = __esm({
  "node_modules/date-fns/nextWednesday.js"() {
  }
});

// node_modules/date-fns/parseISO.js
function parseISO(argument, options) {
  const invalidDate = () => constructFrom(options?.in, NaN);
  const additionalDigits = options?.additionalDigits ?? 2;
  const dateStrings = splitDateString(argument);
  let date;
  if (dateStrings.date) {
    const parseYearResult = parseYear(dateStrings.date, additionalDigits);
    date = parseDate(parseYearResult.restDateString, parseYearResult.year);
  }
  if (!date || isNaN(+date)) return invalidDate();
  const timestamp = +date;
  let time = 0;
  let offset;
  if (dateStrings.time) {
    time = parseTime(dateStrings.time);
    if (isNaN(time)) return invalidDate();
  }
  if (dateStrings.timezone) {
    offset = parseTimezone(dateStrings.timezone);
    if (isNaN(offset)) return invalidDate();
  } else {
    const tmpDate = new Date(timestamp + time);
    const result = toDate(0, options?.in);
    result.setFullYear(
      tmpDate.getUTCFullYear(),
      tmpDate.getUTCMonth(),
      tmpDate.getUTCDate()
    );
    result.setHours(
      tmpDate.getUTCHours(),
      tmpDate.getUTCMinutes(),
      tmpDate.getUTCSeconds(),
      tmpDate.getUTCMilliseconds()
    );
    return result;
  }
  return toDate(timestamp + time + offset, options?.in);
}
function splitDateString(dateString) {
  const dateStrings = {};
  const array = dateString.split(patterns.dateTimeDelimiter);
  let timeString;
  if (array.length > 2) {
    return dateStrings;
  }
  if (/:/.test(array[0])) {
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
    if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
      timeString = dateString.substr(
        dateStrings.date.length,
        dateString.length
      );
    }
  }
  if (timeString) {
    const token = patterns.timezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], "");
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }
  return dateStrings;
}
function parseYear(dateString, additionalDigits) {
  const regex = new RegExp(
    "^(?:(\\d{4}|[+-]\\d{" + (4 + additionalDigits) + "})|(\\d{2}|[+-]\\d{" + (2 + additionalDigits) + "})$)"
  );
  const captures = dateString.match(regex);
  if (!captures) return { year: NaN, restDateString: "" };
  const year = captures[1] ? parseInt(captures[1]) : null;
  const century = captures[2] ? parseInt(captures[2]) : null;
  return {
    year: century === null ? year : century * 100,
    restDateString: dateString.slice((captures[1] || captures[2]).length)
  };
}
function parseDate(dateString, year) {
  if (year === null) return /* @__PURE__ */ new Date(NaN);
  const captures = dateString.match(dateRegex);
  if (!captures) return /* @__PURE__ */ new Date(NaN);
  const isWeekDate = !!captures[4];
  const dayOfYear = parseDateUnit(captures[1]);
  const month = parseDateUnit(captures[2]) - 1;
  const day = parseDateUnit(captures[3]);
  const week = parseDateUnit(captures[4]);
  const dayOfWeek = parseDateUnit(captures[5]) - 1;
  if (isWeekDate) {
    if (!validateWeekDate(year, week, dayOfWeek)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    return dayOfISOWeekYear(year, week, dayOfWeek);
  } else {
    const date = /* @__PURE__ */ new Date(0);
    if (!validateDate(year, month, day) || !validateDayOfYearDate(year, dayOfYear)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
    return date;
  }
}
function parseDateUnit(value) {
  return value ? parseInt(value) : 1;
}
function parseTime(timeString) {
  const captures = timeString.match(timeRegex);
  if (!captures) return NaN;
  const hours = parseTimeUnit(captures[1]);
  const minutes = parseTimeUnit(captures[2]);
  const seconds = parseTimeUnit(captures[3]);
  if (!validateTime(hours, minutes, seconds)) {
    return NaN;
  }
  return hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * 1e3;
}
function parseTimeUnit(value) {
  return value && parseFloat(value.replace(",", ".")) || 0;
}
function parseTimezone(timezoneString) {
  if (timezoneString === "Z") return 0;
  const captures = timezoneString.match(timezoneRegex);
  if (!captures) return 0;
  const sign = captures[1] === "+" ? -1 : 1;
  const hours = parseInt(captures[2]);
  const minutes = captures[3] && parseInt(captures[3]) || 0;
  if (!validateTimezone(hours, minutes)) {
    return NaN;
  }
  return sign * (hours * millisecondsInHour + minutes * millisecondsInMinute);
}
function dayOfISOWeekYear(isoWeekYear, week, day) {
  const date = /* @__PURE__ */ new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  const fourthOfJanuaryDay = date.getUTCDay() || 7;
  const diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}
function isLeapYearIndex2(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
function validateDate(year, month, date) {
  return month >= 0 && month <= 11 && date >= 1 && date <= (daysInMonths[month] || (isLeapYearIndex2(year) ? 29 : 28));
}
function validateDayOfYearDate(year, dayOfYear) {
  return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex2(year) ? 366 : 365);
}
function validateWeekDate(_year, week, day) {
  return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}
function validateTime(hours, minutes, seconds) {
  if (hours === 24) {
    return minutes === 0 && seconds === 0;
  }
  return seconds >= 0 && seconds < 60 && minutes >= 0 && minutes < 60 && hours >= 0 && hours < 25;
}
function validateTimezone(_hours, minutes) {
  return minutes >= 0 && minutes <= 59;
}
var patterns, dateRegex, timeRegex, timezoneRegex, daysInMonths;
var init_parseISO = __esm({
  "node_modules/date-fns/parseISO.js"() {
    init_constants();
    init_constructFrom();
    init_toDate();
    patterns = {
      dateTimeDelimiter: /[T ]/,
      timeZoneDelimiter: /[Z ]/i,
      timezone: /([Z+-].*)$/
    };
    dateRegex = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
    timeRegex = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
    timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;
    daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  }
});

// node_modules/date-fns/parseJSON.js
var init_parseJSON = __esm({
  "node_modules/date-fns/parseJSON.js"() {
  }
});

// node_modules/date-fns/previousDay.js
var init_previousDay = __esm({
  "node_modules/date-fns/previousDay.js"() {
  }
});

// node_modules/date-fns/previousFriday.js
var init_previousFriday = __esm({
  "node_modules/date-fns/previousFriday.js"() {
  }
});

// node_modules/date-fns/previousMonday.js
var init_previousMonday = __esm({
  "node_modules/date-fns/previousMonday.js"() {
  }
});

// node_modules/date-fns/previousSaturday.js
var init_previousSaturday = __esm({
  "node_modules/date-fns/previousSaturday.js"() {
  }
});

// node_modules/date-fns/previousSunday.js
var init_previousSunday = __esm({
  "node_modules/date-fns/previousSunday.js"() {
  }
});

// node_modules/date-fns/previousThursday.js
var init_previousThursday = __esm({
  "node_modules/date-fns/previousThursday.js"() {
  }
});

// node_modules/date-fns/previousTuesday.js
var init_previousTuesday = __esm({
  "node_modules/date-fns/previousTuesday.js"() {
  }
});

// node_modules/date-fns/previousWednesday.js
var init_previousWednesday = __esm({
  "node_modules/date-fns/previousWednesday.js"() {
  }
});

// node_modules/date-fns/quartersToMonths.js
var init_quartersToMonths = __esm({
  "node_modules/date-fns/quartersToMonths.js"() {
  }
});

// node_modules/date-fns/quartersToYears.js
var init_quartersToYears = __esm({
  "node_modules/date-fns/quartersToYears.js"() {
  }
});

// node_modules/date-fns/roundToNearestHours.js
var init_roundToNearestHours = __esm({
  "node_modules/date-fns/roundToNearestHours.js"() {
  }
});

// node_modules/date-fns/roundToNearestMinutes.js
var init_roundToNearestMinutes = __esm({
  "node_modules/date-fns/roundToNearestMinutes.js"() {
  }
});

// node_modules/date-fns/secondsToHours.js
var init_secondsToHours = __esm({
  "node_modules/date-fns/secondsToHours.js"() {
  }
});

// node_modules/date-fns/secondsToMilliseconds.js
var init_secondsToMilliseconds = __esm({
  "node_modules/date-fns/secondsToMilliseconds.js"() {
  }
});

// node_modules/date-fns/secondsToMinutes.js
var init_secondsToMinutes = __esm({
  "node_modules/date-fns/secondsToMinutes.js"() {
  }
});

// node_modules/date-fns/setMonth.js
var init_setMonth = __esm({
  "node_modules/date-fns/setMonth.js"() {
  }
});

// node_modules/date-fns/set.js
var init_set = __esm({
  "node_modules/date-fns/set.js"() {
  }
});

// node_modules/date-fns/setDate.js
var init_setDate = __esm({
  "node_modules/date-fns/setDate.js"() {
  }
});

// node_modules/date-fns/setDayOfYear.js
var init_setDayOfYear = __esm({
  "node_modules/date-fns/setDayOfYear.js"() {
  }
});

// node_modules/date-fns/setDefaultOptions.js
var init_setDefaultOptions = __esm({
  "node_modules/date-fns/setDefaultOptions.js"() {
  }
});

// node_modules/date-fns/setHours.js
var init_setHours = __esm({
  "node_modules/date-fns/setHours.js"() {
  }
});

// node_modules/date-fns/setMilliseconds.js
var init_setMilliseconds = __esm({
  "node_modules/date-fns/setMilliseconds.js"() {
  }
});

// node_modules/date-fns/setMinutes.js
var init_setMinutes = __esm({
  "node_modules/date-fns/setMinutes.js"() {
  }
});

// node_modules/date-fns/setQuarter.js
var init_setQuarter = __esm({
  "node_modules/date-fns/setQuarter.js"() {
  }
});

// node_modules/date-fns/setSeconds.js
var init_setSeconds = __esm({
  "node_modules/date-fns/setSeconds.js"() {
  }
});

// node_modules/date-fns/setWeekYear.js
var init_setWeekYear = __esm({
  "node_modules/date-fns/setWeekYear.js"() {
  }
});

// node_modules/date-fns/setYear.js
var init_setYear = __esm({
  "node_modules/date-fns/setYear.js"() {
  }
});

// node_modules/date-fns/startOfDecade.js
var init_startOfDecade = __esm({
  "node_modules/date-fns/startOfDecade.js"() {
  }
});

// node_modules/date-fns/startOfToday.js
var init_startOfToday = __esm({
  "node_modules/date-fns/startOfToday.js"() {
  }
});

// node_modules/date-fns/startOfTomorrow.js
var init_startOfTomorrow = __esm({
  "node_modules/date-fns/startOfTomorrow.js"() {
  }
});

// node_modules/date-fns/startOfYesterday.js
var init_startOfYesterday = __esm({
  "node_modules/date-fns/startOfYesterday.js"() {
  }
});

// node_modules/date-fns/subMonths.js
var init_subMonths = __esm({
  "node_modules/date-fns/subMonths.js"() {
  }
});

// node_modules/date-fns/sub.js
var init_sub = __esm({
  "node_modules/date-fns/sub.js"() {
  }
});

// node_modules/date-fns/subBusinessDays.js
var init_subBusinessDays = __esm({
  "node_modules/date-fns/subBusinessDays.js"() {
  }
});

// node_modules/date-fns/subHours.js
var init_subHours = __esm({
  "node_modules/date-fns/subHours.js"() {
  }
});

// node_modules/date-fns/subMilliseconds.js
var init_subMilliseconds = __esm({
  "node_modules/date-fns/subMilliseconds.js"() {
  }
});

// node_modules/date-fns/subMinutes.js
var init_subMinutes = __esm({
  "node_modules/date-fns/subMinutes.js"() {
  }
});

// node_modules/date-fns/subQuarters.js
var init_subQuarters = __esm({
  "node_modules/date-fns/subQuarters.js"() {
  }
});

// node_modules/date-fns/subSeconds.js
var init_subSeconds = __esm({
  "node_modules/date-fns/subSeconds.js"() {
  }
});

// node_modules/date-fns/subWeeks.js
var init_subWeeks = __esm({
  "node_modules/date-fns/subWeeks.js"() {
  }
});

// node_modules/date-fns/subYears.js
var init_subYears = __esm({
  "node_modules/date-fns/subYears.js"() {
  }
});

// node_modules/date-fns/weeksToDays.js
var init_weeksToDays = __esm({
  "node_modules/date-fns/weeksToDays.js"() {
  }
});

// node_modules/date-fns/yearsToDays.js
var init_yearsToDays = __esm({
  "node_modules/date-fns/yearsToDays.js"() {
  }
});

// node_modules/date-fns/yearsToMonths.js
var init_yearsToMonths = __esm({
  "node_modules/date-fns/yearsToMonths.js"() {
  }
});

// node_modules/date-fns/yearsToQuarters.js
var init_yearsToQuarters = __esm({
  "node_modules/date-fns/yearsToQuarters.js"() {
  }
});

// node_modules/date-fns/index.js
var init_date_fns = __esm({
  "node_modules/date-fns/index.js"() {
    init_add();
    init_addBusinessDays();
    init_addDays();
    init_addHours();
    init_addISOWeekYears();
    init_addMilliseconds();
    init_addMinutes();
    init_addMonths();
    init_addQuarters();
    init_addSeconds();
    init_addWeeks();
    init_addYears();
    init_areIntervalsOverlapping();
    init_clamp();
    init_closestIndexTo();
    init_closestTo();
    init_compareAsc();
    init_compareDesc();
    init_constructFrom();
    init_constructNow();
    init_daysToWeeks();
    init_differenceInBusinessDays();
    init_differenceInCalendarDays();
    init_differenceInCalendarISOWeekYears();
    init_differenceInCalendarISOWeeks();
    init_differenceInCalendarMonths();
    init_differenceInCalendarQuarters();
    init_differenceInCalendarWeeks();
    init_differenceInCalendarYears();
    init_differenceInDays();
    init_differenceInHours();
    init_differenceInISOWeekYears();
    init_differenceInMilliseconds();
    init_differenceInMinutes();
    init_differenceInMonths();
    init_differenceInQuarters();
    init_differenceInSeconds();
    init_differenceInWeeks();
    init_differenceInYears();
    init_eachDayOfInterval();
    init_eachHourOfInterval();
    init_eachMinuteOfInterval();
    init_eachMonthOfInterval();
    init_eachQuarterOfInterval();
    init_eachWeekOfInterval();
    init_eachWeekendOfInterval();
    init_eachWeekendOfMonth();
    init_eachWeekendOfYear();
    init_eachYearOfInterval();
    init_endOfDay();
    init_endOfDecade();
    init_endOfHour();
    init_endOfISOWeek();
    init_endOfISOWeekYear();
    init_endOfMinute();
    init_endOfMonth();
    init_endOfQuarter();
    init_endOfSecond();
    init_endOfToday();
    init_endOfTomorrow();
    init_endOfWeek();
    init_endOfYear();
    init_endOfYesterday();
    init_format();
    init_formatDistance2();
    init_formatDistanceStrict();
    init_formatDistanceToNow();
    init_formatDistanceToNowStrict();
    init_formatDuration();
    init_formatISO();
    init_formatISO9075();
    init_formatISODuration();
    init_formatRFC3339();
    init_formatRFC7231();
    init_formatRelative2();
    init_fromUnixTime();
    init_getDate();
    init_getDay();
    init_getDayOfYear();
    init_getDaysInMonth();
    init_getDaysInYear();
    init_getDecade();
    init_getDefaultOptions();
    init_getHours();
    init_getISODay();
    init_getISOWeek();
    init_getISOWeekYear();
    init_getISOWeeksInYear();
    init_getMilliseconds();
    init_getMinutes();
    init_getMonth();
    init_getOverlappingDaysInIntervals();
    init_getQuarter();
    init_getSeconds();
    init_getTime();
    init_getUnixTime();
    init_getWeek();
    init_getWeekOfMonth();
    init_getWeekYear();
    init_getWeeksInMonth();
    init_getYear();
    init_hoursToMilliseconds();
    init_hoursToMinutes();
    init_hoursToSeconds();
    init_interval();
    init_intervalToDuration();
    init_intlFormat();
    init_intlFormatDistance();
    init_isAfter();
    init_isBefore();
    init_isDate();
    init_isEqual();
    init_isExists();
    init_isFirstDayOfMonth();
    init_isFriday();
    init_isFuture();
    init_isLastDayOfMonth();
    init_isLeapYear();
    init_isMatch();
    init_isMonday();
    init_isPast();
    init_isSameDay();
    init_isSameHour();
    init_isSameISOWeek();
    init_isSameISOWeekYear();
    init_isSameMinute();
    init_isSameMonth();
    init_isSameQuarter();
    init_isSameSecond();
    init_isSameWeek();
    init_isSameYear();
    init_isSaturday();
    init_isSunday();
    init_isThisHour();
    init_isThisISOWeek();
    init_isThisMinute();
    init_isThisMonth();
    init_isThisQuarter();
    init_isThisSecond();
    init_isThisWeek();
    init_isThisYear();
    init_isThursday();
    init_isToday();
    init_isTomorrow();
    init_isTuesday();
    init_isValid();
    init_isWednesday();
    init_isWeekend();
    init_isWithinInterval();
    init_isYesterday();
    init_lastDayOfDecade();
    init_lastDayOfISOWeek();
    init_lastDayOfISOWeekYear();
    init_lastDayOfMonth();
    init_lastDayOfQuarter();
    init_lastDayOfWeek();
    init_lastDayOfYear();
    init_lightFormat();
    init_max();
    init_milliseconds();
    init_millisecondsToHours();
    init_millisecondsToMinutes();
    init_millisecondsToSeconds();
    init_min();
    init_minutesToHours();
    init_minutesToMilliseconds();
    init_minutesToSeconds();
    init_monthsToQuarters();
    init_monthsToYears();
    init_nextDay();
    init_nextFriday();
    init_nextMonday();
    init_nextSaturday();
    init_nextSunday();
    init_nextThursday();
    init_nextTuesday();
    init_nextWednesday();
    init_parse();
    init_parseISO();
    init_parseJSON();
    init_previousDay();
    init_previousFriday();
    init_previousMonday();
    init_previousSaturday();
    init_previousSunday();
    init_previousThursday();
    init_previousTuesday();
    init_previousWednesday();
    init_quartersToMonths();
    init_quartersToYears();
    init_roundToNearestHours();
    init_roundToNearestMinutes();
    init_secondsToHours();
    init_secondsToMilliseconds();
    init_secondsToMinutes();
    init_set();
    init_setDate();
    init_setDay();
    init_setDayOfYear();
    init_setDefaultOptions();
    init_setHours();
    init_setISODay();
    init_setISOWeek();
    init_setISOWeekYear();
    init_setMilliseconds();
    init_setMinutes();
    init_setMonth();
    init_setQuarter();
    init_setSeconds();
    init_setWeek();
    init_setWeekYear();
    init_setYear();
    init_startOfDay();
    init_startOfDecade();
    init_startOfHour();
    init_startOfISOWeek();
    init_startOfISOWeekYear();
    init_startOfMinute();
    init_startOfMonth();
    init_startOfQuarter();
    init_startOfSecond();
    init_startOfToday();
    init_startOfTomorrow();
    init_startOfWeek();
    init_startOfWeekYear();
    init_startOfYear();
    init_startOfYesterday();
    init_sub();
    init_subBusinessDays();
    init_subDays();
    init_subHours();
    init_subISOWeekYears();
    init_subMilliseconds();
    init_subMinutes();
    init_subMonths();
    init_subQuarters();
    init_subSeconds();
    init_subWeeks();
    init_subYears();
    init_toDate();
    init_transpose();
    init_weeksToDays();
    init_yearsToDays();
    init_yearsToMonths();
    init_yearsToQuarters();
  }
});

// node_modules/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.esm.js
import { _adapters } from "../chartjs/dist/chart.js";
var FORMATS;
var init_chartjs_adapter_date_fns_esm = __esm({
  "node_modules/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.esm.js"() {
    init_date_fns();
    FORMATS = {
      datetime: "MMM d, yyyy, h:mm:ss aaaa",
      millisecond: "h:mm:ss.SSS aaaa",
      second: "h:mm:ss aaaa",
      minute: "h:mm aaaa",
      hour: "ha",
      day: "MMM d",
      week: "PP",
      month: "MMM yyyy",
      quarter: "qqq - yyyy",
      year: "yyyy"
    };
    _adapters._date.override({
      _id: "date-fns",
      // DEBUG
      formats: function() {
        return FORMATS;
      },
      parse: function(value, fmt) {
        if (value === null || typeof value === "undefined") {
          return null;
        }
        const type = typeof value;
        if (type === "number" || value instanceof Date) {
          value = toDate(value);
        } else if (type === "string") {
          if (typeof fmt === "string") {
            value = parse(value, fmt, /* @__PURE__ */ new Date(), this.options);
          } else {
            value = parseISO(value, this.options);
          }
        }
        return isValid(value) ? value.getTime() : null;
      },
      format: function(time, fmt) {
        return format(time, fmt, this.options);
      },
      add: function(time, amount, unit) {
        switch (unit) {
          case "millisecond":
            return addMilliseconds(time, amount);
          case "second":
            return addSeconds(time, amount);
          case "minute":
            return addMinutes(time, amount);
          case "hour":
            return addHours(time, amount);
          case "day":
            return addDays(time, amount);
          case "week":
            return addWeeks(time, amount);
          case "month":
            return addMonths(time, amount);
          case "quarter":
            return addQuarters(time, amount);
          case "year":
            return addYears(time, amount);
          default:
            return time;
        }
      },
      diff: function(max, min, unit) {
        switch (unit) {
          case "millisecond":
            return differenceInMilliseconds(max, min);
          case "second":
            return differenceInSeconds(max, min);
          case "minute":
            return differenceInMinutes(max, min);
          case "hour":
            return differenceInHours(max, min);
          case "day":
            return differenceInDays(max, min);
          case "week":
            return differenceInWeeks(max, min);
          case "month":
            return differenceInMonths(max, min);
          case "quarter":
            return differenceInQuarters(max, min);
          case "year":
            return differenceInYears(max, min);
          default:
            return 0;
        }
      },
      startOf: function(time, unit, weekday) {
        switch (unit) {
          case "second":
            return startOfSecond(time);
          case "minute":
            return startOfMinute(time);
          case "hour":
            return startOfHour(time);
          case "day":
            return startOfDay(time);
          case "week":
            return startOfWeek(time);
          case "isoWeek":
            return startOfWeek(time, { weekStartsOn: +weekday });
          case "month":
            return startOfMonth(time);
          case "quarter":
            return startOfQuarter(time);
          case "year":
            return startOfYear(time);
          default:
            return time;
        }
      },
      endOf: function(time, unit) {
        switch (unit) {
          case "second":
            return endOfSecond(time);
          case "minute":
            return endOfMinute(time);
          case "hour":
            return endOfHour(time);
          case "day":
            return endOfDay(time);
          case "week":
            return endOfWeek(time);
          case "month":
            return endOfMonth(time);
          case "quarter":
            return endOfQuarter(time);
          case "year":
            return endOfYear(time);
          default:
            return time;
        }
      }
    });
  }
});

// adapter-entry.js
var require_adapter_entry = __commonJS({
  "adapter-entry.js"() {
    init_chartjs_adapter_date_fns_esm();
  }
});
export default require_adapter_entry();
/*! Bundled license information:

chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.esm.js:
  (*!
   * chartjs-adapter-date-fns v3.0.0
   * https://www.chartjs.org
   * (c) 2022 chartjs-adapter-date-fns Contributors
   * Released under the MIT license
   *)
*/
