(function(exports, $) {
	var global = { jquery: $ }, globalFunc = {};

	// JUI의 기본 설정 값 (향후 더 추가될 수 있음)
	var globalOpts = {
		template: {
			evaluate : /<\!([\s\S]+?)\!>/g,
			interpolate : /<\!=([\s\S]+?)\!>/g,
			escape : /<\!-([\s\S]+?)\!>/g
		},
		logUrl: "tool/debug.html"
	};

	/**
	 * Private Classes
	 * 
	 */
	var QuickSort = function(array, isClone) { // isClone이면, 해당 배열을 참조하지 않고 복사해서 처리
        var compareFunc = null,
        	array = (isClone) ? array.slice(0) : array;
  
        function swap(indexA, indexB) {
            var temp = array[indexA];
            
            array[indexA] = array[indexB];
            array[indexB] = temp;
        }

        function partition(pivot, left, right) {
            var storeIndex = left, pivotValue = array[pivot];
            swap(pivot, right);

            for(var v = left; v < right; v++) {
            	if(compareFunc(array[v], pivotValue) || !compareFunc(pivotValue, array[v]) && v%2 == 1) {
                	swap(v, storeIndex);
                    storeIndex++;
                }
            }
    
            swap(right, storeIndex);

            return storeIndex;
        }
  
        this.setCompare = function(func) {
        	compareFunc = func;
        }

        this.run = function(left, right) {
            var pivot = null;

            if (typeof left !== 'number') {
                left = 0;
            }

            if (typeof right !== 'number') {
                right = array.length - 1;
            }

            if (left < right) {
                pivot = left + Math.ceil((right - left) * 0.5);
                newPivot = partition(pivot, left, right);

                this.run(left, newPivot - 1);
                this.run(newPivot + 1, right);
            }
            
            return array;
        }
	}
	
	var IndexParser = function() {
		this.isIndexDepth = function(index) {
			if(typeof(index) == "string" && index.indexOf(".") != -1) {
				return true;
			}
			
			return false;
		}
		
		this.getIndexList = function(index) { // 트리 구조의 모든 키를 배열 형태로 반환
			var resIndex = [], strIndex = "" + index;
			
			if(strIndex.length == 1) {
				resIndex[0] = parseInt(index);
			} else {
				var keys = strIndex.split(".");
				
				for(var i = 0; i < keys.length; i++) {
					resIndex[i] = parseInt(keys[i]);
				}
			}
			
			return resIndex;
		}
		
		this.changeIndex = function(index, targetIndex, rootIndex) {
			var rootIndexLen = this.getIndexList(rootIndex).length,
				indexList = this.getIndexList(index),
				tIndexList = this.getIndexList(targetIndex);
			
			for(var i = 0; i < rootIndexLen; i++) {
				indexList.shift();
			}

			return tIndexList.concat(indexList).join(".");
		}
		
		this.getNextIndex = function(index) { // 현재 인덱스에서 +1
			var indexList = this.getIndexList(index),
				no = indexList.pop() + 1;
				
			indexList.push(no);
			return indexList.join(".");
		}
		
		this.getParentIndex = function(index) {
			if(!this.isIndexDepth(index)) return null;
			var keys = this.getIndexList(index);
			
			if(keys.length == 2) {
				return "" + keys[0];
			} else if(keys.length > 2) {
				keys.pop();
				return keys.join(".");
			}
		}
	}
	
	/**
	 * Private Static Classes
	 * 
	 */
	var Base64 = {
			 
	    // private property
	    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	 
	    // public method for encoding
	    encode : function (input) {
	        var output = "";
	        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	        var i = 0;
	 
	        input = Base64._utf8_encode(input);
	 
	        while (i < input.length) {
	 
	            chr1 = input.charCodeAt(i++);
	            chr2 = input.charCodeAt(i++);
	            chr3 = input.charCodeAt(i++);
	 
	            enc1 = chr1 >> 2;
	            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	            enc4 = chr3 & 63;
	 
	            if (isNaN(chr2)) {
	                enc3 = enc4 = 64;
	            } else if (isNaN(chr3)) {
	                enc4 = 64;
	            }
	 
	            output = output +
	            Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
	            Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
	 
	        }
	 
	        return output;
	    },
	 
	    // public method for decoding
	    decode : function (input) {
	        var output = "";
	        var chr1, chr2, chr3;
	        var enc1, enc2, enc3, enc4;
	        var i = 0;
	 
	        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	 
	        while (i < input.length) {
	 
	            enc1 = Base64._keyStr.indexOf(input.charAt(i++));
	            enc2 = Base64._keyStr.indexOf(input.charAt(i++));
	            enc3 = Base64._keyStr.indexOf(input.charAt(i++));
	            enc4 = Base64._keyStr.indexOf(input.charAt(i++));
	 
	            chr1 = (enc1 << 2) | (enc2 >> 4);
	            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	            chr3 = ((enc3 & 3) << 6) | enc4;
	 
	            output = output + String.fromCharCode(chr1);
	 
	            if (enc3 != 64) {
	                output = output + String.fromCharCode(chr2);
	            }
	            if (enc4 != 64) {
	                output = output + String.fromCharCode(chr3);
	            }
	 
	        }
	 
	        output = Base64._utf8_decode(output);
	 
	        return output;
	 
	    },
	 
	    // private method for UTF-8 encoding
	    _utf8_encode : function (string) {
	        string = string.replace(/\r\n/g,"\n");
	        
	        // BOM 코드 적용 (UTF-8 관련)
	        var utftext = String.fromCharCode(239) + String.fromCharCode(187) + String.fromCharCode(191);
	 
	        for (var n = 0; n < string.length; n++) {
	 
	            var c = string.charCodeAt(n);
	 
	            if (c < 128) {
	                utftext += String.fromCharCode(c);
	            }
	            else if((c > 127) && (c < 2048)) {
	                utftext += String.fromCharCode((c >> 6) | 192);
	                utftext += String.fromCharCode((c & 63) | 128);
	            }
	            else {
	                utftext += String.fromCharCode((c >> 12) | 224);
	                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	                utftext += String.fromCharCode((c & 63) | 128);
	            }
	 
	        }
	 
	        return utftext;
	    },
	 
	    // private method for UTF-8 decoding
	    _utf8_decode : function (utftext) {
	        var string = "";
	        var i = 0;
	        var c = c1 = c2 = 0;
	 
	        while ( i < utftext.length ) {
	 
	            c = utftext.charCodeAt(i);
	 
	            if (c < 128) {
	                string += String.fromCharCode(c);
	                i++;
	            }
	            else if((c > 191) && (c < 224)) {
	                c2 = utftext.charCodeAt(i+1);
	                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
	                i += 2;
	            }
	            else {
	                c2 = utftext.charCodeAt(i+1);
	                c3 = utftext.charCodeAt(i+2);
	                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	                i += 3;
	            }
	 
	        }
	 
	        return string;
	    }
	}
	
	/**
	 * Private Functions
	 * 
	 */
	var template = function(text, data, settings) {
		var _ = {},
			breaker = {};
	
		var ArrayProto = Array.prototype,
			slice = ArrayProto.slice,
			nativeForEach = ArrayProto.forEach;
		
		var escapes = {
			'\\' : '\\',
			"'" : "'",
			'r' : '\r',
			'n' : '\n',
			't' : '\t',
			'u2028' : '\u2028',
			'u2029' : '\u2029'
		};
	
		for (var p in escapes)
		escapes[escapes[p]] = p;
		
		var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g,
			unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g,
			noMatch = /.^/;
		
		var unescape = function(code) {
			return code.replace(unescaper, function(match, escape) {
				return escapes[escape];
			});
		};
	
		var each = _.each = _.forEach = function(obj, iterator, context) {
			if (obj == null)
				return;
			if (nativeForEach && obj.forEach === nativeForEach) {
				obj.forEach(iterator, context);
			} else if (obj.length === +obj.length) {
				for (var i = 0, l = obj.length; i < l; i++) {
					if ( i in obj && iterator.call(context, obj[i], i, obj) === breaker)
						return;
				}
			} else {
				for (var key in obj) {
					if (_.has(obj, key)) {
						if (iterator.call(context, obj[key], key, obj) === breaker)
							return;
					}
				}
			}
		};
	
		_.has = function(obj, key) {
			return hasOwnProperty.call(obj, key);
		};
	
		_.defaults = function(obj) {
			each(slice.call(arguments, 1), function(source) {
				for (var prop in source) {
					if (obj[prop] == null)
						obj[prop] = source[prop];
				}
			});
			return obj;
		};
	
		_.template = function(text, data, settings) {
			settings = _.defaults(settings || {}, globalOpts.template);
	
			var source = "__p+='" + text.replace(escaper, function(match) {
				return '\\' + escapes[match];
			}).replace(settings.escape || noMatch, function(match, code) {
				return "'+\n_.escape(" + unescape(code) + ")+\n'";
			}).replace(settings.interpolate || noMatch, function(match, code) {
				return "'+\n(" + unescape(code) + ")+\n'";
			}).replace(settings.evaluate || noMatch, function(match, code) {
				return "';\n" + unescape(code) + "\n;__p+='";
			}) + "';\n";
	
			if (!settings.variable)
				source = 'with(obj||{}){\n' + source + '}\n';
	
			source = "var __p='';" + "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + source + "return __p;\n";
	
			var render = new Function(settings.variable || 'obj', '_', source);
			if (data)
				return render(data, _);
			var template = function(data) {
				return render.call(this, data, _);
			};
	
			template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
	
			return template;
		};
		
		return _.template(text, data, settings);
	}
	
	
	/**
	 * Public Utility Classes
	 * 
	 */
	var utility = global["util.base"] = {
			
		//-- Properties
		browser: {
			webkit: (typeof window.webkitURL != 'undefined') ? true : false,
			mozilla: (typeof window.mozInnerScreenX != 'undefined') ? true : false,
			msie: (navigator.userAgent.indexOf("Trident") != -1) ? true : false
		},
		isTouch: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
				
		//-- Functions
		scrollWidth: function() {
			var isJUI = ($(".jui").size() > 0 && this.browser.webkit) ? true : false;

			var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div></div>');
			$('body').append(div);
			var w1 = $('div', div).innerWidth();
			div.css('overflow-y', 'auto');
			var w2 = $('div', div).innerWidth();
			$(div).remove();

			return (isJUI) ? 10 : (w1 - w2);
		},
		inherit: function(ctor, superCtor) {
			if(!this.typeCheck("function", ctor) || !this.typeCheck("function", superCtor)) return;

			ctor.parent = superCtor;
			ctor.prototype = new superCtor;
			ctor.prototype.constructor = ctor;
            ctor.prototype.parent = ctor.prototype;
		},
		extend: function(origin, add, skip) {
			if(!this.typeCheck("object", origin)) origin = {};
			if(!this.typeCheck("object", add)) return origin;

			for(var key in add) {
				if(skip === true) {
					if(isRecursive(origin[key])) {
						this.extend(origin[key], add[key], skip);
					} else if(this.typeCheck("undefined", origin[key])) {
						origin[key] = add[key];
					}
				} else {
					if(isRecursive(origin[key])) {
						this.extend(origin[key], add[key], skip);
					} else {
						origin[key] = add[key];
					}
				}
			}

			function isRecursive(value) {
				return utility.typeCheck("object", value);
			}

			return origin;
		},
		pxToInt: function(px) {
			if(typeof(px) == "string" && px.indexOf("px") != -1) {
				return parseInt(px.split("px").join(""));
			}

			return px;
		},
		clone: function(obj) {
			var clone = ($.isArray(obj)) ? [] : {};

	        for(var i in obj) {
	            if(this.typeCheck("object", obj[i]))
	                clone[i] = this.clone(obj[i]);
	            else
	                clone[i] = obj[i];
	        }

	        return clone;
		},
        deepClone: function(obj, emit) {
            var value = null;
            emit = emit  || {};

            if(this.typeCheck("array", obj )) {
                value = new Array(obj.length);

                for(var i = 0, len = obj.length; i < len; i++) {
                    value[i] = this.deepClone(obj[i], emit);
                }
            } else if(this.typeCheck("date", obj)) {
                value = obj;
            } else if(this.typeCheck("object", obj)) {
                value = {};

                for(var key in obj) {
                    if (emit[key]) {
                        value[key] = obj[key];
                    }  else {
                        value[key] = this.deepClone(obj[key], emit);
                    }
                }
            } else {
                value = obj;
            }

            return value ;
        },
		sort: function(array) {
			return new QuickSort(array);
		},
		runtime: function(name, callback) {
			var nStart = new Date().getTime();
			callback();
			var nEnd = new Date().getTime();

			console.log(name + " : " + (nEnd - nStart) + "ms");
		},
		template: function(html, obj) {
			if(!obj) return template(html);
			else return template(html, obj);
		},
		resize: function(callback, ms) {
			var after_resize = (function(){
				var timer = 0;

				return function() {
				    clearTimeout(timer);
				    timer = setTimeout(callback, ms);
				}
			})();

			$(window).resize(function() {
				after_resize();
			});
		},
		index: function() {
			return new IndexParser();
		},
		chunk: function(arr, len) {
		  var chunks = [],
		      i = 0,
		      n = arr.length;

		  while (i < n) {
		    chunks.push(arr.slice(i, i += len));
		  }

		  return chunks;
		},
		typeCheck: function(t, v) {
			function check(type, value) {

				if(typeof(type) != "string") return false;

				if (type == "string") {
					return (typeof(value) == "string");
				}
				else if (type == "integer") {
					return (typeof(value) == "number" && value % 1 == 0);
				}
				else if (type == "float") {
					return (typeof(value) == "number" && value % 1 != 0);
				}
				else if (type == "number") {
					return (typeof(value) == "number");
				}
				else if (type == "boolean") {
					return (typeof(value) == "boolean");
				}
				else if (type == "undefined") {
					return (typeof(value) == "undefined");
				}
				else if (type == "null") {
					return (value === null);
				}
				else if (type == "array") {
					return (value instanceof Array);
				}
				else if (type == "date") {
					return (value instanceof Date);
				}
				else if (type == "function") {
					return (typeof(value) == "function");
				}
				else if (type == "object") {
					// typeCheck에 정의된 타입일 경우에는 object 체크시 false를 반환 (date, array, null)
					return (
						typeof(value) == "object" &&
						value !== null &&
						!(value instanceof Array) &&
						!(value instanceof Date)
					);
				}

				return false;
			}
			
			if(typeof(t) == "object" && t.length) {
				var typeList = t;
				
				for(var i = 0; i < typeList.length; i++) {
					if(check(typeList[i], v)) return true;
				}
				
				return false;
			} else {
				return check(t, v);
			}
		},
		typeCheckObj: function(uiObj, list) {
			if(typeof(uiObj) != "object") return;
			var self = this;
			
			for(var key in uiObj) {
				var func = uiObj[key];
				
				if(typeof(func) == "function") {
					(function(funcName, funcObj) {
						uiObj[funcName] = function() {
							var args = arguments,
								params = list[funcName];
							
							for(var i = 0; i < args.length; i++) {
								if(!self.typeCheck(params[i], args[i])) {
									throw new Error("JUI_CRITICAL_ERR: the " + i + "th parameter is not a " + params[i] + " (" + name + ")");
								}
							}
							
							return funcObj.apply(this, args);
						}
					})(key, func);
				}
			}
		},
		dataToCsv: function(keys, dataList, dataSize) {
			var csv = "", len = (!dataSize) ? dataList.length : dataSize;
			
			for(var i = -1; i < len; i++) {
				var tmpArr = [];
				
				for(var j = 0; j < keys.length; j++) {
					if(keys[j]) {
						if(i == -1) {
							tmpArr.push(keys[j]);
						} else {
							tmpArr.push(dataList[i][keys[j]]);
						}
					}
				}
				
				csv += tmpArr.join(",") + "\n";
			}
			
			return csv;
		},
		dataToCsv2: function(options) {
			var csv = "";
			var opts = $.extend({
				fields: null, // required
				rows: null, // required
				names: null,
				count: (this.typeCheck("integer", options.count)) ? options.count : options.rows.length
			}, options);
			
			for(var i = -1; i < opts.count; i++) {
				var tmpArr = [];
				
				for(var j = 0; j < opts.fields.length; j++) {
					if(opts.fields[j]) {
						if(i == -1) {
							if(opts.names && opts.names[j]) {
								tmpArr.push(opts.names[j]);
							} else {
								tmpArr.push(opts.fields[j]);
							}
						} else {
							tmpArr.push(opts.rows[i][opts.fields[j]]);
						}
					}
				}
				
				csv += tmpArr.join(",") + "\n";
			}
			
			return csv;
		},
		fileToCsv: function(file, callback) {
			var reader = new FileReader();
			
	        reader.onload = function(readerEvt) {
	            if(typeof(callback) == "function") {
	            	callback(readerEvt.target.result);
	            }
	        };
	
	        reader.readAsText(file);
		},
		csvToBase64: function(csv) {
			return "data:application/octet-stream;base64," + Base64.encode(csv);
		},
		csvToData: function(keys, csv, csvNumber) {
			var dataList = [],
				tmpRowArr = csv.split("\n")

			for(var i = 1; i < tmpRowArr.length; i++) {
				if(tmpRowArr[i] != "") {
					var tmpArr = tmpRowArr[i].split(","),
						data = {};
					
					for(var j = 0; j < keys.length; j++) {
                        data[keys[j]] = tmpArr[j];

                        if($.inArray(keys[j], csvNumber) != -1) {
                            data[keys[j]] = parseFloat(tmpArr[j]);
                        }
					}
					
					dataList.push(data);
				}
			}
			
			return dataList;
		},
		getCsvFields: function(fields, csvFields) {
			var tmpFields = (this.typeCheck("array", csvFields)) ? csvFields : fields;
			
			for(var i = 0; i < tmpFields.length; i++) {
				if(!isNaN(tmpFields[i])) {
					tmpFields[i] = fields[tmpFields[i]];
				}
			}
			
			return tmpFields;
		},
        svgToBase64: function(xml) {
            return "data:image/svg+xml;base64," + Base64.encode(xml);
        },
        dateFormat: function(date, format, utc) {
            var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

            function ii(i, len) {
                var s = i + "";
                len = len || 2;
                while (s.length < len) s = "0" + s;
                return s;
            }

            var y = utc ? date.getUTCFullYear() : date.getFullYear();
            format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
            format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
            format = format.replace(/(^|[^\\])y/g, "$1" + y);

            var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
            format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
            format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
            format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
            format = format.replace(/(^|[^\\])M/g, "$1" + M);

            var d = utc ? date.getUTCDate() : date.getDate();
            format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
            format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
            format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
            format = format.replace(/(^|[^\\])d/g, "$1" + d);

            var H = utc ? date.getUTCHours() : date.getHours();
            format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
            format = format.replace(/(^|[^\\])H/g, "$1" + H);

            var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
            format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
            format = format.replace(/(^|[^\\])h/g, "$1" + h);

            var m = utc ? date.getUTCMinutes() : date.getMinutes();
            format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
            format = format.replace(/(^|[^\\])m/g, "$1" + m);

            var s = utc ? date.getUTCSeconds() : date.getSeconds();
            format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
            format = format.replace(/(^|[^\\])s/g, "$1" + s);

            var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
            format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
            f = Math.round(f / 10);
            format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
            f = Math.round(f / 10);
            format = format.replace(/(^|[^\\])f/g, "$1" + f);

            var T = H < 12 ? "AM" : "PM";
            format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
            format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

            var t = T.toLowerCase();
            format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
            format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

            var tz = -date.getTimezoneOffset();
            var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
            if (!utc) {
                tz = Math.abs(tz);
                var tzHrs = Math.floor(tz / 60);
                var tzMin = tz % 60;
                K += ii(tzHrs) + ":" + ii(tzMin);
            }
            format = format.replace(/(^|[^\\])K/g, "$1" + K);

            var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
            format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
            format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

            format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
            format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

            format = format.replace(/\\(.)/g, "$1");

            return format;
        },
        btoa: Base64.encode,
        atob: Base64.decode
	}


    /**
     * Module related functions
     *
     */
	
	var getDepends = function(depends) {
		var args = [];
		
		for(var i = 0; i < depends.length; i++) {
            var module = global[depends[i]];
			
			if(!utility.typeCheck([ "function", "object" ], module)) {
                var modules = getModules(depends[i]);

                if(modules == null) {
                    throw new Error("JUI_CRITICAL_ERR: '" + depends[i] + "' is not loaded");
                } else {
                    args.push(modules);
                }

			} else {
                args.push(module);
            }
		}
		
		return args;
	}

    var getModules = function(parent) {
        var modules = null,
            parent = parent + ".";

        for(var key in global) {
            if(key.indexOf(parent) != -1) {
                if(utility.typeCheck([ "function", "object" ], global[key])) {
                    var child = key.split(parent).join("");

                    if(child.indexOf(".") == -1) {
                        if(modules == null) {
                            modules = {};
                        }

                        modules[child] = global[key];
                    }
                }
            }
        }

        return modules;
    }


	/**
	 * Global Object
	 * 
	 */
	exports.jui = {
		
		ready: function() {
			var args = [],
				callback = (arguments.length == 2) ? arguments[1] : arguments[0],
				depends = (arguments.length == 2) ? arguments[0] : null;

			if(!utility.typeCheck([ "array", "null" ], depends) ||
					!utility.typeCheck("function", callback)) {
			
				throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
			}

			$(function() { 
				if(depends) {
					args = getDepends(depends);
				} else {
					args = [ getModules("ui"), getModules("uix"), utility ];
				}

				callback.apply(null, args);
			});
		},

        /**
         * 사용자가 실제로 사용할 수 있는 UI 클래스를 정의
         *
         * @param name 모듈 로드와 상속에 사용될 이름을 정한다.
         * @param depends 'define'이나 'defineUI'로 정의된 클래스나 객체를 인자로 받을 수 있다.
         * @param callback UI 클래스를 해당 콜백 함수 내에서 클래스 형태로 구현하고 리턴해야 한다.
         * @param parent 'depends'와 달리 'define'으로 정의된 클래스만 상속받을 수 있다.
         */
		defineUI: function(name, depends, callback, parent) {
			if(!utility.typeCheck("string", name) || !utility.typeCheck("array", depends) ||
				!utility.typeCheck("function", callback) || !utility.typeCheck([ "string", "undefined" ], parent)) {

				throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
			}

            if(utility.typeCheck("function", global[name])) {
                throw new Error("JUI_CRITICAL_ERR: '" + name + "' is already exist");
            }

            if(utility.typeCheck("undefined", parent)) { // 기본적으로 'core' 클래스를 상속함
                parent = "core";
            }

            if(!utility.typeCheck("function", global[parent])) {
                throw new Error("JUI_CRITICAL_ERR: Parents are the only function");
            } else {
                if(globalFunc[parent] !== true) {
                    throw new Error("JUI_CRITICAL_ERR: UI function can not be inherited");
                }
            }
			
			var args = getDepends(depends),
                uiFunc = callback.apply(null, args);

            // 상속
            utility.inherit(uiFunc, global[parent]);

            // UI 고유 설정
            global[name] = global["core"].init({
                type: name,
                "class": uiFunc
            });
		},

        /**
         * UI 클래스에서 사용될 클래스를 정의하고, 자유롭게 상속할 수 있는 클래스를 정의
         *
         * @param name 모듈 로드와 상속에 사용될 이름을 정한다.
         * @param depends 'define'이나 'defineUI'로 정의된 클래스나 객체를 인자로 받을 수 있다.
         * @param callback UI 클래스를 해당 콜백 함수 내에서 클래스 형태로 구현하고 리턴해야 한다.
         * @param parent 'depends'와 달리 'define'으로 정의된 클래스만 상속받을 수 있다.
         */
        define: function(name, depends, callback, parent) {
            if(!utility.typeCheck("string", name) || !utility.typeCheck("array", depends) ||
                !utility.typeCheck("function", callback) || !utility.typeCheck([ "string", "undefined" ], parent)) {

                throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
            }

            if(utility.typeCheck("function", global[name])) {
                throw new Error("JUI_CRITICAL_ERR: '" + name + "' is already exist");
            }

            var args = getDepends(depends),
                uiFunc = callback.apply(null, args);

            if(utility.typeCheck("function", global[parent])) {
                if(globalFunc[parent] !== true) {
                    throw new Error("JUI_CRITICAL_ERR: UI function can not be inherited");
                } else {
                    utility.inherit(uiFunc, global[parent]);
                }
            }

            // 함수 고유 설정
            global[name] = uiFunc;
            globalFunc[name] = true;
        },

		defineOptions: function(Module, options, exceptOpts) {
			var defOpts = getOptions(Module, {});
			var defOptKeys = Object.keys(defOpts),
				optKeys = Object.keys(options);

			// 정의되지 않은 옵션 사용 유무 체크
			for(var i = 0; i < optKeys.length; i++) {
				var name = optKeys[i];

				if($.inArray(name, defOptKeys) == -1 && $.inArray(name, exceptOpts) == -1) {
					throw new Error("JUI_CRITICAL_ERR: '" + name + "' is not an option");
				}
			}

			// 사용자 옵션 + 기본 옵션
			utility.extend(options, defOpts, true);

			// 상위 모듈의 옵션까지 모두 얻어오는 함수
			function getOptions(Module, options) {
				if(utility.typeCheck("function", Module)) {
					if(utility.typeCheck("function", Module.setup)) {
						var opts = Module.setup();

						for(var key in opts) {
							if(utility.typeCheck("undefined", options[key])) {
								options[key] = opts[key];
							}
						}
					}

					getOptions(Module.parent, options);
				}

				return options;
			}

			return options;
		},

        /**
         * define과 defineUI로 정의된 클래스 또는 객체를 가져온다.
         *
         * @param name 가져온 클래스 또는 객체의 이름
         * @returns {*}
         */
        include: function(name) {
            if(!utility.typeCheck("string", name)) {
                throw new Error("JUI_CRITICAL_ERR: Invalid parameter type of the function");
            }

            var module = global[name];

            if(utility.typeCheck([ "function", "object" ], module)) {
                return module;
            } else {
                var modules = getModules(name);

                if(modules == null) {
                    throw new Error("JUI_CRITICAL_ERR: '" + name + "' is not loaded");
                } else {
                    return modules;
                }
            }
        },

        /**
         * define과 defineUI로 정의된 모든 클래스와 객체를 가져온다.
         *
         * @returns {Array}
         */
        includeAll: function() {
            var result = [];

            for(var key in global) {
                result.push(global[key]);
            }

            return result;
        },

        /**
         * 설정된 jui 관리 화면을 윈도우 팝업으로 띄운다.
         *
         * @param logUrl
         * @returns {Window}
         */
		log: function(logUrl) {
			var jui_mng = window.open(
				logUrl || globalOpts.logUrl,
				"JUIM",
				"width=1024, height=768, toolbar=no, menubar=no, resizable=yes"
			);

			jui.debugAll(function (log, str) {
				jui_mng.log(log, str);
			});

			return jui_mng;
		},

		setup: function(options) {
			if(utility.typeCheck("object", options)) {
				globalOpts = $.extend(globalOpts, options);
			}

			return globalOpts;
		}
	};
})(window, jQuery || $);
jui.define("core", [ "jquery", "util.base" ], function($, _) {
	
	var UIManager = new function() {
		var instances = [], classes = [];

		
		/**
		 * Public Methods, Instance
		 * 
		 */
		this.add = function(uiIns) {
			instances.push(uiIns);
		}

        this.emit = function(key, type, args) {
            var targets = [];

            for(var i = 0; i < instances.length; i++) {
                var uiSet = instances[i];

                if(key == uiSet.selector || key == uiSet.type) {
                    targets.push(uiSet);
                }
            }

            for(var i = 0; i < targets.length; i++) {
                var uiSet = targets[i];

                for(var j = 0; j < uiSet.length; j++) {
                    uiSet[j].emit(type, args);
                }
            }
        }
		
		this.get = function(key) {
			if(_.typeCheck("integer", key)) {
				return instances[key];
			} else if(_.typeCheck("string", key)) {
                // 셀렉터 객체 검색
				for(var i = 0; i < instances.length; i++) {
                    var uiSet = instances[i];

					if(key == uiSet.selector) {
					    return (uiSet.length == 1) ? uiSet[0] : uiSet;
                    }
				}

                // 모듈 객체 검색
                var result = [];
                for(var i = 0; i < instances.length; i++) {
                    var uiSet = instances[i];

                    if(key == uiSet.type) {
                        result.push(uiSet);
                    }
                }

                return result;
			}
		}
		
		this.getAll = function() {
			return instances;
		}

        this.remove = function(index) {
            if(_.typeCheck("integer", index)) { // UI 객체 인덱스
                return instances.splice(index, 1)[0];
            }
        }

        this.shift = function() {
            return instances.shift();
        }

        this.pop = function() {
            return instances.pop();
        }
		
		this.size = function() {
			return instances.length;
		}
		
		this.debug = function(uiObj, i, j, callback) {
			if(!uiObj.__proto__) return;
			var exFuncList = [ "emit", "on", "addEvent", "addValid", "callBefore", 
			                   "callAfter", "callDelay", "setTpl", "setVo", "setOption" ];
			
			for(var key in uiObj) {
				var func = uiObj[key];
				
				if(typeof(func) == "function" && $.inArray(key, exFuncList) == -1) {
					(function(funcName, funcObj, funcIndex, funcChildIndex) {
						uiObj.__proto__[funcName] = function() {
							var nStart = Date.now();
							var resultObj = funcObj.apply(this, arguments);
							var nEnd = Date.now(); 
							
							if(typeof(callback) == "function") {
								callback({
									type: jui.get(i).type,
									name: funcName,
									c_index: funcIndex,
									u_index: funcChildIndex,
									time: nEnd - nStart
								}, arguments);
							} else {
								if(!isNaN(funcIndex) && !isNaN(funcChildIndex)) {
									console.log(
											"TYPE(" + jui.get(i).type + "), " + 
											"NAME(" + funcName + "), " + 
											"INDEX(" + funcIndex + ":" + funcChildIndex + "), " + 
											"TIME(" + (nEnd - nStart) + "ms), " + 
											"ARGUMENTS..."
									);
								} else {
									console.log( 
											"NAME(" + funcName + "), " + 
											"TIME(" + (nEnd - nStart) + "ms), " + 
											"ARGUMENTS..."
									);
								}
								
								console.log(arguments);
								console.log("");
							}
							
							
							return resultObj;
						}
					})(key, func, i, j);
				}
			}
		}
		
		this.debugAll = function(callback) {
			for(var i = 0; i < instances.length; i++) {
				var uiList = instances[i];
				
				for(var j = 0; j < uiList.length; j++) {
					this.debug(uiList[j], i, j, callback);
				}
			}
		}
		
		/**
		 * Public Methods, Class
		 * 
		 */
		this.addClass = function(uiCls) {
			classes.push(uiCls);
		}
		
		this.getClass = function(key) {
			if(_.typeCheck("integer", key)) {
				return classes[key];
			} else if(_.typeCheck("string", key)) {
				for(var i = 0; i < classes.length; i++) {
					if(key == classes[i].type) {
                        return classes[i];
					} else { // @Deprecated 그룹이 정해져 있지 않을 경우
                        if(classes[i].type.indexOf("." + key) != -1) {
                            return classes[i];
                        }
                    }
				}
			}
			
			return null;
		}
		
		this.getClassAll = function() {
			return classes;
		}

        /**
         * UI 객체 동적 생성 메소드
         *
         * @param type
         * @param selector
         * @param options
         * @returns {*}
         */
        this.create = function(type, selector, options) {
            var cls = UIManager.getClass(type);

            if(_.typeCheck("null", cls)) {
                throw new Error("JUI_CRITICAL_ERR: '" + type + "' does not exist");
            }

            return cls["class"](selector, options);
        }
	}
	
	var UIListener = function() {
		var list = [];
		
		/**
		 * Private Methods
		 * 
		 */
		function settingEventAnimation(e) {
			var pfx = [ "webkit", "moz", "MS", "o", "" ];
			
			for(var p = 0; p < pfx.length; p++) {
				var type = e.type;

				if(!pfx[p]) type = type.toLowerCase();
				$(e.target).on(pfx[p] + type, e.callback);
			}
			
			list.push(e);
		}
		
		function settingEvent(e) {
			if(e.callback && !e.children) {
				$(e.target).on(e.type, e.callback);
			} else {
				$(e.target).on(e.type, e.children, e.callback);
			}
			
			list.push(e);
		}
		
		function settingEventTouch(e) {
			if(e.callback && !e.children) {
				$(e.target).on(getEventTouchType(e.type), e.callback);
			} else {
				$(e.target).on(getEventTouchType(e.type), e.children, e.callback);
			}
			
			list.push(e);
		}
		
		function getEventTouchType(type) {
			return {
				"click": "touchstart",
				"dblclick": "touchend",
				"mousedown": "touchstart",
				"mousemove": "touchmove",
				"mouseup": "touchend"
			}[type];
		}
		
		/**
		 * Public Methods
		 * 
		 */
		this.add = function(args) {
			var e = { target: args[0], type: args[1] };
			
			if(_.typeCheck("function", args[2])) {
				e = $.extend(e, { callback: args[2] });
			} else if(_.typeCheck("string", args[2])) {
				e = $.extend(e, { children: args[2], callback: args[3] });
			}

            // 이벤트 유형을 배열로 변경
            var eventTypes = _.typeCheck("array", e.type) ? e.type : [ e.type ];

			// 이벤트 유형에 따른 이벤트 설정
            for(var i = 0; i < eventTypes.length; i++) {
                e.type = eventTypes[i]

                if (e.type.toLowerCase().indexOf("animation") != -1)
                    settingEventAnimation(e);
                else {
                    if (e.target != "body" && e.target != window) { // body와 window일 경우에만 이벤트 중첩이 가능
                        $(e.target).off(e.type);
                    }

                    if (_.isTouch) {
                        settingEventTouch(e);
                    } else {
                        settingEvent(e);
                    }
                }
            }
		}
		
		this.trigger = function(selector, type) {
			$(selector).trigger((_.isTouch) ? getEventTouchType(type) : type);
		}
		
		this.get = function(index) {
			return list[index];
		}
		
		this.getAll = function() {
			return list;
		}
		
		this.size = function() {
			return list.length;
		}
	}


    /**
     * UIManager에서 관리되는 객체
     * 객체 생성 정보와 목록을 가지고 있음
     */
    var UICoreSet = function(type, selector, options, list) {
        this.type = type;
        this.selector = selector;
        this.options = options;

        this.destroy = function() {
            for(var i = 0; i < list.length; i++) {
                list[i].destroy();
            }
        }

        for(var i = 0; i < list.length; i++) {
            this.push(list[i]);
        }
    }

    // 배열 클래스 상속
    UICoreSet.prototype = Object.create(Array.prototype);
	
	
	/** 
	 * 각각의 UI별 공통 메소드 (메모리 공유)
	 * 예를 들어 테이블 UI 객체일 경우에 해당되는 모든 요소는 UI 객체에 공유된다.
	 */
	var UICore = function() {
        var vo = null;

        /**
         * 커스텀 이벤트 발생시키는 메소드
         *
         * @param type 발생시킬 이벤트
         * @param args 이벤트 핸들러에 넘기는 값
         * @returns {*} 커스텀 이벤트의 핸들러의 리턴 값 또는 undefined
         */
        this.emit = function(type, args) {
            if(typeof(type) != "string") return;
            var result;

            for(var i = 0; i < this.event.length; i++) {
                var e = this.event[i];

                if(e.type == type.toLowerCase()) {
                    var arrArgs = (typeof(args) == "object" && args.length) ? args : [ args ];
                    result = e.callback.apply(this, arrArgs);
                }
            }

            return result;
        }

        this.on = function(type, callback) {
            if(typeof(type) != "string" || typeof(callback) != "function") return;
            this.event.push({ type: type.toLowerCase(), callback: callback, unique: false  });
        }

        this.off = function(type) {
            var event = [];

            for(var i = 0; i < this.event.length; i++) {
                var e = this.event[i];

                if ((typeof(type) == "function" && e.callback != type) ||
                    (typeof(type) == "string" && e.type != type.toLowerCase())) {
                    event.push(e);
                }
            }

            this.event = event;
        }

        this.addEvent = function() {
            this.listen.add(arguments);
        }

        this.addTrigger = function(selector, type) {
            this.listen.trigger(selector, type);
        }

        this.addValid = function(name, params) {
            if(!this.__proto__) return;
            var ui = this.__proto__[name];

            this.__proto__[name] = function() {
                var args = arguments;

                for(var i = 0; i < args.length; i++) {
                    if(!_.typeCheck(params[i], args[i])) {
                        throw new Error("JUI_CRITICAL_ERR: the " + i + "th parameter is not a " + params[i] + " (" + name + ")");
                    }
                }

                return ui.apply(this, args);
            }
        }

        this.callBefore = function(name, callback) {
            if(!this.__proto__) return;
            var ui = this.__proto__[name];

            this.__proto__[name] = function() {
                var args = arguments;

                if(typeof(callback) == "function") {
                    // before 콜백이 false가 이날 경우에만 실행 한다.
                    if(callback.apply(this, args) !== false) {
                        return ui.apply(this, args);
                    }
                } else {
                    return ui.apply(this, args);
                }
            }
        }

        this.callAfter = function(name, callback) {
            if(!this.__proto__) return;
            var ui = this.__proto__[name];

            this.__proto__[name] = function() {
                var args = arguments,
                    obj = ui.apply(this, args);

                // 실행 함수의 리턴 값이 false일 경우에는 after 콜백을 실행하지 않는다.
                if(typeof(callback) == "function" && obj !== false) {
                    callback.apply(this, args);
                }

                return obj;
            }
        }

        this.callDelay = function(name, callObj) { // void 형의 메소드에서만 사용할 수 있음
            if(!this.__proto__) return;

            var ui = this.__proto__[name],
                delay = (!isNaN(callObj.delay)) ? callObj.delay : 0;

            this.__proto__[name] = function() {
                var self = this,
                    args = arguments;

                if(typeof(callObj.before) == "function") {
                    callObj.before.apply(self, args);
                }

                if(delay > 0) {
                    setTimeout(function() {
                        callFunc(self, args);
                    }, delay);
                } else {
                    callFunc(self, args);
                }
            }

            function callFunc(self, args) {
                var obj = ui.apply(self, args);

                if(typeof(callObj.after) == "function" && obj !== false) { // callAfter와 동일
                    callObj.after.apply(self, args);
                }
            }
        }

        this.setTpl = function(name, html) {
            this.tpl[name] = _.template(html);
        }

        this.setVo = function() { // @Deprecated
            if(!this.options.vo) return;

            if(vo != null) vo.reload();
            vo = $(this.selector).jbinder();

            this.bind = vo;
        }

        this.setOption = function(key, value) {
            if(typeof(key) == "object") {
                for(var k in key) {
                    this.options[k] = key[k];
                }
            } else {
                this.options[key] = value;
            }
        }

        this.destroy = function() {
            if(!this.__proto__) return;

            for(var i = 0; i < this.listen.size(); i++) {
                var obj = this.listen.get(i);
                $(obj.target).off(obj.type);
            }

            for(var key in this.__proto__) {
                delete this.__proto__[key];
            }
        }
	};

    UICore.build = function(UI) {

        return function(selector, options) {
            var $root = $(selector);
            var list = [];

            $root.each(function(index) {
                var mainObj = new UI["class"]();

                // Check Options
                var opts = jui.defineOptions(UI["class"], options || {});

                // Public Properties
                mainObj.init.prototype = mainObj;
                mainObj.init.prototype.selector = $root.selector;
                mainObj.init.prototype.root = this;
                mainObj.init.prototype.options = opts;
                mainObj.init.prototype.tpl = {};
                mainObj.init.prototype.event = new Array(); // Custom Event
                mainObj.init.prototype.listen = new UIListener(); // DOM Event
                mainObj.init.prototype.timestamp = new Date().getTime();
                mainObj.init.prototype.index = index;
                mainObj.init.prototype.module = UI;

                // Template Setting (Markup)
                $("script").each(function(i) {
                    if(selector == $(this).data("jui") || selector == $(this).data("vo")) {
                        var tplName = $(this).data("tpl");

                        if(tplName == "") {
                            throw new Error("JUI_CRITICAL_ERR: 'data-tpl' property is required");
                        }

                        opts.tpl[tplName] = $(this).html();
                    }
                });

                // Template Setting (Script)
                for(var name in opts.tpl) {
                    var tplHtml = opts.tpl[name];

                    if(_.typeCheck("string", tplHtml) && tplHtml != "") {
                        mainObj.init.prototype.tpl[name] = _.template(tplHtml);
                    }
                }

                var uiObj = new mainObj.init();

                // Event Setting
                for(var key in opts.event) {
                    uiObj.on(key, opts.event[key]);
                }

                list[index] = uiObj;

                // 엘리먼트 객체에 jui 속성 추가
                this.jui = uiObj;
            });

            // UIManager에 데이터 입력
            UIManager.add(new UICoreSet(UI.type, selector, options, list));

            // 객체가 없을 경우에는 null을 반환 (기존에는 빈 배열을 반환)
            if(list.length == 0) {
                return null;
            } else if(list.length == 1) {
                return list[0];
            }

            return list;
        }
    }
	
	UICore.init = function(UI) {
		var uiObj = null;
		
		if(typeof(UI) === "object") {
            uiObj = UICore.build(UI);
			UIManager.addClass({ type: UI.type, "class": uiObj });
		}
		
		return uiObj;
	}

    UICore.setup = function() {
        return {
            tpl: {},
            event: {},
            vo: null
        }
    }
	
	// UIManager는 Global 객체로 정의
	window.jui = (typeof(jui) == "object") ? $.extend(jui, UIManager) : UIManager;
	
	return UICore;
});
jui.define("util.math", [], function() {

	/**
	 * math 객체 
	 *  
	 */
	var self = {
		// 2d rotate
		rotate : function(x, y, radian) {
			return {
				x : x * Math.cos(radian) - y * Math.sin(radian),
				y : x * Math.sin(radian) + y * Math.cos(radian)
			}
		},

		// degree to radian
		radian : function(degree) {
			return degree * Math.PI / 180;
		},
		
		// radian to degree 
		degree : function(radian) {
			return radian * 180 / Math.PI;
		},

		// 중간값 계산 하기 
		interpolateNumber : function(a, b) {
			return function(t) {
				return a + (b - a) * t;
			}
		},

		// 중간값 round 해서 계산하기
		interpolateRound : function(a, b) {
			var f = this.interpolateNumber(a, b);

			return function(t) {
				return Math.round(f(t));
			}
		},

		/**
		 * 특정 구간의 값을 자동으로 계산 
		 * 
		 * @param {Object} min
		 * @param {Object} max
		 * @param {Object} ticks
		 * @param {Object} isNice
		 */
		nice : function(min, max, ticks, isNice) {
			isNice = isNice || false;

			if (min > max) {
				var _max = min;
				var _min = max;
			} else {
				var _min = min;
				var _max = max;

			}

			var _ticks = ticks;
			var _tickSpacing = 0;
			var _range = [];
			var _niceMin;
			var _niceMax;

			function niceNum(range, round) {
				var exponent = Math.floor(Math.log(range) / Math.LN10);
				var fraction = range / Math.pow(10, exponent);
				var nickFraction;

				//console.log(range, exponent, fraction, _ticks);

				if (round) {
					if (fraction < 1.5)
						niceFraction = 1;
					else if (fraction < 3)
						niceFraction = 2;
					else if (fraction < 7)
						niceFraction = 5;
					else
						niceFraction = 10;
				} else {
					if (fraction <= 1)
						niceFraction = 1;
					else if (fraction <= 2)
						niceFraction = 2;
					else if (fraction <= 5)
						niceFraction = 5;
					else
						niceFraction = 10;

					//console.log(niceFraction)
				}

				return niceFraction * Math.pow(10, exponent);

			}

			function caculate() {
				_range = (isNice) ? niceNum(_max - _min, false) : _max - _min;
				_tickSpacing = (isNice) ? niceNum(_range / _ticks, true) : _range / _ticks;
				_niceMin = (isNice) ? Math.floor(_min / _tickSpacing) * _tickSpacing : _min;
				_niceMax = (isNice) ? Math.floor(_max / _tickSpacing) * _tickSpacing : _max;
			}

			caculate();

			return {
				min : _niceMin,
				max : _niceMax,
				range : _range,
				spacing : _tickSpacing
			}
		}		
	}

	return self;
});

jui.define("util.time", [ "util.base" ], function(_) {

	/**
	 * time 객체 
	 * 
	 */
	var self = {

		// unit
		years : 0x01,
		months : 0x02,
		days : 0x03,
		hours : 0x04,
		minutes : 0x05,
		seconds : 0x06,
		milliseconds : 0x07,
		weeks : 0x08,

		/**
		 * 시간 더하기 
		 * var date = new Date(); 
		 * 
		 * time.add(date, time.hours, 1); 		// 현재시간에서 1시간 추가  
		 * time.add(date, time.hours, 1, time.minutes, 2); 		// 현재시간에서 1시간 2분 추가   
		 * 
 		 * @param {Object} date
		 */
		add : function(date) {

			if (arguments.length <= 2) {
				return date;
			}

			if (arguments.length > 2) {
				var d = new Date(+date);

				for (var i = 1; i < arguments.length; i += 2) {

					var split = arguments[i];
					var time = arguments[i + 1];

					if (this.years == split) {
						d.setFullYear(d.getFullYear() + time);
					} else if (this.months == split) {
						d.setMonth(d.getMonth() + time);
					} else if (this.days == split) {
						d.setDate(d.getDate() + time);
					} else if (this.hours == split) {
						d.setHours(d.getHours() + time);
					} else if (this.minutes == split) {
						d.setMinutes(d.getMinutes() + time);
					} else if (this.seconds == split) {
						d.setSeconds(d.getSeconds() + time);
					} else if (this.milliseconds == split) {
						d.setMilliseconds(d.getMilliseconds() + time);
					} else if (this.weeks == split) {
						d.setDate(d.getDate() + time * 7);
					}
				}

				return d;
			}
		},
		
		/**
		 * jui.util.dateFormat 의 alias 
		 * 
		 * @param {Object} date
		 * @param {Object} format
		 * @param {Object} utc
		 */
		format: function(date, format, utc) {
			return _.dateFormat(date, format, utc);
        }		
	}

	return self;
});

jui.define("util.scale", [ "util.math", "util.time" ], function(math, _time) {

	/**
	 * 범위(scale)에 대한 계산 
	 * 
	 */
	var self = {

		/**
		 * 원형 좌표에 대한 scale 
		 * 
		 */
		circle : function() {// 원형 radar

			var that = this;

			var _domain = [];
			var _range = [];
			var _rangeBand = 0;

			function func(t) {

			}


			func.domain = function(values) {

				if ( typeof values == 'undefined') {
					return _domain;
				}

				for (var i = 0; i < values.length; i++) {
					_domain[i] = values[i];
				}

				return this;
			}

			func.range = function(values) {

				if ( typeof values == 'undefined') {
					return _range;
				}

				for (var i = 0; i < values.length; i++) {
					_range[i] = values[i];
				}

				return this;
			}

			func.rangePoints = function(interval, padding) {

				padding = padding || 0;

				var step = _domain.length;
				var unit = (interval[1] - interval[0] - padding) / step;

				var range = [];
				for (var i = 0; i < _domain.length; i++) {
					if (i == 0) {
						range[i] = interval[0] + padding / 2 + unit / 2;
					} else {
						range[i] = range[i - 1] + unit;
					}
				}

				_range = range;
				_rangeBand = unit;

				return func;
			}

			func.rangeBands = function(interval, padding, outerPadding) {

				padding = padding || 0;
				outerPadding = outerPadding || 0;

				var count = _domain.length;
				var step = count - 1;
				var band = (interval[1] - interval[0]) / step;

				var range = [];
				for (var i = 0; i < _domain.length; i++) {
					if (i == 0) {
						range[i] = interval[0];
					} else {
						range[i] = band + range[i - 1];
					}
				}

				_rangeBand = band;
				_range = range;

				return func;
			}

			func.rangeBand = function() {
				return _rangeBand;
			}

			return func;

		},

		/**
		 * 
		 * 순서를 가지는 리스트에 대한 scale 
		 * 
		 */
		ordinal : function() {// 순서
			var that = this;

			var _domain = [];
			var _range = [];
			var _rangeBand = 0;
            var _cache = {};

			function func(t) {

                var key = "" + t;
                if (typeof _cache[key] != 'undefined') {
                    return _cache[key];
                }

				var index = -1;
				for (var i = 0; i < _domain.length; i++) {
					if (typeof t == 'string' && _domain[i] === t) {
						index = i;
						break;
					}
				}

				if (index > -1) {
                    _cache[key] = _range[index];
					return _range[index];
				} else {
					if ( typeof _range[t] != 'undefined') {
						_domain[t] = t;
                        _cache[key] = _range[t];
						return _range[t];
					}

					return null;
				}

			}


			func.domain = function(values) {

				if ( typeof values == 'undefined') {
					return _domain;
				}

				for (var i = 0; i < values.length; i++) {
					_domain[i] = values[i];
				}

				return this;
			}

			func.range = function(values) {

				if ( typeof values == 'undefined') {
					return _range;
				}

				for (var i = 0; i < values.length; i++) {
					_range[i] = values[i];
				}

				return this;
			}

			func.rangePoints = function(interval, padding) {

				padding = padding || 0;

				var step = _domain.length;
				var unit = (interval[1] - interval[0] - padding) / step;

				var range = [];
				for (var i = 0; i < _domain.length; i++) {
					if (i == 0) {
						range[i] = interval[0] + padding / 2 + unit / 2;
					} else {
						range[i] = range[i - 1] + unit;
					}
				}

				_range = range;
				_rangeBand = unit;

				return func;
			}

			func.rangeBands = function(interval, padding, outerPadding) {

				padding = padding || 0;
				outerPadding = outerPadding || 0;

				var count = _domain.length;
				var step = count - 1;
				var band = (interval[1] - interval[0]) / step;

				var range = [];
				for (var i = 0; i < _domain.length; i++) {
					if (i == 0) {
						range[i] = interval[0];
					} else {
						range[i] = band + range[i - 1];
					}
				}

				_rangeBand = band;
				_range = range;

				return func;
			}

			func.rangeBand = function() {
				return _rangeBand;
			}

			func.invert = function(x) {
				return Math.ceil(x / _rangeBand);
			}

			return func;
		},

		/**
		 * 시간에 대한 scale 
		 * 
		 */
		time : function() {// 시간

			var that = this;

			var _domain = [];
			var _range = [];
			var _rangeBand;

			var func = self.linear();

			var df = func.domain;

			func.domain = function(domain) {

				if (!arguments.length)
					return df.call(func);

				for (var i = 0; i < domain.length; i++) {
					_domain[i] = +domain[i];
				}

				return df.call(func, _domain);
			}

			func.min = function() {
				return Math.min(_domain[0], _domain[_domain.length - 1]);
			}

			func.max = function() {
				return Math.max(_domain[0], _domain[_domain.length - 1]);
			}

			func.rate = function(value, max) {
				return func(func.max() * (value / max));
			}

			func.ticks = function(type, step) {
				var start = func.min();
				var end = func.max();

				var times = [];
				while (start < end) {
					times.push(new Date(+start));

					start = _time.add(start, type, step);

					//;console.log(start)
				}

				times.push(new Date(+start));
				
				var first = func(times[0]);
				var second = func(times[1]);
				
				_rangeBand = second - first; 
				

				return times;

			}

			func.realTicks = function(type, step) {
				var start = _domain[0];
				var end = _domain[1];

				var times = [];
				var date = new Date(+start)
				var realStart = null;
				if (type == _time.years) {
					realStart = new Date(date.getFullYear(), 0, 1);
				} else if (type == _time.months) {
					realStart = new Date(date.getFullYear(), date.getMonth(), 1);
				} else if (type == _time.days || type == _time.weeks) {
					realStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
				} else if (type == _time.hours) {
					realStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0, 0);
				} else if (type == _time.minutes) {
					realStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0, 0);
				} else if (type == _time.seconds) {
					realStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);
				} else if (type == _time.milliseconds) {
					realStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

				}

				realStart = _time.add(realStart, type, step);
				while (+realStart < +end) {
					times.push(new Date(+realStart));
					realStart = _time.add(realStart, type, step);
				}
				
				var first = func(times[1]);
				var second = func(times[2]);
				
				_rangeBand = second - first; 				

				return times;
			}

			func.rangeBand = function() {
				return _rangeBand;
			}

			func.invert = function(y) {
				var f = self.linear().domain(func.range()).range(func.domain());

				return new Date(f(y));
			}

			return func;
		},
		
		/**
		 * 범위에 대한 scale 
		 * 
		 */
		linear : function() {// 선형

			var that = this;

			var _domain = [0, 1];
			var _range = [0, 1];
			var _isRound = false;
			var _isClamp = false;
            var _cache = {};

			var roundFunction = null;
			var numberFunction = null;

			var domainMin = null;
			var domainMax = null;

			var rangeMin = null;
			var rangeMax = null;

			var distDomain = null;
			var distRange = null;

			function func(x) {

				var key = x + '';

				if (typeof _cache[key] != 'undefined') {
					return _cache[key];
				}

				var max = func.max();
				var min = func.min();

				if (domainMax < x) {
					if (_isClamp) {
						_cache[key] = domainMax;
						return domainMax;
					}

					_cache[key] = _range[0] + Math.abs(x - domainMax) * distDomain / distRange;
					return _cache[key];
				} else if (domainMin > x) {
					if (_isClamp) {
						_cache[key] = domainMin;
						return domainMin;
					}

					_cache[key] = _range[0] - Math.abs(x - domainMin) * distDomain / distRange;
					return _cache[key];
				} else {
					var pos = (x - domainMin) / (distDomain);

					var scale = _isRound ?  roundFunction : numberFunction ;

					_cache[key] = scale(pos);
					return _cache[key];
				}

			}


			func.min = function() {
				return Math.min.apply(Math, _domain);
			}

			func.max = function() {
				return Math.max.apply(Math, _domain);
			}

			func.rangeMin = function() {
				return Math.min.apply(Math, _range);
			}

			func.rangeMax = function() {
				return Math.max.apply(Math, _range);
			}

			func.rate = function(value, max) {
				return func(func.max() * (value / max));
			}
			
			func.clamp = function(isClamp) {
			  _isClamp = isClamp || false; 
			}

			func.domain = function(values) {

				if (!arguments.length) {
					return _domain;
				}

				for (var i = 0; i < values.length; i++) {
					_domain[i] = values[i];
				}

				domainMin = func.min();
				domainMax = func.max();

				distDomain = Math.abs(domainMax - domainMin);

				return this;
			}

			func.range = function(values) {

				if (!arguments.length) {
					return _range;
				}

				for (var i = 0; i < values.length; i++) {
					_range[i] = values[i];
				}

				roundFunction = math.interpolateRound(_range[0], _range[1]);
				numberFunction = math.interpolateNumber(_range[0], _range[1]);

				rangeMin = func.rangeMin();
				rangeMax = func.rangeMax();

				distRange = Math.abs(rangeMax - rangeMin);

				return this;
			}

			func.rangeRound = function(values) {
				_isRound = true;
				return func.range(values);
			}

			func.invert = function(y) {

				var f = self.linear().domain(_range).range(_domain);
				return f(y);
			}

			func.ticks = function(count, isNice, intNumber) {
				intNumber = intNumber || 10000;

				if (_domain[0] == 0 && _domain[1] == 0) {
					return [];
				}

				var obj = math.nice(_domain[0], _domain[1], count || 10, isNice || false);

				var arr = [];

				var start = obj.min * intNumber;
				var end = obj.max * intNumber;
				while (start <= end) {
					arr.push(start / intNumber);
					start += obj.spacing * intNumber;
				}

				if (arr[arr.length - 1] * intNumber != end && start > end) {
					arr.push(end / intNumber);
				}

				return arr;
			}

			return func;
		}
	}

	return self;
});

jui.define("util.color", [], function() {

	/**
	 * color 객체 
	 *  
	 */
	var self = {
		
		regex  : /(linear|radial)\((.*)\)(.*)/i,
		
		trim : function (str) {
			return (str || "").replace(/^\s+|\s+$/g, '');	
		},

		parse : function(color) {
			return this.parseGradient(color);
		},
		
		/**
		 * gradient parser 
		 * 
		 * ex)
		 * 
		 * linear(left) #fff,#000
		 * linear(right) #fff,50 yellow,black
		 * radial(50%,50%,50%,50,50)
		 *  
 		 * @param {Object} color
		 */
		parseGradient : function(color) {
			var matches = color.match(this.regex);
			
			if (!matches) return color; 
			
			var type = this.trim(matches[1]);
			var attr = this.parseAttr(type, this.trim(matches[2]));
			var stops = this.parseStop(this.trim(matches[3]));
			
			var obj = { type : type };
			
			for(var k in attr) {
				obj[k] = attr[k];
			}
			
			obj.stops = stops;
			
			return obj; 
			
		},
		
		parseStop : function(stop) {
			var stop_list = stop.split(",");
			
			var stops = [];
			
			for(var i = 0, len = stop_list.length; i < len; i++) {
				var stop = stop_list[i];
				
				var arr = stop.split(" ");
				
				if (arr.length == 0) continue;
				
				if (arr.length == 1) {
					stops.push({ "stop-color" : arr[0] })
				} else if (arr.length == 2) {
					stops.push({ "offset" : arr[0], "stop-color" : arr[1] })
				} else if (arr.length == 3) {
					stops.push({ "offset" : arr[0], "stop-color" : arr[1], "stop-opacity" : arr[2] })
				}
			}
			
			var start = -1;
			var end = -1; 
			for(var i = 0, len = stops.length; i < len; i++) {
				var stop = stops[i];
				
				if (i == 0) {
					if (!stop.offset) stop.offset = 0; 
				} else if (i == len - 1) {
					if (!stop.offset) stop.offset = 1;
				}
				
				if (start == -1 && typeof stop.offset == 'undefined') {
					start = i;
				} else if (end == -1 && typeof stop.offset == 'undefined') {
					end = i; 
					
					var count = end - start;
					
					var endOffset = stops[end].offset.indexOf("%") > -1 ? parseFloat(stops[end].offset)/100 : stops[end].offset;  
					var startOffset = stops[start].offset.indexOf("%") > -1 ? parseFloat(stops[start].offset)/100 : stops[start].offset;  
					 
					var dist = endOffset - startOffset
					var value = dist/ count; 
					
					var offset = startOffset + value; 
					for(var index = start + 1; index < end; index++) {
						stops[index].offset = offset; 
						
						offset += value; 
					} 
					
					start = end;
					end = -1; 
				}
			}
			
			return stops;
		},
		
		parseAttr : function(type, str) {
			
			
			if (type == 'linear') {
				switch(str) {
				case "":
				case "left": return { x1 : 0, y1 : 0, x2 : 1, y2 : 0, direction : str || "left" }; 
				case "right": return { x1 : 1, y1 : 0, x2 : 0, y2 : 0, direction : str }; 
				case "top": return { x1 : 0, y1 : 0, x2 : 0, y2 : 1, direction : str }; 
				case "bottom": return { x1 : 0, y1 : 1, x2 : 0, y2 : 0, direction : str }; 
				case "top left": return { x1 : 0, y1 : 0, x2 : 1, y2 : 1, direction : str }; 
				case "top right": return { x1 : 1, y1 : 0, x2 : 0, y2 : 1, direction : str }; 
				case "bottom left": return { x1 : 0, y1 : 1, x2 : 1, y2 : 0, direction : str }; 
				case "bottom right": return { x1 : 1, y1 : 1, x2 : 0, y2 : 0, direction : str };
				default : 
					var arr = str.split(",");
					for(var i = 0, len = arr.length; i < len; i++) {
						if (arr[i].indexOf("%") == -1)
							arr[i] = parseFloat(arr[i]);
					}
					
					return { x1 : arr[0], y1 : arr[1],x2 : arr[2], y2 : arr[3] };  
				}				
			} else {
				var arr = str.split(",");
				for(var i = 0, len = arr.length; i < len; i++) {
					
					if (arr[i].indexOf("%") == -1)
						arr[i] = parseFloat(arr[i]);
				}
				
				return { cx : arr[0], cy : arr[1],r : arr[2], fx : arr[3], fy : arr[4] };
			}

		}
	
	}

	return self;
});

jui.define("util.svg.element", [], function() {
    var Element = function() {

        /**
         * 엘리먼트 생성 및 조회 메소드
         *
         */

        this.create = function(type, attr) {
            // 퍼블릭 프로퍼티
            this.element = document.createElementNS("http://www.w3.org/2000/svg", type);
            this.childrens = [];
            this.parent = null;
            this.attributes = {};
            this.styles = {};

            // 기본 속성 설정
            this.attr(attr);
        };
        
        this.each = function(callback) {
            if(typeof(callback) != "function") return;

            for(var i = 0; i < this.childrens.length; i++) {
                var self = this.childrens[i];
                callback.apply(self, [ i, self ]);
            }

            return this.childrens;
        };

        this.get = function(index) {
            if(this.childrens[index]) {
                return this.childrens[index];
            }

            return null;
        }

        this.index = function(obj) {
            for(var i = 0; i < this.childrens.length; i++) {
                if(obj == this.childrens[i]) {
                    return i;
                }
            }

            return -1;
        }

        /**
         * 엘리먼트 관계 메소드
         *
         */

        this.append = function(elem) {
        	if(elem.parent) {
        		elem.remove();	
        	}
        	
            this.childrens.push(elem);
            elem.parent = this;

            return this;
        }

        this.prepend = function(elem) {
            return this.insert(0, elem);
        }

        this.insert = function(index, elem) {
        	if(elem.parent) {
        		elem.remove();	
        	}        	
        	
            this.childrens.splice(index, 0, elem);
            elem.parent = this;

            return this;
        }

        this.remove = function() {
            var index = 0,
                nChild = [],
                pChild = this.parent.childrens;

            for(var i = 0; i < pChild.length; i++) {
                if (pChild[i] == this) {
                    index = i;
                    break;
                }

                nChild.push(pChild[i]);
            }

            this.parent.childrens = nChild;

            return this;
        }

        /**
         * 엘리먼트 DOM 조작 메소드
         *
         */

        this.attr = function(attr) {
            if(typeof attr == "string") {
                return this.element.getAttribute(attr);
            }

            for(var k in attr) {
                this.attributes[k] = attr[k];

                if(k.indexOf("xlink:") != -1) {
                    this.element.setAttributeNS("http://www.w3.org/1999/xlink", k, this.attributes[k]);
                } else {
                    this.element.setAttributeNS(null, k, this.attributes[k]);
                }
            }

            return this;
        }

        this.css = function(css) {
            var list = [];

            for(var k in css) {
                this.styles[k] = css[k];
            }

            for(var k in this.styles) {
                list.push(k + ":" + this.styles[k]);
            }

            this.attr({ style: list.join(";") });

            return this;
        }

        this.html = function(html) {
            this.element.innerHTML = html;

            return this;
        }
        
        this.text = function(text) {
        	this.element.appendChild(document.createTextNode(text));
        	
        	return this; 
        }

        /**
         * 엘리먼트 DOM 이벤트 메소드
         *
         */

        this.on = function(type, handler) {
            this.element.addEventListener(type, function(e) {
                if(typeof(handler) == "function") {
                    handler.call(this, e);
                }
            }, false);

            return this;
        }

        this.hover = function(overHandler, outHandler) {
            this.element.addEventListener("mouseover", function(e) {
                if(typeof(overHandler) == "function") {
                    overHandler.call(this, e);
                }
            }, false);

            this.element.addEventListener("mouseout", function(e) {
                if(typeof(outHandler) == "function") {
                    outHandler.call(this, e);
                }
            }, false);

            return this;
        }

        /**
         * 그 외 메소드
         *
         */
        this.size = function() {
            var size = { width: 0, height: 0 },
                rect = this.element.getBoundingClientRect();

            if(!rect || (rect.width == 0 && rect.height == 0)) {
                var height_list = [ "height", "paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth" ],
                    width_list = [ "width", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth" ];

                var computedStyle = window.getComputedStyle(this.element);

                for (var i = 0; i < height_list.length; i++) {
                    size.height += parseFloat(computedStyle[height_list[i]]);
                }

                for (var i = 0; i < width_list.length; i++) {
                    size.width += parseFloat(computedStyle[width_list[i]]);
                }
            } else {
                size.width = rect.width;
                size.height = rect.height;
            }

            if(isNaN(size.width)) size.width = 0;
            if(isNaN(size.height)) size.height = 0;

            return size;
        }
    }

    return Element;
});

jui.define("util.svg.element.transform", [], function() { // polygon, polyline
    var TransElement = function() {
        var orders = {};

        function applyOrders(self) {
            var orderArr = [];

            for(var key in orders) {
                if(orders[key]) orderArr.push(orders[key]);
            }

            self.attr({ transform: orderArr.join(" ") });
        }

        function getStringArgs(args) {
            var result = [];

            for(var i = 0; i < args.length; i++) {
                result.push(args[i]);
            }

            return result.join(",");
        }

        this.translate = function() {
            orders["translate"] = "translate(" + getStringArgs(arguments) + ")";
            applyOrders(this);

            return this;
        }

        this.rotate = function(angle, x, y) {

            if (arguments.length == 1) {
                var str = angle;
            } else if (arguments.length == 3) {
                var str = angle + " " + x + "," + y;
            }

            orders["rotate"] = "rotate(" + str + ")";
            applyOrders(this);

            return this;
        }

        this.scale = function() {
            orders["scale"] = "scale(" + getStringArgs(arguments) + ")";
            applyOrders(this);

            return this;
        }

        this.skew = function() {
            orders["skew"] = "skew(" + getStringArgs(arguments) + ")";
            applyOrders(this);

            return this;
        }

        this.matrix = function() {
            orders["matrix"] = "matrix(" + getStringArgs(arguments) + ")";
            applyOrders(this);

            return this;
        }
    }

    return TransElement;
}, "util.svg.element");

jui.define("util.svg.element.path", [], function() { // path
    var PathElement = function() {
        var orders = [];
        var ordersString = "";

        function applyOrders(self) {
            if (ordersString.length > 0) {
                self.attr({ d: ordersString });
            } else {
                if(orders.length == 0) return;
                self.attr({ d: orders.join(" ") });
            }

        }

        this.moveTo = function(x, y, type) {
            orders.push( (type || "m") + x + "," + y );
            return this;
        }
        this.MoveTo = function(x, y) {
            return this.moveTo(x, y, "M");
        }

        this.lineTo = function(x, y, type) {
            orders.push( (type || "l") + x + "," + y );
            return this;
        }
        this.LineTo = function(x, y) {
            return this.lineTo(x, y, "L");
        }

        this.hLineTo = function(x, type) {
            orders.push( (type || "h") + x );
            return this;
        }
        this.HLineTo = function(x) {
            return this.hLineTo(x, "H");
        }

        this.vLineTo = function(y, type) {
            orders.push( (type || "v") + y );
            return this;
        }
        this.VLineTo = function(y) {
            return this.vLineTo(y, "V");
        }

        this.curveTo = function(x1, y1, x2, y2, x, y, type) {
            orders.push( (type || "c") + x1 + "," + y1 + " " + x2 + "," + y2 + " " + x + "," + y );
            return this;
        }
        this.CurveTo = function(x1, y1, x2, y2, x, y) {
            return this.curveTo(x1, y1, x2, y2, x, y, "C");
        }

        this.sCurveTo = function(x2, y2, x, y, type) {
            orders.push( (type || "s") + x2 + "," + y2 + " " + x + "," + y );
            return this;
        }
        this.SCurveTo = function(x2, y2, x, y) {
            return this.sCurveTo(x2, y2, x, y, "S");
        }

        this.qCurveTo = function(x1, y1, x, y, type) {
            orders.push( (type || "q") + x1 + "," + y1 + " " + x + "," + y );
            return this;
        }
        this.QCurveTo = function(x1, y1, x, y) {
            return this.qCurveTo(x1, y1, x, y, "Q");
        }

        this.tCurveTo = function(x1, y1, x, y, type) {
            orders.push( (type || "t") + x1 + "," + y1 + " " + x + "," + y );
            return this;
        }
        this.TCurveTo = function(x1, y1, x, y) {
            return this.tCurveTo(x1, y1, x, y, "T");
        }

        this.arc = function(rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y, type) {
            large_arc_flag = (large_arc_flag) ? 1 : 0;
            sweep_flag = (sweep_flag) ? 1 : 0;

            orders.push( (type || "a") + rx + "," + ry + " " + x_axis_rotation + " " + large_arc_flag + "," + sweep_flag + " " + x + "," + y );
            return this;
        }
        this.Arc = function(rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y) {
            return this.arc(rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y, "A");
        }

        this.closePath = function(type) {
            orders.push( (type || "z") );
            return this;
        }
        this.ClosePath = function() {
            return this.closePath("Z");
        }

        this.join = function() {
            applyOrders(this);
        }

        /**
         * 심볼 템플릿
         *
         */
        this.getSymbolTemplate = function(width, height) {
            var r = width;
            var half_width = half_r =  width / 2;
            var half_height = height / 2;

            var start = "a" + half_r + "," + half_r + " 0 1,1 " + r + ",0";
            var end = "a" + half_r + "," + half_r + " 0 1,1 " + -r + ",0";

            var obj = {
                triangle : ["m0," + -half_height, "l" + (half_width) + "," + height, "l" + (-width) + ",0", "l" + (half_width) + "," + (-height)].join(" "),
                rect : ["m" + (-half_width) + "," + (-half_height), "l" + (width) + ",0", "l0," + (height) , "l" + (-width) + ',0', "l0," + (-height)].join(" "),
                cross : ["m" + (-half_width) + ',' + (-half_height), "l" + (width) + "," + (height), "m0," + (-height), "l" + (-width) + "," + (height)].join(" "),
                circle : ["m" + (-r) + ",0", start, end  ].join(" ")
            }

            obj.rectangle = obj.rect;

            return obj;

        }

        /**
         * 심볼 추가 하기 (튜닝)
         */
        this.template = function(cx, cy, tpl) {
            //ordersString += " M" + (cx) + "," + (cy) + tpl;
            orders.push(" M" + (cx) + "," + (cy) + tpl);
        }

        /**
         * path 내 심볼 생성 
         * 
         */
        this.triangle = function(cx, cy, width, height) {
            return this.MoveTo(cx, cy).moveTo(0, -height/2).lineTo(width/2,height).lineTo(-width, 0).lineTo(width/2, -height);
        }
        
        this.rect = this.rectangle = function(cx, cy, width, height) {
            return this.MoveTo(cx, cy).moveTo(-width/2, -height/2).lineTo(width,0).lineTo(0, height).lineTo(-width, 0).lineTo(0, -height);
        }
        
        this.cross = function(cx, cy, width, height) {
            return this.MoveTo(cx, cy).moveTo(-width/2, -height/2).lineTo(width, height).moveTo(0, -height).lineTo(-width, height);
        }
        
        this.circle = function(cx, cy, r) {
            return this.MoveTo(cx, cy).moveTo(-r, 0).arc(r/2, r/2, 0, 1, 1, r, 0).arc(r/2, r/2, 0, 1, 1, -r, 0);
        }
    }

    return PathElement;
}, "util.svg.element.transform");

jui.define("util.svg.element.poly", [], function() { // polygon, polyline
    var PolyElement = function() {
        var orders = [];

        function applyOrders(self) {
            if(orders.length == 0) return;
            self.attr({ points: orders.join(" ") });
        }

        this.point = function(x, y) {
            orders.push(x + "," + y);
            return this;
        }

        this.join = function() {
            if(orders.length > 0) { // Firefox 처리
                var start = orders[0];
                orders.push(start);
            }

            applyOrders(this);
        }
    }

    return PolyElement;
}, "util.svg.element.transform");

jui.define("util.svg",
    [ "util.base", "util.math", "util.svg.element", "util.svg.element.transform",
        "util.svg.element.path", "util.svg.element.poly" ],
    function(_, math, Element, TransElement, PathElement, PolyElement) {

    var SVG = function(rootElem, rootAttr) {
        var self = this,
            root = null,
            main = null,
            sub = null,
            parent = {},
            depth = 0;
        var isFirst = false; // 첫번째 렌더링 체크

        function init() {
            self.root = root = new Element();
            main = new TransElement();
            sub = new TransElement();

            root.create("svg", rootAttr);
            main.create("g");
            sub.create("g");

            main.translate(0.5, 0.5);
            sub.translate(0.5, 0.5);

            rootElem.appendChild(root.element);
            root.append(main);
            root.append(sub);
        }
        
        function create(obj, type, attr, callback) {
            obj.create(type, attr);

            if(depth == 0) {
                main.append(obj);
            } else {
                parent[depth].append(obj);
            }

            if(_.typeCheck("function", callback)) {
                depth++;
                parent[depth] = obj;

                callback.call(obj);
                depth--;
            }

            return obj;
        }

        function createChild(obj, type, attr, callback) {
            if(obj.parent == main) {
                throw new Error("JUI_CRITICAL_ERR: Parents are required elements of the '" + type + "'");
            }

            return create(obj, type, attr, callback);
        }

        function appendAll(target) {
            var len = target.childrens.length;
            for(var i = 0; i < len; i++) {
                var child = target.childrens[i];

                if(child) {
                    if (child.parent == target) {
                        target.element.appendChild(child.element);
                    }

                    if (child.join) { // PathElement & PolyElement auto join
                        child.join();
                    }

                    if (child.childrens.length > 0) {
                        appendAll(child);
                    }
                }
            }
        }

        /**
         * 일반 메소드
         *
         */

        this.size = function() {
            if(arguments.length == 2) {
                var w = arguments[0],
                    h = arguments[1];

                root.attr({ width: w, height: h });
            } else {
                return root.size();
            }
        }

        this.clear = function(isAll) {
            main.each(function() {
                if(this.element.parentNode) {
                    main.element.removeChild(this.element);
                }
            });

            if(isAll === true) {
                sub.each(function() {
                    if(this.element.parentNode) {
                        sub.element.removeChild(this.element);
                    }
                });
            }
        }

        this.reset = function(isAll) {
            this.clear(isAll);
            main.childrens = [];

            if(isAll === true) {
                sub.childrens = [];
            }
        }

        this.render = function(isAll) {
            this.clear();

            if(isFirst === false || isAll === true) {
                appendAll(root);
            } else {
                appendAll(main);
            }

            isFirst = true;
        }

        this.download = function(name) {
            if(_.typeCheck("string", name)) {
                name = name.split(".")[0];
            }

            var a = document.createElement('a');
            a.download = (name) ? name + ".svg" : "svg.svg";
            a.href = this.toDataURL()//;_.svgToBase64(rootElem.innerHTML);

            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        }
        
        this.downloadImage = function(name, type) {
            type = type || "image/png";

            var img = new Image();
            var size = this.size();
            var uri = this.toDataURL()
                            .replace('width="100%"', 'width="' + size.width + '"')
                            .replace('height="100%"', 'height="' + size.height + '"');
            img.onload = function(){
              var canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              
              var context = canvas.getContext('2d');
              context.drawImage(img, 0, 0);
              
              var png = canvas.toDataURL(type);
              
              if(_.typeCheck("string", name)) {
                  name = name.split(".")[0];
              }              
              
              var a = document.createElement('a');
              a.download = (name) ? name + ".png" : "svg.png";
              a.href = png;
  
              document.body.appendChild(a);
              a.click();
              a.parentNode.removeChild(a);
            }

            img.src = uri;   
      
        }

        this.exportCanvas = function(canvas) {
            var img = new Image(),
                size = this.size();

            var uri = this.toDataURL()
                .replace('width="100%"', 'width="' + size.width + '"')
                .replace('height="100%"', 'height="' + size.height + '"');

            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;

                var context = canvas.getContext('2d');
                context.drawImage(img, 0, 0);
            }

            img.src = uri;
        }
        
        this.toXml = function() {
            var text = rootElem.innerHTML;

            text = text.replace('xmlns="http://www.w3.org/2000/svg"', '');

            return [
                '<?xml version="1.0" encoding="utf-8"?>',
                text.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
            ].join("\n");
        }
        
        this.toDataURL = function(type, callback) {
            type = type || "image/svg+xml";

            var xml = this.toXml();

            if (_.browser.mozilla || _.browser.msie) {
                xml = encodeURIComponent(xml);
            }

            if (_.browser.msie) {
                return "data:image/svg+xml," + xml;
            } else {
                return "data:image/svg+xml;utf8," + xml;
            }

        }

        this.autoRender = function(elem, isAuto) {
            if(depth > 0) return;

            if(!isAuto) {
                sub.append(elem);
            } else {
                main.append(elem);
            }
        }
        
        this.getTextRect = function(text) {

            if (text == "") {
                return { width : 0, height : 0 };
            }

            var el = document.createElementNS("http://www.w3.org/2000/svg", "text");
            el.setAttributeNS(null, "x", -200);
            el.setAttributeNS(null, "y", -200);
            el.appendChild(document.createTextNode(text));


        	root.element.appendChild(el);
        	var rect = el.getBoundingClientRect();

            root.element.removeChild(el);

        	return { width : rect.width, height : rect.height }; 
        }

        /**
         * 엘리먼트 생성 메소드
         *
         */

        this.custom = function(name, attr, callback) {
            return create(new Element(), name, attr, callback);
        }

        this.defs = function(callback) {
            return create(new Element(), "defs", null, callback);
        }

        this.symbol = function(attr, callback) {
            return create(new Element(), "symbol", attr, callback);
        }

        this.g = this.group = function(attr, callback) {
            return create(new TransElement(), "g", attr, callback);
        }

        this.marker = function(attr, callback) {
            return create(new Element(), "marker", attr, callback);
        }

        this.a = function(attr, callback) {
            return create(new TransElement(), "a", attr, callback);
        }

        this.switch = function(attr, callback) {
            return create(new Element(), "switch", attr, callback);
        }

        this.use = function(attr) {
            return create(new Element(), "use", attr);
        }

        this.rect = function(attr, callback) {
            return create(new TransElement(), "rect", attr, callback);
        }

        this.line = function(attr, callback) {
            return create(new TransElement(), "line", attr, callback);
        }

        this.circle = function(attr, callback) {
            return create(new TransElement(), "circle", attr, callback);
        }

        this.text = function(attr, textOrCallback) {
            if(arguments.length == 2) {
                if (_.typeCheck("function", textOrCallback)) {
                    return create(new TransElement(), "text", attr, textOrCallback);
                }

                return create(new TransElement(), "text", attr).text(textOrCallback);
            }

            return create(new TransElement(), "text", attr);
        }

        this.textPath = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return create(new Element(), "textPath", attr).text(text);
            }

            return create(new Element(), "textPath", attr);
        }

        this.tref = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return create(new Element(), "tref", attr).text(text);
            }

            return create(new Element(), "tref", attr);
        }

        this.tspan = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return create(new Element(), "tspan", attr).text(text);
            }

            return create(new Element(), "tspan", attr);
        }

        this.ellipse = function(attr, callback) {
            return create(new TransElement(), "ellipse", attr, callback);
        }

        this.image = function(attr, callback) {
            return create(new TransElement(), "image", attr, callback);
        }

        this.path = function(attr, callback) {
            return create(new PathElement(), "path", attr, callback);
        }

        this.polyline = function(attr, callback) {
            return create(new PolyElement(), "polyline", attr, callback);
        }

        this.polygon = function(attr, callback) {
            return create(new PolyElement(), "polygon", attr, callback);
        }

        this.pattern = function(attr, callback) {
            return create(new Element(), "pattern", attr, callback);
        }

        this.mask = function(attr, callback) {
            return create(new Element(), "mask", attr, callback);
        }

        this.clipPath = function(attr, callback) {
            return create(new Element(), "clipPath", attr, callback);
        }

        this.linearGradient = function(attr, callback) {
            return create(new Element(), "linearGradient", attr, callback);
        }

        this.radialGradient = function(attr, callback) {
            return create(new Element(), "radialGradient", attr, callback);
        }

        this.filter = function(attr, callback) {
            return create(new Element(), "filter", attr, callback);
        }

        /**
         * 엘리먼트 관련 메소드 (그라데이션)
         *
         */

        this.stop = function(attr) {
            return createChild(new Element(), "stop", attr);
        }

        /**
         * 엘리먼트 관련 메소드 (애니메이션)
         *
         */

        this.animate = function(attr) {
            return createChild(new Element(), "animate", attr);
        }

        this.animateColor = function(attr) {
            return createChild(new Element(), "animateColor", attr);
        }

        this.animateMotion = function(attr) {
            return createChild(new Element(), "animateMotion", attr);
        }

        this.animateTransform = function(attr) {
            return createChild(new Element(), "animateTransform", attr);
        }

        this.mpath = function(attr) {
            return createChild(new Element(), "mpath", attr);
        }

        this.set = function(attr) {
            return createChild(new Element(), "set", attr);
        }

        /**
         * 엘리먼트 관련 메소드 (필터)
         *
         */

        this.feBlend = function(attr) {
            return createChild(new Element(), "feBlend", attr);
        }

        this.feColorMatrix = function(attr) {
            return createChild(new Element(), "feColorMatrix", attr);
        }

        this.feComponentTransfer = function(attr) {
            return createChild(new Element(), "feComponentTransfer", attr);
        }

        this.feComposite = function(attr) {
            return createChild(new Element(), "feComposite", attr);
        }

        this.feConvolveMatrix = function(attr) {
            return createChild(new Element(), "feConvolveMatrix", attr);
        }

        this.feDiffuseLighting = function(attr) {
            return createChild(new Element(), "feDiffuseLighting", attr);
        }

        this.feDisplacementMap = function(attr) {
            return createChild(new Element(), "feDisplacementMap", attr);
        }

        this.feFlood = function(attr) {
            return createChild(new Element(), "feFlood", attr);
        }

        this.feGaussianBlur = function(attr) {
            return createChild(new Element(), "feGaussianBlur", attr);
        }

        this.feImage = function(attr) {
            return createChild(new Element(), "feImage", attr);
        }

        this.feMerge = function(attr, callback) {
            return createChild(new Element(), "feMerge", attr, callback);
        }

        this.feMergeNode = function(attr) {
            return createChild(new Element(), "feMergeNode", attr);
        }

        this.feMorphology = function(attr) {
            return createChild(new Element(), "feMorphology", attr);
        }

        this.feOffset = function(attr) {
            return createChild(new Element(), "feOffset", attr);
        }

        this.feSpecularLighting = function(attr) {
            return createChild(new Element(), "feSpecularLighting", attr);
        }

        this.feTile = function(attr) {
            return createChild(new Element(), "feTile", attr);
        }

        this.feTurbulence = function(attr) {
            return createChild(new Element(), "feTurbulence", attr);
        }

        init();
    }

    return SVG;
});
jui.define("util.svg3d", [ "util.base", "util.math", "util.svg" ], function(_, math, SVGUtil) {
    var SVG = function(rootElem, rootAttr) {
        var svg = null;

        function init() {
            svg = new SVGUtil(rootElem, rootAttr);
        }

        /**
         * 일반 메소드
         *
         */

        this.size = function() {
            return svg.size();
        }

        this.clear = function(isAll) {
            return svg.clear(isAll);
        }

        this.reset = function(isAll) {
            return svg.reset(isAll);
        }

        this.render = function(isAll) {
            return svg.render(isAll);
        }

        /**
         * 엘리먼트 생성 메소드 (3D)
         *
         */

        this.rect3d = function(attr) {
            var radian = math.radian(attr.degree),
                x1 = 0, y1 = 0,
                w1 = attr.width, h1 = attr.height;

            var x2 = (Math.cos(radian) * attr.depth) + x1,
                y2 = (Math.sin(radian) * attr.depth) + y1;

            var w2 = attr.width + x2,
                h2 = attr.height + y2;

            var g = svg.group({
                width: w2,
                height: h2
            }, function() {
                delete attr.width, attr.height, attr.degree, attr.depth;

                svg.path(attr)
                    .MoveTo(x2, x1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2)
                    .LineTo(x1, y2);

                svg.path(attr)
                    .MoveTo(x1, y2)
                    .LineTo(x1, h2)
                    .LineTo(w1, h2)
                    .LineTo(w1, y2)
                    .ClosePath();

                svg.path(attr)
                    .MoveTo(w1, h2)
                    .LineTo(w2, h1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2)
                    .ClosePath();
            });

            return g;
        }

        init();
    }

    return SVG;
});
jui.defineUI("ui.button", [ "jquery", "util.base" ], function($, _) {

    var UIRadio = function(ui, element, options) {
		this.data = { index: 0, value: "", elem: null };
		
		this.ui = ui;
		this.element = element;
		this.options = $.extend({ index: 0, value: "" }, options);
		
		// Private
		this._setting = function(type, e, order) {
			var self = this,
				className = "active",
				index = this.options.index,
				value = this.options.value;

			$(self.element).children(".btn").each(function(i) {
				if(type == "event") {
					if(e.currentTarget == this) on(i, this);
					else off(this);
				} else if(type == "init") {
					if(order == "value") {
						if(value == $(this).attr("value")) on(i, this);
						else off(this);
					} else {
						if(index == i) on(i, this);
						else off(this);
					}
				}
			});

			function on(i, elem) {
				var value = $(elem).attr("value"),
					text = $(elem).text();

				self.data = { index: i, value: value, text: text };
				$(elem).addClass(className);
			}

			function off(elem) {
				$(elem).removeClass(className);
			}
		}

		this.init = function() {
			var self = this;

			// Event
			this.ui.addEvent($(self.element).children(".btn"), "click", function(e) {
				self._setting("event", e);

                self.ui.emit("click", [ self.data, e ]);
				self.ui.emit("change", [ self.data, e ]);

				e.preventDefault();
			});

			// Init
			if(this.options.value != "") {
				this._setting("init", this.options.value, "value");
			} else {
				this._setting("init", this.options.index, "index");
			}
		}
	}

	var UICheck = function() {
		this.data = [];
		this.options = $.extend({ index: [], value: [] }, this.options);

		// Private
		this._setting = function(type, e, order) {
			var self = this,
				className = "active",
				index = this.options.index,
				value = this.options.value;

			$(self.element).children(".btn").each(function(i) {
				if(type == "init") {
					if(order == "value") {
						if(inArray(value, $(this).attr("value"))) on(i, this);
						else off(i, this);
					} else {
						if(inArray(index, i)) on(i, this);
						else off(i, this);
					}
				} else {
					if(e.currentTarget == this) {
						if(!$(this).hasClass("active")) on(i, this);
						else off(i, this);
					}
				}
			});
			
			function on(i, elem) {
				var value = $(elem).attr("value"),
					text = $(elem).text();
			
				self.data[i] = { index: i, value: value, text: text };
				$(elem).addClass(className);
			}
			
			function off(i, elem) {
				self.data[i] = null;
				$(elem).removeClass(className);
			}
			
			function inArray(arr, val) {
				for(var i = 0; i < arr.length; i++) {
					if(arr[i] == val) return true;
				}
				
				return false;
			}
		}
	}
	
	var UI = function() {
		var ui_list = {};


		/**
		 * Public Methods
		 * 
		 */

		this.init = function() {
            var self = this, opts = this.options;
			
			if(opts.type == "radio") {
				ui_list[opts.type] = new UIRadio(self, this.root, self.options);
				ui_list[opts.type].init();
			} else if(opts.type == "check") {
				UICheck.prototype = new UIRadio(self, this.root, self.options);
				
				ui_list[opts.type] = new UICheck();
				ui_list[opts.type].init();
			}
		}
		
		this.setIndex = function(indexList) {
            var btn = ui_list[this.options.type];

			btn.options.index = indexList;
            btn._setting("init", null, "index");

            this.emit("change", [ btn.data ]);
		}

		this.setValue = function(valueList) {
            var btn = ui_list[this.options.type];

            btn.options.value = valueList;
            btn._setting("init", null, "value");

            this.emit("change", [ btn.data ]);
		}
		
		this.getData = function() {
			return ui_list[this.options.type].data;
		}
		
		this.getValue = function() {
            var data = this.getData();

            if(_.typeCheck("array", data)) { // 타입이 체크일 경우
                var values = [];

                for(var i = 0; i < data.length; i++) {
                    values[i] = (data[i] != null) ? data[i].value : data[i];
                }

                return values;
            }

			return data.value;
		}

		this.reload = function() {
			ui_list[this.options.type]._setting("init");
		}
	}

    UI.setup = function() {
        return {
			type: "radio",
			index: 0,
			value: ""
        }
    }
	
	return UI;
});
jui.defineUI("ui.combo", [ "jquery", "util.base" ], function($, _) {
	
	/**
	 * Common Logic
	 * 
	 */
	var hideAll = function() {
		var call_list = jui.get("ui.combo");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i];
			
			for(var j = 0; j < ui_list.length; j++) {
				if(ui_list[j].type == "open") ui_list[j].fold();
			}
		}
	}
	
	$(function() { 
		$("body").on("click", function(e) {
			hideAll();
		});
	});
	
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var ui_list = null, ui_data = null;
		var index = -1;
					
		/**
		 * Private Methods
		 * 
		 */
		function load(type, data) {
			var $combo_root = ui_list["root"],
				$combo_text = ui_list["text"],
				$combo_drop = ui_list["drop"],
				$combo_list = $combo_drop.children("li");

			$combo_list.each(function(i) {
				var elem = getElement(this),
					value = $(elem).attr("value"),
					text = $(elem).text();
				
				if(!value) { 
					value = text;
					$(elem).attr("value", value);
				}
				
				if((type == "index" && data == i) || (type == "value" && data == value)) {
					ui_data = { index: i, value: value, text: text };
					
					$combo_root.attr("value", value);
					$combo_text.html(text);
					
					if ($combo_root.select && $combo_root.select[0] ) {
						$combo_root.select[0].selectedIndex = i;
					}
				}
			});
			
			if($combo_list.size() == 0) {
				ui_data = null;
			}
		}
		
		function getElement(target) { // 드롭다운 메뉴 타겟
			return ($(target).children("a").size() > 0) ? $(target).children("a")[0] : target;
		}
		
		function setEventKeydown(self) {
			if(!self.options.keydown) return;
			
			self.addEvent(window, "keydown", function(e) {
				if(self.type == "hide") return;
				var $list = ui_list["drop"].children("li");
				
				if(e.which == 38) { // up
					if(index < 1) index = $list.size() - 1;
					else index--;
					
					selectItem(self, function() {
						index--;
						selectItem(self);
					});
					
					return false;
				}
				
				if(e.which == 40) { // down
					if(index < $list.size() - 1) index++;
					else index = 0;
					
					selectItem(self, function() {
						index++;
						selectItem(self);
					});
					
					return false;
				}
				
				if(e.which == 13) { // enter
					$list.eq(index).trigger("click");
					index = -1;
				}
			});
		}
		
		function selectItem(self, callback) {
			var $list = ui_list["drop"].children("li"),
				$target = $list.eq(index);
			
			$list.removeClass("active");

			if($target.val() != "" || $target.html() != "") {
				$target.addClass("active");
				
				if(self.options.height > 0) {
					ui_list["drop"].scrollTop(index * $target.outerHeight());
				}
			} else {
				if(typeof(callback) == "function") {
					callback();
				}
			}
		}
		
		function makeSelectTouch(self) {
			if(!_.isTouch) return;
			
			var $combo_root = ui_list["root"];
			
			if ($combo_root.select && $combo_root.select[0]) {
				var $select = $combo_root.select;
				$select.empty();
			} else {
				var $select = $("<select></select>").css({
					position: "absolute",
					opacity : 0.01
				});
				
				$combo_root.find("ul").after($select);					
				
				self.addEvent($select, "change", function(e) {
					var elem = $(e.currentTarget).find("option:selected").data("elem");
					self.addTrigger(elem, "touchstart");
				});
				
				$combo_root.select = $select;
			}

			$combo_root.find("ul > li").each(function(i, elem) {
				var value = $(elem).data('value');
				var text = $(elem).text();
				
				$select.append($("<option></option>").val(value).text(text).data("elem", elem));
			});
		}
		
		
		/**
		 * Public Methods
		 * 
		 */
		
		this.init = function() {
			var self = this, opts = this.options;
			
			var $combo_root 	= $(this.root),
				$combo_text 	= $combo_root.children(".btn").not(".btn-toggle"),
				$combo_toggle 	= $combo_root.children(".btn-toggle"),
				$combo_click	= $combo_root.children(".btn"),
				$combo_drop 	= $combo_root.children("ul");
			
			//-- 드롭다운은 중앙으로 위치 (그룹 스타일 좌/우 라운드 효과)
			$combo_drop.insertAfter($combo_text);
			
			// Width
			if(opts.width > 0) {
				$combo_text.outerWidth(opts.width - $combo_toggle.outerWidth() + 1);
				$combo_text.css({
					"overflow": "hidden",
					"white-space": "nowrap"
				});
			}
			
			// Height
			if(opts.height > 0) {
				$combo_drop.css({ "maxHeight": opts.height, "overflow": "auto" });
			}
			
			// Show
			this.addEvent($combo_click, "click", function(e) {
				if (_.isTouch) {
					$combo_root.select.focus();
				} else {
					if(self.type == "open") return;
					
					hideAll();
					self.open(e);					
				}
				
				return false;
			});
			
			// Select
			this.addEvent($combo_drop, "click", "li:not(.divider)", function(e) {
				hideAll();

                var elem = getElement(this),
                    value = $(elem).attr("value"),
                    text = $(elem).text();
					
				ui_data = { value: value, text: text, element: elem };
				$combo_text.html(text);
				$combo_root.attr("value", value);

                self.emit("click", [ ui_data, e ]);
				self.emit("change", [ ui_data, e ]);

				e.preventDefault();
			});
			
			// Init
			ui_list = { root: $combo_root, text: $combo_text, drop: $combo_drop, toggle: $combo_toggle };

			this.type = "fold"; // 기본 타입 설정
			this.reload();
			
			//  Key up/down event
			setEventKeydown(this);
		}
		
		this.setIndex = function(index) {
			load("index", index);
			this.emit("change", [ ui_data ]);
		}

		this.setValue = function(value) {
			load("value", value);
			this.emit("change", [ ui_data ]);
		}
		
		this.getData = function() {
			return ui_data;
		}
		
		this.getValue = function() {
			return (ui_data != null) ? ui_data["value"] : null;
		}

		this.getText = function() {
			return (ui_data != null) ? ui_data["text"] : null;
		}
		
		this.open = function(e) {
			ui_list["toggle"].addClass("active");
			ui_list["drop"].outerWidth(ui_list["root"].outerWidth() - 1);

			if(this.options.position == "top") {
				var h = ui_list["drop"].outerHeight();
				
				ui_list["drop"].animate({
				    top: "-" + h,
				    height: "toggle"
				}, 100);
			} else {
				ui_list["drop"].slideDown(100);
			}

			this.emit("open", e);
			this.type = "open";
		}
		
		this.fold = function() {
			ui_list["drop"].hide();
			ui_list["toggle"].removeClass("active");
			
			if(this.options.position == "top") {
				ui_list["drop"].css("top", 0);
			}
			
			this.emit("fold");
			this.type = "fold";
		}
		
		this.reload = function() {
			if(this.options.value != "") {
				load("value", this.options.value);
			} else {
				load("index", this.options.index);
			}
			
			makeSelectTouch(this);
			
			this.emit("reload", ui_data);
		}
	}

    UI.setup = function() {
        return {
			index: 0,
			value: "",
			width: 0,
			height: 100,
			keydown: false,
			position: "bottom"
        }
    }
	
	return UI;
});
jui.defineUI("ui.datepicker", [ "jquery", "util.base" ], function($, _) {

    /**
     * UI Class
     *
     */
    var UI = function() {
    	var year = null, month = null, date = null,
            selDate = null, items = {}; // 헌재 페이지의 요소 엘리먼트 캐싱
        var $head = null, $body = null;


        /**
         * Private Methods
         *
         */
        function setCalendarEvent(self) {
            self.addEvent($head.children(".prev"), "click", function(e) {
                self.prev(e);
            });

            self.addEvent($head.children(".next"), "click", function(e) {
                self.next(e);
            });
        }
        
        function setCalendarDate(self, no) {
        	var opts = self.options;

            if(opts.type == "daily") {
            	var m = (month < 10) ? "0" + month : month,
            		d = (no < 10) ? "0" + no : no;
                selDate = new Date(year + "/" + m + "/" + d);
            } else if(opts.type == "monthly") {
            	var m = (no < 10) ? "0" + no : no;
                selDate = new Date(year + "/" + m + "/01");
            } else if(opts.type == "yearly") {
                selDate = new Date(no + "/01/01");
            }
        }

        function getCalendarDate(self) {
        	var opts = self.options,
        		tmpDate = null;
        	
        	if(opts.type == "daily") {
        		var m = (month < 10) ? "0" + month : month;
        		tmpDate = new Date(year + "/" + m + "/01");
        	} else if(opts.type == "monthly") {
        		tmpDate = new Date(year + "/01/01");
        	} else if(opts.type == "yearly") {
        		tmpDate = new Date();
        	}
        	
        	return tmpDate;
        }

        function getCalendarHtml(self, obj) {
            var opts = self.options;
            var resHtml = "",
            	tmpItems = [];
            
            // 활성화 날짜 캐시 초기화
            items = {};

            for(var i = 0; i < obj.objs.length; i++) {
                tmpItems.push(obj.nums[i]);

                if(isNextBr(i)) {
                    resHtml += self.tpl["dates"]({ dates: tmpItems });
                    tmpItems = [];
                }
            }

            var $list = $(resHtml);
            $list.find("td").each(function(i) {
                $(this).addClass(obj.objs[i].type);

                self.addEvent(this, "click", function(e) {
                    if(obj.objs[i].type == "none") return;

                    $body.find("td").removeClass("active");
                    $(this).addClass("active");
                    
                    setCalendarDate(self, obj.objs[i].no);
                    self.emit("select", [ self.getFormat(), e ]);
                });
                
                if(obj.objs[i].type != "none") {
                	items[obj.objs[i].no] = this;
                }
            });

            function isNextBr(i) {
                return (opts.type == "daily") ? ((i + 1) % 7 == 0) : ((i + 1) % 3 == 0);
            }

            return $list;
        }

        function getLastDate(year, month) {
            if(month == 2) {
                if(year % 100 != 0 && (year % 4 == 0 || year % 400 == 0))
                    return 29;
                else
                    return 28;
            } else {
                var months = [ 31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
                return months[month - 1];
            }
        }

        function getDateList(y, m) {
            var objs = [],
                nums = [],
                no = 1;

            var d = new Date(),
                start = new Date(y + "-" + ((m < 10) ? "0" + m : m)).getDay(),
                ldate = getLastDate(y, m);

            var prevYear = (m == 1) ? y - 1 : y,
                prevMonth = (m == 1) ? 12 : m - 1,
                prevLastDay = getLastDate(prevYear, prevMonth);

            for(var i = 0; i < start; i++) {
                nums[i] = (prevLastDay - start) + (i + 1);
                objs[i] = { type: "none", no: nums[i] };
            }

            for(var i = start; i < 42; i++) {
                if(no <= ldate) {
                    nums[i] = no;
                    objs[i] = { type: (d.getMonth() + 1 == m && d.getDate() == no) ? "now": "", no: nums[i] };
                    no++;
                } else {
                    nums[i] = no - ldate;
                    objs[i] = { type: "none", no: nums[i] };
                    no++;
                }
            }

            return { objs: objs, nums: nums };
        }

        function getMonthList(y) {
            var objs = [],
                nums = [];

            var d = new Date();

            for(var i = 1; i <= 12; i++) {
                nums.push(i);
                objs.push({ type: (d.getFullYear() == year && d.getMonth() + 1 == i) ? "now": "", no: i });
            }

            return { objs: objs, nums: nums };
        }

        function getYearList(y) {
            var objs = [],
                nums = [],
                startYear = y - 4;

            var d = new Date();

            for(var i = startYear; i < startYear + 12; i++) {
                nums.push(i);
                objs.push({ type: (d.getFullYear() == i) ? "now": "", no: i });
            }

            return { objs: objs, nums: nums };
        }


        /**
         * Public Methods
         *
         */

        this.init = function() {
            $head = $(this.root).children(".head");
            $body = $(this.root).children(".body");

            // 이벤트 정의
            setCalendarEvent(this);

            // 기본 날짜 설정
            this.select(this.options.date);
        }
        
        this.page = function(y, m) {
            if(arguments.length == 0) return;
            var opts = this.options;

            if(opts.type == "daily") {
                year = y;
                month = m;
                
                $body.find("tr:not(:first-child)").remove();
                $body.append(getCalendarHtml(this, getDateList(year, month)));
            } else if(opts.type == "monthly") {
                year = y;
                
                $body.find("tr").remove();
                $body.append(getCalendarHtml(this, getMonthList(year)));
            } else if(opts.type == "yearly") {
                year = y;

                $body.find("tr").remove();
                $body.append(getCalendarHtml(this, getYearList(year)));
            }
            
            $head.children(".title").html(_.dateFormat(getCalendarDate(this), opts.titleFormat));
        }

        this.prev = function(e) {
            var opts = this.options;

            if(opts.type == "daily") {
                var y = (month == 1) ? year - 1 : year,
                    m = (month == 1) ? 12 : month - 1;
                
                this.page(y, m);
            } else if(opts.type == "monthly") {
                this.page(year - 1);
            } else if(opts.type == "yearly") {
                this.page(year - 12);
            }
            
            this.emit("prev", [ e ]);
        }
        
        this.next = function(e) {
            var opts = this.options;

            if(opts.type == "daily") {
                var y = (month == 12) ? year + 1 : year,
                    m = (month == 12) ? 1 : month + 1;

                this.page(y, m);
            } else if(opts.type == "monthly") {
                this.page(year + 1);
            } else if(opts.type == "yearly") {
                this.page(year + 12);
            }

            this.emit("next", [ e ]);
        }
        
        this.select = function() {
        	var opts = this.options,
        		args = arguments;

        	if(args.length == 0) {
        		y = year;
        		m = month;
        		d = date;
        	} else if(args.length == 3) {
        		y = args[0];
        		m = args[1];
        		d = args[2];
        	} else if(args.length == 1) {
        		var time = (_.typeCheck("date", args[0])) ? args[0] : new Date(args[0]);

        		y = time.getFullYear();
        		m = time.getMonth() + 1;
        		d = time.getDate();
        	}

            if(opts.type == "daily") {
            	this.page(y, m);
            	this.addTrigger(items[d], "click");
            } else if(opts.type == "monthly") {
            	this.page(y);
            	this.addTrigger(items[m], "click");
            } else if(opts.type == "yearly") {
                this.page(y);
                this.addTrigger(items[y], "click");
            }
        }
        
        this.addTime = function(time) {
        	selDate = new Date(this.getTime() + time);
        	this.select(this.getTime());
        }

        this.getDate = function() {
            return selDate;
        }

        this.getTime = function() {
            return selDate.getTime();
        }

        this.getFormat = function(format) {
            return _.dateFormat(selDate, (typeof(format) == "string") ? format : this.options.format);
        }
    }

    UI.setup = function() {
        return {
            type: "daily",
            titleFormat: "yyyy.MM",
            format: "yyyy-MM-dd",
            date: new Date(),
            animate: false // @Deprecated
        };
    }

    return UI;
});
jui.defineUI("ui.dropdown", [ "jquery" ], function($) {
	
	/**
	 * Common Logic
	 * 
	 */
	var hideAll = function() {
		var dd = getDropdown();
		
		if(dd != null) {
			dd.hide();
		}
	}
	
	var getDropdown = function() {
		var call_list = jui.get("ui.dropdown");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i];
			
			for(var j = 0; j < ui_list.length; j++) {
				if(ui_list[j].type == "show") return ui_list[j];
			}
		}
		
		return null;
	}
	
	$(function() { 
		$("body").on("click", function(e) {
			var tn = e.target.tagName;
			
			if(tn != "LI" && tn != "INPUT" && tn != "A" && tn != "BUTTON" && tn != "I") {
				hideAll();
			}
		});
		
		$(window).on("keydown", function(e) {
			var dd = getDropdown();
			
			if(dd != null) {
				dd.wheel(e.which, function() {
					e.preventDefault();
				});
			}
		});
	});
	
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var ui_list = null, index = -1;
		
		
		/**
		 * Private Methods
		 * 
		 */
		function setEventNodes(self) {
			var $list = $(ui_list.menu).find("li");
			
			// 이벤트 걸린거 초기화
			$list.off("click").off("hover");
			
			// 클릭 이벤트 설정
			self.addEvent($list, "click", function(e) {
				if($(this).hasClass("divider")) return;
				
				var index = getTargetIndex(this),
					text = $(this).text(),
					value = $(this).attr("value");
				
				self.emit("change", [ { index: index, value: value, text: text }, e ]);
				
				// close가 true일 경우, 전체 드롭다운 숨기기
				if(self.options.close) hideAll();
				
				// A 태그일 경우에는 이벤트 막기
				if(e.target.tagName == "A") {
					e.preventDefault();
				}
			});
			
			// 마우스 오버시 hover 클래스 제거
			self.addEvent($list, "hover", function(e) {
				$list.removeClass("active");
			});
			
			function getTargetIndex(elem) {
				var result = 0;
				
				$list.each(function(i) {
					if(elem == this) {
						result = i;
					}
				});
				
				return result;
			}
		}

		function selectItem(self, callback) {
			var $list = ui_list.menu.find("li"),
				$target = $list.eq(index);
			
			$list.removeClass("active");
			
			if($target.val() != "" || $target.html() != "") {
				$target.addClass("active");
				
				if(self.options.height > 0) {
					ui_list.menu.scrollTop(index * $target.outerHeight());
				}
			} else {
				if(typeof(callback) == "function") {
					callback();
				}
			}
		}
		
		
		/**
		 * Public Methods
		 * 
		 */
		
		this.init = function() {
			var opts = this.options;
			
			var $dd_root = $(this.root),
				$dd_menu = $dd_root.find("ul"),
				$dd_anchor = $dd_root.find(".anchor");
			
			// 메인 설정, 없을 경우에는 root가 메인이 됨
			$dd_menu = ($dd_menu.size() == 0) ? $dd_root : $dd_menu;
			
			// UI 객체 추가
			ui_list = { root: $dd_root, menu: $dd_menu, anchor: $dd_anchor };

			// Size
			ui_list.root.outerWidth(ui_list.menu.outerWidth());
			
			// Width
			if(opts.width > 0) {
				$dd_menu.outerWidth(opts.width);
			}
			
			// Height
			if(opts.height > 0) {
				$dd_menu.css({ "maxHeight": opts.height, "overflow": "auto" });
			}
			
			// Left
			if(opts.left > 0) {
				$dd_root.css("left", opts.left);
			}

			// Top
			if(opts.top > 0) {
				$dd_root.css("top", opts.top);
			}
			
			// Default Styles
			$dd_menu.css({ "display": "block" });
			$dd_root.css({ "position": "absolute", "display": "none" });
			
			// 드롭다운 목록 갱신
			if(opts.nodes.length > 0) {
				this.update(opts.nodes);
			} else {
				setEventNodes(this);
			}

			this.type = "hide"; // 기본 타입 설정
		}
		
		this.update = function(nodes) {
			if(!this.tpl.node) return;
			
			$(ui_list.menu).empty();
			
			for(var i = 0; i < nodes.length; i++) {
				$(ui_list.menu).append(this.tpl.node(nodes[i]));
			}
			
			setEventNodes(this);
		}
		
		this.hide = function() {
			ui_list.root.hide();
			
			this.emit("hide");
			this.type = "hide";
		}
		
		this.show = function(x, y) {
			hideAll();
			
			ui_list.root.show();
			
			// Anchor 옵션 처리
			if(ui_list.anchor.size() > 0) 
				ui_list.root.css("margin-top", "10px");
			
			// x, y 값이 있을 경우
			if(arguments.length == 2) {
				this.move(x, y);
			}
			
			this.emit("show");
			this.type = "show";
		}
		
		this.move = function(x, y) {
			ui_list.root.css("left", x);
			ui_list.root.css("top", y);
		}
		
		this.wheel = function(key, callback) {
			if(!this.options.keydown) return;
			
			var self = this,
				$list = ui_list.menu.find("li");
			
			if(key == 38 || key == -1) { // up
				if(index < 1) index = $list.size() - 1;
				else index--;
				
				selectItem(this, function() {
					index--;
					selectItem(self);
				});
				
				if(callback) callback();
			}
			
			if(key == 40 || key == 1) { // down
				if(index < $list.size() - 1) index++;
				else index = 0;
				
				selectItem(self, function() {
					index++;
					selectItem(self);
				});
				
				if(callback) callback();
			}
			
			if(key == 13 || key == 0 || !key) { // enter
				self.addTrigger($list.eq(index), "click");
				index = -1;
				
				if(callback) callback();
			}
		}
		
		this.reload = function() {
			this.init();
			this.emit("reload");
		}
	}

    UI.setup = function() {
        return {
			close: true,
			keydown: false,
			left: 0,
			top: 0,
			width: 0,
			height: 0,
			nodes: []
        }
    }
	
	return UI;
});
jui.defineUI("ui.modal", [ "jquery", "util.base" ], function($, _) {
	
	/**
	 * Common Logic
	 * 
	 */
	var win_width = 0;
	
	_.resize(function() {
		if(win_width == $(window).width()) return; 
		
		var call_list = jui.get("ui.modal");
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i];
			
			for(var j = 0; j < ui_list.length; j++) {
				if(ui_list[j].type == "show") {
					ui_list[j].resize();
				}
			}
		}
		
		win_width = $(window).width();
	}, 300);
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var $modal = null, $clone = null;
		var uiObj = null, uiTarget = null;
		var x = 0, y = 0, z_index = 5000;
		
		
		/**
		 * Private Methods
		 * 
		 */
		function setPrevStatus(self) {
			uiObj = { 
				"position": $(self.root).css("position"),
				"left": $(self.root).css("left"),
				"top": $(self.root).css("top"),
				"z-index": $(self.root).css("z-index"),
				"display": $(self.root).css("display")
			};
			
			uiTarget = {
				"position": $(self.options.target).css("position")
			};
		}
		
		function getModalInfo(self) {
			var target = self.options.target,
				hTarget = (target == "body") ? window : target,
				pos = (target == "body") ? "fixed" : "absolute",
				tPos = (target == "body") ? null : "relative",
                sLeft = $(target).scrollLeft();
			
			var x = (($(hTarget).width() / 2) - ($(self.root).width() / 2)) + $(target).scrollLeft(),
				y = ($(hTarget).height() / 2) - ($(self.root).height() / 2);

			var w = (sLeft > 0) ? $(target).outerWidth() + sLeft : "100%",
				h = $(target).outerHeight();

			// inner modal일 경우
			if(tPos != null) {
				var sh = $(hTarget)[0].scrollHeight;
				
				h = (sh > h) ? sh : h;
				y = y + $(hTarget).scrollTop();

			// global modal일 경우
			} else {
				var sh = $(window).outerHeight();

				h = (h > sh) ? h : sh;
			}
			
			return {
				x: x, y: y, pos: pos, tPos: tPos, w: w, h: h
			}
		}
		
		function createModal(self, w, h) {
			if($modal != null) return;
			
			$modal = $("<div id='MODAL_" + self.timestamp + "'></div>").css({ 
				position: "absolute",
				width: w,
				height: h,
				left: 0,
				top: 0,
				opacity: self.options.opacity, 
				"background-color": self.options.color,
				"z-index": (z_index + self.options.index) - 1
			});
		
			// 모달 추가
			$(self.options.target).append($modal);
			
			// 루트 모달 옆으로 이동
			if(self.options.target != "body") {
				$(self.root).insertAfter($modal);
			}
			
			// 모달 닫기 이벤트 걸기
			self.addEvent($modal, "click", function(e) {
				if(self.options.autoHide) {
					self.hide();
				}
				
				return false;
			});
		}
		
		
		/**
		 * Public Methods
		 * 
		 */
		
		this.init = function() {
			setPrevStatus(this); // 이전 상태 저장

			// 대상의 기본 상태는 숨기기
			if(!this.options.clone) {
				$(this.root).hide();
			}

			// 타입 프로퍼티 설정
			this.type = "hide";
		}
		
		this.hide = function() {
			var opts = this.options;

			// 모달 대상 객체가 숨겨진 상태가 아닐 경우..
			if(opts.clone) {
				$clone.remove();
				$clone = null;
			}
			
			$(opts.target).css("position", uiTarget.position);
			$(this.root).css(uiObj);
			
			if($modal) {
				$modal.remove();
				$modal = null;
			}
			
			this.type = "hide";
		}
		
		this.show = function() {
			var opts = this.options,
				info = getModalInfo(this);

			// 모달 대상 객체가 숨겨진 상태가 아닐 경우..
			if(opts.clone) {
				$clone = $(this.root).clone();
				$clone.insertAfter($(this.root));
			}

            // 위치 재조정
            this.resize();

			$(opts.target).css("position", info.tPos);
			$(this.root).show();

			createModal(this, info.w, info.h);
			this.type = "show";
		}

        this.resize = function() {
            var info = getModalInfo(this);

            $(this.root).css({
                "position": info.pos,
                "left": info.x,
                "top": info.y,
                "z-index": (z_index + this.options.index)
            });

            if($modal != null) {
                $modal.height(info.h);
            }
        }
	}

    UI.setup = function() {
        return {
			color: "black",
			opacity: 0.4,
			target: "body",
			index: 0,
			clone: false,
			autoHide: true // 자신을 클릭했을 경우, hide
        }
    }
	
	return UI;
});
jui.defineUI("ui.notify", [ "jquery" ], function($) {
    var DEF_PADDING = 12;

    /**
     * UI Class
     *
     */
    var UI = function() {
    	var $container = null,
            paddingPos = null;
    	
        /**
         * Public Methods
         *
         */

        this.init = function() {
            var opts = this.options;
            
            var padding = (typeof(opts.padding) == "object") ? DEF_PADDING : opts.padding;
        	var paddingObj = {
                "top":    		{ top: padding, bottom: null, left: padding, right: padding },
                "top-right":    { top: padding, bottom: null, left: null, right: padding },
                "top-left":     { top: padding, bottom: null, left: padding, right: null },
                "bottom":  		{ top: null, bottom: padding, left: padding, right: padding },
                "bottom-right": { top: null, bottom: padding, left: null, right: padding },
                "bottom-left":  { top: null, bottom: padding, left: padding, right: padding }
            };

            paddingPos = paddingObj[opts.position];
            
            // 패딩 값이 수치가 아니라 객체일 경우
            if(typeof(opts.padding) == "object") {
            	paddingPos = $.extend(paddingPos, opts.padding);
            }

            // 알림 메시지 대상 스타일 설정
            if(this.selector != "body") {
            	$(this.selector).css("position", "relative");
            }
            
            // 기본 스타일 설정
            $container = $("<div></div>").css($.extend({
                position: "absolute",
                "z-index": 3000
            }, paddingPos));
            
            $(this.root).append($container);

            return this;
        }

        this.add = function(data, timeout) {
            var self = this, 
            	opts = this.options,
            	delay = (!isNaN(timeout)) ? timeout : opts.timeout,
                scrollTop = $(this.root).scrollTop();

            var $alarm = $(this.tpl.item(data)).css({ "margin-bottom": opts.distance });

            // 포지션 예외 처리
            if(opts.position == "top" || opts.position == "bottom") {
            	$alarm.outerWidth(
        			$container.width() - ((typeof(opts.padding) == "object" && opts.padding.right) ? opts.padding.right : DEF_PADDING) * 3
    			);
            }

            // 추가
            if(isTop()) {
                $container.css("top", scrollTop + paddingPos.top);
            	$container.prepend($alarm);
            } else {
                $container.css("bottom", -(scrollTop - paddingPos.bottom));
            	$container.append($alarm);
            }

            // 보이기 효과
            var alpha = $alarm.css("opacity");
            $alarm
                .css({ opacity:  0 })
                .animate({ opacity: alpha }, opts.showDuration, opts.showEasing, function() {
                	self.emit("show", [ data ]);
                });

            // 선택 이벤트
            this.addEvent($alarm, "click", function(e) {
            	self.emit("select", [ data, e ]);
            	remove();
            	
            	return false;
            });
            
            // 숨기기 효과
            if(delay > 0) {
                setTimeout(remove, delay);
            }
            
            function remove() {
            	if($alarm == null) return;
            	
                $alarm.animate({ opacity: 0 }, opts.hideDuration, opts.hideEasing);
                $alarm.slideUp(opts.hideEasing, function() {
                	self.emit("hide", [ data ]);
                	$alarm.remove();
                    $alarm = null;
                });
            }

            function isTop() {
                return (opts.position.indexOf("top-") != -1) ? true : false;
            }
        }
        
        this.reset = function() {
        	$container.empty();
        }
    }

    UI.setup = function() {
        return {
            position: "top-right", // top | top-left | top-right | bottom | bottom-left | bottom-right
            padding: DEF_PADDING, // 알림 컨테이너 여백 또는 리터럴 형태로 패딩 값을 직접 넣을 수 있음
            distance: 5, // 알림끼리의 간격
            timeout: 3000, // 0이면 사라지지 않음
            showDuration: 500,
            hideDuration: 500,
            showEasing: "swing",
            hideEasing: "linear"
        };
    }

    return UI;
});
jui.defineUI("ui.paging", [ "jquery" ], function($) {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var activePage = 1, lastPage = 1;
		var $main = null;
		
		
		/**
		 * Private Methods
		 * 
		 */
		function setEventAction(self) {
			self.addEvent($(self.root).find(".prev"), "click", function(e) {
				self.prev();
				return false;
			});
			
			self.addEvent($(self.root).find(".next"), "click", function(e) {
				self.next();
				return false;
			});
		}
		
		function setEventPage(self) {
			self.addEvent($main.find(".page"), "click", function(e) {
				var page = parseInt($(e.currentTarget).text());
				self.page(page);
				
				return false;
			});
		}
		
		function setPageStyle(self, page) {
			var $list = $main.find(".page");
			
			$list.each(function(i) {
				if($(this).text() == page) {
					$(this).addClass("active");
				} else {
					$(this).removeClass("active");
				}
			});
		}
		
		function changePage(self, pNo) {
			var pages = [], 
				end = (lastPage < self.options.screenCount) ? lastPage : self.options.screenCount,
				start = pNo - Math.ceil(end / 2) + 1,
				start = (start < 1) ? 1 : start;
			
			activePage = (pNo > lastPage) ? lastPage : pNo;
			activePage = (pNo < 1) ? 1 : pNo;
			
			if(lastPage < start + end + 1) {
				for(var i = lastPage - end + 1; i < lastPage + 1; i++) {
					pages.push(i);
				}
				
				if(activePage > lastPage) activePage = lastPage;
			} else {
				for(var i = start; i < start + end; i++) {
					pages.push(i);
				}
			}
			
			// 템플릿 적용
			$main.html(self.tpl["pages"]({ pages: pages, lastPage: lastPage }));
			
			setEventAction(self);
			setEventPage(self);
			setPageStyle(self, activePage);
		}
		
		
		/**
		 * Public Methods
		 * 
		 */
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// 페이징 메인 설정, 없을 경우에는 root가 메인이 됨
			$main = $(self.root).find(".list");
			$main = ($main.size() == 0) ? $(self.root) : $main;
			
			// 페이지 리로드
			this.reload();
			
			return this;
		}
		
		this.reload = function(count) {
			var count = (!count) ? this.options.count : count;
			
			activePage = 1;
			lastPage = Math.ceil(count / this.options.pageCount);
			
			changePage(this, activePage);
			this.emit("reload");
		}
		
		this.page = function(pNo) {
			if(!pNo) return activePage;
			
			changePage(this, pNo);
			this.emit("page", [ activePage ]);
		}

		this.next = function() {
			this.page(activePage + 1);
		}
		
		this.prev = function() {
			this.page(activePage - 1);
		}
		
		this.first = function() {
			this.page(1);
		}

		this.last = function() {
			this.page(lastPage);
		}
	}

    UI.setup = function() {
        return {
			count: 0,		// 데이터 전체 개수
			pageCount: 10,	// 한페이지당 데이터 개수
			screenCount: 5	// 페이지 개수
        }
    }
	
	return UI;
});
jui.defineUI("ui.tooltip", [ "jquery" ], function($) {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var $tooltip = null;
		var pos = {}, title = "", delay = null;
		
		
		/**
		 * Private Methods
		 * 
		 */
		function createTooltip(self, msg) {
            // 메시지 템플릿 적용
			$tooltip = $(self.tpl.item({
                timestamp: self.timestamp,
                position: self.options.position,
                color: self.options.color,
                message: msg
            }));
			
			// 스타일 옵션
			if(self.options.width) 
				$tooltip.css("max-width", self.options.width);
			if(self.options.align) 
				$tooltip.css("text-align", self.options.align);
			
			$("body").append($tooltip);
			setPosition(self);
		}
		
		function setPosition(self) {
			var offset = $(self.root).offset(),
				w = $(self.root).outerWidth(),
				h = $(self.root).outerHeight();
			var tw = $tooltip.outerWidth(),
				th = $tooltip.outerHeight();
			var x = 0, y = 0, posCheck = self.options.position;
				
			if(posCheck == "left") {
				x = offset.left - tw
				y = offset.top - ((th - h) / 2);
			} else if(posCheck == "right") {
				x = offset.left + w;
				y = offset.top - ((th - h) / 2);
			} else if(posCheck == "bottom") {
				x = offset.left - (tw / 2) + (w / 2);
				y = offset.top + h;
			} else {
				x = offset.left - (tw / 2) + (w / 2);
				y = offset.top - th;
			}
				
			pos =  {
				x: (x < 1) ? 1 : x,
				y: (y < 1) ? 1 : y
			}
		}

        function hideTooltip(self, e) {
            clearTimeout(delay);

            if($tooltip != null) {
                $tooltip.remove();
                $tooltip = null;

                pos = {};
            }

            if(delay != null) {
                self.emit("hide", [ e ]);
                delay = null;
            }
        }

        function showTooltip(self, e) {
            if($tooltip) hideTooltip(self, e);

            var message = ((self.options.title) ? self.options.title : title);

            if(message != "") {
                createTooltip(self, message);

                $tooltip.css({
                    "left": pos.x,
                    "top": pos.y
                });
            }
        }
		
		
		/**
		 * Public Methods
		 * 
		 */
		
		this.init = function() {
			var self = this, opts = this.options;
				
			// 타이틀 설정
			title = $(this.root).attr("title");
			$(this.root).removeAttr("title");
			
			// 기존의 설정된 이벤트 제거
			$(this.root).off(opts.showType).off(opts.hideType);
			
			// 보이기 이벤트
			this.addEvent(this.root, opts.showType, function(e) {
                if(delay == null) {
                    delay = setTimeout(function () {
                        showTooltip(self, e);

                        if ($tooltip != null) {
                            self.emit("show", [ $tooltip.get(0), e ]);
                        }
                    }, opts.delay);
                } else {
                    if(opts.showType == opts.hideType) {
                        hideTooltip(self, e);
                    }
                }

				return false;
			});
			
			// 숨기기 이벤트
            if(opts.showType != opts.hideType) {
                this.addEvent(this.root, opts.hideType, function (e) {
                    hideTooltip(self, e);

                    return false;
                });
            }
		}

        this.update = function(newTitle) {
            title = newTitle;
        }
	}

    UI.setup = function() {
        return {
            color: "black",
            position: "top",
            width: 150,
            align: "left",
            delay: 0,
            showType: "mouseover",
            hideType: "mouseout",
            title: "",
            tpl: {
                item: "<div class='tooltip tooltip-<!= position !> tooltip-<!= color !>'>" +
                "<div class='anchor'></div><div class='message'><!= message !></div>" +
                "</div>"
            }
        }
    }
	
	return UI;
});
jui.defineUI("ui.layout", [ "jquery", "util.base" ], function($, _) {
	
	var UI = function() {
		var ui_layout = null, 
			ui_options = {}, 
			directions = [ 'top','left','right','bottom','center' ];
		
		var resizerIcons = { 
			top: 'n-resize', 
			bottom: 'n-resize', 
			right: 'e-resize', 
			left: 'e-resize' 
		};
		
		function setEvent($resizer, move, down, up) {
			$resizer.mousedown(function(e) {
				$resizer.data('mousedown', true);
				
				var $shadow = $resizer.clone();
				
				$resizer.data('shadow', $shadow);
				$resizer.after($shadow);
				
				down.call(this, e);
				$shadow.css('opacity', 0.3);
				
				$(document).on('mousemove', move);
				$(document).on('mouseup', function mouseUp(e) {
					$(document).off('mousemove', move);
					$(document).off('mouseup', mouseUp);
						
					up.call(this, e);
          			$resizer.data('mousedown', false);					
          			
					$shadow.remove();
					$("body :not(.resize)").css({ 'user-select' : '' })						
				});
				
				$("body :not(.resize)").css({ 'user-select' : 'none' })
			});
		}
		
		function setPosition(height, first, arr, second) {
			arr = arr || [];
			
			if(ui_layout[height]) {
				ui_layout[height].height(first);
			}
			
			if(typeof arr == 'string') arr = [arr];
			if(arr.length == 0) return;
			
			for(var i = 0, len = arr.length; i < len; i++) {
				var $obj = ui_layout[arr[i]];
				
				if($obj) {
					$obj.css({ top : second })
					if($obj.resizer) $obj.resizer.css({ top : second })					
				}
			}
		}
		
		function setResizer(direction) {
			var $first, $second, $layout, $resizer, options;

			$layout = ui_layout[direction];
			$resizer = $layout.resizer;

			$resizer.css({
				cursor : resizerIcons[direction]
			})			
			
			if($resizer.data('event')) return; 
			
			if(direction == 'top') {
				setEvent($resizer, function(e) {
					if(!$resizer.data('mousedown')) return; 
					
					var top = e.clientY - $resizer.data('current');
					var min = ui_options.top.min;
					var max = ui_options.top.max;
					if(min <= top && top < max) {
						$resizer.css({top : top + 'px'});
					}
					
				}, function(e) {
					var top = $resizer.position().top;										 
					$resizer.data('current', e.clientY - top);
				}, function(e) {

					var top = $resizer.position().top;					
					var height = $resizer.height();					
	
					var first = top;
					var second = (top + $resizer.height()) + 'px';
						
					var pre_height = ui_layout.top.height();
					ui_layout.top.height(first);
					
					var dh = pre_height - first;
					var new_height = ui_layout.center.height() + dh;
					
					ui_layout.center.css({top : second}).height(new_height);			
					ui_layout.left.css({top : second}).height(new_height);			
					ui_layout.left.resizer.css({top : second}).height(new_height);			
					ui_layout.right.css({top : second}).height(new_height);			
					ui_layout.right.resizer.css({top : second}).height(new_height);			
				});
		
			} else if(direction == 'bottom') {
				setEvent($resizer, function(e) {
					if(!$resizer.data('mousedown')) return; 
					
					var top = e.clientY - $resizer.data('current');
					var min = ui_options.bottom.min;
					var max = ui_options.bottom.max;
					
					var dh =  $layout.position().top - (top + ui_options.barSize);
					var real_height = dh + $layout.height();
					
					if(min <= real_height && real_height <= max ) {
						$resizer.css({top : top + 'px'});	
					}
				}, function(e) {
					var top = $resizer.position().top;										 
					$resizer.data('current', e.clientY - top);
				}, function(e) {
					var top = $resizer.position().top + $resizer.height();
					
					var max = ui_layout.root.height();
					var dh = parseFloat(ui_layout.bottom.position().top) - top;
					
					ui_layout.bottom.css({ top : top + "px"});
					ui_layout.bottom.height(ui_layout.bottom.height() + dh);
					
					var new_height = ui_layout.center.height() - dh;
					
					ui_layout.center.height(new_height);			
					ui_layout.left.height(new_height);			
					ui_layout.left.resizer.height(new_height);			
					ui_layout.right.height(new_height);			
					ui_layout.right.resizer.height(new_height);		
				});				
			} else if(direction == 'left') {
				setEvent($resizer, function(e) {
					if(!$resizer.data('mousedown')) return; 
					
					var left = e.clientX - $resizer.data('current');
					var min = ui_options.left.min;
					var max = ui_options.left.max;
					if(min <= left && left < max) {
						$resizer.css({left : left + 'px'});
					}
				}, function(e) {
					var left = $resizer.position().left;										 
					$resizer.data('left', left).data('current', e.clientX - left);
				}, function(e) {
          			if(!$resizer.data('mousedown')) return; 
          					
					var left = $resizer.position().left;
					var pre_left = $resizer.data('left');
					var dw = pre_left - left;
					
					ui_layout.left.css({ width : left + "px"});
					ui_layout.center.css({ left : (left + ui_options.barSize ) + "px" });
          			ui_layout.center.width(ui_layout.center.width() + dw);
				});	
			} else if(direction == 'right') {
        		setEvent($resizer, function(e) {
					if(!$resizer.data('mousedown')) return; 
					  
					var left = e.clientX - $resizer.data('current');
					var min = ui_options.right.min;
					var max = ui_options.right.max;
					  
					var sizeLeft = ui_layout.left.width() + ui_layout.left.resizer.width();
					var sizeCenter = ui_layout.center.width();
					var current = $layout.width() - (left - (sizeLeft + sizeCenter));
					  
					if(min <= current && current < max) {
						$resizer.css({left : left + 'px'});  
					}
		        }, function(e) {
		        	var left = $resizer.position().left;                     
		        	$resizer.data('left', left).data('current', e.clientX - left);
		        }, function(e) {
					if(!$resizer.data('mousedown')) return; 
					
					var left = $resizer.position().left;
					var pre_left = $resizer.data('left');
					var dw = pre_left - left;
					
					ui_layout.right.css({ 
						left : (left + $resizer.width()) + 'px',
						width : (ui_layout.right.width() + dw) + "px"
					});
					ui_layout.center.width(ui_layout.center.width() - dw);		          
		        });			  
			}
			
			$resizer.data('event', true);
		}

        function initLayout(self) {
            for(var i = 0, len = directions.length; i < len; i++) {
                var direct = ui_layout[directions[i]];

                if(direct) {
                    ui_layout.root.append(direct);

                    if(directions[i] != 'center') {
                        if(ui_options[directions[i]].resize) {
                            if(!direct.resizer) {
                                direct.resizer = $("<div class='resize " + directions[i] + "' />");
                            }

                            ui_layout.root.append(direct.resizer);
                            setResizer(directions[i]);
                        }
                    }
                }
            }

            self.resize();
        }
	
	
		/**
		 * Public Methods
		 * 
		 */
		
		this.init = function() {
			var self = this, opts = this.options;
			var $root, $top, $left, $right, $bottom, $center;
			
			$root = $(this.root).css("position", "relative");
			
			if(opts.width != null) {
				$root.outerWidth(opts.width);
			}

			if(opts.height != null) {
				$root.outerHeight(opts.height);
			}
			
			$top = (opts.top.el) ? $(opts.top.el) : $root.find("> .top");				
			if($top.length == 0) $top = null; 
			
			$left = (opts.left.el) ? $(opts.left.el) : $root.find("> .left");
			if($left.length == 0) $left = null;

			
			$right = (opts.right.el) ? $(opts.right.el) : $root.find("> .right"); 
			if($right.length == 0) $right = null;
			
			$bottom = (opts.bottom.el) ? $(opts.bottom.el) : $root.find("> .bottom"); 
			if($bottom.length == 0) $bottom = null;
			
			$center = (opts.center.el) ? $(opts.center.el) : $root.find("> .center"); 
			if($center.length == 0) $center = null;
			
			ui_layout = { 
				root 	: $root, 
				top 	: $top, 
				left 	: $left,
				right 	: $right, 
				bottom 	: $bottom,
				center	: $center
			};
			
			ui_options = opts;
			initLayout(this);
			
			$(window).on('resize', function(e) {
				self.resize();
			})
 
			return this; 			
		}
		
		this.resize = function() {
			var $obj = null, $option = null;
            var sizeTop = 0, sizeLeft = 0, sizeRight = 0, sizeBottom = 0, sizeCenter = 0 ;
			
			$obj = ui_layout.top;
			$option = this.options.top;

			if($obj) {
				$obj.css({
					'position' : 'absolute',
					'top' : '0px',
					'left' : '0px',
					'width' : '100%',
					'height' : $option.size || $option.min  
				});
				
				sizeTop = $obj.height();
				
				if($option.resize) {
					$obj.resizer.css({
						'position' : 'absolute',
						'top': sizeTop,
						'left' : '0px',
						'width' : '100%',
						"background": this.options.barColor,						
						"height" : this.options.barSize
					})					
					
					sizeTop += this.options.barSize;
				} else {
					if($obj.resizer) {
						$obj.resizer.remove();
					}
				}
			}

			$obj = ui_layout.bottom;
			$option = this.options.bottom;
			
			var max = ui_layout.root.height();			
			
			if($obj) {
				$obj.css({
					'position' : 'absolute',
					'left' : '0px',
					'width' : '100%',
					'height' : $option.size || $option.min  
				});
				
				var bottom_top = (sizeTop -  $obj.height()) + sizeTop;
				
				if($option.resize) {
					$obj.resizer.css({
						'position' 	: 'absolute',
						'top' 		: bottom_top,
						'left' 		: '0px',
						'width' 	: '100%',
						"background": this.options.barColor,
						"height" 	: this.options.barSize
					});					
					
					bottom_top += this.options.barSize;
				} else {
					if($obj.resizer) {
						$obj.resizer.remove();
					}
				}		
					
				$obj.css('top', bottom_top + "px");					
			}			
			
			$obj = ui_layout.left;
			$option = this.options.left;
			
			var content_height = max ;
			
			if(ui_layout.top) {
				content_height -= ui_layout.top.height();
				if(ui_layout.top.resizer) {
					content_height -= ui_layout.top.resizer.height();	
				}
			}
			
			if(ui_layout.bottom) {
				content_height -= ui_layout.bottom.height();
				if(ui_layout.bottom.resizer) {
					content_height -= ui_layout.bottom.resizer.height();	
				}
			}							
			
			if($obj) {
				$obj.css({
					'position' : 'absolute',
					'top' : sizeTop,
					'left' : '0px',
					'height' : content_height,
					'width' : $option.size || $option.min,
					'max-width' : '100%',
					'overflow' : 'auto'
				});
				
				sizeLeft = $obj.width();
				
				if($option.resize) {
					$obj.resizer.css({
						'position' 	: 'absolute',
						'top' 		: sizeTop,
						'height'	: $obj.height(),
						'left' 		: sizeLeft,
						"background": this.options.barColor,
						"width" 	: this.options.barSize
					});			
					
					sizeLeft += this.options.barSize;
				} else {
					if($obj.resizer) {
						$obj.resizer.remove();
					}					
				}					
			}
			
			$obj = ui_layout.right;
			$option = this.options.right;
			
			var max_width = ui_layout.root.width();
		    var content_width = max_width;
		    
		    if(ui_layout.left) {
		    	content_width -= ui_layout.left.width();
		    	if(ui_layout.left.resizer) {
		    		content_width -= ui_layout.left.resizer.width();
		    	}
		    }			
			
			if($obj) {
				$obj.css({
					'position' : 'absolute',
					'top' : sizeTop,
					//'right' : '0px',
					'height' : content_height,
					'width' : $option.size || $option.min  ,
					'max-width' : '100%'
				});
				
				if($option.resize) {
					$obj.resizer.css({
						'position' 	: 'absolute',
						'top' 		: sizeTop,
						'height'	: $obj.height(),
						"background": this.options.barColor,
						"width" 	: this.options.barSize
					})	
					
					sizeRight += this.options.barSize;
				} else {
					if($obj.resizer) {
						$obj.resizer.remove();
					}					
				}		
				
		    	content_width -= ui_layout.right.width();
		    	if(ui_layout.right.resizer) {
		    		content_width -= ui_layout.right.resizer.width();
		    	}
		        
		        $obj.resizer.css({ left : (sizeLeft + content_width) + "px" });
		        $obj.css({left : (sizeLeft + content_width + $obj.resizer.width()) + "px"})
											
			}									
			
			$obj = ui_layout.center;
			$option = this.options.center;
			
			if($obj) {
				$obj.css({
					'position' 	: 'absolute',
					'top' 		: sizeTop,
          			'height'  : content_height,
					'left' 		: sizeLeft,
					'width'   : content_width,
					'overflow' : 'auto'
				});
			}			
		}
	}

    UI.setup = function() {
        return {
			barColor : '#d6d6d6',
			barSize : 3,
			width	: null,
			height	: null,
			top		: { el : null, size : null, min : 50, max : 200, resize : true },
			left	: { el : null, size : null, min : 50, max : 200, resize : true },
			right	: { el : null, size : null, min : 50, max : 200, resize : true },
			bottom	: { el : null, size : null, min : 50, max : 200, resize : true },
			center	: { el : null }
        }
    }
	
	return UI;
	
});

jui.defineUI("uix.autocomplete", [ "jquery", "util.base", "ui.dropdown" ], function($, _, dropdown) {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var ddUi = null, target = null,
            words = [], list = [];
		
		
		/**
		 * Private Methods
		 * 
		 */
		function createDropdown(self, words) {
			if(words.length == 0) {
				if(ddUi) ddUi.hide();
				return;
			} else {
				if(ddUi) $(ddUi.root).remove();
			}
			
			var pos = $(self.root).offset(),
				$ddObj = $(self.tpl.words({ words: words }));

			$("body").append($ddObj);
			
			ddUi = dropdown($ddObj, {
				keydown: true,
				width: $(self.root).outerWidth(),
				left: pos.left,
				top: pos.top + $(self.root).outerHeight(),
				event: {
					change: function(data, e) {
						$(target).val(data.text);
						self.emit("change", [ data.text, e ]);
					}
				}
			});
			
			ddUi.show();
		}
		
		function getFilteredWords(word) {
			var result = [];
			
			if(word != "") {
				for(var i = 0; i < words.length; i++) {
					var origin = words[i],
						a = words[i].toLowerCase(),
						b = word.toLowerCase();
					
					if(a.indexOf(b) != -1) {
						result.push(origin);
					}
				}
			}
			
			return result;
		}
		
		function setEventKeyup(self) {
			self.addEvent(target, "keyup", function(e) {
				if(e.which == 38 || e.which == 40 || e.which == 13) return;

                list = getFilteredWords($(this).val());
				createDropdown(self, list);

				return false;
			});
		}
		
		
		/**
		 * Public Methods
		 * 
		 */
		
		this.init = function() {
			var opts = this.options;
			
			// 타겟 엘리먼트 설정
			target = (opts.target == null) ? this.root : $(this.root).find(opts.target);

			// 키-업 이벤트 설정
			setEventKeyup(this);

            // 단어 업데이트
            this.update(opts.words);
		}		
		
		this.update = function(newWords) {
			words = newWords;
		}

        this.list = function() {
            return list;
        }
	}

    UI.setup = function() {
        return {
			target: null,
			words: []
        }
    }
	
	return UI;
});
jui.defineUI("uix.tab", [ "jquery", "util.base", "ui.dropdown" ], function($, _, dropdown) {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var ui_menu = null,
			$anchor = null;
			
		var menuIndex = -1, // menu index
			activeIndex = 0;
		
			
		/**
		 * Private Methods
		 * 
		 */
		
		function hideAll(self) {
			var $list = $(self.root).children("li");
			$list.removeClass("active");
		}
		
		function showMenu(self, elem) {
			var pos = $(elem).offset();
			
			$(elem).parent().addClass("menu-keep");
			ui_menu.show(pos.left, pos.top + $(self.root).height());
		}
		
		function hideMenu(self) {
			var $list = $(self.root).children("li"),
				$menuTab = $list.eq(menuIndex);
			
			$menuTab.removeClass("menu-keep");
		}
		
		function changeTab(self, index) {
			hideAll(self);
			
			var $list = $(self.root).children("li"),
				$tab = $list.eq(index).addClass("active");
			
			$anchor.appendTo($tab);
			showTarget(self.options.target, $tab[0]);
		}
		
		function showTarget(target, elem, isInit) {
			var hash = $(elem).find("[href*=\#]").attr("href");
			
			$(target).children("*").each(function(i) {
				var self = this;
				
				if(("#" + self.id) == hash) {
					$(self).show();
				} else {
					$(self).hide();
				}
			});
		}
		
		function setEventNodes(self) {
			$(self.root).children("li").each(function(i) {
				// 메뉴 설정
				if($(this).hasClass("menu")) {
					menuIndex = i;
				}
			
				// 이벤트 설정
				self.addEvent(this, [ "click", "contextmenu" ], function(e) {
					var text = $.trim($(this).text()),
                        value = $(this).val();

					if(i != menuIndex) {
                        if(i != activeIndex) {
                            var args = [ { index: i, text: text, value: value }, e ];

                            if(e.type == "click") {
                                if(self.options.target != "") {
                                    showTarget(self.options.target, this);
                                }

                                // 엑티브 인덱스 변경
                                activeIndex = i;

                                self.emit("change", args);
                                self.emit("click", args);

                                changeTab(self, i);
                            } else if(e.type == "contextmenu") {
                                self.emit("rclick", args);
                            }
                        }
					} else {
						self.emit("menu", [ { index: i, text: text }, e ]);
						if(ui_menu.type != "show") showMenu(self, this);
					}
					
					return false;
				});
			});
			
			setActiveNode(self);
			setEventDragNodes(self);
		}
		
		function setEventDragNodes(self) {
			if(!self.options.drag) return;
			
			var $tabs = $(self.root).children("li"),
				$origin = null,
				$clone = null;
			
			var index = null,
				targetIndex = null;
			
			$tabs.each(function(i) {
				self.addEvent(this, "mousedown", function(e) {
					$origin = $(this);
					$clone = $origin.clone().css("opacity", "0.5");
					
					index = i;
					self.emit("dragstart", [ index, e ]);
					
					return false;
				});

				self.addEvent(this, "mousemove", function(e) {
					if(index == null) return;
					targetIndex = i;
					
					if(index > targetIndex) { // move 로직과 동일
						if(targetIndex == 0) {
							$clone.insertBefore($tabs.eq(0));
						} else {
							$clone.insertAfter($tabs.eq(targetIndex - 1));
						}
					} else {
						if(targetIndex == $tabs.size() - 1) {
							$clone.insertAfter($tabs.eq(targetIndex));
						} else {
							$clone.insertBefore($tabs.eq(targetIndex + 1));
						}
					}
					
					$origin.hide();
				});
			});
			
			self.addEvent(self.root, "mouseup", function(e) {
				if($origin != null) $origin.show();
				if($clone != null) $clone.remove();
				
				if(index != null && targetIndex != null) {
					self.move(index, targetIndex);
					self.emit("dragend", [ targetIndex, e ]);
				}

				index = null;
				targetIndex =  null;
			});
		}
		
		function setActiveNode(self) {
			var $list = $(self.root).children("li"),
				$markupNode = $list.filter(".active"),
				$indexNode = $list.eq(activeIndex),
				$node = ($indexNode.size() == 1) ? $indexNode : $markupNode;
			
			// 노드가 없을 경우, 맨 첫번째 노드를 활성화
			if($node.size() == 0) {
				$node = $list.eq(0);
			}
			
			$anchor.appendTo($node);
			changeTab(self, $list.index($node));
		}
		
		
		/**
		 * Public Methods
		 * 
		 */
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// 활성화 인덱스 설정
			activeIndex = opts.index;
			
			// 컴포넌트 요소 세팅
			$anchor = $("<div class='anchor'></div>");
			
			// 탭 목록 갱신 및 이벤트 설정
			if(opts.nodes.length > 0) {
				this.update(opts.nodes);
			} else {
				setEventNodes(this);
			}
			
			// 드롭다운 메뉴 
			if(this.tpl.menu) {
				var $menu = $(this.tpl.menu());
				$menu.insertAfter($(self.root));
				
				ui_menu = dropdown($menu, {
					event: {
						change: function(data, e) {
							hideMenu(self);
							self.emit("changeMenu", [ data, e ]);
						},
						hide: function() {
							hideMenu(self);
						}
					}
				});
			}
			
			return this;
		}
		
		this.update = function(nodes) {
			if(!this.tpl.node) return;
			
			$(this.root).empty();
			
			for(var i = 0; i < nodes.length; i++) {
				$(this.root).append(this.tpl.node(nodes[i]));
			}

			setEventNodes(this);
		}
		
		this.insert = function(index, node) {
			if(!this.tpl.node) return;
			
			var html = this.tpl.node(node),
				$list = $(this.root).children("li");
			
			if(index == $list.size()) {
				$(html).insertAfter($list.eq(index - 1));
			} else {
				$(html).insertBefore($list.eq(index));
			}

			setEventNodes(this);
		}
		
		this.append = function(node) {
			if(!this.tpl.node) return;

			var html = this.tpl.node(node);
			
			if(menuIndex != -1) {
				$(html).insertBefore($(this.root).find(".menu"));
				menuIndex++;
			} else {
				$(this.root).append(html);
			}
			
			setEventNodes(this);
		}
		
		this.prepend = function(node) {
			if(!this.tpl.node) return;

			$(this.root).prepend(this.tpl.node(node));
			setEventNodes(this);
		}
		
		this.remove = function(index) {
			$(this.root).children("li").eq(index).remove();
			setEventNodes(this);
		}
		
		this.move = function(index, targetIndex) {
			if(index == targetIndex) return;
			
			var $tabs = $(this.root).children("li"),
				$target = $tabs.eq(index);
			
			if(index > targetIndex) {
				if(targetIndex == 0) {
					$target.insertBefore($tabs.eq(0));
				} else {
					$target.insertAfter($tabs.eq(targetIndex - 1));
				}
			} else {
				if(targetIndex == $tabs.size() - 1) {
					$target.insertAfter($tabs.eq(targetIndex));
				} else {
					$target.insertBefore($tabs.eq(targetIndex + 1));
				}
			}
			
			activeIndex = targetIndex;
			setEventNodes(this);
		}
		
		this.show = function(index) {
            if(index == menuIndex || index == activeIndex) return;

			activeIndex = index;
            var $target = $(this.root).children("li").eq(index);

			this.emit("change", [{ 
				index: index, 
				text: $.trim($target.text()),
                value: $target.val()
			}]);

			changeTab(this, index);
		}
		
		this.activeIndex = function() {
			return activeIndex;
		}
	}

    UI.setup = function() {
        return {
			target: "",
			index: 0,
			drag: false,
			nodes: []
        }
    }
	
	return UI;
});
jui.define("uix.table.column", [ "jquery" ], function($) {
    var Column = function(index) {
        this.element = null;
        this.order = "asc";
        this.name = null;
        this.data = []; // 자신의 컬럼 로우의 데이터 목록
        this.list = []; // 자신의 컬럼 로우 TD 태그 목록
        this.index = index;
        this.type = "show";
        this.width = null; // width 값이 마크업에 설정되어 있으면 최초 가로 크기 저장


        /**
         * Public Methods
         *
         */
        this.hide = function() {
            this.type = "hide";
            $(this.element).hide();
        }

        this.show = function() {
            this.type = "show";
            $(this.element).show();
        }
    }

    return Column;
});


jui.define("uix.table.row", [ "jquery" ], function($) {
    var Row = function(data, tplFunc, pRow) {
        var self = this, cellkeys = {}; // 숨겨진 컬럼 인덱스 키

        /**
         * Public Properties
         *
         */
        this.data = data;
        this.rownum = null;		// 현재 뎁스에서의 인덱스 키값
        this.index = null;		// 계층적 구조를 수용할 수 있는 키값
        this.element = null;
        this.list = [];			// 자신의 로우에 포함된 TD 태그 목록

        this.parent = (pRow) ? pRow : null;
        this.childrens = [];
        this.depth = 0;
        this.type = "fold";


        /**
         * Private Methods
         *
         */
        function setIndex(rownum) {
            self.rownum = (!isNaN(rownum)) ? rownum : self.rownum;

            if(!self.parent) self.index = "" + self.rownum;
            else self.index = self.parent.index + "." + self.rownum;

            // 뎁스 체크
            if(self.parent && typeof(self.index) == "string") {
                self.depth = self.index.split(".").length - 1;
            }

            // 자식 인덱스 체크
            if(!self.isLeaf()) {
                setIndexChild(self);
            }
        }

        function setIndexChild(row) {
            var clist = row.childrens;

            for(var i = 0; i < clist.length; i++) {
                clist[i].reload(i);

                if(!clist[i].isLeaf()) {
                    setIndexChild(clist[i]);
                }
            }
        }

        function setElementCells() {
            self.list = [];

            $(self.element).find("td").each(function(i) {
                self.list[i] = this;

                if(cellkeys[i]) {
                    this.style.display = "none";
                }
            });
        }

        function getElement() {
            if(!tplFunc) return self.element;

            var element = $(tplFunc(
                    $.extend({ row: { index: self.index, data: self.data, depth: self.depth } }, self.data))
            ).get(0);

            return element;
        }

        function removeChildAll(row) {
            $(row.element).remove();

            for(var i = 0; i < row.childrens.length; i++) {
                var c_row = row.childrens[i];

                if(!c_row.isLeaf()) {
                    removeChildAll(c_row);
                } else {
                    $(c_row.element).remove();
                }
            }
        }

        function reloadChildAll() {
            for(var i = 0; i < self.childrens.length; i++) {
                self.childrens[i].reload(i);
            }
        }


        /**
         * Public Methods
         *
         */

        this.reload = function(rownum, isUpdate, columns) {
            if(!isUpdate) setIndex(rownum); // 노드 인덱스 설정

            if(this.element != null) {
                var newElem = getElement();

                $(newElem).insertAfter(this.element);
                $(this.element).remove();

                this.element = newElem;
            } else {
                this.element = getElement();
            }

            if(columns != null) { // 컬럼 정보가 있을 경우, 숨기기 설정
                this.hideCells(columns);
            }

            setElementCells();
        }

        this.destroy = function() {
            if(this.parent != null) { // 부모가 있을 경우, 연결관계 끊기
                this.parent.removeChild(this.index);
            } else {
                removeChildAll(this);
                $(this.element).remove();
            }
        }

        this.isLeaf = function() {
            return (this.childrens.length == 0) ? true : false;
        }

        this.fold = function() {
            this.type = "fold";

            for(var i = 0; i < this.childrens.length; i++) {
                var c_row = this.childrens[i];
                $(c_row.element).hide();

                if(!c_row.isLeaf()) c_row.fold();
            }
        }

        this.open = function() {
            this.type = "open";

            for(var i = 0; i < this.childrens.length; i++) {
                var c_row = this.childrens[i];
                $(c_row.element).show();

                if(!c_row.isLeaf()) c_row.open();
            }
        }

        this.appendChild = function(row) {
            var lastElem = (this.isLeaf()) ? this.element : this.lastChildLeaf().element;
            $(row.element).insertAfter(lastElem);

            this.childrens.push(row);
        }

        this.insertChild = function(rownum, row, isReload) {
            var lastElem = this.element;

            if(rownum > 0) {
                var cRow = this.childrens[rownum - 1];

                // 마지막 자식이거나 대상 로우가 자식이 있을 경우
                if(!cRow.isLeaf() || this.childrens.length == rownum + 1) {
                    lastElem = cRow.lastChildLeaf().element;
                } else {
                    lastElem = cRow.element;
                }

            }

            $(row.element).insertAfter(lastElem);

            var preRows = this.childrens.splice(0, rownum);
            preRows.push(row);

            this.childrens = preRows.concat(this.childrens);
            reloadChildAll();
        }

        this.removeChild = function(index) {
            for(var i = 0; i < this.childrens.length; i++) {
                var row = this.childrens[i];

                if(row.index == index) {
                    this.childrens.splice(i, 1); // 배열에서 제거
                    removeChildAll(row);
                }
            }

            reloadChildAll();
        }

        this.lastChild = function() {
            if(!this.isLeaf())
                return this.childrens[this.childrens.length - 1];

            return null;
        }

        this.lastChildLeaf = function(lastRow) {
            var row = (!lastRow) ? this.lastChild() : lastRow;

            if(row.isLeaf()) return row;
            else {
                return this.lastChildLeaf(row.lastChild());
            }
        }

        this.showCell = function(index) {
            cellkeys[index] = false;
            $(this.list[index]).show();
        }

        this.hideCell = function(index) {
            cellkeys[index] = true;
            $(this.list[index]).hide();
        }

        this.hideCells = function(columns) {
            for(var i = 0; i < columns.length; i++) {
                if(columns[i].type == "hide") {
                    this.hideCell(i);
                }
            }
        }
    }

    return Row;
});


jui.define("uix.table.base", [ "jquery", "util.base", "uix.table.column", "uix.table.row" ], function($, _, Column, Row) {
    var Base = function(handler, fields) {
        var self = this;

        var $obj = handler.$obj,
            $tpl = handler.$tpl;

        var columns = [],
            rows = [],
            folds = {};

        var isNone = false,
            iParser = _.index();


        /**
         * Private Methods
         *
         */
        function init() {
            toggleRowNone();
            initColumns();
        }

        function initColumns() {
            var tmpColumns = [];

            $obj.thead.find("tr:last > th").each(function(i) {
                tmpColumns.push(this);
            });

            for(var i = 0; i < tmpColumns.length; i++) {
                var column = new Column(i);

                if(columns[i]) { // 기존의 컬럼 정보가 있을 경우에는 리스트만 초기화 한다.
                    column.element = columns[i].element;
                    column.order = columns[i].order;
                    column.name = columns[i].name;
                    column.data = columns[i].data;
                    column.list = columns[i].list;
                    column.type = columns[i].type;
                    column.width = columns[i].width;
                } else {
                    column.element = tmpColumns[i];

                    if($(column.element).attr("width") || (
                        $(column.element).attr("style") &&
                        $(column.element).attr("style").indexOf("width") != -1)) {
                        column.width = $(column.element).outerWidth();
                    }

                    if(fields && fields[i]) {
                        column.name = fields[i];
                    }
                }

                for(var j = 0; j < rows.length; j++) {
                    column.list.push(rows[j].list[i]);
                    column.data.push(rows[j].data[column.name]);
                }

                columns[i] = column;
            }
        }

        function initColumnRows(type, row) {
            if(type == "reload" || type == "append") {
                for(var i = 0; i < columns.length; i++) {
                    columns[i].list[row.index] = row.list[i];
                    columns[i].data[row.index] = row.data[columns[i].name];
                }
            } else if(type == "remove") {
                for(var i = 0; i < columns.length; i++) {
                    columns[i].list.splice(row.index, 1);
                    columns[i].data.splice(row.index, 1);
                }
            } else {
                initColumns();
            }
        }

        function createRow(data, no, pRow) {
            var row = new Row(data, $tpl.row, pRow);
            row.reload(no, false, columns);

            return row;
        }

        function setRowChildAll(dataList, row) {
            var c_rows = row.childrens;

            if(c_rows.length > 0) {
                for(var i = 0; i < c_rows.length; i++) {
                    dataList.push(c_rows[i]);

                    if(c_rows[i].childrens.length > 0) {
                        setRowChildAll(dataList, c_rows[i]);
                    }
                }
            }
        }

        function getRowChildLeaf(keys, row) {
            if(!row) return null;
            var tmpKey = keys.shift();

            if(tmpKey == undefined) {
                return row;
            } else {
                return getRowChildLeaf(keys, row.childrens[tmpKey]);
            }
        }

        function reloadRows() {
            var index = arguments[0], callback = arguments[1];

            if(typeof(index) == "function") {
                callback = index;
                index = 0;
            } else {
                index = (!isNaN(index)) ? index : 0;
            }

            for(var i = index; i < rows.length; i++) {
                rows[i].reload(i);
                initColumnRows("reload", rows[i]);

                if(typeof(callback) == "function") {
                    callback(i);
                }
            }
        }

        function insertRowData(index, data) {
            var row = createRow(data, index), preRows = row;

            if(rows.length == index && !(index == 0 && rows.length == 1)) {
                var tRow = rows[index - 1];
                $(row.element).insertAfter((tRow.childrens.length == 0) ? tRow.element : tRow.lastChildLeaf().element);
            } else {
                $(row.element).insertBefore(rows[index].element);
            }

            // Rows 데이터 갱신
            preRows = rows.splice(0, index);
            preRows.push(row);
            rows = preRows.concat(rows);

            // Rows UI 갱신
            reloadRows(index);

            return row;
        }

        function insertRowDataChild(index, data) {
            var keys = iParser.getIndexList(index);

            var pRow = self.getRowParent(index),
                rownum = keys[keys.length - 1];
            row = createRow(data, rownum, pRow);

            // 데이터 갱신
            pRow.insertChild(rownum, row);

            return row;
        }

        function appendRowData(data) {
            // Row 배열 세팅
            var row = createRow(data, rows.length);
            rows.push(row);

            // 실제 HTML에 추가
            $obj.tbody.append(row.element);

            // Column 배열 세팅
            initColumnRows("append", row);

            return row;
        }

        function appendRowDataChild(index, data) {
            var pRow = self.getRow(index),
                cRow = createRow(data, pRow.childrens.length, pRow);

            pRow.appendChild(cRow);

            return cRow;
        }

        function toggleRowNone() {
            if(typeof($tpl.none) != "function") return false;

            if(isNone) {
                if(rows.length > 0) {
                    $obj.tbody.find("tr:first").remove();
                    isNone = false;
                }
            } else {
                if(rows.length == 0) {
                    $obj.tbody.html($tpl.none());
                    isNone = true;
                }
            }

            return true;
        }


        /**
         * Public Methods
         *
         */
        this.appendRow = function() {
            var index = arguments[0], data = arguments[1];
            var result = null;

            if(!data) result = appendRowData(index);
            else result = appendRowDataChild(index, data);

            toggleRowNone();
            return result;
        }

        this.insertRow = function(index, data) {
            var result = null;

            if(iParser.isIndexDepth(index)) {
                result = insertRowDataChild(index, data);
            } else {
                if(rows.length == 0 && parseInt(index) == 0) {
                    result = this.appendRow(data);
                } else {
                    result = insertRowData(index, data);
                }
            }

            toggleRowNone();
            return result;
        }

        this.updateRow = function(index, data) {
            var row = this.getRow(index);

            for(var key in data) {
                row.data[key] = data[key];
            }

            row.reload(null, true);
            initColumnRows("reload", row);

            return row;
        }

        this.moveRow = function(index, targetIndex) {
            if(index == targetIndex) return;

            var rows = this.getRowAll(index),
                row = rows[0],
                data = _.clone(row.data);

            if(rows.length > 1) {
                for(var i = 0; i < rows.length; i++) {
                    var index = iParser.changeIndex(rows[i].index, targetIndex, rows[0].index);
                    this.insertRow(index, rows[i].data);
                }
            } else {
                this.insertRow(targetIndex, data);
            }

            this.removeRow(row.index);
        }

        this.removeRow = function(index) {
            var row = this.getRow(index);		// 자신 객체

            if(!iParser.isIndexDepth(index)) {
                row.destroy();

                initColumnRows("remove", rows[index]);
                rows.splice(index, 1);
                reloadRows(index);
            } else {
                row.destroy();
            }

            toggleRowNone();
        }

        this.openRow = function(index) {
            this.getRow(index).open();
            folds[index] = false;

            for(var key in folds) {
                if(folds[key] !== false) {
                    var foldRow = this.getRow(folds[key]);
                    if(foldRow != null) foldRow.fold();
                }
            }
        }

        this.openRowAll = function() {
            var tmpRows = this.getRowAll();

            for(var i = 0; i < tmpRows.length; i++) {
                if(!tmpRows[i].isLeaf()) {
                    tmpRows[i].open();
                    folds[tmpRows[i].index] = false;
                }
            }
        }

        this.foldRow = function(index) {
            this.getRow(index).fold();
            folds[index] = index;
        }

        this.foldRowAll = function() {
            var tmpRows = this.getRowAll();

            for(var i = 0; i < tmpRows.length; i++) {
                if(!tmpRows[i].isLeaf()) {
                    tmpRows[i].fold();
                    folds[tmpRows[i].index] = tmpRows[i].index;
                }
            }
        }

        this.removeRows = function() {
            rows = [];

            if(!toggleRowNone()) {
                $obj.tbody.html("");
            }

            initColumnRows();
        }

        this.sortRows = function(name, isDesc) {
            var qs = _.sort(rows);

            if(isDesc) {
                qs.setCompare(function(a, b) {
                    return (getValue(a) > getValue(b)) ? true : false;
                });
            } else {
                qs.setCompare(function(a, b) {
                    return (getValue(a) < getValue(b)) ? true : false;
                });
            }

            // 정렬 후, 데이터 갱신
            qs.run();
            $obj.tbody.html("");

            // 정렬 후, 화면 갱신
            reloadRows(function(i) {
                $obj.tbody.append(rows[i].element);
            });

            // 해당 컬럼에 해당하는 값 가져오기
            function getValue(row) {
                var value = row.data[name];

                if(typeof(value) == "string") {
                    return value.toLowerCase();
                } else {
                    if(!isNaN(value) && value != null) {
                        return value;
                    }
                }

                return "";
            }
        }

        this.appendColumn = function(tplType, dataList) {
            var columLength = columns.length,
                $columnRows = $($tpl[tplType]({ rows: dataList }));
            var $theadTrList = $columnRows.filter("thead").find("tr");

            $theadTrList.each(function(i) {
                var $tr = $obj.thead.find("tr").eq(i);

                $(this).find("th").each(function(j) {
                    $tr.append(this);

                    if($theadTrList.size() - 1 == i) {
                        columns.push({ element: this, list: [] });
                    }
                });
            });

            for(var k = 0; k < rows.length; k++) {
                $columnRows.filter("tbody").find("tr").eq(k).find("td").each(function(i) {
                    $(rows[k].element).append(this);

                    columns[columLength + i].list.push(this);
                    rows[k].list.push(this);

                    $.extend(rows[k].data, dataList[k]);
                });
            }
        }

        this.removeColumn = function(index) {
            for(var i = 0; i < columns[index].list.length; i++) {
                $(columns[index].element).remove();
                $(columns[index].list[i]).remove();
            }

            for(var j = 0; j < rows.length; j++) {
                rows[j].list.splice(index, 1);
            }

            columns.splice(index, 1);
        }

        this.hideColumn = function(index) {
            if(columns[index].type == "hide") return;

            var rows = this.getRowAll();
            for(var i = 0; i < rows.length; i++) {
                rows[i].hideCell(index);
            }

            columns[index].hide();
        }

        this.showColumn = function(index) {
            if(columns[index].type == "show") return;

            var rows = this.getRowAll();
            for(var i = 0; i < rows.length; i++) {
                rows[i].showCell(index);
            }

            columns[index].show();
        }

        this.getColumnCount = function() {
            return columns.length;
        }

        this.getRowCount = function() {
            return rows.length;
        }

        this.getColumn = function(index) {
            if(index == null) return columns;
            else return columns[index];
        }

        this.getRow = function(index) {
            if(index == null) return rows;
            else {
                if(iParser.isIndexDepth(index)) {
                    var keys = iParser.getIndexList(index);
                    return getRowChildLeaf(keys, rows[keys.shift()]);
                } else {
                    return (rows[index]) ? rows[index] : null;
                }
            }
        }

        this.getRowAll = function(index) {
            var dataList = [],
                tmpRows = (index == null) ? rows : [ this.getRow(index) ];

            for(var i = 0; i < tmpRows.length; i++) {
                if(tmpRows[i]) {
                    dataList.push(tmpRows[i]);

                    if(tmpRows[i].childrens.length > 0) {
                        setRowChildAll(dataList, tmpRows[i]);
                    }
                }
            }

            return dataList;
        }

        this.getRowParent = function(index) { // 트리 구조의 키에서 키 로우의 부모를 가져오는 함수
            if(!iParser.isIndexDepth(index)) return null;
            return this.getRow(iParser.getParentIndex(index));
        }

        this.setColumn = function(index, column) {
            columns[index] = column;
        }

        this.setRow = function(index, row) {
            rows[index] = row;
        }

        this.printInfo = function() {
            console.log(columns);
            console.log(rows);
        }

        init();
    }

    return Base;
});


jui.defineUI("uix.table", [ "jquery", "util.base", "ui.dropdown", "uix.table.base" ], function($, _, dropdown, Base) {
	
	/**
	 * Common Logic
	 * 
	 */
	_.resize(function() {
		var call_list = jui.get("table");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i].list;
			
			for(var j = 0; j < ui_list.length; j++) {
				ui_list[j].resize();
			}
		}
	}, 1000);

	
	/**
	 * UI Main Class
	 * 
	 */
	var UI = function() {
		var $obj = null, ddUi = null; // table/thead/tbody 구성요소, 컬럼 설정 UI (Dropdown)
		var rowIndex = null, checkedList = {};
        var is_resize = false;
		
		
		/**
		 * Private Methods
		 *
		 */
		function getExpandHtml(self) {
			return "<tr class='expand' style='display: none;'><td id='EXPAND_" + self.timestamp + "'></td></tr>";
		}
		
		function getColumnIndexes(self, colkeys) {
			var indexList = [];
			
			for(var i = 0; i < colkeys.length; i++) {
				if(typeof(colkeys[i]) == "string") {
					var column = self.getColumn(colkeys[i]);
					indexList.push(column.index);
				} else {
					indexList.push(colkeys[i]);
				}
			}
			
			return indexList;
		}
		
		function setColumnStatus(self) {
			var colkeys = self.options.colshow,
				len = self.uit.getColumnCount();
				
			if(colkeys === true) {
				self.options.colshow = colkeys = [];
				
				for(var i = 0; i < len; i++) {
					colkeys.push(i);
				}
			} else {
				colkeys = getColumnIndexes(self, colkeys);
			}
			
			for(var i = 0; i < len; i++) {
				if($.inArray(i, colkeys) == -1) 
					self.uit.hideColumn(i);
				else 
					self.uit.showColumn(i);
			}
		}
		
		function setColumnMenu(self) {
			var $ddObj = null;
			var columns = self.listColumn(),
				columnNames = [];
				
			for(var i = 0; i < columns.length; i++) {
				columnNames.push($(columns[i].element).text());
			}
			
			$ddObj = $(self.tpl.menu({ columns: columnNames }));
			
			$("body").append($ddObj);
			ddUi = dropdown($ddObj, { close: false });
			
			$(ddUi.root).find("input[type=checkbox]").each(function(i) {
				if(columns[i].type == "show") this.checked = true;
				else this.checked = false;
				
				self.addEvent(this, "click", function(e) {
					var ckCount = $(ddUi.root).find("input[type=checkbox]:checked").size();
					
					if(this.checked) {
						self.showColumn(i, e);
					} else {
						if(ckCount > 0) {
							self.hideColumn(i, e);
						} else {
							this.checked = true;
						}
					}
					
					self.hideExpand();
					self.scroll();
				});
			});
		}
		
		function setScrollResize(self) {
			var tableWidth = $obj.table.outerWidth(),
				thCount = self.uit.getColumnCount(),
				isLastCheck = false;
			
			for(var i = thCount - 1; i >= 0; i--) {
				var colInfo = self.getColumn(i),
					thWidth = $(colInfo.element).outerWidth();
				
				// 마지막 TD는 스크롤 사이즈를 차감
				if($(colInfo.element).css("display") == "none") {}
				else {
					if(!isLastCheck) {
						thWidth = thWidth - _.scrollWidth();
						isLastCheck = true;
					}
				}
				
				$(colInfo.list[0]).outerWidth(thWidth);
			}
			
			$obj.tbody.outerWidth(tableWidth);
		}
		
		function setScrollEvent(self) {
			if(!$(self.root).hasClass("table-scroll")) { // 스크롤일 경우, 별도 처리
				self.scroll();
			}
			
			$obj.tbody.off("scroll").scroll(function(e) {
			    if(($obj.tbody.scrollTop() + self.options.scrollHeight) == $obj.tbody.get(0).scrollHeight){
			    	self.emit("scroll", e);
			    	return false;
			    }
			});
		}
		
		function setUpdateInit(self, isInit) {
			if(self.uit.getRowCount() < 1) return;
			
			if(isInit) {
				if(self.options.expand) {
					$obj.tbody.prepend(getExpandHtml(self));
				}
				
				self.scroll();
			}
			
			if(self.options.scroll) { // 스크롤 이벤트 처리
				setScrollEvent(self);
			}
			
			self.setVo();
		}
		
		function setEventRows(self, rows) {
			var rows = (!rows) ? self.uit.getRow() : rows;
			
			for(var i = 0; i < rows.length; i++) {
				(function(row) {
					if(row.childrens.length > 0) {
						setEventRow(self, row);
						setEventRows(self, row.childrens);
					} else {
						setEventRow(self, row);
					}
				})(rows[i])
			}
		}
		
		function setEventRow(self, row) {
			self.addEvent(row.element, "click", function(e) {
				// 1. 공통 이벤트 발생
				self.emit("select", [ row, e ]); // deprecated
				self.emit("click", [ row, e ]);

				// 2. 확장영역 자동 이벤트 처리
				if(self.options.expand) {
					if(self.options.expandEvent === false) return;
					
					if(rowIndex === row.index) {
						self.hideExpand(e);
					} else {
						if(rowIndex != null) {
							self.hideExpand(e);
						}
						
						self.showExpand(row.index, undefined, e);
					}
				} 
			});
			
			self.addEvent(row.element, "dblclick", function(e) {
				self.emit("dblclick", [ row, e ]);
			});
			
			self.addEvent(row.element, "contextmenu", function(e) {
				self.emit("rowmenu", [ row, e ]);
				return false;
			});
			
			if(self.options.fields && self.options.editCell) {
				if(self.options.editEvent === false) return;
				
				$(row.element).find("td").each(function(i) {
					var cell = this;
					
					(function(colIndex) { 
						self.addEvent(cell, "dblclick", function(e) {
							if(e.target.tagName == "TD") {
								setEventEditCell(self, e.currentTarget, row, colIndex);
							}
							
							self.emit("editstart", [ row, e ]);
						});
					})(i);
				});
			}

			if(self.options.fields && self.options.editRow) {
				if(self.options.editEvent === false) return;
				
				self.addEvent(row.element, "dblclick", function(e) {
					if(e.target.tagName == "TD" || e.target.tagName == "TR") {
						self.showEditRow(row.index, e);
					}
				});
			}
		}
		
		function setEventEditCell(self, elem, row, colIndex, event, callback) {
			var column = self.getColumn(colIndex),
				data = (column.name) ? column.data[row.index] : $(elem).html(),
				colkeys = (!callback) ? self.options.editCell : self.options.editRow;
			
			var $input = $("<input type='text' class='edit' />").val(data).css("width", "100%");
			$(elem).html($input);
			
			if(!column.name || (colkeys !== true && $.inArray(colIndex, getColumnIndexes(self, colkeys)) == -1)) {
				$input.attr("disabled", true);
			}
			
			// 클릭 엘리먼트에 포커스 맞추기
			if(event && event.target == elem) $input.focus();

			// 엔터 키 이벤트 발생시 업데이트
			self.addEvent($input, "keypress", function(e) {
				if(e.which == 13) {
					update(e);
				}
			});
			
			// 포커스가 바뀌었을 경우 업데이트
			self.addEvent($obj.tbody.find("tr"), "click", function(e) {
				if(e.target.tagName == "TD" || e.target.tagName == "TR") {
					update(e);
				}
			});
			
			function update(e) {
				if(typeof(callback) == "function") { // editRow일 경우
					callback();
				} else {
					var data = {};
					data[column.name] = $input.val();

					var res = self.emit("editend", [ data ]);
					
					// 이벤트 리턴 값이 false가 아닐 경우에만 업데이트
					if(res !== false) {
						self.update(row.index, data);
						$input.remove();
					}
				}
			}
		}

		function setEventColumn(self) {
            var opts = self.options,
                len = self.uit.getColumnCount();

			// 컬럼 컨텍스트 이벤트
            for(var i = 0; i < len; i++) {
                var col = self.getColumn(i);

				(function(index, column) {
                    if(!opts.fields || !opts.sort || opts.sortEvent !== true) {
                        self.addEvent(column.element, "click", function (e) {
                            self.emit("colclick", [ column, e ]);
                        });
                    }

                    self.addEvent(column.element, "dblclick", function(e) {
                        self.emit("coldblclick", [ column, e ]);
                    });

					self.addEvent(column.element, "contextmenu", function(e) {
						self.emit("colmenu", [ column, e ]);
						return false;
					});
				})(i, col);
			}
		}
		
		function setEventSort(self) {
			var sortIndexes = self.options.sort,
				len = (sortIndexes === true) ? self.uit.getColumnCount() : sortIndexes.length;
			
			for(var i = 0; i < len; i++) {
				var colKey = (sortIndexes === true) ? i : sortIndexes[i],
					col = self.getColumn(colKey);
				
				if(col.element != null) {
					(function(index, column) {
						self.addEvent(column.element, "click", function(e) {
							if($(e.target).hasClass("resize")) return;

							self.sort(index, undefined, e);
                            self.emit("colclick", [ column, e ]);
						});
					})(colKey, col);
					
					$(col.element).css("cursor", "pointer");
				}
			}
		}
		
		function setColumnResize(self) {
			var resizeX = 0,
                tablePos = $obj.table.offset();
			var col = null,
				colNext = null,
				colWidth = 0,
				colNextWidth = 0,
				colResize = null;

			// 리사이즈 엘리먼트 삭제
			$obj.thead.find(".resize").remove();
			
			for(var i = 0; i < self.uit.getColumnCount() - 1; i++) {
				var $colElem = $(self.getColumn(i).element),
					$resizeBar = $("<div class='resize'></div>");
				var pos = $colElem.offset(); // ie8 버그로 인해 position에서 offset으로 변경함

				$resizeBar.css({
					position: "absolute",
			        width: "8px",
			        height: $colElem.outerHeight(),
			        left: ($colElem.outerWidth() + (pos.left - tablePos.left) - 1) + "px",
			        top: (pos.top - tablePos.top) + "px",
			        cursor: "w-resize",
			        "z-index": "1"
				});
				
				$colElem.append($resizeBar);
				
				// Event Start
				(function(index) {
					self.addEvent($resizeBar, "mousedown", function(e) {
						if(resizeX == 0) resizeX = e.pageX;
						
						// 컬럼 객체 가져오기
						col = self.getColumn(index);
						colNext = getNextColumn(index);
						colWidth = $(col.element).outerWidth(),
						colNextWidth = $(colNext.element).outerWidth();
						colResize = this;
                        is_resize = true;
						
						return false;
					});
				})(i);
			}
			
			self.addEvent("body", "mousemove", function(e) {
				if(resizeX > 0) {
					colResizeWidth(self, e.pageX - resizeX);
				}
			});
			
			self.addEvent("body", "mouseup", function(e) {
				if(resizeX > 0) {
					resizeX = 0;
                    is_resize = false;
					
					// 리사이징 바, 위치 이동
					var left = $(col.element).offset().left - tablePos.left;
					$(colResize).css("left", $(col.element).outerWidth() + left - 1);

                    self.emit("colresize", [ col, e ]);
					
					return false;
				}
			});
			
			function getNextColumn(index) {
				for(var i = index + 1; i < self.uit.getColumnCount(); i++) {
					var elem = self.getColumn(i).element;
					
					if(!$(elem).is(':hidden')) {
						return self.getColumn(i);
					}
				}
			}
			
			function colResizeWidth(self, disWidth) {
				var colMinWidth = 30;
				
				// 최소 크기 체크
				if(colWidth + disWidth < colMinWidth || colNextWidth - disWidth < colMinWidth)
					return;
				
				$(col.element).outerWidth(colWidth + disWidth);
				$(colNext.element).outerWidth(colNextWidth - disWidth);
				
				// 스크롤 옵션일 경우, 별도 처리
				if(self.options.scroll) {
					var colLastWidth = $(colNext.element).outerWidth() - ((col.index == self.uit.getColumnCount() - 2) ? _.scrollWidth() : 0);
					
					$(col.list[0]).outerWidth($(col.element).outerWidth());
					$(colNext.list[0]).outerWidth(colLastWidth);
				}
			}
		}
		
		
		/**
		 * Public Methods
		 *
		 */
		
		this.init = function() {
			var opts = this.options;

            // @Deprecated, 'rows'는 의미상 맞지 않아 차후 삭제
            opts.data = (opts.rows != null) ? opts.rows : opts.data;

			// UIHandler, 추후 코어에서 처리
			$obj = {
				table: $(this.root).css({ "position": "relative" }),
				thead: $(this.root).find("thead"),
				tbody: $(this.root).find("tbody")
			};
			
			// UITable 객체 생성
			this.uit = new Base({
				$obj: $obj, $tpl: this.tpl 
			}, opts.fields); // 신규 테이블 클래스 사용
			
			if(opts.fields && opts.colshow) { // 컬럼 보이기 초기값 설정
				setColumnStatus(this);
			}
			
			if(opts.fields && this.tpl.menu) { // 컬럼 보이기/숨기기 메뉴 설정
				setColumnMenu(this);
			}
			
			if(opts.resize) {
				setColumnResize(this);
			}

			if(opts.fields && opts.sort && opts.sortEvent === true) {
                setEventSort(this);
			}
			
			if(opts.data.length > 0) {
				this.update(opts.data);
			} else {
				this.setVo(); // 데이터가 있을 경우에는 VO 세팅을 별도로 함
			}
			
			if(opts.width > 0) {
				$obj.table.outerWidth(opts.width);
			}
			
			if(!opts.fields) {
				if(opts.sort || opts.colshow || opts.editCell || opts.editRow) {
					throw new Error("JUI_CRITICAL_ERR: 'fields' option is required");
				}
			}
			
			setEventColumn(this);
		}
		
		this.update = function() {
			var dataList = (arguments.length == 1) ? arguments[0] : arguments[1],
				index = (arguments.length == 2) ? arguments[0] : null;
			
			if(index != null) { // 1. 단일 로우 업데이트
				var tmpRow = this.uit.updateRow(index, dataList);
				setEventRow(this, tmpRow);
				
				// 첫번째 로우일 경우, 스크롤 다시 처리
				if(parseInt(index) == 0) { 
					this.scroll();
				}
			} else { // 2. 로우 목록 업데이트
				this.uit.removeRows();
				this.scroll();
				this.append(dataList);
				
				// 정렬 인덱스가 옵션에 있을 경우, 해당 인덱스의 컬럼 정렬
				if(this.options.sortIndex) {
					this.sort(this.options.sortIndex, this.options.sortOrder, null);
				}
			}
		}
		
		this.updateTree = function(rows) { // index & data 조합의 객체 배열 
			var iParser = _.index();
			
			// 전체 로우 제거
			this.uit.removeRows();
			
			// 트리 로우 추가
			for(var i = 0; i < rows.length; i++) {
				var pIndex = iParser.getParentIndex(rows[i].index);
				
				if(pIndex == null) {
					this.uit.appendRow(rows[i].data);
				} else {
					this.uit.appendRow(pIndex, rows[i].data);
				}
			}
			
			setUpdateInit(this, true);
			setEventRows(this);
		}
		
		this.append = function() {
			var isInit = (this.count() > 0) ? false : true;
			var dataList = (arguments.length == 1) ? arguments[0] : arguments[1],
				index = (arguments.length == 2) ? arguments[0] : null;
			
			dataList = (dataList.length == undefined) ? [ dataList ] : dataList;
			
			for(var i = 0; i < dataList.length; i++) {
				var tmpRow = null;
				
				if(index != null) tmpRow = this.uit.appendRow(index, dataList[i]);
				else tmpRow = this.uit.appendRow(dataList[i]);
				
				// 추가 로우 추가시 이벤트 걸기
				if(!isInit) {
					setEventRow(this, tmpRow);
				}
			}
			
			setUpdateInit(this, isInit);
			if(isInit) setEventRows(this); // 최초에 데이터가 없을 경우에만 전체 이벤트 걸기
		}
		
		this.insert = function(index, dataList) {
			var isInit = (this.count() > 0) ? false : true;
			var dataList = (dataList.length == undefined) ? [ dataList ] : dataList;
			
			for(var i = 0; i < dataList.length; i++) {
				this.uit.insertRow(index, dataList[i]);
			}
			
			setUpdateInit(this, isInit);
			setEventRows(this);
		}
		
		this.select = function(index) {
			var row = this.get(index);

			// 초기화
			this.hideExpand();
			this.hideEditRow();
			this.uncheckAll();

			$(row.element).parent().find(".selected").removeClass("selected");
			$(row.element).addClass("selected");
			
			rowIndex = index;
			return row;
		}
		
		this.unselect = function() {
			if(rowIndex == null) return;
			var row = this.get(rowIndex);
			
			$(row.element).removeClass("selected");
			rowIndex = null;
			
			return row;
		}
		
		this.check = function(index) {
			var row = this.get(index);
			
			// 초기화
			this.hideExpand();
			this.hideEditRow();
			this.unselect();
			
			checkedList[index] = row;
			$(row.element).addClass("checked");
		}
		
		this.uncheck = function(index) {
			var row = this.get(index);
			
			checkedList[index] = null;
			$(row.element).removeClass("checked");
		}

		this.uncheckAll = function() {
			checkedList = {};
			$obj.tbody.find(".checked").removeClass("checked");
		}
		
		this.remove = function(index) {
			if(index == null) return null;
			
			this.uit.removeRow(index);
			setEventRows(this);
			this.scroll();
		}
		
		this.reset = function() {
			this.uit.removeRows();
			this.scroll();
		}
		
		this.move = function(index, targetIndex) {
			this.uit.moveRow(index, targetIndex);
			setEventRows(this);
			
			// 첫번째 로우일 경우, 스크롤 다시 처리
			if(parseInt(index) == 0 || parseInt(targetIndex) == 0) {
				this.scroll();
			}
		}
		
		this.sort = function(index, order, e) {  // index는 컬럼 key 또는 컬럼 name
			if(!this.options.fields || !this.options.sort || is_resize) return;
			var column = this.getColumn(index);
			
			if(typeof(column.name) == "string") {
				column.order = (order) ? order : (column.order == "asc") ? "desc" : "asc";
				
				this.uit.setColumn(index, column);
				this.uit.sortRows(column.name, (column.order == "desc") ? true : false);
				this.emit("sort", [ column, e ]);
				
				setUpdateInit(this, true);
				setEventRows(this);
			}
		}
		
		this.scroll = function(height) {
			if(!this.options.scroll) return;
			
			var self = this,
				h = (height && height > 0) ? height : this.options.scrollHeight,
				h = (h > 0) ? h : 200;
			
			this.options.scrollHeight = h;
			$obj.tbody.css("maxHeight", h + "px");
			
			setTimeout(function() {
				if($obj.tbody.outerHeight() < h) {
					$obj.table.css({
						"table-layout": ""
					});
					
					$obj.tbody.css({
						"display": "",
						"overflow": ""
					});
				} else {
					$obj.table.css({
						"table-layout": "fixed"
					});
					
					$obj.tbody.css({
						"display": "block",
						"overflow": "auto"
					});
				}
				
				setScrollResize(self);
			}, 10);
		}
		
		this.open = function(index) { // 로트 제외, 하위 모든 노드 대상
			if(index == null) return;
			
			this.uit.openRow(index);
			this.emit("open", [ this.get(index) ]);
		}
		
		this.fold = function(index) {
			if(index == null) return;

			this.uit.foldRow(index);
			this.emit("fold", [ this.get(index) ]);
		}
		
		this.openAll = function() { // 로트 포함, 하위 모든 노드 대상
			this.uit.openRowAll();
			this.emit("openall");
		}

		this.foldAll = function() {
			this.uit.foldRowAll();
			this.emit("foldall");
		}
		
		this.resize = function() {
			this.scroll();
			
			if(this.options.resize) {
				setColumnResize(this);
			}
		}
		
		this.resizeColumns = function() {
			var columns = this.listColumn();
			
			for(var i = 0; i < columns.length; i++) {
				if(columns[i].width == null) {
					$(columns[i].element).outerWidth("auto");
				}
			}
		}
		
		this.size = function() { // 차후 수정 (컬럼 * 로우 개수 * 바이트)
			return this.uit.getRowCount();
		}

		this.count = function() {
			return this.uit.getRowCount();
		}

		this.list = function() {
			return this.uit.getRow();
		}

        this.listData = function() {
            var rows = this.list(),
                data = [];

            for(var i = 0; i < rows.length; i++) {
                data.push(rows[i].data);
            }

            return data;
        }

		this.listAll = function() {
			return this.uit.getRowAll();
		}
		
		this.listChecked = function() {
			var list = [];
			
			for(var row in checkedList) {
				if(checkedList[row] != null) {
					list.push(checkedList[row]);
				}
			}
			
			return list;
		}
		
		this.listColumn = function() {
			return this.uit.getColumn();
		}
		
		this.get = function(index) {
			if(index == null) return null;
			return this.uit.getRow(index);
		}
		
		this.getAll = function(index) {
			if(index == null) return null;
			return this.uit.getRowAll(index);
		}
		
		this.getColumn = function(index) { // index or columnName
			if(index == null) return null;
			else {
				if(typeof(index) == "string")
					return this.uit.getColumn($.inArray(index, this.options.fields));
				else 
					return this.uit.getColumn(index);
			}
		}
		
		this.showColumn = function(index, e) { // index or columnName
			if(!this.options.fields) return;
			var column = this.getColumn(index);
			
			this.uit.showColumn(column.index);
			this.scroll();
			this.resizeColumns();
			
			if(this.options.resize) {
				setColumnResize(this);
			}
			
			// 커스텀 이벤트 발생
			this.emit("colshow", [ column, e ]);
		}
		
		this.hideColumn = function(index, e) { // index or columnName
			if(!this.options.fields) return;
			var column = this.getColumn(index);
			
			this.uit.hideColumn(column.index);
			this.scroll();
			this.resizeColumns();
			
			if(this.options.resize) {
				setColumnResize(this);
			}

			// 커스텀 이벤트 발생
			this.emit("colhide", [ column, e ]);
		}
		
		this.initColumns = function(keys) {
			if(typeof(keys) != "object") return;
			this.options.colshow = keys;
			
			setColumnStatus(this);
			this.scroll();
			this.resizeColumns();
			
			if(this.options.resize) {
				setColumnResize(this);
			}
		}
		
        this.showColumnMenu = function(x) {
            if(!this.options.fields || !ddUi) return;

            var columns = this.listColumn();
            var offset = $obj.thead.offset(),
                maxX = offset.left + $obj.table.outerWidth() - $(ddUi.root).outerWidth();

            x = (isNaN(x) || (x > maxX + offset.left)) ? maxX : x;
            x = (x < 0) ? 0 : x;

            // 현재 체크박스 상태 설정
            $(ddUi.root).find("input[type=checkbox]").each(function(i) {
                if(columns[i].type == "show") this.checked = true;
                else this.checked = false;
            });

            ddUi.move(x, offset.top + $obj.thead.outerHeight());
            ddUi.show();
        }

        this.hideColumnMenu = function() {
            if(!this.options.fields || !ddUi) return;
            ddUi.hide();
        }

        this.toggleColumnMenu = function(x) {
            if(!this.options.fields || !ddUi) return;

            if(ddUi.type == "show") this.hideColumnMenu();
            else this.showColumnMenu(x);
        }
		
		this.showExpand = function(index, obj, e) {
			if(!this.options.expand) return;
			
			// 초기화
			this.unselect();
			this.hideEditRow();
			
			var expandSel = "#EXPAND_" + this.timestamp,
				row = this.get(index),
				obj = (typeof(obj) != "object") ? $.extend({ row: row }, row.data) : obj,
				$expand = $(expandSel).parent().show();
			
			$obj.tbody.find("tr").removeClass("open");
			$expand.insertAfter($(row.element).addClass("open"));
			
			$(expandSel)
				.attr("colspan", $obj.thead.find("tr:last > th:visible").size())
				.html(this.tpl["expand"](obj));

			// 스크롤 및 VO 적용
			this.scroll();
			this.setVo();
			
			// 커스텀 이벤트 호출
			rowIndex = index;
			this.emit("expand", [ row, e ]);
		}
		
		this.hideExpand = function(e) {
			if(!this.options.expand) return;
			if(rowIndex == null) return;
			
			var row = this.get(rowIndex);
			
			$('#EXPAND_' + this.timestamp).parent().hide();
			$obj.tbody.find("tr").removeClass("open");

			// 스크롤 적용
			this.scroll();
			
			// 커스텀 이벤트 호출
			rowIndex = null;
			this.emit("expandend", [ row, e ]);
		}
		
		this.getExpand = function() {
			if(!this.options.expand) return;

			if(rowIndex == null) return null;
			return this.get(rowIndex);
		}
		
		this.showEditRow = function(index, e) {
			if(!this.options.editRow) return;
			
			// 초기화
			this.unselect();
			this.hideExpand();
			
			var self = this,
				row = this.get(index);
			var $cells = $(row.element).find("td");
			
			$cells.each(function(i) {
				setEventEditCell(self, this, row, i, e, function() {
					var data = {};
					
					$cells.each(function(colIndex) {
						var column = self.getColumn(colIndex);
						
						if(column.name != null) {
							data[column.name] = $(this).find(".edit").val();
						}
					});
					
					var res = self.emit("editend", [ data ]);
					
					// 이벤트 리턴 값이 false가 아닐 경우에만 업데이트
					if(res !== false) {
						self.update(row.index, data);
					}
				});
				
			});

			rowIndex = index;
			self.emit("editstart", [ row, e ]);
		}
		
		this.hideEditRow = function() {
			if(!this.options.editRow) return;
			if(rowIndex == null) return;
			
			var row = this.get(rowIndex);
			
			// 커스텀 이벤트 호출
			rowIndex = null;
			
			// 수정 상태 이전의 로우 데이터로 변경
			this.emit("editend", [ row.data ]);
			this.update(row.index, row.data);
		}
		
		this.getEditRow = function() {
			if(!this.options.editRow) return;

			if(rowIndex == null) return null;
			return this.get(rowIndex);
		}
		
		this.setCsv = function() {
            var opts = this.options;
			if(!opts.fields && !opts.csv) return;
			
			var csv = (arguments.length == 1) ? arguments[0] : arguments[1],
				key = (arguments.length == 2) ? arguments[0] : null;

            var fields = _.getCsvFields(opts.fields, opts.csv),
                csvNumber = (opts.csvNumber) ? _.getCsvFields(opts.fields, opts.csvNumber) : null,
                dataList = _.csvToData(fields, csv, csvNumber);

			if(key == null) {
				this.update(dataList);
			} else {
				this.reset();
				
				for(var i = 0; i < dataList.length; i++) {
					var index = dataList[i][key];
					
					if(index) {
						this.insert(index, dataList[i]);
					}
				}
			}
		}
		
		this.setCsvFile = function() {
			if(!this.options.fields && !this.options.csv) return;
			
			var self = this,
				file = (arguments.length == 1) ? arguments[0] : arguments[1],
				key = (arguments.length == 2) ? arguments[0] : null;
				
			_.fileToCsv(file, function(csv) {
				if(key == null) self.setCsv(csv);
				else self.setCsv(key, csv);
			});
		}
		
		this.getCsv = function(isTree) {
			if(!this.options.fields && !this.options.csv) return;
			
			var fields = _.getCsvFields(this.options.fields, this.options.csv);
			var dataList = [],
				rows = (isTree) ? this.listAll() : this.list();
				
			for(var i = 0; i < rows.length; i++) {
				dataList.push(rows[i].data);
			}
			
			return _.dataToCsv2({
				fields: fields,
				rows: dataList,
				names: this.options.csvNames
			});
		}
		
		this.getCsvBase64 = function(isTree) {
			if(!this.options.fields && !this.options.csv) return;
			
			return _.csvToBase64(this.getCsv(isTree));
		}

        this.downloadCsv = function(name, isTree) {
            if(_.typeCheck("string", name)) {
                name = name.split(".")[0];
            }

            var a = document.createElement('a');
            a.download = (name) ? name + ".csv" : "table.csv";
            a.href = this.getCsvBase64(isTree);

            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        }

		this.activeIndex = function() { // 활성화된 확장/수정/선택 상태의 로우 인덱스를 리턴
			return rowIndex;
		}
	}

    UI.setup = function() {
        return {
            fields: null,
            csv: null,
            csvNames: null,
            csvNumber: null,
            data: [],
            rows: null, // @Deprecated
            colshow: false,
            scroll: false,
            scrollHeight: 200,
            width: 0,
            expand: false,
            expandEvent: true,
            editCell: false,
            editRow: false,
            editEvent: true,
            resize: false,
            sort: false,
            sortIndex: null,
            sortOrder: "asc",
            sortEvent: true,
            animate: false // @Deprecated
        }
    }
	
	return UI;
});
jui.define("uix.tree.node", [ "jquery" ], function($) {
    var Node = function(data, tplFunc) {
        var self = this;

        /**
         * Public Properties
         *
         */
        this.data = data;			// 해당 노드의 데이터
        this.element = null;		// 해당 노드의 엘리먼트
        this.index = null;			// 계층적 구조를 수용할 수 있는 키값
        this.nodenum = null;		// 현재 뎁스에서의 인덱스 키값

        this.parent = null;			// 부모 노드
        this.childrens = [];		// 자식 노드들
        this.depth = 0;				// 해당 노드의 뎁스

        this.type = "open";


        /**
         * Private Methods
         *
         */
        function setIndex(nodenum) {
            self.nodenum = (!isNaN(nodenum)) ? nodenum : self.nodenum;

            if(self.parent) {
                if(self.parent.index == null) self.index = "" + self.nodenum;
                else self.index = self.parent.index + "." + self.nodenum;
            }

            // 뎁스 체크
            if(self.parent && typeof(self.index) == "string") {
                self.depth = self.index.split(".").length;
            }

            // 자식 인덱스 체크
            if(self.childrens.length > 0) {
                setIndexChild(self);
            }
        }

        function setIndexChild(node) {
            var clist = node.childrens;

            for(var i = 0; i < clist.length; i++) {
                clist[i].reload(i);

                if(clist[i].childrens.length > 0) {
                    setIndexChild(clist[i]);
                }
            }
        }

        function getElement() {
            if(!tplFunc) return self.element;

            try {
                var element = $(tplFunc(
                        $.extend({ node: { index: self.index, data: self.data, depth: self.depth } }, self.data))
                ).get(0);
            } catch(e) {
                console.log(e);
            }

            return element;
        }

        function removeChildAll(node) {
            $(node.element).remove();

            for(var i = 0; i < node.childrens.length; i++) {
                var cNode = node.childrens[i];

                if(cNode.childrens.length > 0) {
                    removeChildAll(cNode);
                } else {
                    $(cNode.element).remove();
                }
            }
        }

        function reloadChildAll(node) {
            for(var i = 0; i < node.childrens.length; i++) {
                var cNode = node.childrens[i];
                cNode.reload(i);

                if(cNode.childrens.length > 0) {
                    reloadChildAll(cNode);
                }
            }
        }


        /**
         * Public Methods
         *
         */
        this.reload = function(nodenum, isUpdate) {
            setIndex(nodenum); // 노드 인덱스 설정

            if(this.element != null) {
                var newElem = getElement();

                if(!isUpdate) {
                    $(this.parent.element).children("ul").append(newElem);
                } else {
                    $(newElem).insertAfter(this.element);
                }

                $(this.element).remove();

                this.element = newElem;
            } else {
                this.element = getElement();
            }
        }


        this.reloadChildrens = function() {
            reloadChildAll(this);
        }

        this.destroy = function() {
            if(this.parent != null) { // 부모가 있을 경우, 연결관계 끊기
                this.parent.removeChild(this.index);
            } else {
                removeChildAll(this);
                $(this.element).remove();
            }
        }

        this.isLeaf = function() {
            return (this.childrens.length == 0) ? true : false;
        }

        this.fold = function() {
            $(this.element).children("ul").hide();
            this.type = "fold";
        }

        this.open = function() {
            $(this.element).children("ul").show();
            this.type = "open";
        }

        this.appendChild = function(node) {
            $(this.element).children("ul").append(node.element);
            this.childrens.push(node);
        }

        this.insertChild = function(nodenum, node) {
            if(nodenum == 0) {
                if(this.childrens.length == 0) {
                    $(this.element).children("ul").append(node.element);
                } else {
                    $(node.element).insertBefore(this.childrens[0].element);
                }
            } else {
                $(node.element).insertAfter(this.childrens[nodenum - 1].element);
            }

            var preNodes = this.childrens.splice(0, nodenum);
            preNodes.push(node);

            this.childrens = preNodes.concat(this.childrens);
            reloadChildAll(this);
        }

        this.removeChild = function(index) {
            for(var i = 0; i < this.childrens.length; i++) {
                var node = this.childrens[i];

                if(node.index == index) {
                    this.childrens.splice(i, 1); // 배열에서 제거
                    removeChildAll(node);
                }
            }

            reloadChildAll(this);
        }

        this.lastChild = function() {
            if(this.childrens.length > 0)
                return this.childrens[this.childrens.length - 1];

            return null;
        }

        this.lastChildLeaf = function(lastRow) {
            var row = (!lastRow) ? this.lastChild() : lastRow;

            if(row.isLeaf()) return row;
            else {
                return this.lastChildLeaf(row.lastChild());
            }
        }
    }

    return Node;
});


jui.define("uix.tree.base", [ "jquery", "util.base", "uix.tree.node" ], function($, _, Node) {
    var Base = function(handler) {
        var self = this, root = null;

        var $obj = handler.$obj,
            $tpl = handler.$tpl;

        var iParser = _.index();

        /**
         * Private Methods
         *
         */
        function createNode(data, no, pNode) {
            var node = new Node(data, $tpl.node);

            node.parent = (pNode) ? pNode : null;
            node.reload(no);

            return node;
        }

        function setNodeChildAll(dataList, node) {
            var c_nodes = node.childrens;

            if(c_nodes.length > 0) {
                for(var i = 0; i < c_nodes.length; i++) {
                    dataList.push(c_nodes[i]);

                    if(c_nodes[i].childrens.length > 0) {
                        setNodeChildAll(dataList, c_nodes[i]);
                    }
                }
            }
        }

        function getNodeChildLeaf(keys, node) {
            if(!node) return null;
            var tmpKey = keys.shift();

            if(tmpKey == undefined) {
                return node;
            } else {
                return getNodeChildLeaf(keys, node.childrens[tmpKey]);
            }
        }

        function insertNodeDataChild(index, data) {
            var keys = iParser.getIndexList(index);

            var pNode = self.getNodeParent(index),
                nodenum = keys[keys.length - 1];
            node = createNode(data, nodenum, pNode);

            // 데이터 갱신
            pNode.insertChild(nodenum, node);

            return node;
        }

        function appendNodeData(data) {
            if(root == null) {
                root = createNode(data);;
                $obj.tree.append(root.element);
            } else {
                var node = createNode(data, root.childrens.length, root);
                root.appendChild(node);
            }

            return node;
        }

        function appendNodeDataChild(index, data) {
            var pNode = self.getNode(index),
                cNode = createNode(data, pNode.childrens.length, pNode);

            pNode.appendChild(cNode);

            return cNode;
        }

        function isRelative(node, targetNode) {
            var nodeList = [];

            while(true) {
                var tNode = targetNode.parent;

                if(tNode) {
                    nodeList.push(tNode);
                    targetNode = tNode;
                } else {
                    break;
                }
            }

            for(var i = 0; i < nodeList.length; i++) {
                if(node == nodeList[i]) {
                    return true;
                }
            }

            return false;
        }


        /**
         * Public Methods
         *
         */
        this.appendNode = function() {
            var index = arguments[0], data = arguments[1];

            if(!data) {
                return appendNodeData(index);
            } else {
                return appendNodeDataChild(index, data);
            }
        }

        this.insertNode = function(index, data) {
            if(root.childrens.length == 0 && parseInt(index) == 0) {
                return this.appendNode(data);
            } else {
                return insertNodeDataChild(index, data);
            }
        }

        this.updateNode = function(index, data) {
            var node = this.getNode(index);

            for(var key in data) {
                node.data[key] = data[key];
            }

            node.reload(node.nodenum, true);
            node.reloadChildrens();

            return node;
        }

        this.removeNode = function(index) {
            this.getNode(index).destroy();
        }

        this.removeNodes = function() {
            var nodes = root.childrens;

            if(nodes.length > 0) {
                var node = nodes.pop();

                node.parent = null;
                node.destroy();

                this.removeNodes();
            }
        }

        this.openNode = function(index) {
            if(index == null) this.getRoot().open();
            else this.getNode(index).open();
        }

        this.foldNode = function(index) {
            if(index == null) this.getRoot().fold();
            else this.getNode(index).fold();
        }

        this.openNodeAll = function(index) {
            var nodeList = this.getNodeAll(index);

            for(var i = 0; i < nodeList.length; i++) {
                nodeList[i].open();
            }

            if(index == null) this.getRoot().open();
        }

        this.foldNodeAll = function(index) {
            var nodeList = this.getNodeAll(index);

            for(var i = 0; i < nodeList.length; i++) {
                nodeList[i].fold();
            }

            if(index == null) this.getRoot().fold();
        }

        this.moveNode = function(index, targetIndex) {
            if(index == targetIndex) return;

            var node = this.getNode(index),
                tpNode = this.getNodeParent(targetIndex);
            var indexList = iParser.getIndexList(targetIndex);
            tNo = indexList[indexList.length - 1];

            if(!isRelative(node, tpNode)) {
                // 기존의 데이터
                node.parent.childrens.splice(node.nodenum, 1);
                node.parent.reloadChildrens();
                node.parent = tpNode;

                // 이동 대상 데이터 처리
                var preNodes = tpNode.childrens.splice(0, tNo);
                preNodes.push(node);

                tpNode.childrens = preNodes.concat(tpNode.childrens);
                tpNode.reloadChildrens();
            }
        }

        this.getNode = function(index) {
            if(index == null) return root.childrens;
            else {
                var nodes = root.childrens;

                if(iParser.isIndexDepth(index)) {
                    var keys = iParser.getIndexList(index);
                    return getNodeChildLeaf(keys, nodes[keys.shift()]);
                } else {
                    return (nodes[index]) ? nodes[index] : null;
                }
            }
        }

        this.getNodeAll = function(index) {
            var dataList = [],
                tmpNodes = (index == null) ? root.childrens : [ this.getNode(index) ];

            for(var i = 0; i < tmpNodes.length; i++) {
                if(tmpNodes[i]) {
                    dataList.push(tmpNodes[i]);

                    if(tmpNodes[i].childrens.length > 0) {
                        setNodeChildAll(dataList, tmpNodes[i]);
                    }
                }
            }

            return dataList;
        }

        this.getNodeParent = function(index) { // 해당 인덱스의 부모 노드를 가져옴 (단, 해당 인덱스의 노드가 없을 경우)
            var keys = iParser.getIndexList(index);

            if(keys.length == 1) {
                return root;
            } else if(keys.length == 2) {
                return this.getNode(keys[0]);
            } else if(keys.length > 2) {
                keys.pop();
                return this.getNode(keys.join("."));
            }
        }

        this.getRoot = function() {
            return root;
        }
    }

    return Base;
});


jui.defineUI("uix.tree", [ "util.base", "uix.tree.base" ], function(_, Base) {

	/**
	 * UI Main Class
	 * 
	 */
	var UI = function() {
		var dragIndex = { start: null, end: null },
            nodeIndex = null,
			iParser = _.index();
		
		/**
		 * Private Methods
		 * 
		 */
		function setNodeStatus(self, nodeList) {
			for(var i = 0; i < nodeList.length; i++) {
				var node = nodeList[i];
				$(node.element).removeClass("open fold leaf last");
				
				if(node.parent && node.isLeaf()) {
					$(node.element).addClass("leaf");
				} else {
					if(node.type == "open") {
						$(node.element).addClass("open");
						node.open();
					} else {
						$(node.element).addClass("fold");
						node.fold();
					}
				}
				
				if(!node.parent) {
					$(node.element).addClass("root");
				} else {
					if(node.parent.lastChild() == node) {
						$(node.element).addClass("last");
					}
				}
				
				$(node.element).children("i:first-child").remove();
				$(node.element).prepend($("<i></i>"));
			}
		}
		
		function toggleNode(self, index, callback) {
			if(index == null) {
				if(self.options.rootHide) {
					var childs = self.uit.getRoot().childrens;
					
					for(var i = 0; i < childs.length; i++) {
						callback(childs[i].index);
					}
					
					reloadUI(self,  false);
				} else {
					callback(index);
					reloadUI(self,  true);
				}
			} else {
				callback(index);
				reloadUI(self,  false);
			}
		}
		
		function setEventNodes(self, nodeList) {
			for(var i = 0; i < nodeList.length; i++) {
				(function(node) {
					var $elem = $(node.element);
					
					self.addEvent($elem.children("i:first-child"), "click", function(e) {
						if(node.type == "open") {
							self.fold(node.index, e);
						} else {
							self.open(node.index, e);
						}
						
						e.stopPropagation();
					});
					
					self.addEvent($elem.children("a,span,div")[0], "click", function(e) {
						self.emit("select", [ node, e ]);
						e.stopPropagation();
					});
				})(nodeList[i]);
			}
		}
		
		function setEventDragNodes(self, nodeList) {
			if(!self.options.drag) return;
			
			var root = self.uit.getRoot();
			$("body").off("mousemove").off("mouseup");

			for(var i = 0; i < nodeList.length; i++) {
				(function(node) {
					$(node.element).off("mousedown").off("mouseup");
					
					self.addEvent(node.element, "mousedown", function(e) {
						if(e.target.tagName == "I") return;
						
						if(dragIndex.start == null) {
							dragIndex.start = node.index;
							self.emit("dragstart", [ node.index, e ]);
						}
						
						return false;
					});

					self.addEvent(node.element, "mouseup", function(e) {
						if(e.target.tagName == "I") return;
						
						if(self.options.dragChild !== false) {
							if(dragIndex.start && dragIndex.start != node.index) {
								var cNode = node.lastChild(),
									endIndex = (cNode) ? iParser.getNextIndex(cNode.index) : node.index + ".0";
								
								self.move(dragIndex.start, endIndex);
								self.emit("dragend", [ endIndex, e ]);
							}
						}
						
						dragIndex.start = null;
						dragIndex.end = null;
						
						return false;
					});

					self.addEvent(root.element, "mouseup", function(e) {
						if(e.target.tagName == "I") return;

						if(self.options.dragChild !== false) {
							if(dragIndex.start) {
								var endIndex = "" + root.childrens.length;
								
								self.move(dragIndex.start, endIndex);
								self.emit("dragend", [ endIndex, e ]);
							}
						}
						
						dragIndex.start = null;
						dragIndex.end = null;
						
						return false;
					});
				})(nodeList[i]);
			}
			
			self.addEvent("body", "mouseup", function(e) {
				if(dragIndex.start && dragIndex.end) {
					self.move(dragIndex.start, dragIndex.end);
					self.emit("dragend", [ dragIndex.end, e ]);
				}
				
				dragIndex.start = null;
				dragIndex.end = null;
				
				return false;
			});
		}
		
		function setDragNodes(self) {
			if(!self.options.drag) return;
			
			$(self.root).find(".drag").remove();
			var nodeList = self.listAll();
			
			for(var i = 0; i < nodeList.length; i++) {
				var node = nodeList[i],
					pos = $(node.element).position();
				
				if(pos.top > 0) { // top이 0이면, hide된 상태로 간주
					addDragElement(self, node, pos);
				}
			}
		}

		function setDragLastNodes(self) {
			if(!self.options.drag) return;
			var nodeList = self.listAll();
			
			for(var i = 0; i < nodeList.length; i++) {
				var node = nodeList[i],
				pos = $(node.element).position();
				
				if(pos.top > 0 && node.parent) { // top이 0이면, hide된 상태로 간주
					if(node.parent.lastChild() == node) {
						pos.top = pos.top + $(node.element).outerHeight();
						addDragElement(self, node, pos, true);
					}
				}
			}
		}
		
		function addDragElement(self, node, pos, isLast) {
			if(!self.options.drag) return;
			
			var index = (isLast) ? iParser.getNextIndex(node.index) : node.index;
			var $drag = $("<div class='drag'></div>")
				.attr("data-index", index)
				.css(pos)
				.outerWidth($(node.element).outerWidth());

			$(self.root).append($drag);
			
			self.addEvent($drag, "mouseover", function(e) {
				if(dragIndex.start) {
					dragIndex.end = index;
					$drag.addClass("on");
				}
			});

			self.addEvent($drag, "mouseout", function(e) {
				if(dragIndex.start) {
					$drag.removeClass("on");
				}
			});
		}
		
		function reloadUI(self, isRoot) {
			var nodeList = self.listAll();
			
			setNodeStatus(self, nodeList);
			setEventNodes(self, nodeList);
			setEventDragNodes(self, nodeList);
			setDragNodes(self); // 차후에 개선
			setDragLastNodes(self);
			
			if(isRoot) {
				setNodeStatus(self, [ self.uit.getRoot() ]);
				setEventNodes(self, [ self.uit.getRoot() ]);
			}
		}
		
		
		/**
		 * Public Methods
		 *
		 */
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// UITable 객체 생성
			this.uit = new Base({ $obj: { tree: $(this.root) }, $tpl: this.tpl }); // 신규 테이블 클래스 사용
			
			// 루트 데이터 처리
			if(opts.root) {
				this.uit.appendNode(opts.root);
				reloadUI(this, true);
			} else {
				throw new Error("JUI_CRITICAL_ERROR: root data is required");
			}
			
			// 루트 숨기기
			if(opts.rootHide) {
				var root = this.uit.getRoot();
				
				$(root.element).css("padding-left", "0px");
				$(root.element).children("*:not(ul)").hide();
			}
			
			// 루트 접기
			if(opts.rootFold) {
				this.fold();
			}
		}
		
		this.update = function(index, data) {
            var dataList = (arguments.length == 1) ? arguments[0] : arguments[1],
                index = (arguments.length == 2) ? arguments[0] : null;

            if(index != null) {
                this.uit.updateNode(index, dataList);
            } else {
                var iParser = _.index();

                // 전체 로우 제거
                this.uit.removeNodes();

                // 트리 로우 추가
                for(var i = 0; i < dataList.length; i++) {
                    var pIndex = iParser.getParentIndex(dataList[i].index);

                    if(pIndex == null) {
                        this.uit.appendNode(dataList[i].data);
                    } else {
                        this.uit.appendNode(pIndex, dataList[i].data);
                    }
                }
            }

            reloadUI(this);
		}

		this.append = function() {
			var dataList = (arguments.length == 1) ? arguments[0] : arguments[1],
				index = (arguments.length == 2) ? arguments[0] : null;
				
			dataList = (dataList.length == undefined) ? [ dataList ] : dataList;
			
			for(var i = 0; i < dataList.length; i++) {
				if(index != null) this.uit.appendNode(index, dataList[i]);
				else this.uit.appendNode(dataList[i]);
			}
			
			reloadUI(this); // 차후에 개선
		}
		
		this.insert = function(index, data) {
			var dataList = (data.length == undefined) ? [ data ] : data;
			
			for(var i = 0; i < dataList.length; i++) {
				this.uit.insertNode(index, dataList[i]);
			}
			
			reloadUI(this); // 차후에 개선
		}
		
		this.select = function(index) {
			var node = (index == null) ? this.uit.getRoot() : this.get(index);
			
			$(this.root).find("li").removeClass("active");
			$(node.element).addClass("active");

            nodeIndex = index;
			return node;
		}

        this.unselect = function() {
            if(nodeIndex == null) return;
            var node = this.get(nodeIndex);

            $(node.element).removeClass("active");
            nodeIndex = null;

            return node;
        }
		
		this.remove = function(index) {
			this.uit.removeNode(index);
			reloadUI(this); // 차후에 개선
		}
		
		this.reset = function() {
			this.uit.removeNodes();
			reloadUI(this); // 차후에 개선
		}
		
		this.move = function(index, targetIndex) {
			this.uit.moveNode(index, targetIndex);
			reloadUI(this); // 차후에 개선
		}
		
		this.open = function(index, e) { // 로트 제외, 하위 모든 노드 대상
			if(index == null && this.options.rootHide) return;
			var isRoot = (index == null);
			
			this.uit.openNode(index);
			reloadUI(this, isRoot); // 차후에 개선

			this.emit("open", [ (isRoot) ? this.uit.getRoot() : this.get(index), e ]);
		}
		
		this.fold = function(index, e) {
			if(index == null && this.options.rootHide) return;
			var isRoot = (index == null);

			this.uit.foldNode(index);
			reloadUI(this, isRoot); // 차후에 개선
			
			this.emit("fold", [ (isRoot) ? this.uit.getRoot() : this.get(index), e ]);
		}
		
		this.openAll = function(index) { // 로트 포함, 하위 모든 노드 대상
			var self = this,
				isRoot = (index == null);
			
			toggleNode(this, index, function(i) {
				self.uit.openNodeAll(i);
			});

			this.emit("openall", [ (isRoot) ? this.uit.getRoot() : this.get(index) ]);
		}

		this.foldAll = function(index) {
			var self = this,
				isRoot = (index == null);

			toggleNode(this, index, function(i) {
				self.uit.foldNodeAll(i);
			});

			this.emit("foldall", [ (isRoot) ? this.uit.getRoot() : this.get(index) ]);
		}
		
		this.list = function() {
			return this.uit.getNode();
		}

		this.listAll = function() {
			return this.uit.getNodeAll();
		}
		
		this.listParents = function(index) {
			var node = this.get(index),
				parents = [];
			
			if(node.parent) {
				addParent(node.parent);
			}
			
			function addParent(node) {
				if(node.index != null) {
					parents.push(node);
					
					if(node.parent != null) {
						addParent(node.parent);
					}
				}
			}
			
			return parents.reverse();
		}

		this.get = function(index) {
			if(index == null) return null;
			return this.uit.getNode(index);
		}

		this.getAll = function(index) {
			if(index == null) return null;
			return this.uit.getNodeAll(index);
		}
	}

    UI.setup = function() {
        return {
            root: null,
            rootHide: false,
            rootFold: false,
            drag: false,
            dragChild: true
        }
    }
	
	return UI;
});
jui.defineUI("uix.window", [ "jquery", "util.base", "ui.modal" ], function($, _, modal) {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var z_index = 2000,
			target = null,
			move = {},
			resize = {},
			info = {},
			ui_modal = null;

		
		/**
		 * Private Methods
		 *
		 */
		function setBodyResize() {
			var bottom = (info.$foot.length < 1) ? 5 : info.$foot.outerHeight();
			info.$body.outerHeight(info.$root.outerHeight() - info.$head.outerHeight() - bottom);
		}
		
		
		/**
		 * Public Methods
		 *
		 */
		
		this.init = function() {
			var self = this, opts = this.options;
			
			var $win_root = $(this.root),
				$win_head = $(this.root).children(".head"),
				$win_body = $(this.root).children(".body"),
				$win_foot = $(this.root).children(".foot");
				
			// 옵션 예외 처리
			if(opts.modal) {
				opts.move = false;
				opts.resize = false;
			}
				
			// UI 객체 추가
			info = { $root: $win_root, $head: $win_head, $body: $win_body, $foot: $win_foot };
			
			// 기본 스타일 & Modal 스타일 & Body로 강제 이동
			$win_root.css($.extend({ position: "absolute" }, opts)).appendTo($("body"));
			
			// 윈도우 이동
			if(opts.move) {
				this.addEvent($win_head, "mousedown", function(e) {
					target = $win_root;
					
					move.check = true;
					move.disX = e.pageX - target.offset().left;
					move.disY = e.pageY - target.offset().top;
				});
			}
			
			// 윈도우 리사이징
			if(opts.resize) {
				$win_root.append("<i class='icon-resize resize'></i>");
				
				this.addEvent($win_root.children(".resize"), "mousedown", function(e) {
					target = $win_root;
					
					resize.check = true;
					resize.disX = target.width() + target.offset().left;
					resize.disWidth = target.width();
					resize.disY = target.height() + target.offset().top;
					resize.disHeight = target.height();
					
					return false;
				});
			}
			
			// 윈도우 포커스
			if(!opts.modal) {
				self.addEvent($win_root, "mousedown", function(e) {
					$win_root.css("z-index", ++z_index);
					e.stopPropagation();
				});
			}

			// 윈도우 숨기기
			this.addEvent($win_head.find(".close"), "click", function(e) {
				self.hide();
				return false;
			});
			
			this.addEvent("body", "mousemove", function(e) {
				// 윈도우 이동
				if(move.check) {
					var x = e.pageX - move.disX;
					var y = e.pageY - move.disY;
					
					$(target).css({ left: x + "px", top: y + "px" });
				}

				// 윈도우 리사이징
				if(resize.check) {
					var resizeX = e.pageX - resize.disX,
						resizeY = e.pageY - resize.disY;
					
					target.width(resize.disWidth + resizeX);
					target.height(resize.disHeight + resizeY);
					
					setBodyResize();
				}
			});
			
			this.addEvent("body", "mouseup", function(e) {
				if(move.check) self.emit("move", e); 
				if(resize.check) self.emit("resize", e);
				
				move.check = false;
				resize.check = false;
			});
			
			// 기본 타입 설정
			this.type = "hide";
			$win_root.hide();

			// 모달 컴포넌트 설정
			if(opts.modal) {
				var modalOpts = (opts.modalIndex > 0) ? { index: opts.modalIndex } : {};
				ui_modal = modal(self.root, $.extend({ autoHide: false }, modalOpts));
			}
		}
		
		this.hide = function() {
			if(ui_modal) ui_modal.hide();
			else info.$root.hide();
			
			this.emit("hide");
			this.type = "hide";
		}
		
		this.show = function(x, y) {
			if(ui_modal) ui_modal.show();
			else info.$root.show();
			
			if(x || y) this.move(x, y);
			
			this.emit("show");
			this.type = "show";

			setBodyResize();
		}
		
		this.move = function(x, y) {
			info.$root.css("left", x);
			info.$root.css("top", y);
		}
		
		this.update = function(html) {
			info.$body.empty().html(html);
		}
		
		this.setTitle = function(html) {
			info.$head.find(".title").empty().html(html);
		}
		
		this.setSize = function(w, h) {
			info.$root.width(w);
			info.$root.height(h);
			
			setBodyResize();
		}
		
		this.resize = function() {
			setBodyResize();
		}

        this.resizeModal = function() {
            if(!ui_modal) return;

            ui_modal.resize();
        }
	}

    UI.setup = function() {
        return {
			width: 400,
			height: 300,
			left: "auto",
			top: "auto",
			right: "auto",
			bottom: "auto",
			modal: false,
			move: true,
			resize: true,
			modalIndex: 0,
			animate: false // @Deprecated
        }
    }
	
	return UI;
});
jui.defineUI("uix.xtable", [ "jquery", "util.base", "ui.modal", "uix.table" ], function($, _, modal, table) {
	var p_type = null;

	/**
	 * Common Logic
	 * 
	 */
	_.resize(function() {
		var call_list = jui.get("uix.xtable");
		
		for(var i = 0; i < call_list.length; i++) {
			var ui_list = call_list[i];
			
			for(var j = 0; j < ui_list.length; j++) {
				ui_list[j].resize();
			}
		}
	}, 1000);
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var head = null, body = null;
		var rows = [], o_rows = null;
		var ui_modal = null, page = 1;
        var is_loading = false, is_resize = false;
		
		
		/**
		 * Private Methods
		 * 
		 */
		function createTableList(self) { // 2
			var exceptOpts = [ 
               "buffer", "bufferCount", "csvCount", "sortLoading", "sortCache", "sortIndex", "sortOrder",
               "event", "rows", "scrollWidth", "width"
            ];
			
			body = table($(self.root).children("table"), getExceptOptions(self, exceptOpts.concat("resize"))); // 바디 테이블 생성
			setTableBodyStyle(self, body); // X-Table 생성 및 마크업 설정
			
			head = table($(self.root).children("table.head"), getExceptOptions(self, exceptOpts)); // 헤더 테이블 생성
			setTableAllStyle(self, head, body);
			
			// 테이블 옵션 필터링 함수
			function getExceptOptions(self, exceptOpts) {
				var options = {};
				
				for(var key in self.options) {
					if($.inArray(key, exceptOpts) == -1) {
						options[key] = self.options[key];
					}
				}
				
				return options;
			}
			
			function setTableAllStyle(self, head, body) {
				var opts = self.options;

				$(self.root).css({ "position": "relative" });

				$(head.root).css({
					"position": "absolute",
					"top": "0",
					"border-bottom-width": "0",
					"margin": "0"
				});

				$(body.root).css({
					"margin": "0"
				});
				
				if(opts.width > 0) {
					$(self.root).outerWidth(opts.width);
				}
				
				if(opts.scrollWidth > 0) {
					var rootWidth = $(self.root).outerWidth();
					
					$(self.root).css({
						"max-width": self.options.scrollWidth,
						"overflow-x": "auto",
                        "overflow-y": "hidden"
					});
					
					$(head.root).outerWidth(rootWidth);
					$(body.root).parent().outerWidth(rootWidth);
				}
			}
			
			function setTableBodyStyle(self, body) {
				var $table =  $(body.root).clone(),
					cols = body.listColumn();
				
				// X-Table 바디 영역 스크롤 높이 설정
				if(self.options.buffer != "page") 
					$(body.root).wrap("<div class='body' style='max-height: " + self.options.scrollHeight + "px'></div>");
				else
					$(body.root).wrap("<div class='body'></div>");

                // X-Table 바디 영역의 헤더라인은 마지막 노드를 제외하고 제거
                $(body.root).find("thead > tr").outerHeight(0).not(":last-child").remove();

				// X-Table 헤더 영역 설정
				for(var i = 0; i < cols.length; i++) {
					var $elem = $(cols[i].element);

					$elem.html("").outerHeight(0).attr("style",
							$elem.attr("style") +
							"border-top-width: 0px !important;" +
							"border-bottom-width: 0px !important;" +
							"padding-top: 0px !important;" +
							"padding-bottom: 0px !important"
					);
				}
				
				// 바디 테이블의 tbody 영역 제거
				$table.children("tbody").remove();
				
				// 헤더와 바디 테이블 중간의 간격 정의 (스크롤 관련)
				$(self.root).append($table.addClass("head"));
				$(self.root).css("padding-top", $table.height());
			}
		}
		
		function setCustomEvent(self) {
			head.on("colresize", function(column, e) { // 컬럼 리사이징 관련
				var cols = head.listColumn(),
					bodyCols = body.listColumn(),
					isLast = false;
				
				for(var j = cols.length - 1; j >= 0; j--) {
					var hw = $(cols[j].element).outerWidth();
					
					// 조건 (스크롤, 컬럼보이기, 마지막컬럼)
					// 조건이 명확하지 않으니 차후에 변경
					if(self.options.buffer != "page" && cols[j].type == "show" && !isLast) {
						$(bodyCols[j].element).outerWidth("auto");
						isLast = true;
					} else {
						$(cols[j].element).outerWidth(hw);
						$(bodyCols[j].element).outerWidth(hw);
					}
				}
				
				self.emit("colresize", [ column, e ]);
			});
			
			head.on("colshow", function(column, e) {
				body.uit.showColumn(column.index);
				self.resize();
				self.emit("colshow", [ column, e ]);
			});
			
			head.on("colhide", function(column, e) {
				body.uit.hideColumn(column.index);
				self.resize();
				self.emit("colhide", [ column, e ]);
			});

            head.on("colclick", function(column, e) {
                self.emit("colclick", [ column, e ]);
            });

            head.on("coldblclick", function(column, e) {
                self.emit("coldblclick", [ column, e ]);
            });

			head.on("colmenu", function(column, e) {
				self.emit("colmenu", [ column, e ]);
			});
			
			head.on("sort", function(column, e) {
				self.sort(column.index, column.order, e);
				self.emit("sort", [ column, e ]);
				
				// 소팅 후, 현재 소팅 상태 캐싱 처리 
				if(self.options.sortCache) { 
					self.setOption({ sortIndex: column.index, sortOrder: column.order });
				}
			});
			
			body.on("select", function(obj, e) {
				self.emit("select", [ obj, e ]);
			});
			
			body.on("rowmenu", function(obj, e) {
				self.emit("rowmenu", [ obj, e ]);
			});
			
			body.on("expand", function(obj, e) {
				self.emit("expand", [ obj, e ]);
			});

			body.on("expandend", function(obj, e) {
				self.emit("expandend", [ obj, e ]);
			});
		}
		
		function setScrollEvent(self) {
			var $body = $(self.root).children(".body");
			
			$body.off("scroll").scroll(function(e) {
			    if((this.scrollTop + self.options.scrollHeight) >= $body.get(0).scrollHeight) {
		    		self.next();
			    	self.emit("scroll", e);
			    	
			    	return false;
			    }
			});
		}
		
        function setColumnResizeScroll(self) {
            var column = {},
                width = {},
                resizeX = 0;

            // 리사이즈 엘리먼트 삭제
            $(self.root).find("thead .resize").remove();

            for(var i = 0; i < head.uit.getColumnCount() - 1; i++) {
                var $colElem = $(head.getColumn(i).element),
                    $resizeBar = $("<div class='resize'></div>");
                var pos = $colElem.position();

                $resizeBar.css({
                    position: "absolute",
                    width: "8px",
                    height: $colElem.outerHeight(),
                    left: ($colElem.outerWidth() + (pos.left - 1)) + "px",
                    top: pos.top + "px",
                    cursor: "w-resize",
                    "z-index": "1"
                });

                $colElem.append($resizeBar);

                // Event Start
                (function(index) {
                    self.addEvent($resizeBar, "mousedown", function(e) {
                        if(resizeX == 0) {
                            resizeX = e.pageX;
                        }

                        // 컬럼 객체 가져오기
                        column = {
                            head: head.getColumn(index),
                            body: body.getColumn(index)
                        };

                        width = {
                            column: $(column.head.element).outerWidth(),
                            body: $(body.root).outerWidth()
                        };

                        is_resize = true;

                        return false;
                    });
                })(i);
            }

            self.addEvent("body", "mousemove", function(e) {
                if(resizeX > 0) {
                    colResizeWidth(e.pageX - resizeX);
                }
            });

            self.addEvent("body", "mouseup", function(e) {
                if(resizeX > 0) {
                    resizeX = 0;
                    is_resize = false;

                    // 리사이징 바, 위치 이동
                    colResizeBarLeft();

                    head.emit("colresize", [ column.head, e ]);

                    return false;
                }
            });

            // 리사이징 바 위치 설정
            head.on("colshow", colResizeBarLeft);
            head.on("colhide", colResizeBarLeft);

            function colResizeWidth(disWidth) {
                var colMinWidth = 30;

                // 최소 크기 체크
                if (width.column + disWidth < colMinWidth)
                    return;

                $(column.head.element).outerWidth(width.column + disWidth);
                $(column.body.element).outerWidth(width.column + disWidth);

                if (disWidth > 0) {
                    $(body.root).parent().outerWidth(width.body + disWidth);
                    $(head.root).outerWidth(width.body + disWidth);
                }
            }

            function colResizeBarLeft() {
                for(var i = 0; i < head.uit.getColumnCount() - 1; i++) {
                    var $colElem = $(head.getColumn(i).element);

                    $colElem.find(".resize").css("left", ($colElem.outerWidth() + $colElem.position().left) + "px");
                }
            }
        }
		

		/**
		 * Public Methods
		 * 
		 */
		
		this.init = function() {
			var opts = this.options;

            // @Deprecated, 'rows'는 의미상 맞지 않아 차후 삭제
            opts.data = (opts.rows != null) ? opts.rows : opts.data;

            // 루트가 테이블일 경우, 별도 처리
            if(this.root.tagName == "TABLE") {
                var $root = $(this.root).wrap("<div class='xtable'></div>");
                this.root = $root.parent().get(0);
            }

			// 기본 설정
			createTableList(this);
			setCustomEvent(this);
			
			// 스크롤/페이지-스크롤 옵션
			if(opts.buffer != "page") {
				var $body = $(this.root).children(".body");

				$body.css({
					"overflow-y": "scroll",
					"overflow-x": "hidden"
				});
				
				$body.children("table").css({
					"border-bottom-width": "0"
				});
			}
			
			// 스크롤 버퍼 이벤트
			if(opts.buffer == "scroll") {
				setScrollEvent(this);
			}
			
			// 데이터가 있을 경우
			if(opts.data) {
				this.update(opts.data);
			}
			
			// 로딩 템플릿 체크 (opts.sortLoading으로 체크하지 않음)
			if(opts.tpl.loading) {
				var $loading = $(opts.tpl.loading);
				$(this.root).append($loading);
				
				ui_modal = modal($loading, { 
					target: this.selector,
					opacity: 0.1,
					autoHide: false 
				});
				
				// 기본 로딩 시간 (ms)
				opts.sortLoading = (opts.sortLoading === true) ? 500 : opts.sortLoading; 
			}
			
			// 컬럼 리사이징 (기본)
			if(opts.resize) {
				head.resizeColumns();
				head.resize();
            }

            // 컬럼 리사이징 (가로스크롤)
            if(!opts.resize && opts.scrollWidth > 0) {
                setColumnResizeScroll(this);
            }
		}
		
		this.select = function(index) {
			return body.select(index);
		}
		
		this.update = function(dataList) {
			rows = dataList;
			
			this.clear();
			this.next();
			this.emit("update");
			head.emit("colresize");
			
			// 정렬 인덱스가 옵션에 있을 경우, 해당 인덱스의 컬럼 정렬 (not loading)
			if(this.options.sortIndex) {
				this.sort(this.options.sortIndex, this.options.sortOrder, undefined, true);
			}
		}
		
		this.next = function() {
			var start = (page - 1) * this.options.bufferCount,
				end = start + this.options.bufferCount;
			
			// 마지막 페이지 처리
			end = (end > rows.length) ? rows.length : end;
			
			if(end <= rows.length) { 
				var tmpDataList = [];
				for(var i = start; i < end; i++) {
					tmpDataList.push(rows[i]);
				}
				
				body.append(tmpDataList);
				this.emit("next", [ page ]);

				if(tmpDataList.length > 0) page++;
			}
		}
		
		this.page = function(pNo) {
			if(this.options.buffer == "scroll") return false;
			if(this.getPage() == pNo) return false;
			
			p_type = (page > pNo) ? "prev" : "next";
			this.clear();
			
			page = (pNo < 1) ? 1 : pNo;
			this.next();
		}
		
		this.sort = function(index, order, e, isNotLoading) { // index는 컬럼 key 또는 컬럼 name
			if(!this.options.fields || !this.options.sort || is_resize) return;
			
			var self = this, 
				column = head.getColumn(index);
			
			if(typeof(column.name) == "string") {			
				column.order = (order) ? order : (column.order == "asc") ? "desc" : "asc";
				head.uit.setColumn(index, column);
	
				if(this.options.sortLoading && !isNotLoading) {
					self.showLoading();
					
					setTimeout(function() {
						process();
					}, this.options.sortLoading);
				} else {
					process();
				}
			}
			
			// 정렬 프로세싱 함수
			function process() {
				var qs = _.sort(rows);
				
				if(column.order == "desc") {
					qs.setCompare(function(a, b) {
						return (getValue(a) > getValue(b)) ? true : false;
					});
				} else {
					qs.setCompare(function(a, b) {
						return (getValue(a) < getValue(b)) ? true : false;
					});
				}
				
				// 정렬
				qs.run();
				
				// 데이터 초기화 및 입력, 그리고 로딩
				self.emit("sortend", [ column, e ]);
				self.clear();
				self.next();
				self.hideLoading();
			}
			
		    // 해당 컬럼에 해당하는 값 가져오기
			function getValue(data) {
		    	var value = data[column.name];

                if(typeof(value) == "string") {
                    return value.toLowerCase();
                } else {
                    if(!isNaN(value) && value != null) {
                        return value;
                    }
                }
    			
    			return "";
		    }
		}

        this.filter = function(callback) {
            if(typeof(callback) != "function") return;

            if(o_rows == null) o_rows = rows;
            else rows = o_rows;

            var t_rows = rows.slice(),
                s_rows = [];

            for(var i = 0, len = t_rows.length; i < len; i++) {
                if(callback(t_rows[i]) === true) {
                    s_rows.push(t_rows[i]);
                }
            }

            this.update(s_rows);
            this.emit("filter", [ s_rows ]);
        }

        this.rollback = function() {
            if(o_rows != null) {
                this.update(o_rows);

                o_rows = null;
            }
        }
		
		this.clear = function() {
			page = 1;
			body.uit.removeRows();
			body.scroll();
		}
		
		this.reset = function() {
			this.clear();
			rows = [];
		}
		
		this.resize = function() {
			head.resizeColumns();
			head.resize();
			head.emit("colresize");
		}
		
		this.height = function(h) {
			if(this.options.buffer != "scroll") return;
			
			this.options.scrollHeight = h;
			$(this.root).find(".body").css("max-height", h + "px");
			
			setScrollEvent(this);
		}
		
		this.size = function() { // 차후 수정 (컬럼 * 로우 개수 * 바이트)
			return rows.length;
		}

		this.count = function() {
			return rows.length;
		}
		
		this.list = function() {
			return body.list();
		}
		
		this.listColumn = function() {
			return head.listColumn();
		}
		
		this.listData = function() {
			return rows;
		}
		
		this.get = function(index) {
			if(index == null) return null;
			return body.get(index);
		}
		
		this.getColumn = function(index) {
			return head.getColumn(index);
		}
		
		this.getData = function(index) {
			return rows[index];
		}
		
		this.showColumn = function(index) {
			head.showColumn(index);
		}
		
		this.hideColumn = function(index) {
			head.hideColumn(index);
		}
		
		this.initColumns = function(keys) {
			head.initColumns(keys);
			body.initColumns(keys);
			head.emit("colresize");
		}
		
		this.showColumnMenu = function(x) {
			head.showColumnMenu(x);
		}

        this.hideColumnMenu = function() {
            head.hideColumnMenu();
        }

        this.toggleColumnMenu = function(x) {
            head.toggleColumnMenu(x);
        }

		this.showExpand = function(index, obj) {
			body.showExpand(index, obj);
		}
		
		this.hideExpand = function(index) {
			if(index) body.hideExpand(index);
			else body.hideExpand();
		}
		
		this.getExpand = function() {
			return body.getExpand();
		}
		
		this.showLoading = function(delay) {
			if(!ui_modal || is_loading) return;
			
			ui_modal.show();
			is_loading = true;
			
			if(delay > 0) {
				var self = this;
				
				setTimeout(function() {
					self.hideLoading();
				}, delay);
			}
		}

		this.hideLoading = function() {
			if(!ui_modal || !is_loading) return;
			
			ui_modal.hide();
			is_loading = false;
		}
		
		this.setCsv = function(csv) {
            var opts = this.options;
			if(!opts.fields && !opts.csv) return;
			
			var fields = _.getCsvFields(opts.fields, opts.csv),
                csvNumber = (opts.csvNumber) ? _.getCsvFields(opts.fields, opts.csvNumber) : null;

			this.update(_.csvToData(fields, csv, csvNumber));
		}
		
		this.setCsvFile = function(file) {
			if(!this.options.fields && !this.options.csv) return;
			
			var self = this;
			_.fileToCsv(file, function(csv) {
	            self.setCsv(csv);
			});
		}
		
		this.getCsv = function() {
			if(!this.options.fields && !this.options.csv) return;
			
			var fields = _.getCsvFields(this.options.fields, this.options.csv),
				len = (rows.length > this.options.csvCount) ? this.options.csvCount : rows.length;

			return _.dataToCsv2({
				fields: fields,
				rows: rows,
				count: len,
				names: this.options.csvNames
			});
		}
		
		this.getCsvBase64 = function() {
			if(!this.options.fields && !this.options.csv) return;
			
			return _.csvToBase64(this.getCsv());
		}

        this.downloadCsv = function(name) {
            if(_.typeCheck("string", name)) {
                name = name.split(".")[0];
            }

            var a = document.createElement('a');
            a.download = (name) ? name + ".csv" : "table.csv";
            a.href = this.getCsvBase64();

            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        }
		
		this.rowFunc = function(type, index, callback) {
			if(!this.options.fields) return;
			
			var isCallback = (typeof(callback) == "function") ? true : false;
			var result = 0,
				count = (isCallback) ? 0 : rows.length,
				column = head.getColumn(index);
			
			if(column.name) {
				for(var i = 0; i < rows.length; i++) {
					var value = rows[i][column.name];
					
					if(!isNaN(value)) {
						if(isCallback) {
							if(callback(rows[i])) {
								result += value;
								count++;
							}
						} else {
							result += value;
						}
					}
				}
			}
			
			// 현재는 합계와 평균만 지원함
			if(type == "sum") return result;
			else if(type == "avg") return result / count;
			
			return null;
		}
		
		this.getPage = function() {
			return page - 1;
		}
		
		this.activeIndex = function() {
			return body.activeIndex();
		}
	}

    UI.setup = function() {
        return {
			fields: null,
			csv: null,
			csvNames: null,
			csvNumber: null,
			csvCount: 10000,
			data: [],
			rows: null, // @Deprecated
			colshow: false,
			expand: false,
			expandEvent: true,
			resize: false,
			scrollHeight: 200,
			scrollWidth: 0,
			width: 0,
			buffer: "scroll",
			bufferCount: 100,
			sort: false,
			sortLoading: false,
			sortCache: false,
			sortIndex: null,
			sortOrder: "asc",
			sortEvent: true,
			animate: false // @Deprecated
        }
    }

	return UI;
});
jui.define("chart.draw", [ "jquery", "util.base" ], function($, _) {
	/**
	 * 그리기 Base 클래스
	 * 
	 * 
	 */
	var Draw = function() {

		/**
		 * 모든 Draw 객체는  render 함수를 통해서 그려진다. 
		 * 
		 */
		this.render = function() {
            if(!_.typeCheck("function", this.draw)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method must be implemented");
            }

            // Call drawBefore method (All)
            if(_.typeCheck("function", this.drawBefore)) {
                this.drawBefore();
            }

            // Call draw method (All)
			var obj = this.draw();

            if(!_.typeCheck("object", obj)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method should return the object");
            } else {
                if(_.typeCheck("object", this.brush)) {
                    obj.attr({ "class": "brush brush-" + this.brush.type });
                    obj.translate(this.chart.area("x"), this.chart.area("y")); // 브러쉬일 경우, 기본 좌표 설정
                } else if(_.typeCheck("object", this.widget)) {
                    obj.attr({ "class": "widget widget-" + this.widget.type });
                } else if(_.typeCheck("object", this.grid)) {
                    obj.root.attr({ "class": "grid grid-" + this.grid.type });
                }
            }

            return obj;
		}

        /**
         * Draw 객체 기본 포맷 메소드
         *
         */
        this.format = function() {
            var draw = this.grid || this.brush || this.widget,
                callback = draw.format || this.chart.format;

            return callback.apply(this.chart, arguments);
        }
	}

    Draw.setup = function() {
        return {
            type: null
        }
    }

	return Draw;
});

jui.defineUI("chart.builder", [ "jquery", "util.base", "util.svg", "util.color" ], function($, _, SVGUtil, ColorUtil) {

    /**
     * Common Logic
     *
     */
    var win_width = 0;

    _.resize(function() {
        if(win_width == $(window).width()) return;

        var call_list = jui.get("chart.builder");
        for(var i = 0; i < call_list.length; i++) {
            var ui_list = call_list[i];

            for(var j = 0; j < ui_list.length; j++) {
                if(ui_list[j].isFullSize()) {
                    ui_list[j].setSize();
                }
            }
        }

        win_width = $(window).width();
    }, 300);

    /**
     * Chart Builder 구현
     *
     */
    var UI = function() {
        var _data = [], _tempData = [];
        var _axis = [], _brush = [], _widget = [];
        var _padding, _series, _area, _panel, _theme, _hash = {};
        var _initialize = false, _options = null, _handler = []; // 리셋 대상 커스텀 이벤트 핸들러

        /**
         * chart 기본 영역 계산
         *
         * padding 을 제외한 영역에서  x,y,x2,y2,width,height 속성을 구함
         *
         * 기본적으로 모든 브러쉬와 그리드는 계산된 영역안에서 그려짐
         *
         * @param {Object} self
         */
        function calculate(self) {
            var max = self.svg.size();

            var _chart = {
                width: max.width - (_padding.left + _padding.right),
                height: max.height - (_padding.top + _padding.bottom),
                x: _padding.left,
                y: _padding.top
            };

            // chart 크기가 마이너스일 경우 (엘리먼트가 hidden 상태)
            if(_chart.width < 0) _chart.width = 0;
            if(_chart.height < 0) _chart.height = 0;

            // _chart 영역 계산
            _chart.x2 = _chart.x + _chart.width;
            _chart.y2 = _chart.y + _chart.height;

            _area = _chart;
        }

        function caculatePanel(a) {
            a.x = getValue(a.x, _area.width);
            a.y = getValue(a.y, _area.height);
            a.width = getValue(a.width, _area.width);
            a.height = getValue(a.height, _area.height);

            a.x2 = a.x + a.width;
            a.y2 = a.y + a.height;

            return a;
        }

        function getValue(value, max) {
            if(_.typeCheck("string", value) && value.indexOf("%") > -1) {
                return max * (parseFloat(value.replace("%", "")) /100);
            }

            return value;
        }

        function savePanel(panel) {
            _panel = panel;
        }

        function restorePanel() {
            _panel = null;
        }

        function saveData(data) {
            _tempData = _data;
            _data = data;
        }

        function restoreData() {
            _data = _tempData;
            _tempData = [] ;
        }

        function drawBefore(self) {
            _axis = _.deepClone(_options.axis, { data : true, origin : true });
            _series = _.deepClone(_options.series);
            _brush = _.deepClone(_options.brush);
            _widget = _.deepClone(_options.widget);

            // 해쉬 코드 초기화
            _hash = {};
        }

        function drawDefs(self) {
            // draw defs
            var defs = self.svg.defs();

            // default clip path
            self.clipId = self.createId('clip-id');

            var clip = self.svg.clipPath({
                id: self.clipId
            });

            clip.append(self.svg.rect({
                x: 0,
                y: 0,
                width: self.area('width'),
                height: self.area('height')
            }));
            defs.append(clip);

            self.defs = defs;
        }

        function drawAxis(self) {

            function drawAxisType(axis, k, chart) {

                // 다른 그리드 옵션을 사용함
                if(_.typeCheck("integer", axis[k].extend)) {
                    _.extend(axis[k], _options.axis[axis[k].extend][k], true);
                }

                var Grid = jui.include("chart.grid." + (axis[k].type || "block"));

                // 그리드 기본 옵션과 사용자 옵션을 합침
                jui.defineOptions(Grid, axis[k]);

                // 엑시스 기본 프로퍼티 정의
                var obj = new Grid(chart, axis, axis[k]);
                obj.chart = chart;
                obj.axis = axis;
                obj.grid = axis[k];

                var elem = obj.render();

                // 그리드 별 위치 선정하기
                if(axis[k].orient == "left") {
                    elem.root.translate(_area.x + chart.area("x") - axis[k].dist, _area.y);
                } else if(axis[k].orient == "right") {
                    elem.root.translate(_area.x + chart.area("x2") + axis[k].dist, _area.y);
                } else if(axis[k].orient == "bottom") {
                    elem.root.translate(_area.x , _area.y + chart.area("y2") + axis[k].dist);
                } else if(axis[k].orient == "top") {
                    elem.root.translate(_area.x , _area.y + chart.area("y") - axis[k].dist);
                } else {
                    // custom
                    if(elem.root) elem.root.translate(_area.x, _area.y);
                }

                return elem.scale;
            }

            for(var key in _axis) {
                var axis = _axis[key];

                if(!axis) continue;

                // 엑시스 영역 설정
                axis.area = _.extend(axis.area, {
                    x: 0, y: 0 , width: _area.width, height: _area.height
                }, true);

                savePanel(caculatePanel(axis.area));

                if(_.typeCheck("array", axis.data))
                    saveData(axis.data);

                if(_.typeCheck("object", axis.x)) {
                    axis.x.orient = axis.x.orient || "bottom"
                    axis.x = drawAxisType(axis, "x", self);
                }

                if(_.typeCheck("object", axis.y)) {
                    axis.y.orient = axis.y.orient || "left";
                    axis.y = drawAxisType(axis, "y", self);
                }

                if(_.typeCheck("object", axis.c)) {
                    axis.c = drawAxisType(axis, "c", self);
                }

                if(_.typeCheck("array", axis.data))
                    restoreData();

                restorePanel();

            }
        }

        /**
         * brush 그리기
         *
         * brush 에 맞는 x, y 축(grid) 설정
         *
         */
        function drawBrush(self) {
            var draws = _brush;

            if(draws != null) {
                for(var i = 0; i < draws.length; i++) {
                    var Obj = jui.include("chart.brush." + draws[i].type),
                        axisIndex = draws[i].axis || _options.axisIndex;

                    // 타겟 프로퍼티 설정
                    if(!draws[i].target) {
                        var target = [];

                        if(_axis[axisIndex]) {
                            for(var key in _axis[axisIndex].data[0]) {
                                target.push(key);
                            }
                        }

                        draws[i].target = target;
                    } else if(_.typeCheck("string", draws[i].target)) {
                        draws[i].target = [ draws[i].target ];
                    }

                    // 브러쉬 인덱스 설정
                    draws[i].index = i;

                    // 브러쉬 기본 옵션과 사용자 옵션을 합침
                    jui.defineOptions(Obj, draws[i]);

                    // 브러쉬 기본 프로퍼티 정의
                    var draw = new Obj(self, _axis[axisIndex], draws[i]);
                    draw.chart = self;
                    draw.axis = _axis[axisIndex];
                    draw.brush = draws[i];

                    // 브러쉬 렌더링
                    if(_axis[axisIndex]) saveData(_options.axis[axisIndex].data);
                    draw.render();
                    if(_axis[axisIndex]) restoreData();
                }
            }
        }

        function drawWidget(self, isAll) {
            var draws = _widget;

            if(draws != null) {
                for(var i = 0; i < draws.length; i++) {
                    var Obj = jui.include("chart.widget." + draws[i].type),
                        axisIndex = _options.axisIndex;

                    // 위젯 인덱스 설정
                    draws[i].index = i;

                    // 위젯 기본 옵션과 사용자 옵션을 합침
                    jui.defineOptions(Obj, draws[i]);

                    // 위젯 기본 프로퍼티 정의
                    var draw = new Obj(self, _axis[axisIndex], draws[i]);
                    draw.chart = self;
                    draw.axis = _axis[axisIndex];
                    draw.widget = draws[i];

                    // 위젯은 렌더 옵션이 false일 때, 최초 한번만 로드함 (연산 + 드로잉)
                    // 하지만 isAll이 true이면, 강제로 연산 및 드로잉을 함 (테마 변경 및 리사이징 시)
                    if(_initialize && !draw.isRender() && isAll !== true) {
                        return;
                    }

                    if(_axis[axisIndex]) saveData(_options.axis[axisIndex].data);

                    var elem = draw.render();
                    if(!draw.isRender()) {
                        self.svg.autoRender(elem, false);
                    }

                    if(_axis[axisIndex]) restoreData();
                }
            }
        }

        function setChartEvent(self) {
            var elem = self.svg.root,
                isMouseOver = false;

            elem.on("click", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.click", [ e ]);
                } else {
                    self.emit("chart.click", [ e ]);
                }
            });

            elem.on("dblclick", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.dblclick", [ e ]);
                } else {
                    self.emit("chart.dblclick", [ e ]);
                }
            });

            elem.on("contextmenu", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.rclick", [ e ]);
                } else {
                    self.emit("chart.rclick", [ e ]);
                }

                e.preventDefault();
            });

            elem.on("mousemove", function(e) {
                if (!checkPosition(e)) {
                    if (isMouseOver) {
                        self.emit("chart.mouseout", [ e ]);
                        isMouseOver = false;
                    }

                    self.emit("bg.mousemove", [ e ]);
                } else {
                    if (isMouseOver) {
                        self.emit("chart.mousemove", [ e ]);
                    } else {
                        self.emit("chart.mouseover", [ e ]);
                        isMouseOver = true;
                    }
                }
            });

            elem.on("mousedown", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.mousedown", [ e ]);
                } else {
                    self.emit("chart.mousedown", [ e ]);
                }
            });

            elem.on("mouseup", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.mouseup", [ e ]);
                } else {
                    self.emit("chart.mouseup", [ e ]);
                }
            });

            elem.on("mouseover", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.mouseover", [ e ]);
                }
            });

            elem.on("mouseout", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.mouseout", [ e ]);
                }
            });

            // 드래그 이벤트 막기
            self.addEvent(self.root, "selectstart", function(e) {
                e.preventDefault();
                return false;
            });

            function checkPosition(e) {
                var pos = $(self.root).offset(),
                    offsetX = e.pageX - pos.left,
                    offsetY = e.pageY - pos.top;

                e.bgX = offsetX;
                e.bgY = offsetY;
                e.chartX = offsetX - self.padding("left");
                e.chartY = offsetY - self.padding("top");

                if(e.chartX < 0) return;
                if(e.chartX > self.area("width")) return;
                if(e.chartY < 0) return;
                if(e.chartY > self.area("height")) return;

                return true;
            }
        }

        function resetCustomEvent(self) {
            for(var i = 0; i < _handler.length; i++) {
                self.off(_handler[i]);
            }

            _handler = [];
        }

        function createGradient(self, obj, hashKey) {
            if(!_.typeCheck("undefined", hashKey) && _hash[hashKey]) {
                return "url(#" + _hash[hashKey] + ")";
            }

            var g = null,
                id = self.createId("gradient");

            obj.id = id;

            if(obj.type == "linear") {
                g = self.svg.linearGradient(obj);
            } else if(obj.type == "radial") {
                g = self.svg.radialGradient(obj);
            }

            for(var i = 0; i < obj.stops.length; i++) {
                g.append(self.svg.stop(obj.stops[i]));
            }

            self.defs.append(g);

            if(!_.typeCheck("undefined", hashKey)) {
                _hash[hashKey] = id;
            }

            return "url(#" + id + ")";
        }

        function getColor(self, color) {
            if(_.typeCheck("undefined", color)) {
                return "none";
            }

            if(_.typeCheck("object", color)) {
                return createGradient(self, color);
            }

            var parsedColor = ColorUtil.parse(color);
            if(parsedColor == color)
                return color;

            return createGradient(self, parsedColor, color);
        }

        function setThemeStyle(theme, options) {
            if(_.typeCheck("string", theme)) {
                _theme = _.extend(jui.include("chart.theme." + theme), options);
            } else if(_.typeCheck("object", theme)) {
                _theme = _.extend(_theme, theme);
            }
        }

        function setDefaultOptions(self) {
            // 일부 옵션을 제외하고 클론
            _options = _.deepClone(self.options, { data: true, bind: true });

            var padding = _options.padding;

            // 패딩 옵션 설정
            if(padding == "empty") {
                _padding = { left: 0, right: 0, bottom: 0, top: 0 };
            } else {
                if(_.typeCheck("integer", padding)) {
                    _padding = { left: padding, right: padding, bottom: padding, top: padding };
                } else {
                    _padding = padding;
                }
            }

            // UI 바인딩 설정
            if(_.typeCheck("object", _options.bind)) {
                self.bindUI(_options.bind);
            }

            if(!_.typeCheck("array", _options.axis)) {
                _options.axis = [ _options.axis ];
            }

            if(!_.typeCheck("array", _options.brush)) {
                _options.brush = [ _options.brush ];
            }

            if(!_.typeCheck("array", _options.widget)) {
                _options.widget = [ _options.widget ];
            }
        }

        this.init = function() {
            // 기본 옵션 설정
            setDefaultOptions(this);

            // 차트 테마 설정 (+옵션 스타일)
            setThemeStyle(_options.theme, _options.style);

            // svg 기본 객체 생성
            this.svg = new SVGUtil(this.root, {
                width: _options.width,
                height: _options.height
            });

            // 차트 기본 렌더링
            if(_options.axis[_options.axisIndex]) {
                this.update();
            } else {
                this.render();
            }

            // 차트 이벤트 설정
            setChartEvent(this);
        }

        /**
         * 차트의 구성요소 반환
         *
         * @param key (axis | brush | widget)
         */
        this.get = function(type, key) {
            var obj = {
                axis: _axis,
                brush: _brush,
                widget: _widget,
                series: _series
            };

            if(obj[type][key]) {
                return obj[type][key];
            }

            return obj[type] || obj;
        }

        /**
         * 차트의 영역요소 반환
         *
         * @param key (width | height | x | y | x2 | y2)
         * @returns {*}
         */

        this.area = function(key) {
            if(_panel) {
                return _.typeCheck("undefined", _panel[key]) ? _panel : _panel[key];
            } else {
                return _.typeCheck("undefined", _area[key]) ? _area : _area[key];
            }
        }

        /**
         * 차트의 여백요소 반환
         * @param key (top | left | bottom | right)
         * @returns {*}
         */
        this.padding = function(key) {
            if(_padding[key]) {
                return _padding[key];
            }

            return _padding;
        }

        /**
         * 브러쉬 컬러 관련 함수
         *
         * @param dataIndex
         * @param brush
         * @returns {*}
         */
        this.color = function(i, brush) {
            var color;

            // 테마 & 브러쉬 옵션 컬러 설정
            if(brush.colors instanceof Array) {
                color = brush.colors[i];

                if(_.typeCheck("integer", color)) {
                    color = nextColor(color);
                }
            } else {
                color = nextColor();
            }

            // 시리즈 컬러 설정
            if(_.typeCheck("array", brush.target)) {
                var series = _series[brush.target[i]];

                if(series && series.color) {
                    color = series.color;

                    if(_.typeCheck("integer", color)) {
                        color = nextColor(color);
                    }
                }
            }

            if(_hash[color]) {
                return "url(#" + _hash[color] + ")";
            }

            function nextColor(newIndex) {
                var c = _theme["colors"],
                    index = newIndex || i;

                return (index > c.length - 1) ? c[c.length - 1] : c[index];
            }

            return getColor(this, color);
        }

        /**
         * 현재 text 관련 theme 가 정해진 text element 생성
         *
         * @param {object} attr
         * @param {string|function} textOrCallback
         */
        this.text = function(attr, textOrCallback) {
            var el = this.svg.text(_.extend({
                "font-family": this.theme("fontFamily"),
                "font-size": this.theme("fontSize"),
                "fill": this.theme("fontColor")
            }, attr), textOrCallback);

            return el;
        }

        /**
         * theme 의 요소에 대한 값 구하기
         *
         * <code>
         *
         * // theme 전체 객체 얻어오기
         * var theme = chart.theme();
         *
         * // 부분 속성 얻어오기
         * var fontColor = chart.theme("fontColor");
         *
         * // 값 비교해서 얻어오기
         * chart.theme(isSelected, "selectedFontColor", "fontColor");  // isSelected 가 true 이면 selectedFontColor, 아니면 fontColor 리턴
         *
         *
         * </code>
         *
         *
         */
        this.theme = function(key, value, value2) {
            if(arguments.length == 0) {
                return _theme;
            } else if(arguments.length == 1) {
                if(key.indexOf("Color") > -1 && _theme[key] != null) {
                    return getColor(this, _theme[key]);
                }

                return _theme[key];
            } else if(arguments.length == 3) {
                var val = (key) ? value : value2;

                if(val.indexOf("Color") > -1 && _theme[val] != null) {
                    return getColor(this, _theme[val]);
                }

                return _theme[val];
            }
        }

        /**
         * 브러쉬/위젯/그리드에서 공통적으로 사용하는 숫자 포맷 함수
         *
         */
        this.format = function() {
            if(arguments.length == 0) return;
            var callback = _options.format;

            if(_.typeCheck("function", callback)) {
                return callback.apply(this, arguments);
            }

            return arguments[0];
        }

        /**
         * chart 내에서 사용될 유일한 키 생성
         *
         * @param {string} key
         */
        this.createId = function(key) {
            return [key || "chart-id", (+new Date), Math.round(Math.random() * 100) % 100].join("-")
        }

        /**
         * uix.table, uix.xtable 객체를 바인딩 해서 사용할 수 있음.
         * 테이블 요소를 수정하면 chart의 data 속성으로 자동으로 설정
         *
         * @param {object} bind   uix.table, uix.xtable 객체 사용
         */
        this.bindUI = function(uiObj) {
            var self = this;

            if(uiObj.module.type == "uix.table") {
                uiObj.callAfter("update", updateTable);
                uiObj.callAfter("sort", updateTable);
                uiObj.callAfter("append", updateTable);
                uiObj.callAfter("insert", updateTable);
                uiObj.callAfter("remove", updateTable);
            } else if(uiObj.module.type == "uix.xtable") {
                uiObj.callAfter("update", updateXTable);
                uiObj.callAfter("sort", updateXTable);
            }

            function updateTable() {
                var data = [];

                for (var i = 0; i < uiObj.count(); i++) {
                    data.push(uiObj.get(i).data);
                }

                self.update(data);
            }

            function updateXTable() {
                self.update(uiObj.listData());
            }
        }

        /**
         * 차트에서 사용할 커스텀 이벤트 핸들러
         *
         * @param type
         * @param callback
         */
        this.on = function(type, callback, isReset) {
            if(!_.typeCheck("string", type)  || !_.typeCheck("function", callback)) return;

            this.event.push({ type: type.toLowerCase(), callback: callback  });
            if(isReset === true) _handler.push(callback);
        }

        /**
         * chart render 함수 재정의
         *
         */
        this.render = function(isAll) {
            // SVG 메인 리셋
            this.svg.reset(isAll);

            // chart 이벤트 초기화 (삭제 대상)
            resetCustomEvent(this);

            // chart 영역 계산
            calculate(this);

            // chart 관련된 요소 draw
            drawBefore(this);
            drawDefs(this);
            drawAxis(this);
            drawBrush(this);
            drawWidget(this, isAll);

            // SVG 태그 백그라운드 테마 설정
            this.svg.root.css({
                background: this.theme("backgroundColor")
            });

            // SVG 메인/서브 렌더링
            this.svg.render(isAll);

            // 초기화 설정
            _initialize = true;
        }

        /**
         * data 업데이트 후 차트 다시 생성
         *
         * @param {array} data
         */
        this.update = function(data) {
            var axis = _options.axis[_options.axisIndex];
            if(!axis) return;

            if(data) {
                axis.origin = data;
            } else {
                axis.origin = axis.data || [];
            }

            axis.buffer = axis.buffer || 10000;
            axis.shift = axis.shift || 1;
            axis.page = 1;
            axis.start = 0;
            axis.end = 0;

            this.page(axis.page);
        }

        this.page = function(pNo) {
            var axis = _options.axis[_options.axisIndex];
            if(!axis) return;

            var dataList = axis.origin,
                limit = axis.buffer,
                maxPage = Math.ceil(dataList.length / limit);

            // 최소 & 최대 페이지 설정
            if(pNo < 1) {
                axis.page = 1;
            } else {
                axis.page = (pNo > maxPage) ? maxPage : pNo;
            }

            axis.start = (axis.page - 1) * limit, axis.end = axis.start + limit;

            // 마지막 페이지 처리
            if(axis.end > dataList.length) {
                axis.start = dataList.length - limit;
                axis.end = dataList.length;
            }

            if(axis.end <= dataList.length) {
                axis.start = (axis.start < 0) ? 0 : axis.start;
                axis.data = dataList.slice(axis.start, axis.end);

                if(this.isRender()) this.render();
                if(dataList.length > 0) axis.page++;
            }
        }

        this.next = function() {
            var axis = _options.axis[_options.axisIndex];
            if(!axis) return;

            var dataList = axis.origin,
                limit = axis.buffer,
                step = axis.shift;

            axis.start += step;

            var isLimit = (axis.start + limit > dataList.length);

            axis.end = (isLimit) ? dataList.length : axis.start + limit;
            axis.start = (isLimit) ? dataList.length - limit : axis.start;
            axis.start = (axis.start < 0) ? 0 : axis.start;
            axis.data = dataList.slice(axis.start, axis.end);

            if(this.isRender()) this.render();
        }

        this.prev = function() {
            var axis = _options.axis[_options.axisIndex];
            if(!axis) return;

            var dataList = axis.origin,
                limit = axis.buffer,
                step = axis.shift;

            axis.start -= step;

            var isLimit = (axis.start < 0);

            axis.end = (isLimit) ? limit : axis.start + limit;
            axis.start = (isLimit) ? 0 : axis.start;
            axis.data = dataList.slice(axis.start, axis.end);

            if(this.isRender()) this.render();
        }

        this.zoom = function(start, end) {
            var axis = _options.axis[_options.axisIndex];
            if(!axis || start == end) return;

            var dataList = axis.origin;
            axis.end = (end > dataList.length) ? dataList.length : end;
            axis.start = (start < 0) ? 0 : start;
            axis.data = dataList.slice(axis.start, axis.end);

            if(this.isRender()) this.render();
        }

        /**
         * chart CSV 데이터 갱신 후 렌더링
         *
         * @param csv
         */
        this.setCsv = function(csv) {
            var chartFields = [],
                csvFields = _options.csv,
                csvNumber = _options.csvNumber;

            for(var key in _series) {
                chartFields.push(key);
            }

            if(chartFields.length == 0 && !csvFields)
                return;

            var fields = _.getCsvFields(chartFields, csvFields),
                csvNumber = (csvNumber) ? _.getCsvFields(fields, csvNumber) : null;

            this.update(_.csvToData(fields, csv, csvNumber));
        }

        /**
         * chart CSV 파일 데이터 설정
         *
         * @param file
         */
        this.setCsvFile = function(file) {
            var self = this;

            _.fileToCsv(file, function(csv) {
                self.setCsv(csv);
            });
        }


        /**
         * Brush & Widget & Axis 관련 메소드
         *
         */

        this.addAxis = function(axis) {
            _options.axis.push(axis);
            if(this.isRender()) this.render();
        }
        this.removeAxis = function(index) {
            _options.axis.splice(index, 1);
            if(this.isRender()) this.render();
        }
        this.updateAxis = function(index, axis) {
            _.extend(_options.axis[index], axis);
            if(this.isRender()) this.render();
        }

        this.addBrush = function(brush) {
            _options.brush.push(brush);
            if(this.isRender()) this.render();
        }
        this.removeBrush = function(index) {
            _options.brush.splice(index, 1);
            if(this.isRender()) this.render();
        }
        this.updateBrush = function(index, brush) {
            _.extend(_options.brush[index], brush);
            if(this.isRender()) this.render();
        }

        this.addWidget = function(widget) {
            _options.widget.push(widget);
            if(this.isRender()) this.render(true);
        }
        this.removeWidget = function(index) {
            _options.widget.splice(index, 1);
            if(this.isRender()) this.render(true);
        }
        this.updateWidget = function(index, widget) {
            _.extend(_options.widget[index], widget);
            if(this.isRender()) this.render(true);
        }


        /**
         * 테마 변경 후 차트 렌더링
         *
         * @param themeName
         */
        this.setTheme = function(theme) {
            setThemeStyle(theme, _options.style);
            if(this.isRender()) this.render(true);
        }

        /**
         * 사이즈 조정 후 차트 렌더링
         *
         * @param {integer} width
         * @param {integer} height
         */
        this.setSize = function(width, height) {
            if(arguments.length == 2) {
                _options.width = width;
                _options.height = height;
            }

            this.svg.size(_options.width, _options.height);
            if(this.isRender()) this.render(true);
        }

        /**
         * 차트가 풀-사이즈인지 확인
         *
         * @returns {boolean}
         */
        this.isFullSize = function() {
            if(_options.width == "100%" || _options.height == "100%")
                return true;

            return true;
        }

        /**
         * 차트의 렌더링 상태 확인
         *
         * @returns {boolean}
         */
        this.isRender = function() {
            return (!_initialize) ? true : _options.render;
        }
    }

    UI.setup = function() {
        return {
            width: "100%", // chart 기본 넓이
            height: "100%", // chart 기본 높이
            padding: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            },

            // chart
            theme: "jennifer", // 기본 테마 jennifer
            style: {},
            series: {},
            brush: [],
            widget: [],
            axis: [],
            axisIndex: 0,
            bind: null,
            format: null,
            render: true,

            // csv
            csv: null,
            csvNumber: null
        }
    }

    return UI;
});

jui.define("chart.theme.jennifer", [], function() {
    var themeColors = [
        "#7977C2",
        "#7BBAE7",
        "#FFC000",
        "#FF7800",
        "#87BB66",
        "#1DA8A0",
        "#929292",
        "#555D69",
        "#0298D5",
        "#FA5559",
        "#F5A397",
        "#06D9B6",
        "#C6A9D9",
        "#6E6AFC",
        "#E3E766",
        "#C57BC3",
        "#DF328B",
        "#96D7EB",
        "#839CB5",
        "#9228E4"
    ];

    return {
        // common styles
    	backgroundColor : "white",
    	fontSize : "11px",
    	fontColor : "#333333",
		fontFamily : "arial,Tahoma,verdana",
        colors : themeColors,

        // grid styles
    	gridFontColor : "#333333",
    	gridActiveFontColor : "#ff7800",
        gridBorderColor : "#ebebeb",
    	gridBorderWidth : 1,
        gridBorderDashArray : "none",
		gridAxisBorderColor : "#ebebeb",
		gridAxisBorderWidth : 1,
    	gridActiveBorderColor : "#ff7800",
    	gridActiveBorderWidth: 1,

        // brush styles
        tooltipPointRadius : 5, // common
        tooltipPointBorderWidth : 1, // common
        tooltipPointFontWeight : "bold", // common
        barBorderColor : "none",
        barBorderWidth : 0,
        barBorderOpacity : 0,
        barActiveBackgroundColor : "#06d9b6",
        barCircleBorderColor : "white",
        barDisableBackgroundOpacity : 0.5,
    	gaugeBackgroundColor : "#ececec",
        gaugeArrowColor : "#666666",
        gaugeFontColor : "#666666",
    	pieBorderColor : "white",
        pieBorderWidth : 1,
        donutBorderColor : "white",
        donutBorderWidth : 1,
    	areaBackgroundOpacity : 0.5,
        areaSplitBackgroundColor : "#929292",
        bubbleBackgroundOpacity : 0.5,
        bubbleBorderWidth : 1,
        candlestickBorderColor : "black",
        candlestickBackgroundColor : "white",
        candlestickInvertBorderColor : "red",
        candlestickInvertBackgroundColor : "red",
        ohlcBorderColor : "black",
        ohlcInvertBorderColor : "red",
        ohlcBorderRadius : 5,
        lineBorderWidth : 2,
        lineDisableBorderOpacity : 0.3,
        lineCircleBorderColor : "white",
        lineSplitBorderColor : null,
        lineSplitBorderOpacity : 0.5,
        pathBackgroundOpacity : 0.5,
        pathBorderWidth : 1,
        scatterBorderColor : "white",
        scatterBorderWidth : 1,
        scatterHoverColor : "white",
        waterfallBackgroundColor : "#87BB66",
        waterfallInvertBackgroundColor : "#FF7800",
        waterfallEdgeBackgroundColor : "#7BBAE7",
        waterfallLineColor : "#a9a9a9",
        waterfallLineDashArray : "0.9",
        focusBorderColor : "#FF7800",
        focusBorderWidth : 1,
        focusBackgroundColor : "#FF7800",
        focusBackgroundOpacity : 0.1,
        pinBorderColor : "#FF7800",
        pinBorderWidth : 0.7,

        // widget styles
        titleFontColor : "#333",
        titleFontSize : "13px",
        titleFontWeight : "normal",
        legendFontColor : "#333",
        legendFontSize : "12px",
        tooltipFontColor : "#333",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "white",
        tooltipBorderColor : "#aaaaaa",
        tooltipBackgroundOpacity : 0.7,
        scrollBackgroundColor : "#dcdcdc",
        scrollThumbBackgroundColor : "#b2b2b2",
        scrollThumbBorderColor : "#9f9fa4",
        zoomBackgroundColor : "red",
        zoomFocusColor : "gray",
        crossBorderColor : "#a9a9a9",
        crossBorderWidth : 1,
        crossBorderOpacity : 0.8,
        crossBalloonFontSize : "11px",
        crossBalloonFontColor : "white",
        crossBalloonBackgroundColor : "black",
        crossBalloonBackgroundOpacity : 0.5
    }
});
jui.define("chart.theme.gradient", [], function() {
    var themeColors = [
        "linear(top) #9694e0,0.9 #7977C2",
        "linear(top) #a1d6fc,0.9 #7BBAE7",
        "linear(top) #ffd556,0.9 #ffc000",
        "linear(top) #ff9d46,0.9 #ff7800",
        "linear(top) #9cd37a,0.9 #87bb66",
        "linear(top) #3bb9b2,0.9 #1da8a0",
        "linear(top) #b3b3b3,0.9 #929292",
        "linear(top) #67717f,0.9 #555d69",
        "linear(top) #16b5f6,0.9 #0298d5",
        "linear(top) #ff686c,0.9 #fa5559",
        "linear(top) #fbbbb1,0.9 #f5a397",
        "linear(top) #3aedcf,0.9 #06d9b6",
        "linear(top) #d8c2e7,0.9 #c6a9d9",
        "linear(top) #8a87ff,0.9 #6e6afc",
        "linear(top) #eef18c,0.9 #e3e768",
        "linear(top) #ee52a2,0.9 #df328b",
        "linear(top) #b6e5f4,0.9 #96d7eb",
        "linear(top) #93aec8,0.9 #839cb5",
        "linear(top) #b76fef,0.9 #9228e4"
    ];

    return {
        // common styles
        backgroundColor : "white",
        fontSize : "11px",
        fontColor : "#666",
        fontFamily : "arial,Tahoma,verdana",
        colors : themeColors,

        // grid styles
        gridFontColor : "#666",
        gridActiveFontColor : "#ff7800",
        gridBorderColor : "#efefef",
        gridBorderWidth : 1,
        gridBorderDashArray : "none",
        gridAxisBorderColor : "#efefef",
        gridAxisBorderWidth : 1,
        gridActiveBorderColor : "#ff7800",
        gridActiveBorderWidth: 1,

        // brush styles
        tooltipPointRadius : 5, // common
        tooltipPointBorderWidth : 1, // common
        tooltipPointFontWeight : "bold", // common
        barBorderColor : "none",
        barBorderWidth : 0,
        barBorderOpacity : 0,
        barActiveBackgroundColor : "linear(top) #3aedcf,0.9 #06d9b6",
        barCircleBorderColor : "white",
        barDisableBackgroundOpacity : 0.5,
        gaugeBackgroundColor : "#ececec",
        gaugeArrowColor : "#666666",
        gaugeFontColor : "#666666",
        pieBorderColor : "white",
        pieBorderWidth : 1,
        donutBorderColor : "white",
        donutBorderWidth : 1,
        areaBackgroundOpacity : 0.4,
        areaSplitBackgroundColor : "linear(top) #b3b3b3,0.9 #929292",
        bubbleBackgroundOpacity : 0.5,
        bubbleBorderWidth : 1,
        candlestickBorderColor : "black",
        candlestickBackgroundColor : "linear(top) white",
        candlestickInvertBorderColor : "red",
        candlestickInvertBackgroundColor : "linear(top) red",
        ohlcBorderColor : "#14be9d",
        ohlcInvertBorderColor : "#ff4848",
        ohlcBorderRadius : 5,
        lineBorderWidth : 2,
        lineDisableBorderOpacity : 0.3,
        lineCircleBorderColor : "white",
        lineSplitBorderColor : null,
        lineSplitBorderOpacity : 0.5,
        pathBackgroundOpacity : 0.5,
        pathBorderWidth : 1,
        scatterBorderColor : "white",
        scatterBorderWidth : 2,
        scatterHoverColor : "white",
        waterfallBackgroundColor : "linear(top) #9cd37a,0.9 #87bb66",
        waterfallInvertBackgroundColor : "linear(top) #ff9d46,0.9 #ff7800",
        waterfallEdgeBackgroundColor : "linear(top) #a1d6fc,0.9 #7BBAE7",
        waterfallLineColor : "#a9a9a9",
        waterfallLineDashArray : "0.9",
        focusBorderColor : "#FF7800",
        focusBorderWidth : 1,
        focusBackgroundColor : "#FF7800",
        focusBackgroundOpacity : 0.1,
        pinBorderColor : "#FF7800",
        pinBorderWidth : 0.7,

        // widget styles
        titleFontColor : "#333",
        titleFontSize : "13px",
        titleFontWeight : "normal",
        legendFontColor : "#666",
        legendFontSize : "12px",
        tooltipFontColor : "#fff",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "black",
        tooltipBorderColor : "none",
        tooltipBackgroundOpacity : 1,
        scrollBackgroundColor : "#dcdcdc",
        scrollThumbBackgroundColor : "#b2b2b2",
        scrollThumbBorderColor : "#9f9fa4",
        zoomBackgroundColor : "red",
        zoomFocusColor : "gray",
        crossBorderColor : "#a9a9a9",
        crossBorderWidth : 1,
        crossBorderOpacity : 0.8,
        crossBalloonFontSize : "11px",
        crossBalloonFontColor : "white",
        crossBalloonBackgroundColor : "black",
        crossBalloonBackgroundOpacity : 0.8
    }
});
jui.define("chart.theme.dark", [], function() {

    var themeColors = [
        "#12f2e8",
        "#26f67c",
        "#e9f819",
        "#b78bf9",
        "#f94590",
        "#8bccf9",
        "#9228e4",
        "#06d9b6",
        "#fc6d65",
        "#f199ff",
        "#c8f21d",
        "#16a6e5",
        "#00ba60",
        "#91f2a1",
        "#fc9765",
        "#f21d4f"
    ];

    return {
        // common styles
    	backgroundColor : "#222222",
    	fontSize : "12px",
    	fontColor : "#c5c5c5",
		fontFamily : "arial,Tahoma,verdana",
        colors : themeColors,

        // grid styles
    	gridFontColor : "#868686",
    	gridActiveFontColor : "#ff762d",
        gridBorderColor : "#464646",
        gridBorderWidth : 1,
        gridBorderDashArray : "none",
		gridAxisBorderColor : "#464646",
		gridAxisBorderWidth : 1,
    	gridActiveBorderColor : "#ff7800",
    	gridActiveBorderWidth: 1,

        // brush styles
        tooltipPointRadius : 5, // common
        tooltipPointBorderWidth : 1, // common
        tooltipPointFontWeight : "bold", // common
        barBorderColor : "none",
        barBorderWidth : 0,
        barBorderOpacity : 0,
        barActiveBackgroundColor : "#fc6d65",
        barCircleBorderColor : "white",
        barDisableBackgroundOpacity : 0.5,
    	gaugeBackgroundColor : "#3e3e3e",
        gaugeArrowColor : "#a6a6a6",
        gaugeFontColor : "#c5c5c5",
    	pieBorderColor : "#232323",
        pieBorderWidth : 1,
        donutBorderColor : "#232323",
        donutBorderWidth : 1,
        areaBackgroundOpacity : 0.5,
        areaSplitBackgroundColor : "#ebebeb",
        bubbleBackgroundOpacity : 0.5,
        bubbleBorderWidth : 1,
        candlestickBorderColor : "#14be9d",
        candlestickBackgroundColor : "#14be9d",
        candlestickInvertBorderColor : "#ff4848",
        candlestickInvertBackgroundColor : "#ff4848",
        ohlcBorderColor : "#14be9d",
        ohlcInvertBorderColor : "#ff4848",
        ohlcBorderRadius : 5,
        lineBorderWidth : 2,
        lineDisableBorderOpacity : 0.3,
        lineCircleBorderColor : "white",
        lineSplitBorderColor : null,
        lineSplitBorderOpacity : 0.5,
        pathBackgroundOpacity : 0.2,
        pathBorderWidth : 1,
        scatterBorderColor : "none",
        scatterBorderWidth : 1,
        scatterHoverColor : "#222222",
        waterfallBackgroundColor : "#26f67c",
        waterfallInvertBackgroundColor : "#f94590",
        waterfallEdgeBackgroundColor : "#8bccf9",
        waterfallLineColor : "#a9a9a9",
        waterfallLineDashArray : "0.9",
        focusBorderColor : "#FF7800",
        focusBorderWidth : 1,
        focusBackgroundColor : "#FF7800",
        focusBackgroundOpacity : 0.1,
        pinBorderColor : "#FF7800",
        pinBorderWidth : 0.7,

        // widget styles
        titleFontColor : "#ffffff",
        titleFontSize : "14px",
        titleFontWeight : "normal",
        legendFontColor : "#ffffff",
        legendFontSize : "11px",
        tooltipFontColor : "#333333",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "white",
        tooltipBorderColor : "white",
        tooltipBackgroundOpacity : 1,
        scrollBackgroundColor : "#3e3e3e",
        scrollThumbBackgroundColor : "#666666",
        scrollThumbBorderColor : "#686868",
        zoomBackgroundColor : "red",
        zoomFocusColor : "gray",
        crossBorderColor : "#a9a9a9",
        crossBorderWidth : 1,
        crossBorderOpacity : 0.8,
        crossBalloonFontSize : "11px",
        crossBalloonFontColor : "#333",
        crossBalloonBackgroundColor : "white",
        crossBalloonBackgroundOpacity : 1
    }
});
jui.define("chart.theme.pastel", [], function() {
	var themeColors = [
		"#73e9d2",
		"#fef92c",
		"#ff9248",
		"#b7eef6",
		"#08c4e0",
		"#ffb9ce",
		"#ffd4ba",
		"#14be9d",
		"#ebebeb",
		"#666666",
		"#cdbfe3",
		"#bee982",
		"#c22269"
	];

	return {
		// common styles
		backgroundColor : "white",
		fontSize : "11px",
		fontColor : "#333333",
		fontFamily : "Caslon540BT-Regular,Times,New Roman,serif",
		colors : themeColors,

		// grid styles
		gridFontColor : "#333333",
		gridActiveFontColor : "#ff7800",
		gridBorderColor : "#bfbfbf",
		gridBorderWidth : 1,
		gridBorderDashArray : "1, 3",
		gridAxisBorderColor : "#bfbfbf",
		gridAxisBorderWidth : 1,
		gridActiveBorderColor : "#ff7800",
		gridActiveBorderWidth : 1,

		// brush styles
		tooltipPointRadius : 5, // common
		tooltipPointBorderWidth : 1, // common
		tooltipPointFontWeight : "bold", // common
		barBorderColor : "none",
		barBorderWidth : 0,
		barBorderOpacity : 0,
		barActiveBackgroundColor : "#ffb9ce",
		barCircleBorderColor : "#ebebeb",
		barDisableBackgroundOpacity : 0.5,
		gaugeBackgroundColor : "#f5f5f5",
        gaugeArrowColor : "gray",
		gaugeFontColor : "#666666",
		pieBorderColor : "white",
		pieBorderWidth : 1,
		donutBorderColor : "white",
		donutBorderWidth : 3,
		areaBackgroundOpacity : 0.4,
		areaSplitBackgroundColor : "#ebebeb",
		bubbleBackgroundOpacity : 0.5,
		bubbleBorderWidth : 1,
		candlestickBorderColor : "#14be9d",
		candlestickBackgroundColor : "#14be9d",
		candlestickInvertBorderColor : "#ff4848",
		candlestickInvertBackgroundColor : "#ff4848",
        ohlcBorderColor : "#14be9d",
        ohlcInvertBorderColor : "#ff4848",
        ohlcBorderRadius : 5,
		lineBorderWidth : 2,
		lineDisableBorderOpacity : 0.3,
		lineCircleBorderColor : "white",
		lineSplitBorderColor : null,
		lineSplitBorderOpacity : 0.5,
		pathBackgroundOpacity : 0.5,
		pathBorderWidth : 1,
		scatterBorderColor : "white",
		scatterBorderWidth : 1,
		scatterHoverColor : "white",
		waterfallBackgroundColor : "#73e9d2",
		waterfallInvertBackgroundColor : "#ffb9ce",
		waterfallEdgeBackgroundColor : "#08c4e0",
		waterfallLineColor : "#a9a9a9",
		waterfallLineDashArray : "0.9",
		focusBorderColor : "#FF7800",
		focusBorderWidth : 1,
		focusBackgroundColor : "#FF7800",
		focusBackgroundOpacity : 0.1,
		pinBorderColor : "#FF7800",
		pinBorderWidth : 0.7,

        // widget styles
        titleFontColor : "#333",
        titleFontSize : "18px",
		titleFontWeight : "normal",
        legendFontColor : "#333",
        legendFontSize : "11px",
        tooltipFontColor : "#fff",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "black",
        tooltipBorderColor : "black",
		tooltipBackgroundOpacity : 0.7,
		scrollBackgroundColor :	"#f5f5f5",
		scrollThumbBackgroundColor : "#b2b2b2",
		scrollThumbBorderColor : "#9f9fa4",
		zoomBackgroundColor : "red",
		zoomFocusColor : "gray",
		crossBorderColor : "#a9a9a9",
		crossBorderWidth : 1,
		crossBorderOpacity : 0.8,
		crossBalloonFontSize : "11px",
		crossBalloonFontColor :	"white",
		crossBalloonBackgroundColor : "black",
		crossBalloonBackgroundOpacity : 0.7
	}
}); 
jui.define("chart.grid.core", [ "jquery", "util.base" ], function($, _) {
	/**
	 * Grid Core 객체 
	 * 
	 */
	var CoreGrid = function() {

		/**
		 * scale wrapper 
		 * 
		 * grid 의 x 좌표 값을 같은 형태로 가지고 오기 위한 wrapper 함수 
		 * 
		 * grid 속성에 key 가 있다면  key 의 속성값으로 실제 값을 처리 
		 * 
		 * ex) 
		 * 
		 * // 그리드 속성에 키가 없을 때 
		 * scale(0);		// 0 인덱스에 대한 값  (block, radar)
		 * 
		 * // grid 속성에 key 가 있을 때  
		 * grid { key : "field" }
		 * scale(0)			// field 값으로 scale 설정 (range, date)
		 * 
		 */
		this.wrapper = function(chart, scale, key) {
			var old_scale = scale;
			var self = this;

			function new_scale(i) {
				return old_scale(self.axis.data[i][key]);
			}

			new_scale.update = old_scale.update = function(obj) {
				self.grid = $.extend(self.grid, obj);
			}

			new_scale.domain = function() {
				return old_scale.domain.apply(old_scale, arguments);
			}

			new_scale.range = function() {
				return old_scale.range.apply(old_scale, arguments);
			}

			new_scale.max = function() {
				return old_scale.max.apply(old_scale, arguments);
			}

			new_scale.rangeMin = function() {
				return old_scale.rangeMin.apply(old_scale, arguments);
			}

			new_scale.rangeMax = function() {
				return old_scale.rangeMax.apply(old_scale, arguments);
			}

			new_scale.min = function() {
				return old_scale.min.apply(old_scale, arguments);
			}
			
			new_scale.rangeBand = function() {
				return old_scale.rangeBand.apply(old_scale, arguments);
			}
			
			new_scale.rate = function() {
				return old_scale.rate.apply(old_scale, arguments);
			}
			
			new_scale.invert = function() {
				return old_scale.invert.apply(old_scale, arguments);
			}
			
			new_scale.clamp = function() {
				return old_scale.clamp.apply(old_scale, arguments);
			}
			
			return (key) ? new_scale : old_scale;
		}
		
		/**
		 * theme 이 적용된  axis line 리턴
		 * 
		 */
		this.axisLine = function(chart, attr) {
			return chart.svg.line($.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,
				stroke : this.color("gridAxisBorderColor"),
				"stroke-width" : chart.theme("gridAxisBorderWidth"),
				"stroke-opacity" : 1
			}, attr));
		}

		/**
		 * theme 이 적용된  line 리턴 
		 * 
		 */
		this.line = function(chart, attr) {
			return chart.svg.line($.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,				
				stroke : this.color("gridBorderColor"),
				"stroke-width" : chart.theme("gridBorderWidth"),
				"stroke-dasharray" : chart.theme("gridBorderDashArray"),
				"stroke-opacity" : 1
			}, attr));
		}

		this.color  = function(theme) {
			if (arguments.length == 3) {
				return (this.grid.color) ? this.chart.color(0, { colors: [ this.grid.color ] }) : this.chart.theme.apply(this.chart, arguments);
			}

			return (this.grid.color) ? this.chart.color(0, { colors: [ this.grid.color ] }) : this.chart.theme(theme);
		}

		this.data = function(index, field) {
			if(this.axis.data && this.axis.data[index]) {
                return this.axis.data[index][field] || this.axis.data[index];
			}

			return this.axis.data || [];
		}

		/**
		 * grid 그리기  
		 * 
		 */		
		this.drawGrid = function(chart, orient, cls, grid) {
			// create group
			var root = chart.svg.group();

			// render axis
			this[orient].call(this, chart, root);

			// wrapped scale
			this.scale = this.wrapper(chart, this.scale, grid.key);

			// hide grid 
			if (grid.hide) {
				root.attr({ display : "none" })
			}

			return {
				root : root,
				scale : this.scale
			};
		}

		this.getTextRotate = function(textElement) {
			var rotate = this.grid.textRotate;

			if (rotate == null) {
				return textElement;
			}

			if (_.typeCheck("function", rotate)) {
				rotate = rotate.apply(this.chart, [ textElement ]);
			}

			var x = textElement.attr("x");
			var y = textElement.attr("y");

			textElement.rotate(rotate, x, y);

			return textElement;
		}

		/**
		 * grid 의 실제 위치와 size 를 구함
		 *
		 * @param chart
		 * @param orient
		 * @param grid
		 * @returns {{start: number, size: *}}
		 */
		this.getGridSize = function(chart, orient, grid) {
			var width = chart.area('width'),
				height = chart.area('height'),
				axis = (orient == "left" || orient == "right") ? chart.area('y') : chart.area('x'),
				max = (orient == "left" || orient == "right") ? height : width,
				start = axis,
				size = max;

			return {
				start: start,
				size: size,
				end: start + size
			}
		}
	}

	CoreGrid.setup = function() {
		return {
			extend:	null,
			dist: 0,
			orient: null,
			hide: false,
			color: null,
			title: null,
			line: false,
            subline : 0,
            baseline : true,
			format: null,
			textRotate : null
		};
	}

	return CoreGrid;
}, "chart.draw"); 
jui.define("chart.grid.block", [ "util.scale", "util.base" ], function(UtilScale, _) {

	var BlockGrid = function(chart, axis, grid) {
		var orient = grid.orient;
		var domain = [];

		this.top = function(chart, g, scale) {
			var full_height = chart.area('height');
			
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x1 : this.start,
					x2 : this.end
				}))
			}

			for (var i = 0; i < this.points.length; i++) {
				var domain = this.format(this.domain[i], i);

                if (!domain && domain !== 0) {
                    continue;
                }

				var axis = chart.svg.group({
					"transform" : "translate(" + this.points[i] + ", 0)"
				});

				axis.append(this.line(chart, {
					x1 : -this.half_band,
					y1 : 0,
					x2 : -this.half_band,
					y2 : (grid.line) ? full_height : this.bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : 0,
					y : -20,
					"text-anchor" : "middle"
				}, domain)));

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(" + this.end + ", 0)"
				});

				axis.append(this.line(chart, {
					y2 : (grid.line) ? full_height : this.bar
				}));

				g.append(axis);
			}
		}
		
		this.bottom = function(chart, g, scale) {
			var full_height = chart.area('height');

			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x1 : this.start,
					x2 : this.end
				}));
			}

			for (var i = 0, len = this.points.length; i < len; i++) {
				var domain = this.format(this.domain[i], i);

				if (!domain && domain !== 0) {
                    continue;
                }
                
				var axis = chart.svg.group({
					"transform" : "translate(" + this.points[i] + ", 0)"
				});
				
				axis.append(this.line(chart, {
					x1 : -this.half_band,
					y1 : 0,
					x2 : -this.half_band,
					y2 : (grid.line) ? -full_height : this.bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : 0,
					y : 20,
					"text-anchor" : "middle"
				}, domain)));

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(" + this.end + ", 0)"
				})

				axis.append(this.line(chart, {
					y2 : (grid.line) ? -full_height : this.bar
				}));

				g.append(axis);
			}
		}
		
		this.left = function(chart, g, scale) {
			var full_width = chart.area('width');

			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}))
			}

			for (var i = 0; i < this.points.length; i++) {
				var domain = this.format(this.domain[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0, " + (this.points[i] - this.half_band ) + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? full_width : -this.bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : -this.bar - 4,
					y : this.half_band,
					"text-anchor" : "end"
				}, domain)));

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(0, " + this.end + ")"
				})

				axis.append(this.line(chart, {
					x2 : (grid.line) ? chart.area('width') : -this.bar
				}));

				g.append(axis);
			}
		}

		this.right = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}));
			}

			for (var i = 0; i < this.points.length; i++) {
				var domain = this.format(this.domain[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0, " + (this.points[i] - this.half_band) + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? -chart.area('width') : this.bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : this.bar + 4,
					y : this.half_band,
					"text-anchor" : "start"
				}, domain)));

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(0, " + this.end + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? -chart.area('width') : this.bar
				}));

				g.append(axis);
			}
		}

		/**
		 * block,radar grid 에 대한 domain 설정
		 *
		 */
		this.initDomain = function() {

			if (_.typeCheck("string", this.grid.domain)) {
				var field = this.grid.domain;
				var data = this.data();

				if (this.grid.reverse) {
					var start = data.length - 1,
						end = 0,
						step = -1;
				} else {
					var start = 0,
						end = data.length - 1,
						step = 1;
				}

				for (var i = start; ((this.grid.reverse) ? i >= end : i <=end); i += step) {
					domain.push(data[i][field]);
				}

				//grid.domain = domain;
			} else if (_.typeCheck("function", this.grid.domain)) {	// block 은 배열을 통째로 리턴함
				domain = this.grid.domain.call(this.chart);
			} else {
				domain = this.grid.domain;
			}

			if (this.grid.reverse) {
				domain.reverse();
			}

		}

		this.drawBefore = function() {
			this.initDomain();

			grid.type = grid.type || "block";

			var obj = this.getGridSize(chart, orient, grid);

			// scale 설정
			this.scale = UtilScale.ordinal().domain(domain);
			var range = [obj.start, obj.end];

			if (grid.full) {
				this.scale.rangeBands(range);
			} else {
				this.scale.rangePoints(range);
			}

			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.points = this.scale.range();
			this.domain = this.scale.domain();

			this.band = this.scale.rangeBand();
			this.half_band = (grid.full) ? 0 : this.band / 2;
			this.bar = 6;
			this.reverse = grid.reverse;
		}

		this.draw = function() {
			return this.drawGrid(chart, orient, "block", grid);
		}
	}


	BlockGrid.setup = function() {
		return {
			domain: null,
			reverse: false,
			max: 10,
			full: false
		};
	}

	return BlockGrid;
}, "chart.grid.core");

jui.define("chart.grid.date", [ "util.time", "util.scale", "util.base" ], function(UtilTime, UtilScale, _) {

	var DateGrid = function(chart, axis, grid) {
		var orient = grid.orient;
		var domain = [];
		var step = [];

		this.top = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x1 : this.start,
					x2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line(chart, {
					y2 : (grid.line) ? chart.area('height') : -bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : 0,
					y : -bar - 4,
					"text-anchor" : "middle",
					fill : chart.theme("gridFontColor")
				}, domain)));

				g.append(axis);
			}
		}

		this.bottom = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x1 : this.start,
					x2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var group = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				group.append(this.line(chart, {
					y2 : (grid.line) ? -chart.area('height') : bar
				}));

				group.append(this.getTextRotate(chart.text({
					x : 0,
					y : bar * 3,
					"text-anchor" : "middle",
					fill : chart.theme("gridFontColor")
				}, domain)));

				g.append(group);
			}
		}

		this.left = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0," + values[i] + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? chart.area('width') : -bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : -bar-2,
					y : bar-2,
					"text-anchor" : "end",
					fill : chart.theme("gridFontColor")
				}, domain)));

				g.append(axis);
			}
		}

		this.right = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}));
			}

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;
			
			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0," + values[i] + ")"
				});

				axis.append(this.line(chart,{
					x2 : (grid.line) ? -chart.area('width') : bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : bar + 4,
					y : -bar,
					"text-anchor" : "start",
					fill : chart.theme("gridFontColor")
				}, domain)));

				g.append(axis);
			}
		}


		/**
		 * date grid 의 domain 설정
		 *
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성
		 *
		 */
		this.initDomain = function() {

			var min = this.grid.min || undefined,
				max = this.grid.max || undefined;
			var data = this.data();

            var value_list = [] ;

			if (_.typeCheck("string", this.grid.domain)) {
				var field = this.grid.domain;
				value_list.push(+data[0][field]);
				value_list.push(+data[data.length-1][field]);
			} else if (_.typeCheck("function", this.grid.domain)) {
				var index = data.length;
				while(index--) {

                    var value = this.grid.domain.call(this.chart, data[index]);

                    if (_.typeCheck("array", value)) {
                        value_list[index] = Math.max.apply(Math, value);
                        value_list.push(Math.min.apply(Math, value));
                    } else {
                        value_list[index]  = value;
                    }
                }


			} else {
				value_list = this.grid.domain;
			}

			if (_.typeCheck("undefined", min)) min = Math.min.apply(Math, value_list);
			if (_.typeCheck("undefined", max)) max = Math.max.apply(Math, value_list);

			this.grid.max = max;
			this.grid.min = min;
			domain = [this.grid.min, this.grid.max];
			step = this.grid.step;

			if (this.grid.reverse) {
				domain.reverse();
			}

			if (_.typeCheck("function", step)) {
				this.grid.step = step.call(this.chart, domain);
			}

			return domain;
		}

		this.drawBefore = function() {
			this.initDomain();

			var obj = this.getGridSize(chart, orient, grid),
				range = [obj.start, obj.end];

			this.scale = UtilScale.time().domain(domain).rangeRound(range);



			if (this.grid.realtime) {
				this.ticks = this.scale.realTicks(grid.step[0], grid.step[1]);
			} else {
				this.ticks = this.scale.ticks(grid.step[0], grid.step[1]);
			}

			if ( typeof grid.format == "string") {
				(function(grid, str) {
					grid.format = function(value) {
						return UtilTime.format(value, str);
					}	
				})(grid, grid.format)
			}

			// step = [this.time.days, 1];
			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.bar = 6;
			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = this.scale(this.ticks[i]);
			}
		}

		this.draw = function() {
			return this.drawGrid(chart, orient, "date", grid);
		}
	}

	DateGrid.setup = function() {
		return {
			domain: null,
			step: 10,
			min: 0,
			max: 0,
			unit: null,
			reverse: false,
			key: null,
			realtime: false
		};
	}

	return DateGrid;
}, "chart.grid.core");

jui.define("chart.grid.radar", [ "util.math", "util.base" ], function(math, _) {

	var RadarGrid = function(chart, axis, grid) {
		var self = this,
			position = [];
		var domain = [] ;

		function drawCircle(chart, root, centerX, centerY, x, y, count) {
			var r = Math.abs(y),
				cx = centerX,
				cy = centerY;

			root.append(chart.svg.circle({
				cx : cx,
				cy : cy,
				r : r,
				"fill-opacity" : 0,
				stroke : self.color("gridAxisBorderColor"),
				"stroke-width" : chart.theme("gridBorderWidth")
			}));
		}

		function drawRadial(chart, root, centerX, centerY, x, y, count, unit) {
			var g = chart.svg.group();
			var points = [];

			points.push([centerX + x, centerY + y]);

			var startX = x,
				startY = y;

			for (var i = 0; i < count; i++) {
				var obj = math.rotate(startX, startY, unit);

				startX = obj.x;
				startY = obj.y;

				points.push([centerX + obj.x, centerY + obj.y]);
			}

			var path = chart.svg.path({
				"fill" : "none",
				stroke : self.color("gridAxisBorderColor"),
				"stroke-width" : chart.theme("gridBorderWidth")
			});

			for (var i = 0; i < points.length; i++) {
				var point = points[i];

				if (i == 0) {
					path.MoveTo(point[0], point[1])
				} else {
					path.LineTo(point[0], point[1]);
				}
			}

			path.LineTo(points[0][0], points[0][1]);
			//path.ClosePath();

			g.append(path);
			root.append(g);
		}

        function scale(obj) {
            var max = grid.max;

            var dx = chart.padding('left');
            var dy = chart.padding('top');

            return function(index, value) {
                var rate = value / max;

				var height = Math.abs(obj.y1) - Math.abs(obj.y2),
					pos = height * rate,
					unit = 2 * Math.PI / domain.length;

				var cx = obj.x1,
					cy = obj.y1,
					y = -pos,
					x = 0;

                var o = math.rotate(x, y, unit * index);

                return {
                    x : dx + cx + o.x,
                    y : dy + cy + o.y
                }
            }
        }


		/**
		 * block,radar grid 에 대한 domain 설정
		 *
		 */
		this.initDomain = function() {

			if (_.typeCheck("string", this.grid.domain)) {
				var field = this.grid.domain;
				var data = this.data();

				if (this.grid.reverse) {
					var start = data.length - 1,
						end = 0,
						step = -1;
				} else {
					var start = 0,
						end = data.length - 1,
						step = 1;
				}

				for (var i = start; ((this.grid.reverse) ? i >= end : i <=end); i += step) {
					domain.push(data[i][field]);
				}

				//grid.domain = domain;
			} else if (_.typeCheck("function", this.grid.domain)) {	// block 은 배열을 통째로 리턴함
				domain = this.grid.domain(this.chart, this.grid);
			} else {
				domain = this.grid.domain;
			}

			if (this.grid.reverse) {
				domain.reverse();
			}

		}

		this.drawBefore = function() {
			this.initDomain();
		}

		this.draw = function() {
			var width = chart.area('width'), height = chart.area('height');
			var min = width;

			if (height < min) {
				min = height;
			}

			// center
			var w = min / 2,
				centerX = chart.area('x') + width / 2,
				centerY = chart.area('y') + height / 2;

			var startY = -w,
				startX = 0,
				count = domain.length,
				step = this.grid.step,
				unit = 2 * Math.PI / count,
				h = Math.abs(startY) / step;

			var g = chart.svg.group(),
				root = chart.svg.group();

			g.append(root);

			// domain line
			position = [];

			for (var i = 0; i < count; i++) {
				var x2 = centerX + startX,
					y2 = centerY + startY;

				root.append(chart.svg.line({
					x1 : centerX,
					y1 : centerY,
					x2 : x2,
					y2 : y2,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : chart.theme("gridBorderWidth")
				}));

				position[i] = {
					x1 : centerX,
					y1 : centerY,
					x2 : x2,
					y2 : y2
				};

				var ty = y2,
					tx = x2,
					talign = "middle";

				if (y2 > centerY) {
					ty = y2 + 20;
				} else if (y2 < centerY) {
					ty = y2 - 10;
				}

				if (x2 > centerX) {
					talign = "start";
					tx += 10;
				} else if (x2 < centerX) {
					talign = "end";
					tx -= 10;
				}

				if (!grid.hideText) {
					root.append(chart.text({
						x : tx,
						y : ty,
						"text-anchor" : talign,
						fill : chart.theme("gridFontColor")
					}, domain[i]))
				}
				
				var obj = math.rotate(startX, startY, unit);

				startX = obj.x;
				startY = obj.y;
			}

			if (!grid.line) {
				return {
					root : root , 
					scale : scale(position[0])
				};
			}

			// area split line
			startY = -w;
			var stepBase = 0,
				stepValue = this.grid.max / this.grid.step;

			for (var i = 0; i < step; i++) {
				if (i == 0 && this.grid.extra) {
					startY += h;
					continue;
				}

				if (this.grid.shape == "circle") {
					drawCircle(chart, root, centerX, centerY, 0, startY, count);
				} else {
					drawRadial(chart, root, centerX, centerY, 0, startY, count, unit);
				}

				if (!this.grid.hideText) {
					root.append(chart.text({
						x : centerX,
						y : centerY + (startY + h - 5),
						fill : chart.theme("gridFontColor")
					}, (this.grid.max - stepBase) + ""))
				}

				startY += h;
				stepBase += stepValue;
			}
			
			// hide
			if (this.grid.hide) {
				root.attr({ display : "none" })
			}			

			return {
				root : root, 
				scale : scale(position[0])
			};
		}
	}

	RadarGrid.setup = function() {
		return {
			domain: null,
			reverse: false,
			max: 100,
            step : 10,
			line: true,
			hideText: false,
			extra: false,
			shape: "radial" // or circle
		};
	}

	return RadarGrid;
}, "chart.grid.core");

jui.define("chart.grid.range", [ "util.scale", "util.base" ], function(UtilScale, _) {

	var RangeGrid = function(chart, axis, grid) {
		var orient = grid.orient;
		var domain = [];

		this.top = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x2 : this.size
				}));
			}

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {

				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line(chart, {
					y2 : (grid.line) ? chart.area('height') : -bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")
				}));

				axis.append(this.getTextRotate(chart.text({
					x : 0,
					y : -bar - 4,
					"text-anchor" : "middle",
					fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
				}, domain)));

				g.append(axis);
			}
		}

		this.bottom = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x1 : this.start,
					x2 : this.end
				}));
			}

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {

				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = chart.svg.group({
					"transform" : "translate(" + values[i] + ", 0)"
				});

				axis.append(this.line(chart, {
					y2 : (grid.line) ? -chart.area('height') : bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")
				}));

				axis.append(this.getTextRotate(chart.text({
					x : 0,
					y : bar * 3,
					"text-anchor" : "middle",
					fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
				}, domain)))

				g.append(axis);
			}
		}

		this.left = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}));

			}

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {

				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = chart.svg.group({
					"transform" : "translate(0, " + values[i] + ")"
				})

				axis.append(this.line(chart, {
					x2 : (grid.line) ? chart.area('width') : -bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")					
				}));

				if (!grid.hideText) {
					axis.append(this.getTextRotate(chart.text({
						x : -bar - 4,
						y : bar,
						"text-anchor" : "end",
						fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
					}, domain)));
				}

				g.append(axis);

			}
		}

		this.right = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}));
			}

			var min = this.scale.min(),
				ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0 && ticks[i] != min);

				var axis = chart.svg.group({
					"transform" : "translate(0, " + values[i] + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? -chart.area('width') : bar,
					stroke : this.color(isZero, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : chart.theme(isZero, "gridActiveBorderWidth", "gridBorderWidth")
				}));

				axis.append(this.getTextRotate(chart.text({
					x : bar + 4,
					y : bar,
					"text-anchor" : "start",
					fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
				}, domain)));

				g.append(axis);
			}
		}


		/**
		 * range grid 의 domain 설정
		 *
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성
		 *
		 */
		this.initDomain = function() {

			var min = this.grid.min || undefined,
				max = this.grid.max || undefined,
				data = this.data();
			var value_list = [];
			var isArray = false;

			if (_.typeCheck("string", this.grid.domain)) {
				var field = this.grid.domain;

				value_list = new Array(data.length);
				var index = data.length;
				while(index--) {
					var value = data[index][field];

					if (_.typeCheck("array", value)) {
						value_list[index] = Math.max(value);
						value_list.push(Math.min(value));
					} else {
						value_list[index]  = value;
						value_list.push(0);
					}
				}
			} else if (_.typeCheck("function", this.grid.domain)) {
				value_list = new Array(data.length);

                var isCheck = false;
				var index = data.length;
				while(index--) {

					var value = this.grid.domain.call(this.chart, data[index]);

					if (_.typeCheck("array", value)) {

						value_list[index] = Math.max.apply(Math, value);
						value_list.push(Math.min.apply(Math, value));
					} else {
						value_list[index]  = value;

                        if (!isCheck) {
                            value_list.push(0);
                            isCheck = true;
                        }

					}
				}
			} else {
				value_list = grid.domain;
				isArray = true;
			}

			var tempMin = Math.min.apply(Math, value_list);
			var tempMax = Math.max.apply(Math, value_list);

			if (isArray) {
				min = tempMin;
				max = tempMax;
			} else {
				if (typeof min == 'undefined' || min > tempMin) min = tempMin;
				if (typeof max == 'undefined' || max < tempMax) max = tempMax;
			}

			this.grid.max = max;
			this.grid.min = min;

			var unit;

			if (_.typeCheck("function", this.grid.unit)) {
				unit = this.grid.unit.call(this.chart, this.grid);
			} else if (_.typeCheck("number", this.grid.unit)) {
				unit = this.grid.unit;
			} else {
				unit = Math.ceil((max - min) / this.grid.step);
			}

			if (unit == 0) {
				domain = [0, 0];
			} else {

				var start = 0;

				while (start < max) {
					start += unit;
				}

				var end = start;
				while (end > min) {
					end -= unit;
				}

				domain = [end, start];

				this.grid.step = (Math.abs(end - start) / unit);
			}

			if (this.grid.reverse) {
				domain.reverse();
			}

			return domain;
		}

		this.drawBefore = function() {
			this.initDomain();

			var obj = this.getGridSize(chart, orient, grid);

			this.scale = UtilScale.linear().domain(domain);

			if (orient == "left" || orient == "right") {
				this.scale.range([obj.end, obj.start]);
			} else {
				this.scale.range([obj.start, obj.end]);
			}

			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.step = this.grid.step;
			this.nice = this.grid.nice;
			this.ticks = this.scale.ticks(this.step, this.nice);
			this.bar = 6;

			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = this.scale(this.ticks[i]);
			}
		}

		this.draw = function() {
			return this.drawGrid(chart, orient, "range", grid);
		}
	}

	RangeGrid.setup = function() {
		return {
			domain: null,
			step: 10,
			min: 0,
			max: 0,
			unit: null,
			reverse: false,
			key: null,
			hideText: false,
			nice: false
		};
	}

	return RangeGrid;
}, "chart.grid.core");

jui.define("chart.grid.rule", [ "util.scale", "util.base" ], function(UtilScale, _) {

	var RuleGrid = function(chart, axis, grid) {
		var orient = grid.orient;
		var domain = [];

		this.top = function(chart, g) {
			var height = chart.area('height'),
				half_height = height/2;

			g.append(this.axisLine(chart, {
				y1 : this.center ? half_height : 0,
				y2 : this.center ? half_height : 0,
				x1 : this.start,
				x2 : this.end
			}));

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0),
					axis = chart.svg.group().translate(values[i], (this.center) ? half_height : 0)

				axis.append(this.line(chart, {
				  y1 : (this.center) ? -bar : 0,
					y2 : bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : chart.theme("gridBorderWidth")
				}));

				if (!isZero || (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(chart.text({
						x : 0,
						y : bar + bar + 4,
						"text-anchor" : "middle",
						fill : chart.theme("gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.bottom = function(chart, g) {
			var height = chart.area('height'),
				half_height = height/2;
		  
			g.append(this.axisLine(chart, {
				y1 : this.center ? -half_height : 0,
				y2 : this.center ? -half_height : 0,
				x1 : this.start,
				x2 : this.end
			}));

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0),
					axis = chart.svg.group().translate(values[i], (this.center) ? -half_height : 0);

				axis.append(this.line(chart, {
				  y1 : (this.center) ? -bar : 0,
					y2 : (this.center) ? bar : -bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : chart.theme("gridBorderWidth")
				}));
				
				if (!isZero ||  (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(chart.text({
						x : 0,
						y : -bar * 2,
						"text-anchor" : "middle",
						fill : chart.theme(isZero, "gridActiveFontColor", "gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.left = function(chart, g) {
			var width = chart.area('width'),
				height = chart.area('height'),
				half_width = width/2;

			g.append(this.axisLine(chart, {
				x1 : this.center ? half_width : 0,
				x2 : this.center ? half_width : 0,
				y1 : this.start ,
				y2 : this.end
			}));

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0),
					axis = chart.svg.group().translate((this.center) ? half_width : 0, values[i])

				axis.append(this.line(chart, {
					x1 : (this.center) ? -bar : 0,
					x2 : bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : chart.theme("gridBorderWidth")					
				}));
				
				if (!isZero ||  (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(chart.text({
					  x : bar/2 + 4,
					  y : bar-2,
					  fill : chart.theme("gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.right = function(chart, g) {
			var width = chart.area('width'),
				half_width = width/2;

			g.append(this.axisLine(chart, {
				x1 : this.center ? -half_width : 0,
				x2 : this.center ? -half_width : 0,
				y1 : this.start ,
				y2 : this.end
			}));

			var ticks = this.ticks,
				values = this.values,
				bar = this.bar;

			for (var i = 0; i < ticks.length; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isZero = (ticks[i] == 0),
					axis = chart.svg.group().translate((this.center) ? -half_width : 0, values[i]);

				axis.append(this.line(chart, {
					x1 : (this.center) ? -bar : 0,
					x2 : (this.center) ? bar : -bar,
					stroke : this.color("gridAxisBorderColor"),
					"stroke-width" : chart.theme("gridBorderWidth")
				}));

				if (!isZero ||  (isZero && !this.hideZero)) {
					axis.append(this.getTextRotate(chart.text({
						x : -bar - 4,
						y : bar-2,
						"text-anchor" : "end",
						fill : chart.theme("gridFontColor")
					}, domain)));
				}

				g.append(axis);
			}
		}

		/**
		 * range grid 의 domain 설정
		 *
		 * grid 속성중에 domain 이 없고 target 만 있을 때  target 을 기준으로  domain 생성
		 *
		 */
        this.initDomain = function() {

            var min = this.grid.min || undefined,
                max = this.grid.max || undefined,
                data = this.data();
            var value_list = [];

            if (_.typeCheck("string", this.grid.domain)) {
                var field = this.grid.domain;

                value_list = new Array(data.length);
                for (var index = 0, len = data.length; index < len; index++) {

                    var value = data[index][field];

                    if (_.typeCheck("array", value)) {
                        value_list[index] = Math.max(value);
                        value_list.push(Math.min(value));
                    } else {
                        value_list[index]  = value;
                    }

                }
            } else if (_.typeCheck("function", this.grid.domain)) {
                value_list = new Array(data.length);

                for (var index = 0, len = data.length; index < len; index++) {

                    var value = this.grid.domain.call(this.chart, data[index]);

                    if (_.typeCheck("array", value)) {

                        value_list[index] = Math.max.apply(Math, value);
                        value_list.push(Math.min.apply(Math, value));
                    } else {
                        value_list[index]  = value;
                    }
                }
            } else {
                value_list = grid.domain;
            }

            var tempMin = Math.min.apply(Math, value_list);
            var tempMax = Math.max.apply(Math, value_list);

            if (typeof min == 'undefined') min = tempMin;
            if (typeof max == 'undefined') max = tempMax;

            this.grid.max = max;
            this.grid.min = min;

            var unit;

            if (_.typeCheck("function", this.grid.unit)) {
                unit = this.grid.unit.call(this.chart, this.grid);
            } else if (_.typeCheck("number", this.grid.unit)) {
                unit = this.grid.unit;
            } else {
                unit = Math.ceil((max - min) / this.grid.step);
            }

            if (unit == 0) {
                domain = [0, 0];
            } else {

                var start = 0;

                while (start < max) {
                    start += unit;
                }

                var end = start;
                while (end > min) {
                    end -= unit;
                }

                domain = [end, start];
                console.log(min, max);

                //this.grid.step = Math.abs(start / unit) + Math.abs(end / unit);
            }

            if (this.grid.reverse) {
                domain.reverse();
            }

            return domain;
        }

		this.drawBefore = function() {
			this.initDomain();

			var obj = this.getGridSize(chart, orient, grid);
			this.scale = UtilScale.linear().domain(domain);

			if (orient == "left" || orient == "right") {
				this.scale.range([obj.end, obj.start]);
			} else {
				this.scale.range([obj.start, obj.end]);
			}

			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.step = this.grid.step;
			this.nice = this.grid.nice;
			this.ticks = this.scale.ticks(this.step, this.nice);
			this.bar = 6;
			this.hideZero = this.grid.hideZero;
			this.center = this.grid.center;
			this.values = [];

			for (var i = 0, len = this.ticks.length; i < len; i++) {
				this.values[i] = this.scale(this.ticks[i]);
			}
		}

		this.draw = function() {
			return this.drawGrid(chart, orient, "rule", grid);
		}
	}

	RuleGrid.setup = function() {
		return {
			domain: null,
			step: 10,
			min: 0,
			max: 0,
			unit: null,
			reverse: false,
			key: null,
			hideZero: false,
			hideText: false,
			nice: false,
			center: false
		};
	}

	return RuleGrid;
}, "chart.grid.core");

jui.define("chart.grid.panel", [  ], function() {

    var PanelGrid = function(chart, axis, grid) {
        var start, size;

        function getValue(value, max) {
            if (typeof value == 'string' && value.indexOf("%") > -1) {
                return max * (parseFloat(value.replace("%", "")) /100);
            }

            return value;
        }

        function getArrayValue (value, chart) {
            var start;

            if (typeof value == 'number') {
                start = [value, value];
            } else if (typeof value == 'string') {

                if (value.indexOf("%") > -1) {
                    start = [getValue(value, chart.area('width')), getValue(value,  chart.area('height'))]
                } else {
                    start = [parseFloat(value), parseFloat(value)]
                }

            } else if (value instanceof Array) {

                for(var i = 0; i < value.length; i++) {
                    if (i == 0) {
                        value[i] = getValue(value[i], chart.area('width'));
                    } else if (i == 1) {
                        value[i] = getValue(value[i], chart.area('height'));
                    }
                }

                start = value;
            }

            return start;
        }

        this.drawBefore = function() {
            start = [0, 0];

            if (grid.start !== null) {
                start = getArrayValue(grid.start, chart);
            }

            size = [chart.area('width'), chart.area('height')];
            if (grid.size != null) {
                size = getArrayValue(grid.size, chart);
            }
        }

        this.scale = function() {
            return function() {
                return {
                    x : start[0],
                    y : start[1],
                    width : size[0],
                    height : size[1]
                }
            }
        }

        this.draw = function() {
            return {
                scale : this.scale(chart)
            };
        }
    }
    
    return PanelGrid;
}, "chart.grid.core");

jui.define("chart.grid.table", [  ], function() {

    var TableGrid = function(chart, axis, grid) {
        var start, size, rowUnit, columnUnit, outerPadding, row, column ;

        function getValue(value, max) {
            if (typeof value == 'string' && value.indexOf("%") > -1) {
                return max * (parseFloat(value.replace("%", "")) /100);
            }

            return value;
        }

        function getArrayValue (value, chart) {
            var start;

            if (typeof value == 'number') {
                start = [value, value];
            } else if (typeof value == 'string') {

                if (value.indexOf("%") > -1) {
                    start = [getValue(value, chart.area('width')), getValue(value,  chart.area('height'))]
                } else {
                    start = [parseFloat(value), parseFloat(value)]
                }

            } else if (value instanceof Array) {
                for(var i = 0; i < value.length; i++) {
                    if (i == 0) {
                        value[i] = getValue(value[i], chart.area('width'));
                    } else if (i == 1) {
                        value[i] = getValue(value[i], chart.area('height'));
                    }
                }

                start = value;
            }

            return start;
        }

        this.drawBefore = function() {
            start = [ 0, 0 ];

            if (grid.start !== null) {
                start = getArrayValue(grid.start, chart);
            }

            size = [chart.area('width'), chart.area('height')];
            if (grid.size != null) {
                size = getArrayValue(grid.size, chart);
            }

            row = grid.row;
            column = grid.column;

            columnUnit = size[0] / column;
            rowUnit = size[1] / row;

            outerPadding = grid.outerPadding;
        }

        this.scale = function(chart) {
            return function(i) {

                var r = Math.floor(i  / column) ;
                var c = i % column;

                var x = c * columnUnit;
                var y = r * rowUnit;

                return {
                    x : x - outerPadding,
                    y : y - outerPadding,
                    width : columnUnit - outerPadding*2,
                    height : rowUnit - outerPadding*2
                }
            }
        }

        this.draw = function() {
            return {
                scale : this.scale(chart)
            };
        }
    }

    TableGrid.setup = function() {
        return {
            row: 1,
            column: 1,
            outerPadding: 1
        };
    }
    
    return TableGrid;
}, "chart.grid.core");

jui.define("chart.grid.overlap", [  ], function() {

    var OverlapGrid = function(chart, axis, grid) {
        var size, widthUnit, heightUnit, width, height ;

        function getXY ( i ) {
            var x = width/2  - i * widthUnit;
            var y = height/2 - i * heightUnit;

            return { x : x , y : y }
        }

        this.drawBefore = function() {
            size = grid.size || this.data().length ||  1;

            widthUnit = (chart.area('width') / 2) / size;
            heightUnit = (chart.area('height') / 2) / size;

            width = chart.area('width');
            height = chart.area('height');
        }

        this.scale = function(chart) {
            return function(i) {
                var obj = getXY(size - i);

                return {
                    x : obj.x,
                    y : obj.y,
                    width : Math.abs(width/2 - obj.x)*2,
                    height : Math.abs(height/2 - obj.y)*2
                }
            }
        }

        this.draw = function() {
            return {
                scale : this.scale(chart)
            };
        }
    }
    
    return OverlapGrid;
}, "chart.grid.core");

jui.define("chart.brush.core", [ "jquery", "util.base" ], function($, _) {
	var CoreBrush = function() {

        function getMinMaxValue(data, target) {
            var seriesList = {},
                targetList = {};

            for(var i = 0; i < target.length; i++) {
                if (!seriesList[target[i]]) {
                    targetList[target[i]] = [];
                }
            }

            // 시리즈 데이터 구성
            for(var i = 0, len = data.length; i < len; i++) {
                var row = data[i];

                for(var k in targetList) {
                    targetList[k].push(row[k]);
                }
            }

            for(var key in targetList) {
                seriesList[key] = {
                    min : Math.min.apply(Math, targetList[key]),
                    max : Math.max.apply(Math, targetList[key])
                }
            }

            return seriesList;
        }

        /**
         * 좌표 배열 'K'에 대한 커브 좌표 'P1', 'P2'를 구하는 함수
         *
         * @param K
         * @returns {{p1: Array, p2: Array}}
         */
		this.curvePoints = function(K) {
			var p1 = [];
			var p2 = [];
			var n = K.length - 1;

			/*rhs vector*/
			var a = [];
			var b = [];
			var c = [];
			var r = [];

			/*left most segment*/
			a[0] = 0;
			b[0] = 2;
			c[0] = 1;
			r[0] = K[0] + 2 * K[1];

			/*internal segments*/
			for ( i = 1; i < n - 1; i++) {
				a[i] = 1;
				b[i] = 4;
				c[i] = 1;
				r[i] = 4 * K[i] + 2 * K[i + 1];
			}

			/*right segment*/
			a[n - 1] = 2;
			b[n - 1] = 7;
			c[n - 1] = 0;
			r[n - 1] = 8 * K[n - 1] + K[n];

			/*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
			for (var i = 1; i < n; i++) {
				var m = a[i] / b[i - 1];
				b[i] = b[i] - m * c[i - 1];
				r[i] = r[i] - m * r[i - 1];
			}

			p1[n - 1] = r[n - 1] / b[n - 1];
			for (var i = n - 2; i >= 0; --i)
				p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];

			/*we have p1, now compute p2*/
			for (var i = 0; i < n - 1; i++)
				p2[i] = 2 * K[i + 1] - p1[i + 1];

			p2[n - 1] = 0.5 * (K[n] + p1[n - 1]);

			return {
				p1 : p1,
				p2 : p2
			};
		}

        /**
         * 값에 비례하여 반지름을 구하는 함수
         *
         * @param value
         * @param minValue
         * @param maxValue
         * @param minRadius
         * @param maxRadius
         * @returns {*}
         */
        this.getScaleValue = function(value, minValue, maxValue, minRadius, maxRadius) {
            var range = maxRadius - minRadius,
                tg = range * getPer();

            function getPer() {
                var range = maxValue - minValue,
                    tg = value - minValue,
                    per = tg / range;

                return per;
            }

            return tg + minRadius;
        }

        /**
         * 차트 데이터 핸들링 함수
         *
         */
        this.eachData = function(callback) {
            if(!_.typeCheck("function", callback)) return;
            var list = this.listData();


            for(var index = 0, len = list.length; index < len; index++) {
                callback.call(this, index, list[index]);
            }
        }
        this.listData = function() {
            return this.axis.data;
        }
        this.getData = function(index) {
            return this.listData()[index];
        }

        /**
         * 차트 데이터에 대한 좌표 'x', 'y'를 구하는 함수
         *
         * @param boolean isCheckMinMax
         * @returns {Array}
         */
        this.getXY = function(isCheckMinMax) {
            var xy = [],
                series = {},
                length = this.listData().length;

            if(isCheckMinMax !== false) {
                series  = getMinMaxValue(this.axis.data, this.brush.target);
            }

            var i = length;

            while(i--) {
                var data = this.axis.data[i];
                var startX = this.axis.x(i);

                for(var j = 0; j < this.brush.target.length; j++) {
                    var key = this.brush.target[j],
                        value = data[key],
                        startY = this.axis.y(value);

                    if(!xy[j]) {
                        xy[j] = {
                            x: new Array(length),
                            y: new Array(length),
                            value: new Array(length),
                            min: [],
                            max: [],
                            length: length
                        };
                    }

                    xy[j].x[i] = startX;
                    xy[j].y[i] = this.axis.y(value);
                    xy[j].value[i] = value;

                    if(isCheckMinMax !== false) {
                        xy[j].min.push(value == series[key].min);
                        xy[j].max.push(value == series[key].max);
                    }
                }
            }

            return xy;
        }

        /**
         * 차트 데이터에 대한 좌표 'x', 'y'를 구하는 함수
         * 단, 'y' 좌표는 다음 데이터 보다 높게 구해진다.
         *
         * @param brush
         * @param chart
         * @returns {Array}
         */
        this.getStackXY = function(isCheckMinMax, isCached) {
            var xy = this.getXY(isCheckMinMax, isCached);

            this.eachData(function(i, data) {
                var valueSum = 0;

                for(var j = 0; j < this.brush.target.length; j++) {
                    var key = this.brush.target[j],
                        value = data[key];

                    if(j > 0) {
                        valueSum += data[this.brush.target[j - 1]];
                    }

                    xy[j].y[i] = this.axis.y(value + valueSum);

                }
            });

            return xy;
        }
        
        /**
         * 브러쉬 엘리먼트에 대한 공통 이벤트 정의
         *
         * @param brush
         * @param chart
         * @param element
         * @param targetIndex
         * @param dataIndex
         */
        this.addEvent = function(elem, dataIndex, targetIndex) {
            var chart = this.chart,
                obj = {
                brush: this.brush,
                dataIndex: dataIndex,
                dataKey: (targetIndex != null) ? this.brush.target[targetIndex] : null,
                data: (dataIndex != null) ? this.getData(dataIndex) : null
            };

            elem.on("click", function(e) {
                setMouseEvent(e);
                chart.emit("click", [ obj, e ]);
            });

            elem.on("dblclick", function(e) {
                setMouseEvent(e);
                chart.emit("dblclick", [ obj, e ]);
            });

            elem.on("contextmenu", function(e) {
                setMouseEvent(e);
                chart.emit("rclick", [ obj, e ]);
                e.preventDefault();
            });

            elem.on("mouseover", function(e) {
                setMouseEvent(e);
                chart.emit("mouseover", [ obj, e ]);
            });

            elem.on("mouseout", function(e) {
                setMouseEvent(e);
                chart.emit("mouseout", [ obj, e ]);
            });

            elem.on("mousemove", function(e) {
                setMouseEvent(e);
                chart.emit("mousemove", [ obj, e ]);
            });

            elem.on("mousedown", function(e) {
                setMouseEvent(e);
                chart.emit("mousedown", [ obj, e ]);
            });

            elem.on("mouseup", function(e) {
                setMouseEvent(e);
                chart.emit("mouseup", [ obj, e ]);
            });

            function setMouseEvent(e) {
                var pos = $(chart.root).offset(),
                    offsetX = e.pageX - pos.left,
                    offsetY = e.pageY - pos.top;

                e.bgX = offsetX;
                e.bgY = offsetY;
                e.chartX = offsetX - chart.padding("left");
                e.chartY = offsetY - chart.padding("top");
            }
        }

        this.createTooltip = function(fill, stroke) {
            var chart = this.chart;

            return this.chart.svg.group({ "visibility" : "hidden" }, function() {
                chart.text({
                    "text-anchor" : "middle",
                    "font-weight" : chart.theme("tooltipPointFontWeight")
                });

                chart.svg.circle({
                    r: chart.theme("tooltipPointRadius"),
                    fill: fill,
                    stroke: stroke,
                    "stroke-width": chart.theme("tooltipPointBorderWidth")
                });
            });
        }

        this.showTooltip = function(tooltip, x, y, value, position) {
            var text = tooltip.get(0);
            text.element.textContent = this.format(value);

            if(position == "left") {
                text.attr({ x: -7, y: 4, "text-anchor": "end" });
            } else if(position == "right") {
                text.attr({ x: 7, y: 4, "text-anchor": "start" });
            } else if(position == "bottom") {
                text.attr({ y: 16 });
            } else {
                text.attr({ y: -7 });
            }

            tooltip.attr({ visibility: (value != 0) ? "visible" : "hidden" });
            tooltip.translate(x, y);
        }

        this.color = function(key) {
            return this.chart.color(key, this.brush);
        }
	}

    CoreBrush.setup = function() {
        return {
            target: null,
            colors: null,
            axis: 0,
            index: null
        }
    }

	return CoreBrush;
}, "chart.draw"); 
jui.define("chart.brush.bar", [], function() {

	var BarBrush = function(chart, axis, brush) {
		var g, activeTooltip;
		var zeroX, height, half_height, bar_height;

		this.getBarStyle = function() {
			return {
				borderColor: this.chart.theme("barBorderColor"),
				borderWidth: this.chart.theme("barBorderWidth"),
				borderOpacity: this.chart.theme("barBorderOpacity"),
				disableOpacity: this.chart.theme("barDisableBackgroundOpacity"),
				activeColor: this.chart.theme("barActiveBackgroundColor"),
				circleColor: this.chart.theme("barCircleBorderColor")
			}
		}

		this.addBarElement = function(elem) {
			if(!this.barList) {
				this.barList = [];
			}

			this.barList.push(elem);
		}

		this.getBarElement = function(width, height, dataIndex, targetIndex) {
			var style = this.getBarStyle(),
				color = this.color(targetIndex),
				value = this.getData(dataIndex)[this.brush.target[targetIndex]];

			var r = this.chart.svg.rect({
				width : width,
				height : height,
				fill : color,
				stroke : style.borderColor,
				"stroke-width" : style.borderWidth,
				"stroke-opacity" : style.borderOpacity
			});

			if(value != 0) {
				this.addEvent(r, dataIndex, targetIndex);
			}

			this.addBarElement({
				index: dataIndex,
				target: this.brush.target[targetIndex],
				element: r,
				color: color
			});

			return r;
		}

		this.setActiveEffect = function(bar, tooltip, x, y, value, position) {
			var style = this.getBarStyle(),
				columns = this.barList;

			for(var i = 0; i < columns.length; i++) {
				columns[i].element.attr({ fill: columns[i].color });
			}

			bar.attr({ fill: style.activeColor });
			this.showTooltip(tooltip, x, y, value, position);
		}

		this.setActiveEffectOption = function(g, color, isMax, isMin, tooltipX, tooltipY, value, position) {
			if(this.brush.display == "max" && isMax || this.brush.display == "min" && isMin) {
				var style = this.getBarStyle(),
					tooltip = this.createTooltip(color, style.circleColor);

				this.showTooltip(tooltip, tooltipX, tooltipY, value, position);
				g.append(tooltip);
			}
		}

		this.setActiveEvent = function(bar, tooltip, x, y, value, position) {
			var self = this,
				style = this.getBarStyle(),
				columns = this.barList;

			bar.on(this.brush.activeEvent, function(e) {
				for(var i = 0; i < columns.length; i++) {
					var child = columns[i].element;

					if(e.target == child.element) {
						child.attr({ fill: style.activeColor });
						self.showTooltip(tooltip, x, y, value, position);
					} else {
						child.attr({ fill: columns[i].color });
					}
				}
			});
		}

		this.setActiveEventOption = function(bar, tooltip, x, y, value, position) {
			if(value != 0 && this.brush.activeEvent != null) {
				this.setActiveEvent(bar, tooltip, x, y, value, position);
				bar.attr({ cursor: "pointer" });
			}
		}

		this.drawBefore = function() {
			var style = this.getBarStyle();

			zeroX = axis.x(0);
			height = axis.y.rangeBand();
			half_height = height - (brush.outerPadding * 2);
			bar_height = (half_height - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;

			g = chart.svg.group();
			activeTooltip = this.createTooltip(style.activeColor, style.circleColor);
		}

		this.draw = function() {
			var points = this.getXY();

			this.eachData(function(i, data) {
				var startY = axis.y(i) - (half_height / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						startX = axis.x((value == 0) ? brush.minValue : value),
						width = Math.abs(zeroX - startX),
						position = (startX >= zeroX) ? "right" : "left",
                        r = this.getBarElement(width, bar_height, i, j);

					var tooltipX = startX,
						tooltipY = startY + (half_height / 2);

					if (startX >= zeroX) {
						r = r.attr({
							x : zeroX,
							y : startY
						});
					} else {
						r = r.attr({
							x : zeroX - width,
							y : startY
						});
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

					// 액티브 엘리먼트 설정
					if (brush.active == i) {
						this.setActiveEffect(r, activeTooltip, tooltipX, tooltipY, value, position);
					}

					// 컬럼 및 기본 브러쉬 이벤트 설정
					this.setActiveEventOption(r, activeTooltip, tooltipX, tooltipY, value, position);

					// Max & Min 툴팁 추가
					this.setActiveEffectOption(g, chart.color(j, brush), points[j].max[i], points[j].min[i], tooltipX, tooltipY, value, position);

					// 다음 컬럼 좌표 설정
					startY += bar_height + brush.innerPadding;
				}
			});

			g.append(activeTooltip);

            return g;
		}
	}

	BarBrush.setup = function() {
		return {
			minValue: 0,
			outerPadding: 2,
			innerPadding: 1,
			active: null,
			activeEvent: null, // or click, mouseover, ...
			display: null // or max, min
		};
	}

	return BarBrush;
}, "chart.brush.core");

jui.define("chart.brush.column", [], function() {

	var ColumnBrush = function(chart, axis, brush) {
		var g, activeTooltip, style;
		var zeroY, width, col_width, half_width;

		this.drawBefore = function() {
			style = this.getBarStyle();
			zeroY = axis.y(0);

			width = axis.x.rangeBand();
			half_width = (width - brush.outerPadding * 2);
			col_width = (width - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;

			// 엘리먼트 생성
			g = chart.svg.group();
			activeTooltip = this.createTooltip(style.activeColor, style.circleColor);
		}

		this.draw = function() {
			var points = this.getXY();

			this.eachData(function(i, data) {
				var startX = axis.x(i) - (half_width / 2);

				for (var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						startY = axis.y((value == 0) ? brush.minValue : value),
						position = (startY <= zeroY) ? "top" : "bottom",
						r = this.getBarElement(col_width, Math.abs(zeroY - startY), i, j);

					var tooltipX = startX + (col_width / 2),
						tooltipY = startY;

					if (startY <= zeroY) {
						r = r.attr({
							x: startX,
							y: startY
						});
					} else {
						r = r.attr({
							x: startX,
							y: zeroY
						});
					}

					// 그룹에 컬럼 엘리먼트 추가
					g.append(r);

					// 액티브 엘리먼트 설정
					if (brush.active == i) {
						this.setActiveEffect(r, activeTooltip, tooltipX, tooltipY, value, position);
					}

					// 컬럼 및 기본 브러쉬 이벤트 설정
					this.setActiveEventOption(r, activeTooltip, tooltipX, tooltipY, value, position);

					// Max & Min 툴팁 추가
					this.setActiveEffectOption(g, this.color(j), points[j].max[i], points[j].min[i], tooltipX, tooltipY, value, position);

					// 다음 컬럼 좌표 설정
					startX += col_width + brush.innerPadding;
				}
			});

			g.append(activeTooltip);

            return g;
		}
	}

	return ColumnBrush;
}, "chart.brush.bar");

jui.define("chart.brush.stackbar", [], function() {

	var StackBarBrush = function(chart, axis, brush) {
		var g, height, bar_width;

		this.getBarElement = function(dataIndex, targetIndex) {
			var style = this.getBarStyle(),
				color = this.color(targetIndex),
				value = this.getData(dataIndex)[this.brush.target[targetIndex]];

			var r = this.chart.svg.rect({
				fill : color,
				stroke : style.borderColor,
				"stroke-width" : style.borderWidth,
				"stroke-opacity" : style.borderOpacity
			});

			if(value != 0) {
				this.addEvent(r, dataIndex, targetIndex);
			}

			return r;
		}

		this.setActiveEffect = function(group) {
			var style = this.getBarStyle(),
				columns = this.barList;

			for(var i = 0; i < columns.length; i++) {
				var opacity = (group == columns[i]) ? 1 : style.disableOpacity;

				columns[i].attr({ opacity: opacity });
			}
		}

		this.setActiveEffectOption = function() {
			var active = this.brush.active;

			if(this.barList && this.barList[active]) {
				this.setActiveEffect(this.barList[active]);
			}
		}

		this.setActiveEvent = function(group) {
			var self = this;

			group.on(self.brush.activeEvent, function (e) {
				self.setActiveEffect(group);
			});
		}

		this.setActiveEventOption = function(group) {
			if(this.brush.activeEvent != null) {
				this.setActiveEvent(group);
				group.attr({ cursor: "pointer" });
			}
		}

		this.drawBefore = function() {
			g = chart.svg.group();
			height = axis.y.rangeBand();
			bar_width = height - brush.outerPadding * 2;
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var group = chart.svg.group();
				
				var startY = axis.y(i) - bar_width/ 2,
                    startX = axis.x(0),
                    value = 0;
				
				for (var j = 0; j < brush.target.length; j++) {
					var xValue = data[brush.target[j]] + value,
                        endX = axis.x(xValue),
						r = this.getBarElement(i, j);

					r.attr({
						x : (startX < endX) ? startX : endX,
						y : startY,
						width : Math.abs(startX - endX),
						height : bar_width
					});

					group.append(r);

					startX = endX;
					value = xValue;
				}

				this.setActiveEventOption(group); // 액티브 엘리먼트 이벤트 설정
				this.addBarElement(group);
				g.append(group);
			});

			// 액티브 엘리먼트 설정
			this.setActiveEffectOption();

            return g;
		}
	}

	StackBarBrush.setup = function() {
		return {
			outerPadding: 15,
			active: null,
			activeEvent: null // or click, mouseover, ...
		};
	}

	return StackBarBrush;
}, "chart.brush.bar");

jui.define("chart.brush.stackcolumn", [], function() {

	var ColumnStackBrush = function(chart, axis, brush) {
		var g, zeroY, width, bar_width;

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroY = axis.y(0);
			width = axis.x.rangeBand();
			bar_width = width - brush.outerPadding * 2;
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var group = chart.svg.group();
				
				var startX = axis.x(i) - bar_width / 2,
                    startY = axis.y(0),
                    value = 0;

				for(var j = 0; j < brush.target.length; j++) {
					var yValue = data[brush.target[j]] + value,
                        endY = axis.y(yValue),
						r = this.getBarElement(i, j);

					r.attr({
						x : startX,
						y : (startY > endY) ? endY : startY,
						width : bar_width,
						height : Math.abs(startY - endY)
					});

					group.append(r);
					
					startY = endY;
					value = yValue;
				}

				this.setActiveEventOption(group); // 액티브 엘리먼트 이벤트 설정
				this.addBarElement(group);
				g.append(group);
			});

			// 액티브 엘리먼트 설정
			this.setActiveEffectOption();

            return g;
		}
	}

	return ColumnStackBrush;
}, "chart.brush.stackbar");

jui.define("chart.brush.fullstackbar", [], function() {

	var FullStackBarBrush = function(chart, axis, brush) {
		var g, zeroX, height, bar_height;

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroX = axis.x(0);
			height = axis.y.rangeBand();
			bar_height = height - brush.outerPadding * 2;
		}

		this.drawText = function(percent, x, y) {
			var text = this.chart.text({
				x : x,
				y : y,
				"text-anchor" : "middle"
			}, percent + "%");

			return text;
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var group = chart.svg.group();

				var startY = axis.y(i) - bar_height / 2,
					sum = 0,
					list = [];

				for (var j = 0; j < brush.target.length; j++) {
					var width = data[brush.target[j]];

					sum += width;
					list.push(width);
				}

				var startX = 0,
					max = axis.x.max();

				for (var j = list.length - 1; j >= 0; j--) {
					var width = axis.x.rate(list[j], sum),
						r = this.getBarElement(i, j);

					r.attr({
						x : startX,
						y : startY,
						width: width,
						height: bar_height
					});

					group.append(r);

					// 퍼센트 노출 옵션 설정
					if(brush.showText) {
						var p = Math.round((list[j] / sum) * max),
							x = startX + width / 2,
							y = startY + bar_height / 2 + 5;

						group.append(this.drawText(p, x, y));
					}

					// 액티브 엘리먼트 이벤트 설정
					this.setActiveEventOption(group);

					startX += width;
				}

				this.addBarElement(group);
				g.append(group);
			});

			// 액티브 엘리먼트 설정
			this.setActiveEffectOption();

			return g;
		}
	}

	FullStackBarBrush.setup = function() {
		return {
			outerPadding: 15,
			active: null,
			activeEvent: null, // or click, mouseover, ...
			showText: false
		};
	}

	return FullStackBarBrush;
}, "chart.brush.stackbar");

jui.define("chart.brush.fullstackcolumn", [], function() {

	var FullStackColumnBrush = function(chart, axis, brush) {
		var g, zeroY, width, bar_width;

		this.drawBefore = function() {
			g = chart.svg.group();
			zeroY = axis.y(0);
			width = axis.x.rangeBand();
			bar_width = width - brush.outerPadding * 2;
		}

		this.draw = function() {
			var chart_height = chart.area("height");

			this.eachData(function(i, data) {
				var group = chart.svg.group();

				var startX = axis.x(i) - bar_width / 2,
                    sum = 0,
                    list = [];

				for (var j = 0; j < brush.target.length; j++) {
					var height = data[brush.target[j]];

					sum += height;
					list.push(height);
				}

				var startY = 0,
                    max = axis.y.max();
				
				for (var j = list.length - 1; j >= 0; j--) {
					var height = chart_height - axis.y.rate(list[j], sum),
						r = this.getBarElement(i, j);

					r.attr({
						x: startX,
						y: startY,
						width: bar_width,
						height: height
					});

					group.append(r);

					// 퍼센트 노출 옵션 설정
					if(brush.showText) {
						var p = Math.round((list[j] / sum) * max),
							x = startX + bar_width / 2,
							y = startY + height / 2 + 8;

						group.append(this.drawText(p, x, y));
					}

					// 액티브 엘리먼트 이벤트 설정
					this.setActiveEventOption(group);

					startY += height;										
				}

				this.addBarElement(group);
				g.append(group);
			});

			// 액티브 엘리먼트 설정
			this.setActiveEffectOption();

            return g;
		}
	}

	return FullStackColumnBrush;
}, "chart.brush.fullstackbar");

jui.define("chart.brush.bubble", [], function() {

	var BubbleBrush = function(chart, axis, brush) {
        var self = this;

        function createBubble(chart, brush, pos, index) {
            var radius = self.getScaleValue(pos.value, axis.y.min(), axis.y.max(), brush.min, brush.max);

            return chart.svg.circle({
                cx: pos.x,
                cy: pos.y,
                r: radius,
                "fill": self.color(index),
                "fill-opacity": chart.theme("bubbleBackgroundOpacity"),
                "stroke": self.color(index),
                "stroke-width": chart.theme("bubbleBorderWidth")
            });
        }

        this.drawBubble = function(chart, brush, points) {
            var g = chart.svg.group({
                "clip-path" : "url(#" + chart.clipId + ")"
            });

            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].length; j++) {
                    var b = createBubble(chart, brush, {
                        x: points[i].x[j], y: points[i].y[j], value: points[i].value[j]
                    }, i);

                    this.addEvent(b, j, i);
                    g.append(b);
                }
            }

            return g;
        }

        this.draw = function() {
            return this.drawBubble(chart, brush, this.getXY());
        }
	}

    BubbleBrush.setup = function() {
        return {
            min: 5,
            max: 30
        };
    }

	return BubbleBrush;
}, "chart.brush.core");
jui.define("chart.brush.candlestick", [], function() {

    var CandleStickBrush = function(chart, axis, brush) {
        var g, width = 0, barWidth = 0, barPadding = 0;

        function getTargetData(data) {
            var target = {};

            for (var j = 0; j < brush.target.length; j++) {
                var k = brush.target[j],
                    t = chart.get("series", k);

                target[t.type] = data[k];
            }

            return target;
        }

        this.drawBefore = function() {
            g = chart.svg.group();
            width = axis.x.rangeBand();
            barWidth = width * 0.7;
            barPadding = barWidth / 2;
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                var data = getTargetData(data),
                    startX = axis.x(i),
                    r = null,
                    l = null;

                var open = data.open,
                    close = data.close,
                    low = data.low,
                    high = data.high;

                if(open > close) { // 시가가 종가보다 높을 때 (Red)
                    var y = axis.y(open);

                    l = chart.svg.line({
                        x1: startX,
                        y1: axis.y(high),
                        x2: startX,
                        y2: axis.y(low),
                        stroke: chart.theme("candlestickInvertBorderColor"),
                        "stroke-width": 1
                    });

                    r = chart.svg.rect({
                        x : startX - barPadding,
                        y : y,
                        width : barWidth,
                        height : Math.abs(axis.y(close) - y),
                        fill : chart.theme("candlestickInvertBackgroundColor"),
                        stroke: chart.theme("candlestickInvertBorderColor"),
                        "stroke-width": 1
                    });

                } else {
                    var y = axis.y(close);

                    l = chart.svg.line({
                        x1: startX,
                        y1: axis.y(high),
                        x2: startX,
                        y2: axis.y(low),
                        stroke: chart.theme("candlestickBorderColor"),
                        "stroke-width":1
                    });

                    r = chart.svg.rect({
                        x : startX - barPadding,
                        y : y,
                        width : barWidth,
                        height : Math.abs(axis.y(open) - y),
                        fill : chart.theme("candlestickBackgroundColor"),
                        stroke: chart.theme("candlestickBorderColor"),
                        "stroke-width": 1
                    });
                }

                this.addEvent(r, i, null);

                g.append(l);
                g.append(r);
            });

            return g;
        }
    }

    return CandleStickBrush;
}, "chart.brush.core");

jui.define("chart.brush.ohlc", [], function() {

    var OHLCBrush = function(chart, axis, brush) {
        var g;

        function getTargetData(data) {
            var target = {};

            for (var j = 0; j < brush.target.length; j++) {
                var k = brush.target[j],
                    t = chart.get("series", k);

                target[t.type] = data[k];
            }

            return target;
        }

        this.drawBefore = function() {
            g = chart.svg.group();
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                var data = getTargetData(data),
                    startX = axis.x(i);

                var open = data.open,
                    close = data.close,
                    low = data.low,
                    high = data.high;

                var color = (open > close) ? chart.theme("ohlcInvertBorderColor") : chart.theme("ohlcBorderColor");

                var lowHigh = chart.svg.line({
                    x1: startX,
                    y1: axis.y(high),
                    x2: startX,
                    y2: axis.y(low),
                    stroke: color,
                    "stroke-width": 1
                });

                var close = chart.svg.line({
                    x1: startX,
                    y1: axis.y(close),
                    x2: startX + chart.theme("ohlcBorderRadius"),
                    y2: axis.y(close),
                    stroke: color,
                    "stroke-width": 1
                });

                var open = chart.svg.line({
                    x1: startX,
                    y1: axis.y(open),
                    x2: startX - chart.theme("ohlcBorderRadius"),
                    y2: axis.y(open),
                    stroke: color,
                    "stroke-width": 1
                });

                this.addEvent(lowHigh, i, null);

                g.append(lowHigh);
                g.append(close);
                g.append(open);
            });

            return g;
        }
    }

    return OHLCBrush;
}, "chart.brush.core");

jui.define("chart.brush.donut", [ "util.math" ], function(math) {

	var DonutBrush = function() {
        var w, centerX, centerY, startY, startX, outerRadius, innerRadius;

		this.drawDonut = function(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, attr, hasCircle) {
		    hasCircle = hasCircle || false;

			var g = this.chart.svg.group(),
				path = this.chart.svg.path(attr),
				dist = Math.abs(outerRadius - innerRadius);

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle)),
				startX = obj.x,
				startY = obj.y;
			
			var innerCircle = math.rotate(0, -innerRadius, math.radian(startAngle)),
				startInnerX = innerCircle.x,
				startInnerY = innerCircle.y;

			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));

			// inner arc 에 대한 지점 설정 			
			innerCircle = math.rotate(startInnerX, startInnerY, math.radian(endAngle));

			// 중심점 이동 
			g.translate(centerX, centerY);

			// outer arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y);

			// 라인 긋기 
			path.LineTo(innerCircle.x, innerCircle.y);

			// inner arc 그리기 
			path.Arc(innerRadius, innerRadius, 0, (endAngle > 180) ? 1 : 0, 0, startInnerX, startInnerY);
			
			// 패스 종료
			path.ClosePath();

			g.append(path);

            if(hasCircle) {
                var centerCircle = math.rotate(0, -innerRadius - dist/2, math.radian(startAngle)),
					cX = centerCircle.x,
					cY = centerCircle.y,
					centerCircleLine = math.rotate(cX, cY, math.radian(endAngle));
    
                var circle = this.chart.svg.circle({
                    cx : centerCircleLine.x,
                    cy : centerCircleLine.y,
                    r : dist/2,
                    fill  : attr.fill
                });
                
                g.append(circle);
    
                var circle2 = this.chart.svg.circle({
                    cx : centerCircleLine.x,
                    cy : centerCircleLine.y,
                    r : 3,
                    fill  : "white"
                });
                
                g.append(circle2);
            }

			return g;
		}

        this.drawBefore = function() {
            var width = this.chart.area('width'),
                height = this.chart.area('height'),
                min = width;

            if(height < min) {
                min = height;
            }

            // center
            w = min / 2;
            centerX = width / 2;
            centerY = height / 2;
            startY = -w;
            startX = 0;
            outerRadius = Math.abs(startY);
            innerRadius = outerRadius - this.brush.size;
        }

		this.draw = function() {
			var group = this.chart.svg.group();

			var target = this.brush.target,
				data = this.getData(0);

			var all = 360,
				startAngle = 0,
				max = 0;

			for(var i = 0; i < target.length; i++) {
				max += data[target[i]];
			}

			for(var i = 0; i < target.length; i++) {
				var value = data[target[i]],
					endAngle = all * (value / max);

				var g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, {
					fill : this.color(i),
					stroke : this.chart.theme("donutBorderColor"),
					"stroke-width" : this.chart.theme("donutBorderWidth")
				});

                this.addEvent(g, 0, i);
				group.append(g);

				startAngle += endAngle;
			}

            return group;
		}
	}

	DonutBrush.setup = function() {
		return {
			size: 50
		};
	}

	return DonutBrush;
}, "chart.brush.core");

jui.define("chart.brush.equalizer", [], function() {

    var EqualizerBrush = function(chart, axis, brush) {
        var g, zeroY, width, barWidth, half_width;

        this.drawBefore = function() {
            g = chart.svg.group();
            zeroY = axis.y(0);
            width = axis.x.rangeBand();
            half_width = (width - brush.outerPadding * 2) / 2;
            barWidth = (width - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                var startX = axis.x(i) - half_width;

                for (var j = 0; j < brush.target.length; j++) {
                    var barGroup = chart.svg.group();
                    var startY = axis.y(data[brush.target[j]]),
                        padding = 1.5,
                        eY = zeroY,
                        eIndex = 0;

                    if (startY <= zeroY) {
                        while (eY > startY) {
                            var unitHeight = (eY - brush.unit < startY) ? Math.abs(eY - startY) : brush.unit;
                            var r = chart.svg.rect({
                                x : startX,
                                y : eY - unitHeight,
                                width : barWidth,
                                height : unitHeight,
                                fill : this.color(Math.floor(eIndex / brush.gap))
                            });

                            eY -= unitHeight + padding;
                            eIndex++;

                            barGroup.append(r);
                        }
                    } else {
                        while (eY < startY) {
                            var unitHeight = (eY + brush.unit > startY) ? Math.abs(eY - startY) : brush.unit;
                            var r = chart.svg.rect({
                                x : startX,
                                y : eY,
                                width : barWidth,
                                height : unitHeight,
                                fill : this.color(Math.floor(eIndex / brush.gap))
                            });

                            eY += unitHeight + padding;
                            eIndex++;

                            barGroup.append(r);
                        }
                    }

                    this.addEvent(barGroup, i, j);
                    g.append(barGroup);

                    startX += barWidth + brush.innerPadding;
                }
            });

            return g;
        }
    }

    EqualizerBrush.setup = function() {
        return {
            innerPadding: 10,
            outerPadding: 15,
            unit: 5,
            gap: 5
        };
    }

    return EqualizerBrush;
}, "chart.brush.core");

jui.define("chart.brush.line", [], function() {

	var LineBrush = function() {

        this.setActiveEffect = function(elem) {
            var lines = this.lineList;

            for(var i = 0; i < lines.length; i++) {
                var opacity = (elem == lines[i].element) ? 1 : this.chart.theme("lineDisableBorderOpacity");

                lines[i].element.attr({ opacity: opacity });
                if(lines[i].tooltip != null) {
                    lines[i].tooltip.attr({ opacity: opacity });
                }
            }
        }

        this.setActiveEvent = function(elem) {
            var self = this;

            elem.on(this.brush.activeEvent, function(e) {
                self.setActiveEffect(elem);
            });
        }

        this.addLineElement = function(elem) {
            if(!this.lineList) {
                this.lineList = [];
            }

            this.lineList.push(elem);
        }

        this.createLine = function(pos, index) {
            var x = pos.x,
                y = pos.y;

            var p = this.chart.svg.path({
                stroke : this.color(index),
                "stroke-width" : this.chart.theme("lineBorderWidth"),
                fill : "transparent",
                "cursor" : (this.brush.activeEvent != null) ? "pointer" : "normal"
            }).MoveTo(x[0], y[0]);

            if(this.brush.symbol == "curve") {
                var px = this.curvePoints(x),
                    py = this.curvePoints(y);

                for (var i = 0; i < x.length - 1; i++) {
                    p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
                }
            } else {
                for (var i = 0; i < x.length - 1; i++) {
                    if(this.brush.symbol == "step") {
                        var sx = x[i] + ((x[i + 1] - x[i]) / 2);

                        p.LineTo(sx, y[i]);
                        p.LineTo(sx, y[i + 1]);
                    }

                    p.LineTo(x[i + 1], y[i + 1]);
                }
            }

            return p;
        }

        this.drawTooltip = function(g, pos, index) {
            var display = this.brush.display,
                circleColor = this.chart.theme("lineCircleBorderColor");

            for (var i = 0; i < pos.x.length; i++) {
                if(display == "max" && pos.max[i] || display == "min" && pos.min[i]) {
                    var tooltip = this.createTooltip(this.color(index), circleColor),
                        position = (display == "max" && pos.max[i]) ? "top" : "bottom";

                    this.showTooltip(tooltip, pos.x[i], pos.y[i], pos.value[i], position);
                    g.append(tooltip);

                    // 컬럼 상태 설정 (툴팁)
                    this.lineList[index].tooltip = tooltip;
                }
            }
        }

        this.drawLine = function(path) {
            var brush = this.brush,
                g = this.chart.svg.group();

            for(var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k);

                this.addEvent(p, null, k);
                g.append(p);

                // 컬럼 상태 설정
                this.addLineElement({
                    element: p,
                    tooltip: null
                });

                // Max & Min 툴팁 추가
                if(brush.display != null) {
                    this.drawTooltip(g, path[k], k);
                }

                // 액티브 라인 추가
                if(brush.activeEvent != null) {
                    this.setActiveEvent(p);
                }
            }

            // 액티브 라인 설정
            if(this.lineList) {
                for (var i = 0; i < this.lineList.length; i++) {
                    if (brush.active == brush.target[i]) {
                        this.setActiveEffect(p);
                    }
                }
            }

            return g;
        }

        this.draw = function() {
            return this.drawLine(this.getXY());
        }
	}

    LineBrush.setup = function() {
        return {
            symbol: "normal", // normal, curve, step
            display: null,
            active: null,
            activeEvent: null // or click, mouseover, ...
        };
    }

	return LineBrush;
}, "chart.brush.core");
jui.define("chart.brush.path", [], function() {

	var PathBrush = function(chart, axis, brush) {

		this.draw = function() {
			var g = chart.svg.group();
			
			for(var ti = 0, len = brush.target.length; ti < len; ti++) {
				var color = this.color(ti);

				var path = chart.svg.path({
					fill : color,
					"fill-opacity" : chart.theme("pathBackgroundOpacity"),
					stroke : color,
					"stroke-width" : chart.theme("pathBorderWidth")
				});
	
				g.append(path);
	
				this.eachData(function(i, data) {
					var obj = axis.c(i, data[brush.target[ti]]),
						x = obj.x - chart.area("x"),
						y = obj.y - chart.area("y");
	
					if (i == 0) {
						path.MoveTo(x, y);
					} else {
						path.LineTo(x, y);
					}
				});
	
				path.ClosePath();
			}

			return g;
		}
	}

	return PathBrush;
}, "chart.brush.core");

jui.define("chart.brush.pie", [ "util.math" ], function(math) {

	var PieBrush = function(chart, axis, brush) {
        var w, centerX, centerY, outerRadius;

		this.drawPie = function(chart, centerX, centerY, outerRadius, startAngle, endAngle, attr) {
			var g = chart.svg.group(),
				path = chart.svg.path(attr);

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle)),
				startX = obj.x,
                startY = obj.y;
			
			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));

			g.translate(centerX, centerY);

			// arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y);
			path.LineTo(0, 0);
			path.ClosePath();

			g.append(path);

			return g;
		}

        this.drawBefore = function() {
			if (!axis.c) {
				axis.c = function(i) {
					return {
						x : 0,
						y : 0,
						width : chart.area('width'),
						height : chart.area('height')
					};
				}
			}
        }

		this.drawUnit = function(index, data, group) {
			var obj = axis.c(index);

			var width = obj.width, height = obj.height;
			var x = obj.x, y = obj.y;
			var min = width;

			if (height < min) {
				min = height;
			}

			// center
			w = min / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = w;

			var target = brush.target,
				all = 360,
				startAngle = 0,
				max = 0;

			for (var i = 0; i < target.length; i++) {
				max += data[target[i]];
			}

			for (var i = 0; i < target.length; i++) {
				var value = data[target[i]],
					endAngle = all * (value / max);

				var g = this.drawPie(chart, centerX, centerY, outerRadius, startAngle, endAngle, {
					fill : this.color(i),
					stroke : chart.theme("pieBorderColor"),
					"stroke-width" : chart.theme("pieBorderWidth")
				});

				this.addEvent(g, index, i);
				group.append(g);

				startAngle += endAngle;
			}
		}

		this.draw = function() {
			var group = chart.svg.group();

			this.eachData(function(i, data) {
				this.drawUnit(i, data, group);
			});

            return group;
		}
	}

	return PieBrush;
}, "chart.brush.core");

jui.define("chart.brush.scatter", [], function() {

    var ScatterBrush = function() {
        this.createScatter = function(pos, index) {
            var self = this;
            var elem = null,
                target = this.chart.get("series", this.brush.target[index]),
                symbol = (!target.symbol) ? this.brush.symbol : target.symbol,
                w = h = this.brush.size;

            var color = this.color(index),
                borderColor = this.chart.theme("scatterBorderColor"),
                borderWidth = this.chart.theme("scatterBorderWidth");

            if(symbol == "triangle" || symbol == "cross") {
                elem = this.chart.svg.group({ width: w, height: h }, function() {
                    if(symbol == "triangle") {
                        var poly = self.chart.svg.polygon();

                        poly.point(0, h)
                            .point(w, h)
                            .point(w / 2, 0);
                    } else {
                        self.chart.svg.line({ stroke: color, "stroke-width": borderWidth * 2, x1: 0, y1: 0, x2: w, y2: h });
                        self.chart.svg.line({ stroke: color, "stroke-width": borderWidth * 2, x1: 0, y1: w, x2: h, y2: 0 });
                    }
                }).translate(pos.x - (w / 2), pos.y - (h / 2));
            } else {
                if(symbol == "rectangle") {
                    elem = this.chart.svg.rect({
                        width: w,
                        height: h,
                        x: pos.x - (w / 2),
                        y: pos.y - (h / 2)
                    });
                } else {
                    elem = this.chart.svg.ellipse({
                        rx: w / 2,
                        ry: h / 2,
                        cx: pos.x,
                        cy: pos.y
                    });
                }
            }

            if(symbol != "cross") {
                elem.attr({
                    fill: color,
                    stroke: borderColor,
                    "stroke-width": borderWidth
                })
                .hover(function () {
                    elem.attr({
                        fill: self.chart.theme("scatterHoverColor"),
                        stroke: color,
                        "stroke-width": borderWidth * 2
                    });
                }, function () {
                    elem.attr({
                        fill: color,
                        stroke: borderColor,
                        "stroke-width": borderWidth
                    });
                });
            }

            return elem;
        }

        this.drawScatter = function(points) {
            var g = this.chart.svg.group();

            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].length; j++) {
                    var p = this.createScatter({
                        x: points[i].x[j],
                        y: points[i].y[j],
                        max: points[i].max[j],
                        min: points[i].min[j],
                        value: points[i].value[j]
                    }, i);

                    this.addEvent(p, j, i);
                    g.append(p);
                }
            }

            return g;
        }

        this.draw = function() {
            return this.drawScatter(this.getXY());
        }
    }

    ScatterBrush.setup = function() {
        return {
            symbol: "circle", // or triangle, rectangle, cross
            size: 7
        };
    }

    return ScatterBrush;
}, "chart.brush.core");
jui.define("chart.brush.scatterpath", [], function() {

	var ScatterPathBrush = function() {

        this.drawScatter = function(points) {
            var width = height = this.brush.size;
            var unit = 5000;
            var color = this.color(0);
            var strokeWidth = this.brush.strokeWidth;

            var g = this.chart.svg.group();

            var path = this.chart.svg.path({
                fill : color,
                stroke : color,
                "stroke-width" : strokeWidth
            });

            var tpl = path.getSymbolTemplate(width, height);

            for(var i = 0; i < points.length; i++) {
                var target = this.chart.get("series", this.brush.target[i]),
                    symbol = (target && target.symbol) ? target.symbol : this.brush.symbol;

                var j = points[i].x.length;

                while(j--) {
                    //path[symbol].call(path, points[i].x[j], points[i].y[j], width, height);
                    path.template(points[i].x[j], points[i].y[j], tpl[symbol]);
                }
            }

            g.append(path);



            return g;
        }

        this.draw = function() {
            return this.drawScatter(this.getXY(false, true));
        }
	}

    ScatterPathBrush.setup = function() {
        return {
            symbol: "circle", // or triangle, rectangle, cross
            size: 7,
            strokeWidth : 1
        };
    }

	return ScatterPathBrush;
}, "chart.brush.core");
jui.define("chart.brush.bargauge", [], function() {

	var BarGaugeBrush = function(chart, axis, brush) {

        this.drawBefore = function() {
            if (!axis.c) {
                axis.c = function() {
                    return {
                        x : 0,
                        y : 0,
                        width : chart.area('width'),
                        height : chart.area('height')
                    };
                }
            }
        }

		this.draw = function() {
            var obj = axis.c(),
                width = obj.width,
                x = obj.x,
                y = obj.y;

			var group = chart.svg.group();

			if (brush.split) {
				var max = width;
			} else {
				var max = width;
			}

			this.eachData(function(i, data) {
                var g = chart.svg.group({
                    "class" : "bar"
                });
                
                g.append(chart.text({
                    x : x,
                    y : y + brush.size / 2 + brush.cut,
                    "text-anchor" : "end",
                    fill : this.color(i)
                }, data[brush.title] || ""))
                
                g.append(chart.svg.rect({
                    x : x + brush.cut,
                    y : y,
                    width: max,
                    height : brush.size,
                    fill : chart.theme("gaugeBackgroundColor")
                }));
                
                var value = (data.value)  * max / 100,
                    ex = (100 - data.value)  * max / 100,
                    startX = x + brush.cut;
                
                if (brush.align == "center") {
                	startX += (max/2 - value/2);
                } else if (brush.align == "right") {
                	startX += max - value; 
                }
                
                g.append(chart.svg.rect({
                    x : startX,
                    y : y,
                    width: value,
                    height : brush.size,
                    fill : chart.color(i, brush)
                }));

                if (brush.split) {
                	var textX = x + value + brush.cut * 2 + ex,
                        textAlign = "start",
                        textColor = chart.color(i, brush);
                } else {
                	var textX = x + brush.cut * 2,
                        textAlign = "start",
                        textColor = "white";
                	
                	if (this.align == "center") {
                		textX = x + brush.cut + max / 2;
                		textAlign = "middle";
                	} else if (brush.align == "right") {
                		textX = x + max;
                		textAlign = "end";                		
                	}
                }
                
                g.append(chart.text({
                    x : textX,
                    y : y + brush.size / 2 + brush.cut,
                    "text-anchor" : textAlign,
                    fill : textColor
                }, brush.format ? brush.format(data.value) : data.value + "%"))

                this.addEvent(g, i, null);
                group.append(g);
                
                y += brush.size + brush.cut;
			});

            return group;
		}
	}

    BarGaugeBrush.setup = function() {
        return {
            cut: 5,
            size: 20,
            split: false,
            align: "left",
            title: "title"
        };
    }

	return BarGaugeBrush;
}, "chart.brush.core");

jui.define("chart.brush.circlegauge", [], function() {

	var CircleGaugeBrush = function(chart, axis, brush) {
        var w, centerX, centerY, outerRadius;

		this.drawBefore = function() {
            var axis = axis || {};

            if(!axis.c) {
                axis.c = function() {
                    return {
                        x : 0,
                        y : 0,
                        width : chart.area('width'),
                        height : chart.area('height')
                    };
                }
            }

            var obj = axis.c(),
                width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y,
                min = width;

            if(height < min) {
                min = height;
            }

            w = min / 2;
            centerX = width / 2 + x;
            centerY = height / 2 + y;
            outerRadius = w;
		}

		this.draw = function() {
            var rate = (brush.value - brush.min) / (brush.max - brush.min);

			var group = chart.svg.group();

            group.append(chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : outerRadius,
                fill : chart.theme("gaugeBackgroundColor"),
                stroke : this.color(0),
                "stroke-width" : 2
            }));
            
            group.append(chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : outerRadius * rate,
                fill : this.color(0)
            }));

            this.addEvent(group, null, null);

            return group;
		}
	}

    CircleGaugeBrush.setup = function() {
        return {
            min: 0,
            max: 100,
            value: 0
        };
    }

	return CircleGaugeBrush;
}, "chart.brush.core");

jui.define("chart.brush.fillgauge", [ "jquery" ], function($) {

	var FillGaugeBrush = function(chart, axis, brush) {
        var self = this;
        var w, centerX, centerY, outerRadius, clipId;
        var rect;

        function setDirection(direction) {
            var rate = (brush.value - brush.min) / (brush.max - brush.min);

            if (direction == "vertical") {
                var height = chart.area('height') * rate;
                var width = chart.area('width');
                var x = 0;
                var y = chart.area('height') - height;
            } else {		// horizontal
                var height = chart.area('height');
                var width = chart.area('width') * rate;
                var x = 0;
                var y = 0;
            }

            rect.attr({
                x : x,
                y : y,
                width : width,
                height : height
            });
        }

        function createPath(group, path) {
            group.append(chart.svg.path({
                x : 0,
                y : 0,
                fill : chart.theme("gaugeBackgroundColor"),
                d : path
            }));

            group.append(chart.svg.path({
                x : 0,
                y : 0,
                fill : self.color(0),
                d : path,
                "clip-path" : "url(#" + clipId + ")"
            }));
        }

        this.drawBefore = function() {
            var axis = axis || {};

            if (!axis.c) {
                axis.c = function() {
                    return {
                        x : 0,
                        y : 0,
                        width : chart.area('width'),
                        height : chart.area('height')
                    };
                }
            }

            var obj = axis.c(),
                width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y,
                min = width;

            if (height < min) {
                min = height;
            }

            w = min / 2;
            centerX = width / 2 + x;
            centerY = height / 2 + y;
            outerRadius = w;
            clipId = chart.createId("fill-gauge");

            var clip = chart.svg.clipPath({
                id : clipId
            });

            rect = chart.svg.rect({
                x : 0,
                y : 0,
                width : 0,
                height : 0
            });

            clip.append(rect);
            chart.defs.append(clip);
        }
		
		this.draw = function() {
			var group = chart.svg.group({
				opacity : 0.8
			});

			setDirection(brush.direction);

            if (brush.svg != "" || brush.path != "") {
                if (brush.svg != "") {
                    $.ajax({
                        url : brush.svg,
                        async : false,
                        success : function(xml) {
                            var path = $(xml).find("path").attr("d");
                            createPath(group, path);
                        }
                    });
                } else {
                    createPath(group, brush.path);
                }
            } else {
                if (brush.shape == "circle") {
                    group.append(chart.svg.circle({
                        cx : centerX,
                        cy : centerY,
                        r : outerRadius,
                        fill : chart.theme("gaugeBackgroundColor")
                    }));

                    group.append(chart.svg.circle({
                        cx : centerX,
                        cy : centerY,
                        r : outerRadius,
                        fill : chart.color(0, brush),
                        "clip-path" : "url(#" + clipId + ")"
                    }));

                } else if (brush.shape == "rectangle") {
                    group.append(chart.svg.rect({
                        x : 0,
                        y : 0,
                        width : chart.area('width'),
                        height : chart.area('height'),
                        fill : chart.theme("gaugeBackgroundColor")
                    }));

                    group.append(chart.svg.rect({
                        x : 0,
                        y : 0,
                        width : chart.area('width'),
                        height : chart.area('height'),
                        fill : this.color(0),
                        "clip-path" : "url(#" + clipId + ")"
                    }));

                }
            }

            return group;
		}
	}

    FillGaugeBrush.setup = function() {
        return {
            min: 0,
            max: 100,
            value: 0,
            shape: "circle", // or rectangle
            direction: "vertical",
            svg: "",
            path: ""
        };
    }

	return FillGaugeBrush;
}, "chart.brush.core");

jui.define("chart.brush.area", [], function() {

    var AreaBrush = function() {

        this.drawArea = function(path) {
            var g = this.chart.svg.group(),
                maxY = this.axis.y(this.axis.y.min());

            for(var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k),
                    xList = path[k].x;

                p.LineTo(xList[xList.length - 1], maxY);
                p.LineTo(xList[0], maxY);
                p.ClosePath();
                p.attr({
                    fill: this.color(k),
                    "fill-opacity": this.chart.theme("areaBackgroundOpacity"),
                    "stroke-width": 0
                });

                this.addEvent(p, null, k);
                g.prepend(p);
            }

            return g;
        }

        this.draw = function() {
            return this.drawArea(this.getXY());
        }
    }

    return AreaBrush;
}, "chart.brush.line");

jui.define("chart.brush.stackline", [], function() {

	var StackLineBrush = function() {
        this.draw = function() {
            return this.drawLine(this.getStackXY());
        }
	}

	return StackLineBrush;
}, "chart.brush.line");
jui.define("chart.brush.stackarea", [], function() {

	var StackAreaBrush = function() {
		this.draw = function() {
            return this.drawArea(this.getStackXY());
		}
	}

	return StackAreaBrush;
}, "chart.brush.area");

jui.define("chart.brush.stackscatter", [], function() {

	var StackScatterBrush = function() {
        this.draw = function() {
            return this.drawScatter(this.getStackXY());
        }
	}

	return StackScatterBrush;
}, "chart.brush.scatter");
jui.define("chart.brush.gauge", [ "util.math" ], function(math) {

	var GaugeBrush = function(chart, axis, brush) {
		var self = this;
        var w, centerX, centerY, outerRadius, innerRadius;

        function createText(startAngle, endAngle, min, max, value) {
			var g = chart.svg.group({
				"class" : "gauge text"
			}).translate(centerX, centerY);

			g.append(chart.svg.text({
				x : 0,
				y : (brush.arrow) ? 70 : 10,
				"text-anchor" : "middle",
				"font-family" : chart.theme("fontFamily"),
				"font-size" : "3em",
				"font-weight" : 1000,
				"fill" : self.color(0)
			}, value + ""));

			if (brush.unitText != "") {
				g.append(chart.text({
					x : 0,
					y : 100,
					"text-anchor" : "middle",
                    "font-family" : chart.theme("fontFamily"),
					"font-size" : "1.5em",
					"font-weight" : 500,
					"fill" : chart.theme("gaugeFontColor")
				}, brush.unitText))
			}

			// 바깥 지름 부터 그림
			var startX = 0;
			var startY = -outerRadius;

            // min
            var obj = math.rotate(startX, startY, math.radian(startAngle));

            startX = obj.x;
            startY = obj.y;

            g.append(chart.text({
                x : obj.x + 30,
                y : obj.y + 20,
                "text-anchor" : "middle",
                "font-family" : chart.theme("fontFamily"),
				"fill" : chart.theme("gaugeFontColor")
            }, min + ""));

			// max
			// outer arc 에 대한 지점 설정
            var obj = math.rotate(startX, startY, math.radian(endAngle));
    
            g.append(chart.text({
                x : obj.x - 20,
                y : obj.y + 20,
                "text-anchor" : "middle",
                "font-family" : chart.theme("fontFamily"),
				"fill" : chart.theme("gaugeFontColor")
            }, max + ""));

			return g;
		}

        function createArrow(startAngle, endAngle) {
			var g = chart.svg.group().translate(centerX, centerY);

			// 바깥 지름 부터 그림
			var startX = 0;
			var startY = -(outerRadius + 5);

			var path = chart.svg.path({
				stroke : chart.theme("gaugeArrowColor"),
				"stroke-width" : 0.2,
				"fill" : chart.theme("gaugeArrowColor")
			});

			path.MoveTo(startX, startY);
			path.LineTo(5, 0);
			path.LineTo(-5, 0);
			path.ClosePath();

			// start angle
			path.rotate(startAngle);
			g.append(path)
			path.rotate(endAngle + startAngle);

			g.append(chart.svg.circle({
				cx : 0,
				cy : 0,
				r : 5,
				fill : chart.theme("gaugeArrowColor")
			}));

			g.append(chart.svg.circle({
				cx : 0,
				cy : 0,
				r : 2,
				fill : chart.theme("gaugeArrowColor")
			}));

			return g;
		}

        this.drawBefore = function() {
			var axis = axis || {};

			if (!axis.c) {
				axis.c = function() {
					return {
						x : 0,
						y : 0,
						width : chart.area('width'),
						height : chart.area('height')
					};
				}
			}

			var obj = axis.c(),
				width = obj.width,
				height = obj.height,
				x = obj.x,
				y = obj.y,
				min = width;

            if (height < min) {
                min = height;
            }

            w = min / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = w;
            innerRadius = outerRadius - brush.size;
        }

		this.draw = function() {
			var group = chart.svg.group({
				"class" : "brush gauge"
			});

			var rate = (brush.value - brush.min) / (brush.max - brush.min),
                currentAngle = (brush.endAngle) * rate;
			
			if (brush.endAngle >= 360) {
                brush.endAngle = 359.99999;
			}
			
			var g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle + currentAngle, brush.endAngle - currentAngle, {
				fill : chart.theme("gaugeBackgroundColor")
			});

			group.append(g);

			g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle, currentAngle, {
				fill : this.color(0)
			});

			group.append(g);

            if (brush.arrow) {
                g = createArrow(brush.startAngle, currentAngle);
                group.append(g);
            }

            // startAngle, endAngle 에 따른 Text 위치를 선정해야함
            g = createText(brush.startAngle, brush.endAngle, brush.min, brush.max, brush.value);
            group.append(g);

            return group;
		}
	}

	GaugeBrush.setup = function() {
		return {
			min: 0,
			max: 100,
			value: 0,
			size: 60,
			startAngle: 0,
			endAngle: 360,
			arrow: true,
			unitText: ""
		};
	}

	return GaugeBrush;
}, "chart.brush.donut");

jui.define("chart.brush.fullgauge", ["util.math"], function(math) {

	var FullGaugeBrush = function(chart, axis, brush) {
		var self = this;
        var w, centerX, centerY, outerRadius, innerRadius;

		function createText(startAngle, endAngle, min, max, value) {
			var g = chart.svg.group({
				"class" : "gauge text"
			});

			g.translate(centerX, centerY);

			if (brush.text != "") {
				g.append(chart.svg.text({
					x : 0,
					y : 10,
					"text-anchor" : "middle",
					"font-family" : chart.theme("fontFamily"),
					"font-size" : "3.5em",
					"font-weight" : 1000,
					"fill" : self.color(0)
				}, value + ""));
			}
			
			if (brush.unitText != "") {
				g.append(chart.text({
					x : 0,
					y : 40,
					"text-anchor" : "middle",
                    "font-family" : chart.theme("fontFamily"),
					"font-size" : "2em",
					"font-weight" : 500,
					"fill" : chart.theme("gaugeFontColor")
				}, brush.unitText));
			}

			return g;
		}

        this.drawBefore = function() {
			var axis = axis || {};

			if (!axis.c) {
				axis.c = function() {
					return {
						x : 0,
						y : 0,
						width : chart.area('width'),
						height : chart.area('height')
					};
				}
			}

			var obj = axis.c(),
				width = obj.width,
				height = obj.height,
				x = obj.x,
				y = obj.y,
				min = width;

			if (height < min) {
				min = height;
			}

			w = min / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
            outerRadius = w;
            innerRadius = outerRadius - brush.size;
        }

		this.draw = function() {
			var group = chart.svg.group();

			var rate = (brush.value - brush.min) / (brush.max - brush.min),
                currentAngle = (brush.endAngle) * rate;
			
			if (brush.endAngle >= 360) {
                brush.endAngle = 359.99999;
			}
			
			var g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle + currentAngle, brush.endAngle - currentAngle, {
				fill : chart.theme("gaugeBackgroundColor")
			});

			group.append(g);

			g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle, currentAngle, {
				fill : this.color(0)
			});

			group.append(g);

            // startAngle, endAngle 에 따른 Text 위치를 선정해야함
            g = createText(brush.startAngle, brush.endAngle, brush.min, brush.max, brush.value);
            group.append(g);

            return group;
		}
	}

	FullGaugeBrush.setup = function() {
		return {
			min: 0,
			max: 100,
			value: 0,
			size: 60,
			startAngle: 0,
			endAngle: 300,
			text: "",
			unitText: ""
		};
	}

	return FullGaugeBrush;
}, "chart.brush.donut");

jui.define("chart.brush.stackgauge", [ "util.math" ], function(math) {

	var StackGaugeBrush = function(chart, axis, brush) {
        var w, centerX, centerY, outerRadius;

		this.drawBefore = function() {
			if (!axis.c) {
				axis.c = function() {
					return {
						x : 0,
						y : 0,
						width : chart.area("width"),
						height : chart.area("height")
					};
				}
			}

			var obj = axis.c(),
				width = obj.width,
				height = obj.height,
				x = obj.x,
				y = obj.y,
				min = width;

			if (height < min) {
				min = height;
			}

			w = min / 2;
			centerX = width / 2 + x;
			centerY = height / 2 + y;
			outerRadius = w;
		}

		this.draw = function() {
			var group = chart.svg.group();
			
			this.eachData(function(i, data) {
				var rate = (data[brush.target] - brush.min) / (brush.max - brush.min),
                    currentAngle = (brush.endAngle) * rate,
                    innerRadius = outerRadius - brush.size + brush.cut;
				
				if (brush.endAngle >= 360) {
                    brush.endAngle = 359.99999;
				}
				
				// 빈 공간 그리기 
				var g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle + currentAngle, brush.endAngle - currentAngle, {
					fill : chart.theme("gaugeBackgroundColor")
				});
	
				group.append(g);
				
				// 채워진 공간 그리기 
				g = this.drawDonut(centerX, centerY, innerRadius, outerRadius, brush.startAngle, currentAngle,{
					fill : this.color(i)
				}, true);
	
				group.append(g);
				
				// draw text 
				group.append(chart.text({
					x : centerX + 2,
					y : centerY + Math.abs(outerRadius) - 5,
					fill : this.color(i),
					"font-size" : "12px",
					"font-weight" : "bold"
				}, data[brush.title] || ""))
				
				outerRadius -= brush.size;
			});

            return group;
		}
	}

	StackGaugeBrush.setup = function() {
		return {
			min: 0,
			max: 100,
			cut: 5,
			size: 24,
			startAngle: -180,
			endAngle: 360,
			title: "title"
		};
	}

	return StackGaugeBrush;
}, "chart.brush.donut");

jui.define("chart.brush.waterfall", [], function() {

	var WaterFallBrush = function(chart, axis, brush) {
		var g, count, zeroY, width, columnWidth, half_width;
		var outerPadding;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
			count = this.listData().length;
			zeroY = axis.y(0);

			width = axis.x.rangeBand();
			half_width = (width - outerPadding * 2);
			columnWidth = (width - outerPadding * 2 - (brush.target.length - 1)) / brush.target.length;
		}

		this.draw = function() {
			var target = brush.target[0],
				stroke = chart.theme("waterfallLineColor");

			this.eachData(function(i, data) {
				var startX = axis.x(i) - half_width / 2,
					startY = axis.y(data[target]),
					r = null, l = null;

				if(i == 0 || (i == count - 1 && brush.end)) {
					var color = chart.theme("waterfallEdgeBackgroundColor");

					if (startY <= zeroY) {
						r = chart.svg.rect({
							x: startX,
							y: startY,
							width: columnWidth,
							height: Math.abs(zeroY - startY),
							fill: color
						});
					} else {
						r = chart.svg.rect({
							x: startX,
							y: zeroY,
							width: columnWidth,
							height: Math.abs(zeroY - startY),
							fill: color
						});
					}
				} else {
					var preValue = this.getData(i - 1)[target],
						nowValue = data[target],
						preStartY = axis.y(preValue),
						nowStartY = axis.y(nowValue),
						h = preStartY - nowStartY;

					if(h > 0) {
						r = chart.svg.rect({
							x: startX,
							y: preStartY - h,
							width: columnWidth,
							height: Math.abs(h),
							fill: chart.theme("waterfallBackgroundColor")
						});
					} else {
						r = chart.svg.rect({
							x: startX,
							y: preStartY,
							width: columnWidth,
							height: Math.abs(h),
							fill: chart.theme("waterfallInvertBackgroundColor")
						});
					}

					if(brush.line) {
						l = chart.svg.line({
							x1: startX - outerPadding * 2,
							y1: nowStartY + h,
							x2: startX,
							y2: nowStartY + h,
							stroke: stroke,
							"stroke-width": 1,
							"stroke-dasharray": chart.theme("waterfallLineDashArray")
						});

						g.append(l);
					}
				}

				this.addEvent(r, i, 0);
				g.append(r);

				startX += columnWidth;
			});

            return g;
		}
	}

	WaterFallBrush.setup = function() {
		return {
			line: true,
			end: false,
			outerPadding: 5
		};
	}

	return WaterFallBrush;
}, "chart.brush.core");

jui.define("chart.brush.splitline", [ "util.base" ], function(_) {

	var SplitLineBrush = function() {

        this.createLine = function(pos, index) {
            var opts = {
                stroke: this.color(index),
                "stroke-width": this.chart.theme("lineBorderWidth"),
                fill: "transparent"
            };

            var split = this.brush.split,
                symbol = this.brush.symbol;

            var x = pos.x,
                y = pos.y,
                px, py; // curve에서 사용함

            var g = this.chart.svg.group(),
                p = this.chart.svg.path(opts).MoveTo(x[0], y[0]);

            if(symbol == "curve") {
                px = this.curvePoints(x);
                py = this.curvePoints(y);
            }

            for(var i = 0; i < x.length - 1; i++) {
                if(i == split) {
                    var color = this.chart.theme("lineSplitBorderColor"),
                        opacity = this.chart.theme("lineSplitBorderOpacity");

                    g.append(p);

                    opts["stroke"] = (color != null) ? color : opts["stroke"];
                    opts["stroke-opacity"] = opacity;

                    p = this.chart.svg.path(opts).MoveTo(x[i], y[i]);
                }

                if(symbol == "step") {
                    var sx = x[i] + ((x[i + 1] - x[i]) / 2);

                    p.LineTo(sx, y[i]);
                    p.LineTo(sx, y[i + 1]);
                }

                if(symbol != "curve") {
                    p.LineTo(x[i + 1], y[i + 1]);
                } else {
                    p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
                }
            }

            g.append(p);

            return g;
        }

        this.drawLine = function(path) {
            var g = this.chart.svg.group();

            for (var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k);

                this.addEvent(p, null, k);
                g.append(p);
            }

            return g;
        }

        this.draw = function() {
            return this.drawLine(this.getXY());
        }
	}

    SplitLineBrush.setup = function() {
        return {
            symbol: "normal", // normal, curve, step
            split: null
        };
    }

	return SplitLineBrush;
}, "chart.brush.core");
jui.define("chart.brush.splitarea", [ "util.base" ], function(_) {

    var SplitAreaBrush = function() {

        this.drawArea = function(path) {
            var g = this.chart.svg.group(),
                maxY = this.chart.area('height'),
                split = this.brush.split,
                splitColor = this.chart.theme("areaSplitBackgroundColor");

            for(var k = 0; k < path.length; k++) {
                var opts = {
                    fill: this.color(k),
                    "fill-opacity": this.chart.theme("areaBackgroundOpacity"),
                    "stroke-width": 0
                };

                var line = this.createLine(path[k], k),
                    xList = path[k].x;

                line.each(function(i, p) {
                    if(i == 0) {
                        split = (split != null) ? split : xList.length - 1;

                        p.LineTo(xList[split], maxY);
                        p.LineTo(xList[0], maxY);
                        p.attr(opts);
                    } else {
                        opts["fill"] = splitColor;

                        p.LineTo(xList[xList.length - 1], maxY);
                        p.LineTo(xList[split], maxY);
                        p.attr(opts);
                    }

                    p.ClosePath();
                });

                this.addEvent(line, null, k);
                g.prepend(line);
            }

            return g;
        }

        this.draw = function() {
            return this.drawArea(this.getXY());
        }
    }

    return SplitAreaBrush;
}, "chart.brush.splitline");

jui.define("chart.brush.rangecolumn", [], function() {

	var RangeColumnBrush = function(chart, axis, brush) {
		var g, width, columnWidth, half_width;
		var outerPadding, innerPadding;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;

			width = axis.x.rangeBand();
			half_width = (width - outerPadding * 2);
			columnWidth = (width - outerPadding * 2 - (brush.target.length - 1) * innerPadding) / brush.target.length;

			borderColor = chart.theme("columnBorderColor");
			borderWidth = chart.theme("columnBorderWidth");
			borderOpacity = chart.theme("columnBorderOpacity");
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var startX = axis.x(i) - (half_width / 2);

				for(var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						startY = axis.y(value[1]),
						zeroY = axis.y(value[0]);

					var r = chart.svg.rect({
						x : startX,
						y : startY,
						width : columnWidth,
						height : Math.abs(zeroY - startY),
						fill : this.color(j),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});

                    this.addEvent(r, i, j);
                    g.append(r);

					startX += columnWidth + innerPadding;
				}
			});

            return g;
		}
	}

	RangeColumnBrush.setup = function() {
		return {
			outerPadding: 2,
			innerPadding: 1
		};
	}

	return RangeColumnBrush;
}, "chart.brush.core");

jui.define("chart.brush.rangebar", [], function() {

	var RangeBarBrush = function(chart, axis, brush) {
		var g, height, half_height, barHeight;
		var outerPadding, innerPadding;
		var borderColor, borderWidth, borderOpacity;

		this.drawBefore = function() {
			g = chart.svg.group();

            outerPadding = brush.outerPadding;
            innerPadding = brush.innerPadding;

			height = axis.y.rangeBand();
			half_height = height - (outerPadding * 2);
			barHeight = (half_height - (brush.target.length - 1) * innerPadding) / brush.target.length;

			borderColor = chart.theme("barBorderColor");
			borderWidth = chart.theme("barBorderWidth");
			borderOpacity = chart.theme("barBorderOpacity");
		}

		this.draw = function() {
			this.eachData(function(i, data) {
				var group = chart.svg.group(),
					startY = axis.y(i) - (half_height / 2);

				for(var j = 0; j < brush.target.length; j++) {
					var value = data[brush.target[j]],
						startX = axis.x(value[1]),
						zeroX = axis.x(value[0]);

					var r = chart.svg.rect({
						x : zeroX,
						y : startY,
						height : barHeight,
						width : Math.abs(zeroX - startX),
						fill : this.color(j),
						stroke : borderColor,
						"stroke-width" : borderWidth,
						"stroke-opacity" : borderOpacity
					});

                    this.addEvent(r, i, j);
                    group.append(r);

					startY += barHeight + innerPadding;
				}
				
				g.append(group);
			});

            return g;
		}
	}

	RangeBarBrush.setup = function() {
		return {
			outerPadding: 2,
			innerPadding: 1
		};
	}

	return RangeBarBrush;
}, "chart.brush.core");

jui.define("chart.brush.focus", [], function() {
    var FocusBrush = function(chart, axis, brush) {
        var g;

        this.drawFocus = function(start, end) {
            var borderColor = chart.theme("focusBorderColor"),
                borderSize = chart.theme("focusBorderWidth"),
                bgColor = chart.theme("focusBackgroundColor"),
                bgOpacity = chart.theme("focusBackgroundOpacity");

            var height = chart.area('height');

            g = chart.svg.group({}, function() {
                var startX = start,
                    endX = end;

                if (brush.hide) {
                    return ;
                }

                chart.svg.line({
                    stroke: borderColor,
                    "stroke-width": borderSize,
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: height
                }).translate(startX, 0);

                chart.svg.rect({
                    width: Math.abs(endX - startX),
                    height: height,
                    fill: bgColor,
                    opacity: bgOpacity
                }).translate(startX, 0)

                chart.svg.line({
                    stroke: borderColor,
                    "stroke-width": borderSize,
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: height
                }).translate(endX, 0);
            });

            return g;
        }

        this.draw = function() {
            var start = 0, end = 0;
            brush.hide = false;

            if(brush.start == -1 && brush.end == -1) {
                brush.hide = true;
            }

            if(axis.x.type == "block") {
                start = axis.x(brush.start) - axis.x.rangeBand() / 2;
                end = axis.x(brush.end) + axis.x.rangeBand() / 2;
            } else  {
                start = axis.x(brush.start);
                end = axis.x(brush.end);
            }

            return this.drawFocus(start, end);
        }
    }

    FocusBrush.setup = function() {
        return {
            start: -1,
            end: -1
        };
    }

    return FocusBrush;
}, "chart.brush.core");
jui.define("chart.brush.pin", [], function() {
    var PinBrush = function(chart, axis, brush) {
        var g;
        var size = 6;

        this.draw = function() {
            var color = chart.theme("pinBorderColor"),
                width = chart.theme("pinBorderWidth");

            g = chart.svg.group({}, function() {
                var x = axis.x(brush.split) - (size / 2);

                chart.svg.polygon({
                    fill: color
                })
                .point(size, 0)
                .point(size / 2, size)
                .point(0, 0)
                .translate(x, 0);

                chart.svg.line({
                    stroke: color,
                    "stroke-width": width,
                    x1: size / 2,
                    y1: 0,
                    x2: size / 2,
                    y2: chart.area("height")
                }).translate(x, 0);
            });

            return g;
        }
    }

    PinBrush.setup = function() {
        return {
            split: 0
        };
    }

    return PinBrush;
}, "chart.brush.core");
jui.define("chart.widget.core", [ "jquery", "util.base" ], function($, _) {

	var CoreWidget = function() {
        function getBrushIndex(brush) {
            var list = [ 0 ];

            if(_.typeCheck("array", brush)) {
                list = brush;
            } else if(_.typeCheck("integer", brush)) {
                list = [ brush ];
            }

            return list;
        }

        this.balloonPoints = function(type, w, h, anchor) {
            var points = [];

            if(type == "top") {
                points.push([ 0, 0 ].join(","));
                points.push([ w, 0 ].join(","));
                points.push([ w, h ].join(","));
                points.push([ (w / 2) + (anchor / 2), h ].join(","));
                points.push([ (w / 2), h + anchor ].join(","));
                points.push([ (w / 2) - (anchor / 2), h ].join(","))
                points.push([ 0, h ].join(","));
            } else if(type == "bottom") {
                points.push([ 0, anchor ].join(","));
                points.push([ (w / 2) - (anchor / 2), anchor ].join(","));
                points.push([ (w / 2), 0 ].join(","));
                points.push([ (w / 2) + (anchor / 2), anchor ].join(","));
                points.push([ w, anchor ].join(","));
                points.push([ w, anchor + h ].join(","))
                points.push([ 0, anchor + h ].join(","));
            } else if(type == "left") {
                points.push([ 0, 0 ].join(","));
                points.push([ w, 0 ].join(","));
                points.push([ w, (h / 2) - (anchor / 2) ].join(","));
                points.push([ w + anchor, (h / 2) ].join(","));
                points.push([ w, (h / 2) + (anchor / 2) ].join(","));
                points.push([ w, h ].join(","));
                points.push([ 0, h ].join(","));
            } else if(type == "right") {
                points.push([ 0, 0 ].join(","));
                points.push([ w, 0 ].join(","));
                points.push([ w, h ].join(","));
                points.push([ 0, h ].join(","));
                points.push([ 0, (h / 2) + (anchor / 2) ].join(","));
                points.push([ 0 - anchor, (h / 2) ].join(","));
                points.push([ 0, (h / 2) - (anchor / 2) ].join(","));
            }

            // Firefox 처리 (시작점과 끝점 연결)
            points.push([ 0, 0 ].join(","));

            return points.join(" ");
        }

        this.eachBrush = function(callback) {
            if(!_.typeCheck("function", callback)) return;
            var list = getBrushIndex(this.widget.brush);

            for(var i = 0; i < list.length; i++) {
                callback.apply(this, [ i, this.chart.get("brush", list[i]) ]);
            }
        }

        this.listBrush = function() {
            var list = getBrushIndex(this.widget.brush),
                result = [];

            for(var i = 0; i < list.length; i++) {
                result[i] = this.chart.get("brush", list[i]);
            }

            return result;
        }

        this.getBrush = function(index) {
            return this.listBrush()[index];
        }

        this.existBrush = function(index) {
            var list = getBrushIndex(this.widget.brush);

            return ($.inArray(index, list) == -1) ? false : true;
        }

        this.isRender = function() {
            return (this.widget.render === true) ? true : false;
        }

        this.on = function(type, callback) {
            return this.chart.on(type, callback, this.isRender());
        }
	}

    CoreWidget.setup = function() {
        return {
            brush: 0,
            render: false,
            index: 0
        }
    }

	return CoreWidget;
}, "chart.draw"); 
jui.define("chart.widget.tooltip", [ "jquery" ], function($) {
    var TooltipWidget = function(chart, axis, widget) {
        var self = this;
        var g, text, rect;
        var padding = 7, anchor = 7, textY = 14;
        var tspan = []; // 멀티라인일 경우, 하위 노드 캐시

        function setMessage(index, message) {
            if(!tspan[index]) {
                var elem = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                text.element.appendChild(elem);
                tspan[index] = elem;
            }

            tspan[index].textContent = message;
        }

        function getFormat(key, value, data) {
            if(typeof(widget.format) == "function") {
                return widget.format.apply(self.chart, [ key, value, data ]);
            } else {
                if (!value) {
                    return key;
                }

                return key + ": " + self.format(value);
            }
        }

        function printTooltip(obj) {
            if(obj.dataKey && widget.all === false) {
                var t = chart.get("series", obj.dataKey),
                    k = obj.dataKey,
                    d = (obj.data != null) ? obj.data[k] : null;

                // 위젯 포지션에 따른 별도 처리
                if(widget.orient == "bottom") {
                    text.attr({ y: textY + anchor });
                }

                // 툴팁 값 설정
                var message = getFormat((t.text) ? t.text : k, d, obj.data);
                setMessage(0, message);

                text.attr({ "text-anchor": "middle" });
            } else {
                var brush = obj.brush;

                for(var i = 0; i < brush.target.length; i++) {
                    var key = brush.target[i],
                        t = chart.get("series", key),
                        x = padding,
                        y = (textY * i) + (padding * 2),
                        d = (obj.data != null) ? obj.data[key] : null;

                    // 위젯 포지션에 따른 별도 처리
                    if(widget.orient == "bottom") {
                        y = y + anchor;
                    }

                    var message = getFormat((t.text) ? t.text : key, d, obj.data);
                    setMessage(i, message);

                    tspan[i].setAttribute("x", x);
                    tspan[i].setAttribute("y", y);
                }

                text.attr({ "text-anchor": "inherit" });
            }
        }

        this.drawBefore = function() {
            g = chart.svg.group({
                visibility: "hidden"
            }, function() {
                rect = chart.svg.polygon({
                    fill: chart.theme("tooltipBackgroundColor"),
                    "fill-opacity": chart.theme("tooltipBackgroundOpacity"),
                    stroke: chart.theme("tooltipBorderColor"),
                    "stroke-width": 1
                });

                text = chart.svg.text({
                    "font-family": chart.theme("fontFamily"),
                    "font-size": chart.theme("tooltipFontSize"),
                    "fill": chart.theme("tooltipFontColor"),
                    y: textY
                });
            });
        }

        this.draw = function() {
            var self = this,
                isActive = false,
                w, h;

            this.on("mouseover", function(obj, e) {
                if(isActive || !self.existBrush(obj.brush.index)) return;
                if(!obj.dataKey && !obj.data) return;

                // 툴팁 텍스트 출력
                printTooltip(obj);

                var size = text.size();
                w = size.width + (padding * 2);
                h = size.height + padding;

                text.attr({ x: w / 2 });
                rect.attr({ points: self.balloonPoints(widget.orient, w, h, anchor) });
                g.attr({ visibility: "visible" });

                isActive = true;
            });

            this.on("mousemove", function(obj, e) {
                if(!isActive) return;

                var x = e.bgX - (w / 2),
                    y = e.bgY - h - anchor - (padding / 2);

                if(widget.orient == "left" || widget.orient == "right") {
                    y = e.bgY - (h / 2) - (padding / 2);
                }

                if(widget.orient == "left") {
                    x = e.bgX - w - anchor;
                } else if(widget.orient == "right") {
                    x = e.bgX + anchor;
                } else if(widget.orient == "bottom") {
                    y = e.bgY + (anchor * 2);
                }

                g.translate(x, y);
            });

            this.on("mouseout", function(obj, e) {
                if(!isActive) return;

                g.attr({ visibility: "hidden" });
                isActive = false;
            });

            return g;
        }
    }

    TooltipWidget.setup = function() {
        return {
            orient: "top", // or bottom, left, right
            all: false,
            format: null
        };
    }

    return TooltipWidget;
}, "chart.widget.core");
jui.define("chart.widget.title", [], function() {

    var TitleWidget = function(chart, axis, widget) {
        var x = 0, y = 0, anchor = "middle";

        this.drawBefore = function() {
            if (widget.orient == "bottom") {
                y = chart.area("y2") + chart.padding("bottom") - 20;
            } else if (widget.orient == "top") {
                y = 20;
            } else {
                y = chart.area("y") + chart.area("height") / 2
            }

            if (widget.align == "center") {
                x = chart.area("x") + chart.area("width") / 2;
                anchor = "middle";
            } else if (widget.align == "start") {
                x = chart.area("x");
                anchor = "start";
            } else {
                x = chart.area("x2");
                anchor = "end";
            }
        }

        this.draw = function() {
            var obj = chart.svg.getTextRect(widget.text);

            var half_text_width = obj.width / 2,
                half_text_height = obj.height / 2;

            var text =  chart.text({
                x : x + widget.dx,
                y : y + widget.dy,
                "text-anchor" : anchor,
                "font-family" : chart.theme("fontFamily"),
                "font-size" : chart.theme("titleFontSize"),
                "font-weight" : chart.theme("titleFontWeight"),
                "fill" : chart.theme("titleFontColor")
            }, widget.text);

            if (widget.orient == "center") {
                if (widget.align == "start") {
                    text.rotate(-90, x + widget.dx + half_text_width, y + widget.dy + half_text_height)
                } else if (widget.align == "end") {
                    text.rotate(90, x + widget.dx - half_text_width, y + widget.dy + half_text_height)
                }
            }

            return text;
        }
    }

    TitleWidget.setup = function() {
        return {
            orient: "top", // or bottom
            align: "center", // or start, end
            text: "",
            dx: 0,
            dy: 0
        }
    }

    return TitleWidget;
}, "chart.widget.core");
jui.define("chart.widget.legend", [ "util.base" ], function(_) {

    var LegendWidget = function(chart, axis, widget) {
        var columns = [];

        function setLegendStatus(brush) {
            if(!widget.filter) return;

            if(!columns[brush.index]) {
                columns[brush.index] = {};
            }

            for(var i = 0; i < brush.target.length; i++) {
                columns[brush.index][brush.target[i]] = true;
            }
        }

        function changeTargetOption(brushList) {
            var target = [],
                index = brushList[0].index;

            for(var key in columns[index]) {
                if(columns[index][key]) {
                    target.push(key);
                }
            }

            for(var i = 0; i < brushList.length; i++) {
                chart.updateBrush(brushList[i].index, { target: target });
            }

            // 차트 렌더링이 활성화되지 않았을 경우
            if(!chart.isRender()) {
                chart.render();
            }

            chart.emit("legend.filter", [ target ]);
        }

        /**
         * brush 에서 생성되는 legend 아이콘 리턴 
         * 
         * @param {object} chart
         * @param {object} brush
         */
		this.getLegendIcon = function(brush) {
            var self = this,
                arr = [],
                data = brush.target,
                count = data.length;
			
			for(var i = 0; i < count; i++) {
                var target = brush.target[i],
                    text = chart.get("series", target).text || target;

				var rect = chart.svg.getTextRect(text),
                    width = Math.min(rect.width, rect.height),
                    height = width;
								 
				var group = chart.svg.group();
				
				group.append(chart.svg.rect({
					x: 0, 
					y : 0, 
					width: width, 
					height : height,
					fill : chart.color(i, brush)
				}));
				
 				group.append(chart.text({
					x : width + 4,
					y : 11,
                    "font-family" : chart.theme("fontFamily"),
                    "font-size" : chart.theme("legendFontSize"),
                    "fill" : chart.theme("legendFontColor"),
					"text-anchor" : "start"
				}, text));

				arr.push({
					icon : group,
					width : width + 4 + rect.width + 10,
					height : height + 4
				});

                if(widget.filter) {
                    (function(key, element) {
                        element.attr({
                            cursor: "pointer"
                        });

                        element.on("click", function(e) {
                            if(columns[brush.index][key]) {
                                element.attr({ opacity: 0.7 });
                                columns[brush.index][key] = false;
                            } else {
                                element.attr({ opacity: 1 });
                                columns[brush.index][key] = true;
                            }

                            changeTargetOption((widget.brushSync) ? self.listBrush() : [ brush ]);
                        });
                    })(target, group);
                }
			}
			
			return arr;
		}        
        
        this.draw = function() {
            var group = chart.svg.group();
            
            var x = 0, y = 0,
                total_width = 0, total_height = 0,
                max_width = 0, max_height = 0;

            this.eachBrush(function(index, brush) {
                // brushSync가 true일 경우, 한번만 실행함
                if(widget.brushSync && index != 0) return;

                var arr = this.getLegendIcon(brush);

                for(var k = 0; k < arr.length; k++) {
                    group.append(arr[k].icon);
                    arr[k].icon.translate(x, y);

                    if (widget.orient == "bottom" || widget.orient == "top") {
                        x += arr[k].width;
                        total_width += arr[k].width;

                        if (max_height < arr[k].height) {
                            max_height = arr[k].height;
                        }
                    } else {
                        y += arr[k].height;
                        total_height += arr[k].height;

                        if (max_width < arr[k].width) {
                            max_width = arr[k].width;
                        }
                    }
                }

                setLegendStatus(brush);
            });
            
            // legend 위치  선정
            if (widget.orient == "bottom" || widget.orient == "top") {
                var y = (widget.orient == "bottom") ? chart.area('y2') + chart.padding("bottom") - max_height : chart.area('y') - chart.padding("top");
                
                if (widget.align == "start") {
                    x = chart.area('x');
                } else if (widget.align == "center") {
                    x = chart.area('x') + (chart.area('width') / 2- total_width / 2);
                } else if (widget.align == "end") {
                    x = chart.area('x2') - total_width;
                }
            } else {
                var x = (widget.orient == "left") ? chart.area('x') - chart.padding("left") : chart.area('x2') + chart.padding("right") - max_width;
                
                if (widget.align == "start") {
                    y = chart.area('y');
                } else if (widget.align == "center") {
                    y = chart.area('y') + (chart.area('height') / 2 - total_height / 2);
                } else if (widget.align == "end") {
                    y = chart.area('y2') - total_height;
                }
            } 
            
            group.translate(Math.floor(x), Math.floor(y));

            return group;
        }
    }

    LegendWidget.setup = function() {
        return {
            orient: "bottom",
            align: "center", // or start, end
            filter: false,
            brushSync: false
        };
    }

    return LegendWidget;
}, "chart.widget.core");
jui.define("chart.widget.scroll", [ "util.base" ], function (_) {

    var ScrollWidget = function(chart, axis, widget) {
        var thumbWidth = 0,
            thumbLeft = 0,
            bufferCount = 0,
            dataLength = 0,
            totalWidth = 0,
            piece = 0,
            rate = 0 ;

        function setScrollEvent(self, thumb) {
            var isMove = false,
                mouseStart = 0,
                thumbStart = 0;

            self.on("bg.mousedown", function(e) {
                if(isMove && thumb.element != e.target) return;

                isMove = true;
                mouseStart = e.bgX;
                thumbStart = thumbLeft;
            });

            self.on("bg.mousemove", mousemove);
            self.on("bg.mouseup", mouseup);
            self.on("chart.mousemove", mousemove);
            self.on("chart.mouseup", mouseup);

            function mousemove(e) {
                if(!isMove) return;

                var gap = thumbStart + e.bgX - mouseStart;

                if(gap < 0) {
                    gap = 0;
                } else {
                    if(gap + thumbWidth > chart.area("width")) {
                        gap = chart.area("width") - thumbWidth;
                    }
                }

                thumb.translate(gap, 1);
                thumbLeft = gap;

                var startgap = gap * rate,
                    start = startgap == 0 ? 0 : Math.floor(startgap / piece);

                if(gap + thumbWidth == chart.area("width")) {
                    start += 1;
                }

                chart.zoom(start, start + bufferCount);

                // 차트 렌더링이 활성화되지 않았을 경우
                if(!chart.isRender()) {
                    chart.render();
                }
            }

            function mouseup(e) {
                if(!isMove) return;

                isMove = false;
                mouseStart = 0;
                thumbStart = 0;
            }
        }

        this.drawBefore = function() {
			dataLength =  axis.origin.length;
			bufferCount = axis.buffer;
			piece = chart.area("width") / bufferCount;
			totalWidth = piece * dataLength;
			rate = totalWidth / chart.area("width");
            thumbWidth = chart.area("width") * (bufferCount / dataLength) + 2;
        }

        this.draw = function() {
            var self = this;

            return chart.svg.group({}, function() {
                chart.svg.rect({
                    width: chart.area("width"),
                    height: 7,
                    fill: chart.theme("scrollBackgroundColor")
                });

                var thumb = chart.svg.rect({
                    width: thumbWidth,
                    height: 5,
                    fill: chart.theme("scrollThumbBackgroundColor"),
                    stroke: chart.theme("scrollThumbBorderColor"),
                    cursor: "pointer",
                    "stroke-width": 1
                }).translate(thumbLeft, 1);

                // 차트 스크롤 이벤트
                setScrollEvent(self, thumb);

            }).translate(chart.area("x"), chart.area("y2"));
        }
    }

    return ScrollWidget;
}, "chart.widget.core");
jui.define("chart.widget.zoom", [ "util.base" ], function(_) {

    var ZoomWidget = function(chart, axis, widget) {
        var count, tick;

        function setDragEvent(self, thumb, bg) {
            var isMove = false,
                mouseStart = 0,
                thumbWidth = 0;

            self.on("chart.mousedown", function(e) {
                if(isMove || axis.start > 0) return;

                isMove = true;
                mouseStart = e.bgX;
            });

            self.on("chart.mousemove", function(e) {
                if(!isMove) return;

                thumbWidth = e.bgX - mouseStart;

                if(thumbWidth > 0) {
                    thumb.attr({
                        width: thumbWidth
                    });

                    thumb.translate(mouseStart, chart.area("y"));
                } else {
                    thumb.attr({
                        width: Math.abs(thumbWidth)
                    });

                    thumb.translate(mouseStart + thumbWidth, chart.area("y"));
                }
            });

            self.on("chart.mouseup", endZoomAction);
            self.on("bg.mouseup", endZoomAction);
            self.on("bg.mouseout", endZoomAction);

            function endZoomAction() {
                isMove = false;
                if(thumbWidth == 0) return;

                var x = ((thumbWidth > 0) ? mouseStart : mouseStart + thumbWidth) - chart.padding("left");
                var start = Math.floor(x / tick),
                    end = Math.ceil((x + Math.abs(thumbWidth)) / tick);

                // 차트 줌
                if(start < end) {
                    chart.zoom(start, end);
                    bg.attr({ "visibility": "visible" });

                    // 차트 렌더링이 활성화되지 않았을 경우
                    if(!chart.isRender()) {
                        chart.render();
                    }
                }

                resetDragStatus();
            }

            function resetDragStatus() { // 엘리먼트 및 데이터 초기화
                isMove = false;
                mouseStart = 0;
                thumbWidth = 0;

                thumb.attr({
                    width: 0
                });
            }
        }

        this.drawBefore = function() {
            count = (axis.data.length < axis.buffer && axis.data.length > 0) ? axis.data.length : axis.buffer;
            tick = chart.area("width") / count;
        }

        this.draw = function() {
            var self = this;
            var cw = chart.area("width"),
                ch = chart.area("height"),
                r = 12;

            return chart.svg.group({}, function() {
                var thumb = chart.svg.rect({
                    height: ch,
                    fill: chart.theme("zoomBackgroundColor"),
                    opacity: 0.3
                });

                var bg = chart.svg.group({
                    visibility: "hidden"
                }, function() {
                    chart.svg.rect({
                        width: cw,
                        height: ch,
                        fill: chart.theme("zoomFocusColor"),
                        opacity: 0.2
                    });

                    chart.svg.group({
                        cursor: "pointer"
                    }, function() {
                        chart.svg.circle({
                            r: r,
                            cx: cw,
                            cy: 0,
                            opacity: 0
                        });

                        chart.svg.path({
                            d: "M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10s10-4.5,10-10C22,6.5,17.5,2,12,2z M16.9,15.5l-1.4,1.4L12,13.4l-3.5,3.5 l-1.4-1.4l3.5-3.5L7.1,8.5l1.4-1.4l3.5,3.5l3.5-3.5l1.4,1.4L13.4,12L16.9,15.5z",
                            fill: chart.theme("zoomFocusColor")
                        }).translate(cw - r, -r);
                    }).on("click", function(e) {
                        bg.attr({ visibility: "hidden" });
                        chart.page(1);

                        // 차트 렌더링이 활성화되지 않았을 경우
                        if(!chart.isRender()) {
                            chart.render();
                        }
                    });

                }).translate(chart.area("x"), chart.area("y"));

                setDragEvent(self, thumb, bg);
            });
        }
    }

    return ZoomWidget;
}, "chart.widget.core");
jui.define("chart.widget.cross", [ "util.base" ], function(_) {

    var CrossWidget = function(chart, axis, widget) {
        var self = this;
        var tw = 50, th = 18, ta = tw / 10; // 툴팁 넓이, 높이, 앵커 크기
        var g, xline, yline, xTooltip, yTooltip;
        var tspan = [];

        function printTooltip(index, text, message) {
            if(!tspan[index]) {
                var elem = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                text.element.appendChild(elem);
                tspan[index] = elem;
            }

            tspan[index].textContent = message;
        }

        this.drawBefore = function() {
            g = chart.svg.group({
                visibility: "hidden"
            }, function() {
                // 포맷 옵션이 없을 경우, 툴팁을 생성하지 않음
                if(_.typeCheck("function", widget.yFormat)) {
                    xline = chart.svg.line({
                        x1: 0,
                        y1: 0,
                        x2: chart.area("width"),
                        y2: 0,
                        stroke: chart.theme("crossBorderColor"),
                        "stroke-width": chart.theme("crossBorderWidth"),
                        opacity: chart.theme("crossBorderOpacity")
                    });

                    yTooltip = chart.svg.group({}, function () {
                        chart.svg.polygon({
                            fill: chart.theme("crossBalloonBackgroundColor"),
                            "fill-opacity": chart.theme("crossBalloonBackgroundOpacity"),
                            points: self.balloonPoints("left", tw, th, ta)
                        });

                        chart.svg.text({
                            "font-family": chart.theme("fontFamily"),
                            "font-size": chart.theme("crossBalloonFontSize"),
                            "fill": chart.theme("crossBalloonFontColor"),
                            "text-anchor": "middle",
                            x: tw / 2,
                            y: 12
                        });
                    }).translate(-(tw + ta), 0);
                }

                if(_.typeCheck("function", widget.xFormat)) {
                    yline = chart.svg.line({
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: chart.area('height'),
                        stroke: chart.theme("crossBorderColor"),
                        "stroke-width": chart.theme("crossBorderWidth"),
                        opacity: chart.theme("crossBorderOpacity")
                    });

                    xTooltip = chart.svg.group({}, function () {
                        chart.svg.polygon({
                            fill: chart.theme("crossBalloonBackgroundColor"),
                            "fill-opacity": chart.theme("crossBalloonBackgroundOpacity"),
                            points: self.balloonPoints("bottom", tw, th, ta)
                        });

                        chart.svg.text({
                            "font-family": chart.theme("fontFamily"),
                            "font-size": chart.theme("crossBalloonFontSize"),
                            "fill": chart.theme("crossBalloonFontColor"),
                            "text-anchor": "middle",
                            x: tw / 2,
                            y: 17
                        });
                    }).translate(0, chart.area("height") + ta);
                }
            }).translate(chart.area("x"), chart.area("y"));
        }

        this.draw = function() {
            var brush = this.getBrush(0);

            this.on("chart.mouseover", function(e) {
                g.attr({ visibility: "visible" });
            });

            this.on("chart.mouseout", function(e) {
                g.attr({ visibility: "hidden" });
            });

            this.on("chart.mousemove", function(e) {
                var left = e.chartX + 2,
                    top = e.chartY + 2;

                if(xline) {
                    xline.attr({
                        y1: top,
                        y2: top
                    });
                }

                if(yline) {
                    yline.attr({
                        x1: left,
                        x2: left
                    });
                }

                // 포맷 옵션이 없을 경우, 처리하지 않음
                if(yTooltip) {
                    yTooltip.translate(-(tw + ta), top - (th / 2));

                    var value = axis.y.invert(top),
                        message = widget.yFormat.call(self.chart, value);
                    printTooltip(0, yTooltip.get(1), message);
                }

                if(xTooltip) {
                    xTooltip.translate(left - (tw / 2), chart.area("height") + ta);

                    var value = axis.x.invert(left),
                        message = widget.xFormat.call(self.chart, value);
                    printTooltip(1, xTooltip.get(1), message);
                }
            });

            return g;
        }
    }

    CrossWidget.setup = function() {
        return {
            xFormat: null,
            yFormat: null
        };
    }

    return CrossWidget;
}, "chart.widget.core");
jui.defineUI("chartx.realtime", [ "jquery", "util.base", "util.time", "chart.builder" ], function($, _, time, builder) {

    var UI = function() {
        var interval = null,
            dataList = [];

        function runningChart(self) {
            var opts = self.options,
                domain = initDomain(self);

            for(var i = 0; i < dataList.length; i++) {
                if(dataList[i][opts.axis.key].getTime() <= domain[0].getTime()) {
                    dataList.splice(i, 1);
                } else {
                    break;
                }
            }

            self.chart.updateAxis(0, {
                x: {
                    domain: domain
                },
                data: dataList
            });
        }

        function initDomain(self) {
            var end = new Date(),
                start = time.add(end, time.minutes, -self.options.period);

            return [ start, end ];
        }

        function getOptions(self) {
            var options = {},
                excepts = [ "interval", "period" ];

            for(var key in self.options) {
                if($.inArray(key, excepts) == -1) {
                    options[key] = self.options[key];
                }
            }

            return options;
        }

        this.init = function() {
            var opts = this.options,
                target = (_.typeCheck("array", opts.brush)) ? opts.brush[0].target : opts.brush.target;

            var axis_domain = target;
            if (_.typeCheck("array", target )) {
                axis_domain = (function(target) {
                    return function(d) {
                        var arr = [];
                        for(var i = 0; i < target.length ;i++) {
                            arr.push(d[target[i]]);
                        }

                        return arr;
                    }
                })(target);
            }

            this.chart = builder(this.selector, _.extend({
                axis : {
                    x : {
                        type : "date",
                        domain : initDomain(this),
                        step : [ time.minutes, opts.axis.xstep ],
                        realtime : true,
                        format : opts.axis.format,
                        key : opts.axis.key,
                        line : opts.axis.xline
                    },
                    y : {
                        type : "range",
                        domain : (opts.axis.domain != null) ? opts.axis.domain : axis_domain,
                        step : opts.axis.ystep,
                        line : opts.axis.yline
                    },
                    buffer: opts.period * 60
                }
            }, getOptions(this)));

            // 초기값 세팅
            if(opts.axis.data.length > 0) {
                this.update(opts.axis.data);
            }

            // 그리드 러닝
            this.start();
        }

        this.update = function(data) {
            dataList = data;
            this.chart.update(dataList);
        }

        this.clear = function() {
            dataList = [];
            this.chart.update([]);
        }

        this.reset = function() {
            this.clear();
            this.stop();
        }

        this.append = function(data) {
            var newData = data;

            if(!_.typeCheck("array", data)) {
                newData = [ data ];
            }

            dataList = dataList.concat(newData);
        }

        this.start = function() {
            if(interval != null) return;

            var self = this;
            interval = setInterval(function () {
                runningChart(self);
            }, this.options.interval * 1000);
        }

        this.stop = function() {
            if(interval == null) return;

            clearInterval(interval);
            interval = null;
        }
    }

    UI.setup = function() {
        return {
            width : "100%",		// chart 기본 넓이
            height : "100%",		// chart 기본 높이

            // style
            padding : {
                left : 50 ,
                right : 50,
                bottom : 50,
                top : 50
            },

            // chart
            theme : "jennifer",	// 기본 테마 jennifer
            style : {},
            series : {},
            brush : [],
            widget : [],

            // grid (custom)
            axis : {
                domain : null,
                format : "hh:mm",
                key : "time",
                xstep : 1, // x축 분 간격
                ystep : 10,
                xline : true,
                yline : true,
                data : []
            },

            // realtime
            interval : 1, // 초
            period : 5 // 분
        }
    }

    return UI;
});