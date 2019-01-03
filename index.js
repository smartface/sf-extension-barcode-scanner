const System = require("sf-core/device/system");
module.exports = require(`./barcode-${System.OS}`);
