import { describe, expect, it } from "vitest";

import {
  buildNewsReadingCronJobs,
  createDefaultNewsReadingSchedule,
  validateNewsReadingSchedule,
} from "../src/index.js";

describe("news reading schedule", () => {
  it("materializes daily, weekly, and monthly rules as timezone-aware cron jobs", () => {
    const schedule = createDefaultNewsReadingSchedule("Asia/Shanghai");
    const jobs = buildNewsReadingCronJobs(schedule);

    expect(jobs).toEqual([
      { expression: "30 8 * * *", id: "daily:morning", kind: "daily", timezone: "Asia/Shanghai" },
      { expression: "0 18 * * *", id: "daily:evening", kind: "daily", timezone: "Asia/Shanghai" },
      { expression: "30 17 * * 5", id: "weekly:summary", kind: "weekly", timezone: "Asia/Shanghai" },
      { expression: "30 9 1 * *", id: "monthly:review", kind: "monthly", timezone: "Asia/Shanghai" },
    ]);
  });

  it("rejects duplicate enabled daily slots and invalid monthly days", () => {
    const schedule = createDefaultNewsReadingSchedule("Asia/Shanghai");
    schedule.daily[1]!.time = schedule.daily[0]!.time;
    schedule.monthly.day = 31;

    expect(validateNewsReadingSchedule(schedule).map((issue) => issue.code)).toEqual([
      "daily-slot-duplicate",
      "monthly-day-invalid",
    ]);
  });
});
