import { render, screen } from "@testing-library/react";
import App from "../../App";

test("renders homepage navigation", () => {
  render(<App />);

  expect(screen.getByText(/select a section/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /companies/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /candidates/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /interviews/i })).toBeInTheDocument();
});
