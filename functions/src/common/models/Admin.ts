export type adminProps = {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    webAppAccess: string[];
    status?: number;
    user_type: number;
    createdAt?:number;
    updatedAt?:number;
};