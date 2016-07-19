var App = {
    config: {
        kp: 1,

        ki: 1,
        iMin: -2,
        iMax: 2,

        kd: 1,

        timeout: 2000
    },

    chart: null,

    iSum: 0,

    oldValue: 0,
    value: 0,
    customValue: 10,

    iteration: 0,
    stop: false,

    initialize: function () {
        this.setDefaults();
        this.setEvents();
        this.drawChart();
    },

    setDefaults: function () {
        $('#kp').val(this.config.kp);
        $('#ki').val(this.config.ki);
        $('#kd').val(this.config.kd);
        $('#timeout').val(this.config.timeout);
        $('#stop').hide();
    },

    setEvents: function () {
        var self = this;

        $('#config').submit(function () {
            self.setConfig();

            return false;
        });

        $('#custom').change(function (e) {
            self.setCustomValue(e.target.value);
        });

        $('#custom').on('input', function (e) {
            $('#custom-val').text(e.target.value);
        });

        $('#stop').click(function () {
            self.stop = true;
            $('#stop').toggle();
            $('#start').toggle();
        });

        $('#start').click(function () {
            self.stop = false;
            self.loop();
            $('#start').toggle();
            $('#stop').toggle();
        });
    },

    setConfig: function () {
        this.config.kp = $('#kp').val();
        this.config.ki = $('#ki').val();
        this.config.kd = $('#kd').val();
        this.config.timeout = $('#timeout').val();
    },

    drawChart: function () {
        var ctx = $("#chart").get(0).getContext("2d"),
        data = {
            labels: [],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: []
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: []
                }
            ]
        };

        this.chart = new Chart(ctx).Line(data);
    },

    setCustomValue: function (value) {
        $('#custom-val').text(value);
        this.customValue = value;
    },

    setValue: function (value) {
        this.value = value;
        $('#current').val(value);
    },

    loop: function () {
        var self = this;

        console.log('start loop');

        if (this.customValue != this.value) {
            console.log('working...');
            console.log('current value: ' + this.value);
            console.log('custom value: ' + this.customValue);

            var error = this.customValue - this.value;
            var value = this.value + this.regulator(error, this.customValue);

            console.log('new value: ' + value);


            this.setValue(value);

            this.chart.addData([this.customValue, value], this.iteration);

            this.iteration++;
        }

        setTimeout(function () {
            if (!self.stop) self.loop();
        }, this.config.timeout)
    },

    regulator: function (error, y) {
        // Пропорційна:
        var up = this.config.kp * error;

        // Інтегральна:
        this.iSum += error;

        if (this.iSum < this.config.iMin) this.iSum = this.config.iMin;
        if (this.iSum > this.config.iMax) this.iSum = this.config.iMax;

        var ui = this.config.ki * this.iSum;

        // Диференційна:
        var ud = this.config.kd * (y - this.oldValue);
        this.oldValue = y;

        return up + ui + ud;
    }

};

$(function() {
    App.initialize();
});
