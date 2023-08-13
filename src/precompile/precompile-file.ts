import { isAbsolute, resolve, dirname } from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import precompileTemplate, { EjsCompileOptions, PrecompiledTemplate, PrecompileOptions } from './precompile-template.js';

export type PrecompileFileOptions = {
    /**
     * Path to the input file. If relative, it will be resolved relative to the current working directory.
     */
    inputPath: string;

    /**
     * Path to the output file. If relative, it will be resolved relative to the current working directory.
     */
    outputPath: string;

    /**
     * EJS compile options.
     */
    compileOptions: EjsCompileOptions;

    /**
     * If `true`, the output file will be written to the file system.
     */
    write?: boolean;

    /**
     * Default values for template variables.
     */
    defaults?: Record<string, unknown>;

    /**
     * Precompile options.
     */
    options?: PrecompileOptions;
};

export type PrecompiledFile = PrecompiledTemplate & {
    /**
     * Absolute path to the input file.
     */
    inputPath: string;

    /**
     * Absolute path to the output file.
     */
    outputPath: string;
};

/**
 * Pre-compiles EJS template into JavaScript module.
 * When `write` is `true`, the generated module will be written to the file system.
 * @param options Precompile options.
 * @returns Precompiled template.
 */
export default async function precompileFile(options: PrecompileFileOptions): Promise<PrecompiledFile> {
    const inputPath = isAbsolute(options.inputPath) ? options.inputPath : resolve(process.cwd(), options.inputPath);
    const outputPath = isAbsolute(options.outputPath) ? options.outputPath : resolve(process.cwd(), options.outputPath);

    const inputContent = await readFile(inputPath, 'utf-8');
    const precompiledTemplate = await precompileTemplate({
        inputPath,
        outputPath,
        inputContent,
        compileOptions: options.compileOptions,
        defaults: options.defaults,
        options: options.options,
    });

    if (options.write ?? false) {
        await mkdir(dirname(outputPath), { recursive: true });
        await writeFile(outputPath, precompiledTemplate.outputContent, 'utf-8');
    }

    return { ...precompiledTemplate, inputPath, outputPath };
}
