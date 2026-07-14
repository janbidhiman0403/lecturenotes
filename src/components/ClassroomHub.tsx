import React, { useState } from 'react';
import { Monitor, Smartphone, Share2, Bluetooth, Check, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const ClassroomHub: React.FC = () => {
  const [devices, setDevices] = useState([
    { id: 1, name: 'Main Smartboard', type: 'display', status: 'connected' },
    { id: 2, name: 'Teacher Tablet', type: 'input', status: 'connected' },
  ]);
  const [isScanning, setIsScanning] = useState(false);

  const scan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setDevices(prev => [
        ...prev,
        { id: Math.random(), name: `Student Pad ${Math.floor(Math.random()*100)}`, type: 'input', status: 'available' }
      ]);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="p-6 bg-[#0D0D0D] rounded-3xl border border-[#1F1F1F] shadow-2xl max-w-sm w-full font-sans">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Monitor className="w-5 h-5 text-blue-400" />
          Classroom Hub
        </h3>
        <button 
          onClick={scan}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-blue-400"
          disabled={isScanning}
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-3">
        {devices.map(device => (
          <div key={device.id} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-[#1F1F1F]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1A1A1A] rounded-lg shadow-sm border border-[#2A2A2A]">
                {device.type === 'display' ? <Monitor className="w-4 h-4 text-gray-400" /> : <Smartphone className="w-4 h-4 text-gray-400" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{device.name}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-tighter">{device.status}</div>
              </div>
            </div>
            {device.status === 'connected' ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <button className="text-[10px] font-bold text-blue-400 hover:underline">PAIR</button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-[#1F1F1F]">
        <div className="bg-blue-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold">Live Broadcasting</span>
            <Share2 className="w-4 h-4 opacity-50" />
          </div>
          <p className="text-[10px] opacity-80 leading-relaxed mb-4">
            Teachers can broadcast the real-time transcript to all student devices and the main smartboard.
          </p>
          <button className="w-full bg-white text-blue-600 text-xs font-bold py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Start Broadcast
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-gray-700">
        <Bluetooth className="w-3 h-3" />
        <span className="text-[8px] uppercase font-bold tracking-widest">Scanning local classroom network...</span>
      </div>
    </div>
  );
};
