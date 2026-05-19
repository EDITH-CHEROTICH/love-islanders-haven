/// <reference types="vite/client" />

declare global {
  const process: {
    env: Record<string, string | undefined>;
  };

  namespace NodeJS {
    type Timeout = ReturnType<typeof setTimeout>;
    type Timer = ReturnType<typeof setTimeout>;
  }
}

export {};
