import { promises as fs } from "fs";
import { join } from "path";
import Submission from "./Submission";
import Round from "./game/Round";

async function loadSubmissions() {
  console.log("Loading submissions...");
  return fs
    .readdir("./submissions")
    .then(items =>
      items.map(item => join(process.cwd(), "./submissions", item))
    )
    .then(paths => paths.map(path => new Submission(path)))
    .then(submissions => Promise.all(submissions.map(sub => sub.load())))
    .then(submissions => {
      submissions.map(sub =>
        console.log(` Submission: ${sub.meta.name} by ${sub.meta.author}`)
      );
      console.log("Done");
      return submissions;
    });
}

function log(arg: any) {
  console.log(arg);
  return arg;
}

// Play a round
loadSubmissions()
  .then(sub => new Round(sub, 3))
  .then(round => {
    round.deck.shuffle();
    return round;
  })
  .then(round => round.assignHands())
  .then(round => round.bid())
  // .then(log)
  .catch(console.error);
