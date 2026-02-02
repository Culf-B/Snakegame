import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [LeaderboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
