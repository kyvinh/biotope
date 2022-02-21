import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials";
import {CodeCredentialsProviderConfig} from "../../../lib/codeCredentialsProvider";
import {linkEmailInvitations, prismaAdapter} from "../../../lib/prismaAdapter";
import {ANON_EMAIL_DOMAIN, baseEmailConfig} from "../../../lib/constants";
import prisma from "../../../lib/prismaClient";
import messages from "../../../lib/messages.fr";

const createOptions = (req) => ({

    adapter: prismaAdapter,
    providers: [
        EmailProvider({
            ...baseEmailConfig,
        }),
        CredentialsProvider(CodeCredentialsProviderConfig),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NEXTAUTH_DEBUG,
    session: {
        strategy: "jwt",    // jwt required for credentials custom provider
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds - How long until an idle session expires and is no longer valid.
        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        updateAge: 72 * 60 * 60, // every 3 days
    },

    // https://next-auth.js.org/configuration/pages
    pages: {
    },

    // https://next-auth.js.org/configuration/callbacks
    callbacks: {
        // Add user object to JWT token (created once, upon login)
        async jwt({token, user}) {
            if(req.url === "/api/auth/session?update" && token?.user?.id){
                // https://github.com/nextauthjs/next-auth/issues/371#issuecomment-1006261430
                user = await prisma.user.findUnique({ where: { id: token.user.id}})
            }
            if (user) {
                token.user = user
            }
            return token;
        },
        // Add user object to session
        async session({session, user, token}) {
            if (user) {
                session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            } else if (token && token.user) {
                session.user = {
                    id: token.user.id,
                    name: token.user.name,
                    email: token.user.email,
                }
            }
            // Cleanup for anonymous users
            if (session.user?.email?.endsWith(ANON_EMAIL_DOMAIN)) {
                session.user.email = null
                session.user.name = messages.user["anonymous-name"]
                session.user.isAnon = true
            } else {
                session.user.isAnon = false
            }
            return session;
        }
    },

    // https://next-auth.js.org/configuration/events
    events: {
        // Cleanup invitations upon login
        createUser: async (message) => {
            try {
                // We cannot cleanup invitations in PrismaAdapter.createUser because userId does not exist yet
                await linkEmailInvitations(message.user);
            } catch (e) {
                console.log(e)  // Should not block the event processing
            }
        },
        // Cleanup on every signin -> enables invitations in other biotopes if exist
        signIn: async (message) => {
            try {
                const user = message.user;
                if (user.id && user.email) {
                    await linkEmailInvitations(user);
                }
            } catch (e) {
                console.log(e)  // Should not block the event processing
            }
        },
    }
})


export default async (req, res) => {
    return NextAuth(req, res, createOptions(req));
};