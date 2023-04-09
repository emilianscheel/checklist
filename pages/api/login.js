

import { PrismaClient } from '@prisma/client'

require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('../../library/jwt');

export default async function handler(req, res) {

    const prisma = new PrismaClient()

    const { username, password } = req.body;
    
    let user = await prisma.users.findFirst({
        where: { username: username }
    })

    if (!user || user == null) {
        let encryptedPassword = bcrypt.hashSync(password, 8);
        let user = await prisma.users.create({
          data: {
            username: username,
            password: encryptedPassword,
            json: JSON.stringify({
              "checked": []
            })
          }
        })
        delete user.password
        const accessToken = await jwt.signAccessToken(user);
        res.json({ ...user, accessToken })
    }
    else {
        const checkPassword = bcrypt.compareSync(password, user.password)
        if (!checkPassword) res.send("Password incorrect")
        delete user.password
        const accessToken = await jwt.signAccessToken(user)
        res.json({ ...user, accessToken })
    }

    await prisma.$disconnect()
}
