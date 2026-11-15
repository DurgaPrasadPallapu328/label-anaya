"use client";

import { useEffect, useState } from "react";
import { BrandLoader } from "./brand-loader";

export function InitialBrandLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const started = performance.now();
    let finishTimer: ReturnType<typeof setTimeout>;
    const finish = () => {
      // A short first-visit introduction; route changes never wait for this.
      finishTimer = setTimeout(() => setVisible(false), Math.max(0, 1200 - (performance.now() - started)));
    };
    const safetyTimer = setTimeout(() => setVisible(false), 6000);
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(finishTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  return visible ? <BrandLoader startup /> : null;
}
