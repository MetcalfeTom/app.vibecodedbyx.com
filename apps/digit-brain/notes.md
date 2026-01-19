# Digit Brain

## log
- 2026-01-19: Improved with template-based recognition and better feature extraction
- 2026-01-19: Initial creation - neural network digit recognizer

## features
- 280x280 drawing canvas
- Template-based neural network in vanilla JS
- Hand-crafted digit templates (0-9)
- Feature extraction with regional detectors
- Normalized correlation matching
- Mismatch penalty for better discrimination
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
- Hidden 1: 64 regional feature detectors (8×8 grid)
- Hidden 2: 22 combined features (lines, diagonals, quadrants)
- Output: 10 template matchers with softmax
- Learned biases for each digit class

## digit templates
- 0: Oval/ellipse shape
- 1: Vertical line with optional top hook
- 2: Top curve + diagonal + bottom horizontal
- 3: Two right-facing curves stacked
- 4: Vertical + diagonal + horizontal cross
- 5: Top horizontal + left vertical + bottom curve
- 6: Curved stroke + bottom loop
- 7: Top horizontal + diagonal down
- 8: Two stacked loops (figure-8)
- 9: Top loop + vertical stroke down

## feature detectors
- 64 regional density detectors (overlapping 5×5 patches)
- 8 horizontal line detectors
- 8 vertical line detectors
- 2 diagonal detectors
- 4 quadrant density detectors
- Center density detector
- Edge/perimeter density detector

## preprocessing
- Scale drawing to 28×28
- Grayscale normalization (0-1)
- Center of mass calculation
- Automatic centering shift

## scoring
- Normalized correlation between input and templates
- Mismatch penalty for pixels outside template
- Per-digit bias adjustments
- Softmax for probability distribution

## todos
- Add more template variations per digit
- Add rotation invariance
- Add scale normalization
- Add confidence threshold indicator
- Add drawing suggestions

## issues
- Works best with centered, upright digits
- May confuse similar shapes (3/8, 6/9, 1/7)

## notes
- Template matching approach is interpretable
- No training required - hand-crafted features
- Reasonably accurate for clear handwriting
