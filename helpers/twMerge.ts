import { twMerge } from "tailwind-merge";

export const tw = (...classes: (string | false | null | undefined)[]) => {
  return twMerge(...(classes.filter(Boolean) as string[]));
};
