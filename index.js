if (Device.deviceOS === "iOS") {
  module.exports = require('./barcode-iOS');
} else if (Device.deviceOS === "Android") {
  module.exports = require('./barcode-Android');
}