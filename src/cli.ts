import { program } from 'commander';
import precompileCommand from './commands/precompile.js';

program
    .name('ejs-precompile')
    .description('Precompile EJS templates into JavaScript modules.')
    .option('-i, --input <path>', 'Input file', process.cwd())
    .option('-o, --output <path>', 'Output file or directory', process.cwd())
    .allowUnknownOption()
    .action(precompileCommand);

program.parse();
