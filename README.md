# fixpack

A package.json file scrubber for the truly insane.

It will re-write your package.json file as follows:

- name first
- description second
- version third
- author fourth
- all other keys in alphabetical order
- dependencies and devDependencies sorted alphabetically
- newline at the end of the file

It will warn you if any of these are missing:

- description
- author
- repository
- keywords
- main
- bugs
- homepage
- license

Maintain current indentation, End of Line, and Final New Line, or set them to your configured value
(see [configuration](#configuration)).

Oh, and it will tolerate improperly quoted and comma'd JSON thanks to [ALCE](https://npmjs.org/package/alce).

Oh, and can do same if you pass it a `bower.json` file or whatnot.

Oh, and it will exit with `0` when already fixed or with `1` otherwise (so combined with `--dryRun` flag it can be used as CI check)

## Usage

1. install it globally

```
npm i -g fixpack
```

2. run it in the same directory as your package.json, that's it.

```
fixpack
```

## What you might do if you're clever

```
npm i cool_package --save && fixpack
```

## Configuration

It's configurable. You can create a `.fixpackrc` file in your project or anywhere up the tree to your `$HOME` directory. Or overwrite options via CLI arguments.

Uses the [rc](https://www.npmjs.com/package/rc) module to do this. So you can pass all these as CLI args too.

The available options and their defaults shown below:

```js

{
    // will put these first in this order if present
    sortToTop: [
        'name',
        'description',
        'version',
        'author'
    ],
    // will error if these not present
    required: [
        'name',
        'version'
    ],
    // will warn if these not present
    warn: [
        'description',
        'author',
        'repository',
        'keywords',
        'main',
        'bugs',
        'homepage',
        'license'
    ],
    // if `private: true` in package.json will use the next two lists instead
    requiredOnPrivate: [],
    warnOnPrivate: ['name', 'version', 'description', 'main'],
    // sub items to sort by default
    sortedSubItems: [
        'dependencies',
        'devDependencies',
        'jshintConfig',
        'scripts',
        'keywords'
    ],
    // if you set quiet to true it won't do output anything to the console
    quiet: false,
    // files to scrub
    files: ['package.json'],
    // Will not fix file, only inform if is fixed
    dryRun: false,
    // Will set all deps to '*'
    // this may be useful because then you can
    // run npm update --save && npm update --save-dev
    // to install latest stable releases of everything.
    wipe: false,
    // Sets the expected indentation. If number, is number of spaces,
    // otherwise can be string to use as indentation (like a tab).
    // if undefined/null (default), indentation is detected from file and preserved.
    indent: null,
    // Sets line endings to be either "LF" or "CRLF"
    // if undefined/null (default), newLine is detected from file and preserved.
    newLine: null,
    // Boolean if there should be an empty line at the end of the file.
    // if undefined/null (default), finalNewLine is detected from file and preserved.
    finalNewLine: null
}

```

## Changelog

- 3.0.6 - Fix `false` removal issue.
- 3.0.5 - Fix coloration of warnings
- 3.0.4 - OS specific EOL
- 3.0.3 - updates to remove NSP warnings in deps.
- 2.3.0 - add `wipe` option that sets all dep versions to `*` for easier bulk updating.
- 2.2.0 - add `optionalDependencies` to auto sorted
- 2.1.0 - switched to [standard](https://github.com/feross/standard) style. Add `peerDependencies` to default sorted keys.
- 2.0.1 - don't error on missing bower file by default.
- 2.0.0 - configurable via `.fixpackrc` file using rc module.
- x.x.x - unknown miscellaneous madness and poor version tracking
- 0.0.2 [diff](https://github.com/HenrikJoreteg/fixpack/compare/v0.0.1...v0.0.2) - EOF newline
- 0.0.1 - initial release

## Credits

This embarrassing display of insanity,
type-A-ness, and OCD brought to you by [@HenrikJoreteg](http://twitter.com/henrikjoreteg).

## License

MIT
