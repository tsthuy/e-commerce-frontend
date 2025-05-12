import type { AnyType } from '~/types';

export function typedEntries<T extends Record<string, AnyType>>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}
