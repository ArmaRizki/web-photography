import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import LoadingState from "../../components/LoadingState";

export default function ContactEditor() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.getContact().then((res) => setForm(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await adminApi.updateContact(form);
    setSaving(false);
    setSaved(true);
  };

  if (!form) return <LoadingState />;

  const inputClass = "w-full mt-1 bg-transparent border border-gray-200 focus:border-[#E11D48] outline-none px-3 py-2 text-gray-900";

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-gray-900 mb-6">Contact Info</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs text-gray-700 tracking-widest">PHONE</label>
          <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-gray-700 tracking-widest">EMAIL</label>
          <input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-gray-700 tracking-widest">ADDRESS</label>
          <textarea rows={2} value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-gray-700 tracking-widest">GOOGLE MAPS EMBED LINK</label>
          <input value={form.googleMapLink || ""} onChange={(e) => setForm({ ...form, googleMapLink: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-gray-700 tracking-widest">WHATSAPP NUMBER (WITH COUNTRY CODE)</label>
          <input value={form.whatsappNumber || ""} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} className={inputClass} />
        </div>
        {saved && <p className="text-[#E11D48] text-sm">Saved.</p>}
        <button type="submit" disabled={saving} className="bg-[#E11D48] text-ink px-6 py-2.5 text-sm tracking-wide hover:bg-[#BE123C] disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
