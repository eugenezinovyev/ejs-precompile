import { build as esbuild, type BuildOptions, type BuildResult } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

function build(options: BuildOptions): Promise<BuildResult> {
    return esbuild({
        bundle: true,
        minify: true,
        platform: 'node',
        target: 'node16',
        plugins: [nodeExternalsPlugin()],
        ...options,
    });
}

await Promise.all([
    build({ entryPoints: ['src/cli.ts'], format: 'esm', outdir: 'dist', banner: { js: '#!/usr/bin/env node' } }),
    build({ entryPoints: ['src/api.ts'], format: 'esm', outfile: 'dist/api.mjs' }),
    build({ entryPoints: ['src/api.ts'], format: 'cjs', outfile: 'dist/api.cjs' }),
]);
