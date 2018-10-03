import mem from 'mem'

const MAX_AGE = 1000 * 60

interface RuleOperations {
  valueA: number
  operator: string
  valueB: number
}

interface RuleObject {
  rule: {
    and?: RuleOperations[]
    or?: RuleOperations[]
    [key: string]: RuleOperations[] | undefined
  }
  action: () => any
}

type functionOfOperation = (x1: number, x2: number) => boolean

interface LookUpTable {
  [key: string]: (functionOfOperation) | undefined
}

const comparisonOperators: LookUpTable = {
  '==': (x1, x2) => x1 === x2,
  '>=': (x1, x2) => x1 >= x2,
  '>': (x1, x2) => x1 > x2,
  '<=': (x1, x2) => x1 <= x2,
  '<': (x1, x2) => x1 <= x2,
  '!=': (x1, x2) => x1 !== x2,
}

const executeLogicOperators = (rule: RuleOperations[], boolValue: boolean) =>
  rule.some(({ valueA, valueB, operator }) => {
    const makeOperation = comparisonOperators[operator]
    if (!makeOperation) {
      throw new Error('Operator not exist.')
    }
    const result = makeOperation && makeOperation(valueA, valueB)
    return result === boolValue
  })

const executeRule = mem(
  (ruleSchema: RuleObject) => {
    const { rule, action } = ruleSchema
    const arrayOfResults = Object.keys(rule).map(key => {
      const operationInfo = rule[key]
      if (operationInfo && key === 'and') {
        return !executeLogicOperators(operationInfo, false)
      }
      if (operationInfo && key === 'or') {
        return executeLogicOperators(operationInfo, true)
      }
      throw new Error('No logical operation were found')
    })
    if (action && !arrayOfResults.some(value => !value)) {
      return action()
    }
    return arrayOfResults
  },
  { maxAge: MAX_AGE },
)

export default { executeRule }
