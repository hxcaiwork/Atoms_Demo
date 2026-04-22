import { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  loading: boolean;
  placeholder?: string;
}

export default function PromptInput({ onSubmit, loading, placeholder }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onSubmit(prompt.trim());
      // Don't clear here so user can see what they asked for
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {loading ? 'Generating...' : 'Describe what you want to build:'}
        </label>
        <div className="flex space-x-2">
          <textarea
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder={placeholder || 'e.g., "A beautiful landing page for a coffee shop with a menu and contact form"...'}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md font-medium"
          >
            {loading ? 'Generating...' : 'Generate Code'}
          </button>
        </div>
      </div>
    </form>
  );
}
