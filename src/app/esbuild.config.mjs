// @ts-ignore
// tslint:disable-next-line: no-wildcard-import
import pkg from 'esbuild-plugin-external-global';
import { builtinModules } from 'module';
// tslint:disable-next-line: typedef naming-convention
const { externalGlobalPlugin } = pkg;

function getConfig() {
    const externals = [
        // Nodejs globals.
        ...builtinModules,
        // Vscode globals.
        'vscode',
        // Electron globals.
        'electron',
    ];
    // tslint:disable-next-line: no-type-assertion
    const custom = {
        amdName: "",
        external: [],
        globalName: {
        },
        minifyParts: [
            "whitespace",
            "identifiers",
            "syntax"
        ],
        platform: "browser"
    }
    externals.push(...custom.external);
    const plugins = [];
    if (custom.globalName)
        plugins.push(externalGlobalPlugin(custom.globalName));
    // tslint:disable-next-line: readonly-keyword
    const minifyOption = {};
    custom.minifyParts.forEach(p => {
        if (p === 'syntax')
            minifyOption.minifySyntax = true;
        if (p === 'identifiers')
            minifyOption.minifyIdentifiers = true;
        if (p === 'whitespace')
            minifyOption.minifyWhitespace = true;
    });
    const amdOption = custom.amdName !== '' ?
        {
            banner: { js: `define("${custom.amdName}", [], function() {` },
            conditions: ['es2020', 'es2015', 'module'],
            footer: { js: 'return __exports;})' },
            format: 'iife',
            globalName: '__exports',
            // This ensures that we prioritize ES2020. RxJS would otherwise use
            // the ESM5 output.
            mainFields: ['es2020', 'es2015', 'module', 'main'],
        } : {};
    return {
        external: externals,
        platform: custom.platform,
        plugins,
        resolveExtensions: ['.mjs', '.js', '.ts'],
        target: 'es2015',
        ...minifyOption,
        ...amdOption,
    };
}
// tslint:disable-next-line: no-default-export
export default getConfig();
