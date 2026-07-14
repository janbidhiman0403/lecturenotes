import React, { useState } from 'react';
import { Users, Plus, Hash, ArrowRight, CheckCircle2 } from 'lucide-react';
import { db, collection, addDoc, updateDoc, doc, arrayUnion, query, where, getDocs, Timestamp } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

interface ClassroomManagerProps {
  user: any;
  onClassroomJoined: () => void;
}

export const ClassroomManager: React.FC<ClassroomManagerProps> = ({ user, onClassroomJoined }) => {
  const [mode, setMode] = useState<'root' | 'create' | 'join'>('root');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleCreate = async () => {
    setLoading(true);
    try {
      const classCode = generateCode();
      await addDoc(collection(db, 'classrooms'), {
        name,
        code: classCode,
        teacherId: user.uid,
        students: [],
        createdAt: Timestamp.now()
      });
      onClassroomJoined();
      setMode('root');
    } catch (err) {
      setError('Failed to create classroom');
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'classrooms'), where('code', '==', code.toUpperCase()));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setError('Invalid classroom code');
      } else {
        const classroomDoc = snap.docs[0];
        await updateDoc(doc(db, 'classrooms', classroomDoc.id), {
          students: arrayUnion(user.uid)
        });
        onClassroomJoined();
        setMode('root');
      }
    } catch (err) {
      setError('Failed to join classroom');
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#0D0D0D] rounded-3xl p-8 border border-[#1F1F1F] shadow-2xl max-w-md w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
          <Users className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white">Classroom Manager</h2>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'root' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <button 
              onClick={() => setMode('join')}
              className="w-full flex items-center justify-between p-4 bg-black/40 hover:bg-blue-500/10 hover:border-blue-500/30 border border-[#1F1F1F] rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <Hash className="w-5 h-5 text-gray-600 group-hover:text-blue-400" />
                <div className="text-left">
                  <div className="font-bold text-white text-sm">Join a Classroom</div>
                  <div className="text-xs text-gray-500">Enter a code from your teacher</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400" />
            </button>

            {user.role === 'teacher' && (
              <button 
                onClick={() => setMode('create')}
                className="w-full flex items-center justify-between p-4 bg-black/40 hover:bg-green-500/10 hover:border-green-500/30 border border-[#1F1F1F] rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <Plus className="w-5 h-5 text-gray-600 group-hover:text-green-400" />
                  <div className="text-left">
                    <div className="font-bold text-white text-sm">Create New Class</div>
                    <div className="text-xs text-gray-500">Start sharing notes with students</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-green-400" />
              </button>
            )}
          </motion.div>
        )}

        {mode === 'create' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Classroom Name</label>
              <input 
                autoFocus
                className="w-full p-3 bg-black/40 border border-[#1F1F1F] text-white rounded-xl outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g. CS101 - Algorithms"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button 
              onClick={handleCreate}
              disabled={!name || loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
            >
              {loading ? 'Creating...' : 'Create Classroom'}
            </button>
            <button onClick={() => setMode('root')} className="w-full text-sm text-gray-500 font-medium">Cancel</button>
          </motion.div>
        )}

        {mode === 'join' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Classroom Code</label>
              <input 
                autoFocus
                className="w-full p-4 text-2xl font-mono tracking-widest text-center border-2 border-dashed border-[#1F1F1F] bg-black/40 text-white rounded-2xl outline-none focus:border-blue-500 uppercase"
                placeholder="ABC123"
                value={code}
                maxLength={6}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </div>
            {error && <div className="text-xs text-red-400 font-medium text-center">{error}</div>}
            <button 
              onClick={handleJoin}
              disabled={code.length < 6 || loading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-500/20"
            >
              {loading ? 'Joining...' : 'Join Classroom'}
            </button>
            <button onClick={() => setMode('root')} className="w-full text-sm text-gray-500 font-medium">Cancel</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
