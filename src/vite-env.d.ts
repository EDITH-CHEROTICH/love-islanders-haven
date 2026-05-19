/// <reference types="vite/client" />

declare const process: {
  env: Record<string, string | undefined>;
};

declare namespace NodeJS {
  type Timeout = ReturnType<typeof setTimeout>;
  type Timer = ReturnType<typeof setTimeout>;
}
