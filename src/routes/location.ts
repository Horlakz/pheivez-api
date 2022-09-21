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

const router = Router();

router.route("/countries").get(getCountries).post(createCountry);
router.route("/countries/:id").put(updateCountry).delete(deleteCountry);
router.route("/states").get(getStates).post(createState);
router.route("/states/:id").put(updateState).delete(deleteState);
router.route("/cities").get(getCities).post(createCity);
router.route("/cities/:id").put(updateCity).delete(deleteCity);
router.route("/states/:countryId").get(getStatesByCountry);
router.route("/cities/:stateId").get(getCitiesByState);

export default router;
