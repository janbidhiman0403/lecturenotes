import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  themeVariables: {
    primaryColor: '#3B82F6',
    primaryTextColor: '#1A1A1A',
    lineColor: '#1A1A1A',
    fontSize: '14px',
    fontFamily: 'Inter'
  },
  securityLevel: 'loose',
});

interface MermaidProps {
  chart: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      ref.current.removeAttribute('data-processed');
      mermaid.contentLoaded();
    }
  }, [chart]);

  if (!chart) return null;

  return (
    <div className="mermaid-container my-4">
      <div key={chart} className="mermaid flex justify-center" ref={ref}>
        {chart}
      </div>
    </div>
  );
};
