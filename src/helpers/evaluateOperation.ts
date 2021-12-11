import { Args, OperationProps } from "../types";

export function evaluateOperation(operation: OperationProps, args: Args): boolean | undefined {
  const childrenResults = operation.children.map(child => evaluateOperation(child, args));

  if (operation.type === 'none') {
    return undefined;
  }

  if (operation.type === 'constant') {
    return operation.values[0] === 'true' ? true : false;
  }

  if (operation.type === 'argument') {
    return args[operation.values[0]];
  }

  const opSymbol = operation.type === 'and' ? '&&' : '||';
  const argsValues = operation.values.map(val => {
    if (val in args) {
      return args[val];
    }
    return val;
  });

  childrenResults.forEach(res => {
    if (res !== undefined) {
      argsValues.push(String(res));
    }
  })

  if (argsValues.find(val => val === 'none')) {
    return undefined;
  }

  const strArray = [];
  for (let i = 0; i < argsValues.length; i += 1) {
    if (i === argsValues.length - 1) {
      strArray.push(String(argsValues[i]));
    } else {
      strArray.push(String(argsValues[i]), opSymbol);
    }
  }

  const evalString = strArray.join('');
  const result = eval(evalString);

  return result;
}