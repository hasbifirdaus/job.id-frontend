"use client";

import { useParams } from "next/navigation";
<<<<<<< HEAD
import TestForm from "@/components/pre-selection/TestForm";
=======
>>>>>>> 0166d84 (feat(frontend): update admin dashboard, job pages, interviews & pre-selection modules)
import PreselectionTestEdit from "@/components/pre-selection-test/PreselectionTestEdit";

const CreatePreSelectionTestPage = () => {
  const params = useParams();
  const jobId = Number(params?.jobId);

  if (!jobId) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* <TestForm jobId={jobId} /> */}
      <PreselectionTestEdit />
    </div>
  );
};

export default CreatePreSelectionTestPage;
