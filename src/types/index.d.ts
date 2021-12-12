export type Args = { [argname: string]: boolean };

export type Input = 'constant' | 'argument' | 'and' | 'or' | 'none';

export interface Operation {
  id: number,
  type: Input;
  values: string[];
  children: Operation[];
}