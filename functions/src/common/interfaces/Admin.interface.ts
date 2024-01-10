export type adminUserProps = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: number;
    isAdmin?: boolean;
    adminUserId?: string;
    password?: string;
    webAppAccess: string[];
    status?: string;
    authTokens?: string[];
    refreshToken: string;
    createdAt?: number;
    updatedAt?: number;
  };

  export type subAdminProps = {
    firstName?: string;
    lastName?: string;
    email?: string;
    webAppAccess: string[];
    action?: string;
  };