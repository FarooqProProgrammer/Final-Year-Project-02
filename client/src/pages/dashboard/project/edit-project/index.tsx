import React from 'react';
import { useParams } from 'react-router-dom';

const EditProject = () => {
  // Access the `projectId` from the URL params
  const { id } = useParams<{ id: string }>(); // Type the `useParams` hook for TypeScript

  return (
    <div>
      <h1>Edit Project</h1>
      <p>Project ID: {id}</p> {/* Display the project ID */}
    </div>
  );
};

export default EditProject;
