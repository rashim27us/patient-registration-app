import { pgTable, serial, varchar, date, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const patients = pgTable('patients', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  dob: date('dob').notNull(),
  gender: varchar('gender', { length: 20 }),
  email: varchar('email', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const medicalHistory = pgTable('medical_history', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id').references(() => patients.id, { onDelete: 'cascade' }),
  condition: text('condition').notNull(),
  diagnosisDate: date('diagnosis_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow()
});

export const allergies = pgTable('allergies', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id').references(() => patients.id, { onDelete: 'cascade' }),
  allergen: varchar('allergen', { length: 100 }).notNull(),
  severity: varchar('severity', { length: 20 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow()
});