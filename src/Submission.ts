import { promises as fs } from "fs";
import { join } from "path";
import { exec } from "child_process";
import { Hand, Card } from "./game/Deck";

export default class Submission {
  meta: {
    name: string;
    author: string;
    path: string;
    command: string;
    argv: string[];
  } = {
    name: "",
    author: "",
    path: "",
    command: "",
    argv: []
  };
  performance: {
    score: number;
    rank: number;
  } = {
    score: 0,
    rank: NaN
  };

  hand: Hand;

  disqualified: boolean = false;

  constructor(path: string) {
    this.meta.path = path;
  }

  // Load the submission package into memory
  async load() {
    return (
      fs
        .readFile(join(this.meta.path, "submission.json"))
        .then(value => value.toString())
        .then(JSON.parse)
        .then(submission => Object.assign(this.meta, submission))
        // Return the Class
        .then(value => this)
    );
  }

  // Gets submission input
  async prompt(args: string[]) {
    console.log(
      `EXEC ${this.meta.command} ${this.meta.argv} ${args.join(" ")}`
    );
    const ask = exec(
      [this.meta.command, ...this.meta.argv, ...args].join(" "),
      console.log
    );
    let data = "";
    return new Promise((resolve, reject) => {
      ask.stdout.on("data", d => {
        data += d;
        console.log(d);
      });
      ask.stdout.on("close", () => {
        resolve(data);
        console.log(`FROM ${this.meta.name}: ${data}`);
        clearTimeout(timeout);
      });

      // 5 second timeout
      let timeout = setTimeout(() => {
        console.log(`DQ ${this.meta.name} for time violation`);
        resolve(null);
        this.disqualified = true;
      }, 5000);
    });
  }

  async bid(hand: Card[], previousBids: number[]): Promise<number> {
    return +this.prompt([
      "BID",
      hand.map(card => card.suit + card.value).join(","),
      previousBids.join(",")
    ]);
  }
}
