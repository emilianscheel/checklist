
import { PrismaClient } from '@prisma/client'
import jwt from '../../library/jwt'
const prisma = new PrismaClient()

export default async function handler(req, res) {


    let user = await jwt.verifyAccessToken(req.headers['authorization'].split(' ')[1])

    await prisma.users.update({
        where: {
            id: user.payload.id
        },
        data: {
            json: JSON.stringify(req.body.json)
        }
    })

    res.send(200)
}