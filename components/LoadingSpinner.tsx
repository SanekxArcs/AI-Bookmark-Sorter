import React, { useEffect, useRef } from 'react';

interface StreamingResponseProps {
  data: string;
}

export const StreamingResponse: React.FC<StreamingResponseProps> = ({ data }) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      const container = codeRef.current.parentElement;
      if (container) {
          container.scrollTop = container.scrollHeight;
      }
    }
  }, [data]);

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
        <div className="w-10 h-10 border-4 border-dashed animate-spin border-gray-800 dark:border-gray-200"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">AI is generating your structure...</p>
        <div className="w-full mt-2 bg-gray-100 dark:bg-black p-4 border border-gray-200 dark:border-gray-800 max-h-72 overflow-y-auto font-mono text-sm">
            <pre className="whitespace-pre-wrap break-words">
                <code ref={codeRef} className="text-gray-700 dark:text-gray-400">
                    {data}
                </code>
            </pre>
        </div>
    </div>
  );
};