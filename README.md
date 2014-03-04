# fixpack

A package.json file scrubber for the truly insane.

It will re-write your package.json file as follows:

- name first
- description second
- version third
- author fourth
- all other keys in alphabetical order
- dependencies and devDependencies sorted alphabetically
- append operating system appropriate newline at the end of the file

It will warn you if any of these are missing:

- author
- repository
- keywords
- main
- bugs
- homepage
- license

Fix all indenting to 2 spaces.

Oh, and it will tolerate improperly quoted and comma'd JSON thanks to [ALCE](https://npmjs.org/package/alce).

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

## Changelog

- 0.0.2 [diff](https://github.com/HenrikJoreteg/fixpack/compare/v0.0.1...v0.0.2) - EOF newline
- 0.0.1 - initial release

## Credits

This embarrassing display of insanity, type-A-ness, and OCD brought to you by [@HenrikJoreteg](http://twitter.com/henrikjoreteg).

## License

MIT
