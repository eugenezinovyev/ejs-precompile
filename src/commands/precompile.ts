import { compile } from 'ejs';
import { mkdir, stat } from 'node:fs/promises';
import { isAbsolute, resolve, extname } from 'node:path';
import resolveOutputFilename, { type ResolveOutputFilenameOptions } from '../precompile/resolve-output-filename.js';
import precompileFile from '../precompile/precompile-file.js';
import precompileDirectory from '../precompile/precompile-directory.js';

export type EjsCompileOptions = Parameters<typeof compile>[1];

export type OutputLanguage = 'javascript' | 'typescript';

export type PrecompileCommandOptions = {
    input: string;
    output: string;
    file?: string;
    language?: OutputLanguage;
};

export default async function precompile(options: PrecompileCommandOptions) {
    const resolvedInputPath = isAbsolute(options.input) ? options.input : resolve(process.cwd(), options.input);
    const resolvedOutputPath = isAbsolute(options.output) ? options.output : resolve(process.cwd(), options.output);

    const outputToDirectory = await isDirectory(resolvedOutputPath);

    if (outputToDirectory) {
        await mkdir(resolvedOutputPath, { recursive: true });
    }

    const compileOptions: EjsCompileOptions = {
        client: true,
        strict: true,
    };
    const precompileOptions: ResolveOutputFilenameOptions = {
        language: options.language ?? 'javascript',
        fileNameTemplate: options.file,
    };

    const inputIsDirectory = await isDirectory(resolvedInputPath);

    if (inputIsDirectory) {
        if (!outputToDirectory) {
            throw new Error('Output path should be a directory when input path is a directory.');
        }

        await precompileDirectory({
            inputPath: resolvedInputPath,
            outputPath: resolvedOutputPath,
            fileNameTemplate: options.file,
            compileOptions,
            options: precompileOptions,
            write: true
        });
    } else {
        const outputPath = outputToDirectory
            ? resolve(resolvedOutputPath, resolveOutputFilename(resolvedInputPath, { language: options.language ?? 'javascript' }))
            : resolvedOutputPath;

        await precompileFile({
            inputPath: resolvedInputPath,
            outputPath: outputPath,
            compileOptions,
            options: precompileOptions,
            write: true
        });
    }
}

async function isDirectory(path: string): Promise<boolean> {
    try {
        const stats = await stat(path);

        return stats.isDirectory();
    } catch (error) {
        // Thrown when path does not exist.

        return extname(path) === '';
    }
}
