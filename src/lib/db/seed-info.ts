/**
 * WORKLINK DATABASE SEED DOCUMENTATION
 *
 * This file contains comprehensive seed data that matches the exact Mongoose schemas:
 *
 * === MANUFACTURERS SCHEMA ===
 * Fields: companyName, companyEmail, password, workSector, location
 * + Auto-generated: createdAt, updatedAt, _id
 *
 * === STARTUPS SCHEMA ===
 * Fields: companyName, companyEmail, password, workSector, location, foundedYear (optional)
 * + Auto-generated: createdAt, updatedAt, _id
 *
 * === MACHINES SCHEMA ===
 * Required: name, type, description, location, manufacturerId
 * Optional: specifications, pricePerHour, available (default: true), status (default: 'active')
 * + Auto-generated: createdAt, updatedAt, _id
 *
 * === GIGS SCHEMA ===
 * Required: title, description, skillsRequired, location, salary, duration, startupId
 * Optional: isActive (default: true), status (default: 'active')
 * + Auto-generated: createdAt, updatedAt, _id
 *
 * === WORKLINK CONCEPT ===
 * WorkLink connects:
 * 1. Manufacturers with SEASONAL MACHINES (idle during off-seasons)
 * 2. Startups needing those machines for projects
 * 3. Blue-collar workers who can operate those machines
 *
 * Example Flow:
 * - Agricultural machines idle in winter (Nov-Mar) → Available for food processing startups
 * - Snow equipment idle in summer (Apr-Sep) → Available for cold storage businesses
 * - Construction equipment idle in dry season → Available for other construction projects
 *
 * === SEED DATA SUMMARY ===
 * - 5 Manufacturers with seasonal equipment
 * - 10 Machines (2 per manufacturer) with off-season availability
 * - 5 Startups needing machines and workers
 * - 10 Blue-collar job opportunities (2 per startup)
 *
 * All data follows industrial/seasonal themes and includes realistic Indian locations,
 * pricing in INR (₹), and authentic blue-collar job requirements.
 */

// This file serves as documentation for the seed.ts implementation
export const SEED_INFO = {
  totalManufacturers: 5,
  totalMachines: 10,
  totalStartups: 5,
  totalGigs: 10,
  concept: 'Seasonal machine sharing + Blue-collar worker marketplace',
  verified: 'Schema compliance confirmed ✅',
};
