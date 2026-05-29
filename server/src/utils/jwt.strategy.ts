import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtStrategyPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // secret key must be same with signIn function
      secretOrKey: 'YOUR_SECREY_KEY',
    });
  }

  validate(payload: JwtStrategyPayload) {
    return { sub: payload.sub, email: payload.email };
  }
}
