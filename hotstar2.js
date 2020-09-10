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
    chunkDownloader(0, Math.floor(chunkList.length/4));
	chunkDownloader(Math.floor(chunkList.length/4), 2 * Math.floor(chunkList.length/4));
	chunkDownloader(2 * Math.floor(chunkList.length/4), 3 * Math.floor(chunkList.length/4));
	chunkDownloader(3 * Math.floor(chunkList.length/4), chunkList.length);
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
var isFullUrl = true;
var numberOfThred = 0;
function chunkDownloader(chunk, length){
    if(chunk >= length || rTry > 5){
        console.log("Finished...");
		numberOfThred ++;
		if(numberOfThred == 4){ //Set total thread number
			console.log("All thread finished...")
			zip.generateAsync({type: "blob"}).then(function (zipdata) {
				saveAs(zipdata, window.document.title + ".zip");
			});
		}
        
        return;
    }
	var host = '';
	if(!chunkList[chunk].startsWith('http')){
		host = basePath + '/';
		isFullUrl = false;
	}
	
    fetch(host + chunkList[chunk],{credentials:'include'}) //TODO check basePath
    .then(response => {
		if(!response.ok){
			rTry ++;
			chunkDownloader(chunk, length);
		}else{
			return response.blob();
		}
	})
    .then(blob => {
	if(blob != undefined){
			if(isFullUrl){
				var fName = chunkList[chunk].split('?');
				fName[0] = fName[0].substr(fName[0].lastIndexOf('/')+1);
				zip.file(fName[0].trim(), blob);
				console.log("Downloader chunk: "+fName[0].trim());
			}else{
				console.log("Downloader chunk: "+chunkList[chunk].trim());
				zip.file(chunkList[chunk].trim(), blob);
			}
		chunkDownloader(chunk+1, length);
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
	numberOfThred = 0;
	load(url, parseMasterList);
}
