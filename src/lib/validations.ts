import { z } from "zod";

// ==================== Project Schemas ====================
export const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).default(""),
  sourceLang: z.string().min(2).max(10).default("en"),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  sourceLang: z.string().min(2).max(10).optional(),
});

export const addLocaleSchema = z.object({
  code: z.string().min(2).max(10),
  name: z.string().min(1).max(100),
});

// ==================== String Schemas ====================
export const createStringSchema = z.object({
  key: z.string().min(1).max(500),
  sourceText: z.string().min(1),
  context: z.string().max(1000).optional().default(""),
  filePath: z.string().max(1000).optional().default(""),
});

export const updateStringSchema = z.object({
  key: z.string().min(1).max(500).optional(),
  sourceText: z.string().min(1).optional(),
  context: z.string().max(1000).optional(),
  filePath: z.string().max(1000).optional(),
});

// ==================== Translation Schemas ====================
export const updateTranslationSchema = z.object({
  text: z.string(),
  status: z.enum(["untranslated", "draft", "approved", "rejected"]).optional(),
  comment: z.string().max(2000).optional(),
});

export const createTranslationSchema = z.object({
  localeId: z.string().cuid(),
  text: z.string(),
  status: z.enum(["untranslated", "draft", "approved", "rejected"]).default("draft"),
  comment: z.string().max(2000).optional().default(""),
});

// ==================== Import Schema ====================
export const importSchema = z.object({
  format: z.enum(["json", "yaml", "po", "strings", "xml", "properties"]),
  content: z.string().min(1),
  localeCode: z.string().min(2).max(10),
  localeName: z.string().min(1).max(100).optional(),
});

// ==================== Export Schema ====================
export const exportSchema = z.object({
  format: z.enum(["json", "yaml", "po", "strings", "xml", "properties"]),
  localeCode: z.string().min(2).max(10).optional(),
});

// ==================== Translation Memory Schemas ====================
export const createTMSchema = z.object({
  sourceText: z.string().min(1),
  targetText: z.string().min(1),
  sourceLang: z.string().min(2).max(10),
  targetLang: z.string().min(2).max(10),
  quality: z.number().int().min(0).max(100).default(100),
});

// ==================== Screenshot Schema ====================
export const screenshotSchema = z.object({
  stringId: z.string().cuid().optional(),
});

// ==================== User/RBAC Schema ====================
export const roleSchema = z.enum(["admin", "translator", "viewer"]);

export const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  role: roleSchema.default("viewer"),
  projectId: z.string().cuid(),
});

// ==================== Query Schemas ====================
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  search: z.string().max(200).optional(),
  status: z.enum(["untranslated", "draft", "approved", "rejected"]).optional(),
  localeCode: z.string().max(10).optional(),
});

// ==================== Scan Result Schema ====================
export const scanResultSchema = z.object({
  missingKeys: z.array(z.string()),
  duplicateKeys: z.array(z.string()),
  orphanTranslations: z.array(z.string()),
});
