/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chapter } from "./types";

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "Variables",
    description: "Store data values in memory using descriptive names.",
    conceptBrief: "Variables are containers for storing data values. Unlike other languages, Python has no command for declaring a variable; a variable is created the moment you first assign a value to it using the `=` operator.",
    code: `# Storing information in variables
username = "CodeCruiser"
score = 1500
level = 5
has_booster = True

# We can modify variables naturally at any point
score = score + 450

print(f"--- USER DATA CARD ---")
print(f"Username: {username}")
print(f"Current Score: {score}")
print(f"Player Level: {level}")
print(f"Active Booster: {has_booster}")
`,
    instructions: [
      "Try changing the `username` to your own name.",
      "Add a new variable called `gold = 250` and print its value.",
      "Increase the `level` by 1 and run the program."
    ],
    expectedOutputSnippet: "Username: CodeCruiser\nCurrent Score: 1950\n...",
    difficulty: "Beginner",
  },
  {
    id: 2,
    title: "Data Types",
    description: "Explore integers, floats, strings, and booleans with type checking.",
    conceptBrief: "Python standard types are dynamic. The core types you'll use daily are 'str' for text, 'int' for whole numbers, 'float' for decimal numbers, and 'bool' for True/False values. Use type() to reveal a variable's data type.",
    code: `# Creating different types of parameters
player_name = "Alex"      # String (str)
victory_ratio = 88.5     # Float (float)
play_count = 120         # Integer (int)
is_champion = True       # Boolean (bool)

print("--- TYPE SYSTEM ANALYSIS ---")
print(f"1. player_name: '{player_name}' has type {type(player_name)}")
print(f"2. victory_ratio: {victory_ratio} has type {type(victory_ratio)}")
print(f"3. play_count: {play_count} has type {type(play_count)}")
print(f"4. is_champion: {is_champion} has type {type(is_champion)}")

# Type conversion (Casting)
string_play = str(play_count)
print(f"Casted play_count to string: '{string_play}' with type {type(string_play)}")
`,
    instructions: [
      "Change `victory_ratio` to an integer using casting: `int(victory_ratio)` and print its new type.",
      "Verify what happens when you sum a boolean and an integer (Python treats True as 1 and False as 0!)."
    ],
    expectedOutputSnippet: "... type <class 'str'>\n... type <class 'float'>\n...",
    difficulty: "Beginner",
  },
  {
    id: 3,
    title: "User Input",
    description: "Gather dynamic answers from users interactively with input().",
    conceptBrief: "The input() function pauses program execution and waits for the user to type text. Note that input() always returns data as a 'str' (string). If you need a number, you must cast it with int() or float().",
    code: `# Interactive Console Application
print("--- CHARACTER BUILDER ---")
print("(Note: Add mock values into the Input Queue panel below to test custom responses!)")

hero_name = input("What is your hero's name? ")
hero_role = input("Choose role (Warrior, Mage, Alchemy): ")
level_input = input("Enter starting level: ")

# Convert input string to integer so we can do math
hero_level = int(level_input)

print("\\n[Character Created successfully!]")
print(f"Defending the realm: {hero_name} the Level {hero_level} {hero_role}!")
print(f"Next level is: {hero_level + 1}")
`,
    instructions: [
      "In the 'Inputs Queue' block below the code terminal, change or add lines to feed different inputs.",
      "Calculate and print the XP required to level up (e.g. `hero_level * 100`)."
    ],
    expectedOutputSnippet: "What is your hero's name? ...\nDefending the realm: ...",
    difficulty: "Beginner",
  },
  {
    id: 4,
    title: "Math Operations",
    description: "Calculate formulas using arithmetic operators.",
    conceptBrief: "Python supports standard mathematical operators as well as exponents (`**`), floor division (`//` which drops decimals), and modulo (`%` which yields the remainder of a division).",
    code: `# Arithmetic variables
a = 15
b = 4

print(f"--- ARITHMETIC WITH {a} & {b} ---")
print(f"Addition (+):         {a + b}")
print(f"Subtraction (-):      {a - b}")
print(f"Multiplication (*):  {a * b}")
print(f"Float Division (/):   {a / b}")
print(f"Floor Division (//):  {a // b}  (drops decimal parts)")
print(f"Modulo (%):           {a % b}  (remainder of division)")
print(f"Power (**):           {a ** b} (a raised to the power of b)")

# Order of operations (PEMDAS)
complex_calc = (a + b) * 2 - (a // b)
print(f"Complex math result:  {complex_calc}")
`,
    instructions: [
      "Change `a` and `b` to different numbers and examine the remainder (`modulo` %).",
      "Calculate the area of a circle with radius `r = 7` using formula `3.14159 * (r ** 2)`."
    ],
    expectedOutputSnippet: "Addition (+): 19\nFloor Division (//): 3\nModulo (%): 3\n...",
    difficulty: "Beginner",
  },
  {
    id: 5,
    title: "Conditions (if statements)",
    description: "Branch your code's path using logic and comparisons.",
    conceptBrief: "Python uses conditional branches with `if`, `elif` (else if), and `else`. Python relies on indentation (whitespace at the start of a line) to define scope in the code rather than brackets like JS/Java.",
    code: `# Simple scoring thresholds
test_score = 85

print(f"Evaluating Score: {test_score}")

if test_score >= 90:
    grade = "A (Exceptional)"
    status = "Honor Roll"
elif test_score >= 80:
    grade = "B (Very Good)"
    status = "Passing"
elif test_score >= 70:
    grade = "C (Adequate)"
    status = "Passing"
else:
    grade = "F (Revision needed)"
    status = "Needs Improvement"

print(f"Result: {grade}")
print(f"Status: {status}")

# Logical indicators (And, Or, Not)
has_perfect_conduct = True
if test_score >= 80 and has_perfect_conduct:
    print("Awarded the exemplary citizenship ribbon! 🎖️")
`,
    instructions: [
      "Modify `test_score` to a value below 70 and witness the else branch execute.",
      "Add a check: if `test_score == 100`, print a special jackpot statement!"
    ],
    expectedOutputSnippet: "Evaluating Score: 85\nResult: B (Very Good)\n...",
    difficulty: "Beginner",
  },
  {
    id: 6,
    title: "Loops",
    description: "Automate repetitive actions using for and while loops.",
    conceptBrief: "A `for` loop is used to iterate over a sequence (like a list or a range of numbers). A `while` loop continues executing as long as its condition remains True. Don't forget to update state in a `while` loop to avoid infinite execution!",
    code: `# 1. An iterative 'for' loop
print("--- COUNTING RANGE ---")
# range(start, stop) goes up to BUT NOT INCLUDING the stop value!
for num in range(1, 6):
    squared = num ** 2
    print(f"Number: {num} | Squared: {squared}")

# 2. A conditional 'while' loop
print("\\n--- FUEL DECREASE EVENT ---")
fuel_cells = 3

while fuel_cells > 0:
    print(f"Thrusters blasting! Fuel cells left: {fuel_cells}")
    fuel_cells -= 1  # decrease counter by 1 each loop

print("Out of fuel cells! Engines idle. 🛑")
`,
    instructions: [
      "Modify the range bounds: make it print steps from `10` down to `15`.",
      "Implement a `while` loop that counts from 1 to 10 by increments of 2."
    ],
    expectedOutputSnippet: "Number: 1 | Squared: 1\n...\nOut of fuel cells! Engines idle.",
    difficulty: "Beginner",
  },
  {
    id: 7,
    title: "Functions",
    description: "Write modular, reusable blocks of code that take arguments.",
    conceptBrief: "Functions are declared with the `def` keyword. They accept inputs (arguments), execute a specific block of logic, and pass results back using the `return` keyword.",
    code: `# Defining an algebraic calculator function
def calculate_tax_and_total(price, tax_rate=0.12):
    """
    Computes tax and totals for an invoice.
    Uses a default tax rate of 12% if none is provided.
    """
    calculated_tax = price * tax_rate
    final_total = price + calculated_tax
    return calculated_tax, final_total

# Invoking the function with positional arguments
tax_a, total_a = calculate_tax_and_total(100)
print(f"Sale $100 (Default Tax 12%): Tax = \${tax_a:.2f}, Total = \${total_a:.2f}")

# Invoking with keyword arguments and custom tax rate
tax_b, total_b = calculate_tax_and_total(250.50, tax_rate=0.08)
print(f"Sale $250.50 (Custom Tax 8%): Tax = \${tax_b:.2f}, Total = \${total_b:.2f}")
`,
    instructions: [
      "Define a new function `fahrenheit_to_celsius(f)` that returns `(f - 32) * 5/9` and print the outcome for `98.6` degrees.",
      "Add a docstring explaining what your new function does."
    ],
    expectedOutputSnippet: "Sale $100 (Default Tax 12%): Tax = $12.00, Total = $112.00\n...",
    difficulty: "Intermediate",
  },
  {
    id: 8,
    title: "Lists",
    description: "Organize items in an ordered, mutable sequence.",
    conceptBrief: "Lists are dynamic arrays. They are written inside square brackets `[]`, can store different data types, are ordered (0-indexed), mutable (can be changed), and allow duplicate values.",
    code: `# Declaring a primary inventory list
inventory = ["Ration Card", "Silver Shield", "Health Tonic"]
print(f"Current equipment: {inventory}")

# Appending and removing
inventory.append("Energy Core")
print(f"Secured a cell: {inventory}")

inventory.remove("Ration Card")
print(f"Ate breakfast: {inventory}")

# Reading indices and slicing lists
print(f"First item: {inventory[0]}")
print(f"Last item: {inventory[-1]}")
print(f"Subset slice: {inventory[0:2]}")

# Size and sorting
print(f"Inventory total slots: {len(inventory)}")
inventory.sort()
print(f"Sorted alphabet order: {inventory}")
`,
    instructions: [
      "Add an item to the list using `insert(1, 'Magic Ring')` and check its placement.",
      "Attempt to clear all inventory slots using the clear command: `inventory.clear()` and print it."
    ],
    expectedOutputSnippet: "Current equipment: ['Ration Card', ...]\nSorted alphabet order: ...",
    difficulty: "Beginner",
  },
  {
    id: 9,
    title: "Dictionaries",
    description: "Map key-value pairs to represent structured objects.",
    conceptBrief: "Dictionaries are collections of associative key-value mappings housed inside `{}`. Keys must be unique, immutable identifiers, while values can represent any data type, including lists or other dictionaries.",
    code: `# Character sheet dictionary
avatar = {
    "nickname": "GamerGarnet",
    "class": "CyberMage",
    "health": 95,
    "skills": ["Hacking", "Firewall", "Overload"],
    "is_online": True
}

print(f"Character Name: {avatar['nickname']}")
print(f"Skills Count:   {len(avatar['skills'])}")
print(f"Primary Skill:  {avatar['skills'][0]}")

# Modifying and extending dictionaries
avatar["health"] = 100             # edit value
avatar["alliance"] = "Sol-9 Guild"  # add new key-value

print("\\nUpdated Character records:")
for key, val in avatar.items():
    print(f" - {key.capitalize()}: {val}")
`,
    instructions: [
      "Access the `skills` list inside the dictionary and append `'Ice Bolt'` to it.",
      "Check if a key exists in the dictionary using the keyword `if 'alliance' in avatar:`."
    ],
    expectedOutputSnippet: "Character Name: GamerGarnet\nSkills Count: 3\n- Health: 100\n...",
    difficulty: "Intermediate",
  },
  {
    id: 10,
    title: "Importing Modules",
    description: "Extend Python's power using built-in standard libraries.",
    conceptBrief: "Python is famous for its 'batteries included' philosophy. Use the `import` keyword to incorporate files or modules containing library code, such as calculations (`math`), probabilities (`random`), and timestamps (`datetime`).",
    code: `# Importing standard Python mathematical and randomized tooling
import math
import random
import datetime

print("--- UTILITIES PACK EXAMPLES ---")

# 1. Math formulas
radius = 5
circumference = 2 * math.pi * radius
print(f"Circle w/ radius {radius} has circumference: {circumference:.3f}")

# 2. Random choices and integers
options = ["Red", "Blue", "Green", "Golden"]
picked_color = random.choice(options)
lucky_number = random.randint(100, 999)

print(f"Random color pick: {picked_color}")
print(f"Secure roll number: {lucky_number}")

# 3. System Date and Time Representation
right_now = datetime.datetime.now()
print(f"Timestamp in WebAssembly sandbox: {right_now.strftime('%Y-%m-%d %H:%M:%S')}")
`,
    instructions: [
      "Import the `time` module and measure execution speed by print calculations.",
      "Use `math.sqrt(144)` to find the square root of 144 and print the value."
    ],
    expectedOutputSnippet: "Circle w/ radius 5 has circumference: ...\nRandom color pick: ...",
    difficulty: "Intermediate",
  }
];
