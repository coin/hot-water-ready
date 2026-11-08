var W=globalThis,j=W.ShadowRoot&&(W.ShadyCSS===void 0||W.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,se=Symbol(),$e=new WeakMap,O=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==se)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(j&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=$e.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&$e.set(t,e))}return e}toString(){return this.cssText}},ke=i=>new O(typeof i=="string"?i:i+"",void 0,se),ae=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((n,s,a)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[a+1],i[0]);return new O(t,i,se)},Se=(i,e)=>{if(j)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let n=document.createElement("style"),s=W.litNonce;s!==void 0&&n.setAttribute("nonce",s),n.textContent=t.cssText,i.appendChild(n)}},re=j?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let n of e.cssRules)t+=n.cssText;return ke(t)})(i):i;var{is:Ht,defineProperty:Mt,getOwnPropertyDescriptor:Ot,getOwnPropertyNames:Rt,getOwnPropertySymbols:Pt,getPrototypeOf:Dt}=Object,B=globalThis,Ae=B.trustedTypes,Nt=Ae?Ae.emptyScript:"",It=B.reactiveElementPolyfillSupport,R=(i,e)=>i,oe={toAttribute(i,e){switch(e){case Boolean:i=i?Nt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},Te=(i,e)=>!Ht(i,e),Ce={attribute:!0,type:String,converter:oe,reflect:!1,useDefault:!1,hasChanged:Te};Symbol.metadata??=Symbol("metadata"),B.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ce){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),s=this.getPropertyDescriptor(e,n,t);s!==void 0&&Mt(this.prototype,e,s)}}static getPropertyDescriptor(e,t,n){let{get:s,set:a}=Ot(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:s,set(r){let c=s?.call(this);a?.call(this,r),this.requestUpdate(e,c,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ce}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let e=Dt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let t=this.properties,n=[...Rt(t),...Pt(t)];for(let s of n)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[n,s]of t)this.elementProperties.set(n,s)}this._$Eh=new Map;for(let[t,n]of this.elementProperties){let s=this._$Eu(t,n);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let s of n)t.unshift(re(s))}else e!==void 0&&t.push(re(e));return t}static _$Eu(e,t){let n=t.attribute;return n===!1?void 0:typeof n=="string"?n:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Se(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,n);if(s!==void 0&&n.reflect===!0){let a=(n.converter?.toAttribute!==void 0?n.converter:oe).toAttribute(t,n.type);this._$Em=e,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(e,t){let n=this.constructor,s=n._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let a=n.getPropertyOptions(s),r=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:oe;this._$Em=s;let c=r.fromAttribute(t,a.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(e,t,n,s=!1,a){if(e!==void 0){let r=this.constructor;if(s===!1&&(a=this[e]),n??=r.getPropertyOptions(e),!((n.hasChanged??Te)(a,t)||n.useDefault&&n.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,n))))return;this.C(e,t,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:s,wrapped:a},r){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),a!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[s,a]of n){let{wrapped:r}=a,c=this[s];r!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,a,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(t)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[R("elementProperties")]=new Map,_[R("finalized")]=new Map,It?.({ReactiveElement:_}),(B.reactiveElementVersions??=[]).push("2.1.2");var de=globalThis,Ee=i=>i,F=de.trustedTypes,He=F?F.createPolicy("lit-html",{createHTML:i=>i}):void 0,ce="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,pe="?"+y,Ut=`<${pe}>`,S=document,D=()=>S.createComment(""),N=i=>i===null||typeof i!="object"&&typeof i!="function",he=Array.isArray,Ne=i=>he(i)||typeof i?.[Symbol.iterator]=="function",le=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Me=/-->/g,Oe=/>/g,$=RegExp(`>|${le}(?:([^\\s"'>=/]+)(${le}*=${le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Re=/'/g,Pe=/"/g,Ie=/^(?:script|style|textarea|title)$/i,ue=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),d=ue(1),Ue=ue(2),pn=ue(3),f=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),De=new WeakMap,k=S.createTreeWalker(S,129);function Le(i,e){if(!he(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return He!==void 0?He.createHTML(e):e}var qe=(i,e)=>{let t=i.length-1,n=[],s,a=e===2?"<svg>":e===3?"<math>":"",r=P;for(let c=0;c<t;c++){let l=i[c],p,u,g=-1,m=0;for(;m<l.length&&(r.lastIndex=m,u=r.exec(l),u!==null);)m=r.lastIndex,r===P?u[1]==="!--"?r=Me:u[1]!==void 0?r=Oe:u[2]!==void 0?(Ie.test(u[2])&&(s=RegExp("</"+u[2],"g")),r=$):u[3]!==void 0&&(r=$):r===$?u[0]===">"?(r=s??P,g=-1):u[1]===void 0?g=-2:(g=r.lastIndex-u[2].length,p=u[1],r=u[3]===void 0?$:u[3]==='"'?Pe:Re):r===Pe||r===Re?r=$:r===Me||r===Oe?r=P:(r=$,s=void 0);let b=r===$&&i[c+1].startsWith("/>")?" ":"";a+=r===P?l+Ut:g>=0?(n.push(p),l.slice(0,g)+ce+l.slice(g)+y+b):l+y+(g===-2?c:b)}return[Le(i,a+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),n]},I=class i{constructor({strings:e,_$litType$:t},n){let s;this.parts=[];let a=0,r=0,c=e.length-1,l=this.parts,[p,u]=qe(e,t);if(this.el=i.createElement(p,n),k.currentNode=this.el.content,t===2||t===3){let g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(s=k.nextNode())!==null&&l.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(let g of s.getAttributeNames())if(g.endsWith(ce)){let m=u[r++],b=s.getAttribute(g).split(y),z=/([.?@])?(.*)/.exec(m);l.push({type:1,index:a,name:z[2],strings:b,ctor:z[1]==="."?Z:z[1]==="?"?G:z[1]==="@"?Q:C}),s.removeAttribute(g)}else g.startsWith(y)&&(l.push({type:6,index:a}),s.removeAttribute(g));if(Ie.test(s.tagName)){let g=s.textContent.split(y),m=g.length-1;if(m>0){s.textContent=F?F.emptyScript:"";for(let b=0;b<m;b++)s.append(g[b],D()),k.nextNode(),l.push({type:2,index:++a});s.append(g[m],D())}}}else if(s.nodeType===8)if(s.data===pe)l.push({type:2,index:a});else{let g=-1;for(;(g=s.data.indexOf(y,g+1))!==-1;)l.push({type:7,index:a}),g+=y.length-1}a++}}static createElement(e,t){let n=S.createElement("template");return n.innerHTML=e,n}};function A(i,e,t=i,n){if(e===f)return e;let s=n!==void 0?t._$Co?.[n]:t._$Cl,a=N(e)?void 0:e._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),a===void 0?s=void 0:(s=new a(i),s._$AT(i,t,n)),n!==void 0?(t._$Co??=[])[n]=s:t._$Cl=s),s!==void 0&&(e=A(i,s._$AS(i,e.values),s,n)),e}var K=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,s=(e?.creationScope??S).importNode(t,!0);k.currentNode=s;let a=k.nextNode(),r=0,c=0,l=n[0];for(;l!==void 0;){if(r===l.index){let p;l.type===2?p=new E(a,a.nextSibling,this,e):l.type===1?p=new l.ctor(a,l.name,l.strings,this,e):l.type===6&&(p=new Y(a,this,e)),this._$AV.push(p),l=n[++c]}r!==l?.index&&(a=k.nextNode(),r++)}return k.currentNode=S,s}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}},E=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,s){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=A(this,e,t),N(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==f&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ne(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(S.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,s=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=I.createElement(Le(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===s)this._$AH.p(t);else{let a=new K(s,this),r=a.u(this.options);a.p(t),this.T(r),this._$AH=a}}_$AC(e){let t=De.get(e.strings);return t===void 0&&De.set(e.strings,t=new I(e)),t}k(e){he(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,n,s=0;for(let a of e)s===t.length?t.push(n=new i(this.O(D()),this.O(D()),this,this.options)):n=t[s],n._$AI(a),s++;s<t.length&&(this._$AR(n&&n._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let n=Ee(e).nextSibling;Ee(e).remove(),e=n}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,s,a){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=a,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=h}_$AI(e,t=this,n,s){let a=this.strings,r=!1;if(a===void 0)e=A(this,e,t,0),r=!N(e)||e!==this._$AH&&e!==f,r&&(this._$AH=e);else{let c=e,l,p;for(e=a[0],l=0;l<a.length-1;l++)p=A(this,c[n+l],t,l),p===f&&(p=this._$AH[l]),r||=!N(p)||p!==this._$AH[l],p===h?e=h:e!==h&&(e+=(p??"")+a[l+1]),this._$AH[l]=p}r&&!s&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Z=class extends C{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},G=class extends C{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},Q=class extends C{constructor(e,t,n,s,a){super(e,t,n,s,a),this.type=5}_$AI(e,t=this){if((e=A(this,e,t,0)??h)===f)return;let n=this._$AH,s=e===h&&n!==h||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,a=e!==h&&(n===h||s);s&&this.element.removeEventListener(this.name,this,n),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Y=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){A(this,e)}},Ve={M:ce,P:y,A:pe,C:1,L:qe,R:K,D:Ne,V:A,I:E,H:C,N:G,U:Q,B:Z,F:Y},Lt=de.litHtmlPolyfillSupport;Lt?.(I,E),(de.litHtmlVersions??=[]).push("3.3.3");var ze=(i,e,t)=>{let n=t?.renderBefore??e,s=n._$litPart$;if(s===void 0){let a=t?.renderBefore??null;n._$litPart$=s=new E(e.insertBefore(D(),a),a,void 0,t??{})}return s._$AI(i),s};var ge=globalThis,v=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ze(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return f}};v._$litElement$=!0,v.finalized=!0,ge.litElementHydrateSupport?.({LitElement:v});var qt=ge.litElementPolyfillSupport;qt?.({LitElement:v});(ge.litElementVersions??=[]).push("4.2.2");var T={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},We=i=>(...e)=>({_$litDirective$:i,values:e}),J=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:An}=Ve;var je=i=>i.strings===void 0;var Vt={},Be=(i,e=Vt)=>i._$AH=e;var H=We(class extends J{constructor(i){if(super(i),i.type!==T.PROPERTY&&i.type!==T.ATTRIBUTE&&i.type!==T.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!je(i))throw Error("`live` bindings can only contain a single expression")}render(i){return i}update(i,[e]){if(e===f||e===h)return e;let t=i.element,n=i.name;if(i.type===T.PROPERTY){if(e===t[n])return f}else if(i.type===T.BOOLEAN_ATTRIBUTE){if(!!e===t.hasAttribute(n))return f}else if(i.type===T.ATTRIBUTE&&t.getAttribute(n)===e+"")return f;return Be(i),e}});var zt={"status.waiting":"Idle","status.heating":"Heating","status.ready":"Ready","status.fault":"Fault","status.manual":"Manual","headline.heating_for":"Heating: ready in about {minutes} min","headline.ready_at":"Ready at {when}","subline.next_at":"Next at {when}","when.today":"{time}","when.tomorrow":"{time} tomorrow","when.weekday":"{time} on {weekday}","ring.target":"target {target}\xB0","weekday.letters":"M,T,W,T,F,S,S","members.none":"No members yet. An administrator adds them in the integration's settings.","list.empty":"No ready times yet.","list.add":"Add a ready time","list.remove":"Remove","list.switch":"On or off","sheet.title":"New ready time","sheet.edit_title":"Change ready time","list.edit":"Change this ready time","sheet.time":"Time","sheet.hour":"Hour","sheet.minute":"Minute","sheet.days":"Days","sheet.save":"Save","sheet.cancel":"Cancel","fault.sensor_unavailable":"Fault: the water temperature sensor gives no readings. Heating has stopped.","fault.not_rising":"Fault: the water is not getting hotter. Heating has stopped; see Repairs.","fault.no_consumption":"Fault: the heater draws no power. Heating has stopped; see Repairs.","fault.relay_stuck":"Fault: the heater draws power while switched off. Check the relay.","element.on":"Heater on","element.off":"Heater off","element.drawing":"{state} \xB7 drawing {watts} W","keep_hot.until":"Keeping hot until {time}","keep_hot.title":"Keep hot after it's ready","keep_hot.hint":'After the "ready" message the heater keeps the water hot this long, then switches off.',"keep_hot.more":"Choose how long to keep it hot","keep_hot.cancel":"Cancel","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h",manual:"Automatic control is off: the heater is run by hand.","note.not_rising_skipped":'The thermostat does not say when it is heating, so the "water not getting hotter" and "heater draws no power" checks are not made.',"heat_now.start":"Heat now","heat_now.cancel":"Cancel","heat_now.join":"Tell me when it's hot","heat_now.leave":"Don't tell me","subline.for":"For {list}.","item.at":"{name} at {time}","switch_off.link":"Switch off the heating\u2026","switch_off.title":"Switch off the heating?","switch_off.confirm":"Switch off","switch_off.keep":"Cancel","switch_off.asked_one":"{names} will no longer be told.","switch_off.asked_many":"{names} will no longer be told.","switch_off.skipped_one":"Without hot water: {list}.","switch_off.skipped_many":"Without hot water: {list}.","switch_off.back":"It switches back on by itself for the next ready time.","switch_off.nobody":"Heating stops now.","settings.switch_off":"Who may switch off the heating for everyone","settings.switch_off_hint":"The administrators and:","settings.own_cancel":"Whoever asked may always cancel their own request.",greeting:"Hello, {name}","today.label":"House today","today.nobody":"Nobody today","away.until_label":"Until (optional)","away.line":"Away","away.line_until":"Away until {date}","members.add":"Member","card.no_heater":"No Hot Water Ready heater is set up yet.","card.loading":"Loading\u2026","card.error":"That did not work: {message}","cluster.warning":"The showers from {when} need the water at {needed} \xB0C, but the heater goes only to {cap} \xB0C: the last ones may run cooler.","tabs.people":"People","tabs.week":"Week","week.days":"Mon,Tue,Wed,Thu,Fri,Sat,Sun","week.showers":"showers","week.windows":"heating windows","week.busiest":"busiest day","week.heating":"Heating","week.away":"away","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} a week","week.hint":"Tap a person to highlight their times. The bars show when the heater may heat each day ({start} to {end}).","settings.open":"Heater settings","settings.close":"Close","settings.target":"Target temperature","settings.target_hint":"Ready when the water gets here","settings.target_down":"Lower the target","settings.target_up":"Raise the target","settings.margin":"Margin","settings.band":"Stops at {stop} \xB0C, restarts at {restart} \xB0C","settings.margin_down":"Lower the margin","settings.margin_up":"Raise the margin","settings.automatic":"Automatic control","settings.automatic_hint":"Off: the heater is run by hand","settings.more":"More settings","solar.title":"Solar comparison","solar.none":"No windows recorded in the last 30 days yet.","solar.would":"With the solar-aware rule on, the water would have been ready on time in {on_time} of {windows} windows","solar.did":"With the solar-aware rule, the water was ready on time in {on_time} of {windows} windows","solar.would_less":", and the heater would have run {minutes} minutes less","solar.would_more":", and the heater would have run {minutes} minutes more","solar.did_less":", and the heater ran {minutes} minutes less","solar.did_more":", and the heater ran {minutes} minutes more","solar.kwh":", about {kwh} kWh","solar.applied":" The rule was applied in {applied} of them: on time in {on_time}.","subline.starts_at":"Starts heating around {when}.","subline.starts_at_solar":"Starts heating around {when}, if the sun has not done it by then.","subline.asked_by_one":"Asked for by {name}. They are told when it is ready.","subline.asked_by_many":"Asked for by {names}. Each is told when it is ready.","names.and":" and ","today.you":"You","list.mine":"My ready times","list.count_one":"1 ready time","list.count":"{count} ready times","list.virtual":"Virtual member \xB7 shared household times","away.paused":"Paused. The times are kept.","settings.no_people":"There are no people in Home Assistant to choose from yet."},Wt={"status.waiting":"Em espera","status.heating":"A aquecer","status.ready":"Pronta","status.fault":"Avaria","status.manual":"Manual","headline.heating_for":"A aquecer: pronta em cerca de {minutes} min","headline.ready_at":"Pronta \xE0s {when}","subline.next_at":"Pr\xF3xima \xE0s {when}","when.today":"{time}","when.tomorrow":"{time} de amanh\xE3","when.weekday":"{time} de {weekday}","ring.target":"alvo {target}\xB0","weekday.letters":"S,T,Q,Q,S,S,D","members.none":"Ainda n\xE3o h\xE1 membros. Um administrador acrescenta-os nas defini\xE7\xF5es da integra\xE7\xE3o.","list.empty":"Ainda n\xE3o h\xE1 hor\xE1rios.","list.add":"Acrescentar um hor\xE1rio","list.remove":"Remover","list.switch":"Ligar ou desligar","sheet.title":"Novo hor\xE1rio","sheet.edit_title":"Alterar hor\xE1rio","list.edit":"Alterar este hor\xE1rio","sheet.time":"Hora","sheet.hour":"Horas","sheet.minute":"Minutos","sheet.days":"Dias","sheet.save":"Guardar","sheet.cancel":"Cancelar","fault.sensor_unavailable":"Avaria: o sensor da temperatura da \xE1gua n\xE3o d\xE1 leituras. O aquecimento parou.","fault.not_rising":"Avaria: a \xE1gua n\xE3o aquece. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.no_consumption":"Avaria: o aquecedor n\xE3o consome energia. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.relay_stuck":"Avaria: o aquecedor consome energia com o rel\xE9 desligado. Verifique o rel\xE9.","element.on":"Resist\xEAncia ligada","element.off":"Resist\xEAncia desligada","element.drawing":"{state} \xB7 a consumir {watts} W","keep_hot.until":"A manter a \xE1gua quente at\xE9 \xE0s {time}","keep_hot.title":"Manter quente depois de pronta","keep_hot.hint":"Depois do aviso de pronta, o aquecedor mant\xE9m a \xE1gua quente durante este tempo e depois desliga.","keep_hot.more":"Escolher quanto tempo manter quente","keep_hot.cancel":"Cancelar","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h",manual:"O controlo autom\xE1tico est\xE1 desligado: o aquecedor est\xE1 a ser comandado manualmente.","note.not_rising_skipped":'O term\xF3stato n\xE3o indica quando est\xE1 a aquecer, por isso as verifica\xE7\xF5es "a \xE1gua n\xE3o aquece" e "o aquecedor n\xE3o consome energia" n\xE3o s\xE3o feitas.',"heat_now.start":"Aquecer agora","heat_now.cancel":"Cancelar","heat_now.join":"Avisar-me quando estiver quente","heat_now.leave":"N\xE3o me avisar","subline.for":"Para {list}.","item.at":"{name} \xE0s {time}","switch_off.link":"Desligar o aquecimento\u2026","switch_off.title":"Desligar o aquecimento?","switch_off.confirm":"Desligar","switch_off.keep":"Cancelar","switch_off.asked_one":"{names} j\xE1 n\xE3o recebe o aviso.","switch_off.asked_many":"{names} j\xE1 n\xE3o recebem o aviso.","switch_off.skipped_one":"Fica sem \xE1gua quente: {list}.","switch_off.skipped_many":"Ficam sem \xE1gua quente: {list}.","switch_off.back":"Volta a ligar-se por si para o pr\xF3ximo hor\xE1rio.","switch_off.nobody":"O aquecimento p\xE1ra agora.","settings.switch_off":"Quem pode desligar o aquecimento para todos","settings.switch_off_hint":"Os administradores e:","settings.own_cancel":"Quem pediu pode sempre cancelar o seu pr\xF3prio pedido.",greeting:"Ol\xE1, {name}","today.label":"Casa hoje","today.nobody":"Ningu\xE9m hoje","away.until_label":"At\xE9 (opcional)","away.line":"Ausente","away.line_until":"Ausente at\xE9 {date}","members.add":"Membro","card.no_heater":"Ainda n\xE3o h\xE1 nenhum aquecedor do Hot Water Ready configurado.","card.loading":"A carregar\u2026","card.error":"N\xE3o foi poss\xEDvel: {message}","cluster.warning":"Os duches a partir das {when} precisam da \xE1gua a {needed} \xB0C, mas o aquecedor s\xF3 aquece at\xE9 {cap} \xB0C: os \xFAltimos podem sair menos quentes.","tabs.people":"Pessoas","tabs.week":"Semana","week.days":"Seg,Ter,Qua,Qui,Sex,S\xE1b,Dom","week.showers":"duches","week.windows":"janelas de aquecimento","week.busiest":"dia mais cheio","week.heating":"Aquecimento","week.away":"ausente","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} por semana","week.hint":"Toque numa pessoa para destacar os seus hor\xE1rios. As barras mostram quando o aquecedor pode aquecer em cada dia ({start} a {end}).","settings.open":"Defini\xE7\xF5es do aquecedor","settings.close":"Fechar","settings.target":"Temperatura alvo","settings.target_hint":"Avisa quando chega aqui","settings.target_down":"Baixar o alvo","settings.target_up":"Subir o alvo","settings.margin":"Margem","settings.band":"P\xE1ra a {stop} \xB0C, retoma a {restart} \xB0C","settings.margin_down":"Baixar a margem","settings.margin_up":"Subir a margem","settings.automatic":"Controlo autom\xE1tico","settings.automatic_hint":"Desligado: o aquecedor fica em modo manual","settings.more":"Mais defini\xE7\xF5es","solar.title":"Compara\xE7\xE3o solar","solar.none":"Ainda n\xE3o h\xE1 janelas registadas nos \xFAltimos 30 dias.","solar.would":"Com a regra solar ligada, a \xE1gua teria ficado pronta a tempo em {on_time} de {windows} janelas","solar.did":"Com a regra solar, a \xE1gua ficou pronta a tempo em {on_time} de {windows} janelas","solar.would_less":", e o aquecedor teria trabalhado menos {minutes} minutos","solar.would_more":", e o aquecedor teria trabalhado mais {minutes} minutos","solar.did_less":", e o aquecedor trabalhou menos {minutes} minutos","solar.did_more":", e o aquecedor trabalhou mais {minutes} minutos","solar.kwh":", cerca de {kwh} kWh","solar.applied":" A regra foi aplicada em {applied} delas: a tempo em {on_time}.","subline.starts_at":"Come\xE7a a aquecer por volta das {when}.","subline.starts_at_solar":"Come\xE7a a aquecer por volta das {when}, se o sol n\xE3o chegar.","subline.asked_by_one":"Pedido por {name}. Recebe um aviso quando estiver pronta.","subline.asked_by_many":"Pedido por {names}. Cada um \xE9 avisado quando estiver pronta.","names.and":" e ","today.you":"Voc\xEA","list.mine":"Os meus hor\xE1rios","list.count_one":"1 hor\xE1rio","list.count":"{count} hor\xE1rios","list.virtual":"Membro virtual \xB7 hor\xE1rios partilhados da casa","away.paused":"Em pausa. Os hor\xE1rios ficam guardados.","settings.no_people":"Ainda n\xE3o h\xE1 pessoas no Home Assistant para escolher."},jt={en:zt,pt:Wt};function X(i){return i?.toLowerCase().startsWith("pt")?"pt":"en"}function x(i){return X(i)==="pt"?"pt-PT":"en-GB"}function ee(i){return o(i,"weekday.letters").split(",")}function o(i,e,t={}){return jt[X(i)][e].replace(/\{(\w+)\}/g,(s,a)=>String(t[a]??s))}function me(i){return i.callWS({type:"hot_water_ready/heaters"})}var te=class{constructor(e,t){this.onSnapshot=e;this.onMissing=t;this.generation=0}async follow(e,t){let n=this.generation,s=t;if(s===void 0){if(this.defaultEntryId??=me(e).then(r=>r[0]?.entry_id),s=await this.defaultEntryId,n!==this.generation)return;if(s===void 0){this.defaultEntryId=void 0,this.onMissing();return}}if(s===this.entryId)return;this.stop();let a=this.generation;this.entryId=s,this.stopSubscription=e.connection.subscribeMessage(r=>{a===this.generation&&this.onSnapshot(r)},{type:"hot_water_ready/subscribe",entry_id:s}),this.stopSubscription.catch(()=>{a===this.generation&&(this.entryId=void 0,this.onMissing())})}stop(){this.generation++;let e=this.stopSubscription;this.stopSubscription=void 0,this.entryId=void 0,e?.then(t=>t()).catch(()=>{})}};function Ke(i,e){if(i==="24")return!0;if(i==="12")return!1;let t=i==="system"?void 0:e;return!new Intl.DateTimeFormat(t,{hour:"numeric"}).format(new Date(2023,0,1,22)).includes("10")}function Ze(i,e,t,n){return n?`${String(i).padStart(2,"0")}:${String(e).padStart(2,"0")}`:new Intl.DateTimeFormat(x(t),{timeZone:"UTC",hour:"numeric",minute:"2-digit",hourCycle:"h12"}).format(Date.UTC(2e3,0,1,i,e))}function Ge(i,e,t=!0){let[n=0,s=0]=i.split(":").map(Number);return Ze(n,s,e,t)}function Qe(i,e=!0){return Array.from({length:24},(t,n)=>{let s=String(n).padStart(2,"0");if(e)return{value:s,label:s};let a=new Intl.DateTimeFormat(x(i),{timeZone:"UTC",hour:"numeric",hourCycle:"h12"}).format(Date.UTC(2e3,0,1,n));return{value:s,label:a}})}function fe(i,e,t=!0){return t?`${String(i).padStart(2,"0")}h`:new Intl.DateTimeFormat(x(e),{timeZone:"UTC",hour:"numeric",hourCycle:"h12"}).format(Date.UTC(2e3,0,1,i%24))}function Ye(i,e=!0){return o(i,"week.hint",{start:fe(M/60,i,e),end:fe(L/60,i,e)})}var Je=Array.from({length:60},(i,e)=>String(e).padStart(2,"0"));function w(i,e,t){return new Intl.NumberFormat(x(e),{maximumFractionDigits:t}).format(i)}function U(i,e){return new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(i)}function Xe(i){let e=new Date(`${i}T12:00:00Z`);return e.setUTCDate(e.getUTCDate()+1),e.toISOString().slice(0,10)}function ne(i,e){let{language:t,timeZone:n,now:s}=e,a=new Date(i),r=ie(i,e),c=U(s,n);if(U(a,n)===c)return o(t,"when.today",{time:r});if(U(a,n)===Xe(c))return o(t,"when.tomorrow",{time:r});let l=new Intl.DateTimeFormat(x(t),{timeZone:n,weekday:"long"}).format(a);return o(t,"when.weekday",{time:r,weekday:l})}function Bt(i,e){let{language:t}=e;return i.status==="heating"&&i.ready_in_minutes!==null?o(t,"headline.heating_for",{minutes:i.ready_in_minutes}):i.status==="waiting"&&i.next_ready?o(t,"headline.ready_at",{when:ne(i.next_ready.at,e)}):o(t,`status.${i.status}`)}function et(i){return new Map(i.members.map(e=>[e.id,e]))}function _e(i,e,t){let n=et(i);return e.map(s=>n.get(s)?.name??t.people?.[s]??s)}function tt(i){let e={};for(let[t,n]of Object.entries(i??{}))t.startsWith("person.")&&(e[t]=n.attributes.friendly_name??t);return e}function ye(i,e){return i.length<2?i.join(""):`${i.slice(0,-1).join(", ")}${o(e,"names.and")}${i.at(-1)??""}`}function nt(i,e,t){let n=e.map(s=>o(t.language,"item.at",{name:_e(i,[s.member],t)[0]??"",time:ie(s.at,t)}));return ye(n,t.language)}function Ft(i,e){let{language:t}=e,n=i.heat_now?.requesters??[];if(i.status==="heating"&&n.length>0){let s=_e(i,n,e);return s.length===1?o(t,"subline.asked_by_one",{name:s[0]??""}):o(t,"subline.asked_by_many",{names:ye(s,t)})}if(i.status==="heating"&&i.heating_for.length>0)return o(t,"subline.for",{list:nt(i,i.heating_for,e)});if(i.status==="waiting"&&i.next_heat_start){let s=i.solar_aware?"subline.starts_at_solar":"subline.starts_at";return o(t,s,{when:ne(i.next_heat_start,e)})}return i.status==="ready"&&i.next_ready?o(t,"subline.next_at",{when:ne(i.next_ready.at,e)}):""}function Kt(i,e){if(i.element_on===null)return"";let t=o(e,i.element_on?"element.on":"element.off");return i.power_w===null?t:o(e,"element.drawing",{state:t,watts:w(i.power_w,e,0)})}function it(i,e){let{language:t}=e,{temperature:n,target:s}=i;return{temperature:n===null?"\u2013":`${w(n,t,1)}\xB0`,target:o(t,"ring.target",{target:w(s,t,1)}),badge:o(t,`status.${i.status}`).toLocaleUpperCase(x(t)),headline:Bt(i,e),subline:Ft(i,e),element:Kt(i,t),keepHot:Jt(i,e),fill:n===null||s<=0?0:Math.min(1,Math.max(0,n/s)),tone:i.status}}function Zt(i,e){let t=e??i.me;return i.members.find(n=>n.id===t)??i.members[0]}function st(i){let e=q(i);return e==="admin"?!0:e==="viewer"&&i.members.length>1}function at(i,e){return Zt(i,q(i)==="member"?void 0:e)}function rt(i){return U(i.now,i.timeZone)}function ot(){return{time:"07:00",weekdays:[0,1,2,3,4]}}function lt(i,e){let t=i.ready_times.find(n=>n.id===e);return t&&{id:t.id,time:t.time,weekdays:[...t.weekdays].sort()}}function be(i){return i.time!==""&&i.weekdays.length>0}function dt(i,e,t=!0){let n=ee(e);return[...i.ready_times].sort((s,a)=>s.time.localeCompare(a.time)||s.id.localeCompare(a.id)).map(s=>({id:s.id,time:Ge(s.time,e,t),enabled:s.enabled,days:n.map((a,r)=>({letter:a,on:s.weekdays.includes(r)}))}))}function q(i){return i.is_admin?"admin":i.me?"member":"viewer"}function ct(i,e){return i.members.map(t=>({id:t.id,name:t.name,initial:t.name.slice(0,1).toLocaleUpperCase(),colour:t.colour,star:t.virtual,faded:t.away.on,selected:t.id===e}))}function pt(i,e){let t=i.members.find(n=>n.id===i.me);return t?o(e,"greeting",{name:t.name}):""}function ie(i,e){let{minutes:t}=we(i,e.timeZone);return Ze(Math.floor(t/60),t%60,e.language,e.hour24??!0)}function ht(i,e,t){let n=et(i);return i.today.map(s=>{let a=s.member===t,r=n.get(s.member);return{name:a?o(e.language,"today.you"):r?.name??"?",time:ie(s.at,e),colour:r?.colour??"",mine:a}})}function ut(i,e){let t=i.ready_times.length,n=o(e,"list.count",{count:t});return i.virtual?n=o(e,"list.virtual"):t===1&&(n=o(e,"list.count_one")),{name:i.name,note:n}}function Gt(i,e){let t=new Date(`${i}T12:00:00Z`),n=x(e),s=new Intl.DateTimeFormat(n,{timeZone:"UTC",day:"numeric"}).format(t),a=new Intl.DateTimeFormat(n,{timeZone:"UTC",month:"long"}).format(t);return X(e)==="pt"?`${s} de ${a.slice(0,1).toLocaleUpperCase("pt-PT")}${a.slice(1)}`:`${s} ${a}`}function gt(i,e){return i.away.on?i.away.until?o(e.language,"away.line_until",{date:Gt(i.away.until,e.language)}):o(e.language,"away.line"):""}var mt="hot_water_ready/heat_now/start",Qt="hot_water_ready/heat_now/cancel";function ft(i){let e=i.can_ask_heat_now&&!i.heat_now_blocked&&i.automatic,t=i.heat_now;if(t?.asked){let s=t.requesters.length===1&&!t.unnamed;return[{message:{type:Qt},label:s?"heat_now.cancel":"heat_now.leave"}]}if(!e)return[];if(t===null&&i.heating_for.some(s=>s.member===i.me))return[];let n=i.status==="heating"||t!==null;return[{message:{type:mt},label:n?"heat_now.join":"heat_now.start"}]}function wt(i){return i.message.type===mt}var _t=500,Yt=[5,15,30,60,120];function yt(i,e){let t=i.keep_hot_minutes;return[...new Set([...Yt,t])].sort((s,a)=>s-a).map(s=>({minutes:s,label:s>=60&&s%60===0?o(e,"keep_hot.hours",{n:w(s/60,e,0)}):o(e,"keep_hot.minutes",{n:w(s,e,0)}),isDefault:s===t}))}function Jt(i,e){let t=i.heat_now?.keep_until;return t?o(e.language,"keep_hot.until",{time:ie(t,e)}):""}var bt="hot_water_ready/switch_off";function vt(i){let e=(i.heat_now?.requesters.length??0)>0||!!i.heat_now?.unnamed;return i.can_switch_off&&(i.status==="heating"||e)}function xt(i,e){let{language:t}=e,n=(i.heat_now?.requesters??[]).filter(r=>r!==i.viewer),s=i.heating_for.filter(r=>r.member!==i.viewer),a=[];if(n.length>0){let r=ye(_e(i,n,e),t);a.push(o(t,n.length===1?"switch_off.asked_one":"switch_off.asked_many",{names:r}))}if(s.length>0){let r=nt(i,s,e);a.push(o(t,s.length===1?"switch_off.skipped_one":"switch_off.skipped_many",{list:r}))}return a.length===0&&a.push(o(t,"switch_off.nobody")),i.heating_for.length>0&&a.push(o(t,"switch_off.back")),{title:o(t,"switch_off.title"),lines:a}}function $t(i,e){return i.faults.map(t=>o(e,`fault.${t}`))}var kt="hot_water_ready/settings/set",Xt={min:30,max:75,step:.5},en={min:0,max:5,step:.5};function Fe(i,e,t){let n=Math.ceil(i/e.step-1e-9)*e.step-e.step,s=Math.floor(i/e.step+1e-9)*e.step+e.step;return{shown:w(i,t,1),down:n>=e.min-1e-9?n:null,up:s<=e.max+1e-9?s:null}}function St(i,e){let{language:t}=e,n=i.settings;if(!(!i.is_admin||!n))return{target:Fe(i.target,Xt,t),margin:Fe(i.margin,en,t),band:o(t,"settings.band",{stop:w(i.target+i.margin,t,1),restart:w(i.target-i.margin,t,1)}),automatic:i.automatic,people:Object.entries(e.people??{}).map(([s,a])=>({id:s,name:a,on:n.switch_off_people.includes(s)})).sort((s,a)=>s.name.localeCompare(a.name)),solar:tn(n,t),notes:i.not_rising_checked?[]:[o(t,"note.not_rising_skipped")]}}function At(i,e,t){return i.filter(n=>n.id===e?t:n.on).map(n=>n.id)}function tn(i,e){let{windows:t,on_time:n,minutes_saved:s,kwh:a}=i.solar;if(t===0)return o(e,"solar.none");let r=i.solar_aware?"did":"would",c=o(e,`solar.${r}`,{on_time:n,windows:t});s!==0&&(c+=o(e,`solar.${r}_${s>0?"less":"more"}`,{minutes:Math.abs(s)}),a!==null&&(c+=o(e,"solar.kwh",{kwh:w(Math.abs(a),e,1)}))),c+=".";let{solar_windows:l,solar_on_time:p}=i.solar;return l>0&&(c+=o(e,"solar.applied",{applied:l,on_time:p})),c}var M=300,L=1440;function we(i,e){let t=new Date(i),n=new Intl.DateTimeFormat("en-GB",{timeZone:e,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).reduce((s,a)=>({...s,[a.type]:a.value}),{});return{day:U(t,e),minutes:Number(n.hour)*60+Number(n.minute)}}function Ct(i,e){let t=i.week;if(!i.is_admin||!t)return;let n=o(e.language,"week.days").split(","),s=n.map((l,p)=>nn(t.monday,p)),a=i.members.map(l=>an(l,s,e.language,e.hour24??!0)),r=s.map((l,p)=>a.reduce((u,g)=>{let m=g.cells[p];return m&&!m.away?u+m.times.length:u},0)),c=Math.max(0,...r);return{days:s.map((l,p)=>({key:l,label:n[p]??l,today:l===t.today,bars:rn(l,t.windows,e.timeZone)})),hours:[6,12,18,24].map(l=>({label:fe(l,e.language,e.hour24??!0),at:(l*60-M)/(L-M)})),rows:a,showers:r.reduce((l,p)=>l+p,0),windows:t.windows.length,busiest:c>0?n[r.indexOf(c)]??"":""}}function nn(i,e){let t=i;for(let n=0;n<e;n+=1)t=Xe(t);return t}function sn(i,e){return i.away.on&&(i.away.until===null||e<=i.away.until)}function an(i,e,t,n){let s=i.ready_times.filter(p=>p.enabled),a=e.map((p,u)=>({times:s.filter(g=>g.weekdays.includes(u)).map(g=>g.time).sort().map(g=>Ge(g,t,n)),away:sn(i,p)})),r=a.every(p=>p.away),c=a.reduce((p,u)=>p+u.times.length,0),l=o(t,"week.per_week",{count:c});return r?l=o(t,"week.away"):i.virtual&&(l=o(t,"week.virtual",{count:c})),{id:i.id,name:i.name,colour:i.colour,initial:i.virtual?"\u2605":i.name[0]??"?",away:r,note:l,cells:a}}function rn(i,e,t){let n=L-M,s=[];for(let a of e){let r=we(a.start,t),c=we(a.end,t);if(r.day>i||c.day<i)continue;let l=Math.max(M,r.day<i?0:r.minutes),p=Math.min(L,c.day>i?L:c.minutes);p>l&&s.push({from:(l-M)/n,length:(p-l)/n})}return s}function Tt(i,e){let t=i.cluster_warning;return t?o(e.language,"cluster.warning",{when:ne(t.at,e),needed:w(t.needed,e.language,0),cap:w(t.cap,e.language,1)}):""}var V="hot-water-ready-card",ve=38,Et=2*Math.PI*ve,xe=class extends v{constructor(){super(...arguments);this._missing=!1;this._settingsOpen=!1;this._offOpen=!1;this._holding=!1;this._held=!1;this._tab="people";this._error="";this._subscription=new te(t=>{this._heater=t,this._missing=!1},()=>{this._missing=!0});this._holdEnd=()=>{window.clearTimeout(this._holdTimer),this._holding=!1}}static{this.properties={hass:{attribute:!1},_config:{state:!0},_heater:{state:!0},_missing:{state:!0},_selected:{state:!0},_sheet:{state:!0},_settingsOpen:{state:!0},_offOpen:{state:!0},_keep:{state:!0},_holding:{state:!0},_tab:{state:!0},_focus:{state:!0},_error:{state:!0}}}static async getStubConfig(t){let n=(await me(t))[0];return n?{type:`custom:${V}`,entry_id:n.entry_id}:{type:`custom:${V}`}}setConfig(t){this._config=t}getCardSize(){return 6}get _language(){return this.hass?.locale?.language??this.hass?.language??"en"}get _hour24(){return Ke(this.hass?.locale?.time_format,this._language)}get _context(){return{language:this._language,timeZone:this.hass?.config?.time_zone??Intl.DateTimeFormat().resolvedOptions().timeZone,now:new Date,people:tt(this.hass?.states),hour24:this._hour24}}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._subscription.stop()}updated(t){(t.has("hass")||t.has("_config"))&&this._follow(),t.has("_offOpen")&&this._offOpen&&this.renderRoot.querySelector(".off-keep")?.focus(),t.has("_keep")&&this._keep&&!t.get("_keep")&&this.renderRoot.querySelector(".keep-chip.on")?.focus()}_follow(){this.hass&&this._config&&this.isConnected&&this._subscription.follow(this.hass,this._config.entry_id)}async _call(t){if(!this.hass||!this._heater)return!1;this._error="";try{return await this.hass.callWS({entry_id:this._heater.entry_id,...t}),!0}catch(n){let s=(n instanceof Error,n.message);return this._error=o(this._language,"card.error",{message:s??String(n)}),!1}}async _save(t){let n=this._sheet;if(!n||!be(n))return;await this._call({...n.id?{type:"hot_water_ready/ready_time/update",ready_time_id:n.id}:{type:"hot_water_ready/ready_time/add"},member_id:t.id,time:n.time,weekdays:[...n.weekdays].sort()})&&(this._sheet=void 0)}render(){let t=this._language;if(this._missing)return d`<ha-card><div class="message">${o(t,"card.no_heater")}</div></ha-card>`;let n=this._heater;if(!n)return d`<ha-card><div class="message">${o(t,"card.loading")}</div></ha-card>`;let s=q(n),a=at(n,this._selected),r=Ct(n,this._context);return d`
      <ha-card>
        ${$t(n,t).map(c=>d`<div class="banner fault" role="alert">${c}</div>`)}
        ${n.automatic?h:d`<div class="banner manual">${o(t,"manual")}</div>`}
        ${n.cluster_warning?d`<div class="banner warning" role="alert">${Tt(n,this._context)}</div>`:h}
        ${this._renderTop(n)}
        ${this._renderSettings(n)}
        ${this._renderTabs(n)}
        ${r&&this._tab==="week"?this._renderWeek(r):d`
              ${s==="member"?d`<div class="greeting">${pt(n,t)}</div>`:this._renderAvatars(n,a)}
              ${s==="member"&&a?this._renderToday(n,a):h}
              ${a?d`<div class="panel">${this._renderListHead(a,s==="member")} ${this._renderList(a)}</div>
                    ${this._sheet?this._renderSheet(a,this._sheet):h}`:d`<div class="message">${o(t,"members.none")}</div>`}
            `}
        ${this._error?d`<div class="error" role="alert">${this._error}</div>`:h}
        ${this._offOpen?this._renderSwitchOff(n):h}
        ${this._keep?this._renderKeepHot(n,this._keep):h}
      </ha-card>
    `}_renderListHead(t,n){let s=this._language,a=ut(t,s),r=gt(t,this._context),c=(l,p)=>this._call({type:"hot_water_ready/away/set",member_id:t.id,away:l,until:p});return d`
      <div class="list-head">
        <div class="list-title">
          <span>${n?o(s,"list.mine"):a.name}</span>
          ${n?h:d`<span class="hint">${a.note}</span>`}
        </div>
        ${t.can_edit?d`<label class="away-toggle">
              ${r||o(s,"away.line")}
              <input
                type="checkbox"
                class="switch"
                .checked=${H(t.away.on)}
                @change=${l=>{c(l.target.checked,null)}}
              />
            </label>`:r?d`<span class="hint">${r}</span>`:h}
      </div>
      ${t.away.on?d`<div class="paused">
            <span>${o(s,"away.paused")}</span>
            ${t.can_edit?d`<label class="until">
                  ${o(s,"away.until_label")}
                  <input
                    type="date"
                    min=${rt(this._context)}
                    .value=${H(t.away.until??"")}
                    @change=${l=>{c(!0,l.target.value||null)}}
                  />
                </label>`:h}
          </div>`:h}
    `}_renderToday(t,n){let s=this._language,a=ht(t,this._context,n.id);return d`<div class="today">
      <span class="today-label">${o(s,"today.label")}</span>
      ${a.length===0?d`<span>${o(s,"today.nobody")}</span>`:a.map(r=>d`<span
              class="chip ${r.mine?"mine":""}"
              style=${r.mine?"":`--chip: var(--${r.colour}-color, var(--primary-color))`}
              >${r.name} ${r.time}</span
            >`)}
    </div>`}_openIntegration(){history.pushState(null,"","/config/integrations/integration/hot_water_ready"),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_renderTop(t){let n=it(t,this._context);return d`
      <div class="top">
        <div class="gauge ${n.tone==="heating"?"glowing":""}">
          <span class="pulse"></span>
          <span class="orbit"></span>
          <svg class="ring" viewBox="0 0 92 92" role="img" aria-label="${n.temperature} ${n.target}">
            <circle class="track" cx="46" cy="46" r=${ve}></circle>
            ${n.fill>0?Ue`<circle class="fill ${n.tone}" cx="46" cy="46" r=${ve}
                  stroke-dasharray="${n.fill*Et} ${Et}"
                  transform="rotate(-90 46 46)"></circle>`:h}
            <text class="temperature" x="46" y="44">${n.temperature}</text>
            <text class="target" x="46" y="61">${n.target}</text>
          </svg>
        </div>
        <div class="text">
          <div class="name-row">
            <div class="name">${t.name}</div>
            <span class="badge ${n.tone}">${n.badge}</span>
            ${t.settings?d`<button
                  class="settings-button"
                  aria-label=${o(this._language,"settings.open")}
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
          ${vt(t)?d`<button class="switch-off-link" @click=${()=>this._offOpen=!0}>
                ${o(this._language,"switch_off.link")}
              </button>`:h}
          ${ft(t).map(s=>wt(s)?d`<button
                    class="primary holdable ${this._holding?"holding":""}"
                    @pointerdown=${()=>{this._holdStart(s)}}
                    @pointerup=${this._holdEnd}
                    @pointerleave=${this._holdEnd}
                    @pointercancel=${this._holdEnd}
                    @contextmenu=${a=>{a.preventDefault()}}
                    @click=${()=>{if(this._held){this._held=!1;return}this._call(s.message)}}
                  >
                    ${o(this._language,s.label)}
                  </button>
                  <button
                    class="keep-more"
                    aria-label=${o(this._language,"keep_hot.more")}
                    title=${o(this._language,"keep_hot.more")}
                    @click=${()=>{this._openKeep(s)}}
                  >
                    ⋯
                  </button>`:d`<button
                  class="primary"
                  @click=${()=>{this._call(s.message)}}
                >
                  ${o(this._language,s.label)}
                </button>`)}
        </div>
      </div>
    `}_holdStart(t){this._held=!1,this._holding=!0,window.clearTimeout(this._holdTimer),this._holdTimer=window.setTimeout(()=>{this._holding=!1,this._held=!0,this._openKeep(t)},_t)}_openKeep(t){this._heater&&(this._keep={action:t,minutes:this._heater.keep_hot_minutes})}_renderKeepHot(t,n){let s=this._language,a=()=>{this._keep=void 0,this._held=!1};return d`
      <div
        class="off-overlay"
        @click=${r=>{r.target===r.currentTarget&&a()}}
      >
        <div
          class="off-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="keep-title"
          @keydown=${r=>{r.key==="Escape"&&a()}}
        >
          <div class="off-title" id="keep-title">${o(s,"keep_hot.title")}</div>
          <p>${o(s,"keep_hot.hint")}</p>
          <div class="keep-chips" role="radiogroup" aria-labelledby="keep-title">
            ${yt(t,s).map(r=>d`<button
                class="keep-chip ${r.minutes===n.minutes?"on":""}"
                role="radio"
                aria-checked=${r.minutes===n.minutes}
                @click=${()=>this._keep={...n,minutes:r.minutes}}
              >
                ${r.label}
              </button>`)}
          </div>
          <button
            class="keep-start primary"
            @click=${async()=>{await this._call({...n.action.message,keep_minutes:n.minutes})&&a()}}
          >
            ${o(s,n.action.label)}
          </button>
          <button class="off-keep" @click=${a}>${o(s,"keep_hot.cancel")}</button>
        </div>
      </div>
    `}_renderSwitchOff(t){let n=this._language,s=xt(t,this._context),a=()=>this._offOpen=!1;return d`
      <div class="off-overlay">
        <div
          class="off-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="off-title"
          @keydown=${r=>{r.key==="Escape"&&a()}}
        >
          <div class="off-title" id="off-title">${s.title}</div>
          ${s.lines.map(r=>d`<p>${r}</p>`)}
          <button
            class="off-confirm"
            @click=${async()=>{await this._call({type:bt})&&a()}}
          >
            ${o(n,"switch_off.confirm")}
          </button>
          <button class="off-keep" @click=${a}>${o(n,"switch_off.keep")}</button>
        </div>
      </div>
    `}_renderTabs(t){if(!t.week)return h;let n=s=>d`<button
      class="tab ${this._tab===s?"on":""}"
      role="tab"
      aria-selected=${this._tab===s}
      @click=${()=>this._tab=s}
    >
      ${o(this._language,`tabs.${s}`)}
    </button>`;return d`<div class="tabs" role="tablist">${n("people")}${n("week")}</div>`}_renderWeek(t){let n=this._language,s=this._focus;return d`
      <div class="week">
        <div class="totals">
          <div><b>${t.showers}</b><span>${o(n,"week.showers")}</span></div>
          <div><b>${t.windows}</b><span>${o(n,"week.windows")}</span></div>
          <div><b>${t.busiest||"-"}</b><span>${o(n,"week.busiest")}</span></div>
        </div>
        <div class="grid">
          <span></span>
          ${t.days.map(a=>d`<span class="head ${a.today?"is-today":""}">${a.label}</span>`)}
          ${t.rows.map(a=>d`
              <button
                class="who ${a.away?"away":""} ${s&&s!==a.id?"dim":""}"
                aria-pressed=${s===a.id}
                @click=${()=>this._focus=s===a.id?void 0:a.id}
              >
                <span class="mini" style="background: var(--${a.colour}-color, var(--primary-color))"
                  >${a.initial}</span
                >
                <span class="who-text"><span>${a.name}</span><span class="hint">${a.note}</span></span>
              </button>
              ${a.cells.map((r,c)=>d`<div
                  class="cell ${t.days[c]?.today?"is-today":""} ${s&&s!==a.id?"dim":""}"
                >
                  ${r.times.map(l=>d`<span
                      class="tag ${r.away?"away":""}"
                      style=${r.away?"":`background: var(--${a.colour}-color, var(--primary-color))`}
                      >${l}</span
                    >`)}
                </div>`)}
            `)}
          <span class="heating-label">${o(n,"week.heating")}</span>
          <div class="hours">
            ${t.hours.map(a=>d`<span class="hint" style="top: ${(a.at*100).toFixed(1)}%">${a.label}</span>`)}
          </div>
          ${t.days.map(a=>d`<div class="bar ${a.today?"is-today":""}">
              ${a.bars.map(r=>d`<span
                    class="heat"
                    style="top: ${(r.from*100).toFixed(1)}%; height: max(3px, ${(r.length*100).toFixed(1)}%)"
                  ></span>`)}
            </div>`)}
        </div>
        <div class="hint">${Ye(n,this._hour24)}</div>
      </div>
    `}_renderSettings(t){let n=this._language,s=this._settingsOpen?St(t,this._context):void 0;if(!s)return h;let a=r=>this._call({type:kt,...r});return d`
      <div class="sheet settings" role="dialog" aria-label=${o(n,"settings.open")}>
        <div class="sheet-head">
          <div class="sheet-title">${o(n,"settings.open")}</div>
          <button class="secondary" @click=${()=>this._settingsOpen=!1}>
            ${o(n,"settings.close")}
          </button>
        </div>
        ${this._renderStepper(s.target,`${s.target.shown} \xB0C`,o(n,"settings.target"),o(n,"settings.target_hint"),["settings.target_down","settings.target_up"],r=>a({target:r}))}
        ${this._renderStepper(s.margin,`\xB1 ${s.margin.shown}`,o(n,"settings.margin"),s.band,["settings.margin_down","settings.margin_up"],r=>a({margin:r}))}
        <label class="setting">
          <span class="setting-text">
            <span>${o(n,"settings.automatic")}</span>
            <span class="hint">${o(n,"settings.automatic_hint")}</span>
          </span>
          <input
            type="checkbox"
            class="switch"
            .checked=${H(s.automatic)}
            @change=${r=>a({automatic:r.target.checked})}
          />
        </label>
        <div class="setting column">
          <span>${o(n,"settings.switch_off")}</span>
          <div class="people" role="group" aria-label=${o(n,"settings.switch_off")}>
            <span class="hint">${o(n,"settings.switch_off_hint")}</span>
            ${s.people.length===0?d`<span class="hint">${o(n,"settings.no_people")}</span>`:h}
            ${s.people.map(r=>d`<label class="person">
                <input
                  type="checkbox"
                  .checked=${H(r.on)}
                  @change=${c=>{let l=c.target.checked;a({switch_off_people:At(s.people,r.id,l)})}}
                />
                ${r.name}
              </label>`)}
            <span class="hint">${o(n,"settings.own_cancel")}</span>
          </div>
        </div>
        ${this._renderSolar(s)}
        <button
          class="link"
          @click=${()=>{this._openIntegration()}}
        >
          ${o(n,"settings.more")}</button>
      </div>
    `}_renderStepper(t,n,s,a,r,c){let l=(p,u,g)=>d`<button
      class="step"
      aria-label=${o(this._language,u)}
      ?disabled=${p===null}
      @click=${()=>p===null?void 0:c(p)}
    >
      ${g}
    </button>`;return d`<div class="setting">
      <span class="setting-text"><span>${s}</span><span class="hint">${a}</span></span>
      ${l(t.down,r[0],"\u2212")}
      <span class="value">${n}</span>
      ${l(t.up,r[1],"+")}
    </div>`}_renderSolar(t){let n=this._language;return d`<div class="setting column solar">
      <span>${o(n,"solar.title")}</span>
      <span class="hint">${t.solar}</span>
      ${t.notes.map(s=>d`<span class="hint">${s}</span>`)}
    </div>`}_renderAvatars(t,n){if(!st(t))return h;let s=q(t)==="admin";return d`
      <div class="avatars" role="tablist">
        ${ct(t,n?.id).map(a=>d`
            <button
              class="avatar ${a.selected?"selected":""} ${a.faded?"faded":""}"
              role="tab"
              aria-selected=${a.selected}
              @click=${()=>{this._selected=a.id,this._sheet=void 0}}
            >
              <span class="dot" style="background: var(--${a.colour}-color, var(--primary-color))"
                >${a.initial}${a.star?d`<span class="star">★</span>`:h}</span
              >
              <span class="label">${a.name}</span>
            </button>
          `)}
        ${s?d`<button
              class="avatar add-member"
              @click=${()=>{this._openIntegration()}}
            >
              <span class="dot plus">+</span>
              <span class="label">${o(this._language,"members.add")}</span>
            </button>`:h}
      </div>
    `}_renderList(t){let n=this._language,s=dt(t,n,this._hour24);return d`
      <div class="list ${t.away.on?"paused-list":""}">
        ${s.length===0?d`<div class="empty">${o(n,"list.empty")}</div>`:h}
        ${s.map(a=>d`
            <div class="row ${a.enabled?"":"off"}">
              ${t.can_edit?d`<button
                    class="row-text"
                    aria-label=${o(n,"list.edit")}
                    @click=${()=>this._sheet=lt(t,a.id)}
                  >
                    ${this._rowText(a)}
                  </button>`:d`<div class="row-text">${this._rowText(a)}</div>`}
              ${t.can_edit?d`
                    <input
                      type="checkbox"
                      class="switch"
                      aria-label=${o(n,"list.switch")}
                      .checked=${H(a.enabled)}
                      @change=${r=>this._call({type:"hot_water_ready/ready_time/update",member_id:t.id,ready_time_id:a.id,enabled:r.target.checked})}
                    />
                    <button
                      class="remove"
                      aria-label=${o(n,"list.remove")}
                      @click=${()=>this._call({type:"hot_water_ready/ready_time/remove",member_id:t.id,ready_time_id:a.id})}
                    >
                      ×
                    </button>
                  `:h}
            </div>
          `)}
        ${t.can_edit?d`<button class="add" @click=${()=>this._sheet=ot()}>
              + ${o(n,"list.add")}
            </button>`:h}
      </div>
    `}_rowText(t){return d`<div class="time">${t.time}</div>
      <div class="days">
        ${t.days.map(n=>d`<span class="${n.on?"on":""}">${n.letter}</span>`)}
      </div>`}_renderSheet(t,n){let s=this._language,a=ee(s),[r="07",c="00"]=n.time.split(":"),l=o(s,n.id?"sheet.edit_title":"sheet.title"),p=u=>{let g=n.weekdays.includes(u)?n.weekdays.filter(m=>m!==u):[...n.weekdays,u];this._sheet={...n,weekdays:g}};return d`
      <div class="sheet" role="dialog" aria-label=${l}>
        <div class="sheet-title">${l}</div>
        <div class="field">
          ${o(s,"sheet.time")}
          <div class="time-picker">
            <select
              aria-label=${o(s,"sheet.hour")}
              @change=${u=>{this._sheet={...n,time:`${u.target.value}:${c}`}}}
            >
              ${Qe(s,this._hour24).map(u=>d`<option value=${u.value} ?selected=${u.value===r}>${u.label}</option>`)}
            </select>
            <span>:</span>
            <select
              aria-label=${o(s,"sheet.minute")}
              @change=${u=>{this._sheet={...n,time:`${r}:${u.target.value}`}}}
            >
              ${Je.map(u=>d`<option value=${u} ?selected=${u===c}>${u}</option>`)}
            </select>
          </div>
        </div>
        <div class="field">
          ${o(s,"sheet.days")}
          <div class="day-toggles">
            ${a.map((u,g)=>d`<button
                  class="day ${n.weekdays.includes(g)?"on":""}"
                  aria-pressed=${n.weekdays.includes(g)}
                  @click=${()=>{p(g)}}
                >
                  ${u}
                </button>`)}
          </div>
        </div>
        <div class="actions">
          <button class="secondary" @click=${()=>this._sheet=void 0}>${o(s,"sheet.cancel")}</button>
          <button class="primary" ?disabled=${!be(n)} @click=${()=>this._save(t)}>
            ${o(s,"sheet.save")}
          </button>
        </div>
      </div>
    `}static{this.styles=ae`
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
    .remove {
      border: 0;
      background: none;
      font-size: 20px;
      color: var(--secondary-text-color);
      min-width: 32px;
      min-height: 32px;
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
    .time-picker {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 24px;
      color: var(--primary-text-color);
    }
    .field select {
      font: inherit;
      font-size: 24px;
      color: var(--primary-text-color);
      background: var(--secondary-background-color, transparent);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      padding: 6px 8px;
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
  `}};if(!customElements.get(V)){customElements.define(V,xe);let i=window;i.customCards=i.customCards??[],i.customCards.push({type:V,name:"Hot Water Ready",description:"Water temperature, ready times and heat now.",preview:!0})}export{xe as HotWaterReadyCard};
