/* globals requireClass */
const Barcode = require("./Barcode");
const AndroidConfig = require('sf-core/util/Android/androidconfig');

function BarcodeScanner(params) {
    if (!params.page)
        throw new Error("page parameter is required");

    Object.defineProperties(this, {
        'onResult': {
            get: () => this._onResult,
            set: e => this._onResult = e,
            enumerable: true
        },
        'startCamera': {
            value: () => {
                let layout = this.page.layout;
                layout.nativeObject.startCamera();
            },
            enumerable: true,
            configurable: true
        },
        'show': {
            value: () => {
                let layout = this.page.layout;
                const ZXingScannerView = requireClass("me.dm7.barcodescanner.zxing.ZXingScannerView");
                layout.nativeObject = new ZXingScannerView(AndroidConfig.activity);
                let resultHandler = ZXingScannerView.ResultHandler.implement({
                    handleResult: rawResult => {
                        this._onResult && this._onResult({
                            barcode: new Barcode({
                                text: rawResult.getText(),
                                format: rawResult.getBarcodeFormat().toString()
                            })
                        });
                    }
                });
                layout.nativeObject.setResultHandler(resultHandler);
                layout.nativeObject.resumeCameraPreview(resultHandler);
            },
            enumerable: true,
            configurable: true
        },
        'hide': {
            value: () => {
                let layout = this.page.layout;
                layout.removeAll();
            },
            enumerable: true,
            configurable: true
        },
        'stopCamera': {
            value: () => {
                let layout = this.page.layout;
                layout.nativeObject.stopCamera();
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

module.exports = {
    Barcode,
    BarcodeScanner
};
