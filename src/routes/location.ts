import { Router } from "express";

import {
  getCountries,
  getStates,
  getCities,
  getStatesByCountry,
  getCitiesByState,
  createCountry,
  createState,
  createCity,
  updateCountry,
  updateState,
  updateCity,
  deleteCountry,
  deleteState,
  deleteCity,
} from "../controllers/location";

import { protect } from "../middlewares/auth";

const router = Router();

router.route("/countries").get(getCountries).post(protect, createCountry);
router.route("/states").get(getStates).post(protect, createState);
router.route("/cities").get(getCities).post(protect, createCity);
router
  .route("/countries/:countryId")
  .put(protect, updateCountry)
  .delete(protect, deleteCountry);
router
  .route("/states/:stateId")
  .put(protect, updateState)
  .delete(protect, deleteState);
router
  .route("/cities/:cityId")
  .put(protect, updateCity)
  .delete(protect, deleteCity);
router.route("/states/country/:countryId").get(getStatesByCountry);
router.route("/cities/state/:stateId").get(getCitiesByState);

export default router;
