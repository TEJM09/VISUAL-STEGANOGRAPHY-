
import React from 'react';
import { motion } from 'motion/react';
import { ASTNode } from '../types';

interface ASTVisualizerProps {
  node: ASTNode | null;
}

const NODE_CONFIG: Record<string, { 
  bg: string; 
  border: string; 
  text: string; 
  shadow: string;
  label: string;
  glow: string;
}> = {
  Program: { 
    bg: 'bg-slate-900/80', 
    border: 'border-slate-400', 
    text: 'text-white', 
    shadow: 'shadow-slate-400/20',
    label: 'ROOT',
    glow: 'rgba(255,255,255,0.3)'
  },
  VariableDeclaration: { 
    bg: 'bg-amber-500/10', 
    border: 'border-amber-400', 
    text: 'text-amber-400', 
    shadow: 'shadow-amber-500/30',
    label: 'LET',
    glow: 'rgba(251,191,36,0.4)'
  },
  PrintStatement: { 
    bg: 'bg-purple-500/10', 
    border: 'border-purple-400', 
    text: 'text-purple-400', 
    shadow: 'shadow-purple-500/30',
    label: 'PRINT',
    glow: 'rgba(192,132,252,0.4)'
  },
  IfStatement: { 
    bg: 'bg-pink-500/10', 
    border: 'border-pink-400', 
    text: 'text-pink-400', 
    shadow: 'shadow-pink-500/30',
    label: 'IF',
    glow: 'rgba(244,114,182,0.4)'
  },
  BinaryExpression: { 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-400', 
    text: 'text-blue-400', 
    shadow: 'shadow-blue-500/30',
    label: 'OP',
    glow: 'rgba(96,165,250,0.4)'
  },
  Condition: { 
    bg: 'bg-cyan-500/10', 
    border: 'border-cyan-400', 
    text: 'text-cyan-400', 
    shadow: 'shadow-cyan-500/30',
    label: 'COND',
    glow: 'rgba(34,211,238,0.4)'
  },
  Literal: { 
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-400', 
    text: 'text-emerald-400', 
    shadow: 'shadow-emerald-500/30',
    label: 'VAL',
    glow: 'rgba(52,211,153,0.4)'
  },
  Identifier: { 
    bg: 'bg-indigo-500/10', 
    border: 'border-indigo-400', 
    text: 'text-indigo-400', 
    shadow: 'shadow-indigo-500/30',
    label: 'VAR',
    glow: 'rgba(129,140,248,0.4)'
  },
};

export default function ASTVisualizer({ node }: ASTVisualizerProps) {
  if (!node) return (
    <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs tracking-widest uppercase animate-pulse">
      [ Waiting_for_AST_Data ]
    </div>
  );

  const renderNode = (n: ASTNode, depth = 0, index = 0): React.ReactNode => {
    const delay = (depth * 0.15) + (index * 0.05);
    const config = NODE_CONFIG[n.type] || NODE_CONFIG.Program;
    
    // Collect all children to calculate line positions correctly
    const allChildren: ASTNode[] = [];
    if (n.left) allChildren.push(n.left);
    if (n.right) allChildren.push(n.right);
    if (n.children) allChildren.push(...n.children);

    return (
      <div className="flex flex-col items-center gap-20 relative">
        <motion.div 
          initial={{ scale: 0, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          whileHover={{ scale: 1.1, y: -10, rotate: 2 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 15,
            delay 
          }}
          className={`
            px-8 py-5 rounded-[24px] border-4 text-xs font-mono shadow-2xl relative z-10 min-w-[160px] text-center
            transition-all duration-300 group cursor-pointer backdrop-blur-sm
            ${config.bg} ${config.border} ${config.text} ${config.shadow}
          `}
          style={{
            boxShadow: `0 0 30px -5px ${config.glow}`
          }}
        >
          {/* Node Type Label */}
          <div className="opacity-60 text-[10px] uppercase tracking-[0.25em] mb-2 font-black group-hover:opacity-100 transition-opacity">
            {n.type}
          </div>

          {/* Node Value/Label */}
          <div className="font-black text-2xl tracking-tighter mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            {n.value !== undefined ? (typeof n.value === 'string' ? `"${n.value}"` : n.value) : config.label}
          </div>

          {/* Depth Indicator (Subtle) */}
          <div className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-slate-950 border-2 border-slate-700 flex items-center justify-center text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-all shadow-2xl transform group-hover:scale-110">
            {depth}
          </div>
          
          {/* Animated Glow Ring */}
          <motion.div 
            className={`absolute -inset-1 rounded-[26px] border-2 opacity-0 ${config.border.replace('border-', 'border-')}/30`}
            animate={{ opacity: [0, 0.5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay }}
          />
        </motion.div>

        {allChildren.length > 0 && (
          <div className="flex gap-32 relative pt-16 group/subtree">
            {/* Connector lines drawing animation */}
            <svg className="absolute top-[-80px] left-0 w-full h-40 pointer-events-none overflow-visible">
              <defs>
                <linearGradient id={`grad-${depth}-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
                </linearGradient>
              </defs>
              
              {allChildren.map((_, i) => {
                const total = allChildren.length;
                const nodeW = 160;
                const gapW = 128;
                const totalW = (total * nodeW) + ((total - 1) * gapW);
                const centerPos = (i * (nodeW + gapW)) + (nodeW / 2);
                const xPos = (centerPos / totalW) * 100;

                return (
                  <motion.line
                    key={i}
                    x1="50%" y1="0"
                    x2={`${xPos}%`} y2="80"
                    stroke={`url(#grad-${depth}-${index})`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="group-hover/subtree:stroke-white transition-colors duration-500"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: delay + 0.1 }}
                  />
                );
              })}
            </svg>
            
            {allChildren.map((child, i) => (
              <React.Fragment key={i}>
                {renderNode(child, depth + 1, i)}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto p-8 flex justify-center custom-scrollbar bg-slate-950/30">
      <div className="min-w-max">
        {renderNode(node)}
      </div>
    </div>
  );
}
