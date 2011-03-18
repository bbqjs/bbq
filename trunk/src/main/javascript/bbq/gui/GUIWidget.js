include(bbq.lang.Delegator);

/**
 * This class is used as a base for all objects that have GUI representations.
 * 
 * The rootNode property is a DOM node that is attached to the DOM tree after the object is 
 * created via the appendTo method.
 * @class bbq.gui.GUIWidget
 * @extends bbq.lang.Watchable
 */
bbq.gui.GUIWidget = new Class.create(bbq.lang.Delegator, {
	rootNode: null,
	parentNode: null,
	childWidgets: null,
	
	/**
	 * This method should always be called explicitly by child classes.
	 * 
	 * Child classes should use the constructor to populate the rootNode variable and then call this.registerObject()
	 * @param	Object	An options object
	 * @example
	 * Supports the following options:
	 * 
	 * options {
	 * 		attributes: Object				// associative array of attributes to apply to the root node when it is set via setRootNode
	 * }
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("div");
		this.childWidgets = [];
	},
	
	/**
	 * This method should be overridden by child classes and called explicitly by the overriding method if they make use of the 
	 * childWidgets array, which they should, haha.
	 * 
	 * The idea of the method is to create a DOM node tree representation of the widget.  The root node of the tree should be 
	 * this.rootNode.  The presence of any other nodes in the DOM tree should not be relied upon.
	 * 
	 * This method will be called before the node tree is added to the main document tree (in a similar way to off-screen buffering
	 * in graphics programming) and may be called at seeming arbitrary times.  Consequently it should always create a 
	 * representation of the widget/object in it's current state but at the same time, not rely on any other portion of the DOM tree 
	 * existing.
	 */
	render: function() {
		this.childWidgets.each(function(widget) {
			if(widget.render) {
				widget.render();
			}
		});
	},
	
	/**
	 * Sets the root node and registers this object for retrieval from the root node.
	 * 
	 * This object can then be retrieved by calling owner() on the dom node passed as the argument to this method.
	 * 
	 * @param	{Node}	rootNode
	 * @example
	 * So, for example:
	 * 
	 * <code>
	 * proxim.gui.TextField = new Class.create();
	 * 
	 * Object.extend(proxim.gui.TextField.prototype, bbq.gui.GUIWidget.prototype);
	 * 
	 * proxim.gui.TextField.prototype.initialize: function(controller, htmlID)
	 *   {
	 *   var parentMethod = initialize;
	 *   parentMethod.apply(this, arguments);
	 *   this.setRootNode(document.createElement("input"));
	 *   this.setID(htmlID);
	 *   }
	 * 
	 * ...
	 * 
	 * var foo = proxim.gui.TextField(this.controller, "exampleObject");
	 * foo.appendTo(document.getElementsByTagName("body")[0]);
	 * 
	 * ...
	 * 
	 * var bar = document.getElementById("exampleObject");
	 * var foo = bar.owner();
	 * </code>
	 * 
	 */
	setRootNode: function(rootNode) {
		if(this.rootNode) {
			var oldNode = this.rootNode;
		}
		
		if(Object.isString(rootNode)) {
			this.rootNode = document.createElement(rootNode);
		} else {
			this.rootNode = rootNode;
		}
		
		if(oldNode && oldNode.className) {
			this.addClass(oldNode.className.split(" "));
		}
		
		if(this.options && this.options.attributes) {
			var attr = this.options.attributes;
			for(var key in attr) {
				this.setAttribute(key, attr[key]);
			}
		}
		
		this.rootNode = $(this.rootNode);
		this.registerObject();
	},
	
	getRootNode: function() {
		return this.rootNode;
	},
	
	/**
	 * Sets a reference to this object on the rootNode DOM node.  This allows us to take a DOM node from the document tree and 
	 * get the GUIWidget object of which it is the root node.
	 * 
	 * See setRootNode() for more information
	 */
	registerObject: function() {
		if(this.rootNode) {
			this.rootNode.owner = function() {
				return this;
			}.bind(this);
		}
	},
	
	/**
	 * Removes all nodes attached to this GUIWidgets rootNode
	 */
	empty: function() {
		if(this.rootNode) {
			DOMUtil.emptyNode(this.rootNode);
		}
	},
	
	/**
	 * Adds a class to the root node
	 *
	  * @param	{String}	className	The name of the class to add
	 */
	addClass: function(className) {
		DOMUtil.addClass(this.rootNode, className);
	},
	
	/**
	 * Removes a class from the root node
	 * 
	 * @param	{String}	className	The name of the class to remove
	 */
	removeClass: function(className, recursively) {
		DOMUtil.removeClass(this.rootNode, className, recursively);
	},
	
	/**
	 * Attaches the root node to the passed node
	 * 
	 * @param	{Node}	pageNode	The node to attach the root node to
	 */
	appendTo: function(pageNode) {
		try {
			if(pageNode) {
				pageNode = this._getNode(pageNode);
				pageNode.appendChild(this.getRootNode());
				this.parentNode = pageNode;
			}
			
			this.render();
		} catch(e) {
			Log.dumpException(e);
		}
	},
	
	/**
	 * Adds a node or GUIWidget to the root node of this element
	 * 
	 * @param	{Mixed}	childNode	A Node, GUIWidget or array of Node and/or GUIWidget objects
	 */
	appendChild: function(childNode) {
		if(!childNode) {
			return;
		}
		
		if(childNode instanceof Array) {
			childNode.each(function(node) {
				this.appendChild(node);
			}.bind(this));
		} else {
			if(childNode && this.rootNode) {
				if(childNode.appendTo instanceof Function) {
					childNode.appendTo(this.rootNode);
					this.childWidgets.push(childNode);
				} else if(childNode.toUpperCase instanceof Function) {
					this.rootNode.appendChild(document.createTextNode(childNode));
				} else {
					this.rootNode.appendChild(childNode);
				}
			}
		}
		
		return childNode;
	},
	
	/**
	 * Attempts to remove the passed node if it is a child of this.rootNode
	 * 
	 * The passed argument can be either a DOM Node object, or a GUIWidget object.
	 * 
	 * @param	{Mixed}	A child node
	 */
	removeChild: function(childNode) {
		if(childNode && this.getRootNode()) {
			try {
				if(childNode.getRootNode instanceof Function) {
					this.getRootNode().removeChild(childNode.getRootNode());
					this.childWidgets.without(childNode);
				} else {
					this.getRootNode().removeChild(childNode);
				}
			} catch(e) {
				Log.dumpException(e);
			}
		}
	},
	
	/**
	 * Replaces a DOM node or GUIWidget that is a child of the root node of this object
	 * 
	 * @param	{Node || GUIWidget}		oldNode		The outgoing child
	 * @param	{Node || GUIWidget}		newNode		The incoming child
	 */
	replaceChild: function(oldNode, newNode) {
		if(oldNode && newNode && this.getRootNode()) {
			try {
				if((oldNode.getRootNode instanceof Function) && (newNode.getRootNode instanceof Function)) { // GUIWidgets
					// find old widget
					var oldNodeIndex = this.childWidgets.indexOf(oldNode);
					if(oldNodeIndex != -1) {
						this.childWidgets[oldNodeIndex] = newNode;
					} else { // trying to replace a widget that does not exist
						Log.warn("Old node not found in childWidgets array during replace operation");
						this.childWidgets.push(newNode);
					}
				}
				
				if(oldNode.getRootNode instanceof Function) {
					oldNode = oldNode.getRootNode();
				}
				
				if(newNode.getRootNode instanceof Function) {
					newNode = newNode.getRootNode();
				}
				
				// check that we actually contain the old node before attempting to replace it
				if(Element.descendantOf(oldNode, this.getRootNode())) {
					this.getRootNode().replaceChild(newNode, oldNode);
				}
				
			} catch(e) {
				Log.dumpException(e);
			}
		}
	},
	
	/**
	 * Sets the id attribute on the root node
	 * 
	 * @param	{string}	id
	 */
	setID: function(id) {
		this.setAttribute("id", id);
	},
	
	/**
	 * Returns the id of the root node
	 * 
	 * @return	{string}
	 */
	getID: function() {
		this.getAttribute("id");
	},
	
	/**
	 * Sets a CSS style property to the passed value on the root node
	 * 
	 * @param	{string}	styleName	e.g. "border"
	 * @param	{string}	styleValue	e.g. "1px solid #CCC"
	 */
	setStyle: function(styleName, styleValue) {
		if(this.rootNode && styleName && styleValue && this.rootNode.style) {
			try {
				if(this.rootNode.style[styleName] != styleValue) {
					this.rootNode.style[styleName] = styleValue;
				}
			} catch(e) {
				Log.dumpException(e);
			}
		}
	},
	
	/**
	 * Returns the requested CSS style property
	 * 
	 * @param	{string}	styleName	e.g. "font"
	 * @return	{string}
	 */
	getStyle: function(styleName) {
		if(this.rootNode) {
			return this.rootNode.getStyle(styleName);
		}
	},
	
	/**
	 * Sets an attribute on the root node
	 * 
	 * @param	{String}	attributeName	e.g. "id"
	 * @param	{String}	attributeValue	e.g. "anElement"
	 */
	setAttribute: function(attributeName, attributeValue) {
		if(this.rootNode) {
			try {
				if(attributeName == "style" && attributeValue instanceof Object) {
					for(var key in attributeValue) {
						this.setStyle(key, attributeValue[key]);
					}
				} else if(this.rootNode[attributeName] != attributeValue) {
					this.rootNode[attributeName] = attributeValue;
				}
			} catch(e) {
				Log.error("exeption thrown setting " + attributeName + " to " + attributeValue);
				Log.dumpException(e);
			}
		}
	},
	
	/**
	 * Returns the requested attribute from the root node
	 * 
	 * @param	{String}	attributeName	e.g. "id"
	 * @return	{String}
	 */
	getAttribute: function(attributeName) {
		if(this.rootNode) {
			return this.rootNode[attributeName];
		}
	},
	
	/**
	 * Returns whether or not the root node of this object is of the passed CSS class
	 * 
	 * @return boolean
	 */
	isClass: function(className) {
		return DOMUtil.hasClass(this.getRootNode(), className);
	},
	
	/**
	 * @return void
	 */
	resize: function() {
		this.notifyListeners("onResize");
	},
	
	_sizeScrollable: function(scrollable, dim, maxSize) {
		if(scrollable && scrollable.parentNode) {
			scrollable.owner().triggerEvent("onWillResize");
			var nodeList = $A(scrollable.parentNode.childNodes);
			
			nodeList.each(function(node){
				if(node && node != scrollable) {
						var dims = Element.getDimensions(node);
						maxSize = maxSize - dims[dim];
				}
			});
			
			scrollable.style[dim] = maxSize + "px";
			scrollable.owner().triggerEvent("onResize");
		}
	},
	
	/**
	 * Makes the passed node the first child of this object.
	 * 
	 * @param {Object} A GUIWidget or DOM Node
	 */
	insertAtTop: function(newNode) {
		this.getRootNode().insertBefore(this._getNode(newNode), this.getRootNode().firstChild);
	},
	
	/**
	 * Inserts the first passed node before the second.
	 * 
	 * @param {Object} A GUIWidget or DOM Node
	 * @param {Object} A GUIWidget or DOM Node - should be a child of this element
	 */
	insertBefore: function(newNode, referenceNode) {
		this.getRootNode().insertBefore(this._getNode(newNode), this._getNode(referenceNode));
	},
	
	/**
	 * Gets the DOM node from a GUIWidget
	 * 
	 * @param {Object} A GUIWidget or DOM Node
	 * @return {Node}
	 */
	_getNode: function(fromNode) {
		if(fromNode) {
			if(fromNode.getRootNode instanceof Function) {
				return fromNode.getRootNode();
			} else if(fromNode.appendChild) {
				return fromNode;
			}
		}
		
		Log.error("Invalid node!");
	},
	
	focus: function() {
		this.getRootNode().focus();
	},
	
	blur: function() {
		this.getRootNode().blur();
	}
});
