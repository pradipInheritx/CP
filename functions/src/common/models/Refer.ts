import {firestore} from "firebase-admin";
import {userConverter} from "./User";
import {UserProps} from "../interfaces/User.interface"
import FieldValue = firestore.FieldValue;

export type VoteRules = {
  maxVotes: number;
  givenCPM: number;
  CPMReturnSuccess: number;
  CPMReturnFailure: number;
  CPMReturnInRange: number;
};

export type CPMSettings = {
  signupReferral: number;
  pctReferralActivity: number;
  orderBookWeight: number;
};

class Refer {
  private static voteRules: VoteRules = {} as VoteRules;
  private static CPMSettings: CPMSettings = {} as CPMSettings;
  private parent: string;
  private child?: string;
  private readonly childRef?: FirebaseFirestore.DocumentReference<UserProps>;
  private parentRef: FirebaseFirestore.DocumentReference<UserProps>;

  constructor(parent: string, child?: string) {
    this.parent = parent;
    this.child = child;
    this.parentRef = firestore()
        .collection("users")
        .withConverter(userConverter)
        .doc(parent);
    if (child) {
      this.childRef = firestore()
          .collection("users")
          .withConverter(userConverter)
          .doc(child);
    }
  }

  static async getSettings(): Promise<{
    CPMSettings: CPMSettings;
    voteRules: VoteRules;
  }> {
    if (
      !Object.values(Refer.CPMSettings).length ||
      !Object.values(Refer.voteRules).length
    ) {
      const settings = await firestore()
          .collection("settings")
          .doc("settings")
          .get();

      const {voteRules, CPMSettings} =
        (settings.data() as {
          voteRules: VoteRules;
          CPMSettings: CPMSettings;
        }) || {};
      Refer.voteRules = voteRules;
      Refer.CPMSettings = CPMSettings;
      return {voteRules, CPMSettings};
    }

    const {voteRules, CPMSettings} = Refer;
    return {voteRules, CPMSettings};
  }

  async returnValue(success = false): Promise<number> {
    const {voteRules} = await Refer.getSettings();
    return (
      (Number(voteRules?.givenCPM) || 1) *
      (success ?
        Number(voteRules?.CPMReturnSuccess) :
        Number(voteRules?.CPMReturnFailure))
    );
  }

  async assignReferral(): Promise<void> {
    const {CPMSettings} = await Refer.getSettings();
    const {parent, child} = this;
    const signupReferral = Number(CPMSettings?.signupReferral);
    const refer = new Refer(parent, child);
    await refer.payParent(signupReferral);

    await this.parentRef.update({
      children: FieldValue.arrayUnion(child),
    });

    if (this.childRef) {
      await this.childRef.update({
        parent,
      });
    }
  }

  async payParent(score: number): Promise<void> {
    const {CPMSettings} = await Refer.getSettings();
    const parent = await this.parentRef.get();
    const {pctReferralActivity} = CPMSettings;
    const parentData = parent.data();
    const parentVoteStatistics = parentData?.voteStatistics;
    const getCommissionNumber = (Number(score * pctReferralActivity) / 100).toFixed(4);
    const commission = parseFloat(getCommissionNumber)
    const newScore = (Number(parentVoteStatistics?.score || 0) + commission).toFixed(4)
    const newCommission = Number(parentVoteStatistics?.commission || 0) + commission
    console.log("Score ",score)
    console.log("parentVoteStatistics : ",parentVoteStatistics)
    console.log("parent get commission :",commission)
    console.log("new Score ",newScore)
    console.log("newCommission :",newCommission)

    if (parentData?.parent) {
      console.log("it go to parent of parent")
      const refer = new Refer(parentData.parent, parent.id);
      await refer.payParent(commission);
    }

    await this.parentRef.update({
      voteStatistics: {
        successful: Number(parentVoteStatistics?.successful || 0),
        rank: Number(parentVoteStatistics?.rank || 0),
        total: Number(parentVoteStatistics?.total || 0),
        score: parseFloat(newScore),
        commission: newCommission,
      },
    });
  }
}

export default Refer;
