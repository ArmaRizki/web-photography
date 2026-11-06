import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X, Mail, CalendarClock, MapPin, Phone, User } from "lucide-react";
import { adminApi } from "../../services/adminApi";

const pad = (n) => String(n).padStart(2, "0");
const keyOf = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const labelOf = (date) => date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
const timeOf = (value) => (value || "").slice(0, 5) || "Time not set";

export default function Calendar() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [view, setView] = useState("month");
  const [selected, setSelected] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.getBookings();
      setBookings(response.data || []);
    } catch (error) {
      setNotice(error.response?.data?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const accepted = useMemo(
    () => bookings.filter((booking) => booking.status === "ACCEPTED" && booking.eventDate),
    [bookings]
  );

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [month]);

  const byDate = useMemo(() => {
    const result = {};
    accepted.forEach((booking) => {
      (result[booking.eventDate] ||= []).push(booking);
    });
    Object.values(result).forEach((items) =>
      items.sort((a, b) => (a.eventTime || "").localeCompare(b.eventTime || ""))
    );
    return result;
  }, [accepted]);

  const openBooking = (booking) => {
    setSelected(booking);
    setNewDate(booking.eventDate || "");
    setNewTime((booking.eventTime || "09:00").slice(0, 5));
    setNotice("");
  };

  const runAction = async (action) => {
    setBusy(true);
    setNotice("");
    try {
      await action();
      await load();
      setSelected(null);
      setNotice("Action completed.");
    } catch (error) {
      setNotice(error.response?.data?.message || "Action failed. Check backend logs.");
    } finally {
      setBusy(false);
    }
  };

  const reschedule = () => {
    if (!newDate || !newTime) {
      setNotice("Choose both a new date and time.");
      return;
    }
    if (!window.confirm(`Update ${selected.name}'s booking to ${newDate} at ${newTime}?`)) return;
    runAction(() => adminApi.rescheduleBooking(selected.id, {
      eventDate: newDate,
      eventTime: `${newTime}:00`,
    }));
  };

  const visibleDays = view === "day"
    ? days.filter((date) => keyOf(date) === keyOf(new Date()))
    : view === "week"
      ? days.filter((date) => {
          const start = new Date(month);
          start.setDate(start.getDate() - start.getDay());
          const end = new Date(start);
          end.setDate(start.getDate() + 7);
          return date >= start && date < end;
        })
      : days;

  return (
    <section className="text-gray-900">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">Booking Calendar</h1>
          <p className="mt-1 text-sm text-gray-500">Accepted bookings only</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex border border-gray-200">
            {["month", "week", "day"].map((item) => (
              <button key={item} type="button" onClick={() => setView(item)}
                className={`px-3 py-2 text-xs capitalize ${view === item ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                {item}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => { setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); setView("month"); }}
            className="border border-gray-200 px-3 py-2 text-xs hover:bg-gray-50">Today</button>
        </div>
      </div>

      {notice && <p className="mb-4 text-sm text-[#E11D48]" role="status">{notice}</p>}

      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMonth((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))}
            className="border border-gray-200 p-2 hover:bg-gray-50" aria-label="Previous month"><ChevronLeft size={17} /></button>
          <button type="button" onClick={() => setMonth((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))}
            className="border border-gray-200 p-2 hover:bg-gray-50" aria-label="Next month"><ChevronRight size={17} /></button>
          <h2 className="font-medium">{labelOf(month)}</h2>
        </div>
        <span className="text-xs text-gray-500">{accepted.length} accepted booking(s)</span>
      </div>

      {loading ? <p className="py-10 text-sm text-gray-500">Loading calendar...</p> : (
        <div className="overflow-x-auto border border-gray-200">
          <div className="min-w-[680px]">
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) =>
                <div key={day} className="px-2 py-3 text-center text-xs font-medium text-gray-500">{day}</div>
              )}
            </div>
            <div className="grid grid-cols-7">
              {visibleDays.map((date) => {
                const dateKey = keyOf(date);
                const items = byDate[dateKey] || [];
                const inMonth = date.getMonth() === month.getMonth();
                return (
                  <div key={dateKey} className={`min-h-28 border-b border-r border-gray-100 p-2 ${inMonth ? "bg-white" : "bg-gray-50/70"}`}>
                    <div className={`mb-2 text-xs ${inMonth ? "text-gray-700" : "text-gray-300"}`}>{date.getDate()}</div>
                    <div className="space-y-1">
                      {items.map((booking) => (
                        <button key={booking.id} type="button" onClick={() => openBooking(booking)}
                          title={`${timeOf(booking.eventTime)} · ${booking.name} · ${booking.eventType}`}
                          className="block w-full truncate border-l-2 border-[#E11D48] bg-rose-50 px-2 py-1 text-left text-[11px] text-rose-900 hover:bg-rose-100">
                          {timeOf(booking.eventTime)} · {booking.name}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#E11D48]">Accepted booking</p>
                <h2 className="mt-1 font-display text-xl">{selected.name}</h2>
              </div>
              <button type="button" className="p-2 hover:bg-gray-100" onClick={() => setSelected(null)} aria-label="Close"><X size={18} /></button>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <p className="flex items-center gap-2"><User size={15} /> {selected.eventType}</p>
              <p className="flex items-center gap-2"><Mail size={15} /> {selected.email}</p>
              <p className="flex items-center gap-2"><Phone size={15} /> {selected.phone}</p>
              <p className="flex items-center gap-2"><MapPin size={15} /> {selected.eventLocation || "-"}</p>
              <p className="text-gray-600">Package: {selected.packageTitle || "-"}</p>
              <p className="text-gray-600">Current schedule: {selected.eventDate} · {timeOf(selected.eventTime)}</p>
            </div>
            <div className="space-y-3 border-t border-gray-200 p-5">
              <h3 className="flex items-center gap-2 font-medium"><CalendarClock size={16} /> Change schedule</h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs text-gray-600">New date
                  <input type="date" value={newDate} onChange={(event) => setNewDate(event.target.value)}
                    className="mt-1 w-full border border-gray-300 p-2 text-sm text-gray-900" />
                </label>
                <label className="text-xs text-gray-600">New time
                  <input type="time" value={newTime} onChange={(event) => setNewTime(event.target.value)}
                    className="mt-1 w-full border border-gray-300 p-2 text-sm text-gray-900" />
                </label>
              </div>
              <button type="button" disabled={busy} onClick={reschedule}
                className="w-full border border-[#E11D48] py-2.5 text-sm text-[#E11D48] hover:bg-rose-50 disabled:opacity-50">
                Save schedule & send email
              </button>
              <button type="button" disabled={busy} onClick={() => runAction(() => adminApi.resendBookingEmail(selected.id))}
                className="w-full border border-gray-300 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-50">
                <span className="inline-flex items-center gap-2"><Mail size={15} /> Resend email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
