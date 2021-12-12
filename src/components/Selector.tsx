import React, { useContext } from 'react';
import { OperationContext } from '../App';
import { Input } from '../types';

interface SelectorProps {
  type: Input;
  selected: any;
  showButton?: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onClick?: () => void;
}

export default function Selector({
  type,
  selected,
  showButton = true,
  onChange,
  onClick,
}: SelectorProps): JSX.Element {
  const { options } = useContext(OperationContext);

  return (
    <div>
      <select value={selected} onChange={onChange}>
        <option disabled value="none">
          select...
        </option>
        {options[type].map((opt: any) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {showButton && (
        <button type="button" onClick={onClick}>
          x
        </button>
      )}
    </div>
  );
}