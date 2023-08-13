import { resolveOutputFilename } from '../src/api.js';

test('resolves output filename', () => {
    const output = resolveOutputFilename('template.ejs');
    expect(output).toBe('template.template.js');
});

test('resolves output filename with language', () => {
    const output = resolveOutputFilename('template.ejs', {
        language: 'javascript',
    });
    expect(output).toBe('template.template.js');
});
