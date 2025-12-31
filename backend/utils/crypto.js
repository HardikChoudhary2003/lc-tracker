import crypto from 'crypto';

const rawKey = process.env.LEETCODE_KEY_ENCRYPTION_SECRET || 'ab4f9fcd9442360a68b7efeb0d2b1918da3b2dd8e501938a0b0a8b14c351c3de';
const ENCRYPTION_KEY = Buffer.from(rawKey, 'hex'); // 32-byte key

const IV_LENGTH = 16;

export function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text) {
    try {
        const textParts = text.split(':');
        if (textParts.length !== 2) throw new Error('Invalid encrypted text format');

        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedText = Buffer.from(textParts[1], 'hex');

        const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (err) {
        console.error('Decryption error:', err.message);
        throw new Error('Failed to decrypt. Check encryption key or data.');
    }
}
