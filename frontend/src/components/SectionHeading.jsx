export default function SectionHeading({ frame, title, subtitle, light }) {
  return (
    <div className="mb-12 max-w-2xl">
      {frame && <p className="frame-number text-xs" data-frame={frame} />}
      <h2 className={`font-display text-3xl md:text-4xl ${light ? "text-ink" : "text-gray-900"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm leading-relaxed ${light ? "text-ink/70" : "text-gray-700"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
