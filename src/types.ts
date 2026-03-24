
import { Instruction } from './lib/vm';

export type Stage = 
  | 'IDLE'
  | 'SCANNING'
  | 'EXTRACTION'
  | 'DECRYPTION'
  | 'LEXICAL_ANALYSIS'
  | 'SYNTAX_ANALYSIS'
  | 'SEMANTIC_ANALYSIS'
  | 'OPTIMIZATION'
  | 'CODE_GEN'
  | 'EXECUTION'
  | 'COMPLETED';

export interface Token {
  type: string;
  value: string;
  line: number;
}

export interface ASTNode {
  type: string;
  value?: any;
  left?: ASTNode;
  right?: ASTNode;
  children?: ASTNode[];
  line?: number;
}

export interface SimulationState {
  currentStage: Stage;
  progress: number;
  rawBinary: string[];
  binaryStream: string[];
  decodedText: string;
  recoveredCode: string;
  tokens: Token[];
  ast: ASTNode | null;
  optimizedAst: ASTNode | null;
  bytecode: Instruction[];
  output: string[];
  errors: string[];
  regionDetected: { x: number, y: number, width: number, height: number } | null;
}
