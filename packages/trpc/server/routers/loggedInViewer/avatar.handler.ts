import type { TrpcSessionUser } from "@calcom/trpc/server/trpc";

type AvatarOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const avatarHandler = ({ ctx }: AvatarOptions) => {
    avatar: ctx.user.rawAvatar,
  };
