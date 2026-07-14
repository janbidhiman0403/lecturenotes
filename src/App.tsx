import React, { useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  signInWithGoogle, 
  logOut, 
  onSnapshot, 
  query, 
  collection, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  Timestamp,
  doc
} from './lib/firebase';
import { transcribeAudio, processLecture } from './lib/gemini';
import { Sidebar } from './components/Sidebar';
import { AudioRecorder } from './components/AudioRecorder';
import { NoteView } from './components/NoteView';
import { ClassroomHub } from './components/ClassroomHub';
import { ClassroomManager } from './components/ClassroomManager';
import { UserOnboarding } from './components/UserOnboarding';
import { Plus, Search, BookOpen, Clock, Settings, Bell, Sparkles, X, Users, LayoutGrid, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [lectures, setLectures] = useState<any[]>([]);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [activeClassroom, setActiveClassroom] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLecture, setSelectedLecture] = useState<any>(null);
  const [showClassroomHub, setShowClassroomHub] = useState(false);
  const [showClassroomManager, setShowClassroomManager] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        // Fetch profile
        onSnapshot(doc(db, 'users', u.uid), (snap) => {
          if (snap.exists()) {
            setProfile(snap.data());
          } else {
            setProfile(null);
          }
        });
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user || !profile) return;

    const subjectsQuery = query(collection(db, 'subjects'), where('userId', '==', user.uid));
    const unsubSubjects = onSnapshot(subjectsQuery, (snap) => {
      setSubjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const classroomsQuery = profile.role === 'teacher'
      ? query(collection(db, 'classrooms'), where('teacherId', '==', user.uid))
      : query(collection(db, 'classrooms'), where('students', 'array-contains', user.uid));
    
    const unsubClassrooms = onSnapshot(classroomsQuery, (snap) => {
      setClassrooms(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    let lecturesQuery;
    if (activeClassroom) {
      // If classroom selected, show teacher's lectures for that classroom
      const teacherId = classrooms.find(c => c.id === activeClassroom)?.teacherId;
      lecturesQuery = query(collection(db, 'lectures'), where('userId', '==', teacherId), orderBy('date', 'desc'));
    } else if (activeSubject) {
      lecturesQuery = query(collection(db, 'lectures'), where('userId', '==', user.uid), where('subjectId', '==', activeSubject), orderBy('date', 'desc'));
    } else {
      lecturesQuery = query(collection(db, 'lectures'), where('userId', '==', user.uid), orderBy('date', 'desc'));
    }
    
    const unsubLectures = onSnapshot(lecturesQuery, (snap) => {
      setLectures(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubSubjects();
      unsubClassrooms();
      unsubLectures();
    };
  }, [user, profile, activeSubject, activeClassroom]);

  const handleAddSubject = async (name: string) => {
    if (!user) return;
    await addDoc(collection(db, 'subjects'), {
      name,
      userId: user.uid,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      createdAt: Timestamp.now()
    });
  };

  const handleRecordingComplete = async (blob: Blob) => {
    setIsRecording(false);
    setIsProcessing(true);

    try {
      // 1. Transcribe
      const transcript = await transcribeAudio(blob);
      
      // 2. Create lecture doc
      const lectureRef = await addDoc(collection(db, 'lectures'), {
        title: `Lecture ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        subjectId: activeSubject || null,
        userId: user.uid,
        date: Timestamp.now(),
        status: 'processing',
        transcript
      });

      // 3. AI Analysis
      const analysis = await processLecture(transcript);
      
      // 4. Update doc
      await updateDoc(doc(db, 'lectures', lectureRef.id), {
        ...analysis,
        status: 'completed'
      });

      setIsProcessing(false);
    } catch (err) {
      console.error("Failed to process recording:", err);
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-black">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-blue-500/20 rotate-3">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">LectureNotes AI</h1>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Record lectures, generate instant summaries, mindmaps, and study guides with Gemini AI.
          </p>
          <button
            onClick={signInWithGoogle}
            className="w-full bg-white text-gray-900 font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-[0.98] shadow-xl"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
            Sign in with Google
          </button>
          <div className="mt-8 text-xs text-gray-500 uppercase tracking-widest font-medium">
            Used by students and teachers alike
          </div>
        </motion.div>
      </div>
    );
  }

  if (user && !profile) {
    return <UserOnboarding user={user} onComplete={(role) => setProfile({ role })} />;
  }

  const filteredLectures = lectures.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.transcript?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden text-white">
      <Sidebar 
        subjects={subjects}
        classrooms={classrooms}
        activeSubject={activeSubject}
        activeClassroom={activeClassroom}
        onSelectSubject={(id) => {
          setActiveSubject(id);
          setActiveClassroom(null);
        }}
        onSelectClassroom={(id) => {
          setActiveClassroom(id);
          setActiveSubject(null);
        }}
        onAddSubject={handleAddSubject}
        user={{ ...user, role: profile?.role }}
        onSignOut={logOut}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#1F1F1F] px-8 py-4 flex items-center justify-between">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              placeholder="Search in your notes and lectures..."
              className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-sm text-white focus:bg-black focus:border-blue-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4 ml-6">
            {!isOnline && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg text-[10px] font-bold uppercase tracking-wider animate-pulse">
                <WifiOff className="w-3 h-3" />
                Offline Mode
              </div>
            )}
            <button 
              onClick={() => setShowClassroomManager(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-gray-300 rounded-xl text-xs font-bold hover:bg-[#252525] transition-colors"
            >
              <Users className="w-4 h-4" />
              Manage Classes
            </button>
            <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0A0A0A]" />
            </button>
            <button 
              onClick={() => {
                setIsRecording(true);
                setSelectedLecture(null);
              }}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Record Lecture</span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {showClassroomManager ? (
               <motion.div
                key="classroom-manager"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto pt-10"
              >
                <button 
                  onClick={() => setShowClassroomManager(false)}
                  className="mb-8 text-sm text-gray-500 hover:text-gray-300 flex items-center gap-2"
                >
                  &larr; Back to Dashboard
                </button>
                <ClassroomManager user={{ ...user, role: profile?.role }} onClassroomJoined={() => setShowClassroomManager(false)} />
              </motion.div>
            ) : isRecording || isProcessing ? (
              <motion.div
                key="recorder"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-md mx-auto mt-12"
              >
                <button 
                  onClick={() => setIsRecording(false)}
                  className="mb-8 text-sm text-gray-500 hover:text-gray-300 flex items-center gap-2"
                >
                  &larr; Cancel recording
                </button>
                <AudioRecorder 
                  isProcessing={isProcessing}
                  onRecordingComplete={handleRecordingComplete}
                />
              </motion.div>
            ) : selectedLecture ? (
              <motion.div
                key="lecture-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <button 
                  onClick={() => setSelectedLecture(null)}
                  className="mb-6 text-sm text-gray-500 hover:text-gray-300 flex items-center gap-2"
                >
                  &larr; Back to Dashboard
                </button>
                <NoteView lecture={selectedLecture} />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {activeSubject ? subjects.find(s => s.id === activeSubject)?.name : activeClassroom ? classrooms.find(c => c.id === activeClassroom)?.name : 'Recent Lectures'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Review your AI-powered lecture materials</p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#1A1A1A] p-1 rounded-lg">
                    <button className="px-3 py-1.5 bg-[#252525] shadow-sm rounded-md text-xs font-bold text-white border border-[#333]">Grid</button>
                    <button className="px-3 py-1.5 text-xs font-bold text-gray-500">List</button>
                  </div>
                </div>

                {filteredLectures.length === 0 ? (
                  <div className="bg-[#0D0D0D] rounded-3xl border border-dashed border-[#262626] p-20 text-center">
                    <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-gray-600 mx-auto mb-4">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white">No lectures found</h3>
                    <p className="text-gray-500 mt-1 max-w-xs mx-auto">Start recording your first lecture to see the magic of AI notes happening.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLectures.map((lecture) => (
                      <motion.div
                        layoutId={lecture.id}
                        key={lecture.id}
                        onClick={() => setSelectedLecture(lecture)}
                        className="bg-[#111111] p-6 rounded-2xl border border-[#262626] shadow-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-blue-500/50 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            lecture.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="text-[10px] uppercase font-bold tracking-tighter text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(lecture.date.seconds * 1000).toLocaleDateString()}
                            </div>
                            {lecture.userId !== user.uid && (
                              <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Teacher Note</span>
                            )}
                          </div>
                        </div>
                        <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                          {lecture.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                          {lecture.summary || 'Summary is being generated...'}
                        </p>
                        <div className="flex items-center gap-2">
                          {lecture.status === 'completed' ? (
                            <>
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold">MINDMAP</span>
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold">SUMMARY</span>
                            </>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 text-[10px] font-bold animate-pulse">PROCESSING</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Classroom Device Simulation Toggle */}
      <div className="fixed bottom-6 right-8 flex flex-col items-end gap-4 z-50">
        <AnimatePresence>
          {showClassroomHub && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
            >
              <div className="relative">
                <button 
                  onClick={() => setShowClassroomHub(false)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg z-10"
                >
                  <X className="w-3 h-3" />
                </button>
                <ClassroomHub />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setShowClassroomHub(!showClassroomHub)}
          className="bg-white text-black p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group"
        >
          <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform" />
        </button>
      </div>
    </div>
  );
}
