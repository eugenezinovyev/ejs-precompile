import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { precompileTemplate, PrecompileTemplateOptions } from '../../src/api.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const inputPath = resolve(__dirname, './templates/template.ejs');
const outputDir = resolve(__dirname, './output');

const templateOptions: Pick<PrecompileTemplateOptions, 'options' | 'compileOptions'> = {
    compileOptions: {
        strict: true,
        client: true,
    },
};

test('compiles template content with relative path to source included', async () => {
    const template = await precompileTemplate({
        ...templateOptions,
        inputPath: inputPath,
        outputPath: outputDir,
        inputContent: 'Hello, world!',
    });

    expect(template.outputContent).toContain(relative(outputDir, inputPath));
});

test('compiles template content without relative path to source included', async () => {
    const template = await precompileTemplate({
        ...templateOptions,
        inputContent: 'Hello, world!',
    });

    expect(template.outputContent).not.toContain(relative(outputDir, inputPath));
});

test('compiles template content without parameters to javascript by default', async () => {
    const template = await precompileTemplate({
        ...templateOptions,
        inputPath: inputPath,
        outputPath: outputDir,
        inputContent: 'Hello, world!',
    });

    const output = await template.templateFunction();

    expect(template.inputContent).toBe('Hello, world!');
    expect(template.outputContent).toContain('function anonymous');
    expect(template.templateFunction).toBeInstanceOf(Function);
    expect(output).toBe('Hello, world!');
});

test('compiles template content without parameters to javascript without language specified', async () => {
    const template = await precompileTemplate({
        ...templateOptions,
        inputPath: inputPath,
        outputPath: outputDir,
        inputContent: 'Hello, world!',
        options: {},
    });

    const output = await template.templateFunction();

    expect(template.inputContent).toBe('Hello, world!');
    expect(template.outputContent).toContain('function anonymous');
    expect(template.templateFunction).toBeInstanceOf(Function);
    expect(output).toBe('Hello, world!');
});

test('compiles template content without parameters', async () => {
    const template = await precompileTemplate({
        ...templateOptions,
        options: {
            language: 'javascript',
        },
        inputPath: inputPath,
        outputPath: outputDir,
        inputContent: 'Hello, world!',
    });

    const output = await template.templateFunction();

    expect(template.inputContent).toBe('Hello, world!');
    expect(template.outputContent).toContain('function anonymous');
    expect(template.templateFunction).toBeInstanceOf(Function);
    expect(output).toBe('Hello, world!');
});
