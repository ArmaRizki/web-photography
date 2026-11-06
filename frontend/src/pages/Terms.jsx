import SectionHeading from "../components/SectionHeading";

export default function Terms() {
  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-6">
      <SectionHeading title="Terms of Service" />
      <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
        <p>
          Booking a session requires an advance payment to confirm your date,
          as agreed at the time of booking. Full payment terms will be shared
          before your event.
        </p>
        <p>
          Edited photos and videos are delivered within the timeframe stated
          in your package. Rush delivery may be available for an additional fee.
        </p>
        <p>
          Cancellations made within 7 days of the event date may not be
          eligible for a refund of the advance payment.
        </p>
      </div>
    </div>
  );
}
