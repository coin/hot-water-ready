var V=globalThis,z=V.ShadowRoot&&(V.ShadyCSS===void 0||V.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ee=Symbol(),me=new WeakMap,T=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==ee)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(z&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=me.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&me.set(t,e))}return e}toString(){return this.cssText}},fe=n=>new T(typeof n=="string"?n:n+"",void 0,ee),te=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((s,i,a)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[a+1],n[0]);return new T(t,n,ee)},_e=(n,e)=>{if(z)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=V.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,n.appendChild(s)}},se=z?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return fe(t)})(n):n;var{is:nt,defineProperty:it,getOwnPropertyDescriptor:at,getOwnPropertyNames:rt,getOwnPropertySymbols:ot,getPrototypeOf:lt}=Object,q=globalThis,ye=q.trustedTypes,dt=ye?ye.emptyScript:"",ct=q.reactiveElementPolyfillSupport,H=(n,e)=>n,ne={toAttribute(n,e){switch(e){case Boolean:n=n?dt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},ve=(n,e)=>!nt(n,e),we={attribute:!0,type:String,converter:ne,reflect:!1,useDefault:!1,hasChanged:ve};Symbol.metadata??=Symbol("metadata"),q.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=we){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&it(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:a}=at(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:i,set(r){let d=i?.call(this);a?.call(this,r),this.requestUpdate(e,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??we}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;let e=lt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){let t=this.properties,s=[...rt(t),...ot(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(se(i))}else e!==void 0&&t.push(se(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _e(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let a=(s.converter?.toAttribute!==void 0?s.converter:ne).toAttribute(t,s.type);this._$Em=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let a=s.getPropertyOptions(i),r=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:ne;this._$Em=i;let d=r.fromAttribute(t,a.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(e!==void 0){let r=this.constructor;if(i===!1&&(a=this[e]),s??=r.getPropertyOptions(e),!((s.hasChanged??ve)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},r){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),a!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,a]of s){let{wrapped:r}=a,d=this[i];r!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,a,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[H("elementProperties")]=new Map,_[H("finalized")]=new Map,ct?.({ReactiveElement:_}),(q.reactiveElementVersions??=[]).push("2.1.2");var ae=globalThis,$e=n=>n,B=ae.trustedTypes,be=B?B.createPolicy("lit-html",{createHTML:n=>n}):void 0,re="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,oe="?"+y,pt=`<${oe}>`,x=document,R=()=>x.createComment(""),P=n=>n===null||typeof n!="object"&&typeof n!="function",le=Array.isArray,Ee=n=>le(n)||typeof n?.[Symbol.iterator]=="function",ie=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xe=/-->/g,Ae=/>/g,$=RegExp(`>|${ie}(?:([^\\s"'>=/]+)(${ie}*=${ie}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Se=/'/g,ke=/"/g,Te=/^(?:script|style|textarea|title)$/i,de=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),p=de(1),He=de(2),Mt=de(3),m=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Ce=new WeakMap,b=x.createTreeWalker(x,129);function Me(n,e){if(!le(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return be!==void 0?be.createHTML(e):e}var Re=(n,e)=>{let t=n.length-1,s=[],i,a=e===2?"<svg>":e===3?"<math>":"",r=M;for(let d=0;d<t;d++){let l=n[d],h,g,u=-1,f=0;for(;f<l.length&&(r.lastIndex=f,g=r.exec(l),g!==null);)f=r.lastIndex,r===M?g[1]==="!--"?r=xe:g[1]!==void 0?r=Ae:g[2]!==void 0?(Te.test(g[2])&&(i=RegExp("</"+g[2],"g")),r=$):g[3]!==void 0&&(r=$):r===$?g[0]===">"?(r=i??M,u=-1):g[1]===void 0?u=-2:(u=r.lastIndex-g[2].length,h=g[1],r=g[3]===void 0?$:g[3]==='"'?ke:Se):r===ke||r===Se?r=$:r===xe||r===Ae?r=M:(r=$,i=void 0);let w=r===$&&n[d+1].startsWith("/>")?" ":"";a+=r===M?l+pt:u>=0?(s.push(h),l.slice(0,u)+re+l.slice(u)+y+w):l+y+(u===-2?d:w)}return[Me(n,a+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},O=class n{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,r=0,d=e.length-1,l=this.parts,[h,g]=Re(e,t);if(this.el=n.createElement(h,s),b.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=b.nextNode())!==null&&l.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(re)){let f=g[r++],w=i.getAttribute(u).split(y),D=/([.?@])?(.*)/.exec(f);l.push({type:1,index:a,name:D[2],strings:w,ctor:D[1]==="."?W:D[1]==="?"?F:D[1]==="@"?K:S}),i.removeAttribute(u)}else u.startsWith(y)&&(l.push({type:6,index:a}),i.removeAttribute(u));if(Te.test(i.tagName)){let u=i.textContent.split(y),f=u.length-1;if(f>0){i.textContent=B?B.emptyScript:"";for(let w=0;w<f;w++)i.append(u[w],R()),b.nextNode(),l.push({type:2,index:++a});i.append(u[f],R())}}}else if(i.nodeType===8)if(i.data===oe)l.push({type:2,index:a});else{let u=-1;for(;(u=i.data.indexOf(y,u+1))!==-1;)l.push({type:7,index:a}),u+=y.length-1}a++}}static createElement(e,t){let s=x.createElement("template");return s.innerHTML=e,s}};function A(n,e,t=n,s){if(e===m)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,a=P(e)?void 0:e._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(n),i._$AT(n,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=A(n,i._$AS(n,e.values),i,s)),e}var j=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??x).importNode(t,!0);b.currentNode=i;let a=b.nextNode(),r=0,d=0,l=s[0];for(;l!==void 0;){if(r===l.index){let h;l.type===2?h=new C(a,a.nextSibling,this,e):l.type===1?h=new l.ctor(a,l.name,l.strings,this,e):l.type===6&&(h=new Z(a,this,e)),this._$AV.push(h),l=s[++d]}r!==l?.index&&(a=b.nextNode(),r++)}return b.currentNode=x,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},C=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=A(this,e,t),P(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==m&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ee(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(x.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=O.createElement(Me(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let a=new j(i,this),r=a.u(this.options);a.p(t),this.T(r),this._$AH=a}}_$AC(e){let t=Ce.get(e.strings);return t===void 0&&Ce.set(e.strings,t=new O(e)),t}k(e){le(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let a of e)i===t.length?t.push(s=new n(this.O(R()),this.O(R()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=$e(e).nextSibling;$e(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(e,t=this,s,i){let a=this.strings,r=!1;if(a===void 0)e=A(this,e,t,0),r=!P(e)||e!==this._$AH&&e!==m,r&&(this._$AH=e);else{let d=e,l,h;for(e=a[0],l=0;l<a.length-1;l++)h=A(this,d[s+l],t,l),h===m&&(h=this._$AH[l]),r||=!P(h)||h!==this._$AH[l],h===c?e=c:e!==c&&(e+=(h??"")+a[l+1]),this._$AH[l]=h}r&&!i&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},W=class extends S{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},F=class extends S{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},K=class extends S{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=A(this,e,t,0)??c)===m)return;let s=this._$AH,i=e===c&&s!==c||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==c&&(s===c||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Z=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){A(this,e)}},Pe={M:re,P:y,A:oe,C:1,L:Re,R:j,D:Ee,V:A,I:C,H:S,N:F,U:K,B:W,F:Z},ht=ae.litHtmlPolyfillSupport;ht?.(O,C),(ae.litHtmlVersions??=[]).push("3.3.3");var Oe=(n,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let a=t?.renderBefore??null;s._$litPart$=i=new C(e.insertBefore(R(),a),a,void 0,t??{})}return i._$AI(n),i};var ce=globalThis,v=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Oe(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return m}};v._$litElement$=!0,v.finalized=!0,ce.litElementHydrateSupport?.({LitElement:v});var ut=ce.litElementPolyfillSupport;ut?.({LitElement:v});(ce.litElementVersions??=[]).push("4.2.2");var k={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ne=n=>(...e)=>({_$litDirective$:n,values:e}),G=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:Ft}=Pe;var Ue=n=>n.strings===void 0;var gt={},Ie=(n,e=gt)=>n._$AH=e;var N=Ne(class extends G{constructor(n){if(super(n),n.type!==k.PROPERTY&&n.type!==k.ATTRIBUTE&&n.type!==k.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Ue(n))throw Error("`live` bindings can only contain a single expression")}render(n){return n}update(n,[e]){if(e===m||e===c)return e;let t=n.element,s=n.name;if(n.type===k.PROPERTY){if(e===t[s])return m}else if(n.type===k.BOOLEAN_ATTRIBUTE){if(!!e===t.hasAttribute(s))return m}else if(n.type===k.ATTRIBUTE&&t.getAttribute(s)===e+"")return m;return Ie(n),e}});var mt={"status.waiting":"Waiting","status.heating":"Heating","status.ready":"Ready","status.fault":"Fault","status.manual":"Manual","headline.heating_for":"Heating: ready in about {minutes} min","headline.ready_at":"Ready at {when}","subline.next_at":"Next at {when}","when.today":"{time}","when.tomorrow":"{time} tomorrow","when.weekday":"{time} on {weekday}","ring.target":"target {target}\xB0","weekday.letters":"M,T,W,T,F,S,S","members.none":"No members yet. An administrator adds them in the integration's settings.","list.empty":"No ready times yet.","list.add":"Add a ready time","list.remove":"Remove","list.switch":"On or off","sheet.title":"New ready time","sheet.time":"Time","sheet.days":"Days","sheet.save":"Save","sheet.cancel":"Cancel","fault.sensor_unavailable":"Fault: the water temperature sensor gives no readings. Heating has stopped.","fault.not_rising":"Fault: the water is not getting hotter. Heating has stopped; see Repairs.","fault.no_consumption":"Fault: the heater draws no power. Heating has stopped; see Repairs.","fault.relay_stuck":"Fault: the heater draws power while switched off. Check the relay.",manual:"Automatic control is off: the heater is run by hand.","note.not_rising_skipped":'The thermostat does not say when it is heating, so the "water not getting hotter" and "heater draws no power" checks are not made.',"heat_now.start":"Heat now","heat_now.cancel":"Cancel","heat_now.join":"Tell me too",greeting:"Hello, {name}","today.label":"House today","today.nobody":"Nobody else today","away.until_label":"Until (optional)","away.line":"Away","away.line_until":"Away until {date}","members.add":"Member","card.no_heater":"No Hot Water Ready heater is set up yet.","card.loading":"Loading\u2026","card.error":"That did not work: {message}","settings.open":"Heater settings","settings.close":"Close","settings.target":"Target temperature","settings.target_hint":"Ready when the water gets here","settings.target_down":"Lower the target","settings.target_up":"Raise the target","settings.margin":"Margin","settings.band":"Stops at {stop} \xB0C, restarts at {restart} \xB0C","settings.margin_down":"Lower the margin","settings.margin_up":"Raise the margin","settings.automatic":"Automatic control","settings.automatic_hint":"Off: the heater is run by hand","settings.cancel":'Who may cancel "Heat now"',"cancel.requesters":"Who asked and admins","cancel.people":"Who asked, admins and a list","cancel.everyone":"Everyone","settings.more":"More settings","solar.title":"Solar comparison","solar.none":"No windows recorded in the last 30 days yet.","solar.would":"With the solar-aware rule on, the water would have been ready on time in {on_time} of {windows} windows","solar.did":"With the solar-aware rule, the water was ready on time in {on_time} of {windows} windows","solar.would_less":", and the heater would have run {minutes} minutes less","solar.would_more":", and the heater would have run {minutes} minutes more","solar.did_less":", and the heater ran {minutes} minutes less","solar.did_more":", and the heater ran {minutes} minutes more","solar.kwh":", about {kwh} kWh","solar.applied":" The rule was applied in {applied} of them: on time in {on_time}."},ft={"status.waiting":"Em espera","status.heating":"A aquecer","status.ready":"Pronta","status.fault":"Avaria","status.manual":"Manual","headline.heating_for":"A aquecer: pronta em cerca de {minutes} min","headline.ready_at":"Pronta \xE0s {when}","subline.next_at":"Pr\xF3xima \xE0s {when}","when.today":"{time}","when.tomorrow":"{time} de amanh\xE3","when.weekday":"{time} de {weekday}","ring.target":"alvo {target}\xB0","weekday.letters":"S,T,Q,Q,S,S,D","members.none":"Ainda n\xE3o h\xE1 membros. Um administrador acrescenta-os nas defini\xE7\xF5es da integra\xE7\xE3o.","list.empty":"Ainda n\xE3o h\xE1 hor\xE1rios.","list.add":"Acrescentar um hor\xE1rio","list.remove":"Remover","list.switch":"Ligar ou desligar","sheet.title":"Novo hor\xE1rio","sheet.time":"Hora","sheet.days":"Dias","sheet.save":"Guardar","sheet.cancel":"Cancelar","fault.sensor_unavailable":"Avaria: o sensor da temperatura da \xE1gua n\xE3o d\xE1 leituras. O aquecimento parou.","fault.not_rising":"Avaria: a \xE1gua n\xE3o aquece. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.no_consumption":"Avaria: o aquecedor n\xE3o consome energia. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.relay_stuck":"Avaria: o aquecedor consome energia com o rel\xE9 desligado. Verifique o rel\xE9.",manual:"O controlo autom\xE1tico est\xE1 desligado: o aquecedor est\xE1 a ser comandado manualmente.","note.not_rising_skipped":'O term\xF3stato n\xE3o indica quando est\xE1 a aquecer, por isso as verifica\xE7\xF5es "a \xE1gua n\xE3o aquece" e "o aquecedor n\xE3o consome energia" n\xE3o s\xE3o feitas.',"heat_now.start":"Aquecer agora","heat_now.cancel":"Cancelar","heat_now.join":"Avisar-me tamb\xE9m",greeting:"Ol\xE1, {name}","today.label":"Casa hoje","today.nobody":"Mais ningu\xE9m hoje","away.until_label":"At\xE9 (opcional)","away.line":"Ausente","away.line_until":"Ausente at\xE9 {date}","members.add":"Membro","card.no_heater":"Ainda n\xE3o h\xE1 nenhum aquecedor do Hot Water Ready configurado.","card.loading":"A carregar\u2026","card.error":"N\xE3o foi poss\xEDvel: {message}","settings.open":"Defini\xE7\xF5es do aquecedor","settings.close":"Fechar","settings.target":"Temperatura alvo","settings.target_hint":"Avisa quando chega aqui","settings.target_down":"Baixar o alvo","settings.target_up":"Subir o alvo","settings.margin":"Margem","settings.band":"P\xE1ra a {stop} \xB0C, retoma a {restart} \xB0C","settings.margin_down":"Baixar a margem","settings.margin_up":"Subir a margem","settings.automatic":"Controlo autom\xE1tico","settings.automatic_hint":"Desligado: o aquecedor fica em modo manual","settings.cancel":'Quem pode cancelar "Aquecer agora"',"cancel.requesters":"Quem pediu e administradores","cancel.people":"Quem pediu, administradores e uma lista","cancel.everyone":"Todos","settings.more":"Mais defini\xE7\xF5es","solar.title":"Compara\xE7\xE3o solar","solar.none":"Ainda n\xE3o h\xE1 janelas registadas nos \xFAltimos 30 dias.","solar.would":"Com a regra solar ligada, a \xE1gua teria ficado pronta a tempo em {on_time} de {windows} janelas","solar.did":"Com a regra solar, a \xE1gua ficou pronta a tempo em {on_time} de {windows} janelas","solar.would_less":", e o aquecedor teria trabalhado menos {minutes} minutos","solar.would_more":", e o aquecedor teria trabalhado mais {minutes} minutos","solar.did_less":", e o aquecedor trabalhou menos {minutes} minutos","solar.did_more":", e o aquecedor trabalhou mais {minutes} minutos","solar.kwh":", cerca de {kwh} kWh","solar.applied":" A regra foi aplicada em {applied} delas: a tempo em {on_time}."},_t={en:mt,pt:ft};function Q(n){return n?.toLowerCase().startsWith("pt")?"pt":"en"}function U(n){return Q(n)==="pt"?"pt-PT":"en-GB"}function Y(n){return o(n,"weekday.letters").split(",")}function o(n,e,t={}){return _t[Q(n)][e].replace(/\{(\w+)\}/g,(i,a)=>String(t[a]??i))}function pe(n){return n.callWS({type:"hot_water_ready/heaters"})}var J=class{constructor(e,t){this.onSnapshot=e;this.onMissing=t;this.generation=0}async follow(e,t){let s=this.generation,i=t;if(i===void 0){if(this.defaultEntryId??=pe(e).then(r=>r[0]?.entry_id),i=await this.defaultEntryId,s!==this.generation)return;if(i===void 0){this.defaultEntryId=void 0,this.onMissing();return}}if(i===this.entryId)return;this.stop();let a=this.generation;this.entryId=i,this.stopSubscription=e.connection.subscribeMessage(r=>{a===this.generation&&this.onSnapshot(r)},{type:"hot_water_ready/subscribe",entry_id:i}),this.stopSubscription.catch(()=>{a===this.generation&&(this.entryId=void 0,this.onMissing())})}stop(){this.generation++;let e=this.stopSubscription;this.stopSubscription=void 0,this.entryId=void 0,e?.then(t=>t()).catch(()=>{})}};function E(n,e,t){return new Intl.NumberFormat(U(e),{maximumFractionDigits:t}).format(n)}function X(n,e){return new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(n)}function yt(n){let e=new Date(`${n}T12:00:00Z`);return e.setUTCDate(e.getUTCDate()+1),e.toISOString().slice(0,10)}function ze(n,e){let{language:t,timeZone:s,now:i}=e,a=new Date(n),r=Ge(n,e),d=X(i,s);if(X(a,s)===d)return o(t,"when.today",{time:r});if(X(a,s)===yt(d))return o(t,"when.tomorrow",{time:r});let l=new Intl.DateTimeFormat(U(t),{timeZone:s,weekday:"long"}).format(a);return o(t,"when.weekday",{time:r,weekday:l})}function wt(n,e){let{language:t}=e;return n.status==="heating"&&n.ready_in_minutes!==null?o(t,"headline.heating_for",{minutes:n.ready_in_minutes}):n.status==="waiting"&&n.next_ready?o(t,"headline.ready_at",{when:ze(n.next_ready.at,e)}):o(t,`status.${n.status}`)}function qe(n,e){let{language:t}=e,{temperature:s,target:i}=n,a=n.status==="ready"&&n.next_ready?o(t,"subline.next_at",{when:ze(n.next_ready.at,e)}):"";return{temperature:s===null?"\u2013":`${E(s,t,1)}\xB0`,target:o(t,"ring.target",{target:E(i,t,1)}),headline:wt(n,e),subline:a,fill:s===null||i<=0?0:Math.min(1,Math.max(0,s/i)),tone:n.status}}function vt(n,e){let t=e??n.me;return n.members.find(s=>s.id===t)??n.members[0]}function Be(n){let e=I(n);return e==="admin"?!0:e==="viewer"&&n.members.length>1}function je(n,e){return vt(n,I(n)==="member"?void 0:e)}function We(n){return X(n.now,n.timeZone)}function he(n){return n.time!==""&&n.weekdays.length>0}function Fe(n,e){let t=Y(e);return[...n.ready_times].sort((s,i)=>s.time.localeCompare(i.time)||s.id.localeCompare(i.id)).map(s=>({id:s.id,time:s.time,enabled:s.enabled,days:t.map((i,a)=>({letter:i,on:s.weekdays.includes(a)}))}))}function I(n){return n.is_admin?"admin":n.me?"member":"viewer"}function Ke(n,e){return n.members.map(t=>({id:t.id,name:t.name,initial:t.name.slice(0,1).toLocaleUpperCase(),colour:t.colour,star:t.virtual,faded:t.away.on,selected:t.id===e}))}function Ze(n,e){let t=n.members.find(s=>s.id===n.me);return t?o(e,"greeting",{name:t.name}):""}function Ge(n,e){return new Intl.DateTimeFormat(U(e.language),{timeZone:e.timeZone,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(n))}function Qe(n,e,t){let s=new Map(n.members.map(a=>[a.id,a.name])),i=n.today.filter(a=>a.member!==t);return i.length===0?o(e.language,"today.nobody"):i.map(a=>`${s.get(a.member)??"?"} ${Ge(a.at,e)}`).join(" \xB7 ")}function $t(n,e){let t=new Date(`${n}T12:00:00Z`),s=U(e),i=new Intl.DateTimeFormat(s,{timeZone:"UTC",day:"numeric"}).format(t),a=new Intl.DateTimeFormat(s,{timeZone:"UTC",month:"long"}).format(t);return Q(e)==="pt"?`${i} de ${a.slice(0,1).toLocaleUpperCase("pt-PT")}${a.slice(1)}`:`${i} ${a}`}function Ye(n,e){return n.away.on?n.away.until?o(e.language,"away.line_until",{date:$t(n.away.until,e.language)}):o(e.language,"away.line"):""}var Le="hot_water_ready/heat_now/start",De="hot_water_ready/heat_now/cancel";function Je(n){let e=n.can_ask_heat_now&&!n.heat_now_blocked,t=n.heat_now;if(!t)return e?[{command:Le,label:"heat_now.start",primary:!0}]:[];if(t.asked)return[{command:De,label:"heat_now.cancel",primary:!0}];let s=e?[{command:Le,label:"heat_now.join",primary:!0}]:[];return t.can_cancel&&s.push({command:De,label:"heat_now.cancel",primary:!1}),s}function Xe(n,e){return n.faults.map(t=>o(e,`fault.${t}`))}var et="hot_water_ready/settings/set",bt={min:30,max:75,step:.5},xt={min:0,max:5,step:.5},At=["requesters","people","everyone"];function Ve(n,e,t){let s=Math.ceil(n/e.step-1e-9)*e.step-e.step,i=Math.floor(n/e.step+1e-9)*e.step+e.step;return{shown:E(n,t,1),down:s>=e.min-1e-9?s:null,up:i<=e.max+1e-9?i:null}}function tt(n,e){let t=n.settings;if(!(!n.is_admin||!t))return{target:Ve(n.target,bt,e),margin:Ve(n.margin,xt,e),band:o(e,"settings.band",{stop:E(n.target+n.margin,e,1),restart:E(n.target-n.margin,e,1)}),automatic:n.automatic,cancel:At.map(s=>({rule:s,label:`cancel.${s}`,selected:s===t.cancel_rule})),solar:St(t,e),notes:n.not_rising_checked?[]:[o(e,"note.not_rising_skipped")]}}function St(n,e){let{windows:t,on_time:s,minutes_saved:i,kwh:a}=n.solar;if(t===0)return o(e,"solar.none");let r=n.solar_aware?"did":"would",d=o(e,`solar.${r}`,{on_time:s,windows:t});i!==0&&(d+=o(e,`solar.${r}_${i>0?"less":"more"}`,{minutes:Math.abs(i)}),a!==null&&(d+=o(e,"solar.kwh",{kwh:E(Math.abs(a),e,1)}))),d+=".";let{solar_windows:l,solar_on_time:h}=n.solar;return l>0&&(d+=o(e,"solar.applied",{applied:l,on_time:h})),d}var L="hot-water-ready-card",ue=38,st=2*Math.PI*ue,kt=[0,1,2,3,4,5,6],ge=class extends v{constructor(){super(...arguments);this._missing=!1;this._settingsOpen=!1;this._error="";this._subscription=new J(t=>{this._heater=t,this._missing=!1},()=>{this._missing=!0})}static{this.properties={hass:{attribute:!1},_config:{state:!0},_heater:{state:!0},_missing:{state:!0},_selected:{state:!0},_sheet:{state:!0},_settingsOpen:{state:!0},_error:{state:!0}}}static async getStubConfig(t){let s=(await pe(t))[0];return s?{type:`custom:${L}`,entry_id:s.entry_id}:{type:`custom:${L}`}}setConfig(t){this._config=t}getCardSize(){return 6}get _language(){return this.hass?.locale?.language??this.hass?.language??"en"}get _context(){return{language:this._language,timeZone:this.hass?.config?.time_zone??Intl.DateTimeFormat().resolvedOptions().timeZone,now:new Date}}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._subscription.stop()}updated(t){(t.has("hass")||t.has("_config"))&&this._follow()}_follow(){this.hass&&this._config&&this.isConnected&&this._subscription.follow(this.hass,this._config.entry_id)}async _call(t){if(!this.hass||!this._heater)return!1;this._error="";try{return await this.hass.callWS({entry_id:this._heater.entry_id,...t}),!0}catch(s){let i=(s instanceof Error,s.message);return this._error=o(this._language,"card.error",{message:i??String(s)}),!1}}async _save(t){let s=this._sheet;if(!s||!he(s))return;await this._call({type:"hot_water_ready/ready_time/add",member_id:t.id,time:s.time,weekdays:[...s.weekdays].sort()})&&(this._sheet=void 0)}render(){let t=this._language;if(this._missing)return p`<ha-card><div class="message">${o(t,"card.no_heater")}</div></ha-card>`;let s=this._heater;if(!s)return p`<ha-card><div class="message">${o(t,"card.loading")}</div></ha-card>`;let i=I(s),a=je(s,this._selected);return p`
      <ha-card>
        ${Xe(s,t).map(r=>p`<div class="banner fault" role="alert">${r}</div>`)}
        ${s.automatic?c:p`<div class="banner manual">${o(t,"manual")}</div>`}
        ${this._renderTop(s)}
        ${this._renderSettings(s)}
        ${i==="member"?p`<div class="greeting">${Ze(s,t)}</div>`:this._renderAvatars(s,a)}
        ${a?this._renderList(a):p`<div class="message">${o(t,"members.none")}</div>`}
        ${a&&this._sheet?this._renderSheet(a,this._sheet):c}
        ${a?this._renderAway(a):c}
        ${i==="member"&&a?this._renderToday(s,a):c}
        ${this._error?p`<div class="error" role="alert">${this._error}</div>`:c}
      </ha-card>
    `}_renderAway(t){let s=this._language,i=Ye(t,this._context);if(!t.can_edit)return i?p`<div class="away-line">${i}</div>`:c;let a=(r,d)=>this._call({type:"hot_water_ready/away/set",member_id:t.id,away:r,until:d});return p`
      <div class="away">
        <label class="away-toggle">
          <input
            type="checkbox"
            class="switch"
            .checked=${N(t.away.on)}
            @change=${r=>{a(r.target.checked,null)}}
          />
          ${i||o(s,"away.line")}
        </label>
        ${t.away.on?p`<label class="until">
              ${o(s,"away.until_label")}
              <input
                type="date"
                min=${We(this._context)}
                .value=${N(t.away.until??"")}
                @change=${r=>{a(!0,r.target.value||null)}}
              />
            </label>`:c}
      </div>
    `}_renderToday(t,s){return p`<div class="today">
      <span class="today-label">${o(this._language,"today.label")}</span>
      ${Qe(t,this._context,s.id)}
    </div>`}_openIntegration(){history.pushState(null,"","/config/integrations/integration/hot_water_ready"),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_renderTop(t){let s=qe(t,this._context);return p`
      <div class="top">
        <svg class="ring" viewBox="0 0 92 92" role="img" aria-label="${s.temperature} ${s.target}">
          <circle class="track" cx="46" cy="46" r=${ue}></circle>
          ${s.fill>0?He`<circle class="fill ${s.tone}" cx="46" cy="46" r=${ue}
                stroke-dasharray="${s.fill*st} ${st}"
                transform="rotate(-90 46 46)"></circle>`:c}
          <text class="temperature" x="46" y="44">${s.temperature}</text>
          <text class="target" x="46" y="61">${s.target}</text>
        </svg>
        <div class="text">
          <div class="name-row">
            <div class="name">${t.name}</div>
            ${t.settings?p`<button
                  class="settings-button"
                  aria-label=${o(this._language,"settings.open")}
                  aria-expanded=${this._settingsOpen}
                  @click=${()=>this._settingsOpen=!this._settingsOpen}
                >
                  ⚙
                </button>`:c}
          </div>
          <div class="headline ${s.tone}">${s.headline}</div>
          ${s.subline?p`<div class="subline">${s.subline}</div>`:c}
          <div class="heat-now">
            ${Je(t).map(i=>p`<button
                class=${i.primary?"primary":"secondary"}
                @click=${()=>{this._call({type:i.command})}}
              >
                ${o(this._language,i.label)}
              </button>`)}
          </div>
        </div>
      </div>
    `}_renderSettings(t){let s=this._language,i=this._settingsOpen?tt(t,s):void 0;if(!i)return c;let a=r=>this._call({type:et,...r});return p`
      <div class="sheet settings" role="dialog" aria-label=${o(s,"settings.open")}>
        <div class="sheet-head">
          <div class="sheet-title">${o(s,"settings.open")}</div>
          <button class="secondary" @click=${()=>this._settingsOpen=!1}>
            ${o(s,"settings.close")}
          </button>
        </div>
        ${this._renderStepper(i.target,`${i.target.shown} \xB0C`,o(s,"settings.target"),o(s,"settings.target_hint"),["settings.target_down","settings.target_up"],r=>a({target:r}))}
        ${this._renderStepper(i.margin,`\xB1 ${i.margin.shown}`,o(s,"settings.margin"),i.band,["settings.margin_down","settings.margin_up"],r=>a({margin:r}))}
        <label class="setting">
          <span class="setting-text">
            <span>${o(s,"settings.automatic")}</span>
            <span class="hint">${o(s,"settings.automatic_hint")}</span>
          </span>
          <input
            type="checkbox"
            class="switch"
            .checked=${N(i.automatic)}
            @change=${r=>a({automatic:r.target.checked})}
          />
        </label>
        <div class="setting column">
          <span>${o(s,"settings.cancel")}</span>
          <div class="choices" role="radiogroup">
            ${i.cancel.map(r=>p`<button
                class="choice ${r.selected?"on":""}"
                role="radio"
                aria-checked=${r.selected}
                @click=${()=>a({cancel_rule:r.rule})}
              >
                ${o(s,r.label)}
              </button>`)}
          </div>
        </div>
        ${this._renderSolar(i)}
        <button
          class="link"
          @click=${()=>{this._openIntegration()}}
        >
          ${o(s,"settings.more")}</button>
      </div>
    `}_renderStepper(t,s,i,a,r,d){let l=(h,g,u)=>p`<button
      class="step"
      aria-label=${o(this._language,g)}
      ?disabled=${h===null}
      @click=${()=>h===null?void 0:d(h)}
    >
      ${u}
    </button>`;return p`<div class="setting">
      <span class="setting-text"><span>${i}</span><span class="hint">${a}</span></span>
      ${l(t.down,r[0],"\u2212")}
      <span class="value">${s}</span>
      ${l(t.up,r[1],"+")}
    </div>`}_renderSolar(t){let s=this._language;return p`<div class="setting column solar">
      <span>${o(s,"solar.title")}</span>
      <span class="hint">${t.solar}</span>
      ${t.notes.map(i=>p`<span class="hint">${i}</span>`)}
    </div>`}_renderAvatars(t,s){if(!Be(t))return c;let i=I(t)==="admin";return p`
      <div class="avatars" role="tablist">
        ${Ke(t,s?.id).map(a=>p`
            <button
              class="avatar ${a.selected?"selected":""} ${a.faded?"faded":""}"
              role="tab"
              aria-selected=${a.selected}
              @click=${()=>{this._selected=a.id,this._sheet=void 0}}
            >
              <span class="dot" style="background: var(--${a.colour}-color, var(--primary-color))"
                >${a.initial}${a.star?p`<span class="star">★</span>`:c}</span
              >
              <span class="label">${a.name}</span>
            </button>
          `)}
        ${i?p`<button
              class="avatar add-member"
              @click=${()=>{this._openIntegration()}}
            >
              <span class="dot plus">+</span>
              <span class="label">${o(this._language,"members.add")}</span>
            </button>`:c}
      </div>
    `}_renderList(t){let s=this._language,i=Fe(t,s);return p`
      <div class="list">
        ${i.length===0?p`<div class="empty">${o(s,"list.empty")}</div>`:c}
        ${i.map(a=>p`
            <div class="row ${a.enabled?"":"off"}">
              <div class="time">${a.time}</div>
              <div class="days">
                ${a.days.map(r=>p`<span class="${r.on?"on":""}">${r.letter}</span>`)}
              </div>
              ${t.can_edit?p`
                    <input
                      type="checkbox"
                      class="switch"
                      aria-label=${o(s,"list.switch")}
                      .checked=${N(a.enabled)}
                      @change=${r=>this._call({type:"hot_water_ready/ready_time/update",member_id:t.id,ready_time_id:a.id,enabled:r.target.checked})}
                    />
                    <button
                      class="remove"
                      aria-label=${o(s,"list.remove")}
                      @click=${()=>this._call({type:"hot_water_ready/ready_time/remove",member_id:t.id,ready_time_id:a.id})}
                    >
                      ×
                    </button>
                  `:c}
            </div>
          `)}
        ${t.can_edit?p`<button class="add" @click=${()=>this._sheet={time:"07:00",weekdays:[...kt]}}>
              + ${o(s,"list.add")}
            </button>`:c}
      </div>
    `}_renderSheet(t,s){let i=this._language,a=Y(i),r=d=>{let l=s.weekdays.includes(d)?s.weekdays.filter(h=>h!==d):[...s.weekdays,d];this._sheet={...s,weekdays:l}};return p`
      <div class="sheet" role="dialog" aria-label=${o(i,"sheet.title")}>
        <div class="sheet-title">${o(i,"sheet.title")}</div>
        <label class="field">
          ${o(i,"sheet.time")}
          <input
            type="time"
            .value=${s.time}
            @input=${d=>{this._sheet={...s,time:d.target.value}}}
          />
        </label>
        <div class="field">
          ${o(i,"sheet.days")}
          <div class="day-toggles">
            ${a.map((d,l)=>p`<button
                  class="day ${s.weekdays.includes(l)?"on":""}"
                  aria-pressed=${s.weekdays.includes(l)}
                  @click=${()=>{r(l)}}
                >
                  ${d}
                </button>`)}
          </div>
        </div>
        <div class="actions">
          <button class="secondary" @click=${()=>this._sheet=void 0}>${o(i,"sheet.cancel")}</button>
          <button class="primary" ?disabled=${!he(s)} @click=${()=>this._save(t)}>
            ${o(i,"sheet.save")}
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
  `}};if(!customElements.get(L)){customElements.define(L,ge);let n=window;n.customCards=n.customCards??[],n.customCards.push({type:L,name:"Hot Water Ready",description:"Water temperature, ready times and heat now.",preview:!0})}export{ge as HotWaterReadyCard};
