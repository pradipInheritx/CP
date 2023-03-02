import {firestore} from "firebase-admin";
import { paginate } from ".././helpers/commonFunction.helper"
const _ = require("lodash");

export type subAdminListingProps = { 
    pageNumber: number; 
    limit: number; 
    sortBy: string; 
    search:string
};

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

// GET List of all Sub-Admins
export async function getAllSubAdmins({ pageNumber, limit, sortBy, search }: subAdminListingProps) {
    let query = firestore().collection("admin").where("user_type", "==", 2);
    let subAdmins = await query.get();
    let array: any = [];
    subAdmins.forEach(( item:any ) => {
        array.push(item.data());
    });

    // Sort by any field of admin collection
    if (sortBy) {
        let parts = sortBy.split(':');
        let sortByField = parts[0];
        let sortOrder = parts[1];
        array = _.orderBy(array, sortByField, sortOrder);
    }

    // Pagination implemented
    if (pageNumber && limit) {
        array = paginate(array, limit, pageNumber);
    }

    // Search on firstName or email
    if (search) {
        array = array.find(( item:any ) =>{ return item.firstName == search || item.lastName == search || item.email == search});
    }
    return array;
}
