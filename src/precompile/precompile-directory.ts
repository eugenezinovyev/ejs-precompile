import { readdir, mkdir } from 'node:fs/promises';
import { extname, isAbsolute, resolve } from 'node:path';
import { EjsCompileOptions, PrecompileOptions } from './precompile-template.js';
import precompileFile, { PrecompiledFile } from './precompile-file.js';
import resolveOutputFilename from './resolve-output-filename.js';

export type PrecompileDirectoryOptions = {
    /**
     * Path to the input directory. If relative, it will be resolved relative to the current working directory.
     */
    inputPath: string;

    /**
     * Path to the output directory. If relative, it will be resolved relative to the current working directory.
     */
    outputPath: string;

    /**
     * EJS compile options.
     */
    compileOptions: EjsCompileOptions;

    /**
     * If `true`, the output files will be written to the file system.
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

/**
 * Pre-compiles all EJS templates in the directory into JavaScript modules.
 * When `write` is `true`, the output directory will be created and the generated modules will be written to the file system.
 * @param options Precompile options.
 * @returns Precompiled templates.
 */
export default async function precompileDirectory(options: PrecompileDirectoryOptions): Promise<PrecompiledFile[]> {
    const inputPath = isAbsolute(options.inputPath) ? options.inputPath : resolve(process.cwd(), options.inputPath);
    const outputPath = isAbsolute(options.outputPath) ? options.outputPath : resolve(process.cwd(), options.outputPath);
    const files = await readdir(inputPath);

    if (options.write) {
        await mkdir(outputPath, { recursive: true });
    }

    return await Promise.all(files
        .filter((file) => extname(file) === '.ejs')
        .map(async (filename) => await precompileFile({
            inputPath: resolve(inputPath, filename),
            outputPath: resolve(outputPath, resolveOutputFilename(filename, { language: options.options?.language })),
            compileOptions: options.compileOptions,
            write: options.write,
            defaults: options.defaults,
            options: options.options,
        })));
}
