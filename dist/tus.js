(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tus = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode = encode;
/* global: window */

var _window = window;
var btoa = _window.btoa;
function encode(data) {
  return btoa(unescape(encodeURIComponent(data)));
}

var isSupported = exports.isSupported = "btoa" in window;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newRequest = newRequest;
exports.resolveUrl = resolveUrl;

var _resolveUrl = require("resolve-url");

var _resolveUrl2 = _interopRequireDefault(_resolveUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function newRequest() {
  return new window.XMLHttpRequest();
} /* global window */


function resolveUrl(origin, link) {
  return (0, _resolveUrl2.default)(origin, link);
}

},{"resolve-url":10}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSource = getSource;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileSource = function () {
  function FileSource(file) {
    _classCallCheck(this, FileSource);

    this._file = file;
    this.size = file.size;
  }

  _createClass(FileSource, [{
    key: "slice",
    value: function slice(start, end) {
      return this._file.slice(start, end);
    }
  }, {
    key: "close",
    value: function close() {}
  }]);

  return FileSource;
}();

function getSource(input) {
  // Since we emulate the Blob type in our tests (not all target browsers
  // support it), we cannot use `instanceof` for testing whether the input value
  // can be handled. Instead, we simply check is the slice() function and the
  // size property are available.
  if (typeof input.slice === "function" && typeof input.size !== "undefined") {
    return new FileSource(input);
  }

  throw new Error("source object may only be an instance of File or Blob in this environment");
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setItem = setItem;
exports.getItem = getItem;
exports.removeItem = removeItem;
/* global window, localStorage */

var hasStorage = false;
try {
  hasStorage = "localStorage" in window;

  // Attempt to store and read entries from the local storage to detect Private
  // Mode on Safari on iOS (see #49)
  var key = "tusSupport";
  localStorage.setItem(key, localStorage.getItem(key));
} catch (e) {
  // If we try to access localStorage inside a sandboxed iframe, a SecurityError
  // is thrown. When in private mode on iOS Safari, a QuotaExceededError is
  // thrown (see #49)
  if (e.code === e.SECURITY_ERR || e.code === e.QUOTA_EXCEEDED_ERR) {
    hasStorage = false;
  } else {
    throw e;
  }
}

var canStoreURLs = exports.canStoreURLs = hasStorage;

function setItem(key, value) {
  if (!hasStorage) return;
  return localStorage.setItem(key, value);
}

function getItem(key) {
  if (!hasStorage) return;
  return localStorage.getItem(key);
}

function removeItem(key) {
  if (!hasStorage) return;
  return localStorage.removeItem(key);
}

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DetailedError = function (_Error) {
  _inherits(DetailedError, _Error);

  function DetailedError(error) {
    var causingErr = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var xhr = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, DetailedError);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DetailedError).call(this, error.message));

    _this.originalRequest = xhr;
    _this.causingError = causingErr;

    var message = error.message;
    if (causingErr != null) {
      message += ", caused by " + causingErr.toString();
    }
    if (xhr != null) {
      message += ", originated from request (response code: " + xhr.status + ", response text: " + xhr.responseText + ")";
    }
    _this.message = message;
    return _this;
  }

  return DetailedError;
}(Error);

exports.default = DetailedError;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fingerprint;
/**
 * Generate a fingerprint for a file which will be used the store the endpoint
 *
 * @param {File} file
 * @return {String}
 */
function fingerprint(file) {
  return ["tus", file.name, file.type, file.size, file.lastModified].join("-");
}

},{}],7:[function(require,module,exports){
"use strict";

var _upload = require("./upload");

var _upload2 = _interopRequireDefault(_upload);

var _storage = require("./browser/storage");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global window */
var defaultOptions = _upload2.default.defaultOptions;


if (typeof window !== "undefined") {
  // Browser environment using XMLHttpRequest
  var _window = window;
  var XMLHttpRequest = _window.XMLHttpRequest;
  var Blob = _window.Blob;


  var isSupported = XMLHttpRequest && Blob && typeof Blob.prototype.slice === "function";
} else {
  // Node.js environment using http module
  var isSupported = true;
}

// The usage of the commonjs exporting syntax instead of the new ECMAScript
// one is actually inteded and prevents weird behaviour if we are trying to
// import this module in another module using Babel.
module.exports = {
  Upload: _upload2.default,
  isSupported: isSupported,
  canStoreURLs: _storage.canStoreURLs,
  defaultOptions: defaultOptions
};

},{"./browser/storage":4,"./upload":8}],8:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global window */


// We import the files used inside the Node environment which are rewritten
// for browsers using the rules defined in the package.json


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fingerprint = require("./fingerprint");

var _fingerprint2 = _interopRequireDefault(_fingerprint);

var _error = require("./error");

var _error2 = _interopRequireDefault(_error);

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _request = require("./node/request");

var _source = require("./node/source");

var _base = require("./node/base64");

var Base64 = _interopRequireWildcard(_base);

var _storage = require("./browser/storage");

var Storage = _interopRequireWildcard(_storage);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
  endpoint: "",
  fingerprint: _fingerprint2.default,
  resume: true,
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  headers: {},
  chunkSize: Infinity,
  withCredentials: false,
  uploadUrl: null,
  uploadSize: null,
  overridePatchMethod: false,
  retryDelays: null
};

var Upload = function () {
  function Upload(file, options) {
    _classCallCheck(this, Upload);

    this.options = (0, _extend2.default)(true, {}, defaultOptions, options);

    // The underlying File/Blob object
    this.file = file;

    // The URL against which the file will be uploaded
    this.url = null;

    // The underlying XHR object for the current PATCH request
    this._xhr = null;

    // The fingerpinrt for the current file (set after start())
    this._fingerprint = null;

    // The offset used in the current PATCH request
    this._offset = null;

    // True if the current PATCH request has been aborted
    this._aborted = false;

    // The file's size in bytes
    this._size = null;

    // The Source object which will wrap around the given file and provides us
    // with a unified interface for getting its size and slice chunks from its
    // content allowing us to easily handle Files, Blobs, Buffers and Streams.
    this._source = null;

    // The current count of attempts which have been made. Null indicates none.
    this._retryAttempt = 0;

    // The timeout's ID which is used to delay the next retry
    this._retryTimeout = null;

    // The offset of the remote upload before the latest attempt was started.
    this._offsetBeforeRetry = 0;
  }

  _createClass(Upload, [{
    key: "start",
    value: function start() {
      var _this = this;

      var file = this.file;

      if (!file) {
        this._emitError(new Error("tus: no file or stream to upload provided"));
        return;
      }

      if (!this.options.endpoint) {
        this._emitError(new Error("tus: no endpoint provided"));
        return;
      }

      var source = this._source = (0, _source.getSource)(file, this.options.chunkSize);

      // Firstly, check if the caller has supplied a manual upload size or else
      // we will use the calculated size by the source object.
      if (this.options.uploadSize != null) {
        var size = +this.options.uploadSize;
        if (isNaN(size)) {
          throw new Error("tus: cannot convert `uploadSize` option into a number");
        }

        this._size = size;
      } else {
        var size = source.size;

        // The size property will be null if we cannot calculate the file's size,
        // for example if you handle a stream.
        if (size == null) {
          throw new Error("tus: cannot automatically derive upload's size from input and must be specified manually using the `uploadSize` option");
        }

        this._size = size;
      }

      var retryDelays = this.options.retryDelays;
      if (retryDelays != null) {
        if (Object.prototype.toString.call(retryDelays) !== "[object Array]") {
          throw new Error("tus: the `retryDelays` option must either be an array or null");
        } else {
          (function () {
            var errorCallback = _this.options.onError;
            _this.options.onError = function (err) {
              // Restore the original error callback which may have been set.
              _this.options.onError = errorCallback;

              // We will reset the attempt counter if
              // - we were already able to connect to the server (offset != null) and
              // - we were able to upload a small chunk of data to the server
              var shouldResetDelays = _this._offset != null && _this._offset > _this._offsetBeforeRetry;
              if (shouldResetDelays) {
                _this._retryAttempt = 0;
              }

              var isOnline = true;
              if (typeof window !== "undefined" && "navigator" in window && window.navigator.onLine === false) {
                isOnline = false;
              }

              // We only attempt a retry if
              // - we didn't exceed the maxium number of retries, yet, and
              // - this error was caused by a request or it's response and
              // - the error is not a client error (status 4xx) and
              // - the browser does not indicate that we are offline
              var shouldRetry = _this._retryAttempt < retryDelays.length && err.originalRequest != null && !inStatusCategory(err.originalRequest.status, 400) && isOnline;

              if (!shouldRetry) {
                _this._emitError(err);
                return;
              }

              var delay = retryDelays[_this._retryAttempt++];

              _this._offsetBeforeRetry = _this._offset;
              _this.options.uploadUrl = _this.url;

              _this._retryTimeout = setTimeout(function () {
                _this.start();
              }, delay);
            };
          })();
        }
      }

      // Reset the aborted flag when the upload is started or else the
      // _startUpload will stop before sending a request if the upload has been
      // aborted previously.
      this._aborted = false;

      // The upload had been started previously and we should reuse this URL.
      if (this.url != null) {
        this._resumeUpload();
        return;
      }

      // A URL has manually been specified, so we try to resume
      if (this.options.uploadUrl != null) {
        this.url = this.options.uploadUrl;
        this._resumeUpload();
        return;
      }

      // Try to find the endpoint for the file in the storage
      if (this.options.resume) {
        this._fingerprint = this.options.fingerprint(file);
        var resumedUrl = Storage.getItem(this._fingerprint);

        if (resumedUrl != null) {
          this.url = resumedUrl;
          this._resumeUpload();
          return;
        }
      }

      // An upload has not started for the file yet, so we start a new one
      this._createUpload();
    }
  }, {
    key: "abort",
    value: function abort() {
      if (this._xhr !== null) {
        this._xhr.abort();
        this._source.close();
        this._aborted = true;
      }

      if (this._retryTimeout != null) {
        clearTimeout(this._retryTimeout);
        this._retryTimeout = null;
      }
    }
  }, {
    key: "_emitXhrError",
    value: function _emitXhrError(xhr, err, causingErr) {
      this._emitError(new _error2.default(err, causingErr, xhr));
    }
  }, {
    key: "_emitError",
    value: function _emitError(err) {
      if (typeof this.options.onError === "function") {
        this.options.onError(err);
      } else {
        throw err;
      }
    }
  }, {
    key: "_emitSuccess",
    value: function _emitSuccess() {
      if (typeof this.options.onSuccess === "function") {
        this.options.onSuccess();
      }
    }

    /**
     * Publishes notification when data has been sent to the server. This
     * data may not have been accepted by the server yet.
     * @param  {number} bytesSent  Number of bytes sent to the server.
     * @param  {number} bytesTotal Total number of bytes to be sent to the server.
     */

  }, {
    key: "_emitProgress",
    value: function _emitProgress(bytesSent, bytesTotal) {
      if (typeof this.options.onProgress === "function") {
        this.options.onProgress(bytesSent, bytesTotal);
      }
    }

    /**
     * Publishes notification when a chunk of data has been sent to the server
     * and accepted by the server.
     * @param  {number} chunkSize  Size of the chunk that was accepted by the
     *                             server.
     * @param  {number} bytesAccepted Total number of bytes that have been
     *                                accepted by the server.
     * @param  {number} bytesTotal Total number of bytes to be sent to the server.
     */

  }, {
    key: "_emitChunkComplete",
    value: function _emitChunkComplete(chunkSize, bytesAccepted, bytesTotal) {
      if (typeof this.options.onChunkComplete === "function") {
        this.options.onChunkComplete(chunkSize, bytesAccepted, bytesTotal);
      }
    }

    /**
     * Set the headers used in the request and the withCredentials property
     * as defined in the options
     *
     * @param {XMLHttpRequest} xhr
     */

  }, {
    key: "_setupXHR",
    value: function _setupXHR(xhr) {
      this._xhr = xhr;

      xhr.setRequestHeader("Tus-Resumable", "1.0.0");
      var headers = this.options.headers;

      for (var name in headers) {
        xhr.setRequestHeader(name, headers[name]);
      }

      xhr.withCredentials = this.options.withCredentials;
    }

    /**
     * Create a new upload using the creation extension by sending a POST
     * request to the endpoint. After successful creation the file will be
     * uploaded
     *
     * @api private
     */

  }, {
    key: "_createUpload",
    value: function _createUpload() {
      var _this2 = this;

      var xhr = (0, _request.newRequest)();
      xhr.open("POST", this.options.endpoint, true);

      xhr.onload = function () {
        if (!inStatusCategory(xhr.status, 200)) {
          _this2._emitXhrError(xhr, new Error("tus: unexpected response while creating upload"));
          return;
        }

        var location = xhr.getResponseHeader("Location");
        if (location == null) {
          _this2._emitXhrError(xhr, new Error("tus: invalid or missing Location header"));
          return;
        }

        _this2.url = (0, _request.resolveUrl)(_this2.options.endpoint, location);

        if (_this2.options.resume) {
          Storage.setItem(_this2._fingerprint, _this2.url);
        }

        _this2._offset = 0;
        _this2._startUpload();
      };

      xhr.onerror = function (err) {
        _this2._emitXhrError(xhr, new Error("tus: failed to create upload"), err);
      };

      this._setupXHR(xhr);
      xhr.setRequestHeader("Upload-Length", this._size);

      // Add metadata if values have been added
      var metadata = encodeMetadata(this.options.metadata);
      if (metadata !== "") {
        xhr.setRequestHeader("Upload-Metadata", metadata);
      }

      xhr.send(null);
    }

    /*
     * Try to resume an existing upload. First a HEAD request will be sent
     * to retrieve the offset. If the request fails a new upload will be
     * created. In the case of a successful response the file will be uploaded.
     *
     * @api private
     */

  }, {
    key: "_resumeUpload",
    value: function _resumeUpload() {
      var _this3 = this;

      var xhr = (0, _request.newRequest)();
      xhr.open("HEAD", this.url, true);

      xhr.onload = function () {
        if (!inStatusCategory(xhr.status, 200)) {
          if (_this3.options.resume && inStatusCategory(xhr.status, 400)) {
            // Remove stored fingerprint and corresponding endpoint,
            // on client errors since the file can not be found
            Storage.removeItem(_this3._fingerprint);
          }

          // If the upload is locked (indicated by the 423 Locked status code), we
          // emit an error instead of directly starting a new upload. This way the
          // retry logic can catch the error and will retry the upload. An upload
          // is usually locked for a short period of time and will be available
          // afterwards.
          if (xhr.status === 423) {
            _this3._emitXhrError(xhr, new Error("tus: upload is currently locked; retry later"));
            return;
          }

          // Try to create a new upload
          _this3.url = null;
          _this3._createUpload();
          return;
        }

        var offset = parseInt(xhr.getResponseHeader("Upload-Offset"), 10);
        if (isNaN(offset)) {
          _this3._emitXhrError(xhr, new Error("tus: invalid or missing offset value"));
          return;
        }

        var length = parseInt(xhr.getResponseHeader("Upload-Length"), 10);
        if (isNaN(length)) {
          _this3._emitXhrError(xhr, new Error("tus: invalid or missing length value"));
          return;
        }

        // Upload has already been completed and we do not need to send additional
        // data to the server
        if (offset === length) {
          _this3._emitProgress(length, length);
          _this3._emitSuccess();
          return;
        }

        _this3._offset = offset;
        _this3._startUpload();
      };

      xhr.onerror = function (err) {
        _this3._emitXhrError(xhr, new Error("tus: failed to resume upload"), err);
      };

      this._setupXHR(xhr);
      xhr.send(null);
    }

    /**
     * Start uploading the file using PATCH requests. The file will be divided
     * into chunks as specified in the chunkSize option. During the upload
     * the onProgress event handler may be invoked multiple times.
     *
     * @api private
     */

  }, {
    key: "_startUpload",
    value: function _startUpload() {
      var _this4 = this;

      // If the upload has been aborted, we will not send the next PATCH request.
      // This is important if the abort method was called during a callback, such
      // as onChunkComplete or onProgress.
      if (this._aborted) {
        return;
      }

      var xhr = (0, _request.newRequest)();

      // Some browser and servers may not support the PATCH method. For those
      // cases, you can tell tus-js-client to use a POST request with the
      // X-HTTP-Method-Override header for simulating a PATCH request.
      if (this.options.overridePatchMethod) {
        xhr.open("POST", this.url, true);
        xhr.setRequestHeader("X-HTTP-Method-Override", "PATCH");
      } else {
        xhr.open("PATCH", this.url, true);
      }

      xhr.onload = function () {
        if (!inStatusCategory(xhr.status, 200)) {
          _this4._emitXhrError(xhr, new Error("tus: unexpected response while uploading chunk"));
          return;
        }

        var offset = parseInt(xhr.getResponseHeader("Upload-Offset"), 10);
        if (isNaN(offset)) {
          _this4._emitXhrError(xhr, new Error("tus: invalid or missing offset value"));
          return;
        }

        _this4._emitProgress(offset, _this4._size);
        _this4._emitChunkComplete(offset - _this4._offset, offset, _this4._size);

        _this4._offset = offset;

        if (offset == _this4._size) {
          // Yay, finally done :)
          _this4._emitSuccess();
          _this4._source.close();
          return;
        }

        _this4._startUpload();
      };

      xhr.onerror = function (err) {
        // Don't emit an error if the upload was aborted manually
        if (_this4._aborted) {
          return;
        }

        _this4._emitXhrError(xhr, new Error("tus: failed to upload chunk at offset " + _this4._offset), err);
      };

      // Test support for progress events before attaching an event listener
      if ("upload" in xhr) {
        xhr.upload.onprogress = function (e) {
          if (!e.lengthComputable) {
            return;
          }

          _this4._emitProgress(start + e.loaded, _this4._size);
        };
      }

      this._setupXHR(xhr);

      xhr.setRequestHeader("Upload-Offset", this._offset);
      xhr.setRequestHeader("Content-Type", "application/offset+octet-stream");

      var start = this._offset;
      var end = this._offset + this.options.chunkSize;

      // The specified chunkSize may be Infinity or the calcluated end position
      // may exceed the file's size. In both cases, we limit the end position to
      // the input's total size for simpler calculations and correctness.
      if (end === Infinity || end > this._size) {
        end = this._size;
      }

      xhr.send(this._source.slice(start, end));

      // Emit an progress event when a new chunk begins being uploaded.
      this._emitProgress(this._offset, this._size);
    }
  }]);

  return Upload;
}();

function encodeMetadata(metadata) {
  if (!Base64.isSupported) {
    return "";
  }

  var encoded = [];

  for (var key in metadata) {
    encoded.push(key + " " + Base64.encode(metadata[key]));
  }

  return encoded.join(",");
}

/**
 * Checks whether a given status is in the range of the expected category.
 * For example, only a status between 200 and 299 will satisfy the category 200.
 *
 * @api private
 */
function inStatusCategory(status, category) {
  return status >= category && status < category + 100;
}

Upload.defaultOptions = defaultOptions;

exports.default = Upload;

},{"./browser/storage":4,"./error":5,"./fingerprint":6,"./node/base64":1,"./node/request":2,"./node/source":3,"extend":9}],9:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],10:[function(require,module,exports){
// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

void (function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory)
  } else if (typeof exports === "object") {
    module.exports = factory()
  } else {
    root.resolveUrl = factory()
  }
}(this, function() {

  function resolveUrl(/* ...urls */) {
    var numUrls = arguments.length

    if (numUrls === 0) {
      throw new Error("resolveUrl requires at least one argument; got none.")
    }

    var base = document.createElement("base")
    base.href = arguments[0]

    if (numUrls === 1) {
      return base.href
    }

    var head = document.getElementsByTagName("head")[0]
    head.insertBefore(base, head.firstChild)

    var a = document.createElement("a")
    var resolved

    for (var index = 1; index < numUrls; index++) {
      a.href = arguments[index]
      resolved = a.href
      base.href = resolved
    }

    head.removeChild(base)

    return resolved
  }

  return resolveUrl

}));

},{}]},{},[7])(7)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwibGliL2Jyb3dzZXIvYmFzZTY0LmpzIiwibGliL2Jyb3dzZXIvcmVxdWVzdC5qcyIsImxpYi9icm93c2VyL3NvdXJjZS5qcyIsImxpYi9icm93c2VyL3N0b3JhZ2UuanMiLCJsaWIvZXJyb3IuanMiLCJsaWIvZmluZ2VycHJpbnQuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvdXBsb2FkLmpzIiwibm9kZV9tb2R1bGVzL2V4dGVuZC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZXNvbHZlLXVybC9yZXNvbHZlLXVybC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O1FDSWdCLE0sR0FBQSxNOzs7Y0FGRCxNO0lBQVIsSSxXQUFBLEk7QUFFQSxTQUFTLE1BQVQsQ0FBZ0IsSUFBaEIsRUFBc0I7QUFDM0IsU0FBTyxLQUFLLFNBQVMsbUJBQW1CLElBQW5CLENBQVQsQ0FBTCxDQUFQO0FBQ0Q7O0FBRU0sSUFBTSxvQ0FBYyxVQUFVLE1BQTlCOzs7Ozs7OztRQ0xTLFUsR0FBQSxVO1FBSUEsVSxHQUFBLFU7Ozs7Ozs7O0FBSlQsU0FBUyxVQUFULEdBQXNCO0FBQzNCLFNBQU8sSUFBSSxPQUFPLGNBQVgsRUFBUDtBQUNELEM7OztBQUVNLFNBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QixJQUE1QixFQUFrQztBQUN2QyxTQUFPLDBCQUFRLE1BQVIsRUFBZ0IsSUFBaEIsQ0FBUDtBQUNEOzs7Ozs7Ozs7O1FDSWUsUyxHQUFBLFM7Ozs7SUFiVixVO0FBQ0osV0FESSxVQUNKLENBQVksSUFBWixFQUFrQjtBQUFBLDBCQURkLFVBQ2M7O0FBQ2hCLFNBQUssS0FBTCxHQUFhLElBQWI7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQWpCO0FBQ0Q7O2VBSkcsVTs7MEJBTUUsSyxFQUFPLEcsRUFBSztB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWw6IHdpbmRvdyAqL1xuXG5jb25zdCB7YnRvYX0gPSB3aW5kb3c7XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNvZGUoZGF0YSkge1xuICByZXR1cm4gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoZGF0YSkpKTtcbn1cblxuZXhwb3J0IGNvbnN0IGlzU3VwcG9ydGVkID0gXCJidG9hXCIgaW4gd2luZG93O1xuIiwiLyogZ2xvYmFsIHdpbmRvdyAqL1xuaW1wb3J0IHJlc29sdmUgZnJvbSBcInJlc29sdmUtdXJsXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXdSZXF1ZXN0KCkge1xuICByZXR1cm4gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVVybChvcmlnaW4sIGxpbmspIHtcbiAgcmV0dXJuIHJlc29sdmUob3JpZ2luLCBsaW5rKTtcbn1cbiIsImNsYXNzIEZpbGVTb3VyY2Uge1xuICBjb25zdHJ1Y3RvcihmaWxlKSB7XG4gICAgdGhpcy5fZmlsZSA9IGZpbGU7XG4gICAgdGhpcy5zaXplID0gZmlsZS5zaXplO1xuICB9XG5cbiAgc2xpY2Uoc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiB0aGlzLl9maWxlLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICB9XG5cbiAgY2xvc2UoKSB7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U291cmNlKGlucHV0KSB7XG4gIC8vIFNpbmNlIHdlIGVtdWxhdGUgdGhlIEJsb2IgdHlwZSBpbiBvdXIgdGVzdHMgKG5vdCBhbGwgdGFyZ2V0IGJyb3dzZXJzXG4gIC8vIHN1cHBvcnQgaXQpLCB3ZSBjYW5ub3QgdXNlIGBpbnN0YW5jZW9mYCBmb3IgdGVzdGluZyB3aGV0aGVyIHRoZSBpbnB1dCB2YWx1ZVxuICAvLyBjYW4gYmUgaGFuZGxlZC4gSW5zdGVhZCwgd2Ugc2ltcGx5IGNoZWNrIGlzIHRoZSBzbGljZSgpIGZ1bmN0aW9uIGFuZCB0aGVcbiAgLy8gc2l6ZSBwcm9wZXJ0eSBhcmUgYXZhaWxhYmxlLlxuICBpZiAodHlwZW9mIGlucHV0LnNsaWNlID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIGlucHV0LnNpemUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4gbmV3IEZpbGVTb3VyY2UoaW5wdXQpO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKFwic291cmNlIG9iamVjdCBtYXkgb25seSBiZSBhbiBpbnN0YW5jZSBvZiBGaWxlIG9yIEJsb2IgaW4gdGhpcyBlbnZpcm9ubWVudFwiKTtcbn1cbiIsIi8qIGdsb2JhbCB3aW5kb3csIGxvY2FsU3RvcmFnZSAqL1xuXG5sZXQgaGFzU3RvcmFnZSA9IGZhbHNlO1xudHJ5IHtcbiAgaGFzU3RvcmFnZSA9IFwibG9jYWxTdG9yYWdlXCIgaW4gd2luZG93O1xuXG4gIC8vIEF0dGVtcHQgdG8gc3RvcmUgYW5kIHJlYWQgZW50cmllcyBmcm9tIHRoZSBsb2NhbCBzdG9yYWdlIHRvIGRldGVjdCBQcml2YXRlXG4gIC8vIE1vZGUgb24gU2FmYXJpIG9uIGlPUyAoc2VlICM0OSlcbiAgdmFyIGtleSA9IFwidHVzU3VwcG9ydFwiO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuXG59IGNhdGNoIChlKSB7XG4gIC8vIElmIHdlIHRyeSB0byBhY2Nlc3MgbG9jYWxTdG9yYWdlIGluc2lkZSBhIHNhbmRib3hlZCBpZnJhbWUsIGEgU2VjdXJpdHlFcnJvclxuICAvLyBpcyB0aHJvd24uIFdoZW4gaW4gcHJpdmF0ZSBtb2RlIG9uIGlPUyBTYWZhcmksIGEgUXVvdGFFeGNlZWRlZEVycm9yIGlzXG4gIC8vIHRocm93biAoc2VlICM0OSlcbiAgaWYgKGUuY29kZSA9PT0gZS5TRUNVUklUWV9FUlIgfHwgZS5jb2RlID09PSBlLlFVT1RBX0VYQ0VFREVEX0VSUikge1xuICAgIGhhc1N0b3JhZ2UgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBlO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBjYW5TdG9yZVVSTHMgPSBoYXNTdG9yYWdlO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0SXRlbShrZXksIHZhbHVlKSB7XG4gIGlmICghaGFzU3RvcmFnZSkgcmV0dXJuO1xuICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJdGVtKGtleSkge1xuICBpZiAoIWhhc1N0b3JhZ2UpIHJldHVybjtcbiAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVJdGVtKGtleSkge1xuICBpZiAoIWhhc1N0b3JhZ2UpIHJldHVybjtcbiAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG59XG4iLCJjbGFzcyBEZXRhaWxlZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihlcnJvciwgY2F1c2luZ0VyciA9IG51bGwsIHhociA9IG51bGwpIHtcbiAgICBzdXBlcihlcnJvci5tZXNzYWdlKTtcblxuICAgIHRoaXMub3JpZ2luYWxSZXF1ZXN0ID0geGhyO1xuICAgIHRoaXMuY2F1c2luZ0Vycm9yID0gY2F1c2luZ0VycjtcblxuICAgIGxldCBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBpZiAoY2F1c2luZ0VyciAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlICs9IGAsIGNhdXNlZCBieSAke2NhdXNpbmdFcnIudG9TdHJpbmcoKX1gO1xuICAgIH1cbiAgICBpZiAoeGhyICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2UgKz0gYCwgb3JpZ2luYXRlZCBmcm9tIHJlcXVlc3QgKHJlc3BvbnNlIGNvZGU6ICR7eGhyLnN0YXR1c30sIHJlc3BvbnNlIHRleHQ6ICR7eGhyLnJlc3BvbnNlVGV4dH0pYDtcbiAgICB9XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEZXRhaWxlZEVycm9yO1xuIiwiLyoqXG4gKiBHZW5lcmF0ZSBhIGZpbmdlcnByaW50IGZvciBhIGZpbGUgd2hpY2ggd2lsbCBiZSB1c2VkIHRoZSBzdG9yZSB0aGUgZW5kcG9pbnRcbiAqXG4gKiBAcGFyYW0ge0ZpbGV9IGZpbGVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmluZ2VycHJpbnQoZmlsZSkge1xuICByZXR1cm4gW1xuXHRcdFwidHVzXCIsXG5cdFx0ZmlsZS5uYW1lLFxuXHRcdGZpbGUudHlwZSxcblx0XHRmaWxlLnNpemUsXG5cdFx0ZmlsZS5sYXN0TW9kaWZpZWRcbiAgXS5qb2luKFwiLVwiKTtcbn1cbiIsIi8qIGdsb2JhbCB3aW5kb3cgKi9cbmltcG9ydCBVcGxvYWQgZnJvbSBcIi4vdXBsb2FkXCI7XG5pbXBvcnQge2NhblN0b3JlVVJMc30gZnJvbSBcIi4vYnJvd3Nlci9zdG9yYWdlXCI7XG5cbmNvbnN0IHtkZWZhdWx0T3B0aW9uc30gPSBVcGxvYWQ7XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIC8vIEJyb3dzZXIgZW52aXJvbm1lbnQgdXNpbmcgWE1MSHR0cFJlcXVlc3RcbiAgY29uc3Qge1hNTEh0dHBSZXF1ZXN0LCBCbG9ifSA9IHdpbmRvdztcblxuICB2YXIgaXNTdXBwb3J0ZWQgPSAoXG4gICAgWE1MSHR0cFJlcXVlc3QgJiZcbiAgICBCbG9iICYmXG4gICAgdHlwZW9mIEJsb2IucHJvdG90eXBlLnNsaWNlID09PSBcImZ1bmN0aW9uXCJcbiAgKTtcbn0gZWxzZSB7XG4gIC8vIE5vZGUuanMgZW52aXJvbm1lbnQgdXNpbmcgaHR0cCBtb2R1bGVcbiAgdmFyIGlzU3VwcG9ydGVkID0gdHJ1ZTtcbn1cblxuLy8gVGhlIHVzYWdlIG9mIHRoZSBjb21tb25qcyBleHBvcnRpbmcgc3ludGF4IGluc3RlYWQgb2YgdGhlIG5ldyBFQ01BU2NyaXB0XG4vLyBvbmUgaXMgYWN0dWFsbHkgaW50ZWRlZCBhbmQgcHJldmVudHMgd2VpcmQgYmVoYXZpb3VyIGlmIHdlIGFyZSB0cnlpbmcgdG9cbi8vIGltcG9ydCB0aGlzIG1vZHVsZSBpbiBhbm90aGVyIG1vZHVsZSB1c2luZyBCYWJlbC5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBVcGxvYWQsXG4gIGlzU3VwcG9ydGVkLFxuICBjYW5TdG9yZVVSTHMsXG4gIGRlZmF1bHRPcHRpb25zXG59O1xuIiwiLyogZ2xvYmFsIHdpbmRvdyAqL1xuaW1wb3J0IGZpbmdlcnByaW50IGZyb20gXCIuL2ZpbmdlcnByaW50XCI7XG5pbXBvcnQgRGV0YWlsZWRFcnJvciBmcm9tIFwiLi9lcnJvclwiO1xuaW1wb3J0IGV4dGVuZCBmcm9tIFwiZXh0ZW5kXCI7XG5cbi8vIFdlIGltcG9ydCB0aGUgZmlsZXMgdXNlZCBpbnNpZGUgdGhlIE5vZGUgZW52aXJvbm1lbnQgd2hpY2ggYXJlIHJld3JpdHRlblxuLy8gZm9yIGJyb3dzZXJzIHVzaW5nIHRoZSBydWxlcyBkZWZpbmVkIGluIHRoZSBwYWNrYWdlLmpzb25cbmltcG9ydCB7bmV3UmVxdWVzdCwgcmVzb2x2ZVVybH0gZnJvbSBcIi4vbm9kZS9yZXF1ZXN0XCI7XG5pbXBvcnQge2dldFNvdXJjZX0gZnJvbSBcIi4vbm9kZS9zb3VyY2VcIjtcbmltcG9ydCAqIGFzIEJhc2U2NCBmcm9tIFwiLi9ub2RlL2Jhc2U2NFwiO1xuaW1wb3J0ICogYXMgU3RvcmFnZSBmcm9tIFwiLi9icm93c2VyL3N0b3JhZ2VcIjtcblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGVuZHBvaW50OiBcIlwiLFxuICBmaW5nZXJwcmludCxcbiAgcmVzdW1lOiB0cnVlLFxuICBvblByb2dyZXNzOiBudWxsLFxuICBvbkNodW5rQ29tcGxldGU6IG51bGwsXG4gIG9uU3VjY2VzczogbnVsbCxcbiAgb25FcnJvcjogbnVsbCxcbiAgaGVhZGVyczoge30sXG4gIGNodW5rU2l6ZTogSW5maW5pdHksXG4gIHdpdGhDcmVkZW50aWFsczogZmFsc2UsXG4gIHVwbG9hZFVybDogbnVsbCxcbiAgdXBsb2FkU2l6ZTogbnVsbCxcbiAgb3ZlcnJpZGVQYXRjaE1ldGhvZDogZmFsc2UsXG4gIHJldHJ5RGVsYXlzOiBudWxsXG59O1xuXG5jbGFzcyBVcGxvYWQge1xuICBjb25zdHJ1Y3RvcihmaWxlLCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAvLyBUaGUgdW5kZXJseWluZyBGaWxlL0Jsb2Igb2JqZWN0XG4gICAgdGhpcy5maWxlID0gZmlsZTtcblxuICAgIC8vIFRoZSBVUkwgYWdhaW5zdCB3aGljaCB0aGUgZmlsZSB3aWxsIGJlIHVwbG9hZGVkXG4gICAgdGhpcy51cmwgPSBudWxsO1xuXG4gICAgLy8gVGhlIHVuZGVybHlpbmcgWEhSIG9iamVjdCBmb3IgdGhlIGN1cnJlbnQgUEFUQ0ggcmVxdWVzdFxuICAgIHRoaXMuX3hociA9IG51bGw7XG5cbiAgICAvLyBUaGUgZmluZ2VycGlucnQgZm9yIHRoZSBjdXJyZW50IGZpbGUgKHNldCBhZnRlciBzdGFydCgpKVxuICAgIHRoaXMuX2ZpbmdlcnByaW50ID0gbnVsbDtcblxuICAgIC8vIFRoZSBvZmZzZXQgdXNlZCBpbiB0aGUgY3VycmVudCBQQVRDSCByZXF1ZXN0XG4gICAgdGhpcy5fb2Zmc2V0ID0gbnVsbDtcblxuICAgIC8vIFRydWUgaWYgdGhlIGN1cnJlbnQgUEFUQ0ggcmVxdWVzdCBoYXMgYmVlbiBhYm9ydGVkXG4gICAgdGhpcy5fYWJvcnRlZCA9IGZhbHNlO1xuXG4gICAgLy8gVGhlIGZpbGUncyBzaXplIGluIGJ5dGVzXG4gICAgdGhpcy5fc2l6ZSA9IG51bGw7XG5cbiAgICAvLyBUaGUgU291cmNlIG9iamVjdCB3aGljaCB3aWxsIHdyYXAgYXJvdW5kIHRoZSBnaXZlbiBmaWxlIGFuZCBwcm92aWRlcyB1c1xuICAgIC8vIHdpdGggYSB1bmlmaWVkIGludGVyZmFjZSBmb3IgZ2V0dGluZyBpdHMgc2l6ZSBhbmQgc2xpY2UgY2h1bmtzIGZyb20gaXRzXG4gICAgLy8gY29udGVudCBhbGxvd2luZyB1cyB0byBlYXNpbHkgaGFuZGxlIEZpbGVzLCBCbG9icywgQnVmZmVycyBhbmQgU3RyZWFtcy5cbiAgICB0aGlzLl9zb3VyY2UgPSBudWxsO1xuXG4gICAgLy8gVGhlIGN1cnJlbnQgY291bnQgb2YgYXR0ZW1wdHMgd2hpY2ggaGF2ZSBiZWVuIG1hZGUuIE51bGwgaW5kaWNhdGVzIG5vbmUuXG4gICAgdGhpcy5fcmV0cnlBdHRlbXB0ID0gMDtcblxuICAgIC8vIFRoZSB0aW1lb3V0J3MgSUQgd2hpY2ggaXMgdXNlZCB0byBkZWxheSB0aGUgbmV4dCByZXRyeVxuICAgIHRoaXMuX3JldHJ5VGltZW91dCA9IG51bGw7XG5cbiAgICAvLyBUaGUgb2Zmc2V0IG9mIHRoZSByZW1vdGUgdXBsb2FkIGJlZm9yZSB0aGUgbGF0ZXN0IGF0dGVtcHQgd2FzIHN0YXJ0ZWQuXG4gICAgdGhpcy5fb2Zmc2V0QmVmb3JlUmV0cnkgPSAwO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgbGV0IGZpbGUgPSB0aGlzLmZpbGU7XG5cbiAgICBpZiAoIWZpbGUpIHtcbiAgICAgIHRoaXMuX2VtaXRFcnJvcihuZXcgRXJyb3IoXCJ0dXM6IG5vIGZpbGUgb3Igc3RyZWFtIHRvIHVwbG9hZCBwcm92aWRlZFwiKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuZW5kcG9pbnQpIHtcbiAgICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBFcnJvcihcInR1czogbm8gZW5kcG9pbnQgcHJvdmlkZWRcIikpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHNvdXJjZSA9IHRoaXMuX3NvdXJjZSA9IGdldFNvdXJjZShmaWxlLCB0aGlzLm9wdGlvbnMuY2h1bmtTaXplKTtcblxuICAgIC8vIEZpcnN0bHksIGNoZWNrIGlmIHRoZSBjYWxsZXIgaGFzIHN1cHBsaWVkIGEgbWFudWFsIHVwbG9hZCBzaXplIG9yIGVsc2VcbiAgICAvLyB3ZSB3aWxsIHVzZSB0aGUgY2FsY3VsYXRlZCBzaXplIGJ5IHRoZSBzb3VyY2Ugb2JqZWN0LlxuICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkU2l6ZSAhPSBudWxsKSB7XG4gICAgICBsZXQgc2l6ZSA9ICt0aGlzLm9wdGlvbnMudXBsb2FkU2l6ZTtcbiAgICAgIGlmIChpc05hTihzaXplKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0dXM6IGNhbm5vdCBjb252ZXJ0IGB1cGxvYWRTaXplYCBvcHRpb24gaW50byBhIG51bWJlclwiKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2l6ZSA9IHNpemU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBzaXplID0gc291cmNlLnNpemU7XG5cbiAgICAgIC8vIFRoZSBzaXplIHByb3BlcnR5IHdpbGwgYmUgbnVsbCBpZiB3ZSBjYW5ub3QgY2FsY3VsYXRlIHRoZSBmaWxlJ3Mgc2l6ZSxcbiAgICAgIC8vIGZvciBleGFtcGxlIGlmIHlvdSBoYW5kbGUgYSBzdHJlYW0uXG4gICAgICBpZiAoc2l6ZSA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInR1czogY2Fubm90IGF1dG9tYXRpY2FsbHkgZGVyaXZlIHVwbG9hZCdzIHNpemUgZnJvbSBpbnB1dCBhbmQgbXVzdCBiZSBzcGVjaWZpZWQgbWFudWFsbHkgdXNpbmcgdGhlIGB1cGxvYWRTaXplYCBvcHRpb25cIik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3NpemUgPSBzaXplO1xuICAgIH1cblxuICAgIGxldCByZXRyeURlbGF5cyA9IHRoaXMub3B0aW9ucy5yZXRyeURlbGF5cztcbiAgICBpZiAocmV0cnlEZWxheXMgIT0gbnVsbCkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChyZXRyeURlbGF5cykgIT09IFwiW29iamVjdCBBcnJheV1cIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0dXM6IHRoZSBgcmV0cnlEZWxheXNgIG9wdGlvbiBtdXN0IGVpdGhlciBiZSBhbiBhcnJheSBvciBudWxsXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGVycm9yQ2FsbGJhY2sgPSB0aGlzLm9wdGlvbnMub25FcnJvcjtcbiAgICAgICAgdGhpcy5vcHRpb25zLm9uRXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgLy8gUmVzdG9yZSB0aGUgb3JpZ2luYWwgZXJyb3IgY2FsbGJhY2sgd2hpY2ggbWF5IGhhdmUgYmVlbiBzZXQuXG4gICAgICAgICAgdGhpcy5vcHRpb25zLm9uRXJyb3IgPSBlcnJvckNhbGxiYWNrO1xuXG4gICAgICAgICAgLy8gV2Ugd2lsbCByZXNldCB0aGUgYXR0ZW1wdCBjb3VudGVyIGlmXG4gICAgICAgICAgLy8gLSB3ZSB3ZXJlIGFscmVhZHkgYWJsZSB0byBjb25uZWN0IHRvIHRoZSBzZXJ2ZXIgKG9mZnNldCAhPSBudWxsKSBhbmRcbiAgICAgICAgICAvLyAtIHdlIHdlcmUgYWJsZSB0byB1cGxvYWQgYSBzbWFsbCBjaHVuayBvZiBkYXRhIHRvIHRoZSBzZXJ2ZXJcbiAgICAgICAgICBsZXQgc2hvdWxkUmVzZXREZWxheXMgPSB0aGlzLl9vZmZzZXQgIT0gbnVsbCAmJiAodGhpcy5fb2Zmc2V0ID4gdGhpcy5fb2Zmc2V0QmVmb3JlUmV0cnkpO1xuICAgICAgICAgIGlmIChzaG91bGRSZXNldERlbGF5cykge1xuICAgICAgICAgICAgdGhpcy5fcmV0cnlBdHRlbXB0ID0gMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgaXNPbmxpbmUgPSB0cnVlO1xuICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICAgICAgXCJuYXZpZ2F0b3JcIiBpbiB3aW5kb3cgJiZcbiAgICAgICAgICAgICB3aW5kb3cubmF2aWdhdG9yLm9uTGluZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgIGlzT25saW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gV2Ugb25seSBhdHRlbXB0IGEgcmV0cnkgaWZcbiAgICAgICAgICAvLyAtIHdlIGRpZG4ndCBleGNlZWQgdGhlIG1heGl1bSBudW1iZXIgb2YgcmV0cmllcywgeWV0LCBhbmRcbiAgICAgICAgICAvLyAtIHRoaXMgZXJyb3Igd2FzIGNhdXNlZCBieSBhIHJlcXVlc3Qgb3IgaXQncyByZXNwb25zZSBhbmRcbiAgICAgICAgICAvLyAtIHRoZSBlcnJvciBpcyBub3QgYSBjbGllbnQgZXJyb3IgKHN0YXR1cyA0eHgpIGFuZFxuICAgICAgICAgIC8vIC0gdGhlIGJyb3dzZXIgZG9lcyBub3QgaW5kaWNhdGUgdGhhdCB3ZSBhcmUgb2ZmbGluZVxuICAgICAgICAgIGxldCBzaG91bGRSZXRyeSA9IHRoaXMuX3JldHJ5QXR0ZW1wdCA8IHJldHJ5RGVsYXlzLmxlbmd0aCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyci5vcmlnaW5hbFJlcXVlc3QgIT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICFpblN0YXR1c0NhdGVnb3J5KGVyci5vcmlnaW5hbFJlcXVlc3Quc3RhdHVzLCA0MDApICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNPbmxpbmU7XG5cbiAgICAgICAgICBpZiAoIXNob3VsZFJldHJ5KSB7XG4gICAgICAgICAgICB0aGlzLl9lbWl0RXJyb3IoZXJyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgZGVsYXkgPSByZXRyeURlbGF5c1t0aGlzLl9yZXRyeUF0dGVtcHQrK107XG5cbiAgICAgICAgICB0aGlzLl9vZmZzZXRCZWZvcmVSZXRyeSA9IHRoaXMuX29mZnNldDtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMudXBsb2FkVXJsID0gdGhpcy51cmw7XG5cbiAgICAgICAgICB0aGlzLl9yZXRyeVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgICB9LCBkZWxheSk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgdGhlIGFib3J0ZWQgZmxhZyB3aGVuIHRoZSB1cGxvYWQgaXMgc3RhcnRlZCBvciBlbHNlIHRoZVxuICAgIC8vIF9zdGFydFVwbG9hZCB3aWxsIHN0b3AgYmVmb3JlIHNlbmRpbmcgYSByZXF1ZXN0IGlmIHRoZSB1cGxvYWQgaGFzIGJlZW5cbiAgICAvLyBhYm9ydGVkIHByZXZpb3VzbHkuXG4gICAgdGhpcy5fYWJvcnRlZCA9IGZhbHNlO1xuXG4gICAgLy8gVGhlIHVwbG9hZCBoYWQgYmVlbiBzdGFydGVkIHByZXZpb3VzbHkgYW5kIHdlIHNob3VsZCByZXVzZSB0aGlzIFVSTC5cbiAgICBpZiAodGhpcy51cmwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fcmVzdW1lVXBsb2FkKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQSBVUkwgaGFzIG1hbnVhbGx5IGJlZW4gc3BlY2lmaWVkLCBzbyB3ZSB0cnkgdG8gcmVzdW1lXG4gICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRVcmwgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnVybCA9IHRoaXMub3B0aW9ucy51cGxvYWRVcmw7XG4gICAgICAgIHRoaXMuX3Jlc3VtZVVwbG9hZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVHJ5IHRvIGZpbmQgdGhlIGVuZHBvaW50IGZvciB0aGUgZmlsZSBpbiB0aGUgc3RvcmFnZVxuICAgIGlmICh0aGlzLm9wdGlvbnMucmVzdW1lKSB7XG4gICAgICAgIHRoaXMuX2ZpbmdlcnByaW50ID0gdGhpcy5vcHRpb25zLmZpbmdlcnByaW50KGZpbGUpO1xuICAgICAgICBsZXQgcmVzdW1lZFVybCA9IFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLl9maW5nZXJwcmludCk7XG5cbiAgICAgICAgaWYgKHJlc3VtZWRVcmwgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy51cmwgPSByZXN1bWVkVXJsO1xuICAgICAgICAgICAgdGhpcy5fcmVzdW1lVXBsb2FkKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBbiB1cGxvYWQgaGFzIG5vdCBzdGFydGVkIGZvciB0aGUgZmlsZSB5ZXQsIHNvIHdlIHN0YXJ0IGEgbmV3IG9uZVxuICAgIHRoaXMuX2NyZWF0ZVVwbG9hZCgpO1xuICB9XG5cbiAgYWJvcnQoKSB7XG4gICAgaWYgKHRoaXMuX3hociAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5feGhyLmFib3J0KCk7XG4gICAgICB0aGlzLl9zb3VyY2UuY2xvc2UoKTtcbiAgICAgIHRoaXMuX2Fib3J0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9yZXRyeVRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JldHJ5VGltZW91dCk7XG4gICAgICB0aGlzLl9yZXRyeVRpbWVvdXQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIF9lbWl0WGhyRXJyb3IoeGhyLCBlcnIsIGNhdXNpbmdFcnIpIHtcbiAgICB0aGlzLl9lbWl0RXJyb3IobmV3IERldGFpbGVkRXJyb3IoZXJyLCBjYXVzaW5nRXJyLCB4aHIpKTtcbiAgfVxuXG4gIF9lbWl0RXJyb3IoZXJyKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25FcnJvciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLm9wdGlvbnMub25FcnJvcihlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9XG5cbiAgX2VtaXRTdWNjZXNzKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uU3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLm9wdGlvbnMub25TdWNjZXNzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1Ymxpc2hlcyBub3RpZmljYXRpb24gd2hlbiBkYXRhIGhhcyBiZWVuIHNlbnQgdG8gdGhlIHNlcnZlci4gVGhpc1xuICAgKiBkYXRhIG1heSBub3QgaGF2ZSBiZWVuIGFjY2VwdGVkIGJ5IHRoZSBzZXJ2ZXIgeWV0LlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGJ5dGVzU2VudCAgTnVtYmVyIG9mIGJ5dGVzIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtICB7bnVtYmVyfSBieXRlc1RvdGFsIFRvdGFsIG51bWJlciBvZiBieXRlcyB0byBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBfZW1pdFByb2dyZXNzKGJ5dGVzU2VudCwgYnl0ZXNUb3RhbCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uUHJvZ3Jlc3MgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5vcHRpb25zLm9uUHJvZ3Jlc3MoYnl0ZXNTZW50LCBieXRlc1RvdGFsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaGVzIG5vdGlmaWNhdGlvbiB3aGVuIGEgY2h1bmsgb2YgZGF0YSBoYXMgYmVlbiBzZW50IHRvIHRoZSBzZXJ2ZXJcbiAgICogYW5kIGFjY2VwdGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSAge251bWJlcn0gY2h1bmtTaXplICBTaXplIG9mIHRoZSBjaHVuayB0aGF0IHdhcyBhY2NlcHRlZCBieSB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlci5cbiAgICogQHBhcmFtICB7bnVtYmVyfSBieXRlc0FjY2VwdGVkIFRvdGFsIG51bWJlciBvZiBieXRlcyB0aGF0IGhhdmUgYmVlblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXB0ZWQgYnkgdGhlIHNlcnZlci5cbiAgICogQHBhcmFtICB7bnVtYmVyfSBieXRlc1RvdGFsIFRvdGFsIG51bWJlciBvZiBieXRlcyB0byBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBfZW1pdENodW5rQ29tcGxldGUoY2h1bmtTaXplLCBieXRlc0FjY2VwdGVkLCBieXRlc1RvdGFsKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25DaHVua0NvbXBsZXRlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5vbkNodW5rQ29tcGxldGUoY2h1bmtTaXplLCBieXRlc0FjY2VwdGVkLCBieXRlc1RvdGFsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBoZWFkZXJzIHVzZWQgaW4gdGhlIHJlcXVlc3QgYW5kIHRoZSB3aXRoQ3JlZGVudGlhbHMgcHJvcGVydHlcbiAgICogYXMgZGVmaW5lZCBpbiB0aGUgb3B0aW9uc1xuICAgKlxuICAgKiBAcGFyYW0ge1hNTEh0dHBSZXF1ZXN0fSB4aHJcbiAgICovXG4gIF9zZXR1cFhIUih4aHIpIHtcbiAgICB0aGlzLl94aHIgPSB4aHI7XG5cbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlR1cy1SZXN1bWFibGVcIiwgXCIxLjAuMFwiKTtcbiAgICBsZXQgaGVhZGVycyA9IHRoaXMub3B0aW9ucy5oZWFkZXJzO1xuXG4gICAgZm9yIChsZXQgbmFtZSBpbiBoZWFkZXJzKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCBoZWFkZXJzW25hbWVdKTtcbiAgICB9XG5cbiAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdGhpcy5vcHRpb25zLndpdGhDcmVkZW50aWFscztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgdXBsb2FkIHVzaW5nIHRoZSBjcmVhdGlvbiBleHRlbnNpb24gYnkgc2VuZGluZyBhIFBPU1RcbiAgICogcmVxdWVzdCB0byB0aGUgZW5kcG9pbnQuIEFmdGVyIHN1Y2Nlc3NmdWwgY3JlYXRpb24gdGhlIGZpbGUgd2lsbCBiZVxuICAgKiB1cGxvYWRlZFxuICAgKlxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG4gIF9jcmVhdGVVcGxvYWQoKSB7XG4gICAgbGV0IHhociA9IG5ld1JlcXVlc3QoKTtcbiAgICB4aHIub3BlbihcIlBPU1RcIiwgdGhpcy5vcHRpb25zLmVuZHBvaW50LCB0cnVlKTtcblxuICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoIWluU3RhdHVzQ2F0ZWdvcnkoeGhyLnN0YXR1cywgMjAwKSkge1xuICAgICAgICB0aGlzLl9lbWl0WGhyRXJyb3IoeGhyLCBuZXcgRXJyb3IoXCJ0dXM6IHVuZXhwZWN0ZWQgcmVzcG9uc2Ugd2hpbGUgY3JlYXRpbmcgdXBsb2FkXCIpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgbG9jYXRpb24gPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJMb2NhdGlvblwiKTtcbiAgICAgIGlmIChsb2NhdGlvbiA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2VtaXRYaHJFcnJvcih4aHIsIG5ldyBFcnJvcihcInR1czogaW52YWxpZCBvciBtaXNzaW5nIExvY2F0aW9uIGhlYWRlclwiKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy51cmwgPSByZXNvbHZlVXJsKHRoaXMub3B0aW9ucy5lbmRwb2ludCwgbG9jYXRpb24pO1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnJlc3VtZSkge1xuICAgICAgICBTdG9yYWdlLnNldEl0ZW0odGhpcy5fZmluZ2VycHJpbnQsIHRoaXMudXJsKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICAgIHRoaXMuX3N0YXJ0VXBsb2FkKCk7XG4gICAgfTtcblxuICAgIHhoci5vbmVycm9yID0gKGVycikgPT4ge1xuICAgICAgdGhpcy5fZW1pdFhockVycm9yKHhociwgbmV3IEVycm9yKFwidHVzOiBmYWlsZWQgdG8gY3JlYXRlIHVwbG9hZFwiKSwgZXJyKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fc2V0dXBYSFIoeGhyKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlVwbG9hZC1MZW5ndGhcIiwgdGhpcy5fc2l6ZSk7XG5cbiAgICAvLyBBZGQgbWV0YWRhdGEgaWYgdmFsdWVzIGhhdmUgYmVlbiBhZGRlZFxuICAgIHZhciBtZXRhZGF0YSA9IGVuY29kZU1ldGFkYXRhKHRoaXMub3B0aW9ucy5tZXRhZGF0YSk7XG4gICAgaWYgKG1ldGFkYXRhICE9PSBcIlwiKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiVXBsb2FkLU1ldGFkYXRhXCIsIG1ldGFkYXRhKTtcbiAgICB9XG5cbiAgICB4aHIuc2VuZChudWxsKTtcbiAgfVxuXG4gIC8qXG4gICAqIFRyeSB0byByZXN1bWUgYW4gZXhpc3RpbmcgdXBsb2FkLiBGaXJzdCBhIEhFQUQgcmVxdWVzdCB3aWxsIGJlIHNlbnRcbiAgICogdG8gcmV0cmlldmUgdGhlIG9mZnNldC4gSWYgdGhlIHJlcXVlc3QgZmFpbHMgYSBuZXcgdXBsb2FkIHdpbGwgYmVcbiAgICogY3JlYXRlZC4gSW4gdGhlIGNhc2Ugb2YgYSBzdWNjZXNzZnVsIHJlc3BvbnNlIHRoZSBmaWxlIHdpbGwgYmUgdXBsb2FkZWQuXG4gICAqXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cbiAgX3Jlc3VtZVVwbG9hZCgpIHtcbiAgICBsZXQgeGhyID0gbmV3UmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKFwiSEVBRFwiLCB0aGlzLnVybCwgdHJ1ZSk7XG5cbiAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgaWYgKCFpblN0YXR1c0NhdGVnb3J5KHhoci5zdGF0dXMsIDIwMCkpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZXN1bWUgJiYgaW5TdGF0dXNDYXRlZ29yeSh4aHIuc3RhdHVzLCA0MDApKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHN0b3JlZCBmaW5nZXJwcmludCBhbmQgY29ycmVzcG9uZGluZyBlbmRwb2ludCxcbiAgICAgICAgICAvLyBvbiBjbGllbnQgZXJyb3JzIHNpbmNlIHRoZSBmaWxlIGNhbiBub3QgYmUgZm91bmRcbiAgICAgICAgICBTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5fZmluZ2VycHJpbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIHVwbG9hZCBpcyBsb2NrZWQgKGluZGljYXRlZCBieSB0aGUgNDIzIExvY2tlZCBzdGF0dXMgY29kZSksIHdlXG4gICAgICAgIC8vIGVtaXQgYW4gZXJyb3IgaW5zdGVhZCBvZiBkaXJlY3RseSBzdGFydGluZyBhIG5ldyB1cGxvYWQuIFRoaXMgd2F5IHRoZVxuICAgICAgICAvLyByZXRyeSBsb2dpYyBjYW4gY2F0Y2ggdGhlIGVycm9yIGFuZCB3aWxsIHJldHJ5IHRoZSB1cGxvYWQuIEFuIHVwbG9hZFxuICAgICAgICAvLyBpcyB1c3VhbGx5IGxvY2tlZCBmb3IgYSBzaG9ydCBwZXJpb2Qgb2YgdGltZSBhbmQgd2lsbCBiZSBhdmFpbGFibGVcbiAgICAgICAgLy8gYWZ0ZXJ3YXJkcy5cbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDQyMykge1xuICAgICAgICAgIHRoaXMuX2VtaXRYaHJFcnJvcih4aHIsIG5ldyBFcnJvcihcInR1czogdXBsb2FkIGlzIGN1cnJlbnRseSBsb2NrZWQ7IHJldHJ5IGxhdGVyXCIpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUcnkgdG8gY3JlYXRlIGEgbmV3IHVwbG9hZFxuICAgICAgICB0aGlzLnVybCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NyZWF0ZVVwbG9hZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBvZmZzZXQgPSBwYXJzZUludCh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJVcGxvYWQtT2Zmc2V0XCIpLCAxMCk7XG4gICAgICBpZiAoaXNOYU4ob2Zmc2V0KSkge1xuICAgICAgICB0aGlzLl9lbWl0WGhyRXJyb3IoeGhyLCBuZXcgRXJyb3IoXCJ0dXM6IGludmFsaWQgb3IgbWlzc2luZyBvZmZzZXQgdmFsdWVcIikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBsZW5ndGggPSBwYXJzZUludCh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJVcGxvYWQtTGVuZ3RoXCIpLCAxMCk7XG4gICAgICBpZiAoaXNOYU4obGVuZ3RoKSkge1xuICAgICAgICB0aGlzLl9lbWl0WGhyRXJyb3IoeGhyLCBuZXcgRXJyb3IoXCJ0dXM6IGludmFsaWQgb3IgbWlzc2luZyBsZW5ndGggdmFsdWVcIikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFVwbG9hZCBoYXMgYWxyZWFkeSBiZWVuIGNvbXBsZXRlZCBhbmQgd2UgZG8gbm90IG5lZWQgdG8gc2VuZCBhZGRpdGlvbmFsXG4gICAgICAvLyBkYXRhIHRvIHRoZSBzZXJ2ZXJcbiAgICAgIGlmIChvZmZzZXQgPT09IGxlbmd0aCkge1xuICAgICAgICB0aGlzLl9lbWl0UHJvZ3Jlc3MobGVuZ3RoLCBsZW5ndGgpO1xuICAgICAgICB0aGlzLl9lbWl0U3VjY2VzcygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX29mZnNldCA9IG9mZnNldDtcbiAgICAgIHRoaXMuX3N0YXJ0VXBsb2FkKCk7XG4gICAgfTtcblxuICAgIHhoci5vbmVycm9yID0gKGVycikgPT4ge1xuICAgICAgdGhpcy5fZW1pdFhockVycm9yKHhociwgbmV3IEVycm9yKFwidHVzOiBmYWlsZWQgdG8gcmVzdW1lIHVwbG9hZFwiKSwgZXJyKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fc2V0dXBYSFIoeGhyKTtcbiAgICB4aHIuc2VuZChudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB1cGxvYWRpbmcgdGhlIGZpbGUgdXNpbmcgUEFUQ0ggcmVxdWVzdHMuIFRoZSBmaWxlIHdpbGwgYmUgZGl2aWRlZFxuICAgKiBpbnRvIGNodW5rcyBhcyBzcGVjaWZpZWQgaW4gdGhlIGNodW5rU2l6ZSBvcHRpb24uIER1cmluZyB0aGUgdXBsb2FkXG4gICAqIHRoZSBvblByb2dyZXNzIGV2ZW50IGhhbmRsZXIgbWF5IGJlIGludm9rZWQgbXVsdGlwbGUgdGltZXMuXG4gICAqXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cbiAgX3N0YXJ0VXBsb2FkKCkge1xuICAgIC8vIElmIHRoZSB1cGxvYWQgaGFzIGJlZW4gYWJvcnRlZCwgd2Ugd2lsbCBub3Qgc2VuZCB0aGUgbmV4dCBQQVRDSCByZXF1ZXN0LlxuICAgIC8vIFRoaXMgaXMgaW1wb3J0YW50IGlmIHRoZSBhYm9ydCBtZXRob2Qgd2FzIGNhbGxlZCBkdXJpbmcgYSBjYWxsYmFjaywgc3VjaFxuICAgIC8vIGFzIG9uQ2h1bmtDb21wbGV0ZSBvciBvblByb2dyZXNzLlxuICAgIGlmICh0aGlzLl9hYm9ydGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHhociA9IG5ld1JlcXVlc3QoKTtcblxuICAgIC8vIFNvbWUgYnJvd3NlciBhbmQgc2VydmVycyBtYXkgbm90IHN1cHBvcnQgdGhlIFBBVENIIG1ldGhvZC4gRm9yIHRob3NlXG4gICAgLy8gY2FzZXMsIHlvdSBjYW4gdGVsbCB0dXMtanMtY2xpZW50IHRvIHVzZSBhIFBPU1QgcmVxdWVzdCB3aXRoIHRoZVxuICAgIC8vIFgtSFRUUC1NZXRob2QtT3ZlcnJpZGUgaGVhZGVyIGZvciBzaW11bGF0aW5nIGEgUEFUQ0ggcmVxdWVzdC5cbiAgICBpZiAodGhpcy5vcHRpb25zLm92ZXJyaWRlUGF0Y2hNZXRob2QpIHtcbiAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB0aGlzLnVybCwgdHJ1ZSk7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtSFRUUC1NZXRob2QtT3ZlcnJpZGVcIiwgXCJQQVRDSFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeGhyLm9wZW4oXCJQQVRDSFwiLCB0aGlzLnVybCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIGlmICghaW5TdGF0dXNDYXRlZ29yeSh4aHIuc3RhdHVzLCAyMDApKSB7XG4gICAgICAgIHRoaXMuX2VtaXRYaHJFcnJvcih4aHIsIG5ldyBFcnJvcihcInR1czogdW5leHBlY3RlZCByZXNwb25zZSB3aGlsZSB1cGxvYWRpbmcgY2h1bmtcIikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBvZmZzZXQgPSBwYXJzZUludCh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJVcGxvYWQtT2Zmc2V0XCIpLCAxMCk7XG4gICAgICBpZiAoaXNOYU4ob2Zmc2V0KSkge1xuICAgICAgICB0aGlzLl9lbWl0WGhyRXJyb3IoeGhyLCBuZXcgRXJyb3IoXCJ0dXM6IGludmFsaWQgb3IgbWlzc2luZyBvZmZzZXQgdmFsdWVcIikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2VtaXRQcm9ncmVzcyhvZmZzZXQsIHRoaXMuX3NpemUpO1xuICAgICAgdGhpcy5fZW1pdENodW5rQ29tcGxldGUob2Zmc2V0IC0gdGhpcy5fb2Zmc2V0LCBvZmZzZXQsIHRoaXMuX3NpemUpO1xuXG4gICAgICB0aGlzLl9vZmZzZXQgPSBvZmZzZXQ7XG5cbiAgICAgIGlmIChvZmZzZXQgPT0gdGhpcy5fc2l6ZSkge1xuICAgICAgICAvLyBZYXksIGZpbmFsbHkgZG9uZSA6KVxuICAgICAgICB0aGlzLl9lbWl0U3VjY2VzcygpO1xuICAgICAgICB0aGlzLl9zb3VyY2UuY2xvc2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zdGFydFVwbG9hZCgpO1xuICAgIH07XG5cbiAgICB4aHIub25lcnJvciA9IChlcnIpID0+IHtcbiAgICAgIC8vIERvbid0IGVtaXQgYW4gZXJyb3IgaWYgdGhlIHVwbG9hZCB3YXMgYWJvcnRlZCBtYW51YWxseVxuICAgICAgaWYgKHRoaXMuX2Fib3J0ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9lbWl0WGhyRXJyb3IoeGhyLCBuZXcgRXJyb3IoXCJ0dXM6IGZhaWxlZCB0byB1cGxvYWQgY2h1bmsgYXQgb2Zmc2V0IFwiICsgdGhpcy5fb2Zmc2V0KSwgZXJyKTtcbiAgICB9O1xuXG4gICAgLy8gVGVzdCBzdXBwb3J0IGZvciBwcm9ncmVzcyBldmVudHMgYmVmb3JlIGF0dGFjaGluZyBhbiBldmVudCBsaXN0ZW5lclxuICAgIGlmIChcInVwbG9hZFwiIGluIHhocikge1xuICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gKGUpID0+IHtcbiAgICAgICAgaWYgKCFlLmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9lbWl0UHJvZ3Jlc3Moc3RhcnQgKyBlLmxvYWRlZCwgdGhpcy5fc2l6ZSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMuX3NldHVwWEhSKHhocik7XG5cbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlVwbG9hZC1PZmZzZXRcIiwgdGhpcy5fb2Zmc2V0KTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL29mZnNldCtvY3RldC1zdHJlYW1cIik7XG5cbiAgICBsZXQgc3RhcnQgPSB0aGlzLl9vZmZzZXQ7XG4gICAgbGV0IGVuZCA9IHRoaXMuX29mZnNldCArIHRoaXMub3B0aW9ucy5jaHVua1NpemU7XG5cbiAgICAvLyBUaGUgc3BlY2lmaWVkIGNodW5rU2l6ZSBtYXkgYmUgSW5maW5pdHkgb3IgdGhlIGNhbGNsdWF0ZWQgZW5kIHBvc2l0aW9uXG4gICAgLy8gbWF5IGV4Y2VlZCB0aGUgZmlsZSdzIHNpemUuIEluIGJvdGggY2FzZXMsIHdlIGxpbWl0IHRoZSBlbmQgcG9zaXRpb24gdG9cbiAgICAvLyB0aGUgaW5wdXQncyB0b3RhbCBzaXplIGZvciBzaW1wbGVyIGNhbGN1bGF0aW9ucyBhbmQgY29ycmVjdG5lc3MuXG4gICAgaWYgKGVuZCA9PT0gSW5maW5pdHkgfHwgZW5kID4gdGhpcy5fc2l6ZSkge1xuICAgICAgZW5kID0gdGhpcy5fc2l6ZTtcbiAgICB9XG5cbiAgICB4aHIuc2VuZCh0aGlzLl9zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCkpO1xuXG4gICAgLy8gRW1pdCBhbiBwcm9ncmVzcyBldmVudCB3aGVuIGEgbmV3IGNodW5rIGJlZ2lucyBiZWluZyB1cGxvYWRlZC5cbiAgICB0aGlzLl9lbWl0UHJvZ3Jlc3ModGhpcy5fb2Zmc2V0LCB0aGlzLl9zaXplKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBlbmNvZGVNZXRhZGF0YShtZXRhZGF0YSkge1xuICAgIGlmICghQmFzZTY0LmlzU3VwcG9ydGVkKSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIHZhciBlbmNvZGVkID0gW107XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gbWV0YWRhdGEpIHtcbiAgICAgICAgZW5jb2RlZC5wdXNoKGtleSArIFwiIFwiICsgQmFzZTY0LmVuY29kZShtZXRhZGF0YVtrZXldKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVuY29kZWQuam9pbihcIixcIik7XG59XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYSBnaXZlbiBzdGF0dXMgaXMgaW4gdGhlIHJhbmdlIG9mIHRoZSBleHBlY3RlZCBjYXRlZ29yeS5cbiAqIEZvciBleGFtcGxlLCBvbmx5IGEgc3RhdHVzIGJldHdlZW4gMjAwIGFuZCAyOTkgd2lsbCBzYXRpc2Z5IHRoZSBjYXRlZ29yeSAyMDAuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGluU3RhdHVzQ2F0ZWdvcnkoc3RhdHVzLCBjYXRlZ29yeSkge1xuICByZXR1cm4gKHN0YXR1cyA+PSBjYXRlZ29yeSAmJiBzdGF0dXMgPCAoY2F0ZWdvcnkgKyAxMDApKTtcbn1cblxuVXBsb2FkLmRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG5cbmV4cG9ydCBkZWZhdWx0IFVwbG9hZDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNBcnJheSA9IGZ1bmN0aW9uIGlzQXJyYXkoYXJyKSB7XG5cdGlmICh0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHJldHVybiBBcnJheS5pc0FycmF5KGFycik7XG5cdH1cblxuXHRyZXR1cm4gdG9TdHIuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuXHRpZiAoIW9iaiB8fCB0b1N0ci5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0dmFyIGhhc093bkNvbnN0cnVjdG9yID0gaGFzT3duLmNhbGwob2JqLCAnY29uc3RydWN0b3InKTtcblx0dmFyIGhhc0lzUHJvdG90eXBlT2YgPSBvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAmJiBoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCAnaXNQcm90b3R5cGVPZicpO1xuXHQvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG5cdGlmIChvYmouY29uc3RydWN0b3IgJiYgIWhhc093bkNvbnN0cnVjdG9yICYmICFoYXNJc1Byb3RvdHlwZU9mKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG5cdC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuXHR2YXIga2V5O1xuXHRmb3IgKGtleSBpbiBvYmopIHsvKiovfVxuXG5cdHJldHVybiB0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJyB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZCgpIHtcblx0dmFyIG9wdGlvbnMsIG5hbWUsIHNyYywgY29weSwgY29weUlzQXJyYXksIGNsb25lLFxuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1swXSxcblx0XHRpID0gMSxcblx0XHRsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuXHRcdGRlZXAgPSBmYWxzZTtcblxuXHQvLyBIYW5kbGUgYSBkZWVwIGNvcHkgc2l0dWF0aW9uXG5cdGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnYm9vbGVhbicpIHtcblx0XHRkZWVwID0gdGFyZ2V0O1xuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcblx0XHQvLyBza2lwIHRoZSBib29sZWFuIGFuZCB0aGUgdGFyZ2V0XG5cdFx0aSA9IDI7XG5cdH0gZWxzZSBpZiAoKHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnICYmIHR5cGVvZiB0YXJnZXQgIT09ICdmdW5jdGlvbicpIHx8IHRhcmdldCA9PSBudWxsKSB7XG5cdFx0dGFyZ2V0ID0ge307XG5cdH1cblxuXHRmb3IgKDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0b3B0aW9ucyA9IGFyZ3VtZW50c1tpXTtcblx0XHQvLyBPbmx5IGRlYWwgd2l0aCBub24tbnVsbC91bmRlZmluZWQgdmFsdWVzXG5cdFx0aWYgKG9wdGlvbnMgIT0gbnVsbCkge1xuXHRcdFx0Ly8gRXh0ZW5kIHRoZSBiYXNlIG9iamVjdFxuXHRcdFx0Zm9yIChuYW1lIGluIG9wdGlvbnMpIHtcblx0XHRcdFx0c3JjID0gdGFyZ2V0W25hbWVdO1xuXHRcdFx0XHRjb3B5ID0gb3B0aW9uc1tuYW1lXTtcblxuXHRcdFx0XHQvLyBQcmV2ZW50IG5ldmVyLWVuZGluZyBsb29wXG5cdFx0XHRcdGlmICh0YXJnZXQgIT09IGNvcHkpIHtcblx0XHRcdFx0XHQvLyBSZWN1cnNlIGlmIHdlJ3JlIG1lcmdpbmcgcGxhaW4gb2JqZWN0cyBvciBhcnJheXNcblx0XHRcdFx0XHRpZiAoZGVlcCAmJiBjb3B5ICYmIChpc1BsYWluT2JqZWN0KGNvcHkpIHx8IChjb3B5SXNBcnJheSA9IGlzQXJyYXkoY29weSkpKSkge1xuXHRcdFx0XHRcdFx0aWYgKGNvcHlJc0FycmF5KSB7XG5cdFx0XHRcdFx0XHRcdGNvcHlJc0FycmF5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIGlzQXJyYXkoc3JjKSA/IHNyYyA6IFtdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIE5ldmVyIG1vdmUgb3JpZ2luYWwgb2JqZWN0cywgY2xvbmUgdGhlbVxuXHRcdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gZXh0ZW5kKGRlZXAsIGNsb25lLCBjb3B5KTtcblxuXHRcdFx0XHRcdC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjb3B5ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gY29weTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIG1vZGlmaWVkIG9iamVjdFxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcblxuIiwiLy8gQ29weXJpZ2h0IDIwMTQgU2ltb24gTHlkZWxsXHJcbi8vIFgxMSAo4oCcTUlU4oCdKSBMaWNlbnNlZC4gKFNlZSBMSUNFTlNFLilcclxuXHJcbnZvaWQgKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcclxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcclxuICAgIGRlZmluZShmYWN0b3J5KVxyXG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpXHJcbiAgfSBlbHNlIHtcclxuICAgIHJvb3QucmVzb2x2ZVVybCA9IGZhY3RvcnkoKVxyXG4gIH1cclxufSh0aGlzLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgZnVuY3Rpb24gcmVzb2x2ZVVybCgvKiAuLi51cmxzICovKSB7XHJcbiAgICB2YXIgbnVtVXJscyA9IGFyZ3VtZW50cy5sZW5ndGhcclxuXHJcbiAgICBpZiAobnVtVXJscyA9PT0gMCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJyZXNvbHZlVXJsIHJlcXVpcmVzIGF0IGxlYXN0IG9uZSBhcmd1bWVudDsgZ290IG5vbmUuXCIpXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGJhc2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYmFzZVwiKVxyXG4gICAgYmFzZS5ocmVmID0gYXJndW1lbnRzWzBdXHJcblxyXG4gICAgaWYgKG51bVVybHMgPT09IDEpIHtcclxuICAgICAgcmV0dXJuIGJhc2UuaHJlZlxyXG4gICAgfVxyXG5cclxuICAgIHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdXHJcbiAgICBoZWFkLmluc2VydEJlZm9yZShiYXNlLCBoZWFkLmZpcnN0Q2hpbGQpXHJcblxyXG4gICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKVxyXG4gICAgdmFyIHJlc29sdmVkXHJcblxyXG4gICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IG51bVVybHM7IGluZGV4KyspIHtcclxuICAgICAgYS5ocmVmID0gYXJndW1lbnRzW2luZGV4XVxyXG4gICAgICByZXNvbHZlZCA9IGEuaHJlZlxyXG4gICAgICBiYXNlLmhyZWYgPSByZXNvbHZlZFxyXG4gICAgfVxyXG5cclxuICAgIGhlYWQucmVtb3ZlQ2hpbGQoYmFzZSlcclxuXHJcbiAgICByZXR1cm4gcmVzb2x2ZWRcclxuICB9XHJcblxyXG4gIHJldHVybiByZXNvbHZlVXJsXHJcblxyXG59KSk7XHJcbiJdfQ==
