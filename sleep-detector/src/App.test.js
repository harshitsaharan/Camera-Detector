import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders sleep detector heading", () => {
  render(<App />);
  const text = screen.getByText(/Sleep Detection Alarm System/i);
  expect(text).toBeInTheDocument();
});
