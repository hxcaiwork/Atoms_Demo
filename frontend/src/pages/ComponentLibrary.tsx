import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Component, ApiResponse } from '../types';

export default function ComponentLibrary() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCode, setNewCode] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await api.get<ApiResponse<{ components: Component[] }>>('/api/components');
      if (response.data.success && response.data.data) {
        setComponents(response.data.data.components);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load components');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) return;

    setCreating(true);
    try {
      await api.post('/api/components', {
        name: newName,
        description: newDescription,
        code: newCode,
      });
      setShowModal(false);
      setNewName('');
      setNewDescription('');
      setNewCode('');
      fetchComponents();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create component');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteComponent = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this component?')) return;

    try {
      await api.delete(`/api/components/${id}`);
      setComponents(components.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete component');
    }
  };

  const filteredComponents = components.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading components...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Component Library</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Add Component
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search components..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {filteredComponents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No components yet</h3>
          <p className="text-gray-500 mb-4">Save components from your projects to reuse them later</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Add Your First Component
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => (
            <div
              key={component.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
                  <button
                    onClick={() => handleDeleteComponent(component.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
                {component.description && (
                  <p className="mt-2 text-gray-600 text-sm">{component.description}</p>
                )}
                {component.prompt && (
                  <p className="mt-2 text-gray-500 text-xs italic">
                    Prompt: {component.prompt.length > 60 ? component.prompt.slice(0, 60) + '...' : component.prompt}
                  </p>
                )}
                <div className="mt-4">
                  <details className="text-sm">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-700">
                      Preview code
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto max-h-32 overflow-y-auto">
                      {component.code.slice(0, 500)}
                      {component.code.length > 500 ? '...' : ''}
                    </pre>
                  </details>
                </div>
                <div className="mt-4 text-xs text-gray-400">
                  Created {new Date(component.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create New Component Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Component</h2>
            <form onSubmit={handleCreateComponent}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Component Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="My Component"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="A brief description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code
                </label>
                <textarea
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="HTML/JS code here..."
                  rows={6}
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
