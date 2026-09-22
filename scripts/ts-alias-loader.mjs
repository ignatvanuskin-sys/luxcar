/**
 * Lets plain `node` run the app's TypeScript modules: resolves the `@/...` path
 * alias and appends the `.ts` extension that bundlers infer but node ESM requires.
 *
 * Used by `scripts/booking-store.test.mjs` via `scripts/register-loader.mjs`.
 */
export async function resolve(specifier, context, nextResolve) {
  const normalized = specifier.startsWith("@/")
    ? new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href
    : specifier;

  try {
    return await nextResolve(normalized, context);
  } catch (error) {
    const extensionless = !/\.[a-z]+$/.test(normalized);
    if (error?.code === "ERR_MODULE_NOT_FOUND" && extensionless) {
      return nextResolve(`${normalized}.ts`, context);
    }
    throw error;
  }
}
