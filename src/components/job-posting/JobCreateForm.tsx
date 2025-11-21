"use client";

import { useState } from "react";
import axiosClient from "@/lib/axiosClient";
import { JobPostingPayload } from "@/types/job.types";
import { Loader2 } from "lucide-react";

export default function JobCreateForm() {
  const [form, setForm] = useState<JobPostingPayload>({
    title: "",
    description: "",
    location: "",
    salary: null,
    banner_image_url: "",
    preSelectionEnabled: false,
    preSelectionTestId: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "salary" ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      preSelectionEnabled: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axiosClient.post("/jobPosting", form);
      setMessage("Job Created Successfully!");
      console.log("Response:", res.data);
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data?.message || "Error creating job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 max-w-xl mx-auto border rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold">Create Job Posting</h2>

      {/* title */}
      <div>
        <label className="block font-medium">Job Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* description */}
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* location */}
      <div>
        <label className="block font-medium">Location</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* salary */}
      <div>
        <label className="block font-medium">Salary (optional)</label>
        <input
          type="number"
          name="salary"
          value={form.salary ?? ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* banner image */}
      <div>
        <label className="block font-medium">Banner Image URL</label>
        <input
          type="text"
          name="banner_image_url"
          value={form.banner_image_url}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* pre selection */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.preSelectionEnabled}
          onChange={handleCheckbox}
        />
        <span className="font-medium">Activate Pre-Selection Test</span>
      </div>

      {form.preSelectionEnabled && (
        <div>
          <label className="block font-medium">Test ID</label>
          <input
            type="number"
            name="preSelectionTestId"
            value={form.preSelectionTestId ?? ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
      )}

      {/* message */}
      {message && (
        <div className="p-2 rounded bg-gray-100 text-sm">{message}</div>
      )}

      {/* submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded flex items-center justify-center"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Create Job"}
      </button>
    </form>
  );
}
