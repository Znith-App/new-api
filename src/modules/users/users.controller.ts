import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário pelo ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do usuário' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(Number(id), dto);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Alterar senha do usuário' })
  changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(Number(id), dto.newPassword);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete do usuário' })
  softDelete(@Param('id') id: string) {
    return this.usersService.softDelete(Number(id));
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurar usuário deletado' })
  restore(@Param('id') id: string) {
    return this.usersService.restore(Number(id));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos usuários ativos' })
  findAllActive() {
    return this.usersService.findAllActive();
  }
}