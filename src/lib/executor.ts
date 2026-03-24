
import { ASTNode } from '../types';

export function executeAST(node: ASTNode): string {
  const variables: Record<string, any> = {};
  let lastOutput = '';

  function evaluate(n: ASTNode): any {
    switch (n.type) {
      case 'Literal':
        return n.value;
      case 'Identifier':
        if (!(n.value in variables)) throw new Error(`Undefined variable: ${n.value}`);
        return variables[n.value];
      case 'BinaryExpression':
        const left = evaluate(n.left!);
        const right = evaluate(n.right!);
        switch (n.value) {
          case 'PLUS': return left + right;
          case 'MINUS': return left - right;
          case 'MULTIPLY': return left * right;
          case 'DIVIDE': return left / right;
          default: throw new Error(`Unknown operator: ${n.value}`);
        }
      case 'VariableDeclaration':
        const val = evaluate(n.children![0]);
        variables[n.value] = val;
        return val;
      case 'PrintStatement':
        const printVal = evaluate(n.children![0]);
        lastOutput = String(printVal);
        return printVal;
      case 'Program':
        n.children?.forEach(child => evaluate(child));
        return lastOutput;
      default:
        throw new Error(`Unknown node type: ${n.type}`);
    }
  }

  return evaluate(node);
}
