import { removeUrlParams } from '@/utils/stringUtils/removeUrlParams'

type TestCase = {
    url: string
    paramNames?: string | string[]
    expected: string
}

describe('removeUrlParams', () => {
    const cases: TestCase[] = [
        {
            url: 'https://example.com?code=111&keep=1',
            paramNames: 'code',
            expected: 'https://example.com?keep=1',
        },
        {
            url: 'https://example.com?keep=1',
            paramNames: 'keep',
            expected: 'https://example.com',
        },
        {
            url: 'https://example.com/#/?code=111&keep=1',
            paramNames: 'code',
            expected: 'https://example.com/#/?keep=1',
        },
        {
            url: 'https://example.com/#/?keep=1',
            paramNames: 'keep',
            expected: 'https://example.com/#/',
        },
        {
            url: 'https://example.com?code=111&keep=1#/map?code=222&view=list',
            paramNames: 'code',
            expected: 'https://example.com?keep=1#/map?view=list',
        },
        {
            url: 'https://example.com?a=1&keep=2#a=1',
            paramNames: 'a',
            expected: 'https://example.com?keep=2#a=1',
        },
        {
            url: 'https://example.com/#/?a=1#a=1',
            paramNames: 'a',
            expected: 'https://example.com/#/#a=1',
        },
        {
            url: 'https://example.com?a=1&b=2&keep=3',
            paramNames: ['a', 'b'],
            expected: 'https://example.com?keep=3',
        },
        {
            url: 'https://example.com?name%20key=1&value=name%20key',
            paramNames: ' name%20key ',
            expected: 'https://example.com?value=name%20key',
        },
        {
            url: 'https://example.com?=1&a=1',
            paramNames: '',
            expected: 'https://example.com?a=1',
        },
        {
            url: 'https://example.com?%20=space&keep=1',
            paramNames: '%20',
            expected: 'https://example.com?keep=1',
        },
        {
            url: 'https://example.com?keep=1#/map?view=list',
            paramNames: 'code',
            expected: 'https://example.com?keep=1#/map?view=list',
        },
        {
            url: 'https://example.com?keep=1#/map?view=list',
            expected: 'https://example.com?keep=1#/map?view=list',
        },
    ]

    test.each(cases)('$url -> $expected', ({ url, paramNames, expected }) => {
        expect(removeUrlParams(url, paramNames)).toBe(expected)
    })
})
