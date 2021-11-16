import {PrismaClient} from '@prisma/client'
import {getSession} from "next-auth/react";
import {hashUid} from "../../../components/util/user";

const prisma = new PrismaClient()

export default async function handler(req, res) {

    const session = await getSession({req})
    const biotopeName = req.query.biotopeName;

    if (!session) {
        return res.status(401).json(new Error("Who are you?"))
    }
    if (!biotopeName) {
        return res.status(500).json(new Error("Invalid request"))
    }

    // @ts-ignore
    const uid = hashUid(session.user.id);

    try {
        // select from answers left join question left join questionnaire where answers.hashId = uid group by questionnaire.id
        const answers = await prisma.answer.groupBy({
            by: ['hashUid'],
            where: {
                hashUid: uid
            },
            _count: { }
        })
        console.log(answers);
    }
    catch (error) {
        return res.status(500).json({});
    }
}