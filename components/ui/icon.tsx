import type { ReactNode, SVGProps } from "react";

type IconName = "truck" | "leaf" | "shield" | "tape" | "menu" | "close" | "search" | "bag" | "account" | "chevron" | "arrow" | "minus" | "plus" | "trash";

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    truck: <><path d="M2 5h12v12H2zM14 9h4l4 5v3h-8M2 14h12" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    leaf: <path d="M11 22C12 15 15 10 20 5M12 17C7 16 4 12 3 8c6 0 9 3 9 8M14 14c0-6 3-10 7-12 1 5-1 9-7 12M10 21c-5-1-7-4-8-7 5 0 8 2 8 7M14 19c2-4 5-5 9-5-1 4-4 6-9 5" />,
    shield: <><path d="m12 2 9 3v6c0 5-4 9-9 11-5-2-9-6-9-11V5z" /><path d="m7.5 12 3 3 6-6" /></>,
    tape: <><ellipse cx="9" cy="7" rx="7" ry="4" /><ellipse cx="9" cy="7" rx="3" ry="1.5" /><path d="M2 7v8c0 3 5 4 10 4h10v-8H9M16 7v4M6 15v3M11 15v4M16 15v4M21 15v4" /></>,
    menu: <path d="M3 5h18M3 12h18M3 19h18" />,
    close: <path d="m5 5 14 14M19 5 5 19" />,
    search: <><circle cx="10.5" cy="10.5" r="7.5" /><path d="m16 16 6 6" /></>,
    bag: <path d="M5 7h14l2 14H3zM8 9V6a4 4 0 0 1 8 0v3" />,
    account: <><circle cx="12" cy="6" r="4" /><path d="M3 22v-2a9 9 0 0 1 18 0v2z" /></>,
    chevron: <path d="m5 9 7 7 7-7" />,
    arrow: <path d="M3 12h18m-7-7 7 7-7 7" />,
    minus: <path d="M5 12h14" />,
    plus: <path d="M5 12h14M12 5v14" />,
    trash: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></>,
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      {paths[name]}
    </svg>
  );
}
