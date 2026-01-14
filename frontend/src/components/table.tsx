import { Table } from "@chakra-ui/react"

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
          {items.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{item.username}</Table.Cell>
              <Table.Cell textAlign="end" bg={"bg.info"}>{item.score}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}

const items = [
  { username: "Laptop", score: 1000 },
  { username: "Coffee Maker", score: 150 },
  { username: "Desk Chair", score: 50.0 },
  { username: "Smartphone", score: 30 },
  { username: "j", score: 10 },
  { username: "b", score: 10 },
  { username: "c", score: 10 },
  { username: "d", score: 10 },
  { username: "e", score: 10 },
  { username: "f", score: 10 },
  { username: "g", score: 10 },
  { username: "h", score: 10 },
  { username: "i", score: 10 },
  { username: "k", score: 10 },
  { username: "a", score: 10 },
]
export default LeaderboardTable;