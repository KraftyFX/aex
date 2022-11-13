# Intro

This repo is set up with two sides, a test harness extension written in CEP and the actual library written in Extendscript (ES). While it's possible to solely work with the ES codebase, we strongly recommend using the AEX Test Harness extension while actively working on AEX to prevent new updates from breaking existing features. It also offers a much nicer developer experience.

If you update the project to support more AE features please add unit tests for them.

# Overview

The AEX library and build scripts are written in [TypeScript](https://typescriptlang.org/)for its rich development experience for ES and is well supported. Both the library and test harness use [nodejs](https://nodejs.org) for package management, and [Gulp](https://gulpjs.com/) for running tasks. Note that each project has its own `package.json`, `gulpfile.ts`, and `tsconfig.json` file. The library can be built independently but when building the test harness, it automatically builds and/or watches the library along with it.

## Library Build Pipeline

The library build process converts all of typescript files to ES and then concatenates them together in a special order, wraps _most_ of it inside inside of an IIFE with a special variable to control what symbols are exported, and appends some [extra logic](./estk/src/cep/) described below to help it talk to the test harness.

## Library Entry Point

[`exports.tsx`](./estk/src/exports.tsx) is a special file that is injected last in the concatenation phase of the build process. It has a special variable `_exports_` which shapes the actual API surface of AEX. This variable is declared in the [`gulpfile.ts`](./estk/gulpfile.ts) when wrapping everything with IIFE.

## Library IPC logic

As mentioned above the test harness is written in CEP and to talk toAEX it needs special logic in both CEP and ETK to marshall data back and forth. The ESTK specific logic for this interop lives in the [`cep folder`](./estk/src/cep/). It has to live outside the IIFE wrapper described above hence why it's appended at the end of the final library jsx.

# Code Organization

## Root

At the root of the project there is `get.tsx`, `create.tsx`, `update.tsx`, and `prescan.tsx`. These correspond to the top level api functions exposed by AEX.

## Common

This folder contains common utility functions used throughout the library.

## Conversion Logic

Each file under these folders is responsible for converting a specific thing within AEX all layer types are in `layer`, item types in `item` etc. Most files have at least 4 functions. `getAexThing`, `createAexThing`, `updateaAexThing` and `prescanAexThing`.

# Getting Started

Clone the repository. Open up VSCode and in the terminal do this:

```bash
$ cd cep
$ yarn start
```

Start After Effects and open the "AEX Test Harness" Extension. This will run all the unit tests.

This also watches the `./estk/` folder for changes, and will re-run the unit tests. You can modify the any of the files within `./cep/test/` to _only_ run specific tests to save time when working on specific features.

# Release

From a terminal at the project root:

```bash
$ cd estk
$ yarn release
$ ls release # Releasable asserts are here
```
