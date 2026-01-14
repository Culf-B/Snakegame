import { useEffect, useRef } from 'react';

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
    this.player = new Snake(this.levelSize, this.ctx);
  }

  update(timeMs: number, canvasSizeUpdated: boolean, canvas: HTMLCanvasElement) {
    this.updateDelta(timeMs);

    if (canvasSizeUpdated) {
      this.scaleFactor = this.calcScalingFactor(canvas.width, canvas.height);
      this.offsetVector = this.calcOffsetVector(this.scaleFactor, canvas.width, canvas.height);

      this.apple.updateScaling(this.scaleFactor, this.offsetVector);
      this.player.updateScaling(this.scaleFactor, this.offsetVector);
    }
  }

  draw() {
    this.fillBackground(this.scaleFactor, this.offsetVector);
    this.drawCheckers(this.scaleFactor, this.offsetVector);

    this.apple.draw();
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
    for (let i = 0; i < this.levelSize; i ++) {
      for (let j = 0; j < Math.floor(this.levelSize / 2) + (i + 1) % 2; j++) {
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
    ]
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
  draw() {

  }
}

class Apple extends GameObject {
  readonly color: string = "red";
  position: number[] = [0, 0];

  constructor(levelSize: number, ctx: CanvasRenderingContext2D) {
    super(levelSize, ctx);
    this.generatePosition();
  }

  draw() {
    this.drawTile(this.position, this.color);
  }

  generatePosition() {
    this.position = [
      Math.floor(Math.random() * this.levelSize),
      Math.floor(Math.random() * this.levelSize)
    ]
  }
}

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let div = divRef.current;
    if (!div) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let canvasSizeUpdated = false;

    const level = new Level(ctx);

    // Animation function
    const render = (timeMs: number) => {
      // Adjust canvas size
      canvasSizeUpdated = false;
      div = divRef.current;
      if (div) {
        if (canvas.width != div.clientWidth || canvas.height != div.clientHeight) {
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
    };
  }, []);

  return (
    <div style = {{minWidth: "55vw", maxWidth: "75vw", height: "90vh"}} ref = {divRef}>
      <canvas ref={canvasRef}/>
    </div>
  );
};

export default Game;