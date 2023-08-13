import { basename, extname } from 'node:path';
import { PrecompileOptions } from './precompile-template.js';

export type ResolveOutputFilenameOptions = {
    /**
     * The language of the template. This is used to determine the extension of the output file.
     * @default 'javascript'
     */
    language?: PrecompileOptions['language'];

    /**
     * Output file name template. Available variables: [name, ext, lang-ext].
     * @default '[name].template[lang-ext]'
     */
    fileNameTemplate?: string;
};

const defaultFileNameTemplate = '[name].template[lang-ext]';

type Language = Exclude<ResolveOutputFilenameOptions['language'], undefined>;

const extMap = new Map<Language, string>([
    ['javascript', '.js'],
]);

type Replacer = (filename: string) => string;

const nameReplacer = (inputFilename: string): Replacer => (filename) =>
    filename.replace(/\[name]/g, basename(inputFilename, extname(inputFilename)));
const extReplacer = (inputFilename: string): Replacer => (filename) => filename.replace(/\[ext]/g, extname(inputFilename));
const langExtReplacer = (language: Language): Replacer => (filename) => filename.replace(/\[lang-ext]/g, extMap.get(language)!);

export default function resolveOutputFilename(inputFilename: string, options?: ResolveOutputFilenameOptions): string {
    const language = options?.language ?? 'javascript';
    const replacers: Replacer[] = [
        nameReplacer(inputFilename),
        extReplacer(inputFilename),
        langExtReplacer(language),
    ];

    const fileNameTemplate = options?.fileNameTemplate ?? defaultFileNameTemplate;

    return replacers.reduce((filename, replacer) => replacer(filename), fileNameTemplate);
}
