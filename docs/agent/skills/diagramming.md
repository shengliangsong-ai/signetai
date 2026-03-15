# Agent Skill: Creating Architecture Diagrams

This document outlines the process for creating and updating high-quality architecture diagrams. The key is to separate the logical modeling from the final presentation. Directly asking an AI to "generate a nice diagram" is unpredictable. A better approach is to provide a precise, hand-crafted recipe.

## The Two-Step Process

1.  **Step 1: Logical Modeling (Mermaid)**
    -   **Goal:** Capture the components, relationships, and data flows accurately. This step focuses on *correctness*, not aesthetics.
    -   **Tool:** Use Mermaid syntax. It's simple, text-based, and excellent for defining the structure of a diagram.
    -   **Process:**
        1.  **Analyze the System:** Read all relevant source code, specifications (`SPECIFICATION.md`), and existing diagrams.
        2.  **Identify Components:** List all major services, UI parts, databases, and external dependencies.
        3.  **Map Relationships:** Define the data flows and interactions between components.
        4.  **Write the Mermaid Code:** Create a `.mermaid` file that represents this logic.
    -   **Outcome:** A `diagram.mermaid` file that serves as the logical source of truth.

2.  **Step 2: Presentation & Refinement (Hand-Crafted SVG)**
    -   **Goal:** Create a clean, visually appealing, and optimized SVG file that is easy to read and matches the project's style.
    -   **Tool:** Manual SVG XML coding.
    -   **Process:**
        1.  **Use a Template:** Start with a previous high-quality SVG from the project (e.g., `architecture.svg`) as a template for styles, fonts, and layout.
        2.  **Translate from Mermaid:** Manually convert the logical components from the `.mermaid` file into SVG elements (`<rect>`, `<text>`, `<path>`).
        3.  **Structure with Groups:** Use `<g>` tags to group related elements for a component (e.g., the box, title, and description). Give them IDs that correspond to the Mermaid diagram.
        4.  **Apply Styles:** Use a `<style>` block for consistent styling (colors, strokes, fonts). This is better than inline styles.
        5.  **Draw Precise Arrows:** Use `<path>` elements with an arrowhead `marker` for clear and professional-looking data flow lines.
        6.  **Optimize and Clean:** Ensure the SVG code is readable, well-formatted, and free of unnecessary clutter.
    -   **Outcome:** A `diagram.svg` file that is a pixel-perfect, high-quality visual artifact.

## How to "Prompt" for a Nice SVG

The best "prompt" is not a natural language instruction. **The prompt is the SVG code itself.**

Instead of asking the model:
> "Generate a nice SVG for this Mermaid diagram."

The correct approach is to command the model:
> "Write the following SVG content to `path/to/diagram.svg`."

Then, provide the complete, hand-crafted SVG code in the prompt. This gives you full control and ensures the result is exactly what you want.

### Sample SVG Structure Template

```xml
<svg width="1500" height="1400" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="14">
    <!-- 1. Definitions (e.g., arrowheads) -->
    <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#333" />
        </marker>
    </defs>

    <!-- 2. Global Styles -->
    <style>
        .title { font-size: 20px; font-weight: bold; text-anchor: middle; }
        .box { stroke: #333; stroke-width: 1.5; fill: #fff; rx: 5; ry: 5; }
        .box-title { font-weight: bold; text-anchor: middle; }
        .flow-line { stroke: #333; stroke-width: 1.5; marker-end: url(#arrow); fill: none; }
        .sub-group { stroke: #ccc; stroke-dasharray: 5 5; fill: #f9f9f9; rx:10; ry:10; }
    </style>

    <!-- 3. Components (Grouped) -->
    <g id="ComponentA">
        <rect class="box" x="50" y="130" width="310" height="120" />
        <text class="box-title" x="205" y="155">Component A</text>
        <text class="box-desc" x="205" y="180">Description line 1.</text>
    </g>

    <!-- ... more components ... -->

    <!-- 4. Arrows (Data Flows) -->
    <path class="flow-line" d="M_source_x_y_ V_vertical_ H_horizontal_ V_target_y_" />
    <text class="flow-label" x="..." y="...">Flow Description</text>

    <!-- ... more flows ... -->
</svg>
```

By following this structured, code-first approach, I can consistently produce high-quality diagrams that are both accurate and aesthetically pleasing, without relying on the unpredictability of direct generation.
