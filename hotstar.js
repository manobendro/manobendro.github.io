var subList = [];
function parseMasterList(xhrRes){
    var masterData = xhrRes.toString();
    for(let line of masterData.split(atob('Cg=='))){
        if(!line.startsWith('#') && line.length > 5){
            subList.push(line);
        }
    }
	if(subList[video_quality].startsWith('http')){
		load(subList[video_quality], parseList);
	}else{
		load(basePath+"/"+subList[video_quality], parseList); //TODO check basePath
	}
}
var chunkList = [];
function parseList(xhrRes){
    var masterData = xhrRes.toString();
    for(let line of masterData.split(atob('Cg=='))){
        if(!line.startsWith('#') && line.length > 5){
            chunkList.push(line);
        }
    }
    console.log("Download is about to start..");
    zip.file('index.m3u8', xhrRes);
    chunkDownloader(0);
}
var basePath = "";
function load(url,callback){
    var spiltUrl = url.split('?');
    basePath = spiltUrl[0].substr(0,spiltUrl[0].lastIndexOf('/'));
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            callback(xhr.response);
        }
    }
    xhr.open('GET', url,true);
    xhr.send();
}
var rTry = 0;
function chunkDownloader(chunk){
    if(chunk >= chunkList.length || rTry > 5){
        console.log("Finished...");
        zip.generateAsync({type: "blob"}).then(function (zipdata) {
            saveAs(zipdata, window.document.title + ".zip");
        });
        return;
    }
	var host = '';
	if(!chunkList[chunk].startsWith('http')){
		host = basePath + '/';
	}
	
    fetch(host + chunkList[chunk],{credentials:'include'}) //TODO check basePath
    .then(response => {
		if(!response.ok){
			rTry ++;
			chunkDownloader(chunk);
		}else{
			return response.blob();
		}
	})
    .then(blob => {
	if(blob != undefined){
		console.log("Downloader chunk: "+chunkList[chunk]);
		zip.file(chunkList[chunk].trim(), blob);
		chunkDownloader(chunk+1);
	}	
    });
}
var video_quality = 5;
var zip = new JSZip();
function start_download(url, quality){
	subList = [];
	chunkList = [];
	basePath = "";
	zip = new JSZip();
	video_quality = quality;
	load(url, parseMasterList);
}
