import {UserProps} from "./User";
import {getCurrentPaxReward, shouldHaveTransaction} from "./PAX";

describe("PAX", () => {
  describe("getCurrentPaxReward", () => {
    [
      [100, 50],
      [200000, 50],
      [220000, 25],
      [400000, 25],
      [421000, 12.5],
      [1050000, 1.5625],
    ].forEach((pair) => {
      const [total, expected] = pair;
      it(`total ${total} should return ${expected}`, () => {
        expect(getCurrentPaxReward(total)).toBe(expected);
      });
    });
  });
  describe("shouldHaveTransaction", () => {
    it("should return true 1", () => {
      const before: UserProps = {
        voteStatistics: {
          score: 99,
        },
      } as UserProps;
      const after: UserProps = {
        voteStatistics: {
          score: 101,
        },
      } as UserProps;

      expect(shouldHaveTransaction(before, after)).toBeTruthy();
    });

    it("should return true 2", () => {
      const before: UserProps = {
        voteStatistics: {
          score: 167,
        },
      } as UserProps;
      const after: UserProps = {
        voteStatistics: {
          score: 200,
        },
      } as UserProps;

      expect(shouldHaveTransaction(before, after)).toBeTruthy();
    });

    it("should return false 1", () => {
      const before: UserProps = {
        voteStatistics: {
          score: 167,
        },
      } as UserProps;
      const after: UserProps = {
        voteStatistics: {
          score: 167,
        },
      } as UserProps;

      expect(shouldHaveTransaction(before, after)).toBeFalsy();
    });

    it("should return false 2", () => {
      const before: UserProps = {
        voteStatistics: {
          score: 167,
        },
      } as UserProps;
      const after: UserProps = {
        voteStatistics: {
          score: 169,
        },
      } as UserProps;

      expect(shouldHaveTransaction(before, after)).toBeFalsy();
    });

    it("should return false 3", () => {
      const before: UserProps = {} as UserProps;
      const after: UserProps = {
        voteStatistics: {
          score: 2,
        },
      } as UserProps;

      expect(shouldHaveTransaction(before, after)).toBeFalsy();
    });

    it("should return true 3", () => {
      const before: UserProps = {} as UserProps;
      const after: UserProps = {
        voteStatistics: {
          score: 200,
        },
      } as UserProps;

      expect(shouldHaveTransaction(before, after)).toBeTruthy();
    });
  });
});
