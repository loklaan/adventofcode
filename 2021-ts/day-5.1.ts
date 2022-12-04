import {readFileSync} from 'fs'

class Point2D {
  constructor(public x: number = 0, public y: number = 0) {
  }

  get [Symbol.toStringTag]() {
    return `${this.x},${this.y}`
  }

  toString() {
    return this[Symbol.toStringTag]
  }

  [Symbol.toPrimitive](hint: string) {
    switch (hint) {
      case 'number':
        return NaN;
      case 'string':
        return this[Symbol.toStringTag]
      case 'default':
        return this[Symbol.toStringTag]
      default:
        return null;
    }
  }
}

class Vector2D {
  constructor(public a: Point2D = new Point2D(), public b: Point2D = new Point2D()) {
  }

  get [Symbol.toStringTag]() {
    return `${this.a} -> ${this.b}`
  }

  toString() {
    return this[Symbol.toStringTag]
  }

  [Symbol.toPrimitive](hint: string) {
    switch (hint) {
      case 'number':
        return NaN;
      case 'string':
        return this[Symbol.toStringTag]
      case 'default':
        return this[Symbol.toStringTag]
      default:
        return null;
    }
  }

  distanceSquared(x1: number, y1: number, x2: number, y2: number)
  {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
  }

  intersectsWith(point: Point2D, tolerance = 1) {
    return Math.abs(this.distanceSquared(this.a.x, this.a.y, this.b.x, this.b.y) - (this.distanceSquared(this.a.x, this.a.y, point.x, point.y) + this.distanceSquared(this.b.x, this.b.y, point.x, point.y))) <= tolerance;
  }
}

class Map {
  private readonly plottedAreas: number[][] = [];

  constructor(by: number) {
    for (let y = 0; y < by; y++) {
      this.plottedAreas[y] = [];
      for (let x = 0; x < by; x++) {
        this.plottedAreas[y][x] = 0;
      }
    }
  }

  *[Symbol.iterator]() {
    for (let y = 0; y < this.plottedAreas.length; y++) {
      for (let x = 0; x < this.plottedAreas[y].length; x++) {
        yield this.plottedAreas[y][x];
      }
    }
  }

  get [Symbol.toStringTag]() {
    return this.plottedAreas
      .map(columnOfAreas => columnOfAreas.map(visitsForArea => {
        return `${visitsForArea === 0 ? '.' : visitsForArea.toString()}`;
      }).join('\t'))
      .join('\n');
  }

  toString() {
    return this[Symbol.toStringTag];
  }

  plot(vector: Vector2D) {
    for (let y = 0; y < this.plottedAreas.length; y++) {
      for (let x = 0; x < this.plottedAreas[y].length; x++) {
        if (vector.intersectsWith(new Point2D(y, x))) {
          this.plottedAreas[y][x] += 1;
        }
      }
    }
  }
}

const input = readFileSync('./io/day-5.txt', {encoding: 'utf-8'}).split('\n');
const vectors = input
  .filter(line => line)
  .map(line => {
    const match = line.match(/(\d+),(\d+) -> (\d+),(\d+)/);
    if (match == null) {
      throw new Error('Fuck');
    }
    const x1 = parseInt(match[1]), y1 = parseInt(match[2]), x2 = parseInt(match[3]), y2 = parseInt(match[4]);
    console.log(`  Point: ${new Vector2D(
      new Point2D(x1, y1),
      new Point2D(x2, y2),
    )}`)
    return new Vector2D(
      new Point2D(x1, y1),
      new Point2D(x2, y2),
    );
  });

const map = new Map(9);

console.log("Begin!\n\n");
console.log(map.toString() + '\n\n');

for (const vector of vectors) {
  console.log(`Plotting: ${vector}`);
  map.plot(vector);
  console.log(map.toString() + '\n');
}

console.log("Plotted!\n\n");
console.log(map.toString() + '\n\n');

let plottedAreasOverlap = 0;
for (const areaVisits of map) {
  if (areaVisits > 1) {
    plottedAreasOverlap++;
  }
}

console.log(`Plotted areas with overlap: ${plottedAreasOverlap}`);
