$(document).ready(function(){
// Lists
var symbolList = [];
var symbolPriceList = [];
var finalpricelist = [];
var onlyPrice = [];
var onlySymbols = [];

finalpricelist.push(['Stocks', 'Prices',]);
//Add click function
$('#addBtn').click(function(){
  //Get the text box value
  symbolName = $("#txtBox").val();
  li = '<li data-value='+symbolName+'>'+symbolName+'</li>';
  if(symbolName == "")
  {
  alert("Please enter Stock Symbol");
	}
  //clear text box value
  $('#txtBox').val('');

//Reset the values
// To avoid duplicates
if(!symbolList.includes(symbolName) && symbolName != "")
{
   symbolList.push(symbolName);
   //Append the list to ul after click event
	 $('ul').append(li);
   getPriceFromApi(symbolName);
}

})

// Reset the form
$("#resetBtn").click(function(){
  //clear text box value
  $('#txtBox').val('');
  //clear list html and clear chart data
  $('ul').html('');
  $('#chart_div').html("");

  symbolList = [];
  onlySymbols = [];
  onlyPrice = [];
  finalpricelist = [];
  finalpricelist.push(['Stocks', 'Prices',]);

})

// Getting price detail using API
function getPriceFromApi(symbolName)
{
  var request = new XMLHttpRequest();
  var urlAPI = 'https://api.iextrading.com/1.0/stock/'+symbolName+'/price';
  request.open('GET', urlAPI, true);
  request.onload = function () {
    // Begin accessing JSON data here
   
 
    if(request.status == 404)
    {
      //$('li:contains('+symbolName+')').remove();
      $('ul').find('li').each(function(){
          if($(this).attr('data-value') == symbolName)
          {
            $(this).remove();
          }
      })

      symbolList.pop(symbolName);
      console.log(symbolList);
      $('#txtBox').val('');
      alert("Please Enter the Valid Symbol Name");
    }
    else if (request.status >= 200 && request.status < 400) {
     var data = JSON.parse(this.response);
        // For testing purpose
        //data = data + Math.floor((Math.random() * 10) + 1);
        updateFlag = 0;
        symbolPriceList = [];
        symbolPriceList.push(symbolName,data)
        if(!onlySymbols.includes(symbolName) && !onlyPrice.includes(data))
        {
           onlySymbols.push(symbolName);
           onlyPrice.push(data)
           finalpricelist.push(symbolPriceList);
        }
        else
        {
          for(var i=0 ;i< finalpricelist.length;i++)
         {
    				if(finalpricelist[i].includes(symbolName))
            {
               if(finalpricelist[i][1] != data)
               {
                 finalpricelist[i][1] = data;
                 break;
               }
               else{
               updateFlag = 1;
               //console.log("finalpricelist",finalpricelist);
               break;
               }
            }
         }
        }
        // update only if it ts the new value
        if(updateFlag != 1)
        {
        	
          google.charts.load('current', {packages: ['corechart', 'bar']});
          // Calling the generate chart functions
          google.charts.setOnLoadCallback(function()
          {
            generateChart(finalpricelist);
          });
        }
    } else {
      console.log('error');
    }
}

request.send();
}

function generateChart(finalpricelist)
{
  //['aapl',100],['akam',200]
  var data = google.visualization.arrayToDataTable(finalpricelist);

  // Code for annotation
  var view = new google.visualization.DataView(data);
  view.setColumns([0, 1,
                   { calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation" }]);

  var options = {
      title: 'Stock Prices',
      chartArea: {width: '70%'},
      hAxis: {
        title: 'Price',
        minValue: 0
      },
      vAxis: {
        title: 'Symbols'
      }
    };

  var chart = new google.visualization.BarChart(document.getElementById('chart_div'));

  chart.draw(view, options);
}

// Code for checking the price change in every 5 seconds
var myVar = setInterval(priceCheckInterval, 5000);
function priceCheckInterval()
{
  //alert("refresh the stock price for every 5 seconds")
  symbolList.forEach(function(symbol){
  //alert("calling")
  getPriceFromApi(symbol)
  })
}

})


