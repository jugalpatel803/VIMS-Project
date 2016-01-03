var width = 1280,
    height = 1024;

var force = d3.layout.force()
        .charge(-1050)
        .friction(0.65)
        .linkDistance(150)
        .size([width, height]);

var svg = d3.select(".viz").append("svg")
        .attr("width", width)
        .attr("height", height);

var dashboard = d3.select("body").append("section")
        .attr("class", dashboard)
        .attr("x", 0)
        .attr("y", 0)
        .style("width", 350)
        .style("overflow", "scroll");

var color = d3.scale.category10();

 // <!------ JSON DATA LOAD ------->

d3.json("https://api.myjson.com/bins/3hw4j", function (error, json) {
    "use strict";
    force
        .nodes(json.nodes)
        .links(json.links)
        .start();

 // <!------ NODE LINKS ------->
    
    var link = svg.selectAll(".link")
            .data(json.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function (d) {
                return 1;
            });

 // <!------ NODE MOUSEOVERS / OUTS ------->     

    function mouseover() {
        d3.select(this).select("circle").transition()
            .duration(250)
            .attr('r', 7)
            .style("fill", "white");
        d3.select(this).select("text").transition()
            .duration(250)
            .style('font-size', 21);
    }

    function mouseout() {
        d3.select(this).select("circle").transition()
            .duration(250)
            .attr('r', 5)
            .style("fill", function (d) { return color(d.Sector); });
        d3.select(this).select("text").transition()
            .duration(250)
            .style('font-size', 10);
    }

   // <!------ DASHBOARD CLICK TOGGLE ------->
    
    var node = svg.selectAll(".node")
            .data(json.nodes)
            .enter().append("g")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("click", function (d) {
                if (dashboard.data && d.description === dashboard.data.description) {
        //if clicked on the same node again close
                    dashboard.classed("open", false);
                    dashboard
                        .transition()
                        .style("display", "none")
                        .duration(1000);
                    dashboard.data = undefined;
                    return;
                }
                dashboard.data = d;
                dashboard.classed("open", true);
                dashboard
                    .transition()
                    .style("display", "inline-block")
                    .duration(1000);         
    
                d3.selectAll(".text-tip").remove();

 //* <!------ DASHBOARD INFORMATION ------->
                
                dashboard.append("text")
                    .attr("class", "text-tip").text(d.name)
                    .style("display", "block")
                    .style("color", "black")
                    .style("padding", "15px")
                    .style("font-family", "roboto")
                    .style("font-size", "20px");                
                
                dashboard.append("text")
                    .attr("class", "text-tip").text("Description: " + d.description)
                    .style("display", "block")
                    .style("color", "black")
                    .style("padding", "15px")
                    .style("font-family", "sans-serif")
                    .style("font-size", "12px");
                
                dashboard.append("text")
                    .attr("class", "text-tip").text("Sector: " + d.Sector)
                    .style("display", "block")
                    .style("color", "black")
                    .style("padding", "15px")
                    .style("font-family", "sans-serif")
                    .style("font-size", "12px");
                
                dashboard.append("text")
                    .attr("class", "text-tip").text("Link: " + d.link)
                    .style("display", "block")
                    .style("color", "black")
                    .style("padding", "15px")
                    .style("font-family", "sans-serif")
                    .style("font-size", "12px");
                
                dashboard.append("text")
                    .attr("class", "text-tip").text("Contact: " + d.contact)
                    .style("display", "block")
                    .style("color", "black")
                    .style("padding", "15px")
                    .style("font-family", "sans-serif")
                    .style("font-size", "12px");
                
                dashboard.append("text")
                    .attr("class", "text-tip").text("Reports: " + d.reports)
                    .style("display", "block")
                    .style("color", "black")
                    .style("padding", "15px")
                    .style("font-family", "sans-serif")
                    .style("font-size", "12px");
                
                dashboard.append("text")
                    .attr("class", "text-tip").text("Projects: " + d.projects)
                    .style("display", "block")
                    .style("color", "black")
                    .style("padding", "15px")
                    .style("font-family", "sans-serif")
                    .style("font-size", "12px");
            })
            .call(force.drag);

 // <!------ NODE NAMES ------->     
    
    node.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-1em")
        .style("font-size", 10)
        .style("font-family", "buenard")
        .text(function (d) {
            return d.name;
        });
    
    node.append("title")
        .text(function (d) {
            return d.name;
        });

 // <!------ NODE ATTRIBUTES ------->     
    
    node.append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("opacity", 0.65)
        .style("fill", function (d) { return color(d.Sector); });

    node.attr("cursor", "pointer");

 // <!------ PHYSICS ENGINE -------> 
    
    force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });
});