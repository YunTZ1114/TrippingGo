import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards, Request } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { LoginDto, SignUpDto } from './auth.dto';
import { AuthService } from './auth.service';
import { TokenService } from 'src/utils/token';
import { MailService } from '../mail/mail.service';
import { EncryptionService } from 'src/utils/encrypt';
import { TEST_MAIL, FE_URL } from 'src/utils/config';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @Post('login')
  async getUser(@Body() loginDto: LoginDto) {
    const errors = await validate(plainToClass(LoginDto, loginDto));
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed: ' + errors.toString());
    }

    const { email, password, stayLoggedIn } = loginDto;

    const user = await this.authService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    if (!user.isVerified) {
      throw new BadRequestException('The email is not verified yet.');
    }

    const isPasswordValid = await this.authService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials.');
    }

    const loginDuration = stayLoggedIn ? 30 : 1;
    const token = this.tokenService.generateToken(user.id, email, loginDuration);

    return { token: token, name: user.name, avatar: user.avatar, country: user.country };
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const errors = await validate(plainToClass(SignUpDto, signUpDto));
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed: ' + errors.toString());
    }

    const { email, password, name, country, gender } = signUpDto;
    const newUser = await this.authService.signUp(email, password, name, country, gender);

    const code = await this.authService.generateVerificationCode(email, 24);

    if (!code) {
      throw new BadRequestException('Encrypt failed');
    }

    const validationLink = `${FE_URL}/validation?code=${code}`;

    await this.mailService.sendMail(
      TEST_MAIL,
      newUser.id,
      'Welcome!',
      'Hello, welcome to our service!',
      `<h1>Hello</h1><p>Welcome to our service!</p>
      <a href="${validationLink}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>`,
      code,
      'SIGNUP',
    );

    return {
      message: 'User signUp successfully',
      userId: newUser.id,
    };
  }

  @Get('verify-sign-up')
  async verifySignUpEmail(@Query('code') code: string) {
    const decryptedData = this.encryptionService.decrypt(code);
    if (!decryptedData) {
      throw new BadRequestException('Invalid verification code.');
    }

    const { email, expiresAt } = decryptedData;
    const currentTime = new Date();

    if (currentTime > new Date(expiresAt)) {
      throw new BadRequestException('Verification code has expired.');
    }

    const user = await this.authService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    await this.authService.setUserIsVerified(user.id);
    await this.mailService.setMailIsUsed(code);

    return {
      message: 'Email verified successfully.',
    };
  }

  @Post('resend-verification-email')
  async resendVerificationEmail(@Body('email') email: string) {
    const user = await this.authService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const code = await this.authService.generateVerificationCode(email, 24);

    const validationLink = `${FE_URL}/validation?code=${code}`;

    await this.mailService.sendMail(
      TEST_MAIL,
      user.id,
      'Welcome Back!',
      'Hello, please verify your email!',
      `<h1>Hello</h1><p>Please verify your email!</p>
      <a href="${validationLink}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>`,
      code,
      'SIGNUP',
    );

    return {
      message: 'Verification email resent successfully.',
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.authService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist.');
    }

    const code = await this.authService.generateVerificationCode(email, 1);

    const resetLink = `${FE_URL}/reset-password?code=${code}`;

    await this.mailService.sendMail(
      user.email,
      user.id,
      'Password Reset Request',
      'You have requested to reset your password.',
      `<p>Hello,</p>
      <p>You requested to reset your password. Click the link below to reset your password:</p>
      <a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>`,
      code,
      'FORGOT_PASSWORD',
    );

    return { message: 'Password reset email sent.' };
  }

  @Get('verify-forgot-password')
  async verifyForgotPasswordEmail(@Query('code') code: string) {
    const decryptedData = this.encryptionService.decrypt(code);
    if (!decryptedData) {
      throw new BadRequestException('Invalid verification code.');
    }

    const { email, expiresAt } = decryptedData;
    const currentTime = new Date();

    if (currentTime > new Date(expiresAt)) {
      throw new BadRequestException('Verification code has expired.');
    }

    const user = await this.authService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    await this.mailService.setMailIsUsed(code);

    const loginDuration = 1;
    const token = this.tokenService.generateToken(user.id, email, loginDuration);

    return {
      message: 'Email verified successfully.',
      data: {
        token: token,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }

  @Post('reset-password')
  @UseGuards(AuthGuard)
  async resetPassword(@Request() req, @Body('password') password: string) {
    const userId = req.userId;
    const user = await this.authService.getUserById(userId);
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const isPasswordValid = await this.authService.comparePassword(password, user.password);
    if (isPasswordValid) {
      throw new BadRequestException('The password must not be the same as the old password.');
    }

    await this.authService.updateUserPassword(userId, password);

    return {
      message: 'Reset password successfully.',
    };
  }
}
