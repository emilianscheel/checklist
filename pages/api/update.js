
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {

    await prisma.checklist.update({
        where: {
            words: req.body.words
        },
        data: {
            json: JSON.stringify(req.body.data)
        }
    })

    res.send(200)
}