"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RuleEngine_1 = __importDefault(require("./RuleEngine"));
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
];
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
];
const facts = (factName) => {
    const objectValue = {
        $device1: 1,
        $device2: 2,
        $device3: 3,
        $device4: 4,
    };
    return objectValue[factName];
};
const operations = {
    '==': (a, b) => a === b,
    '>': (a, b) => a > b,
    '>=': (a, b) => a >= b,
    '<': (a, b) => a < b,
    '<=': (a, b) => a <= b,
    '!=': (a, b) => a !== b,
};
const actions = {
    print: () => 'this is a message',
};
const ruleEngine = new RuleEngine_1.default(facts, operations, actions);
test('it is expected that the actions will not be fired', () => {
    expect(ruleEngine.execRule(rule1)).toBe(false);
});
test('it is expected that the actions will be fired', () => {
    expect(ruleEngine.execRule(rule2)).toBe(true);
});
