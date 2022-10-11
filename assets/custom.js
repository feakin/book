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

    const TYPES = [

    ];

    const KEYWORDS = [
        'ContextMap',
        'Context',
        'Aggregate',
        'Entity',
        'ValueObject',
        'Struct',
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
    ];

    const regex = hljs.regex;
    const IDENT_RE = '[A-Za-z0-9_$]+';
    const COMMENT = variants([
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.COMMENT(
            '/\\*\\*',
            '\\*/',
            {
                relevance: 0,
                contains: [
                    {
                        // eat up @'s in emails to prevent them to be recognized as doctags
                        begin: /\w+@/,
                        relevance: 0
                    },
                    {
                        className: 'doctag',
                        begin: '@[A-Za-z]+'
                    }
                ]
            }
        )
    ]);
    const REGEXP = {
        className: 'regexp',
        begin: /~?\/[^\/\n]+\//,
        contains: [ hljs.BACKSLASH_ESCAPE ]
    };
    const NUMBER = variants([
        hljs.BINARY_NUMBER_MODE,
        hljs.C_NUMBER_MODE
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
        { className: "string" }
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

    return {
        name: 'Feakin',
        contains: [
            COMMENT,
            CLASS_DEFINITION,
        ],
        aliases: ["fkl"],
        keywords: {
            "variable.language": 'this super',
            literal: 'true false null',
            type: TYPES,
            keyword: KEYWORDS
        },
        illegal: /#|<\//
    };
};

var langs = hljs.listLanguages();
if (!langs.includes("feakin")) {
    hljs.registerLanguage("feakin", fkl_lang);
}
