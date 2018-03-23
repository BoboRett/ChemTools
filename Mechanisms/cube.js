/*
"""PYTHON SCRIPT FOR OBJ DATA"""

import bpy
from bpy import context
import numpy as np

obj = context.active_object
verts = []
edges = []
faces = []

for face in obj.data.polygons:
    faces.append(list(face.vertices))
    
for edge in obj.data.edges:
    edges.append(list(edge.vertices))

for vertex in obj.data.vertices:
    verts.append([round(vertex.co[0],2),round(vertex.co[1],2),round(vertex.co[2],2)])
 
print(verts)   
print(faces)
print(edges)
*/

var v = [[0.0, 0.0, -1.0], [0.7236073017120361, -0.5257253050804138, -0.44721952080726624], [-0.276388019323349, -0.8506492376327515, -0.4472198486328125], [-0.8944262266159058, 0.0, -0.44721561670303345], [-0.276388019323349, 0.8506492376327515, -0.4472198486328125], [0.7236073017120361, 0.5257253050804138, -0.44721952080726624], [0.276388019323349, -0.8506492376327515, 0.4472198486328125], [-0.7236073017120361, -0.5257253050804138, 0.44721952080726624], [-0.7236073017120361, 0.5257253050804138, 0.44721952080726624], [0.276388019323349, 0.8506492376327515, 0.4472198486328125], [0.8944262266159058, 0.0, 0.44721561670303345], [0.0, 0.0, 1.0], [-0.16245555877685547, -0.49999526143074036, -0.8506544232368469], [0.42532268166542053, -0.30901139974594116, -0.8506541848182678], [0.26286882162094116, -0.8090116381645203, -0.5257376432418823], [0.8506478667259216, 0.0, -0.5257359147071838], [0.42532268166542053, 0.30901139974594116, -0.8506541848182678], [-0.525729775428772, 0.0, -0.8506516814231873], [-0.6881893873214722, -0.49999693036079407, -0.5257362127304077], [-0.16245555877685547, 0.49999526143074036, -0.8506544232368469], [-0.6881893873214722, 0.49999693036079407, -0.5257362127304077], [0.26286882162094116, 0.8090116381645203, -0.5257376432418823], [0.9510578513145447, -0.30901262164115906, 0.0], [0.9510578513145447, 0.30901262164115906, 0.0], [0.0, -0.9999999403953552, 0.0], [0.5877856016159058, -0.8090167045593262, 0.0], [-0.9510578513145447, -0.30901262164115906, 0.0], [-0.5877856016159058, -0.8090167045593262, 0.0], [-0.5877856016159058, 0.8090167045593262, 0.0], [-0.9510578513145447, 0.30901262164115906, 0.0], [0.5877856016159058, 0.8090167045593262, 0.0], [0.0, 0.9999999403953552, 0.0], [0.6881893873214722, -0.49999693036079407, 0.5257362127304077], [-0.26286882162094116, -0.8090116381645203, 0.5257376432418823], [-0.8506478667259216, 0.0, 0.5257359147071838], [-0.26286882162094116, 0.8090116381645203, 0.5257376432418823], [0.6881893873214722, 0.49999693036079407, 0.5257362127304077], [0.16245555877685547, -0.49999526143074036, 0.8506543636322021], [0.525729775428772, 0.0, 0.8506516814231873], [-0.42532268166542053, -0.30901139974594116, 0.8506541848182678], [-0.42532268166542053, 0.30901139974594116, 0.8506541848182678], [0.16245555877685547, 0.49999526143074036, 0.8506543636322021]]

var f = [[0, 13, 12], [1, 13, 15], [0, 12, 17], [0, 17, 19], [0, 19, 16], [1, 15, 22], [2, 14, 24], [3, 18, 26], [4, 20, 28], [5, 21, 30], [1, 22, 25], [2, 24, 27], [3, 26, 29], [4, 28, 31], [5, 30, 23], [6, 32, 37], [7, 33, 39], [8, 34, 40], [9, 35, 41], [10, 36, 38], [38, 41, 11], [38, 36, 41], [36, 9, 41], [41, 40, 11], [41, 35, 40], [35, 8, 40], [40, 39, 11], [40, 34, 39], [34, 7, 39], [39, 37, 11], [39, 33, 37], [33, 6, 37], [37, 38, 11], [37, 32, 38], [32, 10, 38], [23, 36, 10], [23, 30, 36], [30, 9, 36], [31, 35, 9], [31, 28, 35], [28, 8, 35], [29, 34, 8], [29, 26, 34], [26, 7, 34], [27, 33, 7], [27, 24, 33], [24, 6, 33], [25, 32, 6], [25, 22, 32], [22, 10, 32], [30, 31, 9], [30, 21, 31], [21, 4, 31], [28, 29, 8], [28, 20, 29], [20, 3, 29], [26, 27, 7], [26, 18, 27], [18, 2, 27], [24, 25, 6], [24, 14, 25], [14, 1, 25], [22, 23, 10], [22, 15, 23], [15, 5, 23], [16, 21, 5], [16, 19, 21], [19, 4, 21], [19, 20, 4], [19, 17, 20], [17, 3, 20], [17, 18, 3], [17, 12, 18], [12, 2, 18], [15, 16, 5], [15, 13, 16], [13, 0, 16], [12, 14, 2], [12, 13, 14], [13, 1, 14]]

var e = [[12, 0], [13, 1], [14, 2], [15, 1], [16, 5], [17, 0], [18, 3], [19, 0], [20, 4], [21, 5], [22, 1], [23, 10], [24, 2], [25, 6], [26, 3], [27, 7], [28, 4], [29, 8], [30, 5], [31, 9], [32, 6], [33, 7], [34, 8], [35, 9], [36, 10], [37, 6], [38, 11], [39, 7], [40, 8], [41, 9], [2, 12], [0, 13], [1, 14], [5, 15], [0, 16], [3, 17], [2, 18], [4, 19], [3, 20], [4, 21], [10, 22], [5, 23], [6, 24], [1, 25], [7, 26], [2, 27], [8, 28], [3, 29], [9, 30], [4, 31], [10, 32], [6, 33], [7, 34], [8, 35], [9, 36], [11, 37], [10, 38], [11, 39], [11, 40], [11, 41], [38, 41], [38, 36], [41, 36], [41, 40], [41, 35], [40, 35], [40, 39], [40, 34], [39, 34], [39, 37], [39, 33], [37, 33], [37, 38], [37, 32], [38, 32], [23, 36], [23, 30], [36, 30], [31, 35], [31, 28], [35, 28], [29, 34], [29, 26], [34, 26], [27, 33], [27, 24], [33, 24], [25, 32], [25, 22], [32, 22], [30, 31], [30, 21], [31, 21], [28, 29], [28, 20], [29, 20], [26, 27], [26, 18], [27, 18], [24, 25], [24, 14], [25, 14], [22, 23], [22, 15], [23, 15], [16, 21], [16, 19], [21, 19], [19, 20], [19, 17], [20, 17], [17, 18], [17, 12], [18, 12], [15, 16], [15, 13], [16, 13], [12, 14], [12, 13], [14, 13]]

var randomColour = function () {
	var chars = '0123456789ABCDEF'.split('')
	var colour = '#'
	for (var i = 0; i < 6; i++)
		colour += chars[Math.floor(Math.random() * 16)]
	return colour
}	

var root = d3.select("body").append("svg").attr("id","cube").attr("viewBox","0,0,500,400").append("g").attr("id","drawnbox")
var scale = 40

root.attr("transform","translate(250,100)")

ButtonGen(d3.select("#cube"),"button",100,10,2,2,20,20,"+","clearInterval(interval); rotateX(v,findCentre(v),0.1)")
ButtonGen(d3.select("#cube"),"button",100,50,2,2,20,20,"-","clearInterval(interval); rotateX(v,findCentre(v),-0.1)")
ButtonGen(d3.select("#cube"),"button",80,30,2,2,20,20,"+","clearInterval(interval); rotateY(v,findCentre(v),0.1)")
ButtonGen(d3.select("#cube"),"button",120,30,2,2,20,20,"-","clearInterval(interval); rotateY(v,findCentre(v),-0.1)")

function perspVerts(verts, focalLength, viewPos){
	
	var tmpVerts = verts.map(function(el){
		
		var X = (el[0]+viewPos[0])*focalLength/(el[2]+viewPos[2])
		var Y = (el[1]+viewPos[1])*focalLength/(el[2]+viewPos[2])
		return [X,Y,el[2]]
	})
	return tmpVerts
}

function drawCube(root,verts,edges,faces){
	var vts = perspVerts(verts,16,[0.3,0.4,5])
	vts = vts.map(el => el.map(el => el*scale))
	faces = faces.sort((a,b) => ((vts[a[0]][2]+vts[a[1]][2]+vts[a[2]][2])/3<(vts[b[0]][2]+vts[b[1]][2]+vts[b[2]][2])/3 ? 1 : -1))
	//edges = edges.sort((a,b) => ((vts[a[0]][2]+vts[a[1]][2]/2<(vts[b[0]][2]+vts[b[1]][2])/2 ? 1 : -1)))
	if(root.html()==""){
		for(var i = 0; i<faces.length; i++){
			root.append("polygon").attr("points",faces[i].slice(0,-1).reduce((a,c) => (a + (vts[c][0] + "," + vts[c][1] + " ")),"")).attr("fill",faces[i][faces[i].length-1]).attr("fill-opacity",1)
		}
		
		for(edge of e){
			LineGen(root,"tmp","",vts[edge[0]][0],vts[edge[1]][0],vts[edge[0]][1],vts[edge[1]][1],[["stroke","black"],["stroke-opacity",0],["stroke-width","1px"]],[])
		}
	}
	else{
		root.selectAll("polygon").each(function(el,i){
			d3.select(this).attr("points",faces[i].slice(0,-1).reduce((a,c) => (a + (vts[c][0] + "," + vts[c][1] + " ")),"")).attr("fill",faces[i][faces[i].length-1])
		})
		root.selectAll("line").each(function(el,i){
			d3.select(this).attr("x1",vts[edges[i][0]][0]).attr("x2",vts[edges[i][1]][0]).attr("y1",vts[edges[i][0]][1]).attr("y2",vts[edges[i][1]][1])
		})
	}
}

function findCentre(verts){
	num_nodes = verts.length
	X = verts.map(el => el[0]).reduce((a,c) => a+c)/num_nodes
	Y = verts.map(el => el[1]).reduce((a,c) => a+c)/num_nodes
	Z = verts.map(el => el[2]).reduce((a,c) => a+c)/num_nodes
	return [X,Y,Z]
}

function rotateZ(verts, centre, angle){
	for(coord of verts){
		var x = coord[0] - centre[0]
		var y = coord[1] - centre[1]
		var d = Math.hypot(y,x)
		var theta = Math.atan2(y,x) + angle
		coord[0] = centre[0] + d*Math.cos(theta)
		coord[1] = centre[1] + d*Math.sin(theta)
	}
	drawCube(root,v,e,f)
}
function rotateX(verts, centre, angle){
	for(coord of verts){
		var y = coord[1] - centre[1]
		var z = coord[2] - centre[2]
		var d = Math.hypot(y,z)
		var theta = Math.atan2(y,z) + angle
		coord[2] = centre[2] + d*Math.cos(theta)
		coord[1] = centre[1] + d*Math.sin(theta)
	}
	drawCube(root,v,e,f)
}
function rotateY(verts, centre, angle){
	for(coord of verts){
		var x = coord[0] - centre[0]
		var z = coord[2] - centre[2]
		var d = Math.hypot(x,z)
		var theta = Math.atan2(x,z) + angle
		coord[2] = centre[2] + d*Math.cos(theta)
		coord[0] = centre[0] + d*Math.sin(theta)
	}
	drawCube(root,v,e,f)
}

f = f.map(function(el){el.push(randomColour()); return el})

drawCube(root,v,e,f)
var interval = setInterval(() =>  rotateY(v,findCentre(v),0.02),1000/30)