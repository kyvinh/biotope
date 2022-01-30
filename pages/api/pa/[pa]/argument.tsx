import prisma from '../../../../lib/prismaClient'
import {HasUserIdAuthGuard} from "../../../../lib/serverAnnotations";
import {Body, createHandler, Post, Query} from "@storyofams/next-api-decorators";
import {hashUid} from "../../../../lib/user";

export const ARG_HASH_PREFIX = 'argument'

export class NewArgumentInput {
    argumentText: string
    argumentAnonymous: boolean
}

@HasUserIdAuthGuard()
class AddArgumentHandler {
    @Post()
    async create(@Body() argumentInput: NewArgumentInput, @Query('pa') possibleAnswerId: string, @Query('userId') userId: string) {

        // TODO Should also check whether the user is a constituent, eligible for voting? Or whether he/she has already voted?
        const encryptedUid = hashUid(`${ARG_HASH_PREFIX}-${userId}`)
        const argument = await prisma.argument.create({
            data: {
                possibleAnswerId: possibleAnswerId,
                anonymous: argumentInput.argumentAnonymous,
                text: argumentInput.argumentText,
                creatorId: argumentInput.argumentAnonymous ? null : userId,
                // Log the userId somewhere safe
                logs: argumentInput.argumentAnonymous ? {
                    create: {
                        hashUid: encryptedUid
                    }
                } : undefined
            }
        })

        return {status: 'ok', argument}
    }
}

export default createHandler(AddArgumentHandler);