import prisma from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import type { TFindKeyOfTypeInputSchema } from "./findKeyOfType.schema";

type FindKeyOfTypeOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TFindKeyOfTypeInputSchema;
};

export const findKeyOfTypeHandler = ({ ctx, input }: FindKeyOfTypeOptions) => await prisma.apiKey.findFirst({
    where: {
      AND: [
        {
          userId: ctx.user.id,
        },
        {
          appId: input.appId,
        },
      ],
    },
  });
