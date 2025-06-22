import { mkdir, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = join(__dirname, '../../temp');

export async function ensureTempDir() {
  if (!existsSync(TEMP_DIR)) {
    await mkdir(TEMP_DIR, { recursive: true });
  }
  return TEMP_DIR;
}

export async function cleanupTempFile(filePath) {
  try {
    await rm(filePath);
  } catch (error) {
    console.error('Failed to cleanup temp file:', error);
  }
}

//loqmanas (l.q1)