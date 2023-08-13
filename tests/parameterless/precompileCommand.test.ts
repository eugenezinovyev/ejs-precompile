import { nanoid } from 'nanoid';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { access } from 'node:fs/promises';
import precompileCommand from '../../src/commands/precompile.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const inputPath = resolve(__dirname, './template.ejs');
const outputDir = resolve(__dirname, './templates');

test('compiles template file without parameters with relative paths', async () => {
    const originalProcess = process;
    global.process = {
        ...originalProcess,
        cwd: () => __dirname,
    };

    await expect(precompileCommand({
        input: relative(__dirname, inputPath),
        output: relative(__dirname, outputDir),
    })).resolves.not.toThrow();

    await expect(access(resolve(outputDir, 'template.template.js'))).resolves.not.toThrow();

    global.process = originalProcess;
});

test('compiles template file without parameters to output directory', async () => {
    await expect(precompileCommand({
        input: inputPath,
        output: outputDir,
    })).resolves.not.toThrow();

    await expect(access(resolve(outputDir, 'template.template.js'))).resolves.not.toThrow();
});

test('compiles template file without parameters to output file', async () => {
    const outputPath = resolve(outputDir, `${nanoid()}.js`);
    await expect(precompileCommand({
        input: inputPath,
        output: outputPath,
    })).resolves.not.toThrow();

    await expect(access(outputPath)).resolves.not.toThrow();
});
