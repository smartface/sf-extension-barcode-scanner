const extend         = require("js-base/core/extend");
const Page           = require("sf-core/ui/page");
const FlexLayout     = require('sf-core/ui/flexlayout');
const Color          = require('sf-core/ui/color');
const Button         = require('sf-core/ui/button');
const Font           = require('sf-core/ui/font');
const BarcodeScanner = require("sf-extension-barcode").BarcodeScanner;
const System         = require('sf-core/device/system');
const Application    = require("sf-core/application"); 

var pageBarcode = extend(Page)(
    function(_super) {
        _super(this);
        var self = this;
        
        self.onShow = function() {
            self.headerBar.visible = false;  
        };

        self.onLoad = function() {
            var showScanner = new Button();
            showScanner.height = 100;
            showScanner.text = "Show Barcode Scanner";
            showScanner.onPress = function(){
                var barcodeScanner = new BarcodeScanner({
                    onResult : function(e){
                        console.log("Barcode :" + JSON.stringify(e.barcode));
                        barcodeScanner.stopCamera();
                        barcodeScanner.hide();
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
            
                if (System.OS == "iOS") {
                    BarcodeScanner.ios.checkPermission({
                        onSuccess : function(){
                            barcodeScanner.show({page:self, tag: "scannerPage"});
                        },
                        onFailure : function(){
                            const AlertView = require('sf-core/ui/alertview');
                            var myAlertView = new AlertView({
                                title: "",
                                message: "Need Permission"
                            });
                            myAlertView.addButton({
                                type: AlertView.Android.ButtonType.NEGATIVE,
                                text: "Ok"
                            });     
                            myAlertView.show();
                        }
                    });
                } else {
                    const CAMERA_PERMISSION_CODE = 1002;
                    if(Application.android.checkPermission(Application.Android.Permissions.CAMERA)){
                            barcodeScanner.show({page:self, tag: "scannerPage"});
                    }
                    else{
                         Application.android.requestPermissions(CAMERA_PERMISSION_CODE, Application.Android.Permissions.CAMERA);
                    }
                    
                    Application.android.onRequestPermissionsResult = function(e){
                        if(e.requestCode === CAMERA_PERMISSION_CODE && e.result) {
                            barcodeScanner.show({page:self, tag: "scannerPage"});
                        }
                    };
                }
            };
            
            self.layout.addChild(showScanner);
            self.layout.applyLayout();
        };
    }
);
        
module.exports = pageBarcode;