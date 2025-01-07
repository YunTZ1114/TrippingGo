import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserPreview } from 'src/types/user.type';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUser(userId: number): Promise<UserPreview> {
    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    });

    return user;
  }

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
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    });

    return users;
  }
}
