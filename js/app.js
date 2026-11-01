// ===== الصفحات الموجودة في القائمة =====
const PAGES = [
  ["index.html","الرئيسية"],["about.html","عن النادي"],["news.html","الأخبار"],
  ["events.html","الفعاليات"],["members.html","الأعضاء"],["gallery.html","المعرض"],
  ["register.html","التسجيل"],["faq.html","أسئلة شائعة"],["contact.html","تواصل معنا"]
];
const MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const COLORS = ["#4f46e5","#7c3aed","#db2777","#ea580c","#059669","#0891b2"];
const $ = id => document.getElementById(id);

// ===== القائمة والفوتر (مكتوبين مرة واحدة ويظهروا في كل الصفحات) =====
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

// ===== عناصر HTML جاهزة (كروت) =====
const eventCard = e => {
  const [y, m, d] = e.date.split("-");
  return `<div class="card event reveal"><div class="ev-top g${e.id % 5}">
    <div class="date"><b>${Number(d)}</b><span>${MONTHS[m-1]}</span></div></div>
    <div class="ev-body"><h3>${e.title}</h3><p class="meta">📍 ${e.place}</p>
    <p>${e.desc}</p><a href="event-details.html?id=${e.id}">التفاصيل ←</a></div></div>`;
};
const newsCard = n => `<div class="card news reveal"><p class="meta">📅 ${n.date}</p>
  <h3>${n.title}</h3><p>${n.text}</p></div>`;
const initials = name => name.trim().split(/\s+/).slice(0,2).map(w => w[0]).join(" ");
// لو العضو ليه img في data.js بتظهر صورته، غير كده بيظهر أفاتار بالحروف
const memberCard = (m, i) => `<div class="card member reveal">${
`<img class="photo" src="${m.img}" alt="${m.name}">`
        : `<div class="ava" style="background:${COLORS[i % COLORS.length]}">${initials(m.name)}</div>`}
  <h3>${m.name}</h3><p class="meta">${m.role}</p></div>`;

// ===== حركات: ظهور الكروت وعدّاد الأرقام =====
function reveal(){
  if(!("IntersectionObserver" in window)){
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("show")); return;
  }
  const io = new IntersectionObserver(list => list.forEach(x => {
    if(x.isIntersecting){ x.target.classList.add("show"); io.unobserve(x.target); }
  }), {threshold:.12});
  document.querySelectorAll(".reveal:not(.show)").forEach(el => io.observe(el));
}
function countUp(){
  document.querySelectorAll("[data-count]").forEach(el => {
    const total = Number(el.dataset.count); let n = 0;
    const step = Math.max(1, Math.ceil(total / 30));
    const timer = setInterval(() => {
      n = Math.min(total, n + step); el.textContent = n;
      if(n >= total) clearInterval(timer);
    }, 40);
  });
}

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
    const hero = document.querySelector(".hero");
    hero.insertAdjacentHTML("beforeend", '<a class="btn ghost" href="about.html">تعرّف علينا</a>');
    const stat = (num, label) => `<div class="stat reveal"><b ${typeof num==="number"?`data-count="${num}"`:""}>${num}</b>${label}</div>`;
    hero.insertAdjacentHTML("afterend", `<section class="stats">${
      stat(MEMBERS.length,"عضو") + stat(EVENTS.length,"فعالية") + stat(NEWS.length,"أخبار") + stat("مجاني","العضوية")}</section>`);
    const feat = (ic, t, p) => `<div class="card reveal"><div class="ic">${ic}</div><h3>${t}</h3><p>${p}</p></div>`;
    $("nextEvents").parentElement.insertAdjacentHTML("beforeend",
      `<h2>✨ ليه تنضم لنا؟</h2><div class="grid features">${
        feat("🚀","تعلّم مهارات عملية","ورش برمجة وتصميم يقدمها زملاؤك.") +
        feat("🤝","اتعرف على زمايل","مجتمع من الطلاب بيشاركوا نفس الشغف.") +
        feat("🏆","مسابقات وجوايز","نتحدى بعض ونمثل الجامعة برا.")}</div>
       <section class="cta reveal"><h2>جاهز تبدأ رحلتك؟</h2><p>سجّل في أقرب فعالية دلوقتي.</p>
       <a class="btn" href="register.html" style="background:#fff;color:#4f46e5">سجّل الآن</a></section>`);
    countUp();
  },
  news(){ $("newsList").innerHTML = NEWS.map(newsCard).join(""); },
  events(){
    const show = list => {
      $("eventsList").innerHTML = list.length ? list.map(eventCard).join("") : "<p>لا توجد نتائج.</p>";
      reveal();
    };
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
      ? `<div class="card event"><div class="ev-top g${e.id % 5}"></div><div class="ev-body" style="padding-top:1.5rem">
         <h2>${e.title}</h2><p class="meta">📅 ${e.date} | 📍 ${e.place}</p>
         <p>${e.desc}</p><br><a class="btn" href="register.html?id=${e.id}">سجّل في الفعالية</a></div></div>`
      : "<p>الفعالية غير موجودة. <a href='events.html'>رجوع للفعاليات</a></p>";
  },
  members(){ $("membersList").innerHTML = MEMBERS.map(memberCard).join(""); },
  gallery(){
    // لو عملت GALLERY = ["images/1.jpg", ...] في data.js هتظهر صورك الحقيقية
    const items = typeof GALLERY !== "undefined"
      ? GALLERY.map(src => `<img class="pic reveal" src="${src}" alt="صورة من فعاليات النادي">`)
      : ["🏆","💻","🎤","🤝","📚","🎉","🧠","🚀"].map((i,k) => `<div class="pic reveal g${k % 5}">${i}</div>`);
    $("galleryList").innerHTML = items.join("");
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
reveal();
