var q=globalThis,z=q.ShadowRoot&&(q.ShadyCSS===void 0||q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ee=Symbol(),we=new WeakMap,E=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==ee)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(z&&e===void 0){let a=t!==void 0&&t.length===1;a&&(e=we.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&we.set(t,e))}return e}toString(){return this.cssText}},_e=n=>new E(typeof n=="string"?n:n+"",void 0,ee),te=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((a,s,i)=>a+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[i+1],n[0]);return new E(t,n,ee)},ve=(n,e)=>{if(z)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let a=document.createElement("style"),s=q.litNonce;s!==void 0&&a.setAttribute("nonce",s),a.textContent=t.cssText,n.appendChild(a)}},ae=z?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let a of e.cssRules)t+=a.cssText;return _e(t)})(n):n;var{is:dt,defineProperty:ct,getOwnPropertyDescriptor:pt,getOwnPropertyNames:ht,getOwnPropertySymbols:ut,getPrototypeOf:gt}=Object,W=globalThis,be=W.trustedTypes,mt=be?be.emptyScript:"",ft=W.reactiveElementPolyfillSupport,H=(n,e)=>n,ne={toAttribute(n,e){switch(e){case Boolean:n=n?mt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},xe=(n,e)=>!dt(n,e),$e={attribute:!0,type:String,converter:ne,reflect:!1,useDefault:!1,hasChanged:xe};Symbol.metadata??=Symbol("metadata"),W.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$e){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let a=Symbol(),s=this.getPropertyDescriptor(e,a,t);s!==void 0&&ct(this.prototype,e,s)}}static getPropertyDescriptor(e,t,a){let{get:s,set:i}=pt(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:s,set(r){let d=s?.call(this);i?.call(this,r),this.requestUpdate(e,d,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$e}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;let e=gt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){let t=this.properties,a=[...ht(t),...ut(t)];for(let s of a)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[a,s]of t)this.elementProperties.set(a,s)}this._$Eh=new Map;for(let[t,a]of this.elementProperties){let s=this._$Eu(t,a);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let a=new Set(e.flat(1/0).reverse());for(let s of a)t.unshift(ae(s))}else e!==void 0&&t.push(ae(e));return t}static _$Eu(e,t){let a=t.attribute;return a===!1?void 0:typeof a=="string"?a:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ve(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){let a=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,a);if(s!==void 0&&a.reflect===!0){let i=(a.converter?.toAttribute!==void 0?a.converter:ne).toAttribute(t,a.type);this._$Em=e,i==null?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(e,t){let a=this.constructor,s=a._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let i=a.getPropertyOptions(s),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:ne;this._$Em=s;let d=r.fromAttribute(t,i.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(e,t,a,s=!1,i){if(e!==void 0){let r=this.constructor;if(s===!1&&(i=this[e]),a??=r.getPropertyOptions(e),!((a.hasChanged??xe)(i,t)||a.useDefault&&a.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,a))))return;this.C(e,t,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:s,wrapped:i},r){a&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),i!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,i]of this._$Ep)this[s]=i;this._$Ep=void 0}let a=this.constructor.elementProperties;if(a.size>0)for(let[s,i]of a){let{wrapped:r}=i,d=this[s];r!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,i,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(a=>a.hostUpdate?.()),this.update(t)):this._$EM()}catch(a){throw e=!1,this._$EM(),a}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[H("elementProperties")]=new Map,y[H("finalized")]=new Map,ft?.({ReactiveElement:y}),(W.reactiveElementVersions??=[]).push("2.1.2");var ie=globalThis,Ae=n=>n,B=ie.trustedTypes,ke=B?B.createPolicy("lit-html",{createHTML:n=>n}):void 0,re="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,oe="?"+w,yt=`<${oe}>`,A=document,R=()=>A.createComment(""),P=n=>n===null||typeof n!="object"&&typeof n!="function",le=Array.isArray,Me=n=>le(n)||typeof n?.[Symbol.iterator]=="function",se=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Se=/-->/g,Ce=/>/g,$=RegExp(`>|${se}(?:([^\\s"'>=/]+)(${se}*=${se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Te=/'/g,Ee=/"/g,Re=/^(?:script|style|textarea|title)$/i,de=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),c=de(1),Pe=de(2),Vt=de(3),f=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),He=new WeakMap,x=A.createTreeWalker(A,129);function Oe(n,e){if(!le(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return ke!==void 0?ke.createHTML(e):e}var Ne=(n,e)=>{let t=n.length-1,a=[],s,i=e===2?"<svg>":e===3?"<math>":"",r=M;for(let d=0;d<t;d++){let o=n[d],p,g,u=-1,m=0;for(;m<o.length&&(r.lastIndex=m,g=r.exec(o),g!==null);)m=r.lastIndex,r===M?g[1]==="!--"?r=Se:g[1]!==void 0?r=Ce:g[2]!==void 0?(Re.test(g[2])&&(s=RegExp("</"+g[2],"g")),r=$):g[3]!==void 0&&(r=$):r===$?g[0]===">"?(r=s??M,u=-1):g[1]===void 0?u=-2:(u=r.lastIndex-g[2].length,p=g[1],r=g[3]===void 0?$:g[3]==='"'?Ee:Te):r===Ee||r===Te?r=$:r===Se||r===Ce?r=M:(r=$,s=void 0);let _=r===$&&n[d+1].startsWith("/>")?" ":"";i+=r===M?o+yt:u>=0?(a.push(p),o.slice(0,u)+re+o.slice(u)+w+_):o+w+(u===-2?d:_)}return[Oe(n,i+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),a]},O=class n{constructor({strings:e,_$litType$:t},a){let s;this.parts=[];let i=0,r=0,d=e.length-1,o=this.parts,[p,g]=Ne(e,t);if(this.el=n.createElement(p,a),x.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=x.nextNode())!==null&&o.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith(re)){let m=g[r++],_=s.getAttribute(u).split(w),V=/([.?@])?(.*)/.exec(m);o.push({type:1,index:i,name:V[2],strings:_,ctor:V[1]==="."?F:V[1]==="?"?K:V[1]==="@"?G:S}),s.removeAttribute(u)}else u.startsWith(w)&&(o.push({type:6,index:i}),s.removeAttribute(u));if(Re.test(s.tagName)){let u=s.textContent.split(w),m=u.length-1;if(m>0){s.textContent=B?B.emptyScript:"";for(let _=0;_<m;_++)s.append(u[_],R()),x.nextNode(),o.push({type:2,index:++i});s.append(u[m],R())}}}else if(s.nodeType===8)if(s.data===oe)o.push({type:2,index:i});else{let u=-1;for(;(u=s.data.indexOf(w,u+1))!==-1;)o.push({type:7,index:i}),u+=w.length-1}i++}}static createElement(e,t){let a=A.createElement("template");return a.innerHTML=e,a}};function k(n,e,t=n,a){if(e===f)return e;let s=a!==void 0?t._$Co?.[a]:t._$Cl,i=P(e)?void 0:e._$litDirective$;return s?.constructor!==i&&(s?._$AO?.(!1),i===void 0?s=void 0:(s=new i(n),s._$AT(n,t,a)),a!==void 0?(t._$Co??=[])[a]=s:t._$Cl=s),s!==void 0&&(e=k(n,s._$AS(n,e.values),s,a)),e}var j=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:a}=this._$AD,s=(e?.creationScope??A).importNode(t,!0);x.currentNode=s;let i=x.nextNode(),r=0,d=0,o=a[0];for(;o!==void 0;){if(r===o.index){let p;o.type===2?p=new T(i,i.nextSibling,this,e):o.type===1?p=new o.ctor(i,o.name,o.strings,this,e):o.type===6&&(p=new Z(i,this,e)),this._$AV.push(p),o=a[++d]}r!==o?.index&&(i=x.nextNode(),r++)}return x.currentNode=A,s}p(e){let t=0;for(let a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}},T=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,s){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=k(this,e,t),P(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==f&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Me(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:a}=e,s=typeof a=="number"?this._$AC(e):(a.el===void 0&&(a.el=O.createElement(Oe(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===s)this._$AH.p(t);else{let i=new j(s,this),r=i.u(this.options);i.p(t),this.T(r),this._$AH=i}}_$AC(e){let t=He.get(e.strings);return t===void 0&&He.set(e.strings,t=new O(e)),t}k(e){le(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,a,s=0;for(let i of e)s===t.length?t.push(a=new n(this.O(R()),this.O(R()),this,this.options)):a=t[s],a._$AI(i),s++;s<t.length&&(this._$AR(a&&a._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let a=Ae(e).nextSibling;Ae(e).remove(),e=a}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,s,i){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=i,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=h}_$AI(e,t=this,a,s){let i=this.strings,r=!1;if(i===void 0)e=k(this,e,t,0),r=!P(e)||e!==this._$AH&&e!==f,r&&(this._$AH=e);else{let d=e,o,p;for(e=i[0],o=0;o<i.length-1;o++)p=k(this,d[a+o],t,o),p===f&&(p=this._$AH[o]),r||=!P(p)||p!==this._$AH[o],p===h?e=h:e!==h&&(e+=(p??"")+i[o+1]),this._$AH[o]=p}r&&!s&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},F=class extends S{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},K=class extends S{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},G=class extends S{constructor(e,t,a,s,i){super(e,t,a,s,i),this.type=5}_$AI(e,t=this){if((e=k(this,e,t,0)??h)===f)return;let a=this._$AH,s=e===h&&a!==h||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,i=e!==h&&(a===h||s);s&&this.element.removeEventListener(this.name,this,a),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Z=class{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){k(this,e)}},De={M:re,P:w,A:oe,C:1,L:Ne,R:j,D:Me,V:k,I:T,H:S,N:K,U:G,B:F,F:Z},wt=ie.litHtmlPolyfillSupport;wt?.(O,T),(ie.litHtmlVersions??=[]).push("3.3.3");var Ue=(n,e,t)=>{let a=t?.renderBefore??e,s=a._$litPart$;if(s===void 0){let i=t?.renderBefore??null;a._$litPart$=s=new T(e.insertBefore(R(),i),i,void 0,t??{})}return s._$AI(n),s};var ce=globalThis,v=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ue(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return f}};v._$litElement$=!0,v.finalized=!0,ce.litElementHydrateSupport?.({LitElement:v});var _t=ce.litElementPolyfillSupport;_t?.({LitElement:v});(ce.litElementVersions??=[]).push("4.2.2");var C={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ie=n=>(...e)=>({_$litDirective$:n,values:e}),Q=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,a){this._$Ct=e,this._$AM=t,this._$Ci=a}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:ta}=De;var Le=n=>n.strings===void 0;var vt={},Ve=(n,e=vt)=>n._$AH=e;var N=Ie(class extends Q{constructor(n){if(super(n),n.type!==C.PROPERTY&&n.type!==C.ATTRIBUTE&&n.type!==C.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Le(n))throw Error("`live` bindings can only contain a single expression")}render(n){return n}update(n,[e]){if(e===f||e===h)return e;let t=n.element,a=n.name;if(n.type===C.PROPERTY){if(e===t[a])return f}else if(n.type===C.BOOLEAN_ATTRIBUTE){if(!!e===t.hasAttribute(a))return f}else if(n.type===C.ATTRIBUTE&&t.getAttribute(a)===e+"")return f;return Ve(n),e}});var bt={"status.waiting":"Waiting","status.heating":"Heating","status.ready":"Ready","status.fault":"Fault","status.manual":"Manual","headline.heating_for":"Heating: ready in about {minutes} min","headline.ready_at":"Ready at {when}","subline.next_at":"Next at {when}","when.today":"{time}","when.tomorrow":"{time} tomorrow","when.weekday":"{time} on {weekday}","ring.target":"target {target}\xB0","weekday.letters":"M,T,W,T,F,S,S","members.none":"No members yet. An administrator adds them in the integration's settings.","list.empty":"No ready times yet.","list.add":"Add a ready time","list.remove":"Remove","list.switch":"On or off","sheet.title":"New ready time","sheet.time":"Time","sheet.days":"Days","sheet.save":"Save","sheet.cancel":"Cancel","fault.sensor_unavailable":"Fault: the water temperature sensor gives no readings. Heating has stopped.","fault.not_rising":"Fault: the water is not getting hotter. Heating has stopped; see Repairs.","fault.no_consumption":"Fault: the heater draws no power. Heating has stopped; see Repairs.","fault.relay_stuck":"Fault: the heater draws power while switched off. Check the relay.",manual:"Automatic control is off: the heater is run by hand.","note.not_rising_skipped":'The thermostat does not say when it is heating, so the "water not getting hotter" and "heater draws no power" checks are not made.',"heat_now.start":"Heat now","heat_now.cancel":"Cancel","heat_now.join":"Tell me too",greeting:"Hello, {name}","today.label":"House today","today.nobody":"Nobody else today","away.until_label":"Until (optional)","away.line":"Away","away.line_until":"Away until {date}","members.add":"Member","card.no_heater":"No Hot Water Ready heater is set up yet.","card.loading":"Loading\u2026","card.error":"That did not work: {message}","cluster.warning":"The showers from {when} need the water at {needed} \xB0C, but the heater goes only to {cap} \xB0C: the last ones may run cooler.","tabs.people":"People","tabs.week":"Week","week.days":"Mon,Tue,Wed,Thu,Fri,Sat,Sun","week.showers":"showers","week.windows":"heating windows","week.busiest":"busiest day","week.heating":"Heating","week.away":"away","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} a week","week.hint":"Tap a person to highlight their times. The bars show when the heater may heat each day (05h to 24h).","settings.open":"Heater settings","settings.close":"Close","settings.target":"Target temperature","settings.target_hint":"Ready when the water gets here","settings.target_down":"Lower the target","settings.target_up":"Raise the target","settings.margin":"Margin","settings.band":"Stops at {stop} \xB0C, restarts at {restart} \xB0C","settings.margin_down":"Lower the margin","settings.margin_up":"Raise the margin","settings.automatic":"Automatic control","settings.automatic_hint":"Off: the heater is run by hand","settings.cancel":'Who may cancel "Heat now"',"cancel.requesters":"Who asked and admins","cancel.people":"Who asked, admins and a list","cancel.everyone":"Everyone","settings.more":"More settings","solar.title":"Solar comparison","solar.none":"No windows recorded in the last 30 days yet.","solar.would":"With the solar-aware rule on, the water would have been ready on time in {on_time} of {windows} windows","solar.did":"With the solar-aware rule, the water was ready on time in {on_time} of {windows} windows","solar.would_less":", and the heater would have run {minutes} minutes less","solar.would_more":", and the heater would have run {minutes} minutes more","solar.did_less":", and the heater ran {minutes} minutes less","solar.did_more":", and the heater ran {minutes} minutes more","solar.kwh":", about {kwh} kWh","solar.applied":" The rule was applied in {applied} of them: on time in {on_time}."},$t={"status.waiting":"Em espera","status.heating":"A aquecer","status.ready":"Pronta","status.fault":"Avaria","status.manual":"Manual","headline.heating_for":"A aquecer: pronta em cerca de {minutes} min","headline.ready_at":"Pronta \xE0s {when}","subline.next_at":"Pr\xF3xima \xE0s {when}","when.today":"{time}","when.tomorrow":"{time} de amanh\xE3","when.weekday":"{time} de {weekday}","ring.target":"alvo {target}\xB0","weekday.letters":"S,T,Q,Q,S,S,D","members.none":"Ainda n\xE3o h\xE1 membros. Um administrador acrescenta-os nas defini\xE7\xF5es da integra\xE7\xE3o.","list.empty":"Ainda n\xE3o h\xE1 hor\xE1rios.","list.add":"Acrescentar um hor\xE1rio","list.remove":"Remover","list.switch":"Ligar ou desligar","sheet.title":"Novo hor\xE1rio","sheet.time":"Hora","sheet.days":"Dias","sheet.save":"Guardar","sheet.cancel":"Cancelar","fault.sensor_unavailable":"Avaria: o sensor da temperatura da \xE1gua n\xE3o d\xE1 leituras. O aquecimento parou.","fault.not_rising":"Avaria: a \xE1gua n\xE3o aquece. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.no_consumption":"Avaria: o aquecedor n\xE3o consome energia. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.relay_stuck":"Avaria: o aquecedor consome energia com o rel\xE9 desligado. Verifique o rel\xE9.",manual:"O controlo autom\xE1tico est\xE1 desligado: o aquecedor est\xE1 a ser comandado manualmente.","note.not_rising_skipped":'O term\xF3stato n\xE3o indica quando est\xE1 a aquecer, por isso as verifica\xE7\xF5es "a \xE1gua n\xE3o aquece" e "o aquecedor n\xE3o consome energia" n\xE3o s\xE3o feitas.',"heat_now.start":"Aquecer agora","heat_now.cancel":"Cancelar","heat_now.join":"Avisar-me tamb\xE9m",greeting:"Ol\xE1, {name}","today.label":"Casa hoje","today.nobody":"Mais ningu\xE9m hoje","away.until_label":"At\xE9 (opcional)","away.line":"Ausente","away.line_until":"Ausente at\xE9 {date}","members.add":"Membro","card.no_heater":"Ainda n\xE3o h\xE1 nenhum aquecedor do Hot Water Ready configurado.","card.loading":"A carregar\u2026","card.error":"N\xE3o foi poss\xEDvel: {message}","cluster.warning":"Os duches a partir das {when} precisam da \xE1gua a {needed} \xB0C, mas o aquecedor s\xF3 aquece at\xE9 {cap} \xB0C: os \xFAltimos podem sair menos quentes.","tabs.people":"Pessoas","tabs.week":"Semana","week.days":"Seg,Ter,Qua,Qui,Sex,S\xE1b,Dom","week.showers":"duches","week.windows":"janelas de aquecimento","week.busiest":"dia mais cheio","week.heating":"Aquecimento","week.away":"ausente","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} por semana","week.hint":"Toque numa pessoa para destacar os seus hor\xE1rios. As barras mostram quando o aquecedor pode aquecer em cada dia (05h a 24h).","settings.open":"Defini\xE7\xF5es do aquecedor","settings.close":"Fechar","settings.target":"Temperatura alvo","settings.target_hint":"Avisa quando chega aqui","settings.target_down":"Baixar o alvo","settings.target_up":"Subir o alvo","settings.margin":"Margem","settings.band":"P\xE1ra a {stop} \xB0C, retoma a {restart} \xB0C","settings.margin_down":"Baixar a margem","settings.margin_up":"Subir a margem","settings.automatic":"Controlo autom\xE1tico","settings.automatic_hint":"Desligado: o aquecedor fica em modo manual","settings.cancel":'Quem pode cancelar "Aquecer agora"',"cancel.requesters":"Quem pediu e administradores","cancel.people":"Quem pediu, administradores e uma lista","cancel.everyone":"Todos","settings.more":"Mais defini\xE7\xF5es","solar.title":"Compara\xE7\xE3o solar","solar.none":"Ainda n\xE3o h\xE1 janelas registadas nos \xFAltimos 30 dias.","solar.would":"Com a regra solar ligada, a \xE1gua teria ficado pronta a tempo em {on_time} de {windows} janelas","solar.did":"Com a regra solar, a \xE1gua ficou pronta a tempo em {on_time} de {windows} janelas","solar.would_less":", e o aquecedor teria trabalhado menos {minutes} minutos","solar.would_more":", e o aquecedor teria trabalhado mais {minutes} minutos","solar.did_less":", e o aquecedor trabalhou menos {minutes} minutos","solar.did_more":", e o aquecedor trabalhou mais {minutes} minutos","solar.kwh":", cerca de {kwh} kWh","solar.applied":" A regra foi aplicada em {applied} delas: a tempo em {on_time}."},xt={en:bt,pt:$t};function Y(n){return n?.toLowerCase().startsWith("pt")?"pt":"en"}function D(n){return Y(n)==="pt"?"pt-PT":"en-GB"}function J(n){return l(n,"weekday.letters").split(",")}function l(n,e,t={}){return xt[Y(n)][e].replace(/\{(\w+)\}/g,(s,i)=>String(t[i]??s))}function pe(n){return n.callWS({type:"hot_water_ready/heaters"})}var X=class{constructor(e,t){this.onSnapshot=e;this.onMissing=t;this.generation=0}async follow(e,t){let a=this.generation,s=t;if(s===void 0){if(this.defaultEntryId??=pe(e).then(r=>r[0]?.entry_id),s=await this.defaultEntryId,a!==this.generation)return;if(s===void 0){this.defaultEntryId=void 0,this.onMissing();return}}if(s===this.entryId)return;this.stop();let i=this.generation;this.entryId=s,this.stopSubscription=e.connection.subscribeMessage(r=>{i===this.generation&&this.onSnapshot(r)},{type:"hot_water_ready/subscribe",entry_id:s}),this.stopSubscription.catch(()=>{i===this.generation&&(this.entryId=void 0,this.onMissing())})}stop(){this.generation++;let e=this.stopSubscription;this.stopSubscription=void 0,this.entryId=void 0,e?.then(t=>t()).catch(()=>{})}};function b(n,e,t){return new Intl.NumberFormat(D(e),{maximumFractionDigits:t}).format(n)}function U(n,e){return new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(n)}function je(n){let e=new Date(`${n}T12:00:00Z`);return e.setUTCDate(e.getUTCDate()+1),e.toISOString().slice(0,10)}function ge(n,e){let{language:t,timeZone:a,now:s}=e,i=new Date(n),r=Xe(n,e),d=U(s,a);if(U(i,a)===d)return l(t,"when.today",{time:r});if(U(i,a)===je(d))return l(t,"when.tomorrow",{time:r});let o=new Intl.DateTimeFormat(D(t),{timeZone:a,weekday:"long"}).format(i);return l(t,"when.weekday",{time:r,weekday:o})}function At(n,e){let{language:t}=e;return n.status==="heating"&&n.ready_in_minutes!==null?l(t,"headline.heating_for",{minutes:n.ready_in_minutes}):n.status==="waiting"&&n.next_ready?l(t,"headline.ready_at",{when:ge(n.next_ready.at,e)}):l(t,`status.${n.status}`)}function Fe(n,e){let{language:t}=e,{temperature:a,target:s}=n,i=n.status==="ready"&&n.next_ready?l(t,"subline.next_at",{when:ge(n.next_ready.at,e)}):"";return{temperature:a===null?"\u2013":`${b(a,t,1)}\xB0`,target:l(t,"ring.target",{target:b(s,t,1)}),headline:At(n,e),subline:i,fill:a===null||s<=0?0:Math.min(1,Math.max(0,a/s)),tone:n.status}}function kt(n,e){let t=e??n.me;return n.members.find(a=>a.id===t)??n.members[0]}function Ke(n){let e=I(n);return e==="admin"?!0:e==="viewer"&&n.members.length>1}function Ge(n,e){return kt(n,I(n)==="member"?void 0:e)}function Ze(n){return U(n.now,n.timeZone)}function me(n){return n.time!==""&&n.weekdays.length>0}function Qe(n,e){let t=J(e);return[...n.ready_times].sort((a,s)=>a.time.localeCompare(s.time)||a.id.localeCompare(s.id)).map(a=>({id:a.id,time:a.time,enabled:a.enabled,days:t.map((s,i)=>({letter:s,on:a.weekdays.includes(i)}))}))}function I(n){return n.is_admin?"admin":n.me?"member":"viewer"}function Ye(n,e){return n.members.map(t=>({id:t.id,name:t.name,initial:t.name.slice(0,1).toLocaleUpperCase(),colour:t.colour,star:t.virtual,faded:t.away.on,selected:t.id===e}))}function Je(n,e){let t=n.members.find(a=>a.id===n.me);return t?l(e,"greeting",{name:t.name}):""}function Xe(n,e){return new Intl.DateTimeFormat(D(e.language),{timeZone:e.timeZone,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(n))}function et(n,e,t){let a=new Map(n.members.map(i=>[i.id,i.name])),s=n.today.filter(i=>i.member!==t);return s.length===0?l(e.language,"today.nobody"):s.map(i=>`${a.get(i.member)??"?"} ${Xe(i.at,e)}`).join(" \xB7 ")}function St(n,e){let t=new Date(`${n}T12:00:00Z`),a=D(e),s=new Intl.DateTimeFormat(a,{timeZone:"UTC",day:"numeric"}).format(t),i=new Intl.DateTimeFormat(a,{timeZone:"UTC",month:"long"}).format(t);return Y(e)==="pt"?`${s} de ${i.slice(0,1).toLocaleUpperCase("pt-PT")}${i.slice(1)}`:`${s} ${i}`}function tt(n,e){return n.away.on?n.away.until?l(e.language,"away.line_until",{date:St(n.away.until,e.language)}):l(e.language,"away.line"):""}var qe="hot_water_ready/heat_now/start",ze="hot_water_ready/heat_now/cancel";function at(n){let e=n.can_ask_heat_now&&!n.heat_now_blocked,t=n.heat_now;if(!t)return e?[{command:qe,label:"heat_now.start",primary:!0}]:[];if(t.asked)return[{command:ze,label:"heat_now.cancel",primary:!0}];let a=e?[{command:qe,label:"heat_now.join",primary:!0}]:[];return t.can_cancel&&a.push({command:ze,label:"heat_now.cancel",primary:!1}),a}function nt(n,e){return n.faults.map(t=>l(e,`fault.${t}`))}var st="hot_water_ready/settings/set",Ct={min:30,max:75,step:.5},Tt={min:0,max:5,step:.5},Et=["requesters","people","everyone"];function We(n,e,t){let a=Math.ceil(n/e.step-1e-9)*e.step-e.step,s=Math.floor(n/e.step+1e-9)*e.step+e.step;return{shown:b(n,t,1),down:a>=e.min-1e-9?a:null,up:s<=e.max+1e-9?s:null}}function it(n,e){let t=n.settings;if(!(!n.is_admin||!t))return{target:We(n.target,Ct,e),margin:We(n.margin,Tt,e),band:l(e,"settings.band",{stop:b(n.target+n.margin,e,1),restart:b(n.target-n.margin,e,1)}),automatic:n.automatic,cancel:Et.map(a=>({rule:a,label:`cancel.${a}`,selected:a===t.cancel_rule})),solar:Ht(t,e),notes:n.not_rising_checked?[]:[l(e,"note.not_rising_skipped")]}}function Ht(n,e){let{windows:t,on_time:a,minutes_saved:s,kwh:i}=n.solar;if(t===0)return l(e,"solar.none");let r=n.solar_aware?"did":"would",d=l(e,`solar.${r}`,{on_time:a,windows:t});s!==0&&(d+=l(e,`solar.${r}_${s>0?"less":"more"}`,{minutes:Math.abs(s)}),i!==null&&(d+=l(e,"solar.kwh",{kwh:b(Math.abs(i),e,1)}))),d+=".";let{solar_windows:o,solar_on_time:p}=n.solar;return o>0&&(d+=l(e,"solar.applied",{applied:o,on_time:p})),d}var he=300,ue=1440;function Be(n,e){let t=new Date(n),a=new Intl.DateTimeFormat("en-GB",{timeZone:e,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).reduce((s,i)=>({...s,[i.type]:i.value}),{});return{day:U(t,e),minutes:Number(a.hour)*60+Number(a.minute)}}function rt(n,e){let t=n.week;if(!n.is_admin||!t)return;let a=l(e.language,"week.days").split(","),s=a.map((o,p)=>Mt(t.monday,p)),i=n.members.map(o=>Pt(o,s,e.language)),r=s.map((o,p)=>i.reduce((g,u)=>{let m=u.cells[p];return m&&!m.away?g+m.times.length:g},0)),d=Math.max(0,...r);return{days:s.map((o,p)=>({key:o,label:a[p]??o,today:o===t.today,bars:Ot(o,t.windows,e.timeZone)})),rows:i,showers:r.reduce((o,p)=>o+p,0),windows:t.windows.length,busiest:d>0?a[r.indexOf(d)]??"":""}}function Mt(n,e){let t=n;for(let a=0;a<e;a+=1)t=je(t);return t}function Rt(n,e){return n.away.on&&(n.away.until===null||e<=n.away.until)}function Pt(n,e,t){let a=n.ready_times.filter(o=>o.enabled),s=e.map((o,p)=>({times:a.filter(g=>g.weekdays.includes(p)).map(g=>g.time).sort(),away:Rt(n,o)})),i=s.every(o=>o.away),r=s.reduce((o,p)=>o+p.times.length,0),d=l(t,"week.per_week",{count:r});return i?d=l(t,"week.away"):n.virtual&&(d=l(t,"week.virtual",{count:r})),{id:n.id,name:n.name,colour:n.colour,initial:n.virtual?"\u2605":n.name[0]??"?",away:i,note:d,cells:s}}function Ot(n,e,t){let a=ue-he,s=[];for(let i of e){let r=Be(i.start,t),d=Be(i.end,t);if(r.day>n||d.day<n)continue;let o=Math.max(he,r.day<n?0:r.minutes),p=Math.min(ue,d.day>n?ue:d.minutes);p>o&&s.push({from:(o-he)/a,length:(p-o)/a})}return s}function ot(n,e){let t=n.cluster_warning;return t?l(e.language,"cluster.warning",{when:ge(t.at,e),needed:b(t.needed,e.language,0),cap:b(t.cap,e.language,1)}):""}var L="hot-water-ready-card",fe=38,lt=2*Math.PI*fe,Nt=[0,1,2,3,4,5,6],ye=class extends v{constructor(){super(...arguments);this._missing=!1;this._settingsOpen=!1;this._tab="people";this._error="";this._subscription=new X(t=>{this._heater=t,this._missing=!1},()=>{this._missing=!0})}static{this.properties={hass:{attribute:!1},_config:{state:!0},_heater:{state:!0},_missing:{state:!0},_selected:{state:!0},_sheet:{state:!0},_settingsOpen:{state:!0},_tab:{state:!0},_focus:{state:!0},_error:{state:!0}}}static async getStubConfig(t){let a=(await pe(t))[0];return a?{type:`custom:${L}`,entry_id:a.entry_id}:{type:`custom:${L}`}}setConfig(t){this._config=t}getCardSize(){return 6}get _language(){return this.hass?.locale?.language??this.hass?.language??"en"}get _context(){return{language:this._language,timeZone:this.hass?.config?.time_zone??Intl.DateTimeFormat().resolvedOptions().timeZone,now:new Date}}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._subscription.stop()}updated(t){(t.has("hass")||t.has("_config"))&&this._follow()}_follow(){this.hass&&this._config&&this.isConnected&&this._subscription.follow(this.hass,this._config.entry_id)}async _call(t){if(!this.hass||!this._heater)return!1;this._error="";try{return await this.hass.callWS({entry_id:this._heater.entry_id,...t}),!0}catch(a){let s=(a instanceof Error,a.message);return this._error=l(this._language,"card.error",{message:s??String(a)}),!1}}async _save(t){let a=this._sheet;if(!a||!me(a))return;await this._call({type:"hot_water_ready/ready_time/add",member_id:t.id,time:a.time,weekdays:[...a.weekdays].sort()})&&(this._sheet=void 0)}render(){let t=this._language;if(this._missing)return c`<ha-card><div class="message">${l(t,"card.no_heater")}</div></ha-card>`;let a=this._heater;if(!a)return c`<ha-card><div class="message">${l(t,"card.loading")}</div></ha-card>`;let s=I(a),i=Ge(a,this._selected),r=rt(a,this._context);return c`
      <ha-card>
        ${nt(a,t).map(d=>c`<div class="banner fault" role="alert">${d}</div>`)}
        ${a.automatic?h:c`<div class="banner manual">${l(t,"manual")}</div>`}
        ${a.cluster_warning?c`<div class="banner warning" role="alert">${ot(a,this._context)}</div>`:h}
        ${this._renderTop(a)}
        ${this._renderSettings(a)}
        ${this._renderTabs(a)}
        ${r&&this._tab==="week"?this._renderWeek(r):c`
              ${s==="member"?c`<div class="greeting">${Je(a,t)}</div>`:this._renderAvatars(a,i)}
              ${i?this._renderList(i):c`<div class="message">${l(t,"members.none")}</div>`}
              ${i&&this._sheet?this._renderSheet(i,this._sheet):h}
              ${i?this._renderAway(i):h}
              ${s==="member"&&i?this._renderToday(a,i):h}
            `}
        ${this._error?c`<div class="error" role="alert">${this._error}</div>`:h}
      </ha-card>
    `}_renderAway(t){let a=this._language,s=tt(t,this._context);if(!t.can_edit)return s?c`<div class="away-line">${s}</div>`:h;let i=(r,d)=>this._call({type:"hot_water_ready/away/set",member_id:t.id,away:r,until:d});return c`
      <div class="away">
        <label class="away-toggle">
          <input
            type="checkbox"
            class="switch"
            .checked=${N(t.away.on)}
            @change=${r=>{i(r.target.checked,null)}}
          />
          ${s||l(a,"away.line")}
        </label>
        ${t.away.on?c`<label class="until">
              ${l(a,"away.until_label")}
              <input
                type="date"
                min=${Ze(this._context)}
                .value=${N(t.away.until??"")}
                @change=${r=>{i(!0,r.target.value||null)}}
              />
            </label>`:h}
      </div>
    `}_renderToday(t,a){return c`<div class="today">
      <span class="today-label">${l(this._language,"today.label")}</span>
      ${et(t,this._context,a.id)}
    </div>`}_openIntegration(){history.pushState(null,"","/config/integrations/integration/hot_water_ready"),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_renderTop(t){let a=Fe(t,this._context);return c`
      <div class="top">
        <svg class="ring" viewBox="0 0 92 92" role="img" aria-label="${a.temperature} ${a.target}">
          <circle class="track" cx="46" cy="46" r=${fe}></circle>
          ${a.fill>0?Pe`<circle class="fill ${a.tone}" cx="46" cy="46" r=${fe}
                stroke-dasharray="${a.fill*lt} ${lt}"
                transform="rotate(-90 46 46)"></circle>`:h}
          <text class="temperature" x="46" y="44">${a.temperature}</text>
          <text class="target" x="46" y="61">${a.target}</text>
        </svg>
        <div class="text">
          <div class="name-row">
            <div class="name">${t.name}</div>
            ${t.settings?c`<button
                  class="settings-button"
                  aria-label=${l(this._language,"settings.open")}
                  aria-expanded=${this._settingsOpen}
                  @click=${()=>this._settingsOpen=!this._settingsOpen}
                >
                  ⚙
                </button>`:h}
          </div>
          <div class="headline ${a.tone}">${a.headline}</div>
          ${a.subline?c`<div class="subline">${a.subline}</div>`:h}
          <div class="heat-now">
            ${at(t).map(s=>c`<button
                class=${s.primary?"primary":"secondary"}
                @click=${()=>{this._call({type:s.command})}}
              >
                ${l(this._language,s.label)}
              </button>`)}
          </div>
        </div>
      </div>
    `}_renderTabs(t){if(!t.week)return h;let a=s=>c`<button
      class="tab ${this._tab===s?"on":""}"
      role="tab"
      aria-selected=${this._tab===s}
      @click=${()=>this._tab=s}
    >
      ${l(this._language,`tabs.${s}`)}
    </button>`;return c`<div class="tabs" role="tablist">${a("people")}${a("week")}</div>`}_renderWeek(t){let a=this._language,s=this._focus;return c`
      <div class="week">
        <div class="totals">
          <div><b>${t.showers}</b><span>${l(a,"week.showers")}</span></div>
          <div><b>${t.windows}</b><span>${l(a,"week.windows")}</span></div>
          <div><b>${t.busiest||"-"}</b><span>${l(a,"week.busiest")}</span></div>
        </div>
        <div class="grid">
          <span></span>
          ${t.days.map(i=>c`<span class="head ${i.today?"is-today":""}">${i.label}</span>`)}
          ${t.rows.map(i=>c`
              <button
                class="who ${i.away?"away":""} ${s&&s!==i.id?"dim":""}"
                aria-pressed=${s===i.id}
                @click=${()=>this._focus=s===i.id?void 0:i.id}
              >
                <span class="mini" style="background: var(--${i.colour}-color, var(--primary-color))"
                  >${i.initial}</span
                >
                <span class="who-text"><span>${i.name}</span><span class="hint">${i.note}</span></span>
              </button>
              ${i.cells.map((r,d)=>c`<div
                  class="cell ${t.days[d]?.today?"is-today":""} ${s&&s!==i.id?"dim":""}"
                >
                  ${r.times.map(o=>c`<span
                      class="tag ${r.away?"away":""}"
                      style=${r.away?"":`background: var(--${i.colour}-color, var(--primary-color))`}
                      >${o}</span
                    >`)}
                </div>`)}
            `)}
          <span class="hint heating-label">${l(a,"week.heating")}</span>
          ${t.days.map(i=>c`<div class="bar ${i.today?"is-today":""}">
              ${i.bars.map(r=>c`<span
                    class="heat"
                    style="top: ${(r.from*100).toFixed(1)}%; height: max(3px, ${(r.length*100).toFixed(1)}%)"
                  ></span>`)}
            </div>`)}
        </div>
        <div class="hint">${l(a,"week.hint")}</div>
      </div>
    `}_renderSettings(t){let a=this._language,s=this._settingsOpen?it(t,a):void 0;if(!s)return h;let i=r=>this._call({type:st,...r});return c`
      <div class="sheet settings" role="dialog" aria-label=${l(a,"settings.open")}>
        <div class="sheet-head">
          <div class="sheet-title">${l(a,"settings.open")}</div>
          <button class="secondary" @click=${()=>this._settingsOpen=!1}>
            ${l(a,"settings.close")}
          </button>
        </div>
        ${this._renderStepper(s.target,`${s.target.shown} \xB0C`,l(a,"settings.target"),l(a,"settings.target_hint"),["settings.target_down","settings.target_up"],r=>i({target:r}))}
        ${this._renderStepper(s.margin,`\xB1 ${s.margin.shown}`,l(a,"settings.margin"),s.band,["settings.margin_down","settings.margin_up"],r=>i({margin:r}))}
        <label class="setting">
          <span class="setting-text">
            <span>${l(a,"settings.automatic")}</span>
            <span class="hint">${l(a,"settings.automatic_hint")}</span>
          </span>
          <input
            type="checkbox"
            class="switch"
            .checked=${N(s.automatic)}
            @change=${r=>i({automatic:r.target.checked})}
          />
        </label>
        <div class="setting column">
          <span>${l(a,"settings.cancel")}</span>
          <div class="choices" role="radiogroup">
            ${s.cancel.map(r=>c`<button
                class="choice ${r.selected?"on":""}"
                role="radio"
                aria-checked=${r.selected}
                @click=${()=>i({cancel_rule:r.rule})}
              >
                ${l(a,r.label)}
              </button>`)}
          </div>
        </div>
        ${this._renderSolar(s)}
        <button
          class="link"
          @click=${()=>{this._openIntegration()}}
        >
          ${l(a,"settings.more")}</button>
      </div>
    `}_renderStepper(t,a,s,i,r,d){let o=(p,g,u)=>c`<button
      class="step"
      aria-label=${l(this._language,g)}
      ?disabled=${p===null}
      @click=${()=>p===null?void 0:d(p)}
    >
      ${u}
    </button>`;return c`<div class="setting">
      <span class="setting-text"><span>${s}</span><span class="hint">${i}</span></span>
      ${o(t.down,r[0],"\u2212")}
      <span class="value">${a}</span>
      ${o(t.up,r[1],"+")}
    </div>`}_renderSolar(t){let a=this._language;return c`<div class="setting column solar">
      <span>${l(a,"solar.title")}</span>
      <span class="hint">${t.solar}</span>
      ${t.notes.map(s=>c`<span class="hint">${s}</span>`)}
    </div>`}_renderAvatars(t,a){if(!Ke(t))return h;let s=I(t)==="admin";return c`
      <div class="avatars" role="tablist">
        ${Ye(t,a?.id).map(i=>c`
            <button
              class="avatar ${i.selected?"selected":""} ${i.faded?"faded":""}"
              role="tab"
              aria-selected=${i.selected}
              @click=${()=>{this._selected=i.id,this._sheet=void 0}}
            >
              <span class="dot" style="background: var(--${i.colour}-color, var(--primary-color))"
                >${i.initial}${i.star?c`<span class="star">★</span>`:h}</span
              >
              <span class="label">${i.name}</span>
            </button>
          `)}
        ${s?c`<button
              class="avatar add-member"
              @click=${()=>{this._openIntegration()}}
            >
              <span class="dot plus">+</span>
              <span class="label">${l(this._language,"members.add")}</span>
            </button>`:h}
      </div>
    `}_renderList(t){let a=this._language,s=Qe(t,a);return c`
      <div class="list">
        ${s.length===0?c`<div class="empty">${l(a,"list.empty")}</div>`:h}
        ${s.map(i=>c`
            <div class="row ${i.enabled?"":"off"}">
              <div class="time">${i.time}</div>
              <div class="days">
                ${i.days.map(r=>c`<span class="${r.on?"on":""}">${r.letter}</span>`)}
              </div>
              ${t.can_edit?c`
                    <input
                      type="checkbox"
                      class="switch"
                      aria-label=${l(a,"list.switch")}
                      .checked=${N(i.enabled)}
                      @change=${r=>this._call({type:"hot_water_ready/ready_time/update",member_id:t.id,ready_time_id:i.id,enabled:r.target.checked})}
                    />
                    <button
                      class="remove"
                      aria-label=${l(a,"list.remove")}
                      @click=${()=>this._call({type:"hot_water_ready/ready_time/remove",member_id:t.id,ready_time_id:i.id})}
                    >
                      ×
                    </button>
                  `:h}
            </div>
          `)}
        ${t.can_edit?c`<button class="add" @click=${()=>this._sheet={time:"07:00",weekdays:[...Nt]}}>
              + ${l(a,"list.add")}
            </button>`:h}
      </div>
    `}_renderSheet(t,a){let s=this._language,i=J(s),r=d=>{let o=a.weekdays.includes(d)?a.weekdays.filter(p=>p!==d):[...a.weekdays,d];this._sheet={...a,weekdays:o}};return c`
      <div class="sheet" role="dialog" aria-label=${l(s,"sheet.title")}>
        <div class="sheet-title">${l(s,"sheet.title")}</div>
        <label class="field">
          ${l(s,"sheet.time")}
          <input
            type="time"
            .value=${a.time}
            @input=${d=>{this._sheet={...a,time:d.target.value}}}
          />
        </label>
        <div class="field">
          ${l(s,"sheet.days")}
          <div class="day-toggles">
            ${i.map((d,o)=>c`<button
                  class="day ${a.weekdays.includes(o)?"on":""}"
                  aria-pressed=${a.weekdays.includes(o)}
                  @click=${()=>{r(o)}}
                >
                  ${d}
                </button>`)}
          </div>
        </div>
        <div class="actions">
          <button class="secondary" @click=${()=>this._sheet=void 0}>${l(s,"sheet.cancel")}</button>
          <button class="primary" ?disabled=${!me(a)} @click=${()=>this._save(t)}>
            ${l(s,"sheet.save")}
          </button>
        </div>
      </div>
    `}static{this.styles=te`
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
    .top {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }
    .ring {
      width: 92px;
      height: 92px;
      flex: none;
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
      align-self: center;
    }
    .bar {
      position: relative;
      height: 64px;
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
    .step,
    .choice {
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
    .choices {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .choice {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      font-weight: 400;
    }
    .choice.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
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
    .away,
    .away-line,
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
    .today {
      color: var(--secondary-text-color);
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
      padding: 0 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 12px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
    }
    .row.off {
      opacity: 0.55;
    }
    .time {
      font-size: 26px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .days {
      flex: 1;
      display: flex;
      gap: 4px;
      font-size: 12px;
      color: var(--disabled-text-color, #9aa2ad);
    }
    .days .on {
      color: var(--primary-color);
      font-weight: 700;
    }
    .switch {
      width: 20px;
      height: 20px;
      accent-color: var(--primary-color);
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
    .field input {
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
      flex-wrap: wrap;
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
    .secondary {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    }
  `}};if(!customElements.get(L)){customElements.define(L,ye);let n=window;n.customCards=n.customCards??[],n.customCards.push({type:L,name:"Hot Water Ready",description:"Water temperature, ready times and heat now.",preview:!0})}export{ye as HotWaterReadyCard};
