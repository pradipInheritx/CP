import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import Common from './Common';
import Dashboard from './Dashboard';
import TaskList from './TaskList';
import MailApp from './MailApp';
import Chat from './Chat';
import ContactApp from './ContactApp';
import ProfileApp from './ProfileApp';
import WallApp from './WallApp';
import Auth from './Auth';
import Users from './Users';
import SubAdmin from './SubAdmin';
import Coin from './Coin';
import Pair from './Pair';
import UsersDetelis from './UsersDetelis';
import TimeFrame from './TimeFrame';
import VotePerUser from './VotePerUser';
import ThreeTable from './ThreeTable';
import VoteBoost from './VoteBoost';
import RewardTr from './RewardTr';
import PaymentTr from './PaymentTr';
import VotePass from './VotePass';
import CMPTr from './CMPTr';
import TrTypes from './TrTypes';
import RewardNFT from './RewardNFT';
import StatusType from './StatusType';
import CMPSetting from './CMPSetting';
import PAXGenera from './PAXGenera';

export default history =>

  combineReducers({
    router: connectRouter(history),
    common: Common,
    taskList: TaskList,
    dashboard: Dashboard,
    mailApp: MailApp,
    chat: Chat,
    auth: Auth,
    contactApp: ContactApp,
    profileApp: ProfileApp,
    wallApp: WallApp,
    usersReducer: Users,
    subAdmin: SubAdmin,
    coinReducer: Coin,
    pairReducer: Pair,
    UsersDetelis: UsersDetelis,
    TimeFrame: TimeFrame,
    VotePerUser: VotePerUser,
    ThreeTable: ThreeTable,
    VoteBoost: VoteBoost,
    RewardTr: RewardTr,
    PaymentTr: PaymentTr,
    VotePass: VotePass,
    CMPTr: CMPTr,
    TrTypes: TrTypes,
    RewardNFT: RewardNFT,
    StatusType: StatusType,
    CMPSetting: CMPSetting,
    PAXGenera: PAXGenera,
  });
