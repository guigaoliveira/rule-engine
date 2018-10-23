// import mem from 'mem'

interface Facts {
  [key: string]: number | undefined
}

interface Operations {
  [key: string]: (a: any, b: any) => boolean
}

interface Actions {
  [key: string]: () => any
}

interface RuleOperations {
  fact: string | number
  operator: string
  value: number
  [key: string]: string | number | undefined
}

interface WhenObject {
  all?: Conditions
  any?: Conditions
  not?: RuleOperations | WhenObject
  [key: string]: RuleOperations | WhenObject | Conditions | undefined
}

type Conditions = (RuleOperations | WhenObject)[]

type logicValues = boolean | RuleOperations

interface RuleFormat {
  when: WhenObject
  actions: string[]
  [key: string]: string[] | WhenObject | undefined
}

type logicalMethods = (arr: RuleOperations[]) => boolean

interface LogicalOperators {
  all: logicalMethods
  any: logicalMethods
  not: logicalMethods
  [key: string]: logicalMethods
}

class RuleEngine {
  facts: Facts
  operations: Operations
  actions: Actions

  constructor(facts: Facts, operations: Operations, actions: Actions) {
    this.facts = facts
    this.operations = operations
    this.actions = actions
  }

  execLogicalOperations(logicOperation: string): logicalMethods {
    const logicalOperators: LogicalOperators = {
      all: arr => !arr.some(item => !this.execConditions(item)),
      any: arr => arr.some(item => !!this.execConditions(item)),
      not: arr => !this.execConditions(arr),
    }
    return logicalOperators[logicOperation]
  }

  execConditions(input: any): logicValues | number | boolean {
    // console.log(input)
    if (!this.facts || !this.operations || !this.actions) {
      return -1 // err
    }

    const logicOperation = input.all
      ? 'all'
      : input.any
        ? 'any'
        : input.not
          ? 'not'
          : false

    if (logicOperation) {
      const conditions = input[logicOperation]
      return this.execLogicalOperations(logicOperation)(conditions)
    }

    const createOperation = input.operator && this.operations[input.operator]

    if (!createOperation) {
      return -1 // err
    }

    return createOperation(this.facts[input.fact], input.value)
    // err if the types of params are differents
  }

  execRule(ruleStructure: RuleFormat[]): boolean {
    const ruleTriggered = ruleStructure.find(
      item => this.execConditions(item.when) === true,
    )

    if (!ruleTriggered) return false

    const ruleActionsTriggered = ruleTriggered.actions
    for (const actionName of ruleActionsTriggered) {
      const action = actionName && this.actions[actionName]
      if (action) {
        action()
      }
    }
    return true
  }
}
export default RuleEngine
