import { ReactNode } from 'react';

interface EditorLayoutProps {
  editor: ReactNode;
  preview: ReactNode;
  prompt: ReactNode;
}

export default function EditorLayout({ editor, preview, prompt }: EditorLayoutProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-gray-200 overflow-hidden">
          {editor}
        </div>
        <div className="w-1/2 overflow-hidden">
          {preview}
        </div>
      </div>
      {prompt}
    </div>
  );
}
