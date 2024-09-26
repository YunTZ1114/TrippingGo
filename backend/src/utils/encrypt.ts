import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly encryptionKey: Buffer;
  private readonly ivLength = 16;

  constructor() {
    if (!process.env.LINK_ENCRYPTION_KEY) {
      throw new Error('LINK_ENCRYPTION_KEY environment variable is required');
    }
    this.encryptionKey = Buffer.from(process.env.LINK_ENCRYPTION_KEY);
  }

  encrypt(obj: Record<any, any>): string | false {
    try {
      const data = JSON.stringify(obj);

      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.encryptionKey), iv);

      let encrypted = cipher.update(data, 'utf-8', 'hex');
      encrypted += cipher.final('hex');

      return `${iv.toString('hex')}:${encrypted}`;
    } catch (err) {
      console.error('Encryption failed:', err);
      return false;
    }
  }

  decrypt(encryptedData: string): Record<any, any> | false {
    try {
      const [ivHex, encryptedText] = encryptedData.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.encryptionKey), iv);

      let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');

      const decryptedObject = JSON.parse(decrypted);
      return decryptedObject;
    } catch (err) {
      console.error('Decryption failed:', err);
      return false;
    }
  }
}
