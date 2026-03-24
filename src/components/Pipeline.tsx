
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ImageIcon, 
  Search, 
  Binary, 
  Code, 
  Layers, 
  Cpu, 
  Terminal,
  ArrowRight,
  Settings,
  CheckCircle2,
  ShieldCheck,
  Zap,
  FileCode,
  Scan,
  Lock,
  ZoomIn,
  ZoomOut,
  Maximize
} from 'lucide-react';
import { SimulationState } from '../types';
import { STAGE_DESCRIPTIONS, PIPELINE_STAGES } from '../constants';
import ASTVisualizer from './ASTVisualizer';

interface PipelineProps {
  state: SimulationState;
  selectedImage: any;
}

const STAGES = [
  { id: 'SCANNING', label: 'Region Scan', icon: Scan, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'EXTRACTION', label: 'LSB Extract', icon: Search, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'DECRYPTION', label: 'Base64 Dec', icon: Lock, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { id: 'LEXICAL_ANALYSIS', label: 'Lexer', icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'SYNTAX_ANALYSIS', label: 'Parser', icon: Cpu, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { id: 'SEMANTIC_ANALYSIS', label: 'Semantic', icon: ShieldCheck, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'OPTIMIZATION', label: 'Optimizer', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 'CODE_GEN', label: 'Bytecode', icon: FileCode, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 'EXECUTION', label: 'VM Engine', icon: Settings, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'COMPLETED', label: 'Result', icon: Terminal, color: 'text-white', bg: 'bg-white/10' },
];

export default function Pipeline({ state, selectedImage }: PipelineProps) {
  const activeIndex = STAGES.findIndex(s => s.id === state.currentStage);
  const [zoom, setZoom] = React.useState(0.8);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.2));
  const handleResetZoom = () => setZoom(0.8);

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-slate-950">
      {/* Background Grid System */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }} />

      {/* Top Navigation / Status Bar */}
      <div className="sticky top-0 px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between z-50 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-4 min-w-max pr-8">
          {STAGES.map((stage, index) => {
            const isActive = state.currentStage === stage.id;
            const isPast = activeIndex > index;
            return (
              <div key={stage.id} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                  isActive ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 
                  isPast ? 'bg-slate-800 border-slate-700' : 'bg-transparent border-slate-800'
                }`}>
                  {isPast ? <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> : 
                   <stage.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-600'}`} />}
                </div>
                <div className="flex flex-col">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-600'}`}>
                    {stage.label}
                  </span>
                </div>
                {index < STAGES.length - 1 && <ArrowRight className="w-3 h-3 text-slate-800 mx-1" />}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] text-slate-500">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM_STABLE
          </span>
          <span className="w-px h-4 bg-slate-800" />
          <span>{new Date().toISOString()}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col items-center p-8 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-4xl text-center mb-12 shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentStage}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-center gap-3">
                {state.currentStage !== 'IDLE' && (
                  <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black rounded uppercase tracking-wider shadow-lg shadow-indigo-500/20">
                    Step {PIPELINE_STAGES.indexOf(state.currentStage) + 1} of {PIPELINE_STAGES.length}
                  </span>
                )}
                <h2 className="text-3xl font-black text-white tracking-tight uppercase italic drop-shadow-sm">{state.currentStage.replace('_', ' ')}</h2>
              </div>
              <p className="text-slate-400 text-sm font-medium max-w-2xl mx-auto leading-relaxed">
                {STAGE_DESCRIPTIONS[state.currentStage]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex-1 w-full flex items-center justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
          {state.currentStage === 'IDLE' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center gap-8 text-center"
            >
              <div className="space-y-2">
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                <Settings className="w-32 h-32 text-slate-800 animate-spin-slow relative z-10" />
              </div>
            </motion.div>
          )}

          {state.currentStage === 'SCANNING' && (
            <motion.div 
              key="scanning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center gap-12"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-blue-500/10 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-96 h-96 rounded-3xl border-2 border-slate-800 bg-slate-900 overflow-hidden shadow-2xl relative">
                  {selectedImage?.url ? (
                    <img src={selectedImage.url} alt="Source" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className={`w-full h-full ${selectedImage?.color}`} />
                  )}
                  
                  {/* Region Detection Overlay */}
                  {state.regionDetected && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute border-2 border-blue-400 bg-blue-400/10 shadow-[0_0_20px_rgba(96,165,250,0.5)] z-10"
                      style={{
                        top: `${state.regionDetected.y}%`,
                        left: `${state.regionDetected.x}%`,
                        width: `${state.regionDetected.width}%`,
                        height: `${state.regionDetected.height}%`
                      }}
                    >
                      <div className="absolute -top-6 left-0 bg-blue-400 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded uppercase">
                        Payload_Region_Detected
                      </div>
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />
                    </motion.div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[10px] font-mono text-blue-400 mb-1 font-bold">SCAN_BUFFER_01</p>
                    <p className="text-lg font-black text-white truncate">{selectedImage?.name}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map(i => (
                    <motion.div 
                      key={i}
                      className="w-12 h-1 bg-blue-500/20 rounded-full overflow-hidden"
                    >
                      <motion.div 
                        className="h-full bg-blue-500"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      />
                    </motion.div>
                  ))}
                </div>
                <p className="text-blue-400 font-mono text-[10px] font-bold uppercase tracking-[0.4em] animate-pulse">Neural Region Detection Active...</p>
              </div>
            </motion.div>
          )}

          {state.currentStage === 'EXTRACTION' && (
            <motion.div 
              key="extraction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center gap-16 px-16"
            >
              <div className="relative w-[400px] h-[400px] border-2 border-slate-800 rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
                {selectedImage?.url && (
                  <img src={selectedImage.url} alt="Scan" className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" referrerPolicy="no-referrer" />
                )}
                
                {/* Technical Overlay */}
                <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20">
                  {Array.from({ length: 400 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-slate-700" />
                  ))}
                </div>

                {/* Scanning Laser */}
                <motion.div 
                  className="absolute top-0 left-0 w-full h-1 bg-amber-500 z-20 shadow-[0_0_20px_rgba(245,158,11,1)]"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Data Points */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-amber-400 rounded-full z-30"
                    initial={{ 
                      top: `${Math.random() * 100}%`, 
                      left: `${Math.random() * 100}%`,
                      opacity: 0 
                    }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.5, 0.5]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: Math.random() * 2 
                    }}
                  />
                ))}
              </div>

              <div className="flex-1 max-w-md space-y-8">
                <div className="space-y-2">
                  <h3 className="text-amber-400 font-mono text-xs font-black uppercase tracking-[0.3em]">Raw Bitstream Extraction</h3>
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-amber-500"
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-8 gap-3">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.01 }}
                      className="w-8 h-8 bg-slate-900 border border-slate-800 rounded flex items-center justify-center font-mono text-[10px] text-amber-500 font-bold"
                    >
                      {state.rawBinary[Math.floor(i / 8)]?.[i % 8] || Math.round(Math.random())}
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <p className="text-[10px] font-mono text-slate-500 uppercase mb-2">LSB_SCAN_TELEMETRY</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-400">BIT_RATE:</span>
                      <span className="text-amber-400">128 KB/S</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-400">PARITY_CHECK:</span>
                      <span className="text-amber-400">PASSED</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {state.currentStage === 'DECRYPTION' && (
            <motion.div 
              key="decode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-5xl flex flex-col gap-8"
            >
              {/* Transformation Visualization */}
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {state.decodedText.split('').slice(0, 16).map((char, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center gap-2 shadow-xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/20 group-hover:bg-indigo-500 transition-colors" />
                    <div className="text-center">
                      <p className="text-[6px] font-mono text-slate-500 uppercase tracking-widest">B64_SEG</p>
                      <p className="text-2xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{char}</p>
                    </div>
                    <div className="w-full h-px bg-slate-800" />
                    <div className="text-center">
                      <p className="text-[6px] font-mono text-indigo-500/60 uppercase">BIN_MAP</p>
                      <p className="text-[8px] font-mono text-indigo-400 font-bold">{char.charCodeAt(0).toString(2).padStart(8, '0')}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl backdrop-blur-sm">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Base64_Encoded_Payload</p>
                    <Binary className="w-4 h-4 text-indigo-500/40" />
                  </div>
                  <div className="h-40 overflow-y-auto custom-scrollbar pr-2 bg-black/40 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-sm font-mono text-slate-300 leading-relaxed break-all tracking-wider">
                      {state.decodedText}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl relative overflow-hidden shadow-2xl backdrop-blur-sm">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Decoded_Source_Code</p>
                    <Code className="w-4 h-4 text-emerald-500/40" />
                  </div>
                  <div className="h-40 overflow-y-auto custom-scrollbar pr-2 bg-black/40 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-sm font-mono text-emerald-50 font-medium leading-relaxed break-all">
                      {state.recoveredCode}
                      <motion.span 
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-emerald-500 ml-1 translate-y-0.5"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {state.currentStage === 'LEXICAL_ANALYSIS' && (
            <motion.div 
              key="lexer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full h-full flex flex-col gap-8 p-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Search className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Lexical Scanning</h3>
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Converting source to token stream</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-800">
                  <div className="text-center">
                    <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Tokens Found</p>
                    <p className="text-xl font-black text-indigo-400 font-mono">{state.tokens.length}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-800" />
                  <div className="text-center">
                    <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Scan Speed</p>
                    <p className="text-xl font-black text-emerald-400 font-mono">FAST</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">
                {/* Source Code View */}
                <div className="col-span-7 bg-slate-900/80 border border-slate-800 rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative">
                  <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">source_buffer.txt</span>
                  </div>
                  <div className="flex-1 p-8 font-mono text-xl text-slate-300 overflow-y-auto custom-scrollbar relative">
                    <div className="space-y-4">
                      {state.recoveredCode.split(';').map((line, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-8 group"
                        >
                          <span className="text-slate-700 text-sm w-6 text-right select-none">{i + 1}</span>
                          <span className="text-indigo-100 group-hover:text-white transition-colors">
                            {line.trim()}{line.trim() ? ';' : ''}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                    {/* Scanning Laser Effect */}
                    <motion.div 
                      className="absolute left-0 right-0 h-12 bg-indigo-500/10 border-y border-indigo-500/30 pointer-events-none z-20"
                      animate={{ top: ['0%', '90%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </div>

                {/* Token Stream View */}
                <div className="col-span-5 flex flex-col gap-4 min-h-0">
                  <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-[32px] p-6 flex flex-col shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-indigo-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">Token_Stream_Output</h3>
                      <div className="px-2 py-0.5 bg-indigo-500/10 rounded text-[8px] text-indigo-400 font-black uppercase">Live_Feed</div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-3">
                      <AnimatePresence mode="popLayout">
                        {state.tokens.map((t, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: 50, opacity: 0, scale: 0.9 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            transition={{ 
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                              delay: i * 0.02 
                            }}
                            className="p-4 bg-slate-950/50 border border-slate-800/50 rounded-2xl flex items-center justify-between group hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all shadow-lg"
                          >
                            <div className="flex flex-col">
                              <span className="text-[7px] font-black text-indigo-500 uppercase tracking-widest mb-1">Type</span>
                              <span className="text-[10px] font-black text-white uppercase tracking-tighter">{t.type}</span>
                            </div>
                            <div className="h-8 w-px bg-slate-800 mx-4" />
                            <div className="flex-1 flex flex-col items-end">
                              <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Value</span>
                              <span className="text-sm font-bold text-indigo-300 font-mono truncate max-w-[120px]">{t.value}</span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {state.currentStage === 'SYNTAX_ANALYSIS' && (
            <motion.div 
              key="parser"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full h-full flex flex-col items-center gap-12"
            >
              <div className="flex-1 w-full max-w-6xl bg-slate-900/40 border border-slate-800 rounded-[40px] relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                <div className="h-full w-full overflow-auto custom-scrollbar p-12">
                  <motion.div 
                    animate={{ scale: zoom }}
                    className="min-w-max flex items-center justify-center min-h-full origin-top"
                  >
                    <ASTVisualizer node={state.ast} />
                  </motion.div>
                </div>
                
                {/* Technical HUD */}
                <div className="absolute top-12 left-12 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-pink-500 animate-ping absolute" />
                    <div className="w-4 h-4 rounded-full bg-pink-500" />
                    <span className="text-xs font-mono text-pink-500 font-black uppercase tracking-[0.3em]">AST_GENERATION_ACTIVE</span>
                  </div>
                  <div className="p-6 bg-pink-500/10 border-2 border-pink-500/30 rounded-2xl space-y-3 backdrop-blur-md">
                    <p className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-widest">Parser_Metrics</p>
                    <div className="flex justify-between text-xs font-mono gap-12">
                      <span className="text-slate-500">NODE_COUNT:</span>
                      <span className="text-pink-400 font-black">32</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono gap-12">
                      <span className="text-slate-500">MAX_DEPTH:</span>
                      <span className="text-pink-400 font-black">5</span>
                    </div>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-2 rounded-xl backdrop-blur-sm">
                    <button 
                      onClick={handleZoomOut}
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleResetZoom}
                      className="px-3 py-1 text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
                      title="Reset Zoom"
                    >
                      {Math.round(zoom * 100)}%
                    </button>
                    <button 
                      onClick={handleZoomIn}
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-800 mx-1" />
                    <button 
                      onClick={() => setZoom(0.3)}
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="Fit Whole Structure"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {state.currentStage === 'SEMANTIC_ANALYSIS' && (
            <motion.div 
              key="semantic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl flex flex-col gap-8"
            >
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
                  <h3 className="text-cyan-400 font-mono text-xs font-black uppercase tracking-[0.3em]">Validation_Checklist</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Variable Declaration Check', status: 'PASSED' },
                      { label: 'Type Compatibility Scan', status: 'PASSED' },
                      { label: 'Scope Integrity Verification', status: 'PASSED' },
                      { label: 'Operator Overload Check', status: 'PASSED' },
                      { label: 'Control Flow Analysis', status: 'PASSED' }
                    ].map((check, i) => (
                      <motion.div 
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl"
                      >
                        <span className="text-xs text-slate-300 font-medium">{check.label}</span>
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{check.status}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center gap-6">
                  <div className="w-24 h-24 rounded-full border-4 border-cyan-500/20 flex items-center justify-center relative">
                    <motion.div 
                      className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <ShieldCheck className="w-10 h-10 text-cyan-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-black text-white uppercase italic">Semantic Integrity Verified</p>
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">No Type Violations Detected</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {state.currentStage === 'OPTIMIZATION' && (
            <motion.div 
              key="optimization"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-7xl flex flex-col gap-8"
            >
              <div className="flex items-center justify-between px-8">
                <div className="space-y-1">
                  <h3 className="text-yellow-400 font-mono text-sm font-black uppercase tracking-[0.4em]">Optimization_Engine_V4</h3>
                  <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Constant Folding & Dead Code Elimination Active</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-2 rounded-xl backdrop-blur-sm">
                    <button 
                      onClick={handleZoomOut}
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleResetZoom}
                      className="px-3 py-1 text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
                      title="Reset Zoom"
                    >
                      {Math.round(zoom * 100)}%
                    </button>
                    <button 
                      onClick={handleZoomIn}
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-800 mx-1" />
                    <button 
                      onClick={() => setZoom(0.3)}
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="Fit Whole Structure"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 bg-yellow-400/10 border border-yellow-400/20 px-6 py-3 rounded-2xl">
                    <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Efficiency_Gain</span>
                      <span className="text-lg font-black text-yellow-400 font-mono">+24.8%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black">Original_AST_Structure</p>
                    <span className="text-[8px] font-mono text-slate-600 uppercase">Pre-Optimization</span>
                  </div>
                  <div className="h-[600px] bg-slate-900/60 border-2 border-slate-800 rounded-[40px] overflow-hidden relative group">
                    <div className="h-full w-full overflow-auto custom-scrollbar p-8">
                      <motion.div 
                        animate={{ scale: zoom }}
                        className="min-w-max origin-top transform"
                      >
                        <ASTVisualizer node={state.ast} />
                      </motion.div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <p className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest font-black">Optimized_AST_Structure</p>
                    <span className="text-[8px] font-mono text-yellow-600 uppercase">Post-Optimization</span>
                  </div>
                  <div className="h-[600px] bg-yellow-500/5 border-2 border-yellow-500/30 rounded-[40px] overflow-hidden relative group">
                    <div className="h-full w-full overflow-auto custom-scrollbar p-8">
                      <motion.div 
                        animate={{ scale: zoom }}
                        className="min-w-max origin-top transform"
                      >
                        <ASTVisualizer node={state.optimizedAst || state.ast} />
                      </motion.div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-yellow-950/20 to-transparent pointer-events-none" />
                    <motion.div 
                      className="absolute top-8 right-8"
                      animate={{ scale: [1, 1.3, 1], rotate: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {state.currentStage === 'CODE_GEN' && (
            <motion.div 
              key="codegen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl flex flex-col gap-8"
            >
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <FileCode className="w-12 h-12 text-orange-500/20" />
                </div>
                <h3 className="text-orange-400 font-mono text-xs font-black uppercase tracking-[0.3em] mb-6">Generated_Virtual_Machine_Bytecode</h3>
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                    {state.bytecode.slice(0, 8).map((instr, i) => (
                      <motion.div 
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-4 font-mono"
                      >
                        <span className="text-slate-700 text-[10px] w-8">{i.toString(16).padStart(4, '0')}</span>
                        <span className="text-orange-400 font-bold uppercase text-sm">{instr.op}</span>
                        <span className="text-slate-400 text-xs">{instr.value !== undefined ? instr.value : (instr.name || '')}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {state.bytecode.slice(8).map((instr, i) => (
                      <motion.div 
                        key={i + 8}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: (i + 8) * 0.05 }}
                        className="flex items-center gap-4 font-mono"
                      >
                        <span className="text-slate-700 text-[10px] w-8">{(i + 8).toString(16).padStart(4, '0')}</span>
                        <span className="text-orange-400 font-bold uppercase text-sm">{instr.op}</span>
                        <span className="text-slate-400 text-xs">{instr.value !== undefined ? instr.value : (instr.name || '')}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-1 bg-orange-500/20"
                  animate={{ scaleX: [0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          )}
          {state.currentStage === 'EXECUTION' && (
            <motion.div 
              key="execution"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-16"
            >
              <div className="relative">
                {/* Core Engine Visual */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-48 h-48 border-2 border-dashed border-emerald-500/30 rounded-full flex items-center justify-center relative"
                >
                  <div className="w-32 h-32 bg-emerald-500/5 rounded-full flex items-center justify-center border border-emerald-500/20 backdrop-blur-sm">
                    <Cpu className="w-16 h-16 text-emerald-500 animate-pulse" />
                  </div>
                  
                  {/* Orbital Nodes */}
                  {[0, 90, 180, 270].map(deg => (
                    <motion.div 
                      key={deg}
                      className="absolute w-4 h-4 bg-emerald-500 rounded-lg border-2 border-white"
                      style={{ transform: `rotate(${deg}deg) translateX(96px)` }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: deg / 90 * 0.5 }}
                    />
                  ))}
                </motion.div>

                {/* Data Flow Particles */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1 h-1 bg-emerald-400 rounded-full"
                    animate={{ 
                      x: [0, (Math.random() - 0.5) * 400],
                      y: [0, (Math.random() - 0.5) * 400],
                      opacity: [1, 0],
                      scale: [1, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.1,
                      ease: "circOut"
                    }}
                  />
                ))}
              </div>
              
              <div className="flex flex-col items-center gap-6">
                <div className="bg-slate-900 px-10 py-4 rounded-2xl border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                  <div className="text-emerald-400 font-mono text-sm font-black uppercase tracking-[0.4em] flex items-center gap-4">
                    <Settings className="w-5 h-5 animate-spin-slow" />
                    Virtualized Execution Active
                  </div>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      className="w-2 h-2 rounded-full bg-emerald-500"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {state.currentStage === 'COMPLETED' && (
            <motion.div 
              key="completed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-12"
            >
              <div className="relative">
                <motion.div 
                  className="absolute -inset-12 bg-emerald-500/20 blur-[100px] rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="w-32 h-32 bg-emerald-500 rounded-[40px] flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.5)] relative z-10">
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Process Finalized</h2>
                <p className="text-slate-500 font-mono text-sm uppercase tracking-[0.4em]">Payload Execution Result:</p>
                <div className="px-12 py-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl">
                  <span className="text-5xl font-black text-emerald-400 font-mono drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                    {state.output}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ArrowDown(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
  );
}
