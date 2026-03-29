export const dsaQuestions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. Return the indices array as a string (e.g., '[0,1]').",
    exampleInput: "nums = [2,7,11,15], target = 9",
    exampleOutput: "[0,1]",
    constraints: "- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- -10^9 <= target <= 10^9",
    testCases: [
      { call: "solve([2,7,11,15], 9)", expected: "[0,1]" },
      { call: "solve([3,2,4], 6)", expected: "[1,2]" }
    ],
    template: "function solve(nums, target) {\n  // write code\n  \n}"
  },
  {
    id: 2,
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as a basic string. Return the reversed structure.",
    exampleInput: "'hello'",
    exampleOutput: "'olleh'",
    constraints: "- 1 <= s.length <= 10^5\n- s consists of printable ascii characters",
    testCases: [
      { call: "solve('hello')", expected: "olleh" },
      { call: "solve('zynkar')", expected: "raknyz" }
    ],
    template: "function solve(s) {\n  // write code\n  \n}"
  },
  {
    id: 3,
    title: "Palindrome Number",
    difficulty: "Easy",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise. A palindrome reads the same backward as forward.",
    exampleInput: "121",
    exampleOutput: "true",
    constraints: "- -2^31 <= x <= 2^31 - 1",
    testCases: [
      { call: "solve(121)", expected: "true" },
      { call: "solve(-121)", expected: "false" },
      { call: "solve(10)", expected: "false" }
    ],
    template: "function solve(x) {\n  // write code\n  \n}"
  },
  {
    id: 4,
    title: "Find Maximum Element",
    difficulty: "Easy",
    description: "Write a function that accepts an array of numbers and returns the largest number in the array. Do not use built-in Math.max directly.",
    exampleInput: "[1, 5, 3, 9, 2]",
    exampleOutput: "9",
    constraints: "- 1 <= arr.length <= 100",
    testCases: [
      { call: "solve([1,5,3,9,2])", expected: "9" },
      { call: "solve([-1,-5,-3])", expected: "-1" }
    ],
    template: "function solve(arr) {\n  // write code\n  \n}"
  },
  {
    id: 5,
    title: "FizzBuzz",
    difficulty: "Easy",
    description: "Given an integer n, return a string array answer (1-indexed) where answer[i] == 'FizzBuzz' if i is divisible by 3 and 5. Return 'Fizz' if divisible by 3, 'Buzz' if by 5, and i (as string) otherwise. Return as JSON array string format ('[\"1\",\"2\",\"Fizz\"]')",
    exampleInput: "n = 3",
    exampleOutput: '["1","2","Fizz"]',
    constraints: "- 1 <= n <= 10^4",
    testCases: [
      { call: "solve(3)", expected: '["1","2","Fizz"]' },
      { call: "solve(5)", expected: '["1","2","Fizz","4","Buzz"]' }
    ],
    template: "function solve(n) {\n  // write code\n  \n}"
  }
];
