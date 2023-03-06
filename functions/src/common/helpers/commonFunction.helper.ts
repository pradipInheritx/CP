import env from "../../env/env.json";
import moment from 'moment';

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
export type queryParams = { 
    pageNumber: number; 
    limit: number; 
    sortBy: string; 
    search: string
};
export async function hashPassword(password: any) {
    let hashPwd = await bcrypt.hash(password,10);

    return hashPwd;
}

export function paginate(array:any, page_size:number, page_number:number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}
export async function validPassword(password: string, hashedPassword: string) {
    let passwordCheck = await bcrypt.compare(password, hashedPassword);

    return passwordCheck;
}

//Generating auth token
export async function generateAuthToken(id: string, user_type: number) {
    let token = jwt.sign({
        id: id.toString(),
        user_type
    }, env.JWT_AUTH_SECRET, {
        expiresIn: '1d'
    })

    const token_expires_at = moment().add(1, 'days').format('X');
    let authTokenObj = { token, token_expires_at };

    return authTokenObj;
}

//Generating refresh token
export async function generateRefreshToken(id: string, user_type: number) {
    let refresh_tokens = jwt.sign({
        id: id.toString(),
        user_type
    }, env.JWT_REFRESH_SECRET)

    return refresh_tokens;
}

export async function verifyRefreshToken(refresh_token: string) {
    try {
        const decodedUser = await jwt.verify(refresh_token, env.JWT_REFRESH_SECRET);

        if(!decodedUser) {
        return false;
        }

        return decodedUser;
    } catch(err) {
        return false;
    }
}


