const expect = require("chai").expect;
const thousandColor = require("../thousand-color");

function analyzeColor(color){
    return thousandColor.analyzeColor(color);
}

describe("test color", function(){
    it('should return given color', function(done){
        expect(analyzeColor("#FFFFFF").hex).to.eql("#FFFFFF");
        expect(analyzeColor("FFFFFF").hex).to.eql("#FFFFFF");
        expect(analyzeColor("   FFFFFF  ").hex).to.eql("#FFFFFF");
        expect(analyzeColor("   #FFFFFF  ").hex).to.eql("#FFFFFF");
        expect(analyzeColor("#FFF").hex).to.eql("#FFFFFF");
        expect(analyzeColor("#123").hex).to.eql("#112233");
        done();
    });

    it('should parse RGB breakdown', function(done){
        var rgb;

        rgb = analyzeColor("FF00CC").rgb;

        expect(rgb.R10).to.eql(255);
        expect(rgb.G10).to.eql(0);
        expect(rgb.B10).to.eql(204);

        rgb = analyzeColor("F0C").rgb;

        expect(rgb.R10).to.eql(255);
        expect(rgb.G10).to.eql(0);
        expect(rgb.B10).to.eql(204);

        done();
    });

    it('should return expected number of similar colors', function(done){
        const expectedVariation = 5;

        var similarColors, inputColor, inputAnalysis, inputR, inputG, inputB;

        inputColor = "22CC55";
        similarColors = thousandColor.getSimilarColors(inputColor);
        expect(similarColors.length).to.eql(5);

        inputAnalysis = analyzeColor(inputColor)
        inputR = inputAnalysis.rgb.R10;
        inputG = inputAnalysis.rgb.G10;
        inputB = inputAnalysis.rgb.B10;
        for(var i in similarColors){
            var similarAnalysis = analyzeColor(similarColors[i]);
            expect(Math.abs(inputR - similarAnalysis.rgb.R10)).to.lt(expectedVariation);
            expect(Math.abs(inputG - similarAnalysis.rgb.G10)).to.lt(expectedVariation);
            expect(Math.abs(inputB - similarAnalysis.rgb.B10)).to.lt(expectedVariation);
        }

        similarColors = thousandColor.getSimilarColors(inputColor, {maxColors: 10});
        expect(similarColors.length).to.eql(10);

        inputAnalysis = analyzeColor(inputColor)
        inputR = inputAnalysis.rgb.R10;
        inputG = inputAnalysis.rgb.G10;
        inputB = inputAnalysis.rgb.B10;
        for(var i in similarColors){
            var similarAnalysis = analyzeColor(similarColors[i]);
            expect(Math.abs(inputR - similarAnalysis.rgb.R10)).to.lt(expectedVariation);
            expect(Math.abs(inputG - similarAnalysis.rgb.G10)).to.lt(expectedVariation);
            expect(Math.abs(inputB - similarAnalysis.rgb.B10)).to.lt(expectedVariation);
        }

        done();
    });

    it('should return similar colors of expected variation', function(done){

        var expectedVariation, similarColors, inputColor, inputAnalysis, inputR, inputG, inputB;

        inputColor = "22CC55";
        inputAnalysis = analyzeColor(inputColor)
        inputR = inputAnalysis.rgb.R10;
        inputG = inputAnalysis.rgb.G10;
        inputB = inputAnalysis.rgb.B10;

        expectedVariation = 5;
        similarColors = thousandColor.getSimilarColors(inputColor, {variation: expectedVariation});
        for(var i in similarColors){
            var similarAnalysis = analyzeColor(similarColors[i]);
            expect(Math.abs(inputR - similarAnalysis.rgb.R10)).to.lt(expectedVariation);
            expect(Math.abs(inputG - similarAnalysis.rgb.G10)).to.lt(expectedVariation);
            expect(Math.abs(inputB - similarAnalysis.rgb.B10)).to.lt(expectedVariation);
        }

        expectedVariation = 10;
        similarColors = thousandColor.getSimilarColors(inputColor, {variation: expectedVariation});
        for(var i in similarColors){
            var similarAnalysis = analyzeColor(similarColors[i]);
            expect(Math.abs(inputR - similarAnalysis.rgb.R10)).to.lt(expectedVariation);
            expect(Math.abs(inputG - similarAnalysis.rgb.G10)).to.lt(expectedVariation);
            expect(Math.abs(inputB - similarAnalysis.rgb.B10)).to.lt(expectedVariation);
        }

        expectedVariation = 2;
        similarColors = thousandColor.getSimilarColors(inputColor, {variation: expectedVariation});
        for(var i in similarColors){
            var similarAnalysis = analyzeColor(similarColors[i]);
            expect(Math.abs(inputR - similarAnalysis.rgb.R10)).to.lt(expectedVariation);
            expect(Math.abs(inputG - similarAnalysis.rgb.G10)).to.lt(expectedVariation);
            expect(Math.abs(inputB - similarAnalysis.rgb.B10)).to.lt(expectedVariation);
        }

        done();
    });

    it('should return expected number of proportional colors', function(done){

        var similarColors, inputColor;

        inputColor = "22CC55";

        similarColors = thousandColor.getProportionalColors(inputColor, {maxColors: 1});
        done();
        return;

        similarColors = thousandColor.getProportionalColors(inputColor);
        expect(similarColors.length).to.eql(5);

        similarColors = thousandColor.getProportionalColors(inputColor, {maxColors: 10});
        expect(similarColors.length).to.eql(10);

        similarColors = thousandColor.getProportionalColors(inputColor, {maxColors: 2});
        expect(similarColors.length).to.eql(2);

        done();
    });

    it('should return proportional colors of expected variation', function(done){

        var expectedVariation, similarColors, inputColor, inputAnalysis, inputR, inputG, inputB;

        inputColor = "22CC55";
        inputAnalysis = analyzeColor(inputColor);
        inputR = inputAnalysis.rgb.R10;
        inputG = inputAnalysis.rgb.G10;
        inputB = inputAnalysis.rgb.B10;

        //assert default variation is 10 percent
        similarColors = thousandColor.getProportionalColors(inputColor);
        for(var i in similarColors){
            var similarAnalysis = analyzeColor(similarColors[i]);
            expect(Math.abs(inputR - similarAnalysis.rgb.R10)).to.lt(inputR * 0.1);
            expect(Math.abs(inputG - similarAnalysis.rgb.G10)).to.lt(inputG * 0.1);
            expect(Math.abs(inputB - similarAnalysis.rgb.B10)).to.lt(inputB * 0.1);
        }

        expectedVariation = 20;
        similarColors = thousandColor.getProportionalColors(inputColor, {maxColors: 10});
        for(var i in similarColors){
            var similarAnalysis = analyzeColor(similarColors[i]);
            expect(Math.abs(inputR - similarAnalysis.rgb.R10)).to.lt(inputR * 0.2);
            expect(Math.abs(inputG - similarAnalysis.rgb.G10)).to.lt(inputG * 0.2);
            expect(Math.abs(inputB - similarAnalysis.rgb.B10)).to.lt(inputB * 0.2);
        }

        expectedVariation = 50;
        similarColors = thousandColor.getProportionalColors(inputColor, {maxColors: 10});
        for(var i in similarColors){
            var similarAnalysis = analyzeColor(similarColors[i]);
            expect(Math.abs(inputR - similarAnalysis.rgb.R10)).to.lt(inputR * 0.5);
            expect(Math.abs(inputG - similarAnalysis.rgb.G10)).to.lt(inputG * 0.5);
            expect(Math.abs(inputB - similarAnalysis.rgb.B10)).to.lt(inputB * 0.5);
        }

        similarColors = thousandColor.getProportionalColors(inputColor, {maxColors: 2});

        done();
    });
});