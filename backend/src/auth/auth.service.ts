import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { EncryptionService } from 'src/utils/encrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly encryptionService: EncryptionService,
  ) {}
  private readonly pepper = process.env.PEPPER;

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password + this.pepper, salt);
    return hashedPassword;
  }

  async comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword + this.pepper, hashedPassword);
  }

  async getUserById(userId: number) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });
    return user;
  }

  async signUp(email: string, password: string, name: string, country: string, gender: string) {
    const existingUser = await this.databaseService.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.databaseService.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        country,
        gender,
      },
    });

    return newUser;
  }

  async setUserIsVerified(userId: number): Promise<void> {
    const user = await this.databaseService.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found.');
    }

    await this.databaseService.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });
  }

  async updateUserPassword(userId: number, password: string): Promise<void> {
    const user = await this.databaseService.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found.');
    }

    const hashPassword = await this.hashPassword(password);

    await this.databaseService.user.update({
      where: { id: user.id },
      data: { password: hashPassword },
    });
  }

  async generateVerificationCode(email: string, hours: number): Promise<string> {
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
    const payload = { email, expiresAt };

    const code = this.encryptionService.encrypt(payload);

    if (!code) {
      throw new Error('Encrypt failed');
    }

    return code;
  }
}
