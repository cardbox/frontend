const glob = require('glob');

// prettier-ignore
const types = [
  { value: "feat",     name: "feat",     description: "A new feature" },
  { value: "fix",      name: "fix",      description: "A bug fix" },
  { value: "docs",     name: "docs",     description: "Documentation only changes" },
  { value: "style",    name: "style",    description: "Changes that do not affect the meaning of the code", },
  { value: "chore",    name: "chore",    description: "Changes to the build process or auxiliary tools", },
  { value: "config",   name: "config",   description: "Changes in configuration files. Add new or remove old." },
  { value: "refactor", name: "refactor", description: "A code change that neither fixes a bug nor adds a feature", },
  { value: "perf",     name: "perf",     description: "A code change that improves performance" },
  { value: "test",     name: "test",     description: "Adding missing tests" },
  { value: "revert",   name: "revert",   description: "Revert to a commit" },
  { value: "wip",      name: "wip",      description: "Work in progress" },
]

module.exports = {
  types: types.map(beautify),
  scopes: [].concat(
    'app',
    globMap('src/*/', (path) => path.replace(/src\//, '')).filter(
      exclude(['features', 'ui', 'lib', 'app']),
    ),
    'features',
    globMap('src/features/*/', (path) => path.replace('src/', '')),
    'ui',
    globMap('src/ui/*/', (path) => path.replace(/^src\//, '')),
    'lib',
    globMap('src/lib/*/', (path) => path.replace(/^src\//, '')),
    'pages',
    globMap('src/pages/*/', (path) => path.replace(/^src\//, '')),
  ),
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'revert'],
  askForBreakingChangeFirst: true,
};

function beautify({ value, name, description }) {
  return {
    value,
    name: `${name.padEnd(12, ' ')} ${description}`,
  };
}

/**
 * @param {string} pattern
 * @param {(path: string) => string} fn
 */
function globMap(pattern, fn) {
  return glob
    .sync(pattern)
    .map(fn || ((path) => path))
    .map((path) => path.replace(/\/$/, ''));
}

/**
 * Check `path` to not include substring in `variants`
 * @param {string[]} variants
 * @return {(path: string) => boolean}
 */
function exclude(variants) {
  return (path) => variants.every((variant) => !path.includes(variant));
}

/**
 * Check `path` to include substring of one of `variants`
 * @param {string[]} variants
 * @return {(path: string) => boolean}
 */
function include(variants) {
  return (path) => variants.some((variant) => path.includes(variant));
}
