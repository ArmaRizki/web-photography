import { useEffect, useState } from "react";
import { publicApi } from "../services/publicApi";
import SectionHeading from "../components/SectionHeading";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import { X } from "lucide-react";
import { getImageUrl } from "../utils/imageUrl";

export default function Portfolio() {
  const [categories, setCategories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([publicApi.getCategories(), publicApi.getPhotos()])
      .then(([catRes, photoRes]) => {
        setCategories(catRes.data);
        setPhotos(photoRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory
    ? photos.filter((p) => p.categoryId === activeCategory)
    : photos;

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      <SectionHeading title="Portfolio" subtitle="Weddings, portraits, and everything in between." />

      <div className="flex flex-wrap gap-3 mb-10">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-1.5 text-sm border transition-colors ${
            activeCategory === null ? "border-[#E11D48] text-[#E11D48]" : "border-gray-200 text-gray-700 hover:text-gray-900"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-4 py-1.5 text-sm border transition-colors ${
              activeCategory === c.id ? "border-[#E11D48] text-[#E11D48]" : "border-gray-200 text-gray-700 hover:text-gray-900"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState message="No photos in this category yet." />
      ) : (
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setLightboxPhoto(p)}
              className="block w-full break-inside-avoid group relative overflow-hidden"
            >
              <img
                src={getImageUrl(p.thumbnailUrl || p.imageUrl)}
                alt={p.title}
                loading="lazy"
                decoding="async"
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/30 transition-colors" />
            </button>
          ))}
        </div>
      )}

      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-[60] bg-white/95 flex items-center justify-center p-6"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            className="absolute top-6 right-6 text-gray-900"
            onClick={() => setLightboxPhoto(null)}
            aria-label="Close preview"
          >
            <X size={28} />
          </button>
          <img
            src={getImageUrl(lightboxPhoto.previewUrl || lightboxPhoto.thumbnailUrl || lightboxPhoto.imageUrl)}
            alt={lightboxPhoto.title}
            className="max-h-[85vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
