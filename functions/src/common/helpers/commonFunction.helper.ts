const bcrypt = require('bcryptjs')

export async function hashPassword(password: any) {
    let hashPwd = await bcrypt.hash(password,10);

    return hashPwd;
}


