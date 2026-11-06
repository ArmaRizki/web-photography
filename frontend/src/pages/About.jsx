import { useEffect, useState } from "react";
import { publicApi } from "../services/publicApi";
import SectionHeading from "../components/SectionHeading";
import LoadingState from "../components/LoadingState";
import { getImageUrl } from "../utils/imageUrl";

export default function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    publicApi.getAbout().then((res) => setAbout(res.data));
  }, []);

  if (!about) return <LoadingState />;

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      <SectionHeading title="About ELVOVE" />

      <div className="grid md:grid-cols-2 gap-14 items-start">
        {about.imageUrl && (
          <img src={getImageUrl(about.imageUrl)} alt="ELVOVE photographer" className="w-full h-[820px] object-cover" />
        )}

        <div className="space-y-8">
          <p className="text-gray-700 leading-relaxed">{about.introduction}</p>

          <div className="grid grid-cols-2 gap-6 border-y border-gray-200 py-6">
            <div>
              <p className="font-display text-3xl text-[#E11D48]">{about.yearsOfExperience}+</p>
              <p className="text-xs text-gray-700 tracking-widest mt-1">YEARS OF EXPERIENCE</p>
            </div>
            <div>
              <p className="font-display text-xl text-[#E11D48]">{about.photographyStyle}</p>
              <p className="text-xs text-gray-700 tracking-widest mt-1">STYLE</p>
            </div>
            <div className="col-span-2">
              <p className="font-display text-xl text-[#E11D48]">{about.location}</p>
              <p className="text-xs text-gray-700 tracking-widest mt-1">BASED IN</p>
            </div>
          </div>

          {about.story && (
            <div>
              <h3 className="font-display text-xl text-gray-900 mb-2">The story</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{about.story}</p>
            </div>
          )}

          {about.achievements && (
            <div>
              <h3 className="font-display text-xl text-gray-900 mb-2">Achievements</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{about.achievements}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
