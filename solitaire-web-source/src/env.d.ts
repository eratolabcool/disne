/// <reference path="../.astro/types.d.ts" />

type Env = {
  DB: D1Database;
  ROOMS: DurableObjectNamespace;
};

declare namespace App {
  interface Locals {
    runtime: {
      env: Env;
    };
  }
}
