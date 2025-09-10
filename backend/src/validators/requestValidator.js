import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const requestSchema = z.object({
    from:objectId,
    to:objectId,
    type:z.enum(["Friend","Team_Invite"])
})