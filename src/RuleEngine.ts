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
  not?: Conditions
  [key: string]: Conditions | undefined
}

type Conditions = (RuleOperations | WhenObject)[]

type logicValues = boolean | RuleOperations

interface RuleFormat {
  when: WhenObject
  actions: string[]
  [key: string]: string[] | WhenObject | undefined
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

  execConditions(input: any): logicValues | number {
    // console.log(input)
    if (!this.facts || !this.operations || !this.actions) {
      return -1 // err
    }

    const logicalArray = input.all || input.any || input.not

    if (Array.isArray(logicalArray)) {
      if (input.all) {
        return !logicalArray.some(
          (item: logicValues) => !this.execConditions(item),
        )
      }

      if (input.any) {
        return logicalArray.some(
          (item: logicValues) => !!this.execConditions(item),
        )
      }

      return !this.execConditions(logicalArray) // check if input.not has 'and' // 'or' props
    }

    const makeOperation = input.operator && this.operations[input.operator]

    if (!makeOperation) {
      return -1 // err
    }

    return makeOperation(this.facts[input.fact], input.value)
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
