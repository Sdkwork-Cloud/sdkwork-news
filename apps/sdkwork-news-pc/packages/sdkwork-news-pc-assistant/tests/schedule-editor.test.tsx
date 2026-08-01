import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import {
  createDefaultNewsReadingSchedule,
  type NewsReadingSchedule,
} from "@sdkwork/news-agent-contracts";
import { NewsScheduleEditor } from "../src/schedule-editor";

function ScheduleHarness() {
  const [schedule, setSchedule] = useState<NewsReadingSchedule>(() => (
    createDefaultNewsReadingSchedule("Asia/Shanghai")
  ));
  return <NewsScheduleEditor onChange={setSchedule} schedule={schedule} />;
}

describe("NewsScheduleEditor", () => {
  it("adds daily slots and renders cron expressions from the schedule contract", () => {
    render(<ScheduleHarness />);

    fireEvent.click(screen.getByRole("button", { name: "添加时段" }));

    expect(screen.getAllByLabelText(/每日时段/u)).toHaveLength(3);
    expect(screen.getByText("0 10 * * *")).toBeInTheDocument();
  });

  it("edits weekly weekdays and updates the cron preview", () => {
    render(<ScheduleHarness />);

    fireEvent.click(screen.getByRole("button", { name: "编辑每周总结" }));
    fireEvent.click(screen.getByRole("button", { name: "一" }));

    expect(screen.getByText("30 17 * * 1,5")).toBeInTheDocument();
  });

  it("shows contract validation feedback for duplicate daily times", () => {
    render(<ScheduleHarness />);
    const inputs = screen.getAllByLabelText(/每日时段/u);

    fireEvent.change(inputs[1]!, { target: { value: "08:30" } });

    expect(screen.getByRole("alert")).toHaveTextContent("每日简报不能设置重复时段");
  });
});
