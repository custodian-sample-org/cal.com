import prisma from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";

type ListOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const listHandler = ({ ctx }: ListOptions) => await prisma.apiKey.findMany({
    where: {
      userId: ctx.user.id,
      OR: [
        {
          NOT: {
            appId: "zapier",
          },
        },
        {
          appId: null,
        },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
