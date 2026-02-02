import { Injectable } from '@nestjs/common';
import { Entry } from './interfaces/entry.interface';
import { ClientEntry } from './interfaces/client-entry.interface';

@Injectable()
export class LeaderboardService {
  private readonly leaderboardEntries: Entry[] = [];

  create(clientEntry: ClientEntry) {
    console.log(clientEntry);
    // TODO: Placement update
    const entry: Entry = {
      ...clientEntry,
      placement: 0, // Temp
    };
    this.leaderboardEntries.push(entry);
  }

  find(start: number, amount: number): Entry[] {
    return this.leaderboardEntries;
  }
}
