import _crypto from "crypto";

export function hashUid(userId: string): string {
    return _crypto.createHash("sha256")
        .update(`${userId}${process.env.NEXTAUTH_SECRET}`)
        .digest("hex")
}

