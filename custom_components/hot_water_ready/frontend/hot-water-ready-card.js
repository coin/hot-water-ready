var Y=globalThis,Q=Y.ShadowRoot&&(Y.ShadyCSS===void 0||Y.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pe=Symbol(),Le=new WeakMap,N=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Q&&t===void 0){let n=e!==void 0&&e.length===1;n&&(t=Le.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Le.set(e,t))}return t}toString(){return this.cssText}},qe=a=>new N(typeof a=="string"?a:a+"",void 0,pe),he=(a,...t)=>{let e=a.length===1?a[0]:t.reduce((n,i,r)=>n+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+a[r+1],a[0]);return new N(e,a,pe)},ze=(a,t)=>{if(Q)a.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let n=document.createElement("style"),i=Y.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=e.cssText,a.appendChild(n)}},me=Q?a=>a:a=>a instanceof CSSStyleSheet?(t=>{let e="";for(let n of t.cssRules)e+=n.cssText;return qe(e)})(a):a;var{is:Xt,defineProperty:Jt,getOwnPropertyDescriptor:en,getOwnPropertyNames:tn,getOwnPropertySymbols:nn,getPrototypeOf:an}=Object,X=globalThis,Ve=X.trustedTypes,rn=Ve?Ve.emptyScript:"",sn=X.reactiveElementPolyfillSupport,L=(a,t)=>a,ge={toAttribute(a,t){switch(t){case Boolean:a=a?rn:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,t){let e=a;switch(t){case Boolean:e=a!==null;break;case Number:e=a===null?null:Number(a);break;case Object:case Array:try{e=JSON.parse(a)}catch{e=null}}return e}},We=(a,t)=>!Xt(a,t),Ue={attribute:!0,type:String,converter:ge,reflect:!1,useDefault:!1,hasChanged:We};Symbol.metadata??=Symbol("metadata"),X.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ue){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let n=Symbol(),i=this.getPropertyDescriptor(t,n,e);i!==void 0&&Jt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,n){let{get:i,set:r}=en(this.prototype,t)??{get(){return this[e]},set(s){this[e]=s}};return{get:i,set(s){let c=i?.call(this);r?.call(this,s),this.requestUpdate(t,c,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ue}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let t=an(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let e=this.properties,n=[...tn(e),...nn(e)];for(let i of n)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[n,i]of e)this.elementProperties.set(n,i)}this._$Eh=new Map;for(let[e,n]of this.elementProperties){let i=this._$Eu(e,n);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)e.unshift(me(i))}else t!==void 0&&e.push(me(t));return e}static _$Eu(t,e){let n=e.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ze(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){let n=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,n);if(i!==void 0&&n.reflect===!0){let r=(n.converter?.toAttribute!==void 0?n.converter:ge).toAttribute(e,n.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let n=this.constructor,i=n._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=n.getPropertyOptions(i),s=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:ge;this._$Em=i;let c=s.fromAttribute(e,r.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,n,i=!1,r){if(t!==void 0){let s=this.constructor;if(i===!1&&(r=this[t]),n??=s.getPropertyOptions(t),!((n.hasChanged??We)(r,e)||n.useDefault&&n.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,n))))return;this.C(t,e,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:i,wrapped:r},s){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),r!==!0||s!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[i,r]of n){let{wrapped:s}=r,c=this[i];s!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,r,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[L("elementProperties")]=new Map,$[L("finalized")]=new Map,sn?.({ReactiveElement:$}),(X.reactiveElementVersions??=[]).push("2.1.2");var _e=globalThis,Be=a=>a,J=_e.trustedTypes,je=J?J.createPolicy("lit-html",{createHTML:a=>a}):void 0,we="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,be="?"+k,on=`<${be}>`,T=document,z=()=>T.createComment(""),V=a=>a===null||typeof a!="object"&&typeof a!="function",ye=Array.isArray,Qe=a=>ye(a)||typeof a?.[Symbol.iterator]=="function",fe=`[ 	
\f\r]`,q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Fe=/-->/g,Ke=/>/g,A=RegExp(`>|${fe}(?:([^\\s"'>=/]+)(${fe}*=${fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ze=/'/g,Ge=/"/g,Xe=/^(?:script|style|textarea|title)$/i,ve=a=>(t,...e)=>({_$litType$:a,strings:t,values:e}),d=ve(1),W=ve(2),Vn=ve(3),w=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),Ye=new WeakMap,C=T.createTreeWalker(T,129);function Je(a,t){if(!ye(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return je!==void 0?je.createHTML(t):t}var et=(a,t)=>{let e=a.length-1,n=[],i,r=t===2?"<svg>":t===3?"<math>":"",s=q;for(let c=0;c<e;c++){let l=a[c],p,h,m=-1,_=0;for(;_<l.length&&(s.lastIndex=_,h=s.exec(l),h!==null);)_=s.lastIndex,s===q?h[1]==="!--"?s=Fe:h[1]!==void 0?s=Ke:h[2]!==void 0?(Xe.test(h[2])&&(i=RegExp("</"+h[2],"g")),s=A):h[3]!==void 0&&(s=A):s===A?h[0]===">"?(s=i??q,m=-1):h[1]===void 0?m=-2:(m=s.lastIndex-h[2].length,p=h[1],s=h[3]===void 0?A:h[3]==='"'?Ge:Ze):s===Ge||s===Ze?s=A:s===Fe||s===Ke?s=q:(s=A,i=void 0);let g=s===A&&a[c+1].startsWith("/>")?" ":"";r+=s===q?l+on:m>=0?(n.push(p),l.slice(0,m)+we+l.slice(m)+k+g):l+k+(m===-2?c:g)}return[Je(a,r+(a[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]},U=class a{constructor({strings:t,_$litType$:e},n){let i;this.parts=[];let r=0,s=0,c=t.length-1,l=this.parts,[p,h]=et(t,e);if(this.el=a.createElement(p,n),C.currentNode=this.el.content,e===2||e===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=C.nextNode())!==null&&l.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let m of i.getAttributeNames())if(m.endsWith(we)){let _=h[s++],g=i.getAttribute(m).split(k),x=/([.?@])?(.*)/.exec(_);l.push({type:1,index:r,name:x[2],strings:g,ctor:x[1]==="."?te:x[1]==="?"?ne:x[1]==="@"?ae:H}),i.removeAttribute(m)}else m.startsWith(k)&&(l.push({type:6,index:r}),i.removeAttribute(m));if(Xe.test(i.tagName)){let m=i.textContent.split(k),_=m.length-1;if(_>0){i.textContent=J?J.emptyScript:"";for(let g=0;g<_;g++)i.append(m[g],z()),C.nextNode(),l.push({type:2,index:++r});i.append(m[_],z())}}}else if(i.nodeType===8)if(i.data===be)l.push({type:2,index:r});else{let m=-1;for(;(m=i.data.indexOf(k,m+1))!==-1;)l.push({type:7,index:r}),m+=k.length-1}r++}}static createElement(t,e){let n=T.createElement("template");return n.innerHTML=t,n}};function E(a,t,e=a,n){if(t===w)return t;let i=n!==void 0?e._$Co?.[n]:e._$Cl,r=V(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(a),i._$AT(a,e,n)),n!==void 0?(e._$Co??=[])[n]=i:e._$Cl=i),i!==void 0&&(t=E(a,i._$AS(a,t.values),i,n)),t}var ee=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:n}=this._$AD,i=(t?.creationScope??T).importNode(e,!0);C.currentNode=i;let r=C.nextNode(),s=0,c=0,l=n[0];for(;l!==void 0;){if(s===l.index){let p;l.type===2?p=new D(r,r.nextSibling,this,t):l.type===1?p=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(p=new ie(r,this,t)),this._$AV.push(p),l=n[++c]}s!==l?.index&&(r=C.nextNode(),s++)}return C.currentNode=T,i}p(t){let e=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}},D=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,i){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),V(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==w&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Qe(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&V(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:n}=t,i=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=U.createElement(Je(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new ee(i,this),s=r.u(this.options);r.p(e),this.T(s),this._$AH=r}}_$AC(t){let e=Ye.get(t.strings);return e===void 0&&Ye.set(t.strings,e=new U(t)),e}k(t){ye(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,n,i=0;for(let r of t)i===e.length?e.push(n=new a(this.O(z()),this.O(z()),this,this.options)):n=e[i],n._$AI(r),i++;i<e.length&&(this._$AR(n&&n._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let n=Be(t).nextSibling;Be(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},H=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,i,r){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=u}_$AI(t,e=this,n,i){let r=this.strings,s=!1;if(r===void 0)t=E(this,t,e,0),s=!V(t)||t!==this._$AH&&t!==w,s&&(this._$AH=t);else{let c=t,l,p;for(t=r[0],l=0;l<r.length-1;l++)p=E(this,c[n+l],e,l),p===w&&(p=this._$AH[l]),s||=!V(p)||p!==this._$AH[l],p===u?t=u:t!==u&&(t+=(p??"")+r[l+1]),this._$AH[l]=p}s&&!i&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},te=class extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},ne=class extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},ae=class extends H{constructor(t,e,n,i,r){super(t,e,n,i,r),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??u)===w)return;let n=this._$AH,i=t===u&&n!==u||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,r=t!==u&&(n===u||i);i&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ie=class{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}},tt={M:we,P:k,A:be,C:1,L:et,R:ee,D:Qe,V:E,I:D,H,N:ne,U:ae,B:te,F:ie},ln=_e.litHtmlPolyfillSupport;ln?.(U,D),(_e.litHtmlVersions??=[]).push("3.3.3");var nt=(a,t,e)=>{let n=e?.renderBefore??t,i=n._$litPart$;if(i===void 0){let r=e?.renderBefore??null;n._$litPart$=i=new D(t.insertBefore(z(),r),r,void 0,e??{})}return i._$AI(a),i};var xe=globalThis,S=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=nt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return w}};S._$litElement$=!0,S.finalized=!0,xe.litElementHydrateSupport?.({LitElement:S});var dn=xe.litElementPolyfillSupport;dn?.({LitElement:S});(xe.litElementVersions??=[]).push("4.2.2");var M={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},at=a=>(...t)=>({_$litDirective$:a,values:t}),re=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:na}=tt;var it=a=>a.strings===void 0;var cn={},rt=(a,t=cn)=>a._$AH=t;var R=at(class extends re{constructor(a){if(super(a),a.type!==M.PROPERTY&&a.type!==M.ATTRIBUTE&&a.type!==M.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!it(a))throw Error("`live` bindings can only contain a single expression")}render(a){return a}update(a,[t]){if(t===w||t===u)return t;let e=a.element,n=a.name;if(a.type===M.PROPERTY){if(t===e[n])return w}else if(a.type===M.BOOLEAN_ATTRIBUTE){if(!!t===e.hasAttribute(n))return w}else if(a.type===M.ATTRIBUTE&&e.getAttribute(n)===t+"")return w;return rt(a),t}});var un={"status.waiting":"Idle","status.heating":"Heating","status.ready":"Ready","status.fault":"Fault","status.manual":"Manual","headline.heating_for":"Heating: ready in about {minutes} min","headline.ready_at":"Ready at {when}","subline.next_at":"Next at {when}","when.today":"{time}","when.tomorrow":"{time} tomorrow","when.weekday":"{time} on {weekday}","ring.target":"target {target}\xB0","weekday.letters":"M,T,W,T,F,S,S","members.none":"No members yet. An administrator adds them in the integration's settings.","list.empty":"No ready times yet.","list.add":"Add a ready time","sheet.delete":"Delete","list.switch":"On or off","sheet.title":"New ready time","sheet.edit_title":"Change ready time","list.edit":"Change this ready time","sheet.time":"Time","sheet.hour":"Hour","sheet.minute":"Minute","sheet.days":"Days","sheet.save":"Save","sheet.cancel":"Cancel","clock.title":"Select time","clock.title_keys":"Enter time","clock.ok":"OK","clock.to_keys":"Type the time","clock.to_dial":"Use the clock","clock.am":"AM","clock.pm":"PM","clock.invalid":"Enter a valid time","clock.change":"Change the time","fault.sensor_unavailable":"Fault: the water temperature sensor gives no readings. Heating has stopped.","fault.not_rising":"Fault: the water is not getting hotter. Heating has stopped; see Repairs.","fault.no_consumption":"Fault: the heater draws no power. Heating has stopped; see Repairs.","fault.relay_stuck":"Fault: the heater draws power while switched off. Check the relay.","element.on":"Heater on","element.off":"Heater off","element.drawing":"{state} \xB7 drawing {watts} W","keep_hot.until":"Keeping hot until {time}","keep_hot.title":"Keep hot after it's ready","keep_hot.hint":'After the "ready" message the heater keeps the water hot this long, then switches off.',"keep_hot.more":"Choose how long to keep it hot","keep_hot.cancel":"Cancel","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h",manual:"Automatic control is off: the heater is run by hand.","note.not_rising_skipped":'The thermostat does not say when it is heating, so the "water not getting hotter" and "heater draws no power" checks are not made.',"heat_now.start":"Heat now","heat_now.cancel":"Cancel","heat_now.join":"Tell me when it's hot","heat_now.leave":"Don't tell me","subline.for":"For {list}.","item.at":"{name} at {time}","switch_off.link":"Switch off the heating\u2026","switch_off.title":"Switch off the heating?","switch_off.confirm":"Switch off","switch_off.keep":"Cancel","switch_off.asked_one":"{names} will no longer be told.","switch_off.asked_many":"{names} will no longer be told.","switch_off.skipped_one":"Without hot water: {list}.","switch_off.skipped_many":"Without hot water: {list}.","switch_off.back":"It switches back on by itself for the next ready time.","switch_off.nobody":"Heating stops now.","settings.switch_off":"Who may switch off the heating for everyone","settings.switch_off_hint":"The administrators and:","settings.own_cancel":"Whoever asked may always cancel their own request.",greeting:"Hello, {name}","today.label":"House today","today.nobody":"Nobody today","away.until_label":"Until (optional)","away.line":"Away","away.line_until":"Away until {date}","members.add":"Member","card.no_heater":"No Hot Water Ready heater is set up yet.","card.loading":"Loading\u2026","card.error":"That did not work: {message}","cluster.warning":"The showers from {when} need the water at {needed} \xB0C, but the heater goes only to {cap} \xB0C: the last ones may run cooler.","tabs.people":"People","tabs.week":"Week","week.days":"Mon,Tue,Wed,Thu,Fri,Sat,Sun","week.showers":"showers","week.windows":"heating windows","week.busiest":"busiest day","week.heating":"Heating","week.away":"away","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} a week","week.hint":"Tap a person to highlight their times. The bars show when the heater may heat each day ({start} to {end}).","settings.open":"Heater settings","settings.close":"Close","settings.target":"Target temperature","settings.target_hint":"Ready when the water gets here","settings.target_down":"Lower the target","settings.target_up":"Raise the target","settings.margin":"Margin","settings.band":"Stops at {stop} \xB0C, restarts at {restart} \xB0C","settings.margin_down":"Lower the margin","settings.margin_up":"Raise the margin","settings.automatic":"Automatic control","settings.automatic_hint":"Off: the heater is run by hand","settings.more":"More settings","rate.title":"Heating speed","rate.unit":"min per \xB0C","rate.automatic":"Automatic","rate.fixed":"Fixed","rate.learned":"Learned: median of the {count} clean heats of the last {days} days","rate.default_one":"Starting value: 1 more clean heat in the last {days} days and it is learned","rate.default_many":"Starting value: {count} more clean heats in the last {days} days and it is learned","rate.manual":"Fixed by hand: learning goes on, but is not used","rate.runs":"Clean heats behind it","rate.example":"Now {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} min, plus {margin} min margin: starts {lead} min before","rate.example_cap":" (the most)","rate.example_warm":"Now {from} \xB0C: already at the target, no need to start early","rate.physics":"By physics, the whole tank heated by the element: {rate} min/\xB0C","rate.physics_range":"By physics: between {fast} min/\xB0C (only the water above the element) and {slow} min/\xB0C (the whole tank)","rate.volume":"Amounts to heating {litres} L of the tank's {tank} L","rate.far_below":": {percent}% below physics. Check the tank's volume, the element's power and where the probe is.","rate.far_above":": {percent}% above physics. Check the tank's volume, the element's power and where the probe is.","rate.suggested_learned":"Suggested: {rate} (learned)","rate.suggested_physics":"Suggested: {rate} (tank physics)","rate.suggested_default":"Suggested: {rate} (starting value)","rate.use":"Use","rate.down":"0.1 min per \xB0C less","rate.up":"0.1 min per \xB0C more","rate.recalculate":"Recalculate from history","rate.recalculating":"Looking through the last week\u2026","rate.found":"Found {count} clean heats in history; learned {rate} min/\xB0C.","rate.found_too_few":"Found {count} clean heats in history; {needed} are needed to learn.","solar.title":"Solar comparison","solar.none":"No windows recorded in the last 30 days yet.","solar.would":"With the solar-aware rule on, the water would have been ready on time in {on_time} of {windows} windows","solar.did":"With the solar-aware rule, the water was ready on time in {on_time} of {windows} windows","solar.would_less":", and the heater would have run {minutes} minutes less","solar.would_more":", and the heater would have run {minutes} minutes more","solar.did_less":", and the heater ran {minutes} minutes less","solar.did_more":", and the heater ran {minutes} minutes more","solar.kwh":", about {kwh} kWh","solar.applied":" The rule was applied in {applied} of them: on time in {on_time}.","subline.starts_at":"Starts heating around {when}.","subline.starts_at_solar":"Starts heating around {when}, if the sun has not done it by then.","subline.asked_by_one":"Asked for by {name}. They are told when it is ready.","subline.asked_by_many":"Asked for by {names}. Each is told when it is ready.","names.and":" and ","today.you":"You","list.mine":"My ready times","list.count_one":"1 ready time","list.count":"{count} ready times","list.virtual":"Virtual member \xB7 shared household times","away.paused":"Paused. The times are kept.","settings.no_people":"There are no people in Home Assistant to choose from yet."},pn={"status.waiting":"Em espera","status.heating":"A aquecer","status.ready":"Pronta","status.fault":"Avaria","status.manual":"Manual","headline.heating_for":"A aquecer: pronta em cerca de {minutes} min","headline.ready_at":"Pronta \xE0s {when}","subline.next_at":"Pr\xF3xima \xE0s {when}","when.today":"{time}","when.tomorrow":"{time} de amanh\xE3","when.weekday":"{time} de {weekday}","ring.target":"alvo {target}\xB0","weekday.letters":"S,T,Q,Q,S,S,D","members.none":"Ainda n\xE3o h\xE1 membros. Um administrador acrescenta-os nas defini\xE7\xF5es da integra\xE7\xE3o.","list.empty":"Ainda n\xE3o h\xE1 hor\xE1rios.","list.add":"Acrescentar um hor\xE1rio","sheet.delete":"Apagar","list.switch":"Ligar ou desligar","sheet.title":"Novo hor\xE1rio","sheet.edit_title":"Alterar hor\xE1rio","list.edit":"Alterar este hor\xE1rio","sheet.time":"Hora","sheet.hour":"Horas","sheet.minute":"Minutos","sheet.days":"Dias","sheet.save":"Guardar","sheet.cancel":"Cancelar","clock.title":"Escolher a hora","clock.title_keys":"Escrever a hora","clock.ok":"OK","clock.to_keys":"Escrever a hora","clock.to_dial":"Usar o rel\xF3gio","clock.am":"AM","clock.pm":"PM","clock.invalid":"Escreva uma hora v\xE1lida","clock.change":"Alterar a hora","fault.sensor_unavailable":"Avaria: o sensor da temperatura da \xE1gua n\xE3o d\xE1 leituras. O aquecimento parou.","fault.not_rising":"Avaria: a \xE1gua n\xE3o aquece. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.no_consumption":"Avaria: o aquecedor n\xE3o consome energia. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.relay_stuck":"Avaria: o aquecedor consome energia com o rel\xE9 desligado. Verifique o rel\xE9.","element.on":"Resist\xEAncia ligada","element.off":"Resist\xEAncia desligada","element.drawing":"{state} \xB7 a consumir {watts} W","keep_hot.until":"A manter a \xE1gua quente at\xE9 \xE0s {time}","keep_hot.title":"Manter quente depois de pronta","keep_hot.hint":"Depois do aviso de pronta, o aquecedor mant\xE9m a \xE1gua quente durante este tempo e depois desliga.","keep_hot.more":"Escolher quanto tempo manter quente","keep_hot.cancel":"Cancelar","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h",manual:"O controlo autom\xE1tico est\xE1 desligado: o aquecedor est\xE1 a ser comandado manualmente.","note.not_rising_skipped":'O term\xF3stato n\xE3o indica quando est\xE1 a aquecer, por isso as verifica\xE7\xF5es "a \xE1gua n\xE3o aquece" e "o aquecedor n\xE3o consome energia" n\xE3o s\xE3o feitas.',"heat_now.start":"Aquecer agora","heat_now.cancel":"Cancelar","heat_now.join":"Avisar-me quando estiver quente","heat_now.leave":"N\xE3o me avisar","subline.for":"Para {list}.","item.at":"{name} \xE0s {time}","switch_off.link":"Desligar o aquecimento\u2026","switch_off.title":"Desligar o aquecimento?","switch_off.confirm":"Desligar","switch_off.keep":"Cancelar","switch_off.asked_one":"{names} j\xE1 n\xE3o recebe o aviso.","switch_off.asked_many":"{names} j\xE1 n\xE3o recebem o aviso.","switch_off.skipped_one":"Fica sem \xE1gua quente: {list}.","switch_off.skipped_many":"Ficam sem \xE1gua quente: {list}.","switch_off.back":"Volta a ligar-se por si para o pr\xF3ximo hor\xE1rio.","switch_off.nobody":"O aquecimento p\xE1ra agora.","settings.switch_off":"Quem pode desligar o aquecimento para todos","settings.switch_off_hint":"Os administradores e:","settings.own_cancel":"Quem pediu pode sempre cancelar o seu pr\xF3prio pedido.",greeting:"Ol\xE1, {name}","today.label":"Casa hoje","today.nobody":"Ningu\xE9m hoje","away.until_label":"At\xE9 (opcional)","away.line":"Ausente","away.line_until":"Ausente at\xE9 {date}","members.add":"Membro","card.no_heater":"Ainda n\xE3o h\xE1 nenhum aquecedor do Hot Water Ready configurado.","card.loading":"A carregar\u2026","card.error":"N\xE3o foi poss\xEDvel: {message}","cluster.warning":"Os duches a partir das {when} precisam da \xE1gua a {needed} \xB0C, mas o aquecedor s\xF3 aquece at\xE9 {cap} \xB0C: os \xFAltimos podem sair menos quentes.","tabs.people":"Pessoas","tabs.week":"Semana","week.days":"Seg,Ter,Qua,Qui,Sex,S\xE1b,Dom","week.showers":"duches","week.windows":"janelas de aquecimento","week.busiest":"dia mais cheio","week.heating":"Aquecimento","week.away":"ausente","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} por semana","week.hint":"Toque numa pessoa para destacar os seus hor\xE1rios. As barras mostram quando o aquecedor pode aquecer em cada dia ({start} a {end}).","settings.open":"Defini\xE7\xF5es do aquecedor","settings.close":"Fechar","settings.target":"Temperatura alvo","settings.target_hint":"Avisa quando chega aqui","settings.target_down":"Baixar o alvo","settings.target_up":"Subir o alvo","settings.margin":"Margem","settings.band":"P\xE1ra a {stop} \xB0C, retoma a {restart} \xB0C","settings.margin_down":"Baixar a margem","settings.margin_up":"Subir a margem","settings.automatic":"Controlo autom\xE1tico","settings.automatic_hint":"Desligado: o aquecedor fica em modo manual","settings.more":"Mais defini\xE7\xF5es","rate.title":"Velocidade de aquecimento","rate.unit":"min por \xB0C","rate.automatic":"Autom\xE1tico","rate.fixed":"Fixo","rate.learned":"Aprendido: mediana das {count} aquecidas limpas dos \xFAltimos {days} dias","rate.default_one":"Valor inicial: falta 1 aquecida limpa nos \xFAltimos {days} dias para aprender","rate.default_many":"Valor inicial: faltam {count} aquecidas limpas nos \xFAltimos {days} dias para aprender","rate.manual":"Fixo \xE0 m\xE3o: a aprendizagem continua, mas n\xE3o \xE9 usada","rate.runs":"Aquecidas limpas usadas","rate.example":"Agora {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} min, mais {margin} min de margem: come\xE7a {lead} min antes","rate.example_cap":" (o m\xE1ximo)","rate.example_warm":"Agora {from} \xB0C: j\xE1 est\xE1 no alvo, n\xE3o precisa de come\xE7ar antes","rate.physics":"Pela f\xEDsica, o tanque inteiro aquecido pela resist\xEAncia: {rate} min/\xB0C","rate.physics_range":"Pela f\xEDsica: entre {fast} min/\xB0C (s\xF3 a \xE1gua acima da resist\xEAncia) e {slow} min/\xB0C (o tanque inteiro)","rate.volume":"Equivale a aquecer {litres} L dos {tank} L do tanque","rate.far_below":": {percent}% abaixo da f\xEDsica. Confirme o volume do tanque, a pot\xEAncia da resist\xEAncia e onde est\xE1 a sonda.","rate.far_above":": {percent}% acima da f\xEDsica. Confirme o volume do tanque, a pot\xEAncia da resist\xEAncia e onde est\xE1 a sonda.","rate.suggested_learned":"Sugerido: {rate} (aprendido)","rate.suggested_physics":"Sugerido: {rate} (pela f\xEDsica do tanque)","rate.suggested_default":"Sugerido: {rate} (valor inicial)","rate.use":"Usar","rate.down":"Menos 0,1 min por \xB0C","rate.up":"Mais 0,1 min por \xB0C","rate.recalculate":"Recalcular a partir do hist\xF3rico","rate.recalculating":"A rever a \xFAltima semana\u2026","rate.found":"Encontradas {count} aquecidas limpas no hist\xF3rico; aprendido {rate} min/\xB0C.","rate.found_too_few":"Encontradas {count} aquecidas limpas no hist\xF3rico; s\xE3o precisas {needed} para aprender.","solar.title":"Compara\xE7\xE3o solar","solar.none":"Ainda n\xE3o h\xE1 janelas registadas nos \xFAltimos 30 dias.","solar.would":"Com a regra solar ligada, a \xE1gua teria ficado pronta a tempo em {on_time} de {windows} janelas","solar.did":"Com a regra solar, a \xE1gua ficou pronta a tempo em {on_time} de {windows} janelas","solar.would_less":", e o aquecedor teria trabalhado menos {minutes} minutos","solar.would_more":", e o aquecedor teria trabalhado mais {minutes} minutos","solar.did_less":", e o aquecedor trabalhou menos {minutes} minutos","solar.did_more":", e o aquecedor trabalhou mais {minutes} minutos","solar.kwh":", cerca de {kwh} kWh","solar.applied":" A regra foi aplicada em {applied} delas: a tempo em {on_time}.","subline.starts_at":"Come\xE7a a aquecer por volta das {when}.","subline.starts_at_solar":"Come\xE7a a aquecer por volta das {when}, se o sol n\xE3o chegar.","subline.asked_by_one":"Pedido por {name}. Recebe um aviso quando estiver pronta.","subline.asked_by_many":"Pedido por {names}. Cada um \xE9 avisado quando estiver pronta.","names.and":" e ","today.you":"Voc\xEA","list.mine":"Os meus hor\xE1rios","list.count_one":"1 hor\xE1rio","list.count":"{count} hor\xE1rios","list.virtual":"Membro virtual \xB7 hor\xE1rios partilhados da casa","away.paused":"Em pausa. Os hor\xE1rios ficam guardados.","settings.no_people":"Ainda n\xE3o h\xE1 pessoas no Home Assistant para escolher."},hn={en:un,pt:pn};function se(a){return a?.toLowerCase().startsWith("pt")?"pt":"en"}function b(a){return se(a)==="pt"?"pt-PT":"en-GB"}function oe(a){return o(a,"weekday.letters").split(",")}function o(a,t,e={}){return hn[se(a)][t].replace(/\{(\w+)\}/g,(i,r)=>String(e[r]??i))}function $e(a){return a.callWS({type:"hot_water_ready/heaters"})}var le=class{constructor(t,e){this.onSnapshot=t;this.onMissing=e;this.generation=0}async follow(t,e){let n=this.generation,i=e;if(i===void 0){if(this.defaultEntryId??=$e(t).then(s=>s[0]?.entry_id),i=await this.defaultEntryId,n!==this.generation)return;if(i===void 0){this.defaultEntryId=void 0,this.onMissing();return}}if(i===this.entryId)return;this.stop();let r=this.generation;this.entryId=i,this.stopSubscription=t.connection.subscribeMessage(s=>{r===this.generation&&this.onSnapshot(s)},{type:"hot_water_ready/subscribe",entry_id:i}),this.stopSubscription.catch(()=>{r===this.generation&&(this.entryId=void 0,this.onMissing())})}stop(){this.generation++;let t=this.stopSubscription;this.stopSubscription=void 0,this.entryId=void 0,t?.then(e=>e()).catch(()=>{})}};function lt(a,t){if(a==="24")return!0;if(a==="12")return!1;let e=a==="system"?void 0:t;return!new Intl.DateTimeFormat(e,{hour:"numeric"}).format(new Date(2023,0,1,22)).includes("10")}function dt(a,t,e,n){return n?`${String(a).padStart(2,"0")}:${String(t).padStart(2,"0")}`:new Intl.DateTimeFormat(b(e),{timeZone:"UTC",hour:"numeric",minute:"2-digit",hourCycle:"h12"}).format(Date.UTC(2e3,0,1,a,t))}function ue(a,t,e=!0){let[n=0,i=0]=a.split(":").map(Number);return dt(n,i,t,e)}function ke(a,t,e=!0){return e?`${String(a).padStart(2,"0")}h`:new Intl.DateTimeFormat(b(t),{timeZone:"UTC",hour:"numeric",hourCycle:"h12"}).format(Date.UTC(2e3,0,1,a%24))}function ct(a,t=!0){return o(a,"week.hint",{start:ke(I/60,a,t),end:ke(F/60,a,t)})}function f(a,t,e){return new Intl.NumberFormat(b(t),{maximumFractionDigits:e}).format(a)}function j(a,t){return new Intl.DateTimeFormat("en-CA",{timeZone:t,year:"numeric",month:"2-digit",day:"2-digit"}).format(a)}function ut(a){let t=new Date(`${a}T12:00:00Z`);return t.setUTCDate(t.getUTCDate()+1),t.toISOString().slice(0,10)}function ce(a,t){let{language:e,timeZone:n,now:i}=t,r=new Date(a),s=Z(a,t),c=j(i,n);if(j(r,n)===c)return o(e,"when.today",{time:s});if(j(r,n)===ut(c))return o(e,"when.tomorrow",{time:s});let l=new Intl.DateTimeFormat(b(e),{timeZone:n,weekday:"long"}).format(r);return o(e,"when.weekday",{time:s,weekday:l})}function mn(a,t){let{language:e}=t;return a.status==="heating"&&a.ready_in_minutes!==null?o(e,"headline.heating_for",{minutes:a.ready_in_minutes}):a.status==="waiting"&&a.next_ready?o(e,"headline.ready_at",{when:ce(a.next_ready.at,t)}):o(e,`status.${a.status}`)}function pt(a){return new Map(a.members.map(t=>[t.id,t]))}function Ce(a,t,e){let n=pt(a);return t.map(i=>n.get(i)?.name??e.people?.[i]??i)}function ht(a){let t={};for(let[e,n]of Object.entries(a??{}))e.startsWith("person.")&&(t[e]=n.attributes.friendly_name??e);return t}function Te(a,t){return a.length<2?a.join(""):`${a.slice(0,-1).join(", ")}${o(t,"names.and")}${a.at(-1)??""}`}function mt(a,t,e){let n=t.map(i=>o(e.language,"item.at",{name:Ce(a,[i.member],e)[0]??"",time:Z(i.at,e)}));return Te(n,e.language)}function gn(a,t){let{language:e}=t,n=a.heat_now?.requesters??[];if(a.status==="heating"&&n.length>0){let i=Ce(a,n,t);return i.length===1?o(e,"subline.asked_by_one",{name:i[0]??""}):o(e,"subline.asked_by_many",{names:Te(i,e)})}if(a.status==="heating"&&a.heating_for.length>0)return o(e,"subline.for",{list:mt(a,a.heating_for,t)});if(a.status==="waiting"&&a.next_heat_start){let i=a.solar_aware?"subline.starts_at_solar":"subline.starts_at";return o(e,i,{when:ce(a.next_heat_start,t)})}return a.status==="ready"&&a.next_ready?o(e,"subline.next_at",{when:ce(a.next_ready.at,t)}):""}function fn(a,t){if(a.element_on===null)return"";let e=o(t,a.element_on?"element.on":"element.off");return a.power_w===null?e:o(t,"element.drawing",{state:e,watts:f(a.power_w,t,0)})}function gt(a,t){let{language:e}=t,{temperature:n,target:i}=a;return{temperature:n===null?"\u2013":`${f(n,e,1)}\xB0`,target:o(e,"ring.target",{target:f(i,e,1)}),badge:o(e,`status.${a.status}`).toLocaleUpperCase(b(e)),headline:mn(a,t),subline:gn(a,t),element:fn(a,e),keepHot:vn(a,t),fill:n===null||i<=0?0:Math.min(1,Math.max(0,n/i)),tone:a.status}}function _n(a,t){let e=t??a.me;return a.members.find(n=>n.id===e)??a.members[0]}function ft(a){let t=K(a);return t==="admin"?!0:t==="viewer"&&a.members.length>1}function _t(a,t){return _n(a,K(a)==="member"?void 0:t)}function wt(a){return j(a.now,a.timeZone)}function bt(){return{time:"07:00",weekdays:[0,1,2,3,4]}}function yt(a,t){let e=a.ready_times.find(n=>n.id===t);return e&&{id:e.id,time:e.time,weekdays:[...e.weekdays].sort()}}function Ee(a){return a.time!==""&&a.weekdays.length>0}var v=256,O=104,He=68;function y(a){return String(a).padStart(2,"0")}function Me(a,t){return t?y(a):String(a%12||12)}function Se(a,t){return{hourText:Me(a.hour,t),minuteText:y(a.minute)}}function Re(a,t,e=!0){let[n=7,i=0]=a.split(":").map(Number);return{hour:n,minute:i,part:"hour",mode:"dial",...Se({hour:n,minute:i},e),fresh:t}}function B(a,t){let e=a*Math.PI/6;return{x:v/2+t*Math.sin(e),y:v/2-t*Math.cos(e)}}function vt(a,t=!0){let e=Array.from({length:12},(n,i)=>i);return a==="minute"?e.map(n=>({value:n*5,label:y(n*5),...B(n,O)})):t?[...e.map(n=>({value:n,label:String(n),...B(n,O)})),...e.map(n=>({value:n+12,label:String(n+12),...B(n,He)}))]:e.map(n=>({value:n,label:String(n||12),...B(n,O)}))}function xt(a,t,e=!0){return a.part==="minute"?a.minute===t.value:(e?a.hour:a.hour%12)===t.value}function $t(a,t=!0){if(a.part==="minute"){let e=a.minute*Math.PI/30;return{x:v/2+O*Math.sin(e),y:v/2-O*Math.cos(e)}}return B(a.hour%12,t&&a.hour>=12?He:O)}function kt(a,t,e,n=!0){let i=t-v/2,r=e-v/2,s=(Math.atan2(i,-r)/(2*Math.PI)+1)%1;if(a.part==="minute"){let h=Math.round(s*60)%60;return{...a,minute:h,minuteText:y(h)}}let c=Math.round(s*12)%12,l=n?Math.hypot(i,r)<(O+He)/2:a.hour>=12,p=c+(l?12:0);return{...a,hour:p,hourText:Me(p,n)}}function St(a,t,e=!0){if(a.part==="minute"){let i=(a.minute+t+60)%60;return{...a,minute:i,minuteText:y(i)}}let n=(a.hour+t+24)%24;return{...a,hour:n,hourText:Me(n,e)}}function At(a,t){return{...a,hour:a.hour%12+(t?12:0)}}function Ct(a,t=!0){if(!/^\d{1,2}$/.test(a.hourText)||!/^\d{1,2}$/.test(a.minuteText))return;let e=Number(a.hourText),n=Number(a.minuteText);if(!(n>59)){if(t)return e>23?void 0:`${y(e)}:${y(n)}`;if(!(e<1||e>12))return`${y(e%12+(a.hour>=12?12:0))}:${y(n)}`}}function Oe(a,t=!0){return a.mode==="keys"?Ct(a,t):`${y(a.hour)}:${y(a.minute)}`}function Tt(a,t=!0){if(a.mode==="dial")return{...a,mode:"keys",...Se(a,t)};let[e=a.hour,n=a.minute]=Ct(a,t)?.split(":").map(Number)??[];return{...a,mode:"dial",part:"hour",hour:e,minute:n,...Se({hour:e,minute:n},t)}}function Et(a,t,e=!0){let n=oe(t);return[...a.ready_times].sort((i,r)=>i.time.localeCompare(r.time)||i.id.localeCompare(r.id)).map(i=>({id:i.id,time:ue(i.time,t,e),enabled:i.enabled,days:n.map((r,s)=>({letter:r,on:i.weekdays.includes(s)}))}))}function K(a){return a.is_admin?"admin":a.me?"member":"viewer"}function Ht(a,t){return a.members.map(e=>({id:e.id,name:e.name,initial:e.name.slice(0,1).toLocaleUpperCase(),colour:e.colour,star:e.virtual,faded:e.away.on,selected:e.id===t}))}function Mt(a,t){let e=a.members.find(n=>n.id===a.me);return e?o(t,"greeting",{name:e.name}):""}function Z(a,t){let{minutes:e}=Ae(a,t.timeZone);return dt(Math.floor(e/60),e%60,t.language,t.hour24??!0)}function Rt(a,t,e){let n=pt(a);return a.today.map(i=>{let r=i.member===e,s=n.get(i.member);return{name:r?o(t.language,"today.you"):s?.name??"?",time:Z(i.at,t),colour:s?.colour??"",mine:r}})}function Ot(a,t){let e=a.ready_times.length,n=o(t,"list.count",{count:e});return a.virtual?n=o(t,"list.virtual"):e===1&&(n=o(t,"list.count_one")),{name:a.name,note:n}}function wn(a,t){let e=new Date(`${a}T12:00:00Z`),n=b(t),i=new Intl.DateTimeFormat(n,{timeZone:"UTC",day:"numeric"}).format(e),r=new Intl.DateTimeFormat(n,{timeZone:"UTC",month:"long"}).format(e);return se(t)==="pt"?`${i} de ${r.slice(0,1).toLocaleUpperCase("pt-PT")}${r.slice(1)}`:`${i} ${r}`}function Dt(a,t){return a.away.on?a.away.until?o(t.language,"away.line_until",{date:wn(a.away.until,t.language)}):o(t.language,"away.line"):""}var Pt="hot_water_ready/heat_now/start",bn="hot_water_ready/heat_now/cancel";function It(a){let t=a.can_ask_heat_now&&!a.heat_now_blocked&&a.automatic,e=a.heat_now;if(e?.asked){let i=e.requesters.length===1&&!e.unnamed;return[{message:{type:bn},label:i?"heat_now.cancel":"heat_now.leave"}]}if(!t)return[];if(e===null&&a.heating_for.some(i=>i.member===a.me))return[];let n=a.status==="heating"||e!==null;return[{message:{type:Pt},label:n?"heat_now.join":"heat_now.start"}]}function Nt(a){return a.message.type===Pt}var Lt=500,yn=[5,15,30,60,120];function qt(a,t){let e=a.keep_hot_minutes;return[...new Set([...yn,e])].sort((i,r)=>i-r).map(i=>({minutes:i,label:i>=60&&i%60===0?o(t,"keep_hot.hours",{n:f(i/60,t,0)}):o(t,"keep_hot.minutes",{n:f(i,t,0)}),isDefault:i===e}))}function vn(a,t){let e=a.heat_now?.keep_until;return e?o(t.language,"keep_hot.until",{time:Z(e,t)}):""}var zt="hot_water_ready/switch_off";function Vt(a){let t=(a.heat_now?.requesters.length??0)>0||!!a.heat_now?.unnamed;return a.can_switch_off&&(a.status==="heating"||t)}function Ut(a,t){let{language:e}=t,n=(a.heat_now?.requesters??[]).filter(s=>s!==a.viewer),i=a.heating_for.filter(s=>s.member!==a.viewer),r=[];if(n.length>0){let s=Te(Ce(a,n,t),e);r.push(o(e,n.length===1?"switch_off.asked_one":"switch_off.asked_many",{names:s}))}if(i.length>0){let s=mt(a,i,t);r.push(o(e,i.length===1?"switch_off.skipped_one":"switch_off.skipped_many",{list:s}))}return r.length===0&&r.push(o(e,"switch_off.nobody")),a.heating_for.length>0&&r.push(o(e,"switch_off.back")),{title:o(e,"switch_off.title"),lines:r}}function Wt(a,t){return a.faults.map(e=>o(t,`fault.${e}`))}var De="hot_water_ready/settings/set",xn={min:30,max:75,step:.5},$n={min:0,max:5,step:.5};function st(a,t,e){let n=Math.ceil(a/t.step-1e-9)*t.step-t.step,i=Math.floor(a/t.step+1e-9)*t.step+t.step;return{shown:f(a,e,1),down:n>=t.min-1e-9?n:null,up:i<=t.max+1e-9?i:null}}function Bt(a,t){let{language:e}=t,n=a.settings;if(!(!a.is_admin||!n))return{target:st(a.target,xn,e),margin:st(a.margin,$n,e),band:o(e,"settings.band",{stop:f(a.target+a.margin,e,1),restart:f(a.target-a.margin,e,1)}),automatic:a.automatic,people:Object.entries(t.people??{}).map(([i,r])=>({id:i,name:r,on:n.switch_off_people.includes(i)})).sort((i,r)=>i.name.localeCompare(r.name)),solar:Hn(n,e),notes:a.not_rising_checked?[]:[o(e,"note.not_rising_skipped")]}}var de={min:.5,max:60,step:.1},jt="hot_water_ready/rate/recalculate",Ft=1e3,ot=.25,P=a=>Math.round(a*10)/10;function kn(a,t){let e=new Date(a),{language:n,timeZone:i}=t,r=new Intl.DateTimeFormat(b(n),{timeZone:i,day:"numeric"}).format(e),s=new Intl.DateTimeFormat(b(n),{timeZone:i,month:"short"}).format(e).replace(".","");return`${r} ${s.slice(0,1).toLocaleUpperCase()}${s.slice(1)}, ${Z(a,t)}`}function Sn(a,t){if(a.source==="manual")return o(t,"rate.manual");if(a.source==="learned")return o(t,"rate.learned",{count:a.runs.length,days:a.window_days});let e=Math.max(1,a.min_runs-a.runs.length);return o(t,e===1?"rate.default_one":"rate.default_many",{count:e,days:a.window_days})}function An(a,t,e){let n=a.temperature;if(n===null)return null;let i=f(n,e,1),r=a.target-n;if(r<=0)return o(e,"rate.example_warm",{from:i});let s=r*t.used,c=s+t.lead_margin_minutes,l=Math.min(t.lead_cap_minutes,c);return o(e,"rate.example",{from:i,to:f(a.target,e,1),degrees:f(r,e,1),rate:f(t.used,e,1),minutes:Math.round(s),margin:t.lead_margin_minutes,lead:Math.round(l)})+(c>t.lead_cap_minutes?o(e,"rate.example_cap"):"")}function Cn(a,t){if(a.physics===null||a.tank_litres===null)return null;let e=a.physics_fast??a.physics,n=o(t,"rate.volume",{litres:Math.round(a.tank_litres*a.used/a.physics),tank:f(a.tank_litres,t,0)}),i=a.used<e*(1-ot),r=a.used>a.physics*(1+ot);if(i||r){let s=a.used/(i?e:a.physics);n+=o(t,i?"rate.far_below":"rate.far_above",{percent:Math.round(Math.abs(s-1)*100)})}return{line:n,warn:i||r}}function Tn(a,t){if(a.physics===null)return null;let e=f(a.physics,t,1),n=f(a.physics_fast??a.physics,t,1);return n===e?o(t,"rate.physics",{rate:e}):o(t,"rate.physics_range",{fast:n,slow:e})}function En(a,t){if(a.source!=="manual")return null;let[e,n]=a.learned!==null?[a.learned,"rate.suggested_learned"]:a.physics!==null?[a.physics,"rate.suggested_physics"]:[a.default,"rate.suggested_default"],i=P(e);return a.manual!==null&&P(a.manual)===i?null:{value:i,line:o(t,n,{rate:f(i,t,1)})}}function Pe(a,t){let e=P(a),n=P(e-de.step),i=P(e+de.step);return{shown:f(e,t,1),down:n>=de.min?n:null,up:i<=de.max?i:null}}function Kt(a,t){let{language:e}=t,n=a.settings?.rate;if(!(!a.is_admin||!n))return{shown:f(n.used,e,1),used:P(n.used),fixed:n.source==="manual",source:Sn(n,e),runs:[...n.runs].sort((i,r)=>Date.parse(r.at)-Date.parse(i.at)).map(i=>({when:kn(i.at,t),rate:f(i.rate,e,1)})),example:An(a,n,e),physics:Tn(n,e),check:Cn(n,e),stepper:Pe(n.used,e),suggestion:En(n,e)}}function Zt(a,t,e){return a.filter(n=>n.id===t?e:n.on).map(n=>n.id)}function Hn(a,t){let{windows:e,on_time:n,minutes_saved:i,kwh:r}=a.solar;if(e===0)return o(t,"solar.none");let s=a.solar_aware?"did":"would",c=o(t,`solar.${s}`,{on_time:n,windows:e});i!==0&&(c+=o(t,`solar.${s}_${i>0?"less":"more"}`,{minutes:Math.abs(i)}),r!==null&&(c+=o(t,"solar.kwh",{kwh:f(Math.abs(r),t,1)}))),c+=".";let{solar_windows:l,solar_on_time:p}=a.solar;return l>0&&(c+=o(t,"solar.applied",{applied:l,on_time:p})),c}var I=300,F=1440;function Ae(a,t){let e=new Date(a),n=new Intl.DateTimeFormat("en-GB",{timeZone:t,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(e).reduce((i,r)=>({...i,[r.type]:r.value}),{});return{day:j(e,t),minutes:Number(n.hour)*60+Number(n.minute)}}function Gt(a,t){let e=a.week;if(!a.is_admin||!e)return;let n=o(t.language,"week.days").split(","),i=n.map((l,p)=>Mn(e.monday,p)),r=a.members.map(l=>On(l,i,t.language,t.hour24??!0)),s=i.map((l,p)=>r.reduce((h,m)=>{let _=m.cells[p];return _&&!_.away?h+_.times.length:h},0)),c=Math.max(0,...s);return{days:i.map((l,p)=>({key:l,label:n[p]??l,today:l===e.today,bars:Dn(l,e.windows,t.timeZone)})),hours:[6,12,18,24].map(l=>({label:ke(l,t.language,t.hour24??!0),at:(l*60-I)/(F-I)})),rows:r,showers:s.reduce((l,p)=>l+p,0),windows:e.windows.length,busiest:c>0?n[s.indexOf(c)]??"":""}}function Mn(a,t){let e=a;for(let n=0;n<t;n+=1)e=ut(e);return e}function Rn(a,t){return a.away.on&&(a.away.until===null||t<=a.away.until)}function On(a,t,e,n){let i=a.ready_times.filter(p=>p.enabled),r=t.map((p,h)=>({times:i.filter(m=>m.weekdays.includes(h)).map(m=>m.time).sort().map(m=>ue(m,e,n)),away:Rn(a,p)})),s=r.every(p=>p.away),c=r.reduce((p,h)=>p+h.times.length,0),l=o(e,"week.per_week",{count:c});return s?l=o(e,"week.away"):a.virtual&&(l=o(e,"week.virtual",{count:c})),{id:a.id,name:a.name,colour:a.colour,initial:a.virtual?"\u2605":a.name[0]??"?",away:s,note:l,cells:r}}function Dn(a,t,e){let n=F-I,i=[];for(let r of t){let s=Ae(r.start,e),c=Ae(r.end,e);if(s.day>a||c.day<a)continue;let l=Math.max(I,s.day<a?0:s.minutes),p=Math.min(F,c.day>a?F:c.minutes);p>l&&i.push({from:(l-I)/n,length:(p-l)/n})}return i}function Yt(a,t){let e=a.cluster_warning;return e?o(t.language,"cluster.warning",{when:ce(e.at,t),needed:f(e.needed,t.language,0),cap:f(e.cap,t.language,1)}):""}var Pn=W`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/></svg>`,In=W`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>`,G="hot-water-ready-card",Ie=38,Qt=2*Math.PI*Ie,Ne=class extends S{constructor(){super(...arguments);this._missing=!1;this._settingsOpen=!1;this._offOpen=!1;this._holding=!1;this._held=!1;this._tab="people";this._error="";this._recalc={busy:!1,line:""};this._subscription=new le(e=>{this._heater=e,this._missing=!1,e.settings?.rate.manual===this._rateDraft&&(this._rateDraft=void 0)},()=>{this._missing=!0});this._holdEnd=()=>{window.clearTimeout(this._holdTimer),this._holding=!1}}static{this.properties={hass:{attribute:!1},_config:{state:!0},_heater:{state:!0},_missing:{state:!0},_selected:{state:!0},_sheet:{state:!0},_clock:{state:!0},_settingsOpen:{state:!0},_offOpen:{state:!0},_keep:{state:!0},_holding:{state:!0},_tab:{state:!0},_focus:{state:!0},_error:{state:!0},_rateDraft:{state:!0},_recalc:{state:!0}}}static async getStubConfig(e){let n=(await $e(e))[0];return n?{type:`custom:${G}`,entry_id:n.entry_id}:{type:`custom:${G}`}}setConfig(e){this._config=e}getCardSize(){return 6}get _language(){return this.hass?.locale?.language??this.hass?.language??"en"}get _hour24(){return lt(this.hass?.locale?.time_format,this._language)}get _context(){return{language:this._language,timeZone:this.hass?.config?.time_zone??Intl.DateTimeFormat().resolvedOptions().timeZone,now:new Date,people:ht(this.hass?.states),hour24:this._hour24}}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._subscription.stop()}updated(e){(e.has("hass")||e.has("_config"))&&this._follow(),e.has("_offOpen")&&this._offOpen&&this.renderRoot.querySelector(".off-keep")?.focus(),e.has("_keep")&&this._keep&&!e.get("_keep")&&this.renderRoot.querySelector(".keep-chip.on")?.focus()}_follow(){this.hass&&this._config&&this.isConnected&&this._subscription.follow(this.hass,this._config.entry_id)}async _call(e){if(!this.hass||!this._heater)return!1;this._error="";try{return await this.hass.callWS({entry_id:this._heater.entry_id,...e}),!0}catch(n){let i=(n instanceof Error,n.message);return this._error=o(this._language,"card.error",{message:i??String(n)}),!1}}async _save(e){let n=this._sheet;if(!n||!Ee(n))return;await this._call({...n.id?{type:"hot_water_ready/ready_time/update",ready_time_id:n.id}:{type:"hot_water_ready/ready_time/add"},member_id:e.id,time:n.time,weekdays:[...n.weekdays].sort()})&&(this._sheet=void 0)}async _remove(e,n){await this._call({type:"hot_water_ready/ready_time/remove",member_id:e.id,ready_time_id:n})&&(this._sheet=void 0)}render(){let e=this._language;if(this._missing)return d`<ha-card><div class="message">${o(e,"card.no_heater")}</div></ha-card>`;let n=this._heater;if(!n)return d`<ha-card><div class="message">${o(e,"card.loading")}</div></ha-card>`;let i=K(n),r=_t(n,this._selected),s=Gt(n,this._context);return d`
      <ha-card>
        ${Wt(n,e).map(c=>d`<div class="banner fault" role="alert">${c}</div>`)}
        ${n.automatic?u:d`<div class="banner manual">${o(e,"manual")}</div>`}
        ${n.cluster_warning?d`<div class="banner warning" role="alert">${Yt(n,this._context)}</div>`:u}
        ${this._renderTop(n)}
        ${this._renderSettings(n)}
        ${this._renderTabs(n)}
        ${s&&this._tab==="week"?this._renderWeek(s):d`
              ${i==="member"?d`<div class="greeting">${Mt(n,e)}</div>`:this._renderAvatars(n,r)}
              ${i==="member"&&r?this._renderToday(n,r):u}
              ${r?d`<div class="panel">${this._renderListHead(r,i==="member")} ${this._renderList(r)}</div>
                    ${this._sheet?this._renderSheet(r,this._sheet):u}
                    ${this._sheet&&this._clock?this._renderClock(this._clock):u}`:d`<div class="message">${o(e,"members.none")}</div>`}
            `}
        ${this._error?d`<div class="error" role="alert">${this._error}</div>`:u}
        ${this._offOpen?this._renderSwitchOff(n):u}
        ${this._keep?this._renderKeepHot(n,this._keep):u}
      </ha-card>
    `}_renderListHead(e,n){let i=this._language,r=Ot(e,i),s=Dt(e,this._context),c=(l,p)=>this._call({type:"hot_water_ready/away/set",member_id:e.id,away:l,until:p});return d`
      <div class="list-head">
        <div class="list-title">
          <span>${n?o(i,"list.mine"):r.name}</span>
          ${n?u:d`<span class="hint">${r.note}</span>`}
        </div>
        ${e.can_edit?d`<label class="away-toggle">
              ${s||o(i,"away.line")}
              <input
                type="checkbox"
                class="switch"
                .checked=${R(e.away.on)}
                @change=${l=>{c(l.target.checked,null)}}
              />
            </label>`:s?d`<span class="hint">${s}</span>`:u}
      </div>
      ${e.away.on?d`<div class="paused">
            <span>${o(i,"away.paused")}</span>
            ${e.can_edit?d`<label class="until">
                  ${o(i,"away.until_label")}
                  <input
                    type="date"
                    min=${wt(this._context)}
                    .value=${R(e.away.until??"")}
                    @change=${l=>{c(!0,l.target.value||null)}}
                  />
                </label>`:u}
          </div>`:u}
    `}_renderToday(e,n){let i=this._language,r=Rt(e,this._context,n.id);return d`<div class="today">
      <span class="today-label">${o(i,"today.label")}</span>
      ${r.length===0?d`<span>${o(i,"today.nobody")}</span>`:r.map(s=>d`<span
              class="chip ${s.mine?"mine":""}"
              style=${s.mine?"":`--chip: var(--${s.colour}-color, var(--primary-color))`}
              >${s.name} ${s.time}</span
            >`)}
    </div>`}_openIntegration(){history.pushState(null,"","/config/integrations/integration/hot_water_ready"),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_renderTop(e){let n=gt(e,this._context);return d`
      <div class="top">
        <div class="gauge ${n.tone==="heating"?"glowing":""}">
          <span class="pulse"></span>
          <span class="orbit"></span>
          <svg class="ring" viewBox="0 0 92 92" role="img" aria-label="${n.temperature} ${n.target}">
            <circle class="track" cx="46" cy="46" r=${Ie}></circle>
            ${n.fill>0?W`<circle class="fill ${n.tone}" cx="46" cy="46" r=${Ie}
                  stroke-dasharray="${n.fill*Qt} ${Qt}"
                  transform="rotate(-90 46 46)"></circle>`:u}
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
                  aria-label=${o(this._language,"settings.open")}
                  aria-expanded=${this._settingsOpen}
                  @click=${()=>this._settingsOpen=!this._settingsOpen}
                >
                  ⚙
                </button>`:u}
          </div>
          <div class="headline ${n.tone}">${n.headline}</div>
          ${n.subline?d`<div class="subline">${n.subline}</div>`:u}
          ${n.element?d`<div class="subline">${n.element}</div>`:u}
          ${n.keepHot?d`<div class="subline">${n.keepHot}</div>`:u}
        </div>
        <div class="heat-now">
          ${Vt(e)?d`<button class="switch-off-link" @click=${()=>this._offOpen=!0}>
                ${o(this._language,"switch_off.link")}
              </button>`:u}
          ${It(e).map(i=>Nt(i)?d`<button
                    class="keep-more"
                    aria-label=${o(this._language,"keep_hot.more")}
                    title=${o(this._language,"keep_hot.more")}
                    @click=${()=>{this._openKeep(i)}}
                  >
                    ⋯
                  </button>
                  <button
                    class="primary holdable ${this._holding?"holding":""}"
                    @pointerdown=${()=>{this._holdStart(i)}}
                    @pointerup=${this._holdEnd}
                    @pointerleave=${this._holdEnd}
                    @pointercancel=${this._holdEnd}
                    @contextmenu=${r=>{r.preventDefault()}}
                    @click=${()=>{if(this._held){this._held=!1;return}this._call(i.message)}}
                  >
                    ${o(this._language,i.label)}
                  </button>`:d`<button
                  class="primary"
                  @click=${()=>{this._call(i.message)}}
                >
                  ${o(this._language,i.label)}
                </button>`)}
        </div>
      </div>
    `}_holdStart(e){this._held=!1,this._holding=!0,window.clearTimeout(this._holdTimer),this._holdTimer=window.setTimeout(()=>{this._holding=!1,this._held=!0,this._openKeep(e)},Lt)}_openKeep(e){this._heater&&(this._keep={action:e,minutes:this._heater.keep_hot_minutes})}_renderKeepHot(e,n){let i=this._language,r=()=>{this._keep=void 0,this._held=!1};return d`
      <div
        class="off-overlay"
        @click=${s=>{s.target===s.currentTarget&&r()}}
      >
        <div
          class="off-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="keep-title"
          @keydown=${s=>{s.key==="Escape"&&r()}}
        >
          <div class="off-title" id="keep-title">${o(i,"keep_hot.title")}</div>
          <p>${o(i,"keep_hot.hint")}</p>
          <div class="keep-chips" role="radiogroup" aria-labelledby="keep-title">
            ${qt(e,i).map(s=>d`<button
                class="keep-chip ${s.minutes===n.minutes?"on":""}"
                role="radio"
                aria-checked=${s.minutes===n.minutes}
                @click=${()=>this._keep={...n,minutes:s.minutes}}
              >
                ${s.label}
              </button>`)}
          </div>
          <button
            class="keep-start primary"
            @click=${async()=>{await this._call({...n.action.message,keep_minutes:n.minutes})&&r()}}
          >
            ${o(i,n.action.label)}
          </button>
          <button class="off-keep" @click=${r}>${o(i,"keep_hot.cancel")}</button>
        </div>
      </div>
    `}_renderSwitchOff(e){let n=this._language,i=Ut(e,this._context),r=()=>this._offOpen=!1;return d`
      <div class="off-overlay">
        <div
          class="off-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="off-title"
          @keydown=${s=>{s.key==="Escape"&&r()}}
        >
          <div class="off-title" id="off-title">${i.title}</div>
          ${i.lines.map(s=>d`<p>${s}</p>`)}
          <button
            class="off-confirm"
            @click=${async()=>{await this._call({type:zt})&&r()}}
          >
            ${o(n,"switch_off.confirm")}
          </button>
          <button class="off-keep" @click=${r}>${o(n,"switch_off.keep")}</button>
        </div>
      </div>
    `}_renderTabs(e){if(!e.week)return u;let n=i=>d`<button
      class="tab ${this._tab===i?"on":""}"
      role="tab"
      aria-selected=${this._tab===i}
      @click=${()=>this._tab=i}
    >
      ${o(this._language,`tabs.${i}`)}
    </button>`;return d`<div class="tabs" role="tablist">${n("people")}${n("week")}</div>`}_renderWeek(e){let n=this._language,i=this._focus;return d`
      <div class="week">
        <div class="totals">
          <div><b>${e.showers}</b><span>${o(n,"week.showers")}</span></div>
          <div><b>${e.windows}</b><span>${o(n,"week.windows")}</span></div>
          <div><b>${e.busiest||"-"}</b><span>${o(n,"week.busiest")}</span></div>
        </div>
        <div class="grid">
          <span></span>
          ${e.days.map(r=>d`<span class="head ${r.today?"is-today":""}">${r.label}</span>`)}
          ${e.rows.map(r=>d`
              <button
                class="who ${r.away?"away":""} ${i&&i!==r.id?"dim":""}"
                aria-pressed=${i===r.id}
                @click=${()=>this._focus=i===r.id?void 0:r.id}
              >
                <span class="mini" style="background: var(--${r.colour}-color, var(--primary-color))"
                  >${r.initial}</span
                >
                <span class="who-text"><span>${r.name}</span><span class="hint">${r.note}</span></span>
              </button>
              ${r.cells.map((s,c)=>d`<div
                  class="cell ${e.days[c]?.today?"is-today":""} ${i&&i!==r.id?"dim":""}"
                >
                  ${s.times.map(l=>d`<span
                      class="tag ${s.away?"away":""}"
                      style=${s.away?"":`background: var(--${r.colour}-color, var(--primary-color))`}
                      >${l}</span
                    >`)}
                </div>`)}
            `)}
          <span class="heating-label">${o(n,"week.heating")}</span>
          <div class="hours">
            ${e.hours.map(r=>d`<span class="hint" style="top: ${(r.at*100).toFixed(1)}%">${r.label}</span>`)}
          </div>
          ${e.days.map(r=>d`<div class="bar ${r.today?"is-today":""}">
              ${r.bars.map(s=>d`<span
                    class="heat"
                    style="top: ${(s.from*100).toFixed(1)}%; height: max(3px, ${(s.length*100).toFixed(1)}%)"
                  ></span>`)}
            </div>`)}
        </div>
        <div class="hint">${ct(n,this._hour24)}</div>
      </div>
    `}_renderSettings(e){let n=this._language,i=this._settingsOpen?Bt(e,this._context):void 0;if(!i)return u;let r=s=>this._call({type:De,...s});return d`
      <div class="sheet settings" role="dialog" aria-label=${o(n,"settings.open")}>
        <div class="sheet-head">
          <div class="sheet-title">${o(n,"settings.open")}</div>
          <button class="secondary" @click=${()=>this._settingsOpen=!1}>
            ${o(n,"settings.close")}
          </button>
        </div>
        ${this._renderStepper(i.target,`${i.target.shown} \xB0C`,o(n,"settings.target"),o(n,"settings.target_hint"),["settings.target_down","settings.target_up"],s=>r({target:s}))}
        ${this._renderStepper(i.margin,`\xB1 ${i.margin.shown}`,o(n,"settings.margin"),i.band,["settings.margin_down","settings.margin_up"],s=>r({margin:s}))}
        <label class="setting">
          <span class="setting-text">
            <span>${o(n,"settings.automatic")}</span>
            <span class="hint">${o(n,"settings.automatic_hint")}</span>
          </span>
          <input
            type="checkbox"
            class="switch"
            .checked=${R(i.automatic)}
            @change=${s=>r({automatic:s.target.checked})}
          />
        </label>
        <div class="setting column">
          <span>${o(n,"settings.switch_off")}</span>
          <div class="people" role="group" aria-label=${o(n,"settings.switch_off")}>
            <span class="hint">${o(n,"settings.switch_off_hint")}</span>
            ${i.people.length===0?d`<span class="hint">${o(n,"settings.no_people")}</span>`:u}
            ${i.people.map(s=>d`<label class="person">
                <input
                  type="checkbox"
                  .checked=${R(s.on)}
                  @change=${c=>{let l=c.target.checked;r({switch_off_people:Zt(i.people,s.id,l)})}}
                />
                ${s.name}
              </label>`)}
            <span class="hint">${o(n,"settings.own_cancel")}</span>
          </div>
        </div>
        ${this._renderRate(e)}
        ${this._renderSolar(i)}
        <button
          class="link"
          @click=${()=>{this._openIntegration()}}
        >
          ${o(n,"settings.more")}</button>
      </div>
    `}_renderStepper(e,n,i,r,s,c){let l=(p,h,m)=>d`<button
      class="step"
      aria-label=${o(this._language,h)}
      ?disabled=${p===null}
      @click=${()=>p===null?void 0:c(p)}
    >
      ${m}
    </button>`;return d`<div class="setting">
      <span class="setting-text"><span>${i}</span><span class="hint">${r}</span></span>
      ${l(e.down,s[0],"\u2212")}
      <span class="value">${n}</span>
      ${l(e.up,s[1],"+")}
    </div>`}_setRate(e){window.clearTimeout(this._rateTimer),this._call({type:De,rate:e}).then(n=>{n||(this._rateDraft=void 0)})}_stepRate(e){this._rateDraft=e,window.clearTimeout(this._rateTimer),this._rateTimer=window.setTimeout(()=>{this._setRate(e)},Ft)}async _recalculate(){let e=this._heater;if(!this.hass||!e||this._recalc.busy)return;let n=this._language;this._recalc={busy:!0,line:""};try{let i=await this.hass.callWS({type:jt,entry_id:e.entry_id}),r=i.learned===null?o(n,"rate.found_too_few",{count:i.runs,needed:e.settings?.rate.min_runs??3}):o(n,"rate.found",{count:i.runs,rate:new Intl.NumberFormat(b(n),{maximumFractionDigits:1}).format(i.learned)});this._recalc={busy:!1,line:r}}catch(i){let r=(i instanceof Error,i.message);this._recalc={busy:!1,line:o(n,"card.error",{message:r??String(i)})}}}_renderRate(e){let n=this._language,i=Kt(e,this._context);if(!i)return u;let r=this._rateDraft,s=r===void 0?i.stepper:Pe(r,n),c=(h,m)=>d`<button
      class=${h===i.fixed?"mode on":"mode"}
      aria-pressed=${h===i.fixed}
      @click=${()=>{h!==i.fixed&&this._setRate(h?i.used:null)}}
    >
      ${o(n,m)}
    </button>`,l=(h,m,_)=>d`<button
      class="step"
      aria-label=${o(n,m)}
      ?disabled=${h===null}
      @click=${()=>{h!==null&&this._stepRate(h)}}
    >
      ${_}
    </button>`,p=r===void 0?i.suggestion:null;return d`<div class="setting column rate">
      <div class="rate-head">
        <span>${o(n,"rate.title")}</span>
        <div class="modes" role="group" aria-label=${o(n,"rate.title")}>
          ${c(!1,"rate.automatic")}${c(!0,"rate.fixed")}
        </div>
      </div>
      ${i.fixed?d`<div class="rate-value">
            ${l(s.down,"rate.down","\u2212")}
            <span class="value">${s.shown}</span>
            ${l(s.up,"rate.up","+")}
            <span class="hint">${o(n,"rate.unit")}</span>
          </div>`:d`<div class="rate-value">
            <span class="rate-big">${i.shown}</span>
            <span class="hint">${o(n,"rate.unit")}</span>
          </div>`}
      <span class="hint">${i.source}</span>
      ${p?d`<div class="rate-suggestion">
            <span class="hint">${p.line}</span>
            <button
              class="link"
              @click=${()=>{this._setRate(p.value)}}
            >
              ${o(n,"rate.use")}
            </button>
          </div>`:u}
      ${i.runs.length?d`<div class="rate-runs" role="list" aria-label=${o(n,"rate.runs")}>
            ${i.runs.map(h=>d`<span class="rate-run" role="listitem"><span class="hint">${h.when}</span><b>${h.rate}</b></span>`)}
          </div>`:u}
      ${i.example?d`<span class="hint">${i.example}</span>`:u}
      ${i.physics?d`<span class="hint">${i.physics}</span>`:u}
      ${i.check?d`<span class=${i.check.warn?"hint rate-warn":"hint"} role=${i.check.warn?"alert":u}
            >${i.check.line}</span
          >`:u}
      <button
        class="recalc secondary"
        ?disabled=${this._recalc.busy}
        @click=${()=>{this._recalculate()}}
      >
        ${o(n,this._recalc.busy?"rate.recalculating":"rate.recalculate")}
      </button>
      ${this._recalc.line?d`<span class="hint" role="status">${this._recalc.line}</span>`:u}
    </div>`}_renderSolar(e){let n=this._language;return d`<div class="setting column solar">
      <span>${o(n,"solar.title")}</span>
      <span class="hint">${e.solar}</span>
      ${e.notes.map(i=>d`<span class="hint">${i}</span>`)}
    </div>`}_renderAvatars(e,n){if(!ft(e))return u;let i=K(e)==="admin";return d`
      <div class="avatars" role="tablist">
        ${Ht(e,n?.id).map(r=>d`
            <button
              class="avatar ${r.selected?"selected":""} ${r.faded?"faded":""}"
              role="tab"
              aria-selected=${r.selected}
              @click=${()=>{this._selected=r.id,this._sheet=void 0}}
            >
              <span class="dot" style="background: var(--${r.colour}-color, var(--primary-color))"
                >${r.initial}${r.star?d`<span class="star">★</span>`:u}</span
              >
              <span class="label">${r.name}</span>
            </button>
          `)}
        ${i?d`<button
              class="avatar add-member"
              @click=${()=>{this._openIntegration()}}
            >
              <span class="dot plus">+</span>
              <span class="label">${o(this._language,"members.add")}</span>
            </button>`:u}
      </div>
    `}_renderList(e){let n=this._language,i=Et(e,n,this._hour24);return d`
      <div class="list ${e.away.on?"paused-list":""}">
        ${i.length===0?d`<div class="empty">${o(n,"list.empty")}</div>`:u}
        ${i.map(r=>d`
            <div class="row ${r.enabled?"":"off"}">
              ${e.can_edit?d`<button
                    class="row-text"
                    aria-label=${o(n,"list.edit")}
                    @click=${()=>{this._sheet=yt(e,r.id),this._clock=void 0}}
                  >
                    ${this._rowText(r)}
                  </button>`:d`<div class="row-text">${this._rowText(r)}</div>`}
              ${e.can_edit?d`
                    <input
                      type="checkbox"
                      class="switch"
                      aria-label=${o(n,"list.switch")}
                      .checked=${R(r.enabled)}
                      @change=${s=>this._call({type:"hot_water_ready/ready_time/update",member_id:e.id,ready_time_id:r.id,enabled:s.target.checked})}
                    />
                  `:u}
            </div>
          `)}
        ${e.can_edit?d`<button
              class="add"
              @click=${()=>{this._sheet=bt(),this._clock=Re(this._sheet.time,!0,this._hour24)}}
            >
              + ${o(n,"list.add")}
            </button>`:u}
      </div>
    `}_rowText(e){return d`<div class="time">${e.time}</div>
      <div class="days">
        ${e.days.map(n=>d`<span class="${n.on?"on":""}">${n.letter}</span>`)}
      </div>`}_renderSheet(e,n){let i=this._language,r=oe(i),s=o(i,n.id?"sheet.edit_title":"sheet.title"),c=l=>{let p=n.weekdays.includes(l)?n.weekdays.filter(h=>h!==l):[...n.weekdays,l];this._sheet={...n,weekdays:p}};return d`
      <div class="sheet" role="dialog" aria-label=${s}>
        <div class="sheet-title">${s}</div>
        <div class="field">
          ${o(i,"sheet.time")}
          <button
            class="sheet-time"
            aria-label=${o(i,"clock.change")}
            @click=${()=>this._clock=Re(n.time,!1,this._hour24)}
          >
            ${ue(n.time,i,this._hour24)}
          </button>
        </div>
        <div class="field">
          ${o(i,"sheet.days")}
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
                ${o(i,"sheet.delete")}
              </button>`:u}
          <button class="secondary" @click=${()=>this._sheet=void 0}>${o(i,"sheet.cancel")}</button>
          <button class="primary" ?disabled=${!Ee(n)} @click=${()=>this._save(e)}>
            ${o(i,"sheet.save")}
          </button>
        </div>
      </div>
    `}_dialAt(e,n){let i=e.currentTarget.getBoundingClientRect(),r=v/i.width;return kt(n,(e.clientX-i.left)*r,(e.clientY-i.top)*r,this._hour24)}_clockDone(e){let n=Oe(e,this._hour24);!n||!this._sheet||(this._sheet={...this._sheet,time:n},this._clock=void 0)}_clockCancel(e){e.fresh&&(this._sheet=void 0),this._clock=void 0}_renderClockInput(e,n,i){let r=o(this._language,n==="hour"?"sheet.hour":"sheet.minute");return d`<label class="clock-box">
      <input
        class="clock-input ${i?"":"invalid"}"
        inputmode="numeric"
        maxlength="2"
        autocomplete="off"
        aria-label=${r}
        .value=${R(n==="hour"?e.hourText:e.minuteText)}
        @input=${s=>{let c=s.target.value;this._clock=n==="hour"?{...e,hourText:c}:{...e,minuteText:c}}}
        @keydown=${s=>{s.key==="Enter"&&this._clockDone(e)}}
      />
      <span>${r}</span>
    </label>`}_renderClock(e){let n=this._language,i=this._hour24,r=e.mode==="keys",s=Oe(e,i)!==void 0,c=o(n,r?"clock.title_keys":"clock.title"),l=i?u:d`<div class="clock-half" role="group">
          ${[!1,!0].map(g=>d`<button
                class=${e.hour>=12===g?"on":""}
                aria-pressed=${e.hour>=12===g}
                @click=${()=>this._clock=At(e,g)}
              >
                ${o(n,g?"clock.pm":"clock.am")}
              </button>`)}
        </div>`,p=r?d`<div class="clock-head">
            ${this._renderClockInput(e,"hour",s)}
            <span class="clock-colon">:</span>
            ${this._renderClockInput(e,"minute",s)} ${l}
          </div>
          ${s?u:d`<div class="clock-invalid" role="alert">${o(n,"clock.invalid")}</div>`}`:d`<div class="clock-head">
          ${["hour","minute"].map((g,x)=>d`${x?d`<span class="clock-colon">:</span>`:u}
                <button
                  class="clock-part ${e.part===g?"on":""}"
                  aria-pressed=${e.part===g}
                  aria-label=${o(n,g==="hour"?"sheet.hour":"sheet.minute")}
                  @click=${()=>this._clock={...e,part:g}}
                >
                  ${g==="hour"?e.hourText:e.minuteText}
                </button>`)}
          ${l}
        </div>`,h=$t(e,i),m=v/2,_=r?u:d`<svg
          class="dial"
          viewBox="0 0 ${v} ${v}"
          role="slider"
          tabindex="0"
          aria-label=${o(n,e.part==="hour"?"sheet.hour":"sheet.minute")}
          aria-valuenow=${e.part==="hour"?e.hour:e.minute}
          aria-valuetext=${e.part==="hour"?e.hourText:e.minuteText}
          @pointerdown=${g=>{g.currentTarget.setPointerCapture(g.pointerId),this._clock=this._dialAt(g,e)}}
          @pointermove=${g=>{g.currentTarget.hasPointerCapture(g.pointerId)&&(this._clock=this._dialAt(g,this._clock??e))}}
          @pointerup=${()=>{this._clock?.part==="hour"&&(this._clock={...this._clock,part:"minute"})}}
          @keydown=${g=>{let x={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1}[g.key];x!==void 0&&(g.preventDefault(),this._clock=St(e,x,i))}}
        >
          <circle class="dial-face" cx=${m} cy=${m} r=${m} />
          <line class="dial-hand" x1=${m} y1=${m} x2=${h.x} y2=${h.y} />
          <circle class="dial-hand-dot" cx=${m} cy=${m} r="4" />
          <circle class="dial-knob" cx=${h.x} cy=${h.y} r="20" />
          ${vt(e.part,i).map(g=>W`<text class="dial-mark ${xt(e,g,i)?"on":""}" x=${g.x} y=${g.y}>${g.label}</text>`)}
        </svg>`;return d`
      <div
        class="clock-overlay"
        @click=${g=>{g.target===g.currentTarget&&this._clockCancel(e)}}
      >
        <div class="clock-dialog" role="dialog" aria-modal="true" aria-label=${c}>
          <div class="clock-title">${c}</div>
          ${p} ${_}
          <div class="clock-actions">
            <button
              class="clock-mode"
              aria-label=${o(n,r?"clock.to_dial":"clock.to_keys")}
              title=${o(n,r?"clock.to_dial":"clock.to_keys")}
              @click=${()=>this._clock=Tt(e,i)}
            >
              ${r?In:Pn}
            </button>
            <button
              class="clock-text"
              @click=${()=>{this._clockCancel(e)}}
            >
              ${o(n,"sheet.cancel")}
            </button>
            <button
              class="clock-text"
              ?disabled=${!s}
              @click=${()=>{this._clockDone(e)}}
            >
              ${o(n,"clock.ok")}
            </button>
          </div>
        </div>
      </div>
    `}static{this.styles=he`
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
    .rate-head {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 6px 10px;
    }
    .modes {
      display: inline-flex;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
    }
    .mode {
      min-height: 32px;
      padding: 0 12px;
      border: 0;
      background: none;
      color: var(--secondary-text-color);
      font-weight: 700;
    }
    .mode.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .rate-value,
    .rate-suggestion {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .rate-warn {
      color: var(--warning-color, #ffa600);
    }
    .rate-big {
      font-size: 28px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .rate-runs {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .rate-run {
      display: inline-flex;
      gap: 6px;
      align-items: baseline;
      padding: 4px 8px;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      font-variant-numeric: tabular-nums;
    }
    .recalc {
      align-self: flex-start;
      min-height: 36px;
      padding: 0 14px;
      border: 0;
      border-radius: 10px;
      font-weight: 700;
    }
    .recalc[disabled] {
      opacity: 0.6;
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
  `}};if(!customElements.get(G)){customElements.define(G,Ne);let a=window;a.customCards=a.customCards??[],a.customCards.push({type:G,name:"Hot Water Ready",description:"Water temperature, ready times and heat now.",preview:!0})}export{Ne as HotWaterReadyCard};
