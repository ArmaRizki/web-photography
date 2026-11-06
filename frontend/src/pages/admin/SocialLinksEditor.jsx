import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import LoadingState from "../../components/LoadingState";

const fields = [
  "instagram",
  "threads",
  "tiktok",
  "facebook",
  "youtube",
  "pinterest",
  "linkedin",
];

const labels = {
  instagram: "Instagram",
  threads: "Threads",
  tiktok: "TikTok",
  facebook: "Facebook",
  youtube: "YouTube",
  pinterest: "Pinterest",
  linkedin: "LinkedIn",
};

export default function SocialLinksEditor() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.getSocialLinks()
      .then((res) => setForm(res.data))
      .catch(() => setError("Failed to load social links."));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      await adminApi.updateSocialLinks(form);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save social links.");
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return error ? <p className="text-red-600">{error}</p> : <LoadingState />;
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-gray-900 mb-6">
        Social Links
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field}>
            <label className="text-xs text-gray-700 tracking-widest">
              {labels[field].toUpperCase()} URL
            </label>

            <input
              type="url"
              value={form[field] || ""}
              placeholder={`https://${field === "threads" ? "www.threads.net" : field === "tiktok" ? "www.tiktok.com" : `${field}.com`}/...`}
              onChange={(e) => {
                setForm({ ...form, [field]: e.target.value });
                setSaved(false);
              }}
              className="w-full mt-1 bg-transparent border border-gray-200 focus:border-[#E11D48] outline-none px-3 py-2 text-gray-900"
            />
          </div>
        ))}

        {saved && (
          <p className="text-[#E11D48] text-sm">Saved successfully.</p>
        )}

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-[#E11D48] text-white px-6 py-2.5 text-sm tracking-wide hover:bg-[#BE123C] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
