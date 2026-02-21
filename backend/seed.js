/**
 * seed.js
 * Run: node seed.js
 *
 * Generates:
 * - 1000 Cargo
 * - 1000 Trips
 * - 800 Service Logs
 * Spread across 8 years
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ── Models ─────────────────────────────────────────────
const User       = require("./src/db/model/User");
const Driver     = require("./src/db/model/Driver");
const Vehicle    = require("./src/db/model/Vehicle");
const Cargo      = require("./src/db/model/cargo");
const Trip       = require("./src/db/model/Trip");
const ServiceLog = require("./src/db/model/ServiceLog");

// ── Config ─────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/fleetflow";

const COUNTS = {
  users: 50,
  drivers: 200,
  vehicles: 150,
  cargo: 1000,
  trips: 1000,
  serviceLogs: 800,
};

// ── Helpers ─────────────────────────────────────────────
const pick  = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randF = (min, max, dp = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(dp));

const MAX_YEARS = 8;
const MAX_DAYS = MAX_YEARS * 365;

// Soft skew toward recent years
const skewedDaysAgo = (skew = 1.3) =>
  Math.floor(Math.pow(Math.random(), skew) * MAX_DAYS);

const daysToMs = (d) => d * 24 * 60 * 60 * 1000;

// ── Sample Data ─────────────────────────────────────────
const CITIES = [
  "Mumbai","Delhi","Bengaluru","Hyderabad","Chennai","Pune",
  "Ahmedabad","Kolkata","Jaipur","Lucknow","Surat","Nagpur",
  "Indore","Bhopal","Visakhapatnam","Coimbatore"
];

const VEHICLE_MODELS = [
  "Tata Prima 4028","Ashok Leyland 3718","Mahindra Blazo X 35",
  "Eicher Pro 6031","Volvo FH 16","Tata 407"
];

const FIRST = ["Arjun","Rahul","Vikram","Sneha","Priya","Amit","Neha","Rohan"];
const LAST  = ["Sharma","Patel","Singh","Gupta","Reddy","Verma","Nair","Mehta"];

const fullName = () => `${pick(FIRST)} ${pick(LAST)}`;
const plate = () => `MH${rand(10,99)}AB${rand(1000,9999)}`;
const licenseNo = () => `LIC-${rand(10000,99999)}`;

// ─────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────
async function seedUsers() {
  const hashed = await bcrypt.hash("password123", 10);
  const roles = ["MANAGER","DISPATCHER","SAFETY","FINANCE"];

  const users = [];

  for (let i = 0; i < COUNTS.users; i++) {
    users.push({
      name: fullName(),
      email: `user${i}@fleetflow.com`,
      phone: `+91${rand(7000000000,9999999999)}`,
      address: `${rand(1,999)}, ${pick(CITIES)}`,
      password: hashed,
      role: pick(roles),
      approved: true
    });
  }

  await User.insertMany(users);
  console.log("Users seeded");
}

// ─────────────────────────────────────────────────────────
// DRIVERS
// ─────────────────────────────────────────────────────────
async function seedDrivers() {
  const drivers = [];

  for (let i = 0; i < COUNTS.drivers; i++) {
    drivers.push({
      name: fullName(),
      licenseNumber: licenseNo(),
      vehicleTypes: ["TRUCK"],
      age: rand(22,60),
      experience: rand(1,30),
      totalKmDriven: rand(10000,800000),
      safetyScore: randF(60,100),
      status: pick(["ON_DUTY","OFF_DUTY"]),
      isActive: true
    });
  }

  return await Driver.insertMany(drivers);
}

// ─────────────────────────────────────────────────────────
// VEHICLES
// ─────────────────────────────────────────────────────────
async function seedVehicles() {
  const vehicles = [];

  for (let i = 0; i < COUNTS.vehicles; i++) {
    vehicles.push({
      name: pick(VEHICLE_MODELS),
      licensePlate: plate(),
      maxCapacity: rand(1000,20000),
      odometer: rand(1000,500000),
      status: pick(["AVAILABLE","DISPATCHED","IN_SHOP"])
    });
  }

  return await Vehicle.insertMany(vehicles);
}

// ─────────────────────────────────────────────────────────
// CARGO
// ─────────────────────────────────────────────────────────
async function seedCargo() {
  const cargos = [];

  for (let i = 0; i < COUNTS.cargo; i++) {
    const pickup = pick(CITIES);
    let drop;
    do { drop = pick(CITIES); } while (drop === pickup);

    const distance = rand(100,2000);
    const weight = rand(100,8000);

    const ratePerKm = randF(1.2,3.5);
    const amount = Math.round(distance * ratePerKm);

    const requestDate = new Date(Date.now() - daysToMs(skewedDaysAgo()));
    const deliveryDate = new Date(
      requestDate.getTime() + daysToMs(rand(1,7))
    );

    cargos.push({
      weight,
      pickup,
      drop,
      distance,
      amount,
      status: "COMPLETED",
      requestDate,
      expectedDeliveryDate: deliveryDate
    });
  }

  return await Cargo.insertMany(cargos);
}

// ─────────────────────────────────────────────────────────
// TRIPS (with profit)
// ─────────────────────────────────────────────────────────
async function seedTrips(cargos, vehicles, drivers) {
  const trips = [];

  for (let i = 0; i < COUNTS.trips; i++) {
    const cargo = cargos[i];
    const vehicle = pick(vehicles);
    const driver = pick(drivers);

    const startDate = new Date(Date.now() - daysToMs(skewedDaysAgo()));
    const endDate = new Date(
      startDate.getTime() + rand(5,48) * 60 * 60 * 1000
    );

    const cost = Math.round(
      cargo.distance * randF(0.5,1.5) + rand(1000,5000)
    );

    const revenue = cargo.amount;
    const profit = revenue - cost;
    const margin = parseFloat(((profit / revenue) * 100).toFixed(2));

    trips.push({
      cargo: cargo._id,
      vehicle: vehicle._id,
      driver: driver._id,
      cargoWeight: cargo.weight,
      distance: cargo.distance,
      status: "COMPLETED",
      startDate,
      endDate,
      amount: revenue,
      cost,
      profit,
      profitMargin: margin
    });
  }

  return await Trip.insertMany(trips);
}

// ─────────────────────────────────────────────────────────
// SERVICE LOGS
// ─────────────────────────────────────────────────────────
async function seedServiceLogs(vehicles) {
  const logs = [];

  for (let i = 0; i < COUNTS.serviceLogs; i++) {
    logs.push({
      vehicle: pick(vehicles)._id,
      serviceType: "Oil Change",
      description: "Routine maintenance",
      cost: rand(500,20000),
      status: "COMPLETED",
      serviceDate: new Date(Date.now() - daysToMs(skewedDaysAgo()))
    });
  }

  await ServiceLog.insertMany(logs);
}

// ─────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await Promise.all([
      User.deleteMany({}),
      Driver.deleteMany({}),
      Vehicle.deleteMany({}),
      Cargo.deleteMany({}),
      Trip.deleteMany({}),
      ServiceLog.deleteMany({})
    ]);

    await seedUsers();
    const drivers = await seedDrivers();
    const vehicles = await seedVehicles();
    const cargos = await seedCargo();
    await seedTrips(cargos, vehicles, drivers);
    await seedServiceLogs(vehicles);

    console.log("Seeding complete 🚀");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();