import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LeaderboardService } from './leaderboard.service';
import { Entry } from './leaderboard.schema';

@Resolver(() => Entry)
export class LeaderboardResolver {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Query(() => [Entry])
  getLeaderboard() {
    return this.leaderboardService.getAll();
  }

  @Mutation(() => Entry)
  addScore(
    @Args('username') username: string,
    @Args('score', { type: () => Int }) score: number,
  ): Entry {
    return this.leaderboardService.create(username, score);
  }
}
