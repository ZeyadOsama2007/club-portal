// ===== الصفحات الموجودة في القائمة =====
const PAGES = [
  ["index.html","الرئيسية"],["about.html","عن النادي"],["news.html","الأخبار"],
  ["events.html","الفعاليات"],["members.html","الأعضاء"],["gallery.html","المعرض"],
  ["register.html","التسجيل"],["faq.html","أسئلة شائعة"],["contact.html","تواصل معنا"]
];
const $ = id => document.getElementById(id);

// ===== القائمة والفوتر =====
function renderLayout(){
  const current = location.pathname.split("/").pop() || "index.html";
  const links = PAGES.map(([url,name]) =>
    `<li><a href="${url}" class="${url===current?'active':''}">${name}</a></li>`).join("");
  $("top").innerHTML =
    `<div class="bar"><a class="logo" href="index.html">💻 نادي التكنولوجيا</a>
     <button id="menuBtn" aria-label="القائمة">☰</button>
     <nav><ul id="menu">${links}</ul></nav></div>`;
  $("foot").innerHTML = `© 2026 ${CLUB}`;
  $("menuBtn").onclick = () => $("menu").classList.toggle("open");
}

// ===== عناصر HTML جاهزة =====
const eventCard = e => `<div class="card"><h3>${e.title}</h3>
  <p class="meta">📅 ${e.date} | 📍 ${e.place}</p><p>${e.desc}</p>
  <a href="event-details.html?id=${e.id}">التفاصيل ←</a></div>`;
const newsCard = n => `<div class="card"><h3>${n.title}</h3>
  <p class="meta">${n.date}</p><p>${n.text}</p></div>`;

// ===== التحقق من الفورم =====
function isValid(input){
  const v = input.value.trim();
  if(input.name === "email") return /^\S+@\S+\.\S+$/.test(v);
  if(input.name === "phone") return /^01\d{9}$/.test(v);
  if(input.name === "name")  return v.length >= 3;
  if(input.name === "message") return v.length >= 10;
  return v !== "";
}
function handleForm(formId, messages){
  const form = $(formId);
  form.onsubmit = ev => {
    ev.preventDefault();
    let ok = true;
    form.querySelectorAll("[name]").forEach(inp => {
      const good = isValid(inp);
      inp.classList.toggle("bad", !good);
      inp.nextElementSibling.textContent = good ? "" : messages[inp.name];
      if(!good) ok = false;
    });
    if(ok){ form.reset(); $("success").style.display = "block"; }
    else $("success").style.display = "none";
  };
}

// ===== كل صفحة ليها دالة =====
const pageScripts = {
  home(){
    $("latestNews").innerHTML = NEWS.slice(0,2).map(newsCard).join("");
    $("nextEvents").innerHTML = EVENTS.slice(0,3).map(eventCard).join("");
  },
  news(){ $("newsList").innerHTML = NEWS.map(newsCard).join(""); },
  events(){
    const show = list => $("eventsList").innerHTML =
      list.length ? list.map(eventCard).join("") : "<p>لا توجد نتائج.</p>";
    show(EVENTS);
    $("search").oninput = e => {
      const q = e.target.value.trim();
      show(EVENTS.filter(ev => ev.title.includes(q) || ev.place.includes(q)));
    };
  },
  details(){
    const id = Number(new URLSearchParams(location.search).get("id"));
    const e = EVENTS.find(x => x.id === id);
    $("details").innerHTML = e
      ? `<div class="card"><h2>${e.title}</h2><p class="meta">📅 ${e.date} | 📍 ${e.place}</p>
         <p>${e.desc}</p><br><a class="btn" href="register.html?id=${e.id}">سجّل في الفعالية</a></div>`
      : "<p>الفعالية غير موجودة. <a href='events.html'>رجوع للفعاليات</a></p>";
  },
  members(){
    const photoStyle = "width:90px;height:90px;border-radius:50%;object-fit:cover;display:block;margin:0 auto .8rem;border:3px solid #1d4ed8";
    $("membersList").innerHTML = MEMBERS.map(m => {
      const pic = m.img
        ? `<img src="${m.img}" alt="${m.name}" style="${photoStyle}">`
        : `<div class="avatar">${m.icon}</div>`;
      return `<div class="card" style="text-align:center">${pic}<h3>${m.name}</h3><p class="meta">${m.role}</p></div>`;
    }).join("");
  },
  gallery(){
    const icons = ["🏆","💻","🎤","🤝","📚","🎉","🧠","🚀"];
    $("galleryList").innerHTML = icons.map(i => `<div class="pic">${i}</div>`).join("");
  },
  register(){
    $("event").innerHTML = '<option value="">اختر الفعالية</option>' +
      EVENTS.map(e => `<option value="${e.id}">${e.title}</option>`).join("");
    const id = new URLSearchParams(location.search).get("id");
    if(id) $("event").value = id;
    handleForm("regForm", {name:"الاسم مطلوب (3 حروف على الأقل)", email:"بريد إلكتروني غير صحيح",
      phone:"رقم الموبايل لازم 11 رقم يبدأ بـ 01", event:"اختر فعالية"});
  },
  contact(){
    handleForm("contactForm", {name:"الاسم مطلوب (3 حروف على الأقل)", email:"بريد إلكتروني غير صحيح",
      message:"اكتب رسالتك (10 حروف على الأقل)"});
  }
};

// ===== التشغيل =====
renderLayout();
const run = pageScripts[document.body.dataset.page];
if(run) run();
