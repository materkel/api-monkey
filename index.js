'use strict';

// API Monkey Middleware

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

module.exports = function () {
  return function (req, res, next) {
    /**
     * Set all monkey headers on the request object
     * for easy access and use in follow up request
     */
    var monkeyHeaders = {};
    Object.keys(req.headers).forEach(function (header) {
      if (header.split('_')[0] === 'monkey') {
        monkeyHeaders[header] = req.get(header);
      }
    });
    req.monkeyHeaders = monkeyHeaders;

    /*
     * Check if a header is directed at the current
     * handled route and initiate delay / error
     * accordingly
     */
    var path = req.path.split('/').filter(function (x) {
      return x !== '';
    });
    var id = ['monkey', req.method].concat(path);
    var header = null;

    for (var monkeyHeader in monkeyHeaders) {
      var headerTokens = monkeyHeader.split('_');
      var match = true;
      for (var i = 0; i < headerTokens.length; i++) {
        if (id[i]) {
          if (headerTokens[i] === '*') {
            // If the monkey header ends with a "*", make sure the
            // current route ends too, else don't match
            if (i === headerTokens.length - 1 && id[++i] !== undefined) {
              match = false;
              break;
            }
            continue;
          }
          if (headerTokens[i] === '**') {
            break;
          }
          if (id[i].toLowerCase() === headerTokens[i].toLowerCase()) {
            continue;
          }
        }
        match = false;
        break;
      }
      if (match === true) {
        header = monkeyHeaders[monkeyHeader];
        break;
      }
    }

    if (header) {
      var _ret = function () {
        var _header$split = header.split('/');

        var _header$split2 = _slicedToArray(_header$split, 2);

        var delay = _header$split2[0];
        var error = _header$split2[1];


        switch (error) {
          case 'true':
            error = 500;
            break;
          case 'none':
            error = null;
            break;
          default:
            // set custom error if specified
            error = parseInt(error);
        }
        delay = delay !== 'none' ? delay : 0;

        if (error !== null) {
          return {
            v: setTimeout(function () {
              return res.status(error).end();
            }, delay)
          };
        }
        return {
          v: setTimeout(next, delay)
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
    next();
  };
};