import type { TGetScheduleInputSchema } from "./getSchedule.schema";
import { getSchedule } from "./util";

type GetScheduleOptions = {
  ctx: Record<string, unknown>;
  input: TGetScheduleInputSchema;
};

export const getScheduleHandler = ({ input }: GetScheduleOptions) => await getSchedule(input);
