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
import { logger } from "firebase-functions/v1";

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
    console.info("voteResult", voteResult);
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

      const downRange = Number(startValue) - Number(CPMRangeCurrentValue);

      if (endValue && endValue < upRange && endValue > downRange) {
        successScoreValue = 2;
        const score = returnValue(
          successScoreValue || 0,
          settings.data()?.voteRules,
          user?.status
        );
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
        voteResult.direction;
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

  calcValueExpirationTime(): void {
    console.log("calcValueExpirationTime", this.price, typeof this.price);
    this.voteResult.valueExpirationTime = this.price;
  }

  calcSuccess(): void {
    const { voteResult } = this;
    console.info("voteResult", voteResult);
    // const CPMReturnRangePercentage = voteResult?.CPMRangePercentage || 10;
    const CPMRangeCurrentValue = voteResult?.CPMRangeCurrentValue
      ? voteResult?.CPMRangeCurrentValue
      : 0;
    if (typeof this.price === "number") {
      const startValue = voteResult.valueVotingTime;
      const endValue: any = voteResult?.valueExpirationTime;

      const upRange: any = Number(startValue) + Number(CPMRangeCurrentValue);

      const downRange = Number(startValue) - Number(CPMRangeCurrentValue);

      if (typeof startValue === "number" && typeof endValue === "number") {
        const trendChange = Number(
          Number(((endValue || 0) / (startValue || 1) - 1) * 100).toFixed(3)
        );
        voteResult.trendChange = trendChange;
      }

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
      }
      if (this.status === 0 || this.status) {
        this.voteResult.success = this.status;
      }
    } else {
      if (
        Array.isArray(voteResult.valueVotingTime) &&
        Array.isArray(voteResult.valueExpirationTime)
      ) {
        const diff = [
          voteResult.valueExpirationTime[0] - voteResult.valueVotingTime[0],
          voteResult.valueExpirationTime[1] - voteResult.valueVotingTime[1],
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
          this.voteResult.success = 2;
        } else {
          this.voteResult.success = voteResult.direction === winner ? 1 : 0;
        }
        if (this.status === 0 || this.status) {
          this.voteResult.success = this.status;
        }
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
      const refereeScrore: number = parseFloat(
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
        subscribers: subscribers?.length || 0,
        leaders: leader?.length || 0,
        pct: (voteStatistics?.successful || 0) / (voteStatistics?.total || 1),
        successful: voteStatistics?.successful,
        total: voteStatistics?.total || 0,
      } as Leader;
    })
    .sort((a, b) => Number(b.score) - Number(a.score));
};

export const setLeaders: () => Promise<FirebaseFirestore.WriteResult> =
  async () => {
    const leaders = await getLeaders();
    // console.log("Leaders : ", leaders)
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

    const leaderStatus: Leader[] = [];

    for (let userType = 0; userType < sortedUserType.length; userType++) {
      const eachUserType: any = sortedUserType[userType];

      const userLengthForThisUserType = Math.round(
        (leaders.length * Number(eachUserType.share)) / 100
      );
      logger.warn("Start userType ")
      logger.log("eachUserType : ", eachUserType);
      logger.log("leader.length - eachUserType.share : ", leaders.length," - ",eachUserType.share)
      logger.log("userLengthForThisUserType : ", userLengthForThisUserType);
      for (let leader = 0; leader < leaders.length; leader++) {
        const eachUser: any = leaders[leader];
        logger.warn("eachUser : ",eachUser?.userId)
        if (
          eachUser.total >= eachUserType.minVote &&
          leader <= userLengthForThisUserType
        ) {
          eachUser.status = eachUserType.name;
          leaderStatus.push(eachUser);
          logger.log("eachUser.status = eachUserType.name", eachUser.status, eachUserType.name)
          await firestore()
            .collection("users")
            .doc(eachUser.userId)
            .set({ status: eachUserType }, { merge: true });

          leaders.splice(leader, 1);
        }
      }
    }

    // console.log("leaderStatus : ",leaderStatus)
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
