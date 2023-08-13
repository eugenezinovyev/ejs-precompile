//@ts-nocheck
/* eslint-disable */
import { Data, EscapeCallback, IncludeCallback, RethrowCallback } from "ejs";

/**
 * THIS FILE HAS BEEN AUTO-GENERATED, DO NOT EDIT!
 * Instead, edit the source EJS template file ..\with-parameters.ejs.
 */

("use strict");

function deepMerge(target: Data, source: Data): Data {
  for (const key of Object.keys(source)) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (
      typeof targetValue === "object" &&
      typeof sourceValue === "object"
    ) {
      target[key] = deepMerge(targetValue as Data, sourceValue as Data);
    } else {
      target[key] = sourceValue;
    }
  }

  return target;
}

export default function render(
  locals?: Data,
  escapeFn?: EscapeCallback,
  include?: IncludeCallback,
  rethrow?: RethrowCallback,
): string {
  const defaults = {};
  const localsWithDefaults = deepMerge(
    Object.assign({}, defaults),
    locals ?? {},
  );

  return (function anonymous(locals, escapeFn, include, rethrow) {
    "use strict";
    rethrow =
      rethrow ||
      function rethrow(err, str, flnm, lineno, esc) {
        var lines = str.split("\n");
        var start = Math.max(lineno - 3, 0);
        var end = Math.min(lines.length, lineno + 3);
        var filename = esc(flnm);
        // Error context
        var context = lines
          .slice(start, end)
          .map(function (line, i) {
            var curr = i + start + 1;
            return (curr == lineno ? " >> " : "    ") + curr + "| " + line;
          })
          .join("\n");

        // Alter exception message
        err.path = filename;
        err.message =
          (filename || "ejs") +
          ":" +
          lineno +
          "\n" +
          context +
          "\n\n" +
          err.message;

        throw err;
      };
    escapeFn =
      escapeFn ||
      function (markup) {
        return markup == undefined
          ? ""
          : String(markup).replace(_MATCH_HTML, encode_char);
      };
    var _ENCODE_HTML_RULES = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&#34;",
        "'": "&#39;",
      },
      _MATCH_HTML = /[&<>'"]/g;
    function encode_char(c) {
      return _ENCODE_HTML_RULES[c] || c;
    }
    var __line = 1,
      __lines =
        '<!DOCTYPE html>\r\n<html lang="<%= locals.lang %>>">\r\n<head>\r\n<title>Sample</title>\r\n</head>\r\n<body>\r\n<%= locals.text %>\r\n</body>\r\n</html>',
      __filename = undefined;
    try {
      var __output = "";
      function __append(s) {
        if (s !== undefined && s !== null) __output += s;
      }
      __append('<!DOCTYPE html>\r\n<html lang="');
      __line = 2;
      __append(escapeFn(locals.lang));
      __append(
        '>">\r\n<head>\r\n<title>Sample</title>\r\n</head>\r\n<body>\r\n',
      );
      __line = 7;
      __append(escapeFn(locals.text));
      __append("\r\n</body>\r\n</html>");
      __line = 9;
      return __output;
    } catch (e) {
      rethrow(e, __lines, __filename, __line, escapeFn);
    }
  })(localsWithDefaults, escapeFn, include, rethrow);
}
