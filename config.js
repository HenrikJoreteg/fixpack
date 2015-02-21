module.exports = {
    sortToTop: ['name', 'description', 'version', 'author'],
    required: ['name', 'version'],
    warn: ['description', 'author', 'repository', 'keywords', 'main', 'bugs', 'homepage', 'license'],
    requiredOnPrivate: [],
    warnOnPrivate: ['name', 'version', 'description', 'main'],
    sortedSubItems: ['dependencies', 'devDependencies', 'jshintConfig', 'scripts', 'keywords'],
    quiet: false,
    files: ['package.json']
};
