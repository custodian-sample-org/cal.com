import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";

type ListOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const listHandler = ({ ctx }: ListOptions) => await prisma.eventType.findMany({
    where: {
      userId: ctx.user.id,
      team: null,
    },
    select: {
      id: true,
      title: true,
      description: true,
      length: true,
      schedulingType: true,
      slug: true,
      hidden: true,
      metadata: true,
    },
  });
