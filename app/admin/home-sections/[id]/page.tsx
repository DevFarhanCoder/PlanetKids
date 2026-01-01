'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

interface HomeSectionItem {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  categoryId: string | null;
  badge: string | null;
  discount: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface HomeSection {
  id: string;
  name: string;
  title: string;
  sectionType: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
}

export default function ManageSectionItemsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [sectionId, setSectionId] = useState<string>('');
  const [section, setSection] = useState<HomeSection | null>(null);
  const [items, setItems] = useState<HomeSectionItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<HomeSectionItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    linkType: 'category' as 'category' | 'product',
    categoryId: '',
    productId: '',
    badge: '',
    discount: '',
    displayOrder: 0,
    isActive: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setSectionId(id);
    });
  }, [params]);

  useEffect(() => {
    if (sectionId) {
      fetchSection();
      fetchItems();
      fetchCategories();
      fetchProducts();
    }
  }, [sectionId]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      // Filter only subcategories (those with a parentId)
      const subcategories = (data.categories || []).filter((cat: Category) => (cat as any).parentId !== null);
      setCategories(subcategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSection = async () => {
    try {
      const res = await fetch('/api/admin/home-sections');
      const data = await res.json();
      const foundSection = data.sections?.find((s: any) => s.id === sectionId);
      setSection(foundSection || null);
    } catch (error) {
      console.error('Error fetching section:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await fetch(`/api/admin/home-section-items?sectionId=${sectionId}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('sectionId', sectionId);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('subtitle', formData.subtitle);
    formDataToSend.append('linkType', formData.linkType);
    formDataToSend.append('categoryId', formData.categoryId);
    formDataToSend.append('productId', formData.productId);
    formDataToSend.append('badge', formData.badge);
    formDataToSend.append('discount', formData.discount);
    formDataToSend.append('displayOrder', formData.displayOrder.toString());
    formDataToSend.append('isActive', formData.isActive.toString());
    
    if (editingItem) {
      formDataToSend.append('id', editingItem.id);
    }
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    } else if (!editingItem) {
      alert('Please select an image');
      return;
    }

    try {
      const url = '/api/admin/home-section-items';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (res.ok) {
        alert(editingItem ? 'Item updated successfully!' : 'Item created successfully!');
        setShowModal(false);
        setEditingItem(null);
        resetForm();
        fetchItems();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save item');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/admin/home-section-items?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Item deleted successfully!');
        fetchItems();
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      linkType: 'category',
      categoryId: '',
      productId: '',
      badge: '',
      discount: '',
      displayOrder: 0,
      isActive: true
    });
    setImageFile(null);
    setImagePreview('');
  };

  const openEditModal = (item: HomeSectionItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      subtitle: item.subtitle || '',
      linkType: item.categoryId ? 'category' : 'product',
      categoryId: item.categoryId || '',
      productId: (item as any).productId || '',
      badge: item.badge || '',
      discount: item.discount || '',
      displayOrder: item.displayOrder,
      isActive: item.isActive
    });
    setImagePreview(item.image);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    resetForm();
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!section) {
    return <div className="p-8">Section not found</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/home-sections" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Sections
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{section.name}</h1>
            <p className="text-gray-600 mt-2">Manage items for: {section.title}</p>
            <p className="text-sm text-gray-500 mt-1">Type: {section.sectionType}</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <div className="relative aspect-square">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
              {!item.isActive && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold">INACTIVE</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              {item.subtitle && (
                <p className="text-sm text-gray-600 mb-2">{item.subtitle}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                {item.badge && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {item.badge}
                  </span>
                )}
                {item.discount && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    {item.discount}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 mb-3">
                Order: {item.displayOrder}
                {item.categoryId && (
                  <> | Category: {categories.find(c => c.id === item.categoryId)?.name || 'Unknown'}</>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="flex-1 flex items-center justify-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-2 rounded hover:bg-yellow-100 transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-700 px-3 py-2 rounded hover:bg-red-100 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No items yet. Add your first item to get started.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image * {section.sectionType === 'GRID' ? '(Recommended: 670x670px)' : section.sectionType === 'TWO_COLUMN' ? '(Recommended: 1200x400px)' : '(Recommended: 300x400px)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                {imagePreview && (
                  <div className="mt-3 relative w-full h-48">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Mom Of All Sale"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Upto 60% Off"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Link To *
                </label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="category"
                      checked={formData.linkType === 'category'}
                      onChange={(e) => setFormData({ ...formData, linkType: 'category', productId: '' })}
                      className="mr-2"
                    />
                    <span>Category</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="product"
                      checked={formData.linkType === 'product'}
                      onChange={(e) => setFormData({ ...formData, linkType: 'product', categoryId: '' })}
                      className="mr-2"
                    />
                    <span>Specific Product</span>
                  </label>
                </div>

                {formData.linkType === 'category' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Category *
                    </label>
                    <select
                      required={formData.linkType === 'category'}
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Will link to: /categories/[category-slug]
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Product *
                    </label>
                    <select
                      required={formData.linkType === 'product'}
                      value={formData.productId}
                      onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Will link to: /products/[product-slug]
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., NEW"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., 50% OFF"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-pink-600"
                />
                <label className="text-sm font-medium text-gray-700">Active</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  {editingItem ? 'Update Item' : 'Create Item'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
