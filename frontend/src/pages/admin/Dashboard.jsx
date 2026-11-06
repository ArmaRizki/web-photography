import { useEffect, useState } from "react";
import { Image, CalendarCheck, Package } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import LoadingState from "../../components/LoadingState";

const cards = [
  { key: "totalPhotos", label: "Total Photos", icon: Image },
  { key: "totalBookings", label: "Total Bookings", icon: CalendarCheck },
  { key: "totalPackages", label: "Total Packages", icon: Package },
];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    adminApi.getDashboardSummary().then((res) => setSummary(res.data));
  }, []);

  if (!summary) return <LoadingState />;

  return (
    <div>
      <h1 className="font-display text-2xl text-gray-900 mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ key, label, icon: Icon }) => (
          <div key={key} className="border border-gray-200 p-6 flex items-center gap-4">
            <div className="bg-white p-3 text-[#E11D48]">
              <Icon size={22} />
            </div>
            <div>
              <p className="font-display text-3xl text-gray-900">{summary[key]}</p>
              <p className="text-xs text-gray-700 tracking-widest mt-1">{label.toUpperCase()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
