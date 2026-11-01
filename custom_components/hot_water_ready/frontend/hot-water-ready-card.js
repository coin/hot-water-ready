var z=globalThis,q=z.ShadowRoot&&(z.ShadyCSS===void 0||z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ee=Symbol(),ye=new WeakMap,E=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==ee)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(q&&e===void 0){let a=t!==void 0&&t.length===1;a&&(e=ye.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&ye.set(t,e))}return e}toString(){return this.cssText}},we=s=>new E(typeof s=="string"?s:s+"",void 0,ee),te=(s,...e)=>{let t=s.length===1?s[0]:e.reduce((a,n,i)=>a+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+s[i+1],s[0]);return new E(t,s,ee)},_e=(s,e)=>{if(q)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let a=document.createElement("style"),n=z.litNonce;n!==void 0&&a.setAttribute("nonce",n),a.textContent=t.cssText,s.appendChild(a)}},ae=q?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(let a of e.cssRules)t+=a.cssText;return we(t)})(s):s;var{is:lt,defineProperty:dt,getOwnPropertyDescriptor:ct,getOwnPropertyNames:pt,getOwnPropertySymbols:ht,getPrototypeOf:ut}=Object,W=globalThis,ve=W.trustedTypes,gt=ve?ve.emptyScript:"",mt=W.reactiveElementPolyfillSupport,H=(s,e)=>s,se={toAttribute(s,e){switch(e){case Boolean:s=s?gt:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},$e=(s,e)=>!lt(s,e),be={attribute:!0,type:String,converter:se,reflect:!1,useDefault:!1,hasChanged:$e};Symbol.metadata??=Symbol("metadata"),W.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=be){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let a=Symbol(),n=this.getPropertyDescriptor(e,a,t);n!==void 0&&dt(this.prototype,e,n)}}static getPropertyDescriptor(e,t,a){let{get:n,set:i}=ct(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:n,set(r){let d=n?.call(this);i?.call(this,r),this.requestUpdate(e,d,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??be}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;let e=ut(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){let t=this.properties,a=[...pt(t),...ht(t)];for(let n of a)this.createProperty(n,t[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[a,n]of t)this.elementProperties.set(a,n)}this._$Eh=new Map;for(let[t,a]of this.elementProperties){let n=this._$Eu(t,a);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let a=new Set(e.flat(1/0).reverse());for(let n of a)t.unshift(ae(n))}else e!==void 0&&t.push(ae(e));return t}static _$Eu(e,t){let a=t.attribute;return a===!1?void 0:typeof a=="string"?a:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _e(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){let a=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,a);if(n!==void 0&&a.reflect===!0){let i=(a.converter?.toAttribute!==void 0?a.converter:se).toAttribute(t,a.type);this._$Em=e,i==null?this.removeAttribute(n):this.setAttribute(n,i),this._$Em=null}}_$AK(e,t){let a=this.constructor,n=a._$Eh.get(e);if(n!==void 0&&this._$Em!==n){let i=a.getPropertyOptions(n),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:se;this._$Em=n;let d=r.fromAttribute(t,i.type);this[n]=d??this._$Ej?.get(n)??d,this._$Em=null}}requestUpdate(e,t,a,n=!1,i){if(e!==void 0){let r=this.constructor;if(n===!1&&(i=this[e]),a??=r.getPropertyOptions(e),!((a.hasChanged??$e)(i,t)||a.useDefault&&a.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,a))))return;this.C(e,t,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:n,wrapped:i},r){a&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),i!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),n===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,i]of this._$Ep)this[n]=i;this._$Ep=void 0}let a=this.constructor.elementProperties;if(a.size>0)for(let[n,i]of a){let{wrapped:r}=i,d=this[n];r!==!0||this._$AL.has(n)||d===void 0||this.C(n,void 0,i,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(a=>a.hostUpdate?.()),this.update(t)):this._$EM()}catch(a){throw e=!1,this._$EM(),a}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[H("elementProperties")]=new Map,y[H("finalized")]=new Map,mt?.({ReactiveElement:y}),(W.reactiveElementVersions??=[]).push("2.1.2");var ie=globalThis,xe=s=>s,B=ie.trustedTypes,Ae=B?B.createPolicy("lit-html",{createHTML:s=>s}):void 0,re="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,oe="?"+w,ft=`<${oe}>`,x=document,R=()=>x.createComment(""),P=s=>s===null||typeof s!="object"&&typeof s!="function",le=Array.isArray,He=s=>le(s)||typeof s?.[Symbol.iterator]=="function",ne=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ke=/-->/g,Se=/>/g,b=RegExp(`>|${ne}(?:([^\\s"'>=/]+)(${ne}*=${ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ce=/'/g,Te=/"/g,Me=/^(?:script|style|textarea|title)$/i,de=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),c=de(1),Re=de(2),Lt=de(3),f=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),Ee=new WeakMap,$=x.createTreeWalker(x,129);function Pe(s,e){if(!le(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ae!==void 0?Ae.createHTML(e):e}var Oe=(s,e)=>{let t=s.length-1,a=[],n,i=e===2?"<svg>":e===3?"<math>":"",r=M;for(let d=0;d<t;d++){let o=s[d],p,g,u=-1,m=0;for(;m<o.length&&(r.lastIndex=m,g=r.exec(o),g!==null);)m=r.lastIndex,r===M?g[1]==="!--"?r=ke:g[1]!==void 0?r=Se:g[2]!==void 0?(Me.test(g[2])&&(n=RegExp("</"+g[2],"g")),r=b):g[3]!==void 0&&(r=b):r===b?g[0]===">"?(r=n??M,u=-1):g[1]===void 0?u=-2:(u=r.lastIndex-g[2].length,p=g[1],r=g[3]===void 0?b:g[3]==='"'?Te:Ce):r===Te||r===Ce?r=b:r===ke||r===Se?r=M:(r=b,n=void 0);let _=r===b&&s[d+1].startsWith("/>")?" ":"";i+=r===M?o+ft:u>=0?(a.push(p),o.slice(0,u)+re+o.slice(u)+w+_):o+w+(u===-2?d:_)}return[Pe(s,i+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),a]},O=class s{constructor({strings:e,_$litType$:t},a){let n;this.parts=[];let i=0,r=0,d=e.length-1,o=this.parts,[p,g]=Oe(e,t);if(this.el=s.createElement(p,a),$.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=$.nextNode())!==null&&o.length<d;){if(n.nodeType===1){if(n.hasAttributes())for(let u of n.getAttributeNames())if(u.endsWith(re)){let m=g[r++],_=n.getAttribute(u).split(w),V=/([.?@])?(.*)/.exec(m);o.push({type:1,index:i,name:V[2],strings:_,ctor:V[1]==="."?F:V[1]==="?"?K:V[1]==="@"?G:k}),n.removeAttribute(u)}else u.startsWith(w)&&(o.push({type:6,index:i}),n.removeAttribute(u));if(Me.test(n.tagName)){let u=n.textContent.split(w),m=u.length-1;if(m>0){n.textContent=B?B.emptyScript:"";for(let _=0;_<m;_++)n.append(u[_],R()),$.nextNode(),o.push({type:2,index:++i});n.append(u[m],R())}}}else if(n.nodeType===8)if(n.data===oe)o.push({type:2,index:i});else{let u=-1;for(;(u=n.data.indexOf(w,u+1))!==-1;)o.push({type:7,index:i}),u+=w.length-1}i++}}static createElement(e,t){let a=x.createElement("template");return a.innerHTML=e,a}};function A(s,e,t=s,a){if(e===f)return e;let n=a!==void 0?t._$Co?.[a]:t._$Cl,i=P(e)?void 0:e._$litDirective$;return n?.constructor!==i&&(n?._$AO?.(!1),i===void 0?n=void 0:(n=new i(s),n._$AT(s,t,a)),a!==void 0?(t._$Co??=[])[a]=n:t._$Cl=n),n!==void 0&&(e=A(s,n._$AS(s,e.values),n,a)),e}var j=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:a}=this._$AD,n=(e?.creationScope??x).importNode(t,!0);$.currentNode=n;let i=$.nextNode(),r=0,d=0,o=a[0];for(;o!==void 0;){if(r===o.index){let p;o.type===2?p=new C(i,i.nextSibling,this,e):o.type===1?p=new o.ctor(i,o.name,o.strings,this,e):o.type===6&&(p=new Z(i,this,e)),this._$AV.push(p),o=a[++d]}r!==o?.index&&(i=$.nextNode(),r++)}return $.currentNode=x,n}p(e){let t=0;for(let a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}},C=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,n){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=A(this,e,t),P(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==f&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):He(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(x.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:a}=e,n=typeof a=="number"?this._$AC(e):(a.el===void 0&&(a.el=O.createElement(Pe(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===n)this._$AH.p(t);else{let i=new j(n,this),r=i.u(this.options);i.p(t),this.T(r),this._$AH=i}}_$AC(e){let t=Ee.get(e.strings);return t===void 0&&Ee.set(e.strings,t=new O(e)),t}k(e){le(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,a,n=0;for(let i of e)n===t.length?t.push(a=new s(this.O(R()),this.O(R()),this,this.options)):a=t[n],a._$AI(i),n++;n<t.length&&(this._$AR(a&&a._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let a=xe(e).nextSibling;xe(e).remove(),e=a}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},k=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,n,i){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=i,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=h}_$AI(e,t=this,a,n){let i=this.strings,r=!1;if(i===void 0)e=A(this,e,t,0),r=!P(e)||e!==this._$AH&&e!==f,r&&(this._$AH=e);else{let d=e,o,p;for(e=i[0],o=0;o<i.length-1;o++)p=A(this,d[a+o],t,o),p===f&&(p=this._$AH[o]),r||=!P(p)||p!==this._$AH[o],p===h?e=h:e!==h&&(e+=(p??"")+i[o+1]),this._$AH[o]=p}r&&!n&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},F=class extends k{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},K=class extends k{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},G=class extends k{constructor(e,t,a,n,i){super(e,t,a,n,i),this.type=5}_$AI(e,t=this){if((e=A(this,e,t,0)??h)===f)return;let a=this._$AH,n=e===h&&a!==h||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,i=e!==h&&(a===h||n);n&&this.element.removeEventListener(this.name,this,a),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Z=class{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){A(this,e)}},Ne={M:re,P:w,A:oe,C:1,L:Oe,R:j,D:He,V:A,I:C,H:k,N:K,U:G,B:F,F:Z},yt=ie.litHtmlPolyfillSupport;yt?.(O,C),(ie.litHtmlVersions??=[]).push("3.3.3");var De=(s,e,t)=>{let a=t?.renderBefore??e,n=a._$litPart$;if(n===void 0){let i=t?.renderBefore??null;a._$litPart$=n=new C(e.insertBefore(R(),i),i,void 0,t??{})}return n._$AI(s),n};var ce=globalThis,v=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=De(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return f}};v._$litElement$=!0,v.finalized=!0,ce.litElementHydrateSupport?.({LitElement:v});var wt=ce.litElementPolyfillSupport;wt?.({LitElement:v});(ce.litElementVersions??=[]).push("4.2.2");var S={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ue=s=>(...e)=>({_$litDirective$:s,values:e}),Q=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,a){this._$Ct=e,this._$AM=t,this._$Ci=a}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:ea}=Ne;var Ie=s=>s.strings===void 0;var _t={},Le=(s,e=_t)=>s._$AH=e;var N=Ue(class extends Q{constructor(s){if(super(s),s.type!==S.PROPERTY&&s.type!==S.ATTRIBUTE&&s.type!==S.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Ie(s))throw Error("`live` bindings can only contain a single expression")}render(s){return s}update(s,[e]){if(e===f||e===h)return e;let t=s.element,a=s.name;if(s.type===S.PROPERTY){if(e===t[a])return f}else if(s.type===S.BOOLEAN_ATTRIBUTE){if(!!e===t.hasAttribute(a))return f}else if(s.type===S.ATTRIBUTE&&t.getAttribute(a)===e+"")return f;return Le(s),e}});var vt={"status.waiting":"Waiting","status.heating":"Heating","status.ready":"Ready","status.fault":"Fault","status.manual":"Manual","headline.heating_for":"Heating: ready in about {minutes} min","headline.ready_at":"Ready at {when}","subline.next_at":"Next at {when}","when.today":"{time}","when.tomorrow":"{time} tomorrow","when.weekday":"{time} on {weekday}","ring.target":"target {target}\xB0","weekday.letters":"M,T,W,T,F,S,S","members.none":"No members yet. An administrator adds them in the integration's settings.","list.empty":"No ready times yet.","list.add":"Add a ready time","list.remove":"Remove","list.switch":"On or off","sheet.title":"New ready time","sheet.time":"Time","sheet.days":"Days","sheet.save":"Save","sheet.cancel":"Cancel","fault.sensor_unavailable":"Fault: the water temperature sensor gives no readings. Heating has stopped.","fault.not_rising":"Fault: the water is not getting hotter. Heating has stopped; see Repairs.","fault.no_consumption":"Fault: the heater draws no power. Heating has stopped; see Repairs.","fault.relay_stuck":"Fault: the heater draws power while switched off. Check the relay.",manual:"Automatic control is off: the heater is run by hand.","note.not_rising_skipped":'The thermostat does not say when it is heating, so the "water not getting hotter" and "heater draws no power" checks are not made.',"heat_now.start":"Heat now","heat_now.cancel":"Cancel","heat_now.join":"Tell me too",greeting:"Hello, {name}","today.label":"House today","today.nobody":"Nobody else today","away.until_label":"Until (optional)","away.line":"Away","away.line_until":"Away until {date}","members.add":"Member","card.no_heater":"No Hot Water Ready heater is set up yet.","card.loading":"Loading\u2026","card.error":"That did not work: {message}","tabs.people":"People","tabs.week":"Week","week.days":"Mon,Tue,Wed,Thu,Fri,Sat,Sun","week.showers":"showers","week.windows":"heating windows","week.busiest":"busiest day","week.heating":"Heating","week.away":"away","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} a week","week.hint":"Tap a person to highlight their times. The bars show when the heater may heat each day (05h to 24h).","settings.open":"Heater settings","settings.close":"Close","settings.target":"Target temperature","settings.target_hint":"Ready when the water gets here","settings.target_down":"Lower the target","settings.target_up":"Raise the target","settings.margin":"Margin","settings.band":"Stops at {stop} \xB0C, restarts at {restart} \xB0C","settings.margin_down":"Lower the margin","settings.margin_up":"Raise the margin","settings.automatic":"Automatic control","settings.automatic_hint":"Off: the heater is run by hand","settings.cancel":'Who may cancel "Heat now"',"cancel.requesters":"Who asked and admins","cancel.people":"Who asked, admins and a list","cancel.everyone":"Everyone","settings.more":"More settings","solar.title":"Solar comparison","solar.none":"No windows recorded in the last 30 days yet.","solar.would":"With the solar-aware rule on, the water would have been ready on time in {on_time} of {windows} windows","solar.did":"With the solar-aware rule, the water was ready on time in {on_time} of {windows} windows","solar.would_less":", and the heater would have run {minutes} minutes less","solar.would_more":", and the heater would have run {minutes} minutes more","solar.did_less":", and the heater ran {minutes} minutes less","solar.did_more":", and the heater ran {minutes} minutes more","solar.kwh":", about {kwh} kWh","solar.applied":" The rule was applied in {applied} of them: on time in {on_time}."},bt={"status.waiting":"Em espera","status.heating":"A aquecer","status.ready":"Pronta","status.fault":"Avaria","status.manual":"Manual","headline.heating_for":"A aquecer: pronta em cerca de {minutes} min","headline.ready_at":"Pronta \xE0s {when}","subline.next_at":"Pr\xF3xima \xE0s {when}","when.today":"{time}","when.tomorrow":"{time} de amanh\xE3","when.weekday":"{time} de {weekday}","ring.target":"alvo {target}\xB0","weekday.letters":"S,T,Q,Q,S,S,D","members.none":"Ainda n\xE3o h\xE1 membros. Um administrador acrescenta-os nas defini\xE7\xF5es da integra\xE7\xE3o.","list.empty":"Ainda n\xE3o h\xE1 hor\xE1rios.","list.add":"Acrescentar um hor\xE1rio","list.remove":"Remover","list.switch":"Ligar ou desligar","sheet.title":"Novo hor\xE1rio","sheet.time":"Hora","sheet.days":"Dias","sheet.save":"Guardar","sheet.cancel":"Cancelar","fault.sensor_unavailable":"Avaria: o sensor da temperatura da \xE1gua n\xE3o d\xE1 leituras. O aquecimento parou.","fault.not_rising":"Avaria: a \xE1gua n\xE3o aquece. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.no_consumption":"Avaria: o aquecedor n\xE3o consome energia. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.relay_stuck":"Avaria: o aquecedor consome energia com o rel\xE9 desligado. Verifique o rel\xE9.",manual:"O controlo autom\xE1tico est\xE1 desligado: o aquecedor est\xE1 a ser comandado manualmente.","note.not_rising_skipped":'O term\xF3stato n\xE3o indica quando est\xE1 a aquecer, por isso as verifica\xE7\xF5es "a \xE1gua n\xE3o aquece" e "o aquecedor n\xE3o consome energia" n\xE3o s\xE3o feitas.',"heat_now.start":"Aquecer agora","heat_now.cancel":"Cancelar","heat_now.join":"Avisar-me tamb\xE9m",greeting:"Ol\xE1, {name}","today.label":"Casa hoje","today.nobody":"Mais ningu\xE9m hoje","away.until_label":"At\xE9 (opcional)","away.line":"Ausente","away.line_until":"Ausente at\xE9 {date}","members.add":"Membro","card.no_heater":"Ainda n\xE3o h\xE1 nenhum aquecedor do Hot Water Ready configurado.","card.loading":"A carregar\u2026","card.error":"N\xE3o foi poss\xEDvel: {message}","tabs.people":"Pessoas","tabs.week":"Semana","week.days":"Seg,Ter,Qua,Qui,Sex,S\xE1b,Dom","week.showers":"duches","week.windows":"janelas de aquecimento","week.busiest":"dia mais cheio","week.heating":"Aquecimento","week.away":"ausente","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} por semana","week.hint":"Toque numa pessoa para destacar os seus hor\xE1rios. As barras mostram quando o aquecedor pode aquecer em cada dia (05h a 24h).","settings.open":"Defini\xE7\xF5es do aquecedor","settings.close":"Fechar","settings.target":"Temperatura alvo","settings.target_hint":"Avisa quando chega aqui","settings.target_down":"Baixar o alvo","settings.target_up":"Subir o alvo","settings.margin":"Margem","settings.band":"P\xE1ra a {stop} \xB0C, retoma a {restart} \xB0C","settings.margin_down":"Baixar a margem","settings.margin_up":"Subir a margem","settings.automatic":"Controlo autom\xE1tico","settings.automatic_hint":"Desligado: o aquecedor fica em modo manual","settings.cancel":'Quem pode cancelar "Aquecer agora"',"cancel.requesters":"Quem pediu e administradores","cancel.people":"Quem pediu, administradores e uma lista","cancel.everyone":"Todos","settings.more":"Mais defini\xE7\xF5es","solar.title":"Compara\xE7\xE3o solar","solar.none":"Ainda n\xE3o h\xE1 janelas registadas nos \xFAltimos 30 dias.","solar.would":"Com a regra solar ligada, a \xE1gua teria ficado pronta a tempo em {on_time} de {windows} janelas","solar.did":"Com a regra solar, a \xE1gua ficou pronta a tempo em {on_time} de {windows} janelas","solar.would_less":", e o aquecedor teria trabalhado menos {minutes} minutos","solar.would_more":", e o aquecedor teria trabalhado mais {minutes} minutos","solar.did_less":", e o aquecedor trabalhou menos {minutes} minutos","solar.did_more":", e o aquecedor trabalhou mais {minutes} minutos","solar.kwh":", cerca de {kwh} kWh","solar.applied":" A regra foi aplicada em {applied} delas: a tempo em {on_time}."},$t={en:vt,pt:bt};function Y(s){return s?.toLowerCase().startsWith("pt")?"pt":"en"}function D(s){return Y(s)==="pt"?"pt-PT":"en-GB"}function J(s){return l(s,"weekday.letters").split(",")}function l(s,e,t={}){return $t[Y(s)][e].replace(/\{(\w+)\}/g,(n,i)=>String(t[i]??n))}function pe(s){return s.callWS({type:"hot_water_ready/heaters"})}var X=class{constructor(e,t){this.onSnapshot=e;this.onMissing=t;this.generation=0}async follow(e,t){let a=this.generation,n=t;if(n===void 0){if(this.defaultEntryId??=pe(e).then(r=>r[0]?.entry_id),n=await this.defaultEntryId,a!==this.generation)return;if(n===void 0){this.defaultEntryId=void 0,this.onMissing();return}}if(n===this.entryId)return;this.stop();let i=this.generation;this.entryId=n,this.stopSubscription=e.connection.subscribeMessage(r=>{i===this.generation&&this.onSnapshot(r)},{type:"hot_water_ready/subscribe",entry_id:n}),this.stopSubscription.catch(()=>{i===this.generation&&(this.entryId=void 0,this.onMissing())})}stop(){this.generation++;let e=this.stopSubscription;this.stopSubscription=void 0,this.entryId=void 0,e?.then(t=>t()).catch(()=>{})}};function T(s,e,t){return new Intl.NumberFormat(D(e),{maximumFractionDigits:t}).format(s)}function U(s,e){return new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(s)}function Be(s){let e=new Date(`${s}T12:00:00Z`);return e.setUTCDate(e.getUTCDate()+1),e.toISOString().slice(0,10)}function je(s,e){let{language:t,timeZone:a,now:n}=e,i=new Date(s),r=Xe(s,e),d=U(n,a);if(U(i,a)===d)return l(t,"when.today",{time:r});if(U(i,a)===Be(d))return l(t,"when.tomorrow",{time:r});let o=new Intl.DateTimeFormat(D(t),{timeZone:a,weekday:"long"}).format(i);return l(t,"when.weekday",{time:r,weekday:o})}function xt(s,e){let{language:t}=e;return s.status==="heating"&&s.ready_in_minutes!==null?l(t,"headline.heating_for",{minutes:s.ready_in_minutes}):s.status==="waiting"&&s.next_ready?l(t,"headline.ready_at",{when:je(s.next_ready.at,e)}):l(t,`status.${s.status}`)}function Fe(s,e){let{language:t}=e,{temperature:a,target:n}=s,i=s.status==="ready"&&s.next_ready?l(t,"subline.next_at",{when:je(s.next_ready.at,e)}):"";return{temperature:a===null?"\u2013":`${T(a,t,1)}\xB0`,target:l(t,"ring.target",{target:T(n,t,1)}),headline:xt(s,e),subline:i,fill:a===null||n<=0?0:Math.min(1,Math.max(0,a/n)),tone:s.status}}function At(s,e){let t=e??s.me;return s.members.find(a=>a.id===t)??s.members[0]}function Ke(s){let e=I(s);return e==="admin"?!0:e==="viewer"&&s.members.length>1}function Ge(s,e){return At(s,I(s)==="member"?void 0:e)}function Ze(s){return U(s.now,s.timeZone)}function ge(s){return s.time!==""&&s.weekdays.length>0}function Qe(s,e){let t=J(e);return[...s.ready_times].sort((a,n)=>a.time.localeCompare(n.time)||a.id.localeCompare(n.id)).map(a=>({id:a.id,time:a.time,enabled:a.enabled,days:t.map((n,i)=>({letter:n,on:a.weekdays.includes(i)}))}))}function I(s){return s.is_admin?"admin":s.me?"member":"viewer"}function Ye(s,e){return s.members.map(t=>({id:t.id,name:t.name,initial:t.name.slice(0,1).toLocaleUpperCase(),colour:t.colour,star:t.virtual,faded:t.away.on,selected:t.id===e}))}function Je(s,e){let t=s.members.find(a=>a.id===s.me);return t?l(e,"greeting",{name:t.name}):""}function Xe(s,e){return new Intl.DateTimeFormat(D(e.language),{timeZone:e.timeZone,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(s))}function et(s,e,t){let a=new Map(s.members.map(i=>[i.id,i.name])),n=s.today.filter(i=>i.member!==t);return n.length===0?l(e.language,"today.nobody"):n.map(i=>`${a.get(i.member)??"?"} ${Xe(i.at,e)}`).join(" \xB7 ")}function kt(s,e){let t=new Date(`${s}T12:00:00Z`),a=D(e),n=new Intl.DateTimeFormat(a,{timeZone:"UTC",day:"numeric"}).format(t),i=new Intl.DateTimeFormat(a,{timeZone:"UTC",month:"long"}).format(t);return Y(e)==="pt"?`${n} de ${i.slice(0,1).toLocaleUpperCase("pt-PT")}${i.slice(1)}`:`${n} ${i}`}function tt(s,e){return s.away.on?s.away.until?l(e.language,"away.line_until",{date:kt(s.away.until,e.language)}):l(e.language,"away.line"):""}var Ve="hot_water_ready/heat_now/start",ze="hot_water_ready/heat_now/cancel";function at(s){let e=s.can_ask_heat_now&&!s.heat_now_blocked,t=s.heat_now;if(!t)return e?[{command:Ve,label:"heat_now.start",primary:!0}]:[];if(t.asked)return[{command:ze,label:"heat_now.cancel",primary:!0}];let a=e?[{command:Ve,label:"heat_now.join",primary:!0}]:[];return t.can_cancel&&a.push({command:ze,label:"heat_now.cancel",primary:!1}),a}function st(s,e){return s.faults.map(t=>l(e,`fault.${t}`))}var nt="hot_water_ready/settings/set",St={min:30,max:75,step:.5},Ct={min:0,max:5,step:.5},Tt=["requesters","people","everyone"];function qe(s,e,t){let a=Math.ceil(s/e.step-1e-9)*e.step-e.step,n=Math.floor(s/e.step+1e-9)*e.step+e.step;return{shown:T(s,t,1),down:a>=e.min-1e-9?a:null,up:n<=e.max+1e-9?n:null}}function it(s,e){let t=s.settings;if(!(!s.is_admin||!t))return{target:qe(s.target,St,e),margin:qe(s.margin,Ct,e),band:l(e,"settings.band",{stop:T(s.target+s.margin,e,1),restart:T(s.target-s.margin,e,1)}),automatic:s.automatic,cancel:Tt.map(a=>({rule:a,label:`cancel.${a}`,selected:a===t.cancel_rule})),solar:Et(t,e),notes:s.not_rising_checked?[]:[l(e,"note.not_rising_skipped")]}}function Et(s,e){let{windows:t,on_time:a,minutes_saved:n,kwh:i}=s.solar;if(t===0)return l(e,"solar.none");let r=s.solar_aware?"did":"would",d=l(e,`solar.${r}`,{on_time:a,windows:t});n!==0&&(d+=l(e,`solar.${r}_${n>0?"less":"more"}`,{minutes:Math.abs(n)}),i!==null&&(d+=l(e,"solar.kwh",{kwh:T(Math.abs(i),e,1)}))),d+=".";let{solar_windows:o,solar_on_time:p}=s.solar;return o>0&&(d+=l(e,"solar.applied",{applied:o,on_time:p})),d}var he=300,ue=1440;function We(s,e){let t=new Date(s),a=new Intl.DateTimeFormat("en-GB",{timeZone:e,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).reduce((n,i)=>({...n,[i.type]:i.value}),{});return{day:U(t,e),minutes:Number(a.hour)*60+Number(a.minute)}}function rt(s,e){let t=s.week;if(!s.is_admin||!t)return;let a=l(e.language,"week.days").split(","),n=a.map((o,p)=>Ht(t.monday,p)),i=s.members.map(o=>Rt(o,n,e.language)),r=n.map((o,p)=>i.reduce((g,u)=>{let m=u.cells[p];return m&&!m.away?g+m.times.length:g},0)),d=Math.max(0,...r);return{days:n.map((o,p)=>({key:o,label:a[p]??o,today:o===t.today,bars:Pt(o,t.windows,e.timeZone)})),rows:i,showers:r.reduce((o,p)=>o+p,0),windows:t.windows.length,busiest:d>0?a[r.indexOf(d)]??"":""}}function Ht(s,e){let t=s;for(let a=0;a<e;a+=1)t=Be(t);return t}function Mt(s,e){return s.away.on&&(s.away.until===null||e<=s.away.until)}function Rt(s,e,t){let a=s.ready_times.filter(o=>o.enabled),n=e.map((o,p)=>({times:a.filter(g=>g.weekdays.includes(p)).map(g=>g.time).sort(),away:Mt(s,o)})),i=n.every(o=>o.away),r=n.reduce((o,p)=>o+p.times.length,0),d=l(t,"week.per_week",{count:r});return i?d=l(t,"week.away"):s.virtual&&(d=l(t,"week.virtual",{count:r})),{id:s.id,name:s.name,colour:s.colour,initial:s.virtual?"\u2605":s.name[0]??"?",away:i,note:d,cells:n}}function Pt(s,e,t){let a=ue-he,n=[];for(let i of e){let r=We(i.start,t),d=We(i.end,t);if(r.day>s||d.day<s)continue;let o=Math.max(he,r.day<s?0:r.minutes),p=Math.min(ue,d.day>s?ue:d.minutes);p>o&&n.push({from:(o-he)/a,length:(p-o)/a})}return n}var L="hot-water-ready-card",me=38,ot=2*Math.PI*me,Ot=[0,1,2,3,4,5,6],fe=class extends v{constructor(){super(...arguments);this._missing=!1;this._settingsOpen=!1;this._tab="people";this._error="";this._subscription=new X(t=>{this._heater=t,this._missing=!1},()=>{this._missing=!0})}static{this.properties={hass:{attribute:!1},_config:{state:!0},_heater:{state:!0},_missing:{state:!0},_selected:{state:!0},_sheet:{state:!0},_settingsOpen:{state:!0},_tab:{state:!0},_focus:{state:!0},_error:{state:!0}}}static async getStubConfig(t){let a=(await pe(t))[0];return a?{type:`custom:${L}`,entry_id:a.entry_id}:{type:`custom:${L}`}}setConfig(t){this._config=t}getCardSize(){return 6}get _language(){return this.hass?.locale?.language??this.hass?.language??"en"}get _context(){return{language:this._language,timeZone:this.hass?.config?.time_zone??Intl.DateTimeFormat().resolvedOptions().timeZone,now:new Date}}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._subscription.stop()}updated(t){(t.has("hass")||t.has("_config"))&&this._follow()}_follow(){this.hass&&this._config&&this.isConnected&&this._subscription.follow(this.hass,this._config.entry_id)}async _call(t){if(!this.hass||!this._heater)return!1;this._error="";try{return await this.hass.callWS({entry_id:this._heater.entry_id,...t}),!0}catch(a){let n=(a instanceof Error,a.message);return this._error=l(this._language,"card.error",{message:n??String(a)}),!1}}async _save(t){let a=this._sheet;if(!a||!ge(a))return;await this._call({type:"hot_water_ready/ready_time/add",member_id:t.id,time:a.time,weekdays:[...a.weekdays].sort()})&&(this._sheet=void 0)}render(){let t=this._language;if(this._missing)return c`<ha-card><div class="message">${l(t,"card.no_heater")}</div></ha-card>`;let a=this._heater;if(!a)return c`<ha-card><div class="message">${l(t,"card.loading")}</div></ha-card>`;let n=I(a),i=Ge(a,this._selected),r=rt(a,this._context);return c`
      <ha-card>
        ${st(a,t).map(d=>c`<div class="banner fault" role="alert">${d}</div>`)}
        ${a.automatic?h:c`<div class="banner manual">${l(t,"manual")}</div>`}
        ${this._renderTop(a)}
        ${this._renderSettings(a)}
        ${this._renderTabs(a)}
        ${r&&this._tab==="week"?this._renderWeek(r):c`
              ${n==="member"?c`<div class="greeting">${Je(a,t)}</div>`:this._renderAvatars(a,i)}
              ${i?this._renderList(i):c`<div class="message">${l(t,"members.none")}</div>`}
              ${i&&this._sheet?this._renderSheet(i,this._sheet):h}
              ${i?this._renderAway(i):h}
              ${n==="member"&&i?this._renderToday(a,i):h}
            `}
        ${this._error?c`<div class="error" role="alert">${this._error}</div>`:h}
      </ha-card>
    `}_renderAway(t){let a=this._language,n=tt(t,this._context);if(!t.can_edit)return n?c`<div class="away-line">${n}</div>`:h;let i=(r,d)=>this._call({type:"hot_water_ready/away/set",member_id:t.id,away:r,until:d});return c`
      <div class="away">
        <label class="away-toggle">
          <input
            type="checkbox"
            class="switch"
            .checked=${N(t.away.on)}
            @change=${r=>{i(r.target.checked,null)}}
          />
          ${n||l(a,"away.line")}
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
          <circle class="track" cx="46" cy="46" r=${me}></circle>
          ${a.fill>0?Re`<circle class="fill ${a.tone}" cx="46" cy="46" r=${me}
                stroke-dasharray="${a.fill*ot} ${ot}"
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
            ${at(t).map(n=>c`<button
                class=${n.primary?"primary":"secondary"}
                @click=${()=>{this._call({type:n.command})}}
              >
                ${l(this._language,n.label)}
              </button>`)}
          </div>
        </div>
      </div>
    `}_renderTabs(t){if(!t.week)return h;let a=n=>c`<button
      class="tab ${this._tab===n?"on":""}"
      role="tab"
      aria-selected=${this._tab===n}
      @click=${()=>this._tab=n}
    >
      ${l(this._language,`tabs.${n}`)}
    </button>`;return c`<div class="tabs" role="tablist">${a("people")}${a("week")}</div>`}_renderWeek(t){let a=this._language,n=this._focus;return c`
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
                class="who ${i.away?"away":""} ${n&&n!==i.id?"dim":""}"
                aria-pressed=${n===i.id}
                @click=${()=>this._focus=n===i.id?void 0:i.id}
              >
                <span class="mini" style="background: var(--${i.colour}-color, var(--primary-color))"
                  >${i.initial}</span
                >
                <span class="who-text"><span>${i.name}</span><span class="hint">${i.note}</span></span>
              </button>
              ${i.cells.map((r,d)=>c`<div
                  class="cell ${t.days[d]?.today?"is-today":""} ${n&&n!==i.id?"dim":""}"
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
    `}_renderSettings(t){let a=this._language,n=this._settingsOpen?it(t,a):void 0;if(!n)return h;let i=r=>this._call({type:nt,...r});return c`
      <div class="sheet settings" role="dialog" aria-label=${l(a,"settings.open")}>
        <div class="sheet-head">
          <div class="sheet-title">${l(a,"settings.open")}</div>
          <button class="secondary" @click=${()=>this._settingsOpen=!1}>
            ${l(a,"settings.close")}
          </button>
        </div>
        ${this._renderStepper(n.target,`${n.target.shown} \xB0C`,l(a,"settings.target"),l(a,"settings.target_hint"),["settings.target_down","settings.target_up"],r=>i({target:r}))}
        ${this._renderStepper(n.margin,`\xB1 ${n.margin.shown}`,l(a,"settings.margin"),n.band,["settings.margin_down","settings.margin_up"],r=>i({margin:r}))}
        <label class="setting">
          <span class="setting-text">
            <span>${l(a,"settings.automatic")}</span>
            <span class="hint">${l(a,"settings.automatic_hint")}</span>
          </span>
          <input
            type="checkbox"
            class="switch"
            .checked=${N(n.automatic)}
            @change=${r=>i({automatic:r.target.checked})}
          />
        </label>
        <div class="setting column">
          <span>${l(a,"settings.cancel")}</span>
          <div class="choices" role="radiogroup">
            ${n.cancel.map(r=>c`<button
                class="choice ${r.selected?"on":""}"
                role="radio"
                aria-checked=${r.selected}
                @click=${()=>i({cancel_rule:r.rule})}
              >
                ${l(a,r.label)}
              </button>`)}
          </div>
        </div>
        ${this._renderSolar(n)}
        <button
          class="link"
          @click=${()=>{this._openIntegration()}}
        >
          ${l(a,"settings.more")}</button>
      </div>
    `}_renderStepper(t,a,n,i,r,d){let o=(p,g,u)=>c`<button
      class="step"
      aria-label=${l(this._language,g)}
      ?disabled=${p===null}
      @click=${()=>p===null?void 0:d(p)}
    >
      ${u}
    </button>`;return c`<div class="setting">
      <span class="setting-text"><span>${n}</span><span class="hint">${i}</span></span>
      ${o(t.down,r[0],"\u2212")}
      <span class="value">${a}</span>
      ${o(t.up,r[1],"+")}
    </div>`}_renderSolar(t){let a=this._language;return c`<div class="setting column solar">
      <span>${l(a,"solar.title")}</span>
      <span class="hint">${t.solar}</span>
      ${t.notes.map(n=>c`<span class="hint">${n}</span>`)}
    </div>`}_renderAvatars(t,a){if(!Ke(t))return h;let n=I(t)==="admin";return c`
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
        ${n?c`<button
              class="avatar add-member"
              @click=${()=>{this._openIntegration()}}
            >
              <span class="dot plus">+</span>
              <span class="label">${l(this._language,"members.add")}</span>
            </button>`:h}
      </div>
    `}_renderList(t){let a=this._language,n=Qe(t,a);return c`
      <div class="list">
        ${n.length===0?c`<div class="empty">${l(a,"list.empty")}</div>`:h}
        ${n.map(i=>c`
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
        ${t.can_edit?c`<button class="add" @click=${()=>this._sheet={time:"07:00",weekdays:[...Ot]}}>
              + ${l(a,"list.add")}
            </button>`:h}
      </div>
    `}_renderSheet(t,a){let n=this._language,i=J(n),r=d=>{let o=a.weekdays.includes(d)?a.weekdays.filter(p=>p!==d):[...a.weekdays,d];this._sheet={...a,weekdays:o}};return c`
      <div class="sheet" role="dialog" aria-label=${l(n,"sheet.title")}>
        <div class="sheet-title">${l(n,"sheet.title")}</div>
        <label class="field">
          ${l(n,"sheet.time")}
          <input
            type="time"
            .value=${a.time}
            @input=${d=>{this._sheet={...a,time:d.target.value}}}
          />
        </label>
        <div class="field">
          ${l(n,"sheet.days")}
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
          <button class="secondary" @click=${()=>this._sheet=void 0}>${l(n,"sheet.cancel")}</button>
          <button class="primary" ?disabled=${!ge(a)} @click=${()=>this._save(t)}>
            ${l(n,"sheet.save")}
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
  `}};if(!customElements.get(L)){customElements.define(L,fe);let s=window;s.customCards=s.customCards??[],s.customCards.push({type:L,name:"Hot Water Ready",description:"Water temperature, ready times and heat now.",preview:!0})}export{fe as HotWaterReadyCard};
