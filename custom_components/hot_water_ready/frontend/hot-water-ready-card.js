var z=globalThis,W=z.ShadowRoot&&(z.ShadyCSS===void 0||z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ae=Symbol(),xe=new WeakMap,M=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(W&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=xe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&xe.set(t,e))}return e}toString(){return this.cssText}},$e=a=>new M(typeof a=="string"?a:a+"",void 0,ae),se=(a,...e)=>{let t=a.length===1?a[0]:e.reduce((n,s,i)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+a[i+1],a[0]);return new M(t,a,ae)},ke=(a,e)=>{if(W)a.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let n=document.createElement("style"),s=z.litNonce;s!==void 0&&n.setAttribute("nonce",s),n.textContent=t.cssText,a.appendChild(n)}},ie=W?a=>a:a=>a instanceof CSSStyleSheet?(e=>{let t="";for(let n of e.cssRules)t+=n.cssText;return $e(t)})(a):a;var{is:kt,defineProperty:St,getOwnPropertyDescriptor:At,getOwnPropertyNames:Ct,getOwnPropertySymbols:Tt,getPrototypeOf:Et}=Object,j=globalThis,Se=j.trustedTypes,Ht=Se?Se.emptyScript:"",Mt=j.reactiveElementPolyfillSupport,O=(a,e)=>a,re={toAttribute(a,e){switch(e){case Boolean:a=a?Ht:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,e){let t=a;switch(e){case Boolean:t=a!==null;break;case Number:t=a===null?null:Number(a);break;case Object:case Array:try{t=JSON.parse(a)}catch{t=null}}return t}},Ce=(a,e)=>!kt(a,e),Ae={attribute:!0,type:String,converter:re,reflect:!1,useDefault:!1,hasChanged:Ce};Symbol.metadata??=Symbol("metadata"),j.litPropertyMetadata??=new WeakMap;var w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ae){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),s=this.getPropertyDescriptor(e,n,t);s!==void 0&&St(this.prototype,e,s)}}static getPropertyDescriptor(e,t,n){let{get:s,set:i}=At(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:s,set(r){let c=s?.call(this);i?.call(this,r),this.requestUpdate(e,c,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ae}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let e=Et(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let t=this.properties,n=[...Ct(t),...Tt(t)];for(let s of n)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[n,s]of t)this.elementProperties.set(n,s)}this._$Eh=new Map;for(let[t,n]of this.elementProperties){let s=this._$Eu(t,n);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let s of n)t.unshift(ie(s))}else e!==void 0&&t.push(ie(e));return t}static _$Eu(e,t){let n=t.attribute;return n===!1?void 0:typeof n=="string"?n:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ke(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,n);if(s!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:re).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,s=n._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let i=n.getPropertyOptions(s),r=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:re;this._$Em=s;let c=r.fromAttribute(t,i.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(e,t,n,s=!1,i){if(e!==void 0){let r=this.constructor;if(s===!1&&(i=this[e]),n??=r.getPropertyOptions(e),!((n.hasChanged??Ce)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,n))))return;this.C(e,t,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:s,wrapped:i},r){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),i!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,i]of this._$Ep)this[s]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[s,i]of n){let{wrapped:r}=i,c=this[s];r!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,i,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(t)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[O("elementProperties")]=new Map,w[O("finalized")]=new Map,Mt?.({ReactiveElement:w}),(j.reactiveElementVersions??=[]).push("2.1.2");var le=globalThis,Te=a=>a,B=le.trustedTypes,Ee=B?B.createPolicy("lit-html",{createHTML:a=>a}):void 0,de="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,ce="?"+y,Ot=`<${ce}>`,k=document,P=()=>k.createComment(""),N=a=>a===null||typeof a!="object"&&typeof a!="function",pe=Array.isArray,Ne=a=>pe(a)||typeof a?.[Symbol.iterator]=="function",oe=`[ 	
\f\r]`,R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,He=/-->/g,Me=/>/g,x=RegExp(`>|${oe}(?:([^\\s"'>=/]+)(${oe}*=${oe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Oe=/'/g,Re=/"/g,De=/^(?:script|style|textarea|title)$/i,he=a=>(e,...t)=>({_$litType$:a,strings:e,values:t}),d=he(1),Ie=he(2),nn=he(3),f=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),Pe=new WeakMap,$=k.createTreeWalker(k,129);function Ue(a,e){if(!pe(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ee!==void 0?Ee.createHTML(e):e}var Le=(a,e)=>{let t=a.length-1,n=[],s,i=e===2?"<svg>":e===3?"<math>":"",r=R;for(let c=0;c<t;c++){let l=a[c],p,u,g=-1,m=0;for(;m<l.length&&(r.lastIndex=m,u=r.exec(l),u!==null);)m=r.lastIndex,r===R?u[1]==="!--"?r=He:u[1]!==void 0?r=Me:u[2]!==void 0?(De.test(u[2])&&(s=RegExp("</"+u[2],"g")),r=x):u[3]!==void 0&&(r=x):r===x?u[0]===">"?(r=s??R,g=-1):u[1]===void 0?g=-2:(g=r.lastIndex-u[2].length,p=u[1],r=u[3]===void 0?x:u[3]==='"'?Re:Oe):r===Re||r===Oe?r=x:r===He||r===Me?r=R:(r=x,s=void 0);let _=r===x&&a[c+1].startsWith("/>")?" ":"";i+=r===R?l+Ot:g>=0?(n.push(p),l.slice(0,g)+de+l.slice(g)+y+_):l+y+(g===-2?c:_)}return[Ue(a,i+(a[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),n]},D=class a{constructor({strings:e,_$litType$:t},n){let s;this.parts=[];let i=0,r=0,c=e.length-1,l=this.parts,[p,u]=Le(e,t);if(this.el=a.createElement(p,n),$.currentNode=this.el.content,t===2||t===3){let g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(s=$.nextNode())!==null&&l.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(let g of s.getAttributeNames())if(g.endsWith(de)){let m=u[r++],_=s.getAttribute(g).split(y),q=/([.?@])?(.*)/.exec(m);l.push({type:1,index:i,name:q[2],strings:_,ctor:q[1]==="."?K:q[1]==="?"?G:q[1]==="@"?Z:A}),s.removeAttribute(g)}else g.startsWith(y)&&(l.push({type:6,index:i}),s.removeAttribute(g));if(De.test(s.tagName)){let g=s.textContent.split(y),m=g.length-1;if(m>0){s.textContent=B?B.emptyScript:"";for(let _=0;_<m;_++)s.append(g[_],P()),$.nextNode(),l.push({type:2,index:++i});s.append(g[m],P())}}}else if(s.nodeType===8)if(s.data===ce)l.push({type:2,index:i});else{let g=-1;for(;(g=s.data.indexOf(y,g+1))!==-1;)l.push({type:7,index:i}),g+=y.length-1}i++}}static createElement(e,t){let n=k.createElement("template");return n.innerHTML=e,n}};function S(a,e,t=a,n){if(e===f)return e;let s=n!==void 0?t._$Co?.[n]:t._$Cl,i=N(e)?void 0:e._$litDirective$;return s?.constructor!==i&&(s?._$AO?.(!1),i===void 0?s=void 0:(s=new i(a),s._$AT(a,t,n)),n!==void 0?(t._$Co??=[])[n]=s:t._$Cl=s),s!==void 0&&(e=S(a,s._$AS(a,e.values),s,n)),e}var F=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,s=(e?.creationScope??k).importNode(t,!0);$.currentNode=s;let i=$.nextNode(),r=0,c=0,l=n[0];for(;l!==void 0;){if(r===l.index){let p;l.type===2?p=new E(i,i.nextSibling,this,e):l.type===1?p=new l.ctor(i,l.name,l.strings,this,e):l.type===6&&(p=new Q(i,this,e)),this._$AV.push(p),l=n[++c]}r!==l?.index&&(i=$.nextNode(),r++)}return $.currentNode=k,s}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}},E=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,s){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=S(this,e,t),N(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==f&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ne(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(k.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,s=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=D.createElement(Ue(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===s)this._$AH.p(t);else{let i=new F(s,this),r=i.u(this.options);i.p(t),this.T(r),this._$AH=i}}_$AC(e){let t=Pe.get(e.strings);return t===void 0&&Pe.set(e.strings,t=new D(e)),t}k(e){pe(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,n,s=0;for(let i of e)s===t.length?t.push(n=new a(this.O(P()),this.O(P()),this,this.options)):n=t[s],n._$AI(i),s++;s<t.length&&(this._$AR(n&&n._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let n=Te(e).nextSibling;Te(e).remove(),e=n}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},A=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,s,i){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=h}_$AI(e,t=this,n,s){let i=this.strings,r=!1;if(i===void 0)e=S(this,e,t,0),r=!N(e)||e!==this._$AH&&e!==f,r&&(this._$AH=e);else{let c=e,l,p;for(e=i[0],l=0;l<i.length-1;l++)p=S(this,c[n+l],t,l),p===f&&(p=this._$AH[l]),r||=!N(p)||p!==this._$AH[l],p===h?e=h:e!==h&&(e+=(p??"")+i[l+1]),this._$AH[l]=p}r&&!s&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},K=class extends A{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},G=class extends A{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},Z=class extends A{constructor(e,t,n,s,i){super(e,t,n,s,i),this.type=5}_$AI(e,t=this){if((e=S(this,e,t,0)??h)===f)return;let n=this._$AH,s=e===h&&n!==h||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==h&&(n===h||s);s&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Q=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){S(this,e)}},Ve={M:de,P:y,A:ce,C:1,L:Le,R:F,D:Ne,V:S,I:E,H:A,N:G,U:Z,B:K,F:Q},Rt=le.litHtmlPolyfillSupport;Rt?.(D,E),(le.litHtmlVersions??=[]).push("3.3.3");var qe=(a,e,t)=>{let n=t?.renderBefore??e,s=n._$litPart$;if(s===void 0){let i=t?.renderBefore??null;n._$litPart$=s=new E(e.insertBefore(P(),i),i,void 0,t??{})}return s._$AI(a),s};var ue=globalThis,b=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=qe(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return f}};b._$litElement$=!0,b.finalized=!0,ue.litElementHydrateSupport?.({LitElement:b});var Pt=ue.litElementPolyfillSupport;Pt?.({LitElement:b});(ue.litElementVersions??=[]).push("4.2.2");var C={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ze=a=>(...e)=>({_$litDirective$:a,values:e}),Y=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:yn}=Ve;var We=a=>a.strings===void 0;var Nt={},je=(a,e=Nt)=>a._$AH=e;var H=ze(class extends Y{constructor(a){if(super(a),a.type!==C.PROPERTY&&a.type!==C.ATTRIBUTE&&a.type!==C.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!We(a))throw Error("`live` bindings can only contain a single expression")}render(a){return a}update(a,[e]){if(e===f||e===h)return e;let t=a.element,n=a.name;if(a.type===C.PROPERTY){if(e===t[n])return f}else if(a.type===C.BOOLEAN_ATTRIBUTE){if(!!e===t.hasAttribute(n))return f}else if(a.type===C.ATTRIBUTE&&t.getAttribute(n)===e+"")return f;return je(a),e}});var Dt={"status.waiting":"Idle","status.heating":"Heating","status.ready":"Ready","status.fault":"Fault","status.manual":"Manual","headline.heating_for":"Heating: ready in about {minutes} min","headline.ready_at":"Ready at {when}","subline.next_at":"Next at {when}","when.today":"{time}","when.tomorrow":"{time} tomorrow","when.weekday":"{time} on {weekday}","ring.target":"target {target}\xB0","weekday.letters":"M,T,W,T,F,S,S","members.none":"No members yet. An administrator adds them in the integration's settings.","list.empty":"No ready times yet.","list.add":"Add a ready time","list.remove":"Remove","list.switch":"On or off","sheet.title":"New ready time","sheet.edit_title":"Change ready time","list.edit":"Change this ready time","sheet.time":"Time","sheet.hour":"Hour","sheet.minute":"Minute","sheet.days":"Days","sheet.save":"Save","sheet.cancel":"Cancel","fault.sensor_unavailable":"Fault: the water temperature sensor gives no readings. Heating has stopped.","fault.not_rising":"Fault: the water is not getting hotter. Heating has stopped; see Repairs.","fault.no_consumption":"Fault: the heater draws no power. Heating has stopped; see Repairs.","fault.relay_stuck":"Fault: the heater draws power while switched off. Check the relay.",manual:"Automatic control is off: the heater is run by hand.","note.not_rising_skipped":'The thermostat does not say when it is heating, so the "water not getting hotter" and "heater draws no power" checks are not made.',"heat_now.start":"Heat now","heat_now.cancel":"Cancel","heat_now.join":"Tell me when it's hot","heat_now.leave":"Don't tell me","subline.for":"For {list}.","item.at":"{name} at {time}","switch_off.link":"Switch off the heating\u2026","switch_off.title":"Switch off the heating?","switch_off.confirm":"Switch off","switch_off.keep":"Cancel","switch_off.asked_one":"{names} will no longer be told.","switch_off.asked_many":"{names} will no longer be told.","switch_off.skipped_one":"Without hot water: {list}.","switch_off.skipped_many":"Without hot water: {list}.","switch_off.back":"It switches back on by itself for the next ready time.","switch_off.nobody":"Heating stops now.","settings.switch_off":"Who may switch off the heating for everyone","settings.switch_off_hint":"The administrators and:","settings.own_cancel":"Whoever asked may always cancel their own request.",greeting:"Hello, {name}","today.label":"House today","today.nobody":"Nobody today","away.until_label":"Until (optional)","away.line":"Away","away.line_until":"Away until {date}","members.add":"Member","card.no_heater":"No Hot Water Ready heater is set up yet.","card.loading":"Loading\u2026","card.error":"That did not work: {message}","cluster.warning":"The showers from {when} need the water at {needed} \xB0C, but the heater goes only to {cap} \xB0C: the last ones may run cooler.","tabs.people":"People","tabs.week":"Week","week.days":"Mon,Tue,Wed,Thu,Fri,Sat,Sun","week.showers":"showers","week.windows":"heating windows","week.busiest":"busiest day","week.heating":"Heating","week.away":"away","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} a week","week.hint":"Tap a person to highlight their times. The bars show when the heater may heat each day (05h to 24h).","settings.open":"Heater settings","settings.close":"Close","settings.target":"Target temperature","settings.target_hint":"Ready when the water gets here","settings.target_down":"Lower the target","settings.target_up":"Raise the target","settings.margin":"Margin","settings.band":"Stops at {stop} \xB0C, restarts at {restart} \xB0C","settings.margin_down":"Lower the margin","settings.margin_up":"Raise the margin","settings.automatic":"Automatic control","settings.automatic_hint":"Off: the heater is run by hand","settings.more":"More settings","solar.title":"Solar comparison","solar.none":"No windows recorded in the last 30 days yet.","solar.would":"With the solar-aware rule on, the water would have been ready on time in {on_time} of {windows} windows","solar.did":"With the solar-aware rule, the water was ready on time in {on_time} of {windows} windows","solar.would_less":", and the heater would have run {minutes} minutes less","solar.would_more":", and the heater would have run {minutes} minutes more","solar.did_less":", and the heater ran {minutes} minutes less","solar.did_more":", and the heater ran {minutes} minutes more","solar.kwh":", about {kwh} kWh","solar.applied":" The rule was applied in {applied} of them: on time in {on_time}.","subline.starts_at":"Starts heating around {when}.","subline.starts_at_solar":"Starts heating around {when}, if the sun has not done it by then.","subline.asked_by_one":"Asked for by {name}. They are told when it is ready.","subline.asked_by_many":"Asked for by {names}. Each is told when it is ready.","names.and":" and ","today.you":"You","list.mine":"My ready times","list.count_one":"1 ready time","list.count":"{count} ready times","list.virtual":"Virtual member \xB7 shared household times","away.paused":"Paused. The times are kept.","settings.no_people":"There are no people in Home Assistant to choose from yet."},It={"status.waiting":"Em espera","status.heating":"A aquecer","status.ready":"Pronta","status.fault":"Avaria","status.manual":"Manual","headline.heating_for":"A aquecer: pronta em cerca de {minutes} min","headline.ready_at":"Pronta \xE0s {when}","subline.next_at":"Pr\xF3xima \xE0s {when}","when.today":"{time}","when.tomorrow":"{time} de amanh\xE3","when.weekday":"{time} de {weekday}","ring.target":"alvo {target}\xB0","weekday.letters":"S,T,Q,Q,S,S,D","members.none":"Ainda n\xE3o h\xE1 membros. Um administrador acrescenta-os nas defini\xE7\xF5es da integra\xE7\xE3o.","list.empty":"Ainda n\xE3o h\xE1 hor\xE1rios.","list.add":"Acrescentar um hor\xE1rio","list.remove":"Remover","list.switch":"Ligar ou desligar","sheet.title":"Novo hor\xE1rio","sheet.edit_title":"Alterar hor\xE1rio","list.edit":"Alterar este hor\xE1rio","sheet.time":"Hora","sheet.hour":"Horas","sheet.minute":"Minutos","sheet.days":"Dias","sheet.save":"Guardar","sheet.cancel":"Cancelar","fault.sensor_unavailable":"Avaria: o sensor da temperatura da \xE1gua n\xE3o d\xE1 leituras. O aquecimento parou.","fault.not_rising":"Avaria: a \xE1gua n\xE3o aquece. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.no_consumption":"Avaria: o aquecedor n\xE3o consome energia. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.relay_stuck":"Avaria: o aquecedor consome energia com o rel\xE9 desligado. Verifique o rel\xE9.",manual:"O controlo autom\xE1tico est\xE1 desligado: o aquecedor est\xE1 a ser comandado manualmente.","note.not_rising_skipped":'O term\xF3stato n\xE3o indica quando est\xE1 a aquecer, por isso as verifica\xE7\xF5es "a \xE1gua n\xE3o aquece" e "o aquecedor n\xE3o consome energia" n\xE3o s\xE3o feitas.',"heat_now.start":"Aquecer agora","heat_now.cancel":"Cancelar","heat_now.join":"Avisar-me quando estiver quente","heat_now.leave":"N\xE3o me avisar","subline.for":"Para {list}.","item.at":"{name} \xE0s {time}","switch_off.link":"Desligar o aquecimento\u2026","switch_off.title":"Desligar o aquecimento?","switch_off.confirm":"Desligar","switch_off.keep":"Cancelar","switch_off.asked_one":"{names} j\xE1 n\xE3o recebe o aviso.","switch_off.asked_many":"{names} j\xE1 n\xE3o recebem o aviso.","switch_off.skipped_one":"Fica sem \xE1gua quente: {list}.","switch_off.skipped_many":"Ficam sem \xE1gua quente: {list}.","switch_off.back":"Volta a ligar-se por si para o pr\xF3ximo hor\xE1rio.","switch_off.nobody":"O aquecimento p\xE1ra agora.","settings.switch_off":"Quem pode desligar o aquecimento para todos","settings.switch_off_hint":"Os administradores e:","settings.own_cancel":"Quem pediu pode sempre cancelar o seu pr\xF3prio pedido.",greeting:"Ol\xE1, {name}","today.label":"Casa hoje","today.nobody":"Ningu\xE9m hoje","away.until_label":"At\xE9 (opcional)","away.line":"Ausente","away.line_until":"Ausente at\xE9 {date}","members.add":"Membro","card.no_heater":"Ainda n\xE3o h\xE1 nenhum aquecedor do Hot Water Ready configurado.","card.loading":"A carregar\u2026","card.error":"N\xE3o foi poss\xEDvel: {message}","cluster.warning":"Os duches a partir das {when} precisam da \xE1gua a {needed} \xB0C, mas o aquecedor s\xF3 aquece at\xE9 {cap} \xB0C: os \xFAltimos podem sair menos quentes.","tabs.people":"Pessoas","tabs.week":"Semana","week.days":"Seg,Ter,Qua,Qui,Sex,S\xE1b,Dom","week.showers":"duches","week.windows":"janelas de aquecimento","week.busiest":"dia mais cheio","week.heating":"Aquecimento","week.away":"ausente","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} por semana","week.hint":"Toque numa pessoa para destacar os seus hor\xE1rios. As barras mostram quando o aquecedor pode aquecer em cada dia (05h a 24h).","settings.open":"Defini\xE7\xF5es do aquecedor","settings.close":"Fechar","settings.target":"Temperatura alvo","settings.target_hint":"Avisa quando chega aqui","settings.target_down":"Baixar o alvo","settings.target_up":"Subir o alvo","settings.margin":"Margem","settings.band":"P\xE1ra a {stop} \xB0C, retoma a {restart} \xB0C","settings.margin_down":"Baixar a margem","settings.margin_up":"Subir a margem","settings.automatic":"Controlo autom\xE1tico","settings.automatic_hint":"Desligado: o aquecedor fica em modo manual","settings.more":"Mais defini\xE7\xF5es","solar.title":"Compara\xE7\xE3o solar","solar.none":"Ainda n\xE3o h\xE1 janelas registadas nos \xFAltimos 30 dias.","solar.would":"Com a regra solar ligada, a \xE1gua teria ficado pronta a tempo em {on_time} de {windows} janelas","solar.did":"Com a regra solar, a \xE1gua ficou pronta a tempo em {on_time} de {windows} janelas","solar.would_less":", e o aquecedor teria trabalhado menos {minutes} minutos","solar.would_more":", e o aquecedor teria trabalhado mais {minutes} minutos","solar.did_less":", e o aquecedor trabalhou menos {minutes} minutos","solar.did_more":", e o aquecedor trabalhou mais {minutes} minutos","solar.kwh":", cerca de {kwh} kWh","solar.applied":" A regra foi aplicada em {applied} delas: a tempo em {on_time}.","subline.starts_at":"Come\xE7a a aquecer por volta das {when}.","subline.starts_at_solar":"Come\xE7a a aquecer por volta das {when}, se o sol n\xE3o chegar.","subline.asked_by_one":"Pedido por {name}. Recebe um aviso quando estiver pronta.","subline.asked_by_many":"Pedido por {names}. Cada um \xE9 avisado quando estiver pronta.","names.and":" e ","today.you":"Voc\xEA","list.mine":"Os meus hor\xE1rios","list.count_one":"1 hor\xE1rio","list.count":"{count} hor\xE1rios","list.virtual":"Membro virtual \xB7 hor\xE1rios partilhados da casa","away.paused":"Em pausa. Os hor\xE1rios ficam guardados.","settings.no_people":"Ainda n\xE3o h\xE1 pessoas no Home Assistant para escolher."},Ut={en:Dt,pt:It};function J(a){return a?.toLowerCase().startsWith("pt")?"pt":"en"}function T(a){return J(a)==="pt"?"pt-PT":"en-GB"}function X(a){return o(a,"weekday.letters").split(",")}function o(a,e,t={}){return Ut[J(a)][e].replace(/\{(\w+)\}/g,(s,i)=>String(t[i]??s))}function ge(a){return a.callWS({type:"hot_water_ready/heaters"})}var ee=class{constructor(e,t){this.onSnapshot=e;this.onMissing=t;this.generation=0}async follow(e,t){let n=this.generation,s=t;if(s===void 0){if(this.defaultEntryId??=ge(e).then(r=>r[0]?.entry_id),s=await this.defaultEntryId,n!==this.generation)return;if(s===void 0){this.defaultEntryId=void 0,this.onMissing();return}}if(s===this.entryId)return;this.stop();let i=this.generation;this.entryId=s,this.stopSubscription=e.connection.subscribeMessage(r=>{i===this.generation&&this.onSnapshot(r)},{type:"hot_water_ready/subscribe",entry_id:s}),this.stopSubscription.catch(()=>{i===this.generation&&(this.entryId=void 0,this.onMissing())})}stop(){this.generation++;let e=this.stopSubscription;this.stopSubscription=void 0,this.entryId=void 0,e?.then(t=>t()).catch(()=>{})}};function Fe(a,e){if(a==="24")return!0;if(a==="12")return!1;let t=a==="system"?void 0:e;return!new Intl.DateTimeFormat(t,{hour:"numeric"}).format(new Date(2023,0,1,22)).includes("10")}function Ke(a,e,t,n){return n?`${String(a).padStart(2,"0")}:${String(e).padStart(2,"0")}`:new Intl.DateTimeFormat(T(t),{timeZone:"UTC",hour:"numeric",minute:"2-digit",hourCycle:"h12"}).format(Date.UTC(2e3,0,1,a,e))}function Ge(a,e,t=!0){let[n=0,s=0]=a.split(":").map(Number);return Ke(n,s,e,t)}function Ze(a,e=!0){return Array.from({length:24},(t,n)=>{let s=String(n).padStart(2,"0");if(e)return{value:s,label:s};let i=new Intl.DateTimeFormat(T(a),{timeZone:"UTC",hour:"numeric",hourCycle:"h12"}).format(Date.UTC(2e3,0,1,n));return{value:s,label:i}})}var Qe=Array.from({length:60},(a,e)=>String(e).padStart(2,"0"));function v(a,e,t){return new Intl.NumberFormat(T(e),{maximumFractionDigits:t}).format(a)}function I(a,e){return new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(a)}function Ye(a){let e=new Date(`${a}T12:00:00Z`);return e.setUTCDate(e.getUTCDate()+1),e.toISOString().slice(0,10)}function ne(a,e){let{language:t,timeZone:n,now:s}=e,i=new Date(a),r=_e(a,e),c=I(s,n);if(I(i,n)===c)return o(t,"when.today",{time:r});if(I(i,n)===Ye(c))return o(t,"when.tomorrow",{time:r});let l=new Intl.DateTimeFormat(T(t),{timeZone:n,weekday:"long"}).format(i);return o(t,"when.weekday",{time:r,weekday:l})}function Lt(a,e){let{language:t}=e;return a.status==="heating"&&a.ready_in_minutes!==null?o(t,"headline.heating_for",{minutes:a.ready_in_minutes}):a.status==="waiting"&&a.next_ready?o(t,"headline.ready_at",{when:ne(a.next_ready.at,e)}):o(t,`status.${a.status}`)}function Je(a){return new Map(a.members.map(e=>[e.id,e]))}function fe(a,e,t){let n=Je(a);return e.map(s=>n.get(s)?.name??t.people?.[s]??s)}function Xe(a){let e={};for(let[t,n]of Object.entries(a??{}))t.startsWith("person.")&&(e[t]=n.attributes.friendly_name??t);return e}function we(a,e){return a.length<2?a.join(""):`${a.slice(0,-1).join(", ")}${o(e,"names.and")}${a.at(-1)??""}`}function et(a,e,t){let n=e.map(s=>o(t.language,"item.at",{name:fe(a,[s.member],t)[0]??"",time:_e(s.at,t)}));return we(n,t.language)}function Vt(a,e){let{language:t}=e,n=a.heat_now?.requesters??[];if(a.status==="heating"&&n.length>0){let s=fe(a,n,e);return s.length===1?o(t,"subline.asked_by_one",{name:s[0]??""}):o(t,"subline.asked_by_many",{names:we(s,t)})}if(a.status==="heating"&&a.heating_for.length>0)return o(t,"subline.for",{list:et(a,a.heating_for,e)});if(a.status==="waiting"&&a.next_heat_start){let s=a.solar_aware?"subline.starts_at_solar":"subline.starts_at";return o(t,s,{when:ne(a.next_heat_start,e)})}return a.status==="ready"&&a.next_ready?o(t,"subline.next_at",{when:ne(a.next_ready.at,e)}):""}function tt(a,e){let{language:t}=e,{temperature:n,target:s}=a;return{temperature:n===null?"\u2013":`${v(n,t,1)}\xB0`,target:o(t,"ring.target",{target:v(s,t,1)}),badge:o(t,`status.${a.status}`).toLocaleUpperCase(T(t)),headline:Lt(a,e),subline:Vt(a,e),fill:n===null||s<=0?0:Math.min(1,Math.max(0,n/s)),tone:a.status}}function qt(a,e){let t=e??a.me;return a.members.find(n=>n.id===t)??a.members[0]}function nt(a){let e=L(a);return e==="admin"?!0:e==="viewer"&&a.members.length>1}function at(a,e){return qt(a,L(a)==="member"?void 0:e)}function st(a){return I(a.now,a.timeZone)}function it(){return{time:"07:00",weekdays:[0,1,2,3,4]}}function rt(a,e){let t=a.ready_times.find(n=>n.id===e);return t&&{id:t.id,time:t.time,weekdays:[...t.weekdays].sort()}}function ye(a){return a.time!==""&&a.weekdays.length>0}function ot(a,e,t=!0){let n=X(e);return[...a.ready_times].sort((s,i)=>s.time.localeCompare(i.time)||s.id.localeCompare(i.id)).map(s=>({id:s.id,time:Ge(s.time,e,t),enabled:s.enabled,days:n.map((i,r)=>({letter:i,on:s.weekdays.includes(r)}))}))}function L(a){return a.is_admin?"admin":a.me?"member":"viewer"}function lt(a,e){return a.members.map(t=>({id:t.id,name:t.name,initial:t.name.slice(0,1).toLocaleUpperCase(),colour:t.colour,star:t.virtual,faded:t.away.on,selected:t.id===e}))}function dt(a,e){let t=a.members.find(n=>n.id===a.me);return t?o(e,"greeting",{name:t.name}):""}function _e(a,e){let{minutes:t}=me(a,e.timeZone);return Ke(Math.floor(t/60),t%60,e.language,e.hour24??!0)}function ct(a,e,t){let n=Je(a);return a.today.map(s=>{let i=s.member===t,r=n.get(s.member);return{name:i?o(e.language,"today.you"):r?.name??"?",time:_e(s.at,e),colour:r?.colour??"",mine:i}})}function pt(a,e){let t=a.ready_times.length,n=o(e,"list.count",{count:t});return a.virtual?n=o(e,"list.virtual"):t===1&&(n=o(e,"list.count_one")),{name:a.name,note:n}}function zt(a,e){let t=new Date(`${a}T12:00:00Z`),n=T(e),s=new Intl.DateTimeFormat(n,{timeZone:"UTC",day:"numeric"}).format(t),i=new Intl.DateTimeFormat(n,{timeZone:"UTC",month:"long"}).format(t);return J(e)==="pt"?`${s} de ${i.slice(0,1).toLocaleUpperCase("pt-PT")}${i.slice(1)}`:`${s} ${i}`}function ht(a,e){return a.away.on?a.away.until?o(e.language,"away.line_until",{date:zt(a.away.until,e.language)}):o(e.language,"away.line"):""}var Wt="hot_water_ready/heat_now/start",jt="hot_water_ready/heat_now/cancel";function ut(a){let e=a.can_ask_heat_now&&!a.heat_now_blocked&&a.automatic,t=a.heat_now;if(t?.asked){let s=t.requesters.length===1&&!t.unnamed;return[{message:{type:jt},label:s?"heat_now.cancel":"heat_now.leave"}]}if(!e)return[];if(t===null&&a.heating_for.some(s=>s.member===a.me))return[];let n=a.status==="heating"||t!==null;return[{message:{type:Wt},label:n?"heat_now.join":"heat_now.start"}]}var gt="hot_water_ready/switch_off";function mt(a){return a.can_switch_off&&a.status==="heating"}function ft(a,e){let{language:t}=e,n=(a.heat_now?.requesters??[]).filter(r=>r!==a.viewer),s=a.heating_for.filter(r=>r.member!==a.viewer),i=[];if(n.length>0){let r=we(fe(a,n,e),t);i.push(o(t,n.length===1?"switch_off.asked_one":"switch_off.asked_many",{names:r}))}if(s.length>0){let r=et(a,s,e);i.push(o(t,s.length===1?"switch_off.skipped_one":"switch_off.skipped_many",{list:r}))}return i.length===0&&i.push(o(t,"switch_off.nobody")),a.heating_for.length>0&&i.push(o(t,"switch_off.back")),{title:o(t,"switch_off.title"),lines:i}}function wt(a,e){return a.faults.map(t=>o(e,`fault.${t}`))}var yt="hot_water_ready/settings/set",Bt={min:30,max:75,step:.5},Ft={min:0,max:5,step:.5};function Be(a,e,t){let n=Math.ceil(a/e.step-1e-9)*e.step-e.step,s=Math.floor(a/e.step+1e-9)*e.step+e.step;return{shown:v(a,t,1),down:n>=e.min-1e-9?n:null,up:s<=e.max+1e-9?s:null}}function _t(a,e){let{language:t}=e,n=a.settings;if(!(!a.is_admin||!n))return{target:Be(a.target,Bt,t),margin:Be(a.margin,Ft,t),band:o(t,"settings.band",{stop:v(a.target+a.margin,t,1),restart:v(a.target-a.margin,t,1)}),automatic:a.automatic,people:Object.entries(e.people??{}).map(([s,i])=>({id:s,name:i,on:n.switch_off_people.includes(s)})).sort((s,i)=>s.name.localeCompare(i.name)),solar:Kt(n,t),notes:a.not_rising_checked?[]:[o(t,"note.not_rising_skipped")]}}function bt(a,e,t){return a.filter(n=>n.id===e?t:n.on).map(n=>n.id)}function Kt(a,e){let{windows:t,on_time:n,minutes_saved:s,kwh:i}=a.solar;if(t===0)return o(e,"solar.none");let r=a.solar_aware?"did":"would",c=o(e,`solar.${r}`,{on_time:n,windows:t});s!==0&&(c+=o(e,`solar.${r}_${s>0?"less":"more"}`,{minutes:Math.abs(s)}),i!==null&&(c+=o(e,"solar.kwh",{kwh:v(Math.abs(i),e,1)}))),c+=".";let{solar_windows:l,solar_on_time:p}=a.solar;return l>0&&(c+=o(e,"solar.applied",{applied:l,on_time:p})),c}var U=300,te=1440;function me(a,e){let t=new Date(a),n=new Intl.DateTimeFormat("en-GB",{timeZone:e,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t).reduce((s,i)=>({...s,[i.type]:i.value}),{});return{day:I(t,e),minutes:Number(n.hour)*60+Number(n.minute)}}function vt(a,e){let t=a.week;if(!a.is_admin||!t)return;let n=o(e.language,"week.days").split(","),s=n.map((l,p)=>Gt(t.monday,p)),i=a.members.map(l=>Qt(l,s,e.language,e.hour24??!0)),r=s.map((l,p)=>i.reduce((u,g)=>{let m=g.cells[p];return m&&!m.away?u+m.times.length:u},0)),c=Math.max(0,...r);return{days:s.map((l,p)=>({key:l,label:n[p]??l,today:l===t.today,bars:Yt(l,t.windows,e.timeZone)})),hours:[6,12,18,24].map(l=>({label:`${String(l).padStart(2,"0")}h`,at:(l*60-U)/(te-U)})),rows:i,showers:r.reduce((l,p)=>l+p,0),windows:t.windows.length,busiest:c>0?n[r.indexOf(c)]??"":""}}function Gt(a,e){let t=a;for(let n=0;n<e;n+=1)t=Ye(t);return t}function Zt(a,e){return a.away.on&&(a.away.until===null||e<=a.away.until)}function Qt(a,e,t,n){let s=a.ready_times.filter(p=>p.enabled),i=e.map((p,u)=>({times:s.filter(g=>g.weekdays.includes(u)).map(g=>g.time).sort().map(g=>Ge(g,t,n)),away:Zt(a,p)})),r=i.every(p=>p.away),c=i.reduce((p,u)=>p+u.times.length,0),l=o(t,"week.per_week",{count:c});return r?l=o(t,"week.away"):a.virtual&&(l=o(t,"week.virtual",{count:c})),{id:a.id,name:a.name,colour:a.colour,initial:a.virtual?"\u2605":a.name[0]??"?",away:r,note:l,cells:i}}function Yt(a,e,t){let n=te-U,s=[];for(let i of e){let r=me(i.start,t),c=me(i.end,t);if(r.day>a||c.day<a)continue;let l=Math.max(U,r.day<a?0:r.minutes),p=Math.min(te,c.day>a?te:c.minutes);p>l&&s.push({from:(l-U)/n,length:(p-l)/n})}return s}function xt(a,e){let t=a.cluster_warning;return t?o(e.language,"cluster.warning",{when:ne(t.at,e),needed:v(t.needed,e.language,0),cap:v(t.cap,e.language,1)}):""}var V="hot-water-ready-card",be=38,$t=2*Math.PI*be,ve=class extends b{constructor(){super(...arguments);this._missing=!1;this._settingsOpen=!1;this._offOpen=!1;this._tab="people";this._error="";this._subscription=new ee(t=>{this._heater=t,this._missing=!1},()=>{this._missing=!0})}static{this.properties={hass:{attribute:!1},_config:{state:!0},_heater:{state:!0},_missing:{state:!0},_selected:{state:!0},_sheet:{state:!0},_settingsOpen:{state:!0},_offOpen:{state:!0},_tab:{state:!0},_focus:{state:!0},_error:{state:!0}}}static async getStubConfig(t){let n=(await ge(t))[0];return n?{type:`custom:${V}`,entry_id:n.entry_id}:{type:`custom:${V}`}}setConfig(t){this._config=t}getCardSize(){return 6}get _language(){return this.hass?.locale?.language??this.hass?.language??"en"}get _hour24(){return Fe(this.hass?.locale?.time_format,this._language)}get _context(){return{language:this._language,timeZone:this.hass?.config?.time_zone??Intl.DateTimeFormat().resolvedOptions().timeZone,now:new Date,people:Xe(this.hass?.states),hour24:this._hour24}}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._subscription.stop()}updated(t){(t.has("hass")||t.has("_config"))&&this._follow(),t.has("_offOpen")&&this._offOpen&&this.renderRoot.querySelector(".off-keep")?.focus()}_follow(){this.hass&&this._config&&this.isConnected&&this._subscription.follow(this.hass,this._config.entry_id)}async _call(t){if(!this.hass||!this._heater)return!1;this._error="";try{return await this.hass.callWS({entry_id:this._heater.entry_id,...t}),!0}catch(n){let s=(n instanceof Error,n.message);return this._error=o(this._language,"card.error",{message:s??String(n)}),!1}}async _save(t){let n=this._sheet;if(!n||!ye(n))return;await this._call({...n.id?{type:"hot_water_ready/ready_time/update",ready_time_id:n.id}:{type:"hot_water_ready/ready_time/add"},member_id:t.id,time:n.time,weekdays:[...n.weekdays].sort()})&&(this._sheet=void 0)}render(){let t=this._language;if(this._missing)return d`<ha-card><div class="message">${o(t,"card.no_heater")}</div></ha-card>`;let n=this._heater;if(!n)return d`<ha-card><div class="message">${o(t,"card.loading")}</div></ha-card>`;let s=L(n),i=at(n,this._selected),r=vt(n,this._context);return d`
      <ha-card>
        ${wt(n,t).map(c=>d`<div class="banner fault" role="alert">${c}</div>`)}
        ${n.automatic?h:d`<div class="banner manual">${o(t,"manual")}</div>`}
        ${n.cluster_warning?d`<div class="banner warning" role="alert">${xt(n,this._context)}</div>`:h}
        ${this._renderTop(n)}
        ${this._renderSettings(n)}
        ${this._renderTabs(n)}
        ${r&&this._tab==="week"?this._renderWeek(r):d`
              ${s==="member"?d`<div class="greeting">${dt(n,t)}</div>`:this._renderAvatars(n,i)}
              ${s==="member"&&i?this._renderToday(n,i):h}
              ${i?d`<div class="panel">${this._renderListHead(i,s==="member")} ${this._renderList(i)}</div>
                    ${this._sheet?this._renderSheet(i,this._sheet):h}`:d`<div class="message">${o(t,"members.none")}</div>`}
            `}
        ${this._error?d`<div class="error" role="alert">${this._error}</div>`:h}
        ${this._offOpen?this._renderSwitchOff(n):h}
      </ha-card>
    `}_renderListHead(t,n){let s=this._language,i=pt(t,s),r=ht(t,this._context),c=(l,p)=>this._call({type:"hot_water_ready/away/set",member_id:t.id,away:l,until:p});return d`
      <div class="list-head">
        <div class="list-title">
          <span>${n?o(s,"list.mine"):i.name}</span>
          ${n?h:d`<span class="hint">${i.note}</span>`}
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
                    min=${st(this._context)}
                    .value=${H(t.away.until??"")}
                    @change=${l=>{c(!0,l.target.value||null)}}
                  />
                </label>`:h}
          </div>`:h}
    `}_renderToday(t,n){let s=this._language,i=ct(t,this._context,n.id);return d`<div class="today">
      <span class="today-label">${o(s,"today.label")}</span>
      ${i.length===0?d`<span>${o(s,"today.nobody")}</span>`:i.map(r=>d`<span
              class="chip ${r.mine?"mine":""}"
              style=${r.mine?"":`--chip: var(--${r.colour}-color, var(--primary-color))`}
              >${r.name} ${r.time}</span
            >`)}
    </div>`}_openIntegration(){history.pushState(null,"","/config/integrations/integration/hot_water_ready"),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_renderTop(t){let n=tt(t,this._context);return d`
      <div class="top">
        <div class="gauge ${n.tone==="heating"?"glowing":""}">
          <span class="pulse"></span>
          <span class="orbit"></span>
          <svg class="ring" viewBox="0 0 92 92" role="img" aria-label="${n.temperature} ${n.target}">
            <circle class="track" cx="46" cy="46" r=${be}></circle>
            ${n.fill>0?Ie`<circle class="fill ${n.tone}" cx="46" cy="46" r=${be}
                  stroke-dasharray="${n.fill*$t} ${$t}"
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
        </div>
        <div class="heat-now">
          ${mt(t)?d`<button class="switch-off-link" @click=${()=>this._offOpen=!0}>
                ${o(this._language,"switch_off.link")}
              </button>`:h}
          ${ut(t).map(s=>d`<button
              class="primary"
              @click=${()=>{this._call(s.message)}}
            >
              ${o(this._language,s.label)}
            </button>`)}
        </div>
      </div>
    `}_renderSwitchOff(t){let n=this._language,s=ft(t,this._context),i=()=>this._offOpen=!1;return d`
      <div class="off-overlay">
        <div
          class="off-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="off-title"
          @keydown=${r=>{r.key==="Escape"&&i()}}
        >
          <div class="off-title" id="off-title">${s.title}</div>
          ${s.lines.map(r=>d`<p>${r}</p>`)}
          <button
            class="off-confirm"
            @click=${async()=>{await this._call({type:gt})&&i()}}
          >
            ${o(n,"switch_off.confirm")}
          </button>
          <button class="off-keep" @click=${i}>${o(n,"switch_off.keep")}</button>
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
          ${t.days.map(i=>d`<span class="head ${i.today?"is-today":""}">${i.label}</span>`)}
          ${t.rows.map(i=>d`
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
              ${i.cells.map((r,c)=>d`<div
                  class="cell ${t.days[c]?.today?"is-today":""} ${s&&s!==i.id?"dim":""}"
                >
                  ${r.times.map(l=>d`<span
                      class="tag ${r.away?"away":""}"
                      style=${r.away?"":`background: var(--${i.colour}-color, var(--primary-color))`}
                      >${l}</span
                    >`)}
                </div>`)}
            `)}
          <span class="heating-label">${o(n,"week.heating")}</span>
          <div class="hours">
            ${t.hours.map(i=>d`<span class="hint" style="top: ${(i.at*100).toFixed(1)}%">${i.label}</span>`)}
          </div>
          ${t.days.map(i=>d`<div class="bar ${i.today?"is-today":""}">
              ${i.bars.map(r=>d`<span
                    class="heat"
                    style="top: ${(r.from*100).toFixed(1)}%; height: max(3px, ${(r.length*100).toFixed(1)}%)"
                  ></span>`)}
            </div>`)}
        </div>
        <div class="hint">${o(n,"week.hint")}</div>
      </div>
    `}_renderSettings(t){let n=this._language,s=this._settingsOpen?_t(t,this._context):void 0;if(!s)return h;let i=r=>this._call({type:yt,...r});return d`
      <div class="sheet settings" role="dialog" aria-label=${o(n,"settings.open")}>
        <div class="sheet-head">
          <div class="sheet-title">${o(n,"settings.open")}</div>
          <button class="secondary" @click=${()=>this._settingsOpen=!1}>
            ${o(n,"settings.close")}
          </button>
        </div>
        ${this._renderStepper(s.target,`${s.target.shown} \xB0C`,o(n,"settings.target"),o(n,"settings.target_hint"),["settings.target_down","settings.target_up"],r=>i({target:r}))}
        ${this._renderStepper(s.margin,`\xB1 ${s.margin.shown}`,o(n,"settings.margin"),s.band,["settings.margin_down","settings.margin_up"],r=>i({margin:r}))}
        <label class="setting">
          <span class="setting-text">
            <span>${o(n,"settings.automatic")}</span>
            <span class="hint">${o(n,"settings.automatic_hint")}</span>
          </span>
          <input
            type="checkbox"
            class="switch"
            .checked=${H(s.automatic)}
            @change=${r=>i({automatic:r.target.checked})}
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
                  @change=${c=>{let l=c.target.checked;i({switch_off_people:bt(s.people,r.id,l)})}}
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
    `}_renderStepper(t,n,s,i,r,c){let l=(p,u,g)=>d`<button
      class="step"
      aria-label=${o(this._language,u)}
      ?disabled=${p===null}
      @click=${()=>p===null?void 0:c(p)}
    >
      ${g}
    </button>`;return d`<div class="setting">
      <span class="setting-text"><span>${s}</span><span class="hint">${i}</span></span>
      ${l(t.down,r[0],"\u2212")}
      <span class="value">${n}</span>
      ${l(t.up,r[1],"+")}
    </div>`}_renderSolar(t){let n=this._language;return d`<div class="setting column solar">
      <span>${o(n,"solar.title")}</span>
      <span class="hint">${t.solar}</span>
      ${t.notes.map(s=>d`<span class="hint">${s}</span>`)}
    </div>`}_renderAvatars(t,n){if(!nt(t))return h;let s=L(t)==="admin";return d`
      <div class="avatars" role="tablist">
        ${lt(t,n?.id).map(i=>d`
            <button
              class="avatar ${i.selected?"selected":""} ${i.faded?"faded":""}"
              role="tab"
              aria-selected=${i.selected}
              @click=${()=>{this._selected=i.id,this._sheet=void 0}}
            >
              <span class="dot" style="background: var(--${i.colour}-color, var(--primary-color))"
                >${i.initial}${i.star?d`<span class="star">★</span>`:h}</span
              >
              <span class="label">${i.name}</span>
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
    `}_renderList(t){let n=this._language,s=ot(t,n,this._hour24);return d`
      <div class="list ${t.away.on?"paused-list":""}">
        ${s.length===0?d`<div class="empty">${o(n,"list.empty")}</div>`:h}
        ${s.map(i=>d`
            <div class="row ${i.enabled?"":"off"}">
              ${t.can_edit?d`<button
                    class="row-text"
                    aria-label=${o(n,"list.edit")}
                    @click=${()=>this._sheet=rt(t,i.id)}
                  >
                    ${this._rowText(i)}
                  </button>`:d`<div class="row-text">${this._rowText(i)}</div>`}
              ${t.can_edit?d`
                    <input
                      type="checkbox"
                      class="switch"
                      aria-label=${o(n,"list.switch")}
                      .checked=${H(i.enabled)}
                      @change=${r=>this._call({type:"hot_water_ready/ready_time/update",member_id:t.id,ready_time_id:i.id,enabled:r.target.checked})}
                    />
                    <button
                      class="remove"
                      aria-label=${o(n,"list.remove")}
                      @click=${()=>this._call({type:"hot_water_ready/ready_time/remove",member_id:t.id,ready_time_id:i.id})}
                    >
                      ×
                    </button>
                  `:h}
            </div>
          `)}
        ${t.can_edit?d`<button class="add" @click=${()=>this._sheet=it()}>
              + ${o(n,"list.add")}
            </button>`:h}
      </div>
    `}_rowText(t){return d`<div class="time">${t.time}</div>
      <div class="days">
        ${t.days.map(n=>d`<span class="${n.on?"on":""}">${n.letter}</span>`)}
      </div>`}_renderSheet(t,n){let s=this._language,i=X(s),[r="07",c="00"]=n.time.split(":"),l=o(s,n.id?"sheet.edit_title":"sheet.title"),p=u=>{let g=n.weekdays.includes(u)?n.weekdays.filter(m=>m!==u):[...n.weekdays,u];this._sheet={...n,weekdays:g}};return d`
      <div class="sheet" role="dialog" aria-label=${l}>
        <div class="sheet-title">${l}</div>
        <div class="field">
          ${o(s,"sheet.time")}
          <div class="time-picker">
            <select
              aria-label=${o(s,"sheet.hour")}
              @change=${u=>{this._sheet={...n,time:`${u.target.value}:${c}`}}}
            >
              ${Ze(s,this._hour24).map(u=>d`<option value=${u.value} ?selected=${u.value===r}>${u.label}</option>`)}
            </select>
            <span>:</span>
            <select
              aria-label=${o(s,"sheet.minute")}
              @change=${u=>{this._sheet={...n,time:`${r}:${u.target.value}`}}}
            >
              ${Qe.map(u=>d`<option value=${u} ?selected=${u===c}>${u}</option>`)}
            </select>
          </div>
        </div>
        <div class="field">
          ${o(s,"sheet.days")}
          <div class="day-toggles">
            ${i.map((u,g)=>d`<button
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
          <button class="primary" ?disabled=${!ye(n)} @click=${()=>this._save(t)}>
            ${o(s,"sheet.save")}
          </button>
        </div>
      </div>
    `}static{this.styles=se`
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
    .gauge.glowing .orbit {
      display: block;
      animation: hwr-orbit 6s linear infinite;
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
    .secondary {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    }
  `}};if(!customElements.get(V)){customElements.define(V,ve);let a=window;a.customCards=a.customCards??[],a.customCards.push({type:V,name:"Hot Water Ready",description:"Water temperature, ready times and heat now.",preview:!0})}export{ve as HotWaterReadyCard};
