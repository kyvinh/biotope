import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import _crypto from "crypto";

const prisma = new PrismaClient()
const adapter = PrismaAdapter(prisma)

// Assumes we have the email provider and that it is connected to a PrismaAdapter!

export default async (req, res) => {

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }
debugger;
    const biotopeName = req.query.name;
    const email = req.body?.email

    if (!email) {
        res.status(400).send({ message: 'Invalid POST request' })
    }

    // From node_modules/next-auth/server/lib/email/signin.js
    // TODO Code below uses default configuration. Should use [...nextauth].js file

    const ONE_DAY_IN_SECONDS = 86400;
    const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);

    const token = _crypto.randomBytes(32).toString("hex")

    let result;

    try {
        result = await adapter.createVerificationToken({
            identifier: email,
            expires: expires,
            token: token
        })
        /*
                const params = new URLSearchParams({
                    process.env.NEXTAUTH_URL + '/b',
                    token,
                    email: identifier
                });
                const url = `${baseUrl}${basePath}/callback/${provider.id}?${params}`;

                try {
                    await provider.sendVerificationRequest({
                        identifier,
                        token,
                        expires,
                        url,
                        provider
                    });
                } catch (error) {
                    logger.error("SEND_VERIFICATION_EMAIL_ERROR", {
                        identifier,
                        url,
                        error
                    });
                    throw new Error("SEND_VERIFICATION_EMAIL_ERROR");
                }*/
    } catch (error) {
        debugger;
        if (error.code === "P2002" && error.meta.target === "VerificationToken_token_key") {
            console.log("Could not create a verification token the email already exists... maybe just ignore this?", error)
        } else {
            console.log("Could not create a verification token.", error)
        }
        result = { error: "Could not create VerificationToken"}
    }

    res.status(200).json(result)
}

// Email HTML body
const html = ({ url, site, email }) => {
    // Insert invisible space into domains and email address to prevent both the
    // email address and the domain from being turned into a hyperlink by email
    // clients like Outlook and Apple mail, as this is confusing because it seems
    // like they are supposed to click on their email address to sign in.
    const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
    const escapedSite = `${site.replace(/\./g, "&#8203;.")}`

    // Some simple styling options
    const backgroundColor = "#f9f9f9"
    const textColor = "#444444"
    const mainBackgroundColor = "#ffffff"
    const buttonBackgroundColor = "#346df1"
    const buttonBorderColor = "#346df1"
    const buttonTextColor = "#ffffff"

    return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${escapedSite}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Sign in as <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
const text = ({ url, site }) => `Sign in to ${site}\n${url}\n\n`