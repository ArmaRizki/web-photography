import AdminResourceManager from "../../components/AdminResourceManager";
import { adminApi } from "../../services/adminApi";

export default function Categories() {
  return (
    <AdminResourceManager
      title="Categories"
      columns={[{ key: "name", label: "Name" }, { key: "slug", label: "Slug" }]}
      fields={[{ name: "name", label: "Name", type: "text", required: true }]}
      emptyDefaults={{ name: "" }}
      api={{
        list: adminApi.getCategories,
        create: adminApi.createCategory,
        update: adminApi.updateCategory,
        delete: adminApi.deleteCategory,
      }}
    />
  );
}
