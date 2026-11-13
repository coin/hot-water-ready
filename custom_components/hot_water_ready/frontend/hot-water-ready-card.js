var Q=globalThis,J=Q.ShadowRoot&&(Q.ShadyCSS===void 0||Q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,he=Symbol(),We=new WeakMap,O=class{constructor(t,e,a){if(this._$cssResult$=!0,a!==he)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(J&&t===void 0){let a=e!==void 0&&e.length===1;a&&(t=We.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),a&&We.set(e,t))}return t}toString(){return this.cssText}},Ue=n=>new O(typeof n=="string"?n:n+"",void 0,he),ge=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((a,i,r)=>a+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new O(e,n,he)},Be=(n,t)=>{if(J)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let a=document.createElement("style"),i=Q.litNonce;i!==void 0&&a.setAttribute("nonce",i),a.textContent=e.cssText,n.appendChild(a)}},fe=J?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let a of t.cssRules)e+=a.cssText;return Ue(e)})(n):n;var{is:Sa,defineProperty:Ta,getOwnPropertyDescriptor:ja,getOwnPropertyNames:Ma,getOwnPropertySymbols:Ha,getPrototypeOf:Ea}=Object,Y=globalThis,Fe=Y.trustedTypes,Ra=Fe?Fe.emptyScript:"",Pa=Y.reactiveElementPolyfillSupport,D=(n,t)=>n,_e={toAttribute(n,t){switch(t){case Boolean:n=n?Ra:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},Ge=(n,t)=>!Sa(n,t),Ke={attribute:!0,type:String,converter:_e,reflect:!1,useDefault:!1,hasChanged:Ge};Symbol.metadata??=Symbol("metadata"),Y.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ke){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let a=Symbol(),i=this.getPropertyDescriptor(t,a,e);i!==void 0&&Ta(this.prototype,t,i)}}static getPropertyDescriptor(t,e,a){let{get:i,set:r}=ja(this.prototype,t)??{get(){return this[e]},set(s){this[e]=s}};return{get:i,set(s){let c=i?.call(this);r?.call(this,s),this.requestUpdate(t,c,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ke}static _$Ei(){if(this.hasOwnProperty(D("elementProperties")))return;let t=Ea(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(D("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(D("properties"))){let e=this.properties,a=[...Ma(e),...Ha(e)];for(let i of a)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[a,i]of e)this.elementProperties.set(a,i)}this._$Eh=new Map;for(let[e,a]of this.elementProperties){let i=this._$Eu(e,a);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let a=new Set(t.flat(1/0).reverse());for(let i of a)e.unshift(fe(i))}else t!==void 0&&e.push(fe(t));return e}static _$Eu(t,e){let a=e.attribute;return a===!1?void 0:typeof a=="string"?a:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let a of e.keys())this.hasOwnProperty(a)&&(t.set(a,this[a]),delete this[a]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Be(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,a){this._$AK(t,a)}_$ET(t,e){let a=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,a);if(i!==void 0&&a.reflect===!0){let r=(a.converter?.toAttribute!==void 0?a.converter:_e).toAttribute(e,a.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let a=this.constructor,i=a._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=a.getPropertyOptions(i),s=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:_e;this._$Em=i;let c=s.fromAttribute(e,r.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,a,i=!1,r){if(t!==void 0){let s=this.constructor;if(i===!1&&(r=this[t]),a??=s.getPropertyOptions(t),!((a.hasChanged??Ge)(r,e)||a.useDefault&&a.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,a))))return;this.C(t,e,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:a,reflect:i,wrapped:r},s){a&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),r!==!0||s!==void 0)||(this._$AL.has(t)||(this.hasUpdated||a||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let a=this.constructor.elementProperties;if(a.size>0)for(let[i,r]of a){let{wrapped:s}=r,c=this[i];s!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,r,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(a=>a.hostUpdate?.()),this.update(e)):this._$EM()}catch(a){throw t=!1,this._$EM(),a}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[D("elementProperties")]=new Map,x[D("finalized")]=new Map,Pa?.({ReactiveElement:x}),(Y.reactiveElementVersions??=[]).push("2.1.2");var ve=globalThis,Ze=n=>n,X=ve.trustedTypes,Qe=X?X.createPolicy("lit-html",{createHTML:n=>n}):void 0,ke="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,be="?"+C,qa=`<${be}>`,T=document,L=()=>T.createComment(""),V=n=>n===null||typeof n!="object"&&typeof n!="function",ye=Array.isArray,at=n=>ye(n)||typeof n?.[Symbol.iterator]=="function",we=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Je=/-->/g,Ye=/>/g,A=RegExp(`>|${we}(?:([^\\s"'>=/]+)(${we}*=${we}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xe=/'/g,et=/"/g,nt=/^(?:script|style|textarea|title)$/i,xe=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),l=xe(1),W=xe(2),wn=xe(3),w=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),tt=new WeakMap,S=T.createTreeWalker(T,129);function it(n,t){if(!ye(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Qe!==void 0?Qe.createHTML(t):t}var rt=(n,t)=>{let e=n.length-1,a=[],i,r=t===2?"<svg>":t===3?"<math>":"",s=N;for(let c=0;c<e;c++){let d=n[c],m,p,h=-1,_=0;for(;_<d.length&&(s.lastIndex=_,p=s.exec(d),p!==null);)_=s.lastIndex,s===N?p[1]==="!--"?s=Je:p[1]!==void 0?s=Ye:p[2]!==void 0?(nt.test(p[2])&&(i=RegExp("</"+p[2],"g")),s=A):p[3]!==void 0&&(s=A):s===A?p[0]===">"?(s=i??N,h=-1):p[1]===void 0?h=-2:(h=s.lastIndex-p[2].length,m=p[1],s=p[3]===void 0?A:p[3]==='"'?et:Xe):s===et||s===Xe?s=A:s===Je||s===Ye?s=N:(s=A,i=void 0);let g=s===A&&n[c+1].startsWith("/>")?" ":"";r+=s===N?d+qa:h>=0?(a.push(m),d.slice(0,h)+ke+d.slice(h)+C+g):d+C+(h===-2?c:g)}return[it(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),a]},I=class n{constructor({strings:t,_$litType$:e},a){let i;this.parts=[];let r=0,s=0,c=t.length-1,d=this.parts,[m,p]=rt(t,e);if(this.el=n.createElement(m,a),S.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=S.nextNode())!==null&&d.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(ke)){let _=p[s++],g=i.getAttribute(h).split(C),y=/([.?@])?(.*)/.exec(_);d.push({type:1,index:r,name:y[2],strings:g,ctor:y[1]==="."?te:y[1]==="?"?ae:y[1]==="@"?ne:M}),i.removeAttribute(h)}else h.startsWith(C)&&(d.push({type:6,index:r}),i.removeAttribute(h));if(nt.test(i.tagName)){let h=i.textContent.split(C),_=h.length-1;if(_>0){i.textContent=X?X.emptyScript:"";for(let g=0;g<_;g++)i.append(h[g],L()),S.nextNode(),d.push({type:2,index:++r});i.append(h[_],L())}}}else if(i.nodeType===8)if(i.data===be)d.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf(C,h+1))!==-1;)d.push({type:7,index:r}),h+=C.length-1}r++}}static createElement(t,e){let a=T.createElement("template");return a.innerHTML=t,a}};function j(n,t,e=n,a){if(t===w)return t;let i=a!==void 0?e._$Co?.[a]:e._$Cl,r=V(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,e,a)),a!==void 0?(e._$Co??=[])[a]=i:e._$Cl=i),i!==void 0&&(t=j(n,i._$AS(n,t.values),i,a)),t}var ee=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:a}=this._$AD,i=(t?.creationScope??T).importNode(e,!0);S.currentNode=i;let r=S.nextNode(),s=0,c=0,d=a[0];for(;d!==void 0;){if(s===d.index){let m;d.type===2?m=new R(r,r.nextSibling,this,t):d.type===1?m=new d.ctor(r,d.name,d.strings,this,t):d.type===6&&(m=new ie(r,this,t)),this._$AV.push(m),d=a[++c]}s!==d?.index&&(r=S.nextNode(),s++)}return S.currentNode=T,i}p(t){let e=0;for(let a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(t,a,e),e+=a.strings.length-2):a._$AI(t[e])),e++}},R=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,a,i){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=a,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=j(this,t,e),V(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==w&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):at(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&V(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:a}=t,i=typeof a=="number"?this._$AC(t):(a.el===void 0&&(a.el=I.createElement(it(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new ee(i,this),s=r.u(this.options);r.p(e),this.T(s),this._$AH=r}}_$AC(t){let e=tt.get(t.strings);return e===void 0&&tt.set(t.strings,e=new I(t)),e}k(t){ye(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,a,i=0;for(let r of t)i===e.length?e.push(a=new n(this.O(L()),this.O(L()),this,this.options)):a=e[i],a._$AI(r),i++;i<e.length&&(this._$AR(a&&a._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let a=Ze(t).nextSibling;Ze(t).remove(),t=a}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,a,i,r){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=u}_$AI(t,e=this,a,i){let r=this.strings,s=!1;if(r===void 0)t=j(this,t,e,0),s=!V(t)||t!==this._$AH&&t!==w,s&&(this._$AH=t);else{let c=t,d,m;for(t=r[0],d=0;d<r.length-1;d++)m=j(this,c[a+d],e,d),m===w&&(m=this._$AH[d]),s||=!V(m)||m!==this._$AH[d],m===u?t=u:t!==u&&(t+=(m??"")+r[d+1]),this._$AH[d]=m}s&&!i&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},te=class extends M{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},ae=class extends M{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},ne=class extends M{constructor(t,e,a,i,r){super(t,e,a,i,r),this.type=5}_$AI(t,e=this){if((t=j(this,t,e,0)??u)===w)return;let a=this._$AH,i=t===u&&a!==u||t.capture!==a.capture||t.once!==a.once||t.passive!==a.passive,r=t!==u&&(a===u||i);i&&this.element.removeEventListener(this.name,this,a),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ie=class{constructor(t,e,a){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(t){j(this,t)}},st={M:ke,P:C,A:be,C:1,L:rt,R:ee,D:at,V:j,I:R,H:M,N:ae,U:ne,B:te,F:ie},Oa=ve.litHtmlPolyfillSupport;Oa?.(I,R),(ve.litHtmlVersions??=[]).push("3.3.3");var ot=(n,t,e)=>{let a=e?.renderBefore??t,i=a._$litPart$;if(i===void 0){let r=e?.renderBefore??null;a._$litPart$=i=new R(t.insertBefore(L(),r),r,void 0,e??{})}return i._$AI(n),i};var Ce=globalThis,$=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ot(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return w}};$._$litElement$=!0,$.finalized=!0,Ce.litElementHydrateSupport?.({LitElement:$});var Da=Ce.litElementPolyfillSupport;Da?.({LitElement:$});(Ce.litElementVersions??=[]).push("4.2.2");var H={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},lt=n=>(...t)=>({_$litDirective$:n,values:t}),re=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,a){this._$Ct=t,this._$AM=e,this._$Ci=a}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:En}=st;var dt=n=>n.strings===void 0;var Na={},ct=(n,t=Na)=>n._$AH=t;var z=lt(class extends re{constructor(n){if(super(n),n.type!==H.PROPERTY&&n.type!==H.ATTRIBUTE&&n.type!==H.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!dt(n))throw Error("`live` bindings can only contain a single expression")}render(n){return n}update(n,[t]){if(t===w||t===u)return t;let e=n.element,a=n.name;if(n.type===H.PROPERTY){if(t===e[a])return w}else if(n.type===H.BOOLEAN_ATTRIBUTE){if(!!t===e.hasAttribute(a))return w}else if(n.type===H.ATTRIBUTE&&e.getAttribute(a)===t+"")return w;return ct(n),t}});var ut={"status.waiting":"Ne\u010Dinn\xFD","status.heating":"Oh\u0159\xEDv\xE1","status.ready":"P\u0159ipraveno","status.fault":"Porucha","status.manual":"Ru\u010Dn\u011B","headline.heating_for":"Oh\u0159\xEDv\xE1: p\u0159ipraveno asi za {minutes} min","headline.ready_at":"P\u0159ipraveno: {when}","subline.next_at":"Dal\u0161\xED: {when}","when.today":"{time}","when.tomorrow":"z\xEDtra {time}","when.weekday":"{weekday} {time}","ring.target":"c\xEDl {target}\xB0","weekday.letters":"Po,\xDAt,St,\u010Ct,P\xE1,So,Ne","members.none":"Zat\xEDm \u017E\xE1dn\xED \u010Dlenov\xE9. P\u0159id\xE1v\xE1 je spr\xE1vce v nastaven\xED integrace.","list.empty":"Zat\xEDm \u017E\xE1dn\xE9 \u010Dasy p\u0159ipravenosti.","list.add":"P\u0159idat \u010Das p\u0159ipravenosti","sheet.delete":"Smazat","list.switch":"Zapnout nebo vypnout","sheet.title":"Nov\xFD \u010Das p\u0159ipravenosti","sheet.edit_title":"Zm\u011Bnit \u010Das p\u0159ipravenosti","list.edit":"Zm\u011Bnit tento \u010Das p\u0159ipravenosti","sheet.time":"\u010Cas","sheet.hour":"Hodina","sheet.minute":"Minuta","sheet.days":"Dny","sheet.save":"Ulo\u017Eit","sheet.cancel":"Zru\u0161it","clock.title":"Vyberte \u010Das","clock.title_keys":"Zadejte \u010Das","clock.ok":"OK","clock.to_keys":"Napsat \u010Das","clock.to_dial":"Pou\u017E\xEDt hodiny","clock.am":"AM","clock.pm":"PM","clock.invalid":"Zadejte platn\xFD \u010Das","clock.change":"Zm\u011Bnit \u010Das","fault.sensor_unavailable":"Porucha: senzor teploty vody ned\xE1v\xE1 hodnoty. Oh\u0159ev se zastavil.","fault.not_rising":"Porucha: voda se neoh\u0159\xEDv\xE1. Oh\u0159ev se zastavil; viz Opravy.","fault.no_consumption":"Porucha: oh\u0159\xEDva\u010D neodeb\xEDr\xE1 \u017E\xE1dn\xFD proud. Oh\u0159ev se zastavil; viz Opravy.","fault.relay_stuck":"Porucha: oh\u0159\xEDva\u010D odeb\xEDr\xE1 proud, i kdy\u017E je vypnut\xFD. Zkontrolujte rel\xE9.","fault.top_probe":"Upozorn\u011Bn\xED: hlavn\xED \u010Didlo je mo\u017En\xE1 uvoln\u011Bn\xE9. Oh\u0159ev pokra\u010Duje; viz Opravy.","fault.middle_probe":"Upozorn\u011Bn\xED: druh\xE9 \u010Didlo je mo\u017En\xE1 uvoln\u011Bn\xE9. Oh\u0159ev pokra\u010Duje; viz Opravy.","fault.probes_disagree":"Upozorn\u011Bn\xED: ob\u011B \u010Didla si odporuj\xED. Oh\u0159ev pokra\u010Duje; viz Opravy.","element.on":"Oh\u0159\xEDva\u010D zapnut\xFD","element.off":"Oh\u0159\xEDva\u010D vypnut\xFD","element.drawing":"{state} \xB7 odeb\xEDr\xE1 {watts} W","keep_hot.until":"Udr\u017Euje teplou do {time}","keep_hot.title":"Udr\u017Eovat teplou, a\u017E bude p\u0159ipraven\xE1","keep_hot.hint":"Po zpr\xE1v\u011B \u201Ep\u0159ipraveno\u201C oh\u0159\xEDva\u010D udr\u017Euje vodu teplou po tuto dobu a pak se vypne.","keep_hot.more":"Zvolte, jak dlouho ji udr\u017Eovat teplou","keep_hot.cancel":"Zru\u0161it","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h","heat_now_target.title":"Teplota","heat_now_target.hint":"Jen pro tento po\u017Eadavek; oh\u0159\xEDva\u010D z\u016Fst\xE1v\xE1 na {target} \xB0C.","heat_now_target.down":"O 1 \xB0C m\xE9n\u011B","heat_now_target.up":"O 1 \xB0C v\xEDce",manual:"Automatick\xE9 \u0159\xEDzen\xED je vypnut\xE9: oh\u0159\xEDva\u010D se ovl\xE1d\xE1 ru\u010Dn\u011B.","note.not_rising_skipped":"Termostat nehl\xE1s\xED, kdy top\xED, tak\u017Ee kontroly \u201Evoda se neoh\u0159\xEDv\xE1\u201C a \u201Eoh\u0159\xEDva\u010D neodeb\xEDr\xE1 \u017E\xE1dn\xFD proud\u201C se neprov\xE1d\u011Bj\xED.","heat_now.start":"Oh\u0159\xE1t hned","heat_now.cancel":"Zru\u0161it","heat_now.join":"Dejte mi v\u011Bd\u011Bt, a\u017E bude tepl\xE1","heat_now.leave":"Ned\xE1vat mi v\u011Bd\u011Bt","subline.for":"Pro: {list}.","item.at":"{name} v {time}","switch_off.link":"Vypnout oh\u0159ev\u2026","switch_off.title":"Vypnout oh\u0159ev?","switch_off.confirm":"Vypnout","switch_off.keep":"Zru\u0161it","switch_off.asked_one":"U\u017E nedostane zpr\xE1vu: {names}.","switch_off.asked_many":"U\u017E nedostanou zpr\xE1vu: {names}.","switch_off.skipped_one":"Bez tepl\xE9 vody: {list}.","switch_off.skipped_many":"Bez tepl\xE9 vody: {list}.","switch_off.back":"P\u0159ed dal\u0161\xEDm \u010Dasem p\u0159ipravenosti se zapne s\xE1m.","switch_off.nobody":"Oh\u0159ev se te\u010F zastav\xED.","settings.switch_off":"Kdo sm\xED vypnout oh\u0159ev pro v\u0161echny","settings.switch_off_hint":"Spr\xE1vci a:","settings.own_cancel":"Kdo o oh\u0159ev po\u017E\xE1dal, m\u016F\u017Ee sv\u016Fj po\u017Eadavek v\u017Edy zru\u0161it.",greeting:"Ahoj, {name}","today.label":"Dom\xE1cnost dnes","today.nobody":"Dnes nikdo","away.until_label":"Do (voliteln\xE9)","away.line":"Pry\u010D","away.line_until":"Pry\u010D do {date}","members.add":"\u010Clen","card.no_heater":"Zat\xEDm nen\xED nastaven\xFD \u017E\xE1dn\xFD oh\u0159\xEDva\u010D Hot Water Ready.","card.loading":"Na\u010D\xEDt\xE1n\xED\u2026","card.error":"Nepovedlo se: {message}","cluster.warning":"Sprchy od {when} pot\u0159ebuj\xED vodu o teplot\u011B {needed} \xB0C, ale oh\u0159\xEDva\u010D oh\u0159\xEDv\xE1 jen na {cap} \xB0C: posledn\xED m\u016F\u017Eou b\xFDt chladn\u011Bj\u0161\xED.","tabs.people":"Lid\xE9","tabs.week":"T\xFDden","week.days":"Po,\xDAt,St,\u010Ct,P\xE1,So,Ne","week.showers":"sprchy","week.windows":"okna oh\u0159evu","week.busiest":"nejru\u0161n\u011Bj\u0161\xED den","week.heating":"Oh\u0159ev","week.away":"pry\u010D","week.virtual":"virtu\xE1ln\xED \xB7 {count}","week.per_week":"{count} t\xFDdn\u011B","week.hint":"Klepnut\xEDm na osobu zv\xFDrazn\xEDte jej\xED \u010Dasy. Pruhy ukazuj\xED, kdy m\u016F\u017Ee oh\u0159\xEDva\u010D ka\u017Ed\xFD den oh\u0159\xEDvat ({start} a\u017E {end}).","settings.open":"Nastaven\xED oh\u0159\xEDva\u010De","settings.close":"Zav\u0159\xEDt","settings.target":"C\xEDlov\xE1 teplota","settings.target_hint":"P\u0159ipraveno, kdy\u017E voda dos\xE1hne t\xE9to teploty","settings.target_down":"Sn\xED\u017Eit c\xEDlovou teplotu","settings.target_up":"Zv\xFD\u0161it c\xEDlovou teplotu","settings.margin":"Rezerva","settings.band":"Vypne p\u0159i {stop} \xB0C, znovu zapne p\u0159i {restart} \xB0C","settings.margin_down":"Sn\xED\u017Eit rezervu","settings.margin_up":"Zv\xFD\u0161it rezervu","settings.automatic":"Automatick\xE9 \u0159\xEDzen\xED","settings.automatic_hint":"Vypnuto: oh\u0159\xEDva\u010D se ovl\xE1d\xE1 ru\u010Dn\u011B","settings.more":"Dal\u0161\xED nastaven\xED","rate.title":"Rychlost oh\u0159evu","rate.unit":"min na \xB0C","rate.automatic":"Automaticky","rate.fixed":"Pevn\u011B","rate.learned":"Nau\u010Deno: medi\xE1n \u010Dist\xFDch oh\u0159ev\u016F (po\u010Det: {count}) za posledn\xEDch {days} dn\xED","rate.default_one":"V\xFDchoz\xED hodnota: je\u0161t\u011B 1 \u010Dist\xFD oh\u0159ev za posledn\xEDch {days} dn\xED a hodnota se nau\u010D\xED","rate.default_many":"V\xFDchoz\xED hodnota: je\u0161t\u011B chyb\xED \u010Dist\xE9 oh\u0159evy za posledn\xEDch {days} dn\xED (po\u010Det: {count}), pak se hodnota nau\u010D\xED","rate.manual":"Nastaveno ru\u010Dn\u011B: u\u010Den\xED pokra\u010Duje, ale nepou\u017E\xEDv\xE1 se","rate.runs":"\u010Cist\xE9 oh\u0159evy, ze kter\xFDch vych\xE1z\xED","rate.example":"Te\u010F {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} min, plus {margin} min rezerva: za\u010Dne {lead} min p\u0159edem","rate.example_cap":" (maximum)","rate.example_warm":"Te\u010F {from} \xB0C: c\xEDlov\xE1 teplota u\u017E je dosa\u017Een\xE1, nen\xED t\u0159eba za\u010D\xEDnat d\u0159\xEDv","rate.physics":"Podle fyziky, cel\xFD z\xE1sobn\xEDk oh\u0159\xEDvan\xFD t\u011Blesem: {rate} min/\xB0C","rate.physics_range":"Podle fyziky: mezi {fast} min/\xB0C (jen voda nad t\u011Blesem) a {slow} min/\xB0C (cel\xFD z\xE1sobn\xEDk)","rate.volume":"Odpov\xEDd\xE1 oh\u0159evu {litres} L z {tank} L z\xE1sobn\xEDku","rate.far_below":": o {percent} % pod fyzikou. Zkontrolujte objem z\xE1sobn\xEDku, p\u0159\xEDkon t\u011Blesa a um\xEDst\u011Bn\xED \u010Didla.","rate.far_above":": o {percent} % nad fyzikou. Zkontrolujte objem z\xE1sobn\xEDku, p\u0159\xEDkon t\u011Blesa a um\xEDst\u011Bn\xED \u010Didla.","rate.suggested_learned":"Navr\u017Eeno: {rate} (nau\u010Deno)","rate.suggested_physics":"Navr\u017Eeno: {rate} (fyzika z\xE1sobn\xEDku)","rate.suggested_default":"Navr\u017Eeno: {rate} (v\xFDchoz\xED hodnota)","rate.use":"Pou\u017E\xEDt","rate.down":"O 0,1 min na \xB0C m\xE9n\u011B","rate.up":"O 0,1 min na \xB0C v\xEDce","rate.recalculate":"P\u0159epo\u010D\xEDtat z historie","rate.recalculating":"Proch\xE1z\xED se posledn\xED t\xFDden\u2026","rate.found":"\u010Cist\xE9 oh\u0159evy nalezen\xE9 v historii: {count}; nau\u010Deno {rate} min/\xB0C.","rate.found_too_few":"\u010Cist\xE9 oh\u0159evy nalezen\xE9 v historii: {count}; k nau\u010Den\xED je pot\u0159eba: {needed}.","solar.title":"Sol\xE1rn\xED porovn\xE1n\xED","solar.none":"Za posledn\xEDch 30 dn\xED zat\xEDm nejsou zaznamenan\xE1 \u017E\xE1dn\xE1 okna.","solar.would":"Se zapnut\xFDm pravidlem se zohledn\u011Bn\xEDm slunce by voda byla p\u0159ipraven\xE1 v\u010Das v {on_time} z {windows} oken","solar.did":"S pravidlem se zohledn\u011Bn\xEDm slunce byla voda p\u0159ipraven\xE1 v\u010Das v {on_time} z {windows} oken","solar.would_less":" a oh\u0159\xEDva\u010D by b\u011B\u017Eel o {minutes} min m\xE9n\u011B","solar.would_more":" a oh\u0159\xEDva\u010D by b\u011B\u017Eel o {minutes} min d\xE9le","solar.did_less":" a oh\u0159\xEDva\u010D b\u011B\u017Eel o {minutes} min m\xE9n\u011B","solar.did_more":" a oh\u0159\xEDva\u010D b\u011B\u017Eel o {minutes} min d\xE9le","solar.kwh":", asi {kwh} kWh","solar.applied":" Pravidlo se pou\u017Eilo v {applied} z nich: v\u010Das v {on_time}.","subline.starts_at":"Oh\u0159ev za\u010Dne kolem {when}.","subline.starts_at_solar":"Oh\u0159ev za\u010Dne kolem {when}, pokud to do t\xE9 doby neud\u011Bl\xE1 slunce.","subline.asked_by_one":"Po\u017E\xE1dal(a): {name}. Dostane zpr\xE1vu, a\u017E bude voda p\u0159ipraven\xE1.","subline.asked_by_many":"Po\u017E\xE1dali: {names}. Ka\u017Ed\xFD dostane zpr\xE1vu, a\u017E bude voda p\u0159ipraven\xE1.","names.and":" a ","today.you":"Vy","list.mine":"Moje \u010Dasy p\u0159ipravenosti","list.count_one":"1 \u010Das p\u0159ipravenosti","list.count":"\u010Casy p\u0159ipravenosti: {count}","list.virtual":"Virtu\xE1ln\xED \u010Dlen \xB7 spole\u010Dn\xE9 \u010Dasy dom\xE1cnosti","away.paused":"Pozastaveno. \u010Casy z\u016Fst\xE1vaj\xED ulo\u017Een\xE9.","member_settings.open":"Nastaven\xED \u010Das\u016F p\u0159ipravenosti","visibility.private":"Soukrom\xE9","visibility.hint_own":"Ostatn\xED \u010Dlenov\xE9 tyto \u010Dasy ani va\u0161e po\u017Eadavky Oh\u0159\xE1t hned nevid\xED; spr\xE1vci ano.","visibility.hint_virtual":"Tyto \u010Dasy vid\xED jen spr\xE1vci.","settings.no_people":"V Home Assistant zat\xEDm nejsou \u017E\xE1dn\xE9 osoby, ze kter\xFDch by \u0161lo vyb\xEDrat.","editor.heater":"Oh\u0159\xEDva\u010D","editor.compact":"Kompaktn\xED: jen teplota a stav, bez ovl\xE1d\xE1n\xED","editor.tap_action":"Akce p\u0159i klepnut\xED"};var mt={"status.waiting":"Inaktiv","status.heating":"Varmer","status.ready":"Klar","status.fault":"Fejl","status.manual":"Manuel","headline.heating_for":"Varmer: klar om cirka {minutes} min","headline.ready_at":"Klar kl. {when}","subline.next_at":"N\xE6ste kl. {when}","when.today":"{time}","when.tomorrow":"{time} i morgen","when.weekday":"{time} {weekday}","ring.target":"m\xE5l {target}\xB0","weekday.letters":"M,T,O,T,F,L,S","members.none":"Ingen medlemmer endnu. En administrator tilf\xF8jer dem i integrationens indstillinger.","list.empty":"Ingen klartider endnu.","list.add":"Tilf\xF8j en klartid","sheet.delete":"Slet","list.switch":"Til eller fra","sheet.title":"Ny klartid","sheet.edit_title":"Rediger klartid","list.edit":"Rediger denne klartid","sheet.time":"Tidspunkt","sheet.hour":"Time","sheet.minute":"Minut","sheet.days":"Dage","sheet.save":"Gem","sheet.cancel":"Annuller","clock.title":"V\xE6lg tidspunkt","clock.title_keys":"Indtast tidspunkt","clock.ok":"OK","clock.to_keys":"Skriv tidspunktet","clock.to_dial":"Brug uret","clock.am":"AM","clock.pm":"PM","clock.invalid":"Indtast et gyldigt tidspunkt","clock.change":"Skift tidspunkt","fault.sensor_unavailable":"Fejl: vandtemperatursensoren giver ingen m\xE5linger. Opvarmningen er stoppet.","fault.not_rising":"Fejl: vandet bliver ikke varmere. Opvarmningen er stoppet; se Reparationer.","fault.no_consumption":"Fejl: vandvarmeren bruger ingen str\xF8m. Opvarmningen er stoppet; se Reparationer.","fault.relay_stuck":"Fejl: vandvarmeren bruger str\xF8m, selvom den er slukket. Tjek rel\xE6et.","fault.top_probe":"Advarsel: hovedf\xF8leren sidder m\xE5ske l\xF8st. Opvarmningen forts\xE6tter; se Reparationer.","fault.middle_probe":"Advarsel: den anden f\xF8ler sidder m\xE5ske l\xF8st. Opvarmningen forts\xE6tter; se Reparationer.","fault.probes_disagree":"Advarsel: de to f\xF8lere er uenige. Opvarmningen forts\xE6tter; se Reparationer.","element.on":"Varmelegeme t\xE6ndt","element.off":"Varmelegeme slukket","element.drawing":"{state} \xB7 bruger {watts} W","keep_hot.until":"Holdes varmt til {time}","keep_hot.title":"Hold varmt, n\xE5r det er klar","keep_hot.hint":"Efter beskeden \xBBklar\xAB holder vandvarmeren vandet varmt s\xE5 l\xE6nge og slukker derefter.","keep_hot.more":"V\xE6lg, hvor l\xE6nge det holdes varmt","keep_hot.cancel":"Annuller","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} t","heat_now_target.title":"Temperatur","heat_now_target.hint":"Kun for denne anmodning; vandvarmeren bliver p\xE5 {target} \xB0C.","heat_now_target.down":"1 \xB0C mindre","heat_now_target.up":"1 \xB0C mere",manual:"Automatisk styring er sl\xE5et fra: vandvarmeren styres manuelt.","note.not_rising_skipped":"Termostaten oplyser ikke, hvorn\xE5r den varmer, s\xE5 kontrollerne \xBBvandet bliver ikke varmere\xAB og \xBBvandvarmeren bruger ingen str\xF8m\xAB udf\xF8res ikke.","heat_now.start":"Opvarm nu","heat_now.cancel":"Annuller","heat_now.join":"Giv mig besked, n\xE5r det er varmt","heat_now.leave":"Ingen besked til mig","subline.for":"Til {list}.","item.at":"{name} kl. {time}","switch_off.link":"Sluk for opvarmningen\u2026","switch_off.title":"Sluk for opvarmningen?","switch_off.confirm":"Sluk","switch_off.keep":"Annuller","switch_off.asked_one":"{names} f\xE5r ikke l\xE6ngere besked.","switch_off.asked_many":"{names} f\xE5r ikke l\xE6ngere besked.","switch_off.skipped_one":"Uden varmt vand: {list}.","switch_off.skipped_many":"Uden varmt vand: {list}.","switch_off.back":"Den t\xE6nder igen af sig selv til n\xE6ste klartid.","switch_off.nobody":"Opvarmningen stopper nu.","settings.switch_off":"Hvem m\xE5 slukke for opvarmningen for alle","settings.switch_off_hint":"Administratorerne og:","settings.own_cancel":"Den, der bad om det, kan altid annullere sin egen anmodning.",greeting:"Hej, {name}","today.label":"Hjemme i dag","today.nobody":"Ingen i dag","away.until_label":"Indtil (valgfri)","away.line":"V\xE6k","away.line_until":"V\xE6k indtil {date}","members.add":"Medlem","card.no_heater":"Der er endnu ikke sat nogen Hot Water Ready-vandvarmer op.","card.loading":"Indl\xE6ser\u2026","card.error":"Det lykkedes ikke: {message}","cluster.warning":"Brusebadene fra kl. {when} skal bruge vand p\xE5 {needed} \xB0C, men vandvarmeren g\xE5r kun op til {cap} \xB0C: de sidste kan blive k\xF8ligere.","tabs.people":"Personer","tabs.week":"Uge","week.days":"man,tir,ons,tor,fre,l\xF8r,s\xF8n","week.showers":"brusebade","week.windows":"opvarmningsvinduer","week.busiest":"travleste dag","week.heating":"Opvarmning","week.away":"v\xE6k","week.virtual":"virtuel \xB7 {count}","week.per_week":"{count} om ugen","week.hint":"Tryk p\xE5 en person for at fremh\xE6ve deres tider. Bj\xE6lkerne viser, hvorn\xE5r vandvarmeren m\xE5 varme hver dag ({start} til {end}).","settings.open":"Vandvarmerens indstillinger","settings.close":"Luk","settings.target":"M\xE5ltemperatur","settings.target_hint":"Klar, n\xE5r vandet n\xE5r hertil","settings.target_down":"S\xE6nk m\xE5let","settings.target_up":"H\xE6v m\xE5let","settings.margin":"Margin","settings.band":"Stopper ved {stop} \xB0C, starter igen ved {restart} \xB0C","settings.margin_down":"S\xE6nk margenen","settings.margin_up":"H\xE6v margenen","settings.automatic":"Automatisk styring","settings.automatic_hint":"Fra: vandvarmeren styres manuelt","settings.more":"Flere indstillinger","rate.title":"Opvarmningshastighed","rate.unit":"min pr. \xB0C","rate.automatic":"Automatisk","rate.fixed":"Fast","rate.learned":"L\xE6rt: median af de {count} rene opvarmninger i de sidste {days} dage","rate.default_one":"Startv\xE6rdi: 1 ren opvarmning mere i de sidste {days} dage, s\xE5 er den l\xE6rt","rate.default_many":"Startv\xE6rdi: {count} rene opvarmninger mere i de sidste {days} dage, s\xE5 er den l\xE6rt","rate.manual":"Fastsat manuelt: l\xE6ringen forts\xE6tter, men bruges ikke","rate.runs":"Rene opvarmninger bag den","rate.example":"Nu {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} min, plus {margin} min margin: starter {lead} min f\xF8r","rate.example_cap":" (h\xF8jst)","rate.example_warm":"Nu {from} \xB0C: allerede ved m\xE5let, ingen grund til at starte tidligt","rate.physics":"If\xF8lge fysikken, hele beholderen opvarmet af varmelegemet: {rate} min/\xB0C","rate.physics_range":"If\xF8lge fysikken: mellem {fast} min/\xB0C (kun vandet over varmelegemet) og {slow} min/\xB0C (hele beholderen)","rate.volume":"Svarer til at opvarme {litres} L af beholderens {tank} L","rate.far_below":": {percent} % under fysikken. Tjek beholderens volumen, varmelegemets effekt og hvor f\xF8leren sidder.","rate.far_above":": {percent} % over fysikken. Tjek beholderens volumen, varmelegemets effekt og hvor f\xF8leren sidder.","rate.suggested_learned":"Forslag: {rate} (l\xE6rt)","rate.suggested_physics":"Forslag: {rate} (beholderens fysik)","rate.suggested_default":"Forslag: {rate} (startv\xE6rdi)","rate.use":"Brug","rate.down":"0,1 min pr. \xB0C mindre","rate.up":"0,1 min pr. \xB0C mere","rate.recalculate":"Genberegn ud fra historikken","rate.recalculating":"Gennemg\xE5r den seneste uge\u2026","rate.found":"Fandt {count} rene opvarmninger i historikken; l\xE6rte {rate} min/\xB0C.","rate.found_too_few":"Fandt {count} rene opvarmninger i historikken; der skal {needed} til for at l\xE6re.","solar.title":"Solsammenligning","solar.none":"Ingen vinduer registreret i de sidste 30 dage endnu.","solar.would":"Med solreglen sl\xE5et til ville vandet have v\xE6ret klar til tiden i {on_time} af {windows} vinduer","solar.did":"Med solreglen var vandet klar til tiden i {on_time} af {windows} vinduer","solar.would_less":", og vandvarmeren ville have k\xF8rt {minutes} minutter mindre","solar.would_more":", og vandvarmeren ville have k\xF8rt {minutes} minutter mere","solar.did_less":", og vandvarmeren k\xF8rte {minutes} minutter mindre","solar.did_more":", og vandvarmeren k\xF8rte {minutes} minutter mere","solar.kwh":", cirka {kwh} kWh","solar.applied":" Reglen blev anvendt i {applied} af dem: til tiden i {on_time}.","subline.starts_at":"Begynder at varme omkring kl. {when}.","subline.starts_at_solar":"Begynder at varme omkring kl. {when}, hvis solen ikke har klaret det inden da.","subline.asked_by_one":"Bestilt af {name}. F\xE5r besked, n\xE5r det er klar.","subline.asked_by_many":"Bestilt af {names}. Hver f\xE5r besked, n\xE5r det er klar.","names.and":" og ","today.you":"Dig","list.mine":"Mine klartider","list.count_one":"1 klartid","list.count":"{count} klartider","list.virtual":"Virtuelt medlem \xB7 husstandens f\xE6lles tider","away.paused":"P\xE5 pause. Tiderne bevares.","member_settings.open":"Indstillinger for klartider","visibility.private":"Privat","visibility.hint_own":"Andre medlemmer kan ikke se disse tider eller dine Opvarm nu-anmodninger; administratorer kan.","visibility.hint_virtual":"Kun administratorer kan se disse tider.","settings.no_people":"Der er endnu ingen personer i Home Assistant at v\xE6lge imellem.","editor.heater":"Varmtvandsbeholder","editor.compact":"Kompakt: kun temperatur og status, uden knapper","editor.tap_action":"Handling ved tryk"};var pt={"status.waiting":"Bereitschaft","status.heating":"Heizt","status.ready":"Bereit","status.fault":"St\xF6rung","status.manual":"Manuell","headline.heating_for":"Heizt: bereit in etwa {minutes} min","headline.ready_at":"Bereit: {when}","subline.next_at":"N\xE4chste: {when}","when.today":"{time}","when.tomorrow":"morgen, {time}","when.weekday":"{weekday}, {time}","ring.target":"Ziel {target}\xB0","weekday.letters":"M,D,M,D,F,S,S","members.none":"Noch keine Mitglieder. Ein Administrator f\xFCgt sie in den Einstellungen der Integration hinzu.","list.empty":"Noch keine Bereitzeiten.","list.add":"Bereitzeit hinzuf\xFCgen","sheet.delete":"L\xF6schen","list.switch":"Ein oder aus","sheet.title":"Neue Bereitzeit","sheet.edit_title":"Bereitzeit \xE4ndern","list.edit":"Diese Bereitzeit \xE4ndern","sheet.time":"Uhrzeit","sheet.hour":"Stunde","sheet.minute":"Minute","sheet.days":"Tage","sheet.save":"Speichern","sheet.cancel":"Abbrechen","clock.title":"Uhrzeit w\xE4hlen","clock.title_keys":"Uhrzeit eingeben","clock.ok":"OK","clock.to_keys":"Uhrzeit eintippen","clock.to_dial":"Uhr verwenden","clock.am":"AM","clock.pm":"PM","clock.invalid":"Gib eine g\xFCltige Uhrzeit ein","clock.change":"Uhrzeit \xE4ndern","fault.sensor_unavailable":"St\xF6rung: Der Wassertemperatursensor liefert keine Messwerte. Das Heizen ist gestoppt.","fault.not_rising":"St\xF6rung: Das Wasser wird nicht w\xE4rmer. Das Heizen ist gestoppt; siehe Reparaturen.","fault.no_consumption":"St\xF6rung: Der Boiler zieht keinen Strom. Das Heizen ist gestoppt; siehe Reparaturen.","fault.relay_stuck":"St\xF6rung: Der Boiler zieht Strom, obwohl er ausgeschaltet ist. Pr\xFCfe das Relais.","fault.top_probe":"Warnung: Der Hauptf\xFChler sitzt vielleicht locker. Das Heizen l\xE4uft weiter; siehe Reparaturen.","fault.middle_probe":"Warnung: Der zweite F\xFChler sitzt vielleicht locker. Das Heizen l\xE4uft weiter; siehe Reparaturen.","fault.probes_disagree":"Warnung: Die beiden F\xFChler stimmen nicht \xFCberein. Das Heizen l\xE4uft weiter; siehe Reparaturen.","element.on":"Heizstab an","element.off":"Heizstab aus","element.drawing":"{state} \xB7 zieht {watts} W","keep_hot.until":"Wird hei\xDF gehalten bis {time}","keep_hot.title":"Hei\xDF halten, wenn bereit","keep_hot.hint":"Nach der Nachricht \u201Ebereit\u201C h\xE4lt der Boiler das Wasser so lange hei\xDF und schaltet dann aus.","keep_hot.more":"W\xE4hlen, wie lange hei\xDF gehalten wird","keep_hot.cancel":"Abbrechen","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h","heat_now_target.title":"Temperatur","heat_now_target.hint":"Nur f\xFCr diese Anfrage; der Boiler bleibt bei {target} \xB0C.","heat_now_target.down":"1 \xB0C weniger","heat_now_target.up":"1 \xB0C mehr",manual:"Die automatische Steuerung ist aus: Der Boiler wird manuell betrieben.","note.not_rising_skipped":"Das Thermostat meldet nicht, wann es heizt, daher entfallen die Pr\xFCfungen \u201EWasser wird nicht w\xE4rmer\u201C und \u201EBoiler zieht keinen Strom\u201C.","heat_now.start":"Jetzt heizen","heat_now.cancel":"Abbrechen","heat_now.join":"Sag mir, wenn es hei\xDF ist","heat_now.leave":"Nicht benachrichtigen","subline.for":"F\xFCr {list}.","item.at":"{name} um {time}","switch_off.link":"Heizen ausschalten\u2026","switch_off.title":"Heizen ausschalten?","switch_off.confirm":"Ausschalten","switch_off.keep":"Abbrechen","switch_off.asked_one":"{names} wird nicht mehr benachrichtigt.","switch_off.asked_many":"{names} werden nicht mehr benachrichtigt.","switch_off.skipped_one":"Ohne Warmwasser: {list}.","switch_off.skipped_many":"Ohne Warmwasser: {list}.","switch_off.back":"Zur n\xE4chsten Bereitzeit schaltet es sich von selbst wieder ein.","switch_off.nobody":"Das Heizen stoppt jetzt.","settings.switch_off":"Wer das Heizen f\xFCr alle ausschalten darf","settings.switch_off_hint":"Die Administratoren und:","settings.own_cancel":"Wer angefragt hat, kann die eigene Anfrage immer abbrechen.",greeting:"Hallo, {name}","today.label":"Heute im Haus","today.nobody":"Heute niemand","away.until_label":"Bis (optional)","away.line":"Abwesend","away.line_until":"Abwesend bis {date}","members.add":"Mitglied","card.no_heater":"Es ist noch kein Hot Water Ready Boiler eingerichtet.","card.loading":"Wird geladen\u2026","card.error":"Das hat nicht geklappt: {message}","cluster.warning":"Die Duschen ab {when} brauchen das Wasser mit {needed} \xB0C, aber der Boiler heizt nur bis {cap} \xB0C: Die letzten k\xF6nnten k\xFChler ausfallen.","tabs.people":"Personen","tabs.week":"Woche","week.days":"Mo,Di,Mi,Do,Fr,Sa,So","week.showers":"Duschen","week.windows":"Heizfenster","week.busiest":"vollster Tag","week.heating":"Heizen","week.away":"abwesend","week.virtual":"virtuell \xB7 {count}","week.per_week":"{count} pro Woche","week.hint":"Tippe auf eine Person, um ihre Zeiten hervorzuheben. Die Balken zeigen, wann der Boiler an jedem Tag heizen darf ({start} bis {end}).","settings.open":"Boiler-Einstellungen","settings.close":"Schlie\xDFen","settings.target":"Zieltemperatur","settings.target_hint":"Bereit, wenn das Wasser hier ankommt","settings.target_down":"Ziel senken","settings.target_up":"Ziel erh\xF6hen","settings.margin":"Spielraum","settings.band":"Stoppt bei {stop} \xB0C, startet wieder bei {restart} \xB0C","settings.margin_down":"Spielraum verringern","settings.margin_up":"Spielraum vergr\xF6\xDFern","settings.automatic":"Automatische Steuerung","settings.automatic_hint":"Aus: Der Boiler wird manuell betrieben","settings.more":"Weitere Einstellungen","rate.title":"Heizgeschwindigkeit","rate.unit":"min pro \xB0C","rate.automatic":"Automatisch","rate.fixed":"Fest","rate.learned":"Gelernt: Median der {count} sauberen Heizvorg\xE4nge der letzten {days} Tage","rate.default_one":"Startwert: noch 1 sauberer Heizvorgang in den letzten {days} Tagen, dann ist er gelernt","rate.default_many":"Startwert: noch {count} saubere Heizvorg\xE4nge in den letzten {days} Tagen, dann ist er gelernt","rate.manual":"Manuell festgelegt: Das Lernen l\xE4uft weiter, wird aber nicht verwendet","rate.runs":"Zugrunde liegende saubere Heizvorg\xE4nge","rate.example":"Jetzt {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} min, plus {margin} min Spielraum: startet {lead} min vorher","rate.example_cap":" (h\xF6chstens)","rate.example_warm":"Jetzt {from} \xB0C: schon am Ziel, kein fr\xFCher Start n\xF6tig","rate.physics":"Physikalisch, der ganze Speicher vom Heizstab erw\xE4rmt: {rate} min/\xB0C","rate.physics_range":"Physikalisch: zwischen {fast} min/\xB0C (nur das Wasser \xFCber dem Heizstab) und {slow} min/\xB0C (der ganze Speicher)","rate.volume":"Entspricht dem Erw\xE4rmen von {litres} L der {tank} L des Speichers","rate.far_below":": {percent} % unter der Physik. Pr\xFCfe das Speichervolumen, die Leistung des Heizstabs und wo der F\xFChler sitzt.","rate.far_above":": {percent} % \xFCber der Physik. Pr\xFCfe das Speichervolumen, die Leistung des Heizstabs und wo der F\xFChler sitzt.","rate.suggested_learned":"Vorschlag: {rate} (gelernt)","rate.suggested_physics":"Vorschlag: {rate} (Speicherphysik)","rate.suggested_default":"Vorschlag: {rate} (Startwert)","rate.use":"\xDCbernehmen","rate.down":"0,1 min pro \xB0C weniger","rate.up":"0,1 min pro \xB0C mehr","rate.recalculate":"Aus dem Verlauf neu berechnen","rate.recalculating":"Die letzte Woche wird durchsucht\u2026","rate.found":"{count} saubere Heizvorg\xE4nge im Verlauf gefunden; gelernt: {rate} min/\xB0C.","rate.found_too_few":"{count} saubere Heizvorg\xE4nge im Verlauf gefunden; zum Lernen sind {needed} n\xF6tig.","solar.title":"Solarvergleich","solar.none":"In den letzten 30 Tagen wurden noch keine Fenster aufgezeichnet.","solar.would":"Mit eingeschalteter Solarregel w\xE4re das Wasser in {on_time} von {windows} Fenstern rechtzeitig bereit gewesen","solar.did":"Mit der Solarregel war das Wasser in {on_time} von {windows} Fenstern rechtzeitig bereit","solar.would_less":", und der Boiler w\xE4re {minutes} Minuten weniger gelaufen","solar.would_more":", und der Boiler w\xE4re {minutes} Minuten l\xE4nger gelaufen","solar.did_less":", und der Boiler lief {minutes} Minuten weniger","solar.did_more":", und der Boiler lief {minutes} Minuten l\xE4nger","solar.kwh":", etwa {kwh} kWh","solar.applied":" Die Regel wurde in {applied} davon angewendet: rechtzeitig in {on_time}.","subline.starts_at":"Heizbeginn etwa: {when}.","subline.starts_at_solar":"Heizbeginn etwa: {when}, falls die Sonne es bis dahin nicht geschafft hat.","subline.asked_by_one":"Angefordert von {name}. Wird benachrichtigt, wenn es bereit ist.","subline.asked_by_many":"Angefordert von {names}. Alle werden benachrichtigt, wenn es bereit ist.","names.and":" und ","today.you":"Du","list.mine":"Meine Bereitzeiten","list.count_one":"1 Bereitzeit","list.count":"{count} Bereitzeiten","list.virtual":"Virtuelles Mitglied \xB7 gemeinsame Zeiten des Haushalts","away.paused":"Pausiert. Die Zeiten bleiben erhalten.","member_settings.open":"Einstellungen der Bereitzeiten","visibility.private":"Privat","visibility.hint_own":"Andere Mitglieder sehen diese Zeiten und deine Jetzt-heizen-Anfragen nicht; Administratoren schon.","visibility.hint_virtual":"Nur Administratoren sehen diese Zeiten.","settings.no_people":"In Home Assistant gibt es noch keine Personen zur Auswahl.","editor.heater":"Boiler","editor.compact":"Kompakt: nur Temperatur und Status, ohne Bedienelemente","editor.tap_action":"Aktion beim Tippen"};var ht={"status.waiting":"En espera","status.heating":"Calentando","status.ready":"Lista","status.fault":"Aver\xEDa","status.manual":"Manual","headline.heating_for":"Calentando: lista en unos {minutes} min","headline.ready_at":"Lista a las {when}","subline.next_at":"Pr\xF3xima a las {when}","when.today":"{time}","when.tomorrow":"{time} de ma\xF1ana","when.weekday":"{time} del {weekday}","ring.target":"objetivo {target}\xB0","weekday.letters":"L,M,X,J,V,S,D","members.none":"A\xFAn no hay miembros. Un administrador los a\xF1ade en los ajustes de la integraci\xF3n.","list.empty":"A\xFAn no hay horas.","list.add":"A\xF1adir una hora","sheet.delete":"Eliminar","list.switch":"Activar o desactivar","sheet.title":"Nueva hora","sheet.edit_title":"Cambiar hora","list.edit":"Cambiar esta hora","sheet.time":"Hora","sheet.hour":"Horas","sheet.minute":"Minutos","sheet.days":"D\xEDas","sheet.save":"Guardar","sheet.cancel":"Cancelar","clock.title":"Elegir hora","clock.title_keys":"Introducir hora","clock.ok":"Aceptar","clock.to_keys":"Escribir la hora","clock.to_dial":"Usar el reloj","clock.am":"a. m.","clock.pm":"p. m.","clock.invalid":"Introduce una hora v\xE1lida","clock.change":"Cambiar la hora","fault.sensor_unavailable":"Aver\xEDa: el sensor de temperatura del agua no da lecturas. El calentamiento se ha detenido.","fault.not_rising":"Aver\xEDa: el agua no se calienta. El calentamiento se ha detenido; consulta Reparaciones.","fault.no_consumption":"Aver\xEDa: el calentador no consume nada. El calentamiento se ha detenido; consulta Reparaciones.","fault.relay_stuck":"Aver\xEDa: el calentador consume estando apagado. Revisa el rel\xE9.","fault.top_probe":"Aviso: puede que la sonda principal est\xE9 suelta. El calentamiento contin\xFAa; consulta Reparaciones.","fault.middle_probe":"Aviso: puede que la segunda sonda est\xE9 suelta. El calentamiento contin\xFAa; consulta Reparaciones.","fault.probes_disagree":"Aviso: las dos sondas no coinciden. El calentamiento contin\xFAa; consulta Reparaciones.","element.on":"Resistencia encendida","element.off":"Resistencia apagada","element.drawing":"{state} \xB7 consumiendo {watts} W","keep_hot.until":"Manteniendo caliente hasta las {time}","keep_hot.title":"Mantener caliente cuando est\xE9 lista","keep_hot.hint":"Tras el mensaje de \xABlista\xBB, el calentador mantiene el agua caliente durante este tiempo y luego se apaga.","keep_hot.more":"Elegir cu\xE1nto tiempo mantenerla caliente","keep_hot.cancel":"Cancelar","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h","heat_now_target.title":"Temperatura","heat_now_target.hint":"Solo para esta petici\xF3n; el calentador sigue en {target} \xB0C.","heat_now_target.down":"1 \xB0C menos","heat_now_target.up":"1 \xB0C m\xE1s",manual:"El control autom\xE1tico est\xE1 desactivado: el calentador se maneja a mano.","note.not_rising_skipped":"El termostato no indica cu\xE1ndo est\xE1 calentando, as\xED que no se hacen las comprobaciones \xABel agua no se calienta\xBB y \xABel calentador no consume nada\xBB.","heat_now.start":"Calentar ahora","heat_now.cancel":"Cancelar","heat_now.join":"Av\xEDsame cuando est\xE9 caliente","heat_now.leave":"No me avises","subline.for":"Para {list}.","item.at":"{name} a las {time}","switch_off.link":"Apagar el calentamiento\u2026","switch_off.title":"\xBFApagar el calentamiento?","switch_off.confirm":"Apagar","switch_off.keep":"Cancelar","switch_off.asked_one":"{names} ya no recibir\xE1 el aviso.","switch_off.asked_many":"{names} ya no recibir\xE1n el aviso.","switch_off.skipped_one":"Se queda sin agua caliente: {list}.","switch_off.skipped_many":"Se quedan sin agua caliente: {list}.","switch_off.back":"Se vuelve a encender solo para la pr\xF3xima hora.","switch_off.nobody":"El calentamiento se detiene ahora.","settings.switch_off":"Qui\xE9n puede apagar el calentamiento para todos","settings.switch_off_hint":"Los administradores y:","settings.own_cancel":"Quien lo pidi\xF3 siempre puede cancelar su propia petici\xF3n.",greeting:"Hola, {name}","today.label":"Casa hoy","today.nobody":"Nadie hoy","away.until_label":"Hasta (opcional)","away.line":"Fuera de casa","away.line_until":"Fuera de casa hasta el {date}","members.add":"Miembro","card.no_heater":"A\xFAn no hay ning\xFAn calentador de Hot Water Ready configurado.","card.loading":"Cargando\u2026","card.error":"No ha funcionado: {message}","cluster.warning":"Las duchas a partir de las {when} necesitan el agua a {needed} \xB0C, pero el calentador solo llega a {cap} \xB0C: las \xFAltimas pueden salir menos calientes.","tabs.people":"Personas","tabs.week":"Semana","week.days":"Lun,Mar,Mi\xE9,Jue,Vie,S\xE1b,Dom","week.showers":"duchas","week.windows":"franjas de calentamiento","week.busiest":"d\xEDa m\xE1s cargado","week.heating":"Calentamiento","week.away":"fuera","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} a la semana","week.hint":"Toca una persona para resaltar sus horas. Las barras muestran cu\xE1ndo puede calentar el calentador cada d\xEDa ({start} a {end}).","settings.open":"Ajustes del calentador","settings.close":"Cerrar","settings.target":"Temperatura objetivo","settings.target_hint":"Lista cuando el agua llega aqu\xED","settings.target_down":"Bajar el objetivo","settings.target_up":"Subir el objetivo","settings.margin":"Margen","settings.band":"Para a {stop} \xB0C, vuelve a empezar a {restart} \xB0C","settings.margin_down":"Bajar el margen","settings.margin_up":"Subir el margen","settings.automatic":"Control autom\xE1tico","settings.automatic_hint":"Desactivado: el calentador se maneja a mano","settings.more":"M\xE1s ajustes","rate.title":"Velocidad de calentamiento","rate.unit":"min por \xB0C","rate.automatic":"Autom\xE1tica","rate.fixed":"Fija","rate.learned":"Aprendida: mediana de los {count} calentamientos limpios de los \xFAltimos {days} d\xEDas","rate.default_one":"Valor inicial: falta 1 calentamiento limpio en los \xFAltimos {days} d\xEDas para aprenderla","rate.default_many":"Valor inicial: faltan {count} calentamientos limpios en los \xFAltimos {days} d\xEDas para aprenderla","rate.manual":"Fijada a mano: el aprendizaje contin\xFAa, pero no se usa","rate.runs":"Calentamientos limpios usados","rate.example":"Ahora {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} min, m\xE1s {margin} min de margen: empieza {lead} min antes","rate.example_cap":" (como m\xE1ximo)","rate.example_warm":"Ahora {from} \xB0C: ya est\xE1 en el objetivo, no hace falta empezar antes","rate.physics":"Seg\xFAn la f\xEDsica, todo el dep\xF3sito calentado por la resistencia: {rate} min/\xB0C","rate.physics_range":"Seg\xFAn la f\xEDsica: entre {fast} min/\xB0C (solo el agua por encima de la resistencia) y {slow} min/\xB0C (todo el dep\xF3sito)","rate.volume":"Equivale a calentar {litres} L de los {tank} L del dep\xF3sito","rate.far_below":": un {percent} % por debajo de la f\xEDsica. Comprueba el volumen del dep\xF3sito, la potencia de la resistencia y d\xF3nde est\xE1 la sonda.","rate.far_above":": un {percent} % por encima de la f\xEDsica. Comprueba el volumen del dep\xF3sito, la potencia de la resistencia y d\xF3nde est\xE1 la sonda.","rate.suggested_learned":"Sugerida: {rate} (aprendida)","rate.suggested_physics":"Sugerida: {rate} (f\xEDsica del dep\xF3sito)","rate.suggested_default":"Sugerida: {rate} (valor inicial)","rate.use":"Usar","rate.down":"0,1 min por \xB0C menos","rate.up":"0,1 min por \xB0C m\xE1s","rate.recalculate":"Recalcular a partir del historial","rate.recalculating":"Revisando la \xFAltima semana\u2026","rate.found":"Se encontraron {count} calentamientos limpios en el historial; velocidad aprendida: {rate} min/\xB0C.","rate.found_too_few":"Se encontraron {count} calentamientos limpios en el historial; hacen falta {needed} para aprender.","solar.title":"Comparaci\xF3n solar","solar.none":"A\xFAn no hay franjas registradas en los \xFAltimos 30 d\xEDas.","solar.would":"Con la regla solar activada, el agua habr\xEDa estado lista a tiempo en {on_time} de {windows} franjas","solar.did":"Con la regla solar, el agua estuvo lista a tiempo en {on_time} de {windows} franjas","solar.would_less":", y el calentador habr\xEDa funcionado {minutes} minutos menos","solar.would_more":", y el calentador habr\xEDa funcionado {minutes} minutos m\xE1s","solar.did_less":", y el calentador funcion\xF3 {minutes} minutos menos","solar.did_more":", y el calentador funcion\xF3 {minutes} minutos m\xE1s","solar.kwh":", unos {kwh} kWh","solar.applied":" La regla se aplic\xF3 en {applied} de ellas: a tiempo en {on_time}.","subline.starts_at":"Empieza a calentar hacia las {when}.","subline.starts_at_solar":"Empieza a calentar hacia las {when}, si el sol no lo ha hecho antes.","subline.asked_by_one":"Lo ha pedido {name}. Recibir\xE1 un aviso cuando est\xE9 lista.","subline.asked_by_many":"Lo han pedido {names}. Cada uno recibir\xE1 un aviso cuando est\xE9 lista.","names.and":" y ","today.you":"T\xFA","list.mine":"Mis horas","list.count_one":"1 hora","list.count":"{count} horas","list.virtual":"Miembro virtual \xB7 horas compartidas de la casa","away.paused":"En pausa. Las horas se conservan.","member_settings.open":"Ajustes de las horas","visibility.private":"Privado","visibility.hint_own":"Los dem\xE1s miembros no ven estas horas ni tus peticiones de Calentar ahora; los administradores s\xED.","visibility.hint_virtual":"Solo los administradores ven estas horas.","settings.no_people":"A\xFAn no hay personas en Home Assistant para elegir.","editor.heater":"Calentador","editor.compact":"Compacta: solo la temperatura y el estado, sin controles","editor.tap_action":"Acci\xF3n al tocar"};var gt={"status.waiting":"En attente","status.heating":"En chauffe","status.ready":"Pr\xEAte","status.fault":"Panne","status.manual":"Manuel","headline.heating_for":"En chauffe : pr\xEAte dans environ {minutes} min","headline.ready_at":"Pr\xEAte \xE0 {when}","subline.next_at":"Prochaine \xE0 {when}","when.today":"{time}","when.tomorrow":"{time} demain","when.weekday":"{time} {weekday}","ring.target":"cible {target}\xB0","weekday.letters":"L,M,M,J,V,S,D","members.none":"Aucun membre pour l'instant. Un administrateur les ajoute dans les param\xE8tres de l'int\xE9gration.","list.empty":"Aucun horaire pour l'instant.","list.add":"Ajouter un horaire","sheet.delete":"Supprimer","list.switch":"Activer ou d\xE9sactiver","sheet.title":"Nouvel horaire","sheet.edit_title":"Modifier l'horaire","list.edit":"Modifier cet horaire","sheet.time":"Heure","sheet.hour":"Heures","sheet.minute":"Minutes","sheet.days":"Jours","sheet.save":"Enregistrer","sheet.cancel":"Annuler","clock.title":"Choisir l'heure","clock.title_keys":"Saisir l'heure","clock.ok":"OK","clock.to_keys":"Saisir l'heure","clock.to_dial":"Utiliser l'horloge","clock.am":"AM","clock.pm":"PM","clock.invalid":"Saisissez une heure valide","clock.change":"Changer l'heure","fault.sensor_unavailable":"Panne : le capteur de temp\xE9rature de l'eau ne donne aucune mesure. La chauffe est arr\xEAt\xE9e.","fault.not_rising":"Panne : l'eau ne chauffe pas. La chauffe est arr\xEAt\xE9e ; voir Corrections.","fault.no_consumption":"Panne : le chauffe-eau ne consomme rien. La chauffe est arr\xEAt\xE9e ; voir Corrections.","fault.relay_stuck":"Panne : le chauffe-eau consomme alors qu'il est \xE9teint. V\xE9rifiez le relais.","fault.top_probe":"Avertissement : la sonde principale est peut-\xEAtre mal fix\xE9e. La chauffe continue ; voir Corrections.","fault.middle_probe":"Avertissement : la deuxi\xE8me sonde est peut-\xEAtre mal fix\xE9e. La chauffe continue ; voir Corrections.","fault.probes_disagree":"Avertissement : les deux sondes ne concordent pas. La chauffe continue ; voir Corrections.","element.on":"R\xE9sistance allum\xE9e","element.off":"R\xE9sistance \xE9teinte","element.drawing":"{state} \xB7 consomme {watts} W","keep_hot.until":"Maintenue chaude jusqu'\xE0 {time}","keep_hot.title":"Garder chaude une fois pr\xEAte","keep_hot.hint":"Apr\xE8s le message \xAB pr\xEAte \xBB, le chauffe-eau garde l'eau chaude pendant cette dur\xE9e, puis s'\xE9teint.","keep_hot.more":"Choisir combien de temps la garder chaude","keep_hot.cancel":"Annuler","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h","heat_now_target.title":"Temp\xE9rature","heat_now_target.hint":"Pour cette demande seulement ; le chauffe-eau reste \xE0 {target} \xB0C.","heat_now_target.down":"1 \xB0C de moins","heat_now_target.up":"1 \xB0C de plus",manual:"Le contr\xF4le automatique est d\xE9sactiv\xE9 : le chauffe-eau est command\xE9 \xE0 la main.","note.not_rising_skipped":"Le thermostat n'indique pas quand il chauffe, donc les v\xE9rifications \xAB l'eau ne chauffe pas \xBB et \xAB le chauffe-eau ne consomme rien \xBB ne sont pas faites.","heat_now.start":"Chauffer maintenant","heat_now.cancel":"Annuler","heat_now.join":"Me pr\xE9venir quand elle est chaude","heat_now.leave":"Ne pas me pr\xE9venir","subline.for":"Pour {list}.","item.at":"{name} \xE0 {time}","switch_off.link":"Arr\xEAter la chauffe\u2026","switch_off.title":"Arr\xEAter la chauffe ?","switch_off.confirm":"Arr\xEAter","switch_off.keep":"Annuler","switch_off.asked_one":"{names} ne sera plus pr\xE9venu.","switch_off.asked_many":"{names} ne seront plus pr\xE9venus.","switch_off.skipped_one":"Sans eau chaude : {list}.","switch_off.skipped_many":"Sans eau chaude : {list}.","switch_off.back":"Elle se rallume d'elle-m\xEAme pour le prochain horaire.","switch_off.nobody":"La chauffe s'arr\xEAte maintenant.","settings.switch_off":"Qui peut arr\xEAter la chauffe pour tous","settings.switch_off_hint":"Les administrateurs et :","settings.own_cancel":"La personne qui a demand\xE9 peut toujours annuler sa propre demande.",greeting:"Bonjour, {name}","today.label":"Maison aujourd'hui","today.nobody":"Personne aujourd'hui","away.until_label":"Jusqu'au (facultatif)","away.line":"Absent","away.line_until":"Absent jusqu'au {date}","members.add":"Membre","card.no_heater":"Aucun chauffe-eau Hot Water Ready n'est encore configur\xE9.","card.loading":"Chargement\u2026","card.error":"Cela n'a pas fonctionn\xE9 : {message}","cluster.warning":"Les douches \xE0 partir de {when} demandent l'eau \xE0 {needed} \xB0C, mais le chauffe-eau ne monte qu'\xE0 {cap} \xB0C : les derni\xE8res risquent d'\xEAtre moins chaudes.","tabs.people":"Personnes","tabs.week":"Semaine","week.days":"Lun,Mar,Mer,Jeu,Ven,Sam,Dim","week.showers":"douches","week.windows":"plages de chauffe","week.busiest":"jour le plus charg\xE9","week.heating":"Chauffe","week.away":"absent","week.virtual":"virtuel \xB7 {count}","week.per_week":"{count} par semaine","week.hint":"Touchez une personne pour mettre ses horaires en \xE9vidence. Les barres montrent quand le chauffe-eau peut chauffer chaque jour ({start} \xE0 {end}).","settings.open":"R\xE9glages du chauffe-eau","settings.close":"Fermer","settings.target":"Temp\xE9rature cible","settings.target_hint":"Pr\xEAte quand l'eau atteint cette valeur","settings.target_down":"Baisser la cible","settings.target_up":"Augmenter la cible","settings.margin":"Marge","settings.band":"S'arr\xEAte \xE0 {stop} \xB0C, reprend \xE0 {restart} \xB0C","settings.margin_down":"R\xE9duire la marge","settings.margin_up":"Augmenter la marge","settings.automatic":"Contr\xF4le automatique","settings.automatic_hint":"D\xE9sactiv\xE9 : le chauffe-eau est command\xE9 \xE0 la main","settings.more":"Plus de r\xE9glages","rate.title":"Vitesse de chauffe","rate.unit":"min par \xB0C","rate.automatic":"Automatique","rate.fixed":"Fixe","rate.learned":"Apprise : m\xE9diane des {count} chauffes propres des {days} derniers jours","rate.default_one":"Valeur de d\xE9part : encore 1 chauffe propre dans les {days} derniers jours et elle est apprise","rate.default_many":"Valeur de d\xE9part : encore {count} chauffes propres dans les {days} derniers jours et elle est apprise","rate.manual":"Fix\xE9e \xE0 la main : l'apprentissage continue, mais n'est pas utilis\xE9","rate.runs":"Chauffes propres utilis\xE9es","rate.example":"Maintenant {from} \xB0C \u2192 {to} \xB0C : {degrees} \xB0C \xD7 {rate} = {minutes} min, plus {margin} min de marge : d\xE9marre {lead} min avant","rate.example_cap":" (au maximum)","rate.example_warm":"Maintenant {from} \xB0C : d\xE9j\xE0 \xE0 la cible, inutile de d\xE9marrer en avance","rate.physics":"Selon la physique, tout le ballon chauff\xE9 par la r\xE9sistance : {rate} min/\xB0C","rate.physics_range":"Selon la physique : entre {fast} min/\xB0C (seulement l'eau au-dessus de la r\xE9sistance) et {slow} min/\xB0C (tout le ballon)","rate.volume":"Revient \xE0 chauffer {litres} L sur les {tank} L du ballon","rate.far_below":" : {percent} % sous la physique. V\xE9rifiez le volume du ballon, la puissance de la r\xE9sistance et l'emplacement de la sonde.","rate.far_above":" : {percent} % au-dessus de la physique. V\xE9rifiez le volume du ballon, la puissance de la r\xE9sistance et l'emplacement de la sonde.","rate.suggested_learned":"Sugg\xE9r\xE9e : {rate} (apprise)","rate.suggested_physics":"Sugg\xE9r\xE9e : {rate} (physique du ballon)","rate.suggested_default":"Sugg\xE9r\xE9e : {rate} (valeur de d\xE9part)","rate.use":"Utiliser","rate.down":"0,1 min par \xB0C de moins","rate.up":"0,1 min par \xB0C de plus","rate.recalculate":"Recalculer \xE0 partir de l'historique","rate.recalculating":"Analyse de la derni\xE8re semaine\u2026","rate.found":"{count} chauffes propres trouv\xE9es dans l'historique ; vitesse apprise : {rate} min/\xB0C.","rate.found_too_few":"{count} chauffes propres trouv\xE9es dans l'historique ; il en faut {needed} pour apprendre.","solar.title":"Comparaison solaire","solar.none":"Aucune plage enregistr\xE9e dans les 30 derniers jours pour l'instant.","solar.would":"Avec la r\xE8gle solaire activ\xE9e, l'eau aurait \xE9t\xE9 pr\xEAte \xE0 temps dans {on_time} plages sur {windows}","solar.did":"Avec la r\xE8gle solaire, l'eau a \xE9t\xE9 pr\xEAte \xE0 temps dans {on_time} plages sur {windows}","solar.would_less":", et le chauffe-eau aurait fonctionn\xE9 {minutes} minutes de moins","solar.would_more":", et le chauffe-eau aurait fonctionn\xE9 {minutes} minutes de plus","solar.did_less":", et le chauffe-eau a fonctionn\xE9 {minutes} minutes de moins","solar.did_more":", et le chauffe-eau a fonctionn\xE9 {minutes} minutes de plus","solar.kwh":", environ {kwh} kWh","solar.applied":" La r\xE8gle a \xE9t\xE9 appliqu\xE9e dans {applied} d'entre elles : \xE0 temps dans {on_time}.","subline.starts_at":"Commence \xE0 chauffer vers {when}.","subline.starts_at_solar":"Commence \xE0 chauffer vers {when}, si le soleil ne l'a pas fait d'ici l\xE0.","subline.asked_by_one":"Demand\xE9 par {name}, qui est pr\xE9venu quand elle est pr\xEAte.","subline.asked_by_many":"Demand\xE9 par {names}. Chacun est pr\xE9venu quand elle est pr\xEAte.","names.and":" et ","today.you":"Vous","list.mine":"Mes horaires","list.count_one":"1 horaire","list.count":"{count} horaires","list.virtual":"Membre virtuel \xB7 horaires communs de la maison","away.paused":"En pause. Les horaires sont conserv\xE9s.","member_settings.open":"R\xE9glages des horaires","visibility.private":"Priv\xE9","visibility.hint_own":"Les autres membres ne voient ni ces horaires ni vos demandes Chauffer maintenant ; les administrateurs les voient.","visibility.hint_virtual":"Seuls les administrateurs voient ces horaires.","settings.no_people":"Il n'y a encore aucune personne dans Home Assistant \xE0 choisir.","editor.heater":"Chauffe-eau","editor.compact":"Compacte : seulement la temp\xE9rature et l'\xE9tat, sans commandes","editor.tap_action":"Action au toucher"};var ft={"status.waiting":"In attesa","status.heating":"In riscaldamento","status.ready":"Pronta","status.fault":"Guasto","status.manual":"Manuale","headline.heating_for":"In riscaldamento: pronta tra circa {minutes} min","headline.ready_at":"Pronta alle {when}","subline.next_at":"Prossima alle {when}","when.today":"{time}","when.tomorrow":"{time} di domani","when.weekday":"{time} di {weekday}","ring.target":"obiettivo {target}\xB0","weekday.letters":"L,M,M,G,V,S,D","members.none":"Ancora nessun membro. Un amministratore li aggiunge nelle impostazioni dell'integrazione.","list.empty":"Ancora nessun orario.","list.add":"Aggiungi un orario","sheet.delete":"Elimina","list.switch":"Attiva o disattiva","sheet.title":"Nuovo orario","sheet.edit_title":"Modifica orario","list.edit":"Modifica questo orario","sheet.time":"Ora","sheet.hour":"Ore","sheet.minute":"Minuti","sheet.days":"Giorni","sheet.save":"Salva","sheet.cancel":"Annulla","clock.title":"Seleziona l'ora","clock.title_keys":"Inserisci l'ora","clock.ok":"OK","clock.to_keys":"Digita l'ora","clock.to_dial":"Usa l'orologio","clock.am":"AM","clock.pm":"PM","clock.invalid":"Inserisci un'ora valida","clock.change":"Cambia l'ora","fault.sensor_unavailable":"Guasto: il sensore di temperatura dell'acqua non d\xE0 letture. Il riscaldamento si \xE8 fermato.","fault.not_rising":"Guasto: l'acqua non si scalda. Il riscaldamento si \xE8 fermato; vedi Riparazioni.","fault.no_consumption":"Guasto: lo scaldacqua non assorbe corrente. Il riscaldamento si \xE8 fermato; vedi Riparazioni.","fault.relay_stuck":"Guasto: lo scaldacqua assorbe corrente anche da spento. Controlla il rel\xE8.","fault.top_probe":"Avviso: la sonda principale potrebbe essersi allentata. Il riscaldamento continua; vedi Riparazioni.","fault.middle_probe":"Avviso: la seconda sonda potrebbe essersi allentata. Il riscaldamento continua; vedi Riparazioni.","fault.probes_disagree":"Avviso: le due sonde non concordano. Il riscaldamento continua; vedi Riparazioni.","element.on":"Resistenza accesa","element.off":"Resistenza spenta","element.drawing":"{state} \xB7 assorbe {watts} W","keep_hot.until":"Mantenuta calda fino alle {time}","keep_hot.title":"Mantieni calda quando \xE8 pronta","keep_hot.hint":"Dopo il messaggio \xABpronta\xBB, lo scaldacqua mantiene l'acqua calda per questo tempo, poi si spegne.","keep_hot.more":"Scegli per quanto mantenerla calda","keep_hot.cancel":"Annulla","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h","heat_now_target.title":"Temperatura","heat_now_target.hint":"Solo per questa richiesta; lo scaldabagno resta a {target} \xB0C.","heat_now_target.down":"1 \xB0C in meno","heat_now_target.up":"1 \xB0C in pi\xF9",manual:"Il controllo automatico \xE8 disattivato: lo scaldacqua \xE8 comandato a mano.","note.not_rising_skipped":"Il termostato non indica quando sta scaldando, quindi i controlli \xABl'acqua non si scalda\xBB e \xABlo scaldacqua non assorbe corrente\xBB non vengono eseguiti.","heat_now.start":"Scalda ora","heat_now.cancel":"Annulla","heat_now.join":"Avvisami quando \xE8 calda","heat_now.leave":"Non avvisarmi","subline.for":"Per {list}.","item.at":"{name} alle {time}","switch_off.link":"Spegni il riscaldamento\u2026","switch_off.title":"Spegnere il riscaldamento?","switch_off.confirm":"Spegni","switch_off.keep":"Annulla","switch_off.asked_one":"{names} non ricever\xE0 pi\xF9 l'avviso.","switch_off.asked_many":"{names} non riceveranno pi\xF9 l'avviso.","switch_off.skipped_one":"Resta senza acqua calda: {list}.","switch_off.skipped_many":"Restano senza acqua calda: {list}.","switch_off.back":"Si riaccende da solo per il prossimo orario.","switch_off.nobody":"Il riscaldamento si ferma ora.","settings.switch_off":"Chi pu\xF2 spegnere il riscaldamento per tutti","settings.switch_off_hint":"Gli amministratori e:","settings.own_cancel":"Chi ha fatto la richiesta pu\xF2 sempre annullarla.",greeting:"Ciao, {name}","today.label":"Casa oggi","today.nobody":"Nessuno oggi","away.until_label":"Fino al (facoltativo)","away.line":"Fuori casa","away.line_until":"Fuori casa fino al {date}","members.add":"Membro","card.no_heater":"Nessuno scaldacqua Hot Water Ready \xE8 ancora configurato.","card.loading":"Caricamento\u2026","card.error":"Non ha funzionato: {message}","cluster.warning":"Le docce dalle {when} richiedono l'acqua a {needed} \xB0C, ma lo scaldacqua arriva solo a {cap} \xB0C: le ultime potrebbero essere meno calde.","tabs.people":"Persone","tabs.week":"Settimana","week.days":"Lun,Mar,Mer,Gio,Ven,Sab,Dom","week.showers":"docce","week.windows":"finestre di riscaldamento","week.busiest":"giorno pi\xF9 pieno","week.heating":"Riscaldamento","week.away":"fuori casa","week.virtual":"virtuale \xB7 {count}","week.per_week":"{count} a settimana","week.hint":"Tocca una persona per evidenziarne gli orari. Le barre mostrano quando lo scaldacqua pu\xF2 scaldare ogni giorno (dalle {start} alle {end}).","settings.open":"Impostazioni dello scaldacqua","settings.close":"Chiudi","settings.target":"Temperatura obiettivo","settings.target_hint":"Pronta quando l'acqua arriva qui","settings.target_down":"Abbassa l'obiettivo","settings.target_up":"Alza l'obiettivo","settings.margin":"Margine","settings.band":"Si ferma a {stop} \xB0C, riparte a {restart} \xB0C","settings.margin_down":"Riduci il margine","settings.margin_up":"Aumenta il margine","settings.automatic":"Controllo automatico","settings.automatic_hint":"Disattivato: lo scaldacqua \xE8 comandato a mano","settings.more":"Altre impostazioni","rate.title":"Velocit\xE0 di riscaldamento","rate.unit":"min per \xB0C","rate.automatic":"Automatica","rate.fixed":"Fissa","rate.learned":"Appresa: mediana dei {count} riscaldamenti puliti degli ultimi {days} giorni","rate.default_one":"Valore iniziale: ancora 1 riscaldamento pulito negli ultimi {days} giorni e viene appresa","rate.default_many":"Valore iniziale: ancora {count} riscaldamenti puliti negli ultimi {days} giorni e viene appresa","rate.manual":"Fissata a mano: l'apprendimento continua, ma non viene usato","rate.runs":"Riscaldamenti puliti usati","rate.example":"Ora {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} min, pi\xF9 {margin} min di margine: parte {lead} min prima","rate.example_cap":" (al massimo)","rate.example_warm":"Ora {from} \xB0C: gi\xE0 all'obiettivo, non serve partire prima","rate.physics":"Secondo la fisica, tutto il serbatoio scaldato dalla resistenza: {rate} min/\xB0C","rate.physics_range":"Secondo la fisica: tra {fast} min/\xB0C (solo l'acqua sopra la resistenza) e {slow} min/\xB0C (tutto il serbatoio)","rate.volume":"Equivale a scaldare {litres} L dei {tank} L del serbatoio","rate.far_below":": {percent}% sotto la fisica. Controlla il volume del serbatoio, la potenza della resistenza e dove si trova la sonda.","rate.far_above":": {percent}% sopra la fisica. Controlla il volume del serbatoio, la potenza della resistenza e dove si trova la sonda.","rate.suggested_learned":"Suggerita: {rate} (appresa)","rate.suggested_physics":"Suggerita: {rate} (fisica del serbatoio)","rate.suggested_default":"Suggerita: {rate} (valore iniziale)","rate.use":"Usa","rate.down":"0,1 min per \xB0C in meno","rate.up":"0,1 min per \xB0C in pi\xF9","rate.recalculate":"Ricalcola dalla cronologia","rate.recalculating":"Analisi dell'ultima settimana\u2026","rate.found":"Trovati {count} riscaldamenti puliti nella cronologia; velocit\xE0 appresa: {rate} min/\xB0C.","rate.found_too_few":"Trovati {count} riscaldamenti puliti nella cronologia; ne servono {needed} per imparare.","solar.title":"Confronto solare","solar.none":"Ancora nessuna finestra registrata negli ultimi 30 giorni.","solar.would":"Con la regola solare attiva, l'acqua sarebbe stata pronta in tempo in {on_time} finestre su {windows}","solar.did":"Con la regola solare, l'acqua \xE8 stata pronta in tempo in {on_time} finestre su {windows}","solar.would_less":", e lo scaldacqua avrebbe funzionato {minutes} minuti in meno","solar.would_more":", e lo scaldacqua avrebbe funzionato {minutes} minuti in pi\xF9","solar.did_less":", e lo scaldacqua ha funzionato {minutes} minuti in meno","solar.did_more":", e lo scaldacqua ha funzionato {minutes} minuti in pi\xF9","solar.kwh":", circa {kwh} kWh","solar.applied":" La regola \xE8 stata applicata in {applied} di esse: in tempo in {on_time}.","subline.starts_at":"Inizia a scaldare verso le {when}.","subline.starts_at_solar":"Inizia a scaldare verso le {when}, se il sole non ci ha gi\xE0 pensato.","subline.asked_by_one":"Richiesta da {name}, che viene avvisato quando \xE8 pronta.","subline.asked_by_many":"Richiesta da {names}. Ognuno viene avvisato quando \xE8 pronta.","names.and":" e ","today.you":"Tu","list.mine":"I miei orari","list.count_one":"1 orario","list.count":"{count} orari","list.virtual":"Membro virtuale \xB7 orari condivisi della casa","away.paused":"In pausa. Gli orari restano salvati.","member_settings.open":"Impostazioni degli orari","visibility.private":"Privato","visibility.hint_own":"Gli altri membri non vedono questi orari n\xE9 le tue richieste Scalda ora; gli amministratori s\xEC.","visibility.hint_virtual":"Solo gli amministratori vedono questi orari.","settings.no_people":"Non ci sono ancora persone in Home Assistant da scegliere.","editor.heater":"Scaldabagno","editor.compact":"Compatta: solo temperatura e stato, senza comandi","editor.tap_action":"Azione al tocco"};var _t={"status.waiting":"\u5F85\u6A5F\u4E2D","status.heating":"\u52A0\u71B1\u4E2D","status.ready":"\u6E96\u5099\u5B8C\u4E86","status.fault":"\u6545\u969C","status.manual":"\u624B\u52D5","headline.heating_for":"\u52A0\u71B1\u4E2D: \u7D04 {minutes} \u5206\u3067\u6E96\u5099\u5B8C\u4E86","headline.ready_at":"{when} \u306B\u6E96\u5099\u5B8C\u4E86","subline.next_at":"\u6B21\u306F {when}","when.today":"{time}","when.tomorrow":"\u660E\u65E5 {time}","when.weekday":"{weekday} {time}","ring.target":"\u76EE\u6A19 {target}\xB0","weekday.letters":"\u6708,\u706B,\u6C34,\u6728,\u91D1,\u571F,\u65E5","members.none":"\u30E1\u30F3\u30D0\u30FC\u306F\u307E\u3060\u3044\u307E\u305B\u3093\u3002\u7BA1\u7406\u8005\u304C\u7D71\u5408\u306E\u8A2D\u5B9A\u3067\u8FFD\u52A0\u3057\u307E\u3059\u3002","list.empty":"\u6E96\u5099\u6642\u523B\u306F\u307E\u3060\u3042\u308A\u307E\u305B\u3093\u3002","list.add":"\u6E96\u5099\u6642\u523B\u3092\u8FFD\u52A0","sheet.delete":"\u524A\u9664","list.switch":"\u30AA\u30F3/\u30AA\u30D5","sheet.title":"\u65B0\u3057\u3044\u6E96\u5099\u6642\u523B","sheet.edit_title":"\u6E96\u5099\u6642\u523B\u3092\u5909\u66F4","list.edit":"\u3053\u306E\u6E96\u5099\u6642\u523B\u3092\u5909\u66F4","sheet.time":"\u6642\u523B","sheet.hour":"\u6642","sheet.minute":"\u5206","sheet.days":"\u66DC\u65E5","sheet.save":"\u4FDD\u5B58","sheet.cancel":"\u30AD\u30E3\u30F3\u30BB\u30EB","clock.title":"\u6642\u523B\u3092\u9078\u629E","clock.title_keys":"\u6642\u523B\u3092\u5165\u529B","clock.ok":"OK","clock.to_keys":"\u6642\u523B\u3092\u5165\u529B\u3059\u308B","clock.to_dial":"\u6642\u8A08\u3092\u4F7F\u3046","clock.am":"\u5348\u524D","clock.pm":"\u5348\u5F8C","clock.invalid":"\u6709\u52B9\u306A\u6642\u523B\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044","clock.change":"\u6642\u523B\u3092\u5909\u66F4","fault.sensor_unavailable":"\u6545\u969C: \u6C34\u6E29\u30BB\u30F3\u30B5\u30FC\u304B\u3089\u8AAD\u307F\u53D6\u308A\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u52A0\u71B1\u3092\u505C\u6B62\u3057\u307E\u3057\u305F\u3002","fault.not_rising":"\u6545\u969C: \u6C34\u6E29\u304C\u4E0A\u304C\u308A\u307E\u305B\u3093\u3002\u52A0\u71B1\u3092\u505C\u6B62\u3057\u307E\u3057\u305F\u3002\u4FEE\u5FA9\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","fault.no_consumption":"\u6545\u969C: \u30D2\u30FC\u30BF\u30FC\u304C\u96FB\u6C17\u3092\u4F7F\u3063\u3066\u3044\u307E\u305B\u3093\u3002\u52A0\u71B1\u3092\u505C\u6B62\u3057\u307E\u3057\u305F\u3002\u4FEE\u5FA9\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","fault.relay_stuck":"\u6545\u969C: \u30AA\u30D5\u306A\u306E\u306B\u30D2\u30FC\u30BF\u30FC\u304C\u96FB\u6C17\u3092\u4F7F\u3063\u3066\u3044\u307E\u3059\u3002\u30EA\u30EC\u30FC\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","fault.top_probe":"\u8B66\u544A: \u30E1\u30A4\u30F3\u30D7\u30ED\u30FC\u30D6\u304C\u7DE9\u3093\u3067\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\u52A0\u71B1\u306F\u7D9A\u304D\u307E\u3059\u3002\u4FEE\u5FA9\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","fault.middle_probe":"\u8B66\u544A: 2\u3064\u76EE\u306E\u30D7\u30ED\u30FC\u30D6\u304C\u7DE9\u3093\u3067\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\u52A0\u71B1\u306F\u7D9A\u304D\u307E\u3059\u3002\u4FEE\u5FA9\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","fault.probes_disagree":"\u8B66\u544A: 2\u3064\u306E\u30D7\u30ED\u30FC\u30D6\u306E\u5024\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002\u52A0\u71B1\u306F\u7D9A\u304D\u307E\u3059\u3002\u4FEE\u5FA9\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","element.on":"\u30D2\u30FC\u30BF\u30FC \u30AA\u30F3","element.off":"\u30D2\u30FC\u30BF\u30FC \u30AA\u30D5","element.drawing":"{state} \xB7 {watts} W \u4F7F\u7528\u4E2D","keep_hot.until":"{time} \u307E\u3067\u4FDD\u6E29\u4E2D","keep_hot.title":"\u6E96\u5099\u5B8C\u4E86\u5F8C\u306E\u4FDD\u6E29","keep_hot.hint":"\u300C\u6E96\u5099\u5B8C\u4E86\u300D\u306E\u30E1\u30C3\u30BB\u30FC\u30B8\u306E\u5F8C\u3001\u30D2\u30FC\u30BF\u30FC\u306F\u3053\u306E\u6642\u9593\u304A\u6E6F\u3092\u4FDD\u6E29\u3057\u3066\u304B\u3089\u30AA\u30D5\u306B\u306A\u308A\u307E\u3059\u3002","keep_hot.more":"\u4FDD\u6E29\u6642\u9593\u3092\u9078\u3076","keep_hot.cancel":"\u30AD\u30E3\u30F3\u30BB\u30EB","keep_hot.minutes":"{n} \u5206","keep_hot.hours":"{n} \u6642\u9593","heat_now_target.title":"\u6E29\u5EA6","heat_now_target.hint":"\u3053\u306E\u4F9D\u983C\u306E\u307F\u3002\u7D66\u6E6F\u5668\u306F {target} \xB0C \u306E\u307E\u307E\u3067\u3059\u3002","heat_now_target.down":"1 \xB0C \u4E0B\u3052\u308B","heat_now_target.up":"1 \xB0C \u4E0A\u3052\u308B",manual:"\u81EA\u52D5\u5236\u5FA1\u306F\u30AA\u30D5\u3067\u3059\u3002\u30D2\u30FC\u30BF\u30FC\u306F\u624B\u52D5\u3067\u64CD\u4F5C\u3055\u308C\u3066\u3044\u307E\u3059\u3002","note.not_rising_skipped":"\u3053\u306E\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u306F\u52A0\u71B1\u4E2D\u304B\u3069\u3046\u304B\u3092\u77E5\u3089\u305B\u306A\u3044\u305F\u3081\u3001\u300C\u6C34\u6E29\u304C\u4E0A\u304C\u3089\u306A\u3044\u300D\u3068\u300C\u30D2\u30FC\u30BF\u30FC\u304C\u96FB\u6C17\u3092\u4F7F\u3063\u3066\u3044\u306A\u3044\u300D\u306E\u30C1\u30A7\u30C3\u30AF\u306F\u884C\u3044\u307E\u305B\u3093\u3002","heat_now.start":"\u4ECA\u3059\u3050\u52A0\u71B1","heat_now.cancel":"\u30AD\u30E3\u30F3\u30BB\u30EB","heat_now.join":"\u6CB8\u3044\u305F\u3089\u77E5\u3089\u305B\u308B","heat_now.leave":"\u77E5\u3089\u305B\u306A\u3044","subline.for":"\u5BFE\u8C61: {list}\u3002","item.at":"{name} {time}","switch_off.link":"\u52A0\u71B1\u3092\u30AA\u30D5\u306B\u3059\u308B\u2026","switch_off.title":"\u52A0\u71B1\u3092\u30AA\u30D5\u306B\u3057\u307E\u3059\u304B\uFF1F","switch_off.confirm":"\u30AA\u30D5\u306B\u3059\u308B","switch_off.keep":"\u30AD\u30E3\u30F3\u30BB\u30EB","switch_off.asked_one":"{names} \u306B\u306F\u901A\u77E5\u3055\u308C\u306A\u304F\u306A\u308A\u307E\u3059\u3002","switch_off.asked_many":"{names} \u306B\u306F\u901A\u77E5\u3055\u308C\u306A\u304F\u306A\u308A\u307E\u3059\u3002","switch_off.skipped_one":"\u304A\u6E6F\u304C\u4F7F\u3048\u306A\u304F\u306A\u308B\u4EBA: {list}\u3002","switch_off.skipped_many":"\u304A\u6E6F\u304C\u4F7F\u3048\u306A\u304F\u306A\u308B\u4EBA: {list}\u3002","switch_off.back":"\u6B21\u306E\u6E96\u5099\u6642\u523B\u306B\u306F\u81EA\u52D5\u3067\u307E\u305F\u30AA\u30F3\u306B\u306A\u308A\u307E\u3059\u3002","switch_off.nobody":"\u52A0\u71B1\u3092\u4ECA\u3059\u3050\u505C\u6B62\u3057\u307E\u3059\u3002","settings.switch_off":"\u5168\u54E1\u5206\u306E\u52A0\u71B1\u3092\u30AA\u30D5\u306B\u3067\u304D\u308B\u4EBA","settings.switch_off_hint":"\u7BA1\u7406\u8005\u3068\u4EE5\u4E0B\u306E\u4EBA:","settings.own_cancel":"\u8981\u6C42\u3057\u305F\u672C\u4EBA\u306F\u3044\u3064\u3067\u3082\u81EA\u5206\u306E\u8981\u6C42\u3092\u53D6\u308A\u6D88\u305B\u307E\u3059\u3002",greeting:"\u3053\u3093\u306B\u3061\u306F\u3001{name} \u3055\u3093","today.label":"\u4ECA\u65E5\u306E\u5BB6","today.nobody":"\u4ECA\u65E5\u306F\u8AB0\u3082\u3044\u307E\u305B\u3093","away.until_label":"\u7D42\u4E86\u65E5\uFF08\u4EFB\u610F\uFF09","away.line":"\u4E0D\u5728","away.line_until":"{date} \u307E\u3067\u4E0D\u5728","members.add":"\u30E1\u30F3\u30D0\u30FC","card.no_heater":"Hot Water Ready \u306E\u30D2\u30FC\u30BF\u30FC\u306F\u307E\u3060\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002","card.loading":"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026","card.error":"\u3046\u307E\u304F\u3044\u304D\u307E\u305B\u3093\u3067\u3057\u305F: {message}","cluster.warning":"{when} \u304B\u3089\u306E\u30B7\u30E3\u30EF\u30FC\u306B\u306F {needed} \xB0C \u306E\u304A\u6E6F\u304C\u5FC5\u8981\u3067\u3059\u304C\u3001\u30D2\u30FC\u30BF\u30FC\u306F {cap} \xB0C \u307E\u3067\u3057\u304B\u4E0A\u3052\u3089\u308C\u307E\u305B\u3093\u3002\u6700\u5F8C\u306E\u65B9\u306F\u306C\u308B\u304F\u306A\u308B\u304B\u3082\u3057\u308C\u307E\u305B\u3093\u3002","tabs.people":"\u4EBA","tabs.week":"\u9031","week.days":"\u6708,\u706B,\u6C34,\u6728,\u91D1,\u571F,\u65E5","week.showers":"\u30B7\u30E3\u30EF\u30FC","week.windows":"\u52A0\u71B1\u6642\u9593\u5E2F","week.busiest":"\u6700\u3082\u591A\u3044\u65E5","week.heating":"\u52A0\u71B1","week.away":"\u4E0D\u5728","week.virtual":"\u4EEE\u60F3 \xB7 {count}","week.per_week":"\u9031 {count} \u56DE","week.hint":"\u4EBA\u3092\u30BF\u30C3\u30D7\u3059\u308B\u3068\u3001\u305D\u306E\u4EBA\u306E\u6642\u523B\u304C\u5F37\u8ABF\u8868\u793A\u3055\u308C\u307E\u3059\u3002\u30D0\u30FC\u306F\u5404\u65E5\u306B\u30D2\u30FC\u30BF\u30FC\u304C\u52A0\u71B1\u3067\u304D\u308B\u6642\u9593\u5E2F\u3092\u793A\u3057\u307E\u3059\uFF08{start}\u301C{end}\uFF09\u3002","settings.open":"\u30D2\u30FC\u30BF\u30FC\u306E\u8A2D\u5B9A","settings.close":"\u9589\u3058\u308B","settings.target":"\u76EE\u6A19\u6E29\u5EA6","settings.target_hint":"\u304A\u6E6F\u304C\u3053\u306E\u6E29\u5EA6\u306B\u306A\u3063\u305F\u3089\u6E96\u5099\u5B8C\u4E86","settings.target_down":"\u76EE\u6A19\u3092\u4E0B\u3052\u308B","settings.target_up":"\u76EE\u6A19\u3092\u4E0A\u3052\u308B","settings.margin":"\u30DE\u30FC\u30B8\u30F3","settings.band":"{stop} \xB0C \u3067\u505C\u6B62\u3001{restart} \xB0C \u3067\u518D\u958B","settings.margin_down":"\u30DE\u30FC\u30B8\u30F3\u3092\u4E0B\u3052\u308B","settings.margin_up":"\u30DE\u30FC\u30B8\u30F3\u3092\u4E0A\u3052\u308B","settings.automatic":"\u81EA\u52D5\u5236\u5FA1","settings.automatic_hint":"\u30AA\u30D5: \u30D2\u30FC\u30BF\u30FC\u3092\u624B\u52D5\u3067\u64CD\u4F5C","settings.more":"\u305D\u306E\u4ED6\u306E\u8A2D\u5B9A","rate.title":"\u52A0\u71B1\u901F\u5EA6","rate.unit":"\u5206/\xB0C","rate.automatic":"\u81EA\u52D5","rate.fixed":"\u56FA\u5B9A","rate.learned":"\u5B66\u7FD2\u5024: \u904E\u53BB {days} \u65E5\u9593\u306E\u6B63\u5E38\u306A\u52A0\u71B1 {count} \u56DE\u306E\u4E2D\u592E\u5024","rate.default_one":"\u521D\u671F\u5024: \u904E\u53BB {days} \u65E5\u9593\u306B\u3042\u3068 1 \u56DE\u6B63\u5E38\u306A\u52A0\u71B1\u304C\u3042\u308C\u3070\u5B66\u7FD2\u3057\u307E\u3059","rate.default_many":"\u521D\u671F\u5024: \u904E\u53BB {days} \u65E5\u9593\u306B\u3042\u3068 {count} \u56DE\u6B63\u5E38\u306A\u52A0\u71B1\u304C\u3042\u308C\u3070\u5B66\u7FD2\u3057\u307E\u3059","rate.manual":"\u624B\u52D5\u3067\u56FA\u5B9A: \u5B66\u7FD2\u306F\u7D9A\u304D\u307E\u3059\u304C\u3001\u4F7F\u308F\u308C\u307E\u305B\u3093","rate.runs":"\u5143\u306B\u306A\u3063\u305F\u6B63\u5E38\u306A\u52A0\u71B1","rate.example":"\u73FE\u5728 {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} \u5206\u3001\u30DE\u30FC\u30B8\u30F3 {margin} \u5206\u3092\u52A0\u3048\u3066 {lead} \u5206\u524D\u306B\u958B\u59CB","rate.example_cap":"\uFF08\u6700\u5927\uFF09","rate.example_warm":"\u73FE\u5728 {from} \xB0C: \u3059\u3067\u306B\u76EE\u6A19\u306B\u9054\u3057\u3066\u3044\u308B\u305F\u3081\u3001\u65E9\u3081\u306B\u59CB\u3081\u308B\u5FC5\u8981\u306F\u3042\u308A\u307E\u305B\u3093","rate.physics":"\u7269\u7406\u8A08\u7B97\u3067\u306F\u3001\u30D2\u30FC\u30BF\u30FC\u3067\u30BF\u30F3\u30AF\u5168\u4F53\u3092\u52A0\u71B1\u3057\u305F\u5834\u5408: {rate} \u5206/\xB0C","rate.physics_range":"\u7269\u7406\u8A08\u7B97\u3067\u306F: {fast} \u5206/\xB0C\uFF08\u30D2\u30FC\u30BF\u30FC\u3088\u308A\u4E0A\u306E\u6C34\u306E\u307F\uFF09\u304B\u3089 {slow} \u5206/\xB0C\uFF08\u30BF\u30F3\u30AF\u5168\u4F53\uFF09\u306E\u9593","rate.volume":"\u30BF\u30F3\u30AF {tank} L \u306E\u3046\u3061 {litres} L \u3092\u52A0\u71B1\u3059\u308B\u306E\u306B\u76F8\u5F53","rate.far_below":": \u7269\u7406\u8A08\u7B97\u3088\u308A {percent}% \u4F4E\u3044\u5024\u3067\u3059\u3002\u30BF\u30F3\u30AF\u5BB9\u91CF\u3001\u30D2\u30FC\u30BF\u30FC\u306E\u51FA\u529B\u3001\u30D7\u30ED\u30FC\u30D6\u306E\u4F4D\u7F6E\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","rate.far_above":": \u7269\u7406\u8A08\u7B97\u3088\u308A {percent}% \u9AD8\u3044\u5024\u3067\u3059\u3002\u30BF\u30F3\u30AF\u5BB9\u91CF\u3001\u30D2\u30FC\u30BF\u30FC\u306E\u51FA\u529B\u3001\u30D7\u30ED\u30FC\u30D6\u306E\u4F4D\u7F6E\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","rate.suggested_learned":"\u63A8\u5968: {rate}\uFF08\u5B66\u7FD2\u5024\uFF09","rate.suggested_physics":"\u63A8\u5968: {rate}\uFF08\u30BF\u30F3\u30AF\u306E\u7269\u7406\u8A08\u7B97\uFF09","rate.suggested_default":"\u63A8\u5968: {rate}\uFF08\u521D\u671F\u5024\uFF09","rate.use":"\u4F7F\u7528","rate.down":"0.1 \u5206/\xB0C \u6E1B\u3089\u3059","rate.up":"0.1 \u5206/\xB0C \u5897\u3084\u3059","rate.recalculate":"\u5C65\u6B74\u304B\u3089\u518D\u8A08\u7B97","rate.recalculating":"\u904E\u53BB1\u9031\u9593\u3092\u78BA\u8A8D\u3057\u3066\u3044\u307E\u3059\u2026","rate.found":"\u5C65\u6B74\u306B\u6B63\u5E38\u306A\u52A0\u71B1\u304C {count} \u56DE\u898B\u3064\u304B\u308A\u307E\u3057\u305F\u3002{rate} \u5206/\xB0C \u3092\u5B66\u7FD2\u3057\u307E\u3057\u305F\u3002","rate.found_too_few":"\u5C65\u6B74\u306B\u6B63\u5E38\u306A\u52A0\u71B1\u304C {count} \u56DE\u898B\u3064\u304B\u308A\u307E\u3057\u305F\u3002\u5B66\u7FD2\u306B\u306F {needed} \u56DE\u5FC5\u8981\u3067\u3059\u3002","solar.title":"\u592A\u967D\u5149\u306E\u6BD4\u8F03","solar.none":"\u904E\u53BB30\u65E5\u9593\u306B\u8A18\u9332\u3055\u308C\u305F\u6642\u9593\u5E2F\u306F\u307E\u3060\u3042\u308A\u307E\u305B\u3093\u3002","solar.would":"\u592A\u967D\u5149\u30EB\u30FC\u30EB\u3092\u30AA\u30F3\u306B\u3057\u3066\u3044\u308C\u3070\u3001{windows} \u56DE\u306E\u6642\u9593\u5E2F\u306E\u3046\u3061 {on_time} \u56DE\u3067\u304A\u6E6F\u304C\u6642\u9593\u3069\u304A\u308A\u306B\u6E96\u5099\u3067\u304D\u3066\u3044\u307E\u3057\u305F","solar.did":"\u592A\u967D\u5149\u30EB\u30FC\u30EB\u3067\u3001{windows} \u56DE\u306E\u6642\u9593\u5E2F\u306E\u3046\u3061 {on_time} \u56DE\u3067\u304A\u6E6F\u304C\u6642\u9593\u3069\u304A\u308A\u306B\u6E96\u5099\u3067\u304D\u307E\u3057\u305F","solar.would_less":"\u3002\u30D2\u30FC\u30BF\u30FC\u306E\u904B\u8EE2\u306F {minutes} \u5206\u77ED\u304F\u306A\u3063\u3066\u3044\u307E\u3057\u305F","solar.would_more":"\u3002\u30D2\u30FC\u30BF\u30FC\u306E\u904B\u8EE2\u306F {minutes} \u5206\u9577\u304F\u306A\u3063\u3066\u3044\u307E\u3057\u305F","solar.did_less":"\u3002\u30D2\u30FC\u30BF\u30FC\u306E\u904B\u8EE2\u306F {minutes} \u5206\u77ED\u304F\u306A\u308A\u307E\u3057\u305F","solar.did_more":"\u3002\u30D2\u30FC\u30BF\u30FC\u306E\u904B\u8EE2\u306F {minutes} \u5206\u9577\u304F\u306A\u308A\u307E\u3057\u305F","solar.kwh":"\uFF08\u7D04 {kwh} kWh\uFF09","solar.applied":" \u305D\u306E\u3046\u3061 {applied} \u56DE\u3067\u30EB\u30FC\u30EB\u304C\u9069\u7528\u3055\u308C\u3001{on_time} \u56DE\u306F\u6642\u9593\u3069\u304A\u308A\u3067\u3057\u305F\u3002","subline.starts_at":"{when} \u3054\u308D\u306B\u52A0\u71B1\u3092\u59CB\u3081\u307E\u3059\u3002","subline.starts_at_solar":"\u305D\u308C\u307E\u3067\u306B\u592A\u967D\u5149\u3067\u6E29\u307E\u3063\u3066\u3044\u306A\u3051\u308C\u3070\u3001{when} \u3054\u308D\u306B\u52A0\u71B1\u3092\u59CB\u3081\u307E\u3059\u3002","subline.asked_by_one":"{name} \u3055\u3093\u306E\u8981\u6C42\u3067\u3059\u3002\u6E96\u5099\u304C\u3067\u304D\u305F\u3089\u901A\u77E5\u3057\u307E\u3059\u3002","subline.asked_by_many":"{names} \u3055\u3093\u306E\u8981\u6C42\u3067\u3059\u3002\u6E96\u5099\u304C\u3067\u304D\u305F\u3089\u305D\u308C\u305E\u308C\u306B\u901A\u77E5\u3057\u307E\u3059\u3002","names.and":"\u3068","today.you":"\u3042\u306A\u305F","list.mine":"\u81EA\u5206\u306E\u6E96\u5099\u6642\u523B","list.count_one":"\u6E96\u5099\u6642\u523B 1 \u4EF6","list.count":"\u6E96\u5099\u6642\u523B {count} \u4EF6","list.virtual":"\u4EEE\u60F3\u30E1\u30F3\u30D0\u30FC \xB7 \u5BB6\u65CF\u5171\u901A\u306E\u6642\u523B","away.paused":"\u4E00\u6642\u505C\u6B62\u4E2D\u3002\u6642\u523B\u306F\u4FDD\u6301\u3055\u308C\u307E\u3059\u3002","member_settings.open":"\u6E96\u5099\u6642\u523B\u306E\u8A2D\u5B9A","visibility.private":"\u975E\u516C\u958B","visibility.hint_own":"\u307B\u304B\u306E\u30E1\u30F3\u30D0\u30FC\u306B\u306F\u3053\u308C\u3089\u306E\u6642\u523B\u3068\u300C\u4ECA\u3059\u3050\u52A0\u71B1\u300D\u306E\u4F9D\u983C\u306F\u8868\u793A\u3055\u308C\u307E\u305B\u3093\u3002\u7BA1\u7406\u8005\u306B\u306F\u8868\u793A\u3055\u308C\u307E\u3059\u3002","visibility.hint_virtual":"\u3053\u308C\u3089\u306E\u6642\u523B\u306F\u7BA1\u7406\u8005\u306B\u306E\u307F\u8868\u793A\u3055\u308C\u307E\u3059\u3002","settings.no_people":"Home Assistant \u306B\u9078\u629E\u3067\u304D\u308B\u4EBA\u304C\u307E\u3060\u3044\u307E\u305B\u3093\u3002","editor.heater":"\u7D66\u6E6F\u5668","editor.compact":"\u30B3\u30F3\u30D1\u30AF\u30C8: \u6E29\u5EA6\u3068\u72B6\u614B\u306E\u307F\u3001\u64CD\u4F5C\u306A\u3057","editor.tap_action":"\u30BF\u30C3\u30D7\u6642\u306E\u52D5\u4F5C"};var wt={"status.waiting":"Venter","status.heating":"Varmer","status.ready":"Klart","status.fault":"Feil","status.manual":"Manuell","headline.heating_for":"Varmer: klart om ca. {minutes} min","headline.ready_at":"Klart {when}","subline.next_at":"Neste {when}","when.today":"kl. {time}","when.tomorrow":"i morgen kl. {time}","when.weekday":"{weekday} kl. {time}","ring.target":"m\xE5l {target}\xB0","weekday.letters":"M,T,O,T,F,L,S","members.none":"Ingen medlemmer enn\xE5. En administrator legger dem til i innstillingene for integrasjonen.","list.empty":"Ingen klartider enn\xE5.","list.add":"Legg til en klartid","sheet.delete":"Slett","list.switch":"P\xE5 eller av","sheet.title":"Ny klartid","sheet.edit_title":"Endre klartid","list.edit":"Endre denne klartiden","sheet.time":"Tid","sheet.hour":"Time","sheet.minute":"Minutt","sheet.days":"Dager","sheet.save":"Lagre","sheet.cancel":"Avbryt","clock.title":"Velg tid","clock.title_keys":"Skriv inn tid","clock.ok":"OK","clock.to_keys":"Skriv inn tiden","clock.to_dial":"Bruk klokken","clock.am":"AM","clock.pm":"PM","clock.invalid":"Skriv inn en gyldig tid","clock.change":"Endre tiden","fault.sensor_unavailable":"Feil: sensoren for vanntemperatur gir ingen m\xE5linger. Oppvarmingen har stoppet.","fault.not_rising":"Feil: vannet blir ikke varmere. Oppvarmingen har stoppet; se Reparasjoner.","fault.no_consumption":"Feil: berederen trekker ikke str\xF8m. Oppvarmingen har stoppet; se Reparasjoner.","fault.relay_stuck":"Feil: berederen trekker str\xF8m selv om den er sl\xE5tt av. Kontroller rel\xE9et.","fault.top_probe":"Advarsel: hovedf\xF8leren kan sitte l\xF8st. Oppvarmingen fortsetter; se Reparasjoner.","fault.middle_probe":"Advarsel: den andre f\xF8leren kan sitte l\xF8st. Oppvarmingen fortsetter; se Reparasjoner.","fault.probes_disagree":"Advarsel: de to f\xF8lerne viser forskjellig. Oppvarmingen fortsetter; se Reparasjoner.","element.on":"Berederen p\xE5","element.off":"Berederen av","element.drawing":"{state} \xB7 trekker {watts} W","keep_hot.until":"Holdes varmt til kl. {time}","keep_hot.title":"Hold varmt n\xE5r det er klart","keep_hot.hint":"Etter meldingen \xABklart\xBB holder berederen vannet varmt s\xE5 lenge, og sl\xE5r seg deretter av.","keep_hot.more":"Velg hvor lenge det skal holdes varmt","keep_hot.cancel":"Avbryt","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} t","heat_now_target.title":"Temperatur","heat_now_target.hint":"Bare for denne foresp\xF8rselen; varmtvannsberederen blir p\xE5 {target} \xB0C.","heat_now_target.down":"1 \xB0C mindre","heat_now_target.up":"1 \xB0C mer",manual:"Automatisk styring er av: berederen styres manuelt.","note.not_rising_skipped":"Termostaten oppgir ikke n\xE5r den varmer, s\xE5 kontrollene \xABvannet blir ikke varmere\xBB og \xABberederen trekker ikke str\xF8m\xBB gj\xF8res ikke.","heat_now.start":"Varm n\xE5","heat_now.cancel":"Avbryt","heat_now.join":"Si fra n\xE5r det er varmt","heat_now.leave":"Ikke si fra til meg","subline.for":"For {list}.","item.at":"{name} kl. {time}","switch_off.link":"Sl\xE5 av oppvarmingen\u2026","switch_off.title":"Sl\xE5 av oppvarmingen?","switch_off.confirm":"Sl\xE5 av","switch_off.keep":"Avbryt","switch_off.asked_one":"{names} f\xE5r ikke lenger beskjed.","switch_off.asked_many":"{names} f\xE5r ikke lenger beskjed.","switch_off.skipped_one":"Uten varmtvann: {list}.","switch_off.skipped_many":"Uten varmtvann: {list}.","switch_off.back":"Den sl\xE5r seg p\xE5 igjen av seg selv til neste klartid.","switch_off.nobody":"Oppvarmingen stopper n\xE5.","settings.switch_off":"Hvem som kan sl\xE5 av oppvarmingen for alle","settings.switch_off_hint":"Administratorene og:","settings.own_cancel":"Den som ba om det, kan alltid avbryte sin egen foresp\xF8rsel.",greeting:"Hei, {name}","today.label":"Hjemme i dag","today.nobody":"Ingen i dag","away.until_label":"Til (valgfritt)","away.line":"Borte","away.line_until":"Borte til {date}","members.add":"Medlem","card.no_heater":"Ingen Hot Water Ready-bereder er satt opp enn\xE5.","card.loading":"Laster inn\u2026","card.error":"Det gikk ikke: {message}","cluster.warning":"Dusjene fra {when} trenger vannet p\xE5 {needed} \xB0C, men berederen varmer bare til {cap} \xB0C: de siste kan bli kaldere.","tabs.people":"Personer","tabs.week":"Uke","week.days":"Man,Tir,Ons,Tor,Fre,L\xF8r,S\xF8n","week.showers":"dusjer","week.windows":"oppvarmingsvinduer","week.busiest":"travleste dag","week.heating":"Oppvarming","week.away":"borte","week.virtual":"virtuelt \xB7 {count}","week.per_week":"{count} i uken","week.hint":"Trykk p\xE5 en person for \xE5 utheve tidene til personen. Stolpene viser n\xE5r berederen kan varme hver dag ({start} til {end}).","settings.open":"Innstillinger for berederen","settings.close":"Lukk","settings.target":"M\xE5ltemperatur","settings.target_hint":"Klart n\xE5r vannet n\xE5r hit","settings.target_down":"Senk m\xE5let","settings.target_up":"Hev m\xE5let","settings.margin":"Margin","settings.band":"Stopper ved {stop} \xB0C, starter igjen ved {restart} \xB0C","settings.margin_down":"Senk marginen","settings.margin_up":"Hev marginen","settings.automatic":"Automatisk styring","settings.automatic_hint":"Av: berederen styres manuelt","settings.more":"Flere innstillinger","rate.title":"Oppvarmingstakt","rate.unit":"min per \xB0C","rate.automatic":"Automatisk","rate.fixed":"Fast","rate.learned":"L\xE6rt: median av de {count} rene oppvarmingene de siste {days} dagene","rate.default_one":"Startverdi: 1 ren oppvarming til de siste {days} dagene, s\xE5 er takten l\xE6rt","rate.default_many":"Startverdi: {count} rene oppvarminger til de siste {days} dagene, s\xE5 er takten l\xE6rt","rate.manual":"Satt fast manuelt: l\xE6ringen fortsetter, men brukes ikke","rate.runs":"Rene oppvarminger som grunnlag","rate.example":"N\xE5 {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} min, pluss {margin} min margin: starter {lead} min f\xF8r","rate.example_cap":" (maks)","rate.example_warm":"N\xE5 {from} \xB0C: allerede ved m\xE5let, ingen grunn til \xE5 starte tidlig","rate.physics":"Etter fysikken, hele tanken varmet av elementet: {rate} min/\xB0C","rate.physics_range":"Etter fysikken: mellom {fast} min/\xB0C (bare vannet over elementet) og {slow} min/\xB0C (hele tanken)","rate.volume":"Tilsvarer \xE5 varme {litres} L av tankens {tank} L","rate.far_below":": {percent}% under fysikken. Kontroller tankvolumet, elementets effekt og hvor f\xF8leren sitter.","rate.far_above":": {percent}% over fysikken. Kontroller tankvolumet, elementets effekt og hvor f\xF8leren sitter.","rate.suggested_learned":"Forslag: {rate} (l\xE6rt)","rate.suggested_physics":"Forslag: {rate} (tankens fysikk)","rate.suggested_default":"Forslag: {rate} (startverdi)","rate.use":"Bruk","rate.down":"0,1 min per \xB0C mindre","rate.up":"0,1 min per \xB0C mer","rate.recalculate":"Beregn p\xE5 nytt fra historikken","rate.recalculating":"G\xE5r gjennom den siste uken\u2026","rate.found":"Fant {count} rene oppvarminger i historikken; l\xE6rt takt {rate} min/\xB0C.","rate.found_too_few":"Fant {count} rene oppvarminger i historikken; {needed} trengs for \xE5 l\xE6re.","solar.title":"Solsammenligning","solar.none":"Ingen vinduer registrert de siste 30 dagene enn\xE5.","solar.would":"Med regelen med solhensyn p\xE5 ville vannet v\xE6rt klart i tide i {on_time} av {windows} vinduer","solar.did":"Med regelen med solhensyn var vannet klart i tide i {on_time} av {windows} vinduer","solar.would_less":", og berederen ville g\xE5tt {minutes} minutter mindre","solar.would_more":", og berederen ville g\xE5tt {minutes} minutter mer","solar.did_less":", og berederen gikk {minutes} minutter mindre","solar.did_more":", og berederen gikk {minutes} minutter mer","solar.kwh":", ca. {kwh} kWh","solar.applied":" Regelen ble brukt i {applied} av dem: i tide i {on_time}.","subline.starts_at":"Begynner \xE5 varme rundt {when}.","subline.starts_at_solar":"Begynner \xE5 varme rundt {when}, hvis ikke solen har gjort jobben innen da.","subline.asked_by_one":"Bestilt av {name}, som f\xE5r beskjed n\xE5r det er klart.","subline.asked_by_many":"Bestilt av {names}. Alle f\xE5r beskjed n\xE5r det er klart.","names.and":" og ","today.you":"Du","list.mine":"Mine klartider","list.count_one":"1 klartid","list.count":"{count} klartider","list.virtual":"Virtuelt medlem \xB7 felles tider for husstanden","away.paused":"P\xE5 pause. Tidene beholdes.","member_settings.open":"Innstillinger for klartider","visibility.private":"Privat","visibility.hint_own":"Andre medlemmer ser ikke disse tidene eller dine Varm n\xE5-foresp\xF8rsler; administratorer gj\xF8r det.","visibility.hint_virtual":"Bare administratorer ser disse tidene.","settings.no_people":"Det finnes ingen personer i Home Assistant \xE5 velge enn\xE5.","editor.heater":"Varmtvannsbereder","editor.compact":"Kompakt: bare temperatur og status, uten knapper","editor.tap_action":"Handling ved trykk"};var vt={"status.waiting":"Inactief","status.heating":"Verwarmen","status.ready":"Klaar","status.fault":"Storing","status.manual":"Handmatig","headline.heating_for":"Verwarmen: klaar over ongeveer {minutes} min","headline.ready_at":"Klaar: {when}","subline.next_at":"Volgende: {when}","when.today":"{time}","when.tomorrow":"morgen, {time}","when.weekday":"{weekday}, {time}","ring.target":"doel {target}\xB0","weekday.letters":"M,D,W,D,V,Z,Z","members.none":"Nog geen leden. Een beheerder voegt ze toe in de instellingen van de integratie.","list.empty":"Nog geen klaartijden.","list.add":"Klaartijd toevoegen","sheet.delete":"Verwijderen","list.switch":"Aan of uit","sheet.title":"Nieuwe klaartijd","sheet.edit_title":"Klaartijd wijzigen","list.edit":"Deze klaartijd wijzigen","sheet.time":"Tijd","sheet.hour":"Uur","sheet.minute":"Minuut","sheet.days":"Dagen","sheet.save":"Opslaan","sheet.cancel":"Annuleren","clock.title":"Tijd kiezen","clock.title_keys":"Tijd invoeren","clock.ok":"OK","clock.to_keys":"Tijd typen","clock.to_dial":"Klok gebruiken","clock.am":"AM","clock.pm":"PM","clock.invalid":"Voer een geldige tijd in","clock.change":"Tijd wijzigen","fault.sensor_unavailable":"Storing: de watertemperatuursensor geeft geen metingen. Het verwarmen is gestopt.","fault.not_rising":"Storing: het water wordt niet warmer. Het verwarmen is gestopt; zie Reparaties.","fault.no_consumption":"Storing: de boiler verbruikt geen stroom. Het verwarmen is gestopt; zie Reparaties.","fault.relay_stuck":"Storing: de boiler verbruikt stroom terwijl hij uit staat. Controleer het relais.","fault.top_probe":"Waarschuwing: de hoofdvoeler zit misschien los. Het verwarmen gaat door; zie Reparaties.","fault.middle_probe":"Waarschuwing: de tweede voeler zit misschien los. Het verwarmen gaat door; zie Reparaties.","fault.probes_disagree":"Waarschuwing: de twee voelers komen niet overeen. Het verwarmen gaat door; zie Reparaties.","element.on":"Element aan","element.off":"Element uit","element.drawing":"{state} \xB7 verbruikt {watts} W","keep_hot.until":"Warm gehouden tot {time}","keep_hot.title":"Warm houden als het klaar is","keep_hot.hint":"Na het bericht \u2018klaar\u2019 houdt de boiler het water zo lang warm en schakelt dan uit.","keep_hot.more":"Kies hoe lang het warm blijft","keep_hot.cancel":"Annuleren","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} u","heat_now_target.title":"Temperatuur","heat_now_target.hint":"Alleen voor dit verzoek; de boiler blijft op {target} \xB0C.","heat_now_target.down":"1 \xB0C minder","heat_now_target.up":"1 \xB0C meer",manual:"Automatische besturing staat uit: de boiler wordt handmatig bediend.","note.not_rising_skipped":"De thermostaat meldt niet wanneer hij verwarmt, dus de controles \u2018water wordt niet warmer\u2019 en \u2018boiler verbruikt geen stroom\u2019 worden niet uitgevoerd.","heat_now.start":"Nu verwarmen","heat_now.cancel":"Annuleren","heat_now.join":"Laat me weten als het warm is","heat_now.leave":"Geen bericht voor mij","subline.for":"Voor {list}.","item.at":"{name} om {time}","switch_off.link":"Verwarmen uitzetten\u2026","switch_off.title":"Verwarmen uitzetten?","switch_off.confirm":"Uitzetten","switch_off.keep":"Annuleren","switch_off.asked_one":"{names} krijgt geen bericht meer.","switch_off.asked_many":"{names} krijgen geen bericht meer.","switch_off.skipped_one":"Zonder warm water: {list}.","switch_off.skipped_many":"Zonder warm water: {list}.","switch_off.back":"Voor de volgende klaartijd gaat hij vanzelf weer aan.","switch_off.nobody":"Het verwarmen stopt nu.","settings.switch_off":"Wie het verwarmen voor iedereen mag uitzetten","settings.switch_off_hint":"De beheerders en:","settings.own_cancel":"Wie het vroeg, kan het eigen verzoek altijd annuleren.",greeting:"Hallo, {name}","today.label":"Thuis vandaag","today.nobody":"Vandaag niemand","away.until_label":"Tot (optioneel)","away.line":"Afwezig","away.line_until":"Afwezig tot {date}","members.add":"Lid","card.no_heater":"Er is nog geen Hot Water Ready-boiler ingesteld.","card.loading":"Laden\u2026","card.error":"Dat lukte niet: {message}","cluster.warning":"De douches vanaf {when} hebben water van {needed} \xB0C nodig, maar de boiler gaat maar tot {cap} \xB0C: de laatste kunnen koeler zijn.","tabs.people":"Personen","tabs.week":"Week","week.days":"ma,di,wo,do,vr,za,zo","week.showers":"douches","week.windows":"verwarmingsvensters","week.busiest":"drukste dag","week.heating":"Verwarmen","week.away":"afwezig","week.virtual":"virtueel \xB7 {count}","week.per_week":"{count} per week","week.hint":"Tik op een persoon om de tijden te markeren. De balken tonen wanneer de boiler elke dag mag verwarmen ({start} tot {end}).","settings.open":"Boilerinstellingen","settings.close":"Sluiten","settings.target":"Doeltemperatuur","settings.target_hint":"Klaar als het water hier is","settings.target_down":"Doel verlagen","settings.target_up":"Doel verhogen","settings.margin":"Marge","settings.band":"Stopt bij {stop} \xB0C, start weer bij {restart} \xB0C","settings.margin_down":"Marge verkleinen","settings.margin_up":"Marge vergroten","settings.automatic":"Automatische besturing","settings.automatic_hint":"Uit: de boiler wordt handmatig bediend","settings.more":"Meer instellingen","rate.title":"Opwarmsnelheid","rate.unit":"min per \xB0C","rate.automatic":"Automatisch","rate.fixed":"Vast","rate.learned":"Geleerd: mediaan van de {count} schone verwarmingsbeurten van de laatste {days} dagen","rate.default_one":"Startwaarde: nog 1 schone verwarmingsbeurt in de laatste {days} dagen en hij is geleerd","rate.default_many":"Startwaarde: nog {count} schone verwarmingsbeurten in de laatste {days} dagen en hij is geleerd","rate.manual":"Handmatig vastgezet: het leren gaat door, maar wordt niet gebruikt","rate.runs":"Gebruikte schone verwarmingsbeurten","rate.example":"Nu {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} min, plus {margin} min marge: start {lead} min eerder","rate.example_cap":" (maximaal)","rate.example_warm":"Nu {from} \xB0C: al op het doel, eerder starten is niet nodig","rate.physics":"Volgens de natuurkunde, het hele vat verwarmd door het element: {rate} min/\xB0C","rate.physics_range":"Volgens de natuurkunde: tussen {fast} min/\xB0C (alleen het water boven het element) en {slow} min/\xB0C (het hele vat)","rate.volume":"Komt neer op het verwarmen van {litres} L van de {tank} L van het vat","rate.far_below":": {percent}% onder de natuurkunde. Controleer de inhoud van het vat, het vermogen van het element en waar de voeler zit.","rate.far_above":": {percent}% boven de natuurkunde. Controleer de inhoud van het vat, het vermogen van het element en waar de voeler zit.","rate.suggested_learned":"Voorgesteld: {rate} (geleerd)","rate.suggested_physics":"Voorgesteld: {rate} (natuurkunde van het vat)","rate.suggested_default":"Voorgesteld: {rate} (startwaarde)","rate.use":"Gebruiken","rate.down":"0,1 min per \xB0C minder","rate.up":"0,1 min per \xB0C meer","rate.recalculate":"Opnieuw berekenen uit de geschiedenis","rate.recalculating":"De afgelopen week wordt doorzocht\u2026","rate.found":"{count} schone verwarmingsbeurten gevonden in de geschiedenis; geleerd: {rate} min/\xB0C.","rate.found_too_few":"{count} schone verwarmingsbeurten gevonden in de geschiedenis; er zijn er {needed} nodig om te leren.","solar.title":"Zonvergelijking","solar.none":"Nog geen vensters vastgelegd in de laatste 30 dagen.","solar.would":"Met de zonregel aan zou het water in {on_time} van {windows} vensters op tijd klaar zijn geweest","solar.did":"Met de zonregel was het water in {on_time} van {windows} vensters op tijd klaar","solar.would_less":", en de boiler zou {minutes} minuten minder hebben gedraaid","solar.would_more":", en de boiler zou {minutes} minuten langer hebben gedraaid","solar.did_less":", en de boiler draaide {minutes} minuten minder","solar.did_more":", en de boiler draaide {minutes} minuten langer","solar.kwh":", ongeveer {kwh} kWh","solar.applied":" De regel werd in {applied} daarvan toegepast: op tijd in {on_time}.","subline.starts_at":"Begint met verwarmen rond: {when}.","subline.starts_at_solar":"Begint met verwarmen rond: {when}, als de zon het dan nog niet heeft gedaan.","subline.asked_by_one":"Gevraagd door {name}. Krijgt een bericht als het klaar is.","subline.asked_by_many":"Gevraagd door {names}. Iedereen krijgt een bericht als het klaar is.","names.and":" en ","today.you":"Jij","list.mine":"Mijn klaartijden","list.count_one":"1 klaartijd","list.count":"{count} klaartijden","list.virtual":"Virtueel lid \xB7 gedeelde tijden van het huishouden","away.paused":"Gepauzeerd. De tijden blijven bewaard.","member_settings.open":"Instellingen van de klaartijden","visibility.private":"Priv\xE9","visibility.hint_own":"Andere leden zien deze tijden en je Nu verwarmen-verzoeken niet; beheerders wel.","visibility.hint_virtual":"Alleen beheerders zien deze tijden.","settings.no_people":"Er zijn nog geen personen in Home Assistant om uit te kiezen.","editor.heater":"Boiler","editor.compact":"Compact: alleen temperatuur en status, zonder knoppen","editor.tap_action":"Actie bij tikken"};var kt={"status.waiting":"Bezczynny","status.heating":"Grzanie","status.ready":"Gotowa","status.fault":"Awaria","status.manual":"R\u0119czny","headline.heating_for":"Grzanie: gotowa za oko\u0142o {minutes} min","headline.ready_at":"Gotowa: {when}","subline.next_at":"Nast\u0119pna: {when}","when.today":"{time}","when.tomorrow":"jutro, {time}","when.weekday":"{weekday}, {time}","ring.target":"cel {target}\xB0","weekday.letters":"P,W,\u015A,C,P,S,N","members.none":"Nie ma jeszcze domownik\xF3w. Dodaje ich administrator w ustawieniach integracji.","list.empty":"Nie ma jeszcze godzin gotowo\u015Bci.","list.add":"Dodaj godzin\u0119 gotowo\u015Bci","sheet.delete":"Usu\u0144","list.switch":"W\u0142\u0105cz lub wy\u0142\u0105cz","sheet.title":"Nowa godzina gotowo\u015Bci","sheet.edit_title":"Zmie\u0144 godzin\u0119 gotowo\u015Bci","list.edit":"Zmie\u0144 t\u0119 godzin\u0119 gotowo\u015Bci","sheet.time":"Godzina","sheet.hour":"Godzina","sheet.minute":"Minuta","sheet.days":"Dni","sheet.save":"Zapisz","sheet.cancel":"Anuluj","clock.title":"Wybierz godzin\u0119","clock.title_keys":"Wpisz godzin\u0119","clock.ok":"OK","clock.to_keys":"Wpisz godzin\u0119","clock.to_dial":"U\u017Cyj zegara","clock.am":"AM","clock.pm":"PM","clock.invalid":"Wpisz prawid\u0142ow\u0105 godzin\u0119","clock.change":"Zmie\u0144 godzin\u0119","fault.sensor_unavailable":"Awaria: czujnik temperatury wody nie podaje odczyt\xF3w. Grzanie zatrzymane.","fault.not_rising":"Awaria: woda nie robi si\u0119 cieplejsza. Grzanie zatrzymane; zobacz Naprawy.","fault.no_consumption":"Awaria: podgrzewacz nie pobiera pr\u0105du. Grzanie zatrzymane; zobacz Naprawy.","fault.relay_stuck":"Awaria: podgrzewacz pobiera pr\u0105d, cho\u0107 jest wy\u0142\u0105czony. Sprawd\u017A przeka\u017Anik.","fault.top_probe":"Ostrze\u017Cenie: g\u0142\xF3wna sonda mog\u0142a si\u0119 obluzowa\u0107. Grzanie trwa dalej; zobacz Naprawy.","fault.middle_probe":"Ostrze\u017Cenie: druga sonda mog\u0142a si\u0119 obluzowa\u0107. Grzanie trwa dalej; zobacz Naprawy.","fault.probes_disagree":"Ostrze\u017Cenie: obie sondy podaj\u0105 sprzeczne odczyty. Grzanie trwa dalej; zobacz Naprawy.","element.on":"Grza\u0142ka w\u0142\u0105czona","element.off":"Grza\u0142ka wy\u0142\u0105czona","element.drawing":"{state} \xB7 pobiera {watts} W","keep_hot.until":"Utrzymuje ciep\u0142\u0105 do {time}","keep_hot.title":"Utrzymuj ciep\u0142\u0105, gdy jest gotowa","keep_hot.hint":"Po wiadomo\u015Bci \u201Egotowa\u201D podgrzewacz utrzymuje ciep\u0142\u0105 wod\u0119 przez ten czas, potem si\u0119 wy\u0142\u0105cza.","keep_hot.more":"Wybierz, jak d\u0142ugo utrzymywa\u0107 ciep\u0142\u0105","keep_hot.cancel":"Anuluj","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h","heat_now_target.title":"Temperatura","heat_now_target.hint":"Tylko dla tego \u017C\u0105dania; podgrzewacz zostaje na {target} \xB0C.","heat_now_target.down":"1 \xB0C mniej","heat_now_target.up":"1 \xB0C wi\u0119cej",manual:"Sterowanie automatyczne jest wy\u0142\u0105czone: podgrzewacz jest obs\u0142ugiwany r\u0119cznie.","note.not_rising_skipped":"Termostat nie podaje, kiedy grzeje, wi\u0119c kontrole \u201Ewoda nie robi si\u0119 cieplejsza\u201D i \u201Epodgrzewacz nie pobiera pr\u0105du\u201D nie s\u0105 wykonywane.","heat_now.start":"Grzej teraz","heat_now.cancel":"Anuluj","heat_now.join":"Powiadom mnie, gdy b\u0119dzie ciep\u0142a","heat_now.leave":"Nie powiadamiaj mnie","subline.for":"Dla: {list}.","item.at":"{name} o {time}","switch_off.link":"Wy\u0142\u0105cz grzanie\u2026","switch_off.title":"Wy\u0142\u0105czy\u0107 grzanie?","switch_off.confirm":"Wy\u0142\u0105cz","switch_off.keep":"Anuluj","switch_off.asked_one":"Powiadomienie nie zostanie wys\u0142ane: {names}.","switch_off.asked_many":"Powiadomienia nie zostan\u0105 wys\u0142ane: {names}.","switch_off.skipped_one":"Bez ciep\u0142ej wody: {list}.","switch_off.skipped_many":"Bez ciep\u0142ej wody: {list}.","switch_off.back":"W\u0142\u0105czy si\u0119 samo przed nast\u0119pn\u0105 godzin\u0105 gotowo\u015Bci.","switch_off.nobody":"Grzanie zatrzymuje si\u0119 teraz.","settings.switch_off":"Kto mo\u017Ce wy\u0142\u0105czy\u0107 grzanie dla wszystkich","settings.switch_off_hint":"Administratorzy oraz:","settings.own_cancel":"Osoba, kt\xF3ra poprosi\u0142a, zawsze mo\u017Ce anulowa\u0107 w\u0142asne \u017C\u0105danie.",greeting:"Cze\u015B\u0107, {name}","today.label":"Dom dzisiaj","today.nobody":"Dzi\u015B nikogo","away.until_label":"Do (opcjonalnie)","away.line":"Nieobecno\u015B\u0107","away.line_until":"Nieobecno\u015B\u0107 do {date}","members.add":"Domownik","card.no_heater":"Nie skonfigurowano jeszcze \u017Cadnego podgrzewacza Hot Water Ready.","card.loading":"Wczytywanie\u2026","card.error":"Nie uda\u0142o si\u0119: {message}","cluster.warning":"Prysznice od {when} wymagaj\u0105 wody o temperaturze {needed} \xB0C, ale podgrzewacz grzeje tylko do {cap} \xB0C: ostatnie mog\u0105 by\u0107 ch\u0142odniejsze.","tabs.people":"Osoby","tabs.week":"Tydzie\u0144","week.days":"Pn,Wt,\u015Ar,Cz,Pt,So,Nd","week.showers":"prysznice","week.windows":"okna grzania","week.busiest":"najbardziej zaj\u0119ty dzie\u0144","week.heating":"Grzanie","week.away":"nieobecno\u015B\u0107","week.virtual":"wirtualny \xB7 {count}","week.per_week":"{count} w tygodniu","week.hint":"Dotknij osoby, aby wyr\xF3\u017Cni\u0107 jej godziny. Paski pokazuj\u0105, kiedy podgrzewacz mo\u017Ce grza\u0107 ka\u017Cdego dnia (od {start} do {end}).","settings.open":"Ustawienia podgrzewacza","settings.close":"Zamknij","settings.target":"Temperatura docelowa","settings.target_hint":"Gotowa, gdy woda osi\u0105gnie t\u0119 temperatur\u0119","settings.target_down":"Obni\u017C temperatur\u0119 docelow\u0105","settings.target_up":"Podwy\u017Csz temperatur\u0119 docelow\u0105","settings.margin":"Margines","settings.band":"Wy\u0142\u0105cza przy {stop} \xB0C, w\u0142\u0105cza ponownie przy {restart} \xB0C","settings.margin_down":"Zmniejsz margines","settings.margin_up":"Zwi\u0119ksz margines","settings.automatic":"Sterowanie automatyczne","settings.automatic_hint":"Wy\u0142\u0105czone: podgrzewacz jest obs\u0142ugiwany r\u0119cznie","settings.more":"Wi\u0119cej ustawie\u0144","rate.title":"Szybko\u015B\u0107 grzania","rate.unit":"min na \xB0C","rate.automatic":"Automatyczna","rate.fixed":"Sta\u0142a","rate.learned":"Nauczona: mediana czystych grza\u0144 (liczba: {count}) z ostatnich {days} dni","rate.default_one":"Warto\u015B\u0107 pocz\u0105tkowa: jeszcze 1 czyste grzanie w ostatnich {days} dniach i zostanie nauczona","rate.default_many":"Warto\u015B\u0107 pocz\u0105tkowa: brakuje czystych grza\u0144 w ostatnich {days} dniach (jeszcze {count}), potem zostanie nauczona","rate.manual":"Ustawiona r\u0119cznie: nauka trwa dalej, ale nie jest u\u017Cywana","rate.runs":"Czyste grzania, z kt\xF3rych wynika","rate.example":"Teraz {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} min, plus {margin} min marginesu: start {lead} min wcze\u015Bniej","rate.example_cap":" (maksimum)","rate.example_warm":"Teraz {from} \xB0C: temperatura docelowa ju\u017C osi\u0105gni\u0119ta, nie trzeba zaczyna\u0107 wcze\u015Bniej","rate.physics":"Wed\u0142ug fizyki, ca\u0142y zbiornik grzany przez grza\u0142k\u0119: {rate} min/\xB0C","rate.physics_range":"Wed\u0142ug fizyki: od {fast} min/\xB0C (tylko woda nad grza\u0142k\u0105) do {slow} min/\xB0C (ca\u0142y zbiornik)","rate.volume":"Odpowiada podgrzaniu {litres} L z {tank} L zbiornika","rate.far_below":": {percent}% poni\u017Cej fizyki. Sprawd\u017A pojemno\u015B\u0107 zbiornika, moc grza\u0142ki i po\u0142o\u017Cenie sondy.","rate.far_above":": {percent}% powy\u017Cej fizyki. Sprawd\u017A pojemno\u015B\u0107 zbiornika, moc grza\u0142ki i po\u0142o\u017Cenie sondy.","rate.suggested_learned":"Sugerowana: {rate} (nauczona)","rate.suggested_physics":"Sugerowana: {rate} (fizyka zbiornika)","rate.suggested_default":"Sugerowana: {rate} (warto\u015B\u0107 pocz\u0105tkowa)","rate.use":"U\u017Cyj","rate.down":"0,1 min na \xB0C mniej","rate.up":"0,1 min na \xB0C wi\u0119cej","rate.recalculate":"Przelicz na podstawie historii","rate.recalculating":"Przegl\u0105danie ostatniego tygodnia\u2026","rate.found":"Czyste grzania znalezione w historii: {count}; nauczona szybko\u015B\u0107 {rate} min/\xB0C.","rate.found_too_few":"Czyste grzania znalezione w historii: {count}; do nauki potrzeba: {needed}.","solar.title":"Por\xF3wnanie solarne","solar.none":"Brak zapisanych okien z ostatnich 30 dni.","solar.would":"Z w\u0142\u0105czon\u0105 regu\u0142\u0105 uwzgl\u0119dniaj\u0105c\u0105 s\u0142o\u0144ce woda by\u0142aby gotowa na czas w {on_time} z {windows} okien","solar.did":"Z regu\u0142\u0105 uwzgl\u0119dniaj\u0105c\u0105 s\u0142o\u0144ce woda by\u0142a gotowa na czas w {on_time} z {windows} okien","solar.would_less":", a podgrzewacz pracowa\u0142by o {minutes} min kr\xF3cej","solar.would_more":", a podgrzewacz pracowa\u0142by o {minutes} min d\u0142u\u017Cej","solar.did_less":", a podgrzewacz pracowa\u0142 o {minutes} min kr\xF3cej","solar.did_more":", a podgrzewacz pracowa\u0142 o {minutes} min d\u0142u\u017Cej","solar.kwh":", oko\u0142o {kwh} kWh","solar.applied":" Regu\u0142a zosta\u0142a zastosowana w {applied} z nich: na czas w {on_time}.","subline.starts_at":"Zacznie grza\u0107 oko\u0142o {when}.","subline.starts_at_solar":"Zacznie grza\u0107 oko\u0142o {when}, je\u015Bli s\u0142o\u0144ce wcze\u015Bniej tego nie zrobi.","subline.asked_by_one":"Pro\u015Bba od: {name}. Dostanie powiadomienie, gdy woda b\u0119dzie gotowa.","subline.asked_by_many":"Pro\u015Bba od: {names}. Ka\u017Cda osoba dostanie powiadomienie, gdy woda b\u0119dzie gotowa.","names.and":" i ","today.you":"Ty","list.mine":"Moje godziny gotowo\u015Bci","list.count_one":"1 godzina gotowo\u015Bci","list.count":"Godziny gotowo\u015Bci: {count}","list.virtual":"Domownik wirtualny \xB7 wsp\xF3lne godziny domu","away.paused":"Wstrzymane. Godziny s\u0105 zachowane.","member_settings.open":"Ustawienia godzin gotowo\u015Bci","visibility.private":"Prywatne","visibility.hint_own":"Inni cz\u0142onkowie nie widz\u0105 tych godzin ani Twoich pr\xF3\u015Bb Grzej teraz; administratorzy widz\u0105.","visibility.hint_virtual":"Te godziny widz\u0105 tylko administratorzy.","settings.no_people":"W Home Assistant nie ma jeszcze os\xF3b do wyboru.","editor.heater":"Podgrzewacz","editor.compact":"Kompaktowa: tylko temperatura i stan, bez sterowania","editor.tap_action":"Akcja po dotkni\u0119ciu"};var bt={"status.waiting":"Em espera","status.heating":"Aquecendo","status.ready":"Pronta","status.fault":"Falha","status.manual":"Manual","headline.heating_for":"Aquecendo: pronta em cerca de {minutes} min","headline.ready_at":"Pronta \xE0s {when}","subline.next_at":"Pr\xF3xima \xE0s {when}","when.today":"{time}","when.tomorrow":"{time} de amanh\xE3","when.weekday":"{time} de {weekday}","ring.target":"alvo {target}\xB0","weekday.letters":"S,T,Q,Q,S,S,D","members.none":"Ainda n\xE3o h\xE1 membros. Um administrador os adiciona nas configura\xE7\xF5es da integra\xE7\xE3o.","list.empty":"Ainda n\xE3o h\xE1 hor\xE1rios.","list.add":"Adicionar um hor\xE1rio","sheet.delete":"Excluir","list.switch":"Ligar ou desligar","sheet.title":"Novo hor\xE1rio","sheet.edit_title":"Alterar hor\xE1rio","list.edit":"Alterar este hor\xE1rio","sheet.time":"Hora","sheet.hour":"Hora","sheet.minute":"Minuto","sheet.days":"Dias","sheet.save":"Salvar","sheet.cancel":"Cancelar","clock.title":"Selecionar a hora","clock.title_keys":"Digitar a hora","clock.ok":"OK","clock.to_keys":"Digitar a hora","clock.to_dial":"Usar o rel\xF3gio","clock.am":"AM","clock.pm":"PM","clock.invalid":"Digite uma hora v\xE1lida","clock.change":"Alterar a hora","fault.sensor_unavailable":"Falha: o sensor de temperatura da \xE1gua n\xE3o d\xE1 leituras. O aquecimento parou.","fault.not_rising":"Falha: a \xE1gua n\xE3o est\xE1 esquentando. O aquecimento parou; veja Reparos.","fault.no_consumption":"Falha: o aquecedor n\xE3o consome energia. O aquecimento parou; veja Reparos.","fault.relay_stuck":"Falha: o aquecedor consome energia mesmo desligado. Verifique o rel\xE9.","fault.top_probe":"Aviso: a sonda principal pode estar solta. O aquecimento continua; veja Reparos.","fault.middle_probe":"Aviso: a segunda sonda pode estar solta. O aquecimento continua; veja Reparos.","fault.probes_disagree":"Aviso: as duas sondas n\xE3o concordam. O aquecimento continua; veja Reparos.","element.on":"Resist\xEAncia ligada","element.off":"Resist\xEAncia desligada","element.drawing":"{state} \xB7 consumindo {watts} W","keep_hot.until":"Mantendo a \xE1gua quente at\xE9 as {time}","keep_hot.title":"Manter quente depois de pronta","keep_hot.hint":"Depois da mensagem de \u201Cpronta\u201D, o aquecedor mant\xE9m a \xE1gua quente por este tempo e depois desliga.","keep_hot.more":"Escolher por quanto tempo manter quente","keep_hot.cancel":"Cancelar","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h","heat_now_target.title":"Temperatura","heat_now_target.hint":"S\xF3 para este pedido; o aquecedor continua em {target} \xB0C.","heat_now_target.down":"1 \xB0C a menos","heat_now_target.up":"1 \xB0C a mais",manual:"O controle autom\xE1tico est\xE1 desligado: o aquecedor est\xE1 no modo manual.","note.not_rising_skipped":"O termostato n\xE3o informa quando est\xE1 aquecendo, ent\xE3o as verifica\xE7\xF5es \u201Ca \xE1gua n\xE3o est\xE1 esquentando\u201D e \u201Co aquecedor n\xE3o consome energia\u201D n\xE3o s\xE3o feitas.","heat_now.start":"Aquecer agora","heat_now.cancel":"Cancelar","heat_now.join":"Me avise quando estiver quente","heat_now.leave":"N\xE3o me avise","subline.for":"Para {list}.","item.at":"{name} \xE0s {time}","switch_off.link":"Desligar o aquecimento\u2026","switch_off.title":"Desligar o aquecimento?","switch_off.confirm":"Desligar","switch_off.keep":"Cancelar","switch_off.asked_one":"{names} n\xE3o vai mais ser avisado.","switch_off.asked_many":"{names} n\xE3o v\xE3o mais ser avisados.","switch_off.skipped_one":"Fica sem \xE1gua quente: {list}.","switch_off.skipped_many":"Ficam sem \xE1gua quente: {list}.","switch_off.back":"Volta a ligar sozinho para o pr\xF3ximo hor\xE1rio.","switch_off.nobody":"O aquecimento para agora.","settings.switch_off":"Quem pode desligar o aquecimento para todos","settings.switch_off_hint":"Os administradores e:","settings.own_cancel":"Quem pediu sempre pode cancelar o pr\xF3prio pedido.",greeting:"Ol\xE1, {name}","today.label":"Casa hoje","today.nobody":"Ningu\xE9m hoje","away.until_label":"At\xE9 (opcional)","away.line":"Ausente","away.line_until":"Ausente at\xE9 {date}","members.add":"Membro","card.no_heater":"Ainda n\xE3o h\xE1 nenhum aquecedor do Hot Water Ready configurado.","card.loading":"Carregando\u2026","card.error":"N\xE3o deu certo: {message}","cluster.warning":"Os banhos a partir das {when} precisam da \xE1gua a {needed} \xB0C, mas o aquecedor s\xF3 vai at\xE9 {cap} \xB0C: os \xFAltimos podem sair menos quentes.","tabs.people":"Pessoas","tabs.week":"Semana","week.days":"Seg,Ter,Qua,Qui,Sex,S\xE1b,Dom","week.showers":"banhos","week.windows":"janelas de aquecimento","week.busiest":"dia mais cheio","week.heating":"Aquecimento","week.away":"ausente","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} por semana","week.hint":"Toque em uma pessoa para destacar os hor\xE1rios dela. As barras mostram quando o aquecedor pode aquecer em cada dia ({start} a {end}).","settings.open":"Configura\xE7\xF5es do aquecedor","settings.close":"Fechar","settings.target":"Temperatura alvo","settings.target_hint":"Pronta quando a \xE1gua chegar aqui","settings.target_down":"Baixar o alvo","settings.target_up":"Subir o alvo","settings.margin":"Margem","settings.band":"Para a {stop} \xB0C, volta a {restart} \xB0C","settings.margin_down":"Diminuir a margem","settings.margin_up":"Aumentar a margem","settings.automatic":"Controle autom\xE1tico","settings.automatic_hint":"Desligado: o aquecedor fica no modo manual","settings.more":"Mais configura\xE7\xF5es","rate.title":"Velocidade de aquecimento","rate.unit":"min por \xB0C","rate.automatic":"Autom\xE1tico","rate.fixed":"Fixo","rate.learned":"Aprendido: mediana dos {count} aquecimentos limpos dos \xFAltimos {days} dias","rate.default_one":"Valor inicial: falta 1 aquecimento limpo nos \xFAltimos {days} dias para aprender","rate.default_many":"Valor inicial: faltam {count} aquecimentos limpos nos \xFAltimos {days} dias para aprender","rate.manual":"Fixado manualmente: o aprendizado continua, mas n\xE3o \xE9 usado","rate.runs":"Aquecimentos limpos usados","rate.example":"Agora {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} min, mais {margin} min de margem: come\xE7a {lead} min antes","rate.example_cap":" (o m\xE1ximo)","rate.example_warm":"Agora {from} \xB0C: j\xE1 est\xE1 no alvo, n\xE3o precisa come\xE7ar antes","rate.physics":"Pela f\xEDsica, o tanque inteiro aquecido pela resist\xEAncia: {rate} min/\xB0C","rate.physics_range":"Pela f\xEDsica: entre {fast} min/\xB0C (s\xF3 a \xE1gua acima da resist\xEAncia) e {slow} min/\xB0C (o tanque inteiro)","rate.volume":"Equivale a aquecer {litres} L dos {tank} L do tanque","rate.far_below":": {percent}% abaixo da f\xEDsica. Confira o volume do tanque, a pot\xEAncia da resist\xEAncia e onde fica a sonda.","rate.far_above":": {percent}% acima da f\xEDsica. Confira o volume do tanque, a pot\xEAncia da resist\xEAncia e onde fica a sonda.","rate.suggested_learned":"Sugerido: {rate} (aprendido)","rate.suggested_physics":"Sugerido: {rate} (f\xEDsica do tanque)","rate.suggested_default":"Sugerido: {rate} (valor inicial)","rate.use":"Usar","rate.down":"0,1 min por \xB0C a menos","rate.up":"0,1 min por \xB0C a mais","rate.recalculate":"Recalcular pelo hist\xF3rico","rate.recalculating":"Analisando a \xFAltima semana\u2026","rate.found":"Encontrados {count} aquecimentos limpos no hist\xF3rico; aprendido {rate} min/\xB0C.","rate.found_too_few":"Encontrados {count} aquecimentos limpos no hist\xF3rico; s\xE3o necess\xE1rios {needed} para aprender.","solar.title":"Compara\xE7\xE3o solar","solar.none":"Ainda n\xE3o h\xE1 janelas registradas nos \xFAltimos 30 dias.","solar.would":"Com a regra solar ligada, a \xE1gua teria ficado pronta a tempo em {on_time} de {windows} janelas","solar.did":"Com a regra solar, a \xE1gua ficou pronta a tempo em {on_time} de {windows} janelas","solar.would_less":", e o aquecedor teria funcionado {minutes} minutos a menos","solar.would_more":", e o aquecedor teria funcionado {minutes} minutos a mais","solar.did_less":", e o aquecedor funcionou {minutes} minutos a menos","solar.did_more":", e o aquecedor funcionou {minutes} minutos a mais","solar.kwh":", cerca de {kwh} kWh","solar.applied":" A regra foi aplicada em {applied} delas: a tempo em {on_time}.","subline.starts_at":"Come\xE7a a aquecer por volta das {when}.","subline.starts_at_solar":"Come\xE7a a aquecer por volta das {when}, se o sol n\xE3o tiver feito isso antes.","subline.asked_by_one":"Pedido por {name}, que ser\xE1 avisado quando estiver pronta.","subline.asked_by_many":"Pedido por {names}. Cada um ser\xE1 avisado quando estiver pronta.","names.and":" e ","today.you":"Voc\xEA","list.mine":"Meus hor\xE1rios","list.count_one":"1 hor\xE1rio","list.count":"{count} hor\xE1rios","list.virtual":"Membro virtual \xB7 hor\xE1rios compartilhados da casa","away.paused":"Em pausa. Os hor\xE1rios ficam salvos.","member_settings.open":"Configura\xE7\xF5es dos hor\xE1rios","visibility.private":"Privado","visibility.hint_own":"Os outros membros n\xE3o veem estes hor\xE1rios nem seus pedidos de Aquecer agora; os administradores veem.","visibility.hint_virtual":"S\xF3 os administradores veem estes hor\xE1rios.","settings.no_people":"Ainda n\xE3o h\xE1 pessoas no Home Assistant para escolher.","editor.heater":"Aquecedor","editor.compact":"Compacto: s\xF3 a temperatura e o status, sem controles","editor.tap_action":"A\xE7\xE3o ao tocar"};var yt={"status.waiting":"\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435","status.heating":"\u041D\u0430\u0433\u0440\u0435\u0432","status.ready":"\u0413\u043E\u0442\u043E\u0432\u043E","status.fault":"\u041D\u0435\u0438\u0441\u043F\u0440\u0430\u0432\u043D\u043E\u0441\u0442\u044C","status.manual":"\u0420\u0443\u0447\u043D\u043E\u0439 \u0440\u0435\u0436\u0438\u043C","headline.heating_for":"\u041D\u0430\u0433\u0440\u0435\u0432: \u0431\u0443\u0434\u0435\u0442 \u0433\u043E\u0442\u043E\u0432\u043E \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u0447\u0435\u0440\u0435\u0437 {minutes} \u043C\u0438\u043D","headline.ready_at":"\u0411\u0443\u0434\u0435\u0442 \u0433\u043E\u0442\u043E\u0432\u043E \u043A {when}","subline.next_at":"\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0435: {when}","when.today":"{time}","when.tomorrow":"{time} \u0437\u0430\u0432\u0442\u0440\u0430","when.weekday":"{time} ({weekday})","ring.target":"\u0446\u0435\u043B\u044C {target}\xB0","weekday.letters":"\u041F\u043D,\u0412\u0442,\u0421\u0440,\u0427\u0442,\u041F\u0442,\u0421\u0431,\u0412\u0441","members.none":"\u0423\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442. \u0418\u0445 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438.","list.empty":"\u0412\u0440\u0435\u043C\u0451\u043D \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442.","list.add":"\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432\u0440\u0435\u043C\u044F \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438","sheet.delete":"\u0423\u0434\u0430\u043B\u0438\u0442\u044C","list.switch":"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0438\u043B\u0438 \u0432\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C","sheet.title":"\u041D\u043E\u0432\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438","sheet.edit_title":"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0432\u0440\u0435\u043C\u044F \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438","list.edit":"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u044D\u0442\u043E \u0432\u0440\u0435\u043C\u044F \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438","sheet.time":"\u0412\u0440\u0435\u043C\u044F","sheet.hour":"\u0427\u0430\u0441\u044B","sheet.minute":"\u041C\u0438\u043D\u0443\u0442\u044B","sheet.days":"\u0414\u043D\u0438","sheet.save":"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C","sheet.cancel":"\u041E\u0442\u043C\u0435\u043D\u0430","clock.title":"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0432\u0440\u0435\u043C\u044F","clock.title_keys":"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0432\u0440\u0435\u043C\u044F","clock.ok":"OK","clock.to_keys":"\u0412\u0432\u0435\u0441\u0442\u0438 \u0432\u0440\u0435\u043C\u044F","clock.to_dial":"\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u043D\u0430 \u0446\u0438\u0444\u0435\u0440\u0431\u043B\u0430\u0442\u0435","clock.am":"AM","clock.pm":"PM","clock.invalid":"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F","clock.change":"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0432\u0440\u0435\u043C\u044F","fault.sensor_unavailable":"\u041D\u0435\u0438\u0441\u043F\u0440\u0430\u0432\u043D\u043E\u0441\u0442\u044C: \u0434\u0430\u0442\u0447\u0438\u043A \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u044B \u0432\u043E\u0434\u044B \u043D\u0435 \u0434\u0430\u0451\u0442 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u0438\u0439. \u041D\u0430\u0433\u0440\u0435\u0432 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D.","fault.not_rising":"\u041D\u0435\u0438\u0441\u043F\u0440\u0430\u0432\u043D\u043E\u0441\u0442\u044C: \u0432\u043E\u0434\u0430 \u043D\u0435 \u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0435\u0442\u0441\u044F. \u041D\u0430\u0433\u0440\u0435\u0432 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D; \u0441\u043C. \xAB\u0423\u0441\u0442\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\xBB.","fault.no_consumption":"\u041D\u0435\u0438\u0441\u043F\u0440\u0430\u0432\u043D\u043E\u0441\u0442\u044C: \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043F\u043E\u0442\u0440\u0435\u0431\u043B\u044F\u0435\u0442 \u044D\u043D\u0435\u0440\u0433\u0438\u044E. \u041D\u0430\u0433\u0440\u0435\u0432 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D; \u0441\u043C. \xAB\u0423\u0441\u0442\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\xBB.","fault.relay_stuck":"\u041D\u0435\u0438\u0441\u043F\u0440\u0430\u0432\u043D\u043E\u0441\u0442\u044C: \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C \u043F\u043E\u0442\u0440\u0435\u0431\u043B\u044F\u0435\u0442 \u044D\u043D\u0435\u0440\u0433\u0438\u044E, \u0445\u043E\u0442\u044F \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0440\u0435\u043B\u0435.","fault.top_probe":"\u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435: \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0434\u0430\u0442\u0447\u0438\u043A, \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E, \u043E\u0442\u043E\u0448\u0451\u043B. \u041D\u0430\u0433\u0440\u0435\u0432 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0442\u0441\u044F; \u0441\u043C. \xAB\u0423\u0441\u0442\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\xBB.","fault.middle_probe":"\u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435: \u0432\u0442\u043E\u0440\u043E\u0439 \u0434\u0430\u0442\u0447\u0438\u043A, \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E, \u043E\u0442\u043E\u0448\u0451\u043B. \u041D\u0430\u0433\u0440\u0435\u0432 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0442\u0441\u044F; \u0441\u043C. \xAB\u0423\u0441\u0442\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\xBB.","fault.probes_disagree":"\u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435: \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u0438\u044F \u0434\u0432\u0443\u0445 \u0434\u0430\u0442\u0447\u0438\u043A\u043E\u0432 \u0440\u0430\u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F. \u041D\u0430\u0433\u0440\u0435\u0432 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0442\u0441\u044F; \u0441\u043C. \xAB\u0423\u0441\u0442\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\xBB.","element.on":"\u0412\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C \u0432\u043A\u043B\u044E\u0447\u0451\u043D","element.off":"\u0412\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D","element.drawing":"{state} \xB7 \u043F\u043E\u0442\u0440\u0435\u0431\u043B\u044F\u0435\u0442 {watts} \u0412\u0442","keep_hot.until":"\u0412\u043E\u0434\u0430 \u0434\u0435\u0440\u0436\u0438\u0442\u0441\u044F \u0433\u043E\u0440\u044F\u0447\u0435\u0439 \u0434\u043E {time}","keep_hot.title":"\u0414\u0435\u0440\u0436\u0430\u0442\u044C \u0433\u043E\u0440\u044F\u0447\u0435\u0439 \u043F\u043E\u0441\u043B\u0435 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438","keep_hot.hint":"\u041F\u043E\u0441\u043B\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \xAB\u0433\u043E\u0442\u043E\u0432\u043E\xBB \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C \u0434\u0435\u0440\u0436\u0438\u0442 \u0432\u043E\u0434\u0443 \u0433\u043E\u0440\u044F\u0447\u0435\u0439 \u0441\u0442\u043E\u043B\u044C\u043A\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438, \u0430 \u0437\u0430\u0442\u0435\u043C \u0432\u044B\u043A\u043B\u044E\u0447\u0430\u0435\u0442\u0441\u044F.","keep_hot.more":"\u0412\u044B\u0431\u0440\u0430\u0442\u044C, \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0434\u0435\u0440\u0436\u0430\u0442\u044C \u0433\u043E\u0440\u044F\u0447\u0435\u0439","keep_hot.cancel":"\u041E\u0442\u043C\u0435\u043D\u0430","keep_hot.minutes":"{n} \u043C\u0438\u043D","keep_hot.hours":"{n} \u0447","heat_now_target.title":"\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430","heat_now_target.hint":"\u0422\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0430; \u0431\u043E\u0439\u043B\u0435\u0440 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043D\u0430 {target} \xB0C.","heat_now_target.down":"\u041D\u0430 1 \xB0C \u043C\u0435\u043D\u044C\u0448\u0435","heat_now_target.up":"\u041D\u0430 1 \xB0C \u0431\u043E\u043B\u044C\u0448\u0435",manual:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E: \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0432\u0440\u0443\u0447\u043D\u0443\u044E.","note.not_rising_skipped":"\u0422\u0435\u0440\u043C\u043E\u0441\u0442\u0430\u0442 \u043D\u0435 \u0441\u043E\u043E\u0431\u0449\u0430\u0435\u0442, \u043A\u043E\u0433\u0434\u0430 \u0433\u0440\u0435\u0435\u0442, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \xAB\u0432\u043E\u0434\u0430 \u043D\u0435 \u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0435\u0442\u0441\u044F\xBB \u0438 \xAB\u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043F\u043E\u0442\u0440\u0435\u0431\u043B\u044F\u0435\u0442 \u044D\u043D\u0435\u0440\u0433\u0438\u044E\xBB \u043D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u044E\u0442\u0441\u044F.","heat_now.start":"\u041D\u0430\u0433\u0440\u0435\u0442\u044C \u0441\u0435\u0439\u0447\u0430\u0441","heat_now.cancel":"\u041E\u0442\u043C\u0435\u043D\u0430","heat_now.join":"\u0421\u043E\u043E\u0431\u0449\u0438\u0442\u044C \u043C\u043D\u0435, \u043A\u043E\u0433\u0434\u0430 \u0431\u0443\u0434\u0435\u0442 \u0433\u043E\u0440\u044F\u0447\u0430\u044F","heat_now.leave":"\u041D\u0435 \u0441\u043E\u043E\u0431\u0449\u0430\u0442\u044C \u043C\u043D\u0435","subline.for":"\u0414\u043B\u044F: {list}.","item.at":"{name}, {time}","switch_off.link":"\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043D\u0430\u0433\u0440\u0435\u0432\u2026","switch_off.title":"\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043D\u0430\u0433\u0440\u0435\u0432?","switch_off.confirm":"\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C","switch_off.keep":"\u041E\u0442\u043C\u0435\u043D\u0430","switch_off.asked_one":"{names} \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u043F\u043E\u043B\u0443\u0447\u0438\u0442 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435.","switch_off.asked_many":"{names} \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0442 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435.","switch_off.skipped_one":"\u0411\u0435\u0437 \u0433\u043E\u0440\u044F\u0447\u0435\u0439 \u0432\u043E\u0434\u044B: {list}.","switch_off.skipped_many":"\u0411\u0435\u0437 \u0433\u043E\u0440\u044F\u0447\u0435\u0439 \u0432\u043E\u0434\u044B: {list}.","switch_off.back":"\u041D\u0430\u0433\u0440\u0435\u0432 \u0441\u0430\u043C \u0432\u043A\u043B\u044E\u0447\u0438\u0442\u0441\u044F \u0441\u043D\u043E\u0432\u0430 \u043A \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C\u0443 \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438.","switch_off.nobody":"\u041D\u0430\u0433\u0440\u0435\u0432 \u0441\u0435\u0439\u0447\u0430\u0441 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F.","settings.switch_off":"\u041A\u0442\u043E \u043C\u043E\u0436\u0435\u0442 \u0432\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043D\u0430\u0433\u0440\u0435\u0432 \u0434\u043B\u044F \u0432\u0441\u0435\u0445","settings.switch_off_hint":"\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u044B \u0438:","settings.own_cancel":"\u0422\u043E\u0442, \u043A\u0442\u043E \u043F\u043E\u043F\u0440\u043E\u0441\u0438\u043B, \u0432\u0441\u0435\u0433\u0434\u0430 \u043C\u043E\u0436\u0435\u0442 \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0441\u0432\u043E\u0439 \u0437\u0430\u043F\u0440\u043E\u0441.",greeting:"\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, {name}","today.label":"\u0414\u043E\u043C\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F","today.nobody":"\u0421\u0435\u0433\u043E\u0434\u043D\u044F \u043D\u0438\u043A\u043E\u0433\u043E","away.until_label":"\u0414\u043E (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)","away.line":"\u041D\u0435\u0442 \u0434\u043E\u043C\u0430","away.line_until":"\u041D\u0435\u0442 \u0434\u043E\u043C\u0430 \u0434\u043E {date}","members.add":"\u0423\u0447\u0430\u0441\u0442\u043D\u0438\u043A","card.no_heater":"\u0412\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C Hot Water Ready \u0435\u0449\u0451 \u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D.","card.loading":"\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026","card.error":"\u041D\u0435 \u043F\u043E\u043B\u0443\u0447\u0438\u043B\u043E\u0441\u044C: {message}","cluster.warning":"\u0414\u043B\u044F \u0434\u0443\u0448\u0430 \u043D\u0430\u0447\u0438\u043D\u0430\u044F \u0441 {when} \u043D\u0443\u0436\u043D\u0430 \u0432\u043E\u0434\u0430 {needed} \xB0C, \u043D\u043E \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C \u0433\u0440\u0435\u0435\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043E {cap} \xB0C: \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u043C \u0432\u043E\u0434\u0430 \u043C\u043E\u0436\u0435\u0442 \u0434\u043E\u0441\u0442\u0430\u0442\u044C\u0441\u044F \u043F\u0440\u043E\u0445\u043B\u0430\u0434\u043D\u0435\u0435.","tabs.people":"\u041B\u044E\u0434\u0438","tabs.week":"\u041D\u0435\u0434\u0435\u043B\u044F","week.days":"\u041F\u043D,\u0412\u0442,\u0421\u0440,\u0427\u0442,\u041F\u0442,\u0421\u0431,\u0412\u0441","week.showers":"\u0434\u0443\u0448","week.windows":"\u043E\u043A\u043D\u0430 \u043D\u0430\u0433\u0440\u0435\u0432\u0430","week.busiest":"\u0441\u0430\u043C\u044B\u0439 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043D\u044B\u0439 \u0434\u0435\u043D\u044C","week.heating":"\u041D\u0430\u0433\u0440\u0435\u0432","week.away":"\u043D\u0435\u0442 \u0434\u043E\u043C\u0430","week.virtual":"\u0432\u0438\u0440\u0442\u0443\u0430\u043B\u044C\u043D\u044B\u0439 \xB7 {count}","week.per_week":"\u0432 \u043D\u0435\u0434\u0435\u043B\u044E: {count}","week.hint":"\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0430, \u0447\u0442\u043E\u0431\u044B \u0432\u044B\u0434\u0435\u043B\u0438\u0442\u044C \u0435\u0433\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0430. \u041F\u043E\u043B\u043E\u0441\u044B \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442, \u043A\u043E\u0433\u0434\u0430 \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C \u043C\u043E\u0436\u0435\u0442 \u0433\u0440\u0435\u0442\u044C \u0432 \u043A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C ({start}\u2013{end}).","settings.open":"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044F","settings.close":"\u0417\u0430\u043A\u0440\u044B\u0442\u044C","settings.target":"\u0426\u0435\u043B\u0435\u0432\u0430\u044F \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430","settings.target_hint":"\u0413\u043E\u0442\u043E\u0432\u043E, \u043A\u043E\u0433\u0434\u0430 \u0432\u043E\u0434\u0430 \u043D\u0430\u0433\u0440\u0435\u0435\u0442\u0441\u044F \u0434\u043E \u043D\u0435\u0451","settings.target_down":"\u041F\u043E\u043D\u0438\u0437\u0438\u0442\u044C \u0446\u0435\u043B\u044C","settings.target_up":"\u041F\u043E\u0432\u044B\u0441\u0438\u0442\u044C \u0446\u0435\u043B\u044C","settings.margin":"\u0417\u0430\u043F\u0430\u0441","settings.band":"\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u043F\u0440\u0438 {stop} \xB0C, \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u044B\u0439 \u043F\u0443\u0441\u043A \u043F\u0440\u0438 {restart} \xB0C","settings.margin_down":"\u0423\u043C\u0435\u043D\u044C\u0448\u0438\u0442\u044C \u0437\u0430\u043F\u0430\u0441","settings.margin_up":"\u0423\u0432\u0435\u043B\u0438\u0447\u0438\u0442\u044C \u0437\u0430\u043F\u0430\u0441","settings.automatic":"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435","settings.automatic_hint":"\u0412\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E: \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0432\u0440\u0443\u0447\u043D\u0443\u044E","settings.more":"\u0414\u0440\u0443\u0433\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438","rate.title":"\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043D\u0430\u0433\u0440\u0435\u0432\u0430","rate.unit":"\u043C\u0438\u043D \u043D\u0430 \xB0C","rate.automatic":"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438","rate.fixed":"\u0424\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u0430\u044F","rate.learned":"\u0418\u0437\u0443\u0447\u0435\u043D\u043E: \u043C\u0435\u0434\u0438\u0430\u043D\u0430 \u0447\u0438\u0441\u0442\u044B\u0445 \u043D\u0430\u0433\u0440\u0435\u0432\u043E\u0432 ({count}) \u0437\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 {days} \u0434\u043D.","rate.default_one":"\u041D\u0430\u0447\u0430\u043B\u044C\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u0435\u0449\u0451 1 \u0447\u0438\u0441\u0442\u044B\u0439 \u043D\u0430\u0433\u0440\u0435\u0432 \u0437\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 {days} \u0434\u043D., \u0438 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0431\u0443\u0434\u0435\u0442 \u0438\u0437\u0443\u0447\u0435\u043D\u0430","rate.default_many":"\u041D\u0430\u0447\u0430\u043B\u044C\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043D\u0443\u0436\u043D\u043E \u0435\u0449\u0451 \u0447\u0438\u0441\u0442\u044B\u0445 \u043D\u0430\u0433\u0440\u0435\u0432\u043E\u0432 \u0437\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 {days} \u0434\u043D.: {count}, \u0438 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0431\u0443\u0434\u0435\u0442 \u0438\u0437\u0443\u0447\u0435\u043D\u0430","rate.manual":"\u0417\u0430\u0434\u0430\u043D\u043E \u0432\u0440\u0443\u0447\u043D\u0443\u044E: \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0442\u0441\u044F, \u043D\u043E \u043D\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F","rate.runs":"\u0427\u0438\u0441\u0442\u044B\u0445 \u043D\u0430\u0433\u0440\u0435\u0432\u043E\u0432 \u0432 \u0440\u0430\u0441\u0447\u0451\u0442\u0435","rate.example":"\u0421\u0435\u0439\u0447\u0430\u0441 {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} \u043C\u0438\u043D, \u043F\u043B\u044E\u0441 {margin} \u043C\u0438\u043D \u0437\u0430\u043F\u0430\u0441\u0430: \u043D\u0430\u0447\u0430\u043B\u043E \u0437\u0430 {lead} \u043C\u0438\u043D","rate.example_cap":" (\u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C)","rate.example_warm":"\u0421\u0435\u0439\u0447\u0430\u0441 {from} \xB0C: \u0446\u0435\u043B\u044C \u0443\u0436\u0435 \u0434\u043E\u0441\u0442\u0438\u0433\u043D\u0443\u0442\u0430, \u043D\u0430\u0447\u0438\u043D\u0430\u0442\u044C \u0437\u0430\u0440\u0430\u043D\u0435\u0435 \u043D\u0435 \u043D\u0443\u0436\u043D\u043E","rate.physics":"\u041F\u043E \u0444\u0438\u0437\u0438\u043A\u0435, \u0432\u0435\u0441\u044C \u0431\u0430\u043A \u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0435\u0442\u0441\u044F \u0422\u042D\u041D\u043E\u043C: {rate} \u043C\u0438\u043D/\xB0C","rate.physics_range":"\u041F\u043E \u0444\u0438\u0437\u0438\u043A\u0435: \u043E\u0442 {fast} \u043C\u0438\u043D/\xB0C (\u0442\u043E\u043B\u044C\u043A\u043E \u0432\u043E\u0434\u0430 \u0432\u044B\u0448\u0435 \u0422\u042D\u041D\u0430) \u0434\u043E {slow} \u043C\u0438\u043D/\xB0C (\u0432\u0435\u0441\u044C \u0431\u0430\u043A)","rate.volume":"\u0421\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u043D\u0430\u0433\u0440\u0435\u0432\u0443 {litres} \u043B \u0438\u0437 {tank} \u043B \u0431\u0430\u043A\u0430","rate.far_below":": \u043D\u0430 {percent}% \u043D\u0438\u0436\u0435 \u0444\u0438\u0437\u0438\u043A\u0438. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043E\u0431\u044A\u0451\u043C \u0431\u0430\u043A\u0430, \u043C\u043E\u0449\u043D\u043E\u0441\u0442\u044C \u0422\u042D\u041D\u0430 \u0438 \u043C\u0435\u0441\u0442\u043E \u0434\u0430\u0442\u0447\u0438\u043A\u0430.","rate.far_above":": \u043D\u0430 {percent}% \u0432\u044B\u0448\u0435 \u0444\u0438\u0437\u0438\u043A\u0438. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043E\u0431\u044A\u0451\u043C \u0431\u0430\u043A\u0430, \u043C\u043E\u0449\u043D\u043E\u0441\u0442\u044C \u0422\u042D\u041D\u0430 \u0438 \u043C\u0435\u0441\u0442\u043E \u0434\u0430\u0442\u0447\u0438\u043A\u0430.","rate.suggested_learned":"\u041F\u0440\u0435\u0434\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F: {rate} (\u0438\u0437\u0443\u0447\u0435\u043D\u043E)","rate.suggested_physics":"\u041F\u0440\u0435\u0434\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F: {rate} (\u0444\u0438\u0437\u0438\u043A\u0430 \u0431\u0430\u043A\u0430)","rate.suggested_default":"\u041F\u0440\u0435\u0434\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F: {rate} (\u043D\u0430\u0447\u0430\u043B\u044C\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435)","rate.use":"\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C","rate.down":"\u041D\u0430 0,1 \u043C\u0438\u043D \u043D\u0430 \xB0C \u043C\u0435\u043D\u044C\u0448\u0435","rate.up":"\u041D\u0430 0,1 \u043C\u0438\u043D \u043D\u0430 \xB0C \u0431\u043E\u043B\u044C\u0448\u0435","rate.recalculate":"\u041F\u0435\u0440\u0435\u0441\u0447\u0438\u0442\u0430\u0442\u044C \u043F\u043E \u0438\u0441\u0442\u043E\u0440\u0438\u0438","rate.recalculating":"\u041F\u0440\u043E\u0441\u043C\u0430\u0442\u0440\u0438\u0432\u0430\u044E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u044E\u044E \u043D\u0435\u0434\u0435\u043B\u044E\u2026","rate.found":"\u0427\u0438\u0441\u0442\u044B\u0445 \u043D\u0430\u0433\u0440\u0435\u0432\u043E\u0432 \u0432 \u0438\u0441\u0442\u043E\u0440\u0438\u0438: {count}; \u0438\u0437\u0443\u0447\u0435\u043D\u043E {rate} \u043C\u0438\u043D/\xB0C.","rate.found_too_few":"\u0427\u0438\u0441\u0442\u044B\u0445 \u043D\u0430\u0433\u0440\u0435\u0432\u043E\u0432 \u0432 \u0438\u0441\u0442\u043E\u0440\u0438\u0438: {count}; \u0434\u043B\u044F \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u044F \u043D\u0443\u0436\u043D\u043E {needed}.","solar.title":"\u0421\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435 \u0441 \u0443\u0447\u0451\u0442\u043E\u043C \u0441\u043E\u043B\u043D\u0446\u0430","solar.none":"\u0417\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 30 \u0434\u043D\u0435\u0439 \u043E\u043A\u043E\u043D \u043F\u043E\u043A\u0430 \u043D\u0435 \u0437\u0430\u043F\u0438\u0441\u0430\u043D\u043E.","solar.would":"\u0421 \u0432\u043A\u043B\u044E\u0447\u0451\u043D\u043D\u044B\u043C \u043F\u0440\u0430\u0432\u0438\u043B\u043E\u043C \u0441 \u0443\u0447\u0451\u0442\u043E\u043C \u0441\u043E\u043B\u043D\u0446\u0430 \u0432\u043E\u0434\u0430 \u0431\u044B\u043B\u0430 \u0431\u044B \u0433\u043E\u0442\u043E\u0432\u0430 \u0432\u043E\u0432\u0440\u0435\u043C\u044F \u0432 \u043E\u043A\u043D\u0430\u0445: {on_time} \u0438\u0437 {windows}","solar.did":"\u0421 \u043F\u0440\u0430\u0432\u0438\u043B\u043E\u043C \u0441 \u0443\u0447\u0451\u0442\u043E\u043C \u0441\u043E\u043B\u043D\u0446\u0430 \u0432\u043E\u0434\u0430 \u0431\u044B\u043B\u0430 \u0433\u043E\u0442\u043E\u0432\u0430 \u0432\u043E\u0432\u0440\u0435\u043C\u044F \u0432 \u043E\u043A\u043D\u0430\u0445: {on_time} \u0438\u0437 {windows}","solar.would_less":", \u0430 \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C \u0440\u0430\u0431\u043E\u0442\u0430\u043B \u0431\u044B \u043D\u0430 {minutes} \u043C\u0438\u043D \u043C\u0435\u043D\u044C\u0448\u0435","solar.would_more":", \u0430 \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C \u0440\u0430\u0431\u043E\u0442\u0430\u043B \u0431\u044B \u043D\u0430 {minutes} \u043C\u0438\u043D \u0431\u043E\u043B\u044C\u0448\u0435","solar.did_less":", \u0430 \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C \u0440\u0430\u0431\u043E\u0442\u0430\u043B \u043D\u0430 {minutes} \u043C\u0438\u043D \u043C\u0435\u043D\u044C\u0448\u0435","solar.did_more":", \u0430 \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C \u0440\u0430\u0431\u043E\u0442\u0430\u043B \u043D\u0430 {minutes} \u043C\u0438\u043D \u0431\u043E\u043B\u044C\u0448\u0435","solar.kwh":", \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E {kwh} \u043A\u0412\u0442\xB7\u0447","solar.applied":" \u041F\u0440\u0430\u0432\u0438\u043B\u043E \u043F\u0440\u0438\u043C\u0435\u043D\u044F\u043B\u043E\u0441\u044C \u0432 {applied} \u0438\u0437 \u043D\u0438\u0445: \u0432\u043E\u0432\u0440\u0435\u043C\u044F \u0432 {on_time}.","subline.starts_at":"\u041D\u0430\u0433\u0440\u0435\u0432 \u043D\u0430\u0447\u043D\u0451\u0442\u0441\u044F \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u0432 {when}.","subline.starts_at_solar":"\u041D\u0430\u0433\u0440\u0435\u0432 \u043D\u0430\u0447\u043D\u0451\u0442\u0441\u044F \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u0432 {when}, \u0435\u0441\u043B\u0438 \u0441\u043E\u043B\u043D\u0446\u0435 \u043D\u0435 \u043D\u0430\u0433\u0440\u0435\u0435\u0442 \u0432\u043E\u0434\u0443 \u0440\u0430\u043D\u044C\u0448\u0435.","subline.asked_by_one":"\u0417\u0430\u043F\u0440\u043E\u0441 \u043E\u0442: {name}. \u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u0434\u0451\u0442, \u043A\u043E\u0433\u0434\u0430 \u0431\u0443\u0434\u0435\u0442 \u0433\u043E\u0442\u043E\u0432\u043E.","subline.asked_by_many":"\u0417\u0430\u043F\u0440\u043E\u0441 \u043E\u0442: {names}. \u041A\u0430\u0436\u0434\u044B\u0439 \u043F\u043E\u043B\u0443\u0447\u0438\u0442 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435, \u043A\u043E\u0433\u0434\u0430 \u0431\u0443\u0434\u0435\u0442 \u0433\u043E\u0442\u043E\u0432\u043E.","names.and":" \u0438 ","today.you":"\u0412\u044B","list.mine":"\u041C\u043E\u0438 \u0432\u0440\u0435\u043C\u0435\u043D\u0430 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438","list.count_one":"1 \u0432\u0440\u0435\u043C\u044F \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438","list.count":"\u0412\u0440\u0435\u043C\u0451\u043D \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438: {count}","list.virtual":"\u0412\u0438\u0440\u0442\u0443\u0430\u043B\u044C\u043D\u044B\u0439 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A \xB7 \u043E\u0431\u0449\u0438\u0435 \u0432\u0440\u0435\u043C\u0435\u043D\u0430 \u0434\u043E\u043C\u0430","away.paused":"\u041F\u0440\u0438\u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E. \u0412\u0440\u0435\u043C\u0435\u043D\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B.","member_settings.open":"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0432\u0440\u0435\u043C\u0451\u043D \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438","visibility.private":"\u041B\u0438\u0447\u043D\u043E\u0435","visibility.hint_own":"\u0414\u0440\u0443\u0433\u0438\u0435 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0438 \u043D\u0435 \u0432\u0438\u0434\u044F\u0442 \u044D\u0442\u0438 \u0432\u0440\u0435\u043C\u0435\u043D\u0430 \u0438 \u0432\u0430\u0448\u0438 \u0437\u0430\u043F\u0440\u043E\u0441\u044B \xAB\u041D\u0430\u0433\u0440\u0435\u0442\u044C \u0441\u0435\u0439\u0447\u0430\u0441\xBB; \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u044B \u0432\u0438\u0434\u044F\u0442.","visibility.hint_virtual":"\u042D\u0442\u0438 \u0432\u0440\u0435\u043C\u0435\u043D\u0430 \u0432\u0438\u0434\u044F\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u044B.","settings.no_people":"\u0412 Home Assistant \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043B\u044E\u0434\u0435\u0439 \u0434\u043B\u044F \u0432\u044B\u0431\u043E\u0440\u0430.","editor.heater":"\u0412\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0442\u0435\u043B\u044C","editor.compact":"\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u043E: \u0442\u043E\u043B\u044C\u043A\u043E \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430 \u0438 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435, \u0431\u0435\u0437 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F","editor.tap_action":"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u0440\u0438 \u043D\u0430\u0436\u0430\u0442\u0438\u0438"};var xt={"status.waiting":"Vilar","status.heating":"V\xE4rmer","status.ready":"Klart","status.fault":"Fel","status.manual":"Manuell","headline.heating_for":"V\xE4rmer: klart om cirka {minutes} min","headline.ready_at":"Klart {when}","subline.next_at":"N\xE4sta {when}","when.today":"kl. {time}","when.tomorrow":"i morgon kl. {time}","when.weekday":"{weekday} kl. {time}","ring.target":"m\xE5l {target}\xB0","weekday.letters":"M,T,O,T,F,L,S","members.none":"Inga medlemmar \xE4n. En administrat\xF6r l\xE4gger till dem i integrationens inst\xE4llningar.","list.empty":"Inga klartider \xE4n.","list.add":"L\xE4gg till en klartid","sheet.delete":"Ta bort","list.switch":"P\xE5 eller av","sheet.title":"Ny klartid","sheet.edit_title":"\xC4ndra klartid","list.edit":"\xC4ndra den h\xE4r klartiden","sheet.time":"Tid","sheet.hour":"Timme","sheet.minute":"Minut","sheet.days":"Dagar","sheet.save":"Spara","sheet.cancel":"Avbryt","clock.title":"V\xE4lj tid","clock.title_keys":"Ange tid","clock.ok":"OK","clock.to_keys":"Skriv tiden","clock.to_dial":"Anv\xE4nd klockan","clock.am":"FM","clock.pm":"EM","clock.invalid":"Ange en giltig tid","clock.change":"\xC4ndra tiden","fault.sensor_unavailable":"Fel: sensorn f\xF6r vattentemperatur ger inga avl\xE4sningar. Uppv\xE4rmningen har stoppats.","fault.not_rising":"Fel: vattnet blir inte varmare. Uppv\xE4rmningen har stoppats; se Lagningar.","fault.no_consumption":"Fel: beredaren drar ingen str\xF6m. Uppv\xE4rmningen har stoppats; se Lagningar.","fault.relay_stuck":"Fel: beredaren drar str\xF6m fast den \xE4r avst\xE4ngd. Kontrollera rel\xE4et.","fault.top_probe":"Varning: huvudgivaren kan sitta l\xF6st. Uppv\xE4rmningen forts\xE4tter; se Lagningar.","fault.middle_probe":"Varning: den andra givaren kan sitta l\xF6st. Uppv\xE4rmningen forts\xE4tter; se Lagningar.","fault.probes_disagree":"Varning: de tv\xE5 givarna visar olika. Uppv\xE4rmningen forts\xE4tter; se Lagningar.","element.on":"Beredaren p\xE5","element.off":"Beredaren av","element.drawing":"{state} \xB7 drar {watts} W","keep_hot.until":"H\xE5lls varmt till kl. {time}","keep_hot.title":"H\xE5ll varmt n\xE4r det \xE4r klart","keep_hot.hint":"Efter meddelandet \u201Dklart\u201D h\xE5ller beredaren vattnet varmt s\xE5 h\xE4r l\xE4nge och st\xE4nger sedan av.","keep_hot.more":"V\xE4lj hur l\xE4nge det ska h\xE5llas varmt","keep_hot.cancel":"Avbryt","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h","heat_now_target.title":"Temperatur","heat_now_target.hint":"Bara f\xF6r den h\xE4r beg\xE4ran; varmvattenberedaren stannar p\xE5 {target} \xB0C.","heat_now_target.down":"1 \xB0C mindre","heat_now_target.up":"1 \xB0C mer",manual:"Automatisk styrning \xE4r av: beredaren styrs f\xF6r hand.","note.not_rising_skipped":"Termostaten anger inte n\xE4r den v\xE4rmer, s\xE5 kontrollerna \u201Dvattnet blir inte varmare\u201D och \u201Dberedaren drar ingen str\xF6m\u201D g\xF6rs inte.","heat_now.start":"V\xE4rm nu","heat_now.cancel":"Avbryt","heat_now.join":"S\xE4g till n\xE4r det \xE4r varmt","heat_now.leave":"S\xE4g inte till mig","subline.for":"F\xF6r {list}.","item.at":"{name} kl. {time}","switch_off.link":"St\xE4ng av uppv\xE4rmningen\u2026","switch_off.title":"St\xE4nga av uppv\xE4rmningen?","switch_off.confirm":"St\xE4ng av","switch_off.keep":"Avbryt","switch_off.asked_one":"{names} f\xE5r inte l\xE4ngre besked.","switch_off.asked_many":"{names} f\xE5r inte l\xE4ngre besked.","switch_off.skipped_one":"Utan varmvatten: {list}.","switch_off.skipped_many":"Utan varmvatten: {list}.","switch_off.back":"Den sl\xE5s p\xE5 igen av sig sj\xE4lv till n\xE4sta klartid.","switch_off.nobody":"Uppv\xE4rmningen stoppas nu.","settings.switch_off":"Vem som f\xE5r st\xE4nga av uppv\xE4rmningen f\xF6r alla","settings.switch_off_hint":"Administrat\xF6rerna och:","settings.own_cancel":"Den som bad om det kan alltid avbryta sin egen beg\xE4ran.",greeting:"Hej, {name}","today.label":"Hemma i dag","today.nobody":"Ingen i dag","away.until_label":"Till (valfritt)","away.line":"Bortrest","away.line_until":"Bortrest till {date}","members.add":"Medlem","card.no_heater":"Ingen Hot Water Ready-beredare har konfigurerats \xE4n.","card.loading":"Laddar\u2026","card.error":"Det gick inte: {message}","cluster.warning":"Duscharna fr\xE5n {when} beh\xF6ver vattnet vid {needed} \xB0C, men beredaren v\xE4rmer bara till {cap} \xB0C: de sista kan bli svalare.","tabs.people":"Personer","tabs.week":"Vecka","week.days":"M\xE5n,Tis,Ons,Tor,Fre,L\xF6r,S\xF6n","week.showers":"duschar","week.windows":"uppv\xE4rmningsf\xF6nster","week.busiest":"mest belastade dag","week.heating":"Uppv\xE4rmning","week.away":"bortrest","week.virtual":"virtuell \xB7 {count}","week.per_week":"{count} i veckan","week.hint":"Tryck p\xE5 en person f\xF6r att markera personens tider. Staplarna visar n\xE4r beredaren f\xE5r v\xE4rma varje dag ({start} till {end}).","settings.open":"Beredarinst\xE4llningar","settings.close":"St\xE4ng","settings.target":"M\xE5ltemperatur","settings.target_hint":"Klart n\xE4r vattnet n\xE5r hit","settings.target_down":"S\xE4nk m\xE5let","settings.target_up":"H\xF6j m\xE5let","settings.margin":"Marginal","settings.band":"Stoppar vid {stop} \xB0C, startar om vid {restart} \xB0C","settings.margin_down":"S\xE4nk marginalen","settings.margin_up":"H\xF6j marginalen","settings.automatic":"Automatisk styrning","settings.automatic_hint":"Av: beredaren styrs f\xF6r hand","settings.more":"Fler inst\xE4llningar","rate.title":"Uppv\xE4rmningstakt","rate.unit":"min per \xB0C","rate.automatic":"Automatisk","rate.fixed":"Fast","rate.learned":"Inl\xE4rd: median av de {count} rena uppv\xE4rmningarna de senaste {days} dagarna","rate.default_one":"Startv\xE4rde: 1 ren uppv\xE4rmning till de senaste {days} dagarna, s\xE5 \xE4r takten inl\xE4rd","rate.default_many":"Startv\xE4rde: {count} rena uppv\xE4rmningar till de senaste {days} dagarna, s\xE5 \xE4r takten inl\xE4rd","rate.manual":"Fast inst\xE4lld f\xF6r hand: inl\xE4rningen forts\xE4tter men anv\xE4nds inte","rate.runs":"Rena uppv\xE4rmningar som underlag","rate.example":"Nu {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} min, plus {margin} min marginal: startar {lead} min f\xF6re","rate.example_cap":" (som mest)","rate.example_warm":"Nu {from} \xB0C: redan vid m\xE5let, ingen anledning att starta tidigt","rate.physics":"Enligt fysiken, hela tanken uppv\xE4rmd av elementet: {rate} min/\xB0C","rate.physics_range":"Enligt fysiken: mellan {fast} min/\xB0C (bara vattnet ovanf\xF6r elementet) och {slow} min/\xB0C (hela tanken)","rate.volume":"Motsvarar att v\xE4rma {litres} L av tankens {tank} L","rate.far_below":": {percent}% under fysiken. Kontrollera tankens volym, elementets effekt och var givaren sitter.","rate.far_above":": {percent}% \xF6ver fysiken. Kontrollera tankens volym, elementets effekt och var givaren sitter.","rate.suggested_learned":"F\xF6rslag: {rate} (inl\xE4rd)","rate.suggested_physics":"F\xF6rslag: {rate} (tankens fysik)","rate.suggested_default":"F\xF6rslag: {rate} (startv\xE4rde)","rate.use":"Anv\xE4nd","rate.down":"0,1 min per \xB0C mindre","rate.up":"0,1 min per \xB0C mer","rate.recalculate":"R\xE4kna om fr\xE5n historiken","rate.recalculating":"G\xE5r igenom den senaste veckan\u2026","rate.found":"Hittade {count} rena uppv\xE4rmningar i historiken; inl\xE4rd takt {rate} min/\xB0C.","rate.found_too_few":"Hittade {count} rena uppv\xE4rmningar i historiken; {needed} beh\xF6vs f\xF6r inl\xE4rning.","solar.title":"Solj\xE4mf\xF6relse","solar.none":"Inga f\xF6nster registrerade de senaste 30 dagarna \xE4n.","solar.would":"Med regeln med solh\xE4nsyn p\xE5 hade vattnet varit klart i tid i {on_time} av {windows} f\xF6nster","solar.did":"Med regeln med solh\xE4nsyn var vattnet klart i tid i {on_time} av {windows} f\xF6nster","solar.would_less":", och beredaren hade g\xE5tt {minutes} minuter mindre","solar.would_more":", och beredaren hade g\xE5tt {minutes} minuter mer","solar.did_less":", och beredaren gick {minutes} minuter mindre","solar.did_more":", och beredaren gick {minutes} minuter mer","solar.kwh":", cirka {kwh} kWh","solar.applied":" Regeln till\xE4mpades i {applied} av dem: i tid i {on_time}.","subline.starts_at":"B\xF6rjar v\xE4rma omkring {when}.","subline.starts_at_solar":"B\xF6rjar v\xE4rma omkring {when}, om solen inte har gjort det innan dess.","subline.asked_by_one":"Beg\xE4rt av {name}, som f\xE5r besked n\xE4r det \xE4r klart.","subline.asked_by_many":"Beg\xE4rt av {names}. Var och en f\xE5r besked n\xE4r det \xE4r klart.","names.and":" och ","today.you":"Du","list.mine":"Mina klartider","list.count_one":"1 klartid","list.count":"{count} klartider","list.virtual":"Virtuell medlem \xB7 hush\xE5llets gemensamma tider","away.paused":"Pausad. Tiderna sparas.","member_settings.open":"Inst\xE4llningar f\xF6r klartider","visibility.private":"Privat","visibility.hint_own":"Andra medlemmar ser inte de h\xE4r tiderna eller dina V\xE4rm nu-f\xF6rfr\xE5gningar; administrat\xF6rer g\xF6r det.","visibility.hint_virtual":"Bara administrat\xF6rer ser de h\xE4r tiderna.","settings.no_people":"Det finns inga personer i Home Assistant att v\xE4lja \xE4n.","editor.heater":"Varmvattenberedare","editor.compact":"Kompakt: bara temperatur och status, utan knappar","editor.tap_action":"\xC5tg\xE4rd vid tryck"};var Ct={"status.waiting":"\u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F","status.heating":"\u041D\u0430\u0433\u0440\u0456\u0432\u0430\u043D\u043D\u044F","status.ready":"\u0413\u043E\u0442\u043E\u0432\u043E","status.fault":"\u041D\u0435\u0441\u043F\u0440\u0430\u0432\u043D\u0456\u0441\u0442\u044C","status.manual":"\u0412\u0440\u0443\u0447\u043D\u0443","headline.heating_for":"\u041D\u0430\u0433\u0440\u0456\u0432\u0430\u043D\u043D\u044F: \u0433\u043E\u0442\u043E\u0432\u043E \u043F\u0440\u0438\u0431\u043B\u0438\u0437\u043D\u043E \u0437\u0430 {minutes} \u0445\u0432","headline.ready_at":"\u0413\u043E\u0442\u043E\u0432\u043E: {when}","subline.next_at":"\u041D\u0430\u0441\u0442\u0443\u043F\u043D\u0438\u0439: {when}","when.today":"{time}","when.tomorrow":"\u0437\u0430\u0432\u0442\u0440\u0430, {time}","when.weekday":"{weekday}, {time}","ring.target":"\u0446\u0456\u043B\u044C {target}\xB0","weekday.letters":"\u041F\u043D,\u0412\u0442,\u0421\u0440,\u0427\u0442,\u041F\u0442,\u0421\u0431,\u041D\u0434","members.none":"\u0423\u0447\u0430\u0441\u043D\u0438\u043A\u0456\u0432 \u0449\u0435 \u043D\u0435\u043C\u0430\u0454. \u0407\u0445 \u0434\u043E\u0434\u0430\u0454 \u0430\u0434\u043C\u0456\u043D\u0456\u0441\u0442\u0440\u0430\u0442\u043E\u0440 \u0443 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F\u0445 \u0456\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0456\u0457.","list.empty":"\u0427\u0430\u0441\u0443 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0456 \u0449\u0435 \u043D\u0435\u043C\u0430\u0454.","list.add":"\u0414\u043E\u0434\u0430\u0442\u0438 \u0447\u0430\u0441 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0456","sheet.delete":"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438","list.switch":"\u0423\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438 \u0430\u0431\u043E \u0432\u0438\u043C\u043A\u043D\u0443\u0442\u0438","sheet.title":"\u041D\u043E\u0432\u0438\u0439 \u0447\u0430\u0441 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0456","sheet.edit_title":"\u0417\u043C\u0456\u043D\u0438\u0442\u0438 \u0447\u0430\u0441 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0456","list.edit":"\u0417\u043C\u0456\u043D\u0438\u0442\u0438 \u0446\u0435\u0439 \u0447\u0430\u0441 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0456","sheet.time":"\u0427\u0430\u0441","sheet.hour":"\u0413\u043E\u0434\u0438\u043D\u0430","sheet.minute":"\u0425\u0432\u0438\u043B\u0438\u043D\u0430","sheet.days":"\u0414\u043D\u0456","sheet.save":"\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438","sheet.cancel":"\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438","clock.title":"\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044C \u0447\u0430\u0441","clock.title_keys":"\u0412\u0432\u0435\u0434\u0456\u0442\u044C \u0447\u0430\u0441","clock.ok":"OK","clock.to_keys":"\u0412\u0432\u0435\u0441\u0442\u0438 \u0447\u0430\u0441","clock.to_dial":"\u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u0430\u0442\u0438 \u0433\u043E\u0434\u0438\u043D\u043D\u0438\u043A","clock.am":"AM","clock.pm":"PM","clock.invalid":"\u0412\u0432\u0435\u0434\u0456\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0447\u0430\u0441","clock.change":"\u0417\u043C\u0456\u043D\u0438\u0442\u0438 \u0447\u0430\u0441","fault.sensor_unavailable":"\u041D\u0435\u0441\u043F\u0440\u0430\u0432\u043D\u0456\u0441\u0442\u044C: \u0434\u0430\u0442\u0447\u0438\u043A \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0438 \u0432\u043E\u0434\u0438 \u043D\u0435 \u0434\u0430\u0454 \u043F\u043E\u043A\u0430\u0437\u043D\u0438\u043A\u0456\u0432. \u041D\u0430\u0433\u0440\u0456\u0432 \u0437\u0443\u043F\u0438\u043D\u0435\u043D\u043E.","fault.not_rising":"\u041D\u0435\u0441\u043F\u0440\u0430\u0432\u043D\u0456\u0441\u0442\u044C: \u0432\u043E\u0434\u0430 \u043D\u0435 \u0441\u0442\u0430\u0454 \u0433\u0430\u0440\u044F\u0447\u0456\u0448\u043E\u044E. \u041D\u0430\u0433\u0440\u0456\u0432 \u0437\u0443\u043F\u0438\u043D\u0435\u043D\u043E; \u0434\u0438\u0432. \u0412\u0438\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044F \u043F\u0440\u043E\u0431\u043B\u0435\u043C.","fault.no_consumption":"\u041D\u0435\u0441\u043F\u0440\u0430\u0432\u043D\u0456\u0441\u0442\u044C: \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447 \u043D\u0435 \u0441\u043F\u043E\u0436\u0438\u0432\u0430\u0454 \u0435\u043D\u0435\u0440\u0433\u0456\u0457. \u041D\u0430\u0433\u0440\u0456\u0432 \u0437\u0443\u043F\u0438\u043D\u0435\u043D\u043E; \u0434\u0438\u0432. \u0412\u0438\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044F \u043F\u0440\u043E\u0431\u043B\u0435\u043C.","fault.relay_stuck":"\u041D\u0435\u0441\u043F\u0440\u0430\u0432\u043D\u0456\u0441\u0442\u044C: \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447 \u0441\u043F\u043E\u0436\u0438\u0432\u0430\u0454 \u0435\u043D\u0435\u0440\u0433\u0456\u044E, \u0445\u043E\u0447\u0430 \u0432\u0438\u043C\u043A\u043D\u0435\u043D\u0438\u0439. \u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u0440\u0435\u043B\u0435.","fault.top_probe":"\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F: \u043E\u0441\u043D\u043E\u0432\u043D\u0438\u0439 \u0434\u0430\u0442\u0447\u0438\u043A, \u043C\u043E\u0436\u043B\u0438\u0432\u043E, \u043E\u0441\u043B\u0430\u0431. \u041D\u0430\u0433\u0440\u0456\u0432 \u0442\u0440\u0438\u0432\u0430\u0454; \u0434\u0438\u0432. \u0412\u0438\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044F \u043F\u0440\u043E\u0431\u043B\u0435\u043C.","fault.middle_probe":"\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F: \u0434\u0440\u0443\u0433\u0438\u0439 \u0434\u0430\u0442\u0447\u0438\u043A, \u043C\u043E\u0436\u043B\u0438\u0432\u043E, \u043E\u0441\u043B\u0430\u0431. \u041D\u0430\u0433\u0440\u0456\u0432 \u0442\u0440\u0438\u0432\u0430\u0454; \u0434\u0438\u0432. \u0412\u0438\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044F \u043F\u0440\u043E\u0431\u043B\u0435\u043C.","fault.probes_disagree":"\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F: \u0434\u0432\u0430 \u0434\u0430\u0442\u0447\u0438\u043A\u0438 \u043F\u043E\u043A\u0430\u0437\u0443\u044E\u0442\u044C \u0440\u0456\u0437\u043D\u0435. \u041D\u0430\u0433\u0440\u0456\u0432 \u0442\u0440\u0438\u0432\u0430\u0454; \u0434\u0438\u0432. \u0412\u0438\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044F \u043F\u0440\u043E\u0431\u043B\u0435\u043C.","element.on":"\u041D\u0430\u0433\u0440\u0456\u0432\u0430\u0447 \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E","element.off":"\u041D\u0430\u0433\u0440\u0456\u0432\u0430\u0447 \u0432\u0438\u043C\u043A\u043D\u0435\u043D\u043E","element.drawing":"{state} \xB7 \u0441\u043F\u043E\u0436\u0438\u0432\u0430\u0454 {watts} W","keep_hot.until":"\u0422\u0440\u0438\u043C\u0430\u0454 \u0433\u0430\u0440\u044F\u0447\u043E\u044E \u0434\u043E {time}","keep_hot.title":"\u0422\u0440\u0438\u043C\u0430\u0442\u0438 \u0433\u0430\u0440\u044F\u0447\u043E\u044E, \u043A\u043E\u043B\u0438 \u0433\u043E\u0442\u043E\u0432\u0430","keep_hot.hint":"\u041F\u0456\u0441\u043B\u044F \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F \xAB\u0433\u043E\u0442\u043E\u0432\u043E\xBB \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447 \u0442\u0440\u0438\u043C\u0430\u0454 \u0432\u043E\u0434\u0443 \u0433\u0430\u0440\u044F\u0447\u043E\u044E \u0441\u0442\u0456\u043B\u044C\u043A\u0438 \u0447\u0430\u0441\u0443, \u0430 \u043F\u043E\u0442\u0456\u043C \u0432\u0438\u043C\u0438\u043A\u0430\u0454\u0442\u044C\u0441\u044F.","keep_hot.more":"\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044C, \u044F\u043A \u0434\u043E\u0432\u0433\u043E \u0442\u0440\u0438\u043C\u0430\u0442\u0438 \u0433\u0430\u0440\u044F\u0447\u043E\u044E","keep_hot.cancel":"\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438","keep_hot.minutes":"{n} \u0445\u0432","keep_hot.hours":"{n} \u0433\u043E\u0434","heat_now_target.title":"\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430","heat_now_target.hint":"\u041B\u0438\u0448\u0435 \u0434\u043B\u044F \u0446\u044C\u043E\u0433\u043E \u0437\u0430\u043F\u0438\u0442\u0443; \u0431\u043E\u0439\u043B\u0435\u0440 \u043B\u0438\u0448\u0430\u0454\u0442\u044C\u0441\u044F \u043D\u0430 {target} \xB0C.","heat_now_target.down":"\u041D\u0430 1 \xB0C \u043C\u0435\u043D\u0448\u0435","heat_now_target.up":"\u041D\u0430 1 \xB0C \u0431\u0456\u043B\u044C\u0448\u0435",manual:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u0435 \u043A\u0435\u0440\u0443\u0432\u0430\u043D\u043D\u044F \u0432\u0438\u043C\u043A\u043D\u0435\u043D\u0435: \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447\u0435\u043C \u043A\u0435\u0440\u0443\u044E\u0442\u044C \u0432\u0440\u0443\u0447\u043D\u0443.","note.not_rising_skipped":"\u0422\u0435\u0440\u043C\u043E\u0441\u0442\u0430\u0442 \u043D\u0435 \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u044F\u0454, \u043A\u043E\u043B\u0438 \u0433\u0440\u0456\u0454, \u0442\u043E\u043C\u0443 \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u043A\u0438 \xAB\u0432\u043E\u0434\u0430 \u043D\u0435 \u0441\u0442\u0430\u0454 \u0433\u0430\u0440\u044F\u0447\u0456\u0448\u043E\u044E\xBB \u0456 \xAB\u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447 \u043D\u0435 \u0441\u043F\u043E\u0436\u0438\u0432\u0430\u0454 \u0435\u043D\u0435\u0440\u0433\u0456\u0457\xBB \u043D\u0435 \u0432\u0438\u043A\u043E\u043D\u0443\u044E\u0442\u044C\u0441\u044F.","heat_now.start":"\u041D\u0430\u0433\u0440\u0456\u0442\u0438 \u0437\u0430\u0440\u0430\u0437","heat_now.cancel":"\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438","heat_now.join":"\u0421\u043F\u043E\u0432\u0456\u0441\u0442\u0438\u0442\u0438 \u043C\u0435\u043D\u0435, \u043A\u043E\u043B\u0438 \u0431\u0443\u0434\u0435 \u0433\u0430\u0440\u044F\u0447\u0430","heat_now.leave":"\u041D\u0435 \u0441\u043F\u043E\u0432\u0456\u0449\u0430\u0442\u0438 \u043C\u0435\u043D\u0435","subline.for":"\u0414\u043B\u044F: {list}.","item.at":"{name} \u043E {time}","switch_off.link":"\u0412\u0438\u043C\u043A\u043D\u0443\u0442\u0438 \u043D\u0430\u0433\u0440\u0456\u0432\u2026","switch_off.title":"\u0412\u0438\u043C\u043A\u043D\u0443\u0442\u0438 \u043D\u0430\u0433\u0440\u0456\u0432?","switch_off.confirm":"\u0412\u0438\u043C\u043A\u043D\u0443\u0442\u0438","switch_off.keep":"\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438","switch_off.asked_one":"\u0411\u0456\u043B\u044C\u0448\u0435 \u043D\u0435 \u043E\u0442\u0440\u0438\u043C\u0430\u0454 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F: {names}.","switch_off.asked_many":"\u0411\u0456\u043B\u044C\u0448\u0435 \u043D\u0435 \u043E\u0442\u0440\u0438\u043C\u0430\u044E\u0442\u044C \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F: {names}.","switch_off.skipped_one":"\u0411\u0435\u0437 \u0433\u0430\u0440\u044F\u0447\u043E\u0457 \u0432\u043E\u0434\u0438: {list}.","switch_off.skipped_many":"\u0411\u0435\u0437 \u0433\u0430\u0440\u044F\u0447\u043E\u0457 \u0432\u043E\u0434\u0438: {list}.","switch_off.back":"\u0412\u0456\u043D \u0441\u0430\u043C \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u0442\u044C\u0441\u044F \u0434\u043E \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u0433\u043E \u0447\u0430\u0441\u0443 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0456.","switch_off.nobody":"\u041D\u0430\u0433\u0440\u0456\u0432 \u0437\u0443\u043F\u0438\u043D\u044F\u0454\u0442\u044C\u0441\u044F \u0437\u0430\u0440\u0430\u0437.","settings.switch_off":"\u0425\u0442\u043E \u043C\u043E\u0436\u0435 \u0432\u0438\u043C\u043A\u043D\u0443\u0442\u0438 \u043D\u0430\u0433\u0440\u0456\u0432 \u0434\u043B\u044F \u0432\u0441\u0456\u0445","settings.switch_off_hint":"\u0410\u0434\u043C\u0456\u043D\u0456\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0438 \u0442\u0430:","settings.own_cancel":"\u0425\u0442\u043E \u043F\u043E\u043F\u0440\u043E\u0441\u0438\u0432, \u0437\u0430\u0432\u0436\u0434\u0438 \u043C\u043E\u0436\u0435 \u0441\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438 \u0441\u0432\u0456\u0439 \u0437\u0430\u043F\u0438\u0442.",greeting:"\u041F\u0440\u0438\u0432\u0456\u0442, {name}","today.label":"\u0414\u0456\u043C \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456","today.nobody":"\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456 \u043D\u0456\u043A\u043E\u0433\u043E","away.until_label":"\u0414\u043E (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)","away.line":"\u0412\u0456\u0434\u0441\u0443\u0442\u043D\u0456\u0439","away.line_until":"\u0412\u0456\u0434\u0441\u0443\u0442\u043D\u0456\u0439 \u0434\u043E {date}","members.add":"\u0423\u0447\u0430\u0441\u043D\u0438\u043A","card.no_heater":"\u0412\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447 Hot Water Ready \u0449\u0435 \u043D\u0435 \u043D\u0430\u043B\u0430\u0448\u0442\u043E\u0432\u0430\u043D\u043E.","card.loading":"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F\u2026","card.error":"\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F: {message}","cluster.warning":"\u0414\u043B\u044F \u0434\u0443\u0448\u0456\u0432 \u0432\u0456\u0434 {when} \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0430 \u0432\u043E\u0434\u0430 {needed} \xB0C, \u0430\u043B\u0435 \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447 \u0433\u0440\u0456\u0454 \u043B\u0438\u0448\u0435 \u0434\u043E {cap} \xB0C: \u043E\u0441\u0442\u0430\u043D\u043D\u0456 \u043C\u043E\u0436\u0443\u0442\u044C \u0431\u0443\u0442\u0438 \u043F\u0440\u043E\u0445\u043E\u043B\u043E\u0434\u043D\u0456\u0448\u0438\u043C\u0438.","tabs.people":"\u041B\u044E\u0434\u0438","tabs.week":"\u0422\u0438\u0436\u0434\u0435\u043D\u044C","week.days":"\u041F\u043D,\u0412\u0442,\u0421\u0440,\u0427\u0442,\u041F\u0442,\u0421\u0431,\u041D\u0434","week.showers":"\u0434\u0443\u0448\u0456","week.windows":"\u0432\u0456\u043A\u043D\u0430 \u043D\u0430\u0433\u0440\u0456\u0432\u0443","week.busiest":"\u043D\u0430\u0439\u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u0456\u0448\u0438\u0439 \u0434\u0435\u043D\u044C","week.heating":"\u041D\u0430\u0433\u0440\u0456\u0432","week.away":"\u0432\u0456\u0434\u0441\u0443\u0442\u043D\u0456\u0439","week.virtual":"\u0432\u0456\u0440\u0442\u0443\u0430\u043B\u044C\u043D\u0438\u0439 \xB7 {count}","week.per_week":"{count} \u043D\u0430 \u0442\u0438\u0436\u0434\u0435\u043D\u044C","week.hint":"\u0422\u043E\u0440\u043A\u043D\u0456\u0442\u044C\u0441\u044F \u043B\u044E\u0434\u0438\u043D\u0438, \u0449\u043E\u0431 \u0432\u0438\u0434\u0456\u043B\u0438\u0442\u0438 \u0457\u0457 \u0447\u0430\u0441. \u0421\u043C\u0443\u0433\u0438 \u043F\u043E\u043A\u0430\u0437\u0443\u044E\u0442\u044C, \u043A\u043E\u043B\u0438 \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447 \u043C\u043E\u0436\u0435 \u0433\u0440\u0456\u0442\u0438 \u0449\u043E\u0434\u043D\u044F (\u0437 {start} \u0434\u043E {end}).","settings.open":"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447\u0430","settings.close":"\u0417\u0430\u043A\u0440\u0438\u0442\u0438","settings.target":"\u0426\u0456\u043B\u044C\u043E\u0432\u0430 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430","settings.target_hint":"\u0413\u043E\u0442\u043E\u0432\u043E, \u043A\u043E\u043B\u0438 \u0432\u043E\u0434\u0430 \u0434\u043E\u0441\u044F\u0433\u043D\u0435 \u0446\u0456\u0454\u0457 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0438","settings.target_down":"\u0417\u043D\u0438\u0437\u0438\u0442\u0438 \u0446\u0456\u043B\u044C\u043E\u0432\u0443 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0443","settings.target_up":"\u041F\u0456\u0434\u0432\u0438\u0449\u0438\u0442\u0438 \u0446\u0456\u043B\u044C\u043E\u0432\u0443 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0443","settings.margin":"\u0417\u0430\u043F\u0430\u0441","settings.band":"\u0412\u0438\u043C\u0438\u043A\u0430\u0454\u0442\u044C\u0441\u044F \u043F\u0440\u0438 {stop} \xB0C, \u0437\u043D\u043E\u0432\u0443 \u0432\u043C\u0438\u043A\u0430\u0454\u0442\u044C\u0441\u044F \u043F\u0440\u0438 {restart} \xB0C","settings.margin_down":"\u0417\u043C\u0435\u043D\u0448\u0438\u0442\u0438 \u0437\u0430\u043F\u0430\u0441","settings.margin_up":"\u0417\u0431\u0456\u043B\u044C\u0448\u0438\u0442\u0438 \u0437\u0430\u043F\u0430\u0441","settings.automatic":"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u0435 \u043A\u0435\u0440\u0443\u0432\u0430\u043D\u043D\u044F","settings.automatic_hint":"\u0412\u0438\u043C\u043A\u043D\u0435\u043D\u043E: \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447\u0435\u043C \u043A\u0435\u0440\u0443\u044E\u0442\u044C \u0432\u0440\u0443\u0447\u043D\u0443","settings.more":"\u0406\u043D\u0448\u0456 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F","rate.title":"\u0428\u0432\u0438\u0434\u043A\u0456\u0441\u0442\u044C \u043D\u0430\u0433\u0440\u0456\u0432\u0443","rate.unit":"\u0445\u0432 \u043D\u0430 \xB0C","rate.automatic":"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E","rate.fixed":"\u0424\u0456\u043A\u0441\u043E\u0432\u0430\u043D\u043E","rate.learned":"\u0412\u0438\u0432\u0447\u0435\u043D\u043E: \u043C\u0435\u0434\u0456\u0430\u043D\u0430 \u0447\u0438\u0441\u0442\u0438\u0445 \u043D\u0430\u0433\u0440\u0456\u0432\u0456\u0432 \u0437\u0430 \u043E\u0441\u0442\u0430\u043D\u043D\u0456 {days} \u0434\u043D. (\u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C: {count})","rate.default_one":"\u041F\u043E\u0447\u0430\u0442\u043A\u043E\u0432\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F: \u0449\u0435 1 \u0447\u0438\u0441\u0442\u0438\u0439 \u043D\u0430\u0433\u0440\u0456\u0432 \u0437\u0430 \u043E\u0441\u0442\u0430\u043D\u043D\u0456 {days} \u0434\u043D., \u0456 \u0439\u043E\u0433\u043E \u0431\u0443\u0434\u0435 \u0432\u0438\u0432\u0447\u0435\u043D\u043E","rate.default_many":"\u041F\u043E\u0447\u0430\u0442\u043A\u043E\u0432\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F: \u0431\u0440\u0430\u043A\u0443\u0454 \u0447\u0438\u0441\u0442\u0438\u0445 \u043D\u0430\u0433\u0440\u0456\u0432\u0456\u0432 \u0437\u0430 \u043E\u0441\u0442\u0430\u043D\u043D\u0456 {days} \u0434\u043D. (\u0449\u0435 {count}), \u0442\u043E\u0434\u0456 \u0439\u043E\u0433\u043E \u0431\u0443\u0434\u0435 \u0432\u0438\u0432\u0447\u0435\u043D\u043E","rate.manual":"\u0417\u0430\u0434\u0430\u043D\u043E \u0432\u0440\u0443\u0447\u043D\u0443: \u043D\u0430\u0432\u0447\u0430\u043D\u043D\u044F \u0442\u0440\u0438\u0432\u0430\u0454, \u0430\u043B\u0435 \u043D\u0435 \u0432\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0454\u0442\u044C\u0441\u044F","rate.runs":"\u0427\u0438\u0441\u0442\u0456 \u043D\u0430\u0433\u0440\u0456\u0432\u0438, \u043D\u0430 \u044F\u043A\u0438\u0445 \u0432\u043E\u043D\u043E \u0491\u0440\u0443\u043D\u0442\u0443\u0454\u0442\u044C\u0441\u044F","rate.example":"\u0417\u0430\u0440\u0430\u0437 {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} \u0445\u0432, \u043F\u043B\u044E\u0441 {margin} \u0445\u0432 \u0437\u0430\u043F\u0430\u0441\u0443: \u043F\u043E\u0447\u0430\u0442\u043E\u043A \u0437\u0430 {lead} \u0445\u0432","rate.example_cap":" (\u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C)","rate.example_warm":"\u0417\u0430\u0440\u0430\u0437 {from} \xB0C: \u0446\u0456\u043B\u044C\u043E\u0432\u0443 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0443 \u0432\u0436\u0435 \u0434\u043E\u0441\u044F\u0433\u043D\u0443\u0442\u043E, \u043F\u043E\u0447\u0438\u043D\u0430\u0442\u0438 \u0440\u0430\u043D\u0456\u0448\u0435 \u043D\u0435 \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u043E","rate.physics":"\u0417\u0430 \u0444\u0456\u0437\u0438\u043A\u043E\u044E, \u0432\u0435\u0441\u044C \u0431\u0430\u043A, \u043D\u0430\u0433\u0440\u0456\u0442\u0438\u0439 \u0435\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u043C: {rate} \u0445\u0432/\xB0C","rate.physics_range":"\u0417\u0430 \u0444\u0456\u0437\u0438\u043A\u043E\u044E: \u0432\u0456\u0434 {fast} \u0445\u0432/\xB0C (\u043B\u0438\u0448\u0435 \u0432\u043E\u0434\u0430 \u043D\u0430\u0434 \u0435\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u043C) \u0434\u043E {slow} \u0445\u0432/\xB0C (\u0432\u0435\u0441\u044C \u0431\u0430\u043A)","rate.volume":"\u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0454 \u043D\u0430\u0433\u0440\u0456\u0432\u0443 {litres} L \u0437 {tank} L \u0431\u0430\u043A\u0430","rate.far_below":": \u043D\u0430 {percent}% \u043D\u0438\u0436\u0447\u0435 \u0437\u0430 \u0444\u0456\u0437\u0438\u043A\u0443. \u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043E\u0431'\u0454\u043C \u0431\u0430\u043A\u0430, \u043F\u043E\u0442\u0443\u0436\u043D\u0456\u0441\u0442\u044C \u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u0456 \u0434\u0435 \u0440\u043E\u0437\u0442\u0430\u0448\u043E\u0432\u0430\u043D\u0438\u0439 \u0434\u0430\u0442\u0447\u0438\u043A.","rate.far_above":": \u043D\u0430 {percent}% \u0432\u0438\u0449\u0435 \u0437\u0430 \u0444\u0456\u0437\u0438\u043A\u0443. \u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043E\u0431'\u0454\u043C \u0431\u0430\u043A\u0430, \u043F\u043E\u0442\u0443\u0436\u043D\u0456\u0441\u0442\u044C \u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u0456 \u0434\u0435 \u0440\u043E\u0437\u0442\u0430\u0448\u043E\u0432\u0430\u043D\u0438\u0439 \u0434\u0430\u0442\u0447\u0438\u043A.","rate.suggested_learned":"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u043E\u0432\u0430\u043D\u043E: {rate} (\u0432\u0438\u0432\u0447\u0435\u043D\u043E)","rate.suggested_physics":"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u043E\u0432\u0430\u043D\u043E: {rate} (\u0444\u0456\u0437\u0438\u043A\u0430 \u0431\u0430\u043A\u0430)","rate.suggested_default":"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u043E\u0432\u0430\u043D\u043E: {rate} (\u043F\u043E\u0447\u0430\u0442\u043A\u043E\u0432\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F)","rate.use":"\u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u0430\u0442\u0438","rate.down":"\u041D\u0430 0,1 \u0445\u0432 \u043D\u0430 \xB0C \u043C\u0435\u043D\u0448\u0435","rate.up":"\u041D\u0430 0,1 \u0445\u0432 \u043D\u0430 \xB0C \u0431\u0456\u043B\u044C\u0448\u0435","rate.recalculate":"\u041F\u0435\u0440\u0435\u0440\u0430\u0445\u0443\u0432\u0430\u0442\u0438 \u0437 \u0456\u0441\u0442\u043E\u0440\u0456\u0457","rate.recalculating":"\u041F\u0435\u0440\u0435\u0433\u043B\u044F\u0434\u0430\u0454\u043C\u043E \u043E\u0441\u0442\u0430\u043D\u043D\u0456\u0439 \u0442\u0438\u0436\u0434\u0435\u043D\u044C\u2026","rate.found":"\u0427\u0438\u0441\u0442\u0438\u0445 \u043D\u0430\u0433\u0440\u0456\u0432\u0456\u0432 \u0432 \u0456\u0441\u0442\u043E\u0440\u0456\u0457: {count}; \u0432\u0438\u0432\u0447\u0435\u043D\u043E {rate} \u0445\u0432/\xB0C.","rate.found_too_few":"\u0427\u0438\u0441\u0442\u0438\u0445 \u043D\u0430\u0433\u0440\u0456\u0432\u0456\u0432 \u0432 \u0456\u0441\u0442\u043E\u0440\u0456\u0457: {count}; \u0434\u043B\u044F \u043D\u0430\u0432\u0447\u0430\u043D\u043D\u044F \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u043E: {needed}.","solar.title":"\u041F\u043E\u0440\u0456\u0432\u043D\u044F\u043D\u043D\u044F \u0456\u0437 \u0441\u043E\u043D\u0446\u0435\u043C","solar.none":"\u0417\u0430 \u043E\u0441\u0442\u0430\u043D\u043D\u0456 30 \u0434\u043D\u0456\u0432 \u0449\u0435 \u043D\u0435 \u0437\u0430\u043F\u0438\u0441\u0430\u043D\u043E \u0436\u043E\u0434\u043D\u043E\u0433\u043E \u0432\u0456\u043A\u043D\u0430.","solar.would":"\u0417 \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u0438\u043C \u043F\u0440\u0430\u0432\u0438\u043B\u043E\u043C \u0437 \u0443\u0440\u0430\u0445\u0443\u0432\u0430\u043D\u043D\u044F\u043C \u0441\u043E\u043D\u0446\u044F \u0432\u043E\u0434\u0430 \u0431\u0443\u043B\u0430 \u0431 \u0433\u043E\u0442\u043E\u0432\u0430 \u0432\u0447\u0430\u0441\u043D\u043E \u0443 {on_time} \u0437 {windows} \u0432\u0456\u043A\u043E\u043D","solar.did":"\u0417 \u043F\u0440\u0430\u0432\u0438\u043B\u043E\u043C \u0437 \u0443\u0440\u0430\u0445\u0443\u0432\u0430\u043D\u043D\u044F\u043C \u0441\u043E\u043D\u0446\u044F \u0432\u043E\u0434\u0430 \u0431\u0443\u043B\u0430 \u0433\u043E\u0442\u043E\u0432\u0430 \u0432\u0447\u0430\u0441\u043D\u043E \u0443 {on_time} \u0437 {windows} \u0432\u0456\u043A\u043E\u043D","solar.would_less":", \u0430 \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447 \u043F\u0440\u0430\u0446\u044E\u0432\u0430\u0432 \u0431\u0438 \u043D\u0430 {minutes} \u0445\u0432 \u043C\u0435\u043D\u0448\u0435","solar.would_more":", \u0430 \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447 \u043F\u0440\u0430\u0446\u044E\u0432\u0430\u0432 \u0431\u0438 \u043D\u0430 {minutes} \u0445\u0432 \u0431\u0456\u043B\u044C\u0448\u0435","solar.did_less":", \u0430 \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447 \u043F\u0440\u0430\u0446\u044E\u0432\u0430\u0432 \u043D\u0430 {minutes} \u0445\u0432 \u043C\u0435\u043D\u0448\u0435","solar.did_more":", \u0430 \u0432\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447 \u043F\u0440\u0430\u0446\u044E\u0432\u0430\u0432 \u043D\u0430 {minutes} \u0445\u0432 \u0431\u0456\u043B\u044C\u0448\u0435","solar.kwh":", \u043F\u0440\u0438\u0431\u043B\u0438\u0437\u043D\u043E {kwh} kWh","solar.applied":" \u041F\u0440\u0430\u0432\u0438\u043B\u043E \u0437\u0430\u0441\u0442\u043E\u0441\u043E\u0432\u0430\u043D\u043E \u0443 {applied} \u0437 \u043D\u0438\u0445: \u0432\u0447\u0430\u0441\u043D\u043E \u0443 {on_time}.","subline.starts_at":"\u041F\u043E\u0447\u043D\u0435 \u0433\u0440\u0456\u0442\u0438 \u043F\u0440\u0438\u0431\u043B\u0438\u0437\u043D\u043E: {when}.","subline.starts_at_solar":"\u041F\u043E\u0447\u043D\u0435 \u0433\u0440\u0456\u0442\u0438 \u043F\u0440\u0438\u0431\u043B\u0438\u0437\u043D\u043E: {when}, \u044F\u043A\u0449\u043E \u0441\u043E\u043D\u0446\u0435 \u043D\u0435 \u0437\u0440\u043E\u0431\u0438\u0442\u044C \u0446\u044C\u043E\u0433\u043E \u0440\u0430\u043D\u0456\u0448\u0435.","subline.asked_by_one":"\u0417\u0430\u043F\u0438\u0442 \u0432\u0456\u0434: {name}. \u041E\u0442\u0440\u0438\u043C\u0430\u0454 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F, \u043A\u043E\u043B\u0438 \u0432\u043E\u0434\u0430 \u0431\u0443\u0434\u0435 \u0433\u043E\u0442\u043E\u0432\u0430.","subline.asked_by_many":"\u0417\u0430\u043F\u0438\u0442 \u0432\u0456\u0434: {names}. \u041A\u043E\u0436\u0435\u043D \u043E\u0442\u0440\u0438\u043C\u0430\u0454 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F, \u043A\u043E\u043B\u0438 \u0432\u043E\u0434\u0430 \u0431\u0443\u0434\u0435 \u0433\u043E\u0442\u043E\u0432\u0430.","names.and":" \u0456 ","today.you":"\u0412\u0438","list.mine":"\u041C\u043E\u0457 \u0447\u0430\u0441\u0438 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0456","list.count_one":"1 \u0447\u0430\u0441 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0456","list.count":"\u0427\u0430\u0441\u0438 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0456: {count}","list.virtual":"\u0412\u0456\u0440\u0442\u0443\u0430\u043B\u044C\u043D\u0438\u0439 \u0443\u0447\u0430\u0441\u043D\u0438\u043A \xB7 \u0441\u043F\u0456\u043B\u044C\u043D\u0456 \u0447\u0430\u0441\u0438 \u0434\u043E\u043C\u0443","away.paused":"\u041F\u0440\u0438\u0437\u0443\u043F\u0438\u043D\u0435\u043D\u043E. \u0427\u0430\u0441 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E.","member_settings.open":"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0447\u0430\u0441\u0456\u0432 \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0456","visibility.private":"\u041F\u0440\u0438\u0432\u0430\u0442\u043D\u0435","visibility.hint_own":"\u0406\u043D\u0448\u0456 \u0443\u0447\u0430\u0441\u043D\u0438\u043A\u0438 \u043D\u0435 \u0431\u0430\u0447\u0430\u0442\u044C \u0446\u0456 \u0447\u0430\u0441\u0438 \u0442\u0430 \u0432\u0430\u0448\u0456 \u0437\u0430\u043F\u0438\u0442\u0438 \xAB\u041D\u0430\u0433\u0440\u0456\u0442\u0438 \u0437\u0430\u0440\u0430\u0437\xBB; \u0430\u0434\u043C\u0456\u043D\u0456\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0438 \u0431\u0430\u0447\u0430\u0442\u044C.","visibility.hint_virtual":"\u0426\u0456 \u0447\u0430\u0441\u0438 \u0431\u0430\u0447\u0430\u0442\u044C \u043B\u0438\u0448\u0435 \u0430\u0434\u043C\u0456\u043D\u0456\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0438.","settings.no_people":"\u0423 Home Assistant \u0449\u0435 \u043D\u0435\u043C\u0430\u0454 \u043B\u044E\u0434\u0435\u0439, \u044F\u043A\u0438\u0445 \u043C\u043E\u0436\u043D\u0430 \u0432\u0438\u0431\u0440\u0430\u0442\u0438.","editor.heater":"\u0412\u043E\u0434\u043E\u043D\u0430\u0433\u0440\u0456\u0432\u0430\u0447","editor.compact":"\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u043E: \u043B\u0438\u0448\u0435 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430 \u0439 \u0441\u0442\u0430\u043D, \u0431\u0435\u0437 \u043A\u0435\u0440\u0443\u0432\u0430\u043D\u043D\u044F","editor.tap_action":"\u0414\u0456\u044F \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043A\u0430\u043D\u043D\u0456"};var $t={"status.waiting":"\u7A7A\u95F2","status.heating":"\u52A0\u70ED\u4E2D","status.ready":"\u5DF2\u5C31\u7EEA","status.fault":"\u6545\u969C","status.manual":"\u624B\u52A8","headline.heating_for":"\u52A0\u70ED\u4E2D\uFF1A\u7EA6 {minutes} \u5206\u949F\u540E\u5C31\u7EEA","headline.ready_at":"{when} \u5C31\u7EEA","subline.next_at":"\u4E0B\u4E00\u6B21\uFF1A{when}","when.today":"{time}","when.tomorrow":"\u660E\u5929 {time}","when.weekday":"{weekday} {time}","ring.target":"\u76EE\u6807 {target}\xB0","weekday.letters":"\u4E00,\u4E8C,\u4E09,\u56DB,\u4E94,\u516D,\u65E5","members.none":"\u8FD8\u6CA1\u6709\u6210\u5458\u3002\u7BA1\u7406\u5458\u53EF\u5728\u96C6\u6210\u7684\u8BBE\u7F6E\u4E2D\u6DFB\u52A0\u3002","list.empty":"\u8FD8\u6CA1\u6709\u5C31\u7EEA\u65F6\u95F4\u3002","list.add":"\u6DFB\u52A0\u5C31\u7EEA\u65F6\u95F4","sheet.delete":"\u5220\u9664","list.switch":"\u5F00\u542F\u6216\u5173\u95ED","sheet.title":"\u65B0\u7684\u5C31\u7EEA\u65F6\u95F4","sheet.edit_title":"\u66F4\u6539\u5C31\u7EEA\u65F6\u95F4","list.edit":"\u66F4\u6539\u6B64\u5C31\u7EEA\u65F6\u95F4","sheet.time":"\u65F6\u95F4","sheet.hour":"\u65F6","sheet.minute":"\u5206","sheet.days":"\u661F\u671F","sheet.save":"\u4FDD\u5B58","sheet.cancel":"\u53D6\u6D88","clock.title":"\u9009\u62E9\u65F6\u95F4","clock.title_keys":"\u8F93\u5165\u65F6\u95F4","clock.ok":"\u786E\u5B9A","clock.to_keys":"\u8F93\u5165\u65F6\u95F4","clock.to_dial":"\u4F7F\u7528\u8868\u76D8","clock.am":"\u4E0A\u5348","clock.pm":"\u4E0B\u5348","clock.invalid":"\u8BF7\u8F93\u5165\u6709\u6548\u7684\u65F6\u95F4","clock.change":"\u66F4\u6539\u65F6\u95F4","fault.sensor_unavailable":"\u6545\u969C\uFF1A\u6C34\u6E29\u4F20\u611F\u5668\u6CA1\u6709\u8BFB\u6570\u3002\u52A0\u70ED\u5DF2\u505C\u6B62\u3002","fault.not_rising":"\u6545\u969C\uFF1A\u6C34\u6E29\u6CA1\u6709\u5347\u9AD8\u3002\u52A0\u70ED\u5DF2\u505C\u6B62\uFF1B\u8BF7\u67E5\u770B\u201C\u4FEE\u590D\u201D\u3002","fault.no_consumption":"\u6545\u969C\uFF1A\u70ED\u6C34\u5668\u4E0D\u8017\u7535\u3002\u52A0\u70ED\u5DF2\u505C\u6B62\uFF1B\u8BF7\u67E5\u770B\u201C\u4FEE\u590D\u201D\u3002","fault.relay_stuck":"\u6545\u969C\uFF1A\u70ED\u6C34\u5668\u5728\u5173\u95ED\u65F6\u4ECD\u5728\u8017\u7535\u3002\u8BF7\u68C0\u67E5\u7EE7\u7535\u5668\u3002","fault.top_probe":"\u8B66\u544A\uFF1A\u4E3B\u63A2\u5934\u53EF\u80FD\u677E\u52A8\u3002\u52A0\u70ED\u7EE7\u7EED\u8FDB\u884C\uFF1B\u8BF7\u67E5\u770B\u201C\u4FEE\u590D\u201D\u3002","fault.middle_probe":"\u8B66\u544A\uFF1A\u7B2C\u4E8C\u4E2A\u63A2\u5934\u53EF\u80FD\u677E\u52A8\u3002\u52A0\u70ED\u7EE7\u7EED\u8FDB\u884C\uFF1B\u8BF7\u67E5\u770B\u201C\u4FEE\u590D\u201D\u3002","fault.probes_disagree":"\u8B66\u544A\uFF1A\u4E24\u4E2A\u63A2\u5934\u8BFB\u6570\u4E0D\u4E00\u81F4\u3002\u52A0\u70ED\u7EE7\u7EED\u8FDB\u884C\uFF1B\u8BF7\u67E5\u770B\u201C\u4FEE\u590D\u201D\u3002","element.on":"\u52A0\u70ED\u7BA1\u5DF2\u5F00\u542F","element.off":"\u52A0\u70ED\u7BA1\u5DF2\u5173\u95ED","element.drawing":"{state} \xB7 \u529F\u7387 {watts} W","keep_hot.until":"\u4FDD\u6E29\u81F3 {time}","keep_hot.title":"\u5C31\u7EEA\u540E\u4FDD\u6E29","keep_hot.hint":"\u53D1\u51FA\u201C\u5C31\u7EEA\u201D\u6D88\u606F\u540E\uFF0C\u70ED\u6C34\u5668\u4F1A\u4FDD\u6E29\u8FD9\u4E48\u957F\u65F6\u95F4\uFF0C\u7136\u540E\u5173\u95ED\u3002","keep_hot.more":"\u9009\u62E9\u4FDD\u6E29\u65F6\u957F","keep_hot.cancel":"\u53D6\u6D88","keep_hot.minutes":"{n} \u5206\u949F","keep_hot.hours":"{n} \u5C0F\u65F6","heat_now_target.title":"\u6E29\u5EA6","heat_now_target.hint":"\u4EC5\u9650\u672C\u6B21\u8BF7\u6C42\uFF1B\u70ED\u6C34\u5668\u4ECD\u4E3A {target} \xB0C\u3002","heat_now_target.down":"\u964D\u4F4E 1 \xB0C","heat_now_target.up":"\u63D0\u9AD8 1 \xB0C",manual:"\u81EA\u52A8\u63A7\u5236\u5DF2\u5173\u95ED\uFF1A\u70ED\u6C34\u5668\u7531\u624B\u52A8\u63A7\u5236\u3002","note.not_rising_skipped":"\u6B64\u6E29\u63A7\u5668\u4E0D\u4F1A\u62A5\u544A\u4F55\u65F6\u5728\u52A0\u70ED\uFF0C\u56E0\u6B64\u4E0D\u8FDB\u884C\u201C\u6C34\u6E29\u6CA1\u6709\u5347\u9AD8\u201D\u548C\u201C\u70ED\u6C34\u5668\u4E0D\u8017\u7535\u201D\u7684\u68C0\u67E5\u3002","heat_now.start":"\u7ACB\u5373\u52A0\u70ED","heat_now.cancel":"\u53D6\u6D88","heat_now.join":"\u70ED\u4E86\u901A\u77E5\u6211","heat_now.leave":"\u4E0D\u7528\u901A\u77E5\u6211","subline.for":"\u5BF9\u8C61\uFF1A{list}\u3002","item.at":"{name} {time}","switch_off.link":"\u5173\u95ED\u52A0\u70ED\u2026","switch_off.title":"\u5173\u95ED\u52A0\u70ED\uFF1F","switch_off.confirm":"\u5173\u95ED","switch_off.keep":"\u53D6\u6D88","switch_off.asked_one":"{names} \u5C06\u4E0D\u518D\u6536\u5230\u901A\u77E5\u3002","switch_off.asked_many":"{names} \u5C06\u4E0D\u518D\u6536\u5230\u901A\u77E5\u3002","switch_off.skipped_one":"\u5C06\u6CA1\u6709\u70ED\u6C34\uFF1A{list}\u3002","switch_off.skipped_many":"\u5C06\u6CA1\u6709\u70ED\u6C34\uFF1A{list}\u3002","switch_off.back":"\u5230\u4E0B\u4E00\u4E2A\u5C31\u7EEA\u65F6\u95F4\u4F1A\u81EA\u52A8\u91CD\u65B0\u5F00\u542F\u3002","switch_off.nobody":"\u52A0\u70ED\u7ACB\u5373\u505C\u6B62\u3002","settings.switch_off":"\u53EF\u4EE5\u4E3A\u6240\u6709\u4EBA\u5173\u95ED\u52A0\u70ED\u7684\u4EBA","settings.switch_off_hint":"\u7BA1\u7406\u5458\u4EE5\u53CA\uFF1A","settings.own_cancel":"\u53D1\u8D77\u8BF7\u6C42\u7684\u4EBA\u59CB\u7EC8\u53EF\u4EE5\u53D6\u6D88\u81EA\u5DF1\u7684\u8BF7\u6C42\u3002",greeting:"\u4F60\u597D\uFF0C{name}","today.label":"\u4ECA\u5929\u5728\u5BB6","today.nobody":"\u4ECA\u5929\u6CA1\u6709\u4EBA","away.until_label":"\u76F4\u5230\uFF08\u53EF\u9009\uFF09","away.line":"\u5916\u51FA","away.line_until":"\u5916\u51FA\u81F3 {date}","members.add":"\u6210\u5458","card.no_heater":"\u5C1A\u672A\u8BBE\u7F6E\u4EFB\u4F55 Hot Water Ready \u70ED\u6C34\u5668\u3002","card.loading":"\u6B63\u5728\u52A0\u8F7D\u2026","card.error":"\u64CD\u4F5C\u672A\u6210\u529F\uFF1A{message}","cluster.warning":"\u4ECE {when} \u5F00\u59CB\u7684\u6DCB\u6D74\u9700\u8981 {needed} \xB0C \u7684\u6C34\uFF0C\u4F46\u70ED\u6C34\u5668\u6700\u9AD8\u53EA\u80FD\u52A0\u70ED\u5230 {cap} \xB0C\uFF1A\u6700\u540E\u51E0\u4F4D\u7684\u6C34\u53EF\u80FD\u4F1A\u51C9\u4E00\u4E9B\u3002","tabs.people":"\u4EBA\u5458","tabs.week":"\u4E00\u5468","week.days":"\u5468\u4E00,\u5468\u4E8C,\u5468\u4E09,\u5468\u56DB,\u5468\u4E94,\u5468\u516D,\u5468\u65E5","week.showers":"\u6DCB\u6D74\u6B21\u6570","week.windows":"\u52A0\u70ED\u65F6\u6BB5","week.busiest":"\u6700\u5FD9\u7684\u4E00\u5929","week.heating":"\u52A0\u70ED","week.away":"\u5916\u51FA","week.virtual":"\u865A\u62DF \xB7 {count}","week.per_week":"\u6BCF\u5468 {count} \u6B21","week.hint":"\u70B9\u6309\u67D0\u4EBA\u53EF\u7A81\u51FA\u663E\u793A\u5176\u65F6\u95F4\u3002\u6A2A\u6761\u8868\u793A\u70ED\u6C34\u5668\u6BCF\u5929\u53EF\u4EE5\u52A0\u70ED\u7684\u65F6\u95F4\uFF08{start} \u81F3 {end}\uFF09\u3002","settings.open":"\u70ED\u6C34\u5668\u8BBE\u7F6E","settings.close":"\u5173\u95ED","settings.target":"\u76EE\u6807\u6E29\u5EA6","settings.target_hint":"\u6C34\u6E29\u8FBE\u5230\u6B64\u503C\u5373\u5C31\u7EEA","settings.target_down":"\u964D\u4F4E\u76EE\u6807","settings.target_up":"\u63D0\u9AD8\u76EE\u6807","settings.margin":"\u4F59\u91CF","settings.band":"{stop} \xB0C \u65F6\u505C\u6B62\uFF0C{restart} \xB0C \u65F6\u91CD\u65B0\u5F00\u59CB","settings.margin_down":"\u51CF\u5C0F\u4F59\u91CF","settings.margin_up":"\u589E\u5927\u4F59\u91CF","settings.automatic":"\u81EA\u52A8\u63A7\u5236","settings.automatic_hint":"\u5173\u95ED\uFF1A\u70ED\u6C34\u5668\u7531\u624B\u52A8\u63A7\u5236","settings.more":"\u66F4\u591A\u8BBE\u7F6E","rate.title":"\u52A0\u70ED\u901F\u5EA6","rate.unit":"\u5206\u949F/\xB0C","rate.automatic":"\u81EA\u52A8","rate.fixed":"\u56FA\u5B9A","rate.learned":"\u5B66\u4E60\u503C\uFF1A\u6700\u8FD1 {days} \u5929\u5185 {count} \u6B21\u6B63\u5E38\u52A0\u70ED\u7684\u4E2D\u4F4D\u6570","rate.default_one":"\u521D\u59CB\u503C\uFF1A\u6700\u8FD1 {days} \u5929\u5185\u518D\u6709 1 \u6B21\u6B63\u5E38\u52A0\u70ED\u5373\u53EF\u5B66\u4E60","rate.default_many":"\u521D\u59CB\u503C\uFF1A\u6700\u8FD1 {days} \u5929\u5185\u518D\u6709 {count} \u6B21\u6B63\u5E38\u52A0\u70ED\u5373\u53EF\u5B66\u4E60","rate.manual":"\u624B\u52A8\u56FA\u5B9A\uFF1A\u5B66\u4E60\u4ECD\u5728\u8FDB\u884C\uFF0C\u4F46\u4E0D\u4F1A\u4F7F\u7528","rate.runs":"\u6240\u4F9D\u636E\u7684\u6B63\u5E38\u52A0\u70ED\u6B21\u6570","rate.example":"\u5F53\u524D {from} \xB0C \u2192 {to} \xB0C\uFF1A{degrees} \xB0C \xD7 {rate} = {minutes} \u5206\u949F\uFF0C\u52A0\u4E0A {margin} \u5206\u949F\u4F59\u91CF\uFF1A\u63D0\u524D {lead} \u5206\u949F\u5F00\u59CB","rate.example_cap":"\uFF08\u6700\u5927\u503C\uFF09","rate.example_warm":"\u5F53\u524D {from} \xB0C\uFF1A\u5DF2\u8FBE\u5230\u76EE\u6807\uFF0C\u65E0\u9700\u63D0\u524D\u5F00\u59CB","rate.physics":"\u6309\u7269\u7406\u8BA1\u7B97\uFF0C\u52A0\u70ED\u7BA1\u52A0\u70ED\u6574\u4E2A\u6C34\u7BB1\uFF1A{rate} \u5206\u949F/\xB0C","rate.physics_range":"\u6309\u7269\u7406\u8BA1\u7B97\uFF1A\u4ECB\u4E8E {fast} \u5206\u949F/\xB0C\uFF08\u4EC5\u52A0\u70ED\u7BA1\u4E0A\u65B9\u7684\u6C34\uFF09\u548C {slow} \u5206\u949F/\xB0C\uFF08\u6574\u4E2A\u6C34\u7BB1\uFF09\u4E4B\u95F4","rate.volume":"\u76F8\u5F53\u4E8E\u52A0\u70ED\u6C34\u7BB1 {tank} L \u4E2D\u7684 {litres} L","rate.far_below":"\uFF1A\u6BD4\u7269\u7406\u8BA1\u7B97\u4F4E {percent}%\u3002\u8BF7\u68C0\u67E5\u6C34\u7BB1\u5BB9\u91CF\u3001\u52A0\u70ED\u7BA1\u529F\u7387\u548C\u63A2\u5934\u4F4D\u7F6E\u3002","rate.far_above":"\uFF1A\u6BD4\u7269\u7406\u8BA1\u7B97\u9AD8 {percent}%\u3002\u8BF7\u68C0\u67E5\u6C34\u7BB1\u5BB9\u91CF\u3001\u52A0\u70ED\u7BA1\u529F\u7387\u548C\u63A2\u5934\u4F4D\u7F6E\u3002","rate.suggested_learned":"\u5EFA\u8BAE\uFF1A{rate}\uFF08\u5B66\u4E60\u503C\uFF09","rate.suggested_physics":"\u5EFA\u8BAE\uFF1A{rate}\uFF08\u6C34\u7BB1\u7269\u7406\u8BA1\u7B97\uFF09","rate.suggested_default":"\u5EFA\u8BAE\uFF1A{rate}\uFF08\u521D\u59CB\u503C\uFF09","rate.use":"\u4F7F\u7528","rate.down":"\u51CF\u5C11 0.1 \u5206\u949F/\xB0C","rate.up":"\u589E\u52A0 0.1 \u5206\u949F/\xB0C","rate.recalculate":"\u6839\u636E\u5386\u53F2\u8BB0\u5F55\u91CD\u65B0\u8BA1\u7B97","rate.recalculating":"\u6B63\u5728\u67E5\u770B\u8FC7\u53BB\u4E00\u5468\u2026","rate.found":"\u5728\u5386\u53F2\u8BB0\u5F55\u4E2D\u627E\u5230 {count} \u6B21\u6B63\u5E38\u52A0\u70ED\uFF1B\u5B66\u4E60\u7ED3\u679C\u4E3A {rate} \u5206\u949F/\xB0C\u3002","rate.found_too_few":"\u5728\u5386\u53F2\u8BB0\u5F55\u4E2D\u627E\u5230 {count} \u6B21\u6B63\u5E38\u52A0\u70ED\uFF1B\u9700\u8981 {needed} \u6B21\u624D\u80FD\u5B66\u4E60\u3002","solar.title":"\u592A\u9633\u80FD\u5BF9\u6BD4","solar.none":"\u6700\u8FD1 30 \u5929\u5185\u8FD8\u6CA1\u6709\u8BB0\u5F55\u5230\u52A0\u70ED\u65F6\u6BB5\u3002","solar.would":"\u5982\u679C\u5F00\u542F\u592A\u9633\u80FD\u89C4\u5219\uFF0C\u5728 {windows} \u4E2A\u65F6\u6BB5\u4E2D\u6709 {on_time} \u4E2A\u65F6\u6BB5\u70ED\u6C34\u4F1A\u6309\u65F6\u5C31\u7EEA","solar.did":"\u4F7F\u7528\u592A\u9633\u80FD\u89C4\u5219\u540E\uFF0C\u5728 {windows} \u4E2A\u65F6\u6BB5\u4E2D\u6709 {on_time} \u4E2A\u65F6\u6BB5\u70ED\u6C34\u6309\u65F6\u5C31\u7EEA","solar.would_less":"\uFF0C\u70ED\u6C34\u5668\u7684\u8FD0\u884C\u65F6\u95F4\u4F1A\u5C11 {minutes} \u5206\u949F","solar.would_more":"\uFF0C\u70ED\u6C34\u5668\u7684\u8FD0\u884C\u65F6\u95F4\u4F1A\u591A {minutes} \u5206\u949F","solar.did_less":"\uFF0C\u70ED\u6C34\u5668\u7684\u8FD0\u884C\u65F6\u95F4\u5C11\u4E86 {minutes} \u5206\u949F","solar.did_more":"\uFF0C\u70ED\u6C34\u5668\u7684\u8FD0\u884C\u65F6\u95F4\u591A\u4E86 {minutes} \u5206\u949F","solar.kwh":"\uFF0C\u7EA6 {kwh} kWh","solar.applied":"\u5176\u4E2D {applied} \u4E2A\u65F6\u6BB5\u5E94\u7528\u4E86\u8BE5\u89C4\u5219\uFF1A{on_time} \u4E2A\u6309\u65F6\u3002","subline.starts_at":"\u5927\u7EA6\u5728 {when} \u5F00\u59CB\u52A0\u70ED\u3002","subline.starts_at_solar":"\u5982\u679C\u5C4A\u65F6\u592A\u9633\u8FD8\u6CA1\u628A\u6C34\u52A0\u70ED\uFF0C\u5927\u7EA6\u5728 {when} \u5F00\u59CB\u52A0\u70ED\u3002","subline.asked_by_one":"\u7531 {name} \u8BF7\u6C42\u3002\u5C31\u7EEA\u65F6\u4F1A\u901A\u77E5\u3002","subline.asked_by_many":"\u7531 {names} \u8BF7\u6C42\u3002\u5C31\u7EEA\u65F6\u4F1A\u5206\u522B\u901A\u77E5\u6BCF\u4E2A\u4EBA\u3002","names.and":"\u548C","today.you":"\u4F60","list.mine":"\u6211\u7684\u5C31\u7EEA\u65F6\u95F4","list.count_one":"1 \u4E2A\u5C31\u7EEA\u65F6\u95F4","list.count":"{count} \u4E2A\u5C31\u7EEA\u65F6\u95F4","list.virtual":"\u865A\u62DF\u6210\u5458 \xB7 \u5BB6\u5EAD\u5171\u4EAB\u65F6\u95F4","away.paused":"\u5DF2\u6682\u505C\u3002\u65F6\u95F4\u4F1A\u4FDD\u7559\u3002","member_settings.open":"\u5C31\u7EEA\u65F6\u95F4\u8BBE\u7F6E","visibility.private":"\u79C1\u5BC6","visibility.hint_own":"\u5176\u4ED6\u6210\u5458\u770B\u4E0D\u5230\u8FD9\u4E9B\u65F6\u95F4\u548C\u4F60\u7684\u201C\u7ACB\u5373\u52A0\u70ED\u201D\u8BF7\u6C42\uFF1B\u7BA1\u7406\u5458\u53EF\u4EE5\u770B\u5230\u3002","visibility.hint_virtual":"\u53EA\u6709\u7BA1\u7406\u5458\u80FD\u770B\u5230\u8FD9\u4E9B\u65F6\u95F4\u3002","settings.no_people":"Home Assistant \u4E2D\u8FD8\u6CA1\u6709\u53EF\u9009\u62E9\u7684\u4EBA\u5458\u3002","editor.heater":"\u70ED\u6C34\u5668","editor.compact":"\u7D27\u51D1\uFF1A\u4EC5\u663E\u793A\u6E29\u5EA6\u548C\u72B6\u6001\uFF0C\u65E0\u63A7\u4EF6","editor.tap_action":"\u70B9\u6309\u64CD\u4F5C"};var La={"status.waiting":"Idle","status.heating":"Heating","status.ready":"Ready","status.fault":"Fault","status.manual":"Manual","headline.heating_for":"Heating: ready in about {minutes} min","headline.ready_at":"Ready at {when}","subline.next_at":"Next at {when}","when.today":"{time}","when.tomorrow":"{time} tomorrow","when.weekday":"{time} on {weekday}","ring.target":"target {target}\xB0","weekday.letters":"M,T,W,T,F,S,S","members.none":"No members yet. An administrator adds them in the integration's settings.","list.empty":"No ready times yet.","list.add":"Add a ready time","sheet.delete":"Delete","list.switch":"On or off","sheet.title":"New ready time","sheet.edit_title":"Change ready time","list.edit":"Change this ready time","sheet.time":"Time","sheet.hour":"Hour","sheet.minute":"Minute","sheet.days":"Days","sheet.save":"Save","sheet.cancel":"Cancel","clock.title":"Select time","clock.title_keys":"Enter time","clock.ok":"OK","clock.to_keys":"Type the time","clock.to_dial":"Use the clock","clock.am":"AM","clock.pm":"PM","clock.invalid":"Enter a valid time","clock.change":"Change the time","fault.sensor_unavailable":"Fault: the water temperature sensor gives no readings. Heating has stopped.","fault.not_rising":"Fault: the water is not getting hotter. Heating has stopped; see Repairs.","fault.no_consumption":"Fault: the heater draws no power. Heating has stopped; see Repairs.","fault.relay_stuck":"Fault: the heater draws power while switched off. Check the relay.","fault.top_probe":"Warning: the main probe may be loose. Heating goes on; see Repairs.","fault.middle_probe":"Warning: the second probe may be loose. Heating goes on; see Repairs.","fault.probes_disagree":"Warning: the two probes disagree. Heating goes on; see Repairs.","element.on":"Heater on","element.off":"Heater off","element.drawing":"{state} \xB7 drawing {watts} W","keep_hot.until":"Keeping hot until {time}","keep_hot.title":"Keep hot after it's ready","keep_hot.hint":'After the "ready" message the heater keeps the water hot this long, then switches off.',"keep_hot.more":"Choose how long to keep it hot","keep_hot.cancel":"Cancel","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h","heat_now_target.title":"Temperature","heat_now_target.hint":"For this request only; the heater stays at {target} \xB0C.","heat_now_target.down":"1 \xB0C less","heat_now_target.up":"1 \xB0C more",manual:"Automatic control is off: the heater is run by hand.","note.not_rising_skipped":'The thermostat does not say when it is heating, so the "water not getting hotter" and "heater draws no power" checks are not made.',"heat_now.start":"Heat now","heat_now.cancel":"Cancel","heat_now.join":"Tell me when it's hot","heat_now.leave":"Don't tell me","subline.for":"For {list}.","item.at":"{name} at {time}","switch_off.link":"Switch off the heating\u2026","switch_off.title":"Switch off the heating?","switch_off.confirm":"Switch off","switch_off.keep":"Cancel","switch_off.asked_one":"{names} will no longer be told.","switch_off.asked_many":"{names} will no longer be told.","switch_off.skipped_one":"Without hot water: {list}.","switch_off.skipped_many":"Without hot water: {list}.","switch_off.back":"It switches back on by itself for the next ready time.","switch_off.nobody":"Heating stops now.","settings.switch_off":"Who may switch off the heating for everyone","settings.switch_off_hint":"The administrators and:","settings.own_cancel":"Whoever asked may always cancel their own request.",greeting:"Hello, {name}","today.label":"House today","today.nobody":"Nobody today","away.until_label":"Until (optional)","away.line":"Away","away.line_until":"Away until {date}","members.add":"Member","card.no_heater":"No Hot Water Ready heater is set up yet.","card.loading":"Loading\u2026","card.error":"That did not work: {message}","cluster.warning":"The showers from {when} need the water at {needed} \xB0C, but the heater goes only to {cap} \xB0C: the last ones may run cooler.","tabs.people":"People","tabs.week":"Week","week.days":"Mon,Tue,Wed,Thu,Fri,Sat,Sun","week.showers":"showers","week.windows":"heating windows","week.busiest":"busiest day","week.heating":"Heating","week.away":"away","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} a week","week.hint":"Tap a person to highlight their times. The bars show when the heater may heat each day ({start} to {end}).","settings.open":"Heater settings","settings.close":"Close","settings.target":"Target temperature","settings.target_hint":"Ready when the water gets here","settings.target_down":"Lower the target","settings.target_up":"Raise the target","settings.margin":"Margin","settings.band":"Stops at {stop} \xB0C, restarts at {restart} \xB0C","settings.margin_down":"Lower the margin","settings.margin_up":"Raise the margin","settings.automatic":"Automatic control","settings.automatic_hint":"Off: the heater is run by hand","settings.more":"More settings","rate.title":"Heating speed","rate.unit":"min per \xB0C","rate.automatic":"Automatic","rate.fixed":"Fixed","rate.learned":"Learned: median of the {count} clean heats of the last {days} days","rate.default_one":"Starting value: 1 more clean heat in the last {days} days and it is learned","rate.default_many":"Starting value: {count} more clean heats in the last {days} days and it is learned","rate.manual":"Fixed by hand: learning goes on, but is not used","rate.runs":"Clean heats behind it","rate.example":"Now {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} min, plus {margin} min margin: starts {lead} min before","rate.example_cap":" (the most)","rate.example_warm":"Now {from} \xB0C: already at the target, no need to start early","rate.physics":"By physics, the whole tank heated by the element: {rate} min/\xB0C","rate.physics_range":"By physics: between {fast} min/\xB0C (only the water above the element) and {slow} min/\xB0C (the whole tank)","rate.volume":"Amounts to heating {litres} L of the tank's {tank} L","rate.far_below":": {percent}% below physics. Check the tank's volume, the element's power and where the probe is.","rate.far_above":": {percent}% above physics. Check the tank's volume, the element's power and where the probe is.","rate.suggested_learned":"Suggested: {rate} (learned)","rate.suggested_physics":"Suggested: {rate} (tank physics)","rate.suggested_default":"Suggested: {rate} (starting value)","rate.use":"Use","rate.down":"0.1 min per \xB0C less","rate.up":"0.1 min per \xB0C more","rate.recalculate":"Recalculate from history","rate.recalculating":"Looking through the last week\u2026","rate.found":"Found {count} clean heats in history; learned {rate} min/\xB0C.","rate.found_too_few":"Found {count} clean heats in history; {needed} are needed to learn.","solar.title":"Solar comparison","solar.none":"No windows recorded in the last 30 days yet.","solar.would":"With the solar-aware rule on, the water would have been ready on time in {on_time} of {windows} windows","solar.did":"With the solar-aware rule, the water was ready on time in {on_time} of {windows} windows","solar.would_less":", and the heater would have run {minutes} minutes less","solar.would_more":", and the heater would have run {minutes} minutes more","solar.did_less":", and the heater ran {minutes} minutes less","solar.did_more":", and the heater ran {minutes} minutes more","solar.kwh":", about {kwh} kWh","solar.applied":" The rule was applied in {applied} of them: on time in {on_time}.","subline.starts_at":"Starts heating around {when}.","subline.starts_at_solar":"Starts heating around {when}, if the sun has not done it by then.","subline.asked_by_one":"Asked for by {name}. They are told when it is ready.","subline.asked_by_many":"Asked for by {names}. Each is told when it is ready.","names.and":" and ","today.you":"You","list.mine":"My ready times","list.count_one":"1 ready time","list.count":"{count} ready times","list.virtual":"Virtual member \xB7 shared household times","away.paused":"Paused. The times are kept.","member_settings.open":"Ready time settings","visibility.private":"Private","visibility.hint_own":"Other members do not see these times or your Heat now requests; administrators do.","visibility.hint_virtual":"Only administrators see these times.","settings.no_people":"There are no people in Home Assistant to choose from yet.","editor.heater":"Heater","editor.compact":"Compact: only the temperature and status, read-only","editor.tap_action":"Tap action"},Va={"status.waiting":"Em espera","status.heating":"A aquecer","status.ready":"Pronta","status.fault":"Avaria","status.manual":"Manual","headline.heating_for":"A aquecer: pronta em cerca de {minutes} min","headline.ready_at":"Pronta \xE0s {when}","subline.next_at":"Pr\xF3xima \xE0s {when}","when.today":"{time}","when.tomorrow":"{time} de amanh\xE3","when.weekday":"{time} de {weekday}","ring.target":"alvo {target}\xB0","weekday.letters":"S,T,Q,Q,S,S,D","members.none":"Ainda n\xE3o h\xE1 membros. Um administrador acrescenta-os nas defini\xE7\xF5es da integra\xE7\xE3o.","list.empty":"Ainda n\xE3o h\xE1 hor\xE1rios.","list.add":"Acrescentar um hor\xE1rio","sheet.delete":"Apagar","list.switch":"Ligar ou desligar","sheet.title":"Novo hor\xE1rio","sheet.edit_title":"Alterar hor\xE1rio","list.edit":"Alterar este hor\xE1rio","sheet.time":"Hora","sheet.hour":"Horas","sheet.minute":"Minutos","sheet.days":"Dias","sheet.save":"Guardar","sheet.cancel":"Cancelar","clock.title":"Escolher a hora","clock.title_keys":"Escrever a hora","clock.ok":"OK","clock.to_keys":"Escrever a hora","clock.to_dial":"Usar o rel\xF3gio","clock.am":"AM","clock.pm":"PM","clock.invalid":"Escreva uma hora v\xE1lida","clock.change":"Alterar a hora","fault.sensor_unavailable":"Avaria: o sensor da temperatura da \xE1gua n\xE3o d\xE1 leituras. O aquecimento parou.","fault.not_rising":"Avaria: a \xE1gua n\xE3o aquece. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.no_consumption":"Avaria: o aquecedor n\xE3o consome energia. O aquecimento parou; veja as Repara\xE7\xF5es.","fault.relay_stuck":"Avaria: o aquecedor consome energia com o rel\xE9 desligado. Verifique o rel\xE9.","fault.top_probe":"Aviso: a sonda principal pode estar solta. O aquecimento continua; veja as Repara\xE7\xF5es.","fault.middle_probe":"Aviso: a segunda sonda pode estar solta. O aquecimento continua; veja as Repara\xE7\xF5es.","fault.probes_disagree":"Aviso: as duas sondas n\xE3o batem certo. O aquecimento continua; veja as Repara\xE7\xF5es.","element.on":"Resist\xEAncia ligada","element.off":"Resist\xEAncia desligada","element.drawing":"{state} \xB7 a consumir {watts} W","keep_hot.until":"A manter a \xE1gua quente at\xE9 \xE0s {time}","keep_hot.title":"Manter quente depois de pronta","keep_hot.hint":"Depois do aviso de pronta, o aquecedor mant\xE9m a \xE1gua quente durante este tempo e depois desliga.","keep_hot.more":"Escolher quanto tempo manter quente","keep_hot.cancel":"Cancelar","keep_hot.minutes":"{n} min","keep_hot.hours":"{n} h","heat_now_target.title":"Temperatura","heat_now_target.hint":"S\xF3 para este pedido; o aquecedor continua nos {target} \xB0C.","heat_now_target.down":"Menos 1 \xB0C","heat_now_target.up":"Mais 1 \xB0C",manual:"O controlo autom\xE1tico est\xE1 desligado: o aquecedor est\xE1 a ser comandado manualmente.","note.not_rising_skipped":'O term\xF3stato n\xE3o indica quando est\xE1 a aquecer, por isso as verifica\xE7\xF5es "a \xE1gua n\xE3o aquece" e "o aquecedor n\xE3o consome energia" n\xE3o s\xE3o feitas.',"heat_now.start":"Aquecer agora","heat_now.cancel":"Cancelar","heat_now.join":"Avisar-me quando estiver quente","heat_now.leave":"N\xE3o me avisar","subline.for":"Para {list}.","item.at":"{name} \xE0s {time}","switch_off.link":"Desligar o aquecimento\u2026","switch_off.title":"Desligar o aquecimento?","switch_off.confirm":"Desligar","switch_off.keep":"Cancelar","switch_off.asked_one":"{names} j\xE1 n\xE3o recebe o aviso.","switch_off.asked_many":"{names} j\xE1 n\xE3o recebem o aviso.","switch_off.skipped_one":"Fica sem \xE1gua quente: {list}.","switch_off.skipped_many":"Ficam sem \xE1gua quente: {list}.","switch_off.back":"Volta a ligar-se por si para o pr\xF3ximo hor\xE1rio.","switch_off.nobody":"O aquecimento p\xE1ra agora.","settings.switch_off":"Quem pode desligar o aquecimento para todos","settings.switch_off_hint":"Os administradores e:","settings.own_cancel":"Quem pediu pode sempre cancelar o seu pr\xF3prio pedido.",greeting:"Ol\xE1, {name}","today.label":"Casa hoje","today.nobody":"Ningu\xE9m hoje","away.until_label":"At\xE9 (opcional)","away.line":"Ausente","away.line_until":"Ausente at\xE9 {date}","members.add":"Membro","card.no_heater":"Ainda n\xE3o h\xE1 nenhum aquecedor do Hot Water Ready configurado.","card.loading":"A carregar\u2026","card.error":"N\xE3o foi poss\xEDvel: {message}","cluster.warning":"Os duches a partir das {when} precisam da \xE1gua a {needed} \xB0C, mas o aquecedor s\xF3 aquece at\xE9 {cap} \xB0C: os \xFAltimos podem sair menos quentes.","tabs.people":"Pessoas","tabs.week":"Semana","week.days":"Seg,Ter,Qua,Qui,Sex,S\xE1b,Dom","week.showers":"duches","week.windows":"janelas de aquecimento","week.busiest":"dia mais cheio","week.heating":"Aquecimento","week.away":"ausente","week.virtual":"virtual \xB7 {count}","week.per_week":"{count} por semana","week.hint":"Toque numa pessoa para destacar os seus hor\xE1rios. As barras mostram quando o aquecedor pode aquecer em cada dia ({start} a {end}).","settings.open":"Defini\xE7\xF5es do aquecedor","settings.close":"Fechar","settings.target":"Temperatura alvo","settings.target_hint":"Avisa quando chega aqui","settings.target_down":"Baixar o alvo","settings.target_up":"Subir o alvo","settings.margin":"Margem","settings.band":"P\xE1ra a {stop} \xB0C, retoma a {restart} \xB0C","settings.margin_down":"Baixar a margem","settings.margin_up":"Subir a margem","settings.automatic":"Controlo autom\xE1tico","settings.automatic_hint":"Desligado: o aquecedor fica em modo manual","settings.more":"Mais defini\xE7\xF5es","rate.title":"Velocidade de aquecimento","rate.unit":"min por \xB0C","rate.automatic":"Autom\xE1tico","rate.fixed":"Fixo","rate.learned":"Aprendido: mediana das {count} aquecidas limpas dos \xFAltimos {days} dias","rate.default_one":"Valor inicial: falta 1 aquecida limpa nos \xFAltimos {days} dias para aprender","rate.default_many":"Valor inicial: faltam {count} aquecidas limpas nos \xFAltimos {days} dias para aprender","rate.manual":"Fixo \xE0 m\xE3o: a aprendizagem continua, mas n\xE3o \xE9 usada","rate.runs":"Aquecidas limpas usadas","rate.example":"Agora {from} \xB0C \u2192 {to} \xB0C: {degrees} \xB0C \xD7 {rate} = {minutes} min, mais {margin} min de margem: come\xE7a {lead} min antes","rate.example_cap":" (o m\xE1ximo)","rate.example_warm":"Agora {from} \xB0C: j\xE1 est\xE1 no alvo, n\xE3o precisa de come\xE7ar antes","rate.physics":"Pela f\xEDsica, o tanque inteiro aquecido pela resist\xEAncia: {rate} min/\xB0C","rate.physics_range":"Pela f\xEDsica: entre {fast} min/\xB0C (s\xF3 a \xE1gua acima da resist\xEAncia) e {slow} min/\xB0C (o tanque inteiro)","rate.volume":"Equivale a aquecer {litres} L dos {tank} L do tanque","rate.far_below":": {percent}% abaixo da f\xEDsica. Confirme o volume do tanque, a pot\xEAncia da resist\xEAncia e onde est\xE1 a sonda.","rate.far_above":": {percent}% acima da f\xEDsica. Confirme o volume do tanque, a pot\xEAncia da resist\xEAncia e onde est\xE1 a sonda.","rate.suggested_learned":"Sugerido: {rate} (aprendido)","rate.suggested_physics":"Sugerido: {rate} (pela f\xEDsica do tanque)","rate.suggested_default":"Sugerido: {rate} (valor inicial)","rate.use":"Usar","rate.down":"Menos 0,1 min por \xB0C","rate.up":"Mais 0,1 min por \xB0C","rate.recalculate":"Recalcular a partir do hist\xF3rico","rate.recalculating":"A rever a \xFAltima semana\u2026","rate.found":"Encontradas {count} aquecidas limpas no hist\xF3rico; aprendido {rate} min/\xB0C.","rate.found_too_few":"Encontradas {count} aquecidas limpas no hist\xF3rico; s\xE3o precisas {needed} para aprender.","solar.title":"Compara\xE7\xE3o solar","solar.none":"Ainda n\xE3o h\xE1 janelas registadas nos \xFAltimos 30 dias.","solar.would":"Com a regra solar ligada, a \xE1gua teria ficado pronta a tempo em {on_time} de {windows} janelas","solar.did":"Com a regra solar, a \xE1gua ficou pronta a tempo em {on_time} de {windows} janelas","solar.would_less":", e o aquecedor teria trabalhado menos {minutes} minutos","solar.would_more":", e o aquecedor teria trabalhado mais {minutes} minutos","solar.did_less":", e o aquecedor trabalhou menos {minutes} minutos","solar.did_more":", e o aquecedor trabalhou mais {minutes} minutos","solar.kwh":", cerca de {kwh} kWh","solar.applied":" A regra foi aplicada em {applied} delas: a tempo em {on_time}.","subline.starts_at":"Come\xE7a a aquecer por volta das {when}.","subline.starts_at_solar":"Come\xE7a a aquecer por volta das {when}, se o sol n\xE3o chegar.","subline.asked_by_one":"Pedido por {name}. Recebe um aviso quando estiver pronta.","subline.asked_by_many":"Pedido por {names}. Cada um \xE9 avisado quando estiver pronta.","names.and":" e ","today.you":"Voc\xEA","list.mine":"Os meus hor\xE1rios","list.count_one":"1 hor\xE1rio","list.count":"{count} hor\xE1rios","list.virtual":"Membro virtual \xB7 hor\xE1rios partilhados da casa","away.paused":"Em pausa. Os hor\xE1rios ficam guardados.","member_settings.open":"Defini\xE7\xF5es dos hor\xE1rios","visibility.private":"Privado","visibility.hint_own":"Os outros membros n\xE3o v\xEAem estes hor\xE1rios nem os seus pedidos de Aquecer agora; os administradores v\xEAem.","visibility.hint_virtual":"S\xF3 os administradores v\xEAem estes hor\xE1rios.","settings.no_people":"Ainda n\xE3o h\xE1 pessoas no Home Assistant para escolher.","editor.heater":"Aquecedor","editor.compact":"Compacto: s\xF3 a temperatura e o estado, sem controlos","editor.tap_action":"Ac\xE7\xE3o ao tocar"},se={en:["en-GB",La],pt:["pt-PT",Va],"pt-BR":["pt-BR",bt],de:["de-DE",pt],fr:["fr-FR",gt],es:["es-ES",ht],it:["it-IT",ft],nl:["nl-NL",vt],pl:["pl-PL",kt],sv:["sv-SE",xt],da:["da-DK",mt],nb:["nb-NO",wt],cs:["cs-CZ",ut],ru:["ru-RU",yt],uk:["uk-UA",Ct],ja:["ja-JP",_t],"zh-Hans":["zh-CN",$t]},Ia=Object.fromEntries(Object.entries(se).map(([n,[,t]])=>[n,t]));function oe(n){if(!n)return"en";if(n in se)return n;let t=n.toLowerCase();if(t==="pt-br")return"pt-BR";let e=t.split("-")[0]??"";return e==="no"||e==="nn"?"nb":e==="zh"?"zh-Hans":e in se?e:"en"}function v(n){return se[oe(n)][0]}function le(n){return o(n,"weekday.letters").split(",")}function o(n,t,e={}){return Ia[oe(n)][t].replace(/\{(\w+)\}/g,(i,r)=>String(e[r]??i))}function ce(n){return n.callWS({type:"hot_water_ready/heaters"})}var de=class{constructor(t,e){this.onSnapshot=t;this.onMissing=e;this.generation=0}async follow(t,e){let a=this.generation,i=e;if(i===void 0){if(this.defaultEntryId??=ce(t).then(s=>s[0]?.entry_id),i=await this.defaultEntryId,a!==this.generation)return;if(i===void 0){this.defaultEntryId=void 0,this.onMissing();return}}if(i===this.entryId)return;this.stop();let r=this.generation;this.entryId=i,this.stopSubscription=t.connection.subscribeMessage(s=>{r===this.generation&&this.onSnapshot(s)},{type:"hot_water_ready/subscribe",entry_id:i}),this.stopSubscription.catch(()=>{r===this.generation&&(this.entryId=void 0,this.onMissing())})}stop(){this.generation++;let t=this.stopSubscription;this.stopSubscription=void 0,this.entryId=void 0,t?.then(e=>e()).catch(()=>{})}};function St(n,t){if(n==="24")return!0;if(n==="12")return!1;let e=n==="system"?void 0:t;return!new Intl.DateTimeFormat(e,{hour:"numeric"}).format(new Date(2023,0,1,22)).includes("10")}function Tt(n,t,e,a){return a?`${String(n).padStart(2,"0")}:${String(t).padStart(2,"0")}`:new Intl.DateTimeFormat(v(e),{timeZone:"UTC",hour:"numeric",minute:"2-digit",hourCycle:"h12"}).format(Date.UTC(2e3,0,1,n,t))}function pe(n,t,e=!0){let[a=0,i=0]=n.split(":").map(Number);return Tt(a,i,t,e)}function $e(n,t,e=!0){return e?`${String(n).padStart(2,"0")}h`:new Intl.DateTimeFormat(v(t),{timeZone:"UTC",hour:"numeric",hourCycle:"h12"}).format(Date.UTC(2e3,0,1,n%24))}function jt(n,t=!0){return o(n,"week.hint",{start:$e(q/60,n,t),end:$e(F/60,n,t)})}function f(n,t,e){return new Intl.NumberFormat(v(t),{maximumFractionDigits:e}).format(n)}function B(n,t){return new Intl.DateTimeFormat("en-CA",{timeZone:t,year:"numeric",month:"2-digit",day:"2-digit"}).format(n)}function Mt(n){let t=new Date(`${n}T12:00:00Z`);return t.setUTCDate(t.getUTCDate()+1),t.toISOString().slice(0,10)}function me(n,t){let{language:e,timeZone:a,now:i}=t,r=new Date(n),s=G(n,t),c=B(i,a);if(B(r,a)===c)return o(e,"when.today",{time:s});if(B(r,a)===Mt(c))return o(e,"when.tomorrow",{time:s});let d=new Intl.DateTimeFormat(v(e),{timeZone:a,weekday:"long"}).format(r);return o(e,"when.weekday",{time:s,weekday:d})}function Wa(n,t){let{language:e}=t;return n.status==="heating"&&n.ready_in_minutes!==null?o(e,"headline.heating_for",{minutes:n.ready_in_minutes}):n.status==="waiting"&&n.next_ready?o(e,"headline.ready_at",{when:me(n.next_ready.at,t)}):o(e,`status.${n.status}`)}function Ht(n){return new Map(n.members.map(t=>[t.id,t]))}function Se(n,t,e){let a=Ht(n);return t.map(i=>a.get(i)?.name??e.people?.[i]??i)}function Et(n){let t={};for(let[e,a]of Object.entries(n??{}))e.startsWith("person.")&&(t[e]=a.attributes.friendly_name??e);return t}function Te(n,t){return n.length<2?n.join(""):`${n.slice(0,-1).join(", ")}${o(t,"names.and")}${n.at(-1)??""}`}function Rt(n,t,e){let a=t.map(i=>o(e.language,"item.at",{name:Se(n,[i.member],e)[0]??"",time:G(i.at,e)}));return Te(a,e.language)}function Ua(n,t){let{language:e}=t,a=n.heat_now?.requesters??[];if(n.status==="heating"&&a.length>0){let i=Se(n,a,t);return i.length===1?o(e,"subline.asked_by_one",{name:i[0]??""}):o(e,"subline.asked_by_many",{names:Te(i,e)})}if(n.status==="heating"&&n.heating_for.length>0)return o(e,"subline.for",{list:Rt(n,n.heating_for,t)});if(n.status==="waiting"&&n.next_heat_start){let i=n.solar_aware?"subline.starts_at_solar":"subline.starts_at";return o(e,i,{when:me(n.next_heat_start,t)})}return n.status==="ready"&&n.next_ready?o(e,"subline.next_at",{when:me(n.next_ready.at,t)}):""}function Ba(n,t){if(n.element_on===null)return"";let e=o(t,n.element_on?"element.on":"element.off");return n.power_w===null?e:o(t,"element.drawing",{state:e,watts:f(n.power_w,t,0)})}function je(n,t){let{language:e}=t,{temperature:a}=n,r=(n.heat_now?.asked?n.heat_now.target:null)??n.target;return{temperature:a===null?"\u2013":`${f(a,e,1)}\xB0`,target:o(e,"ring.target",{target:f(r,e,1)}),badge:o(e,`status.${n.status}`).toLocaleUpperCase(v(e)),headline:Wa(n,t),subline:Ua(n,t),element:Ba(n,e),keepHot:Ja(n,t),fill:a===null||r<=0?0:Math.min(1,Math.max(0,a/r)),tone:n.status}}var Fa={action:"none"};function Me(n){return n.tap_action??Fa}function Pt(n){if(n.compact)return n;let t={...n};return delete t.compact,delete t.tap_action,t}var qt=["navigate","url","perform-action","assist","none"];function Ot(n,t){let e=je(n,t);return{name:n.name,temperature:e.temperature,target:e.target,badge:e.badge,headline:e.headline,lines:[e.subline,e.element,e.keepHot].filter(a=>a!==""),fill:e.fill,tone:e.tone}}function Ka(n,t){let e=t??n.me;return n.members.find(a=>a.id===e)??n.members[0]}function Dt(n){let t=K(n);return t==="admin"?!0:t==="viewer"&&n.members.length>1}function Nt(n,t){return Ka(n,K(n)==="member"?void 0:t)}function Lt(n){return B(n.now,n.timeZone)}function Vt(){return{time:"07:00",weekdays:[0,1,2,3,4]}}function It(n,t){let e=n.ready_times.find(a=>a.id===t);return e&&{id:e.id,time:e.time,weekdays:[...e.weekdays].sort()}}function He(n){return n.time!==""&&n.weekdays.length>0}var b=256,E=104,Ee=68;function k(n){return String(n).padStart(2,"0")}function Re(n,t){return t?k(n):String(n%12||12)}function ze(n,t){return{hourText:Re(n.hour,t),minuteText:k(n.minute)}}function Pe(n,t,e=!0){let[a=7,i=0]=n.split(":").map(Number);return{hour:a,minute:i,part:"hour",mode:"dial",...ze({hour:a,minute:i},e),fresh:t}}function U(n,t){let e=n*Math.PI/6;return{x:b/2+t*Math.sin(e),y:b/2-t*Math.cos(e)}}function Wt(n,t=!0){let e=Array.from({length:12},(a,i)=>i);return n==="minute"?e.map(a=>({value:a*5,label:k(a*5),...U(a,E)})):t?[...e.map(a=>({value:a,label:String(a),...U(a,E)})),...e.map(a=>({value:a+12,label:String(a+12),...U(a,Ee)}))]:e.map(a=>({value:a,label:String(a||12),...U(a,E)}))}function Ut(n,t,e=!0){return n.part==="minute"?n.minute===t.value:(e?n.hour:n.hour%12)===t.value}function Bt(n,t=!0){if(n.part==="minute"){let e=n.minute*Math.PI/30;return{x:b/2+E*Math.sin(e),y:b/2-E*Math.cos(e)}}return U(n.hour%12,t&&n.hour>=12?Ee:E)}function Ft(n,t,e,a=!0){let i=t-b/2,r=e-b/2,s=(Math.atan2(i,-r)/(2*Math.PI)+1)%1;if(n.part==="minute"){let p=Math.round(s*60)%60;return{...n,minute:p,minuteText:k(p)}}let c=Math.round(s*12)%12,d=a?Math.hypot(i,r)<(E+Ee)/2:n.hour>=12,m=c+(d?12:0);return{...n,hour:m,hourText:Re(m,a)}}function Kt(n,t,e=!0){if(n.part==="minute"){let i=(n.minute+t+60)%60;return{...n,minute:i,minuteText:k(i)}}let a=(n.hour+t+24)%24;return{...n,hour:a,hourText:Re(a,e)}}function Gt(n,t){return{...n,hour:n.hour%12+(t?12:0)}}function Zt(n,t=!0){if(!/^\d{1,2}$/.test(n.hourText)||!/^\d{1,2}$/.test(n.minuteText))return;let e=Number(n.hourText),a=Number(n.minuteText);if(!(a>59)){if(t)return e>23?void 0:`${k(e)}:${k(a)}`;if(!(e<1||e>12))return`${k(e%12+(n.hour>=12?12:0))}:${k(a)}`}}function qe(n,t=!0){return n.mode==="keys"?Zt(n,t):`${k(n.hour)}:${k(n.minute)}`}function Qt(n,t=!0){if(n.mode==="dial")return{...n,mode:"keys",...ze(n,t)};let[e=n.hour,a=n.minute]=Zt(n,t)?.split(":").map(Number)??[];return{...n,mode:"dial",part:"hour",hour:e,minute:a,...ze({hour:e,minute:a},t)}}function Jt(n,t,e=!0){let a=le(t);return[...n.ready_times].sort((i,r)=>i.time.localeCompare(r.time)||i.id.localeCompare(r.id)).map(i=>({id:i.id,time:pe(i.time,t,e),enabled:i.enabled,days:a.map((r,s)=>({letter:r,on:i.weekdays.includes(s)}))}))}function K(n){return n.is_admin?"admin":n.me?"member":"viewer"}function Yt(n,t){return n.members.map(e=>({id:e.id,name:e.name,initial:e.name.slice(0,1).toLocaleUpperCase(),colour:e.colour,star:e.virtual,faded:e.away.on,selected:e.id===t}))}function Xt(n,t){let e=n.members.find(a=>a.id===n.me);return e?o(t,"greeting",{name:e.name}):""}function G(n,t){let{minutes:e}=Ae(n,t.timeZone);return Tt(Math.floor(e/60),e%60,t.language,t.hour24??!0)}function ea(n,t,e){let a=Ht(n);return n.today.map(i=>{let r=i.member===e,s=a.get(i.member);return{name:r?o(t.language,"today.you"):s?.name??"?",time:G(i.at,t),colour:s?.colour??"",mine:r}})}function ta(n,t){let e=n.ready_times.length,a=o(t,"list.count",{count:e});return n.virtual?a=o(t,"list.virtual"):e===1&&(a=o(t,"list.count_one")),{name:n.name,note:a}}function Ga(n,t){let e=new Date(`${n}T12:00:00Z`),a=v(t),i=new Intl.DateTimeFormat(a,{timeZone:"UTC",day:"numeric"}).format(e),r=new Intl.DateTimeFormat(a,{timeZone:"UTC",month:"long"}).format(e);return oe(t)==="pt"?`${i} de ${r.slice(0,1).toLocaleUpperCase("pt-PT")}${r.slice(1)}`:`${i} ${r}`}var aa="hot_water_ready/visibility/set";function na(n,t){if(!n.can_set_visibility)return null;let e=n.visibility==="private",a=e?o(t,n.virtual?"visibility.hint_virtual":"visibility.hint_own"):"";return{label:o(t,"visibility.private"),on:e,hint:a}}function ia(n,t){return n.away.on?n.away.until?o(t.language,"away.line_until",{date:Ga(n.away.until,t.language)}):o(t.language,"away.line"):""}var ra="hot_water_ready/heat_now/start",Za="hot_water_ready/heat_now/cancel";function sa(n){let t=n.can_ask_heat_now&&!n.heat_now_blocked&&n.automatic,e=n.heat_now;if(e?.asked){let i=e.requesters.length===1&&!e.unnamed;return[{message:{type:Za},label:i?"heat_now.cancel":"heat_now.leave"}]}if(!t)return[];if(e===null&&n.heating_for.some(i=>i.member===n.me))return[];let a=n.status==="heating"||e!==null;return[{message:{type:ra},label:a?"heat_now.join":"heat_now.start"}]}function oa(n){return n.message.type===ra}var la=500,Qa=[5,15,30,60,120];function da(n,t){let e=n.keep_hot_minutes;return[...new Set([...Qa,e])].sort((i,r)=>i-r).map(i=>({minutes:i,label:i>=60&&i%60===0?o(t,"keep_hot.hours",{n:f(i/60,t,0)}):o(t,"keep_hot.minutes",{n:f(i,t,0)}),isDefault:i===e}))}var ca=30,ua=45;function ma(n){return Math.min(Math.max(n.target,ca),ua)}function pa(n,t){let e=Math.max(Math.ceil(n)-1,ca),a=Math.min(Math.floor(n)+1,ua);return{value:n,shown:`${f(n,t,Number.isInteger(n)?0:1)} \xB0C`,down:e<n?e:null,up:a>n?a:null}}function ha(n,t){return t===void 0||t===n.target?{}:{target:t}}function ga(n,t){let e=Number.isInteger(n.target)?0:1;return o(t,"heat_now_target.hint",{target:f(n.target,t,e)})}function Ja(n,t){let e=n.heat_now?.keep_until;return e?o(t.language,"keep_hot.until",{time:G(e,t)}):""}var fa="hot_water_ready/switch_off";function _a(n){let t=(n.heat_now?.requesters.length??0)>0||!!n.heat_now?.unnamed;return n.can_switch_off&&(n.status==="heating"||t)}function wa(n,t){let{language:e}=t,a=(n.heat_now?.requesters??[]).filter(s=>s!==n.viewer),i=n.heating_for.filter(s=>s.member!==n.viewer),r=[];if(a.length>0){let s=Te(Se(n,a,t),e);r.push(o(e,a.length===1?"switch_off.asked_one":"switch_off.asked_many",{names:s}))}if(i.length>0){let s=Rt(n,i,t);r.push(o(e,i.length===1?"switch_off.skipped_one":"switch_off.skipped_many",{list:s}))}return r.length===0&&r.push(o(e,"switch_off.nobody")),n.heating_for.length>0&&r.push(o(e,"switch_off.back")),{title:o(e,"switch_off.title"),lines:r}}function va(n,t){return n.faults.map(e=>o(t,`fault.${e}`))}var Oe="hot_water_ready/settings/set",Ya={min:30,max:75,step:.5},Xa={min:0,max:5,step:.5};function zt(n,t,e){let a=Math.ceil(n/t.step-1e-9)*t.step-t.step,i=Math.floor(n/t.step+1e-9)*t.step+t.step;return{shown:f(n,e,1),down:a>=t.min-1e-9?a:null,up:i<=t.max+1e-9?i:null}}function ka(n,t){let{language:e}=t,a=n.settings;if(!(!n.is_admin||!a))return{target:zt(n.target,Ya,e),margin:zt(n.margin,Xa,e),band:o(e,"settings.band",{stop:f(n.target+n.margin,e,1),restart:f(n.target-n.margin,e,1)}),automatic:n.automatic,people:Object.entries(t.people??{}).map(([i,r])=>({id:i,name:r,on:a.switch_off_people.includes(i)})).sort((i,r)=>i.name.localeCompare(r.name)),solar:on(a,e),notes:n.not_rising_checked?[]:[o(e,"note.not_rising_skipped")]}}var ue={min:.5,max:60,step:.1},ba="hot_water_ready/rate/recalculate",ya=1e3,At=.25,P=n=>Math.round(n*10)/10;function en(n,t){let e=new Date(n),{language:a,timeZone:i}=t,r=new Intl.DateTimeFormat(v(a),{timeZone:i,day:"numeric"}).format(e),s=new Intl.DateTimeFormat(v(a),{timeZone:i,month:"short"}).format(e).replace(".","");return`${r} ${s.slice(0,1).toLocaleUpperCase()}${s.slice(1)}, ${G(n,t)}`}function tn(n,t){if(n.source==="manual")return o(t,"rate.manual");if(n.source==="learned")return o(t,"rate.learned",{count:n.runs.length,days:n.window_days});let e=Math.max(1,n.min_runs-n.runs.length);return o(t,e===1?"rate.default_one":"rate.default_many",{count:e,days:n.window_days})}function an(n,t,e){let a=n.temperature;if(a===null)return null;let i=f(a,e,1),r=n.target-a;if(r<=0)return o(e,"rate.example_warm",{from:i});let s=r*t.used,c=s+t.lead_margin_minutes,d=Math.min(t.lead_cap_minutes,c);return o(e,"rate.example",{from:i,to:f(n.target,e,1),degrees:f(r,e,1),rate:f(t.used,e,1),minutes:Math.round(s),margin:t.lead_margin_minutes,lead:Math.round(d)})+(c>t.lead_cap_minutes?o(e,"rate.example_cap"):"")}function nn(n,t){if(n.physics===null||n.tank_litres===null)return null;let e=n.physics_fast??n.physics,a=o(t,"rate.volume",{litres:Math.round(n.tank_litres*n.used/n.physics),tank:f(n.tank_litres,t,0)}),i=n.used<e*(1-At),r=n.used>n.physics*(1+At);if(i||r){let s=n.used/(i?e:n.physics);a+=o(t,i?"rate.far_below":"rate.far_above",{percent:Math.round(Math.abs(s-1)*100)})}return{line:a,warn:i||r}}function rn(n,t){if(n.physics===null)return null;let e=f(n.physics,t,1),a=f(n.physics_fast??n.physics,t,1);return a===e?o(t,"rate.physics",{rate:e}):o(t,"rate.physics_range",{fast:a,slow:e})}function sn(n,t){if(n.source!=="manual")return null;let[e,a]=n.learned!==null?[n.learned,"rate.suggested_learned"]:n.physics!==null?[n.physics,"rate.suggested_physics"]:[n.default,"rate.suggested_default"],i=P(e);return n.manual!==null&&P(n.manual)===i?null:{value:i,line:o(t,a,{rate:f(i,t,1)})}}function De(n,t){let e=P(n),a=P(e-ue.step),i=P(e+ue.step);return{shown:f(e,t,1),down:a>=ue.min?a:null,up:i<=ue.max?i:null}}function xa(n,t){let{language:e}=t,a=n.settings?.rate;if(!(!n.is_admin||!a))return{shown:f(a.used,e,1),used:P(a.used),fixed:a.source==="manual",source:tn(a,e),runs:[...a.runs].sort((i,r)=>Date.parse(r.at)-Date.parse(i.at)).map(i=>({when:en(i.at,t),rate:f(i.rate,e,1)})),example:an(n,a,e),physics:rn(a,e),check:nn(a,e),stepper:De(a.used,e),suggestion:sn(a,e)}}function Ca(n,t,e){return n.filter(a=>a.id===t?e:a.on).map(a=>a.id)}function on(n,t){let{windows:e,on_time:a,minutes_saved:i,kwh:r}=n.solar;if(e===0)return o(t,"solar.none");let s=n.solar_aware?"did":"would",c=o(t,`solar.${s}`,{on_time:a,windows:e});i!==0&&(c+=o(t,`solar.${s}_${i>0?"less":"more"}`,{minutes:Math.abs(i)}),r!==null&&(c+=o(t,"solar.kwh",{kwh:f(Math.abs(r),t,1)}))),c+=".";let{solar_windows:d,solar_on_time:m}=n.solar;return d>0&&(c+=o(t,"solar.applied",{applied:d,on_time:m})),c}var q=300,F=1440;function Ae(n,t){let e=new Date(n),a=new Intl.DateTimeFormat("en-GB",{timeZone:t,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(e).reduce((i,r)=>({...i,[r.type]:r.value}),{});return{day:B(e,t),minutes:Number(a.hour)*60+Number(a.minute)}}function $a(n,t){let e=n.week;if(!n.is_admin||!e)return;let a=o(t.language,"week.days").split(","),i=a.map((d,m)=>ln(e.monday,m)),r=n.members.map(d=>cn(d,i,t.language,t.hour24??!0)),s=i.map((d,m)=>r.reduce((p,h)=>{let _=h.cells[m];return _&&!_.away?p+_.times.length:p},0)),c=Math.max(0,...s);return{days:i.map((d,m)=>({key:d,label:a[m]??d,today:d===e.today,bars:un(d,e.windows,t.timeZone)})),hours:[6,12,18,24].map(d=>({label:$e(d,t.language,t.hour24??!0),at:(d*60-q)/(F-q)})),rows:r,showers:s.reduce((d,m)=>d+m,0),windows:e.windows.length,busiest:c>0?a[s.indexOf(c)]??"":""}}function ln(n,t){let e=n;for(let a=0;a<t;a+=1)e=Mt(e);return e}function dn(n,t){return n.away.on&&(n.away.until===null||t<=n.away.until)}function cn(n,t,e,a){let i=n.ready_times.filter(m=>m.enabled),r=t.map((m,p)=>({times:i.filter(h=>h.weekdays.includes(p)).map(h=>h.time).sort().map(h=>pe(h,e,a)),away:dn(n,m)})),s=r.every(m=>m.away),c=r.reduce((m,p)=>m+p.times.length,0),d=o(e,"week.per_week",{count:c});return s?d=o(e,"week.away"):n.virtual&&(d=o(e,"week.virtual",{count:c})),{id:n.id,name:n.name,colour:n.colour,initial:n.virtual?"\u2605":n.name[0]??"?",away:s,note:d,cells:r}}function un(n,t,e){let a=F-q,i=[];for(let r of t){let s=Ae(r.start,e),c=Ae(r.end,e);if(s.day>n||c.day<n)continue;let d=Math.max(q,s.day<n?0:s.minutes),m=Math.min(F,c.day>n?F:c.minutes);m>d&&i.push({from:(d-q)/a,length:(m-d)/a})}return i}function za(n,t){let e=n.cluster_warning;return e?o(t.language,"cluster.warning",{when:me(e.at,t),needed:f(e.needed,t.language,0),cap:f(e.cap,t.language,1)}):""}var mn=W`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/></svg>`,pn=W`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>`,Z="hot-water-ready-card",Ne="hot-water-ready-card-editor",Le=38,Aa=2*Math.PI*Le,Ve=class extends ${constructor(){super(...arguments);this._missing=!1;this._settingsOpen=!1;this._offOpen=!1;this._holding=!1;this._held=!1;this._tab="people";this._error="";this._recalc={busy:!1,line:""};this._subscription=new de(e=>{this._heater=e,this._missing=!1,e.settings?.rate.manual===this._rateDraft&&(this._rateDraft=void 0)},()=>{this._missing=!0});this._tap=()=>{if(!this._config)return;let e=Me(this._config);e.action!=="none"&&this.dispatchEvent(new CustomEvent("hass-action",{bubbles:!0,composed:!0,detail:{config:{...this._config,tap_action:e},action:"tap"}}))};this._holdEnd=()=>{window.clearTimeout(this._holdTimer),this._holding=!1}}static{this.properties={hass:{attribute:!1},_config:{state:!0},_heater:{state:!0},_missing:{state:!0},_selected:{state:!0},_sheet:{state:!0},_clock:{state:!0},_settingsOpen:{state:!0},_memberSettings:{state:!0},_offOpen:{state:!0},_keep:{state:!0},_holding:{state:!0},_tab:{state:!0},_focus:{state:!0},_error:{state:!0},_rateDraft:{state:!0},_recalc:{state:!0}}}static async getStubConfig(e){let a=(await ce(e))[0];return a?{type:`custom:${Z}`,entry_id:a.entry_id}:{type:`custom:${Z}`}}setConfig(e){this._config=e}getCardSize(){return this._config?.compact?2:6}static getConfigElement(){return document.createElement(Ne)}get _language(){return this.hass?.locale?.language??this.hass?.language??"en"}get _hour24(){return St(this.hass?.locale?.time_format,this._language)}get _context(){return{language:this._language,timeZone:this.hass?.config?.time_zone??Intl.DateTimeFormat().resolvedOptions().timeZone,now:new Date,people:Et(this.hass?.states),hour24:this._hour24}}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._subscription.stop()}updated(e){(e.has("hass")||e.has("_config"))&&this._follow(),e.has("_offOpen")&&this._offOpen&&this.renderRoot.querySelector(".off-keep")?.focus(),e.has("_keep")&&this._keep&&!e.get("_keep")&&this.renderRoot.querySelector(".keep-chip.on")?.focus()}_follow(){this.hass&&this._config&&this.isConnected&&this._subscription.follow(this.hass,this._config.entry_id)}async _call(e){if(!this.hass||!this._heater)return!1;this._error="";try{return await this.hass.callWS({entry_id:this._heater.entry_id,...e}),!0}catch(a){let i=(a instanceof Error,a.message);return this._error=o(this._language,"card.error",{message:i??String(a)}),!1}}async _save(e){let a=this._sheet;if(!a||!He(a))return;await this._call({...a.id?{type:"hot_water_ready/ready_time/update",ready_time_id:a.id}:{type:"hot_water_ready/ready_time/add"},member_id:e.id,time:a.time,weekdays:[...a.weekdays].sort()})&&(this._sheet=void 0)}async _remove(e,a){await this._call({type:"hot_water_ready/ready_time/remove",member_id:e.id,ready_time_id:a})&&(this._sheet=void 0)}render(){let e=this._language;if(this._missing)return l`<ha-card><div class="message">${o(e,"card.no_heater")}</div></ha-card>`;let a=this._heater;if(!a)return l`<ha-card><div class="message">${o(e,"card.loading")}</div></ha-card>`;if(this._config?.compact)return this._renderCompact(a);let i=K(a),r=Nt(a,this._selected),s=$a(a,this._context);return l`
      <ha-card>
        ${va(a,e).map(c=>l`<div class="banner fault" role="alert">${c}</div>`)}
        ${a.automatic?u:l`<div class="banner manual">${o(e,"manual")}</div>`}
        ${a.cluster_warning?l`<div class="banner warning" role="alert">${za(a,this._context)}</div>`:u}
        ${this._renderTop(a)}
        ${this._renderSettings(a)}
        ${this._renderTabs(a)}
        ${s&&this._tab==="week"?this._renderWeek(s):l`
              ${i==="member"?l`<div class="greeting">${Xt(a,e)}</div>`:this._renderAvatars(a,r)}
              ${i==="member"&&r?this._renderToday(a,r):u}
              ${r?l`${this._renderMemberSettings(r)}
                    <div class="panel">${this._renderListHead(r,i==="member")} ${this._renderList(r)}</div>
                    ${this._sheet?this._renderSheet(r,this._sheet):u}
                    ${this._sheet&&this._clock?this._renderClock(this._clock):u}`:l`<div class="message">${o(e,"members.none")}</div>`}
            `}
        ${this._error?l`<div class="error" role="alert">${this._error}</div>`:u}
        ${this._offOpen?this._renderSwitchOff(a):u}
        ${this._keep?this._renderKeepHot(a,this._keep):u}
      </ha-card>
    `}_renderListHead(e,a){let i=this._language,r=ta(e,i),s=ia(e,this._context),c=(d,m)=>this._call({type:"hot_water_ready/away/set",member_id:e.id,away:d,until:m});return l`
      <div class="list-head">
        <div class="list-title">
          <span class="list-name">
            ${a?o(i,"list.mine"):r.name}
            ${e.can_set_visibility?l`<button
                  class="member-settings-button"
                  aria-label=${o(i,"member_settings.open")}
                  aria-expanded=${this._memberSettings===e.id}
                  @click=${()=>this._memberSettings=this._memberSettings===e.id?void 0:e.id}
                >
                  ⚙
                </button>`:u}
          </span>
          ${a?u:l`<span class="hint">${r.note}</span>`}
        </div>
        ${e.can_edit?l`<label class="away-toggle">
              ${s||o(i,"away.line")}
              <input
                type="checkbox"
                class="switch"
                .checked=${z(e.away.on)}
                @change=${d=>{c(d.target.checked,null)}}
              />
            </label>`:s?l`<span class="hint">${s}</span>`:u}
      </div>
      ${e.away.on?l`<div class="paused">
            <span>${o(i,"away.paused")}</span>
            ${e.can_edit?l`<label class="until">
                  ${o(i,"away.until_label")}
                  <input
                    type="date"
                    min=${Lt(this._context)}
                    .value=${z(e.away.until??"")}
                    @change=${d=>{c(!0,d.target.value||null)}}
                  />
                </label>`:u}
          </div>`:u}
    `}_renderMemberSettings(e){let a=this._language,i=na(e,a);return!i||this._memberSettings!==e.id?u:l`<div class="sheet" role="dialog" aria-label=${o(a,"member_settings.open")}>
      <div class="sheet-head">
        <div class="sheet-title">${o(a,"member_settings.open")}</div>
        <button class="secondary" @click=${()=>this._memberSettings=void 0}>
          ${o(a,"settings.close")}
        </button>
      </div>
      <label class="setting">
        <span class="setting-text">
          <span>${i.label}</span>
          ${i.hint?l`<span class="hint">${i.hint}</span>`:u}
        </span>
        <input
          type="checkbox"
          class="switch"
          .checked=${z(i.on)}
          @change=${r=>{let s=r.target.checked?"private":"public";this._call({type:aa,member_id:e.id,visibility:s})}}
        />
      </label>
    </div>`}_renderToday(e,a){let i=this._language,r=ea(e,this._context,a.id);return l`<div class="today">
      <span class="today-label">${o(i,"today.label")}</span>
      ${r.length===0?l`<span>${o(i,"today.nobody")}</span>`:r.map(s=>l`<span
              class="chip ${s.mine?"mine":""}"
              style=${s.mine?"":`--chip: var(--${s.colour}-color, var(--primary-color))`}
              >${s.name} ${s.time}</span
            >`)}
    </div>`}_openIntegration(){history.pushState(null,"","/config/integrations/integration/hot_water_ready"),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_renderGauge(e){return l`
      <div class="gauge ${e.tone==="heating"?"glowing":""}">
        <span class="pulse"></span>
        <span class="orbit"></span>
        <svg class="ring" viewBox="0 0 92 92" role="img" aria-label="${e.temperature} ${e.target}">
          <circle class="track" cx="46" cy="46" r=${Le}></circle>
          ${e.fill>0?W`<circle class="fill ${e.tone}" cx="46" cy="46" r=${Le}
                stroke-dasharray="${e.fill*Aa} ${Aa}"
                transform="rotate(-90 46 46)"></circle>`:u}
          <text class="temperature" x="46" y="44">${e.temperature}</text>
          <text class="target" x="46" y="61">${e.target}</text>
        </svg>
      </div>
    `}_renderCompact(e){let a=Ot(e,this._context),i=this._config?Me(this._config).action!=="none":!1;return l`
      <ha-card
        class="compact ${i?"tappable":""}"
        role=${i?"button":u}
        tabindex=${i?0:u}
        @click=${this._tap}
        @keydown=${r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),this._tap())}}
      >
        <div class="top">
          ${this._renderGauge(a)}
          <div class="text">
            <div class="name-row">
              <div class="name">${a.name}</div>
              <span class="badge ${a.tone}">${a.badge}</span>
            </div>
            <div class="headline ${a.tone}">${a.headline}</div>
            ${a.lines.map(r=>l`<div class="subline">${r}</div>`)}
          </div>
        </div>
      </ha-card>
    `}_renderTop(e){let a=je(e,this._context);return l`
      <div class="top">
        ${this._renderGauge(a)}
        <div class="text">
          <div class="name-row">
            <div class="name">${e.name}</div>
            <span class="badge ${a.tone}">${a.badge}</span>
            ${e.settings?l`<button
                  class="settings-button"
                  aria-label=${o(this._language,"settings.open")}
                  aria-expanded=${this._settingsOpen}
                  @click=${()=>this._settingsOpen=!this._settingsOpen}
                >
                  ⚙
                </button>`:u}
          </div>
          <div class="headline ${a.tone}">${a.headline}</div>
          ${a.subline?l`<div class="subline">${a.subline}</div>`:u}
          ${a.element?l`<div class="subline">${a.element}</div>`:u}
          ${a.keepHot?l`<div class="subline">${a.keepHot}</div>`:u}
        </div>
        <div class="heat-now">
          ${_a(e)?l`<button class="switch-off-link" @click=${()=>this._offOpen=!0}>
                ${o(this._language,"switch_off.link")}
              </button>`:u}
          ${sa(e).map(i=>oa(i)?l`<button
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
                  </button>`:l`<button
                  class="primary"
                  @click=${()=>{this._call(i.message)}}
                >
                  ${o(this._language,i.label)}
                </button>`)}
        </div>
      </div>
    `}_holdStart(e){this._held=!1,this._holding=!0,window.clearTimeout(this._holdTimer),this._holdTimer=window.setTimeout(()=>{this._holding=!1,this._held=!0,this._openKeep(e)},la)}_openKeep(e){if(!this._heater)return;let a=this._heater;this._keep=a.can_choose_heat_now_target?{action:e,minutes:a.keep_hot_minutes,target:ma(a)}:{action:e,minutes:a.keep_hot_minutes}}_renderKeepHot(e,a){let i=this._language,r=()=>{this._keep=void 0,this._held=!1};return l`
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
          ${a.target===void 0?u:this._renderHeatNowTarget(e,a,a.target)}
          <div class="off-title" id="keep-title">${o(i,"keep_hot.title")}</div>
          <p>${o(i,"keep_hot.hint")}</p>
          <div class="keep-chips" role="radiogroup" aria-labelledby="keep-title">
            ${da(e,i).map(s=>l`<button
                class="keep-chip ${s.minutes===a.minutes?"on":""}"
                role="radio"
                aria-checked=${s.minutes===a.minutes}
                @click=${()=>this._keep={...a,minutes:s.minutes}}
              >
                ${s.label}
              </button>`)}
          </div>
          <button
            class="keep-start primary"
            @click=${async()=>{let s={...a.action.message,keep_minutes:a.minutes,...ha(e,a.target)};await this._call(s)&&r()}}
          >
            ${o(i,a.action.label)}
          </button>
          <button class="off-keep" @click=${r}>${o(i,"keep_hot.cancel")}</button>
        </div>
      </div>
    `}_renderHeatNowTarget(e,a,i){let r=this._language,s=pa(i,r),c=(d,m,p)=>l`<button
        class="step"
        aria-label=${o(r,m)}
        ?disabled=${d===null}
        @click=${()=>{d!==null&&(this._keep={...a,target:d})}}
      >
        ${p}
      </button>`;return l`<div class="off-title" id="target-title">${o(r,"heat_now_target.title")}</div>
      <div class="target-value" role="group" aria-labelledby="target-title">
        ${c(s.down,"heat_now_target.down","\u2212")}
        <span class="value" aria-live="polite">${s.shown}</span>
        ${c(s.up,"heat_now_target.up","+")}
      </div>
      <p>${ga(e,r)}</p>`}_renderSwitchOff(e){let a=this._language,i=wa(e,this._context),r=()=>this._offOpen=!1;return l`
      <div class="off-overlay">
        <div
          class="off-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="off-title"
          @keydown=${s=>{s.key==="Escape"&&r()}}
        >
          <div class="off-title" id="off-title">${i.title}</div>
          ${i.lines.map(s=>l`<p>${s}</p>`)}
          <button
            class="off-confirm"
            @click=${async()=>{await this._call({type:fa})&&r()}}
          >
            ${o(a,"switch_off.confirm")}
          </button>
          <button class="off-keep" @click=${r}>${o(a,"switch_off.keep")}</button>
        </div>
      </div>
    `}_renderTabs(e){if(!e.week)return u;let a=i=>l`<button
      class="tab ${this._tab===i?"on":""}"
      role="tab"
      aria-selected=${this._tab===i}
      @click=${()=>this._tab=i}
    >
      ${o(this._language,`tabs.${i}`)}
    </button>`;return l`<div class="tabs" role="tablist">${a("people")}${a("week")}</div>`}_renderWeek(e){let a=this._language,i=this._focus;return l`
      <div class="week">
        <div class="totals">
          <div><b>${e.showers}</b><span>${o(a,"week.showers")}</span></div>
          <div><b>${e.windows}</b><span>${o(a,"week.windows")}</span></div>
          <div><b>${e.busiest||"-"}</b><span>${o(a,"week.busiest")}</span></div>
        </div>
        <div class="grid">
          <span></span>
          ${e.days.map(r=>l`<span class="head ${r.today?"is-today":""}">${r.label}</span>`)}
          ${e.rows.map(r=>l`
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
              ${r.cells.map((s,c)=>l`<div
                  class="cell ${e.days[c]?.today?"is-today":""} ${i&&i!==r.id?"dim":""}"
                >
                  ${s.times.map(d=>l`<span
                      class="tag ${s.away?"away":""}"
                      style=${s.away?"":`background: var(--${r.colour}-color, var(--primary-color))`}
                      >${d}</span
                    >`)}
                </div>`)}
            `)}
          <span class="heating-label">${o(a,"week.heating")}</span>
          <div class="hours">
            ${e.hours.map(r=>l`<span class="hint" style="top: ${(r.at*100).toFixed(1)}%">${r.label}</span>`)}
          </div>
          ${e.days.map(r=>l`<div class="bar ${r.today?"is-today":""}">
              ${r.bars.map(s=>l`<span
                    class="heat"
                    style="top: ${(s.from*100).toFixed(1)}%; height: max(3px, ${(s.length*100).toFixed(1)}%)"
                  ></span>`)}
            </div>`)}
        </div>
        <div class="hint">${jt(a,this._hour24)}</div>
      </div>
    `}_renderSettings(e){let a=this._language,i=this._settingsOpen?ka(e,this._context):void 0;if(!i)return u;let r=s=>this._call({type:Oe,...s});return l`
      <div class="sheet settings" role="dialog" aria-label=${o(a,"settings.open")}>
        <div class="sheet-head">
          <div class="sheet-title">${o(a,"settings.open")}</div>
          <button class="secondary" @click=${()=>this._settingsOpen=!1}>
            ${o(a,"settings.close")}
          </button>
        </div>
        ${this._renderStepper(i.target,`${i.target.shown} \xB0C`,o(a,"settings.target"),o(a,"settings.target_hint"),["settings.target_down","settings.target_up"],s=>r({target:s}))}
        ${this._renderStepper(i.margin,`\xB1 ${i.margin.shown}`,o(a,"settings.margin"),i.band,["settings.margin_down","settings.margin_up"],s=>r({margin:s}))}
        <label class="setting">
          <span class="setting-text">
            <span>${o(a,"settings.automatic")}</span>
            <span class="hint">${o(a,"settings.automatic_hint")}</span>
          </span>
          <input
            type="checkbox"
            class="switch"
            .checked=${z(i.automatic)}
            @change=${s=>r({automatic:s.target.checked})}
          />
        </label>
        <div class="setting column">
          <span>${o(a,"settings.switch_off")}</span>
          <div class="people" role="group" aria-label=${o(a,"settings.switch_off")}>
            <span class="hint">${o(a,"settings.switch_off_hint")}</span>
            ${i.people.length===0?l`<span class="hint">${o(a,"settings.no_people")}</span>`:u}
            ${i.people.map(s=>l`<label class="person">
                <input
                  type="checkbox"
                  .checked=${z(s.on)}
                  @change=${c=>{let d=c.target.checked;r({switch_off_people:Ca(i.people,s.id,d)})}}
                />
                ${s.name}
              </label>`)}
            <span class="hint">${o(a,"settings.own_cancel")}</span>
          </div>
        </div>
        ${this._renderRate(e)}
        ${this._renderSolar(i)}
        <button
          class="link"
          @click=${()=>{this._openIntegration()}}
        >
          ${o(a,"settings.more")}</button>
      </div>
    `}_renderStepper(e,a,i,r,s,c){let d=(m,p,h)=>l`<button
      class="step"
      aria-label=${o(this._language,p)}
      ?disabled=${m===null}
      @click=${()=>m===null?void 0:c(m)}
    >
      ${h}
    </button>`;return l`<div class="setting">
      <span class="setting-text"><span>${i}</span><span class="hint">${r}</span></span>
      ${d(e.down,s[0],"\u2212")}
      <span class="value">${a}</span>
      ${d(e.up,s[1],"+")}
    </div>`}_setRate(e){window.clearTimeout(this._rateTimer),this._call({type:Oe,rate:e}).then(a=>{a||(this._rateDraft=void 0)})}_stepRate(e){this._rateDraft=e,window.clearTimeout(this._rateTimer),this._rateTimer=window.setTimeout(()=>{this._setRate(e)},ya)}async _recalculate(){let e=this._heater;if(!this.hass||!e||this._recalc.busy)return;let a=this._language;this._recalc={busy:!0,line:""};try{let i=await this.hass.callWS({type:ba,entry_id:e.entry_id}),r=i.learned===null?o(a,"rate.found_too_few",{count:i.runs,needed:e.settings?.rate.min_runs??3}):o(a,"rate.found",{count:i.runs,rate:new Intl.NumberFormat(v(a),{maximumFractionDigits:1}).format(i.learned)});this._recalc={busy:!1,line:r}}catch(i){let r=(i instanceof Error,i.message);this._recalc={busy:!1,line:o(a,"card.error",{message:r??String(i)})}}}_renderRate(e){let a=this._language,i=xa(e,this._context);if(!i)return u;let r=this._rateDraft,s=r===void 0?i.stepper:De(r,a),c=(p,h)=>l`<button
      class=${p===i.fixed?"mode on":"mode"}
      aria-pressed=${p===i.fixed}
      @click=${()=>{p!==i.fixed&&this._setRate(p?i.used:null)}}
    >
      ${o(a,h)}
    </button>`,d=(p,h,_)=>l`<button
      class="step"
      aria-label=${o(a,h)}
      ?disabled=${p===null}
      @click=${()=>{p!==null&&this._stepRate(p)}}
    >
      ${_}
    </button>`,m=r===void 0?i.suggestion:null;return l`<div class="setting column rate">
      <div class="rate-head">
        <span>${o(a,"rate.title")}</span>
        <div class="modes" role="group" aria-label=${o(a,"rate.title")}>
          ${c(!1,"rate.automatic")}${c(!0,"rate.fixed")}
        </div>
      </div>
      ${i.fixed?l`<div class="rate-value">
            ${d(s.down,"rate.down","\u2212")}
            <span class="value">${s.shown}</span>
            ${d(s.up,"rate.up","+")}
            <span class="hint">${o(a,"rate.unit")}</span>
          </div>`:l`<div class="rate-value">
            <span class="rate-big">${i.shown}</span>
            <span class="hint">${o(a,"rate.unit")}</span>
          </div>`}
      <span class="hint">${i.source}</span>
      ${m?l`<div class="rate-suggestion">
            <span class="hint">${m.line}</span>
            <button
              class="link"
              @click=${()=>{this._setRate(m.value)}}
            >
              ${o(a,"rate.use")}
            </button>
          </div>`:u}
      ${i.runs.length?l`<div class="rate-runs" role="list" aria-label=${o(a,"rate.runs")}>
            ${i.runs.map(p=>l`<span class="rate-run" role="listitem"><span class="hint">${p.when}</span><b>${p.rate}</b></span>`)}
          </div>`:u}
      ${i.example?l`<span class="hint">${i.example}</span>`:u}
      ${i.physics?l`<span class="hint">${i.physics}</span>`:u}
      ${i.check?l`<span class=${i.check.warn?"hint rate-warn":"hint"} role=${i.check.warn?"alert":u}
            >${i.check.line}</span
          >`:u}
      <button
        class="recalc secondary"
        ?disabled=${this._recalc.busy}
        @click=${()=>{this._recalculate()}}
      >
        ${o(a,this._recalc.busy?"rate.recalculating":"rate.recalculate")}
      </button>
      ${this._recalc.line?l`<span class="hint" role="status">${this._recalc.line}</span>`:u}
    </div>`}_renderSolar(e){let a=this._language;return l`<div class="setting column solar">
      <span>${o(a,"solar.title")}</span>
      <span class="hint">${e.solar}</span>
      ${e.notes.map(i=>l`<span class="hint">${i}</span>`)}
    </div>`}_renderAvatars(e,a){if(!Dt(e))return u;let i=K(e)==="admin";return l`
      <div class="avatars" role="tablist">
        ${Yt(e,a?.id).map(r=>l`
            <button
              class="avatar ${r.selected?"selected":""} ${r.faded?"faded":""}"
              role="tab"
              aria-selected=${r.selected}
              @click=${()=>{this._selected=r.id,this._sheet=void 0}}
            >
              <span class="dot" style="background: var(--${r.colour}-color, var(--primary-color))"
                >${r.initial}${r.star?l`<span class="star">★</span>`:u}</span
              >
              <span class="label">${r.name}</span>
            </button>
          `)}
        ${i?l`<button
              class="avatar add-member"
              @click=${()=>{this._openIntegration()}}
            >
              <span class="dot plus">+</span>
              <span class="label">${o(this._language,"members.add")}</span>
            </button>`:u}
      </div>
    `}_renderList(e){let a=this._language,i=Jt(e,a,this._hour24);return l`
      <div class="list ${e.away.on?"paused-list":""}">
        ${i.length===0?l`<div class="empty">${o(a,"list.empty")}</div>`:u}
        ${i.map(r=>l`
            <div class="row ${r.enabled?"":"off"}">
              ${e.can_edit?l`<button
                    class="row-text"
                    aria-label=${o(a,"list.edit")}
                    @click=${()=>{this._sheet=It(e,r.id),this._clock=void 0}}
                  >
                    ${this._rowText(r)}
                  </button>`:l`<div class="row-text">${this._rowText(r)}</div>`}
              ${e.can_edit?l`
                    <input
                      type="checkbox"
                      class="switch"
                      aria-label=${o(a,"list.switch")}
                      .checked=${z(r.enabled)}
                      @change=${s=>this._call({type:"hot_water_ready/ready_time/update",member_id:e.id,ready_time_id:r.id,enabled:s.target.checked})}
                    />
                  `:u}
            </div>
          `)}
        ${e.can_edit?l`<button
              class="add"
              @click=${()=>{this._sheet=Vt(),this._clock=Pe(this._sheet.time,!0,this._hour24)}}
            >
              + ${o(a,"list.add")}
            </button>`:u}
      </div>
    `}_rowText(e){return l`<div class="time">${e.time}</div>
      <div class="days">
        ${e.days.map(a=>l`<span class="${a.on?"on":""}">${a.letter}</span>`)}
      </div>`}_renderSheet(e,a){let i=this._language,r=le(i),s=o(i,a.id?"sheet.edit_title":"sheet.title"),c=d=>{let m=a.weekdays.includes(d)?a.weekdays.filter(p=>p!==d):[...a.weekdays,d];this._sheet={...a,weekdays:m}};return l`
      <div class="sheet" role="dialog" aria-label=${s}>
        <div class="sheet-title">${s}</div>
        <div class="field">
          ${o(i,"sheet.time")}
          <button
            class="sheet-time"
            aria-label=${o(i,"clock.change")}
            @click=${()=>this._clock=Pe(a.time,!1,this._hour24)}
          >
            ${pe(a.time,i,this._hour24)}
          </button>
        </div>
        <div class="field">
          ${o(i,"sheet.days")}
          <div class="day-toggles">
            ${r.map((d,m)=>l`<button
                  class="day ${a.weekdays.includes(m)?"on":""}"
                  aria-pressed=${a.weekdays.includes(m)}
                  @click=${()=>{c(m)}}
                >
                  ${d}
                </button>`)}
          </div>
        </div>
        <div class="actions">
          ${a.id?l`<button class="remove" @click=${()=>this._remove(e,a.id??"")}>
                ${o(i,"sheet.delete")}
              </button>`:u}
          <button class="secondary" @click=${()=>this._sheet=void 0}>${o(i,"sheet.cancel")}</button>
          <button class="primary" ?disabled=${!He(a)} @click=${()=>this._save(e)}>
            ${o(i,"sheet.save")}
          </button>
        </div>
      </div>
    `}_dialAt(e,a){let i=e.currentTarget.getBoundingClientRect(),r=b/i.width;return Ft(a,(e.clientX-i.left)*r,(e.clientY-i.top)*r,this._hour24)}_clockDone(e){let a=qe(e,this._hour24);!a||!this._sheet||(this._sheet={...this._sheet,time:a},this._clock=void 0)}_clockCancel(e){e.fresh&&(this._sheet=void 0),this._clock=void 0}_renderClockInput(e,a,i){let r=o(this._language,a==="hour"?"sheet.hour":"sheet.minute");return l`<label class="clock-box">
      <input
        class="clock-input ${i?"":"invalid"}"
        inputmode="numeric"
        maxlength="2"
        autocomplete="off"
        aria-label=${r}
        .value=${z(a==="hour"?e.hourText:e.minuteText)}
        @input=${s=>{let c=s.target.value;this._clock=a==="hour"?{...e,hourText:c}:{...e,minuteText:c}}}
        @keydown=${s=>{s.key==="Enter"&&this._clockDone(e)}}
      />
      <span>${r}</span>
    </label>`}_renderClock(e){let a=this._language,i=this._hour24,r=e.mode==="keys",s=qe(e,i)!==void 0,c=o(a,r?"clock.title_keys":"clock.title"),d=i?u:l`<div class="clock-half" role="group">
          ${[!1,!0].map(g=>l`<button
                class=${e.hour>=12===g?"on":""}
                aria-pressed=${e.hour>=12===g}
                @click=${()=>this._clock=Gt(e,g)}
              >
                ${o(a,g?"clock.pm":"clock.am")}
              </button>`)}
        </div>`,m=r?l`<div class="clock-head">
            ${this._renderClockInput(e,"hour",s)}
            <span class="clock-colon">:</span>
            ${this._renderClockInput(e,"minute",s)} ${d}
          </div>
          ${s?u:l`<div class="clock-invalid" role="alert">${o(a,"clock.invalid")}</div>`}`:l`<div class="clock-head">
          ${["hour","minute"].map((g,y)=>l`${y?l`<span class="clock-colon">:</span>`:u}
                <button
                  class="clock-part ${e.part===g?"on":""}"
                  aria-pressed=${e.part===g}
                  aria-label=${o(a,g==="hour"?"sheet.hour":"sheet.minute")}
                  @click=${()=>this._clock={...e,part:g}}
                >
                  ${g==="hour"?e.hourText:e.minuteText}
                </button>`)}
          ${d}
        </div>`,p=Bt(e,i),h=b/2,_=r?u:l`<svg
          class="dial"
          viewBox="0 0 ${b} ${b}"
          role="slider"
          tabindex="0"
          aria-label=${o(a,e.part==="hour"?"sheet.hour":"sheet.minute")}
          aria-valuenow=${e.part==="hour"?e.hour:e.minute}
          aria-valuetext=${e.part==="hour"?e.hourText:e.minuteText}
          @pointerdown=${g=>{g.currentTarget.setPointerCapture(g.pointerId),this._clock=this._dialAt(g,e)}}
          @pointermove=${g=>{g.currentTarget.hasPointerCapture(g.pointerId)&&(this._clock=this._dialAt(g,this._clock??e))}}
          @pointerup=${()=>{this._clock?.part==="hour"&&(this._clock={...this._clock,part:"minute"})}}
          @keydown=${g=>{let y={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1}[g.key];y!==void 0&&(g.preventDefault(),this._clock=Kt(e,y,i))}}
        >
          <circle class="dial-face" cx=${h} cy=${h} r=${h} />
          <line class="dial-hand" x1=${h} y1=${h} x2=${p.x} y2=${p.y} />
          <circle class="dial-hand-dot" cx=${h} cy=${h} r="4" />
          <circle class="dial-knob" cx=${p.x} cy=${p.y} r="20" />
          ${Wt(e.part,i).map(g=>W`<text class="dial-mark ${Ut(e,g,i)?"on":""}" x=${g.x} y=${g.y}>${g.label}</text>`)}
        </svg>`;return l`
      <div
        class="clock-overlay"
        @click=${g=>{g.target===g.currentTarget&&this._clockCancel(e)}}
      >
        <div class="clock-dialog" role="dialog" aria-modal="true" aria-label=${c}>
          <div class="clock-title">${c}</div>
          ${m} ${_}
          <div class="clock-actions">
            <button
              class="clock-mode"
              aria-label=${o(a,r?"clock.to_dial":"clock.to_keys")}
              title=${o(a,r?"clock.to_dial":"clock.to_keys")}
              @click=${()=>this._clock=Qt(e,i)}
            >
              ${r?pn:mn}
            </button>
            <button
              class="clock-text"
              @click=${()=>{this._clockCancel(e)}}
            >
              ${o(a,"sheet.cancel")}
            </button>
            <button
              class="clock-text"
              ?disabled=${!s}
              @click=${()=>{this._clockDone(e)}}
            >
              ${o(a,"clock.ok")}
            </button>
          </div>
        </div>
      </div>
    `}static{this.styles=ge`
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
    ha-card.tappable {
      cursor: pointer;
    }
    ha-card.tappable:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    /* The compact card needs no room under the ring for buttons. */
    .compact .top {
      padding: 8px 16px 8px 8px;
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
    .list-name {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .member-settings-button {
      border: 0;
      background: none;
      padding: 0 4px;
      font-size: 16px;
      min-width: 32px;
      min-height: 32px;
      color: var(--secondary-text-color);
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
    .target-value {
      display: flex;
      align-items: center;
      gap: 10px;
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
  `}},Ie=class extends ${constructor(){super(...arguments);this._heaters=[];this._asked=!1}static{this.properties={hass:{attribute:!1},_config:{state:!0},_heaters:{state:!0}}}setConfig(e){this._config=e}updated(){this.hass&&!this._asked&&(this._asked=!0,ce(this.hass).then(e=>this._heaters=e))}get _language(){return this.hass?.locale?.language??this.hass?.language??"en"}render(){if(!this.hass||!this._config)return u;let e=this._language,a=[{name:"entry_id",selector:{select:{mode:"dropdown",options:this._heaters.map(r=>({value:r.entry_id,label:r.name}))}}},{name:"compact",selector:{boolean:{}}},...this._config.compact?[{name:"tap_action",selector:{ui_action:{actions:[...qt]}}}]:[]],i={entry_id:"editor.heater",compact:"editor.compact",tap_action:"editor.tap_action"};return l`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${a}
      .computeLabel=${r=>{let s=i[r.name];return s?o(e,s):r.name}}
      @value-changed=${r=>{this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:Pt(r.detail.value)},bubbles:!0,composed:!0}))}}
    ></ha-form>`}};customElements.get(Ne)||customElements.define(Ne,Ie);if(!customElements.get(Z)){customElements.define(Z,Ve);let n=window;n.customCards=n.customCards??[],n.customCards.push({type:Z,name:"Hot Water Ready",description:"Water temperature, ready times and heat now.",preview:!0})}export{Ve as HotWaterReadyCard,Ie as HotWaterReadyCardEditor};
