var L=globalThis,D=L.ShadowRoot&&(L.ShadyCSS===void 0||L.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol(),me=new WeakMap,T=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==X)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(D&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=me.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&me.set(t,e))}return e}toString(){return this.cssText}},ge=s=>new T(typeof s=="string"?s:s+"",void 0,X),ee=(s,...e)=>{let t=s.length===1?s[0]:e.reduce((i,r,n)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[n+1],s[0]);return new T(t,s,X)},fe=(s,e)=>{if(D)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),r=L.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=t.cssText,s.appendChild(i)}},te=D?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return ge(t)})(s):s;var{is:Xe,defineProperty:et,getOwnPropertyDescriptor:tt,getOwnPropertyNames:it,getOwnPropertySymbols:st,getPrototypeOf:rt}=Object,V=globalThis,ye=V.trustedTypes,nt=ye?ye.emptyScript:"",at=V.reactiveElementPolyfillSupport,k=(s,e)=>s,ie={toAttribute(s,e){switch(e){case Boolean:s=s?nt:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},ve=(s,e)=>!Xe(s,e),_e={attribute:!0,type:String,converter:ie,reflect:!1,useDefault:!1,hasChanged:ve};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_e){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(e,i,t);r!==void 0&&et(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){let{get:r,set:n}=tt(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:r,set(a){let c=r?.call(this);n?.call(this,a),this.requestUpdate(e,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_e}static _$Ei(){if(this.hasOwnProperty(k("elementProperties")))return;let e=rt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(k("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k("properties"))){let t=this.properties,i=[...it(t),...st(t)];for(let r of i)this.createProperty(r,t[r])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,r]of t)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let r=this._$Eu(t,i);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let r of i)t.unshift(te(r))}else e!==void 0&&t.push(te(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fe(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(r!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:ie).toAttribute(t,i.type);this._$Em=e,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(e,t){let i=this.constructor,r=i._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let n=i.getPropertyOptions(r),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:ie;this._$Em=r;let c=a.fromAttribute(t,n.type);this[r]=c??this._$Ej?.get(r)??c,this._$Em=null}}requestUpdate(e,t,i,r=!1,n){if(e!==void 0){let a=this.constructor;if(r===!1&&(n=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??ve)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:r,wrapped:n},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),n!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,n]of i){let{wrapped:a}=n,c=this[r];a!==!0||this._$AL.has(r)||c===void 0||this.C(r,void 0,n,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[k("elementProperties")]=new Map,y[k("finalized")]=new Map,at?.({ReactiveElement:y}),(V.reactiveElementVersions??=[]).push("2.1.2");var re=globalThis,$e=s=>s,z=re.trustedTypes,we=z?z.createPolicy("lit-html",{createHTML:s=>s}):void 0,ne="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,ae="?"+_,ot=`<${ae}>`,x=document,M=()=>x.createComment(""),P=s=>s===null||typeof s!="object"&&typeof s!="function",oe=Array.isArray,Ce=s=>oe(s)||typeof s?.[Symbol.iterator]=="function",se=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,be=/-->/g,xe=/>/g,w=RegExp(`>|${se}(?:([^\\s"'>=/]+)(${se}*=${se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ae=/'/g,Se=/"/g,Te=/^(?:script|style|textarea|title)$/i,le=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),h=le(1),ke=le(2),xt=le(3),g=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),Ee=new WeakMap,b=x.createTreeWalker(x,129);function He(s,e){if(!oe(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return we!==void 0?we.createHTML(e):e}var Me=(s,e)=>{let t=s.length-1,i=[],r,n=e===2?"<svg>":e===3?"<math>":"",a=H;for(let c=0;c<t;c++){let o=s[c],u,m,p=-1,f=0;for(;f<o.length&&(a.lastIndex=f,m=a.exec(o),m!==null);)f=a.lastIndex,a===H?m[1]==="!--"?a=be:m[1]!==void 0?a=xe:m[2]!==void 0?(Te.test(m[2])&&(r=RegExp("</"+m[2],"g")),a=w):m[3]!==void 0&&(a=w):a===w?m[0]===">"?(a=r??H,p=-1):m[1]===void 0?p=-2:(p=a.lastIndex-m[2].length,u=m[1],a=m[3]===void 0?w:m[3]==='"'?Se:Ae):a===Se||a===Ae?a=w:a===be||a===xe?a=H:(a=w,r=void 0);let v=a===w&&s[c+1].startsWith("/>")?" ":"";n+=a===H?o+ot:p>=0?(i.push(u),o.slice(0,p)+ne+o.slice(p)+_+v):o+_+(p===-2?c:v)}return[He(s,n+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},R=class s{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let n=0,a=0,c=e.length-1,o=this.parts,[u,m]=Me(e,t);if(this.el=s.createElement(u,i),b.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=b.nextNode())!==null&&o.length<c;){if(r.nodeType===1){if(r.hasAttributes())for(let p of r.getAttributeNames())if(p.endsWith(ne)){let f=m[a++],v=r.getAttribute(p).split(_),I=/([.?@])?(.*)/.exec(f);o.push({type:1,index:n,name:I[2],strings:v,ctor:I[1]==="."?j:I[1]==="?"?W:I[1]==="@"?q:S}),r.removeAttribute(p)}else p.startsWith(_)&&(o.push({type:6,index:n}),r.removeAttribute(p));if(Te.test(r.tagName)){let p=r.textContent.split(_),f=p.length-1;if(f>0){r.textContent=z?z.emptyScript:"";for(let v=0;v<f;v++)r.append(p[v],M()),b.nextNode(),o.push({type:2,index:++n});r.append(p[f],M())}}}else if(r.nodeType===8)if(r.data===ae)o.push({type:2,index:n});else{let p=-1;for(;(p=r.data.indexOf(_,p+1))!==-1;)o.push({type:7,index:n}),p+=_.length-1}n++}}static createElement(e,t){let i=x.createElement("template");return i.innerHTML=e,i}};function A(s,e,t=s,i){if(e===g)return e;let r=i!==void 0?t._$Co?.[i]:t._$Cl,n=P(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(s),r._$AT(s,t,i)),i!==void 0?(t._$Co??=[])[i]=r:t._$Cl=r),r!==void 0&&(e=A(s,r._$AS(s,e.values),r,i)),e}var B=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,r=(e?.creationScope??x).importNode(t,!0);b.currentNode=r;let n=b.nextNode(),a=0,c=0,o=i[0];for(;o!==void 0;){if(a===o.index){let u;o.type===2?u=new C(n,n.nextSibling,this,e):o.type===1?u=new o.ctor(n,o.name,o.strings,this,e):o.type===6&&(u=new F(n,this,e)),this._$AV.push(u),o=i[++c]}a!==o?.index&&(n=b.nextNode(),a++)}return b.currentNode=x,r}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},C=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,r){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=A(this,e,t),P(e)?e===l||e==null||e===""?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==g&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ce(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(x.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,r=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=R.createElement(He(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(t);else{let n=new B(r,this),a=n.u(this.options);n.p(t),this.T(a),this._$AH=n}}_$AC(e){let t=Ee.get(e.strings);return t===void 0&&Ee.set(e.strings,t=new R(e)),t}k(e){oe(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,r=0;for(let n of e)r===t.length?t.push(i=new s(this.O(M()),this.O(M()),this,this.options)):i=t[r],i._$AI(n),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=$e(e).nextSibling;$e(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,r,n){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=l}_$AI(e,t=this,i,r){let n=this.strings,a=!1;if(n===void 0)e=A(this,e,t,0),a=!P(e)||e!==this._$AH&&e!==g,a&&(this._$AH=e);else{let c=e,o,u;for(e=n[0],o=0;o<n.length-1;o++)u=A(this,c[i+o],t,o),u===g&&(u=this._$AH[o]),a||=!P(u)||u!==this._$AH[o],u===l?e=l:e!==l&&(e+=(u??"")+n[o+1]),this._$AH[o]=u}a&&!r&&this.j(e)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},j=class extends S{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}},W=class extends S{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}},q=class extends S{constructor(e,t,i,r,n){super(e,t,i,r,n),this.type=5}_$AI(e,t=this){if((e=A(this,e,t,0)??l)===g)return;let i=this._$AH,r=e===l&&i!==l||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==l&&(i===l||r);r&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},F=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){A(this,e)}},Pe={M:ne,P:_,A:ae,C:1,L:Me,R:B,D:Ce,V:A,I:C,H:S,N:W,U:q,B:j,F},lt=re.litHtmlPolyfillSupport;lt?.(R,C),(re.litHtmlVersions??=[]).push("3.3.3");var Re=(s,e,t)=>{let i=t?.renderBefore??e,r=i._$litPart$;if(r===void 0){let n=t?.renderBefore??null;i._$litPart$=r=new C(e.insertBefore(M(),n),n,void 0,t??{})}return r._$AI(s),r};var de=globalThis,$=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Re(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return g}};$._$litElement$=!0,$.finalized=!0,de.litElementHydrateSupport?.({LitElement:$});var dt=de.litElementPolyfillSupport;dt?.({LitElement:$});(de.litElementVersions??=[]).push("4.2.2");var E={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ue=s=>(...e)=>({_$litDirective$:s,values:e}),K=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:Lt}=Pe;var Ne=s=>s.strings===void 0;var ct={},Oe=(s,e=ct)=>s._$AH=e;var Z=Ue(class extends K{constructor(s){if(super(s),s.type!==E.PROPERTY&&s.type!==E.ATTRIBUTE&&s.type!==E.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Ne(s))throw Error("`live` bindings can only contain a single expression")}render(s){return s}update(s,[e]){if(e===g||e===l)return e;let t=s.element,i=s.name;if(s.type===E.PROPERTY){if(e===t[i])return g}else if(s.type===E.BOOLEAN_ATTRIBUTE){if(!!e===t.hasAttribute(i))return g}else if(s.type===E.ATTRIBUTE&&t.getAttribute(i)===e+"")return g;return Oe(s),e}});var ht={"status.waiting":"Waiting","status.heating":"Heating","status.ready":"Ready","status.fault":"Fault","status.manual":"Manual","headline.heating_for":"Heating: ready in about {minutes} min","headline.ready_at":"Ready at {when}","subline.next_at":"Next at {when}","when.today":"{time}","when.tomorrow":"{time} tomorrow","when.weekday":"{time} on {weekday}","ring.target":"target {target} \xB0C","weekday.letters":"M,T,W,T,F,S,S","members.none":"No members yet. An administrator adds them in the integration's settings.","list.empty":"No ready times yet.","list.add":"Add a ready time","list.remove":"Remove","list.switch":"On or off","sheet.title":"New ready time","sheet.time":"Time","sheet.days":"Days","sheet.save":"Save","sheet.cancel":"Cancel","heat_now.start":"Heat now","heat_now.cancel":"Cancel","heat_now.join":"Tell me too",greeting:"Hello, {name}","today.label":"House today","today.nobody":"Nobody else today","away.until_label":"Until (optional)","away.line":"Away","away.line_until":"Away until {date}","members.add":"Member","card.no_heater":"No Hot Water Ready heater is set up yet.","card.loading":"Loading\u2026","card.error":"That did not work: {message}"},pt={"status.waiting":"Em espera","status.heating":"A aquecer","status.ready":"Pronta","status.fault":"Avaria","status.manual":"Manual","headline.heating_for":"A aquecer: pronta em cerca de {minutes} min","headline.ready_at":"Pronta \xE0s {when}","subline.next_at":"Pr\xF3xima \xE0s {when}","when.today":"{time}","when.tomorrow":"{time} de amanh\xE3","when.weekday":"{time} de {weekday}","ring.target":"alvo {target} \xB0C","weekday.letters":"S,T,Q,Q,S,S,D","members.none":"Ainda n\xE3o h\xE1 membros. Um administrador acrescenta-os nas defini\xE7\xF5es da integra\xE7\xE3o.","list.empty":"Ainda n\xE3o h\xE1 hor\xE1rios.","list.add":"Acrescentar um hor\xE1rio","list.remove":"Remover","list.switch":"Ligar ou desligar","sheet.title":"Novo hor\xE1rio","sheet.time":"Hora","sheet.days":"Dias","sheet.save":"Guardar","sheet.cancel":"Cancelar","heat_now.start":"Aquecer agora","heat_now.cancel":"Cancelar","heat_now.join":"Avisar-me tamb\xE9m",greeting:"Ol\xE1, {name}","today.label":"Casa hoje","today.nobody":"Mais ningu\xE9m hoje","away.until_label":"At\xE9 (opcional)","away.line":"Ausente","away.line_until":"Ausente at\xE9 {date}","members.add":"Membro","card.no_heater":"Ainda n\xE3o h\xE1 nenhum aquecedor do Hot Water Ready configurado.","card.loading":"A carregar\u2026","card.error":"N\xE3o foi poss\xEDvel: {message}"},ut={en:ht,pt};function G(s){return s?.toLowerCase().startsWith("pt")?"pt":"en"}function U(s){return G(s)==="pt"?"pt-PT":"en-GB"}function Y(s){return d(s,"weekday.letters").split(",")}function d(s,e,t={}){return ut[G(s)][e].replace(/\{(\w+)\}/g,(r,n)=>String(t[n]??r))}function ce(s){return s.callWS({type:"hot_water_ready/heaters"})}var Q=class{constructor(e,t){this.onSnapshot=e;this.onMissing=t;this.generation=0}async follow(e,t){let i=this.generation,r=t;if(r===void 0){if(this.defaultEntryId??=ce(e).then(a=>a[0]?.entry_id),r=await this.defaultEntryId,i!==this.generation)return;if(r===void 0){this.defaultEntryId=void 0,this.onMissing();return}}if(r===this.entryId)return;this.stop();let n=this.generation;this.entryId=r,this.stopSubscription=e.connection.subscribeMessage(a=>{n===this.generation&&this.onSnapshot(a)},{type:"hot_water_ready/subscribe",entry_id:r}),this.stopSubscription.catch(()=>{n===this.generation&&(this.entryId=void 0,this.onMissing())})}stop(){this.generation++;let e=this.stopSubscription;this.stopSubscription=void 0,this.entryId=void 0,e?.then(t=>t()).catch(()=>{})}};function Ie(s,e,t){return new Intl.NumberFormat(U(e),{maximumFractionDigits:t}).format(s)}function J(s,e){return new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(s)}function mt(s){let e=new Date(`${s}T12:00:00Z`);return e.setUTCDate(e.getUTCDate()+1),e.toISOString().slice(0,10)}function Ve(s,e){let{language:t,timeZone:i,now:r}=e,n=new Date(s),a=Ze(s,e),c=J(r,i);if(J(n,i)===c)return d(t,"when.today",{time:a});if(J(n,i)===mt(c))return d(t,"when.tomorrow",{time:a});let o=new Intl.DateTimeFormat(U(t),{timeZone:i,weekday:"long"}).format(n);return d(t,"when.weekday",{time:a,weekday:o})}function gt(s,e){let{language:t}=e;return s.status==="heating"&&s.ready_in_minutes!==null?d(t,"headline.heating_for",{minutes:s.ready_in_minutes}):s.status==="waiting"&&s.next_ready?d(t,"headline.ready_at",{when:Ve(s.next_ready.at,e)}):d(t,`status.${s.status}`)}function ze(s,e){let{language:t}=e,{temperature:i,target:r}=s,n=s.status==="ready"&&s.next_ready?d(t,"subline.next_at",{when:Ve(s.next_ready.at,e)}):"";return{temperature:i===null?"\u2013":`${Ie(i,t,1)}\xB0`,target:d(t,"ring.target",{target:Ie(r,t,1)}),headline:gt(s,e),subline:n,fill:i===null||r<=0?0:Math.min(1,Math.max(0,i/r)),tone:s.status}}function ft(s,e){let t=e??s.me;return s.members.find(i=>i.id===t)??s.members[0]}function Be(s){let e=N(s);return e==="admin"?!0:e==="viewer"&&s.members.length>1}function je(s,e){return ft(s,N(s)==="member"?void 0:e)}function We(s){return J(s.now,s.timeZone)}function he(s){return s.time!==""&&s.weekdays.length>0}function qe(s,e){let t=Y(e);return[...s.ready_times].sort((i,r)=>i.time.localeCompare(r.time)||i.id.localeCompare(r.id)).map(i=>({id:i.id,time:i.time,enabled:i.enabled,days:t.map((r,n)=>({letter:r,on:i.weekdays.includes(n)}))}))}function N(s){return s.is_admin?"admin":s.me?"member":"viewer"}function Fe(s,e){return s.members.map(t=>({id:t.id,name:t.name,initial:t.name.slice(0,1).toLocaleUpperCase(),colour:t.colour,star:t.virtual,faded:t.away.on,selected:t.id===e}))}function Ke(s,e){let t=s.members.find(i=>i.id===s.me);return t?d(e,"greeting",{name:t.name}):""}function Ze(s,e){return new Intl.DateTimeFormat(U(e.language),{timeZone:e.timeZone,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(s))}function Ge(s,e,t){let i=new Map(s.members.map(n=>[n.id,n.name])),r=s.today.filter(n=>n.member!==t);return r.length===0?d(e.language,"today.nobody"):r.map(n=>`${i.get(n.member)??"?"} ${Ze(n.at,e)}`).join(" \xB7 ")}function yt(s,e){let t=new Date(`${s}T12:00:00Z`),i=U(e),r=new Intl.DateTimeFormat(i,{timeZone:"UTC",day:"numeric"}).format(t),n=new Intl.DateTimeFormat(i,{timeZone:"UTC",month:"long"}).format(t);return G(e)==="pt"?`${r} de ${n.slice(0,1).toLocaleUpperCase("pt-PT")}${n.slice(1)}`:`${r} ${n}`}function Ye(s,e){return s.away.on?s.away.until?d(e.language,"away.line_until",{date:yt(s.away.until,e.language)}):d(e.language,"away.line"):""}var Le="hot_water_ready/heat_now/start",De="hot_water_ready/heat_now/cancel";function Qe(s){let e=s.heat_now;if(!e)return s.can_ask_heat_now?[{command:Le,label:"heat_now.start",primary:!0}]:[];if(e.asked)return[{command:De,label:"heat_now.cancel",primary:!0}];let t=s.can_ask_heat_now?[{command:Le,label:"heat_now.join",primary:!0}]:[];return e.can_cancel&&t.push({command:De,label:"heat_now.cancel",primary:!1}),t}var O="hot-water-ready-card",pe=38,Je=2*Math.PI*pe,_t=[0,1,2,3,4,5,6],ue=class extends ${constructor(){super(...arguments);this._missing=!1;this._error="";this._subscription=new Q(t=>{this._heater=t,this._missing=!1},()=>{this._missing=!0})}static{this.properties={hass:{attribute:!1},_config:{state:!0},_heater:{state:!0},_missing:{state:!0},_selected:{state:!0},_sheet:{state:!0},_error:{state:!0}}}static async getStubConfig(t){let i=(await ce(t))[0];return i?{type:`custom:${O}`,entry_id:i.entry_id}:{type:`custom:${O}`}}setConfig(t){this._config=t}getCardSize(){return 6}get _language(){return this.hass?.locale?.language??this.hass?.language??"en"}get _context(){return{language:this._language,timeZone:this.hass?.config?.time_zone??Intl.DateTimeFormat().resolvedOptions().timeZone,now:new Date}}connectedCallback(){super.connectedCallback(),this._follow()}disconnectedCallback(){super.disconnectedCallback(),this._subscription.stop()}updated(t){(t.has("hass")||t.has("_config"))&&this._follow()}_follow(){this.hass&&this._config&&this.isConnected&&this._subscription.follow(this.hass,this._config.entry_id)}async _call(t){if(!this.hass||!this._heater)return!1;this._error="";try{return await this.hass.callWS({entry_id:this._heater.entry_id,...t}),!0}catch(i){let r=(i instanceof Error,i.message);return this._error=d(this._language,"card.error",{message:r??String(i)}),!1}}async _save(t){let i=this._sheet;if(!i||!he(i))return;await this._call({type:"hot_water_ready/ready_time/add",member_id:t.id,time:i.time,weekdays:[...i.weekdays].sort()})&&(this._sheet=void 0)}render(){let t=this._language;if(this._missing)return h`<ha-card><div class="message">${d(t,"card.no_heater")}</div></ha-card>`;let i=this._heater;if(!i)return h`<ha-card><div class="message">${d(t,"card.loading")}</div></ha-card>`;let r=N(i),n=je(i,this._selected);return h`
      <ha-card>
        ${this._renderTop(i)}
        ${r==="member"?h`<div class="greeting">${Ke(i,t)}</div>`:this._renderAvatars(i,n)}
        ${n?this._renderList(n):h`<div class="message">${d(t,"members.none")}</div>`}
        ${n&&this._sheet?this._renderSheet(n,this._sheet):l}
        ${n?this._renderAway(n):l}
        ${r==="member"&&n?this._renderToday(i,n):l}
        ${this._error?h`<div class="error" role="alert">${this._error}</div>`:l}
      </ha-card>
    `}_renderAway(t){let i=this._language,r=Ye(t,this._context);if(!t.can_edit)return r?h`<div class="away-line">${r}</div>`:l;let n=(a,c)=>this._call({type:"hot_water_ready/away/set",member_id:t.id,away:a,until:c});return h`
      <div class="away">
        <label class="away-toggle">
          <input
            type="checkbox"
            class="switch"
            .checked=${Z(t.away.on)}
            @change=${a=>{n(a.target.checked,null)}}
          />
          ${r||d(i,"away.line")}
        </label>
        ${t.away.on?h`<label class="until">
              ${d(i,"away.until_label")}
              <input
                type="date"
                min=${We(this._context)}
                .value=${Z(t.away.until??"")}
                @change=${a=>{n(!0,a.target.value||null)}}
              />
            </label>`:l}
      </div>
    `}_renderToday(t,i){return h`<div class="today">
      <span class="today-label">${d(this._language,"today.label")}</span>
      ${Ge(t,this._context,i.id)}
    </div>`}_openMembers(){history.pushState(null,"","/config/integrations/integration/hot_water_ready"),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_renderTop(t){let i=ze(t,this._context);return h`
      <div class="top">
        <svg class="ring" viewBox="0 0 92 92" role="img" aria-label="${i.temperature} ${i.target}">
          <circle class="track" cx="46" cy="46" r=${pe}></circle>
          ${i.fill>0?ke`<circle class="fill ${i.tone}" cx="46" cy="46" r=${pe}
                stroke-dasharray="${i.fill*Je} ${Je}"
                transform="rotate(-90 46 46)"></circle>`:l}
          <text class="temperature" x="46" y="44">${i.temperature}</text>
          <text class="target" x="46" y="61">${i.target}</text>
        </svg>
        <div class="text">
          <div class="name">${t.name}</div>
          <div class="headline ${i.tone}">${i.headline}</div>
          ${i.subline?h`<div class="subline">${i.subline}</div>`:l}
          <div class="heat-now">
            ${Qe(t).map(r=>h`<button
                class=${r.primary?"primary":"secondary"}
                @click=${()=>{this._call({type:r.command})}}
              >
                ${d(this._language,r.label)}
              </button>`)}
          </div>
        </div>
      </div>
    `}_renderAvatars(t,i){if(!Be(t))return l;let r=N(t)==="admin";return h`
      <div class="avatars" role="tablist">
        ${Fe(t,i?.id).map(n=>h`
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
        ${r?h`<button
              class="avatar add-member"
              @click=${()=>{this._openMembers()}}
            >
              <span class="dot plus">+</span>
              <span class="label">${d(this._language,"members.add")}</span>
            </button>`:l}
      </div>
    `}_renderList(t){let i=this._language,r=qe(t,i);return h`
      <div class="list">
        ${r.length===0?h`<div class="empty">${d(i,"list.empty")}</div>`:l}
        ${r.map(n=>h`
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
                      .checked=${Z(n.enabled)}
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
        ${t.can_edit?h`<button class="add" @click=${()=>this._sheet={time:"07:00",weekdays:[..._t]}}>
              + ${d(i,"list.add")}
            </button>`:l}
      </div>
    `}_renderSheet(t,i){let r=this._language,n=Y(r),a=c=>{let o=i.weekdays.includes(c)?i.weekdays.filter(u=>u!==c):[...i.weekdays,c];this._sheet={...i,weekdays:o}};return h`
      <div class="sheet" role="dialog" aria-label=${d(r,"sheet.title")}>
        <div class="sheet-title">${d(r,"sheet.title")}</div>
        <label class="field">
          ${d(r,"sheet.time")}
          <input
            type="time"
            .value=${i.time}
            @input=${c=>{this._sheet={...i,time:c.target.value}}}
          />
        </label>
        <div class="field">
          ${d(r,"sheet.days")}
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
          <button class="secondary" @click=${()=>this._sheet=void 0}>${d(r,"sheet.cancel")}</button>
          <button class="primary" ?disabled=${!he(i)} @click=${()=>this._save(t)}>
            ${d(r,"sheet.save")}
          </button>
        </div>
      </div>
    `}static{this.styles=ee`
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
  `}};if(!customElements.get(O)){customElements.define(O,ue);let s=window;s.customCards=s.customCards??[],s.customCards.push({type:O,name:"Hot Water Ready",description:"Water temperature, ready times and heat now.",preview:!0})}export{ue as HotWaterReadyCard};
