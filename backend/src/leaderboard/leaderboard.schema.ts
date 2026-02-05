import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Entry {
  @Field()
  username: string;

  @Field(() => Int)
  score: number;
}
