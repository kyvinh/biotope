import {HasUserIdAuthGuard, internalServerErrorLogger} from "../../../lib/serverAnnotations";
import {Body, Catch, createHandler, Post, Query} from "@storyofams/next-api-decorators";
import {EmailSubDto} from "../../../lib/constants";
import prisma from "../../../lib/prismaClient";
import messages from "../../../lib/messages.fr";
import {ActionType} from "@prisma/client";

@Catch(internalServerErrorLogger)
@HasUserIdAuthGuard()
class SaveEmail {

    @Post()
    async saveEmail(@Body() emailInput: EmailSubDto, @Query('userId') userId: string) {

        try {
            const user = await prisma.user.update({
                where: { id: userId},
                data: {
                    email: emailInput.email,
                    reputationActions: {
                        create: [{actionType: ActionType.REGISTER_EMAIL}]
                    }
                }
            })

            return {status: 'ok', email: user.email}
        } catch (e) {
            if (e.meta.target === 'User_email_key' || e.code === 'P2002') {
                return {status: 'ok', error: messages.invitation["email-duplicate-error"]}
            } else {
                return {status: 'ok', error: `Error ${e.code}: ${e.toString()}`}
            }
        }
    }
}

export default createHandler(SaveEmail);