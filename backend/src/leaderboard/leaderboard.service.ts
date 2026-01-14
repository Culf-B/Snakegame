import { Injectable } from '@nestjs/common';
import { Entry } from './entry.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LeaderboardService {
    private learderboard: Entry[] = [];

    getLeaderboard(): Entry[] {
        return this.learderboard;
    }

    createEntry(username: string, score: number): Entry {
        const entry: Entry = {
        id: uuid(),
        username,
        score
        };
        this.learderboard.push(entry);
        return entry;
    }
}