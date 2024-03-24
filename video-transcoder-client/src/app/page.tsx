"use client";

import React, { useState } from "react";

interface UploadState {
  selectedFile: File | null;
  error: string | null;
}

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<UploadState>({
    selectedFile: null,
    error: null,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const uploadFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;
    // Check if file is a video
    if (!file.type.startsWith("video/")) {
      setFiles({ ...files, error: "Only video files are allowed!" });
      return;
    }

    setFiles({ ...files, error: null, selectedFile: file });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { selectedFile } = files;

    if (!selectedFile) return;

    try {
      setLoading(true);
      const { name, type } = selectedFile;
      const res = await fetch(
        `/api/upload?fileName=${name}&contentType=${type}`
      );
      const { url } = await res.json();

      console.log(url);

      const upload = await fetch(url, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": type!,
        },
      });

      if (upload.ok) {
        console.log("Uploaded successfully!");
      } else {
        console.error("Upload failed.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error occurred during upload:", error);
      setLoading(false);
    }

    setFiles({ ...files, selectedFile: null });
  };

  return (
    <div className="container h-screen overflow-y-hidden mx-auto px-4 py-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>
      {files.error && <p className="text-red-500">{files.error}</p>}
      <form onSubmit={handleSubmit} method="POST">
        <label
          htmlFor="file-upload"
          className="block cursor-pointer mb-4 text-gray-700 font-bold"
        >
          Select Video:
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={uploadFiles}
          />
        </label>
        {files.selectedFile && (
          <p className="text-gray-500">{files.selectedFile.name}</p>
        )}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
