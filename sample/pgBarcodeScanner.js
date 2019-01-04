const extend = require('js-base/core/extend');
const PgBarcodeScannerDesign = require('ui/ui_pgBarcodeScanner');
const BarcodeScanner = require("utils/BarcodeScanner");

const PgBarcodeScanner = extend(PgBarcodeScannerDesign)(
    function(_super) {
        _super(this);
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
    });

function onShow(superOnShow) {
    superOnShow();
    const page = this;
    var scanner = new BarcodeScanner(page);
    scanner.addEventListener(content => {
        console.log(content);
    });
    scanner.show();
}

function onLoad(superOnLoad) {
    superOnLoad();
}

module.exports = PgBarcodeScanner;
