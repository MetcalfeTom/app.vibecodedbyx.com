# Gödel Machine - Recursive Self-Improving Agent

A visualization and implementation of Jürgen Schmidhuber's Gödel Machine principle - an agent that can formally prove improvements to its own code and self-modify.

## Concept

The Gödel Machine is a theoretical framework for self-improving AI systems that can:
1. Search for modifications to their own code
2. Formally prove that modifications will improve performance
3. Execute the modification only if proof is valid
4. Recursively improve their proof search algorithms

## Features

- **Formal Proof System**: Agent must prove improvements before self-modifying
- **Performance Metrics**: Track generations, improvements, and efficiency
- **Visual Proof Search**: See the search tree for formal proofs
- **Evolution Log**: Real-time logging of mutations and improvements
- **Code Display**: View current agent code as it evolves
- **Interactive Controls**: Start, pause, reset, or force evolution

## How It Works

1. **Base Code**: Agent starts with simple baseline code
2. **Mutation**: Generate random code mutations
3. **Proof Search**: Attempt to prove the mutation improves performance
4. **Measurement**: Compare performance of old vs new code
5. **Self-Modify**: If proof succeeds (>5% improvement), adopt new code
6. **Repeat**: Continue evolving recursively

## Key Principles

### Gödel Machine Core Loop
```
while(running):
  newCode = generateMutation(currentCode)
  if proveImprovement(newCode, currentCode):
    currentCode = newCode
    improvements++
```

### Proof System
- Measures actual performance (execution time)
- Requires >5% improvement for acceptance
- Formal verification before modification
- Prevents degradation

## Usage

1. **Start Agent**: Begin autonomous evolution
2. **Watch Evolution**: Observe proof searches and code changes
3. **Force Evolution**: Manually trigger evolution cycle
4. **Pause/Reset**: Control the simulation

## Implementation Details

- **Language**: Pure JavaScript (self-contained)
- **Performance Measurement**: Uses `performance.now()` for timing
- **Code Execution**: Uses `eval()` for dynamic code execution
- **Visualization**: DOM-based proof tree rendering
- **Safety**: Mutations are controlled and validated

## Theoretical Background

Based on:
- Jürgen Schmidhuber's "Gödel Machines: Fully Self-Referential Optimal Universal Self-Improvers"
- Formal verification of program improvements
- Recursive self-improvement in AI systems
- Meta-learning and optimization

## Limitations

This is a simplified demonstration. A true Gödel Machine would:
- Use formal logic (Peano arithmetic, ZFC)
- Have provably optimal proof search
- Modify its own proof search algorithms
- Guarantee convergence properties
- Handle arbitrary computational complexity

## References

- Schmidhuber, J. (2007). "Gödel Machines: Fully Self-Referential Optimal Universal Self-Improvers"
- https://people.idsia.ch/~juergen/goedelmachine.html

## Live Demo

Visit: `https://sloppy.live/godel-agent`

## License

Built live on sloppy.live
