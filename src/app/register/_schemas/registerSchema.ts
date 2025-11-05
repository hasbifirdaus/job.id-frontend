import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().required("Nama wajib diisi"),
  email: yup.string().email("Email tidak valid").required("Email Wajib diisi"),
  password: yup
    .string()
    .min(6, "minimal 6 karakter")
    .required("Password wajib diisi"),
  role: yup
    .string()
    .oneOf(["JOB_SEEKER", "COMPANY_ADMIN"])
    .required("Role wajib dipilih"),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
