document.addEventListener("DOMContentLoaded", function(event) { 

    const color = "#FFD750";

    function setColorsInUI(){

        var analysis = thousand_color.analyzeColor(color);
        var similarColors = thousand_color.getProportionalColors(color, {maxColors: 24, maxPercent: 30});

        var html = "";
        for(var i in similarColors){
            var similarColor = similarColors[i];
            html += "<div class='color' style='background-color:" + similarColor + "'></div>";
        }

        document.getElementsByClassName("colors")[0].innerHTML = html;

        setTimeout(setColorsInUI, 100);

    }

    setColorsInUI();

});