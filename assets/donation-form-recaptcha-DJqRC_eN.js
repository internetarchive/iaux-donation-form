import"./modulepreload-polyfill-B5Qt9EMX.js";import{L as c,R as r,b as o,x as n}from"./donation-form-BK_ZWgTA.js";const d=new c;let t;window.grecaptchaLoadedCallback=()=>{setTimeout(()=>{delete window.grecaptchaLoadedCallback},10);const e=document.querySelector("#recaptcha");t=new r({grecaptchaLibrary:window.grecaptcha,siteKey:"6LeTUvYUAAAAAPTvW98MaXyS8c6vxk4-9n8DI1ve"}),t.setup(e,1,"light","image")};d.loadScript({src:"https://www.google.com/recaptcha/api.js?onload=grecaptchaLoadedCallback&render=explicit"});async function i(){const e=document.querySelector("#result");try{const a=await t.execute();e.value=a}catch(a){e.value=`Error: ${a}`}}o(n`
        <h1>Recaptcha Manager</h1>
        <button @click=${i}>Start Recaptcha</button>
        <div id="recaptcha"></div>
        <textarea id="result"></textarea>
      `,document.querySelector("#demo"));
