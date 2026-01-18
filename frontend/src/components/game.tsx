import { useEffect, useRef } from "react";
import { Stat, VStack, Stack, Text, Box, Heading } from "@chakra-ui/react";
import { GameEndDialog, type GameEndDialogHandle } from "./gameEnd";

class Level {
  ctx: CanvasRenderingContext2D;
  readonly tileColors: string[] = ["green", "lightgreen"];
  readonly levelSize: number = 15;
  scaleFactor: number = 1;
  offsetVector: number[] = [0, 0];
  latestTimeMs: number = 0;
  deltaMs: number = 0;
  player: Snake;
  apple: Apple;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.apple = new Apple(this.levelSize, this.ctx);
    this.player = new Snake(this.apple, this.levelSize, this.ctx);
  }

  update(
    timeMs: number,
    canvasSizeUpdated: boolean,
    canvas: HTMLCanvasElement
  ) {
    this.updateDelta(timeMs);

    if (canvasSizeUpdated) {
      this.scaleFactor = this.calcScalingFactor(canvas.width, canvas.height);
      this.offsetVector = this.calcOffsetVector(
        this.scaleFactor,
        canvas.width,
        canvas.height
      );

      this.apple.updateScaling(this.scaleFactor, this.offsetVector);
      this.player.updateScaling(this.scaleFactor, this.offsetVector);
    }

    this.player.updateMove(this.deltaMs);
  }

  draw() {
    this.fillBackground(this.scaleFactor, this.offsetVector);
    this.drawCheckers(this.scaleFactor, this.offsetVector);

    this.apple.draw();
    this.player.draw();
  }

  updateDelta(timeMs: number) {
    this.deltaMs = timeMs - this.latestTimeMs;
    this.latestTimeMs = timeMs;
  }

  fillBackground(scaleFactor: number, offsetVector: number[]) {
    this.ctx.fillStyle = this.tileColors[0];
    this.ctx.fillRect(
      offsetVector[0],
      offsetVector[1],
      this.levelSize * scaleFactor,
      this.levelSize * scaleFactor
    );
  }

  drawCheckers(scaleFactor: number, offsetVector: number[]) {
    // Draws the checkerboard using goofy checker board math
    this.ctx.fillStyle = this.tileColors[1];
    for (let i = 0; i < this.levelSize; i++) {
      for (let j = 0; j < Math.floor(this.levelSize / 2) + ((i + 1) % 2); j++) {
        this.ctx.fillRect(
          offsetVector[0] + scaleFactor * ((i % 2) + 2 * j),
          offsetVector[1] + scaleFactor * i,
          scaleFactor,
          scaleFactor
        );
      }
    }
  }

  calcScalingFactor(width: number, height: number) {
    // Calculates the factor needed to scale tiles to fit canvas
    if (width <= height) {
      return width / this.levelSize;
    } else {
      return height / this.levelSize;
    }
  }

  calcOffsetVector(scaleFactor: number, width: number, height: number) {
    // Calculates the offset vector to be added to tile positions to center tiles in canvas
    return [
      (width - scaleFactor * this.levelSize) / 2,
      (height - scaleFactor * this.levelSize) / 2,
    ];
  }

  getScore() {
    return this.player.getScore();
  }

  gameEnded() {
    if (this.player.dead) {
      return true;
    }
  }

  cleanUp() {
    this.player.cleanUp();
  }
}

class GameObject {
  ctx: CanvasRenderingContext2D;
  levelSize: number = 0;
  scaleFactor: number = 1;
  offsetVector: number[] = [0, 0];

  constructor(levelSize: number, ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.levelSize = levelSize;
  }

  updateScaling(scaleFactor: number, offsetVector: number[]) {
    this.scaleFactor = scaleFactor;
    this.offsetVector = offsetVector;
  }

  drawTile(position: number[], color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      this.offsetVector[0] + this.scaleFactor * position[0],
      this.offsetVector[1] + this.scaleFactor * position[1],
      this.scaleFactor,
      this.scaleFactor
    );
  }

  draw() {}
}

class Snake extends GameObject {
  readonly headColor: string = "darkblue";
  readonly tailColor: string = "blue";
  apple: Apple;

  tail: number[][] = [];
  addTail: boolean = false;
  headPos: number[];

  previousMove: number[] = [0, 0];
  direction: number[] = [0, 0];

  speed: number = 3; // Speed in tiles pr second
  moveTimeElapsed: number = 0;

  dead: boolean = false;
  score: number = 0;

  handleKeyboard: (event: KeyboardEvent) => void;

  constructor(apple: Apple, levelSize: number, ctx: CanvasRenderingContext2D) {
    super(levelSize, ctx);

    this.headPos = [Math.floor(levelSize / 2), Math.floor(levelSize / 2)];
    this.apple = apple;
    this.apple.generatePosition([this.headPos]);

    // Event listener added with arrow syntax to keep context of this object in callback
    this.handleKeyboard = (event) => this.handleKeyboardLogic(event);
    window.addEventListener("keydown", this.handleKeyboard);
  }

  updateMove(deltaMs: number) {
    if (this.dead) {
      return;
    }

    this.moveTimeElapsed += deltaMs;
    // Is it time to move?
    if (this.moveTimeElapsed >= 1000 / this.speed) {
      this.moveTimeElapsed -= 1000 / this.speed;

      this.moveTail();
      this.moveHeadPos();
      this.appleCheck();
      this.tailCheck();
    }
  }

  moveHeadPos() {
    // Move
    this.headPos[0] += this.direction[0];
    this.headPos[1] += this.direction[1];
    this.previousMove = this.direction;

    // Handle bounds
    for (let i = 0; i < 2; i++) {
      if (this.headPos[i] < 0) {
        this.headPos[i] = this.levelSize - 1;
      } else if (this.headPos[i] >= this.levelSize) {
        this.headPos[i] = 0;
      }
    }
  }

  moveTail() {
    if (this.addTail) {
      this.tail.push([this.headPos[0], this.headPos[1]]);
      this.addTail = false;
    } else if (this.tail.length > 0) {
      this.tail.shift();
      this.tail.push([this.headPos[0], this.headPos[1]]);
    }
  }

  appleCheck() {
    // Check if apple pos and head pos are equal
    if (
      this.apple.getPos().every((value, index) => value === this.headPos[index])
    ) {
      this.apple.generatePosition([...this.tail, this.headPos]);
      this.score += 1;
      this.addTail = true;
    }
  }

  tailCheck() {
    if (
      this.tail.find(
        (tailPos) =>
          tailPos[0] === this.headPos[0] && tailPos[1] === this.headPos[1]
      )
    ) {
      this.dead = true;
    }
  }

  draw() {
    this.drawTail();
    this.drawHead();
  }

  drawHead() {
    this.drawTile(this.headPos, this.headColor);
  }

  drawTail() {
    this.tail.forEach((position) => {
      this.drawTile(position, this.tailColor);
    });
  }

  handleKeyboardLogic(event: KeyboardEvent) {
    switch (event.key) {
      case "a":
        this.setDirection([-1, 0]);
        break;
      case "d":
        this.setDirection([1, 0]);
        break;
      case "w":
        this.setDirection([0, -1]);
        break;
      case "s":
        this.setDirection([0, 1]);
        break;
    }
  }

  setDirection(newDirection: number[]) {
    // Set new direction and sure we cant do a 180 turn
    for (let i = 0; i < 2; i++) {
      if (newDirection[i] != 0 && -newDirection[i] == this.previousMove[i]) {
        return;
      }
    }
    this.direction = newDirection;
  }

  getScore() {
    return this.score;
  }

  cleanUp() {
    window.removeEventListener("keyup", this.handleKeyboard);
  }
}

class Apple extends GameObject {
  readonly color: string = "red";
  position: number[] = [0, 0];

  constructor(levelSize: number, ctx: CanvasRenderingContext2D) {
    super(levelSize, ctx);
  }

  draw() {
    this.drawTile(this.position, this.color);
  }

  generatePosition(excludedPositions: number[][]) {
    do {
      this.position = this.randomPosition();
    } while (
      excludedPositions.find(
        (exPos) =>
          exPos[0] === this.position[0] && exPos[1] === this.position[1]
      )
    );
  }

  getPos() {
    return this.position;
  }

  randomPosition() {
    return [
      Math.floor(Math.random() * this.levelSize),
      Math.floor(Math.random() * this.levelSize),
    ];
  }
}

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const scoreRef = useRef<HTMLElement | null>(null);
  const gameEndRef = useRef<GameEndDialogHandle | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let div = divRef.current;
    if (!div) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scoreStat = scoreRef.current;
    if (!scoreStat) return;

    const gameEndDialog = gameEndRef.current;
    if (!gameEndDialog) return;

    let canvasSizeUpdated = false;

    const level = new Level(ctx);

    // Animation function
    const render = (timeMs: number) => {
      // Adjust canvas size
      canvasSizeUpdated = false;
      div = divRef.current; // This probably doesnt matter?
      if (div) {
        if (
          canvas.width != div.clientWidth ||
          canvas.height != div.clientHeight
        ) {
          canvas.width = div.clientWidth;
          canvas.height = div.clientHeight;
          canvasSizeUpdated = true;
        }
      }

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stuff
      level.update(timeMs, canvasSizeUpdated, canvas);
      level.draw();

      scoreStat.innerHTML = level.getScore().toString();

      if (level.gameEnded()) {
        if (gameEndDialog.gameEnded(level.getScore())) {
          return;
        }
      }

      // Request the next frame
      animationRef.current = requestAnimationFrame(render);
    };

    // Start the animation loop
    animationRef.current = requestAnimationFrame(render);

    // Cleanup function to cancel the animation frame
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      level.cleanUp();
    };
  }, []);

  return (
    <Stack direction={{ base: "column", lg: "row" }}>
      <Box>
        <Box
          p="4"
          borderWidth="1px"
          borderColor="border.disabled"
          color="fg.disabled"
        >
          <VStack gap="10">
            <Heading>Game info</Heading>
            <Text>Controls: W, A, S, D</Text>

            <Stat.Root>
              <Stat.Label>Score</Stat.Label>
              <Stat.ValueText ref={scoreRef}>0</Stat.ValueText>
            </Stat.Root>

            <GameEndDialog ref={gameEndRef}></GameEndDialog>
          </VStack>
        </Box>
      </Box>
      <div
        style={{ minWidth: "55vw", maxWidth: "75vw", height: "90vh" }}
        ref={divRef}
      >
        <canvas ref={canvasRef} />
      </div>
    </Stack>
  );
};

export default Game;
