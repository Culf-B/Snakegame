import { Table } from "@chakra-ui/react";
import { gql, type TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

type GetLeaderboardQuery = {
  getLeaderboard: {
    __typename: "Entry";
    username: string;
    score: number;
  }[];
};

type GetLeaderboardQueryVariables = Record<string, never>;

const GET_LEADERBOARD: TypedDocumentNode<
  GetLeaderboardQuery,
  GetLeaderboardQueryVariables
> = gql`
  query GetLeaderboard {
    getLeaderboard {
      username
      score
    }
  }
`;

function DisplayLocations() {
  const { loading, error, data } = useQuery(GET_LEADERBOARD);

  if (loading || data == undefined)
    return (
      <Table.Row>
        <Table.Cell>Loading...</Table.Cell>
      </Table.Row>
    );
  if (error)
    return (
      <Table.Row>
        <Table.Cell>Error : {error.message}</Table.Cell>
      </Table.Row>
    );
  const sortedLeaderboard = [...data.getLeaderboard].sort((a, b) => {
    if (a.score < b.score) return 1;
    if (a.score > b.score) return -1;
    return 0;
  });

  return sortedLeaderboard.map((item, index) => (
    <Table.Row key={index}>
      <Table.Cell>{index + 1}</Table.Cell>
      <Table.Cell>{item.username}</Table.Cell>
      <Table.Cell textAlign="end" bg={"bg.info"}>
        {item.score}
      </Table.Cell>
    </Table.Row>
  ));
}

const LeaderboardTable = () => {
  return (
    <Table.ScrollArea borderWidth="1px" rounded="md" maxH="75vh" margin={"5"}>
      <Table.Root stickyHeader>
        <Table.Header textStyle="2xl">
          <Table.Row bg="bg.subtle">
            <Table.ColumnHeader>Position</Table.ColumnHeader>
            <Table.ColumnHeader>Username</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Score</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body textStyle="xl">
          <DisplayLocations />
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default LeaderboardTable;
