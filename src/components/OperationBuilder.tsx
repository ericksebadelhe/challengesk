import React, { useCallback, useContext, useEffect, useState } from 'react';
import Options from './Options';
import { OperationProps, Input } from '../types';
import { OperationContext } from '../App';

interface OperationBuilderProps {
  value: OperationProps;
  onChange: (value: OperationProps) => void;
}

function OperationBuilder({
  value,
  onChange,
}: OperationBuilderProps): JSX.Element {
  const { options } = useContext(OperationContext);
  const [defaultValues, setDefaultValues] = useState(value);
  const [selectedType, setSelectedType] = useState<Input>(value.type);
  const [selectedValue, setSelectedValue] = useState('none');
  const [optionsType, setOptionsType] = useState<Input[]>(['none', 'none']);
  const [selectedArguments, setSelectedArguments] = useState<string[]>(['none', 'none']);

  const handleChangeInput = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selection = event.target.value;
    if (selection in options) {
      setSelectedType(selection as Input)
      setSelectedValue(options[selection][0]);
      return;
    }
    setSelectedValue(selection);
  }

  const handleClearOperation = () => {
    setSelectedType('none');
    setSelectedValue('none');
    onChange({
      ...value,
      children: [],
    });
  }

  const handleSelectArguments = (argValue: string, argIndex: number): void => {
    if (argValue in options) {
      const updatedTypes = [...optionsType];
      updatedTypes.splice(argIndex, 1, argValue as Input);

      const newValues = [...selectedArguments];
      newValues.splice(argIndex, 1, options[argValue][0]);
      setSelectedArguments(newValues);

      setOptionsType(updatedTypes);
      setSelectedArguments(newValues);
      return;
    }
    const newValues = [...selectedArguments];
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
    const newOp: OperationProps = {
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

  const handleUpdateChildren = (newValues: OperationProps, id: number): void => {
    const childrenDataIndex = value.children.findIndex(val => val.id === id);
    if (childrenDataIndex !== -1) {
      const updatedValues = { ...value };
      updatedValues.children.splice(childrenDataIndex, 1, newValues);
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
    setDefaultValues(updateValues());
  }, [updateValues]);

  useEffect(() => {
    onChange(defaultValues);
  }, [defaultValues, onChange]);

return (
  <div>
    <Options
      type={selectedType}
      selected={selectedValue}
      onChange={event => handleChangeInput(event)}
      onClick={() => handleClearOperation()}
    />

    {(selectedValue === 'and' || selectedValue === 'or') &&
      <div className="children">
          <Options
            type={optionsType[0]}
            selected={selectedArguments[0]}
            onChange={event => handleSelectArguments(event.target.value, 0)}
            onClick={() => handleClearArgument(0)}
          />
          <Options
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