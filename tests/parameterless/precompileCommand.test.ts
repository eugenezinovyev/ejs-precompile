import { nanoid } from 'nanoid';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { access } from 'node:fs/promises';
import precompileCommand, { type PrecompileCommandOptions } from '../../src/commands/precompile.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const inputPath = resolve(__dirname, './templates/template.ejs');
const outputDir = resolve(__dirname, './output');

const defaultOptions: Pick<PrecompileCommandOptions, 'ejs.strict' | 'ejs.client'> = {
    'ejs.client': true,
    'ejs.strict': true,
};

test('compiles template file without parameters with relative paths', async () => {
    const originalProcess = process;
    global.process = {
        ...originalProcess,
        cwd: () => __dirname,
    };

    await expect(precompileCommand({
        ...defaultOptions,
        input: relative(__dirname, inputPath),
        output: relative(__dirname, outputDir),
    })).resolves.not.toThrow();

    await expect(access(resolve(outputDir, 'template.template.js'))).resolves.not.toThrow();

    global.process = originalProcess;
});

test('compiles template file without parameters to output directory', async () => {
    await expect(precompileCommand({
        ...defaultOptions,
        input: inputPath,
        output: outputDir,
    })).resolves.not.toThrow();

    await expect(access(resolve(outputDir, 'template.template.js'))).resolves.not.toThrow();
});

test('compiles template file without parameters to output file', async () => {
    const outputPath = resolve(outputDir, `${nanoid()}.js`);
    await expect(precompileCommand({
        ...defaultOptions,
        input: inputPath,
        output: outputPath,
    })).resolves.not.toThrow();

    await expect(access(outputPath)).resolves.not.toThrow();
});

test('compiles templates directory without parameters', async () => {
    const outputPath = resolve(__dirname, 'directory-output', nanoid());
    await expect(precompileCommand({
        ...defaultOptions,
        input: resolve(__dirname, './templates'),
        output: outputPath,
    })).resolves.not.toThrow();

    await expect(access(resolve(outputPath, 'template.template.js'))).resolves.not.toThrow();
});


test('throws error when output path is not a directory', async () => {
    const outputPath = resolve(__dirname, 'directory-output', nanoid());
    await expect(precompileCommand({
        ...defaultOptions,
        input: resolve(__dirname, './templates'),
        output: resolve(outputPath, './templates/template.js'),
    })).rejects.toThrow();
});
