import { nanoid } from 'nanoid';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { access } from 'node:fs/promises';
import { precompileFile, PrecompileFileOptions } from '../../src/api.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const inputPath = resolve(__dirname, './templates/template.ejs');
const outputDir = resolve(__dirname, './output');

const templateOptions: Pick<PrecompileFileOptions, 'options' | 'compileOptions'> = {
    options: {
        language: 'javascript',
    },
    compileOptions: {
        strict: true,
        client: true,
    },
};

test('compiles template file without parameters', async () => {
    const outputPath = resolve(outputDir, `${nanoid()}.js`);
    const template = await precompileFile({
        inputPath: inputPath,
        outputPath: outputPath,
        ...templateOptions,
        write: true,
    });

    const output = await template.templateFunction();

    expect(template.inputContent).toBe('Hello, world!');
    expect(template.outputContent).toContain('function anonymous');
    expect(template.templateFunction).toBeInstanceOf(Function);
    await expect(access(outputPath)).resolves.not.toThrow();
    expect(output).toBe('Hello, world!');
});

test('compiles template file without writing when write parameter is false', async () => {
    const outputPath = resolve(outputDir, `${nanoid()}.js`);
    const template = await precompileFile({
        inputPath: inputPath,
        outputPath: outputPath,
        ...templateOptions,
        write: false,
    });

    const output = await template.templateFunction();

    expect(template.inputContent).toBe('Hello, world!');
    expect(template.outputContent).toContain('function anonymous');
    expect(template.templateFunction).toBeInstanceOf(Function);
    await expect(access(outputPath)).rejects.toThrow();
    expect(output).toBe('Hello, world!');
});

test('compiles template file without writing when write parameter is not provided', async () => {
    const outputPath = resolve(outputDir, `${nanoid()}.js`);
    const template = await precompileFile({
        inputPath: inputPath,
        outputPath: outputPath,
        ...templateOptions,
    });

    const output = await template.templateFunction();

    expect(template.inputContent).toBe('Hello, world!');
    expect(template.outputContent).toContain('function anonymous');
    expect(template.templateFunction).toBeInstanceOf(Function);
    await expect(access(outputPath)).rejects.toThrow();
    expect(output).toBe('Hello, world!');
});

test('compiles template file without parameters with relative paths', async () => {
    const originalProcess = process;
    global.process = {
        ...originalProcess,
        cwd: () => __dirname,
    };

    const outputPath = resolve(outputDir, `${nanoid()}.js`);
    const template = await precompileFile({
        inputPath: relative(__dirname, inputPath),
        outputPath: relative(__dirname, outputPath),
        ...templateOptions,
        write: true,
    });

    const output = await template.templateFunction();

    expect(template.inputContent).toBe('Hello, world!');
    expect(template.outputContent).toContain('function anonymous');
    expect(template.templateFunction).toBeInstanceOf(Function);
    await expect(access(outputPath)).resolves.not.toThrow();
    expect(output).toBe('Hello, world!');

    global.process = originalProcess;
});