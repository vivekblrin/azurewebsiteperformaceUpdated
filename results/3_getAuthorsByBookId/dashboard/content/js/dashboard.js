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

    var data = {"OkPercent": 98.72713317129333, "KoPercent": 1.272866828706665};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6296853012664705, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3313752591568763, 500, 1500, "httpRequest_GetAuthorsBookId_spr4"], "isController": false}, {"data": [0.2793017456359102, 500, 1500, "httpRequest_GetAuthorsBookId_spr5"], "isController": false}, {"data": [0.8044298820445609, 500, 1500, "httpRequest_GetAuthorsBookId_spr1"], "isController": false}, {"data": [0.41376496191512513, 500, 1500, "httpRequest_GetAuthorsBookId_spr2"], "isController": false}, {"data": [0.37068697544295925, 500, 1500, "httpRequest_GetAuthorsBookId_spr3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 31268, 398, 1.272866828706665, 6553.0, 10693.199999999997, 21159.31, 103.92804674568407, 44.644835739682975, 178, 258038], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "90th pct", "95th pct", "99th pct", "Throughput", "KB/sec", "Min", "Max"], "items": [{"data": ["httpRequest_GetAuthorsBookId_spr4", 2894, 96, 3.31720801658604, 12230.0, 18678.75, 22385.1, 19.728276059525676, 9.340077736752946, 190, 32616], "isController": false}, {"data": ["httpRequest_GetAuthorsBookId_spr5", 2406, 108, 4.488778054862843, 14271.100000000002, 21039.3, 22359.72, 17.756981755918996, 8.864004172632402, 189, 32600], "isController": false}, {"data": ["httpRequest_GetAuthorsBookId_spr1", 19075, 50, 0.2621231979030144, 1352.4000000000015, 3299.2000000000007, 10608.480000000003, 85.51970876223952, 34.89178548451454, 178, 32493], "isController": false}, {"data": ["httpRequest_GetAuthorsBookId_spr2", 3676, 65, 1.7682263329706203, 9381.100000000002, 14739.349999999946, 21613.73, 25.054013344874356, 11.025552561203764, 181, 32518], "isController": false}, {"data": ["httpRequest_GetAuthorsBookId_spr3", 3217, 79, 2.455704072116879, 11114.800000000001, 17085.899999999998, 22410.2, 10.692645440917898, 4.85449533276995, 183, 258038], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.ConnectException", 397, 99.74874371859296, 1.2696686708455929], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException", 3, 0.7537688442211056, 0.009594473583216068], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
});
