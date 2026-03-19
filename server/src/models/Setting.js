export default class Setting {
  constructor(settingId, cafeName, address, timezone, currency, taxRate) {
    this.settingId = settingId;
    this.cafeName = cafeName;
    this.address = address;
    this.timezone = timezone;
    this.currency = currency;
    this.taxRate = taxRate;
  }
}