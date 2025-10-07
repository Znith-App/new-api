import { Controller, Get, Post, Param, Patch, Body, Delete } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Goals')
@Controller('goals')
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) { }

    @Post(':userId')
    @ApiOperation({ summary: 'Create a new goal for a user' })
    @ApiParam({ name: 'userId', description: 'ID of the user creating the goal' })
    @ApiBody({ type: CreateGoalDto })
    create(@Param('userId') userId: string, @Body() dto: CreateGoalDto) {
        return this.goalsService.create(Number(userId), dto);
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Get all goals for a user' })
    @ApiParam({ name: 'userId', description: 'ID of the user' })
    findAll(@Param('userId') userId: string) {
        return this.goalsService.findAllByUser(Number(userId));
    }

    @Get('detail/:id')
    @ApiOperation({ summary: 'Get details of a specific goal' })
    @ApiParam({ name: 'id', description: 'ID of the goal' })
    findOne(@Param('id') id: string) {
        return this.goalsService.findOne(Number(id));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a goal' })
    @ApiParam({ name: 'id', description: 'ID of the goal to update' })
    @ApiBody({ type: UpdateGoalDto })
    update(@Param('id') id: string, @Body() dto: UpdateGoalDto) {
        return this.goalsService.update(Number(id), dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a goal' })
    @ApiParam({ name: 'id', description: 'ID of the goal to delete' })
    remove(@Param('id') id: string) {
        return this.goalsService.remove(Number(id));
    }

    @Patch('toggle-status/:id')
    @ApiOperation({ summary: 'Toggle the status of a goal between COMPLETED and PENDING' })
    @ApiParam({ name: 'id', description: 'ID of the goal to toggle' })
    toggleStatus(@Param('id') id: string) {
        return this.goalsService.toggleStatus(Number(id));
    }

    @Patch('cancel/:id')
    @ApiOperation({ summary: 'Cancel a goal (set status to CANCELLED)' })
    @ApiParam({ name: 'id', description: 'ID of the goal to cancel' })
    cancel(@Param('id') id: string) {
        return this.goalsService.cancelGoal(Number(id));
    }

    @Patch('outdated/:id')
    @ApiOperation({ summary: 'Mark a goal as OUTDATED' })
    @ApiParam({ name: 'id', description: 'ID of the goal to mark as outdated' })
    markOutdated(@Param('id') id: string) {
        return this.goalsService.markOutdated(Number(id));
    }
}