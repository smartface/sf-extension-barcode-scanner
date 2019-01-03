function Barcode(params) {
    var _format;
    Object.defineProperty(this, 'format', {
        get: function() {
            return _format;
        },
        set: function(format) {
            _format = format;
        },
        enumerable: true
    });

    var _text;
    Object.defineProperty(this, 'text', {
        get: function() {
            return _text;
        },
        set: function(text) {
            _text = text;
        },
        enumerable: true
    });

    var _width;
    Object.defineProperty(this, 'width', {
        get: function() {
            return _width;
        },
        set: function(width) {
            _width = width;
        },
        enumerable: true
    });

    var _height;
    Object.defineProperty(this, 'height', {
        get: function() {
            return _height;
        },
        set: function(height) {
            _height = height;
        },
        enumerable: true
    });

    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
}

Object.defineProperty(Barcode, "FormatType", {
    value: {},
    enumerable: true
});

Object.defineProperties(Barcode.FormatType, {
    'AZTEC': {
        value: 0,
        enumerable: true
    },
    'CODABAR': {
        value: 1,
        enumerable: true
    },
    'CODE_39': {
        value: 2,
        enumerable: true
    },
    'CODE_93': {
        value: 3,
        enumerable: true
    },
    'CODE_128': {
        value: 4,
        enumerable: true
    },
    'DATA_MATRIX': {
        value: 5,
        enumerable: true
    },
    'EAN_8': {
        value: 6,
        enumerable: true
    },
    'EAN_13': {
        value: 7,
        enumerable: true
    },
    'ITF': {
        value: 8,
        enumerable: true
    },
    'MAXICODE': {
        value: 9,
        enumerable: true
    },
    'PDF_417': {
        value: 10,
        enumerable: true
    },
    'QR_CODE': {
        value: 11,
        enumerable: true
    },
    'RSS_14': {
        value: 12,
        enumerable: true
    },
    'RSS_EXPANDED': {
        value: 13,
        enumerable: true
    },
    'UPC_A': {
        value: 14,
        enumerable: true
    },
    'UPC_E': {
        value: 15,
        enumerable: true
    },
    'UPC_EAN_EXTENSION': {
        value: 16,
        enumerable: true
    }
});

module.exports = Barcode;
