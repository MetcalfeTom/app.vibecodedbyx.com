# TSP Genetic Algorithm

## log
- 2026-01-05: Initial creation - genetic algorithm TSP with neon aesthetic

## features
- Click to add cities manually
- Random city generation
- Genetic algorithm optimization
- Tournament selection (size 5)
- Order crossover (OX)
- Swap mutation + 2-opt improvement
- Elitism (best preserved)
- Real-time fitness graph
- Adjustable population size
- Adjustable mutation rate
- Step-by-step or continuous evolution

## algorithm
1. Initialize random population of routes
2. Tournament selection picks parents
3. Order crossover creates children
4. Mutation: random swaps + occasional 2-opt
5. Elitism: best route always survives
6. Repeat until convergence

## design
- Neon cyberpunk aesthetic
- Magenta glowing cities with halos
- Green/yellow gradient for best route
- Cyan faint lines for current population best
- Grid background
- Fitness history mini-graph
- Orbitron + Share Tech Mono fonts

## technical
- Vanilla JavaScript + Canvas 2D
- 5 generations per animation frame
- Fisher-Yates shuffle for route randomization
- Fitness = total Euclidean distance

## controls
- Click: Add city
- Step: Single generation
- Evolve: Continuous evolution
- Random: Generate 25 random cities
- Clear: Reset everything
- Pop slider: Population size 20-200
- Mut slider: Mutation rate 1-50%

## issues
- Large city counts (50+) may slow down
- Very low mutation can cause stagnation

## todos
- Add simulated annealing option
- Add ant colony optimization
- Add nearest neighbor initial seed
- Add export route functionality
