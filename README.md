# EJS Precompile

This package is a CLI tool to precompile EJS templates into JavaScript functions.
Additionally, it provides a Node.js API to precompile EJS templates.

## Installation

```bash
npm install -g ejs-precompile
```

or locally in your project

```bash
npm install --save-dev ejs-precompile
```

## CLI Usage

```bash
ejs-precompile [options]
```

Options

| Option                    | Description                                                                                                                                                                                                                                                                                                | Default                   |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| -i, --input <path>        | Input file or directory.                                                                                                                                                                                                                                                                                   | current working directory |
| -o, --output <path>       | Output file or directory. Is has to be directory when input is directory.                                                                                                                                                                                                                                  | current working directory |
| -f, --file <name>         | Output file name template, to be used together when input is directory.<br>Available variables: [name, ext, lang-ext].<br>- [name] - The name of the input file without extension.<br>- [ext] - The extension of the input file.<br>- [lang-ext] - The extension of the output file based on the language. | [name].template[lang-ext] |
| -l, --language <language> | Language of the output file. Default is "javascript".<br>Available languages: [javascript, typescript].                                                                                                                                                                                                    | javascript                |
| --ejs.client              | Returns standalone compiled function.<br>Please check EJS documentation for more details.                                                                                                                                                                                                                  | true                      |
| --ejs.strict              | When set to `true`, generated function is in strict mode.<br>Please check EJS documentation for more details.                                                                                                                                                                                              | true                      |
| -h, --help                | display help for command                                                                                                                                                                                                                                                                                   |                           |

## API Usage

Precompile EJS template from file [precompileFile](#precompilefile)

```javascript
import { precompileFile } from 'ejs-precompile';

const template = await precompileFile({
    inputPath: inputPath,
    outputPath: outputPath,
    compileOptions: {
        strict: true,
        client: true,
    },
});
const renderedTemplate = template.templateFunction();
```

Precompile EJS templates from directory [precompileDirectory](#precompiledirectory)

```javascript
import { precompileDirectory } from 'ejs-precompile';

const templates = await precompileDirectory({
    inputPath: inputPath,
    outputPath: outputPath,
    compileOptions: {
        strict: true,
        client: true,
    },
});

for (const template of templates) {
    const renderedTemplate = template.templateFunction();
    // do something with renderedTemplate
}
```

Precompile EJS template from string [precompileTemplate](#precompiletemplate)

```javascript
import { precompileTemplate } from 'ejs-precompile';

const template = await precompileTemplate({
    templateString: 'Hello, world!',
    compileOptions: {
        strict: true,
        client: true,
    },
});

const renderedTemplate = template.templateFunction();
```

## API

### EjsCompileOptions

See "compile" function from [EJS documentation](https://ejs.co/#docs)

```typescript
export type EjsCompileOptions = Parameters<typeof compile>[1];
````

### precompileTemplate

Options:

```typescript
export type PrecompileTemplateOptions = {
    /**
     * Path to the input file. Optional, works together with `outputPath`.
     */
    inputPath?: string | undefined;

    /**
     * Path to the output file. Optional, works together with `inputPath`.
     */
    outputPath?: string | undefined;

    /**
     * EJS template content.
     */
    inputContent: string;

    /**
     * EJS compile options.
     */
    compileOptions: EjsCompileOptions;

    /**
     * Default values for template variables.
     */
    defaults?: Record<string, unknown>;

    /**
     * Precompile options.
     */
    options?: PrecompileOptions;
};
```

Returns:

```typescript
export type PrecompiledTemplate = {
    /**
     * EJS template content.
     */
    inputContent: string;

    /**
     * Generated JavaScript module content.
     */
    outputContent: string;

    /**
     * Compiled template function.
     */
    templateFunction: ReturnType<typeof compile>;
};
```

### precompileFile

Options:

```typescript
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
```

Returns:

```typescript
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
```

### precompileDirectory

Options:

```typescript
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
     * Output file name template, to be used together when input is directory. Available variables: [name, ext, lang-ext].
     * @default '[name].template[lang-ext]'
     */
    fileNameTemplate?: string;

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
```

Returns:

Array of [PrecompiledFile](#precompilefile)