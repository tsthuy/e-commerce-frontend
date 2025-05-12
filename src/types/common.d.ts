import type { Dispatch, FunctionComponent, MutableRefObject, SetStateAction, SVGProps } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = any;
export type StringOrNull = string | null;
export type StringOrNumber = string | number;
export type NumberOrNull = number | null;
export type BooleanOrNumber = boolean | number;

export type Base64Type = string | ArrayBuffer | null;

export type RefType<T> = MutableRefObject<T>;
export type SetStateType<T> = Dispatch<SetStateAction<T>>;

export type IconSvgType = FunctionComponent<
  SVGProps<SVGSVGElement> & {
    title?: string;
  }
>;

export type SetStoreType<T> = (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean | undefined) => void;

export type AtLeastOneField<T> = Partial<T> &
  {
    [K in keyof T]: Pick<T, K>;
  }[keyof T];
