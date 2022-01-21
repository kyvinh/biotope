import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import {ActionType, InvitationType} from '@prisma/client'
import prisma from '../../../components/util/prismaClient'
import _crypto from "crypto";
import addDays from 'date-fns/addDays'
import {CODE_LENGTH} from "../b/[name]/createCode";
import {hashUid} from "../../../components/util/user";

export const emailConfig = {
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM,
    async generateVerificationToken() {
        return _crypto.randomBytes(32).toString("hex")
    },
    maxAge: 14 * 24 * 60 * 60 // 14 days  // TODO: 14 days for invite is OK but too long for sign-in?
};

// Override PrismaAdapter to handle reputation points/log
const prismaAdapter = PrismaAdapter(prisma);
prismaAdapter.createUser = async (data) => {
    data.reputationActions = {
        create: [{actionType: ActionType.REGISTER_EMAIL}]
    }
    data.reputationPoints = 5
    // console.log('create user :: handle invitations', data)
    return prisma.user.create({data})
}

// Cleanup biotope invitations and link the invite to the userId rather than email
// TODO: Might as well cleanup verification tokens (from all users)?
async function cleanupInvitations(user) {
    try {
        await prisma.$transaction([
            // Link to userId rather than email
            prisma.invitation.updateMany({
                where: {
                    type: InvitationType.EMAIL,
                    invitedEmail: user.email,
                },
                data: {
                    // Privacy by design: Remove the email
                    invitedEmail: null,
                    invitedId: user.id
                }
            }),
            // Delete expired unopened invitations
            // TODO: Deleting may be wrong. What if user exists and invited to a biotope? The invitation should stay until the user logs in to activate this invite?
            prisma.invitation.deleteMany({
                where: {
                    type: InvitationType.EMAIL,
                    invitedEmail: user.email,
                    createdOn: {
                        lte: addDays(new Date(), -90)
                    }
                }
            }),
        ]);
    } catch (error) {
        console.log('cleanupInvitations::error', error)
        console.log('cleanupInvitations::error::user', user)
        // Do not block on errors...
    }
}

export default NextAuth({

    adapter: prismaAdapter,

    providers: [
        EmailProvider(emailConfig),
        CredentialsProvider({
            // From: https://github.com/mbarton/docs/blob/mbarton/anon-sessions/docs/tutorials/anonymous-sessions.md
            id: "code-credentials",
            name: "Invitation Code",
            credentials: {
                code: {label: "Code", type: "text"}
            },
            async authorize(credentials) {
                // noinspection JSUnresolvedVariable
                const code = credentials.code
                if (code?.length !== CODE_LENGTH) {
                    throw new Error("Invalid invitation code")
                }
                // Check whether this code is linked to an Invite
                const invite = await prisma.invitation.findUnique({
                    where: {
                        type_code: {type: InvitationType.CODE, code: code}
                    }
                })
                if (invite) {
                    const anonEmail = hashUid(`${invite.cercleId}-${invite.code}-${new Date()}`)
                    // Create and persist anonymous user
                    const user = await prisma.user.create({
                        data: {
                            email: `${anonEmail}@anon.biotope.brussels`,
                            reputationPoints: 1,
                            reputationActions: {
                                create: {
                                    actionType: ActionType.REGISTER_CODE
                                }
                            },
                            invitationsReceived: {
                                create: {
                                    type: InvitationType.CODE,
                                    creatorId: invite.creatorId,
                                    cercleId: invite.cercleId,
                                }
                            }
                        }
                    })
                    console.log('create user :: joined with code', user)
                    return user
                } else {
                    throw new Error("Could not retrieve invitation code")
                }
            }
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,

    // Enable debug messages in the console if you are having problems
    debug: process.env.NEXTAUTH_DEBUG,

    session: {
        strategy: "jwt",

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        updateAge: 72 * 60 * 60, // every 3 days
    },

    // You can define custom pages to override the built-in ones. These will be regular Next.js pages
    // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
    // The routes shown here are the default URLs that will be used when a custom
    // pages is not specified for that route.
    // https://next-auth.js.org/configuration/pages
    pages: {
        // signIn: '/auth/signin',  // Displays signin buttons
        // signOut: '/auth/signout', // Displays form with sign out button
        // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // Used for check email page
        // newUser: null // If set, new users will be directed here on first sign in
    },

    // Callbacks are asynchronous functions you can use to control what happens
    // when an action is performed.
    // https://next-auth.js.org/configuration/callbacks
    callbacks: {
        // async redirect(url, baseUrl) { return baseUrl },

        async jwt({token, user}) {
            if (user) {
                token.user = user
            }
            return token;
        },

        async signIn({user, email /* true means we are not logging in but sending the invitation request */}) {
            // Cleanup on every signin -> enables invitations in other biotopes if exist
            // noinspection JSUnresolvedVariable
            if (user.id && user.email && !email?.verificationRequest) {
                // TODO This can be moved to the event callback, makes more sense!
                await cleanupInvitations(user);
            }
            return true
        },
        // Add user object to session
        async session({session, user, token}) {
            if (user) {
                session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            } else if (token && token.user) {
                session.user = {
                    id: token.user.id,
                    name: token.user.name,
                    email: token.user.email,
                };
            }
            return session;
        }
    },

    // Events are useful for logging
    // https://next-auth.js.org/configuration/events
    events: {
        createUser: async (message) => {
            // We cannot cleanup invitations in PrismaAdapter.createUser because userId does not exist yet
            // console.log("createUser event", message)
            await cleanupInvitations(message.user);
        },
    },

    // You can set the theme to 'light', 'dark' or use 'auto' to default to the
    // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
    theme: 'auto'
})
