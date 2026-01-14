import Crypt from 'cryptjs';
import forge from 'node-forge';
import * as base64js from 'base64-js';
import platformPerimeter from '@/perimeters/platform.perimeter';

const SECRET_KEY = 'hkx85vMOBSM7M7W';
const MODE =
  platformPerimeter.isHkexEnv() || platformPerimeter.isNafmiiEnv()
    ? 'gcm'
    : 'cbc';
const BINARY_KEY_MODE = 'cbc';

const crypt = new Crypt(SECRET_KEY, MODE, BINARY_KEY_MODE);

export function updateBinaryKey(key) {
  crypt.decodeBinaryKey(key);
}

export function dataEncrypt(data, mode = MODE) {
  crypt.mode = mode;
  const encryptData = crypt.encrypt(data, mode === 'cbc' && SECRET_KEY);
  return encryptData;
}

export function dataDecrypt(data, mode = MODE) {
  crypt.mode = mode;
  const decryptData = crypt.decrypt(new Uint8Array(data));
  return decryptData;
}

export function handleBufferToData(data) {
  try {
    const processedData = new TextDecoder().decode(data);
    return processedData && JSON.parse(processedData);
  } catch (error) {
    return data;
  }
}

function uint8ArrayToBinaryString(u8a) {
  let s = '';
  for (let i = 0; i < u8a.length; i++) {
    s += String.fromCharCode(u8a[i]);
  }
  return s;
}

/**
 * 浏览器端解密 Python AES256-GCM Base64 数据
 */
export function decryptAES256GCM(base64Data) {
  // Base64 → Uint8Array
  const rawData = base64js.toByteArray(base64Data);

  const nonce = rawData.slice(0, 12);
  const ciphertextWithTag = rawData.slice(12);

  const tag = ciphertextWithTag.slice(-16);
  const ciphertext = ciphertextWithTag.slice(0, -16);

  // key 补齐到 32 字节
  const encoder = new TextEncoder();
  const keyBytes = new Uint8Array(32);
  keyBytes.set(encoder.encode(SECRET_KEY).slice(0, 32));

  // 转成 forge binary string
  const keyStr = uint8ArrayToBinaryString(keyBytes);
  const ivStr = uint8ArrayToBinaryString(nonce);
  const ctStr = uint8ArrayToBinaryString(ciphertext);
  const tagStr = uint8ArrayToBinaryString(tag);

  // 创建 cipher
  const cipher = forge.cipher.createDecipher('AES-GCM', keyStr);
  cipher.start({
    iv: ivStr,
    tag: tagStr,
    tagLength: 128,
  });

  cipher.update(forge.util.createBuffer(ctStr));

  const success = cipher.finish();
  if (!success) throw new Error('AES-GCM 解密失败（tag 校验失败）');

  const decryptedStr = cipher.output.getBytes();

  try {
    return JSON.parse(decryptedStr);
  } catch {
    return decryptedStr;
  }
}
