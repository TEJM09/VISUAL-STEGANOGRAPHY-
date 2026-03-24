
export interface Instruction {
  op: string;
  value?: any;
  name?: string;
  target?: number;
}

export function executeBytecode(bytecode: Instruction[]): string[] {
  const stack: any[] = [];
  const memory: Record<string, any> = {};
  const output: string[] = [];
  let pc = 0;

  while (pc < bytecode.length) {
    const instr = bytecode[pc];
    switch (instr.op) {
      case 'PUSH':
        stack.push(instr.value);
        pc++;
        break;
      case 'LOAD':
        stack.push(memory[instr.name!]);
        pc++;
        break;
      case 'STORE':
        memory[instr.name!] = stack.pop();
        pc++;
        break;
      case 'PRINT':
        output.push(String(stack.pop()));
        pc++;
        break;
      case 'OP':
        const r = stack.pop();
        const l = stack.pop();
        switch (instr.value) {
          case '+': stack.push(l + r); break;
          case '-': stack.push(l - r); break;
          case '*': stack.push(l * r); break;
          case '/': stack.push(l / r); break;
          case '>': stack.push(l > r); break;
          case '<': stack.push(l < r); break;
          case '==': stack.push(l == r); break;
          case '!=': stack.push(l != r); break;
          case '>=': stack.push(l >= r); break;
          case '<=': stack.push(l <= r); break;
        }
        pc++;
        break;
      case 'JUMP_IF_FALSE':
        if (!stack.pop()) {
          pc = instr.target!;
        } else {
          pc++;
        }
        break;
      case 'JUMP':
        pc = instr.target!;
        break;
      default:
        pc++;
    }
  }

  return output;
}
