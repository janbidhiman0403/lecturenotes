import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  isProcessing: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required to record lectures.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-[#0D0D0D] rounded-3xl border border-[#1F1F1F] shadow-2xl">
      <div className="text-sm font-mono text-gray-600 uppercase tracking-widest">
        {isRecording ? 'Recording Live' : isProcessing ? 'AI Processing' : 'System Ready'}
      </div>

      <AnimatePresence mode="wait">
        {isRecording ? (
          <motion.div
            key="recording"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red-500 rounded-full blur-2xl"
              />
              <button
                id="stop-recording-btn"
                onClick={stopRecording}
                className="relative z-10 w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all shadow-lg"
              >
                <Square className="w-8 h-8 fill-current" />
              </button>
            </div>
            <div className="text-3xl font-mono font-medium text-white">{formatTime(recordingTime)}</div>
          </motion.div>
        ) : isProcessing ? (
          <motion.div
            key="processing"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 shadow-inner">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <div className="text-center">
              <div className="font-bold text-white">Transcribing...</div>
              <div className="text-xs text-gray-500">Processing audio data</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <button
              id="start-recording-btn"
              onClick={startRecording}
              className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 group"
            >
              <Mic className="w-10 h-10 group-hover:scale-110 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
