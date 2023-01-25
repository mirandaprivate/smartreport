local i18n = import 'src/app/assets/i18n/i18n.libsonnet';

local foo = i18n.Translations(name='foo', pack=i18n.Pack(
    en_us='foo',
    zh_cn='负',
    zh_hk='負',
));

local bar = i18n.Translations(name='bar', pack=i18n.Pack(
    en_us='bar',
    zh_cn='霸',
    zh_hk='霸',
));

local col = i18n.Node(name='col', deps=[foo, bar]);

local block = i18n.Translations(name='block', pack=i18n.Pack(
    en_us='block',
    zh_cn='块',
    zh_hk='塊',
));

local row = i18n.Node(name='row', deps=[block, col]);

local title = i18n.Node(name='title', deps=[row, col]);

title
