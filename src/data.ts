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
    detailedNotes: `### Why Variables?
Imagine trying to bake a cake, but you have to carry all the ingredients in your bare hands at the same time. Impossible, right? Variables are like labeled plastic bowls in your kitchen. They hold onto information so you can use, change, and refer to it later in your program.

### How to Create a Variable
In Python, creating a variable is incredibly clean. You simply write a name, followed by the equals sign \`=\`, and then the value:
\`\`\`python
username = "CodeCruiser"
score = 1500
\`\`\`
Python is a **dynamically typed** language. This means you do not need to tell Python whether your variable is a word or a number. Python is smart enough to figure it out automatically!

### Variable Naming Rules
To keep your code friendly to other engineers, follow these universal Python variable standards:
- Always use lowercase letters, separated by underscores (e.g., \`high_score\`, not \`HighScore\` or \`highscore\`). This is called **snake_case**.
- Names must start with a letter or an underscore, never a number (e.g., \`player_1\` is fine, but \`1_player\` is a syntax error).`,
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
    detailedNotes: `### What is a Data Type?
In the physical world, water, rocks, and steel behave differently. In programming, data is similarly categorized. Numbers can be multiplied, text can be capitalized, and switches can be turned on or off. A **Data Type** tells Python what kind of value a variable holds, and what actions are allowed on it.

### The Big Four Data Types in Python:
1. **String (\`str\`):** Text values. They are always enclosed in single or double quotation marks, like \`"Alex"\` or \`'Python'\`.
2. **Integer (\`int\`):** Positive or negative whole numbers with index offsets (e.g., \`120\`, \`-5\`, \`0\`).
3. **Float (\`float\`):** Decimal numbers, representing fractions or precise ratios (e.g., \`88.5\`, \`3.14159\`).
4. **Boolean (\`bool\`):** Standard computer bits: either \`True\` or \`False\`. Note the capitalized first letters—Python is case-sensitive!

### Why Casting Matters
Sometimes, Python expects one data type but receives another. For example, if you read a user's typed input, Python reads it as a string: \`"100"\`. To add math operators to it, you must **cast** (convert) that string to an integer:
\`\`\`python
lucky_number = int("100") # Converts string to mathematical integer
\`\`\`
*Pro Tip:* Python evaluates \`True\` as \`1\` and \`False\` as \`0\` behind the scenes! This is why you can theoretically add a boolean to an integer.`,
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
    detailedNotes: `### Interactive Programs
So far, our code has been a one-sided conversation. But to build real apps, your code must listen! The \`input()\` function halts execution, listens for user input in the console, and returns it as data.

### How \`input()\` Works in Python:
When Python executes \`input()\`:
1. It displays your custom text inside the parenthesis as a prompt (e.g., \`"What is your name?"\`).
2. It **pauses program execution** entirely.
3. Once the user types their string and presses **Enter**, Python takes that value and returns it.

### 🚨 The Golden Rule of Inputs
**The \`input()\` function ALWAYS returns a String (\`str\`)!**
Even if the user types the digit \`5\`, Python reads it as text: \`"5"\`. If you try to add numbers directly to input results, Python will crash with a Type Error:
\`\`\`python
# This will CRASH
age = input("Enter age: ")
next_year = age + 1  # Raises TypeError: can only concatenate str to str
\`\`\`
**The Solution:** Nest your input inside a casting loader:
\`\`\`python
age = int(input("Enter age: ")) # Correct! Changes "5" into 5
\`\`\``,
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
    detailedNotes: `### Core Calculations
Computers are fundamentally brilliant calculators. Python supports mathematical operations natively, using standard operators combined with unique power tools:

### Basic Arithmetic:
- **Addition (\`+\`) & Subtraction (\`-\`):** Standard calculations.
- **Multiplication (\`*\`):** Note the asterisk key represents scaling (e.g., \`3 * 5 = 15\`).
- **Float Division (\`/\`):** Always returns a decimal number (e.g., \`15 / 4 = 3.75\`).

### ⚡ Python's Special Math Math-Power Tools:
- **Exponent (\`**\`):** Computes power multipliers. \`5 ** 3\` implies $5 \\times 5 \\times 5 = 125$. (Do not use \`^\` for powers—in Python, \`^\` represents binary XOR!).
- **Floor Division (\`//\`):** Divides two values but chops off the decimal remainder. \`15 // 4\` evaluates to \`3\` because 4 fits into 15 three whole times.
- **Modulo (\`%\`):** Computes the *remainder of a division*. \`15 % 4\` returns \`3\`, because $15 - (4 \\times 3) = 3$.

### Why Modulo (%) is Extremely Useful for Beginners
Modulo helps software determine properties of a number:
- **Check if a number is even or odd:** \`number % 2 == 0\` is True for even numbers, and False for odd!
- **Check divisibility:** \`year % 4 == 0\` verifies leap-year candidacy.`,
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
    detailedNotes: `### 🚦 Why Conditions?
Without conditions, your code is a train stuck on a single straight track. It executes line 1, then line 2, then line 3, all the way to completion, regardless of the situation. 
**Conditions act as railway switches.** They let your code make decisions dynamically. "If the user is logged in, show their dashboard; otherwise, show the login form."

### Step 1: Comparison Operators
Every decision is built on a logic test that yields a simple Boolean: \`True\` or \`False\`. We use comparison operators to set these checks:
- \`==\` (checks if equal) — **Caution:** A single equals \`=\` assigns variables, while a double equals \`==\` checks equality. Don't mix them!
- \`!=\` (checks if not equal)
- \`>\` (greater than) & \`<\` (less than)
- \`>=\` (greater than or equal) & \`<=\` (less than or equal)

### Step 2: The Logic Stack (if, elif, else)
- **\`if\`:** The primary condition. If the logic holds, run the indented code inside.
- **\`elif\` (Else If):** Optional middle checks. Run in sequence *only* if everything before them returned \`False\`.
- **\`else\`:** The ultimate catcher. Runs *only* if every previous block failed.

\`\`\`python
if temperature > 100:
    print("Boiling!")
elif temperature < 0:
    print("Freezing!")
else:
    print("Normal liquid.")
\`\`\`

### ⚖️ The Critical Importance of Indentation
Unlike JavaScript, C++, or Java which use curly brackets \`{}\` to wrap code paths, **Python uses blank spacing (Indentation) to define blocks of code.**
\`\`\`python
if is_ready:
    print("This line runs only if is_ready is True!")
print("This line ALWAYS runs because it is not indented!")
\`\`\`
- Standard indentation in Python is **4 spaces**.
- If your indentation is off, Python throws an \`IndentationError\` and refuses to boot your script! This keeps Python incredibly readable and visually elegant.

### Step 3: Boolean Operators (and, or, not)
Combine multiple conditions together:
- **\`and\`:** Both conditions must be True (\`score > 80 and passes_test\`).
- **\`or\`:** At least one condition must be True (\`is_weekend or is_holiday\`).
- **\`not\`:** Reverses the Boolean statement (\`not is_game_over\`).`,
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
    detailedNotes: `### 🔄 Why Loops Matter
Repetition is where computers absolutely crush human work. If you need to print a message 10,005 times, doing it manually is brutal. A loop lets you write the instruction **once**, and tell the processor to loop over it. Automation starts right here!

---

### 1. The \`for\` Loop: Counted Repetition
Use a \`for\` loop when you know **how many times** you want to repeat, or when iterating over a collection (like a list of items).

#### Using the \`range()\` Function:
In Python, \`range(start, stop)\` generates a sequence of numbers:
\`\`\`python
for num in range(1, 5):
    print(num)
\`\`\`
*⚠️ CRITICAL PYTHON RANGE GOTCHA:* \`range(1, 5)\` prints 1, 2, 3, and 4, but **stops right before 5!**
In computer indices, values count from the starting bound up to, but *excluding*, the stop value.

---

### 2. The \`while\` Loop: Conditional Repetition
Use a \`while\` loop when you want to repeat code as long as a certain **condition remains True**. You might not know in advance how many loops it will take!

\`\`\`python
fuel = 3
while fuel > 0:
    print("Flying high!")
    fuel -= 1 # Crucial state modification!
\`\`\`

#### 🚨 The Infinite Loop: Core Beginner Trap
If your condition never becomes False, your program gets stuck in a never-ending pattern. It will run forever, eating up your computer's CPU and freezing the browser tab!
- **Infinite Loop Example:**
  \`\`\`python
  while True:
      print("Freeze!") # Runs forever
  \`\`\`
- **How to Prevent it:** Always make sure the code block inside a \`while\` loop changes a state value (like \`fuel -= 1\`) so that the conditional statement eventually resolves to \`False\`.

---

### 3. Controlling Loops: \`break\` and \`continue\`
Provide microscopic directions inside physical loops:
- **\`break\`:** Instantly exits the loop altogether. Useful to stop scanning once an item is found.
- **\`continue\`:** Skips the rest of the current loop iteration and jumps immediately to the top for the next run.`,
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
    detailedNotes: `### What is a Function?
Imagine a recipe for baking bread. Instead of printing the exact flour and temperature calculation rules every time you want bread, you write the recipe once, label it "BakeBread", and save it in a cookbook. 
In code, a **Function** is a named, reusable pack of code. You define it once, and trigger it from anywhere!

### 1. Defining a Function
Use the \`def\` keyword to establish a function, followed by its name, parameters inside parenthesis, and a colon:
\`\`\`python
def greet_user(name):
    # This is the body of the function
    return f"Hello, {name}!"
\`\`\`

### 2. Calling a Function
Simply write its name and pass values (arguments) in:
\`\`\`python
msg = greet_user("CodeGenius") # Returns: "Hello, CodeGenius!"
print(msg)
\`\`\`

### Functions Concepts:
- **Arguments:** Inputs fed into the function.
- **Default Parameters:** Standard values used if the caller doesn't provide them (e.g., \`tax_rate=0.12\`).
- **Return Value:** The final result the function sends back using the \`return\` keyword. Once a function hits a \`return\`, it immediately exits!`,
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
    detailedNotes: `### 📦 What is a List?
Up until now, our variables could only store a single item (like \`score = 1500\`). But what if your RPG game has an inventory? Or a high-score leaderboard? Storing 100 high scores in 100 individual variables (\`score1\`, \`score2\`...) is an absolute nightmare.
**Lists (called arrays in other languages) organize multiple items inside a single variable!**

### Why do Lists start counting from Zero (0)?
In Python and most major languages, list indexing is **Zero-Indexed**. The first element is at slot \`[0]\`, and the second is at slot \`[1]\`. 
- **Inventory illustration:** \`inventory = ["Shield", "Potion", "Key"]\`
- Index \`0\`: \`"Shield"\`
- Index \`1\`: \`"Potion"\`
- Index \`2\`: \`"Key"\`
*Why?* Historically, indices represent "offsets" (how far an item is located in memory relative to the very starting byte of the array). The first absolute item has an offset of 0!

---

### Crucial Python List Operations:
- **Append (\`.append()\`):** Inserts an item to the end of your list:
  \`\`\`python
  inventory.append("Energy Core")
  \`\`\`
- **Insert (\`.insert(index, item)\`):** Squeezes an item specifically into any index, shifting everything else down.
- **Remove (\`.remove()\`):** Looks up and deletes the item match matching your search:
  \`\`\`python
  inventory.remove("Potion")
  \`\`\`
- **Length (\`len()\`):** Tells you how many items currently reside in your list:
  \`\`\`python
  size = len(inventory) # Returns 3
  \`\`\`

---

### Slicing Lists (Cutting Portions)
Python makes list-slicing incredibly elegant. You can extract subsections of a list using colons:
\`\`\`python
# inventory = ["Shield", "Potion", "Key"]
first_two = inventory[0:2] # Returns ["Shield", "Potion"] (indexes 0 and 1, stopping before 2!)
\`\`\`
- **Negative Indexes:** \`inventory[-1]\` fetches the last item in a list automatically!`,
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
    detailedNotes: `### Why Dictionaries?
Lists are awesome for sequences (like leaderboard sequences). However, they aren't labeled. If you have a user array:
\`\`\`python
user = ["Alex", "CyberMage", 95, True]
\`\`\`
What does \`95\` represent? Health? Age? Intelligence? Level? You have to guess.

**Dictionaries solve this problem by mapping Keys to Values!** It's like looking up a word inside a physical dictionary:

\`\`\`python
avatar = {
    "nickname": "GamerGarnet",
    "class": "CyberMage",
    "health": 95,
    "skills": ["Hacking", "Firewall", "Overload"],
    "is_online": True
}
\`\`\`

### Reading Values:
Instead of numbers, you request values using their descriptive label:
\`\`\`python
print(avatar["nickname"]) # prints: GamerGarnet
\`\`\`

### Dictionaries Keys vs Values:
- **Key:** A unique, immutable label (like \`"health"\` or \`"nickname"\`).
- **Value:** The data matched to that label. It can be anything—even a list!`,
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
    detailedNotes: `### Standing on the Shoulders of Giants
No engineer writes everything from scratch! If you need to make random choices, fetch the current physical calendar date, or fetch files from the operating system, you don't need to rebuild these scripts yourself. 

Python features a legendary **"Batteries Included"** philosophy, providing hundreds of fully functional pre-written modules you can load instantly!

### How to Import
At the absolute top of your Python file, write the \`import\` keyword followed by the package:
\`\`\`python
import math
import random
\`\`\`

### Standard Libraries Included out of the box:
- **\`math\`:** Yields properties like \`math.pi\`, or functions like \`math.sqrt()\` for square roots.
- **\`random\`:** Generates arbitrary calculations, like \`random.randint(1, 100)\` (roll numbers between 1 and 100).
- **\`datetime\`:** Captures clock rates and physical date-times.`,
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
