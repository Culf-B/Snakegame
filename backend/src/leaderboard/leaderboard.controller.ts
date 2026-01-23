import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateEntryDto } from './dto/create-entry.dto';
import { LeaderboardService } from './leaderboard.service';
import { Entry } from './interfaces/entry.interface';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  async findEntries(
    @Param('start') start: number,
    @Param('amount') amount: number,
  ): Promise<Entry[]> {
    return this.leaderboardService.find(start, amount);
  }

  @Post()
  async create(@Body() createEntryDto: CreateEntryDto) {
    // ClientEntry interface and CreateEntry dto is compatible.
    // If they get changed to be incompatible, translation should be added here.
    this.leaderboardService.create(createEntryDto);
  }
}
