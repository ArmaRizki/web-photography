import AdminResourceManager from "../../components/AdminResourceManager";
import { adminApi } from "../../services/adminApi";

export default function Videos() {
  return (
    <AdminResourceManager
      title="Videos"
      columns={[{ key: "title", label: "Title" }]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "videoUrl", label: "Video embed URL (e.g. YouTube embed link)", type: "text", required: true },
        { name: "thumbnailUrl", label: "Thumbnail", type: "image" },
        { name: "displayOrder", label: "Display order", type: "number" },
      ]}
      emptyDefaults={{ title: "", videoUrl: "", thumbnailUrl: "", displayOrder: 0 }}
      api={{
        list: adminApi.getVideos,
        create: adminApi.createVideo,
        update: adminApi.updateVideo,
        delete: adminApi.deleteVideo,
      }}
    />
  );
}
