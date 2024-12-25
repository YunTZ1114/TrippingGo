import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async executeTransaction<T>(transactionCallback: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.$transaction(async (prisma) => await transactionCallback(prisma));
  }
}
