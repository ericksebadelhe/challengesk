import { Args, Operation } from "../types";

export function evaluateOperation(
  operation: Operation,
  args: Args
): boolean | undefined {
  const childrenResults = operation.children.map(child => evaluateOperation(child, args));
  
  if (operation.type === 'none') return undefined;

  if (operation.type === 'constant') {
    return operation.values[0] === 'true' ? true : false;
  }

  if (operation.type === 'argument') return args[operation.values[0]];

  const argsValues = operation.values.map(val => {
    if (val in args) return args[val];
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  });

  childrenResults.forEach(res => {
    if (res !== undefined) {
      argsValues.push(res);
    }
  });

  if (argsValues.find(val => val === 'none')) return undefined;

  let result: any = undefined;

  for (let i = 0; i < argsValues.length - 1; i += 1) {
    if(operation.type === 'and') {
      result = argsValues[i] && argsValues[i + 1];
    } else {
      result = argsValues[i] || argsValues[i + 1];
    }
  }

  return result;
}