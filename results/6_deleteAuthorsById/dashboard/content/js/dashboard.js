/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();
    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter)
        regexp = new RegExp(seriesFilter, 'i');

    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            var newRow = tBody.insertRow(-1);
            for(var col=0; col < item.data.length; col++){
                var cell = newRow.insertCell(-1);
                cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 64.66270997827354, "KoPercent": 35.33729002172646};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
               "color" : "red"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "blue"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round(series.percent)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.41905569392189074, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "httpRequest_deleteAuthorsbyId_spr4"], "isController": false}, {"data": [0.49277531220972237, 500, 1500, "httpRequest_deleteAuthorsId_spr1"], "isController": false}, {"data": [0.7495926680244399, 500, 1500, "httpRequest_deleteAuthorsById_spr2"], "isController": false}, {"data": [0.0, 500, 1500, "httpRequest_deleteAuthorsById_spr3"], "isController": false}, {"data": [0.0, 500, 1500, "httpRequest_deleteAuthorsbyId_spr5"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 37742, 13337, 35.33729002172646, 4098.0, 5096.699999999997, 9760.699999999997, 47.38653384743449, 5.434841142207312, 177, 21284], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "90th pct", "95th pct", "99th pct", "Throughput", "KB/sec", "Min", "Max"], "items": [{"data": ["httpRequest_deleteAuthorsbyId_spr4", 4539, 4539, 100.0, 4789.0, 6072.0, 10706.40000000004, 33.10673804904378, 3.4177550632922933, 544, 21284], "isController": false}, {"data": ["httpRequest_deleteAuthorsId_spr1", 9689, 9, 0.0928888430178553, 4133.0, 5218.5, 10094.800000000003, 41.961888263317455, 5.051416502003032, 177, 21090], "isController": false}, {"data": ["httpRequest_deleteAuthorsById_spr2", 14730, 5, 0.03394433129667346, 2425.7999999999993, 3652.7999999999956, 7952.450000000003, 96.12121844900942, 11.435946819288194, 178, 21102], "isController": false}, {"data": ["httpRequest_deleteAuthorsById_spr3", 4662, 4662, 100.0, 4755.7, 5917.699999999999, 10260.609999999993, 33.135976914274345, 3.3671912204231904, 549, 21061], "isController": false}, {"data": ["httpRequest_deleteAuthorsbyId_spr5", 4122, 4122, 100.0, 4806.0, 5994.849999999995, 18452.47, 30.641600321134675, 3.4753147463630754, 546, 21120], "isController": false}]}, function(index, item){
        switch(index){
            case 3:
                item = item.toFixed(2) + '%';
                break;
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.ConnectException", 44, 0.32990927494938893, 0.11658099729744052], "isController": false}, {"data": ["400", 13295, 99.68508660118468, 35.226008160669814], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
});
