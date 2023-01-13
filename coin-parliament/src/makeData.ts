import namor from 'namor'

const range: (len: number) => number[] = (len: number) => {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
}

export type Person = { firstName: string; lastName: string; visits: number; progress: number; age: number; status: string }
const newPerson: () => Person = () => {
    const statusChance = Math.random()
    return {
        firstName: namor.generate({words: 1, numbers: 0}),
        lastName: namor.generate({words: 1, numbers: 0}),
        age: Math.floor(Math.random() * 30),
        visits: Math.floor(Math.random() * 100),
        progress: Math.floor(Math.random() * 100),
        status:
            statusChance > 0.66
                ? 'relationship'
                : statusChance > 0.33
                    ? 'complicated'
                    : 'single',
    }
}


export type Data = Person & { subRows?: Data[] }
export default function makeData(...lens: number[]): Data[] {
    const makeDataLevel: (depth?: number) => Data[] = (depth: number = 0) => {
        const len = lens[depth]
        return range(len).map(d => {
            return {
                ...newPerson(),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
            }
        })
    }

    return makeDataLevel()
}