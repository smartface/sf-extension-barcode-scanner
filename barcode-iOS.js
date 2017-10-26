const Invocation    = require('sf-core/util').Invocation;
const Screen = require('sf-core/device/screen');
const Page       = require("sf-core/ui/page");

const AVCaptureFocusMode = {
    Locked : 0,
    AutoFocus : 1,
    ContinuousAutoFocus : 2
};

const AVAuthorizationStatus ={
    NotDetermined : 0,
    Restricted    : 1,
    Denied        : 2,
    Authorized    : 3,
};

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

function BarcodeScanner(params) {
    var self = this;
    
    self.pageScanner = new Page({
        onShow : function(){
            this.statusBar.visible = false;
            self.applyOrientationParentView();
        },
        onLoad : function(){
            var alloc = Invocation.invokeClassMethod("ZXCapture","alloc",[],"id");
            self.pageScanner.capture = Invocation.invokeInstanceMethod(alloc,"init",[],"id");
            self.pageScanner.captureLayer = Invocation.invokeInstanceMethod(self.pageScanner.capture,"layer",[],"NSObject");
            
            var argCaptureLayer = new Invocation.Argument({
                type:"NSObject",
                value:self.pageScanner.captureLayer
            });
            var argSublayerIndex = new Invocation.Argument({
                type:"NSUInteger",
                value:0
            });
            Invocation.invokeInstanceMethod(self.pageScanner.layout.nativeObject.layer,"insertSublayer:atIndex:",[argCaptureLayer,argSublayerIndex]);
            
            var argCaptureFrame = new Invocation.Argument({
                type:"CGRect",
                value:{
                    x:0,
                    y:0,
                    width:Screen.width,
                    height:Screen.height
            }});
            Invocation.invokeInstanceMethod(self.pageScanner.captureLayer,"setFrame:",[argCaptureFrame]);
            
            var argCaptureBack = new Invocation.Argument({
                type:"NSInteger",
                value: Invocation.invokeInstanceMethod(self.pageScanner.capture,"back",[],"NSInteger")
            });
            Invocation.invokeInstanceMethod(self.pageScanner.capture,"setCamera:",[argCaptureBack]);
            
            var argFocusMode = new Invocation.Argument({
                type:"NSInteger",
                value: AVCaptureFocusMode.ContinuousAutoFocus
            });
            Invocation.invokeInstanceMethod(self.pageScanner.capture,"setFocusMode:",[argFocusMode]);
            
            var CaptureDelegate = SF.defineClass("CaptureDelegate : NSObject <ZXCaptureDelegate>", {
                captureResultResult : function(capture, result){
                    var text = Invocation.invokeInstanceMethod(result,"text",[],"NSString");
                    var format = Invocation.invokeInstanceMethod(result,"barcodeFormat",[],"int");
                    if (typeof self.onResult === 'function') {
                        self.onResult({barcode : new Barcode({text : text,format : format})});
                    }
                },
                captureCameraIsReady: function(capture){},
                captureSizeWidthHeight: function(capture,width,height){}
            }); 
            
            self.pageScanner.captureDelegate = CaptureDelegate.new();
            var argCaptureDelegate = new Invocation.Argument({
                type:"NSObject",
                value: self.pageScanner.captureDelegate
            });
            Invocation.invokeInstanceMethod(self.pageScanner.capture,"setDelegate:",[argCaptureDelegate]);
        }
    });
    
    Object.defineProperty(self, 'layout', {
        get: function() {
            return self.pageScanner.layout;
        },
        enumerable: true
    });
    
    self.show = function(e){
        self.pageScanner.orientation = e.page.currentOrientation;
        e.page.nativeObject.presentViewController(self.pageScanner.nativeObject);
    };
    
    self.hide = function(e){
        Invocation.invokeInstanceMethod(self.pageScanner.capture,"stop",[]);
        self.pageScanner.nativeObject.dismissViewController();
    };
    
    self.startCamera = function(e){
        Invocation.invokeInstanceMethod(self.pageScanner.capture,"start",[]);
    };
    
    self.stopCamera = function(e){
        Invocation.invokeInstanceMethod(self.pageScanner.capture,"stop",[]);
    };
    
    self.applyOrientationParentView = function(){
        var argCapture= new Invocation.Argument({
            type:"NSObject",
            value: self.pageScanner.capture
        });
        
        Invocation.invokeClassMethod("ZXingObjcHelper","applyOrientation:",[argCapture]);
    };
    
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
}

BarcodeScanner.ios = {};
BarcodeScanner.ios.checkPermission = function(e){
    var argMediaType= new Invocation.Argument({
        type:"NSString",
        value: "vide"
    });
    var authStatus = Invocation.invokeClassMethod("AVCaptureDevice","authorizationStatusForMediaType:",[argMediaType],"NSInteger");
    if(authStatus == AVAuthorizationStatus.Authorized) {
        if (typeof e.onSuccess === 'function') {
            e.onSuccess();
        }
    } else if(authStatus == AVAuthorizationStatus.Denied){
        if (typeof e.onFailure === 'function') {
            e.onFailure();
        }
    } else if(authStatus == AVAuthorizationStatus.Restricted){
        if (typeof e.onFailure === 'function') {
            e.onFailure();
        }
    } else if(authStatus == AVAuthorizationStatus.NotDetermined){
        var argCompHandler= new Invocation.Argument({
            type:"BoolBlock",
            value: function(granted){
                __SF_Dispatch.mainAsync(function(){
                    if(granted){
                        if (typeof e.onSuccess === 'function') {
                            e.onSuccess();
                        }
                    }else {
                        if (typeof e.onFailure === 'function') {
                            e.onFailure();
                        }
                    }
                });
            }
        });
        Invocation.invokeClassMethod("AVCaptureDevice","requestAccessForMediaType:completionHandler:",[argMediaType,argCompHandler]);
    } else {
        if (typeof e.onFailure === 'function') {
            e.onFailure();
        }
    }
};

Object.defineProperty(Barcode, "FormatType",{
    value: {},
    enumerable: true
});

Object.defineProperties(Barcode.FormatType,{
    'AZTEC':{
        value: 0,
        enumerable: true
    },
    'CODABAR':{
        value: 1,
        enumerable: true
    },
    'CODE_39':{
        value: 2,
        enumerable: true
    },
    'CODE_93':{
        value: 3,
        enumerable: true
    },
    'CODE_128':{
        value: 4,
        enumerable: true
    },
    'DATA_MATRIX':{
        value: 5,
        enumerable: true
    },
    'EAN_8':{
        value: 6,
        enumerable: true
    },
    'EAN_13':{
        value: 7,
        enumerable: true
    },
    'ITF':{
        value: 8,
        enumerable: true
    },
    'MAXICODE':{
        value: 9,
        enumerable: true
    },
    'PDF_417':{
        value: 10,
        enumerable: true
    },
    'QR_CODE':{
        value: 11,
        enumerable: true
    },
    'RSS_14':{
        value: 12,
        enumerable: true
    },
    'RSS_EXPANDED':{
        value: 13,
        enumerable: true
    },
    'UPC_A':{
        value: 14,
        enumerable: true
    },
    'UPC_E':{
        value: 15,
        enumerable: true
    },
    'UPC_EAN_EXTENSION':{
        value: 16,
        enumerable: true
    }
});

module.exports = {BarcodeScanner: BarcodeScanner, Barcode: Barcode};