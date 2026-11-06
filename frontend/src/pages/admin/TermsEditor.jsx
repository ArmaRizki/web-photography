import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";

function renderMarkdown(source) {
  return source.split("\n").map((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("# ")) {
      return <h2 key={index} className="font-display text-2xl mt-8 mb-4">{trimmed.slice(2)}</h2>;
    }

    if (trimmed.startsWith("## ")) {
      return <h3 key={index} className="font-display text-xl mt-6 mb-3">{trimmed.slice(3)}</h3>;
    }

    if (trimmed.startsWith("- ")) {
      return <p key={index} className="text-gray-600 mb-2 pl-5 relative before:content-['•'] before:absolute before:left-0">{trimmed.slice(2)}</p>;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      return <p key={index} className="text-gray-600 mb-2">{trimmed}</p>;
    }

    if (!trimmed) return <div key={index} className="h-2" />;

    return <p key={index} className="text-gray-600 leading-relaxed mb-3">{trimmed}</p>;
  });
}

export default function TermsEditor() {
  const [form, setForm] = useState({
    title: "",
    introduction: "",
    content: "",
    version: "1",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTerms();
  }, []);

  async function loadTerms() {
    try {
      const { data } = await adminApi.getTerms();
      setForm(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load Terms & Conditions.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    setForm(current => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      setMessage("Title and content are required.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const { data } = await adminApi.updateTerms({
        title: form.title,
        introduction: form.introduction,
        content: form.content,
      });
      setForm(data);
      setMessage("Terms & Conditions saved and published.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to save Terms & Conditions.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8">Loading Terms & Conditions...</div>;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Terms & Conditions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edit the terms displayed on the public website.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Current version: {form.version}
        </p>
      </div>

      {message && (
        <div className="p-3 rounded bg-gray-100 text-sm">{message}</div>
      )}

      <div className="bg-white border rounded-lg p-5 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Page Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-md p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Introduction</label>
          <textarea
            name="introduction"
            value={form.introduction || ""}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-md p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Terms Content (Markdown)</label>
          <p className="text-xs text-gray-500 mb-2">
            # Heading, ## Subheading, **bold**, - bullet list, 1. numbered list.
          </p>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={24}
            className="w-full border rounded-md p-3 font-mono text-sm"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gray-900 text-white rounded-md disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save & Publish"}
        </button>
      </div>

      <div className="bg-white border rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-4">Preview</h2>
        <div className="prose max-w-none">
          {renderMarkdown(form.content)}
        </div>
      </div>
    </div>
  );
}
