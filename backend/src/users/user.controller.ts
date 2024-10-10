import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getUser(@Request() req) {
    const { userId } = req;

    const user = await this.userService.getUser(userId);

    return { data: user };
  }

  @Get('')
  async getUsers(@Request() req, @Query('q') q: string, @Query('limit') limit: number) {
    const { userId } = req;

    const users = await this.userService.getUsers(q, limit, userId);

    return users;
  }
}
