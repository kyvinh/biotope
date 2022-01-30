import {HasUserIdAuthGuard} from "../../../../lib/serverAnnotations";
import {Body, createHandler, Post, Query} from "@storyofams/next-api-decorators";
import prisma from "../../../../lib/prismaClient";
import {InvitationType} from "@prisma/client";
import {add} from 'date-fns'

export const CODE_LENGTH = 6;

export interface CreateCodeDto {
    code: string,
    expiration: number  // expiration in days
}

@HasUserIdAuthGuard()
class CreateInvitationCode {
    @Post()
    async createCode(@Body() createCodeInput: CreateCodeDto, @Query('name') biotopeName: string, @Query('userId') userId: string) {

        const b = await prisma.cercle.findUnique({
            where: {
                name: biotopeName
            },
            rejectOnNotFound: true,
        })

        if (createCodeInput.code.length != CODE_LENGTH || createCodeInput.expiration < 0 || createCodeInput.expiration > 365) {
            throw Error('CreateCode API error: input data')
        }

        const invitation = await prisma.invitation.create({
            data: {
                type: InvitationType.CODE,
                cercleId: b.id,
                creatorId: userId,
                code: createCodeInput.code,
                expiration: add(new Date(), {days: createCodeInput.expiration})
            }
        })

        // TODO: Handle when invitation code has already been used!

        return {status: 'ok', invitation}
    }
}

export default createHandler(CreateInvitationCode);