import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import { getImageUrl } from "../../utils/imageUrl";

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const emptyForm = { title: "", description: "", imageUrl: "", categoryId: "", featured: false, displayOrder: 0 };
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.getPhotos(), adminApi.getCategories()])
      .then(([p, c]) => {
        setPhotos(p.data);
        setCategories(c.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (photo) => {
    setEditing(photo);
    setForm({ ...photo, categoryId: photo.categoryId });
    setError("");
    setModalOpen(true);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminApi.uploadFile(file);
      setForm((f) => ({ ...f, imageUrl: res.data.url }));
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = { ...form, categoryId: Number(form.categoryId), displayOrder: Number(form.displayOrder) || 0 };
    try {
      if (editing) await adminApi.updatePhoto(editing.id, payload);
      else await adminApi.createPhoto(payload);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (photo) => {
    if (!window.confirm(`Delete "${photo.title}"?`)) return;
    await adminApi.deletePhoto(photo.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-gray-900">Photos</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#E11D48] text-ink px-4 py-2 text-sm hover:bg-[#BE123C]">
          <Plus size={16} /> Add New
        </button>
      </div>

      {loading ? (
        <LoadingState />
      ) : photos.length === 0 ? (
        <EmptyState message="No photos yet — add your first one." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((p) => (
            <div key={p.id} className="border border-gray-200 group relative">
              <img src={getImageUrl(p.thumbnailUrl || p.imageUrl)} alt={p.title} className="w-full h-40 object-cover" />
              <div className="p-3">
                <p className="text-gray-900 text-sm truncate">{p.title}</p>
                <p className="text-gray-700 text-xs">{p.categoryName}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(p)} className="bg-white/80 p-1.5 text-gray-900 hover:text-[#E11D48]"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(p)} className="bg-white/80 p-1.5 text-gray-900 hover:text-burgundy"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-white/80 flex items-center justify-center p-6" onClick={() => setModalOpen(false)}>
          <div className="bg-white border border-gray-200 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-display text-lg text-gray-900">{editing ? "Edit" : "Add"} Photo</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-700 hover:text-gray-900"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-gray-700 tracking-widest">TITLE</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                  className="w-full mt-1 bg-transparent border border-gray-200 focus:border-[#E11D48] outline-none px-3 py-2 text-gray-900" />
              </div>
              <div>
                <label className="text-xs text-gray-700 tracking-widest">DESCRIPTION</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full mt-1 bg-transparent border border-gray-200 focus:border-[#E11D48] outline-none px-3 py-2 text-gray-900" />
              </div>
              <div>
                <label className="text-xs text-gray-700 tracking-widest">CATEGORY</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full mt-1 bg-transparent border border-gray-200 focus:border-[#E11D48] outline-none px-3 py-2 text-gray-900">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-700 tracking-widest">IMAGE</label>
                <div className="mt-1 flex items-center gap-3">
                 {form.imageUrl && <img src={getImageUrl(form.imageUrl)}alt="" className="w-14 h-14 object-cover border border-gray-200" />}
                  <label className="flex items-center gap-2 text-xs border border-gray-200 px-3 py-2 cursor-pointer text-gray-700 hover:text-gray-900">
                    <Upload size={14} /> {uploading ? "Uploading..." : "Upload image"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files[0])} />
                  </label>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-brass" />
                Featured on homepage
              </label>
              <div>
                <label className="text-xs text-gray-700 tracking-widest">DISPLAY ORDER</label>
                <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                  className="w-full mt-1 bg-transparent border border-gray-200 focus:border-[#E11D48] outline-none px-3 py-2 text-gray-900" />
              </div>
              {error && <p className="text-burgundy text-sm">{error}</p>}
              <button type="submit" disabled={saving || uploading} className="w-full bg-[#E11D48] text-ink py-2.5 text-sm tracking-wide hover:bg-[#BE123C] disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
