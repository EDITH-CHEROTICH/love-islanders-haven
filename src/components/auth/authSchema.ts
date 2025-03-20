
import * as z from "zod";

// Auth schema for login/signup validation
export const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // Only validate confirmPassword when in signup mode
  if (data.confirmPassword !== undefined) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Verification schema
export const verificationSchema = z.object({
  code: z.string().length(4, { message: "Verification code must be 4 digits" })
});
