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
const child_process_1 = require("child_process");
class Submission {
    constructor(path) {
        this.meta = {
            name: "",
            author: "",
            path: "",
            command: "",
            argv: []
        };
        this.performance = {
            score: 0,
            rank: NaN
        };
        this.disqualified = false;
        this.meta.path = path;
    }
    // Load the submission package into memory
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            return (fs_1.promises
                .readFile(path_1.join(this.meta.path, "submission.json"))
                .then(value => value.toString())
                .then(JSON.parse)
                .then(submission => Object.assign(this.meta, submission))
                // Return the Class
                .then(value => this));
        });
    }
    // Gets submission input
    prompt(args) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`EXEC ${this.meta.command} ${this.meta.argv} ${args.join(" ")}`);
            const ask = child_process_1.exec([this.meta.command, ...this.meta.argv, ...args].join(" "), console.log);
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
        });
    }
    bid(hand, previousBids) {
        return __awaiter(this, void 0, void 0, function* () {
            return +this.prompt([
                "BID",
                hand.map(card => card.suit + card.value).join(","),
                previousBids.join(",")
            ]);
        });
    }
}
exports.default = Submission;
//# sourceMappingURL=Submission.js.map