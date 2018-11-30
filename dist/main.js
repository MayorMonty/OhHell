"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const Submission_1 = require("./Submission");
const Round_1 = require("./game/Round");
function loadSubmissions() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Loading submissions...");
        return fs_1.promises
            .readdir("./submissions")
            .then(items => items.map(item => path_1.join(process.cwd(), "./submissions", item)))
            .then(paths => paths.map(path => new Submission_1.default(path)))
            .then(submissions => Promise.all(submissions.map(sub => sub.load())))
            .then(submissions => {
            submissions.map(sub => console.log(` Submission: ${sub.meta.name} by ${sub.meta.author}`));
            console.log("Done");
            return submissions;
        });
    });
}
function log(arg) {
    console.log(arg);
    return arg;
}
// Play a round
loadSubmissions()
    .then(sub => new Round_1.default(sub, 3))
    .then(round => {
    round.deck.shuffle();
    return round;
})
    .then(round => round.assignHands())
    .then(round => round.bid())
    // .then(log)
    .catch(console.error);
//# sourceMappingURL=main.js.map