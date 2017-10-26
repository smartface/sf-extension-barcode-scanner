# sf-extension-barcode
[![Twitter: @Smartface_io](https://img.shields.io/badge/contact-@Smartface_io-blue.svg?style=flat)](https://twitter.com/smartface_io)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/smartface/sf-extension-barcode/master/LICENSE)

## Installation
Smartface Barcode Extension can be installed via npm easily from our public npm repository. The installation is pretty easy via Smartface Cloud IDE.

- Open scripts/package.json file inside your workspace.
- Add Barcode extension dependency as:`"sf-extension-barcode": "^1.0.0"`
- Run command `npm install` under the folder `scripts`
- Finally require the extension as: `require("sf-extension-barcode")`

## How to use
1) Require extension with `require("sf-extension-barcode").BarcodeScanner`
2) Create an instance of `BarcodeScanner` via below example. The scanning page is a fullscreen page.
```javascript
var barcodeScanner = new BarcodeScanner();
```
3) You can customize scanning page using `barcodeScanner.layout`. Look at sample code in `sample` folder for details.
```javascript
barcodeScanner.layout.addChild(view);
```
4) Set `onResult` callback to handle the result: 
```javascript
barcodeScanner.onResult = function(e) {
    var barcode = e.barcode;
}
```
5) Finally call `show` method with required parameters to scan barcode. Don't forget to guarantee camera permission for android before calling `show` method.
```javascript
barcodeScanner.show({page: pageInstance, tag: "myPageTag"});
```
## Sample
The folder `sample` holds the example codes. You can put them into your workspace and start using it. 

## Need Help?
Please [submit an issue](https://github.com/smartface/sf-extension-barcode/issues) on GitHub and provide information about your problem.

## Support & Documentation & Useful Links
- [Smartface Cloud Dashboard](https://cloud.smartface.io)
## Code of Conduct
We are committed to making participation in this project a harassment-free experience for everyone, regardless of the level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.
Please read and follow our [Code of Conduct](https://github.com/smartface/sf-extension-barcode/blob/master/CODE_OF_CONDUCT.md).
## License

This project is licensed under the terms of the MIT license. See the [LICENSE](https://raw.githubusercontent.com/smartface/sf-extension-barcode/master/LICENSE) file. Within the scope of this license, all modifications to the source code, regardless of the fact that it is used commercially or not, shall be committed as a contribution back to this repository.