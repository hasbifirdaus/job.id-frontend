"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: ReactNode;
}

const ProtectedJobSeekerLayout = ({ children }: Props) => {
  const { loading } = useAuth(["JOB_SEEKER"]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedJobSeekerLayout;
