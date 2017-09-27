;(function(ENV){
//=========================================
// Dependencies provider
//=========================================
// var dp = new Deprovider();
// dp.define(function MessageDispatcher(){
// 	function Dispatcher(){
// 		Events.call(this);
// 		chrome.runtime.onMessage.addListener(function(req, sender, res){
// 			this.trigger(req.action, req, res, sender);
// 			return true;
// 		}.bind(this));
// 	}
// 	Dispatcher.prototype = Object.create(Events.prototype);
// 	Dispatcher.prototype.constructor = Events;
// 	return  Dispatcher;
// });
function DProvider(){
	this.stack = Object.create(null);
	this.dependencies = {};
	this.cache = {};
}
DProvider.prototype = {
	// @param {String} name
	// @param {Array} dependencies
	// @param {Function}
	define: function(dependencies, constructor, name){
		this.stack[name || constructor.name] = constructor;
		
		if(Array.isArray(dependencies)){
			this.dependencies[name || constructor.name] = dependencies;
		}
	},
	require: function(name){
		if(this.cache[name]){
			return this.cache[name];
		}else if(this.stack[name]){
			var 	constr = this.stack[name],
					deps,
					i;

			if(deps = this.dependencies[name]){
				i = deps.length;

				while(i-- > 0){
					deps[i] = this.require(deps[i]);
				}
			}

			return this.cache[name] = constr.apply(null, deps);
		}
	}
};

ENV.DProvider = DProvider;
ENV.DPROVIDER = new DProvider();
}(window))