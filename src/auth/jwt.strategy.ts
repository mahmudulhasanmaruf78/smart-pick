import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '../common/enums/role.enum';
import { VerificationStatus } from '../common/enums/verification-status.enum';

export interface JwtPayload {
  sub: number;
  email?: string;
  role: Role;
  riderVerification?: { status: VerificationStatus };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ?? 'smart-pick-secret',
    });
  }

  validate(payload: JwtPayload) {
    if (!payload?.sub) {
      throw new UnauthorizedException();
    }
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      riderVerification: payload.riderVerification,
    };
  }
}
