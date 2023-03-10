export type Topic = {
  [name: string]: null | {
    partition?: number;
    offset?: number;
  };
};
