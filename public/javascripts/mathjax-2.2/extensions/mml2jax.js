/*
 *  /MathJax/extensions/mml2jax.js
 *  
 *  Copyright (c) 2009-2013 The MathJax Consortium
 *
 *  Part of the MathJax library.
 *  See http://www.mathjax.org for details.
 * 
 *  Licensed under the Apache License, Version 2.0;
 *  you may not use this file except in compliance with the License.
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 */

MathJax.Extension.mml2jax={version:"2.2",config:{ignoreClass:"mml2jax_ignore",preview:"alttext"},MMLnamespace:"http://www.w3.org/1998/Math/MathML",PreProcess:function(e){if(!this.configured){this.config=MathJax.Hub.CombineConfig("mml2jax",this.config);if(this.config.Augment){MathJax.Hub.Insert(this,this.config.Augment)}this.InitBrowser();this.configured=true}if(typeof(e)==="string"){e=document.getElementById(e)}if(!e){e=document.body}this.ProcessMathArray(e.getElementsByTagName("math"));if(e.getElementsByTagNameNS){this.ProcessMathArray(e.getElementsByTagNameNS(this.MMLnamespace,"math"))}var d,b;if(typeof(document.namespaces)!=="undefined"){try{for(d=0,b=document.namespaces.length;d<b;d++){var f=document.namespaces[d];if(f.urn===this.MMLnamespace){this.ProcessMathArray(e.getElementsByTagName(f.name+":math"))}}}catch(g){}}else{var c=document.getElementsByTagName("html")[0];if(c){for(d=0,b=c.attributes.length;d<b;d++){var a=c.attributes[d];if(a.nodeName.substr(0,6)==="xmlns:"&&a.nodeValue===this.MMLnamespace){this.ProcessMathArray(e.getElementsByTagName(a.nodeName.substr(6)+":math"))}}}}},ProcessMathArray:function(d){if(!d.length){return}if(!this.ignoreClass){this.ignoreClass=new RegExp("(^| )("+this.config.ignoreClass+")( |$)")}for(var c=d.length-1;c>=0;c--){var b=d[c];var a=b.className||b.getAttribute("class")||"";if(this.ignoreClass.exec(a)){continue}if(this.MathTagBug&&b.nodeName==="MATH"){this.ProcessMathFlattened(b)}else{this.ProcessMath(b)}}},ProcessMath:function(e){var d=e.parentNode;var a=document.createElement("script");a.type="math/mml";d.insertBefore(a,e);if(this.AttributeBug){var b=this.OuterHTML(e);if(this.CleanupHTML){b=b.replace(/<\?import .*?>/i,"").replace(/<\?xml:namespace .*?\/>/i,"");b=b.replace(/&nbsp;/g,"&#xA0;")}MathJax.HTML.setScript(a,b);d.removeChild(e)}else{var c=MathJax.HTML.Element("span");c.appendChild(e);MathJax.HTML.setScript(a,c.innerHTML)}if(this.config.preview!=="none"){this.createPreview(e,a)}},ProcessMathFlattened:function(f){var d=f.parentNode;var b=document.createElement("script");b.type="math/mml";d.insertBefore(b,f);var c="",e,a=f;while(f&&f.nodeName!=="/MATH"){e=f;f=f.nextSibling;c+=this.NodeHTML(e);e.parentNode.removeChild(e)}if(f&&f.nodeName==="/MATH"){f.parentNode.removeChild(f)}b.text=c+"</math>";if(this.config.preview!=="none"){this.createPreview(a,b)}},NodeHTML:function(e){var c,b,a;if(e.nodeName==="#text"){c=this.quoteHTML(e.nodeValue)}else{if(e.nodeName==="#comment"){c="<!--"+e.nodeValue+"-->"}else{c="<"+e.nodeName.toLowerCase();for(b=0,a=e.attributes.length;b<a;b++){var d=e.attributes[b];if(d.specified){c+=" "+d.nodeName.toLowerCase().replace(/xmlns:xmlns/,"xmlns")+"=";var f=d.nodeValue;if(f==null&&d.nodeName==="style"&&e.style){f=e.style.cssText}c+='"'+this.quoteHTML(f)+'"'}}c+=">";if(e.outerHTML!=null&&e.outerHTML.match(/(.<\/[A-Z]+>|\/>)$/)){for(b=0,a=e.childNodes.length;b<a;b++){c+=this.OuterHTML(e.childNodes[b])}c+="</"+e.nodeName.toLowerCase()+">"}}}return c},OuterHTML:function(d){if(d.nodeName.charAt(0)==="#"){return this.NodeHTML(d)}if(!this.AttributeBug){return d.outerHTML}var c=this.NodeHTML(d);for(var b=0,a=d.childNodes.length;b<a;b++){c+=this.OuterHTML(d.childNodes[b])}c+="</"+d.nodeName.toLowerCase()+">";return c},quoteHTML:function(a){if(a==null){a=""}return a.replace(/&/g,"&#x26;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")},createPreview:function(b,a){var c=this.config.preview;if(c==="none"){return}if(c==="alttext"){var d=b.getAttribute("alttext");if(d!=null){c=[this.filterPreview(d)]}else{c=null}}if(c){c=MathJax.HTML.Element("span",{className:MathJax.Hub.config.preRemoveClass},c);a.parentNode.insertBefore(c,a)}},filterPreview:function(a){return a},InitBrowser:function(){var b=MathJax.HTML.Element("span",{id:"<",className:"mathjax",innerHTML:"<math><mi>x</mi><mspace /></math>"});var a=b.outerHTML||"";this.AttributeBug=a!==""&&!(a.match(/id="&lt;"/)&&a.match(/class="mathjax"/)&&a.match(/<\/math>/));this.MathTagBug=b.childNodes.length>1;this.CleanupHTML=MathJax.Hub.Browser.isMSIE}};MathJax.Hub.Register.PreProcessor(["PreProcess",MathJax.Extension.mml2jax]);MathJax.Ajax.loadComplete("[MathJax]/extensions/mml2jax.js");
