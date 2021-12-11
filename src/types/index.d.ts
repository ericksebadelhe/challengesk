export type Args = { [argname: string]: boolean };
export type Operation = {
  operator: string;
  args: string[];
};
export type Input = 'constant' | 'argument' | 'and' | 'or' | 'none';

export interface OperationProps {
  id: number,
  type: Input;
  values: string[];
  children: OperationProps[];
}