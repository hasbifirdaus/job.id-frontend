import React, { useState } from "react";
import axiosClient from "@/lib/axiosClient";

interface UpdateEmailResponse {
  message: string;
  data: {
    email: string;
    verified: boolean;
  };
}

interface ResendVerificationResponse {
  message: string;
}

export default function EmailUpdateForm({ userData, setUserData }: any) {
  const [newEmail, setNewEmail] = useState(userData.email);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const isVerified = userData.verified;

  // Endpoint 4: Request Update Email (PUT /api/profile/email)
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setLoading(true);

    if (newEmail === userData.email) {
      setEmailError("Email baru harus berbeda dari email lama.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosClient.put<UpdateEmailResponse>(
        "/profile/email",
        {
          email: newEmail,
        }
      );

      setUserData((prev: any) => ({
        ...prev,
        email: newEmail,
        verified: false,
      }));
      alert(response.data.message);
    } catch (error: any) {
      setEmailError(
        error.response?.data?.message || "Gagal memperbarui email."
      );
    } finally {
      setLoading(false);
    }
  };

  // Endpoint 5: Resend Email Verification (POST /api/profile/resend-verification)
  const handleResendVerification = async () => {
    if (loading) return;
    setLoading(true);
    setEmailError("");

    try {
      const response = await axiosClient.post<ResendVerificationResponse>(
        "/profile/resend-verification"
      );
      alert(response.data.message);
    } catch (error: any) {
      setEmailError(
        error.response?.data?.message || "Gagal mengirim ulang verifikasi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Pengaturan Email
      </h2>
      {emailError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{emailError}</span>
        </div>
      )}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700">Status Verifikasi:</p>
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
            isVerified
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {isVerified ? "✅ Terverifikasi" : "⚠️ Belum Terverifikasi"}
        </div>
      </div>

      <form onSubmit={handleEmailUpdate} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Alamat Email
          </label>
          <input
            type="email"
            id="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={newEmail === userData.email || loading}
          className="w-full justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading && newEmail !== userData.email
            ? "Memproses..."
            : "Perbarui Email (Wajib Verifikasi Ulang)"}
        </button>
      </form>

      {!isVerified && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Jika Anda belum menerima email verifikasi, Anda dapat mengirimkannya
            kembali.
          </p>
          <button
            onClick={handleResendVerification}
            className="w-full justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Mengirim Ulang..." : "Kirim Ulang Email Verifikasi"}
          </button>
        </div>
      )}
    </div>
  );
}
