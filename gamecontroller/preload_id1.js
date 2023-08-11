
  var Module = typeof Module !== 'undefined' ? Module : {};
  
  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }
  Module.expectedDataFileDownloads++;
  (function() {
   var loadPackage = function(metadata) {
  
      var PACKAGE_PATH;
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof location !== 'undefined') {
        // worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      } else {
        throw 'using preloaded data can only be done on a web page or in a web worker';
      }
      var PACKAGE_NAME = 'id1.data';
      var REMOTE_PACKAGE_BASE = 'id1.data';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
    
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
      var PACKAGE_UUID = metadata['package_uuid'];
    
      function fetchRemotePackage(packageName, packageSize, callback, errback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };
    
    function runWithFS() {
  
      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
  Module['FS_createPath']('/', 'hl', true, true);
Module['FS_createPath']('/hl', 'id1', true, true);
Module['FS_createPath']('/hl/id1', 'gfx', true, true);
Module['FS_createPath']('/hl/id1', 'glquake', true, true);
Module['FS_createPath']('/hl/id1', 'maps', true, true);
Module['FS_createPath']('/hl/id1', 'progs', true, true);
Module['FS_createPath']('/hl/id1', 'sound', true, true);
Module['FS_createPath']('/hl/id1/sound', 'ambience', true, true);
Module['FS_createPath']('/hl/id1/sound', 'boss1', true, true);
Module['FS_createPath']('/hl/id1/sound', 'buttons', true, true);
Module['FS_createPath']('/hl/id1/sound', 'demon', true, true);
Module['FS_createPath']('/hl/id1/sound', 'dog', true, true);
Module['FS_createPath']('/hl/id1/sound', 'doors', true, true);
Module['FS_createPath']('/hl/id1/sound', 'hknight', true, true);
Module['FS_createPath']('/hl/id1/sound', 'items', true, true);
Module['FS_createPath']('/hl/id1/sound', 'knight', true, true);
Module['FS_createPath']('/hl/id1/sound', 'misc', true, true);
Module['FS_createPath']('/hl/id1/sound', 'ogre', true, true);
Module['FS_createPath']('/hl/id1/sound', 'plats', true, true);
Module['FS_createPath']('/hl/id1/sound', 'player', true, true);
Module['FS_createPath']('/hl/id1/sound', 'shambler', true, true);
Module['FS_createPath']('/hl/id1/sound', 'soldier', true, true);
Module['FS_createPath']('/hl/id1/sound', 'weapons', true, true);
Module['FS_createPath']('/hl/id1/sound', 'wizard', true, true);
Module['FS_createPath']('/hl/id1/sound', 'zombie', true, true);

      /** @constructor */
      function DataRequest(start, end, audio) {
        this.start = start;
        this.end = end;
        this.audio = audio;
      }
      DataRequest.prototype = {
        requests: {},
        open: function(mode, name) {
          this.name = name;
          this.requests[name] = this;
          Module['addRunDependency']('fp ' + this.name);
        },
        send: function() {},
        onload: function() {
          var byteArray = this.byteArray.subarray(this.start, this.end);
          this.finish(byteArray);
        },
        finish: function(byteArray) {
          var that = this;
  
          Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
            Module['removeRunDependency']('fp ' + that.name);
          }, function() {
            if (that.audio) {
              Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
            } else {
              err('Preloading file ' + that.name + ' failed');
            }
          }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
  
          this.requests[this.name] = null;
        }
      };
  
          var files = metadata['files'];
          for (var i = 0; i < files.length; ++i) {
            new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio']).open('GET', files[i]['filename']);
          }
  
    
        var indexedDB;
        if (typeof window === 'object') {
          indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        } else if (typeof location !== 'undefined') {
          // worker
          indexedDB = self.indexedDB;
        } else {
          throw 'using IndexedDB to cache data can only be done on a web page or in a web worker';
        }
        var IDB_RO = "readonly";
        var IDB_RW = "readwrite";
        var DB_NAME = "EM_PRELOAD_CACHE";
        var DB_VERSION = 1;
        var METADATA_STORE_NAME = 'METADATA';
        var PACKAGE_STORE_NAME = 'PACKAGES';
        function openDatabase(callback, errback) {
          try {
            var openRequest = indexedDB.open(DB_NAME, DB_VERSION);
          } catch (e) {
            return errback(e);
          }
          openRequest.onupgradeneeded = function(event) {
            var db = event.target.result;

            if(db.objectStoreNames.contains(PACKAGE_STORE_NAME)) {
              db.deleteObjectStore(PACKAGE_STORE_NAME);
            }
            var packages = db.createObjectStore(PACKAGE_STORE_NAME);

            if(db.objectStoreNames.contains(METADATA_STORE_NAME)) {
              db.deleteObjectStore(METADATA_STORE_NAME);
            }
            var metadata = db.createObjectStore(METADATA_STORE_NAME);
          };
          openRequest.onsuccess = function(event) {
            var db = event.target.result;
            callback(db);
          };
          openRequest.onerror = function(error) {
            errback(error);
          };
        };

        // This is needed as chromium has a limit on per-entry files in IndexedDB
        // https://cs.chromium.org/chromium/src/content/renderer/indexed_db/webidbdatabase_impl.cc?type=cs&sq=package:chromium&g=0&l=177
        // https://cs.chromium.org/chromium/src/out/Debug/gen/third_party/blink/public/mojom/indexeddb/indexeddb.mojom.h?type=cs&sq=package:chromium&g=0&l=60
        // We set the chunk size to 64MB to stay well-below the limit
        var CHUNK_SIZE = 64 * 1024 * 1024;

        function cacheRemotePackage(
          db,
          packageName,
          packageData,
          packageMeta,
          callback,
          errback
        ) {
          var transactionPackages = db.transaction([PACKAGE_STORE_NAME], IDB_RW);
          var packages = transactionPackages.objectStore(PACKAGE_STORE_NAME);
          var chunkSliceStart = 0;
          var nextChunkSliceStart = 0;
          var chunkCount = Math.ceil(packageData.byteLength / CHUNK_SIZE);
          var finishedChunks = 0;
          for (var chunkId = 0; chunkId < chunkCount; chunkId++) {
            nextChunkSliceStart += CHUNK_SIZE;
            var putPackageRequest = packages.put(
              packageData.slice(chunkSliceStart, nextChunkSliceStart),
              'package/' + packageName + '/' + chunkId
            );
            chunkSliceStart = nextChunkSliceStart;
            putPackageRequest.onsuccess = function(event) {
              finishedChunks++;
              if (finishedChunks == chunkCount) {
                var transaction_metadata = db.transaction(
                  [METADATA_STORE_NAME],
                  IDB_RW
                );
                var metadata = transaction_metadata.objectStore(METADATA_STORE_NAME);
                var putMetadataRequest = metadata.put(
                  {
                    'uuid': packageMeta.uuid,
                    'chunkCount': chunkCount
                  },
                  'metadata/' + packageName
                );
                putMetadataRequest.onsuccess = function(event) {
                  callback(packageData);
                };
                putMetadataRequest.onerror = function(error) {
                  errback(error);
                };
              }
            };
            putPackageRequest.onerror = function(error) {
              errback(error);
            };
          }
        }

        /* Check if there's a cached package, and if so whether it's the latest available */
        function checkCachedPackage(db, packageName, callback, errback) {
          var transaction = db.transaction([METADATA_STORE_NAME], IDB_RO);
          var metadata = transaction.objectStore(METADATA_STORE_NAME);
          var getRequest = metadata.get('metadata/' + packageName);
          getRequest.onsuccess = function(event) {
            var result = event.target.result;
            if (!result) {
              return callback(false, null);
            } else {
              return callback(PACKAGE_UUID === result['uuid'], result);
            }
          };
          getRequest.onerror = function(error) {
            errback(error);
          };
        }

        function fetchCachedPackage(db, packageName, metadata, callback, errback) {
          var transaction = db.transaction([PACKAGE_STORE_NAME], IDB_RO);
          var packages = transaction.objectStore(PACKAGE_STORE_NAME);

          var chunksDone = 0;
          var totalSize = 0;
          var chunkCount = metadata['chunkCount'];
          var chunks = new Array(chunkCount);

          for (var chunkId = 0; chunkId < chunkCount; chunkId++) {
            var getRequest = packages.get('package/' + packageName + '/' + chunkId);
            getRequest.onsuccess = function(event) {
              // If there's only 1 chunk, there's nothing to concatenate it with so we can just return it now
              if (chunkCount == 1) {
                callback(event.target.result);
              } else {
                chunksDone++;
                totalSize += event.target.result.byteLength;
                chunks.push(event.target.result);
                if (chunksDone == chunkCount) {
                  if (chunksDone == 1) {
                    callback(event.target.result);
                  } else {
                    var tempTyped = new Uint8Array(totalSize);
                    var byteOffset = 0;
                    for (var chunkId in chunks) {
                      var buffer = chunks[chunkId];
                      tempTyped.set(new Uint8Array(buffer), byteOffset);
                      byteOffset += buffer.byteLength;
                      buffer = undefined;
                    }
                    chunks = undefined;
                    callback(tempTyped.buffer);
                    tempTyped = undefined;
                  }
                }
              }
            };
            getRequest.onerror = function(error) {
              errback(error);
            };
          }
        }
      
      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        
          // Reuse the bytearray from the XHR as the source for file reads.
          DataRequest.prototype.byteArray = byteArray;
    
            var files = metadata['files'];
            for (var i = 0; i < files.length; ++i) {
              DataRequest.prototype.requests[files[i].filename].onload();
            }
                Module['removeRunDependency']('datafile_id1.data');

      };
      Module['addRunDependency']('datafile_id1.data');
    
      if (!Module.preloadResults) Module.preloadResults = {};
    
        function preloadFallback(error) {
          console.error(error);
          console.error('falling back to default preload behavior');
          fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, processPackageData, handleError);
        };

        openDatabase(
          function(db) {
            checkCachedPackage(db, PACKAGE_PATH + PACKAGE_NAME,
              function(useCached, metadata) {
                Module.preloadResults[PACKAGE_NAME] = {fromCache: useCached};
                if (useCached) {
                  fetchCachedPackage(db, PACKAGE_PATH + PACKAGE_NAME, metadata, processPackageData, preloadFallback);
                } else {
                  fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE,
                    function(packageData) {
                      cacheRemotePackage(db, PACKAGE_PATH + PACKAGE_NAME, packageData, {uuid:PACKAGE_UUID}, processPackageData,
                        function(error) {
                          console.error(error);
                          processPackageData(packageData);
                        });
                    }
                  , preloadFallback);
                }
              }
            , preloadFallback);
          }
        , preloadFallback);

        if (Module['setStatus']) Module['setStatus']('Downloading...');
      
    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }
  
   }
   loadPackage({"files": [{"filename": "/hl/id1/1.cfg", "start": 0, "end": 313, "audio": 0}, {"filename": "/hl/id1/2.cfg", "start": 313, "end": 361, "audio": 0}, {"filename": "/hl/id1/config.cfg", "start": 361, "end": 2408, "audio": 0}, {"filename": "/hl/id1/default.cfg", "start": 2408, "end": 4322, "audio": 0}, {"filename": "/hl/id1/demo1.dem", "start": 4322, "end": 188793, "audio": 0}, {"filename": "/hl/id1/demo2.dem", "start": 188793, "end": 341498, "audio": 0}, {"filename": "/hl/id1/demo3.dem", "start": 341498, "end": 539177, "audio": 0}, {"filename": "/hl/id1/end1.bin", "start": 539177, "end": 543177, "audio": 0}, {"filename": "/hl/id1/gfx.wad", "start": 543177, "end": 656005, "audio": 0}, {"filename": "/hl/id1/listip.cfg", "start": 656005, "end": 656005, "audio": 0}, {"filename": "/hl/id1/progs.dat", "start": 656005, "end": 1069121, "audio": 0}, {"filename": "/hl/id1/qconsole.log", "start": 1069121, "end": 1071734, "audio": 0}, {"filename": "/hl/id1/quake.rc", "start": 1071734, "end": 1071947, "audio": 0}, {"filename": "/hl/id1/quake00.tga", "start": 1071947, "end": 7292765, "audio": 0}, {"filename": "/hl/id1/gfx/bigbox.lmp", "start": 7292765, "end": 7297957, "audio": 0}, {"filename": "/hl/id1/gfx/box_bl.lmp", "start": 7297957, "end": 7298029, "audio": 0}, {"filename": "/hl/id1/gfx/box_bm.lmp", "start": 7298029, "end": 7298165, "audio": 0}, {"filename": "/hl/id1/gfx/box_br.lmp", "start": 7298165, "end": 7298237, "audio": 0}, {"filename": "/hl/id1/gfx/box_ml.lmp", "start": 7298237, "end": 7298309, "audio": 0}, {"filename": "/hl/id1/gfx/box_mm.lmp", "start": 7298309, "end": 7298445, "audio": 0}, {"filename": "/hl/id1/gfx/box_mm2.lmp", "start": 7298445, "end": 7298581, "audio": 0}, {"filename": "/hl/id1/gfx/box_mr.lmp", "start": 7298581, "end": 7298653, "audio": 0}, {"filename": "/hl/id1/gfx/box_tl.lmp", "start": 7298653, "end": 7298725, "audio": 0}, {"filename": "/hl/id1/gfx/box_tm.lmp", "start": 7298725, "end": 7298861, "audio": 0}, {"filename": "/hl/id1/gfx/box_tr.lmp", "start": 7298861, "end": 7298933, "audio": 0}, {"filename": "/hl/id1/gfx/colormap.lmp", "start": 7298933, "end": 7315318, "audio": 0}, {"filename": "/hl/id1/gfx/complete.lmp", "start": 7315318, "end": 7319934, "audio": 0}, {"filename": "/hl/id1/gfx/conback.lmp", "start": 7319934, "end": 7383942, "audio": 0}, {"filename": "/hl/id1/gfx/dim_drct.lmp", "start": 7383942, "end": 7387294, "audio": 0}, {"filename": "/hl/id1/gfx/dim_ipx.lmp", "start": 7387294, "end": 7390646, "audio": 0}, {"filename": "/hl/id1/gfx/dim_modm.lmp", "start": 7390646, "end": 7393998, "audio": 0}, {"filename": "/hl/id1/gfx/dim_mult.lmp", "start": 7393998, "end": 7397350, "audio": 0}, {"filename": "/hl/id1/gfx/dim_tcp.lmp", "start": 7397350, "end": 7400702, "audio": 0}, {"filename": "/hl/id1/gfx/finale.lmp", "start": 7400702, "end": 7407622, "audio": 0}, {"filename": "/hl/id1/gfx/help0.lmp", "start": 7407622, "end": 7471630, "audio": 0}, {"filename": "/hl/id1/gfx/help1.lmp", "start": 7471630, "end": 7535638, "audio": 0}, {"filename": "/hl/id1/gfx/help2.lmp", "start": 7535638, "end": 7599646, "audio": 0}, {"filename": "/hl/id1/gfx/help3.lmp", "start": 7599646, "end": 7663654, "audio": 0}, {"filename": "/hl/id1/gfx/help4.lmp", "start": 7663654, "end": 7727662, "audio": 0}, {"filename": "/hl/id1/gfx/help5.lmp", "start": 7727662, "end": 7791670, "audio": 0}, {"filename": "/hl/id1/gfx/inter.lmp", "start": 7791670, "end": 7814718, "audio": 0}, {"filename": "/hl/id1/gfx/loading.lmp", "start": 7814718, "end": 7818182, "audio": 0}, {"filename": "/hl/id1/gfx/mainmenu.lmp", "start": 7818182, "end": 7845070, "audio": 0}, {"filename": "/hl/id1/gfx/menudot1.lmp", "start": 7845070, "end": 7845462, "audio": 0}, {"filename": "/hl/id1/gfx/menudot2.lmp", "start": 7845462, "end": 7845854, "audio": 0}, {"filename": "/hl/id1/gfx/menudot3.lmp", "start": 7845854, "end": 7846246, "audio": 0}, {"filename": "/hl/id1/gfx/menudot4.lmp", "start": 7846246, "end": 7846638, "audio": 0}, {"filename": "/hl/id1/gfx/menudot5.lmp", "start": 7846638, "end": 7847030, "audio": 0}, {"filename": "/hl/id1/gfx/menudot6.lmp", "start": 7847030, "end": 7847422, "audio": 0}, {"filename": "/hl/id1/gfx/menuplyr.lmp", "start": 7847422, "end": 7850118, "audio": 0}, {"filename": "/hl/id1/gfx/mp_menu.lmp", "start": 7850118, "end": 7864974, "audio": 0}, {"filename": "/hl/id1/gfx/netmen1.lmp", "start": 7864974, "end": 7868326, "audio": 0}, {"filename": "/hl/id1/gfx/netmen2.lmp", "start": 7868326, "end": 7871678, "audio": 0}, {"filename": "/hl/id1/gfx/netmen3.lmp", "start": 7871678, "end": 7875030, "audio": 0}, {"filename": "/hl/id1/gfx/netmen4.lmp", "start": 7875030, "end": 7878382, "audio": 0}, {"filename": "/hl/id1/gfx/netmen5.lmp", "start": 7878382, "end": 7881734, "audio": 0}, {"filename": "/hl/id1/gfx/palette.lmp", "start": 7881734, "end": 7882502, "audio": 0}, {"filename": "/hl/id1/gfx/pause.lmp", "start": 7882502, "end": 7885582, "audio": 0}, {"filename": "/hl/id1/gfx/p_load.lmp", "start": 7885582, "end": 7888086, "audio": 0}, {"filename": "/hl/id1/gfx/p_multi.lmp", "start": 7888086, "end": 7893278, "audio": 0}, {"filename": "/hl/id1/gfx/p_option.lmp", "start": 7893278, "end": 7896742, "audio": 0}, {"filename": "/hl/id1/gfx/p_save.lmp", "start": 7896742, "end": 7898862, "audio": 0}, {"filename": "/hl/id1/gfx/qplaque.lmp", "start": 7898862, "end": 7903478, "audio": 0}, {"filename": "/hl/id1/gfx/ranking.lmp", "start": 7903478, "end": 7907518, "audio": 0}, {"filename": "/hl/id1/gfx/sell.lmp", "start": 7907518, "end": 7971526, "audio": 0}, {"filename": "/hl/id1/gfx/sp_menu.lmp", "start": 7971526, "end": 7986382, "audio": 0}, {"filename": "/hl/id1/gfx/ttl_cstm.lmp", "start": 7986382, "end": 7990806, "audio": 0}, {"filename": "/hl/id1/gfx/ttl_main.lmp", "start": 7990806, "end": 7993118, "audio": 0}, {"filename": "/hl/id1/gfx/ttl_sgl.lmp", "start": 7993118, "end": 7996198, "audio": 0}, {"filename": "/hl/id1/gfx/vidmodes.lmp", "start": 7996198, "end": 8001390, "audio": 0}, {"filename": "/hl/id1/glquake/armor.ms2", "start": 8001390, "end": 8003226, "audio": 0}, {"filename": "/hl/id1/glquake/backpack.ms2", "start": 8003226, "end": 8005258, "audio": 0}, {"filename": "/hl/id1/glquake/bolt.ms2", "start": 8005258, "end": 8005946, "audio": 0}, {"filename": "/hl/id1/glquake/bolt2.ms2", "start": 8005946, "end": 8006466, "audio": 0}, {"filename": "/hl/id1/glquake/bolt3.ms2", "start": 8006466, "end": 8006986, "audio": 0}, {"filename": "/hl/id1/glquake/boss.ms2", "start": 8006986, "end": 8017914, "audio": 0}, {"filename": "/hl/id1/glquake/b_g_key.ms2", "start": 8017914, "end": 8018486, "audio": 0}, {"filename": "/hl/id1/glquake/demon.ms2", "start": 8018486, "end": 8023870, "audio": 0}, {"filename": "/hl/id1/glquake/dog.ms2", "start": 8023870, "end": 8032718, "audio": 0}, {"filename": "/hl/id1/glquake/end1.ms2", "start": 8032718, "end": 8034146, "audio": 0}, {"filename": "/hl/id1/glquake/enforcer.ms2", "start": 8034146, "end": 8042942, "audio": 0}, {"filename": "/hl/id1/glquake/eyes.ms2", "start": 8042942, "end": 8043258, "audio": 0}, {"filename": "/hl/id1/glquake/flame.ms2", "start": 8043258, "end": 8045798, "audio": 0}, {"filename": "/hl/id1/glquake/flame2.ms2", "start": 8045798, "end": 8047598, "audio": 0}, {"filename": "/hl/id1/glquake/gib1.ms2", "start": 8047598, "end": 8048198, "audio": 0}, {"filename": "/hl/id1/glquake/gib2.ms2", "start": 8048198, "end": 8049978, "audio": 0}, {"filename": "/hl/id1/glquake/gib3.ms2", "start": 8049978, "end": 8050398, "audio": 0}, {"filename": "/hl/id1/glquake/grenade.ms2", "start": 8050398, "end": 8050718, "audio": 0}, {"filename": "/hl/id1/glquake/g_light.ms2", "start": 8050718, "end": 8055626, "audio": 0}, {"filename": "/hl/id1/glquake/g_nail.ms2", "start": 8055626, "end": 8060374, "audio": 0}, {"filename": "/hl/id1/glquake/g_nail2.ms2", "start": 8060374, "end": 8065462, "audio": 0}, {"filename": "/hl/id1/glquake/g_rock.ms2", "start": 8065462, "end": 8069210, "audio": 0}, {"filename": "/hl/id1/glquake/g_rock2.ms2", "start": 8069210, "end": 8072958, "audio": 0}, {"filename": "/hl/id1/glquake/g_shot.ms2", "start": 8072958, "end": 8074706, "audio": 0}, {"filename": "/hl/id1/glquake/h_demon.ms2", "start": 8074706, "end": 8076382, "audio": 0}, {"filename": "/hl/id1/glquake/h_dog.ms2", "start": 8076382, "end": 8078206, "audio": 0}, {"filename": "/hl/id1/glquake/h_guard.ms2", "start": 8078206, "end": 8079006, "audio": 0}, {"filename": "/hl/id1/glquake/h_knight.ms2", "start": 8079006, "end": 8079626, "audio": 0}, {"filename": "/hl/id1/glquake/h_mega.ms2", "start": 8079626, "end": 8080842, "audio": 0}, {"filename": "/hl/id1/glquake/h_ogre.ms2", "start": 8080842, "end": 8081574, "audio": 0}, {"filename": "/hl/id1/glquake/h_player.ms2", "start": 8081574, "end": 8082402, "audio": 0}, {"filename": "/hl/id1/glquake/h_shams.ms2", "start": 8082402, "end": 8083646, "audio": 0}, {"filename": "/hl/id1/glquake/h_wizard.ms2", "start": 8083646, "end": 8084190, "audio": 0}, {"filename": "/hl/id1/glquake/h_zombie.ms2", "start": 8084190, "end": 8085126, "audio": 0}, {"filename": "/hl/id1/glquake/invisibl.ms2", "start": 8085126, "end": 8086042, "audio": 0}, {"filename": "/hl/id1/glquake/invulner.ms2", "start": 8086042, "end": 8088518, "audio": 0}, {"filename": "/hl/id1/glquake/knight.ms2", "start": 8088518, "end": 8092682, "audio": 0}, {"filename": "/hl/id1/glquake/laser.ms2", "start": 8092682, "end": 8092922, "audio": 0}, {"filename": "/hl/id1/glquake/lavaball.ms2", "start": 8092922, "end": 8093342, "audio": 0}, {"filename": "/hl/id1/glquake/missile.ms2", "start": 8093342, "end": 8094638, "audio": 0}, {"filename": "/hl/id1/glquake/m_g_key.ms2", "start": 8094638, "end": 8096734, "audio": 0}, {"filename": "/hl/id1/glquake/m_s_key.ms2", "start": 8096734, "end": 8098830, "audio": 0}, {"filename": "/hl/id1/glquake/ogre.ms2", "start": 8098830, "end": 8105022, "audio": 0}, {"filename": "/hl/id1/glquake/player.ms2", "start": 8105022, "end": 8113010, "audio": 0}, {"filename": "/hl/id1/glquake/quaddama.ms2", "start": 8113010, "end": 8115078, "audio": 0}, {"filename": "/hl/id1/glquake/shambler.ms2", "start": 8115078, "end": 8120598, "audio": 0}, {"filename": "/hl/id1/glquake/soldier.ms2", "start": 8120598, "end": 8127094, "audio": 0}, {"filename": "/hl/id1/glquake/spike.ms2", "start": 8127094, "end": 8127210, "audio": 0}, {"filename": "/hl/id1/glquake/suit.ms2", "start": 8127210, "end": 8133418, "audio": 0}, {"filename": "/hl/id1/glquake/s_light.ms2", "start": 8133418, "end": 8134502, "audio": 0}, {"filename": "/hl/id1/glquake/s_spike.ms2", "start": 8134502, "end": 8134618, "audio": 0}, {"filename": "/hl/id1/glquake/v_axe.ms2", "start": 8134618, "end": 8138294, "audio": 0}, {"filename": "/hl/id1/glquake/v_light.ms2", "start": 8138294, "end": 8141910, "audio": 0}, {"filename": "/hl/id1/glquake/v_nail.ms2", "start": 8141910, "end": 8145914, "audio": 0}, {"filename": "/hl/id1/glquake/v_nail2.ms2", "start": 8145914, "end": 8149774, "audio": 0}, {"filename": "/hl/id1/glquake/v_rock.ms2", "start": 8149774, "end": 8150882, "audio": 0}, {"filename": "/hl/id1/glquake/v_rock2.ms2", "start": 8150882, "end": 8153502, "audio": 0}, {"filename": "/hl/id1/glquake/v_shot.ms2", "start": 8153502, "end": 8155918, "audio": 0}, {"filename": "/hl/id1/glquake/v_shot2.ms2", "start": 8155918, "end": 8159126, "audio": 0}, {"filename": "/hl/id1/glquake/wizard.ms2", "start": 8159126, "end": 8162226, "audio": 0}, {"filename": "/hl/id1/glquake/w_g_key.ms2", "start": 8162226, "end": 8164722, "audio": 0}, {"filename": "/hl/id1/glquake/w_spike.ms2", "start": 8164722, "end": 8166658, "audio": 0}, {"filename": "/hl/id1/glquake/w_s_key.ms2", "start": 8166658, "end": 8169154, "audio": 0}, {"filename": "/hl/id1/glquake/zombie.ms2", "start": 8169154, "end": 8176298, "audio": 0}, {"filename": "/hl/id1/glquake/zom_gib.ms2", "start": 8176298, "end": 8176718, "audio": 0}, {"filename": "/hl/id1/maps/b_batt0.bsp", "start": 8176718, "end": 8181762, "audio": 0}, {"filename": "/hl/id1/maps/b_batt1.bsp", "start": 8181762, "end": 8186382, "audio": 0}, {"filename": "/hl/id1/maps/b_bh10.bsp", "start": 8186382, "end": 8190318, "audio": 0}, {"filename": "/hl/id1/maps/b_bh100.bsp", "start": 8190318, "end": 8199138, "audio": 0}, {"filename": "/hl/id1/maps/b_bh25.bsp", "start": 8199138, "end": 8208010, "audio": 0}, {"filename": "/hl/id1/maps/b_explob.bsp", "start": 8208010, "end": 8218230, "audio": 0}, {"filename": "/hl/id1/maps/b_nail0.bsp", "start": 8218230, "end": 8223274, "audio": 0}, {"filename": "/hl/id1/maps/b_nail1.bsp", "start": 8223274, "end": 8228318, "audio": 0}, {"filename": "/hl/id1/maps/b_rock0.bsp", "start": 8228318, "end": 8231274, "audio": 0}, {"filename": "/hl/id1/maps/b_rock1.bsp", "start": 8231274, "end": 8234218, "audio": 0}, {"filename": "/hl/id1/maps/b_shell0.bsp", "start": 8234218, "end": 8239262, "audio": 0}, {"filename": "/hl/id1/maps/b_shell1.bsp", "start": 8239262, "end": 8244306, "audio": 0}, {"filename": "/hl/id1/maps/e1m1.bsp", "start": 8244306, "end": 9609482, "audio": 0}, {"filename": "/hl/id1/maps/e1m2.bsp", "start": 9609482, "end": 10941710, "audio": 0}, {"filename": "/hl/id1/maps/e1m3.bsp", "start": 10941710, "end": 12191654, "audio": 0}, {"filename": "/hl/id1/maps/e1m4.bsp", "start": 12191654, "end": 13603106, "audio": 0}, {"filename": "/hl/id1/maps/e1m5.bsp", "start": 13603106, "end": 14927166, "audio": 0}, {"filename": "/hl/id1/maps/e1m6.bsp", "start": 14927166, "end": 15992246, "audio": 0}, {"filename": "/hl/id1/maps/e1m7.bsp", "start": 15992246, "end": 16599666, "audio": 0}, {"filename": "/hl/id1/maps/e1m8.bsp", "start": 16599666, "end": 17523782, "audio": 0}, {"filename": "/hl/id1/maps/start.bsp", "start": 17523782, "end": 18957574, "audio": 0}, {"filename": "/hl/id1/progs/armor.mdl", "start": 18957574, "end": 19001650, "audio": 0}, {"filename": "/hl/id1/progs/backpack.mdl", "start": 19001650, "end": 19020998, "audio": 0}, {"filename": "/hl/id1/progs/bolt.mdl", "start": 19020998, "end": 19041642, "audio": 0}, {"filename": "/hl/id1/progs/bolt2.mdl", "start": 19041642, "end": 19053502, "audio": 0}, {"filename": "/hl/id1/progs/bolt3.mdl", "start": 19053502, "end": 19065362, "audio": 0}, {"filename": "/hl/id1/progs/boss.mdl", "start": 19065362, "end": 19277198, "audio": 0}, {"filename": "/hl/id1/progs/demon.mdl", "start": 19277198, "end": 19379318, "audio": 0}, {"filename": "/hl/id1/progs/dog.mdl", "start": 19379318, "end": 19525374, "audio": 0}, {"filename": "/hl/id1/progs/end1.mdl", "start": 19525374, "end": 19546194, "audio": 0}, {"filename": "/hl/id1/progs/eyes.mdl", "start": 19546194, "end": 19550566, "audio": 0}, {"filename": "/hl/id1/progs/flame.mdl", "start": 19550566, "end": 19596930, "audio": 0}, {"filename": "/hl/id1/progs/flame2.mdl", "start": 19596930, "end": 19661502, "audio": 0}, {"filename": "/hl/id1/progs/gib1.mdl", "start": 19661502, "end": 19667218, "audio": 0}, {"filename": "/hl/id1/progs/gib2.mdl", "start": 19667218, "end": 19683446, "audio": 0}, {"filename": "/hl/id1/progs/gib3.mdl", "start": 19683446, "end": 19705674, "audio": 0}, {"filename": "/hl/id1/progs/grenade.mdl", "start": 19705674, "end": 19707918, "audio": 0}, {"filename": "/hl/id1/progs/g_light.mdl", "start": 19707918, "end": 19758194, "audio": 0}, {"filename": "/hl/id1/progs/g_nail.mdl", "start": 19758194, "end": 19792894, "audio": 0}, {"filename": "/hl/id1/progs/g_nail2.mdl", "start": 19792894, "end": 19823614, "audio": 0}, {"filename": "/hl/id1/progs/g_rock.mdl", "start": 19823614, "end": 19871858, "audio": 0}, {"filename": "/hl/id1/progs/g_rock2.mdl", "start": 19871858, "end": 19912614, "audio": 0}, {"filename": "/hl/id1/progs/g_shot.mdl", "start": 19912614, "end": 19945530, "audio": 0}, {"filename": "/hl/id1/progs/h_demon.mdl", "start": 19945530, "end": 19980414, "audio": 0}, {"filename": "/hl/id1/progs/h_dog.mdl", "start": 19980414, "end": 20004850, "audio": 0}, {"filename": "/hl/id1/progs/h_guard.mdl", "start": 20004850, "end": 20010278, "audio": 0}, {"filename": "/hl/id1/progs/h_knight.mdl", "start": 20010278, "end": 20017434, "audio": 0}, {"filename": "/hl/id1/progs/h_ogre.mdl", "start": 20017434, "end": 20032334, "audio": 0}, {"filename": "/hl/id1/progs/h_player.mdl", "start": 20032334, "end": 20047042, "audio": 0}, {"filename": "/hl/id1/progs/h_shams.mdl", "start": 20047042, "end": 20084102, "audio": 0}, {"filename": "/hl/id1/progs/h_wizard.mdl", "start": 20084102, "end": 20098906, "audio": 0}, {"filename": "/hl/id1/progs/h_zombie.mdl", "start": 20098906, "end": 20103390, "audio": 0}, {"filename": "/hl/id1/progs/invisibl.mdl", "start": 20103390, "end": 20110482, "audio": 0}, {"filename": "/hl/id1/progs/invulner.mdl", "start": 20110482, "end": 20134402, "audio": 0}, {"filename": "/hl/id1/progs/knight.mdl", "start": 20134402, "end": 20235806, "audio": 0}, {"filename": "/hl/id1/progs/lavaball.mdl", "start": 20235806, "end": 20244594, "audio": 0}, {"filename": "/hl/id1/progs/missile.mdl", "start": 20244594, "end": 20302390, "audio": 0}, {"filename": "/hl/id1/progs/m_g_key.mdl", "start": 20302390, "end": 20315210, "audio": 0}, {"filename": "/hl/id1/progs/m_s_key.mdl", "start": 20315210, "end": 20328030, "audio": 0}, {"filename": "/hl/id1/progs/ogre.mdl", "start": 20328030, "end": 20490066, "audio": 0}, {"filename": "/hl/id1/progs/player.mdl", "start": 20490066, "end": 20681918, "audio": 0}, {"filename": "/hl/id1/progs/quaddama.mdl", "start": 20681918, "end": 20721910, "audio": 0}, {"filename": "/hl/id1/progs/shambler.mdl", "start": 20721910, "end": 20820466, "audio": 0}, {"filename": "/hl/id1/progs/soldier.mdl", "start": 20820466, "end": 20966754, "audio": 0}, {"filename": "/hl/id1/progs/spike.mdl", "start": 20966754, "end": 20968438, "audio": 0}, {"filename": "/hl/id1/progs/suit.mdl", "start": 20968438, "end": 21019674, "audio": 0}, {"filename": "/hl/id1/progs/s_bubble.spr", "start": 21019674, "end": 21020262, "audio": 0}, {"filename": "/hl/id1/progs/s_explod.spr", "start": 21020262, "end": 21039234, "audio": 0}, {"filename": "/hl/id1/progs/s_light.mdl", "start": 21039234, "end": 21066830, "audio": 0}, {"filename": "/hl/id1/progs/s_light.spr", "start": 21066830, "end": 21067910, "audio": 0}, {"filename": "/hl/id1/progs/s_spike.mdl", "start": 21067910, "end": 21069594, "audio": 0}, {"filename": "/hl/id1/progs/v_axe.mdl", "start": 21069594, "end": 21127502, "audio": 0}, {"filename": "/hl/id1/progs/v_light.mdl", "start": 21127502, "end": 21183706, "audio": 0}, {"filename": "/hl/id1/progs/v_nail.mdl", "start": 21183706, "end": 21238178, "audio": 0}, {"filename": "/hl/id1/progs/v_nail2.mdl", "start": 21238178, "end": 21306910, "audio": 0}, {"filename": "/hl/id1/progs/v_rock.mdl", "start": 21306910, "end": 21365458, "audio": 0}, {"filename": "/hl/id1/progs/v_rock2.mdl", "start": 21365458, "end": 21423646, "audio": 0}, {"filename": "/hl/id1/progs/v_shot.mdl", "start": 21423646, "end": 21467498, "audio": 0}, {"filename": "/hl/id1/progs/v_shot2.mdl", "start": 21467498, "end": 21518314, "audio": 0}, {"filename": "/hl/id1/progs/wizard.mdl", "start": 21518314, "end": 21582786, "audio": 0}, {"filename": "/hl/id1/progs/w_g_key.mdl", "start": 21582786, "end": 21590038, "audio": 0}, {"filename": "/hl/id1/progs/w_spike.mdl", "start": 21590038, "end": 21604374, "audio": 0}, {"filename": "/hl/id1/progs/w_s_key.mdl", "start": 21604374, "end": 21611626, "audio": 0}, {"filename": "/hl/id1/progs/zombie.mdl", "start": 21611626, "end": 21797710, "audio": 0}, {"filename": "/hl/id1/progs/zom_gib.mdl", "start": 21797710, "end": 21807906, "audio": 0}, {"filename": "/hl/id1/sound/ambience/buzz1.wav", "start": 21807906, "end": 21844214, "audio": 1}, {"filename": "/hl/id1/sound/ambience/comp1.wav", "start": 21844214, "end": 21906948, "audio": 1}, {"filename": "/hl/id1/sound/ambience/drip1.wav", "start": 21906948, "end": 22044684, "audio": 1}, {"filename": "/hl/id1/sound/ambience/drone6.wav", "start": 22044684, "end": 22063206, "audio": 1}, {"filename": "/hl/id1/sound/ambience/fire1.wav", "start": 22063206, "end": 22087270, "audio": 1}, {"filename": "/hl/id1/sound/ambience/fl_hum1.wav", "start": 22087270, "end": 22137424, "audio": 1}, {"filename": "/hl/id1/sound/ambience/hum1.wav", "start": 22137424, "end": 22177590, "audio": 1}, {"filename": "/hl/id1/sound/ambience/suck1.wav", "start": 22177590, "end": 22287982, "audio": 1}, {"filename": "/hl/id1/sound/ambience/swamp1.wav", "start": 22287982, "end": 22356506, "audio": 1}, {"filename": "/hl/id1/sound/ambience/swamp2.wav", "start": 22356506, "end": 22425032, "audio": 1}, {"filename": "/hl/id1/sound/ambience/thunder1.wav", "start": 22425032, "end": 22466524, "audio": 1}, {"filename": "/hl/id1/sound/ambience/water1.wav", "start": 22466524, "end": 22522308, "audio": 1}, {"filename": "/hl/id1/sound/ambience/wind2.wav", "start": 22522308, "end": 22550918, "audio": 1}, {"filename": "/hl/id1/sound/ambience/windfly.wav", "start": 22550918, "end": 22573058, "audio": 1}, {"filename": "/hl/id1/sound/boss1/death.wav", "start": 22573058, "end": 22600658, "audio": 1}, {"filename": "/hl/id1/sound/boss1/out1.wav", "start": 22600658, "end": 22651002, "audio": 1}, {"filename": "/hl/id1/sound/boss1/pain.wav", "start": 22651002, "end": 22668702, "audio": 1}, {"filename": "/hl/id1/sound/boss1/sight1.wav", "start": 22668702, "end": 22693470, "audio": 1}, {"filename": "/hl/id1/sound/boss1/throw.wav", "start": 22693470, "end": 22704996, "audio": 1}, {"filename": "/hl/id1/sound/buttons/airbut1.wav", "start": 22704996, "end": 22715668, "audio": 1}, {"filename": "/hl/id1/sound/buttons/switch02.wav", "start": 22715668, "end": 22719414, "audio": 1}, {"filename": "/hl/id1/sound/buttons/switch04.wav", "start": 22719414, "end": 22723080, "audio": 1}, {"filename": "/hl/id1/sound/buttons/switch21.wav", "start": 22723080, "end": 22729398, "audio": 1}, {"filename": "/hl/id1/sound/demon/ddeath.wav", "start": 22729398, "end": 22738538, "audio": 1}, {"filename": "/hl/id1/sound/demon/dhit2.wav", "start": 22738538, "end": 22745680, "audio": 1}, {"filename": "/hl/id1/sound/demon/djump.wav", "start": 22745680, "end": 22754174, "audio": 1}, {"filename": "/hl/id1/sound/demon/dland2.wav", "start": 22754174, "end": 22758574, "audio": 1}, {"filename": "/hl/id1/sound/demon/dpain1.wav", "start": 22758574, "end": 22764856, "audio": 1}, {"filename": "/hl/id1/sound/demon/idle1.wav", "start": 22764856, "end": 22773954, "audio": 1}, {"filename": "/hl/id1/sound/demon/sight2.wav", "start": 22773954, "end": 22782758, "audio": 1}, {"filename": "/hl/id1/sound/dog/dattack1.wav", "start": 22782758, "end": 22790912, "audio": 1}, {"filename": "/hl/id1/sound/dog/ddeath.wav", "start": 22790912, "end": 22805824, "audio": 1}, {"filename": "/hl/id1/sound/dog/dpain1.wav", "start": 22805824, "end": 22813064, "audio": 1}, {"filename": "/hl/id1/sound/dog/dsight.wav", "start": 22813064, "end": 22819786, "audio": 1}, {"filename": "/hl/id1/sound/dog/idle.wav", "start": 22819786, "end": 22826656, "audio": 1}, {"filename": "/hl/id1/sound/doors/airdoor1.wav", "start": 22826656, "end": 22840310, "audio": 1}, {"filename": "/hl/id1/sound/doors/airdoor2.wav", "start": 22840310, "end": 22848904, "audio": 1}, {"filename": "/hl/id1/sound/doors/basesec1.wav", "start": 22848904, "end": 22862834, "audio": 1}, {"filename": "/hl/id1/sound/doors/basesec2.wav", "start": 22862834, "end": 22873072, "audio": 1}, {"filename": "/hl/id1/sound/doors/basetry.wav", "start": 22873072, "end": 22883590, "audio": 1}, {"filename": "/hl/id1/sound/doors/baseuse.wav", "start": 22883590, "end": 22900076, "audio": 1}, {"filename": "/hl/id1/sound/doors/ddoor1.wav", "start": 22900076, "end": 22907814, "audio": 1}, {"filename": "/hl/id1/sound/doors/ddoor2.wav", "start": 22907814, "end": 22913718, "audio": 1}, {"filename": "/hl/id1/sound/doors/doormv1.wav", "start": 22913718, "end": 22927754, "audio": 1}, {"filename": "/hl/id1/sound/doors/drclos4.wav", "start": 22927754, "end": 22940568, "audio": 1}, {"filename": "/hl/id1/sound/doors/hydro1.wav", "start": 22940568, "end": 22951662, "audio": 1}, {"filename": "/hl/id1/sound/doors/hydro2.wav", "start": 22951662, "end": 22962362, "audio": 1}, {"filename": "/hl/id1/sound/doors/latch2.wav", "start": 22962362, "end": 22969700, "audio": 1}, {"filename": "/hl/id1/sound/doors/medtry.wav", "start": 22969700, "end": 22977528, "audio": 1}, {"filename": "/hl/id1/sound/doors/meduse.wav", "start": 22977528, "end": 22988246, "audio": 1}, {"filename": "/hl/id1/sound/doors/runetry.wav", "start": 22988246, "end": 23001770, "audio": 1}, {"filename": "/hl/id1/sound/doors/runeuse.wav", "start": 23001770, "end": 23019134, "audio": 1}, {"filename": "/hl/id1/sound/doors/stndr1.wav", "start": 23019134, "end": 23031754, "audio": 1}, {"filename": "/hl/id1/sound/doors/stndr2.wav", "start": 23031754, "end": 23043224, "audio": 1}, {"filename": "/hl/id1/sound/doors/winch2.wav", "start": 23043224, "end": 23058096, "audio": 1}, {"filename": "/hl/id1/sound/hknight/hit.wav", "start": 23058096, "end": 23064356, "audio": 1}, {"filename": "/hl/id1/sound/items/armor1.wav", "start": 23064356, "end": 23072070, "audio": 1}, {"filename": "/hl/id1/sound/items/damage.wav", "start": 23072070, "end": 23095444, "audio": 1}, {"filename": "/hl/id1/sound/items/damage2.wav", "start": 23095444, "end": 23128456, "audio": 1}, {"filename": "/hl/id1/sound/items/damage3.wav", "start": 23128456, "end": 23141350, "audio": 1}, {"filename": "/hl/id1/sound/items/health1.wav", "start": 23141350, "end": 23149308, "audio": 1}, {"filename": "/hl/id1/sound/items/inv1.wav", "start": 23149308, "end": 23163036, "audio": 1}, {"filename": "/hl/id1/sound/items/inv2.wav", "start": 23163036, "end": 23196252, "audio": 1}, {"filename": "/hl/id1/sound/items/inv3.wav", "start": 23196252, "end": 23229572, "audio": 1}, {"filename": "/hl/id1/sound/items/itembk2.wav", "start": 23229572, "end": 23239482, "audio": 1}, {"filename": "/hl/id1/sound/items/protect.wav", "start": 23239482, "end": 23262018, "audio": 1}, {"filename": "/hl/id1/sound/items/protect2.wav", "start": 23262018, "end": 23296030, "audio": 1}, {"filename": "/hl/id1/sound/items/protect3.wav", "start": 23296030, "end": 23319394, "audio": 1}, {"filename": "/hl/id1/sound/items/r_item1.wav", "start": 23319394, "end": 23326216, "audio": 1}, {"filename": "/hl/id1/sound/items/r_item2.wav", "start": 23326216, "end": 23333664, "audio": 1}, {"filename": "/hl/id1/sound/items/suit.wav", "start": 23333664, "end": 23349518, "audio": 1}, {"filename": "/hl/id1/sound/items/suit2.wav", "start": 23349518, "end": 23382772, "audio": 1}, {"filename": "/hl/id1/sound/knight/idle.wav", "start": 23382772, "end": 23393836, "audio": 1}, {"filename": "/hl/id1/sound/knight/kdeath.wav", "start": 23393836, "end": 23404524, "audio": 1}, {"filename": "/hl/id1/sound/knight/khurt.wav", "start": 23404524, "end": 23410110, "audio": 1}, {"filename": "/hl/id1/sound/knight/ksight.wav", "start": 23410110, "end": 23423624, "audio": 1}, {"filename": "/hl/id1/sound/knight/sword1.wav", "start": 23423624, "end": 23425930, "audio": 1}, {"filename": "/hl/id1/sound/knight/sword2.wav", "start": 23425930, "end": 23428714, "audio": 1}, {"filename": "/hl/id1/sound/misc/h2ohit1.wav", "start": 23428714, "end": 23441686, "audio": 1}, {"filename": "/hl/id1/sound/misc/medkey.wav", "start": 23441686, "end": 23451706, "audio": 1}, {"filename": "/hl/id1/sound/misc/menu1.wav", "start": 23451706, "end": 23457444, "audio": 1}, {"filename": "/hl/id1/sound/misc/menu2.wav", "start": 23457444, "end": 23468116, "audio": 1}, {"filename": "/hl/id1/sound/misc/menu3.wav", "start": 23468116, "end": 23471126, "audio": 1}, {"filename": "/hl/id1/sound/misc/null.wav", "start": 23471126, "end": 23472370, "audio": 1}, {"filename": "/hl/id1/sound/misc/outwater.wav", "start": 23472370, "end": 23477388, "audio": 1}, {"filename": "/hl/id1/sound/misc/power.wav", "start": 23477388, "end": 23497220, "audio": 1}, {"filename": "/hl/id1/sound/misc/runekey.wav", "start": 23497220, "end": 23511798, "audio": 1}, {"filename": "/hl/id1/sound/misc/r_tele1.wav", "start": 23511798, "end": 23519834, "audio": 1}, {"filename": "/hl/id1/sound/misc/r_tele2.wav", "start": 23519834, "end": 23537158, "audio": 1}, {"filename": "/hl/id1/sound/misc/r_tele3.wav", "start": 23537158, "end": 23555174, "audio": 1}, {"filename": "/hl/id1/sound/misc/r_tele4.wav", "start": 23555174, "end": 23564242, "audio": 1}, {"filename": "/hl/id1/sound/misc/r_tele5.wav", "start": 23564242, "end": 23586284, "audio": 1}, {"filename": "/hl/id1/sound/misc/secret.wav", "start": 23586284, "end": 23592894, "audio": 1}, {"filename": "/hl/id1/sound/misc/talk.wav", "start": 23592894, "end": 23594704, "audio": 1}, {"filename": "/hl/id1/sound/misc/trigger1.wav", "start": 23594704, "end": 23614934, "audio": 1}, {"filename": "/hl/id1/sound/misc/water1.wav", "start": 23614934, "end": 23618860, "audio": 1}, {"filename": "/hl/id1/sound/misc/water2.wav", "start": 23618860, "end": 23622200, "audio": 1}, {"filename": "/hl/id1/sound/ogre/ogdrag.wav", "start": 23622200, "end": 23634596, "audio": 1}, {"filename": "/hl/id1/sound/ogre/ogdth.wav", "start": 23634596, "end": 23648488, "audio": 1}, {"filename": "/hl/id1/sound/ogre/ogidle.wav", "start": 23648488, "end": 23661382, "audio": 1}, {"filename": "/hl/id1/sound/ogre/ogidle2.wav", "start": 23661382, "end": 23672636, "audio": 1}, {"filename": "/hl/id1/sound/ogre/ogpain1.wav", "start": 23672636, "end": 23680534, "audio": 1}, {"filename": "/hl/id1/sound/ogre/ogsawatk.wav", "start": 23680534, "end": 23696688, "audio": 1}, {"filename": "/hl/id1/sound/ogre/ogwake.wav", "start": 23696688, "end": 23716044, "audio": 1}, {"filename": "/hl/id1/sound/plats/medplat1.wav", "start": 23716044, "end": 23732422, "audio": 1}, {"filename": "/hl/id1/sound/plats/medplat2.wav", "start": 23732422, "end": 23739760, "audio": 1}, {"filename": "/hl/id1/sound/plats/plat1.wav", "start": 23739760, "end": 23760008, "audio": 1}, {"filename": "/hl/id1/sound/plats/plat2.wav", "start": 23760008, "end": 23767346, "audio": 1}, {"filename": "/hl/id1/sound/plats/train1.wav", "start": 23767346, "end": 23788776, "audio": 1}, {"filename": "/hl/id1/sound/plats/train2.wav", "start": 23788776, "end": 23794646, "audio": 1}, {"filename": "/hl/id1/sound/player/axhit1.wav", "start": 23794646, "end": 23801552, "audio": 1}, {"filename": "/hl/id1/sound/player/axhit2.wav", "start": 23801552, "end": 23803986, "audio": 1}, {"filename": "/hl/id1/sound/player/death1.wav", "start": 23803986, "end": 23814156, "audio": 1}, {"filename": "/hl/id1/sound/player/death2.wav", "start": 23814156, "end": 23822182, "audio": 1}, {"filename": "/hl/id1/sound/player/death3.wav", "start": 23822182, "end": 23833100, "audio": 1}, {"filename": "/hl/id1/sound/player/death4.wav", "start": 23833100, "end": 23847226, "audio": 1}, {"filename": "/hl/id1/sound/player/death5.wav", "start": 23847226, "end": 23862172, "audio": 1}, {"filename": "/hl/id1/sound/player/drown1.wav", "start": 23862172, "end": 23871080, "audio": 1}, {"filename": "/hl/id1/sound/player/drown2.wav", "start": 23871080, "end": 23874194, "audio": 1}, {"filename": "/hl/id1/sound/player/gasp1.wav", "start": 23874194, "end": 23882896, "audio": 1}, {"filename": "/hl/id1/sound/player/gasp2.wav", "start": 23882896, "end": 23896030, "audio": 1}, {"filename": "/hl/id1/sound/player/gib.wav", "start": 23896030, "end": 23910454, "audio": 1}, {"filename": "/hl/id1/sound/player/h2odeath.wav", "start": 23910454, "end": 23928558, "audio": 1}, {"filename": "/hl/id1/sound/player/h2ojump.wav", "start": 23928558, "end": 23939996, "audio": 1}, {"filename": "/hl/id1/sound/player/inh2o.wav", "start": 23939996, "end": 23951336, "audio": 1}, {"filename": "/hl/id1/sound/player/inlava.wav", "start": 23951336, "end": 23962294, "audio": 1}, {"filename": "/hl/id1/sound/player/land.wav", "start": 23962294, "end": 23964728, "audio": 1}, {"filename": "/hl/id1/sound/player/land2.wav", "start": 23964728, "end": 23970932, "audio": 1}, {"filename": "/hl/id1/sound/player/lburn1.wav", "start": 23970932, "end": 23977614, "audio": 1}, {"filename": "/hl/id1/sound/player/lburn2.wav", "start": 23977614, "end": 23983690, "audio": 1}, {"filename": "/hl/id1/sound/player/pain1.wav", "start": 23983690, "end": 23987084, "audio": 1}, {"filename": "/hl/id1/sound/player/pain2.wav", "start": 23987084, "end": 23989794, "audio": 1}, {"filename": "/hl/id1/sound/player/pain3.wav", "start": 23989794, "end": 23994648, "audio": 1}, {"filename": "/hl/id1/sound/player/pain4.wav", "start": 23994648, "end": 23999488, "audio": 1}, {"filename": "/hl/id1/sound/player/pain5.wav", "start": 23999488, "end": 24007508, "audio": 1}, {"filename": "/hl/id1/sound/player/pain6.wav", "start": 24007508, "end": 24012970, "audio": 1}, {"filename": "/hl/id1/sound/player/plyrjmp8.wav", "start": 24012970, "end": 24016858, "audio": 1}, {"filename": "/hl/id1/sound/player/slimbrn2.wav", "start": 24016858, "end": 24029326, "audio": 1}, {"filename": "/hl/id1/sound/player/teledth1.wav", "start": 24029326, "end": 24043740, "audio": 1}, {"filename": "/hl/id1/sound/player/tornoff2.wav", "start": 24043740, "end": 24051466, "audio": 1}, {"filename": "/hl/id1/sound/player/udeath.wav", "start": 24051466, "end": 24067548, "audio": 1}, {"filename": "/hl/id1/sound/shambler/melee1.wav", "start": 24067548, "end": 24072266, "audio": 1}, {"filename": "/hl/id1/sound/shambler/melee2.wav", "start": 24072266, "end": 24078232, "audio": 1}, {"filename": "/hl/id1/sound/shambler/sattck1.wav", "start": 24078232, "end": 24086268, "audio": 1}, {"filename": "/hl/id1/sound/shambler/sboom.wav", "start": 24086268, "end": 24097940, "audio": 1}, {"filename": "/hl/id1/sound/shambler/sdeath.wav", "start": 24097940, "end": 24119046, "audio": 1}, {"filename": "/hl/id1/sound/shambler/shurt2.wav", "start": 24119046, "end": 24123348, "audio": 1}, {"filename": "/hl/id1/sound/shambler/sidle.wav", "start": 24123348, "end": 24128994, "audio": 1}, {"filename": "/hl/id1/sound/shambler/smack.wav", "start": 24128994, "end": 24134294, "audio": 1}, {"filename": "/hl/id1/sound/shambler/ssight.wav", "start": 24134294, "end": 24149714, "audio": 1}, {"filename": "/hl/id1/sound/soldier/death1.wav", "start": 24149714, "end": 24158148, "audio": 1}, {"filename": "/hl/id1/sound/soldier/idle.wav", "start": 24158148, "end": 24167950, "audio": 1}, {"filename": "/hl/id1/sound/soldier/pain1.wav", "start": 24167950, "end": 24172950, "audio": 1}, {"filename": "/hl/id1/sound/soldier/pain2.wav", "start": 24172950, "end": 24180788, "audio": 1}, {"filename": "/hl/id1/sound/soldier/sattck1.wav", "start": 24180788, "end": 24195090, "audio": 1}, {"filename": "/hl/id1/sound/soldier/sight1.wav", "start": 24195090, "end": 24207806, "audio": 1}, {"filename": "/hl/id1/sound/weapons/ax1.wav", "start": 24207806, "end": 24211114, "audio": 1}, {"filename": "/hl/id1/sound/weapons/bounce.wav", "start": 24211114, "end": 24216978, "audio": 1}, {"filename": "/hl/id1/sound/weapons/grenade.wav", "start": 24216978, "end": 24225342, "audio": 1}, {"filename": "/hl/id1/sound/weapons/guncock.wav", "start": 24225342, "end": 24239772, "audio": 1}, {"filename": "/hl/id1/sound/weapons/lhit.wav", "start": 24239772, "end": 24265800, "audio": 1}, {"filename": "/hl/id1/sound/weapons/lock4.wav", "start": 24265800, "end": 24269676, "audio": 1}, {"filename": "/hl/id1/sound/weapons/lstart.wav", "start": 24269676, "end": 24326054, "audio": 1}, {"filename": "/hl/id1/sound/weapons/pkup.wav", "start": 24326054, "end": 24331228, "audio": 1}, {"filename": "/hl/id1/sound/weapons/ric1.wav", "start": 24331228, "end": 24335536, "audio": 1}, {"filename": "/hl/id1/sound/weapons/ric2.wav", "start": 24335536, "end": 24346374, "audio": 1}, {"filename": "/hl/id1/sound/weapons/ric3.wav", "start": 24346374, "end": 24359012, "audio": 1}, {"filename": "/hl/id1/sound/weapons/rocket1i.wav", "start": 24359012, "end": 24368672, "audio": 1}, {"filename": "/hl/id1/sound/weapons/r_exp3.wav", "start": 24368672, "end": 24386150, "audio": 1}, {"filename": "/hl/id1/sound/weapons/sgun1.wav", "start": 24386150, "end": 24409142, "audio": 1}, {"filename": "/hl/id1/sound/weapons/shotgn2.wav", "start": 24409142, "end": 24417836, "audio": 1}, {"filename": "/hl/id1/sound/weapons/spike2.wav", "start": 24417836, "end": 24430478, "audio": 1}, {"filename": "/hl/id1/sound/weapons/tink1.wav", "start": 24430478, "end": 24431730, "audio": 1}, {"filename": "/hl/id1/sound/wizard/hit.wav", "start": 24431730, "end": 24439062, "audio": 1}, {"filename": "/hl/id1/sound/wizard/wattack.wav", "start": 24439062, "end": 24464974, "audio": 1}, {"filename": "/hl/id1/sound/wizard/wdeath.wav", "start": 24464974, "end": 24485658, "audio": 1}, {"filename": "/hl/id1/sound/wizard/widle1.wav", "start": 24485658, "end": 24499122, "audio": 1}, {"filename": "/hl/id1/sound/wizard/widle2.wav", "start": 24499122, "end": 24522216, "audio": 1}, {"filename": "/hl/id1/sound/wizard/wpain.wav", "start": 24522216, "end": 24530902, "audio": 1}, {"filename": "/hl/id1/sound/wizard/wsight.wav", "start": 24530902, "end": 24543980, "audio": 1}, {"filename": "/hl/id1/sound/zombie/idle_w2.wav", "start": 24543980, "end": 24561172, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_fall.wav", "start": 24561172, "end": 24564234, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_gib.wav", "start": 24564234, "end": 24580460, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_hit.wav", "start": 24580460, "end": 24586626, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_idle.wav", "start": 24586626, "end": 24603360, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_idle1.wav", "start": 24603360, "end": 24616604, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_miss.wav", "start": 24616604, "end": 24627338, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_pain.wav", "start": 24627338, "end": 24639556, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_pain1.wav", "start": 24639556, "end": 24654930, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_shot1.wav", "start": 24654930, "end": 24657998, "audio": 1}], "remote_package_size": 24657998, "package_uuid": "8bf0b244-6e8c-4486-9ac2-95d802900b78"});
  
  })();
  