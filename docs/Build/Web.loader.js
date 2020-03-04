function createUnityInstance(e,r,t){function o(e,r,t){var o=r.objParameters?new n.UnityCache.XMLHttpRequest(r.objParameters):new XMLHttpRequest;o.open("GET",e),o.responseType="arraybuffer",o.onload=function(){t(new Uint8Array(o.response))},r.onprogress&&o.addEventListener("progress",r.onprogress),r.onload&&o.addEventListener("load",r.onload),o.send()}var n={Error:{init:function(){return Error.stackTraceLimit=50,window.addEventListener("error",function(e){var r=n.Error.getModule(e);if(!r)return n.Error.handler(e);var t=r.useWasm?r.wasmSymbolsUrl:r.asmSymbolsUrl;return t?void o(r.resolveBuildUrl(t),{},function(t){n.loadCode(r,t,function(){r.demangleSymbol=createUnityDemangler(),n.Error.handler(e,r)})}):n.Error.handler(e,r)}),!0}(),stackTraceFormat:navigator.userAgent.indexOf("Chrome")!=-1?"(\\s+at\\s+)(([\\w\\d_\\.]*?)([\\w\\d_$]+)(/[\\w\\d_\\./]+|))(\\s+\\[.*\\]|)\\s*\\((blob:.*)\\)":"(\\s*)(([\\w\\d_\\.]*?)([\\w\\d_$]+)(/[\\w\\d_\\./]+|))(\\s+\\[.*\\]|)\\s*@(blob:.*)",stackTraceFormatWasm:navigator.userAgent.indexOf("Chrome")!=-1?"((\\s+at\\s*)\\s\\(<WASM>\\[(\\d+)\\]\\+\\d+\\))()":"((\\s*)wasm-function\\[(\\d+)\\])@(blob:.*)",blobParseRegExp:new RegExp("^(blob:.*)(:\\d+:\\d+)$"),getModule:function(e){var r=e.message.match(new RegExp(this.stackTraceFormat,"g"));for(var t in r){var o=r[t].match(new RegExp("^"+this.stackTraceFormat+"$")),s=o[7].match(this.blobParseRegExp);if(s&&n.Blobs[s[1]]&&n.Blobs[s[1]].Module)return n.Blobs[s[1]].Module}},demangle:function(e,r){var t=e.message;return r?(t=t.replace(new RegExp(this.stackTraceFormat,"g"),function(e){var t=e.match(new RegExp("^"+this.stackTraceFormat+"$")),o=t[7].match(this.blobParseRegExp),s=r.demangleSymbol?r.demangleSymbol(t[4]):t[4],a=o&&n.Blobs[o[1]]&&n.Blobs[o[1]].url?n.Blobs[o[1]].url:"blob";return t[1]+s+(t[2]!=s?" ["+t[2]+"]":"")+" ("+(o?a.substr(a.lastIndexOf("/")+1)+o[2]:t[7])+")"}.bind(this)),r.useWasm&&(t=t.replace(new RegExp(this.stackTraceFormatWasm,"g"),function(e){var t=e.match(new RegExp("^"+this.stackTraceFormatWasm+"$")),o=r.demangleSymbol?r.demangleSymbol(t[3]):t[3],s=t[4].match(this.blobParseRegExp),a=s&&n.Blobs[s[1]]&&n.Blobs[s[1]].url?n.Blobs[s[1]].url:"blob";return(o==t[3]?t[1]:t[2]+o+" [wasm:"+t[3]+"]")+(t[4]?" ("+(s?a.substr(a.lastIndexOf("/")+1)+s[2]:t[4])+")":"")}.bind(this))),t):t},handler:function(e,r){var t=r?this.demangle(e,r):e.message;if(!(r&&r.errorhandler&&r.errorhandler(t,e.filename,e.lineno)||(console.log("Invoking error handler due to\n"+t),"function"==typeof dump&&dump("Invoking error handler due to\n"+t),t.indexOf("UnknownError")!=-1||t.indexOf("Program terminated with exit(0)")!=-1||this.didShowErrorMessage))){var t="An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n"+t;t.indexOf("DISABLE_EXCEPTION_CATCHING")!=-1?t="An exception has occurred, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project WebGL player settings to be able to catch the exception or see the stack trace.":t.indexOf("Cannot enlarge memory arrays")!=-1?t="Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings.":t.indexOf("Invalid array buffer length")==-1&&t.indexOf("Invalid typed array length")==-1&&t.indexOf("out of memory")==-1&&t.indexOf("could not allocate memory")==-1||(t="The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings."),alert(t),this.didShowErrorMessage=!0}},popup:function(e,r,t){t=t||[{text:"OK"}];var o=document.createElement("div");o.style.cssText="position: absolute; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); text-align: center; border: 1px solid black; padding: 5px; background: #E8E8E8";var n=document.createElement("span");n.textContent=r,o.appendChild(n),o.appendChild(document.createElement("br"));for(var s=0;s<t.length;s++){var a=document.createElement("button");t[s].text&&(a.textContent=t[s].text),t[s].callback&&(a.onclick=t[s].callback),a.style.margin="5px",a.addEventListener("click",function(){e.container.removeChild(o)}),o.appendChild(a)}e.container.appendChild(o)}},Job:{schedule:function(e,r,t,o,n){n=n||{};var s=e.Jobs[r];if(s||(s=e.Jobs[r]={dependencies:{},dependants:{}}),s.callback)throw"[UnityLoader.Job.schedule] job '"+r+"' has been already scheduled";if("function"!=typeof o)throw"[UnityLoader.Job.schedule] job '"+r+"' has invalid callback";if("object"!=typeof n)throw"[UnityLoader.Job.schedule] job '"+r+"' has invalid parameters";s.callback=function(e,r){s.starttime=performance.now(),o(e,r)},s.parameters=n,s.complete=function(t){s.endtime=performance.now(),s.result={value:t};for(var o in s.dependants){var n=e.Jobs[o];n.dependencies[r]=s.dependants[o]=!1;var a="function"!=typeof n.callback;for(var i in n.dependencies)a=a||n.dependencies[i];if(!a){if(n.executed)throw"[UnityLoader.Job.schedule] job '"+r+"' has already been executed";n.executed=!0,setTimeout(n.callback.bind(null,e,n),0)}}};var a=!1;t.forEach(function(t){var o=e.Jobs[t];o||(o=e.Jobs[t]={dependencies:{},dependants:{}}),(s.dependencies[t]=o.dependants[r]=!o.result)&&(a=!0)}),a||(s.executed=!0,setTimeout(s.callback.bind(null,e,s),0))},result:function(e,r){var t=e.Jobs[r];if(!t)throw"[UnityLoader.Job.result] job '"+r+"' does not exist";if("object"!=typeof t.result)throw"[UnityLoader.Job.result] job '"+r+"' has invalid result";return t.result.value}},Progress:{Styles:{Dark:{progressLogoUrl:"data:image/png;base64,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",progressEmptyUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAAASCAYAAABmbl0zAAAACXBIWXMAAAsSAAALEgHS3X78AAAATUlEQVRo3u3aIQ4AIAwEQUr4/5cPiyMVBDOj0M2mCKgkGdAwjYCudZzLOLiITYPrCdEgGkSDaEA0iAbRIBpEA6JBNHx1vnL7V4NNwxsbCNMGI3YImu0AAAAASUVORK5CYII=",progressFullUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAAASCAYAAABmbl0zAAAACXBIWXMAAAsSAAALEgHS3X78AAAAO0lEQVRo3u3SQREAAAjDMMC/56EB3omEXjtJCg5GAkyDaTANpsE0YBpMg2kwDaYB02AaTINpMA2Yhr8FO18EIBpZMeQAAAAASUVORK5CYII="},Light:{progressLogoUrl:"data:image/png;base64,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",progressEmptyUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAAASCAYAAABmbl0zAAAACXBIWXMAAAsSAAALEgHS3X78AAAAUUlEQVRo3u3aMQ4AEAxAUcRJzGb3v1mt3cQglvcmc/NTA3XMFQUuNCPgVk/nahwchE2D6wnRIBpEg2hANIgG0SAaRAOiQTR8lV+5/avBpuGNDcz6A6oq1CgNAAAAAElFTkSuQmCC",progressFullUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAAASCAYAAABmbl0zAAAACXBIWXMAAAsSAAALEgHS3X78AAAAQElEQVRo3u3SMREAMAgAsVIpnTvj3xlogDmR8PfxftaBgSsBpsE0mAbTYBowDabBNJgG04BpMA2mwTSYBkzDXgP/hgGnr4PpeAAAAABJRU5ErkJggg=="}},handler:function(e,r){if(e.Module){var t=n.Progress.Styles[e.Module.splashScreenStyle],o=e.Module.progressLogoUrl?e.Module.resolveBuildUrl(e.Module.progressLogoUrl):t.progressLogoUrl,s=e.Module.progressEmptyUrl?e.Module.resolveBuildUrl(e.Module.progressEmptyUrl):t.progressEmptyUrl,a=e.Module.progressFullUrl?e.Module.resolveBuildUrl(e.Module.progressFullUrl):t.progressFullUrl,i="position: absolute; left: 50%; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);";e.logo||(e.logo=document.createElement("div"),e.logo.style.cssText=i+"background: url('"+o+"') no-repeat center / contain; width: 154px; height: 130px;",e.container.appendChild(e.logo)),e.progress||(e.progress=document.createElement("div"),e.progress.style.cssText=i+" height: 18px; width: 141px; margin-top: 90px;",e.progress.empty=document.createElement("div"),e.progress.empty.style.cssText="background: url('"+s+"') no-repeat right / cover; float: right; width: 100%; height: 100%; display: inline-block;",e.progress.appendChild(e.progress.empty),e.progress.full=document.createElement("div"),e.progress.full.style.cssText="background: url('"+a+"') no-repeat left / cover; float: left; width: 0%; height: 100%; display: inline-block;",e.progress.appendChild(e.progress.full),e.container.appendChild(e.progress)),e.progress.full.style.width=100*r+"%",e.progress.empty.style.width=100*(1-r)+"%",1==r&&(e.logo.style.display=e.progress.style.display="none")}},update:function(e,r,t){var o=e.buildDownloadProgress[r];o||(o=e.buildDownloadProgress[r]={started:!1,finished:!1,lengthComputable:!1,total:0,loaded:0}),"object"!=typeof t||"progress"!=t.type&&"load"!=t.type||(o.started||(o.started=!0,o.lengthComputable=t.lengthComputable,o.total=t.total),o.loaded=t.loaded,"load"==t.type&&(o.finished=!0));var n=0,s=0,a=0,i=0,d=0;for(var r in e.buildDownloadProgress){var o=e.buildDownloadProgress[r];if(!o.started)return 0;a++,o.lengthComputable?(n+=o.loaded,s+=o.total,i++):o.finished||d++}var l=a?(a-d-(s?i*(s-n)/s:0))/a:0;e.unityInstance.onProgress(e.unityInstance,.9*l)}},SystemInfo:function(){var e,r,t,o="-",n=navigator.appVersion,s=navigator.userAgent,a=navigator.appName,i=navigator.appVersion,d=parseInt(navigator.appVersion,10);(r=s.indexOf("Opera"))!=-1?(a="Opera",i=s.substring(r+6),(r=s.indexOf("Version"))!=-1&&(i=s.substring(r+8))):(r=s.indexOf("MSIE"))!=-1?(a="Microsoft Internet Explorer",i=s.substring(r+5)):(r=s.indexOf("Edge"))!=-1?(a="Edge",i=s.substring(r+5)):(r=s.indexOf("Chrome"))!=-1?(a="Chrome",i=s.substring(r+7)):(r=s.indexOf("Safari"))!=-1?(a="Safari",i=s.substring(r+7),(r=s.indexOf("Version"))!=-1&&(i=s.substring(r+8))):(r=s.indexOf("Firefox"))!=-1?(a="Firefox",i=s.substring(r+8)):s.indexOf("Trident/")!=-1?(a="Microsoft Internet Explorer",i=s.substring(s.indexOf("rv:")+3)):(e=s.lastIndexOf(" ")+1)<(r=s.lastIndexOf("/"))&&(a=s.substring(e,r),i=s.substring(r+1),a.toLowerCase()==a.toUpperCase()&&(a=navigator.appName)),(t=i.indexOf(";"))!=-1&&(i=i.substring(0,t)),(t=i.indexOf(" "))!=-1&&(i=i.substring(0,t)),(t=i.indexOf(")"))!=-1&&(i=i.substring(0,t)),d=parseInt(""+i,10),isNaN(d)?(i=""+parseFloat(navigator.appVersion),d=parseInt(navigator.appVersion,10)):i=""+parseFloat(i);var l=/Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(n),u=o,c=[{s:"Windows 3.11",r:/Win16/},{s:"Windows 95",r:/(Windows 95|Win95|Windows_95)/},{s:"Windows ME",r:/(Win 9x 4.90|Windows ME)/},{s:"Windows 98",r:/(Windows 98|Win98)/},{s:"Windows CE",r:/Windows CE/},{s:"Windows 2000",r:/(Windows NT 5.0|Windows 2000)/},{s:"Windows XP",r:/(Windows NT 5.1|Windows XP)/},{s:"Windows Server 2003",r:/Windows NT 5.2/},{s:"Windows Vista",r:/Windows NT 6.0/},{s:"Windows 7",r:/(Windows 7|Windows NT 6.1)/},{s:"Windows 8.1",r:/(Windows 8.1|Windows NT 6.3)/},{s:"Windows 8",r:/(Windows 8|Windows NT 6.2)/},{s:"Windows 10",r:/(Windows 10|Windows NT 10.0)/},{s:"Windows NT 4.0",r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},{s:"Windows ME",r:/Windows ME/},{s:"Android",r:/Android/},{s:"Open BSD",r:/OpenBSD/},{s:"Sun OS",r:/SunOS/},{s:"Linux",r:/(Linux|X11)/},{s:"iOS",r:/(iPhone|iPad|iPod)/},{s:"Mac OS X",r:/Mac OS X/},{s:"Mac OS",r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},{s:"QNX",r:/QNX/},{s:"UNIX",r:/UNIX/},{s:"BeOS",r:/BeOS/},{s:"OS/2",r:/OS\/2/},{s:"Search Bot",r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}];for(var p in c){var m=c[p];if(m.r.test(s)){u=m.s;break}}var f=o;switch(/Windows/.test(u)&&(f=/Windows (.*)/.exec(u)[1],u="Windows"),u){case"Mac OS X":f=/Mac OS X (10[\.\_\d]+)/.exec(s)[1];break;case"Android":f=/Android ([\.\_\d]+)/.exec(s)[1];break;case"iOS":f=/OS (\d+)_(\d+)_?(\d+)?/.exec(n),f=f[1]+"."+f[2]+"."+(0|f[3])}return{width:screen.width?screen.width:0,height:screen.height?screen.height:0,browser:a,browserVersion:i,mobile:l,os:u,osVersion:f,gpu:function(){var e=document.createElement("canvas"),r=e.getContext("experimental-webgl");if(r){var t=r.getExtension("WEBGL_debug_renderer_info");if(t)return r.getParameter(t.UNMASKED_RENDERER_WEBGL)}return o}(),language:window.navigator.userLanguage||window.navigator.language,hasWebGL:function(){if(!window.WebGLRenderingContext)return 0;var e=document.createElement("canvas"),r=e.getContext("webgl2");return r?2:(r=e.getContext("experimental-webgl2"),r?2:(r=e.getContext("webgl"),r||(r=e.getContext("experimental-webgl"))?1:0))}(),hasCursorLock:function(){var e=document.createElement("canvas");return e.requestPointerLock||e.mozRequestPointerLock||e.webkitRequestPointerLock||e.msRequestPointerLock?1:0}(),hasFullscreen:function(){var e=document.createElement("canvas");return(e.requestFullScreen||e.mozRequestFullScreen||e.msRequestFullscreen||e.webkitRequestFullScreen)&&(a.indexOf("Safari")==-1||i>=10.1)?1:0}(),hasThreads:"undefined"!=typeof SharedArrayBuffer,hasWasm:"object"==typeof WebAssembly&&"function"==typeof WebAssembly.validate&&"function"==typeof WebAssembly.compile,hasWasmThreads:function(){if("object"!=typeof WebAssembly)return!1;if("undefined"==typeof SharedArrayBuffer)return!1;var e=new WebAssembly.Memory({initial:1,maximum:1,shared:!0}),r=e.buffer instanceof SharedArrayBuffer;return delete e,r}()}}(),compatibilityCheck:function(e,r,t){n.SystemInfo.hasWebGL?n.SystemInfo.mobile?e.popup("Please note that Unity WebGL is not currently supported on mobiles. Press OK if you wish to continue anyway.",[{text:"OK",callback:r}]):["Edge","Firefox","Chrome","Safari"].indexOf(n.SystemInfo.browser)==-1?e.popup("Please note that your browser is not currently supported for this Unity WebGL content. Press OK if you wish to continue anyway.",[{text:"OK",callback:r}]):r():e.popup("Your browser does not support WebGL",[{text:"OK",callback:t}])},buildCompatibilityCheck:function(e,r,t){function o(){if("undefined"==typeof e.graphicsAPI)return!0;for(var r=0;r<e.graphicsAPI.length;r++){var t=e.graphicsAPI[r];if("WebGL 2.0"==t&&2==n.SystemInfo.hasWebGL)return!0;if("WebGL 1.0"==t&&n.SystemInfo.hasWebGL>=1)return!0;e.print("Warning: Unsupported graphics API "+t)}return!1}o()?!n.SystemInfo.hasThreads&&e.multithreading?t("Your browser does not support multithreading."):r():t("Your browser does not support any of the required graphics API for this content.")},Blobs:{},loadCode:function(e,r,t,o){var s=document.createElement("script"),a=new Blob([r],{type:"application/javascript"}),i=URL.createObjectURL(a);n.Blobs[i]=o,e.deinitializers.push(function(){delete n.Blobs[i],document.body.removeChild(s)}),s.src=i,s.onload=function(){e.developmentBuild||URL.revokeObjectURL(i),t(),delete s.onload},document.body.appendChild(s)},processWasmCodeJob:function(e,r){e.wasmBinary=n.Job.result(e,"downloadWasmCode"),r.complete()},processWasmFrameworkJob:function(e,r){var t=n.Job.result(e,"downloadWasmFramework");n.loadCode(e,t,function(){createUnityFramework(e,n),r.complete()},{Module:e,url:e.wasmFrameworkUrl})},processAsmCodeJob:function(e,r){var t=n.Job.result(e,"downloadAsmCode");n.loadCode(e,t,function(){r.complete()},{Module:e,url:e.asmCodeUrl})},processAsmFrameworkJob:function(e,r){var t=n.Job.result(e,"downloadAsmFramework");n.loadCode(e,t,function(){createUnityFramework(e,n),r.complete()},{Module:e,url:e.asmFrameworkUrl})},processMemoryInitializerJob:function(e,r){e.memoryInitializerRequest.status=200,e.memoryInitializerRequest.response=n.Job.result(e,"downloadMemoryInitializer"),e.memoryInitializerRequest.callback&&e.memoryInitializerRequest.callback(),r.complete()},processDataJob:function(e,r){var t=n.Job.result(e,"downloadData"),o=new DataView(t.buffer,t.byteOffset,t.byteLength),s=0,a="UnityWebData1.0\0";if(!String.fromCharCode.apply(null,t.subarray(s,s+a.length))==a)throw"unknown data format";s+=a.length;var i=o.getUint32(s,!0);for(s+=4;s<i;){var d=o.getUint32(s,!0);s+=4;var l=o.getUint32(s,!0);s+=4;var u=o.getUint32(s,!0);s+=4;var c=String.fromCharCode.apply(null,t.subarray(s,s+u));s+=u;for(var p=0,m=c.indexOf("/",p)+1;m>0;p=m,m=c.indexOf("/",p)+1)e.FS_createPath(c.substring(0,p),c.substring(p,m-1),!0,!0);e.FS_createDataFile(c,null,t.subarray(d,d+l),!0,!0,!0)}e.removeRunDependency("processDataJob"),r.complete()},scheduleBuildDownloadJob:function(e,r,t){n.Progress.update(e,r),n.Job.schedule(e,r,[],function(e,s){o(e.resolveBuildUrl(e[t]),{onprogress:function(t){n.Progress.update(e,r,t)},onload:function(t){n.Progress.update(e,r,t)},objParameters:e.companyName&&e.productName&&e.cacheControl&&(e.cacheControl[t]||e.cacheControl.default)?{companyName:e.companyName,productName:e.productName,cacheControl:e.cacheControl[t]||e.cacheControl.default}:null},function(e){s.complete(e)})})},loadModule:function(e,r){if(e.useWasm=e.wasmCodeUrl&&n.SystemInfo.hasWasm,e.useWasm){if(e.multithreading&&!n.SystemInfo.hasWasmThreads)return void r("Your browser does not support WebAssembly Threads.");var t=["downloadWasmFramework"];e.wasmCodeUrl.endsWith(".unityweb")&&(n.scheduleBuildDownloadJob(e,"downloadWasmCode","wasmCodeUrl"),n.Job.schedule(e,"processWasmCode",["downloadWasmCode"],n.processWasmCodeJob),t.push("processWasmCode")),e.wasmMemoryUrl&&(n.scheduleBuildDownloadJob(e,"downloadMemoryInitializer","wasmMemoryUrl"),n.Job.schedule(e,"processMemoryInitializer",["downloadMemoryInitializer"],n.processMemoryInitializerJob),e.memoryInitializerRequest={addEventListener:function(r,t){e.memoryInitializerRequest.callback=t}}),n.scheduleBuildDownloadJob(e,"downloadWasmFramework","wasmFrameworkUrl"),n.Job.schedule(e,"processWasmFramework",t,n.processWasmFrameworkJob)}else{if(!e.asmCodeUrl)return void r("Your browser does not support WebAssembly.");n.scheduleBuildDownloadJob(e,"downloadAsmCode","asmCodeUrl"),n.Job.schedule(e,"processAsmCode",["downloadAsmCode"],n.processAsmCodeJob),n.scheduleBuildDownloadJob(e,"downloadMemoryInitializer","asmMemoryUrl"),n.Job.schedule(e,"processMemoryInitializer",["downloadMemoryInitializer"],n.processMemoryInitializerJob),e.memoryInitializerRequest={addEventListener:function(r,t){e.memoryInitializerRequest.callback=t}},e.asmLibraryUrl&&(e.dynamicLibraries=[e.asmLibraryUrl].map(e.resolveBuildUrl)),n.scheduleBuildDownloadJob(e,"downloadAsmFramework","asmFrameworkUrl"),n.Job.schedule(e,"processAsmFramework",["downloadAsmFramework","processAsmCode"],n.processAsmFrameworkJob)}n.scheduleBuildDownloadJob(e,"downloadData","dataUrl"),e.preRun.push(function(){e.addRunDependency("processDataJob"),n.Job.schedule(e,"processData",["downloadData"],n.processDataJob)})},instantiate:function(e,r,t){function o(e,o){if("string"==typeof e&&!(e=document.getElementById(e)))return!1;e.innerHTML="",e.style.border=e.style.margin=e.style.padding=0,"static"==getComputedStyle(e).getPropertyValue("position")&&(e.style.position="relative"),e.style.width=o.width||e.style.width,e.style.height=o.height||e.style.height,o.container=e;var s=o.Module;s.canvas=document.createElement("canvas"),s.canvas.style.width="100%",s.canvas.style.height="100%",s.canvas.addEventListener("contextmenu",function(e){e.preventDefault()}),s.canvas.id="#canvas",e.appendChild(s.canvas),s.deinitializers.push(function(){e.removeChild(s.canvas)});var a=!0;return o.compatibilityCheck(o,function(){var r=new XMLHttpRequest;r.open("GET",o.url,!0),r.responseType="text",r.onerror=function(){s.print("Could not download "+o.url),0==document.URL.indexOf("file:")&&alert("It seems your browser does not support running Unity WebGL content from file:// urls. Please upload it to an http server, or try a different browser.")},r.onload=function(){var i=JSON.parse(r.responseText);for(var d in i)"undefined"==typeof s[d]&&(s[d]=i[d]);if(s.unityVersion){var l=s.unityVersion.match(/(\d+)\.(\d+)\.(\d+)(.+)/);l&&(s.unityVersion={string:s.unityVersion,version:parseInt(l[0]),major:parseInt(l[1]),minor:parseInt(l[2]),suffix:l[3]})}n.buildCompatibilityCheck(s,function(){e.style.background=s.backgroundUrl?"center/cover url('"+s.resolveBuildUrl(s.backgroundUrl)+"')":s.backgroundColor?" "+s.backgroundColor:"",o.onProgress(o,0),a=n.loadModule(s,t.onerror)},t.onerror)},r.send()},function(){var e="Instantiation of '"+r+"' terminated due to the failed compatibility check.";"object"==typeof t&&"function"==typeof t.onerror?t.onerror(e):s.printErr(e)}),a}function s(e){return s.link=s.link||document.createElement("a"),s.link.href=e,s.link.href}"undefined"==typeof t&&(t={}),"undefined"==typeof t.onerror&&(t.onerror=function(e){a.popup(e,[{text:"OK"}])});var a={url:r,onProgress:n.Progress.handler,compatibilityCheck:n.compatibilityCheck,Module:{deinitializers:[],intervals:{},setInterval:function(e,r){var t=window.setInterval(e,r);return this.intervals[t]=!0,t},clearInterval:function(e){delete this.intervals[e],window.clearInterval(e)},onAbort:function(e){throw void 0!==e?(this.print(e),this.printErr(e),e=JSON.stringify(e)):e="","abort("+e+") at "+this.stackTrace()},preRun:[],postRun:[],print:function(e){console.log(e)},printErr:function(e){console.error(e)},Jobs:{},buildDownloadProgress:{},resolveBuildUrl:function(e){return e.match(/(http|https|ftp|file):\/\//)?e:r.substring(0,r.lastIndexOf("/")+1)+e},streamingAssetsUrl:function(){return s(this.resolveBuildUrl("../StreamingAssets"))},locateFile:function(e){return"build.wasm"==e?this.resolveBuildUrl(this.wasmCodeUrl):"Build/".concat(e)}},SetFullscreen:function(){if(a.Module.SetFullscreen)return a.Module.SetFullscreen.apply(a.Module,arguments)},SendMessage:function(){if(a.Module.SendMessage)return a.Module.SendMessage.apply(a.Module,arguments)},Quit:function(e){"function"==typeof e&&(a.Module.onQuit=e),a.Module.shouldQuit=!0}};a.Module.unityInstance=a,a.popup=function(e,r){return n.Error.popup(a,e,r)},a.Module.postRun.push(function(){a.onProgress(a,1),"object"==typeof t&&"function"==typeof t.onsuccess&&t.onsuccess(a.Module)});for(var i in t)if("Module"==i)for(var d in t[i])a.Module[d]=t[i][d];else a[i]=t[i];return o(e,a)||document.addEventListener("DOMContentLoaded",function(){o(e,a)}),a},instantiateAsync:function(e,r,t){return new Promise(function(o,s){const a=Object.assign({onsuccess:function(e){o(e)},onerror:function(e){s(e)}},t);n.instantiate(e,r,a)})},UnityCache:function(){function e(e){console.log("[UnityCache] "+e)}function r(e){return r.link=r.link||document.createElement("a"),r.link.href=e,r.link.href}function t(e){var r=window.location.href.match(/^[a-z]+:\/\/[^\/]+/);return!r||e.lastIndexOf(r[0],0)}function o(){function r(r){if("undefined"==typeof o.database)for(o.database=r,o.database||e("indexedDB database could not be opened");o.queue.length;){var t=o.queue.shift();o.database?o.execute.apply(o,t):"function"==typeof t.onerror&&t.onerror(new Error("operation cancelled"))}}function t(){var e=n.open(a.name,a.version);e.onupgradeneeded=function(e){var r=e.target.result;r.objectStoreNames.contains(d.name)||r.createObjectStore(d.name)},e.onsuccess=function(e){r(e.target.result)},e.onerror=function(){r(null)}}var o=this;o.queue=[];try{var n=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB,s=n.open(a.name);s.onupgradeneeded=function(e){var r=e.target.result.createObjectStore(i.name,{keyPath:"url"});["version","company","product","updated","revalidated","accessed"].forEach(function(e){r.createIndex(e,e)})},s.onsuccess=function(e){var o=e.target.result;o.version<a.version?(o.close(),t()):r(o)},s.onerror=function(){r(null)}}catch(e){r(null)}}function n(e,r,t,o,n){var s={url:e,version:i.version,company:r,product:t,updated:o,revalidated:o,accessed:o,responseHeaders:{},xhr:{}};return n&&(["Last-Modified","ETag"].forEach(function(e){s.responseHeaders[e]=n.getResponseHeader(e)}),["responseURL","status","statusText","response"].forEach(function(e){s.xhr[e]=n[e]})),s}function s(r){this.cache={enabled:!1},r&&(this.cache.control=r.cacheControl,this.cache.company=r.companyName,this.cache.product=r.productName),this.xhr=new XMLHttpRequest(r),this.xhr.addEventListener("load",function(){var r=this.xhr,t=this.cache;t.enabled&&!t.revalidated&&(304==r.status?(t.result.revalidated=t.result.accessed,t.revalidated=!0,l.execute(i.name,"put",[t.result]),e("'"+t.result.url+"' successfully revalidated and served from the indexedDB cache")):200==r.status?(t.result=n(t.result.url,t.company,t.product,t.result.accessed,r),t.revalidated=!0,l.execute(i.name,"put",[t.result],function(r){e("'"+t.result.url+"' successfully downloaded and stored in the indexedDB cache")},function(r){e("'"+t.result.url+"' successfully downloaded but not stored in the indexedDB cache due to the error: "+r)})):e("'"+t.result.url+"' request failed with status: "+r.status+" "+r.statusText))}.bind(this))}var a={name:"UnityCache",version:2},i={name:"XMLHttpRequest",version:1},d={name:"WebAssembly",version:1};o.prototype.execute=function(e,r,t,o,n){if(this.database)try{var s=this.database.transaction([e],["put","delete","clear"].indexOf(r)!=-1?"readwrite":"readonly").objectStore(e);"openKeyCursor"==r&&(s=s.index(t[0]),t=t.slice(1));var a=s[r].apply(s,t);"function"==typeof o&&(a.onsuccess=function(e){o(e.target.result)}),a.onerror=n}catch(e){"function"==typeof n&&n(e)}else"undefined"==typeof this.database?this.queue.push(arguments):"function"==typeof n&&n(new Error("indexedDB access denied"))};var l=new o;s.prototype.send=function(r){var o=this.xhr,n=this.cache,s=arguments;return n.enabled=n.enabled&&"arraybuffer"==o.responseType&&!r,n.enabled?void l.execute(i.name,"get",[n.result.url],function(r){if(!r||r.version!=i.version)return void o.send.apply(o,s);if(n.result=r,n.result.accessed=Date.now(),"immutable"==n.control)n.revalidated=!0,l.execute(i.name,"put",[n.result]),o.dispatchEvent(new Event("load")),e("'"+n.result.url+"' served from the indexedDB cache without revalidation");else if(t(n.result.url)&&(n.result.responseHeaders["Last-Modified"]||n.result.responseHeaders.ETag)){var a=new XMLHttpRequest;a.open("HEAD",n.result.url),a.onload=function(){n.revalidated=["Last-Modified","ETag"].every(function(e){return!n.result.responseHeaders[e]||n.result.responseHeaders[e]==a.getResponseHeader(e)}),n.revalidated?(n.result.revalidated=n.result.accessed,l.execute(i.name,"put",[n.result]),o.dispatchEvent(new Event("load")),e("'"+n.result.url+"' successfully revalidated and served from the indexedDB cache")):o.send.apply(o,s)},a.send()}else n.result.responseHeaders["Last-Modified"]?(o.setRequestHeader("If-Modified-Since",n.result.responseHeaders["Last-Modified"]),
o.setRequestHeader("Cache-Control","no-cache")):n.result.responseHeaders.ETag&&(o.setRequestHeader("If-None-Match",n.result.responseHeaders.ETag),o.setRequestHeader("Cache-Control","no-cache")),o.send.apply(o,s)},function(e){o.send.apply(o,s)}):o.send.apply(o,s)},s.prototype.open=function(e,t,o,s,a){return this.cache.result=n(r(t),this.cache.company,this.cache.product,Date.now()),this.cache.enabled=["must-revalidate","immutable"].indexOf(this.cache.control)!=-1&&"GET"==e&&this.cache.result.url.match("^https?://")&&("undefined"==typeof o||o)&&"undefined"==typeof s&&"undefined"==typeof a,this.cache.revalidated=!1,this.xhr.open.apply(this.xhr,arguments)},s.prototype.setRequestHeader=function(e,r){return this.cache.enabled=!1,this.xhr.setRequestHeader.apply(this.xhr,arguments)};var u=new XMLHttpRequest;for(var c in u)s.prototype.hasOwnProperty(c)||!function(e){Object.defineProperty(s.prototype,e,"function"==typeof u[e]?{value:function(){return this.xhr[e].apply(this.xhr,arguments)}}:{get:function(){return this.cache.revalidated&&this.cache.result.xhr.hasOwnProperty(e)?this.cache.result.xhr[e]:this.xhr[e]},set:function(r){this.xhr[e]=r}})}(c);return{XMLHttpRequest:s,WebAssembly:{get:function(e,t){var o={url:r(e),version:d.version,module:null,md5:null};l.execute(d.name,"get",[o.url],function(e){t(e&&e.version==d.version?e:o)},function(){t(o)})},put:function(e,r,t){l.execute(d.name,"put",[e,e.url],r,t)}}}}()};return n.instantiate(e,r,t)}