# General Guidelines

* Prioritize clarity and usability in all generated designs and suggestions.
* Ensure layouts are responsive and compatible with multiple screen sizes.
* Keep designs modular and components reusable.
* Follow consistency in spacing, typography, and color usage.
* Suggest best practices for UX/UI patterns without overcomplicating.
* Avoid clutter — each screen should focus on its main purpose.
* Optimize for accessibility (contrast, readability, keyboard navigation).
* Provide actionable, step-by-step recommendations when relevant.
* Encourage scalability — designs should support future additions.
* Maintain clean, organized structure in files and components.
* Always Double-Check your code. If the code seems wrong tell the user what you did wrong and proceed to redo it.
* Never check the file size its a waste of precious time just know the file size is big and 20,000+ lines long

# Large Change Handling

* If a requested change is too large for a single prompt or run, the AI should:
  * Automatically create a `.md` file containing the partial progress and instructions for continuation.
  * Stop the current process cleanly to avoid crashes or partial, broken output.
  * Notify the user clearly: “I couldn’t finish this in one prompt. Please review the `.md` file and press continue to proceed.”
  * Avoid repeating checks or iterations excessively (20–30 times) to reduce risk of crashing.
  * Ensure that any saved progress in the `.md` file is complete, consistent, and can be picked up by the next AI run.
  * When you write the code location in the .md file make sure to always provide exact lines and not what to look for this can take extra time for the AI that is implementing the .md file
  * Make sure to only write 1 .md file and do not add more on the same subject, if for example a new section needs to be made, don't make more .md files for parts in that same section