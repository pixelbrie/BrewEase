export default class DailyReport {
  constructor({ reportId, date=null, totalSales=0.0, taxCollected=0.0, tipCollected=0.0, orderCount=0 }) {
    this.reportId = reportId;
    this.date = date || new Date().toISOString();
    this.totalSales = totalSales;
    this.taxCollected = taxCollected;
    this.tipCollected = tipCollected;
    this.orderCount = orderCount;
  }
}