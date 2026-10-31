/* LongPress: a touch held for `ms` that moves less than `slop` px; more movement, a second finger or cancel() stops it. */
export class LongPress {
  private timer?: ReturnType<typeof setTimeout>;
  private from: [number, number] = [0, 0];

  constructor(
    private readonly onPress: (x: number, y: number) => void,
    private readonly ms = 500,
    private readonly slop = 8,
  ) {}

  get pending(): boolean {
    return this.timer !== undefined;
  }

  start(x: number, y: number): void {
    this.cancel();
    this.from = [x, y];
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.onPress(x, y);
    }, this.ms);
  }

  /** Pointer moved: cancels when the distance from the start reaches the slop. */
  move(x: number, y: number): void {
    if (this.timer !== undefined && Math.hypot(x - this.from[0], y - this.from[1]) >= this.slop) this.cancel();
  }

  cancel(): void {
    clearTimeout(this.timer);
    this.timer = undefined;
  }
}
