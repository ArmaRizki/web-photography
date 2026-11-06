import { useEffect, useState } from "react";
import { publicApi } from "../services/publicApi";
import SectionHeading from "../components/SectionHeading";
import LoadingState from "../components/LoadingState";
import { PlayCircle } from "lucide-react";
import { getImageUrl } from "../utils/imageUrl";

export default function VideoGallery() {
  const [videos, setVideos] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getVideos().then((res) => setVideos(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      <SectionHeading frame="FRAME 050" title="Films" subtitle="Cinematic highlights from real celebrations." />

      {loading ? (
        <LoadingState />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <button
              key={v.id}
              onClick={() => setActive(v)}
              className="relative aspect-video overflow-hidden group text-left"
            >
              <img src={getImageUrl(v.thumbnailUrl)} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                <PlayCircle size={44} className="text-gray-900" />
              </div>
              <p className="absolute bottom-3 left-3 text-gray-900 text-sm">{v.title}</p>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div className="fixed inset-0 z-[60] bg-white/95 flex items-center justify-center p-6" onClick={() => setActive(null)}>
          <div className="w-full max-w-3xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe
              className="w-full h-full"
              src={active.videoUrl}
              title={active.title}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
