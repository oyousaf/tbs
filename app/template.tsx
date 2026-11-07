import { ViewTransition, type ReactNode } from "react";

/**
 * Templates remount on navigation, so enter and exit fire for every route.
 * Logo and Home links carry the "home" type, which opens the page through an
 * expanding spot instead of the usual fade and lift.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ home: "spot-in", default: "page-in" }}
      exit={{ home: "spot-out", default: "page-out" }}
      default="none"
    >
      <div>{children}</div>
    </ViewTransition>
  );
}
