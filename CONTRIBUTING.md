# Intro

This repo is set up with two sides, a CEP extension and the ESTK codebase.

The CEP extension is used for unit testing AEX itself, to help ensure that updates and tweaks to the Extendscript codebase function as expected.

While it's possible to solely work with the Extendscript side of things, we strongly recommend using the AEX Test Harness extension while actively working on AEX to prevent new updates from breaking existing features, etc.

While developing, please add unit tests for new features!

# Setup

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
