import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { MailService } from '../mail/mail.service';
import { Verify2FADto } from './dto/verify-2fa.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) throw new UnauthorizedException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
    });

    const token = this.signToken(user);
    return { token, user };
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.is2FAEnabled) {
      const code = this.generateCode(6);
      const codeHash = await bcrypt.hash(code, 10);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      const twoFactor = await this.prisma.twoFactor.create({
        data: { userId: user.id, codeHash, expiresAt },
      });

      await this.mailService.sendMail(
        user.email,
        'Your 2FA Code',
        `Your verification code is: ${code}`,
      );

      return { need2fa: true, tempToken: twoFactor.id.toString() };
    }

    const token = this.signToken(user);
    return { token, user };
  }

  private generateCode(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  }

  private signToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      isPremium: user.isPremium,
      isPsychologist: user.isPsychologist,
    };

    return this.jwtService.sign(payload);
  }

  async verifyTwoFactor(dto: Verify2FADto) {
    const twoFactor = await this.prisma.twoFactor.findUnique({
      where: { id: Number(dto.tempToken) },
      include: { user: true },
    });

    if (!twoFactor) throw new UnauthorizedException('Invalid 2FA token');
    if (twoFactor.used) throw new UnauthorizedException('2FA code already used');
    if (twoFactor.expiresAt < new Date()) throw new UnauthorizedException('2FA code expired');

    const valid = await bcrypt.compare(dto.code, twoFactor.codeHash);
    if (!valid) throw new UnauthorizedException('Invalid 2FA code');

    await this.prisma.twoFactor.update({
      where: { id: twoFactor.id },
      data: { used: true },
    });

    const token = this.signToken(twoFactor.user);
    return { token, user: twoFactor.user };
  }
}