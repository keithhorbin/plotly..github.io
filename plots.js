function init() {
  var selector = d3.select("#selDataset");
  //Read samples.json
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildBarChart(newSample);
  buildGaugeChart(newSample);
  buildBubbleChart(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(key.toUpperCase() + ': ' + value); 
    })


  });
}

function buildBarChart(sample) {
  d3.json("samples.json").then((data) => {
    var resultArray = data
    .samples
    .filter(sampleObj => {
      return sampleObj.id == sample
    });
    
    var result = resultArray[0];
    // get only top 10 otu ids for the plot OTU and reversing it. 
    var top_ten_otu_ids = result.otu_ids.slice(0, 10).map(numericIds => {
      return 'OTU ' + numericIds;
    }).reverse();
    // get the top 10 labels for the plot
    var top_ten_sample_values = result.sample_values.slice(0, 10).reverse();
    var top_ten_otu_labels = result.otu_labels.slice(0, 10).reverse();
    
    // create trace for bar chart
    var bar_trace = [
      {
        x: top_ten_sample_values,  
        y: top_ten_otu_ids,
        text: top_ten_otu_labels,
        name: "Top 10",
        type: 'bar',
        orientation: 'h'
      }
      ];

      // create data variable
      var data = [bar_trace];
      
      // create layout variable to set plots layout
      var bar_layout = {
        title: "Top 10 OTUs",
   
      };

      // create the bar plot
      Plotly.newPlot('bar', bar_trace, bar_layout)
    
    });
  }
  // The gauge chart
  function buildGaugeChart(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata
      .filter(sampleObj => {
        return sampleObj.id == sample
      });
      console.log(resultArray);

      var result = resultArray[0];
      console.log(result);
      var wash_freq = result.wfreq;
      console.log(wash_freq);

      // creating trace and formatting
      var gauge_trace = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wash_freq,
          title: {text: "Weekly Washing Frequency", font: {size: 18}},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 10]},
            bar: { color: "steelblue" },
            steps: [
              { range: [0, 2], color: 'rgba(183,28,28, .5)' },
              { range: [2, 4], color: 'rgba(255,179,71, .5)' },
              { range: [4, 6], color: 'rgba(253,253,150, .5)' },
              { range: [6, 8], color: 'rgba(14, 127, 0, .5)' },
              { range: [8, 10], color: 'rgba(174,198,207, .5)' }
            ],
          }  
        }
      ];
      
      // set the layout for gauge 
      var gauge_layout = {
        
        
        width: 600, 
        height: 500, 
        margin: { t: 0, b: 0 }
      };
      
      // create the gauge
      Plotly.newPlot('gauge', gauge_trace, gauge_layout)
    
    });
  
  }
    // The bubble chart
    function buildBubbleChart(sample) {
      d3.json("samples.json").then((data) => {
        var resultArray = data
        .samples
        .filter(sampleObj => {
          return sampleObj.id == sample
        });
        
        var result = resultArray[0];
        
        var otu_ids = result.otu_ids.map(numericIds => {
          return numericIds;
        }).reverse();
        
        var sample_values = result.sample_values.reverse();
        var otu_labels = result.otu_labels.reverse();
        
        
        var bubble_trace = {
          x: otu_ids,  
          y: sample_values,
          text: otu_labels,
          mode: 'markers',
          marker: {
            color: otu_ids,
            size: sample_values
          }
        };

          // creating data variable 
          var data = [bubble_trace];

          // set the layout for the bubble plot
          var bubble_layout = {
            title: "OTU ID",
            showlegend: false,

          };

          // create the bubble plot
          Plotly.newPlot('bubble', data, bubble_layout)
        
        });
      }
