import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import Selector from './components/Selector';
import OperationBuilder from './components/OperationBuilder';
import { evaluateOperation } from './helpers/operation';
import { Args, Operation } from './types';

import './styles.css';

interface OperationContextData {
  options: any;
}

export const OperationContext = createContext<OperationContextData>({} as OperationContextData);

const App: React.FC = () => {
  const [args, setArgs] = useState<Args>({ 'My Arg': false });
  const [result, setResult] = useState<boolean | undefined>(undefined);
  const [operation, setOperation] = useState<Operation>({
    id: 1,
    type: 'none',
    values: [],
    children: [],
  });

  const selectorOptions = useMemo(() => {
    return {
      none: ['constant', 'argument', 'and', 'or'],
      constant: ['false', 'true'],
      argument: [...Object.keys(args).map(arg => arg)],
      and: ['and', 'or'],
      or: ['or', 'and'],
    }
  }, [args]);

  const handleChangeArgName = (
    event: React.ChangeEvent<HTMLInputElement>,
    oldName: string,
  ): void => {
    const updatedArgs = Object.entries(args);
    const newArg: any = [event.target.value, false];
    const argIndex = updatedArgs.findIndex(arg => arg.includes(oldName));

    if (argIndex !== -1) {
      updatedArgs.splice(argIndex, 1, newArg);
      setArgs(Object.fromEntries(updatedArgs));
    }
  }

  const handleChangeArgValue = (
    argName: string,
    value: string,
  ): void => {
    const newArgs = { ...args };
    newArgs[argName] = value === 'false' ? false : true;
    setArgs(newArgs);
  }

  const handleAddNewArg = useCallback(() => {
    const defaultName = 'newarg';
    const name = defaultName in args
      ? `${defaultName}${Object.keys(args).length}`
      : defaultName;
    const newArgs = { ...args, [name]: false };
    setArgs(newArgs);
  }, [args]);

  useEffect(() => {
    setResult(evaluateOperation(operation, args));
  }, [operation, args]);

  return (
    <OperationContext.Provider
      value={{
        options: selectorOptions,
      }}
    >
      <div className="container">
        {Object.keys(args).map(arg =>
          <div key={arg} className="input-container">
            <input
              id={`input-${arg}`}
              autoFocus
              type="text"
              value={arg}
              onChange={event => handleChangeArgName(event, arg)}
              className="input"
            />
            <Selector
              type="constant"
              selected={String(args[arg])}
              onChange={event => handleChangeArgValue(arg, event.target.value)}
              showButton={false}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => handleAddNewArg()}
          className="add-button"
        >
          + add arg
        </button>

        <OperationBuilder
          value={operation}
          onChange={value => setOperation(value)}
        />

        <span>result: {String(result)}</span>
      </div>
    </OperationContext.Provider>
  );
}

export default App;

