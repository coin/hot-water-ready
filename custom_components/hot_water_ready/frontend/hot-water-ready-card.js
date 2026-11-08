var Z=globalThis,G=Z.ShadowRoot&&(Z.ShadyCSS===void 0||Z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ce=Symbol(),Re=new WeakMap,N=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==ce)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(G&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Re.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Re.set(e,t))}return t}toString(){return this.cssText}},De=i=>new N(typeof i=="string"?i:i+"",void 0,ce),pe=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((n,a,r)=>n+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+i[r+1],i[0]);return new N(e,i,ce)},Ne=(i,t)=>{if(G)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),a=Z.litNonce;a!==void 0&&n.setAttribute("nonce",a),n.textContent=e.cssText,i.appendChild(n)}},he=G?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return De(e)})(i):i;var{is:jt,defineProperty:Kt,getOwnPropertyDescriptor:Ft,getOwnPropertyNames:Zt,getOwnPropertySymbols:Gt,getPrototypeOf:Yt}=Object,Y=globalThis,Ie=Y.trustedTypes,Qt=Ie?Ie.emptyScript:"",Xt=Y.reactiveElementPolyfillSupport,I=(i,t)=>i,ue={toAttribute(i,t){switch(t){case Boolean:i=i?Qt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Le=(i,t)=>!jt(i,t),ze={attribute:!0,type:String,converter:ue,reflect:!1,useDefault:!1,hasChanged:Le};Symbol.metadata??=Symbol("metadata"),Y.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ze){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),a=this.getPropertyDescriptor(t,n,e);a!==void 0&&Kt(this.prototype,t,a)}}static getPropertyDescriptor(t,e,n){let{get:a,set:r}=Ft(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:a,set(o){let c=a?.call(this);r?.call(this,o),this.requestUpdate(t,c,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ze}static _$Ei(){if(this.hasOwnProperty(I("elementProperties")))return;let t=Yt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(I("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(I("properties"))){let e=this.properties,n=[...Zt(e),...Gt(e)];for(let a of n)this.createProperty(a,e[a])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,a]of e)this.elementProperties.set(n,a)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let a=this._$Eu(e,n);a!==void 0&&this._$Eh.set(a,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let a of n)e.unshift(he(a))}else t!==void 0&&e.push(he(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ne(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,n);if(a!==void 0&&n.reflect===!0){let r=(n.converter?.toAttribute!==void 0?n.converter:ue).toAttribute(e,n.type);this._$Em=t,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(t,e){let n=this.constructor,a=n._$Eh.get(t);if(a!==void 0&&this._$Em!==a){let r=n.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:ue;this._$Em=a;let c=o.fromAttribute(e,r.type);this[a]=c??this._$Ej?.get(a)??c,this._$Em=null}}requestUpdate(t,e,n,a=!1,r){if(t!==void 0){let o=this.constructor;if(a===!1&&(r=this[t]),n??=o.getPropertyOptions(t),!((n.hasChanged??Le)(r,e)||n.useDefault&&n.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:a,wrapped:r},o){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),a===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[a,r]of n){let{wrapped:o}=r,c=this[a];o!==!0||this._$AL.has(a)||c===void 0||this.C(a,void 0,r,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[I("elementProperties")]=new Map,x[I("finalized")]=new Map,Xt?.({ReactiveElement:x}),(Y.reactiveElementVersions??=[]).push("2.1.2");var me=globalThis,Ue=i=>i,Q=me.trustedTypes,Ve=Q?Q.createPolicy("lit-html",{createHTML:i=>i}):void 0,fe="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,we="?"+$,Jt=`<${we}>`,C=document,L=()=>C.createComment(""),U=i=>i===null||typeof i!="object"&&typeof i!="function",_e=Array.isArray,Fe=i=>_e(i)||typeof i?.[Symbol.iterator]=="function",ge=`[ 	
\f\r]`,z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qe=/-->/g,We=/>/g,S=RegExp(`>|${ge}(?:([^\\s"'>=/]+)(${ge}*=${ge}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Be=/'/g,je=/"/g,Ze=/^(?:script|style|textarea|title)$/i,be=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),d=be(1),q=be(2),Tn=be(3),w=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),Ke=new WeakMap,A=C.createTreeWalker(C,129);function Ge(i,t){if(!_e(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ve!==void 0?Ve.createHTML(t):t}var Ye=(i,t)=>{let e=i.length-1,n=[],a,r=t===2?"<svg>":t===3?"<math>":"",o=z;for(let c=0;c<e;c++){let l=i[c],p,m,u=-1,f=0;for(;f<l.length&&(o.lastIndex=f,m=o.exec(l),m!==null);)f=o.lastIndex,o===z?m[1]==="!--"?o=qe:m[1]!==void 0?o=We:m[2]!==void 0?(Ze.test(m[2])&&(a=RegExp("</"+m[2],"g")),o=S):m[3]!==void 0&&(o=S):o===S?m[0]===">"?(o=a??z,u=-1):m[1]===void 0?u=-2:(u=o.lastIndex-m[2].length,p=m[1],o=m[3]===void 0?S:m[3]==='"'?je:Be):o===je||o===Be?o=S:o===qe||o===We?o=z:(o=S,a=void 0);let g=o===S&&i[c+1].startsWith("/>")?" ":"";r+=o===z?l+Jt:u>=0?(n.push(p),l.slice(0,u)+fe+l.slice(u)+$+g):l+$+(u===-2?c:g)}return[Ge(i,r+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},V=class i{constructor({strings:t,_$litType$:e},n){let a;this.parts=[];let r=0,o=0,c=t.length-1,l=this.parts,[p,m]=Ye(t,e);if(this.el=i.createElement(p,n),A.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(a=A.nextNode())!==null&&l.length<c;){if(a.nodeType===1){if(a.hasAttributes())for(let u of a.getAttributeNames())if(u.endsWith(fe)){let f=m[o++],g=a.getAttribute(u).split($),v=/([.?@])?(.*)/.exec(f);l.push({type:1,index:r,name:v[2],strings:g,ctor:v[1]==="."?J:v[1]==="?"?ee:v[1]==="@"?te:E}),a.removeAttribute(u)}else u.startsWith($)&&(l.push({type:6,index:r}),a.removeAttribute(u));if(Ze.test(a.tagName)){let u=a.textContent.split($),f=u.length-1;if(f>0){a.textContent=Q?Q.emptyScript:"";for(let g=0;g<f;g++)a.append(u[g],L()),A.nextNode(),l.push({type:2,index:++r});a.append(u[f],L())}}}else if(a.nodeType===8)if(a.data===we)l.push({type:2,index:r});else{let u=-1;for(;(u=a.data.indexOf($,u+1))!==-1;)l.push({type:7,index:r}),u+=$.length-1}r++}}static createElement(t,e){let n=C.createElement("template");return n.innerHTML=t,n}};function T(i,t,e=i,n){if(t===w)return t;let a=n!==void 0?e._$Co?.[n]:e._$Cl,r=U(t)?void 0:t._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(i),a._$AT(i,e,n)),n!==void 0?(e._$Co??=[])[n]=a:e._$Cl=a),a!==void 0&&(t=T(i,a._$AS(i,t.values),a,n)),t}var X=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,a=(t?.creationScope??C).importNode(e,!0);A.currentNode=a;let r=A.nextNode(),o=0,c=0,l=n[0];for(;l!==void 0;){if(o===l.index){let p;l.type===2?p=new R(r,r.nextSibling,this,t):l.type===1?p=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(p=new ne(r,this,t)),this._$AV.push(p),l=n[++c]}o!==l?.index&&(r=A.nextNode(),o++)}return A.currentNode=C,a}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},R=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,a){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=T(this,t,e),U(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==w&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Fe(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,a=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=V.createElement(Ge(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===a)this._$AH.p(e);else{let r=new X(a,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(t){let e=Ke.get(t.strings);return e===void 0&&Ke.set(t.strings,e=new V(t)),e}k(t){_e(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,a=0;for(let r of t)a===e.length?e.push(n=new i(this.O(L()),this.O(L()),this,this.options)):n=e[a],n._$AI(r),a++;a<e.length&&(this._$AR(n&&n._$AB.nextSibling,a),e.length=a)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Ue(t).nextSibling;Ue(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,a,r){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=a,this.options=r,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=h}_$AI(t,e=this,n,a){let r=this.strings,o=!1;if(r===void 0)t=T(this,t,e,0),o=!U(t)||t!==this._$AH&&t!==w,o&&(this._$AH=t);else{let c=t,l,p;for(t=r[0],l=0;l<r.length-1;l++)p=T(this,c[n+l],e,l),p===w&&(p=this._$AH[l]),o||=!U(p)||p!==this._$AH[l],p===h?t=h:t!==h&&(t+=(p??"")+r[l+1]),this._$AH[l]=p}o&&!a&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},J=class extends E{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},ee=class extends E{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},te=class extends E{constructor(t,e,n,a,r){super(t,e,n,a,r),this.type=5}_$AI(t,e=this){if((t=T(this,t,e,0)??h)===w)return;let n=this._$AH,a=t===h&&n!==h||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,r=t!==h&&(n===h||a);a&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ne=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){T(this,t)}},Qe={M:fe,P:$,A:we,C:1,L:Ye,R:X,D:Fe,V:T,I:R,H:E,N:ee,U:te,B:J,F:ne},en=me.litHtmlPolyfillSupport;en?.(V,R),(me.litHtmlVersions??=[]).push("3.3.3");var Xe=(i,t,e)=>{let n=e?.renderBefore??t,a=n._$litPart$;if(a===void 0){let r=e?.renderBefore??null;n._$litPart$=a=new R(t.insertBefore(L(),r),r,void 0,e??{})}return a._$AI(i),a};var ye=globalThis,k=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Xe(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return w}};k._$litElement$=!0,k.finalized=!0,ye.litElementHydrateSupport?.({LitElement:k});var tn=ye.litElementPolyfillSupport;tn?.({LitElement:k});(ye.litElementVersions??=[]).push("4.2.2");var H={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Je=i=>(...t)=>({_$litDirective$:i,values:t}),ie=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Wn}=Qe;var et=i=>i.strings===void 0;var nn={},tt=(i,t=nn)=>i._$AH=t;var M=Je(class extends ie{constructor(i){if(super(i),i.type!==H.PROPERTY&&i.type!==H.ATTRIBUTE&&i.type!==H.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!et(i))throw Error("`live` bindings can only contain a single expression")}render(i){return i}update(i,[t]){if(t===w||t===h)return t;let e=i.element,n=i.name;if(i.type===H.PROPERTY){if(t===e[n])return w}else if(i.type===H.BOOLEAN_ATTRIBUTE){if(!!t===e.hasAttribute(n))return w}else if(i.type===H.ATTRIBUTE&&e.getAttribute(n)===t+"")return w;return tt(i),t}});var an={"status.waiting":"Idle","status.heating":"Heating","status.ready":"Ready","status.fault":"Fault","status.manual":"Manual","headline.heating_for":"Heating: ready in about {minutes} min","headline.ready_at":"Ready at {when}","subline.next_at":"Next at {when}","when.today":"{time}","when.tomorrow":"{time} tomorrow","when.weekday":"{time} on {weekday}","ring.target":"target {target}\xB0","weekday.letters":"M,T,W,T,F,S,S","members.none":"No members yet. An administrator adds them in the integration's settings.","list.empty":"No ready times yet.","list.add":"Add a ready time","sheet.delete":"Delete","list.switch":"On or off","sheet.title":"New ready time","sheet.edit_title":"Change ready time","list.edit":"Change this ready time","sheet.time":"Time","sheet.hour":"Hour","sheet.minute":"Minute","sheet.days":"Days","sheet.save":"Save","sheet.cancel":"Cancel","clock.title":"Select time","clock.title_keys":"Enter time","clock.ok":"OK","clock.to_keys":"Type the time","clock.to_dial":"Use the clock","clock.am":"AM","clock.pm":"PM","clock.invalid":"Enter a valid time","clock.change":"Change the time","fault.sensor_unavailable":"Fault: the water temperature sensor gives no readings. Heating has stopped.","fault.not_rising":"Fault: the water is not getting hotter. Heating has stopped; see Repairs.","fault.no_consumption":"Fault: the heater draws no power. Heating has stopped; see Repairs.","fault.relay_stuck":"Fault: the heater draws power while switched off. Check the relay.","element.on":"Heater on","element.off":"Heater off","element.drawing":"{state} \xB7 drawing {watts} W","keep_hot.until":"Keeping hot until {time}","keep_hot.title":"Keep hot after it's ready","keep_hot.hint":'After the "ready" message the heater keeps the water hot this long, then switches off.',"keep_hot.more":"Choose how long to keep it hot","keep_hot.cancel":"Cancel","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h",manual:"Automatic control is off: the heater is run by hand.","note.not_rising_skipped":'The thermostat does not say when it is heating, so the "water not getting hotter" and "heater draws no power" checks are not made.',"heat_now.start":"Heat now","heat_now.cancel":"Cancel","heat_now.join":"Tell me when it's hot","heat_now.leave":"Don't tell me","subline.for":"For {list}.","item.at":"{name} at {time}","switch_off.link":"Switch off the heating\u2026","switch_off.title":"Switch off the heating?","switch_off.confirm":"Switch off","switch_off.keep":"Cancel","switch_off.asked_one":"{names} will no longer be told.","switch_off.asked_many":"{names} will no longer be told.","switch_off.skipped_one":"Without hot water: {list}.","switch_off.skipped_many":"Without hot water: {list}.","switch_off.back":"It switches back on by itself for the next ready time.","switch_off.nobody":"Heating stops now.","settings.switch_off":"Who may switch off the heating for everyone","settings.switch_off_hint":"The administrators and:","settings.own_cancel":"Whoever asked may always cancel their own request.",greeting:"Hello, {name}","today.label":"House today","today.nobody":"Nobody today","away.until_label":"Until (optional)","away.line":"Away","away.line_until":"Away until {date}","members.add":"Member","card.no_heater":"No Hot Water Ready heater is set up yet.","card.loading":"Loading\u2026","card.error":"That did not work: {message}","cluster.warning":"The showers from {when} need the water at {needed} \xB0C, but the heater goes only to {cap} \xB0C: the last ones may run cooler.","tabs.people":"People","tabs.week":"Week","week.days":"Mon,Tue,Wed,Thu,Fri,Sat,Sun","week.showers":"showers","week.windows":"heating windows","week.busiest":"busiest day","week.heating":"Heating","week.away":"away","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} a week","week.hint":"Tap a person to highlight their times. The bars show when the heater may heat each day ({start} to {end}).","settings.open":"Heater settings","settings.close":"Close","settings.target":"Target temperature","settings.target_hint":"Ready when the water gets here","settings.target_down":"Lower the target","settings.target_up":"Raise the target","settings.margin":"Margin","settings.band":"Stops at {stop} \xB0C, restarts at {restart} \xB0C","settings.margin_down":"Lower the margin","settings.margin_up":"Raise the margin","settings.automatic":"Automatic control","settings.automatic_hint":"Off: the heater is run by hand","settings.more":"More settings","solar.title":"Solar comparison","solar.none":"No windows recorded in the last 30 days yet.","solar.would":"With the solar-aware rule on, the water would have been ready on time in {on_time} of {windows} windows","solar.did":"With the solar-aware rule, the water was ready on time in {on_time} of {windows} windows","solar.would_less":", and the heater would have run {minutes} minutes less","solar.would_more":", and the heater would have run {minutes} minutes more","solar.did_less":", and the heater ran {minutes} minutes less","solar.did_more":", and the heater ran {minutes} minutes more","solar.kwh":", about {kwh} kWh","solar.applied":" The rule was applied in {applied} of them: on time in {on_time}.","subline.starts_at":"Starts heating around {when}.","subline.starts_at_solar":"Starts heating around {when}, if the sun has not done it by then.","subline.asked_by_one":"Asked for by {name}. They are told when it is ready.","subline.asked_by_many":"Asked for by {names}. Each is told when it is ready.","names.and":" and ","today.you":"You","list.mine":"My ready times","list.count_one":"1 ready time","list.count":"{count} ready times","list.virtual":"Virtual member \xB7 shared household times","away.paused":"Paused. The times are kept.","settings.no_people":"There are no people in Home Assistant to choose from yet."},rn={"status.waiting":"Em espera","status.heating":"A aquecer","status.ready":"Pronta","status.fault":"Avaria","status.manual":"Manual","headline.heating_for":"A aquecer: pronta em cerca de {minutes} min","headline.ready_at":"Pronta \xE0s {when}","subline.next_at":"Pr\xF3xima \xE0s {when}","when.today":"{time}","when.tomorrow":"{time} de amanh\xE3","when.weekday":"{time} de {weekday}","ring.target":"alvo {target}\xB0","weekday.letters":"S,T,Q,Q,S,S,D","members.none":"Ainda n\xE3o h\xE1 membros. Um administrador acrescenta-os nas defini\xE7\xF5es da integra\xE7\xE3o.","list.empty":"Ainda n\xE3o h\xE1 hor\xE1rios.","list.add":"Acrescentar um hor\xE1rio","sheet.delete":"Apagar","list.switch":"Ligar ou desligar","sheet.title":"Novo hor\xE1rio","sheet.edit_title":"Alterar hor\xE1rio","list.edit":"Alterar este hor\xE1rio","sheet.time":"Hora","sheet.hour":"Horas","sheet.minute":"Minutos","sheet.days":"Dias","sheet.save":"Guardar","sheet.cancel":"Cancelar","clock.title":"Escolher a hora","clock.title_keys":"Escrever a hora","clock.ok":"OK","clock.to_keys":"Escrever a hora","clock.to_dial":"Usar o rel\xF3gio","clock.am":"AM","clock.pm":"PM","clock.invalid":"Escreva uma hora v\xE1lida","clock.change":"Alterar a hora","fault.sensor_unavailable":"Avaria: o sensor da temperatura da \xE1gua n\xE3o d\xE1 leituras. O aquecimento parou.","fault.not_rising":"Avaria: a \xE1gua n\xE3o aquece. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.no_consumption":"Avaria: o aquecedor n\xE3o consome energia. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.relay_stuck":"Avaria: o aquecedor consome energia com o rel\xE9 desligado. Verifique o rel\xE9.","element.on":"Resist\xEAncia ligada","element.off":"Resist\xEAncia desligada","element.drawing":"{state} \xB7 a consumir {watts} W","keep_hot.until":"A manter a \xE1gua quente at\xE9 \xE0s {time}","keep_hot.title":"Manter quente depois de pronta","keep_hot.hint":"Depois do aviso de pronta, o aquecedor mant\xE9m a \xE1gua quente durante este tempo e depois desliga.","keep_hot.more":"Escolher quanto tempo manter quente","keep_hot.cancel":"Cancelar","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h",manual:"O controlo autom\xE1tico est\xE1 desligado: o aquecedor est\xE1 a ser comandado manualmente.","note.not_rising_skipped":'O term\xF3stato n\xE3o indica quando est\xE1 a aquecer, por isso as verifica\xE7\xF5es "a \xE1gua n\xE3o aquece" e "o aquecedor n\xE3o consome energia" n\xE3o s\xE3o feitas.',"heat_now.start":"Aquecer agora","heat_now.cancel":"Cancelar","heat_now.join":"Avisar-me quando estiver quente","heat_now.leave":"N\xE3o me avisar","subline.for":"Para {list}.","item.at":"{name} \xE0s {time}","switch_off.link":"Desligar o aquecimento\u2026","switch_off.title":"Desligar o aquecimento?","switch_off.confirm":"Desligar","switch_off.keep":"Cancelar","switch_off.asked_one":"{names} j\xE1 n\xE3o recebe o aviso.","switch_off.asked_many":"{names} j\xE1 n\xE3o recebem o aviso.","switch_off.skipped_one":"Fica sem \xE1gua quente: {list}.","switch_off.skipped_many":"Ficam sem \xE1gua quente: {list}.","switch_off.back":"Volta a ligar-se por si para o pr\xF3ximo hor\xE1rio.","switch_off.nobody":"O aquecimento p\xE1ra agora.","settings.switch_off":"Quem pode desligar o aquecimento para todos","settings.switch_off_hint":"Os administradores e:","settings.own_cancel":"Quem pediu pode sempre cancelar o seu pr\xF3prio pedido.",greeting:"Ol\xE1, {name}","today.label":"Casa hoje","today.nobody":"Ningu\xE9m hoje","away.until_label":"At\xE9 (opcional)","away.line":"Ausente","away.line_until":"Ausente at\xE9 {date}","members.add":"Membro","card.no_heater":"Ainda n\xE3o h\xE1 nenhum aquecedor do Hot Water Ready configurado.","card.loading":"A carregar\u2026","card.error":"N\xE3o foi poss\xEDvel: {message}","cluster.warning":"Os duches a partir das {when} precisam da \xE1gua a {needed} \xB0C, mas o aquecedor s\xF3 aquece at\xE9 {cap} \xB0C: os \xFAltimos podem sair menos quentes.","tabs.people":"Pessoas","tabs.week":"Semana","week.days":"Seg,Ter,Qua,Qui,Sex,S\xE1b,Dom","week.showers":"duches","week.windows":"janelas de aquecimento","week.busiest":"dia mais cheio","week.heating":"Aquecimento","week.away":"ausente","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} por semana","week.hint":"Toque numa pessoa para destacar os seus hor\xE1rios. As barras mostram quando o aquecedor pode aquecer em cada dia ({start} a {end}).","settings.open":"Defini\xE7\xF5es do aquecedor","settings.close":"Fechar","settings.target":"Temperatura alvo","settings.target_hint":"Avisa quando chega aqui","settings.target_down":"Baixar o alvo","settings.target_up":"Subir o alvo","settings.margin":"Margem","settings.band":"P\xE1ra a {stop} \xB0C, retoma a {restart} \xB0C","settings.margin_down":"Baixar a margem","settings.margin_up":"Subir a margem","settings.automatic":"Controlo autom\xE1tico","settings.automatic_hint":"Desligado: o aquecedor fica em modo manual","settings.more":"Mais defini\xE7\xF5es","solar.title":"Compara\xE7\xE3o solar","solar.none":"Ainda n\xE3o h\xE1 janelas registadas nos \xFAltimos 30 dias.","solar.would":"Com a regra solar ligada, a \xE1gua teria ficado pronta a tempo em {on_time} de {windows} janelas","solar.did":"Com a regra solar, a \xE1gua ficou pronta a tempo em {on_time} de {windows} janelas","solar.would_less":", e o aquecedor teria trabalhado menos {minutes} minutos","solar.would_more":", e o aquecedor teria trabalhado mais {minutes} minutos","solar.did_less":", e o aquecedor trabalhou menos {minutes} minutos","solar.did_more":", e o aquecedor trabalhou mais {minutes} minutos","solar.kwh":", cerca de {kwh} kWh","solar.applied":" A regra foi aplicada em {applied} delas: a tempo em {on_time}.","subline.starts_at":"Come\xE7a a aquecer por volta das {when}.","subline.starts_at_solar":"Come\xE7a a aquecer por volta das {when}, se o sol n\xE3o chegar.","subline.asked_by_one":"Pedido por {name}. Recebe um aviso quando estiver pronta.","subline.asked_by_many":"Pedido por {names}. Cada um \xE9 avisado quando estiver pronta.","names.and":" e ","today.you":"Voc\xEA","list.mine":"Os meus hor\xE1rios","list.count_one":"1 hor\xE1rio","list.count":"{count} hor\xE1rios","list.virtual":"Membro virtual \xB7 hor\xE1rios partilhados da casa","away.paused":"Em pausa. Os hor\xE1rios ficam guardados.","settings.no_people":"Ainda n\xE3o h\xE1 pessoas no Home Assistant para escolher."},on={en:an,pt:rn};function ae(i){return i?.toLowerCase().startsWith("pt")?"pt":"en"}function O(i){return ae(i)==="pt"?"pt-PT":"en-GB"}function re(i){return s(i,"weekday.letters").split(",")}function s(i,t,e={}){return on[ae(i)][t].replace(/\{(\w+)\}/g,(a,r)=>String(e[r]??a))}function ve(i){return i.callWS({type:"hot_water_ready/heaters"})}var oe=class{constructor(t,e){this.onSnapshot=t;this.onMissing=e;this.generation=0}async follow(t,e){let n=this.generation,a=e;if(a===void 0){if(this.defaultEntryId??=ve(t).then(o=>o[0]?.entry_id),a=await this.defaultEntryId,n!==this.generation)return;if(a===void 0){this.defaultEntryId=void 0,this.onMissing();return}}if(a===this.entryId)return;this.stop();let r=this.generation;this.entryId=a,this.stopSubscription=t.connection.subscribeMessage(o=>{r===this.generation&&this.onSnapshot(o)},{type:"hot_water_ready/subscribe",entry_id:a}),this.stopSubscription.catch(()=>{r===this.generation&&(this.entryId=void 0,this.onMissing())})}stop(){this.generation++;let t=this.stopSubscription;this.stopSubscription=void 0,this.entryId=void 0,t?.then(e=>e()).catch(()=>{})}};function it(i,t){if(i==="24")return!0;if(i==="12")return!1;let e=i==="system"?void 0:t;return!new Intl.DateTimeFormat(e,{hour:"numeric"}).format(new Date(2023,0,1,22)).includes("10")}function at(i,t,e,n){return n?`${String(i).padStart(2,"0")}:${String(t).padStart(2,"0")}`:new Intl.DateTimeFormat(O(e),{timeZone:"UTC",hour:"numeric",minute:"2-digit",hourCycle:"h12"}).format(Date.UTC(2e3,0,1,i,t))}function le(i,t,e=!0){let[n=0,a=0]=i.split(":").map(Number);return at(n,a,t,e)}function xe(i,t,e=!0){return e?`${String(i).padStart(2,"0")}h`:new Intl.DateTimeFormat(O(t),{timeZone:"UTC",hour:"numeric",hourCycle:"h12"}).format(Date.UTC(2e3,0,1,i%24))}function rt(i,t=!0){return s(i,"week.hint",{start:xe(D/60,i,t),end:xe(j/60,i,t)})}function b(i,t,e){return new Intl.NumberFormat(O(t),{maximumFractionDigits:e}).format(i)}function B(i,t){return new Intl.DateTimeFormat("en-CA",{timeZone:t,year:"numeric",month:"2-digit",day:"2-digit"}).format(i)}function ot(i){let t=new Date(`${i}T12:00:00Z`);return t.setUTCDate(t.getUTCDate()+1),t.toISOString().slice(0,10)}function se(i,t){let{language:e,timeZone:n,now:a}=t,r=new Date(i),o=de(i,t),c=B(a,n);if(B(r,n)===c)return s(e,"when.today",{time:o});if(B(r,n)===ot(c))return s(e,"when.tomorrow",{time:o});let l=new Intl.DateTimeFormat(O(e),{timeZone:n,weekday:"long"}).format(r);return s(e,"when.weekday",{time:o,weekday:l})}function sn(i,t){let{language:e}=t;return i.status==="heating"&&i.ready_in_minutes!==null?s(e,"headline.heating_for",{minutes:i.ready_in_minutes}):i.status==="waiting"&&i.next_ready?s(e,"headline.ready_at",{when:se(i.next_ready.at,t)}):s(e,`status.${i.status}`)}function st(i){return new Map(i.members.map(t=>[t.id,t]))}function Se(i,t,e){let n=st(i);return t.map(a=>n.get(a)?.name??e.people?.[a]??a)}function lt(i){let t={};for(let[e,n]of Object.entries(i??{}))e.startsWith("person.")&&(t[e]=n.attributes.friendly_name??e);return t}function Ae(i,t){return i.length<2?i.join(""):`${i.slice(0,-1).join(", ")}${s(t,"names.and")}${i.at(-1)??""}`}function dt(i,t,e){let n=t.map(a=>s(e.language,"item.at",{name:Se(i,[a.member],e)[0]??"",time:de(a.at,e)}));return Ae(n,e.language)}function ln(i,t){let{language:e}=t,n=i.heat_now?.requesters??[];if(i.status==="heating"&&n.length>0){let a=Se(i,n,t);return a.length===1?s(e,"subline.asked_by_one",{name:a[0]??""}):s(e,"subline.asked_by_many",{names:Ae(a,e)})}if(i.status==="heating"&&i.heating_for.length>0)return s(e,"subline.for",{list:dt(i,i.heating_for,t)});if(i.status==="waiting"&&i.next_heat_start){let a=i.solar_aware?"subline.starts_at_solar":"subline.starts_at";return s(e,a,{when:se(i.next_heat_start,t)})}return i.status==="ready"&&i.next_ready?s(e,"subline.next_at",{when:se(i.next_ready.at,t)}):""}function dn(i,t){if(i.element_on===null)return"";let e=s(t,i.element_on?"element.on":"element.off");return i.power_w===null?e:s(t,"element.drawing",{state:e,watts:b(i.power_w,t,0)})}function ct(i,t){let{language:e}=t,{temperature:n,target:a}=i;return{temperature:n===null?"\u2013":`${b(n,e,1)}\xB0`,target:s(e,"ring.target",{target:b(a,e,1)}),badge:s(e,`status.${i.status}`).toLocaleUpperCase(O(e)),headline:sn(i,t),subline:ln(i,t),element:dn(i,e),keepHot:gn(i,t),fill:n===null||a<=0?0:Math.min(1,Math.max(0,n/a)),tone:i.status}}function cn(i,t){let e=t??i.me;return i.members.find(n=>n.id===e)??i.members[0]}function pt(i){let t=K(i);return t==="admin"?!0:t==="viewer"&&i.members.length>1}function ht(i,t){return cn(i,K(i)==="member"?void 0:t)}function ut(i){return B(i.now,i.timeZone)}function gt(){return{time:"07:00",weekdays:[0,1,2,3,4]}}function mt(i,t){let e=i.ready_times.find(n=>n.id===t);return e&&{id:e.id,time:e.time,weekdays:[...e.weekdays].sort()}}function Ce(i){return i.time!==""&&i.weekdays.length>0}var y=256,P=104,Te=68;function _(i){return String(i).padStart(2,"0")}function Ee(i,t){return t?_(i):String(i%12||12)}function $e(i,t){return{hourText:Ee(i.hour,t),minuteText:_(i.minute)}}function He(i,t,e=!0){let[n=7,a=0]=i.split(":").map(Number);return{hour:n,minute:a,part:"hour",mode:"dial",...$e({hour:n,minute:a},e),fresh:t}}function W(i,t){let e=i*Math.PI/6;return{x:y/2+t*Math.sin(e),y:y/2-t*Math.cos(e)}}function ft(i,t=!0){let e=Array.from({length:12},(n,a)=>a);return i==="minute"?e.map(n=>({value:n*5,label:_(n*5),...W(n,P)})):t?[...e.map(n=>({value:n,label:String(n),...W(n,P)})),...e.map(n=>({value:n+12,label:String(n+12),...W(n,Te)}))]:e.map(n=>({value:n,label:String(n||12),...W(n,P)}))}function wt(i,t,e=!0){return i.part==="minute"?i.minute===t.value:(e?i.hour:i.hour%12)===t.value}function _t(i,t=!0){if(i.part==="minute"){let e=i.minute*Math.PI/30;return{x:y/2+P*Math.sin(e),y:y/2-P*Math.cos(e)}}return W(i.hour%12,t&&i.hour>=12?Te:P)}function bt(i,t,e,n=!0){let a=t-y/2,r=e-y/2,o=(Math.atan2(a,-r)/(2*Math.PI)+1)%1;if(i.part==="minute"){let m=Math.round(o*60)%60;return{...i,minute:m,minuteText:_(m)}}let c=Math.round(o*12)%12,l=n?Math.hypot(a,r)<(P+Te)/2:i.hour>=12,p=c+(l?12:0);return{...i,hour:p,hourText:Ee(p,n)}}function yt(i,t,e=!0){if(i.part==="minute"){let a=(i.minute+t+60)%60;return{...i,minute:a,minuteText:_(a)}}let n=(i.hour+t+24)%24;return{...i,hour:n,hourText:Ee(n,e)}}function vt(i,t){return{...i,hour:i.hour%12+(t?12:0)}}function xt(i,t=!0){if(!/^\d{1,2}$/.test(i.hourText)||!/^\d{1,2}$/.test(i.minuteText))return;let e=Number(i.hourText),n=Number(i.minuteText);if(!(n>59)){if(t)return e>23?void 0:`${_(e)}:${_(n)}`;if(!(e<1||e>12))return`${_(e%12+(i.hour>=12?12:0))}:${_(n)}`}}function Me(i,t=!0){return i.mode==="keys"?xt(i,t):`${_(i.hour)}:${_(i.minute)}`}function $t(i,t=!0){if(i.mode==="dial")return{...i,mode:"keys",...$e(i,t)};let[e=i.hour,n=i.minute]=xt(i,t)?.split(":").map(Number)??[];return{...i,mode:"dial",part:"hour",hour:e,minute:n,...$e({hour:e,minute:n},t)}}function kt(i,t,e=!0){let n=re(t);return[...i.ready_times].sort((a,r)=>a.time.localeCompare(r.time)||a.id.localeCompare(r.id)).map(a=>({id:a.id,time:le(a.time,t,e),enabled:a.enabled,days:n.map((r,o)=>({letter:r,on:a.weekdays.includes(o)}))}))}function K(i){return i.is_admin?"admin":i.me?"member":"viewer"}function St(i,t){return i.members.map(e=>({id:e.id,name:e.name,initial:e.name.slice(0,1).toLocaleUpperCase(),colour:e.colour,star:e.virtual,faded:e.away.on,selected:e.id===t}))}function At(i,t){let e=i.members.find(n=>n.id===i.me);return e?s(t,"greeting",{name:e.name}):""}function de(i,t){let{minutes:e}=ke(i,t.timeZone);return at(Math.floor(e/60),e%60,t.language,t.hour24??!0)}function Ct(i,t,e){let n=st(i);return i.today.map(a=>{let r=a.member===e,o=n.get(a.member);return{name:r?s(t.language,"today.you"):o?.name??"?",time:de(a.at,t),colour:o?.colour??"",mine:r}})}function Tt(i,t){let e=i.ready_times.length,n=s(t,"list.count",{count:e});return i.virtual?n=s(t,"list.virtual"):e===1&&(n=s(t,"list.count_one")),{name:i.name,note:n}}function pn(i,t){let e=new Date(`${i}T12:00:00Z`),n=O(t),a=new Intl.DateTimeFormat(n,{timeZone:"UTC",day:"numeric"}).format(e),r=new Intl.DateTimeFormat(n,{timeZone:"UTC",month:"long"}).format(e);return ae(t)==="pt"?`${a} de ${r.slice(0,1).toLocaleUpperCase("pt-PT")}${r.slice(1)}`:`${a} ${r}`}function Et(i,t){return i.away.on?i.away.until?s(t.language,"away.line_until",{date:pn(i.away.until,t.language)}):s(t.language,"away.line"):""}var Ht="hot_water_ready/heat_now/start",hn="hot_water_ready/heat_now/cancel";function Mt(i){let t=i.can_ask_heat_now&&!i.heat_now_blocked&&i.automatic,e=i.heat_now;if(e?.asked){let a=e.requesters.length===1&&!e.unnamed;return[{message:{type:hn},label:a?"heat_now.cancel":"heat_now.leave"}]}if(!t)return[];if(e===null&&i.heating_for.some(a=>a.member===i.me))return[];let n=i.status==="heating"||e!==null;return[{message:{type:Ht},label:n?"heat_now.join":"heat_now.start"}]}function Ot(i){return i.message.type===Ht}var Pt=500,un=[5,15,30,60,120];function Rt(i,t){let e=i.keep_hot_minutes;return[...new Set([...un,e])].sort((a,r)=>a-r).map(a=>({minutes:a,label:a>=60&&a%60===0?s(t,"keep_hot.hours",{n:b(a/60,t,0)}):s(t,"keep_hot.minutes",{n:b(a,t,0)}),isDefault:a===e}))}function gn(i,t){let e=i.heat_now?.keep_until;return e?s(t.language,"keep_hot.until",{time:de(e,t)}):""}var Dt="hot_water_ready/switch_off";function Nt(i){let t=(i.heat_now?.requesters.length??0)>0||!!i.heat_now?.unnamed;return i.can_switch_off&&(i.status==="heating"||t)}function It(i,t){let{language:e}=t,n=(i.heat_now?.requesters??[]).filter(o=>o!==i.viewer),a=i.heating_for.filter(o=>o.member!==i.viewer),r=[];if(n.length>0){let o=Ae(Se(i,n,t),e);r.push(s(e,n.length===1?"switch_off.asked_one":"switch_off.asked_many",{names:o}))}if(a.length>0){let o=dt(i,a,t);r.push(s(e,a.length===1?"switch_off.skipped_one":"switch_off.skipped_many",{list:o}))}return r.length===0&&r.push(s(e,"switch_off.nobody")),i.heating_for.length>0&&r.push(s(e,"switch_off.back")),{title:s(e,"switch_off.title"),lines:r}}function zt(i,t){return i.faults.map(e=>s(t,`fault.${e}`))}var Lt="hot_water_ready/settings/set",mn={min:30,max:75,step:.5},fn={min:0,max:5,step:.5};function nt(i,t,e){let n=Math.ceil(i/t.step-1e-9)*t.step-t.step,a=Math.floor(i/t.step+1e-9)*t.step+t.step;return{shown:b(i,e,1),down:n>=t.min-1e-9?n:null,up:a<=t.max+1e-9?a:null}}function Ut(i,t){let{language:e}=t,n=i.settings;if(!(!i.is_admin||!n))return{target:nt(i.target,mn,e),margin:nt(i.margin,fn,e),band:s(e,"settings.band",{stop:b(i.target+i.margin,e,1),restart:b(i.target-i.margin,e,1)}),automatic:i.automatic,people:Object.entries(t.people??{}).map(([a,r])=>({id:a,name:r,on:n.switch_off_people.includes(a)})).sort((a,r)=>a.name.localeCompare(r.name)),solar:wn(n,e),notes:i.not_rising_checked?[]:[s(e,"note.not_rising_skipped")]}}function Vt(i,t,e){return i.filter(n=>n.id===t?e:n.on).map(n=>n.id)}function wn(i,t){let{windows:e,on_time:n,minutes_saved:a,kwh:r}=i.solar;if(e===0)return s(t,"solar.none");let o=i.solar_aware?"did":"would",c=s(t,`solar.${o}`,{on_time:n,windows:e});a!==0&&(c+=s(t,`solar.${o}_${a>0?"less":"more"}`,{minutes:Math.abs(a)}),r!==null&&(c+=s(t,"solar.kwh",{kwh:b(Math.abs(r),t,1)}))),c+=".";let{solar_windows:l,solar_on_time:p}=i.solar;return l>0&&(c+=s(t,"solar.applied",{applied:l,on_time:p})),c}var D=300,j=1440;function ke(i,t){let e=new Date(i),n=new Intl.DateTimeFormat("en-GB",{timeZone:t,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(e).reduce((a,r)=>({...a,[r.type]:r.value}),{});return{day:B(e,t),minutes:Number(n.hour)*60+Number(n.minute)}}function qt(i,t){let e=i.week;if(!i.is_admin||!e)return;let n=s(t.language,"week.days").split(","),a=n.map((l,p)=>_n(e.monday,p)),r=i.members.map(l=>yn(l,a,t.language,t.hour24??!0)),o=a.map((l,p)=>r.reduce((m,u)=>{let f=u.cells[p];return f&&!f.away?m+f.times.length:m},0)),c=Math.max(0,...o);return{days:a.map((l,p)=>({key:l,label:n[p]??l,today:l===e.today,bars:vn(l,e.windows,t.timeZone)})),hours:[6,12,18,24].map(l=>({label:xe(l,t.language,t.hour24??!0),at:(l*60-D)/(j-D)})),rows:r,showers:o.reduce((l,p)=>l+p,0),windows:e.windows.length,busiest:c>0?n[o.indexOf(c)]??"":""}}function _n(i,t){let e=i;for(let n=0;n<t;n+=1)e=ot(e);return e}function bn(i,t){return i.away.on&&(i.away.until===null||t<=i.away.until)}function yn(i,t,e,n){let a=i.ready_times.filter(p=>p.enabled),r=t.map((p,m)=>({times:a.filter(u=>u.weekdays.includes(m)).map(u=>u.time).sort().map(u=>le(u,e,n)),away:bn(i,p)})),o=r.every(p=>p.away),c=r.reduce((p,m)=>p+m.times.length,0),l=s(e,"week.per_week",{count:c});return o?l=s(e,"week.away"):i.virtual&&(l=s(e,"week.virtual",{count:c})),{id:i.id,name:i.name,colour:i.colour,initial:i.virtual?"\u2605":i.name[0]??"?",away:o,note:l,cells:r}}function vn(i,t,e){let n=j-D,a=[];for(let r of t){let o=ke(r.start,e),c=ke(r.end,e);if(o.day>i||c.day<i)continue;let l=Math.max(D,o.day<i?0:o.minutes),p=Math.min(j,c.day>i?j:c.minutes);p>l&&a.push({from:(l-D)/n,length:(p-l)/n})}return a}function Wt(i,t){let e=i.cluster_warning;return e?s(t.language,"cluster.warning",{when:se(e.at,t),needed:b(e.needed,t.language,0),cap:b(e.cap,t.language,1)}):""}var xn=q`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/></svg>`,$n=q`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>`,F="hot-water-ready-card",Oe=38,Bt=2*Math.PI*Oe,Pe=class extends k{constructor(){super(...arguments);this._missing=!1;this._settingsOpen=!1;this._offOpen=!1;this._holding=!1;this._held=!1;this._tab="people";this._error="";this._subscription=new oe(e=>{this._heater=e,this._missing=!1},()=>{this._missing=!0});this._holdEnd=()=>{window.clearTimeout(this._holdTimer),this._holding=!1}}static{this.properties={hass:{attribute:!1},_config:{state:!0},_heater:{state:!0},_missing:{state:!0},_selected:{state:!0},_sheet:{state:!0},_clock:{state:!0},_settingsOpen:{state:!0},_offOpen:{state:!0},_keep:{state:!0},_holding:{state:!0},_tab:{state:!0},_focus:{state:!0},_error:{state:!0}}}static async getStubConfig(e){let n=(await ve(e))[0];return n?{type:`custom:${F}`,entry_id:n.entry_id}:{type:`custom:${F}`}}setConfig(e){this._config=e}getCardSize(){return 6}get _language(){return this.hass?.locale?.language??this.hass?.language??"en"}get _hour24(){return it(this.hass?.locale?.time_format,this._language)}get _context(){return{language:this._language,timeZone:this.hass?.config?.time_zone??Intl.DateTimeFormat().resolvedOptions().timeZone,now:new Date,people:lt(this.hass?.states),hour24:this._hour24}}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._subscription.stop()}updated(e){(e.has("hass")||e.has("_config"))&&this._follow(),e.has("_offOpen")&&this._offOpen&&this.renderRoot.querySelector(".off-keep")?.focus(),e.has("_keep")&&this._keep&&!e.get("_keep")&&this.renderRoot.querySelector(".keep-chip.on")?.focus()}_follow(){this.hass&&this._config&&this.isConnected&&this._subscription.follow(this.hass,this._config.entry_id)}async _call(e){if(!this.hass||!this._heater)return!1;this._error="";try{return await this.hass.callWS({entry_id:this._heater.entry_id,...e}),!0}catch(n){let a=(n instanceof Error,n.message);return this._error=s(this._language,"card.error",{message:a??String(n)}),!1}}async _save(e){let n=this._sheet;if(!n||!Ce(n))return;await this._call({...n.id?{type:"hot_water_ready/ready_time/update",ready_time_id:n.id}:{type:"hot_water_ready/ready_time/add"},member_id:e.id,time:n.time,weekdays:[...n.weekdays].sort()})&&(this._sheet=void 0)}async _remove(e,n){await this._call({type:"hot_water_ready/ready_time/remove",member_id:e.id,ready_time_id:n})&&(this._sheet=void 0)}render(){let e=this._language;if(this._missing)return d`<ha-card><div class="message">${s(e,"card.no_heater")}</div></ha-card>`;let n=this._heater;if(!n)return d`<ha-card><div class="message">${s(e,"card.loading")}</div></ha-card>`;let a=K(n),r=ht(n,this._selected),o=qt(n,this._context);return d`
      <ha-card>
        ${zt(n,e).map(c=>d`<div class="banner fault" role="alert">${c}</div>`)}
        ${n.automatic?h:d`<div class="banner manual">${s(e,"manual")}</div>`}
        ${n.cluster_warning?d`<div class="banner warning" role="alert">${Wt(n,this._context)}</div>`:h}
        ${this._renderTop(n)}
        ${this._renderSettings(n)}
        ${this._renderTabs(n)}
        ${o&&this._tab==="week"?this._renderWeek(o):d`
              ${a==="member"?d`<div class="greeting">${At(n,e)}</div>`:this._renderAvatars(n,r)}
              ${a==="member"&&r?this._renderToday(n,r):h}
              ${r?d`<div class="panel">${this._renderListHead(r,a==="member")} ${this._renderList(r)}</div>
                    ${this._sheet?this._renderSheet(r,this._sheet):h}
                    ${this._sheet&&this._clock?this._renderClock(this._clock):h}`:d`<div class="message">${s(e,"members.none")}</div>`}
            `}
        ${this._error?d`<div class="error" role="alert">${this._error}</div>`:h}
        ${this._offOpen?this._renderSwitchOff(n):h}
        ${this._keep?this._renderKeepHot(n,this._keep):h}
      </ha-card>
    `}_renderListHead(e,n){let a=this._language,r=Tt(e,a),o=Et(e,this._context),c=(l,p)=>this._call({type:"hot_water_ready/away/set",member_id:e.id,away:l,until:p});return d`
      <div class="list-head">
        <div class="list-title">
          <span>${n?s(a,"list.mine"):r.name}</span>
          ${n?h:d`<span class="hint">${r.note}</span>`}
        </div>
        ${e.can_edit?d`<label class="away-toggle">
              ${o||s(a,"away.line")}
              <input
                type="checkbox"
                class="switch"
                .checked=${M(e.away.on)}
                @change=${l=>{c(l.target.checked,null)}}
              />
            </label>`:o?d`<span class="hint">${o}</span>`:h}
      </div>
      ${e.away.on?d`<div class="paused">
            <span>${s(a,"away.paused")}</span>
            ${e.can_edit?d`<label class="until">
                  ${s(a,"away.until_label")}
                  <input
                    type="date"
                    min=${ut(this._context)}
                    .value=${M(e.away.until??"")}
                    @change=${l=>{c(!0,l.target.value||null)}}
                  />
                </label>`:h}
          </div>`:h}
    `}_renderToday(e,n){let a=this._language,r=Ct(e,this._context,n.id);return d`<div class="today">
      <span class="today-label">${s(a,"today.label")}</span>
      ${r.length===0?d`<span>${s(a,"today.nobody")}</span>`:r.map(o=>d`<span
              class="chip ${o.mine?"mine":""}"
              style=${o.mine?"":`--chip: var(--${o.colour}-color, var(--primary-color))`}
              >${o.name} ${o.time}</span
            >`)}
    </div>`}_openIntegration(){history.pushState(null,"","/config/integrations/integration/hot_water_ready"),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_renderTop(e){let n=ct(e,this._context);return d`
      <div class="top">
        <div class="gauge ${n.tone==="heating"?"glowing":""}">
          <span class="pulse"></span>
          <span class="orbit"></span>
          <svg class="ring" viewBox="0 0 92 92" role="img" aria-label="${n.temperature} ${n.target}">
            <circle class="track" cx="46" cy="46" r=${Oe}></circle>
            ${n.fill>0?q`<circle class="fill ${n.tone}" cx="46" cy="46" r=${Oe}
                  stroke-dasharray="${n.fill*Bt} ${Bt}"
                  transform="rotate(-90 46 46)"></circle>`:h}
            <text class="temperature" x="46" y="44">${n.temperature}</text>
            <text class="target" x="46" y="61">${n.target}</text>
          </svg>
        </div>
        <div class="text">
          <div class="name-row">
            <div class="name">${e.name}</div>
            <span class="badge ${n.tone}">${n.badge}</span>
            ${e.settings?d`<button
                  class="settings-button"
                  aria-label=${s(this._language,"settings.open")}
                  aria-expanded=${this._settingsOpen}
                  @click=${()=>this._settingsOpen=!this._settingsOpen}
                >
                  ⚙
                </button>`:h}
          </div>
          <div class="headline ${n.tone}">${n.headline}</div>
          ${n.subline?d`<div class="subline">${n.subline}</div>`:h}
          ${n.element?d`<div class="subline">${n.element}</div>`:h}
          ${n.keepHot?d`<div class="subline">${n.keepHot}</div>`:h}
        </div>
        <div class="heat-now">
          ${Nt(e)?d`<button class="switch-off-link" @click=${()=>this._offOpen=!0}>
                ${s(this._language,"switch_off.link")}
              </button>`:h}
          ${Mt(e).map(a=>Ot(a)?d`<button
                    class="keep-more"
                    aria-label=${s(this._language,"keep_hot.more")}
                    title=${s(this._language,"keep_hot.more")}
                    @click=${()=>{this._openKeep(a)}}
                  >
                    ⋯
                  </button>
                  <button
                    class="primary holdable ${this._holding?"holding":""}"
                    @pointerdown=${()=>{this._holdStart(a)}}
                    @pointerup=${this._holdEnd}
                    @pointerleave=${this._holdEnd}
                    @pointercancel=${this._holdEnd}
                    @contextmenu=${r=>{r.preventDefault()}}
                    @click=${()=>{if(this._held){this._held=!1;return}this._call(a.message)}}
                  >
                    ${s(this._language,a.label)}
                  </button>`:d`<button
                  class="primary"
                  @click=${()=>{this._call(a.message)}}
                >
                  ${s(this._language,a.label)}
                </button>`)}
        </div>
      </div>
    `}_holdStart(e){this._held=!1,this._holding=!0,window.clearTimeout(this._holdTimer),this._holdTimer=window.setTimeout(()=>{this._holding=!1,this._held=!0,this._openKeep(e)},Pt)}_openKeep(e){this._heater&&(this._keep={action:e,minutes:this._heater.keep_hot_minutes})}_renderKeepHot(e,n){let a=this._language,r=()=>{this._keep=void 0,this._held=!1};return d`
      <div
        class="off-overlay"
        @click=${o=>{o.target===o.currentTarget&&r()}}
      >
        <div
          class="off-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="keep-title"
          @keydown=${o=>{o.key==="Escape"&&r()}}
        >
          <div class="off-title" id="keep-title">${s(a,"keep_hot.title")}</div>
          <p>${s(a,"keep_hot.hint")}</p>
          <div class="keep-chips" role="radiogroup" aria-labelledby="keep-title">
            ${Rt(e,a).map(o=>d`<button
                class="keep-chip ${o.minutes===n.minutes?"on":""}"
                role="radio"
                aria-checked=${o.minutes===n.minutes}
                @click=${()=>this._keep={...n,minutes:o.minutes}}
              >
                ${o.label}
              </button>`)}
          </div>
          <button
            class="keep-start primary"
            @click=${async()=>{await this._call({...n.action.message,keep_minutes:n.minutes})&&r()}}
          >
            ${s(a,n.action.label)}
          </button>
          <button class="off-keep" @click=${r}>${s(a,"keep_hot.cancel")}</button>
        </div>
      </div>
    `}_renderSwitchOff(e){let n=this._language,a=It(e,this._context),r=()=>this._offOpen=!1;return d`
      <div class="off-overlay">
        <div
          class="off-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="off-title"
          @keydown=${o=>{o.key==="Escape"&&r()}}
        >
          <div class="off-title" id="off-title">${a.title}</div>
          ${a.lines.map(o=>d`<p>${o}</p>`)}
          <button
            class="off-confirm"
            @click=${async()=>{await this._call({type:Dt})&&r()}}
          >
            ${s(n,"switch_off.confirm")}
          </button>
          <button class="off-keep" @click=${r}>${s(n,"switch_off.keep")}</button>
        </div>
      </div>
    `}_renderTabs(e){if(!e.week)return h;let n=a=>d`<button
      class="tab ${this._tab===a?"on":""}"
      role="tab"
      aria-selected=${this._tab===a}
      @click=${()=>this._tab=a}
    >
      ${s(this._language,`tabs.${a}`)}
    </button>`;return d`<div class="tabs" role="tablist">${n("people")}${n("week")}</div>`}_renderWeek(e){let n=this._language,a=this._focus;return d`
      <div class="week">
        <div class="totals">
          <div><b>${e.showers}</b><span>${s(n,"week.showers")}</span></div>
          <div><b>${e.windows}</b><span>${s(n,"week.windows")}</span></div>
          <div><b>${e.busiest||"-"}</b><span>${s(n,"week.busiest")}</span></div>
        </div>
        <div class="grid">
          <span></span>
          ${e.days.map(r=>d`<span class="head ${r.today?"is-today":""}">${r.label}</span>`)}
          ${e.rows.map(r=>d`
              <button
                class="who ${r.away?"away":""} ${a&&a!==r.id?"dim":""}"
                aria-pressed=${a===r.id}
                @click=${()=>this._focus=a===r.id?void 0:r.id}
              >
                <span class="mini" style="background: var(--${r.colour}-color, var(--primary-color))"
                  >${r.initial}</span
                >
                <span class="who-text"><span>${r.name}</span><span class="hint">${r.note}</span></span>
              </button>
              ${r.cells.map((o,c)=>d`<div
                  class="cell ${e.days[c]?.today?"is-today":""} ${a&&a!==r.id?"dim":""}"
                >
                  ${o.times.map(l=>d`<span
                      class="tag ${o.away?"away":""}"
                      style=${o.away?"":`background: var(--${r.colour}-color, var(--primary-color))`}
                      >${l}</span
                    >`)}
                </div>`)}
            `)}
          <span class="heating-label">${s(n,"week.heating")}</span>
          <div class="hours">
            ${e.hours.map(r=>d`<span class="hint" style="top: ${(r.at*100).toFixed(1)}%">${r.label}</span>`)}
          </div>
          ${e.days.map(r=>d`<div class="bar ${r.today?"is-today":""}">
              ${r.bars.map(o=>d`<span
                    class="heat"
                    style="top: ${(o.from*100).toFixed(1)}%; height: max(3px, ${(o.length*100).toFixed(1)}%)"
                  ></span>`)}
            </div>`)}
        </div>
        <div class="hint">${rt(n,this._hour24)}</div>
      </div>
    `}_renderSettings(e){let n=this._language,a=this._settingsOpen?Ut(e,this._context):void 0;if(!a)return h;let r=o=>this._call({type:Lt,...o});return d`
      <div class="sheet settings" role="dialog" aria-label=${s(n,"settings.open")}>
        <div class="sheet-head">
          <div class="sheet-title">${s(n,"settings.open")}</div>
          <button class="secondary" @click=${()=>this._settingsOpen=!1}>
            ${s(n,"settings.close")}
          </button>
        </div>
        ${this._renderStepper(a.target,`${a.target.shown} \xB0C`,s(n,"settings.target"),s(n,"settings.target_hint"),["settings.target_down","settings.target_up"],o=>r({target:o}))}
        ${this._renderStepper(a.margin,`\xB1 ${a.margin.shown}`,s(n,"settings.margin"),a.band,["settings.margin_down","settings.margin_up"],o=>r({margin:o}))}
        <label class="setting">
          <span class="setting-text">
            <span>${s(n,"settings.automatic")}</span>
            <span class="hint">${s(n,"settings.automatic_hint")}</span>
          </span>
          <input
            type="checkbox"
            class="switch"
            .checked=${M(a.automatic)}
            @change=${o=>r({automatic:o.target.checked})}
          />
        </label>
        <div class="setting column">
          <span>${s(n,"settings.switch_off")}</span>
          <div class="people" role="group" aria-label=${s(n,"settings.switch_off")}>
            <span class="hint">${s(n,"settings.switch_off_hint")}</span>
            ${a.people.length===0?d`<span class="hint">${s(n,"settings.no_people")}</span>`:h}
            ${a.people.map(o=>d`<label class="person">
                <input
                  type="checkbox"
                  .checked=${M(o.on)}
                  @change=${c=>{let l=c.target.checked;r({switch_off_people:Vt(a.people,o.id,l)})}}
                />
                ${o.name}
              </label>`)}
            <span class="hint">${s(n,"settings.own_cancel")}</span>
          </div>
        </div>
        ${this._renderSolar(a)}
        <button
          class="link"
          @click=${()=>{this._openIntegration()}}
        >
          ${s(n,"settings.more")}</button>
      </div>
    `}_renderStepper(e,n,a,r,o,c){let l=(p,m,u)=>d`<button
      class="step"
      aria-label=${s(this._language,m)}
      ?disabled=${p===null}
      @click=${()=>p===null?void 0:c(p)}
    >
      ${u}
    </button>`;return d`<div class="setting">
      <span class="setting-text"><span>${a}</span><span class="hint">${r}</span></span>
      ${l(e.down,o[0],"\u2212")}
      <span class="value">${n}</span>
      ${l(e.up,o[1],"+")}
    </div>`}_renderSolar(e){let n=this._language;return d`<div class="setting column solar">
      <span>${s(n,"solar.title")}</span>
      <span class="hint">${e.solar}</span>
      ${e.notes.map(a=>d`<span class="hint">${a}</span>`)}
    </div>`}_renderAvatars(e,n){if(!pt(e))return h;let a=K(e)==="admin";return d`
      <div class="avatars" role="tablist">
        ${St(e,n?.id).map(r=>d`
            <button
              class="avatar ${r.selected?"selected":""} ${r.faded?"faded":""}"
              role="tab"
              aria-selected=${r.selected}
              @click=${()=>{this._selected=r.id,this._sheet=void 0}}
            >
              <span class="dot" style="background: var(--${r.colour}-color, var(--primary-color))"
                >${r.initial}${r.star?d`<span class="star">★</span>`:h}</span
              >
              <span class="label">${r.name}</span>
            </button>
          `)}
        ${a?d`<button
              class="avatar add-member"
              @click=${()=>{this._openIntegration()}}
            >
              <span class="dot plus">+</span>
              <span class="label">${s(this._language,"members.add")}</span>
            </button>`:h}
      </div>
    `}_renderList(e){let n=this._language,a=kt(e,n,this._hour24);return d`
      <div class="list ${e.away.on?"paused-list":""}">
        ${a.length===0?d`<div class="empty">${s(n,"list.empty")}</div>`:h}
        ${a.map(r=>d`
            <div class="row ${r.enabled?"":"off"}">
              ${e.can_edit?d`<button
                    class="row-text"
                    aria-label=${s(n,"list.edit")}
                    @click=${()=>{this._sheet=mt(e,r.id),this._clock=void 0}}
                  >
                    ${this._rowText(r)}
                  </button>`:d`<div class="row-text">${this._rowText(r)}</div>`}
              ${e.can_edit?d`
                    <input
                      type="checkbox"
                      class="switch"
                      aria-label=${s(n,"list.switch")}
                      .checked=${M(r.enabled)}
                      @change=${o=>this._call({type:"hot_water_ready/ready_time/update",member_id:e.id,ready_time_id:r.id,enabled:o.target.checked})}
                    />
                  `:h}
            </div>
          `)}
        ${e.can_edit?d`<button
              class="add"
              @click=${()=>{this._sheet=gt(),this._clock=He(this._sheet.time,!0,this._hour24)}}
            >
              + ${s(n,"list.add")}
            </button>`:h}
      </div>
    `}_rowText(e){return d`<div class="time">${e.time}</div>
      <div class="days">
        ${e.days.map(n=>d`<span class="${n.on?"on":""}">${n.letter}</span>`)}
      </div>`}_renderSheet(e,n){let a=this._language,r=re(a),o=s(a,n.id?"sheet.edit_title":"sheet.title"),c=l=>{let p=n.weekdays.includes(l)?n.weekdays.filter(m=>m!==l):[...n.weekdays,l];this._sheet={...n,weekdays:p}};return d`
      <div class="sheet" role="dialog" aria-label=${o}>
        <div class="sheet-title">${o}</div>
        <div class="field">
          ${s(a,"sheet.time")}
          <button
            class="sheet-time"
            aria-label=${s(a,"clock.change")}
            @click=${()=>this._clock=He(n.time,!1,this._hour24)}
          >
            ${le(n.time,a,this._hour24)}
          </button>
        </div>
        <div class="field">
          ${s(a,"sheet.days")}
          <div class="day-toggles">
            ${r.map((l,p)=>d`<button
                  class="day ${n.weekdays.includes(p)?"on":""}"
                  aria-pressed=${n.weekdays.includes(p)}
                  @click=${()=>{c(p)}}
                >
                  ${l}
                </button>`)}
          </div>
        </div>
        <div class="actions">
          ${n.id?d`<button class="remove" @click=${()=>this._remove(e,n.id??"")}>
                ${s(a,"sheet.delete")}
              </button>`:h}
          <button class="secondary" @click=${()=>this._sheet=void 0}>${s(a,"sheet.cancel")}</button>
          <button class="primary" ?disabled=${!Ce(n)} @click=${()=>this._save(e)}>
            ${s(a,"sheet.save")}
          </button>
        </div>
      </div>
    `}_dialAt(e,n){let a=e.currentTarget.getBoundingClientRect(),r=y/a.width;return bt(n,(e.clientX-a.left)*r,(e.clientY-a.top)*r,this._hour24)}_clockDone(e){let n=Me(e,this._hour24);!n||!this._sheet||(this._sheet={...this._sheet,time:n},this._clock=void 0)}_clockCancel(e){e.fresh&&(this._sheet=void 0),this._clock=void 0}_renderClockInput(e,n,a){let r=s(this._language,n==="hour"?"sheet.hour":"sheet.minute");return d`<label class="clock-box">
      <input
        class="clock-input ${a?"":"invalid"}"
        inputmode="numeric"
        maxlength="2"
        autocomplete="off"
        aria-label=${r}
        .value=${M(n==="hour"?e.hourText:e.minuteText)}
        @input=${o=>{let c=o.target.value;this._clock=n==="hour"?{...e,hourText:c}:{...e,minuteText:c}}}
        @keydown=${o=>{o.key==="Enter"&&this._clockDone(e)}}
      />
      <span>${r}</span>
    </label>`}_renderClock(e){let n=this._language,a=this._hour24,r=e.mode==="keys",o=Me(e,a)!==void 0,c=s(n,r?"clock.title_keys":"clock.title"),l=a?h:d`<div class="clock-half" role="group">
          ${[!1,!0].map(g=>d`<button
                class=${e.hour>=12===g?"on":""}
                aria-pressed=${e.hour>=12===g}
                @click=${()=>this._clock=vt(e,g)}
              >
                ${s(n,g?"clock.pm":"clock.am")}
              </button>`)}
        </div>`,p=r?d`<div class="clock-head">
            ${this._renderClockInput(e,"hour",o)}
            <span class="clock-colon">:</span>
            ${this._renderClockInput(e,"minute",o)} ${l}
          </div>
          ${o?h:d`<div class="clock-invalid" role="alert">${s(n,"clock.invalid")}</div>`}`:d`<div class="clock-head">
          ${["hour","minute"].map((g,v)=>d`${v?d`<span class="clock-colon">:</span>`:h}
                <button
                  class="clock-part ${e.part===g?"on":""}"
                  aria-pressed=${e.part===g}
                  aria-label=${s(n,g==="hour"?"sheet.hour":"sheet.minute")}
                  @click=${()=>this._clock={...e,part:g}}
                >
                  ${g==="hour"?e.hourText:e.minuteText}
                </button>`)}
          ${l}
        </div>`,m=_t(e,a),u=y/2,f=r?h:d`<svg
          class="dial"
          viewBox="0 0 ${y} ${y}"
          role="slider"
          tabindex="0"
          aria-label=${s(n,e.part==="hour"?"sheet.hour":"sheet.minute")}
          aria-valuenow=${e.part==="hour"?e.hour:e.minute}
          aria-valuetext=${e.part==="hour"?e.hourText:e.minuteText}
          @pointerdown=${g=>{g.currentTarget.setPointerCapture(g.pointerId),this._clock=this._dialAt(g,e)}}
          @pointermove=${g=>{g.currentTarget.hasPointerCapture(g.pointerId)&&(this._clock=this._dialAt(g,this._clock??e))}}
          @pointerup=${()=>{this._clock?.part==="hour"&&(this._clock={...this._clock,part:"minute"})}}
          @keydown=${g=>{let v={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1}[g.key];v!==void 0&&(g.preventDefault(),this._clock=yt(e,v,a))}}
        >
          <circle class="dial-face" cx=${u} cy=${u} r=${u} />
          <line class="dial-hand" x1=${u} y1=${u} x2=${m.x} y2=${m.y} />
          <circle class="dial-hand-dot" cx=${u} cy=${u} r="4" />
          <circle class="dial-knob" cx=${m.x} cy=${m.y} r="20" />
          ${ft(e.part,a).map(g=>q`<text class="dial-mark ${wt(e,g,a)?"on":""}" x=${g.x} y=${g.y}>${g.label}</text>`)}
        </svg>`;return d`
      <div
        class="clock-overlay"
        @click=${g=>{g.target===g.currentTarget&&this._clockCancel(e)}}
      >
        <div class="clock-dialog" role="dialog" aria-modal="true" aria-label=${c}>
          <div class="clock-title">${c}</div>
          ${p} ${f}
          <div class="clock-actions">
            <button
              class="clock-mode"
              aria-label=${s(n,r?"clock.to_dial":"clock.to_keys")}
              title=${s(n,r?"clock.to_dial":"clock.to_keys")}
              @click=${()=>this._clock=$t(e,a)}
            >
              ${r?$n:xn}
            </button>
            <button
              class="clock-text"
              @click=${()=>{this._clockCancel(e)}}
            >
              ${s(n,"sheet.cancel")}
            </button>
            <button
              class="clock-text"
              ?disabled=${!o}
              @click=${()=>{this._clockDone(e)}}
            >
              ${s(n,"clock.ok")}
            </button>
          </div>
        </div>
      </div>
    `}static{this.styles=pe`
    :host {
      --hwr-ready: var(--success-color, #2e7d32);
      --hwr-heating: var(--warning-color, #ef6c00);
      --hwr-fault: var(--error-color, #c62828);
      --hwr-waiting: var(--info-color, #1565c0);
    }
    ha-card {
      position: relative;
      overflow: hidden;
    }
    button {
      font: inherit;
      color: inherit;
      cursor: pointer;
    }
    /* The ring and the text side by side, the buttons on a full-width row under both. */
    .top {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      column-gap: 16px;
      row-gap: 4px;
      padding: 16px;
    }
    /*
     * Pinned to the top, so the ring stays put when the text beside it grows (heating adds a line
     * and the switch-off link), with room on every side for the halo and the start pulse.
     */
    .gauge {
      position: relative;
      flex: none;
      align-self: flex-start;
      width: 92px;
      height: 92px;
      margin: 8px;
      border-radius: 50%;
    }
    .ring {
      position: relative;
      width: 92px;
      height: 92px;
    }
    /*
     * Heating: a warm ring and halo, two soft pulses when it starts, and a soft band of light that
     * keeps circling slowly, so the card shows it is working. Still under reduced motion.
     */
    .gauge.glowing {
      box-shadow:
        0 0 0 2px var(--hwr-heating),
        0 0 16px 4px color-mix(in srgb, var(--hwr-heating) 30%, transparent);
    }
    .orbit {
      display: none;
      position: absolute;
      inset: -9px;
      border-radius: 50%;
      pointer-events: none;
      background: conic-gradient(
        from 0turn,
        transparent 0turn,
        color-mix(in srgb, var(--hwr-heating) 80%, transparent) 0.1turn,
        transparent 0.28turn,
        transparent 1turn
      );
      /* Only the band around the ring, not its middle. */
      mask: radial-gradient(circle, transparent 58%, #000 62%);
      filter: blur(5px);
    }
    /* The band fades in once the two start pulses (2 x 2.4s) are over, then keeps circling. */
    .gauge.glowing .orbit {
      display: block;
      animation:
        hwr-orbit-in 0.8s ease-in 4.8s both,
        hwr-orbit 6s linear 4.8s infinite;
    }
    @keyframes hwr-orbit-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes hwr-orbit {
      to {
        transform: rotate(1turn);
      }
    }
    .pulse {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
    }
    .gauge.glowing .pulse {
      box-shadow: 0 0 16px 6px color-mix(in srgb, var(--hwr-heating) 55%, transparent);
      animation: hwr-pulse 2.4s ease-in-out 2;
    }
    @keyframes hwr-pulse {
      0%,
      100% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .gauge.glowing .pulse {
        animation: none;
      }
      .gauge.glowing .orbit {
        display: none;
      }
    }
    /* On the button's row, on the left, so heating does not add a line to the card. */
    .switch-off-link {
      margin-right: auto;
      text-align: left;
      min-height: 40px;
      border: 0;
      background: none;
      padding: 0 2px;
      color: var(--hwr-fault);
      font-weight: 500;
    }
    .off-overlay {
      position: fixed;
      inset: 0;
      z-index: 10;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background: var(--mdc-dialog-scrim-color, rgba(0, 0, 0, 0.32));
    }
    .off-sheet {
      width: 100%;
      max-width: 480px;
      box-sizing: border-box;
      padding: 20px 20px 28px;
      border-radius: 24px 24px 0 0;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .off-title {
      font-size: 20px;
      font-weight: 700;
    }
    .off-sheet p {
      margin: 0;
      font-size: 15px;
      line-height: 1.45;
    }
    .off-confirm,
    .off-keep {
      min-height: 48px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 500;
    }
    .off-confirm {
      margin-top: 6px;
      border: 0;
      background: var(--hwr-fault);
      color: var(--text-primary-color, #fff);
    }
    .off-keep {
      border: 1px solid var(--divider-color, #c5cad1);
      background: none;
      color: var(--primary-text-color);
    }
    .ring circle {
      fill: none;
      stroke-width: 9;
    }
    .track {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.25));
    }
    .fill {
      stroke-linecap: round;
      stroke: var(--hwr-waiting);
    }
    .fill.ready {
      stroke: var(--hwr-ready);
    }
    .fill.heating {
      stroke: var(--hwr-heating);
    }
    .fill.fault {
      stroke: var(--hwr-fault);
    }
    .temperature,
    .target {
      text-anchor: middle;
      fill: var(--primary-text-color);
    }
    .temperature {
      font-size: 20px;
      font-weight: 700;
    }
    .target {
      font-size: 10px; /* "target 42.5 °C" must fit inside the ring */
      fill: var(--secondary-text-color);
    }
    .text {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    .tabs {
      display: flex;
      gap: 6px;
      padding: 0 16px 10px;
    }
    .tab {
      flex: 1;
      min-height: 36px;
      border: 0;
      border-radius: 10px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      font-weight: 700;
    }
    .tab.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .week {
      padding: 0 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .totals {
      display: flex;
      gap: 8px;
    }
    .totals div {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 4px;
      border-radius: 10px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
      font-size: 11px;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .totals b {
      font-size: 18px;
      color: var(--primary-text-color);
    }
    .grid {
      display: grid;
      /* Fixed person column, so a long name never pushes Sunday off a phone screen. */
      grid-template-columns: 58px repeat(7, minmax(0, 1fr));
      gap: 3px;
      align-items: stretch;
      font-size: 11px;
    }
    .head {
      text-align: center;
      font-weight: 700;
      padding: 2px 0;
      border-radius: 6px;
    }
    .head.is-today {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .who {
      display: flex;
      align-items: center;
      gap: 4px;
      border: 0;
      background: none;
      padding: 2px 0;
      text-align: left;
      min-width: 0;
    }
    .who-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow: hidden;
    }
    .who-text span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mini {
      flex: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      color: var(--text-primary-color, #fff);
      font-weight: 700;
    }
    .who.away,
    .dim {
      opacity: 0.35;
    }
    .cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
      align-items: center;
      min-width: 0;
      padding: 2px 0;
      border-radius: 6px;
    }
    .cell.is-today,
    .bar.is-today {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
    }
    .tag {
      max-width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      font-size: 9.5px;
      padding: 1px 2px;
      border-radius: 4px;
      color: var(--text-primary-color, #fff);
      font-variant-numeric: tabular-nums;
    }
    .tag.away {
      color: var(--secondary-text-color);
      text-decoration: line-through;
    }
    .heating-label {
      grid-column: 1 / -1;
      font-weight: 700;
      padding-top: 6px;
    }
    .hours {
      position: relative;
    }
    .hours span {
      position: absolute;
      right: 4px;
      transform: translateY(-50%);
      font-size: 10px;
    }
    .bar {
      position: relative;
      height: 150px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
    }
    .heat {
      position: absolute;
      left: 2px;
      right: 2px;
      border-radius: 3px;
      background: var(--hwr-heating);
    }
    .name-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .badge {
      margin-left: auto;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--text-primary-color, #fff);
      background: var(--hwr-waiting);
    }
    .badge.ready {
      background: var(--hwr-ready);
    }
    .badge.heating {
      background: var(--hwr-heating);
    }
    .badge.fault {
      background: var(--hwr-fault);
    }
    .badge.manual {
      background: var(--secondary-text-color);
    }
    .settings-button {
      border: 0;
      background: none;
      font-size: 20px;
      min-width: 40px;
      min-height: 40px;
      color: var(--secondary-text-color);
    }
    .sheet-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sheet-head button,
    .step {
      min-height: 40px;
      padding: 0 14px;
      border-radius: 10px;
      border: 0;
      font-weight: 700;
    }
    .setting {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }
    .setting.column {
      flex-direction: column;
      align-items: stretch;
      gap: 6px;
    }
    .setting-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .hint {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .step {
      min-width: 40px;
      padding: 0;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    }
    .step[disabled] {
      opacity: 0.4;
    }
    .value {
      min-width: 64px;
      text-align: center;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .link {
      align-self: flex-start;
      border: 0;
      background: none;
      padding: 0;
      color: var(--primary-color);
      font-weight: 700;
    }
    .name,
    .subline {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .headline {
      font-size: 17px;
      font-weight: 700;
      color: var(--primary-text-color);
    }
    .headline.ready {
      color: var(--hwr-ready);
    }
    .headline.heating {
      color: var(--hwr-heating);
    }
    .headline.fault {
      color: var(--hwr-fault);
    }
    .avatars {
      display: flex;
      gap: 14px;
      padding: 4px 16px 8px;
      overflow-x: auto;
    }
    .avatar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border: 0;
      background: none;
      padding: 0;
      min-width: 52px;
      opacity: 0.6;
    }
    .avatar.selected {
      opacity: 1;
    }
    .avatar.faded .dot {
      opacity: 0.4;
    }
    .dot {
      position: relative;
    }
    .star {
      position: absolute;
      right: -4px;
      top: -4px;
      font-size: 13px;
      color: var(--warning-color, #ef6c00);
    }
    .dot.plus {
      background: none;
      border: 2px dashed var(--divider-color, #9aa2ad);
      color: var(--secondary-text-color);
      box-sizing: border-box;
    }
    .add-member {
      opacity: 1;
    }
    .greeting {
      padding: 0 16px 8px;
      font-size: 18px;
      font-weight: 700;
    }
    .today {
      margin: 0 16px 12px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      font-size: 14px;
    }
    .away-toggle,
    .until {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .until input {
      font: inherit;
      color: var(--primary-text-color);
      background: var(--secondary-background-color, transparent);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      padding: 4px 6px;
    }
    .panel {
      margin: 0 16px 16px;
      padding: 16px 16px 4px;
      border-radius: 20px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
    }
    .list-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .list-title {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 17px;
      font-weight: 800;
      min-width: 0;
    }
    .paused {
      margin-top: 10px;
      padding: 10px 12px;
      border-radius: 12px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--warning-color, #ef6c00) 14%, transparent);
    }
    .paused-list .row {
      opacity: 0.45;
    }
    .chip {
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 13px;
      color: var(--text-primary-color, #fff);
      background: var(--chip, var(--primary-color));
      font-variant-numeric: tabular-nums;
    }
    .chip.mine {
      background: none;
      color: var(--primary-color);
      box-shadow: inset 0 0 0 2px var(--primary-color);
      font-weight: 700;
    }
    .people {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-top: 4px;
    }
    .person {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .today-label {
      font-weight: 700;
      color: var(--primary-text-color);
    }
    .dot {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      color: var(--text-primary-color, #fff);
      font-weight: 700;
      font-size: 17px;
    }
    .avatar.selected .dot {
      box-shadow: 0 0 0 3px var(--card-background-color, #fff), 0 0 0 5px var(--primary-color);
    }
    .label {
      font-size: 12px;
    }
    .list {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 0;
      border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
    }
    .row-text {
      flex: 1;
      min-width: 0;
    }
    button.row-text {
      font: inherit;
      color: inherit;
      text-align: left;
      background: none;
      border: 0;
      padding: 0;
      cursor: pointer;
    }
    .row.off {
      opacity: 0.55;
    }
    .time {
      font-size: 38px;
      font-weight: 500;
      line-height: 1;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
    }
    .days {
      display: flex;
      gap: 4px;
      margin-top: 8px;
    }
    .days span {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-size: 11px;
      font-weight: 700;
      color: var(--disabled-text-color, #9aa2ad);
    }
    .days .on {
      color: var(--text-primary-color, #fff);
      background: var(--primary-color);
    }
    /* An on/off toggle drawn on a checkbox, as in mockup A. */
    .switch {
      appearance: none;
      -webkit-appearance: none;
      position: relative;
      flex: none;
      margin: 0;
      width: 46px;
      height: 28px;
      border-radius: 14px;
      cursor: pointer;
      background: var(--switch-unchecked-track-color, var(--disabled-text-color, #9aa2ad));
      transition: background 0.15s;
    }
    .switch::before {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--switch-unchecked-button-color, #fff);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
      transition: left 0.15s;
    }
    .switch:checked {
      background: var(--switch-checked-track-color, var(--primary-color));
    }
    .switch:checked::before {
      left: 21px;
      background: var(--switch-checked-button-color, #fff);
    }
    .away-toggle .switch:checked {
      background: var(--warning-color, #ef6c00);
    }
    .row .switch {
      width: 52px;
      height: 32px;
      border-radius: 16px;
    }
    .row .switch::before {
      top: 4px;
      left: 4px;
      width: 24px;
      height: 24px;
    }
    .row .switch:checked::before {
      left: 24px;
    }
    /* Delete sits apart from Cancel and Save, on the left, as in Android's alarm editor. */
    .actions .remove {
      margin-right: auto;
      background: none;
      color: var(--error-color, #c62828);
      font-weight: 500;
    }
    .add {
      margin: 12px 0;
      min-height: 44px;
      border: 1px dashed var(--divider-color, #9aa2ad);
      border-radius: 12px;
      background: none;
      color: var(--primary-color);
      font-weight: 700;
    }
    .empty,
    .message {
      padding: 8px 0;
      color: var(--secondary-text-color);
    }
    .message {
      padding: 16px;
    }
    .error {
      margin: 0 16px 16px;
      color: var(--hwr-fault);
    }
    .sheet {
      margin: 0 16px 16px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      border-radius: 12px;
      border: 1px solid var(--divider-color, #ccc);
    }
    .sheet-title {
      font-weight: 700;
      font-size: 16px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    /* The time on the sheet, large as in Android's alarm list; a tap opens the popup. */
    .sheet-time {
      align-self: flex-start;
      padding: 0 4px;
      border: 0;
      background: none;
      font-size: 44px;
      font-weight: 300;
      line-height: 1.1;
      color: var(--primary-text-color);
    }
    /* The time popup: a small dialog in the middle of the screen, as Android's clock. */
    .clock-overlay {
      position: fixed;
      inset: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: var(--mdc-dialog-scrim-color, rgba(0, 0, 0, 0.32));
    }
    .clock-dialog {
      width: 100%;
      max-width: 328px;
      box-sizing: border-box;
      padding: 24px 24px 12px;
      border-radius: 28px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .clock-title {
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .clock-head {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 8px;
    }
    .clock-colon {
      font-size: 48px;
      line-height: 80px;
    }
    .clock-part,
    .clock-input {
      width: 96px;
      height: 80px;
      box-sizing: border-box;
      border-radius: 10px;
      border: 2px solid transparent;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      color: var(--primary-text-color);
      font: inherit;
      font-size: 48px;
      text-align: center;
    }
    .clock-part.on,
    .clock-input:focus {
      background: color-mix(in srgb, var(--primary-color) 22%, transparent);
      color: var(--primary-color);
      outline: none;
    }
    .clock-input:focus {
      border-color: var(--primary-color);
    }
    .clock-input.invalid {
      border-color: var(--error-color, #c62828);
    }
    .clock-box {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .clock-invalid {
      margin-top: -12px;
      text-align: center;
      font-size: 12px;
      color: var(--error-color, #c62828);
    }
    .clock-half {
      display: flex;
      flex-direction: column;
      height: 80px;
      border: 1px solid var(--divider-color, #c5cad1);
      border-radius: 10px;
      overflow: hidden;
    }
    .clock-half button {
      flex: 1;
      min-width: 52px;
      border: 0;
      background: none;
      font-weight: 500;
    }
    .clock-half button.on {
      background: color-mix(in srgb, var(--primary-color) 22%, transparent);
      color: var(--primary-color);
    }
    .dial {
      display: block;
      width: 100%;
      max-width: 256px;
      align-self: center;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      cursor: pointer;
    }
    .dial:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 4px;
      border-radius: 50%;
    }
    .dial-face {
      fill: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    }
    .dial-hand {
      stroke: var(--primary-color);
      stroke-width: 2;
    }
    .dial-hand-dot,
    .dial-knob {
      fill: var(--primary-color);
    }
    .dial-mark {
      fill: var(--primary-text-color);
      font-size: 15px;
      text-anchor: middle;
      dominant-baseline: central;
      pointer-events: none;
    }
    .dial-mark.on {
      fill: var(--text-primary-color, #fff);
    }
    .clock-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .clock-mode {
      margin-right: auto;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 50%;
      background: none;
      color: var(--secondary-text-color);
    }
    .clock-text {
      min-height: 40px;
      padding: 0 12px;
      border: 0;
      border-radius: 20px;
      background: none;
      color: var(--primary-color);
      font-weight: 500;
    }
    .clock-text[disabled] {
      opacity: 0.4;
    }
    .day-toggles {
      display: flex;
      gap: 6px;
    }
    .day {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid var(--divider-color, #ccc);
      background: none;
    }
    .day.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color);
    }
    .banner {
      margin: 12px 16px 0;
      padding: 10px 12px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14px;
    }
    .banner.fault {
      background: var(--hwr-fault);
      color: var(--text-primary-color, #fff);
    }
    .banner.warning {
      background: var(--hwr-heating);
      color: var(--text-primary-color, #fff);
    }
    .banner.manual {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    }
    .heat-now {
      display: flex;
      grid-column: 1 / -1;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
    }
    .heat-now button {
      min-height: 40px;
      padding: 0 14px;
      border-radius: 10px;
      border: 0;
      font-weight: 700;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .actions button {
      min-height: 40px;
      padding: 0 16px;
      border-radius: 10px;
      border: 0;
      font-weight: 700;
    }
    .primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .primary[disabled] {
      opacity: 0.5;
    }
    /* Held for HOLD_MS, the fill crosses the button and the choice of time opens. */
    .holdable {
      position: relative;
      overflow: hidden;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      touch-action: manipulation;
    }
    .holdable::after {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.3);
      transform: scaleX(0);
      transform-origin: left;
      pointer-events: none;
    }
    .holdable.holding::after {
      transform: scaleX(1);
      transition: transform 500ms linear;
    }
    .heat-now .keep-more {
      min-width: 40px;
      padding: 0 8px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      color: var(--primary-text-color);
      font-size: 18px;
      line-height: 1;
    }
    .keep-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .keep-chip {
      min-height: 44px;
      min-width: 64px;
      padding: 0 14px;
      border-radius: 22px;
      border: 1px solid var(--divider-color, #c5cad1);
      background: none;
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 500;
    }
    .keep-chip.on {
      border-color: var(--primary-color);
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .keep-start {
      margin-top: 6px;
      min-height: 48px;
      border: 0;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 700;
    }
    .secondary {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    }
  `}};if(!customElements.get(F)){customElements.define(F,Pe);let i=window;i.customCards=i.customCards??[],i.customCards.push({type:F,name:"Hot Water Ready",description:"Water temperature, ready times and heat now.",preview:!0})}export{Pe as HotWaterReadyCard};
