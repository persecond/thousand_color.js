/**
 * "There are not more than five primary colors, 
 * yet in combination they produce more hues than can ever been seen."
 *                                                          - Sun Tzu
 */
(function(){

    // "use strict";

    /**
     * RGB object
     * @param {string} hexColor 
     */
    var RGB = function(hexColor){
        var hex = sanitizeHexColor(hexColor);
        var R = hex.substring(0,2);
        var G = hex.substring(2,4);
        var B = hex.substring(4,6);
        this.R16 = R;
        this.G16 = G;
        this.B16 = B;
        this.R10 = parseInt(R, 16);
        this.G10 = parseInt(G, 16);
        this.B10 = parseInt(B, 16);
    }
    RGB.prototype.getRHex = function(){
        return this.R16;
    }
    RGB.prototype.getGHex = function(){
        return this.G16;
    }
    RGB.prototype.getBHex = function(){
        return this.B16;
    }
    RGB.prototype.getR10 = function(){
        return this.R10;
    }
    RGB.prototype.getG10 = function(){
        return this.G10;
    }
    RGB.prototype.getB10 = function(){
        return this.B10;
    }

    var CMYK = function(rgb){
        var computedC = 0;
        var computedM = 0;
        var computedY = 0;
        var computedK = 0;

        var R = rgb.getR10();
        var G = rgb.getG10();
        var B = rgb.getB10();

        if ( R==null || G==null || B==null ||
            isNaN(R) || isNaN(G)|| isNaN(B) )
        {
            throw 'Please enter numeric RGB values!';
        }
        if (R<0 || G<0 || B<0 || R>255 || G>255 || B>255) {
            throw 'RGB values must be in the range 0 to 255.'
        }

        // BLACK
        if (R==0 && G==0 && B==0) {
            computedK = 1;
            return [0,0,0,1];
        }

        computedC = 1 - (R/255);
        computedM = 1 - (G/255);
        computedY = 1 - (B/255);

        var minCMY = Math.min(computedC, Math.min(computedM,computedY));
        computedC = (computedC - minCMY) / (1 - minCMY);
        computedM = (computedM - minCMY) / (1 - minCMY);
        computedY = (computedY - minCMY) / (1 - minCMY);
        computedK = minCMY;

        function to1Decimal(num){
            return Math.round( num * 10) / 10
        }

        this.C = to1Decimal(computedC);
        this.M = to1Decimal(computedM);
        this.Y = to1Decimal(computedY);
        this.K = to1Decimal(computedK);
    }
    CMYK.prototype.getC = function(){
        return this.C;
    }
    CMYK.prototype.getM = function(){
        return this.M;
    }
    CMYK.prototype.getY = function(){
        return this.Y;
    }
    CMYK.prototype.getK = function(){
        return this.K;
    }

    var HSV = function(rgb){
        var R = rgb.getR10();
        var G = rgb.getG10();
        var B = rgb.getB10();

        var max = Math.max(R, G, B), min = Math.min(R, G, B),
            d = max - min,
            h,
            s = (max === 0 ? 0 : d / max),
            v = max / 255;

        switch (max) {
            case min: h = 0; break;
            case R: h = (G - B) + d * (G < B ? 6: 0); h /= 6 * d; break;
            case G: h = (B - R) + d * 2; h /= 6 * d; break;
            case B: h = (R - G) + d * 4; h /= 6 * d; break;
        }

        this.H = h;
        this.S = s;
        this.V = v;
    }
    HSV.prototype.getH = function(){
        return this.H;
    }
    HSV.prototype.getS = function(){
        return this.S;
    }
    HSV.prototype.getV = function(){
        return this.V;
    }

    function getColorFromHSV(h, s, v){
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        var complementHex = makeHexStringFromRGB(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255))

        return new Color(complementHex);
    }

    var Color = function(hexColor){
        var sanitized = ensureSixHexDigits(hexColor);
        this.hex = makeHexString(sanitized);
        this.rgb = new RGB(sanitized);
        this.cmyk = new CMYK(this.rgb);
        this.hsv = new HSV(this.rgb);
    }
    Color.prototype.getHex = function(){
        return this.hex;
    }
    Color.prototype.getRGB = function(){
        return this.rgb;
    }
    Color.prototype.getCMYK = function(){
        return this.cmyk;
    }
    Color.prototype.getHSV = function(){
        return this.hsv;
    }
    Color.prototype.makeComplement = function(){
        var hsv = this.getHSV();
        var h = hsv.getH();
        var s = hsv.getS();
        var v = hsv.getV();

        //inverse hue
        h += .5;
        if(h > 1){
            h--;
        }

        return getColorFromHSV(h, s, v);
    }
    Color.prototype.makeAnalagous = function(variation){
        var hsv = this.getHSV();
        var h = hsv.getH();
        var s = hsv.getS();
        var v = hsv.getV();

        if(typeof varation === "undefined"){
            variation = 1/50;
        }else if(variation > 1 || variation < 0){
            throw "Variation must be a positive number between 0 and 1";
        }

        var h1 = h + variation;
        var h2 = h - variation;

        function correctHue(h){
            if(h > 1)h--;
            else if(h < 1)h++;
        }

        correctHue(h1);
        correctHue(h2);

        return [
            getColorFromHSV(h1, s, v),
            getColorFromHSV(h2, s, v)
        ];
    }
    Color.prototype.makeTriads = function(){
        var hsv = this.getHSV();
        var h = hsv.getH();
        var s = hsv.getS();
        var v = hsv.getV();

        var h1 = h + (1/3);
        var h2 = h + (2/3);

        if(h1 > 1) h1--;
        if(h2 > 1) h2--;

        return [
            getColorFromHSV(h1, s, v),
            getColorFromHSV(h2, s, v)
        ];
    }
    /**
     * Produces similar colors.
     * Colors are produced by randomly increasing/decreasing the R, G, and B values
     * independently bound by a maximum variation.
     * @param {object} options
     */
    Color.prototype.makeSimilar = function(options){

        var maxColors, variation;
        if(typeof options === 'object'){
            maxColors = options.maxColors;
            variation = options.variation;
        }

        const MAX_COLORS = typeof maxColors === 'number' ? maxColors : 5;
        const VARIATION = typeof variation === 'number' ? variation : 5;

        const rgb = this.getRGB();

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

            var R = rgb.getR10() + rVariation;
            var G = rgb.getG10() + gVariation;
            var B = rgb.getB10() + bVariation;

            colors[i] = new Color(makeHexStringFromRGB(
                ensureInHexRange(R),
                ensureInHexRange(G),
                ensureInHexRange(B)
            ));
        }
        return colors;

    }
    /**
     * Produces proportional colors.
     * Colors are produced by increasing/decreasing the R, G, and B values
     * by a randomly generated percentage. All R, G and B values for each proportional
     * color use the same percent difference.
     * @param {object} options
     */
    Color.prototype.makeProportional = function(options){

        var maxColors, maxPercent;
        if(typeof options === 'object'){
            maxColors = options.maxColors;
            maxPercent = options.maxPercent;
        }

        const MAX_COLORS = typeof maxColors === 'number' ? maxColors : 5;
        const PERCENT = typeof maxPercent === 'number' ? maxPercent : 10;

        const rgb = this.getRGB();

        const max = Math.floor((PERCENT / 2));
        const min = -1 * max;
        function getRandomPercent() {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var colors = [];
        for(var i = 0; i < MAX_COLORS; i++){

            var percent = getRandomPercent() / 100;

            var R = rgb.getR10() + Math.floor(rgb.getR10() * percent);
            var G = rgb.getG10() + Math.floor(rgb.getG10() * percent);
            var B = rgb.getB10() + Math.floor(rgb.getB10() * percent);

            colors[i] = new Color(makeHexStringFromRGB(
                ensureInHexRange(R),
                ensureInHexRange(G),
                ensureInHexRange(B)
            ));
        }

        return colors;

    }

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
        var hex = hexColor.trim().toUpperCase();
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
            throw "Invalid hex color length provided '" + hex +  "' , expected 3 or 6 hex digits.";
        }
    }

    /**
     * Builds a hex string from the given RGB decimal values.
     * @param {number} R 
     * @param {number} G 
     * @param {number} B 
     */
    function makeHexStringFromRGB(R, G, B){

        function to2Hex(decimal){
            var string = decimal.toString(16);
            if(string.length == 1){
                string = "0" + string;
            }
            return string;
        }

        var RString = to2Hex(R);
        var GString = to2Hex(G);
        var BString = to2Hex(B);


        return makeHexString(RString + GString + BString);
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

    function getColor(givenHexColor){
        return new Color(givenHexColor);
    }

    //is this node?
    if(typeof exports === 'object'){
        //oh yeah, this is node. cool
        exports.getColor = getColor;
    }else{
        //todo make this safer
        thousand_color = {
            getColor: getColor
        }
    }

}());