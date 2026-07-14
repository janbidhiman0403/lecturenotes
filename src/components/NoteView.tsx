import React, { useState } from 'react';
import { Mermaid } from './Mermaid';
import { FileText, Map, Layout as LayoutIcon, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';

interface NoteViewProps {
  lecture: any;
}

export const NoteView: React.FC<NoteViewProps> = ({ lecture }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript' | 'mindmap' | 'diagram'>('summary');
  const [isExpanded, setIsExpanded] = useState(true);

  if (!lecture) return null;

  return (
    <div className="bg-[#0D0D0D] rounded-2xl border border-[#1F1F1F] shadow-xl overflow-hidden mb-6">
      <div className="p-6 border-b border-[#1F1F1F] flex items-center justify-between bg-[#141414]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{lecture.title}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {new Date(lecture.date.seconds * 1000).toLocaleDateString()}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                {lecture.status}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-0">
          <div className="flex items-center border-b border-[#1F1F1F] bg-[#111111] sticky top-0 z-10">
            {[
              { id: 'summary', icon: FileText, label: 'Summary' },
              { id: 'mindmap', icon: Map, label: 'Mindmap' },
              { id: 'diagram', icon: LayoutIcon, label: 'Diagrams' },
              { id: 'transcript', icon: FileText, label: 'Full Transcript' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium transition-all relative ${
                  activeTab === tab.id ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                )}
              </button>
            ))}
          </div>

          <div className="p-6 min-h-[300px]">
            {activeTab === 'summary' && (
              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                <ReactMarkdown>{lecture.summary || "Generating summary..."}</ReactMarkdown>
              </div>
            )}
            {activeTab === 'transcript' && (
              <div className="text-gray-400 leading-relaxed font-mono text-sm whitespace-pre-wrap bg-black/30 p-4 rounded-xl border border-[#1F1F1F]">
                {lecture.transcript}
              </div>
            )}
            {activeTab === 'mindmap' && (
              lecture.mindmapCode ? (
                <Mermaid chart={lecture.mindmapCode} />
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-600 italic">
                  Mindmap being generated...
                </div>
              )
            )}
            {activeTab === 'diagram' && (
              lecture.diagramCode ? (
                <Mermaid chart={lecture.diagramCode} />
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-600 italic">
                  Diagram being generated...
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
