<p align="center">
  <a href="https://www.vexipui.com/" target="_blank" rel="noopener noreferrer">
    <img src="./templates/vite-ts/public/vexip-ui.svg" style="width: 180px;" />
  </a>
</p>

<h1 align="center">Create Vexip</h1>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/vexip-ui/create-vexip" />
</p>

## Scaffolding Your First Vexip Project

With npm:

```sh
npm create vexip@latest
```

With yarn:

```sh
yarn create vexip
```

With pnpm:

```sh
pnpm create vexip
```

Then follow the prompts.

You can also directly specify the project name and the template you want to use via additional command line options:

```sh
# npm 6.x
npm create vexip@latest my-app --template vite-ts

# npm 7+, extra double-dash is needed:
npm create vexip@latest my-app -- --template vite-ts

# yarn
yarn create vexip my-app --template vite-ts

# pnpm
pnpm create vexip my-app --template vite-ts
```

> You can use `.` for the project name to scaffold in the current directory.

Currently supported base templates:

- `vite-ts`
- `nuxt`

Currently supported extra templates:

- `eslint`
- `prettier`
- `stylelint`
- `router`

## Command Line Options

| Param          | Abbr | Type                            | Description                                                                                        |
| -------------- | ---- | ------------------------------- | -------------------------------------------------------------------------------------------------- |
| `--template`   | `-t` | `string`                        | Specify a base template                                                                            |
| `--extra`      | `-e` | `boolean \| string \| string[]` | Specify some extra templates, all extra templates will be used if not specify names                |
| `--commitlint` | `-c` | `boolean`                       | Whether using commitlint with husky and lint-staged, it requires at least one lint tool to be used |
| `--update`     | `-u` | `boolean`                       | Whether using [taze](https://github.com/antfu/taze) to update dependencies in package.json         |
