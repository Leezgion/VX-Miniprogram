module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1650268489738, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const Geo = require("./geo/index");
const collection_1 = require("./collection");
const command_1 = require("./command");
const index_1 = require("./serverDate/index");
const index_2 = require("./regexp/index");
const transaction_1 = require("./transaction");
class Db {
    constructor(config) {
        this.config = config;
        this.Geo = Geo;
        this.serverDate = index_1.ServerDateConstructor;
        this.command = command_1.Command;
        this.RegExp = index_2.RegExpConstructor;
        this.startTransaction = transaction_1.startTransaction;
        this.runTransaction = transaction_1.runTransaction;
    }
    collection(collName) {
        if (!collName) {
            throw new Error('Collection name is required');
        }
        return new collection_1.CollectionReference(this, collName);
    }
    createCollection(collName) {
        let request = new Db.reqClass(this.config);
        const params = {
            collectionName: collName
        };
        return request.send('database.addCollection', params);
    }
}
exports.Db = Db;

}, function(modId) {var map = {"./geo/index":1650268489739,"./collection":1650268489753,"./command":1650268489776,"./serverDate/index":1650268489744,"./regexp/index":1650268489777,"./transaction":1650268489778}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489739, function(require, module, exports) {

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./point"));
__export(require("./lineString"));
__export(require("./polygon"));
__export(require("./multiPoint"));
__export(require("./multiLineString"));
__export(require("./multiPolygon"));

}, function(modId) { var map = {"./point":1650268489740,"./lineString":1650268489748,"./polygon":1650268489749,"./multiPoint":1650268489750,"./multiLineString":1650268489751,"./multiPolygon":1650268489752}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489740, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
const symbol_1 = require("../helper/symbol");
const type_1 = require("../utils/type");
class Point {
    constructor(longitude, latitude) {
        validate_1.Validate.isGeopoint('longitude', longitude);
        validate_1.Validate.isGeopoint('latitude', latitude);
        this.longitude = longitude;
        this.latitude = latitude;
    }
    parse(key) {
        return {
            [key]: {
                type: 'Point',
                coordinates: [this.longitude, this.latitude]
            }
        };
    }
    toJSON() {
        return {
            type: 'Point',
            coordinates: [
                this.longitude,
                this.latitude,
            ],
        };
    }
    toReadableString() {
        return `[${this.longitude},${this.latitude}]`;
    }
    static validate(point) {
        return point.type === 'Point' &&
            type_1.isArray(point.coordinates) &&
            validate_1.Validate.isGeopoint('longitude', point.coordinates[0]) &&
            validate_1.Validate.isGeopoint('latitude', point.coordinates[1]);
    }
    get _internalType() {
        return symbol_1.SYMBOL_GEO_POINT;
    }
}
exports.Point = Point;

}, function(modId) { var map = {"../validate":1650268489741,"../helper/symbol":1650268489745,"../utils/type":1650268489747}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489741, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("./constant");
const util_1 = require("./util");
class Validate {
    static isGeopoint(point, degree) {
        if (util_1.Util.whichType(degree) !== constant_1.FieldType.Number) {
            throw new Error('Geo Point must be number type');
        }
        const degreeAbs = Math.abs(degree);
        if (point === 'latitude' && degreeAbs > 90) {
            throw new Error('latitude should be a number ranges from -90 to 90');
        }
        else if (point === 'longitude' && degreeAbs > 180) {
            throw new Error('longitude should be a number ranges from -180 to 180');
        }
        return true;
    }
    static isInteger(param, num) {
        if (!Number.isInteger(num)) {
            throw new Error(param + constant_1.ErrorCode.IntergerError);
        }
        return true;
    }
    static isFieldOrder(direction) {
        if (constant_1.OrderDirectionList.indexOf(direction) === -1) {
            throw new Error(constant_1.ErrorCode.DirectionError);
        }
        return true;
    }
    static isFieldPath(path) {
        if (!/^[a-zA-Z0-9-_\.]/.test(path)) {
            throw new Error();
        }
        return true;
    }
    static isOperator(op) {
        if (constant_1.WhereFilterOpList.indexOf(op) === -1) {
            throw new Error(constant_1.ErrorCode.OpStrError);
        }
        return true;
    }
    static isCollName(name) {
        if (!/^[a-zA-Z0-9]([a-zA-Z0-9-_]){1,32}$/.test(name)) {
            throw new Error(constant_1.ErrorCode.CollNameError);
        }
        return true;
    }
    static isDocID(docId) {
        if (!/^([a-fA-F0-9]){24}$/.test(docId)) {
            throw new Error(constant_1.ErrorCode.DocIDError);
        }
        return true;
    }
}
exports.Validate = Validate;

}, function(modId) { var map = {"./constant":1650268489742,"./util":1650268489743}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489742, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["DocIDError"] = "\u6587\u6863ID\u4E0D\u5408\u6CD5";
    ErrorCode["CollNameError"] = "\u96C6\u5408\u540D\u79F0\u4E0D\u5408\u6CD5";
    ErrorCode["OpStrError"] = "\u64CD\u4F5C\u7B26\u4E0D\u5408\u6CD5";
    ErrorCode["DirectionError"] = "\u6392\u5E8F\u5B57\u7B26\u4E0D\u5408\u6CD5";
    ErrorCode["IntergerError"] = "must be integer";
})(ErrorCode || (ErrorCode = {}));
exports.ErrorCode = ErrorCode;
const FieldType = {
    String: 'String',
    Number: 'Number',
    Object: 'Object',
    Array: 'Array',
    Boolean: 'Boolean',
    Null: 'Null',
    GeoPoint: 'GeoPoint',
    GeoLineString: 'GeoLineString',
    GeoPolygon: 'GeoPolygon',
    GeoMultiPoint: 'GeoMultiPoint',
    GeoMultiLineString: 'GeoMultiLineString',
    GeoMultiPolygon: 'GeoMultiPolygon',
    Timestamp: 'Date',
    Command: 'Command',
    ServerDate: 'ServerDate'
};
exports.FieldType = FieldType;
const OrderDirectionList = ['desc', 'asc'];
exports.OrderDirectionList = OrderDirectionList;
const WhereFilterOpList = ['<', '<=', '==', '>=', '>'];
exports.WhereFilterOpList = WhereFilterOpList;
var Opeartor;
(function (Opeartor) {
    Opeartor["lt"] = "<";
    Opeartor["gt"] = ">";
    Opeartor["lte"] = "<=";
    Opeartor["gte"] = ">=";
    Opeartor["eq"] = "==";
})(Opeartor || (Opeartor = {}));
exports.Opeartor = Opeartor;
const OperatorMap = {
    [Opeartor.eq]: '$eq',
    [Opeartor.lt]: '$lt',
    [Opeartor.lte]: '$lte',
    [Opeartor.gt]: '$gt',
    [Opeartor.gte]: '$gte'
};
exports.OperatorMap = OperatorMap;
const UpdateOperatorList = [
    '$set',
    '$inc',
    '$mul',
    '$unset',
    '$push',
    '$pop',
    '$unshift',
    '$shift',
    '$currentDate',
    '$each',
    '$position'
];
exports.UpdateOperatorList = UpdateOperatorList;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489743, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("./constant");
const index_1 = require("./geo/index");
const index_2 = require("./serverDate/index");
class Util {
}
Util.formatResDocumentData = (documents) => {
    return documents.map(document => {
        return Util.formatField(document);
    });
};
Util.formatField = document => {
    const keys = Object.keys(document);
    let protoField = {};
    if (Array.isArray(document)) {
        protoField = [];
    }
    keys.forEach(key => {
        const item = document[key];
        const type = Util.whichType(item);
        let realValue;
        switch (type) {
            case constant_1.FieldType.GeoPoint:
                realValue = new index_1.Point(item.coordinates[0], item.coordinates[1]);
                break;
            case constant_1.FieldType.GeoLineString:
                realValue = new index_1.LineString(item.coordinates.map(point => new index_1.Point(point[0], point[1])));
                break;
            case constant_1.FieldType.GeoPolygon:
                realValue = new index_1.Polygon(item.coordinates.map(line => new index_1.LineString(line.map(([lng, lat]) => new index_1.Point(lng, lat)))));
                break;
            case constant_1.FieldType.GeoMultiPoint:
                realValue = new index_1.MultiPoint(item.coordinates.map(point => new index_1.Point(point[0], point[1])));
                break;
            case constant_1.FieldType.GeoMultiLineString:
                realValue = new index_1.MultiLineString(item.coordinates.map(line => new index_1.LineString(line.map(([lng, lat]) => new index_1.Point(lng, lat)))));
                break;
            case constant_1.FieldType.GeoMultiPolygon:
                realValue = new index_1.MultiPolygon(item.coordinates.map(polygon => new index_1.Polygon(polygon.map(line => new index_1.LineString(line.map(([lng, lat]) => new index_1.Point(lng, lat)))))));
                break;
            case constant_1.FieldType.Timestamp:
                realValue = new Date(item.$timestamp * 1000);
                break;
            case constant_1.FieldType.Object:
            case constant_1.FieldType.Array:
                realValue = Util.formatField(item);
                break;
            case constant_1.FieldType.ServerDate:
                realValue = new Date(item.$date);
                break;
            default:
                realValue = item;
        }
        if (Array.isArray(protoField)) {
            protoField.push(realValue);
        }
        else {
            protoField[key] = realValue;
        }
    });
    return protoField;
};
Util.whichType = (obj) => {
    let type = Object.prototype.toString.call(obj).slice(8, -1);
    if (type === constant_1.FieldType.Object) {
        if (obj instanceof index_1.Point) {
            return constant_1.FieldType.GeoPoint;
        }
        else if (obj instanceof Date) {
            return constant_1.FieldType.Timestamp;
        }
        else if (obj instanceof index_2.ServerDate) {
            return constant_1.FieldType.ServerDate;
        }
        if (obj.$timestamp) {
            type = constant_1.FieldType.Timestamp;
        }
        else if (obj.$date) {
            type = constant_1.FieldType.ServerDate;
        }
        else if (index_1.Point.validate(obj)) {
            type = constant_1.FieldType.GeoPoint;
        }
        else if (index_1.LineString.validate(obj)) {
            type = constant_1.FieldType.GeoLineString;
        }
        else if (index_1.Polygon.validate(obj)) {
            type = constant_1.FieldType.GeoPolygon;
        }
        else if (index_1.MultiPoint.validate(obj)) {
            type = constant_1.FieldType.GeoMultiPoint;
        }
        else if (index_1.MultiLineString.validate(obj)) {
            type = constant_1.FieldType.GeoMultiLineString;
        }
        else if (index_1.MultiPolygon.validate(obj)) {
            type = constant_1.FieldType.GeoMultiPolygon;
        }
    }
    return type;
};
Util.generateDocId = () => {
    let chars = 'ABCDEFabcdef0123456789';
    let autoId = '';
    for (let i = 0; i < 24; i++) {
        autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return autoId;
};
exports.Util = Util;

}, function(modId) { var map = {"./constant":1650268489742,"./geo/index":1650268489739,"./serverDate/index":1650268489744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489744, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = require("../helper/symbol");
class ServerDate {
    constructor({ offset = 0 } = {}) {
        this.offset = offset;
    }
    get _internalType() {
        return symbol_1.SYMBOL_SERVER_DATE;
    }
    parse() {
        return {
            $date: {
                offset: this.offset
            }
        };
    }
}
exports.ServerDate = ServerDate;
function ServerDateConstructor(opt) {
    return new ServerDate(opt);
}
exports.ServerDateConstructor = ServerDateConstructor;

}, function(modId) { var map = {"../helper/symbol":1650268489745}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489745, function(require, module, exports) {

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = require("../utils/symbol");
__export(require("../utils/symbol"));
exports.SYMBOL_UNSET_FIELD_NAME = symbol_1.default.for('UNSET_FIELD_NAME');
exports.SYMBOL_UPDATE_COMMAND = symbol_1.default.for('UPDATE_COMMAND');
exports.SYMBOL_QUERY_COMMAND = symbol_1.default.for('QUERY_COMMAND');
exports.SYMBOL_LOGIC_COMMAND = symbol_1.default.for('LOGIC_COMMAND');
exports.SYMBOL_GEO_POINT = symbol_1.default.for('GEO_POINT');
exports.SYMBOL_GEO_LINE_STRING = symbol_1.default.for('SYMBOL_GEO_LINE_STRING');
exports.SYMBOL_GEO_POLYGON = symbol_1.default.for('SYMBOL_GEO_POLYGON');
exports.SYMBOL_GEO_MULTI_POINT = symbol_1.default.for('SYMBOL_GEO_MULTI_POINT');
exports.SYMBOL_GEO_MULTI_LINE_STRING = symbol_1.default.for('SYMBOL_GEO_MULTI_LINE_STRING');
exports.SYMBOL_GEO_MULTI_POLYGON = symbol_1.default.for('SYMBOL_GEO_MULTI_POLYGON');
exports.SYMBOL_SERVER_DATE = symbol_1.default.for('SERVER_DATE');
exports.SYMBOL_REGEXP = symbol_1.default.for('REGEXP');

}, function(modId) { var map = {"../utils/symbol":1650268489746}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489746, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const _symbols = [];
const __internalMark__ = {};
class HiddenSymbol {
    constructor(target) {
        Object.defineProperties(this, {
            target: {
                enumerable: false,
                writable: false,
                configurable: false,
                value: target,
            },
        });
    }
}
class InternalSymbol extends HiddenSymbol {
    constructor(target, __mark__) {
        if (__mark__ !== __internalMark__) {
            throw new TypeError('InternalSymbol cannot be constructed with new operator');
        }
        super(target);
    }
    static for(target) {
        for (let i = 0, len = _symbols.length; i < len; i++) {
            if (_symbols[i].target === target) {
                return _symbols[i].instance;
            }
        }
        const symbol = new InternalSymbol(target, __internalMark__);
        _symbols.push({
            target,
            instance: symbol,
        });
        return symbol;
    }
}
exports.InternalSymbol = InternalSymbol;
exports.default = InternalSymbol;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489747, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = require("./symbol");
exports.getType = (x) => Object.prototype.toString.call(x).slice(8, -1).toLowerCase();
exports.isObject = (x) => exports.getType(x) === 'object';
exports.isString = (x) => exports.getType(x) === 'string';
exports.isNumber = (x) => exports.getType(x) === 'number';
exports.isPromise = (x) => exports.getType(x) === 'promise';
exports.isFunction = (x) => typeof x === 'function';
exports.isArray = (x) => Array.isArray(x);
exports.isDate = (x) => exports.getType(x) === 'date';
exports.isRegExp = (x) => exports.getType(x) === 'regexp';
exports.isInternalObject = (x) => x && (x._internalType instanceof symbol_1.InternalSymbol);
exports.isPlainObject = (obj) => {
    if (typeof obj !== 'object' || obj === null)
        return false;
    let proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto;
};

}, function(modId) { var map = {"./symbol":1650268489746}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489748, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = require("../helper/symbol");
const point_1 = require("./point");
const type_1 = require("../utils/type");
class LineString {
    constructor(points) {
        if (!type_1.isArray(points)) {
            throw new TypeError(`"points" must be of type Point[]. Received type ${typeof points}`);
        }
        if (points.length < 2) {
            throw new Error('"points" must contain 2 points at least');
        }
        points.forEach(point => {
            if (!(point instanceof point_1.Point)) {
                throw new TypeError(`"points" must be of type Point[]. Received type ${typeof point}[]`);
            }
        });
        this.points = points;
    }
    parse(key) {
        return {
            [key]: {
                type: 'LineString',
                coordinates: this.points.map(point => point.toJSON().coordinates)
            }
        };
    }
    toJSON() {
        return {
            type: 'LineString',
            coordinates: this.points.map(point => point.toJSON().coordinates)
        };
    }
    static validate(lineString) {
        if (lineString.type !== 'LineString' || !type_1.isArray(lineString.coordinates)) {
            return false;
        }
        for (let point of lineString.coordinates) {
            if (!type_1.isNumber(point[0]) || !type_1.isNumber(point[1])) {
                return false;
            }
        }
        return true;
    }
    static isClosed(lineString) {
        const firstPoint = lineString.points[0];
        const lastPoint = lineString.points[lineString.points.length - 1];
        if (firstPoint.latitude === lastPoint.latitude && firstPoint.longitude === lastPoint.longitude) {
            return true;
        }
    }
    get _internalType() {
        return symbol_1.SYMBOL_GEO_LINE_STRING;
    }
}
exports.LineString = LineString;

}, function(modId) { var map = {"../helper/symbol":1650268489745,"./point":1650268489740,"../utils/type":1650268489747}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489749, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = require("../helper/symbol");
const type_1 = require("../utils/type");
const lineString_1 = require("./lineString");
class Polygon {
    constructor(lines) {
        if (!type_1.isArray(lines)) {
            throw new TypeError(`"lines" must be of type LineString[]. Received type ${typeof lines}`);
        }
        if (lines.length === 0) {
            throw new Error('Polygon must contain 1 linestring at least');
        }
        lines.forEach(line => {
            if (!(line instanceof lineString_1.LineString)) {
                throw new TypeError(`"lines" must be of type LineString[]. Received type ${typeof line}[]`);
            }
            if (!lineString_1.LineString.isClosed(line)) {
                throw new Error(`LineString ${line.points.map(p => p.toReadableString())} is not a closed cycle`);
            }
        });
        this.lines = lines;
    }
    parse(key) {
        return {
            [key]: {
                type: 'Polygon',
                coordinates: this.lines.map(line => {
                    return line.points.map(point => [point.longitude, point.latitude]);
                })
            }
        };
    }
    toJSON() {
        return {
            type: 'Polygon',
            coordinates: this.lines.map(line => {
                return line.points.map(point => [point.longitude, point.latitude]);
            })
        };
    }
    static validate(polygon) {
        if (polygon.type !== 'Polygon' || !type_1.isArray(polygon.coordinates)) {
            return false;
        }
        for (let line of polygon.coordinates) {
            if (!this.isCloseLineString(line)) {
                return false;
            }
            for (let point of line) {
                if (!type_1.isNumber(point[0]) || !type_1.isNumber(point[1])) {
                    return false;
                }
            }
        }
        return true;
    }
    static isCloseLineString(lineString) {
        const firstPoint = lineString[0];
        const lastPoint = lineString[lineString.length - 1];
        if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
            return false;
        }
        return true;
    }
    get _internalType() {
        return symbol_1.SYMBOL_GEO_MULTI_POLYGON;
    }
}
exports.Polygon = Polygon;

}, function(modId) { var map = {"../helper/symbol":1650268489745,"../utils/type":1650268489747,"./lineString":1650268489748}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489750, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = require("../helper/symbol");
const point_1 = require("./point");
const type_1 = require("../utils/type");
class MultiPoint {
    constructor(points) {
        if (!type_1.isArray(points)) {
            throw new TypeError(`"points" must be of type Point[]. Received type ${typeof points}`);
        }
        if (points.length === 0) {
            throw new Error('"points" must contain 1 point at least');
        }
        points.forEach(point => {
            if (!(point instanceof point_1.Point)) {
                throw new TypeError(`"points" must be of type Point[]. Received type ${typeof point}[]`);
            }
        });
        this.points = points;
    }
    parse(key) {
        return {
            [key]: {
                type: 'MultiPoint',
                coordinates: this.points.map(point => point.toJSON().coordinates)
            }
        };
    }
    toJSON() {
        return {
            type: 'MultiPoint',
            coordinates: this.points.map(point => point.toJSON().coordinates)
        };
    }
    static validate(multiPoint) {
        if (multiPoint.type !== 'MultiPoint' || !type_1.isArray(multiPoint.coordinates)) {
            return false;
        }
        for (let point of multiPoint.coordinates) {
            if (!type_1.isNumber(point[0]) || !type_1.isNumber(point[1])) {
                return false;
            }
        }
        return true;
    }
    get _internalType() {
        return symbol_1.SYMBOL_GEO_MULTI_POINT;
    }
}
exports.MultiPoint = MultiPoint;

}, function(modId) { var map = {"../helper/symbol":1650268489745,"./point":1650268489740,"../utils/type":1650268489747}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489751, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = require("../helper/symbol");
const type_1 = require("../utils/type");
const lineString_1 = require("./lineString");
class MultiLineString {
    constructor(lines) {
        if (!type_1.isArray(lines)) {
            throw new TypeError(`"lines" must be of type LineString[]. Received type ${typeof lines}`);
        }
        if (lines.length === 0) {
            throw new Error('Polygon must contain 1 linestring at least');
        }
        lines.forEach(line => {
            if (!(line instanceof lineString_1.LineString)) {
                throw new TypeError(`"lines" must be of type LineString[]. Received type ${typeof line}[]`);
            }
        });
        this.lines = lines;
    }
    parse(key) {
        return {
            [key]: {
                type: 'MultiLineString',
                coordinates: this.lines.map(line => {
                    return line.points.map(point => [point.longitude, point.latitude]);
                })
            }
        };
    }
    toJSON() {
        return {
            type: 'MultiLineString',
            coordinates: this.lines.map(line => {
                return line.points.map(point => [point.longitude, point.latitude]);
            })
        };
    }
    static validate(multiLineString) {
        if (multiLineString.type !== 'MultiLineString' || !type_1.isArray(multiLineString.coordinates)) {
            return false;
        }
        for (let line of multiLineString.coordinates) {
            for (let point of line) {
                if (!type_1.isNumber(point[0]) || !type_1.isNumber(point[1])) {
                    return false;
                }
            }
        }
        return true;
    }
    get _internalType() {
        return symbol_1.SYMBOL_GEO_MULTI_LINE_STRING;
    }
}
exports.MultiLineString = MultiLineString;

}, function(modId) { var map = {"../helper/symbol":1650268489745,"../utils/type":1650268489747,"./lineString":1650268489748}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489752, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = require("../helper/symbol");
const type_1 = require("../utils/type");
const polygon_1 = require("./polygon");
class MultiPolygon {
    constructor(polygons) {
        if (!type_1.isArray(polygons)) {
            throw new TypeError(`"polygons" must be of type Polygon[]. Received type ${typeof polygons}`);
        }
        if (polygons.length === 0) {
            throw new Error('MultiPolygon must contain 1 polygon at least');
        }
        for (let polygon of polygons) {
            if (!(polygon instanceof polygon_1.Polygon)) {
                throw new TypeError(`"polygon" must be of type Polygon[]. Received type ${typeof polygon}[]`);
            }
        }
        this.polygons = polygons;
    }
    parse(key) {
        return {
            [key]: {
                type: 'MultiPolygon',
                coordinates: this.polygons.map(polygon => {
                    return polygon.lines.map(line => {
                        return line.points.map(point => [point.longitude, point.latitude]);
                    });
                })
            }
        };
    }
    toJSON() {
        return {
            type: 'MultiPolygon',
            coordinates: this.polygons.map(polygon => {
                return polygon.lines.map(line => {
                    return line.points.map(point => [point.longitude, point.latitude]);
                });
            })
        };
    }
    static validate(multiPolygon) {
        if (multiPolygon.type !== 'MultiPolygon' || !type_1.isArray(multiPolygon.coordinates)) {
            return false;
        }
        for (let polygon of multiPolygon.coordinates) {
            for (let line of polygon) {
                for (let point of line) {
                    if (!type_1.isNumber(point[0]) || !type_1.isNumber(point[1])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    get _internalType() {
        return symbol_1.SYMBOL_GEO_POLYGON;
    }
}
exports.MultiPolygon = MultiPolygon;

}, function(modId) { var map = {"../helper/symbol":1650268489745,"../utils/type":1650268489747,"./polygon":1650268489749}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489753, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const document_1 = require("./document");
const query_1 = require("./query");
const aggregate_1 = require("./aggregate");
class CollectionReference extends query_1.Query {
    constructor(db, coll) {
        super(db, coll);
    }
    get name() {
        return this._coll;
    }
    doc(docID) {
        if (typeof docID !== 'string' && typeof docID !== 'number') {
            throw new Error('docId必须为字符串或数字');
        }
        return new document_1.DocumentReference(this._db, this._coll, docID);
    }
    add(data, callback) {
        let docRef = new document_1.DocumentReference(this._db, this._coll, undefined);
        return docRef.create(data, callback);
    }
    aggregate() {
        return new aggregate_1.default(this._db, this._coll);
    }
}
exports.CollectionReference = CollectionReference;

}, function(modId) { var map = {"./document":1650268489754,"./query":1650268489773,"./aggregate":1650268489775}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489754, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./lib/util");
const index_1 = require("./index");
const util_2 = require("./util");
const update_1 = require("./serializer/update");
const datatype_1 = require("./serializer/datatype");
const update_2 = require("./commands/update");
const websocket_client_1 = require("./realtime/websocket-client");
class DocumentReference {
    constructor(db, coll, docID, projection = {}) {
        this.watch = (options) => {
            if (!index_1.Db.ws) {
                index_1.Db.ws = new websocket_client_1.RealtimeWebSocketClient({
                    context: {
                        appConfig: {
                            docSizeLimit: 1000,
                            realtimePingInterval: 10000,
                            realtimePongWaitTimeout: 5000,
                            getAccessToken: this._getAccessToken
                        }
                    }
                });
            }
            return index_1.Db.ws.watch(Object.assign({}, options, { envId: this._db.config.env, collectionName: this._coll, query: JSON.stringify({
                    _id: this.id
                }) }));
        };
        this._db = db;
        this._coll = coll;
        this.id = docID;
        this.request = new index_1.Db.reqClass(this._db.config);
        this.projection = projection;
        this._getAccessToken = index_1.Db.getAccessToken;
    }
    create(data, callback) {
        callback = callback || util_1.createPromiseCallback();
        let params = {
            collectionName: this._coll,
            data: datatype_1.serialize(data)
        };
        if (this.id) {
            params['_id'] = this.id;
        }
        this.request
            .send('database.addDocument', params)
            .then(res => {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    id: res.data._id,
                    requestId: res.requestId
                });
            }
        })
            .catch(err => {
            callback(err);
        });
        return callback.promise;
    }
    set(data, callback) {
        callback = callback || util_1.createPromiseCallback();
        if (!this.id) {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: 'docId不能为空'
            });
        }
        if (!data || typeof data !== 'object') {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '参数必需是非空对象'
            });
        }
        if (data.hasOwnProperty('_id')) {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '不能更新_id的值'
            });
        }
        let hasOperator = false;
        const checkMixed = objs => {
            if (typeof objs === 'object') {
                for (let key in objs) {
                    if (objs[key] instanceof update_2.UpdateCommand) {
                        hasOperator = true;
                    }
                    else if (typeof objs[key] === 'object') {
                        checkMixed(objs[key]);
                    }
                }
            }
        };
        checkMixed(data);
        if (hasOperator) {
            return Promise.resolve({
                code: 'DATABASE_REQUEST_FAILED',
                message: 'update operator complicit'
            });
        }
        const merge = false;
        let param = {
            collectionName: this._coll,
            data: datatype_1.serialize(data),
            multi: false,
            merge,
            upsert: true
        };
        if (this.id) {
            param['query'] = { _id: this.id };
        }
        this.request
            .send('database.updateDocument', param)
            .then(res => {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    updated: res.data.updated,
                    upsertedId: res.data.upserted_id,
                    requestId: res.requestId
                });
            }
        })
            .catch(err => {
            callback(err);
        });
        return callback.promise;
    }
    update(data, callback) {
        callback = callback || util_1.createPromiseCallback();
        if (!data || typeof data !== 'object') {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '参数必需是非空对象'
            });
        }
        if (data.hasOwnProperty('_id')) {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '不能更新_id的值'
            });
        }
        const query = { _id: this.id };
        const merge = true;
        const param = {
            collectionName: this._coll,
            data: update_1.UpdateSerializer.encode(data),
            query: query,
            multi: false,
            merge,
            upsert: false
        };
        this.request
            .send('database.updateDocument', param)
            .then(res => {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    updated: res.data.updated,
                    upsertedId: res.data.upserted_id,
                    requestId: res.requestId
                });
            }
        })
            .catch(err => {
            callback(err);
        });
        return callback.promise;
    }
    remove(callback) {
        callback = callback || util_1.createPromiseCallback();
        const query = { _id: this.id };
        const param = {
            collectionName: this._coll,
            query: query,
            multi: false
        };
        this.request
            .send('database.deleteDocument', param)
            .then(res => {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    deleted: res.data.deleted,
                    requestId: res.requestId
                });
            }
        })
            .catch(err => {
            callback(err);
        });
        return callback.promise;
    }
    get(callback) {
        callback = callback || util_1.createPromiseCallback();
        const query = { _id: this.id };
        const param = {
            collectionName: this._coll,
            query: query,
            multi: false,
            projection: this.projection
        };
        this.request
            .send('database.queryDocument', param)
            .then(res => {
            if (res.code) {
                callback(0, res);
            }
            else {
                const documents = util_2.Util.formatResDocumentData(res.data.list);
                callback(0, {
                    data: documents,
                    requestId: res.requestId,
                    total: res.TotalCount,
                    limit: res.Limit,
                    offset: res.Offset
                });
            }
        })
            .catch(err => {
            callback(err);
        });
        return callback.promise;
    }
    field(projection) {
        for (let k in projection) {
            if (projection[k]) {
                projection[k] = 1;
            }
            else {
                projection[k] = 0;
            }
        }
        return new DocumentReference(this._db, this._coll, this.id, projection);
    }
}
exports.DocumentReference = DocumentReference;

}, function(modId) { var map = {"./lib/util":1650268489755,"./index":1650268489738,"./util":1650268489743,"./serializer/update":1650268489756,"./serializer/datatype":1650268489762,"./commands/update":1650268489757,"./realtime/websocket-client":1650268489763}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489755, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.createPromiseCallback = () => {
    let cb;
    if (!Promise) {
        cb = () => { };
        cb.promise = {};
        const throwPromiseNotDefined = () => {
            throw new Error('Your Node runtime does support ES6 Promises. ' +
                'Set "global.Promise" to your preferred implementation of promises.');
        };
        Object.defineProperty(cb.promise, 'then', { get: throwPromiseNotDefined });
        Object.defineProperty(cb.promise, 'catch', { get: throwPromiseNotDefined });
        return cb;
    }
    const promise = new Promise((resolve, reject) => {
        cb = (err, data) => {
            if (err)
                return reject(err);
            return resolve(data);
        };
    });
    cb.promise = promise;
    return cb;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489756, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const update_1 = require("../commands/update");
const symbol_1 = require("../helper/symbol");
const type_1 = require("../utils/type");
const operator_map_1 = require("../operator-map");
const common_1 = require("./common");
class UpdateSerializer {
    constructor() {
    }
    static encode(query) {
        const stringifier = new UpdateSerializer();
        return stringifier.encodeUpdate(query);
    }
    encodeUpdate(query) {
        if (update_1.isUpdateCommand(query)) {
            return this.encodeUpdateCommand(query);
        }
        else if (type_1.getType(query) === 'object') {
            return this.encodeUpdateObject(query);
        }
        else {
            return query;
        }
    }
    encodeUpdateCommand(query) {
        if (query.fieldName === symbol_1.SYMBOL_UNSET_FIELD_NAME) {
            throw new Error('Cannot encode a comparison command with unset field name');
        }
        switch (query.operator) {
            case update_1.UPDATE_COMMANDS_LITERAL.SET:
            case update_1.UPDATE_COMMANDS_LITERAL.REMOVE:
            case update_1.UPDATE_COMMANDS_LITERAL.INC:
            case update_1.UPDATE_COMMANDS_LITERAL.MUL: {
                return this.encodeFieldUpdateCommand(query);
            }
            case update_1.UPDATE_COMMANDS_LITERAL.PUSH:
            case update_1.UPDATE_COMMANDS_LITERAL.POP:
            case update_1.UPDATE_COMMANDS_LITERAL.SHIFT:
            case update_1.UPDATE_COMMANDS_LITERAL.UNSHIFT: {
                return this.encodeArrayUpdateCommand(query);
            }
            default: {
                return this.encodeFieldUpdateCommand(query);
            }
        }
    }
    encodeFieldUpdateCommand(query) {
        const $op = operator_map_1.operatorToString(query.operator);
        switch (query.operator) {
            case update_1.UPDATE_COMMANDS_LITERAL.REMOVE: {
                return {
                    [$op]: {
                        [query.fieldName]: '',
                    },
                };
            }
            case update_1.UPDATE_COMMANDS_LITERAL.SET:
            case update_1.UPDATE_COMMANDS_LITERAL.INC:
            case update_1.UPDATE_COMMANDS_LITERAL.MUL:
            default: {
                return {
                    [$op]: {
                        [query.fieldName]: query.operands[0],
                    },
                };
            }
        }
    }
    encodeArrayUpdateCommand(query) {
        const $op = operator_map_1.operatorToString(query.operator);
        switch (query.operator) {
            case update_1.UPDATE_COMMANDS_LITERAL.PUSH: {
                const modifiers = {
                    $each: query.operands.map(common_1.encodeInternalDataType),
                };
                return {
                    [$op]: {
                        [query.fieldName]: modifiers,
                    },
                };
            }
            case update_1.UPDATE_COMMANDS_LITERAL.UNSHIFT: {
                const modifiers = {
                    $each: query.operands.map(common_1.encodeInternalDataType),
                    $position: 0,
                };
                return {
                    [$op]: {
                        [query.fieldName]: modifiers,
                    },
                };
            }
            case update_1.UPDATE_COMMANDS_LITERAL.POP: {
                return {
                    [$op]: {
                        [query.fieldName]: 1,
                    },
                };
            }
            case update_1.UPDATE_COMMANDS_LITERAL.SHIFT: {
                return {
                    [$op]: {
                        [query.fieldName]: -1,
                    },
                };
            }
            default: {
                return {
                    [$op]: {
                        [query.fieldName]: common_1.encodeInternalDataType(query.operands),
                    },
                };
            }
        }
    }
    encodeUpdateObject(query) {
        const flattened = common_1.flattenQueryObject(query);
        for (const key in flattened) {
            if (/^\$/.test(key))
                continue;
            let val = flattened[key];
            if (update_1.isUpdateCommand(val)) {
                flattened[key] = val._setFieldName(key);
                const condition = this.encodeUpdateCommand(flattened[key]);
                common_1.mergeConditionAfterEncode(flattened, condition, key);
            }
            else {
                flattened[key] = val = common_1.encodeInternalDataType(val);
                const $setCommand = new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.SET, [val], key);
                const condition = this.encodeUpdateCommand($setCommand);
                common_1.mergeConditionAfterEncode(flattened, condition, key);
            }
        }
        return flattened;
    }
}
exports.UpdateSerializer = UpdateSerializer;

}, function(modId) { var map = {"../commands/update":1650268489757,"../helper/symbol":1650268489745,"../utils/type":1650268489747,"../operator-map":1650268489758,"./common":1650268489761}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489757, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = require("../helper/symbol");
exports.SET = 'set';
exports.REMOVE = 'remove';
exports.INC = 'inc';
exports.MUL = 'mul';
exports.PUSH = 'push';
exports.POP = 'pop';
exports.SHIFT = 'shift';
exports.UNSHIFT = 'unshift';
var UPDATE_COMMANDS_LITERAL;
(function (UPDATE_COMMANDS_LITERAL) {
    UPDATE_COMMANDS_LITERAL["SET"] = "set";
    UPDATE_COMMANDS_LITERAL["REMOVE"] = "remove";
    UPDATE_COMMANDS_LITERAL["INC"] = "inc";
    UPDATE_COMMANDS_LITERAL["MUL"] = "mul";
    UPDATE_COMMANDS_LITERAL["PUSH"] = "push";
    UPDATE_COMMANDS_LITERAL["POP"] = "pop";
    UPDATE_COMMANDS_LITERAL["SHIFT"] = "shift";
    UPDATE_COMMANDS_LITERAL["UNSHIFT"] = "unshift";
})(UPDATE_COMMANDS_LITERAL = exports.UPDATE_COMMANDS_LITERAL || (exports.UPDATE_COMMANDS_LITERAL = {}));
class UpdateCommand {
    constructor(operator, operands, fieldName) {
        this._internalType = symbol_1.SYMBOL_UPDATE_COMMAND;
        Object.defineProperties(this, {
            _internalType: {
                enumerable: false,
                configurable: false,
            },
        });
        this.operator = operator;
        this.operands = operands;
        this.fieldName = fieldName || symbol_1.SYMBOL_UNSET_FIELD_NAME;
    }
    _setFieldName(fieldName) {
        const command = new UpdateCommand(this.operator, this.operands, fieldName);
        return command;
    }
}
exports.UpdateCommand = UpdateCommand;
function isUpdateCommand(object) {
    return object && (object instanceof UpdateCommand) && (object._internalType === symbol_1.SYMBOL_UPDATE_COMMAND);
}
exports.isUpdateCommand = isUpdateCommand;
function isKnownUpdateCommand(object) {
    return isUpdateCommand(object) && (object.operator.toUpperCase() in UPDATE_COMMANDS_LITERAL);
}
exports.isKnownUpdateCommand = isKnownUpdateCommand;
exports.default = UpdateCommand;

}, function(modId) { var map = {"../helper/symbol":1650268489745}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489758, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("./commands/query");
const logic_1 = require("./commands/logic");
const update_1 = require("./commands/update");
exports.OperatorMap = {};
for (const key in query_1.QUERY_COMMANDS_LITERAL) {
    exports.OperatorMap[key] = `$${key.toLowerCase()}`;
}
for (const key in logic_1.LOGIC_COMMANDS_LITERAL) {
    exports.OperatorMap[key] = `$${key.toLowerCase()}`;
}
for (const key in update_1.UPDATE_COMMANDS_LITERAL) {
    exports.OperatorMap[key] = `$${key.toLowerCase()}`;
}
exports.OperatorMap[query_1.QUERY_COMMANDS_LITERAL.NEQ] = '$ne';
exports.OperatorMap[update_1.UPDATE_COMMANDS_LITERAL.REMOVE] = '$unset';
exports.OperatorMap[update_1.UPDATE_COMMANDS_LITERAL.SHIFT] = '$pop';
exports.OperatorMap[update_1.UPDATE_COMMANDS_LITERAL.UNSHIFT] = '$push';
function operatorToString(operator) {
    return exports.OperatorMap[operator] || `$${operator.toLowerCase()}`;
}
exports.operatorToString = operatorToString;

}, function(modId) { var map = {"./commands/query":1650268489759,"./commands/logic":1650268489760,"./commands/update":1650268489757}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489759, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const logic_1 = require("./logic");
const symbol_1 = require("../helper/symbol");
const index_1 = require("../geo/index");
const type_1 = require("../utils/type");
exports.EQ = 'eq';
exports.NEQ = 'neq';
exports.GT = 'gt';
exports.GTE = 'gte';
exports.LT = 'lt';
exports.LTE = 'lte';
exports.IN = 'in';
exports.NIN = 'nin';
var QUERY_COMMANDS_LITERAL;
(function (QUERY_COMMANDS_LITERAL) {
    QUERY_COMMANDS_LITERAL["EQ"] = "eq";
    QUERY_COMMANDS_LITERAL["NEQ"] = "neq";
    QUERY_COMMANDS_LITERAL["GT"] = "gt";
    QUERY_COMMANDS_LITERAL["GTE"] = "gte";
    QUERY_COMMANDS_LITERAL["LT"] = "lt";
    QUERY_COMMANDS_LITERAL["LTE"] = "lte";
    QUERY_COMMANDS_LITERAL["IN"] = "in";
    QUERY_COMMANDS_LITERAL["NIN"] = "nin";
    QUERY_COMMANDS_LITERAL["GEO_NEAR"] = "geoNear";
    QUERY_COMMANDS_LITERAL["GEO_WITHIN"] = "geoWithin";
    QUERY_COMMANDS_LITERAL["GEO_INTERSECTS"] = "geoIntersects";
})(QUERY_COMMANDS_LITERAL = exports.QUERY_COMMANDS_LITERAL || (exports.QUERY_COMMANDS_LITERAL = {}));
class QueryCommand extends logic_1.LogicCommand {
    constructor(operator, operands, fieldName) {
        super(operator, operands, fieldName);
        this.operator = operator;
        this._internalType = symbol_1.SYMBOL_QUERY_COMMAND;
    }
    _setFieldName(fieldName) {
        const command = new QueryCommand(this.operator, this.operands, fieldName);
        return command;
    }
    eq(val) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.EQ, [val], this.fieldName);
        return this.and(command);
    }
    neq(val) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.NEQ, [val], this.fieldName);
        return this.and(command);
    }
    gt(val) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.GT, [val], this.fieldName);
        return this.and(command);
    }
    gte(val) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.GTE, [val], this.fieldName);
        return this.and(command);
    }
    lt(val) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.LT, [val], this.fieldName);
        return this.and(command);
    }
    lte(val) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.LTE, [val], this.fieldName);
        return this.and(command);
    }
    in(list) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.IN, list, this.fieldName);
        return this.and(command);
    }
    nin(list) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.NIN, list, this.fieldName);
        return this.and(command);
    }
    geoNear(val) {
        if (!(val.geometry instanceof index_1.Point)) {
            throw new TypeError(`"geometry" must be of type Point. Received type ${typeof val.geometry}`);
        }
        if (val.maxDistance !== undefined && !type_1.isNumber(val.maxDistance)) {
            throw new TypeError(`"maxDistance" must be of type Number. Received type ${typeof val.maxDistance}`);
        }
        if (val.minDistance !== undefined && !type_1.isNumber(val.minDistance)) {
            throw new TypeError(`"minDistance" must be of type Number. Received type ${typeof val.minDistance}`);
        }
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.GEO_NEAR, [val], this.fieldName);
        return this.and(command);
    }
    geoWithin(val) {
        if (!(val.geometry instanceof index_1.MultiPolygon) && !(val.geometry instanceof index_1.Polygon)) {
            throw new TypeError(`"geometry" must be of type Polygon or MultiPolygon. Received type ${typeof val.geometry}`);
        }
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.GEO_WITHIN, [val], this.fieldName);
        return this.and(command);
    }
    geoIntersects(val) {
        if (!(val.geometry instanceof index_1.Point) &&
            !(val.geometry instanceof index_1.LineString) &&
            !(val.geometry instanceof index_1.Polygon) &&
            !(val.geometry instanceof index_1.MultiPoint) &&
            !(val.geometry instanceof index_1.MultiLineString) &&
            !(val.geometry instanceof index_1.MultiPolygon)) {
            throw new TypeError(`"geometry" must be of type Point, LineString, Polygon, MultiPoint, MultiLineString or MultiPolygon. Received type ${typeof val.geometry}`);
        }
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.GEO_INTERSECTS, [val], this.fieldName);
        return this.and(command);
    }
}
exports.QueryCommand = QueryCommand;
function isQueryCommand(object) {
    return object && object instanceof QueryCommand && object._internalType === symbol_1.SYMBOL_QUERY_COMMAND;
}
exports.isQueryCommand = isQueryCommand;
function isKnownQueryCommand(object) {
    return isQueryCommand(object) && object.operator.toUpperCase() in QUERY_COMMANDS_LITERAL;
}
exports.isKnownQueryCommand = isKnownQueryCommand;
function isComparisonCommand(object) {
    return isQueryCommand(object);
}
exports.isComparisonCommand = isComparisonCommand;
exports.default = QueryCommand;

}, function(modId) { var map = {"./logic":1650268489760,"../helper/symbol":1650268489745,"../geo/index":1650268489739,"../utils/type":1650268489747}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489760, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = require("../helper/symbol");
const query_1 = require("./query");
exports.AND = 'and';
exports.OR = 'or';
exports.NOT = 'not';
exports.NOR = 'nor';
var LOGIC_COMMANDS_LITERAL;
(function (LOGIC_COMMANDS_LITERAL) {
    LOGIC_COMMANDS_LITERAL["AND"] = "and";
    LOGIC_COMMANDS_LITERAL["OR"] = "or";
    LOGIC_COMMANDS_LITERAL["NOT"] = "not";
    LOGIC_COMMANDS_LITERAL["NOR"] = "nor";
})(LOGIC_COMMANDS_LITERAL = exports.LOGIC_COMMANDS_LITERAL || (exports.LOGIC_COMMANDS_LITERAL = {}));
class LogicCommand {
    constructor(operator, operands, fieldName) {
        this._internalType = symbol_1.SYMBOL_LOGIC_COMMAND;
        Object.defineProperties(this, {
            _internalType: {
                enumerable: false,
                configurable: false,
            },
        });
        this.operator = operator;
        this.operands = operands;
        this.fieldName = fieldName || symbol_1.SYMBOL_UNSET_FIELD_NAME;
        if (this.fieldName !== symbol_1.SYMBOL_UNSET_FIELD_NAME) {
            operands = operands.slice();
            this.operands = operands;
            for (let i = 0, len = operands.length; i < len; i++) {
                const query = operands[i];
                if (isLogicCommand(query) || query_1.isQueryCommand(query)) {
                    operands[i] = query._setFieldName(this.fieldName);
                }
            }
        }
    }
    _setFieldName(fieldName) {
        const operands = this.operands.map(operand => {
            if (operand instanceof LogicCommand) {
                return operand._setFieldName(fieldName);
            }
            else {
                return operand;
            }
        });
        const command = new LogicCommand(this.operator, operands, fieldName);
        return command;
    }
    and(...__expressions__) {
        const expressions = Array.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        expressions.unshift(this);
        return new LogicCommand(LOGIC_COMMANDS_LITERAL.AND, expressions, this.fieldName);
    }
    or(...__expressions__) {
        const expressions = Array.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        expressions.unshift(this);
        return new LogicCommand(LOGIC_COMMANDS_LITERAL.OR, expressions, this.fieldName);
    }
}
exports.LogicCommand = LogicCommand;
function isLogicCommand(object) {
    return object && (object instanceof LogicCommand) && (object._internalType === symbol_1.SYMBOL_LOGIC_COMMAND);
}
exports.isLogicCommand = isLogicCommand;
function isKnownLogicCommand(object) {
    return isLogicCommand && (object.operator.toUpperCase() in LOGIC_COMMANDS_LITERAL);
}
exports.isKnownLogicCommand = isKnownLogicCommand;
exports.default = LogicCommand;

}, function(modId) { var map = {"../helper/symbol":1650268489745,"./query":1650268489759}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489761, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../utils/type");
const datatype_1 = require("./datatype");
function flatten(query, shouldPreserverObject, parents, visited) {
    const cloned = Object.assign({}, query);
    for (const key in query) {
        if (/^\$/.test(key))
            continue;
        const value = query[key];
        if (!value)
            continue;
        if (type_1.isObject(value) && !shouldPreserverObject(value)) {
            if (visited.indexOf(value) > -1) {
                throw new Error('Cannot convert circular structure to JSON');
            }
            const newParents = [
                ...parents,
                key,
            ];
            const newVisited = [
                ...visited,
                value,
            ];
            const flattenedChild = flatten(value, shouldPreserverObject, newParents, newVisited);
            cloned[key] = flattenedChild;
            let hasKeyNotCombined = false;
            for (const childKey in flattenedChild) {
                if (!/^\$/.test(childKey)) {
                    cloned[`${key}.${childKey}`] = flattenedChild[childKey];
                    delete cloned[key][childKey];
                }
                else {
                    hasKeyNotCombined = true;
                }
            }
            if (!hasKeyNotCombined) {
                delete cloned[key];
            }
        }
    }
    return cloned;
}
function flattenQueryObject(query) {
    return flatten(query, isConversionRequired, [], [query]);
}
exports.flattenQueryObject = flattenQueryObject;
function flattenObject(object) {
    return flatten(object, (_) => false, [], [object]);
}
exports.flattenObject = flattenObject;
function mergeConditionAfterEncode(query, condition, key) {
    if (!condition[key]) {
        delete query[key];
    }
    for (const conditionKey in condition) {
        if (query[conditionKey]) {
            if (type_1.isArray(query[conditionKey])) {
                query[conditionKey].push(condition[conditionKey]);
            }
            else if (type_1.isObject(query[conditionKey])) {
                if (type_1.isObject(condition[conditionKey])) {
                    Object.assign(query[conditionKey], condition[conditionKey]);
                }
                else {
                    console.warn(`unmergable condition, query is object but condition is ${type_1.getType(condition)}, can only overwrite`, condition, key);
                    query[conditionKey] = condition[conditionKey];
                }
            }
            else {
                console.warn(`to-merge query is of type ${type_1.getType(query)}, can only overwrite`, query, condition, key);
                query[conditionKey] = condition[conditionKey];
            }
        }
        else {
            query[conditionKey] = condition[conditionKey];
        }
    }
}
exports.mergeConditionAfterEncode = mergeConditionAfterEncode;
function isConversionRequired(val) {
    return type_1.isInternalObject(val) || type_1.isDate(val) || type_1.isRegExp(val);
}
exports.isConversionRequired = isConversionRequired;
function encodeInternalDataType(val) {
    return datatype_1.serialize(val);
}
exports.encodeInternalDataType = encodeInternalDataType;
function decodeInternalDataType(object) {
    return datatype_1.deserialize(object);
}
exports.decodeInternalDataType = decodeInternalDataType;

}, function(modId) { var map = {"../utils/type":1650268489747,"./datatype":1650268489762}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489762, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = require("../helper/symbol");
const type_1 = require("../utils/type");
const index_1 = require("../geo/index");
const index_2 = require("../serverDate/index");
function serialize(val) {
    return serializeHelper(val, [val]);
}
exports.serialize = serialize;
function serializeHelper(val, visited) {
    if (type_1.isInternalObject(val)) {
        switch (val._internalType) {
            case symbol_1.SYMBOL_GEO_POINT: {
                return val.toJSON();
            }
            case symbol_1.SYMBOL_SERVER_DATE: {
                return val.parse();
            }
            case symbol_1.SYMBOL_REGEXP: {
                return val.parse();
            }
            default: {
                return val.toJSON ? val.toJSON() : val;
            }
        }
    }
    else if (type_1.isDate(val)) {
        return {
            $date: +val,
        };
    }
    else if (type_1.isRegExp(val)) {
        return {
            $regex: val.source,
            $options: val.flags,
        };
    }
    else if (type_1.isArray(val)) {
        return val.map(item => {
            if (visited.indexOf(item) > -1) {
                throw new Error('Cannot convert circular structure to JSON');
            }
            return serializeHelper(item, [
                ...visited,
                item,
            ]);
        });
    }
    else if (type_1.isObject(val)) {
        const ret = Object.assign({}, val);
        for (const key in ret) {
            if (visited.indexOf(ret[key]) > -1) {
                throw new Error('Cannot convert circular structure to JSON');
            }
            ret[key] = serializeHelper(ret[key], [
                ...visited,
                ret[key],
            ]);
        }
        return ret;
    }
    else {
        return val;
    }
}
function deserialize(object) {
    const ret = Object.assign({}, object);
    for (const key in ret) {
        switch (key) {
            case '$date': {
                switch (type_1.getType(ret[key])) {
                    case 'number': {
                        return new Date(ret[key]);
                    }
                    case 'object': {
                        return new index_2.ServerDate(ret[key]);
                    }
                }
                break;
            }
            case 'type': {
                switch (ret.type) {
                    case 'Point': {
                        if (type_1.isArray(ret.coordinates) && type_1.isNumber(ret.coordinates[0]) && type_1.isNumber(ret.coordinates[1])) {
                            return new index_1.Point(ret.coordinates[0], ret.coordinates[1]);
                        }
                        break;
                    }
                }
                break;
            }
        }
    }
    return object;
}
exports.deserialize = deserialize;

}, function(modId) { var map = {"../helper/symbol":1650268489745,"../utils/type":1650268489747,"../geo/index":1650268489739,"../serverDate/index":1650268489744}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489763, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const virtual_websocket_client_1 = require("./virtual-websocket-client");
const utils_1 = require("../utils/utils");
const message_1 = require("./message");
const ws_event_1 = require("./ws-event");
const error_1 = require("../utils/error");
const error_2 = require("./error");
const error_config_1 = require("../config/error.config");
const WS_READY_STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
};
const MAX_RTT_OBSERVED = 3;
const DEFAULT_EXPECTED_EVENT_WAIT_TIME = 5000;
const DEFAULT_UNTRUSTED_RTT_THRESHOLD = 10000;
const DEFAULT_MAX_RECONNECT = 5;
const DEFAULT_WS_RECONNECT_INTERVAL = 10000;
const DEFAULT_PING_FAIL_TOLERANCE = 2;
const DEFAULT_PONG_MISS_TOLERANCE = 2;
const DEFAULT_LOGIN_TIMEOUT = 5000;
class RealtimeWebSocketClient {
    constructor(options) {
        this._virtualWSClient = new Set();
        this._queryIdClientMap = new Map();
        this._watchIdClientMap = new Map();
        this._pingFailed = 0;
        this._pongMissed = 0;
        this._logins = new Map();
        this._wsReadySubsribers = [];
        this._wsResponseWait = new Map();
        this._rttObserved = [];
        this.initWebSocketConnection = async (reconnect, availableRetries = this._maxReconnect) => {
            if (reconnect && this._reconnectState) {
                return;
            }
            if (reconnect) {
                this._reconnectState = true;
            }
            if (this._wsInitPromise) {
                return this._wsInitPromise;
            }
            console.log(`[realtime] initWebSocketConnection reconnect ${reconnect} availableRetries ${availableRetries}`);
            if (reconnect) {
                this.pauseClients();
            }
            this.close(ws_event_1.CLOSE_EVENT_CODE.ReconnectWebSocket);
            this._wsInitPromise = new Promise(async (resolve, reject) => {
                try {
                    console.log('[realtime] initWebSocketConnection start throwErrorIfNetworkOffline');
                    console.log('[realtime] initWebSocketConnection start getSignature');
                    await this.getAccessToken();
                    console.log('[realtime] initWebSocketConnection getSignature success');
                    console.log('[realtime] initWebSocketConnection start connectSocket');
                    await new Promise(success => {
                        this._ws = new WebSocket('wss://tcb-ws.tencentcloudapi.com');
                        success();
                    });
                    console.log('[realtime] initWebSocketConnection connectSocket successfully fired');
                    await this.initWebSocketEvent();
                    resolve();
                    if (reconnect) {
                        this.resumeClients();
                        this._reconnectState = false;
                    }
                }
                catch (e) {
                    console.error('[realtime] initWebSocketConnection connect fail', e);
                    if (availableRetries > 0) {
                        const isConnected = true;
                        console.log('[realtime] initWebSocketConnection waiting for network online');
                        console.log('[realtime] initWebSocketConnection network online');
                        this._wsInitPromise = undefined;
                        if (isConnected) {
                            console.log(`[realtime] initWebSocketConnection sleep ${this._reconnectInterval}ms`);
                            await utils_1.sleep(this._reconnectInterval);
                            if (reconnect) {
                                this._reconnectState = false;
                            }
                        }
                        resolve(this.initWebSocketConnection(reconnect, availableRetries - 1));
                    }
                    else {
                        reject(e);
                        if (reconnect) {
                            this.closeAllClients(new error_1.CloudSDKError({
                                errCode: error_config_1.ERR_CODE.SDK_DATABASE_REALTIME_LISTENER_RECONNECT_WATCH_FAIL,
                                errMsg: e
                            }));
                        }
                    }
                }
            });
            let success = false;
            try {
                await this._wsInitPromise;
                success = true;
                this._wsReadySubsribers.forEach(({ resolve }) => resolve());
            }
            catch (e) {
                this._wsReadySubsribers.forEach(({ reject }) => reject());
            }
            finally {
                this._wsInitPromise = undefined;
                this._wsReadySubsribers = [];
            }
            console.log(`[realtime] initWebSocketConnection ${success ? 'success' : 'fail'}`);
        };
        this.initWebSocketEvent = () => new Promise((resolve, reject) => {
            if (!this._ws) {
                throw new Error('can not initWebSocketEvent, ws not exists');
            }
            let wsOpened = false;
            this._ws.onopen = event => {
                console.warn('[realtime] ws event: open', event);
                wsOpened = true;
                resolve();
            };
            this._ws.onerror = event => {
                this._logins = new Map();
                if (!wsOpened) {
                    console.error('[realtime] ws open failed with ws event: error', event);
                    reject(event);
                }
                else {
                    console.error('[realtime] ws event: error', event);
                    this.clearHeartbeat();
                    this._virtualWSClient.forEach(client => client.closeWithError(new error_1.CloudSDKError({
                        errCode: error_config_1.ERR_CODE.SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_ERROR,
                        errMsg: event
                    })));
                }
            };
            this._ws.onclose = closeEvent => {
                console.warn('[realtime] ws event: close', closeEvent);
                this._logins = new Map();
                this.clearHeartbeat();
                switch (closeEvent.code) {
                    case ws_event_1.CLOSE_EVENT_CODE.ReconnectWebSocket: {
                        break;
                    }
                    case ws_event_1.CLOSE_EVENT_CODE.NoRealtimeListeners: {
                        break;
                    }
                    case ws_event_1.CLOSE_EVENT_CODE.HeartbeatPingError:
                    case ws_event_1.CLOSE_EVENT_CODE.HeartbeatPongTimeoutError:
                    case ws_event_1.CLOSE_EVENT_CODE.NormalClosure:
                    case ws_event_1.CLOSE_EVENT_CODE.AbnormalClosure: {
                        if (this._maxReconnect > 0) {
                            this.initWebSocketConnection(true, this._maxReconnect);
                        }
                        else {
                            this.closeAllClients(ws_event_1.getWSCloseError(closeEvent.code));
                        }
                        break;
                    }
                    case ws_event_1.CLOSE_EVENT_CODE.NoAuthentication: {
                        this.closeAllClients(ws_event_1.getWSCloseError(closeEvent.code, closeEvent.reason));
                        break;
                    }
                    default: {
                        if (this._maxReconnect > 0) {
                            this.initWebSocketConnection(true, this._maxReconnect);
                        }
                        else {
                            this.closeAllClients(ws_event_1.getWSCloseError(closeEvent.code));
                        }
                    }
                }
            };
            this._ws.onmessage = res => {
                const rawMsg = res.data;
                this.heartbeat();
                let msg;
                try {
                    msg = JSON.parse(rawMsg);
                }
                catch (e) {
                    throw new Error(`[realtime] onMessage parse res.data error: ${e}`);
                }
                console.log(`[realtime] onMessage ${msg.msgType} (${new Date().toLocaleString()})`, msg);
                if (msg.msgType === 'ERROR') {
                    let virtualWatch = null;
                    this._virtualWSClient.forEach(item => {
                        if (item.watchId === msg.watchId) {
                            virtualWatch = item;
                        }
                    });
                    if (virtualWatch) {
                        virtualWatch.listener.onError(msg);
                    }
                }
                const responseWaitSpec = this._wsResponseWait.get(msg.requestId);
                if (responseWaitSpec) {
                    try {
                        if (msg.msgType === 'ERROR') {
                            responseWaitSpec.reject(new error_2.RealtimeErrorMessageError(msg));
                        }
                        else {
                            responseWaitSpec.resolve(msg);
                        }
                    }
                    catch (e) {
                        console.error('ws onMessage responseWaitSpec.resolve(msg) errored:', e);
                    }
                    finally {
                        this._wsResponseWait.delete(msg.requestId);
                    }
                    if (responseWaitSpec.skipOnMessage) {
                        return;
                    }
                }
                if (msg.msgType === 'PONG') {
                    if (this._lastPingSendTS) {
                        const rtt = Date.now() - this._lastPingSendTS;
                        if (rtt > DEFAULT_UNTRUSTED_RTT_THRESHOLD) {
                            console.warn(`[realtime] untrusted rtt observed: ${rtt}`);
                            return;
                        }
                        if (this._rttObserved.length >= MAX_RTT_OBSERVED) {
                            this._rttObserved.splice(0, this._rttObserved.length - MAX_RTT_OBSERVED + 1);
                        }
                        this._rttObserved.push(rtt);
                    }
                    return;
                }
                let client = msg.watchId && this._watchIdClientMap.get(msg.watchId);
                if (client) {
                    client.onMessage(msg);
                }
                else {
                    console.error(`[realtime] no realtime listener found responsible for watchId ${msg.watchId}: `, msg);
                    switch (msg.msgType) {
                        case 'INIT_EVENT':
                        case 'NEXT_EVENT':
                        case 'CHECK_EVENT': {
                            client = this._queryIdClientMap.get(msg.msgData.queryID);
                            if (client) {
                                client.onMessage(msg);
                            }
                            break;
                        }
                        default: {
                            for (const [watchId, client] of this._watchIdClientMap) {
                                console.log('watchid*****', watchId);
                                client.onMessage(msg);
                                break;
                            }
                        }
                    }
                }
            };
            this.heartbeat();
        });
        this.isWSConnected = () => {
            return Boolean(this._ws && this._ws.readyState === WS_READY_STATE.OPEN);
        };
        this.onceWSConnected = async () => {
            if (this.isWSConnected()) {
                return;
            }
            if (this._wsInitPromise) {
                return this._wsInitPromise;
            }
            return new Promise((resolve, reject) => {
                this._wsReadySubsribers.push({
                    resolve,
                    reject
                });
            });
        };
        this.webLogin = async (envId, refresh) => {
            if (!refresh) {
                if (envId) {
                    const loginInfo = this._logins.get(envId);
                    if (loginInfo) {
                        if (loginInfo.loggedIn && loginInfo.loginResult) {
                            console.log('[realtime] login: already logged in');
                            return loginInfo.loginResult;
                        }
                        else if (loginInfo.loggingInPromise) {
                            return loginInfo.loggingInPromise;
                        }
                    }
                }
                else {
                    const emptyEnvLoginInfo = this._logins.get('');
                    if (emptyEnvLoginInfo && emptyEnvLoginInfo.loggingInPromise) {
                        return emptyEnvLoginInfo.loggingInPromise;
                    }
                }
            }
            console.log('[realtime] login: logging in');
            const promise = new Promise(async (resolve, reject) => {
                try {
                    const accessTokenRes = await this.getAccessToken();
                    const loginMsg = {
                        watchId: undefined,
                        requestId: message_1.genRequestId(),
                        msgType: 'LOGIN',
                        msgData: {
                            envId: accessTokenRes.env || '',
                            accessToken: accessTokenRes.accessToken,
                            referrer: 'web',
                            sdkVersion: '',
                            dataVersion: ''
                        }
                    };
                    const loginResMsg = await this.send({
                        msg: loginMsg,
                        waitResponse: true,
                        skipOnMessage: true,
                        timeout: DEFAULT_LOGIN_TIMEOUT
                    });
                    if (!loginResMsg.msgData.code) {
                        resolve({
                            envId: accessTokenRes.env
                        });
                    }
                    else {
                        reject(new Error(`${loginResMsg.msgData.code} ${loginResMsg.msgData.message}`));
                    }
                }
                catch (e) {
                    reject(e);
                }
            });
            let loginInfo = envId && this._logins.get(envId);
            const loginStartTS = Date.now();
            if (loginInfo) {
                loginInfo.loggedIn = false;
                loginInfo.loggingInPromise = promise;
                loginInfo.loginStartTS = loginStartTS;
            }
            else {
                loginInfo = {
                    loggedIn: false,
                    loggingInPromise: promise,
                    loginStartTS
                };
                this._logins.set(envId || '', loginInfo);
            }
            try {
                const loginResult = await promise;
                const curLoginInfo = envId && this._logins.get(envId);
                if (curLoginInfo &&
                    curLoginInfo === loginInfo &&
                    curLoginInfo.loginStartTS === loginStartTS) {
                    loginInfo.loggedIn = true;
                    loginInfo.loggingInPromise = undefined;
                    loginInfo.loginStartTS = undefined;
                    loginInfo.loginResult = loginResult;
                    return loginResult;
                }
                else if (curLoginInfo) {
                    if (curLoginInfo.loggedIn && curLoginInfo.loginResult) {
                        return curLoginInfo.loginResult;
                    }
                    else if (curLoginInfo.loggingInPromise) {
                        return curLoginInfo.loggingInPromise;
                    }
                    else {
                        throw new Error('ws unexpected login info');
                    }
                }
                else {
                    throw new Error('ws login info reset');
                }
            }
            catch (e) {
                loginInfo.loggedIn = false;
                loginInfo.loggingInPromise = undefined;
                loginInfo.loginStartTS = undefined;
                loginInfo.loginResult = undefined;
                throw e;
            }
        };
        this.getAccessToken = async () => {
            return this._context.appConfig.getAccessToken();
        };
        this.getWaitExpectedTimeoutLength = () => {
            if (!this._rttObserved.length) {
                return DEFAULT_EXPECTED_EVENT_WAIT_TIME;
            }
            return ((this._rttObserved.reduce((acc, cur) => acc + cur) /
                this._rttObserved.length) *
                1.5);
        };
        this.ping = async () => {
            const msg = {
                watchId: undefined,
                requestId: message_1.genRequestId(),
                msgType: 'PING',
                msgData: null
            };
            await this.send({
                msg
            });
            console.log('ping sent');
        };
        this.send = (opts) => new Promise(async (_resolve, _reject) => {
            let timeoutId;
            let _hasResolved = false;
            let _hasRejected = false;
            const resolve = (value) => {
                _hasResolved = true;
                timeoutId && clearTimeout(timeoutId);
                _resolve(value);
            };
            const reject = (error) => {
                _hasRejected = true;
                timeoutId && clearTimeout(timeoutId);
                _reject(error);
            };
            if (opts.timeout) {
                timeoutId = setTimeout(async () => {
                    if (!_hasResolved || !_hasRejected) {
                        await utils_1.sleep(0);
                        if (!_hasResolved || !_hasRejected) {
                            reject(new error_1.TimeoutError('wsclient.send timedout'));
                        }
                    }
                }, opts.timeout);
            }
            try {
                console.log(`[realtime] ws send ${opts.msg.msgType} (${new Date().toLocaleString()}): `, opts);
                if (this._wsInitPromise) {
                    await this._wsInitPromise;
                }
                if (!this._ws) {
                    reject(new Error('invalid state: ws connection not exists, can not send message'));
                    return;
                }
                if (this._ws.readyState !== WS_READY_STATE.OPEN) {
                    reject(new Error(`ws readyState invalid: ${this._ws.readyState}, can not send message`));
                    return;
                }
                if (opts.waitResponse) {
                    this._wsResponseWait.set(opts.msg.requestId, {
                        resolve,
                        reject,
                        skipOnMessage: opts.skipOnMessage
                    });
                }
                console.log('send msg:', opts.msg);
                try {
                    this._ws.send(JSON.stringify(opts.msg));
                    if (!opts.waitResponse) {
                        resolve();
                    }
                }
                catch (err) {
                    if (err) {
                        reject(err);
                        if (opts.waitResponse) {
                            this._wsResponseWait.delete(opts.msg.requestId);
                        }
                    }
                }
            }
            catch (e) {
                reject(e);
            }
        });
        this.closeAllClients = (error) => {
            this._virtualWSClient.forEach(client => {
                client.closeWithError(error);
            });
        };
        this.pauseClients = (clients) => {
            ;
            (clients || this._virtualWSClient).forEach(client => {
                client.pause();
            });
        };
        this.resumeClients = (clients) => {
            ;
            (clients || this._virtualWSClient).forEach(client => {
                client.resume();
            });
        };
        this.onWatchStart = (client, queryID) => {
            this._queryIdClientMap.set(queryID, client);
        };
        this.onWatchClose = (client, queryID) => {
            if (queryID) {
                this._queryIdClientMap.delete(queryID);
            }
            this._watchIdClientMap.delete(client.watchId);
            this._virtualWSClient.delete(client);
            if (!this._virtualWSClient.size) {
                this.close(ws_event_1.CLOSE_EVENT_CODE.NoRealtimeListeners);
            }
        };
        this._maxReconnect = options.maxReconnect || DEFAULT_MAX_RECONNECT;
        this._reconnectInterval =
            options.reconnectInterval || DEFAULT_WS_RECONNECT_INTERVAL;
        this._context = options.context;
    }
    heartbeat(immediate) {
        this.clearHeartbeat();
        this._pingTimeoutId = setTimeout(async () => {
            try {
                if (!this._ws || this._ws.readyState !== WS_READY_STATE.OPEN) {
                    return;
                }
                this._lastPingSendTS = Date.now();
                await this.ping();
                this._pingFailed = 0;
                this._pongTimeoutId = setTimeout(() => {
                    console.error('pong timed out');
                    if (this._pongMissed < DEFAULT_PONG_MISS_TOLERANCE) {
                        this._pongMissed++;
                        this.heartbeat(true);
                    }
                    else {
                        this.initWebSocketConnection(true);
                    }
                }, this._context.appConfig.realtimePongWaitTimeout);
            }
            catch (e) {
                if (this._pingFailed < DEFAULT_PING_FAIL_TOLERANCE) {
                    this._pingFailed++;
                    this.heartbeat();
                }
                else {
                    this.close(ws_event_1.CLOSE_EVENT_CODE.HeartbeatPingError);
                }
            }
        }, immediate ? 0 : this._context.appConfig.realtimePingInterval);
    }
    clearHeartbeat() {
        this._pingTimeoutId && clearTimeout(this._pingTimeoutId);
        this._pongTimeoutId && clearTimeout(this._pongTimeoutId);
    }
    close(code) {
        this.clearHeartbeat();
        if (this._ws) {
            this._ws.close(code, ws_event_1.CLOSE_EVENT_CODE_INFO[code].name);
            this._ws = undefined;
        }
    }
    watch(options) {
        if (!this._ws && !this._wsInitPromise) {
            this.initWebSocketConnection(false);
        }
        const virtualClient = new virtual_websocket_client_1.VirtualWebSocketClient(Object.assign({}, options, { send: this.send, login: this.webLogin, isWSConnected: this.isWSConnected, onceWSConnected: this.onceWSConnected, getWaitExpectedTimeoutLength: this.getWaitExpectedTimeoutLength, onWatchStart: this.onWatchStart, onWatchClose: this.onWatchClose, debug: true }));
        this._virtualWSClient.add(virtualClient);
        this._watchIdClientMap.set(virtualClient.watchId, virtualClient);
        return virtualClient.listener;
    }
}
exports.RealtimeWebSocketClient = RealtimeWebSocketClient;

}, function(modId) { var map = {"./virtual-websocket-client":1650268489764,"../utils/utils":1650268489768,"./message":1650268489765,"./ws-event":1650268489772,"../utils/error":1650268489766,"./error":1650268489771,"../config/error.config":1650268489767}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489764, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const set_1 = require("lodash/set");
const unset_1 = require("lodash/unset");
const cloneDeep_1 = require("lodash/cloneDeep");
const message_1 = require("./message");
const error_1 = require("../utils/error");
const error_config_1 = require("../config/error.config");
const utils_1 = require("../utils/utils");
const listener_1 = require("./listener");
const snapshot_1 = require("./snapshot");
const error_2 = require("./error");
var WATCH_STATUS;
(function (WATCH_STATUS) {
    WATCH_STATUS["LOGGINGIN"] = "LOGGINGIN";
    WATCH_STATUS["INITING"] = "INITING";
    WATCH_STATUS["REBUILDING"] = "REBUILDING";
    WATCH_STATUS["ACTIVE"] = "ACTIVE";
    WATCH_STATUS["ERRORED"] = "ERRORED";
    WATCH_STATUS["CLOSING"] = "CLOSING";
    WATCH_STATUS["CLOSED"] = "CLOSED";
    WATCH_STATUS["PAUSED"] = "PAUSED";
    WATCH_STATUS["RESUMING"] = "RESUMING";
})(WATCH_STATUS || (WATCH_STATUS = {}));
const DEFAULT_WAIT_TIME_ON_UNKNOWN_ERROR = 100;
const DEFAULT_MAX_AUTO_RETRY_ON_ERROR = 2;
const DEFAULT_MAX_SEND_ACK_AUTO_RETRY_ON_ERROR = 2;
const DEFAULT_SEND_ACK_DEBOUNCE_TIMEOUT = 10 * 1000;
const DEFAULT_INIT_WATCH_TIMEOUT = 10 * 1000;
const DEFAULT_REBUILD_WATCH_TIMEOUT = 10 * 1000;
class VirtualWebSocketClient {
    constructor(options) {
        this.watchStatus = WATCH_STATUS.INITING;
        this._login = async (envId, refresh) => {
            this.watchStatus = WATCH_STATUS.LOGGINGIN;
            const loginResult = await this.login(envId, refresh);
            if (!this.envId) {
                this.envId = loginResult.envId;
            }
            return loginResult;
        };
        this.initWatch = async (forceRefreshLogin) => {
            if (this._initWatchPromise) {
                return this._initWatchPromise;
            }
            this._initWatchPromise = new Promise(async (resolve, reject) => {
                try {
                    if (this.watchStatus === WATCH_STATUS.PAUSED) {
                        console.log('[realtime] initWatch cancelled on pause');
                        return resolve();
                    }
                    const { envId } = await this._login(this.envId, forceRefreshLogin);
                    if (this.watchStatus === WATCH_STATUS.PAUSED) {
                        console.log('[realtime] initWatch cancelled on pause');
                        return resolve();
                    }
                    this.watchStatus = WATCH_STATUS.INITING;
                    const initWatchMsg = {
                        watchId: this.watchId,
                        requestId: message_1.genRequestId(),
                        msgType: 'INIT_WATCH',
                        msgData: {
                            envId,
                            collName: this.collectionName,
                            query: this.query
                        }
                    };
                    const initEventMsg = await this.send({
                        msg: initWatchMsg,
                        waitResponse: true,
                        skipOnMessage: true,
                        timeout: DEFAULT_INIT_WATCH_TIMEOUT
                    });
                    const { events, currEvent } = initEventMsg.msgData;
                    this.sessionInfo = {
                        queryID: initEventMsg.msgData.queryID,
                        currentEventId: currEvent - 1,
                        currentDocs: []
                    };
                    if (events.length > 0) {
                        for (const e of events) {
                            e.ID = currEvent;
                        }
                        this.handleServerEvents(initEventMsg);
                    }
                    else {
                        this.sessionInfo.currentEventId = currEvent;
                        const snapshot = new snapshot_1.Snapshot({
                            id: currEvent,
                            docChanges: [],
                            docs: [],
                            type: 'init'
                        });
                        this.listener.onChange(snapshot);
                        this.scheduleSendACK();
                    }
                    this.onWatchStart(this, this.sessionInfo.queryID);
                    this.watchStatus = WATCH_STATUS.ACTIVE;
                    this._availableRetries.INIT_WATCH = DEFAULT_MAX_AUTO_RETRY_ON_ERROR;
                    resolve();
                }
                catch (e) {
                    this.handleWatchEstablishmentError(e, {
                        operationName: 'INIT_WATCH',
                        resolve,
                        reject
                    });
                }
            });
            let success = false;
            try {
                await this._initWatchPromise;
                success = true;
            }
            finally {
                this._initWatchPromise = undefined;
            }
            console.log(`[realtime] initWatch ${success ? 'success' : 'fail'}`);
        };
        this.rebuildWatch = async (forceRefreshLogin) => {
            if (this._rebuildWatchPromise) {
                return this._rebuildWatchPromise;
            }
            this._rebuildWatchPromise = new Promise(async (resolve, reject) => {
                try {
                    if (this.watchStatus === WATCH_STATUS.PAUSED) {
                        console.log('[realtime] rebuildWatch cancelled on pause');
                        return resolve();
                    }
                    const { envId } = await this._login(this.envId, forceRefreshLogin);
                    if (!this.sessionInfo) {
                        throw new Error('can not rebuildWatch without a successful initWatch (lack of sessionInfo)');
                    }
                    if (this.watchStatus === WATCH_STATUS.PAUSED) {
                        console.log('[realtime] rebuildWatch cancelled on pause');
                        return resolve();
                    }
                    this.watchStatus = WATCH_STATUS.REBUILDING;
                    const rebuildWatchMsg = {
                        watchId: this.watchId,
                        requestId: message_1.genRequestId(),
                        msgType: 'REBUILD_WATCH',
                        msgData: {
                            envId,
                            collName: this.collectionName,
                            queryID: this.sessionInfo.queryID,
                            eventID: this.sessionInfo.currentEventId
                        }
                    };
                    const nextEventMsg = await this.send({
                        msg: rebuildWatchMsg,
                        waitResponse: true,
                        skipOnMessage: false,
                        timeout: DEFAULT_REBUILD_WATCH_TIMEOUT
                    });
                    this.handleServerEvents(nextEventMsg);
                    this.watchStatus = WATCH_STATUS.ACTIVE;
                    this._availableRetries.REBUILD_WATCH = DEFAULT_MAX_AUTO_RETRY_ON_ERROR;
                    resolve();
                }
                catch (e) {
                    this.handleWatchEstablishmentError(e, {
                        operationName: 'REBUILD_WATCH',
                        resolve,
                        reject
                    });
                }
            });
            let success = false;
            try {
                await this._rebuildWatchPromise;
                success = true;
            }
            finally {
                this._rebuildWatchPromise = undefined;
            }
            console.log(`[realtime] rebuildWatch ${success ? 'success' : 'fail'}`);
        };
        this.handleWatchEstablishmentError = async (e, options) => {
            const isInitWatch = options.operationName === 'INIT_WATCH';
            const abortWatch = () => {
                this.closeWithError(new error_1.CloudSDKError({
                    errCode: isInitWatch
                        ? error_config_1.ERR_CODE.SDK_DATABASE_REALTIME_LISTENER_INIT_WATCH_FAIL
                        : error_config_1.ERR_CODE.SDK_DATABASE_REALTIME_LISTENER_REBUILD_WATCH_FAIL,
                    errMsg: e
                }));
                options.reject(e);
            };
            const retry = (refreshLogin) => {
                if (this.useRetryTicket(options.operationName)) {
                    if (isInitWatch) {
                        this._initWatchPromise = undefined;
                        options.resolve(this.initWatch(refreshLogin));
                    }
                    else {
                        this._rebuildWatchPromise = undefined;
                        options.resolve(this.rebuildWatch(refreshLogin));
                    }
                }
                else {
                    abortWatch();
                }
            };
            this.handleCommonError(e, {
                onSignError: () => retry(true),
                onTimeoutError: () => retry(false),
                onNotRetryableError: abortWatch,
                onCancelledError: options.reject,
                onUnknownError: async () => {
                    try {
                        const onWSDisconnected = async () => {
                            this.pause();
                            await this.onceWSConnected();
                            retry(true);
                        };
                        if (!this.isWSConnected()) {
                            await onWSDisconnected();
                        }
                        else {
                            await utils_1.sleep(DEFAULT_WAIT_TIME_ON_UNKNOWN_ERROR);
                            if (this.watchStatus === WATCH_STATUS.PAUSED) {
                                options.reject(new error_1.CancelledError(`${options.operationName} cancelled due to pause after unknownError`));
                            }
                            else if (!this.isWSConnected()) {
                                await onWSDisconnected();
                            }
                            else {
                                retry(false);
                            }
                        }
                    }
                    catch (e) {
                        retry(true);
                    }
                }
            });
        };
        this.closeWatch = async () => {
            const queryId = this.sessionInfo ? this.sessionInfo.queryID : '';
            if (this.watchStatus !== WATCH_STATUS.ACTIVE) {
                this.watchStatus = WATCH_STATUS.CLOSED;
                this.onWatchClose(this, queryId);
                return;
            }
            try {
                this.watchStatus = WATCH_STATUS.CLOSING;
                const closeWatchMsg = {
                    watchId: this.watchId,
                    requestId: message_1.genRequestId(),
                    msgType: 'CLOSE_WATCH',
                    msgData: null
                };
                await this.send({
                    msg: closeWatchMsg
                });
                this.sessionInfo = undefined;
                this.watchStatus = WATCH_STATUS.CLOSED;
            }
            catch (e) {
                this.closeWithError(new error_1.CloudSDKError({
                    errCode: error_config_1.ERR_CODE.SDK_DATABASE_REALTIME_LISTENER_CLOSE_WATCH_FAIL,
                    errMsg: e
                }));
            }
            finally {
                this.onWatchClose(this, queryId);
            }
        };
        this.scheduleSendACK = () => {
            this.clearACKSchedule();
            this._ackTimeoutId = setTimeout(() => {
                if (this._waitExpectedTimeoutId) {
                    this.scheduleSendACK();
                }
                else {
                    this.sendACK();
                }
            }, DEFAULT_SEND_ACK_DEBOUNCE_TIMEOUT);
        };
        this.clearACKSchedule = () => {
            if (this._ackTimeoutId) {
                clearTimeout(this._ackTimeoutId);
            }
        };
        this.sendACK = async () => {
            try {
                if (this.watchStatus !== WATCH_STATUS.ACTIVE) {
                    this.scheduleSendACK();
                    return;
                }
                if (!this.sessionInfo) {
                    console.warn('[realtime listener] can not send ack without a successful initWatch (lack of sessionInfo)');
                    return;
                }
                const ackMsg = {
                    watchId: this.watchId,
                    requestId: message_1.genRequestId(),
                    msgType: 'CHECK_LAST',
                    msgData: {
                        queryID: this.sessionInfo.queryID,
                        eventID: this.sessionInfo.currentEventId
                    }
                };
                await this.send({
                    msg: ackMsg
                });
                this.scheduleSendACK();
            }
            catch (e) {
                if (error_2.isRealtimeErrorMessageError(e)) {
                    const msg = e.payload;
                    switch (msg.msgData.code) {
                        case 'CHECK_LOGIN_FAILED':
                        case 'SIGN_EXPIRED_ERROR':
                        case 'SIGN_INVALID_ERROR':
                        case 'SIGN_PARAM_INVALID': {
                            this.rebuildWatch();
                            return;
                        }
                        case 'QUERYID_INVALID_ERROR':
                        case 'SYS_ERR':
                        case 'INVALIID_ENV':
                        case 'COLLECTION_PERMISSION_DENIED': {
                            this.closeWithError(new error_1.CloudSDKError({
                                errCode: error_config_1.ERR_CODE.SDK_DATABASE_REALTIME_LISTENER_CHECK_LAST_FAIL,
                                errMsg: msg.msgData.code
                            }));
                            return;
                        }
                        default: {
                            break;
                        }
                    }
                }
                if (this._availableRetries.CHECK_LAST &&
                    this._availableRetries.CHECK_LAST > 0) {
                    this._availableRetries.CHECK_LAST--;
                    this.scheduleSendACK();
                }
                else {
                    this.closeWithError(new error_1.CloudSDKError({
                        errCode: error_config_1.ERR_CODE.SDK_DATABASE_REALTIME_LISTENER_CHECK_LAST_FAIL,
                        errMsg: e
                    }));
                }
            }
        };
        this.handleCommonError = (e, options) => {
            if (error_2.isRealtimeErrorMessageError(e)) {
                const msg = e.payload;
                switch (msg.msgData.code) {
                    case 'CHECK_LOGIN_FAILED':
                    case 'SIGN_EXPIRED_ERROR':
                    case 'SIGN_INVALID_ERROR':
                    case 'SIGN_PARAM_INVALID': {
                        options.onSignError(e);
                        return;
                    }
                    case 'QUERYID_INVALID_ERROR':
                    case 'SYS_ERR':
                    case 'INVALIID_ENV':
                    case 'COLLECTION_PERMISSION_DENIED': {
                        options.onNotRetryableError(e);
                        return;
                    }
                    default: {
                        options.onNotRetryableError(e);
                        return;
                    }
                }
            }
            else if (error_1.isTimeoutError(e)) {
                options.onTimeoutError(e);
                return;
            }
            else if (error_1.isCancelledError(e)) {
                options.onCancelledError(e);
                return;
            }
            options.onUnknownError(e);
        };
        this.watchId = `watchid_${+new Date()}_${Math.random()}`;
        this.envId = options.envId;
        this.collectionName = options.collectionName;
        this.query = options.query;
        this.send = options.send;
        this.login = options.login;
        this.isWSConnected = options.isWSConnected;
        this.onceWSConnected = options.onceWSConnected;
        this.getWaitExpectedTimeoutLength = options.getWaitExpectedTimeoutLength;
        this.onWatchStart = options.onWatchStart;
        this.onWatchClose = options.onWatchClose;
        this.debug = options.debug;
        this._availableRetries = {
            INIT_WATCH: DEFAULT_MAX_AUTO_RETRY_ON_ERROR,
            REBUILD_WATCH: DEFAULT_MAX_AUTO_RETRY_ON_ERROR,
            CHECK_LAST: DEFAULT_MAX_SEND_ACK_AUTO_RETRY_ON_ERROR
        };
        this.listener = new listener_1.RealtimeListener({
            close: this.closeWatch,
            onChange: options.onChange,
            onError: options.onError,
            debug: this.debug,
            virtualClient: this
        });
        this.initWatch();
    }
    useRetryTicket(operationName) {
        if (this._availableRetries[operationName] &&
            this._availableRetries[operationName] > 0) {
            this._availableRetries[operationName]--;
            console.log(`[realtime] ${operationName} use a retry ticket, now only ${this._availableRetries[operationName]} retry left`);
            return true;
        }
        return false;
    }
    async handleServerEvents(msg) {
        try {
            this.scheduleSendACK();
            await this._handleServerEvents(msg);
            this._postHandleServerEventsValidityCheck(msg);
        }
        catch (e) {
            console.error('[realtime listener] internal non-fatal error: handle server events failed with error: ', e);
            throw e;
        }
    }
    async _handleServerEvents(msg) {
        const { requestId } = msg;
        const { events } = msg.msgData;
        const { msgType } = msg;
        if (!events.length || !this.sessionInfo) {
            return;
        }
        const sessionInfo = this.sessionInfo;
        let allChangeEvents;
        try {
            allChangeEvents = events.map(getPublicEvent);
        }
        catch (e) {
            this.closeWithError(new error_1.CloudSDKError({
                errCode: error_config_1.ERR_CODE.SDK_DATABASE_REALTIME_LISTENER_RECEIVE_INVALID_SERVER_DATA,
                errMsg: e
            }));
            return;
        }
        let docs = [...sessionInfo.currentDocs];
        let initEncountered = false;
        for (let i = 0, len = allChangeEvents.length; i < len; i++) {
            const change = allChangeEvents[i];
            if (sessionInfo.currentEventId >= change.id) {
                if (!allChangeEvents[i - 1] || change.id > allChangeEvents[i - 1].id) {
                    console.warn(`[realtime] duplicate event received, cur ${sessionInfo.currentEventId} but got ${change.id}`);
                }
                else {
                    console.error(`[realtime listener] server non-fatal error: events out of order (the latter event's id is smaller than that of the former) (requestId ${requestId})`);
                }
                continue;
            }
            else if (sessionInfo.currentEventId === change.id - 1) {
                switch (change.dataType) {
                    case 'update': {
                        if (!change.doc) {
                            switch (change.queueType) {
                                case 'update':
                                case 'dequeue': {
                                    const localDoc = docs.find(doc => doc._id === change.docId);
                                    if (localDoc) {
                                        const doc = cloneDeep_1.default(localDoc);
                                        if (change.updatedFields) {
                                            for (const fieldPath in change.updatedFields) {
                                                set_1.default(doc, fieldPath, change.updatedFields[fieldPath]);
                                            }
                                        }
                                        if (change.removedFields) {
                                            for (const fieldPath of change.removedFields) {
                                                unset_1.default(doc, fieldPath);
                                            }
                                        }
                                        change.doc = doc;
                                    }
                                    else {
                                        console.error('[realtime listener] internal non-fatal server error: unexpected update dataType event where no doc is associated.');
                                    }
                                    break;
                                }
                                case 'enqueue': {
                                    const err = new error_1.CloudSDKError({
                                        errCode: error_config_1.ERR_CODE.SDK_DATABASE_REALTIME_LISTENER_UNEXPECTED_FATAL_ERROR,
                                        errMsg: `HandleServerEvents: full doc is not provided with dataType="update" and queueType="enqueue" (requestId ${msg.requestId})`
                                    });
                                    this.closeWithError(err);
                                    throw err;
                                }
                                default: {
                                    break;
                                }
                            }
                        }
                        break;
                    }
                    case 'replace': {
                        if (!change.doc) {
                            const err = new error_1.CloudSDKError({
                                errCode: error_config_1.ERR_CODE.SDK_DATABASE_REALTIME_LISTENER_UNEXPECTED_FATAL_ERROR,
                                errMsg: `HandleServerEvents: full doc is not provided with dataType="replace" (requestId ${msg.requestId})`
                            });
                            this.closeWithError(err);
                            throw err;
                        }
                        break;
                    }
                    case 'remove': {
                        const doc = docs.find(doc => doc._id === change.docId);
                        if (doc) {
                            change.doc = doc;
                        }
                        else {
                            console.error('[realtime listener] internal non-fatal server error: unexpected remove event where no doc is associated.');
                        }
                        break;
                    }
                }
                switch (change.queueType) {
                    case 'init': {
                        if (!initEncountered) {
                            initEncountered = true;
                            docs = [change.doc];
                        }
                        else {
                            docs.push(change.doc);
                        }
                        break;
                    }
                    case 'enqueue': {
                        docs.push(change.doc);
                        break;
                    }
                    case 'dequeue': {
                        const ind = docs.findIndex(doc => doc._id === change.docId);
                        if (ind > -1) {
                            docs.splice(ind, 1);
                        }
                        else {
                            console.error('[realtime listener] internal non-fatal server error: unexpected dequeue event where no doc is associated.');
                        }
                        break;
                    }
                    case 'update': {
                        const ind = docs.findIndex(doc => doc._id === change.docId);
                        if (ind > -1) {
                            docs[ind] = change.doc;
                        }
                        else {
                            console.error('[realtime listener] internal non-fatal server error: unexpected queueType update event where no doc is associated.');
                        }
                        break;
                    }
                }
                if (i === len - 1 ||
                    (allChangeEvents[i + 1] && allChangeEvents[i + 1].id !== change.id)) {
                    const docsSnapshot = [...docs];
                    const docChanges = allChangeEvents
                        .slice(0, i + 1)
                        .filter(c => c.id === change.id);
                    this.sessionInfo.currentEventId = change.id;
                    this.sessionInfo.currentDocs = docs;
                    const snapshot = new snapshot_1.Snapshot({
                        id: change.id,
                        docChanges,
                        docs: docsSnapshot,
                        msgType
                    });
                    this.listener.onChange(snapshot);
                }
            }
            else {
                console.warn(`[realtime listener] event received is out of order, cur ${this.sessionInfo.currentEventId} but got ${change.id}`);
                await this.rebuildWatch();
                return;
            }
        }
    }
    _postHandleServerEventsValidityCheck(msg) {
        if (!this.sessionInfo) {
            console.error('[realtime listener] internal non-fatal error: sessionInfo lost after server event handling, this should never occur');
            return;
        }
        if (this.sessionInfo.expectEventId &&
            this.sessionInfo.currentEventId >= this.sessionInfo.expectEventId) {
            this.clearWaitExpectedEvent();
        }
        if (this.sessionInfo.currentEventId < msg.msgData.currEvent) {
            console.warn('[realtime listener] internal non-fatal error: client eventId does not match with server event id after server event handling');
            return;
        }
    }
    clearWaitExpectedEvent() {
        if (this._waitExpectedTimeoutId) {
            clearTimeout(this._waitExpectedTimeoutId);
            this._waitExpectedTimeoutId = undefined;
        }
    }
    onMessage(msg) {
        switch (this.watchStatus) {
            case WATCH_STATUS.PAUSED: {
                if (msg.msgType !== 'ERROR') {
                    return;
                }
                break;
            }
            case WATCH_STATUS.LOGGINGIN:
            case WATCH_STATUS.INITING:
            case WATCH_STATUS.REBUILDING: {
                console.warn(`[realtime listener] internal non-fatal error: unexpected message received while ${this.watchStatus}`);
                return;
            }
            case WATCH_STATUS.CLOSED: {
                console.warn('[realtime listener] internal non-fatal error: unexpected message received when the watch has closed');
                return;
            }
            case WATCH_STATUS.ERRORED: {
                console.warn('[realtime listener] internal non-fatal error: unexpected message received when the watch has ended with error');
                return;
            }
        }
        if (!this.sessionInfo) {
            console.warn('[realtime listener] internal non-fatal error: sessionInfo not found while message is received.');
            return;
        }
        this.scheduleSendACK();
        switch (msg.msgType) {
            case 'NEXT_EVENT': {
                console.warn(`nextevent ${msg.msgData.currEvent} ignored`, msg);
                this.handleServerEvents(msg);
                break;
            }
            case 'CHECK_EVENT': {
                if (this.sessionInfo.currentEventId < msg.msgData.currEvent) {
                    this.sessionInfo.expectEventId = msg.msgData.currEvent;
                    this.clearWaitExpectedEvent();
                    this._waitExpectedTimeoutId = setTimeout(() => {
                        this.rebuildWatch();
                    }, this.getWaitExpectedTimeoutLength());
                    console.log(`[realtime] waitExpectedTimeoutLength ${this.getWaitExpectedTimeoutLength()}`);
                }
                break;
            }
            case 'ERROR': {
                this.closeWithError(new error_1.CloudSDKError({
                    errCode: error_config_1.ERR_CODE.SDK_DATABASE_REALTIME_LISTENER_SERVER_ERROR_MSG,
                    errMsg: `${msg.msgData.code} - ${msg.msgData.message}`
                }));
                break;
            }
            default: {
                console.warn(`[realtime listener] virtual client receive unexpected msg ${msg.msgType}: `, msg);
                break;
            }
        }
    }
    closeWithError(error) {
        this.watchStatus = WATCH_STATUS.ERRORED;
        this.clearACKSchedule();
        this.listener.onError(error);
        this.onWatchClose(this, (this.sessionInfo && this.sessionInfo.queryID) || '');
        console.log(`[realtime] client closed (${this.collectionName} ${this.query}) (watchId ${this.watchId})`);
    }
    pause() {
        this.watchStatus = WATCH_STATUS.PAUSED;
        console.log(`[realtime] client paused (${this.collectionName} ${this.query}) (watchId ${this.watchId})`);
    }
    async resume() {
        this.watchStatus = WATCH_STATUS.RESUMING;
        console.log(`[realtime] client resuming with ${this.sessionInfo ? 'REBUILD_WATCH' : 'INIT_WATCH'} (${this.collectionName} ${this.query}) (${this.watchId})`);
        try {
            await (this.sessionInfo ? this.rebuildWatch() : this.initWatch());
            console.log(`[realtime] client successfully resumed (${this.collectionName} ${this.query}) (${this.watchId})`);
        }
        catch (e) {
            console.error(`[realtime] client resume failed (${this.collectionName} ${this.query}) (${this.watchId})`, e);
        }
    }
}
exports.VirtualWebSocketClient = VirtualWebSocketClient;
function getPublicEvent(event) {
    const e = {
        id: event.ID,
        dataType: event.DataType,
        queueType: event.QueueType,
        docId: event.DocID,
        doc: event.Doc && event.Doc !== '{}' ? JSON.parse(event.Doc) : undefined
    };
    if (event.DataType === 'update') {
        if (event.UpdatedFields) {
            e.updatedFields = JSON.parse(event.UpdatedFields);
        }
        if (event.removedFields || event.RemovedFields) {
            e.removedFields = JSON.parse(event.removedFields);
        }
    }
    return e;
}

}, function(modId) { var map = {"./message":1650268489765,"../utils/error":1650268489766,"../config/error.config":1650268489767,"../utils/utils":1650268489768,"./listener":1650268489769,"./snapshot":1650268489770,"./error":1650268489771}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489765, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
function genRequestId(prefix = '') {
    return `${prefix ? `${prefix}_` : ''}${+new Date()}_${Math.random()}`;
}
exports.genRequestId = genRequestId;
function isInitEventMessage(msg) {
    return msg.msgType === 'INIT_EVENT';
}
exports.isInitEventMessage = isInitEventMessage;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489766, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("./type");
const error_config_1 = require("../config/error.config");
class CloudSDKError extends Error {
    constructor(options) {
        super(options.errMsg);
        this.errCode = 'UNKNOWN_ERROR';
        Object.defineProperties(this, {
            message: {
                get() {
                    return (`errCode: ${this.errCode} ${error_config_1.ERR_CODE[this.errCode] ||
                        ''} | errMsg: ` + this.errMsg);
                },
                set(msg) {
                    this.errMsg = msg;
                }
            }
        });
        this.errCode = options.errCode || 'UNKNOWN_ERROR';
        this.errMsg = options.errMsg;
    }
    get message() {
        return `errCode: ${this.errCode} | errMsg: ` + this.errMsg;
    }
    set message(msg) {
        this.errMsg = msg;
    }
}
exports.CloudSDKError = CloudSDKError;
function isSDKError(error) {
    return (error && error instanceof Error && type_1.isString(error.errMsg));
}
exports.isSDKError = isSDKError;
exports.isGenericError = (e) => e.generic;
class TimeoutError extends Error {
    constructor(message) {
        super(message);
        this.type = 'timeout';
        this.payload = null;
        this.generic = true;
    }
}
exports.TimeoutError = TimeoutError;
exports.isTimeoutError = (e) => e.type === 'timeout';
class CancelledError extends Error {
    constructor(message) {
        super(message);
        this.type = 'cancelled';
        this.payload = null;
        this.generic = true;
    }
}
exports.CancelledError = CancelledError;
exports.isCancelledError = (e) => e.type === 'cancelled';

}, function(modId) { var map = {"./type":1650268489747,"../config/error.config":1650268489767}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489767, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.ERR_CODE = {
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    SDK_DATABASE_REALTIME_LISTENER_INIT_WATCH_FAIL: 'SDK_DATABASE_REALTIME_LISTENER_INIT_WATCH_FAIL',
    SDK_DATABASE_REALTIME_LISTENER_RECONNECT_WATCH_FAIL: 'SDK_DATABASE_REALTIME_LISTENER_RECONNECT_WATCH_FAIL',
    SDK_DATABASE_REALTIME_LISTENER_REBUILD_WATCH_FAIL: 'SDK_DATABASE_REALTIME_LISTENER_REBUILD_WATCH_FAIL',
    SDK_DATABASE_REALTIME_LISTENER_CLOSE_WATCH_FAIL: 'SDK_DATABASE_REALTIME_LISTENER_CLOSE_WATCH_FAIL',
    SDK_DATABASE_REALTIME_LISTENER_SERVER_ERROR_MSG: 'SDK_DATABASE_REALTIME_LISTENER_SERVER_ERROR_MSG',
    SDK_DATABASE_REALTIME_LISTENER_RECEIVE_INVALID_SERVER_DATA: 'SDK_DATABASE_REALTIME_LISTENER_RECEIVE_INVALID_SERVER_DATA',
    SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_ERROR: 'SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_ERROR',
    SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_CLOSED: 'SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_CLOSED',
    SDK_DATABASE_REALTIME_LISTENER_CHECK_LAST_FAIL: 'SDK_DATABASE_REALTIME_LISTENER_CHECK_LAST_FAIL',
    SDK_DATABASE_REALTIME_LISTENER_UNEXPECTED_FATAL_ERROR: 'SDK_DATABASE_REALTIME_LISTENER_UNEXPECTED_FATAL_ERROR'
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489768, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = (ms = 0) => new Promise(r => setTimeout(r, ms));
const counters = {};
exports.autoCount = (domain = 'any') => {
    if (!counters[domain]) {
        counters[domain] = 0;
    }
    return counters[domain]++;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489769, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
class RealtimeListener {
    constructor(options) {
        this.close = options.close;
        this.onChange = options.onChange;
        this.onError = options.onError;
        if (options.debug) {
            Object.defineProperty(this, 'virtualClient', {
                get: () => {
                    return options.virtualClient;
                }
            });
        }
    }
}
exports.RealtimeListener = RealtimeListener;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489770, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
class Snapshot {
    constructor(options) {
        const { id, docChanges, docs, msgType, type } = options;
        let cachedDocChanges;
        let cachedDocs;
        Object.defineProperties(this, {
            id: {
                get: () => id,
                enumerable: true
            },
            docChanges: {
                get: () => {
                    if (!cachedDocChanges) {
                        cachedDocChanges = JSON.parse(JSON.stringify(docChanges));
                    }
                    return cachedDocChanges;
                },
                enumerable: true
            },
            docs: {
                get: () => {
                    if (!cachedDocs) {
                        cachedDocs = JSON.parse(JSON.stringify(docs));
                    }
                    return cachedDocs;
                },
                enumerable: true
            },
            msgType: {
                get: () => msgType,
                enumerable: true
            },
            type: {
                get: () => type,
                enumerable: true
            }
        });
    }
}
exports.Snapshot = Snapshot;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489771, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
class RealtimeErrorMessageError extends Error {
    constructor(serverErrorMsg) {
        super(`Watch Error ${JSON.stringify(serverErrorMsg.msgData)} (requestid: ${serverErrorMsg.requestId})`);
        this.isRealtimeErrorMessageError = true;
        this.payload = serverErrorMsg;
    }
}
exports.RealtimeErrorMessageError = RealtimeErrorMessageError;
exports.isRealtimeErrorMessageError = (e) => e && e.isRealtimeErrorMessageError;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489772, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../utils/error");
const error_config_1 = require("../config/error.config");
exports.CLOSE_EVENT_CODE_INFO = {
    1000: {
        code: 1000,
        name: 'Normal Closure',
        description: 'Normal closure; the connection successfully completed whatever purpose for which it was created.'
    },
    1001: {
        code: 1001,
        name: 'Going Away',
        description: 'The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.'
    },
    1002: {
        code: 1002,
        name: 'Protocol Error',
        description: 'The endpoint is terminating the connection due to a protocol error.'
    },
    1003: {
        code: 1003,
        name: 'Unsupported Data',
        description: 'The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data).'
    },
    1005: {
        code: 1005,
        name: 'No Status Received',
        description: 'Indicates that no status code was provided even though one was expected.'
    },
    1006: {
        code: 1006,
        name: 'Abnormal Closure',
        description: 'Used to indicate that a connection was closed abnormally (that is, with no close frame being sent) when a status code is expected.'
    },
    1007: {
        code: 1007,
        name: 'Invalid frame payload data',
        description: 'The endpoint is terminating the connection because a message was received that contained inconsistent data (e.g., non-UTF-8 data within a text message).'
    },
    1008: {
        code: 1008,
        name: 'Policy Violation',
        description: 'The endpoint is terminating the connection because it received a message that violates its policy. This is a generic status code, used when codes 1003 and 1009 are not suitable.'
    },
    1009: {
        code: 1009,
        name: 'Message too big',
        description: 'The endpoint is terminating the connection because a data frame was received that is too large.'
    },
    1010: {
        code: 1010,
        name: 'Missing Extension',
        description: "The client is terminating the connection because it expected the server to negotiate one or more extension, but the server didn't."
    },
    1011: {
        code: 1011,
        name: 'Internal Error',
        description: 'The server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.'
    },
    1012: {
        code: 1012,
        name: 'Service Restart',
        description: 'The server is terminating the connection because it is restarting.'
    },
    1013: {
        code: 1013,
        name: 'Try Again Later',
        description: 'The server is terminating the connection due to a temporary condition, e.g. it is overloaded and is casting off some of its clients.'
    },
    1014: {
        code: 1014,
        name: 'Bad Gateway',
        description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server. This is similar to 502 HTTP Status Code.'
    },
    1015: {
        code: 1015,
        name: 'TLS Handshake',
        description: "Indicates that the connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified)."
    },
    3000: {
        code: 3000,
        name: 'Reconnect WebSocket',
        description: 'The client is terminating the connection because it wants to reconnect'
    },
    3001: {
        code: 3001,
        name: 'No Realtime Listeners',
        description: 'The client is terminating the connection because no more realtime listeners exist'
    },
    3002: {
        code: 3002,
        name: 'Heartbeat Ping Error',
        description: 'The client is terminating the connection due to its failure in sending heartbeat messages'
    },
    3003: {
        code: 3003,
        name: 'Heartbeat Pong Timeout Error',
        description: 'The client is terminating the connection because no heartbeat response is received from the server'
    },
    3050: {
        code: 3050,
        name: 'Server Close',
        description: 'The client is terminating the connection because no heartbeat response is received from the server'
    }
};
var CLOSE_EVENT_CODE;
(function (CLOSE_EVENT_CODE) {
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["NormalClosure"] = 1000] = "NormalClosure";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["GoingAway"] = 1001] = "GoingAway";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["ProtocolError"] = 1002] = "ProtocolError";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["UnsupportedData"] = 1003] = "UnsupportedData";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["NoStatusReceived"] = 1005] = "NoStatusReceived";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["AbnormalClosure"] = 1006] = "AbnormalClosure";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["InvalidFramePayloadData"] = 1007] = "InvalidFramePayloadData";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["PolicyViolation"] = 1008] = "PolicyViolation";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["MessageTooBig"] = 1009] = "MessageTooBig";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["MissingExtension"] = 1010] = "MissingExtension";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["InternalError"] = 1011] = "InternalError";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["ServiceRestart"] = 1012] = "ServiceRestart";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["TryAgainLater"] = 1013] = "TryAgainLater";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["BadGateway"] = 1014] = "BadGateway";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["TLSHandshake"] = 1015] = "TLSHandshake";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["ReconnectWebSocket"] = 3000] = "ReconnectWebSocket";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["NoRealtimeListeners"] = 3001] = "NoRealtimeListeners";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["HeartbeatPingError"] = 3002] = "HeartbeatPingError";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["HeartbeatPongTimeoutError"] = 3003] = "HeartbeatPongTimeoutError";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["NoAuthentication"] = 3050] = "NoAuthentication";
})(CLOSE_EVENT_CODE = exports.CLOSE_EVENT_CODE || (exports.CLOSE_EVENT_CODE = {}));
exports.getWSCloseError = (code, reason) => {
    const info = exports.CLOSE_EVENT_CODE_INFO[code];
    const errMsg = !info
        ? `code ${code}`
        : `${info.name}, code ${code}, reason ${reason || info.description}`;
    return new error_1.CloudSDKError({
        errCode: error_config_1.ERR_CODE.SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_CLOSED,
        errMsg
    });
};

}, function(modId) { var map = {"../utils/error":1650268489766,"../config/error.config":1650268489767}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489773, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./lib/util");
const index_1 = require("./index");
const validate_1 = require("./validate");
const util_2 = require("./util");
const query_1 = require("./serializer/query");
const update_1 = require("./serializer/update");
const websocket_client_1 = require("./realtime/websocket-client");
class Query {
    constructor(db, coll, fieldFilters, fieldOrders, queryOptions) {
        this.watch = (options) => {
            if (!index_1.Db.ws) {
                index_1.Db.ws = new websocket_client_1.RealtimeWebSocketClient({
                    context: {
                        appConfig: {
                            docSizeLimit: 1000,
                            realtimePingInterval: 10000,
                            realtimePongWaitTimeout: 5000,
                            getAccessToken: this._getAccessToken
                        }
                    }
                });
            }
            return index_1.Db.ws.watch(Object.assign({}, options, { envId: this._db.config.env, collectionName: this._coll, query: JSON.stringify(this._fieldFilters) }));
        };
        this._db = db;
        this._coll = coll;
        this._fieldFilters = fieldFilters;
        this._fieldOrders = fieldOrders || [];
        this._queryOptions = queryOptions || {};
        this._request = new index_1.Db.reqClass(this._db.config);
        this._getAccessToken = index_1.Db.getAccessToken;
    }
    get(callback) {
        callback = callback || util_1.createPromiseCallback();
        let newOder = [];
        if (this._fieldOrders) {
            this._fieldOrders.forEach(order => {
                newOder.push(order);
            });
        }
        let param = {
            collectionName: this._coll
        };
        if (this._fieldFilters) {
            param.query = this._fieldFilters;
        }
        if (newOder.length > 0) {
            param.order = newOder;
        }
        if (this._queryOptions.offset) {
            param.offset = this._queryOptions.offset;
        }
        if (this._queryOptions.limit) {
            param.limit =
                this._queryOptions.limit < 100 ? this._queryOptions.limit : 100;
        }
        else {
            param.limit = 100;
        }
        if (this._queryOptions.projection) {
            param.projection = this._queryOptions.projection;
        }
        this._request
            .send('database.queryDocument', param)
            .then(res => {
            if (res.code) {
                callback(0, res);
            }
            else {
                const documents = util_2.Util.formatResDocumentData(res.data.list);
                const result = {
                    data: documents,
                    requestId: res.requestId
                };
                if (res.TotalCount)
                    result.total = res.TotalCount;
                if (res.Limit)
                    result.limit = res.Limit;
                if (res.Offset)
                    result.offset = res.Offset;
                callback(0, result);
            }
        })
            .catch(err => {
            callback(err);
        });
        return callback.promise;
    }
    count(callback) {
        callback = callback || util_1.createPromiseCallback();
        let param = {
            collectionName: this._coll
        };
        if (this._fieldFilters) {
            param.query = this._fieldFilters;
        }
        this._request.send('database.countDocument', param).then(res => {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    requestId: res.requestId,
                    total: res.data.total
                });
            }
        });
        return callback.promise;
    }
    where(query) {
        return new Query(this._db, this._coll, query_1.QuerySerializer.encode(query), this._fieldOrders, this._queryOptions);
    }
    orderBy(fieldPath, directionStr) {
        validate_1.Validate.isFieldPath(fieldPath);
        validate_1.Validate.isFieldOrder(directionStr);
        const newOrder = {
            field: fieldPath,
            direction: directionStr
        };
        const combinedOrders = this._fieldOrders.concat(newOrder);
        return new Query(this._db, this._coll, this._fieldFilters, combinedOrders, this._queryOptions);
    }
    limit(limit) {
        validate_1.Validate.isInteger('limit', limit);
        let option = Object.assign({}, this._queryOptions);
        option.limit = limit;
        return new Query(this._db, this._coll, this._fieldFilters, this._fieldOrders, option);
    }
    skip(offset) {
        validate_1.Validate.isInteger('offset', offset);
        let option = Object.assign({}, this._queryOptions);
        option.offset = offset;
        return new Query(this._db, this._coll, this._fieldFilters, this._fieldOrders, option);
    }
    update(data, callback) {
        callback = callback || util_1.createPromiseCallback();
        if (!data || typeof data !== 'object') {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '参数必需是非空对象'
            });
        }
        if (data.hasOwnProperty('_id')) {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '不能更新_id的值'
            });
        }
        let param = {
            collectionName: this._coll,
            query: this._fieldFilters,
            multi: true,
            merge: true,
            upsert: false,
            data: update_1.UpdateSerializer.encode(data)
        };
        this._request.send('database.updateDocument', param).then(res => {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    requestId: res.requestId,
                    updated: res.data.updated,
                    upsertId: res.data.upsert_id
                });
            }
        });
        return callback.promise;
    }
    field(projection) {
        for (let k in projection) {
            if (projection[k]) {
                if (typeof projection[k] !== 'object') {
                    projection[k] = 1;
                }
            }
            else {
                projection[k] = 0;
            }
        }
        let option = Object.assign({}, this._queryOptions);
        option.projection = projection;
        return new Query(this._db, this._coll, this._fieldFilters, this._fieldOrders, option);
    }
    remove(callback) {
        callback = callback || util_1.createPromiseCallback();
        if (Object.keys(this._queryOptions).length > 0) {
            console.warn('`offset`, `limit` and `projection` are not supported in remove() operation');
        }
        if (this._fieldOrders.length > 0) {
            console.warn('`orderBy` is not supported in remove() operation');
        }
        const param = {
            collectionName: this._coll,
            query: query_1.QuerySerializer.encode(this._fieldFilters),
            multi: true
        };
        this._request.send('database.deleteDocument', param).then(res => {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    requestId: res.requestId,
                    deleted: res.data.deleted
                });
            }
        });
        return callback.promise;
    }
}
exports.Query = Query;

}, function(modId) { var map = {"./lib/util":1650268489755,"./index":1650268489738,"./validate":1650268489741,"./util":1650268489743,"./serializer/query":1650268489774,"./serializer/update":1650268489756,"./realtime/websocket-client":1650268489763}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489774, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("../commands/query");
const logic_1 = require("../commands/logic");
const symbol_1 = require("../helper/symbol");
const type_1 = require("../utils/type");
const operator_map_1 = require("../operator-map");
const common_1 = require("./common");
class QuerySerializer {
    constructor() {
    }
    static encode(query) {
        const encoder = new QueryEncoder();
        return encoder.encodeQuery(query);
    }
}
exports.QuerySerializer = QuerySerializer;
class QueryEncoder {
    encodeQuery(query, key) {
        if (common_1.isConversionRequired(query)) {
            if (logic_1.isLogicCommand(query)) {
                return this.encodeLogicCommand(query);
            }
            else if (query_1.isQueryCommand(query)) {
                return this.encodeQueryCommand(query);
            }
            else {
                return { [key]: this.encodeQueryObject(query) };
            }
        }
        else {
            if (type_1.isObject(query)) {
                return this.encodeQueryObject(query);
            }
            else {
                return query;
            }
        }
    }
    encodeLogicCommand(query) {
        switch (query.operator) {
            case logic_1.LOGIC_COMMANDS_LITERAL.NOR:
            case logic_1.LOGIC_COMMANDS_LITERAL.AND:
            case logic_1.LOGIC_COMMANDS_LITERAL.OR: {
                const $op = operator_map_1.operatorToString(query.operator);
                const subqueries = query.operands.map((oprand) => this.encodeQuery(oprand, query.fieldName));
                return {
                    [$op]: subqueries,
                };
            }
            default: {
                const $op = operator_map_1.operatorToString(query.operator);
                if (query.operands.length === 1) {
                    const subquery = this.encodeQuery(query.operands[0]);
                    return {
                        [$op]: subquery,
                    };
                }
                else {
                    const subqueries = query.operands.map(this.encodeQuery.bind(this));
                    return {
                        [$op]: subqueries,
                    };
                }
            }
        }
    }
    encodeQueryCommand(query) {
        if (query_1.isComparisonCommand(query)) {
            return this.encodeComparisonCommand(query);
        }
        else {
            return this.encodeComparisonCommand(query);
        }
    }
    encodeComparisonCommand(query) {
        if (query.fieldName === symbol_1.SYMBOL_UNSET_FIELD_NAME) {
            throw new Error('Cannot encode a comparison command with unset field name');
        }
        const $op = operator_map_1.operatorToString(query.operator);
        switch (query.operator) {
            case query_1.QUERY_COMMANDS_LITERAL.EQ:
            case query_1.QUERY_COMMANDS_LITERAL.NEQ:
            case query_1.QUERY_COMMANDS_LITERAL.LT:
            case query_1.QUERY_COMMANDS_LITERAL.LTE:
            case query_1.QUERY_COMMANDS_LITERAL.GT:
            case query_1.QUERY_COMMANDS_LITERAL.GTE: {
                return {
                    [query.fieldName]: {
                        [$op]: common_1.encodeInternalDataType(query.operands[0]),
                    },
                };
            }
            case query_1.QUERY_COMMANDS_LITERAL.IN:
            case query_1.QUERY_COMMANDS_LITERAL.NIN: {
                return {
                    [query.fieldName]: {
                        [$op]: common_1.encodeInternalDataType(query.operands),
                    },
                };
            }
            case query_1.QUERY_COMMANDS_LITERAL.GEO_NEAR: {
                const options = query.operands[0];
                return {
                    [query.fieldName]: {
                        $nearSphere: {
                            $geometry: options.geometry.toJSON(),
                            $maxDistance: options.maxDistance,
                            $minDistance: options.minDistance
                        }
                    }
                };
            }
            case query_1.QUERY_COMMANDS_LITERAL.GEO_WITHIN: {
                const options = query.operands[0];
                return {
                    [query.fieldName]: {
                        $geoWithin: {
                            $geometry: options.geometry.toJSON()
                        }
                    }
                };
            }
            case query_1.QUERY_COMMANDS_LITERAL.GEO_INTERSECTS: {
                const options = query.operands[0];
                return {
                    [query.fieldName]: {
                        $geoIntersects: {
                            $geometry: options.geometry.toJSON()
                        }
                    }
                };
            }
            default: {
                return {
                    [query.fieldName]: {
                        [$op]: common_1.encodeInternalDataType(query.operands[0]),
                    },
                };
            }
        }
    }
    encodeQueryObject(query) {
        const flattened = common_1.flattenQueryObject(query);
        for (const key in flattened) {
            const val = flattened[key];
            if (logic_1.isLogicCommand(val)) {
                flattened[key] = val._setFieldName(key);
                const condition = this.encodeLogicCommand(flattened[key]);
                this.mergeConditionAfterEncode(flattened, condition, key);
            }
            else if (query_1.isComparisonCommand(val)) {
                flattened[key] = val._setFieldName(key);
                const condition = this.encodeComparisonCommand(flattened[key]);
                this.mergeConditionAfterEncode(flattened, condition, key);
            }
            else if (common_1.isConversionRequired(val)) {
                flattened[key] = common_1.encodeInternalDataType(val);
            }
        }
        return flattened;
    }
    mergeConditionAfterEncode(query, condition, key) {
        if (!condition[key]) {
            delete query[key];
        }
        for (const conditionKey in condition) {
            if (query[conditionKey]) {
                if (type_1.isArray(query[conditionKey])) {
                    query[conditionKey] = query[conditionKey].concat(condition[conditionKey]);
                }
                else if (type_1.isObject(query[conditionKey])) {
                    if (type_1.isObject(condition[conditionKey])) {
                        Object.assign(query, condition);
                    }
                    else {
                        console.warn(`unmergable condition, query is object but condition is ${type_1.getType(condition)}, can only overwrite`, condition, key);
                        query[conditionKey] = condition[conditionKey];
                    }
                }
                else {
                    console.warn(`to-merge query is of type ${type_1.getType(query)}, can only overwrite`, query, condition, key);
                    query[conditionKey] = condition[conditionKey];
                }
            }
            else {
                query[conditionKey] = condition[conditionKey];
            }
        }
    }
}

}, function(modId) { var map = {"../commands/query":1650268489759,"../commands/logic":1650268489760,"../helper/symbol":1650268489745,"../utils/type":1650268489747,"../operator-map":1650268489758,"./common":1650268489761}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489775, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const bson_1 = require("bson");
class Aggregation {
    constructor(db, collectionName) {
        this._db = db;
        this._request = new index_1.Db.reqClass(this._db.config);
        this._stages = [];
        this._collectionName = collectionName;
    }
    async end() {
        const result = await this._request.send('database.aggregate', {
            collectionName: this._collectionName,
            stages: this._stages
        });
        if (result && result.data && result.data.list) {
            return {
                requestId: result.requestId,
                data: JSON.parse(result.data.list).map(bson_1.EJSON.parse)
            };
        }
        return result;
    }
    unwrap() {
        return this._stages;
    }
}
exports.default = Aggregation;
const pipelineStages = [
    'addFields',
    'bucket',
    'bucketAuto',
    'count',
    'geoNear',
    'group',
    'limit',
    'match',
    'project',
    'lookup',
    'replaceRoot',
    'sample',
    'skip',
    'sort',
    'sortByCount',
    'unwind'
];
pipelineStages.forEach(stage => {
    Aggregation.prototype[stage] = function (param) {
        this._stages.push({
            stageKey: `$${stage}`,
            stageValue: JSON.stringify(param)
        });
        return this;
    };
});

}, function(modId) { var map = {"./index":1650268489738}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489776, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("./commands/query");
const logic_1 = require("./commands/logic");
const update_1 = require("./commands/update");
const type_1 = require("./utils/type");
exports.Command = {
    eq(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.EQ, [val]);
    },
    neq(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.NEQ, [val]);
    },
    lt(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.LT, [val]);
    },
    lte(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.LTE, [val]);
    },
    gt(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GT, [val]);
    },
    gte(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GTE, [val]);
    },
    in(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.IN, val);
    },
    nin(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.NIN, val);
    },
    geoNear(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GEO_NEAR, [val]);
    },
    geoWithin(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GEO_WITHIN, [val]);
    },
    geoIntersects(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GEO_INTERSECTS, [val]);
    },
    and(...__expressions__) {
        const expressions = type_1.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new logic_1.LogicCommand(logic_1.LOGIC_COMMANDS_LITERAL.AND, expressions);
    },
    nor(...__expressions__) {
        const expressions = type_1.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new logic_1.LogicCommand(logic_1.LOGIC_COMMANDS_LITERAL.NOR, expressions);
    },
    or(...__expressions__) {
        const expressions = type_1.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new logic_1.LogicCommand(logic_1.LOGIC_COMMANDS_LITERAL.OR, expressions);
    },
    set(val) {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.SET, [val]);
    },
    remove() {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.REMOVE, []);
    },
    inc(val) {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.INC, [val]);
    },
    mul(val) {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.MUL, [val]);
    },
    push(...__values__) {
        const values = type_1.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.PUSH, values);
    },
    pop() {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.POP, []);
    },
    shift() {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.SHIFT, []);
    },
    unshift(...__values__) {
        const values = type_1.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.UNSHIFT, values);
    },
    aggregate: {},
    project: {}
};
const pipelineOperators = [
    'abs',
    'add',
    'ceil',
    'divide',
    'exp',
    'floor',
    'ln',
    'log',
    'log10',
    'mod',
    'multiply',
    'pow',
    'sqrt',
    'subtract',
    'trunc',
    'arrayElemAt',
    'arrayToObject',
    'concatArrays',
    'filter',
    'in',
    'indexOfArray',
    'isArray',
    'map',
    'objectToArray',
    'range',
    'reduce',
    'reverseArray',
    'size',
    'slice',
    'zip',
    'and',
    'not',
    'or',
    'cmp',
    'eq',
    'gt',
    'gte',
    'lt',
    'lte',
    'ne',
    'cond',
    'ifNull',
    'switch',
    'dayOfWeek',
    'dateFromParts',
    'dateFromString',
    'dayOfMonth',
    'dayOfWeek',
    'dayOfYear',
    'isoDayOfWeek',
    'isoWeek',
    'isoWeekYear',
    'millisecond',
    'minute',
    'month',
    'second',
    'hour',
    'week',
    'year',
    'literal',
    'mergeObjects',
    'objectToArray',
    'allElementsTrue',
    'anyElementTrue',
    'setDifference',
    'setEquals',
    'setIntersection',
    'setIsSubset',
    'setUnion',
    'concat',
    'dateToString',
    'indexOfBytes',
    'indexOfCP',
    'split',
    'strLenBytes',
    'strLenCP',
    'strcasecmp',
    'substr',
    'substrBytes',
    'substrCP',
    'toLower',
    'toUpper',
    'meta',
    'addToSet',
    'avg',
    'first',
    'last',
    'max',
    'min',
    'push',
    'stdDevPop',
    'stdDevSamp',
    'sum',
    'let'
];
pipelineOperators.forEach(op => {
    let apiName = op;
    if (op === 'ne') {
        apiName = 'neq';
    }
    exports.Command.aggregate[apiName] = function (param) {
        return {
            [`$${op}`]: param
        };
    };
});
const projectionOperators = [
    'slice',
    'elemMatch'
];
projectionOperators.forEach(op => {
    let apiName = op;
    exports.Command.project[apiName] = function (param) {
        return {
            [`$${op}`]: param
        };
    };
});
exports.default = exports.Command;

}, function(modId) { var map = {"./commands/query":1650268489759,"./commands/logic":1650268489760,"./commands/update":1650268489757,"./utils/type":1650268489747}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489777, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = require("../helper/symbol");
class RegExp {
    constructor({ regexp, options }) {
        if (!regexp) {
            throw new TypeError('regexp must be a string');
        }
        this.$regex = regexp;
        this.$options = options;
    }
    parse() {
        return {
            $regex: this.$regex,
            $options: this.$options
        };
    }
    get _internalType() {
        return symbol_1.SYMBOL_REGEXP;
    }
}
exports.RegExp = RegExp;
function RegExpConstructor(param) {
    return new RegExp(param);
}
exports.RegExpConstructor = RegExpConstructor;

}, function(modId) { var map = {"../helper/symbol":1650268489745}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1650268489778, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
const index_1 = require("./index");
class DocumentSnapshot {
    constructor(data, requestId) {
        this._data = data;
        this.requestId = requestId;
    }
    data() {
        return this._data;
    }
}
const START = 'database.startTransaction';
const COMMIT = 'database.commitTransaction';
const ABORT = 'database.abortTransaction';
const GET_DOC = 'database.getInTransaction';
const UPDATE_DOC = 'database.updateDocInTransaction';
const DELETE_DOC = 'database.deleteDocInTransaction';
class Transaction {
    constructor(db) {
        this._db = db;
        this._request = new index_1.Db.reqClass(this._db.config);
    }
    async init() {
        const res = await this._request.send(START);
        if (res.code) {
            throw res;
        }
        this._id = res.transactionId;
    }
    async get(documentRef) {
        const param = {
            collectionName: documentRef._coll,
            transactionId: this._id,
            _id: documentRef.id
        };
        const res = await this._request.send(GET_DOC, param);
        if (res.code)
            throw res;
        return new DocumentSnapshot(bson_1.EJSON.parse(res.data), res.requestId);
    }
    async set(documentRef, data) {
        const param = {
            collectionName: documentRef._coll,
            transactionId: this._id,
            _id: documentRef.id,
            data: bson_1.EJSON.stringify(data, { relaxed: false }),
            upsert: true
        };
        const res = await this._request.send(UPDATE_DOC, param);
        if (res.code)
            throw res;
        return Object.assign({}, res, { updated: bson_1.EJSON.parse(res.updated), upserted: res.upserted
                ? JSON.parse(res.upserted)
                : null });
    }
    async update(documentRef, data) {
        const param = {
            collectionName: documentRef._coll,
            transactionId: this._id,
            _id: documentRef.id,
            data: bson_1.EJSON.stringify({
                $set: data
            }, {
                relaxed: false
            })
        };
        const res = await this._request.send(UPDATE_DOC, param);
        if (res.code)
            throw res;
        return Object.assign({}, res, { updated: bson_1.EJSON.parse(res.updated) });
    }
    async delete(documentRef) {
        const param = {
            collectionName: documentRef._coll,
            transactionId: this._id,
            _id: documentRef.id
        };
        const res = await this._request.send(DELETE_DOC, param);
        if (res.code)
            throw res;
        return Object.assign({}, res, { deleted: bson_1.EJSON.parse(res.deleted) });
    }
    async commit() {
        const param = {
            transactionId: this._id
        };
        const res = await this._request.send(COMMIT, param);
        if (res.code)
            throw res;
        return res;
    }
    async rollback() {
        const param = {
            transactionId: this._id
        };
        const res = await this._request.send(ABORT, param);
        if (res.code)
            throw res;
        return res;
    }
}
exports.Transaction = Transaction;
async function startTransaction() {
    const transaction = new Transaction(this);
    await transaction.init();
    return transaction;
}
exports.startTransaction = startTransaction;
async function runTransaction(callback, times = 3) {
    if (times <= 0) {
        throw new Error('Transaction failed');
    }
    try {
        const transaction = new Transaction(this);
        await transaction.init();
        await callback(transaction);
        await transaction.commit();
    }
    catch (error) {
        console.log(error);
        return runTransaction.bind(this)(callback, --times);
    }
}
exports.runTransaction = runTransaction;

}, function(modId) { var map = {"./index":1650268489738}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1650268489738);
})()
//miniprogram-npm-outsideDeps=["lodash/set","lodash/unset","lodash/cloneDeep","bson"]
//# sourceMappingURL=index.js.map