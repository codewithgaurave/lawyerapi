import Certificate from "../models/Certificate.js";

export const addCertificate = async (req, res) => {
  try {
    const { certificate_name, issuing_organization, issue_date, expiry_date, credential_id, credential_url } = req.body;

    if (!certificate_name || !issuing_organization || !issue_date) {
      return res.status(400).json({ message: "Certificate name, issuing organization, and issue date are required" });
    }

    const certificate = await Certificate.create({
      lawyer_id: req.lawyer.id,
      certificate_name,
      issuing_organization,
      issue_date,
      expiry_date,
      credential_id,
      credential_url,
      certificate_file: req.file ? req.file.path : undefined,
    });

    return res.status(201).json({ message: "Certificate added successfully", certificate });
  } catch (err) {
    console.error("addCertificate error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ lawyer_id: req.lawyer.id }).sort({ issue_date: -1 });
    return res.json({ certificates });
  } catch (err) {
    console.error("getMyCertificates error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOneAndUpdate(
      { _id: req.params.id, lawyer_id: req.lawyer.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!certificate) return res.status(404).json({ message: "Certificate not found" });
    return res.json({ message: "Certificate updated successfully", certificate });
  } catch (err) {
    console.error("updateCertificate error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOneAndDelete({ _id: req.params.id, lawyer_id: req.lawyer.id });
    if (!certificate) return res.status(404).json({ message: "Certificate not found" });
    return res.json({ message: "Certificate deleted successfully" });
  } catch (err) {
    console.error("deleteCertificate error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
