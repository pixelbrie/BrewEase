function ScheduleCard() {
  const mockSchedule = [
    { id: 1, day: "Monday", shift: "9:00 AM - 2:00 PM", location: "Main Cafe" },
    { id: 2, day: "Wednesday", shift: "11:00 AM - 5:00 PM", location: "Main Cafe" },
    { id: 3, day: "Friday", shift: "8:00 AM - 1:00 PM", location: "Main Cafe" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <h2 className="text-2xl font-bold text-coffee-900 mb-4">Schedule</h2>

      <div className="space-y-3">
        {mockSchedule.map((shift) => (
          <div
            key={shift.id}
            className="border border-coffee-200 rounded-md p-3 bg-coffee-50"
          >
            <p className="font-semibold text-coffee-900">{shift.day}</p>
            <p className="text-coffee-700">{shift.shift}</p>
            <p className="text-sm text-coffee-600">{shift.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScheduleCard;