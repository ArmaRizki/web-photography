import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { publicApi } from "../services/publicApi";

export default function WhatsAppButton() {
  const [number, setNumber] = useState(null);

  useEffect(() => {
    publicApi.getContact().then((res) => setNumber(res.data.whatsappNumber)).catch(() => {});
  }, []);

  if (!number) return null;

  const cleanNumber = number.replace(/[^0-9]/g, "");

  return (
    <a
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform"
    >
      <MessageCircle size={24} />
    </a>
  );
}
