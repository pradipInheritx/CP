import {DocumentData, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import {UserTypeProps} from "./UserType";
import {useContext} from "react";
import UserContext from "../../Contexts/User";
import {follow, Leader} from "../../Contexts/CoinsContext";
import {User as AuthUser} from "firebase/auth";
import firebase from "../../firebase";
import {AvatarType, importFile} from "../../assets/avatars/Avatars";

export type UserProps = {
  paid?: boolean;
  displayName?: string;
  isVoteName?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  phone?: string;
  country?: string;
  status?: UserTypeProps;
  parent?: string;
  children?: string[];
  mfa?: boolean;
  voteStatistics?: VoteStatistics;
  leader?: string[];
  subscribers: string[];
  favorites: string[];
  lang?: string;
  token?: string;
  wallet?: string;
  rewardStatistics?:RewardStatistics;
  uid?:string;
  userName?:any;
};

class User implements UserProps {
  private readonly _admin: boolean | undefined;
  private readonly _parent: string | undefined;
  private readonly _address: string | undefined;
  private readonly _avatar: string | undefined;
  private readonly _children: string[] | undefined;
  private readonly _country: string | undefined;
  private readonly _displayName: string | undefined;
  private readonly _email: string | undefined;
  private readonly _firstName: string | undefined;
  private readonly _lastName: string | undefined;
  private readonly _leader: string[] | undefined;
  private readonly _mfa: boolean | undefined;
  private readonly _phone: string | undefined;
  private readonly _status: UserTypeProps | undefined;
  private readonly _subscribers: string[];
  private readonly _voteStatistics: VoteStatistics | undefined;
  private readonly _rewardStatistics: RewardStatistics | undefined;
  private readonly _favorites: string[];

  constructor({user}: { user: UserProps }) {
    this._parent = user.parent;
    this._address = user.address;
    this._avatar = user.avatar;
    this._children = user.children;
    this._country = user.country;
    this._displayName = user.displayName;
    this._email = user.email;
    this._firstName = user.firstName;
    this._lastName = user.lastName;
    this._leader = user.leader;
    this._mfa = user.mfa;
    this._phone = user.phone;
    this._status = user.status;
    this._subscribers = user.subscribers;
    this._voteStatistics = user.voteStatistics;
    this._rewardStatistics = user.rewardStatistics;
    this._favorites = user.favorites;
  }

  get favorites(): string[] {
    return this._favorites;
  }

  get parent(): string | undefined {
    return this._parent;
  }

  get address(): string | undefined {
    return this._address;
  }

  get avatar(): string | undefined {
    return this._avatar;
  }

  get children(): string[] | undefined {
    return this._children;
  }

  get country(): string | undefined {
    return this._country;
  }

  get displayName(): string | undefined {
    return this._displayName;
  }

  get email(): string | undefined {
    return this._email;
  }

  get firstName(): string | undefined {
    return this._firstName;
  }

  get lastName(): string | undefined {
    return this._lastName;
  }

  get leader(): string[] | undefined {
    return this._leader;
  }

  get mfa(): boolean | undefined {
    return this._mfa;
  }

  get phone(): string | undefined {
    return this._phone;
  }

  get status(): UserTypeProps | undefined {
    return this._status;
  }

  get subscribers(): string[] {
    return this._subscribers;
  }

  get voteStatistics(): VoteStatistics | undefined {
    return this._voteStatistics;
  }
  get rewardStatistics(): RewardStatistics | undefined {
    return this._rewardStatistics;
  }

  get admin(): boolean | undefined {
    return this._admin;
  }
}

export type VoteStatistics = {
  total: number;
  successful: number;
  score: number;
  rank: number;
  commission: number;
  pax: number;
};
export type RewardStatistics = {
  total: number;
  diamonds: number;
  extraVote: number;
  cards: string[];
  claimed: number;
};

export const userConverter = {
  toFirestore(user: UserProps): DocumentData {
    return user;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): UserProps {
    const data = snapshot.data(options)!;
    return data as UserProps;
  },
};

export default User;

export const useAdmin = () => {
  const {admin} = useContext(UserContext);
  return admin;
};

type HasAvatar = { avatar?: string };
export const getAvatar = (userInfo: HasAvatar) => {
  if (Object.values(AvatarType).includes(userInfo?.avatar as AvatarType)) {
    return importFile(`./The${userInfo?.avatar}`).default || "";
  } else {
    return importFile("../../../assets/images/no-image", "png").default;
  }
};

export const toFollow = (leaders: string[], id: string) =>
  !leaders?.includes(id);

export const setChecked =
  (leaders: Leader[], user?: AuthUser) =>
    async (userId: string, check: boolean) => {
      const ll = leaders.find((l) => l.userId === userId);
      if (user && ll) {
        await follow(ll, user, check);
      }
    };

export type NotificationProps = {
  user: string;
  message: {
    title: string;
    body: string;
  },
  time: firebase.firestore.Timestamp;
  read: false;
}
