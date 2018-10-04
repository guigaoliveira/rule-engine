import mem from 'mem'

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
  action: string
}

type functionOfOperation = (x1: number, x2: number) => boolean

interface Operations {
  [key: string]: (functionOfOperation) | undefined
}

interface Actions {
  [key: string]: () => any
}

const comparisonOperators: Operations = {
  '==': (x1, x2) => x1 === x2,
  '>=': (x1, x2) => x1 >= x2,
  '>': (x1, x2) => x1 > x2,
  '<=': (x1, x2) => x1 <= x2,
  '<': (x1, x2) => x1 <= x2,
  '!=': (x1, x2) => x1 !== x2,
}

const makeLogicOperation = (rule: RuleOperations[], boolValue: boolean) =>
  rule.some(({ valueA, valueB, operator }) => {
    const makeOperation = comparisonOperators[operator]
    if (!makeOperation) {
      throw new Error('Comparation operator not exist.')
    }
    return makeOperation(valueA, valueB) === boolValue
  })

class RuleEngine {
  private allActions: Actions
  MAX_AGE = 1000 * 60 * 60

  constructor(theActions = {}) {
    this.allActions = theActions
  }

  processRule(ruleObj: RuleObject) {
    const { rule, action } = ruleObj
    const arrayOfResults = Object.keys(rule).map(key => {
      const conditionInfo = rule[key]
      if (conditionInfo && key === 'and') {
        return !makeLogicOperation(conditionInfo, false)
      }
      if (conditionInfo && key === 'or') {
        return makeLogicOperation(conditionInfo, true)
      }
      throw new Error('No logical operation were found')
    })
    const actionFunction = action && this.allActions[action]
    if (!actionFunction) {
      throw new Error(`Action not found: ${action}`)
    }
    return !arrayOfResults.some(value => !value) && actionFunction()
  }

  executeRule(ruleObj: RuleObject) {
    return mem(obj => this.processRule(obj), { maxAge: this.MAX_AGE })(ruleObj)
  }
}

export default RuleEngine
