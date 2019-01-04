const Screen = require("sf-core/device/screen");
const Application = require("sf-core/application");
const System = require("sf-core/device/system");
const SFBarcodeScanner = require("sf-extension-barcode").BarcodeScanner;
const AlertView = require('sf-core/ui/alertview');
var isIOS = System.OS === "iOS";

function BarcodeScanner(page) {
    this.listeners = [];
    this.showScanPage = showScanPage.bind(this);
    this.barcodeScanner = new SFBarcodeScanner({
        layout: page.layout,
        width: Screen.width,
        height: Screen.height,
        onResult: e => {
            this.hide();
            this.listeners.forEach(f => f.call(null, e.barcode.text));
            this.listeners = [];
            page.router.dismiss();
        }
    });
}

BarcodeScanner.prototype.show = function() {
    if (isIOS) {
        SFBarcodeScanner.ios.checkPermission({
            onSuccess: this.showScanPage,
            onFailure: () => askUserForPermssion(() => Application.call(`app-settings:root=LOCATION_SERVICES`))
        });
    }
    else {
        const CAMERA_PERMISSION_CODE = 1002;
        if (Application.android.checkPermission(Application.Android.Permissions.CAMERA)) {
            this.showScanPage();
        }
        else {
            Application.android.requestPermissions(CAMERA_PERMISSION_CODE, Application.Android.Permissions.CAMERA);
        }
        Application.android.onRequestPermissionsResult = e => {
            if (e.requestCode === CAMERA_PERMISSION_CODE && e.result) {
                this.showScanPage();
            }
        };
    }
};

BarcodeScanner.prototype.hide = function() {
    this.barcodeScanner.stopCamera();
    this.barcodeScanner.hide();
};

BarcodeScanner.prototype.addEventListener = function(e) {
    this.listeners.push(e);
};

function showScanPage() {
    this.barcodeScanner.show();
    setTimeout(() => {
        this.barcodeScanner.startCamera();
    }, 250);
}

function askUserForPermssion(callback) {
    var alertView = new AlertView({
        title: global.lang.needCameraPermission,
    });
    alertView.addButton({
        text: global.lang.doNotAllow,
        onClick: alertView.dismiss()
    });
    alertView.addButton({
        text: global.lang.allow,
        onClick: callback()
    });
    alertView.show();
}

module.exports = BarcodeScanner;
