/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@messageformat/core/messageformat.js":
/*!***********************************************************!*\
  !*** ./node_modules/@messageformat/core/messageformat.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

(function (global, factory) {
     true ? module.exports = factory() :
    0;
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */

    var __assign = function () {
      __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator,
        m = s && o[s],
        i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o),
        r,
        ar = [],
        e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      } catch (error) {
        e = {
          error: error
        };
      } finally {
        try {
          if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
          if (e) throw e.error;
        }
      }
      return ar;
    }
    function __spreadArray(to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
    }
    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    /**
     * Parent class for errors.
     *
     * @remarks
     * Errors with `type: "warning"` do not necessarily indicate that the parser
     * encountered an error. In addition to a human-friendly `message`, may also
     * includes the `token` at which the error was encountered.
     *
     * @public
     */
    class DateFormatError extends Error {
      /** @internal */
      constructor(msg, token, type) {
        super(msg);
        this.token = token;
        this.type = type || 'error';
      }
    }
    const alpha = width => width < 4 ? 'short' : width === 4 ? 'long' : 'narrow';
    const numeric = width => width % 2 === 0 ? '2-digit' : 'numeric';
    function yearOptions(token, onError) {
      switch (token.char) {
        case 'y':
          return {
            year: numeric(token.width)
          };
        case 'r':
          return {
            calendar: 'gregory',
            year: 'numeric'
          };
        case 'u':
        case 'U':
        case 'Y':
        default:
          onError(`${token.desc} is not supported; falling back to year:numeric`, DateFormatError.WARNING);
          return {
            year: 'numeric'
          };
      }
    }
    function monthStyle(token, onError) {
      switch (token.width) {
        case 1:
          return 'numeric';
        case 2:
          return '2-digit';
        case 3:
          return 'short';
        case 4:
          return 'long';
        case 5:
          return 'narrow';
        default:
          onError(`${token.desc} is not supported with width ${token.width}`);
          return undefined;
      }
    }
    function dayStyle(token, onError) {
      const {
        char,
        desc,
        width
      } = token;
      if (char === 'd') return numeric(width);else {
        onError(`${desc} is not supported`);
        return undefined;
      }
    }
    function weekdayStyle(token, onError) {
      const {
        char,
        desc,
        width
      } = token;
      if ((char === 'c' || char === 'e') && width < 3) {
        // ignoring stand-alone-ness
        const msg = `Numeric value is not supported for ${desc}; falling back to weekday:short`;
        onError(msg, DateFormatError.WARNING);
      }
      // merging narrow styles
      return alpha(width);
    }
    function hourOptions(token) {
      const hour = numeric(token.width);
      let hourCycle;
      switch (token.char) {
        case 'h':
          hourCycle = 'h12';
          break;
        case 'H':
          hourCycle = 'h23';
          break;
        case 'k':
          hourCycle = 'h24';
          break;
        case 'K':
          hourCycle = 'h11';
          break;
      }
      return hourCycle ? {
        hour,
        hourCycle
      } : {
        hour
      };
    }
    function timeZoneNameStyle(token, onError) {
      // so much fallback behaviour here
      const {
        char,
        desc,
        width
      } = token;
      switch (char) {
        case 'v':
        case 'z':
          return width === 4 ? 'long' : 'short';
        case 'V':
          if (width === 4) return 'long';
          onError(`${desc} is not supported with width ${width}`);
          return undefined;
        case 'X':
          onError(`${desc} is not supported`);
          return undefined;
      }
      return 'short';
    }
    function compileOptions(token, onError) {
      switch (token.field) {
        case 'era':
          return {
            era: alpha(token.width)
          };
        case 'year':
          return yearOptions(token, onError);
        case 'month':
          return {
            month: monthStyle(token, onError)
          };
        case 'day':
          return {
            day: dayStyle(token, onError)
          };
        case 'weekday':
          return {
            weekday: weekdayStyle(token, onError)
          };
        case 'period':
          return undefined;
        case 'hour':
          return hourOptions(token);
        case 'min':
          return {
            minute: numeric(token.width)
          };
        case 'sec':
          return {
            second: numeric(token.width)
          };
        case 'tz':
          return {
            timeZoneName: timeZoneNameStyle(token, onError)
          };
        case 'quarter':
        case 'week':
        case 'sec-frac':
        case 'ms':
          onError(`${token.desc} is not supported`);
      }
      return undefined;
    }
    function getDateFormatOptions(tokens) {
      let onError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : error => {
        throw error;
      };
      const options = {};
      const fields = [];
      for (const token of tokens) {
        const {
          error,
          field,
          str
        } = token;
        if (error) {
          const dte = new DateFormatError(error.message, token);
          dte.stack = error.stack;
          onError(dte);
        }
        if (str) {
          const msg = `Ignoring string part: ${str}`;
          onError(new DateFormatError(msg, token, DateFormatError.WARNING));
        }
        if (field) {
          if (fields.indexOf(field) === -1) fields.push(field);else onError(new DateFormatError(`Duplicate ${field} token`, token));
        }
        const opt = compileOptions(token, (msg, isWarning) => onError(new DateFormatError(msg, token, isWarning)));
        if (opt) Object.assign(options, opt);
      }
      return options;
    }

    const fields = {
      G: {
        field: 'era',
        desc: 'Era'
      },
      y: {
        field: 'year',
        desc: 'Year'
      },
      Y: {
        field: 'year',
        desc: 'Year of "Week of Year"'
      },
      u: {
        field: 'year',
        desc: 'Extended year'
      },
      U: {
        field: 'year',
        desc: 'Cyclic year name'
      },
      r: {
        field: 'year',
        desc: 'Related Gregorian year'
      },
      Q: {
        field: 'quarter',
        desc: 'Quarter'
      },
      q: {
        field: 'quarter',
        desc: 'Stand-alone quarter'
      },
      M: {
        field: 'month',
        desc: 'Month in year'
      },
      L: {
        field: 'month',
        desc: 'Stand-alone month in year'
      },
      w: {
        field: 'week',
        desc: 'Week of year'
      },
      W: {
        field: 'week',
        desc: 'Week of month'
      },
      d: {
        field: 'day',
        desc: 'Day in month'
      },
      D: {
        field: 'day',
        desc: 'Day of year'
      },
      F: {
        field: 'day',
        desc: 'Day of week in month'
      },
      g: {
        field: 'day',
        desc: 'Modified julian day'
      },
      E: {
        field: 'weekday',
        desc: 'Day of week'
      },
      e: {
        field: 'weekday',
        desc: 'Local day of week'
      },
      c: {
        field: 'weekday',
        desc: 'Stand-alone local day of week'
      },
      a: {
        field: 'period',
        desc: 'AM/PM marker'
      },
      b: {
        field: 'period',
        desc: 'AM/PM/noon/midnight marker'
      },
      B: {
        field: 'period',
        desc: 'Flexible day period'
      },
      h: {
        field: 'hour',
        desc: 'Hour in AM/PM (1~12)'
      },
      H: {
        field: 'hour',
        desc: 'Hour in day (0~23)'
      },
      k: {
        field: 'hour',
        desc: 'Hour in day (1~24)'
      },
      K: {
        field: 'hour',
        desc: 'Hour in AM/PM (0~11)'
      },
      j: {
        field: 'hour',
        desc: 'Hour in preferred cycle'
      },
      J: {
        field: 'hour',
        desc: 'Hour in preferred cycle without marker'
      },
      C: {
        field: 'hour',
        desc: 'Hour in preferred cycle with flexible marker'
      },
      m: {
        field: 'min',
        desc: 'Minute in hour'
      },
      s: {
        field: 'sec',
        desc: 'Second in minute'
      },
      S: {
        field: 'sec-frac',
        desc: 'Fractional second'
      },
      A: {
        field: 'ms',
        desc: 'Milliseconds in day'
      },
      z: {
        field: 'tz',
        desc: 'Time Zone: specific non-location'
      },
      Z: {
        field: 'tz',
        desc: 'Time Zone'
      },
      O: {
        field: 'tz',
        desc: 'Time Zone: localized'
      },
      v: {
        field: 'tz',
        desc: 'Time Zone: generic non-location'
      },
      V: {
        field: 'tz',
        desc: 'Time Zone: ID'
      },
      X: {
        field: 'tz',
        desc: 'Time Zone: ISO8601 with Z'
      },
      x: {
        field: 'tz',
        desc: 'Time Zone: ISO8601'
      }
    };
    const isLetter = char => char >= 'A' && char <= 'Z' || char >= 'a' && char <= 'z';
    function readFieldToken(src, pos) {
      const char = src[pos];
      let width = 1;
      while (src[++pos] === char) ++width;
      const field = fields[char];
      if (!field) {
        const msg = `The letter ${char} is not a valid field identifier`;
        return {
          char,
          error: new Error(msg),
          width
        };
      }
      return {
        char,
        field: field.field,
        desc: field.desc,
        width
      };
    }
    function readQuotedToken(src, pos) {
      let str = src[++pos];
      let width = 2;
      if (str === "'") return {
        char: "'",
        str,
        width
      };
      while (true) {
        const next = src[++pos];
        ++width;
        if (next === undefined) {
          const msg = `Unterminated quoted literal in pattern: ${str || src}`;
          return {
            char: "'",
            error: new Error(msg),
            str,
            width
          };
        } else if (next === "'") {
          if (src[++pos] !== "'") return {
            char: "'",
            str,
            width
          };else ++width;
        }
        str += next;
      }
    }
    function readToken(src, pos) {
      const char = src[pos];
      if (!char) return null;
      if (isLetter(char)) return readFieldToken(src, pos);
      if (char === "'") return readQuotedToken(src, pos);
      let str = char;
      let width = 1;
      while (true) {
        const next = src[++pos];
        if (!next || isLetter(next) || next === "'") return {
          char,
          str,
          width
        };
        str += next;
        width += 1;
      }
    }
    /**
     * Parse an {@link http://userguide.icu-project.org/formatparse/datetime | ICU
     * DateFormat skeleton} string into a {@link DateToken} array.
     *
     * @remarks
     * Errors will not be thrown, but if encountered are included as the relevant
     * token's `error` value.
     *
     * @public
     * @param src - The skeleton string
     *
     * @example
     * ```js
     * import { parseDateTokens } from '@messageformat/date-skeleton'
     *
     * parseDateTokens('GrMMMdd', console.error)
     * // [
     * //   { char: 'G', field: 'era', desc: 'Era', width: 1 },
     * //   { char: 'r', field: 'year', desc: 'Related Gregorian year', width: 1 },
     * //   { char: 'M', field: 'month', desc: 'Month in year', width: 3 },
     * //   { char: 'd', field: 'day', desc: 'Day in month', width: 2 }
     * // ]
     * ```
     */
    function parseDateTokens(src) {
      const tokens = [];
      let pos = 0;
      while (true) {
        const token = readToken(src, pos);
        if (!token) return tokens;
        tokens.push(token);
        pos += token.width;
      }
    }

    /**
     * Returns a date formatter function for the given locales and date skeleton
     *
     * @remarks
     * Uses `Intl.DateTimeFormat` internally.
     *
     * @public
     * @param locales - One or more valid BCP 47 language tags, e.g. `fr` or `en-CA`
     * @param tokens - An ICU DateFormat skeleton string, or an array or parsed
     *   `DateToken` tokens
     * @param onError - If defined, will be called separately for each encountered
     *   parsing error and unsupported feature.
     * @example
     * ```js
     * import { getDateFormatter } from '@messageformat/date-skeleton'
     *
     * // 2006 Jan 2, 15:04:05.789 in local time
     * const date = new Date(2006, 0, 2, 15, 4, 5, 789)
     *
     * let fmt = getDateFormatter('en-CA', 'GrMMMdd', console.error)
     * fmt(date) // 'Jan. 02, 2006 AD'
     *
     * fmt = getDateFormatter('en-CA', 'hamszzzz', console.error)
     * fmt(date) // '3:04:05 p.m. Newfoundland Daylight Time'
     * ```
     */
    function getDateFormatter(locales, tokens, onError) {
      if (typeof tokens === 'string') tokens = parseDateTokens(tokens);
      const opt = getDateFormatOptions(tokens, onError);
      const dtf = new Intl.DateTimeFormat(locales, opt);
      return date => dtf.format(date);
    }
    /**
     * Returns a string of JavaScript source that evaluates to a date formatter
     * function with the same `(date: Date | number) => string` signature as the
     * function returned by {@link getDateFormatter}.
     *
     * @remarks
     * The returned function will memoize an `Intl.DateTimeFormat` instance.
     *
     * @public
     * @param locales - One or more valid BCP 47 language tags, e.g. `fr` or `en-CA`
     * @param tokens - An ICU DateFormat skeleton string, or an array or parsed
     *   `DateToken` tokens
     * @param onError - If defined, will be called separately for each encountered
     *   parsing error and unsupported feature.
     * @example
     * ```js
     * import { getDateFormatterSource } from '@messageformat/date-skeleton'
     *
     * getDateFormatterSource('en-CA', 'GrMMMdd', console.error)
     * // '(function() {\n' +
     * // '  var opt = {"era":"short","calendar":"gregory","year":"numeric",' +
     * //      '"month":"short","day":"2-digit"};\n' +
     * // '  var dtf = new Intl.DateTimeFormat("en-CA", opt);\n' +
     * // '  return function(value) { return dtf.format(value); }\n' +
     * // '})()'
     *
     * const src = getDateFormatterSource('en-CA', 'hamszzzz', console.error)
     * // '(function() {\n' +
     * // '  var opt = {"hour":"numeric","hourCycle":"h12","minute":"numeric",' +
     * //      '"second":"numeric","timeZoneName":"long"};\n' +
     * // '  var dtf = new Intl.DateTimeFormat("en-CA", opt);\n' +
     * // '  return function(value) { return dtf.format(value); }\n' +
     * // '})()'
     *
     * const fmt = new Function(`return ${src}`)()
     * const date = new Date(2006, 0, 2, 15, 4, 5, 789)
     * fmt(date) // '3:04:05 p.m. Newfoundland Daylight Time'
     * ```
     */
    function getDateFormatterSource(locales, tokens, onError) {
      if (typeof tokens === 'string') tokens = parseDateTokens(tokens);
      const opt = getDateFormatOptions(tokens, onError);
      const lines = [`(function() {`, `var opt = ${JSON.stringify(opt)};`, `var dtf = new Intl.DateTimeFormat(${JSON.stringify(locales)}, opt);`, `return function(value) { return dtf.format(value); }`];
      return lines.join('\n  ') + '\n})()';
    }

    /**
     * Base class for errors. In addition to a `code` and a human-friendly
     * `message`, may also includes the token `stem` as well as other fields.
     *
     * @public
     */
    class NumberFormatError extends Error {
      /** @internal */
      constructor(code, msg) {
        super(msg);
        this.code = code;
      }
    }
    /** @internal */
    class BadOptionError extends NumberFormatError {
      constructor(stem, opt) {
        super('BAD_OPTION', `Unknown ${stem} option: ${opt}`);
        this.stem = stem;
        this.option = opt;
      }
    }
    /** @internal */
    class BadStemError extends NumberFormatError {
      constructor(stem) {
        super('BAD_STEM', `Unknown stem: ${stem}`);
        this.stem = stem;
      }
    }
    /** @internal */
    class MaskedValueError extends NumberFormatError {
      constructor(type, prev) {
        super('MASKED_VALUE', `Value for ${type} is set multiple times`);
        this.type = type;
        this.prev = prev;
      }
    }
    /** @internal */
    class MissingOptionError extends NumberFormatError {
      constructor(stem) {
        super('MISSING_OPTION', `Required option missing for ${stem}`);
        this.stem = stem;
      }
    }
    /** @internal */
    class PatternError extends NumberFormatError {
      constructor(char, msg) {
        super('BAD_PATTERN', msg);
        this.char = char;
      }
    }
    /** @internal */
    class TooManyOptionsError extends NumberFormatError {
      constructor(stem, options, maxOpt) {
        const maxOptStr = maxOpt > 1 ? `${maxOpt} options` : 'one option';
        super('TOO_MANY_OPTIONS', `Token ${stem} only supports ${maxOptStr} (got ${options.length})`);
        this.stem = stem;
        this.options = options;
      }
    }
    /** @internal */
    class UnsupportedError extends NumberFormatError {
      constructor(stem, source) {
        super('UNSUPPORTED', `The stem ${stem} is not supported`);
        this.stem = stem;
        if (source) {
          this.message += ` with value ${source}`;
          this.source = source;
        }
      }
    }

    /**
     * Add
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation | numbering-system tags}
     * to locale identifiers
     *
     * @internal
     */
    function getNumberFormatLocales(locales, _ref) {
      let {
        numberingSystem
      } = _ref;
      if (!Array.isArray(locales)) locales = [locales];
      return numberingSystem ? locales.map(lc => {
        const ext = lc.indexOf('-u-') === -1 ? 'u-nu' : 'nu';
        return `${lc}-${ext}-${numberingSystem}`;
      }).concat(locales) : locales;
    }

    // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
    function round(x, precision) {
      const y = +x + precision / 2;
      return y - y % +precision;
    }
    function getNumberFormatMultiplier(_ref) {
      let {
        scale,
        unit
      } = _ref;
      let mult = typeof scale === 'number' && scale >= 0 ? scale : 1;
      if (unit && unit.style === 'percent') mult *= 0.01;
      return mult;
    }
    /**
     * Determine a modifier for the input value to account for any `scale`,
     * `percent`, and `precision-increment` tokens in the skeleton.
     *
     * @internal
     * @remarks
     * With ICU NumberFormatter, the `percent` skeleton would style `25` as "25%".
     * To achieve the same with `Intl.NumberFormat`, the input value must be `0.25`.
     */
    function getNumberFormatModifier(skeleton) {
      const mult = getNumberFormatMultiplier(skeleton);
      const {
        precision
      } = skeleton;
      if (precision && precision.style === 'precision-increment') {
        return n => round(n, precision.increment) * mult;
      } else {
        return n => n * mult;
      }
    }
    /**
     * Returns a string of JavaScript source that evaluates to a modifier for the
     * input value to account for any `scale`, `percent`, and `precision-increment`
     * tokens in the skeleton.
     *
     * @internal
     * @remarks
     * With ICU NumberFormatter, the `percent` skeleton would style `25` as "25%".
     * To achieve the same with `Intl.NumberFormat`, the input value must be `0.25`.
     */
    function getNumberFormatModifierSource(skeleton) {
      const mult = getNumberFormatMultiplier(skeleton);
      const {
        precision
      } = skeleton;
      if (precision && precision.style === 'precision-increment') {
        // see round() above for source
        const setX = `+n + ${precision.increment / 2}`;
        let res = `x - (x % +${precision.increment})`;
        if (mult !== 1) res = `(${res}) * ${mult}`;
        return `function(n) { var x = ${setX}; return ${res}; }`;
      }
      return mult !== 1 ? `function(n) { return n * ${mult}; }` : null;
    }

    /**
     * Given an input ICU NumberFormatter skeleton, does its best to construct a
     * corresponding `Intl.NumberFormat` options structure.
     *
     * @remarks
     * Some features depend on `Intl.NumberFormat` features defined in ES2020.
     *
     * @internal
     * @param onUnsupported - If defined, called when encountering unsupported (but
     *   valid) tokens, such as `decimal-always` or `permille`. The error `source`
     *   may specify the source of an unsupported option.
     *
     * @example
     * ```js
     * import {
     *   getNumberFormatOptions,
     *   parseNumberSkeleton
     * } from '@messageformat/number-skeleton'
     *
     * const src = 'currency/CAD unit-width-narrow'
     * const skeleton = parseNumberSkeleton(src, console.error)
     * // {
     * //   unit: { style: 'currency', currency: 'CAD' },
     * //   unitWidth: 'unit-width-narrow'
     * // }
     *
     * getNumberFormatOptions(skeleton, console.error)
     * // {
     * //   style: 'currency',
     * //   currency: 'CAD',
     * //   currencyDisplay: 'narrowSymbol',
     * //   unitDisplay: 'narrow'
     * // }
     *
     * const sk2 = parseNumberSkeleton('group-min2')
     * // { group: 'group-min2' }
     *
     * getNumberFormatOptions(sk2, console.error)
     * // Error: The stem group-min2 is not supported
     * //   at UnsupportedError.NumberFormatError ... {
     * //     code: 'UNSUPPORTED',
     * //     stem: 'group-min2'
     * //   }
     * // {}
     * ```
     */
    function getNumberFormatOptions(skeleton, onUnsupported) {
      const {
        decimal,
        group,
        integerWidth,
        notation,
        precision,
        roundingMode,
        sign,
        unit,
        unitPer,
        unitWidth
      } = skeleton;
      const fail = (stem, source) => {
        if (onUnsupported) onUnsupported(new UnsupportedError(stem, source));
      };
      const opt = {};
      if (unit) {
        switch (unit.style) {
          case 'base-unit':
            opt.style = 'decimal';
            break;
          case 'currency':
            opt.style = 'currency';
            opt.currency = unit.currency;
            break;
          case 'measure-unit':
            opt.style = 'unit';
            opt.unit = unit.unit.replace(/.*-/, '');
            if (unitPer) opt.unit += '-per-' + unitPer.replace(/.*-/, '');
            break;
          case 'percent':
            opt.style = 'percent';
            break;
          case 'permille':
            fail('permille');
            break;
        }
      }
      switch (unitWidth) {
        case 'unit-width-full-name':
          opt.currencyDisplay = 'name';
          opt.unitDisplay = 'long';
          break;
        case 'unit-width-hidden':
          fail(unitWidth);
          break;
        case 'unit-width-iso-code':
          opt.currencyDisplay = 'code';
          break;
        case 'unit-width-narrow':
          opt.currencyDisplay = 'narrowSymbol';
          opt.unitDisplay = 'narrow';
          break;
        case 'unit-width-short':
          opt.currencyDisplay = 'symbol';
          opt.unitDisplay = 'short';
          break;
      }
      switch (group) {
        case 'group-off':
          opt.useGrouping = false;
          break;
        case 'group-auto':
          opt.useGrouping = true;
          break;
        case 'group-min2':
        case 'group-on-aligned':
        case 'group-thousands':
          fail(group);
          opt.useGrouping = true;
          break;
      }
      if (precision) {
        switch (precision.style) {
          case 'precision-fraction':
            {
              const {
                minFraction: minF,
                maxFraction: maxF,
                minSignificant: minS,
                maxSignificant: maxS,
                source
              } = precision;
              if (typeof minF === 'number') {
                opt.minimumFractionDigits = minF;
                if (typeof minS === 'number') fail('precision-fraction', source);
              }
              if (typeof maxF === 'number') opt.maximumFractionDigits = maxF;
              if (typeof minS === 'number') opt.minimumSignificantDigits = minS;
              if (typeof maxS === 'number') opt.maximumSignificantDigits = maxS;
              break;
            }
          case 'precision-integer':
            opt.maximumFractionDigits = 0;
            break;
          case 'precision-unlimited':
            opt.maximumFractionDigits = 20;
            break;
          case 'precision-increment':
            break;
          case 'precision-currency-standard':
            opt.trailingZeroDisplay = precision.trailingZero;
            break;
          case 'precision-currency-cash':
            fail(precision.style);
            break;
        }
      }
      if (notation) {
        switch (notation.style) {
          case 'compact-short':
            opt.notation = 'compact';
            opt.compactDisplay = 'short';
            break;
          case 'compact-long':
            opt.notation = 'compact';
            opt.compactDisplay = 'long';
            break;
          case 'notation-simple':
            opt.notation = 'standard';
            break;
          case 'scientific':
          case 'engineering':
            {
              const {
                expDigits,
                expSign,
                source,
                style
              } = notation;
              opt.notation = style;
              if (expDigits && expDigits > 1 || expSign && expSign !== 'sign-auto') fail(style, source);
              break;
            }
        }
      }
      if (integerWidth) {
        const {
          min,
          max,
          source
        } = integerWidth;
        if (min > 0) opt.minimumIntegerDigits = min;
        if (Number(max) > 0) {
          const hasExp = opt.notation === 'engineering' || opt.notation === 'scientific';
          if (max === 3 && hasExp) opt.notation = 'engineering';else fail('integer-width', source);
        }
      }
      switch (sign) {
        case 'sign-auto':
          opt.signDisplay = 'auto';
          break;
        case 'sign-always':
          opt.signDisplay = 'always';
          break;
        case 'sign-except-zero':
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore https://github.com/microsoft/TypeScript/issues/46712
          opt.signDisplay = 'exceptZero';
          break;
        case 'sign-never':
          opt.signDisplay = 'never';
          break;
        case 'sign-accounting':
          opt.currencySign = 'accounting';
          break;
        case 'sign-accounting-always':
          opt.currencySign = 'accounting';
          opt.signDisplay = 'always';
          break;
        case 'sign-accounting-except-zero':
          opt.currencySign = 'accounting';
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore https://github.com/microsoft/TypeScript/issues/46712
          opt.signDisplay = 'exceptZero';
          break;
      }
      if (decimal === 'decimal-always') fail(decimal);
      if (roundingMode) fail(roundingMode);
      return opt;
    }

    function parseAffixToken(src, pos, onError) {
      const char = src[pos];
      switch (char) {
        case '%':
          return {
            char: '%',
            style: 'percent',
            width: 1
          };
        case '‰':
          return {
            char: '%',
            style: 'permille',
            width: 1
          };
        case '¤':
          {
            let width = 1;
            while (src[++pos] === '¤') ++width;
            switch (width) {
              case 1:
                return {
                  char,
                  currency: 'default',
                  width
                };
              case 2:
                return {
                  char,
                  currency: 'iso-code',
                  width
                };
              case 3:
                return {
                  char,
                  currency: 'full-name',
                  width
                };
              case 5:
                return {
                  char,
                  currency: 'narrow',
                  width
                };
              default:
                {
                  const msg = `Invalid number (${width}) of ¤ chars in pattern`;
                  onError(new PatternError('¤', msg));
                  return null;
                }
            }
          }
        case '*':
          {
            const pad = src[pos + 1];
            if (pad) return {
              char,
              pad,
              width: 2
            };
            break;
          }
        case '+':
        case '-':
          return {
            char,
            width: 1
          };
        case "'":
          {
            let str = src[++pos];
            let width = 2;
            if (str === "'") return {
              char,
              str,
              width
            };
            while (true) {
              const next = src[++pos];
              ++width;
              if (next === undefined) {
                const msg = `Unterminated quoted literal in pattern: ${str}`;
                onError(new PatternError("'", msg));
                return {
                  char,
                  str,
                  width
                };
              } else if (next === "'") {
                if (src[++pos] !== "'") return {
                  char,
                  str,
                  width
                };else ++width;
              }
              str += next;
            }
          }
      }
      return null;
    }

    const isDigit = char => char >= '0' && char <= '9';
    function parseNumberToken(src, pos) {
      const char = src[pos];
      if (isDigit(char)) {
        let digits = char;
        while (true) {
          const next = src[++pos];
          if (isDigit(next)) digits += next;else return {
            char: '0',
            digits,
            width: digits.length
          };
        }
      }
      switch (char) {
        case '#':
          {
            let width = 1;
            while (src[++pos] === '#') ++width;
            return {
              char,
              width
            };
          }
        case '@':
          {
            let min = 1;
            while (src[++pos] === '@') ++min;
            let width = min;
            pos -= 1;
            while (src[++pos] === '#') ++width;
            return {
              char,
              min,
              width
            };
          }
        case 'E':
          {
            const plus = src[pos + 1] === '+';
            if (plus) ++pos;
            let expDigits = 0;
            while (src[++pos] === '0') ++expDigits;
            const width = (plus ? 2 : 1) + expDigits;
            if (expDigits) return {
              char,
              expDigits,
              plus,
              width
            };else break;
          }
        case '.':
        case ',':
          return {
            char,
            width: 1
          };
      }
      return null;
    }

    function parseSubpattern(src, pos, onError) {
      let State;
      (function (State) {
        State[State["Prefix"] = 0] = "Prefix";
        State[State["Number"] = 1] = "Number";
        State[State["Suffix"] = 2] = "Suffix";
      })(State || (State = {}));
      const prefix = [];
      const number = [];
      const suffix = [];
      let state = State.Prefix;
      let str = '';
      while (pos < src.length) {
        const char = src[pos];
        if (char === ';') {
          pos += 1;
          break;
        }
        switch (state) {
          case State.Prefix:
            {
              const token = parseAffixToken(src, pos, onError);
              if (token) {
                if (str) {
                  prefix.push({
                    char: "'",
                    str,
                    width: str.length
                  });
                  str = '';
                }
                prefix.push(token);
                pos += token.width;
              } else {
                const token = parseNumberToken(src, pos);
                if (token) {
                  if (str) {
                    prefix.push({
                      char: "'",
                      str,
                      width: str.length
                    });
                    str = '';
                  }
                  state = State.Number;
                  number.push(token);
                  pos += token.width;
                } else {
                  str += char;
                  pos += 1;
                }
              }
              break;
            }
          case State.Number:
            {
              const token = parseNumberToken(src, pos);
              if (token) {
                number.push(token);
                pos += token.width;
              } else {
                state = State.Suffix;
              }
              break;
            }
          case State.Suffix:
            {
              const token = parseAffixToken(src, pos, onError);
              if (token) {
                if (str) {
                  suffix.push({
                    char: "'",
                    str,
                    width: str.length
                  });
                  str = '';
                }
                suffix.push(token);
                pos += token.width;
              } else {
                str += char;
                pos += 1;
              }
              break;
            }
        }
      }
      if (str) suffix.push({
        char: "'",
        str,
        width: str.length
      });
      return {
        pattern: {
          prefix,
          number,
          suffix
        },
        pos
      };
    }
    function parseTokens(src, onError) {
      const {
        pattern,
        pos
      } = parseSubpattern(src, 0, onError);
      if (pos < src.length) {
        const {
          pattern: negative
        } = parseSubpattern(src, pos, onError);
        return {
          tokens: pattern,
          negative
        };
      }
      return {
        tokens: pattern
      };
    }

    function parseNumberAsSkeleton(tokens, onError) {
      const res = {};
      let hasGroups = false;
      let hasExponent = false;
      let intOptional = 0;
      let intDigits = '';
      let decimalPos = -1;
      let fracDigits = '';
      let fracOptional = 0;
      for (let pos = 0; pos < tokens.length; ++pos) {
        const token = tokens[pos];
        switch (token.char) {
          case '#':
            {
              if (decimalPos === -1) {
                if (intDigits) {
                  const msg = 'Pattern has # after integer digits';
                  onError(new PatternError('#', msg));
                }
                intOptional += token.width;
              } else {
                fracOptional += token.width;
              }
              break;
            }
          case '0':
            {
              if (decimalPos === -1) {
                intDigits += token.digits;
              } else {
                if (fracOptional) {
                  const msg = 'Pattern has digits after # in fraction';
                  onError(new PatternError('0', msg));
                }
                fracDigits += token.digits;
              }
              break;
            }
          case '@':
            {
              if (res.precision) onError(new MaskedValueError('precision', res.precision));
              res.precision = {
                style: 'precision-fraction',
                minSignificant: token.min,
                maxSignificant: token.width
              };
              break;
            }
          case ',':
            hasGroups = true;
            break;
          case '.':
            if (decimalPos === 1) {
              const msg = 'Pattern has more than one decimal separator';
              onError(new PatternError('.', msg));
            }
            decimalPos = pos;
            break;
          case 'E':
            {
              if (hasExponent) onError(new MaskedValueError('exponent', res.notation));
              if (hasGroups) {
                const msg = 'Exponential patterns may not contain grouping separators';
                onError(new PatternError('E', msg));
              }
              res.notation = {
                style: 'scientific'
              };
              if (token.expDigits > 1) res.notation.expDigits = token.expDigits;
              if (token.plus) res.notation.expSign = 'sign-always';
              hasExponent = true;
            }
        }
      }
      // imprecise mapping due to paradigm differences
      if (hasGroups) res.group = 'group-auto';else if (intOptional + intDigits.length > 3) res.group = 'group-off';
      const increment = Number(`${intDigits || '0'}.${fracDigits}`);
      if (increment) res.precision = {
        style: 'precision-increment',
        increment
      };
      if (!hasExponent) {
        if (intDigits.length > 1) res.integerWidth = {
          min: intDigits.length
        };
        if (!res.precision && (fracDigits.length || fracOptional)) {
          res.precision = {
            style: 'precision-fraction',
            minFraction: fracDigits.length,
            maxFraction: fracDigits.length + fracOptional
          };
        }
      } else {
        if (!res.precision || increment) {
          res.integerWidth = intOptional ? {
            min: 1,
            max: intOptional + intDigits.length
          } : {
            min: Math.max(1, intDigits.length)
          };
        }
        if (res.precision) {
          if (!increment) res.integerWidth = {
            min: 1,
            max: 1
          };
        } else {
          const dc = intDigits.length + fracDigits.length;
          if (decimalPos === -1) {
            if (dc > 0) res.precision = {
              style: 'precision-fraction',
              maxSignificant: dc
            };
          } else {
            res.precision = {
              style: 'precision-fraction',
              maxSignificant: Math.max(1, dc) + fracOptional
            };
            if (dc > 1) res.precision.minSignificant = dc;
          }
        }
      }
      return res;
    }

    function handleAffix(affixTokens, res, currency, onError, isPrefix) {
      let inFmt = false;
      let str = '';
      for (const token of affixTokens) {
        switch (token.char) {
          case '%':
            res.unit = {
              style: token.style
            };
            if (isPrefix) inFmt = true;else str = '';
            break;
          case '¤':
            if (!currency) {
              const msg = `The ¤ pattern requires a currency`;
              onError(new PatternError('¤', msg));
              break;
            }
            res.unit = {
              style: 'currency',
              currency
            };
            switch (token.currency) {
              case 'iso-code':
                res.unitWidth = 'unit-width-iso-code';
                break;
              case 'full-name':
                res.unitWidth = 'unit-width-full-name';
                break;
              case 'narrow':
                res.unitWidth = 'unit-width-narrow';
                break;
            }
            if (isPrefix) inFmt = true;else str = '';
            break;
          case '*':
            // TODO
            break;
          case '+':
            if (!inFmt) str += '+';
            break;
          case "'":
            if (!inFmt) str += token.str;
            break;
        }
      }
      return str;
    }
    function getNegativeAffix(affixTokens, isPrefix) {
      let inFmt = false;
      let str = '';
      for (const token of affixTokens) {
        switch (token.char) {
          case '%':
          case '¤':
            if (isPrefix) inFmt = true;else str = '';
            break;
          case '-':
            if (!inFmt) str += '-';
            break;
          case "'":
            if (!inFmt) str += token.str;
            break;
        }
      }
      return str;
    }
    /**
     * Parse an {@link
     * http://unicode.org/reports/tr35/tr35-numbers.html#Number_Format_Patterns |
     * ICU NumberFormatter pattern} string into a {@link Skeleton} structure.
     *
     * @public
     * @param src - The pattern string
     * @param currency - If the pattern includes ¤ tokens, their skeleton
     *   representation requires a three-letter currency code.
     * @param onError - Called when the parser encounters a syntax error. The
     *   function will still return a {@link Skeleton}, but it will be incomplete
     *   and/or inaccurate. If not defined, the error will be thrown instead.
     *
     * @remarks
     * Unlike the skeleton parser, the pattern parser is not able to return partial
     * results on error, and will instead throw. Output padding is not supported.
     *
     * @example
     * ```js
     * import { parseNumberPattern } from '@messageformat/number-skeleton'
     *
     * parseNumberPattern('#,##0.00 ¤', 'EUR', console.error)
     * // {
     * //   group: 'group-auto',
     * //   precision: {
     * //     style: 'precision-fraction',
     * //     minFraction: 2,
     * //     maxFraction: 2
     * //   },
     * //   unit: { style: 'currency', currency: 'EUR' }
     * // }
     * ```
     */
    function parseNumberPattern(src, currency) {
      let onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : error => {
        throw error;
      };
      const {
        tokens,
        negative
      } = parseTokens(src, onError);
      const res = parseNumberAsSkeleton(tokens.number, onError);
      const prefix = handleAffix(tokens.prefix, res, currency, onError, true);
      const suffix = handleAffix(tokens.suffix, res, currency, onError, false);
      if (negative) {
        const negPrefix = getNegativeAffix(negative.prefix, true);
        const negSuffix = getNegativeAffix(negative.suffix, false);
        res.affix = {
          pos: [prefix, suffix],
          neg: [negPrefix, negSuffix]
        };
        res.sign = 'sign-never';
      } else if (prefix || suffix) {
        res.affix = {
          pos: [prefix, suffix]
        };
      }
      return res;
    }

    /** @internal */
    function isNumberingSystem(ns) {
      const systems = ['arab', 'arabext', 'bali', 'beng', 'deva', 'fullwide', 'gujr', 'guru', 'hanidec', 'khmr', 'knda', 'laoo', 'latn', 'limb', 'mlym', 'mong', 'mymr', 'orya', 'tamldec', 'telu', 'thai', 'tibt'];
      return systems.indexOf(ns) !== -1;
    }

    // FIXME: subtype is not checked
    /** @internal */
    function isUnit(unit) {
      const types = ['acceleration', 'angle', 'area', 'concentr', 'consumption', 'digital', 'duration', 'electric', 'energy', 'force', 'frequency', 'graphics', 'length', 'light', 'mass', 'power', 'pressure', 'speed', 'temperature', 'torque', 'volume'];
      const [type] = unit.split('-', 1);
      return types.indexOf(type) !== -1;
    }

    const maxOptions = {
      'compact-short': 0,
      'compact-long': 0,
      'notation-simple': 0,
      scientific: 2,
      engineering: 2,
      percent: 0,
      permille: 0,
      'base-unit': 0,
      currency: 1,
      'measure-unit': 1,
      'per-measure-unit': 1,
      'unit-width-narrow': 0,
      'unit-width-short': 0,
      'unit-width-full-name': 0,
      'unit-width-iso-code': 0,
      'unit-width-hidden': 0,
      'precision-integer': 0,
      'precision-unlimited': 0,
      'precision-currency-standard': 1,
      'precision-currency-cash': 0,
      'precision-increment': 1,
      'rounding-mode-ceiling': 0,
      'rounding-mode-floor': 0,
      'rounding-mode-down': 0,
      'rounding-mode-up': 0,
      'rounding-mode-half-even': 0,
      'rounding-mode-half-down': 0,
      'rounding-mode-half-up': 0,
      'rounding-mode-unnecessary': 0,
      'integer-width': 1,
      scale: 1,
      'group-off': 0,
      'group-min2': 0,
      'group-auto': 0,
      'group-on-aligned': 0,
      'group-thousands': 0,
      latin: 0,
      'numbering-system': 1,
      'sign-auto': 0,
      'sign-always': 0,
      'sign-never': 0,
      'sign-accounting': 0,
      'sign-accounting-always': 0,
      'sign-except-zero': 0,
      'sign-accounting-except-zero': 0,
      'decimal-auto': 0,
      'decimal-always': 0
    };
    const minOptions = {
      currency: 1,
      'integer-width': 1,
      'measure-unit': 1,
      'numbering-system': 1,
      'per-measure-unit': 1,
      'precision-increment': 1,
      scale: 1
    };
    function hasMaxOption(stem) {
      return stem in maxOptions;
    }
    function hasMinOption(stem) {
      return stem in minOptions;
    }
    /** @internal */
    function validOptions(stem, options, onError) {
      if (hasMaxOption(stem)) {
        const maxOpt = maxOptions[stem];
        if (options.length > maxOpt) {
          if (maxOpt === 0) {
            for (const opt of options) onError(new BadOptionError(stem, opt));
          } else {
            onError(new TooManyOptionsError(stem, options, maxOpt));
          }
          return false;
        } else if (hasMinOption(stem) && options.length < minOptions[stem]) {
          onError(new MissingOptionError(stem));
          return false;
        }
      }
      return true;
    }

    function parseBlueprintDigits(src, style) {
      const re = style === 'fraction' ? /^\.(0*)(\+|#*)$/ : /^(@+)(\+|#*)$/;
      const match = src && src.match(re);
      if (match) {
        const min = match[1].length;
        switch (match[2].charAt(0)) {
          case '':
            return {
              min,
              max: min
            };
          case '+':
            return {
              min,
              max: null
            };
          case '#':
            {
              return {
                min,
                max: min + match[2].length
              };
            }
        }
      }
      return null;
    }
    function parsePrecisionBlueprint(stem, options, onError) {
      const fd = parseBlueprintDigits(stem, 'fraction');
      if (fd) {
        if (options.length > 1) onError(new TooManyOptionsError(stem, options, 1));
        const res = {
          style: 'precision-fraction',
          source: stem,
          minFraction: fd.min
        };
        if (fd.max != null) res.maxFraction = fd.max;
        const option = options[0];
        const sd = parseBlueprintDigits(option, 'significant');
        if (sd) {
          res.source = `${stem}/${option}`;
          res.minSignificant = sd.min;
          if (sd.max != null) res.maxSignificant = sd.max;
        } else if (option) onError(new BadOptionError(stem, option));
        return res;
      }
      const sd = parseBlueprintDigits(stem, 'significant');
      if (sd) {
        for (const opt of options) onError(new BadOptionError(stem, opt));
        const res = {
          style: 'precision-fraction',
          source: stem,
          minSignificant: sd.min
        };
        if (sd.max != null) res.maxSignificant = sd.max;
        return res;
      }
      return null;
    }

    /** @internal */
    class TokenParser {
      constructor(onError) {
        this.skeleton = {};
        this.onError = onError;
      }
      badOption(stem, opt) {
        this.onError(new BadOptionError(stem, opt));
      }
      assertEmpty(key) {
        const prev = this.skeleton[key];
        if (prev) this.onError(new MaskedValueError(key, prev));
      }
      parseToken(stem, options) {
        if (!validOptions(stem, options, this.onError)) return;
        const option = options[0];
        const res = this.skeleton;
        switch (stem) {
          // notation
          case 'compact-short':
          case 'compact-long':
          case 'notation-simple':
            this.assertEmpty('notation');
            res.notation = {
              style: stem
            };
            break;
          case 'scientific':
          case 'engineering':
            {
              let expDigits = null;
              let expSign = undefined;
              for (const opt of options) {
                switch (opt) {
                  case 'sign-auto':
                  case 'sign-always':
                  case 'sign-never':
                  case 'sign-accounting':
                  case 'sign-accounting-always':
                  case 'sign-except-zero':
                  case 'sign-accounting-except-zero':
                    expSign = opt;
                    break;
                  default:
                    if (/^\+e+$/.test(opt)) expDigits = opt.length - 1;else {
                      this.badOption(stem, opt);
                    }
                }
              }
              this.assertEmpty('notation');
              const source = options.join('/');
              res.notation = expDigits && expSign ? {
                style: stem,
                source,
                expDigits,
                expSign
              } : expDigits ? {
                style: stem,
                source,
                expDigits
              } : expSign ? {
                style: stem,
                source,
                expSign
              } : {
                style: stem,
                source
              };
              break;
            }
          // unit
          case 'percent':
          case 'permille':
          case 'base-unit':
            this.assertEmpty('unit');
            res.unit = {
              style: stem
            };
            break;
          case 'currency':
            if (/^[A-Z]{3}$/.test(option)) {
              this.assertEmpty('unit');
              res.unit = {
                style: stem,
                currency: option
              };
            } else this.badOption(stem, option);
            break;
          case 'measure-unit':
            {
              if (isUnit(option)) {
                this.assertEmpty('unit');
                res.unit = {
                  style: stem,
                  unit: option
                };
              } else this.badOption(stem, option);
              break;
            }
          // unitPer
          case 'per-measure-unit':
            {
              if (isUnit(option)) {
                this.assertEmpty('unitPer');
                res.unitPer = option;
              } else this.badOption(stem, option);
              break;
            }
          // unitWidth
          case 'unit-width-narrow':
          case 'unit-width-short':
          case 'unit-width-full-name':
          case 'unit-width-iso-code':
          case 'unit-width-hidden':
            this.assertEmpty('unitWidth');
            res.unitWidth = stem;
            break;
          // precision
          case 'precision-integer':
          case 'precision-unlimited':
          case 'precision-currency-cash':
            this.assertEmpty('precision');
            res.precision = {
              style: stem
            };
            break;
          case 'precision-currency-standard':
            this.assertEmpty('precision');
            if (option === 'w') {
              res.precision = {
                style: stem,
                trailingZero: 'stripIfInteger'
              };
            } else {
              res.precision = {
                style: stem
              };
            }
            break;
          case 'precision-increment':
            {
              const increment = Number(option);
              if (increment > 0) {
                this.assertEmpty('precision');
                res.precision = {
                  style: stem,
                  increment
                };
              } else this.badOption(stem, option);
              break;
            }
          // roundingMode
          case 'rounding-mode-ceiling':
          case 'rounding-mode-floor':
          case 'rounding-mode-down':
          case 'rounding-mode-up':
          case 'rounding-mode-half-even':
          case 'rounding-mode-half-odd':
          case 'rounding-mode-half-ceiling':
          case 'rounding-mode-half-floor':
          case 'rounding-mode-half-down':
          case 'rounding-mode-half-up':
          case 'rounding-mode-unnecessary':
            this.assertEmpty('roundingMode');
            res.roundingMode = stem;
            break;
          // integerWidth
          case 'integer-width':
            {
              if (/^\+0*$/.test(option)) {
                this.assertEmpty('integerWidth');
                res.integerWidth = {
                  source: option,
                  min: option.length - 1
                };
              } else {
                const m = option.match(/^#*(0*)$/);
                if (m) {
                  this.assertEmpty('integerWidth');
                  res.integerWidth = {
                    source: option,
                    min: m[1].length,
                    max: m[0].length
                  };
                } else this.badOption(stem, option);
              }
              break;
            }
          // scale
          case 'scale':
            {
              const scale = Number(option);
              if (scale > 0) {
                this.assertEmpty('scale');
                res.scale = scale;
              } else this.badOption(stem, option);
              break;
            }
          // group
          case 'group-off':
          case 'group-min2':
          case 'group-auto':
          case 'group-on-aligned':
          case 'group-thousands':
            this.assertEmpty('group');
            res.group = stem;
            break;
          // numberingSystem
          case 'latin':
            this.assertEmpty('numberingSystem');
            res.numberingSystem = 'latn';
            break;
          case 'numbering-system':
            {
              if (isNumberingSystem(option)) {
                this.assertEmpty('numberingSystem');
                res.numberingSystem = option;
              } else this.badOption(stem, option);
              break;
            }
          // sign
          case 'sign-auto':
          case 'sign-always':
          case 'sign-never':
          case 'sign-accounting':
          case 'sign-accounting-always':
          case 'sign-except-zero':
          case 'sign-accounting-except-zero':
            this.assertEmpty('sign');
            res.sign = stem;
            break;
          // decimal
          case 'decimal-auto':
          case 'decimal-always':
            this.assertEmpty('decimal');
            res.decimal = stem;
            break;
          // precision blueprint
          default:
            {
              const precision = parsePrecisionBlueprint(stem, options, this.onError);
              if (precision) {
                this.assertEmpty('precision');
                res.precision = precision;
              } else {
                this.onError(new BadStemError(stem));
              }
            }
        }
      }
    }

    /**
     * Parse an {@link
     * https://github.com/unicode-org/icu/blob/master/docs/userguide/format_parse/numbers/skeletons.md
     * | ICU NumberFormatter skeleton} string into a {@link Skeleton} structure.
     *
     * @public
     * @param src - The skeleton string
     * @param onError - Called when the parser encounters a syntax error. The
     *   function will still return a {@link Skeleton}, but it may not contain
     *   information for all tokens. If not defined, the error will be thrown
     *   instead.
     *
     * @example
     * ```js
     * import { parseNumberSkeleton } from '@messageformat/number-skeleton'
     *
     * parseNumberSkeleton('compact-short currency/GBP', console.error)
     * // {
     * //   notation: { style: 'compact-short' },
     * //   unit: { style: 'currency', currency: 'GBP' }
     * // }
     * ```
     */
    function parseNumberSkeleton(src) {
      let onError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : error => {
        throw error;
      };
      const tokens = [];
      for (const part of src.split(' ')) {
        if (part) {
          const options = part.split('/');
          const stem = options.shift() || '';
          tokens.push({
            stem,
            options
          });
        }
      }
      const parser = new TokenParser(onError);
      for (const {
        stem,
        options
      } of tokens) {
        parser.parseToken(stem, options);
      }
      return parser.skeleton;
    }

    /**
     * Returns a number formatter function for the given locales and number skeleton
     *
     * @remarks
     * Uses `Intl.NumberFormat` (ES2020) internally.
     *
     * @public
     * @param locales - One or more valid BCP 47 language tags, e.g. `fr` or `en-CA`
     * @param skeleton - An ICU NumberFormatter pattern or `::`-prefixed skeleton
     *   string, or a parsed `Skeleton` structure
     * @param currency - If `skeleton` is a pattern string that includes ¤ tokens,
     *   their skeleton representation requires a three-letter currency code.
     * @param onError - If defined, will be called separately for each encountered
     *   parsing error and unsupported feature.
     * @example
     * ```js
     * import { getNumberFormatter } from '@messageformat/number-skeleton'
     *
     * let src = ':: currency/CAD unit-width-narrow'
     * let fmt = getNumberFormatter('en-CA', src, console.error)
     * fmt(42) // '$42.00'
     *
     * src = '::percent scale/100'
     * fmt = getNumberFormatter('en', src, console.error)
     * fmt(0.3) // '30%'
     * ```
     */
    function getNumberFormatter(locales, skeleton, currency, onError) {
      if (typeof skeleton === 'string') {
        skeleton = skeleton.indexOf('::') === 0 ? parseNumberSkeleton(skeleton.slice(2), onError) : parseNumberPattern(skeleton, currency, onError);
      }
      const lc = getNumberFormatLocales(locales, skeleton);
      const opt = getNumberFormatOptions(skeleton, onError);
      const mod = getNumberFormatModifier(skeleton);
      const nf = new Intl.NumberFormat(lc, opt);
      if (skeleton.affix) {
        const [p0, p1] = skeleton.affix.pos;
        const [n0, n1] = skeleton.affix.neg || ['', ''];
        return value => {
          const n = nf.format(mod(value));
          return value < 0 ? `${n0}${n}${n1}` : `${p0}${n}${p1}`;
        };
      }
      return value => nf.format(mod(value));
    }
    /**
     * Returns a string of JavaScript source that evaluates to a number formatter
     * function with the same `(value: number) => string` signature as the function
     * returned by {@link getNumberFormatter}.
     *
     * @remarks
     * The returned function will memoize an `Intl.NumberFormat` instance.
     *
     * @public
     * @param locales - One or more valid BCP 47 language tags, e.g. `fr` or `en-CA`
     * @param skeleton - An ICU NumberFormatter pattern or `::`-prefixed skeleton
     *   string, or a parsed `Skeleton` structure
     * @param currency - If `skeleton` is a pattern string that includes ¤ tokens,
     *   their skeleton representation requires a three-letter currency code.
     * @param onError - If defined, will be called separately for each encountered
     *   parsing error and unsupported feature.
     * @example
     * ```js
     * import { getNumberFormatterSource } from '@messageformat/number-skeleton'
     *
     * getNumberFormatterSource('en', '::percent', console.error)
     * // '(function() {\n' +
     * // '  var opt = {"style":"percent"};\n' +
     * // '  var nf = new Intl.NumberFormat(["en"], opt);\n' +
     * // '  var mod = function(n) { return n * 0.01; };\n' +
     * // '  return function(value) { return nf.format(mod(value)); }\n' +
     * // '})()'
     *
     * const src = getNumberFormatterSource('en-CA', ':: currency/CAD unit-width-narrow', console.error)
     * // '(function() {\n' +
     * // '  var opt = {"style":"currency","currency":"CAD","currencyDisplay":"narrowSymbol","unitDisplay":"narrow"};\n' +
     * // '  var nf = new Intl.NumberFormat(["en-CA"], opt);\n'
     * // '  return function(value) { return nf.format(value); }\n' +
     * // '})()'
     * const fmt = new Function(`return ${src}`)()
     * fmt(42) // '$42.00'
     * ```
     */
    function getNumberFormatterSource(locales, skeleton, currency, onError) {
      if (typeof skeleton === 'string') {
        skeleton = skeleton.indexOf('::') === 0 ? parseNumberSkeleton(skeleton.slice(2), onError) : parseNumberPattern(skeleton, currency, onError);
      }
      const lc = getNumberFormatLocales(locales, skeleton);
      const opt = getNumberFormatOptions(skeleton, onError);
      const modSrc = getNumberFormatModifierSource(skeleton);
      const lines = [`(function() {`, `var opt = ${JSON.stringify(opt)};`, `var nf = new Intl.NumberFormat(${JSON.stringify(lc)}, opt);`];
      let res = 'nf.format(value)';
      if (modSrc) {
        lines.push(`var mod = ${modSrc};`);
        res = 'nf.format(mod(value))';
      }
      if (skeleton.affix) {
        const [p0, p1] = skeleton.affix.pos.map(s => JSON.stringify(s));
        if (skeleton.affix.neg) {
          const [n0, n1] = skeleton.affix.neg.map(s => JSON.stringify(s));
          res = `value < 0 ? ${n0} + ${res} + ${n1} : ${p0} + ${res} + ${p1}`;
        } else {
          res = `${p0} + ${res} + ${p1}`;
        }
      }
      lines.push(`return function(value) { return ${res}; }`);
      return lines.join('\n  ') + '\n})()';
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var parser = {};

    var lexer = {};

    var moo = {exports: {}};

    (function (module) {
      (function (root, factory) {
        if (module.exports) {
          module.exports = factory();
        } else {
          root.moo = factory();
        }
      })(commonjsGlobal, function () {

        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var toString = Object.prototype.toString;
        var hasSticky = typeof new RegExp().sticky === 'boolean';

        /***************************************************************************/

        function isRegExp(o) {
          return o && toString.call(o) === '[object RegExp]';
        }
        function isObject(o) {
          return o && typeof o === 'object' && !isRegExp(o) && !Array.isArray(o);
        }
        function reEscape(s) {
          return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        }
        function reGroups(s) {
          var re = new RegExp('|' + s);
          return re.exec('').length - 1;
        }
        function reCapture(s) {
          return '(' + s + ')';
        }
        function reUnion(regexps) {
          if (!regexps.length) return '(?!)';
          var source = regexps.map(function (s) {
            return "(?:" + s + ")";
          }).join('|');
          return "(?:" + source + ")";
        }
        function regexpOrLiteral(obj) {
          if (typeof obj === 'string') {
            return '(?:' + reEscape(obj) + ')';
          } else if (isRegExp(obj)) {
            // TODO: consider /u support
            if (obj.ignoreCase) throw new Error('RegExp /i flag not allowed');
            if (obj.global) throw new Error('RegExp /g flag is implied');
            if (obj.sticky) throw new Error('RegExp /y flag is implied');
            if (obj.multiline) throw new Error('RegExp /m flag is implied');
            return obj.source;
          } else {
            throw new Error('Not a pattern: ' + obj);
          }
        }
        function pad(s, length) {
          if (s.length > length) {
            return s;
          }
          return Array(length - s.length + 1).join(" ") + s;
        }
        function lastNLines(string, numLines) {
          var position = string.length;
          var lineBreaks = 0;
          while (true) {
            var idx = string.lastIndexOf("\n", position - 1);
            if (idx === -1) {
              break;
            } else {
              lineBreaks++;
            }
            position = idx;
            if (lineBreaks === numLines) {
              break;
            }
            if (position === 0) {
              break;
            }
          }
          var startPosition = lineBreaks < numLines ? 0 : position + 1;
          return string.substring(startPosition).split("\n");
        }
        function objectToRules(object) {
          var keys = Object.getOwnPropertyNames(object);
          var result = [];
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var thing = object[key];
            var rules = [].concat(thing);
            if (key === 'include') {
              for (var j = 0; j < rules.length; j++) {
                result.push({
                  include: rules[j]
                });
              }
              continue;
            }
            var match = [];
            rules.forEach(function (rule) {
              if (isObject(rule)) {
                if (match.length) result.push(ruleOptions(key, match));
                result.push(ruleOptions(key, rule));
                match = [];
              } else {
                match.push(rule);
              }
            });
            if (match.length) result.push(ruleOptions(key, match));
          }
          return result;
        }
        function arrayToRules(array) {
          var result = [];
          for (var i = 0; i < array.length; i++) {
            var obj = array[i];
            if (obj.include) {
              var include = [].concat(obj.include);
              for (var j = 0; j < include.length; j++) {
                result.push({
                  include: include[j]
                });
              }
              continue;
            }
            if (!obj.type) {
              throw new Error('Rule has no type: ' + JSON.stringify(obj));
            }
            result.push(ruleOptions(obj.type, obj));
          }
          return result;
        }
        function ruleOptions(type, obj) {
          if (!isObject(obj)) {
            obj = {
              match: obj
            };
          }
          if (obj.include) {
            throw new Error('Matching rules cannot also include states');
          }

          // nb. error and fallback imply lineBreaks
          var options = {
            defaultType: type,
            lineBreaks: !!obj.error || !!obj.fallback,
            pop: false,
            next: null,
            push: null,
            error: false,
            fallback: false,
            value: null,
            type: null,
            shouldThrow: false
          };

          // Avoid Object.assign(), so we support IE9+
          for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
              options[key] = obj[key];
            }
          }

          // type transform cannot be a string
          if (typeof options.type === 'string' && type !== options.type) {
            throw new Error("Type transform cannot be a string (type '" + options.type + "' for token '" + type + "')");
          }

          // convert to array
          var match = options.match;
          options.match = Array.isArray(match) ? match : match ? [match] : [];
          options.match.sort(function (a, b) {
            return isRegExp(a) && isRegExp(b) ? 0 : isRegExp(b) ? -1 : isRegExp(a) ? +1 : b.length - a.length;
          });
          return options;
        }
        function toRules(spec) {
          return Array.isArray(spec) ? arrayToRules(spec) : objectToRules(spec);
        }
        var defaultErrorRule = ruleOptions('error', {
          lineBreaks: true,
          shouldThrow: true
        });
        function compileRules(rules, hasStates) {
          var errorRule = null;
          var fast = Object.create(null);
          var fastAllowed = true;
          var unicodeFlag = null;
          var groups = [];
          var parts = [];

          // If there is a fallback rule, then disable fast matching
          for (var i = 0; i < rules.length; i++) {
            if (rules[i].fallback) {
              fastAllowed = false;
            }
          }
          for (var i = 0; i < rules.length; i++) {
            var options = rules[i];
            if (options.include) {
              // all valid inclusions are removed by states() preprocessor
              throw new Error('Inheritance is not allowed in stateless lexers');
            }
            if (options.error || options.fallback) {
              // errorRule can only be set once
              if (errorRule) {
                if (!options.fallback === !errorRule.fallback) {
                  throw new Error("Multiple " + (options.fallback ? "fallback" : "error") + " rules not allowed (for token '" + options.defaultType + "')");
                } else {
                  throw new Error("fallback and error are mutually exclusive (for token '" + options.defaultType + "')");
                }
              }
              errorRule = options;
            }
            var match = options.match.slice();
            if (fastAllowed) {
              while (match.length && typeof match[0] === 'string' && match[0].length === 1) {
                var word = match.shift();
                fast[word.charCodeAt(0)] = options;
              }
            }

            // Warn about inappropriate state-switching options
            if (options.pop || options.push || options.next) {
              if (!hasStates) {
                throw new Error("State-switching options are not allowed in stateless lexers (for token '" + options.defaultType + "')");
              }
              if (options.fallback) {
                throw new Error("State-switching options are not allowed on fallback tokens (for token '" + options.defaultType + "')");
              }
            }

            // Only rules with a .match are included in the RegExp
            if (match.length === 0) {
              continue;
            }
            fastAllowed = false;
            groups.push(options);

            // Check unicode flag is used everywhere or nowhere
            for (var j = 0; j < match.length; j++) {
              var obj = match[j];
              if (!isRegExp(obj)) {
                continue;
              }
              if (unicodeFlag === null) {
                unicodeFlag = obj.unicode;
              } else if (unicodeFlag !== obj.unicode && options.fallback === false) {
                throw new Error('If one rule is /u then all must be');
              }
            }

            // convert to RegExp
            var pat = reUnion(match.map(regexpOrLiteral));

            // validate
            var regexp = new RegExp(pat);
            if (regexp.test("")) {
              throw new Error("RegExp matches empty string: " + regexp);
            }
            var groupCount = reGroups(pat);
            if (groupCount > 0) {
              throw new Error("RegExp has capture groups: " + regexp + "\nUse (?: … ) instead");
            }

            // try and detect rules matching newlines
            if (!options.lineBreaks && regexp.test('\n')) {
              throw new Error('Rule should declare lineBreaks: ' + regexp);
            }

            // store regex
            parts.push(reCapture(pat));
          }

          // If there's no fallback rule, use the sticky flag so we only look for
          // matches at the current index.
          //
          // If we don't support the sticky flag, then fake it using an irrefutable
          // match (i.e. an empty pattern).
          var fallbackRule = errorRule && errorRule.fallback;
          var flags = hasSticky && !fallbackRule ? 'ym' : 'gm';
          var suffix = hasSticky || fallbackRule ? '' : '|';
          if (unicodeFlag === true) flags += "u";
          var combined = new RegExp(reUnion(parts) + suffix, flags);
          return {
            regexp: combined,
            groups: groups,
            fast: fast,
            error: errorRule || defaultErrorRule
          };
        }
        function compile(rules) {
          var result = compileRules(toRules(rules));
          return new Lexer({
            start: result
          }, 'start');
        }
        function checkStateGroup(g, name, map) {
          var state = g && (g.push || g.next);
          if (state && !map[state]) {
            throw new Error("Missing state '" + state + "' (in token '" + g.defaultType + "' of state '" + name + "')");
          }
          if (g && g.pop && +g.pop !== 1) {
            throw new Error("pop must be 1 (in token '" + g.defaultType + "' of state '" + name + "')");
          }
        }
        function compileStates(states, start) {
          var all = states.$all ? toRules(states.$all) : [];
          delete states.$all;
          var keys = Object.getOwnPropertyNames(states);
          if (!start) start = keys[0];
          var ruleMap = Object.create(null);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            ruleMap[key] = toRules(states[key]).concat(all);
          }
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var rules = ruleMap[key];
            var included = Object.create(null);
            for (var j = 0; j < rules.length; j++) {
              var rule = rules[j];
              if (!rule.include) continue;
              var splice = [j, 1];
              if (rule.include !== key && !included[rule.include]) {
                included[rule.include] = true;
                var newRules = ruleMap[rule.include];
                if (!newRules) {
                  throw new Error("Cannot include nonexistent state '" + rule.include + "' (in state '" + key + "')");
                }
                for (var k = 0; k < newRules.length; k++) {
                  var newRule = newRules[k];
                  if (rules.indexOf(newRule) !== -1) continue;
                  splice.push(newRule);
                }
              }
              rules.splice.apply(rules, splice);
              j--;
            }
          }
          var map = Object.create(null);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            map[key] = compileRules(ruleMap[key], true);
          }
          for (var i = 0; i < keys.length; i++) {
            var name = keys[i];
            var state = map[name];
            var groups = state.groups;
            for (var j = 0; j < groups.length; j++) {
              checkStateGroup(groups[j], name, map);
            }
            var fastKeys = Object.getOwnPropertyNames(state.fast);
            for (var j = 0; j < fastKeys.length; j++) {
              checkStateGroup(state.fast[fastKeys[j]], name, map);
            }
          }
          return new Lexer(map, start);
        }
        function keywordTransform(map) {
          // Use a JavaScript Map to map keywords to their corresponding token type
          // unless Map is unsupported, then fall back to using an Object:
          var isMap = typeof Map !== 'undefined';
          var reverseMap = isMap ? new Map() : Object.create(null);
          var types = Object.getOwnPropertyNames(map);
          for (var i = 0; i < types.length; i++) {
            var tokenType = types[i];
            var item = map[tokenType];
            var keywordList = Array.isArray(item) ? item : [item];
            keywordList.forEach(function (keyword) {
              if (typeof keyword !== 'string') {
                throw new Error("keyword must be string (in keyword '" + tokenType + "')");
              }
              if (isMap) {
                reverseMap.set(keyword, tokenType);
              } else {
                reverseMap[keyword] = tokenType;
              }
            });
          }
          return function (k) {
            return isMap ? reverseMap.get(k) : reverseMap[k];
          };
        }

        /***************************************************************************/

        var Lexer = function (states, state) {
          this.startState = state;
          this.states = states;
          this.buffer = '';
          this.stack = [];
          this.reset();
        };
        Lexer.prototype.reset = function (data, info) {
          this.buffer = data || '';
          this.index = 0;
          this.line = info ? info.line : 1;
          this.col = info ? info.col : 1;
          this.queuedToken = info ? info.queuedToken : null;
          this.queuedText = info ? info.queuedText : "";
          this.queuedThrow = info ? info.queuedThrow : null;
          this.setState(info ? info.state : this.startState);
          this.stack = info && info.stack ? info.stack.slice() : [];
          return this;
        };
        Lexer.prototype.save = function () {
          return {
            line: this.line,
            col: this.col,
            state: this.state,
            stack: this.stack.slice(),
            queuedToken: this.queuedToken,
            queuedText: this.queuedText,
            queuedThrow: this.queuedThrow
          };
        };
        Lexer.prototype.setState = function (state) {
          if (!state || this.state === state) return;
          this.state = state;
          var info = this.states[state];
          this.groups = info.groups;
          this.error = info.error;
          this.re = info.regexp;
          this.fast = info.fast;
        };
        Lexer.prototype.popState = function () {
          this.setState(this.stack.pop());
        };
        Lexer.prototype.pushState = function (state) {
          this.stack.push(this.state);
          this.setState(state);
        };
        var eat = hasSticky ? function (re, buffer) {
          // assume re is /y
          return re.exec(buffer);
        } : function (re, buffer) {
          // assume re is /g
          var match = re.exec(buffer);
          // will always match, since we used the |(?:) trick
          if (match[0].length === 0) {
            return null;
          }
          return match;
        };
        Lexer.prototype._getGroup = function (match) {
          var groupCount = this.groups.length;
          for (var i = 0; i < groupCount; i++) {
            if (match[i + 1] !== undefined) {
              return this.groups[i];
            }
          }
          throw new Error('Cannot find token type for matched text');
        };
        function tokenToString() {
          return this.value;
        }
        Lexer.prototype.next = function () {
          var index = this.index;

          // If a fallback token matched, we don't need to re-run the RegExp
          if (this.queuedGroup) {
            var token = this._token(this.queuedGroup, this.queuedText, index);
            this.queuedGroup = null;
            this.queuedText = "";
            return token;
          }
          var buffer = this.buffer;
          if (index === buffer.length) {
            return; // EOF
          }

          // Fast matching for single characters
          var group = this.fast[buffer.charCodeAt(index)];
          if (group) {
            return this._token(group, buffer.charAt(index), index);
          }

          // Execute RegExp
          var re = this.re;
          re.lastIndex = index;
          var match = eat(re, buffer);

          // Error tokens match the remaining buffer
          var error = this.error;
          if (match == null) {
            return this._token(error, buffer.slice(index, buffer.length), index);
          }
          var group = this._getGroup(match);
          var text = match[0];
          if (error.fallback && match.index !== index) {
            this.queuedGroup = group;
            this.queuedText = text;

            // Fallback tokens contain the unmatched portion of the buffer
            return this._token(error, buffer.slice(index, match.index), index);
          }
          return this._token(group, text, index);
        };
        Lexer.prototype._token = function (group, text, offset) {
          // count line breaks
          var lineBreaks = 0;
          if (group.lineBreaks) {
            var matchNL = /\n/g;
            var nl = 1;
            if (text === '\n') {
              lineBreaks = 1;
            } else {
              while (matchNL.exec(text)) {
                lineBreaks++;
                nl = matchNL.lastIndex;
              }
            }
          }
          var token = {
            type: typeof group.type === 'function' && group.type(text) || group.defaultType,
            value: typeof group.value === 'function' ? group.value(text) : text,
            text: text,
            toString: tokenToString,
            offset: offset,
            lineBreaks: lineBreaks,
            line: this.line,
            col: this.col
          };
          // nb. adding more props to token object will make V8 sad!

          var size = text.length;
          this.index += size;
          this.line += lineBreaks;
          if (lineBreaks !== 0) {
            this.col = size - nl + 1;
          } else {
            this.col += size;
          }

          // throw, if no rule with {error: true}
          if (group.shouldThrow) {
            var err = new Error(this.formatError(token, "invalid syntax"));
            throw err;
          }
          if (group.pop) this.popState();else if (group.push) this.pushState(group.push);else if (group.next) this.setState(group.next);
          return token;
        };
        if (typeof Symbol !== 'undefined' && Symbol.iterator) {
          var LexerIterator = function (lexer) {
            this.lexer = lexer;
          };
          LexerIterator.prototype.next = function () {
            var token = this.lexer.next();
            return {
              value: token,
              done: !token
            };
          };
          LexerIterator.prototype[Symbol.iterator] = function () {
            return this;
          };
          Lexer.prototype[Symbol.iterator] = function () {
            return new LexerIterator(this);
          };
        }
        Lexer.prototype.formatError = function (token, message) {
          if (token == null) {
            // An undefined token indicates EOF
            var text = this.buffer.slice(this.index);
            var token = {
              text: text,
              offset: this.index,
              lineBreaks: text.indexOf('\n') === -1 ? 0 : 1,
              line: this.line,
              col: this.col
            };
          }
          var numLinesAround = 2;
          var firstDisplayedLine = Math.max(token.line - numLinesAround, 1);
          var lastDisplayedLine = token.line + numLinesAround;
          var lastLineDigits = String(lastDisplayedLine).length;
          var displayedLines = lastNLines(this.buffer, this.line - token.line + numLinesAround + 1).slice(0, 5);
          var errorLines = [];
          errorLines.push(message + " at line " + token.line + " col " + token.col + ":");
          errorLines.push("");
          for (var i = 0; i < displayedLines.length; i++) {
            var line = displayedLines[i];
            var lineNo = firstDisplayedLine + i;
            errorLines.push(pad(String(lineNo), lastLineDigits) + "  " + line);
            if (lineNo === token.line) {
              errorLines.push(pad("", lastLineDigits + token.col + 1) + "^");
            }
          }
          return errorLines.join("\n");
        };
        Lexer.prototype.clone = function () {
          return new Lexer(this.states, this.state);
        };
        Lexer.prototype.has = function (tokenType) {
          return true;
        };
        return {
          compile: compile,
          states: compileStates,
          error: Object.freeze({
            error: true
          }),
          fallback: Object.freeze({
            fallback: true
          }),
          keywords: keywordTransform
        };
      });
    })(moo);
    var mooExports = moo.exports;

    (function (exports) {

      var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : {
          "default": mod
        };
      };
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.lexer = exports.states = void 0;
      const moo_1 = __importDefault(mooExports);
      exports.states = {
        body: {
          doubleapos: {
            match: "''",
            value: () => "'"
          },
          quoted: {
            lineBreaks: true,
            match: /'[{}#](?:[^]*?[^'])?'(?!')/u,
            value: src => src.slice(1, -1).replace(/''/g, "'")
          },
          argument: {
            lineBreaks: true,
            match: /\{\s*[^\p{Pat_Syn}\p{Pat_WS}]+\s*/u,
            push: 'arg',
            value: src => src.substring(1).trim()
          },
          octothorpe: '#',
          end: {
            match: '}',
            pop: 1
          },
          content: {
            lineBreaks: true,
            match: /[^][^{}#']*/u
          }
        },
        arg: {
          select: {
            lineBreaks: true,
            match: /,\s*(?:plural|select|selectordinal)\s*,\s*/u,
            next: 'select',
            value: src => src.split(',')[1].trim()
          },
          'func-args': {
            lineBreaks: true,
            match: /,\s*[^\p{Pat_Syn}\p{Pat_WS}]+\s*,/u,
            next: 'body',
            value: src => src.split(',')[1].trim()
          },
          'func-simple': {
            lineBreaks: true,
            match: /,\s*[^\p{Pat_Syn}\p{Pat_WS}]+\s*/u,
            value: src => src.substring(1).trim()
          },
          end: {
            match: '}',
            pop: 1
          }
        },
        select: {
          offset: {
            lineBreaks: true,
            match: /\s*offset\s*:\s*\d+\s*/u,
            value: src => src.split(':')[1].trim()
          },
          case: {
            lineBreaks: true,
            match: /\s*(?:=\d+|[^\p{Pat_Syn}\p{Pat_WS}]+)\s*\{/u,
            push: 'body',
            value: src => src.substring(0, src.indexOf('{')).trim()
          },
          end: {
            match: /\s*\}/u,
            pop: 1
          }
        }
      };
      exports.lexer = moo_1.default.states(exports.states);
    })(lexer);

    /**
     * An AST parser for ICU MessageFormat strings
     *
     * @packageDocumentation
     * @example
     * ```
     * import { parse } from '@messageformat/parser
     *
     * parse('So {wow}.')
     * [ { type: 'content', value: 'So ' },
     *   { type: 'argument', arg: 'wow' },
     *   { type: 'content', value: '.' } ]
     *
     *
     * parse('Such { thing }. { count, selectordinal, one {First} two {Second}' +
     *       '                  few {Third} other {#th} } word.')
     * [ { type: 'content', value: 'Such ' },
     *   { type: 'argument', arg: 'thing' },
     *   { type: 'content', value: '. ' },
     *   { type: 'selectordinal',
     *     arg: 'count',
     *     cases: [
     *       { key: 'one', tokens: [ { type: 'content', value: 'First' } ] },
     *       { key: 'two', tokens: [ { type: 'content', value: 'Second' } ] },
     *       { key: 'few', tokens: [ { type: 'content', value: 'Third' } ] },
     *       { key: 'other',
     *         tokens: [ { type: 'octothorpe' }, { type: 'content', value: 'th' } ] }
     *     ] },
     *   { type: 'content', value: ' word.' } ]
     *
     *
     * parse('Many{type,select,plural{ numbers}selectordinal{ counting}' +
     *                          'select{ choices}other{ some {type}}}.')
     * [ { type: 'content', value: 'Many' },
     *   { type: 'select',
     *     arg: 'type',
     *     cases: [
     *       { key: 'plural', tokens: [ { type: 'content', value: 'numbers' } ] },
     *       { key: 'selectordinal', tokens: [ { type: 'content', value: 'counting' } ] },
     *       { key: 'select', tokens: [ { type: 'content', value: 'choices' } ] },
     *       { key: 'other',
     *         tokens: [ { type: 'content', value: 'some ' }, { type: 'argument', arg: 'type' } ] }
     *     ] },
     *   { type: 'content', value: '.' } ]
     *
     *
     * parse('{Such compliance')
     * // ParseError: invalid syntax at line 1 col 7:
     * //
     * //  {Such compliance
     * //        ^
     *
     *
     * const msg = '{words, plural, zero{No words} one{One word} other{# words}}'
     * parse(msg)
     * [ { type: 'plural',
     *     arg: 'words',
     *     cases: [
     *       { key: 'zero', tokens: [ { type: 'content', value: 'No words' } ] },
     *       { key: 'one', tokens: [ { type: 'content', value: 'One word' } ] },
     *       { key: 'other',
     *         tokens: [ { type: 'octothorpe' }, { type: 'content', value: ' words' } ] }
     *     ] } ]
     *
     *
     * parse(msg, { cardinal: [ 'one', 'other' ], ordinal: [ 'one', 'two', 'few', 'other' ] })
     * // ParseError: The plural case zero is not valid in this locale at line 1 col 17:
     * //
     * //   {words, plural, zero{
     * //                   ^
     * ```
     */
    Object.defineProperty(parser, "__esModule", {
      value: true
    });
    var parse_1 = parser.parse = parser.ParseError = void 0;
    const lexer_js_1 = lexer;
    const getContext = lt => ({
      offset: lt.offset,
      line: lt.line,
      col: lt.col,
      text: lt.text,
      lineBreaks: lt.lineBreaks
    });
    const isSelectType = type => type === 'plural' || type === 'select' || type === 'selectordinal';
    function strictArgStyleParam(lt, param) {
      let value = '';
      let text = '';
      for (const p of param) {
        const pText = p.ctx.text;
        text += pText;
        switch (p.type) {
          case 'content':
            value += p.value;
            break;
          case 'argument':
          case 'function':
          case 'octothorpe':
            value += pText;
            break;
          default:
            throw new ParseError(lt, `Unsupported part in strict mode function arg style: ${pText}`);
        }
      }
      const c = {
        type: 'content',
        value: value.trim(),
        ctx: Object.assign({}, param[0].ctx, {
          text
        })
      };
      return [c];
    }
    const strictArgTypes = ['number', 'date', 'time', 'spellout', 'ordinal', 'duration'];
    const defaultPluralKeys = ['zero', 'one', 'two', 'few', 'many', 'other'];
    /**
     * Thrown by {@link parse} on error
     *
     * @public
     */
    class ParseError extends Error {
      /** @internal */
      constructor(lt, msg) {
        super(lexer_js_1.lexer.formatError(lt, msg));
      }
    }
    parser.ParseError = ParseError;
    class Parser {
      constructor(src, opt) {
        var _a, _b, _c, _d;
        this.lexer = lexer_js_1.lexer.reset(src);
        this.cardinalKeys = (_a = opt === null || opt === void 0 ? void 0 : opt.cardinal) !== null && _a !== void 0 ? _a : defaultPluralKeys;
        this.ordinalKeys = (_b = opt === null || opt === void 0 ? void 0 : opt.ordinal) !== null && _b !== void 0 ? _b : defaultPluralKeys;
        this.strict = (_c = opt === null || opt === void 0 ? void 0 : opt.strict) !== null && _c !== void 0 ? _c : false;
        this.strictPluralKeys = (_d = opt === null || opt === void 0 ? void 0 : opt.strictPluralKeys) !== null && _d !== void 0 ? _d : true;
      }
      parse() {
        return this.parseBody(false, true);
      }
      checkSelectKey(lt, type, key) {
        if (key[0] === '=') {
          if (type === 'select') throw new ParseError(lt, `The case ${key} is not valid with select`);
        } else if (type !== 'select') {
          const keys = type === 'plural' ? this.cardinalKeys : this.ordinalKeys;
          if (this.strictPluralKeys && keys.length > 0 && !keys.includes(key)) {
            const msg = `The ${type} case ${key} is not valid in this locale`;
            throw new ParseError(lt, msg);
          }
        }
      }
      parseSelect(_ref, inPlural, ctx, type) {
        let {
          value: arg
        } = _ref;
        const sel = {
          type,
          arg,
          cases: [],
          ctx
        };
        if (type === 'plural' || type === 'selectordinal') inPlural = true;else if (this.strict) inPlural = false;
        for (const lt of this.lexer) {
          switch (lt.type) {
            case 'offset':
              if (type === 'select') throw new ParseError(lt, 'Unexpected plural offset for select');
              if (sel.cases.length > 0) throw new ParseError(lt, 'Plural offset must be set before cases');
              sel.pluralOffset = Number(lt.value);
              ctx.text += lt.text;
              ctx.lineBreaks += lt.lineBreaks;
              break;
            case 'case':
              {
                this.checkSelectKey(lt, type, lt.value);
                sel.cases.push({
                  key: lt.value,
                  tokens: this.parseBody(inPlural),
                  ctx: getContext(lt)
                });
                break;
              }
            case 'end':
              return sel;
            /* istanbul ignore next: never happens */
            default:
              throw new ParseError(lt, `Unexpected lexer token: ${lt.type}`);
          }
        }
        throw new ParseError(null, 'Unexpected message end');
      }
      parseArgToken(lt, inPlural) {
        const ctx = getContext(lt);
        const argType = this.lexer.next();
        if (!argType) throw new ParseError(null, 'Unexpected message end');
        ctx.text += argType.text;
        ctx.lineBreaks += argType.lineBreaks;
        if (this.strict && (argType.type === 'func-simple' || argType.type === 'func-args') && !strictArgTypes.includes(argType.value)) {
          const msg = `Invalid strict mode function arg type: ${argType.value}`;
          throw new ParseError(lt, msg);
        }
        switch (argType.type) {
          case 'end':
            return {
              type: 'argument',
              arg: lt.value,
              ctx
            };
          case 'func-simple':
            {
              const end = this.lexer.next();
              if (!end) throw new ParseError(null, 'Unexpected message end');
              /* istanbul ignore if: never happens */
              if (end.type !== 'end') throw new ParseError(end, `Unexpected lexer token: ${end.type}`);
              ctx.text += end.text;
              if (isSelectType(argType.value.toLowerCase())) throw new ParseError(argType, `Invalid type identifier: ${argType.value}`);
              return {
                type: 'function',
                arg: lt.value,
                key: argType.value,
                ctx
              };
            }
          case 'func-args':
            {
              if (isSelectType(argType.value.toLowerCase())) {
                const msg = `Invalid type identifier: ${argType.value}`;
                throw new ParseError(argType, msg);
              }
              let param = this.parseBody(this.strict ? false : inPlural);
              if (this.strict && param.length > 0) param = strictArgStyleParam(lt, param);
              return {
                type: 'function',
                arg: lt.value,
                key: argType.value,
                param,
                ctx
              };
            }
          case 'select':
            /* istanbul ignore else: never happens */
            if (isSelectType(argType.value)) return this.parseSelect(lt, inPlural, ctx, argType.value);else throw new ParseError(argType, `Unexpected select type ${argType.value}`);
          /* istanbul ignore next: never happens */
          default:
            throw new ParseError(argType, `Unexpected lexer token: ${argType.type}`);
        }
      }
      parseBody(inPlural, atRoot) {
        const tokens = [];
        let content = null;
        for (const lt of this.lexer) {
          if (lt.type === 'argument') {
            if (content) content = null;
            tokens.push(this.parseArgToken(lt, inPlural));
          } else if (lt.type === 'octothorpe' && inPlural) {
            if (content) content = null;
            tokens.push({
              type: 'octothorpe',
              ctx: getContext(lt)
            });
          } else if (lt.type === 'end' && !atRoot) {
            return tokens;
          } else {
            let value = lt.value;
            if (!inPlural && lt.type === 'quoted' && value[0] === '#') {
              if (value.includes('{')) {
                const errMsg = `Unsupported escape pattern: ${value}`;
                throw new ParseError(lt, errMsg);
              }
              value = lt.text;
            }
            if (content) {
              content.value += value;
              content.ctx.text += lt.text;
              content.ctx.lineBreaks += lt.lineBreaks;
            } else {
              content = {
                type: 'content',
                value,
                ctx: getContext(lt)
              };
              tokens.push(content);
            }
          }
        }
        if (atRoot) return tokens;
        throw new ParseError(null, 'Unexpected message end');
      }
    }
    /**
     * Parse an input string into an array of tokens
     *
     * @public
     * @remarks
     * The parser only supports the default `DOUBLE_OPTIONAL`
     * {@link http://www.icu-project.org/apiref/icu4c/messagepattern_8h.html#af6e0757e0eb81c980b01ee5d68a9978b | apostrophe mode}.
     */
    function parse(src) {
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      const parser = new Parser(src, options);
      return parser.parse();
    }
    parse_1 = parser.parse = parse;

    /**
     * A set of utility functions that are called by the compiled Javascript
     * functions, these are included locally in the output of {@link MessageFormat.compile compile()}.
     */
    /** @private */
    function _nf$1(lc) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return _nf$1[lc] || (_nf$1[lc] = new Intl.NumberFormat(lc));
    }
    /**
     * Utility function for `#` in plural rules
     *
     * @param lc The current locale
     * @param value The value to operate on
     * @param offset An offset, set by the surrounding context
     * @returns The result of applying the offset to the input value
     */
    function number(lc, value, offset) {
      return _nf$1(lc).format(value - offset);
    }
    /**
     * Strict utility function for `#` in plural rules
     *
     * Will throw an Error if `value` or `offset` are non-numeric.
     *
     * @param lc The current locale
     * @param value The value to operate on
     * @param offset An offset, set by the surrounding context
     * @param name The name of the argument, used for error reporting
     * @returns The result of applying the offset to the input value
     */
    function strictNumber(lc, value, offset, name) {
      var n = value - offset;
      if (isNaN(n)) throw new Error('`' + name + '` or its offset is not a number');
      return _nf$1(lc).format(n);
    }
    /**
     * Utility function for `{N, plural|selectordinal, ...}`
     *
     * @param value The key to use to find a pluralization rule
     * @param offset An offset to apply to `value`
     * @param lcfunc A locale function from `pluralFuncs`
     * @param data The object from which results are looked up
     * @param isOrdinal If true, use ordinal rather than cardinal rules
     * @returns The result of the pluralization
     */
    function plural(value, offset, lcfunc, data, isOrdinal) {
      if ({}.hasOwnProperty.call(data, value)) return data[value];
      if (offset) value -= offset;
      var key = lcfunc(value, isOrdinal);
      return key in data ? data[key] : data.other;
    }
    /**
     * Utility function for `{N, select, ...}`
     *
     * @param value The key to use to find a selection
     * @param data The object from which results are looked up
     * @returns The result of the select statement
     */
    function select(value, data) {
      return {}.hasOwnProperty.call(data, value) ? data[value] : data.other;
    }
    /**
     * Checks that all required arguments are set to defined values
     *
     * Throws on failure; otherwise returns undefined
     *
     * @param keys The required keys
     * @param data The data object being checked
     */
    function reqArgs(keys, data) {
      for (var i = 0; i < keys.length; ++i) if (!data || data[keys[i]] === undefined) throw new Error("Message requires argument '".concat(keys[i], "'"));
    }

    var Runtime = /*#__PURE__*/Object.freeze({
        __proto__: null,
        _nf: _nf$1,
        number: number,
        plural: plural,
        reqArgs: reqArgs,
        select: select,
        strictNumber: strictNumber
    });

    /**
     * Represent a date as a short/default/long/full string
     *
     * @param value Either a Unix epoch time in milliseconds, or a string value
     *   representing a date. Parsed with `new Date(value)`
     *
     * @example
     * ```js
     * var mf = new MessageFormat(['en', 'fi']);
     *
     * mf.compile('Today is {T, date}')({ T: Date.now() })
     * // 'Today is Feb 21, 2016'
     *
     * mf.compile('Tänään on {T, date}', 'fi')({ T: Date.now() })
     * // 'Tänään on 21. helmikuuta 2016'
     *
     * mf.compile('Unix time started on {T, date, full}')({ T: 0 })
     * // 'Unix time started on Thursday, January 1, 1970'
     *
     * var cf = mf.compile('{sys} became operational on {d0, date, short}');
     * cf({ sys: 'HAL 9000', d0: '12 January 1999' })
     * // 'HAL 9000 became operational on 1/12/1999'
     * ```
     */
    function date(value, lc, size) {
      var o = {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      };
      /* eslint-disable no-fallthrough */
      switch (size) {
        case 'full':
          o.weekday = 'long';
        case 'long':
          o.month = 'long';
          break;
        case 'short':
          o.month = 'numeric';
      }
      return new Date(value).toLocaleDateString(lc, o);
    }

    /**
     * Represent a duration in seconds as a string
     *
     * @param value A finite number, or its string representation
     * @return Includes one or two `:` separators, and matches the pattern
     *   `hhhh:mm:ss`, possibly with a leading `-` for negative values and a
     *   trailing `.sss` part for non-integer input
     *
     * @example
     * ```js
     * var mf = new MessageFormat();
     *
     * mf.compile('It has been {D, duration}')({ D: 123 })
     * // 'It has been 2:03'
     *
     * mf.compile('Countdown: {D, duration}')({ D: -151200.42 })
     * // 'Countdown: -42:00:00.420'
     * ```
     */
    function duration(value) {
      if (typeof value !== 'number') value = Number(value);
      if (!isFinite(value)) return String(value);
      var sign = '';
      if (value < 0) {
        sign = '-';
        value = Math.abs(value);
      } else {
        value = Number(value);
      }
      var sec = value % 60;
      var parts = [Math.round(sec) === sec ? sec : sec.toFixed(3)];
      if (value < 60) {
        parts.unshift(0); // at least one : is required
      } else {
        value = Math.round((value - Number(parts[0])) / 60);
        parts.unshift(value % 60); // minutes
        if (value >= 60) {
          value = Math.round((value - Number(parts[0])) / 60);
          parts.unshift(value); // hours
        }
      }

      var first = parts.shift();
      return sign + first + ':' + parts.map(function (n) {
        return Number(n) < 10 ? '0' + String(n) : String(n);
      }).join(':');
    }

    /**
     * Represent a number as an integer, percent or currency value
     *
     * Available in MessageFormat strings as `{VAR, number, integer|percent|currency}`.
     * Internally, calls Intl.NumberFormat with appropriate parameters. `currency` will
     * default to USD; to change, set `MessageFormat#currency` to the appropriate
     * three-letter currency code, or use the `currency:EUR` form of the argument.
     *
     * @example
     * ```js
     * var mf = new MessageFormat('en', { currency: 'EUR'});
     *
     * mf.compile('{N} is almost {N, number, integer}')({ N: 3.14 })
     * // '3.14 is almost 3'
     *
     * mf.compile('{P, number, percent} complete')({ P: 0.99 })
     * // '99% complete'
     *
     * mf.compile('The total is {V, number, currency}.')({ V: 5.5 })
     * // 'The total is €5.50.'
     *
     * mf.compile('The total is {V, number, currency:GBP}.')({ V: 5.5 })
     * // 'The total is £5.50.'
     * ```
     */
    var _nf = {};
    function nf(lc, opt) {
      var key = String(lc) + JSON.stringify(opt);
      if (!_nf[key]) _nf[key] = new Intl.NumberFormat(lc, opt);
      return _nf[key];
    }
    function numberFmt(value, lc, arg, defaultCurrency) {
      var _a = arg && arg.split(':') || [],
        type = _a[0],
        currency = _a[1];
      var opt = {
        integer: {
          maximumFractionDigits: 0
        },
        percent: {
          style: 'percent'
        },
        currency: {
          style: 'currency',
          currency: currency && currency.trim() || defaultCurrency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      };
      return nf(lc, opt[type] || {}).format(value);
    }
    var numberCurrency = function (value, lc, arg) {
      return nf(lc, {
        style: 'currency',
        currency: arg,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    };
    var numberInteger = function (value, lc) {
      return nf(lc, {
        maximumFractionDigits: 0
      }).format(value);
    };
    var numberPercent = function (value, lc) {
      return nf(lc, {
        style: 'percent'
      }).format(value);
    };

    /**
     * Represent a time as a short/default/long string
     *
     * @param value Either a Unix epoch time in milliseconds, or a string value
     *   representing a date. Parsed with `new Date(value)`
     *
     * @example
     * ```js
     * var mf = new MessageFormat(['en', 'fi']);
     *
     * mf.compile('The time is now {T, time}')({ T: Date.now() })
     * // 'The time is now 11:26:35 PM'
     *
     * mf.compile('Kello on nyt {T, time}', 'fi')({ T: Date.now() })
     * // 'Kello on nyt 23.26.35'
     *
     * var cf = mf.compile('The Eagle landed at {T, time, full} on {T, date, full}');
     * cf({ T: '1969-07-20 20:17:40 UTC' })
     * // 'The Eagle landed at 10:17:40 PM GMT+2 on Sunday, July 20, 1969'
     * ```
     */
    function time(value, lc, size) {
      var o = {
        second: 'numeric',
        minute: 'numeric',
        hour: 'numeric'
      };
      /* eslint-disable no-fallthrough */
      switch (size) {
        case 'full':
        case 'long':
          o.timeZoneName = 'short';
          break;
        case 'short':
          delete o.second;
      }
      return new Date(value).toLocaleTimeString(lc, o);
    }

    var Formatters = /*#__PURE__*/Object.freeze({
        __proto__: null,
        date: date,
        duration: duration,
        numberCurrency: numberCurrency,
        numberFmt: numberFmt,
        numberInteger: numberInteger,
        numberPercent: numberPercent,
        time: time
    });

    const ES3 = {
      break: true,
      continue: true,
      delete: true,
      else: true,
      for: true,
      function: true,
      if: true,
      in: true,
      new: true,
      return: true,
      this: true,
      typeof: true,
      var: true,
      void: true,
      while: true,
      with: true,
      case: true,
      catch: true,
      default: true,
      do: true,
      finally: true,
      instanceof: true,
      switch: true,
      throw: true,
      try: true
    };
    const ESnext = {
      // in addition to reservedES3
      await: true,
      debugger: true,
      class: true,
      enum: true,
      extends: true,
      super: true,
      const: true,
      export: true,
      import: true,
      null: true,
      true: true,
      false: true,
      implements: true,
      let: true,
      private: true,
      public: true,
      yield: true,
      interface: true,
      package: true,
      protected: true,
      static: true
    };
    var reserved = {
      ES3,
      ESnext
    };
    var reserved$1 = /*@__PURE__*/getDefaultExportFromCjs(reserved);

    // from https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    function hashCode(str) {
      let hash = 0;
      for (let i = 0; i < str.length; ++i) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
      }

      return hash;
    }
    function identifier(key, unique) {
      if (unique) key += ' ' + hashCode(key).toString(36);
      const id = key.trim().replace(/\W+/g, '_');
      return reserved$1.ES3[id] || reserved$1.ESnext[id] || /^\d/.test(id) ? '_' + id : id;
    }
    function property(obj, key) {
      if (/^[A-Z_$][0-9A-Z_$]*$/i.test(key) && !reserved$1.ES3[key]) {
        return obj ? obj + '.' + key : key;
      } else {
        const jkey = JSON.stringify(key);
        return obj ? obj + '[' + jkey + ']' : jkey;
      }
    }

    var rtlLanguages = [
        'ar',
        'ckb',
        'fa',
        'he',
        'ks($|[^bfh])',
        'lrc',
        'mzn',
        'pa-Arab',
        'ps',
        'ug',
        'ur',
        'uz-Arab',
        'yi'
    ];
    var rtlRegExp = new RegExp('^' + rtlLanguages.join('|^'));
    function biDiMarkText(text, locale) {
        var isLocaleRTL = rtlRegExp.test(locale);
        var mark = JSON.stringify(isLocaleRTL ? '\u200F' : '\u200E');
        return "".concat(mark, " + ").concat(text, " + ").concat(mark);
    }

    var RUNTIME_MODULE = '@messageformat/runtime';
    var CARDINAL_MODULE = '@messageformat/runtime/lib/cardinals';
    var PLURAL_MODULE = '@messageformat/runtime/lib/plurals';
    var FORMATTER_MODULE = '@messageformat/runtime/lib/formatters';
    var Compiler = (function () {
        function Compiler(options) {
            this.arguments = [];
            this.runtime = {};
            this.options = options;
        }
        Compiler.prototype.compile = function (src, plural, plurals) {
            var e_1, _a;
            var _this = this;
            var _b = this.options, localeCodeFromKey = _b.localeCodeFromKey, requireAllArguments = _b.requireAllArguments, strict = _b.strict, strictPluralKeys = _b.strictPluralKeys;
            if (typeof src === 'object') {
                var result = {};
                try {
                    for (var _c = __values(Object.keys(src)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var key = _d.value;
                        var lc = localeCodeFromKey ? localeCodeFromKey(key) : key;
                        var pl = (plurals && lc && plurals[lc]) || plural;
                        result[key] = this.compile(src[key], pl, plurals);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return result;
            }
            this.plural = plural;
            var parserOptions = {
                cardinal: plural.cardinals,
                ordinal: plural.ordinals,
                strict: strict,
                strictPluralKeys: strictPluralKeys
            };
            this.arguments = [];
            var r = parse_1(src, parserOptions).map(function (token) { return _this.token(token, null); });
            var hasArgs = this.arguments.length > 0;
            var res = this.concatenate(r, true);
            if (requireAllArguments && hasArgs) {
                this.setRuntimeFn('reqArgs');
                var reqArgs = JSON.stringify(this.arguments);
                return "(d) => { reqArgs(".concat(reqArgs, ", d); return ").concat(res, "; }");
            }
            return "(".concat(hasArgs ? 'd' : '', ") => ").concat(res);
        };
        Compiler.prototype.cases = function (token, pluralToken) {
            var _this = this;
            var needOther = true;
            var r = token.cases.map(function (_a) {
                var key = _a.key, tokens = _a.tokens;
                if (key === 'other')
                    needOther = false;
                var s = tokens.map(function (tok) { return _this.token(tok, pluralToken); });
                return "".concat(property(null, key.replace(/^=/, '')), ": ").concat(_this.concatenate(s, false));
            });
            if (needOther) {
                var type = token.type;
                var _a = this.plural, cardinals = _a.cardinals, ordinals = _a.ordinals;
                if (type === 'select' ||
                    (type === 'plural' && cardinals.includes('other')) ||
                    (type === 'selectordinal' && ordinals.includes('other')))
                    throw new Error("No 'other' form found in ".concat(JSON.stringify(token)));
            }
            return "{ ".concat(r.join(', '), " }");
        };
        Compiler.prototype.concatenate = function (tokens, root) {
            var asValues = this.options.returnType === 'values';
            return asValues && (root || tokens.length > 1)
                ? '[' + tokens.join(', ') + ']'
                : tokens.join(' + ') || '""';
        };
        Compiler.prototype.token = function (token, pluralToken) {
            if (token.type === 'content')
                return JSON.stringify(token.value);
            var _a = this.plural, id = _a.id, lc = _a.lc;
            var args, fn;
            if ('arg' in token) {
                this.arguments.push(token.arg);
                args = [property('d', token.arg)];
            }
            else
                args = [];
            switch (token.type) {
                case 'argument':
                    return this.options.biDiSupport
                        ? biDiMarkText(String(args[0]), lc)
                        : String(args[0]);
                case 'select':
                    fn = 'select';
                    if (pluralToken && this.options.strict)
                        pluralToken = null;
                    args.push(this.cases(token, pluralToken));
                    this.setRuntimeFn('select');
                    break;
                case 'selectordinal':
                    fn = 'plural';
                    args.push(token.pluralOffset || 0, id, this.cases(token, token), 1);
                    this.setLocale(id, true);
                    this.setRuntimeFn('plural');
                    break;
                case 'plural':
                    fn = 'plural';
                    args.push(token.pluralOffset || 0, id, this.cases(token, token));
                    this.setLocale(id, false);
                    this.setRuntimeFn('plural');
                    break;
                case 'function': {
                    var formatter = this.options.customFormatters[token.key];
                    var isModuleFn = formatter &&
                        'module' in formatter &&
                        typeof formatter.module === 'function';
                    if (!formatter) {
                        if (token.key === 'date') {
                            fn = this.setDateFormatter(token, args, pluralToken);
                            break;
                        }
                        else if (token.key === 'number') {
                            fn = this.setNumberFormatter(token, args, pluralToken);
                            break;
                        }
                    }
                    args.push(JSON.stringify(this.plural.locale));
                    if (token.param) {
                        if (pluralToken && this.options.strict)
                            pluralToken = null;
                        var arg = this.getFormatterArg(token, pluralToken);
                        if (arg)
                            args.push(arg);
                    }
                    fn = isModuleFn
                        ? identifier("".concat(token.key, "__").concat(this.plural.locale))
                        : token.key;
                    this.setFormatter(fn, token.key);
                    break;
                }
                case 'octothorpe':
                    if (!pluralToken)
                        return '"#"';
                    args = [
                        JSON.stringify(this.plural.locale),
                        property('d', pluralToken.arg),
                        pluralToken.pluralOffset || 0
                    ];
                    if (this.options.strict) {
                        fn = 'strictNumber';
                        args.push(JSON.stringify(pluralToken.arg));
                        this.setRuntimeFn('strictNumber');
                    }
                    else {
                        fn = 'number';
                        this.setRuntimeFn('number');
                    }
                    break;
            }
            if (!fn)
                throw new Error('Parser error for token ' + JSON.stringify(token));
            return "".concat(fn, "(").concat(args.join(', '), ")");
        };
        Compiler.prototype.runtimeIncludes = function (key, type) {
            if (identifier(key) !== key)
                throw new SyntaxError("Reserved word used as ".concat(type, " identifier: ").concat(key));
            var prev = this.runtime[key];
            if (!prev || prev.type === type)
                return prev;
            throw new TypeError("Cannot override ".concat(prev.type, " runtime function as ").concat(type, ": ").concat(key));
        };
        Compiler.prototype.setLocale = function (key, ord) {
            var prev = this.runtimeIncludes(key, 'locale');
            var _a = this.plural, getCardinal = _a.getCardinal, getPlural = _a.getPlural, isDefault = _a.isDefault;
            var pf, module, toString;
            if (!ord && isDefault && getCardinal) {
                if (prev)
                    return;
                pf = function (n) { return getCardinal(n); };
                module = CARDINAL_MODULE;
                toString = function () { return String(getCardinal); };
            }
            else {
                if (prev && (!isDefault || prev.module === PLURAL_MODULE))
                    return;
                pf = function (n, ord) { return getPlural(n, ord); };
                module = isDefault ? PLURAL_MODULE : getPlural.module || null;
                toString = function () { return String(getPlural); };
            }
            this.runtime[key] = Object.assign(pf, {
                id: key,
                module: module,
                toString: toString,
                type: 'locale'
            });
        };
        Compiler.prototype.setRuntimeFn = function (key) {
            if (this.runtimeIncludes(key, 'runtime'))
                return;
            this.runtime[key] = Object.assign(Runtime[key], {
                id: key,
                module: RUNTIME_MODULE,
                type: 'runtime'
            });
        };
        Compiler.prototype.getFormatterArg = function (_a, pluralToken) {
            var e_2, _b, e_3, _c;
            var _this = this;
            var key = _a.key, param = _a.param;
            var fmt = this.options.customFormatters[key] ||
                (isFormatterKey(key) && Formatters[key]);
            if (!fmt || !param)
                return null;
            var argShape = ('arg' in fmt && fmt.arg) || 'string';
            if (argShape === 'options') {
                var value = '';
                try {
                    for (var param_1 = __values(param), param_1_1 = param_1.next(); !param_1_1.done; param_1_1 = param_1.next()) {
                        var tok = param_1_1.value;
                        if (tok.type === 'content')
                            value += tok.value;
                        else
                            throw new SyntaxError("Expected literal options for ".concat(key, " formatter"));
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (param_1_1 && !param_1_1.done && (_b = param_1.return)) _b.call(param_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                var options = {};
                try {
                    for (var _d = __values(value.split(',')), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var pair = _e.value;
                        var keyEnd = pair.indexOf(':');
                        if (keyEnd === -1)
                            options[pair.trim()] = null;
                        else {
                            var k = pair.substring(0, keyEnd).trim();
                            var v = pair.substring(keyEnd + 1).trim();
                            if (v === 'true')
                                options[k] = true;
                            else if (v === 'false')
                                options[k] = false;
                            else if (v === 'null')
                                options[k] = null;
                            else {
                                var n = Number(v);
                                options[k] = Number.isFinite(n) ? n : v;
                            }
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_c = _d.return)) _c.call(_d);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                return JSON.stringify(options);
            }
            else {
                var parts = param.map(function (tok) { return _this.token(tok, pluralToken); });
                if (argShape === 'raw')
                    return "[".concat(parts.join(', '), "]");
                var s = parts.join(' + ');
                return s ? "(".concat(s, ").trim()") : '""';
            }
        };
        Compiler.prototype.setFormatter = function (key, parentKey) {
            if (this.runtimeIncludes(key, 'formatter'))
                return;
            var cf = this.options.customFormatters[parentKey || key];
            if (cf) {
                var cfo_1 = typeof cf === 'function' ? { formatter: cf } : cf;
                this.runtime[key] = Object.assign(cfo_1.formatter.bind({}), __assign(__assign({}, cfo_1.formatter.prototype), { toString: function () { return String(cfo_1.formatter); } }), { type: 'formatter' }, 'module' in cf && cf.module && cf.id
                    ? {
                        id: identifier(cf.id),
                        module: typeof cf.module === 'function'
                            ? cf.module(this.plural.locale)
                            : cf.module
                    }
                    : { id: null, module: null });
            }
            else if (isFormatterKey(key)) {
                this.runtime[key] = Object.assign(Formatters[key], { type: 'formatter' }, { id: key, module: FORMATTER_MODULE });
            }
            else {
                throw new Error("Formatting function not found: ".concat(key));
            }
        };
        Compiler.prototype.setDateFormatter = function (_a, args, plural) {
            var _this = this;
            var param = _a.param;
            var locale = this.plural.locale;
            var argStyle = param && param.length === 1 && param[0];
            if (argStyle &&
                argStyle.type === 'content' &&
                /^\s*::/.test(argStyle.value)) {
                var argSkeletonText_1 = argStyle.value.trim().substr(2);
                var key = identifier("date_".concat(locale, "_").concat(argSkeletonText_1), true);
                if (!this.runtimeIncludes(key, 'formatter')) {
                    var fmt = getDateFormatter(locale, argSkeletonText_1);
                    this.runtime[key] = Object.assign(fmt, {
                        id: key,
                        module: null,
                        toString: function () { return getDateFormatterSource(locale, argSkeletonText_1); },
                        type: 'formatter'
                    });
                }
                return key;
            }
            args.push(JSON.stringify(locale));
            if (param && param.length > 0) {
                if (plural && this.options.strict)
                    plural = null;
                var s = param.map(function (tok) { return _this.token(tok, plural); });
                args.push('(' + (s.join(' + ') || '""') + ').trim()');
            }
            this.setFormatter('date');
            return 'date';
        };
        Compiler.prototype.setNumberFormatter = function (_a, args, plural) {
            var _this = this;
            var param = _a.param;
            var locale = this.plural.locale;
            if (!param || param.length === 0) {
                args.unshift(JSON.stringify(locale));
                args.push('0');
                this.setRuntimeFn('number');
                return 'number';
            }
            args.push(JSON.stringify(locale));
            if (param.length === 1 && param[0].type === 'content') {
                var fmtArg_1 = param[0].value.trim();
                switch (fmtArg_1) {
                    case 'currency':
                        args.push(JSON.stringify(this.options.currency));
                        this.setFormatter('numberCurrency');
                        return 'numberCurrency';
                    case 'integer':
                        this.setFormatter('numberInteger');
                        return 'numberInteger';
                    case 'percent':
                        this.setFormatter('numberPercent');
                        return 'numberPercent';
                }
                var cm = fmtArg_1.match(/^currency:([A-Z]+)$/);
                if (cm) {
                    args.push(JSON.stringify(cm[1]));
                    this.setFormatter('numberCurrency');
                    return 'numberCurrency';
                }
                var key = identifier("number_".concat(locale, "_").concat(fmtArg_1), true);
                if (!this.runtimeIncludes(key, 'formatter')) {
                    var currency_1 = this.options.currency;
                    var fmt = getNumberFormatter(locale, fmtArg_1, currency_1);
                    this.runtime[key] = Object.assign(fmt, {
                        id: null,
                        module: null,
                        toString: function () { return getNumberFormatterSource(locale, fmtArg_1, currency_1); },
                        type: 'formatter'
                    });
                }
                return key;
            }
            if (plural && this.options.strict)
                plural = null;
            var s = param.map(function (tok) { return _this.token(tok, plural); });
            args.push('(' + (s.join(' + ') || '""') + ').trim()');
            args.push(JSON.stringify(this.options.currency));
            this.setFormatter('numberFmt');
            return 'numberFmt';
        };
        return Compiler;
    }());
    function isFormatterKey(key) {
        return key in Formatters;
    }

    const a$2 = n => n == 1 ? 'one' : 'other';
    const b$2 = n => n == 0 || n == 1 ? 'one' : 'other';
    const c$2 = n => n >= 0 && n <= 1 ? 'one' : 'other';
    const d$2 = n => {
      const s = String(n).split('.'),
        v0 = !s[1];
      return n == 1 && v0 ? 'one' : 'other';
    };
    const e$1 = n => 'other';
    const f$2 = n => n == 1 ? 'one' : n == 2 ? 'two' : 'other';
    const af$2 = a$2;
    const ak$2 = b$2;
    const am$2 = c$2;
    const an$2 = a$2;
    const ar$2 = n => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);
      return n == 0 ? 'zero' : n == 1 ? 'one' : n == 2 ? 'two' : n100 >= 3 && n100 <= 10 ? 'few' : n100 >= 11 && n100 <= 99 ? 'many' : 'other';
    };
    const ars$2 = n => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);
      return n == 0 ? 'zero' : n == 1 ? 'one' : n == 2 ? 'two' : n100 >= 3 && n100 <= 10 ? 'few' : n100 >= 11 && n100 <= 99 ? 'many' : 'other';
    };
    const as$2 = c$2;
    const asa$2 = a$2;
    const ast$2 = d$2;
    const az$2 = a$2;
    const bal$2 = a$2;
    const be$2 = n => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);
      return n10 == 1 && n100 != 11 ? 'one' : n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? 'few' : t0 && n10 == 0 || n10 >= 5 && n10 <= 9 || n100 >= 11 && n100 <= 14 ? 'many' : 'other';
    };
    const bem$2 = a$2;
    const bez$2 = a$2;
    const bg$2 = a$2;
    const bho$2 = b$2;
    const bm$2 = e$1;
    const bn$2 = c$2;
    const bo$2 = e$1;
    const br$2 = n => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2),
        n1000000 = t0 && s[0].slice(-6);
      return n10 == 1 && n100 != 11 && n100 != 71 && n100 != 91 ? 'one' : n10 == 2 && n100 != 12 && n100 != 72 && n100 != 92 ? 'two' : (n10 == 3 || n10 == 4 || n10 == 9) && (n100 < 10 || n100 > 19) && (n100 < 70 || n100 > 79) && (n100 < 90 || n100 > 99) ? 'few' : n != 0 && t0 && n1000000 == 0 ? 'many' : 'other';
    };
    const brx$2 = a$2;
    const bs$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);
      return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? 'few' : 'other';
    };
    const ca$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
      return n == 1 && v0 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
    };
    const ce$2 = a$2;
    const ceb$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        f10 = f.slice(-1);
      return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? 'one' : 'other';
    };
    const cgg$2 = a$2;
    const chr$2 = a$2;
    const ckb$2 = a$2;
    const cs$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1];
      return n == 1 && v0 ? 'one' : i >= 2 && i <= 4 && v0 ? 'few' : !v0 ? 'many' : 'other';
    };
    const cy$2 = n => n == 0 ? 'zero' : n == 1 ? 'one' : n == 2 ? 'two' : n == 3 ? 'few' : n == 6 ? 'many' : 'other';
    const da$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        t0 = Number(s[0]) == n;
      return n == 1 || !t0 && (i == 0 || i == 1) ? 'one' : 'other';
    };
    const de$2 = d$2;
    const doi$2 = c$2;
    const dsb$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i100 = i.slice(-2),
        f100 = f.slice(-2);
      return v0 && i100 == 1 || f100 == 1 ? 'one' : v0 && i100 == 2 || f100 == 2 ? 'two' : v0 && (i100 == 3 || i100 == 4) || f100 == 3 || f100 == 4 ? 'few' : 'other';
    };
    const dv$2 = a$2;
    const dz$2 = e$1;
    const ee$2 = a$2;
    const el$2 = a$2;
    const en$2 = d$2;
    const eo$2 = a$2;
    const es$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
      return n == 1 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
    };
    const et$2 = d$2;
    const eu$2 = a$2;
    const fa$2 = c$2;
    const ff$2 = n => n >= 0 && n < 2 ? 'one' : 'other';
    const fi$2 = d$2;
    const fil$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        f10 = f.slice(-1);
      return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? 'one' : 'other';
    };
    const fo$2 = a$2;
    const fr$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
      return n >= 0 && n < 2 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
    };
    const fur$2 = a$2;
    const fy$2 = d$2;
    const ga$2 = n => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n;
      return n == 1 ? 'one' : n == 2 ? 'two' : t0 && n >= 3 && n <= 6 ? 'few' : t0 && n >= 7 && n <= 10 ? 'many' : 'other';
    };
    const gd$2 = n => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n;
      return n == 1 || n == 11 ? 'one' : n == 2 || n == 12 ? 'two' : t0 && n >= 3 && n <= 10 || t0 && n >= 13 && n <= 19 ? 'few' : 'other';
    };
    const gl$2 = d$2;
    const gsw$2 = a$2;
    const gu$2 = c$2;
    const guw$2 = b$2;
    const gv$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2);
      return v0 && i10 == 1 ? 'one' : v0 && i10 == 2 ? 'two' : v0 && (i100 == 0 || i100 == 20 || i100 == 40 || i100 == 60 || i100 == 80) ? 'few' : !v0 ? 'many' : 'other';
    };
    const ha$2 = a$2;
    const haw$2 = a$2;
    const he$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1];
      return i == 1 && v0 || i == 0 && !v0 ? 'one' : i == 2 && v0 ? 'two' : 'other';
    };
    const hi$2 = c$2;
    const hnj$2 = e$1;
    const hr$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);
      return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? 'few' : 'other';
    };
    const hsb$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i100 = i.slice(-2),
        f100 = f.slice(-2);
      return v0 && i100 == 1 || f100 == 1 ? 'one' : v0 && i100 == 2 || f100 == 2 ? 'two' : v0 && (i100 == 3 || i100 == 4) || f100 == 3 || f100 == 4 ? 'few' : 'other';
    };
    const hu$2 = a$2;
    const hy$2 = n => n >= 0 && n < 2 ? 'one' : 'other';
    const ia$2 = d$2;
    const id$2 = e$1;
    const ig$2 = e$1;
    const ii$2 = e$1;
    const io$2 = d$2;
    const is$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        t = (s[1] || '').replace(/0+$/, ''),
        t0 = Number(s[0]) == n,
        i10 = i.slice(-1),
        i100 = i.slice(-2);
      return t0 && i10 == 1 && i100 != 11 || t % 10 == 1 && t % 100 != 11 ? 'one' : 'other';
    };
    const it$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
      return n == 1 && v0 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
    };
    const iu$2 = f$2;
    const ja$2 = e$1;
    const jbo$2 = e$1;
    const jgo$2 = a$2;
    const jmc$2 = a$2;
    const jv$2 = e$1;
    const jw$2 = e$1;
    const ka$2 = a$2;
    const kab$2 = n => n >= 0 && n < 2 ? 'one' : 'other';
    const kaj$2 = a$2;
    const kcg$2 = a$2;
    const kde$2 = e$1;
    const kea$2 = e$1;
    const kk$2 = a$2;
    const kkj$2 = a$2;
    const kl$2 = a$2;
    const km$2 = e$1;
    const kn$2 = c$2;
    const ko$2 = e$1;
    const ks$2 = a$2;
    const ksb$2 = a$2;
    const ksh$2 = n => n == 0 ? 'zero' : n == 1 ? 'one' : 'other';
    const ku$2 = a$2;
    const kw$2 = n => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2),
        n1000 = t0 && s[0].slice(-3),
        n100000 = t0 && s[0].slice(-5),
        n1000000 = t0 && s[0].slice(-6);
      return n == 0 ? 'zero' : n == 1 ? 'one' : n100 == 2 || n100 == 22 || n100 == 42 || n100 == 62 || n100 == 82 || t0 && n1000 == 0 && (n100000 >= 1000 && n100000 <= 20000 || n100000 == 40000 || n100000 == 60000 || n100000 == 80000) || n != 0 && n1000000 == 100000 ? 'two' : n100 == 3 || n100 == 23 || n100 == 43 || n100 == 63 || n100 == 83 ? 'few' : n != 1 && (n100 == 1 || n100 == 21 || n100 == 41 || n100 == 61 || n100 == 81) ? 'many' : 'other';
    };
    const ky$2 = a$2;
    const lag$2 = n => {
      const s = String(n).split('.'),
        i = s[0];
      return n == 0 ? 'zero' : (i == 0 || i == 1) && n != 0 ? 'one' : 'other';
    };
    const lb$2 = a$2;
    const lg$2 = a$2;
    const lij$2 = d$2;
    const lkt$2 = e$1;
    const ln$2 = b$2;
    const lo$2 = e$1;
    const lt$2 = n => {
      const s = String(n).split('.'),
        f = s[1] || '',
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);
      return n10 == 1 && (n100 < 11 || n100 > 19) ? 'one' : n10 >= 2 && n10 <= 9 && (n100 < 11 || n100 > 19) ? 'few' : f != 0 ? 'many' : 'other';
    };
    const lv$2 = n => {
      const s = String(n).split('.'),
        f = s[1] || '',
        v = f.length,
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2),
        f100 = f.slice(-2),
        f10 = f.slice(-1);
      return t0 && n10 == 0 || n100 >= 11 && n100 <= 19 || v == 2 && f100 >= 11 && f100 <= 19 ? 'zero' : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? 'one' : 'other';
    };
    const mas$2 = a$2;
    const mg$2 = b$2;
    const mgo$2 = a$2;
    const mk$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);
      return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one' : 'other';
    };
    const ml$2 = a$2;
    const mn$2 = a$2;
    const mo$2 = n => {
      const s = String(n).split('.'),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);
      return n == 1 && v0 ? 'one' : !v0 || n == 0 || n != 1 && n100 >= 1 && n100 <= 19 ? 'few' : 'other';
    };
    const mr$2 = a$2;
    const ms$2 = e$1;
    const mt$2 = n => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);
      return n == 1 ? 'one' : n == 2 ? 'two' : n == 0 || n100 >= 3 && n100 <= 10 ? 'few' : n100 >= 11 && n100 <= 19 ? 'many' : 'other';
    };
    const my$2 = e$1;
    const nah$2 = a$2;
    const naq$2 = f$2;
    const nb$2 = a$2;
    const nd$2 = a$2;
    const ne$2 = a$2;
    const nl$2 = d$2;
    const nn$2 = a$2;
    const nnh$2 = a$2;
    const no$2 = a$2;
    const nqo$2 = e$1;
    const nr$2 = a$2;
    const nso$2 = b$2;
    const ny$2 = a$2;
    const nyn$2 = a$2;
    const om$2 = a$2;
    const or$2 = a$2;
    const os$2 = a$2;
    const osa$2 = e$1;
    const pa$2 = b$2;
    const pap$2 = a$2;
    const pcm$2 = c$2;
    const pl$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2);
      return n == 1 && v0 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? 'few' : v0 && i != 1 && (i10 == 0 || i10 == 1) || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 12 && i100 <= 14 ? 'many' : 'other';
    };
    const prg$2 = n => {
      const s = String(n).split('.'),
        f = s[1] || '',
        v = f.length,
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2),
        f100 = f.slice(-2),
        f10 = f.slice(-1);
      return t0 && n10 == 0 || n100 >= 11 && n100 <= 19 || v == 2 && f100 >= 11 && f100 <= 19 ? 'zero' : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? 'one' : 'other';
    };
    const ps$2 = a$2;
    const pt$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
      return i == 0 || i == 1 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
    };
    const pt_PT$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
      return n == 1 && v0 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
    };
    const rm$2 = a$2;
    const ro$2 = n => {
      const s = String(n).split('.'),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);
      return n == 1 && v0 ? 'one' : !v0 || n == 0 || n != 1 && n100 >= 1 && n100 <= 19 ? 'few' : 'other';
    };
    const rof$2 = a$2;
    const ru$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2);
      return v0 && i10 == 1 && i100 != 11 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? 'few' : v0 && i10 == 0 || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 11 && i100 <= 14 ? 'many' : 'other';
    };
    const rwk$2 = a$2;
    const sah$2 = e$1;
    const saq$2 = a$2;
    const sat$2 = f$2;
    const sc$2 = d$2;
    const scn$2 = d$2;
    const sd$2 = a$2;
    const sdh$2 = a$2;
    const se$2 = f$2;
    const seh$2 = a$2;
    const ses$2 = e$1;
    const sg$2 = e$1;
    const sh$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);
      return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? 'few' : 'other';
    };
    const shi$2 = n => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n;
      return n >= 0 && n <= 1 ? 'one' : t0 && n >= 2 && n <= 10 ? 'few' : 'other';
    };
    const si$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '';
      return n == 0 || n == 1 || i == 0 && f == 1 ? 'one' : 'other';
    };
    const sk$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1];
      return n == 1 && v0 ? 'one' : i >= 2 && i <= 4 && v0 ? 'few' : !v0 ? 'many' : 'other';
    };
    const sl$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i100 = i.slice(-2);
      return v0 && i100 == 1 ? 'one' : v0 && i100 == 2 ? 'two' : v0 && (i100 == 3 || i100 == 4) || !v0 ? 'few' : 'other';
    };
    const sma$2 = f$2;
    const smi$2 = f$2;
    const smj$2 = f$2;
    const smn$2 = f$2;
    const sms$2 = f$2;
    const sn$2 = a$2;
    const so$2 = a$2;
    const sq$2 = a$2;
    const sr$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);
      return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? 'few' : 'other';
    };
    const ss$2 = a$2;
    const ssy$2 = a$2;
    const st$2 = a$2;
    const su$2 = e$1;
    const sv$2 = d$2;
    const sw$2 = d$2;
    const syr$2 = a$2;
    const ta$2 = a$2;
    const te$2 = a$2;
    const teo$2 = a$2;
    const th$2 = e$1;
    const ti$2 = b$2;
    const tig$2 = a$2;
    const tk$2 = a$2;
    const tl$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        f10 = f.slice(-1);
      return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? 'one' : 'other';
    };
    const tn$2 = a$2;
    const to$2 = e$1;
    const tpi$2 = e$1;
    const tr$2 = a$2;
    const ts$2 = a$2;
    const tzm$2 = n => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n;
      return n == 0 || n == 1 || t0 && n >= 11 && n <= 99 ? 'one' : 'other';
    };
    const ug$2 = a$2;
    const uk$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2);
      return v0 && i10 == 1 && i100 != 11 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? 'few' : v0 && i10 == 0 || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 11 && i100 <= 14 ? 'many' : 'other';
    };
    const und$2 = e$1;
    const ur$2 = d$2;
    const uz$2 = a$2;
    const ve$2 = a$2;
    const vec$2 = n => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
      return n == 1 && v0 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
    };
    const vi$2 = e$1;
    const vo$2 = a$2;
    const vun$2 = a$2;
    const wa$2 = b$2;
    const wae$2 = a$2;
    const wo$2 = e$1;
    const xh$2 = a$2;
    const xog$2 = a$2;
    const yi$2 = d$2;
    const yo$2 = e$1;
    const yue$2 = e$1;
    const zh$2 = e$1;
    const zu$2 = c$2;

    var Cardinals = /*#__PURE__*/Object.freeze({
        __proto__: null,
        af: af$2,
        ak: ak$2,
        am: am$2,
        an: an$2,
        ar: ar$2,
        ars: ars$2,
        as: as$2,
        asa: asa$2,
        ast: ast$2,
        az: az$2,
        bal: bal$2,
        be: be$2,
        bem: bem$2,
        bez: bez$2,
        bg: bg$2,
        bho: bho$2,
        bm: bm$2,
        bn: bn$2,
        bo: bo$2,
        br: br$2,
        brx: brx$2,
        bs: bs$2,
        ca: ca$2,
        ce: ce$2,
        ceb: ceb$2,
        cgg: cgg$2,
        chr: chr$2,
        ckb: ckb$2,
        cs: cs$2,
        cy: cy$2,
        da: da$2,
        de: de$2,
        doi: doi$2,
        dsb: dsb$2,
        dv: dv$2,
        dz: dz$2,
        ee: ee$2,
        el: el$2,
        en: en$2,
        eo: eo$2,
        es: es$2,
        et: et$2,
        eu: eu$2,
        fa: fa$2,
        ff: ff$2,
        fi: fi$2,
        fil: fil$2,
        fo: fo$2,
        fr: fr$2,
        fur: fur$2,
        fy: fy$2,
        ga: ga$2,
        gd: gd$2,
        gl: gl$2,
        gsw: gsw$2,
        gu: gu$2,
        guw: guw$2,
        gv: gv$2,
        ha: ha$2,
        haw: haw$2,
        he: he$2,
        hi: hi$2,
        hnj: hnj$2,
        hr: hr$2,
        hsb: hsb$2,
        hu: hu$2,
        hy: hy$2,
        ia: ia$2,
        id: id$2,
        ig: ig$2,
        ii: ii$2,
        io: io$2,
        is: is$2,
        it: it$2,
        iu: iu$2,
        ja: ja$2,
        jbo: jbo$2,
        jgo: jgo$2,
        jmc: jmc$2,
        jv: jv$2,
        jw: jw$2,
        ka: ka$2,
        kab: kab$2,
        kaj: kaj$2,
        kcg: kcg$2,
        kde: kde$2,
        kea: kea$2,
        kk: kk$2,
        kkj: kkj$2,
        kl: kl$2,
        km: km$2,
        kn: kn$2,
        ko: ko$2,
        ks: ks$2,
        ksb: ksb$2,
        ksh: ksh$2,
        ku: ku$2,
        kw: kw$2,
        ky: ky$2,
        lag: lag$2,
        lb: lb$2,
        lg: lg$2,
        lij: lij$2,
        lkt: lkt$2,
        ln: ln$2,
        lo: lo$2,
        lt: lt$2,
        lv: lv$2,
        mas: mas$2,
        mg: mg$2,
        mgo: mgo$2,
        mk: mk$2,
        ml: ml$2,
        mn: mn$2,
        mo: mo$2,
        mr: mr$2,
        ms: ms$2,
        mt: mt$2,
        my: my$2,
        nah: nah$2,
        naq: naq$2,
        nb: nb$2,
        nd: nd$2,
        ne: ne$2,
        nl: nl$2,
        nn: nn$2,
        nnh: nnh$2,
        no: no$2,
        nqo: nqo$2,
        nr: nr$2,
        nso: nso$2,
        ny: ny$2,
        nyn: nyn$2,
        om: om$2,
        or: or$2,
        os: os$2,
        osa: osa$2,
        pa: pa$2,
        pap: pap$2,
        pcm: pcm$2,
        pl: pl$2,
        prg: prg$2,
        ps: ps$2,
        pt: pt$2,
        pt_PT: pt_PT$2,
        rm: rm$2,
        ro: ro$2,
        rof: rof$2,
        ru: ru$2,
        rwk: rwk$2,
        sah: sah$2,
        saq: saq$2,
        sat: sat$2,
        sc: sc$2,
        scn: scn$2,
        sd: sd$2,
        sdh: sdh$2,
        se: se$2,
        seh: seh$2,
        ses: ses$2,
        sg: sg$2,
        sh: sh$2,
        shi: shi$2,
        si: si$2,
        sk: sk$2,
        sl: sl$2,
        sma: sma$2,
        smi: smi$2,
        smj: smj$2,
        smn: smn$2,
        sms: sms$2,
        sn: sn$2,
        so: so$2,
        sq: sq$2,
        sr: sr$2,
        ss: ss$2,
        ssy: ssy$2,
        st: st$2,
        su: su$2,
        sv: sv$2,
        sw: sw$2,
        syr: syr$2,
        ta: ta$2,
        te: te$2,
        teo: teo$2,
        th: th$2,
        ti: ti$2,
        tig: tig$2,
        tk: tk$2,
        tl: tl$2,
        tn: tn$2,
        to: to$2,
        tpi: tpi$2,
        tr: tr$2,
        ts: ts$2,
        tzm: tzm$2,
        ug: ug$2,
        uk: uk$2,
        und: und$2,
        ur: ur$2,
        uz: uz$2,
        ve: ve$2,
        vec: vec$2,
        vi: vi$2,
        vo: vo$2,
        vun: vun$2,
        wa: wa$2,
        wae: wae$2,
        wo: wo$2,
        xh: xh$2,
        xog: xog$2,
        yi: yi$2,
        yo: yo$2,
        yue: yue$2,
        zh: zh$2,
        zu: zu$2
    });

    const z = "zero",
      o = "one",
      t = "two",
      f$1 = "few",
      m = "many",
      x = "other";
    const a$1 = {
      cardinal: [o, x],
      ordinal: [x]
    };
    const b$1 = {
      cardinal: [o, x],
      ordinal: [o, x]
    };
    const c$1 = {
      cardinal: [x],
      ordinal: [x]
    };
    const d$1 = {
      cardinal: [o, t, x],
      ordinal: [x]
    };
    const af$1 = a$1;
    const ak$1 = a$1;
    const am$1 = a$1;
    const an$1 = a$1;
    const ar$1 = {
      cardinal: [z, o, t, f$1, m, x],
      ordinal: [x]
    };
    const ars$1 = {
      cardinal: [z, o, t, f$1, m, x],
      ordinal: [x]
    };
    const as$1 = {
      cardinal: [o, x],
      ordinal: [o, t, f$1, m, x]
    };
    const asa$1 = a$1;
    const ast$1 = a$1;
    const az$1 = {
      cardinal: [o, x],
      ordinal: [o, f$1, m, x]
    };
    const bal$1 = b$1;
    const be$1 = {
      cardinal: [o, f$1, m, x],
      ordinal: [f$1, x]
    };
    const bem$1 = a$1;
    const bez$1 = a$1;
    const bg$1 = a$1;
    const bho$1 = a$1;
    const bm$1 = c$1;
    const bn$1 = {
      cardinal: [o, x],
      ordinal: [o, t, f$1, m, x]
    };
    const bo$1 = c$1;
    const br$1 = {
      cardinal: [o, t, f$1, m, x],
      ordinal: [x]
    };
    const brx$1 = a$1;
    const bs$1 = {
      cardinal: [o, f$1, x],
      ordinal: [x]
    };
    const ca$1 = {
      cardinal: [o, m, x],
      ordinal: [o, t, f$1, x]
    };
    const ce$1 = a$1;
    const ceb$1 = a$1;
    const cgg$1 = a$1;
    const chr$1 = a$1;
    const ckb$1 = a$1;
    const cs$1 = {
      cardinal: [o, f$1, m, x],
      ordinal: [x]
    };
    const cy$1 = {
      cardinal: [z, o, t, f$1, m, x],
      ordinal: [z, o, t, f$1, m, x]
    };
    const da$1 = a$1;
    const de$1 = a$1;
    const doi$1 = a$1;
    const dsb$1 = {
      cardinal: [o, t, f$1, x],
      ordinal: [x]
    };
    const dv$1 = a$1;
    const dz$1 = c$1;
    const ee$1 = a$1;
    const el$1 = a$1;
    const en$1 = {
      cardinal: [o, x],
      ordinal: [o, t, f$1, x]
    };
    const eo$1 = a$1;
    const es$1 = {
      cardinal: [o, m, x],
      ordinal: [x]
    };
    const et$1 = a$1;
    const eu$1 = a$1;
    const fa$1 = a$1;
    const ff$1 = a$1;
    const fi$1 = a$1;
    const fil$1 = b$1;
    const fo$1 = a$1;
    const fr$1 = {
      cardinal: [o, m, x],
      ordinal: [o, x]
    };
    const fur$1 = a$1;
    const fy$1 = a$1;
    const ga$1 = {
      cardinal: [o, t, f$1, m, x],
      ordinal: [o, x]
    };
    const gd$1 = {
      cardinal: [o, t, f$1, x],
      ordinal: [o, t, f$1, x]
    };
    const gl$1 = a$1;
    const gsw$1 = a$1;
    const gu$1 = {
      cardinal: [o, x],
      ordinal: [o, t, f$1, m, x]
    };
    const guw$1 = a$1;
    const gv$1 = {
      cardinal: [o, t, f$1, m, x],
      ordinal: [x]
    };
    const ha$1 = a$1;
    const haw$1 = a$1;
    const he$1 = d$1;
    const hi$1 = {
      cardinal: [o, x],
      ordinal: [o, t, f$1, m, x]
    };
    const hnj$1 = c$1;
    const hr$1 = {
      cardinal: [o, f$1, x],
      ordinal: [x]
    };
    const hsb$1 = {
      cardinal: [o, t, f$1, x],
      ordinal: [x]
    };
    const hu$1 = b$1;
    const hy$1 = b$1;
    const ia$1 = a$1;
    const id$1 = c$1;
    const ig$1 = c$1;
    const ii$1 = c$1;
    const io$1 = a$1;
    const is$1 = a$1;
    const it$1 = {
      cardinal: [o, m, x],
      ordinal: [m, x]
    };
    const iu$1 = d$1;
    const ja$1 = c$1;
    const jbo$1 = c$1;
    const jgo$1 = a$1;
    const jmc$1 = a$1;
    const jv$1 = c$1;
    const jw$1 = c$1;
    const ka$1 = {
      cardinal: [o, x],
      ordinal: [o, m, x]
    };
    const kab$1 = a$1;
    const kaj$1 = a$1;
    const kcg$1 = a$1;
    const kde$1 = c$1;
    const kea$1 = c$1;
    const kk$1 = {
      cardinal: [o, x],
      ordinal: [m, x]
    };
    const kkj$1 = a$1;
    const kl$1 = a$1;
    const km$1 = c$1;
    const kn$1 = a$1;
    const ko$1 = c$1;
    const ks$1 = a$1;
    const ksb$1 = a$1;
    const ksh$1 = {
      cardinal: [z, o, x],
      ordinal: [x]
    };
    const ku$1 = a$1;
    const kw$1 = {
      cardinal: [z, o, t, f$1, m, x],
      ordinal: [o, m, x]
    };
    const ky$1 = a$1;
    const lag$1 = {
      cardinal: [z, o, x],
      ordinal: [x]
    };
    const lb$1 = a$1;
    const lg$1 = a$1;
    const lij$1 = {
      cardinal: [o, x],
      ordinal: [m, x]
    };
    const lkt$1 = c$1;
    const ln$1 = a$1;
    const lo$1 = {
      cardinal: [x],
      ordinal: [o, x]
    };
    const lt$1 = {
      cardinal: [o, f$1, m, x],
      ordinal: [x]
    };
    const lv$1 = {
      cardinal: [z, o, x],
      ordinal: [x]
    };
    const mas$1 = a$1;
    const mg$1 = a$1;
    const mgo$1 = a$1;
    const mk$1 = {
      cardinal: [o, x],
      ordinal: [o, t, m, x]
    };
    const ml$1 = a$1;
    const mn$1 = a$1;
    const mo$1 = {
      cardinal: [o, f$1, x],
      ordinal: [o, x]
    };
    const mr$1 = {
      cardinal: [o, x],
      ordinal: [o, t, f$1, x]
    };
    const ms$1 = {
      cardinal: [x],
      ordinal: [o, x]
    };
    const mt$1 = {
      cardinal: [o, t, f$1, m, x],
      ordinal: [x]
    };
    const my$1 = c$1;
    const nah$1 = a$1;
    const naq$1 = d$1;
    const nb$1 = a$1;
    const nd$1 = a$1;
    const ne$1 = b$1;
    const nl$1 = a$1;
    const nn$1 = a$1;
    const nnh$1 = a$1;
    const no$1 = a$1;
    const nqo$1 = c$1;
    const nr$1 = a$1;
    const nso$1 = a$1;
    const ny$1 = a$1;
    const nyn$1 = a$1;
    const om$1 = a$1;
    const or$1 = {
      cardinal: [o, x],
      ordinal: [o, t, f$1, m, x]
    };
    const os$1 = a$1;
    const osa$1 = c$1;
    const pa$1 = a$1;
    const pap$1 = a$1;
    const pcm$1 = a$1;
    const pl$1 = {
      cardinal: [o, f$1, m, x],
      ordinal: [x]
    };
    const prg$1 = {
      cardinal: [z, o, x],
      ordinal: [x]
    };
    const ps$1 = a$1;
    const pt$1 = {
      cardinal: [o, m, x],
      ordinal: [x]
    };
    const pt_PT$1 = {
      cardinal: [o, m, x],
      ordinal: [x]
    };
    const rm$1 = a$1;
    const ro$1 = {
      cardinal: [o, f$1, x],
      ordinal: [o, x]
    };
    const rof$1 = a$1;
    const ru$1 = {
      cardinal: [o, f$1, m, x],
      ordinal: [x]
    };
    const rwk$1 = a$1;
    const sah$1 = c$1;
    const saq$1 = a$1;
    const sat$1 = d$1;
    const sc$1 = {
      cardinal: [o, x],
      ordinal: [m, x]
    };
    const scn$1 = {
      cardinal: [o, x],
      ordinal: [m, x]
    };
    const sd$1 = a$1;
    const sdh$1 = a$1;
    const se$1 = d$1;
    const seh$1 = a$1;
    const ses$1 = c$1;
    const sg$1 = c$1;
    const sh$1 = {
      cardinal: [o, f$1, x],
      ordinal: [x]
    };
    const shi$1 = {
      cardinal: [o, f$1, x],
      ordinal: [x]
    };
    const si$1 = a$1;
    const sk$1 = {
      cardinal: [o, f$1, m, x],
      ordinal: [x]
    };
    const sl$1 = {
      cardinal: [o, t, f$1, x],
      ordinal: [x]
    };
    const sma$1 = d$1;
    const smi$1 = d$1;
    const smj$1 = d$1;
    const smn$1 = d$1;
    const sms$1 = d$1;
    const sn$1 = a$1;
    const so$1 = a$1;
    const sq$1 = {
      cardinal: [o, x],
      ordinal: [o, m, x]
    };
    const sr$1 = {
      cardinal: [o, f$1, x],
      ordinal: [x]
    };
    const ss$1 = a$1;
    const ssy$1 = a$1;
    const st$1 = a$1;
    const su$1 = c$1;
    const sv$1 = b$1;
    const sw$1 = a$1;
    const syr$1 = a$1;
    const ta$1 = a$1;
    const te$1 = a$1;
    const teo$1 = a$1;
    const th$1 = c$1;
    const ti$1 = a$1;
    const tig$1 = a$1;
    const tk$1 = {
      cardinal: [o, x],
      ordinal: [f$1, x]
    };
    const tl$1 = b$1;
    const tn$1 = a$1;
    const to$1 = c$1;
    const tpi$1 = c$1;
    const tr$1 = a$1;
    const ts$1 = a$1;
    const tzm$1 = a$1;
    const ug$1 = a$1;
    const uk$1 = {
      cardinal: [o, f$1, m, x],
      ordinal: [f$1, x]
    };
    const und$1 = c$1;
    const ur$1 = a$1;
    const uz$1 = a$1;
    const ve$1 = a$1;
    const vec$1 = {
      cardinal: [o, m, x],
      ordinal: [m, x]
    };
    const vi$1 = {
      cardinal: [x],
      ordinal: [o, x]
    };
    const vo$1 = a$1;
    const vun$1 = a$1;
    const wa$1 = a$1;
    const wae$1 = a$1;
    const wo$1 = c$1;
    const xh$1 = a$1;
    const xog$1 = a$1;
    const yi$1 = a$1;
    const yo$1 = c$1;
    const yue$1 = c$1;
    const zh$1 = c$1;
    const zu$1 = a$1;

    var PluralCategories = /*#__PURE__*/Object.freeze({
        __proto__: null,
        af: af$1,
        ak: ak$1,
        am: am$1,
        an: an$1,
        ar: ar$1,
        ars: ars$1,
        as: as$1,
        asa: asa$1,
        ast: ast$1,
        az: az$1,
        bal: bal$1,
        be: be$1,
        bem: bem$1,
        bez: bez$1,
        bg: bg$1,
        bho: bho$1,
        bm: bm$1,
        bn: bn$1,
        bo: bo$1,
        br: br$1,
        brx: brx$1,
        bs: bs$1,
        ca: ca$1,
        ce: ce$1,
        ceb: ceb$1,
        cgg: cgg$1,
        chr: chr$1,
        ckb: ckb$1,
        cs: cs$1,
        cy: cy$1,
        da: da$1,
        de: de$1,
        doi: doi$1,
        dsb: dsb$1,
        dv: dv$1,
        dz: dz$1,
        ee: ee$1,
        el: el$1,
        en: en$1,
        eo: eo$1,
        es: es$1,
        et: et$1,
        eu: eu$1,
        fa: fa$1,
        ff: ff$1,
        fi: fi$1,
        fil: fil$1,
        fo: fo$1,
        fr: fr$1,
        fur: fur$1,
        fy: fy$1,
        ga: ga$1,
        gd: gd$1,
        gl: gl$1,
        gsw: gsw$1,
        gu: gu$1,
        guw: guw$1,
        gv: gv$1,
        ha: ha$1,
        haw: haw$1,
        he: he$1,
        hi: hi$1,
        hnj: hnj$1,
        hr: hr$1,
        hsb: hsb$1,
        hu: hu$1,
        hy: hy$1,
        ia: ia$1,
        id: id$1,
        ig: ig$1,
        ii: ii$1,
        io: io$1,
        is: is$1,
        it: it$1,
        iu: iu$1,
        ja: ja$1,
        jbo: jbo$1,
        jgo: jgo$1,
        jmc: jmc$1,
        jv: jv$1,
        jw: jw$1,
        ka: ka$1,
        kab: kab$1,
        kaj: kaj$1,
        kcg: kcg$1,
        kde: kde$1,
        kea: kea$1,
        kk: kk$1,
        kkj: kkj$1,
        kl: kl$1,
        km: km$1,
        kn: kn$1,
        ko: ko$1,
        ks: ks$1,
        ksb: ksb$1,
        ksh: ksh$1,
        ku: ku$1,
        kw: kw$1,
        ky: ky$1,
        lag: lag$1,
        lb: lb$1,
        lg: lg$1,
        lij: lij$1,
        lkt: lkt$1,
        ln: ln$1,
        lo: lo$1,
        lt: lt$1,
        lv: lv$1,
        mas: mas$1,
        mg: mg$1,
        mgo: mgo$1,
        mk: mk$1,
        ml: ml$1,
        mn: mn$1,
        mo: mo$1,
        mr: mr$1,
        ms: ms$1,
        mt: mt$1,
        my: my$1,
        nah: nah$1,
        naq: naq$1,
        nb: nb$1,
        nd: nd$1,
        ne: ne$1,
        nl: nl$1,
        nn: nn$1,
        nnh: nnh$1,
        no: no$1,
        nqo: nqo$1,
        nr: nr$1,
        nso: nso$1,
        ny: ny$1,
        nyn: nyn$1,
        om: om$1,
        or: or$1,
        os: os$1,
        osa: osa$1,
        pa: pa$1,
        pap: pap$1,
        pcm: pcm$1,
        pl: pl$1,
        prg: prg$1,
        ps: ps$1,
        pt: pt$1,
        pt_PT: pt_PT$1,
        rm: rm$1,
        ro: ro$1,
        rof: rof$1,
        ru: ru$1,
        rwk: rwk$1,
        sah: sah$1,
        saq: saq$1,
        sat: sat$1,
        sc: sc$1,
        scn: scn$1,
        sd: sd$1,
        sdh: sdh$1,
        se: se$1,
        seh: seh$1,
        ses: ses$1,
        sg: sg$1,
        sh: sh$1,
        shi: shi$1,
        si: si$1,
        sk: sk$1,
        sl: sl$1,
        sma: sma$1,
        smi: smi$1,
        smj: smj$1,
        smn: smn$1,
        sms: sms$1,
        sn: sn$1,
        so: so$1,
        sq: sq$1,
        sr: sr$1,
        ss: ss$1,
        ssy: ssy$1,
        st: st$1,
        su: su$1,
        sv: sv$1,
        sw: sw$1,
        syr: syr$1,
        ta: ta$1,
        te: te$1,
        teo: teo$1,
        th: th$1,
        ti: ti$1,
        tig: tig$1,
        tk: tk$1,
        tl: tl$1,
        tn: tn$1,
        to: to$1,
        tpi: tpi$1,
        tr: tr$1,
        ts: ts$1,
        tzm: tzm$1,
        ug: ug$1,
        uk: uk$1,
        und: und$1,
        ur: ur$1,
        uz: uz$1,
        ve: ve$1,
        vec: vec$1,
        vi: vi$1,
        vo: vo$1,
        vun: vun$1,
        wa: wa$1,
        wae: wae$1,
        wo: wo$1,
        xh: xh$1,
        xog: xog$1,
        yi: yi$1,
        yo: yo$1,
        yue: yue$1,
        zh: zh$1,
        zu: zu$1
    });

    const a = (n, ord) => {
      if (ord) return 'other';
      return n == 1 ? 'one' : 'other';
    };
    const b = (n, ord) => {
      if (ord) return 'other';
      return n == 0 || n == 1 ? 'one' : 'other';
    };
    const c = (n, ord) => {
      if (ord) return 'other';
      return n >= 0 && n <= 1 ? 'one' : 'other';
    };
    const d = (n, ord) => {
      const s = String(n).split('.'),
        v0 = !s[1];
      if (ord) return 'other';
      return n == 1 && v0 ? 'one' : 'other';
    };
    const e = (n, ord) => 'other';
    const f = (n, ord) => {
      if (ord) return 'other';
      return n == 1 ? 'one' : n == 2 ? 'two' : 'other';
    };
    const af = a;
    const ak = b;
    const am = c;
    const an = a;
    const ar = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);
      if (ord) return 'other';
      return n == 0 ? 'zero' : n == 1 ? 'one' : n == 2 ? 'two' : n100 >= 3 && n100 <= 10 ? 'few' : n100 >= 11 && n100 <= 99 ? 'many' : 'other';
    };
    const ars = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);
      if (ord) return 'other';
      return n == 0 ? 'zero' : n == 1 ? 'one' : n == 2 ? 'two' : n100 >= 3 && n100 <= 10 ? 'few' : n100 >= 11 && n100 <= 99 ? 'many' : 'other';
    };
    const as = (n, ord) => {
      if (ord) return n == 1 || n == 5 || n == 7 || n == 8 || n == 9 || n == 10 ? 'one' : n == 2 || n == 3 ? 'two' : n == 4 ? 'few' : n == 6 ? 'many' : 'other';
      return n >= 0 && n <= 1 ? 'one' : 'other';
    };
    const asa = a;
    const ast = d;
    const az = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        i1000 = i.slice(-3);
      if (ord) return i10 == 1 || i10 == 2 || i10 == 5 || i10 == 7 || i10 == 8 || i100 == 20 || i100 == 50 || i100 == 70 || i100 == 80 ? 'one' : i10 == 3 || i10 == 4 || i1000 == 100 || i1000 == 200 || i1000 == 300 || i1000 == 400 || i1000 == 500 || i1000 == 600 || i1000 == 700 || i1000 == 800 || i1000 == 900 ? 'few' : i == 0 || i10 == 6 || i100 == 40 || i100 == 60 || i100 == 90 ? 'many' : 'other';
      return n == 1 ? 'one' : 'other';
    };
    const bal = (n, ord) => n == 1 ? 'one' : 'other';
    const be = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);
      if (ord) return (n10 == 2 || n10 == 3) && n100 != 12 && n100 != 13 ? 'few' : 'other';
      return n10 == 1 && n100 != 11 ? 'one' : n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? 'few' : t0 && n10 == 0 || n10 >= 5 && n10 <= 9 || n100 >= 11 && n100 <= 14 ? 'many' : 'other';
    };
    const bem = a;
    const bez = a;
    const bg = a;
    const bho = b;
    const bm = e;
    const bn = (n, ord) => {
      if (ord) return n == 1 || n == 5 || n == 7 || n == 8 || n == 9 || n == 10 ? 'one' : n == 2 || n == 3 ? 'two' : n == 4 ? 'few' : n == 6 ? 'many' : 'other';
      return n >= 0 && n <= 1 ? 'one' : 'other';
    };
    const bo = e;
    const br = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2),
        n1000000 = t0 && s[0].slice(-6);
      if (ord) return 'other';
      return n10 == 1 && n100 != 11 && n100 != 71 && n100 != 91 ? 'one' : n10 == 2 && n100 != 12 && n100 != 72 && n100 != 92 ? 'two' : (n10 == 3 || n10 == 4 || n10 == 9) && (n100 < 10 || n100 > 19) && (n100 < 70 || n100 > 79) && (n100 < 90 || n100 > 99) ? 'few' : n != 0 && t0 && n1000000 == 0 ? 'many' : 'other';
    };
    const brx = a;
    const bs = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);
      if (ord) return 'other';
      return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? 'few' : 'other';
    };
    const ca = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
      if (ord) return n == 1 || n == 3 ? 'one' : n == 2 ? 'two' : n == 4 ? 'few' : 'other';
      return n == 1 && v0 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
    };
    const ce = a;
    const ceb = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        f10 = f.slice(-1);
      if (ord) return 'other';
      return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? 'one' : 'other';
    };
    const cgg = a;
    const chr = a;
    const ckb = a;
    const cs = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1];
      if (ord) return 'other';
      return n == 1 && v0 ? 'one' : i >= 2 && i <= 4 && v0 ? 'few' : !v0 ? 'many' : 'other';
    };
    const cy = (n, ord) => {
      if (ord) return n == 0 || n == 7 || n == 8 || n == 9 ? 'zero' : n == 1 ? 'one' : n == 2 ? 'two' : n == 3 || n == 4 ? 'few' : n == 5 || n == 6 ? 'many' : 'other';
      return n == 0 ? 'zero' : n == 1 ? 'one' : n == 2 ? 'two' : n == 3 ? 'few' : n == 6 ? 'many' : 'other';
    };
    const da = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        t0 = Number(s[0]) == n;
      if (ord) return 'other';
      return n == 1 || !t0 && (i == 0 || i == 1) ? 'one' : 'other';
    };
    const de = d;
    const doi = c;
    const dsb = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i100 = i.slice(-2),
        f100 = f.slice(-2);
      if (ord) return 'other';
      return v0 && i100 == 1 || f100 == 1 ? 'one' : v0 && i100 == 2 || f100 == 2 ? 'two' : v0 && (i100 == 3 || i100 == 4) || f100 == 3 || f100 == 4 ? 'few' : 'other';
    };
    const dv = a;
    const dz = e;
    const ee = a;
    const el = a;
    const en = (n, ord) => {
      const s = String(n).split('.'),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);
      if (ord) return n10 == 1 && n100 != 11 ? 'one' : n10 == 2 && n100 != 12 ? 'two' : n10 == 3 && n100 != 13 ? 'few' : 'other';
      return n == 1 && v0 ? 'one' : 'other';
    };
    const eo = a;
    const es = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
      if (ord) return 'other';
      return n == 1 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
    };
    const et = d;
    const eu = a;
    const fa = c;
    const ff = (n, ord) => {
      if (ord) return 'other';
      return n >= 0 && n < 2 ? 'one' : 'other';
    };
    const fi = d;
    const fil = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        f10 = f.slice(-1);
      if (ord) return n == 1 ? 'one' : 'other';
      return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? 'one' : 'other';
    };
    const fo = a;
    const fr = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
      if (ord) return n == 1 ? 'one' : 'other';
      return n >= 0 && n < 2 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
    };
    const fur = a;
    const fy = d;
    const ga = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n;
      if (ord) return n == 1 ? 'one' : 'other';
      return n == 1 ? 'one' : n == 2 ? 'two' : t0 && n >= 3 && n <= 6 ? 'few' : t0 && n >= 7 && n <= 10 ? 'many' : 'other';
    };
    const gd = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n;
      if (ord) return n == 1 || n == 11 ? 'one' : n == 2 || n == 12 ? 'two' : n == 3 || n == 13 ? 'few' : 'other';
      return n == 1 || n == 11 ? 'one' : n == 2 || n == 12 ? 'two' : t0 && n >= 3 && n <= 10 || t0 && n >= 13 && n <= 19 ? 'few' : 'other';
    };
    const gl = d;
    const gsw = a;
    const gu = (n, ord) => {
      if (ord) return n == 1 ? 'one' : n == 2 || n == 3 ? 'two' : n == 4 ? 'few' : n == 6 ? 'many' : 'other';
      return n >= 0 && n <= 1 ? 'one' : 'other';
    };
    const guw = b;
    const gv = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2);
      if (ord) return 'other';
      return v0 && i10 == 1 ? 'one' : v0 && i10 == 2 ? 'two' : v0 && (i100 == 0 || i100 == 20 || i100 == 40 || i100 == 60 || i100 == 80) ? 'few' : !v0 ? 'many' : 'other';
    };
    const ha = a;
    const haw = a;
    const he = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1];
      if (ord) return 'other';
      return i == 1 && v0 || i == 0 && !v0 ? 'one' : i == 2 && v0 ? 'two' : 'other';
    };
    const hi = (n, ord) => {
      if (ord) return n == 1 ? 'one' : n == 2 || n == 3 ? 'two' : n == 4 ? 'few' : n == 6 ? 'many' : 'other';
      return n >= 0 && n <= 1 ? 'one' : 'other';
    };
    const hnj = e;
    const hr = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);
      if (ord) return 'other';
      return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? 'few' : 'other';
    };
    const hsb = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i100 = i.slice(-2),
        f100 = f.slice(-2);
      if (ord) return 'other';
      return v0 && i100 == 1 || f100 == 1 ? 'one' : v0 && i100 == 2 || f100 == 2 ? 'two' : v0 && (i100 == 3 || i100 == 4) || f100 == 3 || f100 == 4 ? 'few' : 'other';
    };
    const hu = (n, ord) => {
      if (ord) return n == 1 || n == 5 ? 'one' : 'other';
      return n == 1 ? 'one' : 'other';
    };
    const hy = (n, ord) => {
      if (ord) return n == 1 ? 'one' : 'other';
      return n >= 0 && n < 2 ? 'one' : 'other';
    };
    const ia = d;
    const id = e;
    const ig = e;
    const ii = e;
    const io = d;
    const is = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        t = (s[1] || '').replace(/0+$/, ''),
        t0 = Number(s[0]) == n,
        i10 = i.slice(-1),
        i100 = i.slice(-2);
      if (ord) return 'other';
      return t0 && i10 == 1 && i100 != 11 || t % 10 == 1 && t % 100 != 11 ? 'one' : 'other';
    };
    const it = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
      if (ord) return n == 11 || n == 8 || n == 80 || n == 800 ? 'many' : 'other';
      return n == 1 && v0 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
    };
    const iu = f;
    const ja = e;
    const jbo = e;
    const jgo = a;
    const jmc = a;
    const jv = e;
    const jw = e;
    const ka = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        i100 = i.slice(-2);
      if (ord) return i == 1 ? 'one' : i == 0 || i100 >= 2 && i100 <= 20 || i100 == 40 || i100 == 60 || i100 == 80 ? 'many' : 'other';
      return n == 1 ? 'one' : 'other';
    };
    const kab = (n, ord) => {
      if (ord) return 'other';
      return n >= 0 && n < 2 ? 'one' : 'other';
    };
    const kaj = a;
    const kcg = a;
    const kde = e;
    const kea = e;
    const kk = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1);
      if (ord) return n10 == 6 || n10 == 9 || t0 && n10 == 0 && n != 0 ? 'many' : 'other';
      return n == 1 ? 'one' : 'other';
    };
    const kkj = a;
    const kl = a;
    const km = e;
    const kn = c;
    const ko = e;
    const ks = a;
    const ksb = a;
    const ksh = (n, ord) => {
      if (ord) return 'other';
      return n == 0 ? 'zero' : n == 1 ? 'one' : 'other';
    };
    const ku = a;
    const kw = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2),
        n1000 = t0 && s[0].slice(-3),
        n100000 = t0 && s[0].slice(-5),
        n1000000 = t0 && s[0].slice(-6);
      if (ord) return t0 && n >= 1 && n <= 4 || n100 >= 1 && n100 <= 4 || n100 >= 21 && n100 <= 24 || n100 >= 41 && n100 <= 44 || n100 >= 61 && n100 <= 64 || n100 >= 81 && n100 <= 84 ? 'one' : n == 5 || n100 == 5 ? 'many' : 'other';
      return n == 0 ? 'zero' : n == 1 ? 'one' : n100 == 2 || n100 == 22 || n100 == 42 || n100 == 62 || n100 == 82 || t0 && n1000 == 0 && (n100000 >= 1000 && n100000 <= 20000 || n100000 == 40000 || n100000 == 60000 || n100000 == 80000) || n != 0 && n1000000 == 100000 ? 'two' : n100 == 3 || n100 == 23 || n100 == 43 || n100 == 63 || n100 == 83 ? 'few' : n != 1 && (n100 == 1 || n100 == 21 || n100 == 41 || n100 == 61 || n100 == 81) ? 'many' : 'other';
    };
    const ky = a;
    const lag = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0];
      if (ord) return 'other';
      return n == 0 ? 'zero' : (i == 0 || i == 1) && n != 0 ? 'one' : 'other';
    };
    const lb = a;
    const lg = a;
    const lij = (n, ord) => {
      const s = String(n).split('.'),
        v0 = !s[1],
        t0 = Number(s[0]) == n;
      if (ord) return n == 11 || n == 8 || t0 && n >= 80 && n <= 89 || t0 && n >= 800 && n <= 899 ? 'many' : 'other';
      return n == 1 && v0 ? 'one' : 'other';
    };
    const lkt = e;
    const ln = b;
    const lo = (n, ord) => {
      if (ord) return n == 1 ? 'one' : 'other';
      return 'other';
    };
    const lt = (n, ord) => {
      const s = String(n).split('.'),
        f = s[1] || '',
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);
      if (ord) return 'other';
      return n10 == 1 && (n100 < 11 || n100 > 19) ? 'one' : n10 >= 2 && n10 <= 9 && (n100 < 11 || n100 > 19) ? 'few' : f != 0 ? 'many' : 'other';
    };
    const lv = (n, ord) => {
      const s = String(n).split('.'),
        f = s[1] || '',
        v = f.length,
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2),
        f100 = f.slice(-2),
        f10 = f.slice(-1);
      if (ord) return 'other';
      return t0 && n10 == 0 || n100 >= 11 && n100 <= 19 || v == 2 && f100 >= 11 && f100 <= 19 ? 'zero' : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? 'one' : 'other';
    };
    const mas = a;
    const mg = b;
    const mgo = a;
    const mk = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);
      if (ord) return i10 == 1 && i100 != 11 ? 'one' : i10 == 2 && i100 != 12 ? 'two' : (i10 == 7 || i10 == 8) && i100 != 17 && i100 != 18 ? 'many' : 'other';
      return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one' : 'other';
    };
    const ml = a;
    const mn = a;
    const mo = (n, ord) => {
      const s = String(n).split('.'),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);
      if (ord) return n == 1 ? 'one' : 'other';
      return n == 1 && v0 ? 'one' : !v0 || n == 0 || n != 1 && n100 >= 1 && n100 <= 19 ? 'few' : 'other';
    };
    const mr = (n, ord) => {
      if (ord) return n == 1 ? 'one' : n == 2 || n == 3 ? 'two' : n == 4 ? 'few' : 'other';
      return n == 1 ? 'one' : 'other';
    };
    const ms = (n, ord) => {
      if (ord) return n == 1 ? 'one' : 'other';
      return 'other';
    };
    const mt = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);
      if (ord) return 'other';
      return n == 1 ? 'one' : n == 2 ? 'two' : n == 0 || n100 >= 3 && n100 <= 10 ? 'few' : n100 >= 11 && n100 <= 19 ? 'many' : 'other';
    };
    const my = e;
    const nah = a;
    const naq = f;
    const nb = a;
    const nd = a;
    const ne = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n;
      if (ord) return t0 && n >= 1 && n <= 4 ? 'one' : 'other';
      return n == 1 ? 'one' : 'other';
    };
    const nl = d;
    const nn = a;
    const nnh = a;
    const no = a;
    const nqo = e;
    const nr = a;
    const nso = b;
    const ny = a;
    const nyn = a;
    const om = a;
    const or = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n;
      if (ord) return n == 1 || n == 5 || t0 && n >= 7 && n <= 9 ? 'one' : n == 2 || n == 3 ? 'two' : n == 4 ? 'few' : n == 6 ? 'many' : 'other';
      return n == 1 ? 'one' : 'other';
    };
    const os = a;
    const osa = e;
    const pa = b;
    const pap = a;
    const pcm = c;
    const pl = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2);
      if (ord) return 'other';
      return n == 1 && v0 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? 'few' : v0 && i != 1 && (i10 == 0 || i10 == 1) || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 12 && i100 <= 14 ? 'many' : 'other';
    };
    const prg = (n, ord) => {
      const s = String(n).split('.'),
        f = s[1] || '',
        v = f.length,
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2),
        f100 = f.slice(-2),
        f10 = f.slice(-1);
      if (ord) return 'other';
      return t0 && n10 == 0 || n100 >= 11 && n100 <= 19 || v == 2 && f100 >= 11 && f100 <= 19 ? 'zero' : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? 'one' : 'other';
    };
    const ps = a;
    const pt = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
      if (ord) return 'other';
      return i == 0 || i == 1 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
    };
    const pt_PT = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
      if (ord) return 'other';
      return n == 1 && v0 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
    };
    const rm = a;
    const ro = (n, ord) => {
      const s = String(n).split('.'),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);
      if (ord) return n == 1 ? 'one' : 'other';
      return n == 1 && v0 ? 'one' : !v0 || n == 0 || n != 1 && n100 >= 1 && n100 <= 19 ? 'few' : 'other';
    };
    const rof = a;
    const ru = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2);
      if (ord) return 'other';
      return v0 && i10 == 1 && i100 != 11 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? 'few' : v0 && i10 == 0 || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 11 && i100 <= 14 ? 'many' : 'other';
    };
    const rwk = a;
    const sah = e;
    const saq = a;
    const sat = f;
    const sc = (n, ord) => {
      const s = String(n).split('.'),
        v0 = !s[1];
      if (ord) return n == 11 || n == 8 || n == 80 || n == 800 ? 'many' : 'other';
      return n == 1 && v0 ? 'one' : 'other';
    };
    const scn = (n, ord) => {
      const s = String(n).split('.'),
        v0 = !s[1];
      if (ord) return n == 11 || n == 8 || n == 80 || n == 800 ? 'many' : 'other';
      return n == 1 && v0 ? 'one' : 'other';
    };
    const sd = a;
    const sdh = a;
    const se = f;
    const seh = a;
    const ses = e;
    const sg = e;
    const sh = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);
      if (ord) return 'other';
      return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? 'few' : 'other';
    };
    const shi = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n;
      if (ord) return 'other';
      return n >= 0 && n <= 1 ? 'one' : t0 && n >= 2 && n <= 10 ? 'few' : 'other';
    };
    const si = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '';
      if (ord) return 'other';
      return n == 0 || n == 1 || i == 0 && f == 1 ? 'one' : 'other';
    };
    const sk = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1];
      if (ord) return 'other';
      return n == 1 && v0 ? 'one' : i >= 2 && i <= 4 && v0 ? 'few' : !v0 ? 'many' : 'other';
    };
    const sl = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i100 = i.slice(-2);
      if (ord) return 'other';
      return v0 && i100 == 1 ? 'one' : v0 && i100 == 2 ? 'two' : v0 && (i100 == 3 || i100 == 4) || !v0 ? 'few' : 'other';
    };
    const sma = f;
    const smi = f;
    const smj = f;
    const smn = f;
    const sms = f;
    const sn = a;
    const so = a;
    const sq = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);
      if (ord) return n == 1 ? 'one' : n10 == 4 && n100 != 14 ? 'many' : 'other';
      return n == 1 ? 'one' : 'other';
    };
    const sr = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);
      if (ord) return 'other';
      return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? 'few' : 'other';
    };
    const ss = a;
    const ssy = a;
    const st = a;
    const su = e;
    const sv = (n, ord) => {
      const s = String(n).split('.'),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);
      if (ord) return (n10 == 1 || n10 == 2) && n100 != 11 && n100 != 12 ? 'one' : 'other';
      return n == 1 && v0 ? 'one' : 'other';
    };
    const sw = d;
    const syr = a;
    const ta = a;
    const te = a;
    const teo = a;
    const th = e;
    const ti = b;
    const tig = a;
    const tk = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1);
      if (ord) return n10 == 6 || n10 == 9 || n == 10 ? 'few' : 'other';
      return n == 1 ? 'one' : 'other';
    };
    const tl = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        f = s[1] || '',
        v0 = !s[1],
        i10 = i.slice(-1),
        f10 = f.slice(-1);
      if (ord) return n == 1 ? 'one' : 'other';
      return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? 'one' : 'other';
    };
    const tn = a;
    const to = e;
    const tpi = e;
    const tr = a;
    const ts = a;
    const tzm = (n, ord) => {
      const s = String(n).split('.'),
        t0 = Number(s[0]) == n;
      if (ord) return 'other';
      return n == 0 || n == 1 || t0 && n >= 11 && n <= 99 ? 'one' : 'other';
    };
    const ug = a;
    const uk = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2),
        i10 = i.slice(-1),
        i100 = i.slice(-2);
      if (ord) return n10 == 3 && n100 != 13 ? 'few' : 'other';
      return v0 && i10 == 1 && i100 != 11 ? 'one' : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? 'few' : v0 && i10 == 0 || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 11 && i100 <= 14 ? 'many' : 'other';
    };
    const und = e;
    const ur = d;
    const uz = a;
    const ve = a;
    const vec = (n, ord) => {
      const s = String(n).split('.'),
        i = s[0],
        v0 = !s[1],
        i1000000 = i.slice(-6);
      if (ord) return n == 11 || n == 8 || n == 80 || n == 800 ? 'many' : 'other';
      return n == 1 && v0 ? 'one' : i != 0 && i1000000 == 0 && v0 ? 'many' : 'other';
    };
    const vi = (n, ord) => {
      if (ord) return n == 1 ? 'one' : 'other';
      return 'other';
    };
    const vo = a;
    const vun = a;
    const wa = b;
    const wae = a;
    const wo = e;
    const xh = a;
    const xog = a;
    const yi = d;
    const yo = e;
    const yue = e;
    const zh = e;
    const zu = c;

    var Plurals = /*#__PURE__*/Object.freeze({
        __proto__: null,
        af: af,
        ak: ak,
        am: am,
        an: an,
        ar: ar,
        ars: ars,
        as: as,
        asa: asa,
        ast: ast,
        az: az,
        bal: bal,
        be: be,
        bem: bem,
        bez: bez,
        bg: bg,
        bho: bho,
        bm: bm,
        bn: bn,
        bo: bo,
        br: br,
        brx: brx,
        bs: bs,
        ca: ca,
        ce: ce,
        ceb: ceb,
        cgg: cgg,
        chr: chr,
        ckb: ckb,
        cs: cs,
        cy: cy,
        da: da,
        de: de,
        doi: doi,
        dsb: dsb,
        dv: dv,
        dz: dz,
        ee: ee,
        el: el,
        en: en,
        eo: eo,
        es: es,
        et: et,
        eu: eu,
        fa: fa,
        ff: ff,
        fi: fi,
        fil: fil,
        fo: fo,
        fr: fr,
        fur: fur,
        fy: fy,
        ga: ga,
        gd: gd,
        gl: gl,
        gsw: gsw,
        gu: gu,
        guw: guw,
        gv: gv,
        ha: ha,
        haw: haw,
        he: he,
        hi: hi,
        hnj: hnj,
        hr: hr,
        hsb: hsb,
        hu: hu,
        hy: hy,
        ia: ia,
        id: id,
        ig: ig,
        ii: ii,
        io: io,
        is: is,
        it: it,
        iu: iu,
        ja: ja,
        jbo: jbo,
        jgo: jgo,
        jmc: jmc,
        jv: jv,
        jw: jw,
        ka: ka,
        kab: kab,
        kaj: kaj,
        kcg: kcg,
        kde: kde,
        kea: kea,
        kk: kk,
        kkj: kkj,
        kl: kl,
        km: km,
        kn: kn,
        ko: ko,
        ks: ks,
        ksb: ksb,
        ksh: ksh,
        ku: ku,
        kw: kw,
        ky: ky,
        lag: lag,
        lb: lb,
        lg: lg,
        lij: lij,
        lkt: lkt,
        ln: ln,
        lo: lo,
        lt: lt,
        lv: lv,
        mas: mas,
        mg: mg,
        mgo: mgo,
        mk: mk,
        ml: ml,
        mn: mn,
        mo: mo,
        mr: mr,
        ms: ms,
        mt: mt,
        my: my,
        nah: nah,
        naq: naq,
        nb: nb,
        nd: nd,
        ne: ne,
        nl: nl,
        nn: nn,
        nnh: nnh,
        no: no,
        nqo: nqo,
        nr: nr,
        nso: nso,
        ny: ny,
        nyn: nyn,
        om: om,
        or: or,
        os: os,
        osa: osa,
        pa: pa,
        pap: pap,
        pcm: pcm,
        pl: pl,
        prg: prg,
        ps: ps,
        pt: pt,
        pt_PT: pt_PT,
        rm: rm,
        ro: ro,
        rof: rof,
        ru: ru,
        rwk: rwk,
        sah: sah,
        saq: saq,
        sat: sat,
        sc: sc,
        scn: scn,
        sd: sd,
        sdh: sdh,
        se: se,
        seh: seh,
        ses: ses,
        sg: sg,
        sh: sh,
        shi: shi,
        si: si,
        sk: sk,
        sl: sl,
        sma: sma,
        smi: smi,
        smj: smj,
        smn: smn,
        sms: sms,
        sn: sn,
        so: so,
        sq: sq,
        sr: sr,
        ss: ss,
        ssy: ssy,
        st: st,
        su: su,
        sv: sv,
        sw: sw,
        syr: syr,
        ta: ta,
        te: te,
        teo: teo,
        th: th,
        ti: ti,
        tig: tig,
        tk: tk,
        tl: tl,
        tn: tn,
        to: to,
        tpi: tpi,
        tr: tr,
        ts: ts,
        tzm: tzm,
        ug: ug,
        uk: uk,
        und: und,
        ur: ur,
        uz: uz,
        ve: ve,
        vec: vec,
        vi: vi,
        vo: vo,
        vun: vun,
        wa: wa,
        wae: wae,
        wo: wo,
        xh: xh,
        xog: xog,
        yi: yi,
        yo: yo,
        yue: yue,
        zh: zh,
        zu: zu
    });

    function normalize(locale) {
        if (typeof locale !== 'string' || locale.length < 2)
            throw new RangeError("Invalid language tag: ".concat(locale));
        if (locale.startsWith('pt-PT'))
            return 'pt-PT';
        var m = locale.match(/.+?(?=[-_])/);
        return m ? m[0] : locale;
    }
    function getPlural(locale) {
        if (typeof locale === 'function') {
            var lc_1 = normalize(locale.name);
            return {
                isDefault: false,
                id: identifier(lc_1),
                lc: lc_1,
                locale: locale.name,
                getPlural: locale,
                cardinals: locale.cardinals || [],
                ordinals: locale.ordinals || []
            };
        }
        var lc = normalize(locale);
        var id = identifier(lc);
        if (isPluralId(id)) {
            return {
                isDefault: true,
                id: id,
                lc: lc,
                locale: locale,
                getCardinal: Cardinals[id],
                getPlural: Plurals[id],
                cardinals: PluralCategories[id].cardinal,
                ordinals: PluralCategories[id].ordinal
            };
        }
        return null;
    }
    function getAllPlurals(firstLocale) {
        var keys = Object.keys(Plurals).filter(function (key) { return key !== firstLocale; });
        keys.unshift(firstLocale);
        return keys.map(getPlural);
    }
    function hasPlural(locale) {
        var lc = normalize(locale);
        return identifier(lc) in Plurals;
    }
    function isPluralId(id) {
        return id in Plurals;
    }

    var MessageFormat = (function () {
        function MessageFormat(locale, options) {
            this.plurals = [];
            this.options = Object.assign({
                biDiSupport: false,
                currency: 'USD',
                customFormatters: {},
                localeCodeFromKey: null,
                requireAllArguments: false,
                returnType: 'string',
                strict: (options && options.strictNumberSign) || false,
                strictPluralKeys: true
            }, options);
            if (locale === '*') {
                this.plurals = getAllPlurals(MessageFormat.defaultLocale);
            }
            else if (Array.isArray(locale)) {
                this.plurals = locale.map(getPlural).filter(Boolean);
            }
            else if (locale) {
                var pl = getPlural(locale);
                if (pl)
                    this.plurals = [pl];
            }
            if (this.plurals.length === 0) {
                var pl = getPlural(MessageFormat.defaultLocale);
                this.plurals = [pl];
            }
        }
        MessageFormat.escape = function (str, octothorpe) {
            var esc = octothorpe ? /[#{}]/g : /[{}]/g;
            return String(str).replace(esc, "'$&'");
        };
        MessageFormat.supportedLocalesOf = function (locales) {
            var la = Array.isArray(locales) ? locales : [locales];
            return la.filter(hasPlural);
        };
        MessageFormat.prototype.resolvedOptions = function () {
            return __assign(__assign({}, this.options), { locale: this.plurals[0].locale, plurals: this.plurals });
        };
        MessageFormat.prototype.compile = function (message) {
            var e_1, _a;
            var compiler = new Compiler(this.options);
            var fnBody = 'return ' + compiler.compile(message, this.plurals[0]);
            var nfArgs = [];
            var fnArgs = [];
            try {
                for (var _b = __values(Object.entries(compiler.runtime)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], fmt = _d[1];
                    nfArgs.push(key);
                    fnArgs.push(fmt);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var fn = new (Function.bind.apply(Function, __spreadArray(__spreadArray([void 0], __read(nfArgs), false), [fnBody], false)))();
            return fn.apply(void 0, __spreadArray([], __read(fnArgs), false));
        };
        MessageFormat.defaultLocale = 'en';
        return MessageFormat;
    }());

    return MessageFormat;

}));


/***/ }),

/***/ "./node_modules/boolean/build/lib/boolean.js":
/*!***************************************************!*\
  !*** ./node_modules/boolean/build/lib/boolean.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.boolean = void 0;
const boolean = function (value) {
    switch (Object.prototype.toString.call(value)) {
        case '[object String]':
            return ['true', 't', 'yes', 'y', 'on', '1'].includes(value.trim().toLowerCase());
        case '[object Number]':
            return value.valueOf() === 1;
        case '[object Boolean]':
            return value.valueOf();
        default:
            return false;
    }
};
exports.boolean = boolean;


/***/ }),

/***/ "./node_modules/boolean/build/lib/index.js":
/*!*************************************************!*\
  !*** ./node_modules/boolean/build/lib/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isBooleanable = exports.boolean = void 0;
const boolean_1 = __webpack_require__(/*! ./boolean */ "./node_modules/boolean/build/lib/boolean.js");
Object.defineProperty(exports, "boolean", ({ enumerable: true, get: function () { return boolean_1.boolean; } }));
const isBooleanable_1 = __webpack_require__(/*! ./isBooleanable */ "./node_modules/boolean/build/lib/isBooleanable.js");
Object.defineProperty(exports, "isBooleanable", ({ enumerable: true, get: function () { return isBooleanable_1.isBooleanable; } }));


/***/ }),

/***/ "./node_modules/boolean/build/lib/isBooleanable.js":
/*!*********************************************************!*\
  !*** ./node_modules/boolean/build/lib/isBooleanable.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isBooleanable = void 0;
const isBooleanable = function (value) {
    switch (Object.prototype.toString.call(value)) {
        case '[object String]':
            return [
                'true', 't', 'yes', 'y', 'on', '1',
                'false', 'f', 'no', 'n', 'off', '0'
            ].includes(value.trim().toLowerCase());
        case '[object Number]':
            return [0, 1].includes(value.valueOf());
        case '[object Boolean]':
            return true;
        default:
            return false;
    }
};
exports.isBooleanable = isBooleanable;


/***/ }),

/***/ "./node_modules/call-bind/callBound.js":
/*!*********************************************!*\
  !*** ./node_modules/call-bind/callBound.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(/*! get-intrinsic */ "./node_modules/get-intrinsic/index.js");

var callBind = __webpack_require__(/*! ./ */ "./node_modules/call-bind/index.js");

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};


/***/ }),

/***/ "./node_modules/call-bind/index.js":
/*!*****************************************!*\
  !*** ./node_modules/call-bind/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! function-bind */ "./node_modules/function-bind/index.js");
var GetIntrinsic = __webpack_require__(/*! get-intrinsic */ "./node_modules/get-intrinsic/index.js");
var setFunctionLength = __webpack_require__(/*! set-function-length */ "./node_modules/set-function-length/index.js");

var $TypeError = __webpack_require__(/*! es-errors/type */ "./node_modules/es-errors/type.js");
var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $defineProperty = __webpack_require__(/*! es-define-property */ "./node_modules/es-define-property/index.js");
var $max = GetIntrinsic('%Math.max%');

module.exports = function callBind(originalFunction) {
	if (typeof originalFunction !== 'function') {
		throw new $TypeError('a function is required');
	}
	var func = $reflectApply(bind, $call, arguments);
	return setFunctionLength(
		func,
		1 + $max(0, originalFunction.length - (arguments.length - 1)),
		true
	);
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}


/***/ }),

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/debug/src/browser.js ***!
  \*******************************************/
/***/ ((module, exports, __webpack_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(/*! ./common */ "./node_modules/debug/src/common.js")(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ "./node_modules/debug/src/common.js":
/*!******************************************!*\
  !*** ./node_modules/debug/src/common.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(/*! ms */ "./node_modules/ms/index.js");
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ "./node_modules/define-data-property/index.js":
/*!****************************************************!*\
  !*** ./node_modules/define-data-property/index.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var $defineProperty = __webpack_require__(/*! es-define-property */ "./node_modules/es-define-property/index.js");

var $SyntaxError = __webpack_require__(/*! es-errors/syntax */ "./node_modules/es-errors/syntax.js");
var $TypeError = __webpack_require__(/*! es-errors/type */ "./node_modules/es-errors/type.js");

var gopd = __webpack_require__(/*! gopd */ "./node_modules/gopd/index.js");

/** @type {import('.')} */
module.exports = function defineDataProperty(
	obj,
	property,
	value
) {
	if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
		throw new $TypeError('`obj` must be an object or a function`');
	}
	if (typeof property !== 'string' && typeof property !== 'symbol') {
		throw new $TypeError('`property` must be a string or a symbol`');
	}
	if (arguments.length > 3 && typeof arguments[3] !== 'boolean' && arguments[3] !== null) {
		throw new $TypeError('`nonEnumerable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 4 && typeof arguments[4] !== 'boolean' && arguments[4] !== null) {
		throw new $TypeError('`nonWritable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 5 && typeof arguments[5] !== 'boolean' && arguments[5] !== null) {
		throw new $TypeError('`nonConfigurable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 6 && typeof arguments[6] !== 'boolean') {
		throw new $TypeError('`loose`, if provided, must be a boolean');
	}

	var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
	var nonWritable = arguments.length > 4 ? arguments[4] : null;
	var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
	var loose = arguments.length > 6 ? arguments[6] : false;

	/* @type {false | TypedPropertyDescriptor<unknown>} */
	var desc = !!gopd && gopd(obj, property);

	if ($defineProperty) {
		$defineProperty(obj, property, {
			configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
			enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
			value: value,
			writable: nonWritable === null && desc ? desc.writable : !nonWritable
		});
	} else if (loose || (!nonEnumerable && !nonWritable && !nonConfigurable)) {
		// must fall back to [[Set]], and was not explicitly asked to make non-enumerable, non-writable, or non-configurable
		obj[property] = value; // eslint-disable-line no-param-reassign
	} else {
		throw new $SyntaxError('This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.');
	}
};


/***/ }),

/***/ "./node_modules/es-define-property/index.js":
/*!**************************************************!*\
  !*** ./node_modules/es-define-property/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(/*! get-intrinsic */ "./node_modules/get-intrinsic/index.js");

/** @type {import('.')} */
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true) || false;
if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = false;
	}
}

module.exports = $defineProperty;


/***/ }),

/***/ "./node_modules/es-errors/eval.js":
/*!****************************************!*\
  !*** ./node_modules/es-errors/eval.js ***!
  \****************************************/
/***/ ((module) => {

"use strict";


/** @type {import('./eval')} */
module.exports = EvalError;


/***/ }),

/***/ "./node_modules/es-errors/index.js":
/*!*****************************************!*\
  !*** ./node_modules/es-errors/index.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";


/** @type {import('.')} */
module.exports = Error;


/***/ }),

/***/ "./node_modules/es-errors/range.js":
/*!*****************************************!*\
  !*** ./node_modules/es-errors/range.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";


/** @type {import('./range')} */
module.exports = RangeError;


/***/ }),

/***/ "./node_modules/es-errors/ref.js":
/*!***************************************!*\
  !*** ./node_modules/es-errors/ref.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";


/** @type {import('./ref')} */
module.exports = ReferenceError;


/***/ }),

/***/ "./node_modules/es-errors/syntax.js":
/*!******************************************!*\
  !*** ./node_modules/es-errors/syntax.js ***!
  \******************************************/
/***/ ((module) => {

"use strict";


/** @type {import('./syntax')} */
module.exports = SyntaxError;


/***/ }),

/***/ "./node_modules/es-errors/type.js":
/*!****************************************!*\
  !*** ./node_modules/es-errors/type.js ***!
  \****************************************/
/***/ ((module) => {

"use strict";


/** @type {import('./type')} */
module.exports = TypeError;


/***/ }),

/***/ "./node_modules/es-errors/uri.js":
/*!***************************************!*\
  !*** ./node_modules/es-errors/uri.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";


/** @type {import('./uri')} */
module.exports = URIError;


/***/ }),

/***/ "./node_modules/fast-printf/dist/src/createPrintf.js":
/*!***********************************************************!*\
  !*** ./node_modules/fast-printf/dist/src/createPrintf.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createPrintf = void 0;
const boolean_1 = __webpack_require__(/*! boolean */ "./node_modules/boolean/build/lib/index.js");
const tokenize_1 = __webpack_require__(/*! ./tokenize */ "./node_modules/fast-printf/dist/src/tokenize.js");
const formatDefaultUnboundExpression = (
// @ts-expect-error unused parameter
subject, token) => {
    return token.placeholder;
};
const createPrintf = (configuration) => {
    var _a;
    const padValue = (value, width, flag) => {
        if (flag === '-') {
            return value.padEnd(width, ' ');
        }
        else if (flag === '-+') {
            return ((Number(value) >= 0 ? '+' : '') + value).padEnd(width, ' ');
        }
        else if (flag === '+') {
            return ((Number(value) >= 0 ? '+' : '') + value).padStart(width, ' ');
        }
        else if (flag === '0') {
            return value.padStart(width, '0');
        }
        else {
            return value.padStart(width, ' ');
        }
    };
    const formatUnboundExpression = (_a = configuration === null || configuration === void 0 ? void 0 : configuration.formatUnboundExpression) !== null && _a !== void 0 ? _a : formatDefaultUnboundExpression;
    const cache = {};
    // eslint-disable-next-line complexity
    return (subject, ...boundValues) => {
        let tokens = cache[subject];
        if (!tokens) {
            tokens = cache[subject] = tokenize_1.tokenize(subject);
        }
        let result = '';
        for (const token of tokens) {
            if (token.type === 'literal') {
                result += token.literal;
            }
            else {
                let boundValue = boundValues[token.position];
                if (boundValue === undefined) {
                    result += formatUnboundExpression(subject, token, boundValues);
                }
                else if (token.conversion === 'b') {
                    result += boolean_1.boolean(boundValue) ? 'true' : 'false';
                }
                else if (token.conversion === 'B') {
                    result += boolean_1.boolean(boundValue) ? 'TRUE' : 'FALSE';
                }
                else if (token.conversion === 'c') {
                    result += boundValue;
                }
                else if (token.conversion === 'C') {
                    result += String(boundValue).toUpperCase();
                }
                else if (token.conversion === 'i' || token.conversion === 'd') {
                    boundValue = String(Math.trunc(boundValue));
                    if (token.width !== null) {
                        boundValue = padValue(boundValue, token.width, token.flag);
                    }
                    result += boundValue;
                }
                else if (token.conversion === 'e') {
                    result += Number(boundValue)
                        .toExponential();
                }
                else if (token.conversion === 'E') {
                    result += Number(boundValue)
                        .toExponential()
                        .toUpperCase();
                }
                else if (token.conversion === 'f') {
                    if (token.precision !== null) {
                        boundValue = Number(boundValue).toFixed(token.precision);
                    }
                    if (token.width !== null) {
                        boundValue = padValue(String(boundValue), token.width, token.flag);
                    }
                    result += boundValue;
                }
                else if (token.conversion === 'o') {
                    result += (Number.parseInt(String(boundValue), 10) >>> 0).toString(8);
                }
                else if (token.conversion === 's') {
                    if (token.width !== null) {
                        boundValue = padValue(String(boundValue), token.width, token.flag);
                    }
                    result += boundValue;
                }
                else if (token.conversion === 'S') {
                    if (token.width !== null) {
                        boundValue = padValue(String(boundValue), token.width, token.flag);
                    }
                    result += String(boundValue).toUpperCase();
                }
                else if (token.conversion === 'u') {
                    result += Number.parseInt(String(boundValue), 10) >>> 0;
                }
                else if (token.conversion === 'x') {
                    boundValue = (Number.parseInt(String(boundValue), 10) >>> 0).toString(16);
                    if (token.width !== null) {
                        boundValue = padValue(String(boundValue), token.width, token.flag);
                    }
                    result += boundValue;
                }
                else {
                    throw new Error('Unknown format specifier.');
                }
            }
        }
        return result;
    };
};
exports.createPrintf = createPrintf;


/***/ }),

/***/ "./node_modules/fast-printf/dist/src/printf.js":
/*!*****************************************************!*\
  !*** ./node_modules/fast-printf/dist/src/printf.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.printf = exports.createPrintf = void 0;
const createPrintf_1 = __webpack_require__(/*! ./createPrintf */ "./node_modules/fast-printf/dist/src/createPrintf.js");
Object.defineProperty(exports, "createPrintf", ({ enumerable: true, get: function () { return createPrintf_1.createPrintf; } }));
exports.printf = createPrintf_1.createPrintf();


/***/ }),

/***/ "./node_modules/fast-printf/dist/src/tokenize.js":
/*!*******************************************************!*\
  !*** ./node_modules/fast-printf/dist/src/tokenize.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tokenize = void 0;
const TokenRule = /(?:%(?<flag>([+0-]|-\+))?(?<width>\d+)?(?<position>\d+\$)?(?<precision>\.\d+)?(?<conversion>[%BCESb-iosux]))|(\\%)/g;
const tokenize = (subject) => {
    let matchResult;
    const tokens = [];
    let argumentIndex = 0;
    let lastIndex = 0;
    let lastToken = null;
    while ((matchResult = TokenRule.exec(subject)) !== null) {
        if (matchResult.index > lastIndex) {
            lastToken = {
                literal: subject.slice(lastIndex, matchResult.index),
                type: 'literal',
            };
            tokens.push(lastToken);
        }
        const match = matchResult[0];
        lastIndex = matchResult.index + match.length;
        if (match === '\\%' || match === '%%') {
            if (lastToken && lastToken.type === 'literal') {
                lastToken.literal += '%';
            }
            else {
                lastToken = {
                    literal: '%',
                    type: 'literal',
                };
                tokens.push(lastToken);
            }
        }
        else if (matchResult.groups) {
            lastToken = {
                conversion: matchResult.groups.conversion,
                flag: matchResult.groups.flag || null,
                placeholder: match,
                position: matchResult.groups.position ? Number.parseInt(matchResult.groups.position, 10) - 1 : argumentIndex++,
                precision: matchResult.groups.precision ? Number.parseInt(matchResult.groups.precision.slice(1), 10) : null,
                type: 'placeholder',
                width: matchResult.groups.width ? Number.parseInt(matchResult.groups.width, 10) : null,
            };
            tokens.push(lastToken);
        }
    }
    if (lastIndex <= subject.length - 1) {
        if (lastToken && lastToken.type === 'literal') {
            lastToken.literal += subject.slice(lastIndex);
        }
        else {
            tokens.push({
                literal: subject.slice(lastIndex),
                type: 'literal',
            });
        }
    }
    return tokens;
};
exports.tokenize = tokenize;


/***/ }),

/***/ "./node_modules/function-bind/implementation.js":
/*!******************************************************!*\
  !*** ./node_modules/function-bind/implementation.js ***!
  \******************************************************/
/***/ ((module) => {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var toStr = Object.prototype.toString;
var max = Math.max;
var funcType = '[object Function]';

var concatty = function concatty(a, b) {
    var arr = [];

    for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
    }
    for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
    }

    return arr;
};

var slicy = function slicy(arrLike, offset) {
    var arr = [];
    for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
    }
    return arr;
};

var joiny = function (arr, joiner) {
    var str = '';
    for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
            str += joiner;
        }
    }
    return str;
};

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                concatty(args, arguments)
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        }
        return target.apply(
            that,
            concatty(args, arguments)
        );

    };

    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = '$' + i;
    }

    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ "./node_modules/function-bind/index.js":
/*!*********************************************!*\
  !*** ./node_modules/function-bind/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(/*! ./implementation */ "./node_modules/function-bind/implementation.js");

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ "./node_modules/get-intrinsic/index.js":
/*!*********************************************!*\
  !*** ./node_modules/get-intrinsic/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var undefined;

var $Error = __webpack_require__(/*! es-errors */ "./node_modules/es-errors/index.js");
var $EvalError = __webpack_require__(/*! es-errors/eval */ "./node_modules/es-errors/eval.js");
var $RangeError = __webpack_require__(/*! es-errors/range */ "./node_modules/es-errors/range.js");
var $ReferenceError = __webpack_require__(/*! es-errors/ref */ "./node_modules/es-errors/ref.js");
var $SyntaxError = __webpack_require__(/*! es-errors/syntax */ "./node_modules/es-errors/syntax.js");
var $TypeError = __webpack_require__(/*! es-errors/type */ "./node_modules/es-errors/type.js");
var $URIError = __webpack_require__(/*! es-errors/uri */ "./node_modules/es-errors/uri.js");

var $Function = Function;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = __webpack_require__(/*! has-symbols */ "./node_modules/has-symbols/index.js")();
var hasProto = __webpack_require__(/*! has-proto */ "./node_modules/has-proto/index.js")();

var getProto = Object.getPrototypeOf || (
	hasProto
		? function (x) { return x.__proto__; } // eslint-disable-line no-proto
		: null
);

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	__proto__: null,
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
	'%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': $Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': $EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': $RangeError,
	'%ReferenceError%': $ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': $URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

if (getProto) {
	try {
		null.error; // eslint-disable-line no-unused-expressions
	} catch (e) {
		// https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
		var errorProto = getProto(getProto(e));
		INTRINSICS['%Error.prototype%'] = errorProto;
	}
}

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen && getProto) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	__proto__: null,
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = __webpack_require__(/*! function-bind */ "./node_modules/function-bind/index.js");
var hasOwn = __webpack_require__(/*! hasown */ "./node_modules/hasown/index.js");
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};


/***/ }),

/***/ "./node_modules/gopd/index.js":
/*!************************************!*\
  !*** ./node_modules/gopd/index.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(/*! get-intrinsic */ "./node_modules/get-intrinsic/index.js");

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);

if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;


/***/ }),

/***/ "./node_modules/has-property-descriptors/index.js":
/*!********************************************************!*\
  !*** ./node_modules/has-property-descriptors/index.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var $defineProperty = __webpack_require__(/*! es-define-property */ "./node_modules/es-define-property/index.js");

var hasPropertyDescriptors = function hasPropertyDescriptors() {
	return !!$defineProperty;
};

hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
	// node v0.6 has a bug where array lengths can be Set but not Defined
	if (!$defineProperty) {
		return null;
	}
	try {
		return $defineProperty([], 'length', { value: 1 }).length !== 1;
	} catch (e) {
		// In Firefox 4-22, defining length on an array throws an exception.
		return true;
	}
};

module.exports = hasPropertyDescriptors;


/***/ }),

/***/ "./node_modules/has-proto/index.js":
/*!*****************************************!*\
  !*** ./node_modules/has-proto/index.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";


var test = {
	__proto__: null,
	foo: {}
};

var $Object = Object;

/** @type {import('.')} */
module.exports = function hasProto() {
	// @ts-expect-error: TS errors on an inherited property for some reason
	return { __proto__: test }.foo === test.foo
		&& !(test instanceof $Object);
};


/***/ }),

/***/ "./node_modules/has-symbols/index.js":
/*!*******************************************!*\
  !*** ./node_modules/has-symbols/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __webpack_require__(/*! ./shams */ "./node_modules/has-symbols/shams.js");

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};


/***/ }),

/***/ "./node_modules/has-symbols/shams.js":
/*!*******************************************!*\
  !*** ./node_modules/has-symbols/shams.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";


/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};


/***/ }),

/***/ "./node_modules/hasown/index.js":
/*!**************************************!*\
  !*** ./node_modules/hasown/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind = __webpack_require__(/*! function-bind */ "./node_modules/function-bind/index.js");

/** @type {import('.')} */
module.exports = bind.call(call, $hasOwn);


/***/ }),

/***/ "./node_modules/i18n/i18n.js":
/*!***********************************!*\
  !*** ./node_modules/i18n/i18n.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
var __dirname = "/";
/**
 * @author      Created by Marcus Spiegel <spiegel@uscreen.de> on 2011-03-25.
 * @link        https://github.com/mashpie/i18n-node
 * @license     http://opensource.org/licenses/MIT
 */



// dependencies
const printf = (__webpack_require__(/*! fast-printf */ "./node_modules/fast-printf/dist/src/printf.js").printf)
const pkgVersion = (__webpack_require__(/*! ./package.json */ "./node_modules/i18n/package.json").version)
const fs = __webpack_require__(/*! fs */ "?5818")
const url = __webpack_require__(/*! url */ "./node_modules/url/url.js")
const path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js")
const debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")('i18n:debug')
const warn = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")('i18n:warn')
const error = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")('i18n:error')
const Mustache = __webpack_require__(/*! mustache */ "./node_modules/mustache/mustache.js")
const Messageformat = __webpack_require__(/*! @messageformat/core */ "./node_modules/@messageformat/core/messageformat.js")
const MakePlural = __webpack_require__(/*! make-plural */ "./node_modules/make-plural/plurals.mjs")
const parseInterval = (__webpack_require__(/*! math-interval-parser */ "./node_modules/math-interval-parser/lib/index.js")["default"])

// utils
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string

/**
 * create constructor function
 */
const i18n = function I18n(_OPTS = false) {
  const MessageformatInstanceForLocale = {}
  const PluralsForLocale = {}
  let locales = {}
  const api = {
    __: '__',
    __n: '__n',
    __l: '__l',
    __h: '__h',
    __mf: '__mf',
    getLocale: 'getLocale',
    setLocale: 'setLocale',
    getCatalog: 'getCatalog',
    getLocales: 'getLocales',
    addLocale: 'addLocale',
    removeLocale: 'removeLocale'
  }
  const mustacheConfig = {
    tags: ['{{', '}}'],
    disable: false
  }

  let mustacheRegex
  const pathsep = path.sep // ---> means win support will be available in node 0.8.x and above
  let autoReload
  let cookiename
  let languageHeaderName
  let defaultLocale
  let retryInDefaultLocale
  let directory
  let directoryPermissions
  let extension
  let fallbacks
  let indent
  let logDebugFn
  let logErrorFn
  let logWarnFn
  let preserveLegacyCase
  let objectNotation
  let prefix
  let queryParameter
  let register
  let updateFiles
  let syncFiles
  let missingKeyFn
  let parser

  // public exports
  const i18n = {}

  i18n.version = pkgVersion

  i18n.configure = function i18nConfigure(opt) {
    // reset locales
    locales = {}

    // Provide custom API method aliases if desired
    // This needs to be processed before the first call to applyAPItoObject()
    if (opt.api && typeof opt.api === 'object') {
      for (const method in opt.api) {
        if (Object.prototype.hasOwnProperty.call(opt.api, method)) {
          const alias = opt.api[method]
          if (typeof api[method] !== 'undefined') {
            api[method] = alias
          }
        }
      }
    }

    // you may register i18n in global scope, up to you
    if (typeof opt.register === 'object') {
      register = opt.register
      // or give an array objects to register to
      if (Array.isArray(opt.register)) {
        register = opt.register
        register.forEach(applyAPItoObject)
      } else {
        applyAPItoObject(opt.register)
      }
    }

    // sets a custom cookie name to parse locale settings from
    cookiename = typeof opt.cookie === 'string' ? opt.cookie : null

    // set the custom header name to extract the language locale
    languageHeaderName =
      typeof opt.header === 'string' ? opt.header : 'accept-language'

    // query-string parameter to be watched - @todo: add test & doc
    queryParameter =
      typeof opt.queryParameter === 'string' ? opt.queryParameter : null

    // where to store json files
    directory =
      typeof opt.directory === 'string'
        ? opt.directory
        : path.join(__dirname, 'locales')

    // permissions when creating new directories
    directoryPermissions =
      typeof opt.directoryPermissions === 'string'
        ? parseInt(opt.directoryPermissions, 8)
        : null

    // write new locale information to disk
    updateFiles = typeof opt.updateFiles === 'boolean' ? opt.updateFiles : true

    // sync locale information accros all files
    syncFiles = typeof opt.syncFiles === 'boolean' ? opt.syncFiles : false

    // what to use as the indentation unit (ex: "\t", "  ")
    indent = typeof opt.indent === 'string' ? opt.indent : '\t'

    // json files prefix
    prefix = typeof opt.prefix === 'string' ? opt.prefix : ''

    // where to store json files
    extension = typeof opt.extension === 'string' ? opt.extension : '.json'

    // setting defaultLocale
    defaultLocale =
      typeof opt.defaultLocale === 'string' ? opt.defaultLocale : 'en'

    // allow to retry in default locale, useful for production
    retryInDefaultLocale =
      typeof opt.retryInDefaultLocale === 'boolean'
        ? opt.retryInDefaultLocale
        : false

    // auto reload locale files when changed
    autoReload = typeof opt.autoReload === 'boolean' ? opt.autoReload : false

    // enable object notation?
    objectNotation =
      typeof opt.objectNotation !== 'undefined' ? opt.objectNotation : false
    if (objectNotation === true) objectNotation = '.'

    // read language fallback map
    fallbacks = typeof opt.fallbacks === 'object' ? opt.fallbacks : {}

    // setting custom logger functions
    logDebugFn = typeof opt.logDebugFn === 'function' ? opt.logDebugFn : debug
    logWarnFn = typeof opt.logWarnFn === 'function' ? opt.logWarnFn : warn
    logErrorFn = typeof opt.logErrorFn === 'function' ? opt.logErrorFn : error

    preserveLegacyCase =
      typeof opt.preserveLegacyCase === 'boolean'
        ? opt.preserveLegacyCase
        : true

    // setting custom missing key function
    missingKeyFn =
      typeof opt.missingKeyFn === 'function' ? opt.missingKeyFn : missingKey

    parser =
      typeof opt.parser === 'object' &&
      typeof opt.parser.parse === 'function' &&
      typeof opt.parser.stringify === 'function'
        ? opt.parser
        : JSON

    // when missing locales we try to guess that from directory
    opt.locales = opt.staticCatalog
      ? Object.keys(opt.staticCatalog)
      : opt.locales || guessLocales(directory)

    // some options should be disabled when using staticCatalog
    if (opt.staticCatalog) {
      updateFiles = false
      autoReload = false
      syncFiles = false
    }

    // customize mustache parsing
    if (opt.mustacheConfig) {
      if (Array.isArray(opt.mustacheConfig.tags)) {
        mustacheConfig.tags = opt.mustacheConfig.tags
      }
      if (opt.mustacheConfig.disable === true) {
        mustacheConfig.disable = true
      }
    }

    const [start, end] = mustacheConfig.tags
    mustacheRegex = new RegExp(escapeRegExp(start) + '.*' + escapeRegExp(end))

    // implicitly read all locales
    if (Array.isArray(opt.locales)) {
      if (opt.staticCatalog) {
        locales = opt.staticCatalog
      } else {
        opt.locales.forEach(read)
      }

      // auto reload locale files when changed
      if (autoReload) {
        // watch changes of locale files (it's called twice because fs.watch is still unstable)
        fs.watch(directory, (event, filename) => {
          const localeFromFile = guessLocaleFromFile(filename)

          if (localeFromFile && opt.locales.indexOf(localeFromFile) > -1) {
            logDebug('Auto reloading locale file "' + filename + '".')
            read(localeFromFile)
          }
        })
      }
    }
  }

  i18n.init = function i18nInit(request, response, next) {
    if (typeof request === 'object') {
      // guess requested language/locale
      guessLanguage(request)

      // bind api to req
      applyAPItoObject(request)

      // looks double but will ensure schema on api refactor
      i18n.setLocale(request, request.locale)
    } else {
      return logError(
        'i18n.init must be called with one parameter minimum, ie. i18n.init(req)'
      )
    }

    if (typeof response === 'object') {
      applyAPItoObject(response)

      // and set that locale to response too
      i18n.setLocale(response, request.locale)
    }

    // head over to next callback when bound as middleware
    if (typeof next === 'function') {
      return next()
    }
  }

  i18n.__ = function i18nTranslate(phrase) {
    let msg
    const argv = parseArgv(arguments)
    const namedValues = argv[0]
    const args = argv[1]

    // called like __({phrase: "Hello", locale: "en"})
    if (typeof phrase === 'object') {
      if (
        typeof phrase.locale === 'string' &&
        typeof phrase.phrase === 'string'
      ) {
        msg = translate(phrase.locale, phrase.phrase)
      }
    }
    // called like __("Hello")
    else {
      // get translated message with locale from scope (deprecated) or object
      msg = translate(getLocaleFromObject(this), phrase)
    }

    // postprocess to get compatible to plurals
    if (typeof msg === 'object' && msg.one) {
      msg = msg.one
    }

    // in case there is no 'one' but an 'other' rule
    if (typeof msg === 'object' && msg.other) {
      msg = msg.other
    }

    // head over to postProcessing
    return postProcess(msg, namedValues, args)
  }

  i18n.__mf = function i18nMessageformat(phrase) {
    let msg, mf, f
    let targetLocale = defaultLocale
    const argv = parseArgv(arguments)
    const namedValues = argv[0]
    const args = argv[1]

    // called like __({phrase: "Hello", locale: "en"})
    if (typeof phrase === 'object') {
      if (
        typeof phrase.locale === 'string' &&
        typeof phrase.phrase === 'string'
      ) {
        msg = phrase.phrase
        targetLocale = phrase.locale
      }
    }
    // called like __("Hello")
    else {
      // get translated message with locale from scope (deprecated) or object
      msg = phrase
      targetLocale = getLocaleFromObject(this)
    }

    msg = translate(targetLocale, msg)
    // --- end get msg

    // now head over to Messageformat
    // and try to cache instance
    if (MessageformatInstanceForLocale[targetLocale]) {
      mf = MessageformatInstanceForLocale[targetLocale]
    } else {
      mf = new Messageformat(targetLocale)

      mf.compiledFunctions = {}
      MessageformatInstanceForLocale[targetLocale] = mf
    }

    // let's try to cache that function
    if (mf.compiledFunctions[msg]) {
      f = mf.compiledFunctions[msg]
    } else {
      f = mf.compile(msg)
      mf.compiledFunctions[msg] = f
    }

    return postProcess(f(namedValues), namedValues, args)
  }

  i18n.__l = function i18nTranslationList(phrase) {
    const translations = []
    Object.keys(locales)
      .sort()
      .forEach((l) => {
        translations.push(i18n.__({ phrase: phrase, locale: l }))
      })
    return translations
  }

  i18n.__h = function i18nTranslationHash(phrase) {
    const translations = []
    Object.keys(locales)
      .sort()
      .forEach((l) => {
        const hash = {}
        hash[l] = i18n.__({ phrase: phrase, locale: l })
        translations.push(hash)
      })
    return translations
  }

  i18n.__n = function i18nTranslatePlural(singular, plural, count) {
    let msg
    let namedValues
    let targetLocale
    let args = []

    // Accept an object with named values as the last parameter
    if (argsEndWithNamedObject(arguments)) {
      namedValues = arguments[arguments.length - 1]
      args =
        arguments.length >= 5
          ? Array.prototype.slice.call(arguments, 3, -1)
          : []
    } else {
      namedValues = {}
      args =
        arguments.length >= 4 ? Array.prototype.slice.call(arguments, 3) : []
    }

    // called like __n({singular: "%s cat", plural: "%s cats", locale: "en"}, 3)
    if (typeof singular === 'object') {
      if (
        typeof singular.locale === 'string' &&
        typeof singular.singular === 'string' &&
        typeof singular.plural === 'string'
      ) {
        targetLocale = singular.locale
        msg = translate(singular.locale, singular.singular, singular.plural)
      }
      args.unshift(count)

      // some template engines pass all values as strings -> so we try to convert them to numbers
      if (typeof plural === 'number' || Number(plural) + '' === plural) {
        count = plural
      }

      // called like __n({singular: "%s cat", plural: "%s cats", locale: "en", count: 3})
      if (
        typeof singular.count === 'number' ||
        typeof singular.count === 'string'
      ) {
        count = singular.count
        args.unshift(plural)
      }
    } else {
      // called like  __n('cat', 3)
      if (typeof plural === 'number' || Number(plural) + '' === plural) {
        count = plural

        // we add same string as default
        // which efectivly copies the key to the plural.value
        // this is for initialization of new empty translations
        plural = singular

        args.unshift(count)
        args.unshift(plural)
      }
      // called like __n('%s cat', '%s cats', 3)
      // get translated message with locale from scope (deprecated) or object
      msg = translate(getLocaleFromObject(this), singular, plural)
      targetLocale = getLocaleFromObject(this)
    }

    if (count === null) count = namedValues.count

    // enforce number
    count = Number(count)

    // find the correct plural rule for given locale
    if (typeof msg === 'object') {
      let p
      // create a new Plural for locale
      // and try to cache instance
      if (PluralsForLocale[targetLocale]) {
        p = PluralsForLocale[targetLocale]
      } else {
        // split locales with a region code
        const lc = targetLocale
          .toLowerCase()
          .split(/[_-\s]+/)
          .filter((el) =>  true && el)
        // take the first part of locale, fallback to full locale
        p = MakePlural[lc[0] || targetLocale]
        PluralsForLocale[targetLocale] = p
      }

      // fallback to 'other' on case of missing translations
      msg = msg[p(count)] || msg.other
    }

    // head over to postProcessing
    return postProcess(msg, namedValues, args, count)
  }

  i18n.setLocale = function i18nSetLocale(object, locale, skipImplicitObjects) {
    // when given an array of objects => setLocale on each
    if (Array.isArray(object) && typeof locale === 'string') {
      for (let i = object.length - 1; i >= 0; i--) {
        i18n.setLocale(object[i], locale, true)
      }
      return i18n.getLocale(object[0])
    }

    // defaults to called like i18n.setLocale(req, 'en')
    let targetObject = object
    let targetLocale = locale

    // called like req.setLocale('en') or i18n.setLocale('en')
    if (locale === undefined && typeof object === 'string') {
      targetObject = this
      targetLocale = object
    }

    // consider a fallback
    if (!locales[targetLocale]) {
      targetLocale = getFallback(targetLocale, fallbacks) || targetLocale
    }

    // now set locale on object
    targetObject.locale = locales[targetLocale] ? targetLocale : defaultLocale

    // consider any extra registered objects
    if (typeof register === 'object') {
      if (Array.isArray(register) && !skipImplicitObjects) {
        register.forEach((r) => {
          r.locale = targetObject.locale
        })
      } else {
        register.locale = targetObject.locale
      }
    }

    // consider res
    if (targetObject.res && !skipImplicitObjects) {
      // escape recursion
      // @see  - https://github.com/balderdashy/sails/pull/3631
      //       - https://github.com/mashpie/i18n-node/pull/218
      if (targetObject.res.locals) {
        i18n.setLocale(targetObject.res, targetObject.locale, true)
        i18n.setLocale(targetObject.res.locals, targetObject.locale, true)
      } else {
        i18n.setLocale(targetObject.res, targetObject.locale)
      }
    }

    // consider locals
    if (targetObject.locals && !skipImplicitObjects) {
      // escape recursion
      // @see  - https://github.com/balderdashy/sails/pull/3631
      //       - https://github.com/mashpie/i18n-node/pull/218
      if (targetObject.locals.res) {
        i18n.setLocale(targetObject.locals, targetObject.locale, true)
        i18n.setLocale(targetObject.locals.res, targetObject.locale, true)
      } else {
        i18n.setLocale(targetObject.locals, targetObject.locale)
      }
    }

    return i18n.getLocale(targetObject)
  }

  i18n.getLocale = function i18nGetLocale(request) {
    // called like i18n.getLocale(req)
    if (request && request.locale) {
      return request.locale
    }

    // called like req.getLocale()
    return this.locale || defaultLocale
  }

  i18n.getCatalog = function i18nGetCatalog(object, locale) {
    let targetLocale

    // called like i18n.getCatalog(req)
    if (
      typeof object === 'object' &&
      typeof object.locale === 'string' &&
      locale === undefined
    ) {
      targetLocale = object.locale
    }

    // called like i18n.getCatalog(req, 'en')
    if (
      !targetLocale &&
      typeof object === 'object' &&
      typeof locale === 'string'
    ) {
      targetLocale = locale
    }

    // called like req.getCatalog('en')
    if (!targetLocale && locale === undefined && typeof object === 'string') {
      targetLocale = object
    }

    // called like req.getCatalog()
    if (
      !targetLocale &&
      object === undefined &&
      locale === undefined &&
      typeof this.locale === 'string'
    ) {
      if (register && register.global) {
        targetLocale = ''
      } else {
        targetLocale = this.locale
      }
    }

    // called like i18n.getCatalog()
    if (targetLocale === undefined || targetLocale === '') {
      return locales
    }

    if (!locales[targetLocale]) {
      targetLocale = getFallback(targetLocale, fallbacks) || targetLocale
    }

    if (locales[targetLocale]) {
      return locales[targetLocale]
    } else {
      logWarn('No catalog found for "' + targetLocale + '"')
      return false
    }
  }

  i18n.getLocales = function i18nGetLocales() {
    return Object.keys(locales)
  }

  i18n.addLocale = function i18nAddLocale(locale) {
    read(locale)
  }

  i18n.removeLocale = function i18nRemoveLocale(locale) {
    delete locales[locale]
  }

  // ===================
  // = private methods =
  // ===================

  const postProcess = (msg, namedValues, args, count) => {
    // test for parsable interval string
    if (/\|/.test(msg)) {
      msg = parsePluralInterval(msg, count)
    }

    // replace the counter
    if (typeof count === 'number') {
      msg = printf(msg, Number(count))
    }

    // if the msg string contains {{Mustache}} patterns we render it as a mini template
    if (!mustacheConfig.disable && mustacheRegex.test(msg)) {
      msg = Mustache.render(msg, namedValues, {}, mustacheConfig.tags)
    }

    // if we have extra arguments with values to get replaced,
    // an additional substition injects those strings afterwards
    if (/%/.test(msg) && args && args.length > 0) {
      msg = printf(msg, ...args)
    }

    return msg
  }

  const argsEndWithNamedObject = (args) =>
    args.length > 1 &&
    args[args.length - 1] !== null &&
    typeof args[args.length - 1] === 'object'

  const parseArgv = (args) => {
    let namedValues, returnArgs

    if (argsEndWithNamedObject(args)) {
      namedValues = args[args.length - 1]
      returnArgs = Array.prototype.slice.call(args, 1, -1)
    } else {
      namedValues = {}
      returnArgs = args.length >= 2 ? Array.prototype.slice.call(args, 1) : []
    }

    return [namedValues, returnArgs]
  }

  /**
   * registers all public API methods to a given response object when not already declared
   */
  const applyAPItoObject = (object) => {
    let alreadySetted = true

    // attach to itself if not provided
    for (const method in api) {
      if (Object.prototype.hasOwnProperty.call(api, method)) {
        const alias = api[method]

        // be kind rewind, or better not touch anything already existing
        if (!object[alias]) {
          alreadySetted = false
          object[alias] = i18n[method].bind(object)
        }
      }
    }

    // set initial locale if not set
    if (!object.locale) {
      object.locale = defaultLocale
    }

    // escape recursion
    if (alreadySetted) {
      return
    }

    // attach to response if present (ie. in express)
    if (object.res) {
      applyAPItoObject(object.res)
    }

    // attach to locals if present (ie. in express)
    if (object.locals) {
      applyAPItoObject(object.locals)
    }
  }

  /**
   * tries to guess locales by scanning the given directory
   */
  const guessLocales = (directory) => {
    const entries = fs.readdirSync(directory)
    const localesFound = []

    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i].match(/^\./)) continue
      const localeFromFile = guessLocaleFromFile(entries[i])
      if (localeFromFile) localesFound.push(localeFromFile)
    }

    return localesFound.sort()
  }

  /**
   * tries to guess locales from a given filename
   */
  const guessLocaleFromFile = (filename) => {
    const extensionRegex = new RegExp(extension + '$', 'g')
    const prefixRegex = new RegExp('^' + prefix, 'g')

    if (!filename) return false
    if (prefix && !filename.match(prefixRegex)) return false
    if (extension && !filename.match(extensionRegex)) return false
    return filename.replace(prefix, '').replace(extensionRegex, '')
  }

  /**
   * @param queryLanguage - language query parameter, either an array or a string.
   * @return the first non-empty language query parameter found, null otherwise.
   */
  const extractQueryLanguage = (queryLanguage) => {
    if (Array.isArray(queryLanguage)) {
      return queryLanguage.find((lang) => lang !== '' && lang)
    }
    return typeof queryLanguage === 'string' && queryLanguage
  }

  /**
   * guess language setting based on http headers
   */

  const guessLanguage = (request) => {
    if (typeof request === 'object') {
      const languageHeader = request.headers
        ? request.headers[languageHeaderName]
        : undefined
      const languages = []
      const regions = []

      request.languages = [defaultLocale]
      request.regions = [defaultLocale]
      request.language = defaultLocale
      request.region = defaultLocale

      // a query parameter overwrites all
      if (queryParameter && request.url) {
        const urlAsString =
          typeof request.url === 'string' ? request.url : request.url.toString()

        /**
         * @todo WHATWG new URL() requires full URL including hostname - that might change
         * @see https://github.com/nodejs/node/issues/12682
         */
        // eslint-disable-next-line node/no-deprecated-api
        const urlObj = url.parse(urlAsString, true)
        const languageQueryParameter = urlObj.query[queryParameter]
        if (languageQueryParameter) {
          let queryLanguage = extractQueryLanguage(languageQueryParameter)
          if (queryLanguage) {
            logDebug('Overriding locale from query: ' + queryLanguage)
            if (preserveLegacyCase) {
              queryLanguage = queryLanguage.toLowerCase()
            }
            return i18n.setLocale(request, queryLanguage)
          }
        }
      }

      // a cookie overwrites headers
      if (cookiename && request.cookies && request.cookies[cookiename]) {
        request.language = request.cookies[cookiename]
        return i18n.setLocale(request, request.language)
      }

      // 'accept-language' is the most common source
      if (languageHeader) {
        const acceptedLanguages = getAcceptedLanguagesFromHeader(languageHeader)
        let match
        let fallbackMatch
        let fallback
        for (let i = 0; i < acceptedLanguages.length; i++) {
          const lang = acceptedLanguages[i]
          const lr = lang.split('-', 2)
          const parentLang = lr[0]
          const region = lr[1]

          // Check if we have a configured fallback set for this language.
          const fallbackLang = getFallback(lang, fallbacks)
          if (fallbackLang) {
            fallback = fallbackLang
            // Fallbacks for languages should be inserted
            // where the original, unsupported language existed.
            const acceptedLanguageIndex = acceptedLanguages.indexOf(lang)
            const fallbackIndex = acceptedLanguages.indexOf(fallback)
            if (fallbackIndex > -1) {
              acceptedLanguages.splice(fallbackIndex, 1)
            }
            acceptedLanguages.splice(acceptedLanguageIndex + 1, 0, fallback)
          }

          // Check if we have a configured fallback set for the parent language of the locale.
          const fallbackParentLang = getFallback(parentLang, fallbacks)
          if (fallbackParentLang) {
            fallback = fallbackParentLang
            // Fallbacks for a parent language should be inserted
            // to the end of the list, so they're only picked
            // if there is no better match.
            if (acceptedLanguages.indexOf(fallback) < 0) {
              acceptedLanguages.push(fallback)
            }
          }

          if (languages.indexOf(parentLang) < 0) {
            languages.push(parentLang.toLowerCase())
          }
          if (region) {
            regions.push(region.toLowerCase())
          }

          if (!match && locales[lang]) {
            match = lang
            break
          }

          if (!fallbackMatch && locales[parentLang]) {
            fallbackMatch = parentLang
          }
        }

        request.language = match || fallbackMatch || request.language
        request.region = regions[0] || request.region
        return i18n.setLocale(request, request.language)
      }
    }

    // last resort: defaultLocale
    return i18n.setLocale(request, defaultLocale)
  }

  /**
   * Get a sorted list of accepted languages from the HTTP Accept-Language header
   */
  const getAcceptedLanguagesFromHeader = (header) => {
    const languages = header.split(',')
    const preferences = {}
    return languages
      .map((item) => {
        const preferenceParts = item.trim().split(';q=')
        if (preferenceParts.length < 2) {
          preferenceParts[1] = 1.0
        } else {
          const quality = parseFloat(preferenceParts[1])
          preferenceParts[1] = quality || 0.0
        }
        preferences[preferenceParts[0]] = preferenceParts[1]

        return preferenceParts[0]
      })
      .filter((lang) => preferences[lang] > 0)
      .sort((a, b) => preferences[b] - preferences[a])
  }

  /**
   * searches for locale in given object
   */

  const getLocaleFromObject = (obj) => {
    let locale
    if (obj && obj.scope) {
      locale = obj.scope.locale
    }
    if (obj && obj.locale) {
      locale = obj.locale
    }
    return locale
  }

  /**
   * splits and parses a phrase for mathematical interval expressions
   */
  const parsePluralInterval = (phrase, count) => {
    let returnPhrase = phrase
    const phrases = phrase.split(/\|/)
    let intervalRuleExists = false

    // some() breaks on 1st true
    phrases.some((p) => {
      const matches = p.match(/^\s*([()[\]]+[\d,]+[()[\]]+)?\s*(.*)$/)

      // not the same as in combined condition
      if (matches != null && matches[1]) {
        intervalRuleExists = true
        if (matchInterval(count, matches[1]) === true) {
          returnPhrase = matches[2]
          return true
        }
      } else {
        // this is a other or catch all case, this only is taken into account if there is actually another rule
        if (intervalRuleExists) {
          returnPhrase = p
        }
      }
      return false
    })
    return returnPhrase
  }

  /**
   * test a number to match mathematical interval expressions
   * [0,2] - 0 to 2 (including, matches: 0, 1, 2)
   * ]0,3[ - 0 to 3 (excluding, matches: 1, 2)
   * [1]   - 1 (matches: 1)
   * [20,] - all numbers ≥20 (matches: 20, 21, 22, ...)
   * [,20] - all numbers ≤20 (matches: 20, 21, 22, ...)
   */
  const matchInterval = (number, interval) => {
    interval = parseInterval(interval)
    if (interval && typeof number === 'number') {
      if (interval.from.value === number) {
        return interval.from.included
      }
      if (interval.to.value === number) {
        return interval.to.included
      }

      return (
        Math.min(interval.from.value, number) === interval.from.value &&
        Math.max(interval.to.value, number) === interval.to.value
      )
    }
    return false
  }

  /**
   * read locale file, translate a msg and write to fs if new
   */
  const translate = (locale, singular, plural, skipSyncToAllFiles) => {
    // add same key to all translations
    if (!skipSyncToAllFiles && syncFiles) {
      syncToAllFiles(singular, plural)
    }

    if (locale === undefined) {
      logWarn(
        'WARN: No locale found - check the context of the call to __(). Using ' +
          defaultLocale +
          ' as current locale'
      )
      locale = defaultLocale
    }

    // try to get a fallback
    if (!locales[locale]) {
      locale = getFallback(locale, fallbacks) || locale
    }

    // attempt to read when defined as valid locale
    if (!locales[locale]) {
      read(locale)
    }

    // fallback to default when missed
    if (!locales[locale]) {
      logWarn(
        'WARN: Locale ' +
          locale +
          " couldn't be read - check the context of the call to $__. Using " +
          defaultLocale +
          ' (default) as current locale'
      )

      locale = defaultLocale
      read(locale)
    }

    // dotnotaction add on, @todo: factor out
    let defaultSingular = singular
    let defaultPlural = plural
    if (objectNotation) {
      let indexOfColon = singular.indexOf(':')
      // We compare against 0 instead of -1 because
      // we don't really expect the string to start with ':'.
      if (indexOfColon > 0) {
        defaultSingular = singular.substring(indexOfColon + 1)
        singular = singular.substring(0, indexOfColon)
      }
      if (plural && typeof plural !== 'number') {
        indexOfColon = plural.indexOf(':')
        if (indexOfColon > 0) {
          defaultPlural = plural.substring(indexOfColon + 1)
          plural = plural.substring(0, indexOfColon)
        }
      }
    }

    const accessor = localeAccessor(locale, singular)
    const mutator = localeMutator(locale, singular)

    // if (plural) {
    //   if (accessor() == null) {
    //     mutator({
    //       'one': defaultSingular || singular,
    //       'other': defaultPlural || plural
    //     });
    //     write(locale);
    //   }
    // }
    // if (accessor() == null) {
    //   mutator(defaultSingular || singular);
    //   write(locale);
    // }
    if (plural) {
      if (accessor() == null) {
        // when retryInDefaultLocale is true - try to set default value from defaultLocale
        if (retryInDefaultLocale && locale !== defaultLocale) {
          logDebug(
            'Missing ' +
              singular +
              ' in ' +
              locale +
              ' retrying in ' +
              defaultLocale
          )
          mutator(translate(defaultLocale, singular, plural, true))
        } else {
          mutator({
            one: defaultSingular || singular,
            other: defaultPlural || plural
          })
        }
        write(locale)
      }
    }

    if (accessor() == null) {
      // when retryInDefaultLocale is true - try to set default value from defaultLocale
      if (retryInDefaultLocale && locale !== defaultLocale) {
        logDebug(
          'Missing ' +
            singular +
            ' in ' +
            locale +
            ' retrying in ' +
            defaultLocale
        )
        mutator(translate(defaultLocale, singular, plural, true))
      } else {
        mutator(defaultSingular || singular)
      }
      write(locale)
    }

    return accessor()
  }

  /**
   * initialize the same key in all locales
   * when not already existing, checked via translate
   */
  const syncToAllFiles = (singular, plural) => {
    // iterate over locales and translate again
    // this will implicitly write/sync missing keys
    // to the rest of locales
    for (const l in locales) {
      translate(l, singular, plural, true)
    }
  }

  /**
   * Allows delayed access to translations nested inside objects.
   * @param {String} locale The locale to use.
   * @param {String} singular The singular term to look up.
   * @param {Boolean} [allowDelayedTraversal=true] Is delayed traversal of the tree allowed?
   * This parameter is used internally. It allows to signal the accessor that
   * a translation was not found in the initial lookup and that an invocation
   * of the accessor may trigger another traversal of the tree.
   * @returns {Function} A function that, when invoked, returns the current value stored
   * in the object at the requested location.
   */
  const localeAccessor = (locale, singular, allowDelayedTraversal) => {
    // Bail out on non-existent locales to defend against internal errors.
    if (!locales[locale]) return Function.prototype

    // Handle object lookup notation
    const indexOfDot = objectNotation && singular.lastIndexOf(objectNotation)
    if (objectNotation && indexOfDot > 0 && indexOfDot < singular.length - 1) {
      // If delayed traversal wasn't specifically forbidden, it is allowed.
      if (typeof allowDelayedTraversal === 'undefined')
        allowDelayedTraversal = true
      // The accessor we're trying to find and which we want to return.
      let accessor = null
      // An accessor that returns null.
      const nullAccessor = () => null
      // Do we need to re-traverse the tree upon invocation of the accessor?
      let reTraverse = false
      // Split the provided term and run the callback for each subterm.
      singular.split(objectNotation).reduce((object, index) => {
        // Make the accessor return null.
        accessor = nullAccessor
        // If our current target object (in the locale tree) doesn't exist or
        // it doesn't have the next subterm as a member...
        if (
          object === null ||
          !Object.prototype.hasOwnProperty.call(object, index)
        ) {
          // ...remember that we need retraversal (because we didn't find our target).
          reTraverse = allowDelayedTraversal
          // Return null to avoid deeper iterations.
          return null
        }
        // We can traverse deeper, so we generate an accessor for this current level.
        accessor = () => object[index]
        // Return a reference to the next deeper level in the locale tree.
        return object[index]
      }, locales[locale])
      // Return the requested accessor.
      return () =>
        // If we need to re-traverse (because we didn't find our target term)
        // traverse again and return the new result (but don't allow further iterations)
        // or return the previously found accessor if it was already valid.
        reTraverse ? localeAccessor(locale, singular, false)() : accessor()
    } else {
      // No object notation, just return an accessor that performs array lookup.
      return () => locales[locale][singular]
    }
  }

  /**
   * Allows delayed mutation of a translation nested inside objects.
   * @description Construction of the mutator will attempt to locate the requested term
   * inside the object, but if part of the branch does not exist yet, it will not be
   * created until the mutator is actually invoked. At that point, re-traversal of the
   * tree is performed and missing parts along the branch will be created.
   * @param {String} locale The locale to use.
   * @param {String} singular The singular term to look up.
   * @param [Boolean} [allowBranching=false] Is the mutator allowed to create previously
   * non-existent branches along the requested locale path?
   * @returns {Function} A function that takes one argument. When the function is
   * invoked, the targeted translation term will be set to the given value inside the locale table.
   */
  const localeMutator = function (locale, singular, allowBranching) {
    // Bail out on non-existent locales to defend against internal errors.
    if (!locales[locale]) return Function.prototype

    // Handle object lookup notation
    const indexOfDot = objectNotation && singular.lastIndexOf(objectNotation)
    if (objectNotation && indexOfDot > 0 && indexOfDot < singular.length - 1) {
      // If branching wasn't specifically allowed, disable it.
      if (typeof allowBranching === 'undefined') allowBranching = false
      // This will become the function we want to return.
      let accessor = null
      // An accessor that takes one argument and returns null.
      const nullAccessor = () => null
      // Fix object path.
      let fixObject = () => ({})
      // Are we going to need to re-traverse the tree when the mutator is invoked?
      let reTraverse = false
      // Split the provided term and run the callback for each subterm.
      singular.split(objectNotation).reduce((object, index) => {
        // Make the mutator do nothing.
        accessor = nullAccessor
        // If our current target object (in the locale tree) doesn't exist or
        // it doesn't have the next subterm as a member...
        if (
          object === null ||
          !Object.prototype.hasOwnProperty.call(object, index)
        ) {
          // ...check if we're allowed to create new branches.
          if (allowBranching) {
            // Fix `object` if `object` is not Object.
            if (object === null || typeof object !== 'object') {
              object = fixObject()
            }
            // If we are allowed to, create a new object along the path.
            object[index] = {}
          } else {
            // If we aren't allowed, remember that we need to re-traverse later on and...
            reTraverse = true
            // ...return null to make the next iteration bail our early on.
            return null
          }
        }
        // Generate a mutator for the current level.
        accessor = (value) => {
          object[index] = value
          return value
        }
        // Generate a fixer for the current level.
        fixObject = () => {
          object[index] = {}
          return object[index]
        }

        // Return a reference to the next deeper level in the locale tree.
        return object[index]
      }, locales[locale])

      // Return the final mutator.
      return (value) => {
        // If we need to re-traverse the tree
        // invoke the search again, but allow branching
        // this time (because here the mutator is being invoked)
        // otherwise, just change the value directly.
        value = missingKeyFn(locale, value)
        return reTraverse
          ? localeMutator(locale, singular, true)(value)
          : accessor(value)
      }
    } else {
      // No object notation, just return a mutator that performs array lookup and changes the value.
      return (value) => {
        value = missingKeyFn(locale, value)
        locales[locale][singular] = value
        return value
      }
    }
  }

  /**
   * try reading a file
   */
  const read = (locale) => {
    let localeFile = {}
    const file = getStorageFilePath(locale)
    try {
      logDebug('read ' + file + ' for locale: ' + locale)
      localeFile = fs.readFileSync(file, 'utf-8')
      try {
        // parsing filecontents to locales[locale]
        locales[locale] = parser.parse(localeFile)
      } catch (parseError) {
        logError(
          'unable to parse locales from file (maybe ' +
            file +
            ' is empty or invalid json?): ',
          parseError
        )
      }
    } catch (readError) {
      // unable to read, so intialize that file
      // locales[locale] are already set in memory, so no extra read required
      // or locales[locale] are empty, which initializes an empty locale.json file
      // since the current invalid locale could exist, we should back it up
      if (fs.existsSync(file)) {
        logDebug(
          'backing up invalid locale ' + locale + ' to ' + file + '.invalid'
        )
        fs.renameSync(file, file + '.invalid')
      }

      logDebug('initializing ' + file)
      write(locale)
    }
  }

  /**
   * try writing a file in a created directory
   */
  const write = (locale) => {
    let stats, target, tmp

    // don't write new locale information to disk if updateFiles isn't true
    if (!updateFiles) {
      return
    }

    // creating directory if necessary
    try {
      stats = fs.lstatSync(directory)
    } catch (e) {
      logDebug('creating locales dir in: ' + directory)
      try {
        fs.mkdirSync(directory, directoryPermissions)
      } catch (e) {
        // in case of parallel tasks utilizing in same dir
        if (e.code !== 'EEXIST') throw e
      }
    }

    // first time init has an empty file
    if (!locales[locale]) {
      locales[locale] = {}
    }

    // writing to tmp and rename on success
    try {
      target = getStorageFilePath(locale)
      tmp = target + '.tmp'
      fs.writeFileSync(
        tmp,
        parser.stringify(locales[locale], null, indent),
        'utf8'
      )
      stats = fs.statSync(tmp)
      if (stats.isFile()) {
        fs.renameSync(tmp, target)
      } else {
        logError(
          'unable to write locales to file (either ' +
            tmp +
            ' or ' +
            target +
            ' are not writeable?): '
        )
      }
    } catch (e) {
      logError(
        'unexpected error writing files (either ' +
          tmp +
          ' or ' +
          target +
          ' are not writeable?): ',
        e
      )
    }
  }

  /**
   * basic normalization of filepath
   */
  const getStorageFilePath = (locale) => {
    // changed API to use .json as default, #16
    const ext = extension || '.json'
    const filepath = path.normalize(directory + pathsep + prefix + locale + ext)
    const filepathJS = path.normalize(
      directory + pathsep + prefix + locale + '.js'
    )
    // use .js as fallback if already existing
    try {
      if (fs.statSync(filepathJS)) {
        logDebug('using existing file ' + filepathJS)
        extension = '.js'
        return filepathJS
      }
    } catch (e) {
      logDebug('will use ' + filepath)
    }
    return filepath
  }

  /**
   * Get locales with wildcard support
   */
  const getFallback = (targetLocale, fallbacks) => {
    fallbacks = fallbacks || {}
    if (fallbacks[targetLocale]) return fallbacks[targetLocale]
    let fallBackLocale = null
    for (const key in fallbacks) {
      if (targetLocale.match(new RegExp('^' + key.replace('*', '.*') + '$'))) {
        fallBackLocale = fallbacks[key]
        break
      }
    }
    return fallBackLocale
  }

  /**
   * Logging proxies
   */
  const logDebug = (msg) => {
    logDebugFn(msg)
  }

  const logWarn = (msg) => {
    logWarnFn(msg)
  }

  const logError = (msg) => {
    logErrorFn(msg)
  }

  /**
   * Missing key function
   */
  const missingKey = (locale, value) => {
    return value
  }

  /**
   * implicitly configure when created with given options
   * @example
   * const i18n = new I18n({
   *   locales: ['en', 'fr']
   * });
   */
  if (_OPTS) i18n.configure(_OPTS)

  return i18n
}

module.exports = i18n


/***/ }),

/***/ "./node_modules/i18n/index.js":
/*!************************************!*\
  !*** ./node_modules/i18n/index.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const i18n = __webpack_require__(/*! ./i18n */ "./node_modules/i18n/i18n.js")

/**
 * defaults to singleton, backward compat
 */
module.exports = i18n()

/**
 * exports constructor with capital letter
 */
module.exports.I18n = i18n


/***/ }),

/***/ "./node_modules/math-interval-parser/lib/index.js":
/*!********************************************************!*\
  !*** ./node_modules/math-interval-parser/lib/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var patternParts = {
    value: '[-+]?(?:Infinity|[[0-9]*\\.?\\d*(?:[eE][-+]?\\d+)?)',
    leftBrace: '[\\(\\]\\[]',
    delimeter: ',',
    rightBrace: '[\\)\\]\\[]',
};
var PATTERN = new RegExp("(" + patternParts.leftBrace + ")" +
    ("(" + patternParts.value + ")?") +
    ("(" + patternParts.delimeter + ")?") +
    ("(" + patternParts.value + ")?") +
    ("(" + patternParts.rightBrace + ")"));
function execPattern(str) {
    var match = PATTERN.exec(str);
    if (!match) {
        return null;
    }
    var _ = match[0], leftBrace = match[1], fromValue = match[2], delimeter = match[3], toValue = match[4], rightBrace = match[5];
    return {
        leftBrace: leftBrace,
        fromValue: fromValue,
        delimeter: delimeter,
        toValue: toValue,
        rightBrace: rightBrace,
    };
}
function parse(str) {
    var match = execPattern(str);
    if (!match) {
        return null;
    }
    return {
        from: {
            value: match.fromValue !== undefined ?
                +match.fromValue :
                -Infinity,
            included: match.leftBrace === '['
        },
        to: {
            value: match.toValue !== undefined ?
                +match.toValue :
                (match.delimeter ?
                    +Infinity :
                    match.fromValue !== undefined ?
                        +match.fromValue :
                        NaN),
            included: match.rightBrace === ']'
        }
    };
}
function check(interval) {
    if (interval.from.value === interval.to.value) {
        return interval.from.included && interval.to.included;
    }
    return Math.min(interval.from.value, interval.to.value) === interval.from.value;
}
function entry(str) {
    var interval = parse(str);
    if (!interval || !check(interval)) {
        return null;
    }
    return interval;
}
exports["default"] = entry;


/***/ }),

/***/ "./src/styles/main.scss":
/*!******************************!*\
  !*** ./src/styles/main.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/ms/index.js":
/*!**********************************!*\
  !*** ./node_modules/ms/index.js ***!
  \**********************************/
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ "./node_modules/mustache/mustache.js":
/*!*******************************************!*\
  !*** ./node_modules/mustache/mustache.js ***!
  \*******************************************/
/***/ (function(module) {

(function (global, factory) {
   true ? module.exports = factory() :
  0;
}(this, (function () { 'use strict';

  /*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   */

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  /**
   * Safe way of detecting whether or not the given thing is a primitive and
   * whether it has the given property
   */
  function primitiveHasOwnProperty (primitive, propName) {
    return (
      primitive != null
      && typeof primitive !== 'object'
      && primitive.hasOwnProperty
      && primitive.hasOwnProperty(propName)
    );
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   *
   * Tokens for partials also contain two more elements: 1) a string value of
   * indendation prior to that tag and 2) the index of that tag on that line -
   * eg a value of 2 indicates the partial is the third tag on this line.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];
    var lineHasNonSpace = false;
    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?
    var indentation = '';  // Tracks indentation for tags that use it
    var tagIndex = 0;      // Stores a count of number of tags encountered on a line

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
            indentation += chr;
          } else {
            nonSpace = true;
            lineHasNonSpace = true;
            indentation += ' ';
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n') {
            stripSpace();
            indentation = '';
            tagIndex = 0;
            lineHasNonSpace = false;
          }
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      if (type == '>') {
        token = [ type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace ];
      } else {
        token = [ type, value, start, scanner.pos ];
      }
      tagIndex++;
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    stripSpace();

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, intermediateValue, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          intermediateValue = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           *
           * In the case where dot notation is used, we consider the lookup
           * to be successful even if the last "object" in the path is
           * not actually an object but a primitive (e.g., a string, or an
           * integer), because it is sometimes useful to access a property
           * of an autoboxed primitive, such as the length of a string.
           **/
          while (intermediateValue != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = (
                hasProperty(intermediateValue, names[index])
                || primitiveHasOwnProperty(intermediateValue, names[index])
              );

            intermediateValue = intermediateValue[names[index++]];
          }
        } else {
          intermediateValue = context.view[name];

          /**
           * Only checking against `hasProperty`, which always returns `false` if
           * `context.view` is not an object. Deliberately omitting the check
           * against `primitiveHasOwnProperty` if dot notation is not used.
           *
           * Consider this example:
           * ```
           * Mustache.render("The length of a football field is {{#length}}{{length}}{{/length}}.", {length: "100 yards"})
           * ```
           *
           * If we were to check also against `primitiveHasOwnProperty`, as we do
           * in the dot notation case, then render call would return:
           *
           * "The length of a football field is 9."
           *
           * rather than the expected:
           *
           * "The length of a football field is 100 yards."
           **/
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit) {
          value = intermediateValue;
          break;
        }

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.templateCache = {
      _cache: {},
      set: function set (key, value) {
        this._cache[key] = value;
      },
      get: function get (key) {
        return this._cache[key];
      },
      clear: function clear () {
        this._cache = {};
      }
    };
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    if (typeof this.templateCache !== 'undefined') {
      this.templateCache.clear();
    }
  };

  /**
   * Parses and caches the given `template` according to the given `tags` or
   * `mustache.tags` if `tags` is omitted,  and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.templateCache;
    var cacheKey = template + ':' + (tags || mustache.tags).join(':');
    var isCacheEnabled = typeof cache !== 'undefined';
    var tokens = isCacheEnabled ? cache.get(cacheKey) : undefined;

    if (tokens == undefined) {
      tokens = parseTemplate(template, tags);
      isCacheEnabled && cache.set(cacheKey, tokens);
    }
    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   *
   * If the optional `config` argument is given here, then it should be an
   * object with a `tags` attribute or an `escape` attribute or both.
   * If an array is passed, then it will be interpreted the same way as
   * a `tags` attribute on a `config` object.
   *
   * The `tags` attribute of a `config` object must be an array with two
   * string values: the opening and closing tags used in the template (e.g.
   * [ "<%", "%>" ]). The default is to mustache.tags.
   *
   * The `escape` attribute of a `config` object must be a function which
   * accepts a string as input and outputs a safely escaped string.
   * If an `escape` function is not provided, then an HTML-safe string
   * escaping function is used as the default.
   */
  Writer.prototype.render = function render (template, view, partials, config) {
    var tags = this.getConfigTags(config);
    var tokens = this.parse(template, tags);
    var context = (view instanceof Context) ? view : new Context(view, undefined);
    return this.renderTokens(tokens, context, partials, template, config);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate, config) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate, config);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate, config);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, config);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context, config);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate, config) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials, config);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate, config);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate, config);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate, config);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate, config) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate, config);
  };

  Writer.prototype.indentPartial = function indentPartial (partial, indentation, lineHasNonSpace) {
    var filteredIndentation = indentation.replace(/[^ \t]/g, '');
    var partialByNl = partial.split('\n');
    for (var i = 0; i < partialByNl.length; i++) {
      if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
        partialByNl[i] = filteredIndentation + partialByNl[i];
      }
    }
    return partialByNl.join('\n');
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials, config) {
    if (!partials) return;
    var tags = this.getConfigTags(config);

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null) {
      var lineHasNonSpace = token[6];
      var tagIndex = token[5];
      var indentation = token[4];
      var indentedValue = value;
      if (tagIndex == 0 && indentation) {
        indentedValue = this.indentPartial(value, indentation, lineHasNonSpace);
      }
      var tokens = this.parse(indentedValue, tags);
      return this.renderTokens(tokens, context, partials, indentedValue, config);
    }
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context, config) {
    var escape = this.getConfigEscape(config) || mustache.escape;
    var value = context.lookup(token[1]);
    if (value != null)
      return (typeof value === 'number' && escape === mustache.escape) ? String(value) : escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  Writer.prototype.getConfigTags = function getConfigTags (config) {
    if (isArray(config)) {
      return config;
    }
    else if (config && typeof config === 'object') {
      return config.tags;
    }
    else {
      return undefined;
    }
  };

  Writer.prototype.getConfigEscape = function getConfigEscape (config) {
    if (config && typeof config === 'object' && !isArray(config)) {
      return config.escape;
    }
    else {
      return undefined;
    }
  };

  var mustache = {
    name: 'mustache.js',
    version: '4.2.0',
    tags: [ '{{', '}}' ],
    clearCache: undefined,
    escape: undefined,
    parse: undefined,
    render: undefined,
    Scanner: undefined,
    Context: undefined,
    Writer: undefined,
    /**
     * Allows a user to override the default caching strategy, by providing an
     * object with set, get and clear methods. This can also be used to disable
     * the cache by setting it to the literal `undefined`.
     */
    set templateCache (cache) {
      defaultWriter.templateCache = cache;
    },
    /**
     * Gets the default or overridden caching object from the default writer.
     */
    get templateCache () {
      return defaultWriter.templateCache;
    }
  };

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view`, `partials`, and `config`
   * using the default writer.
   */
  mustache.render = function render (template, view, partials, config) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials, config);
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;

})));


/***/ }),

/***/ "./node_modules/object-inspect/index.js":
/*!**********************************************!*\
  !*** ./node_modules/object-inspect/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
// ie, `has-tostringtag/shams
var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol')
    ? Symbol.toStringTag
    : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
    [].__proto__ === Array.prototype // eslint-disable-line no-proto
        ? function (O) {
            return O.__proto__; // eslint-disable-line no-proto
        }
        : null
);

function addNumericSeparator(num, str) {
    if (
        num === Infinity
        || num === -Infinity
        || num !== num
        || (num && num > -1000 && num < 1000)
        || $test.call(/e/, str)
    ) {
        return str;
    }
    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
    if (typeof num === 'number') {
        var int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
        if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
        }
    }
    return $replace.call(str, sepRegex, '$&_');
}

var utilInspect = __webpack_require__(/*! ./util.inspect */ "?4f7e");
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
        throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
    }

    if (
        has(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
    }
    if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
    }
    var numericSeparator = opts.numericSeparator;

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
    }
    if (typeof obj === 'bigint') {
        var bigIntStr = String(obj) + 'n';
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function' && !isRegExp(obj)) { // in older engines, regexes are callable
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + $join.call(xs, ', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {
            return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
        }
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
            mapForEach.call(obj, function (value, key) {
                mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
            });
        }
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
            setForEach.call(obj, function (value) {
                setParts.push(inspect(value, obj));
            });
        }
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isWeakRef(obj)) {
        return weakCollectionOf('WeakRef');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    // note: in IE 8, sometimes `global !== window` but both are the prototypes of each other
    /* eslint-env browser */
    if (typeof window !== 'undefined' && obj === window) {
        return '{ [object Window] }';
    }
    if (
        (typeof globalThis !== 'undefined' && obj === globalThis)
        || (typeof __webpack_require__.g !== 'undefined' && obj === __webpack_require__.g)
    ) {
        return '{ [object globalThis] }';
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? '' : 'null prototype';
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
        var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
        if (ys.length === 0) { return tag + '{}'; }
        if (indent) {
            return tag + '{' + indentedJoin(ys, indent) + '}';
        }
        return tag + '{ ' + $join.call(ys, ', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return $replace.call(String(s), /"/g, '&quot;');
}

function isArray(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isRegExp(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isString(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol(obj) {
    if (hasShammedSymbols) {
        return obj && typeof obj === 'object' && obj instanceof Symbol;
    }
    if (typeof obj === 'symbol') {
        return true;
    }
    if (!obj || typeof obj !== 'object' || !symToString) {
        return false;
    }
    try {
        symToString.call(obj);
        return true;
    } catch (e) {}
    return false;
}

function isBigInt(obj) {
    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
        return false;
    }
    try {
        bigIntValueOf.call(obj);
        return true;
    } catch (e) {}
    return false;
}

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakRefDeref.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = $replace.call($replace.call(str, /(['\\])/g, '\\$1'), /[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), ' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
            symMap['$' + syms[k]] = syms[k];
        }
    }

    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}


/***/ }),

/***/ "./node_modules/path-browserify/index.js":
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;


/***/ }),

/***/ "./node_modules/set-function-length/index.js":
/*!***************************************************!*\
  !*** ./node_modules/set-function-length/index.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(/*! get-intrinsic */ "./node_modules/get-intrinsic/index.js");
var define = __webpack_require__(/*! define-data-property */ "./node_modules/define-data-property/index.js");
var hasDescriptors = __webpack_require__(/*! has-property-descriptors */ "./node_modules/has-property-descriptors/index.js")();
var gOPD = __webpack_require__(/*! gopd */ "./node_modules/gopd/index.js");

var $TypeError = __webpack_require__(/*! es-errors/type */ "./node_modules/es-errors/type.js");
var $floor = GetIntrinsic('%Math.floor%');

/** @type {import('.')} */
module.exports = function setFunctionLength(fn, length) {
	if (typeof fn !== 'function') {
		throw new $TypeError('`fn` is not a function');
	}
	if (typeof length !== 'number' || length < 0 || length > 0xFFFFFFFF || $floor(length) !== length) {
		throw new $TypeError('`length` must be a positive 32-bit integer');
	}

	var loose = arguments.length > 2 && !!arguments[2];

	var functionLengthIsConfigurable = true;
	var functionLengthIsWritable = true;
	if ('length' in fn && gOPD) {
		var desc = gOPD(fn, 'length');
		if (desc && !desc.configurable) {
			functionLengthIsConfigurable = false;
		}
		if (desc && !desc.writable) {
			functionLengthIsWritable = false;
		}
	}

	if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
		if (hasDescriptors) {
			define(/** @type {Parameters<define>[0]} */ (fn), 'length', length, true, true);
		} else {
			define(/** @type {Parameters<define>[0]} */ (fn), 'length', length);
		}
	}
	return fn;
};


/***/ }),

/***/ "./node_modules/side-channel/index.js":
/*!********************************************!*\
  !*** ./node_modules/side-channel/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(/*! get-intrinsic */ "./node_modules/get-intrinsic/index.js");
var callBound = __webpack_require__(/*! call-bind/callBound */ "./node_modules/call-bind/callBound.js");
var inspect = __webpack_require__(/*! object-inspect */ "./node_modules/object-inspect/index.js");

var $TypeError = __webpack_require__(/*! es-errors/type */ "./node_modules/es-errors/type.js");
var $WeakMap = GetIntrinsic('%WeakMap%', true);
var $Map = GetIntrinsic('%Map%', true);

var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas = callBound('Map.prototype.has', true);

/*
* This function traverses the list returning the node corresponding to the given key.
*
* That node is also moved to the head of the list, so that if it's accessed again we don't need to traverse the whole list. By doing so, all the recently used nodes can be accessed relatively quickly.
*/
/** @type {import('.').listGetNode} */
var listGetNode = function (list, key) { // eslint-disable-line consistent-return
	/** @type {typeof list | NonNullable<(typeof list)['next']>} */
	var prev = list;
	/** @type {(typeof list)['next']} */
	var curr;
	for (; (curr = prev.next) !== null; prev = curr) {
		if (curr.key === key) {
			prev.next = curr.next;
			// eslint-disable-next-line no-extra-parens
			curr.next = /** @type {NonNullable<typeof list.next>} */ (list.next);
			list.next = curr; // eslint-disable-line no-param-reassign
			return curr;
		}
	}
};

/** @type {import('.').listGet} */
var listGet = function (objects, key) {
	var node = listGetNode(objects, key);
	return node && node.value;
};
/** @type {import('.').listSet} */
var listSet = function (objects, key, value) {
	var node = listGetNode(objects, key);
	if (node) {
		node.value = value;
	} else {
		// Prepend the new node to the beginning of the list
		objects.next = /** @type {import('.').ListNode<typeof value>} */ ({ // eslint-disable-line no-param-reassign, no-extra-parens
			key: key,
			next: objects.next,
			value: value
		});
	}
};
/** @type {import('.').listHas} */
var listHas = function (objects, key) {
	return !!listGetNode(objects, key);
};

/** @type {import('.')} */
module.exports = function getSideChannel() {
	/** @type {WeakMap<object, unknown>} */ var $wm;
	/** @type {Map<object, unknown>} */ var $m;
	/** @type {import('.').RootNode<unknown>} */ var $o;

	/** @type {import('.').Channel} */
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapGet($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapGet($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listGet($o, key);
				}
			}
		},
		has: function (key) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapHas($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapHas($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listHas($o, key);
				}
			}
			return false;
		},
		set: function (key, value) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if (!$wm) {
					$wm = new $WeakMap();
				}
				$weakMapSet($wm, key, value);
			} else if ($Map) {
				if (!$m) {
					$m = new $Map();
				}
				$mapSet($m, key, value);
			} else {
				if (!$o) {
					// Initialize the linked list as an empty node, so that we don't have to special-case handling of the first node: we can always refer to it as (previous node).next, instead of something like (list).head
					$o = { key: {}, next: null };
				}
				listSet($o, key, value);
			}
		}
	};
	return channel;
};


/***/ }),

/***/ "./node_modules/url/node_modules/punycode/punycode.js":
/*!************************************************************!*\
  !*** ./node_modules/url/node_modules/punycode/punycode.js ***!
  \************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports =  true && exports &&
		!exports.nodeType && exports;
	var freeModule =  true && module &&
		!module.nodeType && module;
	var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return punycode;
		}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}

}(this));


/***/ }),

/***/ "./node_modules/url/node_modules/qs/lib/formats.js":
/*!*********************************************************!*\
  !*** ./node_modules/url/node_modules/qs/lib/formats.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = {
    'default': Format.RFC3986,
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return String(value);
        }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
};


/***/ }),

/***/ "./node_modules/url/node_modules/qs/lib/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/url/node_modules/qs/lib/index.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var stringify = __webpack_require__(/*! ./stringify */ "./node_modules/url/node_modules/qs/lib/stringify.js");
var parse = __webpack_require__(/*! ./parse */ "./node_modules/url/node_modules/qs/lib/parse.js");
var formats = __webpack_require__(/*! ./formats */ "./node_modules/url/node_modules/qs/lib/formats.js");

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),

/***/ "./node_modules/url/node_modules/qs/lib/parse.js":
/*!*******************************************************!*\
  !*** ./node_modules/url/node_modules/qs/lib/parse.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/url/node_modules/qs/lib/utils.js");

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var defaults = {
    allowDots: false,
    allowEmptyArrays: false,
    allowPrototypes: false,
    allowSparse: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decodeDotInKeys: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    duplicates: 'combine',
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function (val, options) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = { __proto__: null };

    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    cleanStr = cleanStr.replace(/%5B/gi, '[').replace(/%5D/gi, ']');
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
            val = utils.maybeMap(
                parseArrayValue(part.slice(pos + 1), options),
                function (encodedVal) {
                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');
                }
            );
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray(val) ? [val] : val;
        }

        var existing = has.call(obj, key);
        if (existing && options.duplicates === 'combine') {
            obj[key] = utils.combine(obj[key], val);
        } else if (!existing || options.duplicates === 'last') {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = options.allowEmptyArrays && leaf === '' ? [] : [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, '.') : cleanRoot;
            var index = parseInt(decodedRoot, 10);
            if (!options.parseArrays && decodedRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== decodedRoot
                && String(index) === decodedRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else if (decodedRoot !== '__proto__') {
                obj[decodedRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (typeof opts.allowEmptyArrays !== 'undefined' && typeof opts.allowEmptyArrays !== 'boolean') {
        throw new TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
    }

    if (typeof opts.decodeDotInKeys !== 'undefined' && typeof opts.decodeDotInKeys !== 'boolean') {
        throw new TypeError('`decodeDotInKeys` option can only be `true` or `false`, when provided');
    }

    if (opts.decoder !== null && typeof opts.decoder !== 'undefined' && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    var duplicates = typeof opts.duplicates === 'undefined' ? defaults.duplicates : opts.duplicates;

    if (duplicates !== 'combine' && duplicates !== 'first' && duplicates !== 'last') {
        throw new TypeError('The duplicates option must be either combine, first, or last');
    }

    var allowDots = typeof opts.allowDots === 'undefined' ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;

    return {
        allowDots: allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === 'boolean' ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decodeDotInKeys: typeof opts.decodeDotInKeys === 'boolean' ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
        duplicates: duplicates,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    if (options.allowSparse === true) {
        return obj;
    }

    return utils.compact(obj);
};


/***/ }),

/***/ "./node_modules/url/node_modules/qs/lib/stringify.js":
/*!***********************************************************!*\
  !*** ./node_modules/url/node_modules/qs/lib/stringify.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var getSideChannel = __webpack_require__(/*! side-channel */ "./node_modules/side-channel/index.js");
var utils = __webpack_require__(/*! ./utils */ "./node_modules/url/node_modules/qs/lib/utils.js");
var formats = __webpack_require__(/*! ./formats */ "./node_modules/url/node_modules/qs/lib/formats.js");
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    allowEmptyArrays: false,
    arrayFormat: 'indices',
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encodeDotInKeys: false,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var sentinel = {};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    commaRoundTrip,
    allowEmptyArrays,
    strictNullHandling,
    skipNulls,
    encodeDotInKeys,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    format,
    formatter,
    encodeValuesOnly,
    charset,
    sideChannel
) {
    var obj = object;

    var tmpSc = sideChannel;
    var step = 0;
    var findFlag = false;
    while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {
        // Where object last appeared in the ref tree
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== 'undefined') {
            if (pos === step) {
                throw new RangeError('Cyclic object value');
            } else {
                findFlag = true; // Break while
            }
        }
        if (typeof tmpSc.get(sentinel) === 'undefined') {
            step = 0;
        }
    }

    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = utils.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        });
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (generateArrayPrefix === 'comma' && isArray(obj)) {
        // we need to join elements in
        if (encodeValuesOnly && encoder) {
            obj = utils.maybeMap(obj, encoder);
        }
        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void undefined }];
    } else if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    var encodedPrefix = encodeDotInKeys ? prefix.replace(/\./g, '%2E') : prefix;

    var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + '[]' : encodedPrefix;

    if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
        return adjustedPrefix + '[]';
    }

    for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === 'object' && typeof key.value !== 'undefined' ? key.value : obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var encodedKey = allowDots && encodeDotInKeys ? key.replace(/\./g, '%2E') : key;
        var keyPrefix = isArray(obj)
            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix
            : adjustedPrefix + (allowDots ? '.' + encodedKey : '[' + encodedKey + ']');

        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify(
            value,
            keyPrefix,
            generateArrayPrefix,
            commaRoundTrip,
            allowEmptyArrays,
            strictNullHandling,
            skipNulls,
            encodeDotInKeys,
            generateArrayPrefix === 'comma' && encodeValuesOnly && isArray(obj) ? null : encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset,
            valueSideChannel
        ));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (typeof opts.allowEmptyArrays !== 'undefined' && typeof opts.allowEmptyArrays !== 'boolean') {
        throw new TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
    }

    if (typeof opts.encodeDotInKeys !== 'undefined' && typeof opts.encodeDotInKeys !== 'boolean') {
        throw new TypeError('`encodeDotInKeys` option can only be `true` or `false`, when provided');
    }

    if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    var arrayFormat;
    if (opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if ('indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = defaults.arrayFormat;
    }

    if ('commaRoundTrip' in opts && typeof opts.commaRoundTrip !== 'boolean') {
        throw new TypeError('`commaRoundTrip` must be a boolean, or absent');
    }

    var allowDots = typeof opts.allowDots === 'undefined' ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === 'boolean' ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        arrayFormat: arrayFormat,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        commaRoundTrip: opts.commaRoundTrip,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encodeDotInKeys: typeof opts.encodeDotInKeys === 'boolean' ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        format: format,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
    var commaRoundTrip = generateArrayPrefix === 'comma' && options.commaRoundTrip;

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    var sideChannel = getSideChannel();
    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            commaRoundTrip,
            options.allowEmptyArrays,
            options.strictNullHandling,
            options.skipNulls,
            options.encodeDotInKeys,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset,
            sideChannel
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};


/***/ }),

/***/ "./node_modules/url/node_modules/qs/lib/utils.js":
/*!*******************************************************!*\
  !*** ./node_modules/url/node_modules/qs/lib/utils.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var formats = __webpack_require__(/*! ./formats */ "./node_modules/url/node_modules/qs/lib/formats.js");

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var limit = 1024;

/* eslint operator-linebreak: [2, "before"] */

var encode = function encode(str, defaultEncoder, charset, kind, format) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var j = 0; j < string.length; j += limit) {
        var segment = string.length >= limit ? string.slice(j, j + limit) : string;
        var arr = [];

        for (var i = 0; i < segment.length; ++i) {
            var c = segment.charCodeAt(i);
            if (
                c === 0x2D // -
                || c === 0x2E // .
                || c === 0x5F // _
                || c === 0x7E // ~
                || (c >= 0x30 && c <= 0x39) // 0-9
                || (c >= 0x41 && c <= 0x5A) // a-z
                || (c >= 0x61 && c <= 0x7A) // A-Z
                || (format === formats.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
            ) {
                arr[arr.length] = segment.charAt(i);
                continue;
            }

            if (c < 0x80) {
                arr[arr.length] = hexTable[c];
                continue;
            }

            if (c < 0x800) {
                arr[arr.length] = hexTable[0xC0 | (c >> 6)]
                    + hexTable[0x80 | (c & 0x3F)];
                continue;
            }

            if (c < 0xD800 || c >= 0xE000) {
                arr[arr.length] = hexTable[0xE0 | (c >> 12)]
                    + hexTable[0x80 | ((c >> 6) & 0x3F)]
                    + hexTable[0x80 | (c & 0x3F)];
                continue;
            }

            i += 1;
            c = 0x10000 + (((c & 0x3FF) << 10) | (segment.charCodeAt(i) & 0x3FF));

            arr[arr.length] = hexTable[0xF0 | (c >> 18)]
                + hexTable[0x80 | ((c >> 12) & 0x3F)]
                + hexTable[0x80 | ((c >> 6) & 0x3F)]
                + hexTable[0x80 | (c & 0x3F)];
        }

        out += arr.join('');
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};


/***/ }),

/***/ "./node_modules/url/url.js":
/*!*********************************!*\
  !*** ./node_modules/url/url.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */



var punycode = __webpack_require__(/*! punycode */ "./node_modules/url/node_modules/punycode/punycode.js");

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

/*
 * define these here so at least they only have to be
 * compiled once on the first module load.
 */
var protocolPattern = /^([a-z0-9.+-]+:)/i,
  portPattern = /:[0-9]*$/,

  // Special case for a simple path URL
  simplePathPattern = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/,

  /*
   * RFC 2396: characters reserved for delimiting URLs.
   * We actually just auto-escape these.
   */
  delims = [
    '<', '>', '"', '`', ' ', '\r', '\n', '\t'
  ],

  // RFC 2396: characters not allowed for various reasons.
  unwise = [
    '{', '}', '|', '\\', '^', '`'
  ].concat(delims),

  // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
  autoEscape = ['\''].concat(unwise),
  /*
   * Characters that are never ever allowed in a hostname.
   * Note that any invalid chars are also handled, but these
   * are the ones that are *expected* to be seen, so we fast-path
   * them.
   */
  nonHostChars = [
    '%', '/', '?', ';', '#'
  ].concat(autoEscape),
  hostEndingChars = [
    '/', '?', '#'
  ],
  hostnameMaxLen = 255,
  hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
  hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
  // protocols that can allow "unsafe" and "unwise" chars.
  unsafeProtocol = {
    javascript: true,
    'javascript:': true
  },
  // protocols that never have a hostname.
  hostlessProtocol = {
    javascript: true,
    'javascript:': true
  },
  // protocols that always contain a // bit.
  slashedProtocol = {
    http: true,
    https: true,
    ftp: true,
    gopher: true,
    file: true,
    'http:': true,
    'https:': true,
    'ftp:': true,
    'gopher:': true,
    'file:': true
  },
  querystring = __webpack_require__(/*! qs */ "./node_modules/url/node_modules/qs/lib/index.js");

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && typeof url === 'object' && url instanceof Url) { return url; }

  var u = new Url();
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
  if (typeof url !== 'string') {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  /*
   * Copy chrome, IE, opera backslash-handling behavior.
   * Back slashes before the query string get converted to forward slashes
   * See: https://code.google.com/p/chromium/issues/detail?id=25916
   */
  var queryIndex = url.indexOf('?'),
    splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
    uSplit = url.split(splitter),
    slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  /*
   * trim before proceeding.
   * This is to support parse stuff like "  http://foo.com  \n"
   */
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  /*
   * figure out if it's got a host
   * user@server is *always* interpreted as a hostname, and url
   * resolution will treat //foo/bar as host=foo,path=bar because that's
   * how the browser resolves relative URLs.
   */
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@/]+@[^@/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] && (slashes || (proto && !slashedProtocol[proto]))) {

    /*
     * there's a hostname.
     * the first instance of /, ?, ;, or # ends the host.
     *
     * If there is an @ in the hostname, then non-host chars *are* allowed
     * to the left of the last @ sign, unless some host-ending character
     * comes *before* the @-sign.
     * URLs are obnoxious.
     *
     * ex:
     * http://a@b@c/ => user:a@b host:c
     * http://a@b?@c => user:a host:c path:/?@c
     */

    /*
     * v0.12 TODO(isaacs): This is not quite how Chrome does things.
     * Review our test case against browsers more comprehensively.
     */

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) { hostEnd = hec; }
    }

    /*
     * at this point, either we have an explicit point where the
     * auth portion cannot go past, or the last @ char is the decider.
     */
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      /*
       * atSign must be in auth portion.
       * http://a@b/c@d => host:b auth:a path:/c@d
       */
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    /*
     * Now we have a portion which is definitely the auth.
     * Pull that off.
     */
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) { hostEnd = hec; }
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1) { hostEnd = rest.length; }

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    /*
     * we've indicated that there is a hostname,
     * so even if it's empty, it has to be present.
     */
    this.hostname = this.hostname || '';

    /*
     * if hostname begins with [ and ends with ]
     * assume that it's an IPv6 address.
     */
    var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) { continue; }
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              /*
               * we replace non-ASCII char with a temporary placeholder
               * we need this to make sure size of hostname is not
               * broken by replacing non-ASCII by nothing
               */
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      /*
       * IDNA Support: Returns a punycoded representation of "domain".
       * It only converts parts of the domain name that
       * have non-ASCII characters, i.e. it doesn't matter if
       * you call it with a domain that already is ASCII-only.
       */
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    /*
     * strip [ and ] from the hostname
     * the host field still retains them, though
     */
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  /*
   * now rest is set to the post-host stuff.
   * chop off any delim chars.
   */
  if (!unsafeProtocol[lowerProto]) {

    /*
     * First, make 100% sure that any "autoEscape" chars get
     * escaped, even if encodeURIComponent doesn't think they
     * need to be.
     */
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1) { continue; }
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }

  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) { this.pathname = rest; }
  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  // to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  /*
   * ensure it's an object, and not a string url.
   * If it's an obj, this is a no-op.
   * this way, you can call url_format() on strings
   * to clean up potentially wonky urls.
   */
  if (typeof obj === 'string') { obj = urlParse(obj); }
  if (!(obj instanceof Url)) { return Url.prototype.format.call(obj); }
  return obj.format();
}

Url.prototype.format = function () {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
    pathname = this.pathname || '',
    hash = this.hash || '',
    host = false,
    query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query && typeof this.query === 'object' && Object.keys(this.query).length) {
    query = querystring.stringify(this.query, {
      arrayFormat: 'repeat',
      addQueryPrefix: false
    });
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') { protocol += ':'; }

  /*
   * only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
   * unless they had them to begin with.
   */
  if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') { pathname = '/' + pathname; }
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') { hash = '#' + hash; }
  if (search && search.charAt(0) !== '?') { search = '?' + search; }

  pathname = pathname.replace(/[?#]/g, function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function (relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) { return relative; }
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function (relative) {
  if (typeof relative === 'string') {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  /*
   * hash is always overridden, no matter what.
   * even href="" will remove it.
   */
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol') { result[rkey] = relative[rkey]; }
    }

    // urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
      result.pathname = '/';
      result.path = result.pathname;
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    /*
     * if it's a known url protocol, then changing
     * the protocol does weird things
     * first, if it's not file:, then we MUST have a host,
     * and if there was a path
     * to begin with, then we MUST have a path.
     * if it is file:, then the host is dropped,
     * because that's known to be hostless.
     * anything else is assumed to be absolute.
     */
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift())) { }
      if (!relative.host) { relative.host = ''; }
      if (!relative.hostname) { relative.hostname = ''; }
      if (relPath[0] !== '') { relPath.unshift(''); }
      if (relPath.length < 2) { relPath.unshift(''); }
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
    isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
    mustEndAbs = isRelAbs || isSourceAbs || (result.host && relative.pathname),
    removeAllDots = mustEndAbs,
    srcPath = result.pathname && result.pathname.split('/') || [],
    relPath = relative.pathname && relative.pathname.split('/') || [],
    psychotic = result.protocol && !slashedProtocol[result.protocol];

  /*
   * if the url is a non-slashed url, then relative
   * links like ../.. should be able
   * to crawl up to the hostname, as well.  This is strange.
   * result.protocol has already been set by now.
   * Later on, put the first path part into the host field.
   */
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') { srcPath[0] = result.host; } else { srcPath.unshift(result.host); }
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') { relPath[0] = relative.host; } else { relPath.unshift(relative.host); }
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = relative.host || relative.host === '' ? relative.host : result.host;
    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    /*
     * it's relative
     * throw away the existing file, and take the new path instead.
     */
    if (!srcPath) { srcPath = []; }
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (relative.search != null) {
    /*
     * just pull out the search.
     * like href='?foo'.
     * Put this after the other two cases because it simplifies the booleans
     */
    if (psychotic) {
      result.host = srcPath.shift();
      result.hostname = result.host;
      /*
       * occationaly the auth can get stuck only in host
       * this especially happens in cases like
       * url.resolveObject('mailto:local1@domain1', 'local2@domain2')
       */
      var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.hostname = authInHost.shift();
        result.host = result.hostname;
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    // to support http.request
    if (result.pathname !== null || result.search !== null) {
      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    /*
     * no path at all.  easy.
     * we've already handled the other stuff above.
     */
    result.pathname = null;
    // to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  /*
   * if a url ENDs in . or .., then it must get a trailing slash.
   * however, if it ends in anything else non-slashy,
   * then it must NOT get a trailing slash.
   */
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === '';

  /*
   * strip single dots, resolve double dots to parent dir
   * if the path tries to go above the root, `up` ends up > 0
   */
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' || (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
    result.host = result.hostname;
    /*
     * occationaly the auth can get stuck only in host
     * this especially happens in cases like
     * url.resolveObject('mailto:local1@domain1', 'local2@domain2')
     */
    var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.hostname = authInHost.shift();
      result.host = result.hostname;
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (srcPath.length > 0) {
    result.pathname = srcPath.join('/');
  } else {
    result.pathname = null;
    result.path = null;
  }

  // to support request.http
  if (result.pathname !== null || result.search !== null) {
    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function () {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) { this.hostname = host; }
};

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;


/***/ }),

/***/ "?5818":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?4f7e":
/*!********************************!*\
  !*** ./util.inspect (ignored) ***!
  \********************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "./node_modules/make-plural/plurals.mjs":
/*!**********************************************!*\
  !*** ./node_modules/make-plural/plurals.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   af: () => (/* binding */ af),
/* harmony export */   ak: () => (/* binding */ ak),
/* harmony export */   am: () => (/* binding */ am),
/* harmony export */   an: () => (/* binding */ an),
/* harmony export */   ar: () => (/* binding */ ar),
/* harmony export */   ars: () => (/* binding */ ars),
/* harmony export */   as: () => (/* binding */ as),
/* harmony export */   asa: () => (/* binding */ asa),
/* harmony export */   ast: () => (/* binding */ ast),
/* harmony export */   az: () => (/* binding */ az),
/* harmony export */   bal: () => (/* binding */ bal),
/* harmony export */   be: () => (/* binding */ be),
/* harmony export */   bem: () => (/* binding */ bem),
/* harmony export */   bez: () => (/* binding */ bez),
/* harmony export */   bg: () => (/* binding */ bg),
/* harmony export */   bho: () => (/* binding */ bho),
/* harmony export */   blo: () => (/* binding */ blo),
/* harmony export */   bm: () => (/* binding */ bm),
/* harmony export */   bn: () => (/* binding */ bn),
/* harmony export */   bo: () => (/* binding */ bo),
/* harmony export */   br: () => (/* binding */ br),
/* harmony export */   brx: () => (/* binding */ brx),
/* harmony export */   bs: () => (/* binding */ bs),
/* harmony export */   ca: () => (/* binding */ ca),
/* harmony export */   ce: () => (/* binding */ ce),
/* harmony export */   ceb: () => (/* binding */ ceb),
/* harmony export */   cgg: () => (/* binding */ cgg),
/* harmony export */   chr: () => (/* binding */ chr),
/* harmony export */   ckb: () => (/* binding */ ckb),
/* harmony export */   cs: () => (/* binding */ cs),
/* harmony export */   cy: () => (/* binding */ cy),
/* harmony export */   da: () => (/* binding */ da),
/* harmony export */   de: () => (/* binding */ de),
/* harmony export */   doi: () => (/* binding */ doi),
/* harmony export */   dsb: () => (/* binding */ dsb),
/* harmony export */   dv: () => (/* binding */ dv),
/* harmony export */   dz: () => (/* binding */ dz),
/* harmony export */   ee: () => (/* binding */ ee),
/* harmony export */   el: () => (/* binding */ el),
/* harmony export */   en: () => (/* binding */ en),
/* harmony export */   eo: () => (/* binding */ eo),
/* harmony export */   es: () => (/* binding */ es),
/* harmony export */   et: () => (/* binding */ et),
/* harmony export */   eu: () => (/* binding */ eu),
/* harmony export */   fa: () => (/* binding */ fa),
/* harmony export */   ff: () => (/* binding */ ff),
/* harmony export */   fi: () => (/* binding */ fi),
/* harmony export */   fil: () => (/* binding */ fil),
/* harmony export */   fo: () => (/* binding */ fo),
/* harmony export */   fr: () => (/* binding */ fr),
/* harmony export */   fur: () => (/* binding */ fur),
/* harmony export */   fy: () => (/* binding */ fy),
/* harmony export */   ga: () => (/* binding */ ga),
/* harmony export */   gd: () => (/* binding */ gd),
/* harmony export */   gl: () => (/* binding */ gl),
/* harmony export */   gsw: () => (/* binding */ gsw),
/* harmony export */   gu: () => (/* binding */ gu),
/* harmony export */   guw: () => (/* binding */ guw),
/* harmony export */   gv: () => (/* binding */ gv),
/* harmony export */   ha: () => (/* binding */ ha),
/* harmony export */   haw: () => (/* binding */ haw),
/* harmony export */   he: () => (/* binding */ he),
/* harmony export */   hi: () => (/* binding */ hi),
/* harmony export */   hnj: () => (/* binding */ hnj),
/* harmony export */   hr: () => (/* binding */ hr),
/* harmony export */   hsb: () => (/* binding */ hsb),
/* harmony export */   hu: () => (/* binding */ hu),
/* harmony export */   hy: () => (/* binding */ hy),
/* harmony export */   ia: () => (/* binding */ ia),
/* harmony export */   id: () => (/* binding */ id),
/* harmony export */   ig: () => (/* binding */ ig),
/* harmony export */   ii: () => (/* binding */ ii),
/* harmony export */   io: () => (/* binding */ io),
/* harmony export */   is: () => (/* binding */ is),
/* harmony export */   it: () => (/* binding */ it),
/* harmony export */   iu: () => (/* binding */ iu),
/* harmony export */   ja: () => (/* binding */ ja),
/* harmony export */   jbo: () => (/* binding */ jbo),
/* harmony export */   jgo: () => (/* binding */ jgo),
/* harmony export */   jmc: () => (/* binding */ jmc),
/* harmony export */   jv: () => (/* binding */ jv),
/* harmony export */   jw: () => (/* binding */ jw),
/* harmony export */   ka: () => (/* binding */ ka),
/* harmony export */   kab: () => (/* binding */ kab),
/* harmony export */   kaj: () => (/* binding */ kaj),
/* harmony export */   kcg: () => (/* binding */ kcg),
/* harmony export */   kde: () => (/* binding */ kde),
/* harmony export */   kea: () => (/* binding */ kea),
/* harmony export */   kk: () => (/* binding */ kk),
/* harmony export */   kkj: () => (/* binding */ kkj),
/* harmony export */   kl: () => (/* binding */ kl),
/* harmony export */   km: () => (/* binding */ km),
/* harmony export */   kn: () => (/* binding */ kn),
/* harmony export */   ko: () => (/* binding */ ko),
/* harmony export */   ks: () => (/* binding */ ks),
/* harmony export */   ksb: () => (/* binding */ ksb),
/* harmony export */   ksh: () => (/* binding */ ksh),
/* harmony export */   ku: () => (/* binding */ ku),
/* harmony export */   kw: () => (/* binding */ kw),
/* harmony export */   ky: () => (/* binding */ ky),
/* harmony export */   lag: () => (/* binding */ lag),
/* harmony export */   lb: () => (/* binding */ lb),
/* harmony export */   lg: () => (/* binding */ lg),
/* harmony export */   lij: () => (/* binding */ lij),
/* harmony export */   lkt: () => (/* binding */ lkt),
/* harmony export */   ln: () => (/* binding */ ln),
/* harmony export */   lo: () => (/* binding */ lo),
/* harmony export */   lt: () => (/* binding */ lt),
/* harmony export */   lv: () => (/* binding */ lv),
/* harmony export */   mas: () => (/* binding */ mas),
/* harmony export */   mg: () => (/* binding */ mg),
/* harmony export */   mgo: () => (/* binding */ mgo),
/* harmony export */   mk: () => (/* binding */ mk),
/* harmony export */   ml: () => (/* binding */ ml),
/* harmony export */   mn: () => (/* binding */ mn),
/* harmony export */   mo: () => (/* binding */ mo),
/* harmony export */   mr: () => (/* binding */ mr),
/* harmony export */   ms: () => (/* binding */ ms),
/* harmony export */   mt: () => (/* binding */ mt),
/* harmony export */   my: () => (/* binding */ my),
/* harmony export */   nah: () => (/* binding */ nah),
/* harmony export */   naq: () => (/* binding */ naq),
/* harmony export */   nb: () => (/* binding */ nb),
/* harmony export */   nd: () => (/* binding */ nd),
/* harmony export */   ne: () => (/* binding */ ne),
/* harmony export */   nl: () => (/* binding */ nl),
/* harmony export */   nn: () => (/* binding */ nn),
/* harmony export */   nnh: () => (/* binding */ nnh),
/* harmony export */   no: () => (/* binding */ no),
/* harmony export */   nqo: () => (/* binding */ nqo),
/* harmony export */   nr: () => (/* binding */ nr),
/* harmony export */   nso: () => (/* binding */ nso),
/* harmony export */   ny: () => (/* binding */ ny),
/* harmony export */   nyn: () => (/* binding */ nyn),
/* harmony export */   om: () => (/* binding */ om),
/* harmony export */   or: () => (/* binding */ or),
/* harmony export */   os: () => (/* binding */ os),
/* harmony export */   osa: () => (/* binding */ osa),
/* harmony export */   pa: () => (/* binding */ pa),
/* harmony export */   pap: () => (/* binding */ pap),
/* harmony export */   pcm: () => (/* binding */ pcm),
/* harmony export */   pl: () => (/* binding */ pl),
/* harmony export */   prg: () => (/* binding */ prg),
/* harmony export */   ps: () => (/* binding */ ps),
/* harmony export */   pt: () => (/* binding */ pt),
/* harmony export */   pt_PT: () => (/* binding */ pt_PT),
/* harmony export */   rm: () => (/* binding */ rm),
/* harmony export */   ro: () => (/* binding */ ro),
/* harmony export */   rof: () => (/* binding */ rof),
/* harmony export */   ru: () => (/* binding */ ru),
/* harmony export */   rwk: () => (/* binding */ rwk),
/* harmony export */   sah: () => (/* binding */ sah),
/* harmony export */   saq: () => (/* binding */ saq),
/* harmony export */   sat: () => (/* binding */ sat),
/* harmony export */   sc: () => (/* binding */ sc),
/* harmony export */   scn: () => (/* binding */ scn),
/* harmony export */   sd: () => (/* binding */ sd),
/* harmony export */   sdh: () => (/* binding */ sdh),
/* harmony export */   se: () => (/* binding */ se),
/* harmony export */   seh: () => (/* binding */ seh),
/* harmony export */   ses: () => (/* binding */ ses),
/* harmony export */   sg: () => (/* binding */ sg),
/* harmony export */   sh: () => (/* binding */ sh),
/* harmony export */   shi: () => (/* binding */ shi),
/* harmony export */   si: () => (/* binding */ si),
/* harmony export */   sk: () => (/* binding */ sk),
/* harmony export */   sl: () => (/* binding */ sl),
/* harmony export */   sma: () => (/* binding */ sma),
/* harmony export */   smi: () => (/* binding */ smi),
/* harmony export */   smj: () => (/* binding */ smj),
/* harmony export */   smn: () => (/* binding */ smn),
/* harmony export */   sms: () => (/* binding */ sms),
/* harmony export */   sn: () => (/* binding */ sn),
/* harmony export */   so: () => (/* binding */ so),
/* harmony export */   sq: () => (/* binding */ sq),
/* harmony export */   sr: () => (/* binding */ sr),
/* harmony export */   ss: () => (/* binding */ ss),
/* harmony export */   ssy: () => (/* binding */ ssy),
/* harmony export */   st: () => (/* binding */ st),
/* harmony export */   su: () => (/* binding */ su),
/* harmony export */   sv: () => (/* binding */ sv),
/* harmony export */   sw: () => (/* binding */ sw),
/* harmony export */   syr: () => (/* binding */ syr),
/* harmony export */   ta: () => (/* binding */ ta),
/* harmony export */   te: () => (/* binding */ te),
/* harmony export */   teo: () => (/* binding */ teo),
/* harmony export */   th: () => (/* binding */ th),
/* harmony export */   ti: () => (/* binding */ ti),
/* harmony export */   tig: () => (/* binding */ tig),
/* harmony export */   tk: () => (/* binding */ tk),
/* harmony export */   tl: () => (/* binding */ tl),
/* harmony export */   tn: () => (/* binding */ tn),
/* harmony export */   to: () => (/* binding */ to),
/* harmony export */   tpi: () => (/* binding */ tpi),
/* harmony export */   tr: () => (/* binding */ tr),
/* harmony export */   ts: () => (/* binding */ ts),
/* harmony export */   tzm: () => (/* binding */ tzm),
/* harmony export */   ug: () => (/* binding */ ug),
/* harmony export */   uk: () => (/* binding */ uk),
/* harmony export */   und: () => (/* binding */ und),
/* harmony export */   ur: () => (/* binding */ ur),
/* harmony export */   uz: () => (/* binding */ uz),
/* harmony export */   ve: () => (/* binding */ ve),
/* harmony export */   vec: () => (/* binding */ vec),
/* harmony export */   vi: () => (/* binding */ vi),
/* harmony export */   vo: () => (/* binding */ vo),
/* harmony export */   vun: () => (/* binding */ vun),
/* harmony export */   wa: () => (/* binding */ wa),
/* harmony export */   wae: () => (/* binding */ wae),
/* harmony export */   wo: () => (/* binding */ wo),
/* harmony export */   xh: () => (/* binding */ xh),
/* harmony export */   xog: () => (/* binding */ xog),
/* harmony export */   yi: () => (/* binding */ yi),
/* harmony export */   yo: () => (/* binding */ yo),
/* harmony export */   yue: () => (/* binding */ yue),
/* harmony export */   zh: () => (/* binding */ zh),
/* harmony export */   zu: () => (/* binding */ zu)
/* harmony export */ });
const a = (n, ord) => {
  if (ord) return 'other';
  return n == 1 ? 'one' : 'other';
};
const b = (n, ord) => {
  if (ord) return 'other';
  return (n == 0 || n == 1) ? 'one' : 'other';
};
const c = (n, ord) => {
  if (ord) return 'other';
  return n >= 0 && n <= 1 ? 'one' : 'other';
};
const d = (n, ord) => {
  const s = String(n).split('.'), v0 = !s[1];
  if (ord) return 'other';
  return n == 1 && v0 ? 'one' : 'other';
};
const e = (n, ord) => 'other';
const f = (n, ord) => {
  if (ord) return 'other';
  return n == 1 ? 'one'
    : n == 2 ? 'two'
    : 'other';
};

const af = a;
const ak = b;
const am = c;
const an = a;
const ar = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return n == 0 ? 'zero'
    : n == 1 ? 'one'
    : n == 2 ? 'two'
    : (n100 >= 3 && n100 <= 10) ? 'few'
    : (n100 >= 11 && n100 <= 99) ? 'many'
    : 'other';
};
const ars = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return n == 0 ? 'zero'
    : n == 1 ? 'one'
    : n == 2 ? 'two'
    : (n100 >= 3 && n100 <= 10) ? 'few'
    : (n100 >= 11 && n100 <= 99) ? 'many'
    : 'other';
};
const as = (n, ord) => {
  if (ord) return (n == 1 || n == 5 || n == 7 || n == 8 || n == 9 || n == 10) ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
  return n >= 0 && n <= 1 ? 'one' : 'other';
};
const asa = a;
const ast = d;
const az = (n, ord) => {
  const s = String(n).split('.'), i = s[0], i10 = i.slice(-1), i100 = i.slice(-2), i1000 = i.slice(-3);
  if (ord) return (i10 == 1 || i10 == 2 || i10 == 5 || i10 == 7 || i10 == 8) || (i100 == 20 || i100 == 50 || i100 == 70 || i100 == 80) ? 'one'
    : (i10 == 3 || i10 == 4) || (i1000 == 100 || i1000 == 200 || i1000 == 300 || i1000 == 400 || i1000 == 500 || i1000 == 600 || i1000 == 700 || i1000 == 800 || i1000 == 900) ? 'few'
    : i == 0 || i10 == 6 || (i100 == 40 || i100 == 60 || i100 == 90) ? 'many'
    : 'other';
  return n == 1 ? 'one' : 'other';
};
const bal = (n, ord) => n == 1 ? 'one' : 'other';
const be = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return (n10 == 2 || n10 == 3) && n100 != 12 && n100 != 13 ? 'few' : 'other';
  return n10 == 1 && n100 != 11 ? 'one'
    : (n10 >= 2 && n10 <= 4) && (n100 < 12 || n100 > 14) ? 'few'
    : t0 && n10 == 0 || (n10 >= 5 && n10 <= 9) || (n100 >= 11 && n100 <= 14) ? 'many'
    : 'other';
};
const bem = a;
const bez = a;
const bg = a;
const bho = b;
const blo = (n, ord) => {
  const s = String(n).split('.'), i = s[0];
  if (ord) return i == 0 ? 'zero'
    : i == 1 ? 'one'
    : (i == 2 || i == 3 || i == 4 || i == 5 || i == 6) ? 'few'
    : 'other';
  return n == 0 ? 'zero'
    : n == 1 ? 'one'
    : 'other';
};
const bm = e;
const bn = (n, ord) => {
  if (ord) return (n == 1 || n == 5 || n == 7 || n == 8 || n == 9 || n == 10) ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
  return n >= 0 && n <= 1 ? 'one' : 'other';
};
const bo = e;
const br = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), n1000000 = t0 && s[0].slice(-6);
  if (ord) return 'other';
  return n10 == 1 && n100 != 11 && n100 != 71 && n100 != 91 ? 'one'
    : n10 == 2 && n100 != 12 && n100 != 72 && n100 != 92 ? 'two'
    : ((n10 == 3 || n10 == 4) || n10 == 9) && (n100 < 10 || n100 > 19) && (n100 < 70 || n100 > 79) && (n100 < 90 || n100 > 99) ? 'few'
    : n != 0 && t0 && n1000000 == 0 ? 'many'
    : 'other';
};
const brx = a;
const bs = (n, ord) => {
  const s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one'
    : v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) || (f10 >= 2 && f10 <= 4) && (f100 < 12 || f100 > 14) ? 'few'
    : 'other';
};
const ca = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1], i1000000 = i.slice(-6);
  if (ord) return (n == 1 || n == 3) ? 'one'
    : n == 2 ? 'two'
    : n == 4 ? 'few'
    : 'other';
  return n == 1 && v0 ? 'one'
    : i != 0 && i1000000 == 0 && v0 ? 'many'
    : 'other';
};
const ce = a;
const ceb = (n, ord) => {
  const s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), f10 = f.slice(-1);
  if (ord) return 'other';
  return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? 'one' : 'other';
};
const cgg = a;
const chr = a;
const ckb = a;
const cs = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1];
  if (ord) return 'other';
  return n == 1 && v0 ? 'one'
    : (i >= 2 && i <= 4) && v0 ? 'few'
    : !v0 ? 'many'
    : 'other';
};
const cy = (n, ord) => {
  if (ord) return (n == 0 || n == 7 || n == 8 || n == 9) ? 'zero'
    : n == 1 ? 'one'
    : n == 2 ? 'two'
    : (n == 3 || n == 4) ? 'few'
    : (n == 5 || n == 6) ? 'many'
    : 'other';
  return n == 0 ? 'zero'
    : n == 1 ? 'one'
    : n == 2 ? 'two'
    : n == 3 ? 'few'
    : n == 6 ? 'many'
    : 'other';
};
const da = (n, ord) => {
  const s = String(n).split('.'), i = s[0], t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return n == 1 || !t0 && (i == 0 || i == 1) ? 'one' : 'other';
};
const de = d;
const doi = c;
const dsb = (n, ord) => {
  const s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i100 = i.slice(-2), f100 = f.slice(-2);
  if (ord) return 'other';
  return v0 && i100 == 1 || f100 == 1 ? 'one'
    : v0 && i100 == 2 || f100 == 2 ? 'two'
    : v0 && (i100 == 3 || i100 == 4) || (f100 == 3 || f100 == 4) ? 'few'
    : 'other';
};
const dv = a;
const dz = e;
const ee = a;
const el = a;
const en = (n, ord) => {
  const s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return n10 == 1 && n100 != 11 ? 'one'
    : n10 == 2 && n100 != 12 ? 'two'
    : n10 == 3 && n100 != 13 ? 'few'
    : 'other';
  return n == 1 && v0 ? 'one' : 'other';
};
const eo = a;
const es = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1], i1000000 = i.slice(-6);
  if (ord) return 'other';
  return n == 1 ? 'one'
    : i != 0 && i1000000 == 0 && v0 ? 'many'
    : 'other';
};
const et = d;
const eu = a;
const fa = c;
const ff = (n, ord) => {
  if (ord) return 'other';
  return n >= 0 && n < 2 ? 'one' : 'other';
};
const fi = d;
const fil = (n, ord) => {
  const s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), f10 = f.slice(-1);
  if (ord) return n == 1 ? 'one' : 'other';
  return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? 'one' : 'other';
};
const fo = a;
const fr = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1], i1000000 = i.slice(-6);
  if (ord) return n == 1 ? 'one' : 'other';
  return n >= 0 && n < 2 ? 'one'
    : i != 0 && i1000000 == 0 && v0 ? 'many'
    : 'other';
};
const fur = a;
const fy = d;
const ga = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return n == 1 ? 'one' : 'other';
  return n == 1 ? 'one'
    : n == 2 ? 'two'
    : (t0 && n >= 3 && n <= 6) ? 'few'
    : (t0 && n >= 7 && n <= 10) ? 'many'
    : 'other';
};
const gd = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return (n == 1 || n == 11) ? 'one'
    : (n == 2 || n == 12) ? 'two'
    : (n == 3 || n == 13) ? 'few'
    : 'other';
  return (n == 1 || n == 11) ? 'one'
    : (n == 2 || n == 12) ? 'two'
    : ((t0 && n >= 3 && n <= 10) || (t0 && n >= 13 && n <= 19)) ? 'few'
    : 'other';
};
const gl = d;
const gsw = a;
const gu = (n, ord) => {
  if (ord) return n == 1 ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
  return n >= 0 && n <= 1 ? 'one' : 'other';
};
const guw = b;
const gv = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return 'other';
  return v0 && i10 == 1 ? 'one'
    : v0 && i10 == 2 ? 'two'
    : v0 && (i100 == 0 || i100 == 20 || i100 == 40 || i100 == 60 || i100 == 80) ? 'few'
    : !v0 ? 'many'
    : 'other';
};
const ha = a;
const haw = a;
const he = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1];
  if (ord) return 'other';
  return i == 1 && v0 || i == 0 && !v0 ? 'one'
    : i == 2 && v0 ? 'two'
    : 'other';
};
const hi = (n, ord) => {
  if (ord) return n == 1 ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
  return n >= 0 && n <= 1 ? 'one' : 'other';
};
const hnj = e;
const hr = (n, ord) => {
  const s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one'
    : v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) || (f10 >= 2 && f10 <= 4) && (f100 < 12 || f100 > 14) ? 'few'
    : 'other';
};
const hsb = (n, ord) => {
  const s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i100 = i.slice(-2), f100 = f.slice(-2);
  if (ord) return 'other';
  return v0 && i100 == 1 || f100 == 1 ? 'one'
    : v0 && i100 == 2 || f100 == 2 ? 'two'
    : v0 && (i100 == 3 || i100 == 4) || (f100 == 3 || f100 == 4) ? 'few'
    : 'other';
};
const hu = (n, ord) => {
  if (ord) return (n == 1 || n == 5) ? 'one' : 'other';
  return n == 1 ? 'one' : 'other';
};
const hy = (n, ord) => {
  if (ord) return n == 1 ? 'one' : 'other';
  return n >= 0 && n < 2 ? 'one' : 'other';
};
const ia = d;
const id = e;
const ig = e;
const ii = e;
const io = d;
const is = (n, ord) => {
  const s = String(n).split('.'), i = s[0], t = (s[1] || '').replace(/0+$/, ''), t0 = Number(s[0]) == n, i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return 'other';
  return t0 && i10 == 1 && i100 != 11 || t % 10 == 1 && t % 100 != 11 ? 'one' : 'other';
};
const it = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1], i1000000 = i.slice(-6);
  if (ord) return (n == 11 || n == 8 || n == 80 || n == 800) ? 'many' : 'other';
  return n == 1 && v0 ? 'one'
    : i != 0 && i1000000 == 0 && v0 ? 'many'
    : 'other';
};
const iu = f;
const ja = e;
const jbo = e;
const jgo = a;
const jmc = a;
const jv = e;
const jw = e;
const ka = (n, ord) => {
  const s = String(n).split('.'), i = s[0], i100 = i.slice(-2);
  if (ord) return i == 1 ? 'one'
    : i == 0 || ((i100 >= 2 && i100 <= 20) || i100 == 40 || i100 == 60 || i100 == 80) ? 'many'
    : 'other';
  return n == 1 ? 'one' : 'other';
};
const kab = (n, ord) => {
  if (ord) return 'other';
  return n >= 0 && n < 2 ? 'one' : 'other';
};
const kaj = a;
const kcg = a;
const kde = e;
const kea = e;
const kk = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
  if (ord) return n10 == 6 || n10 == 9 || t0 && n10 == 0 && n != 0 ? 'many' : 'other';
  return n == 1 ? 'one' : 'other';
};
const kkj = a;
const kl = a;
const km = e;
const kn = c;
const ko = e;
const ks = a;
const ksb = a;
const ksh = (n, ord) => {
  if (ord) return 'other';
  return n == 0 ? 'zero'
    : n == 1 ? 'one'
    : 'other';
};
const ku = a;
const kw = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2), n1000 = t0 && s[0].slice(-3), n100000 = t0 && s[0].slice(-5), n1000000 = t0 && s[0].slice(-6);
  if (ord) return (t0 && n >= 1 && n <= 4) || ((n100 >= 1 && n100 <= 4) || (n100 >= 21 && n100 <= 24) || (n100 >= 41 && n100 <= 44) || (n100 >= 61 && n100 <= 64) || (n100 >= 81 && n100 <= 84)) ? 'one'
    : n == 5 || n100 == 5 ? 'many'
    : 'other';
  return n == 0 ? 'zero'
    : n == 1 ? 'one'
    : (n100 == 2 || n100 == 22 || n100 == 42 || n100 == 62 || n100 == 82) || t0 && n1000 == 0 && ((n100000 >= 1000 && n100000 <= 20000) || n100000 == 40000 || n100000 == 60000 || n100000 == 80000) || n != 0 && n1000000 == 100000 ? 'two'
    : (n100 == 3 || n100 == 23 || n100 == 43 || n100 == 63 || n100 == 83) ? 'few'
    : n != 1 && (n100 == 1 || n100 == 21 || n100 == 41 || n100 == 61 || n100 == 81) ? 'many'
    : 'other';
};
const ky = a;
const lag = (n, ord) => {
  const s = String(n).split('.'), i = s[0];
  if (ord) return 'other';
  return n == 0 ? 'zero'
    : (i == 0 || i == 1) && n != 0 ? 'one'
    : 'other';
};
const lb = a;
const lg = a;
const lij = (n, ord) => {
  const s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n;
  if (ord) return (n == 11 || n == 8 || (t0 && n >= 80 && n <= 89) || (t0 && n >= 800 && n <= 899)) ? 'many' : 'other';
  return n == 1 && v0 ? 'one' : 'other';
};
const lkt = e;
const ln = b;
const lo = (n, ord) => {
  if (ord) return n == 1 ? 'one' : 'other';
  return 'other';
};
const lt = (n, ord) => {
  const s = String(n).split('.'), f = s[1] || '', t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return n10 == 1 && (n100 < 11 || n100 > 19) ? 'one'
    : (n10 >= 2 && n10 <= 9) && (n100 < 11 || n100 > 19) ? 'few'
    : f != 0 ? 'many'
    : 'other';
};
const lv = (n, ord) => {
  const s = String(n).split('.'), f = s[1] || '', v = f.length, t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), f100 = f.slice(-2), f10 = f.slice(-1);
  if (ord) return 'other';
  return t0 && n10 == 0 || (n100 >= 11 && n100 <= 19) || v == 2 && (f100 >= 11 && f100 <= 19) ? 'zero'
    : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? 'one'
    : 'other';
};
const mas = a;
const mg = b;
const mgo = a;
const mk = (n, ord) => {
  const s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return i10 == 1 && i100 != 11 ? 'one'
    : i10 == 2 && i100 != 12 ? 'two'
    : (i10 == 7 || i10 == 8) && i100 != 17 && i100 != 18 ? 'many'
    : 'other';
  return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one' : 'other';
};
const ml = a;
const mn = a;
const mo = (n, ord) => {
  const s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return n == 1 ? 'one' : 'other';
  return n == 1 && v0 ? 'one'
    : !v0 || n == 0 || n != 1 && (n100 >= 1 && n100 <= 19) ? 'few'
    : 'other';
};
const mr = (n, ord) => {
  if (ord) return n == 1 ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : 'other';
  return n == 1 ? 'one' : 'other';
};
const ms = (n, ord) => {
  if (ord) return n == 1 ? 'one' : 'other';
  return 'other';
};
const mt = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return 'other';
  return n == 1 ? 'one'
    : n == 2 ? 'two'
    : n == 0 || (n100 >= 3 && n100 <= 10) ? 'few'
    : (n100 >= 11 && n100 <= 19) ? 'many'
    : 'other';
};
const my = e;
const nah = a;
const naq = f;
const nb = a;
const nd = a;
const ne = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return (t0 && n >= 1 && n <= 4) ? 'one' : 'other';
  return n == 1 ? 'one' : 'other';
};
const nl = d;
const nn = a;
const nnh = a;
const no = a;
const nqo = e;
const nr = a;
const nso = b;
const ny = a;
const nyn = a;
const om = a;
const or = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return (n == 1 || n == 5 || (t0 && n >= 7 && n <= 9)) ? 'one'
    : (n == 2 || n == 3) ? 'two'
    : n == 4 ? 'few'
    : n == 6 ? 'many'
    : 'other';
  return n == 1 ? 'one' : 'other';
};
const os = a;
const osa = e;
const pa = b;
const pap = a;
const pcm = c;
const pl = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return 'other';
  return n == 1 && v0 ? 'one'
    : v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) ? 'few'
    : v0 && i != 1 && (i10 == 0 || i10 == 1) || v0 && (i10 >= 5 && i10 <= 9) || v0 && (i100 >= 12 && i100 <= 14) ? 'many'
    : 'other';
};
const prg = (n, ord) => {
  const s = String(n).split('.'), f = s[1] || '', v = f.length, t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), f100 = f.slice(-2), f10 = f.slice(-1);
  if (ord) return 'other';
  return t0 && n10 == 0 || (n100 >= 11 && n100 <= 19) || v == 2 && (f100 >= 11 && f100 <= 19) ? 'zero'
    : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? 'one'
    : 'other';
};
const ps = a;
const pt = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1], i1000000 = i.slice(-6);
  if (ord) return 'other';
  return (i == 0 || i == 1) ? 'one'
    : i != 0 && i1000000 == 0 && v0 ? 'many'
    : 'other';
};
const pt_PT = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1], i1000000 = i.slice(-6);
  if (ord) return 'other';
  return n == 1 && v0 ? 'one'
    : i != 0 && i1000000 == 0 && v0 ? 'many'
    : 'other';
};
const rm = a;
const ro = (n, ord) => {
  const s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
  if (ord) return n == 1 ? 'one' : 'other';
  return n == 1 && v0 ? 'one'
    : !v0 || n == 0 || n != 1 && (n100 >= 1 && n100 <= 19) ? 'few'
    : 'other';
};
const rof = a;
const ru = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return 'other';
  return v0 && i10 == 1 && i100 != 11 ? 'one'
    : v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) ? 'few'
    : v0 && i10 == 0 || v0 && (i10 >= 5 && i10 <= 9) || v0 && (i100 >= 11 && i100 <= 14) ? 'many'
    : 'other';
};
const rwk = a;
const sah = e;
const saq = a;
const sat = f;
const sc = (n, ord) => {
  const s = String(n).split('.'), v0 = !s[1];
  if (ord) return (n == 11 || n == 8 || n == 80 || n == 800) ? 'many' : 'other';
  return n == 1 && v0 ? 'one' : 'other';
};
const scn = (n, ord) => {
  const s = String(n).split('.'), v0 = !s[1];
  if (ord) return (n == 11 || n == 8 || n == 80 || n == 800) ? 'many' : 'other';
  return n == 1 && v0 ? 'one' : 'other';
};
const sd = a;
const sdh = a;
const se = f;
const seh = a;
const ses = e;
const sg = e;
const sh = (n, ord) => {
  const s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one'
    : v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) || (f10 >= 2 && f10 <= 4) && (f100 < 12 || f100 > 14) ? 'few'
    : 'other';
};
const shi = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return n >= 0 && n <= 1 ? 'one'
    : (t0 && n >= 2 && n <= 10) ? 'few'
    : 'other';
};
const si = (n, ord) => {
  const s = String(n).split('.'), i = s[0], f = s[1] || '';
  if (ord) return 'other';
  return (n == 0 || n == 1) || i == 0 && f == 1 ? 'one' : 'other';
};
const sk = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1];
  if (ord) return 'other';
  return n == 1 && v0 ? 'one'
    : (i >= 2 && i <= 4) && v0 ? 'few'
    : !v0 ? 'many'
    : 'other';
};
const sl = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1], i100 = i.slice(-2);
  if (ord) return 'other';
  return v0 && i100 == 1 ? 'one'
    : v0 && i100 == 2 ? 'two'
    : v0 && (i100 == 3 || i100 == 4) || !v0 ? 'few'
    : 'other';
};
const sma = f;
const smi = f;
const smj = f;
const smn = f;
const sms = f;
const sn = a;
const so = a;
const sq = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return n == 1 ? 'one'
    : n10 == 4 && n100 != 14 ? 'many'
    : 'other';
  return n == 1 ? 'one' : 'other';
};
const sr = (n, ord) => {
  const s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), i100 = i.slice(-2), f10 = f.slice(-1), f100 = f.slice(-2);
  if (ord) return 'other';
  return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? 'one'
    : v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) || (f10 >= 2 && f10 <= 4) && (f100 < 12 || f100 > 14) ? 'few'
    : 'other';
};
const ss = a;
const ssy = a;
const st = a;
const su = e;
const sv = (n, ord) => {
  const s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return (n10 == 1 || n10 == 2) && n100 != 11 && n100 != 12 ? 'one' : 'other';
  return n == 1 && v0 ? 'one' : 'other';
};
const sw = d;
const syr = a;
const ta = a;
const te = a;
const teo = a;
const th = e;
const ti = b;
const tig = a;
const tk = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
  if (ord) return (n10 == 6 || n10 == 9) || n == 10 ? 'few' : 'other';
  return n == 1 ? 'one' : 'other';
};
const tl = (n, ord) => {
  const s = String(n).split('.'), i = s[0], f = s[1] || '', v0 = !s[1], i10 = i.slice(-1), f10 = f.slice(-1);
  if (ord) return n == 1 ? 'one' : 'other';
  return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? 'one' : 'other';
};
const tn = a;
const to = e;
const tpi = e;
const tr = a;
const ts = a;
const tzm = (n, ord) => {
  const s = String(n).split('.'), t0 = Number(s[0]) == n;
  if (ord) return 'other';
  return (n == 0 || n == 1) || (t0 && n >= 11 && n <= 99) ? 'one' : 'other';
};
const ug = a;
const uk = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), i10 = i.slice(-1), i100 = i.slice(-2);
  if (ord) return n10 == 3 && n100 != 13 ? 'few' : 'other';
  return v0 && i10 == 1 && i100 != 11 ? 'one'
    : v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12 || i100 > 14) ? 'few'
    : v0 && i10 == 0 || v0 && (i10 >= 5 && i10 <= 9) || v0 && (i100 >= 11 && i100 <= 14) ? 'many'
    : 'other';
};
const und = e;
const ur = d;
const uz = a;
const ve = a;
const vec = (n, ord) => {
  const s = String(n).split('.'), i = s[0], v0 = !s[1], i1000000 = i.slice(-6);
  if (ord) return (n == 11 || n == 8 || n == 80 || n == 800) ? 'many' : 'other';
  return n == 1 && v0 ? 'one'
    : i != 0 && i1000000 == 0 && v0 ? 'many'
    : 'other';
};
const vi = (n, ord) => {
  if (ord) return n == 1 ? 'one' : 'other';
  return 'other';
};
const vo = a;
const vun = a;
const wa = b;
const wae = a;
const wo = e;
const xh = a;
const xog = a;
const yi = d;
const yo = e;
const yue = e;
const zh = e;
const zu = c;


/***/ }),

/***/ "./node_modules/i18n/package.json":
/*!****************************************!*\
  !*** ./node_modules/i18n/package.json ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"name":"i18n","description":"lightweight translation module with dynamic json storage","version":"0.15.1","homepage":"http://github.com/mashpie/i18n-node","repository":{"type":"git","url":"http://github.com/mashpie/i18n-node.git"},"author":"Marcus Spiegel <marcus.spiegel@gmail.com>","funding":{"url":"https://github.com/sponsors/mashpie"},"main":"./index","files":["i18n.js","index.js","SECURITY.md"],"keywords":["template","i18n","l10n"],"directories":{"lib":"."},"dependencies":{"@messageformat/core":"^3.0.0","debug":"^4.3.3","fast-printf":"^1.6.9","make-plural":"^7.0.0","math-interval-parser":"^2.0.1","mustache":"^4.2.0"},"devDependencies":{"async":"^3.2.3","cookie-parser":"^1.4.6","eslint":"^8.8.0","eslint-config-prettier":"^8.3.0","eslint-config-standard":"^17.0.0","eslint-plugin-import":"^2.25.4","eslint-plugin-node":"^11.1.0","eslint-plugin-prettier":"^4.0.0","eslint-plugin-promise":"^6.0.0","eslint-plugin-standard":"^5.0.0","express":"^4.17.2","husky":"^8.0.1","lint-staged":"^12.3.2","mocha":"^10.0.0","nyc":"^15.1.0","prettier":"^2.5.1","should":"^13.2.3","sinon":"^14.0.0","yaml":"^2.1.0","zombie":"^6.1.4"},"engines":{"node":">=10"},"scripts":{"test":"mocha --exit","test-ci":"nyc mocha -- --exit","coverage":"nyc report --reporter=lcov"},"lint-staged":{"*.js":"eslint --cache --fix"},"license":"MIT","husky":{"hooks":{"pre-commit":"lint-staged"}}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_styles_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/styles/main.scss */ "./src/styles/main.scss");
/* harmony import */ var i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! i18n */ "./node_modules/i18n/index.js");
/* harmony import */ var i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(i18n__WEBPACK_IMPORTED_MODULE_1__);

// import "../assets/icons/main_img";

console.log("Это главная страница");
})();

/******/ })()
;
//# sourceMappingURL=index.bundle.js.map