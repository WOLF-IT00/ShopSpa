import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiEdit2,
  FiEye,
  FiPackage,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { adminAPI, categoryAPI, resolveUploadUrl } from "../../services/api";
import {
  ConfirmDialog,
  EmptyState,
  Pagination,
  TableSkeleton,
  formatCurrency,
  slugify,
} from "./shared";

const EMPTY_FORM = {
  name: "",
  slug: "",
  price: "",
  category: "",
  duration: "",
  imageUrl: "",
  description: "",
  gallery: [],
  benefits: [],
  healthInfo: "",
  steps: [{ title: "", description: "" }],
};

function ServiceFormModal({ open, mode, initial, categories, onClose, onSave, onToast }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryInput, setGalleryInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        name: initial.name ?? "",
        slug: initial.slug ?? "",
        price: String(initial.price ?? ""),
        category: initial.category ?? "",
        duration: initial.duration ?? "",
        imageUrl: initial.imageUrl ?? "",
        description: initial.description ?? "",
        gallery: initial.gallery ?? [],
        benefits: initial.benefits ?? [],
        healthInfo: initial.healthInfo ?? "",
        steps: initial.steps?.length
          ? initial.steps
          : [{ title: "", description: "" }],
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, initial]);

  const handleNameChange = (name) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: mode === "create" ? slugify(name) : prev.slug,
    }));
  };

  const handleUpload = async (file, target) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminAPI.uploadServiceImage(file);
      const url = resolveUploadUrl(res.data.url);
      if (target === "imageUrl") {
        setForm((prev) => ({ ...prev, imageUrl: url }));
      } else {
        setForm((prev) => ({ ...prev, gallery: [...prev.gallery, url] }));
      }
      onToast("Đã tải ảnh lên", "success");
    } catch {
      onToast("Không thể tải ảnh", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUploadMultiple = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        const res = await adminAPI.uploadServiceImage(file);
        urls.push(resolveUploadUrl(res.data.url));
      }
      setForm((prev) => ({ ...prev, gallery: [...prev.gallery, ...urls] }));
      onToast(`Đã tải ${urls.length} ảnh gallery`, "success");
    } catch {
      onToast("Không thể tải ảnh gallery", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || Number(form.price) <= 0 || !form.category.trim()) {
      onToast("Vui lòng điền đầy đủ thông tin bắt buộc (tên, giá, danh mục)", "error");
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      price: Number(form.price),
      category: form.category.trim(),
      duration: form.duration.trim() || "60 phút",
      imageUrl: form.imageUrl.trim(),
      description: form.description.trim(),
      gallery: form.gallery,
      benefits: form.benefits,
      healthInfo: form.healthInfo.trim(),
      steps: form.steps.filter((s) => s.title.trim()),
    };

    setSaving(true);
    try {
      await onSave(payload);
      onClose();
    } catch {
      onToast("Không thể lưu dịch vụ", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {mode === "create" ? "Thêm dịch vụ" : "Chỉnh sửa dịch vụ"}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[75vh] space-y-5 overflow-y-auto p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tên dịch vụ *
              </label>
              <input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Slug
              </label>
              <input
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Giá (VNĐ) *
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Danh mục *
              </label>
              <input
                list="category-list"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <datalist id="category-list">
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name} />
                ))}
              </datalist>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Thời lượng
              </label>
              <input
                value={form.duration}
                onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                placeholder="VD: 60 phút"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ảnh đại diện
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {form.imageUrl && (
                <img
                  src={resolveUploadUrl(form.imageUrl)}
                  alt=""
                  className="h-20 w-20 rounded-lg object-cover"
                />
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                <FiUpload />
                {uploading ? "Đang tải..." : "Upload ảnh"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files[0], "imageUrl")}
                />
              </label>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="Hoặc dán URL ảnh"
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gallery
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              {form.gallery.map((url, idx) => (
                <div key={idx} className="relative">
                  <img src={resolveUploadUrl(url)} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        gallery: prev.gallery.filter((_, i) => i !== idx),
                      }))
                    }
                    className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                placeholder="URL ảnh gallery"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <label className="flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-2 text-sm">
                <FiUpload size={14} />
                <span className="hidden sm:inline">1 ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files[0], "gallery")}
                />
              </label>
              <label className="flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <FiUpload size={14} />
                <span className="hidden sm:inline">Nhiều ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleGalleryUploadMultiple(Array.from(e.target.files ?? []));
                    e.target.value = "";
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  if (!galleryInput.trim()) return;
                  setForm((prev) => ({
                    ...prev,
                    gallery: [...prev.gallery, galleryInput.trim()],
                  }));
                  setGalleryInput("");
                }}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white"
              >
                Thêm
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mô tả
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Lợi ích
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              {form.benefits.map((b, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  {b}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        benefits: prev.benefits.filter((_, i) => i !== idx),
                      }))
                    }
                  >
                    <FiX size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                placeholder="Thêm lợi ích"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!benefitInput.trim()) return;
                    setForm((prev) => ({
                      ...prev,
                      benefits: [...prev.benefits, benefitInput.trim()],
                    }));
                    setBenefitInput("");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (!benefitInput.trim()) return;
                  setForm((prev) => ({
                    ...prev,
                    benefits: [...prev.benefits, benefitInput.trim()],
                  }));
                  setBenefitInput("");
                }}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white"
              >
                Thêm
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Thông tin sức khỏe
            </label>
            <textarea
              rows={2}
              value={form.healthInfo}
              onChange={(e) => setForm((prev) => ({ ...prev, healthInfo: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Các bước thực hiện
              </label>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    steps: [...prev.steps, { title: "", description: "" }],
                  }))
                }
                className="text-xs text-emerald-600 hover:underline"
              >
                + Thêm bước
              </button>
            </div>
            <div className="space-y-3">
              {form.steps.map((step, idx) => (
                <div key={idx} className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
                  <div className="mb-2 flex gap-2">
                    <input
                      value={step.title}
                      onChange={(e) => {
                        const steps = [...form.steps];
                        steps[idx] = { ...steps[idx], title: e.target.value };
                        setForm((prev) => ({ ...prev, steps }));
                      }}
                      placeholder="Tiêu đề bước"
                      className="flex-1 rounded border border-gray-200 px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    {form.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            steps: prev.steps.filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-red-500"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => {
                      const steps = [...form.steps];
                      steps[idx] = { ...steps[idx], description: e.target.value };
                      setForm((prev) => ({ ...prev, steps }));
                    }}
                    placeholder="Mô tả bước"
                    className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : mode === "create" ? "Thêm dịch vụ" : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ServiceDetailModal({ service, onClose }) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{service.name}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>
        <div className="max-h-[75vh] space-y-4 overflow-y-auto p-6">
          {service.imageUrl && (
            <img
              src={resolveUploadUrl(service.imageUrl)}
              alt={service.name}
              className="h-48 w-full rounded-xl object-cover"
            />
          )}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Giá:</span>{" "}
              <span className="font-semibold text-emerald-600">{formatCurrency(service.price)}</span>
            </div>
            <div>
              <span className="text-gray-500">Danh mục:</span> {service.category}
            </div>
            <div>
              <span className="text-gray-500">Thời lượng:</span> {service.duration}
            </div>
            <div>
              <span className="text-gray-500">Slug:</span> {service.slug}
            </div>
          </div>
          <div>
            <h4 className="mb-1 font-medium text-gray-800 dark:text-white">Mô tả</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
          </div>
          {service.benefits?.length > 0 && (
            <div>
              <h4 className="mb-1 font-medium text-gray-800 dark:text-white">Lợi ích</h4>
              <ul className="list-inside list-disc text-sm text-gray-600 dark:text-gray-300">
                {service.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}
          {service.steps?.length > 0 && (
            <div>
              <h4 className="mb-2 font-medium text-gray-800 dark:text-white">Các bước</h4>
              <ol className="space-y-2">
                {service.steps.map((step, i) => (
                  <li key={i} className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
                    <span className="font-medium">{i + 1}. {step.title}</span>
                    <p className="mt-1 text-gray-500">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {service.gallery?.length > 0 && (
            <div>
              <h4 className="mb-2 font-medium text-gray-800 dark:text-white">Gallery</h4>
              <div className="flex flex-wrap gap-2">
                {service.gallery.map((url, i) => (
                  <img
                    key={i}
                    src={resolveUploadUrl(url)}
                    alt=""
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ServicesTab({ onToast }) {
  const [services, setServices] = useState([]);
  const [meta, setMeta] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editTarget, setEditTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const searchTimer = useRef(null);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search]);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (debouncedSearch.trim()) params.q = debouncedSearch.trim();
      if (categoryFilter) params.category = categoryFilter;
      const res = await adminAPI.getServices(params);
      setServices(res.data.items);
      setMeta(res.data.meta);
    } catch {
      onToast("Không thể tải danh sách dịch vụ", "error");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categoryFilter, onToast]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    categoryAPI.getAll().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const handleCreate = async (payload) => {
    await adminAPI.createService(payload);
    onToast("Đã thêm dịch vụ mới", "success");
    loadServices();
  };

  const handleUpdate = async (payload) => {
    await adminAPI.updateService(editTarget.id, payload);
    onToast("Đã cập nhật dịch vụ", "success");
    loadServices();
  };

  const handleDelete = async () => {
    try {
      await adminAPI.deleteService(deleteTarget.id);
      onToast("Đã xóa dịch vụ", "success");
      setDeleteTarget(null);
      loadServices();
    } catch (err) {
      const msg =
        err.response?.status === 409
          ? "Không thể xóa dịch vụ đã có đơn hàng"
          : "Không thể xóa dịch vụ";
      onToast(msg, "error");
    }
  };

  const handleOpenEdit = async (service) => {
    try {
      const res = await adminAPI.getService(service.id);
      setFormMode("edit");
      setEditTarget(res.data);
      setFormOpen(true);
    } catch {
      onToast("Không thể tải dữ liệu dịch vụ", "error");
    }
  };

  const handleViewDetail = async (service) => {
    try {
      const res = await adminAPI.getService(service.id);
      setDetailTarget(res.data);
    } catch {
      onToast("Không thể tải chi tiết", "error");
    }
  };

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Quản lý dịch vụ</h2>
          <p className="text-sm text-gray-500">{meta?.total ?? 0} dịch vụ</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormMode("create");
            setEditTarget(null);
            setFormOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <FiPlus />
          Thêm dịch vụ
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm dịch vụ..."
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : services.length === 0 ? (
        <EmptyState
          icon={FiPackage}
          title="Chưa có dịch vụ"
          description="Thêm dịch vụ spa đầu tiên để bắt đầu."
          action={
            <button
              type="button"
              onClick={() => {
                setFormMode("create");
                setEditTarget(null);
                setFormOpen(true);
              }}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white"
            >
              Thêm dịch vụ
            </button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
              <tr>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Ảnh</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Tên</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Giá</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Danh mục</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Thời lượng</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-t border-gray-50 transition hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-800/30"
                >
                  <td className="p-4">
                    {service.imageUrl ? (
                      <img
                        src={resolveUploadUrl(service.imageUrl)}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                        <FiPackage className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                    {service.name}
                  </td>
                  <td className="p-4 text-emerald-600">{formatCurrency(service.price)}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{service.category}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{service.duration}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(service)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                        title="Xem chi tiết"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(service)}
                        className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        title="Sửa"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(service)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Xóa"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 pb-4">
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        </div>
      )}

      <ServiceFormModal
        open={formOpen}
        mode={formMode}
        initial={editTarget}
        categories={categories}
        onClose={() => setFormOpen(false)}
        onSave={formMode === "create" ? handleCreate : handleUpdate}
        onToast={onToast}
      />

      <ServiceDetailModal service={detailTarget} onClose={() => setDetailTarget(null)} />

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Xóa dịch vụ "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
