import env from "../../env/env.json";
import moment from 'moment';

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

export async function hashPassword(password: any) {
    console.log("HASHPASSWORD >>>>", password)
    let hashPwd = await bcrypt.hash(password, 10);

    return hashPwd;
}

export async function validPassword(password: string, hashedPassword: string) {
    let passwordCheck = await bcrypt.compare(password, hashedPassword);

    return passwordCheck;
}

//Generating auth token
export async function generateAuthToken(userAdmin: any) {
    let token = jwt.sign({
        userAdmin
    }, env.JWT_AUTH_SECRET, {
        expiresIn: '1d'
    })

    const tokenExpiresAt = moment().add(1, 'days').format('X');
    let authTokenObj = { token, tokenExpiresAt };

    return authTokenObj;
}

//Generating refresh token
export async function generateRefreshToken(userAdmin: any) {
    let refresh_tokens = jwt.sign({
        userAdmin
    }, env.JWT_REFRESH_SECRET)

    return refresh_tokens;
}

export async function verifyRefreshToken(refresh_token: string) {
    try {
        const decodedUser = await jwt.verify(refresh_token, env.JWT_REFRESH_SECRET);

        if (!decodedUser) {
            return false;
        }
        return decodedUser;
    } catch (err) {
        return false;
    }
}


