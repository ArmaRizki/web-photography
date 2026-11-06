
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";

const statusColors = {
  PENDING: "text-[#E11D48]",
  ACCEPTED: "text-green-700",
  RESCHEDULE_REQUESTED: "text-amber-700",
  COMPLETED: "text-gray-500",
};

const formatPrice = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi
      .getBookings()
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, status) => {
    if (status === "ACCEPTED") {
      await adminApi.acceptBooking(id);
    } else {
      await adminApi.updateBookingStatus(id, status);
    }
    load();
  };

  const handleDelete = async (b) => {
    if (!window.confirm(`Delete inquiry from ${b.name}?`)) return;

    await adminApi.deleteBooking(b.id);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-gray-900 mb-6">
        Bookings
      </h1>

      {loading ? (
        <LoadingState />
      ) : bookings.length === 0 ? (
        <EmptyState message="No booking inquiries yet." />
      ) : (
        <div className="border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-700">
                <th className="px-4 py-3 font-normal">Name</th>
                <th className="px-4 py-3 font-normal">Contact</th>
                <th className="px-4 py-3 font-normal">Event</th>
                <th className="px-4 py-3 font-normal">Package</th>
                <th className="px-4 py-3 font-normal">Date & Time</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-gray-200 last:border-0 align-top"
                >
                  <td className="px-4 py-3 text-gray-900">
                    {b.name}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    <p>{b.email}</p>
                    <p>{b.phone}</p>
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    <p>{b.eventType}</p>
                    <p className="text-xs">{b.eventLocation}</p>
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {b.packageTitle ? (
                      <>
                        <p className="text-gray-900">
                          {b.packageTitle}
                        </p>
                        <p className="text-xs text-[#E11D48] mt-1">
                          {b.packagePrice != null
                            ? formatPrice(b.packagePrice)
                            : "-"}
                        </p>
                      </>
                    ) : (
                      <span className="text-gray-500 text-xs">
                        No package selected
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    <p>{b.eventDate}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {b.eventTime
                        ? b.eventTime.slice(0, 5)
                        : "-"}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      onChange={(e) =>
                        handleStatusChange(b.id, e.target.value)
                      }
                      className={`bg-transparent border border-gray-200 px-2 py-1 text-xs ${statusColors[b.status]}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="RESCHEDULE_REQUESTED">Reschedule requested</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(b)}
                      className="text-gray-700 hover:text-burgundy"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
