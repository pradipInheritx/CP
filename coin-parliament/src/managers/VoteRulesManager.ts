import { AdminManager } from "../common/models/AdminManager";
import { VoteRules } from "../Contexts/AppContext";

class VoteRulesManager extends AdminManager<VoteRules> {
  constructor(VoteRules: VoteRules, setVoteRules: (obj: VoteRules) => void) {
    super(VoteRules, setVoteRules);

    this.decorator = (rules: VoteRules) => {
      rules = {
        CPMReturnFailure: rules.CPMReturnFailure || 0,
        CPMReturnSuccess: rules.CPMReturnSuccess || 0,
        givenCPM: rules.givenCPM || 0,
        maxVotes: rules.maxVotes || 0,
      } as VoteRules;
      setVoteRules(rules);

      return rules;
    };
  }
}

export default VoteRulesManager;
