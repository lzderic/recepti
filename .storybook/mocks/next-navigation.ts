type Router = {
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
  prefetch: (href: string) => Promise<void>;
};

let pathname = "/";

export const __setPathname = (nextPathname: string) => {
  pathname = nextPathname || "/";
};

export const usePathname = () => pathname;

export const useRouter = (): Router => {
  return {
    push: () => {},
    replace: () => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
    prefetch: async () => {},
  };
};

export const redirect = (href: string): never => {
  throw new Error(`redirect(${href}) called in Storybook`);
};

export const notFound = (): never => {
  throw new Error("notFound() called in Storybook");
};

export const useSearchParams = () => new URLSearchParams();
