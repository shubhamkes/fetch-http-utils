'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CustomError = function (_Error) {
    _inherits(CustomError, _Error);

    function CustomError() {
        var _ref;

        var error = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var status = arguments[1];

        _classCallCheck(this, CustomError);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        var _this = _possibleConstructorReturn(this, (_ref = CustomError.__proto__ || Object.getPrototypeOf(CustomError)).call.apply(_ref, [this].concat(_toConsumableArray(status))));

        if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, CustomError);
        }

        _this.error = error;
        _this.status = status;

        return _this;
    }

    return CustomError;
}(Error);

exports.default = CustomError;