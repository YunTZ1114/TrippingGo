import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserPreview } from 'src/types/user.type';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUsers(q: string, limit: number, userId: number): Promise<UserPreview[]> {
    const users = await this.databaseService.user.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive',
        },
        id: {
          not: userId,
        },
      },
      take: limit,
    });

    return users;
  }
}
