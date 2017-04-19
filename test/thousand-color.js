const expect = require("chai").expect;
const thousandColor = require("../thousand-color");

describe("test color", function(){
    it('should return given color', function(done){
        expect(thousandColor.getColor("#FFFFFF").hex).to.eql("#FFFFFF");
        expect(thousandColor.getColor("FFFFFF").hex).to.eql("#FFFFFF");
        expect(thousandColor.getColor("   FFFFFF  ").hex).to.eql("#FFFFFF");
        expect(thousandColor.getColor("   #FFFFFF  ").hex).to.eql("#FFFFFF");
        expect(thousandColor.getColor("#FFF").hex).to.eql("#FFFFFF");
        expect(thousandColor.getColor("#123").hex).to.eql("#112233");
        done();
    });

    it('should parse RGB breakdown', function(done){
        var rgb;

        rgb = thousandColor.getColor("FF00CC").getRGB();

        expect(rgb.getR10()).to.eql(255);
        expect(rgb.getG10()).to.eql(0);
        expect(rgb.getB10()).to.eql(204);

        rgb = thousandColor.getColor("F0C").getRGB();

        expect(rgb.getR10()).to.eql(255);
        expect(rgb.getG10()).to.eql(0);
        expect(rgb.getB10()).to.eql(204);

        done();
    });

    it('should parse CMYK breakdown', function(done){
        var cmyk;

        cmyk = thousandColor.getColor("FF00CC").getCMYK();

        expect(cmyk.C).to.eql(0);
        expect(cmyk.M).to.eql(1);
        expect(cmyk.Y).to.eql(.2);
        expect(cmyk.K).to.eql(0);

        done();
    });

    it('should return expected number of similar colors', function(done){
        const expectedVariation = 5;

        var similarColors, inputColor, color, inputR, inputG, inputB;

        inputColor = "22CC55";
        color = thousandColor.getColor(inputColor)
        inputR = color.getRGB().getR10();
        inputG = color.getRGB().getG10();
        inputB = color.getRGB().getB10();

        similarColors = color.makeSimilar();
        expect(similarColors.length).to.eql(5);

        for(var i in similarColors){
            var similarColor = similarColors[i];
            expect(Math.abs(inputR - similarColor.getRGB().getR10())).to.lt(expectedVariation);
            expect(Math.abs(inputG - similarColor.getRGB().getG10())).to.lt(expectedVariation);
            expect(Math.abs(inputB - similarColor.getRGB().getB10())).to.lt(expectedVariation);
        }

        similarColors = color.makeSimilar({maxColors: 10});
        expect(similarColors.length).to.eql(10);

        for(var i in similarColors){
            var similarColor = similarColors[i];
            expect(Math.abs(inputR - similarColor.getRGB().getR10())).to.lt(expectedVariation);
            expect(Math.abs(inputG - similarColor.getRGB().getG10())).to.lt(expectedVariation);
            expect(Math.abs(inputB - similarColor.getRGB().getB10())).to.lt(expectedVariation);
        }

        done();
    });

    it('should return similar colors of expected variation', function(done){

        var expectedVariation, similarColors, inputColor, color, inputR, inputG, inputB;

        inputColor = "22CC55";
        color = thousandColor.getColor(inputColor)
        inputR = color.getRGB().getR10();
        inputG = color.getRGB().getG10();
        inputB = color.getRGB().getB10();

        expectedVariation = 5;
        similarColor = color.makeSimilar({variation: expectedVariation});
        for(var i in similarColors){
            var similarColor = similarColors[i];
            expect(Math.abs(inputR - similarColor.getRGB().getR10())).to.lt(expectedVariation);
            expect(Math.abs(inputG - similarColor.getRGB().getG10())).to.lt(expectedVariation);
            expect(Math.abs(inputB - similarColor.getRGB().getB10())).to.lt(expectedVariation);
        }

        expectedVariation = 10;
        similarColor = color.makeSimilar({variation: expectedVariation});
        for(var i in similarColors){
            var similarColor = similarColors[i];
            expect(Math.abs(inputR - similarColor.getRGB().getR10())).to.lt(expectedVariation);
            expect(Math.abs(inputG - similarColor.getRGB().getG10())).to.lt(expectedVariation);
            expect(Math.abs(inputB - similarColor.getRGB().getB10())).to.lt(expectedVariation);
        }

        expectedVariation = 2;
        similarColor = color.makeSimilar({variation: expectedVariation});
        for(var i in similarColors){
            var similarColor = similarColors[i];
            expect(Math.abs(inputR - similarColor.getRGB().getR10())).to.lt(expectedVariation);
            expect(Math.abs(inputG - similarColor.getRGB().getG10())).to.lt(expectedVariation);
            expect(Math.abs(inputB - similarColor.getRGB().getB10())).to.lt(expectedVariation);
        }

        done();
    });

    it('should return expected number of proportional colors', function(done){

        var proportionalColors, inputColor;

        inputColor = "22CC55";

        var color = thousandColor.getColor(inputColor);

        proportionalColors = color.makeProportional();
        expect(proportionalColors.length).to.eql(5);

        proportionalColors = color.makeProportional({maxColors: 10});
        expect(proportionalColors.length).to.eql(10);

        proportionalColors = color.makeProportional({maxColors: 2});
        expect(proportionalColors.length).to.eql(2);

        done();
    });

    it('should return proportional colors of expected variation', function(done){

        var expectedVariation, proportionalColors, inputColor, color, inputR, inputG, inputB;

        inputColor = "22CC55";
        color = thousandColor.getColor(inputColor);
        inputR = color.getRGB().getR10();
        inputG = color.getRGB().getG10();
        inputB = color.getRGB().getB10();

        //assert default variation is 10 percent
        proportionalColors = color.makeProportional();
        for(var i in proportionalColors){
            var proportionalColor = proportionalColors[i];
            expect(Math.abs(inputR - proportionalColor.getRGB().getR10())).to.lt(inputR * 0.1);
            expect(Math.abs(inputG - proportionalColor.getRGB().getG10())).to.lt(inputG * 0.1);
            expect(Math.abs(inputB - proportionalColor.getRGB().getB10())).to.lt(inputB * 0.1);
        }

        expectedVariation = 20;
        proportionalColors = color.makeProportional({expectedVariation: expectedVariation});
        for(var i in proportionalColors){
            var proportionalColor = proportionalColors[i];
            expect(Math.abs(inputR - proportionalColor.getRGB().getR10())).to.lt(inputR * 0.2);
            expect(Math.abs(inputG - proportionalColor.getRGB().getG10())).to.lt(inputG * 0.2);
            expect(Math.abs(inputB - proportionalColor.getRGB().getB10())).to.lt(inputB * 0.2);
        }

        expectedVariation = 50;
        proportionalColors = color.makeProportional({expectedVariation: expectedVariation});
        for(var i in proportionalColors){
            var proportionalColor = proportionalColors[i];
            expect(Math.abs(inputR - proportionalColor.getRGB().getR10())).to.lt(inputR * 0.5);
            expect(Math.abs(inputG - proportionalColor.getRGB().getG10())).to.lt(inputG * 0.5);
            expect(Math.abs(inputB - proportionalColor.getRGB().getB10())).to.lt(inputB * 0.5);
        }

        done();
    });

    it('should produce correct complement', function(done){
        var color = thousandColor.getColor("#00B259");
        var complement = color.makeComplement();
        expect(complement.getHex()).to.eql("#B20059");
        var doubleComplement = complement.makeComplement();
        expect(doubleComplement.getHex()).to.eql("#00B259");
        done();
    });

    it('should produce correct triads', function(done){
        var color = thousandColor.getColor("#B20059");
        var triads = color.makeTriads();

        var triadHex = [];
        for(var i in triads){
            triadHex.push(triads[i].getHex());
        }
        expect(triadHex.indexOf("#59B200")).to.gt(-1);
        expect(triadHex.indexOf("#0059B2")).to.gt(-1);

        done();
    });
});