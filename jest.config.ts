import type { JestConfigWithTsJest } from 'ts-jest';

type CoveragReporters = Exclude<JestConfigWithTsJest['coverageReporters'], undefined>;
type CoverageReporterName = CoveragReporters[number];

const jestConfig: JestConfigWithTsJest = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    collectCoverage: true,
    coverageProvider: 'v8',
    collectCoverageFrom: [
        'src/**/*.ts',
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        'src/cli.ts', // I'm not going to test commander.js they are already tested by commander.js team
    ],
    coverageReporters: [
        '@lcov-viewer/istanbul-report' as CoverageReporterName,
        'html'
    ],
};

export default jestConfig;
