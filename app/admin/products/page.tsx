"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Upload,
  Check,
  AlertCircle,
  Star,
  ExternalLink,
  Package,
} from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/services/products";
import { getCategories } from "@/lib/services/categories";
import { uploadProductImage } from "@/lib/services/storage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Product } from "@/data/products";
import { Category } from "@/data/categories";

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStock, setSelectedStock] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formOldPrice, setFormOldPrice] = useState("");
  const [formRating, setFormRating] = useState("5.0");
  const [formReviews, setFormReviews] = useState("0");
  const [formBadge, setFormBadge] = useState("");
  const [formInStock, setFormInStock] = useState(true);
  const [formShipping, setFormShipping] = useState("Fast Shipping");
  const [formImage, setFormImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Load products and categories
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(prodData);
      setCategories(catData);
      if (catData.length > 0 && !formCategory) {
        setFormCategory(catData[0].id);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStock =
      selectedStock === "all" ||
      (selectedStock === "in-stock" && product.inStock) ||
      (selectedStock === "out-of-stock" && !product.inStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingProductId(null);
    setFormName("");
    setFormCategory(categories[0]?.id || "electronics");
    setFormPrice("");
    setFormOldPrice("");
    setFormRating("5.0");
    setFormReviews("0");
    setFormBadge("");
    setFormInStock(true);
    setFormShipping("Fast Shipping");
    setFormImage("");
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (product: Product) => {
    setModalMode("edit");
    setEditingProductId(product.id);
    setFormName(product.name);

    // match category ID by title or ID
    const matchedCat = categories.find(
      (c) =>
        c.title.toLowerCase() === product.category.toLowerCase() ||
        c.id.toLowerCase() === product.category.toLowerCase()
    );
    setFormCategory(matchedCat ? matchedCat.id : categories[0]?.id || "electronics");

    setFormPrice(product.price.toString());
    setFormOldPrice(product.oldPrice ? product.oldPrice.toString() : "");
    setFormRating((product.rating || 5.0).toString());
    setFormReviews((product.reviews || 0).toString());
    setFormBadge(product.badge || "");
    setFormInStock(product.inStock);
    setFormShipping(product.shipping || "Fast Shipping");
    setFormImage(product.image || "");
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  // Handle Image File Upload to Supabase
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupabaseConfigured()) {
      // In local demo mode, create an object URL preview
      const previewUrl = URL.createObjectURL(file);
      setFormImage(previewUrl);
      return;
    }

    setUploadingImage(true);
    setFormError("");
    try {
      const { url, error } = await uploadProductImage(file);
      if (error) {
        setFormError(`Image upload failed: ${error}`);
      } else if (url) {
        setFormImage(url);
      }
    } catch (err: any) {
      setFormError(`Upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle Form Submit (Save Product)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formName.trim()) {
      setFormError("Product name is required.");
      return;
    }

    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setFormError("Please enter a valid product price.");
      return;
    }

    const oldPriceNum = formOldPrice ? parseFloat(formOldPrice) : null;
    const ratingNum = parseFloat(formRating) || 5.0;
    const reviewsNum = parseInt(formReviews, 10) || 0;

    const matchedCategory = categories.find((c) => c.id === formCategory);
    const categoryTitle = matchedCategory ? matchedCategory.title : formCategory;

    startTransition(async () => {
      if (modalMode === "create") {
        const newProductData = {
          name: formName.trim(),
          category_id: formCategory,
          price: priceNum,
          old_price: oldPriceNum,
          rating: ratingNum,
          reviews: reviewsNum,
          badge: formBadge || null,
          in_stock: formInStock,
          shipping: formShipping.trim(),
          image: formImage || "/images/hero-workspace.jpg",
        };

        if (isSupabaseConfigured()) {
          const { data, error } = await createProduct(newProductData);
          if (error) {
            setFormError(`Database error: ${error}`);
            return;
          }
        }

        // Optimistic UI update
        const tempId = `prod-${Date.now()}`;
        const createdItem: Product = {
          id: tempId,
          name: formName.trim(),
          category: categoryTitle,
          price: priceNum,
          oldPrice: oldPriceNum || priceNum,
          rating: ratingNum,
          reviews: reviewsNum,
          badge: formBadge || undefined,
          inStock: formInStock,
          shipping: formShipping.trim(),
          image: formImage || "/images/hero-workspace.jpg",
        };

        setProducts((prev) => [createdItem, ...prev]);
        setFormSuccess("Product created successfully!");
        setTimeout(() => setIsModalOpen(false), 800);
      } else if (modalMode === "edit" && editingProductId) {
        const updateData = {
          name: formName.trim(),
          category_id: formCategory,
          price: priceNum,
          old_price: oldPriceNum,
          rating: ratingNum,
          reviews: reviewsNum,
          badge: formBadge || null,
          in_stock: formInStock,
          shipping: formShipping.trim(),
          image: formImage || "/images/hero-workspace.jpg",
        };

        if (isSupabaseConfigured()) {
          const { error } = await updateProduct(editingProductId, updateData);
          if (error) {
            setFormError(`Update error: ${error}`);
            return;
          }
        }

        // Optimistic UI update
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProductId
              ? {
                  ...p,
                  name: formName.trim(),
                  category: categoryTitle,
                  price: priceNum,
                  oldPrice: oldPriceNum || priceNum,
                  rating: ratingNum,
                  reviews: reviewsNum,
                  badge: formBadge || undefined,
                  inStock: formInStock,
                  shipping: formShipping.trim(),
                  image: formImage || "/images/hero-workspace.jpg",
                }
              : p
          )
        );

        setFormSuccess("Product updated successfully!");
        setTimeout(() => setIsModalOpen(false), 800);
      }
    });
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (isSupabaseConfigured()) {
      const { error } = await deleteProduct(id);
      if (error) {
        alert(`Failed to delete product: ${error}`);
        return;
      }
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>Products</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-[#F26E22] font-bold">
              {products.length}
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Add, update, or remove products from your SparkoMart inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-linear-to-r from-[#FF7527] to-[#E8590C] hover:from-[#E8590C] hover:to-[#CF4A00] rounded-xl shadow-xs shadow-orange-500/20 transition-all transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#F26E22]/30 focus:border-[#F26E22] transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-500 font-medium">Filter:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-[#F26E22]/30"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            aria-label="Filter by stock status"
            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-[#F26E22]/30"
          >
            <option value="all">All Stock Status</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    Loading inventory...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No products found matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Thumbnail & Title */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 relative overflow-hidden shrink-0 border border-gray-200/60">
                          <Image
                            src={product.image || "/images/hero-workspace.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-gray-900 truncate">
                            {product.name}
                          </div>
                          {product.badge && (
                            <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#F26E22]">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg text-[11px]">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </div>
                      {product.oldPrice && (
                        <div className="text-[10px] text-gray-500 line-through">
                          ${product.oldPrice.toFixed(2)}
                        </div>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-4 text-gray-700">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-semibold">{product.rating}</span>
                        <span className="text-gray-500 text-[11px]">
                          ({product.reviews})
                        </span>
                      </div>
                    </td>

                    {/* Stock Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          product.inStock
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-rose-50 text-rose-700 border border-rose-200/60"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            product.inStock ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        <span>{product.inStock ? "In Stock" : "Out of Stock"}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-[#16375B] hover:bg-gray-100 transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === "create" ? "Add New Product" : "Edit Product"}
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
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Bluetooth Noise-Cancelling Headphones"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#F26E22]/30 focus:border-[#F26E22]"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#F26E22]/30"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Badge / Tag (Optional)
                  </label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#F26E22]/30"
                  >
                    <option value="">None</option>
                    <option value="Sale">Sale</option>
                    <option value="New">New</option>
                    <option value="Hot">Hot</option>
                    <option value="Featured">Featured</option>
                  </select>
                </div>
              </div>

              {/* Price & Old Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="29.99"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#F26E22]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Original / Old Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="39.99"
                    value={formOldPrice}
                    onChange={(e) => setFormOldPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#F26E22]/30"
                  />
                </div>
              </div>

              {/* Rating, Reviews & Shipping */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Rating (1 - 5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Reviews Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formReviews}
                    onChange={(e) => setFormReviews(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Shipping Badge
                  </label>
                  <input
                    type="text"
                    value={formShipping}
                    onChange={(e) => setFormShipping(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              {/* In Stock Toggle */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200/70">
                <input
                  type="checkbox"
                  id="inStockToggle"
                  checked={formInStock}
                  onChange={(e) => setFormInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-[#F26E22] focus:ring-[#F26E22] border-gray-300 cursor-pointer"
                />
                <label
                  htmlFor="inStockToggle"
                  className="text-xs font-bold text-gray-800 cursor-pointer"
                >
                  Product is In Stock and Available for Purchase
                </label>
              </div>

              {/* Image Uploader & Preview */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Image
                </label>
                <div className="flex gap-4 items-start">
                  {/* Preview Box */}
                  <div className="w-20 h-20 rounded-xl border border-gray-200 bg-gray-50 relative overflow-hidden shrink-0 flex items-center justify-center">
                    {formImage ? (
                      <Image
                        src={formImage}
                        alt="Product preview"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* File Upload Button */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id="imageFileInput"
                        onChange={handleImageFileChange}
                        disabled={uploadingImage}
                        className="sr-only"
                      />
                      <label
                        htmlFor="imageFileInput"
                        className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-colors ${
                          uploadingImage ? "opacity-50 pointer-events-none" : ""
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5 text-[#F26E22]" />
                        <span>
                          {uploadingImage
                            ? "Uploading to Supabase..."
                            : "Upload Photo"}
                        </span>
                      </label>
                    </div>

                    {/* Image URL fallback input */}
                    <input
                      type="text"
                      placeholder="Or enter image URL (e.g. /images/knife-set.jpg)"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons */}
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
                  disabled={isPending || uploadingImage}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-linear-to-r from-[#FF7527] to-[#E8590C] hover:from-[#E8590C] hover:to-[#CF4A00] rounded-xl shadow-xs shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPending
                    ? "Saving..."
                    : modalMode === "create"
                    ? "Create Product"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900">
              Delete this product?
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              This will remove the product from your store catalog.
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
                onClick={() => handleDeleteProduct(deleteConfirmId)}
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
