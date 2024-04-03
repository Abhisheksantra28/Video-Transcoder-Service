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
import { Player } from "react-tuby";
import "react-tuby/css/main.css";
import Modal from "react-modal";
// import { debounce, throttle } from "lodash"; 

const Page = () => {
  const searchParams = useSearchParams();
  const fileName: string | null = searchParams.get("fileName");

  const [videoData, setVideoData] = useState<any>();
  const [videoStatus, setVideoStatus] = useState<any>();
  const [pollingCompleted, setPollingCompleted] = useState<boolean>(false);
  const [downloading, setDownloading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  // VID-20230429-WA0030-360p.mp4

  useEffect(() => {
    const fetchVideo = () => {
      axios
        .get(
          `https://ecezbkpsc5.execute-api.ap-south-1.amazonaws.com/api/v1/video/v/${fileName}`
        )
        // .get(
        //   `https://ecezbkpsc5.execute-api.ap-south-1.amazonaws.com/api/v1/video/v/VID-20230429-WA0030`
        // )
        .then((response) => {
          setVideoData(response.data.data);
        })
        .catch((error) => {
          console.log("Error occurred while fetching the video file", error);
        });
    };
    fetchVideo();

  }, [fileName]);


    // // Apply debounce to fetchVideo function
    // const debouncedFetchVideo = debounce(() => {
    //   axios
    //     .get(
    //       `https://ecezbkpsc5.execute-api.ap-south-1.amazonaws.com/api/v1/video/v/${fileName}`
    //     )
    //     .then((response) => {
    //       setVideoData(response.data.data);
    //       console.log(videoData)
    //     })
    //     .catch((error) => {
    //       console.log("Error occurred while fetching the video file", error);
    //     });
    // }, 500); // Adjust the debounce delay as needed
  
    // useEffect(() => {
    //   debouncedFetchVideo(); // Invoke the debouncedFetchVideo function
    // }, [fileName]);

  useEffect(() => {
    if (videoData) {
      const fetchVideoStatus = () => {
        axios
          .get(
            `https://ecezbkpsc5.execute-api.ap-south-1.amazonaws.com/api/v1/video/s/${videoData._id}`
          )
          .then((response) => {
            // console.log(response.data.data);
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
  }, [pollingCompleted, videoData]);

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

        console.log(url);

        try {
          const response = await axios.get(url, {
            responseType: "blob",
          });
          const blob = new Blob([response.data]);
          zip.file(`${videoData.fileName}-${resolution}.mp4`, blob);
        } catch (error) {
          console.error(
            `Error downloading video for resolution: ${resolution}`,
            error
          );
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
    } finally {
      setDownloading(false);
    }
  };

  const fetchPreviewUrls = async () => {
    try {
      const urls: Record<string, string> = {};
      for (const resolution in videoData.videoResolutions) {
        const videoUrl = videoData.videoResolutions[resolution];
        const res = await fetch(
          `/api/videos?fileName=${fileName}&videoUrl=${videoUrl}`
        );

        if (!res.ok) {
          throw new Error(`Video fetching failed with status: ${res.status}`);
        }

        const { url } = await res.json();
        urls[resolution] = url;
      }
      setPreviewUrls(urls);
    } catch (error) {
      console.error("Error fetching preview URLs:", error);
    }
  };

  const handlePreview = () => {
    fetchPreviewUrls().then(() => {
      setIsPlaying(true);
      setIsOpen(true);
    });
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
              <TableCell>
                <Button onClick={handlePreview}>Preview</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
          content: {
            width: "36vw",
            height: "56vh",
            margin: "auto", // Center the modal horizontally
            padding: "0px",
            border: "none",
            overflow: "hidden",
          },
        }}
      >
        {isPlaying && (
          <Player
            src={Object.entries(previewUrls).map(([quality, url]) => ({
              quality,
              url,
            }))}
            dimensions={{ width: "100%", height: "100%" }}
          />
        )}
      </Modal>
    </main>
  );
};

export default Page;
