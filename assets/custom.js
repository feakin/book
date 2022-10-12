/*
Language: Backus–Naur Form
Website: https://en.wikipedia.org/wiki/Backus–Naur_form
Author: Oleg Efimov <efimovov@gmail.com>
*/

/** @type LanguageFn */
function bnf(hljs) {
    return {
        name: 'Backus–Naur Form',
        contains: [
            // Attribute
            {
                className: 'attribute',
                begin: /</,
                end: />/
            },
            // Specific
            {
                begin: /::=/,
                end: /$/,
                contains: [
                    {
                        begin: /</,
                        end: />/
                    },
                    // Common
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE,
                    hljs.APOS_STRING_MODE,
                    hljs.QUOTE_STRING_MODE
                ]
            }
        ]
    };
}

/*
 Language: Groovy
 Author: Guillaume Laforge <glaforge@gmail.com>
 Description: Groovy programming language implementation inspired from Vsevolod's Java mode
 Website: https://groovy-lang.org
 */

let fkl_lang = function (hljs) {
    function variants(variants, obj = {}) {
        obj.variants = variants;
        return obj;
    }

    const KEYWORDS = [
        'ContextMap',
        'Context',
        'Aggregate',
        'Entity',
        'ValueObject',
        'DomainEvent',
        'Struct',
        'DomainLanguage',
        'SourceSet',

        'impl',
        'endpoint',
        'request',
        'response',
        'aggregate',
        'entity',
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
        'HEAD',
        'OPTIONS',

        'SourceSet',
        'authorization',
        'flow',
        'via',
        'receive',
        'send',
        'to',
        'from',
        'layered',
        'layer',
        'dependency',
        'package',

        // unsupported
        'binding',
        'config',
        'description',
        'def',
        'typedef',
        'styles',
        'element',
        'relationship',
    ];

    const IDENT_RE = '[A-Za-z0-9_$]+';
    const COMMENT = variants([
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.COMMENT('/"""/', '/"""/')
    ]);
    const STRING = variants([
            {
                begin: /"""/,
                end: /"""/
            },
            {
                begin: /'''/,
                end: /'''/
            },
            {
                begin: "\\$/",
                end: "/\\$",
                relevance: 10
            },
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE
        ],
        {className: "string"}
    );
    const CLASS_DEFINITION = {
        match: [
            /(ContextMap|Context|Aggregate|Entity|ValueObject|Struct|impl)/,
            /\s+/,
            hljs.UNDERSCORE_IDENT_RE
        ],
        scope: {
            1: "keyword",
            3: "title.class",
        }
    };
    const METHOD_CALL_DECL = {
        match: [
            IDENT_RE,
            /::/,
            IDENT_RE,
        ],
        scope: {
            1: "title.class",
            3: "title.method",
        }
    }

    const KEY_VALUE1 = {
        match: [
            IDENT_RE,
            /:\s+/,
            IDENT_RE
        ],
        scope: {
            3: "title.type",
        }
    }

    const KEY_VALUE2 = {
        match: [
            IDENT_RE,
            /:\s+/
        ],
        scope: {
            1: "title.class",
        }
    }

    return {
        name: 'Feakin',
        contains: [
            COMMENT,
            CLASS_DEFINITION,
            STRING,
            METHOD_CALL_DECL,
            KEY_VALUE1,
            KEY_VALUE2,
        ],
        aliases: ["fkl"],
        keywords: {
            keyword: KEYWORDS
        },
        illegal: /#|<\//
    };
};

document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('pre code').forEach((el) => {
        var langs = hljs.listLanguages();
        if (!langs.includes("feakin")) {
            hljs.registerLanguage("feakin", function () {
                return fkl_lang(hljs);
            });
            hljs.registerLanguage("bnf", function () {
                return bnf(hljs);
            });
            hljs.highlightAll();
        }
    });
});
