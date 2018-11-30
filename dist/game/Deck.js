"use strict";
/**
 * Represents a Deck of Cards
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Deck {
    constructor() {
        this.pointer = 0;
        this.contents = [...new Array(52)].map((v, i) => Deck.makeCard(i));
    }
    static makeCard(id) {
        return {
            id,
            suit: ["diamonds", "spades", "clubs", "hearts"][id % 4],
            value: (id + 1) % 13
        };
    }
    /**
     * Performs a Fisher-Yates shuffle on the current deck
     *
     * Credit: Laurens Holst
     *
     * https://stackoverflow.com/a/12646864/2016735
     */
    shuffle() {
        for (var i = this.contents.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.contents[i];
            this.contents[i] = this.contents[j];
            this.contents[j] = temp;
        }
    }
    /**
     * Draws a hand of specified size. This does not reset once you reach the maximum number of cards.
     * Do not shuffle the deck in between hands!
     * @param size Size of the hand
     */
    getHand(size) {
        let hand = this.contents.slice(this.pointer, this.pointer + size);
        this.pointer += size;
        return hand;
    }
}
exports.default = Deck;
//# sourceMappingURL=Deck.js.map