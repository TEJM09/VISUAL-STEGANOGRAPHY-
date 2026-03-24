import { Stage } from './types';

export const STAGE_DESCRIPTIONS: Record<Stage, string> = {
  IDLE: 'System ready. Select a source file to begin analysis.',
  SCANNING: 'AI-powered region detection identifying hidden data payload.',
  EXTRACTION: 'Extracting LSB-encoded binary stream from identified region.',
  DECRYPTION: 'Decoding Base64/Cipher layer to reveal source code.',
  LEXICAL_ANALYSIS: 'Scanning code to identify keywords, identifiers, and symbols.',
  SYNTAX_ANALYSIS: 'Building an Abstract Syntax Tree (AST) to verify code structure.',
  SEMANTIC_ANALYSIS: 'Performing type checking and scope validation.',
  OPTIMIZATION: 'Applying constant folding and dead code elimination.',
  CODE_GEN: 'Generating intermediate bytecode for the virtual machine.',
  EXECUTION: 'Running the program in a secure virtualized environment.',
  COMPLETED: 'Payload extracted and executed successfully. Process complete.'
};

export const PIPELINE_STAGES: Stage[] = [
  'SCANNING',
  'EXTRACTION',
  'DECRYPTION',
  'LEXICAL_ANALYSIS',
  'SYNTAX_ANALYSIS',
  'SEMANTIC_ANALYSIS',
  'OPTIMIZATION',
  'CODE_GEN',
  'EXECUTION',
  'COMPLETED'
];
