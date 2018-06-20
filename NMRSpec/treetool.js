var multiplets = [["Doublet","d"],["Triplet","t"],["Quartet","q"],["Quintet","qn"],["Sextet","sx"]]
var mults
var shifts

function layout(){
	
	for (j=0;j<multiplets.length;j++) {
		ButtonGen(d3.select(".tree"),"",10,j*10,5,5,50,10,multiplets[j][0],"DrawTree('" + multiplets[j][1] + " 10')")
	}
	
}

function DrawTree(string){
	d3.select("#tree").remove()
	string = string.split(" ")
	var mults = string[0].match(/(d|t|qn|q|sx)/g)
	var J = string[1].split(",").map(function(d){return parseInt(parseFloat(d).toFixed(0))}).map(function(d){return d*3})
	var shifts = []
	for(i=0;i<mults.length;i++){
		switch(mults[i]){
			case "d": shifts.push(J[i]); break;
			case "t": mults[i]="dd"; shifts.push(J[i],J[i]); break;
			case "q": mults[i]="ddd"; shifts.push(J[i],J[i],J[i]); break;
			case "qn": mults[i]="dddd"; shifts.push(J[i],J[i],J[i],J[i]); break;
			case "sx": mults[i]="ddddd"; shifts.push(J[i],J[i],J[i],J[i],J[i]); break;
		}				
	}
	d3.select(".tree").append("g").attr("id","tree").attr("transform","translate(250,10)")
	var aps = {0:{width:1,pos:false}}
	mults=mults.join("").split("")
	var ll = 80/mults.length>20 ? 20:80/mults.length //line length

	for(j=0;j<mults.length;j++){
		var centres = []
		var lastkey = 0
		TextGen(d3.select("#tree"),"bigtext","",-150,10+j*ll,"J="+shifts[j]/3+"Hz",[],[["stroke-width","0"],["fill","black"],["font-size",10]])
		Object.keys(aps).forEach(function(d){
			var right = parseFloat(d)+shifts[j]/2
			var left = parseFloat(d)-shifts[j]/2
			centres.push([left,aps[d]["width"],"l"])
			centres.push([right,aps[d]["width"],"r"])
			LineGen(d3.select("#tree"),"","treebranch"+j,left,right,j*ll,j*ll,[],[])
			lastkey = parseInt(d)
		})	
		aps={}
		centres.sort(function(a,b){return a[0] - b[0]}).forEach(function(d){aps[d[0]] = {width:(aps[d[0]] ? aps[d[0]]["width"]:0)+d[1], pos:(aps[d[0]] ? (aps[d[0]]["pos"]=="r" ? d[2]:aps[d[0]]["pos"]):d[2])}})
		
		Object.keys(aps).sort(function(a,b){return a - b}).forEach(function(d,i){
			LineGen(d3.select("#tree"),"treeline"+aps[d]["pos"],"treeline"+j,d,d,-0.4+j*ll,ll+j*ll,[],[["stroke-width",aps[d]["width"]]])
			if(aps[d]["pos"]=="l"){
				LineGen(d3.select("#tree"),"treeline"+aps[d]["pos"] + " fat","treeline"+j,d,d,-0.4+j*ll,ll+j*ll,[],[["stroke-width",7]])
			}
		})
	}
	
	DrawGraph(aps)
	
	d3.selectAll(".treelinel").each(function(d){
		d3.select(this).on("mouseover",function(){
			var tier = d3.select(this).attr("id").substring(8);
			var x = parseFloat(d3.select(this).attr("x1"));
			var linedata = [ {"x":x,"y":ll+tier*ll},
							 {"x":x,"y":tier*ll},
							 {"x":x+shifts[tier]/2,"y":tier*ll},
							 {"x":x+shifts[tier]/2,"y":(tier-(tier==0 ? 0:1))*ll},
							 {"x":x+shifts[tier]/2,"y":tier*ll},
							 {"x":x+shifts[tier],"y":tier*ll},
							 {"x":x+shifts[tier],"y":ll+tier*ll}];
			d3.select("#tree").append("path").attr("id","mouseover").attr("d",line(linedata))
			if(tier==shifts.length-1){
				LineGen(d3.select("#tree"),"","mouseover",x,x,ll+tier*ll,167-d3.select(".tree > #graph > .graphline").data()[0].filter(function(a){return a.x==parseFloat(x)})[0].y*sf,[["stroke-dasharray",4]],[["stroke-width",".5"]])
				LineGen(d3.select("#tree"),"","mouseover",x+shifts[tier],x+shifts[tier],ll+tier*ll,167-d3.select(".tree > #graph > .graphline").data()[0].filter(function(a){return a.x==parseFloat(x+shifts[tier])})[0].y*sf,[["stroke-dasharray",4]],[["stroke-width",".5"]])

			}
			
		}).on("mouseout",function(){d3.selectAll("#mouseover").remove()})
		
	})
}

function DrawGraph(centres){
	d3.select(".tree > #graph").remove()
	var xdata = d3.range(-150,150,0.1)
	var ydata = []
	var data = []
	Object.keys(centres).forEach(function(d,i){
		TextGen(d3.select("#tree"),"bigtext","",d,(i%2)? 190:183,centres[d]["width"],[],[["stroke-width","0"],["fill","black"],["font-size",8],["text-anchor","middle"]])
		
	})
	centres = [].concat.apply([],Object.keys(centres).map(function(d,i){
		var temp = [];
		for(i=0;i<centres[d]["width"];i++){temp.push(d)};
		return temp
	}))
	
	line = d3.line()
		.x(function(d){return d.x;})
		.y(function(d){return d.y;})
	for(var i=0; i<xdata.length; i++){
		ydata.push(parseFloat(Gaussian(xdata[i],centres,centres.length,0.8).toFixed(4)))
		data.push({"x":xdata[i].toFixed(2),"y":ydata[i]})
	}
	sf = 80/d3.max(ydata)
	d3.select(".tree").append("g").attr("id","graph").append("path")
		.data([data])
		.attr("class","graphline")
		.attr("d",line(data.map(function(d){return {x:d.x, y:sf*d.y}})))
		.attr("transform","translate(250,180) scale(-1)")

}

layout()
DrawTree("tqn 20,7")