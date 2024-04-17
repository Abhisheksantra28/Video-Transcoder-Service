# Video Transcoding System

This project is a scalable video transcoding system built on AWS services and Node.js, aimed at automatically generating multiple resolutions of uploaded videos. It enhances accessibility and optimizes viewing experiences by providing users with options to preview and download videos in various resolutions.

## Technologies Used

- **AWS Services**: S3, Lambda, EventBridge, ECS
- **Frontend**: Next.js
- **Backend**: Node.js (with Express.js)
- **Database**: MongoDB
- **Docker**

## Project Structure

The project is organized into several components:

- **ecs-task**: Manages the transcoding process by spinning up Docker containers on ECS.
- **upload-trigger-api**: AWS Lambda function triggered by S3 events, initiates video transcoding tasks.
- **video-transcoder-client**: Next.js frontend for uploading videos, previewing transcoded videos, and downloading transcoded files.
- **video-transcoder-server**: Main server implemented as a Lambda function using the Serverless Framework, handles video transcoding job queue management, rate limiting, and webhook calls.

## Features

- Automatically transcodes uploaded videos into multiple resolutions (360p, 480p, 720p, 1080p).
- Rate limiting to ensure a maximum of 5 concurrent video transcoding jobs.
- Integration with MongoDB for storing video metadata and status.
- Utilizes signed URLs for secure uploads and downloads from S3.
- Leverages AWS EventBridge for triggering transcoding tasks upon video upload events.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies for each component (frontend, backend, ECS task).
3. Configure environment variables for AWS services, MongoDB, and other settings.
4. Deploy the backend components (Lambda functions, ECS task) using the provided scripts or Serverless Framework.
5. Launch the frontend application and start uploading and transcoding videos.

## Usage

- Upload videos through the frontend interface.
- Preview transcoded videos in various resolutions.
- Download transcoded files individually or as a zip archive.

## Contribution Guidelines

Contributions to the project are welcome! If you have any suggestions, bug fixes, or feature implementations, please open an issue or submit a pull request following our contribution guidelines.

## License

This project is licensed under the [MIT License](LICENSE).
