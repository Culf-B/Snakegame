import { Injectable } from '@nestjs/common';
import { Entry } from './leaderboard.schema';

@Injectable()
export class LeaderboardService {
  private readonly leaderboardEntries: Entry[] = [];

  create(username: string, score: number) {
    const newEntry = {
      username,
      score,
    };
    this.leaderboardEntries.push(newEntry);
    return newEntry;
  }

  getAll(): Entry[] {
    return this.leaderboardEntries;
  }
}
