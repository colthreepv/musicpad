 // Backbone.Marionette, v1.0.0-rc5
 // Copyright (c)2013 Derick Bailey, Muted Solutions, LLC.
 // Distributed under MIT license
 // http://github.com/marionettejs/backbone.marionette


/*!
 * Includes BabySitter
 * https://github.com/marionettejs/backbone.babysitter/
 *
 * Includes Wreqr
 * https://github.com/marionettejs/backbone.wreqr/
 */


Backbone.ChildViewContainer=function(e,t){var n=function(e){this._views={},this._indexByModel={},this._indexByCollection={},this._indexByCustom={},this._updateLength(),this._addInitialViews(e)};t.extend(n.prototype,{add:function(e,t){var n=e.cid;this._views[n]=e,e.model&&(this._indexByModel[e.model.cid]=n),e.collection&&(this._indexByCollection[e.collection.cid]=n),t&&(this._indexByCustom[t]=n),this._updateLength()},findByModel:function(e){var t=this._indexByModel[e.cid];return this.findByCid(t)},findByCollection:function(e){var t=this._indexByCollection[e.cid];return this.findByCid(t)},findByCustom:function(e){var t=this._indexByCustom[e];return this.findByCid(t)},findByIndex:function(e){return t.values(this._views)[e]},findByCid:function(e){return this._views[e]},remove:function(e){var t=e.cid;e.model&&delete this._indexByModel[e.model.cid],e.collection&&delete this._indexByCollection[e.collection.cid];var n;for(var r in this._indexByCustom)if(this._indexByCustom.hasOwnProperty(r)&&this._indexByCustom[r]===t){n=r;break}n&&delete this._indexByCustom[n],delete this._views[t],this._updateLength()},call:function(e,t){t=Array.prototype.slice.call(arguments,1),this.apply(e,t)},apply:function(e,n){var r;n=n||[],t.each(this._views,function(r,i){t.isFunction(r[e])&&r[e].apply(r,n)})},_updateLength:function(){this.length=t.size(this._views)},_addInitialViews:function(e){if(!e)return;var t,n,r=e.length;for(n=0;n<r;n++)t=e[n],this.add(t)}});var r=["forEach","each","map","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","toArray","first","initial","rest","last","without","isEmpty","pluck"];return t.each(r,function(e){n.prototype[e]=function(){var n=t.values(this._views),r=[n].concat(t.toArray(arguments));return t[e].apply(t,r)}}),n}(Backbone,_),Backbone.Wreqr=function(e,t,n){"use strict";var r={};return r.Handlers=function(e,t){var n=function(){this._handlers={}};return n.extend=e.Model.extend,t.extend(n.prototype,{addHandler:function(e,t,n){var r={callback:t,context:n};this._handlers[e]=r},getHandler:function(e){var t=this._handlers[e];if(!t)throw new Error("Handler not found for '"+e+"'");return function(){var e=Array.prototype.slice.apply(arguments);return t.callback.apply(t.context,e)}},removeHandler:function(e){delete this._handlers[e]},removeAllHandlers:function(){this._handlers={}}}),n}(e,n),r.Commands=function(e){return e.Handlers.extend({execute:function(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);this.getHandler(e).apply(this,t)}})}(r),r.RequestResponse=function(e){return e.Handlers.extend({request:function(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return this.getHandler(e).apply(this,t)}})}(r),r.EventAggregator=function(e,t){var n=function(){};return n.extend=e.Model.extend,t.extend(n.prototype,e.Events),n}(e,n),r}(Backbone,Backbone.Marionette,_);var Marionette=function(e,t,n){"use strict";var r={};e.Marionette=r;var i=Array.prototype.slice;return r.extend=e.Model.extend,r.getOption=function(e,t){if(!e||!t)return;var n;return e.options&&t in e.options&&e.options[t]!==undefined?n=e.options[t]:n=e[t],n},r.createObject=function(){function t(){}var e;return typeof Object.create=="function"?e=Object.create:e=function(e){t.prototype=e;var n=new t;return t.prototype=null,n},e}(),r.triggerMethod=function(){var e=Array.prototype.slice.apply(arguments),n=e[0],r=n.split(":"),i,s,o="on";for(var u=0;u<r.length;u++)i=r[u],s=i.charAt(0).toUpperCase(),o+=s+i.slice(1);this.trigger.apply(this,e);if(t.isFunction(this[o]))return e.shift(),this[o].apply(this,e)},r.MonitorDOMRefresh=function(){function e(e){e._isShown=!0,r(e)}function n(e){e._isRendered=!0,r(e)}function r(e){e._isShown&&e._isRendered&&t.isFunction(e.triggerMethod)&&e.triggerMethod("dom:refresh")}return function(t){t.listenTo(t,"show",function(){e(t)}),t.listenTo(t,"render",function(){n(t)})}}(),function(e){function n(e,n,r,i){var s=i.split(/\s+/);t.each(s,function(t){var i=e[t];if(!i)throw new Error("Method '"+t+"' was configured as an event handler, but does not exist.");e.listenTo(n,r,i,e)})}function r(e,t,n,r){e.listenTo(t,n,r,e)}function i(e,n,r,i){var s=i.split(/\s+/);t.each(s,function(t){var i=e[i];e.stopListening(n,r,i,e)})}function s(e,t,n,r){e.stopListening(t,n,r,e)}function o(e,n,r,i,s){if(!n||!r)return;t.isFunction(r)&&(r=r.call(e)),t.each(r,function(r,o){t.isFunction(r)?i(e,n,o,r):s(e,n,o,r)})}e.bindEntityEvents=function(e,t,i){o(e,t,i,r,n)},e.unbindEntityEvents=function(e,t,n){o(e,t,n,s,i)}}(r),r.Callbacks=function(){this._deferred=n.Deferred(),this._callbacks=[]},t.extend(r.Callbacks.prototype,{add:function(e,t){this._callbacks.push({cb:e,ctx:t}),this._deferred.done(function(n,r){t&&(n=t),e.call(n,r)})},run:function(e,t){this._deferred.resolve(t,e)},reset:function(){var e=this,r=this._callbacks;this._deferred=n.Deferred(),this._callbacks=[],t.each(r,function(t){e.add(t.cb,t.ctx)})}}),r.Controller=function(e){this.triggerMethod=r.triggerMethod,this.options=e||{},t.isFunction(this.initialize)&&this.initialize(this.options)},r.Controller.extend=r.extend,t.extend(r.Controller.prototype,e.Events,{close:function(){this.stopListening(),this.triggerMethod("close"),this.unbind()}}),r.Region=function(e){this.options=e||{},this.el=r.getOption(this,"el");if(!this.el){var t=new Error("An 'el' must be specified for a region.");throw t.name="NoElError",t}if(this.initialize){var n=Array.prototype.slice.apply(arguments);this.initialize.apply(this,n)}},t.extend(r.Region,{buildRegion:function(e,t){var n=typeof e=="string",r=typeof e.selector=="string",i=typeof e.regionType=="undefined",s=typeof e=="function";if(!s&&!n&&!r)throw new Error("Region must be specified as a Region type, a selector string or an object with selector property");var o,u;n&&(o=e),e.selector&&(o=e.selector),s&&(u=e),!s&&i&&(u=t),e.regionType&&(u=e.regionType);var a=new u({el:o});return a}}),t.extend(r.Region.prototype,e.Events,{show:function(e){this.ensureEl(),this.close(),e.render(),this.open(e),r.triggerMethod.call(e,"show"),r.triggerMethod.call(this,"show",e),this.currentView=e},ensureEl:function(){if(!this.$el||this.$el.length===0)this.$el=this.getEl(this.el)},getEl:function(e){return n(e)},open:function(e){this.$el.empty().append(e.el)},close:function(){var e=this.currentView;if(!e||e.isClosed)return;e.close&&e.close(),r.triggerMethod.call(this,"close"),delete this.currentView},attachView:function(e){this.currentView=e},reset:function(){this.close(),delete this.$el}}),r.Region.extend=r.extend,r.TemplateCache=function(e){this.templateId=e},t.extend(r.TemplateCache,{templateCaches:{},get:function(e){var t=this,n=this.templateCaches[e];return n||(n=new r.TemplateCache(e),this.templateCaches[e]=n),n.load()},clear:function(){var e,t=Array.prototype.slice.apply(arguments),n=t.length;if(n>0)for(e=0;e<n;e++)delete this.templateCaches[t[e]];else this.templateCaches={}}}),t.extend(r.TemplateCache.prototype,{load:function(){var e=this;if(this.compiledTemplate)return this.compiledTemplate;var t=this.loadTemplate(this.templateId);return this.compiledTemplate=this.compileTemplate(t),this.compiledTemplate},loadTemplate:function(e){var t=n(e).html();if(!t||t.length===0){var r="Could not find template: '"+e+"'",i=new Error(r);throw i.name="NoTemplateError",i}return t},compileTemplate:function(e){return t.template(e)}}),r.Renderer={render:function(e,t){var n=typeof e=="function"?e:r.TemplateCache.get(e),i=n(t);return i}},r.View=e.View.extend({constructor:function(){t.bindAll(this,"render");var n=Array.prototype.slice.apply(arguments);e.View.prototype.constructor.apply(this,n),r.MonitorDOMRefresh(this),this.listenTo(this,"show",this.onShowCalled,this)},triggerMethod:r.triggerMethod,getTemplate:function(){return r.getOption(this,"template")},mixinTemplateHelpers:function(e){e=e||{};var n=this.templateHelpers;return t.isFunction(n)&&(n=n.call(this)),t.extend(e,n)},configureTriggers:function(){if(!this.triggers)return;var e=this,n={},r=t.result(this,"triggers");return t.each(r,function(t,r){n[r]=function(n){n&&n.preventDefault&&n.preventDefault(),n&&n.stopPropagation&&n.stopPropagation();var r={view:this,model:this.model,collection:this.collection};e.triggerMethod(t,r)}}),n},delegateEvents:function(e){this._delegateDOMEvents(e),r.bindEntityEvents(this,this.model,r.getOption(this,"modelEvents")),r.bindEntityEvents(this,this.collection,r.getOption(this,"collectionEvents"))},_delegateDOMEvents:function(n){n=n||this.events,t.isFunction(n)&&(n=n.call(this));var r={},i=this.configureTriggers();t.extend(r,n,i),e.View.prototype.delegateEvents.call(this,r)},undelegateEvents:function(){var t=Array.prototype.slice.call(arguments);e.View.prototype.undelegateEvents.apply(this,t),r.unbindEntityEvents(this,this.model,r.getOption(this,"modelEvents")),r.unbindEntityEvents(this,this.collection,r.getOption(this,"collectionEvents"))},onShowCalled:function(){},close:function(){if(this.isClosed)return;var e=this.triggerMethod("before:close");if(e===!1)return;this.isClosed=!0,this.triggerMethod("close"),this.remove()},bindUIElements:function(){if(!this.ui)return;var e=this;this.uiBindings||(this.uiBindings=t.result(this,"ui")),this.ui={},t.each(t.keys(this.uiBindings),function(t){var n=e.uiBindings[t];e.ui[t]=e.$(n)})}}),r.ItemView=r.View.extend({constructor:function(){var e=Array.prototype.slice.apply(arguments);r.View.prototype.constructor.apply(this,e)},serializeData:function(){var e={};return this.model?e=this.model.toJSON():this.collection&&(e={items:this.collection.toJSON()}),e},render:function(){this.isClosed=!1,this.triggerMethod("before:render",this),this.triggerMethod("item:before:render",this);var e=this.serializeData();e=this.mixinTemplateHelpers(e);var t=this.getTemplate(),n=r.Renderer.render(t,e);return this.$el.html(n),this.bindUIElements(),this.triggerMethod("render",this),this.triggerMethod("item:rendered",this),this},close:function(){if(this.isClosed)return;this.triggerMethod("item:before:close");var e=Array.prototype.slice.apply(arguments);r.View.prototype.close.apply(this,e),this.triggerMethod("item:closed")}}),r.CollectionView=r.View.extend({itemViewEventPrefix:"itemview",constructor:function(e){this._initChildViewStorage();var t=Array.prototype.slice.apply(arguments);r.View.prototype.constructor.apply(this,t),this._initialEvents()},_initialEvents:function(){this.collection&&(this.listenTo(this.collection,"add",this.addChildView,this),this.listenTo(this.collection,"remove",this.removeItemView,this),this.listenTo(this.collection,"reset",this.render,this))},addChildView:function(e,t,n){this.closeEmptyView();var r=this.getItemView(e),i=this.collection.indexOf(e);this.addItemView(e,r,i)},onShowCalled:function(){this.children.each(function(e){r.triggerMethod.call(e,"show")})},triggerBeforeRender:function(){this.triggerMethod("before:render",this),this.triggerMethod("collection:before:render",this)},triggerRendered:function(){this.triggerMethod("render",this),this.triggerMethod("collection:rendered",this)},render:function(){return this.isClosed=!1,this.triggerBeforeRender(),this.closeEmptyView(),this.closeChildren(),this.collection&&this.collection.length>0?this.showCollection():this.showEmptyView(),this.triggerRendered(),this},showCollection:function(){var e=this,t;this.collection.each(function(n,r){t=e.getItemView(n),e.addItemView(n,t,r)})},showEmptyView:function(){var t=r.getOption(this,"emptyView");if(t&&!this._showingEmptyView){this._showingEmptyView=!0;var n=new e.Model;this.addItemView(n,t,0)}},closeEmptyView:function(){this._showingEmptyView&&(this.closeChildren(),delete this._showingEmptyView)},getItemView:function(e){var t=r.getOption(this,"itemView");if(!t){var n=new Error("An `itemView` must be specified");throw n.name="NoItemViewError",n}return t},addItemView:function(e,n,i){var s=this,o=r.getOption(this,"itemViewOptions");t.isFunction(o)&&(o=o.call(this,e));var u=this.buildItemView(e,n,o);this.addChildViewEventForwarding(u),this.triggerMethod("before:item:added",u),this.children.add(u),this.renderItemView(u,i),this._isShown&&r.triggerMethod.call(u,"show"),this.triggerMethod("after:item:added",u)},addChildViewEventForwarding:function(e){var t=r.getOption(this,"itemViewEventPrefix");this.listenTo(e,"all",function(){var n=i.call(arguments);n[0]=t+":"+n[0],n.splice(1,0,e),r.triggerMethod.apply(this,n)},this)},renderItemView:function(e,t){e.render(),this.appendHtml(this,e,t)},buildItemView:function(e,n,r){var i=t.extend({model:e},r),s=new n(i);return s},removeItemView:function(e){var t=this.children.findByModel(e);this.removeChildView(t),this.checkEmpty()},removeChildView:function(e){e&&(this.stopListening(e),e.close&&e.close(),this.children.remove(e)),this.triggerMethod("item:removed",e)},checkEmpty:function(){(!this.collection||this.collection.length===0)&&this.showEmptyView()},appendHtml:function(e,t,n){e.$el.append(t.el)},_initChildViewStorage:function(){this.children=new e.ChildViewContainer},close:function(){if(this.isClosed)return;this.triggerMethod("collection:before:close"),this.closeChildren(),this.triggerMethod("collection:closed");var e=Array.prototype.slice.apply(arguments);r.View.prototype.close.apply(this,e)},closeChildren:function(){this.children.each(function(e){this.removeChildView(e)},this),this.checkEmpty()}}),r.CompositeView=r.CollectionView.extend({constructor:function(e){var t=Array.prototype.slice.apply(arguments);r.CollectionView.apply(this,t),this.itemView=this.getItemView()},_initialEvents:function(){this.collection&&(this.listenTo(this.collection,"add",this.addChildView,this),this.listenTo(this.collection,"remove",this.removeItemView,this),this.listenTo(this.collection,"reset",this.renderCollection,this))},getItemView:function(e){var t=r.getOption(this,"itemView")||this.constructor;if(!t){var n=new Error("An `itemView` must be specified");throw n.name="NoItemViewError",n}return t},serializeData:function(){var e={};return this.model&&(e=this.model.toJSON()),e},render:function(){this.isClosed=!1,this.resetItemViewContainer();var e=this.renderModel();return this.$el.html(e),this.bindUIElements(),this.triggerMethod("composite:model:rendered"),this.renderCollection(),this.triggerMethod("composite:rendered"),this},renderCollection:function(){var e=Array.prototype.slice.apply(arguments);r.CollectionView.prototype.render.apply(this,e),this.triggerMethod("composite:collection:rendered")},renderModel:function(){var e={};e=this.serializeData(),e=this.mixinTemplateHelpers(e);var t=this.getTemplate();return r.Renderer.render(t,e)},appendHtml:function(e,t){var n=this.getItemViewContainer(e);n.append(t.el)},getItemViewContainer:function(e){if("$itemViewContainer"in e)return e.$itemViewContainer;var n;if(e.itemViewContainer){var r=t.result(e,"itemViewContainer");n=e.$(r);if(n.length<=0){var i=new Error("The specified `itemViewContainer` was not found: "+e.itemViewContainer);throw i.name="ItemViewContainerMissingError",i}}else n=e.$el;return e.$itemViewContainer=n,n},resetItemViewContainer:function(){this.$itemViewContainer&&delete this.$itemViewContainer}}),r.Layout=r.ItemView.extend({regionType:r.Region,constructor:function(){this._firstRender=!0,this.initializeRegions();var e=Array.prototype.slice.apply(arguments);r.ItemView.apply(this,e)},render:function(){this._firstRender?this._firstRender=!1:(this.closeRegions(),this.reInitializeRegions());var e=Array.prototype.slice.apply(arguments),t=r.ItemView.prototype.render.apply(this,e);return t},close:function(){if(this.isClosed)return;this.closeRegions(),this.destroyRegions();var e=Array.prototype.slice.apply(arguments);r.ItemView.prototype.close.apply(this,e)},initializeRegions:function(){this.regionManagers||(this.regionManagers={});var e=this,n=this.regions||{};t.each(n,function(t,n){var i=r.Region.buildRegion(t,e.regionType);i.getEl=function(t){return e.$(t)},e.regionManagers[n]=i,e[n]=i})},reInitializeRegions:function(){this.regionManagers&&t.size(this.regionManagers)===0?this.initializeRegions():t.each(this.regionManagers,function(e){e.reset()})},closeRegions:function(){var e=this;t.each(this.regionManagers,function(e,t){e.close()})},destroyRegions:function(){var e=this;t.each(this.regionManagers,function(t,n){delete e[n]}),this.regionManagers={}}}),r.AppRouter=e.Router.extend({constructor:function(t){var n=Array.prototype.slice.apply(arguments);e.Router.prototype.constructor.apply(this,n),this.options=t;if(this.appRoutes){var i=r.getOption(this,"controller");this.processAppRoutes(i,this.appRoutes)}},processAppRoutes:function(e,n){var r,i,s,o,u,a=[],f=this;for(s in n)n.hasOwnProperty(s)&&a.unshift([s,n[s]]);o=a.length;for(u=0;u<o;u++){s=a[u][0],i=a[u][1],r=e[i];if(!r){var l="Method '"+i+"' was not found on the controller",c=new Error(l);throw c.name="NoMethodError",c}r=t.bind(r,e),f.route(s,i,r)}}}),r.Application=function(n){this.initCallbacks=new r.Callbacks,this.vent=new e.Wreqr.EventAggregator,this.commands=new e.Wreqr.Commands,this.reqres=new e.Wreqr.RequestResponse,this.submodules={},t.extend(this,n),this.triggerMethod=r.triggerMethod},t.extend(r.Application.prototype,e.Events,{execute:function(){var e=Array.prototype.slice.apply(arguments);this.commands.execute.apply(this.commands,e)},request:function(){var e=Array.prototype.slice.apply(arguments);return this.reqres.request.apply(this.reqres,e)},addInitializer:function(e){this.initCallbacks.add(e)},start:function(e){this.triggerMethod("initialize:before",e),this.initCallbacks.run(e,this),this.triggerMethod("initialize:after",e),this.triggerMethod("start",e)},addRegions:function(e){var n=this;t.each(e,function(e,t){var i=r.Region.buildRegion(e,r.Region);n[t]=i})},removeRegion:function(e){this[e].close(),delete this[e]},module:function(e,t){var n=i.call(arguments);return n.unshift(this),r.Module.create.apply(r.Module,n)}}),r.Application.extend=r.extend,r.Module=function(e,t){this.moduleName=e,this.submodules={},this._setupInitializersAndFinalizers(),this.app=t,this.startWithParent=!0,this.triggerMethod=r.triggerMethod},t.extend(r.Module.prototype,e.Events,{addInitializer:function(e){this._initializerCallbacks.add(e)},addFinalizer:function(e){this._finalizerCallbacks.add(e)},start:function(e){if(this._isInitialized)return;t.each(this.submodules,function(t){var n=!0;n=t.startWithParent,n&&t.start(e)}),this.triggerMethod("before:start",e),this._initializerCallbacks.run(e,this),this._isInitialized=!0,this.triggerMethod("start",e)},stop:function(){if(!this._isInitialized)return;this._isInitialized=!1,r.triggerMethod.call(this,"before:stop"),t.each(this.submodules,function(e){e.stop()}),this._finalizerCallbacks.run(undefined,this),this._initializerCallbacks.reset(),this._finalizerCallbacks.reset(),r.triggerMethod.call(this,"stop")},addDefinition:function(e,t){this._runModuleDefinition(e,t)},_runModuleDefinition:function(i,s){if(!i)return;var o=t.flatten([this,this.app,e,r,n,t,s]);i.apply(this,o)},_setupInitializersAndFinalizers:function(){this._initializerCallbacks=new r.Callbacks,this._finalizerCallbacks=new r.Callbacks}}),t.extend(r.Module,{create:function(e,n,r){var s=this,o=e,u=i.apply(arguments);u.splice(0,3),n=n.split(".");var a=n.length,f=[];return f[a-1]=r,t.each(n,function(t,n){var r=o;o=s._getModule(r,t,e),s._addModuleDefinition(r,o,f[n],u)}),o},_getModule:function(e,t,n,i,s){var o=e[t];return o||(o=new r.Module(t,n),e[t]=o,e.submodules[t]=o),o},_addModuleDefinition:function(e,n,r,i){var s,o;t.isFunction(r)?(s=r,o=!0):t.isObject(r)?(s=r.define,o=r.startWithParent):o=!0,s&&n.addDefinition(s,i);var u=n.startWithParent;n.startWithParent=n.startWithParent&&o,n.startWithParent&&!n.startWithParentIsConfigured&&(n.startWithParentIsConfigured=!0,e.addInitializer(function(e){n.startWithParent&&n.start(e)}))}}),r}(Backbone,_,$||window.jQuery||window.Zepto||window.ender);