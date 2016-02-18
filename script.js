var width = 1400,
    height = 900;

var force = d3.layout.force()
    .charge(-950)
    .friction(0.6)
    .linkDistance(160)
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

var sectors = {
    "Academia": 0,
    "Non-Governmental Organization": 0,
    "Commonwealth of Virginia": 0,
    "Federal": 0,
    "Military": 0
};

// <!------ JSON DATA LOAD ------->
Tabletop.init({
    key: '1dsCOt_j_nqN3qK1DQeQZuvJWpJs0RvKsrpBOaOoa27A',
    simpleSheet: true,
    callback: buildChart
});

function prepData(nodes) {
    "use strict";
    var index = nodes.length;
    var sectorNodes = [];
    for (var s in sectors) {
        sectorNodes.push({
            name: s,
            Sector: s,
            link: "",
            description: "Click on organizations to view further details regarding their work.",
            contact: "",
            projects: "",
            reports: "",
            id: index
        });
        sectors[s] = index;
        index++;
    }

    // now build the links
    var links = [];
    for (var n in nodes) {
        links.push({
            source: sectors[nodes[n]["attribute/0"]],
            target: parseInt(n),
            value:  nodes[n]["attribute/0"]
        });
    }

    // now add the sectors as nodes
    for (var s in sectorNodes) {
        nodes.push(sectorNodes[s]);
    }

    return {
        nodes: nodes,
        links: links
    };
}

function buildChart(nodes) {
    var json = prepData(nodes);

    force
        .nodes(json.nodes)
        .links(json.links)
        .start();

    // <!------ NODE LINKS ------->
    var link = svg.selectAll(".link")
        .data(json.links)
        .enter().append("line")
        .attr("data-type", function (d) {
            return d.value;
        })
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
            .style("fill", function (d) {
                return color(d.Sector);
            });
        d3.select(this).select("text").transition()
            .duration(250)
            .style('font-size', 10);
    }

    // <!------ DASHBOARD CLICK TOGGLE ------->
    var items = [];
    $(".item").each(function () {
        items.push($(this).find("text").text());
    });

    var node = svg.selectAll(".node")
        .data(json.nodes)
        .enter()
        .append("g")
        .attr("data-type", function (d) {
            return d.Sector;
        })
        .attr("class", "node")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", function (d) {
            if ($.inArray(d.name, items) !== -1) {
                return;
            }
            if (dashboard.data && d.description === dashboard.data.description) {
                // if clicked on the same node again close
                dashboard.classed("open", false);
                dashboard
                    .transition()
                    .style("margin-left", "-375px")
                    .duration(1000);
                dashboard.data = undefined;
                return;
            }
            dashboard.data = d;
            dashboard.classed("open", true);
            dashboard
                .transition()
                .style("margin-left", "0px")
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

    /* CONVERT "LINKS" IN JSON TO HREF IN VIZ DASHBOARD

       var output = "";

       for (var i = 0; i <= nodes.link.length; i++) {
       for (key in nodes.link[i]) {
       if (json.link[i].hasOwnProperty(key)) {
       output += '<li>' +
       '<a href = "' + nodes.link[i][key] +
       '">' + key + '</a>' +
       '</li>';
       } // hasOwnProperty check
       } // for each object
       } // for each array element

       var update = document.getELementByClass('dashboard');
       update.innerHTML = output;

*/

    // <!------ NODE NAMES ------->
    node.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-1em")
        .attr("class", "title")
        .style("font-size", 10)
        .style("font-family", "yantramanav")
        .style("letter-spacing", 1)
        .style("color", "gray")
        .style("font-weight", "lighter")
        .text(function (d) {
            return d.name;
        });

    // <!------ NODE ATTRIBUTES ------->
    node.append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("opacity", 0.65)
        .style("fill", function (d) {
            return color(d.Sector);
        });

    node.attr("cursor", "pointer");

    // <!------ PHYSICS ENGINE ------->
    force.on("tick", function () {
        node.attr("cx", function (d) {
            return d.x = Math.max(200, Math.min(width - 0, d.x));
        })
        .attr("cy", function (d) {
            return d.y = Math.max(20, Math.min(height - 10, d.y));
        });

        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });
}

// <!------- TOGGLE FILTERS -------->
$(".item").click(function () {
    $(this).toggleClass("gray");
    var text = $(this).find("text").text();
    if ($(this).hasClass("gray")) {
        d3.selectAll(".node")
            .filter(function(d,i){
                return d3.select(this).attr("data-type") == text;
            })
            .style("opacity", 0);
        d3.selectAll(".link")
            .filter(function(d,i){
                return d3.select(this).attr("data-type") == text;
            })
            .style("opacity", 0);
    } else {
        d3.selectAll(".node")
            .filter(function(d,i){
                return d3.select(this).attr("data-type") == text;
            })
            .style("opacity", 1);
        d3.selectAll(".link")
            .filter(function(d,i){
                return d3.select(this).attr("data-type") == text;
            })
        .style("opacity", 1).duration(1000)
    }
});
