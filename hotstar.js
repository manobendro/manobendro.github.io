var subList = []; //Global Veriable
function parseMasterList(xhrRes){
    var masterData = xhrRes.toString();
    for(let line of masterData.split(atob('Cg=='))){
        if(!line.startsWith('#') && line.length > 5){
            subList.push(line);
        }
    }
    load(basePath+"/"+subList[video_quality], parseList);
}
var chunkList = []; //Global Veriable
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
var basePath = ""; //Global Veriable
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
function chunkDownloader(chunk){
    if(chunk >= chunkList.length){
        console.log("Finished...");
        zip.generateAsync({type: "blob"}).then(function (zipdata) {
            saveAs(zipdata, window.document.title + ".zip");
        });
        return;
    }
    fetch(basePath+'/'+chunkList[chunk],{credentials:'include'})
    .then(response => response.blob())
    .then(blob => {
        console.log("Downloader chunk: "+chunkList[chunk]);
        zip.file(chunkList[chunk].trim(), blob);
        chunkDownloader(chunk+1);
    });
}
var video_quality = 5; //Global Veriable
var zip = new JSZip(); //Global Veriable
function start_download(url, quality){
	subList = [];
	chunkList = [];
	basePath = "";
	zip = new JSZip();
	video_quality = quality;
	load(url, parseMasterList);
}
