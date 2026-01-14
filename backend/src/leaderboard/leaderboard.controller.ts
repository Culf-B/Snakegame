import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { Entry } from './entry.model';

@Controller('leaderboard')
export class LeaderboardController {
    constructor(private leaderboardService: LeaderboardService) {}

    @Get()
    getLeaderboard(): Entry[] {
        return this.leaderboardService.getLeaderboard();
    }

    @Post()
    createTask(
        @Body('name') name: string,
        @Body('score') score: number,
    ): Entry {
        return this.leaderboardService.createEntry(name, score);
    }
}