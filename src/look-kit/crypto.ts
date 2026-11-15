// Ed25519 check and hex SHA-512 over the vendored nacl-verify.ts; nothing else imports that file.
import { sha512, verify } from './nacl-verify';

// Group order L of the Ed25519 base point, little-endian bytes.
const L = [
  0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10,
];

// Encodings (sign bit cleared, hex) of the small-order points, including the non-canonical encodings of y = 0 and y = 1.
const SMALL_ORDER_Y = [
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0100000000000000000000000000000000000000000000000000000000000000',
  'ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f',
  'edffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f',
  'eeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f',
  '26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05',
  'c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a',
];

const toHex = (bytes: Uint8Array): string => {
  let out = '';
  for (let i = 0; i < bytes.length; i++) out += (bytes[i] + 256).toString(16).slice(1);
  return out;
};

// True when S, bytes 32-63 of the signature read little-endian, is below L.
const scalarBelowL = (sig: Uint8Array): boolean => {
  for (let i = 31; i >= 0; i--) {
    const s = sig[32 + i];
    if (s !== L[i]) return s < L[i];
  }
  return false;
};

/** True only for a 64-byte signature with S below L that verifies for a 32-byte key of large order; false for anything else, never a throw. */
export const verifyEd25519 = (sig: Uint8Array, msg: Uint8Array, publicKey: Uint8Array): boolean => {
  if (sig.length !== 64 || publicKey.length !== 32 || !scalarBelowL(sig)) return false;
  const y = publicKey.slice();
  y[31] &= 0x7f;
  if (SMALL_ORDER_Y.includes(toHex(y))) return false;
  try {
    return verify(msg, sig, publicKey);
  } catch {
    return false;
  }
};

/** Lower-case hex SHA-512 of the bytes. */
export const sha512Hex = (bytes: Uint8Array): string => toHex(sha512(bytes));
