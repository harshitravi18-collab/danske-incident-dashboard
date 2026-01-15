import "@testing-library/jest-dom/vitest";
import "../lib/i18n";

// matchMedia (used by responsive components)
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

// ResizeObserver (used by Table/Pagination/layout measurement)
if (!window.ResizeObserver) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).ResizeObserver = ResizeObserver;
}

// getComputedStyle (rc-table scrollbar measurement)
const originalGetComputedStyle = window.getComputedStyle;

window.getComputedStyle = ((elt: Element, pseudoElt?: string | null) => {
  try {
    return originalGetComputedStyle(elt, pseudoElt ?? undefined);
  } catch {
    return {
      getPropertyValue: () => "",
    } as unknown as CSSStyleDeclaration;
  }
}) as typeof window.getComputedStyle;

// requestAnimationFrame (some rc-util hooks rely on it)
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(Date.now()), 0) as unknown as number;
}
if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (id: number) =>
    clearTimeout(id as unknown as NodeJS.Timeout);
}
