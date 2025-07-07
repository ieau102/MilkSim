export class Random {
  private static MBIG = 2147483647;
  private static MSEED = 161803398;

  private inext = 0;
  private inextp = 0;
  private SeedArray = new Array<number>(56);

  constructor(seed: number = Date.now()) {
    this.initSeed(seed);
  }

  private initSeed(seed: number): void {
    const subtraction = seed === -2147483648 ? 2147483647 : Math.abs(seed);
    let mj = Random.MSEED - subtraction;
    this.SeedArray[55] = mj;
    let mk = 1;

    for (let i = 1; i < 55; i++) {
      const ii = (21 * i) % 55;
      this.SeedArray[ii] = mk;
      mk = mj - mk;
      if (mk < 0) mk += Random.MBIG;
      mj = this.SeedArray[ii];
    }

    for (let k = 0; k < 4; k++) {
      for (let i = 1; i < 56; i++) {
        this.SeedArray[i] -= this.SeedArray[1 + ((i + 30) % 55)];
        if (this.SeedArray[i] < 0) this.SeedArray[i] += Random.MBIG;
      }
    }

    this.inext = 0;
    this.inextp = 21;
  }

  private internalSample(): number {
    let locINext = this.inext;
    let locINextp = this.inextp;

    if (++locINext >= 56) locINext = 1;
    if (++locINextp >= 56) locINextp = 1;

    let retVal = this.SeedArray[locINext] - this.SeedArray[locINextp];
    if (retVal === Random.MBIG) retVal--;
    if (retVal < 0) retVal += Random.MBIG;

    this.SeedArray[locINext] = retVal;
    this.inext = locINext;
    this.inextp = locINextp;

    return retVal;
  }

  protected sample(): number {
    return this.internalSample() * (1.0 / Random.MBIG);
  }

  public next(): number {
    return this.internalSample();
  }

  public nextMax(maxValue: number): number {
    if (maxValue < 0) throw new Error("maxValue must be >= 0");
    return Math.floor(this.sample() * maxValue);
  }

  public nextRange(minValue: number, maxValue: number): number {
    if (minValue > maxValue) throw new Error("minValue must be <= maxValue");
    const range = maxValue - minValue;
    return Math.floor(this.sample() * range) + minValue;
  }

  public nextDouble(): number {
    return this.sample();
  }

  public nextBytes(buffer: Uint8Array): void {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = this.internalSample() % 256;
    }
  }

  private static _random: Random = new Random();

  public static rnd(max: number): number {
    if (max > 0) {
      return Random._random.nextMax(max);
    }
    return 0;
  }

  public static SetSeed(seed: number = -1): void {
    Random._random = seed === -1 ? new Random() : new Random(seed);
  }
}
