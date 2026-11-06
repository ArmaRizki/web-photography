import homePhotos from "../assets/home-photos.jpeg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicApi } from "../services/publicApi";
import SectionHeading from "../components/SectionHeading";
import LoadingState from "../components/LoadingState";
import { getImageUrl } from "../utils/imageUrl";

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      publicApi.getPhotos({ featured: true }),
      publicApi.getAbout(),
    ])
      .then(([photosRes, aboutRes]) => {
        setPhotos(photosRes.data.slice(0, 6));
        setAbout(aboutRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
 {/* Hero */}
<section className="relative h-screen min-h-[640px] flex items-end overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/50" />

  <div
  className="absolute inset-0 bg-cover bg-center scale-105"
  style={{
    backgroundImage: `url("${homePhotos}")`,
  }}
  />

  <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
    <p
      className="frame-number text-xs text-white"
      data-frame="ELVOVE PHOTOGRAPHY"
    />

    <h1
      className="font-['IM_Fell_English'] text-5xl md:text-7xl leading-[1.05] text-white max-w-3xl"
    >
      Beyond moments, into{" "}
      <span className="italic text-[#E11D48]">memories.</span>
    </h1>

    <p className="mt-6 text-white max-w-md text-base">
      Photography that preserves the atmosphere, emotion, and details of every
      moment.
    </p>

    <div className="mt-8 flex flex-wrap gap-4">
      <Link
        to="/portfolio"
        className="bg-[#E11D48] text-white px-7 py-3 text-sm tracking-wide hover:bg-[#BE123C] transition-colors"
      >
        View Portfolio
      </Link>

      <Link
        to="/booking"
        className="border border-white text-white px-7 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition-colors"
      >
        Book Now
      </Link>
    </div>
  </div>
</section>


      {/* Featured work — masonry-style */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <SectionHeading title="Selected work" subtitle="A glimpse from recent sessions." />
        {loading ? (
          <LoadingState />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px]">
            {photos.map((p, i) => (
              <div
                key={p.id}
                className={`overflow-hidden group relative ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <img
                  src={getImageUrl(p.thumbnailUrl || p.imageUrl)}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/40 transition-colors flex items-end p-4 opacity-0 group-hover:opacity-100">
                  <p className="text-gray-900 text-sm">{p.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <Link to="/portfolio" className="text-[#E11D48] text-sm border-b border-[#E11D48] pb-1">
            See full portfolio
          </Link>
        </div>
      </section>

      

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-4">
          Have a date in mind?
        </h2>
        <p className="text-gray-700 mb-8">Let's talk about your story and how we'll tell it.</p>
        <Link to="/booking" className="bg-[#E11D48] text-ink px-8 py-3 text-sm tracking-wide inline-block hover:bg-[#BE123C] transition-colors">
          Start Your Booking
        </Link>
      </section>
    </div>
  );
}
