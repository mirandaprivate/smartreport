local translation(locale, text) = {
    locale: locale,
    text: text,
};

local localeEnum = {
    EN_US: 1,
    ZH_CN: 2,
    ZH_HK: 3,
};

local isNonEmptyString(str) = (
    if !std.isString(str) then false
    else if std.length(str) > 0 then true else false
);

local isNonEmptyArray(arr) = (
    if !std.isArray(arr) then false
    else if std.length(arr) > 0 then true else false
);

/**
 * The i18n json file is organized with tree struct. It includes two types of
 * node internal node and leaf node. The internal node has `deps` field records
 * subnodes. The leaf node has `pack` field records translations.
 */
{
    /**
     * Create a internal node which must have sub nodes.
     */
    Node(name, deps):: (
        assert isNonEmptyString(name) : 'expect name is a non-empty string';
        assert isNonEmptyArray(deps) :
               'expect deps is a non-empty array of nodes';
        {
            name: name,
            deps: deps,
        }
    ),

    /**
     * Create a translations node which includes a pack records all translations
     * of this node.
     */
    Translations(name, pack):: (
        assert isNonEmptyString(name) : 'expect name is a non-empty string';
        assert isNonEmptyArray(pack) :
               'expect pack is a non-empty array of translations';
        {
            name: name,
            pack: pack,
        }
    ),

    /**
     * Pack translations of all locales. It will be set as the pack field of
     * `Translations`.
     */
    Pack(en_us, zh_cn, zh_hk):: (
        assert isNonEmptyString(en_us) : 'expect en_us is a non-empty string';
        assert isNonEmptyString(zh_cn) : 'expect zh_cn is a non-empty string';
        assert isNonEmptyString(zh_hk) : 'expect zh_hk is a non-empty string';
        [
            translation(localeEnum.EN_US, en_us),
            translation(localeEnum.ZH_CN, zh_cn),
            translation(localeEnum.ZH_HK, zh_hk),
        ]
    ),
}
