﻿import { program } from 'commander';
import precompileCommand from './commands/precompile.js';

function ejsOption(description: string): string {
    return `${description}
Please check EJS documentation for more details.`;
}

program
    .name('ejs-precompile')
    .description('Precompile EJS templates into JavaScript modules.')
    .option('-i, --input <path>', 'Input file or directory.', 'current working directory')
    .option('-o, --output <path>', 'Output file or directory. Is has to be directory when input is directory.', 'current working directory')
    .option(
        '-f, --file <name>',
        `Output file name template, to be used together when input is directory.
Available variables: [name, ext, lang-ext].
- [name] - The name of the input file without extension.
- [ext] - The extension of the input file.
- [lang-ext] - The extension of the output file based on the language.`,
        '[name].template[lang-ext]',
    )
    .option(
        '-l, --language <language>',
        `Language of the output file. Default is "javascript".
Available languages: [javascript, typescript].`,
        'javascript',
    )
    .option('--ejs.client', ejsOption('Returns standalone compiled function.'), true)
    .option('--ejs.strict', ejsOption('When set to `true`, generated function is in strict mode.'), true)
    .allowUnknownOption()
    .action(precompileCommand);

program.parse();
