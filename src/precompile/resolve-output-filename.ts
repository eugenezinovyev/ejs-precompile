import { basename } from 'node:path';
import { PrecompileOptions } from './precompile-template.js';

export type ResolveOutputFilenameOptions = {
    /**
     * The language of the template. This is used to determine the extension of the output file.
     * @default 'javascript'
     */
    language?: PrecompileOptions['language'];
};

const extMap = new Map<ResolveOutputFilenameOptions['language'], string>([
    ['javascript', '.js'],
]);

export default function resolveOutputFilename(input: string, options?: ResolveOutputFilenameOptions): string {
    const language = options?.language ?? 'javascript';
    const ext = extMap.get(language);

    return `${(basename(input, '.ejs'))}.template${ext}`;
}
