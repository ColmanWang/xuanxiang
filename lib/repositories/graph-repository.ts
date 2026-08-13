import { prisma } from "@/lib/prisma";

export const graphRepository = {
  getAll: async () => {
    const [concepts, classics, people, schools, techniques, dynasties, relations] = await Promise.all([
      prisma.concept.findMany(), prisma.classic.findMany(), prisma.person.findMany(), prisma.school.findMany(), prisma.technique.findMany(), prisma.dynasty.findMany(), prisma.relation.findMany({ orderBy: { id: "asc" } }),
    ]);
    return { concepts, classics, people, schools, techniques, dynasties, relations };
  },
};
