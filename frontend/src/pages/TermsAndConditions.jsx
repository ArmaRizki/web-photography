
import { useEffect, useState } from "react";
import { publicApi } from "../services/publicApi";
import SectionHeading from "../components/SectionHeading";

export default function TermsAndConditions() {
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    publicApi
      .getTerms()
      .then((res) => {
        setTerms(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderContent = (content) => {
    if (!content) return null;

    const lines = content.split(/\r?\n/);
    const elements = [];
    let listItems = [];
    let key = 0;

    const flushList = () => {
      if (listItems.length === 0) return;

      elements.push(
        <ul
          key={`list-${key++}`}
          className="list-disc space-y-2 pl-7 text-sm leading-7 text-gray-600 mb-8"
        >
          {listItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );

      listItems = [];
    };

    lines.forEach((rawLine) => {
      const line = rawLine.trim();

      if (!line) {
        flushList();
        return;
      }

      if (line.startsWith("# ")) {
        flushList();

        elements.push(
          <h3
            key={`heading-${key++}`}
            className="mb-4 mt-10 font-display text-xl font-semibold text-gray-900"
          >
            {line.replace(/^#\s+/, "")}
          </h3>
        );

        return;
      }

      if (line.startsWith("- ") || line.startsWith("* ")) {
        listItems.push(line.replace(/^[-*]\s+/, ""));
        return;
      }

      flushList();

      elements.push(
        <p
          key={`paragraph-${key++}`}
          className="mb-4 text-sm leading-7 text-gray-600"
        >
          {line}
        </p>
      );
    });

    flushList();

    return elements;
  };

  return (
    <main className="pt-32 pb-24 max-w-3xl mx-auto px-6">
      {loading ? null : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 underline"
          >
            Coba lagi
          </button>
        </div>
      ) : terms ? (
        <>
          <div className="[&>div]:mb-4">
            <SectionHeading title={terms.title} />
          </div>

          {terms.introduction && (
            <p className="mb-12 text-base leading-8 text-gray-600">
              {terms.introduction}
            </p>
          )}

          <div>
            {renderContent(terms.content)}
          </div>
        </>
      ) : null}
    </main>
  );
}
