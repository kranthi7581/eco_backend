const { Address } = require("../../models/relations");

const createAddress = async (req, res) => {
  try {
    let userId = req.user.id;
    if (req.user.role === "admin" && req.body.userId) {
      userId = req.body.userId;
    }
    const { label, line1, line2, city, state, pincode, country } = req.body;
    const address = await Address.create({
      userId,
      label,
      line1,
      line2,
      city,
      state,
      pincode,
      country,
    });
    res.status(201).json({ message: "Address created successfully", address });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating address", error: error.message });
  }
};

const getAddresses = async (req, res) => {
  try {
    let userId = req.user.id;
    if (req.user.role === "admin" && req.query.userId) {
      userId = req.query.userId;
    }
    const addresses = await Address.findAll({ where: { userId } });
    res.status(200).json({ addresses });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching addresses", error: error.message });
  }
};

const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    let address;
    if (req.user.role === "admin") {
      address = await Address.findOne({ where: { id } });
    } else {
      address = await Address.findOne({ where: { id, userId: req.user.id } });
    }
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({ address });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching address", error: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, line1, line2, city, state, pincode, country } = req.body;
    let address;
    if (req.user.role === "admin") {
      address = await Address.findOne({ where: { id } });
    } else {
      address = await Address.findOne({ where: { id, userId: req.user.id } });
    }
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    address.label = label ?? address.label;
    address.line1 = line1 ?? address.line1;
    address.line2 = line2 ?? address.line2;
    address.city = city ?? address.city;
    address.state = state ?? address.state;
    address.pincode = pincode ?? address.pincode;
    address.country = country ?? address.country;
    await address.save();
    res.status(200).json({ message: "Address updated successfully", address });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating address", error: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    let address;
    if (req.user.role === "admin") {
      address = await Address.findOne({ where: { id } });
    } else {
      address = await Address.findOne({ where: { id, userId: req.user.id } });
    }
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    await address.destroy();
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting address", error: error.message });
  }
};

module.exports = {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
