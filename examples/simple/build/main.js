/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "c2a708b292c42732e89f"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./index.js")(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function () {
  /*
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  'use strict';
  var I = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this,
      xa = "function" == typeof Object.defineProperties ? Object.defineProperty : function (g, p, M) {
    g != Array.prototype && g != Object.prototype && (g[p] = M.value);
  };function pb() {
    pb = function () {};I.Symbol || (I.Symbol = qb);
  }var qb = function () {
    var g = 0;return function (p) {
      return "jscomp_symbol_" + (p || "") + g++;
    };
  }();
  function Zc() {
    pb();var g = I.Symbol.iterator;g || (g = I.Symbol.iterator = I.Symbol("iterator"));"function" != typeof Array.prototype[g] && xa(Array.prototype, g, { configurable: !0, writable: !0, value: function () {
        return $c(this);
      } });Zc = function () {};
  }function $c(g) {
    var p = 0;return ad(function () {
      return p < g.length ? { done: !1, value: g[p++] } : { done: !0 };
    });
  }function ad(g) {
    Zc();g = { next: g };g[I.Symbol.iterator] = function () {
      return this;
    };return g;
  }function bd(g) {
    Zc();var p = g[Symbol.iterator];return p ? p.call(g) : $c(g);
  }
  function cd(g) {
    for (var p, M = []; !(p = g.next()).done;) M.push(p.value);return M;
  }
  (function () {
    function g() {
      var a = this;this.m = {};this.g = document.documentElement;var b = new ya();b.rules = [];this.h = v.set(this.g, new v(b));this.i = !1;this.b = this.a = null;rb(function () {
        a.c();
      });
    }function p() {
      this.customStyles = [];this.enqueued = !1;
    }function M() {}function fa(a) {
      this.cache = {};this.c = void 0 === a ? 100 : a;
    }function n() {}function v(a, b, c, d, e) {
      this.D = a || null;this.b = b || null;this.ja = c || [];this.N = null;this.V = e || "";this.a = this.A = this.J = null;
    }function r() {}function ya() {
      this.end = this.start = 0;this.rules = this.parent = this.previous = null;this.cssText = this.parsedCssText = "";this.atRule = !1;this.type = 0;this.parsedSelector = this.selector = this.keyframesName = "";
    }function dd(a) {
      function b(b, c) {
        Object.defineProperty(b, "innerHTML", { enumerable: c.enumerable, configurable: !0, get: c.get, set: function (b) {
            var d = this,
                e = void 0;q(this) && (e = [], N(this, function (a) {
              a !== d && e.push(a);
            }));c.set.call(this, b);if (e) for (var f = 0; f < e.length; f++) {
              var k = e[f];1 === k.__CE_state && a.disconnectedCallback(k);
            }this.ownerDocument.__CE_hasRegistry ? a.f(this) : a.l(this);
            return b;
          } });
      }function c(b, c) {
        x(b, "insertAdjacentElement", function (b, d) {
          var e = q(d);b = c.call(this, b, d);e && a.a(d);q(b) && a.b(d);return b;
        });
      }sb && x(Element.prototype, "attachShadow", function (a) {
        return this.__CE_shadowRoot = a = sb.call(this, a);
      });if (za && za.get) b(Element.prototype, za);else if (Aa && Aa.get) b(HTMLElement.prototype, Aa);else {
        var d = Ba.call(document, "div");a.u(function (a) {
          b(a, { enumerable: !0, configurable: !0, get: function () {
              return tb.call(this, !0).innerHTML;
            }, set: function (a) {
              var b = "template" === this.localName ? this.content : this;for (d.innerHTML = a; 0 < b.childNodes.length;) Ca.call(b, b.childNodes[0]);for (; 0 < d.childNodes.length;) ha.call(b, d.childNodes[0]);
            } });
        });
      }x(Element.prototype, "setAttribute", function (b, c) {
        if (1 !== this.__CE_state) return ub.call(this, b, c);var d = Da.call(this, b);ub.call(this, b, c);c = Da.call(this, b);a.attributeChangedCallback(this, b, d, c, null);
      });x(Element.prototype, "setAttributeNS", function (b, c, d) {
        if (1 !== this.__CE_state) return vb.call(this, b, c, d);var e = ia.call(this, b, c);vb.call(this, b, c, d);d = ia.call(this, b, c);a.attributeChangedCallback(this, c, e, d, b);
      });x(Element.prototype, "removeAttribute", function (b) {
        if (1 !== this.__CE_state) return wb.call(this, b);var c = Da.call(this, b);wb.call(this, b);null !== c && a.attributeChangedCallback(this, b, c, null, null);
      });x(Element.prototype, "removeAttributeNS", function (b, c) {
        if (1 !== this.__CE_state) return xb.call(this, b, c);var d = ia.call(this, b, c);xb.call(this, b, c);var e = ia.call(this, b, c);d !== e && a.attributeChangedCallback(this, c, d, e, b);
      });yb ? c(HTMLElement.prototype, yb) : zb ? c(Element.prototype, zb) : console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");Ea(a, Element.prototype, { Z: ed, append: fd });gd(a, { ha: hd, Qa: id, replaceWith: jd, remove: kd });
    }function gd(a, b) {
      var c = Element.prototype;function d(b) {
        return function (c) {
          for (var d = [], e = 0; e < arguments.length; ++e) d[e - 0] = arguments[e];e = [];for (var f = [], g = 0; g < d.length; g++) {
            var m = d[g];m instanceof Element && q(m) && f.push(m);if (m instanceof DocumentFragment) for (m = m.firstChild; m; m = m.nextSibling) e.push(m);else e.push(m);
          }b.apply(this, d);for (d = 0; d < f.length; d++) a.a(f[d]);if (q(this)) for (d = 0; d < e.length; d++) f = e[d], f instanceof Element && a.b(f);
        };
      }void 0 !== b.ha && (c.before = d(b.ha));void 0 !== b.ha && (c.after = d(b.Qa));void 0 !== b.replaceWith && x(c, "replaceWith", function (c) {
        for (var d = [], e = 0; e < arguments.length; ++e) d[e - 0] = arguments[e];e = [];for (var h = [], u = 0; u < d.length; u++) {
          var g = d[u];g instanceof Element && q(g) && h.push(g);if (g instanceof DocumentFragment) for (g = g.firstChild; g; g = g.nextSibling) e.push(g);else e.push(g);
        }u = q(this);b.replaceWith.apply(this, d);for (d = 0; d < h.length; d++) a.a(h[d]);if (u) for (a.a(this), d = 0; d < e.length; d++) h = e[d], h instanceof Element && a.b(h);
      });void 0 !== b.remove && x(c, "remove", function () {
        var c = q(this);b.remove.call(this);c && a.a(this);
      });
    }function ld(a) {
      function b(b, d) {
        Object.defineProperty(b, "textContent", { enumerable: d.enumerable, configurable: !0, get: d.get, set: function (b) {
            if (this.nodeType === Node.TEXT_NODE) d.set.call(this, b);else {
              var c = void 0;if (this.firstChild) {
                var e = this.childNodes,
                    h = e.length;if (0 < h && q(this)) {
                  c = Array(h);for (var u = 0; u < h; u++) c[u] = e[u];
                }
              }d.set.call(this, b);if (c) for (b = 0; b < c.length; b++) a.a(c[b]);
            }
          } });
      }x(Node.prototype, "insertBefore", function (b, d) {
        if (b instanceof DocumentFragment) {
          var c = Array.prototype.slice.apply(b.childNodes);b = Ab.call(this, b, d);if (q(this)) for (d = 0; d < c.length; d++) a.b(c[d]);return b;
        }c = q(b);d = Ab.call(this, b, d);c && a.a(b);q(this) && a.b(b);return d;
      });x(Node.prototype, "appendChild", function (b) {
        if (b instanceof DocumentFragment) {
          var c = Array.prototype.slice.apply(b.childNodes);b = ha.call(this, b);if (q(this)) for (var e = 0; e < c.length; e++) a.b(c[e]);return b;
        }c = q(b);e = ha.call(this, b);c && a.a(b);q(this) && a.b(b);return e;
      });x(Node.prototype, "cloneNode", function (b) {
        b = tb.call(this, b);this.ownerDocument.__CE_hasRegistry ? a.f(b) : a.l(b);return b;
      });x(Node.prototype, "removeChild", function (b) {
        var c = q(b),
            e = Ca.call(this, b);c && a.a(b);return e;
      });x(Node.prototype, "replaceChild", function (b, d) {
        if (b instanceof DocumentFragment) {
          var c = Array.prototype.slice.apply(b.childNodes);b = Bb.call(this, b, d);if (q(this)) for (a.a(d), d = 0; d < c.length; d++) a.b(c[d]);
          return b;
        }c = q(b);var f = Bb.call(this, b, d),
            k = q(this);k && a.a(d);c && a.a(b);k && a.b(b);return f;
      });Fa && Fa.get ? b(Node.prototype, Fa) : a.u(function (a) {
        b(a, { enumerable: !0, configurable: !0, get: function () {
            for (var a = [], b = 0; b < this.childNodes.length; b++) a.push(this.childNodes[b].textContent);return a.join("");
          }, set: function (a) {
            for (; this.firstChild;) Ca.call(this, this.firstChild);ha.call(this, document.createTextNode(a));
          } });
      });
    }function md(a) {
      x(Document.prototype, "createElement", function (b) {
        if (this.__CE_hasRegistry) {
          var c = a.c(b);if (c) return new c.constructor();
        }b = Ba.call(this, b);a.g(b);return b;
      });x(Document.prototype, "importNode", function (b, c) {
        b = nd.call(this, b, c);this.__CE_hasRegistry ? a.f(b) : a.l(b);return b;
      });x(Document.prototype, "createElementNS", function (b, c) {
        if (this.__CE_hasRegistry && (null === b || "http://www.w3.org/1999/xhtml" === b)) {
          var d = a.c(c);if (d) return new d.constructor();
        }b = od.call(this, b, c);a.g(b);return b;
      });Ea(a, Document.prototype, { Z: pd, append: qd });
    }function Ea(a, b, c) {
      function d(b) {
        return function (c) {
          for (var d = [], e = 0; e < arguments.length; ++e) d[e - 0] = arguments[e];e = [];for (var f = [], g = 0; g < d.length; g++) {
            var m = d[g];m instanceof Element && q(m) && f.push(m);if (m instanceof DocumentFragment) for (m = m.firstChild; m; m = m.nextSibling) e.push(m);else e.push(m);
          }b.apply(this, d);for (d = 0; d < f.length; d++) a.a(f[d]);if (q(this)) for (d = 0; d < e.length; d++) f = e[d], f instanceof Element && a.b(f);
        };
      }void 0 !== c.Z && (b.prepend = d(c.Z));void 0 !== c.append && (b.append = d(c.append));
    }function rd(a) {
      window.HTMLElement = function () {
        function b() {
          var b = this.constructor,
              d = a.w(b);if (!d) throw Error("The custom element being constructed was not registered with `customElements`.");var e = d.constructionStack;if (0 === e.length) return e = Ba.call(document, d.localName), Object.setPrototypeOf(e, b.prototype), e.__CE_state = 1, e.__CE_definition = d, a.g(e), e;d = e.length - 1;var f = e[d];if (f === Cb) throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");e[d] = Cb;Object.setPrototypeOf(f, b.prototype);a.g(f);return f;
        }b.prototype = sd.prototype;
        return b;
      }();
    }function y(a) {
      this.c = !1;this.a = a;this.h = new Map();this.f = function (a) {
        return a();
      };this.b = !1;this.g = [];this.i = new Ga(a, document);
    }function Db() {
      var a = this;this.b = this.a = void 0;this.f = new Promise(function (b) {
        a.b = b;a.a && b(a.a);
      });
    }function Ga(a, b) {
      this.b = a;this.a = b;this.M = void 0;this.b.f(this.a);"loading" === this.a.readyState && (this.M = new MutationObserver(this.f.bind(this)), this.M.observe(this.a, { childList: !0, subtree: !0 }));
    }function A() {
      this.o = new Map();this.m = new Map();this.j = [];this.h = !1;
    }function l(a, b, c) {
      if (a !== Eb) throw new TypeError("Illegal constructor");a = document.createDocumentFragment();a.__proto__ = l.prototype;a.F(b, c);return a;
    }function ja(a) {
      if (!a.__shady || void 0 === a.__shady.firstChild) {
        a.__shady = a.__shady || {};a.__shady.firstChild = Ha(a);a.__shady.lastChild = Ia(a);Fb(a);for (var b = a.__shady.childNodes = R(a), c = 0, d; c < b.length && (d = b[c]); c++) d.__shady = d.__shady || {}, d.__shady.parentNode = a, d.__shady.nextSibling = b[c + 1] || null, d.__shady.previousSibling = b[c - 1] || null, Gb(d);
      }
    }function td(a) {
      var b = a && a.M;
      b && (b.X.delete(a.La), b.X.size || (a.Ma.__shady.T = null));
    }function ud(a, b) {
      a.__shady = a.__shady || {};a.__shady.T || (a.__shady.T = new ka());a.__shady.T.X.add(b);var c = a.__shady.T;return { La: b, M: c, Ma: a, takeRecords: function () {
          return c.takeRecords();
        } };
    }function ka() {
      this.a = !1;this.addedNodes = [];this.removedNodes = [];this.X = new Set();
    }function S(a) {
      return a.__shady && void 0 !== a.__shady.firstChild;
    }function F(a) {
      return "ShadyRoot" === a.Ha;
    }function Y(a) {
      a = a.getRootNode();if (F(a)) return a;
    }function Ja(a, b) {
      if (a && b) for (var c = Object.getOwnPropertyNames(b), d = 0, e; d < c.length && (e = c[d]); d++) {
        var f = Object.getOwnPropertyDescriptor(b, e);f && Object.defineProperty(a, e, f);
      }
    }function Ka(a, b) {
      for (var c = [], d = 1; d < arguments.length; ++d) c[d - 1] = arguments[d];for (d = 0; d < c.length; d++) Ja(a, c[d]);return a;
    }function vd(a, b) {
      for (var c in b) a[c] = b[c];
    }function Hb(a) {
      La.push(a);Ma.textContent = Ib++;
    }function Jb(a, b) {
      for (; b;) {
        if (b == a) return !0;b = b.parentNode;
      }return !1;
    }function Kb(a) {
      Na || (Na = !0, Hb(la));Z.push(a);
    }function la() {
      Na = !1;for (var a = !!Z.length; Z.length;) Z.shift()();
      return a;
    }function wd(a, b) {
      var c = b.getRootNode();return a.map(function (a) {
        var b = c === a.target.getRootNode();if (b && a.addedNodes) {
          if (b = Array.from(a.addedNodes).filter(function (a) {
            return c === a.getRootNode();
          }), b.length) return a = Object.create(a), Object.defineProperty(a, "addedNodes", { value: b, configurable: !0 }), a;
        } else if (b) return a;
      }).filter(function (a) {
        return a;
      });
    }function Lb(a) {
      switch (a) {case "&":
          return "&amp;";case "<":
          return "&lt;";case ">":
          return "&gt;";case '"':
          return "&quot;";case "\u00a0":
          return "&nbsp;";}
    }
    function Mb(a) {
      for (var b = {}, c = 0; c < a.length; c++) b[a[c]] = !0;return b;
    }function Oa(a, b) {
      "template" === a.localName && (a = a.content);for (var c = "", d = b ? b(a) : a.childNodes, e = 0, f = d.length, k; e < f && (k = d[e]); e++) {
        a: {
          var h = k;var u = a;var g = b;switch (h.nodeType) {case Node.ELEMENT_NODE:
              for (var m = h.localName, l = "<" + m, p = h.attributes, n = 0; u = p[n]; n++) l += " " + u.name + '="' + u.value.replace(xd, Lb) + '"';l += ">";h = yd[m] ? l : l + Oa(h, g) + "</" + m + ">";break a;case Node.TEXT_NODE:
              h = h.data;h = u && zd[u.localName] ? h : h.replace(Ad, Lb);break a;case Node.COMMENT_NODE:
              h = "\x3c!--" + h.data + "--\x3e";break a;default:
              throw window.console.error(h), Error("not implemented");}
        }c += h;
      }return c;
    }function T(a) {
      B.currentNode = a;return B.parentNode();
    }function Ha(a) {
      B.currentNode = a;return B.firstChild();
    }function Ia(a) {
      B.currentNode = a;return B.lastChild();
    }function Nb(a) {
      B.currentNode = a;return B.previousSibling();
    }function Ob(a) {
      B.currentNode = a;return B.nextSibling();
    }function R(a) {
      var b = [];B.currentNode = a;for (a = B.firstChild(); a;) b.push(a), a = B.nextSibling();return b;
    }function Pb(a) {
      C.currentNode = a;return C.parentNode();
    }function Qb(a) {
      C.currentNode = a;return C.firstChild();
    }function Rb(a) {
      C.currentNode = a;return C.lastChild();
    }function Sb(a) {
      C.currentNode = a;return C.previousSibling();
    }function Tb(a) {
      C.currentNode = a;return C.nextSibling();
    }function Ub(a) {
      var b = [];C.currentNode = a;for (a = C.firstChild(); a;) b.push(a), a = C.nextSibling();return b;
    }function Vb(a) {
      return Oa(a, function (a) {
        return R(a);
      });
    }function Wb(a) {
      switch (a.nodeType) {case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:
          a = document.createTreeWalker(a, NodeFilter.SHOW_TEXT, null, !1);for (var b = "", c; c = a.nextNode();) b += c.nodeValue;return b;default:
          return a.nodeValue;}
    }function J(a, b, c) {
      for (var d in b) {
        var e = Object.getOwnPropertyDescriptor(a, d);e && e.configurable || !e && c ? Object.defineProperty(a, d, b[d]) : c && console.warn("Could not define", d, "on", a);
      }
    }function O(a) {
      J(a, Xb);J(a, Pa);J(a, Qa);
    }function Yb(a, b, c) {
      Gb(a);c = c || null;a.__shady = a.__shady || {};b.__shady = b.__shady || {};c && (c.__shady = c.__shady || {});a.__shady.previousSibling = c ? c.__shady.previousSibling : b.lastChild;
      var d = a.__shady.previousSibling;d && d.__shady && (d.__shady.nextSibling = a);(d = a.__shady.nextSibling = c) && d.__shady && (d.__shady.previousSibling = a);a.__shady.parentNode = b;c ? c === b.__shady.firstChild && (b.__shady.firstChild = a) : (b.__shady.lastChild = a, b.__shady.firstChild || (b.__shady.firstChild = a));b.__shady.childNodes = null;
    }function Ra(a, b, c) {
      if (b === a) throw Error("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");if (c) {
        var d = c.__shady && c.__shady.parentNode;if (void 0 !== d && d !== a || void 0 === d && T(c) !== a) throw Error("Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.");
      }if (c === b) return b;b.parentNode && Sa(b.parentNode, b);d = Y(a);var e;if (e = d) a: {
        if (!b.__noInsertionPoint) {
          var f;"slot" === b.localName ? f = [b] : b.querySelectorAll && (f = b.querySelectorAll("slot"));if (f && f.length) {
            e = f;break a;
          }
        }e = void 0;
      }(f = e) && d.Ka(f);d && ("slot" === a.localName || f) && d.L();if (S(a)) {
        d = c;Fb(a);a.__shady = a.__shady || {};void 0 !== a.__shady.firstChild && (a.__shady.childNodes = null);if (b.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          f = b.childNodes;for (e = 0; e < f.length; e++) Yb(f[e], a, d);b.__shady = b.__shady || {};d = void 0 !== b.__shady.firstChild ? null : void 0;b.__shady.firstChild = b.__shady.lastChild = d;b.__shady.childNodes = d;
        } else Yb(b, a, d);if (Ta(a)) {
          a.__shady.root.L();var k = !0;
        } else a.__shady.root && (k = !0);
      }k || (k = F(a) ? a.host : a, c ? (c = Zb(c), Ua.call(k, b, c)) : $b.call(k, b));ac(a, b);return b;
    }function Sa(a, b) {
      if (b.parentNode !== a) throw Error("The node to be removed is not a child of this node: " + b);var c = Y(b);if (S(a)) {
        b.__shady = b.__shady || {};a.__shady = a.__shady || {};b === a.__shady.firstChild && (a.__shady.firstChild = b.__shady.nextSibling);b === a.__shady.lastChild && (a.__shady.lastChild = b.__shady.previousSibling);var d = b.__shady.previousSibling;var e = b.__shady.nextSibling;d && (d.__shady = d.__shady || {}, d.__shady.nextSibling = e);e && (e.__shady = e.__shady || {}, e.__shady.previousSibling = d);b.__shady.parentNode = b.__shady.previousSibling = b.__shady.nextSibling = void 0;void 0 !== a.__shady.childNodes && (a.__shady.childNodes = null);if (Ta(a)) {
          a.__shady.root.L();var f = !0;
        }
      }bc(b);c && ((e = a && "slot" === a.localName) && (f = !0), ((d = c.Na(b)) || e) && c.L());f || (f = F(a) ? a.host : a, (!a.__shady.root && "slot" !== b.localName || f === T(b)) && aa.call(f, b));ac(a, null, b);return b;
    }function bc(a) {
      if (a.__shady && void 0 !== a.__shady.ka) for (var b = a.childNodes, c = 0, d = b.length, e; c < d && (e = b[c]); c++) bc(e);a.__shady && (a.__shady.ka = void 0);
    }function Zb(a) {
      var b = a;a && "slot" === a.localName && (b = (b = a.__shady && a.__shady.R) && b.length ? b[0] : Zb(a.nextSibling));return b;
    }function Ta(a) {
      return (a = a && a.__shady && a.__shady.root) && a.pa();
    }function cc(a, b) {
      "slot" === b ? (a = a.parentNode, Ta(a) && a.__shady.root.L()) : "slot" === a.localName && "name" === b && (b = Y(a)) && (b.Pa(a), b.L());
    }function ac(a, b, c) {
      if (a = a.__shady && a.__shady.T) b && a.addedNodes.push(b), c && a.removedNodes.push(c), a.$a();
    }function dc(a) {
      if (a && a.nodeType) {
        a.__shady = a.__shady || {};var b = a.__shady.ka;void 0 === b && (F(a) ? b = a : b = (b = a.parentNode) ? dc(b) : a, ba.call(document.documentElement, a) && (a.__shady.ka = b));return b;
      }
    }function ma(a, b, c) {
      var d = [];ec(a.childNodes, b, c, d);return d;
    }function ec(a, b, c, d) {
      for (var e = 0, f = a.length, k; e < f && (k = a[e]); e++) {
        var h;if (h = k.nodeType === Node.ELEMENT_NODE) {
          h = k;var u = b,
              g = c,
              m = d,
              l = u(h);l && m.push(h);g && g(l) ? h = l : (ec(h.childNodes, u, g, m), h = void 0);
        }if (h) break;
      }
    }function fc(a) {
      a = a.getRootNode();F(a) && a.ra();
    }function gc(a, b, c) {
      na || (na = window.ShadyCSS && window.ShadyCSS.ScopingShim);na && "class" === b ? na.setElementClass(a, c) : (hc.call(a, b, c), cc(a, b));
    }function ic(a, b) {
      if (a.ownerDocument !== document) return Va.call(document, a, b);var c = Va.call(document, a, !1);if (b) {
        a = a.childNodes;b = 0;for (var d; b < a.length; b++) d = ic(a[b], !0), c.appendChild(d);
      }return c;
    }function Wa(a, b) {
      var c = [],
          d = a;for (a = a === window ? window : a.getRootNode(); d;) c.push(d), d = d.assignedSlot ? d.assignedSlot : d.nodeType === Node.DOCUMENT_FRAGMENT_NODE && d.host && (b || d !== a) ? d.host : d.parentNode;c[c.length - 1] === document && c.push(window);return c;
    }function jc(a, b) {
      if (!F) return a;a = Wa(a, !0);for (var c = 0, d, e, f, k; c < b.length; c++) if (d = b[c], f = d === window ? window : d.getRootNode(), f !== e && (k = a.indexOf(f), e = f), !F(f) || -1 < k) return d;
    }function Xa(a) {
      function b(b, d) {
        b = new a(b, d);b.da = d && !!d.composed;return b;
      }vd(b, a);b.prototype = a.prototype;return b;
    }function kc(a, b, c) {
      if (c = b.__handlers && b.__handlers[a.type] && b.__handlers[a.type][c]) for (var d = 0, e; (e = c[d]) && a.target !== a.relatedTarget && (e.call(b, a), !a.Fa); d++);
    }function Bd(a) {
      var b = a.composedPath();Object.defineProperty(a, "currentTarget", { get: function () {
          return d;
        }, configurable: !0 });for (var c = b.length - 1; 0 <= c; c--) {
        var d = b[c];kc(a, d, "capture");if (a.ea) return;
      }Object.defineProperty(a, "eventPhase", { get: function () {
          return Event.AT_TARGET;
        } });var e;for (c = 0; c < b.length; c++) {
        d = b[c];var f = d.__shady && d.__shady.root;if (0 === c || f && f === e) if (kc(a, d, "bubble"), d !== window && (e = d.getRootNode()), a.ea) break;
      }
    }function lc(a, b, c, d, e, f) {
      for (var k = 0; k < a.length; k++) {
        var h = a[k],
            g = h.type,
            l = h.capture,
            m = h.once,
            n = h.passive;if (b === h.node && c === g && d === l && e === m && f === n) return k;
      }return -1;
    }function mc(a, b, c) {
      if (b) {
        if ("object" === typeof c) {
          var d = !!c.capture;var e = !!c.once;var f = !!c.passive;
        } else d = !!c, f = e = !1;var k = c && c.fa || this,
            h = b[ca];if (h) {
          if (-1 < lc(h, k, a, d, e, f)) return;
        } else b[ca] = [];h = function (d) {
          e && this.removeEventListener(a, b, c);d.__target || nc(d);if (k !== this) {
            var f = Object.getOwnPropertyDescriptor(d, "currentTarget");Object.defineProperty(d, "currentTarget", { get: function () {
                return k;
              }, configurable: !0 });
          }if (d.composed || -1 < d.composedPath().indexOf(k)) if (d.target === d.relatedTarget) d.eventPhase === Event.BUBBLING_PHASE && d.stopImmediatePropagation();else if (d.eventPhase === Event.CAPTURING_PHASE || d.bubbles || d.target === k) {
            var h = "object" === typeof b && b.handleEvent ? b.handleEvent(d) : b.call(k, d);k !== this && (f ? (Object.defineProperty(d, "currentTarget", f), f = null) : delete d.currentTarget);return h;
          }
        };b[ca].push({ node: this, type: a, capture: d, once: e, passive: f, eb: h });Ya[a] ? (this.__handlers = this.__handlers || {}, this.__handlers[a] = this.__handlers[a] || { capture: [], bubble: [] }, this.__handlers[a][d ? "capture" : "bubble"].push(h)) : (this instanceof Window ? oc : pc).call(this, a, h, c);
      }
    }function qc(a, b, c) {
      if (b) {
        if ("object" === typeof c) {
          var d = !!c.capture;var e = !!c.once;var f = !!c.passive;
        } else d = !!c, f = e = !1;var k = c && c.fa || this,
            h = void 0;var g = null;try {
          g = b[ca];
        } catch (ne) {}g && (e = lc(g, k, a, d, e, f), -1 < e && (h = g.splice(e, 1)[0].eb, g.length || (b[ca] = void 0)));(this instanceof Window ? rc : sc).call(this, a, h || b, c);h && Ya[a] && this.__handlers && this.__handlers[a] && (a = this.__handlers[a][d ? "capture" : "bubble"], h = a.indexOf(h), -1 < h && a.splice(h, 1));
      }
    }function Cd() {
      for (var a in Ya) window.addEventListener(a, function (a) {
        a.__target || (nc(a), Bd(a));
      }, !0);
    }function nc(a) {
      a.__target = a.target;a.na = a.relatedTarget;if (D.S) {
        var b = tc,
            c = Object.getPrototypeOf(a);if (!c.hasOwnProperty("__patchProto")) {
          var d = Object.create(c);d.gb = c;Ja(d, b);c.__patchProto = d;
        }a.__proto__ = c.__patchProto;
      } else Ja(a, tc);
    }function da(a, b) {
      return { index: a, U: [], W: b };
    }function Dd(a, b, c, d) {
      var e = 0,
          f = 0,
          k = 0,
          h = 0,
          g = Math.min(b - e, d - f);if (0 == e && 0 == f) a: {
        for (k = 0; k < g; k++) if (a[k] !== c[k]) break a;k = g;
      }if (b == a.length && d == c.length) {
        h = a.length;for (var l = c.length, m = 0; m < g - k && Ed(a[--h], c[--l]);) m++;h = m;
      }e += k;f += k;b -= h;d -= h;if (0 == b - e && 0 == d - f) return [];
      if (e == b) {
        for (b = da(e, 0); f < d;) b.U.push(c[f++]);return [b];
      }if (f == d) return [da(e, b - e)];g = e;k = f;d = d - k + 1;h = b - g + 1;b = Array(d);for (l = 0; l < d; l++) b[l] = Array(h), b[l][0] = l;for (l = 0; l < h; l++) b[0][l] = l;for (l = 1; l < d; l++) for (m = 1; m < h; m++) if (a[g + m - 1] === c[k + l - 1]) b[l][m] = b[l - 1][m - 1];else {
        var n = b[l - 1][m] + 1,
            p = b[l][m - 1] + 1;b[l][m] = n < p ? n : p;
      }g = b.length - 1;k = b[0].length - 1;d = b[g][k];for (a = []; 0 < g || 0 < k;) 0 == g ? (a.push(2), k--) : 0 == k ? (a.push(3), g--) : (h = b[g - 1][k - 1], l = b[g - 1][k], m = b[g][k - 1], n = l < m ? l < h ? l : h : m < h ? m : h, n == h ? (h == d ? a.push(0) : (a.push(1), d = h), g--, k--) : n == l ? (a.push(3), g--, d = l) : (a.push(2), k--, d = m));a.reverse();b = void 0;g = [];for (k = 0; k < a.length; k++) switch (a[k]) {case 0:
          b && (g.push(b), b = void 0);e++;f++;break;case 1:
          b || (b = da(e, 0));b.W++;e++;b.U.push(c[f]);f++;break;case 2:
          b || (b = da(e, 0));b.W++;e++;break;case 3:
          b || (b = da(e, 0)), b.U.push(c[f]), f++;}b && g.push(b);return g;
    }function Ed(a, b) {
      return a === b;
    }function uc(a) {
      var b = [];do b.unshift(a); while (a = a.parentNode);return b;
    }function vc(a) {
      fc(a);return a.__shady && a.__shady.assignedSlot || null;
    }function K(a, b) {
      for (var c = Object.getOwnPropertyNames(b), d = 0; d < c.length; d++) {
        var e = c[d],
            f = Object.getOwnPropertyDescriptor(b, e);f.value ? a[e] = f.value : Object.defineProperty(a, e, f);
      }
    }function Fd() {
      var a = window.customElements && window.customElements.nativeHTMLElement || HTMLElement;K(window.Node.prototype, Gd);K(window.Window.prototype, Hd);K(window.Text.prototype, Id);K(window.DocumentFragment.prototype, Za);K(window.Element.prototype, wc);K(window.Document.prototype, xc);window.HTMLSlotElement && K(window.HTMLSlotElement.prototype, yc);K(a.prototype, Jd);D.S && (O(window.Node.prototype), O(window.Text.prototype), O(window.DocumentFragment.prototype), O(window.Element.prototype), O(a.prototype), O(window.Document.prototype), window.HTMLSlotElement && O(window.HTMLSlotElement.prototype));
    }function zc(a) {
      var b = Kd.has(a);a = /^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(a);return !b && a;
    }function q(a) {
      var b = a.isConnected;if (void 0 !== b) return b;for (; a && !(a.__CE_isImportDocument || a instanceof Document);) a = a.parentNode || (window.ShadowRoot && a instanceof ShadowRoot ? a.host : void 0);return !(!a || !(a.__CE_isImportDocument || a instanceof Document));
    }function $a(a, b) {
      for (; b && b !== a && !b.nextSibling;) b = b.parentNode;return b && b !== a ? b.nextSibling : null;
    }function N(a, b, c) {
      c = c ? c : new Set();for (var d = a; d;) {
        if (d.nodeType === Node.ELEMENT_NODE) {
          var e = d;b(e);var f = e.localName;if ("link" === f && "import" === e.getAttribute("rel")) {
            d = e.import;if (d instanceof Node && !c.has(d)) for (c.add(d), d = d.firstChild; d; d = d.nextSibling) N(d, b, c);d = $a(a, e);continue;
          } else if ("template" === f) {
            d = $a(a, e);continue;
          }if (e = e.__CE_shadowRoot) for (e = e.firstChild; e; e = e.nextSibling) N(e, b, c);
        }d = d.firstChild ? d.firstChild : $a(a, d);
      }
    }function x(a, b, c) {
      a[b] = c;
    }function ab(a) {
      a = a.replace(E.Sa, "").replace(E.port, "");var b = Ac,
          c = a,
          d = new ya();d.start = 0;d.end = c.length;for (var e = d, f = 0, k = c.length; f < k; f++) if ("{" === c[f]) {
        e.rules || (e.rules = []);var h = e,
            g = h.rules[h.rules.length - 1] || null;e = new ya();e.start = f + 1;e.parent = h;e.previous = g;h.rules.push(e);
      } else "}" === c[f] && (e.end = f + 1, e = e.parent || d);return b(d, a);
    }function Ac(a, b) {
      var c = b.substring(a.start, a.end - 1);a.parsedCssText = a.cssText = c.trim();a.parent && (c = b.substring(a.previous ? a.previous.end : a.parent.start, a.start - 1), c = Ld(c), c = c.replace(E.xa, " "), c = c.substring(c.lastIndexOf(";") + 1), c = a.parsedSelector = a.selector = c.trim(), a.atRule = 0 === c.indexOf("@"), a.atRule ? 0 === c.indexOf("@media") ? a.type = H.MEDIA_RULE : c.match(E.Wa) && (a.type = H.ca, a.keyframesName = a.selector.split(E.xa).pop()) : a.type = 0 === c.indexOf("--") ? H.la : H.STYLE_RULE);if (c = a.rules) for (var d = 0, e = c.length, f; d < e && (f = c[d]); d++) Ac(f, b);return a;
    }function Ld(a) {
      return a.replace(/\\([0-9a-f]{1,6})\s/gi, function (a, c) {
        a = c;for (c = 6 - a.length; c--;) a = "0" + a;return "\\" + a;
      });
    }function Bc(a, b, c) {
      c = void 0 === c ? "" : c;var d = "";if (a.cssText || a.rules) {
        var e = a.rules,
            f;if (f = e) f = e[0], f = !(f && f.selector && 0 === f.selector.indexOf("--"));if (f) {
          f = 0;for (var k = e.length, h; f < k && (h = e[f]); f++) d = Bc(h, b, d);
        } else b ? b = a.cssText : (b = a.cssText, b = b.replace(E.sa, "").replace(E.wa, ""), b = b.replace(E.Xa, "").replace(E.bb, "")), (d = b.trim()) && (d = "  " + d + "\n");
      }d && (a.selector && (c += a.selector + " {\n"), c += d, a.selector && (c += "}\n\n"));return c;
    }function Cc(a) {
      z = a && a.shimcssproperties ? !1 : w || !(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) || !window.CSS || !CSS.supports || !CSS.supports("box-shadow", "0 0 0 var(--foo)"));
    }function U(a, b) {
      if (!a) return "";"string" === typeof a && (a = ab(a));b && V(a, b);return Bc(a, z);
    }function oa(a) {
      !a.__cssRules && a.textContent && (a.__cssRules = ab(a.textContent));return a.__cssRules || null;
    }function Dc(a) {
      return !!a.parent && a.parent.type === H.ca;
    }function V(a, b, c, d) {
      if (a) {
        var e = !1,
            f = a.type;if (d && f === H.MEDIA_RULE) {
          var k = a.selector.match(Md);
          k && (window.matchMedia(k[1]).matches || (e = !0));
        }f === H.STYLE_RULE ? b(a) : c && f === H.ca ? c(a) : f === H.la && (e = !0);if ((a = a.rules) && !e) {
          e = 0;f = a.length;for (var h; e < f && (h = a[e]); e++) V(h, b, c, d);
        }
      }
    }function bb(a, b, c, d) {
      var e = document.createElement("style");b && e.setAttribute("scope", b);e.textContent = a;Ec(e, c, d);return e;
    }function Ec(a, b, c) {
      b = b || document.head;b.insertBefore(a, c && c.nextSibling || b.firstChild);P ? a.compareDocumentPosition(P) === Node.DOCUMENT_POSITION_PRECEDING && (P = a) : P = a;
    }function Fc(a, b) {
      var c = a.indexOf("var(");
      if (-1 === c) return b(a, "", "", "");a: {
        var d = 0;var e = c + 3;for (var f = a.length; e < f; e++) if ("(" === a[e]) d++;else if (")" === a[e] && 0 === --d) break a;e = -1;
      }d = a.substring(c + 4, e);c = a.substring(0, c);a = Fc(a.substring(e + 1), b);e = d.indexOf(",");return -1 === e ? b(c, d.trim(), "", a) : b(c, d.substring(0, e).trim(), d.substring(e + 1).trim(), a);
    }function pa(a, b) {
      w ? a.setAttribute("class", b) : window.ShadyDOM.nativeMethods.setAttribute.call(a, "class", b);
    }function Q(a) {
      var b = a.localName,
          c = "";b ? -1 < b.indexOf("-") || (c = b, b = a.getAttribute && a.getAttribute("is") || "") : (b = a.is, c = a.extends);return { is: b, V: c };
    }function Gc(a) {
      for (var b = 0; b < a.length; b++) {
        var c = a[b];if (c.target !== document.documentElement && c.target !== document.head) for (var d = 0; d < c.addedNodes.length; d++) {
          var e = c.addedNodes[d];if (e.nodeType === Node.ELEMENT_NODE) {
            var f = e.getRootNode();var k = e;var h = [];k.classList ? h = Array.from(k.classList) : k instanceof window.SVGElement && k.hasAttribute("class") && (h = k.getAttribute("class").split(/\s+/));k = h;h = k.indexOf(t.a);if ((k = -1 < h ? k[h + 1] : "") && f === e.ownerDocument) t.b(e, k, !0);else if (f.nodeType === Node.DOCUMENT_FRAGMENT_NODE && (f = f.host)) if (f = Q(f).is, k === f) for (e = window.ShadyDOM.nativeMethods.querySelectorAll.call(e, ":not(." + t.a + ")"), f = 0; f < e.length; f++) t.h(e[f], k);else k && t.b(e, k, !0), t.b(e, f);
          }
        }
      }
    }function Nd(a) {
      if (a = qa[a]) a._applyShimCurrentVersion = a._applyShimCurrentVersion || 0, a._applyShimValidatingVersion = a._applyShimValidatingVersion || 0, a._applyShimNextVersion = (a._applyShimNextVersion || 0) + 1;
    }function Hc(a) {
      return a._applyShimCurrentVersion === a._applyShimNextVersion;
    }
    function Od(a) {
      a._applyShimValidatingVersion = a._applyShimNextVersion;a.b || (a.b = !0, Pd.then(function () {
        a._applyShimCurrentVersion = a._applyShimNextVersion;a.b = !1;
      }));
    }function rb(a) {
      requestAnimationFrame(function () {
        Ic ? Ic(a) : (cb || (cb = new Promise(function (a) {
          db = a;
        }), "complete" === document.readyState ? db() : document.addEventListener("readystatechange", function () {
          "complete" === document.readyState && db();
        })), cb.then(function () {
          a && a();
        }));
      });
    }function Jc() {
      requestAnimationFrame(function () {
        window.WebComponents.ready = !0;
        window.document.dispatchEvent(new CustomEvent("WebComponentsReady", { bubbles: !0 }));
      });
    }function Kc() {
      Jc();eb.removeEventListener("readystatechange", Kc);
    }var D = window.ShadyDOM || {};D.Ta = !(!Element.prototype.attachShadow || !Node.prototype.getRootNode);var fb = Object.getOwnPropertyDescriptor(Node.prototype, "firstChild");D.S = !!(fb && fb.configurable && fb.get);D.va = D.force || !D.Ta;var W = Element.prototype,
        Lc = W.matches || W.matchesSelector || W.mozMatchesSelector || W.msMatchesSelector || W.oMatchesSelector || W.webkitMatchesSelector,
        Ma = document.createTextNode(""),
        Ib = 0,
        La = [];new MutationObserver(function () {
      for (; La.length;) try {
        La.shift()();
      } catch (a) {
        throw Ma.textContent = Ib++, a;
      }
    }).observe(Ma, { characterData: !0 });var Qd = !!document.contains,
        Z = [],
        Na;la.list = Z;ka.prototype.$a = function () {
      var a = this;this.a || (this.a = !0, Hb(function () {
        a.b();
      }));
    };ka.prototype.b = function () {
      if (this.a) {
        this.a = !1;var a = this.takeRecords();a.length && this.X.forEach(function (b) {
          b(a);
        });
      }
    };ka.prototype.takeRecords = function () {
      if (this.addedNodes.length || this.removedNodes.length) {
        var a = [{ addedNodes: this.addedNodes, removedNodes: this.removedNodes }];this.addedNodes = [];this.removedNodes = [];return a;
      }return [];
    };var $b = Element.prototype.appendChild,
        Ua = Element.prototype.insertBefore,
        aa = Element.prototype.removeChild,
        hc = Element.prototype.setAttribute,
        Mc = Element.prototype.removeAttribute,
        gb = Element.prototype.cloneNode,
        Va = Document.prototype.importNode,
        pc = Element.prototype.addEventListener,
        sc = Element.prototype.removeEventListener,
        oc = Window.prototype.addEventListener,
        rc = Window.prototype.removeEventListener,
        hb = Element.prototype.dispatchEvent,
        ba = Node.prototype.contains || HTMLElement.prototype.contains,
        Rd = Object.freeze({ appendChild: $b, insertBefore: Ua, removeChild: aa, setAttribute: hc, removeAttribute: Mc, cloneNode: gb, importNode: Va, addEventListener: pc, removeEventListener: sc, kb: oc, lb: rc, dispatchEvent: hb, querySelector: Element.prototype.querySelector, querySelectorAll: Element.prototype.querySelectorAll, contains: ba }),
        xd = /[&\u00A0"]/g,
        Ad = /[&\u00A0<>]/g,
        yd = Mb("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),
        zd = Mb("style script xmp iframe noembed noframes plaintext noscript".split(" ")),
        B = document.createTreeWalker(document, NodeFilter.SHOW_ALL, null, !1),
        C = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null, !1),
        Sd = Object.freeze({ parentNode: T, firstChild: Ha, lastChild: Ia, previousSibling: Nb, nextSibling: Ob, childNodes: R, parentElement: Pb, firstElementChild: Qb, lastElementChild: Rb, previousElementSibling: Sb, nextElementSibling: Tb, children: Ub, innerHTML: Vb, textContent: Wb }),
        ib = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML") || Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerHTML"),
        ra = document.implementation.createHTMLDocument("inert").createElement("div"),
        jb = Object.getOwnPropertyDescriptor(Document.prototype, "activeElement"),
        Xb = { parentElement: { get: function () {
          var a = this.__shady && this.__shady.parentNode;a && a.nodeType !== Node.ELEMENT_NODE && (a = null);return void 0 !== a ? a : Pb(this);
        }, configurable: !0 }, parentNode: { get: function () {
          var a = this.__shady && this.__shady.parentNode;return void 0 !== a ? a : T(this);
        }, configurable: !0 },
      nextSibling: { get: function () {
          var a = this.__shady && this.__shady.nextSibling;return void 0 !== a ? a : Ob(this);
        }, configurable: !0 }, previousSibling: { get: function () {
          var a = this.__shady && this.__shady.previousSibling;return void 0 !== a ? a : Nb(this);
        }, configurable: !0 }, className: { get: function () {
          return this.getAttribute("class") || "";
        }, set: function (a) {
          this.setAttribute("class", a);
        }, configurable: !0 }, nextElementSibling: { get: function () {
          if (this.__shady && void 0 !== this.__shady.nextSibling) {
            for (var a = this.nextSibling; a && a.nodeType !== Node.ELEMENT_NODE;) a = a.nextSibling;return a;
          }return Tb(this);
        }, configurable: !0 }, previousElementSibling: { get: function () {
          if (this.__shady && void 0 !== this.__shady.previousSibling) {
            for (var a = this.previousSibling; a && a.nodeType !== Node.ELEMENT_NODE;) a = a.previousSibling;return a;
          }return Sb(this);
        }, configurable: !0 } },
        Pa = { childNodes: { get: function () {
          if (S(this)) {
            if (!this.__shady.childNodes) {
              this.__shady.childNodes = [];for (var a = this.firstChild; a; a = a.nextSibling) this.__shady.childNodes.push(a);
            }var b = this.__shady.childNodes;
          } else b = R(this);b.item = function (a) {
            return b[a];
          };return b;
        }, configurable: !0 }, childElementCount: { get: function () {
          return this.children.length;
        }, configurable: !0 }, firstChild: { get: function () {
          var a = this.__shady && this.__shady.firstChild;return void 0 !== a ? a : Ha(this);
        }, configurable: !0 }, lastChild: { get: function () {
          var a = this.__shady && this.__shady.lastChild;return void 0 !== a ? a : Ia(this);
        }, configurable: !0 }, textContent: { get: function () {
          if (S(this)) {
            for (var a = [], b = 0, c = this.childNodes, d; d = c[b]; b++) d.nodeType !== Node.COMMENT_NODE && a.push(d.textContent);return a.join("");
          }return Wb(this);
        }, set: function (a) {
          switch (this.nodeType) {case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:
              for (; this.firstChild;) this.removeChild(this.firstChild);(0 < a.length || this.nodeType === Node.ELEMENT_NODE) && this.appendChild(document.createTextNode(a));break;default:
              this.nodeValue = a;}
        }, configurable: !0 }, firstElementChild: { get: function () {
          if (this.__shady && void 0 !== this.__shady.firstChild) {
            for (var a = this.firstChild; a && a.nodeType !== Node.ELEMENT_NODE;) a = a.nextSibling;
            return a;
          }return Qb(this);
        }, configurable: !0 }, lastElementChild: { get: function () {
          if (this.__shady && void 0 !== this.__shady.lastChild) {
            for (var a = this.lastChild; a && a.nodeType !== Node.ELEMENT_NODE;) a = a.previousSibling;return a;
          }return Rb(this);
        }, configurable: !0 }, children: { get: function () {
          var a;S(this) ? a = Array.prototype.filter.call(this.childNodes, function (a) {
            return a.nodeType === Node.ELEMENT_NODE;
          }) : a = Ub(this);a.item = function (b) {
            return a[b];
          };return a;
        }, configurable: !0 }, innerHTML: { get: function () {
          var a = "template" === this.localName ? this.content : this;return S(this) ? Oa(a) : Vb(a);
        }, set: function (a) {
          for (var b = "template" === this.localName ? this.content : this; b.firstChild;) b.removeChild(b.firstChild);for (ib && ib.set ? ib.set.call(ra, a) : ra.innerHTML = a; ra.firstChild;) b.appendChild(ra.firstChild);
        }, configurable: !0 } },
        Nc = { shadowRoot: { get: function () {
          return this.__shady && this.__shady.Ya || null;
        }, configurable: !0 } },
        Qa = { activeElement: { get: function () {
          var a = jb && jb.get ? jb.get.call(document) : D.S ? void 0 : document.activeElement;if (a && a.nodeType) {
            var b = !!F(this);if (this === document || b && this.host !== a && ba.call(this.host, a)) {
              for (b = Y(a); b && b !== this;) a = b.host, b = Y(a);a = this === document ? b ? null : a : b === this ? a : null;
            } else a = null;
          } else a = null;return a;
        }, set: function () {}, configurable: !0 } },
        Gb = D.S ? function () {} : function (a) {
      a.__shady && a.__shady.Ia || (a.__shady = a.__shady || {}, a.__shady.Ia = !0, J(a, Xb, !0));
    },
        Fb = D.S ? function () {} : function (a) {
      a.__shady && a.__shady.Ga || (a.__shady = a.__shady || {}, a.__shady.Ga = !0, J(a, Pa, !0), J(a, Nc, !0));
    },
        na = null,
        ca = "__eventWrappers" + Date.now(),
        Td = { blur: !0,
      focus: !0, focusin: !0, focusout: !0, click: !0, dblclick: !0, mousedown: !0, mouseenter: !0, mouseleave: !0, mousemove: !0, mouseout: !0, mouseover: !0, mouseup: !0, wheel: !0, beforeinput: !0, input: !0, keydown: !0, keyup: !0, compositionstart: !0, compositionupdate: !0, compositionend: !0, touchstart: !0, touchend: !0, touchmove: !0, touchcancel: !0, pointerover: !0, pointerenter: !0, pointerdown: !0, pointermove: !0, pointerup: !0, pointercancel: !0, pointerout: !0, pointerleave: !0, gotpointercapture: !0, lostpointercapture: !0, dragstart: !0, drag: !0, dragenter: !0,
      dragleave: !0, dragover: !0, drop: !0, dragend: !0, DOMActivate: !0, DOMFocusIn: !0, DOMFocusOut: !0, keypress: !0 },
        tc = { get composed() {
        !1 !== this.isTrusted && void 0 === this.da && (this.da = Td[this.type]);return this.da || !1;
      }, composedPath: function () {
        this.ma || (this.ma = Wa(this.__target, this.composed));return this.ma;
      }, get target() {
        return jc(this.currentTarget, this.composedPath());
      }, get relatedTarget() {
        if (!this.na) return null;this.oa || (this.oa = Wa(this.na, !0));return jc(this.currentTarget, this.oa);
      }, stopPropagation: function () {
        Event.prototype.stopPropagation.call(this);
        this.ea = !0;
      }, stopImmediatePropagation: function () {
        Event.prototype.stopImmediatePropagation.call(this);this.ea = this.Fa = !0;
      } },
        Ya = { focus: !0, blur: !0 },
        Ud = Xa(window.Event),
        Vd = Xa(window.CustomEvent),
        Wd = Xa(window.MouseEvent),
        Eb = {};l.prototype = Object.create(DocumentFragment.prototype);l.prototype.F = function (a, b) {
      this.Ha = "ShadyRoot";ja(a);ja(this);this.host = a;this.H = b && b.mode;a.__shady = a.__shady || {};a.__shady.root = this;a.__shady.Ya = "closed" !== this.H ? this : null;this.P = !1;this.b = [];this.a = {};this.c = [];b = R(a);for (var c = 0, d = b.length; c < d; c++) aa.call(a, b[c]);
    };l.prototype.L = function () {
      var a = this;this.P || (this.P = !0, Kb(function () {
        return a.ra();
      }));
    };l.prototype.K = function () {
      for (var a = this, b = this; b;) b.P && (a = b), b = b.Oa();return a;
    };l.prototype.Oa = function () {
      var a = this.host.getRootNode();if (F(a)) for (var b = this.host.childNodes, c = 0, d; c < b.length; c++) if (d = b[c], this.j(d)) return a;
    };l.prototype.ra = function () {
      this.P && this.K()._renderRoot();
    };l.prototype._renderRoot = function () {
      this.P = !1;this.B();this.u();
    };l.prototype.B = function () {
      this.f();
      for (var a = 0, b; a < this.b.length; a++) b = this.b[a], this.o(b);for (b = this.host.firstChild; b; b = b.nextSibling) this.h(b);for (a = 0; a < this.b.length; a++) {
        b = this.b[a];if (!b.__shady.assignedNodes.length) for (var c = b.firstChild; c; c = c.nextSibling) this.h(c, b);c = b.parentNode;(c = c.__shady && c.__shady.root) && c.pa() && c._renderRoot();this.g(b.__shady.R, b.__shady.assignedNodes);if (c = b.__shady.qa) {
          for (var d = 0; d < c.length; d++) c[d].__shady.ga = null;b.__shady.qa = null;c.length > b.__shady.assignedNodes.length && (b.__shady.ia = !0);
        }b.__shady.ia && (b.__shady.ia = !1, this.i(b));
      }
    };l.prototype.h = function (a, b) {
      a.__shady = a.__shady || {};var c = a.__shady.ga;a.__shady.ga = null;b || (b = (b = this.a[a.slot || "__catchall"]) && b[0]);b ? (b.__shady.assignedNodes.push(a), a.__shady.assignedSlot = b) : a.__shady.assignedSlot = void 0;c !== a.__shady.assignedSlot && a.__shady.assignedSlot && (a.__shady.assignedSlot.__shady.ia = !0);
    };l.prototype.o = function (a) {
      var b = a.__shady.assignedNodes;a.__shady.assignedNodes = [];a.__shady.R = [];if (a.__shady.qa = b) for (var c = 0; c < b.length; c++) {
        var d = b[c];
        d.__shady.ga = d.__shady.assignedSlot;d.__shady.assignedSlot === a && (d.__shady.assignedSlot = null);
      }
    };l.prototype.g = function (a, b) {
      for (var c = 0, d; c < b.length && (d = b[c]); c++) "slot" == d.localName ? this.g(a, d.__shady.assignedNodes) : a.push(b[c]);
    };l.prototype.i = function (a) {
      hb.call(a, new Event("slotchange"));a.__shady.assignedSlot && this.i(a.__shady.assignedSlot);
    };l.prototype.u = function () {
      for (var a = this.b, b = [], c = 0; c < a.length; c++) {
        var d = a[c].parentNode;d.__shady && d.__shady.root || !(0 > b.indexOf(d)) || b.push(d);
      }for (a = 0; a < b.length; a++) c = b[a], this.O(c === this ? this.host : c, this.w(c));
    };l.prototype.w = function (a) {
      var b = [];a = a.childNodes;for (var c = 0; c < a.length; c++) {
        var d = a[c];if (this.j(d)) {
          d = d.__shady.R;for (var e = 0; e < d.length; e++) b.push(d[e]);
        } else b.push(d);
      }return b;
    };l.prototype.j = function (a) {
      return "slot" == a.localName;
    };l.prototype.O = function (a, b) {
      for (var c = R(a), d = Dd(b, b.length, c, c.length), e = 0, f = 0, k; e < d.length && (k = d[e]); e++) {
        for (var h = 0, g; h < k.U.length && (g = k.U[h]); h++) T(g) === a && aa.call(a, g), c.splice(k.index + f, 1);f -= k.W;
      }for (e = 0; e < d.length && (k = d[e]); e++) for (f = c[k.index], h = k.index; h < k.index + k.W; h++) g = b[h], Ua.call(a, g, f), c.splice(h, 0, g);
    };l.prototype.Ka = function (a) {
      this.c.push.apply(this.c, [].concat(a instanceof Array ? a : cd(bd(a))));
    };l.prototype.f = function () {
      this.c.length && (this.G(this.c), this.c = []);
    };l.prototype.G = function (a) {
      for (var b, c = 0; c < a.length; c++) {
        var d = a[c];d.__shady = d.__shady || {};ja(d);ja(d.parentNode);var e = this.l(d);this.a[e] ? (b = b || {}, b[e] = !0, this.a[e].push(d)) : this.a[e] = [d];this.b.push(d);
      }if (b) for (var f in b) this.a[f] = this.m(this.a[f]);
    };l.prototype.l = function (a) {
      var b = a.name || a.getAttribute("name") || "__catchall";return a.Ja = b;
    };l.prototype.m = function (a) {
      return a.sort(function (a, c) {
        a = uc(a);for (var b = uc(c), e = 0; e < a.length; e++) {
          c = a[e];var f = b[e];if (c !== f) return a = Array.from(c.parentNode.childNodes), a.indexOf(c) - a.indexOf(f);
        }
      });
    };l.prototype.Na = function (a) {
      this.f();var b = this.a,
          c;for (c in b) for (var d = b[c], e = 0; e < d.length; e++) {
        var f = d[e];if (Jb(a, f)) {
          d.splice(e, 1);var k = this.b.indexOf(f);0 <= k && this.b.splice(k, 1);e--;this.I(f);
          k = !0;
        }
      }return k;
    };l.prototype.Pa = function (a) {
      var b = a.Ja,
          c = this.l(a);if (c !== b) {
        b = this.a[b];var d = b.indexOf(a);0 <= d && b.splice(d, 1);b = this.a[c] || (this.a[c] = []);b.push(a);1 < b.length && (this.a[c] = this.m(b));
      }
    };l.prototype.I = function (a) {
      if (a = a.__shady.R) for (var b = 0; b < a.length; b++) {
        var c = a[b],
            d = T(c);d && aa.call(d, c);
      }
    };l.prototype.pa = function () {
      this.f();return !!this.b.length;
    };l.prototype.addEventListener = function (a, b, c) {
      "object" !== typeof c && (c = { capture: !!c });c.fa = this;this.host.addEventListener(a, b, c);
    };l.prototype.removeEventListener = function (a, b, c) {
      "object" !== typeof c && (c = { capture: !!c });c.fa = this;this.host.removeEventListener(a, b, c);
    };l.prototype.getElementById = function (a) {
      return ma(this, function (b) {
        return b.id == a;
      }, function (a) {
        return !!a;
      })[0] || null;
    };(function (a) {
      J(a, Pa, !0);J(a, Qa, !0);
    })(l.prototype);var Hd = { addEventListener: mc.bind(window), removeEventListener: qc.bind(window) },
        Gd = { addEventListener: mc, removeEventListener: qc, appendChild: function (a) {
        return Ra(this, a);
      }, insertBefore: function (a, b) {
        return Ra(this, a, b);
      }, removeChild: function (a) {
        return Sa(this, a);
      }, replaceChild: function (a, b) {
        Ra(this, a, b);Sa(this, b);return a;
      }, cloneNode: function (a) {
        if ("template" == this.localName) var b = gb.call(this, a);else if (b = gb.call(this, !1), a) {
          a = this.childNodes;for (var c = 0, d; c < a.length; c++) d = a[c].cloneNode(!0), b.appendChild(d);
        }return b;
      }, getRootNode: function () {
        return dc(this);
      }, contains: function (a) {
        return Jb(this, a);
      }, get isConnected() {
        var a = this.ownerDocument;if (Qd && ba.call(a, this) || a.documentElement && ba.call(a.documentElement, this)) return !0;for (a = this; a && !(a instanceof Document);) a = a.parentNode || (a instanceof l ? a.host : void 0);return !!(a && a instanceof Document);
      }, dispatchEvent: function (a) {
        la();return hb.call(this, a);
      } },
        Id = { get assignedSlot() {
        return vc(this);
      } },
        Za = { querySelector: function (a) {
        return ma(this, function (b) {
          return Lc.call(b, a);
        }, function (a) {
          return !!a;
        })[0] || null;
      }, querySelectorAll: function (a) {
        return ma(this, function (b) {
          return Lc.call(b, a);
        });
      } },
        yc = { assignedNodes: function (a) {
        if ("slot" === this.localName) return fc(this), this.__shady ? (a && a.flatten ? this.__shady.R : this.__shady.assignedNodes) || [] : [];
      } },
        wc = Ka({ setAttribute: function (a, b) {
        gc(this, a, b);
      }, removeAttribute: function (a) {
        Mc.call(this, a);cc(this, a);
      }, attachShadow: function (a) {
        if (!this) throw "Must provide a host.";if (!a) throw "Not enough arguments.";return new l(Eb, this, a);
      }, get slot() {
        return this.getAttribute("slot");
      }, set slot(a) {
        gc(this, "slot", a);
      }, get assignedSlot() {
        return vc(this);
      } }, Za, yc);Object.defineProperties(wc, Nc);var xc = Ka({ importNode: function (a, b) {
        return ic(a, b);
      }, getElementById: function (a) {
        return ma(this, function (b) {
          return b.id == a;
        }, function (a) {
          return !!a;
        })[0] || null;
      } }, Za);Object.defineProperties(xc, { _activeElement: Qa.activeElement });var Xd = HTMLElement.prototype.blur,
        Jd = Ka({ blur: function () {
        var a = this.__shady && this.__shady.root;(a = a && a.activeElement) ? a.blur() : Xd.call(this);
      } });D.va && (window.ShadyDOM = { inUse: D.va, patch: function (a) {
        return a;
      }, isShadyRoot: F, enqueue: Kb, flush: la, settings: D, filterMutations: wd, observeChildren: ud, unobserveChildren: td, nativeMethods: Rd, nativeTree: Sd }, window.Event = Ud, window.CustomEvent = Vd, window.MouseEvent = Wd, Cd(), Fd(), window.ShadowRoot = l);var Kd = new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));A.prototype.B = function (a, b) {
      this.o.set(a, b);this.m.set(b.constructor, b);
    };A.prototype.c = function (a) {
      return this.o.get(a);
    };A.prototype.w = function (a) {
      return this.m.get(a);
    };A.prototype.u = function (a) {
      this.h = !0;this.j.push(a);
    };A.prototype.l = function (a) {
      var b = this;this.h && N(a, function (a) {
        return b.g(a);
      });
    };A.prototype.g = function (a) {
      if (this.h && !a.__CE_patched) {
        a.__CE_patched = !0;for (var b = 0; b < this.j.length; b++) this.j[b](a);
      }
    };A.prototype.b = function (a) {
      var b = [];N(a, function (a) {
        return b.push(a);
      });for (a = 0; a < b.length; a++) {
        var c = b[a];1 === c.__CE_state ? this.connectedCallback(c) : this.i(c);
      }
    };A.prototype.a = function (a) {
      var b = [];N(a, function (a) {
        return b.push(a);
      });for (a = 0; a < b.length; a++) {
        var c = b[a];1 === c.__CE_state && this.disconnectedCallback(c);
      }
    };A.prototype.f = function (a, b) {
      var c = this;b = b ? b : {};var d = b.cb || new Set(),
          e = b.ya || function (a) {
        return c.i(a);
      },
          f = [];N(a, function (a) {
        if ("link" === a.localName && "import" === a.getAttribute("rel")) {
          var b = a.import;b instanceof Node && "complete" === b.readyState ? (b.__CE_isImportDocument = !0, b.__CE_hasRegistry = !0) : a.addEventListener("load", function () {
            var b = a.import;if (!b.__CE_documentLoadHandled) {
              b.__CE_documentLoadHandled = !0;b.__CE_isImportDocument = !0;b.__CE_hasRegistry = !0;var f = new Set(d);f.delete(b);c.f(b, { cb: f, ya: e });
            }
          });
        } else f.push(a);
      }, d);if (this.h) for (a = 0; a < f.length; a++) this.g(f[a]);for (a = 0; a < f.length; a++) e(f[a]);
    };A.prototype.i = function (a) {
      if (void 0 === a.__CE_state) {
        var b = this.c(a.localName);if (b) {
          b.constructionStack.push(a);var c = b.constructor;try {
            try {
              if (new c() !== a) throw Error("The custom element constructor did not produce the element being upgraded.");
            } finally {
              b.constructionStack.pop();
            }
          } catch (f) {
            throw a.__CE_state = 2, f;
          }a.__CE_state = 1;a.__CE_definition = b;if (b.attributeChangedCallback) for (b = b.observedAttributes, c = 0; c < b.length; c++) {
            var d = b[c],
                e = a.getAttribute(d);null !== e && this.attributeChangedCallback(a, d, null, e, null);
          }q(a) && this.connectedCallback(a);
        }
      }
    };A.prototype.connectedCallback = function (a) {
      var b = a.__CE_definition;b.connectedCallback && b.connectedCallback.call(a);
    };A.prototype.disconnectedCallback = function (a) {
      var b = a.__CE_definition;b.disconnectedCallback && b.disconnectedCallback.call(a);
    };A.prototype.attributeChangedCallback = function (a, b, c, d, e) {
      var f = a.__CE_definition;f.attributeChangedCallback && -1 < f.observedAttributes.indexOf(b) && f.attributeChangedCallback.call(a, b, c, d, e);
    };Ga.prototype.c = function () {
      this.M && this.M.disconnect();
    };
    Ga.prototype.f = function (a) {
      var b = this.a.readyState;"interactive" !== b && "complete" !== b || this.c();for (b = 0; b < a.length; b++) for (var c = a[b].addedNodes, d = 0; d < c.length; d++) this.b.f(c[d]);
    };Db.prototype.c = function () {
      if (this.a) throw Error("Already resolved.");this.a = void 0;this.b && this.b(void 0);
    };y.prototype.define = function (a, b) {
      var c = this;if (!(b instanceof Function)) throw new TypeError("Custom element constructors must be functions.");if (!zc(a)) throw new SyntaxError("The element name '" + a + "' is not valid.");
      if (this.a.c(a)) throw Error("A custom element with name '" + a + "' has already been defined.");if (this.c) throw Error("A custom element is already being defined.");this.c = !0;try {
        var d = function (a) {
          var b = e[a];if (void 0 !== b && !(b instanceof Function)) throw Error("The '" + a + "' callback must be a function.");return b;
        },
            e = b.prototype;if (!(e instanceof Object)) throw new TypeError("The custom element constructor's prototype is not an object.");var f = d("connectedCallback");var k = d("disconnectedCallback");var g = d("adoptedCallback");
        var l = d("attributeChangedCallback");var n = b.observedAttributes || [];
      } catch (m) {
        return;
      } finally {
        this.c = !1;
      }b = { localName: a, constructor: b, connectedCallback: f, disconnectedCallback: k, adoptedCallback: g, attributeChangedCallback: l, observedAttributes: n, constructionStack: [] };this.a.B(a, b);this.g.push(b);this.b || (this.b = !0, this.f(function () {
        return c.j();
      }));
    };y.prototype.j = function () {
      var a = this;if (!1 !== this.b) {
        this.b = !1;for (var b = this.g, c = [], d = new Map(), e = 0; e < b.length; e++) d.set(b[e].localName, []);this.a.f(document, { ya: function (b) {
            if (void 0 === b.__CE_state) {
              var e = b.localName,
                  f = d.get(e);f ? f.push(b) : a.a.c(e) && c.push(b);
            }
          } });for (e = 0; e < c.length; e++) this.a.i(c[e]);for (; 0 < b.length;) {
          var f = b.shift();e = f.localName;f = d.get(f.localName);for (var k = 0; k < f.length; k++) this.a.i(f[k]);(e = this.h.get(e)) && e.c();
        }
      }
    };y.prototype.get = function (a) {
      if (a = this.a.c(a)) return a.constructor;
    };y.prototype.whenDefined = function (a) {
      if (!zc(a)) return Promise.reject(new SyntaxError("'" + a + "' is not a valid custom element name."));var b = this.h.get(a);if (b) return b.f;b = new Db();this.h.set(a, b);this.a.c(a) && !this.g.some(function (b) {
        return b.localName === a;
      }) && b.c();return b.f;
    };y.prototype.l = function (a) {
      this.i.c();var b = this.f;this.f = function (c) {
        return a(function () {
          return b(c);
        });
      };
    };window.CustomElementRegistry = y;y.prototype.define = y.prototype.define;y.prototype.get = y.prototype.get;y.prototype.whenDefined = y.prototype.whenDefined;y.prototype.polyfillWrapFlushCallback = y.prototype.l;var Ba = window.Document.prototype.createElement,
        od = window.Document.prototype.createElementNS,
        nd = window.Document.prototype.importNode,
        pd = window.Document.prototype.prepend,
        qd = window.Document.prototype.append,
        Yd = window.DocumentFragment.prototype.prepend,
        Zd = window.DocumentFragment.prototype.append,
        tb = window.Node.prototype.cloneNode,
        ha = window.Node.prototype.appendChild,
        Ab = window.Node.prototype.insertBefore,
        Ca = window.Node.prototype.removeChild,
        Bb = window.Node.prototype.replaceChild,
        Fa = Object.getOwnPropertyDescriptor(window.Node.prototype, "textContent"),
        sb = window.Element.prototype.attachShadow,
        za = Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML"),
        Da = window.Element.prototype.getAttribute,
        ub = window.Element.prototype.setAttribute,
        wb = window.Element.prototype.removeAttribute,
        ia = window.Element.prototype.getAttributeNS,
        vb = window.Element.prototype.setAttributeNS,
        xb = window.Element.prototype.removeAttributeNS,
        zb = window.Element.prototype.insertAdjacentElement,
        ed = window.Element.prototype.prepend,
        fd = window.Element.prototype.append,
        hd = window.Element.prototype.before,
        id = window.Element.prototype.after,
        jd = window.Element.prototype.replaceWith,
        kd = window.Element.prototype.remove,
        sd = window.HTMLElement,
        Aa = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, "innerHTML"),
        yb = window.HTMLElement.prototype.insertAdjacentElement,
        Cb = new function () {}(),
        sa = window.customElements;if (!sa || sa.forcePolyfill || "function" != typeof sa.define || "function" != typeof sa.get) {
      var X = new A();rd(X);md(X);Ea(X, DocumentFragment.prototype, { Z: Yd, append: Zd });ld(X);dd(X);document.__CE_hasRegistry = !0;var $d = new y(X);Object.defineProperty(window, "customElements", { configurable: !0,
        enumerable: !0, value: $d });
    }var H = { STYLE_RULE: 1, ca: 7, MEDIA_RULE: 4, la: 1E3 },
        E = { Sa: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim, port: /@import[^;]*;/gim, sa: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim, wa: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim, Xa: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim, bb: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim, Wa: /^@[^\s]*keyframes/, xa: /\s+/g },
        w = !(window.ShadyDOM && window.ShadyDOM.inUse);if (window.ShadyCSS && void 0 !== window.ShadyCSS.nativeCss) var z = window.ShadyCSS.nativeCss;else window.ShadyCSS ? (Cc(window.ShadyCSS), window.ShadyCSS = void 0) : Cc(window.WebComponents && window.WebComponents.flags);var ta = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,
        ua = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,
        ae = /(--[\w-]+)\s*([:,;)]|$)/gi,
        be = /(animation\s*:)|(animation-name\s*:)/,
        Md = /@media\s(.*)/,
        ce = /\{[^}]*\}/g,
        P = null;r.prototype.b = function (a, b, c) {
      a.__styleScoped ? a.__styleScoped = null : this.j(a, b || "", c);
    };r.prototype.j = function (a, b, c) {
      a.nodeType === Node.ELEMENT_NODE && this.h(a, b, c);if (a = "template" === a.localName ? (a.content || a.hb).childNodes : a.children || a.childNodes) for (var d = 0; d < a.length; d++) this.j(a[d], b, c);
    };r.prototype.h = function (a, b, c) {
      if (b) if (a.classList) c ? (a.classList.remove("style-scope"), a.classList.remove(b)) : (a.classList.add("style-scope"), a.classList.add(b));else if (a.getAttribute) {
        var d = a.getAttribute(de);c ? d && (b = d.replace("style-scope", "").replace(b, ""), pa(a, b)) : pa(a, (d ? d + " " : "") + "style-scope " + b);
      }
    };r.prototype.c = function (a, b, c) {
      var d = a.__cssBuild;w || "shady" === d ? b = U(b, c) : (a = Q(a), b = this.G(b, a.is, a.V, c) + "\n\n");return b.trim();
    };r.prototype.G = function (a, b, c, d) {
      var e = this.f(b, c);b = this.i(b);var f = this;return U(a, function (a) {
        a.c || (f.I(a, b, e), a.c = !0);d && d(a, b, e);
      });
    };r.prototype.i = function (a) {
      return a ? ee + a : "";
    };r.prototype.f = function (a, b) {
      return b ? "[is=" + a + "]" : a;
    };r.prototype.I = function (a, b, c) {
      this.l(a, this.g, b, c);
    };r.prototype.l = function (a, b, c, d) {
      a.selector = a.v = this.m(a, b, c, d);
    };r.prototype.m = function (a, b, c, d) {
      var e = a.selector.split(Oc);if (!Dc(a)) {
        a = 0;for (var f = e.length, k; a < f && (k = e[a]); a++) e[a] = b.call(this, k, c, d);
      }return e.join(Oc);
    };r.prototype.u = function (a) {
      return a.replace(kb, function (a, c, d) {
        -1 < d.indexOf("+") ? d = d.replace(/\+/g, "___") : -1 < d.indexOf("___") && (d = d.replace(/___/g, "+"));return ":" + c + "(" + d + ")";
      });
    };r.prototype.g = function (a, b, c) {
      var d = this,
          e = !1;a = a.trim();var f = kb.test(a);f && (a = a.replace(kb, function (a, b, c) {
        return ":" + b + "(" + c.replace(/\s/g, "") + ")";
      }), a = this.u(a));a = a.replace(fe, lb + " $1");a = a.replace(ge, function (a, f, g) {
        e || (a = d.B(g, f, b, c), e = e || a.stop, f = a.Ra, g = a.value);return f + g;
      });f && (a = this.u(a));return a;
    };r.prototype.B = function (a, b, c, d) {
      var e = a.indexOf(mb);0 <= a.indexOf(lb) ? a = this.F(a, d) : 0 !== e && (a = c ? this.o(a, c) : a);c = !1;0 <= e && (b = "", c = !0);if (c) {
        var f = !0;c && (a = a.replace(he, function (a, b) {
          return " > " + b;
        }));
      }a = a.replace(ie, function (a, b, c) {
        return '[dir="' + c + '"] ' + b + ", " + b + '[dir="' + c + '"]';
      });return { value: a, Ra: b, stop: f };
    };r.prototype.o = function (a, b) {
      a = a.split(Pc);a[0] += b;return a.join(Pc);
    };r.prototype.F = function (a, b) {
      var c = a.match(Qc);return (c = c && c[2].trim() || "") ? c[0].match(Rc) ? a.replace(Qc, function (a, c, f) {
        return b + f;
      }) : c.split(Rc)[0] === b ? c : je : a.replace(lb, b);
    };r.prototype.H = function (a) {
      a.selector = a.parsedSelector;this.w(a);this.l(a, this.K);
    };r.prototype.w = function (a) {
      a.selector === ke && (a.selector = "html");
    };r.prototype.K = function (a) {
      return a.match(mb) ? this.g(a, Sc) : this.o(a.trim(), Sc);
    };I.Object.defineProperties(r.prototype, { a: { configurable: !0, enumerable: !0, get: function () {
          return "style-scope";
        } } });var kb = /:(nth[-\w]+)\(([^)]+)\)/,
        Sc = ":not(.style-scope)",
        Oc = ",",
        ge = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g,
        Rc = /[[.:#*]/,
        lb = ":host",
        ke = ":root",
        mb = "::slotted",
        fe = new RegExp("^(" + mb + ")"),
        Qc = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,
        he = /(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,
        ie = /(.*):dir\((?:(ltr|rtl))\)/,
        ee = ".",
        Pc = ":",
        de = "class",
        je = "should_not_match",
        t = new r();v.get = function (a) {
      return a ? a.__styleInfo : null;
    };v.set = function (a, b) {
      return a.__styleInfo = b;
    };v.prototype.c = function () {
      return this.D;
    };v.prototype._getStyleRules = v.prototype.c;
    var Tc = function (a) {
      return a.matches || a.matchesSelector || a.mozMatchesSelector || a.msMatchesSelector || a.oMatchesSelector || a.webkitMatchesSelector;
    }(window.Element.prototype),
        le = navigator.userAgent.match("Trident");n.prototype.H = function (a) {
      var b = this,
          c = {},
          d = [],
          e = 0;V(a, function (a) {
        b.c(a);a.index = e++;b.G(a.s.cssText, c);
      }, function (a) {
        d.push(a);
      });a.b = d;a = [];for (var f in c) a.push(f);return a;
    };n.prototype.c = function (a) {
      if (!a.s) {
        var b = {},
            c = {};this.b(a, c) && (b.C = c, a.rules = null);b.cssText = this.F(a);a.s = b;
      }
    };n.prototype.b = function (a, b) {
      var c = a.s;if (c) {
        if (c.C) return Object.assign(b, c.C), !0;
      } else {
        c = a.parsedCssText;for (var d; a = ta.exec(c);) {
          d = (a[2] || a[3]).trim();if ("inherit" !== d || "unset" !== d) b[a[1].trim()] = d;d = !0;
        }return d;
      }
    };n.prototype.F = function (a) {
      return this.K(a.parsedCssText);
    };n.prototype.K = function (a) {
      return a.replace(ce, "").replace(ta, "");
    };n.prototype.G = function (a, b) {
      for (var c; c = ae.exec(a);) {
        var d = c[1];":" !== c[2] && (b[d] = !0);
      }
    };n.prototype.$ = function (a) {
      for (var b = Object.getOwnPropertyNames(a), c = 0, d; c < b.length; c++) d = b[c], a[d] = this.a(a[d], a);
    };n.prototype.a = function (a, b) {
      if (a) if (0 <= a.indexOf(";")) a = this.f(a, b);else {
        var c = this;a = Fc(a, function (a, e, f, g) {
          if (!e) return a + g;(e = c.a(b[e], b)) && "initial" !== e ? "apply-shim-inherit" === e && (e = "inherit") : e = c.a(b[f] || f, b) || f;return a + (e || "") + g;
        });
      }return a && a.trim() || "";
    };n.prototype.f = function (a, b) {
      a = a.split(";");for (var c = 0, d, e; c < a.length; c++) if (d = a[c]) {
        ua.lastIndex = 0;if (e = ua.exec(d)) d = this.a(b[e[1]], b);else if (e = d.indexOf(":"), -1 !== e) {
          var f = d.substring(e);f = f.trim();f = this.a(f, b) || f;d = d.substring(0, e) + f;
        }a[c] = d && d.lastIndexOf(";") === d.length - 1 ? d.slice(0, -1) : d || "";
      }return a.join(";");
    };n.prototype.B = function (a, b) {
      var c = "";a.s || this.c(a);a.s.cssText && (c = this.f(a.s.cssText, b));a.cssText = c;
    };n.prototype.w = function (a, b) {
      var c = a.cssText,
          d = a.cssText;null == a.ua && (a.ua = be.test(c));if (a.ua) if (null == a.Y) {
        a.Y = [];for (var e in b) d = b[e], d = d(c), c !== d && (c = d, a.Y.push(e));
      } else {
        for (e = 0; e < a.Y.length; ++e) d = b[a.Y[e]], c = d(c);d = c;
      }a.cssText = d;
    };n.prototype.O = function (a, b) {
      var c = {},
          d = this,
          e = [];V(a, function (a) {
        a.s || d.c(a);var f = a.v || a.parsedSelector;b && a.s.C && f && Tc.call(b, f) && (d.b(a, c), a = a.index, f = parseInt(a / 32, 10), e[f] = (e[f] || 0) | 1 << a % 32);
      }, null, !0);return { C: c, key: e };
    };n.prototype.ba = function (a, b, c, d) {
      b.s || this.c(b);if (b.s.C) {
        var e = Q(a);a = e.is;e = e.V;e = a ? t.f(a, e) : "html";var f = b.parsedSelector,
            g = ":host > *" === f || "html" === f,
            h = 0 === f.indexOf(":host") && !g;"shady" === c && (g = f === e + " > *." + e || -1 !== f.indexOf("html"), h = !g && 0 === f.indexOf(e));"shadow" === c && (g = ":host > *" === f || "html" === f, h = h && !g);if (g || h) c = e, h && (w && !b.v && (b.v = t.m(b, t.g, t.i(a), e)), c = b.v || e), d({ ab: c, Va: h, jb: g });
      }
    };n.prototype.I = function (a, b) {
      var c = {},
          d = {},
          e = this,
          f = b && b.__cssBuild;V(b, function (b) {
        e.ba(a, b, f, function (f) {
          Tc.call(a.ib || a, f.ab) && (f.Va ? e.b(b, c) : e.b(b, d));
        });
      }, null, !0);return { Za: d, Ua: c };
    };n.prototype.aa = function (a, b, c) {
      var d = this,
          e = Q(a),
          f = t.f(e.is, e.V),
          g = new RegExp("(?:^|[^.#[:])" + (a.extends ? "\\" + f.slice(0, -1) + "\\]" : f) + "($|[.:[\\s>+~])");e = v.get(a).D;var h = this.h(e, c);return t.c(a, e, function (a) {
        d.B(a, b);w || Dc(a) || !a.cssText || (d.w(a, h), d.l(a, g, f, c));
      });
    };
    n.prototype.h = function (a, b) {
      a = a.b;var c = {};if (!w && a) for (var d = 0, e = a[d]; d < a.length; e = a[++d]) this.j(e, b), c[e.keyframesName] = this.i(e);return c;
    };n.prototype.i = function (a) {
      return function (b) {
        return b.replace(a.f, a.a);
      };
    };n.prototype.j = function (a, b) {
      a.f = new RegExp(a.keyframesName, "g");a.a = a.keyframesName + "-" + b;a.v = a.v || a.selector;a.selector = a.v.replace(a.keyframesName, a.a);
    };n.prototype.l = function (a, b, c, d) {
      a.v = a.v || a.selector;d = "." + d;for (var e = a.v.split(","), f = 0, g = e.length, h; f < g && (h = e[f]); f++) e[f] = h.match(b) ? h.replace(c, d) : d + " " + h;a.selector = e.join(",");
    };n.prototype.o = function (a, b, c) {
      var d = a.getAttribute("class") || "",
          e = d;c && (e = d.replace(new RegExp("\\s*x-scope\\s*" + c + "\\s*", "g"), " "));e += (e ? " " : "") + "x-scope " + b;d !== e && pa(a, e);
    };n.prototype.u = function (a, b, c, d) {
      b = d ? d.textContent || "" : this.aa(a, b, c);var e = v.get(a),
          f = e.a;f && !w && f !== d && (f._useCount--, 0 >= f._useCount && f.parentNode && f.parentNode.removeChild(f));w ? e.a ? (e.a.textContent = b, d = e.a) : b && (d = bb(b, c, a.shadowRoot, e.b)) : d ? d.parentNode || (le && -1 < b.indexOf("@media") && (d.textContent = b), Ec(d, null, e.b)) : b && (d = bb(b, c, null, e.b));d && (d._useCount = d._useCount || 0, e.a != d && d._useCount++, e.a = d);return d;
    };n.prototype.m = function (a, b) {
      var c = oa(a),
          d = this;a.textContent = U(c, function (a) {
        var c = a.cssText = a.parsedCssText;a.s && a.s.cssText && (c = c.replace(E.sa, "").replace(E.wa, ""), a.cssText = d.f(c, b));
      });
    };I.Object.defineProperties(n.prototype, { g: { configurable: !0, enumerable: !0, get: function () {
          return "x-scope";
        } } });var L = new n(),
        nb = {},
        va = window.customElements;if (va && !w) {
      var me = va.define;va.define = function (a, b, c) {
        var d = document.createComment(" Shady DOM styles for " + a + " "),
            e = document.head;e.insertBefore(d, (P ? P.nextSibling : null) || e.firstChild);P = d;nb[a] = d;return me.call(va, a, b, c);
      };
    }fa.prototype.a = function (a, b, c) {
      for (var d = 0; d < c.length; d++) {
        var e = c[d];if (a.C[e] !== b[e]) return !1;
      }return !0;
    };fa.prototype.b = function (a, b, c, d) {
      var e = this.cache[a] || [];e.push({ C: b, styleElement: c, A: d });e.length > this.c && e.shift();this.cache[a] = e;
    };fa.prototype.fetch = function (a, b, c) {
      if (a = this.cache[a]) for (var d = a.length - 1; 0 <= d; d--) {
        var e = a[d];if (this.a(e, b, c)) return e;
      }
    };if (!w) {
      var Uc = new MutationObserver(Gc),
          Vc = function (a) {
        Uc.observe(a, { childList: !0, subtree: !0 });
      };if (window.customElements && !window.customElements.polyfillWrapFlushCallback) Vc(document);else {
        var ob = function () {
          Vc(document.body);
        };window.HTMLImports ? window.HTMLImports.whenReady(ob) : requestAnimationFrame(function () {
          if ("loading" === document.readyState) {
            var a = function () {
              ob();document.removeEventListener("readystatechange", a);
            };document.addEventListener("readystatechange", a);
          } else ob();
        });
      }M = function () {
        Gc(Uc.takeRecords());
      };
    }var qa = {},
        Pd = Promise.resolve(),
        cb = null,
        Ic = window.HTMLImports && window.HTMLImports.whenReady || null,
        db,
        wa = null,
        ea = null;p.prototype.ta = function () {
      !this.enqueued && ea && (this.enqueued = !0, rb(ea));
    };p.prototype.b = function (a) {
      a.__seenByShadyCSS || (a.__seenByShadyCSS = !0, this.customStyles.push(a), this.ta());
    };p.prototype.a = function (a) {
      return a.__shadyCSSCachedStyle ? a.__shadyCSSCachedStyle : a.getStyle ? a.getStyle() : a;
    };p.prototype.c = function () {
      for (var a = this.customStyles, b = 0; b < a.length; b++) {
        var c = a[b];if (!c.__shadyCSSCachedStyle) {
          var d = this.a(c);d && (d = d.__appliedElement || d, wa && wa(d), c.__shadyCSSCachedStyle = d);
        }
      }return a;
    };p.prototype.addCustomStyle = p.prototype.b;p.prototype.getStyleForCustomStyle = p.prototype.a;p.prototype.processStyles = p.prototype.c;Object.defineProperties(p.prototype, { transformCallback: { get: function () {
          return wa;
        }, set: function (a) {
          wa = a;
        } }, validateCallback: { get: function () {
          return ea;
        }, set: function (a) {
          var b = !1;ea || (b = !0);ea = a;b && this.ta();
        } } });var Wc = new fa();
    g.prototype.w = function () {
      M();
    };g.prototype.I = function (a) {
      var b = this.m[a] = (this.m[a] || 0) + 1;return a + "-" + b;
    };g.prototype.Ca = function (a) {
      return oa(a);
    };g.prototype.Ea = function (a) {
      return U(a);
    };g.prototype.H = function (a) {
      a = a.content.querySelectorAll("style");for (var b = [], c = 0; c < a.length; c++) {
        var d = a[c];b.push(d.textContent);d.parentNode.removeChild(d);
      }return b.join("").trim();
    };g.prototype.$ = function (a) {
      return (a = a.content.querySelector("style")) ? a.getAttribute("css-build") || "" : "";
    };g.prototype.prepareTemplate = function (a, b, c) {
      if (!a.f) {
        a.f = !0;a.name = b;a.extends = c;qa[b] = a;var d = this.$(a),
            e = this.H(a);c = { is: b, extends: c, fb: d };w || t.b(a.content, b);this.c();var f = ua.test(e) || ta.test(e);ua.lastIndex = 0;ta.lastIndex = 0;e = ab(e);f && z && this.a && this.a.transformRules(e, b);a._styleAst = e;a.g = d;d = [];z || (d = L.H(a._styleAst));if (!d.length || z) b = this.O(c, a._styleAst, w ? a.content : null, nb[b]), a.a = b;a.c = d;
      }
    };g.prototype.O = function (a, b, c, d) {
      b = t.c(a, b);if (b.length) return bb(b, a.is, c, d);
    };g.prototype.ba = function (a) {
      var b = Q(a),
          c = b.is;b = b.V;var d = nb[c];c = qa[c];if (c) {
        var e = c._styleAst;var f = c.c;
      }return v.set(a, new v(e, d, f, 0, b));
    };g.prototype.F = function () {
      !this.a && window.ShadyCSS && window.ShadyCSS.ApplyShim && (this.a = window.ShadyCSS.ApplyShim, this.a.invalidCallback = Nd);
    };g.prototype.G = function () {
      var a = this;!this.b && window.ShadyCSS && window.ShadyCSS.CustomStyleInterface && (this.b = window.ShadyCSS.CustomStyleInterface, this.b.transformCallback = function (b) {
        a.u(b);
      }, this.b.validateCallback = function () {
        requestAnimationFrame(function () {
          (a.b.enqueued || a.i) && a.f();
        });
      });
    };g.prototype.c = function () {
      this.F();this.G();
    };g.prototype.f = function () {
      this.c();if (this.b) {
        var a = this.b.processStyles();this.b.enqueued && (z ? this.Aa(a) : (this.o(this.g, this.h), this.B(a)), this.b.enqueued = !1, this.i && !z && this.styleDocument());
      }
    };g.prototype.styleElement = function (a, b) {
      var c = Q(a).is,
          d = v.get(a);d || (d = this.ba(a));this.j(a) || (this.i = !0);b && (d.N = d.N || {}, Object.assign(d.N, b));if (z) {
        if (d.N) {
          b = d.N;for (var e in b) null === e ? a.style.removeProperty(e) : a.style.setProperty(e, b[e]);
        }if (((e = qa[c]) || this.j(a)) && e && e.a && !Hc(e)) {
          if (Hc(e) || e._applyShimValidatingVersion !== e._applyShimNextVersion) this.c(), this.a && this.a.transformRules(e._styleAst, c), e.a.textContent = t.c(a, d.D), Od(e);w && (c = a.shadowRoot) && (c.querySelector("style").textContent = t.c(a, d.D));d.D = e._styleAst;
        }
      } else this.o(a, d), d.ja && d.ja.length && this.K(a, d);
    };g.prototype.l = function (a) {
      return (a = a.getRootNode().host) ? v.get(a) ? a : this.l(a) : this.g;
    };g.prototype.j = function (a) {
      return a === this.g;
    };g.prototype.K = function (a, b) {
      var c = Q(a).is,
          d = Wc.fetch(c, b.J, b.ja),
          e = d ? d.styleElement : null,
          f = b.A;b.A = d && d.A || this.I(c);e = L.u(a, b.J, b.A, e);w || L.o(a, b.A, f);d || Wc.b(c, b.J, e, b.A);
    };g.prototype.o = function (a, b) {
      var c = this.l(a),
          d = v.get(c);c = Object.create(d.J || null);var e = L.I(a, b.D);a = L.O(d.D, a).C;Object.assign(c, e.Ua, a, e.Za);this.aa(c, b.N);L.$(c);b.J = c;
    };g.prototype.aa = function (a, b) {
      for (var c in b) {
        var d = b[c];if (d || 0 === d) a[c] = d;
      }
    };g.prototype.styleDocument = function (a) {
      this.styleSubtree(this.g, a);
    };g.prototype.styleSubtree = function (a, b) {
      var c = a.shadowRoot;
      (c || this.j(a)) && this.styleElement(a, b);if (b = c && (c.children || c.childNodes)) for (a = 0; a < b.length; a++) this.styleSubtree(b[a]);else if (a = a.children || a.childNodes) for (b = 0; b < a.length; b++) this.styleSubtree(a[b]);
    };g.prototype.Aa = function (a) {
      for (var b = 0; b < a.length; b++) {
        var c = this.b.getStyleForCustomStyle(a[b]);c && this.za(c);
      }
    };g.prototype.B = function (a) {
      for (var b = 0; b < a.length; b++) {
        var c = this.b.getStyleForCustomStyle(a[b]);c && L.m(c, this.h.J);
      }
    };g.prototype.u = function (a) {
      var b = this,
          c = oa(a);V(c, function (a) {
        w ? t.w(a) : t.H(a);z && (b.c(), b.a && b.a.transformRule(a));
      });z ? a.textContent = U(c) : this.h.D.rules.push(c);
    };g.prototype.za = function (a) {
      if (z && this.a) {
        var b = oa(a);this.c();this.a.transformRules(b);a.textContent = U(b);
      }
    };g.prototype.getComputedStyleValue = function (a, b) {
      var c;z || (c = (v.get(a) || v.get(this.l(a))).J[b]);return (c = c || window.getComputedStyle(a).getPropertyValue(b)) ? c.trim() : "";
    };g.prototype.Da = function (a, b) {
      var c = a.getRootNode();b = b ? b.split(/\s/) : [];c = c.host && c.host.localName;if (!c) {
        var d = a.getAttribute("class");
        if (d) {
          d = d.split(/\s/);for (var e = 0; e < d.length; e++) if (d[e] === t.a) {
            c = d[e + 1];break;
          }
        }
      }c && b.push(t.a, c);z || (c = v.get(a)) && c.A && b.push(L.g, c.A);pa(a, b.join(" "));
    };g.prototype.Ba = function (a) {
      return v.get(a);
    };g.prototype.flush = g.prototype.w;g.prototype.prepareTemplate = g.prototype.prepareTemplate;g.prototype.styleElement = g.prototype.styleElement;g.prototype.styleDocument = g.prototype.styleDocument;g.prototype.styleSubtree = g.prototype.styleSubtree;g.prototype.getComputedStyleValue = g.prototype.getComputedStyleValue;
    g.prototype.setElementClass = g.prototype.Da;g.prototype._styleInfoForNode = g.prototype.Ba;g.prototype.transformCustomStyleForDocument = g.prototype.u;g.prototype.getStyleAst = g.prototype.Ca;g.prototype.styleAstToString = g.prototype.Ea;g.prototype.flushCustomStyles = g.prototype.f;Object.defineProperties(g.prototype, { nativeShadow: { get: function () {
          return w;
        } }, nativeCss: { get: function () {
          return z;
        } } });var G = new g();if (window.ShadyCSS) {
      var Xc = window.ShadyCSS.ApplyShim;var Yc = window.ShadyCSS.CustomStyleInterface;
    }window.ShadyCSS = { ScopingShim: G, prepareTemplate: function (a, b, c) {
        G.f();G.prepareTemplate(a, b, c);
      }, styleSubtree: function (a, b) {
        G.f();G.styleSubtree(a, b);
      }, styleElement: function (a) {
        G.f();G.styleElement(a);
      }, styleDocument: function (a) {
        G.f();G.styleDocument(a);
      }, getComputedStyleValue: function (a, b) {
        return G.getComputedStyleValue(a, b);
      }, nativeCss: z, nativeShadow: w };Xc && (window.ShadyCSS.ApplyShim = Xc);Yc && (window.ShadyCSS.CustomStyleInterface = Yc);var eb = window.document;window.WebComponents = window.WebComponents || {};"loading" !== eb.readyState ? Jc() : eb.addEventListener("readystatechange", Kc);
  })();
}).call(this);

//# sourceMappingURL=webcomponents-sd-ce.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/easy-css-transform-builder/lib/create-css-transform-builder.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invariant = __webpack_require__("../../node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

var _properties = __webpack_require__("../../node_modules/easy-css-transform-builder/lib/properties.js");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var defaultUnits = {
  length: "px",
  angle: "deg"
};

var isArray = function isArray(value) {
  return Array.isArray(value);
};

var hasProp = function hasProp(o, p) {
  return o.hasOwnProperty(p);
};

var isValidProp = function isValidProp(value) {
  return typeof value === "number" || typeof value === "string" || isArray(value);
};

var createUnit = function createUnit(units, unit) {
  return unit === _properties.UnitTypes.NONE ? "" : units[unit];
};

var createValue = function createValue(value, unit) {
  return typeof value === "number" ? "" + value + unit : value;
};

var normalizeValue = function normalizeValue(prop, value, units) {
  if (hasProp(prop, "units")) {
    if (typeof value === "string") {
      return value;
    }

    (0, _invariant2.default)(isArray(value), "Should be " + prop.name + " is a array");
    (0, _invariant2.default)(value.length === prop.units.length, "Should be " + prop.name + " is " + prop.units.length + " values.");

    return prop.units.map(function (unit, i) {
      return createValue(value[i], createUnit(units, unit));
    }).join(", ");
  }

  return createValue(value, createUnit(units, prop.unit));
};

var createCSSTransformBuilder = function createCSSTransformBuilder() {
  var units = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultUnits;

  return function (styles) {
    return _properties.transformProperties.map(function (prop) {
      return !hasProp(styles, prop.name) || !isValidProp(styles[prop.name]) ? null : prop.name + "(" + normalizeValue(prop, styles[prop.name], units) + ")";
    }).filter(function (value) {
      return value != null;
    }).join(" ");
  };
};

exports.default = createCSSTransformBuilder;

/***/ }),

/***/ "../../node_modules/easy-css-transform-builder/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.properties = exports.createCSSTransformBuilder = undefined;

var _createCssTransformBuilder = __webpack_require__("../../node_modules/easy-css-transform-builder/lib/create-css-transform-builder.js");

var _createCssTransformBuilder2 = _interopRequireDefault(_createCssTransformBuilder);

var _properties2 = __webpack_require__("../../node_modules/easy-css-transform-builder/lib/properties.js");

var _properties3 = _interopRequireDefault(_properties2);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.createCSSTransformBuilder = _createCssTransformBuilder2.default;
exports.properties = _properties3.default;

/***/ }),

/***/ "../../node_modules/easy-css-transform-builder/lib/properties.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var UnitTypes = exports.UnitTypes = {
  NONE: "none",
  LENGTH: "length",
  ANGLE: "angle"
};

var transformProperties = exports.transformProperties = [{ name: "translateX", unit: UnitTypes.LENGTH }, { name: "translateY", unit: UnitTypes.LENGTH }, { name: "translateZ", unit: UnitTypes.LENGTH }, { name: "translate", units: [UnitTypes.LENGTH, UnitTypes.LENGTH] }, { name: "translate3d", units: [UnitTypes.LENGTH, UnitTypes.LENGTH, UnitTypes.LENGTH] }, { name: "scale", unit: UnitTypes.NONE }, { name: "scale3d", units: [UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE] }, { name: "scaleX", unit: UnitTypes.NONE }, { name: "scaleY", unit: UnitTypes.NONE }, { name: "scaleZ", unit: UnitTypes.NONE }, { name: "rotate", unit: UnitTypes.ANGLE }, { name: "rotate3d", units: [UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.ANGLE] }, { name: "rotateX", unit: UnitTypes.ANGLE }, { name: "rotateY", unit: UnitTypes.ANGLE }, { name: "rotateZ", unit: UnitTypes.ANGLE }, { name: "skewX", unit: UnitTypes.ANGLE }, { name: "skewY", unit: UnitTypes.ANGLE }, { name: "perspective", unit: UnitTypes.LENGTH }, {
  name: "matrix",
  units: [UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE]
}, {
  name: "matrix3d",
  units: [UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE, UnitTypes.NONE]
}];

var properties = transformProperties.map(function (prop) {
  return prop.name;
});

exports.default = properties;

/***/ }),

/***/ "../../node_modules/idom-util/src/anchor.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");


/* unused harmony default export */ var _unused_webpack_default_export = ((href, key, staticProperties, ...args) => {
  return Object(__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */])('a', key, staticProperties, 'href', href, ...args);
});

/***/ }),

/***/ "../../node_modules/idom-util/src/button.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");


/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */].bind(null, 'button'));

/***/ }),

/***/ "../../node_modules/idom-util/src/div.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");


/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */].bind(null, 'div'));

/***/ }),

/***/ "../../node_modules/idom-util/src/element.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_incremental_dom__ = __webpack_require__("../../node_modules/incremental-dom/dist/incremental-dom-cjs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_incremental_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_incremental_dom__);


/* harmony default export */ __webpack_exports__["a"] = ((tagName, ...args) => {

  let renderContent;
  if (args.length > 0 && typeof args[args.length - 1] === 'function') renderContent = args.pop();

  Object(__WEBPACK_IMPORTED_MODULE_0_incremental_dom__["elementOpen"])(tagName, ...args);
  renderContent && renderContent();
  return Object(__WEBPACK_IMPORTED_MODULE_0_incremental_dom__["elementClose"])(tagName);
});

/***/ }),

/***/ "../../node_modules/idom-util/src/footer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");


/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */].bind(null, 'header'));

/***/ }),

/***/ "../../node_modules/idom-util/src/header.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");


/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */].bind(null, 'header'));

/***/ }),

/***/ "../../node_modules/idom-util/src/heading.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");

const internal = {};

internal.levels = [1, 2, 3, 4, 5, 6];

internal.renderHeading = (level = 1, ...args) => {

  level = parseInt(level);

  if (!internal.levels.includes(level)) throw new Error('invalid heading level');

  return Object(__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */])('h' + level, ...args);
};

/* unused harmony default export */ var _unused_webpack_default_export = (internal.renderHeading);

/***/ }),

/***/ "../../node_modules/idom-util/src/image.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_incremental_dom__ = __webpack_require__("../../node_modules/incremental-dom/dist/incremental-dom-cjs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_incremental_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_incremental_dom__);


/* unused harmony default export */ var _unused_webpack_default_export = ((src, ...args) => {

  const key = args.shift();
  const staticProperties = args.shift();

  return Object(__WEBPACK_IMPORTED_MODULE_0_incremental_dom__["elementVoid"])('img', key, staticProperties, 'src', src, ...args);
});

/***/ }),

/***/ "../../node_modules/idom-util/src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "renderElement", function() { return __WEBPACK_IMPORTED_MODULE_0__element__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__div__ = __webpack_require__("../../node_modules/idom-util/src/div.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "renderDiv", function() { return __WEBPACK_IMPORTED_MODULE_1__div__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__span__ = __webpack_require__("../../node_modules/idom-util/src/span.js");
/* unused harmony reexport renderSpan */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__button__ = __webpack_require__("../../node_modules/idom-util/src/button.js");
/* unused harmony reexport renderButton */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__image__ = __webpack_require__("../../node_modules/idom-util/src/image.js");
/* unused harmony reexport renderImage */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__li__ = __webpack_require__("../../node_modules/idom-util/src/li.js");
/* unused harmony reexport renderLi */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ul__ = __webpack_require__("../../node_modules/idom-util/src/ul.js");
/* unused harmony reexport renderUl */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__nav__ = __webpack_require__("../../node_modules/idom-util/src/nav.js");
/* unused harmony reexport renderNav */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__section__ = __webpack_require__("../../node_modules/idom-util/src/section.js");
/* unused harmony reexport renderSection */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__style__ = __webpack_require__("../../node_modules/idom-util/src/style.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "renderStyle", function() { return __WEBPACK_IMPORTED_MODULE_9__style__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__strong__ = __webpack_require__("../../node_modules/idom-util/src/strong.js");
/* unused harmony reexport renderStrong */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__label__ = __webpack_require__("../../node_modules/idom-util/src/label.js");
/* unused harmony reexport renderLabel */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__input__ = __webpack_require__("../../node_modules/idom-util/src/input.js");
/* unused harmony reexport renderInput */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pre__ = __webpack_require__("../../node_modules/idom-util/src/pre.js");
/* unused harmony reexport renderPre */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__heading__ = __webpack_require__("../../node_modules/idom-util/src/heading.js");
/* unused harmony reexport renderHeading */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__header__ = __webpack_require__("../../node_modules/idom-util/src/header.js");
/* unused harmony reexport renderHeader */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__footer__ = __webpack_require__("../../node_modules/idom-util/src/footer.js");
/* unused harmony reexport renderFooter */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__anchor__ = __webpack_require__("../../node_modules/idom-util/src/anchor.js");
/* unused harmony reexport renderAnchor */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_incremental_dom__ = __webpack_require__("../../node_modules/incremental-dom/dist/incremental-dom-cjs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_incremental_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18_incremental_dom__);
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_18_incremental_dom__, "currentElement")) __webpack_require__.d(__webpack_exports__, "currentElement", function() { return __WEBPACK_IMPORTED_MODULE_18_incremental_dom__["currentElement"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_18_incremental_dom__, "currentPointer")) __webpack_require__.d(__webpack_exports__, "currentPointer", function() { return __WEBPACK_IMPORTED_MODULE_18_incremental_dom__["currentPointer"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_18_incremental_dom__, "patch")) __webpack_require__.d(__webpack_exports__, "patch", function() { return __WEBPACK_IMPORTED_MODULE_18_incremental_dom__["patch"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_18_incremental_dom__, "skip")) __webpack_require__.d(__webpack_exports__, "skip", function() { return __WEBPACK_IMPORTED_MODULE_18_incremental_dom__["skip"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_18_incremental_dom__, "skipNode")) __webpack_require__.d(__webpack_exports__, "skipNode", function() { return __WEBPACK_IMPORTED_MODULE_18_incremental_dom__["skipNode"]; });






































const transformObjectToArray = object => Object.keys(object).reduce((before, key) => before.concat([key, object[key]]), []);
/* unused harmony export transformObjectToArray */


/***/ }),

/***/ "../../node_modules/idom-util/src/input.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");


/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */].bind(null, 'input'));

/***/ }),

/***/ "../../node_modules/idom-util/src/label.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");


/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */].bind(null, 'label'));

/***/ }),

/***/ "../../node_modules/idom-util/src/li.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");


/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */].bind(null, 'li'));

/***/ }),

/***/ "../../node_modules/idom-util/src/nav.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");


/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */].bind(null, 'nav'));

/***/ }),

/***/ "../../node_modules/idom-util/src/pre.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");


/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */].bind(null, 'pre'));

/***/ }),

/***/ "../../node_modules/idom-util/src/section.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");


/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */].bind(null, 'section'));

/***/ }),

/***/ "../../node_modules/idom-util/src/span.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");


/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */].bind(null, 'span'));

/***/ }),

/***/ "../../node_modules/idom-util/src/strong.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");


/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */].bind(null, 'strong'));

/***/ }),

/***/ "../../node_modules/idom-util/src/style.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_incremental_dom__ = __webpack_require__("../../node_modules/incremental-dom/dist/incremental-dom-cjs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_incremental_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_incremental_dom__);



/* harmony default export */ __webpack_exports__["a"] = ((style, ...args) => Object(__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */])('style', ...args, __WEBPACK_IMPORTED_MODULE_1_incremental_dom__["text"].bind(null, style || '')));

/***/ }),

/***/ "../../node_modules/idom-util/src/ul.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__("../../node_modules/idom-util/src/element.js");


/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */].bind(null, 'ul'));

/***/ }),

/***/ "../../node_modules/incremental-dom/dist/incremental-dom-cjs.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
/**
 * @license
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A cached reference to the hasOwnProperty function.
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * A constructor function that will create blank objects.
 * @constructor
 */
function Blank() {}

Blank.prototype = Object.create(null);

/**
 * Used to prevent property collisions between our "map" and its prototype.
 * @param {!Object<string, *>} map The map to check.
 * @param {string} property The property to check.
 * @return {boolean} Whether map has property.
 */
var has = function (map, property) {
  return hasOwnProperty.call(map, property);
};

/**
 * Creates an map object without a prototype.
 * @return {!Object}
 */
var createMap = function () {
  return new Blank();
};

/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 * @param {!string} nodeName
 * @param {?string=} key
 * @constructor
 */
function NodeData(nodeName, key) {
  /**
   * The attributes and their values.
   * @const {!Object<string, *>}
   */
  this.attrs = createMap();

  /**
   * An array of attribute name/value pairs, used for quickly diffing the
   * incomming attributes to see if the DOM node's attributes need to be
   * updated.
   * @const {Array<*>}
   */
  this.attrsArr = [];

  /**
   * The incoming attributes for this Node, before they are updated.
   * @const {!Object<string, *>}
   */
  this.newAttrs = createMap();

  /**
   * Whether or not the statics have been applied for the node yet.
   * {boolean}
   */
  this.staticsApplied = false;

  /**
   * The key used to identify this node, used to preserve DOM nodes when they
   * move within their parent.
   * @const
   */
  this.key = key;

  /**
   * Keeps track of children within this node by their key.
   * {!Object<string, !Element>}
   */
  this.keyMap = createMap();

  /**
   * Whether or not the keyMap is currently valid.
   * @type {boolean}
   */
  this.keyMapValid = true;

  /**
   * Whether or the associated node is, or contains, a focused Element.
   * @type {boolean}
   */
  this.focused = false;

  /**
   * The node name for this node.
   * @const {string}
   */
  this.nodeName = nodeName;

  /**
   * @type {?string}
   */
  this.text = null;
}

/**
 * Initializes a NodeData object for a Node.
 *
 * @param {Node} node The node to initialize data for.
 * @param {string} nodeName The node name of node.
 * @param {?string=} key The key that identifies the node.
 * @return {!NodeData} The newly initialized data object
 */
var initData = function (node, nodeName, key) {
  var data = new NodeData(nodeName, key);
  node['__incrementalDOMData'] = data;
  return data;
};

/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 *
 * @param {?Node} node The Node to retrieve the data for.
 * @return {!NodeData} The NodeData for this Node.
 */
var getData = function (node) {
  importNode(node);
  return node['__incrementalDOMData'];
};

/**
 * Imports node and its subtree, initializing caches.
 *
 * @param {?Node} node The Node to import.
 */
var importNode = function (node) {
  if (node['__incrementalDOMData']) {
    return;
  }

  var isElement = node instanceof Element;
  var nodeName = isElement ? node.localName : node.nodeName;
  var key = isElement ? node.getAttribute('key') : null;
  var data = initData(node, nodeName, key);

  if (key) {
    getData(node.parentNode).keyMap[key] = node;
  }

  if (isElement) {
    var attributes = node.attributes;
    var attrs = data.attrs;
    var newAttrs = data.newAttrs;
    var attrsArr = data.attrsArr;

    for (var i = 0; i < attributes.length; i += 1) {
      var attr = attributes[i];
      var name = attr.name;
      var value = attr.value;

      attrs[name] = value;
      newAttrs[name] = undefined;
      attrsArr.push(name);
      attrsArr.push(value);
    }
  }

  for (var child = node.firstChild; child; child = child.nextSibling) {
    importNode(child);
  }
};

/**
 * Gets the namespace to create an element (of a given tag) in.
 * @param {string} tag The tag to get the namespace for.
 * @param {?Node} parent
 * @return {?string} The namespace to create the tag in.
 */
var getNamespaceForTag = function (tag, parent) {
  if (tag === 'svg') {
    return 'http://www.w3.org/2000/svg';
  }

  if (getData(parent).nodeName === 'foreignObject') {
    return null;
  }

  return parent.namespaceURI;
};

/**
 * Creates an Element.
 * @param {Document} doc The document with which to create the Element.
 * @param {?Node} parent
 * @param {string} tag The tag for the Element.
 * @param {?string=} key A key to identify the Element.
 * @return {!Element}
 */
var createElement = function (doc, parent, tag, key) {
  var namespace = getNamespaceForTag(tag, parent);
  var el = undefined;

  if (namespace) {
    el = doc.createElementNS(namespace, tag);
  } else {
    el = doc.createElement(tag);
  }

  initData(el, tag, key);

  return el;
};

/**
 * Creates a Text Node.
 * @param {Document} doc The document with which to create the Element.
 * @return {!Text}
 */
var createText = function (doc) {
  var node = doc.createTextNode('');
  initData(node, '#text', null);
  return node;
};

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @const */
var notifications = {
  /**
   * Called after patch has compleated with any Nodes that have been created
   * and added to the DOM.
   * @type {?function(Array<!Node>)}
   */
  nodesCreated: null,

  /**
   * Called after patch has compleated with any Nodes that have been removed
   * from the DOM.
   * Note it's an applications responsibility to handle any childNodes.
   * @type {?function(Array<!Node>)}
   */
  nodesDeleted: null
};

/**
 * Keeps track of the state of a patch.
 * @constructor
 */
function Context() {
  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.created = notifications.nodesCreated && [];

  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.deleted = notifications.nodesDeleted && [];
}

/**
 * @param {!Node} node
 */
Context.prototype.markCreated = function (node) {
  if (this.created) {
    this.created.push(node);
  }
};

/**
 * @param {!Node} node
 */
Context.prototype.markDeleted = function (node) {
  if (this.deleted) {
    this.deleted.push(node);
  }
};

/**
 * Notifies about nodes that were created during the patch opearation.
 */
Context.prototype.notifyChanges = function () {
  if (this.created && this.created.length > 0) {
    notifications.nodesCreated(this.created);
  }

  if (this.deleted && this.deleted.length > 0) {
    notifications.nodesDeleted(this.deleted);
  }
};

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
  * Keeps track whether or not we are in an attributes declaration (after
  * elementOpenStart, but before elementOpenEnd).
  * @type {boolean}
  */
var inAttributes = false;

/**
  * Keeps track whether or not we are in an element that should not have its
  * children cleared.
  * @type {boolean}
  */
var inSkip = false;

/**
 * Makes sure that there is a current patch context.
 * @param {string} functionName
 * @param {*} context
 */
var assertInPatch = function (functionName, context) {
  if (!context) {
    throw new Error('Cannot call ' + functionName + '() unless in patch.');
  }
};

/**
 * Makes sure that a patch closes every node that it opened.
 * @param {?Node} openElement
 * @param {!Node|!DocumentFragment} root
 */
var assertNoUnclosedTags = function (openElement, root) {
  if (openElement === root) {
    return;
  }

  var currentElement = openElement;
  var openTags = [];
  while (currentElement && currentElement !== root) {
    openTags.push(currentElement.nodeName.toLowerCase());
    currentElement = currentElement.parentNode;
  }

  throw new Error('One or more tags were not closed:\n' + openTags.join('\n'));
};

/**
 * Makes sure that the caller is not where attributes are expected.
 * @param {string} functionName
 */
var assertNotInAttributes = function (functionName) {
  if (inAttributes) {
    throw new Error(functionName + '() can not be called between ' + 'elementOpenStart() and elementOpenEnd().');
  }
};

/**
 * Makes sure that the caller is not inside an element that has declared skip.
 * @param {string} functionName
 */
var assertNotInSkip = function (functionName) {
  if (inSkip) {
    throw new Error(functionName + '() may not be called inside an element ' + 'that has called skip().');
  }
};

/**
 * Makes sure that the caller is where attributes are expected.
 * @param {string} functionName
 */
var assertInAttributes = function (functionName) {
  if (!inAttributes) {
    throw new Error(functionName + '() can only be called after calling ' + 'elementOpenStart().');
  }
};

/**
 * Makes sure the patch closes virtual attributes call
 */
var assertVirtualAttributesClosed = function () {
  if (inAttributes) {
    throw new Error('elementOpenEnd() must be called after calling ' + 'elementOpenStart().');
  }
};

/**
  * Makes sure that tags are correctly nested.
  * @param {string} nodeName
  * @param {string} tag
  */
var assertCloseMatchesOpenTag = function (nodeName, tag) {
  if (nodeName !== tag) {
    throw new Error('Received a call to close "' + tag + '" but "' + nodeName + '" was open.');
  }
};

/**
 * Makes sure that no children elements have been declared yet in the current
 * element.
 * @param {string} functionName
 * @param {?Node} previousNode
 */
var assertNoChildrenDeclaredYet = function (functionName, previousNode) {
  if (previousNode !== null) {
    throw new Error(functionName + '() must come before any child ' + 'declarations inside the current element.');
  }
};

/**
 * Checks that a call to patchOuter actually patched the element.
 * @param {?Node} startNode The value for the currentNode when the patch
 *     started.
 * @param {?Node} currentNode The currentNode when the patch finished.
 * @param {?Node} expectedNextNode The Node that is expected to follow the
 *    currentNode after the patch;
 * @param {?Node} expectedPrevNode The Node that is expected to preceed the
 *    currentNode after the patch.
 */
var assertPatchElementNoExtras = function (startNode, currentNode, expectedNextNode, expectedPrevNode) {
  var wasUpdated = currentNode.nextSibling === expectedNextNode && currentNode.previousSibling === expectedPrevNode;
  var wasChanged = currentNode.nextSibling === startNode.nextSibling && currentNode.previousSibling === expectedPrevNode;
  var wasRemoved = currentNode === startNode;

  if (!wasUpdated && !wasChanged && !wasRemoved) {
    throw new Error('There must be exactly one top level call corresponding ' + 'to the patched element.');
  }
};

/**
 * Updates the state of being in an attribute declaration.
 * @param {boolean} value
 * @return {boolean} the previous value.
 */
var setInAttributes = function (value) {
  var previous = inAttributes;
  inAttributes = value;
  return previous;
};

/**
 * Updates the state of being in a skip element.
 * @param {boolean} value
 * @return {boolean} the previous value.
 */
var setInSkip = function (value) {
  var previous = inSkip;
  inSkip = value;
  return previous;
};

/**
 * Copyright 2016 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @param {!Node} node
 * @return {boolean} True if the node the root of a document, false otherwise.
 */
var isDocumentRoot = function (node) {
  // For ShadowRoots, check if they are a DocumentFragment instead of if they
  // are a ShadowRoot so that this can work in 'use strict' if ShadowRoots are
  // not supported.
  return node instanceof Document || node instanceof DocumentFragment;
};

/**
 * @param {!Node} node The node to start at, inclusive.
 * @param {?Node} root The root ancestor to get until, exclusive.
 * @return {!Array<!Node>} The ancestry of DOM nodes.
 */
var getAncestry = function (node, root) {
  var ancestry = [];
  var cur = node;

  while (cur !== root) {
    ancestry.push(cur);
    cur = cur.parentNode;
  }

  return ancestry;
};

/**
 * @param {!Node} node
 * @return {!Node} The root node of the DOM tree that contains node.
 */
var getRoot = function (node) {
  var cur = node;
  var prev = cur;

  while (cur) {
    prev = cur;
    cur = cur.parentNode;
  }

  return prev;
};

/**
 * @param {!Node} node The node to get the activeElement for.
 * @return {?Element} The activeElement in the Document or ShadowRoot
 *     corresponding to node, if present.
 */
var getActiveElement = function (node) {
  var root = getRoot(node);
  return isDocumentRoot(root) ? root.activeElement : null;
};

/**
 * Gets the path of nodes that contain the focused node in the same document as
 * a reference node, up until the root.
 * @param {!Node} node The reference node to get the activeElement for.
 * @param {?Node} root The root to get the focused path until.
 * @return {!Array<Node>}
 */
var getFocusedPath = function (node, root) {
  var activeElement = getActiveElement(node);

  if (!activeElement || !node.contains(activeElement)) {
    return [];
  }

  return getAncestry(activeElement, root);
};

/**
 * Like insertBefore, but instead instead of moving the desired node, instead
 * moves all the other nodes after.
 * @param {?Node} parentNode
 * @param {!Node} node
 * @param {?Node} referenceNode
 */
var moveBefore = function (parentNode, node, referenceNode) {
  var insertReferenceNode = node.nextSibling;
  var cur = referenceNode;

  while (cur !== node) {
    var next = cur.nextSibling;
    parentNode.insertBefore(cur, insertReferenceNode);
    cur = next;
  }
};

/** @type {?Context} */
var context = null;

/** @type {?Node} */
var currentNode = null;

/** @type {?Node} */
var currentParent = null;

/** @type {?Document} */
var doc = null;

/**
 * @param {!Array<Node>} focusPath The nodes to mark.
 * @param {boolean} focused Whether or not they are focused.
 */
var markFocused = function (focusPath, focused) {
  for (var i = 0; i < focusPath.length; i += 1) {
    getData(focusPath[i]).focused = focused;
  }
};

/**
 * Returns a patcher function that sets up and restores a patch context,
 * running the run function with the provided data.
 * @param {function((!Element|!DocumentFragment),!function(T),T=): ?Node} run
 * @return {function((!Element|!DocumentFragment),!function(T),T=): ?Node}
 * @template T
 */
var patchFactory = function (run) {
  /**
   * TODO(moz): These annotations won't be necessary once we switch to Closure
   * Compiler's new type inference. Remove these once the switch is done.
   *
   * @param {(!Element|!DocumentFragment)} node
   * @param {!function(T)} fn
   * @param {T=} data
   * @return {?Node} node
   * @template T
   */
  var f = function (node, fn, data) {
    var prevContext = context;
    var prevDoc = doc;
    var prevCurrentNode = currentNode;
    var prevCurrentParent = currentParent;
    var previousInAttributes = false;
    var previousInSkip = false;

    context = new Context();
    doc = node.ownerDocument;
    currentParent = node.parentNode;

    if (process.env.NODE_ENV !== 'production') {
      previousInAttributes = setInAttributes(false);
      previousInSkip = setInSkip(false);
    }

    var focusPath = getFocusedPath(node, currentParent);
    markFocused(focusPath, true);
    var retVal = run(node, fn, data);
    markFocused(focusPath, false);

    if (process.env.NODE_ENV !== 'production') {
      assertVirtualAttributesClosed();
      setInAttributes(previousInAttributes);
      setInSkip(previousInSkip);
    }

    context.notifyChanges();

    context = prevContext;
    doc = prevDoc;
    currentNode = prevCurrentNode;
    currentParent = prevCurrentParent;

    return retVal;
  };
  return f;
};

/**
 * Patches the document starting at node with the provided function. This
 * function may be called during an existing patch operation.
 * @param {!Element|!DocumentFragment} node The Element or Document
 *     to patch.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @return {!Node} The patched node.
 * @template T
 */
var patchInner = patchFactory(function (node, fn, data) {
  currentNode = node;

  enterNode();
  fn(data);
  exitNode();

  if (process.env.NODE_ENV !== 'production') {
    assertNoUnclosedTags(currentNode, node);
  }

  return node;
});

/**
 * Patches an Element with the the provided function. Exactly one top level
 * element call should be made corresponding to `node`.
 * @param {!Element} node The Element where the patch should start.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM. This should have at most one top level
 *     element call.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @return {?Node} The node if it was updated, its replacedment or null if it
 *     was removed.
 * @template T
 */
var patchOuter = patchFactory(function (node, fn, data) {
  var startNode = /** @type {!Element} */{ nextSibling: node };
  var expectedNextNode = null;
  var expectedPrevNode = null;

  if (process.env.NODE_ENV !== 'production') {
    expectedNextNode = node.nextSibling;
    expectedPrevNode = node.previousSibling;
  }

  currentNode = startNode;
  fn(data);

  if (process.env.NODE_ENV !== 'production') {
    assertPatchElementNoExtras(startNode, currentNode, expectedNextNode, expectedPrevNode);
  }

  if (node !== currentNode && node.parentNode) {
    removeChild(currentParent, node, getData(currentParent).keyMap);
  }

  return startNode === currentNode ? null : currentNode;
});

/**
 * Checks whether or not the current node matches the specified nodeName and
 * key.
 *
 * @param {!Node} matchNode A node to match the data to.
 * @param {?string} nodeName The nodeName for this node.
 * @param {?string=} key An optional key that identifies a node.
 * @return {boolean} True if the node matches, false otherwise.
 */
var matches = function (matchNode, nodeName, key) {
  var data = getData(matchNode);

  // Key check is done using double equals as we want to treat a null key the
  // same as undefined. This should be okay as the only values allowed are
  // strings, null and undefined so the == semantics are not too weird.
  return nodeName === data.nodeName && key == data.key;
};

/**
 * Aligns the virtual Element definition with the actual DOM, moving the
 * corresponding DOM node to the correct location or creating it if necessary.
 * @param {string} nodeName For an Element, this should be a valid tag string.
 *     For a Text, this should be #text.
 * @param {?string=} key The key used to identify this element.
 */
var alignWithDOM = function (nodeName, key) {
  if (currentNode && matches(currentNode, nodeName, key)) {
    return;
  }

  var parentData = getData(currentParent);
  var currentNodeData = currentNode && getData(currentNode);
  var keyMap = parentData.keyMap;
  var node = undefined;

  // Check to see if the node has moved within the parent.
  if (key) {
    var keyNode = keyMap[key];
    if (keyNode) {
      if (matches(keyNode, nodeName, key)) {
        node = keyNode;
      } else if (keyNode === currentNode) {
        context.markDeleted(keyNode);
      } else {
        removeChild(currentParent, keyNode, keyMap);
      }
    }
  }

  // Create the node if it doesn't exist.
  if (!node) {
    if (nodeName === '#text') {
      node = createText(doc);
    } else {
      node = createElement(doc, currentParent, nodeName, key);
    }

    if (key) {
      keyMap[key] = node;
    }

    context.markCreated(node);
  }

  // Re-order the node into the right position, preserving focus if either
  // node or currentNode are focused by making sure that they are not detached
  // from the DOM.
  if (getData(node).focused) {
    // Move everything else before the node.
    moveBefore(currentParent, node, currentNode);
  } else if (currentNodeData && currentNodeData.key && !currentNodeData.focused) {
    // Remove the currentNode, which can always be added back since we hold a
    // reference through the keyMap. This prevents a large number of moves when
    // a keyed item is removed or moved backwards in the DOM.
    currentParent.replaceChild(node, currentNode);
    parentData.keyMapValid = false;
  } else {
    currentParent.insertBefore(node, currentNode);
  }

  currentNode = node;
};

/**
 * @param {?Node} node
 * @param {?Node} child
 * @param {?Object<string, !Element>} keyMap
 */
var removeChild = function (node, child, keyMap) {
  node.removeChild(child);
  context.markDeleted( /** @type {!Node}*/child);

  var key = getData(child).key;
  if (key) {
    delete keyMap[key];
  }
};

/**
 * Clears out any unvisited Nodes, as the corresponding virtual element
 * functions were never called for them.
 */
var clearUnvisitedDOM = function () {
  var node = currentParent;
  var data = getData(node);
  var keyMap = data.keyMap;
  var keyMapValid = data.keyMapValid;
  var child = node.lastChild;
  var key = undefined;

  if (child === currentNode && keyMapValid) {
    return;
  }

  while (child !== currentNode) {
    removeChild(node, child, keyMap);
    child = node.lastChild;
  }

  // Clean the keyMap, removing any unusued keys.
  if (!keyMapValid) {
    for (key in keyMap) {
      child = keyMap[key];
      if (child.parentNode !== node) {
        context.markDeleted(child);
        delete keyMap[key];
      }
    }

    data.keyMapValid = true;
  }
};

/**
 * Changes to the first child of the current node.
 */
var enterNode = function () {
  currentParent = currentNode;
  currentNode = null;
};

/**
 * @return {?Node} The next Node to be patched.
 */
var getNextNode = function () {
  if (currentNode) {
    return currentNode.nextSibling;
  } else {
    return currentParent.firstChild;
  }
};

/**
 * Changes to the next sibling of the current node.
 */
var nextNode = function () {
  currentNode = getNextNode();
};

/**
 * Changes to the parent of the current node, removing any unvisited children.
 */
var exitNode = function () {
  clearUnvisitedDOM();

  currentNode = currentParent;
  currentParent = currentParent.parentNode;
};

/**
 * Makes sure that the current node is an Element with a matching tagName and
 * key.
 *
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @return {!Element} The corresponding Element.
 */
var coreElementOpen = function (tag, key) {
  nextNode();
  alignWithDOM(tag, key);
  enterNode();
  return (/** @type {!Element} */currentParent
  );
};

/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 *
 * @return {!Element} The corresponding Element.
 */
var coreElementClose = function () {
  if (process.env.NODE_ENV !== 'production') {
    setInSkip(false);
  }

  exitNode();
  return (/** @type {!Element} */currentNode
  );
};

/**
 * Makes sure the current node is a Text node and creates a Text node if it is
 * not.
 *
 * @return {!Text} The corresponding Text Node.
 */
var coreText = function () {
  nextNode();
  alignWithDOM('#text', null);
  return (/** @type {!Text} */currentNode
  );
};

/**
 * Gets the current Element being patched.
 * @return {!Element}
 */
var currentElement = function () {
  if (process.env.NODE_ENV !== 'production') {
    assertInPatch('currentElement', context);
    assertNotInAttributes('currentElement');
  }
  return (/** @type {!Element} */currentParent
  );
};

/**
 * @return {Node} The Node that will be evaluated for the next instruction.
 */
var currentPointer = function () {
  if (process.env.NODE_ENV !== 'production') {
    assertInPatch('currentPointer', context);
    assertNotInAttributes('currentPointer');
  }
  return getNextNode();
};

/**
 * Skips the children in a subtree, allowing an Element to be closed without
 * clearing out the children.
 */
var skip = function () {
  if (process.env.NODE_ENV !== 'production') {
    assertNoChildrenDeclaredYet('skip', currentNode);
    setInSkip(true);
  }
  currentNode = currentParent.lastChild;
};

/**
 * Skips the next Node to be patched, moving the pointer forward to the next
 * sibling of the current pointer.
 */
var skipNode = nextNode;

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @const */
var symbols = {
  default: '__default'
};

/**
 * @param {string} name
 * @return {string|undefined} The namespace to use for the attribute.
 */
var getNamespace = function (name) {
  if (name.lastIndexOf('xml:', 0) === 0) {
    return 'http://www.w3.org/XML/1998/namespace';
  }

  if (name.lastIndexOf('xlink:', 0) === 0) {
    return 'http://www.w3.org/1999/xlink';
  }
};

/**
 * Applies an attribute or property to a given Element. If the value is null
 * or undefined, it is removed from the Element. Otherwise, the value is set
 * as an attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {?(boolean|number|string)=} value The attribute's value.
 */
var applyAttr = function (el, name, value) {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    var attrNS = getNamespace(name);
    if (attrNS) {
      el.setAttributeNS(attrNS, name, value);
    } else {
      el.setAttribute(name, value);
    }
  }
};

/**
 * Applies a property to a given Element.
 * @param {!Element} el
 * @param {string} name The property's name.
 * @param {*} value The property's value.
 */
var applyProp = function (el, name, value) {
  el[name] = value;
};

/**
 * Applies a value to a style declaration. Supports CSS custom properties by
 * setting properties containing a dash using CSSStyleDeclaration.setProperty.
 * @param {CSSStyleDeclaration} style
 * @param {!string} prop
 * @param {*} value
 */
var setStyleValue = function (style, prop, value) {
  if (prop.indexOf('-') >= 0) {
    style.setProperty(prop, /** @type {string} */value);
  } else {
    style[prop] = value;
  }
};

/**
 * Applies a style to an Element. No vendor prefix expansion is done for
 * property names/values.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} style The style to set. Either a string of css or an object
 *     containing property-value pairs.
 */
var applyStyle = function (el, name, style) {
  if (typeof style === 'string') {
    el.style.cssText = style;
  } else {
    el.style.cssText = '';
    var elStyle = el.style;
    var obj = /** @type {!Object<string,string>} */style;

    for (var prop in obj) {
      if (has(obj, prop)) {
        setStyleValue(elStyle, prop, obj[prop]);
      }
    }
  }
};

/**
 * Updates a single attribute on an Element.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 */
var applyAttributeTyped = function (el, name, value) {
  var type = typeof value;

  if (type === 'object' || type === 'function') {
    applyProp(el, name, value);
  } else {
    applyAttr(el, name, /** @type {?(boolean|number|string)} */value);
  }
};

/**
 * Calls the appropriate attribute mutator for this attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value.
 */
var updateAttribute = function (el, name, value) {
  var data = getData(el);
  var attrs = data.attrs;

  if (attrs[name] === value) {
    return;
  }

  var mutator = attributes[name] || attributes[symbols.default];
  mutator(el, name, value);

  attrs[name] = value;
};

/**
 * A publicly mutable object to provide custom mutators for attributes.
 * @const {!Object<string, function(!Element, string, *)>}
 */
var attributes = createMap();

// Special generic mutator that's called for any attribute that does not
// have a specific mutator.
attributes[symbols.default] = applyAttributeTyped;

attributes['style'] = applyStyle;

/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 * @const
 */
var ATTRIBUTES_OFFSET = 3;

/**
 * Builds an array of arguments for use with elementOpenStart, attr and
 * elementOpenEnd.
 * @const {Array<*>}
 */
var argsBuilder = [];

/**
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args, Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
var elementOpen = function (tag, key, statics, var_args) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('elementOpen');
    assertNotInSkip('elementOpen');
  }

  var node = coreElementOpen(tag, key);
  var data = getData(node);

  if (!data.staticsApplied) {
    if (statics) {
      for (var _i = 0; _i < statics.length; _i += 2) {
        var name = /** @type {string} */statics[_i];
        var value = statics[_i + 1];
        updateAttribute(node, name, value);
      }
    }
    // Down the road, we may want to keep track of the statics array to use it
    // as an additional signal about whether a node matches or not. For now,
    // just use a marker so that we do not reapply statics.
    data.staticsApplied = true;
  }

  /*
   * Checks to see if one or more attributes have changed for a given Element.
   * When no attributes have changed, this is much faster than checking each
   * individual argument. When attributes have changed, the overhead of this is
   * minimal.
   */
  var attrsArr = data.attrsArr;
  var newAttrs = data.newAttrs;
  var isNew = !attrsArr.length;
  var i = ATTRIBUTES_OFFSET;
  var j = 0;

  for (; i < arguments.length; i += 2, j += 2) {
    var _attr = arguments[i];
    if (isNew) {
      attrsArr[j] = _attr;
      newAttrs[_attr] = undefined;
    } else if (attrsArr[j] !== _attr) {
      break;
    }

    var value = arguments[i + 1];
    if (isNew || attrsArr[j + 1] !== value) {
      attrsArr[j + 1] = value;
      updateAttribute(node, _attr, value);
    }
  }

  if (i < arguments.length || j < attrsArr.length) {
    for (; i < arguments.length; i += 1, j += 1) {
      attrsArr[j] = arguments[i];
    }

    if (j < attrsArr.length) {
      attrsArr.length = j;
    }

    /*
     * Actually perform the attribute update.
     */
    for (i = 0; i < attrsArr.length; i += 2) {
      var name = /** @type {string} */attrsArr[i];
      var value = attrsArr[i + 1];
      newAttrs[name] = value;
    }

    for (var _attr2 in newAttrs) {
      updateAttribute(node, _attr2, newAttrs[_attr2]);
      newAttrs[_attr2] = undefined;
    }
  }

  return node;
};

/**
 * Declares a virtual Element at the current location in the document. This
 * corresponds to an opening tag and a elementClose tag is required. This is
 * like elementOpen, but the attributes are defined using the attr function
 * rather than being passed as arguments. Must be folllowed by 0 or more calls
 * to attr, then a call to elementOpenEnd.
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 */
var elementOpenStart = function (tag, key, statics) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('elementOpenStart');
    setInAttributes(true);
  }

  argsBuilder[0] = tag;
  argsBuilder[1] = key;
  argsBuilder[2] = statics;
};

/***
 * Defines a virtual attribute at this point of the DOM. This is only valid
 * when called between elementOpenStart and elementOpenEnd.
 *
 * @param {string} name
 * @param {*} value
 */
var attr = function (name, value) {
  if (process.env.NODE_ENV !== 'production') {
    assertInAttributes('attr');
  }

  argsBuilder.push(name);
  argsBuilder.push(value);
};

/**
 * Closes an open tag started with elementOpenStart.
 * @return {!Element} The corresponding Element.
 */
var elementOpenEnd = function () {
  if (process.env.NODE_ENV !== 'production') {
    assertInAttributes('elementOpenEnd');
    setInAttributes(false);
  }

  var node = elementOpen.apply(null, argsBuilder);
  argsBuilder.length = 0;
  return node;
};

/**
 * Closes an open virtual Element.
 *
 * @param {string} tag The element's tag.
 * @return {!Element} The corresponding Element.
 */
var elementClose = function (tag) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('elementClose');
  }

  var node = coreElementClose();

  if (process.env.NODE_ENV !== 'production') {
    assertCloseMatchesOpenTag(getData(node).nodeName, tag);
  }

  return node;
};

/**
 * Declares a virtual Element at the current location in the document that has
 * no children.
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
var elementVoid = function (tag, key, statics, var_args) {
  elementOpen.apply(null, arguments);
  return elementClose(tag);
};

/**
 * Declares a virtual Text at this point in the document.
 *
 * @param {string|number|boolean} value The value of the Text.
 * @param {...(function((string|number|boolean)):string)} var_args
 *     Functions to format the value which are called only when the value has
 *     changed.
 * @return {!Text} The corresponding text node.
 */
var text = function (value, var_args) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('text');
    assertNotInSkip('text');
  }

  var node = coreText();
  var data = getData(node);

  if (data.text !== value) {
    data.text = /** @type {string} */value;

    var formatted = value;
    for (var i = 1; i < arguments.length; i += 1) {
      /*
       * Call the formatter function directly to prevent leaking arguments.
       * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
       */
      var fn = arguments[i];
      formatted = fn(formatted);
    }

    node.data = formatted;
  }

  return node;
};

exports.patch = patchInner;
exports.patchInner = patchInner;
exports.patchOuter = patchOuter;
exports.currentElement = currentElement;
exports.currentPointer = currentPointer;
exports.skip = skip;
exports.skipNode = skipNode;
exports.elementVoid = elementVoid;
exports.elementOpenStart = elementOpenStart;
exports.elementOpenEnd = elementOpenEnd;
exports.elementOpen = elementOpen;
exports.elementClose = elementClose;
exports.text = text;
exports.attr = attr;
exports.symbols = symbols;
exports.attributes = attributes;
exports.applyAttr = applyAttr;
exports.applyProp = applyProp;
exports.notifications = notifications;
exports.importNode = importNode;

//# sourceMappingURL=incremental-dom-cjs.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../../node_modules/invariant/browser.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function (condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../../node_modules/kwak/lib/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_isequal__ = __webpack_require__("../../node_modules/lodash.isequal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_isequal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_isequal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_isplainobject__ = __webpack_require__("../../node_modules/lodash.isplainobject/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_isplainobject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_isplainobject__);





const assert = (condition, message) => {

  if (condition) return condition;

  throw new Error(message);
};
/* unused harmony export assert */


const isDeeplyEqual = __WEBPACK_IMPORTED_MODULE_0_lodash_isequal___default.a;
/* unused harmony export isDeeplyEqual */

const isEqualTo = (value, input) => input === value;
/* unused harmony export isEqualTo */

const isTrue = input => isEqualTo(true, input);
/* unused harmony export isTrue */

const isUndefined = input => isEqualTo(void 0, input);
/* harmony export (immutable) */ __webpack_exports__["h"] = isUndefined;

const isNull = input => isEqualTo(null, input);
/* harmony export (immutable) */ __webpack_exports__["f"] = isNull;

const isInstanceOf = (type, input) => input instanceof type;
/* unused harmony export isInstanceOf */

const isArray = input => isInstanceOf(Array, input);
/* harmony export (immutable) */ __webpack_exports__["a"] = isArray;

const isOfType = (type, input) => isEqualTo(type, typeof input);
/* unused harmony export isOfType */

const isObject = input => isOfType('object', input);
/* harmony export (immutable) */ __webpack_exports__["g"] = isObject;

const isPlainObject = __WEBPACK_IMPORTED_MODULE_1_lodash_isplainobject___default.a;
/* unused harmony export isPlainObject */

const isEmpty = input => input.length < 1;
/* harmony export (immutable) */ __webpack_exports__["c"] = isEmpty;

const isBoolean = input => isOfType('boolean', input);
/* unused harmony export isBoolean */

const isString = input => {

  return isOfType('string', input);
};
/* unused harmony export isString */

const isFunction = input => isOfType('function', input) && input;
/* harmony export (immutable) */ __webpack_exports__["d"] = isFunction;

const isNumber = input => isOfType('number', input);
/* unused harmony export isNumber */

const isInteger = input => Number.isInteger(input);
/* harmony export (immutable) */ __webpack_exports__["e"] = isInteger;

const isComponent = input => isObject(input) && input.isPwetComponent === true;
/* unused harmony export isComponent */

const isHTMLElement = input => isInstanceOf(HTMLElement, input);
/* unused harmony export isHTMLElement */

const isElement = input => isHTMLElement(input) && input.nodeType === 1;
/* harmony export (immutable) */ __webpack_exports__["b"] = isElement;

const isUnknownElement = input => Object.prototype.toString.call(input) === '[object HTMLUnknownElement]';
/* unused harmony export isUnknownElement */


/***/ }),

/***/ "../../node_modules/lodash.debounce/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function () {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

module.exports = debounce;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/lodash.isequal/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = function () {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map || ListCache)(),
    'string': new Hash()
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache();
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (
    // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' ||
    // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') ||
    // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
    // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack());
    return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack());
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function (othValue, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == other + '';

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function (object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function (symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
  getTag = function (value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;

  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function () {
  return arguments;
}()) ? baseIsArguments : function (value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEqual;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js"), __webpack_require__("./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "../../node_modules/lodash.isplainobject/index.js":
/***/ (function(module, exports) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;

/***/ }),

/***/ "../../node_modules/pwet-idom/src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IDOMComponent; });
/* unused harmony export renderComponent */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_idom_util__ = __webpack_require__("../../node_modules/idom-util/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pwet_src_utilities__ = __webpack_require__("./node_modules/pwet/src/utilities.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pwet__ = __webpack_require__("./node_modules/pwet/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_debounce__ = __webpack_require__("../../node_modules/lodash.debounce/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_debounce___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash_debounce__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_incremental_dom__ = __webpack_require__("../../node_modules/incremental-dom/dist/incremental-dom-cjs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_incremental_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_incremental_dom__);






const $update = Symbol('__update');
const $properties = Symbol('__properties');
const defaultAttributeApply = __WEBPACK_IMPORTED_MODULE_4_incremental_dom__["attributes"][__WEBPACK_IMPORTED_MODULE_4_incremental_dom__["symbols"].default];

__WEBPACK_IMPORTED_MODULE_4_incremental_dom__["attributes"][__WEBPACK_IMPORTED_MODULE_4_incremental_dom__["symbols"].default] = (element, name, value) => {

  if (!(__WEBPACK_IMPORTED_MODULE_2_pwet__["a" /* $pwet */] in element)) return void defaultAttributeApply(element, name, value);

  const { definition, update } = element[__WEBPACK_IMPORTED_MODULE_2_pwet__["a" /* $pwet */]];
  const { tagName, verbose, properties } = definition;

  if (!(name in properties)) return void defaultAttributeApply(element, name, value);

  if (verbose) console.log('IDOM applyProperty', name, value);
  //console.error(`[${tagName}]`, 'IDOM', name, value);

  if (!element[$update]) element[$update] = __WEBPACK_IMPORTED_MODULE_3_lodash_debounce___default()(() => {

    update(element[$properties], { partial: true });

    element[$properties] = {};
  }, 0);

  if (!element[$properties]) element[$properties] = {};

  element[$properties][name] = value;

  element[$update]();
};

const IDOMComponent = component => {

  const { hooks } = component;

  hooks.render = Object(__WEBPACK_IMPORTED_MODULE_1_pwet_src_utilities__["b" /* decorate */])(hooks.render, (next, component) => {

    Object(__WEBPACK_IMPORTED_MODULE_0_idom_util__["patch"])(component.root, next, component);
  });

  return component;
};

const renderComponent = (...args) => Object(__WEBPACK_IMPORTED_MODULE_0_idom_util__["renderElement"])(...args, __WEBPACK_IMPORTED_MODULE_0_idom_util__["skip"]);



/***/ }),

/***/ "../../src/components/slides/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__slides__ = __webpack_require__("../../src/components/slides/slides.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pwet_idom__ = __webpack_require__("../../node_modules/pwet-idom/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pwet__ = __webpack_require__("./node_modules/pwet/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_kwak__ = __webpack_require__("../../node_modules/kwak/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_pwet_src_definitions_shadow__ = __webpack_require__("./node_modules/pwet/src/definitions/shadow.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_pwet_src_utilities__ = __webpack_require__("./node_modules/pwet/src/utilities.js");


//import StatefulDefinition from 'pwet/src/decorators/stateful';








/* unused harmony default export */ var _unused_webpack_default_export = (Object(__WEBPACK_IMPORTED_MODULE_2_pwet__["b" /* defineComponent */])([__WEBPACK_IMPORTED_MODULE_0__slides__["a" /* default */], __WEBPACK_IMPORTED_MODULE_1_pwet_idom__["a" /* default */], __WEBPACK_IMPORTED_MODULE_4_pwet_src_definitions_shadow__["a" /* default */]]));

//export default defineComponent(
//  Object.assign(
//    StatefulDefinition(Slides),
//    {
//      style,
//      verbose: true
//    }
//  )
//);

/***/ }),

/***/ "../../src/components/slides/slides.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_pwet__ = __webpack_require__("./node_modules/pwet/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_kwak__ = __webpack_require__("../../node_modules/kwak/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pwet_src_definition__ = __webpack_require__("./node_modules/pwet/src/definition.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utilities__ = __webpack_require__("../../src/utilities.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_idom_util__ = __webpack_require__("../../node_modules/idom-util/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__detection__ = __webpack_require__("../../src/detection.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__slides_styl__ = __webpack_require__("../../src/components/slides/slides.styl");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__slides_styl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__slides_styl__);


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };










const Slides = component => {

  const { element, hooks } = component;

  let _currentSlide;

  const _renderSlide = ({ content, translate, isMoving }) => {

    const attributes = [];

    let classes = 'slide';

    if (isMoving) classes += ' moving';

    attributes.push('class', classes);

    if (!Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["h" /* isUndefined */])(translate)) attributes.push('style', `transform:${Object(__WEBPACK_IMPORTED_MODULE_3__utilities__["a" /* buildTransform */])({ translate })};`);

    return Object(__WEBPACK_IMPORTED_MODULE_4_idom_util__["renderDiv"])(null, null, ...attributes, () => {

      const parent = Object(__WEBPACK_IMPORTED_MODULE_4_idom_util__["currentElement"])();
      const pointer = Object(__WEBPACK_IMPORTED_MODULE_4_idom_util__["currentPointer"])();
      console.log('parent', parent);
      console.log('pointer', pointer);

      //? parent.appendChild(content)
      //: parent.replaceChild(content, pointer);

      if (Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["f" /* isNull */])(pointer)) parent.appendChild(content);else {
        if (pointer !== content) parent.replaceChild(content, pointer);
      }

      Object(__WEBPACK_IMPORTED_MODULE_4_idom_util__["skipNode"])();
    });
  };

  const _handleTransitionEnd = ({ propertyName, target }) => {

    if (propertyName !== 'transform' || !target.classList.contains('moving')) return;

    const { updaters: { setCurrentSlide } } = component;
    const nextIndex = element.nextSlide.index;

    setCurrentSlide(nextIndex);

    const currentValue = parseInt(element.getAttribute('current'), 10);

    if (isNaN(currentValue) || currentValue !== nextIndex) element.setAttribute('current', nextIndex);
  };

  //hooks.update = (component, properties, oldProperties) => {
  //
  //  return !component.isRendered || !isDeeplyEqual(properties, oldProperties);
  //};

  hooks.attach = component => {

    element.slides = Array.from(element.children);

    _currentSlide.addEventListener(__WEBPACK_IMPORTED_MODULE_5__detection__["a" /* TRANSITIONEND */], _handleTransitionEnd);
  };

  hooks.detach = component => {

    _currentSlide.removeEventListener(__WEBPACK_IMPORTED_MODULE_5__detection__["a" /* TRANSITIONEND */], _handleTransitionEnd);
  };

  hooks.render = component => {

    const { slides, currentSlide, nextSlide, isMoving } = component.element;

    console.error('RENDER', { slides, currentSlide, nextSlide, isMoving });

    if (isMoving) Object(__WEBPACK_IMPORTED_MODULE_3__utilities__["b" /* forceReflow */])(element);

    //patch(component.root, () => {
    Object(__WEBPACK_IMPORTED_MODULE_4_idom_util__["renderStyle"])(component.definition.style);

    Object(__WEBPACK_IMPORTED_MODULE_4_idom_util__["renderDiv"])('slides', ['class', 'slides'], () => {

      if (Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["c" /* isEmpty */])(slides)) return;

      currentSlide.content = slides[currentSlide.index];
      currentSlide.isMoving = isMoving;

      _currentSlide = _renderSlide(currentSlide);

      if (!Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["h" /* isUndefined */])(nextSlide)) {

        nextSlide.content = slides[nextSlide.index];
        nextSlide.isMoving = isMoving;

        _renderSlide(nextSlide);
      }
    });
    //});

  };

  return component;
};

Slides.tagName = 'x-slides';

Slides.style = __WEBPACK_IMPORTED_MODULE_6__slides_styl___default.a;

Slides.attributes = {
  current: ({ element }, value, oldValue) => {

    if (oldValue === value) return;

    //element.setAttribute('current', )
    //value = newValue;

    element.current = parseInt(value);
  }
};

Slides.properties = {
  current: (component, value = 0) => {

    console.log('Slides.properties.current()');

    return {
      get: () => value,
      set(newValue) {

        //console.log('set current()', newValue);

        newValue = parseInt(newValue, 10);

        if (isNaN(newValue) || value === newValue) return;

        const { element, updaters: { setNextSlide, goToNextSlide } } = component;

        if (element.isMoving || newValue >= element.slides.length || newValue < 0) return;

        setTimeout(() => {
          setNextSlide(newValue);
          goToNextSlide();
        }, 0);

        value = newValue;
      }
    };
  },
  slides: ({ element, log }, value = []) => ({
    get: () => value,
    set(newValue) {

      if (Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["a" /* isArray */])(newValue) && newValue.every(__WEBPACK_IMPORTED_MODULE_1_kwak__["b" /* isElement */])) value = newValue;
    }
  }),
  isMoving: ({ element, log }, value = false) => ({
    get: () => value,
    set(newValue) {

      value = !!newValue;
    }
  }),
  currentSlide: ({ element, log }, value = {}) => ({
    get: () => value,
    set(newValue) {

      //console.log('set currentSlide()', newValue);

      if (!Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["g" /* isObject */])(newValue)) return;

      const { index = 0, translate = [0, 0] } = newValue;

      if (!Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["e" /* isInteger */])(index)) return;

      if (!Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["a" /* isArray */])(translate) || translate.length !== 2) return;

      value = {
        index,
        translate
      };
    }
  }),
  nextSlide: ({ element, log }, value) => ({
    get: () => value,
    set(newValue) {

      //console.log('set nextSlide()', newValue);

      if (!Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["g" /* isObject */])(newValue)) return;

      const { index, translate } = newValue;

      if (!Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["e" /* isInteger */])(index)) return;

      if (!Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["a" /* isArray */])(translate) || translate.length !== 2) return;

      value = {
        index,
        translate
      };
    }
  })
};

Slides.verbose = true;

Slides.updaters = {
  setCurrentSlide: (component, currentIndex) => {

    console.log('Slides.updaters.setCurrentSlide()');

    component.update({
      isMoving: false,
      currentSlide: {
        index: currentIndex,
        translate: [0, 0]
      },
      nextSlide: void 0
    }, { partial: true });
  },
  setNextSlide: (component, nextIndex) => {

    console.log('Slides.updaters.setNextSlide()');

    const { element } = component;

    const reverse = element.currentSlide.index > nextIndex;

    component.update({
      nextSlide: {
        index: nextIndex,
        translate: [reverse ? '-100%' : '100%', 0]
      }
    }, { partial: true });
  },
  goToNextSlide: component => {

    console.log('Slides.updaters.goToNextSlide()');

    const { currentSlide, nextSlide } = component.element;

    const reverse = currentSlide.index > nextSlide.index;

    component.update({
      isMoving: true,
      currentSlide: _extends({}, currentSlide, {
        translate: [reverse ? '100%' : '-100%', 0]
      }),
      nextSlide: _extends({}, nextSlide, {
        translate: [0, 0]
      })
    }, { partial: true });
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Slides);

/***/ }),

/***/ "../../src/components/slides/slides.styl":
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/stylus-loader/index.js!../../src/components/slides/slides.styl");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),

/***/ "../../src/detection.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TRANSITIONEND; });
let el = document.createElement('div'); //what the hack is bootstrap
let TRANSITIONEND; // event name

const _eventsTypes = {
  transition: {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd otransitionend',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  }
};

for (let key in _eventsTypes.transition) {

  if (el.style[key] !== undefined) {
    TRANSITIONEND = _eventsTypes.transition[key];
    break;
  }
}



/***/ }),

/***/ "../../src/utilities.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_easy_css_transform_builder__ = __webpack_require__("../../node_modules/easy-css-transform-builder/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_easy_css_transform_builder___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_easy_css_transform_builder__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__detection__ = __webpack_require__("../../src/detection.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_kwak__ = __webpack_require__("../../node_modules/kwak/lib/index.js");






const buildTransform = Object(__WEBPACK_IMPORTED_MODULE_0_easy_css_transform_builder__["createCSSTransformBuilder"])({
  length: "px",
  angle: "deg"
});
/* harmony export (immutable) */ __webpack_exports__["a"] = buildTransform;


const forceReflow = element => void element.offsetHeight;
/* harmony export (immutable) */ __webpack_exports__["b"] = forceReflow;


const transformElement = (element, transform, done) => {

  if (Object(__WEBPACK_IMPORTED_MODULE_2_kwak__["d" /* isFunction */])(done)) {

    const _whenTransformEnd = event => {

      if (event.target !== element || event.propertyName !== 'transform') return;
      console.log('transformElement._whenTransformEnd()', event);

      element.removeEventListener(__WEBPACK_IMPORTED_MODULE_1__detection__["a" /* TRANSITIONEND */], _whenTransformEnd);

      done(event);
    };

    element.addEventListener(__WEBPACK_IMPORTED_MODULE_1__detection__["a" /* TRANSITIONEND */], _whenTransformEnd);
  }

  element.style.transform = element.style.webkitTransform = element.style.MozTransform = element.style.msTransform = element.style.OTransform = element.style.transform = transform;
};
/* unused harmony export transformElement */


/***/ }),

/***/ "./index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webcomponents_webcomponentsjs_webcomponents_sd_ce__ = __webpack_require__("../../node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webcomponents_webcomponentsjs_webcomponents_sd_ce___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__webcomponents_webcomponentsjs_webcomponents_sd_ce__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_components_slides__ = __webpack_require__("../../src/components/slides/index.js");






const createButton = text => {
  const button = document.createElement('button');
  button.innerText = text;
  return button;
};

document.addEventListener('DOMContentLoaded', () => {

  const slides = document.querySelector('x-slides');
  const leftButton = document.body.appendChild(createButton('left'));
  const rightButton = document.body.appendChild(createButton('right'));

  rightButton.onclick = () => {
    slides.current++;
  };

  leftButton.onclick = () => {
    slides.current--;
  };
});

/***/ }),

/***/ "./node_modules/@webcomponents/shadycss/src/common-regex.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const VAR_ASSIGN = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi;
/* unused harmony export VAR_ASSIGN */

const MIXIN_MATCH = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi;
/* unused harmony export MIXIN_MATCH */

const VAR_CONSUMED = /(--[\w-]+)\s*([:,;)]|$)/gi;
/* unused harmony export VAR_CONSUMED */

const ANIMATION_MATCH = /(animation\s*:)|(animation-name\s*:)/;
/* unused harmony export ANIMATION_MATCH */

const MEDIA_MATCH = /@media\s(.*)/;
/* harmony export (immutable) */ __webpack_exports__["a"] = MEDIA_MATCH;

const IS_VAR = /^--/;
/* unused harmony export IS_VAR */

const BRACKETED = /\{[^}]*\}/g;
/* unused harmony export BRACKETED */

const HOST_PREFIX = '(?:^|[^.#[:])';
/* unused harmony export HOST_PREFIX */

const HOST_SUFFIX = '($|[.:[\\s>+~])';
/* unused harmony export HOST_SUFFIX */


/***/ }),

/***/ "./node_modules/@webcomponents/shadycss/src/css-parse.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export StyleNode */
/* harmony export (immutable) */ __webpack_exports__["a"] = parse;
/* harmony export (immutable) */ __webpack_exports__["b"] = stringify;
/* unused harmony export removeCustomPropAssignment */
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/*
Extremely simple css parser. Intended to be not more than what we need
and definitely not necessarily correct =).
*/



/** @unrestricted */

class StyleNode {
  constructor() {
    /** @type {number} */
    this['start'] = 0;
    /** @type {number} */
    this['end'] = 0;
    /** @type {StyleNode} */
    this['previous'] = null;
    /** @type {StyleNode} */
    this['parent'] = null;
    /** @type {Array<StyleNode>} */
    this['rules'] = null;
    /** @type {string} */
    this['parsedCssText'] = '';
    /** @type {string} */
    this['cssText'] = '';
    /** @type {boolean} */
    this['atRule'] = false;
    /** @type {number} */
    this['type'] = 0;
    /** @type {string} */
    this['keyframesName'] = '';
    /** @type {string} */
    this['selector'] = '';
    /** @type {string} */
    this['parsedSelector'] = '';
  }
}



// given a string of css, return a simple rule tree
/**
 * @param {string} text
 * @return {StyleNode}
 */
function parse(text) {
  text = clean(text);
  return parseCss(lex(text), text);
}

// remove stuff we don't care about that may hinder parsing
/**
 * @param {string} cssText
 * @return {string}
 */
function clean(cssText) {
  return cssText.replace(RX.comments, '').replace(RX.port, '');
}

// super simple {...} lexer that returns a node tree
/**
 * @param {string} text
 * @return {StyleNode}
 */
function lex(text) {
  let root = new StyleNode();
  root['start'] = 0;
  root['end'] = text.length;
  let n = root;
  for (let i = 0, l = text.length; i < l; i++) {
    if (text[i] === OPEN_BRACE) {
      if (!n['rules']) {
        n['rules'] = [];
      }
      let p = n;
      let previous = p['rules'][p['rules'].length - 1] || null;
      n = new StyleNode();
      n['start'] = i + 1;
      n['parent'] = p;
      n['previous'] = previous;
      p['rules'].push(n);
    } else if (text[i] === CLOSE_BRACE) {
      n['end'] = i + 1;
      n = n['parent'] || root;
    }
  }
  return root;
}

// add selectors/cssText to node tree
/**
 * @param {StyleNode} node
 * @param {string} text
 * @return {StyleNode}
 */
function parseCss(node, text) {
  let t = text.substring(node['start'], node['end'] - 1);
  node['parsedCssText'] = node['cssText'] = t.trim();
  if (node['parent']) {
    let ss = node['previous'] ? node['previous']['end'] : node['parent']['start'];
    t = text.substring(ss, node['start'] - 1);
    t = _expandUnicodeEscapes(t);
    t = t.replace(RX.multipleSpaces, ' ');
    // TODO(sorvell): ad hoc; make selector include only after last ;
    // helps with mixin syntax
    t = t.substring(t.lastIndexOf(';') + 1);
    let s = node['parsedSelector'] = node['selector'] = t.trim();
    node['atRule'] = s.indexOf(AT_START) === 0;
    // note, support a subset of rule types...
    if (node['atRule']) {
      if (s.indexOf(MEDIA_START) === 0) {
        node['type'] = types.MEDIA_RULE;
      } else if (s.match(RX.keyframesRule)) {
        node['type'] = types.KEYFRAMES_RULE;
        node['keyframesName'] = node['selector'].split(RX.multipleSpaces).pop();
      }
    } else {
      if (s.indexOf(VAR_START) === 0) {
        node['type'] = types.MIXIN_RULE;
      } else {
        node['type'] = types.STYLE_RULE;
      }
    }
  }
  let r$ = node['rules'];
  if (r$) {
    for (let i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
      parseCss(r, text);
    }
  }
  return node;
}

/**
 * conversion of sort unicode escapes with spaces like `\33 ` (and longer) into
 * expanded form that doesn't require trailing space `\000033`
 * @param {string} s
 * @return {string}
 */
function _expandUnicodeEscapes(s) {
  return s.replace(/\\([0-9a-f]{1,6})\s/gi, function () {
    let code = arguments[1],
        repeat = 6 - code.length;
    while (repeat--) {
      code = '0' + code;
    }
    return '\\' + code;
  });
}

/**
 * stringify parsed css.
 * @param {StyleNode} node
 * @param {boolean=} preserveProperties
 * @param {string=} text
 * @return {string}
 */
function stringify(node, preserveProperties, text = '') {
  // calc rule cssText
  let cssText = '';
  if (node['cssText'] || node['rules']) {
    let r$ = node['rules'];
    if (r$ && !_hasMixinRules(r$)) {
      for (let i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
        cssText = stringify(r, preserveProperties, cssText);
      }
    } else {
      cssText = preserveProperties ? node['cssText'] : removeCustomProps(node['cssText']);
      cssText = cssText.trim();
      if (cssText) {
        cssText = '  ' + cssText + '\n';
      }
    }
  }
  // emit rule if there is cssText
  if (cssText) {
    if (node['selector']) {
      text += node['selector'] + ' ' + OPEN_BRACE + '\n';
    }
    text += cssText;
    if (node['selector']) {
      text += CLOSE_BRACE + '\n\n';
    }
  }
  return text;
}

/**
 * @param {Array<StyleNode>} rules
 * @return {boolean}
 */
function _hasMixinRules(rules) {
  let r = rules[0];
  return Boolean(r) && Boolean(r['selector']) && r['selector'].indexOf(VAR_START) === 0;
}

/**
 * @param {string} cssText
 * @return {string}
 */
function removeCustomProps(cssText) {
  cssText = removeCustomPropAssignment(cssText);
  return removeCustomPropApply(cssText);
}

/**
 * @param {string} cssText
 * @return {string}
 */
function removeCustomPropAssignment(cssText) {
  return cssText.replace(RX.customProp, '').replace(RX.mixinProp, '');
}

/**
 * @param {string} cssText
 * @return {string}
 */
function removeCustomPropApply(cssText) {
  return cssText.replace(RX.mixinApply, '').replace(RX.varApply, '');
}

/** @enum {number} */
const types = {
  STYLE_RULE: 1,
  KEYFRAMES_RULE: 7,
  MEDIA_RULE: 4,
  MIXIN_RULE: 1000
};
/* harmony export (immutable) */ __webpack_exports__["c"] = types;


const OPEN_BRACE = '{';
const CLOSE_BRACE = '}';

// helper regexp's
const RX = {
  comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
  port: /@import[^;]*;/gim,
  customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
  mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
  mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
  varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
  keyframesRule: /^@[^\s]*keyframes/,
  multipleSpaces: /\s+/g
};

const VAR_START = '--';
const MEDIA_START = '@media';
const AT_START = '@';

/***/ }),

/***/ "./node_modules/@webcomponents/shadycss/src/style-settings.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return nativeShadow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return nativeCssVariables; });
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



let nativeShadow = !(window['ShadyDOM'] && window['ShadyDOM']['inUse']);
let nativeCssVariables;

/**
 * @param {(ShadyCSSOptions | ShadyCSSInterface)=} settings
 */
function calcCssVariables(settings) {
  if (settings && settings['shimcssproperties']) {
    nativeCssVariables = false;
  } else {
    // chrome 49 has semi-working css vars, check if box-shadow works
    // safari 9.1 has a recalc bug: https://bugs.webkit.org/show_bug.cgi?id=155782
    // However, shim css custom properties are only supported with ShadyDOM enabled,
    // so fall back on native if we do not detect ShadyDOM
    // Edge 15: custom properties used in ::before and ::after will also be used in the parent element
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12414257/
    nativeCssVariables = nativeShadow || Boolean(!navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) && window.CSS && CSS.supports && CSS.supports('box-shadow', '0 0 0 var(--foo)'));
  }
}

if (window.ShadyCSS && window.ShadyCSS.nativeCss !== undefined) {
  nativeCssVariables = window.ShadyCSS.nativeCss;
} else if (window.ShadyCSS) {
  calcCssVariables(window.ShadyCSS);
  // reset window variable to let ShadyCSS API take its place
  window.ShadyCSS = undefined;
} else {
  calcCssVariables(window['WebComponents'] && window['WebComponents']['flags']);
}

/***/ }),

/***/ "./node_modules/@webcomponents/shadycss/src/style-transformer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_parse_js__ = __webpack_require__("./node_modules/@webcomponents/shadycss/src/css-parse.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style_util_js__ = __webpack_require__("./node_modules/@webcomponents/shadycss/src/style-util.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style_settings_js__ = __webpack_require__("./node_modules/@webcomponents/shadycss/src/style-settings.js");
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



 // eslint-disable-line no-unused-vars



/* Transforms ShadowDOM styling into ShadyDOM styling

* scoping:

  * elements in scope get scoping selector class="x-foo-scope"
  * selectors re-written as follows:

    div button -> div.x-foo-scope button.x-foo-scope

* :host -> scopeName

* :host(...) -> scopeName...

* ::slotted(...) -> scopeName > ...

* ...:dir(ltr|rtl) -> [dir="ltr|rtl"] ..., ...[dir="ltr|rtl"]

* :host(:dir[rtl]) -> scopeName:dir(rtl) -> [dir="rtl"] scopeName, scopeName[dir="rtl"]

*/
const SCOPE_NAME = 'style-scope';

class StyleTransformer {
  get SCOPE_NAME() {
    return SCOPE_NAME;
  }
  // Given a node and scope name, add a scoping class to each node
  // in the tree. This facilitates transforming css into scoped rules.
  dom(node, scope, shouldRemoveScope) {
    // one time optimization to skip scoping...
    if (node['__styleScoped']) {
      node['__styleScoped'] = null;
    } else {
      this._transformDom(node, scope || '', shouldRemoveScope);
    }
  }

  _transformDom(node, selector, shouldRemoveScope) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      this.element(node, selector, shouldRemoveScope);
    }
    let c$ = node.localName === 'template' ? (node.content || node._content).childNodes : node.children || node.childNodes;
    if (c$) {
      for (let i = 0; i < c$.length; i++) {
        this._transformDom(c$[i], selector, shouldRemoveScope);
      }
    }
  }

  element(element, scope, shouldRemoveScope) {
    // note: if using classes, we add both the general 'style-scope' class
    // as well as the specific scope. This enables easy filtering of all
    // `style-scope` elements
    if (scope) {
      // note: svg on IE does not have classList so fallback to class
      if (element.classList) {
        if (shouldRemoveScope) {
          element.classList.remove(SCOPE_NAME);
          element.classList.remove(scope);
        } else {
          element.classList.add(SCOPE_NAME);
          element.classList.add(scope);
        }
      } else if (element.getAttribute) {
        let c = element.getAttribute(CLASS);
        if (shouldRemoveScope) {
          if (c) {
            let newValue = c.replace(SCOPE_NAME, '').replace(scope, '');
            __WEBPACK_IMPORTED_MODULE_1__style_util_js__["c" /* setElementClassRaw */](element, newValue);
          }
        } else {
          let newValue = (c ? c + ' ' : '') + SCOPE_NAME + ' ' + scope;
          __WEBPACK_IMPORTED_MODULE_1__style_util_js__["c" /* setElementClassRaw */](element, newValue);
        }
      }
    }
  }

  elementStyles(element, styleRules, callback) {
    let cssBuildType = element['__cssBuild'];
    // no need to shim selectors if settings.useNativeShadow, also
    // a shady css build will already have transformed selectors
    // NOTE: This method may be called as part of static or property shimming.
    // When there is a targeted build it will not be called for static shimming,
    // but when the property shim is used it is called and should opt out of
    // static shimming work when a proper build exists.
    let cssText = '';
    if (__WEBPACK_IMPORTED_MODULE_2__style_settings_js__["b" /* nativeShadow */] || cssBuildType === 'shady') {
      cssText = __WEBPACK_IMPORTED_MODULE_1__style_util_js__["d" /* toCssText */](styleRules, callback);
    } else {
      let { is, typeExtension } = __WEBPACK_IMPORTED_MODULE_1__style_util_js__["a" /* getIsExtends */](element);
      cssText = this.css(styleRules, is, typeExtension, callback) + '\n\n';
    }
    return cssText.trim();
  }

  // Given a string of cssText and a scoping string (scope), returns
  // a string of scoped css where each selector is transformed to include
  // a class created from the scope. ShadowDOM selectors are also transformed
  // (e.g. :host) to use the scoping selector.
  css(rules, scope, ext, callback) {
    let hostScope = this._calcHostScope(scope, ext);
    scope = this._calcElementScope(scope);
    let self = this;
    return __WEBPACK_IMPORTED_MODULE_1__style_util_js__["d" /* toCssText */](rules, function ( /** StyleNode */rule) {
      if (!rule.isScoped) {
        self.rule(rule, scope, hostScope);
        rule.isScoped = true;
      }
      if (callback) {
        callback(rule, scope, hostScope);
      }
    });
  }

  _calcElementScope(scope) {
    if (scope) {
      return CSS_CLASS_PREFIX + scope;
    } else {
      return '';
    }
  }

  _calcHostScope(scope, ext) {
    return ext ? `[is=${scope}]` : scope;
  }

  rule(rule, scope, hostScope) {
    this._transformRule(rule, this._transformComplexSelector, scope, hostScope);
  }

  /**
   * transforms a css rule to a scoped rule.
   *
   * @param {StyleNode} rule
   * @param {Function} transformer
   * @param {string=} scope
   * @param {string=} hostScope
   */
  _transformRule(rule, transformer, scope, hostScope) {
    // NOTE: save transformedSelector for subsequent matching of elements
    // against selectors (e.g. when calculating style properties)
    rule['selector'] = rule.transformedSelector = this._transformRuleCss(rule, transformer, scope, hostScope);
  }

  /**
   * @param {StyleNode} rule
   * @param {Function} transformer
   * @param {string=} scope
   * @param {string=} hostScope
   */
  _transformRuleCss(rule, transformer, scope, hostScope) {
    let p$ = rule['selector'].split(COMPLEX_SELECTOR_SEP);
    // we want to skip transformation of rules that appear in keyframes,
    // because they are keyframe selectors, not element selectors.
    if (!__WEBPACK_IMPORTED_MODULE_1__style_util_js__["b" /* isKeyframesSelector */](rule)) {
      for (let i = 0, l = p$.length, p; i < l && (p = p$[i]); i++) {
        p$[i] = transformer.call(this, p, scope, hostScope);
      }
    }
    return p$.join(COMPLEX_SELECTOR_SEP);
  }

  /**
   * @param {string} selector
   * @return {string}
   */
  _twiddleNthPlus(selector) {
    return selector.replace(NTH, (m, type, inside) => {
      if (inside.indexOf('+') > -1) {
        inside = inside.replace(/\+/g, '___');
      } else if (inside.indexOf('___') > -1) {
        inside = inside.replace(/___/g, '+');
      }
      return `:${type}(${inside})`;
    });
  }

  /**
   * @param {string} selector
   * @param {string} scope
   * @param {string=} hostScope
   */
  _transformComplexSelector(selector, scope, hostScope) {
    let stop = false;
    selector = selector.trim();
    // Remove spaces inside of selectors like `:nth-of-type` because it confuses SIMPLE_SELECTOR_SEP
    let isNth = NTH.test(selector);
    if (isNth) {
      selector = selector.replace(NTH, (m, type, inner) => `:${type}(${inner.replace(/\s/g, '')})`);
      selector = this._twiddleNthPlus(selector);
    }
    selector = selector.replace(SLOTTED_START, `${HOST} $1`);
    selector = selector.replace(SIMPLE_SELECTOR_SEP, (m, c, s) => {
      if (!stop) {
        let info = this._transformCompoundSelector(s, c, scope, hostScope);
        stop = stop || info.stop;
        c = info.combinator;
        s = info.value;
      }
      return c + s;
    });
    if (isNth) {
      selector = this._twiddleNthPlus(selector);
    }
    return selector;
  }

  _transformCompoundSelector(selector, combinator, scope, hostScope) {
    // replace :host with host scoping class
    let slottedIndex = selector.indexOf(SLOTTED);
    if (selector.indexOf(HOST) >= 0) {
      selector = this._transformHostSelector(selector, hostScope);
      // replace other selectors with scoping class
    } else if (slottedIndex !== 0) {
      selector = scope ? this._transformSimpleSelector(selector, scope) : selector;
    }
    // mark ::slotted() scope jump to replace with descendant selector + arg
    // also ignore left-side combinator
    let slotted = false;
    if (slottedIndex >= 0) {
      combinator = '';
      slotted = true;
    }
    // process scope jumping selectors up to the scope jump and then stop
    let stop;
    if (slotted) {
      stop = true;
      if (slotted) {
        // .zonk ::slotted(.foo) -> .zonk.scope > .foo
        selector = selector.replace(SLOTTED_PAREN, (m, paren) => ` > ${paren}`);
      }
    }
    selector = selector.replace(DIR_PAREN, (m, before, dir) => `[dir="${dir}"] ${before}, ${before}[dir="${dir}"]`);
    return { value: selector, combinator, stop };
  }

  _transformSimpleSelector(selector, scope) {
    let p$ = selector.split(PSEUDO_PREFIX);
    p$[0] += scope;
    return p$.join(PSEUDO_PREFIX);
  }

  // :host(...) -> scopeName...
  _transformHostSelector(selector, hostScope) {
    let m = selector.match(HOST_PAREN);
    let paren = m && m[2].trim() || '';
    if (paren) {
      if (!paren[0].match(SIMPLE_SELECTOR_PREFIX)) {
        // paren starts with a type selector
        let typeSelector = paren.split(SIMPLE_SELECTOR_PREFIX)[0];
        // if the type selector is our hostScope then avoid pre-pending it
        if (typeSelector === hostScope) {
          return paren;
          // otherwise, this selector should not match in this scope so
          // output a bogus selector.
        } else {
          return SELECTOR_NO_MATCH;
        }
      } else {
        // make sure to do a replace here to catch selectors like:
        // `:host(.foo)::before`
        return selector.replace(HOST_PAREN, function (m, host, paren) {
          return hostScope + paren;
        });
      }
      // if no paren, do a straight :host replacement.
      // TODO(sorvell): this should not strictly be necessary but
      // it's needed to maintain support for `:host[foo]` type selectors
      // which have been improperly used under Shady DOM. This should be
      // deprecated.
    } else {
      return selector.replace(HOST, hostScope);
    }
  }

  /**
   * @param {StyleNode} rule
   */
  documentRule(rule) {
    // reset selector in case this is redone.
    rule['selector'] = rule['parsedSelector'];
    this.normalizeRootSelector(rule);
    this._transformRule(rule, this._transformDocumentSelector);
  }

  /**
   * @param {StyleNode} rule
   */
  normalizeRootSelector(rule) {
    if (rule['selector'] === ROOT) {
      rule['selector'] = 'html';
    }
  }

  /**
   * @param {string} selector
   */
  _transformDocumentSelector(selector) {
    return selector.match(SLOTTED) ? this._transformComplexSelector(selector, SCOPE_DOC_SELECTOR) : this._transformSimpleSelector(selector.trim(), SCOPE_DOC_SELECTOR);
  }
}

let NTH = /:(nth[-\w]+)\(([^)]+)\)/;
let SCOPE_DOC_SELECTOR = `:not(.${SCOPE_NAME})`;
let COMPLEX_SELECTOR_SEP = ',';
let SIMPLE_SELECTOR_SEP = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g;
let SIMPLE_SELECTOR_PREFIX = /[[.:#*]/;
let HOST = ':host';
let ROOT = ':root';
let SLOTTED = '::slotted';
let SLOTTED_START = new RegExp(`^(${SLOTTED})`);
// NOTE: this supports 1 nested () pair for things like
// :host(:not([selected]), more general support requires
// parsing which seems like overkill
let HOST_PAREN = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/;
// similar to HOST_PAREN
let SLOTTED_PAREN = /(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/;
let DIR_PAREN = /(.*):dir\((?:(ltr|rtl))\)/;
let CSS_CLASS_PREFIX = '.';
let PSEUDO_PREFIX = ':';
let CLASS = 'class';
let SELECTOR_NO_MATCH = 'should_not_match';

/* harmony default export */ __webpack_exports__["a"] = (new StyleTransformer());

/***/ }),

/***/ "./node_modules/@webcomponents/shadycss/src/style-util.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = toCssText;
/* unused harmony export rulesForStyle */
/* harmony export (immutable) */ __webpack_exports__["b"] = isKeyframesSelector;
/* unused harmony export forEachRule */
/* unused harmony export applyCss */
/* unused harmony export createScopeStyle */
/* unused harmony export applyStylePlaceHolder */
/* unused harmony export applyStyle */
/* unused harmony export isTargetedBuild */
/* unused harmony export getCssBuildType */
/* unused harmony export processVariableAndFallback */
/* harmony export (immutable) */ __webpack_exports__["c"] = setElementClassRaw;
/* harmony export (immutable) */ __webpack_exports__["a"] = getIsExtends;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_settings_js__ = __webpack_require__("./node_modules/@webcomponents/shadycss/src/style-settings.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_parse_js__ = __webpack_require__("./node_modules/@webcomponents/shadycss/src/css-parse.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_regex_js__ = __webpack_require__("./node_modules/@webcomponents/shadycss/src/common-regex.js");
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/




 // eslint-disable-line no-unused-vars


/**
 * @param {string|StyleNode} rules
 * @param {function(StyleNode)=} callback
 * @return {string}
 */
function toCssText(rules, callback) {
  if (!rules) {
    return '';
  }
  if (typeof rules === 'string') {
    rules = Object(__WEBPACK_IMPORTED_MODULE_1__css_parse_js__["a" /* parse */])(rules);
  }
  if (callback) {
    forEachRule(rules, callback);
  }
  return Object(__WEBPACK_IMPORTED_MODULE_1__css_parse_js__["b" /* stringify */])(rules, __WEBPACK_IMPORTED_MODULE_0__style_settings_js__["a" /* nativeCssVariables */]);
}

/**
 * @param {HTMLStyleElement} style
 * @return {StyleNode}
 */
function rulesForStyle(style) {
  if (!style['__cssRules'] && style.textContent) {
    style['__cssRules'] = Object(__WEBPACK_IMPORTED_MODULE_1__css_parse_js__["a" /* parse */])(style.textContent);
  }
  return style['__cssRules'] || null;
}

// Tests if a rule is a keyframes selector, which looks almost exactly
// like a normal selector but is not (it has nothing to do with scoping
// for example).
/**
 * @param {StyleNode} rule
 * @return {boolean}
 */
function isKeyframesSelector(rule) {
  return Boolean(rule['parent']) && rule['parent']['type'] === __WEBPACK_IMPORTED_MODULE_1__css_parse_js__["c" /* types */].KEYFRAMES_RULE;
}

/**
 * @param {StyleNode} node
 * @param {Function=} styleRuleCallback
 * @param {Function=} keyframesRuleCallback
 * @param {boolean=} onlyActiveRules
 */
function forEachRule(node, styleRuleCallback, keyframesRuleCallback, onlyActiveRules) {
  if (!node) {
    return;
  }
  let skipRules = false;
  let type = node['type'];
  if (onlyActiveRules) {
    if (type === __WEBPACK_IMPORTED_MODULE_1__css_parse_js__["c" /* types */].MEDIA_RULE) {
      let matchMedia = node['selector'].match(__WEBPACK_IMPORTED_MODULE_2__common_regex_js__["a" /* MEDIA_MATCH */]);
      if (matchMedia) {
        // if rule is a non matching @media rule, skip subrules
        if (!window.matchMedia(matchMedia[1]).matches) {
          skipRules = true;
        }
      }
    }
  }
  if (type === __WEBPACK_IMPORTED_MODULE_1__css_parse_js__["c" /* types */].STYLE_RULE) {
    styleRuleCallback(node);
  } else if (keyframesRuleCallback && type === __WEBPACK_IMPORTED_MODULE_1__css_parse_js__["c" /* types */].KEYFRAMES_RULE) {
    keyframesRuleCallback(node);
  } else if (type === __WEBPACK_IMPORTED_MODULE_1__css_parse_js__["c" /* types */].MIXIN_RULE) {
    skipRules = true;
  }
  let r$ = node['rules'];
  if (r$ && !skipRules) {
    for (let i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
      forEachRule(r, styleRuleCallback, keyframesRuleCallback, onlyActiveRules);
    }
  }
}

// add a string of cssText to the document.
/**
 * @param {string} cssText
 * @param {string} moniker
 * @param {Node} target
 * @param {Node} contextNode
 * @return {HTMLStyleElement}
 */
function applyCss(cssText, moniker, target, contextNode) {
  let style = createScopeStyle(cssText, moniker);
  applyStyle(style, target, contextNode);
  return style;
}

/**
 * @param {string} cssText
 * @param {string} moniker
 * @return {HTMLStyleElement}
 */
function createScopeStyle(cssText, moniker) {
  let style = /** @type {HTMLStyleElement} */document.createElement('style');
  if (moniker) {
    style.setAttribute('scope', moniker);
  }
  style.textContent = cssText;
  return style;
}

/**
 * Track the position of the last added style for placing placeholders
 * @type {Node}
 */
let lastHeadApplyNode = null;

// insert a comment node as a styling position placeholder.
/**
 * @param {string} moniker
 * @return {!Comment}
 */
function applyStylePlaceHolder(moniker) {
  let placeHolder = document.createComment(' Shady DOM styles for ' + moniker + ' ');
  let after = lastHeadApplyNode ? lastHeadApplyNode['nextSibling'] : null;
  let scope = document.head;
  scope.insertBefore(placeHolder, after || scope.firstChild);
  lastHeadApplyNode = placeHolder;
  return placeHolder;
}

/**
 * @param {HTMLStyleElement} style
 * @param {?Node} target
 * @param {?Node} contextNode
 */
function applyStyle(style, target, contextNode) {
  target = target || document.head;
  let after = contextNode && contextNode.nextSibling || target.firstChild;
  target.insertBefore(style, after);
  if (!lastHeadApplyNode) {
    lastHeadApplyNode = style;
  } else {
    // only update lastHeadApplyNode if the new style is inserted after the old lastHeadApplyNode
    let position = style.compareDocumentPosition(lastHeadApplyNode);
    if (position === Node.DOCUMENT_POSITION_PRECEDING) {
      lastHeadApplyNode = style;
    }
  }
}

/**
 * @param {string} buildType
 * @return {boolean}
 */
function isTargetedBuild(buildType) {
  return __WEBPACK_IMPORTED_MODULE_0__style_settings_js__["b" /* nativeShadow */] ? buildType === 'shadow' : buildType === 'shady';
}

/**
 * @param {Element} element
 * @return {?string}
 */
function getCssBuildType(element) {
  return element.getAttribute('css-build');
}

/**
 * Walk from text[start] matching parens and
 * returns position of the outer end paren
 * @param {string} text
 * @param {number} start
 * @return {number}
 */
function findMatchingParen(text, start) {
  let level = 0;
  for (let i = start, l = text.length; i < l; i++) {
    if (text[i] === '(') {
      level++;
    } else if (text[i] === ')') {
      if (--level === 0) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * @param {string} str
 * @param {function(string, string, string, string)} callback
 */
function processVariableAndFallback(str, callback) {
  // find 'var('
  let start = str.indexOf('var(');
  if (start === -1) {
    // no var?, everything is prefix
    return callback(str, '', '', '');
  }
  //${prefix}var(${inner})${suffix}
  let end = findMatchingParen(str, start + 3);
  let inner = str.substring(start + 4, end);
  let prefix = str.substring(0, start);
  // suffix may have other variables
  let suffix = processVariableAndFallback(str.substring(end + 1), callback);
  let comma = inner.indexOf(',');
  // value and fallback args should be trimmed to match in property lookup
  if (comma === -1) {
    // variable, no fallback
    return callback(prefix, inner.trim(), '', suffix);
  }
  // var(${value},${fallback})
  let value = inner.substring(0, comma).trim();
  let fallback = inner.substring(comma + 1).trim();
  return callback(prefix, value, fallback, suffix);
}

/**
 * @param {Element} element
 * @param {string} value
 */
function setElementClassRaw(element, value) {
  // use native setAttribute provided by ShadyDOM when setAttribute is patched
  if (__WEBPACK_IMPORTED_MODULE_0__style_settings_js__["b" /* nativeShadow */]) {
    element.setAttribute('class', value);
  } else {
    window['ShadyDOM']['nativeMethods']['setAttribute'].call(element, 'class', value);
  }
}

/**
 * @param {Element | {is: string, extends: string}} element
 * @return {{is: string, typeExtension: string}}
 */
function getIsExtends(element) {
  let localName = element['localName'];
  let is = '',
      typeExtension = '';
  /*
  NOTE: technically, this can be wrong for certain svg elements
  with `-` in the name like `<font-face>`
  */
  if (localName) {
    if (localName.indexOf('-') > -1) {
      is = localName;
    } else {
      typeExtension = localName;
      is = element.getAttribute && element.getAttribute('is') || '';
    }
  } else {
    is = /** @type {?} */element.is;
    typeExtension = /** @type {?} */element.extends;
  }
  return { is, typeExtension };
}

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/stylus-loader/index.js!../../src/components/slides/slides.styl":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ":host {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  overflow: hidden;\n  display: block;\n}\n.slide {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0;\n  padding: 0;\n  transform: translate(0px, 0px) scale(1, 1);\n}\n.slide.moving {\n  transition: transform 1.2s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.slide > img {\n  object-fit: contain;\n  object-position: center;\n  width: 100%;\n  height: 100%;\n  display: block;\n  margin: 0 auto;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),

/***/ "./node_modules/kwak/lib/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_isequal__ = __webpack_require__("./node_modules/lodash.isequal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_isequal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_isequal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_isplainobject__ = __webpack_require__("./node_modules/lodash.isplainobject/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_isplainobject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_isplainobject__);





const assert = (condition, message) => {

  if (condition) return condition;

  throw new Error(message);
};
/* harmony export (immutable) */ __webpack_exports__["a"] = assert;


const isDeeplyEqual = __WEBPACK_IMPORTED_MODULE_0_lodash_isequal___default.a;
/* harmony export (immutable) */ __webpack_exports__["c"] = isDeeplyEqual;

const isEqualTo = (value, input) => input === value;
/* harmony export (immutable) */ __webpack_exports__["e"] = isEqualTo;

const isTrue = input => isEqualTo(true, input);
/* unused harmony export isTrue */

const isUndefined = input => isEqualTo(void 0, input);
/* harmony export (immutable) */ __webpack_exports__["l"] = isUndefined;

const isNull = input => isEqualTo(null, input);
/* harmony export (immutable) */ __webpack_exports__["h"] = isNull;

const isInstanceOf = (type, input) => input instanceof type;
/* unused harmony export isInstanceOf */

const isArray = input => isInstanceOf(Array, input);
/* harmony export (immutable) */ __webpack_exports__["b"] = isArray;

const isOfType = (type, input) => isEqualTo(type, typeof input);
/* unused harmony export isOfType */

const isObject = input => isOfType('object', input);
/* harmony export (immutable) */ __webpack_exports__["i"] = isObject;

const isPlainObject = __WEBPACK_IMPORTED_MODULE_1_lodash_isplainobject___default.a;
/* harmony export (immutable) */ __webpack_exports__["j"] = isPlainObject;

const isEmpty = input => input.length < 1;
/* harmony export (immutable) */ __webpack_exports__["d"] = isEmpty;

const isBoolean = input => isOfType('boolean', input);
/* unused harmony export isBoolean */

const isString = input => {

  return isOfType('string', input);
};
/* harmony export (immutable) */ __webpack_exports__["k"] = isString;

const isFunction = input => isOfType('function', input) && input;
/* harmony export (immutable) */ __webpack_exports__["f"] = isFunction;

const isNumber = input => isOfType('number', input);
/* unused harmony export isNumber */

const isInteger = input => Number.isInteger(input);
/* unused harmony export isInteger */

const isComponent = input => isObject(input) && input.isPwetComponent === true;
/* unused harmony export isComponent */

const isHTMLElement = input => isInstanceOf(HTMLElement, input);
/* harmony export (immutable) */ __webpack_exports__["g"] = isHTMLElement;

const isElement = input => isHTMLElement(input) && input.nodeType === 1;
/* unused harmony export isElement */

const isUnknownElement = input => Object.prototype.toString.call(input) === '[object HTMLUnknownElement]';
/* unused harmony export isUnknownElement */


/***/ }),

/***/ "./node_modules/lodash.clonedeep/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map || ListCache)(),
    'string': new Hash()
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache();
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || isFunc && !object) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function (subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor());
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor());
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
  getTag = function (value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag:case float64Tag:
    case int8Tag:case int16Tag:case int32Tag:
    case uint8Tag:case uint8ClampedTag:case uint16Tag:case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, true, true);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = cloneDeep;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js"), __webpack_require__("./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/lodash.isequal/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = function () {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map || ListCache)(),
    'string': new Hash()
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache();
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (
    // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' ||
    // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') ||
    // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
    // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack());
    return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack());
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function (othValue, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == other + '';

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function (object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function (symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
  getTag = function (value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;

  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function () {
  return arguments;
}()) ? baseIsArguments : function (value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEqual;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js"), __webpack_require__("./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/lodash.isplainobject/index.js":
/***/ (function(module, exports) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;

/***/ }),

/***/ "./node_modules/lodash.kebabcase/index.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match words composed of alphanumeric characters. */
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

/** Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]",
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
    rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptLowerContr = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptUpperContr = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq;

/** Used to match apostrophes. */
var reApos = RegExp(rsApos, 'g');

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo, 'g');

/** Used to match complex or compound words. */
var reUnicodeWord = RegExp([rsUpper + '?' + rsLower + '+' + rsOptLowerContr + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')', rsUpperMisc + '+' + rsOptUpperContr + '(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')', rsUpper + '?' + rsLowerMisc + '+' + rsOptLowerContr, rsUpper + '+' + rsOptUpperContr, rsDigits, rsEmoji].join('|'), 'g');

/** Used to detect strings that need a more robust regexp to match words. */
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

/** Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A', '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a', '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C', '\xe7': 'c',
  '\xd0': 'D', '\xf0': 'd',
  '\xc8': 'E', '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e', '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I', '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i', '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N', '\xf1': 'n',
  '\xd2': 'O', '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o', '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U', '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u', '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y', '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A', '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a', '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C', '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
  '\u0107': 'c', '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
  '\u010e': 'D', '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
  '\u0112': 'E', '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
  '\u0113': 'e', '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
  '\u011c': 'G', '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011d': 'g', '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H', '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I', '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
  '\u0129': 'i', '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
  '\u0134': 'J', '\u0135': 'j',
  '\u0136': 'K', '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L', '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
  '\u013a': 'l', '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N', '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
  '\u0144': 'n', '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
  '\u014c': 'O', '\u014e': 'O', '\u0150': 'O',
  '\u014d': 'o', '\u014f': 'o', '\u0151': 'o',
  '\u0154': 'R', '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r', '\u0157': 'r', '\u0159': 'r',
  '\u015a': 'S', '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
  '\u015b': 's', '\u015d': 's', '\u015f': 's', '\u0161': 's',
  '\u0162': 'T', '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't', '\u0165': 't', '\u0167': 't',
  '\u0168': 'U', '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u', '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W', '\u0175': 'w',
  '\u0176': 'Y', '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z', '\u017b': 'Z', '\u017d': 'Z',
  '\u017a': 'z', '\u017c': 'z', '\u017e': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017f': 'ss'
};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function (key) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
var deburrLetter = basePropertyOf(deburredLetters);

/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */
function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}

/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder(callback) {
  return function (string) {
    return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
  };
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
}

/**
 * Converts `string` to
 * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the kebab cased string.
 * @example
 *
 * _.kebabCase('Foo Bar');
 * // => 'foo-bar'
 *
 * _.kebabCase('fooBar');
 * // => 'foo-bar'
 *
 * _.kebabCase('__FOO_BAR__');
 * // => 'foo-bar'
 */
var kebabCase = createCompounder(function (result, word, index) {
  return result + (index ? '-' : '') + word.toLowerCase();
});

/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words(string, pattern, guard) {
  string = toString(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  }
  return string.match(pattern) || [];
}

module.exports = kebabCase;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),

/***/ "./node_modules/pwet/src/component.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_clonedeep__ = __webpack_require__("./node_modules/lodash.clonedeep/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_clonedeep___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_clonedeep__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_kwak__ = __webpack_require__("./node_modules/kwak/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utilities__ = __webpack_require__("./node_modules/pwet/src/utilities.js");






const Component = (component = {}) => {

  const { element, hooks, root } = component;
  let { tagName, properties = {}, attributes = {}, updaters = {}, verbose } = component.definition;
  let _isAttached = false;
  let _isRendered = false;
  let _isUpdating = false;
  let _properties;

  if (verbose) console.log(`<${tagName}>`, 'Component()', { updaters, _isAttached, _isRendered });

  if (!root) component.root = element;

  component.updaters = Object.keys(updaters).reduce((before, key) => {

    return Object.assign(before, {
      [key]: updaters[key].bind(null, component)
    });
  }, {});

  const _attributesNames = Object.keys(attributes);

  Object.defineProperties(component, {
    isRendered: { get: () => _isRendered },
    isUpdating: { get: () => _isUpdating },
    isAttached: { get: () => _isAttached }
  });

  const _getProperties = () => {

    Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["a" /* assert */])(!Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["l" /* isUndefined */])(_properties), `Cannot get properties during creation`);
    Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["a" /* assert */])(!component.isUpdating, `Cannot get properties during update`);

    return Object(__WEBPACK_IMPORTED_MODULE_2__utilities__["a" /* clone */])(_properties);
  };

  Object.defineProperties(element, {
    properties: {
      get: _getProperties,
      set: newValue => component.update(newValue)
      //set: component.update
    }
  });

  component.attach = () => {

    if (_isAttached) return;

    const _attachComponent = () => {

      _isAttached = true;

      if (verbose) console.log(`<${tagName}>`, 'attach()', _properties, { _isAttached, _isRendered });

      if (!_isRendered) component.render();

      hooks.attach(component);

      if (!Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["h" /* isNull */])(_attributeObserver)) _attributeObserver.observe(element, { attributes: true, attributeOldValue: true });
    };

    if (!component.isUpdating) return _attachComponent();

    setTimeout(_attachComponent, 0);
  };

  component.detach = () => {

    if (!_isAttached) return;

    if (!Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["h" /* isNull */])(_attributeObserver)) _attributeObserver.disconnect();

    _isRendered = _isAttached = false;

    if (verbose) console.log(`<${tagName}>`, 'detach', { _isAttached, _isRendered });

    hooks.detach(component);
  };

  component.render = () => {

    if (verbose) console.log(`<${tagName}>`, 'render()', Object.assign({}, _properties));

    if (!_isAttached) return;

    component.hooks.render(component);

    _isRendered = true;
  };

  component.update = (properties, options = {}) => {

    Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["a" /* assert */])(Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["i" /* isObject */])(properties), `'properties' must be an object`);
    Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["a" /* assert */])(Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["i" /* isObject */])(options), `'options' must be an object`);

    const { partial = false } = options;

    if (verbose) console.log(`<${tagName}>`, 'update()', { properties, partial });

    Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["a" /* assert */])(!component.isUpdating, `Cannot update during update`);

    const oldProperties = element.properties;

    _isUpdating = true;

    let newProperties = !partial ? Object(__WEBPACK_IMPORTED_MODULE_2__utilities__["a" /* clone */])(properties) : Object.assign({}, _properties, properties);

    newProperties = Object.keys(newProperties).filter(key => _propertiesKeys.includes(key)).reduce((before, key) => Object.assign(before, { [key]: newProperties[key] }), {});

    const mustRender = hooks.update(component, newProperties, oldProperties);

    Object.assign(_properties, newProperties);

    _isUpdating = false;

    if (mustRender) return component.render();

    if (verbose) console.warn(`<${tagName}>`, 'update has not rendered component');
  };

  component.isPwet = true;

  Object.freeze(component.hooks);
  Object.freeze(component);

  properties = Object.keys(properties).reduce((before, key) => {

    let property = properties[key](component);

    if (Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["l" /* isUndefined */])(property.configurable)) property.configurable = true;

    Object.defineProperty(element, key, {
      get: () => _properties[key],
      set: newValue => component.update({ [key]: newValue }, { partial: true })
    });

    property.enumerable = true;

    before[key] = property;

    return before;
  }, {});

  let _propertiesKeys = Object.keys(properties);
  _properties = Object.defineProperties({}, properties);

  // Initialize properties
  component.update(_properties, _properties);

  // Use of MutationObserver instead of observedAttributes because MutationObserver callback is debounced.
  const _attributeObserver = Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["d" /* isEmpty */])(attributes) ? null : new MutationObserver(mutations => {

    if (component.isUpdating) return;

    mutations = mutations.filter(({ attributeName }) => _attributesNames.includes(attributeName)).map(({ attributeName: name, oldValue }) => ({
      name,
      oldValue,
      value: element.getAttribute(name)
    })).filter(({ value, oldValue }) => !Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["e" /* isEqualTo */])(value, oldValue));

    if (Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["d" /* isEmpty */])(mutations)) return;

    if (verbose) console.log(`<${tagName}>`, 'attributesChanged', mutations.map(({ name, value }) => `${name}=${value}`));

    Promise.all(mutations.map(({ name, value, oldValue }) => value === oldValue ? value : attributes[name](component, value, oldValue))).then(attributesValues => {

      let mustUpdate = false;

      const properties = attributesValues.reduce((before, result) => {

        if (Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["j" /* isPlainObject */])(result)) {
          mustUpdate = true;
          Object.assign(before, result);
        }

        return before;
      }, {});

      if (verbose) console.log(`<${tagName}>`, 'attributesChanged => properties', properties);

      if (mustUpdate) component.update(properties, { partial: true });
    });
  });

  return component;
};

Component.hooks = {
  create: Component,
  attach: __WEBPACK_IMPORTED_MODULE_2__utilities__["d" /* noop */],
  detach: __WEBPACK_IMPORTED_MODULE_2__utilities__["d" /* noop */],
  render: __WEBPACK_IMPORTED_MODULE_2__utilities__["d" /* noop */],
  define: __WEBPACK_IMPORTED_MODULE_2__utilities__["c" /* identity */],
  update: (component, properties, oldProperties) => !component.isRendered || !Object(__WEBPACK_IMPORTED_MODULE_1_kwak__["c" /* isDeeplyEqual */])(properties, oldProperties)
};

/* harmony default export */ __webpack_exports__["a"] = (Component);

/***/ }),

/***/ "./node_modules/pwet/src/definition.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Definition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return $pwet; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_kebabcase__ = __webpack_require__("./node_modules/lodash.kebabcase/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_kebabcase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_kebabcase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities__ = __webpack_require__("./node_modules/pwet/src/utilities.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__component__ = __webpack_require__("./node_modules/pwet/src/component.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ramda_src_pipe__ = __webpack_require__("./node_modules/ramda/src/pipe.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ramda_src_pipe___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ramda_src_pipe__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_kwak__ = __webpack_require__("./node_modules/kwak/lib/index.js");
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };








const _parseMethods = (input, label = 'input', defaults = input) => {

  Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["a" /* assert */])(Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["i" /* isObject */])(input), `'${label}' must be an object`);

  Object.keys(input).forEach(key => {

    const value = input[key] || defaults[key];

    Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["a" /* assert */])(Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["f" /* isFunction */])(value), `'${key}' must be a function`);

    input[key] = value;
  });

  return input;
};

const _definitions = [];
const $pwet = Symbol('__pwet');

const Definition = (definition = {}) => {

  if (Definition.isDefinition(definition)) return definition;

  definition = Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["b" /* isArray */])(definition) ? Definition.composeDefinition(definition) : Definition.parseDefinition(definition);

  definition.type = class extends definition.type {
    constructor() {

      super();

      this[$pwet] = definition.hooks.create({
        element: this,
        definition,
        hooks: Object(__WEBPACK_IMPORTED_MODULE_1__utilities__["a" /* clone */])(definition.hooks)
      });
    }
    connectedCallback() {

      this[$pwet].attach(this.pwet);
    }
    disconnectedCallback() {

      this[$pwet].detach(this.pwet);
    }
  };

  definition = definition.hooks.define(definition);

  Object.freeze(definition);

  _definitions.push(definition);

  return definition;
};

Definition.composeDefinition = definition => {

  Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["a" /* assert */])(Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["b" /* isArray */])(definition), `'definition' must be an array`);

  if (!definition.includes(__WEBPACK_IMPORTED_MODULE_2__component__["a" /* default */])) definition.push(__WEBPACK_IMPORTED_MODULE_2__component__["a" /* default */]);

  return Definition.parseDefinition(Object.assign(__WEBPACK_IMPORTED_MODULE_3_ramda_src_pipe___default()(...definition.filter(__WEBPACK_IMPORTED_MODULE_4_kwak__["f" /* isFunction */])), definition.reverse().reduce((before, after) => {

    const hooks = _extends({}, before.hooks);

    if (Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["i" /* isObject */])(after.hooks)) {

      Object.assign(hooks, after.hooks);

      if (Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["f" /* isFunction */])(before.hooks.define) && Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["f" /* isFunction */])(after.hooks.define)) hooks.define = __WEBPACK_IMPORTED_MODULE_3_ramda_src_pipe___default()(before.hooks.define, after.hooks.define);
    }

    return Object.assign(before, after, { hooks });
  }, { hooks: {} })));
};

Definition.parseDefinition = (definition = {}) => {

  console.log('Definition.parseDefinition()');

  if (Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["f" /* isFunction */])(definition)) {

    if (Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["l" /* isUndefined */])(definition.tagName) && Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["k" /* isString */])(definition.name)) definition.tagName = __WEBPACK_IMPORTED_MODULE_0_lodash_kebabcase___default()(definition.name);

    definition = _extends({}, definition, {
      hooks: _extends({}, definition.hooks, {
        create: definition
      })
    });
  }

  Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["a" /* assert */])(Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["i" /* isObject */])(definition), `'definition' must be an object`);

  const { properties = {}, hooks = {}, updaters = {}, attributes = {}, verbose } = definition;
  let { tagName, type = HTMLElement, style = '' } = definition;

  // Tag
  Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["a" /* assert */])(Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["k" /* isString */])(tagName) && !Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["d" /* isEmpty */])(tagName), `'tagName' must be a non empty string`);
  tagName = __WEBPACK_IMPORTED_MODULE_0_lodash_kebabcase___default()(tagName.toLowerCase());
  if (!tagName.includes('-')) tagName = `x-${tagName}`;
  Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["a" /* assert */])(!Definition.getDefinition(tagName), `'${tagName}' definition already exists`);

  // Type
  Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["a" /* assert */])(Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["f" /* isFunction */])(type) && (type === HTMLElement || Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["g" /* isHTMLElement */])(type.prototype)), `'type' must be a subclass of HTMLElement`);

  // Properties
  Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["a" /* assert */])(Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["i" /* isObject */])(properties), `'properties' must be an object`);
  Object.keys(properties).forEach(key => {
    let property = properties[key];

    if (!Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["f" /* isFunction */])(property)) {

      if (!Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["j" /* isPlainObject */])(property)) property = { value: property, writable: true };

      properties[key] = () => property;
    }
  });

  // Attributes
  Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["a" /* assert */])(Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["i" /* isObject */])(attributes), `'attributes' must be an object`);
  Object.keys(attributes).forEach(key => {
    const attribute = attributes[key];

    Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["a" /* assert */])(Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["f" /* isFunction */])(attribute), `Invalid 'attributes': ${key}' must be a function`);
  });

  // Style
  Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["a" /* assert */])(Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["l" /* isUndefined */])(style) || Object(__WEBPACK_IMPORTED_MODULE_4_kwak__["k" /* isString */])(style), `'style' must be a string`);

  // Hooks
  _parseMethods(hooks, 'hooks');
  console.log('define hooks=', hooks);

  // Updaters
  _parseMethods(updaters, 'updaters');
  Object.keys(updaters).forEach(key => {
    const updater = updaters[key];
  });

  return _extends({}, definition, {
    tagName,
    type,
    properties,
    attributes,
    style,
    hooks,
    updaters,
    verbose
  });
};

Definition.getDefinition = input => _definitions.find(definition => definition.tagName === input);
Definition.isDefinition = input => _definitions.includes(input);



/***/ }),

/***/ "./node_modules/pwet/src/definitions/shadow.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webcomponents_shadycss_src_style_transformer__ = __webpack_require__("./node_modules/@webcomponents/shadycss/src/style-transformer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__definition__ = __webpack_require__("./node_modules/pwet/src/definition.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utilities__ = __webpack_require__("./node_modules/pwet/src/utilities.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_kwak__ = __webpack_require__("./node_modules/kwak/lib/index.js");







const isShadowNative = !(window['ShadyDOM'] && window['ShadyDOM']['inUse']);

const ShadowComponent = component => {

  const { element, definition: { verbose, tagName }, hooks } = component;

  component.root = element.attachShadow({ mode: 'open' });

  if (verbose) console.log('ShadowComponent()');

  hooks.render = Object(__WEBPACK_IMPORTED_MODULE_2__utilities__["b" /* decorate */])(hooks.render, (next, component) => {

    if (verbose) console.log('ShadowComponent.render()');

    next(component);

    if (!isShadowNative) __WEBPACK_IMPORTED_MODULE_0__webcomponents_shadycss_src_style_transformer__["a" /* default */].dom(component.root, tagName);
  });

  return component;
};

ShadowComponent.hooks = {
  define: definition => {

    const { tagName, style, verbose } = definition;

    if (!Object(__WEBPACK_IMPORTED_MODULE_3_kwak__["d" /* isEmpty */])(style) && !isShadowNative) definition.style = __WEBPACK_IMPORTED_MODULE_0__webcomponents_shadycss_src_style_transformer__["a" /* default */].css(style, tagName);

    if (verbose) console.log(`<${tagName}>`, 'ShadowComponent.define()');

    return definition;
  }
};

/* harmony default export */ __webpack_exports__["a"] = (ShadowComponent);

/***/ }),

/***/ "./node_modules/pwet/src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return defineComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__definition__ = __webpack_require__("./node_modules/pwet/src/definition.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__component__ = __webpack_require__("./node_modules/pwet/src/component.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_kwak__ = __webpack_require__("./node_modules/kwak/lib/index.js");
/* unused harmony reexport Component */
/* unused harmony reexport Definition */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__definition__["a"]; });


var _arguments = arguments;




/**
 * Defines a component from a definition
 * @param definition
 * @param options
 * @returns {*}
 */
const defineComponent = (definition, options = {}) => {

  definition = Object(__WEBPACK_IMPORTED_MODULE_0__definition__["b" /* default */])(definition);

  let { tagName } = definition;

  if (Object(__WEBPACK_IMPORTED_MODULE_2_kwak__["k" /* isString */])(options)) {
    tagName = options;
    options = _arguments.length > 2 ? _arguments[2] : null;
  }

  Object(__WEBPACK_IMPORTED_MODULE_2_kwak__["a" /* assert */])(Object(__WEBPACK_IMPORTED_MODULE_2_kwak__["i" /* isObject */])(options), `'options' must be an object`);

  customElements.define(definition.tagName, definition.type, options);

  return definition;
};



/***/ }),

/***/ "./node_modules/pwet/src/utilities.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_kwak__ = __webpack_require__("./node_modules/kwak/lib/index.js");


const clone = input => !Object(__WEBPACK_IMPORTED_MODULE_0_kwak__["b" /* isArray */])(input) ? Object(__WEBPACK_IMPORTED_MODULE_0_kwak__["i" /* isObject */])(input) && !Object(__WEBPACK_IMPORTED_MODULE_0_kwak__["h" /* isNull */])(input) ? Object.assign({}, input) : input : input.map(clone);
/* harmony export (immutable) */ __webpack_exports__["a"] = clone;


const noop = () => {};
/* harmony export (immutable) */ __webpack_exports__["d"] = noop;

const identity = arg => arg;
/* harmony export (immutable) */ __webpack_exports__["c"] = identity;

const toggle = input => !input;
/* unused harmony export toggle */

const not = fn => (...args) => !fn(...args);
/* unused harmony export not */

const isAttached = (element, container = document) => container.contains(element);
/* unused harmony export isAttached */


const decorate = (before, ...decorators) => {

  Object(__WEBPACK_IMPORTED_MODULE_0_kwak__["a" /* assert */])(Object(__WEBPACK_IMPORTED_MODULE_0_kwak__["f" /* isFunction */])(before), `'before' must be a function`);

  Object(__WEBPACK_IMPORTED_MODULE_0_kwak__["a" /* assert */])(!Object(__WEBPACK_IMPORTED_MODULE_0_kwak__["d" /* isEmpty */])(decorators) && decorators.every(__WEBPACK_IMPORTED_MODULE_0_kwak__["f" /* isFunction */]), `decorate only accepts functions as parameters`);

  return decorators.reduce((before, fn) => fn.bind(null, before), before);
};
/* harmony export (immutable) */ __webpack_exports__["b"] = decorate;


/***/ }),

/***/ "./node_modules/ramda/src/bind.js":
/***/ (function(module, exports, __webpack_require__) {

var _arity = __webpack_require__("./node_modules/ramda/src/internal/_arity.js");
var _curry2 = __webpack_require__("./node_modules/ramda/src/internal/_curry2.js");

/**
 * Creates a function that is bound to a context.
 * Note: `R.bind` does not provide the additional argument-binding capabilities of
 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @category Object
 * @sig (* -> *) -> {*} -> (* -> *)
 * @param {Function} fn The function to bind to context
 * @param {Object} thisObj The context to bind `fn` to
 * @return {Function} A function that will execute in the context of `thisObj`.
 * @see R.partial
 * @example
 *
 *      var log = R.bind(console.log, console);
 *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
 *      // logs {a: 2}
 * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
 */
module.exports = _curry2(function bind(fn, thisObj) {
  return _arity(fn.length, function () {
    return fn.apply(thisObj, arguments);
  });
});

/***/ }),

/***/ "./node_modules/ramda/src/internal/_arity.js":
/***/ (function(module, exports) {

module.exports = function _arity(n, fn) {
  /* eslint-disable no-unused-vars */
  switch (n) {
    case 0:
      return function () {
        return fn.apply(this, arguments);
      };
    case 1:
      return function (a0) {
        return fn.apply(this, arguments);
      };
    case 2:
      return function (a0, a1) {
        return fn.apply(this, arguments);
      };
    case 3:
      return function (a0, a1, a2) {
        return fn.apply(this, arguments);
      };
    case 4:
      return function (a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };
    case 5:
      return function (a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };
    case 6:
      return function (a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };
    case 7:
      return function (a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };
    case 8:
      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };
    case 9:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };
    case 10:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };
    default:
      throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
};

/***/ }),

/***/ "./node_modules/ramda/src/internal/_checkForMethod.js":
/***/ (function(module, exports, __webpack_require__) {

var _isArray = __webpack_require__("./node_modules/ramda/src/internal/_isArray.js");

/**
 * This checks whether a function has a [methodname] function. If it isn't an
 * array it will execute that function otherwise it will default to the ramda
 * implementation.
 *
 * @private
 * @param {Function} fn ramda implemtation
 * @param {String} methodname property to check for a custom implementation
 * @return {Object} Whatever the return value of the method is.
 */
module.exports = function _checkForMethod(methodname, fn) {
  return function () {
    var length = arguments.length;
    if (length === 0) {
      return fn();
    }
    var obj = arguments[length - 1];
    return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
  };
};

/***/ }),

/***/ "./node_modules/ramda/src/internal/_curry1.js":
/***/ (function(module, exports, __webpack_require__) {

var _isPlaceholder = __webpack_require__("./node_modules/ramda/src/internal/_isPlaceholder.js");

/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
};

/***/ }),

/***/ "./node_modules/ramda/src/internal/_curry2.js":
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__("./node_modules/ramda/src/internal/_curry1.js");
var _isPlaceholder = __webpack_require__("./node_modules/ramda/src/internal/_isPlaceholder.js");

/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
          return fn(a, _b);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
};

/***/ }),

/***/ "./node_modules/ramda/src/internal/_curry3.js":
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__("./node_modules/ramda/src/internal/_curry1.js");
var _curry2 = __webpack_require__("./node_modules/ramda/src/internal/_curry2.js");
var _isPlaceholder = __webpack_require__("./node_modules/ramda/src/internal/_isPlaceholder.js");

/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        });
      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1(function (_c) {
          return fn(a, b, _c);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
          return fn(_a, _b, c);
        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b, c);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b, c);
        }) : _isPlaceholder(c) ? _curry1(function (_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
    }
  };
};

/***/ }),

/***/ "./node_modules/ramda/src/internal/_isArray.js":
/***/ (function(module, exports) {

/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
module.exports = Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
};

/***/ }),

/***/ "./node_modules/ramda/src/internal/_isArrayLike.js":
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__("./node_modules/ramda/src/internal/_curry1.js");
var _isArray = __webpack_require__("./node_modules/ramda/src/internal/_isArray.js");
var _isString = __webpack_require__("./node_modules/ramda/src/internal/_isString.js");

/**
 * Tests whether or not an object is similar to an array.
 *
 * @private
 * @category Type
 * @category List
 * @sig * -> Boolean
 * @param {*} x The object to test.
 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
 * @example
 *
 *      _isArrayLike([]); //=> true
 *      _isArrayLike(true); //=> false
 *      _isArrayLike({}); //=> false
 *      _isArrayLike({length: 10}); //=> false
 *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 */
module.exports = _curry1(function isArrayLike(x) {
  if (_isArray(x)) {
    return true;
  }
  if (!x) {
    return false;
  }
  if (typeof x !== 'object') {
    return false;
  }
  if (_isString(x)) {
    return false;
  }
  if (x.nodeType === 1) {
    return !!x.length;
  }
  if (x.length === 0) {
    return true;
  }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
});

/***/ }),

/***/ "./node_modules/ramda/src/internal/_isPlaceholder.js":
/***/ (function(module, exports) {

module.exports = function _isPlaceholder(a) {
       return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
};

/***/ }),

/***/ "./node_modules/ramda/src/internal/_isString.js":
/***/ (function(module, exports) {

module.exports = function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
};

/***/ }),

/***/ "./node_modules/ramda/src/internal/_pipe.js":
/***/ (function(module, exports) {

module.exports = function _pipe(f, g) {
  return function () {
    return g.call(this, f.apply(this, arguments));
  };
};

/***/ }),

/***/ "./node_modules/ramda/src/internal/_reduce.js":
/***/ (function(module, exports, __webpack_require__) {

var _isArrayLike = __webpack_require__("./node_modules/ramda/src/internal/_isArrayLike.js");
var _xwrap = __webpack_require__("./node_modules/ramda/src/internal/_xwrap.js");
var bind = __webpack_require__("./node_modules/ramda/src/bind.js");

module.exports = function () {
  function _arrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      acc = xf['@@transducer/step'](acc, list[idx]);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      idx += 1;
    }
    return xf['@@transducer/result'](acc);
  }

  function _iterableReduce(xf, acc, iter) {
    var step = iter.next();
    while (!step.done) {
      acc = xf['@@transducer/step'](acc, step.value);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      step = iter.next();
    }
    return xf['@@transducer/result'](acc);
  }

  function _methodReduce(xf, acc, obj, methodName) {
    return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
  }

  var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';
  return function _reduce(fn, acc, list) {
    if (typeof fn === 'function') {
      fn = _xwrap(fn);
    }
    if (_isArrayLike(list)) {
      return _arrayReduce(fn, acc, list);
    }
    if (typeof list['fantasy-land/reduce'] === 'function') {
      return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
    }
    if (list[symIterator] != null) {
      return _iterableReduce(fn, acc, list[symIterator]());
    }
    if (typeof list.next === 'function') {
      return _iterableReduce(fn, acc, list);
    }
    if (typeof list.reduce === 'function') {
      return _methodReduce(fn, acc, list, 'reduce');
    }

    throw new TypeError('reduce: list must be array or iterable');
  };
}();

/***/ }),

/***/ "./node_modules/ramda/src/internal/_xwrap.js":
/***/ (function(module, exports) {

module.exports = function () {
  function XWrap(fn) {
    this.f = fn;
  }
  XWrap.prototype['@@transducer/init'] = function () {
    throw new Error('init not implemented on XWrap');
  };
  XWrap.prototype['@@transducer/result'] = function (acc) {
    return acc;
  };
  XWrap.prototype['@@transducer/step'] = function (acc, x) {
    return this.f(acc, x);
  };

  return function _xwrap(fn) {
    return new XWrap(fn);
  };
}();

/***/ }),

/***/ "./node_modules/ramda/src/pipe.js":
/***/ (function(module, exports, __webpack_require__) {

var _arity = __webpack_require__("./node_modules/ramda/src/internal/_arity.js");
var _pipe = __webpack_require__("./node_modules/ramda/src/internal/_pipe.js");
var reduce = __webpack_require__("./node_modules/ramda/src/reduce.js");
var tail = __webpack_require__("./node_modules/ramda/src/tail.js");

/**
 * Performs left-to-right function composition. The leftmost function may have
 * any arity; the remaining functions must be unary.
 *
 * In some libraries this function is named `sequence`.
 *
 * **Note:** The result of pipe is not automatically curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
 * @param {...Function} functions
 * @return {Function}
 * @see R.compose
 * @example
 *
 *      var f = R.pipe(Math.pow, R.negate, R.inc);
 *
 *      f(3, 4); // -(3^4) + 1
 * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
 */
module.exports = function pipe() {
  if (arguments.length === 0) {
    throw new Error('pipe requires at least one argument');
  }
  return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
};

/***/ }),

/***/ "./node_modules/ramda/src/reduce.js":
/***/ (function(module, exports, __webpack_require__) {

var _curry3 = __webpack_require__("./node_modules/ramda/src/internal/_curry3.js");
var _reduce = __webpack_require__("./node_modules/ramda/src/internal/_reduce.js");

/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*. It may use
 * [`R.reduced`](#reduced) to shortcut the iteration.
 *
 * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
 * is *(value, acc)*.
 *
 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduce` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
 *
 * Dispatches to the `reduce` method of the third argument, if present. When
 * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
 * shortcuting, as this is not implemented by `reduce`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduced, R.addIndex, R.reduceRight
 * @example
 *
 *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
 *                -               -10
 *               / \              / \
 *              -   4           -6   4
 *             / \              / \
 *            -   3   ==>     -3   3
 *           / \              / \
 *          -   2           -1   2
 *         / \              / \
 *        0   1            0   1
 *
 * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
 */
module.exports = _curry3(_reduce);

/***/ }),

/***/ "./node_modules/ramda/src/slice.js":
/***/ (function(module, exports, __webpack_require__) {

var _checkForMethod = __webpack_require__("./node_modules/ramda/src/internal/_checkForMethod.js");
var _curry3 = __webpack_require__("./node_modules/ramda/src/internal/_curry3.js");

/**
 * Returns the elements of the given list or string (or object with a `slice`
 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
 *
 * Dispatches to the `slice` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @sig Number -> Number -> String -> String
 * @param {Number} fromIndex The start index (inclusive).
 * @param {Number} toIndex The end index (exclusive).
 * @param {*} list
 * @return {*}
 * @example
 *
 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
 */
module.exports = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
  return Array.prototype.slice.call(list, fromIndex, toIndex);
}));

/***/ }),

/***/ "./node_modules/ramda/src/tail.js":
/***/ (function(module, exports, __webpack_require__) {

var _checkForMethod = __webpack_require__("./node_modules/ramda/src/internal/_checkForMethod.js");
var _curry1 = __webpack_require__("./node_modules/ramda/src/internal/_curry1.js");
var slice = __webpack_require__("./node_modules/ramda/src/slice.js");

/**
 * Returns all but the first element of the given list or string (or object
 * with a `tail` method).
 *
 * Dispatches to the `slice` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.head, R.init, R.last
 * @example
 *
 *      R.tail([1, 2, 3]);  //=> [2, 3]
 *      R.tail([1, 2]);     //=> [2]
 *      R.tail([1]);        //=> []
 *      R.tail([]);         //=> []
 *
 *      R.tail('abc');  //=> 'bc'
 *      R.tail('ab');   //=> 'b'
 *      R.tail('a');    //=> ''
 *      R.tail('');     //=> ''
 */
module.exports = _curry1(_checkForMethod('tail', slice(1, Infinity)));

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/***/ (function(module, exports) {

module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function () {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function () {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ })

/******/ });
//# sourceMappingURL=main.js.map