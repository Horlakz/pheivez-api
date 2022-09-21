import asyncHander from "express-async-handler";
import type { Request, Response } from "express";
import { Country, State, City } from "../models/location";

// @desc    Get all countries
// @route   GET /api/countries
// @access  Public
export const getCountries = asyncHander(async (req: Request, res: Response) => {
  if (req.query.available) {
    const countries = await Country.find({ available: true });
    res.json(countries);
  }
  const countries = await Country.find();
  res.json(countries);
});

// @desc    Get all states
// @route   GET /api/states
// @access  Public
export const getStates = asyncHander(async (req: Request, res: Response) => {
  if (req.query.available) {
    const states = await State.find({ available: true });
    res.json(states);
  }
  const states = await State.find();
  res.json(states);
});

// @desc    Get all cities
// @route   GET /api/cities
// @access  Public
export const getCities = asyncHander(async (req: Request, res: Response) => {
  if (req.query.available) {
    const cities = await City.find({ available: true });
    res.json(cities);
  }
  const cities = await City.find();
  res.json(cities);
});

// @desc    Get all states by country
// @route   GET /api/states/:countryId
// @access  Public
export const getStatesByCountry = asyncHander(
  async (req: Request, res: Response) => {
    const states = await State.find({
      country: req.params.countryId,
      available: true,
    });
    res.json(states);
  }
);

// @desc    Get all cities by state
// @route   GET /api/cities/:stateId
// @access  Public
export const getCitiesByState = asyncHander(
  async (req: Request, res: Response) => {
    const cities = await City.find({
      state: req.params.stateId,
      available: true,
    });
    res.json(cities);
  }
);

// @desc    create a country
// @route   POST /api/countries
// @access  Private/Admin
export const createCountry = asyncHander(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const country = await Country.create({
      name,
    });
    res.status(201).json(country);
  }
);

// @desc    create a state
// @route   POST /api/states
// @access  Private/Admin
export const createState = asyncHander(async (req: Request, res: Response) => {
  const { name, country } = req.body;
  const state = await State.create({
    name,
    country,
  });
  res.status(201).json(state);
});

// @desc    create a city
// @route   POST /api/cities
// @access  Private/Admin
export const createCity = asyncHander(async (req: Request, res: Response) => {
  const { name, state } = req.body;
  const city = await City.create({
    name,
    state,
  });
  res.status(201).json(city);
});

// @desc    update a country
// @route   PUT /api/countries/:id
// @access  Private/Admin
export const updateCountry = asyncHander(
  async (req: Request, res: Response) => {
    try {
      const country = await Country.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!country) {
        res.status(404).json({ message: "Country not found" });
        return;
      }
      res.json(country);
    } catch (err) {
      if (err instanceof Error) res.status(400).json({ message: err.message });
    }
  }
);

// @desc   update a state
// @route   PUT /api/states/:id
// @access  Private/Admin
export const updateState = asyncHander(async (req: Request, res: Response) => {
  try {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!state) {
      res.status(404).json({ message: "State not found" });
      return;
    }
    res.json(state);
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});

// @desc    update a city
// @route   PUT /api/cities/:id
// @access  Private/Admin
export const updateCity = asyncHander(async (req: Request, res: Response) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!city) {
      res.status(404).json({ message: "City not found" });
      return;
    }
    res.json(city);
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});

// @desc    delete a country
// @route   DELETE /api/countries/:id
// @access  Private/Admin
export const deleteCountry = asyncHander(
  async (req: Request, res: Response) => {
    const country = await Country.findById(req.params.id);
    if (!country) {
      res.status(404).json({ message: "Country not found" });
      return;
    }
    await country.remove();
    res.json({ message: "Country removed" });
  }
);

// @desc    delete a state
// @route   DELETE /api/states/:id
// @access  Private/Admin
export const deleteState = asyncHander(async (req: Request, res: Response) => {
  const state = await State.findById(req.params.id);
  if (!state) {
    res.status(404).json({ message: "State not found" });
    return;
  }
  await state.remove();
  res.json({ message: "State removed" });
});

// @desc    delete a city
// @route   DELETE /api/cities/:id
// @access  Private/Admin
export const deleteCity = asyncHander(async (req: Request, res: Response) => {
  const city = await City.findById(req.params.id);
  if (!city) {
    res.status(404).json({ message: "City not found" });
    return;
  }
  await city.remove();
  res.json({ message: "City removed" });
});
