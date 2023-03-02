const bcrypt = require('bcryptjs')

export async function hashPassword(password: any) {
    let hashPwd = await bcrypt.hash(password,10);

    return hashPwd;
}

export function paginate(array:any, page_size:any, page_number:any) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

