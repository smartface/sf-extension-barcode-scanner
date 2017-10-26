const NativeRGBLuminanceSource = requireClass("com.google.zxing.RGBLuminanceSource");
const NativeBinaryBitmap = requireClass("com.google.zxing.BinaryBitmap");
const NativeHybridBinarizer = requireClass("com.google.zxing.common.HybridBinarizer");
const NativeMultiFormatReader = requireClass("com.google.zxing.MultiFormatReader");
const NativeBarcodeFormat    = requireClass("com.google.zxing.BarcodeFormat");
const Runnable = requireClass("java.lang.Runnable");

const Page = require("sf-core/ui/page");
const Image = require("../sf-core/ui/image");
const extend = require("js-base/core/extend");
const Color = require("sf-core/ui/color");
const Router = require("sf-core/router");
const AndroidConfig = require('sf-core/util/Android/androidconfig');

var mScannerView;
var _onResult;
var _scanPage;
var _onShow;

function Barcode(params) {
    var _format, _text, _width, _height;
    Object.defineProperties(this,{ 
        'format': {
            get: function() {
                return _format;
            },
            set: function(format) {
                if(!(format in Barcode.FormatType))
                    throw new Error("format must be an Barcode.FormatType enum.");
                _format = format;
            },
            enumerable: true
        },
        'text': {
            get: function() {
                return _text;
            },
            set: function(text) {
                _text = text;
            },
            enumerable: true
        },
        'width': {
            get: function() {
                return _width;
            },
            set: function(width) {
                _width = width;
            },
            enumerable: true
        },
        'height': {
            get: function() {
                return _height;
            },
            set: function(height) {
                _height = height;
            },
            enumerable: true
        },
        'toString': {
            value: function(){
                return 'Barcode';
            },
            enumerable: true, 
            configurable: true
        }
    });
    
    // Assign parameters given in constructor
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
}

var ScannerPage = extend(Page)(
    function(_super) {
        _super(this, {
            onShow: function(params) {
                this.statusBar.visible = false;
                this.headerBar.visible = false;
                mScannerView.nativeObject.startCamera();
            },
            onLoad: function() {
                const ZXingScannerView = requireClass("me.dm7.barcodescanner.zxing.ZXingScannerView");
                const View = require("sf-core/ui/view");
                mScannerView = new View({flexGrow: 1, backgroundColor: Color.RED});
                mScannerView.nativeObject = new ZXingScannerView(AndroidConfig.activity);
                var resultHandler = ZXingScannerView.ResultHandler.implement({
                   handleResult: function(rawResult) { 
                        _onResult && _onResult({barcode: new Barcode({
                            text: rawResult.getText(),
                            format: rawResult.getBarcodeFormat().toString()
                        })});
                   }
                });
                mScannerView.nativeObject.setResultHandler(resultHandler);
                mScannerView.nativeObject.resumeCameraPreview(resultHandler);
                this.layout.addChild(mScannerView);
            }
        });
    }
); 

function BarcodeScanner(params) {
    _scanPage = new ScannerPage();
    Object.defineProperties(this, {
            'onResult': {
                get: function() {
                    return _onResult;
                },
                set: function(onResult) {
                    _onResult = onResult.bind(this);
                },
                enumerable: true
            },
            'onShow': {
                get: function() {
                    return _onShow;
                },
                set: function(onShow) {
                    _onShow = onShow.bind(this);
                },
                enumerable: true
            },
            'layout': {
                get: function() {
                    if(_scanPage) 
                        return _scanPage.layout;
                    return null;
                },
                enumerable: true
            },
            'startCamera': {
                value: function(){
                    mScannerView.nativeObject.startCamera();
                },
                enumerable: true, 
                configurable: true
            },
            'show': {
                value: function(params){
                    if(!params || !params.tag || !(params.tag !== "string"))
                        throw new Error("Tag parameter is required to show scanning page.");
                    Router.pagesInstance && Router.pagesInstance.push(_scanPage, false, params.tag, true);
                },
                enumerable: true, 
                configurable: true
            },
            'hide': {
                value: function(){
                    Router.pagesInstance && Router.pagesInstance.pop();
                },
                enumerable: true, 
                configurable: true
            },
            'stopCamera': {
                value: function(){
                    mScannerView.nativeObject.stopCamera();
                },
                enumerable: true, 
                configurable: true
            },
            'toString': {
                value: function(){
                    return 'BarcodeScanner';
                },
                enumerable: true, 
                configurable: true
            }
        });
        
    // Assign parameters given in constructor
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
}

Object.defineProperty(Barcode, "FormatType",{
    value: {},
    enumerable: true
});

Object.defineProperties(Barcode.FormatType,{
    'AZTEC':{
        value: 'AZTEC',
        enumerable: true
    },
    'CODABAR':{
        value: 'CODABAR',
        enumerable: true
    },
    'CODE_39':{
        value: 'CODE_39',
        enumerable: true
    },
    'CODE_93':{
        value: 'CODE_93',
        enumerable: true
    },
    'CODE_128':{
        value: 'CODE_128',
        enumerable: true
    },
    'DATA_MATRIX':{
        value: 'DATA_MATRIX',
        enumerable: true
    },
    'EAN_8':{
        value: 'EAN_8',
        enumerable: true
    },
    'EAN_13':{
        value: 'EAN_13',
        enumerable: true
    },
    'ITF':{
        value: 'ITF',
        enumerable: true
    },
    'MAXICODE':{
        value: 'MAXICODE',
        enumerable: true
    },
    'PDF_417':{
        value: 'PDF_417',
        enumerable: true
    },
    'QR_CODE':{
        value: 'QR_CODE',
        enumerable: true
    },
    'RSS_14':{
        value: 'RSS_14',
        enumerable: true
    },
    'RSS_EXPANDED':{
        value: 'RSS_EXPANDED',
        enumerable: true
    },
    'UPC_A':{
        value: 'UPC_A',
        enumerable: true
    },
    'UPC_E':{
        value: 'UPC_E',
        enumerable: true
    },
    'UPC_EAN_EXTENSION':{
        value: 'UPC_EAN_EXTENSION',
        enumerable: true
    }
});

module.exports = {Barcode: Barcode, BarcodeScanner: BarcodeScanner};