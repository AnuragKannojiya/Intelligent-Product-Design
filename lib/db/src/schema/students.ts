import { pgTable, text, serial, timestamp, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentsTable = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  degree: text("degree").notNull(),
  branch: text("branch"),
  cgpa: real("cgpa").notNull(),
  internships: integer("internships").default(0),
  skills: text("skills").array(),
  targetCountry: text("target_country"),
  preferredCourse: text("preferred_course"),
  budgetRangeMin: integer("budget_range_min"),
  budgetRangeMax: integer("budget_range_max"),
  familyIncome: text("family_income"),
  hasCoApplicant: boolean("has_co_applicant").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({ id: true, createdAt: true });
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof studentsTable.$inferSelect;
