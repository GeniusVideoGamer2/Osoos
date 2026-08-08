import React, { useState, useEffect } from 'react';
import {
  X,
  Minus,
  Maximize2,
  CheckCircle2,
  Download,
  Folder,
  Shield,
  Zap,
  Check,
  HardDrive,
  Cpu,
  Monitor,
  Sparkles,
  ArrowRight,
  Terminal,
  Play,
  Layers,
  ChevronRight,
  Globe
} from 'lucide-react';
import { IstekLogo } from './IstekLogo';

interface SetupInstallerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchApp?: () => void;
  isPageMode?: boolean;
}

export const SetupInstallerModal: React.FC<SetupInstallerModalProps> = ({
  isOpen,
  onClose,
  onLaunchApp,
  isPageMode = false,
}) => {
  const [step, setStep] = useState<number>(1);
  const [installPath, setInstallPath] = useState<string>('C:\\Program Files\\ISTEK BROWSER');
  const [installProgress, setInstallProgress] = useState<number>(0);
  const [installing, setInstalling] = useState<boolean>(false);
  const [installLog, setInstallLog] = useState<string[]>([]);
  const [isWindowMaximized, setIsWindowMaximized] = useState<boolean>(false);

  // Installation feature toggles
  const [features, setFeatures] = useState({
    chromeEngine: true,
    openTube: true,
    ytMetadata: true,
    istekShields: true,
    desktopShortcut: true,
  });

  const runInstallation = () => {
    setInstalling(true);
    setInstallProgress(0);
    setInstallLog(['[INIT] Starting ISTEK BROWSER.exe macOS Tahoe 26 Liquid Installer...']);

    const logs = [
      '[1/6] Allocating V8 Engine & Chrome 124 runtime buffers...',
      '[2/6] Binding Windows 11/10 TCP/IP network adapters...',
      '[3/6] Deploying OpenTube ad-block stream extractors...',
      '[4/6] Registering mattwright324 YouTube metadata parsing APIs...',
      '[5/6] Writing ISTEK Shields aggressive tracker filter list...',
      '[6/6] Finalizing Liquid Glass UI assets and shortcut handlers...',
      '[SUCCESS] ISTEK BROWSER v1.0.0 installed successfully!',
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setInstallProgress(Math.min(100, Math.round((current / logs.length) * 100)));
      if (current <= logs.length) {
        setInstallLog((prev) => [...prev, logs[current - 1]]);
      }

      if (current >= logs.length) {
        clearInterval(interval);
        setInstalling(false);
        setStep(4);
      }
    }, 600);
  };

  if (!isOpen && !isPageMode) return null;

  const containerClasses = isPageMode
    ? 'w-full min-h-[calc(100vh-80px)] p-4 sm:p-8 flex items-center justify-center bg-slate-950 select-none'
    : 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 select-none animate-fadeIn';

  return (
    <div className={containerClasses}>
      {/* Liquid Glass macOS Tahoe 26 Window Container */}
      <div
        className={`relative w-full transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/95 backdrop-blur-3xl text-slate-100 flex flex-col ${
          isPageMode || isWindowMaximized ? 'max-w-4xl min-h-[580px]' : 'max-w-2xl min-h-[520px]'
        }`}
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
        }}
      >
        {/* macOS Tahoe 26 Liquid Glass Titlebar */}
        <div className="h-12 px-4 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0 backdrop-blur-md">
          {/* macOS Tahoe 26 Traffic Light Window Controls */}
          <div className="flex items-center gap-2 group">
            {/* Close Button (Red Liquid Glass) */}
            <button
              onClick={onClose}
              className="relative w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 border border-red-400/50 flex items-center justify-center text-red-950 font-black hover:scale-110 active:scale-95 transition-all shadow-sm shadow-red-500/50"
              title="Close Setup"
            >
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full blur-[0.5px]" />
              <X className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Minimize Button (Yellow Liquid Glass) */}
            <button
              onClick={onClose}
              className="relative w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border border-amber-300/50 flex items-center justify-center text-amber-950 font-black hover:scale-110 active:scale-95 transition-all shadow-sm shadow-amber-500/50"
              title="Minimize Setup"
            >
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full blur-[0.5px]" />
              <Minus className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Fullscreen / Expand Button (Green Liquid Glass) */}
            <button
              onClick={() => setIsWindowMaximized(!isWindowMaximized)}
              className="relative w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 border border-emerald-300/50 flex items-center justify-center text-emerald-950 font-black hover:scale-110 active:scale-95 transition-all shadow-sm shadow-emerald-500/50"
              title="Toggle Fullscreen Setup"
            >
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full blur-[0.5px]" />
              <Maximize2 className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Setup Window Title */}
          <div className="flex items-center gap-2 text-xs font-black tracking-wide text-slate-200">
            <IstekLogo variant="chrome" size={18} />
            <span>ISTEK BROWSER Setup Installer — Mersin İstek Okulları</span>
          </div>

          <div className="text-[10px] font-mono text-slate-400 font-bold bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
            v1.0.0 Setup (.exe)
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
          {/* Step 1: Welcome & Compatibility Check */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-1 shadow-2xl shadow-blue-500/30 shrink-0 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
                    <IstekLogo variant="chrome" size={56} />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Welcome to ISTEK BROWSER Setup</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Official Installer for Windows 11/10 & macOS. Powered by Chromium Engine & Mersin İstek Okulları.
                  </p>
                </div>
              </div>

              {/* System Specs Check Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">OS Compatibility</span>
                  <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Windows 11/10 Ready
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Network Adapter</span>
                  <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> TCP/IP Connected
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">YouTube Engine</span>
                  <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> OpenTube & API Active
                  </div>
                </div>
              </div>

              {/* Install Path Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Installation Folder:</label>
                <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-white/10">
                  <Folder className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />
                  <input
                    type="text"
                    value={installPath}
                    onChange={(e) => setInstallPath(e.target.value)}
                    className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                  />
                  <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 rounded-xl border border-white/10 transition-colors shrink-0">
                    Browse...
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Feature Selection */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-black text-white">Select Installation Components</h2>
                <p className="text-xs text-slate-400 mt-1">Choose optional features to include in your installation.</p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: 'chromeEngine',
                    title: 'Chromium 124 Core Engine & User-Agent',
                    desc: 'Optimized rendering speed and full compatibility for YouTube, Google, and web apps.',
                    recommended: true,
                  },
                  {
                    key: 'openTube',
                    title: 'OpenTube Ad-Free Player (jnsougata/opentube)',
                    desc: 'Zero ads, background audio mode, subtitle extraction, and stream parser.',
                    recommended: true,
                  },
                  {
                    key: 'ytMetadata',
                    title: 'YouTube Metadata Inspector (mattwright324)',
                    desc: 'Extract high-res thumbnails, tags, timestamps, views, and raw JSON.',
                    recommended: true,
                  },
                  {
                    key: 'istekShields',
                    title: 'ISTEK Shields Privacy Engine',
                    desc: 'Aggressive tracker blocking, HTTPS upgrading, and fingerprint shield.',
                    recommended: true,
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => setFeatures({ ...features, [item.key]: !(features as any)[item.key] })}
                    className="flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(features as any)[item.key]}
                      onChange={() => {}}
                      className="mt-0.5 w-4 h-4 rounded accent-cyan-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                        {item.recommended && (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Installation Progress */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-white">Installing ISTEK BROWSER.exe</h2>
                <p className="text-xs text-slate-400 mt-1">Deploying liquid glass assets, Chrome runtime, and YouTube APIs...</p>
              </div>

              {/* Liquid Glass Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold font-mono">
                  <span className="text-cyan-400">Progress</span>
                  <span className="text-white">{installProgress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full border border-white/10 overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/50"
                    style={{ width: `${installProgress}%` }}
                  />
                </div>
              </div>

              {/* Terminal Log */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-white/10 font-mono text-[11px] text-slate-300 space-y-1 h-36 overflow-y-auto">
                {installLog.map((log, i) => (
                  <div key={i} className="leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Installation Finished */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-600 to-sky-400 p-1 mx-auto shadow-2xl shadow-blue-500/40 animate-bounce flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                  <IstekLogo variant="chrome" size={68} />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">Installation Complete!</h2>
                <p className="text-xs text-slate-200 max-w-md mx-auto mt-1 font-medium">
                  ISTEK BROWSER.exe has been installed with desktop shortcuts and Mersin İstek Okulları Chrome branding.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Check className="w-4 h-4" /> YouTube streaming verified with zero ads
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Check className="w-4 h-4" /> OpenTube & YouTube Metadata API enabled
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Check className="w-4 h-4" /> Network connection active for Windows 11/10
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {step < 3 ? (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl border border-white/10 transition-colors"
              >
                Cancel
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              {step === 1 && (
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-1.5"
                >
                  <span>Next: Components</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 2 && (
                <button
                  onClick={runInstallation}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Now</span>
                </button>
              )}

              {step === 4 && (
                <div className="flex items-center gap-2">
                  <a
                    href="/api/download-zip"
                    download="istek-browser-source.zip"
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Download Source (.ZIP)</span>
                  </a>
                  <button
                    onClick={() => {
                      onClose();
                      if (onLaunchApp) onLaunchApp();
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-xl shadow-cyan-500/40 transition-all flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Launch ISTEK BROWSER</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
