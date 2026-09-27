import { type ComponentProps, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type MaterialRippleProps = Omit<ComponentProps<"span">, "children" | "ref"> & {
  disabled?: boolean;
};

/** Place inside a positioned control (MaterialButton already provides a surface). */
export function MaterialRipple({
  disabled = false,
  className,
  ...props
}: MaterialRippleProps) {
  const surfaceRef = useRef<HTMLSpanElement>(null);
  const pressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const surface = surfaceRef.current;
    const press = pressRef.current;
    const control =
      surface?.closest<HTMLElement>(
        "button, a[href], [role='button'], [data-material-ripple-control]",
      ) ?? surface?.parentElement;
    if (!surface || !press || !control || disabled) return;

    const forcedColors = window.matchMedia("(forced-colors: active)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pointer: PointerEvent | undefined;
    let animation: Animation | undefined;
    let touchTimer: ReturnType<typeof setTimeout> | undefined;
    let releaseTimer: ReturnType<typeof setTimeout> | undefined;
    let startedAt = 0;
    let pressed = false;
    let pointerClick = false;

    const unavailable = () =>
      control.matches(":disabled, [disabled]") ||
      !!control.closest("[aria-disabled='true']") ||
      forcedColors.matches;

    const reset = () => {
      clearTimeout(touchTimer);
      clearTimeout(releaseTimer);
      animation?.cancel();
      animation = undefined;
      pointer = undefined;
      pressed = false;
      pointerClick = false;
      delete surface.dataset.hovered;
      delete surface.dataset.pressed;
      delete surface.dataset.focused;
    };

    const start = (event?: PointerEvent) => {
      clearTimeout(touchTimer);
      clearTimeout(releaseTimer);
      animation?.cancel();
      const rect = surface.getBoundingClientRect();
      const width = surface.clientWidth;
      const height = surface.clientHeight;
      if (!width || !height || unavailable()) return;

      // Normalize client coordinates for CSS zoom and transformed controls.
      const x = event
        ? ((event.clientX - rect.left) * width) / rect.width
        : width / 2;
      const y = event
        ? ((event.clientY - rect.top) * height) / rect.height
        : height / 2;
      const size = Math.max(1, Math.floor(Math.max(width, height) * 0.2));
      const diameter =
        Math.hypot(width, height) +
        10 +
        Math.max(75, Math.max(width, height) * 0.35);
      const end = `translate(${(width - size) / 2}px, ${(height - size) / 2}px) scale(${diameter / size})`;
      press.style.width = press.style.height = `${size}px`;
      press.style.transform = end;
      if (!reducedMotion.matches) {
        animation = press.animate(
          [
            {
              transform: `translate(${x - size / 2}px, ${y - size / 2}px) scale(1)`,
            },
            { transform: end },
          ],
          { duration: 450, easing: "cubic-bezier(0.2, 0, 0, 1)" },
        );
      }
      startedAt = performance.now();
      pressed = true;
      surface.dataset.pressed = "";
    };

    const release = () => {
      clearTimeout(touchTimer);
      pointer = undefined;
      if (!pressed) return;
      pressed = false;
      // Keep quick taps visible, but never let an old release end a new press.
      releaseTimer = setTimeout(
        () => {
          delete surface.dataset.pressed;
        },
        Math.max(0, 225 - (performance.now() - startedAt)),
      );
    };

    const accepts = (event: PointerEvent) =>
      !unavailable() &&
      event.isPrimary &&
      (!pointer || pointer.pointerId === event.pointerId);
    const down = (event: PointerEvent) => {
      if (!accepts(event) || event.button !== 0 || pointer) return;
      pointer = event;
      pointerClick = true;
      if (event.pointerType === "touch") {
        touchTimer = setTimeout(() => start(event), 150);
      } else {
        start(event);
      }
    };
    const up = (event: PointerEvent) => {
      if (!pointer || !accepts(event)) return;
      const rect = control.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (inside && !pressed) start(pointer);
      release();
    };
    const cancel = (event: PointerEvent) => {
      if (pointer?.pointerId === event.pointerId) release();
    };
    const enter = (event: PointerEvent) => {
      if (accepts(event) && event.pointerType !== "touch")
        surface.dataset.hovered = "";
    };
    const leave = (event: PointerEvent) => {
      if (!accepts(event) || event.pointerType === "touch") return;
      delete surface.dataset.hovered;
      release();
    };
    const click = (event: MouseEvent) => {
      if (unavailable()) return;
      // Native keyboard and assistive-technology clicks have no pointer origin.
      if (event.detail === 0 || !pointerClick) start();
      pointerClick = false;
      release();
    };
    const syncDisabled = () => {
      if (unavailable()) reset();
    };
    const focus = () => {
      if (!unavailable() && control.matches(":focus-visible"))
        surface.dataset.focused = "";
    };
    const observer = new MutationObserver(syncDisabled);
    // Include disabled fieldsets and inherited aria-disabled changes.
    for (
      let ancestor: HTMLElement | null = control;
      ancestor;
      ancestor = ancestor.parentElement
    ) {
      observer.observe(ancestor, {
        attributes: true,
        attributeFilter: ["disabled", "aria-disabled"],
      });
    }
    control.addEventListener("pointerdown", down);
    control.addEventListener("pointerenter", enter);
    control.addEventListener("pointerleave", leave);
    control.addEventListener("click", click);
    control.addEventListener("contextmenu", release);
    control.addEventListener("blur", reset);
    control.addEventListener("focus", focus);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("blur", reset);
    forcedColors.addEventListener("change", syncDisabled);
    reducedMotion.addEventListener("change", reset);
    return () => {
      reset();
      observer.disconnect();
      control.removeEventListener("pointerdown", down);
      control.removeEventListener("pointerenter", enter);
      control.removeEventListener("pointerleave", leave);
      control.removeEventListener("click", click);
      control.removeEventListener("contextmenu", release);
      control.removeEventListener("blur", reset);
      control.removeEventListener("focus", focus);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("blur", reset);
      forcedColors.removeEventListener("change", syncDisabled);
      reducedMotion.removeEventListener("change", reset);
    };
  }, [disabled]);

  return (
    <span
      {...props}
      ref={surfaceRef}
      aria-hidden="true"
      className={cn(
        "group/ripple pointer-events-none absolute inset-0 -z-1 overflow-hidden rounded-[inherit] data-[disabled]:hidden forced-colors:hidden [&::before]:absolute [&::before]:inset-0 [&::before]:bg-[var(--md-ripple-hover-color,currentColor)] [&::before]:opacity-0 [&::before]:transition-opacity [&::before]:duration-150 [&::before]:content-[''] [&[data-focused]::before]:opacity-[var(--md-ripple-focus-opacity,0.12)] [&[data-hovered]::before]:opacity-[var(--md-ripple-hover-opacity,0.08)] [&[data-pressed]::before]:opacity-0",
        className,
      )}
      data-material-ripple=""
      data-disabled={disabled || undefined}
    >
      <span
        ref={pressRef}
        className="absolute top-0 left-0 aspect-square rounded-full bg-[radial-gradient(closest-side,var(--md-ripple-pressed-color,currentColor)_65%,transparent_100%)] opacity-0 transition-opacity duration-150 group-data-[pressed]/ripple:opacity-[var(--md-ripple-pressed-opacity,0.12)] group-data-[pressed]/ripple:duration-0"
      />
    </span>
  );
}
