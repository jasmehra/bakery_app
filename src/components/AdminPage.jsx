import { useEffect, useMemo, useState } from "react";
import { fetchAdminContent, updateAdminContent } from "../apiClient";

const settingsFields = [
  { key: "brandName", label: "Brand Name" },
  { key: "navMenu", label: "Nav Menu Label" },
  { key: "navOrder", label: "Nav Order Label" },
  { key: "navGallery", label: "Nav Gallery Label" },
  { key: "navStory", label: "Nav Story Label" },
  { key: "navContact", label: "Nav Contact Label" },
  { key: "heroEyebrow", label: "Hero Eyebrow" },
  { key: "heroTitle", label: "Hero Title" },
  { key: "heroSubtitle", label: "Hero Subtitle" },
  { key: "heroPrimaryCta", label: "Hero Primary Button" },
  { key: "heroSecondaryCta", label: "Hero Secondary Button" },
  { key: "featuredEyebrow", label: "Featured Eyebrow" },
  { key: "featuredTitle", label: "Featured Title" },
  { key: "orderEyebrow", label: "Order Eyebrow" },
  { key: "orderTitle", label: "Order Title" },
  { key: "storyEyebrow", label: "Story Eyebrow" },
  { key: "storyTitle", label: "Story Title" },
  { key: "storyBodyOne", label: "Story Paragraph One" },
  { key: "storyBodyTwo", label: "Story Paragraph Two" },
  { key: "galleryEyebrow", label: "Gallery Eyebrow" },
  { key: "galleryTitle", label: "Gallery Title" },
  { key: "testimonialsEyebrow", label: "Testimonials Eyebrow" },
  { key: "testimonialsTitle", label: "Testimonials Title" },
  { key: "contactEyebrow", label: "Contact Eyebrow" },
  { key: "contactTitle", label: "Contact Title" },
  { key: "mapTitle", label: "Map Card Title" },
  { key: "mapAddress", label: "Map Address" },
  { key: "mapHours", label: "Map Hours" },
  { key: "mapEmail", label: "Map Email" }
];

export default function AdminPage() {
  const [data, setData] = useState({
    featuredItems: [],
    orderItems: [],
    galleryImages: [],
    testimonials: [],
    siteSettings: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const content = await fetchAdminContent();
        if (!ignore) {
          setData(content);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Failed to load admin data.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const featuredItems = useMemo(() => data.featuredItems ?? [], [data.featuredItems]);
  const orderItems = useMemo(() => data.orderItems ?? [], [data.orderItems]);
  const galleryImages = useMemo(() => data.galleryImages ?? [], [data.galleryImages]);
  const testimonials = useMemo(() => data.testimonials ?? [], [data.testimonials]);
  const siteSettings = useMemo(() => data.siteSettings ?? {}, [data.siteSettings]);

  const setCollection = (key, next) => {
    setData((prev) => ({ ...prev, [key]: next }));
    setSaveState("");
  };

  const updateRow = (collectionKey, index, field, value) => {
    const next = [...(data[collectionKey] ?? [])];
    next[index] = { ...next[index], [field]: value };
    setCollection(collectionKey, next);
  };

  const removeRow = (collectionKey, index) => {
    setCollection(
      collectionKey,
      (data[collectionKey] ?? []).filter((_, rowIndex) => rowIndex !== index)
    );
  };

  const addRow = (collectionKey) => {
    const templates = {
      featuredItems: { id: `featured-${Date.now()}`, title: "", price: 0, image: "" },
      orderItems: {
        id: `order-${Date.now()}`,
        title: "",
        note: "",
        price: 0,
        image: ""
      },
      galleryImages: { src: "", alt: "" },
      testimonials: { name: "", text: "" }
    };
    setCollection(collectionKey, [...(data[collectionKey] ?? []), templates[collectionKey]]);
  };

  const updateSetting = (key, value) => {
    setData((prev) => ({
      ...prev,
      siteSettings: { ...(prev.siteSettings ?? {}), [key]: value }
    }));
    setSaveState("");
  };

  const handleSave = async () => {
    try {
      setSaveState("saving");
      setError("");
      await updateAdminContent(data);
      setSaveState("saved");
    } catch (err) {
      setSaveState("error");
      setError(err.message || "Failed to save admin content.");
    }
  };

  if (loading) {
    return <div className="site-shell status-text">Loading admin panel...</div>;
  }

  return (
    <div className="site-shell admin-shell">
      <section className="section">
        <div className="admin-head">
          <div>
            <p className="eyebrow">Admin</p>
            <h2>Website Content Control Panel</h2>
            <p>Update all visible website text and content from here.</p>
          </div>
          <div className="admin-actions">
            <a className="ghost-link" href="/">
              View Website
            </a>
            <button onClick={handleSave}>Save All Changes</button>
          </div>
        </div>
        {saveState === "saving" && <p className="muted">Saving changes...</p>}
        {saveState === "saved" && <p className="success-text">Changes saved successfully.</p>}
        {error && <p className="error-text">{error}</p>}
      </section>

      <section className="section">
        <p className="eyebrow">Text Content</p>
        <h2>Website copy</h2>
        <div className="admin-settings-grid">
          {settingsFields.map((field) => (
            <label key={field.key} className="admin-field">
              <span>{field.label}</span>
              {field.key.toLowerCase().includes("title") || field.key.toLowerCase().includes("body") ? (
                <textarea
                  rows="3"
                  value={siteSettings[field.key] ?? ""}
                  onChange={(event) => updateSetting(field.key, event.target.value)}
                />
              ) : (
                <input
                  value={siteSettings[field.key] ?? ""}
                  onChange={(event) => updateSetting(field.key, event.target.value)}
                />
              )}
            </label>
          ))}
        </div>
      </section>

      <CrudSection
        title="Featured Items"
        collectionKey="featuredItems"
        rows={featuredItems}
        columns={[
          { key: "id", label: "ID" },
          { key: "title", label: "Title" },
          { key: "price", label: "Price", type: "number" },
          { key: "image", label: "Image URL" }
        ]}
        onUpdateRow={updateRow}
        onRemoveRow={removeRow}
        onAddRow={addRow}
      />

      <CrudSection
        title="Order Items"
        collectionKey="orderItems"
        rows={orderItems}
        columns={[
          { key: "id", label: "ID" },
          { key: "title", label: "Title" },
          { key: "note", label: "Note" },
          { key: "price", label: "Price", type: "number" },
          { key: "image", label: "Image URL" }
        ]}
        onUpdateRow={updateRow}
        onRemoveRow={removeRow}
        onAddRow={addRow}
      />

      <CrudSection
        title="Gallery Images"
        collectionKey="galleryImages"
        rows={galleryImages}
        columns={[
          { key: "src", label: "Image URL" },
          { key: "alt", label: "Alt text" }
        ]}
        onUpdateRow={updateRow}
        onRemoveRow={removeRow}
        onAddRow={addRow}
      />

      <CrudSection
        title="Testimonials"
        collectionKey="testimonials"
        rows={testimonials}
        columns={[
          { key: "name", label: "Name" },
          { key: "text", label: "Text" }
        ]}
        onUpdateRow={updateRow}
        onRemoveRow={removeRow}
        onAddRow={addRow}
      />
    </div>
  );
}

function CrudSection({
  title,
  collectionKey,
  rows,
  columns,
  onUpdateRow,
  onRemoveRow,
  onAddRow
}) {
  return (
    <section className="section">
      <div className="admin-list-head">
        <h2>{title}</h2>
        <button type="button" onClick={() => onAddRow(collectionKey)}>
          Add Row
        </button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${collectionKey}-${index}`}>
                {columns.map((column) => (
                  <td key={column.key}>
                    <input
                      type={column.type || "text"}
                      value={row[column.key] ?? ""}
                      onChange={(event) =>
                        onUpdateRow(collectionKey, index, column.key, event.target.value)
                      }
                    />
                  </td>
                ))}
                <td>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => onRemoveRow(collectionKey, index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
