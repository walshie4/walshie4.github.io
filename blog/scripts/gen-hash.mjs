/**
 * Generate a SHA-256 hash for your private section password.
 * Usage: node scripts/gen-hash.mjs yourpassword
 * Then put the output in your .env as PUBLIC_PASSWORD_HASH=<hash>
 */
import { createHash } from 'crypto';

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/gen-hash.mjs <password>');
  process.exit(1);
}

const hash = createHash('sha256').update(password).digest('hex');
console.log(`\nPassword hash for "${password}":\n`);
console.log(hash);
console.log(`\nAdd to .env:\nPUBLIC_PASSWORD_HASH=${hash}\n`);
