import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUpload, FaLock, FaImage, FaFileAlt, FaStar, FaCheckCircle, FaTimes, FaShieldAlt, FaCamera } from "react-icons/fa";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import style from "./Form.module.css";
import { useAuth } from "../../Layout/AuthContext";
import { mediaApi, extractData } from "../../../api";

const DocumentForm = ({
  handleCancelClick,
  handleSaveClick,
  images,
  setImages,
  setdocuments,
  documents,
  fetchData,
  selectedOption,
  setSelectedOption,
  selectedDocOption: propSelectedDocOption,
  setSelectedDocOption: propSetSelectedDocOption,
}) => {
  const { updateData, fetchprofile } = useAuth();
  const [localDocOption, setLocalDocOption] = useState(false);

  // Local Display Lists
  const [localImages, setLocalImages] = useState([]);
  const [localDocuments, setLocalDocuments] = useState([]);

  // Pending File Selections (File Objects)
  const [pendingPhotoFiles, setPendingPhotoFiles] = useState([]);
  const [pendingDocFiles, setPendingDocFiles] = useState([]);
  const [pendingDeletions, setPendingDeletions] = useState([]);

  // Avatar Selection Tracking
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);

  // Upload Progress & Saving States
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docProgress, setDocProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const selectedDocOption = propSelectedDocOption !== undefined ? propSelectedDocOption : localDocOption;
  const setSelectedDocOption = propSetSelectedDocOption || setLocalDocOption;

  // Initialize local display state from props
  useEffect(() => {
    setLocalImages(images || []);
    setLocalDocuments(documents || []);
    const currentAvatar = (images || []).find((img) => img.isAvatar);
    if (currentAvatar) {
      setSelectedAvatarId(currentAvatar._id);
    }
  }, [images, documents]);

  const options = [
    { id: "publicOption", value: false, label: "Public" },
    { id: "onRequestOption", value: true, label: "On Request" },
  ];

  const docOptions = [
    { id: "publicDocOption", value: false, label: "Public" },
    { id: "onRequestDocOption", value: true, label: "On Request" },
  ];

  const handleOptionChange = async (event) => {
    const newValue = event.target.value === "true";
    try {
      setSelectedOption(newValue);
      const route = "update-privacy";
      await updateData(route, newValue, true);
    } catch (error) {
      console.error("Error updating privacy:", error.message);
    }
  };

  const handleDocOptionChange = async (event) => {
    const newValue = event.target.value === "true";
    try {
      setSelectedDocOption(newValue);
      const route = "update-privacy";
      await updateData(route, { isDocPrivate: newValue, type: "document" }, true);
    } catch (error) {
      console.error("Error updating document privacy:", error.message);
    }
  };

  // Local File Selection (Does NOT hit DB yet)
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files) || [];
    const maxSizeBytes = 2 * 1024 * 1024; // 2 MB limit
    const oversized = files.find((file) => file.size > maxSizeBytes);

    if (oversized) {
      toast.error("File size exceeds 2 MB limit. Please select an image under 2 MB.");
      event.target.value = "";
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length === 0) {
      toast.error("Invalid file type. Only JPEG, PNG, and JPG are allowed.");
      event.target.value = "";
      return;
    }

    const newPreviewItems = validFiles.map((file) => ({
      _id: `temp_${Date.now()}_${Math.random()}`,
      url: URL.createObjectURL(file),
      fileObj: file,
      isPending: true,
      isAvatar: false,
    }));

    setPendingPhotoFiles((prev) => [...prev, ...validFiles]);
    setLocalImages((prev) => [...prev, ...newPreviewItems]);
    toast.info(`${validFiles.length} photo(s) selected. Click 'Save & Close' to upload.`);
    event.target.value = "";
  };

  // Local Document Selection (Does NOT hit DB yet)
  const handleDocumentUpload = (event) => {
    const files = Array.from(event.target.files) || [];
    const maxSizeBytes = 2 * 1024 * 1024; // 2 MB limit
    const oversized = files.find((file) => file.size > maxSizeBytes);

    if (oversized) {
      toast.error("File size exceeds 2 MB limit. Please select a document under 2 MB.");
      event.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length === 0) {
      toast.error("Invalid file type. Only JPEG, PNG, JPG, PDF, DOC, and DOCX are allowed.");
      event.target.value = "";
      return;
    }

    const newPreviewItems = validFiles.map((file) => ({
      _id: `temp_doc_${Date.now()}_${Math.random()}`,
      url: URL.createObjectURL(file),
      fileObj: file,
      isPending: true,
    }));

    setPendingDocFiles((prev) => [...prev, ...validFiles]);
    setLocalDocuments((prev) => [...prev, ...newPreviewItems]);
    toast.info(`${validFiles.length} document(s) selected. Click 'Save & Close' to upload.`);
    event.target.value = "";
  };

  // Local Avatar Toggle
  const setAsProfileImage = (profileId) => {
    setSelectedAvatarId(profileId);
    setLocalImages((prev) =>
      prev.map((img) =>
        img._id === profileId
          ? { ...img, isAvatar: true }
          : { ...img, isAvatar: false }
      )
    );
  };

  // Local Deletion
  const handleDelete = (profileId) => {
    const isPendingPhoto = localImages.find((img) => img._id === profileId && img.isPending);
    if (isPendingPhoto) {
      setLocalImages((prev) => prev.filter((img) => img._id !== profileId));
      setPendingPhotoFiles((prev) => prev.filter((f) => f !== isPendingPhoto.fileObj));
      return;
    }

    const isPendingDoc = localDocuments.find((doc) => doc._id === profileId && doc.isPending);
    if (isPendingDoc) {
      setLocalDocuments((prev) => prev.filter((doc) => doc._id !== profileId));
      setPendingDocFiles((prev) => prev.filter((f) => f !== isPendingDoc.fileObj));
      return;
    }

    // Existing Database File -> Track for deletion on Save
    setPendingDeletions((prev) => [...prev, profileId]);
    setLocalImages((prev) => prev.filter((img) => img._id !== profileId));
    setLocalDocuments((prev) => prev.filter((doc) => doc._id !== profileId));
  };

  // SAVE & CLOSE: Executes actual Database API calls with progress percentage
  const handleSaveAll = async () => {
    setIsSaving(true);

    try {
      // 1. Delete files marked for removal
      if (pendingDeletions.length > 0) {
        for (const fileId of pendingDeletions) {
          try {
            await mediaApi.deleteFile(fileId);
          } catch (err) {
            console.error("Error deleting file:", err);
          }
        }
      }

      // 2. Upload Pending Photos with Progress Bar
      let uploadedPhotoResult = null;
      if (pendingPhotoFiles.length > 0) {
        setIsUploadingImage(true);
        setImageProgress(10);

        const formData = new FormData();
        pendingPhotoFiles.forEach((file) => formData.append("avatars", file));

        const response = await mediaApi.uploadPhotos(formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setImageProgress(percent);
            }
          },
        });
        setImageProgress(100);
        uploadedPhotoResult = extractData(response)?.photos;
      }

      // 3. Upload Pending Documents with Progress Bar
      if (pendingDocFiles.length > 0) {
        setIsUploadingDoc(true);
        setDocProgress(10);

        const formData = new FormData();
        pendingDocFiles.forEach((file) => formData.append("avatars", file));

        await mediaApi.uploadDocuments(formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setDocProgress(percent);
            }
          },
        });
        setDocProgress(100);
      }

      // 4. Update Avatar Image if changed
      if (selectedAvatarId && !selectedAvatarId.startsWith("temp_")) {
        try {
          await mediaApi.setAvatar(selectedAvatarId);
          await fetchprofile();
        } catch (err) {
          console.error("Avatar setting error:", err);
        }
      }

      toast.success("Changes saved successfully to database!");
      await fetchData();
      handleSaveClick();
    } catch (error) {
      console.error("Error during save:", error);
      toast.error("An error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
      setIsUploadingImage(false);
      setIsUploadingDoc(false);
    }
  };

  return (
    <div className={style.modalContainer}>
      <div className={style.modalContent} style={{ maxWidth: "750px" }}>
        
        {/* Header Bar */}
        <div className={style.modalHeader} style={{ background: "linear-gradient(135deg, #59123B 0%, #3d0826 100%)" }}>
          <div className="d-flex align-items-center gap-2">
            <FaImage size={18} style={{ color: "#c59b27" }} />
            <h4 className={style.headerTitle} style={{ fontSize: "1.05rem", fontWeight: "700" }}>
              Upload Photos &amp; Documents
            </h4>
          </div>
          <MdOutlineCancelPresentation
            onClick={handleCancelClick}
            className={style.closeIcon}
            size="24"
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <div style={{ overflowY: "auto", flex: 1, padding: "16px 18px" }}>
            <form onSubmit={(e) => e.preventDefault()}>
          
          {/* Images Section Card */}
          <div
            style={{
              background: "#fdfafc",
              border: "1px solid rgba(89, 18, 59, 0.12)",
              borderRadius: "14px",
              padding: "16px 18px",
              marginBottom: "18px",
            }}
          >
            {/* Top Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
              <div>
                <h6 style={{ margin: 0, fontWeight: 700, color: "#59123B", fontSize: "0.88rem" }}>
                  <FaCamera className="me-1.5" style={{ color: "#c59b27" }} /> Photo Gallery
                </h6>
                <span style={{ fontSize: "0.68rem", color: "#6c6c80" }}>
                  Max 2MB per photo • Uploads on 'Save &amp; Close'
                </span>
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                {/* Privacy Radios */}
                <div className="d-flex align-items-center gap-2 bg-white px-2.5 py-1 rounded-pill border">
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#59123B" }}>Privacy:</span>
                  {options.map((option) => (
                    <div key={option.id} className="d-flex align-items-center">
                      <input
                        className="form-check-input me-1"
                        type="radio"
                        name="privacyOptions"
                        id={option.id}
                        value={option.value}
                        checked={selectedOption === option.value}
                        onChange={handleOptionChange}
                        style={{ cursor: "pointer" }}
                      />
                      <label
                        className="m-0"
                        htmlFor={option.id}
                        style={{ fontSize: "0.7rem", fontWeight: 600, color: "#4a4a5e", cursor: "pointer", whiteSpace: "nowrap" }}
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Upload Button */}
                <label
                  className="btn btn-sm text-white"
                  style={{
                    background: isUploadingImage ? "#888888" : "linear-gradient(135deg, #59123B, #3d0826)",
                    border: "none",
                    borderRadius: "6px",
                    padding: "5px 12px",
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    cursor: isUploadingImage || isSaving ? "not-allowed" : "pointer",
                    boxShadow: "0 2px 6px rgba(89, 18, 59, 0.2)",
                    pointerEvents: isUploadingImage || isSaving ? "none" : "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  <FaUpload className="me-1" />
                  {isUploadingImage ? `Uploading ${imageProgress}%...` : "+ Select Photos"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isUploadingImage || isSaving}
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            {/* Photo Upload Progress Bar */}
            {isUploadingImage && (
              <div className="mb-3 p-2 bg-white rounded border" style={{ borderColor: "rgba(89, 18, 59, 0.2)" }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#59123B" }}>
                    Uploading Photos to Database... {imageProgress}%
                  </span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#c59b27" }}>
                    {imageProgress}%
                  </span>
                </div>
                <div style={{ height: "6px", width: "100%", background: "#f3e8ee", borderRadius: "10px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${imageProgress}%`,
                      background: "linear-gradient(90deg, #59123B, #c59b27)",
                      borderRadius: "10px",
                      transition: "width 0.2s linear"
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Photos Grid */}
            {localImages.length === 0 ? (
              <div
                style={{
                  border: "1.5px dashed rgba(89, 18, 59, 0.2)",
                  borderRadius: "10px",
                  padding: "24px",
                  textAlign: "center",
                  background: "#ffffff",
                  color: "#78788c",
                  fontSize: "0.82rem",
                }}
              >
                <FaImage size={24} style={{ color: "#c59b27", marginBottom: "6px", display: "block", margin: "0 auto 6px" }} />
                No photos selected. Click <strong>+ Select Photos</strong> to choose images.
              </div>
            ) : (
              <div className="d-flex flex-wrap gap-3">
                {localImages.map((image, index) => (
                  <div
                    key={image._id || index}
                    className="position-relative"
                    style={{
                      width: "105px",
                      height: "105px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                      border: image.isAvatar ? "2px solid #c59b27" : image.isPending ? "1.5px dashed #59123B" : "1px solid rgba(0,0,0,0.1)",
                      background: "#ffffff",
                    }}
                  >
                    <img
                      src={image?.url}
                      alt="uploaded profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => setAsProfileImage(image._id)}
                    />

                    {/* Pending Badge */}
                    {image.isPending && (
                      <span
                        className="position-absolute top-0 start-0 bg-warning text-dark px-1"
                        style={{ fontSize: "0.55rem", fontWeight: 700, borderRadius: "0 0 4px 0" }}
                      >
                        Pending
                      </span>
                    )}

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(image._id); }}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "rgba(255, 255, 255, 0.9)",
                        border: "none",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#dc2626",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        zIndex: 10,
                      }}
                      title="Remove Image"
                    >
                      <RiDeleteBin6Line size={12} />
                    </button>

                    {/* Avatar Status Overlay */}
                    {image.isAvatar ? (
                      <span
                        className="position-absolute bottom-0 start-0 w-100 text-center py-0.5"
                        style={{
                          backgroundColor: "#59123B",
                          color: "#f7e7b6",
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          letterSpacing: "0.02em",
                        }}
                      >
                        ★ Main Photo
                      </span>
                    ) : (
                      <div
                        className="position-absolute bottom-0 start-0 w-100 text-center py-0.5"
                        style={{
                          backgroundColor: "rgba(0, 0, 0, 0.65)",
                          color: "#ffffff",
                          fontSize: "0.6rem",
                          cursor: "pointer",
                        }}
                        onClick={() => setAsProfileImage(image._id)}
                      >
                        Make Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents Section Card */}
          <div
            style={{
              background: "#fdfafc",
              border: "1px solid rgba(89, 18, 59, 0.12)",
              borderRadius: "14px",
              padding: "16px 18px",
              marginBottom: "18px",
            }}
          >
            {/* Top Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
              <div>
                <h6 style={{ margin: 0, fontWeight: 700, color: "#59123B", fontSize: "0.88rem" }}>
                  <FaFileAlt className="me-1.5" style={{ color: "#c59b27" }} /> Verification Documents
                </h6>
                <span style={{ fontSize: "0.68rem", color: "#6c6c80" }}>
                  Aadhar, Horoscope, Identity • Uploads on 'Save &amp; Close'
                </span>
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                {/* Privacy Radios */}
                <div className="d-flex align-items-center gap-2 bg-white px-2.5 py-1 rounded-pill border">
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#59123B" }}>Privacy:</span>
                  {docOptions.map((option) => (
                    <div key={option.id} className="d-flex align-items-center">
                      <input
                        className="form-check-input me-1"
                        type="radio"
                        name="docPrivacyOptions"
                        id={option.id}
                        value={option.value}
                        checked={selectedDocOption === option.value}
                        onChange={handleDocOptionChange}
                        style={{ cursor: "pointer" }}
                      />
                      <label
                        className="m-0"
                        htmlFor={option.id}
                        style={{ fontSize: "0.7rem", fontWeight: 600, color: "#4a4a5e", cursor: "pointer", whiteSpace: "nowrap" }}
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Upload Button */}
                <label
                  className="btn btn-sm btn-outline-danger"
                  style={{
                    borderRadius: "6px",
                    padding: "4px 12px",
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    cursor: isUploadingDoc || isSaving ? "not-allowed" : "pointer",
                    borderColor: isUploadingDoc ? "#888888" : "#59123B",
                    color: isUploadingDoc ? "#888888" : "#59123B",
                    pointerEvents: isUploadingDoc || isSaving ? "none" : "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  <FaUpload className="me-1" />
                  {isUploadingDoc ? `Uploading ${docProgress}%...` : "+ Select Document"}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    multiple
                    disabled={isUploadingDoc || isSaving}
                    onChange={handleDocumentUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            {/* Document Upload Progress Bar */}
            {isUploadingDoc && (
              <div className="mb-3 p-2 bg-white rounded border" style={{ borderColor: "rgba(89, 18, 59, 0.2)" }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#59123B" }}>
                    Uploading Documents to Database... {docProgress}%
                  </span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#c59b27" }}>
                    {docProgress}%
                  </span>
                </div>
                <div style={{ height: "6px", width: "100%", background: "#f3e8ee", borderRadius: "10px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${docProgress}%`,
                      background: "linear-gradient(90deg, #59123B, #c59b27)",
                      borderRadius: "10px",
                      transition: "width 0.2s linear"
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Documents Grid */}
            {!localDocuments || localDocuments.length === 0 ? (
              <div
                style={{
                  border: "1.5px dashed rgba(89, 18, 59, 0.2)",
                  borderRadius: "10px",
                  padding: "20px",
                  textAlign: "center",
                  background: "#ffffff",
                  color: "#78788c",
                  fontSize: "0.82rem",
                }}
              >
                <FaFileAlt size={22} style={{ color: "#c59b27", marginBottom: "4px", display: "block", margin: "0 auto 4px" }} />
                No verification documents selected. Click <strong>+ Select Document</strong> to choose files.
              </div>
            ) : (
              <div className="d-flex flex-wrap gap-3">
                {localDocuments.map((document, index) => {
                  const isImage = document?.url?.startsWith("blob:") || document?.url?.startsWith("data:image") || document?.url?.match(/\.(jpeg|jpg|gif|png)$/i);
                  return (
                    <div
                      key={document._id || index}
                      className="position-relative"
                      style={{
                        width: "105px",
                        height: "105px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                        border: document.isPending ? "1.5px dashed #59123B" : "1px solid rgba(0,0,0,0.1)",
                        background: "#ffffff",
                      }}
                    >
                      {isImage ? (
                        <img
                          src={document.url}
                          alt="document"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="d-flex flex-column justify-content-center align-items-center h-100 p-2"
                          style={{ background: "#f8f9fa", textAlign: "center" }}
                        >
                          <FaFileAlt size={24} style={{ color: "#59123B", marginBottom: "4px" }} />
                          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#1a1a2e" }}>Doc File</span>
                          {!document.isPending && (
                            <a
                              href={document.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: "0.62rem", color: "#59123B", fontWeight: 600, textDecoration: "underline" }}
                            >
                              View File
                            </a>
                          )}
                        </div>
                      )}

                      {/* Pending Badge */}
                      {document.isPending && (
                        <span
                          className="position-absolute top-0 start-0 bg-warning text-dark px-1"
                          style={{ fontSize: "0.55rem", fontWeight: 700, borderRadius: "0 0 4px 0" }}
                        >
                          Pending
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(document._id)}
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "none",
                          borderRadius: "50%",
                          width: "22px",
                          height: "22px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#dc2626",
                          cursor: "pointer",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          zIndex: 10,
                        }}
                        title="Remove Document"
                      >
                        <RiDeleteBin6Line size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

            </form>
          </div>

          {/* Modal Actions — always visible */}
          <div className={style.modalFooter}>
            <button
              type="button"
              className={style.cancelBtn}
              onClick={handleCancelClick}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              className={style.saveBtn}
              onClick={handleSaveAll}
              disabled={isSaving}
              style={{ opacity: isSaving ? 0.7 : 1 }}
            >
              {isSaving ? "Saving & Uploading..." : "Save & Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentForm;
