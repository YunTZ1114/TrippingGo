import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseExpense } from 'src/types/expense.type';

@Injectable()
export class ExpenseService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getExpenses(tripId: number) {
    const expenses = await this.databaseService.expense.findMany({
      where: {
        tripId,
        isDeleted: false,
      },
      select: {
        id: true,
        tripMemberId: true,
        time: true,
        name: true,
        amount: true,
        description: true,
        imageUrl: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        expenseShare: {
          select: {
            id: true,
            tripMemberId: true,
            amount: true,
          },
        },
      },
      orderBy: {
        time: 'desc',
      },
    });

    return expenses;
  }

  async getExpenseShares(tripId: number) {
    const expenseShares = await this.databaseService.expenseShare.findMany({
      where: {
        isDeleted: false,
        expense: {
          tripId,
          isDeleted: false,
        },
      },
      select: {
        id: true,
        tripMemberId: true,
        amount: true,
        expense: {
          select: {
            tripMemberId: true,
            currency: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });

    const flattenedExpenseShares = expenseShares.map((item) => ({
      id: item.id,
      payerId: item.expense.tripMemberId,
      currencyCode: item.expense.currency.code,
      tripMemberId: item.tripMemberId,
      amount: Number(item.amount),
    }));

    const result = flattenedExpenseShares.reduce(
      (acc, { payerId, tripMemberId, currencyCode, amount }) => {
        if (payerId === tripMemberId) return acc;

        const getOrCreateMemberRecord = (memberId: number) => {
          let record = acc.find((r) => r.tripMemberId === memberId);
          if (!record) {
            record = { tripMemberId: memberId, share: [] };
            acc.push(record);
          }
          return record;
        };

        const getOrCreateCurrencyRecord = (memberRecord: any, code: string) => {
          let currency = memberRecord.share.find((s) => s.currencyCode === code);
          if (!currency) {
            currency = { currencyCode: code, balance: [] };
            memberRecord.share.push(currency);
          }
          return currency;
        };

        const updateBalance = (memberRecord: any, currencyCode: string, otherMemberId: number, amount: number) => {
          const currency = getOrCreateCurrencyRecord(memberRecord, currencyCode);
          let balance = currency.balance.find((b) => b.tripMemberId === otherMemberId);
          if (!balance) {
            balance = { tripMemberId: otherMemberId, amount: 0 };
            currency.balance.push(balance);
          }
          balance.amount += amount;
        };

        const payerRecord = getOrCreateMemberRecord(payerId);
        updateBalance(payerRecord, currencyCode, tripMemberId, amount);

        const memberRecord = getOrCreateMemberRecord(tripMemberId);
        updateBalance(memberRecord, currencyCode, payerId, -amount);

        return acc;
      },
      [] as Array<{
        tripMemberId: number;
        share: Array<{
          currencyCode: string;
          balance: Array<{
            tripMemberId: number;
            amount: number;
          }>;
        }>;
      }>,
    );

    return result;
  }

  async createExpense({
    tripId,
    tripMemberId,
    categoryId,
    currencyId,
    placeId,
    time,
    name,
    amount,
    description,
    imageUrl,
    expenseShares,
  }: BaseExpense & { tripId: number; tripMemberId: number }) {
    const expenseCategory = await this.databaseService.expenseCategory.findFirst({ where: { id: categoryId } });
    if (!expenseCategory) throw new HttpException('The expenseCategory is not found.', HttpStatus.NOT_FOUND);

    const expenseId = await this.databaseService.executeTransaction(async (prisma) => {
      const expense = await prisma.expense.create({
        data: {
          tripId,
          tripMemberId,
          categoryId,
          currencyId,
          placeId,
          time,
          name,
          amount,
          description,
          imageUrl,
        },
      });

      if (expenseShares?.length) {
        const tripMembers = await prisma.tripMember.findMany({
          where: {
            tripId,
          },
          select: {
            id: true,
          },
        });
        const validTripMemberIds = new Set(tripMembers.map((member) => member.id));

        let balance = amount;
        expenseShares.forEach(({ amount }) => (balance -= amount));

        if (balance !== 0) throw new HttpException(`The total for expenseShares' amount should equal expense amount.`, HttpStatus.BAD_REQUEST);

        const invalidMember = expenseShares.find((share) => !validTripMemberIds.has(share.tripMemberId));
        if (invalidMember)
          throw new HttpException(`TripMember with id ${invalidMember.tripMemberId} does not belong to this trip`, HttpStatus.BAD_REQUEST);

        await Promise.all(
          expenseShares.map(({ tripMemberId, amount }) =>
            prisma.expenseShare.create({
              data: {
                expenseId: expense.id,
                tripMemberId,
                amount,
              },
            }),
          ),
        );
      }

      return expense.id;
    });

    return { expenseId };
  }

  async updateExpense({
    id,
    tripId,
    categoryId,
    currencyId,
    placeId,
    time,
    name,
    amount,
    description,
    imageUrl,
    expenseShares,
  }: BaseExpense & { tripId: number; id: number }) {
    const expenseCategory = await this.databaseService.expenseCategory.findFirst({ where: { id: categoryId } });
    if (!expenseCategory) throw new HttpException('The expenseCategory is not found.', HttpStatus.NOT_FOUND);

    await this.databaseService.executeTransaction(async (prisma) => {
      const expense = await prisma.expense.update({
        where: {
          id,
        },
        data: {
          categoryId,
          currencyId,
          placeId,
          time,
          name,
          amount,
          description,
          imageUrl,
        },
      });

      await prisma.expenseShare.deleteMany({
        where: {
          expenseId: expense.id,
        },
      });

      if (expenseShares?.length) {
        const tripMembers = await prisma.tripMember.findMany({
          where: {
            tripId,
          },
          select: {
            id: true,
          },
        });
        const validTripMemberIds = new Set(tripMembers.map((member) => member.id));

        const invalidMember = expenseShares.find((share) => !validTripMemberIds.has(share.tripMemberId));
        if (invalidMember)
          throw new HttpException(`TripMember with id ${invalidMember.tripMemberId} does not belong to this trip`, HttpStatus.BAD_REQUEST);

        await Promise.all(
          expenseShares.map(({ tripMemberId, amount }) =>
            prisma.expenseShare.create({
              data: {
                expenseId: expense.id,
                tripMemberId,
                amount,
              },
            }),
          ),
        );
      }
    });
  }

  async deleteExpense({ id, tripId }: { id: number; tripId: number }) {
    const expense = await this.databaseService.expense.findFirst({ where: { id } });
    if (expense?.tripId != tripId) throw new HttpException('The expense is not found.', HttpStatus.NOT_FOUND);

    await this.databaseService.executeTransaction(async (prisma) => {
      await prisma.expense.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
        },
      });

      await prisma.expenseShare.updateMany({
        where: {
          expenseId: id,
        },
        data: {
          isDeleted: true,
        },
      });
    });
  }
}
