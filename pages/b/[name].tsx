import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getServerSideProps = async (req) => {
    // console.dir(req)
    const b = await prisma.cercle.findUnique({
        where: {
            name: req.query.name
        },
        include: {
            creator: true
        }
    })
    return { props: { biotope: b } }
}

export default function BiotopeHome({ biotope: b }) {
    // console.dir(b)

    return b ? (
        <div className="container">
                    <div><h4>{b.name}</h4><span>{b.creator.name}</span> on {b.createdOn.toUTCString()}</div>
                    <div>{b.invitations ? b.invitations.length : "0"} invitation(s)</div>
                    { b.contact ?
                        <div>Contact possible: {b.contact}</div>
                        : <div/>}
        </div>
    ) : null
}