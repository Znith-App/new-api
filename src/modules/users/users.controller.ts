import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by ID.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user data' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(Number(id), dto);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Change user password' })
  changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(Number(id), dto.newPassword);
  }
  
  @Patch(':id/email')
  @ApiOperation({ summary: 'Change user email' })
  changeEmail(@Param('id') id: string, @Body('newEmail') newEmail: string) {
    return this.usersService.changeEmail(Number(id), newEmail);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete user' })
  softDelete(@Param('id') id: string) {
    return this.usersService.softDelete(Number(id));
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore deleted user' })
  restore(@Param('id') id: string) {
    return this.usersService.restore(Number(id));
  }

  @Get()
  @ApiOperation({ summary: 'List all active users' })
  findAllActive() {
    return this.usersService.findAllActive();
  }

  @Patch(':id/make-premium')
  @ApiOperation({ summary: 'Make user premium' })
  makeUserPremium(@Param('id') id: string) {
    return this.usersService.makeUserPremium(Number(id));
  }

  @Patch(':id/revoke-premium')
  @ApiOperation({ summary: 'Revoke user premium status' })
  revokeUserPremium(@Param('id') id: string) {
    return this.usersService.revokeUserPremium(Number(id));
  }

  @Patch(':id/make-admin')
  @ApiOperation({ summary: 'Make user admin' })
  makeUserAdmin(@Param('id') id: string) {
    return this.usersService.makeUserAdmin(Number(id));
  }

  @Patch(':id/revoke-admin')
  @ApiOperation({ summary: 'Revoke user admin status' })
  revokeUserAdmin(@Param('id') id: string) {
    return this.usersService.revokeUserAdmin(Number(id));
  }

  @Patch(':id/make-psychologist')
  @ApiOperation({ summary: 'Make user psychologist' })
  makeUserPsychologist(@Param('id') id: string) {
    return this.usersService.makeUserPsychologist(Number(id));
  }
  
  @Patch(':id/revoke-psychologist')
  @ApiOperation({ summary: 'Revoke user psychologist status' })
  revokeUserPsychologist(@Param('id') id: string) {
    return this.usersService.revokeUserPsychologist(Number(id));
  }

  @Patch(':id/enable-2fa')
  @ApiOperation({ summary: 'Enable 2FA for user' })
  enable2FA(@Param('id') id: string) {
    return this.usersService.enable2FA(Number(id));
  }

  @Patch(':id/disable-2fa')
  @ApiOperation({ summary: 'Disable 2FA for user' })
  disable2FA(@Param('id') id: string) {
    return this.usersService.disable2FA(Number(id));
  }
}