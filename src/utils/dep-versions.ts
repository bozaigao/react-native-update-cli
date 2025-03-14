const currentPackage = require(`${process.cwd()}/package.json`);

const depKeys = Object.keys(currentPackage.dependencies);
const devDepKeys = Object.keys(currentPackage.devDependencies);
const dedupedDeps = [...new Set([...depKeys, ...devDepKeys])];

const _depVersions: Record<string, string> = {};

for (const dep of dedupedDeps) {
  try {
    const packageJsonPath = require.resolve(`${dep}/package.json`, {
      paths: [process.cwd()],
    });
    const version = require(packageJsonPath).version;
    _depVersions[dep] = version;
  } catch (e) {}
}

export const depVersions = Object.keys(_depVersions)
  .sort() // Sort the keys alphabetically
  .reduce((obj, key) => {
    obj[key] = _depVersions[key]; // Rebuild the object with sorted keys
    return obj;
  }, {} as Record<string, string>);

// console.log({ depVersions });
