!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).Alpine=t()}(this,(function(){"use strict";function e(){return navigator.userAgent.includes("Node.js")||navigator.userAgent.includes("jsdom")}function t(e,i,n=!0){if(e.hasAttribute("x-data")&&!n)return;i(e);let a=e.firstElementChild;for(;a;)t(a,i,!1),a=a.nextElementSibling}function i(e,t,i={}){return new Function(["$data",...Object.keys(i)],`var result; with($data) { result = ${e} }; return result`)(t,...Object.values(i))}function n(e,t,i={}){return new Function(["dataContext",...Object.keys(i)],`with(dataContext) { ${e} }`)(t,...Object.values(i))}function a(e){const t=r(e.name);return/x-(on|bind|data|text|html|model|if|show|cloak|transition|ref)/.test(t)}function s(e,t){return Array.from(e.attributes).filter(a).map(e=>{const t=r(e.name),i=t.match(/x-(on|bind|data|text|html|model|if|show|cloak|transition|ref)/),n=t.match(/:([a-zA-Z\-:]+)/),a=t.match(/\.[^.\]]+(?=[^\]]*$)/g)||[];return{type:i?i[1]:null,value:n?n[1]:null,modifiers:a.map(e=>e.replace(".","")),expression:e.value}}).filter(e=>!t||e.type===t)}function r(e){return e.startsWith("@")?e.replace("@","x-on:"):e.startsWith(":")?e.replace(":","x-bind:"):e}function o(e,t,i=!1){i&&t();const n=s(e,"transition");n.length<1&&t(),u(e,(n.find(e=>"enter"===e.value)||{expression:""}).expression.split(" ").filter(e=>""!==e),(n.find(e=>"enter-start"===e.value)||{expression:""}).expression.split(" ").filter(e=>""!==e),(n.find(e=>"enter-end"===e.value)||{expression:""}).expression.split(" ").filter(e=>""!==e),t,()=>{})}function l(e,t,i=!1){i&&t();const n=s(e,"transition");n.length<1&&t(),u(e,(n.find(e=>"leave"===e.value)||{expression:""}).expression.split(" ").filter(e=>""!==e),(n.find(e=>"leave-start"===e.value)||{expression:""}).expression.split(" ").filter(e=>""!==e),(n.find(e=>"leave-end"===e.value)||{expression:""}).expression.split(" ").filter(e=>""!==e),()=>{},t)}function u(e,t,i,n,a,s){e.classList.add(...i),e.classList.add(...t),requestAnimationFrame(()=>{const r=1e3*Number(getComputedStyle(e).transitionDuration.replace("s",""));a(),requestAnimationFrame(()=>{e.classList.remove(...i),e.classList.add(...n),setTimeout(()=>{s(),e.isConnected&&(e.classList.remove(...t),e.classList.remove(...n))},r)})})}class c{constructor(e){this.$el=e;const t=this.$el.getAttribute("x-data"),a=""===t?"{}":t,s=this.$el.getAttribute("x-init"),r=this.$el.getAttribute("x-created"),o=this.$el.getAttribute("x-mounted"),l=i(a,{});var u;this.$data=this.wrapDataInObservable(l),Object.keys(l).forEach(e=>{"function"==typeof l[e]&&(l[e]=l[e].bind(this.$data))}),l.$el=this.$el,l.$refs=this.getRefsProxy(),l.$nextTick=e=>{this.delayRunByATick(e)},this.tickStack=[],this.collectingTickCallbacks=!1,s&&(this.pauseReactivity=!0,u=i(this.$el.getAttribute("x-init"),this.$data),this.pauseReactivity=!1),r&&(console.warn('AlpineJS Warning: "x-created" is deprecated and will be removed in the next major version. Use "x-init" instead.'),this.pauseReactivity=!0,n(this.$el.getAttribute("x-created"),this.$data),this.pauseReactivity=!1),this.initializeElements(),this.listenForNewElementsToInitialize(),"function"==typeof u&&u.call(this.$data),o&&(console.warn('AlpineJS Warning: "x-mounted" is deprecated and will be removed in the next major version. Use "x-init" (with a callback return) for the same behavior.'),n(o,this.$data))}wrapDataInObservable(e){this.concernedData=[];var t=this;const i=e=>({set(i,n,a){const s=e?`${e}.${n}`:n,r=Reflect.set(i,n,a);if(!t.pauseReactivity)return-1===t.concernedData.indexOf(s)&&t.concernedData.push(s),t.refresh(),r},get(t,n){if("isProxy"===n)return!0;if(t[n]&&t[n].isProxy)return t[n];if(t[n]&&t[n]instanceof Node)return t[n];if("object"==typeof t[n]&&null!==t[n]){const a=e?`${e}.${n}`:n;return new Proxy(t[n],i(a))}return t[n]}});return new Proxy(e,i())}delayRunByATick(e){this.collectingTickCallbacks?this.tickStack.push(e):e()}startTick(){this.collectingTickCallbacks=!0}clearAndEndTick(){this.tickStack.forEach(e=>e()),this.tickStack=[],this.collectingTickCallbacks=!1}initializeElements(){t(this.$el,e=>{this.initializeElement(e)})}initializeElement(e){s(e).forEach(({type:t,value:i,modifiers:n,expression:a})=>{switch(t){case"on":var s=i;this.registerListener(e,s,n,a);break;case"model":s="select"===e.tagName.toLowerCase()||["checkbox","radio"].includes(e.type)||n.includes("lazy")?"change":"input";const t=this.generateExpressionForXModelListener(e,n,a);this.registerListener(e,s,n,t);var r="value",{output:o}=this.evaluateReturnExpression(a);this.updateAttributeValue(e,r,o);break;case"bind":r=i;var{output:o}=this.evaluateReturnExpression(a);this.updateAttributeValue(e,r,o);break;case"text":var{output:o}=this.evaluateReturnExpression(a);this.updateTextValue(e,o);break;case"html":var{output:o}=this.evaluateReturnExpression(a);this.updateHtmlValue(e,o);break;case"show":var{output:o}=this.evaluateReturnExpression(a);this.updateVisibility(e,o,!0);break;case"if":var{output:o}=this.evaluateReturnExpression(a);this.updatePresence(e,o);break;case"cloak":e.removeAttribute("x-cloak")}})}listenForNewElementsToInitialize(){const e=this.$el;new MutationObserver(e=>{for(let t=0;t<e.length;t++){if(!e[t].target.closest("[x-data]").isSameNode(this.$el))return;if("attributes"===e[t].type&&"x-data"===e[t].attributeName){const n=i(e[t].target.getAttribute("x-data"),{});Object.keys(n).forEach(e=>{this.$data[e]!==n[e]&&(this.$data[e]=n[e])})}e[t].addedNodes.length>0&&e[t].addedNodes.forEach(e=>{1===e.nodeType&&(e.matches("[x-data]")||s(e).length>0&&this.initializeElement(e))})}}).observe(e,{childList:!0,attributes:!0,subtree:!0})}refresh(){var e=this;const i={model:({el:t,output:i})=>{e.updateAttributeValue(t,"value",i)},bind:({el:t,attrName:i,output:n})=>{e.updateAttributeValue(t,i,n)},text:({el:t,output:i})=>{e.updateTextValue(t,i)},html:({el:t,output:i})=>{e.updateHtmlValue(t,i)},show:({el:t,output:i})=>{e.updateVisibility(t,i)},if:({el:t,output:i})=>{e.updatePresence(t,i)}};var n,a,r,o;this.startTick(),(n=(i,n)=>{t(i,n),e.concernedData=[],e.clearAndEndTick()},a=5,function(){var e=this,t=arguments,i=function(){o=null,r||n.apply(e,t)},s=r&&!o;clearTimeout(o),o=setTimeout(i,a),s&&n.apply(e,t)})(this.$el,(function(t){s(t).forEach(({type:n,value:a,expression:s})=>{if(i[n]){var{output:r,deps:o}=e.evaluateReturnExpression(s);e.concernedData.filter(e=>o.includes(e)).length>0&&i[n]({el:t,attrName:a,output:r})}})}))}generateExpressionForXModelListener(e,t,i){var n="";return n="checkbox"===e.type?Array.isArray(this.$data[i])?`$event.target.checked ? ${i}.concat([$event.target.value]) : ${i}.filter(i => i !== $event.target.value)`:"$event.target.checked":"select"===e.tagName.toLowerCase()&&e.multiple?t.includes("number")?"Array.from($event.target.selectedOptions).map(option => { return parseFloat(option.value || option.text) })":"Array.from($event.target.selectedOptions).map(option => { return option.value || option.text })":t.includes("number")?"parseFloat($event.target.value)":t.includes("trim")?"$event.target.value.trim()":"$event.target.value","radio"===e.type&&(e.hasAttribute("name")||e.setAttribute("name",i)),`${i} = ${n}`}registerListener(e,t,i,n){if(i.includes("away")){const a=s=>{e.contains(s.target)||e.offsetWidth<1&&e.offsetHeight<1||(this.runListenerHandler(n,s),i.includes("once")&&document.removeEventListener(t,a))};document.addEventListener(t,a)}else{const a=i.includes("window")?window:i.includes("document")?document:e,s=e=>{const r=i.filter(e=>"window"!==e).filter(e=>"document"!==e);"keydown"===t&&r.length>0&&!r.includes(e.key.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/[_\s]/,"-").toLowerCase())||(i.includes("prevent")&&e.preventDefault(),i.includes("stop")&&e.stopPropagation(),this.runListenerHandler(n,e),i.includes("once")&&a.removeEventListener(t,s))};a.addEventListener(t,s)}}runListenerHandler(e,t){this.evaluateCommandExpression(e,{$event:t})}evaluateReturnExpression(e){var t=[];const n=e=>({get(i,a){if("symbol"==typeof a)return;const s=e?`${e}.${a}`:a;return"object"!=typeof i[a]||null===i[a]||Array.isArray(i[a])?(t.push(s),i[a]):new Proxy(i[a],n(s))}});return{output:i(e,new Proxy(this.$data,n())),deps:t}}evaluateCommandExpression(e,t){n(e,this.$data,t)}updateTextValue(e,t){e.innerText=t}updateHtmlValue(e,t){e.innerHTML=t}updateVisibility(e,t,i=!1){t?o(e,()=>{1===e.style.length&&""!==e.style.display?e.removeAttribute("style"):e.style.removeProperty("display")},i):l(e,()=>{e.style.display="none"},i)}updatePresence(e,t){"template"!==e.nodeName.toLowerCase()&&console.warn("Alpine: [x-if] directive should only be added to <template> tags.");const i=e.nextElementSibling&&!0===e.nextElementSibling.__x_inserted_me;if(t&&!i){const t=document.importNode(e.content,!0);e.parentElement.insertBefore(t,e.nextElementSibling),e.nextElementSibling.__x_inserted_me=!0,o(e.nextElementSibling,()=>{})}else!t&&i&&l(e.nextElementSibling,()=>{e.nextElementSibling.remove()})}updateAttributeValue(e,t,i){if("value"===t)if("radio"===e.type)e.checked=e.value==i;else if("checkbox"===e.type)if(Array.isArray(i)){let t=!1;i.forEach(i=>{i==e.value&&(t=!0)}),e.checked=t}else e.checked=!!i;else"SELECT"===e.tagName?this.updateSelect(e,i):e.value=i;else"class"===t?"string"==typeof i?e.setAttribute("class",i):Array.isArray(i)?e.setAttribute("class",i.join(" ")):Object.keys(i).forEach(t=>{i[t]?t.split(" ").forEach(t=>e.classList.add(t)):t.split(" ").forEach(t=>e.classList.remove(t))}):["disabled","readonly","required","checked","hidden"].includes(t)?i?e.setAttribute(t,""):e.removeAttribute(t):e.setAttribute(t,i)}updateSelect(e,t){const i=[].concat(t).map(e=>e+"");Array.from(e.options).forEach(e=>{e.selected=i.includes(e.value||e.text)})}getRefsProxy(){var e=this;return new Proxy({},{get(i,n){return"isProxy"===n||(t(e.$el,e=>{e.hasAttribute("x-ref")&&e.getAttribute("x-ref")===n&&(a=e)}),a);var a}})}}const d={start:async function(){e()||await new Promise(e=>{"loading"==document.readyState?document.addEventListener("DOMContentLoaded",e):e()}),this.discoverComponents(e=>{this.initializeComponent(e)}),document.addEventListener("turbolinks:load",()=>{this.discoverUninitializedComponents(e=>{this.initializeComponent(e)})}),this.listenForNewUninitializedComponentsAtRunTime(e=>{this.initializeComponent(e)})},discoverComponents:function(e){document.querySelectorAll("[x-data]").forEach(t=>{e(t)})},discoverUninitializedComponents:function(e){const t=document.querySelectorAll("[x-data]");Array.from(t).filter(e=>void 0===e.__x).forEach(t=>{e(t)})},listenForNewUninitializedComponentsAtRunTime:function(e){const t=document.querySelector("body");new MutationObserver(t=>{for(let i=0;i<t.length;i++)t[i].addedNodes.length>0&&t[i].addedNodes.forEach(t=>{1===t.nodeType&&t.matches("[x-data]")&&e(t)})}).observe(t,{childList:!0,attributes:!0,subtree:!0})},initializeComponent:function(e){e.__x=new c(e)}};return e()||(window.Alpine=d,window.Alpine.start()),d}));
//# sourceMappingURL=alpine.js.map
