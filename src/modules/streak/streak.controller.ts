import { Controller } from '@nestjs/common';
import { Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StreakService } from './streak.service';

@ApiTags('streak')
@Controller('streak')
export class StreakController {
    constructor(private readonly streakService: StreakService) {}

    @Get(':userId')
    @ApiOperation({ summary: 'Get streak by user ID.' })
    getStreakByUserId(@Param('userId') userId: number) {
        return this.streakService.getStreakByUserId(Number(userId));
    }

    @Get('update/:userId')
    @ApiOperation({ summary: 'Update streak by user ID.' })
    updateStreak(@Param('userId') userId: number) {
        return this.streakService.updateStreak(userId);
    }
}
