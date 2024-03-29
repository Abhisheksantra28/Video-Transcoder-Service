"use client";
import React, { useEffect, useState } from "react";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import JSZip from "jszip";


const Page = () => {
  const searchParams = useSearchParams();
  const fileName: string | null = searchParams.get("fileName");

  const [videoData, setVideoData] = useState<any>();
  const [videoStatus, setVideoStatus] = useState<any>();
  const [pollingCompleted, setPollingCompleted] = useState<boolean>(false);
  const [downloading, setDownloading] = useState(false); 

  useEffect(() => {
    const fetchVideo = () => {
      axios
        .get(
          `https://ecezbkpsc5.execute-api.ap-south-1.amazonaws.com/api/v1/video/v/${fileName}`
        )
        .then((response) => {
          console.log(response.data.data);
          setVideoData(response.data.data);
        })
        .catch((error) => {
          console.log("Error occurred while fetching the video file", error);
        });
    };
    fetchVideo();
  }, [fileName]);

  useEffect(() => {
    if (videoData) {
      const fetchVideoStatus = () => {
        axios
          .get(
            `https://ecezbkpsc5.execute-api.ap-south-1.amazonaws.com/api/v1/video/s/${videoData._id}`
          )
          .then((response) => {
            console.log(response.data.data);
            setVideoStatus(response.data.data);

            // If the status is successful, stop polling
            if (response.data.status === "success") {
              setPollingCompleted(true);
            }
          })
          .catch((error) => {
            console.log(
              "Error occurred while fetching the video status",
              error
            );
          });
      };

      const pollingInterval = setInterval(() => {
        if (fileName && !pollingCompleted) {
          fetchVideoStatus();
        }
      }, 5000); // Adjust the polling interval as needed (e.g., every 5 seconds)

      // Clear the interval when component unmounts to avoid memory leaks
      return () => clearInterval(pollingInterval);
    }
  }, [fileName, pollingCompleted, videoData]);


  const handleDownload = async () => {
    if (videoStatus.progress !== "completed" || downloading) return;
  
    setDownloading(true); // Set downloading state to true
  
    try {

      const zip = new JSZip();
  
      for (const resolution in videoData.videoResolutions) {
        const videoUrl = videoData.videoResolutions[resolution];

        const res = await fetch(
          `/api/videos?fileName=${fileName}&videoUrl=${videoUrl}`
        );
  
        if (!res.ok) {
          throw new Error(`video fetching failed with status: ${res.status}`);
        }
  
        const { url } = await res.json(); 

        console.log(url)
    
  
        try {
          const response = await axios.get(url, {
            responseType: "blob",
          });
          const blob = new Blob([response.data]);
          zip.file(`${videoData.fileName}-${resolution}.mp4`, blob);
        } catch (error) {
          console.error(`Error downloading video for resolution: ${resolution}`, error);
          // Handle specific errors here (e.g., display user-friendly message)
        }
      }
  
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = `${videoData.fileName}-resolutions.zip`;
      link.click();
    } catch (error) {
      console.error("Error downloading video resolutions:", error);
      // Handle general download errors (e.g., display user-friendly message)
    } finally {
      setDownloading(false); // Reset downloading state
    }
  };


  return (
    <main className="flex-grow p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-medium">Assets</h1>
        <Button
          className="px-2 py-1 bg-gray-800 text-white rounded-lg flex items-center space-x-2 text-sm"
          type="button"
          disabled={downloading}
          onClick={handleDownload}
        >
          <DownloadIcon className="w-4 h-4" />
          <span>Download</span>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>CreatedAt</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        {videoData && (
          <TableBody>
            <TableRow>
              <TableCell>{videoData.fileName}</TableCell>
              <TableCell>{videoData.type}</TableCell>
              <TableCell>
                {videoStatus ? (
                  <span className="px-2 py-1 bg-red-200 text-red-800 rounded-md">
                    {videoStatus.progress}
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-200 text-red-800 rounded-md">
                    pending
                  </span>
                )}
              </TableCell>
              <TableCell>{videoData.createdAt}</TableCell>
              <TableCell>Preview</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
   
    </main>
  );
};

export default Page;
