import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
  constructor() {
    super();
  }

  async executeTransaction<T>(transactionCallback: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(async () => {
      try {
        return await transactionCallback(this);
      } catch (error) {
        console.error('Transaction failed:', error);
        throw new Error('Transaction failed');
      }
    });
  }
}
