import { userMetadata } from "@calcom/prisma/zod-utils";
import type { TrpcSessionUser } from "@calcom/trpc/server/trpc";

type GetUsersDefaultConferencingAppOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const getUsersDefaultConferencingAppHandler = ({
  ctx,
}: GetUsersDefaultConferencingAppOptions) => userMetadata.parse(ctx.user.metadata)?.defaultConferencingApp;
