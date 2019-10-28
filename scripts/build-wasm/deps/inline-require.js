/* eslint-disable no-unsafe-finally */
/* eslint-disable no-undef */
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; }();

var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj; };

var fs = require('fs');
var path = require('path');

function Token(_ref) {
  var begin = _ref.begin,
    end = _ref.end,
    offset = _ref.offset,
    value = _ref.value;

  this.begin = begin;
  this.end = end;
  this.offset = offset;
  this.value = value;
}

function inliner(fpath, callback) {
  if (!fpath || typeof fpath !== 'string') {
    return callback(new Error('[inline] expects first argument to be a string, ' + (typeof fpath === 'undefined' ? 'undefined' : _typeof(fpath)) + ' given'));
  }

  var re = /\brequire\s*\(\s*['"]([./]+[^'"]+)['"]\s*\)/g;
  var tokens = [];

  fs.readFile(path.resolve(fpath), 'utf8', function (err, _data) {
    if (err) {
      return callback(err);
    }

    var match = void 0;
    var offset = 0;
    while ((match = re.exec(_data)) !== null) {
      var _match = match,
        _match2 = _slicedToArray(_match, 2),
        requireDeclaration = _match2[0],
        relativePath = _match2[1];

      var dpath = path.resolve(path.resolve(path.dirname(fpath)), relativePath) + '.js';
      var dependency = fs.readFileSync(dpath, 'utf-8');

      tokens.push(new Token({
        begin: match.index + offset,
        end: re.lastIndex + offset,
        offset: offset,
        value: dependency
      }));

      offset += dependency.length - requireDeclaration.length;
    }

    var token = void 0;
    var data = _data;
    while ((token = tokens.shift())) {
      data = '' + data.slice(0, token.begin) + token.value + data.slice(token.end);
    }

    return callback(null, data);
  });
}

/* istanbul ignore next */
if (require.main === module) {
  // called from CLI
  if (process.argv && process.argv[2]) {
    inliner(process.argv[2], function (err, data) {
      if (err) {
        throw err;
      }
      process.stdout.write(data);
    });
  }
}

module.exports = inliner;

