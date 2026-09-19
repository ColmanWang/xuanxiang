import { prisma } from "@/lib/prisma";

export const graphRepository = {
  getAll: async () => {
    const [concepts, classics, people, schools, techniques, dynasties, relations] = await Promise.all([
      prisma.concept.findMany({ where: { publicationStatus: "PUBLISHED" } }), prisma.classic.findMany({ where: { publicationStatus: "PUBLISHED" } }), prisma.person.findMany({ where: { publicationStatus: "PUBLISHED" } }), prisma.school.findMany({ where: { publicationStatus: "PUBLISHED" } }), prisma.technique.findMany({ where: { publicationStatus: "PUBLISHED" } }), prisma.dynasty.findMany(), prisma.relation.findMany({ orderBy: { id: "asc" } }),
    ]);
    return { concepts, classics, people, schools, techniques, dynasties, relations };
  },
};
