import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getServerSideProps = async ({ req }) => {
    const allUsers = await prisma.cercle.findUnique({
        where: {
            name: "bx"
        }
    })
    return { props: { allUsers } }
}

export default function CercleHome() {
    return (
        <div className="container">
        </div>
    )
}