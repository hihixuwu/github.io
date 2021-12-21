
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
   loadPackage({"files": [{"filename": "/hl/id1/config.cfg", "start": 0, "end": 1969, "audio": 0}, {"filename": "/hl/id1/default.cfg", "start": 1969, "end": 3883, "audio": 0}, {"filename": "/hl/id1/demo1.dem", "start": 3883, "end": 188354, "audio": 0}, {"filename": "/hl/id1/demo2.dem", "start": 188354, "end": 341059, "audio": 0}, {"filename": "/hl/id1/demo3.dem", "start": 341059, "end": 538738, "audio": 0}, {"filename": "/hl/id1/end1.bin", "start": 538738, "end": 542738, "audio": 0}, {"filename": "/hl/id1/gfx.wad", "start": 542738, "end": 655566, "audio": 0}, {"filename": "/hl/id1/progs.dat", "start": 655566, "end": 1068682, "audio": 0}, {"filename": "/hl/id1/quake.rc", "start": 1068682, "end": 1068895, "audio": 0}, {"filename": "/hl/id1/gfx/bigbox.lmp", "start": 1068895, "end": 1074087, "audio": 0}, {"filename": "/hl/id1/gfx/box_bl.lmp", "start": 1074087, "end": 1074159, "audio": 0}, {"filename": "/hl/id1/gfx/box_bm.lmp", "start": 1074159, "end": 1074295, "audio": 0}, {"filename": "/hl/id1/gfx/box_br.lmp", "start": 1074295, "end": 1074367, "audio": 0}, {"filename": "/hl/id1/gfx/box_ml.lmp", "start": 1074367, "end": 1074439, "audio": 0}, {"filename": "/hl/id1/gfx/box_mm.lmp", "start": 1074439, "end": 1074575, "audio": 0}, {"filename": "/hl/id1/gfx/box_mm2.lmp", "start": 1074575, "end": 1074711, "audio": 0}, {"filename": "/hl/id1/gfx/box_mr.lmp", "start": 1074711, "end": 1074783, "audio": 0}, {"filename": "/hl/id1/gfx/box_tl.lmp", "start": 1074783, "end": 1074855, "audio": 0}, {"filename": "/hl/id1/gfx/box_tm.lmp", "start": 1074855, "end": 1074991, "audio": 0}, {"filename": "/hl/id1/gfx/box_tr.lmp", "start": 1074991, "end": 1075063, "audio": 0}, {"filename": "/hl/id1/gfx/colormap.lmp", "start": 1075063, "end": 1091448, "audio": 0}, {"filename": "/hl/id1/gfx/complete.lmp", "start": 1091448, "end": 1096064, "audio": 0}, {"filename": "/hl/id1/gfx/conback.lmp", "start": 1096064, "end": 1160072, "audio": 0}, {"filename": "/hl/id1/gfx/dim_drct.lmp", "start": 1160072, "end": 1163424, "audio": 0}, {"filename": "/hl/id1/gfx/dim_ipx.lmp", "start": 1163424, "end": 1166776, "audio": 0}, {"filename": "/hl/id1/gfx/dim_modm.lmp", "start": 1166776, "end": 1170128, "audio": 0}, {"filename": "/hl/id1/gfx/dim_mult.lmp", "start": 1170128, "end": 1173480, "audio": 0}, {"filename": "/hl/id1/gfx/dim_tcp.lmp", "start": 1173480, "end": 1176832, "audio": 0}, {"filename": "/hl/id1/gfx/finale.lmp", "start": 1176832, "end": 1183752, "audio": 0}, {"filename": "/hl/id1/gfx/help0.lmp", "start": 1183752, "end": 1247760, "audio": 0}, {"filename": "/hl/id1/gfx/help1.lmp", "start": 1247760, "end": 1311768, "audio": 0}, {"filename": "/hl/id1/gfx/help2.lmp", "start": 1311768, "end": 1375776, "audio": 0}, {"filename": "/hl/id1/gfx/help3.lmp", "start": 1375776, "end": 1439784, "audio": 0}, {"filename": "/hl/id1/gfx/help4.lmp", "start": 1439784, "end": 1503792, "audio": 0}, {"filename": "/hl/id1/gfx/help5.lmp", "start": 1503792, "end": 1567800, "audio": 0}, {"filename": "/hl/id1/gfx/inter.lmp", "start": 1567800, "end": 1590848, "audio": 0}, {"filename": "/hl/id1/gfx/loading.lmp", "start": 1590848, "end": 1594312, "audio": 0}, {"filename": "/hl/id1/gfx/mainmenu.lmp", "start": 1594312, "end": 1621200, "audio": 0}, {"filename": "/hl/id1/gfx/menudot1.lmp", "start": 1621200, "end": 1621592, "audio": 0}, {"filename": "/hl/id1/gfx/menudot2.lmp", "start": 1621592, "end": 1621984, "audio": 0}, {"filename": "/hl/id1/gfx/menudot3.lmp", "start": 1621984, "end": 1622376, "audio": 0}, {"filename": "/hl/id1/gfx/menudot4.lmp", "start": 1622376, "end": 1622768, "audio": 0}, {"filename": "/hl/id1/gfx/menudot5.lmp", "start": 1622768, "end": 1623160, "audio": 0}, {"filename": "/hl/id1/gfx/menudot6.lmp", "start": 1623160, "end": 1623552, "audio": 0}, {"filename": "/hl/id1/gfx/menuplyr.lmp", "start": 1623552, "end": 1626248, "audio": 0}, {"filename": "/hl/id1/gfx/mp_menu.lmp", "start": 1626248, "end": 1641104, "audio": 0}, {"filename": "/hl/id1/gfx/netmen1.lmp", "start": 1641104, "end": 1644456, "audio": 0}, {"filename": "/hl/id1/gfx/netmen2.lmp", "start": 1644456, "end": 1647808, "audio": 0}, {"filename": "/hl/id1/gfx/netmen3.lmp", "start": 1647808, "end": 1651160, "audio": 0}, {"filename": "/hl/id1/gfx/netmen4.lmp", "start": 1651160, "end": 1654512, "audio": 0}, {"filename": "/hl/id1/gfx/netmen5.lmp", "start": 1654512, "end": 1657864, "audio": 0}, {"filename": "/hl/id1/gfx/palette.lmp", "start": 1657864, "end": 1658632, "audio": 0}, {"filename": "/hl/id1/gfx/pause.lmp", "start": 1658632, "end": 1661712, "audio": 0}, {"filename": "/hl/id1/gfx/p_load.lmp", "start": 1661712, "end": 1664216, "audio": 0}, {"filename": "/hl/id1/gfx/p_multi.lmp", "start": 1664216, "end": 1669408, "audio": 0}, {"filename": "/hl/id1/gfx/p_option.lmp", "start": 1669408, "end": 1672872, "audio": 0}, {"filename": "/hl/id1/gfx/p_save.lmp", "start": 1672872, "end": 1674992, "audio": 0}, {"filename": "/hl/id1/gfx/qplaque.lmp", "start": 1674992, "end": 1679608, "audio": 0}, {"filename": "/hl/id1/gfx/ranking.lmp", "start": 1679608, "end": 1683648, "audio": 0}, {"filename": "/hl/id1/gfx/sell.lmp", "start": 1683648, "end": 1747656, "audio": 0}, {"filename": "/hl/id1/gfx/sp_menu.lmp", "start": 1747656, "end": 1762512, "audio": 0}, {"filename": "/hl/id1/gfx/ttl_cstm.lmp", "start": 1762512, "end": 1766936, "audio": 0}, {"filename": "/hl/id1/gfx/ttl_main.lmp", "start": 1766936, "end": 1769248, "audio": 0}, {"filename": "/hl/id1/gfx/ttl_sgl.lmp", "start": 1769248, "end": 1772328, "audio": 0}, {"filename": "/hl/id1/gfx/vidmodes.lmp", "start": 1772328, "end": 1777520, "audio": 0}, {"filename": "/hl/id1/glquake/backpack.ms2", "start": 1777520, "end": 1779552, "audio": 0}, {"filename": "/hl/id1/glquake/bolt.ms2", "start": 1779552, "end": 1780240, "audio": 0}, {"filename": "/hl/id1/glquake/bolt2.ms2", "start": 1780240, "end": 1780760, "audio": 0}, {"filename": "/hl/id1/glquake/bolt3.ms2", "start": 1780760, "end": 1781280, "audio": 0}, {"filename": "/hl/id1/glquake/eyes.ms2", "start": 1781280, "end": 1781596, "audio": 0}, {"filename": "/hl/id1/glquake/flame.ms2", "start": 1781596, "end": 1784136, "audio": 0}, {"filename": "/hl/id1/glquake/flame2.ms2", "start": 1784136, "end": 1785936, "audio": 0}, {"filename": "/hl/id1/glquake/gib1.ms2", "start": 1785936, "end": 1786536, "audio": 0}, {"filename": "/hl/id1/glquake/gib2.ms2", "start": 1786536, "end": 1788316, "audio": 0}, {"filename": "/hl/id1/glquake/gib3.ms2", "start": 1788316, "end": 1788736, "audio": 0}, {"filename": "/hl/id1/glquake/grenade.ms2", "start": 1788736, "end": 1789056, "audio": 0}, {"filename": "/hl/id1/glquake/h_player.ms2", "start": 1789056, "end": 1789884, "audio": 0}, {"filename": "/hl/id1/glquake/h_zombie.ms2", "start": 1789884, "end": 1790820, "audio": 0}, {"filename": "/hl/id1/glquake/lavaball.ms2", "start": 1790820, "end": 1791240, "audio": 0}, {"filename": "/hl/id1/glquake/missile.ms2", "start": 1791240, "end": 1792536, "audio": 0}, {"filename": "/hl/id1/glquake/player.ms2", "start": 1792536, "end": 1800524, "audio": 0}, {"filename": "/hl/id1/glquake/spike.ms2", "start": 1800524, "end": 1800640, "audio": 0}, {"filename": "/hl/id1/glquake/s_spike.ms2", "start": 1800640, "end": 1800756, "audio": 0}, {"filename": "/hl/id1/glquake/v_axe.ms2", "start": 1800756, "end": 1804432, "audio": 0}, {"filename": "/hl/id1/glquake/v_light.ms2", "start": 1804432, "end": 1808048, "audio": 0}, {"filename": "/hl/id1/glquake/v_nail.ms2", "start": 1808048, "end": 1812052, "audio": 0}, {"filename": "/hl/id1/glquake/v_nail2.ms2", "start": 1812052, "end": 1815912, "audio": 0}, {"filename": "/hl/id1/glquake/v_rock.ms2", "start": 1815912, "end": 1817020, "audio": 0}, {"filename": "/hl/id1/glquake/v_rock2.ms2", "start": 1817020, "end": 1819640, "audio": 0}, {"filename": "/hl/id1/glquake/v_shot.ms2", "start": 1819640, "end": 1822056, "audio": 0}, {"filename": "/hl/id1/glquake/v_shot2.ms2", "start": 1822056, "end": 1825264, "audio": 0}, {"filename": "/hl/id1/glquake/zombie.ms2", "start": 1825264, "end": 1832408, "audio": 0}, {"filename": "/hl/id1/glquake/zom_gib.ms2", "start": 1832408, "end": 1832828, "audio": 0}, {"filename": "/hl/id1/maps/b_batt0.bsp", "start": 1832828, "end": 1837872, "audio": 0}, {"filename": "/hl/id1/maps/b_batt1.bsp", "start": 1837872, "end": 1842492, "audio": 0}, {"filename": "/hl/id1/maps/b_bh10.bsp", "start": 1842492, "end": 1846428, "audio": 0}, {"filename": "/hl/id1/maps/b_bh100.bsp", "start": 1846428, "end": 1855248, "audio": 0}, {"filename": "/hl/id1/maps/b_bh25.bsp", "start": 1855248, "end": 1864120, "audio": 0}, {"filename": "/hl/id1/maps/b_explob.bsp", "start": 1864120, "end": 1874340, "audio": 0}, {"filename": "/hl/id1/maps/b_nail0.bsp", "start": 1874340, "end": 1879384, "audio": 0}, {"filename": "/hl/id1/maps/b_nail1.bsp", "start": 1879384, "end": 1884428, "audio": 0}, {"filename": "/hl/id1/maps/b_rock0.bsp", "start": 1884428, "end": 1887384, "audio": 0}, {"filename": "/hl/id1/maps/b_rock1.bsp", "start": 1887384, "end": 1890328, "audio": 0}, {"filename": "/hl/id1/maps/b_shell0.bsp", "start": 1890328, "end": 1895372, "audio": 0}, {"filename": "/hl/id1/maps/b_shell1.bsp", "start": 1895372, "end": 1900416, "audio": 0}, {"filename": "/hl/id1/maps/e1m1.bsp", "start": 1900416, "end": 3265592, "audio": 0}, {"filename": "/hl/id1/maps/e1m2.bsp", "start": 3265592, "end": 4597820, "audio": 0}, {"filename": "/hl/id1/maps/e1m3.bsp", "start": 4597820, "end": 5847764, "audio": 0}, {"filename": "/hl/id1/maps/e1m4.bsp", "start": 5847764, "end": 7259216, "audio": 0}, {"filename": "/hl/id1/maps/e1m5.bsp", "start": 7259216, "end": 8583276, "audio": 0}, {"filename": "/hl/id1/maps/e1m6.bsp", "start": 8583276, "end": 9648356, "audio": 0}, {"filename": "/hl/id1/maps/e1m7.bsp", "start": 9648356, "end": 10255776, "audio": 0}, {"filename": "/hl/id1/maps/e1m8.bsp", "start": 10255776, "end": 11179892, "audio": 0}, {"filename": "/hl/id1/maps/start.bsp", "start": 11179892, "end": 12613684, "audio": 0}, {"filename": "/hl/id1/progs/armor.mdl", "start": 12613684, "end": 12657760, "audio": 0}, {"filename": "/hl/id1/progs/backpack.mdl", "start": 12657760, "end": 12677108, "audio": 0}, {"filename": "/hl/id1/progs/bolt.mdl", "start": 12677108, "end": 12697752, "audio": 0}, {"filename": "/hl/id1/progs/bolt2.mdl", "start": 12697752, "end": 12709612, "audio": 0}, {"filename": "/hl/id1/progs/bolt3.mdl", "start": 12709612, "end": 12721472, "audio": 0}, {"filename": "/hl/id1/progs/boss.mdl", "start": 12721472, "end": 12933308, "audio": 0}, {"filename": "/hl/id1/progs/demon.mdl", "start": 12933308, "end": 13035428, "audio": 0}, {"filename": "/hl/id1/progs/dog.mdl", "start": 13035428, "end": 13181484, "audio": 0}, {"filename": "/hl/id1/progs/end1.mdl", "start": 13181484, "end": 13202304, "audio": 0}, {"filename": "/hl/id1/progs/eyes.mdl", "start": 13202304, "end": 13206676, "audio": 0}, {"filename": "/hl/id1/progs/flame.mdl", "start": 13206676, "end": 13253040, "audio": 0}, {"filename": "/hl/id1/progs/flame2.mdl", "start": 13253040, "end": 13317612, "audio": 0}, {"filename": "/hl/id1/progs/gib1.mdl", "start": 13317612, "end": 13323328, "audio": 0}, {"filename": "/hl/id1/progs/gib2.mdl", "start": 13323328, "end": 13339556, "audio": 0}, {"filename": "/hl/id1/progs/gib3.mdl", "start": 13339556, "end": 13361784, "audio": 0}, {"filename": "/hl/id1/progs/grenade.mdl", "start": 13361784, "end": 13364028, "audio": 0}, {"filename": "/hl/id1/progs/g_light.mdl", "start": 13364028, "end": 13414304, "audio": 0}, {"filename": "/hl/id1/progs/g_nail.mdl", "start": 13414304, "end": 13449004, "audio": 0}, {"filename": "/hl/id1/progs/g_nail2.mdl", "start": 13449004, "end": 13479724, "audio": 0}, {"filename": "/hl/id1/progs/g_rock.mdl", "start": 13479724, "end": 13527968, "audio": 0}, {"filename": "/hl/id1/progs/g_rock2.mdl", "start": 13527968, "end": 13568724, "audio": 0}, {"filename": "/hl/id1/progs/g_shot.mdl", "start": 13568724, "end": 13601640, "audio": 0}, {"filename": "/hl/id1/progs/h_demon.mdl", "start": 13601640, "end": 13636524, "audio": 0}, {"filename": "/hl/id1/progs/h_dog.mdl", "start": 13636524, "end": 13660960, "audio": 0}, {"filename": "/hl/id1/progs/h_guard.mdl", "start": 13660960, "end": 13666388, "audio": 0}, {"filename": "/hl/id1/progs/h_knight.mdl", "start": 13666388, "end": 13673544, "audio": 0}, {"filename": "/hl/id1/progs/h_ogre.mdl", "start": 13673544, "end": 13688444, "audio": 0}, {"filename": "/hl/id1/progs/h_player.mdl", "start": 13688444, "end": 13703152, "audio": 0}, {"filename": "/hl/id1/progs/h_shams.mdl", "start": 13703152, "end": 13740212, "audio": 0}, {"filename": "/hl/id1/progs/h_wizard.mdl", "start": 13740212, "end": 13755016, "audio": 0}, {"filename": "/hl/id1/progs/h_zombie.mdl", "start": 13755016, "end": 13759500, "audio": 0}, {"filename": "/hl/id1/progs/invisibl.mdl", "start": 13759500, "end": 13766592, "audio": 0}, {"filename": "/hl/id1/progs/invulner.mdl", "start": 13766592, "end": 13790512, "audio": 0}, {"filename": "/hl/id1/progs/knight.mdl", "start": 13790512, "end": 13891916, "audio": 0}, {"filename": "/hl/id1/progs/lavaball.mdl", "start": 13891916, "end": 13900704, "audio": 0}, {"filename": "/hl/id1/progs/missile.mdl", "start": 13900704, "end": 13958500, "audio": 0}, {"filename": "/hl/id1/progs/m_g_key.mdl", "start": 13958500, "end": 13971320, "audio": 0}, {"filename": "/hl/id1/progs/m_s_key.mdl", "start": 13971320, "end": 13984140, "audio": 0}, {"filename": "/hl/id1/progs/ogre.mdl", "start": 13984140, "end": 14146176, "audio": 0}, {"filename": "/hl/id1/progs/player.mdl", "start": 14146176, "end": 14338028, "audio": 0}, {"filename": "/hl/id1/progs/quaddama.mdl", "start": 14338028, "end": 14378020, "audio": 0}, {"filename": "/hl/id1/progs/shambler.mdl", "start": 14378020, "end": 14476576, "audio": 0}, {"filename": "/hl/id1/progs/soldier.mdl", "start": 14476576, "end": 14622864, "audio": 0}, {"filename": "/hl/id1/progs/spike.mdl", "start": 14622864, "end": 14624548, "audio": 0}, {"filename": "/hl/id1/progs/suit.mdl", "start": 14624548, "end": 14675784, "audio": 0}, {"filename": "/hl/id1/progs/s_bubble.spr", "start": 14675784, "end": 14676372, "audio": 0}, {"filename": "/hl/id1/progs/s_explod.spr", "start": 14676372, "end": 14695344, "audio": 0}, {"filename": "/hl/id1/progs/s_light.mdl", "start": 14695344, "end": 14722940, "audio": 0}, {"filename": "/hl/id1/progs/s_light.spr", "start": 14722940, "end": 14724020, "audio": 0}, {"filename": "/hl/id1/progs/s_spike.mdl", "start": 14724020, "end": 14725704, "audio": 0}, {"filename": "/hl/id1/progs/v_axe.mdl", "start": 14725704, "end": 14783612, "audio": 0}, {"filename": "/hl/id1/progs/v_light.mdl", "start": 14783612, "end": 14839816, "audio": 0}, {"filename": "/hl/id1/progs/v_nail.mdl", "start": 14839816, "end": 14894288, "audio": 0}, {"filename": "/hl/id1/progs/v_nail2.mdl", "start": 14894288, "end": 14963020, "audio": 0}, {"filename": "/hl/id1/progs/v_rock.mdl", "start": 14963020, "end": 15021568, "audio": 0}, {"filename": "/hl/id1/progs/v_rock2.mdl", "start": 15021568, "end": 15079756, "audio": 0}, {"filename": "/hl/id1/progs/v_shot.mdl", "start": 15079756, "end": 15123608, "audio": 0}, {"filename": "/hl/id1/progs/v_shot2.mdl", "start": 15123608, "end": 15174424, "audio": 0}, {"filename": "/hl/id1/progs/wizard.mdl", "start": 15174424, "end": 15238896, "audio": 0}, {"filename": "/hl/id1/progs/w_g_key.mdl", "start": 15238896, "end": 15246148, "audio": 0}, {"filename": "/hl/id1/progs/w_spike.mdl", "start": 15246148, "end": 15260484, "audio": 0}, {"filename": "/hl/id1/progs/w_s_key.mdl", "start": 15260484, "end": 15267736, "audio": 0}, {"filename": "/hl/id1/progs/zombie.mdl", "start": 15267736, "end": 15453820, "audio": 0}, {"filename": "/hl/id1/progs/zom_gib.mdl", "start": 15453820, "end": 15464016, "audio": 0}, {"filename": "/hl/id1/sound/ambience/buzz1.wav", "start": 15464016, "end": 15500324, "audio": 1}, {"filename": "/hl/id1/sound/ambience/comp1.wav", "start": 15500324, "end": 15563058, "audio": 1}, {"filename": "/hl/id1/sound/ambience/drip1.wav", "start": 15563058, "end": 15700794, "audio": 1}, {"filename": "/hl/id1/sound/ambience/drone6.wav", "start": 15700794, "end": 15719316, "audio": 1}, {"filename": "/hl/id1/sound/ambience/fire1.wav", "start": 15719316, "end": 15743380, "audio": 1}, {"filename": "/hl/id1/sound/ambience/fl_hum1.wav", "start": 15743380, "end": 15793534, "audio": 1}, {"filename": "/hl/id1/sound/ambience/hum1.wav", "start": 15793534, "end": 15833700, "audio": 1}, {"filename": "/hl/id1/sound/ambience/suck1.wav", "start": 15833700, "end": 15944092, "audio": 1}, {"filename": "/hl/id1/sound/ambience/swamp1.wav", "start": 15944092, "end": 16012616, "audio": 1}, {"filename": "/hl/id1/sound/ambience/swamp2.wav", "start": 16012616, "end": 16081142, "audio": 1}, {"filename": "/hl/id1/sound/ambience/thunder1.wav", "start": 16081142, "end": 16122634, "audio": 1}, {"filename": "/hl/id1/sound/ambience/water1.wav", "start": 16122634, "end": 16178418, "audio": 1}, {"filename": "/hl/id1/sound/ambience/wind2.wav", "start": 16178418, "end": 16207028, "audio": 1}, {"filename": "/hl/id1/sound/ambience/windfly.wav", "start": 16207028, "end": 16229168, "audio": 1}, {"filename": "/hl/id1/sound/boss1/death.wav", "start": 16229168, "end": 16256768, "audio": 1}, {"filename": "/hl/id1/sound/boss1/out1.wav", "start": 16256768, "end": 16307112, "audio": 1}, {"filename": "/hl/id1/sound/boss1/pain.wav", "start": 16307112, "end": 16324812, "audio": 1}, {"filename": "/hl/id1/sound/boss1/sight1.wav", "start": 16324812, "end": 16349580, "audio": 1}, {"filename": "/hl/id1/sound/boss1/throw.wav", "start": 16349580, "end": 16361106, "audio": 1}, {"filename": "/hl/id1/sound/buttons/airbut1.wav", "start": 16361106, "end": 16371778, "audio": 1}, {"filename": "/hl/id1/sound/buttons/switch02.wav", "start": 16371778, "end": 16375524, "audio": 1}, {"filename": "/hl/id1/sound/buttons/switch04.wav", "start": 16375524, "end": 16379190, "audio": 1}, {"filename": "/hl/id1/sound/buttons/switch21.wav", "start": 16379190, "end": 16385508, "audio": 1}, {"filename": "/hl/id1/sound/demon/ddeath.wav", "start": 16385508, "end": 16394648, "audio": 1}, {"filename": "/hl/id1/sound/demon/dhit2.wav", "start": 16394648, "end": 16401790, "audio": 1}, {"filename": "/hl/id1/sound/demon/djump.wav", "start": 16401790, "end": 16410284, "audio": 1}, {"filename": "/hl/id1/sound/demon/dland2.wav", "start": 16410284, "end": 16414684, "audio": 1}, {"filename": "/hl/id1/sound/demon/dpain1.wav", "start": 16414684, "end": 16420966, "audio": 1}, {"filename": "/hl/id1/sound/demon/idle1.wav", "start": 16420966, "end": 16430064, "audio": 1}, {"filename": "/hl/id1/sound/demon/sight2.wav", "start": 16430064, "end": 16438868, "audio": 1}, {"filename": "/hl/id1/sound/dog/dattack1.wav", "start": 16438868, "end": 16447022, "audio": 1}, {"filename": "/hl/id1/sound/dog/ddeath.wav", "start": 16447022, "end": 16461934, "audio": 1}, {"filename": "/hl/id1/sound/dog/dpain1.wav", "start": 16461934, "end": 16469174, "audio": 1}, {"filename": "/hl/id1/sound/dog/dsight.wav", "start": 16469174, "end": 16475896, "audio": 1}, {"filename": "/hl/id1/sound/dog/idle.wav", "start": 16475896, "end": 16482766, "audio": 1}, {"filename": "/hl/id1/sound/doors/airdoor1.wav", "start": 16482766, "end": 16496420, "audio": 1}, {"filename": "/hl/id1/sound/doors/airdoor2.wav", "start": 16496420, "end": 16505014, "audio": 1}, {"filename": "/hl/id1/sound/doors/basesec1.wav", "start": 16505014, "end": 16518944, "audio": 1}, {"filename": "/hl/id1/sound/doors/basesec2.wav", "start": 16518944, "end": 16529182, "audio": 1}, {"filename": "/hl/id1/sound/doors/basetry.wav", "start": 16529182, "end": 16539700, "audio": 1}, {"filename": "/hl/id1/sound/doors/baseuse.wav", "start": 16539700, "end": 16556186, "audio": 1}, {"filename": "/hl/id1/sound/doors/ddoor1.wav", "start": 16556186, "end": 16563924, "audio": 1}, {"filename": "/hl/id1/sound/doors/ddoor2.wav", "start": 16563924, "end": 16569828, "audio": 1}, {"filename": "/hl/id1/sound/doors/doormv1.wav", "start": 16569828, "end": 16583864, "audio": 1}, {"filename": "/hl/id1/sound/doors/drclos4.wav", "start": 16583864, "end": 16596678, "audio": 1}, {"filename": "/hl/id1/sound/doors/hydro1.wav", "start": 16596678, "end": 16607772, "audio": 1}, {"filename": "/hl/id1/sound/doors/hydro2.wav", "start": 16607772, "end": 16618472, "audio": 1}, {"filename": "/hl/id1/sound/doors/latch2.wav", "start": 16618472, "end": 16625810, "audio": 1}, {"filename": "/hl/id1/sound/doors/medtry.wav", "start": 16625810, "end": 16633638, "audio": 1}, {"filename": "/hl/id1/sound/doors/meduse.wav", "start": 16633638, "end": 16644356, "audio": 1}, {"filename": "/hl/id1/sound/doors/runetry.wav", "start": 16644356, "end": 16657880, "audio": 1}, {"filename": "/hl/id1/sound/doors/runeuse.wav", "start": 16657880, "end": 16675244, "audio": 1}, {"filename": "/hl/id1/sound/doors/stndr1.wav", "start": 16675244, "end": 16687864, "audio": 1}, {"filename": "/hl/id1/sound/doors/stndr2.wav", "start": 16687864, "end": 16699334, "audio": 1}, {"filename": "/hl/id1/sound/doors/winch2.wav", "start": 16699334, "end": 16714206, "audio": 1}, {"filename": "/hl/id1/sound/hknight/hit.wav", "start": 16714206, "end": 16720466, "audio": 1}, {"filename": "/hl/id1/sound/items/armor1.wav", "start": 16720466, "end": 16728180, "audio": 1}, {"filename": "/hl/id1/sound/items/damage.wav", "start": 16728180, "end": 16751554, "audio": 1}, {"filename": "/hl/id1/sound/items/damage2.wav", "start": 16751554, "end": 16784566, "audio": 1}, {"filename": "/hl/id1/sound/items/damage3.wav", "start": 16784566, "end": 16797460, "audio": 1}, {"filename": "/hl/id1/sound/items/health1.wav", "start": 16797460, "end": 16805418, "audio": 1}, {"filename": "/hl/id1/sound/items/inv1.wav", "start": 16805418, "end": 16819146, "audio": 1}, {"filename": "/hl/id1/sound/items/inv2.wav", "start": 16819146, "end": 16852362, "audio": 1}, {"filename": "/hl/id1/sound/items/inv3.wav", "start": 16852362, "end": 16885682, "audio": 1}, {"filename": "/hl/id1/sound/items/itembk2.wav", "start": 16885682, "end": 16895592, "audio": 1}, {"filename": "/hl/id1/sound/items/protect.wav", "start": 16895592, "end": 16918128, "audio": 1}, {"filename": "/hl/id1/sound/items/protect2.wav", "start": 16918128, "end": 16952140, "audio": 1}, {"filename": "/hl/id1/sound/items/protect3.wav", "start": 16952140, "end": 16975504, "audio": 1}, {"filename": "/hl/id1/sound/items/r_item1.wav", "start": 16975504, "end": 16982326, "audio": 1}, {"filename": "/hl/id1/sound/items/r_item2.wav", "start": 16982326, "end": 16989774, "audio": 1}, {"filename": "/hl/id1/sound/items/suit.wav", "start": 16989774, "end": 17005628, "audio": 1}, {"filename": "/hl/id1/sound/items/suit2.wav", "start": 17005628, "end": 17038882, "audio": 1}, {"filename": "/hl/id1/sound/knight/idle.wav", "start": 17038882, "end": 17049946, "audio": 1}, {"filename": "/hl/id1/sound/knight/kdeath.wav", "start": 17049946, "end": 17060634, "audio": 1}, {"filename": "/hl/id1/sound/knight/khurt.wav", "start": 17060634, "end": 17066220, "audio": 1}, {"filename": "/hl/id1/sound/knight/ksight.wav", "start": 17066220, "end": 17079734, "audio": 1}, {"filename": "/hl/id1/sound/knight/sword1.wav", "start": 17079734, "end": 17082040, "audio": 1}, {"filename": "/hl/id1/sound/knight/sword2.wav", "start": 17082040, "end": 17084824, "audio": 1}, {"filename": "/hl/id1/sound/misc/h2ohit1.wav", "start": 17084824, "end": 17097796, "audio": 1}, {"filename": "/hl/id1/sound/misc/medkey.wav", "start": 17097796, "end": 17107816, "audio": 1}, {"filename": "/hl/id1/sound/misc/menu1.wav", "start": 17107816, "end": 17113554, "audio": 1}, {"filename": "/hl/id1/sound/misc/menu2.wav", "start": 17113554, "end": 17124226, "audio": 1}, {"filename": "/hl/id1/sound/misc/menu3.wav", "start": 17124226, "end": 17127236, "audio": 1}, {"filename": "/hl/id1/sound/misc/null.wav", "start": 17127236, "end": 17128480, "audio": 1}, {"filename": "/hl/id1/sound/misc/outwater.wav", "start": 17128480, "end": 17133498, "audio": 1}, {"filename": "/hl/id1/sound/misc/power.wav", "start": 17133498, "end": 17153330, "audio": 1}, {"filename": "/hl/id1/sound/misc/runekey.wav", "start": 17153330, "end": 17167908, "audio": 1}, {"filename": "/hl/id1/sound/misc/r_tele1.wav", "start": 17167908, "end": 17175944, "audio": 1}, {"filename": "/hl/id1/sound/misc/r_tele2.wav", "start": 17175944, "end": 17193268, "audio": 1}, {"filename": "/hl/id1/sound/misc/r_tele3.wav", "start": 17193268, "end": 17211284, "audio": 1}, {"filename": "/hl/id1/sound/misc/r_tele4.wav", "start": 17211284, "end": 17220352, "audio": 1}, {"filename": "/hl/id1/sound/misc/r_tele5.wav", "start": 17220352, "end": 17242394, "audio": 1}, {"filename": "/hl/id1/sound/misc/secret.wav", "start": 17242394, "end": 17249004, "audio": 1}, {"filename": "/hl/id1/sound/misc/talk.wav", "start": 17249004, "end": 17250814, "audio": 1}, {"filename": "/hl/id1/sound/misc/trigger1.wav", "start": 17250814, "end": 17271044, "audio": 1}, {"filename": "/hl/id1/sound/misc/water1.wav", "start": 17271044, "end": 17274970, "audio": 1}, {"filename": "/hl/id1/sound/misc/water2.wav", "start": 17274970, "end": 17278310, "audio": 1}, {"filename": "/hl/id1/sound/ogre/ogdrag.wav", "start": 17278310, "end": 17290706, "audio": 1}, {"filename": "/hl/id1/sound/ogre/ogdth.wav", "start": 17290706, "end": 17304598, "audio": 1}, {"filename": "/hl/id1/sound/ogre/ogidle.wav", "start": 17304598, "end": 17317492, "audio": 1}, {"filename": "/hl/id1/sound/ogre/ogidle2.wav", "start": 17317492, "end": 17328746, "audio": 1}, {"filename": "/hl/id1/sound/ogre/ogpain1.wav", "start": 17328746, "end": 17336644, "audio": 1}, {"filename": "/hl/id1/sound/ogre/ogsawatk.wav", "start": 17336644, "end": 17352798, "audio": 1}, {"filename": "/hl/id1/sound/ogre/ogwake.wav", "start": 17352798, "end": 17372154, "audio": 1}, {"filename": "/hl/id1/sound/plats/medplat1.wav", "start": 17372154, "end": 17388532, "audio": 1}, {"filename": "/hl/id1/sound/plats/medplat2.wav", "start": 17388532, "end": 17395870, "audio": 1}, {"filename": "/hl/id1/sound/plats/plat1.wav", "start": 17395870, "end": 17416118, "audio": 1}, {"filename": "/hl/id1/sound/plats/plat2.wav", "start": 17416118, "end": 17423456, "audio": 1}, {"filename": "/hl/id1/sound/plats/train1.wav", "start": 17423456, "end": 17444886, "audio": 1}, {"filename": "/hl/id1/sound/plats/train2.wav", "start": 17444886, "end": 17450756, "audio": 1}, {"filename": "/hl/id1/sound/player/axhit1.wav", "start": 17450756, "end": 17457662, "audio": 1}, {"filename": "/hl/id1/sound/player/axhit2.wav", "start": 17457662, "end": 17460096, "audio": 1}, {"filename": "/hl/id1/sound/player/death1.wav", "start": 17460096, "end": 17470266, "audio": 1}, {"filename": "/hl/id1/sound/player/death2.wav", "start": 17470266, "end": 17478292, "audio": 1}, {"filename": "/hl/id1/sound/player/death3.wav", "start": 17478292, "end": 17489210, "audio": 1}, {"filename": "/hl/id1/sound/player/death4.wav", "start": 17489210, "end": 17503336, "audio": 1}, {"filename": "/hl/id1/sound/player/death5.wav", "start": 17503336, "end": 17518282, "audio": 1}, {"filename": "/hl/id1/sound/player/drown1.wav", "start": 17518282, "end": 17527190, "audio": 1}, {"filename": "/hl/id1/sound/player/drown2.wav", "start": 17527190, "end": 17530304, "audio": 1}, {"filename": "/hl/id1/sound/player/gasp1.wav", "start": 17530304, "end": 17539006, "audio": 1}, {"filename": "/hl/id1/sound/player/gasp2.wav", "start": 17539006, "end": 17552140, "audio": 1}, {"filename": "/hl/id1/sound/player/gib.wav", "start": 17552140, "end": 17566564, "audio": 1}, {"filename": "/hl/id1/sound/player/h2odeath.wav", "start": 17566564, "end": 17584668, "audio": 1}, {"filename": "/hl/id1/sound/player/h2ojump.wav", "start": 17584668, "end": 17596106, "audio": 1}, {"filename": "/hl/id1/sound/player/inh2o.wav", "start": 17596106, "end": 17607446, "audio": 1}, {"filename": "/hl/id1/sound/player/inlava.wav", "start": 17607446, "end": 17618404, "audio": 1}, {"filename": "/hl/id1/sound/player/land.wav", "start": 17618404, "end": 17620838, "audio": 1}, {"filename": "/hl/id1/sound/player/land2.wav", "start": 17620838, "end": 17627042, "audio": 1}, {"filename": "/hl/id1/sound/player/lburn1.wav", "start": 17627042, "end": 17633724, "audio": 1}, {"filename": "/hl/id1/sound/player/lburn2.wav", "start": 17633724, "end": 17639800, "audio": 1}, {"filename": "/hl/id1/sound/player/pain1.wav", "start": 17639800, "end": 17643194, "audio": 1}, {"filename": "/hl/id1/sound/player/pain2.wav", "start": 17643194, "end": 17645904, "audio": 1}, {"filename": "/hl/id1/sound/player/pain3.wav", "start": 17645904, "end": 17650758, "audio": 1}, {"filename": "/hl/id1/sound/player/pain4.wav", "start": 17650758, "end": 17655598, "audio": 1}, {"filename": "/hl/id1/sound/player/pain5.wav", "start": 17655598, "end": 17663618, "audio": 1}, {"filename": "/hl/id1/sound/player/pain6.wav", "start": 17663618, "end": 17669080, "audio": 1}, {"filename": "/hl/id1/sound/player/plyrjmp8.wav", "start": 17669080, "end": 17672968, "audio": 1}, {"filename": "/hl/id1/sound/player/slimbrn2.wav", "start": 17672968, "end": 17685436, "audio": 1}, {"filename": "/hl/id1/sound/player/teledth1.wav", "start": 17685436, "end": 17699850, "audio": 1}, {"filename": "/hl/id1/sound/player/tornoff2.wav", "start": 17699850, "end": 17707576, "audio": 1}, {"filename": "/hl/id1/sound/player/udeath.wav", "start": 17707576, "end": 17723658, "audio": 1}, {"filename": "/hl/id1/sound/shambler/melee1.wav", "start": 17723658, "end": 17728376, "audio": 1}, {"filename": "/hl/id1/sound/shambler/melee2.wav", "start": 17728376, "end": 17734342, "audio": 1}, {"filename": "/hl/id1/sound/shambler/sattck1.wav", "start": 17734342, "end": 17742378, "audio": 1}, {"filename": "/hl/id1/sound/shambler/sboom.wav", "start": 17742378, "end": 17754050, "audio": 1}, {"filename": "/hl/id1/sound/shambler/sdeath.wav", "start": 17754050, "end": 17775156, "audio": 1}, {"filename": "/hl/id1/sound/shambler/shurt2.wav", "start": 17775156, "end": 17779458, "audio": 1}, {"filename": "/hl/id1/sound/shambler/sidle.wav", "start": 17779458, "end": 17785104, "audio": 1}, {"filename": "/hl/id1/sound/shambler/smack.wav", "start": 17785104, "end": 17790404, "audio": 1}, {"filename": "/hl/id1/sound/shambler/ssight.wav", "start": 17790404, "end": 17805824, "audio": 1}, {"filename": "/hl/id1/sound/soldier/death1.wav", "start": 17805824, "end": 17814258, "audio": 1}, {"filename": "/hl/id1/sound/soldier/idle.wav", "start": 17814258, "end": 17824060, "audio": 1}, {"filename": "/hl/id1/sound/soldier/pain1.wav", "start": 17824060, "end": 17829060, "audio": 1}, {"filename": "/hl/id1/sound/soldier/pain2.wav", "start": 17829060, "end": 17836898, "audio": 1}, {"filename": "/hl/id1/sound/soldier/sattck1.wav", "start": 17836898, "end": 17851200, "audio": 1}, {"filename": "/hl/id1/sound/soldier/sight1.wav", "start": 17851200, "end": 17863916, "audio": 1}, {"filename": "/hl/id1/sound/weapons/ax1.wav", "start": 17863916, "end": 17867224, "audio": 1}, {"filename": "/hl/id1/sound/weapons/bounce.wav", "start": 17867224, "end": 17873088, "audio": 1}, {"filename": "/hl/id1/sound/weapons/grenade.wav", "start": 17873088, "end": 17881452, "audio": 1}, {"filename": "/hl/id1/sound/weapons/guncock.wav", "start": 17881452, "end": 17895882, "audio": 1}, {"filename": "/hl/id1/sound/weapons/lhit.wav", "start": 17895882, "end": 17921910, "audio": 1}, {"filename": "/hl/id1/sound/weapons/lock4.wav", "start": 17921910, "end": 17925786, "audio": 1}, {"filename": "/hl/id1/sound/weapons/lstart.wav", "start": 17925786, "end": 17982164, "audio": 1}, {"filename": "/hl/id1/sound/weapons/pkup.wav", "start": 17982164, "end": 17987338, "audio": 1}, {"filename": "/hl/id1/sound/weapons/ric1.wav", "start": 17987338, "end": 17991646, "audio": 1}, {"filename": "/hl/id1/sound/weapons/ric2.wav", "start": 17991646, "end": 18002484, "audio": 1}, {"filename": "/hl/id1/sound/weapons/ric3.wav", "start": 18002484, "end": 18015122, "audio": 1}, {"filename": "/hl/id1/sound/weapons/rocket1i.wav", "start": 18015122, "end": 18024782, "audio": 1}, {"filename": "/hl/id1/sound/weapons/r_exp3.wav", "start": 18024782, "end": 18042260, "audio": 1}, {"filename": "/hl/id1/sound/weapons/sgun1.wav", "start": 18042260, "end": 18065252, "audio": 1}, {"filename": "/hl/id1/sound/weapons/shotgn2.wav", "start": 18065252, "end": 18073946, "audio": 1}, {"filename": "/hl/id1/sound/weapons/spike2.wav", "start": 18073946, "end": 18086588, "audio": 1}, {"filename": "/hl/id1/sound/weapons/tink1.wav", "start": 18086588, "end": 18087840, "audio": 1}, {"filename": "/hl/id1/sound/wizard/hit.wav", "start": 18087840, "end": 18095172, "audio": 1}, {"filename": "/hl/id1/sound/wizard/wattack.wav", "start": 18095172, "end": 18121084, "audio": 1}, {"filename": "/hl/id1/sound/wizard/wdeath.wav", "start": 18121084, "end": 18141768, "audio": 1}, {"filename": "/hl/id1/sound/wizard/widle1.wav", "start": 18141768, "end": 18155232, "audio": 1}, {"filename": "/hl/id1/sound/wizard/widle2.wav", "start": 18155232, "end": 18178326, "audio": 1}, {"filename": "/hl/id1/sound/wizard/wpain.wav", "start": 18178326, "end": 18187012, "audio": 1}, {"filename": "/hl/id1/sound/wizard/wsight.wav", "start": 18187012, "end": 18200090, "audio": 1}, {"filename": "/hl/id1/sound/zombie/idle_w2.wav", "start": 18200090, "end": 18217282, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_fall.wav", "start": 18217282, "end": 18220344, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_gib.wav", "start": 18220344, "end": 18236570, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_hit.wav", "start": 18236570, "end": 18242736, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_idle.wav", "start": 18242736, "end": 18259470, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_idle1.wav", "start": 18259470, "end": 18272714, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_miss.wav", "start": 18272714, "end": 18283448, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_pain.wav", "start": 18283448, "end": 18295666, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_pain1.wav", "start": 18295666, "end": 18311040, "audio": 1}, {"filename": "/hl/id1/sound/zombie/z_shot1.wav", "start": 18311040, "end": 18314108, "audio": 1}], "remote_package_size": 18314108, "package_uuid": "655ec050-06ce-447b-854d-78c702b5c9e7"});
  
  })();
  