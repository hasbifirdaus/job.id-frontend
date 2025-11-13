import * as yup from "yup";

export const setupAccountCompanyValidationSchema = yup.object({
  companyName: yup
    .string()
    .required("Nama perusahaan wajib diisi")
    .min(3, "Nama perusahaan minimal 3 karakter")
    .max(100, "Nama perusahaan maksimal 100 karakter"),

  firstName: yup
    .string()
    .required("Nama depan wajib diisi")
    .min(2, "Nama depan minimal 2 huruf")
    .max(50, "Nama depan maksimal 50 huruf")
    .matches(/^[A-Za-zÀ-ÿ\s]+$/, "Nama depan hanya boleh berisi huruf"),

  lastName: yup
    .string()
    .required("Nama belakang wajib diisi")
    .min(2, "Nama belakang minimal 2 huruf")
    .max(50, "Nama belakang maksimal 50 huruf")
    .matches(/^[A-Za-zÀ-ÿ\s]+$/, "Nama belakang hanya boleh berisi huruf"),

  companyPhone: yup
    .string()
    .required("Nomor telepon wajib diisi")
    .matches(
      /^[0-9+\-\s()]*$/,
      "Nomor telepon hanya boleh berisi angka dan simbol (+ - () )"
    )
    .min(8, "Nomor telepon minimal 8 digit")
    .max(20, "Nomor telepon maksimal 20 digit"),

  companyLocation: yup
    .string()
    .required("Lokasi perusahaan wajib diisi")
    .min(3, "Lokasi minimal 3 karakter")
    .max(100, "Lokasi maksimal 100 karakter"),

  companyDescription: yup
    .string()
    .nullable()
    .notRequired()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(500, "Deskripsi maksimal 500 karakter"),
});
