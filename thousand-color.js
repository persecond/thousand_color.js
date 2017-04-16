/**
 * "There are not more than five primary colors, 
 * yet in combination they produce more hues than can ever been seen."
 *                                                          - Sun Tzu
 */
(function(){

    /**
     * Removes any leading "#" or white space from a hex color string.
     * @param {string} hexColor 
     */
    function sanitizeHexColor(hexColor){
        return hexColor.replace("#","").trim();
    }

    /**
     * Ensures that a hex color is formatted as #XXXXXX
     * @param {string} hexColor 
     */
    function makeHexString(hexColor){
        var hex = hexColor.trim();
        if(hex.indexOf("#") >= 0){
            return hex;
        }else{
            return "#" + hex;
        }
    }

    /**
     * Returns the provided hex color string as 6 digits.
     * FC2 is returned as FFCC22, 6 digit strings are returned as is.
     * @param {string} hexColor 
     */
    function ensureSixHexDigits(hexColor){
        var hex = sanitizeHexColor(hexColor);
        if(hex.length === 6){
            return hex;
        }else if(hex.length === 3){
            var R = hex.substring(0,1);
            var G = hex.substring(1,2);
            var B = hex.substring(2,3);
            return R + R + G + G + B + B;
        }else{
            throw "Invalid hex color length provided, expected 3 or 6 hex digits.";
        }
    }

    /**
     * Returns a breakdown of R, G and B values in decimal.
     * @param {string} hexColor 
     */
    function getRGBDecimal(hexColor){
        var hex = sanitizeHexColor(hexColor);
        var R = hex.substring(0,2);
        var G = hex.substring(2,4);
        var B = hex.substring(4,6);
        return {
            R10: parseInt(R, 16),
            G10: parseInt(G, 16),
            B10: parseInt(B, 16)
        }
    }

    /**
     * Builds a hex string from the given RGB decimal values.
     * @param {number} R 
     * @param {number} G 
     * @param {number} B 
     */
    function makeHexStringFromRGB(R, G, B){
        return makeHexString(R.toString(16) + G.toString(16) + B.toString(16));
    }

    /**
     * Returns the provided number, limiting it to be between 0 and 255.
     * 
     * Numbers greater than 255 are returned as 255.
     * Numbers less than 0 are returned as 0.
     * All other numbers are returned as is.
     * @param {number} number 
     */
    function ensureInHexRange(number){
        if(number > 255){
            return 255;
        }else if(number < 0){
            return 0;
        }else{
            return number;
        }
    }

    /**
     * Produces similar colors from the given hex color.
     * Colors are produced by randomly increasing/decreasing the R, G, and B values
     * independently bound by a maximum variation.
     * @param {string} givenHexColor 
     * @param {object} options
     */
    function getSimilarColors(givenHexColor, options){

        var maxColors, variation;
        if(typeof options === 'object'){
            maxColors = options.maxColors;
            variation = options.variation;
        }

        const MAX_COLORS = typeof maxColors === 'number' ? maxColors : 5;
        const VARIATION = typeof variation === 'number' ? variation : 5;

        const interpretedHex = ensureSixHexDigits(givenHexColor);
        const RGB = getRGBDecimal(interpretedHex);

        const maxVariation = Math.floor((VARIATION / 2));
        const minVariation = -1 * maxVariation;
        function getRandomVariation() {
            return Math.floor(Math.random() * (maxVariation - minVariation + 1)) + minVariation;
        }

        var colors = [];
        for(var i = 0; i < MAX_COLORS; i++){

            var rVariation = getRandomVariation();
            var gVariation = getRandomVariation();
            var bVariation = getRandomVariation();

            var R = RGB.R10 + rVariation;
            var G = RGB.G10 + gVariation;
            var B = RGB.B10 + bVariation;

            colors[i] = makeHexStringFromRGB(
                ensureInHexRange(R),
                ensureInHexRange(G),
                ensureInHexRange(B)
            );
        }
        return colors;

    }

    /**
     * Produces colors proportional to the given hex color.
     * Colors are produced by increasing/decreasing the R, G, and B values
     * by a randomly generated percentage. All R, G and B values for each proportional
     * color use the same percent difference.
     * @param {string} givenHexColor 
     * @param {object} options
     */
    function getProportionalColors(givenHexColor, options){

        var maxColors, maxPercent;
        if(typeof options === 'object'){
            maxColors = options.maxColors;
            maxPercent = options.maxPercent;
        }

        const MAX_COLORS = typeof maxColors === 'number' ? maxColors : 5;
        const PERCENT = typeof maxPercent === 'number' ? maxPercent : 10;

        const interpretedHex = ensureSixHexDigits(givenHexColor);
        const RGB = getRGBDecimal(interpretedHex);

        const max = Math.floor((PERCENT / 2));
        const min = -1 * max;
        function getRandomPercent() {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var colors = [];
        for(var i = 0; i < MAX_COLORS; i++){

            var percent = getRandomPercent() / 100;

            var R = RGB.R10 + Math.floor(RGB.R10 * percent);
            var G = RGB.G10 + Math.floor(RGB.G10 * percent);
            var B = RGB.B10 + Math.floor(RGB.B10 * percent);

            colors[i] = makeHexStringFromRGB(
                ensureInHexRange(R),
                ensureInHexRange(G),
                ensureInHexRange(B)
            );
        }

        return colors;

    }

    /**
     * Takes a starting hex color and returns analytical information.
     * @param {string} givenHexColor 
     */
    function analyzeColor(givenHexColor){

        const inputColor = givenHexColor;
        const interpretedHex = ensureSixHexDigits(inputColor);

        return {
            input: inputColor,
            hex: makeHexString(interpretedHex),
            rgb: getRGBDecimal(interpretedHex)
        }
    }

    //is this node?
    if(typeof exports === 'object'){
        //oh yeah, this is node. cool
        exports.analyzeColor = analyzeColor;
        exports.getSimilarColors = getSimilarColors;
        exports.getProportionalColors = getProportionalColors;
    }else{
        //todo make this safer
        thousand_color = {
            analyzeColor: analyzeColor,
            getSimilarColors: getSimilarColors,
            getProportionalColors: getProportionalColors
        }
    }

}());