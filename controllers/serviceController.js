import Service from "../models/Service.js";
import Lawyer from "../models/Lawyer.js";

export const addService = async (req, res) => {
  try {
    const { service_name, description, price, duration } = req.body;

    if (!service_name) {
      return res.status(400).json({ message: "Service name is required" });
    }

    const service = await Service.create({
      lawyer_id: req.lawyer.id,
      service_name,
      description,
      price,
      duration,
    });

    return res.status(201).json({ message: "Service added successfully", service });
  } catch (err) {
    console.error("addService error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ lawyer_id: req.lawyer.id });
    return res.json({ services });
  } catch (err) {
    console.error("getMyServices error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, lawyer_id: req.lawyer.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) return res.status(404).json({ message: "Service not found" });
    return res.json({ message: "Service updated successfully", service });
  } catch (err) {
    console.error("updateService error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.id, lawyer_id: req.lawyer.id });
    if (!service) return res.status(404).json({ message: "Service not found" });
    return res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error("deleteService error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllLawyersWithServices = async (req, res) => {
  try {
    const lawyers = await Lawyer.find({ isActive: true });
    const lawyersWithServices = await Promise.all(
      lawyers.map(async (lawyer) => {
        const services = await Service.find({ lawyer_id: lawyer._id });
        return { ...lawyer.toObject(), services };
      })
    );
    return res.json({ lawyers: lawyersWithServices });
  } catch (err) {
    console.error("getAllLawyersWithServices error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getServicesByLawyer = async (req, res) => {
  try {
    const services = await Service.find({ lawyer_id: req.params.lawyerId });
    return res.json({ services });
  } catch (err) {
    console.error("getServicesByLawyer error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
