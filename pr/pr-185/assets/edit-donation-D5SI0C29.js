import"./modulepreload-polyfill-B5Qt9EMX.js";function m(i,t,e,o){var n=arguments.length,s=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(i,t,e,o);else for(var u=i.length-1;u>=0;u--)(r=i[u])&&(s=(n<3?r(s):n>3?r(t,e,s):r(t,e))||s);return n>3&&s&&Object.defineProperty(t,e,s),s}var Dt;(function(i){i.CreditCard="Credit Card",i.PayPal="PayPal",i.GooglePay="Google Pay",i.Venmo="Venmo",i.ApplePay="Apple Pay"})(Dt||(Dt={}));class M{get feeAmountCovered(){return this.coverFees?this.fee:0}get fee(){return M.calculateFeeAmount(this.amount)}get total(){return M.calculateTotal(this.amount,this.coverFees)}static calculateTotal(t,e){const o=e?this.calculateFeeAmount(t):0,n=t+o;return isNaN(n)?0:this.roundAmount(n)}static calculateFeeAmount(t){const e=t*.0219+.29;return isNaN(e)?0:this.roundAmount(e)}static roundAmount(t){return Math.round(t*100)/100}constructor(t){this.donationType=t.donationType,this.amount=t.amount,this.coverFees=t.coverFees}}var S;(function(i){i.OneTime="one-time",i.Monthly="monthly",i.Upsell="up_sell"})(S||(S={}));const he=[5,10,25,50,100,500,1e3],Jt=new M({donationType:S.OneTime,amount:10,coverFees:!1});const nt=window,wt=nt.ShadowRoot&&(nt.ShadyCSS===void 0||nt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,kt=Symbol(),Mt=new WeakMap;let Qt=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==kt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(wt&&t===void 0){const o=e!==void 0&&e.length===1;o&&(t=Mt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&Mt.set(e,t))}return t}toString(){return this.cssText}};const pe=i=>new Qt(typeof i=="string"?i:i+"",void 0,kt),p=(i,...t)=>{const e=i.length===1?i[0]:t.reduce(((o,n,s)=>o+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[s+1]),i[0]);return new Qt(e,i,kt)},me=(i,t)=>{wt?i.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):t.forEach((e=>{const o=document.createElement("style"),n=nt.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=e.cssText,i.appendChild(o)}))},It=wt?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return pe(e)})(i):i;var ht;const st=window,Nt=st.trustedTypes,ve=Nt?Nt.emptyScript:"",Bt=st.reactiveElementPolyfillSupport,bt={toAttribute(i,t){switch(t){case Boolean:i=i?ve:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Xt=(i,t)=>t!==i&&(t==t||i==i),pt={attribute:!0,type:String,converter:bt,reflect:!1,hasChanged:Xt},_t="finalized";let P=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),((e=this.h)!==null&&e!==void 0?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,o)=>{const n=this._$Ep(o,e);n!==void 0&&(this._$Ev.set(n,o),t.push(n))})),t}static createProperty(t,e=pt){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const o=typeof t=="symbol"?Symbol():"__"+t,n=this.getPropertyDescriptor(t,o,e);n!==void 0&&Object.defineProperty(this.prototype,t,n)}}static getPropertyDescriptor(t,e,o){return{get(){return this[e]},set(n){const s=this[t];this[e]=n,this.requestUpdate(t,s,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||pt}static finalize(){if(this.hasOwnProperty(_t))return!1;this[_t]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,o=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const n of o)this.createProperty(n,e[n])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const n of o)e.unshift(It(n))}else t!==void 0&&e.push(It(t));return e}static _$Ep(t,e){const o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach((e=>e(this)))}addController(t){var e,o;((e=this._$ES)!==null&&e!==void 0?e:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)===null||o===void 0||o.call(t))}removeController(t){var e;(e=this._$ES)===null||e===void 0||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return me(e,this.constructor.elementStyles),e}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach((e=>{var o;return(o=e.hostConnected)===null||o===void 0?void 0:o.call(e)}))}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach((e=>{var o;return(o=e.hostDisconnected)===null||o===void 0?void 0:o.call(e)}))}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$EO(t,e,o=pt){var n;const s=this.constructor._$Ep(t,o);if(s!==void 0&&o.reflect===!0){const r=(((n=o.converter)===null||n===void 0?void 0:n.toAttribute)!==void 0?o.converter:bt).toAttribute(e,o.type);this._$El=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$El=null}}_$AK(t,e){var o;const n=this.constructor,s=n._$Ev.get(t);if(s!==void 0&&this._$El!==s){const r=n.getPropertyOptions(s),u=typeof r.converter=="function"?{fromAttribute:r.converter}:((o=r.converter)===null||o===void 0?void 0:o.fromAttribute)!==void 0?r.converter:bt;this._$El=s,this[s]=u.fromAttribute(e,r.type),this._$El=null}}requestUpdate(t,e,o){let n=!0;t!==void 0&&(((o=o||this.constructor.getPropertyOptions(t)).hasChanged||Xt)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),o.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,o))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((n,s)=>this[s]=n)),this._$Ei=void 0);let e=!1;const o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),(t=this._$ES)===null||t===void 0||t.forEach((n=>{var s;return(s=n.hostUpdate)===null||s===void 0?void 0:s.call(n)})),this.update(o)):this._$Ek()}catch(n){throw e=!1,this._$Ek(),n}e&&this._$AE(o)}willUpdate(t){}_$AE(t){var e;(e=this._$ES)===null||e===void 0||e.forEach((o=>{var n;return(n=o.hostUpdated)===null||n===void 0?void 0:n.call(o)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach(((e,o)=>this._$EO(o,this[o],e))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};P[_t]=!0,P.elementProperties=new Map,P.elementStyles=[],P.shadowRootOptions={mode:"open"},Bt?.({ReactiveElement:P}),((ht=st.reactiveElementVersions)!==null&&ht!==void 0?ht:st.reactiveElementVersions=[]).push("1.6.3");var mt;const rt=window,U=rt.trustedTypes,Ft=U?U.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ct="$lit$",E=`lit$${(Math.random()+"").slice(9)}$`,Yt="?"+E,fe=`<${Yt}>`,R=document,at=()=>R.createComment(""),K=i=>i===null||typeof i!="object"&&typeof i!="function",te=Array.isArray,$e=i=>te(i)||typeof i?.[Symbol.iterator]=="function",vt=`[ 	
\f\r]`,Z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ht=/-->/g,Ot=/>/g,I=RegExp(`>|${vt}(?:([^\\s"'>=/]+)(${vt}*=${vt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Rt=/'/g,Vt=/"/g,ee=/^(?:script|style|textarea|title)$/i,J=Symbol.for("lit-noChange"),g=Symbol.for("lit-nothing"),Pt=new WeakMap,B=R.createTreeWalker(R,129,null,!1);function oe(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ft!==void 0?Ft.createHTML(t):t}const ge=(i,t)=>{const e=i.length-1,o=[];let n,s=t===2?"<svg>":"",r=Z;for(let u=0;u<e;u++){const a=i[u];let l,d,c=-1,h=0;for(;h<a.length&&(r.lastIndex=h,d=r.exec(a),d!==null);)h=r.lastIndex,r===Z?d[1]==="!--"?r=Ht:d[1]!==void 0?r=Ot:d[2]!==void 0?(ee.test(d[2])&&(n=RegExp("</"+d[2],"g")),r=I):d[3]!==void 0&&(r=I):r===I?d[0]===">"?(r=n??Z,c=-1):d[1]===void 0?c=-2:(c=r.lastIndex-d[2].length,l=d[1],r=d[3]===void 0?I:d[3]==='"'?Vt:Rt):r===Vt||r===Rt?r=I:r===Ht||r===Ot?r=Z:(r=I,n=void 0);const v=r===I&&i[u+1].startsWith("/>")?" ":"";s+=r===Z?a+fe:c>=0?(o.push(l),a.slice(0,c)+Ct+a.slice(c)+E+v):a+E+(c===-2?(o.push(void 0),u):v)}return[oe(i,s+(i[e]||"<?>")+(t===2?"</svg>":"")),o]};let St=class ne{constructor({strings:t,_$litType$:e},o){let n;this.parts=[];let s=0,r=0;const u=t.length-1,a=this.parts,[l,d]=ge(t,e);if(this.el=ne.createElement(l,o),B.currentNode=this.el.content,e===2){const c=this.el.content,h=c.firstChild;h.remove(),c.append(...h.childNodes)}for(;(n=B.nextNode())!==null&&a.length<u;){if(n.nodeType===1){if(n.hasAttributes()){const c=[];for(const h of n.getAttributeNames())if(h.endsWith(Ct)||h.startsWith(E)){const v=d[r++];if(c.push(h),v!==void 0){const W=n.getAttribute(v.toLowerCase()+Ct).split(E),w=/([.?@])?(.*)/.exec(v);a.push({type:1,index:s,name:w[2],strings:W,ctor:w[1]==="."?Ae:w[1]==="?"?_e:w[1]==="@"?Ce:dt})}else a.push({type:6,index:s})}for(const h of c)n.removeAttribute(h)}if(ee.test(n.tagName)){const c=n.textContent.split(E),h=c.length-1;if(h>0){n.textContent=U?U.emptyScript:"";for(let v=0;v<h;v++)n.append(c[v],at()),B.nextNode(),a.push({type:2,index:++s});n.append(c[h],at())}}}else if(n.nodeType===8)if(n.data===Yt)a.push({type:2,index:s});else{let c=-1;for(;(c=n.data.indexOf(E,c+1))!==-1;)a.push({type:7,index:s}),c+=E.length-1}s++}}static createElement(t,e){const o=R.createElement("template");return o.innerHTML=t,o}};function L(i,t,e=i,o){var n,s,r,u;if(t===J)return t;let a=o!==void 0?(n=e._$Co)===null||n===void 0?void 0:n[o]:e._$Cl;const l=K(t)?void 0:t._$litDirective$;return a?.constructor!==l&&((s=a?._$AO)===null||s===void 0||s.call(a,!1),l===void 0?a=void 0:(a=new l(i),a._$AT(i,e,o)),o!==void 0?((r=(u=e)._$Co)!==null&&r!==void 0?r:u._$Co=[])[o]=a:e._$Cl=a),a!==void 0&&(t=L(i,a._$AS(i,t.values),a,o)),t}let ye=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:o},parts:n}=this._$AD,s=((e=t?.creationScope)!==null&&e!==void 0?e:R).importNode(o,!0);B.currentNode=s;let r=B.nextNode(),u=0,a=0,l=n[0];for(;l!==void 0;){if(u===l.index){let d;l.type===2?d=new ie(r,r.nextSibling,this,t):l.type===1?d=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(d=new Se(r,this,t)),this._$AV.push(d),l=n[++a]}u!==l?.index&&(r=B.nextNode(),u++)}return B.currentNode=R,s}v(t){let e=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}},ie=class se{constructor(t,e,o,n){var s;this.type=2,this._$AH=g,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=n,this._$Cp=(s=n?.isConnected)===null||s===void 0||s}get _$AU(){var t,e;return(e=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&e!==void 0?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=L(this,t,e),K(t)?t===g||t==null||t===""?(this._$AH!==g&&this._$AR(),this._$AH=g):t!==this._$AH&&t!==J&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):$e(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==g&&K(this._$AH)?this._$AA.nextSibling.data=t:this.$(R.createTextNode(t)),this._$AH=t}g(t){var e;const{values:o,_$litType$:n}=t,s=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=St.createElement(oe(n.h,n.h[0]),this.options)),n);if(((e=this._$AH)===null||e===void 0?void 0:e._$AD)===s)this._$AH.v(o);else{const r=new ye(s,this),u=r.u(this.options);r.v(o),this.$(u),this._$AH=r}}_$AC(t){let e=Pt.get(t.strings);return e===void 0&&Pt.set(t.strings,e=new St(t)),e}T(t){te(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,n=0;for(const s of t)n===e.length?e.push(o=new se(this.k(at()),this.k(at()),this,this.options)):o=e[n],o._$AI(s),n++;n<e.length&&(this._$AR(o&&o._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var o;for((o=this._$AP)===null||o===void 0||o.call(this,!1,!0,e);t&&t!==this._$AB;){const n=t.nextSibling;t.remove(),t=n}}setConnected(t){var e;this._$AM===void 0&&(this._$Cp=t,(e=this._$AP)===null||e===void 0||e.call(this,t))}},dt=class{constructor(t,e,o,n,s){this.type=1,this._$AH=g,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=s,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=g}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,o,n){const s=this.strings;let r=!1;if(s===void 0)t=L(this,t,e,0),r=!K(t)||t!==this._$AH&&t!==J,r&&(this._$AH=t);else{const u=t;let a,l;for(t=s[0],a=0;a<s.length-1;a++)l=L(this,u[o+a],e,a),l===J&&(l=this._$AH[a]),r||(r=!K(l)||l!==this._$AH[a]),l===g?t=g:t!==g&&(t+=(l??"")+s[a+1]),this._$AH[a]=l}r&&!n&&this.j(t)}j(t){t===g?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Ae=class extends dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===g?void 0:t}};const be=U?U.emptyScript:"";let _e=class extends dt{constructor(){super(...arguments),this.type=4}j(t){t&&t!==g?this.element.setAttribute(this.name,be):this.element.removeAttribute(this.name)}},Ce=class extends dt{constructor(t,e,o,n,s){super(t,e,o,n,s),this.type=5}_$AI(t,e=this){var o;if((t=(o=L(this,t,e,0))!==null&&o!==void 0?o:g)===J)return;const n=this._$AH,s=t===g&&n!==g||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,r=t!==g&&(n===g||s);s&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,o;typeof this._$AH=="function"?this._$AH.call((o=(e=this.options)===null||e===void 0?void 0:e.host)!==null&&o!==void 0?o:this.element,t):this._$AH.handleEvent(t)}},Se=class{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){L(this,t)}};const Ut=rt.litHtmlPolyfillSupport;Ut?.(St,ie),((mt=rt.litHtmlVersions)!==null&&mt!==void 0?mt:rt.litHtmlVersions=[]).push("2.8.0");var ft;const lt=window,z=lt.trustedTypes,Lt=z?z.createPolicy("lit-html",{createHTML:i=>i}):void 0,xt="$lit$",D=`lit$${(Math.random()+"").slice(9)}$`,re="?"+D,xe=`<${re}>`,V=document,Q=()=>V.createComment(""),X=i=>i===null||typeof i!="object"&&typeof i!="function",ae=Array.isArray,we=i=>ae(i)||typeof i?.[Symbol.iterator]=="function",$t=`[ 	
\f\r]`,G=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,zt=/-->/g,qt=/>/g,N=RegExp(`>|${$t}(?:([^\\s"'>=/]+)(${$t}*=${$t}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),jt=/'/g,Wt=/"/g,le=/^(?:script|style|textarea|title)$/i,ke=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),$=ke(1),q=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),Zt=new WeakMap,F=V.createTreeWalker(V,129,null,!1);function ue(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Lt!==void 0?Lt.createHTML(t):t}const Te=(i,t)=>{const e=i.length-1,o=[];let n,s=t===2?"<svg>":"",r=G;for(let u=0;u<e;u++){const a=i[u];let l,d,c=-1,h=0;for(;h<a.length&&(r.lastIndex=h,d=r.exec(a),d!==null);)h=r.lastIndex,r===G?d[1]==="!--"?r=zt:d[1]!==void 0?r=qt:d[2]!==void 0?(le.test(d[2])&&(n=RegExp("</"+d[2],"g")),r=N):d[3]!==void 0&&(r=N):r===N?d[0]===">"?(r=n??G,c=-1):d[1]===void 0?c=-2:(c=r.lastIndex-d[2].length,l=d[1],r=d[3]===void 0?N:d[3]==='"'?Wt:jt):r===Wt||r===jt?r=N:r===zt||r===qt?r=G:(r=N,n=void 0);const v=r===N&&i[u+1].startsWith("/>")?" ":"";s+=r===G?a+xe:c>=0?(o.push(l),a.slice(0,c)+xt+a.slice(c)+D+v):a+D+(c===-2?(o.push(void 0),u):v)}return[ue(i,s+(i[e]||"<?>")+(t===2?"</svg>":"")),o]};class Y{constructor({strings:t,_$litType$:e},o){let n;this.parts=[];let s=0,r=0;const u=t.length-1,a=this.parts,[l,d]=Te(t,e);if(this.el=Y.createElement(l,o),F.currentNode=this.el.content,e===2){const c=this.el.content,h=c.firstChild;h.remove(),c.append(...h.childNodes)}for(;(n=F.nextNode())!==null&&a.length<u;){if(n.nodeType===1){if(n.hasAttributes()){const c=[];for(const h of n.getAttributeNames())if(h.endsWith(xt)||h.startsWith(D)){const v=d[r++];if(c.push(h),v!==void 0){const W=n.getAttribute(v.toLowerCase()+xt).split(D),w=/([.?@])?(.*)/.exec(v);a.push({type:1,index:s,name:w[2],strings:W,ctor:w[1]==="."?De:w[1]==="?"?Ie:w[1]==="@"?Ne:ct})}else a.push({type:6,index:s})}for(const h of c)n.removeAttribute(h)}if(le.test(n.tagName)){const c=n.textContent.split(D),h=c.length-1;if(h>0){n.textContent=z?z.emptyScript:"";for(let v=0;v<h;v++)n.append(c[v],Q()),F.nextNode(),a.push({type:2,index:++s});n.append(c[h],Q())}}}else if(n.nodeType===8)if(n.data===re)a.push({type:2,index:s});else{let c=-1;for(;(c=n.data.indexOf(D,c+1))!==-1;)a.push({type:7,index:s}),c+=D.length-1}s++}}static createElement(t,e){const o=V.createElement("template");return o.innerHTML=t,o}}function j(i,t,e=i,o){var n,s,r,u;if(t===q)return t;let a=o!==void 0?(n=e._$Co)===null||n===void 0?void 0:n[o]:e._$Cl;const l=X(t)?void 0:t._$litDirective$;return a?.constructor!==l&&((s=a?._$AO)===null||s===void 0||s.call(a,!1),l===void 0?a=void 0:(a=new l(i),a._$AT(i,e,o)),o!==void 0?((r=(u=e)._$Co)!==null&&r!==void 0?r:u._$Co=[])[o]=a:e._$Cl=a),a!==void 0&&(t=j(i,a._$AS(i,t.values),a,o)),t}class Ee{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:o},parts:n}=this._$AD,s=((e=t?.creationScope)!==null&&e!==void 0?e:V).importNode(o,!0);F.currentNode=s;let r=F.nextNode(),u=0,a=0,l=n[0];for(;l!==void 0;){if(u===l.index){let d;l.type===2?d=new ot(r,r.nextSibling,this,t):l.type===1?d=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(d=new Be(r,this,t)),this._$AV.push(d),l=n[++a]}u!==l?.index&&(r=F.nextNode(),u++)}return F.currentNode=V,s}v(t){let e=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class ot{constructor(t,e,o,n){var s;this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=n,this._$Cp=(s=n?.isConnected)===null||s===void 0||s}get _$AU(){var t,e;return(e=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&e!==void 0?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=j(this,t,e),X(t)?t===f||t==null||t===""?(this._$AH!==f&&this._$AR(),this._$AH=f):t!==this._$AH&&t!==q&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):we(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==f&&X(this._$AH)?this._$AA.nextSibling.data=t:this.$(V.createTextNode(t)),this._$AH=t}g(t){var e;const{values:o,_$litType$:n}=t,s=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Y.createElement(ue(n.h,n.h[0]),this.options)),n);if(((e=this._$AH)===null||e===void 0?void 0:e._$AD)===s)this._$AH.v(o);else{const r=new Ee(s,this),u=r.u(this.options);r.v(o),this.$(u),this._$AH=r}}_$AC(t){let e=Zt.get(t.strings);return e===void 0&&Zt.set(t.strings,e=new Y(t)),e}T(t){ae(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,n=0;for(const s of t)n===e.length?e.push(o=new ot(this.k(Q()),this.k(Q()),this,this.options)):o=e[n],o._$AI(s),n++;n<e.length&&(this._$AR(o&&o._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var o;for((o=this._$AP)===null||o===void 0||o.call(this,!1,!0,e);t&&t!==this._$AB;){const n=t.nextSibling;t.remove(),t=n}}setConnected(t){var e;this._$AM===void 0&&(this._$Cp=t,(e=this._$AP)===null||e===void 0||e.call(this,t))}}class ct{constructor(t,e,o,n,s){this.type=1,this._$AH=f,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=s,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=f}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,o,n){const s=this.strings;let r=!1;if(s===void 0)t=j(this,t,e,0),r=!X(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const u=t;let a,l;for(t=s[0],a=0;a<s.length-1;a++)l=j(this,u[o+a],e,a),l===q&&(l=this._$AH[a]),r||(r=!X(l)||l!==this._$AH[a]),l===f?t=f:t!==f&&(t+=(l??"")+s[a+1]),this._$AH[a]=l}r&&!n&&this.j(t)}j(t){t===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class De extends ct{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===f?void 0:t}}const Me=z?z.emptyScript:"";class Ie extends ct{constructor(){super(...arguments),this.type=4}j(t){t&&t!==f?this.element.setAttribute(this.name,Me):this.element.removeAttribute(this.name)}}class Ne extends ct{constructor(t,e,o,n,s){super(t,e,o,n,s),this.type=5}_$AI(t,e=this){var o;if((t=(o=j(this,t,e,0))!==null&&o!==void 0?o:f)===q)return;const n=this._$AH,s=t===f&&n!==f||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,r=t!==f&&(n===f||s);s&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,o;typeof this._$AH=="function"?this._$AH.call((o=(e=this.options)===null||e===void 0?void 0:e.host)!==null&&o!==void 0?o:this.element,t):this._$AH.handleEvent(t)}}class Be{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){j(this,t)}}const Gt=lt.litHtmlPolyfillSupport;Gt?.(Y,ot),((ft=lt.litHtmlVersions)!==null&&ft!==void 0?ft:lt.litHtmlVersions=[]).push("2.8.0");const Fe=(i,t,e)=>{var o,n;const s=(o=e?.renderBefore)!==null&&o!==void 0?o:t;let r=s._$litPart$;if(r===void 0){const u=(n=e?.renderBefore)!==null&&n!==void 0?n:null;s._$litPart$=r=new ot(t.insertBefore(Q(),u),u,void 0,e??{})}return r._$AI(i),r};var gt,yt;class H extends P{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const o=super.createRenderRoot();return(t=(e=this.renderOptions).renderBefore)!==null&&t!==void 0||(e.renderBefore=o.firstChild),o}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Fe(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return q}}H.finalized=!0,H._$litElement$=!0,(gt=globalThis.litElementHydrateSupport)===null||gt===void 0||gt.call(globalThis,{LitElement:H});const Kt=globalThis.litElementPolyfillSupport;Kt?.({LitElement:H});((yt=globalThis.litElementVersions)!==null&&yt!==void 0?yt:globalThis.litElementVersions=[]).push("3.3.3");const Tt=i=>t=>typeof t=="function"?((e,o)=>(customElements.define(e,o),o))(i,t):((e,o)=>{const{kind:n,elements:s}=o;return{kind:n,elements:s,finisher(r){customElements.define(e,r)}}})(i,t);const He=(i,t)=>t.kind==="method"&&t.descriptor&&!("value"in t.descriptor)?{...t,finisher(e){e.createProperty(t.key,i)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){typeof t.initializer=="function"&&(this[t.key]=t.initializer.call(this))},finisher(e){e.createProperty(t.key,i)}},Oe=(i,t,e)=>{t.constructor.createProperty(e,i)};function b(i){return(t,e)=>e!==void 0?Oe(i,t,e):He(i,t)}function de(i){return b({...i,state:!0})}const Re=({finisher:i,descriptor:t})=>(e,o)=>{var n;if(o===void 0){const s=(n=e.originalKey)!==null&&n!==void 0?n:e.key,r=t!=null?{kind:"method",placement:"prototype",key:s,descriptor:t(e.key)}:{...e,key:s};return i!=null&&(r.finisher=function(u){i(u,s)}),r}{const s=e.constructor;t!==void 0&&Object.defineProperty(e,o,t(o)),i?.(s,o)}};function _(i,t){return Re({descriptor:e=>({get(){var n,s;return(s=(n=this.renderRoot)===null||n===void 0?void 0:n.querySelector(i))!==null&&s!==void 0?s:null},enumerable:!0,configurable:!0})})}var At;((At=window.HTMLSlotElement)===null||At===void 0?void 0:At.prototype.assignedElements)!=null;var Ve={symbol:"$",separator:",",decimal:".",errorOnInvalid:!1,precision:2,pattern:"!#",negativePattern:"-!#",format:ze,fromCents:!1},ce=function(t){return Math.round(t)},Et=function(t){return Math.pow(10,t)},Pe=function(t,e){return ce(t/e)*e},Ue=/(\d)(?=(\d{3})+\b)/g,Le=/(\d)(?=(\d\d)+\d\b)/g;function x(i,t){var e=this;if(!(e instanceof x))return new x(i,t);var o=Object.assign({},Ve,t),n=Et(o.precision),s=it(i,o);e.intValue=s,e.value=s/n,o.increment=o.increment||1/n,o.useVedic?o.groups=Le:o.groups=Ue,this.s=o,this.p=n}function it(i,t){var e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!0,o=0,n=t.decimal,s=t.errorOnInvalid,r=t.precision,u=t.fromCents,a=Et(r),l=typeof i=="number",d=i instanceof x;if(d&&u)return i.intValue;if(l||d)o=d?i.value:i;else if(typeof i=="string"){var c=new RegExp("[^-\\d"+n+"]","g"),h=new RegExp("\\"+n,"g");o=i.replace(/\((.*)\)/,"-$1").replace(c,"").replace(h,"."),o=o||0}else{if(s)throw Error("Invalid Input");o=0}return u||(o*=a,o=o.toFixed(4)),e?ce(o):o}function ze(i,t){var e=t.pattern,o=t.negativePattern,n=t.symbol,s=t.separator,r=t.decimal,u=t.groups,a=(""+i).replace(/^-/,"").split("."),l=a[0],d=a[1];return(i.value>=0?e:o).replace("!",n).replace("#",l.replace(u,"$1"+s)+(d?r+d:""))}x.prototype={add:function(t){var e=this.intValue,o=this.s,n=this.p;return x((e+=it(t,o))/(o.fromCents?1:n),o)},subtract:function(t){var e=this.intValue,o=this.s,n=this.p;return x((e-=it(t,o))/(o.fromCents?1:n),o)},multiply:function(t){var e=this.intValue,o=this.s;return x((e*=t)/(o.fromCents?1:Et(o.precision)),o)},divide:function(t){var e=this.intValue,o=this.s;return x(e/=it(t,o,!1),o)},distribute:function(t){for(var e=this.intValue,o=this.p,n=this.s,s=[],r=Math[e>=0?"floor":"ceil"](e/t),u=Math.abs(e-r*t),a=n.fromCents?1:o;t!==0;t--){var l=x(r/a,n);u-- >0&&(l=l[e>=0?"add":"subtract"](1/a)),s.push(l)}return s},dollars:function(){return~~this.value},cents:function(){var t=this.intValue,e=this.p;return~~(t%e)},format:function(t){var e=this.s;return typeof t=="function"?t(this,e):e.format(this,Object.assign({},e,t))},toString:function(){var t=this.intValue,e=this.p,o=this.s;return Pe(t/e,o.increment).toFixed(o.precision)},toJSON:function(){return this.value}};class qe{keydown(t){var e,o;const n=t.key;if(t.metaKey)return;switch(n){case"Tab":case"Delete":case"Backspace":case"ArrowLeft":case"ArrowRight":case"ArrowUp":case"ArrowDown":return}const s=t.target,r=s.value,u=r.slice(0,(e=s.selectionStart)!==null&&e!==void 0?e:0),a=r.slice((o=s.selectionEnd)!==null&&o!==void 0?o:0),l=`${u}${n}${a}`,d=/^[0-9]+(\.[0-9]{0,2})?$/g;l.match(d)||t.preventDefault()}}var tt;(function(i){i.HideBadge="hidebadge",i.ShowBadge="showbadge",i.HideBadgeLeaveSpacing="hidebadgeleavespacing"})(tt||(tt={}));let et=class extends H{constructor(){super(...arguments),this.sectionBadge="0",this.badgeMode=tt.ShowBadge}render(){return $`
      <div class="container ${this.badgeMode}">
        <div class="badge-container">
          <div class="badge">${this.sectionBadge}</div>
        </div>
        <div class="content-container">
          ${this.headline?$` <div class="title">${this.headline}</div> `:""}
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `}static get styles(){const t=p`var(--formSectionBadgeTransition, 0.25s ease-out)`,e=p`var(--formSectionBadgeMargin, 1rem)`,o=p`var(--formSectionBadgeBackgroundColor, #333)`,n=p`var(--formSectionBadgeRadius, 1.2rem)`,s=p`calc(${n} * 2)`,r=p`var(--formSectionBadgeFontSize, 1.8rem)`,u=p`var(--formSectionBadgeFontWeight, bold)`,a=p`var(--formSectionBadgeFontColor, #fff)`,l=p`var(--formSectionTitleFontSize, 1.8rem)`,d=p`var(--formSectionTitleFontWeight, bold)`,c=p`var(--formSectionContentBackgroundColor, transparent)`,h=p`var(--formSectionTextColor, #333)`,v=p`calc(${n} * 2)`;return p`
      :host {
        display: block;
        background-color: ${c};
        color: ${h};
      }
      .container {
        position: relative;
        padding: 0.5rem;
      }

      .content-container {
        position: relative;
        left: calc(${s} + ${e});
        width: calc(100% - (${s} + ${e}));
        transition: ${t};
        z-index: 1;
      }

      .hidebadge .content-container {
        left: 0;
        width: 100%;
      }

      .hidebadge .badge-container {
        display: none;
      }

      .hidebadgeleavespacing .badge {
        display: none;
      }

      .badge-container {
        position: absolute;
        width: ${s};
      }

      .badge {
        background-color: ${o};
        color: ${a};
        width: ${s};
        height: ${s};
        border-radius: ${n};
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: ${u};
        font-size: ${r};
      }

      .title {
        line-height: ${v};
        margin-bottom: 0.5rem;
        font-size: ${l};
        font-weight: ${d};
      }
    `}};m([b({type:String})],et.prototype,"sectionBadge",void 0);m([b({type:String})],et.prototype,"headline",void 0);m([b({type:String})],et.prototype,"badgeMode",void 0);et=m([Tt("donation-form-section")],et);var O;(function(i){i.HideNumbers="hidenumbers",i.ShowNumbers="shownumbers"})(O||(O={}));var k;(function(i){i.DonationType="donationType",i.Amount="amount"})(k||(k={}));var C;(function(i){i.ValidDonationAmount="valid_donation_amount",i.InvalidDonationAmount="invalid_donation_amount",i.DonationTooHigh="donation_too_high",i.DonationTooLow="donation_too_low"})(C||(C={}));var T;(function(i){i.Button="button",i.Checkbox="checkbox",i.Hide="hide"})(T||(T={}));var ut;(function(i){i.SingleLine="single-line",i.MultiLine="multi-line"})(ut||(ut={}));let y=class extends H{constructor(){super(...arguments),this.donationInfo=Jt,this.stepNumberMode=O.ShowNumbers,this.amountOptions=he,this.amountSelectionLayout=ut.MultiLine,this.frequencySelectionMode=T.Button,this.customAmountMode="display",this.coverFeesCheckboxMode="display",this.amountTitleDisplayMode="default",this.customAmountSelected=!1,this.currencyValidator=new qe}render(){const e=this.amountTitleDisplayMode==="default"?"Choose an amount (USD)":"";return $`
      ${this.frequencySelectionMode===T.Button?this.frequencyButtonsTemplate:f}

      <donation-form-section
        sectionBadge="${this.amountSelectionSectionNumber}"
        headline=${e}
        badgeMode=${this.formSectionNumberMode}
      >
        ${this.amountTitleDisplayMode==="slot"?$`<slot name="edit-donation-amount-title"></slot>`:f}
        <ul class="amount-selector">
          ${this.presetAmountsTemplate}
          ${this.customAmountMode==="display"?$`<li class="custom-amount">${this.customAmountTemplate}</li>`:f}
        </ul>

        <div class="errors">${this.error}</div>

        ${this.coverFeesCheckboxMode==="display"?$` <div class="checkbox-options">
              ${this.coverFeesCheckboxTemplate}
              ${this.frequencySelectionMode===T.Checkbox?this.frequencyCheckboxTemplate:f}
            </div>`:f}
      </donation-form-section>
    `}updated(t){t.has("customAmountSelected")&&this.customAmountButton&&(this.customAmountButton.checked=this.customAmountSelected),t.has("amountOptions")&&(this.customAmountSelected=!1,this.updateSelectedDonationInfo(),this.setupAmountColumnsLayoutConfig()),t.has("amountSelectionLayout")&&this.setupAmountColumnsLayoutConfig(),t.has("donationInfo")&&this.updateSelectedDonationInfo(),t.has("defaultSelectedAmount")&&this.defaultSelectedAmount!==void 0&&(this.customAmountSelected=!1,this.donationInfo=new M({donationType:this.donationInfo.donationType,amount:this.defaultSelectedAmount,coverFees:this.donationInfo.coverFees}))}get frequencyButtonsTemplate(){return $`
      <donation-form-section
        sectionBadge="1"
        headline="Choose a frequency"
        badgeMode=${this.formSectionNumberMode}
      >
        <ul class="frequency-selector">
          ${this.frequencyTemplate}
        </ul>
      </donation-form-section>
    `}get frequencyCheckboxTemplate(){return $`
      <div class="checkbox-option-container">
        <input
          type="checkbox"
          id="make-this-monthly"
          @input=${this.monthlyCheckboxChecked}
          .checked=${this.donationInfo.donationType===S.Monthly}
          tabindex="0"
        />
        <label for="make-this-monthly"> Make this monthly </label>
      </div>
    `}get coverFeesCheckboxTemplate(){return $`
      <div class="checkbox-option-container">
        <input
          type="checkbox"
          id="cover-fees"
          @input=${this.coverFeesChecked}
          .checked=${this.donationInfo.coverFees}
          tabindex="0"
        />
        <label for="cover-fees"> ${this.coverFeesTextTemplate} </label>
      </div>
    `}get amountSelectionSectionNumber(){return this.frequencySelectionMode===T.Button?2:1}get formSectionNumberMode(){switch(this.stepNumberMode){case O.ShowNumbers:return tt.ShowBadge;case O.HideNumbers:return tt.HideBadge}}setupAmountColumnsLayoutConfig(){const t=this.customAmountMode==="hide"&&this.coverFeesCheckboxMode==="hide"&&this.frequencySelectionMode===T.Hide,e=this.amountOptions.length;let o=5,n=3;switch(e){case 7:o=5,n=3;break;case 6:o=4,n=2;break;case 5:o=4,n=3;break;case 4:if(t){o=4,n=0;break}o=3,n=2;break;case 3:o=2,n=1;break}this.amountSelectionLayout===ut.SingleLine&&(o=e+3,n=3),this.style.setProperty("--paymentSelectorAmountColumnCount",`${o}`),this.style.setProperty("--paymentSelectorCustomAmountColSpan",`${n}`)}updateSelectedDonationInfo(){var t,e;if(!this.customAmountSelected&&!this.isCustomAmount){const o=(t=this.shadowRoot)===null||t===void 0?void 0:t.querySelector(`input[type="radio"][name="${k.Amount}"][value="${this.donationInfo.amount}"]`);o.checked=!0,this.customAmountSelected=!1,this.customAmountInput&&(this.customAmountInput.value="")}else if(this.customAmountSelected=!0,((e=this.shadowRoot)===null||e===void 0?void 0:e.activeElement)!==this.customAmountInput){this.customAmountInput.value=this.customAmountDisplayValue;const o=this.getDonationInfoStatus(this.donationInfo.amount);this.handleDonationInfoStatus(o)}}get coverFeesTextTemplate(){const t=x(this.donationInfo.fee,{symbol:"$"}).format();return $` I'll generously add ${t} to cover fees. `}formatShortenedAmount(t){const e=t%1===0?0:2;return x(t,{symbol:"$",precision:e}).format()}get frequencyTemplate(){return $`
      <li>
        ${this.getRadioButton({group:k.DonationType,value:S.OneTime,displayText:"One time",checked:this.donationInfo.donationType===S.OneTime})}
      </li>

      <li>
        ${this.getRadioButton({group:k.DonationType,value:S.Monthly,displayText:"Monthly",checked:this.donationInfo.donationType===S.Monthly})}
      </li>
    `}get presetAmountsTemplate(){return $`
      ${this.amountOptions.map(t=>{const e=!this.customAmountSelected&&t===this.donationInfo.amount,o=this.formatShortenedAmount(t);return $`
          <li>
            ${this.getRadioButton({group:k.Amount,value:`${t}`,displayText:`${o}`,checked:e})}
          </li>
        `})}
    `}getRadioButton(t){const e=`${t.group}-${t.value}-option`;return $`
      <div class="selection-button">
        <input
          type="radio"
          name=${t.group}
          value=${t.value}
          id=${e}
          tabindex="0"
          .checked=${t.checked}
          @change=${this.radioSelected}
          @click=${o=>{t.group===k.Amount&&parseFloat(t.value)===this.donationInfo.amount&&this.radioSelected(o)}}
        />
        <label for=${e}> ${t.displayText} </label>
      </div>
    `}get isCustomAmount(){return!this.amountOptions.includes(this.donationInfo.amount)}get customAmountDisplayValue(){return this.isCustomAmount?x(this.donationInfo.amount,{symbol:""}).format():""}get customAmountTemplate(){return $`
      <div class="selection-button">
        <input
          type="radio"
          name=${k.Amount}
          value="custom"
          id="custom-amount-button"
          tabindex="0"
          @change=${this.customRadioSelected}
        />

        <label for="custom-amount-button">
          <span class="custom-amount-text">Custom: $</span
          ><input
            type="text"
            id="custom-amount-input"
            tabindex="-1"
            value=${this.customAmountDisplayValue}
            @input=${this.customAmountChanged}
            @keydown=${this.currencyValidator.keydown}
            @focus=${this.customAmountFocused}
            @blur=${t=>{const e=t.target;e.value=this.customAmountDisplayValue}}
          />
        </label>
      </div>
    `}customRadioSelected(){this.customAmountInput.focus()}customAmountFocused(t){const e=t.target;this.customAmountSelected=!0,this.handleCustomAmountInput(e.value)}coverFeesChecked(t){const o=t.target.checked;this.updateDonationInfo({coverFees:o})}customAmountChanged(t){const o=t.target.value;this.customAmountSelected=!0,this.handleCustomAmountInput(o)}handleCustomAmountInput(t){const e=parseFloat(t);isNaN(e)?this.dispatchEditDonationError(C.InvalidDonationAmount):this.amountChanged(e)}handleDonationInfoStatus(t){switch(t){case C.ValidDonationAmount:this.error=void 0;break;case C.DonationTooHigh:this.error=$`
          To make a donation of $10,000 or more, please contact our philanthropy
          department at
          <a href="mailto:donations@archive.org">donations@archive.org</a>
        `,this.dispatchEditDonationError(t);break;case C.DonationTooLow:this.customAmountInput.value.length>0&&(this.error=$` Please select an amount (minimum $1) `),this.dispatchEditDonationError(t);break;case C.InvalidDonationAmount:this.error=$` Please enter a valid donation amount `,this.dispatchEditDonationError(t);break}}amountChanged(t){const e=this.getDonationInfoStatus(t);this.handleDonationInfoStatus(e),e===C.ValidDonationAmount&&this.updateDonationInfo({amount:t})}getDonationInfoStatus(t){return isNaN(t)?C.InvalidDonationAmount:t>=1e4?C.DonationTooHigh:t<1?C.DonationTooLow:C.ValidDonationAmount}radioSelected(t){const e=t.target,o=e.name,{value:n}=e;switch(o){case k.Amount:this.presetAmountChanged(parseFloat(n));break;case k.DonationType:this.updateDonationInfo({donationType:n});break}}monthlyCheckboxChecked(t){const o=t.target.checked?S.Monthly:S.OneTime;this.updateDonationInfo({donationType:o})}dispatchEditDonationError(t){const e=new CustomEvent("editDonationError",{detail:{error:t}});this.dispatchEvent(e)}presetAmountChanged(t){this.error=void 0,this.customAmountSelected=!1,this.customAmountInput&&(this.customAmountInput.value=""),this.updateDonationInfo({amount:t})}updateDonationInfo(t){var e,o,n;const s=new M({donationType:(e=t.donationType)!==null&&e!==void 0?e:this.donationInfo.donationType,amount:(o=t.amount)!==null&&o!==void 0?o:this.donationInfo.amount,coverFees:(n=t.coverFees)!==null&&n!==void 0?n:this.donationInfo.coverFees});this.donationInfo=s;const r=new CustomEvent("donationInfoChanged",{detail:{donationInfo:s}});this.dispatchEvent(r)}static get styles(){const t=p`var(--paymentButtonBorderColor, #333)`,e=p`var(--paymentButtonGridGap, 1rem)`,o=p`var(--paymentButtonFontSize, 1.6rem)`,n=p`var(--paymentButtonFontColor, #000)`,s=p`var(--paymentButtonSelectedFontColor, #000)`,r=p`var(--paymentButtonSelectedColor, #f9bf3b)`,u=p`var(--paymentButtonFocusedOutlineColor, #7fb3f9)`,a=p`var(--paymentButtonColor, #fff)`,l=p`var(--coverFeesFontSize, 1.2rem)`,d=p`var(--coverFeesFontWeight, bold)`,c=p`var(--customAmountWidth, 4rem)`,h=p`var(--inputFieldFontColor, #333)`,v=p`var(--inputBorder, 1px solid #d9d9d9)`,W=p`var(--paymentSelectorAmountColumnCount, 5)`,w=p`var(--paymentSelectorCustomAmountColSpan, 3)`;return p`
      :host {
        --formSectionContentBackgroundColor: var(
          --editFormBgColor,
          transparent
        );
        --formSectionBadgeBackgroundColor: var(--editFormBadgeBgColor, #333);
        --formSectionBadgeFontColor: var(--editFormBadgeFontColor, #fff);
        --formSectionTextColor: var(--editFormTextColor, #333);
      }
      .errors {
        color: red;
        font-size: 1.4rem;
        margin-top: 0.5rem;
      }

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-gap: ${e};
      }

      li {
        margin: 0;
        padding: 0;
        display: inline-block;
      }

      .frequency-selector {
        grid-template-columns: repeat(2, 1fr);
      }

      .amount-selector {
        grid-template-columns: repeat(${W}, 1fr);
      }

      .custom-amount {
        grid-column: span ${w};
      }

      .selection-button {
        height: 3rem;
      }

      .selection-button label {
        padding: 0 0.3rem;
        display: flex;
        cursor: pointer;
        text-align: center;
        font-size: ${o};
        font-weight: bold;
        border: 1px solid ${t};
        border-radius: 5px;
        background-color: #ccc;
        height: 100%;
        justify-content: center;
        align-items: center;
      }

      label[for='custom-amount-button'] {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .custom-amount-text {
        white-space: nowrap;
        margin-right: 0.5rem;
      }

      input[type='radio'] {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
      }

      input[type='radio'] + label {
        color: ${n};
        background-color: ${a};
      }

      input[type='radio']:checked + label {
        color: ${s};
        background-color: ${r};
      }

      input[type='radio']:focus + label {
        outline: 2px solid ${u};
      }

      .checkbox-options {
        margin-top: 1rem;
      }

      .checkbox-option-container {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .checkbox-option-container input {
        width: 2rem;
      }

      .checkbox-option-container label {
        font-size: ${l};
        font-weight: ${d};
        flex: 1;
      }

      #custom-amount-input {
        width: ${c};
        font-size: 1.6rem;
        font-weight: bold;
        color: ${h};
        padding: 0.1rem;
        border: ${v};
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
      }
    `}};m([b({type:Object})],y.prototype,"donationInfo",void 0);m([b({type:String})],y.prototype,"stepNumberMode",void 0);m([b({type:Number})],y.prototype,"defaultSelectedAmount",void 0);m([b({type:Array})],y.prototype,"amountOptions",void 0);m([b({type:String})],y.prototype,"amountSelectionLayout",void 0);m([b({type:String,reflect:!0})],y.prototype,"frequencySelectionMode",void 0);m([b({type:String,reflect:!0})],y.prototype,"customAmountMode",void 0);m([b({type:String,reflect:!0})],y.prototype,"coverFeesCheckboxMode",void 0);m([b({type:String,reflect:!0})],y.prototype,"amountTitleDisplayMode",void 0);m([de()],y.prototype,"error",void 0);m([de()],y.prototype,"customAmountSelected",void 0);m([_("#custom-amount-button")],y.prototype,"customAmountButton",void 0);m([_("#custom-amount-input")],y.prototype,"customAmountInput",void 0);y=m([Tt("donation-form-edit-donation")],y);let A=class extends H{constructor(){super(...arguments),this.showCustomColors=!1}render(){return $`
      <donation-form-edit-donation
        .donationInfo=${Jt}
        @donationInfoChanged=${this.donationInfoChanged}
        @editDonationError=${this.editDonationError}
        stepNumberMode="shownumbers"
        class=${this.showCustomColors?"custom-color":""}
      >
        <p slot="edit-donation-amount-title">
          <b>Can you chip in?</b> <span>(USD)</span>
        </p>
      </donation-form-edit-donation>

      <hr />

      ${this.devToolsTemplate}
    `}toggleColors(){this.showCustomColors=!this.showCustomColors}get devToolsTemplate(){return $`
      <div id="dev-tools">
        <h2>Dev Tools:</h2>

        <button @click=${this.toggleColors}>Toggle Colors</button>
        <br />
        <button @click=${this.toggleNumbers}>Toggle Number Visibility</button>
        <br />
        <button @click=${this.toggleMinimalView}>Toggle Minimal View</button>

        <div class="amount">
          Total:
          <div id="total">$10.00</div>
        </div>
        <fieldset>
          <legend>Donation Info</legend>
          <ul>
            <li>
              <input
                type="radio"
                name="donationType"
                value="one-time"
                checked
              />
              One Time
              <input type="radio" name="donationType" value="monthly" /> Monthly
            </li>
            <li>$ <input type="text" id="amount-input" value="10.00" /></li>
            <li>
              <input type="checkbox" id="coverfees-checkbox" /> Cover fees
            </li>
            <li>
              <button @click=${this.updateForm}>Update</button>
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Dollar Amounts</legend>
          <ul>
            <li>
              Amounts:
              <input
                type="text"
                id="dollar-amounts"
                value="5, 10, 25, 50, 100, 500, 1000"
              />
            </li>
            <li>
              <button @click=${this.updateAmounts}>Update</button>
            </li>
          </ul>
        </fieldset>

        <fieldset>
          <legend>Layout</legend>
          <ul>
            <li>
              Amounts Layout:
              <input
                type="radio"
                name="amounts-layout"
                id="amount-single-line"
                value="single-line"
              />
              <label for="amount-single-line">Single Line</label>
              <input
                type="radio"
                name="amounts-layout"
                id="amount-multi-line"
                value="multi-line"
                checked
              />
              <label for="amount-multi-line">Multi Line</label>
            </li>
            <li>
              Frequency Option:
              <input
                type="radio"
                name="frequency-option"
                id="frequency-layout-buttons"
                value="button"
                checked
              />
              <label for="frequency-layout-buttons">Buttons</label>
              <input
                type="radio"
                name="frequency-option"
                id="frequency-layout-checkbox"
                value="checkbox"
              />
              <label for="frequency-layout-checkbox">Checkbox</label>
            </li>
            <li>
              <button @click=${this.updateLayout}>Update</button>
            </li>
          </ul>
        </fieldset>

        <div id="error"></div>
      </div>
    `}donationInfoChanged(t){const e=t.detail.donationInfo;this.totalDiv.innerText=`$${e.total}`,this.errorDiv.innerText="",this.amountInput.value=`${e.amount}`,this.coverFeesCheckbox.checked=e.coverFees,e.donationType===S.OneTime?this.oneTimeRadio.checked=!0:this.monthlyRadio.checked=!0}toggleMinimalView(){var t;this.editDonation.customAmountMode=this.editDonation.customAmountMode==="display"?"hide":"display",this.editDonation.coverFeesCheckboxMode=this.editDonation.coverFeesCheckboxMode==="display"?"hide":"display",this.editDonation.frequencySelectionMode=this.editDonation.frequencySelectionMode==="hide"?T.Button:T.Hide,this.editDonation.amountTitleDisplayMode=this.editDonation.amountTitleDisplayMode==="default"?"slot":"default",this.editDonation.amountOptions=[5,55,155,255],this.editDonation.donationInfo=new M({amount:5,donationType:S.OneTime,coverFees:!1}),this.toggleNumbers(),this.editDonation.classList.contains("minimal")?(t=this.editDonation)===null||t===void 0||t.classList.remove("minimal"):this.editDonation.classList.add("minimal")}toggleNumbers(){this.editDonation.stepNumberMode=this.editDonation.stepNumberMode==="shownumbers"?O.HideNumbers:O.ShowNumbers}editDonationError(t){this.errorDiv.innerText=t.detail.error,this.totalDiv.innerText="Invalid"}updateLayout(){this.editDonation.frequencySelectionMode=this.frequencySelectionOption.value,this.editDonation.amountSelectionLayout=this.amountsLayoutOption.value}updateForm(){const t=new M({amount:parseFloat(this.amountInput.value),donationType:this.selectedDonationType.value,coverFees:this.coverFeesCheckbox.checked});this.editDonation.donationInfo=t}updateAmounts(){const o=this.dollarAmounts.value.split(",").map(n=>parseFloat(n)).filter(n=>!isNaN(n));this.editDonation.amountOptions=o}static get styles(){return p`
      donation-form-edit-donation {
        width: 32rem;
        display: block;
      }

      donation-form-edit-donation.minimal {
        --paymentButtonColor: green;
        --paymentButtonFontColor: white;
        --paymentButtonSelectedColor: green;
        --paymentButtonSelectedFontColor: white;
        width: 25rem;
      }

      donation-form-edit-donation.minimal p {
        margin: 0 0 5px 0;
        font-size: 1.8rem;
        line-height: calc(1.2rem * 2);
      }

      donation-form-edit-donation.custom-color {
        --editFormBgColor: turquoise;
        --editFormBadgeBgColor: pink;
        --editFormBadgeFontColor: rebeccapurple;
        --editFormTextColor: darkBlue;
        --paymentButtonFontColor: darkBlue;
        --paymentButtonColor: white;
        --paymentButtonSelectedColor: green;
        --paymentButtonSelectedFontColor: yellow;
      }

      #dev-tools {
        font-size: 1.6rem;
      }
    `}};m([_("donation-form-edit-donation")],A.prototype,"editDonation",void 0);m([_("#total")],A.prototype,"totalDiv",void 0);m([_("#error")],A.prototype,"errorDiv",void 0);m([_("#coverfees-checkbox")],A.prototype,"coverFeesCheckbox",void 0);m([_("input[name=donationType][value=one-time]")],A.prototype,"oneTimeRadio",void 0);m([_("input[name=donationType][value=monthly]")],A.prototype,"monthlyRadio",void 0);m([_("input[name=donationType]:checked")],A.prototype,"selectedDonationType",void 0);m([_("input[name=amounts-layout]:checked")],A.prototype,"amountsLayoutOption",void 0);m([_("input[name=frequency-option]:checked")],A.prototype,"frequencySelectionOption",void 0);m([_("#amount-input")],A.prototype,"amountInput",void 0);m([_("#dollar-amounts")],A.prototype,"dollarAmounts",void 0);m([b({type:Boolean})],A.prototype,"showCustomColors",void 0);A=m([Tt("app-root")],A);
