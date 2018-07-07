# thousand_color.js
JS library for color analysis and comparison

Useful library for visualizing information about selected colors, and producing similar/complementary colors.

Usage:
```javascript

//returns a Color object that exposes methods to retrieve color information
//currently only exposes hex construction of colors, and supports 6 or 3 digit hex values
var color = thousand_color.getColor("#3a0232");

//Color object can retrieve its color information in several representative text formats
console.log(color.getHex());
console.log(color.getRGB());
console.log(color.getCMYK());
console.log(color.getHSV());

//methods to produce related colors
var complement = color.makeComplement();
var analagous = color.makeAnalagous(); 
var triads = color.makeTriads();

//a color can produce a collection of randomly similar colors with some degree of variance
var similarColors = color.makeSimilar({maxColors: 12, variation: 30});
```
