type Env = Record<string, number>;

type NumberNode = { type: "number"; value: number };
type VariableNode = { type: "variable"; name: string };
type UnaryNode = { type: "unary"; operator: string; operand: ASTNode };
type BinaryNode = { type: "binary"; operator: string; left: ASTNode; right: ASTNode };
type CallNode = { type: "call"; name: string; args: ASTNode[] };
type ASTNode = NumberNode | VariableNode | UnaryNode | BinaryNode | CallNode;

function tokenize(expr: string): string[] {
  return expr.match(/\d+(\.\d+)?|[a-zA-Z_]\w*|[+\-*/%^(),]/g) || [];
}

function parse(tokens: string[]): ASTNode {
  let pos = 0;
  function peek() {
    return tokens[pos];
  }
  function consume(expected?: string): string {
    const t = tokens[pos++];
    if (expected && t !== expected) throw new Error(`Expected '${expected}' but got '${t}'`);
    return t;
  }

  function parsePrimary(): ASTNode {
    const token = peek();
    if (token === "(") {
      consume("(");
      const expr = parseExpression();
      consume(")");
      return expr;
    }
    if (/^\d+(\.\d+)?$/.test(token)) {
      consume();
      return { type: "number", value: Number(token) | 0 };
    }
    if (/^[a-zA-Z_]\w*$/.test(token)) {
      consume();
      if (peek() === "(") {
        consume("(");
        const args: ASTNode[] = [];
        if (peek() !== ")") {
          while (true) {
            args.push(parseExpression());
            if (peek() === ",") consume(",");
            else break;
          }
        }
        consume(")");
        return { type: "call", name: token, args };
      }
      return { type: "variable", name: token };
    }
    throw new Error("Unexpected token: " + token);
  }

  function parseUnary(): ASTNode {
    if (peek() === "-") {
      consume("-");
      const operand = parseUnary();
      return { type: "unary", operator: "-", operand };
    }
    return parsePrimary();
  }

  // 累乗対応を削除し、parseMulDivModはparseUnaryを直接呼ぶ
  function parseMulDivMod(): ASTNode {
    let left = parseUnary();
    while (true) {
      const op = peek();
      if (op === "*" || op === "/" || op === "%") {
        consume();
        const right = parseUnary();
        left = { type: "binary", operator: op, left, right };
      } else break;
    }
    return left;
  }

  function parseAddSub(): ASTNode {
    let left = parseMulDivMod();
    while (true) {
      const op = peek();
      if (op === "+" || op === "-") {
        consume();
        const right = parseMulDivMod();
        left = { type: "binary", operator: op, left, right };
      } else break;
    }
    return left;
  }

  function parseExpression(): ASTNode {
    return parseAddSub();
  }

  return parseExpression();
}

function evalAst(node: ASTNode, env: Env = {}): number {
  switch (node.type) {
    case "number":
      return node.value | 0;
    case "variable":
      if (!(node.name in env)) throw new Error(`Unknown variable ${node.name}`);
      return env[node.name] | 0;
    case "unary": {
      const val = evalAst(node.operand, env) | 0;
      if (node.operator === "-") return -val | 0;
      throw new Error("Unknown unary operator " + node.operator);
    }
    case "binary": {
      const left = evalAst(node.left, env) | 0;
      const right = evalAst(node.right, env) | 0;
      switch (node.operator) {
        case "+":
          return (left + right) | 0;
        case "-":
          return (left - right) | 0;
        case "*":
          return (left * right) | 0;
        case "/":
          return right === 0 ? 0 : (left / right) | 0;
        case "%":
          return right === 0 ? 0 : left % right | 0;
        // "^" 演算子の処理を削除
        default:
          throw new Error("Unknown operator " + node.operator);
      }
    }
    case "call": {
      const args = node.args.map((a) => evalAst(a, env) | 0);
      switch (node.name.toLowerCase()) {
        case "pow":
          if (args.length !== 2) throw new Error("pow requires 2 arguments");
          return Math.pow(args[0], args[1]) | 0;
        case "sqrt":
          if (args.length !== 1) throw new Error("sqrt requires 1 argument");
          return Math.floor(Math.sqrt(args[0])) | 0;
        default:
          throw new Error(`Unknown function ${node.name}`);
      }
    }
  }
}

/**
 * 式を評価します。変数はenvで指定可能。
 *  expr 評価する式
 *  env 変数環境(省略可)
 *  評価結果（int扱い）
 */
function evaluate(expr: string, env: Env = {}): number {
  const tokens = tokenize(expr);
  const ast = parse(tokens);
  return evalAst(ast, env);
}

export const FormulaCalc = {
  evaluate,
  tokenize,
  parse,
  evalAst,
};

export type { Env, NumberNode, VariableNode, UnaryNode, BinaryNode, CallNode, ASTNode };
