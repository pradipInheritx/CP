import {
  userConverter,
  UserProps,
  userTypeConverter,
  UserTypeProps,
  VoteStatistics,
} from "./User";
import { Direction, voteConverter, VoteResultProps } from "./Vote";
import { firestore } from "firebase-admin";
import Refer, { VoteRules } from "./Refer";
import {
  voteExpireAndGetCpmNotification,
  poolMiningNotification,
} from "./SendCustomNotification";

export type Totals = {
  total: number;
  success: number;
};

export type Leader = {
  displayName: string;
  email: string;
  userId: string;
  avatar?: string;
  score: number;
  pct: number;
  subscribers?: number;
  leaders?: number;
  status?: string;
  total?: number;
};

// export const returnValue: (success: boolean, voteRules: VoteRules) => number = (
//     success = false,
//     voteRules
// ) =>
//   (Number(voteRules.givenCPM) || 1) *
//   (success ?
//     Number(voteRules.CPMReturnSuccess) :
//     Number(voteRules.CPMReturnFailure));

export const returnValue: (
  success: number,
  voteRules: VoteRules,
  status: any
) => number = (success = 0, voteRules, status) => {
  let CPMReturn: number;
  if (success === 1) {
    CPMReturn =
      (Number(status?.givenCPM) || 1) * Number(voteRules.CPMReturnSuccess);
  } else if (success === 2) {
    CPMReturn =
      (Number(status?.givenCPM) || 1) * Number(voteRules.CPMReturnInRange);
  } else {
    CPMReturn =
      (Number(status?.givenCPM) || 1) * Number(voteRules.CPMReturnFailure);
  }
  console.log(
    "GIVEN CMP >>>>>>>>>",
    (Number(voteRules.givenCPM) || 1) * CPMReturn
  );
  return (Number(voteRules?.givenCPM) || 1) * CPMReturn;
};
class Calculation {
  private readonly voteResult: VoteResultProps;
  private db: firestore.Firestore;
  private readonly price: number | number[];
  private readonly id: string;
  private readonly userId: string;
  private readonly status: any;

  constructor(
    voteResult: VoteResultProps,
    price: number | number[],
    id: string,
    userId: string,
    status: any
  ) {
    console.log("voteResult =>", voteResult);
    console.log("STATUS", status);

    this.voteResult = voteResult;
    this.price = price;
    this.id = id;
    this.db = firestore();
    this.userId = userId;
    this.status = status;
  }

  async calc(
    ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
  ): Promise<void> {
    console.log("calcValueExpirationTime");
    await this.calcValueExpirationTime();
    console.log("Calculate Success");
    this.calcSuccess();
    console.log("updateVote");
    await this.updateVote(ref);
    console.log("giveAway");
    await this.giveAway();
    console.log("setTotals");
    await this.setTotals();
  }

  async calcOnlySuccess(): Promise<void> {
    const getCalSuccessValue = await this.calcOnlySuccessScore();
    console.info("getCalSuccessValue", getCalSuccessValue);
    return getCalSuccessValue;
  }

  async calcOnlySuccessScore(): Promise<any> {
    const { voteResult, userId } = this;

    console.info("VOTE RESULT", voteResult);

    console.info("this.price", this.price);
    let successScoreValue: any;

    const settings = await firestore()
      .collection("settings")
      .doc("settings")
      .get();
    const ref = this.db.collection("users").doc(userId);
    const user = (await ref.get()).data() as UserProps;

    const CPMRangeCurrentValue = voteResult?.CPMRangeCurrentValue
      ? voteResult?.CPMRangeCurrentValue
      : 0;
    if (typeof this.price === "number") {
      const startValue = voteResult.valueVotingTime;
      const endValue: any = voteResult?.valueExpirationTime;

      const upRange: any = Number(startValue) + Number(CPMRangeCurrentValue);

      // startValue = 2247.99 and endValue = 2248.46 uprange = 2247.99 and downrange = 2247.99

      const downRange = Number(startValue) - Number(CPMRangeCurrentValue);

      console.log("ENDVALUE", endValue, "UPRANGE", upRange, "DOWNRANGE", downRange)

      if (endValue && endValue < upRange && endValue > downRange) {
        successScoreValue = 2;
        const score = returnValue(
          successScoreValue || 0,
          settings.data()?.voteRules,
          user?.status
        );
        // TODO When score reach to 100 create a function for send Pax to that user
        return { successScoreValue, score };
      } else {
        console.log("SuccessValue Changed rand point not working");
        const bear =
          !!endValue &&
          endValue <= startValue &&
          voteResult.direction === Direction.BEAR;

        const bull =
          !!endValue &&
          endValue > startValue &&
          voteResult.direction === Direction.BULL;

        console.log("BEAR", bear, "BULL", bull);

        successScoreValue = bull ? 1 : 0 || bear ? 1 : 0;
      }
      if (this.status === 0 || this.status) {
        successScoreValue = this.status;
      }
      const score = returnValue(
        successScoreValue || 0,
        settings.data()?.voteRules,
        user.status
      );
      // TODO When score reach to 100
      return { successScoreValue, score };
    } else {
      if (
        Array.isArray(voteResult.valueVotingTime) &&
        Array.isArray(this.price)
      ) {
        const diff = [
          this.price[0] - voteResult.valueVotingTime[0],
          this.price[1] - voteResult.valueVotingTime[1],
        ];

        const winner = diff[0] < diff[1] ? 1 : 0;
        const averageValue = Math.abs(diff[0] - diff[1]);
        console.info(
          "averageValue",
          averageValue,
          "CPMRangeCurrentValue",
          CPMRangeCurrentValue
        );

        // This status is user from frontend
        if (averageValue <= CPMRangeCurrentValue) {
          successScoreValue = 2;
        } else {
          successScoreValue = voteResult.direction === winner ? 1 : 0;
        }
        if (this.status === 0 || this.status) {
          successScoreValue = this.status;
        }
        const score = returnValue(
          successScoreValue || 0,
          settings.data()?.voteRules,
          user?.status
        );
        return { successScoreValue, score };
      }
    }
  }

  async sendPaxToUserMintForAddress() {
    //Mint For Address Is Required
    // If isUserUpgraded Then need to send PAX to user mintFor Address
  }

  calcValueExpirationTime(): void {
    console.log("calcValueExpirationTime", this.price, typeof this.price);
    this.voteResult.valueExpirationTime = this.price;
  }

  calcSuccess(): void {
    const { voteResult } = this;
    console.log("voteResult : ", voteResult);
    // const CPMReturnRangePercentage = voteResult?.CPMRangePercentage || 10;
    const CPMRangeCurrentValue = voteResult?.CPMRangeCurrentValue
      ? voteResult?.CPMRangeCurrentValue
      : 0;

    console.log("CPMRangeCurrentValue : ", CPMRangeCurrentValue);
    if (typeof this.price === "number") {
      const startValue = voteResult.valueVotingTime;
      const endValue: any = voteResult?.valueExpirationTime;

      console.log("startValue : ", startValue);
      console.log("endValue : ", endValue);

      const upRange: any = Number(startValue) + Number(CPMRangeCurrentValue);
      const downRange = Number(startValue) - Number(CPMRangeCurrentValue);

      console.log("upRange : ", upRange);
      console.log("downRange : ", downRange);

      console.log(
        "typeof startValue === 'number' && typeof endValue === 'number' : ",
        typeof startValue === "number" && typeof endValue === "number"
      );

      if (typeof startValue === "number" && typeof endValue === "number") {
        const trendChange = Number(
          Number(((endValue || 0) / (startValue || 1) - 1) * 100).toFixed(3)
        );
        voteResult.trendChange = trendChange;
        console.log("trendChange : ", trendChange);
      }

      console.log(
        "endValue && endValue < upRange && endValue > downRange : ",
        endValue && endValue < upRange && endValue > downRange
      );

      if (endValue && endValue < upRange && endValue > downRange) {
        this.voteResult.success = 2;
      } else {
        console.log("successValue Changed rand point not working");
        const bear =
          !!endValue &&
          endValue <= startValue &&
          voteResult.direction === Direction.BEAR;
        const bull =
          !!endValue &&
          endValue > startValue &&
          voteResult.direction === Direction.BULL;
        this.voteResult.success = bull ? 1 : 0 || bear ? 1 : 0;

        console.log("bear : ", bear);
        console.log("bull : ", bull);
      }
      if (this.status === 0 || this.status) {
        this.voteResult.success = this.status;
      }
    } else {
      console.log(
        "Array.isArray(voteResult.valueVotingTime) && Array.isArray(voteResult.valueExpirationTime) : ",
        Array.isArray(voteResult.valueVotingTime) &&
        Array.isArray(voteResult.valueExpirationTime)
      );
      console.log(
        "Array.isArray(voteResult.valueVotingTime) : ",
        Array.isArray(voteResult.valueVotingTime)
      );
      console.log(
        "Array.isArray(voteResult.valueExpirationTime) : ",
        Array.isArray(voteResult.valueExpirationTime)
      );
      if (
        Array.isArray(voteResult.valueVotingTime) &&
        Array.isArray(voteResult.valueExpirationTime)
      ) {
        const diff = [
          voteResult.valueExpirationTime[0] - voteResult.valueVotingTime[0],
          voteResult.valueExpirationTime[1] - voteResult.valueVotingTime[1],
        ];

        console.log("Difference : ", diff);

        const winner = diff[0] < diff[1] ? 1 : 0;
        const averageValue = Math.abs(diff[0] - diff[1]);
        console.log("averageValue : ", averageValue);
        console.log("CPMRangeCurrentValue : ", CPMRangeCurrentValue);

        // This status is user from frontend
        if (averageValue <= CPMRangeCurrentValue) {
          this.voteResult.success = 2;
        } else {
          this.voteResult.success = voteResult.direction === winner ? 1 : 0;
        }
        if (this.status === 0 || this.status) {
          this.voteResult.success = this.status;
        }
        console.log("this.voteResult.success : ", this.voteResult.success);
      }
    }
  }

  async updateVote(
    ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
  ): Promise<void> {
    console.log("ref ====", ref);
    console.log("this.voteResult ========", this.voteResult);
    await ref.set(this.voteResult, { merge: true });
  }

  async giveAway(): Promise<void> {
    try {
      const { voteResult, userId } = this;
      const settings = await firestore()
        .collection("settings")
        .doc("settings")
        .get();
      const ref = this.db.collection("users").doc(userId);
      const user = (await ref.get()).data() as UserProps;
      const voteStatistics: VoteStatistics =
        user.voteStatistics || ({} as VoteStatistics);
      voteStatistics.successful += voteResult.success ? 1 : 0;
      const score = returnValue(
        voteResult.success || 0,
        settings.data()?.voteRules,
        user.status
      );
      await this.db
        .collection("votes")
        .doc(this.id)
        .set({ score }, { merge: true });

      voteStatistics.score += score;

      // Send Notification For CMP Change
      // const getVotesQuery = await this.db
      //   .collection("votes")
      //   .doc(this.id)
      //   .get();
      // const getVote: any = getVotesQuery.data();
      console.log("send Notification for CPM");
      console.log(
        "send Notification Details - - userId, score,this.voteResult.coin",
        userId,
        score,
        this.voteResult.coin
      );
      await voteExpireAndGetCpmNotification(
        userId,
        voteStatistics,
        score,
        this.voteResult.coin
      );

      // For Add Only Commission In Current User
      const { CPMSettings } = await Refer.getSettings();
      const { pctReferralActivity } = CPMSettings;
      const commission = Number(score * pctReferralActivity) / 100;
      const refereeScrore: Number = parseFloat(
        ((user.refereeScrore ? user.refereeScrore : 0) + commission).toFixed(3)
      );
      await ref.set(
        { voteStatistics, refereeScrore: refereeScrore },
        { merge: true }
      );
      console.log("user.parent -----", user.parent);
      if (user.parent) {
        const refer = new Refer(user.parent, "");
        await refer.payParent(score);
        // send Notification
        console.log(
          "pool mining Notification is calling: -- ",
          user.parent,
          user.displayName || "",
          user.refereeScrore
        );
        console.log("commission : ", commission);
        console.log("score -- ", score);
        await poolMiningNotification(
          user.parent,
          user.displayName || "",
          commission
        );
      }
    } catch (error) {
      errorLogging("giveAway", "ERROR", error);
    }
  }

  async setTotals(): Promise<FirebaseFirestore.WriteResult> {
    const { coin } = this.voteResult;
    const snapshotVotes = await firestore()
      .collection("votes")
      .where("coin", "==", coin)
      .withConverter(voteConverter)
      .get();
    const totals = {} as { [key: string]: Totals };

    snapshotVotes.docs.forEach((doc) => {
      const { success, coin } = doc.data();
      const currentStats = totals[coin] || { total: 0, success: 0 };

      totals[coin] = {
        total: currentStats.total + 1,
        success: currentStats.success + (success ? 1 : 0),
      };
    });

    return await firestore()
      .collection("stats")
      .doc("totals")
      .set(totals, { merge: true });
  }
} // end the calculation class

const getLeaders = async () => {
  const snapshotUsers = await firestore()
    .collection("users")
    .withConverter(userConverter)
    .get();

  return snapshotUsers.docs
    .map((u) => {
      const {
        displayName,
        subscribers,
        avatar,
        status,
        voteStatistics,
        email,
        refereeScrore,
        firstName,
        lastName,
        country,
        phone,
        leader,
      } = u.data();
      const { score = 0 } = voteStatistics || {};
      return {
        displayName: displayName,
        email,
        avatar,
        userId: u.id,
        score,
        firstName,
        lastName,
        country,
        phone,
        status,
        refereeScrore,
        subscribers: subscribers?.length || 0,
        leaders: leader?.length || 0,
        pct: (voteStatistics?.successful || 0) / (voteStatistics?.total || 1),
        successful: voteStatistics?.successful,
        total: voteStatistics?.total || 0,
      } as Leader;
    })
    .sort((a, b) => Number(a.score) - Number(b.score));
};

const getTotalCountOfUserType = async () => {

  const leaders = await getLeaders();

  const userTypes = await firestore()
    .collection("settings")
    .doc("userTypes")
    .withConverter(userTypeConverter)
    .get();

  // Sorted On Share Of UserType Settings
  const sortedUserType: UserTypeProps[] = userTypes
    .data()
    ?.userTypes.sort(
      (a, b) => Number(a.share) - Number(b.share)
    ) as UserTypeProps[];

  let getTotalNumberOfSpeaker = 0;
  let getTotalNumberOfCouncil = 0;
  let getTotalNumberOfAmbassador = 0;
  let getTotalNumberOfMinister = 0;
  let getTotalNumberOfChairman = 0;

  for (let userType = 0; userType < sortedUserType.length; userType++) {
    const eachUserType: any = sortedUserType[userType];
    if (eachUserType.name === "Speaker") {
      const userLengthForThisUserType = Math.round(
        (leaders.length * Number(eachUserType.share)) / 100
      );
      getTotalNumberOfSpeaker = userLengthForThisUserType
    }
    if (eachUserType.name === "Council") {
      const userLengthForThisUserType = Math.round(
        (leaders.length * Number(eachUserType.share)) / 100
      );
      getTotalNumberOfCouncil = userLengthForThisUserType
    }
    if (eachUserType.name === "Ambassador") {
      const userLengthForThisUserType = Math.round(
        (leaders.length * Number(eachUserType.share)) / 100
      );
      getTotalNumberOfAmbassador = userLengthForThisUserType
    }
    if (eachUserType.name === "Minister") {
      const userLengthForThisUserType = Math.round(
        (leaders.length * Number(eachUserType.share)) / 100
      );
      getTotalNumberOfMinister = userLengthForThisUserType
    }
    if (eachUserType.name === "Chairman") {
      const userLengthForThisUserType = Math.round(
        (leaders.length * Number(eachUserType.share)) / 100
      );
      getTotalNumberOfChairman = userLengthForThisUserType
    }
  }
  return { getTotalNumberOfSpeaker, getTotalNumberOfCouncil, getTotalNumberOfAmbassador, getTotalNumberOfMinister, getTotalNumberOfChairman }
};

export const setLeaders: () => Promise<FirebaseFirestore.WriteResult> =
  async () => {
    let getLeadersResponse: any = await getLeaders();
    let leaders = getLeadersResponse
      .map((obj: any) => ({ ...obj })) // Create a shallow copy of each object
      .filter((obj: any) => obj.total > 1);

    console.info("Length With Leaders", leaders, leaders.length);
    const { getTotalNumberOfSpeaker, getTotalNumberOfCouncil, getTotalNumberOfAmbassador, getTotalNumberOfMinister, getTotalNumberOfChairman } = await getTotalCountOfUserType();
    let leaderStatus: Leader[] = [];
    console.info("getTotalNumberOfSpeaker", getTotalNumberOfSpeaker, "getTotalNumberOfCouncil", getTotalNumberOfCouncil, "getTotalNumberOfAmbassador", getTotalNumberOfAmbassador, "getTotalNumberOfMinister", getTotalNumberOfMinister, "getTotalNumberOfChairman", getTotalNumberOfChairman)

    let leaderStatusForSpeaker: Leader[] = [];
    console.log("getTotalNumberOfSpeaker", getTotalNumberOfSpeaker);
    if (getTotalNumberOfSpeaker && getTotalNumberOfSpeaker > 0) {
      for (let leader = 0; leader < leaders.length; leader++) {
        const eachUser: any = leaders[leader];
        console.info("eachUser.total", eachUser.total)
        if ((eachUser.total > 2 || eachUser.total === 2) && leaderStatusForSpeaker.length < getTotalNumberOfSpeaker) {
          console.info("leaderStatusForSpeaker.length < getTotalNumberOfSpeaker", leaderStatusForSpeaker.length, getTotalNumberOfSpeaker)
          if (leaderStatusForSpeaker.length < getTotalNumberOfSpeaker) {
            console.log("Come Here Total Iff", typeof eachUser.total, "Value", eachUser.total);
            eachUser.status = "Speaker";
            leaderStatusForSpeaker.push(eachUser);
          } else {
            console.log("Come Here Total Else ", typeof eachUser.total, "Value", eachUser.total);
            let tempArrayAfterSliced = leaderStatusForSpeaker.slice(1);
            eachUser.status = "Speaker";
            leaderStatusForSpeaker = [...tempArrayAfterSliced]
            leaderStatusForSpeaker.push(eachUser);
          }
          await firestore()
            .collection("users")
            .doc(eachUser.userId)
            .set({ status: "Speaker" }, { merge: true });
        }
      }

      console.info("leaders In leaderStatusForSpeaker", leaderStatusForSpeaker)
      leaders.splice(0, getTotalNumberOfSpeaker);
      console.info("leaders In Speaker", leaders)
    }

    for (let speaker = 0; speaker < leaderStatusForSpeaker.length; speaker++) {
      leaderStatus.push(leaderStatusForSpeaker[speaker]);
    }

    console.info("After Spliced Only leaders", leaders)
    let leaderStatusForCouncil: Leader[] = [];
    if (getTotalNumberOfCouncil && getTotalNumberOfCouncil > 0) {
      console.log("getTotalNumberOfCouncil", getTotalNumberOfCouncil);
      for (let leader = 0; leader < leaders.length; leader++) {
        const eachUser: any = leaders[leader];
        if ((eachUser.total > 4 || eachUser.total === 4) && leaderStatusForCouncil.length < getTotalNumberOfCouncil) {
          if (leaderStatusForCouncil.length < getTotalNumberOfSpeaker) {
            eachUser.status = "Council";
            leaderStatusForCouncil.push(eachUser);
          } else {
            let tempArrayAfterSliced = leaderStatusForCouncil.slice(1);
            eachUser.status = "Council";
            leaderStatusForCouncil = [...tempArrayAfterSliced]
            leaderStatusForCouncil.push(eachUser);
          }
          await firestore()
            .collection("users")
            .doc(eachUser.userId)
            .set({ status: "Council" }, { merge: true });
        }
      }
      leaders.splice(0, getTotalNumberOfCouncil);
      console.info("leaders In Council", leaders)
    }

    console.log("Council Data Only", leaderStatusForCouncil)

    for (let speaker = 0; speaker < leaderStatusForCouncil.length; speaker++) {
      leaderStatus.push(leaderStatusForCouncil[speaker]);
    }

    console.info("After Spliced Council", leaderStatus)

    let leaderStatusForAmbassador: Leader[] = [];
    if (getTotalNumberOfAmbassador && getTotalNumberOfAmbassador > 0) {
      console.log("getTotalNumberOfAmbassador", getTotalNumberOfAmbassador);
      for (let leader = 0; leader < leaders.length; leader++) {
        const eachUser: any = leaders[leader];
        if ((eachUser.total >= 6 || eachUser.total == 6) && leaderStatusForAmbassador.length < getTotalNumberOfAmbassador) {
          if (leaderStatusForAmbassador.length < getTotalNumberOfAmbassador) {
            eachUser.status = "Ambassador";
            leaderStatusForAmbassador.push(eachUser);
          } else {
            let tempArrayAfterSliced = leaderStatusForAmbassador.slice(1);
            eachUser.status = "Ambassador";
            leaderStatusForAmbassador = [...tempArrayAfterSliced]
            leaderStatusForAmbassador.push(eachUser);
          }
          await firestore()
            .collection("users")
            .doc(eachUser.userId)
            .set({ status: "Ambassador" }, { merge: true });
        }
      }
      leaders.splice(0, getTotalNumberOfAmbassador);
    }
    for (let speaker = 0; speaker < leaderStatusForAmbassador.length; speaker++) {
      leaderStatus.push(leaderStatusForAmbassador[speaker]);
    }

    let leaderStatusForMinister: Leader[] = [];
    if (getTotalNumberOfMinister && getTotalNumberOfMinister > 0) {
      console.log("getTotalNumberOfMinister", getTotalNumberOfMinister);
      for (let leader = 0; leader < leaders.length; leader++) {
        const eachUser: any = leaders[leader];
        if ((eachUser.total >= 8 || eachUser.total == 8) && leaderStatusForMinister.length < getTotalNumberOfMinister) {
          if (leaderStatusForMinister.length < getTotalNumberOfMinister) {
            eachUser.status = "Minister";
            leaderStatusForMinister.push(eachUser);
          } else {
            let tempArrayAfterSliced = leaderStatusForMinister.slice(1);
            eachUser.status = "Minister";
            leaderStatusForMinister = [...tempArrayAfterSliced]
            leaderStatusForMinister.push(eachUser);
          }
          await firestore()
            .collection("users")
            .doc(eachUser.userId)
            .set({ status: "Minister" }, { merge: true });
        }
      }
      leaders.splice(0, getTotalNumberOfMinister);
    }

    for (let speaker = 0; speaker < leaderStatusForMinister.length; speaker++) {
      leaderStatus.push(leaderStatusForMinister[speaker]);
    }

    let leaderStatusForChairman: Leader[] = [];
    if (getTotalNumberOfChairman && getTotalNumberOfChairman > 0) {
      console.log("getTotalNumberOfChairman", getTotalNumberOfChairman);
      for (let leader = 0; leader < leaders.length; leader++) {
        const eachUser: any = leaders[leader];
        if (eachUser.total >= 10 && leaderStatusForChairman.length < getTotalNumberOfMinister) {
          if (leaderStatusForChairman.length < getTotalNumberOfChairman) {
            eachUser.status = "Chairman";
            leaderStatusForChairman.push(eachUser);
          } else {
            let tempArrayAfterSliced = leaderStatusForChairman.slice(1);
            eachUser.status = "Chairman";
            leaderStatusForChairman = [...tempArrayAfterSliced]
            leaderStatusForChairman.push(eachUser);
          }
          await firestore()
            .collection("users")
            .doc(eachUser.userId)
            .set({ status: "Chairman" }, { merge: true });
        }
      }
      leaders.splice(0, getTotalNumberOfChairman);
    }
    for (let speaker = 0; speaker < leaderStatusForChairman.length; speaker++) {
      leaderStatus.push(leaderStatusForChairman[speaker]);
    }
    console.info("leaders", leaders)
    console.log("leaderStatus Final", leaderStatus);

    leaderStatus.sort((a, b) => Number(a.score) - Number(b.score));

    return await firestore()
      .collection("stats")
      .doc("leaders")
      .set({ leaders: leaderStatus }, { merge: true });
  };

export const calculateStatus: (
  pct: number,
  userTypes: UserTypeProps[]
) => UserTypeProps | undefined = (pct: number, userTypes: UserTypeProps[]) => {
  const sortedUserTypes = userTypes
    .slice()
    .sort((a, b) => Number(a.share) - Number(b.share))
    .reduce((total, current, i, arr) => {
      const partial = arr.slice(0, i + 1);
      const newTotal = partial.reduce((total, current) => {
        return Number(total) + Number(current.share);
      }, 0);
      const newCurrent = { ...current };
      newCurrent.share = newTotal;
      return [...total, newCurrent];
    }, [] as UserTypeProps[]);

  const userType = (
    sortedUserTypes
      ?.map((u, j) => {
        const current: UserTypeProps = sortedUserTypes[j];
        let prev: UserTypeProps | undefined;
        if (j && j != sortedUserTypes.length) {
          prev = sortedUserTypes[j - 1];
        }

        const [is, type] = getStatus(pct, current, prev);
        return is ? type : undefined;
      })
      .filter((result) => result) || []
  )
    .reverse()
    .pop();

  if (userType) {
    return userType;
  }

  return undefined;
};

export const getStatus: (
  percentage: number,
  currentUserType: UserTypeProps,
  prevUserType?: UserTypeProps
) => [boolean, UserTypeProps] = (
  percentage: number,
  currentUserType: UserTypeProps,
  prevUserType?: UserTypeProps
) => {
    return [
      percentage >= (prevUserType?.share || 0) &&
      percentage < currentUserType.share + (prevUserType?.share || 0),
      currentUserType,
    ];
  };

export default Calculation;

export const getLeaderUsers = async (userId: string) => {
  const userObj = await firestore()
    .collection("users")
    .withConverter(userConverter)
    .doc(userId)
    .get();

  const leaders =
    !!userObj.data()?.leader?.length &&
    (await firestore()
      .collection("users")
      .withConverter(userConverter)
      .where(firestore.FieldPath.documentId(), "in", userObj.data()?.leader)
      .get());

  const subscribers =
    !!userObj.data()?.subscribers?.length &&
    (await firestore()
      .collection("users")
      .withConverter(userConverter)
      .where(
        firestore.FieldPath.documentId(),
        "in",
        userObj.data()?.subscribers
      )
      .get());

  const allLeaders = await getLeaders();

  return {
    leaders: leaders
      ? leaders.docs
        .map((leader) => {
          const { status } = leader.data();
          const leaderObj = allLeaders.find((l) => l.userId === leader.id);
          return leaderObj ? { ...leaderObj, status } : undefined;
        })
        .filter((l) => l)
      : undefined,
    subscribers: subscribers
      ? subscribers.docs
        .map((leader) => {
          const { status } = leader.data();
          const leaderObj = allLeaders.find((l) => l.userId === leader.id);
          return leaderObj ? { ...leaderObj, status } : undefined;
        })
        .filter((l) => l)
      : undefined,
  } as {
    leaders?: Leader[];
    subscribers?: Leader[];
  };
};

export const getLeaderUsersByIds = async (userIds: string[]) => {
  // const leaders = await firestore()
  //   .collection("users")
  //   .withConverter(userConverter)
  //   .where("uid", "in", userIds)
  //   .get();

  const queryPromises = userIds.map(async (user) => {
    return await firestore().collection("users").where("uid", "==", user).get();
  });

  const querySnapshots = await Promise.all(queryPromises);
  const leaders: any[] = [];

  querySnapshots.forEach((querySnapshot) => {
    querySnapshot.docs.forEach((doc) => {
      const documentData = doc.data() as any;
      leaders.push(documentData);
    });
  });

  console.log("leaders =>", leaders);

  const allLeaders = await getLeaders();

  return leaders
    .map((leader) => {
      const { status } = leader;
      const leaderObj = allLeaders.find(
        (leaderData) => leaderData.userId === leader.uid
      );
      return leaderObj ? { ...leaderObj, status: status?.name } : undefined;
    })
    .filter((leaderData) => leaderData);
};

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.log(funcName, type, error); // We will modify later
};
