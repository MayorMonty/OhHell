import Submission from "../Submission";
import Deck from "./Deck";

export default class Round {
  participants: Submission[];
  deck: Deck;
  numberOfCards: number;
  trump: "diamonds" | "spades" | "clubs" | "hearts";
  state: "assignment" | "bidding" | "playing" | "done" = "assignment";

  bids: number[] = [];

  constructor(participants: Submission[], numberOfCards: number) {
    this.participants = participants;
    this.deck = new Deck();
    this.numberOfCards = numberOfCards;
  }

  async assignHands() {
    this.state = "assignment";
    this.participants.forEach(
      submission => (submission.hand = this.deck.getHand(this.numberOfCards))
    );
    return this;
  }

  async bid() {
    this.state = "bidding";
    for (let i = 0; i < this.participants.length; i++) {
      this.bids.push(
        await this.participants[i].bid(this.participants[i].hand, this.bids)
      );
    }
    return this;
  }
}
