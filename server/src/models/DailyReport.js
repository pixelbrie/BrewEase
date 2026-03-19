export default class DailyReport {
<<<<<<< HEAD
  constructor({ reportId, date, totalSales=0.0, taxCollected=0.0, tipCollected=0.0, orderCount=0 }) {
=======
  constructor(reportId, date, totalSales=0.0, taxCollected=0.0, tipCollected=0.0, orderCount=0) {
>>>>>>> 9159b27 (feat: finished models)
    this.reportId = reportId;
    this.date = date;
    this.totalSales = totalSales;
    this.taxCollected = taxCollected;
    this.tipCollected = tipCollected;
    this.orderCount = orderCount;
  }
}