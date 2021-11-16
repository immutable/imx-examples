# Contributing to Immutable X Examples

Welcome to Immutable X! This repository is designed to empower developers to integrate with Immutable X quickly and effectively.

This contributing guide will help you get started with the repository and start contributing to the code.

---

## Table Of Contents

* [What should you contribute?](#what-should-you-contribute)
* [Prerequisites](#prerequisites)
* [Bootstrap](#bootstrap)
* [Linting](#linting)
* [Building](#building)
* [Publish your changes](#publish-your-changes)
  * [Commit Conventions](#commit-conventions)
  * [Make a Pull Request](#make-a-pull-request)
  * [Merge your Pull Request](#merge-your-pull-request)

---

## What should you contribute?

You are welcome to contribute any fix or feature you can think of!. If you would like ideas, however, please refer to `TODO.md`.

## Prerequisites

The following dependencies are required _before_ running the bootstrap procedure outlined below.

* Node.js >= 12
* NPM >= 7

## Bootstrap

To get started, clone this repo and install all dependencies.

```sh
clone git@github.com:immutable/imx-examples.git
cd imx-examples
npm install
```

## Linting

The linting procedure checks the entire package source code using (in order):
* typescript typecheck
* eslint

```sh
npm run lint:eslint:fix
```


## Building

The following will build the package for production to the `dist` folder using [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html):

```sh
npm run build
```

## Publish your changes

After you have verified your changes locally, you are ready to push your changes to the `remote` repo!

### Commit Conventions

Please follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) guidelines when creating commits.

### Make a Pull Request

The first step is to create a branch that will be the basis of a pull request. It is recommended you start your branch from an up-to-date version of `main`. However, you can run the following from any branch you may have been developing on:

```sh
git checkout -b feat/magic
git pull --rebase origin main
git push origin feat/magic
```

Your branches should be named in the following manner:
* `feat/xyz` for new features
* `fix/xyz` for bug fixes

After pushing your branch, visit https://github.com/immutable/imx-examples and use the GitHub UI to create a pull request.

### Pull Request Review

The maintainers of this repo will attempt to review your pull request when they are available. 
