import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "@/components/ui/pagination";

describe("Pagination", () => {
  it("informa el rango y solicita la siguiente página", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        page={2}
        pageSize={10}
        totalItems={25}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />,
    );

    expect(screen.getByText("11–20")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
