import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useProjectStore } from '../stores/projectStore';
import { Project, ApiResponse } from '../types';

export default function ProjectsList() {
  const { projects, setProjects, addProject, removeProject } = useProjectStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectPrompt, setNewProjectPrompt] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get<ApiResponse<{ projects: Project[] }>>('/api/projects');
      if (response.data.success && response.data.data) {
        setProjects(response.data.data.projects);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setCreating(true);
    try {
      const response = await api.post<ApiResponse<{ project: Project }>>('/api/projects', {
        name: newProjectName,
        prompt: newProjectPrompt || undefined,
        code: '',
      });

      if (response.data.success && response.data.data) {
        addProject(response.data.data.project);
        setShowModal(false);
        setNewProjectName('');
        setNewProjectPrompt('');
        window.location.href = `/editor/${response.data.data.project.id}`;
      } else {
        setError(response.data.error || 'Failed to create project');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.delete<ApiResponse<void>>(`/api/projects/${id}`);
      removeProject(id);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
        >
          New Project
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Create your first project to get started with AI code generation</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <Link
                    to={`/editor/${project.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {project.name}
                  </Link>
                  <button
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
                {project.description && (
                  <p className="mt-2 text-gray-600 text-sm">{project.description}</p>
                )}
                {project.prompt && (
                  <p className="mt-2 text-gray-500 text-xs italic">
                    Prompt: {project.prompt.length > 50 ? project.prompt.slice(0, 50) + '...' : project.prompt}
                  </p>
                )}
                <div className="mt-4 text-xs text-gray-400">
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </div>
                <div className="mt-4">
                  <Link
                    to={`/editor/${project.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Open Editor →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="My Awesome Project"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Prompt (optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Describe what you want to build..."
                  rows={3}
                  value={newProjectPrompt}
                  onChange={(e) => setNewProjectPrompt(e.target.value)}
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
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
