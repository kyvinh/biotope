import nodemailer from "nodemailer"

type invitationEmailData = {
    biotopeName: string,
    inviterEmail: string,
    inviterName: string,
    invitedEmail: string,
    callbackUrl: string,
    site?: string,
}

// From https://next-auth.js.org/providers/email#configuration
// Maybe we could create a custom provider out of all this?
export const sendInvitationEmail = async ({
                                              provider: {server, from},
                                              emailRefData,
                                          }: {
                                                provider: {server: string, from: string},
                                                emailRefData: invitationEmailData
                                        }) => {
    emailRefData.site = process.env.NEXTAUTH_URL
    const transport = nodemailer.createTransport(server)
    await transport.sendMail({
        to: emailRefData.invitedEmail,
        from,
        subject: `Invitation to ${emailRefData.site}`,
        text: emailAsText(emailRefData),
        html: html(emailRefData),
    })
}

// Email HTML body
const html = (data: invitationEmailData) => {
    // Insert invisible space into domains and email address to prevent both the
    // email address and the domain from being turned into a hyperlink by email
    // clients like Outlook and Apple mail, as this is confusing because it seems
    // like they are supposed to click on their email address to sign in.
    const escapedInvitedEmail = `${data.invitedEmail.replace(/\./g, "&#8203;.")}`
    const escapedInviterEmail = `${data.inviterEmail.replace(/\./g, "&#8203;.")}`
    const escapedSite = `${data.site.replace(/\./g, "&#8203;.")}`

    // Some simple styling options
    const backgroundColor = "#f9f9f9"
    const textColor = "#444444"
    const mainBackgroundColor = "#ffffff"
    const buttonBackgroundColor = "#346df1"
    const buttonBorderColor = "#346df1"
    const buttonTextColor = "#ffffff"

    // noinspection CssInvalidPropertyValue,HtmlDeprecatedAttribute,CssRedundantUnit,CssOverwrittenProperties
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
        <strong>${escapedInvitedEmail}</strong>, you have been invited by <strong>${data.inviterName} (${escapedInviterEmail})</strong> to <strong>${data.biotopeName}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${data.callbackUrl}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Join</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${data.biotopeName}</strong> contains debates and questions surrounding life in its community.
      </td>
    </tr>
  </table>
</body>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
const emailAsText = (data: invitationEmailData) => `Join ${data.biotopeName} (${data.site})\n${data.callbackUrl}\n\n`