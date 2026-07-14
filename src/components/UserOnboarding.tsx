import React, { useState } from 'react';
import { UserCircle, GraduationCap, School, Check } from 'lucide-react';
import { db, doc, setDoc, Timestamp } from '../lib/firebase';
import { motion } from 'motion/react';

interface OnboardingProps {
  user: any;
  onComplete: (role: string) => void;
}

export const UserOnboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [role, setRole] = useState<'student' | 'teacher' | null>(null);
  const [institute, setInstitute] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!role) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role,
        instituteName: institute,
        createdAt: Timestamp.now()
      });
      onComplete(role);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#0D0D0D] rounded-3xl p-8 shadow-2xl border border-[#1F1F1F]"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-500/20">
            <UserCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome</h2>
          <p className="text-gray-500 text-sm mt-2">Let's set up your profile to personalize your experience.</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">I am a...</div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setRole('student')}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                role === 'student' ? 'border-blue-600 bg-blue-500/10 text-blue-400' : 'border-[#1F1F1F] text-gray-500 hover:border-[#2A2A2A]'
              }`}
            >
              <GraduationCap className="w-8 h-8" />
              <span className="font-bold text-sm">Student</span>
            </button>
            <button
              onClick={() => setRole('teacher')}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                role === 'teacher' ? 'border-blue-600 bg-blue-500/10 text-blue-400' : 'border-[#1F1F1F] text-gray-500 hover:border-[#2A2A2A]'
              }`}
            >
              <School className="w-8 h-8" />
              <span className="font-bold text-sm">Teacher</span>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Institute Name</label>
          <input
            className="w-full p-3 bg-black/40 border border-[#1F1F1F] text-white rounded-xl outline-none focus:border-blue-500 transition-colors"
            placeholder="e.g. Stanford University"
            value={institute}
            onChange={(e) => setInstitute(e.target.value)}
          />
        </div>

        <button
          onClick={handleComplete}
          disabled={!role || loading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-500/20"
        >
          {loading ? 'Setting up...' : 'Get Started'}
          <Check className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};
