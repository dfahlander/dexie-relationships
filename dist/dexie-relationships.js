/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _promise = __webpack_require__(1);
	
	var _promise2 = _interopRequireDefault(_promise);
	
	var _keys = __webpack_require__(56);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _dexie = __webpack_require__(119);
	
	var _dexie2 = _interopRequireDefault(_dexie);
	
	var _schemaParser = __webpack_require__(128);
	
	var _schemaParser2 = _interopRequireDefault(_schemaParser);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Relationships = function Relationships(db) {
	  /**
	   * Iterate through all items and collect related records
	   *
	   * @param relationships
	   *
	   * @returns {Dexie.Promise}
	   */
	  db.Table.prototype.with = function (relationships) {
	    return this.toCollection().with(relationships);
	  };
	
	  /**
	   * Iterate through all items and collect related records
	   *
	   * @param relationships
	   *
	   * @returns {Dexie.Promise}
	   */
	  db.Collection.prototype.with = function (relationships) {
	    var self = this;
	    var baseTable = this._ctx.table.name;
	    var databaseTables = db._allTables;
	
	    // this holds tables that have foreign keys pointing at the current table
	    var usableForeignTables = {};
	
	    // validate target tables and add them into our usable tables object
	    (0, _keys2.default)(relationships).forEach(function (column) {
	      var table = relationships[column];
	
	      if (!databaseTables.hasOwnProperty(table)) {
	        throw new Error('Relationship table ' + table + ' doesn\'t exist.');
	      }
	
	      if (!databaseTables[table].schema.hasOwnProperty('foreignKeys')) {
	        throw new Error('Relationship table ' + table + ' doesn\'t have foreign keys set.');
	      }
	
	      // remove the foreign keys that don't link to the base table
	      var columns = databaseTables[table].schema.foreignKeys.filter(function (column) {
	        return column.targetTable === baseTable;
	      });
	
	      if (columns.length > 0) {
	        usableForeignTables[table] = {
	          column: column,
	          foreign: columns[0]
	        };
	      }
	    });
	
	    return new _dexie2.default.Promise(function (resolve) {
	      self.toArray().then(function (rows) {
	        var queue = [];
	
	        // loop through all rows and collect all data from the related table
	        rows.forEach(function (row) {
	          var tables = (0, _keys2.default)(usableForeignTables);
	
	          tables.forEach(function (table) {
	            var relatedTable = usableForeignTables[table];
	
	            var promise = databaseTables[table].where(relatedTable.foreign.index).equals(row[relatedTable.foreign.targetIndex]).toArray().then(function (relations) {
	              row[relatedTable.column] = relations;
	            });
	
	            queue.push(promise);
	          });
	        });
	
	        // we need to wait until all data is retrieved
	        // once it's there we can resolve the promise
	        _promise2.default.all(queue).then(function () {
	          resolve(rows);
	        });
	      });
	    });
	  };
	
	  db.Version.prototype._parseStoresSpec = _dexie2.default.override(db.Version.prototype._parseStoresSpec, function (parseStoresSpec) {
	    return function (storesSpec, outDbSchema) {
	      var parser = new _schemaParser2.default(storesSpec);
	
	      var foreignKeys = parser.getForeignKeys();
	      // call the original method
	      var rv = parseStoresSpec.call(this, parser.getCleanedSchema(), outDbSchema);
	
	      // set foreign keys into database table objects
	      // to use later in 'with' method
	      (0, _keys2.default)(outDbSchema).forEach(function (table) {
	        if (foreignKeys.hasOwnProperty(table)) {
	          outDbSchema[table].foreignKeys = foreignKeys[table];
	        }
	      });
	
	      return rv;
	    };
	  });
	};
	
	_dexie2.default.addons.push(Relationships);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(2), __esModule: true };

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(27);
	__webpack_require__(101);
	module.exports = __webpack_require__(12).Promise;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $at = __webpack_require__(5)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(8)(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0; // next index
	  // 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t,
	      index = this._i,
	      point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var toInteger = __webpack_require__(6),
	    defined = __webpack_require__(7);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(defined(that)),
	        i = toInteger(pos),
	        l = s.length,
	        a,
	        b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	// 7.1.4 ToInteger
	var ceil = Math.ceil,
	    floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var LIBRARY = __webpack_require__(9),
	    $export = __webpack_require__(10),
	    redefine = __webpack_require__(43),
	    hide = __webpack_require__(15),
	    has = __webpack_require__(42),
	    Iterators = __webpack_require__(31),
	    $iterCreate = __webpack_require__(96),
	    setToStringTag = __webpack_require__(52),
	    getPrototypeOf = __webpack_require__(97),
	    ITERATOR = __webpack_require__(35)('iterator'),
	    BUGGY = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	,
	    FF_ITERATOR = '@@iterator',
	    KEYS = 'keys',
	    VALUES = 'values';
	
	var returnThis = function returnThis() {
	  return this;
	};
	
	module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function getMethod(kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS:
	        return function keys() {
	          return new Constructor(this, kind);
	        };
	      case VALUES:
	        return function values() {
	          return new Constructor(this, kind);
	        };
	    }return function entries() {
	      return new Constructor(this, kind);
	    };
	  };
	  var TAG = NAME + ' Iterator',
	      DEF_VALUES = DEFAULT == VALUES,
	      VALUES_BUG = false,
	      proto = Base.prototype,
	      $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
	      $default = $native || getMethod(DEFAULT),
	      $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined,
	      $anyNative = NAME == 'Array' ? proto.entries || $native : $native,
	      methods,
	      key,
	      IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() {
	      return $native.call(this);
	    };
	  }
	  // Define iterator
	  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = true;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var global = __webpack_require__(11),
	    core = __webpack_require__(12),
	    ctx = __webpack_require__(13),
	    hide = __webpack_require__(15),
	    PROTOTYPE = 'prototype';
	
	var $export = function $export(type, name, source) {
	  var IS_FORCED = type & $export.F,
	      IS_GLOBAL = type & $export.G,
	      IS_STATIC = type & $export.S,
	      IS_PROTO = type & $export.P,
	      IS_BIND = type & $export.B,
	      IS_WRAP = type & $export.W,
	      exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
	      expProto = exports[PROTOTYPE],
	      target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
	      key,
	      own,
	      out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && key in exports) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? function (C) {
	      var F = function F(a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0:
	              return new C();
	            case 1:
	              return new C(a);
	            case 2:
	              return new C(a, b);
	          }return new C(a, b, c);
	        }return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	      // make static versions for prototype methods
	    }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1; // forced
	$export.G = 2; // global
	$export.S = 4; // static
	$export.P = 8; // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	$export.U = 64; // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	var core = module.exports = { version: '2.4.0' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// optional / simple context binding
	var aFunction = __webpack_require__(14);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1:
	      return function (a) {
	        return fn.call(that, a);
	      };
	    case 2:
	      return function (a, b) {
	        return fn.call(that, a, b);
	      };
	    case 3:
	      return function (a, b, c) {
	        return fn.call(that, a, b, c);
	      };
	  }
	  return function () /* ...args */{
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var dP = __webpack_require__(16),
	    createDesc = __webpack_require__(73);
	module.exports = __webpack_require__(20) ? function (object, key, value) {
	  return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _defineProperty = __webpack_require__(17);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var anObject = __webpack_require__(22),
	    IE8_DOM_DEFINE = __webpack_require__(93),
	    toPrimitive = __webpack_require__(72),
	    dP = _defineProperty2.default;
	
	exports.f = __webpack_require__(20) ? _defineProperty2.default : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) {/* empty */}
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(18), __esModule: true };

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(19);
	var $Object = __webpack_require__(12).Object;
	module.exports = function defineProperty(it, key, desc) {
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $export = __webpack_require__(10);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(20), 'Object', { defineProperty: __webpack_require__(16).f });

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(21)(function () {
	  return Object.defineProperty({}, 'a', { get: function get() {
	      return 7;
	    } }).a != 7;
	});

/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isObject = __webpack_require__(23);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof2 = __webpack_require__(24);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = function (it) {
	  return (typeof it === 'undefined' ? 'undefined' : (0, _typeof3.default)(it)) === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _typeof3 = __webpack_require__(24);
	
	var _typeof4 = _interopRequireDefault2(_typeof3);
	
	function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(25);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(39);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && (0, _typeof4.default)(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : (0, _typeof4.default)(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : (0, _typeof4.default)(obj);
	};
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(26), __esModule: true };

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(4);
	__webpack_require__(27);
	module.exports = __webpack_require__(38).f('iterator');

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(28);
	var global = __webpack_require__(11),
	    hide = __webpack_require__(15),
	    Iterators = __webpack_require__(31),
	    TO_STRING_TAG = __webpack_require__(35)('toStringTag');
	
	for (var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++) {
	  var NAME = collections[i],
	      Collection = global[NAME],
	      proto = Collection && Collection.prototype;
	  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var addToUnscopables = __webpack_require__(29),
	    step = __webpack_require__(30),
	    Iterators = __webpack_require__(31),
	    toIObject = __webpack_require__(32);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(8)(Array, 'Array', function (iterated, kind) {
	  this._t = toIObject(iterated); // target
	  this._i = 0; // next index
	  this._k = kind; // kind
	  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t,
	      kind = this._k,
	      index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return step(1);
	  }
	  if (kind == 'keys') return step(0, index);
	  if (kind == 'values') return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 29 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function () {/* empty */};

/***/ },
/* 30 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (done, value) {
	  return { value: value, done: !!done };
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = {};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(33),
	    defined = __webpack_require__(7);
	module.exports = function (it) {
	  return IObject(defined(it));
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(34);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	"use strict";
	
	var toString = {}.toString;
	
	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var store = __webpack_require__(36)('wks'),
	    uid = __webpack_require__(37),
	    _Symbol = __webpack_require__(11).Symbol,
	    USE_SYMBOL = typeof _Symbol == 'function';
	
	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var global = __webpack_require__(11),
	    SHARED = '__core-js_shared__',
	    store = global[SHARED] || (global[SHARED] = {});
	module.exports = function (key) {
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';
	
	var id = 0,
	    px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.f = __webpack_require__(35);

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(40), __esModule: true };

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(41);
	__webpack_require__(3);
	__webpack_require__(94);
	__webpack_require__(95);
	module.exports = __webpack_require__(12).Symbol;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	
	var _typeof2 = __webpack_require__(24);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var global = __webpack_require__(11),
	    has = __webpack_require__(42),
	    DESCRIPTORS = __webpack_require__(20),
	    $export = __webpack_require__(10),
	    redefine = __webpack_require__(43),
	    META = __webpack_require__(44).KEY,
	    $fails = __webpack_require__(21),
	    shared = __webpack_require__(36),
	    setToStringTag = __webpack_require__(52),
	    uid = __webpack_require__(37),
	    wks = __webpack_require__(35),
	    wksExt = __webpack_require__(38),
	    wksDefine = __webpack_require__(53),
	    keyOf = __webpack_require__(54),
	    enumKeys = __webpack_require__(66),
	    isArray = __webpack_require__(71),
	    anObject = __webpack_require__(22),
	    toIObject = __webpack_require__(32),
	    toPrimitive = __webpack_require__(72),
	    createDesc = __webpack_require__(73),
	    _create = __webpack_require__(74),
	    gOPNExt = __webpack_require__(84),
	    $GOPD = __webpack_require__(89),
	    $DP = __webpack_require__(16),
	    $keys = __webpack_require__(55),
	    gOPD = $GOPD.f,
	    dP = $DP.f,
	    gOPN = gOPNExt.f,
	    $Symbol = global.Symbol,
	    $JSON = global.JSON,
	    _stringify = $JSON && $JSON.stringify,
	    PROTOTYPE = 'prototype',
	    HIDDEN = wks('_hidden'),
	    TO_PRIMITIVE = wks('toPrimitive'),
	    isEnum = {}.propertyIsEnumerable,
	    SymbolRegistry = shared('symbol-registry'),
	    AllSymbols = shared('symbols'),
	    OPSymbols = shared('op-symbols'),
	    ObjectProto = Object[PROTOTYPE],
	    USE_NATIVE = typeof $Symbol == 'function',
	    QObject = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function () {
	  return _create(dP({}, 'a', {
	    get: function get() {
	      return dP(this, 'a', { value: 7 }).a;
	    }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD(ObjectProto, key);
	  if (protoDesc) delete ObjectProto[key];
	  dP(it, key, D);
	  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function wrap(tag) {
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && (0, _typeof3.default)($Symbol.iterator) == 'symbol' ? function (it) {
	  return (typeof it === 'undefined' ? 'undefined' : (0, _typeof3.default)(it)) == 'symbol';
	} : function (it) {
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D) {
	  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if (has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _create(D, { enumerable: createDesc(0, false) });
	    }return setSymbolDesc(it, key, D);
	  }return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P)),
	      i = 0,
	      l = keys.length,
	      key;
	  while (l > i) {
	    $defineProperty(it, key = keys[i++], P[key]);
	  }return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = toIObject(it);
	  key = toPrimitive(key, true);
	  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
	  var D = gOPD(it, key);
	  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN(toIObject(it)),
	      result = [],
	      i = 0,
	      key;
	  while (names.length > i) {
	    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  }return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectProto,
	      names = gOPN(IS_OP ? OPSymbols : toIObject(it)),
	      result = [],
	      i = 0,
	      key;
	  while (names.length > i) {
	    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
	  }return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if (!USE_NATIVE) {
	  $Symbol = function _Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function $set(value) {
	      if (this === ObjectProto) $set.call(OPSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f = $defineProperty;
	  __webpack_require__(88).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(70).f = $propertyIsEnumerable;
	  __webpack_require__(67).f = $getOwnPropertySymbols;
	
	  if (DESCRIPTORS && !__webpack_require__(9)) {
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function (name) {
	    return wrap(wks(name));
	  };
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });
	
	for (var symbols =
	// 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), i = 0; symbols.length > i;) {
	  wks(symbols[i++]);
	}for (var symbols = $keys(wks.store), i = 0; symbols.length > i;) {
	  wksDefine(symbols[i++]);
	}$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function _for(key) {
	    return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key) {
	    if (isSymbol(key)) return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function useSetter() {
	    setter = true;
	  },
	  useSimple: function useSimple() {
	    setter = false;
	  }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it) {
	    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	    var args = [it],
	        i = 1,
	        replacer,
	        $replacer;
	    while (arguments.length > i) {
	      args.push(arguments[i++]);
	    }replacer = args[1];
	    if (typeof replacer == 'function') $replacer = replacer;
	    if ($replacer || !isArray(replacer)) replacer = function replacer(key, value) {
	      if ($replacer) value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(15)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 42 */
/***/ function(module, exports) {

	"use strict";
	
	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(15);

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof2 = __webpack_require__(24);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	var _preventExtensions = __webpack_require__(45);
	
	var _preventExtensions2 = _interopRequireDefault(_preventExtensions);
	
	var _isExtensible = __webpack_require__(49);
	
	var _isExtensible2 = _interopRequireDefault(_isExtensible);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var META = __webpack_require__(37)('meta'),
	    isObject = __webpack_require__(23),
	    has = __webpack_require__(42),
	    setDesc = __webpack_require__(16).f,
	    id = 0;
	var isExtensible = _isExtensible2.default || function () {
	  return true;
	};
	var FREEZE = !__webpack_require__(21)(function () {
	  return isExtensible((0, _preventExtensions2.default)({}));
	});
	var setMeta = function setMeta(it) {
	  setDesc(it, META, { value: {
	      i: 'O' + ++id, // object ID
	      w: {} // weak collections IDs
	    } });
	};
	var fastKey = function fastKey(it, create) {
	  // return primitive with prefix
	  if (!isObject(it)) return (typeof it === 'undefined' ? 'undefined' : (0, _typeof3.default)(it)) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	    // return object ID
	  }return it[META].i;
	};
	var getWeak = function getWeak(it, create) {
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	    // return hash weak collections IDs
	  }return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function onFreeze(it) {
	  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY: META,
	  NEED: false,
	  fastKey: fastKey,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(46), __esModule: true };

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(47);
	module.exports = __webpack_require__(12).Object.preventExtensions;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 19.1.2.15 Object.preventExtensions(O)
	var isObject = __webpack_require__(23),
	    meta = __webpack_require__(44).onFreeze;
	
	__webpack_require__(48)('preventExtensions', function ($preventExtensions) {
	  return function preventExtensions(it) {
	    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
	  };
	});

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(10),
	    core = __webpack_require__(12),
	    fails = __webpack_require__(21);
	module.exports = function (KEY, exec) {
	  var fn = (core.Object || {})[KEY] || Object[KEY],
	      exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function () {
	    fn(1);
	  }), 'Object', exp);
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(50), __esModule: true };

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(51);
	module.exports = __webpack_require__(12).Object.isExtensible;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 19.1.2.11 Object.isExtensible(O)
	var isObject = __webpack_require__(23);
	
	__webpack_require__(48)('isExtensible', function ($isExtensible) {
	  return function isExtensible(it) {
	    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
	  };
	});

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var def = __webpack_require__(16).f,
	    has = __webpack_require__(42),
	    TAG = __webpack_require__(35)('toStringTag');
	
	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var global = __webpack_require__(11),
	    core = __webpack_require__(12),
	    LIBRARY = __webpack_require__(9),
	    wksExt = __webpack_require__(38),
	    defineProperty = __webpack_require__(16).f;
	module.exports = function (name) {
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getKeys = __webpack_require__(55),
	    toIObject = __webpack_require__(32);
	module.exports = function (object, el) {
	  var O = toIObject(object),
	      keys = getKeys(O),
	      length = keys.length,
	      index = 0,
	      key;
	  while (length > index) {
	    if (O[key = keys[index++]] === el) return key;
	  }
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _keys = __webpack_require__(56);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = __webpack_require__(60),
	    enumBugKeys = __webpack_require__(65);
	
	module.exports = _keys2.default || function keys(O) {
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(57), __esModule: true };

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(58);
	module.exports = __webpack_require__(12).Object.keys;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(59),
	    $keys = __webpack_require__(55);
	
	__webpack_require__(48)('keys', function () {
	  return function keys(it) {
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(7);
	module.exports = function (it) {
	  return Object(defined(it));
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var has = __webpack_require__(42),
	    toIObject = __webpack_require__(32),
	    arrayIndexOf = __webpack_require__(61)(false),
	    IE_PROTO = __webpack_require__(64)('IE_PROTO');
	
	module.exports = function (object, names) {
	  var O = toIObject(object),
	      i = 0,
	      result = [],
	      key;
	  for (key in O) {
	    if (key != IE_PROTO) has(O, key) && result.push(key);
	  } // Don't enum bug & hidden keys
	  while (names.length > i) {
	    if (has(O, key = names[i++])) {
	      ~arrayIndexOf(result, key) || result.push(key);
	    }
	  }return result;
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(32),
	    toLength = __webpack_require__(62),
	    toIndex = __webpack_require__(63);
	module.exports = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIObject($this),
	        length = toLength(O.length),
	        index = toIndex(fromIndex, length),
	        value;
	    // Array#includes uses SameValueZero equality algorithm
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      if (value != value) return true;
	      // Array#toIndex ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if (IS_INCLUDES || index in O) {
	        if (O[index] === el) return IS_INCLUDES || index || 0;
	      }
	    }return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 7.1.15 ToLength
	var toInteger = __webpack_require__(6),
	    min = Math.min;
	module.exports = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var toInteger = __webpack_require__(6),
	    max = Math.max,
	    min = Math.min;
	module.exports = function (index, length) {
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var shared = __webpack_require__(36)('keys'),
	    uid = __webpack_require__(37);
	module.exports = function (key) {
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 65 */
/***/ function(module, exports) {

	'use strict';
	
	// IE 8- don't enum bug keys
	module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(55),
	    gOPS = __webpack_require__(67),
	    pIE = __webpack_require__(70);
	module.exports = function (it) {
	  var result = getKeys(it),
	      getSymbols = gOPS.f;
	  if (getSymbols) {
	    var symbols = getSymbols(it),
	        isEnum = pIE.f,
	        i = 0,
	        key;
	    while (symbols.length > i) {
	      if (isEnum.call(it, key = symbols[i++])) result.push(key);
	    }
	  }return result;
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _getOwnPropertySymbols = __webpack_require__(68);
	
	var _getOwnPropertySymbols2 = _interopRequireDefault(_getOwnPropertySymbols);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.f = _getOwnPropertySymbols2.default;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(69), __esModule: true };

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(41);
	module.exports = __webpack_require__(12).Object.getOwnPropertySymbols;

/***/ },
/* 70 */
/***/ function(module, exports) {

	"use strict";
	
	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(34);
	module.exports = Array.isArray || function isArray(arg) {
	  return cof(arg) == 'Array';
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(23);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 73 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _create = __webpack_require__(75);
	
	var _create2 = _interopRequireDefault(_create);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject = __webpack_require__(22),
	    dPs = __webpack_require__(78),
	    enumBugKeys = __webpack_require__(65),
	    IE_PROTO = __webpack_require__(64)('IE_PROTO'),
	    Empty = function Empty() {/* empty */},
	    PROTOTYPE = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var _createDict = function createDict() {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(82)('iframe'),
	      i = enumBugKeys.length,
	      lt = '<',
	      gt = '>',
	      iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(83).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  _createDict = iframeDocument.F;
	  while (i--) {
	    delete _createDict[PROTOTYPE][enumBugKeys[i]];
	  }return _createDict();
	};
	
	module.exports = _create2.default || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = _createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(76), __esModule: true };

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(77);
	var $Object = __webpack_require__(12).Object;
	module.exports = function create(P, D) {
	  return $Object.create(P, D);
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $export = __webpack_require__(10);
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', { create: __webpack_require__(74) });

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _defineProperties = __webpack_require__(79);
	
	var _defineProperties2 = _interopRequireDefault(_defineProperties);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var dP = __webpack_require__(16),
	    anObject = __webpack_require__(22),
	    getKeys = __webpack_require__(55);
	
	module.exports = __webpack_require__(20) ? _defineProperties2.default : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = getKeys(Properties),
	      length = keys.length,
	      i = 0,
	      P;
	  while (length > i) {
	    dP.f(O, P = keys[i++], Properties[P]);
	  }return O;
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(80), __esModule: true };

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(81);
	var $Object = __webpack_require__(12).Object;
	module.exports = function defineProperties(T, D) {
	  return $Object.defineProperties(T, D);
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $export = __webpack_require__(10);
	// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
	$export($export.S + $export.F * !__webpack_require__(20), 'Object', { defineProperties: __webpack_require__(78) });

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isObject = __webpack_require__(23),
	    document = __webpack_require__(11).document
	// in old IE typeof document.createElement is 'object'
	,
	    is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(11).document && document.documentElement;

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getOwnPropertyNames = __webpack_require__(85);
	
	var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);
	
	var _typeof2 = __webpack_require__(24);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(32),
	    gOPN = __webpack_require__(88).f,
	    toString = {}.toString;
	
	var windowNames = (typeof window === 'undefined' ? 'undefined' : (0, _typeof3.default)(window)) == 'object' && window && _getOwnPropertyNames2.default ? (0, _getOwnPropertyNames2.default)(window) : [];
	
	var getWindowNames = function getWindowNames(it) {
	  try {
	    return gOPN(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it) {
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(86), __esModule: true };

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(87);
	var $Object = __webpack_require__(12).Object;
	module.exports = function getOwnPropertyNames(it) {
	  return $Object.getOwnPropertyNames(it);
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 19.1.2.7 Object.getOwnPropertyNames(O)
	__webpack_require__(48)('getOwnPropertyNames', function () {
	  return __webpack_require__(84).f;
	});

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getOwnPropertyNames = __webpack_require__(85);
	
	var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys = __webpack_require__(60),
	    hiddenKeys = __webpack_require__(65).concat('length', 'prototype');
	
	exports.f = _getOwnPropertyNames2.default || function getOwnPropertyNames(O) {
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getOwnPropertyDescriptor = __webpack_require__(90);
	
	var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var pIE = __webpack_require__(70),
	    createDesc = __webpack_require__(73),
	    toIObject = __webpack_require__(32),
	    toPrimitive = __webpack_require__(72),
	    has = __webpack_require__(42),
	    IE8_DOM_DEFINE = __webpack_require__(93),
	    gOPD = _getOwnPropertyDescriptor2.default;
	
	exports.f = __webpack_require__(20) ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if (IE8_DOM_DEFINE) try {
	    return gOPD(O, P);
	  } catch (e) {/* empty */}
	  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(91), __esModule: true };

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(92);
	var $Object = __webpack_require__(12).Object;
	module.exports = function getOwnPropertyDescriptor(it, key) {
	  return $Object.getOwnPropertyDescriptor(it, key);
	};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject = __webpack_require__(32),
	    $getOwnPropertyDescriptor = __webpack_require__(89).f;
	
	__webpack_require__(48)('getOwnPropertyDescriptor', function () {
	  return function getOwnPropertyDescriptor(it, key) {
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = !__webpack_require__(20) && !__webpack_require__(21)(function () {
	  return Object.defineProperty(__webpack_require__(82)('div'), 'a', { get: function get() {
	      return 7;
	    } }).a != 7;
	});

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(53)('asyncIterator');

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(53)('observable');

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var create = __webpack_require__(74),
	    descriptor = __webpack_require__(73),
	    setToStringTag = __webpack_require__(52),
	    IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(15)(IteratorPrototype, __webpack_require__(35)('iterator'), function () {
	  return this;
	});
	
	module.exports = function (Constructor, NAME, next) {
	  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getPrototypeOf = __webpack_require__(98);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has = __webpack_require__(42),
	    toObject = __webpack_require__(59),
	    IE_PROTO = __webpack_require__(64)('IE_PROTO'),
	    ObjectProto = Object.prototype;
	
	module.exports = _getPrototypeOf2.default || function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  }return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(99), __esModule: true };

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(100);
	module.exports = __webpack_require__(12).Object.getPrototypeOf;

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject = __webpack_require__(59),
	    $getPrototypeOf = __webpack_require__(97);
	
	__webpack_require__(48)('getPrototypeOf', function () {
	  return function getPrototypeOf(it) {
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var LIBRARY = __webpack_require__(9),
	    global = __webpack_require__(11),
	    ctx = __webpack_require__(13),
	    classof = __webpack_require__(102),
	    $export = __webpack_require__(10),
	    isObject = __webpack_require__(23),
	    aFunction = __webpack_require__(14),
	    anInstance = __webpack_require__(103),
	    forOf = __webpack_require__(104),
	    speciesConstructor = __webpack_require__(108),
	    task = __webpack_require__(109).set,
	    microtask = __webpack_require__(111)(),
	    PROMISE = 'Promise',
	    TypeError = global.TypeError,
	    process = global.process,
	    $Promise = global[PROMISE],
	    process = global.process,
	    isNode = classof(process) == 'process',
	    empty = function empty() {/* empty */},
	    Internal,
	    GenericPromiseCapability,
	    Wrapper;
	
	var USE_NATIVE = !!function () {
	  try {
	    // correct subclassing with @@species support
	    var promise = $Promise.resolve(1),
	        FakePromise = (promise.constructor = {})[__webpack_require__(35)('species')] = function (exec) {
	      exec(empty, empty);
	    };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
	  } catch (e) {/* empty */}
	}();
	
	// helpers
	var sameConstructor = function sameConstructor(a, b) {
	  // with library wrapper special case
	  return a === b || a === $Promise && b === Wrapper;
	};
	var isThenable = function isThenable(it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var newPromiseCapability = function newPromiseCapability(C) {
	  return sameConstructor($Promise, C) ? new PromiseCapability(C) : new GenericPromiseCapability(C);
	};
	var PromiseCapability = GenericPromiseCapability = function GenericPromiseCapability(C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject = aFunction(reject);
	};
	var perform = function perform(exec) {
	  try {
	    exec();
	  } catch (e) {
	    return { error: e };
	  }
	};
	var notify = function notify(promise, isReject) {
	  if (promise._n) return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function () {
	    var value = promise._v,
	        ok = promise._s == 1,
	        i = 0;
	    var run = function run(reaction) {
	      var handler = ok ? reaction.ok : reaction.fail,
	          resolve = reaction.resolve,
	          reject = reaction.reject,
	          domain = reaction.domain,
	          result,
	          then;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (promise._h == 2) onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if (handler === true) result = value;else {
	            if (domain) domain.enter();
	            result = handler(value);
	            if (domain) domain.exit();
	          }
	          if (result === reaction.promise) {
	            reject(TypeError('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (e) {
	        reject(e);
	      }
	    };
	    while (chain.length > i) {
	      run(chain[i++]);
	    } // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if (isReject && !promise._h) onUnhandled(promise);
	  });
	};
	var onUnhandled = function onUnhandled(promise) {
	  task.call(global, function () {
	    var value = promise._v,
	        abrupt,
	        handler,
	        console;
	    if (isUnhandled(promise)) {
	      abrupt = perform(function () {
	        if (isNode) {
	          process.emit('unhandledRejection', value, promise);
	        } else if (handler = global.onunhandledrejection) {
	          handler({ promise: promise, reason: value });
	        } else if ((console = global.console) && console.error) {
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
	    }promise._a = undefined;
	    if (abrupt) throw abrupt.error;
	  });
	};
	var isUnhandled = function isUnhandled(promise) {
	  if (promise._h == 1) return false;
	  var chain = promise._a || promise._c,
	      i = 0,
	      reaction;
	  while (chain.length > i) {
	    reaction = chain[i++];
	    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
	  }return true;
	};
	var onHandleUnhandled = function onHandleUnhandled(promise) {
	  task.call(global, function () {
	    var handler;
	    if (isNode) {
	      process.emit('rejectionHandled', promise);
	    } else if (handler = global.onrejectionhandled) {
	      handler({ promise: promise, reason: promise._v });
	    }
	  });
	};
	var $reject = function $reject(value) {
	  var promise = this;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if (!promise._a) promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function $resolve(value) {
	  var promise = this,
	      then;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if (promise === value) throw TypeError("Promise can't be resolved itself");
	    if (then = isThenable(value)) {
	      microtask(function () {
	        var wrapper = { _w: promise, _d: false }; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch (e) {
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch (e) {
	    $reject.call({ _w: promise, _d: false }, e); // wrap
	  }
	};
	
	// constructor polyfill
	if (!USE_NATIVE) {
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor) {
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch (err) {
	      $reject.call(this, err);
	    }
	  };
	  Internal = function Promise(executor) {
	    this._c = []; // <- awaiting reactions
	    this._a = undefined; // <- checked in isUnhandled reactions
	    this._s = 0; // <- state
	    this._d = false; // <- done
	    this._v = undefined; // <- value
	    this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false; // <- notify
	  };
	  Internal.prototype = __webpack_require__(112)($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected) {
	      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode ? process.domain : undefined;
	      this._c.push(reaction);
	      if (this._a) this._a.push(reaction);
	      if (this._s) notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function _catch(onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  PromiseCapability = function PromiseCapability() {
	    var promise = new Internal();
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject = ctx($reject, promise, 1);
	  };
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
	__webpack_require__(52)($Promise, PROMISE);
	__webpack_require__(113)(PROMISE);
	Wrapper = __webpack_require__(12)[PROMISE];
	
	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this),
	        $$reject = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x) {
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if (x instanceof $Promise && sameConstructor(x.constructor, this)) return x;
	    var capability = newPromiseCapability(this),
	        $$resolve = capability.resolve;
	    $$resolve(x);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(114)(function (iter) {
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable) {
	    var C = this,
	        capability = newPromiseCapability(C),
	        resolve = capability.resolve,
	        reject = capability.reject;
	    var abrupt = perform(function () {
	      var values = [],
	          index = 0,
	          remaining = 1;
	      forOf(iterable, false, function (promise) {
	        var $index = index++,
	            alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (abrupt) reject(abrupt.error);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable) {
	    var C = this,
	        capability = newPromiseCapability(C),
	        reject = capability.reject;
	    var abrupt = perform(function () {
	      forOf(iterable, false, function (promise) {
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if (abrupt) reject(abrupt.error);
	    return capability.promise;
	  }
	});

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(34),
	    TAG = __webpack_require__(35)('toStringTag')
	// ES3 wrong here
	,
	    ARG = cof(function () {
	  return arguments;
	}()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function tryGet(it, key) {
	  try {
	    return it[key];
	  } catch (e) {/* empty */}
	};
	
	module.exports = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	  // @@toStringTag case
	  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	  // builtinTag case
	  : ARG ? cof(O)
	  // ES3 arguments fallback
	  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 103 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (it, Constructor, name, forbiddenField) {
	  if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
	    throw TypeError(name + ': incorrect invocation!');
	  }return it;
	};

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ctx = __webpack_require__(13),
	    call = __webpack_require__(105),
	    isArrayIter = __webpack_require__(106),
	    anObject = __webpack_require__(22),
	    toLength = __webpack_require__(62),
	    getIterFn = __webpack_require__(107),
	    BREAK = {},
	    RETURN = {};
	var _exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
	  var iterFn = ITERATOR ? function () {
	    return iterable;
	  } : getIterFn(iterable),
	      f = ctx(fn, that, entries ? 2 : 1),
	      index = 0,
	      length,
	      step,
	      iterator,
	      result;
	  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if (result === BREAK || result === RETURN) return result;
	  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
	    result = call(iterator, f, step.value, entries);
	    if (result === BREAK || result === RETURN) return result;
	  }
	};
	_exports.BREAK = BREAK;
	_exports.RETURN = RETURN;

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(22);
	module.exports = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	    // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// check on default Array iterator
	var Iterators = __webpack_require__(31),
	    ITERATOR = __webpack_require__(35)('iterator'),
	    ArrayProto = Array.prototype;
	
	module.exports = function (it) {
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var classof = __webpack_require__(102),
	    ITERATOR = __webpack_require__(35)('iterator'),
	    Iterators = __webpack_require__(31);
	module.exports = __webpack_require__(12).getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
	};

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject = __webpack_require__(22),
	    aFunction = __webpack_require__(14),
	    SPECIES = __webpack_require__(35)('species');
	module.exports = function (O, D) {
	  var C = anObject(O).constructor,
	      S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ctx = __webpack_require__(13),
	    invoke = __webpack_require__(110),
	    html = __webpack_require__(83),
	    cel = __webpack_require__(82),
	    global = __webpack_require__(11),
	    process = global.process,
	    setTask = global.setImmediate,
	    clearTask = global.clearImmediate,
	    MessageChannel = global.MessageChannel,
	    counter = 0,
	    queue = {},
	    ONREADYSTATECHANGE = 'onreadystatechange',
	    defer,
	    channel,
	    port;
	var run = function run() {
	  var id = +this;
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function listener(event) {
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!setTask || !clearTask) {
	  setTask = function setImmediate(fn) {
	    var args = [],
	        i = 1;
	    while (arguments.length > i) {
	      args.push(arguments[i++]);
	    }queue[++counter] = function () {
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (__webpack_require__(34)(process) == 'process') {
	    defer = function defer(id) {
	      process.nextTick(ctx(run, id, 1));
	    };
	    // Browsers with MessageChannel, includes WebWorkers
	  } else if (MessageChannel) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	    // Browsers with postMessage, skip WebWorkers
	    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
	    defer = function defer(id) {
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listener, false);
	    // IE8-
	  } else if (ONREADYSTATECHANGE in cel('script')) {
	    defer = function defer(id) {
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	    // Rest old browsers
	  } else {
	    defer = function defer(id) {
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set: setTask,
	  clear: clearTask
	};

/***/ },
/* 110 */
/***/ function(module, exports) {

	"use strict";
	
	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function (fn, args, that) {
	                  var un = that === undefined;
	                  switch (args.length) {
	                                    case 0:
	                                                      return un ? fn() : fn.call(that);
	                                    case 1:
	                                                      return un ? fn(args[0]) : fn.call(that, args[0]);
	                                    case 2:
	                                                      return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
	                                    case 3:
	                                                      return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
	                                    case 4:
	                                                      return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
	                  }return fn.apply(that, args);
	};

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var global = __webpack_require__(11),
	    macrotask = __webpack_require__(109).set,
	    Observer = global.MutationObserver || global.WebKitMutationObserver,
	    process = global.process,
	    Promise = global.Promise,
	    isNode = __webpack_require__(34)(process) == 'process';
	
	module.exports = function () {
	  var head, last, notify;
	
	  var flush = function flush() {
	    var parent, fn;
	    if (isNode && (parent = process.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (e) {
	        if (head) notify();else last = undefined;
	        throw e;
	      }
	    }last = undefined;
	    if (parent) parent.enter();
	  };
	
	  // Node.js
	  if (isNode) {
	    notify = function notify() {
	      process.nextTick(flush);
	    };
	    // browsers with MutationObserver
	  } else if (Observer) {
	    var toggle = true,
	        node = document.createTextNode('');
	    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
	    notify = function notify() {
	      node.data = toggle = !toggle;
	    };
	    // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise && Promise.resolve) {
	    var promise = Promise.resolve();
	    notify = function notify() {
	      promise.then(flush);
	    };
	    // for other environments - macrotask based on:
	    // - setImmediate
	    // - MessageChannel
	    // - window.postMessag
	    // - onreadystatechange
	    // - setTimeout
	  } else {
	    notify = function notify() {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global, flush);
	    };
	  }
	
	  return function (fn) {
	    var task = { fn: fn, next: undefined };
	    if (last) last.next = task;
	    if (!head) {
	      head = task;
	      notify();
	    }last = task;
	  };
	};

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var hide = __webpack_require__(15);
	module.exports = function (target, src, safe) {
	  for (var key in src) {
	    if (safe && target[key]) target[key] = src[key];else hide(target, key, src[key]);
	  }return target;
	};

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var global = __webpack_require__(11),
	    core = __webpack_require__(12),
	    dP = __webpack_require__(16),
	    DESCRIPTORS = __webpack_require__(20),
	    SPECIES = __webpack_require__(35)('species');
	
	module.exports = function (KEY) {
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
	  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
	    configurable: true,
	    get: function get() {
	      return this;
	    }
	  });
	};

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _from = __webpack_require__(115);
	
	var _from2 = _interopRequireDefault(_from);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var ITERATOR = __webpack_require__(35)('iterator'),
	    SAFE_CLOSING = false;
	
	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function () {
	    SAFE_CLOSING = true;
	  };
	  (0, _from2.default)(riter, function () {
	    throw 2;
	  });
	} catch (e) {/* empty */}
	
	module.exports = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7],
	        iter = arr[ITERATOR]();
	    iter.next = function () {
	      return { done: safe = true };
	    };
	    arr[ITERATOR] = function () {
	      return iter;
	    };
	    exec(arr);
	  } catch (e) {/* empty */}
	  return safe;
	};

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(116), __esModule: true };

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(4);
	__webpack_require__(117);
	module.exports = __webpack_require__(12).Array.from;

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _from = __webpack_require__(115);
	
	var _from2 = _interopRequireDefault(_from);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var ctx = __webpack_require__(13),
	    $export = __webpack_require__(10),
	    toObject = __webpack_require__(59),
	    call = __webpack_require__(105),
	    isArrayIter = __webpack_require__(106),
	    toLength = __webpack_require__(62),
	    createProperty = __webpack_require__(118),
	    getIterFn = __webpack_require__(107);
	
	$export($export.S + $export.F * !__webpack_require__(114)(function (iter) {
	  (0, _from2.default)(iter);
	}), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike /*, mapfn = undefined, thisArg = undefined*/) {
	    var O = toObject(arrayLike),
	        C = typeof this == 'function' ? this : Array,
	        aLen = arguments.length,
	        mapfn = aLen > 1 ? arguments[1] : undefined,
	        mapping = mapfn !== undefined,
	        index = 0,
	        iterFn = getIterFn(O),
	        length,
	        result,
	        step,
	        iterator;
	    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
	      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for (result = new C(length); length > index; index++) {
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $defineProperty = __webpack_require__(16),
	    createDesc = __webpack_require__(73);
	
	module.exports = function (object, index, value) {
	  if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
	};

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {'use strict';var _stringify=__webpack_require__(120);var _stringify2=_interopRequireDefault(_stringify);var _iterator=__webpack_require__(25);var _iterator2=_interopRequireDefault(_iterator);var _symbol=__webpack_require__(39);var _symbol2=_interopRequireDefault(_symbol);var _isFrozen=__webpack_require__(122);var _isFrozen2=_interopRequireDefault(_isFrozen);var _setImmediate2=__webpack_require__(125);var _setImmediate3=_interopRequireDefault(_setImmediate2);var _getOwnPropertyDescriptor=__webpack_require__(90);var _getOwnPropertyDescriptor2=_interopRequireDefault(_getOwnPropertyDescriptor);var _create=__webpack_require__(75);var _create2=_interopRequireDefault(_create);var _defineProperty=__webpack_require__(17);var _defineProperty2=_interopRequireDefault(_defineProperty);var _getPrototypeOf=__webpack_require__(98);var _getPrototypeOf2=_interopRequireDefault(_getPrototypeOf);var _keys=__webpack_require__(56);var _keys2=_interopRequireDefault(_keys);var _typeof2=__webpack_require__(24);var _typeof3=_interopRequireDefault(_typeof2);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}(function(global,factory){( false?'undefined':(0,_typeof3.default)(exports))==='object'&&typeof module!=='undefined'?module.exports=factory(): true?!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):global.Dexie=factory();})(undefined,function(){'use strict';/*
	* Dexie.js - a minimalistic wrapper for IndexedDB
	* ===============================================
	*
	* By David Fahlander, david.fahlander@gmail.com
	*
	* Version 1.5.0, Thu Oct 13 2016
	* www.dexie.com
	* Apache License Version 2.0, January 2004, http://www.apache.org/licenses/
	*/var keys=_keys2.default;var isArray=Array.isArray;var _global=typeof self!=='undefined'?self:typeof window!=='undefined'?window:global;function extend(obj,extension){if((typeof extension==='undefined'?'undefined':(0,_typeof3.default)(extension))!=='object')return obj;keys(extension).forEach(function(key){obj[key]=extension[key];});return obj;}var getProto=_getPrototypeOf2.default;var _hasOwn={}.hasOwnProperty;function hasOwn(obj,prop){return _hasOwn.call(obj,prop);}function props(proto,extension){if(typeof extension==='function')extension=extension(getProto(proto));keys(extension).forEach(function(key){setProp(proto,key,extension[key]);});}function setProp(obj,prop,functionOrGetSet,options){(0,_defineProperty2.default)(obj,prop,extend(functionOrGetSet&&hasOwn(functionOrGetSet,"get")&&typeof functionOrGetSet.get==='function'?{get:functionOrGetSet.get,set:functionOrGetSet.set,configurable:true}:{value:functionOrGetSet,configurable:true,writable:true},options));}function derive(Child){return{from:function from(Parent){Child.prototype=(0,_create2.default)(Parent.prototype);setProp(Child.prototype,"constructor",Child);return{extend:props.bind(null,Child.prototype)};}};}var getOwnPropertyDescriptor=_getOwnPropertyDescriptor2.default;function getPropertyDescriptor(obj,prop){var pd=getOwnPropertyDescriptor(obj,prop),proto;return pd||(proto=getProto(obj))&&getPropertyDescriptor(proto,prop);}var _slice=[].slice;function slice(args,start,end){return _slice.call(args,start,end);}function override(origFunc,overridedFactory){return overridedFactory(origFunc);}function doFakeAutoComplete(fn){var to=setTimeout(fn,1000);clearTimeout(to);}function assert(b){if(!b)throw new Error("Assertion Failed");}function asap(fn){if(_global.setImmediate)(0,_setImmediate3.default)(fn);else setTimeout(fn,0);}/** Generate an object (hash map) based on given array.
	 * @param extractor Function taking an array item and its index and returning an array of 2 items ([key, value]) to
	 *        instert on the resulting object for each item in the array. If this function returns a falsy value, the
	 *        current item wont affect the resulting object.
	 */function arrayToObject(array,extractor){return array.reduce(function(result,item,i){var nameAndValue=extractor(item,i);if(nameAndValue)result[nameAndValue[0]]=nameAndValue[1];return result;},{});}function trycatcher(fn,reject){return function(){try{fn.apply(this,arguments);}catch(e){reject(e);}};}function tryCatch(fn,onerror,args){try{fn.apply(null,args);}catch(ex){onerror&&onerror(ex);}}function getByKeyPath(obj,keyPath){// http://www.w3.org/TR/IndexedDB/#steps-for-extracting-a-key-from-a-value-using-a-key-path
	if(hasOwn(obj,keyPath))return obj[keyPath];// This line is moved from last to first for optimization purpose.
	if(!keyPath)return obj;if(typeof keyPath!=='string'){var rv=[];for(var i=0,l=keyPath.length;i<l;++i){var val=getByKeyPath(obj,keyPath[i]);rv.push(val);}return rv;}var period=keyPath.indexOf('.');if(period!==-1){var innerObj=obj[keyPath.substr(0,period)];return innerObj===undefined?undefined:getByKeyPath(innerObj,keyPath.substr(period+1));}return undefined;}function setByKeyPath(obj,keyPath,value){if(!obj||keyPath===undefined)return;if('isFrozen'in Object&&(0,_isFrozen2.default)(obj))return;if(typeof keyPath!=='string'&&'length'in keyPath){assert(typeof value!=='string'&&'length'in value);for(var i=0,l=keyPath.length;i<l;++i){setByKeyPath(obj,keyPath[i],value[i]);}}else{var period=keyPath.indexOf('.');if(period!==-1){var currentKeyPath=keyPath.substr(0,period);var remainingKeyPath=keyPath.substr(period+1);if(remainingKeyPath===""){if(value===undefined)delete obj[currentKeyPath];else obj[currentKeyPath]=value;}else{var innerObj=obj[currentKeyPath];if(!innerObj)innerObj=obj[currentKeyPath]={};setByKeyPath(innerObj,remainingKeyPath,value);}}else{if(value===undefined)delete obj[keyPath];else obj[keyPath]=value;}}}function delByKeyPath(obj,keyPath){if(typeof keyPath==='string')setByKeyPath(obj,keyPath,undefined);else if('length'in keyPath)[].map.call(keyPath,function(kp){setByKeyPath(obj,kp,undefined);});}function shallowClone(obj){var rv={};for(var m in obj){if(hasOwn(obj,m))rv[m]=obj[m];}return rv;}function deepClone(any){if(!any||(typeof any==='undefined'?'undefined':(0,_typeof3.default)(any))!=='object')return any;var rv;if(isArray(any)){rv=[];for(var i=0,l=any.length;i<l;++i){rv.push(deepClone(any[i]));}}else if(any instanceof Date){rv=new Date();rv.setTime(any.getTime());}else{rv=any.constructor?(0,_create2.default)(any.constructor.prototype):{};for(var prop in any){if(hasOwn(any,prop)){rv[prop]=deepClone(any[prop]);}}}return rv;}function getObjectDiff(a,b,rv,prfx){// Compares objects a and b and produces a diff object.
	rv=rv||{};prfx=prfx||'';keys(a).forEach(function(prop){if(!hasOwn(b,prop))rv[prfx+prop]=undefined;// Property removed
	else{var ap=a[prop],bp=b[prop];if((typeof ap==='undefined'?'undefined':(0,_typeof3.default)(ap))==='object'&&(typeof bp==='undefined'?'undefined':(0,_typeof3.default)(bp))==='object'&&ap&&bp&&ap.constructor===bp.constructor)// Same type of object but its properties may have changed
	getObjectDiff(ap,bp,rv,prfx+prop+".");else if(ap!==bp)rv[prfx+prop]=b[prop];// Primitive value changed
	}});keys(b).forEach(function(prop){if(!hasOwn(a,prop)){rv[prfx+prop]=b[prop];// Property added
	}});return rv;}// If first argument is iterable or array-like, return it as an array
	var iteratorSymbol=typeof _symbol2.default!=='undefined'&&_iterator2.default;var getIteratorOf=iteratorSymbol?function(x){var i;return x!=null&&(i=x[iteratorSymbol])&&i.apply(x);}:function(){return null;};var NO_CHAR_ARRAY={};// Takes one or several arguments and returns an array based on the following criteras:
	// * If several arguments provided, return arguments converted to an array in a way that
	//   still allows javascript engine to optimize the code.
	// * If single argument is an array, return a clone of it.
	// * If this-pointer equals NO_CHAR_ARRAY, don't accept strings as valid iterables as a special
	//   case to the two bullets below.
	// * If single argument is an iterable, convert it to an array and return the resulting array.
	// * If single argument is array-like (has length of type number), convert it to an array.
	function getArrayOf(arrayLike){var i,a,x,it;if(arguments.length===1){if(isArray(arrayLike))return arrayLike.slice();if(this===NO_CHAR_ARRAY&&typeof arrayLike==='string')return[arrayLike];if(it=getIteratorOf(arrayLike)){a=[];while(x=it.next(),!x.done){a.push(x.value);}return a;}if(arrayLike==null)return[arrayLike];i=arrayLike.length;if(typeof i==='number'){a=new Array(i);while(i--){a[i]=arrayLike[i];}return a;}return[arrayLike];}i=arguments.length;a=new Array(i);while(i--){a[i]=arguments[i];}return a;}var concat=[].concat;function flatten(a){return concat.apply([],a);}function nop(){}function mirror(val){return val;}function pureFunctionChain(f1,f2){// Enables chained events that takes ONE argument and returns it to the next function in chain.
	// This pattern is used in the hook("reading") event.
	if(f1==null||f1===mirror)return f2;return function(val){return f2(f1(val));};}function callBoth(on1,on2){return function(){on1.apply(this,arguments);on2.apply(this,arguments);};}function hookCreatingChain(f1,f2){// Enables chained events that takes several arguments and may modify first argument by making a modification and then returning the same instance.
	// This pattern is used in the hook("creating") event.
	if(f1===nop)return f2;return function(){var res=f1.apply(this,arguments);if(res!==undefined)arguments[0]=res;var onsuccess=this.onsuccess,// In case event listener has set this.onsuccess
	onerror=this.onerror;// In case event listener has set this.onerror
	this.onsuccess=null;this.onerror=null;var res2=f2.apply(this,arguments);if(onsuccess)this.onsuccess=this.onsuccess?callBoth(onsuccess,this.onsuccess):onsuccess;if(onerror)this.onerror=this.onerror?callBoth(onerror,this.onerror):onerror;return res2!==undefined?res2:res;};}function hookDeletingChain(f1,f2){if(f1===nop)return f2;return function(){f1.apply(this,arguments);var onsuccess=this.onsuccess,// In case event listener has set this.onsuccess
	onerror=this.onerror;// In case event listener has set this.onerror
	this.onsuccess=this.onerror=null;f2.apply(this,arguments);if(onsuccess)this.onsuccess=this.onsuccess?callBoth(onsuccess,this.onsuccess):onsuccess;if(onerror)this.onerror=this.onerror?callBoth(onerror,this.onerror):onerror;};}function hookUpdatingChain(f1,f2){if(f1===nop)return f2;return function(modifications){var res=f1.apply(this,arguments);extend(modifications,res);// If f1 returns new modifications, extend caller's modifications with the result before calling next in chain.
	var onsuccess=this.onsuccess,// In case event listener has set this.onsuccess
	onerror=this.onerror;// In case event listener has set this.onerror
	this.onsuccess=null;this.onerror=null;var res2=f2.apply(this,arguments);if(onsuccess)this.onsuccess=this.onsuccess?callBoth(onsuccess,this.onsuccess):onsuccess;if(onerror)this.onerror=this.onerror?callBoth(onerror,this.onerror):onerror;return res===undefined?res2===undefined?undefined:res2:extend(res,res2);};}function reverseStoppableEventChain(f1,f2){if(f1===nop)return f2;return function(){if(f2.apply(this,arguments)===false)return false;return f1.apply(this,arguments);};}function promisableChain(f1,f2){if(f1===nop)return f2;return function(){var res=f1.apply(this,arguments);if(res&&typeof res.then==='function'){var thiz=this,i=arguments.length,args=new Array(i);while(i--){args[i]=arguments[i];}return res.then(function(){return f2.apply(thiz,args);});}return f2.apply(this,arguments);};}// By default, debug will be true only if platform is a web platform and its page is served from localhost.
	// When debug = true, error's stacks will contain asyncronic long stacks.
	var debug=typeof location!=='undefined'&&// By default, use debug mode if served from localhost.
	/^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);function setDebug(value,filter){debug=value;libraryFilter=filter;}var libraryFilter=function libraryFilter(){return true;};var NEEDS_THROW_FOR_STACK=!new Error("").stack;function getErrorWithStack(){"use strict";if(NEEDS_THROW_FOR_STACK)try{// Doing something naughty in strict mode here to trigger a specific error
	// that can be explicitely ignored in debugger's exception settings.
	// If we'd just throw new Error() here, IE's debugger's exception settings
	// will just consider it as "exception thrown by javascript code" which is
	// something you wouldn't want it to ignore.
	getErrorWithStack.arguments;throw new Error();// Fallback if above line don't throw.
	}catch(e){return e;}return new Error();}function prettyStack(exception,numIgnoredFrames){var stack=exception.stack;if(!stack)return"";numIgnoredFrames=numIgnoredFrames||0;if(stack.indexOf(exception.name)===0)numIgnoredFrames+=(exception.name+exception.message).split('\n').length;return stack.split('\n').slice(numIgnoredFrames).filter(libraryFilter).map(function(frame){return"\n"+frame;}).join('');}function deprecated(what,fn){return function(){console.warn(what+" is deprecated. See https://github.com/dfahlander/Dexie.js/wiki/Deprecations. "+prettyStack(getErrorWithStack(),1));return fn.apply(this,arguments);};}var dexieErrorNames=['Modify','Bulk','OpenFailed','VersionChange','Schema','Upgrade','InvalidTable','MissingAPI','NoSuchDatabase','InvalidArgument','SubTransaction','Unsupported','Internal','DatabaseClosed','IncompatiblePromise'];var idbDomErrorNames=['Unknown','Constraint','Data','TransactionInactive','ReadOnly','Version','NotFound','InvalidState','InvalidAccess','Abort','Timeout','QuotaExceeded','Syntax','DataClone'];var errorList=dexieErrorNames.concat(idbDomErrorNames);var defaultTexts={VersionChanged:"Database version changed by other database connection",DatabaseClosed:"Database has been closed",Abort:"Transaction aborted",TransactionInactive:"Transaction has already completed or failed"};//
	// DexieError - base class of all out exceptions.
	//
	function DexieError(name,msg){// Reason we don't use ES6 classes is because:
	// 1. It bloats transpiled code and increases size of minified code.
	// 2. It doesn't give us much in this case.
	// 3. It would require sub classes to call super(), which
	//    is not needed when deriving from Error.
	this._e=getErrorWithStack();this.name=name;this.message=msg;}derive(DexieError).from(Error).extend({stack:{get:function get(){return this._stack||(this._stack=this.name+": "+this.message+prettyStack(this._e,2));}},toString:function toString(){return this.name+": "+this.message;}});function getMultiErrorMessage(msg,failures){return msg+". Errors: "+failures.map(function(f){return f.toString();}).filter(function(v,i,s){return s.indexOf(v)===i;})// Only unique error strings
	.join('\n');}//
	// ModifyError - thrown in WriteableCollection.modify()
	// Specific constructor because it contains members failures and failedKeys.
	//
	function ModifyError(msg,failures,successCount,failedKeys){this._e=getErrorWithStack();this.failures=failures;this.failedKeys=failedKeys;this.successCount=successCount;}derive(ModifyError).from(DexieError);function BulkError(msg,failures){this._e=getErrorWithStack();this.name="BulkError";this.failures=failures;this.message=getMultiErrorMessage(msg,failures);}derive(BulkError).from(DexieError);//
	//
	// Dynamically generate error names and exception classes based
	// on the names in errorList.
	//
	//
	// Map of {ErrorName -> ErrorName + "Error"}
	var errnames=errorList.reduce(function(obj,name){return obj[name]=name+"Error",obj;},{});// Need an alias for DexieError because we're gonna create subclasses with the same name.
	var BaseException=DexieError;// Map of {ErrorName -> exception constructor}
	var exceptions=errorList.reduce(function(obj,name){// Let the name be "DexieError" because this name may
	// be shown in call stack and when debugging. DexieError is
	// the most true name because it derives from DexieError,
	// and we cannot change Function.name programatically without
	// dynamically create a Function object, which would be considered
	// 'eval-evil'.
	var fullName=name+"Error";function DexieError(msgOrInner,inner){this._e=getErrorWithStack();this.name=fullName;if(!msgOrInner){this.message=defaultTexts[name]||fullName;this.inner=null;}else if(typeof msgOrInner==='string'){this.message=msgOrInner;this.inner=inner||null;}else if((typeof msgOrInner==='undefined'?'undefined':(0,_typeof3.default)(msgOrInner))==='object'){this.message=msgOrInner.name+' '+msgOrInner.message;this.inner=msgOrInner;}}derive(DexieError).from(BaseException);obj[name]=DexieError;return obj;},{});// Use ECMASCRIPT standard exceptions where applicable:
	exceptions.Syntax=SyntaxError;exceptions.Type=TypeError;exceptions.Range=RangeError;var exceptionMap=idbDomErrorNames.reduce(function(obj,name){obj[name+"Error"]=exceptions[name];return obj;},{});function mapError(domError,message){if(!domError||domError instanceof DexieError||domError instanceof TypeError||domError instanceof SyntaxError||!domError.name||!exceptionMap[domError.name])return domError;var rv=new exceptionMap[domError.name](message||domError.message,domError);if("stack"in domError){// Derive stack from inner exception if it has a stack
	setProp(rv,"stack",{get:function get(){return this.inner.stack;}});}return rv;}var fullNameExceptions=errorList.reduce(function(obj,name){if(["Syntax","Type","Range"].indexOf(name)===-1)obj[name+"Error"]=exceptions[name];return obj;},{});fullNameExceptions.ModifyError=ModifyError;fullNameExceptions.DexieError=DexieError;fullNameExceptions.BulkError=BulkError;function Events(ctx){var evs={};var rv=function rv(eventName,subscriber){if(subscriber){// Subscribe. If additional arguments than just the subscriber was provided, forward them as well.
	var i=arguments.length,args=new Array(i-1);while(--i){args[i-1]=arguments[i];}evs[eventName].subscribe.apply(null,args);return ctx;}else if(typeof eventName==='string'){// Return interface allowing to fire or unsubscribe from event
	return evs[eventName];}};rv.addEventType=add;for(var i=1,l=arguments.length;i<l;++i){add(arguments[i]);}return rv;function add(eventName,chainFunction,defaultFunction){if((typeof eventName==='undefined'?'undefined':(0,_typeof3.default)(eventName))==='object')return addConfiguredEvents(eventName);if(!chainFunction)chainFunction=reverseStoppableEventChain;if(!defaultFunction)defaultFunction=nop;var context={subscribers:[],fire:defaultFunction,subscribe:function subscribe(cb){if(context.subscribers.indexOf(cb)===-1){context.subscribers.push(cb);context.fire=chainFunction(context.fire,cb);}},unsubscribe:function unsubscribe(cb){context.subscribers=context.subscribers.filter(function(fn){return fn!==cb;});context.fire=context.subscribers.reduce(chainFunction,defaultFunction);}};evs[eventName]=rv[eventName]=context;return context;}function addConfiguredEvents(cfg){// events(this, {reading: [functionChain, nop]});
	keys(cfg).forEach(function(eventName){var args=cfg[eventName];if(isArray(args)){add(eventName,cfg[eventName][0],cfg[eventName][1]);}else if(args==='asap'){// Rather than approaching event subscription using a functional approach, we here do it in a for-loop where subscriber is executed in its own stack
	// enabling that any exception that occur wont disturb the initiator and also not nescessary be catched and forgotten.
	var context=add(eventName,mirror,function fire(){// Optimazation-safe cloning of arguments into args.
	var i=arguments.length,args=new Array(i);while(i--){args[i]=arguments[i];}// All each subscriber:
	context.subscribers.forEach(function(fn){asap(function fireEvent(){fn.apply(null,args);});});});}else throw new exceptions.InvalidArgument("Invalid event config");});}}//
	// Promise Class for Dexie library
	//
	// I started out writing this Promise class by copying promise-light (https://github.com/taylorhakes/promise-light) by
	// https://github.com/taylorhakes - an A+ and ECMASCRIPT 6 compliant Promise implementation.
	//
	// Modifications needed to be done to support indexedDB because it wont accept setTimeout()
	// (See discussion: https://github.com/promises-aplus/promises-spec/issues/45) .
	// This topic was also discussed in the following thread: https://github.com/promises-aplus/promises-spec/issues/45
	//
	// This implementation will not use setTimeout or setImmediate when it's not needed. The behavior is 100% Promise/A+ compliant since
	// the caller of new Promise() can be certain that the promise wont be triggered the lines after constructing the promise.
	//
	// In previous versions this was fixed by not calling setTimeout when knowing that the resolve() or reject() came from another
	// tick. In Dexie v1.4.0, I've rewritten the Promise class entirely. Just some fragments of promise-light is left. I use
	// another strategy now that simplifies everything a lot: to always execute callbacks in a new tick, but have an own microTick
	// engine that is used instead of setImmediate() or setTimeout().
	// Promise class has also been optimized a lot with inspiration from bluebird - to avoid closures as much as possible.
	// Also with inspiration from bluebird, asyncronic stacks in debug mode.
	//
	// Specific non-standard features of this Promise class:
	// * Async static context support (Promise.PSD)
	// * Promise.follow() method built upon PSD, that allows user to track all promises created from current stack frame
	//   and below + all promises that those promises creates or awaits.
	// * Detect any unhandled promise in a PSD-scope (PSD.onunhandled). 
	//
	// David Fahlander, https://github.com/dfahlander
	//
	// Just a pointer that only this module knows about.
	// Used in Promise constructor to emulate a private constructor.
	var INTERNAL={};// Async stacks (long stacks) must not grow infinitely.
	var LONG_STACKS_CLIP_LIMIT=100;var MAX_LONG_STACKS=20;var stack_being_generated=false;/* The default "nextTick" function used only for the very first promise in a promise chain.
	   As soon as then promise is resolved or rejected, all next tasks will be executed in micro ticks
	   emulated in this module. For indexedDB compatibility, this means that every method needs to 
	   execute at least one promise before doing an indexedDB operation. Dexie will always call 
	   db.ready().then() for every operation to make sure the indexedDB event is started in an
	   emulated micro tick.
	*/var schedulePhysicalTick=_global.setImmediate?// setImmediate supported. Those modern platforms also supports Function.bind().
	_setImmediate3.default.bind(null,physicalTick):_global.MutationObserver?// MutationObserver supported
	function(){var hiddenDiv=document.createElement("div");new MutationObserver(function(){physicalTick();hiddenDiv=null;}).observe(hiddenDiv,{attributes:true});hiddenDiv.setAttribute('i','1');}:// No support for setImmediate or MutationObserver. No worry, setTimeout is only called
	// once time. Every tick that follows will be our emulated micro tick.
	// Could have uses setTimeout.bind(null, 0, physicalTick) if it wasnt for that FF13 and below has a bug 
	function(){setTimeout(physicalTick,0);};// Confifurable through Promise.scheduler.
	// Don't export because it would be unsafe to let unknown
	// code call it unless they do try..catch within their callback.
	// This function can be retrieved through getter of Promise.scheduler though,
	// but users must not do Promise.scheduler (myFuncThatThrows exception)!
	var asap$1=function asap$1(callback,args){microtickQueue.push([callback,args]);if(needsNewPhysicalTick){schedulePhysicalTick();needsNewPhysicalTick=false;}};var isOutsideMicroTick=true;var needsNewPhysicalTick=true;var unhandledErrors=[];var rejectingErrors=[];var currentFulfiller=null;var rejectionMapper=mirror;// Remove in next major when removing error mapping of DOMErrors and DOMExceptions
	var globalPSD={global:true,ref:0,unhandleds:[],onunhandled:globalError,//env: null, // Will be set whenever leaving a scope using wrappers.snapshot()
	finalize:function finalize(){this.unhandleds.forEach(function(uh){try{globalError(uh[0],uh[1]);}catch(e){}});}};var PSD=globalPSD;var microtickQueue=[];// Callbacks to call in this or next physical tick.
	var numScheduledCalls=0;// Number of listener-calls left to do in this physical tick.
	var tickFinalizers=[];// Finalizers to call when there are no more async calls scheduled within current physical tick.
	// Wrappers are not being used yet. Their framework is functioning and can be used
	// to replace environment during a PSD scope (a.k.a. 'zone').
	/* **KEEP** export var wrappers = (() => {
	    var wrappers = [];
	
	    return {
	        snapshot: () => {
	            var i = wrappers.length,
	                result = new Array(i);
	            while (i--) result[i] = wrappers[i].snapshot();
	            return result;
	        },
	        restore: values => {
	            var i = wrappers.length;
	            while (i--) wrappers[i].restore(values[i]);
	        },
	        wrap: () => wrappers.map(w => w.wrap()),
	        add: wrapper => {
	            wrappers.push(wrapper);
	        }
	    };
	})();
	*/function Promise(fn){if((0,_typeof3.default)(this)!=='object')throw new TypeError('Promises must be constructed via new');this._listeners=[];this.onuncatched=nop;// Deprecate in next major. Not needed. Better to use global error handler.
	// A library may set `promise._lib = true;` after promise is created to make resolve() or reject()
	// execute the microtask engine implicitely within the call to resolve() or reject().
	// To remain A+ compliant, a library must only set `_lib=true` if it can guarantee that the stack
	// only contains library code when calling resolve() or reject().
	// RULE OF THUMB: ONLY set _lib = true for promises explicitely resolving/rejecting directly from
	// global scope (event handler, timer etc)!
	this._lib=false;// Current async scope
	var psd=this._PSD=PSD;if(debug){this._stackHolder=getErrorWithStack();this._prev=null;this._numPrev=0;// Number of previous promises (for long stacks)
	linkToPreviousPromise(this,currentFulfiller);}if(typeof fn!=='function'){if(fn!==INTERNAL)throw new TypeError('Not a function');// Private constructor (INTERNAL, state, value).
	// Used internally by Promise.resolve() and Promise.reject().
	this._state=arguments[1];this._value=arguments[2];if(this._state===false)handleRejection(this,this._value);// Map error, set stack and addPossiblyUnhandledError().
	return;}this._state=null;// null (=pending), false (=rejected) or true (=resolved)
	this._value=null;// error or result
	++psd.ref;// Refcounting current scope
	executePromiseTask(this,fn);}props(Promise.prototype,{then:function then(onFulfilled,onRejected){var _this=this;var rv=new Promise(function(resolve,reject){propagateToListener(_this,new Listener(onFulfilled,onRejected,resolve,reject));});debug&&(!this._prev||this._state===null)&&linkToPreviousPromise(rv,this);return rv;},_then:function _then(onFulfilled,onRejected){// A little tinier version of then() that don't have to create a resulting promise.
	propagateToListener(this,new Listener(null,null,onFulfilled,onRejected));},catch:function _catch(onRejected){if(arguments.length===1)return this.then(null,onRejected);// First argument is the Error type to catch
	var type=arguments[0],handler=arguments[1];return typeof type==='function'?this.then(null,function(err){return(// Catching errors by its constructor type (similar to java / c++ / c#)
	// Sample: promise.catch(TypeError, function (e) { ... });
	err instanceof type?handler(err):PromiseReject(err));}):this.then(null,function(err){return(// Catching errors by the error.name property. Makes sense for indexedDB where error type
	// is always DOMError but where e.name tells the actual error type.
	// Sample: promise.catch('ConstraintError', function (e) { ... });
	err&&err.name===type?handler(err):PromiseReject(err));});},finally:function _finally(onFinally){return this.then(function(value){onFinally();return value;},function(err){onFinally();return PromiseReject(err);});},// Deprecate in next major. Needed only for db.on.error.
	uncaught:function uncaught(uncaughtHandler){var _this2=this;// Be backward compatible and use "onuncatched" as the event name on this.
	// Handle multiple subscribers through reverseStoppableEventChain(). If a handler returns `false`, bubbling stops.
	this.onuncatched=reverseStoppableEventChain(this.onuncatched,uncaughtHandler);// In case caller does this on an already rejected promise, assume caller wants to point out the error to this promise and not
	// a previous promise. Reason: the prevous promise may lack onuncatched handler. 
	if(this._state===false&&unhandledErrors.indexOf(this)===-1){// Replace unhandled error's destinaion promise with this one!
	unhandledErrors.some(function(p,i,l){return p._value===_this2._value&&(l[i]=_this2);});// Actually we do this shit because we need to support db.on.error() correctly during db.open(). If we deprecate db.on.error, we could
	// take away this piece of code as well as the onuncatched and uncaught() method.
	}return this;},stack:{get:function get(){if(this._stack)return this._stack;try{stack_being_generated=true;var stacks=getStack(this,[],MAX_LONG_STACKS);var stack=stacks.join("\nFrom previous: ");if(this._state!==null)this._stack=stack;// Stack may be updated on reject.
	return stack;}finally{stack_being_generated=false;}}}});function Listener(onFulfilled,onRejected,resolve,reject){this.onFulfilled=typeof onFulfilled==='function'?onFulfilled:null;this.onRejected=typeof onRejected==='function'?onRejected:null;this.resolve=resolve;this.reject=reject;this.psd=PSD;}// Promise Static Properties
	props(Promise,{all:function all(){var values=getArrayOf.apply(null,arguments);// Supports iterables, implicit arguments and array-like.
	return new Promise(function(resolve,reject){if(values.length===0)resolve([]);var remaining=values.length;values.forEach(function(a,i){return Promise.resolve(a).then(function(x){values[i]=x;if(! --remaining)resolve(values);},reject);});});},resolve:function resolve(value){if(value instanceof Promise)return value;if(value&&typeof value.then==='function')return new Promise(function(resolve,reject){value.then(resolve,reject);});return new Promise(INTERNAL,true,value);},reject:PromiseReject,race:function race(){var values=getArrayOf.apply(null,arguments);return new Promise(function(resolve,reject){values.map(function(value){return Promise.resolve(value).then(resolve,reject);});});},PSD:{get:function get(){return PSD;},set:function set(value){return PSD=value;}},newPSD:newScope,usePSD:usePSD,scheduler:{get:function get(){return asap$1;},set:function set(value){asap$1=value;}},rejectionMapper:{get:function get(){return rejectionMapper;},set:function set(value){rejectionMapper=value;}// Map reject failures
	},follow:function follow(fn){return new Promise(function(resolve,reject){return newScope(function(resolve,reject){var psd=PSD;psd.unhandleds=[];// For unhandled standard- or 3rd party Promises. Checked at psd.finalize()
	psd.onunhandled=reject;// Triggered directly on unhandled promises of this library.
	psd.finalize=callBoth(function(){var _this3=this;// Unhandled standard or 3rd part promises are put in PSD.unhandleds and
	// examined upon scope completion while unhandled rejections in this Promise
	// will trigger directly through psd.onunhandled
	run_at_end_of_this_or_next_physical_tick(function(){_this3.unhandleds.length===0?resolve():reject(_this3.unhandleds[0]);});},psd.finalize);fn();},resolve,reject);});},on:Events(null,{"error":[reverseStoppableEventChain,defaultErrorHandler]// Default to defaultErrorHandler
	})});var PromiseOnError=Promise.on.error;PromiseOnError.subscribe=deprecated("Promise.on('error')",PromiseOnError.subscribe);PromiseOnError.unsubscribe=deprecated("Promise.on('error').unsubscribe",PromiseOnError.unsubscribe);/**
	* Take a potentially misbehaving resolver function and make sure
	* onFulfilled and onRejected are only called once.
	*
	* Makes no guarantees about asynchrony.
	*/function executePromiseTask(promise,fn){// Promise Resolution Procedure:
	// https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
	try{fn(function(value){if(promise._state!==null)return;if(value===promise)throw new TypeError('A promise cannot be resolved with itself.');var shouldExecuteTick=promise._lib&&beginMicroTickScope();if(value&&typeof value.then==='function'){executePromiseTask(promise,function(resolve,reject){value instanceof Promise?value._then(resolve,reject):value.then(resolve,reject);});}else{promise._state=true;promise._value=value;propagateAllListeners(promise);}if(shouldExecuteTick)endMicroTickScope();},handleRejection.bind(null,promise));// If Function.bind is not supported. Exception is handled in catch below
	}catch(ex){handleRejection(promise,ex);}}function handleRejection(promise,reason){rejectingErrors.push(reason);if(promise._state!==null)return;var shouldExecuteTick=promise._lib&&beginMicroTickScope();reason=rejectionMapper(reason);promise._state=false;promise._value=reason;debug&&reason!==null&&(typeof reason==='undefined'?'undefined':(0,_typeof3.default)(reason))==='object'&&!reason._promise&&tryCatch(function(){var origProp=getPropertyDescriptor(reason,"stack");reason._promise=promise;setProp(reason,"stack",{get:function get(){return stack_being_generated?origProp&&(origProp.get?origProp.get.apply(reason):origProp.value):promise.stack;}});});// Add the failure to a list of possibly uncaught errors
	addPossiblyUnhandledError(promise);propagateAllListeners(promise);if(shouldExecuteTick)endMicroTickScope();}function propagateAllListeners(promise){//debug && linkToPreviousPromise(promise);
	var listeners=promise._listeners;promise._listeners=[];for(var i=0,len=listeners.length;i<len;++i){propagateToListener(promise,listeners[i]);}var psd=promise._PSD;--psd.ref||psd.finalize();// if psd.ref reaches zero, call psd.finalize();
	if(numScheduledCalls===0){// If numScheduledCalls is 0, it means that our stack is not in a callback of a scheduled call,
	// and that no deferreds where listening to this rejection or success.
	// Since there is a risk that our stack can contain application code that may
	// do stuff after this code is finished that may generate new calls, we cannot
	// call finalizers here.
	++numScheduledCalls;asap$1(function(){if(--numScheduledCalls===0)finalizePhysicalTick();// Will detect unhandled errors
	},[]);}}function propagateToListener(promise,listener){if(promise._state===null){promise._listeners.push(listener);return;}var cb=promise._state?listener.onFulfilled:listener.onRejected;if(cb===null){// This Listener doesnt have a listener for the event being triggered (onFulfilled or onReject) so lets forward the event to any eventual listeners on the Promise instance returned by then() or catch()
	return(promise._state?listener.resolve:listener.reject)(promise._value);}var psd=listener.psd;++psd.ref;++numScheduledCalls;asap$1(callListener,[cb,promise,listener]);}function callListener(cb,promise,listener){var outerScope=PSD;var psd=listener.psd;try{if(psd!==outerScope){// **KEEP** outerScope.env = wrappers.snapshot(); // Snapshot outerScope's environment.
	PSD=psd;// **KEEP** wrappers.restore(psd.env); // Restore PSD's environment.
	}// Set static variable currentFulfiller to the promise that is being fullfilled,
	// so that we connect the chain of promises (for long stacks support)
	currentFulfiller=promise;// Call callback and resolve our listener with it's return value.
	var value=promise._value,ret;if(promise._state){ret=cb(value);}else{if(rejectingErrors.length)rejectingErrors=[];ret=cb(value);if(rejectingErrors.indexOf(value)===-1)markErrorAsHandled(promise);// Callback didnt do Promise.reject(err) nor reject(err) onto another promise.
	}listener.resolve(ret);}catch(e){// Exception thrown in callback. Reject our listener.
	listener.reject(e);}finally{// Restore PSD, env and currentFulfiller.
	if(psd!==outerScope){PSD=outerScope;// **KEEP** wrappers.restore(outerScope.env); // Restore outerScope's environment
	}currentFulfiller=null;if(--numScheduledCalls===0)finalizePhysicalTick();--psd.ref||psd.finalize();}}function getStack(promise,stacks,limit){if(stacks.length===limit)return stacks;var stack="";if(promise._state===false){var failure=promise._value,errorName,message;if(failure!=null){errorName=failure.name||"Error";message=failure.message||failure;stack=prettyStack(failure,0);}else{errorName=failure;// If error is undefined or null, show that.
	message="";}stacks.push(errorName+(message?": "+message:"")+stack);}if(debug){stack=prettyStack(promise._stackHolder,2);if(stack&&stacks.indexOf(stack)===-1)stacks.push(stack);if(promise._prev)getStack(promise._prev,stacks,limit);}return stacks;}function linkToPreviousPromise(promise,prev){// Support long stacks by linking to previous completed promise.
	var numPrev=prev?prev._numPrev+1:0;if(numPrev<LONG_STACKS_CLIP_LIMIT){// Prohibit infinite Promise loops to get an infinite long memory consuming "tail".
	promise._prev=prev;promise._numPrev=numPrev;}}/* The callback to schedule with setImmediate() or setTimeout().
	   It runs a virtual microtick and executes any callback registered in microtickQueue.
	 */function physicalTick(){beginMicroTickScope()&&endMicroTickScope();}function beginMicroTickScope(){var wasRootExec=isOutsideMicroTick;isOutsideMicroTick=false;needsNewPhysicalTick=false;return wasRootExec;}/* Executes micro-ticks without doing try..catch.
	   This can be possible because we only use this internally and
	   the registered functions are exception-safe (they do try..catch
	   internally before calling any external method). If registering
	   functions in the microtickQueue that are not exception-safe, this
	   would destroy the framework and make it instable. So we don't export
	   our asap method.
	*/function endMicroTickScope(){var callbacks,i,l;do{while(microtickQueue.length>0){callbacks=microtickQueue;microtickQueue=[];l=callbacks.length;for(i=0;i<l;++i){var item=callbacks[i];item[0].apply(null,item[1]);}}}while(microtickQueue.length>0);isOutsideMicroTick=true;needsNewPhysicalTick=true;}function finalizePhysicalTick(){var unhandledErrs=unhandledErrors;unhandledErrors=[];unhandledErrs.forEach(function(p){p._PSD.onunhandled.call(null,p._value,p);});var finalizers=tickFinalizers.slice(0);// Clone first because finalizer may remove itself from list.
	var i=finalizers.length;while(i){finalizers[--i]();}}function run_at_end_of_this_or_next_physical_tick(fn){function finalizer(){fn();tickFinalizers.splice(tickFinalizers.indexOf(finalizer),1);}tickFinalizers.push(finalizer);++numScheduledCalls;asap$1(function(){if(--numScheduledCalls===0)finalizePhysicalTick();},[]);}function addPossiblyUnhandledError(promise){// Only add to unhandledErrors if not already there. The first one to add to this list
	// will be upon the first rejection so that the root cause (first promise in the
	// rejection chain) is the one listed.
	if(!unhandledErrors.some(function(p){return p._value===promise._value;}))unhandledErrors.push(promise);}function markErrorAsHandled(promise){// Called when a reject handled is actually being called.
	// Search in unhandledErrors for any promise whos _value is this promise_value (list
	// contains only rejected promises, and only one item per error)
	var i=unhandledErrors.length;while(i){if(unhandledErrors[--i]._value===promise._value){// Found a promise that failed with this same error object pointer,
	// Remove that since there is a listener that actually takes care of it.
	unhandledErrors.splice(i,1);return;}}}// By default, log uncaught errors to the console
	function defaultErrorHandler(e){console.warn('Unhandled rejection: '+(e.stack||e));}function PromiseReject(reason){return new Promise(INTERNAL,false,reason);}function wrap(fn,errorCatcher){var psd=PSD;return function(){var wasRootExec=beginMicroTickScope(),outerScope=PSD;try{if(outerScope!==psd){// **KEEP** outerScope.env = wrappers.snapshot(); // Snapshot outerScope's environment
	PSD=psd;// **KEEP** wrappers.restore(psd.env); // Restore PSD's environment.
	}return fn.apply(this,arguments);}catch(e){errorCatcher&&errorCatcher(e);}finally{if(outerScope!==psd){PSD=outerScope;// **KEEP** wrappers.restore(outerScope.env); // Restore outerScope's environment
	}if(wasRootExec)endMicroTickScope();}};}function newScope(fn,a1,a2,a3){var parent=PSD,psd=(0,_create2.default)(parent);psd.parent=parent;psd.ref=0;psd.global=false;// **KEEP** psd.env = wrappers.wrap(psd);
	// unhandleds and onunhandled should not be specifically set here.
	// Leave them on parent prototype.
	// unhandleds.push(err) will push to parent's prototype
	// onunhandled() will call parents onunhandled (with this scope's this-pointer though!)
	++parent.ref;psd.finalize=function(){--this.parent.ref||this.parent.finalize();};var rv=usePSD(psd,fn,a1,a2,a3);if(psd.ref===0)psd.finalize();return rv;}function usePSD(psd,fn,a1,a2,a3){var outerScope=PSD;try{if(psd!==outerScope){// **KEEP** outerScope.env = wrappers.snapshot(); // snapshot outerScope's environment.
	PSD=psd;// **KEEP** wrappers.restore(psd.env); // Restore PSD's environment.
	}return fn(a1,a2,a3);}finally{if(psd!==outerScope){PSD=outerScope;// **KEEP** wrappers.restore(outerScope.env); // Restore outerScope's environment.
	}}}var UNHANDLEDREJECTION="unhandledrejection";function globalError(err,promise){var rv;try{rv=promise.onuncatched(err);}catch(e){}if(rv!==false)try{var event,eventData={promise:promise,reason:err};if(_global.document&&document.createEvent){event=document.createEvent('Event');event.initEvent(UNHANDLEDREJECTION,true,true);extend(event,eventData);}else if(_global.CustomEvent){event=new CustomEvent(UNHANDLEDREJECTION,{detail:eventData});extend(event,eventData);}if(event&&_global.dispatchEvent){dispatchEvent(event);if(!_global.PromiseRejectionEvent&&_global.onunhandledrejection)// No native support for PromiseRejectionEvent but user has set window.onunhandledrejection. Manually call it.
	try{_global.onunhandledrejection(event);}catch(_){}}if(!event.defaultPrevented){// Backward compatibility: fire to events registered at Promise.on.error
	Promise.on.error.fire(err,promise);}}catch(e){}}/* **KEEP** 
	
	export function wrapPromise(PromiseClass) {
	    var proto = PromiseClass.prototype;
	    var origThen = proto.then;
	    
	    wrappers.add({
	        snapshot: () => proto.then,
	        restore: value => {proto.then = value;},
	        wrap: () => patchedThen
	    });
	
	    function patchedThen (onFulfilled, onRejected) {
	        var promise = this;
	        var onFulfilledProxy = wrap(function(value){
	            var rv = value;
	            if (onFulfilled) {
	                rv = onFulfilled(rv);
	                if (rv && typeof rv.then === 'function') rv.then(); // Intercept that promise as well.
	            }
	            --PSD.ref || PSD.finalize();
	            return rv;
	        });
	        var onRejectedProxy = wrap(function(err){
	            promise._$err = err;
	            var unhandleds = PSD.unhandleds;
	            var idx = unhandleds.length,
	                rv;
	            while (idx--) if (unhandleds[idx]._$err === err) break;
	            if (onRejected) {
	                if (idx !== -1) unhandleds.splice(idx, 1); // Mark as handled.
	                rv = onRejected(err);
	                if (rv && typeof rv.then === 'function') rv.then(); // Intercept that promise as well.
	            } else {
	                if (idx === -1) unhandleds.push(promise);
	                rv = PromiseClass.reject(err);
	                rv._$nointercept = true; // Prohibit eternal loop.
	            }
	            --PSD.ref || PSD.finalize();
	            return rv;
	        });
	        
	        if (this._$nointercept) return origThen.apply(this, arguments);
	        ++PSD.ref;
	        return origThen.call(this, onFulfilledProxy, onRejectedProxy);
	    }
	}
	
	// Global Promise wrapper
	if (_global.Promise) wrapPromise(_global.Promise);
	
	*/doFakeAutoComplete(function(){// Simplify the job for VS Intellisense. This piece of code is one of the keys to the new marvellous intellisense support in Dexie.
	asap$1=function asap$1(fn,args){setTimeout(function(){fn.apply(null,args);},0);};});function rejection(err,uncaughtHandler){// Get the call stack and return a rejected promise.
	var rv=Promise.reject(err);return uncaughtHandler?rv.uncaught(uncaughtHandler):rv;}/*
	 * Dexie.js - a minimalistic wrapper for IndexedDB
	 * ===============================================
	 *
	 * By David Fahlander, david.fahlander@gmail.com
	 *
	 * Version 1.5.0, Thu Oct 13 2016
	 *
	 * http://dexie.org
	 *
	 * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/
	 */var DEXIE_VERSION='1.5.0';var maxString=String.fromCharCode(65535);var maxKey=function(){try{IDBKeyRange.only([[]]);return[[]];}catch(e){return maxString;}}();var INVALID_KEY_ARGUMENT="Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";var STRING_EXPECTED="String expected.";var connections=[];var isIEOrEdge=typeof navigator!=='undefined'&&/(MSIE|Trident|Edge)/.test(navigator.userAgent);var hasIEDeleteObjectStoreBug=isIEOrEdge;var hangsOnDeleteLargeKeyRange=isIEOrEdge;var dexieStackFrameFilter=function dexieStackFrameFilter(frame){return!/(dexie\.js|dexie\.min\.js)/.test(frame);};setDebug(debug,dexieStackFrameFilter);function Dexie(dbName,options){/// <param name="options" type="Object" optional="true">Specify only if you wich to control which addons that should run on this instance</param>
	var deps=Dexie.dependencies;var opts=extend({// Default Options
	addons:Dexie.addons,// Pick statically registered addons by default
	autoOpen:true,// Don't require db.open() explicitely.
	indexedDB:deps.indexedDB,// Backend IndexedDB api. Default to IDBShim or browser env.
	IDBKeyRange:deps.IDBKeyRange// Backend IDBKeyRange api. Default to IDBShim or browser env.
	},options);var addons=opts.addons,autoOpen=opts.autoOpen,indexedDB=opts.indexedDB,IDBKeyRange=opts.IDBKeyRange;var globalSchema=this._dbSchema={};var versions=[];var dbStoreNames=[];var allTables={};///<var type="IDBDatabase" />
	var idbdb=null;// Instance of IDBDatabase
	var dbOpenError=null;var isBeingOpened=false;var openComplete=false;var READONLY="readonly",READWRITE="readwrite";var db=this;var dbReadyResolve,dbReadyPromise=new Promise(function(resolve){dbReadyResolve=resolve;}),cancelOpen,openCanceller=new Promise(function(_,reject){cancelOpen=reject;});var autoSchema=true;var hasNativeGetDatabaseNames=!!getNativeGetDatabaseNamesFn(indexedDB),hasGetAll;function init(){// Default subscribers to "versionchange" and "blocked".
	// Can be overridden by custom handlers. If custom handlers return false, these default
	// behaviours will be prevented.
	db.on("versionchange",function(ev){// Default behavior for versionchange event is to close database connection.
	// Caller can override this behavior by doing db.on("versionchange", function(){ return false; });
	// Let's not block the other window from making it's delete() or open() call.
	// NOTE! This event is never fired in IE,Edge or Safari.
	if(ev.newVersion>0)console.warn('Another connection wants to upgrade database \''+db.name+'\'. Closing db now to resume the upgrade.');else console.warn('Another connection wants to delete database \''+db.name+'\'. Closing db now to resume the delete request.');db.close();// In many web applications, it would be recommended to force window.reload()
	// when this event occurs. To do that, subscribe to the versionchange event
	// and call window.location.reload(true) if ev.newVersion > 0 (not a deletion)
	// The reason for this is that your current web app obviously has old schema code that needs
	// to be updated. Another window got a newer version of the app and needs to upgrade DB but
	// your window is blocking it unless we close it here.
	});db.on("blocked",function(ev){if(!ev.newVersion||ev.newVersion<ev.oldVersion)console.warn('Dexie.delete(\''+db.name+'\') was blocked');else console.warn('Upgrade \''+db.name+'\' blocked by other connection holding version '+ev.oldVersion/10);});}//
	//
	//
	// ------------------------- Versioning Framework---------------------------
	//
	//
	//
	this.version=function(versionNumber){/// <param name="versionNumber" type="Number"></param>
	/// <returns type="Version"></returns>
	if(idbdb||isBeingOpened)throw new exceptions.Schema("Cannot add version when database is open");this.verno=Math.max(this.verno,versionNumber);var versionInstance=versions.filter(function(v){return v._cfg.version===versionNumber;})[0];if(versionInstance)return versionInstance;versionInstance=new Version(versionNumber);versions.push(versionInstance);versions.sort(lowerVersionFirst);return versionInstance;};function Version(versionNumber){this._cfg={version:versionNumber,storesSource:null,dbschema:{},tables:{},contentUpgrade:null};this.stores({});// Derive earlier schemas by default.
	}extend(Version.prototype,{stores:function stores(_stores){/// <summary>
	///   Defines the schema for a particular version
	/// </summary>
	/// <param name="stores" type="Object">
	/// Example: <br/>
	///   {users: "id++,first,last,&amp;username,*email", <br/>
	///   passwords: "id++,&amp;username"}<br/>
	/// <br/>
	/// Syntax: {Table: "[primaryKey][++],[&amp;][*]index1,[&amp;][*]index2,..."}<br/><br/>
	/// Special characters:<br/>
	///  "&amp;"  means unique key, <br/>
	///  "*"  means value is multiEntry, <br/>
	///  "++" means auto-increment and only applicable for primary key <br/>
	/// </param>
	this._cfg.storesSource=this._cfg.storesSource?extend(this._cfg.storesSource,_stores):_stores;// Derive stores from earlier versions if they are not explicitely specified as null or a new syntax.
	var storesSpec={};versions.forEach(function(version){// 'versions' is always sorted by lowest version first.
	extend(storesSpec,version._cfg.storesSource);});var dbschema=this._cfg.dbschema={};this._parseStoresSpec(storesSpec,dbschema);// Update the latest schema to this version
	// Update API
	globalSchema=db._dbSchema=dbschema;removeTablesApi([allTables,db,Transaction.prototype]);setApiOnPlace([allTables,db,Transaction.prototype,this._cfg.tables],keys(dbschema),READWRITE,dbschema);dbStoreNames=keys(dbschema);return this;},upgrade:function upgrade(upgradeFunction){/// <param name="upgradeFunction" optional="true">Function that performs upgrading actions.</param>
	var self=this;fakeAutoComplete(function(){upgradeFunction(db._createTransaction(READWRITE,keys(self._cfg.dbschema),self._cfg.dbschema));// BUGBUG: No code completion for prev version's tables wont appear.
	});this._cfg.contentUpgrade=upgradeFunction;return this;},_parseStoresSpec:function _parseStoresSpec(stores,outSchema){keys(stores).forEach(function(tableName){if(stores[tableName]!==null){var instanceTemplate={};var indexes=parseIndexSyntax(stores[tableName]);var primKey=indexes.shift();if(primKey.multi)throw new exceptions.Schema("Primary key cannot be multi-valued");if(primKey.keyPath)setByKeyPath(instanceTemplate,primKey.keyPath,primKey.auto?0:primKey.keyPath);indexes.forEach(function(idx){if(idx.auto)throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");if(!idx.keyPath)throw new exceptions.Schema("Index must have a name and cannot be an empty string");setByKeyPath(instanceTemplate,idx.keyPath,idx.compound?idx.keyPath.map(function(){return"";}):"");});outSchema[tableName]=new TableSchema(tableName,primKey,indexes,instanceTemplate);}});}});function runUpgraders(oldVersion,idbtrans,reject){var trans=db._createTransaction(READWRITE,dbStoreNames,globalSchema);trans.create(idbtrans);trans._completion.catch(reject);var rejectTransaction=trans._reject.bind(trans);newScope(function(){PSD.trans=trans;if(oldVersion===0){// Create tables:
	keys(globalSchema).forEach(function(tableName){createTable(idbtrans,tableName,globalSchema[tableName].primKey,globalSchema[tableName].indexes);});Promise.follow(function(){return db.on.populate.fire(trans);}).catch(rejectTransaction);}else updateTablesAndIndexes(oldVersion,trans,idbtrans).catch(rejectTransaction);});}function updateTablesAndIndexes(oldVersion,trans,idbtrans){// Upgrade version to version, step-by-step from oldest to newest version.
	// Each transaction object will contain the table set that was current in that version (but also not-yet-deleted tables from its previous version)
	var queue=[];var oldVersionStruct=versions.filter(function(version){return version._cfg.version===oldVersion;})[0];if(!oldVersionStruct)throw new exceptions.Upgrade("Dexie specification of currently installed DB version is missing");globalSchema=db._dbSchema=oldVersionStruct._cfg.dbschema;var anyContentUpgraderHasRun=false;var versToRun=versions.filter(function(v){return v._cfg.version>oldVersion;});versToRun.forEach(function(version){/// <param name="version" type="Version"></param>
	queue.push(function(){var oldSchema=globalSchema;var newSchema=version._cfg.dbschema;adjustToExistingIndexNames(oldSchema,idbtrans);adjustToExistingIndexNames(newSchema,idbtrans);globalSchema=db._dbSchema=newSchema;var diff=getSchemaDiff(oldSchema,newSchema);// Add tables           
	diff.add.forEach(function(tuple){createTable(idbtrans,tuple[0],tuple[1].primKey,tuple[1].indexes);});// Change tables
	diff.change.forEach(function(change){if(change.recreate){throw new exceptions.Upgrade("Not yet support for changing primary key");}else{var store=idbtrans.objectStore(change.name);// Add indexes
	change.add.forEach(function(idx){addIndex(store,idx);});// Update indexes
	change.change.forEach(function(idx){store.deleteIndex(idx.name);addIndex(store,idx);});// Delete indexes
	change.del.forEach(function(idxName){store.deleteIndex(idxName);});}});if(version._cfg.contentUpgrade){anyContentUpgraderHasRun=true;return Promise.follow(function(){version._cfg.contentUpgrade(trans);});}});queue.push(function(idbtrans){if(!anyContentUpgraderHasRun||!hasIEDeleteObjectStoreBug){// Dont delete old tables if ieBug is present and a content upgrader has run. Let tables be left in DB so far. This needs to be taken care of.
	var newSchema=version._cfg.dbschema;// Delete old tables
	deleteRemovedTables(newSchema,idbtrans);}});});// Now, create a queue execution engine
	function runQueue(){return queue.length?Promise.resolve(queue.shift()(trans.idbtrans)).then(runQueue):Promise.resolve();}return runQueue().then(function(){createMissingTables(globalSchema,idbtrans);// At last, make sure to create any missing tables. (Needed by addons that add stores to DB without specifying version)
	});}function getSchemaDiff(oldSchema,newSchema){var diff={del:[],// Array of table names
	add:[],// Array of [tableName, newDefinition]
	change:[]// Array of {name: tableName, recreate: newDefinition, del: delIndexNames, add: newIndexDefs, change: changedIndexDefs}
	};for(var table in oldSchema){if(!newSchema[table])diff.del.push(table);}for(table in newSchema){var oldDef=oldSchema[table],newDef=newSchema[table];if(!oldDef){diff.add.push([table,newDef]);}else{var change={name:table,def:newDef,recreate:false,del:[],add:[],change:[]};if(oldDef.primKey.src!==newDef.primKey.src){// Primary key has changed. Remove and re-add table.
	change.recreate=true;diff.change.push(change);}else{// Same primary key. Just find out what differs:
	var oldIndexes=oldDef.idxByName;var newIndexes=newDef.idxByName;for(var idxName in oldIndexes){if(!newIndexes[idxName])change.del.push(idxName);}for(idxName in newIndexes){var oldIdx=oldIndexes[idxName],newIdx=newIndexes[idxName];if(!oldIdx)change.add.push(newIdx);else if(oldIdx.src!==newIdx.src)change.change.push(newIdx);}if(change.del.length>0||change.add.length>0||change.change.length>0){diff.change.push(change);}}}}return diff;}function createTable(idbtrans,tableName,primKey,indexes){/// <param name="idbtrans" type="IDBTransaction"></param>
	var store=idbtrans.db.createObjectStore(tableName,primKey.keyPath?{keyPath:primKey.keyPath,autoIncrement:primKey.auto}:{autoIncrement:primKey.auto});indexes.forEach(function(idx){addIndex(store,idx);});return store;}function createMissingTables(newSchema,idbtrans){keys(newSchema).forEach(function(tableName){if(!idbtrans.db.objectStoreNames.contains(tableName)){createTable(idbtrans,tableName,newSchema[tableName].primKey,newSchema[tableName].indexes);}});}function deleteRemovedTables(newSchema,idbtrans){for(var i=0;i<idbtrans.db.objectStoreNames.length;++i){var storeName=idbtrans.db.objectStoreNames[i];if(newSchema[storeName]==null){idbtrans.db.deleteObjectStore(storeName);}}}function addIndex(store,idx){store.createIndex(idx.name,idx.keyPath,{unique:idx.unique,multiEntry:idx.multi});}function dbUncaught(err){return db.on.error.fire(err);}//
	//
	//      Dexie Protected API
	//
	//
	this._allTables=allTables;this._tableFactory=function createTable(mode,tableSchema){/// <param name="tableSchema" type="TableSchema"></param>
	if(mode===READONLY)return new Table(tableSchema.name,tableSchema,Collection);else return new WriteableTable(tableSchema.name,tableSchema);};this._createTransaction=function(mode,storeNames,dbschema,parentTransaction){return new Transaction(mode,storeNames,dbschema,parentTransaction);};/* Generate a temporary transaction when db operations are done outside a transactino scope.
	    */function tempTransaction(mode,storeNames,fn){// Last argument is "writeLocked". But this doesnt apply to oneshot direct db operations, so we ignore it.
	if(!openComplete&&!PSD.letThrough){if(!isBeingOpened){if(!autoOpen)return rejection(new exceptions.DatabaseClosed(),dbUncaught);db.open().catch(nop);// Open in background. If if fails, it will be catched by the final promise anyway.
	}return dbReadyPromise.then(function(){return tempTransaction(mode,storeNames,fn);});}else{var trans=db._createTransaction(mode,storeNames,globalSchema);return trans._promise(mode,function(resolve,reject){newScope(function(){// OPTIMIZATION POSSIBLE? newScope() not needed because it's already done in _promise.
	PSD.trans=trans;fn(resolve,reject,trans);});}).then(function(result){// Instead of resolving value directly, wait with resolving it until transaction has completed.
	// Otherwise the data would not be in the DB if requesting it in the then() operation.
	// Specifically, to ensure that the following expression will work:
	//
	//   db.friends.put({name: "Arne"}).then(function () {
	//       db.friends.where("name").equals("Arne").count(function(count) {
	//           assert (count === 1);
	//       });
	//   });
	//
	return trans._completion.then(function(){return result;});});/*.catch(err => { // Don't do this as of now. If would affect bulk- and modify methods in a way that could be more intuitive. But wait! Maybe change in next major.
	                 trans._reject(err);
	                 return rejection(err);
	                });*/}}this._whenReady=function(fn){return new Promise(fake||openComplete||PSD.letThrough?fn:function(resolve,reject){if(!isBeingOpened){if(!autoOpen){reject(new exceptions.DatabaseClosed());return;}db.open().catch(nop);// Open in background. If if fails, it will be catched by the final promise anyway.
	}dbReadyPromise.then(function(){fn(resolve,reject);});}).uncaught(dbUncaught);};//
	//
	//
	//
	//      Dexie API
	//
	//
	//
	this.verno=0;this.open=function(){if(isBeingOpened||idbdb)return dbReadyPromise.then(function(){return dbOpenError?rejection(dbOpenError,dbUncaught):db;});debug&&(openCanceller._stackHolder=getErrorWithStack());// Let stacks point to when open() was called rather than where new Dexie() was called.
	isBeingOpened=true;dbOpenError=null;openComplete=false;// Function pointers to call when the core opening process completes.
	var resolveDbReady=dbReadyResolve,// upgradeTransaction to abort on failure.
	upgradeTransaction=null;return Promise.race([openCanceller,new Promise(function(resolve,reject){doFakeAutoComplete(function(){return resolve();});// Make sure caller has specified at least one version
	if(versions.length>0)autoSchema=false;// Multiply db.verno with 10 will be needed to workaround upgrading bug in IE:
	// IE fails when deleting objectStore after reading from it.
	// A future version of Dexie.js will stopover an intermediate version to workaround this.
	// At that point, we want to be backward compatible. Could have been multiplied with 2, but by using 10, it is easier to map the number to the real version number.
	// If no API, throw!
	if(!indexedDB)throw new exceptions.MissingAPI("indexedDB API not found. If using IE10+, make sure to run your code on a server URL "+"(not locally). If using old Safari versions, make sure to include indexedDB polyfill.");var req=autoSchema?indexedDB.open(dbName):indexedDB.open(dbName,Math.round(db.verno*10));if(!req)throw new exceptions.MissingAPI("IndexedDB API not available");// May happen in Safari private mode, see https://github.com/dfahlander/Dexie.js/issues/134
	req.onerror=wrap(eventRejectHandler(reject));req.onblocked=wrap(fireOnBlocked);req.onupgradeneeded=wrap(function(e){upgradeTransaction=req.transaction;if(autoSchema&&!db._allowEmptyDB){// Unless an addon has specified db._allowEmptyDB, lets make the call fail.
	// Caller did not specify a version or schema. Doing that is only acceptable for opening alread existing databases.
	// If onupgradeneeded is called it means database did not exist. Reject the open() promise and make sure that we
	// do not create a new database by accident here.
	req.onerror=preventDefault;// Prohibit onabort error from firing before we're done!
	upgradeTransaction.abort();// Abort transaction (would hope that this would make DB disappear but it doesnt.)
	// Close database and delete it.
	req.result.close();var delreq=indexedDB.deleteDatabase(dbName);// The upgrade transaction is atomic, and javascript is single threaded - meaning that there is no risk that we delete someone elses database here!
	delreq.onsuccess=delreq.onerror=wrap(function(){reject(new exceptions.NoSuchDatabase('Database '+dbName+' doesnt exist'));});}else{upgradeTransaction.onerror=wrap(eventRejectHandler(reject));var oldVer=e.oldVersion>Math.pow(2,62)?0:e.oldVersion;// Safari 8 fix.
	runUpgraders(oldVer/10,upgradeTransaction,reject,req);}},reject);req.onsuccess=wrap(function(){// Core opening procedure complete. Now let's just record some stuff.
	upgradeTransaction=null;idbdb=req.result;connections.push(db);// Used for emulating versionchange event on IE/Edge/Safari.
	if(autoSchema)readGlobalSchema();else if(idbdb.objectStoreNames.length>0){try{adjustToExistingIndexNames(globalSchema,idbdb.transaction(safariMultiStoreFix(idbdb.objectStoreNames),READONLY));}catch(e){// Safari may bail out if > 1 store names. However, this shouldnt be a showstopper. Issue #120.
	}}idbdb.onversionchange=wrap(function(ev){db._vcFired=true;// detect implementations that not support versionchange (IE/Edge/Safari)
	db.on("versionchange").fire(ev);});if(!hasNativeGetDatabaseNames){// Update localStorage with list of database names
	globalDatabaseList(function(databaseNames){if(databaseNames.indexOf(dbName)===-1)return databaseNames.push(dbName);});}resolve();},reject);})]).then(function(){// Before finally resolving the dbReadyPromise and this promise,
	// call and await all on('ready') subscribers:
	// Dexie.vip() makes subscribers able to use the database while being opened.
	// This is a must since these subscribers take part of the opening procedure.
	return Dexie.vip(db.on.ready.fire);}).then(function(){// Resolve the db.open() with the db instance.
	isBeingOpened=false;return db;}).catch(function(err){try{// Did we fail within onupgradeneeded? Make sure to abort the upgrade transaction so it doesnt commit.
	upgradeTransaction&&upgradeTransaction.abort();}catch(e){}isBeingOpened=false;// Set before calling db.close() so that it doesnt reject openCanceller again (leads to unhandled rejection event).
	db.close();// Closes and resets idbdb, removes connections, resets dbReadyPromise and openCanceller so that a later db.open() is fresh.
	// A call to db.close() may have made on-ready subscribers fail. Use dbOpenError if set, since err could be a follow-up error on that.
	dbOpenError=err;// Record the error. It will be used to reject further promises of db operations.
	return rejection(dbOpenError,dbUncaught);// dbUncaught will make sure any error that happened in any operation before will now bubble to db.on.error() thanks to the special handling in Promise.uncaught().
	}).finally(function(){openComplete=true;resolveDbReady();// dbReadyPromise is resolved no matter if open() rejects or resolved. It's just to wake up waiters.
	});};this.close=function(){var idx=connections.indexOf(db);if(idx>=0)connections.splice(idx,1);if(idbdb){try{idbdb.close();}catch(e){}idbdb=null;}autoOpen=false;dbOpenError=new exceptions.DatabaseClosed();if(isBeingOpened)cancelOpen(dbOpenError);// Reset dbReadyPromise promise:
	dbReadyPromise=new Promise(function(resolve){dbReadyResolve=resolve;});openCanceller=new Promise(function(_,reject){cancelOpen=reject;});};this.delete=function(){var hasArguments=arguments.length>0;return new Promise(function(resolve,reject){if(hasArguments)throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");if(isBeingOpened){dbReadyPromise.then(doDelete);}else{doDelete();}function doDelete(){db.close();var req=indexedDB.deleteDatabase(dbName);req.onsuccess=wrap(function(){if(!hasNativeGetDatabaseNames){globalDatabaseList(function(databaseNames){var pos=databaseNames.indexOf(dbName);if(pos>=0)return databaseNames.splice(pos,1);});}resolve();});req.onerror=wrap(eventRejectHandler(reject));req.onblocked=fireOnBlocked;}}).uncaught(dbUncaught);};this.backendDB=function(){return idbdb;};this.isOpen=function(){return idbdb!==null;};this.hasFailed=function(){return dbOpenError!==null;};this.dynamicallyOpened=function(){return autoSchema;};//
	// Properties
	//
	this.name=dbName;// db.tables - an array of all Table instances.
	setProp(this,"tables",{get:function get(){/// <returns type="Array" elementType="WriteableTable" />
	return keys(allTables).map(function(name){return allTables[name];});}});//
	// Events
	//
	this.on=Events(this,"error","populate","blocked","versionchange",{ready:[promisableChain,nop]});this.on.error.subscribe=deprecated("Dexie.on.error",this.on.error.subscribe);this.on.error.unsubscribe=deprecated("Dexie.on.error.unsubscribe",this.on.error.unsubscribe);this.on.ready.subscribe=override(this.on.ready.subscribe,function(subscribe){return function(subscriber,bSticky){Dexie.vip(function(){if(openComplete){// Database already open. Call subscriber asap.
	if(!dbOpenError)Promise.resolve().then(subscriber);// bSticky: Also subscribe to future open sucesses (after close / reopen) 
	if(bSticky)subscribe(subscriber);}else{// Database not yet open. Subscribe to it.
	subscribe(subscriber);// If bSticky is falsy, make sure to unsubscribe subscriber when fired once.
	if(!bSticky)subscribe(function unsubscribe(){db.on.ready.unsubscribe(subscriber);db.on.ready.unsubscribe(unsubscribe);});}});};});fakeAutoComplete(function(){db.on("populate").fire(db._createTransaction(READWRITE,dbStoreNames,globalSchema));db.on("error").fire(new Error());});this.transaction=function(mode,tableInstances,scopeFunc){/// <summary>
	///
	/// </summary>
	/// <param name="mode" type="String">"r" for readonly, or "rw" for readwrite</param>
	/// <param name="tableInstances">Table instance, Array of Table instances, String or String Array of object stores to include in the transaction</param>
	/// <param name="scopeFunc" type="Function">Function to execute with transaction</param>
	// Let table arguments be all arguments between mode and last argument.
	var i=arguments.length;if(i<2)throw new exceptions.InvalidArgument("Too few arguments");// Prevent optimzation killer (https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments)
	// and clone arguments except the first one into local var 'args'.
	var args=new Array(i-1);while(--i){args[i-1]=arguments[i];}// Let scopeFunc be the last argument and pop it so that args now only contain the table arguments.
	scopeFunc=args.pop();var tables=flatten(args);// Support using array as middle argument, or a mix of arrays and non-arrays.
	var parentTransaction=PSD.trans;// Check if parent transactions is bound to this db instance, and if caller wants to reuse it
	if(!parentTransaction||parentTransaction.db!==db||mode.indexOf('!')!==-1)parentTransaction=null;var onlyIfCompatible=mode.indexOf('?')!==-1;mode=mode.replace('!','').replace('?','');// Ok. Will change arguments[0] as well but we wont touch arguments henceforth.
	try{//
	// Get storeNames from arguments. Either through given table instances, or through given table names.
	//
	var storeNames=tables.map(function(table){var storeName=table instanceof Table?table.name:table;if(typeof storeName!=='string')throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");return storeName;});//
	// Resolve mode. Allow shortcuts "r" and "rw".
	//
	if(mode=="r"||mode==READONLY)mode=READONLY;else if(mode=="rw"||mode==READWRITE)mode=READWRITE;else throw new exceptions.InvalidArgument("Invalid transaction mode: "+mode);if(parentTransaction){// Basic checks
	if(parentTransaction.mode===READONLY&&mode===READWRITE){if(onlyIfCompatible){// Spawn new transaction instead.
	parentTransaction=null;}else throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");}if(parentTransaction){storeNames.forEach(function(storeName){if(parentTransaction&&parentTransaction.storeNames.indexOf(storeName)===-1){if(onlyIfCompatible){// Spawn new transaction instead.
	parentTransaction=null;}else throw new exceptions.SubTransaction("Table "+storeName+" not included in parent transaction.");}});}}}catch(e){return parentTransaction?parentTransaction._promise(null,function(_,reject){reject(e);}):rejection(e,dbUncaught);}// If this is a sub-transaction, lock the parent and then launch the sub-transaction.
	return parentTransaction?parentTransaction._promise(mode,enterTransactionScope,"lock"):db._whenReady(enterTransactionScope);function enterTransactionScope(resolve){var parentPSD=PSD;resolve(Promise.resolve().then(function(){return newScope(function(){// Keep a pointer to last non-transactional PSD to use if someone calls Dexie.ignoreTransaction().
	PSD.transless=PSD.transless||parentPSD;// Our transaction.
	//return new Promise((resolve, reject) => {
	var trans=db._createTransaction(mode,storeNames,globalSchema,parentTransaction);// Let the transaction instance be part of a Promise-specific data (PSD) value.
	PSD.trans=trans;if(parentTransaction){// Emulate transaction commit awareness for inner transaction (must 'commit' when the inner transaction has no more operations ongoing)
	trans.idbtrans=parentTransaction.idbtrans;}else{trans.create();// Create the backend transaction so that complete() or error() will trigger even if no operation is made upon it.
	}// Provide arguments to the scope function (for backward compatibility)
	var tableArgs=storeNames.map(function(name){return allTables[name];});tableArgs.push(trans);var returnValue;return Promise.follow(function(){// Finally, call the scope function with our table and transaction arguments.
	returnValue=scopeFunc.apply(trans,tableArgs);// NOTE: returnValue is used in trans.on.complete() not as a returnValue to this func.
	if(returnValue){if(typeof returnValue.next==='function'&&typeof returnValue.throw==='function'){// scopeFunc returned an iterator with throw-support. Handle yield as await.
	returnValue=awaitIterator(returnValue);}else if(typeof returnValue.then==='function'&&!hasOwn(returnValue,'_PSD')){throw new exceptions.IncompatiblePromise("Incompatible Promise returned from transaction scope (read more at http://tinyurl.com/znyqjqc). Transaction scope: "+scopeFunc.toString());}}}).uncaught(dbUncaught).then(function(){if(parentTransaction)trans._resolve();// sub transactions don't react to idbtrans.oncomplete. We must trigger a acompletion.
	return trans._completion;// Even if WE believe everything is fine. Await IDBTransaction's oncomplete or onerror as well.
	}).then(function(){return returnValue;}).catch(function(e){//reject(e);
	trans._reject(e);// Yes, above then-handler were maybe not called because of an unhandled rejection in scopeFunc!
	return rejection(e);});//});
	});}));}};this.table=function(tableName){/// <returns type="WriteableTable"></returns>
	if(fake&&autoSchema)return new WriteableTable(tableName);if(!hasOwn(allTables,tableName)){throw new exceptions.InvalidTable('Table '+tableName+' does not exist');}return allTables[tableName];};//
	//
	//
	// Table Class
	//
	//
	//
	function Table(name,tableSchema,collClass){/// <param name="name" type="String"></param>
	this.name=name;this.schema=tableSchema;this.hook=allTables[name]?allTables[name].hook:Events(null,{"creating":[hookCreatingChain,nop],"reading":[pureFunctionChain,mirror],"updating":[hookUpdatingChain,nop],"deleting":[hookDeletingChain,nop]});this._collClass=collClass||Collection;}props(Table.prototype,{//
	// Table Protected Methods
	//
	_trans:function getTransaction(mode,fn,writeLocked){var trans=PSD.trans;return trans&&trans.db===db?trans._promise(mode,fn,writeLocked):tempTransaction(mode,[this.name],fn);},_idbstore:function getIDBObjectStore(mode,fn,writeLocked){if(fake)return new Promise(fn);// Simplify the work for Intellisense/Code completion.
	var trans=PSD.trans,tableName=this.name;function supplyIdbStore(resolve,reject,trans){fn(resolve,reject,trans.idbtrans.objectStore(tableName),trans);}return trans&&trans.db===db?trans._promise(mode,supplyIdbStore,writeLocked):tempTransaction(mode,[this.name],supplyIdbStore);},//
	// Table Public Methods
	//
	get:function get(key,cb){var self=this;return this._idbstore(READONLY,function(resolve,reject,idbstore){fake&&resolve(self.schema.instanceTemplate);var req=idbstore.get(key);req.onerror=eventRejectHandler(reject);req.onsuccess=wrap(function(){resolve(self.hook.reading.fire(req.result));},reject);}).then(cb);},where:function where(indexName){return new WhereClause(this,indexName);},count:function count(cb){return this.toCollection().count(cb);},offset:function offset(_offset){return this.toCollection().offset(_offset);},limit:function limit(numRows){return this.toCollection().limit(numRows);},reverse:function reverse(){return this.toCollection().reverse();},filter:function filter(filterFunction){return this.toCollection().and(filterFunction);},each:function each(fn){return this.toCollection().each(fn);},toArray:function toArray(cb){return this.toCollection().toArray(cb);},orderBy:function orderBy(index){return new this._collClass(new WhereClause(this,index));},toCollection:function toCollection(){return new this._collClass(new WhereClause(this));},mapToClass:function mapToClass(constructor,structure){/// <summary>
	///     Map table to a javascript constructor function. Objects returned from the database will be instances of this class, making
	///     it possible to the instanceOf operator as well as extending the class using constructor.prototype.method = function(){...}.
	/// </summary>
	/// <param name="constructor">Constructor function representing the class.</param>
	/// <param name="structure" optional="true">Helps IDE code completion by knowing the members that objects contain and not just the indexes. Also
	/// know what type each member has. Example: {name: String, emailAddresses: [String], password}</param>
	this.schema.mappedClass=constructor;var instanceTemplate=(0,_create2.default)(constructor.prototype);if(structure){// structure and instanceTemplate is for IDE code competion only while constructor.prototype is for actual inheritance.
	applyStructure(instanceTemplate,structure);}this.schema.instanceTemplate=instanceTemplate;// Now, subscribe to the when("reading") event to make all objects that come out from this table inherit from given class
	// no matter which method to use for reading (Table.get() or Table.where(...)... )
	var readHook=function readHook(obj){if(!obj)return obj;// No valid object. (Value is null). Return as is.
	// Create a new object that derives from constructor:
	var res=(0,_create2.default)(constructor.prototype);// Clone members:
	for(var m in obj){if(hasOwn(obj,m))try{res[m]=obj[m];}catch(_){}}return res;};if(this.schema.readHook){this.hook.reading.unsubscribe(this.schema.readHook);}this.schema.readHook=readHook;this.hook("reading",readHook);return constructor;},defineClass:function defineClass(structure){/// <summary>
	///     Define all members of the class that represents the table. This will help code completion of when objects are read from the database
	///     as well as making it possible to extend the prototype of the returned constructor function.
	/// </summary>
	/// <param name="structure">Helps IDE code completion by knowing the members that objects contain and not just the indexes. Also
	/// know what type each member has. Example: {name: String, emailAddresses: [String], properties: {shoeSize: Number}}</param>
	return this.mapToClass(Dexie.defineClass(structure),structure);}});//
	//
	//
	// WriteableTable Class (extends Table)
	//
	//
	//
	function WriteableTable(name,tableSchema,collClass){Table.call(this,name,tableSchema,collClass||WriteableCollection);}function BulkErrorHandlerCatchAll(errorList,done,supportHooks){return(supportHooks?hookedEventRejectHandler:eventRejectHandler)(function(e){errorList.push(e);done&&done();});}function _bulkDelete(idbstore,trans,keysOrTuples,hasDeleteHook,deletingHook){// If hasDeleteHook, keysOrTuples must be an array of tuples: [[key1, value2],[key2,value2],...],
	// else keysOrTuples must be just an array of keys: [key1, key2, ...].
	return new Promise(function(resolve,reject){var len=keysOrTuples.length,lastItem=len-1;if(len===0)return resolve();if(!hasDeleteHook){for(var i=0;i<len;++i){var req=idbstore.delete(keysOrTuples[i]);req.onerror=wrap(eventRejectHandler(reject));if(i===lastItem)req.onsuccess=wrap(function(){return resolve();});}}else{var hookCtx,errorHandler=hookedEventRejectHandler(reject),successHandler=hookedEventSuccessHandler(null);tryCatch(function(){for(var i=0;i<len;++i){hookCtx={onsuccess:null,onerror:null};var tuple=keysOrTuples[i];deletingHook.call(hookCtx,tuple[0],tuple[1],trans);var req=idbstore.delete(tuple[0]);req._hookCtx=hookCtx;req.onerror=errorHandler;if(i===lastItem)req.onsuccess=hookedEventSuccessHandler(resolve);else req.onsuccess=successHandler;}},function(err){hookCtx.onerror&&hookCtx.onerror(err);throw err;});}}).uncaught(dbUncaught);}derive(WriteableTable).from(Table).extend({bulkDelete:function bulkDelete(keys$$1){if(this.hook.deleting.fire===nop){return this._idbstore(READWRITE,function(resolve,reject,idbstore,trans){resolve(_bulkDelete(idbstore,trans,keys$$1,false,nop));});}else{return this.where(':id').anyOf(keys$$1).delete().then(function(){});// Resolve with undefined.
	}},bulkPut:function bulkPut(objects,keys$$1){var _this=this;return this._idbstore(READWRITE,function(resolve,reject,idbstore){if(!idbstore.keyPath&&!_this.schema.primKey.auto&&!keys$$1)throw new exceptions.InvalidArgument("bulkPut() with non-inbound keys requires keys array in second argument");if(idbstore.keyPath&&keys$$1)throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");if(keys$$1&&keys$$1.length!==objects.length)throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");if(objects.length===0)return resolve();// Caller provided empty list.
	var done=function done(result){if(errorList.length===0)resolve(result);else reject(new BulkError(_this.name+'.bulkPut(): '+errorList.length+' of '+numObjs+' operations failed',errorList));};var req,errorList=[],errorHandler,numObjs=objects.length,table=_this;if(_this.hook.creating.fire===nop&&_this.hook.updating.fire===nop){//
	// Standard Bulk (no 'creating' or 'updating' hooks to care about)
	//
	errorHandler=BulkErrorHandlerCatchAll(errorList);for(var i=0,l=objects.length;i<l;++i){req=keys$$1?idbstore.put(objects[i],keys$$1[i]):idbstore.put(objects[i]);req.onerror=errorHandler;}// Only need to catch success or error on the last operation
	// according to the IDB spec.
	req.onerror=BulkErrorHandlerCatchAll(errorList,done);req.onsuccess=eventSuccessHandler(done);}else{var effectiveKeys=keys$$1||idbstore.keyPath&&objects.map(function(o){return getByKeyPath(o,idbstore.keyPath);});// Generate map of {[key]: object}
	var objectLookup=effectiveKeys&&arrayToObject(effectiveKeys,function(key,i){return key!=null&&[key,objects[i]];});var promise=!effectiveKeys?// Auto-incremented key-less objects only without any keys argument.
	table.bulkAdd(objects):// Keys provided. Either as inbound in provided objects, or as a keys argument.
	// Begin with updating those that exists in DB:
	table.where(':id').anyOf(effectiveKeys.filter(function(key){return key!=null;})).modify(function(){this.value=objectLookup[this.primKey];objectLookup[this.primKey]=null;// Mark as "don't add this"
	}).catch(ModifyError,function(e){errorList=e.failures;// No need to concat here. These are the first errors added.
	}).then(function(){// Now, let's examine which items didnt exist so we can add them:
	var objsToAdd=[],keysToAdd=keys$$1&&[];// Iterate backwards. Why? Because if same key was used twice, just add the last one.
	for(var i=effectiveKeys.length-1;i>=0;--i){var key=effectiveKeys[i];if(key==null||objectLookup[key]){objsToAdd.push(objects[i]);keys$$1&&keysToAdd.push(key);if(key!=null)objectLookup[key]=null;// Mark as "dont add again"
	}}// The items are in reverse order so reverse them before adding.
	// Could be important in order to get auto-incremented keys the way the caller
	// would expect. Could have used unshift instead of push()/reverse(),
	// but: http://jsperf.com/unshift-vs-reverse
	objsToAdd.reverse();keys$$1&&keysToAdd.reverse();return table.bulkAdd(objsToAdd,keysToAdd);}).then(function(lastAddedKey){// Resolve with key of the last object in given arguments to bulkPut():
	var lastEffectiveKey=effectiveKeys[effectiveKeys.length-1];// Key was provided.
	return lastEffectiveKey!=null?lastEffectiveKey:lastAddedKey;});promise.then(done).catch(BulkError,function(e){// Concat failure from ModifyError and reject using our 'done' method.
	errorList=errorList.concat(e.failures);done();}).catch(reject);}},"locked");// If called from transaction scope, lock transaction til all steps are done.
	},bulkAdd:function bulkAdd(objects,keys$$1){var self=this,creatingHook=this.hook.creating.fire;return this._idbstore(READWRITE,function(resolve,reject,idbstore,trans){if(!idbstore.keyPath&&!self.schema.primKey.auto&&!keys$$1)throw new exceptions.InvalidArgument("bulkAdd() with non-inbound keys requires keys array in second argument");if(idbstore.keyPath&&keys$$1)throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");if(keys$$1&&keys$$1.length!==objects.length)throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");if(objects.length===0)return resolve();// Caller provided empty list.
	function done(result){if(errorList.length===0)resolve(result);else reject(new BulkError(self.name+'.bulkAdd(): '+errorList.length+' of '+numObjs+' operations failed',errorList));}var req,errorList=[],errorHandler,successHandler,numObjs=objects.length;if(creatingHook!==nop){//
	// There are subscribers to hook('creating')
	// Must behave as documented.
	//
	var keyPath=idbstore.keyPath,hookCtx;errorHandler=BulkErrorHandlerCatchAll(errorList,null,true);successHandler=hookedEventSuccessHandler(null);tryCatch(function(){for(var i=0,l=objects.length;i<l;++i){hookCtx={onerror:null,onsuccess:null};var key=keys$$1&&keys$$1[i];var obj=objects[i],effectiveKey=keys$$1?key:keyPath?getByKeyPath(obj,keyPath):undefined,keyToUse=creatingHook.call(hookCtx,effectiveKey,obj,trans);if(effectiveKey==null&&keyToUse!=null){if(keyPath){obj=deepClone(obj);setByKeyPath(obj,keyPath,keyToUse);}else{key=keyToUse;}}req=key!=null?idbstore.add(obj,key):idbstore.add(obj);req._hookCtx=hookCtx;if(i<l-1){req.onerror=errorHandler;if(hookCtx.onsuccess)req.onsuccess=successHandler;}}},function(err){hookCtx.onerror&&hookCtx.onerror(err);throw err;});req.onerror=BulkErrorHandlerCatchAll(errorList,done,true);req.onsuccess=hookedEventSuccessHandler(done);}else{//
	// Standard Bulk (no 'creating' hook to care about)
	//
	errorHandler=BulkErrorHandlerCatchAll(errorList);for(var i=0,l=objects.length;i<l;++i){req=keys$$1?idbstore.add(objects[i],keys$$1[i]):idbstore.add(objects[i]);req.onerror=errorHandler;}// Only need to catch success or error on the last operation
	// according to the IDB spec.
	req.onerror=BulkErrorHandlerCatchAll(errorList,done);req.onsuccess=eventSuccessHandler(done);}});},add:function add(obj,key){/// <summary>
	///   Add an object to the database. In case an object with same primary key already exists, the object will not be added.
	/// </summary>
	/// <param name="obj" type="Object">A javascript object to insert</param>
	/// <param name="key" optional="true">Primary key</param>
	var creatingHook=this.hook.creating.fire;return this._idbstore(READWRITE,function(resolve,reject,idbstore,trans){var hookCtx={onsuccess:null,onerror:null};if(creatingHook!==nop){var effectiveKey=key!=null?key:idbstore.keyPath?getByKeyPath(obj,idbstore.keyPath):undefined;var keyToUse=creatingHook.call(hookCtx,effectiveKey,obj,trans);// Allow subscribers to when("creating") to generate the key.
	if(effectiveKey==null&&keyToUse!=null){// Using "==" and "!=" to check for either null or undefined!
	if(idbstore.keyPath)setByKeyPath(obj,idbstore.keyPath,keyToUse);else key=keyToUse;}}try{var req=key!=null?idbstore.add(obj,key):idbstore.add(obj);req._hookCtx=hookCtx;req.onerror=hookedEventRejectHandler(reject);req.onsuccess=hookedEventSuccessHandler(function(result){// TODO: Remove these two lines in next major release (2.0?)
	// It's no good practice to have side effects on provided parameters
	var keyPath=idbstore.keyPath;if(keyPath)setByKeyPath(obj,keyPath,result);resolve(result);});}catch(e){if(hookCtx.onerror)hookCtx.onerror(e);throw e;}});},put:function put(obj,key){/// <summary>
	///   Add an object to the database but in case an object with same primary key alread exists, the existing one will get updated.
	/// </summary>
	/// <param name="obj" type="Object">A javascript object to insert or update</param>
	/// <param name="key" optional="true">Primary key</param>
	var self=this,creatingHook=this.hook.creating.fire,updatingHook=this.hook.updating.fire;if(creatingHook!==nop||updatingHook!==nop){//
	// People listens to when("creating") or when("updating") events!
	// We must know whether the put operation results in an CREATE or UPDATE.
	//
	return this._trans(READWRITE,function(resolve,reject,trans){// Since key is optional, make sure we get it from obj if not provided
	var effectiveKey=key!==undefined?key:self.schema.primKey.keyPath&&getByKeyPath(obj,self.schema.primKey.keyPath);if(effectiveKey==null){// "== null" means checking for either null or undefined.
	// No primary key. Must use add().
	self.add(obj).then(resolve,reject);}else{// Primary key exist. Lock transaction and try modifying existing. If nothing modified, call add().
	trans._lock();// Needed because operation is splitted into modify() and add().
	// clone obj before this async call. If caller modifies obj the line after put(), the IDB spec requires that it should not affect operation.
	obj=deepClone(obj);self.where(":id").equals(effectiveKey).modify(function(){// Replace extisting value with our object
	// CRUD event firing handled in WriteableCollection.modify()
	this.value=obj;}).then(function(count){if(count===0){// Object's key was not found. Add the object instead.
	// CRUD event firing will be done in add()
	return self.add(obj,key);// Resolving with another Promise. Returned Promise will then resolve with the new key.
	}else{return effectiveKey;// Resolve with the provided key.
	}}).finally(function(){trans._unlock();}).then(resolve,reject);}});}else{// Use the standard IDB put() method.
	return this._idbstore(READWRITE,function(resolve,reject,idbstore){var req=key!==undefined?idbstore.put(obj,key):idbstore.put(obj);req.onerror=eventRejectHandler(reject);req.onsuccess=function(ev){var keyPath=idbstore.keyPath;if(keyPath)setByKeyPath(obj,keyPath,ev.target.result);resolve(req.result);};});}},'delete':function _delete(key){/// <param name="key">Primary key of the object to delete</param>
	if(this.hook.deleting.subscribers.length){// People listens to when("deleting") event. Must implement delete using WriteableCollection.delete() that will
	// call the CRUD event. Only WriteableCollection.delete() will know whether an object was actually deleted.
	return this.where(":id").equals(key).delete();}else{// No one listens. Use standard IDB delete() method.
	return this._idbstore(READWRITE,function(resolve,reject,idbstore){var req=idbstore.delete(key);req.onerror=eventRejectHandler(reject);req.onsuccess=function(){resolve(req.result);};});}},clear:function clear(){if(this.hook.deleting.subscribers.length){// People listens to when("deleting") event. Must implement delete using WriteableCollection.delete() that will
	// call the CRUD event. Only WriteableCollection.delete() will knows which objects that are actually deleted.
	return this.toCollection().delete();}else{return this._idbstore(READWRITE,function(resolve,reject,idbstore){var req=idbstore.clear();req.onerror=eventRejectHandler(reject);req.onsuccess=function(){resolve(req.result);};});}},update:function update(keyOrObject,modifications){if((typeof modifications==='undefined'?'undefined':(0,_typeof3.default)(modifications))!=='object'||isArray(modifications))throw new exceptions.InvalidArgument("Modifications must be an object.");if((typeof keyOrObject==='undefined'?'undefined':(0,_typeof3.default)(keyOrObject))==='object'&&!isArray(keyOrObject)){// object to modify. Also modify given object with the modifications:
	keys(modifications).forEach(function(keyPath){setByKeyPath(keyOrObject,keyPath,modifications[keyPath]);});var key=getByKeyPath(keyOrObject,this.schema.primKey.keyPath);if(key===undefined)return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"),dbUncaught);return this.where(":id").equals(key).modify(modifications);}else{// key to modify
	return this.where(":id").equals(keyOrObject).modify(modifications);}}});//
	//
	//
	// Transaction Class
	//
	//
	//
	function Transaction(mode,storeNames,dbschema,parent){var _this2=this;/// <summary>
	///    Transaction class. Represents a database transaction. All operations on db goes through a Transaction.
	/// </summary>
	/// <param name="mode" type="String">Any of "readwrite" or "readonly"</param>
	/// <param name="storeNames" type="Array">Array of table names to operate on</param>
	this.db=db;this.mode=mode;this.storeNames=storeNames;this.idbtrans=null;this.on=Events(this,"complete","error","abort");this.parent=parent||null;this.active=true;this._tables=null;this._reculock=0;this._blockedFuncs=[];this._psd=null;this._dbschema=dbschema;this._resolve=null;this._reject=null;this._completion=new Promise(function(resolve,reject){_this2._resolve=resolve;_this2._reject=reject;}).uncaught(dbUncaught);this._completion.then(function(){_this2.on.complete.fire();},function(e){_this2.on.error.fire(e);_this2.parent?_this2.parent._reject(e):_this2.active&&_this2.idbtrans&&_this2.idbtrans.abort();_this2.active=false;return rejection(e);// Indicate we actually DO NOT catch this error.
	});}props(Transaction.prototype,{//
	// Transaction Protected Methods (not required by API users, but needed internally and eventually by dexie extensions)
	//
	_lock:function _lock(){assert(!PSD.global);// Locking and unlocking reuires to be within a PSD scope.
	// Temporary set all requests into a pending queue if they are called before database is ready.
	++this._reculock;// Recursive read/write lock pattern using PSD (Promise Specific Data) instead of TLS (Thread Local Storage)
	if(this._reculock===1&&!PSD.global)PSD.lockOwnerFor=this;return this;},_unlock:function _unlock(){assert(!PSD.global);// Locking and unlocking reuires to be within a PSD scope.
	if(--this._reculock===0){if(!PSD.global)PSD.lockOwnerFor=null;while(this._blockedFuncs.length>0&&!this._locked()){var fn=this._blockedFuncs.shift();try{fn();}catch(e){}}}return this;},_locked:function _locked(){// Checks if any write-lock is applied on this transaction.
	// To simplify the Dexie API for extension implementations, we support recursive locks.
	// This is accomplished by using "Promise Specific Data" (PSD).
	// PSD data is bound to a Promise and any child Promise emitted through then() or resolve( new Promise() ).
	// PSD is local to code executing on top of the call stacks of any of any code executed by Promise():
	//         * callback given to the Promise() constructor  (function (resolve, reject){...})
	//         * callbacks given to then()/catch()/finally() methods (function (value){...})
	// If creating a new independant Promise instance from within a Promise call stack, the new Promise will derive the PSD from the call stack of the parent Promise.
	// Derivation is done so that the inner PSD __proto__ points to the outer PSD.
	// PSD.lockOwnerFor will point to current transaction object if the currently executing PSD scope owns the lock.
	return this._reculock&&PSD.lockOwnerFor!==this;},create:function create(idbtrans){var _this3=this;assert(!this.idbtrans);if(!idbtrans&&!idbdb){switch(dbOpenError&&dbOpenError.name){case"DatabaseClosedError":// Errors where it is no difference whether it was caused by the user operation or an earlier call to db.open()
	throw new exceptions.DatabaseClosed(dbOpenError);case"MissingAPIError":// Errors where it is no difference whether it was caused by the user operation or an earlier call to db.open()
	throw new exceptions.MissingAPI(dbOpenError.message,dbOpenError);default:// Make it clear that the user operation was not what caused the error - the error had occurred earlier on db.open()!
	throw new exceptions.OpenFailed(dbOpenError);}}if(!this.active)throw new exceptions.TransactionInactive();assert(this._completion._state===null);idbtrans=this.idbtrans=idbtrans||idbdb.transaction(safariMultiStoreFix(this.storeNames),this.mode);idbtrans.onerror=wrap(function(ev){preventDefault(ev);// Prohibit default bubbling to window.error
	_this3._reject(idbtrans.error);});idbtrans.onabort=wrap(function(ev){preventDefault(ev);_this3.active&&_this3._reject(new exceptions.Abort());_this3.active=false;_this3.on("abort").fire(ev);});idbtrans.oncomplete=wrap(function(){_this3.active=false;_this3._resolve();});return this;},_promise:function _promise(mode,fn,bWriteLock){var self=this;return newScope(function(){var p;// Read lock always
	if(!self._locked()){p=self.active?new Promise(function(resolve,reject){if(mode===READWRITE&&self.mode!==READWRITE)throw new exceptions.ReadOnly("Transaction is readonly");if(!self.idbtrans&&mode)self.create();if(bWriteLock)self._lock();// Write lock if write operation is requested
	fn(resolve,reject,self);}):rejection(new exceptions.TransactionInactive());if(self.active&&bWriteLock)p.finally(function(){self._unlock();});}else{// Transaction is write-locked. Wait for mutex.
	p=new Promise(function(resolve,reject){self._blockedFuncs.push(function(){self._promise(mode,fn,bWriteLock).then(resolve,reject);});});}p._lib=true;return p.uncaught(dbUncaught);});},//
	// Transaction Public Properties and Methods
	//
	abort:function abort(){this.active&&this._reject(new exceptions.Abort());this.active=false;},tables:{get:deprecated("Transaction.tables",function(){return arrayToObject(this.storeNames,function(name){return[name,allTables[name]];});},"Use db.tables()")},complete:deprecated("Transaction.complete()",function(cb){return this.on("complete",cb);}),error:deprecated("Transaction.error()",function(cb){return this.on("error",cb);}),table:deprecated("Transaction.table()",function(name){if(this.storeNames.indexOf(name)===-1)throw new exceptions.InvalidTable("Table "+name+" not in transaction");return allTables[name];})});//
	//
	//
	// WhereClause
	//
	//
	//
	function WhereClause(table,index,orCollection){/// <param name="table" type="Table"></param>
	/// <param name="index" type="String" optional="true"></param>
	/// <param name="orCollection" type="Collection" optional="true"></param>
	this._ctx={table:table,index:index===":id"?null:index,collClass:table._collClass,or:orCollection};}props(WhereClause.prototype,function(){// WhereClause private methods
	function fail(collectionOrWhereClause,err,T){var collection=collectionOrWhereClause instanceof WhereClause?new collectionOrWhereClause._ctx.collClass(collectionOrWhereClause):collectionOrWhereClause;collection._ctx.error=T?new T(err):new TypeError(err);return collection;}function emptyCollection(whereClause){return new whereClause._ctx.collClass(whereClause,function(){return IDBKeyRange.only("");}).limit(0);}function upperFactory(dir){return dir==="next"?function(s){return s.toUpperCase();}:function(s){return s.toLowerCase();};}function lowerFactory(dir){return dir==="next"?function(s){return s.toLowerCase();}:function(s){return s.toUpperCase();};}function nextCasing(key,lowerKey,upperNeedle,lowerNeedle,cmp,dir){var length=Math.min(key.length,lowerNeedle.length);var llp=-1;for(var i=0;i<length;++i){var lwrKeyChar=lowerKey[i];if(lwrKeyChar!==lowerNeedle[i]){if(cmp(key[i],upperNeedle[i])<0)return key.substr(0,i)+upperNeedle[i]+upperNeedle.substr(i+1);if(cmp(key[i],lowerNeedle[i])<0)return key.substr(0,i)+lowerNeedle[i]+upperNeedle.substr(i+1);if(llp>=0)return key.substr(0,llp)+lowerKey[llp]+upperNeedle.substr(llp+1);return null;}if(cmp(key[i],lwrKeyChar)<0)llp=i;}if(length<lowerNeedle.length&&dir==="next")return key+upperNeedle.substr(key.length);if(length<key.length&&dir==="prev")return key.substr(0,upperNeedle.length);return llp<0?null:key.substr(0,llp)+lowerNeedle[llp]+upperNeedle.substr(llp+1);}function addIgnoreCaseAlgorithm(whereClause,match,needles,suffix){/// <param name="needles" type="Array" elementType="String"></param>
	var upper,lower,compare,upperNeedles,lowerNeedles,direction,nextKeySuffix,needlesLen=needles.length;if(!needles.every(function(s){return typeof s==='string';})){return fail(whereClause,STRING_EXPECTED);}function initDirection(dir){upper=upperFactory(dir);lower=lowerFactory(dir);compare=dir==="next"?simpleCompare:simpleCompareReverse;var needleBounds=needles.map(function(needle){return{lower:lower(needle),upper:upper(needle)};}).sort(function(a,b){return compare(a.lower,b.lower);});upperNeedles=needleBounds.map(function(nb){return nb.upper;});lowerNeedles=needleBounds.map(function(nb){return nb.lower;});direction=dir;nextKeySuffix=dir==="next"?"":suffix;}initDirection("next");var c=new whereClause._ctx.collClass(whereClause,function(){return IDBKeyRange.bound(upperNeedles[0],lowerNeedles[needlesLen-1]+suffix);});c._ondirectionchange=function(direction){// This event onlys occur before filter is called the first time.
	initDirection(direction);};var firstPossibleNeedle=0;c._addAlgorithm(function(cursor,advance,resolve){/// <param name="cursor" type="IDBCursor"></param>
	/// <param name="advance" type="Function"></param>
	/// <param name="resolve" type="Function"></param>
	var key=cursor.key;if(typeof key!=='string')return false;var lowerKey=lower(key);if(match(lowerKey,lowerNeedles,firstPossibleNeedle)){return true;}else{var lowestPossibleCasing=null;for(var i=firstPossibleNeedle;i<needlesLen;++i){var casing=nextCasing(key,lowerKey,upperNeedles[i],lowerNeedles[i],compare,direction);if(casing===null&&lowestPossibleCasing===null)firstPossibleNeedle=i+1;else if(lowestPossibleCasing===null||compare(lowestPossibleCasing,casing)>0){lowestPossibleCasing=casing;}}if(lowestPossibleCasing!==null){advance(function(){cursor.continue(lowestPossibleCasing+nextKeySuffix);});}else{advance(resolve);}return false;}});return c;}//
	// WhereClause public methods
	//
	return{between:function between(lower,upper,includeLower,includeUpper){/// <summary>
	///     Filter out records whose where-field lays between given lower and upper values. Applies to Strings, Numbers and Dates.
	/// </summary>
	/// <param name="lower"></param>
	/// <param name="upper"></param>
	/// <param name="includeLower" optional="true">Whether items that equals lower should be included. Default true.</param>
	/// <param name="includeUpper" optional="true">Whether items that equals upper should be included. Default false.</param>
	/// <returns type="Collection"></returns>
	includeLower=includeLower!==false;// Default to true
	includeUpper=includeUpper===true;// Default to false
	try{if(cmp(lower,upper)>0||cmp(lower,upper)===0&&(includeLower||includeUpper)&&!(includeLower&&includeUpper))return emptyCollection(this);// Workaround for idiotic W3C Specification that DataError must be thrown if lower > upper. The natural result would be to return an empty collection.
	return new this._ctx.collClass(this,function(){return IDBKeyRange.bound(lower,upper,!includeLower,!includeUpper);});}catch(e){return fail(this,INVALID_KEY_ARGUMENT);}},equals:function equals(value){return new this._ctx.collClass(this,function(){return IDBKeyRange.only(value);});},above:function above(value){return new this._ctx.collClass(this,function(){return IDBKeyRange.lowerBound(value,true);});},aboveOrEqual:function aboveOrEqual(value){return new this._ctx.collClass(this,function(){return IDBKeyRange.lowerBound(value);});},below:function below(value){return new this._ctx.collClass(this,function(){return IDBKeyRange.upperBound(value,true);});},belowOrEqual:function belowOrEqual(value){return new this._ctx.collClass(this,function(){return IDBKeyRange.upperBound(value);});},startsWith:function startsWith(str){/// <param name="str" type="String"></param>
	if(typeof str!=='string')return fail(this,STRING_EXPECTED);return this.between(str,str+maxString,true,true);},startsWithIgnoreCase:function startsWithIgnoreCase(str){/// <param name="str" type="String"></param>
	if(str==="")return this.startsWith(str);return addIgnoreCaseAlgorithm(this,function(x,a){return x.indexOf(a[0])===0;},[str],maxString);},equalsIgnoreCase:function equalsIgnoreCase(str){/// <param name="str" type="String"></param>
	return addIgnoreCaseAlgorithm(this,function(x,a){return x===a[0];},[str],"");},anyOfIgnoreCase:function anyOfIgnoreCase(){var set=getArrayOf.apply(NO_CHAR_ARRAY,arguments);if(set.length===0)return emptyCollection(this);return addIgnoreCaseAlgorithm(this,function(x,a){return a.indexOf(x)!==-1;},set,"");},startsWithAnyOfIgnoreCase:function startsWithAnyOfIgnoreCase(){var set=getArrayOf.apply(NO_CHAR_ARRAY,arguments);if(set.length===0)return emptyCollection(this);return addIgnoreCaseAlgorithm(this,function(x,a){return a.some(function(n){return x.indexOf(n)===0;});},set,maxString);},anyOf:function anyOf(){var set=getArrayOf.apply(NO_CHAR_ARRAY,arguments);var compare=ascending;try{set.sort(compare);}catch(e){return fail(this,INVALID_KEY_ARGUMENT);}if(set.length===0)return emptyCollection(this);var c=new this._ctx.collClass(this,function(){return IDBKeyRange.bound(set[0],set[set.length-1]);});c._ondirectionchange=function(direction){compare=direction==="next"?ascending:descending;set.sort(compare);};var i=0;c._addAlgorithm(function(cursor,advance,resolve){var key=cursor.key;while(compare(key,set[i])>0){// The cursor has passed beyond this key. Check next.
	++i;if(i===set.length){// There is no next. Stop searching.
	advance(resolve);return false;}}if(compare(key,set[i])===0){// The current cursor value should be included and we should continue a single step in case next item has the same key or possibly our next key in set.
	return true;}else{// cursor.key not yet at set[i]. Forward cursor to the next key to hunt for.
	advance(function(){cursor.continue(set[i]);});return false;}});return c;},notEqual:function notEqual(value){return this.inAnyRange([[-Infinity,value],[value,maxKey]],{includeLowers:false,includeUppers:false});},noneOf:function noneOf(){var set=getArrayOf.apply(NO_CHAR_ARRAY,arguments);if(set.length===0)return new this._ctx.collClass(this);// Return entire collection.
	try{set.sort(ascending);}catch(e){return fail(this,INVALID_KEY_ARGUMENT);}// Transform ["a","b","c"] to a set of ranges for between/above/below: [[-Infinity,"a"], ["a","b"], ["b","c"], ["c",maxKey]]
	var ranges=set.reduce(function(res,val){return res?res.concat([[res[res.length-1][1],val]]):[[-Infinity,val]];},null);ranges.push([set[set.length-1],maxKey]);return this.inAnyRange(ranges,{includeLowers:false,includeUppers:false});},/** Filter out values withing given set of ranges.
	            * Example, give children and elders a rebate of 50%:
	            *
	            *   db.friends.where('age').inAnyRange([[0,18],[65,Infinity]]).modify({Rebate: 1/2});
	            *
	            * @param {(string|number|Date|Array)[][]} ranges
	            * @param {{includeLowers: boolean, includeUppers: boolean}} options
	            */inAnyRange:function inAnyRange(ranges,options){var ctx=this._ctx;if(ranges.length===0)return emptyCollection(this);if(!ranges.every(function(range){return range[0]!==undefined&&range[1]!==undefined&&ascending(range[0],range[1])<=0;})){return fail(this,"First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower",exceptions.InvalidArgument);}var includeLowers=!options||options.includeLowers!==false;// Default to true
	var includeUppers=options&&options.includeUppers===true;// Default to false
	function addRange(ranges,newRange){for(var i=0,l=ranges.length;i<l;++i){var range=ranges[i];if(cmp(newRange[0],range[1])<0&&cmp(newRange[1],range[0])>0){range[0]=min(range[0],newRange[0]);range[1]=max(range[1],newRange[1]);break;}}if(i===l)ranges.push(newRange);return ranges;}var sortDirection=ascending;function rangeSorter(a,b){return sortDirection(a[0],b[0]);}// Join overlapping ranges
	var set;try{set=ranges.reduce(addRange,[]);set.sort(rangeSorter);}catch(ex){return fail(this,INVALID_KEY_ARGUMENT);}var i=0;var keyIsBeyondCurrentEntry=includeUppers?function(key){return ascending(key,set[i][1])>0;}:function(key){return ascending(key,set[i][1])>=0;};var keyIsBeforeCurrentEntry=includeLowers?function(key){return descending(key,set[i][0])>0;}:function(key){return descending(key,set[i][0])>=0;};function keyWithinCurrentRange(key){return!keyIsBeyondCurrentEntry(key)&&!keyIsBeforeCurrentEntry(key);}var checkKey=keyIsBeyondCurrentEntry;var c=new ctx.collClass(this,function(){return IDBKeyRange.bound(set[0][0],set[set.length-1][1],!includeLowers,!includeUppers);});c._ondirectionchange=function(direction){if(direction==="next"){checkKey=keyIsBeyondCurrentEntry;sortDirection=ascending;}else{checkKey=keyIsBeforeCurrentEntry;sortDirection=descending;}set.sort(rangeSorter);};c._addAlgorithm(function(cursor,advance,resolve){var key=cursor.key;while(checkKey(key)){// The cursor has passed beyond this key. Check next.
	++i;if(i===set.length){// There is no next. Stop searching.
	advance(resolve);return false;}}if(keyWithinCurrentRange(key)){// The current cursor value should be included and we should continue a single step in case next item has the same key or possibly our next key in set.
	return true;}else if(cmp(key,set[i][1])===0||cmp(key,set[i][0])===0){// includeUpper or includeLower is false so keyWithinCurrentRange() returns false even though we are at range border.
	// Continue to next key but don't include this one.
	return false;}else{// cursor.key not yet at set[i]. Forward cursor to the next key to hunt for.
	advance(function(){if(sortDirection===ascending)cursor.continue(set[i][0]);else cursor.continue(set[i][1]);});return false;}});return c;},startsWithAnyOf:function startsWithAnyOf(){var set=getArrayOf.apply(NO_CHAR_ARRAY,arguments);if(!set.every(function(s){return typeof s==='string';})){return fail(this,"startsWithAnyOf() only works with strings");}if(set.length===0)return emptyCollection(this);return this.inAnyRange(set.map(function(str){return[str,str+maxString];}));}};});//
	//
	//
	// Collection Class
	//
	//
	//
	function Collection(whereClause,keyRangeGenerator){/// <summary>
	///
	/// </summary>
	/// <param name="whereClause" type="WhereClause">Where clause instance</param>
	/// <param name="keyRangeGenerator" value="function(){ return IDBKeyRange.bound(0,1);}" optional="true"></param>
	var keyRange=null,error=null;if(keyRangeGenerator)try{keyRange=keyRangeGenerator();}catch(ex){error=ex;}var whereCtx=whereClause._ctx,table=whereCtx.table;this._ctx={table:table,index:whereCtx.index,isPrimKey:!whereCtx.index||table.schema.primKey.keyPath&&whereCtx.index===table.schema.primKey.name,range:keyRange,keysOnly:false,dir:"next",unique:"",algorithm:null,filter:null,replayFilter:null,justLimit:true,// True if a replayFilter is just a filter that performs a "limit" operation (or none at all)
	isMatch:null,offset:0,limit:Infinity,error:error,// If set, any promise must be rejected with this error
	or:whereCtx.or,valueMapper:table.hook.reading.fire};}function isPlainKeyRange(ctx,ignoreLimitFilter){return!(ctx.filter||ctx.algorithm||ctx.or)&&(ignoreLimitFilter?ctx.justLimit:!ctx.replayFilter);}props(Collection.prototype,function(){//
	// Collection Private Functions
	//
	function addFilter(ctx,fn){ctx.filter=combine(ctx.filter,fn);}function addReplayFilter(ctx,factory,isLimitFilter){var curr=ctx.replayFilter;ctx.replayFilter=curr?function(){return combine(curr(),factory());}:factory;ctx.justLimit=isLimitFilter&&!curr;}function addMatchFilter(ctx,fn){ctx.isMatch=combine(ctx.isMatch,fn);}/** @param ctx {
	         *      isPrimKey: boolean,
	         *      table: Table,
	         *      index: string
	         * }
	         * @param store IDBObjectStore
	         **/function getIndexOrStore(ctx,store){if(ctx.isPrimKey)return store;var indexSpec=ctx.table.schema.idxByName[ctx.index];if(!indexSpec)throw new exceptions.Schema("KeyPath "+ctx.index+" on object store "+store.name+" is not indexed");return store.index(indexSpec.name);}/** @param ctx {
	         *      isPrimKey: boolean,
	         *      table: Table,
	         *      index: string,
	         *      keysOnly: boolean,
	         *      range?: IDBKeyRange,
	         *      dir: "next" | "prev"
	         * }
	         */function openCursor(ctx,store){var idxOrStore=getIndexOrStore(ctx,store);return ctx.keysOnly&&'openKeyCursor'in idxOrStore?idxOrStore.openKeyCursor(ctx.range||null,ctx.dir+ctx.unique):idxOrStore.openCursor(ctx.range||null,ctx.dir+ctx.unique);}function iter(ctx,fn,resolve,reject,idbstore){var filter=ctx.replayFilter?combine(ctx.filter,ctx.replayFilter()):ctx.filter;if(!ctx.or){iterate(openCursor(ctx,idbstore),combine(ctx.algorithm,filter),fn,resolve,reject,!ctx.keysOnly&&ctx.valueMapper);}else(function(){var set={};var resolved=0;function resolveboth(){if(++resolved===2)resolve();// Seems like we just support or btwn max 2 expressions, but there are no limit because we do recursion.
	}function union(item,cursor,advance){if(!filter||filter(cursor,advance,resolveboth,reject)){var key=cursor.primaryKey.toString();// Converts any Date to String, String to String, Number to String and Array to comma-separated string
	if(!hasOwn(set,key)){set[key]=true;fn(item,cursor,advance);}}}ctx.or._iterate(union,resolveboth,reject,idbstore);iterate(openCursor(ctx,idbstore),ctx.algorithm,union,resolveboth,reject,!ctx.keysOnly&&ctx.valueMapper);})();}function getInstanceTemplate(ctx){return ctx.table.schema.instanceTemplate;}return{//
	// Collection Protected Functions
	//
	_read:function _read(fn,cb){var ctx=this._ctx;if(ctx.error)return ctx.table._trans(null,function rejector(resolve,reject){reject(ctx.error);});else return ctx.table._idbstore(READONLY,fn).then(cb);},_write:function _write(fn){var ctx=this._ctx;if(ctx.error)return ctx.table._trans(null,function rejector(resolve,reject){reject(ctx.error);});else return ctx.table._idbstore(READWRITE,fn,"locked");// When doing write operations on collections, always lock the operation so that upcoming operations gets queued.
	},_addAlgorithm:function _addAlgorithm(fn){var ctx=this._ctx;ctx.algorithm=combine(ctx.algorithm,fn);},_iterate:function _iterate(fn,resolve,reject,idbstore){return iter(this._ctx,fn,resolve,reject,idbstore);},clone:function clone(props$$1){var rv=(0,_create2.default)(this.constructor.prototype),ctx=(0,_create2.default)(this._ctx);if(props$$1)extend(ctx,props$$1);rv._ctx=ctx;return rv;},raw:function raw(){this._ctx.valueMapper=null;return this;},//
	// Collection Public methods
	//
	each:function each(fn){var ctx=this._ctx;if(fake){var item=getInstanceTemplate(ctx),primKeyPath=ctx.table.schema.primKey.keyPath,key=getByKeyPath(item,ctx.index?ctx.table.schema.idxByName[ctx.index].keyPath:primKeyPath),primaryKey=getByKeyPath(item,primKeyPath);fn(item,{key:key,primaryKey:primaryKey});}return this._read(function(resolve,reject,idbstore){iter(ctx,fn,resolve,reject,idbstore);});},count:function count(cb){if(fake)return Promise.resolve(0).then(cb);var ctx=this._ctx;if(isPlainKeyRange(ctx,true)){// This is a plain key range. We can use the count() method if the index.
	return this._read(function(resolve,reject,idbstore){var idx=getIndexOrStore(ctx,idbstore);var req=ctx.range?idx.count(ctx.range):idx.count();req.onerror=eventRejectHandler(reject);req.onsuccess=function(e){resolve(Math.min(e.target.result,ctx.limit));};},cb);}else{// Algorithms, filters or expressions are applied. Need to count manually.
	var count=0;return this._read(function(resolve,reject,idbstore){iter(ctx,function(){++count;return false;},function(){resolve(count);},reject,idbstore);},cb);}},sortBy:function sortBy(keyPath,cb){/// <param name="keyPath" type="String"></param>
	var parts=keyPath.split('.').reverse(),lastPart=parts[0],lastIndex=parts.length-1;function getval(obj,i){if(i)return getval(obj[parts[i]],i-1);return obj[lastPart];}var order=this._ctx.dir==="next"?1:-1;function sorter(a,b){var aVal=getval(a,lastIndex),bVal=getval(b,lastIndex);return aVal<bVal?-order:aVal>bVal?order:0;}return this.toArray(function(a){return a.sort(sorter);}).then(cb);},toArray:function toArray(cb){var ctx=this._ctx;return this._read(function(resolve,reject,idbstore){fake&&resolve([getInstanceTemplate(ctx)]);if(hasGetAll&&ctx.dir==='next'&&isPlainKeyRange(ctx,true)&&ctx.limit>0){// Special optimation if we could use IDBObjectStore.getAll() or
	// IDBKeyRange.getAll():
	var readingHook=ctx.table.hook.reading.fire;var idxOrStore=getIndexOrStore(ctx,idbstore);var req=ctx.limit<Infinity?idxOrStore.getAll(ctx.range,ctx.limit):idxOrStore.getAll(ctx.range);req.onerror=eventRejectHandler(reject);req.onsuccess=readingHook===mirror?eventSuccessHandler(resolve):wrap(eventSuccessHandler(function(res){try{resolve(res.map(readingHook));}catch(e){reject(e);}}));}else{// Getting array through a cursor.
	var a=[];iter(ctx,function(item){a.push(item);},function arrayComplete(){resolve(a);},reject,idbstore);}},cb);},offset:function offset(_offset2){var ctx=this._ctx;if(_offset2<=0)return this;ctx.offset+=_offset2;// For count()
	if(isPlainKeyRange(ctx)){addReplayFilter(ctx,function(){var offsetLeft=_offset2;return function(cursor,advance){if(offsetLeft===0)return true;if(offsetLeft===1){--offsetLeft;return false;}advance(function(){cursor.advance(offsetLeft);offsetLeft=0;});return false;};});}else{addReplayFilter(ctx,function(){var offsetLeft=_offset2;return function(){return--offsetLeft<0;};});}return this;},limit:function limit(numRows){this._ctx.limit=Math.min(this._ctx.limit,numRows);// For count()
	addReplayFilter(this._ctx,function(){var rowsLeft=numRows;return function(cursor,advance,resolve){if(--rowsLeft<=0)advance(resolve);// Stop after this item has been included
	return rowsLeft>=0;// If numRows is already below 0, return false because then 0 was passed to numRows initially. Otherwise we wouldnt come here.
	};},true);return this;},until:function until(filterFunction,bIncludeStopEntry){var ctx=this._ctx;fake&&filterFunction(getInstanceTemplate(ctx));addFilter(this._ctx,function(cursor,advance,resolve){if(filterFunction(cursor.value)){advance(resolve);return bIncludeStopEntry;}else{return true;}});return this;},first:function first(cb){return this.limit(1).toArray(function(a){return a[0];}).then(cb);},last:function last(cb){return this.reverse().first(cb);},filter:function filter(filterFunction){/// <param name="jsFunctionFilter" type="Function">function(val){return true/false}</param>
	fake&&filterFunction(getInstanceTemplate(this._ctx));addFilter(this._ctx,function(cursor){return filterFunction(cursor.value);});// match filters not used in Dexie.js but can be used by 3rd part libraries to test a
	// collection for a match without querying DB. Used by Dexie.Observable.
	addMatchFilter(this._ctx,filterFunction);return this;},and:function and(filterFunction){return this.filter(filterFunction);},or:function or(indexName){return new WhereClause(this._ctx.table,indexName,this);},reverse:function reverse(){this._ctx.dir=this._ctx.dir==="prev"?"next":"prev";if(this._ondirectionchange)this._ondirectionchange(this._ctx.dir);return this;},desc:function desc(){return this.reverse();},eachKey:function eachKey(cb){var ctx=this._ctx;ctx.keysOnly=!ctx.isMatch;return this.each(function(val,cursor){cb(cursor.key,cursor);});},eachUniqueKey:function eachUniqueKey(cb){this._ctx.unique="unique";return this.eachKey(cb);},eachPrimaryKey:function eachPrimaryKey(cb){var ctx=this._ctx;ctx.keysOnly=!ctx.isMatch;return this.each(function(val,cursor){cb(cursor.primaryKey,cursor);});},keys:function keys(cb){var ctx=this._ctx;ctx.keysOnly=!ctx.isMatch;var a=[];return this.each(function(item,cursor){a.push(cursor.key);}).then(function(){return a;}).then(cb);},primaryKeys:function primaryKeys(cb){var ctx=this._ctx;if(hasGetAll&&ctx.dir==='next'&&isPlainKeyRange(ctx,true)&&ctx.limit>0){// Special optimation if we could use IDBObjectStore.getAllKeys() or
	// IDBKeyRange.getAllKeys():
	return this._read(function(resolve,reject,idbstore){var idxOrStore=getIndexOrStore(ctx,idbstore);var req=ctx.limit<Infinity?idxOrStore.getAllKeys(ctx.range,ctx.limit):idxOrStore.getAllKeys(ctx.range);req.onerror=eventRejectHandler(reject);req.onsuccess=eventSuccessHandler(resolve);}).then(cb);}ctx.keysOnly=!ctx.isMatch;var a=[];return this.each(function(item,cursor){a.push(cursor.primaryKey);}).then(function(){return a;}).then(cb);},uniqueKeys:function uniqueKeys(cb){this._ctx.unique="unique";return this.keys(cb);},firstKey:function firstKey(cb){return this.limit(1).keys(function(a){return a[0];}).then(cb);},lastKey:function lastKey(cb){return this.reverse().firstKey(cb);},distinct:function distinct(){var ctx=this._ctx,idx=ctx.index&&ctx.table.schema.idxByName[ctx.index];if(!idx||!idx.multi)return this;// distinct() only makes differencies on multiEntry indexes.
	var set={};addFilter(this._ctx,function(cursor){var strKey=cursor.primaryKey.toString();// Converts any Date to String, String to String, Number to String and Array to comma-separated string
	var found=hasOwn(set,strKey);set[strKey]=true;return!found;});return this;}};});//
	//
	// WriteableCollection Class
	//
	//
	function WriteableCollection(){Collection.apply(this,arguments);}derive(WriteableCollection).from(Collection).extend({//
	// WriteableCollection Public Methods
	//
	modify:function modify(changes){var self=this,ctx=this._ctx,hook=ctx.table.hook,updatingHook=hook.updating.fire,deletingHook=hook.deleting.fire;fake&&typeof changes==='function'&&changes.call({value:ctx.table.schema.instanceTemplate},ctx.table.schema.instanceTemplate);return this._write(function(resolve,reject,idbstore,trans){var modifyer;if(typeof changes==='function'){// Changes is a function that may update, add or delete propterties or even require a deletion the object itself (delete this.item)
	if(updatingHook===nop&&deletingHook===nop){// Noone cares about what is being changed. Just let the modifier function be the given argument as is.
	modifyer=changes;}else{// People want to know exactly what is being modified or deleted.
	// Let modifyer be a proxy function that finds out what changes the caller is actually doing
	// and call the hooks accordingly!
	modifyer=function modifyer(item){var origItem=deepClone(item);// Clone the item first so we can compare laters.
	if(changes.call(this,item,this)===false)return false;// Call the real modifyer function (If it returns false explicitely, it means it dont want to modify anyting on this object)
	if(!hasOwn(this,"value")){// The real modifyer function requests a deletion of the object. Inform the deletingHook that a deletion is taking place.
	deletingHook.call(this,this.primKey,item,trans);}else{// No deletion. Check what was changed
	var objectDiff=getObjectDiff(origItem,this.value);var additionalChanges=updatingHook.call(this,objectDiff,this.primKey,origItem,trans);if(additionalChanges){// Hook want to apply additional modifications. Make sure to fullfill the will of the hook.
	item=this.value;keys(additionalChanges).forEach(function(keyPath){setByKeyPath(item,keyPath,additionalChanges[keyPath]);// Adding {keyPath: undefined} means that the keyPath should be deleted. Handled by setByKeyPath
	});}}};}}else if(updatingHook===nop){// changes is a set of {keyPath: value} and no one is listening to the updating hook.
	var keyPaths=keys(changes);var numKeys=keyPaths.length;modifyer=function modifyer(item){var anythingModified=false;for(var i=0;i<numKeys;++i){var keyPath=keyPaths[i],val=changes[keyPath];if(getByKeyPath(item,keyPath)!==val){setByKeyPath(item,keyPath,val);// Adding {keyPath: undefined} means that the keyPath should be deleted. Handled by setByKeyPath
	anythingModified=true;}}return anythingModified;};}else{// changes is a set of {keyPath: value} and people are listening to the updating hook so we need to call it and
	// allow it to add additional modifications to make.
	var origChanges=changes;changes=shallowClone(origChanges);// Let's work with a clone of the changes keyPath/value set so that we can restore it in case a hook extends it.
	modifyer=function modifyer(item){var anythingModified=false;var additionalChanges=updatingHook.call(this,changes,this.primKey,deepClone(item),trans);if(additionalChanges)extend(changes,additionalChanges);keys(changes).forEach(function(keyPath){var val=changes[keyPath];if(getByKeyPath(item,keyPath)!==val){setByKeyPath(item,keyPath,val);anythingModified=true;}});if(additionalChanges)changes=shallowClone(origChanges);// Restore original changes for next iteration
	return anythingModified;};}var count=0;var successCount=0;var iterationComplete=false;var failures=[];var failKeys=[];var currentKey=null;function modifyItem(item,cursor){currentKey=cursor.primaryKey;var thisContext={primKey:cursor.primaryKey,value:item,onsuccess:null,onerror:null};function onerror(e){failures.push(e);failKeys.push(thisContext.primKey);checkFinished();return true;// Catch these errors and let a final rejection decide whether or not to abort entire transaction
	}if(modifyer.call(thisContext,item,thisContext)!==false){// If a callback explicitely returns false, do not perform the update!
	var bDelete=!hasOwn(thisContext,"value");++count;tryCatch(function(){var req=bDelete?cursor.delete():cursor.update(thisContext.value);req._hookCtx=thisContext;req.onerror=hookedEventRejectHandler(onerror);req.onsuccess=hookedEventSuccessHandler(function(){++successCount;checkFinished();});},onerror);}else if(thisContext.onsuccess){// Hook will expect either onerror or onsuccess to always be called!
	thisContext.onsuccess(thisContext.value);}}function doReject(e){if(e){failures.push(e);failKeys.push(currentKey);}return reject(new ModifyError("Error modifying one or more objects",failures,successCount,failKeys));}function checkFinished(){if(iterationComplete&&successCount+failures.length===count){if(failures.length>0)doReject();else resolve(successCount);}}self.clone().raw()._iterate(modifyItem,function(){iterationComplete=true;checkFinished();},doReject,idbstore);});},'delete':function _delete(){var _this4=this;var ctx=this._ctx,range=ctx.range,deletingHook=ctx.table.hook.deleting.fire,hasDeleteHook=deletingHook!==nop;if(!hasDeleteHook&&isPlainKeyRange(ctx)&&(ctx.isPrimKey&&!hangsOnDeleteLargeKeyRange||!range))// if no range, we'll use clear().
	{// May use IDBObjectStore.delete(IDBKeyRange) in this case (Issue #208)
	// For chromium, this is the way most optimized version.
	// For IE/Edge, this could hang the indexedDB engine and make operating system instable
	// (https://gist.github.com/dfahlander/5a39328f029de18222cf2125d56c38f7)
	return this._write(function(resolve,reject,idbstore){// Our API contract is to return a count of deleted items, so we have to count() before delete().
	var onerror=eventRejectHandler(reject),countReq=range?idbstore.count(range):idbstore.count();countReq.onerror=onerror;countReq.onsuccess=function(){var count=countReq.result;tryCatch(function(){var delReq=range?idbstore.delete(range):idbstore.clear();delReq.onerror=onerror;delReq.onsuccess=function(){return resolve(count);};},function(err){return reject(err);});};});}// Default version to use when collection is not a vanilla IDBKeyRange on the primary key.
	// Divide into chunks to not starve RAM.
	// If has delete hook, we will have to collect not just keys but also objects, so it will use
	// more memory and need lower chunk size.
	var CHUNKSIZE=hasDeleteHook?2000:10000;return this._write(function(resolve,reject,idbstore,trans){var totalCount=0;// Clone collection and change its table and set a limit of CHUNKSIZE on the cloned Collection instance.
	var collection=_this4.clone({keysOnly:!ctx.isMatch&&!hasDeleteHook})// load just keys (unless filter() or and() or deleteHook has subscribers)
	.distinct()// In case multiEntry is used, never delete same key twice because resulting count
	// would become larger than actual delete count.
	.limit(CHUNKSIZE).raw();// Don't filter through reading-hooks (like mapped classes etc)
	var keysOrTuples=[];// We're gonna do things on as many chunks that are needed.
	// Use recursion of nextChunk function:
	var nextChunk=function nextChunk(){return collection.each(hasDeleteHook?function(val,cursor){// Somebody subscribes to hook('deleting'). Collect all primary keys and their values,
	// so that the hook can be called with its values in bulkDelete().
	keysOrTuples.push([cursor.primaryKey,cursor.value]);}:function(val,cursor){// No one subscribes to hook('deleting'). Collect only primary keys:
	keysOrTuples.push(cursor.primaryKey);}).then(function(){// Chromium deletes faster when doing it in sort order.
	hasDeleteHook?keysOrTuples.sort(function(a,b){return ascending(a[0],b[0]);}):keysOrTuples.sort(ascending);return _bulkDelete(idbstore,trans,keysOrTuples,hasDeleteHook,deletingHook);}).then(function(){var count=keysOrTuples.length;totalCount+=count;keysOrTuples=[];return count<CHUNKSIZE?totalCount:nextChunk();});};resolve(nextChunk());});}});//
	//
	//
	// ------------------------- Help functions ---------------------------
	//
	//
	//
	function lowerVersionFirst(a,b){return a._cfg.version-b._cfg.version;}function setApiOnPlace(objs,tableNames,mode,dbschema){tableNames.forEach(function(tableName){var tableInstance=db._tableFactory(mode,dbschema[tableName]);objs.forEach(function(obj){tableName in obj||(obj[tableName]=tableInstance);});});}function removeTablesApi(objs){objs.forEach(function(obj){for(var key in obj){if(obj[key]instanceof Table)delete obj[key];}});}function iterate(req,filter,fn,resolve,reject,valueMapper){// Apply valueMapper (hook('reading') or mappped class)
	var mappedFn=valueMapper?function(x,c,a){return fn(valueMapper(x),c,a);}:fn;// Wrap fn with PSD and microtick stuff from Promise.
	var wrappedFn=wrap(mappedFn,reject);if(!req.onerror)req.onerror=eventRejectHandler(reject);if(filter){req.onsuccess=trycatcher(function filter_record(){var cursor=req.result;if(cursor){var c=function c(){cursor.continue();};if(filter(cursor,function(advancer){c=advancer;},resolve,reject))wrappedFn(cursor.value,cursor,function(advancer){c=advancer;});c();}else{resolve();}},reject);}else{req.onsuccess=trycatcher(function filter_record(){var cursor=req.result;if(cursor){var c=function c(){cursor.continue();};wrappedFn(cursor.value,cursor,function(advancer){c=advancer;});c();}else{resolve();}},reject);}}function parseIndexSyntax(indexes){/// <param name="indexes" type="String"></param>
	/// <returns type="Array" elementType="IndexSpec"></returns>
	var rv=[];indexes.split(',').forEach(function(index){index=index.trim();var name=index.replace(/([&*]|\+\+)/g,"");// Remove "&", "++" and "*"
	// Let keyPath of "[a+b]" be ["a","b"]:
	var keyPath=/^\[/.test(name)?name.match(/^\[(.*)\]$/)[1].split('+'):name;rv.push(new IndexSpec(name,keyPath||null,/\&/.test(index),/\*/.test(index),/\+\+/.test(index),isArray(keyPath),/\./.test(index)));});return rv;}function cmp(key1,key2){return indexedDB.cmp(key1,key2);}function min(a,b){return cmp(a,b)<0?a:b;}function max(a,b){return cmp(a,b)>0?a:b;}function ascending(a,b){return indexedDB.cmp(a,b);}function descending(a,b){return indexedDB.cmp(b,a);}function simpleCompare(a,b){return a<b?-1:a===b?0:1;}function simpleCompareReverse(a,b){return a>b?-1:a===b?0:1;}function combine(filter1,filter2){return filter1?filter2?function(){return filter1.apply(this,arguments)&&filter2.apply(this,arguments);}:filter1:filter2;}function readGlobalSchema(){db.verno=idbdb.version/10;db._dbSchema=globalSchema={};dbStoreNames=slice(idbdb.objectStoreNames,0);if(dbStoreNames.length===0)return;// Database contains no stores.
	var trans=idbdb.transaction(safariMultiStoreFix(dbStoreNames),'readonly');dbStoreNames.forEach(function(storeName){var store=trans.objectStore(storeName),keyPath=store.keyPath,dotted=keyPath&&typeof keyPath==='string'&&keyPath.indexOf('.')!==-1;var primKey=new IndexSpec(keyPath,keyPath||"",false,false,!!store.autoIncrement,keyPath&&typeof keyPath!=='string',dotted);var indexes=[];for(var j=0;j<store.indexNames.length;++j){var idbindex=store.index(store.indexNames[j]);keyPath=idbindex.keyPath;dotted=keyPath&&typeof keyPath==='string'&&keyPath.indexOf('.')!==-1;var index=new IndexSpec(idbindex.name,keyPath,!!idbindex.unique,!!idbindex.multiEntry,false,keyPath&&typeof keyPath!=='string',dotted);indexes.push(index);}globalSchema[storeName]=new TableSchema(storeName,primKey,indexes,{});});setApiOnPlace([allTables,Transaction.prototype],keys(globalSchema),READWRITE,globalSchema);}function adjustToExistingIndexNames(schema,idbtrans){/// <summary>
	/// Issue #30 Problem with existing db - adjust to existing index names when migrating from non-dexie db
	/// </summary>
	/// <param name="schema" type="Object">Map between name and TableSchema</param>
	/// <param name="idbtrans" type="IDBTransaction"></param>
	var storeNames=idbtrans.db.objectStoreNames;for(var i=0;i<storeNames.length;++i){var storeName=storeNames[i];var store=idbtrans.objectStore(storeName);hasGetAll='getAll'in store;for(var j=0;j<store.indexNames.length;++j){var indexName=store.indexNames[j];var keyPath=store.index(indexName).keyPath;var dexieName=typeof keyPath==='string'?keyPath:"["+slice(keyPath).join('+')+"]";if(schema[storeName]){var indexSpec=schema[storeName].idxByName[dexieName];if(indexSpec)indexSpec.name=indexName;}}}}function fireOnBlocked(ev){db.on("blocked").fire(ev);// Workaround (not fully*) for missing "versionchange" event in IE,Edge and Safari:
	connections.filter(function(c){return c.name===db.name&&c!==db&&!c._vcFired;}).map(function(c){return c.on("versionchange").fire(ev);});}extend(this,{Collection:Collection,Table:Table,Transaction:Transaction,Version:Version,WhereClause:WhereClause,WriteableCollection:WriteableCollection,WriteableTable:WriteableTable});init();addons.forEach(function(fn){fn(db);});}var fakeAutoComplete=function fakeAutoComplete(){};// Will never be changed. We just fake for the IDE that we change it (see doFakeAutoComplete())
	var fake=false;// Will never be changed. We just fake for the IDE that we change it (see doFakeAutoComplete())
	function parseType(type){if(typeof type==='function'){return new type();}else if(isArray(type)){return[parseType(type[0])];}else if(type&&(typeof type==='undefined'?'undefined':(0,_typeof3.default)(type))==='object'){var rv={};applyStructure(rv,type);return rv;}else{return type;}}function applyStructure(obj,structure){keys(structure).forEach(function(member){var value=parseType(structure[member]);obj[member]=value;});return obj;}function eventSuccessHandler(done){return function(ev){done(ev.target.result);};}function hookedEventSuccessHandler(resolve){// wrap() is needed when calling hooks because the rare scenario of:
	//  * hook does a db operation that fails immediately (IDB throws exception)
	//    For calling db operations on correct transaction, wrap makes sure to set PSD correctly.
	//    wrap() will also execute in a virtual tick.
	//  * If not wrapped in a virtual tick, direct exception will launch a new physical tick.
	//  * If this was the last event in the bulk, the promise will resolve after a physical tick
	//    and the transaction will have committed already.
	// If no hook, the virtual tick will be executed in the reject()/resolve of the final promise,
	// because it is always marked with _lib = true when created using Transaction._promise().
	return wrap(function(event){var req=event.target,result=req.result,ctx=req._hookCtx,// Contains the hook error handler. Put here instead of closure to boost performance.
	hookSuccessHandler=ctx&&ctx.onsuccess;hookSuccessHandler&&hookSuccessHandler(result);resolve&&resolve(result);},resolve);}function eventRejectHandler(reject){return function(event){preventDefault(event);reject(event.target.error);return false;};}function hookedEventRejectHandler(reject){return wrap(function(event){// See comment on hookedEventSuccessHandler() why wrap() is needed only when supporting hooks.
	var req=event.target,err=req.error,ctx=req._hookCtx,// Contains the hook error handler. Put here instead of closure to boost performance.
	hookErrorHandler=ctx&&ctx.onerror;hookErrorHandler&&hookErrorHandler(err);preventDefault(event);reject(err);return false;});}function preventDefault(event){if(event.stopPropagation)// IndexedDBShim doesnt support this on Safari 8 and below.
	event.stopPropagation();if(event.preventDefault)// IndexedDBShim doesnt support this on Safari 8 and below.
	event.preventDefault();}function globalDatabaseList(cb){var val,localStorage=Dexie.dependencies.localStorage;if(!localStorage)return cb([]);// Envs without localStorage support
	try{val=JSON.parse(localStorage.getItem('Dexie.DatabaseNames')||"[]");}catch(e){val=[];}if(cb(val)){localStorage.setItem('Dexie.DatabaseNames',(0,_stringify2.default)(val));}}function awaitIterator(iterator){var callNext=function callNext(result){return iterator.next(result);},doThrow=function doThrow(error){return iterator.throw(error);},onSuccess=step(callNext),onError=step(doThrow);function step(getNext){return function(val){var next=getNext(val),value=next.value;return next.done?value:!value||typeof value.then!=='function'?isArray(value)?Promise.all(value).then(onSuccess,onError):onSuccess(value):value.then(onSuccess,onError);};}return step(callNext)();}//
	// IndexSpec struct
	//
	function IndexSpec(name,keyPath,unique,multi,auto,compound,dotted){/// <param name="name" type="String"></param>
	/// <param name="keyPath" type="String"></param>
	/// <param name="unique" type="Boolean"></param>
	/// <param name="multi" type="Boolean"></param>
	/// <param name="auto" type="Boolean"></param>
	/// <param name="compound" type="Boolean"></param>
	/// <param name="dotted" type="Boolean"></param>
	this.name=name;this.keyPath=keyPath;this.unique=unique;this.multi=multi;this.auto=auto;this.compound=compound;this.dotted=dotted;var keyPathSrc=typeof keyPath==='string'?keyPath:keyPath&&'['+[].join.call(keyPath,'+')+']';this.src=(unique?'&':'')+(multi?'*':'')+(auto?"++":"")+keyPathSrc;}//
	// TableSchema struct
	//
	function TableSchema(name,primKey,indexes,instanceTemplate){/// <param name="name" type="String"></param>
	/// <param name="primKey" type="IndexSpec"></param>
	/// <param name="indexes" type="Array" elementType="IndexSpec"></param>
	/// <param name="instanceTemplate" type="Object"></param>
	this.name=name;this.primKey=primKey||new IndexSpec();this.indexes=indexes||[new IndexSpec()];this.instanceTemplate=instanceTemplate;this.mappedClass=null;this.idxByName=arrayToObject(indexes,function(index){return[index.name,index];});}// Used in when defining dependencies later...
	// (If IndexedDBShim is loaded, prefer it before standard indexedDB)
	var idbshim=_global.idbModules&&_global.idbModules.shimIndexedDB?_global.idbModules:{};function safariMultiStoreFix(storeNames){return storeNames.length===1?storeNames[0]:storeNames;}function getNativeGetDatabaseNamesFn(indexedDB){var fn=indexedDB&&(indexedDB.getDatabaseNames||indexedDB.webkitGetDatabaseNames);return fn&&fn.bind(indexedDB);}// Export Error classes
	props(Dexie,fullNameExceptions);// Dexie.XXXError = class XXXError {...};
	//
	// Static methods and properties
	// 
	props(Dexie,{//
	// Static delete() method.
	//
	delete:function _delete(databaseName){var db=new Dexie(databaseName),promise=db.delete();promise.onblocked=function(fn){db.on("blocked",fn);return this;};return promise;},//
	// Static exists() method.
	//
	exists:function exists(name){return new Dexie(name).open().then(function(db){db.close();return true;}).catch(Dexie.NoSuchDatabaseError,function(){return false;});},//
	// Static method for retrieving a list of all existing databases at current host.
	//
	getDatabaseNames:function getDatabaseNames(cb){return new Promise(function(resolve,reject){var getDatabaseNames=getNativeGetDatabaseNamesFn(indexedDB);if(getDatabaseNames){// In case getDatabaseNames() becomes standard, let's prepare to support it:
	var req=getDatabaseNames();req.onsuccess=function(event){resolve(slice(event.target.result,0));// Converst DOMStringList to Array<String>
	};req.onerror=eventRejectHandler(reject);}else{globalDatabaseList(function(val){resolve(val);return false;});}}).then(cb);},defineClass:function defineClass(structure){/// <summary>
	///     Create a javascript constructor based on given template for which properties to expect in the class.
	///     Any property that is a constructor function will act as a type. So {name: String} will be equal to {name: new String()}.
	/// </summary>
	/// <param name="structure">Helps IDE code completion by knowing the members that objects contain and not just the indexes. Also
	/// know what type each member has. Example: {name: String, emailAddresses: [String], properties: {shoeSize: Number}}</param>
	// Default constructor able to copy given properties into this object.
	function Class(properties){/// <param name="properties" type="Object" optional="true">Properties to initialize object with.
	/// </param>
	properties?extend(this,properties):fake&&applyStructure(this,structure);}return Class;},applyStructure:applyStructure,ignoreTransaction:function ignoreTransaction(scopeFunc){// In case caller is within a transaction but needs to create a separate transaction.
	// Example of usage:
	//
	// Let's say we have a logger function in our app. Other application-logic should be unaware of the
	// logger function and not need to include the 'logentries' table in all transaction it performs.
	// The logging should always be done in a separate transaction and not be dependant on the current
	// running transaction context. Then you could use Dexie.ignoreTransaction() to run code that starts a new transaction.
	//
	//     Dexie.ignoreTransaction(function() {
	//         db.logentries.add(newLogEntry);
	//     });
	//
	// Unless using Dexie.ignoreTransaction(), the above example would try to reuse the current transaction
	// in current Promise-scope.
	//
	// An alternative to Dexie.ignoreTransaction() would be setImmediate() or setTimeout(). The reason we still provide an
	// API for this because
	//  1) The intention of writing the statement could be unclear if using setImmediate() or setTimeout().
	//  2) setTimeout() would wait unnescessary until firing. This is however not the case with setImmediate().
	//  3) setImmediate() is not supported in the ES standard.
	//  4) You might want to keep other PSD state that was set in a parent PSD, such as PSD.letThrough.
	return PSD.trans?usePSD(PSD.transless,scopeFunc):// Use the closest parent that was non-transactional.
	scopeFunc();// No need to change scope because there is no ongoing transaction.
	},vip:function vip(fn){// To be used by subscribers to the on('ready') event.
	// This will let caller through to access DB even when it is blocked while the db.ready() subscribers are firing.
	// This would have worked automatically if we were certain that the Provider was using Dexie.Promise for all asyncronic operations. The promise PSD
	// from the provider.connect() call would then be derived all the way to when provider would call localDatabase.applyChanges(). But since
	// the provider more likely is using non-promise async APIs or other thenable implementations, we cannot assume that.
	// Note that this method is only useful for on('ready') subscribers that is returning a Promise from the event. If not using vip()
	// the database could deadlock since it wont open until the returned Promise is resolved, and any non-VIPed operation started by
	// the caller will not resolve until database is opened.
	return newScope(function(){PSD.letThrough=true;// Make sure we are let through if still blocking db due to onready is firing.
	return fn();});},async:function async(generatorFn){return function(){try{var rv=awaitIterator(generatorFn.apply(this,arguments));if(!rv||typeof rv.then!=='function')return Promise.resolve(rv);return rv;}catch(e){return rejection(e);}};},spawn:function spawn(generatorFn,args,thiz){try{var rv=awaitIterator(generatorFn.apply(thiz,args||[]));if(!rv||typeof rv.then!=='function')return Promise.resolve(rv);return rv;}catch(e){return rejection(e);}},// Dexie.currentTransaction property
	currentTransaction:{get:function get(){return PSD.trans||null;}},// Export our Promise implementation since it can be handy as a standalone Promise implementation
	Promise:Promise,// Dexie.debug proptery:
	// Dexie.debug = false
	// Dexie.debug = true
	// Dexie.debug = "dexie" - don't hide dexie's stack frames.
	debug:{get:function get(){return debug;},set:function set(value){setDebug(value,value==='dexie'?function(){return true;}:dexieStackFrameFilter);}},// Export our derive/extend/override methodology
	derive:derive,extend:extend,props:props,override:override,// Export our Events() function - can be handy as a toolkit
	Events:Events,events:{get:deprecated(function(){return Events;})},// Backward compatible lowercase version.
	// Utilities
	getByKeyPath:getByKeyPath,setByKeyPath:setByKeyPath,delByKeyPath:delByKeyPath,shallowClone:shallowClone,deepClone:deepClone,getObjectDiff:getObjectDiff,asap:asap,maxKey:maxKey,// Addon registry
	addons:[],// Global DB connection list
	connections:connections,MultiModifyError:exceptions.Modify,// Backward compatibility 0.9.8. Deprecate.
	errnames:errnames,// Export other static classes
	IndexSpec:IndexSpec,TableSchema:TableSchema,//
	// Dependencies
	//
	// These will automatically work in browsers with indexedDB support, or where an indexedDB polyfill has been included.
	//
	// In node.js, however, these properties must be set "manually" before instansiating a new Dexie().
	// For node.js, you need to require indexeddb-js or similar and then set these deps.
	//
	dependencies:{// Required:
	indexedDB:idbshim.shimIndexedDB||_global.indexedDB||_global.mozIndexedDB||_global.webkitIndexedDB||_global.msIndexedDB,IDBKeyRange:idbshim.IDBKeyRange||_global.IDBKeyRange||_global.webkitIDBKeyRange},// API Version Number: Type Number, make sure to always set a version number that can be comparable correctly. Example: 0.9, 0.91, 0.92, 1.0, 1.01, 1.1, 1.2, 1.21, etc.
	semVer:DEXIE_VERSION,version:DEXIE_VERSION.split('.').map(function(n){return parseInt(n);}).reduce(function(p,c,i){return p+c/Math.pow(10,i*2);}),fakeAutoComplete:fakeAutoComplete,// https://github.com/dfahlander/Dexie.js/issues/186
	// typescript compiler tsc in mode ts-->es5 & commonJS, will expect require() to return
	// x.default. Workaround: Set Dexie.default = Dexie.
	default:Dexie});tryCatch(function(){// Optional dependencies
	// localStorage
	Dexie.dependencies.localStorage=(typeof chrome!=="undefined"&&chrome!==null?chrome.storage:void 0)!=null?null:_global.localStorage;});// Map DOMErrors and DOMExceptions to corresponding Dexie errors. May change in Dexie v2.0.
	Promise.rejectionMapper=mapError;// Fool IDE to improve autocomplete. Tested with Visual Studio 2013 and 2015.
	doFakeAutoComplete(function(){Dexie.fakeAutoComplete=fakeAutoComplete=doFakeAutoComplete;Dexie.fake=fake=true;});return Dexie;});//# sourceMappingURL=dexie.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(121), __esModule: true };

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _stringify = __webpack_require__(120);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var core = __webpack_require__(12),
	    $JSON = core.JSON || (core.JSON = { stringify: _stringify2.default });
	module.exports = function stringify(it) {
	  // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(123), __esModule: true };

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(124);
	module.exports = __webpack_require__(12).Object.isFrozen;

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 19.1.2.12 Object.isFrozen(O)
	var isObject = __webpack_require__(23);
	
	__webpack_require__(48)('isFrozen', function ($isFrozen) {
	  return function isFrozen(it) {
	    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
	  };
	});

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(126), __esModule: true };

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(127);
	module.exports = __webpack_require__(12).setImmediate;

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $export = __webpack_require__(10),
	    $task = __webpack_require__(109);
	$export($export.G + $export.B, {
	  setImmediate: $task.set,
	  clearImmediate: $task.clear
	});

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray2 = __webpack_require__(129);
	
	var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);
	
	var _keys = __webpack_require__(56);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _classCallCheck2 = __webpack_require__(136);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(137);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var SchemaParser = function () {
	
	  /**
	   * Schema parser
	   *
	   * @param schema
	   */
	  function SchemaParser(schema) {
	    (0, _classCallCheck3.default)(this, SchemaParser);
	
	    this.schema = schema;
	  }
	
	  /**
	   * Extracts foreign keys from the schema
	   *
	   * @returns Object
	   */
	
	
	  (0, _createClass3.default)(SchemaParser, [{
	    key: 'getForeignKeys',
	    value: function getForeignKeys() {
	      var _this = this;
	
	      var foreignKeys = {};
	
	      (0, _keys2.default)(this.schema).forEach(function (table) {
	        var indexes = _this.schema[table].split(',');
	
	        foreignKeys[table] = indexes.filter(function (idx) {
	          return idx.indexOf('->') !== -1;
	        }).map(function (idx) {
	          // split the column and foreign table info
	          var _idx$split$map = idx.split('->').map(function (x) {
	            return x.trim();
	          });
	
	          var _idx$split$map2 = (0, _slicedToArray3.default)(_idx$split$map, 2);
	
	          var column = _idx$split$map2[0];
	          var target = _idx$split$map2[1];
	
	
	          return {
	            index: column,
	            targetTable: target.split('.')[0],
	            targetIndex: target.split('.')[1]
	          };
	        });
	      });
	
	      return foreignKeys;
	    }
	
	    /**
	     * Get schema without the foreign key definitions
	     *
	     * @returns Object
	     */
	
	  }, {
	    key: 'getCleanedSchema',
	    value: function getCleanedSchema() {
	      var _this2 = this;
	
	      var schema = {};
	
	      (0, _keys2.default)(this.schema).forEach(function (table) {
	        var indexes = _this2.schema[table].split(',');
	
	        // Remove foreign keys syntax before calling the original method
	        schema[table] = indexes.map(function (idx) {
	          return idx.split('->')[0].trim();
	        }).join(',');
	      });
	
	      return schema;
	    }
	  }]);
	  return SchemaParser;
	}();
	
	exports.default = SchemaParser;

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _isIterable2 = __webpack_require__(130);
	
	var _isIterable3 = _interopRequireDefault(_isIterable2);
	
	var _getIterator2 = __webpack_require__(133);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	exports.default = function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];
	    var _n = true;
	    var _d = false;
	    var _e = undefined;
	
	    try {
	      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);
	
	        if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;
	      _e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }
	
	    return _arr;
	  }
	
	  return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if ((0, _isIterable3.default)(Object(arr))) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	}();

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(131), __esModule: true };

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(27);
	__webpack_require__(4);
	module.exports = __webpack_require__(132);

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var classof = __webpack_require__(102),
	    ITERATOR = __webpack_require__(35)('iterator'),
	    Iterators = __webpack_require__(31);
	module.exports = __webpack_require__(12).isIterable = function (it) {
	  var O = Object(it);
	  return O[ITERATOR] !== undefined || '@@iterator' in O || Iterators.hasOwnProperty(classof(O));
	};

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(134), __esModule: true };

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(27);
	__webpack_require__(4);
	module.exports = __webpack_require__(135);

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var anObject = __webpack_require__(22),
	    get = __webpack_require__(107);
	module.exports = __webpack_require__(12).getIterator = function (it) {
	  var iterFn = get(it);
	  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 136 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(17);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ }
/******/ ]);
//# sourceMappingURL=dexie-relationships.js.map