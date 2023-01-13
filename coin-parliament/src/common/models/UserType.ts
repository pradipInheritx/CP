import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import isNumber from "lodash/isNumber";

export type UserTypeProps = {
  index: number;
  name: string;
  givenCPM: number;
  weight: number;
  color?: Colors;
  share: number;
};

export enum Colors {
  PLATINUM = "Platinum",
  GOLD = "Gold",
  SILVER = "Silver",
}

export const userTypeConverter = {
  toFirestore(userTypes: { userTypes: UserTypeProps[] }): DocumentData {
    return userTypes;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): { userTypes: UserTypeProps[] } {
    const data = snapshot.data(options)!;
    return {
      userTypes: (
        (data as { userTypes: UserTypeProps[] }).userTypes || []
      ).filter(
        (u) =>
          isNumber(u.index) &&
          u.name &&
          isNumber(Object.values(Colors).findIndex((c) => c === u.color)) &&
          isNumber(u.weight) &&
          isNumber(u.givenCPM)
      ),
    };
  },
};

export const defaultUserType: UserTypeProps = {
  color: Colors.SILVER,
  givenCPM: 1,
  index: 0,
  name: "Member",
  weight: 1,
  share: 40,
};

export class UserType implements UserTypeProps {
  private readonly _share: number;
  private readonly _color?: Colors;
  private readonly _givenCPM: number;
  private readonly _index: number;
  private readonly _name: string;
  private readonly _weight: number;

  constructor(props: UserTypeProps) {
    this._color = props.color;
    this._givenCPM = props.givenCPM;
    this._index = props.index;
    this._name = props.name;
    this._weight = props.weight;
    this._share = props.share;
  }

  get share(): number {
    return this._share;
  }

  get color(): Colors | undefined {
    return this._color;
  }

  get givenCPM(): number {
    return this._givenCPM;
  }

  get index(): number {
    return this._index;
  }

  get name(): string {
    return this._name;
  }

  get weight(): number {
    return this._weight;
  }
}

export const validateTotalShare = (u: UserTypeProps[]) => {
  const totalShare = u.reduce((total, current) => {
    return total + Number(current.share || 0);
  }, 0);
  return totalShare === 100;
};
