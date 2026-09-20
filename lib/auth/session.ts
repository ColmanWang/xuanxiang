import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "./auth";
import type { StudioRoleName } from "./permissions";

export interface StudioPrincipal {
  userId: string;
  email: string;
  name: string;
  role: StudioRoleName;
}

interface StudioSession {
  user?: { id?: string; email?: string; emailVerified?: boolean; name?: string | null };
}

interface StudioMemberDatabase {
  studioMember: {
    findFirst(args: object): Promise<{ id: string; role: StudioRoleName } | null>;
    updateMany(args: object): Promise<{ count: number }>;
  };
}

export async function resolveStudioPrincipal(session: StudioSession | null, database: StudioMemberDatabase): Promise<StudioPrincipal | null> {
  if (!session?.user?.id || !session.user.email || session.user.emailVerified !== true) return null;
  const bound = await database.studioMember.findFirst({
    where: { enabled: true, userId: session.user.id },
    select: { id: true, role: true },
  });
  if (bound) return { userId: session.user.id, email: session.user.email, name: session.user.name ?? session.user.email, role: bound.role };

  const unbound = await database.studioMember.findFirst({
    where: {
      enabled: true,
      userId: null,
      email: { equals: session.user.email.trim().toLowerCase(), mode: "insensitive" },
    },
    select: { id: true, role: true },
  });
  if (!unbound) return null;
  const binding = await database.studioMember.updateMany({
    where: { id: unbound.id, userId: null, enabled: true },
    data: { userId: session.user.id },
  });
  if (binding.count !== 1) return null;
  return { userId: session.user.id, email: session.user.email, name: session.user.name ?? session.user.email, role: unbound.role };
}

export async function getStudioPrincipal(requestHeaders?: Headers): Promise<StudioPrincipal | null> {
  const session = await auth.api.getSession({ headers: requestHeaders ?? await headers() });
  return resolveStudioPrincipal(session, prisma as unknown as StudioMemberDatabase);
}
