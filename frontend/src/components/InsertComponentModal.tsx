import { useState, useEffect } from 'react';
import { Component } from '../types';
import api from '../utils/api';

interface InsertComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (code: string) => void;
}

export default function InsertComponentModal({ isOpen, onClose, onInsert }: InsertComponentModalProps) {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchComponents();
    }
  }, [isOpen]);

  const fetchComponents = async () => {
    try {
      const response = await api.get('/api/components');
      if (response.data.success && response.data.data) {
        setComponents(response.data.data.components);
      }
    } catch (error) {
      console.error('Failed to fetch components', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComponents = components.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (component: Component) => {
    onInsert(component.code);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Insert Component from Library</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search components..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : filteredComponents.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No components found</div>
          ) : (
            <div className="space-y-3">
              {filteredComponents.map((component) => (
                <div
                  key={component.id}
                  className="border border-gray-200 rounded-md p-4 hover:border-blue-500 cursor-pointer transition-colors"
                  onClick={() => handleSelect(component)}
                >
                  <div className="font-medium text-gray-900">{component.name}</div>
                  {component.description && (
                    <div className="text-sm text-gray-600 mt-1">{component.description}</div>
                  )}
                  {component.prompt && (
                    <div className="text-xs text-gray-400 mt-1 italic">
                      Prompt: {component.prompt.slice(0, 60)}
                      {component.prompt.length > 60 ? '...' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
