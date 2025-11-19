const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ALLOWED_EXTENSIONS = ["image/jpeg", "image/jpg", "image/png"];

const validateImage = (file: File): { isValid: boolean; message: string } => {
  if (!ALLOWED_EXTENSIONS.includes(file.type)) {
    return {
      isValid: false,
      message:
        "Ekstensi file tidak valid. Hanya .jpg, .jpeg, .png yang diperbolehkan.",
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      message: "Ukuran file terlalu besar. Maksimum 1MB.",
    };
  }
  return { isValid: true, message: "" };
};
