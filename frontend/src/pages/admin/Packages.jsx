import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";

// Packages gets a dedicated page (rather than the generic AdminResourceManager)
// because "features" is a list, entered here as one line per feature.
export default function Packages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", price: "", featuresText: "", displayOrder: 0, highlighted: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    adminApi.getPackages().then((res) => setItems(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", price: "", featuresText: "", displayOrder: 0, highlighted: false });
    setError("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      price: item.price,
      featuresText: (item.features || []).join("\n"),
      displayOrder: item.displayOrder,
      highlighted: item.highlighted,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      title: form.title,
      price: Number(form.price),
      features: form.featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
      displayOrder: Number(form.displayOrder) || 0,
      highlighted: form.highlighted,
    };
    try {
      if (editing) await adminApi.updatePackage(editing.id, payload);
      else await adminApi.createPackage(payload);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please check the form.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    await adminApi.deletePackage(item.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-gray-900">Packages</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#E11D48] text-ink px-4 py-2 text-sm hover:bg-[#BE123C]">
          <Plus size={16} /> Add New
        </button>
      </div>

      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState message="No packages yet — add your first one." />
      ) : (
        <div className="border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-700">
                <th className="px-4 py-3 font-normal">Title</th>
                <th className="px-4 py-3 font-normal">Price</th>
                <th className="px-4 py-3 font-normal">Highlighted</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 last:border-0">
                  <td className="px-4 py-3 text-gray-700">{item.title}</td>
                  <td className="px-4 py-3 text-gray-700">₹{Number(item.price).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-gray-700">{item.highlighted ? "Yes" : "—"}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(item)} className="text-gray-700 hover:text-[#E11D48] mr-3"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(item)} className="text-gray-700 hover:text-burgundy"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-white/80 flex items-center justify-center p-6" onClick={() => setModalOpen(false)}>
          <div className="bg-white border border-gray-200 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-display text-lg text-gray-900">{editing ? "Edit" : "Add"} Package</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-700 hover:text-gray-900"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-gray-700 tracking-widest">TITLE</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                  className="w-full mt-1 bg-transparent border border-gray-200 focus:border-[#E11D48] outline-none px-3 py-2 text-gray-900" />
              </div>
              <div>
                <label className="text-xs text-gray-700 tracking-widest">PRICE (₹)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
                  className="w-full mt-1 bg-transparent border border-gray-200 focus:border-[#E11D48] outline-none px-3 py-2 text-gray-900" />
              </div>
              <div>
                <label className="text-xs text-gray-700 tracking-widest">FEATURES (ONE PER LINE)</label>
                <textarea rows={5} value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                  className="w-full mt-1 bg-transparent border border-gray-200 focus:border-[#E11D48] outline-none px-3 py-2 text-gray-900" />
              </div>
              <div>
                <label className="text-xs text-gray-700 tracking-widest">DISPLAY ORDER</label>
                <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                  className="w-full mt-1 bg-transparent border border-gray-200 focus:border-[#E11D48] outline-none px-3 py-2 text-gray-900" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.highlighted} onChange={(e) => setForm({ ...form, highlighted: e.target.checked })} className="accent-brass" />
                Mark as "Most Booked"
              </label>
              {error && <p className="text-burgundy text-sm">{error}</p>}
              <button type="submit" disabled={saving} className="w-full bg-[#E11D48] text-ink py-2.5 text-sm tracking-wide hover:bg-[#BE123C] disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
