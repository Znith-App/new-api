import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async changePassword(id: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async changeEmail(id: number, newEmail: string) {
    return this.prisma.user.update({
      where: { id },
      data: { email: newEmail },
    });
  }

  async softDelete(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async findAllActive() {
    return this.prisma.user.findMany({ where: { deletedAt: null } });
  }

  async makeUserPremium(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { isPremium: true },
    });
  }

  async revokeUserPremium(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { isPremium: false },
    });
  }

  async makeUserAdmin(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { isAdmin: true },
    });
  }

  async revokeUserAdmin(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { isAdmin: false },
    });
  }

  async makeUserPsychologist(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { isPsychologist: true },
    });
  }

  async revokeUserPsychologist(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { isPsychologist: false },
    });
  }

  async enable2FA(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { is2FAEnabled: true },
    });
  }

  async disable2FA(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { is2FAEnabled: false },
    });
  }
}
