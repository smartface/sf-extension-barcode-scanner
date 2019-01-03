/* globals SF, __SF_Dispatch */
const Invocation = require('sf-core/util').Invocation;
const Screen = require('sf-core/device/screen');
const Barcode = require("./Barcode");

const AVCaptureFocusMode = {
    Locked: 0,
    AutoFocus: 1,
    ContinuousAutoFocus: 2
};

const AVAuthorizationStatus = {
    NotDetermined: 0,
    Restricted: 1,
    Denied: 2,
    Authorized: 3,
};

function BarcodeScanner(params) {
    if (!params.page)
        throw new Error("page parameter is required");

    Object.defineProperties(this, {
        'onResult': {
            get: () => this._onResult,
            set: e => this._onResult = e,
            enumerable: true
        },
        'layout': {
            get: () => this.page.layout,
            enumerable: true
        },
        'startCamera': {
            value: () => {
                this.cameraStarted = true;
                Invocation.invokeInstanceMethod(this.page.capture, "start", []);
            },
            enumerable: true,
            configurable: true
        },
        'show': {
            value: () => {
                let page = this.page;
                let alloc = Invocation.invokeClassMethod("ZXCapture", "alloc", [], "id");
                page.capture = Invocation.invokeInstanceMethod(alloc, "init", [], "id");
                page.captureLayer = Invocation.invokeInstanceMethod(page.capture,
                    "layer", [], "NSObject");

                let argCaptureLayer = new Invocation.Argument({
                    type: "NSObject",
                    value: page.captureLayer
                });
                let argSublayerIndex = new Invocation.Argument({
                    type: "NSUInteger",
                    value: 0
                });
                Invocation.invokeInstanceMethod(page.layout.nativeObject.layer,
                    "insertSublayer:atIndex:", [argCaptureLayer, argSublayerIndex]);

                let argCaptureFrame = new Invocation.Argument({
                    type: "CGRect",
                    value: {
                        x: 0,
                        y: 0,
                        width: Screen.width,
                        height: Screen.height
                    }
                });
                Invocation.invokeInstanceMethod(page.captureLayer, "setFrame:", [argCaptureFrame]);

                let argCaptureBack = new Invocation.Argument({
                    type: "NSInteger",
                    value: Invocation.invokeInstanceMethod(page.capture, "back", [], "NSInteger")
                });
                Invocation.invokeInstanceMethod(page.capture, "setCamera:", [argCaptureBack]);

                let argFocusMode = new Invocation.Argument({
                    type: "NSInteger",
                    value: AVCaptureFocusMode.ContinuousAutoFocus
                });
                Invocation.invokeInstanceMethod(page.capture, "setFocusMode:", [argFocusMode]);

                let CaptureDelegate = SF.defineClass("CaptureDelegate : NSObject <ZXCaptureDelegate>", {
                    captureResultResult: (capture, result) => {
                        if (!this.cameraStarted) {
                            return;
                        }
                        let text = Invocation.invokeInstanceMethod(result, "text", [], "NSString");
                        let format = Invocation.invokeInstanceMethod(result, "barcodeFormat", [], "int");
                        this.onResult && this.onResult({
                            barcode: new Barcode({
                                text,
                                format
                            })
                        });
                    },
                    captureCameraIsReady: function(capture) {},
                    captureSizeWidthHeight: function(capture, width, height) {}
                });

                page.captureDelegate = CaptureDelegate.new();
                let argCaptureDelegate = new Invocation.Argument({
                    type: "NSObject",
                    value: page.captureDelegate
                });
                Invocation.invokeInstanceMethod(page.capture, "setDelegate:", [
                    argCaptureDelegate
                ]);
                this.cameraStarted = true;
            },
            enumerable: true,
            configurable: true
        },
        'hide': {
            value: () => {
                this.layout.removeAll();
            },
            enumerable: true,
            configurable: true
        },
        'stopCamera': {
            value: () => {
                this.cameraStarted = false;
                Invocation.invokeInstanceMethod(this.page.capture, "stop", []);
            },
            enumerable: true,
            configurable: true
        },
        'toString': {
            value: () => "BarcodeScanner",
            enumerable: true,
            configurable: true
        }
    });

    if (params) {
        for (let param in params) {
            this[param] = params[param];
        }
    }
}

BarcodeScanner.ios = {};
BarcodeScanner.ios.checkPermission = e => {
    let onSuccess = typeof e.onSuccess === 'function' ? e.onSuccess : () => {};
    let onFailure = typeof e.onFailure === 'function' ? e.onFailure : () => {};
    let argMediaType = new Invocation.Argument({
        type: "NSString",
        value: "vide"
    });
    let authStatus = Invocation.invokeClassMethod("AVCaptureDevice",
        "authorizationStatusForMediaType:", [argMediaType], "NSInteger");
    if (authStatus == AVAuthorizationStatus.Authorized) {
        onSuccess();
    }
    else if (authStatus == AVAuthorizationStatus.Denied) {
        onFailure();
    }
    else if (authStatus == AVAuthorizationStatus.Restricted) {
        onFailure();
    }
    else if (authStatus == AVAuthorizationStatus.NotDetermined) {
        let argCompHandler = new Invocation.Argument({
            type: "BoolBlock",
            value: granted => {
                __SF_Dispatch.mainAsync(() => granted ? onSuccess() : onFailure());
            }
        });
        Invocation.invokeClassMethod("AVCaptureDevice",
            "requestAccessForMediaType:completionHandler:", [
                argMediaType, argCompHandler
            ]);
    }
    else {
        onFailure();
    }
};

module.exports = {
    BarcodeScanner,
    Barcode
};
