(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AcmeService"] = factory();
	else
		root["AcmeService"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/acmeService.ts":
/*!****************************!*\
  !*** ./src/acmeService.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _constants_constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./constants/constants */ "./src/constants/constants.ts");
/* harmony import */ var _constants_methods__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./constants/methods */ "./src/constants/methods.ts");
/* harmony import */ var _util_bbg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./util/bbg */ "./src/util/bbg.ts");




function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }




var AcmeService = /*#__PURE__*/function () {
  // private didReplay: boolean

  function AcmeService(glue, fdc3) {
    var _this = this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, AcmeService);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "glue", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "fdc3", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "methods", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "clientSyncedId", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "raiseViewOrderHistory", /*#__PURE__*/function () {
      var _ref = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee(context) {
        var _this$fdc;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.shouldRaiseIntent();
              case 2:
                if (!_context.sent) {
                  _context.next = 4;
                  break;
                }
                (_this$fdc = _this.fdc3) === null || _this$fdc === void 0 ? void 0 : _this$fdc.raiseIntent(_constants_constants__WEBPACK_IMPORTED_MODULE_5__.ViewOrderHistoryIntent, context, {
                  appId: 'fdc3-oms-order-history'
                }).catch(function (error) {
                  console.error('ViewOrderHistory intent failed. Error: ', error);
                });
              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "shouldRaiseIntent", /*#__PURE__*/(0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee2() {
      var intents;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _this.fdc3.findIntent(_constants_constants__WEBPACK_IMPORTED_MODULE_5__.ViewOrderHistoryIntent);
            case 2:
              intents = _context2.sent;
              return _context2.abrupt("return", !!intents.apps.find(function (i) {
                return i.name === 'fdc3-oms-order-history';
              }));
            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "getSfId", function (_ref3) {
      var _ids$find;
      var ids = _ref3.ids;
      return ids === null || ids === void 0 ? void 0 : (_ids$find = ids.find(function (_ref4) {
        var systemName = _ref4.systemName;
        return systemName === _constants_constants__WEBPACK_IMPORTED_MODULE_5__.SF_SYSTEM_NAME;
      })) === null || _ids$find === void 0 ? void 0 : _ids$find.nativeId;
    });
    this.glue = glue;
    this.fdc3 = fdc3;
    this.methods = [];
    this.clientSyncedId = '';
    // this.didReplay = false
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(AcmeService, [{
    key: "initialize",
    value: function () {
      var _initialize = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee4() {
        var _this2 = this;
        var _iterator, _step, _loop;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.methods.push({
                  definition: {
                    name: _constants_methods__WEBPACK_IMPORTED_MODULE_6__.METHODNAME_POPULATE_ORDER_DIALOG,
                    accepts: 'composite: { string side, number quantity, string instrument, string market, contact, timestamp } order',
                    returns: '',
                    displayName: 'Open order dialog with pre-populated fields',
                    description: 'Open order dialog with pre-populated fields'
                  },
                  handler: function handler(args) {
                    return _this2.populateOrderDialog(args);
                  }
                });

                // Extract back to ACME
                this.methods.push({
                  definition: {
                    name: _constants_methods__WEBPACK_IMPORTED_MODULE_6__.METHODNAME_ADDTOBBGWORKSHEET_FOREXCEL,
                    accepts: 'composite: { string side, number quantity, string instrument, string market, contact, timestamp } order',
                    returns: '',
                    displayName: 'Open order dialog with pre-populated fields',
                    description: 'Open order dialog with pre-populated fields'
                  },
                  handler: function handler(param) {
                    console.log('Received request to publish to BBG worksheet', param);
                    var instruments = param.symbols.filter(function (s) {
                      return s;
                    });
                    var watchlistName = Array.isArray(param.watchlist) ? param.watchlist[0] || _constants_constants__WEBPACK_IMPORTED_MODULE_5__.BBG_WORKSHEET_NAME : _constants_constants__WEBPACK_IMPORTED_MODULE_5__.BBG_WORKSHEET_NAME;
                    (0,_util_bbg__WEBPACK_IMPORTED_MODULE_7__.pushToBbgWorksheet)(instruments, _this2.glue, watchlistName);
                  }
                });
                this.methods.push({
                  definition: {
                    name: _constants_methods__WEBPACK_IMPORTED_MODULE_6__.METHODNAME_SALESFORCE_SYNC_CONTACT
                  },
                  handler: function () {
                    var _handler = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee3(args) {
                      var _contact$ids, _contact$ids$find, _yield$_this2$glue$in, _yield$_this2$glue$in2, _this2$glue;
                      var contact, sfNativeId, clients, internalClient;
                      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              contact = args.contact;
                              sfNativeId = contact === null || contact === void 0 ? void 0 : (_contact$ids = contact.ids) === null || _contact$ids === void 0 ? void 0 : (_contact$ids$find = _contact$ids.find(function (_ref5) {
                                var systemName = _ref5.systemName;
                                return systemName === _constants_constants__WEBPACK_IMPORTED_MODULE_5__.SF_SYSTEM_NAME;
                              })) === null || _contact$ids$find === void 0 ? void 0 : _contact$ids$find.nativeId;
                              _context3.next = 4;
                              return (_this2$glue = _this2.glue) === null || _this2$glue === void 0 ? void 0 : _this2$glue.interop.invoke(_constants_methods__WEBPACK_IMPORTED_MODULE_6__.METHODNAME_GET_CLIENTS);
                            case 4:
                              _context3.t2 = _yield$_this2$glue$in = _context3.sent;
                              _context3.t1 = _context3.t2 === null;
                              if (_context3.t1) {
                                _context3.next = 8;
                                break;
                              }
                              _context3.t1 = _yield$_this2$glue$in === void 0;
                            case 8:
                              if (!_context3.t1) {
                                _context3.next = 12;
                                break;
                              }
                              _context3.t3 = void 0;
                              _context3.next = 13;
                              break;
                            case 12:
                              _context3.t3 = (_yield$_this2$glue$in2 = _yield$_this2$glue$in.returned) === null || _yield$_this2$glue$in2 === void 0 ? void 0 : _yield$_this2$glue$in2.clients;
                            case 13:
                              _context3.t0 = _context3.t3;
                              if (_context3.t0) {
                                _context3.next = 16;
                                break;
                              }
                              _context3.t0 = [];
                            case 16:
                              clients = _context3.t0;
                              internalClient = clients.find(function (cl) {
                                return cl.salesforceId === sfNativeId;
                              });
                              if (!(sfNativeId === _this2.clientSyncedId)) {
                                _context3.next = 21;
                                break;
                              }
                              _this2.clientSyncedId = '';
                              return _context3.abrupt("return");
                            case 21:
                              if (internalClient) {
                                _this2.raiseViewOrderHistory({
                                  clientId: internalClient.clientId,
                                  securityId: {
                                    ticker: '',
                                    bbgExchange: ''
                                  }
                                });
                              }
                            case 22:
                            case "end":
                              return _context3.stop();
                          }
                        }
                      }, _callee3);
                    }));
                    function handler(_x2) {
                      return _handler.apply(this, arguments);
                    }
                    return handler;
                  }()
                });
                this.methods.push({
                  definition: {
                    name: _constants_methods__WEBPACK_IMPORTED_MODULE_6__.METHODNAME_ACME_SYNC_CONTACT
                  },
                  handler: function handler(args) {
                    var _args$contact, _args$contact$emails;
                    var sfId = _this2.getSfId(args.contact);
                    _this2.clientSyncedId = sfId;
                    _this2.glue.interop.invoke(_constants_methods__WEBPACK_IMPORTED_MODULE_6__.METHODNAME_VIEW_CONTACT, {
                      contact: {
                        type: 'fdc3.contact',
                        id: {
                          email: ((_args$contact = args.contact) === null || _args$contact === void 0 ? void 0 : (_args$contact$emails = _args$contact.emails) === null || _args$contact$emails === void 0 ? void 0 : _args$contact$emails.length) && args.contact.emails[0]
                        }
                      }
                    }, 'skipMine').catch(console.error);
                  }
                });
                this.methods.push({
                  definition: {
                    name: _constants_methods__WEBPACK_IMPORTED_MODULE_6__.METHODNAME_MORNINGSTAR_SYNC
                  },
                  handler: this.syncMorningStar.bind(this)
                });
                _context4.next = 7;
                return this.glue.contexts.subscribe('___channel___Blue', function (_, delta) {
                  var _delta$data, _delta$data$instrumen, _delta$data$instrumen2, _delta$data2, _delta$data2$instrume, _delta$data2$instrume2;
                  // TODO: document the intent for this check
                  var deltaRIC = delta === null || delta === void 0 ? void 0 : (_delta$data = delta.data) === null || _delta$data === void 0 ? void 0 : (_delta$data$instrumen = _delta$data.instrument) === null || _delta$data$instrumen === void 0 ? void 0 : (_delta$data$instrumen2 = _delta$data$instrumen.id) === null || _delta$data$instrumen2 === void 0 ? void 0 : _delta$data$instrumen2.RIC;
                  var deltaTicker = delta === null || delta === void 0 ? void 0 : (_delta$data2 = delta.data) === null || _delta$data2 === void 0 ? void 0 : (_delta$data2$instrume = _delta$data2.instrument) === null || _delta$data2$instrume === void 0 ? void 0 : (_delta$data2$instrume2 = _delta$data2$instrume.id) === null || _delta$data2$instrume2 === void 0 ? void 0 : _delta$data2$instrume2.ticker;
                  if (deltaRIC && deltaTicker || !deltaRIC) {
                    return;
                  }
                  var SPLIT_INSTRUMENT_RIC_REGEX = /[ .:]+/;
                  var RIC = deltaRIC.split(SPLIT_INSTRUMENT_RIC_REGEX);
                  var ticker = RIC[0];
                  var exchange = RIC[1];
                  if (ticker && typeof ticker === 'string') {
                    _this2.raiseViewOrderHistory({
                      securityId: {
                        ticker: ticker,
                        bbgExchange: exchange
                      },
                      clientId: ''
                    });
                  }
                });
              case 7:
                _iterator = _createForOfIteratorHelper(this.methods);
                try {
                  _loop = function _loop() {
                    var method = _step.value;
                    _this2.glue.interop.register(method.definition, method.handler).then(function () {
                      console.log('Method ' + method.definition.name + ' registered.');
                    }).catch(function (e) {
                      console.error('Method registration failed for ' + method.definition.name);
                      console.error(e);
                    });
                  };
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    _loop();
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }
              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
  }, {
    key: "syncMorningStar",
    value: function () {
      var _syncMorningStar = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee6(args) {
        var _this3 = this;
        var navigateToMorningstarUrl, funds, fundToSync, instruments, instrumentToSync;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                navigateToMorningstarUrl = /*#__PURE__*/function () {
                  var _ref6 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee5(url) {
                    var isGlue42Enterprise, _this3$glue$windows, morningstarWin, regExp, iframes;
                    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.prev = 0;
                            isGlue42Enterprise = typeof window.glue42gd !== 'undefined';
                            if (!isGlue42Enterprise) {
                              _context5.next = 9;
                              break;
                            }
                            morningstarWin = (_this3$glue$windows = _this3.glue.windows) === null || _this3$glue$windows === void 0 ? void 0 : _this3$glue$windows.find(_constants_methods__WEBPACK_IMPORTED_MODULE_6__.MORNINGSTAR_APP_NAME);
                            if (!(morningstarWin && url)) {
                              _context5.next = 7;
                              break;
                            }
                            _context5.next = 7;
                            return morningstarWin.navigate(url).catch(console.error);
                          case 7:
                            _context5.next = 12;
                            break;
                          case 9:
                            regExp = new RegExp(/\b(\w*morningstar\w*)\b/);
                            iframes = Array.from(document.getElementsByTagName('iframe'));
                            if (iframes && iframes.length) {
                              iframes.forEach(function (frame) {
                                if (frame.src.match(regExp)) {
                                  frame.src = url;
                                }
                              });
                            }
                          case 12:
                            _context5.next = 17;
                            break;
                          case 14:
                            _context5.prev = 14;
                            _context5.t0 = _context5["catch"](0);
                            console.log(_context5.t0);
                          case 17:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5, null, [[0, 14]]);
                  }));
                  return function navigateToMorningstarUrl(_x4) {
                    return _ref6.apply(this, arguments);
                  };
                }();
                _context6.next = 3;
                return this.glue.interop.invoke(_constants_methods__WEBPACK_IMPORTED_MODULE_6__.METHODNAME_GET_FUNDS).then(function (_ref7) {
                  var _returned$funds;
                  var returned = _ref7.returned;
                  return (_returned$funds = returned === null || returned === void 0 ? void 0 : returned.funds) !== null && _returned$funds !== void 0 ? _returned$funds : [];
                }).catch(function (error) {
                  console.error("Failed invoking ".concat(_constants_methods__WEBPACK_IMPORTED_MODULE_6__.METHODNAME_GET_FUNDS, ". Error: "), error);
                  return [];
                });
              case 3:
                funds = _context6.sent;
                fundToSync = funds.find(function (_ref8) {
                  var isin = _ref8.isin;
                  return isin === (args === null || args === void 0 ? void 0 : args.isin);
                });
                if (!fundToSync) {
                  _context6.next = 9;
                  break;
                }
                _context6.next = 8;
                return navigateToMorningstarUrl(fundToSync.url);
              case 8:
                return _context6.abrupt("return");
              case 9:
                _context6.next = 11;
                return this.glue.interop.invoke(_constants_methods__WEBPACK_IMPORTED_MODULE_6__.METHODNAME_GET_INSTRUMENTS).then(function (_ref9) {
                  var _returned$instruments;
                  var returned = _ref9.returned;
                  return (_returned$instruments = returned === null || returned === void 0 ? void 0 : returned.instruments) !== null && _returned$instruments !== void 0 ? _returned$instruments : [];
                }).catch(function (error) {
                  console.error("Failed invoking ".concat(_constants_methods__WEBPACK_IMPORTED_MODULE_6__.METHODNAME_GET_INSTRUMENTS, ". Error: "), error);
                  return [];
                });
              case 11:
                instruments = _context6.sent;
                instrumentToSync = instruments.find(function (_ref10) {
                  var ticker = _ref10.ticker;
                  return ticker === (args === null || args === void 0 ? void 0 : args.ticker);
                });
                if (!(instrumentToSync && instrumentToSync.url)) {
                  _context6.next = 16;
                  break;
                }
                _context6.next = 16;
                return navigateToMorningstarUrl(instrumentToSync.url);
              case 16:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));
      function syncMorningStar(_x3) {
        return _syncMorningStar.apply(this, arguments);
      }
      return syncMorningStar;
    }()
  }, {
    key: "populateOrderDialog",
    value: function () {
      var _populateOrderDialog = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee7(args) {
        var _yield$this$glue$inte, _this$glue, _args$instrument, _args$market, _args$contact2, _args$contact3, _args$contact3$emails, _this$fdc2;
        var orderSides, side, property, _args$side, displayName, ticker, exchange, RIC, order;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return (_this$glue = this.glue) === null || _this$glue === void 0 ? void 0 : _this$glue.interop.invoke(_constants_methods__WEBPACK_IMPORTED_MODULE_6__.METHODNAME_GET_ORDER_SIDES);
              case 2:
                _context7.t2 = _yield$this$glue$inte = _context7.sent;
                _context7.t1 = _context7.t2 === null;
                if (_context7.t1) {
                  _context7.next = 6;
                  break;
                }
                _context7.t1 = _yield$this$glue$inte === void 0;
              case 6:
                if (!_context7.t1) {
                  _context7.next = 10;
                  break;
                }
                _context7.t3 = void 0;
                _context7.next = 11;
                break;
              case 10:
                _context7.t3 = _yield$this$glue$inte.returned.orderSides;
              case 11:
                _context7.t0 = _context7.t3;
                if (_context7.t0) {
                  _context7.next = 14;
                  break;
                }
                _context7.t0 = [];
              case 14:
                orderSides = _context7.t0;
                side = args.side;
                _context7.t4 = _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().keys(orderSides);
              case 17:
                if ((_context7.t5 = _context7.t4()).done) {
                  _context7.next = 25;
                  break;
                }
                property = _context7.t5.value;
                displayName = orderSides[property].displayName;
                if (!(((_args$side = args.side) === null || _args$side === void 0 ? void 0 : _args$side.toLowerCase()) === (displayName === null || displayName === void 0 ? void 0 : displayName.toLowerCase()))) {
                  _context7.next = 23;
                  break;
                }
                side = property;
                return _context7.abrupt("break", 25);
              case 23:
                _context7.next = 17;
                break;
              case 25:
                ticker = ((_args$instrument = args.instrument) === null || _args$instrument === void 0 ? void 0 : _args$instrument.toUpperCase()) || '';
                exchange = ((_args$market = args.market) === null || _args$market === void 0 ? void 0 : _args$market.toUpperCase()) || '';
                RIC = exchange ? ticker + ' ' + exchange : ticker;
                order = {
                  type: 'fdc3.order',
                  side: side,
                  contact: {
                    type: 'fdc3.contact',
                    name: (_args$contact2 = args.contact) === null || _args$contact2 === void 0 ? void 0 : _args$contact2.displayName,
                    id: {
                      email: ((_args$contact3 = args.contact) === null || _args$contact3 === void 0 ? void 0 : (_args$contact3$emails = _args$contact3.emails) === null || _args$contact3$emails === void 0 ? void 0 : _args$contact3$emails.length) && args.contact.emails[0]
                    }
                  },
                  instrument: {
                    type: 'fdc3.instrument',
                    id: {
                      RIC: RIC,
                      ticker: ticker
                    }
                  },
                  quantity: args.quantity
                };
                (_this$fdc2 = this.fdc3) === null || _this$fdc2 === void 0 ? void 0 : _this$fdc2.raiseIntent('NewOrder', {
                  type: 'fdc3.order',
                  order: order
                }, {
                  appId: 'fdc3-oms-new-order'
                });
              case 30:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));
      function populateOrderDialog(_x5) {
        return _populateOrderDialog.apply(this, arguments);
      }
      return populateOrderDialog;
    }()
  }]);
  return AcmeService;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AcmeService);

/***/ }),

/***/ "./src/constants/constants.ts":
/*!************************************!*\
  !*** ./src/constants/constants.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BBG_WORKSHEET_NAME": () => (/* binding */ BBG_WORKSHEET_NAME),
/* harmony export */   "SF_SYSTEM_NAME": () => (/* binding */ SF_SYSTEM_NAME),
/* harmony export */   "ViewOrderHistoryIntent": () => (/* binding */ ViewOrderHistoryIntent)
/* harmony export */ });
var BBG_WORKSHEET_NAME = 'OMS Worksheet';
var SF_SYSTEM_NAME = 'SalesforceGlue42Connector';
var ViewOrderHistoryIntent = 'ViewOrderHistory';

/***/ }),

/***/ "./src/constants/methods.ts":
/*!**********************************!*\
  !*** ./src/constants/methods.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "METHODNAME_ACME_SYNC_CONTACT": () => (/* binding */ METHODNAME_ACME_SYNC_CONTACT),
/* harmony export */   "METHODNAME_ADDTOBBGWORKSHEET_FOREXCEL": () => (/* binding */ METHODNAME_ADDTOBBGWORKSHEET_FOREXCEL),
/* harmony export */   "METHODNAME_GET_CLIENTS": () => (/* binding */ METHODNAME_GET_CLIENTS),
/* harmony export */   "METHODNAME_GET_FUNDS": () => (/* binding */ METHODNAME_GET_FUNDS),
/* harmony export */   "METHODNAME_GET_INSTRUMENTS": () => (/* binding */ METHODNAME_GET_INSTRUMENTS),
/* harmony export */   "METHODNAME_GET_ORDER_SIDES": () => (/* binding */ METHODNAME_GET_ORDER_SIDES),
/* harmony export */   "METHODNAME_MORNINGSTAR_SYNC": () => (/* binding */ METHODNAME_MORNINGSTAR_SYNC),
/* harmony export */   "METHODNAME_POPULATE_ORDER_DIALOG": () => (/* binding */ METHODNAME_POPULATE_ORDER_DIALOG),
/* harmony export */   "METHODNAME_SALESFORCE_SYNC_CONTACT": () => (/* binding */ METHODNAME_SALESFORCE_SYNC_CONTACT),
/* harmony export */   "METHODNAME_VIEW_CONTACT": () => (/* binding */ METHODNAME_VIEW_CONTACT),
/* harmony export */   "MORNINGSTAR_APP_NAME": () => (/* binding */ MORNINGSTAR_APP_NAME)
/* harmony export */ });
var METHODNAME_POPULATE_ORDER_DIALOG = 'createOrder';
var METHODNAME_SALESFORCE_SYNC_CONTACT = 'T42.CRM.SyncContact';
var METHODNAME_ADDTOBBGWORKSHEET_FOREXCEL = 'IRESS.AddToBbgWatchlist';
var METHODNAME_ACME_SYNC_CONTACT = 'Acme.CRM.SyncContact';
var METHODNAME_VIEW_CONTACT = 'T42.ViewContact';
var METHODNAME_GET_ORDER_SIDES = 'T42.OMS.GetOrderSides';
var METHODNAME_GET_CLIENTS = 'T42.OMS.GetClients';
var METHODNAME_MORNINGSTAR_SYNC = 'T42.OMS.MorningStarSync';
var METHODNAME_GET_INSTRUMENTS = 'T42.OMS.GetInstruments';
var METHODNAME_GET_FUNDS = 'T42.OMS.GetFunds';
var MORNINGSTAR_APP_NAME = 'morningstar';

/***/ }),

/***/ "./src/util/bbg.ts":
/*!*************************!*\
  !*** ./src/util/bbg.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pushToBbgWorksheet": () => (/* binding */ pushToBbgWorksheet)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);



var unique = function unique(items) {
  return (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__["default"])(new Set(items));
};
var pushToBbgWorksheet = /*#__PURE__*/function () {
  var _ref = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee(instruments, glue, worksheetName) {
    var _worksheets$find, result, worksheets, worksheetId, _result, securities;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!instruments || instruments.length === 0)) {
              _context.next = 3;
              break;
            }
            console.log("pushToBbgWorksheet() No instrument passed");
            return _context.abrupt("return");
          case 3:
            _context.prev = 3;
            _context.next = 6;
            return glue === null || glue === void 0 ? void 0 : glue.interop.invoke('T42.BBG.GetWorksheets');
          case 6:
            result = _context.sent;
            worksheets = result === null || result === void 0 ? void 0 : result.returned.worksheets;
            worksheetId = (_worksheets$find = worksheets.find(function (worksheet) {
              return worksheet.name === worksheetName;
            })) === null || _worksheets$find === void 0 ? void 0 : _worksheets$find.id;
            if (worksheetId) {
              _context.next = 14;
              break;
            }
            _context.next = 12;
            return glue === null || glue === void 0 ? void 0 : glue.interop.invoke("T42.BBG.CreateWorksheet", {
              name: worksheetName,
              securities: []
            });
          case 12:
            _result = _context.sent;
            worksheetId = _result === null || _result === void 0 ? void 0 : _result.returned.worksheet.id;
          case 14:
            securities = unique(instruments).map(function (instr) {
              return instr.replace(":", " ").concat(" Equity");
            });
            console.log("Append [".concat(securities.join(', '), "] to worksheetId ").concat(worksheetId));
            _context.next = 18;
            return glue === null || glue === void 0 ? void 0 : glue.interop.invoke('T42.BBG.AppendWorksheetSecurities', {
              securities: securities,
              worksheetId: worksheetId
            });
          case 18:
            _context.next = 23;
            break;
          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](3);
            console.error('pushToBbgWorksheet() failed. Error: ', _context.t0);
          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 20]]);
  }));
  return function pushToBbgWorksheet(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/regeneratorRuntime.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/regeneratorRuntime.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/typeof.js")["default"]);
function _regeneratorRuntime() {
  "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) {
              if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            }
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) {
      keys.push(key);
    }
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) {
        "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      }
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/***/ ((module) => {

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(/*! ../helpers/regeneratorRuntime */ "./node_modules/@babel/runtime/helpers/regeneratorRuntime.js")();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayLikeToArray)
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayWithoutHoles)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _asyncToGenerator)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _classCallCheck)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _defineProperty)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperty(obj, key, value) {
  key = (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _iterableToArray)
/* harmony export */ });
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _nonIterableSpread)
/* harmony export */ });
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toConsumableArray)
/* harmony export */ });
/* harmony import */ var _arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithoutHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js");
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableSpread.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js");




function _toConsumableArray(arr) {
  return (0,_arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr) || (0,_nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toPrimitive)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");

function _toPrimitive(input, hint) {
  if ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toPropertyKey)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js");


function _toPropertyKey(arg) {
  var key = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arg, "string");
  return (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(key) === "symbol" ? key : String(key);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _unsupportedIterableToArray)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _acmeService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./acmeService */ "./src/acmeService.ts");



var start = /*#__PURE__*/function () {
  var _ref = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee(glue) {
    var service;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            service = new _acmeService__WEBPACK_IMPORTED_MODULE_2__["default"](glue, window.fdc3);
            _context.next = 3;
            return service.initialize();
          case 3:
            window.acmeService = service;
          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return function start(_x) {
    return _ref.apply(this, arguments);
  };
}();

// as a default export, "start" will be exposed as "AcmeService" - see webpack.config.js
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (start);
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=acme-service-0.1.0.js.map