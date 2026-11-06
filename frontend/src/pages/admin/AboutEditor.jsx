import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import LoadingState from "../../components/LoadingState";
import { getImageUrl } from "../../utils/imageUrl";

export default function AboutEditor() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.getAbout().then((res) => setForm(res.data));
  }, []);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const res = await adminApi.uploadFile(file);
    setForm((f) => ({ ...f, imageUrl: res.data.url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await adminApi.updateAbout(form);
    setSaving(false);
    setSaved(true);
  };

  if (!form) return <LoadingState />;

  const inputClass = "w-full mt-1 bg-transparent border border-gray-200 focus:border-[#E11D48] outline-none px-3 py-2 text-gray-900";

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-gray-900 mb-6">About Page</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs text-gray-700 tracking-widest">INTRODUCTION</label>
          <textarea rows={3} value={form.introduction || ""} onChange={(e) => setForm({ ...form, introduction: e.target.value })} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-700 tracking-widest">YEARS OF EXPERIENCE</label>
            <input type="number" value={form.yearsOfExperience || ""} onChange={(e) => setForm({ ...form, yearsOfExperience: Number(e.target.value) })} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-gray-700 tracking-widest">PHOTOGRAPHY STYLE</label>
            <input value={form.photographyStyle || ""} onChange={(e) => setForm({ ...form, photographyStyle: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-700 tracking-widest">LOCATION</label>
          <input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-gray-700 tracking-widest">STORY</label>
          <textarea rows={5} value={form.story || ""} onChange={(e) => setForm({ ...form, story: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-gray-700 tracking-widest">ACHIEVEMENTS</label>
          <textarea rows={3} value={form.achievements || ""} onChange={(e) => setForm({ ...form, achievements: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-gray-700 tracking-widest">PHOTO</label>
          <div className="mt-1 flex items-center gap-3">
            {form.imageUrl && <img src={getImageUrl(form.imageUrl)} alt="" className="w-16 h-16 object-cover border border-gray-200" />}
            <label className="flex items-center gap-2 text-xs border border-gray-200 px-3 py-2 cursor-pointer text-gray-700 hover:text-gray-900">
              <Upload size={14} /> {uploading ? "Uploading..." : "Upload image"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files[0])} />
            </label>
          </div>
        </div>
        {saved && <p className="text-[#E11D48] text-sm">Saved.</p>}
        <button type="submit" disabled={saving} className="bg-[#E11D48] text-ink px-6 py-2.5 text-sm tracking-wide hover:bg-[#BE123C] disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
