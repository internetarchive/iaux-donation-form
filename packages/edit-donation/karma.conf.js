/* eslint-disable @typescript-eslint/no-require-imports */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        {
          pattern: config.grep ? config.grep : 'dist/**/test/**/*.test.js',
          type: 'module',
        },
      ],

      esm: {
        nodeResolve: true,
        preserveSymlinks: true,
      },

      coverageReporter: {
        dir: 'coverage',
        subdir: '.',
        type: 'lcov',
      },

      // you can overwrite/extend the config further
    }),
  );
  return config;
};
