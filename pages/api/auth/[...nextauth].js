import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import {ActionType, InvitationType} from '@prisma/client'
import _crypto from "crypto";
import prisma from '../../../components/util/prismaClient'
import addDays from 'date-fns/addDays'

export const emailConfig = {
  server: process.env.EMAIL_SERVER,
  from: process.env.EMAIL_FROM,
  async generateVerificationToken() {
    return _crypto.randomBytes(32).toString("hex")
  }
};

export default NextAuth({

  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider(emailConfig),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  // Enable debug messages in the console if you are having problems
  debug: process.env.NEXTAUTH_DEBUG,

  session: {
    jwt: false,

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
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

    async signIn({ user, email}) {

      // We may have an invite pending for circle(s) -> Link the cercle invitation to the original user and the target email
      // Note we cannot know from which circle invite this verification request is executed! So link all invitations pertaining to email user
      // TODO This executes on first real sign-in! i.e. Not after clicking the Register link the first time.
      // Where to put this instead? CustomProvider?

      if (user.id && user.email && !email.verificationRequest) {
        const transaction = []

        transaction.push(
            prisma.invitation.deleteMany({
              where: {
                type: InvitationType.EMAIL,
                invitedEmail: user.email,
                createdOn: {
                  lte: addDays(new Date(), -2)
                }
              }
            }),
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
            })
            ,
            prisma.reputationAction.create({
              data: {
                userId: user.id,
                actionType: ActionType.REGISTER_EMAIL,
              }
            }),
            prisma.user.update({
              where: {
                id: user.id
              },
              data: {
                reputationPoints: { increment: 5}
              }
            })
        )

        try {
          await prisma.$transaction(transaction);
        } catch (error) {
          console.log('login error', error)
          console.log('login error for user', user)
          return false
        }
      }

      return true
    },
    // async redirect(url, baseUrl) { return baseUrl },
    async session({ session, user }) {
      let { id, name, email} = user
      session.user = {
        id,
        name,
        email
      }
      return session
    }
    // async jwt(token, user, account, profile, isNewUser) { return token }
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // You can set the theme to 'light', 'dark' or use 'auto' to default to the
  // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
  theme: 'auto'
})
