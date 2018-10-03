import index from './index'

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
  action: () => 'this is a rule',
}

test('function that execute a rule', () => {
  expect(index.executeRule(ruleExample)).toBe('this is a rule')
})
