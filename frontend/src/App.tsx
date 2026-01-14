import { Provider } from "./components/ui/provider"
import LeaderboardTable from "./components/table"
import Game from "./components/game"
import { Stack, Center } from "@chakra-ui/react"

function App() {

  return (
    <Provider>
      <Center>
        <Stack margin = "2%" direction={{ base: "column", lg: "row" }} gap="5">
          <Game/>
          <LeaderboardTable/>
        </Stack>
      </Center>
    </Provider>
  )
}

export default App
