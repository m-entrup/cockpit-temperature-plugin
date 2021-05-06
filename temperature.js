window.onload = function () {
    resize_canvas()

    var chart = new SmoothieChart({millisPerPixel: 200, maxValueScale: 1.1, minValueScale: 1.1, scaleSmoothing: 0.1, grid: { fillStyle: '#ffffff', millisPerLine: 5000, verticalSections: 8 }, labels: { fillStyle: '#0000ff', fontSize: 18, precision: 1 }, timestampFormatter: SmoothieChart.timeFormatter }),
        canvas = document.getElementById('smoothie-chart'),
        series1 = new TimeSeries(),
        series2 = new TimeSeries(),
        average_array1 = [],
        average_array2 = [];

    chart.addTimeSeries(series1, { lineWidth: 3.5, strokeStyle: '#ff0000' });
    chart.addTimeSeries(series2, { lineWidth: 3.5, strokeStyle: '#ff00ff' });
    chart.streamTo(canvas, 500);

    function run_proc(series1, series2, average_array1, average_array2) {
        var proc = cockpit.spawn("sensors");
        // var proc = cockpit.spawn(["vcgencmd","measure_temp"]);
        proc.done(function(data){
            var time = new Date().getTime(),
                pt1 = parseFloat(data.match(/Core 0:\s+\+([0-9\.]+)/)[1]),
                pt2 = parseFloat(data.match(/Core 1:\s+\+([0-9\.]+)/)[1]);
            series2.append(time, pt1);
            series1.append(time, pt2);
            document.getElementById("cur_temp1").innerHTML = pt1;
            document.getElementById("cur_temp2").innerHTML = pt2;
            average_array1.push(pt1);
            if(average_array1.length > 5*60){
                average_array1.shift();
            }
            average_array2.push(pt2);
            if(average_array2.length > 5*60){
                average_array2.shift();
            }
            document.getElementById("avg_temp1").innerHTML = average(average_array1);
            document.getElementById("avg_temp2").innerHTML = average(average_array2);
            console.log(average_array1, average_array2);
        });
    };

    //run_proc(series)
    setInterval(function () { run_proc(series1, series2, average_array1, average_array2) }, 1000);
}

function resize_canvas() {
    document.getElementById("smoothie-chart").width = window.innerWidth - 50;
}

function average(array) {
    var sum = 0;
    var count = array.length;
    for (var i = 0; i < count; i++) {
      sum = sum + array[i];
    }
    return sum / count;
  }
