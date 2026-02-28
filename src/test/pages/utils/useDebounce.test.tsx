import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "../../../pages/utils/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("updates value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 300 } }
    );

    rerender({ value: "ab", delay: 300 });

    expect(result.current).toBe("a");

    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe("a");

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe("ab");
  });

  it("keeps only the latest value when updates are rapid", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "one", delay: 250 } }
    );

    rerender({ value: "two", delay: 250 });
    rerender({ value: "three", delay: 250 });

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(result.current).toBe("three");
  });
});
