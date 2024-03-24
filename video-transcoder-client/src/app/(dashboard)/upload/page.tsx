"use client";

import { Button } from "@/components/ui/button";
import {
  userExist,
  userNotExist,
} from "@/redux/reducer/userReducer";
import axios from "axios";
import { CameraIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Adjusted type to File
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(
        `https://ecezbkpsc5.execute-api.ap-south-1.amazonaws.com/api/v1/user/current-user`,
        {
          withCredentials: true,
        }
      )
      .then((res) => dispatch(userExist(res.data.data)))
      .catch((err) => dispatch(userNotExist()));
  }, [dispatch]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer?.files[0];

    if (!droppedFile) {
      return;
    }

    const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
    if (!allowedTypes.includes(droppedFile.type)) {
      alert("Unsupported video format. Please upload MP4, WEBM, or OGG.");
      return;
    }

    setSelectedFile(droppedFile);
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = event.target.files && event.target.files[0];
    if (!selected) return;

    setSelectedFile(selected);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a video file to upload.");
      return;
    }

    setLoading(true);

    try {
      const { name, type } = selectedFile;

      const res = await fetch(
        `/api/upload?fileName=${name}&contentType=${type}`
      );

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }

      const { url } = await res.json(); // Get pre-signed URL from server
      console.log(url);

      const upload = await fetch(url, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": type, // Set correct content type
        },
      });

      if (upload.ok) {
        console.log("Uploaded successfully!");
        setSelectedFile(null); // Clear selectedFile state
        router.push("/assets");
      } else {
        throw new Error(
          `Upload to pre-signed URL failed with status: ${upload.status}`
        );
      }
    } catch (error) {
      console.error("Error occurred during upload:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold my-10 text-center">Upload Video</h1>
      <form onSubmit={handleSubmit} method="POST">
        <div className="px-4">
          <div
            className="border-2 border-dashed border-gray-200 rounded-lg p-12 flex items-center justify-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="text-center">
                <p>Selected video: {selectedFile.name}</p>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <CameraIcon className="w-12 h-12 mx-auto text-gray-300" />
                <div className="prose max-w-none">
                  <h2 className="text-lg font-medium">
                    Drag and drop your video files
                  </h2>
                  <p className="text-sm text-gray-500">or click to upload</p>
                </div>
                <input
                  type="file"
                  id="file_input"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                <Button
                  size="sm"
                  type="button"
                  onClick={() => document.getElementById("file_input")?.click()}
                >
                  Select files
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-10 text-center">
          <Button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {loading ? "Uploading..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
