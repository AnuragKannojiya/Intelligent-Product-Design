import { Router, type IRouter } from "express";
import { db, studentsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  CreateProfileBody,
  ListProfilesResponse,
  GetProfileParams,
  GetProfileResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/profile", async (req, res): Promise<void> => {
  const students = await db
    .select()
    .from(studentsTable)
    .orderBy(desc(studentsTable.createdAt));

  const mapped = students.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    degree: s.degree,
    branch: s.branch,
    cgpa: s.cgpa,
    internships: s.internships,
    skills: s.skills,
    targetCountry: s.targetCountry,
    preferredCourse: s.preferredCourse,
    budgetRangeMin: s.budgetRangeMin,
    budgetRangeMax: s.budgetRangeMax,
    familyIncome: s.familyIncome,
    hasCoApplicant: s.hasCoApplicant,
    createdAt: s.createdAt?.toISOString() ?? new Date().toISOString(),
  }));

  res.json(ListProfilesResponse.parse(mapped));
});

router.post("/profile", async (req, res): Promise<void> => {
  const parsed = CreateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [student] = await db
    .insert(studentsTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      degree: parsed.data.degree,
      branch: parsed.data.branch,
      cgpa: parsed.data.cgpa,
      internships: parsed.data.internships,
      skills: parsed.data.skills,
      targetCountry: parsed.data.targetCountry,
      preferredCourse: parsed.data.preferredCourse,
      budgetRangeMin: parsed.data.budgetRangeMin,
      budgetRangeMax: parsed.data.budgetRangeMax,
      familyIncome: parsed.data.familyIncome,
      hasCoApplicant: parsed.data.hasCoApplicant,
    })
    .returning();

  const result = {
    id: student.id,
    name: student.name,
    email: student.email,
    degree: student.degree,
    branch: student.branch,
    cgpa: student.cgpa,
    internships: student.internships,
    skills: student.skills,
    targetCountry: student.targetCountry,
    preferredCourse: student.preferredCourse,
    budgetRangeMin: student.budgetRangeMin,
    budgetRangeMax: student.budgetRangeMax,
    familyIncome: student.familyIncome,
    hasCoApplicant: student.hasCoApplicant,
    createdAt: student.createdAt?.toISOString() ?? new Date().toISOString(),
  };

  res.status(201).json(GetProfileResponse.parse(result));
});

router.get("/profile/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProfileParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [student] = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.id, params.data.id));

  if (!student) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const result = {
    id: student.id,
    name: student.name,
    email: student.email,
    degree: student.degree,
    branch: student.branch,
    cgpa: student.cgpa,
    internships: student.internships,
    skills: student.skills,
    targetCountry: student.targetCountry,
    preferredCourse: student.preferredCourse,
    budgetRangeMin: student.budgetRangeMin,
    budgetRangeMax: student.budgetRangeMax,
    familyIncome: student.familyIncome,
    hasCoApplicant: student.hasCoApplicant,
    createdAt: student.createdAt?.toISOString() ?? new Date().toISOString(),
  };

  res.json(GetProfileResponse.parse(result));
});

export default router;
