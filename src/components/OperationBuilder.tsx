import React, { useCallback, useContext, useEffect, useState } from 'react';
import Selector from './Selector';
import { Operation, Input } from '../types';
import { OperationContext } from '../App';

interface OperationBuilderProps {
  value: Operation;
  onChange: (value: Operation) => void;
}

function OperationBuilder({
  value,
  onChange,
}: OperationBuilderProps): JSX.Element {
  const { options } = useContext(OperationContext);
  const [selectedType, setSelectedType] = useState<Input>(value.type);
  const [selectedValue, setSelectedValue] = useState('none');
  const [optionsType, setOptionsType] = useState<Input[]>(['none', 'none']);
  const [selectedArguments, setSelectedArguments] = useState<string[]>(['none', 'none']);

  const handleChangeSelected = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const selection = event.target.value;
    if (selection in options) {
      setSelectedType(selection as Input)
      setSelectedValue(options[selection][0]);
      return;
    }
    setSelectedValue(selection);
  }

  const handleClearOperation = (): void => {
    setSelectedType('none');
    setSelectedValue('none');
    onChange({
      ...value,
      children: [],
    });
  }

  const handleSelectArguments = (argValue: string, argIndex: number): void => {
    const updatedTypes = [...optionsType];
    const newValues = [...selectedArguments];
    if (argValue in options) {
      updatedTypes.splice(argIndex, 1, argValue as Input);
      newValues.splice(argIndex, 1, options[argValue][0]);
      setOptionsType(updatedTypes);
      setSelectedArguments(newValues);
      return;
    }
    newValues.splice(argIndex, 1, argValue);
    setSelectedArguments(newValues);
  }

  const handleClearArgument = (argIndex: number): void => {
    const updatedArgs = [...selectedArguments];
    const updatedOptionsTypes = [...optionsType];
    updatedArgs.splice(argIndex, 1, 'none');
    updatedOptionsTypes.splice(argIndex, 1, 'none');
    setSelectedArguments(updatedArgs);
    setOptionsType(updatedOptionsTypes);
  }

  const handleAddOperation = () => {
    const newOp: Operation = {
      id: new Date().getTime(),
      type: 'none',
      values: [],
      children: [],
    }
    const updatedValues = {
      ...value,
      children: [...value.children, newOp],
    };
    onChange(updatedValues);
  };

  const handleUpdateChildren = (newValues: Operation, id: number): void => {
    const childIndex = value.children.findIndex(child => child.id === id);
    if (childIndex !== -1) {
      const updatedValues = { ...value };
      updatedValues.children.splice(childIndex, 1, newValues);
      onChange(updatedValues);
    }
  }

  const updateValues = useCallback(() => {
    let newValues: string[] = [];
    const isLogical = selectedType === 'and' || selectedType === 'or';

    if (isLogical) {
      newValues = selectedArguments;
    }
    if (selectedType === 'argument' || selectedType === 'constant') {
      newValues = [selectedValue];
    }

    return {
      id: value.id,
      type: selectedType,
      values: newValues,
      children: value.children,
    };
  }, [selectedType, selectedValue, selectedArguments, value.id, value.children]);

  useEffect(() => {
    onChange(updateValues());
  }, [updateValues]);

  return (
    <div>
      <Selector
        type={selectedType}
        selected={selectedValue}
        onChange={event => handleChangeSelected(event)}
        onClick={() => handleClearOperation()}
      />

      {(selectedValue === 'and' || selectedValue === 'or') &&
        <div className="children">
          <Selector
            type={optionsType[0]}
            selected={selectedArguments[0]}
            onChange={event => handleSelectArguments(event.target.value, 0)}
            onClick={() => handleClearArgument(0)}
          />
          <Selector
            type={optionsType[1]}
            selected={selectedArguments[1]}
            onChange={event => handleSelectArguments(event.target.value, 1)}
            onClick={() => handleClearArgument(1)}
          />
          {(value.children ?? []).map(op =>
            <OperationBuilder
              key={op.id}
              value={op}
              onChange={value => handleUpdateChildren(value, op.id)}
            />
          )}

          <button
            type="button"
            onClick={() => handleAddOperation()}
            className="add-button"
          >
            + add op
          </button>
        </div>
      }
    </div>
  );
}

export default OperationBuilder;