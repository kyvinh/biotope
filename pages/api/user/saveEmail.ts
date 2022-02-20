import {HasUserIdAuthGuard} from "../../../lib/serverAnnotations";
import {Body, createHandler, Post, Query} from "@storyofams/next-api-decorators";
import {EmailSubDto} from "../../../lib/constants";
import prisma from "../../../lib/prismaClient";

@HasUserIdAuthGuard()
class SaveEmail {

    @Post()
    async saveEmail(@Body() emailInput: EmailSubDto, @Query('userId') userId: string) {

        const user = await prisma.user.update({
            where: { id: userId},
            data: {
                email: emailInput.email
            }
        })

        return {status: 'ok', email: user.email}
    }
}

export default createHandler(SaveEmail);