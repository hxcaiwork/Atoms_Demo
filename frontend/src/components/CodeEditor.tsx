import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  height?: string;
}

export default function CodeEditor({ value, onChange, language = 'html', height = '100%' }: CodeEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value);
  };

  return (
    <div className="h-full w-full">
      <MonacoEditor
        height={height}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
