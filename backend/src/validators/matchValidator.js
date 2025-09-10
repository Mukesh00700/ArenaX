import { z } from "zod";
import mongoose from "mongoose";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const SinglesMatchSchema = z.object({
  teamRed: objectId,   // ref User
  teamBlue: objectId,  // ref User
  bestOf: z.union([z.literal(1), z.literal(3)])
});

export const DoublesMatchSchema = z.object({
  teamRed: objectId,   // ref: Team
  teamBlue: objectId,  // ref: Team
  bestOf: z.union([z.literal(1), z.literal(3)]),
});