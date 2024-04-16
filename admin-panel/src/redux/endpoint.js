export const endpoint = {
  // auth module api endpoints
  authCreateAdminUser: "/api/v1/admin/auth/createAdminUser",
  authLogin: "/api/v1/admin/auth/login",
  authlogout: "/api/v1/admin/auth/logout",
  getAuthToken: "/api/v1/admin/auth/getAuthToken",
  forgotPassword: "/api/v1/admin/auth/forgot-password",
  resetPassword: "/api/v1/admin/auth/reset-password",
  // chat.js action endpoints
  chatUser: "/chat/users",
  contactUsers: "/chat/contact/users",
  chatConversation: "/chat/conversation",
  // CMPSetting action endpoints
  usersCMP: "/users", // common for this func getCMPSetting and updateCMPSetting
  //   CMPTr action endpoints
  getPerUserVote: "/api/v1/admin/voteSetting/getPerUserVote",
  createPerUserVote: "/api/v1/admin/voteSetting/createPerUserVote",
  updatePerUserVoteById: "/api/v1/admin/voteSetting/updatePerUserVoteById",
  updateTimeframe: "/api/v1/admin/voteSetting/updateTimeframe",
  deletePerUserVoteById: "/api/v1/admin/voteSetting/deletePerUserVoteById",
  // Coins action file endpoints
  getAllCoins: "/api/v1/admin/coins/getAllCoins",
  voteBarRange: "/api/v1/admin/coins/updateCoin/voteBarRange",
  updateCoinStatus: "/api/v1/admin/coins/updateCoinStatus",
  bulkDelete: "/api/v1/admin/users/bulk-delete",
  deleteSubAdmin: "/api/v1/admin/sub-admin/deleteSubAdmin",
  // ContactApp action file endpoints
  labels: "/contact/labels", // common for this func getLabelsList  and addNewLabel and updateLabel
  deleteLabels: "/contact/labels/delete",
  contact: "/contact", // common for this func getContactsList and createContact and onUpdateContact
  updateStarred: "/contact/update-starred",
  deleteContact: "/contact/delete",
  updateLabel: "/contact/update-label",
  getContactCount: "/contact/counter",
  //Dashbord action endpoints
  dashboardData: "/users",
  //MailApp action endpoints
  mailCount: "/counter",
  mailLables: "/labels", // common for this func getLabelsList and addNewLabel and updateLabel
  lableDelete: "/labels/delete",
  connections: "/connections", // common for this func getConnectionsList and addNewConnection and removeConnection
  mails: "/mails",
  updateFolder: "/mailApp/update-folder",
  mailUpdateLabel: "/mailApp/update-label",
  updateFavorite: "/mailApp/update-favorite",
  updateRead: "/mailApp/update-read",
  updateImportant: "/mailApp/update-important",
  commonMail: "/mail", // common for this func composeMail and onGetSelectedMail and onUpdateMail
  mailReply: "/mail/reply",
  // Pairs action endpoints
  getAllCoinsPairs: "/api/v1/admin/coinsPair/getAllCoinsPairs",
  createPairCoin: "/api/v1/admin/coinsPair/createPairCoin",
  voteBarRange: "/api/v1/admin/coinsPair/updateCoinPair/voteBarRange",
  updateCoinPairStatus: "/api/v1/admin/coinsPair/updateCoinPairStatus",
  usersBulkDelete: "/api/v1/admin/users/bulk-delete",
  usersDeleteSubAdmin: "/api/v1/admin/sub-admin/deleteSubAdmin",
  // PAXGenera action endpoints
  paxUsers: "/users", // common for this func getPAXGenera and updatePAXGenera
  // PaymentTr action endpoints
  getPerUserVoteTr: "/api/v1/admin/voteSetting/getPerUserVote",
  createPerUserVoteTr: "/api/v1/admin/voteSetting/createPerUserVote",
  updatePerUserVoteByIdTr: "/api/v1/admin/voteSetting/updatePerUserVoteById",
  updateTimeframeTr: "/api/v1/admin/voteSetting/updateTimeframe",
  deletePerUserVoteByIdTr: "/api/v1/admin/voteSetting/deletePerUserVoteById",
  //ProfileApp action endpoints
  profile: "/profile",
  // ReturnSetting action endpoints
  getVoteAndretrunSettings: "/api/v1/admin/settings/getVoteAndretrunSettings",
  updateVoteAndReturnSettings:
    "/api/v1/admin/settings/updateVoteAndReturnSettings",
  // RewardNft action endpoints
  ForVideoImg: "/api/v1/generic/admin/uploadFiles/",
  getAllAlbums: "/api/v1/admin/rewards/getAllAlbums",
  createAlbum: "/api/v1/admin/rewards/createAlbum",
  updateAlbum: "/api/v1/admin/rewards/updateAlbum",
  updateStatus: "/api/v1/admin/users/update-status", // common for this func updateRewardCardStatus and updateRewardAlbumStatus
  deleteAlbum: "/api/v1/admin/rewards/deleteAlbum",
  getCardListing: "/api/v1/admin/rewards/getCardListing",
  createCard: "/api/v1/admin/rewards/createCard",
  updateCard: "/api/v1/admin/rewards/updateCard",
  deleteCard: "/api/v1/admin/rewards/deleteCard",
  // RewardSetting action endpoints
  GetAllRewardsDistribution:
    "/api/v1/admin/RewardsDistribution/GetAllRewardsDistribution",
  createRewardsDistribution:
    "/api/v1/admin/RewardsDistribution/createRewardsDistribution",
  // RewardTr action endpoints
  getRewardTransactions: "/getRewardTransactions",
  createPerUserVote: "/voteSetting/createPerUserVote",
  updatePerUserVoteById: "/voteSetting/updatePerUserVoteById",
  rewordUpdateTimeframe: "/voteSetting/updateTimeframe",
  rewordDeletePerUserVoteById: "/voteSetting/deletePerUserVoteById",
  // StatusType action endpoints
  getTimeframe: "/api/v1/admin/voteSetting/getTimeframe",
  createTimeframe: "/api/v1/admin/voteSetting/createTimeframe",
  statusUpdateTimeframe: "/api/v1/admin/voteSetting/updateTimeframe",
  statusBulkDelete: "/api/v1/admin/users/bulk-delete",
  deleteTimeframeById: "/api/v1/admin/voteSetting/deleteTimeframeById",
  // subAdmin action endpoints
  subAdminList: "/api/v1/admin/sub-admin/subAdminList",
  createAdminUser: "/api/v1/admin/auth/createAdminUser",
  subAdminUpdateStatus: "/api/v1/admin/sub-admin/updateStatus", // common for this func updateSubAdmin and updateSubAdminStatus
  subAdminBulkDelete: "/api/v1/admin/users/bulk-delete",
  subAdminDelete: "/api/v1/admin/sub-admin/deleteSubAdmin",
  // TaskList action endpoints
  tasks: "/tasks", // common for this func getTasks and addTask and updateTask and deleteTask
  taskList: "/task_list", // common for this func getTaskList and addTaskList and deleteTaskLIst
  tasksCounter: "/tasks/counter",
  // ThreeTable action endpoints
  getFollowersAndFollowingCount:
    "/api/v1/admin/FollowTable/getFollowersAndFollowingCount",
  getFollowersUsers: "/api/v1/admin/FollowTable/getFollowersUsers", // common for this func getFollowersUsers and getFollowingUsers
  // TimeFrame action endpoints
  timeframe: "/api/v1/admin/voteSetting/getTimeframe",
  createTimefr: "/api/v1/admin/voteSetting/createTimeframe",
  updateTimefr: "/api/v1/admin/voteSetting/updateTimeframe",
  updateTimeframes: "/api/v1/admin/voteSetting/updateTimeframe/timeFrames",
  bulkDeleteTimeFr: "/api/v1/admin/users/bulk-delete",
  deleteTimefrById: "/api/v1/admin/voteSetting/deleteTimeframeById",
  // TrTypes action endpoints
  getTimeframeTr: "/api/v1/admin/voteSetting/getTimeframe",
  createTimeframeTr: "/api/v1/admin/voteSetting/createTimeframe",
  updateTimeframeTr: "/api/v1/admin/voteSetting/updateTimeframe", // common for this func updateTrTypesStatus and updateTrTypesStatus
  bulkDeleteTr: "/api/v1/admin/users/bulk-delete",
  deleteTimeframeByIdTr: "/api/v1/admin/voteSetting/deleteTimeframeById",
  // Users action endpoints
  users: "/users", // common for this func getUsers and addNewUser and updateUser and deleteUser
  updateUserStatus: "/users/update-status",
  bulkDeleteUsers: "/users/bulk-delete",
  getAllUserStatistics: "/getAllUserStatistics",
  exportUserStatisticsData: "/exportUserStatisticsData",
  // userDetelis action endpoints
  getUserList: "/api/v1/admin/auth/getUserList",
  userSetting: "/api/v1/admin/users", // common for this func getUserSetting and addNewUser and updateUser and deleteUser
  userUpdateStatus: "/api/v1/admin/users/update-status",
  userBulkDelete: "/api/v1/admin/users/bulk-delete",
  // UserTypeSetting action endpoints
  getUserTypeSettings: "/api/v1/admin/userTypeSettings/getUserTypeSettings",
  userTypeSettings: "/api/v1/admin/userTypeSettings/update/userTypeSettings",
  // VoteBoost action endpoints
  voteGetTimeframe: "/api/v1/admin/voteSetting/getTimeframe",
  voteCreateTimeframe: "/api/v1/admin/voteSetting/createTimeframe",
  voteUpdateTimeframe: "/api/v1/admin/voteSetting/updateTimeframe", // common for this func updateVoteBoost and updateVoteBoostStatus
  voteBulkDelete: "/api/v1/admin/users/bulk-delete",
  voteDeleteTimeframeById: "/api/v1/admin/voteSetting/deleteTimeframeById",
  //common for this action file VotePerUser  and VotePass action endpoints
  voteGetPerUserVote: "/api/v1/admin/voteSetting/getPerUserVote",
  voteCreatePerUserVote: "/api/v1/admin/voteSetting/createPerUserVote",
  voteUpdatePerUserVoteById: "/api/v1/admin/voteSetting/updatePerUserVoteById",
  votePassUpdateTimeframe: "/api/v1/admin/voteSetting/updateTimeframe",
  votePassDeletePerUserVoteById:
    "/api/v1/admin/voteSetting/deletePerUserVoteById",
  //VoteSetting action endpoints
  VoteGetVoteAndretrunSettings:
    "/api/v1/admin/settings/getVoteAndretrunSettings",
  voteUpdateVoteAndReturnSettings:
    "/api/v1/admin/settings/updateVoteAndReturnSettings",
  // WallApp action endpoints
  wallUser: "/wall/user",
  wallPosts: "/wall/posts", // common for this func getFeedPosts and createPost and updatePostLikeStatus
  wellPostComments: "/wall/posts/comments"
};
