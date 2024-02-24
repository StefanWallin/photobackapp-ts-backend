import { customAlphabet } from 'nanoid';

// ignore all characters that might look the same in different fonts - l1 O0 il etc
const nanoid = customAlphabet(
  'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789',
  4
);

export const safeId = () => {
  // more human readable with a hyphen
  return `${nanoid()}-${nanoid()}`;
};
