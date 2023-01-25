import {convertToPinyin} from 'tiny-pinyin'
export function sortByLetter<T>(
    arr: readonly T[],
    getString: (item: T) => string,
): Map<string, readonly T[]> {
    const result = new Map<string, T[]>()
    const letterCount = 26
    const aUnicode = 65
    for (let i = 0; i < letterCount; i += 1)
        result.set(String.fromCharCode(aUnicode + i), [])
    arr.forEach(each => {
        const str = getString(each)
        const py = convertToPinyin(str)
        const firstLetter = py[0][0].split('')[0]
        const data = result.get(firstLetter.toUpperCase())
        if (data === undefined)
            return
        data.push(each)
    })
    return result
}
