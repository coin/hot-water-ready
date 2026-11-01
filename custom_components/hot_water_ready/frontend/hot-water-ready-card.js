var N=globalThis,O=N.ShadowRoot&&(N.ShadyCSS===void 0||N.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),ae=new WeakMap,E=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(O&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=ae.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ae.set(t,e))}return e}toString(){return this.cssText}},de=r=>new E(typeof r=="string"?r:r+"",void 0,W),j=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new E(t,r,W)},le=(r,e)=>{if(O)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=N.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},B=O?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return de(t)})(r):r;var{is:Ue,defineProperty:Ne,getOwnPropertyDescriptor:Oe,getOwnPropertyNames:De,getOwnPropertySymbols:Ie,getPrototypeOf:Le}=Object,D=globalThis,he=D.trustedTypes,ze=he?he.emptyScript:"",Ve=D.reactiveElementPolyfillSupport,C=(r,e)=>r,q={toAttribute(r,e){switch(e){case Boolean:r=r?ze:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},pe=(r,e)=>!Ue(r,e),ce={attribute:!0,type:String,converter:q,reflect:!1,useDefault:!1,hasChanged:pe};Symbol.metadata??=Symbol("metadata"),D.litPropertyMetadata??=new WeakMap;var f=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ce){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Ne(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:n}=Oe(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let d=i?.call(this);n?.call(this,o),this.requestUpdate(e,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ce}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;let e=Le(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){let t=this.properties,s=[...De(t),...Ie(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(B(i))}else e!==void 0&&t.push(B(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return le(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:q).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:q;this._$Em=i;let d=o.fromAttribute(t,n.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(e!==void 0){let o=this.constructor;if(i===!1&&(n=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??pe)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,d=this[i];o!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,n,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[C("elementProperties")]=new Map,f[C("finalized")]=new Map,Ve?.({ReactiveElement:f}),(D.reactiveElementVersions??=[]).push("2.1.2");var Y=globalThis,ue=r=>r,I=Y.trustedTypes,me=I?I.createPolicy("lit-html",{createHTML:r=>r}):void 0,$e="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,xe="?"+_,We=`<${xe}>`,w=document,H=()=>w.createComment(""),P=r=>r===null||typeof r!="object"&&typeof r!="function",X=Array.isArray,je=r=>X(r)||typeof r?.[Symbol.iterator]=="function",F=`[ 	
\f\r]`,k=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ge=/-->/g,fe=/>/g,$=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ye=/'/g,_e=/"/g,we=/^(?:script|style|textarea|title)$/i,ee=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),u=ee(1),be=ee(2),it=ee(3),b=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),ve=new WeakMap,x=w.createTreeWalker(w,129);function Ae(r,e){if(!X(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return me!==void 0?me.createHTML(e):e}var Be=(r,e)=>{let t=r.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",o=k;for(let d=0;d<t;d++){let a=r[d],p,m,c=-1,g=0;for(;g<a.length&&(o.lastIndex=g,m=o.exec(a),m!==null);)g=o.lastIndex,o===k?m[1]==="!--"?o=ge:m[1]!==void 0?o=fe:m[2]!==void 0?(we.test(m[2])&&(i=RegExp("</"+m[2],"g")),o=$):m[3]!==void 0&&(o=$):o===$?m[0]===">"?(o=i??k,c=-1):m[1]===void 0?c=-2:(c=o.lastIndex-m[2].length,p=m[1],o=m[3]===void 0?$:m[3]==='"'?_e:ye):o===_e||o===ye?o=$:o===ge||o===fe?o=k:(o=$,i=void 0);let y=o===$&&r[d+1].startsWith("/>")?" ":"";n+=o===k?a+We:c>=0?(s.push(p),a.slice(0,c)+$e+a.slice(c)+_+y):a+_+(c===-2?d:y)}return[Ae(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},T=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,o=0,d=e.length-1,a=this.parts,[p,m]=Be(e,t);if(this.el=r.createElement(p,s),x.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=x.nextNode())!==null&&a.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith($e)){let g=m[o++],y=i.getAttribute(c).split(_),U=/([.?@])?(.*)/.exec(g);a.push({type:1,index:n,name:U[2],strings:y,ctor:U[1]==="."?G:U[1]==="?"?Z:U[1]==="@"?J:S}),i.removeAttribute(c)}else c.startsWith(_)&&(a.push({type:6,index:n}),i.removeAttribute(c));if(we.test(i.tagName)){let c=i.textContent.split(_),g=c.length-1;if(g>0){i.textContent=I?I.emptyScript:"";for(let y=0;y<g;y++)i.append(c[y],H()),x.nextNode(),a.push({type:2,index:++n});i.append(c[g],H())}}}else if(i.nodeType===8)if(i.data===xe)a.push({type:2,index:n});else{let c=-1;for(;(c=i.data.indexOf(_,c+1))!==-1;)a.push({type:7,index:n}),c+=_.length-1}n++}}static createElement(e,t){let s=w.createElement("template");return s.innerHTML=e,s}};function A(r,e,t=r,s){if(e===b)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,n=P(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=A(r,i._$AS(r,e.values),i,s)),e}var K=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??w).importNode(t,!0);x.currentNode=i;let n=x.nextNode(),o=0,d=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new M(n,n.nextSibling,this,e):a.type===1?p=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(p=new Q(n,this,e)),this._$AV.push(p),a=s[++d]}o!==a?.index&&(n=x.nextNode(),o++)}return x.currentNode=w,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},M=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=A(this,e,t),P(e)?e===l||e==null||e===""?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==b&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):je(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(w.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=T.createElement(Ae(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new K(i,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(e){let t=ve.get(e.strings);return t===void 0&&ve.set(e.strings,t=new T(e)),t}k(e){X(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let n of e)i===t.length?t.push(s=new r(this.O(H()),this.O(H()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=ue(e).nextSibling;ue(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=l}_$AI(e,t=this,s,i){let n=this.strings,o=!1;if(n===void 0)e=A(this,e,t,0),o=!P(e)||e!==this._$AH&&e!==b,o&&(this._$AH=e);else{let d=e,a,p;for(e=n[0],a=0;a<n.length-1;a++)p=A(this,d[s+a],t,a),p===b&&(p=this._$AH[a]),o||=!P(p)||p!==this._$AH[a],p===l?e=l:e!==l&&(e+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!i&&this.j(e)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},G=class extends S{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}},Z=class extends S{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}},J=class extends S{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=A(this,e,t,0)??l)===b)return;let s=this._$AH,i=e===l&&s!==l||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==l&&(s===l||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Q=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){A(this,e)}};var qe=Y.litHtmlPolyfillSupport;qe?.(T,M),(Y.litHtmlVersions??=[]).push("3.3.3");var Se=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let n=t?.renderBefore??null;s._$litPart$=i=new M(e.insertBefore(H(),n),n,void 0,t??{})}return i._$AI(r),i};var te=globalThis,v=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Se(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return b}};v._$litElement$=!0,v.finalized=!0,te.litElementHydrateSupport?.({LitElement:v});var Fe=te.litElementPolyfillSupport;Fe?.({LitElement:v});(te.litElementVersions??=[]).push("4.2.2");var Ke={"status.waiting":"Waiting","status.heating":"Heating","status.ready":"Ready","status.fault":"Fault","status.manual":"Manual","headline.heating_for":"Heating: ready in about {minutes} min","headline.ready_at":"Ready at {when}","subline.next_at":"Next at {when}","when.today":"{time}","when.tomorrow":"{time} tomorrow","when.weekday":"{time} on {weekday}","ring.target":"target {target} \xB0C","weekday.letters":"M,T,W,T,F,S,S","members.none":"No members yet. An administrator adds them in the integration's settings.","list.empty":"No ready times yet.","list.add":"Add a ready time","list.remove":"Remove","list.switch":"On or off","sheet.title":"New ready time","sheet.time":"Time","sheet.days":"Days","sheet.save":"Save","sheet.cancel":"Cancel","card.no_heater":"No Hot Water Ready heater is set up yet.","card.loading":"Loading\u2026","card.error":"That did not work: {message}"},Ge={"status.waiting":"Em espera","status.heating":"A aquecer","status.ready":"Pronta","status.fault":"Avaria","status.manual":"Manual","headline.heating_for":"A aquecer: pronta em cerca de {minutes} min","headline.ready_at":"Pronta \xE0s {when}","subline.next_at":"Pr\xF3xima \xE0s {when}","when.today":"{time}","when.tomorrow":"{time} de amanh\xE3","when.weekday":"{time} de {weekday}","ring.target":"alvo {target} \xB0C","weekday.letters":"S,T,Q,Q,S,S,D","members.none":"Ainda n\xE3o h\xE1 membros. Um administrador acrescenta-os nas defini\xE7\xF5es da integra\xE7\xE3o.","list.empty":"Ainda n\xE3o h\xE1 hor\xE1rios.","list.add":"Acrescentar um hor\xE1rio","list.remove":"Remover","list.switch":"Ligar ou desligar","sheet.title":"Novo hor\xE1rio","sheet.time":"Hora","sheet.days":"Dias","sheet.save":"Guardar","sheet.cancel":"Cancelar","card.no_heater":"Ainda n\xE3o h\xE1 nenhum aquecedor do Hot Water Ready configurado.","card.loading":"A carregar\u2026","card.error":"N\xE3o foi poss\xEDvel: {message}"},Ze={en:Ke,pt:Ge};function Ee(r){return r?.toLowerCase().startsWith("pt")?"pt":"en"}function L(r){return Ee(r)==="pt"?"pt-PT":"en-GB"}function z(r){return h(r,"weekday.letters").split(",")}function h(r,e,t={}){return Ze[Ee(r)][e].replace(/\{(\w+)\}/g,(i,n)=>String(t[n]??i))}function se(r){return r.callWS({type:"hot_water_ready/heaters"})}var V=class{constructor(e,t){this.onSnapshot=e;this.onMissing=t;this.generation=0}async follow(e,t){let s=this.generation,i=t;if(i===void 0){if(this.defaultEntryId??=se(e).then(o=>o[0]?.entry_id),i=await this.defaultEntryId,s!==this.generation)return;if(i===void 0){this.defaultEntryId=void 0,this.onMissing();return}}if(i===this.entryId)return;this.stop();let n=this.generation;this.entryId=i,this.stopSubscription=e.connection.subscribeMessage(o=>{n===this.generation&&this.onSnapshot(o)},{type:"hot_water_ready/subscribe",entry_id:i}),this.stopSubscription.catch(()=>{n===this.generation&&(this.entryId=void 0,this.onMissing())})}stop(){this.generation++;let e=this.stopSubscription;this.stopSubscription=void 0,this.entryId=void 0,e?.then(t=>t()).catch(()=>{})}};function Ce(r,e,t){return new Intl.NumberFormat(L(e),{maximumFractionDigits:t}).format(r)}function ie(r,e){return new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(r)}function Je(r){let e=new Date(`${r}T12:00:00Z`);return e.setUTCDate(e.getUTCDate()+1),e.toISOString().slice(0,10)}function ke(r,e){let{language:t,timeZone:s,now:i}=e,n=new Date(r),o=new Intl.DateTimeFormat(L(t),{timeZone:s,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(n),d=ie(i,s);if(ie(n,s)===d)return h(t,"when.today",{time:o});if(ie(n,s)===Je(d))return h(t,"when.tomorrow",{time:o});let a=new Intl.DateTimeFormat(L(t),{timeZone:s,weekday:"long"}).format(n);return h(t,"when.weekday",{time:o,weekday:a})}function Qe(r,e){let{language:t}=e;return r.status==="heating"&&r.ready_in_minutes!==null?h(t,"headline.heating_for",{minutes:r.ready_in_minutes}):r.status==="waiting"&&r.next_ready?h(t,"headline.ready_at",{when:ke(r.next_ready.at,e)}):h(t,`status.${r.status}`)}function He(r,e){let{language:t}=e,{temperature:s,target:i}=r,n=r.status==="ready"&&r.next_ready?h(t,"subline.next_at",{when:ke(r.next_ready.at,e)}):"";return{temperature:s===null?"\u2013":`${Ce(s,t,1)}\xB0`,target:h(t,"ring.target",{target:Ce(i,t,1)}),headline:Qe(r,e),subline:n,fill:s===null||i<=0?0:Math.min(1,Math.max(0,s/i)),tone:r.status}}function Pe(r,e){let t=e??r.me;return r.members.find(s=>s.id===t)??r.members[0]}function Te(r){return r.members.length>1}function re(r){return r.time!==""&&r.weekdays.length>0}function Me(r,e){let t=z(e);return[...r.ready_times].sort((s,i)=>s.time.localeCompare(i.time)||s.id.localeCompare(i.id)).map(s=>({id:s.id,time:s.time,enabled:s.enabled,days:t.map((i,n)=>({letter:i,on:s.weekdays.includes(n)}))}))}var R="hot-water-ready-card",ne=38,Re=2*Math.PI*ne,Ye=[0,1,2,3,4,5,6],oe=class extends v{constructor(){super(...arguments);this._missing=!1;this._error="";this._subscription=new V(t=>{this._heater=t,this._missing=!1},()=>{this._missing=!0})}static{this.properties={hass:{attribute:!1},_config:{state:!0},_heater:{state:!0},_missing:{state:!0},_selected:{state:!0},_sheet:{state:!0},_error:{state:!0}}}static async getStubConfig(t){let s=(await se(t))[0];return s?{type:`custom:${R}`,entry_id:s.entry_id}:{type:`custom:${R}`}}setConfig(t){this._config=t}getCardSize(){return 6}get _language(){return this.hass?.locale?.language??this.hass?.language??"en"}get _context(){return{language:this._language,timeZone:this.hass?.config?.time_zone??Intl.DateTimeFormat().resolvedOptions().timeZone,now:new Date}}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._subscription.stop()}updated(t){(t.has("hass")||t.has("_config"))&&this._follow()}_follow(){this.hass&&this._config&&this.isConnected&&this._subscription.follow(this.hass,this._config.entry_id)}async _call(t){if(!this.hass||!this._heater)return!1;this._error="";try{return await this.hass.callWS({entry_id:this._heater.entry_id,...t}),!0}catch(s){let i=(s instanceof Error,s.message);return this._error=h(this._language,"card.error",{message:i??String(s)}),!1}}async _save(t){let s=this._sheet;if(!s||!re(s))return;await this._call({type:"hot_water_ready/ready_time/add",member_id:t.id,time:s.time,weekdays:[...s.weekdays].sort()})&&(this._sheet=void 0)}render(){let t=this._language;if(this._missing)return u`<ha-card><div class="message">${h(t,"card.no_heater")}</div></ha-card>`;let s=this._heater;if(!s)return u`<ha-card><div class="message">${h(t,"card.loading")}</div></ha-card>`;let i=Pe(s,this._selected);return u`
      <ha-card>
        ${this._renderTop(s)} ${this._renderAvatars(s,i)}
        ${i?this._renderList(i):u`<div class="message">${h(t,"members.none")}</div>`}
        ${this._error?u`<div class="error" role="alert">${this._error}</div>`:l}
        ${i&&this._sheet?this._renderSheet(i,this._sheet):l}
      </ha-card>
    `}_renderTop(t){let s=He(t,this._context);return u`
      <div class="top">
        <svg class="ring" viewBox="0 0 92 92" role="img" aria-label="${s.temperature} ${s.target}">
          <circle class="track" cx="46" cy="46" r=${ne}></circle>
          ${s.fill>0?be`<circle class="fill ${s.tone}" cx="46" cy="46" r=${ne}
                stroke-dasharray="${s.fill*Re} ${Re}"
                transform="rotate(-90 46 46)"></circle>`:l}
          <text class="temperature" x="46" y="44">${s.temperature}</text>
          <text class="target" x="46" y="61">${s.target}</text>
        </svg>
        <div class="text">
          <div class="name">${t.name}</div>
          <div class="headline ${s.tone}">${s.headline}</div>
          ${s.subline?u`<div class="subline">${s.subline}</div>`:l}
        </div>
      </div>
    `}_renderAvatars(t,s){return Te(t)?u`
      <div class="avatars" role="tablist">
        ${t.members.map(i=>u`
            <button
              class="avatar ${i.id===s?.id?"selected":""}"
              role="tab"
              aria-selected=${i.id===s?.id}
              @click=${()=>{this._selected=i.id,this._sheet=void 0}}
            >
              <span class="dot" style="background: var(--${i.colour}-color, var(--primary-color))"
                >${i.name.slice(0,1).toUpperCase()}</span
              >
              <span class="label">${i.name}</span>
            </button>
          `)}
      </div>
    `:l}_renderList(t){let s=this._language,i=Me(t,s);return u`
      <div class="list">
        ${i.length===0?u`<div class="empty">${h(s,"list.empty")}</div>`:l}
        ${i.map(n=>u`
            <div class="row ${n.enabled?"":"off"}">
              <div class="time">${n.time}</div>
              <div class="days">
                ${n.days.map(o=>u`<span class="${o.on?"on":""}">${o.letter}</span>`)}
              </div>
              ${t.can_edit?u`
                    <input
                      type="checkbox"
                      class="switch"
                      aria-label=${h(s,"list.switch")}
                      .checked=${n.enabled}
                      @change=${o=>this._call({type:"hot_water_ready/ready_time/update",member_id:t.id,ready_time_id:n.id,enabled:o.target.checked})}
                    />
                    <button
                      class="remove"
                      aria-label=${h(s,"list.remove")}
                      @click=${()=>this._call({type:"hot_water_ready/ready_time/remove",member_id:t.id,ready_time_id:n.id})}
                    >
                      ×
                    </button>
                  `:l}
            </div>
          `)}
        ${t.can_edit?u`<button class="add" @click=${()=>this._sheet={time:"07:00",weekdays:[...Ye]}}>
              + ${h(s,"list.add")}
            </button>`:l}
      </div>
    `}_renderSheet(t,s){let i=this._language,n=z(i),o=d=>{let a=s.weekdays.includes(d)?s.weekdays.filter(p=>p!==d):[...s.weekdays,d];this._sheet={...s,weekdays:a}};return u`
      <div class="sheet" role="dialog" aria-label=${h(i,"sheet.title")}>
        <div class="sheet-title">${h(i,"sheet.title")}</div>
        <label class="field">
          ${h(i,"sheet.time")}
          <input
            type="time"
            .value=${s.time}
            @input=${d=>{this._sheet={...s,time:d.target.value}}}
          />
        </label>
        <div class="field">
          ${h(i,"sheet.days")}
          <div class="day-toggles">
            ${n.map((d,a)=>u`<button
                  class="day ${s.weekdays.includes(a)?"on":""}"
                  aria-pressed=${s.weekdays.includes(a)}
                  @click=${()=>{o(a)}}
                >
                  ${d}
                </button>`)}
          </div>
        </div>
        <div class="actions">
          <button class="secondary" @click=${()=>this._sheet=void 0}>${h(i,"sheet.cancel")}</button>
          <button class="primary" ?disabled=${!re(s)} @click=${()=>this._save(t)}>
            ${h(i,"sheet.save")}
          </button>
        </div>
      </div>
    `}static{this.styles=j`
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
  `}};if(!customElements.get(R)){customElements.define(R,oe);let r=window;r.customCards=r.customCards??[],r.customCards.push({type:R,name:"Hot Water Ready",description:"Water temperature, ready times and heat now.",preview:!0})}export{oe as HotWaterReadyCard};
