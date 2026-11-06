import AdminResourceManager from "../../components/AdminResourceManager";
import { adminApi } from "../../services/adminApi";

export default function Faqs() {
  return (
    <AdminResourceManager
      title="FAQs"
      columns={[{ key: "question", label: "Question" }]}
      fields={[
        { name: "question", label: "Question", type: "text", required: true },
        { name: "answer", label: "Answer", type: "textarea", required: true },
        { name: "displayOrder", label: "Display order", type: "number" },
      ]}
      emptyDefaults={{ question: "", answer: "", displayOrder: 0 }}
      api={{
        list: adminApi.getFaqs,
        create: adminApi.createFaq,
        update: adminApi.updateFaq,
        delete: adminApi.deleteFaq,
      }}
    />
  );
}
