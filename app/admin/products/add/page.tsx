"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parent: { name: string } | null;
  children?: Category[];
}

function AddProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>("");
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    comparePrice: "",
    cost: "",
    sku: "",
    barcode: "",
    trackQuantity: true,
    quantity: "",
    lowStockThreshold: "10",
    categoryId: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    featured: false,
    isReturnable: true,
    isBranded: false,
    shippingCharge: "0",
    ageGroups: [] as string[],
    status: "ACTIVE",
  });
  const [existingImages, setExistingImages] = useState<string[]>([]); // URLs from DB
  const [images, setImages] = useState<File[]>([]); // NEW files
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // new file previews
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [variants, setVariants] = useState([
    { name: "", value: "", price: "", stock: "" },
  ]);
  const [linkedProducts, setLinkedProducts] = useState<
    { linkedProductId: string; name: string; label: string }[]
  >([]);
  const [productSearch, setProductSearch] = useState("");
  const [productSearchResults, setProductSearchResults] = useState<
    { id: string; name: string }[]
  >([]);
  const [searchingProducts, setSearchingProducts] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        console.log("Categories loaded:", data.categories);
        const allCategories = data.categories || [];
        setCategories(allCategories);
        // Filter parent categories (no parentId)
        const parents = allCategories.filter((cat: Category) => !cat.parentId);
        setParentCategories(parents);
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  // Fetch product data when editing
  useEffect(() => {
    if (productId && categories.length > 0) {
      fetch(`/api/products?id=${productId}`)
        .then((res) => res.json())
        .then((data) => {
          const product = data;
          const savedCategoryId = product.categories?.[0]?.categoryId || "";

          setFormData({
            name: product.name || "",
            slug: product.slug || "",
            description: product.description || "",
            price: product.price?.toString() || "",
            comparePrice: product.compareAtPrice?.toString() || "",
            cost: product.costPrice?.toString() || "",
            sku: product.sku || "",
            barcode: product.barcode || "",
            trackQuantity: product.trackInventory ?? true,
            quantity: product.quantity?.toString() || "",
            lowStockThreshold: product.lowStockThreshold?.toString() || "10",
            categoryId: savedCategoryId,
            tags: product.metaKeywords || "",
            metaTitle: product.metaTitle || "",
            metaDescription: product.metaDescription || "",
            featured: product.isFeatured || false,
            isReturnable: product.isReturnable ?? true,
            isBranded: product.isBranded || false,
            shippingCharge: product.shippingCharge?.toString() || "0",
            ageGroups: product.ageGroup
              ? (() => {
                  try {
                    const parsed = JSON.parse(product.ageGroup);
                    return Array.isArray(parsed) ? parsed : [product.ageGroup];
                  } catch {
                    return [product.ageGroup];
                  }
                })()
              : [],
            status: product.isActive ? "ACTIVE" : "DRAFT",
          });

          // Set parent category and subcategories
          if (savedCategoryId) {
            const cat = categories.find((c) => c.id === savedCategoryId);
            if (cat?.parentId) {
              // It's a subcategory
              setSelectedParent(cat.parentId);
              const subs = categories.filter(
                (c) => c.parentId === cat.parentId,
              );
              setSubcategories(subs);
            } else {
              // It's a parent category
              setSelectedParent(savedCategoryId);
            }
          }

          // Set image previews
          if (product.images?.length) {
            setExistingImages(product.images.map((img: any) => img.url));
          }

          // Load existing linked products (variants)
          if (product.productLinks?.length) {
            setLinkedProducts(
              product.productLinks.map((pl: any) => ({
                linkedProductId: pl.linkedProductId,
                name: pl.linkedProduct?.name || pl.linkedProductId,
                label: pl.label || "",
              })),
            );
          }

          // Load existing variants
          if (product.variants?.length) {
            setVariants(
              product.variants.map((v: any) => ({
                name: v.name || "",
                value: v.value || "",
                price: v.price?.toString() || "",
                stock: v.quantity?.toString() || "",
              })),
            );
          }
        })
        .catch((err) => console.error("Error loading product:", err));
    }
  }, [productId, categories]);

  // Update subcategories when parent is selected
  useEffect(() => {
    if (selectedParent && categories.length > 0) {
      const subs = categories.filter((cat) => cat.parentId === selectedParent);
      setSubcategories(subs);
      // Only auto-select if not editing or if category not already set
      if (!productId || !formData.categoryId) {
        if (subs.length === 0) {
          setFormData((prev) => ({ ...prev, categoryId: selectedParent }));
        } else {
          setFormData((prev) => ({ ...prev, categoryId: "" }));
        }
      }
    } else if (!selectedParent) {
      setSubcategories([]);
      if (!productId) {
        setFormData((prev) => ({ ...prev, categoryId: "" }));
      }
    }
  }, [selectedParent, categories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const totalExisting = existingImages.length;
    if (index < totalExisting) {
      // Removing an existing (saved) image
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Removing a newly added file
      const newIdx = index - totalExisting;
      setImages((prev) => prev.filter((_, i) => i !== newIdx));
      setImagePreviews((prev) => prev.filter((_, i) => i !== newIdx));
    }
  };

  // All displayed images = existing URLs + new file previews
  const allPreviews = [...existingImages, ...imagePreviews];

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const allImgs = [...existingImages, ...imagePreviews];
    const reordered = [...allImgs];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    const newExisting: string[] = [];
    const newPreviews: string[] = [];
    const newFiles: File[] = [];
    reordered.forEach((src) => {
      const origExistIdx = existingImages.indexOf(src);
      if (origExistIdx !== -1) {
        newExisting.push(src);
      } else {
        const origNewIdx = imagePreviews.indexOf(src);
        newPreviews.push(src);
        if (origNewIdx !== -1) newFiles.push(images[origNewIdx]);
      }
    });
    setExistingImages(newExisting);
    setImagePreviews(newPreviews);
    setImages(newFiles);
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  const addVariant = () => {
    setVariants([...variants, { name: "", value: "", price: "", stock: "" }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const searchProducts = async (query: string) => {
    setProductSearch(query);
    if (!query.trim()) {
      setProductSearchResults([]);
      return;
    }
    setSearchingProducts(true);
    try {
      const res = await fetch(
        `/api/products?search=${encodeURIComponent(query)}&limit=6`,
      );
      const data = await res.json();
      setProductSearchResults(data.products || []);
    } finally {
      setSearchingProducts(false);
    }
  };

  const addLinkedProduct = (product: { id: string; name: string }) => {
    if (linkedProducts.find((lp) => lp.linkedProductId === product.id)) return;
    setLinkedProducts([
      ...linkedProducts,
      { linkedProductId: product.id, name: product.name, label: "" },
    ]);
    setProductSearch("");
    setProductSearchResults([]);
  };

  const removeLinkedProduct = (linkedProductId: string) => {
    setLinkedProducts(
      linkedProducts.filter((lp) => lp.linkedProductId !== linkedProductId),
    );
  };

  const updateLinkedProductLabel = (linkedProductId: string, label: string) => {
    setLinkedProducts(
      linkedProducts.map((lp) =>
        lp.linkedProductId === linkedProductId ? { ...lp, label } : lp,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add product ID for updates
      if (productId) {
        formDataToSend.append("id", productId);
      }

      // Add form fields with correct API key names
      formDataToSend.append("name", formData.name);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("compareAtPrice", formData.comparePrice);
      formDataToSend.append("costPrice", formData.cost);
      formDataToSend.append("sku", formData.sku);
      formDataToSend.append("barcode", formData.barcode);
      formDataToSend.append(
        "trackInventory",
        formData.trackQuantity.toString(),
      );
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("lowStockThreshold", formData.lowStockThreshold);
      formDataToSend.append("metaTitle", formData.metaTitle);
      formDataToSend.append("metaDescription", formData.metaDescription);
      formDataToSend.append("metaKeywords", formData.tags);
      formDataToSend.append("isFeatured", formData.featured.toString());
      formDataToSend.append("isReturnable", formData.isReturnable.toString());
      formDataToSend.append("isBranded", formData.isBranded.toString());
      formDataToSend.append("shippingCharge", formData.shippingCharge);
      if ((formData as any).brand)
        formDataToSend.append("brand", (formData as any).brand);
      // Age groups stored as JSON array
      formDataToSend.append(
        "ageGroup",
        JSON.stringify(formData.ageGroups || []),
      );

      // Convert status to isActive
      formDataToSend.append(
        "isActive",
        (formData.status === "ACTIVE").toString(),
      );

      // Add category as an array
      if (formData.categoryId) {
        formDataToSend.append(
          "categoryIds",
          JSON.stringify([formData.categoryId]),
        );
      } else {
        formDataToSend.append("categoryIds", JSON.stringify([]));
      }

      // Add images
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      // Tell the API which existing images to keep (the rest will be deleted)
      formDataToSend.append("keepImageUrls", JSON.stringify(existingImages));

      // Add variants
      formDataToSend.append(
        "variants",
        JSON.stringify(variants.filter((v) => v.name.trim() || v.value.trim())),
      );

      // Add linked products (product variants)
      formDataToSend.append(
        "productLinks",
        JSON.stringify(
          linkedProducts.map((lp) => ({
            linkedProductId: lp.linkedProductId,
            label: lp.label,
          })),
        ),
      );

      const method = productId ? "PUT" : "POST";

      const response = await fetch("/api/products", {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const error = await response.json();
        alert(
          error.error || `Failed to ${productId ? "update" : "create"} product`,
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {productId ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-gray-600 mt-2">
          {productId
            ? "Update product information"
            : "Create a new product for your store"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="product-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product description"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Pricing</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compare Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, comparePrice: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Inventory</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SKU-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Barcode
                    </label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) =>
                        setFormData({ ...formData, barcode: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123456789"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="trackQuantity"
                    checked={formData.trackQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trackQuantity: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <label
                    htmlFor="trackQuantity"
                    className="text-sm font-medium text-gray-700"
                  >
                    Track quantity
                  </label>
                </div>

                {formData.trackQuantity && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        required={formData.trackQuantity}
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({ ...formData, quantity: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Low Stock Threshold
                      </label>
                      <input
                        type="number"
                        value={formData.lowStockThreshold}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lowStockThreshold: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-1">Product Images</h2>
              <p className="text-xs text-gray-500 mb-4">
                Drag to reorder. First image is the main image.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {allPreviews.map((preview, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`relative group cursor-grab active:cursor-grabbing rounded-lg border-2 transition-all ${
                        dragIndex === index
                          ? "opacity-50 border-blue-400"
                          : "border-transparent"
                      }`}
                    >
                      {index === 0 && (
                        <span className="absolute top-1 left-1 z-10 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          MAIN
                        </span>
                      )}
                      <img
                        src={preview}
                        alt={`Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                        draggable={false}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload images
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-semibold">Variants</h2>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Variant
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                A variant is a specific option of this product. Add one row per
                option — e.g. <strong>Type: Color, Value: Red</strong> or{" "}
                <strong>Type: Size, Value: Large</strong>. Leave Price blank to
                use the main product price.
              </p>

              <div className="space-y-3">
                {/* Header row */}
                <div className="hidden md:grid grid-cols-[1fr_1fr_100px_80px_32px] gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                  <span>Type (e.g. Color, Size)</span>
                  <span>Value (e.g. Red, Large)</span>
                  <span>Price (₹)</span>
                  <span>Stock</span>
                  <span />
                </div>

                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 md:grid-cols-[1fr_1fr_100px_80px_32px] gap-3 items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <input
                      type="text"
                      placeholder="e.g. Color"
                      value={variant.name}
                      onChange={(e) =>
                        updateVariant(index, "name", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    />
                    <input
                      type="text"
                      placeholder="e.g. Red"
                      value={variant.value}
                      onChange={(e) =>
                        updateVariant(index, "value", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Optional"
                      step="0.01"
                      min="0"
                      value={variant.price}
                      onChange={(e) =>
                        updateVariant(index, "price", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    />
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(index, "stock", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Color / Style Variants — Link to Other Products */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-1">
                Color / Style Variants
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                If this product exists as <strong>separate products</strong> in
                different colors or styles, link them here. They will appear as
                clickable image swatches on the product page (like Amazon /
                Flipkart).
                <br />
                <strong>Example:</strong> On "Guitar – White", link "Guitar –
                Blue" here with label "Blue".
              </p>

              {/* Search */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search product to link…"
                  value={productSearch}
                  onChange={(e) => searchProducts(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                {productSearchResults.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {productSearchResults.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => addLinkedProduct(p)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {linkedProducts.length === 0 ? (
                <p className="text-xs text-gray-400 italic">
                  No variants linked yet. Search above to link a product.
                </p>
              ) : (
                <div className="space-y-2">
                  {linkedProducts.map((lp) => (
                    <div
                      key={lp.linkedProductId}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <span className="flex-1 text-sm font-medium text-gray-700 truncate">
                        {lp.name}
                      </span>
                      <input
                        type="text"
                        placeholder="Label (e.g. Blue)"
                        value={lp.label}
                        onChange={(e) =>
                          setLinkedProducts(
                            linkedProducts.map((l) =>
                              l.linkedProductId === lp.linkedProductId
                                ? { ...l, label: e.target.value }
                                : l,
                            ),
                          )
                        }
                        className="w-28 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeLinkedProduct(lp.linkedProductId)}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Status</h2>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Category *</h2>
                <Link
                  href="/admin/categories/add"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add New
                </Link>
              </div>

              {categories.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-600 mb-3">No categories yet</p>
                  <Link
                    href="/admin/categories/add"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Create First Category
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Step 1: Select Main Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      1. Select Main Category
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {parentCategories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedParent(cat.id)}
                          className={`p-3 text-left rounded-lg border-2 transition-all ${
                            selectedParent === cat.id
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                        >
                          <div className="font-medium text-sm">{cat.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {
                              categories.filter((c) => c.parentId === cat.id)
                                .length
                            }{" "}
                            subcategories
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Select Subcategory (if available) */}
                  {selectedParent && subcategories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        2. Select Subcategory (Optional)
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              categoryId: selectedParent,
                            })
                          }
                          className={`p-3 text-left rounded-lg border-2 transition-all ${
                            formData.categoryId === selectedParent
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                        >
                          <div className="font-medium text-sm">
                            No subcategory (use main category)
                          </div>
                        </button>
                        {subcategories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, categoryId: cat.id })
                            }
                            className={`p-3 text-left rounded-lg border-2 transition-all ${
                              formData.categoryId === cat.id
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                            }`}
                          >
                            <div className="font-medium text-sm">
                              {cat.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selection Summary */}
                  {formData.categoryId && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600 font-medium">
                          ✓ Selected:
                        </span>
                        <span className="text-green-700">
                          {categories.find((c) => c.id === formData.categoryId)
                            ?.parent?.name &&
                            `${categories.find((c) => c.id === formData.categoryId)?.parent?.name} → `}
                          {
                            categories.find((c) => c.id === formData.categoryId)
                              ?.name
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Tags</h2>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="toy, educational, kids"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                Separate tags with commas
              </p>
            </div>

            {/* Featured */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-medium text-gray-700"
                >
                  Featured Product
                </label>
              </div>
            </div>

            {/* Age Group */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold mb-3">Age Group</h2>
              <p className="text-xs text-gray-500 mb-3">
                Select all age groups this product is suitable for
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    value: "ZERO_TO_ONE",
                    label: "0-2 Years",
                    emoji: "👶",
                    color: "border-pink-300 bg-pink-50 text-pink-700",
                    sub: "Babies & Toddlers",
                  },
                  {
                    value: "TWO_TO_FOUR",
                    label: "3-5 Years",
                    emoji: "🧒",
                    color: "border-yellow-300 bg-yellow-50 text-yellow-700",
                    sub: "Preschoolers",
                  },
                  {
                    value: "SIX_TO_EIGHT",
                    label: "6-8 Years",
                    emoji: "👧",
                    color: "border-sky-300 bg-sky-50 text-sky-700",
                    sub: "Early School Age",
                  },
                  {
                    value: "EIGHT_PLUS",
                    label: "9-12 Years",
                    emoji: "👦",
                    color: "border-green-300 bg-green-50 text-green-700",
                    sub: "Pre-Teens",
                  },
                  {
                    value: "EIGHT_PLUS_TEENS",
                    label: "12+ Years",
                    emoji: "🧑",
                    color: "border-purple-300 bg-purple-50 text-purple-700",
                    sub: "Teens & Beyond",
                  },
                ].map(({ value, label, emoji, color, sub }) => {
                  const selected = (formData.ageGroups || []).includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          ageGroups: selected
                            ? (prev.ageGroups || []).filter((a) => a !== value)
                            : [...(prev.ageGroups || []), value],
                        }))
                      }
                      className={`p-2 rounded-lg border-2 text-xs font-semibold transition-all flex flex-col items-start gap-0 ${
                        selected
                          ? color + " ring-2 ring-offset-1 ring-blue-400"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <span>{emoji}</span> {label}
                      </span>
                      {sub && (
                        <span className="text-[10px] font-normal opacity-70">
                          {sub}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Return Policy */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold mb-3">Return Policy</h2>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isReturnable: true })
                  }
                  className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    formData.isReturnable
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  ✅ Returnable
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isReturnable: false })
                  }
                  className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    !formData.isReturnable
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  🚫 Non-Returnable
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {formData.isReturnable
                  ? "7-day return window applies."
                  : "This product cannot be returned after purchase."}
              </p>
            </div>

            {/* Branded Product & Shipping Charge */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold mb-3">Shipping</h2>
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="isBranded"
                  checked={formData.isBranded}
                  onChange={(e) =>
                    setFormData({ ...formData, isBranded: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <label
                  htmlFor="isBranded"
                  className="text-sm font-medium text-gray-700"
                >
                  Branded Product (sold at MRP)
                </label>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Shipping Charge (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.shippingCharge}
                  onChange={(e) =>
                    setFormData({ ...formData, shippingCharge: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Set to 0 for free shipping. Shown to customers on product page
                  and checkout.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? productId
                      ? "Updating..."
                      : "Creating..."
                    : productId
                      ? "Update Product"
                      : "Create Product"}
                </button>
                <Link
                  href="/admin/products"
                  className="block w-full text-center bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function AddProduct() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <AddProductContent />
    </Suspense>
  );
}
