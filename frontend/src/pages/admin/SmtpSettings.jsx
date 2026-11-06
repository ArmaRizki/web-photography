import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import { Mail, Save, Send, Wifi, Eye, EyeOff, LoaderCircle } from "lucide-react";

const defaults = {
  host: "smtp.gmail.com", port: 587, username: "", password: "",
  encryption: "STARTTLS", authentication: true,
  senderName: "ELVOVE Photography", senderEmail: "",
};

export default function SmtpSettings() {
  const [form, setForm] = useState(defaults);
  const [recipient, setRecipient] = useState("");
  const [passwordConfigured, setPasswordConfigured] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  useEffect(() => {
    adminApi.getSmtpSettings()
      .then(({ data }) => {
        setForm((old) => ({ ...old, ...data, password: "" }));
        setPasswordConfigured(Boolean(data.passwordConfigured));
      })
      .catch((e) => setNotice({ type: "error", text: e.response?.data?.message || "Gagal memuat pengaturan SMTP." }))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const save = async (e) => {
    e.preventDefault(); setSaving(true); setNotice({ type: "", text: "" });
    try {
      const payload = { ...form, port: Number(form.port) };
      if (!payload.password) delete payload.password;
      const { data } = await adminApi.saveSmtpSettings(payload);
      setPasswordConfigured(Boolean(data.passwordConfigured));
      setForm((old) => ({ ...old, ...data, password: "" }));
      setNotice({ type: "success", text: "Pengaturan SMTP berhasil disimpan." });
    } catch (e) {
      setNotice({ type: "error", text: e.response?.data?.message || "Gagal menyimpan pengaturan SMTP." });
    } finally { setSaving(false); }
  };
  const test = async () => {
    setTesting(true); setNotice({ type: "", text: "" });
    try {
      const { data } = await adminApi.testSmtpConnection();
      setNotice({ type: "success", text: data.message });
    } catch (e) {
      setNotice({ type: "error", text: e.response?.data?.message || "Koneksi SMTP gagal." });
    } finally { setTesting(false); }
  };
  const sendTest = async () => {
    if (!recipient.trim()) return setNotice({ type: "error", text: "Masukkan alamat email tujuan." });
    setSending(true); setNotice({ type: "", text: "" });
    try {
      const { data } = await adminApi.sendSmtpTestEmail(recipient.trim());
      setNotice({ type: "success", text: data.message });
    } catch (e) {
      setNotice({ type: "error", text: e.response?.data?.message || "Email percobaan gagal dikirim." });
    } finally { setSending(false); }
  };

  const input = "w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500";
  const label = "mb-1.5 block text-sm font-medium text-gray-700";
  if (loading) return <div className="py-10 text-sm text-gray-500">Memuat pengaturan SMTP...</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-start gap-3">
        <div className="rounded-lg bg-gray-100 p-3"><Mail size={22} /></div>
        <div><h1 className="text-2xl font-semibold text-gray-900">SMTP Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola server email untuk notifikasi dan konfirmasi booking ELVOVE.</p></div>
      </div>
      {notice.text && <div className={`mb-6 rounded-md border p-3 text-sm ${notice.type === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-700"}`}>{notice.text}</div>}

      <form onSubmit={save} className="space-y-6">
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-gray-900">SMTP Server</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className={label}>SMTP Host</label><input className={input} required value={form.host} onChange={(e) => set("host", e.target.value)} placeholder="smtp.gmail.com" /></div>
            <div><label className={label}>SMTP Port</label><input className={input} required type="number" min="1" max="65535" value={form.port} onChange={(e) => set("port", e.target.value)} /></div>
            <div><label className={label}>Encryption</label><select className={input} value={form.encryption} onChange={(e) => set("encryption", e.target.value)}><option value="STARTTLS">STARTTLS</option><option value="SSL">SSL / TLS</option><option value="NONE">None</option></select></div>
            <div className="sm:col-span-2"><label className={label}>Username / Email</label><input className={input} value={form.username} onChange={(e) => set("username", e.target.value)} autoComplete="username" /></div>
            <div className="sm:col-span-2"><label className={label}>SMTP Password / App Password</label>
              <div className="relative"><input className={`${input} pr-12`} type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} autoComplete="new-password" placeholder={passwordConfigured ? "Password tersimpan. Kosongkan jika tidak diganti." : "Masukkan password SMTP"} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-0 px-3 text-gray-500" aria-label="Toggle password">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
              <p className="mt-1 text-xs text-gray-500">Password dienkripsi sebelum disimpan dan tidak pernah dikirim kembali ke browser.</p>
            </div>
          </div>
          <label className="mt-5 flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={Boolean(form.authentication)} onChange={(e) => set("authentication", e.target.checked)} /> SMTP Authentication</label>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-gray-900">Sender Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={label}>Sender Name</label><input className={input} required value={form.senderName} onChange={(e) => set("senderName", e.target.value)} /></div>
            <div><label className={label}>Sender Email</label><input className={input} required type="email" value={form.senderEmail} onChange={(e) => set("senderEmail", e.target.value)} /></div>
          </div>
        </section>
        <div className="flex flex-wrap gap-3">
          <button disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">{saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />} Simpan Pengaturan</button>
          <button type="button" onClick={test} disabled={testing || (!passwordConfigured && !form.password)} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 disabled:opacity-50">{testing ? <LoaderCircle size={16} className="animate-spin" /> : <Wifi size={16} />} Test Connection</button>
        </div>
      </form>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-2 font-semibold text-gray-900">Send Test Email</h2>
        <p className="mb-4 text-sm text-gray-500">Simpan konfigurasi terlebih dahulu, lalu kirim email percobaan.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input className={input} type="email" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Alamat email penerima" />
          <button type="button" onClick={sendTest} disabled={sending || !passwordConfigured} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 disabled:opacity-50">{sending ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />} Send Test</button>
        </div>
      </section>
    </div>
  );
}
