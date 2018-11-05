import RuleEngine from './RuleEngine'

const rule1 = [
  {
    when: {
      all: [
        { fact: '$device1', operator: '==', value: 1 },
        { fact: '$device2', operator: '==', value: 2 },
        {
          any: [
            { fact: '$device3', operator: '!=', value: 3 },
            { fact: '$device4', operator: '!=', value: 4 },
          ],
        },
      ],
    },
    actions: ['print'],
  },
]

const rule2 = [
  {
    when: {
      all: [
        { fact: '$device1', operator: '==', value: 1 },
        { fact: '$device2', operator: '==', value: 2 },
        {
          not: {
            any: [
              { fact: '$device3', operator: '!=', value: 3 },
              { fact: '$device4', operator: '!=', value: 4 },
            ],
          },
        },
      ],
    },
    actions: ['print'],
  },
]

interface Facts {
  [key: string]: any
}

const facts = (factName: string) => {
  const objectValue: Facts = {
    $device1: 1,
    $device2: 2,
    $device3: 3,
    $device4: 4,
  }
  return objectValue[factName]
}

const operations = {
  '==': (a: number, b: number) => a === b,
  '>': (a: number, b: number) => a > b,
  '>=': (a: number, b: number) => a >= b,
  '<': (a: number, b: number) => a < b,
  '<=': (a: number, b: number) => a <= b,
  '!=': (a: number, b: number) => a !== b,
}

const actions = {
  print: () => 'this is a message',
}

const ruleEngine = new RuleEngine(facts, operations, actions)

test('it is expected that the actions will not be fired', () => {
  expect(ruleEngine.execRule(rule1)).toBe(false)
})

test('it is expected that the actions will be fired', () => {
  expect(ruleEngine.execRule(rule2)).toBe(true)
})
