import * as yup from "yup";

export const loginValidationSchema = yup.object({
  email: yup
    .string()
    .required("Email wajib diisi")
    .email("Format email tidak valid")
    .min(5, "Email minimal 5 karakter")
    .max(100, "Email maksimal 100 karakter"),
  password: yup
    .string()
    .required("Password wajib diisi")
    .min(8, "Password minimal 8 karakter")
    .max(20, "Password maksimal 20 karakter")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password harus memiliki 1 huruf kecil, 1 huruf besar, 1 angka, dan 1 karakter spesial"
    ),
});
