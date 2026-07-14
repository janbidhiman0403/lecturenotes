import React, { useState } from 'react';
import { BookOpen, Hash, Plus, Settings, LogOut, ChevronRight, LayoutGrid, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  subjects: any[];
  classrooms: any[];
  activeSubject: string | null;
  activeClassroom: string | null;
  onSelectSubject: (id: string | null) => void;
  onSelectClassroom: (id: string | null) => void;
  onAddSubject: (name: string) => void;
  user: any;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  subjects, 
  classrooms,
  activeSubject, 
  activeClassroom,
  onSelectSubject, 
  onSelectClassroom,
  onAddSubject,
  user,
  onSignOut
}) => {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="w-72 h-full bg-[#0D0D0D] border-r border-[#1F1F1F] flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 text-blue-400 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-none">LectureNotes</span>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">{user.role}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">General</span>
            </div>
            <button
              onClick={() => {
                onSelectSubject(null);
                onSelectClassroom(null);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeSubject === null && activeClassroom === null
                  ? 'bg-blue-500/10 text-blue-400 font-medium' 
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="text-sm">Personal Notes</span>
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Classrooms</span>
            </div>
            <div className="space-y-1">
              {classrooms.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => onSelectClassroom(cls.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    activeClassroom === cls.id 
                      ? 'bg-blue-500/10 text-blue-400 font-medium' 
                      : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span className="text-sm truncate">{cls.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Subjects</span>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="p-1 hover:bg-white/5 rounded-md text-gray-500 hover:text-gray-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubject(sub.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl group transition-all ${
                    activeSubject === sub.id 
                      ? 'bg-blue-500/10 text-blue-400 font-medium' 
                      : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Hash className={`w-4 h-4 ${activeSubject === sub.id ? 'text-blue-400' : 'text-gray-500'}`} />
                    <span className="text-sm">{sub.name}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeSubject === sub.id ? 'text-blue-400' : 'text-gray-600'}`} />
                </button>
              ))}

              {isAdding && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-3 pt-2"
                >
                  <input
                    autoFocus
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                    placeholder="Subject name..."
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSubjectName) {
                        onAddSubject(newSubjectName);
                        setNewSubjectName('');
                        setIsAdding(false);
                      }
                    }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 bg-[#0A0A0A] border-t border-[#1F1F1F]">
        <div className="flex items-center gap-3 p-2 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
          <img src={user.photoURL} alt="" className="w-8 h-8 rounded-lg" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{user.displayName}</div>
            <div className="text-[10px] text-gray-400 truncate">{user.email}</div>
          </div>
          <button 
            onClick={onSignOut}
            className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
