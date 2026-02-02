import { useEffect, useRef, useState } from "react";
import { Table } from "@chakra-ui/react";
import { fetchData } from "../api";

interface Entry {
  placement: number;
  name: string;
  score: number;
}

const LeaderboardTable = () => {
  const [items, setItems] = useState<Entry[]>([]);
  const mountedRef = useRef(false);

  useEffect(() => {
    const getData = async () => {
      if (mountedRef.current) return;
      mountedRef.current = true;
      try {
        const responseData = await fetchData<Entry[]>("leaderboard");
        setItems(responseData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getData();
  }, []);

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
          {items
            .sort((a, b) => {
              if (a.score < b.score) return 1;
              if (a.score > b.score) return -1;
              return 0;
            })
            .map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell textAlign="end" bg={"bg.info"}>
                  {item.score}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default LeaderboardTable;
