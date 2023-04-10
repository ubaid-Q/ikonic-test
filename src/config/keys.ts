import { generateKeyPairSync } from 'crypto';
import fs from 'fs';

export const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
});

// fs.writeFileSync('private.key', privateKey.export({ type: 'pkcs1', format: 'pem' }));

// fs.writeFileSync('public.key', publicKey.export({ type: 'pkcs1', format: 'pem' }));
