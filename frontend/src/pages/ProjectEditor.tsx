import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useProjectStore } from '../stores/projectStore';
import { Project, ApiResponse } from '../types';
import { useAiGeneration } from '../hooks/useAiGeneration';
import CodeEditor from '../components/CodeEditor';
import LivePreview from '../components/LivePreview';
import PromptInput from '../components/PromptInput';
import EditorLayout from '../components/EditorLayout';
import InsertComponentModal from '../components/InsertComponentModal';

export default function ProjectEditor() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentProject, setCurrentProject, updateProject } = useProjectStore();
  const [code, setCode] = useState('');
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveToLibraryModalOpen, setSaveToLibraryModalOpen] = useState(false);
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [newComponentName, setNewComponentName] = useState('');
  const [newComponentDescription, setNewComponentDescription] = useState('');
  const { generate, loading: generating, error } = useAiGeneration();

  // Auto-save code after editing
  useEffect(() => {
    if (!currentProject || code === currentProject.code) return;

    const timer = setTimeout(() => {
      saveCode(code);
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [code, currentProject]);

  useEffect(() => {
    if (projectId) {
      fetchProject(parseInt(projectId));
    }
  }, [projectId]);

  const fetchProject = async (id: number) => {
    try {
      const response = await api.get<ApiResponse<{ project: Project }>>(`/api/projects/${id}`);
      if (response.data.success && response.data.data) {
        setCurrentProject(response.data.data.project);
        setCode(response.data.data.project.code);
        setProjectName(response.data.data.project.name);
      }
    } catch (error) {
      console.error('Failed to fetch project', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (prompt: string) => {
    const generatedCode = await generate(prompt, code || undefined);
    if (generatedCode) {
      setCode(generatedCode);
      // Auto-save after generation
      if (currentProject) {
        await saveCode(generatedCode);
      }
    }
  };

  const saveCode = async (newCode: string) => {
    if (!currentProject) return;

    setSaving(true);
    try {
      await api.put<ApiResponse<{ project: Project }>>(`/api/projects/${currentProject.id}`, {
        name: projectName,
        code: newCode,
      });
      updateProject(currentProject.id, { code: newCode, name: projectName });
    } catch (error) {
      console.error('Failed to save', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode !== undefined) {
      setCode(newCode);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!currentProject || !newComponentName.trim()) return;

    try {
      await api.post('/api/components', {
        name: newComponentName,
        description: newComponentDescription,
        code: code,
        prompt: currentProject.prompt,
      });
      setSaveToLibraryModalOpen(false);
      setNewComponentName('');
      setNewComponentDescription('');
    } catch (error) {
      console.error('Failed to save to library', error);
    }
  };

  const handleInsertComponent = (insertedCode: string) => {
    setCode((prev) => prev ? prev + '\n\n' + insertedCode : insertedCode);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading project...</div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Project not found</div>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/projects')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => saveCode(code)}
            className="text-lg font-medium border border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none rounded px-2 py-1 w-64"
          />
          <span className="text-sm text-gray-500">
            {(saving && 'Saving...') || (generating && 'Generating...') || 'Saved'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setInsertModalOpen(true)}
            className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm"
          >
            Insert Component
          </button>
          <button
            onClick={() => setSaveToLibraryModalOpen(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Save to Components
          </button>
          <button
            onClick={() => navigate('/projects')}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm"
          >
            Back
          </button>
        </div>
      </div>

      <EditorLayout
        editor={<CodeEditor value={code} onChange={handleCodeChange} />}
        preview={<LivePreview code={code} />}
        prompt={
          <PromptInput
            onSubmit={handleGenerate}
            loading={generating}
            placeholder="Describe the changes or new feature you want to add..."
          />
        }
      />

      {error && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
          {error}
        </div>
      )}

      {/* Save to Library Modal */}
      {saveToLibraryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Save to Component Library</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Component Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="My Awesome Component"
                  value={newComponentName}
                  onChange={(e) => setNewComponentName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="What does this component do?"
                  rows={2}
                  value={newComponentDescription}
                  onChange={(e) => setNewComponentDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSaveToLibraryModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveToLibrary}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <InsertComponentModal
        isOpen={insertModalOpen}
        onClose={() => setInsertModalOpen(false)}
        onInsert={handleInsertComponent}
      />
    </div>
  );
}
