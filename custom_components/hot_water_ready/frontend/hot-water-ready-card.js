var O=globalThis,L=O.ShadowRoot&&(O.ShadyCSS===void 0||O.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),le=new WeakMap,E=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(L&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=le.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&le.set(t,e))}return e}toString(){return this.cssText}},de=r=>new E(typeof r=="string"?r:r+"",void 0,W),B=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((i,s,n)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new E(t,r,W)},ce=(r,e)=>{if(L)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=O.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,r.appendChild(i)}},F=L?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return de(t)})(r):r;var{is:Ie,defineProperty:ze,getOwnPropertyDescriptor:Ve,getOwnPropertyNames:je,getOwnPropertySymbols:We,getPrototypeOf:Be}=Object,D=globalThis,he=D.trustedTypes,Fe=he?he.emptyScript:"",Ze=D.reactiveElementPolyfillSupport,k=(r,e)=>r,Z={toAttribute(r,e){switch(e){case Boolean:r=r?Fe:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},ue=(r,e)=>!Ie(r,e),pe={attribute:!0,type:String,converter:Z,reflect:!1,useDefault:!1,hasChanged:ue};Symbol.metadata??=Symbol("metadata"),D.litPropertyMetadata??=new WeakMap;var f=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=pe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&ze(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:n}=Ve(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:s,set(a){let c=s?.call(this);n?.call(this,a),this.requestUpdate(e,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??pe}static _$Ei(){if(this.hasOwnProperty(k("elementProperties")))return;let e=Be(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(k("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k("properties"))){let t=this.properties,i=[...je(t),...We(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(F(s))}else e!==void 0&&t.push(F(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ce(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:Z).toAttribute(t,i.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let n=i.getPropertyOptions(s),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Z;this._$Em=s;let c=a.fromAttribute(t,n.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(e,t,i,s=!1,n){if(e!==void 0){let a=this.constructor;if(s===!1&&(n=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??ue)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:n},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),n!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,n]of i){let{wrapped:a}=n,c=this[s];a!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,n,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[k("elementProperties")]=new Map,f[k("finalized")]=new Map,Ze?.({ReactiveElement:f}),(D.reactiveElementVersions??=[]).push("2.1.2");var X=globalThis,ge=r=>r,I=X.trustedTypes,me=I?I.createPolicy("lit-html",{createHTML:r=>r}):void 0,we="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,be="?"+_,qe=`<${be}>`,b=document,T=()=>b.createComment(""),M=r=>r===null||typeof r!="object"&&typeof r!="function",ee=Array.isArray,Ke=r=>ee(r)||typeof r?.[Symbol.iterator]=="function",q=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,fe=/-->/g,ye=/>/g,$=RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_e=/'/g,ve=/"/g,xe=/^(?:script|style|textarea|title)$/i,te=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),h=te(1),Ae=te(2),ct=te(3),x=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),$e=new WeakMap,w=b.createTreeWalker(b,129);function Se(r,e){if(!ee(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return me!==void 0?me.createHTML(e):e}var Ge=(r,e)=>{let t=r.length-1,i=[],s,n=e===2?"<svg>":e===3?"<math>":"",a=H;for(let c=0;c<t;c++){let o=r[c],u,g,p=-1,m=0;for(;m<o.length&&(a.lastIndex=m,g=a.exec(o),g!==null);)m=a.lastIndex,a===H?g[1]==="!--"?a=fe:g[1]!==void 0?a=ye:g[2]!==void 0?(xe.test(g[2])&&(s=RegExp("</"+g[2],"g")),a=$):g[3]!==void 0&&(a=$):a===$?g[0]===">"?(a=s??H,p=-1):g[1]===void 0?p=-2:(p=a.lastIndex-g[2].length,u=g[1],a=g[3]===void 0?$:g[3]==='"'?ve:_e):a===ve||a===_e?a=$:a===fe||a===ye?a=H:(a=$,s=void 0);let y=a===$&&r[c+1].startsWith("/>")?" ":"";n+=a===H?o+qe:p>=0?(i.push(u),o.slice(0,p)+we+o.slice(p)+_+y):o+_+(p===-2?c:y)}return[Se(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},P=class r{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let n=0,a=0,c=e.length-1,o=this.parts,[u,g]=Ge(e,t);if(this.el=r.createElement(u,i),w.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=w.nextNode())!==null&&o.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(let p of s.getAttributeNames())if(p.endsWith(we)){let m=g[a++],y=s.getAttribute(p).split(_),N=/([.?@])?(.*)/.exec(m);o.push({type:1,index:n,name:N[2],strings:y,ctor:N[1]==="."?G:N[1]==="?"?J:N[1]==="@"?Q:S}),s.removeAttribute(p)}else p.startsWith(_)&&(o.push({type:6,index:n}),s.removeAttribute(p));if(xe.test(s.tagName)){let p=s.textContent.split(_),m=p.length-1;if(m>0){s.textContent=I?I.emptyScript:"";for(let y=0;y<m;y++)s.append(p[y],T()),w.nextNode(),o.push({type:2,index:++n});s.append(p[m],T())}}}else if(s.nodeType===8)if(s.data===be)o.push({type:2,index:n});else{let p=-1;for(;(p=s.data.indexOf(_,p+1))!==-1;)o.push({type:7,index:n}),p+=_.length-1}n++}}static createElement(e,t){let i=b.createElement("template");return i.innerHTML=e,i}};function A(r,e,t=r,i){if(e===x)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,n=M(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=A(r,s._$AS(r,e.values),s,i)),e}var K=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??b).importNode(t,!0);w.currentNode=s;let n=w.nextNode(),a=0,c=0,o=i[0];for(;o!==void 0;){if(a===o.index){let u;o.type===2?u=new R(n,n.nextSibling,this,e):o.type===1?u=new o.ctor(n,o.name,o.strings,this,e):o.type===6&&(u=new Y(n,this,e)),this._$AV.push(u),o=i[++c]}a!==o?.index&&(n=w.nextNode(),a++)}return w.currentNode=b,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},R=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=A(this,e,t),M(e)?e===l||e==null||e===""?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==x&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ke(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&M(this._$AH)?this._$AA.nextSibling.data=e:this.T(b.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=P.createElement(Se(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let n=new K(s,this),a=n.u(this.options);n.p(t),this.T(a),this._$AH=n}}_$AC(e){let t=$e.get(e.strings);return t===void 0&&$e.set(e.strings,t=new P(e)),t}k(e){ee(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let n of e)s===t.length?t.push(i=new r(this.O(T()),this.O(T()),this,this.options)):i=t[s],i._$AI(n),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=ge(e).nextSibling;ge(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,n){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=l}_$AI(e,t=this,i,s){let n=this.strings,a=!1;if(n===void 0)e=A(this,e,t,0),a=!M(e)||e!==this._$AH&&e!==x,a&&(this._$AH=e);else{let c=e,o,u;for(e=n[0],o=0;o<n.length-1;o++)u=A(this,c[i+o],t,o),u===x&&(u=this._$AH[o]),a||=!M(u)||u!==this._$AH[o],u===l?e=l:e!==l&&(e+=(u??"")+n[o+1]),this._$AH[o]=u}a&&!s&&this.j(e)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},G=class extends S{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}},J=class extends S{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}},Q=class extends S{constructor(e,t,i,s,n){super(e,t,i,s,n),this.type=5}_$AI(e,t=this){if((e=A(this,e,t,0)??l)===x)return;let i=this._$AH,s=e===l&&i!==l||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==l&&(i===l||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Y=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){A(this,e)}};var Je=X.litHtmlPolyfillSupport;Je?.(P,R),(X.litHtmlVersions??=[]).push("3.3.3");var Ce=(r,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let n=t?.renderBefore??null;i._$litPart$=s=new R(e.insertBefore(T(),n),n,void 0,t??{})}return s._$AI(r),s};var ie=globalThis,v=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ce(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};v._$litElement$=!0,v.finalized=!0,ie.litElementHydrateSupport?.({LitElement:v});var Qe=ie.litElementPolyfillSupport;Qe?.({LitElement:v});(ie.litElementVersions??=[]).push("4.2.2");var Ye={"status.waiting":"Waiting","status.heating":"Heating","status.ready":"Ready","status.fault":"Fault","status.manual":"Manual","headline.heating_for":"Heating: ready in about {minutes} min","headline.ready_at":"Ready at {when}","subline.next_at":"Next at {when}","when.today":"{time}","when.tomorrow":"{time} tomorrow","when.weekday":"{time} on {weekday}","ring.target":"target {target} \xB0C","weekday.letters":"M,T,W,T,F,S,S","members.none":"No members yet. An administrator adds them in the integration's settings.","list.empty":"No ready times yet.","list.add":"Add a ready time","list.remove":"Remove","list.switch":"On or off","sheet.title":"New ready time","sheet.time":"Time","sheet.days":"Days","sheet.save":"Save","sheet.cancel":"Cancel",greeting:"Hello, {name}","today.label":"House today","today.nobody":"Nobody else today","away.label":"Away","away.until_label":"Until (optional)","away.line":"Away","away.line_until":"Away until {date}","members.add":"Member","card.no_heater":"No Hot Water Ready heater is set up yet.","card.loading":"Loading\u2026","card.error":"That did not work: {message}"},Xe={"status.waiting":"Em espera","status.heating":"A aquecer","status.ready":"Pronta","status.fault":"Avaria","status.manual":"Manual","headline.heating_for":"A aquecer: pronta em cerca de {minutes} min","headline.ready_at":"Pronta \xE0s {when}","subline.next_at":"Pr\xF3xima \xE0s {when}","when.today":"{time}","when.tomorrow":"{time} de amanh\xE3","when.weekday":"{time} de {weekday}","ring.target":"alvo {target} \xB0C","weekday.letters":"S,T,Q,Q,S,S,D","members.none":"Ainda n\xE3o h\xE1 membros. Um administrador acrescenta-os nas defini\xE7\xF5es da integra\xE7\xE3o.","list.empty":"Ainda n\xE3o h\xE1 hor\xE1rios.","list.add":"Acrescentar um hor\xE1rio","list.remove":"Remover","list.switch":"Ligar ou desligar","sheet.title":"Novo hor\xE1rio","sheet.time":"Hora","sheet.days":"Dias","sheet.save":"Guardar","sheet.cancel":"Cancelar",greeting:"Ol\xE1, {name}","today.label":"Casa hoje","today.nobody":"Ningu\xE9m mais hoje","away.label":"Ausente","away.until_label":"At\xE9 (opcional)","away.line":"Ausente","away.line_until":"Ausente at\xE9 {date}","members.add":"Membro","card.no_heater":"Ainda n\xE3o h\xE1 nenhum aquecedor do Hot Water Ready configurado.","card.loading":"A carregar\u2026","card.error":"N\xE3o foi poss\xEDvel: {message}"},et={en:Ye,pt:Xe};function z(r){return r?.toLowerCase().startsWith("pt")?"pt":"en"}function C(r){return z(r)==="pt"?"pt-PT":"en-GB"}function V(r){return d(r,"weekday.letters").split(",")}function d(r,e,t={}){return et[z(r)][e].replace(/\{(\w+)\}/g,(s,n)=>String(t[n]??s))}function se(r){return r.callWS({type:"hot_water_ready/heaters"})}var j=class{constructor(e,t){this.onSnapshot=e;this.onMissing=t;this.generation=0}async follow(e,t){let i=this.generation,s=t;if(s===void 0){if(this.defaultEntryId??=se(e).then(a=>a[0]?.entry_id),s=await this.defaultEntryId,i!==this.generation)return;if(s===void 0){this.defaultEntryId=void 0,this.onMissing();return}}if(s===this.entryId)return;this.stop();let n=this.generation;this.entryId=s,this.stopSubscription=e.connection.subscribeMessage(a=>{n===this.generation&&this.onSnapshot(a)},{type:"hot_water_ready/subscribe",entry_id:s}),this.stopSubscription.catch(()=>{n===this.generation&&(this.entryId=void 0,this.onMissing())})}stop(){this.generation++;let e=this.stopSubscription;this.stopSubscription=void 0,this.entryId=void 0,e?.then(t=>t()).catch(()=>{})}};function Ee(r,e,t){return new Intl.NumberFormat(C(e),{maximumFractionDigits:t}).format(r)}function re(r,e){return new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(r)}function tt(r){let e=new Date(`${r}T12:00:00Z`);return e.setUTCDate(e.getUTCDate()+1),e.toISOString().slice(0,10)}function ke(r,e){let{language:t,timeZone:i,now:s}=e,n=new Date(r),a=new Intl.DateTimeFormat(C(t),{timeZone:i,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(n),c=re(s,i);if(re(n,i)===c)return d(t,"when.today",{time:a});if(re(n,i)===tt(c))return d(t,"when.tomorrow",{time:a});let o=new Intl.DateTimeFormat(C(t),{timeZone:i,weekday:"long"}).format(n);return d(t,"when.weekday",{time:a,weekday:o})}function it(r,e){let{language:t}=e;return r.status==="heating"&&r.ready_in_minutes!==null?d(t,"headline.heating_for",{minutes:r.ready_in_minutes}):r.status==="waiting"&&r.next_ready?d(t,"headline.ready_at",{when:ke(r.next_ready.at,e)}):d(t,`status.${r.status}`)}function He(r,e){let{language:t}=e,{temperature:i,target:s}=r,n=r.status==="ready"&&r.next_ready?d(t,"subline.next_at",{when:ke(r.next_ready.at,e)}):"";return{temperature:i===null?"\u2013":`${Ee(i,t,1)}\xB0`,target:d(t,"ring.target",{target:Ee(s,t,1)}),headline:it(r,e),subline:n,fill:i===null||s<=0?0:Math.min(1,Math.max(0,i/s)),tone:r.status}}function Te(r,e){let t=e??r.me;return r.members.find(i=>i.id===t)??r.members[0]}function Me(r){return r.members.length>1}function ne(r){return r.time!==""&&r.weekdays.length>0}function Pe(r,e){let t=V(e);return[...r.ready_times].sort((i,s)=>i.time.localeCompare(s.time)||i.id.localeCompare(s.id)).map(i=>({id:i.id,time:i.time,enabled:i.enabled,days:t.map((s,n)=>({letter:s,on:i.weekdays.includes(n)}))}))}function Re(r){return r.is_admin?"admin":r.me?"member":"viewer"}function Ue(r,e){return r.members.map(t=>({id:t.id,name:t.name,initial:t.name.slice(0,1).toLocaleUpperCase(),colour:t.colour,star:t.virtual,faded:t.away.on,selected:t.id===e}))}function Ne(r,e){let t=r.members.find(i=>i.id===r.me);return t?d(e,"greeting",{name:t.name}):""}function st(r,e){return new Intl.DateTimeFormat(C(e.language),{timeZone:e.timeZone,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(r))}function Oe(r,e,t){let i=new Map(r.members.map(n=>[n.id,n.name])),s=r.today.filter(n=>n.member!==t);return s.length===0?d(e.language,"today.nobody"):s.map(n=>`${i.get(n.member)??"?"} ${st(n.at,e)}`).join(" \xB7 ")}function rt(r,e){let t=new Date(`${r}T12:00:00Z`),i=C(e),s=new Intl.DateTimeFormat(i,{timeZone:"UTC",day:"numeric"}).format(t),n=new Intl.DateTimeFormat(i,{timeZone:"UTC",month:"long"}).format(t);return z(e)==="pt"?`${s} de ${n.slice(0,1).toLocaleUpperCase("pt-PT")}${n.slice(1)}`:`${s} ${n}`}function Le(r,e){return r.away.on?r.away.until?d(e.language,"away.line_until",{date:rt(r.away.until,e.language)}):d(e.language,"away.line"):""}var U="hot-water-ready-card",ae=38,De=2*Math.PI*ae,nt=[0,1,2,3,4,5,6],oe=class extends v{constructor(){super(...arguments);this._missing=!1;this._error="";this._subscription=new j(t=>{this._heater=t,this._missing=!1},()=>{this._missing=!0})}static{this.properties={hass:{attribute:!1},_config:{state:!0},_heater:{state:!0},_missing:{state:!0},_selected:{state:!0},_sheet:{state:!0},_error:{state:!0}}}static async getStubConfig(t){let i=(await se(t))[0];return i?{type:`custom:${U}`,entry_id:i.entry_id}:{type:`custom:${U}`}}setConfig(t){this._config=t}getCardSize(){return 6}get _language(){return this.hass?.locale?.language??this.hass?.language??"en"}get _context(){return{language:this._language,timeZone:this.hass?.config?.time_zone??Intl.DateTimeFormat().resolvedOptions().timeZone,now:new Date}}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._subscription.stop()}updated(t){(t.has("hass")||t.has("_config"))&&this._follow()}_follow(){this.hass&&this._config&&this.isConnected&&this._subscription.follow(this.hass,this._config.entry_id)}async _call(t){if(!this.hass||!this._heater)return!1;this._error="";try{return await this.hass.callWS({entry_id:this._heater.entry_id,...t}),!0}catch(i){let s=(i instanceof Error,i.message);return this._error=d(this._language,"card.error",{message:s??String(i)}),!1}}async _save(t){let i=this._sheet;if(!i||!ne(i))return;await this._call({type:"hot_water_ready/ready_time/add",member_id:t.id,time:i.time,weekdays:[...i.weekdays].sort()})&&(this._sheet=void 0)}render(){let t=this._language;if(this._missing)return h`<ha-card><div class="message">${d(t,"card.no_heater")}</div></ha-card>`;let i=this._heater;if(!i)return h`<ha-card><div class="message">${d(t,"card.loading")}</div></ha-card>`;let s=Re(i),n=Te(i,s==="member"?void 0:this._selected);return h`
      <ha-card>
        ${this._renderTop(i)}
        ${s==="member"?h`<div class="greeting">${Ne(i,t)}</div>`:this._renderAvatars(i,n,s==="admin")}
        ${n?this._renderList(n):h`<div class="message">${d(t,"members.none")}</div>`}
        ${n&&this._sheet?this._renderSheet(n,this._sheet):l}
        ${n?this._renderAway(n):l}
        ${s==="member"&&n?this._renderToday(i,n):l}
        ${this._error?h`<div class="error" role="alert">${this._error}</div>`:l}
      </ha-card>
    `}_renderAway(t){let i=this._language,s=Le(t,this._context);if(!t.can_edit)return s?h`<div class="away-line">${s}</div>`:l;let n=(a,c)=>this._call({type:"hot_water_ready/away/set",member_id:t.id,away:a,until:c});return h`
      <div class="away">
        <label class="away-toggle">
          <input
            type="checkbox"
            class="switch"
            .checked=${t.away.on}
            @change=${a=>{n(a.target.checked,null)}}
          />
          ${s||d(i,"away.label")}
        </label>
        ${t.away.on?h`<label class="until">
              ${d(i,"away.until_label")}
              <input
                type="date"
                .value=${t.away.until??""}
                @change=${a=>{n(!0,a.target.value||null)}}
              />
            </label>`:l}
      </div>
    `}_renderToday(t,i){return h`<div class="today">
      <span class="today-label">${d(this._language,"today.label")}</span>
      ${Oe(t,this._context,i.id)}
    </div>`}_openMembers(){history.pushState(null,"","/config/integrations/integration/hot_water_ready"),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_renderTop(t){let i=He(t,this._context);return h`
      <div class="top">
        <svg class="ring" viewBox="0 0 92 92" role="img" aria-label="${i.temperature} ${i.target}">
          <circle class="track" cx="46" cy="46" r=${ae}></circle>
          ${i.fill>0?Ae`<circle class="fill ${i.tone}" cx="46" cy="46" r=${ae}
                stroke-dasharray="${i.fill*De} ${De}"
                transform="rotate(-90 46 46)"></circle>`:l}
          <text class="temperature" x="46" y="44">${i.temperature}</text>
          <text class="target" x="46" y="61">${i.target}</text>
        </svg>
        <div class="text">
          <div class="name">${t.name}</div>
          <div class="headline ${i.tone}">${i.headline}</div>
          ${i.subline?h`<div class="subline">${i.subline}</div>`:l}
        </div>
      </div>
    `}_renderAvatars(t,i,s){return!s&&!Me(t)?l:h`
      <div class="avatars" role="tablist">
        ${Ue(t,i?.id).map(n=>h`
            <button
              class="avatar ${n.selected?"selected":""} ${n.faded?"faded":""}"
              role="tab"
              aria-selected=${n.selected}
              @click=${()=>{this._selected=n.id,this._sheet=void 0}}
            >
              <span class="dot" style="background: var(--${n.colour}-color, var(--primary-color))"
                >${n.initial}${n.star?h`<span class="star">★</span>`:l}</span
              >
              <span class="label">${n.name}</span>
            </button>
          `)}
        ${s?h`<button
              class="avatar add-member"
              @click=${()=>{this._openMembers()}}
            >
              <span class="dot plus">+</span>
              <span class="label">${d(this._language,"members.add")}</span>
            </button>`:l}
      </div>
    `}_renderList(t){let i=this._language,s=Pe(t,i);return h`
      <div class="list">
        ${s.length===0?h`<div class="empty">${d(i,"list.empty")}</div>`:l}
        ${s.map(n=>h`
            <div class="row ${n.enabled?"":"off"}">
              <div class="time">${n.time}</div>
              <div class="days">
                ${n.days.map(a=>h`<span class="${a.on?"on":""}">${a.letter}</span>`)}
              </div>
              ${t.can_edit?h`
                    <input
                      type="checkbox"
                      class="switch"
                      aria-label=${d(i,"list.switch")}
                      .checked=${n.enabled}
                      @change=${a=>this._call({type:"hot_water_ready/ready_time/update",member_id:t.id,ready_time_id:n.id,enabled:a.target.checked})}
                    />
                    <button
                      class="remove"
                      aria-label=${d(i,"list.remove")}
                      @click=${()=>this._call({type:"hot_water_ready/ready_time/remove",member_id:t.id,ready_time_id:n.id})}
                    >
                      ×
                    </button>
                  `:l}
            </div>
          `)}
        ${t.can_edit?h`<button class="add" @click=${()=>this._sheet={time:"07:00",weekdays:[...nt]}}>
              + ${d(i,"list.add")}
            </button>`:l}
      </div>
    `}_renderSheet(t,i){let s=this._language,n=V(s),a=c=>{let o=i.weekdays.includes(c)?i.weekdays.filter(u=>u!==c):[...i.weekdays,c];this._sheet={...i,weekdays:o}};return h`
      <div class="sheet" role="dialog" aria-label=${d(s,"sheet.title")}>
        <div class="sheet-title">${d(s,"sheet.title")}</div>
        <label class="field">
          ${d(s,"sheet.time")}
          <input
            type="time"
            .value=${i.time}
            @input=${c=>{this._sheet={...i,time:c.target.value}}}
          />
        </label>
        <div class="field">
          ${d(s,"sheet.days")}
          <div class="day-toggles">
            ${n.map((c,o)=>h`<button
                  class="day ${i.weekdays.includes(o)?"on":""}"
                  aria-pressed=${i.weekdays.includes(o)}
                  @click=${()=>{a(o)}}
                >
                  ${c}
                </button>`)}
          </div>
        </div>
        <div class="actions">
          <button class="secondary" @click=${()=>this._sheet=void 0}>${d(s,"sheet.cancel")}</button>
          <button class="primary" ?disabled=${!ne(i)} @click=${()=>this._save(t)}>
            ${d(s,"sheet.save")}
          </button>
        </div>
      </div>
    `}static{this.styles=B`
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
      font-size: 11px;
      fill: var(--secondary-text-color);
    }
    .text {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
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
  `}};if(!customElements.get(U)){customElements.define(U,oe);let r=window;r.customCards=r.customCards??[],r.customCards.push({type:U,name:"Hot Water Ready",description:"Water temperature, ready times and heat now.",preview:!0})}export{oe as HotWaterReadyCard};
