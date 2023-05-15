import {
  userConverter,
  UserProps,
  userTypeConverter,
  UserTypeProps,
  VoteStatistics,
} from "./User";
import { Direction, voteConverter, VoteResultProps } from "./Vote";
import { firestore, messaging } from "firebase-admin";
import Refer, { VoteRules } from "./Refer";
import { sendNotification } from "./Notification";
import { voteExpireAndGetCpmNotification } from "./SendCustomNotification"


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
      (Number(status.givenCPM) || 1) * Number(voteRules.CPMReturnSuccess);
  } else if (success === 2) {
    CPMReturn =
      (Number(status.givenCPM) || 1) * Number(voteRules.CPMReturnInRange);
  } else {
    CPMReturn =
      (Number(status.givenCPM) || 1) * Number(voteRules.CPMReturnFailure);
  }
  console.log("GIVEN CMP >>>>>>>>>", (Number(voteRules.givenCPM) || 1) * CPMReturn)
  return (Number(voteRules.givenCPM) || 1) * CPMReturn;
};
class Calculation {
  private readonly voteResult: VoteResultProps;
  private db: firestore.Firestore;
  private readonly price: number | number[];
  private readonly id: string;
  private readonly userId: string;

  constructor(
    voteResult: VoteResultProps,
    price: number | number[],
    id: string,
    userId: string
  ) {
    console.log("voteResult =>", voteResult);

    this.voteResult = voteResult;
    this.price = price;
    this.id = id;
    this.db = firestore();
    this.userId = userId;
  }

  async calc(
    ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
  ): Promise<void> {
    console.log("calcValueExpirationTime");
    this.calcValueExpirationTime();
    console.log("calcSuccess");
    this.calcSuccess();
    console.log("updateVote");
    await this.updateVote(ref);
    console.log("giveAway");
    await this.giveAway();
    console.log("setTotals");
    await this.setTotals();
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
      await firestore()
        .collection("votes")
        .doc(this.id)
        .set({ score }, { merge: true });

      voteStatistics.score += score;

      // For Add Only Commission In Current User
      const { CPMSettings } = await Refer.getSettings();
      const { pctReferralActivity } = CPMSettings;
      const commission = Number(score * pctReferralActivity) / 100;
      user.refereeScrore = (user.refereeScrore ? user.refereeScrore : 0) + commission;

      await ref.set({ voteStatistics, refereeScrore: user.refereeScrore }, { merge: true });

      if (user.parent) {
        const refer = new Refer(user.parent, "");
        await refer.payParent(score);
        //Send Notification For CMP Change
        const getVotesQuery = await firestore()
          .collection("votes")
          .doc(this.id)
          .get();
        const getVote: any = getVotesQuery.data();
        console.log("send Notification for CPM")
        await voteExpireAndGetCpmNotification(userId, score, getVote.coin)


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

  calcValueExpirationTime(): void {
    console.log("calcValueExpirationTime", this.price, typeof this.price);
    this.voteResult.valueExpirationTime = this.price;
  }

  // calcSuccess(): void {
  //   const {voteResult} = this;
  //   if (typeof this.price === "number") {
  //     const bear =
  //       !!voteResult.valueExpirationTime &&
  //       voteResult.valueExpirationTime <= voteResult.valueVotingTime &&
  //       voteResult.direction === Direction.BEAR;
  //     const bull =
  //       !!voteResult.valueExpirationTime &&
  //       voteResult.valueExpirationTime > voteResult.valueVotingTime &&
  //       voteResult.direction === Direction.BULL;
  //     this.voteResult.success = bull || bear;
  //   } else {
  //     if (
  //       Array.isArray(voteResult.valueVotingTime) &&
  //       Array.isArray(voteResult.valueExpirationTime)
  //     ) {
  //       const diff = [
  //         voteResult.valueExpirationTime[0] / voteResult.valueVotingTime[0],
  //         voteResult.valueExpirationTime[1] / voteResult.valueVotingTime[1],
  //       ];

  //       const winner = diff[0] < diff[1] ? 1 : 0;
  //       this.voteResult.success = voteResult.direction === winner;
  //     }
  //   }
  // }

  calcSuccess(): void {
    const { voteResult } = this;
    console.info("voteResult", voteResult)
    //const CPMReturnRangePercentage = voteResult?.CPMRangePercentage || 10;
    let CPMRangeCurrentValue = voteResult?.CPMRangeCurrentValue ? voteResult?.CPMRangeCurrentValue : 0;
    if (typeof this.price === "number") {
      const startValue = voteResult.valueVotingTime;
      const endValue: any = voteResult?.valueExpirationTime;
      // const upRange: any =
      //   Number(startValue) +
      //   (Number(startValue) * CPMReturnRangePercentage) / 100;
      const upRange: any = Number(startValue) + Number(CPMRangeCurrentValue)
      // const downRange =
      //   Number(startValue) -
      //   (Number(startValue) * CPMReturnRangePercentage) / 100;

      const downRange = Number(startValue) - Number(CPMRangeCurrentValue)

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
    } else {
      if (
        Array.isArray(voteResult.valueVotingTime) &&
        Array.isArray(voteResult.valueExpirationTime)
      ) {
        // const diff = [
        //   voteResult.valueExpirationTime[0] / voteResult.valueVotingTime[0],
        //   voteResult.valueExpirationTime[1] / voteResult.valueVotingTime[1],
        // ];

        // const winner = diff[0] < diff[1] ? 1 : 0;
        // const averageValue = Math.abs(diff[0] - diff[1]) * 100;
        // console.info(
        //   "averageValue",
        //   averageValue,
        //   "CPMReturnRangePercentage",
        //   CPMReturnRangePercentage
        // );
        // if (averageValue <= CPMReturnRangePercentage) {
        //   this.voteResult.success = 2;
        // } else {
        //   this.voteResult.success = voteResult.direction === winner ? 1 : 0;
        // }

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
        if (averageValue <= CPMRangeCurrentValue) {
          this.voteResult.success = 2;
        } else {
          this.voteResult.success = voteResult.direction === winner ? 1 : 0;
        }
      }
    }
  }
}

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
        total: voteStatistics?.total || 0,
      } as Leader;
    })
    .sort((a, b) => Number(b.score) - Number(a.score));
};

export const setLeaders: () => Promise<FirebaseFirestore.WriteResult> =
  async () => {
    let leaders = await getLeaders();
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

      for (let leader = 0; leader < leaders.length; leader++) {
        const eachUser: any = leaders[leader];
        if (eachUser.total >= eachUserType.minVote && leader <= userLengthForThisUserType) {
          eachUser.status = eachUserType.name;
          leaderStatus.push(eachUser);
          const userDoc = await firestore()
            .collection("users")
            .doc(eachUser.userId)
            .get(); // Get Previous Status Of User
          await sendNotificationForTitleUpgrade(eachUser, userDoc); // Send Notification To User
          await firestore()
            .collection("users")
            .doc(eachUser.userId)
            .set({ status: eachUserType }, { merge: true });

          leaders.splice(leader, 1)
        }
      }
    }

    return await firestore()
      .collection("stats")
      .doc("leaders")
      .set({ leaders: leaderStatus }, { merge: true });
  };

export const sendNotificationForTitleUpgrade = async (eachUser: any, userDoc: any) => {
  const { token, status } = userDoc.data() || {};
  if (token && (status.name !== eachUser.status)) {
    const body = "You just earned a Parliament skill badge! Who's next?";

    const message: messaging.Message = {
      token,
      notification: {
        title: "You just earned a Parliament skill badge! Who's next?",
        body,
      },
      webpush: {
        headers: {
          Urgency: "high",
        },
        fcmOptions: {
          link: "#", // TODO: put link
        },
      },
    };
    console.info("Send Notification To User", "Status", status.name, "eachUser.status", eachUser.status)
    await sendNotification({
      token,
      message,
      body,
      title: "You just earned a Parliament skill badge! Who's next?",
      id: eachUser.userId,
    });
  }
}


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
    leaders: leaders ?
      leaders.docs
        .map((leader) => {
          const { status } = leader.data();
          const leaderObj = allLeaders.find((l) => l.userId === leader.id);
          return leaderObj ? { ...leaderObj, status } : undefined;
        })
        .filter((l) => l) :
      undefined,
    subscribers: subscribers ?
      subscribers.docs
        .map((leader) => {
          const { status } = leader.data();
          const leaderObj = allLeaders.find((l) => l.userId === leader.id);
          return leaderObj ? { ...leaderObj, status } : undefined;
        })
        .filter((l) => l) :
      undefined,
  } as {
    leaders?: Leader[];
    subscribers?: Leader[];
  };
};

export const getLeaderUsersByIds = async (userIds: string[]) => {
  const leaders = await firestore()
    .collection("users")
    .withConverter(userConverter)
    .where(firestore.FieldPath.documentId(), "in", userIds)
    .get();

  const allLeaders = await getLeaders();

  return leaders.docs
    .map((leader) => {
      const { status } = leader.data();
      const leaderObj = allLeaders.find((l) => l.userId === leader.id);
      return leaderObj ? { ...leaderObj, status: status?.name } : undefined;
    })
    .filter((l) => l);
};

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.log(funcName, type, error); // We will modify later
};
