import"./modulepreload-polyfill-B5Qt9EMX.js";function v(s,e,t,r){var i=arguments.length,n=i<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(s,e,t,r);else for(var h=s.length-1;h>=0;h--)(o=s[h])&&(n=(i<3?o(n):i>3?o(e,t,n):o(e,t))||n);return i>3&&n&&Object.defineProperty(e,t,n),n}const Z=window,$e=Z.ShadowRoot&&(Z.ShadyCSS===void 0||Z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ge=Symbol(),fe=new WeakMap;let Ve=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if($e&&e===void 0){const r=t!==void 0&&t.length===1;r&&(e=fe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&fe.set(t,e))}return e}toString(){return this.cssText}};const Qe=s=>new Ve(typeof s=="string"?s:s+"",void 0,ge),f=(s,...e)=>{const t=s.length===1?s[0]:e.reduce(((r,i,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[n+1]),s[0]);return new Ve(t,s,ge)},Xe=(s,e)=>{$e?s.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((t=>{const r=document.createElement("style"),i=Z.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=t.cssText,s.appendChild(r)}))},Ae=$e?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return Qe(t)})(s):s;var re;const q=window,_e=q.trustedTypes,Ye=_e?_e.emptyScript:"",ye=q.reactiveElementPolyfillSupport,ue={toAttribute(s,e){switch(e){case Boolean:s=s?Ye:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},Ue=(s,e)=>e!==s&&(e==e||s==s),ie={attribute:!0,type:String,converter:ue,reflect:!1,hasChanged:Ue},ce="finalized";let R=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var t;this.finalize(),((t=this.h)!==null&&t!==void 0?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,r)=>{const i=this._$Ep(r,t);i!==void 0&&(this._$Ev.set(i,r),e.push(i))})),e}static createProperty(e,t=ie){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const r=typeof e=="symbol"?Symbol():"__"+e,i=this.getPropertyDescriptor(e,r,t);i!==void 0&&Object.defineProperty(this.prototype,e,i)}}static getPropertyDescriptor(e,t,r){return{get(){return this[t]},set(i){const n=this[e];this[t]=i,this.requestUpdate(e,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||ie}static finalize(){if(this.hasOwnProperty(ce))return!1;this[ce]=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),e.h!==void 0&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,r=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of r)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const i of r)t.unshift(Ae(i))}else e!==void 0&&t.push(Ae(e));return t}static _$Ep(e,t){const r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(e=this.constructor.h)===null||e===void 0||e.forEach((t=>t(this)))}addController(e){var t,r;((t=this._$ES)!==null&&t!==void 0?t:this._$ES=[]).push(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)===null||r===void 0||r.call(e))}removeController(e){var t;(t=this._$ES)===null||t===void 0||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;const t=(e=this.shadowRoot)!==null&&e!==void 0?e:this.attachShadow(this.constructor.shadowRootOptions);return Xe(t,this.constructor.elementStyles),t}connectedCallback(){var e;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$ES)===null||e===void 0||e.forEach((t=>{var r;return(r=t.hostConnected)===null||r===void 0?void 0:r.call(t)}))}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$ES)===null||e===void 0||e.forEach((t=>{var r;return(r=t.hostDisconnected)===null||r===void 0?void 0:r.call(t)}))}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EO(e,t,r=ie){var i;const n=this.constructor._$Ep(e,r);if(n!==void 0&&r.reflect===!0){const o=(((i=r.converter)===null||i===void 0?void 0:i.toAttribute)!==void 0?r.converter:ue).toAttribute(t,r.type);this._$El=e,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(e,t){var r;const i=this.constructor,n=i._$Ev.get(e);if(n!==void 0&&this._$El!==n){const o=i.getPropertyOptions(n),h=typeof o.converter=="function"?{fromAttribute:o.converter}:((r=o.converter)===null||r===void 0?void 0:r.fromAttribute)!==void 0?o.converter:ue;this._$El=n,this[n]=h.fromAttribute(t,o.type),this._$El=null}}requestUpdate(e,t,r){let i=!0;e!==void 0&&(((r=r||this.constructor.getPropertyOptions(e)).hasChanged||Ue)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),r.reflect===!0&&this._$El!==e&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(e,r))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((i,n)=>this[n]=i)),this._$Ei=void 0);let t=!1;const r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),(e=this._$ES)===null||e===void 0||e.forEach((i=>{var n;return(n=i.hostUpdate)===null||n===void 0?void 0:n.call(i)})),this.update(r)):this._$Ek()}catch(i){throw t=!1,this._$Ek(),i}t&&this._$AE(r)}willUpdate(e){}_$AE(e){var t;(t=this._$ES)===null||t===void 0||t.forEach((r=>{var i;return(i=r.hostUpdated)===null||i===void 0?void 0:i.call(r)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){this._$EC!==void 0&&(this._$EC.forEach(((t,r)=>this._$EO(r,this[r],t))),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};R[ce]=!0,R.elementProperties=new Map,R.elementStyles=[],R.shadowRootOptions={mode:"open"},ye?.({ReactiveElement:R}),((re=q.reactiveElementVersions)!==null&&re!==void 0?re:q.reactiveElementVersions=[]).push("1.6.3");var se;const K=window,O=K.trustedTypes,be=O?O.createPolicy("lit-html",{createHTML:s=>s}):void 0,pe="$lit$",y=`lit$${(Math.random()+"").slice(9)}$`,Be="?"+y,et=`<${Be}>`,w=document,J=()=>w.createComment(""),L=s=>s===null||typeof s!="object"&&typeof s!="function",Ie=Array.isArray,tt=s=>Ie(s)||typeof s?.[Symbol.iterator]=="function",oe=`[ 	
\f\r]`,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ce=/-->/g,Ee=/>/g,E=RegExp(`>|${oe}(?:([^\\s"'>=/]+)(${oe}*=${oe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Se=/'/g,Me=/"/g,Le=/^(?:script|style|textarea|title)$/i,D=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),xe=new WeakMap,M=w.createTreeWalker(w,129,null,!1);function De(s,e){if(!Array.isArray(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return be!==void 0?be.createHTML(e):e}const rt=(s,e)=>{const t=s.length-1,r=[];let i,n=e===2?"<svg>":"",o=U;for(let h=0;h<t;h++){const l=s[h];let a,d,u=-1,c=0;for(;c<l.length&&(o.lastIndex=c,d=o.exec(l),d!==null);)c=o.lastIndex,o===U?d[1]==="!--"?o=Ce:d[1]!==void 0?o=Ee:d[2]!==void 0?(Le.test(d[2])&&(i=RegExp("</"+d[2],"g")),o=E):d[3]!==void 0&&(o=E):o===E?d[0]===">"?(o=i??U,u=-1):d[1]===void 0?u=-2:(u=o.lastIndex-d[2].length,a=d[1],o=d[3]===void 0?E:d[3]==='"'?Me:Se):o===Me||o===Se?o=E:o===Ce||o===Ee?o=U:(o=E,i=void 0);const m=o===E&&s[h+1].startsWith("/>")?" ":"";n+=o===U?l+et:u>=0?(r.push(a),l.slice(0,u)+pe+l.slice(u)+y+m):l+y+(u===-2?(r.push(void 0),h):m)}return[De(s,n+(s[t]||"<?>")+(e===2?"</svg>":"")),r]};let me=class je{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let n=0,o=0;const h=e.length-1,l=this.parts,[a,d]=rt(e,t);if(this.el=je.createElement(a,r),M.currentNode=this.el.content,t===2){const u=this.el.content,c=u.firstChild;c.remove(),u.append(...c.childNodes)}for(;(i=M.nextNode())!==null&&l.length<h;){if(i.nodeType===1){if(i.hasAttributes()){const u=[];for(const c of i.getAttributeNames())if(c.endsWith(pe)||c.startsWith(y)){const m=d[o++];if(u.push(c),m!==void 0){const te=i.getAttribute(m.toLowerCase()+pe).split(y),A=/([.?@])?(.*)/.exec(m);l.push({type:1,index:n,name:A[2],strings:te,ctor:A[1]==="."?st:A[1]==="?"?nt:A[1]==="@"?lt:X})}else l.push({type:6,index:n})}for(const c of u)i.removeAttribute(c)}if(Le.test(i.tagName)){const u=i.textContent.split(y),c=u.length-1;if(c>0){i.textContent=O?O.emptyScript:"";for(let m=0;m<c;m++)i.append(u[m],J()),M.nextNode(),l.push({type:2,index:++n});i.append(u[c],J())}}}else if(i.nodeType===8)if(i.data===Be)l.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(y,u+1))!==-1;)l.push({type:7,index:n}),u+=y.length-1}n++}}static createElement(e,t){const r=w.createElement("template");return r.innerHTML=e,r}};function k(s,e,t=s,r){var i,n,o,h;if(e===D)return e;let l=r!==void 0?(i=t._$Co)===null||i===void 0?void 0:i[r]:t._$Cl;const a=L(e)?void 0:e._$litDirective$;return l?.constructor!==a&&((n=l?._$AO)===null||n===void 0||n.call(l,!1),a===void 0?l=void 0:(l=new a(s),l._$AT(s,t,r)),r!==void 0?((o=(h=t)._$Co)!==null&&o!==void 0?o:h._$Co=[])[r]=l:t._$Cl=l),l!==void 0&&(e=k(s,l._$AS(s,e.values),l,r)),e}let it=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;const{el:{content:r},parts:i}=this._$AD,n=((t=e?.creationScope)!==null&&t!==void 0?t:w).importNode(r,!0);M.currentNode=n;let o=M.nextNode(),h=0,l=0,a=i[0];for(;a!==void 0;){if(h===a.index){let d;a.type===2?d=new We(o,o.nextSibling,this,e):a.type===1?d=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(d=new at(o,this,e)),this._$AV.push(d),a=i[++l]}h!==a?.index&&(o=M.nextNode(),h++)}return M.currentNode=w,n}v(e){let t=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},We=class Ge{constructor(e,t,r,i){var n;this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this._$Cp=(n=i?.isConnected)===null||n===void 0||n}get _$AU(){var e,t;return(t=(e=this._$AM)===null||e===void 0?void 0:e._$AU)!==null&&t!==void 0?t:this._$Cp}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=k(this,e,t),L(e)?e===$||e==null||e===""?(this._$AH!==$&&this._$AR(),this._$AH=$):e!==this._$AH&&e!==D&&this._(e):e._$litType$!==void 0?this.g(e):e.nodeType!==void 0?this.$(e):tt(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==$&&L(this._$AH)?this._$AA.nextSibling.data=e:this.$(w.createTextNode(e)),this._$AH=e}g(e){var t;const{values:r,_$litType$:i}=e,n=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=me.createElement(De(i.h,i.h[0]),this.options)),i);if(((t=this._$AH)===null||t===void 0?void 0:t._$AD)===n)this._$AH.v(r);else{const o=new it(n,this),h=o.u(this.options);o.v(r),this.$(h),this._$AH=o}}_$AC(e){let t=xe.get(e.strings);return t===void 0&&xe.set(e.strings,t=new me(e)),t}T(e){Ie(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,i=0;for(const n of e)i===t.length?t.push(r=new Ge(this.k(J()),this.k(J()),this,this.options)):r=t[i],r._$AI(n),i++;i<t.length&&(this._$AR(r&&r._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)===null||r===void 0||r.call(this,!1,!0,t);e&&e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cp=e,(t=this._$AP)===null||t===void 0||t.call(this,e))}},X=class{constructor(e,t,r,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=$}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,r,i){const n=this.strings;let o=!1;if(n===void 0)e=k(this,e,t,0),o=!L(e)||e!==this._$AH&&e!==D,o&&(this._$AH=e);else{const h=e;let l,a;for(e=n[0],l=0;l<n.length-1;l++)a=k(this,h[r+l],t,l),a===D&&(a=this._$AH[l]),o||(o=!L(a)||a!==this._$AH[l]),a===$?e=$:e!==$&&(e+=(a??"")+n[l+1]),this._$AH[l]=a}o&&!i&&this.j(e)}j(e){e===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},st=class extends X{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===$?void 0:e}};const ot=O?O.emptyScript:"";let nt=class extends X{constructor(){super(...arguments),this.type=4}j(e){e&&e!==$?this.element.setAttribute(this.name,ot):this.element.removeAttribute(this.name)}},lt=class extends X{constructor(e,t,r,i,n){super(e,t,r,i,n),this.type=5}_$AI(e,t=this){var r;if((e=(r=k(this,e,t,0))!==null&&r!==void 0?r:$)===D)return;const i=this._$AH,n=e===$&&i!==$||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==$&&(i===$||n);n&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,r;typeof this._$AH=="function"?this._$AH.call((r=(t=this.options)===null||t===void 0?void 0:t.host)!==null&&r!==void 0?r:this.element,e):this._$AH.handleEvent(e)}},at=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){k(this,e)}};const we=K.litHtmlPolyfillSupport;we?.(me,We),((se=K.litHtmlVersions)!==null&&se!==void 0?se:K.litHtmlVersions=[]).push("2.8.0");var ne;const Q=window,P=Q.trustedTypes,He=P?P.createPolicy("lit-html",{createHTML:s=>s}):void 0,ve="$lit$",b=`lit$${(Math.random()+"").slice(9)}$`,Fe="?"+b,ht=`<${Fe}>`,H=document,j=()=>H.createComment(""),W=s=>s===null||typeof s!="object"&&typeof s!="function",Ze=Array.isArray,dt=s=>Ze(s)||typeof s?.[Symbol.iterator]=="function",le=`[ 	
\f\r]`,B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ne=/-->/g,Re=/>/g,S=RegExp(`>|${le}(?:([^\\s"'>=/]+)(${le}*=${le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Te=/'/g,Oe=/"/g,qe=/^(?:script|style|textarea|title)$/i,ut=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),I=ut(1),z=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),ke=new WeakMap,x=H.createTreeWalker(H,129,null,!1);function Ke(s,e){if(!Array.isArray(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return He!==void 0?He.createHTML(e):e}const ct=(s,e)=>{const t=s.length-1,r=[];let i,n=e===2?"<svg>":"",o=B;for(let h=0;h<t;h++){const l=s[h];let a,d,u=-1,c=0;for(;c<l.length&&(o.lastIndex=c,d=o.exec(l),d!==null);)c=o.lastIndex,o===B?d[1]==="!--"?o=Ne:d[1]!==void 0?o=Re:d[2]!==void 0?(qe.test(d[2])&&(i=RegExp("</"+d[2],"g")),o=S):d[3]!==void 0&&(o=S):o===S?d[0]===">"?(o=i??B,u=-1):d[1]===void 0?u=-2:(u=o.lastIndex-d[2].length,a=d[1],o=d[3]===void 0?S:d[3]==='"'?Oe:Te):o===Oe||o===Te?o=S:o===Ne||o===Re?o=B:(o=S,i=void 0);const m=o===S&&s[h+1].startsWith("/>")?" ":"";n+=o===B?l+ht:u>=0?(r.push(a),l.slice(0,u)+ve+l.slice(u)+b+m):l+b+(u===-2?(r.push(void 0),h):m)}return[Ke(s,n+(s[t]||"<?>")+(e===2?"</svg>":"")),r]};class G{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let n=0,o=0;const h=e.length-1,l=this.parts,[a,d]=ct(e,t);if(this.el=G.createElement(a,r),x.currentNode=this.el.content,t===2){const u=this.el.content,c=u.firstChild;c.remove(),u.append(...c.childNodes)}for(;(i=x.nextNode())!==null&&l.length<h;){if(i.nodeType===1){if(i.hasAttributes()){const u=[];for(const c of i.getAttributeNames())if(c.endsWith(ve)||c.startsWith(b)){const m=d[o++];if(u.push(c),m!==void 0){const te=i.getAttribute(m.toLowerCase()+ve).split(b),A=/([.?@])?(.*)/.exec(m);l.push({type:1,index:n,name:A[2],strings:te,ctor:A[1]==="."?mt:A[1]==="?"?$t:A[1]==="@"?gt:Y})}else l.push({type:6,index:n})}for(const c of u)i.removeAttribute(c)}if(qe.test(i.tagName)){const u=i.textContent.split(b),c=u.length-1;if(c>0){i.textContent=P?P.emptyScript:"";for(let m=0;m<c;m++)i.append(u[m],j()),x.nextNode(),l.push({type:2,index:++n});i.append(u[c],j())}}}else if(i.nodeType===8)if(i.data===Fe)l.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(b,u+1))!==-1;)l.push({type:7,index:n}),u+=b.length-1}n++}}static createElement(e,t){const r=H.createElement("template");return r.innerHTML=e,r}}function V(s,e,t=s,r){var i,n,o,h;if(e===z)return e;let l=r!==void 0?(i=t._$Co)===null||i===void 0?void 0:i[r]:t._$Cl;const a=W(e)?void 0:e._$litDirective$;return l?.constructor!==a&&((n=l?._$AO)===null||n===void 0||n.call(l,!1),a===void 0?l=void 0:(l=new a(s),l._$AT(s,t,r)),r!==void 0?((o=(h=t)._$Co)!==null&&o!==void 0?o:h._$Co=[])[r]=l:t._$Cl=l),l!==void 0&&(e=V(s,l._$AS(s,e.values),l,r)),e}class pt{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;const{el:{content:r},parts:i}=this._$AD,n=((t=e?.creationScope)!==null&&t!==void 0?t:H).importNode(r,!0);x.currentNode=n;let o=x.nextNode(),h=0,l=0,a=i[0];for(;a!==void 0;){if(h===a.index){let d;a.type===2?d=new F(o,o.nextSibling,this,e):a.type===1?d=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(d=new ft(o,this,e)),this._$AV.push(d),a=i[++l]}h!==a?.index&&(o=x.nextNode(),h++)}return x.currentNode=H,n}v(e){let t=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class F{constructor(e,t,r,i){var n;this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this._$Cp=(n=i?.isConnected)===null||n===void 0||n}get _$AU(){var e,t;return(t=(e=this._$AM)===null||e===void 0?void 0:e._$AU)!==null&&t!==void 0?t:this._$Cp}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=V(this,e,t),W(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==z&&this._(e):e._$litType$!==void 0?this.g(e):e.nodeType!==void 0?this.$(e):dt(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==p&&W(this._$AH)?this._$AA.nextSibling.data=e:this.$(H.createTextNode(e)),this._$AH=e}g(e){var t;const{values:r,_$litType$:i}=e,n=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=G.createElement(Ke(i.h,i.h[0]),this.options)),i);if(((t=this._$AH)===null||t===void 0?void 0:t._$AD)===n)this._$AH.v(r);else{const o=new pt(n,this),h=o.u(this.options);o.v(r),this.$(h),this._$AH=o}}_$AC(e){let t=ke.get(e.strings);return t===void 0&&ke.set(e.strings,t=new G(e)),t}T(e){Ze(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,i=0;for(const n of e)i===t.length?t.push(r=new F(this.k(j()),this.k(j()),this,this.options)):r=t[i],r._$AI(n),i++;i<t.length&&(this._$AR(r&&r._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)===null||r===void 0||r.call(this,!1,!0,t);e&&e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cp=e,(t=this._$AP)===null||t===void 0||t.call(this,e))}}class Y{constructor(e,t,r,i,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=p}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,r,i){const n=this.strings;let o=!1;if(n===void 0)e=V(this,e,t,0),o=!W(e)||e!==this._$AH&&e!==z,o&&(this._$AH=e);else{const h=e;let l,a;for(e=n[0],l=0;l<n.length-1;l++)a=V(this,h[r+l],t,l),a===z&&(a=this._$AH[l]),o||(o=!W(a)||a!==this._$AH[l]),a===p?e=p:e!==p&&(e+=(a??"")+n[l+1]),this._$AH[l]=a}o&&!i&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class mt extends Y{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}}const vt=P?P.emptyScript:"";class $t extends Y{constructor(){super(...arguments),this.type=4}j(e){e&&e!==p?this.element.setAttribute(this.name,vt):this.element.removeAttribute(this.name)}}class gt extends Y{constructor(e,t,r,i,n){super(e,t,r,i,n),this.type=5}_$AI(e,t=this){var r;if((e=(r=V(this,e,t,0))!==null&&r!==void 0?r:p)===z)return;const i=this._$AH,n=e===p&&i!==p||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==p&&(i===p||n);n&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,r;typeof this._$AH=="function"?this._$AH.call((r=(t=this.options)===null||t===void 0?void 0:t.host)!==null&&r!==void 0?r:this.element,e):this._$AH.handleEvent(e)}}class ft{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){V(this,e)}}const Pe=Q.litHtmlPolyfillSupport;Pe?.(G,F),((ne=Q.litHtmlVersions)!==null&&ne!==void 0?ne:Q.litHtmlVersions=[]).push("2.8.0");const At=(s,e,t)=>{var r,i;const n=(r=t?.renderBefore)!==null&&r!==void 0?r:e;let o=n._$litPart$;if(o===void 0){const h=(i=t?.renderBefore)!==null&&i!==void 0?i:null;n._$litPart$=o=new F(e.insertBefore(j(),h),h,void 0,t??{})}return o._$AI(s),o};var ae,he;class T extends R{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;const r=super.createRenderRoot();return(e=(t=this.renderOptions).renderBefore)!==null&&e!==void 0||(t.renderBefore=r.firstChild),r}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=At(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!1)}render(){return z}}T.finalized=!0,T._$litElement$=!0,(ae=globalThis.litElementHydrateSupport)===null||ae===void 0||ae.call(globalThis,{LitElement:T});const ze=globalThis.litElementPolyfillSupport;ze?.({LitElement:T});((he=globalThis.litElementVersions)!==null&&he!==void 0?he:globalThis.litElementVersions=[]).push("3.3.3");const Je=s=>e=>typeof e=="function"?((t,r)=>(customElements.define(t,r),r))(s,e):((t,r)=>{const{kind:i,elements:n}=r;return{kind:i,elements:n,finisher(o){customElements.define(t,o)}}})(s,e);const _t=(s,e)=>e.kind==="method"&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(t){t.createProperty(e.key,s)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){typeof e.initializer=="function"&&(this[e.key]=e.initializer.call(this))},finisher(t){t.createProperty(e.key,s)}},yt=(s,e,t)=>{e.constructor.createProperty(t,s)};function C(s){return(e,t)=>t!==void 0?yt(s,e,t):_t(s,e)}function ee(s){return C({...s,state:!0})}const bt=({finisher:s,descriptor:e})=>(t,r)=>{var i;if(r===void 0){const n=(i=t.originalKey)!==null&&i!==void 0?i:t.key,o=e!=null?{kind:"method",placement:"prototype",key:n,descriptor:e(t.key)}:{...t,key:n};return s!=null&&(o.finisher=function(h){s(h,n)}),o}{const n=t.constructor;e!==void 0&&Object.defineProperty(t,r,e(r)),s?.(n,r)}};function N(s,e){return bt({descriptor:t=>({get(){var i,n;return(n=(i=this.renderRoot)===null||i===void 0?void 0:i.querySelector(s))!==null&&n!==void 0?n:null},enumerable:!0,configurable:!0})})}var de;((de=window.HTMLSlotElement)===null||de===void 0?void 0:de.prototype.assignedElements)!=null;let g=class extends T{constructor(){super(...arguments),this.goalMessageMode="amount",this.goalNearMessage="We’ve almost reached our goal!",this.goalReachedMessage="We've reached our goal!",this.goalAmount=75e5,this.currentAmountMode="on",this.currentAmount=0,this.thermometerValueWidth=0,this.thermometerFillWidth=0}render(){return I`
      <div
        class="container"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="${this.goalAmount}"
        aria-valuenow="${this.currentAmount}"
        aria-valuetext="${this.currentAmountDisplayValue}"
      >
        <div class="thermometer-message-container">
          <div class="thermometer-container">
            <div
              class="thermometer-background ${this.thermometerValuePosition}"
            >
              <div
                class="thermometer-fill"
                style="width: ${this.percentComplete}%"
              >
                ${this.thermometerValuePosition==="value-left"?this.thermometerValueTemplate:p}
              </div>
              ${this.thermometerValuePosition==="value-right"?this.thermometerValueTemplate:p}
            </div>
          </div>
          ${this.goalMessageMode!=="off"?I` <div class="donate-goal">${this.currentGoalMessage}</div> `:p}
        </div>
      </div>
    `}get thermometerValueTemplate(){return this.currentAmountMode==="off"?I`${p}`:I`
          <div class="thermometer-value">${this.currentAmountDisplayValue}</div>
        `}get thermometerValuePosition(){return this.thermometerValueWidth+10<this.thermometerFillWidth?"value-left":"value-right"}updated(e){if(e.has("resizeObserver")){const t=e.get("resizeObserver");this.disconnectResizeObserver(t),this.setupResizeObserver(this.resizeObserver)}e.has("currentAmountMode")&&(this.unobserveCurrentAmountResize(this.resizeObserver),this.observeCurrentAmountResize(this.resizeObserver))}disconnectedCallback(){this.disconnectResizeObserver(this.resizeObserver)}handleResize(e){var t;switch(e.target){case((t=this.shadowRoot)===null||t===void 0?void 0:t.host):this.style.setProperty("--bannerThermometerHeight",e.contentRect.height+"px");break;case this.thermometerValue:this.thermometerValueWidth=e.contentRect.width;break;case this.thermometerFill:this.thermometerFillWidth=e.contentRect.width;break}}setupResizeObserver(e){var t;!(!((t=this.shadowRoot)===null||t===void 0)&&t.host)||!e||(e.addObserver({handler:this,target:this.shadowRoot.host}),e.addObserver({handler:this,target:this.thermometerFill}),this.observeCurrentAmountResize(e))}disconnectResizeObserver(e){var t;!(!((t=this.shadowRoot)===null||t===void 0)&&t.host)||!e||(e.removeObserver({handler:this,target:this.shadowRoot.host}),e.removeObserver({handler:this,target:this.thermometerFill}),this.unobserveCurrentAmountResize(e))}observeCurrentAmountResize(e){!this.thermometerValue||!e||e?.addObserver({handler:this,target:this.thermometerValue})}unobserveCurrentAmountResize(e){!this.thermometerValue||!e||e?.removeObserver({handler:this,target:this.thermometerValue})}get goalMessage(){return this.currentAmount>=this.goalAmount?this.goalReachedMessage:this.goalNearMessage}get currentAmountDisplayValue(){return this.formatNumber(this.currentAmount)}get goalAmountDisplayValue(){return this.formatNumber(this.goalAmount)}formatNumber(e){if(e===0)return"$0";const t="MM",i=e/1e6,n=i<10;let o=0;return n?o=Math.round((i+Number.EPSILON)*10)/10:o=Math.round(i),`$${o}${t}`}get currentGoalMessage(){switch(this.goalMessageMode){case"amount":return`${this.goalAmountDisplayValue} goal`;case"message":return this.goalMessage;case"off":return""}}get percentComplete(){return Math.min(this.currentAmount/this.goalAmount*100,100)}static get styles(){const e=f`var(--bannerThermometerHeight, 20px)`,t=f`var(--bannerThermometerCurrentValueLeftColor, #fff)`,r=f`var(--bannerThermometerProgressColor, #23765D)`,i=f`var(--bannerThermometerCurrentValueRightColor, ${r})`,n=f`var(--bannerThermometerBackgroundColor, #B8F5E2)`,o=f`var(--bannerThermometerBorder, 1px solid ${r})`,h=f`var(--bannerThermometerBorderRadius, calc(${e} / 2))`,l=f`var(--bannerThermometerGoalMessagePadding, 0 10px)`,a=f`var(--bannerThermometerGoalValueColor, #2c2c2c)`;return f`
      :host {
        display: block;
      }

      .container {
        height: 100%;
      }

      .thermometer-message-container {
        height: 100%;
        display: flex;
        align-items: center;
      }

      .thermometer-container {
        height: 100%;
        flex: 1;
      }

      .thermometer-background {
        background-color: ${n};
        padding: 0;
        height: 100%;
        border-radius: ${h};
        border: ${o};
        overflow: hidden;
        display: flex;
        align-items: center;
      }

      .thermometer-fill {
        background-color: ${r};
        text-align: right;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }

      .thermometer-value {
        font-weight: bold;
      }

      .value-left .thermometer-value {
        color: ${t};
        padding: 0 0.5rem 0 1rem;
      }

      .value-right .thermometer-value {
        color: ${i};
        padding: 0 1rem 0 0.5rem;
      }

      .donate-goal {
        text-align: left;
        padding: ${l};
        text-transform: uppercase;
        font-weight: bold;
        color: ${a};
      }
    `}};v([C({type:String})],g.prototype,"goalMessageMode",void 0);v([C({type:String})],g.prototype,"goalNearMessage",void 0);v([C({type:String})],g.prototype,"goalReachedMessage",void 0);v([C({type:Number})],g.prototype,"goalAmount",void 0);v([C({type:String})],g.prototype,"currentAmountMode",void 0);v([C({type:Number})],g.prototype,"currentAmount",void 0);v([C({type:Object})],g.prototype,"resizeObserver",void 0);v([N(".thermometer-value")],g.prototype,"thermometerValue",void 0);v([N(".thermometer-fill")],g.prototype,"thermometerFill",void 0);v([ee()],g.prototype,"thermometerValueWidth",void 0);v([ee()],g.prototype,"thermometerFillWidth",void 0);g=v([Je("donation-banner-thermometer")],g);class Ct{constructor(){this.resizeObserver=new ResizeObserver(e=>{window.requestAnimationFrame(()=>{for(const t of e){const r=this.resizeHandlers.get(t.target);r?.forEach(i=>{i.handleResize(t)})}})}),this.resizeHandlers=new Map}shutdown(){this.resizeHandlers.forEach((e,t)=>{this.resizeObserver.unobserve(t)}),this.resizeHandlers.clear()}addObserver(e){var t;const r=(t=this.resizeHandlers.get(e.target))!==null&&t!==void 0?t:new Set;r.add(e.handler),this.resizeHandlers.set(e.target,r),this.resizeObserver.observe(e.target,e.options)}removeObserver(e){const t=this.resizeHandlers.get(e.target);t&&(t.delete(e.handler),t.size===0&&(this.resizeObserver.unobserve(e.target),this.resizeHandlers.delete(e.target)))}}let _=class extends T{constructor(){super(...arguments),this.defaultGoal=65e5,this.defaultCurrentAmount=235e4,this.resizeObserver=new Ct}render(){return I`
      <div class="thermometer-container">
        <donation-banner-thermometer
          id="thermometer"
          .currentAmount=${this.defaultCurrentAmount}
          .goalAmount=${this.defaultGoal}
          .resizeObserver=${this.resizeObserver}
        >
        </donation-banner-thermometer>
      </div>

      <fieldset>
        <legend>Config</legend>
        <dl>
          <dt><label for="goalInput">Set Goal</label></dt>
          <dd>
            <input
              type="text"
              id="goalInput"
              @input=${this.setGoal}
              value=${this.defaultGoal}
            />
          </dd>

          <dt><label for="setGoal">Set Current Amount</label></dt>
          <dd>
            <input
              type="text"
              id="currentAmountInput"
              @input=${this.setCurrentAmount}
              value=${this.defaultCurrentAmount}
            />
            <input
              type="range"
              id="currentAmountSlider"
              @input=${this.setCurrentAmountSlider}
              min="0"
              max="${this.defaultGoal}"
            />
          </dd>

          <dt><label>Current Amount Mode</label></dt>
          <dd>
            <label>
              <input
                type="radio"
                name="currentAmountModeRadio"
                value="on"
                @click=${this.changeCurrentAmountMode}
                checked
              />
              On
            </label>
            <label>
              <input
                type="radio"
                name="currentAmountModeRadio"
                value="off"
                @click=${this.changeCurrentAmountMode}
              />
              Off
            </label>
          </dd>

          <dt><label>Goal Mode</label></dt>
          <dd>
            <label>
              <input
                type="radio"
                name="goalModeRadio"
                value="off"
                @click=${this.changeGoalMode}
              />
              Off
            </label>
            <label>
              <input
                type="radio"
                name="goalModeRadio"
                value="amount"
                @click=${this.changeGoalMode}
                checked
              />
              Amount
            </label>
            <label>
              <input
                type="radio"
                name="goalModeRadio"
                value="message"
                @click=${this.changeGoalMode}
              />
              Message
            </label>
          </dd>

          <dt><label for="goalMet">Goal Message</label></dt>
          <dd>
            <div>
              <label>Goal Met Message:</label>
              <input
                type="text"
                id="goalMetMessage"
                @input=${this.goalMetMessage}
                value="We've reached our goal!"
              />
            </div>
            <div>
              <label>Goal Near Message:</label>
              <input
                type="text"
                id="goalNearMessage"
                @input=${this.goalNearMessage}
                value="We’ve almost reached our goal!"
              />
            </div>
          </dd>

          <dt><label for="borderColor">Thermometer Border</label></dt>
          <dd>
            <input
              type="text"
              id="borderColor"
              @input=${this.changeBorderColor}
              value="1px solid #31A481"
            />
          </dd>

          <dt><label for="backgroundColor">Background Color</label></dt>
          <dd>
            <input
              type="text"
              id="backgroundColor"
              @input=${this.changeBackgroundColor}
              value="#D1FAED"
            />
          </dd>

          <dt><label for="fillColor">Fill Color</label></dt>
          <dd>
            <input
              type="text"
              id="fillColor"
              @input=${this.changeFillColor}
              value="#31A481"
            />
          </dd>

          <dt><label for="thermometerHeight">Thermometer Height</label></dt>
          <dd>
            <input
              type="range"
              id="thermometerHeight"
              @input=${this.changeThermometerHeight}
              min="10"
              max="100"
              value="20"
            />
            <span id="thermometerHeightValue">20px</span>
          </dd>
        </dl>
      </fieldset>
    `}changeThermometerHeight(e){if(!e.target)return;const t=e.target.value;this.thermometer.style.height=t+"px";const r=parseFloat(t);this.thermometerHeightValue.innerHTML=`${Math.round(r)}px`}changeGoalMode(e){if(!e.target)return;const r=e.target.value;this.thermometer.goalMessageMode=r}changeCurrentAmountMode(e){if(!e.target)return;const r=e.target.value;this.thermometer.currentAmountMode=r}setGoal(e){if(!e.target)return;const t=e.target.value;this.currentAmountSlider.max=t,this.thermometer.goalAmount=parseFloat(t)}setCurrentAmount(e){if(!e.target)return;const t=e.target.value;this.thermometer.currentAmount=parseFloat(t)}setCurrentAmountSlider(e){if(!e.target)return;const t=e.target.value;this.currentAmountInput.value=t,this.thermometer.currentAmount=parseFloat(t)}goalMetMessage(e){if(!e.target)return;const t=e.target.value;this.thermometer.goalReachedMessage=t}goalNearMessage(e){if(!e.target)return;const t=e.target.value;this.thermometer.goalNearMessage=t}changeBorderColor(e){if(!e.target)return;const t=e.target.value;this.thermometer.style.setProperty("--bannerThermometerBorder",t)}changeFillColor(e){if(!e.target)return;const t=e.target.value;this.thermometer.style.setProperty("--bannerThermometerProgressColor",t)}changeBackgroundColor(e){if(!e.target)return;const t=e.target.value;this.thermometer.style.setProperty("--bannerThermometerBackgroundColor",t)}changeMarkerBorder(e){if(!e.target)return;const t=e.target.value;this.thermometer.style.setProperty("--bannerThermometerMarkerBorder",t)}static get styles(){return f`
      #thermometer {
        height: 20px;
      }

      .thermometer-container {
        margin-bottom: 2rem;
      }
    `}};v([N("#thermometer")],_.prototype,"thermometer",void 0);v([N("#thermometerHeightValue")],_.prototype,"thermometerHeightValue",void 0);v([N("#currentAmountSlider")],_.prototype,"currentAmountSlider",void 0);v([N("#currentAmountInput")],_.prototype,"currentAmountInput",void 0);v([N("#goalInput")],_.prototype,"goalInput",void 0);v([ee()],_.prototype,"defaultGoal",void 0);v([ee()],_.prototype,"defaultCurrentAmount",void 0);_=v([Je("app-root")],_);
