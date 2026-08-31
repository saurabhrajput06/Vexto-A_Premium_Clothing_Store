import express from "express";
import { AuthenticateUser } from "../Middleware/auth.middleware.js";
import { addressValidator, updateAddressValidator } from "../Validator/address.validator.js";
import {
  addAddress,
  getAddressByUser,
  getSingleAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "../Controllers/address.controller.js";

const router = express.Router();

router.post("/addAddress", AuthenticateUser, addressValidator, addAddress);
router.get("/getAddressByUser", AuthenticateUser, getAddressByUser);
router.get("/getSingleAddress/:addressId", AuthenticateUser, getSingleAddress);
router.put("/updateAddress/:addressId", AuthenticateUser, updateAddressValidator, updateAddress);
router.patch("/setDefaultAddress/:addressId", AuthenticateUser, setDefaultAddress);
router.delete("/deleteAddress/:addressId", AuthenticateUser, deleteAddress);

export default router;