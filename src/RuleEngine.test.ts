import RuleEngine from './RuleEngine'

const rule = [
  {
    when: {
      all: [
        { fact: '$device1', operator: '==', value: 1 },
        { fact: '$device2', operator: '==', value: 2 },
        {
          any: [
            { fact: '$device3', operator: '>=', value: 3 },
            { fact: '$device4', operator: '==', value: 2 },
          ],
        },
      ],
    },
    actions: ['print'],
  },
]

const facts = {
  $device1: 1,
  $device2: 2,
  $device3: 3,
  $device4: 4,
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

test('function that execute a rule', () => {
  expect(new RuleEngine(facts, operations, actions).execRule(rule)).toBe(true)
})
