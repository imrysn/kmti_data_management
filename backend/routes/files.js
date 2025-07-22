const express = require("express");
const fs = require("fs");
const path = require("path");
const File = require("../models/File");
const ActivityLog = require("../models/ActivityLog");
const { auth, adminAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Upload file
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { description, tags, version, project } = req.body;

    const file = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user._id,
      metadata: {
        description,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        version,
        project,
      },
    });

    await file.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user._id,
      action: "upload",
      description: `File uploaded: ${req.file.originalname}`,
      resourceType: "file",
      resourceId: file._id,
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file,
    });
  } catch (error) {
    // Clean up uploaded file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
});

// Get all files
router.get("/", auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    let query = { isActive: true };

    // If not admin, only show user's own files
    if (req.user.role !== "admin") {
      query.uploadedBy = req.user._id;
    }

    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const files = await File.find(query)
      .populate("uploadedBy", "username email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const total = await File.countDocuments(query);

    res.json({
      files,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get file by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate(
      "uploadedBy",
      "username email"
    );

    if (!file || !file.isActive) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if user has access to this file
    if (
      req.user.role !== "admin" &&
      file.uploadedBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ file });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download file
router.get("/:id/download", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file || !file.isActive) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if user has access to this file
    if (
      req.user.role !== "admin" &&
      file.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ message: "File not found on disk" });
    }

    // Increment download count
    file.downloadCount += 1;
    await file.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user._id,
      action: "download",
      description: `File downloaded: ${file.originalName}`,
      resourceType: "file",
      resourceId: file._id,
      ipAddress: req.ip,
    });

    res.download(file.filePath, file.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update file metadata
router.put("/:id", auth, async (req, res) => {
  try {
    const { description, tags, version, project } = req.body;

    const file = await File.findById(req.params.id);
    if (!file || !file.isActive) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if user has access to this file
    if (
      req.user.role !== "admin" &&
      file.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    file.metadata = {
      description: description || file.metadata.description,
      tags: tags
        ? tags.split(",").map((tag) => tag.trim())
        : file.metadata.tags,
      version: version || file.metadata.version,
      project: project || file.metadata.project,
    };

    await file.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user._id,
      action: "update",
      description: `File metadata updated: ${file.originalName}`,
      resourceType: "file",
      resourceId: file._id,
      ipAddress: req.ip,
    });

    res.json({
      message: "File updated successfully",
      file,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete file
router.delete("/:id", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || !file.isActive) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if user has access to this file
    if (
      req.user.role !== "admin" &&
      file.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Soft delete
    file.isActive = false;
    await file.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user._id,
      action: "delete",
      description: `File deleted: ${file.originalName}`,
      resourceType: "file",
      resourceId: file._id,
      ipAddress: req.ip,
    });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk delete files (Admin only)
router.post("/bulk-delete", adminAuth, async (req, res) => {
  try {
    const { fileIds } = req.body;

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ message: "Invalid file IDs" });
    }

    const result = await File.updateMany(
      { _id: { $in: fileIds }, isActive: true },
      { isActive: false }
    );

    // Log activity
    await ActivityLog.create({
      userId: req.user._id,
      action: "delete",
      description: `Bulk delete: ${result.modifiedCount} files deleted`,
      resourceType: "file",
      ipAddress: req.ip,
      metadata: { deletedCount: result.modifiedCount },
    });

    res.json({
      message: `${result.modifiedCount} files deleted successfully`,
      deletedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
