import { useRef, useEffect } from 'react';

interface LivePreviewProps {
  code: string;
}

export default function LivePreview({ code }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(code || '<!-- No code to preview -->');
        iframeDoc.close();
      }
    }
  }, [code]);

  return (
    <div className="h-full w-full bg-white">
      {!code ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-lg">Generate some code to see the preview</p>
          </div>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          title="preview"
          className="w-full h-full border-none bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
        />
      )}
    </div>
  );
}
