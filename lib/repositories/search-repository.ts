import { prisma } from "@/lib/prisma";

export async function searchRepository(query: string) {
  const text = query.trim();
  if (!text) return { concepts: [], classics: [], people: [], schools: [], techniques: [] };
  return Promise.all([
    prisma.concept.findMany({ where: { publicationStatus: "PUBLISHED", OR: [{ name: { contains: text } }, { aliases: { has: text } }] }, take: 8 }),
    prisma.classic.findMany({ where: { publicationStatus: "PUBLISHED", OR: [{ title: { contains: text } }, { aliases: { has: text } }] }, take: 8 }),
    prisma.person.findMany({ where: { publicationStatus: "PUBLISHED", OR: [{ name: { contains: text } }, { aliases: { has: text } }] }, take: 8 }),
    prisma.school.findMany({ where: { publicationStatus: "PUBLISHED", OR: [{ name: { contains: text } }, { aliases: { has: text } }] }, take: 8 }),
    prisma.technique.findMany({ where: { publicationStatus: "PUBLISHED", OR: [{ name: { contains: text } }, { aliases: { has: text } }] }, take: 8 }),
  ]).then(([concepts, classics, people, schools, techniques]) => ({ concepts, classics, people, schools, techniques }));
}
