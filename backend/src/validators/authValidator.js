import {email, z} from "zod";

const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must only contain letters, numbers, and underscores");

const emailSchema = z
  .string()
  .email("Invalid email address");

  const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*]/, "Password must contain at least one special character");

export const singupSchema = z.object({
    username:usernameSchema,
    password:passwordSchema,
    email:emailSchema
});

export const loginSchema = z.object({
    identifier:z.union([usernameSchema,emailSchema]),
    password:passwordSchema
})

export const googleAuthSchema = z.object({
  token: z.string().min(1, "Google OAuth token is required"),
});