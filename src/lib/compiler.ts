import { Token, ASTNode } from '../types';

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let current = 0;
  let line = 1;

  const keywords = ['LET', 'IF', 'THEN', 'END', 'PRINT'];

  while (current < code.length) {
    let char = code[current];

    if (char === '\n') {
      line++;
      current++;
      continue;
    }

    if (/\s/.test(char)) {
      current++;
      continue;
    }

    if (/[0-9]/.test(char)) {
      let value = '';
      while (current < code.length && /[0-9]/.test(code[current])) {
        value += code[current];
        current++;
      }
      tokens.push({ type: 'NUMBER', value, line });
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let value = '';
      while (current < code.length && /[a-zA-Z0-9]/.test(code[current])) {
        value += code[current];
        current++;
      }
      const upper = value.toUpperCase();
      if (keywords.includes(upper)) {
        tokens.push({ type: 'KEYWORD', value: upper, line });
      } else {
        tokens.push({ type: 'IDENTIFIER', value, line });
      }
      continue;
    }

    if (char === '"') {
      let value = '';
      current++; // skip opening quote
      while (current < code.length && code[current] !== '"') {
        value += code[current];
        current++;
      }
      current++; // skip closing quote
      tokens.push({ type: 'STRING', value, line });
      continue;
    }

    const operators = ['==', '>', '<', '=', '+', '-', '*', '/'];
    let foundOp = false;
    for (const op of operators) {
      if (code.slice(current, current + op.length) === op) {
        tokens.push({ type: 'OPERATOR', value: op, line });
        current += op.length;
        foundOp = true;
        break;
      }
    }

    if (foundOp) continue;

    if (char === ';') {
      tokens.push({ type: 'SEMICOLON', value: ';', line });
      current++;
      continue;
    }

    throw new Error(`Lexical Error: Unexpected character '${char}' at line ${line}`);
  }

  return tokens;
}

export function parse(tokens: Token[]): ASTNode {
  let current = 0;

  function walk(): ASTNode {
    let token = tokens[current];

    if (token.type === 'NUMBER') {
      current++;
      return { type: 'Literal', value: parseInt(token.value), line: token.line };
    }

    if (token.type === 'STRING') {
      current++;
      return { type: 'Literal', value: token.value, line: token.line };
    }

    if (token.type === 'IDENTIFIER') {
      current++;
      return { type: 'Identifier', value: token.value, line: token.line };
    }

    if (token.type === 'KEYWORD' && token.value === 'LET') {
      current++;
      const id = tokens[current++];
      if (id.type !== 'IDENTIFIER') throw new Error(`Syntax Error: Expected identifier after LET at line ${token.line}`);
      
      const op = tokens[current++];
      if (op.value !== '=') throw new Error(`Syntax Error: Expected '=' after identifier at line ${token.line}`);
      
      const expr = parseExpression();
      return {
        type: 'VariableDeclaration',
        value: id.value,
        children: [expr],
        line: token.line
      };
    }

    if (token.type === 'KEYWORD' && token.value === 'PRINT') {
      current++;
      const expr = parseExpression();
      return {
        type: 'PrintStatement',
        children: [expr],
        line: token.line
      };
    }

    if (token.type === 'KEYWORD' && token.value === 'IF') {
      current++;
      const condition = parseExpression();
      
      const thenToken = tokens[current++];
      if (thenToken?.value !== 'THEN') throw new Error(`Syntax Error: Expected THEN after condition at line ${token.line}`);
      
      const body = [];
      while (current < tokens.length && !(tokens[current].type === 'KEYWORD' && tokens[current].value === 'END')) {
        if (tokens[current].type === 'SEMICOLON') {
          current++;
          continue;
        }
        body.push(walk());
      }
      
      if (current >= tokens.length) throw new Error(`Syntax Error: Missing END for IF statement at line ${token.line}`);
      current++; // skip END
      
      return {
        type: 'IfStatement',
        children: [condition, ...body],
        line: token.line
      };
    }

    throw new Error(`Syntax Error: Unexpected token '${token.value}' at line ${token.line}`);
  }

  function parseExpression(): ASTNode {
    let left: ASTNode;
    let token = tokens[current];

    if (token.type === 'NUMBER') {
      left = { type: 'Literal', value: parseInt(token.value), line: token.line };
      current++;
    } else if (token.type === 'IDENTIFIER') {
      left = { type: 'Identifier', value: token.value, line: token.line };
      current++;
    } else if (token.type === 'STRING') {
      left = { type: 'Literal', value: token.value, line: token.line };
      current++;
    } else {
      throw new Error(`Syntax Error: Unexpected token in expression '${token.value}' at line ${token.line}`);
    }
    
    if (current < tokens.length && tokens[current].type === 'OPERATOR') {
      const op = tokens[current++];
      const right = parseExpression();
      return {
        type: 'BinaryExpression',
        value: op.value,
        left,
        right,
        line: op.line
      };
    }
    
    return left;
  }

  const ast: ASTNode = { type: 'Program', children: [], line: 1 };
  while (current < tokens.length) {
    if (tokens[current].type === 'SEMICOLON') {
      current++;
      continue;
    }
    ast.children?.push(walk());
  }

  return ast;
}

export function semanticAnalysis(ast: ASTNode): string[] {
  const errors: string[] = [];
  const declaredVars = new Set<string>();

  function check(node: ASTNode) {
    if (node.type === 'VariableDeclaration') {
      declaredVars.add(node.value);
    }
    if (node.type === 'Identifier') {
      if (!declaredVars.has(node.value)) {
        errors.push(`Semantic Error: Variable '${node.value}' used before declaration at line ${node.line}`);
      }
    }
    if (node.children) node.children.forEach(check);
    if (node.left) check(node.left);
    if (node.right) check(node.right);
  }

  check(ast);
  return errors;
}

export function optimize(ast: ASTNode): ASTNode {
  function fold(node: ASTNode): ASTNode {
    if (node.type === 'BinaryExpression' && node.left?.type === 'Literal' && node.right?.type === 'Literal') {
      const l = node.left.value;
      const r = node.right.value;
      if (typeof l === 'number' && typeof r === 'number') {
        let result: any;
        switch (node.value) {
          case '+': result = l + r; break;
          case '-': result = l - r; break;
          case '*': result = l * r; break;
          case '/': result = l / r; break;
          case '>': result = l > r; break;
          case '<': result = l < r; break;
          case '==': result = l == r; break;
        }
        if (result !== undefined) return { type: 'Literal', value: result, line: node.line };
      }
    }

    const newNode = { ...node };
    if (newNode.children) newNode.children = newNode.children.map(fold);
    if (newNode.left) newNode.left = fold(newNode.left);
    if (newNode.right) newNode.right = fold(newNode.right);
    return newNode;
  }

  return fold(ast);
}

import { Instruction } from './vm';

export function generateBytecode(ast: ASTNode): Instruction[] {
  const bytecode: Instruction[] = [];
  const labels: Record<string, number> = {};
  const jumpsToResolve: { index: number; label: string }[] = [];

  function gen(node: ASTNode) {
    if (node.type === 'Literal') {
      bytecode.push({ op: 'PUSH', value: node.value });
    } else if (node.type === 'Identifier') {
      bytecode.push({ op: 'LOAD', name: node.value });
    } else if (node.type === 'BinaryExpression') {
      gen(node.left!);
      gen(node.right!);
      bytecode.push({ op: 'OP', value: node.value });
    } else if (node.type === 'VariableDeclaration') {
      gen(node.children![0]);
      bytecode.push({ op: 'STORE', name: node.value });
    } else if (node.type === 'PrintStatement') {
      gen(node.children![0]);
      bytecode.push({ op: 'PRINT' });
    } else if (node.type === 'IfStatement') {
      // Condition is first child
      gen(node.children![0]);
      
      const jumpIdx = bytecode.length;
      bytecode.push({ op: 'JUMP_IF_FALSE', target: -1 }); // Placeholder
      
      // Body is remaining children
      for (let i = 1; i < node.children!.length; i++) {
        gen(node.children![i]);
      }
      
      // Resolve jump target to current length
      bytecode[jumpIdx].target = bytecode.length;
    } else if (node.type === 'Program') {
      node.children?.forEach(gen);
    }
  }

  gen(ast);
  return bytecode;
}
