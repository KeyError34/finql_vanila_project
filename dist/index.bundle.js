(()=>{"use strict";function e(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=document.querySelector(t);i?(i.innerHTML="",e.forEach((function(e){var t=document.createElement("li");t.classList.add("eventCard"),t.innerHTML='\n          <div class="imgEvent">\n          <img src="'.concat(e.image,'" alt="').concat(e.title,'">\n          </div>\n          <div class="contentEventSearch">\n              <h3>').concat(e.title,"</h3>\n        <p>").concat(e.description,"</p>\n        <p>").concat(e.date.toDateString(),"</p>\n        <p>Type: ").concat(e.type,"</p>\n        <p>Category: ").concat(e.category,"</p>\n        ").concat("offline"===e.type?"<p>Distance: ".concat(e.distance," km</p> "):"","\n        <p>Attendees: ").concat(e.attendees,"</p>\n          </div>"),n&&"offline"===e.type&&(t.innerHTML+='<p style="display: none">Additional info: Distance: '.concat(e.distance," km</p>")),i.appendChild(t)}))):console.error('Container with selector "'.concat(t,'" not found.'))}console.log("Это главная страница");var t=[{title:"Day Trading Idea and Strategy",date:new Date(2024,8,22,19),image:"/src/assets/images/main_event_img/DayTradingIdeaandStrategy.png",type:"offline",attendees:15,price:0,category:"Business",distance:5,latitude:40.7488,longitude:-73.9857,city:"New York"},{title:"Let's Talk Networking: JPMorgan Chase in Palo Alto",date:new Date(2024,8,21,17),image:"/src/assets/images/main_event_img/Let'sTalkNetworking.png",type:"offline",attendees:41,price:0,category:"Business",distance:15,latitude:40.7488,longitude:-73.9857,city:"New York"},{title:"Tech Talks & Quiz: Next-Gen Database Solutions for Emerging Use Cases",date:new Date(2024,8,13,18),image:"/src/assets/images/main_event_img/TechTalks&Quiz.webp.png",type:"online",attendees:40,price:0,category:"Technology",distance:0,latitude:37.7749,longitude:-122.4194,city:"San Francisco"},{title:"INFORMS San Francisco Chapter In-Person Event",date:new Date(2024,2,23,17),image:"/src/assets/images/main_event_img/INFORMSSanFranciscoChapter.png",type:"offline",attendees:41,price:0,category:"Health and Wellbeing",distance:50,latitude:37.7749,longitude:-122.4194,city:"San Francisco"},{title:"AI Wednesdays - Meet and Greet!",date:new Date(2024,8,13,18),image:"/src/assets/images/main_event_img/AIWednesdays.png",type:"offline",attendees:29,price:0,category:"Technology",distance:5,latitude:40.7488,longitude:-73.9857,city:"New York"},{title:"ROS By-The-Bay March 2024",date:new Date(2024,8,21,18),image:"/src/assets/images/main_event_img/ROSBy-The-Bay.png",type:"online",attendees:51,price:0,category:"Social Activities",distance:0,latitude:37.7749,longitude:-122.4194,city:"San Francisco"},{title:"Free Christian Singles' Dinner",date:new Date(2024,8,29,18),image:"/src/assets/images/main_event_img/FreeChristian.png",type:"offline",attendees:11,price:0,category:"Hobbies and Passions",distance:10,latitude:40.7488,longitude:-73.9857,city:"New York"},{title:"In-person: Deep Dive into RAG Architectures (Food served)",date:new Date(2024,2,14,11),image:"/src/assets/images/main_event_img/inpersone.png",type:"offline",attendees:16,price:0,category:"Hobbies and Passions",distance:50,latitude:37.7749,longitude:-122.4194,city:"San Francisco"}];document.addEventListener("DOMContentLoaded",(function(){var n,i,a;n=document.querySelector("#menuToggle"),i=document.querySelector(".menuContent"),a=document.querySelector(".selectIcon"),n&&i&&a?n.addEventListener("click",(function(){i.classList.toggle("open")?(n.innerHTML="&times;",n.style.left="0px",n.style.top="0px",a.style.display="block"):(n.innerHTML="☰",n.style.left="5px",n.style.top="15px",a.style.display="none")})):console.error("One or more elements not found for menu toggle setup."),e(t,".meetUpEventDescription");var s=document.getElementById("city-input");document.querySelector(".searchTaunNearBtn").addEventListener("click",(function(){var n=s.value.trim();n?function(n){e(t.filter((function(e){return e.city.toLowerCase()===n.toLowerCase()})),".meetUpEventDescription")}(n):e(t,".meetUpEventDescription")})),e(t.filter((function(e){return e.type.toLowerCase()==="online".toLowerCase()})),".meetUpEventSoonAll")}))})();
//# sourceMappingURL=index.bundle.js.map