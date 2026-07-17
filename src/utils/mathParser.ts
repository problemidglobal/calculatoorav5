/**
 * High-performance, robust client-side mathematical expression parser & evaluator
 * for Calculatoora's Graphing Calculator.
 *
 * Implements tokenization, implicit multiplication handling, operator precedence (Shunting-Yard),
 * and safe Reverse Polish Notation (RPN) evaluation.
 */

export interface ParserError {
  message: string;
  position?: number;
}

type TokenType = 'NUMBER' | 'OPERATOR' | 'FUNCTION' | 'VARIABLE' | 'PAREN' | 'COMMA';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

const FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'csc', 'sec', 'cot',
  'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh',
  'sqrt', 'cbrt', 'ln', 'log', 'log10', 'abs',
  'floor', 'ceil', 'sign', 'rand', 'random', 'fact', 'factorial',
  'min', 'max', 'if', 'piecewise', 'mod'
]);

const OPERATORS: Record<string, { precedence: number; assoc: 'L' | 'R' }> = {
  '+': { precedence: 1, assoc: 'L' },
  '-': { precedence: 1, assoc: 'L' },
  '*': { precedence: 2, assoc: 'L' },
  '/': { precedence: 2, assoc: 'L' },
  '%': { precedence: 2, assoc: 'L' },
  '^': { precedence: 3, assoc: 'R' },
  'u-': { precedence: 4, assoc: 'R' }, // Unary minus
};

/**
 * Preprocess pipes for absolute values: e.g. |x| -> abs(x)
 */
function preprocessPipes(expr: string): string {
  let result = '';
  let inPipe = false;
  
  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    if (char === '|') {
      if (!inPipe) {
        // Lookbehind: if preceded by a letter or number or closing paren, it might be a bitwise OR, but in graphing we assume abs.
        // If it starts abs, insert "abs("
        result += 'abs(';
        inPipe = true;
      } else {
        result += ')';
        inPipe = false;
      }
    } else {
      result += char;
    }
  }
  
  // If unmatched pipe, close it
  if (inPipe) {
    result += ')';
  }
  return result;
}

/**
 * Clean up equations: strip 'y=' or 'r=' and normalize spacing and cases.
 */
export function normalizeEquation(eq: string): { type: 'cartesian' | 'polar' | 'parametric' | 'implicit'; cleaned: string; raw: string } {
  let raw = eq.trim();
  let cleaned = raw.toLowerCase().replace(/\s+/g, '');
  
  // Strip 'y=' for cartesian
  if (cleaned.startsWith('y=')) {
    return { type: 'cartesian', cleaned: cleaned.slice(2), raw };
  }
  // Strip 'r=' for polar
  if (cleaned.startsWith('r=')) {
    return { type: 'polar', cleaned: cleaned.slice(2), raw };
  }
  
  // Check if it contains '=' and is not just 'y=' or 'r=' -> implicit equation, e.g. x^2+y^2=9
  if (cleaned.includes('=')) {
    const parts = cleaned.split('=');
    // We rewrite f(x,y) = g(x,y) as f(x,y) - (g(x,y))
    const left = parts[0];
    const right = parts[1];
    return { 
      type: 'implicit', 
      cleaned: `(${left})-(${right})`, 
      raw 
    };
  }
  
  return { type: 'cartesian', cleaned, raw };
}

/**
 * Tokenize mathematical expression
 */
export function tokenize(expr: string): Token[] {
  // Preprocess absolute values
  let processed = preprocessPipes(expr);
  const tokens: Token[] = [];
  let i = 0;
  
  while (i < processed.length) {
    const char = processed[i];
    
    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }
    
    // Parentheses
    if (char === '(' || char === ')') {
      tokens.push({ type: 'PAREN', value: char, position: i });
      i++;
      continue;
    }
    
    // Comma
    if (char === ',') {
      tokens.push({ type: 'COMMA', value: char, position: i });
      i++;
      continue;
    }
    
    // Numbers (including decimals)
    if (/\d/.test(char) || (char === '.' && i + 1 < processed.length && /\d/.test(processed[i + 1]))) {
      let val = '';
      const startPos = i;
      while (i < processed.length && (/\d/.test(processed[i]) || processed[i] === '.')) {
        val += processed[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: val, position: startPos });
      continue;
    }
    
    // Operators
    if (['+', '-', '*', '/', '^', '%'].includes(char)) {
      tokens.push({ type: 'OPERATOR', value: char, position: i });
      i++;
      continue;
    }
    
    // Alphabetic identifiers (Variables, Constants, Functions)
    if (/[a-zA-Zα-ωΑ-Ωθ]/.test(char)) {
      let val = '';
      const startPos = i;
      while (i < processed.length && /[a-zA-Z0-9α-ωΑ-Ωθ_]/.test(processed[i])) {
        val += processed[i];
        i++;
      }
      
      // Determine if it's a function or variable/constant
      const lowerVal = val.toLowerCase();
      if (FUNCTIONS.has(lowerVal)) {
        tokens.push({ type: 'FUNCTION', value: lowerVal, position: startPos });
      } else {
        tokens.push({ type: 'VARIABLE', value: lowerVal, position: startPos });
      }
      continue;
    }
    
    // Unknown characters
    i++;
  }
  
  // Handle Implicit Multiplication
  const expandedTokens: Token[] = [];
  for (let k = 0; k < tokens.length; k++) {
    const current = tokens[k];
    expandedTokens.push(current);
    
    if (k + 1 < tokens.length) {
      const next = tokens[k + 1];
      
      let insertTimes = false;
      
      // Pattern 1: Number followed by Variable or Function or Left Paren
      // e.g., 2x -> 2*x, 2sin(x) -> 2*sin(x), 2(x) -> 2*(x)
      if (current.type === 'NUMBER' && (next.type === 'VARIABLE' || next.type === 'FUNCTION' || (next.type === 'PAREN' && next.value === '('))) {
        insertTimes = true;
      }
      
      // Pattern 2: Variable followed by Left Paren or Function or Variable
      // e.g., x(y) -> x*(y), x sin(x) -> x*sin(x), x y -> x*y
      if (current.type === 'VARIABLE' && (next.type === 'VARIABLE' || next.type === 'FUNCTION' || (next.type === 'PAREN' && next.value === '('))) {
        // Special case: constants or letters, unless the variable is 'pi' or 'e' as they act as values
        insertTimes = true;
      }
      
      // Pattern 3: Right Paren followed by Left Paren, Number, Variable, or Function
      // e.g., (x+1)(x+2) -> (x+1)*(x+2)
      if (current.type === 'PAREN' && current.value === ')' && 
          (next.type === 'NUMBER' || next.type === 'VARIABLE' || next.type === 'FUNCTION' || (next.type === 'PAREN' && next.value === '('))) {
        insertTimes = true;
      }
      
      if (insertTimes) {
        expandedTokens.push({
          type: 'OPERATOR',
          value: '*',
          position: current.position + current.value.length
        });
      }
    }
  }
  
  return expandedTokens;
}

/**
 * Parse tokens using Shunting-Yard algorithm into Reverse Polish Notation (RPN)
 */
export function parseToRPN(tokens: Token[]): Token[] {
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    if (token.type === 'NUMBER' || token.type === 'VARIABLE') {
      outputQueue.push(token);
    } else if (token.type === 'FUNCTION') {
      operatorStack.push(token);
    } else if (token.type === 'COMMA') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].value !== '(') {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) {
        throw new Error('Misplaced comma or missing parenthesis.');
      }
    } else if (token.type === 'OPERATOR') {
      let op = token.value;
      
      // Check for Unary Minus (a minus preceded by an operator, comma, left paren, or at the start)
      if (op === '-') {
        const prev = i > 0 ? tokens[i - 1] : null;
        if (!prev || prev.type === 'OPERATOR' || prev.type === 'COMMA' || (prev.type === 'PAREN' && prev.value === '(')) {
          op = 'u-'; // Unary minus
          token.value = 'u-';
        }
      }
      
      const opProps = OPERATORS[op];
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top.type !== 'OPERATOR') {
          break;
        }
        
        const topProps = OPERATORS[top.value];
        if (
          (opProps.assoc === 'L' && opProps.precedence <= topProps.precedence) ||
          (opProps.assoc === 'R' && opProps.precedence < topProps.precedence)
        ) {
          outputQueue.push(operatorStack.pop()!);
        } else {
          break;
        }
      }
      operatorStack.push(token);
    } else if (token.type === 'PAREN' && token.value === '(') {
      operatorStack.push(token);
    } else if (token.type === 'PAREN' && token.value === ')') {
      let foundMatchingParen = false;
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top.type === 'PAREN' && top.value === '(') {
          operatorStack.pop(); // Remove '('
          foundMatchingParen = true;
          break;
        } else {
          outputQueue.push(operatorStack.pop()!);
        }
      }
      
      if (!foundMatchingParen) {
        throw new Error('Unmatched closing parenthesis.');
      }
      
      // If the top of the stack is a function, pop it onto the output queue
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'FUNCTION') {
        outputQueue.push(operatorStack.pop()!);
      }
    }
  }
  
  while (operatorStack.length > 0) {
    const top = operatorStack.pop()!;
    if (top.type === 'PAREN') {
      throw new Error('Unmatched opening parenthesis.');
    }
    outputQueue.push(top);
  }
  
  return outputQueue;
}

/**
 * Fast Factorial function
 */
function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  const limit = Math.min(Math.floor(n), 170); // Max safe double factorial
  for (let i = 2; i <= limit; i++) {
    res *= i;
  }
  return res;
}

/**
 * Evaluate Reverse Polish Notation (RPN) array with variable bindings
 */
export function evaluateRPN(rpn: Token[], variables: Record<string, number>): number {
  const stack: number[] = [];
  
  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      stack.push(Number(token.value));
    } else if (token.type === 'VARIABLE') {
      const varName = token.value;
      if (varName === 'pi' || varName === 'π') {
        stack.push(Math.PI);
      } else if (varName === 'e') {
        stack.push(Math.E);
      } else if (varName === 'theta' || varName === 'θ' || varName === 'th') {
        stack.push(variables.theta !== undefined ? variables.theta : (variables.x !== undefined ? variables.x : 0));
      } else if (variables[varName] !== undefined) {
        stack.push(variables[varName]);
      } else {
        // Default uninitialized variables to 0 (or NaN to show void, let's do 0 or NaN. Let's do NaN so errors are handled)
        stack.push(0);
      }
    } else if (token.type === 'OPERATOR') {
      if (token.value === 'u-') {
        if (stack.length < 1) return NaN;
        const val = stack.pop()!;
        stack.push(-val);
      } else {
        if (stack.length < 2) return NaN;
        const b = stack.pop()!;
        const a = stack.pop()!;
        
        switch (token.value) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/': stack.push(b === 0 ? NaN : a / b); break;
          case '%': stack.push(a % b); break;
          case '^': stack.push(Math.pow(a, b)); break;
          default: return NaN;
        }
      }
    } else if (token.type === 'FUNCTION') {
      const fn = token.value;
      
      // Determine how many arguments to pop based on the function type
      if (fn === 'piecewise' || fn === 'if') {
        if (stack.length < 3) return NaN;
        const valFalse = stack.pop()!;
        const valTrue = stack.pop()!;
        const cond = stack.pop()!;
        // In our simple engine, condition is true if it's non-zero
        stack.push(cond !== 0 && !isNaN(cond) ? valTrue : valFalse);
      } else if (fn === 'min' || fn === 'max' || fn === 'mod') {
        if (stack.length < 2) return NaN;
        const b = stack.pop()!;
        const a = stack.pop()!;
        if (fn === 'min') stack.push(Math.min(a, b));
        else if (fn === 'max') stack.push(Math.max(a, b));
        else stack.push(a % b);
      } else {
        if (stack.length < 1) return NaN;
        const val = stack.pop()!;
        
        switch (fn) {
          case 'sin': stack.push(Math.sin(val)); break;
          case 'cos': stack.push(Math.cos(val)); break;
          case 'tan': stack.push(Math.tan(val)); break;
          case 'csc': stack.push(1 / Math.sin(val)); break;
          case 'sec': stack.push(1 / Math.cos(val)); break;
          case 'cot': stack.push(1 / Math.tan(val)); break;
          case 'asin': stack.push(Math.asin(val)); break;
          case 'acos': stack.push(Math.acos(val)); break;
          case 'atan': stack.push(Math.atan(val)); break;
          case 'sinh': stack.push(Math.sinh(val)); break;
          case 'cosh': stack.push(Math.cosh(val)); break;
          case 'tanh': stack.push(Math.tanh(val)); break;
          case 'sqrt': stack.push(val < 0 ? NaN : Math.sqrt(val)); break;
          case 'cbrt': stack.push(Math.cbrt(val)); break;
          case 'ln': 
          case 'log': stack.push(val <= 0 ? NaN : Math.log(val)); break;
          case 'log10': stack.push(val <= 0 ? NaN : Math.log10(val)); break;
          case 'abs': stack.push(Math.abs(val)); break;
          case 'floor': stack.push(Math.floor(val)); break;
          case 'ceil': stack.push(Math.ceil(val)); break;
          case 'sign': stack.push(Math.sign(val)); break;
          case 'rand':
          case 'random': stack.push(Math.random() * val); break; // multiplies max
          case 'fact':
          case 'factorial': stack.push(factorial(val)); break;
          default: return NaN;
        }
      }
    }
  }
  
  if (stack.length !== 1) return NaN;
  return stack[0];
}

/**
 * Main compilation and execution function
 */
export function compileEquation(expr: string): { rpn: Token[] | null; error: string | null } {
  if (!expr.trim()) {
    return { rpn: null, error: 'Equation is empty' };
  }
  try {
    const tokens = tokenize(expr);
    const rpn = parseToRPN(tokens);
    return { rpn, error: null };
  } catch (err: any) {
    return { rpn: null, error: err.message || 'Syntax error' };
  }
}

/**
 * Fast numerical evaluation helper
 */
export function evaluateEquation(rpn: Token[], variables: Record<string, number>): number {
  try {
    const val = evaluateRPN(rpn, variables);
    return isNaN(val) || !isFinite(val) ? NaN : val;
  } catch {
    return NaN;
  }
}
