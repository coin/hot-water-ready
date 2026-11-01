var U=globalThis,O=U.ShadowRoot&&(U.ShadyCSS===void 0||U.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,j=Symbol(),oe=new WeakMap,E=class{constructor(e,s,t){if(this._$cssResult$=!0,t!==j)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=s}get styleSheet(){let e=this.o,s=this.t;if(O&&e===void 0){let t=s!==void 0&&s.length===1;t&&(e=oe.get(s)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&oe.set(s,e))}return e}toString(){return this.cssText}},ae=r=>new E(typeof r=="string"?r:r+"",void 0,j),B=(r,...e)=>{let s=r.length===1?r[0]:e.reduce((t,i,n)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new E(s,r,j)},de=(r,e)=>{if(O)r.adoptedStyleSheets=e.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(let s of e){let t=document.createElement("style"),i=U.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=s.cssText,r.appendChild(t)}},q=O?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let s="";for(let t of e.cssRules)s+=t.cssText;return ae(s)})(r):r;var{is:Me,defineProperty:Re,getOwnPropertyDescriptor:Ne,getOwnPropertyNames:Ue,getOwnPropertySymbols:Oe,getPrototypeOf:Ie}=Object,I=globalThis,le=I.trustedTypes,Le=le?le.emptyScript:"",De=I.reactiveElementPolyfillSupport,C=(r,e)=>r,F={toAttribute(r,e){switch(e){case Boolean:r=r?Le:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let s=r;switch(e){case Boolean:s=r!==null;break;case Number:s=r===null?null:Number(r);break;case Object:case Array:try{s=JSON.parse(r)}catch{s=null}}return s}},ce=(r,e)=>!Me(r,e),he={attribute:!0,type:String,converter:F,reflect:!1,useDefault:!1,hasChanged:ce};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;var f=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,s=he){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(e,s),!s.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(e,t,s);i!==void 0&&Re(this.prototype,e,i)}}static getPropertyDescriptor(e,s,t){let{get:i,set:n}=Ne(this.prototype,e)??{get(){return this[s]},set(o){this[s]=o}};return{get:i,set(o){let d=i?.call(this);n?.call(this,o),this.requestUpdate(e,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??he}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;let e=Ie(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){let s=this.properties,t=[...Ue(s),...Oe(s)];for(let i of t)this.createProperty(i,s[i])}let e=this[Symbol.metadata];if(e!==null){let s=litPropertyMetadata.get(e);if(s!==void 0)for(let[t,i]of s)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[s,t]of this.elementProperties){let i=this._$Eu(s,t);i!==void 0&&this._$Eh.set(i,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let s=[];if(Array.isArray(e)){let t=new Set(e.flat(1/0).reverse());for(let i of t)s.unshift(q(i))}else e!==void 0&&s.push(q(e));return s}static _$Eu(e,s){let t=s.attribute;return t===!1?void 0:typeof t=="string"?t:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,s=this.constructor.elementProperties;for(let t of s.keys())this.hasOwnProperty(t)&&(e.set(t,this[t]),delete this[t]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return de(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,s,t){this._$AK(e,t)}_$ET(e,s){let t=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,t);if(i!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:F).toAttribute(s,t.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,s){let t=this.constructor,i=t._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=t.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:F;this._$Em=i;let d=o.fromAttribute(s,n.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(e,s,t,i=!1,n){if(e!==void 0){let o=this.constructor;if(i===!1&&(n=this[e]),t??=o.getPropertyOptions(e),!((t.hasChanged??ce)(n,s)||t.useDefault&&t.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,t))))return;this.C(e,s,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,s,{useDefault:t,reflect:i,wrapped:n},o){t&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??s??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||t||(s=void 0),this._$AL.set(e,s)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,n]of t){let{wrapped:o}=n,d=this[i];o!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,n,d)}}let e=!1,s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(s)}willUpdate(e){}_$AE(e){this._$EO?.forEach(s=>s.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(s=>this._$ET(s,this[s])),this._$EM()}updated(e){}firstUpdated(e){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[C("elementProperties")]=new Map,f[C("finalized")]=new Map,De?.({ReactiveElement:f}),(I.reactiveElementVersions??=[]).push("2.1.2");var X=globalThis,pe=r=>r,L=X.trustedTypes,ue=L?L.createPolicy("lit-html",{createHTML:r=>r}):void 0,ve="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,$e="?"+_,ze=`<${$e}>`,w=document,H=()=>w.createComment(""),P=r=>r===null||typeof r!="object"&&typeof r!="function",ee=Array.isArray,Ve=r=>ee(r)||typeof r?.[Symbol.iterator]=="function",K=`[ 	
\f\r]`,k=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,me=/-->/g,ge=/>/g,$=RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),fe=/'/g,ye=/"/g,xe=/^(?:script|style|textarea|title)$/i,te=r=>(e,...s)=>({_$litType$:r,strings:e,values:s}),u=te(1),we=te(2),et=te(3),b=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),_e=new WeakMap,x=w.createTreeWalker(w,129);function be(r,e){if(!ee(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ue!==void 0?ue.createHTML(e):e}var We=(r,e)=>{let s=r.length-1,t=[],i,n=e===2?"<svg>":e===3?"<math>":"",o=k;for(let d=0;d<s;d++){let a=r[d],p,m,c=-1,g=0;for(;g<a.length&&(o.lastIndex=g,m=o.exec(a),m!==null);)g=o.lastIndex,o===k?m[1]==="!--"?o=me:m[1]!==void 0?o=ge:m[2]!==void 0?(xe.test(m[2])&&(i=RegExp("</"+m[2],"g")),o=$):m[3]!==void 0&&(o=$):o===$?m[0]===">"?(o=i??k,c=-1):m[1]===void 0?c=-2:(c=o.lastIndex-m[2].length,p=m[1],o=m[3]===void 0?$:m[3]==='"'?ye:fe):o===ye||o===fe?o=$:o===me||o===ge?o=k:(o=$,i=void 0);let y=o===$&&r[d+1].startsWith("/>")?" ":"";n+=o===k?a+ze:c>=0?(t.push(p),a.slice(0,c)+ve+a.slice(c)+_+y):a+_+(c===-2?d:y)}return[be(r,n+(r[s]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),t]},T=class r{constructor({strings:e,_$litType$:s},t){let i;this.parts=[];let n=0,o=0,d=e.length-1,a=this.parts,[p,m]=We(e,s);if(this.el=r.createElement(p,t),x.currentNode=this.el.content,s===2||s===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=x.nextNode())!==null&&a.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(ve)){let g=m[o++],y=i.getAttribute(c).split(_),N=/([.?@])?(.*)/.exec(g);a.push({type:1,index:n,name:N[2],strings:y,ctor:N[1]==="."?Z:N[1]==="?"?J:N[1]==="@"?Q:S}),i.removeAttribute(c)}else c.startsWith(_)&&(a.push({type:6,index:n}),i.removeAttribute(c));if(xe.test(i.tagName)){let c=i.textContent.split(_),g=c.length-1;if(g>0){i.textContent=L?L.emptyScript:"";for(let y=0;y<g;y++)i.append(c[y],H()),x.nextNode(),a.push({type:2,index:++n});i.append(c[g],H())}}}else if(i.nodeType===8)if(i.data===$e)a.push({type:2,index:n});else{let c=-1;for(;(c=i.data.indexOf(_,c+1))!==-1;)a.push({type:7,index:n}),c+=_.length-1}n++}}static createElement(e,s){let t=w.createElement("template");return t.innerHTML=e,t}};function A(r,e,s=r,t){if(e===b)return e;let i=t!==void 0?s._$Co?.[t]:s._$Cl,n=P(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,s,t)),t!==void 0?(s._$Co??=[])[t]=i:s._$Cl=i),i!==void 0&&(e=A(r,i._$AS(r,e.values),i,t)),e}var G=class{constructor(e,s){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:s},parts:t}=this._$AD,i=(e?.creationScope??w).importNode(s,!0);x.currentNode=i;let n=x.nextNode(),o=0,d=0,a=t[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new M(n,n.nextSibling,this,e):a.type===1?p=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(p=new Y(n,this,e)),this._$AV.push(p),a=t[++d]}o!==a?.index&&(n=x.nextNode(),o++)}return x.currentNode=w,i}p(e){let s=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(e,t,s),s+=t.strings.length-2):t._$AI(e[s])),s++}},M=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,s,t,i){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=s,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,s=this._$AM;return s!==void 0&&e?.nodeType===11&&(e=s.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,s=this){e=A(this,e,s),P(e)?e===l||e==null||e===""?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==b&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ve(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(w.createTextNode(e)),this._$AH=e}$(e){let{values:s,_$litType$:t}=e,i=typeof t=="number"?this._$AC(e):(t.el===void 0&&(t.el=T.createElement(be(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(s);else{let n=new G(i,this),o=n.u(this.options);n.p(s),this.T(o),this._$AH=n}}_$AC(e){let s=_e.get(e.strings);return s===void 0&&_e.set(e.strings,s=new T(e)),s}k(e){ee(this._$AH)||(this._$AH=[],this._$AR());let s=this._$AH,t,i=0;for(let n of e)i===s.length?s.push(t=new r(this.O(H()),this.O(H()),this,this.options)):t=s[i],t._$AI(n),i++;i<s.length&&(this._$AR(t&&t._$AB.nextSibling,i),s.length=i)}_$AR(e=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);e!==this._$AB;){let t=pe(e).nextSibling;pe(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,s,t,i,n){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=s,this._$AM=i,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=l}_$AI(e,s=this,t,i){let n=this.strings,o=!1;if(n===void 0)e=A(this,e,s,0),o=!P(e)||e!==this._$AH&&e!==b,o&&(this._$AH=e);else{let d=e,a,p;for(e=n[0],a=0;a<n.length-1;a++)p=A(this,d[t+a],s,a),p===b&&(p=this._$AH[a]),o||=!P(p)||p!==this._$AH[a],p===l?e=l:e!==l&&(e+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!i&&this.j(e)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Z=class extends S{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}},J=class extends S{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}},Q=class extends S{constructor(e,s,t,i,n){super(e,s,t,i,n),this.type=5}_$AI(e,s=this){if((e=A(this,e,s,0)??l)===b)return;let t=this._$AH,i=e===l&&t!==l||e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive,n=e!==l&&(t===l||i);i&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Y=class{constructor(e,s,t){this.element=e,this.type=6,this._$AN=void 0,this._$AM=s,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(e){A(this,e)}};var je=X.litHtmlPolyfillSupport;je?.(T,M),(X.litHtmlVersions??=[]).push("3.3.3");var Ae=(r,e,s)=>{let t=s?.renderBefore??e,i=t._$litPart$;if(i===void 0){let n=s?.renderBefore??null;t._$litPart$=i=new M(e.insertBefore(H(),n),n,void 0,s??{})}return i._$AI(r),i};var se=globalThis,v=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ae(s,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return b}};v._$litElement$=!0,v.finalized=!0,se.litElementHydrateSupport?.({LitElement:v});var Be=se.litElementPolyfillSupport;Be?.({LitElement:v});(se.litElementVersions??=[]).push("4.2.2");var qe={"status.waiting":"Waiting","status.heating":"Heating","status.ready":"Ready","status.fault":"Fault","status.manual":"Manual","headline.heating_for":"Heating: ready in about {minutes} min","headline.ready_at":"Ready at {when}","subline.next_at":"Next at {when}","when.today":"{time}","when.tomorrow":"{time} tomorrow","when.weekday":"{time} on {weekday}","ring.target":"target {target} \xB0C","weekday.letters":"M,T,W,T,F,S,S","members.none":"No members yet. An administrator adds them in the integration's settings.","list.empty":"No ready times yet.","list.add":"Add a ready time","list.remove":"Remove","list.switch":"On or off","sheet.title":"New ready time","sheet.time":"Time","sheet.days":"Days","sheet.save":"Save","sheet.cancel":"Cancel","card.no_heater":"No Hot Water Ready heater is set up yet.","card.loading":"Loading\u2026","card.error":"That did not work: {message}"},Fe={"status.waiting":"Em espera","status.heating":"A aquecer","status.ready":"Pronta","status.fault":"Avaria","status.manual":"Manual","headline.heating_for":"A aquecer: pronta em cerca de {minutes} min","headline.ready_at":"Pronta \xE0s {when}","subline.next_at":"Pr\xF3xima \xE0s {when}","when.today":"{time}","when.tomorrow":"{time} de amanh\xE3","when.weekday":"{time} de {weekday}","ring.target":"alvo {target} \xB0C","weekday.letters":"S,T,Q,Q,S,S,D","members.none":"Ainda n\xE3o h\xE1 membros. Um administrador acrescenta-os nas defini\xE7\xF5es da integra\xE7\xE3o.","list.empty":"Ainda n\xE3o h\xE1 hor\xE1rios.","list.add":"Acrescentar um hor\xE1rio","list.remove":"Remover","list.switch":"Ligar ou desligar","sheet.title":"Novo hor\xE1rio","sheet.time":"Hora","sheet.days":"Dias","sheet.save":"Guardar","sheet.cancel":"Cancelar","card.no_heater":"Ainda n\xE3o h\xE1 nenhum aquecedor do Hot Water Ready configurado.","card.loading":"A carregar\u2026","card.error":"N\xE3o foi poss\xEDvel: {message}"},Ke={en:qe,pt:Fe};function Se(r){return r?.toLowerCase().startsWith("pt")?"pt":"en"}function D(r){return Se(r)==="pt"?"pt-PT":"en-GB"}function z(r){return h(r,"weekday.letters").split(",")}function h(r,e,s={}){return Ke[Se(r)][e].replace(/\{(\w+)\}/g,(i,n)=>String(s[n]??i))}function ie(r){return r.callWS({type:"hot_water_ready/heaters"})}var V=class{constructor(e,s){this.onSnapshot=e;this.onMissing=s;this.generation=0}async follow(e,s){let t=this.generation,i=s;if(i===void 0){if(this.defaultEntryId??=ie(e).then(o=>o[0]?.entry_id),i=await this.defaultEntryId,t!==this.generation)return;if(i===void 0){this.defaultEntryId=void 0,this.onMissing();return}}if(i===this.entryId)return;this.stop();let n=this.generation;this.entryId=i,this.stopSubscription=e.connection.subscribeMessage(o=>{n===this.generation&&this.onSnapshot(o)},{type:"hot_water_ready/subscribe",entry_id:i}),this.stopSubscription.catch(()=>{n===this.generation&&(this.entryId=void 0,this.onMissing())})}stop(){this.generation++;let e=this.stopSubscription;this.stopSubscription=void 0,this.entryId=void 0,e?.then(s=>s()).catch(()=>{})}};function Ee(r,e,s){return new Intl.NumberFormat(D(e),{maximumFractionDigits:s}).format(r)}function W(r,e){return new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(r)}function Ce(r,e){let{language:s,timeZone:t,now:i}=e,n=new Date(r),o=new Intl.DateTimeFormat(D(s),{timeZone:t,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(n),d=new Date(i.getTime()+1440*60*1e3);if(W(n,t)===W(i,t))return h(s,"when.today",{time:o});if(W(n,t)===W(d,t))return h(s,"when.tomorrow",{time:o});let a=new Intl.DateTimeFormat(D(s),{timeZone:t,weekday:"long"}).format(n);return h(s,"when.weekday",{time:o,weekday:a})}function Ge(r,e){let{language:s}=e;return r.status==="heating"&&r.ready_in_minutes!==null?h(s,"headline.heating_for",{minutes:r.ready_in_minutes}):r.status==="waiting"&&r.next_ready?h(s,"headline.ready_at",{when:Ce(r.next_ready.at,e)}):h(s,`status.${r.status}`)}function ke(r,e){let{language:s}=e,{temperature:t,target:i}=r,n=r.status==="ready"&&r.next_ready?h(s,"subline.next_at",{when:Ce(r.next_ready.at,e)}):"";return{temperature:t===null?"\u2013":`${Ee(t,s,1)}\xB0`,target:h(s,"ring.target",{target:Ee(i,s,1)}),headline:Ge(r,e),subline:n,fill:t===null||i<=0?0:Math.min(1,Math.max(0,t/i)),tone:r.status}}function He(r){return r.me??r.members[0]?.id}function Pe(r,e){let s=z(e);return[...r.ready_times].sort((t,i)=>t.time.localeCompare(i.time)||t.id.localeCompare(i.id)).map(t=>({id:t.id,time:t.time,enabled:t.enabled,days:s.map((i,n)=>({letter:i,on:t.weekdays.includes(n)}))}))}var R="hot-water-ready-card",re=38,Te=2*Math.PI*re,Ze=[0,1,2,3,4,5,6],ne=class extends v{constructor(){super(...arguments);this._missing=!1;this._error="";this._subscription=new V(s=>{this._heater=s,this._missing=!1},()=>{this._missing=!0})}static{this.properties={hass:{attribute:!1},_config:{state:!0},_heater:{state:!0},_missing:{state:!0},_selected:{state:!0},_sheet:{state:!0},_error:{state:!0}}}static async getStubConfig(s){let t=(await ie(s))[0];return t?{type:`custom:${R}`,entry_id:t.entry_id}:{type:`custom:${R}`}}setConfig(s){this._config=s}getCardSize(){return 6}get _language(){return this.hass?.locale?.language??this.hass?.language??"en"}get _context(){return{language:this._language,timeZone:this.hass?.config?.time_zone??Intl.DateTimeFormat().resolvedOptions().timeZone,now:new Date}}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._subscription.stop()}updated(s){(s.has("hass")||s.has("_config"))&&this._follow()}_follow(){this.hass&&this._config&&this.isConnected&&this._subscription.follow(this.hass,this._config.entry_id)}_member(s){let t=this._selected??He(s);return s.members.find(i=>i.id===t)??s.members[0]}async _call(s){if(!(!this.hass||!this._heater)){this._error="";try{await this.hass.callWS({entry_id:this._heater.entry_id,...s})}catch(t){let i=(t instanceof Error,t.message);this._error=h(this._language,"card.error",{message:i??String(t)})}}}async _save(s){let t=this._sheet;!t||!t.time||t.weekdays.length===0||(this._sheet=void 0,await this._call({type:"hot_water_ready/ready_time/add",member_id:s.id,time:t.time,weekdays:[...t.weekdays].sort()}))}render(){let s=this._language;if(this._missing)return u`<ha-card><div class="message">${h(s,"card.no_heater")}</div></ha-card>`;let t=this._heater;if(!t)return u`<ha-card><div class="message">${h(s,"card.loading")}</div></ha-card>`;let i=this._member(t);return u`
      <ha-card>
        ${this._renderTop(t)} ${this._renderAvatars(t,i)}
        ${i?this._renderList(i):u`<div class="message">${h(s,"members.none")}</div>`}
        ${this._error?u`<div class="error" role="alert">${this._error}</div>`:l}
        ${i&&this._sheet?this._renderSheet(i,this._sheet):l}
      </ha-card>
    `}_renderTop(s){let t=ke(s,this._context);return u`
      <div class="top">
        <svg class="ring" viewBox="0 0 92 92" role="img" aria-label="${t.temperature} ${t.target}">
          <circle class="track" cx="46" cy="46" r=${re}></circle>
          ${t.fill>0?we`<circle class="fill ${t.tone}" cx="46" cy="46" r=${re}
                stroke-dasharray="${t.fill*Te} ${Te}"
                transform="rotate(-90 46 46)"></circle>`:l}
          <text class="temperature" x="46" y="44">${t.temperature}</text>
          <text class="target" x="46" y="61">${t.target}</text>
        </svg>
        <div class="text">
          <div class="name">${s.name}</div>
          <div class="headline ${t.tone}">${t.headline}</div>
          ${t.subline?u`<div class="subline">${t.subline}</div>`:l}
        </div>
      </div>
    `}_renderAvatars(s,t){return s.members.length<2?l:u`
      <div class="avatars" role="tablist">
        ${s.members.map(i=>u`
            <button
              class="avatar ${i.id===t?.id?"selected":""}"
              role="tab"
              aria-selected=${i.id===t?.id}
              @click=${()=>{this._selected=i.id,this._sheet=void 0}}
            >
              <span class="dot" style="background: var(--${i.colour}-color, var(--primary-color))"
                >${i.name.slice(0,1).toUpperCase()}</span
              >
              <span class="label">${i.name}</span>
            </button>
          `)}
      </div>
    `}_renderList(s){let t=this._language,i=Pe(s,t);return u`
      <div class="list">
        ${i.length===0?u`<div class="empty">${h(t,"list.empty")}</div>`:l}
        ${i.map(n=>u`
            <div class="row ${n.enabled?"":"off"}">
              <div class="time">${n.time}</div>
              <div class="days">
                ${n.days.map(o=>u`<span class="${o.on?"on":""}">${o.letter}</span>`)}
              </div>
              ${s.can_edit?u`
                    <input
                      type="checkbox"
                      class="switch"
                      aria-label=${h(t,"list.switch")}
                      .checked=${n.enabled}
                      @change=${o=>this._call({type:"hot_water_ready/ready_time/update",member_id:s.id,ready_time_id:n.id,enabled:o.target.checked})}
                    />
                    <button
                      class="remove"
                      aria-label=${h(t,"list.remove")}
                      @click=${()=>this._call({type:"hot_water_ready/ready_time/remove",member_id:s.id,ready_time_id:n.id})}
                    >
                      ×
                    </button>
                  `:l}
            </div>
          `)}
        ${s.can_edit?u`<button class="add" @click=${()=>this._sheet={time:"07:00",weekdays:[...Ze]}}>
              + ${h(t,"list.add")}
            </button>`:l}
      </div>
    `}_renderSheet(s,t){let i=this._language,n=z(i),o=d=>{let a=t.weekdays.includes(d)?t.weekdays.filter(p=>p!==d):[...t.weekdays,d];this._sheet={...t,weekdays:a}};return u`
      <div class="sheet" role="dialog" aria-label=${h(i,"sheet.title")}>
        <div class="sheet-title">${h(i,"sheet.title")}</div>
        <label class="field">
          ${h(i,"sheet.time")}
          <input
            type="time"
            .value=${t.time}
            @input=${d=>{this._sheet={...t,time:d.target.value}}}
          />
        </label>
        <div class="field">
          ${h(i,"sheet.days")}
          <div class="day-toggles">
            ${n.map((d,a)=>u`<button
                  class="day ${t.weekdays.includes(a)?"on":""}"
                  aria-pressed=${t.weekdays.includes(a)}
                  @click=${()=>{o(a)}}
                >
                  ${d}
                </button>`)}
          </div>
        </div>
        <div class="actions">
          <button class="secondary" @click=${()=>this._sheet=void 0}>${h(i,"sheet.cancel")}</button>
          <button class="primary" ?disabled=${!t.time||t.weekdays.length===0} @click=${()=>this._save(s)}>
            ${h(i,"sheet.save")}
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
  `}};if(!customElements.get(R)){customElements.define(R,ne);let r=window;r.customCards=r.customCards??[],r.customCards.push({type:R,name:"Hot Water Ready",description:"Water temperature, ready times and heat now.",preview:!0})}export{ne as HotWaterReadyCard};
