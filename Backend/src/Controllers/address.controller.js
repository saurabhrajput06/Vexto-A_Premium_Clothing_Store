import addressModel from "../Models/address.model.js";

// 1. Add Address
export const addAddress = async (req, res) => {
  const { name, mobile, houseName, area, city, state, country, pincode, addressType } = req.body;

  if (!name || !mobile || !houseName || !area || !city || !state || !country || !pincode) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  try {
    // Check if this is the user's first address; if yes, make it default
    const addressCount = await addressModel.countDocuments({ user: req.user._id });
    const isDefault = addressCount === 0;

    const address = await addressModel.create({
      user: req.user._id,
      name,
      mobile,
      houseName,
      area,
      city,
      state,
      country: country || "India",
      pincode,
      addressType: addressType || "home",
      isDefault,
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: address,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// 2. Get All Addresses of Current User
export const getAddressByUser = async (req, res) => {
  try {
    const addresses = await addressModel.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: addresses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// 3. Get Single Address By ID
export const getSingleAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    const address = await addressModel.findOne({
      _id: addressId,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// 4. Update Address
export const updateAddress = async (req, res) => {
  const { addressId } = req.params;
  const updates = req.body;

  // Don't allow updating isDefault or user directly through updateAddress
  delete updates.isDefault;
  delete updates.user;

  try {
    const updatedAddress = await addressModel.findOneAndUpdate(
      { _id: addressId, user: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// 5. Set Default Address
export const setDefaultAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    const address = await addressModel.findOne({
      _id: addressId,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found or unauthorized",
      });
    }

    // Step 1: Remove default from all user's addresses
    await addressModel.updateMany({ user: req.user._id }, { $set: { isDefault: false } });

    // Step 2: Set current address to default
    address.isDefault = true;
    await address.save();

    return res.status(200).json({
      success: true,
      message: "Default address set successfully",
      data: address,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// 6. Delete Address
export const deleteAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    const deletedAddress = await addressModel.findOneAndDelete({
      _id: addressId,
      user: req.user._id,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or unauthorized",
      });
    }

    // If deleted address was default, make the latest created address default
    if (deletedAddress.isDefault) {
      const remainingAddress = await addressModel.findOne({ user: req.user._id }).sort({ createdAt: -1 });
      if (remainingAddress) {
        remainingAddress.isDefault = true;
        await remainingAddress.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: deletedAddress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};