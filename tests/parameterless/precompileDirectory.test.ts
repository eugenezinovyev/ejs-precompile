import { nanoid } from 'nanoid';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { access } from 'node:fs/promises';
import { precompileDirectory, PrecompileDirectoryOptions } from '../../src/api.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const inputPath = resolve(__dirname, './templates');
const outputDir = resolve(__dirname, './directory-output');

const templateOptions: Pick<PrecompileDirectoryOptions, 'options' | 'compileOptions'> = {
    options: {
        language: 'javascript',
    },
    compileOptions: {
        strict: true,
        client: true,
    },
};

test('compiles template file without parameters', async () => {
    const outputPath = resolve(outputDir, nanoid());
    const templates = await precompileDirectory({
        inputPath: inputPath,
        outputPath: outputPath,
        ...templateOptions,
        write: true,
    });

    const template = templates[0];
    const output = await template.templateFunction();

    expect(template.inputContent).toBe('Hello, world!');
    expect(template.outputContent).toContain('function anonymous');
    expect(template.templateFunction).toBeInstanceOf(Function);
    await expect(access(template.outputPath)).resolves.not.toThrow();
    expect(output).toBe('Hello, world!');
});

test('compiles template file without parameters with relative paths', async () => {
    const originalProcess = process;
    global.process = {
        ...originalProcess,
        cwd: () => __dirname,
    };

    const outputPath = resolve(outputDir, nanoid());
    const templates = await precompileDirectory({
        inputPath: relative(__dirname, inputPath),
        outputPath: relative(__dirname, outputPath),
        ...templateOptions,
        write: true,
    });

    const template = templates[0];
    const output = await template.templateFunction();

    expect(template.inputContent).toBe('Hello, world!');
    expect(template.outputContent).toContain('function anonymous');
    expect(template.templateFunction).toBeInstanceOf(Function);
    await expect(access(template.outputPath)).resolves.not.toThrow();
    expect(output).toBe('Hello, world!');

    global.process = originalProcess;
});
