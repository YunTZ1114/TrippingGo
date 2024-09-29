import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';

@Injectable()
export class TokenService {
  async generateToken(userId: number, email: string, days: number): Promise<string> {
    const currentTime = new Date();
    const expiresAt = new Date(currentTime);
    expiresAt.setDate(currentTime.getDate() + days);

    const payload = {
      userId: userId,
      email: email,
      expiresAt: expiresAt,
    };

    const secret = JWT_SECRET ?? '';
    const expiresTime = `${days}d`;
    const options = {
      expiresIn: expiresTime,
    };

    const jwtToken = jwt.sign(payload, secret, options);

    return jwtToken;
  }

  async verifyJwtToken(token: string, secret: string = JWT_SECRET ?? ''): Promise<JwtPayload> {
    return new Promise<JwtPayload>((resolve, reject) => {
      try {
        const decoded = jwt.verify(token, secret);
        resolve(decoded as JwtPayload);
      } catch (err) {
        reject(err);
      }
    });
  }
}
