import {calculateStatus, getStatus, Leader} from "./Calculation";
import random from "lodash/random";

const userTypes = [
  {
    color: undefined,
    givenCPM: 5,
    index: 1,
    name: "Minister",
    weight: 5,
    share: 5,
  },
  {
    color: undefined,
    givenCPM: 4,
    index: 2,
    name: "Ambassador",
    weight: 4,
    share: 10,
  },
  {
    color: undefined,
    givenCPM: 3,
    index: 3,
    name: "Council",
    weight: 3,
    share: 15,
  },
  {
    color: undefined,
    givenCPM: 2,
    index: 4,
    name: "Speaker",
    weight: 2,
    share: 20,
  },
  {
    color: undefined,
    givenCPM: 1,
    index: 5,
    name: "Member",
    weight: 1,
    share: 50,
  },
];

describe("Calculation", () => {
  describe("set Leaders", () => {
    const createLeader = (id: string) => ({
      displayName: id,
      userId: Math.random().toString(36).slice(2),
      email: id + "@gmail.com",
      score: random(0, 1000),
      pct: random(1, 100),
    });
    const leaders: Leader[] = ["a", "b", "c", "d", "e"].map((l) => createLeader(l)).sort((a, b) => b.score - a.score);

      type Statuses = { id: string, status: string; score: number };
      const statuses: Statuses[] = [] as Statuses[];
      for (let i = 0; i < leaders.length; i++) {
        const leader = leaders[i];
        const status = calculateStatus(
            (i + 1) * 100 / leaders.length,
            userTypes,
        );

        if (status) {
          statuses.push({
            id: leader.userId,
            status: status.name,
            score: leader.score,
          });
        }
      }

      expect(statuses.length).toBe(leaders.length);
  },
  );
  describe("calculateStatus", function() {
    it("should return Minister", () => {
      const actual = calculateStatus(1, userTypes);
      const expected = userTypes[0];
      expect(actual?.name).toBe(expected.name);
    });

    it("should return Ambassador", () => {
      const actual = calculateStatus(10, userTypes);
      const expected = userTypes[1];
      expect(actual?.name).toBe(expected.name);
    });

    it("should return Council", () => {
      const actual = calculateStatus(16, userTypes);
      const expected = userTypes[2];
      expect(actual?.name).toBe(expected.name);
    });

    it("should return Speaker", () => {
      const actual = calculateStatus(31, userTypes);
      const expected = userTypes[3];
      expect(actual?.name).toBe(expected.name);
    });

    it("should return Member", () => {
      const actual = calculateStatus(51, userTypes);
      const expected = userTypes[4];
      expect(actual?.name).toBe(expected.name);
    });
  });
  describe("getStatus", () => {
    it("should return true, Minister", () => {
      const userType = {
        color: undefined,
        givenCPM: 5,
        index: 1,
        name: "Minister",
        weight: 5,
        share: 5,
      };
      const [result, actual] = getStatus(4, userType);

      const expected = userType;

      expect(result).toBeTruthy();
      expect(actual).toStrictEqual(expected);
    });

    it("should return true, Council", () => {
      const [prev, current] = [
        {
          color: undefined,
          givenCPM: 4,
          index: 2,
          name: "Ambassador",
          weight: 4,
          share: 10,
        },
        {
          color: undefined,
          givenCPM: 3,
          index: 3,
          name: "Council",
          weight: 3,
          share: 15,
        },
      ];
      const [result, actual] = getStatus(16, current, prev);

      const expected = current;

      expect(result).toBeTruthy();
      expect(actual).toStrictEqual(expected);
    });

    it("should return false, Council", () => {
      const [prev, current] = [
        {
          color: undefined,
          givenCPM: 4,
          index: 2,
          name: "Ambassador",
          weight: 4,
          share: 10,
        },
        {
          color: undefined,
          givenCPM: 3,
          index: 3,
          name: "Council",
          weight: 3,
          share: 15,
        },
      ];
      const [result, actual] = getStatus(4, current, prev);

      const expected = current;

      expect(result).toBeFalsy();
      expect(actual).toStrictEqual(expected);
    });
  });
});
