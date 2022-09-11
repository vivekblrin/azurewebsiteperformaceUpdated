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

    var data = {"OkPercent": 39.547333300134454, "KoPercent": 60.452666699865546};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.17917434390717593, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "httpRequest_PutAuthorsId_spr4"], "isController": false}, {"data": [0.0, 500, 1500, "httpRequest_PutAuthorsId_spr5"], "isController": false}, {"data": [0.3720068906115418, 500, 1500, "httpRequest_PutAuthorsId_spr2"], "isController": false}, {"data": [0.0, 500, 1500, "httpRequest_PutAuthorsId_spr3"], "isController": false}, {"data": [0.4993555423359112, 500, 1500, "httpRequest_PutAuthorsId_spr1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 40162, 24279, 60.452666699865546, 3499.0, 4663.549999999996, 9369.220000000016, 51.04506256394613, 8.227026605961528, 178, 22777], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "90th pct", "95th pct", "99th pct", "Throughput", "KB/sec", "Min", "Max"], "items": [{"data": ["httpRequest_PutAuthorsId_spr4", 10018, 10018, 100.0, 1184.1000000000004, 3170.0, 7848.4299999999985, 73.03878681831438, 7.416791406933508, 536, 21703], "isController": false}, {"data": ["httpRequest_PutAuthorsId_spr5", 9385, 9385, 100.0, 1469.5999999999785, 3170.0, 7849.139999999999, 74.72312236757247, 7.74581069561773, 530, 21679], "isController": false}, {"data": ["httpRequest_PutAuthorsId_spr2", 5805, 4, 0.06890611541774333, 4814.400000000003, 5942.7, 10676.139999999989, 37.347762029453584, 9.394969673038196, 180, 22777], "isController": false}, {"data": ["httpRequest_PutAuthorsId_spr3", 4868, 4868, 100.0, 4661.4000000000015, 5640.350000000003, 10176.790000000005, 34.122850673975364, 3.4491321428070743, 543, 21053], "isController": false}, {"data": ["httpRequest_PutAuthorsId_spr1", 10086, 4, 0.039658933174697604, 4047.0, 5023.299999999999, 9835.949999999988, 44.657167904929736, 11.204227205407031, 178, 21077], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.ConnectException", 26, 0.1070884303307385, 0.06473781186195907], "isController": false}, {"data": ["400", 24255, 99.90114914123316, 60.39290871968527], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
});
