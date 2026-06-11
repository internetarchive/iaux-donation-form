const He=window,ut=He.ShadowRoot&&(He.ShadyCSS===void 0||He.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ht=Symbol(),yt=new WeakMap;let zt=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==ht)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(ut&&e===void 0){const o=t!==void 0&&t.length===1;o&&(e=yt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&yt.set(t,e))}return e}toString(){return this.cssText}};const so=i=>new zt(typeof i=="string"?i:i+"",void 0,ht),h=(i,...e)=>{const t=i.length===1?i[0]:e.reduce(((o,n,a)=>o+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[a+1]),i[0]);return new zt(t,i,ht)},lo=(i,e)=>{ut?i.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((t=>{const o=document.createElement("style"),n=He.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=t.cssText,i.appendChild(o)}))},ft=ut?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return so(t)})(i):i;var We;const Re=window,bt=Re.trustedTypes,co=bt?bt.emptyScript:"",Ct=Re.reactiveElementPolyfillSupport,it={toAttribute(i,e){switch(e){case Boolean:i=i?co:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},Vt=(i,e)=>e!==i&&(e==e||i==i),Ye={attribute:!0,type:String,converter:it,reflect:!1,hasChanged:Vt},at="finalized";let ce=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var t;this.finalize(),((t=this.h)!==null&&t!==void 0?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,o)=>{const n=this._$Ep(o,t);n!==void 0&&(this._$Ev.set(n,o),e.push(n))})),e}static createProperty(e,t=Ye){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const o=typeof e=="symbol"?Symbol():"__"+e,n=this.getPropertyDescriptor(e,o,t);n!==void 0&&Object.defineProperty(this.prototype,e,n)}}static getPropertyDescriptor(e,t,o){return{get(){return this[t]},set(n){const a=this[e];this[t]=n,this.requestUpdate(e,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||Ye}static finalize(){if(this.hasOwnProperty(at))return!1;this[at]=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),e.h!==void 0&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,o=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const n of o)this.createProperty(n,t[n])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const n of o)t.unshift(ft(n))}else e!==void 0&&t.push(ft(e));return t}static _$Ep(e,t){const o=t.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(e=this.constructor.h)===null||e===void 0||e.forEach((t=>t(this)))}addController(e){var t,o;((t=this._$ES)!==null&&t!==void 0?t:this._$ES=[]).push(e),this.renderRoot!==void 0&&this.isConnected&&((o=e.hostConnected)===null||o===void 0||o.call(e))}removeController(e){var t;(t=this._$ES)===null||t===void 0||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;const t=(e=this.shadowRoot)!==null&&e!==void 0?e:this.attachShadow(this.constructor.shadowRootOptions);return lo(t,this.constructor.elementStyles),t}connectedCallback(){var e;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$ES)===null||e===void 0||e.forEach((t=>{var o;return(o=t.hostConnected)===null||o===void 0?void 0:o.call(t)}))}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$ES)===null||e===void 0||e.forEach((t=>{var o;return(o=t.hostDisconnected)===null||o===void 0?void 0:o.call(t)}))}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$EO(e,t,o=Ye){var n;const a=this.constructor._$Ep(e,o);if(a!==void 0&&o.reflect===!0){const r=(((n=o.converter)===null||n===void 0?void 0:n.toAttribute)!==void 0?o.converter:it).toAttribute(t,o.type);this._$El=e,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$El=null}}_$AK(e,t){var o;const n=this.constructor,a=n._$Ev.get(e);if(a!==void 0&&this._$El!==a){const r=n.getPropertyOptions(a),u=typeof r.converter=="function"?{fromAttribute:r.converter}:((o=r.converter)===null||o===void 0?void 0:o.fromAttribute)!==void 0?r.converter:it;this._$El=a,this[a]=u.fromAttribute(t,r.type),this._$El=null}}requestUpdate(e,t,o){let n=!0;e!==void 0&&(((o=o||this.constructor.getPropertyOptions(e)).hasChanged||Vt)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),o.reflect===!0&&this._$El!==e&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(e,o))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((n,a)=>this[a]=n)),this._$Ei=void 0);let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),(e=this._$ES)===null||e===void 0||e.forEach((n=>{var a;return(a=n.hostUpdate)===null||a===void 0?void 0:a.call(n)})),this.update(o)):this._$Ek()}catch(n){throw t=!1,this._$Ek(),n}t&&this._$AE(o)}willUpdate(e){}_$AE(e){var t;(t=this._$ES)===null||t===void 0||t.forEach((o=>{var n;return(n=o.hostUpdated)===null||n===void 0?void 0:n.call(o)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){this._$EC!==void 0&&(this._$EC.forEach(((t,o)=>this._$EO(o,this[o],t))),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};ce[at]=!0,ce.elementProperties=new Map,ce.elementStyles=[],ce.shadowRootOptions={mode:"open"},Ct?.({ReactiveElement:ce}),((We=Re.reactiveElementVersions)!==null&&We!==void 0?We:Re.reactiveElementVersions=[]).push("1.6.3");var Ze;const Oe=window,ue=Oe.trustedTypes,wt=ue?ue.createPolicy("lit-html",{createHTML:i=>i}):void 0,rt="$lit$",U=`lit$${(Math.random()+"").slice(9)}$`,Ut="?"+U,uo=`<${Ut}>`,ae=document,ze=()=>ae.createComment(""),Me=i=>i===null||typeof i!="object"&&typeof i!="function",qt=Array.isArray,ho=i=>qt(i)||typeof i?.[Symbol.iterator]=="function",Je=`[ 	
\f\r]`,Ce=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,St=/-->/g,$t=/>/g,Z=RegExp(`>|${Je}(?:([^\\s"'>=/]+)(${Je}*=${Je}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Mt=/'/g,At=/"/g,jt=/^(?:script|style|textarea|title)$/i,Ae=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),Pt=new WeakMap,te=ae.createTreeWalker(ae,129,null,!1);function Gt(i,e){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return wt!==void 0?wt.createHTML(e):e}const mo=(i,e)=>{const t=i.length-1,o=[];let n,a=e===2?"<svg>":"",r=Ce;for(let u=0;u<t;u++){const s=i[u];let l,c,m=-1,y=0;for(;y<s.length&&(r.lastIndex=y,c=r.exec(s),c!==null);)y=r.lastIndex,r===Ce?c[1]==="!--"?r=St:c[1]!==void 0?r=$t:c[2]!==void 0?(jt.test(c[2])&&(n=RegExp("</"+c[2],"g")),r=Z):c[3]!==void 0&&(r=Z):r===Z?c[0]===">"?(r=n??Ce,m=-1):c[1]===void 0?m=-2:(m=r.lastIndex-c[2].length,l=c[1],r=c[3]===void 0?Z:c[3]==='"'?At:Mt):r===At||r===Mt?r=Z:r===St||r===$t?r=Ce:(r=Z,n=void 0);const f=r===Z&&i[u+1].startsWith("/>")?" ":"";a+=r===Ce?s+uo:m>=0?(o.push(l),s.slice(0,m)+rt+s.slice(m)+U+f):s+U+(m===-2?(o.push(void 0),u):f)}return[Gt(i,a+(i[t]||"<?>")+(e===2?"</svg>":"")),o]};let st=class Kt{constructor({strings:e,_$litType$:t},o){let n;this.parts=[];let a=0,r=0;const u=e.length-1,s=this.parts,[l,c]=mo(e,t);if(this.el=Kt.createElement(l,o),te.currentNode=this.el.content,t===2){const m=this.el.content,y=m.firstChild;y.remove(),m.append(...y.childNodes)}for(;(n=te.nextNode())!==null&&s.length<u;){if(n.nodeType===1){if(n.hasAttributes()){const m=[];for(const y of n.getAttributeNames())if(y.endsWith(rt)||y.startsWith(U)){const f=c[r++];if(m.push(y),f!==void 0){const _=n.getAttribute(f.toLowerCase()+rt).split(U),S=/([.?@])?(.*)/.exec(f);s.push({type:1,index:a,name:S[2],strings:_,ctor:S[1]==="."?vo:S[1]==="?"?yo:S[1]==="@"?fo:Ue})}else s.push({type:6,index:a})}for(const y of m)n.removeAttribute(y)}if(jt.test(n.tagName)){const m=n.textContent.split(U),y=m.length-1;if(y>0){n.textContent=ue?ue.emptyScript:"";for(let f=0;f<y;f++)n.append(m[f],ze()),te.nextNode(),s.push({type:2,index:++a});n.append(m[y],ze())}}}else if(n.nodeType===8)if(n.data===Ut)s.push({type:2,index:a});else{let m=-1;for(;(m=n.data.indexOf(U,m+1))!==-1;)s.push({type:7,index:a}),m+=U.length-1}a++}}static createElement(e,t){const o=ae.createElement("template");return o.innerHTML=e,o}};function he(i,e,t=i,o){var n,a,r,u;if(e===Ae)return e;let s=o!==void 0?(n=t._$Co)===null||n===void 0?void 0:n[o]:t._$Cl;const l=Me(e)?void 0:e._$litDirective$;return s?.constructor!==l&&((a=s?._$AO)===null||a===void 0||a.call(s,!1),l===void 0?s=void 0:(s=new l(i),s._$AT(i,t,o)),o!==void 0?((r=(u=t)._$Co)!==null&&r!==void 0?r:u._$Co=[])[o]=s:t._$Cl=s),s!==void 0&&(e=he(i,s._$AS(i,e.values),s,o)),e}let po=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;const{el:{content:o},parts:n}=this._$AD,a=((t=e?.creationScope)!==null&&t!==void 0?t:ae).importNode(o,!0);te.currentNode=a;let r=te.nextNode(),u=0,s=0,l=n[0];for(;l!==void 0;){if(u===l.index){let c;l.type===2?c=new Wt(r,r.nextSibling,this,e):l.type===1?c=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(c=new bo(r,this,e)),this._$AV.push(c),l=n[++s]}u!==l?.index&&(r=te.nextNode(),u++)}return te.currentNode=ae,a}v(e){let t=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}},Wt=class Yt{constructor(e,t,o,n){var a;this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=n,this._$Cp=(a=n?.isConnected)===null||a===void 0||a}get _$AU(){var e,t;return(t=(e=this._$AM)===null||e===void 0?void 0:e._$AU)!==null&&t!==void 0?t:this._$Cp}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=he(this,e,t),Me(e)?e===E||e==null||e===""?(this._$AH!==E&&this._$AR(),this._$AH=E):e!==this._$AH&&e!==Ae&&this._(e):e._$litType$!==void 0?this.g(e):e.nodeType!==void 0?this.$(e):ho(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==E&&Me(this._$AH)?this._$AA.nextSibling.data=e:this.$(ae.createTextNode(e)),this._$AH=e}g(e){var t;const{values:o,_$litType$:n}=e,a=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=st.createElement(Gt(n.h,n.h[0]),this.options)),n);if(((t=this._$AH)===null||t===void 0?void 0:t._$AD)===a)this._$AH.v(o);else{const r=new po(a,this),u=r.u(this.options);r.v(o),this.$(u),this._$AH=r}}_$AC(e){let t=Pt.get(e.strings);return t===void 0&&Pt.set(e.strings,t=new st(e)),t}T(e){qt(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,n=0;for(const a of e)n===t.length?t.push(o=new Yt(this.k(ze()),this.k(ze()),this,this.options)):o=t[n],o._$AI(a),n++;n<t.length&&(this._$AR(o&&o._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var o;for((o=this._$AP)===null||o===void 0||o.call(this,!1,!0,t);e&&e!==this._$AB;){const n=e.nextSibling;e.remove(),e=n}}setConnected(e){var t;this._$AM===void 0&&(this._$Cp=e,(t=this._$AP)===null||t===void 0||t.call(this,e))}},Ue=class{constructor(e,t,o,n,a){this.type=1,this._$AH=E,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=a,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=E}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,o,n){const a=this.strings;let r=!1;if(a===void 0)e=he(this,e,t,0),r=!Me(e)||e!==this._$AH&&e!==Ae,r&&(this._$AH=e);else{const u=e;let s,l;for(e=a[0],s=0;s<a.length-1;s++)l=he(this,u[o+s],t,s),l===Ae&&(l=this._$AH[s]),r||(r=!Me(l)||l!==this._$AH[s]),l===E?e=E:e!==E&&(e+=(l??"")+a[s+1]),this._$AH[s]=l}r&&!n&&this.j(e)}j(e){e===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},vo=class extends Ue{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===E?void 0:e}};const go=ue?ue.emptyScript:"";let yo=class extends Ue{constructor(){super(...arguments),this.type=4}j(e){e&&e!==E?this.element.setAttribute(this.name,go):this.element.removeAttribute(this.name)}},fo=class extends Ue{constructor(e,t,o,n,a){super(e,t,o,n,a),this.type=5}_$AI(e,t=this){var o;if((e=(o=he(this,e,t,0))!==null&&o!==void 0?o:E)===Ae)return;const n=this._$AH,a=e===E&&n!==E||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,r=e!==E&&(n===E||a);a&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,o;typeof this._$AH=="function"?this._$AH.call((o=(t=this.options)===null||t===void 0?void 0:t.host)!==null&&o!==void 0?o:this.element,e):this._$AH.handleEvent(e)}},bo=class{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){he(this,e)}};const It=Oe.litHtmlPolyfillSupport;It?.(st,Wt),((Ze=Oe.litHtmlVersions)!==null&&Ze!==void 0?Ze:Oe.litHtmlVersions=[]).push("2.8.0");var Qe;const Ve=window,me=Ve.trustedTypes,Ft=me?me.createPolicy("lit-html",{createHTML:i=>i}):void 0,lt="$lit$",q=`lit$${(Math.random()+"").slice(9)}$`,Zt="?"+q,Co=`<${Zt}>`,re=document,Pe=()=>re.createComment(""),Ie=i=>i===null||typeof i!="object"&&typeof i!="function",Jt=Array.isArray,wo=i=>Jt(i)||typeof i?.[Symbol.iterator]=="function",Xe=`[ 	
\f\r]`,we=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Et=/-->/g,_t=/>/g,J=RegExp(`>|${Xe}(?:([^\\s"'>=/]+)(${Xe}*=${Xe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),kt=/'/g,Tt=/"/g,Qt=/^(?:script|style|textarea|title)$/i,So=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),g=So(1),pe=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),xt=new WeakMap,oe=re.createTreeWalker(re,129,null,!1);function Xt(i,e){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ft!==void 0?Ft.createHTML(e):e}const $o=(i,e)=>{const t=i.length-1,o=[];let n,a=e===2?"<svg>":"",r=we;for(let u=0;u<t;u++){const s=i[u];let l,c,m=-1,y=0;for(;y<s.length&&(r.lastIndex=y,c=r.exec(s),c!==null);)y=r.lastIndex,r===we?c[1]==="!--"?r=Et:c[1]!==void 0?r=_t:c[2]!==void 0?(Qt.test(c[2])&&(n=RegExp("</"+c[2],"g")),r=J):c[3]!==void 0&&(r=J):r===J?c[0]===">"?(r=n??we,m=-1):c[1]===void 0?m=-2:(m=r.lastIndex-c[2].length,l=c[1],r=c[3]===void 0?J:c[3]==='"'?Tt:kt):r===Tt||r===kt?r=J:r===Et||r===_t?r=we:(r=J,n=void 0);const f=r===J&&i[u+1].startsWith("/>")?" ":"";a+=r===we?s+Co:m>=0?(o.push(l),s.slice(0,m)+lt+s.slice(m)+q+f):s+q+(m===-2?(o.push(void 0),u):f)}return[Xt(i,a+(i[t]||"<?>")+(e===2?"</svg>":"")),o]};class Fe{constructor({strings:e,_$litType$:t},o){let n;this.parts=[];let a=0,r=0;const u=e.length-1,s=this.parts,[l,c]=$o(e,t);if(this.el=Fe.createElement(l,o),oe.currentNode=this.el.content,t===2){const m=this.el.content,y=m.firstChild;y.remove(),m.append(...y.childNodes)}for(;(n=oe.nextNode())!==null&&s.length<u;){if(n.nodeType===1){if(n.hasAttributes()){const m=[];for(const y of n.getAttributeNames())if(y.endsWith(lt)||y.startsWith(q)){const f=c[r++];if(m.push(y),f!==void 0){const _=n.getAttribute(f.toLowerCase()+lt).split(q),S=/([.?@])?(.*)/.exec(f);s.push({type:1,index:a,name:S[2],strings:_,ctor:S[1]==="."?Ao:S[1]==="?"?Io:S[1]==="@"?Fo:qe})}else s.push({type:6,index:a})}for(const y of m)n.removeAttribute(y)}if(Qt.test(n.tagName)){const m=n.textContent.split(q),y=m.length-1;if(y>0){n.textContent=me?me.emptyScript:"";for(let f=0;f<y;f++)n.append(m[f],Pe()),oe.nextNode(),s.push({type:2,index:++a});n.append(m[y],Pe())}}}else if(n.nodeType===8)if(n.data===Zt)s.push({type:2,index:a});else{let m=-1;for(;(m=n.data.indexOf(q,m+1))!==-1;)s.push({type:7,index:a}),m+=q.length-1}a++}}static createElement(e,t){const o=re.createElement("template");return o.innerHTML=e,o}}function ve(i,e,t=i,o){var n,a,r,u;if(e===pe)return e;let s=o!==void 0?(n=t._$Co)===null||n===void 0?void 0:n[o]:t._$Cl;const l=Ie(e)?void 0:e._$litDirective$;return s?.constructor!==l&&((a=s?._$AO)===null||a===void 0||a.call(s,!1),l===void 0?s=void 0:(s=new l(i),s._$AT(i,t,o)),o!==void 0?((r=(u=t)._$Co)!==null&&r!==void 0?r:u._$Co=[])[o]=s:t._$Cl=s),s!==void 0&&(e=ve(i,s._$AS(i,e.values),s,o)),e}class Mo{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;const{el:{content:o},parts:n}=this._$AD,a=((t=e?.creationScope)!==null&&t!==void 0?t:re).importNode(o,!0);oe.currentNode=a;let r=oe.nextNode(),u=0,s=0,l=n[0];for(;l!==void 0;){if(u===l.index){let c;l.type===2?c=new ke(r,r.nextSibling,this,e):l.type===1?c=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(c=new Eo(r,this,e)),this._$AV.push(c),l=n[++s]}u!==l?.index&&(r=oe.nextNode(),u++)}return oe.currentNode=re,a}v(e){let t=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}}class ke{constructor(e,t,o,n){var a;this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=n,this._$Cp=(a=n?.isConnected)===null||a===void 0||a}get _$AU(){var e,t;return(t=(e=this._$AM)===null||e===void 0?void 0:e._$AU)!==null&&t!==void 0?t:this._$Cp}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ve(this,e,t),Ie(e)?e===$||e==null||e===""?(this._$AH!==$&&this._$AR(),this._$AH=$):e!==this._$AH&&e!==pe&&this._(e):e._$litType$!==void 0?this.g(e):e.nodeType!==void 0?this.$(e):wo(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==$&&Ie(this._$AH)?this._$AA.nextSibling.data=e:this.$(re.createTextNode(e)),this._$AH=e}g(e){var t;const{values:o,_$litType$:n}=e,a=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=Fe.createElement(Xt(n.h,n.h[0]),this.options)),n);if(((t=this._$AH)===null||t===void 0?void 0:t._$AD)===a)this._$AH.v(o);else{const r=new Mo(a,this),u=r.u(this.options);r.v(o),this.$(u),this._$AH=r}}_$AC(e){let t=xt.get(e.strings);return t===void 0&&xt.set(e.strings,t=new Fe(e)),t}T(e){Jt(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,n=0;for(const a of e)n===t.length?t.push(o=new ke(this.k(Pe()),this.k(Pe()),this,this.options)):o=t[n],o._$AI(a),n++;n<t.length&&(this._$AR(o&&o._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var o;for((o=this._$AP)===null||o===void 0||o.call(this,!1,!0,t);e&&e!==this._$AB;){const n=e.nextSibling;e.remove(),e=n}}setConnected(e){var t;this._$AM===void 0&&(this._$Cp=e,(t=this._$AP)===null||t===void 0||t.call(this,e))}}class qe{constructor(e,t,o,n,a){this.type=1,this._$AH=$,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=a,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=$}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,o,n){const a=this.strings;let r=!1;if(a===void 0)e=ve(this,e,t,0),r=!Ie(e)||e!==this._$AH&&e!==pe,r&&(this._$AH=e);else{const u=e;let s,l;for(e=a[0],s=0;s<a.length-1;s++)l=ve(this,u[o+s],t,s),l===pe&&(l=this._$AH[s]),r||(r=!Ie(l)||l!==this._$AH[s]),l===$?e=$:e!==$&&(e+=(l??"")+a[s+1]),this._$AH[s]=l}r&&!n&&this.j(e)}j(e){e===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ao extends qe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===$?void 0:e}}const Po=me?me.emptyScript:"";class Io extends qe{constructor(){super(...arguments),this.type=4}j(e){e&&e!==$?this.element.setAttribute(this.name,Po):this.element.removeAttribute(this.name)}}class Fo extends qe{constructor(e,t,o,n,a){super(e,t,o,n,a),this.type=5}_$AI(e,t=this){var o;if((e=(o=ve(this,e,t,0))!==null&&o!==void 0?o:$)===pe)return;const n=this._$AH,a=e===$&&n!==$||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,r=e!==$&&(n===$||a);a&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,o;typeof this._$AH=="function"?this._$AH.call((o=(t=this.options)===null||t===void 0?void 0:t.host)!==null&&o!==void 0?o:this.element,e):this._$AH.handleEvent(e)}}class Eo{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){ve(this,e)}}const Dt=Ve.litHtmlPolyfillSupport;Dt?.(Fe,ke),((Qe=Ve.litHtmlVersions)!==null&&Qe!==void 0?Qe:Ve.litHtmlVersions=[]).push("2.8.0");const _o=(i,e,t)=>{var o,n;const a=(o=t?.renderBefore)!==null&&o!==void 0?o:e;let r=a._$litPart$;if(r===void 0){const u=(n=t?.renderBefore)!==null&&n!==void 0?n:null;a._$litPart$=r=new ke(e.insertBefore(Pe(),u),u,void 0,t??{})}return r._$AI(i),r};var et,tt;class I extends ce{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;const o=super.createRenderRoot();return(e=(t=this.renderOptions).renderBefore)!==null&&e!==void 0||(t.renderBefore=o.firstChild),o}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=_o(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!1)}render(){return pe}}I.finalized=!0,I._$litElement$=!0,(et=globalThis.litElementHydrateSupport)===null||et===void 0||et.call(globalThis,{LitElement:I});const Bt=globalThis.litElementPolyfillSupport;Bt?.({LitElement:I});((tt=globalThis.litElementVersions)!==null&&tt!==void 0?tt:globalThis.litElementVersions=[]).push("3.3.3");var j;(function(i){i.Development="dev",i.Production="prod"})(j||(j={}));function d(i,e,t,o){var n=arguments.length,a=n<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(i,e,t,o);else for(var u=i.length-1;u>=0;u--)(r=i[u])&&(a=(n<3?r(a):n>3?r(e,t,a):r(e,t))||a);return n>3&&a&&Object.defineProperty(e,t,a),a}function p(i,e,t,o){function n(a){return a instanceof t?a:new t(function(r){r(a)})}return new(t||(t=Promise))(function(a,r){function u(c){try{l(o.next(c))}catch(m){r(m)}}function s(c){try{l(o.throw(c))}catch(m){r(m)}}function l(c){c.done?a(c.value):n(c.value).then(u,s)}l((o=o.apply(i,e||[])).next())})}const D=i=>e=>typeof e=="function"?((t,o)=>(customElements.define(t,o),o))(i,e):((t,o)=>{const{kind:n,elements:a}=o;return{kind:n,elements:a,finisher(r){customElements.define(t,r)}}})(i,e);const ko=(i,e)=>e.kind==="method"&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(t){t.createProperty(e.key,i)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){typeof e.initializer=="function"&&(this[e.key]=e.initializer.call(this))},finisher(t){t.createProperty(e.key,i)}},To=(i,e,t)=>{e.constructor.createProperty(t,i)};function v(i){return(e,t)=>t!==void 0?To(i,e,t):ko(i,e)}function eo(i){return v({...i,state:!0})}const xo=({finisher:i,descriptor:e})=>(t,o)=>{var n;if(o===void 0){const a=(n=t.originalKey)!==null&&n!==void 0?n:t.key,r=e!=null?{kind:"method",placement:"prototype",key:a,descriptor:e(t.key)}:{...t,key:a};return i!=null&&(r.finisher=function(u){i(u,a)}),r}{const a=t.constructor;e!==void 0&&Object.defineProperty(t,o,e(o)),i?.(a,o)}};function b(i,e){return xo({descriptor:t=>({get(){var n,a;return(a=(n=this.renderRoot)===null||n===void 0?void 0:n.querySelector(i))!==null&&a!==void 0?a:null},enumerable:!0,configurable:!0})})}var ot;((ot=window.HTMLSlotElement)===null||ot===void 0?void 0:ot.prototype.assignedElements)!=null;var Do={symbol:"$",separator:",",decimal:".",errorOnInvalid:!1,precision:2,pattern:"!#",negativePattern:"-!#",format:No,fromCents:!1},to=function(e){return Math.round(e)},mt=function(e){return Math.pow(10,e)},Bo=function(e,t){return to(e/t)*t},Lo=/(\d)(?=(\d{3})+\b)/g,Ho=/(\d)(?=(\d\d)+\d\b)/g;function k(i,e){var t=this;if(!(t instanceof k))return new k(i,e);var o=Object.assign({},Do,e),n=mt(o.precision),a=Ne(i,o);t.intValue=a,t.value=a/n,o.increment=o.increment||1/n,o.useVedic?o.groups=Ho:o.groups=Lo,this.s=o,this.p=n}function Ne(i,e){var t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!0,o=0,n=e.decimal,a=e.errorOnInvalid,r=e.precision,u=e.fromCents,s=mt(r),l=typeof i=="number",c=i instanceof k;if(c&&u)return i.intValue;if(l||c)o=c?i.value:i;else if(typeof i=="string"){var m=new RegExp("[^-\\d"+n+"]","g"),y=new RegExp("\\"+n,"g");o=i.replace(/\((.*)\)/,"-$1").replace(m,"").replace(y,"."),o=o||0}else{if(a)throw Error("Invalid Input");o=0}return u||(o*=s,o=o.toFixed(4)),t?to(o):o}function No(i,e){var t=e.pattern,o=e.negativePattern,n=e.symbol,a=e.separator,r=e.decimal,u=e.groups,s=(""+i).replace(/^-/,"").split("."),l=s[0],c=s[1];return(i.value>=0?t:o).replace("!",n).replace("#",l.replace(u,"$1"+a)+(c?r+c:""))}k.prototype={add:function(e){var t=this.intValue,o=this.s,n=this.p;return k((t+=Ne(e,o))/(o.fromCents?1:n),o)},subtract:function(e){var t=this.intValue,o=this.s,n=this.p;return k((t-=Ne(e,o))/(o.fromCents?1:n),o)},multiply:function(e){var t=this.intValue,o=this.s;return k((t*=e)/(o.fromCents?1:mt(o.precision)),o)},divide:function(e){var t=this.intValue,o=this.s;return k(t/=Ne(e,o,!1),o)},distribute:function(e){for(var t=this.intValue,o=this.p,n=this.s,a=[],r=Math[t>=0?"floor":"ceil"](t/e),u=Math.abs(t-r*e),s=n.fromCents?1:o;e!==0;e--){var l=k(r/s,n);u-- >0&&(l=l[t>=0?"add":"subtract"](1/s)),a.push(l)}return a},dollars:function(){return~~this.value},cents:function(){var e=this.intValue,t=this.p;return~~(e%t)},format:function(e){var t=this.s;return typeof e=="function"?e(this,t):t.format(this,Object.assign({},t,e))},toString:function(){var e=this.intValue,t=this.p,o=this.s;return Bo(e/t,o.increment).toFixed(o.precision)},toJSON:function(){return this.value}};let Ro=()=>({events:{},emit(i,...e){(this.events[i]||[]).forEach(t=>t(...e))},on(i,e){return(this.events[i]=this.events[i]||[]).push(e),()=>this.events[i]=(this.events[i]||[]).filter(t=>t!==e)}});function Oo(i){return new Promise(e=>setTimeout(e,i))}var R;(function(i){i.retryNumber="retryNumber",i.owner="owner",i.dynamicImportLoaded="dynamicImportLoaded",i.hasBeenRetried="hasBeenRetried"})(R||(R={}));const Lt="lazyLoaderService";class zo{constructor(e){var t,o,n;this.emitter=Ro(),this.container=(t=e?.container)!==null&&t!==void 0?t:document.head,this.retryCount=(o=e?.retryCount)!==null&&o!==void 0?o:2,this.retryInterval=(n=e?.retryInterval)!==null&&n!==void 0?n:1}on(e,t){return this.emitter.on(e,t)}loadBundle(e){return p(this,void 0,void 0,function*(){let t,o;return e.module&&(t=this.loadScript({src:e.module,bundleType:"module"})),e.nomodule&&(o=this.loadScript({src:e.nomodule,bundleType:"nomodule"})),Promise.race([t,o])})}loadScript(e){return p(this,void 0,void 0,function*(){return this.doLoad(e)})}doLoad(e){var t;return p(this,void 0,void 0,function*(){const o=(t=e.retryNumber)!==null&&t!==void 0?t:0,n=`script[src='${e.src}'][async][${R.owner}='${Lt}'][${R.retryNumber}='${o}']`;let a=this.container.querySelector(n);return a||(a=this.getScriptTag(Object.assign(Object.assign({},e),{retryNumber:o})),this.container.appendChild(a)),new Promise((r,u)=>{if(a.getAttribute(R.dynamicImportLoaded)){r();return}const s=e.scriptBeingRetried,l=a.onload||s?.onload;a.onload=m=>{l?.(m),a.setAttribute(R.dynamicImportLoaded,"true"),r()};const c=a.onerror||s?.onerror;a.onerror=m=>p(this,void 0,void 0,function*(){const y=a.getAttribute(R.hasBeenRetried);if(o<this.retryCount&&!y){a.setAttribute(R.hasBeenRetried,"true"),yield Oo(this.retryInterval*1e3);const f=o+1;this.emitter.emit("scriptLoadRetried",e.src,f),this.doLoad(Object.assign(Object.assign({},e),{retryNumber:f,scriptBeingRetried:a}))}else y||this.emitter.emit("scriptLoadFailed",e.src,m),c?.(m),u(m)})})})}getScriptTag(e){var t;const o=e.src.replace("'",'"'),n=document.createElement("script"),a=e.retryNumber;n.setAttribute(R.owner,Lt),n.setAttribute("src",o),n.setAttribute(R.retryNumber,a.toString()),n.async=!0;const r=(t=e.attributes)!==null&&t!==void 0?t:{};switch(Object.keys(r).forEach(u=>{n.setAttribute(u,r[u])}),e.bundleType){case"module":n.setAttribute("type",e.bundleType);break;case"nomodule":n.setAttribute(e.bundleType,"");break}return n}}class P{constructor(e){this.generator=e.generator}get(){return p(this,void 0,void 0,function*(){return this.cachedResponse?this.cachedResponse:this.previousPromise?(this.previousPromise=this.previousPromise.then(e=>e),this.previousPromise):(this.previousPromise=this.generateSingletonAndCache(),this.previousPromise)})}generateSingletonAndCache(){return p(this,void 0,void 0,function*(){const e=yield this.generator();return this.cachedResponse=e,e})}}class Vo{constructor(e,t){this.braintreeClient=new P({generator:()=>p(this,void 0,void 0,function*(){return yield this.loadBraintreeScript("client"),window.braintree.client})}),this.dataCollector=new P({generator:()=>p(this,void 0,void 0,function*(){return yield this.loadBraintreeScript("data-collector"),window.braintree.dataCollector})}),this.hostedFields=new P({generator:()=>p(this,void 0,void 0,function*(){return yield this.loadBraintreeScript("hosted-fields"),window.braintree.hostedFields})}),this.venmo=new P({generator:()=>p(this,void 0,void 0,function*(){return yield this.loadBraintreeScript("venmo"),window.braintree.venmo})}),this.payPal=new P({generator:()=>p(this,void 0,void 0,function*(){return yield this.loadBraintreeScript("paypal-checkout"),window.braintree.paypalCheckout})}),this.applePay=new P({generator:()=>p(this,void 0,void 0,function*(){return yield this.loadBraintreeScript("apple-pay"),window.braintree.applePay})}),this.googlePayBraintreeClient=new P({generator:()=>p(this,void 0,void 0,function*(){return yield this.loadBraintreeScript("google-payment"),window.braintree.googlePayment})}),this.googlePaymentsClient=new P({generator:()=>p(this,void 0,void 0,function*(){return yield this.lazyLoader.loadScript({src:"https://pay.google.com/gp/p/js/pay.js"}),new google.payments.api.PaymentsClient({environment:this.environment===j.Development?"TEST":"PRODUCTION"})})}),this.recaptchaLibrary=new P({generator:()=>new Promise(o=>{window.donationFormGrecaptchaLoadedCallback=()=>{setTimeout(()=>{delete window.donationFormGrecaptchaLoadedCallback},10),o(window.grecaptcha)},this.lazyLoader.loadScript({src:"https://www.google.com/recaptcha/api.js?onload=donationFormGrecaptchaLoadedCallback&render=explicit"})})}),this.paypalLibrary=new P({generator:()=>p(this,void 0,void 0,function*(){return yield this.lazyLoader.loadScript({src:"https://www.paypalobjects.com/api/checkout.js",attributes:{"data-version-4":"","log-level":"warn"}}),window.paypal})}),this.braintreeVersion="3.62.2",this.environment=j.Development,this.lazyLoader=e,this.environment=t}loadBraintreeScript(e){return p(this,void 0,void 0,function*(){const t=this.environment===j.Production?"min.js":"js",o=`${e}.${t}`,n=`https://js.braintreegateway.com/web/${this.braintreeVersion}/js/${o}`;yield this.lazyLoader.loadScript({src:n})})}}class Te{constructor(e){this.streetAddress=e?.streetAddress,this.extendedAddress=e?.extendedAddress,this.locality=e?.locality,this.region=e?.region,this.postalCode=e?.postalCode,this.countryCodeAlpha2=e?.countryCodeAlpha2}}class xe{constructor(e){this.email=e?.email,this.firstName=e?.firstName,this.lastName=e?.lastName}}class Uo{constructor(e){this.customer=e.customer,this.billing=e.billing}}var F;(function(i){i.CreditCard="Credit Card",i.PayPal="PayPal",i.GooglePay="Google Pay",i.Venmo="Venmo",i.ApplePay="Apple Pay"})(F||(F={}));class N{get feeAmountCovered(){return this.coverFees?this.fee:0}get fee(){return N.calculateFeeAmount(this.amount)}get total(){return N.calculateTotal(this.amount,this.coverFees)}static calculateTotal(e,t){const o=t?this.calculateFeeAmount(e):0,n=e+o;return isNaN(n)?0:this.roundAmount(n)}static calculateFeeAmount(e){const t=e*.0219+.29;return isNaN(t)?0:this.roundAmount(t)}static roundAmount(e){return Math.round(e*100)/100}constructor(e){this.donationType=e.donationType,this.amount=e.amount,this.coverFees=e.coverFees}}var w;(function(i){i.OneTime="one-time",i.Monthly="monthly",i.Upsell="up_sell"})(w||(w={}));class oo{constructor(e){this.logged_in_user=e?.logged_in_user,this.referrer=e?.referrer,this.fee_amount_covered=e?.fee_amount_covered,this.origin=e?.origin}}class qo{constructor(e){this.customFields=new oo,this.paymentProvider=e.paymentProvider,this.paymentMethodNonce=e.paymentMethodNonce,this.recaptchaToken=e.recaptchaToken,this.customerId=e.customerId,this.deviceData=e.deviceData,this.upsellOnetimeTransactionId=e.upsellOnetimeTransactionId,this.bin=e.bin,this.binName=e.binName,this.amount=e.amount,this.donationType=e.donationType,this.customer=e.customer,this.billing=e.billing,e.customFields&&(this.customFields=e.customFields)}}class jo{constructor(e){this.id=e.id}}class Go{constructor(e){this.paymentProvider=e.paymentProvider,this.paymentMethodNonce=e.paymentMethodNonce,this.amount=e.amount,this.donationType=e.donationType,this.transaction_id=e.transaction_id,this.customer_id=e.customer_id,this.customer=new xe(e.customer),this.billing=new Te(e.billing),e.subscription&&(this.subscription=new jo(e.subscription))}}class Ko{constructor(e){this.code=e.code,this.message=e.message}}class Wo{constructor(e){this.message=e.message;const{errors:t=[]}=e;this.errors=t.map(o=>new Ko(o))}}class Yo{constructor(e){this.success=e.success,this.success?this.value=new Go(e.value):this.value=new Wo(e.value)}}const je=[5,10,25,50,100,500,1e3],no=new N({donationType:w.OneTime,amount:10,coverFees:!1});let be=()=>({emit(i,...e){for(let t=this.events[i]||[],o=0,n=t.length;o<n;o++)t[o](...e)},events:{},on(i,e){return(this.events[i]||=[]).push(e),()=>{this.events[i]=this.events[i]?.filter(t=>e!==t)}}});class Zo extends Error{constructor(e){super(e),this.name="DonationFormError"}}class Jo{on(e,t){return this.emitter.on(e,t)}constructor(e){var t,o;this.instance=new P({generator:()=>p(this,void 0,void 0,function*(){const n=yield this.braintreeManager.instance.get();return yield this.createHostedFields(n)})}),this.emitter=be(),this.braintreeManager=e.braintreeManager,this.hostedFieldClient=e.hostedFieldClient,this.hostedFieldConfig=e.hostedFieldConfig,this.maxRetryCount=(t=e.maxRetryCount)!==null&&t!==void 0?t:2,this.loadTimeout=((o=e.loadTimeout)!==null&&o!==void 0?o:6)*1e3}createHostedFields(e){return p(this,arguments,void 0,function*(t,o=0){this.hostedFieldConfig.hostedFieldContainer.resetHostedFields();try{let n;const a=new Promise((s,l)=>{n=window.setTimeout(()=>{const c=new Zo("Timeout loading Hosted Fields");l(c)},this.loadTimeout)}),r=new Promise((s,l)=>p(this,void 0,void 0,function*(){try{const c=yield this.hostedFieldClient.create({client:t,styles:this.hostedFieldConfig.hostedFieldStyle,fields:this.hostedFieldConfig.hostedFieldFieldOptions});window.clearTimeout(n),s(c)}catch(c){c instanceof Error&&c.message.includes("Hosted Fields timed out")||l(c)}}));return yield Promise.race([a,r])}catch(n){if(o>=this.maxRetryCount)throw this.emitter.emit("hostedFieldsFailed",n),n;const a=o+1;return this.emitter.emit("hostedFieldsRetry",a),this.createHostedFields(t,a)}})}tokenizeHostedFields(){return p(this,void 0,void 0,function*(){const e=yield this.instance.get();return e?.tokenize()})}markFieldErrors(e){this.hostedFieldConfig.hostedFieldContainer.markFieldErrors(e)}removeFieldErrors(e){this.hostedFieldConfig.hostedFieldContainer.removeFieldErrors(e)}showErrorMessage(e){this.hostedFieldConfig.hostedFieldContainer.showErrorMessage(e)}hideErrorMessage(){this.hostedFieldConfig.hostedFieldContainer.hideErrorMessage()}}class Qo{constructor(e){this.session=e.session,this.donationInfo=e.donationInfo,this.applePayInstance=e.applePayInstance,this.braintreeManager=e.braintreeManager}onvalidatemerchant(e){return p(this,void 0,void 0,function*(){return new Promise((t,o)=>{this.applePayInstance.performValidation({validationURL:e.validationURL,displayName:"Internet Archive"},(n,a)=>{var r;n?((r=this.delegate)===null||r===void 0||r.paymentFailed(n),this.session.abort(),o(`Merchant validation error: ${n}`)):(this.session.completeMerchantValidation(a),t())})})})}oncancel(){return p(this,void 0,void 0,function*(){var e;(e=this.delegate)===null||e===void 0||e.paymentCancelled()})}onpaymentauthorized(e){return p(this,void 0,void 0,function*(){var t,o,n,a;let r;try{r=yield this.applePayInstance.tokenize({token:e.payment.token})}catch(S){(t=this.delegate)===null||t===void 0||t.paymentFailed(S),this.session.completePayment(ApplePaySession.STATUS_FAILURE);return}const u=e.payment,s=u.billingContact,l=u.shippingContact,c=s?.addressLines;let m,y;c&&(m=c[0],y=c[1]);const f=new Te({streetAddress:m,extendedAddress:y,locality:s?.locality,region:s?.administrativeArea,postalCode:s?.postalCode,countryCodeAlpha2:s?.countryCode}),_=new xe({email:l?.emailAddress,firstName:l?.givenName,lastName:l?.familyName});try{const S=yield this.braintreeManager.submitDonation({nonce:r.nonce,paymentProvider:F.ApplePay,donationInfo:this.donationInfo,billingInfo:f,customerInfo:_});S.success?((o=this.delegate)===null||o===void 0||o.paymentComplete(S),this.session.completePayment(ApplePaySession.STATUS_SUCCESS)):((n=this.delegate)===null||n===void 0||n.paymentFailed("Failure submitting data"),this.session.completePayment(ApplePaySession.STATUS_FAILURE))}catch(S){(a=this.delegate)===null||a===void 0||a.paymentFailed(S),this.session.completePayment(ApplePaySession.STATUS_FAILURE)}})}}class Xo{constructor(e){var t;this.braintreeManager=e.braintreeManager,this.applePayClient=e.applePayClient,this.applePaySessionManager=e.applePaySessionManager,this.instance=(t=e.instancePromisedSingleton)!==null&&t!==void 0?t:new P({generator:()=>p(this,void 0,void 0,function*(){if(!this.applePaySessionManager.canMakePayments())return;const o=yield this.braintreeManager.instance.get();return yield this.applePayClient.create({client:o})})})}isAvailable(){return p(this,void 0,void 0,function*(){try{return!!(yield this.instance.get())}catch{return!1}})}createPaymentRequest(e,t){return p(this,void 0,void 0,function*(){const o=yield this.instance.get();let n="Internet Archive Monthly";t.donationType===w.OneTime&&(n="Internet Archive");const a=o.createPaymentRequest({total:{label:n,amount:t.total},requiredBillingContactFields:["postalAddress"],requiredShippingContactFields:["name","email"]}),r=this.applePaySessionManager.createNewPaymentSession(a),u=new Qo({donationInfo:t,session:r,applePayInstance:o,braintreeManager:this.braintreeManager});return r.onvalidatemerchant=u.onvalidatemerchant.bind(u),r.onpaymentauthorized=u.onpaymentauthorized.bind(u),r.oncancel=u.oncancel.bind(u),r.begin(),u})}}class en{constructor(e){var t;this.braintreeManager=e.braintreeManager,this.venmoClient=e.venmoClient,this.venmoProfileId=e.venmoProfileId,this.instance=(t=e.instancePromisedSingleton)!==null&&t!==void 0?t:new P({generator:()=>this.braintreeManager.instance.get().then(o=>this.venmoClient.create({client:o,profileId:this.venmoProfileId}))})}isBrowserSupported(){return p(this,void 0,void 0,function*(){var e;if(this.isMobileFirefox())return!1;const t=yield this.instance.get();return(e=t?.isBrowserSupported())!==null&&e!==void 0?e:!1})}startPayment(){return p(this,void 0,void 0,function*(){const e=yield this.instance.get();return e?.tokenize()})}isMobileFirefox(){const e=navigator.userAgent.indexOf("FxiOS")!==-1,t=navigator.userAgent.indexOf("Firefox")!==-1,o=navigator.userAgent.indexOf("Mobile")!==-1;return(t||e)&&o}}class tn{constructor(e){this.donationInfo=e.donationInfo,this.paypalInstance=e.paypalInstance}payment(){return p(this,void 0,void 0,function*(){var e;const o=this.donationInfo.donationType===w.OneTime?"checkout":"vault",n={flow:o,intent:"capture"};return n.enableShippingAddress=!0,o==="checkout"?(n.amount=this.donationInfo.total,n.currency="USD"):n.billingAgreementDescription=`Subscribe to donate ${k(this.donationInfo.total,{symbol:"$"}).format()} monthly`,(e=this.delegate)===null||e===void 0||e.payPalPaymentStarted(this,n),this.paypalInstance.createPayment(n)})}onAuthorize(e){return p(this,void 0,void 0,function*(){var t;const o=yield this.paypalInstance.tokenizePayment(e);return(t=this.delegate)===null||t===void 0||t.payPalPaymentAuthorized(this,o),o})}onConfirm(e){return p(this,void 0,void 0,function*(){var t;const o=yield this.paypalInstance.tokenizePayment(e);return(t=this.delegate)===null||t===void 0||t.payPalPaymentConfirmed(this,o),o})}onCancel(e){var t;(t=this.delegate)===null||t===void 0||t.payPalPaymentCancelled(this,e)}onError(e){var t;console.error("PayPal error",e),(t=this.delegate)===null||t===void 0||t.payPalPaymentError(this,e)}}class on{constructor(e){this.braintreeManager=e.braintreeManager,this.paypalClient=e.paypalClient,this.paypalButtonGenerator=e.paypalButton,this.hostingEnvironment=e.hostingEnvironment,this.instance=new P({generator:()=>this.braintreeManager.instance.get().then(t=>this.paypalClient.create({client:t}))})}renderPayPalButton(e){return p(this,void 0,void 0,function*(){const t=this.hostingEnvironment===j.Development?"sandbox":"production",o=yield this.instance.get();if(!o)return;const n=new tn({donationInfo:e.donationInfo,paypalInstance:o});return this.paypalButtonGenerator.render({env:t,style:e.style,payment:n.payment.bind(n),onAuthorize:n.onAuthorize.bind(n),onCancel:n.onCancel.bind(n),onError:n.onError.bind(n),funding:{disallowed:[paypal.FUNDING.VENMO]}},e.selector),n})}}class Ee{canMakePayments(){return"ApplePaySession"in window&&ApplePaySession.supportsVersion(Ee.VERSION)&&ApplePaySession.canMakePayments()}createNewPaymentSession(e){return new ApplePaySession(Ee.VERSION,e)}}Ee.VERSION=3;class nn{isBrowserSupported(){return p(this,void 0,void 0,function*(){return this.paymentsClient.isReadyToPay({apiVersion:2,apiVersionMinor:0,allowedPaymentMethods:[{type:"CARD",parameters:{allowedAuthMethods:["PAN_ONLY"],allowedCardNetworks:["AMEX","DISCOVER","INTERAC","JCB","MASTERCARD","VISA"]}}],existingPaymentMethodRequired:!1}).then(e=>e.result)})}constructor(e){this.braintreeManager=e.braintreeManager,this.googlePayMerchantId=e.googlePayMerchantId,this.googlePayBraintreeClient=e.googlePayBraintreeClient,this.paymentsClient=e.googlePaymentsClient,this.instance=new P({generator:()=>this.braintreeManager.instance.get().then(t=>this.googlePayBraintreeClient.create({client:t,googlePayVersion:2,googleMerchantId:this.googlePayMerchantId}))})}}class an{on(e,t){return this.emitter.on(e,t)}constructor(e){this.creditCardHandler=new P({generator:()=>p(this,void 0,void 0,function*(){const t=yield this.paymentClients.hostedFields.get(),o=new Jo({braintreeManager:this.braintreeManager,hostedFieldClient:t,hostedFieldConfig:this.hostedFieldConfig});return o.on("hostedFieldsRetry",n=>{this.emitter.emit("hostedFieldsRetry",n)}),o.on("hostedFieldsFailed",n=>{this.emitter.emit("hostedFieldsFailed",n)}),o})}),this.applePayHandler=new P({generator:()=>p(this,void 0,void 0,function*(){const t=yield this.paymentClients.applePay.get(),o=new Ee;return new Xo({braintreeManager:this.braintreeManager,applePayClient:t,applePaySessionManager:o})})}),this.venmoHandler=new P({generator:()=>p(this,void 0,void 0,function*(){const t=yield this.paymentClients.venmo.get();if(this.venmoProfileId)return new en({braintreeManager:this.braintreeManager,venmoClient:t,venmoProfileId:this.venmoProfileId})})}),this.paypalHandler=new P({generator:()=>p(this,void 0,void 0,function*(){const t=this.paymentClients.paypalLibrary.get(),o=this.paymentClients.payPal.get(),n=yield Promise.all([o,t]);return new on({braintreeManager:this.braintreeManager,paypalClient:n[0],paypalButton:n[1].Button,hostingEnvironment:this.hostingEnvironment})})}),this.googlePayHandler=new P({generator:()=>p(this,void 0,void 0,function*(){const t=this.paymentClients.googlePaymentsClient.get(),o=this.paymentClients.googlePayBraintreeClient.get(),n=yield Promise.all([o,t]);return new nn({braintreeManager:this.braintreeManager,googlePayMerchantId:this.googlePayMerchantId,googlePayBraintreeClient:n[0],googlePaymentsClient:n[1]})})}),this.hostingEnvironment=j.Development,this.emitter=be(),this.braintreeManager=e.braintreeManager,this.venmoProfileId=e.venmoProfileId,this.googlePayMerchantId=e.googlePayMerchantId,this.paymentClients=e.paymentClients,this.hostingEnvironment=e.hostingEnvironment,this.hostedFieldConfig=e.hostedFieldConfig}}class rn{on(e,t){return this.emitter.on(e,t)}startup(){return p(this,void 0,void 0,function*(){return this.collectDeviceData()})}submitDonation(e){return p(this,void 0,void 0,function*(){const t=new oo;t.fee_amount_covered=e.donationInfo.feeAmountCovered,t.logged_in_user=this.loggedInUser,t.referrer=this.referrer,t.origin=this.origin;const o=N.calculateTotal(e.donationInfo.amount,e.donationInfo.coverFees),n=new qo({deviceData:this.deviceData,paymentProvider:e.paymentProvider,paymentMethodNonce:e.nonce,amount:o,donationType:e.donationInfo.donationType,customer:e.customerInfo,billing:e.billingInfo,customFields:t,upsellOnetimeTransactionId:e.upsellOnetimeTransactionId,customerId:e.customerId,recaptchaToken:e.recaptchaToken,bin:e.bin,binName:e.binName}),a=yield this.endpointManager.submitData(n);return new Yo(a)})}submitUpsellDonation(e){return p(this,void 0,void 0,function*(){const t=e.oneTimeDonationResponse,o=new N({amount:e.amount,donationType:w.Upsell,coverFees:!1});return this.submitDonation({nonce:t.paymentMethodNonce,paymentProvider:t.paymentProvider,customerId:t.customer_id,donationInfo:o,customerInfo:t.customer,billingInfo:t.billing,upsellOnetimeTransactionId:t.transaction_id})})}donationSuccessful(e){this.endpointManager.donationSuccessful(e)}collectDeviceData(){return p(this,void 0,void 0,function*(){if(this.deviceDataCollectionStarted)return;this.deviceDataCollectionStarted=!0;const e=yield this.instance.get();if(e)return this.paymentClients.dataCollector.get().then(t=>t?.create({client:e,kount:!1,paypal:!0})).then(t=>{this.deviceData=t?.deviceData})})}constructor(e){this.emitter=be(),this.instance=new P({generator:()=>p(this,void 0,void 0,function*(){const t=yield this.paymentClients.braintreeClient.get();return t?.create({authorization:this.authorizationToken})})}),this.deviceDataCollectionStarted=!1,this.hostingEnvironment=j.Development,this.authorizationToken=e.authorizationToken,this.endpointManager=e.endpointManager,this.hostingEnvironment=e.hostingEnvironment,this.paymentClients=e.paymentClients,this.referrer=e.referrer,this.loggedInUser=e.loggedInUser,this.origin=e.origin,this.paymentProviders=new an({braintreeManager:this,paymentClients:this.paymentClients,venmoProfileId:e.venmoProfileId,googlePayMerchantId:e.googlePayMerchantId,hostingEnvironment:e.hostingEnvironment,hostedFieldConfig:e.hostedFieldConfig}),this.paymentProviders.on("hostedFieldsRetry",t=>{this.emitter.emit("paymentProvidersHostedFieldsRetry",t)}),this.paymentProviders.on("hostedFieldsFailed",t=>{this.emitter.emit("paymentProvidersHostedFieldsFailed",t)})}setReferrer(e){this.referrer=e}setLoggedInUser(e){this.loggedInUser=e}setOrigin(e){this.origin=e}}var z;(function(i){i.Number="number",i.CVV="cvv",i.ExpirationDate="expirationDate"})(z||(z={}));class sn{fieldFor(e){switch(e){case z.Number:return this.number;case z.CVV:return this.cvv;case z.ExpirationDate:return this.expirationDate}}markFieldErrors(e){e.forEach(t=>{const o=this.fieldFor(t);o.parentElement.error=!0})}removeFieldErrors(e){e.forEach(t=>{const o=this.fieldFor(t);o.parentElement.error=!1})}showErrorMessage(e){const t=e??"Some payment information below is missing or incorrect.";this.errorContainer.innerHTML=t,this.errorContainer.style.display="block"}hideErrorMessage(){this.errorContainer.style.display="none"}resetHostedFields(){[this.number,this.cvv,this.expirationDate].forEach(t=>{for(;t.firstChild;)t.firstChild.remove()})}constructor(e){this.number=e.number,this.cvv=e.cvv,this.expirationDate=e.expirationDate,this.errorContainer=e.errorContainer}}class ln{constructor(e){this.started=!1,this.braintreeManager=e.braintreeManager,this.donationFlowModalManager=e.donationFlowModalManager,this.recaptchaManager=e.recaptchaManager,this.emitter=be()}on(e,t){return this.emitter.on(e,t)}startup(){return p(this,void 0,void 0,function*(){var e;if(this.started)return;this.started=!0;const t=yield(e=this.braintreeManager)===null||e===void 0?void 0:e.paymentProviders.creditCardHandler.get(),o=yield t?.instance.get();o?.on("focus",n=>{const{emittedBy:a,fields:r}=n,u=r[a],{container:s}=u;s.parentElement.error=!1,t.hideErrorMessage()}),o?.on("blur",n=>{const{emittedBy:a,fields:r}=n,u=r[a],{container:s,isEmpty:l,isValid:c}=u;(l||!c)&&(s.parentElement.error=!0)}),o?.on("validityChange",n=>{const{fields:a}=n,r=a.cvv.isValid&&a.expirationDate.isValid&&a.number.isValid;this.emitter.emit("validityChanged",r)})})}tokenizeFields(){return p(this,void 0,void 0,function*(){let e;const t=yield this.braintreeManager.paymentProviders.creditCardHandler.get();try{e=yield t?.tokenizeHostedFields()}catch(o){this.handleHostedFieldTokenizationError(o);return}return e})}paymentInitiated(e,t,o){return p(this,void 0,void 0,function*(){let n;try{n=yield this.recaptchaManager.execute()}catch{this.donationFlowModalManager.showErrorModal({message:"Recaptcha failure"});return}this.donationFlowModalManager.startDonationSubmissionFlow({nonce:e.nonce,paymentProvider:F.CreditCard,recaptchaToken:n,bin:e.details.bin,donationInfo:t,customerInfo:o.customer,billingInfo:o.billing})})}handleHostedFieldTokenizationError(e){return p(this,void 0,void 0,function*(){const t=yield this.braintreeManager.paymentProviders.creditCardHandler.get();switch(t.showErrorMessage(),e.code){case"HOSTED_FIELDS_FIELDS_EMPTY":t.markFieldErrors([z.Number,z.CVV,z.ExpirationDate]);break;case"HOSTED_FIELDS_FIELDS_INVALID":Object.keys(e.details.invalidFields).forEach(o=>{t.markFieldErrors([o])});break;case"HOSTED_FIELDS_TOKENIZATION_FAIL_ON_DUPLICATE":break;case"HOSTED_FIELDS_TOKENIZATION_CVV_VERIFICATION_FAILED":t.markFieldErrors([z.CVV]);break}})}}class io{keydown(e){var t,o;const n=e.key;if(e.metaKey)return;switch(n){case"Tab":case"Delete":case"Backspace":case"ArrowLeft":case"ArrowRight":case"ArrowUp":case"ArrowDown":return}const a=e.target,r=a.value,u=r.slice(0,(t=a.selectionStart)!==null&&t!==void 0?t:0),s=r.slice((o=a.selectionEnd)!==null&&o!==void 0?o:0),l=`${u}${n}${s}`,c=/^[0-9]+(\.[0-9]{0,2})?$/g;l.match(c)||e.preventDefault()}}var G;(function(i){i.YesButton="YesButton",i.PayPalUpsellSlot="PayPalUpsellSlot"})(G||(G={}));let ge=class extends I{constructor(){super(...arguments),this.yesButtonMode=G.YesButton,this.amount=5,this.currencyValidator=new io}render(){return g`
      <h3>Thank you for donating!</h3>
      <button @click=${this.noThanksSelected} class="cta-button" id="no-button">Continue</button>
      <p class="or_separator"><span>or</span></p>
      <h3>Join our Monthly Giving Circle</h3>
      <p class="appeal">Monthly support helps us reliably plan for the future.</p>
      <div class="monthly-amount">
        <h1>Enter your monthly amount</h1>
        <div class="amount-input">
          <span class="dollar-symbol">$</span>
          <input
            id="amount-input"
            type="text"
            tabindex="0"
            value=${this.amount}
            @input=${this.amountChanged}
            @keydown=${this.currencyValidator.keydown}
          />
        </div>
        <div class="error ${this.error?"":"hidden"}">${this.error}</div>
      </div>

      ${this.yesButton}
    `}get yesButton(){switch(this.yesButtonMode){case G.YesButton:return g`
          <button
            class="cta-button"
            tabindex="0"
            id="yes-button"
            @click=${this.yesSelected}
            .disabled=${this.error!==void 0}
          >
            YES, I'll donate monthly
          </button>
        `;case G.PayPalUpsellSlot:return g`
          <div class="paypal-upsell-slot-container">
            <div class="paypal-upsell-slot-blocker ${this.error?"":"hidden"}"></div>
            <button class="cta-button" id="paypal-cover-button">YES, I'll donate monthly</button>
            <slot class="paypal-upsell-slot"></slot>
          </div>
        `}}amountChanged(e){const o=e.target.value;o.length!==0&&this.handleCustomAmountInput(o)}handleCustomAmountInput(e){const t=parseFloat(e);isNaN(t)?this.error=g` Please enter a valid amount. `:this.processAmount(t)}processAmount(e){if(e>=1e4){this.error=g`
        To make a donation of $10,000 or more, please contact our philanthropy department at
        <a href="mailto:donations@archive.org">donations@archive.org</a>
      `;return}if(e<1){this.amountInput&&this.amountInput.value.length>0&&(this.error=g` The minimum donation amount is $1. `);return}this.error=void 0,this.amount=e;const t=new CustomEvent("amountChanged",{detail:{amount:this.amount}});this.dispatchEvent(t)}yesSelected(){const e=new CustomEvent("yesSelected",{detail:{amount:this.amount}});this.dispatchEvent(e)}noThanksSelected(){this.dispatchEvent(new Event("noThanksSelected"))}static get styles(){const e=h`var(--upsellCTAButtonColor, #194880)`,t=h`var(--upsellCTAButtonDisabledColor, rgba(109,148,201,0.5))`,o=h`var(--upsellAmountInputOffset, -1rem)`;return h`
      .monthly-amount {
        background-color: #fff;
        padding: 0.5rem 0.625rem;
        border-radius: 5px;
        text-align: center;
        margin-bottom: 0.5rem;
        margin-top: 0;
      }

      .monthly-amount h1 {
        font-size: 1.8rem;
        font-weight: bold;
        text-align: center;
        line-height: 1.2em;
        margin: 0;
        padding: 0.5rem 0 0 0;
      }

      .hidden {
        display: none;
      }

      h3 {
        text-align: center;
        font-size: 1.8rem;
        margin: 0 1rem 0.5rem 1rem;
      }

      .appeal {
        text-align: center;
        font-size: 1.6rem;
        margin: 0.5rem 1rem;
      }

      .amount-input {
        transform: translate(${o}, 0); /* translate slightly to center the input */
      }

      .amount-input .dollar-symbol {
        font-size: 1.8rem;
        font-weight: bold;
      }

      .amount-input input {
        width: 100px;
        text-align: center;
        border: none;
        border-bottom: 1px solid gray;
        font-weight: bold;
        font-size: 3.4rem;
      }

      .cta-button {
        font-size: 2rem;
        display: block;
        width: 100%;
        margin-top: 0.5rem;
        padding: 1rem 2rem;
        background-color: ${e};
        color: #fff;
        border-radius: 5px;
        border: 0;
        font-weight: bold;
        line-height: normal;
        outline: none;
        cursor: pointer;
      }

      .cta-button:disabled {
        background-color: ${t};
        cursor: not-allowed;
      }

      .paypal-upsell-slot {
        text-align: center;
      }

      .paypal-upsell-slot-blocker {
        position: absolute;
        width: 100%;
        height: 4.5rem;
        bottom: 0;
        z-index: 250;
        cursor: not-allowed;
        background-color: rgba(255, 255, 255, 0.5);
      }

      .paypal-upsell-slot-blocker.hidden {
        display: none;
      }

      #paypal-cover-button {
        position: absolute;
        width: 100%;
        bottom: 0;
      }

      .paypal-upsell-slot-container {
        position: relative;
      }

      .paypal-upsell-slot-container .paypal-cta {
        font-size: 2.4rem;
        font-weight: bold;
        margin: 0 1rem 1rem 1rem;
        text-align: center;
      }

      .error {
        font-size: 1.4rem;
        margin: 0.5rem 0;
        color: red;
      }

      .or_separator {
        position: relative;
        margin: 0 2rem;
        font-size: 2.6rem;
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
      }

      .or_separator:before {
        position: absolute;
        top: calc(50% - 1px);
        right: 0;
        left: 0;
        height: 2px;
        content: '';
        background: #333;
      }

      .or_separator span {
        display: inline-block;
        position: relative;
        padding: 0 1rem;
        background: #f5f5f7;
      }
    `}};d([v({type:String})],ge.prototype,"yesButtonMode",void 0);d([v({type:Number})],ge.prototype,"amount",void 0);d([v({type:Object})],ge.prototype,"error",void 0);d([b("#amount-input")],ge.prototype,"amountInput",void 0);ge=d([D("upsell-modal-content")],ge);class Q{constructor(e){var t,o,n,a,r,u,s;this.title=e?.title,this.subtitle=e?.subtitle,this.headline=e?.headline,this.message=e?.message,this.headerColor=(t=e?.headerColor)!==null&&t!==void 0?t:"#55A183",this.bodyColor=(o=e?.bodyColor)!==null&&o!==void 0?o:"#f5f5f7",this.showProcessingIndicator=(n=e?.showProcessingIndicator)!==null&&n!==void 0?n:!1,this.processingImageMode=(a=e?.processingImageMode)!==null&&a!==void 0?a:"complete",this.showCloseButton=(r=e?.showCloseButton)!==null&&r!==void 0?r:!0,this.showHeaderLogo=(u=e?.showHeaderLogo)!==null&&u!==void 0?u:!0,this.closeOnBackdropClick=(s=e?.closeOnBackdropClick)!==null&&s!==void 0?s:!0}}function*pt(i=document.activeElement){i!=null&&(yield i,"shadowRoot"in i&&i.shadowRoot&&i.shadowRoot.mode!=="closed"&&(yield*pt(i.shadowRoot.activeElement)))}function dn(){return[...pt()].pop()}const Ht=new WeakMap;function ao(i){let e=Ht.get(i);return e||(e=window.getComputedStyle(i,null),Ht.set(i,e)),e}function cn(i){if("checkVisibility"in i&&typeof i.checkVisibility=="function")return i.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});const e=ao(i);return e.visibility!=="hidden"&&e.display!=="none"}function un(i){const e=ao(i),{overflowY:t,overflowX:o}=e;return t==="scroll"||o==="scroll"?!0:t!=="auto"||o!=="auto"?!1:i.scrollHeight>i.clientHeight&&t==="auto"||i.scrollWidth>i.clientWidth&&o==="auto"}function hn(i){const e=i.tagName.toLowerCase(),t=Number(i.getAttribute("tabindex"));return i.hasAttribute("tabindex")&&(isNaN(t)||t<=-1)||i.hasAttribute("disabled")||i.closest("[inert]")||e==="input"&&i.getAttribute("type")==="radio"&&!i.hasAttribute("checked")||!cn(i)?!1:(e==="audio"||e==="video")&&i.hasAttribute("controls")||i.hasAttribute("tabindex")||i.hasAttribute("contenteditable")&&i.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(e)?!0:un(i)}function mn(i,e){var t;return((t=i.getRootNode({composed:!0}))===null||t===void 0?void 0:t.host)!==e}function Nt(i){const e=new WeakMap,t=[];function o(n){if(n instanceof Element){if(n.hasAttribute("inert")||n.closest("[inert]")||e.has(n))return;e.set(n,!0),!t.includes(n)&&hn(n)&&t.push(n),n instanceof HTMLSlotElement&&mn(n,i)&&n.assignedElements({flatten:!0}).forEach(a=>{o(a)}),n.shadowRoot!==null&&n.shadowRoot.mode==="open"&&o(n.shadowRoot)}for(const a of Array.from(n.children))o(a)}return o(i),t.sort((n,a)=>{const r=Number(n.getAttribute("tabindex"))||0;return(Number(a.getAttribute("tabindex"))||0)-r})}let Se=[];class pn{constructor(e){this.isExternalActivated=!1,this.tabDirection="forward",this.currentFocus=null,this.previousFocus=null,this.handleFocusIn=()=>{this.isActive()&&this.checkFocus()},this.handleKeyDown=t=>{var o;if(t.key!=="Tab"||this.isExternalActivated||!this.isActive())return;const n=dn();if(this.previousFocus=n,this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;t.shiftKey?this.tabDirection="backward":this.tabDirection="forward";const a=Nt(this.element);let r=a.findIndex(s=>s===n);this.previousFocus=this.currentFocus;const u=this.tabDirection==="forward"?1:-1;for(;;){r+u>=a.length?r=0:r+u<0?r=a.length-1:r+=u,this.previousFocus=this.currentFocus;const s=a[r];if(this.tabDirection==="backward"&&this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus)||s&&this.possiblyHasTabbableChildren(s))return;t.preventDefault(),this.currentFocus=s,(o=this.currentFocus)===null||o===void 0||o.focus({preventScroll:!1});const l=[...pt()];if(l.includes(this.currentFocus)||!l.includes(this.previousFocus))break}setTimeout(()=>this.checkFocus())},this.handleKeyUp=()=>{this.tabDirection="forward"},this.element=e,this.elementsWithTabbableControls=["iframe"]}activate(){Se.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){Se=Se.filter(e=>e!==this.element),this.currentFocus=null,document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return Se[Se.length-1]===this.element}activateExternal(){this.isExternalActivated=!0}deactivateExternal(){this.isExternalActivated=!1}checkFocus(){if(this.isActive()&&!this.isExternalActivated){const e=Nt(this.element);if(!this.element.matches(":focus-within")){const t=e[0],o=e[e.length-1],n=this.tabDirection==="forward"?t:o;typeof n?.focus=="function"&&(this.currentFocus=n,n.focus({preventScroll:!1}))}}}possiblyHasTabbableChildren(e){return this.elementsWithTabbableControls.includes(e.tagName.toLowerCase())||e.hasAttribute("controls")}}const vn=Object.freeze({processing:"processing",complete:"complete"});class gn extends I{static get properties(){return{mode:{type:String}}}constructor(){super(),this.mode=vn.processing}render(){return g`
      <div class="${this.mode}">
        <svg
          viewBox="0 0 120 120"
          preserveAspectRatio="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          aria-labelledby="indicatorTitle indicatorDescription"
        >
          <title id="indicatorTitle">Activity Indicator</title>
          <desc id="indicatorDescription">
            A rotating activity indicator with three dots in the middle.
          </desc>
          <g
            id="icons/check-ring---squared"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
          >
            <path
              id="completed-ring"
              class="loaded-indicator"
              d="M60,10 C70.5816709,10 80.3955961,13.2871104 88.4763646,18.8959201 L78.3502633,29.0214223 C72.9767592,25.8315427 66.7022695,24 60,24 C40.117749,24 24,40.117749 24,60 C24,79.882251 40.117749,96 60,96 C79.882251,96 96,79.882251 96,60 L95.995,59.46 L108.327675,47.128668 C109.350926,50.9806166 109.925886,55.015198 109.993301,59.1731586 L110,60 C110,87.6142375 87.6142375,110 60,110 C32.3857625,110 10,87.6142375 10,60 C10,32.3857625 32.3857625,10 60,10 Z"
            ></path>
            <polygon
              id="check"
              class="loaded-indicator"
              transform="translate(75.000000, 41.500000) rotate(44.000000) translate(-75.000000, -41.500000) "
              points="96 85 54 85 54 65 76 64.999 76 -2 96 -2"
            ></polygon>
            <path
              id="activity-ring"
              class="activity-indicator"
              d="M60,10 C69.8019971,10 78.9452178,12.8205573 86.6623125,17.6943223 L76.4086287,27.9484118 C71.4880919,25.4243078 65.9103784,24 60,24 C40.117749,24 24,40.117749 24,60 C24,79.882251 40.117749,96 60,96 C79.882251,96 96,79.882251 96,60 C96,53.3014663 94.1704984,47.0302355 90.9839104,41.6587228 L101.110332,31.5326452 C106.715332,39.6116982 110,49.4222615 110,60 C110,87.6142375 87.6142375,110 60,110 C32.3857625,110 10,87.6142375 10,60 C10,32.3857625 32.3857625,10 60,10 Z"
            ></path>
            <g
              id="activity-dots"
              class="activity-indicator"
              transform="translate(40.000000, 55.000000)"
            >
              <circle id="left-dot" cx="5" cy="5" r="5"></circle>
              <circle id="middle-dot" cx="20" cy="5" r="5"></circle>
              <circle id="right-dot" cx="35" cy="5" r="5"></circle>
            </g>
          </g>
        </svg>
      </div>
    `}static get styles(){const e=h`var(--activityIndicatorCheckmarkColor, #31A481)`,t=h`var(--activityIndicatorCompletedRingColor, #31A481)`,o=h`var(--activityIndicatorLoadingRingColor, #333333)`,n=h`var(--activityIndicatorLoadingDotColor, #333333)`;return h`
      #completed-ring {
        fill: ${t};
      }

      #check {
        fill: ${e};
      }

      #activity-ring {
        fill: ${o};
      }

      #activity-dots {
        fill: ${n};
      }

      .activity-indicator {
        opacity: 0;
        transition: opacity 0.25s ease-out;
      }

      .processing .activity-indicator {
        opacity: 1;
      }

      .loaded-indicator {
        opacity: 1;
        transition: opacity 0.25s ease-out;
      }

      .processing .loaded-indicator {
        opacity: 0;
      }

      .image {
        border: 1px solid red;
        display: inline-block;
      }

      .processing #activity-ring {
        animation: rotate 1.3s infinite linear;
        transform-origin: 50px 50px;
        transform-box: fill-box;
      }

      .processing #left-dot {
        opacity: 0;
        animation: dot 1.3s infinite;
        animation-delay: 0.2s;
      }

      .processing #middle-dot {
        opacity: 0;
        animation: dot 1.3s infinite;
        animation-delay: 0.4s;
      }

      .processing #right-dot {
        opacity: 0;
        animation: dot 1.3s infinite;
        animation-delay: 0.6s;
      }

      @keyframes rotate {
        0% {
          transform: rotate(-360deg);
        }
        100% {
          /* This frame is supposed to be inferred, but Safari doesn't rotate it unless we're explicit */
          transform: rotate(0deg);
        }
      }

      @keyframes dot {
        0% {
          opacity: 0;
        }
        25% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    `}}window.customElements.define("ia-activity-indicator",gn);const yn=g`
<svg
  viewBox="0 0 40 40"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  aria-labelledby="closeTitleID closeDescID"
>
  <title id="closeTitleID">Close icon</title>
  <desc id="closeDescID">A line drawing of an X</desc>
  <path d="m29.1923882 10.8076118c.5857864.5857865.5857864 1.535534 0 2.1213204l-7.0711162 7.0703398 7.0711162 7.0717958c.5857864.5857864.5857864 1.5355339 0 2.1213204-.5857865.5857864-1.535534.5857864-2.1213204 0l-7.0717958-7.0711162-7.0703398 7.0711162c-.5857864.5857864-1.5355339.5857864-2.1213204 0-.5857864-.5857865-.5857864-1.535534 0-2.1213204l7.0706602-7.0717958-7.0706602-7.0703398c-.5857864-.5857864-.5857864-1.5355339 0-2.1213204.5857865-.5857864 1.535534-.5857864 2.1213204 0l7.0703398 7.0706602 7.0717958-7.0706602c.5857864-.5857864 1.5355339-.5857864 2.1213204 0z" class="fill-color" fill-rule="evenodd"/>
</svg>
`;class fn extends I{static get styles(){return h`
      :host {
        width: var(--iconWidth, 'auto');
        height: var(--iconHeight, 'auto');
      }

      .fill-color {
        fill: var(--iconFillColor);
      }

      .stroke-color {
        stroke: var(--iconStrokeColor);
      }
    `}render(){return yn}}customElements.define("ia-icon-close",fn);const bn=g`
  <svg
    class="ia-logo"
    viewBox="0 0 27 30"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby="logoTitleID logoDescID"
  >
    <title id="logoTitleID">Internet Archive logo</title>
    <desc id="logoDescID">
      A line drawing of the Internet Archive headquarters building façade.
    </desc>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <mask id="mask-2" class="fill-color">
        <path
          d="M26.6666667,28.6046512 L26.6666667,30 L0,30 L0.000283687943,28.6046512 L26.6666667,28.6046512 Z M25.6140351,26.5116279 L25.6140351,28.255814 L1.05263158,28.255814 L1.05263158,26.5116279 L25.6140351,26.5116279 Z M3.62469203,7.6744186 L3.91746909,7.82153285 L4.0639977,10.1739544 L4.21052632,13.9963932 L4.21052632,17.6725617 L4.0639977,22.255044 L4.03962296,25.3421929 L3.62469203,25.4651163 L2.16024641,25.4651163 L1.72094074,25.3421929 L1.55031755,22.255044 L1.40350877,17.6970339 L1.40350877,14.0211467 L1.55031755,10.1739544 L1.68423854,7.80887484 L1.98962322,7.6744186 L3.62469203,7.6744186 Z M24.6774869,7.6744186 L24.9706026,7.82153285 L25.1168803,10.1739544 L25.2631579,13.9963932 L25.2631579,17.6725617 L25.1168803,22.255044 L25.0927809,25.3421929 L24.6774869,25.4651163 L23.2130291,25.4651163 L22.7736357,25.3421929 L22.602418,22.255044 L22.4561404,17.6970339 L22.4561404,14.0211467 L22.602418,10.1739544 L22.7369262,7.80887484 L23.0420916,7.6744186 L24.6774869,7.6744186 Z M9.94042303,7.6744186 L10.2332293,7.82153285 L10.3797725,10.1739544 L10.5263158,13.9963932 L10.5263158,17.6725617 L10.3797725,22.255044 L10.3556756,25.3421929 L9.94042303,25.4651163 L8.47583122,25.4651163 L8.0362015,25.3421929 L7.86556129,22.255044 L7.71929825,17.6970339 L7.71929825,14.0211467 L7.86556129,10.1739544 L8.00005604,7.80887484 L8.30491081,7.6744186 L9.94042303,7.6744186 Z M18.0105985,7.6744186 L18.3034047,7.82153285 L18.449948,10.1739544 L18.5964912,13.9963932 L18.5964912,17.6725617 L18.449948,22.255044 L18.425851,25.3421929 L18.0105985,25.4651163 L16.5460067,25.4651163 L16.1066571,25.3421929 L15.9357367,22.255044 L15.7894737,17.6970339 L15.7894737,14.0211467 L15.9357367,10.1739544 L16.0702315,7.80887484 L16.3753664,7.6744186 L18.0105985,7.6744186 Z M25.6140351,4.53488372 L25.6140351,6.97674419 L1.05263158,6.97674419 L1.05263158,4.53488372 L25.6140351,4.53488372 Z M13.0806755,0 L25.9649123,2.93331338 L25.4484139,3.8372093 L0.771925248,3.8372093 L0,3.1041615 L13.0806755,0 Z"
          id="path-1"
        ></path>
      </mask>
      <use class="fill-color" xlink:href="#path-1"></use>
      <g mask="url(#mask-2)" class="fill-color">
        <path
          d="M0,0 L26.6666667,0 L26.6666667,30 L0,30 L0,0 Z"
          id="swatch"
        ></path>
      </g>
    </g>
  </svg>
`;let dt=class extends I{constructor(){super(...arguments),this.config=new Q}render(){return g`
      <div class="modal-wrapper">
        <div class="modal-container">
          <header style="background-color: ${this.config.headerColor}">
            ${this.config.showCloseButton?this.closeButtonTemplate:""}
            ${this.config.showHeaderLogo?g`<div class="logo-icon">${bn}</div>`:$}
            ${this.config.title?g`<h1 class="title">${this.config.title}</h1>`:""}
            ${this.config.subtitle?g`<h2 class="subtitle">${this.config.subtitle}</h2>`:""}
          </header>
          <section
            class="modal-body"
            style="background-color: ${this.config.bodyColor}"
          >
            <div class="content">
              <div
                class="processing-logo ${this.config.showProcessingIndicator?"":"hidden"}"
              >
                <ia-activity-indicator
                  .mode=${this.config.processingImageMode}
                ></ia-activity-indicator>
              </div>
              ${this.config.headline?g` <h1 class="headline">${this.config.headline}</h1> `:""}
              ${this.config.message?g` <p class="message">${this.config.message}</p> `:""}

              <div class="slot-container">
                <slot> </slot>
              </div>
            </div>
          </section>
        </div>
      </div>
    `}handleCloseButton(e){if(e.preventDefault(),e.type==="keydown"&&e.key!==" "&&e.key!=="Enter")return;const t=new Event("closeButtonPressed");this.dispatchEvent(t)}get closeButtonTemplate(){return g`
      <button
        type="button"
        class="close-button"
        @click=${this.handleCloseButton}
        @keydown=${this.handleCloseButton}
      >
        <ia-icon-close></ia-icon-close>
      </button>
    `}static get styles(){const e=h`var(--modalLogoSize, 6.5rem)`,t=h`var(--processingImageSize, 7.5rem)`,o=h`var(--modalCornerRadius, 1rem)`,n=h`var(--modalBorder, 2px solid black)`,a=h`var(--modalBottomMargin, 2.5rem)`,r=h`var(--modalTopMargin, 5rem)`,u=h`var(--modalHeaderBottomPadding, 0.5em)`,s=h`var(--modalBottomPadding, 2rem)`,l=h`var(--modalScrollOffset, 5px)`,c=h`var(--modalTitleFontSize, 1.8rem)`,m=h`var(--modalSubtitleFontSize, 1.4rem)`,y=h`var(--modalHeadlineFontSize, 1.6rem)`,f=h`var(--modalMessageFontSize, 1.4rem)`,_=h`var(--modalTitleLineHeight, normal)`,S=h`var(--modalSubtitleLineHeight, normal)`,B=h`var(--modalHeadlineLineHeight, normal)`,de=h`var(--modalMessageLineHeight, normal)`;return h`
      .processing-logo {
        margin: auto;
        width: ${t};
        height: ${t};
      }

      .processing-logo.hidden {
        height: 1rem;
      }

      .processing-logo.hidden ia-activity-indicator {
        display: none;
      }

      .modal-wrapper {
        outline: none;
      }

      .modal-container {
        border-radius: ${o};
        width: 100%;
        margin-top: ${r};
      }

      header {
        position: relative;
        background-color: #36a483;
        color: white;
        border-radius: calc(${o}) calc(${o}) 0 0;
        border: ${n};
        border-bottom: 0;
        text-align: center;
        padding-bottom: ${u};
      }

      .title {
        margin: 0;
        padding: 0;
        font-size: ${c};
        font-weight: bold;
        line-height: ${_};
      }

      .subtitle {
        margin: 0;
        padding: 0;
        font-weight: normal;
        padding-top: 0;
        font-size: ${m};
        line-height: ${S};
      }

      .modal-body {
        background-color: #f5f5f7;
        border-radius: 0 0 calc(${o}) calc(${o});
        border: ${n};
        border-top: 0;
        padding: 0 1rem calc(${s} - ${l}) 1rem;
        color: #333;
        margin-bottom: 2.5rem;
        min-height: 5rem;
      }

      .content {
        overflow-y: auto;
        max-height: calc(100vh - (16.5rem + ${a}));
        min-height: 5rem;
        padding: 0 0 calc(${l}) 0;
      }

      .headline {
        font-size: ${y};
        font-weight: bold;
        text-align: center;
        line-height: ${B};
        margin: 0;
        padding: 0;
      }

      .message {
        margin: 1rem 0 0 0;
        text-align: center;
        font-size: ${f};
        line-height: ${de};
      }

      .logo-icon {
        border-radius: 100%;
        border: 3px solid #fff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.18),
          0 2px 2px 0 rgba(0, 0, 0, 0.08);
        width: ${e};
        height: ${e};
        margin: -2.9rem auto 0.5rem auto;
        background-color: black;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .logo-icon svg {
        width: calc(${e} * 0.65);
        height: calc(${e} * 0.65);
      }

      .logo-icon svg .fill-color {
        fill: white;
      }

      .logo-icon svg .stroke-color {
        stroke: red;
      }

      .close-button {
        position: absolute;
        right: 1.2rem;
        top: 1.2rem;
        width: 2rem;
        height: 2rem;
        border-radius: 100%;
        border: 0;
        padding: 0;
        cursor: pointer;
        background-color: white;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.18),
          0 4px 4px 0 rgba(0, 0, 0, 0.08);
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      }

      slot::slotted(.sr-only) {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      }
    `}};d([v({type:Object})],dt.prototype,"config",void 0);dt=d([D("modal-template")],dt);function Cn(i,e,t){var o=t||{},n=o.noTrailing,a=n===void 0?!1:n,r=o.noLeading,u=r===void 0?!1:r,s=o.debounceMode,l=s===void 0?void 0:s,c,m=!1,y=0;function f(){c&&clearTimeout(c)}function _(B){var de=B||{},Y=de.upcomingOnly,Ke=Y===void 0?!1:Y;f(),m=!Ke}function S(){for(var B=arguments.length,de=new Array(B),Y=0;Y<B;Y++)de[Y]=arguments[Y];var Ke=this,vt=Date.now()-y;if(m)return;function De(){y=Date.now(),e.apply(Ke,de)}function gt(){c=void 0}!u&&l&&!c&&De(),f(),l===void 0&&vt>i?u?(y=Date.now(),a||(c=setTimeout(l?gt:De,i))):De():a!==!0&&(c=setTimeout(l?gt:De,l===void 0?i-vt:i))}return S.cancel=_,S}var ne;(function(i){i.Open="open",i.Closed="closed"})(ne||(ne={}));class wn{constructor(e){this.windowResizeThrottler=Cn(100,this.updateModalContainerHeight,{noLeading:!1,noTrailing:!1}).bind(this),this.modalManager=e}handleModeChange(e){switch(e){case ne.Open:this.startResizeListener(),this.stopDocumentScroll();break;case ne.Closed:this.stopResizeListener(),this.resumeDocumentScroll();break}}updateModalContainerHeight(){this.modalManager.style.setProperty("--containerHeight",`${window.innerHeight}px`)}stopDocumentScroll(){document.body.classList.add("modal-manager-open")}resumeDocumentScroll(){document.body.classList.remove("modal-manager-open")}startResizeListener(){window.addEventListener("resize",this.windowResizeThrottler)}stopResizeListener(){window.removeEventListener("resize",this.windowResizeThrottler)}}let ye=class extends I{constructor(){super(...arguments),this.mode=ne.Closed,this.hostBridge=new wn(this),this.modal=new pn(this),this.closeOnBackdropClick=!0}firstUpdated(){return p(this,void 0,void 0,function*(){yield new Promise(e=>setTimeout(e,0)),this.closeOnBackdropClick&&this.addEventListener("keydown",e=>{e.key==="Escape"&&this.backdropClicked()})})}disconnectedCallback(){super.disconnectedCallback(),this.modal.deactivate()}render(){return g`
      <div class="container">
        <div class="backdrop" @click=${this.backdropClicked}></div>
        <modal-template
          @closeButtonPressed=${this.closeButtonPressed}
          tabindex="-1"
        >
          ${this.customModalContent}
        </modal-template>
      </div>
    `}getMode(){return this.mode}closeModal(){this.mode=ne.Closed,this.customModalContent=void 0,this.modalTemplate.config=new Q,this.modal.deactivate()}callUserClosedModalCallback(){const e=this.userClosedModalCallback;this.userClosedModalCallback=void 0,e&&e()}showModal(e){return p(this,void 0,void 0,function*(){this.closeOnBackdropClick=e.config.closeOnBackdropClick,this.userClosedModalCallback=e.userClosedModalCallback,this.modalTemplate.config=e.config,this.customModalContent=e.customModalContent,this.mode=ne.Open,yield this.modalTemplate.updateComplete,this.modalTemplate.focus(),this.modal.activate()})}updated(e){e.has("mode")&&this.handleModeChange()}backdropClicked(){this.closeOnBackdropClick&&(this.closeModal(),this.callUserClosedModalCallback())}handleModeChange(){this.hostBridge.handleModeChange(this.mode),this.emitModeChangeEvent()}emitModeChangeEvent(){const e=new CustomEvent("modeChanged",{detail:{mode:this.mode}});this.dispatchEvent(e)}closeButtonPressed(){this.closeModal(),this.callUserClosedModalCallback()}static get styles(){const e=h`var(--modalBackdropColor, rgba(10, 10, 10, 0.9))`,t=h`var(--modalBackdropZindex, 1000)`,o=h`var(--modalWidth, 32rem)`,n=h`var(--modalMaxWidth, 95%)`,a=h`var(--modalZindex, 2000)`;return h`
      .container {
        width: 100%;
        height: 100%;
      }

      .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        background-color: ${e};
        width: 100%;
        height: 100%;
        z-index: ${t};
      }

      modal-template {
        outline: 0;
        position: fixed;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: ${a};
        width: ${o};
        max-width: ${n};
      }
    `}};d([v({type:String,reflect:!0})],ye.prototype,"mode",void 0);d([v({type:Object})],ye.prototype,"customModalContent",void 0);d([v({type:Object})],ye.prototype,"hostBridge",void 0);d([b("modal-template")],ye.prototype,"modalTemplate",void 0);ye=d([D("modal-manager")],ye);let se=class extends I{constructor(){super(...arguments),this.amount=5,this.currencyType="$",this.donationType=w.OneTime,this.confirmDonation=()=>{},this.cancelDonation=()=>{}}get confirmationText(){const e=k(this.amount,{symbol:this.currencySymbol}).format();return g`
      <p>
        You are about to make a <b>${this.donationType}</b> donation of
        <b>${e} ${this.currencyType}</b> to the Internet Archive.
      </p>
    `}get confirmUpsellText(){const e=k(this.amount,{symbol:this.currencySymbol}).format();return g`<p>
      You are about to begin making <b>monthly</b> donations of
      <b>${e} ${this.currencyType}</b> to the Internet Archive. (Your first recurring
      contribution will be next month.)
    </p>`}confirm(){this===null||this===void 0||this.confirmDonation()}cancel(){this===null||this===void 0||this.cancelDonation()}get confirmCTA(){return this.donationType===w.Upsell?"Start monthly donation":"Complete donation"}render(){return g`
      ${this.donationType===w.Upsell?this.confirmUpsellText:this.confirmationText}

      <div class="cta-group">
        <button id="confirm" @click=${()=>this.confirm()}>${this.confirmCTA}</button>
        <button id="cancel" @click=${()=>this.cancel()}>Cancel</button>
      </div>
    `}static get styles(){const e=h`var(--upsellCTAButtonColor, #194880)`,t=h`var(--upsellCTAButtonDisabledColor, rgba(109,148,201,0.5))`;return h`
      :host {
        display: block;
      }

      button {
        outline: none;
        cursor: pointer;
      }

      button#confirm {
        font-size: 2rem;
        display: block;
        width: 100%;
        margin-top: 0.5rem;
        padding: 1rem 2rem;
        background-color: ${e};
        color: #fff;
        border-radius: 5px;
        border: 0;
        font-weight: bold;
        line-height: normal;
      }

      button#cancel {
        margin-top: 1rem;
        border: 0;
        text-decoration: underline;
        background-color: transparent;
      }

      button:disabled {
        background-color: ${t};
        cursor: not-allowed;
      }
    }`}get currencySymbol(){switch(this.currencyType){case"AUD":return"AU$";case"BRL":return"R$";case"CAD":return"CA$";case"CHF":return"Fr";case"CNY":return"¥";case"CZK":return"Kč";case"DKK":return"Kr";case"EUR":return"€";case"GBP":return"£";case"HKD":return"HK$";case"HUF":return"Ft";case"ILS":return"₪";case"JPY":return"¥";case"MXN":return"MX$";case"MYR":return"RM";case"NOK":return"kr";case"PLN":return"zł";case"RUB":return"₽";case"SEK":return"kr";case"SGD":return"S$";case"THB":return"฿";case"TYD":return"NT$";default:return"$"}}};d([v({type:Number})],se.prototype,"amount",void 0);d([v({type:String})],se.prototype,"currencyType",void 0);d([v({type:String})],se.prototype,"donationType",void 0);d([v({type:Function})],se.prototype,"confirmDonation",void 0);d([v({type:Function})],se.prototype,"cancelDonation",void 0);se=d([D("confirm-donation-modal")],se);let Rt=class extends I{render(){return g`
      <div class="container">
        <a
          href="https://help.archive.org/help/why-is-there-a-problem-processing-my-donation/"
          rel="noopener"
          target="_blank"
        >
          Questions?
        </a>
      </div>
    `}static get styles(){const e=h`var(--errorModalQuestionsLinkTopMargin, 1rem)`,t=h`var(--errorModalQuestionsLinkFontColor, #333)`,o=h`var(--errorModalQuestionsLinkFontSize, 1.4rem)`;return h`
      .container {
        margin-top: ${e};
        text-align: center;
      }

      a,
      a:link,
      a:visited {
        color: ${t};
        font-size: ${o};
      }
    `}};Rt=d([D("donation-form-error-modal-content")],Rt);var X;(function(i){i.Blue="#497fbf",i.Green="#55A183",i.Red="#691916"})(X||(X={}));class Ge{constructor(e){this.modalManager=e.modalManager,this.braintreeManager=e.braintreeManager,this.analytics=e.analytics}closeModal(){this.modalManager.closeModal()}showProcessingModal(){const e=new Q({headerColor:X.Blue,showProcessingIndicator:!0,closeOnBackdropClick:!1,showCloseButton:!1,processingImageMode:"processing",title:g` Processing... `});this.modalManager.showModal({config:e})}showThankYouModal(e){const t=new Q({showProcessingIndicator:!0,processingImageMode:"complete",headerColor:X.Green,title:g` Thank You! `});this.modalManager.showModal({config:t});let n=`Donated-${e.successResponse.paymentProvider.replace(/\s+/g,"")}`;e.upsellSuccessResponse&&(n+="-upsell");const a=e.successResponse.donationType;this.analytics.logDonationFlowEvent(n,a),this.braintreeManager.donationSuccessful(e)}showErrorModal(e){const t=new Q({headerColor:X.Red,title:g` Processing error `,headline:g` There's been a problem completing your donation. `,message:g` ${e?.message} `});this.modalManager.showModal({config:t,userClosedModalCallback:e?.userClosedModalCallback,customModalContent:g`
        <donation-form-error-modal-content></donation-form-error-modal-content>
      `})}showConfirmationStepModal(e){const t=()=>{e?.confirmDonationCB()},o=()=>{e?.cancelDonationCB()},n=e.donationType===w.Upsell?"Confirm monthly donation":"Complete donation",a=new Q({closeOnBackdropClick:!1,headerColor:X.Green,title:g`${n}`,message:g`
        <confirm-donation-modal
          .amount="${e.amount}"
          .currencyType="${e.currencyType}"
          .donationType="${e.donationType}"
          .confirmDonation=${t}
          .cancelDonation=${o}
        ></confirm-donation-modal>
      `});return this.modalManager.showModal({config:a,userClosedModalCallback:o})}showUpsellModal(e){var t;const o=new Q({headerColor:X.Green,title:g` Donation received `,processingImageMode:"complete",showProcessingIndicator:!0}),n=Ge.getDefaultUpsellAmount(e.oneTimeAmount);e.amountChanged&&e.amountChanged(n);const a=g`
      <upsell-modal-content
        .amount=${n}
        .yesButtonMode=${(t=e?.ctaMode)!==null&&t!==void 0?t:G.YesButton}
        @yesSelected=${r=>e?.yesSelected?e.yesSelected(r.detail.amount):void 0}
        @noThanksSelected=${e?.noSelected}
        @amountChanged=${r=>e?.amountChanged?e.amountChanged(r.detail.amount):void 0}
      >
        <slot name="paypal-upsell-button"></slot>
      </upsell-modal-content>
    `;return this.modalManager.showModal({config:o,customModalContent:a,userClosedModalCallback:e?.userClosedModalCallback})}startDonationSubmissionFlow(e){return p(this,void 0,void 0,function*(){this.showProcessingModal();try{const t=yield this.braintreeManager.submitDonation(e);if(t.success)return this.handleSuccessfulDonationResponse(e.donationInfo,t.value),t;{const o=t.value;return this.showErrorModal({message:o.message}),t}}catch(t){this.showErrorModal({message:`${t}`}),console.error("error getting a response",t);return}})}upsellModalYesSelected(e,t){return p(this,void 0,void 0,function*(){this.showProcessingModal();try{const o=yield this.braintreeManager.submitUpsellDonation({oneTimeDonationResponse:e,amount:t});if(o.success)this.completeUpsell({successResponse:e,upsellSuccessResponse:o.value});else{const n=o.value;this.showErrorModal({message:n.message})}return o}catch(o){this.showErrorModal({message:`${o}`}),console.error("error getting a response",o);return}})}completeUpsell(e){this.showThankYouModal(e);const o=`Donated-${e.successResponse.paymentProvider.replace(/\s+/g,"")}-upsell`,n=e.successResponse.donationType;this.analytics.logDonationFlowEvent(o,n),this.braintreeManager.donationSuccessful(e)}static getDefaultUpsellAmount(e){let t=5;return e<=10?t=8:e>10&&e<=25?t=10:e>25&&e<=100?t=25:e>100&&(t=50),t}handleSuccessfulDonationResponse(e,t){switch(e.donationType){case w.OneTime:this.showUpsellModal({oneTimeAmount:t.amount,yesSelected:o=>{this.upsellModalYesSelected(t,o)},noSelected:()=>{this.showThankYouModal({successResponse:t})},userClosedModalCallback:()=>{this.showThankYouModal({successResponse:t})}});break;case w.Monthly:this.showThankYouModal({successResponse:t});break;case w.Upsell:break}}}class Sn{constructor(e){this.upsellButtonDataSource=e.upsellButtonDataSource,this.oneTimePayload=e.oneTimePayload,this.oneTimeSuccessResponse=e.oneTimeSuccessResponse}}class $n{updateDonationInfo(e){this.buttonDataSource&&(this.buttonDataSource.donationInfo=e)}updateUpsellDonationInfo(e){this.upsellButtonDataSourceContainer&&(this.upsellButtonDataSourceContainer.upsellButtonDataSource.donationInfo=e)}constructor(e){this.emitter=be(),this.braintreeManager=e.braintreeManager,this.donationFlowModalManager=e.donationFlowModalManager}on(e,t){return this.emitter.on(e,t)}payPalPaymentStarted(e,t){return p(this,void 0,void 0,function*(){this.emitter.emit("payPalPaymentStarted",e,t)})}payPalPaymentAuthorized(e,t){return p(this,void 0,void 0,function*(){const{donationType:o,total:n}=e.donationInfo;this.donationFlowModalManager.showConfirmationStepModal({donationType:o,amount:n,currencyType:"USD",confirmDonationCB:()=>{this.payPalPaymentConfirmed(e,t)},cancelDonationCB:()=>{this.donationFlowModalManager.closeModal(),this.payPalPaymentCancelled(e,{})}})})}payPalPaymentConfirmed(e,t){return p(this,void 0,void 0,function*(){this.emitter.emit("payPalPaymentConfirmed",e,{}),this.donationFlowModalManager.showProcessingModal();const o=e.donationInfo.donationType,n=t?.details,a=new xe({email:n?.email,firstName:n?.firstName,lastName:n?.lastName}),r=n.shippingAddress,u=new Te({streetAddress:r?.line1,extendedAddress:r?.line2,locality:r?.city,region:r?.state,postalCode:r?.postalCode,countryCodeAlpha2:r?.countryCode}),s=this.upsellButtonDataSourceContainer?this.upsellButtonDataSourceContainer.oneTimeSuccessResponse.transaction_id:void 0,l=yield this.braintreeManager.submitDonation({nonce:t.nonce,paymentProvider:F.PayPal,donationInfo:e.donationInfo,customerInfo:a,billingInfo:u,upsellOnetimeTransactionId:s});if(!l.success){const m=l.value;this.donationFlowModalManager.showErrorModal({message:m.message});return}const c=l.value;switch(o){case w.OneTime:this.showUpsellModal(t,c);break;case w.Monthly:this.donationFlowModalManager.showThankYouModal({successResponse:c});break;case w.Upsell:this.upsellButtonDataSourceContainer?this.donationFlowModalManager.showThankYouModal({successResponse:this.upsellButtonDataSourceContainer.oneTimeSuccessResponse,upsellSuccessResponse:c}):this.donationFlowModalManager.showErrorModal({message:"Error setting up monthly donation"});break}})}payPalPaymentCancelled(e,t){return p(this,void 0,void 0,function*(){this.emitter.emit("payPalPaymentCancelled",e,t)})}payPalPaymentError(e,t){return p(this,void 0,void 0,function*(){this.emitter.emit("payPalPaymentError",e,t),console.error("PaymentSector:payPalPaymentError error:",e,e.donationInfo,t)})}renderPayPalButton(e){return p(this,void 0,void 0,function*(){var t;const o=yield(t=this.braintreeManager)===null||t===void 0?void 0:t.paymentProviders.paypalHandler.get();this.buttonDataSource=yield o?.renderPayPalButton({selector:"#paypal-button",style:{color:"blue",label:"paypal",shape:"rect",size:"medium",tagline:!1},donationInfo:e}),this.buttonDataSource&&(this.buttonDataSource.delegate=this)})}showUpsellModal(e,t){return p(this,void 0,void 0,function*(){this.donationFlowModalManager.showUpsellModal({oneTimeAmount:t.amount,amountChanged:this.upsellAmountChanged.bind(this),noSelected:()=>{this.donationFlowModalManager.showThankYouModal({successResponse:t})},ctaMode:G.PayPalUpsellSlot,userClosedModalCallback:()=>{this.donationFlowModalManager.showThankYouModal({successResponse:t})}});const o=Ge.getDefaultUpsellAmount(t.amount),n=new N({amount:o,donationType:w.Upsell,coverFees:!1});this.upsellButtonDataSourceContainer||this.renderUpsellPayPalButton({donationInfo:n,oneTimePayload:e,oneTimeSuccessResponse:t})})}upsellAmountChanged(e){this.upsellButtonDataSourceContainer&&(this.upsellButtonDataSourceContainer.upsellButtonDataSource.donationInfo.amount=e)}renderUpsellPayPalButton(e){return p(this,void 0,void 0,function*(){var t;const o=yield(t=this.braintreeManager)===null||t===void 0?void 0:t.paymentProviders.paypalHandler.get(),n=yield o?.renderPayPalButton({selector:"#paypal-upsell-button",style:{color:"blue",label:"paypal",shape:"rect",size:"responsive",tagline:!1},donationInfo:e.donationInfo});n?(n.delegate=this,this.upsellButtonDataSourceContainer=new Sn({upsellButtonDataSource:n,oneTimePayload:e.oneTimePayload,oneTimeSuccessResponse:e.oneTimeSuccessResponse})):console.error("error rendering paypal upsell button")})}}class Mn{constructor(e){this.braintreeManager=e.braintreeManager,this.donationFlowModalManager=e.donationFlowModalManager}paymentInitiated(e,t){return p(this,void 0,void 0,function*(){var o;this.donationFlowModalManager.showProcessingModal();const n=yield(o=this.braintreeManager)===null||o===void 0?void 0:o.paymentProviders.applePayHandler.get();this.applePayDataSource=yield n?.createPaymentRequest(t,e),this.applePayDataSource&&(this.applePayDataSource.delegate=this)})}modalYesSelected(e,t){return p(this,void 0,void 0,function*(){this.donationFlowModalManager.showProcessingModal();const o=yield this.braintreeManager.submitUpsellDonation({oneTimeDonationResponse:e,amount:t});if(o.success)this.donationFlowModalManager.showThankYouModal({successResponse:e,upsellSuccessResponse:o.value});else{const n=o.value;this.donationFlowModalManager.showErrorModal({message:n.message})}})}paymentComplete(e){var t;if(e.success){const o=e.value;((t=this.applePayDataSource)===null||t===void 0?void 0:t.donationInfo.donationType)==w.OneTime?this.donationFlowModalManager.showUpsellModal({oneTimeAmount:o.amount,yesSelected:this.modalYesSelected.bind(this,o),noSelected:this.donationFlowModalManager.showThankYouModal.bind(this.donationFlowModalManager,{successResponse:o}),userClosedModalCallback:this.donationFlowModalManager.showThankYouModal.bind(this.donationFlowModalManager,{successResponse:o})}):this.donationFlowModalManager.showThankYouModal({successResponse:o})}else{const o=e.value;this.donationFlowModalManager.showErrorModal({message:o.message})}}paymentFailed(){this.donationFlowModalManager.showErrorModal({message:"Payment failed"})}paymentCancelled(){this.donationFlowModalManager.closeModal()}}class Ot{constructor(e){this.contactInfo=e.contactInfo,this.donationInfo=e.donationInfo}}class An{constructor(e){this.persistanceKey="venmoRestorationStateInfo",e?.storageSystem?this.storageSystem=e.storageSystem:this.storageSystemAvailable(localStorage)?this.storageSystem=localStorage:this.storageSystemAvailable(sessionStorage)&&(this.storageSystem=sessionStorage)}clearState(){var e;(e=this.storageSystem)===null||e===void 0||e.removeItem(this.persistanceKey)}persistState(e,t){var o;const n=new Ot({contactInfo:e,donationInfo:t}),a=JSON.stringify(n);(o=this.storageSystem)===null||o===void 0||o.setItem(this.persistanceKey,a)}getRestorationState(){return p(this,void 0,void 0,function*(){var e;const t=(e=this.storageSystem)===null||e===void 0?void 0:e.getItem(this.persistanceKey);if(!t){console.error("restoreState: No stored data");return}const o=JSON.parse(t);if(!o){console.error("restoreState: Data could not be deserialized");return}return new Ot(o)})}storageSystemAvailable(e){try{return e.setItem("foo","bar"),e.removeItem("foo"),!0}catch{return!1}}}class Pn{constructor(e){var t;this.braintreeManager=e.braintreeManager,this.donationFlowModalManager=e.donationFlowModalManager,this.restorationStateHandler=(t=e.restorationStateHandler)!==null&&t!==void 0?t:new An}startup(){return p(this,void 0,void 0,function*(){const e=yield this.braintreeManager.paymentProviders.venmoHandler.get(),t=yield e?.instance.get();if(t?.hasTokenizationResult()){const o=yield this.restorationStateHandler.getRestorationState();o?this.paymentInitiated(o.contactInfo,o.donationInfo):(console.error("no restoration info"),this.donationFlowModalManager.showErrorModal({message:"Error restoring donation session"}))}})}paymentInitiated(e,t){return p(this,void 0,void 0,function*(){this.restorationStateHandler.persistState(e,t);try{const o=yield this.braintreeManager.paymentProviders.venmoHandler.get(),n=yield o?.startPayment();if(!n){this.restorationStateHandler.clearState(),this.donationFlowModalManager.showErrorModal({message:"Error setting up the donation"});return}this.handleTokenizationResult(n,e,t)}catch(o){this.restorationStateHandler.clearState(),this.handleTokenizationError(o),this.donationFlowModalManager.showErrorModal({message:"There was a problem loading your donation information. Please try again."})}})}handleTokenizationResult(e,t,o){return p(this,void 0,void 0,function*(){this.restorationStateHandler.clearState(),this.donationFlowModalManager.startDonationSubmissionFlow({nonce:e.nonce,paymentProvider:F.Venmo,donationInfo:o,customerInfo:t.customer,billingInfo:t.billing})})}handleTokenizationError(e){switch(e.code){case"VENMO_APP_CANCELED":break;case"VENMO_CANCELED":break;default:console.error("Error!",e)}}}class In{constructor(e){this.emitter=be(),this.braintreeManager=e.braintreeManager,this.donationFlowModalManager=e.donationFlowModalManager}on(e,t){return this.emitter.on(e,t)}paymentInitiated(e){return p(this,void 0,void 0,function*(){var t,o;const n=yield(t=this.braintreeManager)===null||t===void 0?void 0:t.paymentProviders.googlePayHandler.get(),a=yield n.instance.get(),r=yield a.createPaymentDataRequest({emailRequired:!0,transactionInfo:{currencyCode:"USD",totalPriceStatus:"FINAL",totalPrice:`${e.total}`}}),u=r.allowedPaymentMethods[0];u.parameters.billingAddressRequired=!0,u.parameters.billingAddressParameters={format:"FULL",phoneNumberRequired:!1};try{const s=yield n.paymentsClient.loadPaymentData(r),l=yield a.parseResponse(s),c=(o=s.paymentMethodData.info)===null||o===void 0?void 0:o.billingAddress,m=c?.name;let y=m,f="";const _=m?.lastIndexOf(" ");_&&_!==-1&&(y=m?.substr(0,_),f=m?.substr(_));const S=new xe({email:s.email,firstName:y,lastName:f}),B=new Te({streetAddress:c?.address1,extendedAddress:c?.address2,locality:c?.locality,region:c?.administrativeArea,postalCode:c?.postalCode,countryCodeAlpha2:c?.countryCode});this.donationFlowModalManager.startDonationSubmissionFlow({nonce:l.nonce,paymentProvider:F.GooglePay,bin:l.details.bin,binName:l.binData.issuingBank,donationInfo:e,customerInfo:S,billingInfo:B})}catch{this.emitter.emit("paymentCancelled"),this.donationFlowModalManager.closeModal()}})}}class Fn{startup(){return p(this,void 0,void 0,function*(){var e,t;(e=this.venmoHandler)===null||e===void 0||e.startup(),(t=this.creditCardHandler)===null||t===void 0||t.startup()})}showUpsellModal(e){return p(this,void 0,void 0,function*(){return this.donationFlowModalManager.showUpsellModal(e)})}showConfirmationStepModal(e){return this.donationFlowModalManager.showConfirmationStepModal(e)}get creditCardHandler(){return this.creditCardHandlerCache?this.creditCardHandlerCache:(this.creditCardHandlerCache=new ln({braintreeManager:this.braintreeManager,donationFlowModalManager:this.donationFlowModalManager,recaptchaManager:this.recaptchaManager}),this.creditCardHandlerCache)}get paypalHandler(){return this.paypalHandlerCache?this.paypalHandlerCache:(this.paypalHandlerCache=new $n({braintreeManager:this.braintreeManager,donationFlowModalManager:this.donationFlowModalManager}),this.paypalHandlerCache)}get applePayHandler(){return this.applePayHandlerCache?this.applePayHandlerCache:(this.applePayHandlerCache=new Mn({braintreeManager:this.braintreeManager,donationFlowModalManager:this.donationFlowModalManager}),this.applePayHandlerCache)}get venmoHandler(){return this.venmoHandlerCache?this.venmoHandlerCache:(this.venmoHandlerCache=new Pn({braintreeManager:this.braintreeManager,donationFlowModalManager:this.donationFlowModalManager}),this.venmoHandlerCache)}get googlePayHandler(){return this.googlePayHandlerCache?this.googlePayHandlerCache:(this.googlePayHandlerCache=new In({braintreeManager:this.braintreeManager,donationFlowModalManager:this.donationFlowModalManager}),this.googlePayHandlerCache)}constructor(e){this.braintreeManager=e.braintreeManager,this.modalManager=e.modalManager,this.recaptchaManager=e.recaptchaManager,this.resources=e.resources,this.donationFlowModalManager=new Ge({braintreeManager:this.braintreeManager,modalManager:this.modalManager,analytics:this.resources.analytics})}}class En{constructor(e){this.isExecuting=!1,this.grecaptchaLibrary=e.grecaptchaLibrary,this.siteKey=e.siteKey}execute(){return this.isExecuting&&this.finishExecution(),this.isExecuting=!0,new Promise((e,t)=>{this.executionSuccessBlock=o=>{this.finishExecution(),e(o)},this.executionExpiredBlock=()=>{this.finishExecution(),t("expired")},this.executionErrorBlock=()=>{this.finishExecution(),t("error")},this.grecaptchaLibrary.execute()})}finishExecution(){this.isExecuting=!1,this.grecaptchaLibrary.reset()}setup(e,t,o,n){this.grecaptchaLibrary.render(e,{callback:this.responseHandler.bind(this),"expired-callback":this.expiredHandler.bind(this),"error-callback":this.errorHandler.bind(this),sitekey:this.siteKey,tabindex:t,theme:o,type:n,size:"invisible"})}responseHandler(e){this.executionSuccessBlock&&(this.executionSuccessBlock(e),this.executionSuccessBlock=void 0)}expiredHandler(){this.executionExpiredBlock&&(this.executionExpiredBlock(),this.executionExpiredBlock=void 0)}errorHandler(){this.executionErrorBlock&&(this.executionErrorBlock(),this.executionErrorBlock=void 0)}}class _n{constructor(e){this.hostedFieldFieldOptions=e.hostedFieldFieldOptions,this.hostedFieldStyle=e.hostedFieldStyle,this.hostedFieldContainer=e.hostedFieldContainer}}var ie;(function(i){i.LeaveSpace="leave-space",i.CompressSpace="compress-space"})(ie||(ie={}));let le=class extends I{constructor(){super(...arguments),this.error=!1,this.required=!1,this.iconSpaceOption=ie.LeaveSpace,this.requiredIndicatorSpaceOption=ie.LeaveSpace}render(){return g`
      <div class="input-wrapper ${this.errorClass} ${this.iconSpaceOptionClass}">
        <div class="icon-container">${this.icon}</div>
        <div class="required-indicator ${this.requiredIndicatorSpaceOption}">
          ${this.required?g` * `:$}
        </div>

        <slot></slot>
      </div>
    `}get errorClass(){return this.error?"error":""}get iconSpaceOptionClass(){return this.iconSpaceOption===ie.CompressSpace?"compress-space":""}static get styles(){const e=h`var(--inputBorder, 1px solid #d9d9d9)`,t=h`var(--badgedInputBorderErrorColor, red)`,o=h`var(--badgedInputIconSize, 1.4rem)`,n=h`var(--badgedInputIconSpacerWidth, 3rem)`,a=h`var(--badgedInputNoIconSpacerWidth, 1rem)`,r=h`var(--badgedInputHeight, 3rem)`,u=h`var(--badgedInputRequiredIndicatorColor, red)`,s=h`var(--badgedInputRequiredIndicatorMargin, 0 0.25rem 0 0)`,l=h`var(--badgedInputRequiredIndicatorFontSize, 2rem)`;return h`
      .input-wrapper {
        border: ${e};
        height: ${r};
        display: flex;
        align-items: center;
      }

      .input-wrapper.error {
        box-shadow: inset 0px 0px 0px 1px ${t};
        border-color: ${t};
      }

      .input-wrapper.compress-space .icon-container {
        width: ${a};
      }

      .icon-container {
        width: ${n};
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .icon-container svg {
        height: ${o};
      }

      .required-indicator {
        color: ${u};
        font-size: ${l};
        margin: ${s};
      }

      .required-indicator.leave-space {
        width: 0.5em;
      }
    `}};d([v({type:Boolean})],le.prototype,"error",void 0);d([v({type:Object})],le.prototype,"icon",void 0);d([v({type:Boolean})],le.prototype,"required",void 0);d([v({type:String})],le.prototype,"iconSpaceOption",void 0);d([v({type:String})],le.prototype,"requiredIndicatorSpaceOption",void 0);le=d([D("badged-input")],le);const Be=i=>i??E,kn=g`
<svg viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg" aria-labelledby="emailTitleID emailDescID">
  <title id="emailTitleID">Email icon</title>
  <desc id="emailDescID">An illustration of an envelope</desc>
  <path d="m32 7.04156803v19.91686397c0 .5752421-.4763773 1.041568-1.0640184 1.041568h-27.87196316c-.58764116 0-1.06401844-.4663259-1.06401844-1.041568v-19.91686397c0-.57524214.47637728-1.04156803 1.06401844-1.04156803h27.87196316c.5876411 0 1.0640184.46632589 1.0640184 1.04156803zm-26.25039901 1.19676167 10.04327011 10.1323738c.5135662.4194048.8817166.6291071 1.1044511.6291071.1198794 0 .2695514-.0503424.4490158-.1510273.1794644-.100685.3291364-.2013699.4490158-.3020548l.1798191-.1510273 10.1198794-10.15841306zm16.77212271 9.7303286 6.8831353 6.7889404v-13.5778809zm-17.92871075-6.6379131v13.350819l6.78098955-6.6629107zm22.09008685 14.2059464-5.9074304-5.8588202-.9757049.9551179-.3594018.3295984c-.0342324.0304241-.0665646.0587822-.0969964.0850743l-.1597867.1329606c-.0684912.0540844-.1198794.0895749-.1541644.1064714-.6674943.3687151-1.3523675.5530727-2.0546196.5530727-.65047 0-1.3782586-.218035-2.1833659-.6541048l-.6682036-.4520405-1.0278418-1.0311524-5.95850326 5.832781z" class="fill-color" />
</svg>
`,Tn=g`
<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" aria-labelledby="localPinTitleID localePinDescID">
  <title id="localePinTitleID">Locale pin icon</title>
  <desc id="localePinDescID">An illustration of a map pin</desc>
  <path
    d="m6.30188679 0c2.37586647 0 4.30188681 1.92602032 4.30188681 4.30188679 0 1.58391098-1.43396228 4.14994872-4.30188681 7.69811321l-.3127572-.3901988c-2.65941973-3.34669534-3.98912959-5.7826668-3.98912959-7.30791441 0-2.37586647 1.92602032-4.30188679 4.30188679-4.30188679zm0 2.26415094c-1.12541043 0-2.03773585.91232542-2.03773585 2.03773585 0 1.12541044.91232542 2.03773585 2.03773585 2.03773585 1.12541044 0 2.03773585-.91232541 2.03773585-2.03773585 0-1.12541043-.91232541-2.03773585-2.03773585-2.03773585z"
    class="fill-color"
    fill-rule="evenodd"
  />
</svg>
`,xn=g`
<svg
  viewBox="0 0 40 40"
  xmlns="http://www.w3.org/2000/svg"
  aria-labelledby="userTitleID userDescID"
>
  <title id="userTitleID">User icon</title>
  <desc id="userDescID">An illustration of a person's head and chest.</desc>
  <path class="fill-color" d="m20.7130435 18.0434783c-3.5658385 0-6.4565218-2.9198821-6.4565218-6.5217392 0-3.60185703 2.8906833-6.5217391 6.4565218-6.5217391s6.4565217 2.91988207 6.4565217 6.5217391c0 3.6018571-2.8906832 6.5217392-6.4565217 6.5217392zm-12.9130435 16.9565217c0-7.9240855 5.7813665-14.3478261 12.9130435-14.3478261s12.9130435 6.4237406 12.9130435 14.3478261z" fill-rule="evenodd"/>
</svg>
`,nt={AF:"Afghanistan",AX:"Aland Islands",AL:"Albania",DZ:"Algeria",AS:"American Samoa",AD:"Andorra",AO:"Angola",AI:"Anguilla",AQ:"Antarctica",AG:"Antigua and Barbuda",AR:"Argentina",AM:"Armenia",AW:"Aruba",AU:"Australia",AT:"Austria",AZ:"Azerbaijan",BS:"Bahamas",BH:"Bahrain",BD:"Bangladesh",BB:"Barbados",BY:"Belarus",BE:"Belgium",BZ:"Belize",BJ:"Benin",BM:"Bermuda",BT:"Bhutan",BO:"Bolivia",BQ:"Bonaire, Saint Eustatius and Saba ",BA:"Bosnia and Herzegovina",BW:"Botswana",BV:"Bouvet Island",BR:"Brazil",IO:"British Indian Ocean Territory",VG:"British Virgin Islands",BN:"Brunei",BG:"Bulgaria",BF:"Burkina Faso",BI:"Burundi",KH:"Cambodia",CM:"Cameroon",CA:"Canada",CV:"Cape Verde",KY:"Cayman Islands",CF:"Central African Republic",TD:"Chad",CL:"Chile",CN:"China",CX:"Christmas Island",CC:"Cocos Islands",CO:"Colombia",KM:"Comoros",CK:"Cook Islands",CR:"Costa Rica",HR:"Croatia",CU:"Cuba",CW:"Curacao",CY:"Cyprus",CZ:"Czech Republic",CD:"Democratic Republic of the Congo",DK:"Denmark",DJ:"Djibouti",DM:"Dominica",DO:"Dominican Republic",TL:"East Timor",EC:"Ecuador",EG:"Egypt",SV:"El Salvador",GQ:"Equatorial Guinea",ER:"Eritrea",EE:"Estonia",ET:"Ethiopia",FK:"Falkland Islands",FO:"Faroe Islands",FJ:"Fiji",FI:"Finland",FR:"France",GF:"French Guiana",PF:"French Polynesia",TF:"French Southern Territories",GA:"Gabon",GM:"Gambia",GE:"Georgia",DE:"Germany",GH:"Ghana",GI:"Gibraltar",GR:"Greece",GL:"Greenland",GD:"Grenada",GP:"Guadeloupe",GU:"Guam",GT:"Guatemala",GG:"Guernsey",GN:"Guinea",GW:"Guinea-Bissau",GY:"Guyana",HT:"Haiti",HM:"Heard Island and McDonald Islands",HN:"Honduras",HK:"Hong Kong",HU:"Hungary",IS:"Iceland",IN:"India",ID:"Indonesia",IR:"Iran",IQ:"Iraq",IE:"Ireland",IM:"Isle of Man",IL:"Israel",IT:"Italy",CI:"Ivory Coast",JM:"Jamaica",JP:"Japan",JE:"Jersey",JO:"Jordan",KZ:"Kazakhstan",KE:"Kenya",KI:"Kiribati",XK:"Kosovo",KW:"Kuwait",KG:"Kyrgyzstan",LA:"Laos",LV:"Latvia",LB:"Lebanon",LS:"Lesotho",LR:"Liberia",LY:"Libya",LI:"Liechtenstein",LT:"Lithuania",LU:"Luxembourg",MO:"Macao",MK:"Macedonia",MG:"Madagascar",MW:"Malawi",MY:"Malaysia",MV:"Maldives",ML:"Mali",MT:"Malta",MH:"Marshall Islands",MQ:"Martinique",MR:"Mauritania",MU:"Mauritius",YT:"Mayotte",MX:"Mexico",FM:"Micronesia",MD:"Moldova",MC:"Monaco",MN:"Mongolia",ME:"Montenegro",MS:"Montserrat",MA:"Morocco",MZ:"Mozambique",MM:"Myanmar",NA:"Namibia",NR:"Nauru",NP:"Nepal",NL:"Netherlands",NC:"New Caledonia",NZ:"New Zealand",NI:"Nicaragua",NE:"Niger",NG:"Nigeria",NU:"Niue",NF:"Norfolk Island",KP:"North Korea",MP:"Northern Mariana Islands",NO:"Norway",OM:"Oman",PK:"Pakistan",PW:"Palau",PS:"Palestinian Territory",PA:"Panama",PG:"Papua New Guinea",PY:"Paraguay",PE:"Peru",PH:"Philippines",PN:"Pitcairn",PL:"Poland",PT:"Portugal",PR:"Puerto Rico",QA:"Qatar",CG:"Republic of the Congo",RE:"Reunion",RO:"Romania",RU:"Russia",RW:"Rwanda",BL:"Saint Barthelemy",SH:"Saint Helena",KN:"Saint Kitts and Nevis",LC:"Saint Lucia",MF:"Saint Martin",PM:"Saint Pierre and Miquelon",VC:"Saint Vincent and the Grenadines",WS:"Samoa",SM:"San Marino",ST:"Sao Tome and Principe",SA:"Saudi Arabia",SN:"Senegal",RS:"Serbia",SC:"Seychelles",SL:"Sierra Leone",SG:"Singapore",SX:"Sint Maarten",SK:"Slovakia",SI:"Slovenia",SB:"Solomon Islands",SO:"Somalia",ZA:"South Africa",GS:"South Georgia and the South Sandwich Islands",KR:"South Korea",SS:"South Sudan",ES:"Spain",LK:"Sri Lanka",SD:"Sudan",SR:"Suriname",SJ:"Svalbard and Jan Mayen",SZ:"Swaziland",SE:"Sweden",CH:"Switzerland",SY:"Syria",TW:"Taiwan",TJ:"Tajikistan",TZ:"Tanzania",TH:"Thailand",TG:"Togo",TK:"Tokelau",TO:"Tonga",TT:"Trinidad and Tobago",TN:"Tunisia",TR:"Turkey",TM:"Turkmenistan",TC:"Turks and Caicos Islands",TV:"Tuvalu",VI:"U.S. Virgin Islands",UG:"Uganda",UA:"Ukraine",AE:"United Arab Emirates",GB:"United Kingdom",UM:"United States Minor Outlying Islands",US:"United States",UY:"Uruguay",UZ:"Uzbekistan",VU:"Vanuatu",VA:"Vatican",VE:"Venezuela",VN:"Vietnam",WF:"Wallis and Futuna",EH:"Western Sahara",YE:"Yemen",ZM:"Zambia",ZW:"Zimbabwe"};const Dn=i=>typeof i!="string"&&"strTag"in i,Bn=(i,e,t)=>{let o=i[0];for(let n=1;n<i.length;n++)o+=e[n-1],o+=i[n];return o};const Ln=(i=>Dn(i)?Bn(i.strings,i.values):i);let Le=Ln;class Hn{constructor(){this.settled=!1,this.promise=new Promise((e,t)=>{this._resolve=e,this._reject=t})}resolve(e){this.settled=!0,this._resolve(e)}reject(e){this.settled=!0,this._reject(e)}}for(let i=0;i<256;i++)(i>>4&15).toString(16)+(i&15).toString(16);let Nn=new Hn;Nn.resolve();let M=class extends I{constructor(){super(...arguments),this.selectedCountry="US",this.donorEmail="",this.minTwoCharPattern=".*\\S{2,}.*",this.minTwoCharValidationMessage=Le("Enter at least two characters"),this.streetAddressPattern=".*?\\S.{2,}\\S.*?",this.streetAddressValidationMessage=Le("Enter at least four characters"),this.usZipCodePattern="^\\d{5}(-?\\d{4})?$",this.usZipCodeValidationMessage=Le("Enter a valid 5 or 9 digit zip/postal code")}updated(e){var t;e.has("donorEmail")&&(this.emailField.value=(t=this.donorEmail)!==null&&t!==void 0?t:"")}reportValidity(){return this.validateFormFields(),this.validateForm()}validateFormFields(){[{badgedInput:this.emailBadgedInput,inputField:this.emailField},{badgedInput:this.firstNameBadgedInput,inputField:this.firstNameField},{badgedInput:this.lastNameBadgedInput,inputField:this.lastNameField},{badgedInput:this.streetAddressBadgedInput,inputField:this.streetAddressField},{badgedInput:this.extendedAddressBadgedInput,inputField:this.extendedAddressField},{badgedInput:this.localityBadgedInput,inputField:this.localityField},{badgedInput:this.regionBadgedInput,inputField:this.regionField},{badgedInput:this.postalBadgedInput,inputField:this.postalCodeField}].forEach(({badgedInput:t,inputField:o})=>{t.error=!o.checkValidity()})}validateForm(){const e=this.form.reportValidity();return e?this.errorMessage.innerText="":this.errorMessage.innerText=Le("Please enter any missing or invalid contact information below"),e}focus(){this.emailField.focus()}render(){return g`
      <div id="donation-contact-form-error-message"></div>
      <form>
        <fieldset>
          <div class="row">
            ${this.generateInput({id:"donation-contact-form-email",placeholder:"Email",required:!0,fieldType:"email",name:"email",autocomplete:"email",minlength:5,maxlength:255,icon:kn})}
          </div>
        </fieldset>

        <fieldset>
          <div class="row">
            ${this.generateInput({id:"donation-contact-form-first-name",placeholder:"First name",name:"fname",required:!0,validationPattern:this.minTwoCharPattern,validationMessage:this.minTwoCharValidationMessage,maxlength:255,autocomplete:"given-name",icon:xn})}
          </div>
          <div class="row">
            ${this.generateInput({id:"donation-contact-form-last-name",placeholder:"Last name",name:"lname",autocomplete:"family-name",required:!0,validationPattern:this.minTwoCharPattern,validationMessage:this.minTwoCharValidationMessage,maxlength:255})}
          </div>
        </fieldset>
        <fieldset>
          <div class="row">
            ${this.generateInput({id:"donation-contact-form-street-address",placeholder:"Address Line 1",required:!0,autocomplete:"address-line1",icon:Tn,name:"street-address",validationPattern:this.streetAddressPattern,validationMessage:this.streetAddressValidationMessage})}
          </div>
          <div class="row">
            ${this.generateInput({id:"donation-contact-form-extended-address",placeholder:"Address Line 2 (optional)",autocomplete:"address-line2",required:!1,name:"extended-address"})}
          </div>
          <div class="row">
            ${this.generateInput({id:"donation-contact-form-locality",placeholder:"City",autocomplete:"address-level2",required:!0,name:"locality",validationPattern:this.minTwoCharPattern,validationMessage:this.minTwoCharValidationMessage})}
          </div>
          <div class="row">
            ${this.generateInput({id:"donation-contact-form-region",placeholder:"State / Province",autocomplete:"address-level1",required:this.regionAndPostalCodeRequired,name:"region",validationPattern:this.regionAndPostalCodeRequired?this.minTwoCharPattern:void 0,validationMessage:this.regionAndPostalCodeRequired?this.minTwoCharValidationMessage:void 0})}
            ${this.generateInput({id:"donation-contact-form-postal-code",placeholder:"Zip / Postal",autocomplete:"postal-code",required:this.regionAndPostalCodeRequired,name:"postal",validationPattern:this.regionAndPostalCodeRequired?this.usZipCodePattern:void 0,validationMessage:this.regionAndPostalCodeRequired?this.usZipCodeValidationMessage:void 0,iconSpaceOption:ie.CompressSpace})}
          </div>
          <div class="row">${this.countrySelectorTemplate}</div>
        </fieldset>
      </form>
      ${this.getStyles}
    `}get regionAndPostalCodeRequired(){return this.selectedCountry==="US"}get countrySelectorTemplate(){return g`
      <badged-input>
        <select
          id="donation-contact-form-countryCodeAlpha2"
          @change=${e=>{const t=e.target.value;nt[t]&&(this.selectedCountry=t)}}
        >
          ${Object.keys(nt).map(e=>{const t=nt[e];return g`
              <option value=${e} ?selected=${e===this.selectedCountry}>${t}</option>
            `})}
        </select>
      </badged-input>
    `}createRenderRoot(){return this}inputFocused(e){this.errorMessage.innerText="";const o=e.target.id,n=this.querySelector(`badged-input.${o}`);n.error=!1}generateInput(e){var t,o,n,a;const r=(t=e.required)!==null&&t!==void 0?t:!0,u=(o=e.fieldType)!==null&&o!==void 0?o:"text",s=(n=e.iconSpaceOption)!==null&&n!==void 0?n:ie.LeaveSpace;return g`
      <badged-input
        class=${e.id}
        .icon=${e.icon}
        .iconSpaceOption=${s}
        ?required=${e.required}
      >
        <label for=${e.id}>${e.placeholder}</label>
        <input
          type=${u}
          id=${e.id}
          class="donation-contact-form-input"
          name=${e.name}
          aria-label=${e.placeholder}
          placeholder=${e.placeholder}
          maxlength=${Be(e.maxlength)}
          minlength=${Be(e.minlength)}
          autocomplete=${(a=e.autocomplete)!==null&&a!==void 0?a:"on"}
          pattern=${Be(e.validationPattern)}
          title=${Be(e.validationMessage)}
          @focus=${this.inputFocused}
          ?required=${r}
        />
      </badged-input>
    `}get donorContactInfo(){return new Uo({billing:this.billingInfo,customer:this.contactInfo})}get billingInfo(){return new Te({streetAddress:this.streetAddressField.value,extendedAddress:this.extendedAddressField.value,locality:this.localityField.value,region:this.regionField.value,postalCode:this.postalCodeField.value,countryCodeAlpha2:this.countryCodeAlpha2Field.value})}get contactInfo(){return new xe({email:this.emailField.value,firstName:this.firstNameField.value,lastName:this.lastNameField.value})}get getStyles(){const e=h`var(--badgedInputNoIconSpacerWidth, 3rem)`,t=h`var(--badgedInputIconSpacerWidth, 5rem)`,o=h`var(--fieldSetSpacing, 1rem)`,n=h`var(--fontFamily, "Helvetica Neue", Helvetica, Arial, sans-serif)`,a=h`var(--contactFieldFontSize, 1.6rem)`,r=h`var(--inputFieldFontColor, #333)`,u=h`calc(100% - ${t})`,s=h`calc(100% - ${e})`;return g`
      <style>
        /*
          **NOTE**
          This element is in the lightDOM so be sure to prefix all styles
          with "contact-form" so styles don't leak.
         */
        contact-form fieldset {
          border: 0;
          padding: 0;
          margin: 0;
          margin-bottom: ${o};
          background-color: white;
        }

        /* These 1px and 0 margins in the next few selectors are to account for the
        double outlines caused by the fields being right next to each other */
        contact-form .row {
          display: flex;
          margin: -1px 0 0 0;
        }

        contact-form fieldset .row:first-child {
          margin-top: 0;
        }

        contact-form badged-input.donation-contact-form-region {
          width: 60%;
        }

        contact-form badged-input.donation-contact-form-postal-code {
          width: 40%;
        }

        contact-form #donation-contact-form-region {
          width: ${u};
        }

        contact-form #donation-contact-form-postal-code {
          width: ${s};
        }

        contact-form #donation-contact-form-error-message {
          color: red;
          font-size: 1.4rem;
          margin-bottom: 0.6rem;
        }

        contact-form #donation-contact-form-last-name {
          width: ${s};
        }

        /* only show for screen readers */
        contact-form label {
          position: absolute;
          left: -10000px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }

        contact-form .donation-contact-form-input {
          width: ${u};
          border: 0;
          outline: 0;
          background: transparent;
          font-weight: bold;
          color: ${r};
          font-size: ${a};
          padding: 0;
          font-family: ${n};
        }

        contact-form .donation-contact-form-input::placeholder {
          color: revert;
        }

        contact-form #donation-contact-form-countryCodeAlpha2 {
          width: calc(100%);
          height: 100%;
          box-sizing: border-box;
          font-weight: bold;
          font-size: ${a};
          font-family: ${n};
          border: 0;
          background: #fff;
        }
      </style>
    `}};d([b("badged-input.donation-contact-form-email")],M.prototype,"emailBadgedInput",void 0);d([b("#donation-contact-form-email")],M.prototype,"emailField",void 0);d([b("badged-input.donation-contact-form-first-name")],M.prototype,"firstNameBadgedInput",void 0);d([b("#donation-contact-form-first-name")],M.prototype,"firstNameField",void 0);d([b("badged-input.donation-contact-form-last-name")],M.prototype,"lastNameBadgedInput",void 0);d([b("#donation-contact-form-last-name")],M.prototype,"lastNameField",void 0);d([b("badged-input.donation-contact-form-postal-code")],M.prototype,"postalBadgedInput",void 0);d([b("#donation-contact-form-postal-code")],M.prototype,"postalCodeField",void 0);d([b("badged-input.donation-contact-form-street-address")],M.prototype,"streetAddressBadgedInput",void 0);d([b("#donation-contact-form-street-address")],M.prototype,"streetAddressField",void 0);d([b("badged-input.donation-contact-form-extended-address")],M.prototype,"extendedAddressBadgedInput",void 0);d([b("#donation-contact-form-extended-address")],M.prototype,"extendedAddressField",void 0);d([b("badged-input.donation-contact-form-locality")],M.prototype,"localityBadgedInput",void 0);d([b("#donation-contact-form-locality")],M.prototype,"localityField",void 0);d([b("badged-input.donation-contact-form-region")],M.prototype,"regionBadgedInput",void 0);d([b("#donation-contact-form-region")],M.prototype,"regionField",void 0);d([b("#donation-contact-form-countryCodeAlpha2")],M.prototype,"countryCodeAlpha2Field",void 0);d([b("#donation-contact-form-error-message")],M.prototype,"errorMessage",void 0);d([b("form")],M.prototype,"form",void 0);d([v({type:String})],M.prototype,"selectedCountry",void 0);d([v({type:String})],M.prototype,"donorEmail",void 0);M=d([D("contact-form")],M);const Rn=g`
<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" aria-labelledby="creditCardTitleID creditCardDescID">
  <title id="creditCardTitleID">Credit card icon</title>
  <desc id="creditCardDescID">An illustration of a credit card</desc>
  <g class="fill-color" fill-rule="evenodd" transform="translate(0 2)">
    <g fill-rule="nonzero">
      <path d="m11.998 0v9h-11.998v-9z" />
      <g fill="#fff">
        <path d="m11.143 3.429h-10.286v4.714h10.286z" />
        <path d="m11.143.857h-10.286v1.286h10.286z" />
      </g>
    </g>
    <g>
      <path d="m8.143 6.429h1v1h-1z" />
      <path d="m9.429 6.429h1v1h-1z" />
    </g>
  </g>
</svg>
`,On=g`
<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" aria-labelledby="calendarTitleID calendarDescID">
  <title id="calendarTitleID">Calendar icon</title>
  <desc id="calendarDescID">An illustration of a calendar</desc>

  <g class="fill-color" fill-rule="evenodd">
    <path d="m11.998.857v11h-11.998v-11z" fill-rule="nonzero" />
    <path d="m11.143 3h-10.286v8h10.286z" fill="#fff" fill-rule="nonzero" />
    <path d="m9 0h1v1h-1z" />
    <path d="m2.143 0h1v1h-1z" />
    <path d="m2.143.857h1v1h-1z" fill="#fff" />
    <path d="m9 .857h1v1h-1z" fill="#fff" />
    <path
      d="m4.92342857 9.14285714v-4.2h-.678c-.02400012.1600008-.07399962.29399946-.15.402s-.16899945.19499967-.279.261-.23399931.11199987-.372.138-.28099926.03700002-.429.033v.642h1.056v2.724zm3.336 0h-.852v-2.724h-1.056v-.642c.14800074.00400002.29099931-.00699987.429-.033s.26199945-.07199967.372-.138.20299962-.15299946.279-.261.12599988-.2419992.15-.402h.678z"
      fill-rule="nonzero"
    />
  </g>
</svg>
`,ro=g`
<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" aria-labelledby="lockTitleID lockDescID">
  <title id="lockTitleID">Lock icon</title>
  <desc id="lockDescID">An illustration of a lock</desc>
  <path
    d="m9.8480234 5.66075891v-2.17912633c-.00688261-.97492716-.37725298-1.79574705-1.11111111-2.46245966s-1.63734389-1.00632179-2.71045726-1.01882754c-1.04529617-.01250574-1.94175593.31459769-2.68937928.9813103-.74762335.66671262-1.13190232 1.4842758-1.15283692 2.45268954v2.22641369c-.04846504.00625288-.10037138.01250575-.15571902.01875862-.05534764.00625288-.09348877.00937931-.11442337.00937931-.35302046.00625288-.59362498.06917241-.72181356.18875862-.12818859.1195862-.19228288.33022987-.19228288.631931v4.73576994c0 .5030957.269999.7546436.80999699.7546436h8.36968211c.2839076 0 .491533-.0597931.6228761-.1793793s.197158-.3082145.1974448-.565885v-4.82057452c0-.25793103-.0640943-.44499615-.1922829-.56119538s-.3340933-.17755555-.6177141-.18406896c-.0415824 0-.102092-.00468965-.1815288-.01406896-.07943676-.00937931-.13306375-.01406897-.16088096-.01406897zm-1.85873446.00937931h-3.92523766c-.01376522-.12583907-.02064783-.21077393-.02064783-.25480458l-.01032391-.97154019c0-.65420686.0034413-.9813103.01032391-.9813103.00688261-.49684289.1919961-.91513405.55534047-1.2548735.36334438-.33973945.81845687-.51273561 1.36533747-.51898848.52623277-.01875862.98492995.13691187 1.37609154.46701147.39116158.3300996.60050759.74044441.62803802 1.23103443.01376522.2076475.02064783.83032946.02064783 1.86804589v.41503446z"
    class="fill-color"
  />
</svg>
`;var fe;(function(i){i.HideBadge="hidebadge",i.ShowBadge="showbadge",i.HideBadgeLeaveSpacing="hidebadgeleavespacing"})(fe||(fe={}));let _e=class extends I{constructor(){super(...arguments),this.sectionBadge="0",this.badgeMode=fe.ShowBadge}render(){return g`
      <div class="container ${this.badgeMode}">
        <div class="badge-container">
          <div class="badge">${this.sectionBadge}</div>
        </div>
        <div class="content-container">
          ${this.headline?g` <div class="title">${this.headline}</div> `:""}
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `}static get styles(){const e=h`var(--formSectionBadgeTransition, 0.25s ease-out)`,t=h`var(--formSectionBadgeMargin, 1rem)`,o=h`var(--formSectionBadgeBackgroundColor, #333)`,n=h`var(--formSectionBadgeRadius, 1.2rem)`,a=h`calc(${n} * 2)`,r=h`var(--formSectionBadgeFontSize, 1.8rem)`,u=h`var(--formSectionBadgeFontWeight, bold)`,s=h`var(--formSectionBadgeFontColor, #fff)`,l=h`var(--formSectionTitleFontSize, 1.8rem)`,c=h`var(--formSectionTitleFontWeight, bold)`,m=h`var(--formSectionContentBackgroundColor, transparent)`,y=h`var(--formSectionTextColor, #333)`,f=h`calc(${n} * 2)`;return h`
      :host {
        display: block;
        background-color: ${m};
        color: ${y};
      }
      .container {
        position: relative;
        padding: 0.5rem;
      }

      .content-container {
        position: relative;
        left: calc(${a} + ${t});
        width: calc(100% - (${a} + ${t}));
        transition: ${e};
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
        width: ${a};
      }

      .badge {
        background-color: ${o};
        color: ${s};
        width: ${a};
        height: ${a};
        border-radius: ${n};
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: ${u};
        font-size: ${r};
      }

      .title {
        line-height: ${f};
        margin-bottom: 0.5rem;
        font-size: ${l};
        font-weight: ${c};
      }
    `}};d([v({type:String})],_e.prototype,"sectionBadge",void 0);d([v({type:String})],_e.prototype,"headline",void 0);d([v({type:String})],_e.prototype,"badgeMode",void 0);_e=d([D("donation-form-section")],_e);var $e;(function(i){i.HideNumbers="hidenumbers",i.ShowNumbers="shownumbers"})($e||($e={}));var O;(function(i){i.DonationType="donationType",i.Amount="amount"})(O||(O={}));var L;(function(i){i.ValidDonationAmount="valid_donation_amount",i.InvalidDonationAmount="invalid_donation_amount",i.DonationTooHigh="donation_too_high",i.DonationTooLow="donation_too_low"})(L||(L={}));var H;(function(i){i.Button="button",i.Checkbox="checkbox",i.Hide="hide"})(H||(H={}));var K;(function(i){i.SingleLine="single-line",i.MultiLine="multi-line"})(K||(K={}));let x=class extends I{constructor(){super(...arguments),this.donationInfo=no,this.stepNumberMode=$e.ShowNumbers,this.amountOptions=je,this.amountSelectionLayout=K.MultiLine,this.frequencySelectionMode=H.Button,this.customAmountMode="display",this.coverFeesCheckboxMode="display",this.amountTitleDisplayMode="default",this.customAmountSelected=!1,this.currencyValidator=new io}render(){const t=this.amountTitleDisplayMode==="default"?"Choose an amount (USD)":"";return g`
      ${this.frequencySelectionMode===H.Button?this.frequencyButtonsTemplate:$}

      <donation-form-section
        sectionBadge="${this.amountSelectionSectionNumber}"
        headline=${t}
        badgeMode=${this.formSectionNumberMode}
      >
        ${this.amountTitleDisplayMode==="slot"?g`<slot name="edit-donation-amount-title"></slot>`:$}
        <ul class="amount-selector">
          ${this.presetAmountsTemplate}
          ${this.customAmountMode==="display"?g`<li class="custom-amount">${this.customAmountTemplate}</li>`:$}
        </ul>

        <div class="errors">${this.error}</div>

        ${this.coverFeesCheckboxMode==="display"?g` <div class="checkbox-options">
              ${this.coverFeesCheckboxTemplate}
              ${this.frequencySelectionMode===H.Checkbox?this.frequencyCheckboxTemplate:$}
            </div>`:$}
      </donation-form-section>
    `}updated(e){e.has("customAmountSelected")&&this.customAmountButton&&(this.customAmountButton.checked=this.customAmountSelected),e.has("amountOptions")&&(this.customAmountSelected=!1,this.updateSelectedDonationInfo(),this.setupAmountColumnsLayoutConfig()),e.has("amountSelectionLayout")&&this.setupAmountColumnsLayoutConfig(),e.has("donationInfo")&&this.updateSelectedDonationInfo(),e.has("defaultSelectedAmount")&&this.defaultSelectedAmount!==void 0&&(this.customAmountSelected=!1,this.donationInfo=new N({donationType:this.donationInfo.donationType,amount:this.defaultSelectedAmount,coverFees:this.donationInfo.coverFees}))}get frequencyButtonsTemplate(){return g`
      <donation-form-section
        sectionBadge="1"
        headline="Choose a frequency"
        badgeMode=${this.formSectionNumberMode}
      >
        <ul class="frequency-selector">
          ${this.frequencyTemplate}
        </ul>
      </donation-form-section>
    `}get frequencyCheckboxTemplate(){return g`
      <div class="checkbox-option-container">
        <input
          type="checkbox"
          id="make-this-monthly"
          @input=${this.monthlyCheckboxChecked}
          .checked=${this.donationInfo.donationType===w.Monthly}
          tabindex="0"
        />
        <label for="make-this-monthly"> Make this monthly </label>
      </div>
    `}get coverFeesCheckboxTemplate(){return g`
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
    `}get amountSelectionSectionNumber(){return this.frequencySelectionMode===H.Button?2:1}get formSectionNumberMode(){switch(this.stepNumberMode){case $e.ShowNumbers:return fe.ShowBadge;case $e.HideNumbers:return fe.HideBadge}}setupAmountColumnsLayoutConfig(){const e=this.customAmountMode==="hide"&&this.coverFeesCheckboxMode==="hide"&&this.frequencySelectionMode===H.Hide,t=this.amountOptions.length;let o=5,n=3;switch(t){case 7:o=5,n=3;break;case 6:o=4,n=2;break;case 5:o=4,n=3;break;case 4:if(e){o=4,n=0;break}o=3,n=2;break;case 3:o=2,n=1;break}this.amountSelectionLayout===K.SingleLine&&(o=t+3,n=3),this.style.setProperty("--paymentSelectorAmountColumnCount",`${o}`),this.style.setProperty("--paymentSelectorCustomAmountColSpan",`${n}`)}updateSelectedDonationInfo(){var e,t;if(!this.customAmountSelected&&!this.isCustomAmount){const o=(e=this.shadowRoot)===null||e===void 0?void 0:e.querySelector(`input[type="radio"][name="${O.Amount}"][value="${this.donationInfo.amount}"]`);o.checked=!0,this.customAmountSelected=!1,this.customAmountInput&&(this.customAmountInput.value="")}else if(this.customAmountSelected=!0,((t=this.shadowRoot)===null||t===void 0?void 0:t.activeElement)!==this.customAmountInput){this.customAmountInput.value=this.customAmountDisplayValue;const o=this.getDonationInfoStatus(this.donationInfo.amount);this.handleDonationInfoStatus(o)}}get coverFeesTextTemplate(){const e=k(this.donationInfo.fee,{symbol:"$"}).format();return g` I'll generously add ${e} to cover fees. `}formatShortenedAmount(e){const t=e%1===0?0:2;return k(e,{symbol:"$",precision:t}).format()}get frequencyTemplate(){return g`
      <li>
        ${this.getRadioButton({group:O.DonationType,value:w.OneTime,displayText:"One time",checked:this.donationInfo.donationType===w.OneTime})}
      </li>

      <li>
        ${this.getRadioButton({group:O.DonationType,value:w.Monthly,displayText:"Monthly",checked:this.donationInfo.donationType===w.Monthly})}
      </li>
    `}get presetAmountsTemplate(){return g`
      ${this.amountOptions.map(e=>{const t=!this.customAmountSelected&&e===this.donationInfo.amount,o=this.formatShortenedAmount(e);return g`
          <li>
            ${this.getRadioButton({group:O.Amount,value:`${e}`,displayText:`${o}`,checked:t})}
          </li>
        `})}
    `}getRadioButton(e){const t=`${e.group}-${e.value}-option`;return g`
      <div class="selection-button">
        <input
          type="radio"
          name=${e.group}
          value=${e.value}
          id=${t}
          tabindex="0"
          .checked=${e.checked}
          @change=${this.radioSelected}
          @click=${o=>{e.group===O.Amount&&parseFloat(e.value)===this.donationInfo.amount&&this.radioSelected(o)}}
        />
        <label for=${t}> ${e.displayText} </label>
      </div>
    `}get isCustomAmount(){return!this.amountOptions.includes(this.donationInfo.amount)}get customAmountDisplayValue(){return this.isCustomAmount?k(this.donationInfo.amount,{symbol:""}).format():""}get customAmountTemplate(){return g`
      <div class="selection-button">
        <input
          type="radio"
          name=${O.Amount}
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
            @blur=${e=>{const t=e.target;t.value=this.customAmountDisplayValue}}
          />
        </label>
      </div>
    `}customRadioSelected(){this.customAmountInput.focus()}customAmountFocused(e){const t=e.target;this.customAmountSelected=!0,this.handleCustomAmountInput(t.value)}coverFeesChecked(e){const o=e.target.checked;this.updateDonationInfo({coverFees:o})}customAmountChanged(e){const o=e.target.value;this.customAmountSelected=!0,this.handleCustomAmountInput(o)}handleCustomAmountInput(e){const t=parseFloat(e);isNaN(t)?this.dispatchEditDonationError(L.InvalidDonationAmount):this.amountChanged(t)}handleDonationInfoStatus(e){switch(e){case L.ValidDonationAmount:this.error=void 0;break;case L.DonationTooHigh:this.error=g`
          To make a donation of $10,000 or more, please contact our philanthropy
          department at
          <a href="mailto:donations@archive.org">donations@archive.org</a>
        `,this.dispatchEditDonationError(e);break;case L.DonationTooLow:this.customAmountInput.value.length>0&&(this.error=g` Please select an amount (minimum $1) `),this.dispatchEditDonationError(e);break;case L.InvalidDonationAmount:this.error=g` Please enter a valid donation amount `,this.dispatchEditDonationError(e);break}}amountChanged(e){const t=this.getDonationInfoStatus(e);this.handleDonationInfoStatus(t),t===L.ValidDonationAmount&&this.updateDonationInfo({amount:e})}getDonationInfoStatus(e){return isNaN(e)?L.InvalidDonationAmount:e>=1e4?L.DonationTooHigh:e<1?L.DonationTooLow:L.ValidDonationAmount}radioSelected(e){const t=e.target,o=t.name,{value:n}=t;switch(o){case O.Amount:this.presetAmountChanged(parseFloat(n));break;case O.DonationType:this.updateDonationInfo({donationType:n});break}}monthlyCheckboxChecked(e){const o=e.target.checked?w.Monthly:w.OneTime;this.updateDonationInfo({donationType:o})}dispatchEditDonationError(e){const t=new CustomEvent("editDonationError",{detail:{error:e}});this.dispatchEvent(t)}presetAmountChanged(e){this.error=void 0,this.customAmountSelected=!1,this.customAmountInput&&(this.customAmountInput.value=""),this.updateDonationInfo({amount:e})}updateDonationInfo(e){var t,o,n;const a=new N({donationType:(t=e.donationType)!==null&&t!==void 0?t:this.donationInfo.donationType,amount:(o=e.amount)!==null&&o!==void 0?o:this.donationInfo.amount,coverFees:(n=e.coverFees)!==null&&n!==void 0?n:this.donationInfo.coverFees});this.donationInfo=a;const r=new CustomEvent("donationInfoChanged",{detail:{donationInfo:a}});this.dispatchEvent(r)}static get styles(){const e=h`var(--paymentButtonBorderColor, #333)`,t=h`var(--paymentButtonGridGap, 1rem)`,o=h`var(--paymentButtonFontSize, 1.6rem)`,n=h`var(--paymentButtonFontColor, #000)`,a=h`var(--paymentButtonSelectedFontColor, #000)`,r=h`var(--paymentButtonSelectedColor, #f9bf3b)`,u=h`var(--paymentButtonFocusedOutlineColor, #7fb3f9)`,s=h`var(--paymentButtonColor, #fff)`,l=h`var(--coverFeesFontSize, 1.2rem)`,c=h`var(--coverFeesFontWeight, bold)`,m=h`var(--customAmountWidth, 4rem)`,y=h`var(--inputFieldFontColor, #333)`,f=h`var(--inputBorder, 1px solid #d9d9d9)`,_=h`var(--paymentSelectorAmountColumnCount, 5)`,S=h`var(--paymentSelectorCustomAmountColSpan, 3)`;return h`
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
        grid-gap: ${t};
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
        grid-template-columns: repeat(${_}, 1fr);
      }

      .custom-amount {
        grid-column: span ${S};
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
        border: 1px solid ${e};
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
        background-color: ${s};
      }

      input[type='radio']:checked + label {
        color: ${a};
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
        font-weight: ${c};
        flex: 1;
      }

      #custom-amount-input {
        width: ${m};
        font-size: 1.6rem;
        font-weight: bold;
        color: ${y};
        padding: 0.1rem;
        border: ${f};
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
      }
    `}};d([v({type:Object})],x.prototype,"donationInfo",void 0);d([v({type:String})],x.prototype,"stepNumberMode",void 0);d([v({type:Number})],x.prototype,"defaultSelectedAmount",void 0);d([v({type:Array})],x.prototype,"amountOptions",void 0);d([v({type:String})],x.prototype,"amountSelectionLayout",void 0);d([v({type:String,reflect:!0})],x.prototype,"frequencySelectionMode",void 0);d([v({type:String,reflect:!0})],x.prototype,"customAmountMode",void 0);d([v({type:String,reflect:!0})],x.prototype,"coverFeesCheckboxMode",void 0);d([v({type:String,reflect:!0})],x.prototype,"amountTitleDisplayMode",void 0);d([eo()],x.prototype,"error",void 0);d([eo()],x.prototype,"customAmountSelected",void 0);d([b("#custom-amount-button")],x.prototype,"customAmountButton",void 0);d([b("#custom-amount-input")],x.prototype,"customAmountInput",void 0);x=d([D("donation-form-edit-donation")],x);let C=class extends I{constructor(){super(...arguments),this.analyticsCategory="DonationForm",this.amountOptions=je,this.donationInfo=no,this.amountSelectionLayout=K.MultiLine,this.frequencySelectionMode=H.Button,this.donorEmail="",this.lazyLoaderService=new zo,this.recaptchaManagerSetup=!1}updated(e){var t,o,n;e.has("referrer")&&this.referrer&&((t=this.braintreeManager)===null||t===void 0||t.setReferrer(this.referrer),this.logDonationFlowEvent("referrer",this.referrer)),e.has("loggedInUser")&&this.loggedInUser&&((o=this.braintreeManager)===null||o===void 0||o.setLoggedInUser(this.loggedInUser)),e.has("origin")&&this.origin&&((n=this.braintreeManager)===null||n===void 0||n.setOrigin(this.origin),this.logDonationFlowEvent("origin",this.origin)),(e.has("paymentClients")||e.has("braintreeAuthToken")||e.has("endpointManager")||e.has("environment"))&&(this.setupBraintreeManager(),this.setupRecaptchaManager()),e.has("recaptchaSiteKey")&&this.setupRecaptchaManager(),(e.has("braintreeManager")||e.has("recaptchaManager")||e.has("modalManager")||e.has("recaptchaElement"))&&this.setupPaymentFlowHandlers(),(e.has("environment")||e.has("lazyLoaderService"))&&this.environment&&(this.paymentClients=new Vo(this.lazyLoaderService,this.environment))}showConfirmationStepDev(e){return p(this,void 0,void 0,function*(){this.donationForm.showConfirmationModalDev(e)})}showUpsellModalDev(e){return p(this,void 0,void 0,function*(){this.donationForm.showUpsellModalDev(e)})}setupBraintreeManager(){this.braintreeManager===void 0&&this.braintreeAuthToken&&this.endpointManager&&this.paymentClients&&this.environment&&(this.braintreeManager=new rn({paymentClients:this.paymentClients,endpointManager:this.endpointManager,authorizationToken:this.braintreeAuthToken,venmoProfileId:this.venmoProfileId,googlePayMerchantId:this.googlePayMerchantId,hostedFieldConfig:this.hostedFieldConfig,hostingEnvironment:this.environment,referrer:this.referrer,loggedInUser:this.loggedInUser,origin:this.origin}),this.braintreeManager.on("paymentProvidersHostedFieldsRetry",e=>{const t=new CustomEvent("paymentProvidersHostedFieldsRetry",{detail:{retryNumber:e}});this.dispatchEvent(t)}),this.braintreeManager.on("paymentProvidersHostedFieldsFailed",e=>{const t=new CustomEvent("paymentProvidersHostedFieldsFailed",{detail:{error:e}});this.dispatchEvent(t)}))}setupRecaptchaManager(){return p(this,void 0,void 0,function*(){if(!this.recaptchaSiteKey||!this.paymentClients||this.recaptchaManagerSetup)return;this.recaptchaManagerSetup=!0;const e=yield this.paymentClients.recaptchaLibrary.get();this.recaptchaManager=new En({grecaptchaLibrary:e,siteKey:this.recaptchaSiteKey})})}firstUpdated(){this.configureFromQueryParams(),this.trackViewedEvent()}configureFromQueryParams(){const e=new URLSearchParams(window.location.search);let t=this.amountOptions;const o=e.get("dollarAmounts");o&&(t=o.slice(1,-1).split(",").map(B=>parseFloat(B)).filter(B=>!isNaN(B)));let n=this.donationInfo.coverFees;const a=e.get("coverFees");a&&(n=a==="true");let r=this.donationInfo.donationType;e.get("contrib_type")==="monthly"&&(r=w.Monthly);let s=this.donationInfo.amount;const l=e.get("amt");if(l){const f=k(l).value;f>0&&(s=f)}const c=e.get("amountLayout");if(c){const f=c;Object.values(K).includes(f)&&(this.amountSelectionLayout=f)}const m=e.get("frequencyMode");if(m){const f=m;Object.values(H).includes(f)&&(this.frequencySelectionMode=f)}const y=new N({donationType:r,amount:s,coverFees:n});this.amountOptions=t,this.donationInfo=y}setupPaymentFlowHandlers(){var e;this.paymentFlowHandlers||!this.braintreeManager||!this.recaptchaManager||!this.modalManager||!this.recaptchaElement||(this.paymentFlowHandlers=new Fn({braintreeManager:this.braintreeManager,modalManager:this.modalManager,recaptchaManager:this.recaptchaManager,resources:{analytics:{logEvent:this.logEvent.bind(this),logDonationFlowEvent:this.logDonationFlowEvent.bind(this)}}}),this.donationForm.braintreeManager=this.braintreeManager,this.donationForm.paymentFlowHandlers=this.paymentFlowHandlers,this.braintreeManager.startup(),(e=this.paymentFlowHandlers)===null||e===void 0||e.startup(),this.recaptchaManager.setup(this.recaptchaElement,1,"light","image"))}get hostedFieldConfig(){const e={input:{"font-size":"16px","font-family":'"Helvetica Neue", Helvetica, Arial, sans-serif',"font-weight":"700",color:"#333"},":focus":{color:"#333"},".valid":{},".invalid":{color:"#b00b00"}},t={number:{selector:"#braintree-creditcard",placeholder:"Card number"},cvv:{selector:"#braintree-cvv",placeholder:"CVC"},expirationDate:{selector:"#braintree-expiration",placeholder:"MM / YY"}},o=new sn({number:this.braintreeNumberInput,cvv:this.braintreeCVVInput,expirationDate:this.braintreeExpirationDateInput,errorContainer:this.braintreeErrorMessage});return new _n({hostedFieldStyle:e,hostedFieldFieldOptions:t,hostedFieldContainer:o})}render(){return g`
      <div class="donation-form-controller-container">
        <donation-form
          .environment=${this.environment}
          .braintreeManager=${this.braintreeManager}
          .contactForm=${this.contactForm}
          .amountOptions=${this.amountOptions}
          .donationInfo=${this.donationInfo}
          .amountSelectionLayout=${this.amountSelectionLayout}
          .frequencySelectionMode=${this.frequencySelectionMode}
          @donationInfoChanged=${this.donationInfoChanged}
          @paymentProviderSelected=${this.paymentProviderSelected}
          @paymentFlowStarted=${this.paymentFlowStarted}
          @paymentFlowConfirmed=${this.paymentFlowConfirmed}
          @paymentFlowCancelled=${this.paymentFlowCancelled}
          @paymentFlowError=${this.paymentFlowError}
        >
          <!--
            Why are these slots here?

            Due to the way Braintree, PayPal, and Recaptcha work, they cannot exist
            in the shadowDOM so must exist in the clearDOM and get passed
            in through a <slot>.

            Braintree / PayPal are working on a solution to this. See:
            - https://github.com/braintree/braintree-web-drop-in/issues/614#issuecomment-616796104
            - https://github.com/braintree/braintree-web-drop-in/issues/296#issuecomment-616749307
            - https://github.com/paypal/paypal-checkout-components/issues/353#issuecomment-595956216
          -->
          <div slot="braintree-hosted-fields">
            <div id="braintree-error-message"></div>
            <div class="braintree-row">
              <badged-input .icon=${Rn} ?required=${!0} class="creditcard">
                <div class="braintree-input" id="braintree-creditcard"></div>
              </badged-input>
            </div>
            <div class="braintree-row">
              <badged-input .icon=${On} ?required=${!0} class="expiration">
                <div class="braintree-input" id="braintree-expiration"></div>
              </badged-input>
              <badged-input .icon=${ro} ?required=${!0} class="cvv">
                <div class="braintree-input" id="braintree-cvv"></div>
              </badged-input>
            </div>
          </div>

          <!--
            Form autocompletion does not work in the shadowDOM so
            we slot the contact form in from the lightDOM and pass
            in a reference to it in the <donation-form> tag above
          -->
          <div slot="contact-form">
            <contact-form .donorEmail=${this.donorEmail}></contact-form>
          </div>

          <div slot="paypal-button">
            <div id="paypal-button"></div>
          </div>

          <slot name="recaptcha" slot="recaptcha"> </slot>
        </donation-form>
      </div>

      ${this.getStyles}
    `}createRenderRoot(){return this}donationInfoChanged(e){this.logEvent("DonationInfoChanged"),this.donationInfo=e.detail.donationInfo}trackViewedEvent(){this.logEvent("Viewed")}paymentProviderSelected(e){const t=e.detail.paymentProvider,o=e.detail.previousPaymentProvider,n=this.removeSpaces(t??"unset");let a=`ProviderFirstSelected-${n}`,r;o!==void 0&&(a=`ProviderChangedTo-${n}`,r=`ProviderChangedFrom-${this.removeSpaces(o)}`),this.logEvent(a,r)}paymentFlowConfirmed(e){const t=e.detail.paymentProvider,o=this.removeSpaces(t);this.logEvent("PaymentFlowConfirmed",o)}paymentFlowStarted(e){const t=e.detail.paymentProvider,o=this.removeSpaces(t);this.logEvent("PaymentFlowStarted",o)}paymentFlowCancelled(e){const t=e.detail.paymentProvider,o=this.removeSpaces(t);this.logEvent("PaymentFlowCancelled",o)}paymentFlowError(e){const t=e.detail.paymentProvider,o=this.removeSpaces(t),n=e.detail.error,a=`${o}-${n}`;this.logEvent("PaymentFlowError",a)}removeSpaces(e){return e.replace(/\s+/g,"")}logEvent(e,t){var o;const n={action:e,label:t,category:this.analyticsCategory};(o=this.analyticsHandler)===null||o===void 0||o.sendEvent(n)}logDonationFlowEvent(e,t){var o;const n={action:e,label:t,category:"DonationFlow"};(o=this.analyticsHandler)===null||o===void 0||o.sendEventNoSampling(n)}get getStyles(){return g`
      <style>
        .donation-form-controller-container {
          color: var(--donateFormTextColor, #333);
          background-color: var(--donateFormBgColor, transparent);

          --formSectionContentBackgroundColor: var(--donateFormBgColor, transparent);

          --editFormBadgeBgColor: var(--donateFormBadgeBgColor, #333);
          --formSectionBadgeBackgroundColor: var(--donateFormBadgeBgColor, #333);

          --editFormBadgeFontColor: var(--donateFormBadgeTextColor, #fff);
          --formSectionBadgeFontColor: var(--donateFormBadgeTextColor, #fff);

          --paymentButtonFontColor: var(--donateFormPaymentOptionTextColor);
          --paymentButtonColor: var(--donateFormPaymentOptionBgColor);

          --paymentButtonSelectedColor: var(--donateFormSelectedOptionBgColor);
          --paymentButtonSelectedFontColor: var(--donateFormSelectedOptionTextColor);
        }
        .donation-form-controller-container donation-form:focus {
          outline: none;
        }

        .donation-form-controller-container #paypal-button {
          opacity: 0.001;
          width: 5rem;
          height: 3rem;
          overflow: hidden;
        }

        .donation-form-controller-container .braintree-row {
          display: flex;
          margin-top: -1px;
        }

        .donation-form-controller-container badged-input {
          width: 100%;
        }

        .donation-form-controller-container badged-input.cvv {
          margin-left: -1px;
        }

        .donation-form-controller-container .braintree-input {
          width: 100%;
          height: 100%;
        }

        .donation-form-controller-container #braintree-error-message {
          color: red;
          font-size: 1.4rem;
          margin-bottom: 0.6rem;
        }

        .donation-form-controller-container div[slot='braintree-hosted-fields'] {
          background-color: white;
        }
      </style>
    `}};d([v({type:String})],C.prototype,"environment",void 0);d([v({type:String})],C.prototype,"braintreeAuthToken",void 0);d([v({type:String})],C.prototype,"recaptchaSiteKey",void 0);d([v({type:String})],C.prototype,"venmoProfileId",void 0);d([v({type:String})],C.prototype,"googlePayMerchantId",void 0);d([v({type:String})],C.prototype,"analyticsCategory",void 0);d([v({type:Array})],C.prototype,"amountOptions",void 0);d([v({type:Object})],C.prototype,"donationInfo",void 0);d([v({type:String})],C.prototype,"amountSelectionLayout",void 0);d([v({type:String})],C.prototype,"frequencySelectionMode",void 0);d([v({type:String})],C.prototype,"referrer",void 0);d([v({type:String})],C.prototype,"loggedInUser",void 0);d([v({type:String})],C.prototype,"origin",void 0);d([v({type:String})],C.prototype,"donorEmail",void 0);d([v({type:Object})],C.prototype,"endpointManager",void 0);d([v({type:Object})],C.prototype,"analyticsHandler",void 0);d([v({type:Object})],C.prototype,"modalManager",void 0);d([v({type:Object})],C.prototype,"recaptchaElement",void 0);d([v({type:Object})],C.prototype,"braintreeManager",void 0);d([v({type:Object})],C.prototype,"recaptchaManager",void 0);d([v({type:Object})],C.prototype,"paymentFlowHandlers",void 0);d([v({type:Object})],C.prototype,"paymentClients",void 0);d([v({type:Object})],C.prototype,"lazyLoaderService",void 0);d([b("donation-form")],C.prototype,"donationForm",void 0);d([b("#braintree-creditcard")],C.prototype,"braintreeNumberInput",void 0);d([b("#braintree-cvv")],C.prototype,"braintreeCVVInput",void 0);d([b("#braintree-expiration")],C.prototype,"braintreeExpirationDateInput",void 0);d([b("#braintree-error-message")],C.prototype,"braintreeErrorMessage",void 0);d([b("contact-form")],C.prototype,"contactForm",void 0);C=d([D("donation-form-controller")],C);const zn=g`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 468 300" aria-labelledby="applePayTitleID applePayDescID">
  <title id="donateTitleID">ApplePay icon</title>
  <desc id="donateDescID">An illustration of the Apple Pay logo</desc>
  <g fill="none">
    <path
      fill="#000"
      d="M425.540484,0 L41.8576242,0 C40.2596386,0 38.6588291,0 37.0636954,0.0093185241 C35.715305,0.0189194277 34.3700489,0.0338855422 33.0247929,0.0705948795 C30.0908697,0.149943524 27.1318148,0.323042169 24.2346009,0.84375 C21.2910768,1.37349398 18.5519955,2.2375753 15.8798381,3.59807982 C13.2528614,4.93401732 10.8478351,6.68138178 8.76362011,8.76647214 C6.67850151,10.8515625 4.93113705,13.2526355 3.59548193,15.882436 C2.23469503,18.5545934 1.37004895,21.2945218 0.843975904,24.240305 C0.320472515,27.138366 0.146216114,30.0968562 0.0671498494,33.0276732 C0.0310052711,34.3729292 0.0155026355,35.7181852 0.00672063253,37.0631589 C1.12951807e-05,38.6617093 1.12951807e-05,40.2591303 1.12951807e-05,41.8605045 L1.12951807e-05,257.36634 C1.12951807e-05,258.967715 1.12951807e-05,260.56234 0.00672063253,262.163997 C0.0155026355,263.50897 0.0310052711,264.854226 0.0671498494,266.199482 C0.146216114,269.12773 0.320472515,272.08622 0.843975904,274.983434 C1.37004895,277.930346 2.23469503,280.669145 3.59548193,283.341585 C4.93113705,285.971386 6.67850151,288.375565 8.76362011,290.457549 C10.8478351,292.546028 13.2528614,294.29311 15.8798381,295.625659 C18.5519955,296.989834 21.2910768,297.854198 24.2346009,298.38366 C27.1318148,298.900979 30.0908697,299.077184 33.0247929,299.156532 C34.3700489,299.187029 35.715305,299.205102 37.0636954,299.211314 C38.6588291,299.223739 40.2596386,299.223739 41.8576242,299.223739 L425.540484,299.223739 C427.135646,299.223739 428.736483,299.223739 430.331306,299.211314 C431.676591,299.205102 433.021875,299.187029 434.373287,299.156532 C437.300998,299.077184 440.259488,298.900979 443.16379,298.38366 C446.10336,297.854198 448.843006,296.989834 451.515446,295.625659 C454.145247,294.29311 456.543213,292.546028 458.631721,290.457549 C460.713422,288.375565 462.460759,285.971386 463.799831,283.341585 C465.163695,280.669145 466.027494,277.930346 466.551026,274.983434 C467.07484,272.08622 467.244832,269.12773 467.324181,266.199482 C467.36089,264.854226 467.378991,263.50897 467.385203,262.163997 C467.3976,260.56234 467.3976,258.967743 467.3976,257.36634 L467.3976,41.8605045 C467.3976,40.2591303 467.3976,38.6617093 467.385203,37.0631589 C467.378991,35.7181852 467.36089,34.3729292 467.324181,33.0276732 C467.244804,30.0968562 467.07484,27.138366 466.551026,24.240305 C466.027523,21.2945218 465.163695,18.5545934 463.799831,15.882436 C462.460759,13.2526355 460.713422,10.8515625 458.631721,8.76647214 C456.543213,6.68138178 454.145247,4.93401732 451.515446,3.59807982 C448.843006,2.2375753 446.10336,1.37349398 443.16379,0.84375 C440.259516,0.323042169 437.301026,0.149943524 434.373287,0.0705948795 C433.021875,0.0338855422 431.676591,0.0189194277 430.331306,0.0093185241 C428.736483,0 427.135646,0 425.540484,0 L425.540484,0 Z"
    />
    <path
      fill="#FFF"
      d="M425.540484,9.97364458 L430.260429,9.98268072 C431.539044,9.99171687 432.817686,10.0055535 434.103389,10.0405685 C436.339863,10.1009977 438.956052,10.2221386 441.394682,10.659262 C443.514505,11.0410392 445.292338,11.6216114 446.998503,12.4902108 C448.682897,13.3461032 450.22613,14.4677146 451.573588,15.813253 C452.926186,17.1678276 454.049238,18.713573 454.916425,20.4166039 C455.780196,22.1094691 456.357097,23.8788592 456.736615,26.0142131 C457.172609,28.4262989 457.293185,31.0496047 457.35449,33.299887 C457.388912,34.5700301 457.405855,35.8401732 457.412095,37.1405309 C457.423956,38.7131024 457.423956,40.2848268 457.423956,41.8605045 L457.423956,257.36634 C457.423956,258.942018 457.423956,260.510919 457.411813,262.117093 C457.405855,263.386954 457.38894,264.657097 457.354207,265.929499 C457.293185,268.176393 457.172637,270.798287 456.731278,273.238893 C456.357097,275.34488 455.780506,277.114552 454.911935,278.815889 C454.047261,280.514684 452.925932,282.058735 451.579236,283.404838 C450.224125,284.76026 448.685975,285.878483 446.981561,286.742282 C445.288131,287.606645 443.513347,288.186681 441.41442,288.564477 C438.926402,289.007812 436.200593,289.1298 434.147694,289.185429 C432.85609,289.214514 431.570698,289.231994 430.253991,289.238234 C428.68478,289.250095 427.109977,289.250095 425.540512,289.250095 L41.8576242,289.250095 C41.8367282,289.250095 41.8163968,289.250095 41.7952184,289.250095 C40.2438253,289.250095 38.6893261,289.250095 37.109695,289.237952 C35.821762,289.231994 34.5366529,289.214797 33.294183,289.186559 C31.1944089,289.1298 28.4669051,289.008095 25.9991905,288.5673 C23.8822195,288.186653 22.107436,287.606645 20.391698,286.730986 C18.7033791,285.874812 17.1663592,284.757718 15.8106551,283.399755 C14.4653991,282.056758 13.3474586,280.517508 12.4830949,278.816171 C11.617884,277.116529 11.039006,275.341491 10.6583867,273.210373 C10.2184111,270.774567 10.0975527,268.163121 10.0371517,265.931476 C10.0026732,264.653709 9.98827184,263.376224 9.98008283,262.106081 L9.97387048,258.356363 L9.97387048,257.36634 L9.97387048,41.8605045 L9.97387048,40.8704819 L9.97980045,37.1286709 C9.98827184,35.8509036 10.0026732,34.5734187 10.0371517,33.2967809 C10.0975527,31.0628765 10.2184111,28.4503012 10.6620294,25.9941642 C11.0392884,23.8822477 11.617884,22.1072101 12.487613,20.3990964 C13.3451995,18.7107492 14.4651167,17.1695218 15.8174605,15.8174887 C17.1644108,14.4699736 18.7064571,13.3497741 20.4055346,12.4856928 C22.1029179,11.6213291 23.8810617,11.0410392 25.998061,10.6601092 C28.4372553,10.2218562 31.0551958,10.1009977 33.2972892,10.0402861 C34.5753389,10.0055535 35.8533886,9.99171687 37.1218373,9.9829631 L41.8576242,9.97364458 L425.540484,9.97364458"
    />
    <g fill="#000">
      <path
        d="M64.3701386 18.7514966C68.3721341 13.7458678 71.0878627 7.02478351 70.371607.156635919 64.5132486.44793863 57.3642463 4.02159262 53.225325 9.03114646 49.5090129 13.3210561 46.2197715 20.3235599 47.0772734 26.9037933 53.6535818 27.4742282 60.223819 23.6166698 64.3701386 18.7514966M70.2968894 28.1885919C60.7465035 27.6197101 52.6263416 33.608895 48.0655453 33.608895 43.5022358 33.608895 36.5181714 28.4752636 28.9643216 28.6136295 19.1325163 28.7580384 10.0097377 34.3170181 5.02051515 43.1584055-5.24146716 60.845529 2.31238262 87.0817206 12.2916183 101.486888 17.1377591 108.613582 22.9781865 116.460599 30.6738472 116.178727 37.9449504 115.893411 40.7949222 111.470557 49.6332599 111.470557 58.4651029 111.470557 61.032328 116.178727 68.7292313 116.036098 76.7111119 115.893383 81.7012098 108.905845 86.5472941 101.772204 92.1067256 93.6481457 94.3825633 85.8036992 94.5257015 85.3730704 94.3825351 85.2304405 79.13438 79.3808641 78.9929926 61.8407474 78.8490355 47.1541604 90.9645005 40.1684017 91.5347094 39.7351751 84.6929926 29.6162462 74.0029511 28.4752636 70.2968894 28.1885919"
        transform="translate(63.226 81.89)"
      />
      <path
        d="M40.5024334.459215539C61.2600389.459215539 75.7143122 14.7676399 75.7143122 35.5995958 75.7143122 56.5059305 60.9626085 70.8886771 39.9819233 70.8886771L16.9992802 70.8886771 16.9992802 107.437566.394319742 107.437566.394319742.459215539 40.5024334.459215539 40.5024334.459215539zM16.999252 56.95065L36.0523017 56.95065C50.509427 56.95065 58.7375426 49.1672539 58.7375426 35.6739463 58.7375426 22.1820789 50.509427 14.4716214 36.1266522 14.4716214L16.999252 14.4716214 16.999252 56.95065 16.999252 56.95065zM80.0528476 85.271452C80.0528476 71.6294151 90.5060291 63.2525984 109.041449 62.2144301L130.391063 60.9546222 130.391063 54.9501323C130.391063 46.2758571 124.533862 41.0864557 114.74992 41.0864557 105.480784 41.0864557 99.6979342 45.5337073 98.2908371 52.5034268L83.1673243 52.5034268C84.0567915 38.4166704 96.0657712 28.0378676 115.341929 28.0378676 134.246278 28.0378676 146.329608 38.0463014 146.329608 53.6888842L146.329608 107.437595 130.983072 107.437595 130.983072 94.6120864 130.614143 94.6120864C126.092541 103.286362 116.231396 108.771753 106.001295 108.771753 90.7290807 108.771753 80.0528476 99.2823895 80.0528476 85.271452zM130.391063 78.2287939L130.391063 72.075603 111.189256 73.2610604C101.625542 73.9288597 96.2145005 78.1544433 96.2145005 84.8267325 96.2145005 91.6463108 101.848621 96.0949742 110.448546 96.0949742 121.642437 96.0949742 130.391063 88.3845167 130.391063 78.2287939zM160.81819 136.128737L160.81819 123.154528C162.002208 123.450546 164.670553 123.450546 166.006151 123.450546 173.419179 123.450546 177.423122 120.337453 179.868388 112.331006 179.868388 112.182277 181.278337 107.586324 181.278337 107.511973L153.107705 29.4464049 170.453375 29.4464049 190.175664 92.9075589 190.470242 92.9075589 210.19256 29.4464049 227.09495 29.4464049 197.883269 111.514477C191.21386 130.420266 183.503375 136.499106 167.34175 136.499106 166.00618 136.499106 162.002236 136.350377 160.81819 136.128737z"
        transform="translate(63.226 81.89) translate(112.952 7.853)"
      />
    </g>
  </g>
</svg>
`,Vn=g`
<svg viewBox="0 0 469 300" xmlns="http://www.w3.org/2000/svg" aria-labelledby="googlePayTitleID googlePayDescID">
  <title id="googlePayTitleID">GooglePay icon</title>
  <desc id="googlePayDescID">The GooglePay logo</desc>
  <g fill="none">
    <path
      d="m426.541557.09900471h-384.5859537c-1.6020287 0-3.2068878 0-4.8060861.00848612-1.3501196.01131483-2.6974088.02545836-4.0475283.06223154-2.9408266.07920377-5.9071271.25175484-8.811158.77506548-2.9493177.52896804-5.6948441 1.39455212-8.3724397 2.75798848-2.6351391 1.33797799-5.043843 3.08894709-7.13553773 5.1765322-2.08886428 2.09041387-3.84090626 4.49481397-5.17970411 7.13116817-1.36427179 2.6759559-2.23038625 5.4198009-2.75684798 8.3701415-.52646173 2.9050811-.69911853 5.8667364-.77837083 8.8029334-.03679572 1.3492928-.05377835 2.695757-.06226967 4.042221-.00611375 1.6010478-.00611375 3.2020954-.00611375 4.8059718v215.8811936c0 1.603877 0 3.202097.00611375 4.805973.00849132 1.346464.02547395 2.695757.06226967 4.042221.0792523 2.933368.2519091 5.897852.77837083 8.800105.52646173 2.95034 1.39257619 5.694185 2.75684798 8.372969 1.33879785 2.633526 3.09083983 5.040754 5.17970411 7.12834 2.09169473 2.090414 4.50039863 3.841383 7.13553773 5.176532 2.6775956 1.366265 5.423122 2.23185 8.3724397 2.763646 2.9040309.517653 5.8703314.693033 8.811158.772236 1.3501195.031116 2.6974087.050918 4.0475283.056575 1.5991983.011315 3.2040574.011315 4.8060861.011315h384.5859537c1.599199 0 3.204058 0 4.803256-.011315 1.347289-.005657 2.694578-.025459 4.050359-.056575 2.935166-.079203 5.901466-.254583 8.811157-.772236 2.946488-.531796 5.692014-1.397381 8.37244-2.763646 2.635139-1.335149 5.038182-3.086118 7.132707-5.176532 2.086035-2.087586 3.838077-4.494814 5.179705-7.12834 1.367102-2.678784 2.233216-5.422629 2.756848-8.372969.526462-2.902253.696288-5.866737.77554-8.800105.036796-1.346464.053778-2.695757.06227-4.042221.011322-1.603876.011322-3.202096.011322-4.805973v-215.8811936c0-1.6038764 0-3.204924-.011322-4.8059718-.008492-1.346464-.025474-2.6929282-.06227-4.042221-.079252-2.936197-.249078-5.8978523-.77554-8.8029334-.523632-2.9503406-1.389746-5.6941856-2.756848-8.3701415-1.341628-2.6363542-3.09367-5.0407543-5.179705-7.13116817-2.094525-2.08758511-4.497568-3.83855421-7.132707-5.1765322-2.680426-1.36343636-5.425952-2.22902044-8.37244-2.75798848-2.909691-.52331064-5.875991-.69586171-8.811157-.77506548-1.355781-.03677318-2.70307-.05091671-4.050359-.06223154-1.599198-.00848612-3.204057-.00848612-4.803256-.00848612"
      fill="#3c4043"
    />
    <path
      d="m426.541557 10.0899948 4.732495.0084861c1.279359.0084861 2.561548.0226296 3.849398.0594028 2.241708.0594028 4.865525.1810372 7.311024.6194866 2.12283.3818754 3.906007.9645889 5.615592 1.8330016 1.689772.857098 3.235192 1.9829231 4.585313 3.3293871 1.35578 1.357779 2.482295 2.9050813 3.351239 4.610791.866115 1.6972237 1.443525 3.4679938 1.825633 5.6064956.435888 2.4185437.557598 5.0464117.617037 7.3008905.036796 1.270089.053778 2.5430068.059439 3.8470403.011322 1.5755893.011322 3.14835.011322 4.726768v215.8811936c0 1.578418 0 3.151179-.011322 4.757884-.005661 1.272918-.022643 2.545836-.059439 3.821582-.059439 2.248821-.181149 4.87669-.622697 7.320692-.376448 2.110214-.953858 3.880984-1.825633 5.586695-.866115 1.70288-1.989799 3.247354-3.339919 4.596647-1.358611 1.357779-2.89837 2.477946-4.607955 3.343531-1.698263.865584-3.47578 1.448298-5.578796 1.824515-2.496448.444107-5.227821.56857-7.285551.622315-1.293511.031116-2.581361.048088-3.903177.053746-1.570893.011314-3.150279.011314-4.724003.011314h-384.5859537c-.0198131 0-.0396261 0-.0622696 0-1.5539113 0-3.1134834 0-4.6956991-.011314-1.2906803-.005658-2.5785302-.02263-3.8239236-.050917-2.1058469-.056574-4.8400513-.181037-7.3138554-.622315-2.1228296-.379046-3.9003455-.96176-5.6212527-1.838659-1.6926027-.857098-3.2323618-1.977266-4.5909726-3.337874-1.3472892-1.343635-2.4681433-2.88528-3.3342577-4.590989-.8689448-1.702882-1.449185-3.479309-1.8312943-5.614982-.4387181-2.441174-.560427-5.054898-.6226967-7.292405-.0339652-1.278574-.0481174-2.559979-.0566087-3.830068l-.00566093-3.756521v-217.8641178l.00566093-3.7480355c.0084913-1.2814039.0226435-2.5599791.0566087-3.8385543.0622697-2.2403353.1839786-4.8568884.6283576-7.3178627.3764484-2.1130435.9566886-3.8922997 1.8284639-5.6036669.8604536-1.6915663 1.984138-3.2360398 3.337088-4.5881613 1.3501196-1.3521215 2.8983699-2.4722892 4.599464-3.3378733 1.7010941-.8684127 3.4842709-1.4482975 5.6071005-1.8301729 2.4454996-.4384494 5.0693169-.5600838 7.3166859-.6194866 1.2793586-.0367732 2.5615477-.0509167 3.8324149-.0594028l4.7466469-.0084861z"
      fill="#fffffe"
    />
    <g transform="translate(53.778 84.906)">
      <g fill="#3c4043" transform="translate(158.35 8.41)">
        <path
          d="m13.4306616 63.5773585v42.7212935h-13.34775628v-105.45768165h35.40057118c8.5392479-.16819407 16.8297798 3.1115903 22.8818681 9.16657685 12.1041765 11.4371967 12.8503244 30.6954178 1.4922957 43.0576819-.4974319.5045823-.9948639 1.0091644-1.4922957 1.5137466-6.217899 5.9708896-13.8451883 8.9983828-22.8818681 8.9983828zm0-49.7854447v36.8345013h22.3844362c4.9743191.1681941 9.7828276-1.8501348 13.1819457-5.4663073 6.9640468-7.316442 6.7982361-19.090027-.4145266-26.1541779-3.3991181-3.3638814-7.9589106-5.2140161-12.7674191-5.2140161zm85.3095733 17.9967654c9.8657331 0 17.6588331 2.6911052 23.3793001 7.9892184 5.720466 5.2981131 8.539248 12.6986522 8.539248 22.0334232v44.4873312h-12.767419v-10.0075469h-.580338c-5.554657 8.2415099-12.850324 12.3622639-22.0528145 12.3622639-7.7931 0-14.4255256-2.354717-19.6485607-7.064151-5.1401297-4.3730455-8.0418158-10.8485172-7.8760052-17.660377 0-7.4846361 2.8187808-13.3714286 8.3734372-17.8285714 5.5546563-4.4571429 13.0161351-6.6436658 22.3015308-6.6436658 7.9589104 0 14.4255254 1.5137466 19.5656554 4.3730458v-3.1115903c0-4.6253369-1.989728-8.9983828-5.471751-12.025876-3.564929-3.1956874-8.124721-4.9617251-12.8503246-4.9617251-7.4614787 0-13.3477564 3.1956874-17.658833 9.587062l-11.7725553-7.4846362c6.3008043-9.3347708 15.834916-14.0442048 28.5194298-14.0442048zm-17.2443063 52.3924529c0 3.5320754 1.6581063 6.8118598 4.3939818 8.8301887 2.9845915 2.3547169 6.6324255 3.6161724 10.3631649 3.5320754 5.6375617 0 11.0264077-2.2706199 15.0058627-6.3072776 4.393981-4.2048518 6.632426-9.1665768 6.632426-14.8851752-4.145267-3.3638815-9.948639-5.0458221-17.410117-4.961725-5.3888462 0-9.9486387 1.3455525-13.5964727 3.9525605-3.5649288 2.6070082-5.3888457 5.8867925-5.3888457 9.8393532z"
        />
        <path
          d="m203.947 34.143-44.603 103.86h-13.762l16.581-36.33-29.266-67.53h14.509l21.141 51.804h.248l20.644-51.804z"
        />
      </g>
      <path
        d="m117.808458 62.7363881c0-4.1207546-.331621-8.2415094-.994864-12.278167h-56.2927112v23.2948786h32.2501691c-1.3264851 7.4846362-5.6375617 14.2123989-11.938366 18.4172507v15.1374666h19.2340341c11.275123-10.5121296 17.741738-26.0700811 17.741738-44.5714289z"
        fill="#4285f4"
      />
      <path
        d="m60.5208828 121.940701c16.0836319 0 29.6801042-5.382211 39.5458372-14.632884l-19.2340341-15.1374666c-5.3888456 3.7002695-12.2699871 5.8026954-20.3118031 5.8026954-15.5862 0-28.7681456-10.6803234-33.4937488-24.9768194h-19.81437125v15.6420486c10.11444885 20.435579 30.75787325 33.302426 53.30812005 33.302426z"
        fill="#34a853"
      />
      <path
        d="m27.027134 72.9962264c-2.4871596-7.4846361-2.4871596-15.6420485 0-23.2107817v-15.5579515h-19.81437125c-8.53924786 17.0716981-8.53924786 37.2549866 0 54.3266847z"
        fill="#fbbc04"
      />
      <path
        d="m60.5208828 24.8086253c8.5392479-.168194 16.7468744 3.1115903 22.881868 9.0824798l17.0784962-17.3239891c-10.8605972-10.25983837-25.120312-15.89433972-39.9603642-15.72614565-22.5502468 0-43.1936712 12.95094345-53.30812005 33.38652285l19.81437125 15.6420486c4.7256032-14.380593 17.9075488-25.0609165 33.4937488-25.0609165z"
        fill="#ea4335"
      />
    </g>
  </g>
</svg>
`,Un=g`
<svg viewBox="0 0 468 300" xmlns="http://www.w3.org/2000/svg" aria-labelledby="payPalTitleID payPalDescID">
  <title id="payPalTitleID">PayPal icon</title>
  <desc id="payPalDescID">The PayPal logo</desc>
  <g fill="none" fill-rule="nonzero">
    <g>
      <path
        d="m426.088936 0h-384.1773743c-1.6000453 0-3.202918 0-4.8001076.0093427-1.3501283.00962581-2.6971182.02463075-4.044108.06143532-2.9377047.0795545-5.9005735.2531022-8.8015214.77516088-2.9473179.53111826-5.6899295 1.39744123-8.365531 2.76147524-2.6303624 1.33940326-5.0384885 3.09130081-7.1253898 5.18180042-2.08780603 2.09049964-3.8374226 4.49780164-5.1747992 7.13442444-1.36254076 2.6790896-2.22830126 5.4261262-2.75505234 8.3795514-.52417811 2.9055793-.6986591 5.8717446-.77782727 8.8101648-.03619117 1.348746-.05171378 2.697492-.06050711 4.0459548-.00671798 1.6026975-.00671798 3.2042625-.00671798 4.8097911v216.0649119c0 1.605529 0 3.204291.00671798 4.810103.00879333 1.348462.02431594 2.697208.06050711 4.045954.07916817 2.935844.25364916 5.90201.77782727 8.80674.52675108 2.954557 1.39251158 5.700461 2.75505234 8.379834 1.3373766 2.636623 3.08699317 5.047039 5.1747992 7.134425 2.0869013 2.093897 4.4950274 3.845511 7.1253898 5.181517 2.6756015 1.367714 5.4182131 2.23432 8.365531 2.765156 2.9009479.518661 5.8638167.695323 8.8015214.774877 1.3469898.030576 2.6939797.048696 4.044108.054924 1.5971896.012457 3.2000623.012457 4.8001076.012457h384.1773743c1.597218 0 3.200119 0 4.796997-.012457 1.347018-.006228 2.694037-.024348 4.04719-.054924 2.931485-.079554 5.893788-.256216 8.801833-.774877 2.943359-.530836 5.686536-1.397442 8.36242-2.765156 2.63319-1.336006 5.034248-3.08762 7.125447-5.181517 2.084385-2.087386 3.833973-4.497802 5.174771-7.134425 1.365622-2.679373 2.230535-5.425277 2.754741-8.379834.524489-2.90473.694701-5.870896.774152-8.80674.036756-1.348746.05488-2.697492.061101-4.045954.012412-1.605812.012412-3.204546.012412-4.810103v-216.0649119c0-1.6055286 0-3.2070936-.012412-4.8097911-.006221-1.3484628-.024345-2.6972088-.061101-4.0459548-.079479-2.9384202-.249663-5.9045855-.774152-8.8101648-.524178-2.9534252-1.389119-5.7004618-2.754741-8.3795514-1.340798-2.6366228-3.090386-5.0439248-5.174771-7.13442444-2.091199-2.09049961-4.492257-3.84239716-7.125447-5.18180042-2.675884-1.36403401-5.419061-2.23035698-8.36242-2.76147524-2.908017-.52205868-5.87032-.69560638-8.801833-.77516088-1.353153-.03680457-2.700172-.05180951-4.04719-.06143532-1.596878-.0093427-3.199779-.0093427-4.796997-.0093427z"
        fill="#333"
      />
      <path
        d="m426.077344 10 4.725746.0090596c1.280186.0090595 2.5604.022932 3.847682.0580377 2.239223.0605858 4.858628.1820405 7.300254.6202965 2.122429.3827662 3.902447.9648426 5.610709 1.8356924 1.686464.8581098 3.231593 1.9826271 4.580707 3.3316515 1.354261 1.358084 2.478692 2.9078342 3.346946 4.6152773.864832 1.6972511 1.442442 3.4712253 1.822427 5.6121115.43653 2.418335.557254 5.0484372.618634 7.3045496.034464 1.2734338.051428 2.5468676.057676 3.8505942.011875 1.5766458.011875 3.1524422.011875 4.7322022v216.0641685c0 1.57976 0 3.152725-.012158 4.763061-.005965 1.273151-.022901 2.546585-.057676 3.822284-.061097 2.252715-.181793 4.881401-.623695 7.328331-.374641 2.111442-.95194 3.885699-1.821579 5.591444-.865737 1.703196-1.988444 3.251248-3.336795 4.600839-1.356777 1.358933-2.896816 2.480053-4.603326 3.34609-1.695511.866603-3.472476 1.448141-5.573982 1.826916-2.491076.444484-5.220235.566788-7.275657.622561-1.293191.02916-2.580163.046685-3.898488.052942-1.57114.011891-3.147878.011891-4.719272.011891h-384.1544332c-.0209218 0-.0412781 0-.0624826 0-1.5532997 0-3.1097094 0-4.6912818-.012174-1.2895158-.005974-2.5762044-.023215-3.8202013-.051527-2.1023547-.056905-4.8332106-.178926-7.303958-.620862-2.1195728-.381634-3.8965375-.963144-5.6143841-1.841072-1.6903938-.858393-3.2293027-1.97838-4.586673-3.339861-1.3469093-1.346477-2.4662238-2.889716-3.3316498-4.59546-.8662742-1.704046-1.4458636-3.483682-1.8269507-5.620322-.4405163-2.442116-.5615233-5.060328-.6219985-7.297755-.0345209-1.281077-.0489399-2.561872-.057139-3.835306l-.00622-3.759432v-.992588-216.0641685-.9925876l.0059373-3.7515053c.0084818-1.2810777.0229008-2.5618724.0574217-3.8418177.0604752-2.239692.1814822-4.8590359.6256456-7.3215363.3777227-2.117388.9570294-3.8970244 1.8278273-5.6095635.8586405-1.6927213 1.9799341-3.2379418 3.3339398-4.5934777 1.3486057-1.3510062 2.8925472-2.474108 4.5937129-3.340428 1.6994694-.8666031 3.4797986-1.4483964 5.5993996-1.8303133 2.442192-.4393884 5.06335-.56056 7.3081989-.6214289 1.2796204-.0348226 2.5592408-.0486951 3.8292485-.0574715l4.7416072-.0093427z"
        fill="#fff"
      />
    </g>
    <g transform="translate(23 94)">
      <g fill="#238ec2">
        <path
          d="m400.83873 2.69525159-13.453417 85.59022681c-.260388 1.6582649 1.02176 3.1566421 2.69982 3.1566421h13.529554c2.241475 0 4.149469-1.6308556 4.498177-3.8449211l13.26612-84.05073558c.261911-1.65978771-1.020237-3.1596876-2.69982-3.1596876h-15.140614c-1.346103 0-2.491204.97912247-2.69982 2.30847537"
        />
        <path
          d="m360.463252 61.2598709c-1.515127 8.9689446-8.635464 14.9898625-17.715569 14.9898625-4.552995 0-8.196915-1.4648768-10.540413-4.2377882-2.32218-2.7485476-3.196233-6.6635147-2.459227-11.0246449 1.413104-8.8882393 8.647647-15.1025454 17.590704-15.1025454 4.457063 0 8.075096 1.4770588 10.464277 4.2758568 2.404408 2.8185936 3.348507 6.7609701 2.660228 11.0992592zm21.875698-30.5507529h-15.696415c-1.34458 0-2.489681.9775997-2.698297 2.3069526l-.691324 4.3885396-1.096374-1.5897416c-3.40028-4.9352036-10.975917-6.5828094-18.540894-6.5828094-17.340975 0-32.1542 13.1412549-35.038271 31.5709894-1.4999 9.195833.630415 17.9820486 5.84428 24.1156494 4.789021 5.6341417 11.624605 7.9806856 19.768224 7.9806856 13.97724 0 21.731037-8.9796037 21.731037-8.9796037l-.701984 4.362653c-.261911 1.6582649 1.020237 3.1596876 2.69982 3.1596876h14.135605c2.239952 0 4.147946-1.6293329 4.498177-3.8433983l8.484713-53.7329621c.261911-1.658265-1.020237-3.1566421-2.698297-3.1566421z"
        />
        <path
          d="m288.146759 31.085235c-1.792266 11.7662198-10.777961 11.7662198-19.469767 11.7662198h-4.945863l3.468805-21.9685846c.210138-1.3278301 1.355239-2.3054299 2.699819-2.3054299h2.265839c5.917372 0 11.505831 0 14.386857 3.3698259 1.723743 2.0176318 2.246043 5.0067724 1.59431 9.1379688zm-3.782489-30.69845878h-32.780046c-2.241474 0-4.149469 1.63085562-4.498177 3.84492105l-13.25546 84.05225833c-.261911 1.658265 1.020236 3.1581649 2.698297 3.1581649h16.818675c1.568423 0 2.905389-1.1420558 3.149028-2.6906834l3.759647-23.8293741c.348708-2.2140654 2.256703-3.844921 4.498177-3.844921h10.372912c21.590945 0 34.051535-10.4490488 37.308678-31.1598493 1.466399-9.0572636.059387-16.1745551-4.181447-21.15696366-4.662633-5.47729942-12.925026-8.37355282-23.890284-8.37355282z"
        />
      </g>
      <path
        d="m232.141867 30.709118h-15.777119c-1.509037 0-2.920618.7491886-3.767262 1.9963134l-21.763014 32.0521756-9.223243-30.8004824c-.577118-1.9262674-2.351112-3.2480066-4.362653-3.2480066h-15.509117c-1.872971 0-3.190142 1.8425166-2.587137 3.6149871l17.372952 50.9905056-16.340533 23.0558213c-1.282148 1.809017.012182 4.312403 2.229293 4.312403h15.761892c1.493809 0 2.893208-.732439 3.742897-1.959768l52.469087-75.7243876c1.254739-1.8120618-.041114-4.2895614-2.246043-4.2895614"
        fill="#253667"
      />
      <path
        d="m126.667688 61.2598709c-1.51665 8.9689446-8.635464 14.9898625-17.717091 14.9898625-4.551473 0-8.195392-1.4648768-10.5388909-4.2377882-2.3221801-2.7485476-3.1962334-6.6635147-2.4592267-11.0246449 1.4131036-8.8882393 8.6461236-15.1025454 17.5891816-15.1025454 4.457063 0 8.076618 1.4770588 10.465799 4.2758568 2.404408 2.8185936 3.348507 6.7609701 2.660228 11.0992592zm21.874175-30.5507529h-15.694892c-1.346103 0-2.491204.9775997-2.699819 2.3069526l-.689802 4.3885396-1.097896-1.5897416c-3.398758-4.9352036-10.974395-6.5828094-18.539372-6.5828094-17.3409749 0-32.1541994 13.1412549-35.0382709 31.5709894-1.4998999 9.195833.6304148 17.9820486 5.8427572 24.1156494 4.7905433 5.6341417 11.6261277 7.9806856 19.7697467 7.9806856 13.97724 0 21.729514-8.9796037 21.729514-8.9796037l-.700461 4.362653c-.261911 1.6582649 1.020237 3.1596876 2.69982 3.1596876h14.134082c2.241475 0 4.149469-1.6293329 4.498177-3.8433983l8.486236-53.7329621c.261911-1.658265-1.020237-3.1566421-2.69982-3.1566421z"
        fill="#253667"
      />
      <path
        d="m54.3511949 31.085235c-1.7922661 11.7662198-10.7794836 11.7662198-19.4697665 11.7662198h-4.9458629l3.4688041-21.9685846c.2101382-1.3278301 1.3537167-2.3054299 2.698297-2.3054299h2.2673614c5.9158488 0 11.5058311 0 14.3868571 3.3698259 1.7237428 2.0176318 2.246043 5.0067724 1.5943098 9.1379688zm-3.7840114-30.69845878h-32.7800457c-2.2399521 0-4.1494693 1.63085562-4.498177 3.84492105l-13.2554605 84.05225833c-.26038871 1.658265 1.02023648 3.1581649 2.69981982 3.1581649h15.65073208c2.2414748 0 4.1494693-1.6308556 4.498177-3.8449211l3.5769186-22.6751364c.3502304-2.2140654 2.2582249-3.844921 4.4996997-3.844921h10.371389c21.5924676 0 34.0530573-10.4490488 37.3102003-31.1598493 1.4648769-9.0572636.0593869-16.1745551-4.1829696-21.15696366-4.6611102-5.47729942-12.9235029-8.37355282-23.8902837-8.37355282z"
        fill="#253667"
      />
    </g>
  </g>
</svg>
`,qn=g`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 449 300" aria-labelledby="venmoTitleID venmoDescID">
  <title id="venmoTitleID">Venmo icon</title>
  <desc id="venmoDescID">The Venmo logo</desc>
  <g fill="none">
    <rect width="448.934" height="299.289" fill="#3D95CE" rx="29.929" />
    <path
      fill="#FFF"
      d="M314.253648,95.768518 C314.253648,140.505629 276.917862,198.622312 246.615405,239.43135 L177.402732,239.43135 L149.644594,69.6528784 L210.247869,63.767475 L224.923984,184.575771 C238.636763,161.724586 255.559021,125.813905 255.559021,101.330492 C255.559021,87.9291341 253.314515,78.8010611 249.806862,71.285106 L304.995473,59.8578376 C311.376749,70.6382477 314.253648,81.742087 314.253648,95.768518 Z"
    />
  </g>
</svg>
`;var A;(function(i){i.Loading="loading",i.Available="available",i.Unavailable="unavailable"})(A||(A={}));let V=class extends I{constructor(){super(...arguments),this.donationInfoValid=!0,this.applePayMode=A.Loading,this.googlePayMode=A.Loading,this.venmoMode=A.Loading,this.payPalMode=A.Loading,this.paymentModeSelected=void 0}render(){const e=this.paymentModeSelected?"payment-selected":"";return g`
      <div
        class="payment-container ${this.donationInfoValid?"donation-info-valid":"donation-info-invalid"} ${e}"
      >
        <div class="payment-provider-container">
          <button
            class="applepay provider-button ${this.applePayMode} ${this.paymentModeSelected==="apple"?"selected":""}"
            @click=${t=>{this.paymentModeSelected="apple",this.applePaySelected(t)}}
            tabindex="0"
          >
            <div class="payment-image">${zn}</div>
          </button>

          <button
            class="googlepay provider-button ${this.googlePayMode} ${this.paymentModeSelected==="google"?"selected":""}"
            @click=${()=>{this.paymentModeSelected="google",this.googlePaySelected()}}
            tabindex="0"
          >
            <div class="payment-image">${Vn}</div>
          </button>

          <button
            class="venmo provider-button ${this.venmoMode} ${this.paymentModeSelected==="venmo"?"selected":""}"
            @click=${()=>{this.paymentModeSelected="venmo",this.venmoSelected()}}
            tabindex="0"
          >
            <div class="payment-image">${qn}</div>
          </button>

          <div
            class="paypal-container provider-button ${this.payPalMode}
              ${this.paymentModeSelected==="paypal"?"selected":""}"
            tabindex="0"
          >
            <div class="payment-image">
              <div
                class="paypal-local-button"
                @click=${()=>{this.paymentModeSelected="paypal",this.localPaypalButtonClicked()}}
              >
                ${Un}
              </div>
              <slot name="paypal-button"></slot>
            </div>
          </div>
        </div>

        <div class="credit-card-container">
          <button
            @click=${()=>{this.paymentModeSelected="cc",this.creditCardSelected()}}
            class="button-style credit-card-button ${this.paymentModeSelected==="cc"?"selected":""}"
            tabindex="0"
          >
            <div class="cc-title">Credit Card</div>
            <div class="cc-background"></div>
          </button>
        </div>
      </div>

      ${this.paymentModeSelected?g`
            <button
              id="change-payment-method"
              @click=${()=>{this.paymentModeSelected=void 0,this.dispatchEvent(new Event("resetPaymentMethod")),this.setButtonVisibility()}}
            >
              Change payment method
            </button>
          `:$}
    `}firstUpdated(){this.dispatchEvent(new Event("firstUpdated"))}updated(e){e.has("paymentProviders")&&this.setButtonVisibility()}showPaypalButton(){this.payPalMode=A.Available}setButtonVisibility(){return p(this,void 0,void 0,function*(){var e,t,o;(e=this.paymentProviders)===null||e===void 0||e.venmoHandler.get().then(n=>{if(!n){this.venmoMode=A.Unavailable;return}n.isBrowserSupported().then(a=>{this.venmoMode=a?A.Available:A.Unavailable}).catch(a=>{console.error("error loading venmo",a),this.venmoMode=A.Unavailable})}).catch(n=>{console.error("venmo unavailable",n),this.venmoMode=A.Unavailable}),(t=this.paymentProviders)===null||t===void 0||t.applePayHandler.get().then(n=>{if(!n){console.error("applePayHandler unavailable"),this.applePayMode=A.Unavailable;return}n.isAvailable().then(a=>{this.applePayMode=a?A.Available:A.Unavailable}).catch(a=>{console.error("error loading applepay",a),this.applePayMode=A.Unavailable})}).catch(n=>{console.error("apple pay unavailable",n),this.applePayMode=A.Unavailable}),(o=this.paymentProviders)===null||o===void 0||o.googlePayHandler.get().then(n=>{if(!n){console.error("google pay handler unavailable"),this.googlePayMode=A.Unavailable;return}n.isBrowserSupported().then(a=>{this.googlePayMode=a?A.Available:A.Unavailable}).catch(a=>{console.error("error loading googlepay",a),this.googlePayMode=A.Unavailable})}).catch(n=>{console.error("google pay unavailable",n),this.googlePayMode=A.Unavailable})})}googlePaySelected(){this.dispatchEvent(new Event("googlePaySelected"))}applePaySelected(e){const t=new CustomEvent("applePaySelected",{detail:{originalEvent:e}});this.dispatchEvent(t)}venmoSelected(){this.dispatchEvent(new Event("venmoSelected"))}creditCardSelected(){this.dispatchEvent(new Event("creditCardSelected"))}localPaypalButtonClicked(){this.dispatchEvent(new Event("paypalBlockerSelected"))}static get styles(){const e=h`var(--paymentButtonWidth, 5rem)`,t=h`var(--paymentButtonHeight, 3.2rem)`,o=h`var(--creditCardFontSize, 1.8rem)`;return h`
      button {
        color: inherit;
        font-family: inherit;
      }

      .payment-container {
        width: 100%;
      }

      .payment-provider-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-gap: 1rem;
        margin-bottom: 1rem;
        max-width: 23rem;
      }

      .provider-button {
        border: 0;
        padding: 0;
        background: none;
        cursor: pointer;
        width: ${e};
        height: ${t};
      }

      .provider-button.unavailable {
        display: none;
      }

      .provider-button.loading {
        border: 1px solid #ddd;
        border-radius: 2px;
        /* account for the borders that don't exist once the provider loads, otherwise the layout shifts */
        margin-bottom: -2px;
      }

      .provider-button.loading .payment-image {
        display: none;
      }

      .paypal-local-button {
        position: absolute;
        width: ${e};
        height: ${t};
      }

      .donation-info-valid .paypal-local-button {
        z-index: 0;
      }

      .donation-info-invalid .paypal-local-button {
        z-index: 250;
      }

      .credit-card-button {
        color: var(--ccButtonFontColor, #333);
        background-color: var(--ccButtonColor, white);
        border: 1px solid #333;
        border-radius: 4px;
        cursor: pointer;
        margin: 0;
        padding: 0.7rem 1rem;
        width: 100%;
      }

      .credit-card-button .cc-background {
        height: 2.4rem;
        width: 100%;
        background-repeat: no-repeat;
        background-image: url(https://archive.org/images/cc_logos.png);
        background-position: 50% 50%;
        background-size: contain;
      }

      .credit-card-button .cc-title {
        font-size: ${o};
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      button#change-payment-method {
        margin-top: 10px;
        background: white;
        border: 1px solid;
        border-radius: 3px;
        padding: 5px;
      }

      button#change-payment-method:hover {
        cursor: pointer;
      }

      .payment-selected button:not(.selected),
      .payment-selected .paypal-container:not(.selected) {
        display: none;
      }
    `}};d([v({type:Boolean})],V.prototype,"donationInfoValid",void 0);d([v({type:Object})],V.prototype,"paymentProviders",void 0);d([v({type:String})],V.prototype,"applePayMode",void 0);d([v({type:String})],V.prototype,"googlePayMode",void 0);d([v({type:String})],V.prototype,"venmoMode",void 0);d([v({type:String})],V.prototype,"payPalMode",void 0);d([v({type:String})],V.prototype,"paymentModeSelected",void 0);V=d([D("payment-selector")],V);var ee;(function(i){i.Summary="summary",i.Edit="edit"})(ee||(ee={}));let W=class extends I{constructor(){super(...arguments),this.mode=ee.Edit,this.amountOptions=je,this.amountSelectionLayout=K.MultiLine,this.frequencySelectionMode=H.Button}render(){return g` ${this.currentTemplate} `}get currentTemplate(){switch(this.mode){case ee.Summary:return this.donationSummaryTemplate;case ee.Edit:return this.editDonationTemplate}}get editDonationTemplate(){return g`
      <donation-form-edit-donation
        .donationInfo=${this.donationInfo}
        .amountOptions=${this.amountOptions}
        .amountSelectionLayout=${this.amountSelectionLayout}
        .frequencySelectionMode=${this.frequencySelectionMode}
        @donationInfoChanged=${this.donationInfoChanged}
        @showSummaryClicked=${this.showSummaryClicked}
        @editDonationError=${this.editDonationError}
      >
      </donation-form-edit-donation>
    `}get donationSummaryTemplate(){return g`
      <donation-summary .donationInfo=${this.donationInfo} @editClicked=${this.summaryEditClicked}>
      </donation-summary>
    `}donationInfoChanged(e){this.donationInfo=e.detail.donationInfo;const t=new CustomEvent("donationInfoChanged",{detail:{donationInfo:this.donationInfo}});this.dispatchEvent(t)}editDonationError(e){const t=new CustomEvent("editDonationError",{detail:e.detail});this.dispatchEvent(t)}summaryEditClicked(){this.mode=ee.Edit}showSummaryClicked(){this.mode=ee.Summary}static get styles(){return h``}};d([v({type:Object})],W.prototype,"donationInfo",void 0);d([v({type:String})],W.prototype,"mode",void 0);d([v({type:Array})],W.prototype,"amountOptions",void 0);d([v({type:String})],W.prototype,"amountSelectionLayout",void 0);d([v({type:String})],W.prototype,"frequencySelectionMode",void 0);d([b("edit-donation")],W.prototype,"editDonation",void 0);W=d([D("donation-form-header")],W);let ct=class extends I{render(){return g`
      <div class="top-line"></div>
      <div class="total-line">Total: ${this.totalAmount}</div>
    `}get totalAmount(){if(!this.donationInfo)return;const e=k(this.donationInfo.total,{symbol:"$"}).format(),t=this.donationInfo.donationType===w.Monthly?"/month":"";return`${e}${t}`}static get styles(){const e=h`var(--totalAmountLineColor, #333)`,t=h`var(--totalAmountLineThickness, 2px)`,o=h`var(--totalAmountVerticalSpacing, 0.5rem)`,n=h`var(--totalAmountFontSize, 2.6rem)`;return h`
      .top-line {
        width: 100%;
        height: ${t};
        background-color: ${e};
      }

      .total-line {
        font-size: ${n};
        font-weight: bold;
        text-align: center;
        margin-top: ${o};
      }
    `}};d([v({type:Object})],ct.prototype,"donationInfo",void 0);ct=d([D("donation-form-total-amount")],ct);let T=class extends I{constructor(){super(...arguments),this.amountOptions=je,this.amountSelectionLayout=K.MultiLine,this.frequencySelectionMode=H.Button,this.creditCardVisible=!1,this.contactFormVisible=!1,this.donationInfoValid=!0,this.paypalButtonNeedsRender=!0,this.flowHandlersConfigured=!1,this.flowHandlerListenersBound=!1}render(){var e;return g`
      <donation-form-header
        .amountOptions=${this.amountOptions}
        .amountSelectionLayout=${this.amountSelectionLayout}
        .frequencySelectionMode=${this.frequencySelectionMode}
        @donationInfoChanged=${this.donationInfoChanged}
        @editDonationError=${this.editDonationError}
      >
      </donation-form-header>

      <donation-form-section
        .badgeMode=${fe.HideBadgeLeaveSpacing}
        id="total-amount-section"
      >
        <donation-form-total-amount .donationInfo=${this.donationInfo}>
        </donation-form-total-amount>
      </donation-form-section>

      <donation-form-section
        .sectionBadge=${this.paymentSelectorNumberingStart}
        headline="Choose a payment method"
      >
        <payment-selector
          .paymentProviders=${(e=this.braintreeManager)===null||e===void 0?void 0:e.paymentProviders}
          @firstUpdated=${this.paymentSelectorFirstUpdated}
          @creditCardSelected=${this.creditCardSelected}
          @venmoSelected=${this.venmoSelected}
          @applePaySelected=${this.applePaySelected}
          @googlePaySelected=${this.googlePaySelected}
          @paypalBlockerSelected=${this.paypalBlockerSelected}
          @resetPaymentMethod=${()=>p(this,void 0,void 0,function*(){this.selectedPaymentProvider=void 0,this.contactFormVisible=!1,this.requestUpdate()})}
          tabindex="0"
        >
          <slot name="paypal-button" slot="paypal-button"></slot>
        </payment-selector>
      </donation-form-section>

      <div class="contact-form-section ${this.contactFormVisible?"":"hidden"}">
        ${this.contactFormSectionTemplate}
      </div>
      <slot name="recaptcha"></slot>
    `}showConfirmationModalDev(e){return p(this,void 0,void 0,function*(){var t;(t=this.paymentFlowHandlers)===null||t===void 0||t.showConfirmationStepModal(e)})}showUpsellModalDev(e){return p(this,void 0,void 0,function*(){var t,o;if((t=this.paymentFlowHandlers)===null||t===void 0||t.showUpsellModal(e),e.ctaMode===G.PayPalUpsellSlot){const n=yield(o=this.braintreeManager)===null||o===void 0?void 0:o.paymentProviders.paypalHandler.get(),a=new N({amount:e.oneTimeAmount,donationType:w.OneTime,coverFees:!1});n?.renderPayPalButton({selector:"#paypal-upsell-button",style:{color:"blue",label:"paypal",shape:"rect",size:"responsive",tagline:!1},donationInfo:a})}})}get contactFormSectionTemplate(){const e=this.selectedPaymentProvider===F.Venmo?"Help us stay in touch":"Enter payment information";return g`
      <donation-form-section
        .sectionBadge=${this.paymentSelectorNumberingStart+1}
        headline=${e}
        id="contactFormSection"
      >
        <slot name="contact-form"></slot>
        <div class="credit-card-fields" class="${this.creditCardVisible?"":"hidden"}">
          <slot name="braintree-hosted-fields"></slot>
        </div>
      </donation-form-section>

      <donation-form-section .sectionBadge=${this.paymentSelectorNumberingStart+2}>
        <slot name="recaptcha"></slot>
        <button id="donate-button" @click=${this.donateClicked}>Donate</button>

        <div class="secure-process-note">${ro} Your payment will be securely processed</div>
      </donation-form-section>
    `}get paymentSelectorNumberingStart(){return this.frequencySelectionMode===H.Button?3:2}editDonationError(){this.donationInfoValid=!1}paymentSelectorFirstUpdated(){var e;!((e=this.paymentFlowHandlers)===null||e===void 0)&&e.paypalHandler&&this.renderPayPalButtonIfNeeded()}applePaySelected(e){var t,o;if(this.selectedPaymentProvider=F.ApplePay,this.contactFormVisible=!1,this.creditCardVisible=!1,!this.donationInfoValid){this.showInvalidDonationInfoAlert();return}const n=e.detail.originalEvent;this.donationInfo&&((o=(t=this.paymentFlowHandlers)===null||t===void 0?void 0:t.applePayHandler)===null||o===void 0||o.paymentInitiated(this.donationInfo,n)),this.emitPaymentFlowStartedEvent()}googlePaySelected(){var e,t;this.selectedPaymentProvider=F.GooglePay,this.contactFormVisible=!1,this.creditCardVisible=!1,this.donationInfoValid?(this.donationInfo&&((t=(e=this.paymentFlowHandlers)===null||e===void 0?void 0:e.googlePayHandler)===null||t===void 0||t.paymentInitiated(this.donationInfo)),this.emitPaymentFlowStartedEvent()):this.showInvalidDonationInfoAlert()}creditCardSelected(){return p(this,void 0,void 0,function*(){if(!this.donationInfoValid){this.showInvalidDonationInfoAlert();return}this.selectedPaymentProvider=F.CreditCard,this.contactFormVisible=!0,this.creditCardVisible=!0,this.focusContactForm()})}venmoSelected(){return p(this,void 0,void 0,function*(){if(!this.donationInfoValid){this.showInvalidDonationInfoAlert();return}this.selectedPaymentProvider=F.Venmo,this.contactFormVisible=!0,this.creditCardVisible=!1,this.focusContactForm()})}paypalBlockerSelected(){this.contactFormVisible=!1,this.creditCardVisible=!1,this.showInvalidDonationInfoAlert()}focusContactForm(){return p(this,void 0,void 0,function*(){var e;yield this.updateComplete,this.contactFormSection&&((e=this.contactForm)===null||e===void 0||e.focus())})}donateClicked(){return p(this,void 0,void 0,function*(){if(!this.contactForm){alert("Please enter contact info.");return}if(!this.donationInfoValid||!this.donationInfo){this.showInvalidDonationInfoAlert();return}const e=this.contactForm.donorContactInfo;switch(this.selectedPaymentProvider){case F.CreditCard:this.handleCreditCardDonationFlow(e,this.donationInfo);break;case F.Venmo:this.handleVenmoDonationFlow(e,this.donationInfo);break}})}handleCreditCardDonationFlow(e,t){return p(this,void 0,void 0,function*(){var o,n,a;const r=(o=this.paymentFlowHandlers)===null||o===void 0?void 0:o.creditCardHandler,u=yield(n=this.braintreeManager)===null||n===void 0?void 0:n.paymentProviders.creditCardHandler.get();u?.hideErrorMessage();const s=(a=this.contactForm)===null||a===void 0?void 0:a.reportValidity(),l=yield r?.tokenizeFields();!s||l===void 0||(this.emitPaymentFlowStartedEvent(),r?.paymentInitiated(l,t,e))})}handleVenmoDonationFlow(e,t){return p(this,void 0,void 0,function*(){var o,n,a;!((o=this.contactForm)===null||o===void 0)&&o.reportValidity()&&((a=(n=this.paymentFlowHandlers)===null||n===void 0?void 0:n.venmoHandler)===null||a===void 0||a.paymentInitiated(e,t))})}emitPaymentFlowStartedEvent(){if(!this.selectedPaymentProvider)return;const e=new CustomEvent("paymentFlowStarted",{detail:{paymentProvider:this.selectedPaymentProvider}});this.dispatchEvent(e)}emitPaymentFlowConfirmedEvent(){if(!this.selectedPaymentProvider)return;const e=new CustomEvent("paymentFlowConfirmed",{detail:{paymentProvider:this.selectedPaymentProvider}});this.dispatchEvent(e)}emitPaymentFlowCancelledEvent(){if(!this.selectedPaymentProvider)return;const e=new CustomEvent("paymentFlowCancelled",{detail:{paymentProvider:this.selectedPaymentProvider}});this.dispatchEvent(e)}emitPaymentFlowErrorEvent(e){if(!this.selectedPaymentProvider)return;const t=new CustomEvent("paymentFlowError",{detail:{paymentProvider:this.selectedPaymentProvider,error:e}});this.dispatchEvent(t)}showInvalidDonationInfoAlert(){alert("Please enter a valid donation amount.")}renderPayPalButtonIfNeeded(){return p(this,void 0,void 0,function*(){var e,t;this.paypalButtonNeedsRender&&(this.paypalButtonNeedsRender=!1,this.donationInfo&&(yield(t=(e=this.paymentFlowHandlers)===null||e===void 0?void 0:e.paypalHandler)===null||t===void 0?void 0:t.renderPayPalButton(this.donationInfo)),this.paymentSelector.showPaypalButton())})}updated(e){var t,o;if(e.has("donationInfo")&&this.donationInfo&&((o=(t=this.paymentFlowHandlers)===null||t===void 0?void 0:t.paypalHandler)===null||o===void 0||o.updateDonationInfo(this.donationInfo),this.donationFormHeader.donationInfo=this.donationInfo),(e.has("paymentFlowHandlers")||e.has("donationInfo"))&&this.donationInfo&&this.paymentFlowHandlers&&this.setupFlowHandlers(),e.has("donationInfoValid")&&(this.paymentSelector.donationInfoValid=this.donationInfoValid),e.has("selectedPaymentProvider")){const n=new CustomEvent("paymentProviderSelected",{detail:{paymentProvider:this.selectedPaymentProvider,previousPaymentProvider:e.get("selectedPaymentProvider")}});this.dispatchEvent(n)}}setupFlowHandlers(){var e,t;this.flowHandlersConfigured||(this.flowHandlersConfigured=!0,this.bindFlowListenerEvents(),this.renderPayPalButtonIfNeeded(),this.donationInfo&&((t=(e=this.paymentFlowHandlers)===null||e===void 0?void 0:e.paypalHandler)===null||t===void 0||t.updateDonationInfo(this.donationInfo)))}bindFlowListenerEvents(){var e,t,o,n,a,r,u,s,l,c;this.flowHandlerListenersBound||(this.flowHandlerListenersBound=!0,(t=(e=this.paymentFlowHandlers)===null||e===void 0?void 0:e.paypalHandler)===null||t===void 0||t.on("payPalPaymentStarted",()=>{this.selectedPaymentProvider=F.PayPal,this.emitPaymentFlowStartedEvent()}),(n=(o=this.paymentFlowHandlers)===null||o===void 0?void 0:o.paypalHandler)===null||n===void 0||n.on("payPalPaymentConfirmed",()=>{this.selectedPaymentProvider=F.PayPal,this.emitPaymentFlowConfirmedEvent()}),(r=(a=this.paymentFlowHandlers)===null||a===void 0?void 0:a.paypalHandler)===null||r===void 0||r.on("payPalPaymentCancelled",()=>{this.selectedPaymentProvider=F.PayPal,this.emitPaymentFlowCancelledEvent()}),(s=(u=this.paymentFlowHandlers)===null||u===void 0?void 0:u.paypalHandler)===null||s===void 0||s.on("payPalPaymentError",(m,y)=>{this.selectedPaymentProvider=F.PayPal,this.emitPaymentFlowErrorEvent(y)}),(c=(l=this.paymentFlowHandlers)===null||l===void 0?void 0:l.googlePayHandler)===null||c===void 0||c.on("paymentCancelled",()=>{this.selectedPaymentProvider=F.GooglePay,this.emitPaymentFlowCancelledEvent()}))}donationInfoChanged(e){const t=e.detail.donationInfo;this.donationInfo=new N({amount:t.amount,donationType:t.donationType,coverFees:t.coverFees}),this.donationInfoValid=!0;const o=new CustomEvent("donationInfoChanged",{detail:{donationInfo:t}});this.dispatchEvent(o)}static get styles(){const e=h`var(--donateButtonFontSize, 2.6rem)`,t=h`var(--donateButtonHeight, 4rem)`,o=h`var(--donateButtonColor, rgba(49, 164, 129, 1))`,n=h`var(--donateButtonTextColor, #fff)`,a=h`var(--donateButtonHoverColor, rgba(39, 131, 103, 1))`,r=h`var(--donateTotalAmountTopMargin, 1.5rem)`,u=h`var(--donateTotalAmountBottomMargin, 1.2rem)`;return h`
      h1 {
        margin: 0;
        padding: 0;
      }

      .hidden {
        display: none;
      }

      .secure-process-note {
        margin-top: 0.5em;
        font-size: 0.75em;
        text-align: center;
      }

      .secure-process-note svg {
        width: 1.2rem;
        height: 1.5rem;
        vertical-align: bottom;
      }

      #donate-button {
        width: 100%;
        appearance: none;
        -webkit-appearance: none;
        font-size: ${e};
        font-weight: bold;
        text-align: center;
        color: ${n};
        cursor: pointer;
        border: none;
        border-radius: 5px;
        background-color: ${o};
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        height: ${t};
      }

      #donate-button:hover {
        background-color: ${a};
      }

      #total-amount-section {
        display: block;
        margin-top: ${r};
        margin-bottom: ${u};
      }
    `}};d([v({type:Object})],T.prototype,"braintreeManager",void 0);d([v({type:Object})],T.prototype,"paymentFlowHandlers",void 0);d([v({type:Object})],T.prototype,"donationRequest",void 0);d([v({type:Object})],T.prototype,"donationInfo",void 0);d([v({type:Object})],T.prototype,"contactForm",void 0);d([v({type:Array})],T.prototype,"amountOptions",void 0);d([v({type:String})],T.prototype,"amountSelectionLayout",void 0);d([v({type:String})],T.prototype,"frequencySelectionMode",void 0);d([v({type:Boolean})],T.prototype,"creditCardVisible",void 0);d([v({type:Boolean})],T.prototype,"contactFormVisible",void 0);d([v({type:Boolean})],T.prototype,"donationInfoValid",void 0);d([v({type:String})],T.prototype,"selectedPaymentProvider",void 0);d([b("#contactFormSection")],T.prototype,"contactFormSection",void 0);d([b("donation-form-header")],T.prototype,"donationFormHeader",void 0);d([b("payment-selector")],T.prototype,"paymentSelector",void 0);T=d([D("donation-form")],T);export{N as D,zo as L,En as R,p as _,w as a,_o as b,k as c,g as x};
