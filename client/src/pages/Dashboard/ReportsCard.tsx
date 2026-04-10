function ReportsCard() {
  const mockReports = {
    hoursToday: 5,
    hoursThisWeek: 23,
    shiftsThisWeek: 4,
    tipsThisWeek: 126.5,
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <h2 className="text-2xl font-bold text-coffee-900 mb-4">Reports</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-coffee-50 rounded-md p-4">
          <p className="text-sm text-coffee-600">Hours Today</p>
          <p className="text-2xl font-bold text-coffee-900">
            {mockReports.hoursToday}
          </p>
        </div>

        <div className="bg-coffee-50 rounded-md p-4">
          <p className="text-sm text-coffee-600">Hours This Week</p>
          <p className="text-2xl font-bold text-coffee-900">
            {mockReports.hoursThisWeek}
          </p>
        </div>

        <div className="bg-coffee-50 rounded-md p-4">
          <p className="text-sm text-coffee-600">Shifts This Week</p>
          <p className="text-2xl font-bold text-coffee-900">
            {mockReports.shiftsThisWeek}
          </p>
        </div>

        <div className="bg-coffee-50 rounded-md p-4">
          <p className="text-sm text-coffee-600">Tips This Week</p>
          <p className="text-2xl font-bold text-coffee-900">
            ${mockReports.tipsThisWeek}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReportsCard;