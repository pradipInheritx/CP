import subAdminRouter from "./SubAdmin.routes";
import authAdminRouter from "./Auth.routes";
import coinRouter from "./Coin.routes";
import coinPairRouter from "./CoinPair.routes";
import rewardsDistributionRouter from "./RewardsDistribution.routes";
import rewardNftAdminRouter from "./RewardNftAdmin.routes";
import timeframeRouter from "./VoteSettings/timeframe.routes";
import perUserVoteRouter from "./VoteSettings/perUserVotes.routes";
import userTypeSettingsRouter from "./UserTypeSettings.routes";
import voteAndSettingsRouter from "./VoteSettings/VoteAndRetrunSettings.routes";
import pushNotificationSettingRouter from "./PushNotificationSetting.routes";
import FollowTableRouter from "./FollowTable.routes";
import foundationRouter from "./Foundation.routes";
import paymentRouter from "./Payments.routes";
import adminPaymentRouter from "./AdminPayment.routes";

const Routers = {
    subAdminRouter,
    authAdminRouter,
    coinRouter,
    coinPairRouter,
    rewardNftAdminRouter,
    rewardsDistributionRouter,
    timeframeRouter,
    perUserVoteRouter,
    userTypeSettingsRouter,
    voteAndSettingsRouter,
    pushNotificationSettingRouter,
    FollowTableRouter,
    foundationRouter,
    paymentRouter,
    adminPaymentRouter
}

export default Routers;