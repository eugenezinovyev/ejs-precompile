import { program } from 'commander';
import precompileCommand from './commands/precompile.js';

program
    .name('ejs-precompile')
    .description('Precompile EJS templates into JavaScript modules.')
    .option('-i, --input <path>', 'Input file or directory.', process.cwd())
    .option('-o, --output <path>', 'Output file or directory. Is has to be directory when input is directory.', process.cwd())
    .option(
        '-f, --file <name>',
        `Output file name template, to be used together when input is directory.
Available variables: [name, ext, lang-ext].
- [name] - The name of the input file without extension.
- [ext] - The extension of the input file.
- [lang-ext] - The extension of the output file based on the language.
`,
        '[name].template[lang-ext]',
    )
    .option(
        '-l, --language <language>',
        `Language of the output file. Default is "javascript".
Available languages: [javascript, typescript].`,
        'js',
    )
    .allowUnknownOption()
    .action(precompileCommand);

program.parse();
