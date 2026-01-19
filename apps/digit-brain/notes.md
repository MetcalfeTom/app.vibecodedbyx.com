# Digit Brain

## log
- 2026-01-19: Initial creation - neural network digit recognizer

## features
- 280x280 drawing canvas
- Real neural network in vanilla JS
- Network architecture: 784 → 64 → 32 → 10
- ReLU activation, softmax output
- Automatic digit centering
- 28x28 preview of network input
- Probability bars for all 10 digits
- Network activity visualization
- Touch support for mobile

## design
- Dark cyberpunk aesthetic
- Space Mono + Syne fonts
- Cyan/purple gradient accents
- Real-time network visualization
- Pixel preview display

## neural network
- Input: 784 neurons (28×28 pixels)
- Hidden 1: 64 neurons with ReLU
- Hidden 2: 32 neurons with ReLU
- Output: 10 neurons with softmax
- Feature detectors in first layer
- Region-based weight initialization

## preprocessing
- Scale drawing to 28×28
- Grayscale normalization (0-1)
- Center of mass calculation
- Automatic centering shift

## visualization
- Layer nodes with activation brightness
- Connection lines between layers
- Labels for each layer
- Real-time update on prediction

## todos
- Add actual pre-trained MNIST weights
- Add training mode with backprop
- Add confidence threshold indicator
- Add drawing suggestions
- Add multi-digit support

## issues
- Network not actually trained on MNIST data
- Predictions based on random initialized weights
- Could load real weights from JSON file

## notes
- This is an educational demo showing NN structure
- For accurate recognition, would need real trained weights
- MNIST weights would be ~100KB+ as JSON
