/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Play, 
  RefreshCw, 
  Code, 
  Cpu, 
  Binary, 
  Search, 
  ChevronRight,
  Terminal,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  StepForward,
  Info
} from 'lucide-react';
import { SimulationState, Stage, Token, ASTNode } from './types';
import { 
  executeBytecode,
  Instruction
} from './lib/vm';
import { STAGE_DESCRIPTIONS, PIPELINE_STAGES } from './constants';
import { 
  tokenize, 
  parse, 
  semanticAnalysis, 
  optimize, 
  generateBytecode 
} from './lib/compiler';
import { 
  stringToBinary, 
  binaryToString, 
  encodeDualLayer, 
  decodeDualLayer, 
  detectRegion, 
  simulateExtraction 
} from './lib/stego';

// Components
import Pipeline from './components/Pipeline';
import ImagePanel from './components/ImagePanel';
import ResultsPanel from './components/ResultsPanel';

const SAMPLE_IMAGES = [
  { 
    id: 'mission_brief', 
    name: 'mission_brief_01.png', 
    code: 'LET x = 10; LET y = x * 2; IF y > 15 THEN PRINT "ALERT: Threshold Exceeded"; PRINT y END', 
    color: 'bg-indigo-600',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'satellite', 
    name: 'satellite_data_alpha.jpg', 
    code: 'LET base = 100; LET offset = 2 + 3; PRINT "Target Offset:"; PRINT base + offset', 
    color: 'bg-emerald-600',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'recon', 
    name: 'recon_scan_77.webp', 
    code: 'LET status = 1; IF status == 1 THEN PRINT "System Online" END; PRINT "Scanning..." ', 
    color: 'bg-rose-600',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'signal', 
    name: 'signal_processor.sys', 
    code: 'LET freq = 440; LET amp = 2; LET res = freq * amp / 4; PRINT res', 
    color: 'bg-blue-600',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
];

export default function App() {
  const [state, setState] = useState<SimulationState>({
    currentStage: 'IDLE',
    progress: 0,
    rawBinary: [],
    binaryStream: [],
    decodedText: '',
    recoveredCode: '',
    tokens: [],
    ast: null,
    optimizedAst: null,
    bytecode: [],
    output: [],
    errors: [],
    regionDetected: null,
  });

  const [selectedImage, setSelectedImage] = useState<typeof SAMPLE_IMAGES[0] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStepping, setIsStepping] = useState(false);

  const resetSimulation = () => {
    setState({
      currentStage: 'IDLE',
      progress: 0,
      rawBinary: [],
      binaryStream: [],
      decodedText: '',
      recoveredCode: '',
      tokens: [],
      ast: null,
      optimizedAst: null,
      bytecode: [],
      output: [],
      errors: [],
      regionDetected: null,
    });
    setIsProcessing(false);
    setIsStepping(false);
  };

  const runStage = async (stage: Stage) => {
    try {
      switch (stage) {
        case 'SCANNING':
          setState(s => ({ ...s, currentStage: 'SCANNING', progress: 10 }));
          const region = await detectRegion();
          setState(s => ({ ...s, regionDetected: region }));
          break;
        case 'EXTRACTION':
          setState(s => ({ ...s, currentStage: 'EXTRACTION', progress: 20 }));
          const encoded = encodeDualLayer(selectedImage!.code);
          const binary = await simulateExtraction(encoded, (bit) => {
            setState(s => ({ ...s, binaryStream: [...s.binaryStream.slice(-31), bit] }));
          });
          setState(s => ({ ...s, rawBinary: binary }));
          break;
        case 'DECRYPTION':
          setState(s => ({ ...s, currentStage: 'DECRYPTION', progress: 30 }));
          const decoded = binaryToString(state.rawBinary.length > 0 ? state.rawBinary : stringToBinary(encodeDualLayer(selectedImage!.code)));
          const code = decodeDualLayer(decoded);
          setState(s => ({ ...s, decodedText: decoded, recoveredCode: code }));
          break;
        case 'LEXICAL_ANALYSIS':
          setState(s => ({ ...s, currentStage: 'LEXICAL_ANALYSIS', progress: 40 }));
          const tokens = tokenize(state.recoveredCode || selectedImage!.code);
          setState(s => ({ ...s, tokens }));
          break;
        case 'SYNTAX_ANALYSIS':
          setState(s => ({ ...s, currentStage: 'SYNTAX_ANALYSIS', progress: 50 }));
          const ast = parse(state.tokens.length > 0 ? state.tokens : tokenize(state.recoveredCode || selectedImage!.code));
          setState(s => ({ ...s, ast }));
          break;
        case 'SEMANTIC_ANALYSIS':
          setState(s => ({ ...s, currentStage: 'SEMANTIC_ANALYSIS', progress: 60 }));
          const semErrors = semanticAnalysis(state.ast || parse(state.tokens.length > 0 ? state.tokens : tokenize(state.recoveredCode || selectedImage!.code)));
          if (semErrors.length > 0) {
            setState(s => ({ ...s, errors: semErrors }));
            throw new Error(semErrors[0]);
          }
          break;
        case 'OPTIMIZATION':
          setState(s => ({ ...s, currentStage: 'OPTIMIZATION', progress: 70 }));
          const optimizedAst = optimize(state.ast || parse(state.tokens.length > 0 ? state.tokens : tokenize(state.recoveredCode || selectedImage!.code)));
          setState(s => ({ ...s, optimizedAst }));
          break;
        case 'CODE_GEN':
          setState(s => ({ ...s, currentStage: 'CODE_GEN', progress: 85 }));
          const bytecode = generateBytecode(state.optimizedAst || state.ast || parse(state.tokens.length > 0 ? state.tokens : tokenize(state.recoveredCode || selectedImage!.code)));
          setState(s => ({ ...s, bytecode }));
          break;
        case 'EXECUTION':
          setState(s => ({ ...s, currentStage: 'EXECUTION', progress: 95 }));
          const bc = state.bytecode.length > 0 ? state.bytecode : generateBytecode(state.optimizedAst || state.ast || parse(state.tokens.length > 0 ? state.tokens : tokenize(state.recoveredCode || selectedImage!.code)));
          const output = executeBytecode(bc);
          setState(s => ({ ...s, output }));
          break;
        case 'COMPLETED':
          setState(s => ({ ...s, currentStage: 'COMPLETED', progress: 100 }));
          break;
      }
    } catch (err: any) {
      setState(s => ({ ...s, errors: [err.message] }));
      throw err;
    }
  };

  const startSimulation = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    setIsStepping(false);
    
    try {
      for (const stage of PIPELINE_STAGES) {
        await runStage(stage);
        await wait(stage === 'EXTRACTION' || stage === 'LEXICAL_ANALYSIS' ? 2000 : 1000);
      }
    } catch (err) {
      // Error handled in runStage
    } finally {
      setIsProcessing(false);
    }
  };

  const stepSimulation = async () => {
    if (!selectedImage) return;
    
    const currentIndex = PIPELINE_STAGES.indexOf(state.currentStage);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < PIPELINE_STAGES.length) {
      setIsStepping(true);
      setIsProcessing(true);
      await runStage(PIPELINE_STAGES[nextIndex]);
      setIsProcessing(false);
    } else if (state.currentStage === 'IDLE') {
      setIsStepping(true);
      setIsProcessing(true);
      await runStage(PIPELINE_STAGES[0]);
      setIsProcessing(false);
    }
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const isLastStage = state.currentStage === 'COMPLETED';
  const isIdle = state.currentStage === 'IDLE';

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/10 border border-indigo-400/20">
              <Terminal className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-white uppercase italic">StegoCore v3.1</h1>
              <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-[0.3em] font-bold">Advanced Payload Extraction Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={resetSimulation}
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-white border border-transparent hover:border-slate-700"
              title="Reset System"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing && !isStepping ? 'animate-spin' : ''}`} />
              <span className="text-xs font-mono uppercase tracking-widest">Reset</span>
            </button>
            
            <div className="h-10 w-px bg-slate-800" />

            <button 
              onClick={startSimulation}
              disabled={!selectedImage || isProcessing}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-2xl ${
                !selectedImage || isProcessing 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 active:scale-95 border border-indigo-400/30'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              AUTO-SEQUENCE
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-8 flex gap-8 h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Panel: Source Selection */}
        <AnimatePresence>
          {(isIdle || isLastStage) && (
            <motion.div 
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="w-80 flex flex-col gap-8 h-full overflow-hidden shrink-0"
            >
              <ImagePanel 
                selectedImage={selectedImage} 
                onSelect={(img) => {
                  resetSimulation();
                  setSelectedImage(img);
                }} 
                samples={SAMPLE_IMAGES}
                isProcessing={isProcessing}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Panel: Immersive Simulation */}
        <div className="flex-1 flex flex-col gap-8 h-full overflow-hidden">
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col">
            {/* Simulation Viewport */}
            <div className="flex-1 relative overflow-hidden">
              <Pipeline state={state} selectedImage={selectedImage} />
              
              {/* Navigation Overlay */}
              {!isLastStage && selectedImage && !isProcessing && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50">
                  <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-md p-2 rounded-3xl border border-slate-800 shadow-2xl">
                    {state.currentStage !== 'IDLE' && (
                      <button
                        onClick={() => setState(prev => ({ ...prev, currentStage: 'IDLE', output: [], recoveredCode: '', tokens: [], ast: null, binaryStream: [] }))}
                        className="px-6 py-4 rounded-2xl border border-slate-800 text-slate-500 font-mono text-[10px] uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all"
                      >
                        Reset_System
                      </button>
                    )}
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={stepSimulation}
                      disabled={state.isProcessing || (isIdle && !selectedImage)}
                      className={`
                        group flex items-center gap-4 px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all
                        ${state.isProcessing || (isIdle && !selectedImage)
                          ? 'bg-slate-800 text-slate-700 cursor-not-allowed border border-slate-700'
                          : 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:bg-indigo-50'
                        }
                      `}
                    >
                      {state.isProcessing ? (
                        <div className="w-6 h-6 border-2 border-slate-800 border-t-indigo-600 rounded-full animate-spin" />
                      ) : (
                        <>
                          {isIdle ? 'Initialize Sequence' : 'Next Phase'}
                          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Global Progress */}
            <div className="h-2 w-full bg-slate-900 relative">
              <motion.div 
                className="h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] relative z-10"
                initial={{ width: 0 }}
                animate={{ width: `${state.progress}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
              />
              <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />
            </div>
          </div>

          {/* Stage Intelligence Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex items-start gap-6 shadow-2xl backdrop-blur-md"
          >
            <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 shadow-inner">
              <Info className="w-7 h-7 text-indigo-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.4em]">Subsystem Status</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">{state.currentStage.replace('_', ' ')}</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500">PHASE {PIPELINE_STAGES.indexOf(state.currentStage) + 1} / {PIPELINE_STAGES.length}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {STAGE_DESCRIPTIONS[state.currentStage]}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Panel: Telemetry & Results */}
        <AnimatePresence>
          {(isIdle || isLastStage) && (
            <motion.div 
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="w-80 flex flex-col gap-8 h-full overflow-hidden shrink-0"
            >
              <ResultsPanel state={state} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* System Error Notification */}
      <AnimatePresence>
        {state.errors.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-24 right-8 bg-red-500/10 border border-red-500/50 backdrop-blur-xl text-red-400 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[100]"
          >
            <AlertCircle className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest">Kernel Panic</span>
              <span className="font-mono text-sm">{state.errors[0]}</span>
            </div>
            <button onClick={() => setState(s => ({ ...s, errors: [] }))} className="ml-4 hover:text-white transition-colors">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
