local Location(x, y) = {
    x: x,
    y: y,
};

local Animal(name) = {
    name: name,
};

local Relation(key, value) = { [key]: value };

{
    age: 21,
    asset: 397323986455,
    favorite: ['apple', 'banana', 'pear'],
    height: 1.75,
    key: -397323986455,
    loc: Location(-256, 256),
    name: 'Bob',
    pet: Animal('Poppy'),
    relations: Relation('', 'Parent') + Relation('Cindy', 'Enemy'),
    scores: [
        456165165,
        -1564616848484864,
        88486446554861,
    ],
    type: 1,

}
