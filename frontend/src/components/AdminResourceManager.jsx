import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { adminApi } from "../services/adminApi";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import { getImageUrl } from "../utils/imageUrl";

/**
 * Generic CRUD manager used by every simple admin resource (Services, Packages,
 * Testimonials, Videos, FAQs, Categories...). Photos gets its own page since it
 * also needs category selection wired to a live list, but follows this same shape.
 *
 * fields: [{ name, label, type: 'text'|'textarea'|'number'|'checkbox'|'image', required }]
 */
export default function AdminResourceManager({ title, fields, columns, api, emptyDefaults }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyDefaults);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.list().then((res) => setItems(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyDefaults);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...emptyDefaults, ...item });
    setError("");
    setModalOpen(true);
  };

  const handleFileUpload = async (fieldName, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminApi.uploadFile(file);
      setForm((f) => ({ ...f, [fieldName]: res.data.url }));
    } catch {
      setError("Image upload failed. Please try a different file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await api.update(editing.id, form);
      } else {
        await api.create(form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please check the form and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item[columns[0].key]}"? This cannot be undone.`)) return;
    await api.delete(item.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-gray-900">{title}</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#E11D48] text-ink px-4 py-2 text-sm hover:bg-[#BE123C] transition-colors"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState message={`No ${title.toLowerCase()} yet — add your first one.`} />
      ) : (
        <div className="border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-700">
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-normal">{c.label}</th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 last:border-0">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-gray-700">
                      {c.render ? c.render(item[c.key], item) : String(item[c.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(item)} className="text-gray-700 hover:text-[#E11D48] mr-3">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(item)} className="text-gray-700 hover:text-burgundy">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-white/80 flex items-center justify-center p-6" onClick={() => setModalOpen(false)}>
          <div className="bg-white border border-gray-200 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-display text-lg text-gray-900">{editing ? "Edit" : "Add"} {title.slice(0, -1) || title}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-700 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="text-xs text-gray-700 tracking-widest">{f.label.toUpperCase()}</label>

                  {f.type === "textarea" && (
                    <textarea
                      rows={3}
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full mt-1 bg-transparent border border-gray-200 focus:border-[#E11D48] outline-none px-3 py-2 text-gray-900"
                      required={f.required}
                    />
                  )}

                  {f.type === "checkbox" && (
                    <div className="mt-2">
                      <input
                        type="checkbox"
                        checked={!!form[f.name]}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })}
                        className="accent-brass"
                      />
                    </div>
                  )}

                  {f.type === "image" && (
                    <div className="mt-1 flex items-center gap-3">
                      {form[f.name] && (
                        <img src={getImageUrl(form[f.name])} alt="" className="w-14 h-14 object-cover border border-gray-200" />
                      )}
                      <label className="flex items-center gap-2 text-xs border border-gray-200 px-3 py-2 cursor-pointer text-gray-700 hover:text-gray-900">
                        <Upload size={14} />
                        {uploading ? "Uploading..." : "Upload image"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(f.name, e.target.files[0])}
                        />
                      </label>
                    </div>
                  )}

                  {(f.type === "text" || f.type === "number" || f.type === undefined) && (
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      value={form[f.name] ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, [f.name]: f.type === "number" ? e.target.value : e.target.value })
                      }
                      className="w-full mt-1 bg-transparent border border-gray-200 focus:border-[#E11D48] outline-none px-3 py-2 text-gray-900"
                      required={f.required}
                    />
                  )}
                </div>
              ))}

              {error && <p className="text-burgundy text-sm">{error}</p>}

              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full bg-[#E11D48] text-ink py-2.5 text-sm tracking-wide hover:bg-[#BE123C] transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
