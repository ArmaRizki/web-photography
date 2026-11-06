import SectionHeading from "../components/SectionHeading";

export default function Privacy() {
  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-6">
      <SectionHeading title="Privacy Policy" />
      <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
        <p>
          We collect only the information you submit through our booking form —
          your name, email, phone number, and event details — to respond to your
          inquiry and plan your session.
        </p>
        <p>
          We never sell or share your information with third parties. Your data
          is stored securely and used solely for communicating with you about
          your booking.
        </p>
        <p>
          You may request that we delete your information at any time by
          contacting us directly.
        </p>
      </div>
    </div>
  );
}
