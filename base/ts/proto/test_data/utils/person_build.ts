import {readFileSync} from 'fs'
import Long from 'long'
import {join} from 'path'

import {
    LocationBuilder,
    Person,
    PersonBuilder,
    _AddressField,
    _EmptyField,
} from './person_mock'
import {AnimalBuilder, E_AGE, E_NUMBER, E_TYPE, TypeBuilder} from './pet_mock'

interface PersonMock {
    readonly name: string
    readonly age: number
    readonly height: number
    readonly asset: Long
    readonly key: Long
    readonly scores: readonly Long[]
    readonly type: number
    readonly loc: LocationMock
    readonly pet: AnimalMock
    readonly favorite: readonly string[]
    readonly relations: Map<string, string>

}

interface LocationMock {
    readonly x: number
    readonly y: number
}

interface AnimalMock {
    readonly name: string
}

export function buildPerson(): Person {
    const content = readFileSync(join(__dirname, '../content.json'), 'utf-8')
    const mock = JSON.parse(content) as PersonMock
    const asset = Long.fromValue(mock.asset)
    asset.unsigned = true
    const location = new LocationBuilder().x(mock.loc.x).y(mock.loc.y).build()
    const pet = new AnimalBuilder().name(mock.pet.name).build()
    const person = new PersonBuilder()
        .name(mock.name)
        .age(mock.age)
        .height(mock.height)
        .asset(asset)
        .favorite(mock.favorite)
        .type(mock.type)
        .key(Long.fromValue(mock.key))
        .pet(pet)
        .scores(mock.scores.map((v: Long): Long => Long.fromValue(v)))
        .loc(location)
        .relations(setMap(mock.relations))
        .address('Shenzhen', _AddressField.HOME)
        .empty('', _EmptyField.TEXT)
        .build()
    if (person.pet !== undefined) {
        // tslint:disable-next-line: no-magic-numbers
        person.pet._ext.setExtension(E_AGE, 2)
        // tslint:disable-next-line: no-magic-numbers
        person.pet._ext.setExtension(E_NUMBER, [1, 2, 3])
        person.pet._ext.setExtension(
            E_TYPE,
            new TypeBuilder().name('dog').build(),
        )
    }
    return person
}

function setMap(obj: {}): Map<string, string> {
    const result = new Map<string, string>()
    const keys = Reflect.ownKeys(obj)
    keys.forEach((v: string | number | symbol): void => {
        result.set(v as string, Reflect.get(obj, v))
    })
    return result
}
