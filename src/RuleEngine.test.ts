import RuleEngine from './RuleEngine'

const actions = {
  message: () => 'this is a message',
}

const ruleExample = {
  rule: {
    and: [
      {
        valueA: 2,
        operator: '==',
        valueB: 2,
      },
      {
        valueA: 2,
        operator: '==',
        valueB: 2,
      },
    ],
    or: [
      {
        valueA: 3,
        operator: '==',
        valueB: 5,
      },
      {
        valueA: 3,
        operator: '!=',
        valueB: 5,
      },
    ],
  },
  action: 'message',
}

test('function that execute a rule', () => {
  expect(new RuleEngine(actions).executeRule(ruleExample)).toBe(
    'this is a message',
  )
})
