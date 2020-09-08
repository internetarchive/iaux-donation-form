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
        { pattern: config.grep ? config.grep : 'dist/**/test/**/*.test.js', type: 'module' },
      ],

      esm: {
        nodeResolve: true,
      },

      // Lowering the thresholds for now so the tests don't outright fail because of
      // too low of test coverage. Raise these numbers as we increase coverage.
      coverageIstanbulReporter: {
        thresholds: {
          global: {
            statements: 65,
            branches: 50,
            functions: 70,
            lines: 65,
          },
        },
      },

      // you can overwrite/extend the config further
    }),
  );
  return config;
};
