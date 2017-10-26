const extend         = require("js-base/core/extend");
const Page           = require("sf-core/ui/page");
const FlexLayout     = require('sf-core/ui/flexlayout');
const Color          = require('sf-core/ui/color');
const Button         = require('sf-core/ui/button');
const Font           = require('sf-core/ui/font');
const BarcodeScanner = require("sf-extension-barcode").BarcodeScanner;

var pageBarcode = extend(Page)(
    function(_super) {
        _super(this);
        
        var self = this;
        self.orientation = Page.Orientation.AUTO;
        
        self.onShow = function() {
            self.headerBar.visible = false;  
        };
        
        self.onLoad = function() {
            var barcodeScanner = new BarcodeScanner({
                onResult : function(e){
                    barcodeScanner.stopCamera();
                    console.log("Barcode :" + JSON.stringify(e.barcode));
                }
            });
            
            var btnHideScanner = new Button();
            btnHideScanner.text = "X";
            btnHideScanner.positionType = FlexLayout.PositionType.ABSOLUTE;
            btnHideScanner.top = 20;
            btnHideScanner.right = 10;
            btnHideScanner.width = 80;
            btnHideScanner.height = 80;
            btnHideScanner.textColor = Color.WHITE;
            btnHideScanner.backgroundColor = Color.create(100,0,0,0);
            btnHideScanner.borderRadius = 40;
            btnHideScanner.font = Font.create(Font.DEFAULT,20,Font.BOLD);
            btnHideScanner.onPress = function(){
                barcodeScanner.hide();
            };
            
            barcodeScanner.layout.addChild(btnHideScanner);
                
            var showScanner = new Button({height: 100, text: "Show Barcode Scanner"});
            showScanner.onResult = function(e) {
                console.log("Barcode: " + JSON.stringify(e));   
            };
            
            showScanner.onPress = function(){
                barcodeScanner.show({page:self, tag: "scannerPage"});
            };
            
            self.layout.addChild(showScanner);
            
            self.layout.applyLayout();
        };
    }
);
        
module.exports = pageBarcode;