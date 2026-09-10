"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
  Plus,
  FolderTree,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  Package,
  ArrowRight,
} from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/services/categories";
import { getProducts } from "@/lib/services/products";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Category } from "@/data/categories";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formId, setFormId] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formCta, setFormCta] = useState("Shop Now →");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catData, prodData] = await Promise.all([
        getCategories(),
        getProducts(),
      ]);
      setCategories(catData);

      // Count products per category
      const counts: Record<string, number> = {};
      prodData.forEach((p) => {
        const catKey = p.category.toLowerCase();
        counts[catKey] = (counts[catKey] || 0) + 1;
      });
      setProductCounts(counts);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingCategoryId(null);
    setFormTitle("");
    setFormId("");
    setFormDescription("");
    setFormImage("/images/home-kitchen.jpg");
    setFormCta("Shop Now →");
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setModalMode("edit");
    setEditingCategoryId(category.id);
    setFormTitle(category.title);
    setFormId(category.id);
    setFormDescription(category.description || "");
    setFormImage(category.image || "/images/home-kitchen.jpg");
    setFormCta(category.cta || "Shop Now →");
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (modalMode === "create") {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setFormId(slug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formTitle.trim()) {
      setFormError("Category title is required.");
      return;
    }

    if (!formId.trim()) {
      setFormError("Category ID / slug is required.");
      return;
    }

    startTransition(async () => {
      if (modalMode === "create") {
        const catSlug = formId.trim();
        const catHref = `/category/${catSlug}`;

        if (isSupabaseConfigured()) {
          const { error } = await createCategory({
            id: catSlug,
            title: formTitle.trim(),
            description: formDescription.trim(),
            image: formImage.trim() || "/images/home-kitchen.jpg",
            cta: formCta.trim() || "Shop Now →",
            href: catHref,
          });
          if (error) {
            setFormError(`Database error: ${error}`);
            return;
          }
        }

        const newCat: Category = {
          id: catSlug,
          title: formTitle.trim(),
          description: formDescription.trim(),
          image: formImage.trim() || "/images/home-kitchen.jpg",
          cta: formCta.trim() || "Shop Now →",
          href: catHref,
        };

        setCategories((prev) => [...prev, newCat]);
        setFormSuccess("Category created successfully!");
        setTimeout(() => setIsModalOpen(false), 800);
      } else if (modalMode === "edit" && editingCategoryId) {
        const catHref = `/category/${editingCategoryId}`;

        if (isSupabaseConfigured()) {
          const { error } = await updateCategory(editingCategoryId, {
            title: formTitle.trim(),
            description: formDescription.trim(),
            image: formImage.trim(),
            cta: formCta.trim(),
            href: catHref,
          });
          if (error) {
            setFormError(`Update error: ${error}`);
            return;
          }
        }

        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategoryId
              ? {
                  ...c,
                  title: formTitle.trim(),
                  description: formDescription.trim(),
                  image: formImage.trim(),
                  cta: formCta.trim(),
                }
              : c
          )
        );

        setFormSuccess("Category updated successfully!");
        setTimeout(() => setIsModalOpen(false), 800);
      }
    });
  };

  const handleDeleteCategory = async (id: string) => {
    if (isSupabaseConfigured()) {
      const { error } = await deleteCategory(id);
      if (error) {
        alert(`Failed to delete category: ${error}`);
        return;
      }
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>Categories</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-[#16375B] font-bold">
              {categories.length}
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Organize products into store departments and shop sections.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#16375B] hover:bg-[#0F243E] rounded-xl shadow-xs transition-all transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-sm text-gray-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-12 text-center text-sm text-gray-500">
            No categories found. Create your first category above!
          </div>
        ) : (
          categories.map((category) => {
            const count =
              productCounts[category.title.toLowerCase()] ||
              productCounts[category.id.toLowerCase()] ||
              0;

            return (
              <div
                key={category.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 relative overflow-hidden shrink-0 border border-gray-200/60">
                      <Image
                        src={category.image || "/images/home-kitchen.jpg"}
                        alt={category.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(category)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#16375B] hover:bg-gray-100 transition-colors"
                        title="Edit category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(category.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-bold text-base text-gray-900">
                      {category.title}
                    </h3>
                    <code className="text-[11px] text-gray-400 font-mono">
                      id: {category.id}
                    </code>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                      {category.description || "No description provided."}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-gray-400" />
                    <span>{count} Products</span>
                  </span>
                  <span className="font-semibold text-[#F26E22] flex items-center gap-1">
                    <span>{category.cta || "Shop Now →"}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === "create" ? "Add Category" : "Edit Category"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Category Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sports & Outdoors"
                  value={formTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#16375B]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Category Slug / Identifier *
                </label>
                <input
                  type="text"
                  required
                  disabled={modalMode === "edit"}
                  placeholder="e.g. sports-outdoors"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value.toLowerCase())}
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl font-mono disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of items in this category"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  placeholder="/images/sports-outdoors.jpg"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Call to Action (CTA Text)
                </label>
                <input
                  type="text"
                  placeholder="Shop Now →"
                  value={formCta}
                  onChange={(e) => setFormCta(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#16375B] hover:bg-[#0F243E] rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPending
                    ? "Saving..."
                    : modalMode === "create"
                    ? "Create Category"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900">
              Delete category?
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Products in this category will become unassigned.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCategory(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
