# sf-extension-barcode
[![Twitter: @Smartface_io](https://img.shields.io/badge/contact-@Smartface_io-blue.svg?style=flat)](https://twitter.com/smartface_io)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/smartface/sf-extension-barcode/master/LICENSE)
## Installation
Smartface Barcode Extension can be installed via npm easily from our public npm repository. The installation is pretty easy via Smartface Cloud IDE.
- Run command
```shell
(cd ~/workspace/scripts && npm i -S sf-extension-barcode)
```
- Finally require the extension as:
```javascript
const BarcodeScanner = require("sf-extension-barcode").BarcodeScanner;
```
## How to use
1) Require extension with
```javascript
const BarcodeScanner = require("sf-extension-barcode").BarcodeScanner;
```
2) Create an instance of `BarcodeScanner` via below example. You have to create barcode scanner object after `onShow` method. The scanning page is a fullscreen page.
```javascript
var barcodeScanner = new BarcodeScanner();
```
3) You can customize scanning page using `barcodeScanner.layout`. Look at sample code in [sample](./sample) folder for details.
```javascript
barcodeScanner.layout.addChild(view);
```
4) Set `onResult` callback to handle the result: 
```javascript
barcodeScanner.onResult = function(e) {
    var barcode = e.barcode;
    var format = e.barcode.format;
    page.lblBarcode.text = barcode.text;
    barcodeScanner.stopCamera();
    barcodeScanner.hide();
}
```
5) Finally call `show` method with required parameters to scan barcode. Don't forget to guarantee camera [permission](#permissions) before `show` method.
```javascript
barcodeScanner.show({page: pageInstance, tag: "myPageTag"});
```

## Barcode Format Type
Supported Formats: 
```javascript
Barcode.FormatType.AZTEC
Barcode.FormatType.CODABAR
Barcode.FormatType.CODE_39
Barcode.FormatType.CODE_93
Barcode.FormatType.CODE_128
Barcode.FormatType.DATA_MATRIX
Barcode.FormatType.EAN_8
Barcode.FormatType.EAN_13
Barcode.FormatType.ITF
Barcode.FormatType.MAXICODE
Barcode.FormatType.PDF_417
Barcode.FormatType.QR_CODE
Barcode.FormatType.RSS_14
Barcode.FormatType.RSS_EXPANDED
Barcode.FormatType.UPC_A
Barcode.FormatType.UPC_E
Barcode.FormatType.UPC_EAN_EXTENSION
```    

You can get format type via below code.
```javascript
barcodeScanner.onResult = function(e) {
    var barcode = e.barcode;
    if(barcode.format === Barcode.FormatType.QR_CODE) {
        console.log("This is a qr code");
    }
```    
## Notes
1. Hiding the barcodeScanner causes [page.onShow](http://ref.smartface.io/#!/api/UI.Page-event-onShow) event to be fired.
2. If there is a need for closing the scanner, it needs to be implemented by the developer. UI close button example is in [sample](./sample) folder. For Android [onBackButtonPressed](http://ref.smartface.io/#!/api/UI.Page-event-onBackButtonPressed) needs to be implemented.
3. Scanner does not hide automatically when scanned
4. A scanner instance can be used only for once per image scan. For each scan action, a new `barcodeScanner` instance should be created and used
5. For Android, if there is an active textbox (keyboard is visible), developer needs to close the keyboard before showing the scanner.

## Permissions
 For iOS, you have to add camera permission to Info.plist.
```xml
<key>NSCameraUsageDescription</key>
<string>${PRODUCT_NAME} Camera Usage</string>
```
For Android, you have to add camera permission to AndroidManifest.xml.
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus" />
```
## Sample
The folder [sample](./sample) holds the example codes. You can use it with the package.
```javascript
Router.add("barcodeScanner", require("sf-extension-barcode/sample/barcodeScanner"));
Router.go("barcodeScanner");
```
## Credits
This barcode library is based on:
1) Android implementation: https://github.com/dm77/barcodescanner
2) iOS implementation: https://github.com/TheLevelUp/ZXingObjC
## Need Help?
Please [submit an issue](https://github.com/smartface/sf-extension-barcode/issues) on GitHub and provide information about your problem.
## Support & Documentation & Useful Links
- [Smartface Cloud Dashboard](https://cloud.smartface.io)
## Code of Conduct
We are committed to making participation in this project a harassment-free experience for everyone, regardless of the level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.
Please read and follow our [Code of Conduct](https://github.com/smartface/sf-extension-barcode/blob/master/CODE_OF_CONDUCT.md).
## License
This project is licensed under the terms of the MIT license. See the [LICENSE](https://raw.githubusercontent.com/smartface/sf-extension-barcode/master/LICENSE) file. Within the scope of this license, all modifications to the source code, regardless of the fact that it is used commercially or not, shall be committed as a contribution back to this repository.
