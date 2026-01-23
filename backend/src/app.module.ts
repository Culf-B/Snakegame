import { Module } from '@nestjs/common';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [LeaderboardModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
