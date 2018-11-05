"use strict";
// import mem from 'mem'
Object.defineProperty(exports, "__esModule", { value: true });
class RuleEngine {
    constructor(facts, operations, actions) {
        this.facts = facts;
        this.operations = operations;
        this.actions = actions;
    }
    execConditions(input) {
        // console.log(input)
        const logicOperation = input.all
            ? 'all'
            : input.any
                ? 'any'
                : input.not
                    ? 'not'
                    : '';
        if (logicOperation) {
            const conditions = input[logicOperation];
            const logicalOperators = {
                all: arr => !arr.some(item => !this.execConditions(item)),
                any: arr => arr.some(item => this.execConditions(item)),
                not: arr => !this.execConditions(arr),
            };
            return logicalOperators[logicOperation](conditions);
        }
        const createOperation = input.operator && this.operations[input.operator];
        if (!createOperation) {
            throw new Error('JSON format is wrong or the operation does not exist.');
        }
        return createOperation(this.facts(input.fact), input.value);
        // err if the types of params are differents
    }
    execRule(ruleStructure) {
        if (!this.facts || !this.operations || !this.actions) {
            throw new Error('Facts, operations and actions are required.');
        }
        const ruleTriggered = ruleStructure.find(item => this.execConditions(item.when));
        if (!ruleTriggered)
            return false;
        const ruleActionsTriggered = ruleTriggered.actions;
        for (const actionName of ruleActionsTriggered) {
            const action = actionName && this.actions[actionName];
            if (action) {
                action();
            }
        }
        return true;
    }
}
exports.default = RuleEngine;
