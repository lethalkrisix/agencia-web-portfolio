"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

const INTERACTIVE_SELECTOR = "a, button, input, textarea, [role='button']";

export default function Cursor() {
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine)");
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor");

    const handleMove = (event: PointerEvent) => {
      const transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
      if (outerRef.current) outerRef.current.style.transform = transform;
      if (innerRef.current) innerRef.current.style.transform = transform;
    };
    const handleOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const hovering = Boolean(target?.closest(INTERACTIVE_SELECTOR));
      outerRef.current?.classList.toggle("cursor-link-hover", hovering);
      innerRef.current?.classList.toggle("cursor-link-hover", hovering);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerover", handleOver);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={outerRef} aria-hidden="true" className="circle-cursor circle-cursor--outer" />
      <div ref={innerRef} aria-hidden="true" className="circle-cursor circle-cursor--inner" />
    </>
  );
}
