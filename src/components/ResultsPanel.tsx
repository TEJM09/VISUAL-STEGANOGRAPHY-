
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Binary, Layers, Terminal, Cpu } from 'lucide-react';
import { SimulationState } from '../types';
import ASTVisualizer from './ASTVisualizer';

interface ResultsPanelProps {
  state: SimulationState;
}

export default function ResultsPanel({ state }: ResultsPanelProps) {
  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      {/* Recovered Code */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Code className="w-4 h-4" />
          Recovered Code
        </h2>
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm border border-slate-800 min-h-[60px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            {state.recoveredCode ? (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-indigo-400"
              >
                {state.recoveredCode}
              </motion.div>
            ) : (
              <div key="placeholder" className="text-slate-700 italic">Waiting for extraction...</div>
            )}
          </AnimatePresence>
          {state.currentStage === 'DECRYPTION' && (
            <motion.div 
              className="absolute inset-0 bg-indigo-500/10"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>
      </div>

      {/* Token List */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-40">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Token Stream
        </h2>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex flex-wrap gap-2">
            {state.tokens.length > 0 ? (
              state.tokens.map((token, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono flex flex-col items-center"
                >
                  <span className="text-slate-500 text-[8px] uppercase">{token.type}</span>
                  <span className="text-indigo-300 font-bold">{token.value}</span>
                </motion.div>
              ))
            ) : (
              <div className="text-slate-700 italic text-sm">No tokens yet</div>
            )}
          </div>
        </div>
      </div>

      {/* AST Visualization */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex-1 flex flex-col overflow-hidden">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          Syntax Tree (AST)
        </h2>
        <div className="flex-1 bg-slate-950/50 rounded-lg border border-slate-800 overflow-hidden">
          <ASTVisualizer node={state.ast} />
        </div>
      </div>

      {/* Output Console */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          Execution Output
        </h2>
        <div className="bg-black rounded-lg p-4 font-mono text-sm border border-slate-800 min-h-[80px] flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 mb-2 border-b border-slate-900 pb-1">
            <span className="w-2 h-2 rounded-full bg-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/50" />
            <span className="text-[10px] ml-auto">bash — 80x24</span>
          </div>
          <div className="flex-1">
            {state.output ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-emerald-400"
              >
                <span className="text-slate-600 mr-2">$</span>
                {state.output}
              </motion.div>
            ) : (
              <div className="text-slate-800">
                <span className="text-slate-600 mr-2">$</span>
                <span className="animate-pulse">_</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
