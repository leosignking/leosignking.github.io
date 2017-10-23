
var h=200;
var w=$(window).width();

var url; 

//var url = 'month.json';
var dataSet;

function fetch(frequency) {
	if(frequency == undefined || frequency == 'month') {
		url = 'https://www.coinbase.com/api/v2/prices/BTC-USD/historic?period=month';
	} else {
		url 'https://www.coinbase.com/api/v2/prices/BTC-USD/historic?period='+ frequency ;
	}
	//console.log('fetching data from ', url);
	api(url);
}

function api(url) {
	d3.json(url, function(error, success) {
		if(error) {
			console.log('error while fetching data', error);
		} else {
			dataSet = success.data.prices;
			//console.log('successfully fetched data' , dataSet);	
			buildLine();	
		}
	});
}

function buildLine() {
	var lineFun = d3.line()
					.x(function (d, i) { return i*(w/dataSet.length); })
					.y(function (d, i) { 
						return calculateY(d.price); 
					})
					.curve(d3.curveBundle);

	var svg = d3.select('body')
				.append('svg')
				.attr('width', w)
				.attr('height', h);

	var viz = svg.append('path')
				.attr('d', lineFun(dataSet.reverse()))
				.attr('stroke', 'purple')
				.attr('stroke-width', 2)
				.attr('fill', 'none');
}

function maxPrice(ds) {
  var maxPrice =  d3.max(ds, function(d) { return +d['price']; });
  //console.log('maxPrice: '+maxPrice);
  return maxPrice;
}

function minPrice(ds) {
  var minPrice =  d3.min(ds, function(d) { return +d['price']; });
  return minPrice;
}

function parts() {
	var divisions =  (maxPrice(dataSet) - minPrice(dataSet)) / h;
	return divisions;
}

function calculateY(price) {
	var finalValue =  (price - minPrice(dataSet)) / parts();
	if(finalValue < 0 || finalValue > h) {
		//console.log(finalValue + ":" + price + ":" + parts());
	}
	return finalValue;
}
