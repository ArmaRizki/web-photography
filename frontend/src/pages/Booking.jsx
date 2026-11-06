import { useEffect, useState } from "react";
import { publicApi } from "../services/publicApi";
import SectionHeading from "../components/SectionHeading";
import { Link } from "react-router-dom";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  eventDate: "",
  eventTime: "",
  packageId: "",
  eventLocation: "",
  budget: "",
  message: "",
};

const formatPrice = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export default function Booking() {
  const [form, setForm] = useState(initialForm);
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packagesError, setPackagesError] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [terms, setTerms] = useState(null);
  const [termsLoading, setTermsLoading] = useState(true);
  const [termsError, setTermsError] = useState(false);
  const [submitError, setSubmitError] = useState("");
  

useEffect(() => {
  const loadPackages = async () => {
    try {
      const res = await publicApi.getPackages();

      setPackages(res.data);

      const params = new URLSearchParams(window.location.search);
      const packageId = params.get("packageId");

      if (
        packageId &&
        res.data.some((item) => String(item.id) === packageId)
      ) {
        setForm((prev) => ({
          ...prev,
          packageId,
        }));
      }
    } catch {
      setPackagesError(true);
    } finally {
      setPackagesLoading(false);
    }
  };

  loadPackages();
}, []);

useEffect(() => {
  let active = true;

  const loadTerms = async () => {
    try {
      const res = await publicApi.getTerms();
      if (active) setTerms(res.data);
    } catch {
      if (active) setTermsError(true);
    } finally {
      if (active) setTermsLoading(false);
    }
  };

  loadTerms();

  return () => {
    active = false;
  };
}, []);

  const selectedPackage = packages.find(
    (item) => String(item.id) === form.packageId
  );

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Please enter your name";

    if (!form.email.trim()) {
      e.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address";
    }

    if (!form.phone.trim()) {
      e.phone = "Please enter your phone number";
    } else if (!/^[0-9+\-\s]{7,15}$/.test(form.phone)) {
      e.phone = "Enter a valid phone number";
    }

    if (!form.eventType.trim()) e.eventType = "Please select an event type";
    if (!form.eventDate) e.eventDate = "Please choose an event date";
    if (!form.eventTime) e.eventTime = "Please choose an event time";
    if (!form.packageId) e.packageId = "Please select a package";
    if (termsLoading) {
      e.termsAccepted = "Terms & Conditions are still loading.";
    } else if (termsError || !terms) {
      e.termsAccepted = "Terms & Conditions could not be loaded. Please refresh the page.";
    } else if (!termsAccepted) {
      e.termsAccepted = "You must accept the Terms & Conditions";
    }

    return e;
  };

  const handleChange = (field) => (ev) => {
    const value = ev.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    setSubmitError("");

    try {
      await publicApi.createBooking({
        ...form,
        packageId: Number(form.packageId),
        termsAccepted,
        termsVersion: terms.version,
      });

      setStatus("success");
      setForm(initialForm);
      setTermsAccepted(false);
    } catch (error) {
      if (error.response?.status === 409) {
        try {
          const latestTerms = await publicApi.getTerms();
          setTerms(latestTerms.data);
          setTermsAccepted(false);
          setSubmitError(
            "Terms & Conditions have been updated. Please review and accept the latest version before submitting again."
          );
        } catch {
          setSubmitError(
            "Unable to load the latest Terms & Conditions. Please refresh the page."
          );
        }
      } else {
        setSubmitError(
          error.response?.data?.message ||
          "Something went wrong sending your inquiry. Please try again."
        );
      }

      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-transparent border border-gray-200 focus:border-[#E11D48] outline-none px-4 py-3 text-gray-900 placeholder:text-gray-700/60 transition-colors";

  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-6">
      <SectionHeading
        title="Book a Photography Session"
        subtitle="Tell us about the moments you would like ELVOVE to capture."
      />

      {status === "success" ? (
        <div className="border border-[#E11D48] p-8 text-center">
          <p className="font-display text-2xl text-gray-900 mb-2">
            Thank you!
          </p>
          <p className="text-gray-700 text-sm">
            Your inquiry has been received. ELVOVE will contact you to discuss
            the details.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <input
                placeholder="Full name"
                value={form.name}
                onChange={handleChange("name")}
                className={inputClass}
              />
              {errors.name && (
                <p className="text-burgundy text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange("email")}
                className={inputClass}
              />
              {errors.email && (
                <p className="text-burgundy text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <input
                placeholder="Phone number"
                value={form.phone}
                onChange={handleChange("phone")}
                className={inputClass}
              />
              {errors.phone && (
                <p className="text-burgundy text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <select
                value={form.eventType}
                onChange={handleChange("eventType")}
                className={inputClass}
              >
                <option value="">Select graduation session</option>
                <option value="Pre Graduation">Pre Graduation</option>
                <option value="D-Day Graduation">D-Day Graduation</option>
                <option value="Post Graduation">Post Graduation</option>
                <option value="Other">Other</option>
              </select>
              {errors.eventType && (
                <p className="text-burgundy text-xs mt-1">
                  {errors.eventType}
                </p>
              )}
            </div>
          </div>

          {/* Package selection */}
          <div>

            <select
              value={form.packageId}
              onChange={handleChange("packageId")}
              className={inputClass}
              disabled={packagesLoading || packagesError || packages.length === 0}
            >
              <option value="">
                {packagesLoading
                  ? "Loading packages..."
                  : packagesError
                    ? "Unable to load packages"
                    : packages.length === 0
                      ? "No packages available"
                      : "Select a photography package"}
              </option>

              {packages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} — {formatPrice(item.price)}
                </option>
              ))}
            </select>

            {errors.packageId && (
              <p className="text-burgundy text-xs mt-1">
                {errors.packageId}
              </p>
            )}

            {selectedPackage && (
              <div className="border border-gray-200 p-4 mt-3">
                <p className="text-gray-900 font-medium">
                  {selectedPackage.title}
                </p>
                <p className="text-[#E11D48] text-sm mt-1">
                  {formatPrice(selectedPackage.price)}
                </p>

                {selectedPackage.features?.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {selectedPackage.features.map((feature, index) => (
                      <li
                        key={index}
                        className="text-gray-700 text-sm"
                      >
                        • {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Date and Time */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <input
                  type="date"
                  min={new Date().toLocaleDateString("en-CA")}
                  value={form.eventDate}
                  onChange={handleChange("eventDate")}
                  className={inputClass}
                />
                {errors.eventDate && (
                  <p className="text-burgundy text-xs mt-1">
                    {errors.eventDate}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="time"
                  value={form.eventTime}
                  onChange={handleChange("eventTime")}
                  className={inputClass}
                />
                {errors.eventTime && (
                  <p className="text-burgundy text-xs mt-1">
                    {errors.eventTime}
                  </p>
                )}
              </div>
            </div>

            {/* Graduation Location - Full Width */}
            <input
              placeholder="Event location"
              value={form.eventLocation}
              onChange={handleChange("eventLocation")}
              className={inputClass}
            />


          </div>


          <textarea
            placeholder="Tell me more about your graduation..."
            rows={5}
            value={form.message}
            onChange={handleChange("message")}
            className={inputClass}
          />

          {status === "error" && (
            <p className="text-burgundy text-sm">
              {submitError || "Something went wrong sending your inquiry. Please try again."}
            </p>
          )}

                      {/* Terms & Conditions */}
            <div className="border border-gray-200 p-5 space-y-4">
              <div>
                <p className="text-gray-900 text-sm font-medium">
                  Terms & Conditions
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Please review our booking policies before submitting your inquiry.
                </p>

                {termsLoading && (
                  <p className="text-gray-500 text-xs mt-2">
                    Loading Terms & Conditions...
                  </p>
                )}
                {termsError && (
                  <p className="text-burgundy text-xs mt-2">
                    Unable to load Terms & Conditions. Please refresh the page.
                  </p>
                )}
              </div>

              <Link
                to="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#E11D48] hover:underline"
              >
                Read Terms & Conditions
                <span aria-hidden="true">↗</span>
              </Link>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);

                    if (e.target.checked) {
                      setErrors((prev) => ({
                        ...prev,
                        termsAccepted: undefined,
                      }));
                    }
                  }}
                  disabled={termsLoading || termsError || !terms}
                  className="mt-1 accent-[#E11D48]"
                />

                <span className="text-sm text-gray-600 leading-relaxed">
                  I have read and agree to the Terms & Conditions of
                  ELVOVE Photography Services.
                </span>
              </label>

              {errors.termsAccepted && (
                <p className="text-burgundy text-xs">
                  {errors.termsAccepted}
                </p>
              )}
            </div>

          <button
            type="submit"
            disabled={
              status === "submitting" ||
              packagesLoading ||
              packagesError ||
              packages.length === 0 ||
              !termsAccepted ||
              termsLoading ||
              termsError ||
              !terms
            }
            className="bg-[#E11D48] text-ink px-8 py-3 text-sm tracking-wide hover:bg-[#BE123C] transition-colors disabled:opacity-50"
          >
            {status === "submitting" ? "Sending..." : "Send Inquiry"}
          </button>
        </form>
      )}
    </div>
  );
}