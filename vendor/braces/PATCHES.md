# Vendored patch: braces 3.0.4

This directory is a locally patched copy of [`braces@3.0.3`](https://www.npmjs.com/package/braces).

## Why it exists

`braces` through 3.0.3 is affected by **CVE-2026-93687 / GHSA-vfj7-8cjw-p6xm**
(high severity): its recursive AST walkers had no depth guards, so a deeply
nested brace or paren pattern — one that stays under the 10,000-character
`MAX_LENGTH` limit — could exhaust the call stack and kill the Node.js process
with an uncaught `RangeError`.

Upstream has **no patched release** (the advisory lists _Patched versions: None_;
3.0.3 is the newest published version), so `npm audit fix` cannot resolve it.

`braces` is a transitive dependency of `fast-glob` → `micromatch`, which reaches
this project via `eslint-config-next` and `shadcn`. Both are devDependencies, so
the vulnerable code never ships, but the audit still reports it.

## What was changed

| File               | Change                                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/constants.js` | Added `MAX_DEPTH: 1000`.                                                                                                                  |
| `lib/parse.js`     | Throws `SyntaxError` when brace/paren nesting reaches `MAX_DEPTH`. This is the choke point — every pattern is parsed before it is walked. |
| `lib/compile.js`   | `walk` tracks recursion depth and throws `RangeError` past `MAX_DEPTH`.                                                                   |
| `lib/expand.js`    | `walk` and `append` track recursion depth and throw `RangeError` past `MAX_DEPTH`.                                                        |
| `lib/stringify.js` | `stringify` tracks recursion depth and throws `RangeError` past `MAX_DEPTH`.                                                              |
| `package.json`     | Version bumped to `3.0.4` so the patched copy falls outside the advisory's affected range (`<= 3.0.3`) and `npm audit` reports clean.     |

The limit is configurable per call via `options.maxDepth`, mirroring the existing
`options.maxLength`, and only affects inputs that were previously guaranteed to
crash the process.

## How it is wired in

`package.json` (repository root):

```json
"overrides": {
  "braces": "file:./vendor/braces"
}
```

### Why `fill-range` is a direct devDependency

npm resolves a `file:` override to a **link** (on Windows, a junction at
`node_modules/micromatch/node_modules/braces` pointing at `vendor/braces`) and,
because links are assumed to manage their own dependencies, it does **not**
install the linked package's dependencies. `braces` declares `fill-range`, so
without help the link would be broken at runtime (`Cannot find module
'fill-range'`).

The junction resolves to `vendor/braces` _inside the project root_, so Node's
upward module lookup reaches the project's own `node_modules`. Declaring
`fill-range` as a direct devDependency places it there and satisfies the
vendored package without vendoring `fill-range` as well.

Do not remove `fill-range` from `devDependencies` while this override exists.

## Upstream behaviour is preserved

The guards change nothing for patterns that previously worked: real-world brace
patterns nest a handful of levels deep, far below the 1,000-level default. The
recursion signatures were extended with a trailing `depth` argument only, and
`stringify` still forwards an empty `parent` exactly as 3.0.3 did, so output is
byte-for-byte identical.

## Maintenance

**Remove this directory and the `overrides` entry as soon as `braces` ships a
first-party fix.** To verify the patch is still needed:

```sh
npm view braces version          # if > 3.0.3, upstream fixed it locally-upstream
npm audit                        # if clean without the override, drop the vendor dir
```

To re-sync with a future upstream release, diff this copy against the published
tarball:

```sh
npm pack braces@<version>
tar -xzf braces-<version>.tgz
diff -ru package vendor/braces
```

## Verification

```sh
node -e "require('braces')('{a,'.repeat(5000) + '}'.repeat(5000))"
```

Before the patch this crashes with a stack overflow; after it the call throws a
catchable `SyntaxError` about nesting depth.
