import { AdminManager } from "../common/models/AdminManager";
import { defaultUserType, UserTypeProps } from "../common/models/UserType";

class UserTypeManager extends AdminManager<UserTypeProps[]> {
  constructor(
    userType: UserTypeProps[],
    setUserType: (obj: UserTypeProps[]) => void
  ) {
    super(userType, setUserType);

    this.decorator = (u: UserTypeProps[]) => {
      if (!u.length) {
        u = [defaultUserType];
      }

      u = u.sort((a, b) => a.index - b.index);

      return u;
    };
  }
}

export default UserTypeManager;
