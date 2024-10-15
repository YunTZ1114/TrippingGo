import { HttpException, HttpStatus, BadRequestException, Body, Controller, Get, Post, Query, UseGuards, Request } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { LoginDto, SignUpDto } from './auth.dto';
import { AuthService } from './auth.service';
import { TokenService } from 'src/utils/token';
import { MailService } from '../mails/mail.service';
import { EncryptionService } from 'src/utils/encrypt';
import { TEST_MAIL, FE_URL, GOOGLE_OAUTH_ID } from 'src/config';
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
  async login(@Body() loginDto: LoginDto) {
    const { email, password, stayLoggedIn } = loginDto;

    const user = await this.authService.getUserByEmail(email);
    if (!user) throw new HttpException({ message: 'User not found.' }, HttpStatus.NOT_FOUND);

    if (!user.isVerified) throw new HttpException({ message: 'The email is not verified yet.' }, HttpStatus.FORBIDDEN);

    const isPasswordValid = await this.authService.comparePassword(password, user.password);
    if (!isPasswordValid) throw new HttpException({ message: 'Invalid credentials.' }, HttpStatus.UNAUTHORIZED);

    const loginDuration = stayLoggedIn ? 30 : 1;
    const token = await this.tokenService.generateToken(user.id, email, loginDuration);

    return { data: { token: token, name: user.name, avatar: user.avatar } };
  }

  @Post('google-login')
  async getUser(@Body('credential') credential: string) {
    const client = new OAuth2Client(GOOGLE_OAUTH_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_OAUTH_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new HttpException({ message: 'Invalid Google token.' }, HttpStatus.BAD_REQUEST);

    const email = payload.email;
    if (!email) throw new BadRequestException('Google login failed, no email found.');

    const user = await this.authService.getUserByEmail(email);
    if (!user) throw new HttpException({ message: 'User not found.' }, HttpStatus.NOT_FOUND);

    if (!user.isVerified) throw new HttpException({ message: 'The email is not verified yet.' }, HttpStatus.FORBIDDEN);

    const loginDuration = 1;
    const token = await this.tokenService.generateToken(user.id, email, loginDuration);

    return { data: { token: token, name: user.name, avatar: user.avatar } };
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const { email, password, name, countryId, gender } = signUpDto;
    const existingUser = await this.authService.getUserByEmail(email);
    if (existingUser) throw new HttpException({ message: 'Email is already registered.' }, HttpStatus.CONFLICT);

    const newUser = await this.authService.signUp(email, password, name, countryId, gender);

    const code = await this.authService.generateVerificationCode(email, 24);
    if (!code) throw new HttpException({ message: 'Failed to generate verification code.' }, HttpStatus.INTERNAL_SERVER_ERROR);

    const validationLink = `${FE_URL}/verify/sign-up?code=${code}`;

    await this.mailService.sendMail({
      recipient: TEST_MAIL,
      userId: newUser.id,
      subject: 'Welcome!',
      plainText: 'Hello, welcome to our service!',
      htmlContent: `<h1>Hello</h1><p>Welcome to our service!</p>
                    <a href="${validationLink}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>`,
      verificationCode: code,
      type: 'SIGNUP',
    });

    return { data: { userId: newUser.id } };
  }

  @Get('verify-sign-up')
  async verifySignUpEmail(@Query('code') code: string) {
    const decryptedData = this.encryptionService.decrypt(code);
    if (!decryptedData) throw new HttpException({ message: 'Invalid verification code.' }, HttpStatus.BAD_REQUEST);

    const { email, expiresAt } = decryptedData;
    const currentTime = new Date();

    if (currentTime > new Date(expiresAt)) throw new HttpException({ message: 'Verification code has expired.' }, HttpStatus.FORBIDDEN);

    const user = await this.authService.getUserByEmail(email);
    if (!user) throw new HttpException({ message: 'User not found.' }, HttpStatus.NOT_FOUND);

    await this.authService.setUserIsVerified(user.id);
    await this.mailService.setMailIsUsed(code);

    return {
      message: 'Email verified successfully.',
    };
  }

  @Post('resend-sign-up-email')
  async resendVerificationEmail(@Body('email') email: string) {
    const user = await this.authService.getUserByEmail(email);
    if (!user) throw new HttpException({ message: 'User not found.' }, HttpStatus.NOT_FOUND);

    if (user.isVerified) throw new HttpException({ message: 'User is already verified.' }, HttpStatus.CONFLICT);

    const code = await this.authService.generateVerificationCode(email, 24);

    const validationLink = `${FE_URL}/verify/sign-up?code=${code}`;

    await this.mailService.sendMail({
      recipient: TEST_MAIL,
      userId: user.id,
      subject: 'Welcome Back!',
      plainText: 'Hello, please verify your email!',
      htmlContent: `<h1>Hello</h1><p>Please verify your email!</p>
                    <a href="${validationLink}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>`,
      verificationCode: code,
      type: 'SIGNUP',
    });

    return {
      message: 'Verification email resent successfully.',
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.authService.getUserByEmail(email);
    if (!user) throw new HttpException({ message: 'User with this email does not exist.' }, HttpStatus.NOT_FOUND);

    const code = await this.authService.generateVerificationCode(email, 1);

    const resetLink = `${FE_URL}/verify/forgot-password?code=${code}`;

    await this.mailService.sendMail({
      recipient: user.email,
      userId: user.id,
      subject: 'Password Reset Request',
      plainText: 'You have requested to reset your password.',
      htmlContent: `
        <p>Hello,</p>
        <p>You requested to reset your password. Click the link below to reset your password:</p>
        <a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
      verificationCode: code,
      type: 'FORGOT_PASSWORD',
    });

    return { message: 'Password reset email sent.' };
  }

  @Get('verify-forgot-password')
  async verifyForgotPasswordEmail(@Query('code') code: string) {
    const decryptedData = this.encryptionService.decrypt(code);
    if (!decryptedData) throw new BadRequestException('Invalid verification code.');

    const { email, expiresAt } = decryptedData;
    const currentTime = new Date();

    if (currentTime > new Date(expiresAt)) throw new HttpException({ message: 'Verification code has expired.' }, HttpStatus.GONE);

    const user = await this.authService.getUserByEmail(email);
    if (!user) throw new HttpException({ message: 'User not found.' }, HttpStatus.NOT_FOUND);

    await this.mailService.setMailIsUsed(code);

    const loginDuration = 1;
    const token = await this.tokenService.generateToken(user.id, email, loginDuration);

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
    if (!user) throw new HttpException({ message: 'User not found.' }, HttpStatus.NOT_FOUND);

    const isPasswordValid = await this.authService.comparePassword(password, user.password);
    if (isPasswordValid) throw new BadRequestException('The new password must not be the same as the old password.');

    await this.authService.updateUserPassword(userId, password);

    return {
      message: 'Reset password successfully.',
    };
  }
}
