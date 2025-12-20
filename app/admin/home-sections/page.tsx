'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface HomeSection {
  id: string;
  name: string;
  slug: string;
  title: string;
  subtitle: string | null;
  sectionType: string;
  displayOrder: number;
  isActive: boolean;
  _count?: { items: number };
}

export default function HomeSectionsPage() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<HomeSection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    title: '',
    subtitle: '',
    sectionType: 'GRID',
    displayOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/admin/home-sections');
      const data = await res.json();
      setSections(data.sections || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      alert('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = '/api/admin/home-sections';
      const method = editingSection ? 'PUT' : 'POST';
      const body = editingSection ? { ...formData, id: editingSection.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert(editingSection ? 'Section updated successfully!' : 'Section created successfully!');
        setShowModal(false);
        setEditingSection(null);
        resetForm();
        fetchSections();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save section');
      }
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section? All items will be deleted.')) return;

    try {
      const res = await fetch(`/api/admin/home-sections?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Section deleted successfully!');
        fetchSections();
      } else {
        alert('Failed to delete section');
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      title: '',
      subtitle: '',
      sectionType: 'GRID',
      displayOrder: 0,
      isActive: true
    });
  };

  const openEditModal = (section: HomeSection) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      slug: section.slug,
      title: section.title,
      subtitle: section.subtitle || '',
      sectionType: section.sectionType,
      displayOrder: section.displayOrder,
      isActive: section.isActive
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingSection(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Home Page Sections</h1>
          <p className="text-gray-600 mt-2">Manage sections displayed on the homepage</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Section
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sections.map((section) => (
              <tr key={section.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{section.name}</div>
                    <div className="text-sm text-gray-500">{section.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{section.sectionType}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{section._count?.items || 0}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{section.displayOrder}</td>
                <td className="px-6 py-4">
                  {section.isActive ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Eye className="w-4 h-4" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400">
                      <EyeOff className="w-4 h-4" /> Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/home-sections/${section.id}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4" /> Manage Items
                  </Link>
                  <button
                    onClick={() => openEditModal(section)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(section.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sections.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No sections found. Create your first section to get started.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingSection ? 'Edit Section' : 'Create New Section'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Premium Boutiques"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug * (URL-friendly, no spaces)
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., premium-boutiques"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., PREMIUM BOUTIQUES"
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
                  placeholder="e.g., Snag the hottest deals"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Type *
                </label>
                <select
                  value={formData.sectionType}
                  onChange={(e) => setFormData({ ...formData, sectionType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="GRID">Grid Layout</option>
                  <option value="CAROUSEL">Horizontal Scrollable</option>
                  <option value="TWO_COLUMN">Two Column</option>
                  <option value="FULL_WIDTH">Full Width Banner</option>
                </select>
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
                  {editingSection ? 'Update Section' : 'Create Section'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSection(null);
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
