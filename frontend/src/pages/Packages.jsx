
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { publicApi } from "../services/publicApi";
import SectionHeading from "../components/SectionHeading";
import LoadingState from "../components/LoadingState";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getPackages()
      .then((res) => setPackages(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      <SectionHeading
        title="Packages"
        subtitle="Transparent pricing, no surprises."
      />

      {loading ? (
        <LoadingState />
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-8 border flex flex-col ${
                pkg.highlighted
                  ? "border-[#E11D48] bg-white relative"
                  : "border-gray-200"
              }`}
            >
              {pkg.highlighted && (
                <span className="absolute -top-3 left-8 bg-[#E11D48] text-ink text-xs px-3 py-1 tracking-widest">
                  MOST BOOKED
                </span>
              )}

              <h3 className="font-display text-2xl text-gray-900 mb-1">
                {pkg.title}
              </h3>

              <p className="font-display text-3xl text-[#E11D48] mb-6">
                Rp{Number(pkg.price).toLocaleString("id-ID")}
              </p>

              <ul className="space-y-3 flex-1 mb-8">
                {pkg.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <Check
                      size={16}
                      className="text-[#E11D48] mt-0.5 shrink-0"
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={`/booking?packageId=${pkg.id}`}
                className={`text-center py-3 text-sm tracking-wide transition-colors ${
                  pkg.highlighted
                    ? "bg-[#E11D48] text-ink hover:bg-[#BE123C]"
                    : "border border-gray-400 text-gray-900 hover:border-ivory"
                }`}
              >
                Choose {pkg.title}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

