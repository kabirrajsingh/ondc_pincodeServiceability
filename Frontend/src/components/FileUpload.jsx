import { useState } from "react";
import ProgressBar from "./ProgressBar";
import Button from "./Button";

const UPLOAD_ENDPOINT =
  "https://asia-south2-local-cogency-413608.cloudfunctions.net/UploadSparseMatrix";

// FileUpload component
const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);

          // Reset progress bar after 1.5 seconds if progress reaches 100%
          if (percentComplete === 100) {
            setTimeout(() => {
              setUploadProgress(0);
            }, 2000);
          }
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            // Handle successful upload
          } else {
            // Handle upload error
            console.error("Error uploading file:", xhr.responseText);
          }
        }
      };

      xhr.open("POST", UPLOAD_ENDPOINT);
      xhr.send(formData);
    }
  };

  return (
    <div className="pl-6">
      <div>
        <input type="file" onChange={handleFileChange} />
        <Button onClick={handleUpload}>Upload</Button>
      </div>
      {uploadProgress > 0 && (
        <div className="mt-4">
          <ProgressBar percent={uploadProgress.toFixed(0)} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
