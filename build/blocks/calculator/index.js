(()=>{"use strict";var l,e={72:()=>{const l=window.wp.blocks,e=window.wp.i18n,t=window.wp.blockEditor,a=window.wp.components,c=window.wp.element,s=window.ReactJSXRuntime,o=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"custom-blocks/calculator","version":"0.1.0","title":"Debt Calculator","category":"widgets","icon":"calculator","description":"A debt calculator block for calculating loan payments and interest.","keywords":["calculator","math","add","sum"],"textdomain":"custom-blocks","attributes":{"calculatorId":{"type":"string","default":""},"balanceOwed":{"type":"string","default":""},"interestRate":{"type":"string","default":""},"debtType":{"type":"string","default":"credit-card"},"monthlyPayment":{"type":"string","default":""},"monthsToPay":{"type":"string","default":"0"},"totalPrincipal":{"type":"string","default":"0"},"totalInterest":{"type":"string","default":"0"},"userEmail":{"type":"string","default":""},"backgroundColor":{"type":"string"},"textColor":{"type":"string"},"padding":{"type":"number","default":20}},"supports":{"html":false,"align":true},"example":{"attributes":{"calculatorId":"example","balanceOwed":"","interestRate":"","debtType":"credit-card","monthlyPayment":"","monthsToPay":"0","totalPrincipal":"0","totalInterest":"0","userEmail":"","backgroundColor":"","textColor":"","padding":20}},"editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js"}');(0,l.registerBlockType)(o.name,{...o,edit:l=>{const{attributes:{balanceOwed:o,interestRate:r,debtType:i,monthlyPayment:n,backgroundColor:u,textColor:d,padding:m,monthsToPay:b,totalPrincipal:_,totalInterest:p,calculatorId:h,userEmail:k},setAttributes:x,clientId:j}=l;(0,c.useEffect)((()=>{h||x({calculatorId:`calculator-${j}`})}),[j,h,x]);const[y,v]=(0,c.useState)(o),[g,N]=(0,c.useState)(r),[f,C]=(0,c.useState)(i),[w,P]=(0,c.useState)(n),[$,T]=(0,c.useState)(k),O=(0,t.useBlockProps)({style:{backgroundColor:u,color:d,padding:`${m}px`},className:"calculator-block-container"});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.InspectorControls,{children:(0,s.jsxs)(a.PanelBody,{title:(0,e.__)("Block Settings","custom-blocks"),children:[(0,s.jsxs)("div",{className:"custom-blocks-color-settings",children:[(0,s.jsxs)("div",{className:"custom-blocks-color-setting",children:[(0,s.jsx)("h2",{children:(0,e.__)("Background Color","custom-blocks")}),(0,s.jsx)(a.ColorPalette,{value:u,onChange:l=>x({backgroundColor:l})})]}),(0,s.jsxs)("div",{className:"custom-blocks-color-setting",children:[(0,s.jsx)("h2",{children:(0,e.__)("Text Color","custom-blocks")}),(0,s.jsx)(a.ColorPalette,{value:d,onChange:l=>x({textColor:l})})]})]}),(0,s.jsx)(a.RangeControl,{label:(0,e.__)("Padding","custom-blocks"),value:m,onChange:l=>x({padding:l}),min:0,max:100})]})}),(0,s.jsx)("div",{...O,children:(0,s.jsxs)("div",{className:"calculator-block",id:h,children:[(0,s.jsx)("h3",{className:"calculator-block__title",children:(0,e.__)("Debt Calculator","custom-blocks")}),(0,s.jsxs)("div",{className:"calculator-block__container",children:[(0,s.jsx)("form",{className:"calculator-block__form","aria-labelledby":`${h}-title`,onSubmit:l=>{l.preventDefault();const e=parseFloat(y)||0,t=parseFloat(g)||0,a=e/(parseFloat(w)||0),c=e,s=e*t/100;x({balanceOwed:y,interestRate:g,debtType:f,monthlyPayment:w,monthsToPay:Math.round(a).toString(),totalPrincipal:c.toFixed(2),totalInterest:s.toFixed(2),userEmail:$})},children:(0,s.jsxs)("fieldset",{children:[(0,s.jsx)("legend",{className:"screen-reader-text",children:(0,e.__)("Debt Information","custom-blocks")}),(0,s.jsxs)("div",{className:"calculator-block__input-group",children:[(0,s.jsx)("label",{htmlFor:`${h}-balance`,className:"calculator-block__label",children:(0,e.__)("Balance Owed","custom-blocks")}),(0,s.jsx)("input",{id:`${h}-balance`,type:"number",className:"calculator-block__input","data-input":"balance-owed",required:!0,min:"0.01",step:"0.01","aria-required":"true",value:y,onChange:l=>v(l.target.value)})]}),(0,s.jsxs)("div",{className:"calculator-block__input-group",children:[(0,s.jsx)("label",{htmlFor:`${h}-interest`,className:"calculator-block__label",children:(0,e.__)("Estimated Interest Rate (%)","custom-blocks")}),(0,s.jsx)("input",{id:`${h}-interest`,type:"number",className:"calculator-block__input",step:"0.1","data-input":"interest-rate",required:!0,min:"0",max:"100","aria-required":"true",value:g,onChange:l=>N(l.target.value)})]}),(0,s.jsxs)("div",{className:"calculator-block__input-group",children:[(0,s.jsx)("label",{htmlFor:`${h}-debt-type`,className:"calculator-block__label",children:(0,e.__)("Debt Type","custom-blocks")}),(0,s.jsx)("select",{id:`${h}-debt-type`,className:"calculator-block__select","data-input":"debt-type",value:f,onChange:l=>C(l.target.value),children:[{label:"Credit Card",value:"credit-card"},{label:"Mortgage",value:"mortgage"},{label:"Student Loan",value:"student-loan"}].map((l=>(0,s.jsx)("option",{value:l.value,children:l.label},l.value)))})]}),(0,s.jsxs)("div",{className:"calculator-block__input-group",children:[(0,s.jsx)("label",{htmlFor:`${h}-payment`,className:"calculator-block__label",children:(0,e.__)("Monthly Payment","custom-blocks")}),(0,s.jsx)("input",{id:`${h}-payment`,type:"number",className:"calculator-block__input","data-input":"monthly-payment",required:!0,min:"0.01",step:"0.01","aria-required":"true",value:w,onChange:l=>P(l.target.value)})]}),(0,s.jsxs)("div",{className:"calculator-block__input-group",children:[(0,s.jsx)("label",{htmlFor:`${h}-email`,className:"calculator-block__label",children:(0,e.__)("Email Results To (optional)","custom-blocks")}),(0,s.jsx)("input",{id:`${h}-email`,type:"email",className:"calculator-block__input","data-input":"user-email",value:$,onChange:l=>T(l.target.value)})]}),(0,s.jsx)("div",{className:"calculator-block__button-container",children:(0,s.jsx)("button",{className:"calculator-block__button wp-element-button","data-action":"calculate",type:"submit",children:(0,e.__)("Calculate","custom-blocks")})})]})}),(0,s.jsxs)("div",{className:"calculator-block__results",id:`${h}-results`,"aria-live":"polite",role:"region","aria-label":(0,e.__)("Calculation Results","custom-blocks"),children:[(0,s.jsx)("h4",{children:(0,e.__)("Results","custom-blocks")}),(0,s.jsxs)("dl",{className:"calculator-block__result-list",children:[(0,s.jsxs)("div",{className:"calculator-block__result-item",children:[(0,s.jsx)("dt",{children:(0,e.__)("Monthly Payment:","custom-blocks")}),(0,s.jsx)("dd",{"data-result":"monthly-payment",children:n||"$0.00"})]}),(0,s.jsxs)("div",{className:"calculator-block__result-item",children:[(0,s.jsx)("dt",{children:(0,e.__)("Months to Pay Off:","custom-blocks")}),(0,s.jsx)("dd",{"data-result":"months-to-pay",children:b||"0"})]}),(0,s.jsxs)("div",{className:"calculator-block__result-item",children:[(0,s.jsx)("dt",{children:(0,e.__)("Total Principal Paid:","custom-blocks")}),(0,s.jsx)("dd",{"data-result":"total-principal",children:_||"$0.00"})]}),(0,s.jsxs)("div",{className:"calculator-block__result-item",children:[(0,s.jsx)("dt",{children:(0,e.__)("Total Interest Paid:","custom-blocks")}),(0,s.jsx)("dd",{"data-result":"total-interest",children:p||"$0.00"})]})]})]})]})]})})]})},save:({attributes:l})=>{const{backgroundColor:a,textColor:c,padding:o,calculatorId:r,balanceOwed:i,interestRate:n,debtType:u,monthlyPayment:d,monthsToPay:m,totalPrincipal:b,totalInterest:_,userEmail:p}=l,h=t.useBlockProps.save({style:{backgroundColor:a,color:c,padding:`${o}px`},className:"calculator-block-container"});return(0,s.jsx)("div",{...h,children:(0,s.jsxs)("div",{className:"calculator-block",id:r,children:[(0,s.jsx)("h3",{className:"calculator-block__title",children:(0,e.__)("Debt Calculator","custom-blocks")}),(0,s.jsxs)("div",{className:"calculator-block__container",children:[(0,s.jsx)("form",{className:"calculator-block__form","aria-labelledby":`${r}-title`,children:(0,s.jsxs)("fieldset",{children:[(0,s.jsx)("legend",{className:"screen-reader-text",children:(0,e.__)("Debt Information","custom-blocks")}),(0,s.jsxs)("div",{className:"calculator-block__input-group",children:[(0,s.jsx)("label",{htmlFor:`${r}-balance`,className:"calculator-block__label",children:(0,e.__)("Balance Owed","custom-blocks")}),(0,s.jsx)("input",{id:`${r}-balance`,type:"number",className:"calculator-block__input","data-input":"balance-owed",required:!0,min:"0.01",step:"0.01","aria-required":"true",value:i})]}),(0,s.jsxs)("div",{className:"calculator-block__input-group",children:[(0,s.jsx)("label",{htmlFor:`${r}-interest`,className:"calculator-block__label",children:(0,e.__)("Estimated Interest Rate (%)","custom-blocks")}),(0,s.jsx)("input",{id:`${r}-interest`,type:"number",className:"calculator-block__input",step:"0.1","data-input":"interest-rate",required:!0,min:"0",max:"100","aria-required":"true",value:n})]}),(0,s.jsxs)("div",{className:"calculator-block__input-group",children:[(0,s.jsx)("label",{htmlFor:`${r}-debt-type`,className:"calculator-block__label",children:(0,e.__)("Debt Type","custom-blocks")}),(0,s.jsx)("select",{id:`${r}-debt-type`,className:"calculator-block__select","data-input":"debt-type",value:u,children:[{label:"Credit Card",value:"credit-card"},{label:"Mortgage",value:"mortgage"},{label:"Student Loan",value:"student-loan"}].map((l=>(0,s.jsx)("option",{value:l.value,children:l.label},l.value)))})]}),(0,s.jsxs)("div",{className:"calculator-block__input-group",children:[(0,s.jsx)("label",{htmlFor:`${r}-payment`,className:"calculator-block__label",children:(0,e.__)("Monthly Payment","custom-blocks")}),(0,s.jsx)("input",{id:`${r}-payment`,type:"number",className:"calculator-block__input","data-input":"monthly-payment",required:!0,min:"0.01",step:"0.01","aria-required":"true",value:d})]}),(0,s.jsxs)("div",{className:"calculator-block__input-group",children:[(0,s.jsx)("label",{htmlFor:`${r}-email`,className:"calculator-block__label",children:(0,e.__)("Email Results To (optional)","custom-blocks")}),(0,s.jsx)("input",{id:`${r}-email`,type:"email",className:"calculator-block__input","data-input":"user-email",value:p})]}),(0,s.jsx)("div",{className:"calculator-block__button-container",children:(0,s.jsx)("button",{className:"calculator-block__button wp-element-button","data-action":"calculate",type:"submit",children:(0,e.__)("Calculate","custom-blocks")})})]})}),(0,s.jsxs)("div",{className:"calculator-block__results",id:`${r}-results`,"aria-live":"polite",role:"region","aria-label":(0,e.__)("Calculation Results","custom-blocks"),children:[(0,s.jsx)("h4",{children:(0,e.__)("Results","custom-blocks")}),(0,s.jsxs)("dl",{className:"calculator-block__result-list",children:[(0,s.jsxs)("div",{className:"calculator-block__result-item",children:[(0,s.jsx)("dt",{children:(0,e.__)("Monthly Payment:","custom-blocks")}),(0,s.jsx)("dd",{"data-result":"monthly-payment",children:d||"$0.00"})]}),(0,s.jsxs)("div",{className:"calculator-block__result-item",children:[(0,s.jsx)("dt",{children:(0,e.__)("Months to Pay Off:","custom-blocks")}),(0,s.jsx)("dd",{"data-result":"months-to-pay",children:m||"0"})]}),(0,s.jsxs)("div",{className:"calculator-block__result-item",children:[(0,s.jsx)("dt",{children:(0,e.__)("Total Principal Paid:","custom-blocks")}),(0,s.jsx)("dd",{"data-result":"total-principal",children:b||"$0.00"})]}),(0,s.jsxs)("div",{className:"calculator-block__result-item",children:[(0,s.jsx)("dt",{children:(0,e.__)("Total Interest Paid:","custom-blocks")}),(0,s.jsx)("dd",{"data-result":"total-interest",children:_||"$0.00"})]})]})]})]})]})})}})}},t={};function a(l){var c=t[l];if(void 0!==c)return c.exports;var s=t[l]={exports:{}};return e[l](s,s.exports,a),s.exports}a.m=e,l=[],a.O=(e,t,c,s)=>{if(!t){var o=1/0;for(u=0;u<l.length;u++){for(var[t,c,s]=l[u],r=!0,i=0;i<t.length;i++)(!1&s||o>=s)&&Object.keys(a.O).every((l=>a.O[l](t[i])))?t.splice(i--,1):(r=!1,s<o&&(o=s));if(r){l.splice(u--,1);var n=c();void 0!==n&&(e=n)}}return e}s=s||0;for(var u=l.length;u>0&&l[u-1][2]>s;u--)l[u]=l[u-1];l[u]=[t,c,s]},a.o=(l,e)=>Object.prototype.hasOwnProperty.call(l,e),(()=>{var l={477:0,497:0};a.O.j=e=>0===l[e];var e=(e,t)=>{var c,s,[o,r,i]=t,n=0;if(o.some((e=>0!==l[e]))){for(c in r)a.o(r,c)&&(a.m[c]=r[c]);if(i)var u=i(a)}for(e&&e(t);n<o.length;n++)s=o[n],a.o(l,s)&&l[s]&&l[s][0](),l[s]=0;return a.O(u)},t=globalThis.webpackChunkcustom_blocks=globalThis.webpackChunkcustom_blocks||[];t.forEach(e.bind(null,0)),t.push=e.bind(null,t.push.bind(t))})();var c=a.O(void 0,[497],(()=>a(72)));c=a.O(c)})();