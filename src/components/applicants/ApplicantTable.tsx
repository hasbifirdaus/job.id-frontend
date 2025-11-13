"use client";

import { Applicant } from "@/types/applicant";

interface Props {
  applicants: Applicant[];
  onRowClick: (id: number) => void;
  sortKey: string;
  sortOrder: "asc" | "desc";
  onSortChange: (key: string) => void;
}

export default function ApplicantTable({
  applicants,
  onRowClick,
  sortKey,
  sortOrder,
  onSortChange,
}: Props) {
  const headers = [
    { key: "name", label: "Nama" },
    { key: "email", label: "Email" },
    { key: "education", label: "Pendidikan" },
    { key: "expected_salary", label: "Ekspektasi Gaji" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Tanggal Lamar" },
  ];

  const handleHeaderClick = (key: string) => {
    onSortChange(key);
  };

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-2 py-1">Foto</th>
          {headers.map((h) => (
            <th
              key={h.key}
              className="border px-2 py-1 cursor-pointer select-none"
              onClick={() => handleHeaderClick(h.key)}
            >
              {h.label}{" "}
              {sortKey === h.key ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {applicants.map((app) => (
          <tr
            key={app.id}
            className="hover:bg-gray-100 cursor-pointer"
            onClick={() => onRowClick(app.id)}
          >
            <td className="border px-2 py-1">
              <img
                src={app.user.profile_image_url || "/default-avatar.png"}
                alt={app.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            </td>
            <td className="border px-2 py-1">{app.user.name}</td>
            <td className="border px-2 py-1">{app.user.email}</td>
            <td className="border px-2 py-1">{app.user.education}</td>
            <td className="border px-2 py-1">
              {app.expected_salary?.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </td>
            <td className="border px-2 py-1">{app.status}</td>
            <td className="border px-2 py-1">
              {new Date(app.created_at).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
