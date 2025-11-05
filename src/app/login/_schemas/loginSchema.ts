import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Minimal 6 karakter")
    .required("Password wajib diisi"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
