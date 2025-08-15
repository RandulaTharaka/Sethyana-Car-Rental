document.addEventListener('DOMContentLoaded', initialize);

let chartRevenue;

function initialize(){
    loadReportUI();
}

function loadReportUI() {
    dteStartdate.max = nowDate("date");
    dteEnddate.max = nowDate("date");
    // Set min max for date selectors

    // Restrict Receptionist to generate daily reports only
    if(session.getObject("activeuser").Id.designationId.name == "Receptionist"){
        dteStartdate.value = nowDate("date");
        dteEnddate.value = nowDate("date");
        cmbReportType.value = "Daily";

        dteStartdate.disabled = true;
        dteEnddate.disabled = true;
        cmbReportType.disabled = true;
    }else {
        dteStartdate.disabled = false;
        dteEnddate.disabled = false;
        cmbReportType.disabled = false;
    }
}

function startDateCH() {
    dteEnddate.min = dteStartdate.value;
}

function getReportType(){
    if(cmbReportType.value === 'Yearly'){
        return 'Year';
    }else if(cmbReportType.value === 'Monthly'){
        return 'Month';
    }else if(cmbReportType.value === 'Weekly'){
        return 'Week';
    }else if(cmbReportType.value === 'Daily'){
        return 'Date';
    }
}

function generateTableAndChartMC() {
    // Get dataset [ByDate, SUM Revenue]
    var dataSetRevenue = httpRequest("/report/revenue_report?sdate="+ dteStartdate.value+"&edate="+dteEnddate.value+"&type="+cmbReportType.value,"GET");

    var chartLabels = new Array();
    var chartData = new Array();

    var tableData = new Array();
    var totalamount = 0;

    // Pushing dataset into chart & table
    for (var index in dataSetRevenue){
        chartLabels.push(dataSetRevenue[index][1]);``
        chartData.push(dataSetRevenue[index][2]);

        var tddata = new Object();
        tddata.reportType = dataSetRevenue[index][1];
        tddata.revenue = dataSetRevenue[index][2];
        tableData.push(tddata);

        totalamount = parseFloat(totalamount)  + parseFloat(dataSetRevenue[index][2]);
    }

    // Remove table if exist
    if(document.getElementById('tblIncome')){
        tableParent.removeChild(tblIncome);
    }

    // Create table
    var metadata = [
        {name: getReportType(), search: false, datatype: 'text', property: 'reportType'},
        {name: 'Revenue', search: false, datatype: 'amount', property: 'revenue'},
    ];
    table("tableParent", "tblIncome", metadata, false);
    fillTable('tblIncome',tableData,fillForm,btnDeleteMC,viewitem);
    createTableFooter(totalamount);


    // Destroy chart if exist
    if(chartRevenue !== undefined){
        chartRevenue.destroy();
    }
    createChart(chartLabels, chartData);
}

function createTableFooter(totalamount){
    if(document.getElementById('totalRevRow') === null){
        let tfooter = document.createElement("tfoot");
        let tfooterrow = document.createElement("tr");
        let tfooterrowtd1 = document.createElement("td");
        let tfooterrowtd2 = document.createElement("td");
        let tfooterrowtd3 = document.createElement("td");

        tfooterrow.setAttribute('id', 'totalRevRow');
        tfooterrowtd1.setAttribute('id', 'totalRevTD1');
        tfooterrowtd2.setAttribute('id', 'totalRevTD2');
        tfooterrowtd3.setAttribute('id', 'totalRevTD3');

        tfooterrow.appendChild(tfooterrowtd1);
        tfooterrow.appendChild(tfooterrowtd2);
        tfooterrow.appendChild(tfooterrowtd3);
        tfooter.appendChild(tfooterrow);
        tblIncome.appendChild(tfooter);
    }
    totalRevRow.style.backgroundColor = 'lightgrey';
    totalRevRow.style.fontWeight = '500';
    totalRevTD2.innerHTML = 'Total Revenue';
    totalRevTD3.innerHTML = 'Rs ' + parseFloat(totalamount).toFixed(2);
}

function createChart(chartLabels, chartData){
    const ctx = document.getElementById('myChart').getContext('2d');
    chartRevenue = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Revenue by ' + getReportType(),
                data: chartData,
                backgroundColor: getRandomColorHex(chartLabels.length)
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            return 'Rs.' + value;
                        },
                        fontSize: 12.5
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 12.5
                    }
                }],
            },
            legend: {
                labels: {
                    fontSize: 14
                }
            }
        }
    });
}
function fillForm() {}
function btnDeleteMC() {}
function viewitem() {}

function printChart() {
    var newwindow = window.open();

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='resources/static/vendor/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Item Details : </h1></div>" +
        "<div><img src='"+myChart.toBase64Image()+"'></div>"+
        "</body>" +
        "</html>");
    setTimeout(function () {newwindow.print(); },1200) ;
}