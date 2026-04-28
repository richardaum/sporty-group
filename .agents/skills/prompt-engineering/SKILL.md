---
name: prompt-engineering
description: Use this skill when writing prompts, commands, hooks, or skills for Cursor Agent, subagents, or any LLM interaction, including optimizing prompts, improving output quality, and designing production-ready prompt templates.
---

# Prompt Engineering Patterns

Advanced prompt engineering techniques to maximize LLM performance, reliability, and controllability.

## Core Capabilities

### 1. Few-Shot Learning

Teach the model by showing examples instead of explaining rules. Include 2-5 input-output pairs that demonstrate the desired behavior. Use when you need consistent formatting, specific reasoning patterns, or handling edge cases. More examples improve accuracy but consume tokens, so balance based on task complexity.

**Example:**

```markdown
Extract key information from support tickets:

Input: "My login doesn't work and I keep getting error 403"
Output: {"issue": "authentication", "error_code": "403", "priority": "high"}

Input: "Feature request: add dark mode to settings"
Output: {"issue": "feature_request", "error_code": null, "priority": "low"}

Now process: "Can't upload files larger than 10MB, getting timeout"
```

### 2. Chain-of-Thought Prompting

Request step-by-step reasoning before the final answer. Add "Let's think step by step" (zero-shot) or include example reasoning traces (few-shot). Use for complex problems requiring multi-step logic, mathematical reasoning, or when you need to verify the model's thought process.

**Example:**

```markdown
Analyze this bug report and determine root cause.

Think step by step:
1. What is the expected behavior?
2. What is the actual behavior?
3. What changed recently that could cause this?
4. What components are involved?
5. What is the most likely root cause?

Bug: "Users can't save drafts after the cache update deployed yesterday"
```

### 3. Prompt Optimization

Systematically improve prompts through testing and refinement. Start simple, measure performance (accuracy, consistency, token usage), then iterate. Test on diverse inputs including edge cases. Use A/B testing to compare variations. This is critical for production prompts where consistency and cost matter.

**Example:**

```markdown
Version 1 (Simple): "Summarize this article"
-> Result: Inconsistent length, misses key points

Version 2 (Add constraints): "Summarize in 3 bullet points"
-> Result: Better structure, but still misses nuance

Version 3 (Add reasoning): "Identify the 3 main findings, then summarize each"
-> Result: Consistent, accurate, captures key information
```

### 4. Template Systems

Build reusable prompt structures with variables, conditional sections, and modular components. Use for multi-turn conversations, role-based interactions, or when the same pattern applies to different inputs. This reduces duplication and improves consistency.

**Example:**

```ts
# Reusable code review template
const template = `
Review this {language} code for {focus_area}.

Code:
{code_block}

Provide feedback on:
{checklist}
`;

# Usage
const prompt = template
  .replace("{language}", "TypeScript")
  .replace("{focus_area}", "security vulnerabilities")
  .replace("{code_block}", userCode)
  .replace("{checklist}", "1. SQL injection\n2. XSS risks\n3. Authentication");
```

### 5. System Prompt Design

Set global behavior and constraints that persist across a conversation. Define role, expertise level, output format, and safety constraints. Use system prompts for stable instructions that should not change turn-to-turn.

**Example:**

```markdown
System: You are a senior backend engineer specializing in API design.

Rules:
- Always consider scalability and performance
- Suggest RESTful patterns by default
- Flag security concerns immediately
- Provide code examples in TypeScript
- Use early return pattern

Format responses as:
1. Analysis
2. Recommendation
3. Code example
4. Trade-offs
```

## Key Patterns

### Progressive Disclosure

Start with simple prompts, then add complexity only when needed:

1. **Level 1**: Direct instruction
 - "Summarize this article"

2. **Level 2**: Add constraints
 - "Summarize this article in 3 bullet points, focusing on key findings"

3. **Level 3**: Add reasoning
 - "Read this article, identify the main findings, then summarize in 3 bullet points"

4. **Level 4**: Add examples
 - Include 2-3 example summaries with input-output pairs

### Instruction Hierarchy

```
[System Context] -> [Task Instruction] -> [Examples] -> [Input Data] -> [Output Format]
```

### Error Recovery

Build prompts that gracefully handle failures:

- Include fallback instructions
- Request confidence scores
- Ask for alternative interpretations when uncertain
- Specify how to indicate missing information

## Best Practices

1. **Be Specific**: Vague prompts produce inconsistent results
2. **Show, Don't Tell**: Examples are more effective than descriptions
3. **Test Extensively**: Evaluate on diverse, representative inputs
4. **Iterate Rapidly**: Small changes can have large impacts
5. **Monitor Performance**: Track metrics in production
6. **Version Control**: Treat prompts as code with proper versioning
7. **Document Intent**: Explain why prompts are structured as they are

## Common Pitfalls

- **Over-engineering**: Starting with complex prompts before trying simple ones
- **Example pollution**: Using examples that do not match the target task
- **Context overflow**: Exceeding token limits with excessive examples
- **Ambiguous instructions**: Leaving room for multiple interpretations
- **Ignoring edge cases**: Not testing on unusual or boundary inputs

## Integration Patterns

### With RAG Systems

```ts
# Combine retrieved context with prompt engineering
const prompt = `Given the following context:
${retrievedContext}

${fewShotExamples}

Question: ${userQuestion}

Provide a detailed answer based solely on the context above. If the context doesn't contain enough information, explicitly state what's missing.`;
```

### With Validation

```ts
# Add self-verification step
const prompt = `${mainTaskPrompt}

After generating your response, verify it meets these criteria:
1. Answers the question directly
2. Uses only information from provided context
3. Cites specific sources
4. Acknowledges any uncertainty

If verification fails, revise your response.`;
```

## Performance Optimization

### Token Efficiency

- Remove redundant words and phrases
- Use abbreviations consistently after first definition
- Consolidate similar instructions
- Move stable content to system prompts

### Latency Reduction

- Minimize prompt length without sacrificing quality
- Use streaming for long-form outputs
- Cache common prompt prefixes
- Batch similar requests when possible

---

# Agent Prompting Best Practices

Based on Anthropic's official best practices for agent prompting.

## Core principles

### Context Window

The context window is the amount of text the model can reference while generating new text. It acts as working memory, not training data. A larger context window allows handling longer and more complex prompts.

- Progressive token accumulation: each turn adds to prior conversation context.
- Linear growth pattern: context usage grows linearly as the conversation continues.
- Input-output flow:
 - Input phase: all previous conversation plus current user message.
 - Output phase: generated response becomes part of future input.

### Concise is key

The context window is a shared resource. Your prompt, command, or skill shares space with:

- System prompt
- Conversation history
- Other commands, skills, hooks, and metadata
- Current request

**Default assumption**: the model is already very capable.

Only add context it does not already have.

**Good (concise):**

````markdown
## Extract PDF text

Use `pdf-parse` for text extraction:

```ts
import fs from "node:fs/promises";
import pdf from "pdf-parse";

const fileBuffer = await fs.readFile("file.pdf");
const data = await pdf(fileBuffer);
const text = data.text;
```
````

**Bad (verbose):**

```markdown
## Extract PDF text

PDF (Portable Document Format) files are a common format that contains text,
images, and other content. To extract text from a PDF, you'll need to use a
library. There are many libraries available for PDF processing, but we
recommend pdfplumber because it's easy to use and handles most cases well.
```

### Set appropriate degrees of freedom

Match the level of specificity to the task's fragility and variability.

**High freedom** (text-based instructions):

- Use when multiple approaches are valid and context matters.

**Medium freedom** (pseudocode or scripts with parameters):

- Use when a preferred pattern exists but variation is acceptable.

**Low freedom** (specific scripts, few parameters):

- Use when operations are fragile, error-prone, and require consistency.

## Persuasion Principles for Agent Communication

Useful when writing prompts for commands, hooks, skills, subagents, or other LLM interactions.

### Overview

LLMs often respond to persuasion principles seen in human communication. Use these patterns ethically to improve compliance with critical practices.

### The Seven Principles

1. **Authority**: Use strong, explicit constraints for safety-critical or discipline-enforcing instructions.
2. **Commitment**: Require explicit declarations or checklists to increase follow-through.
3. **Scarcity**: Use clear sequencing and timing requirements to prevent deferment.
4. **Social Proof**: Reinforce norms and common failure patterns.
5. **Unity**: Use collaborative language aligned to shared goals.
6. **Reciprocity**: Use sparingly.
7. **Liking**: Avoid for discipline enforcement to reduce sycophancy risk.

### Ethical Use

Use these techniques to support user interests and reliability, not manipulation.
