// ParSU Sagñay — shared site JS (multi-page)
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const header=$('#siteHeader'), progress=$('#scrollProgress'), toTop=$('#toTop');
addEventListener('scroll',()=>{const y=scrollY; if(header)header.classList.toggle('scrolled',y>24);
  const h=document.documentElement.scrollHeight-innerHeight; if(progress)progress.style.width=(h>0?y/h*100:0)+'%';
  if(toTop)toTop.classList.toggle('show',y>650);},{passive:true});
if(toTop)toTop.onclick=()=>scrollTo({top:0,behavior:'smooth'});
const menuBtn=$('#menuBtn'), navLinks=$('#navLinks');
// Shared Research link: keeps the publication archive reachable from every site page.
if(navLinks&&!navLinks.querySelector('a[href="published-papers.html"]')){
  const researchLink=document.createElement('a');
  researchLink.href='published-papers.html';
  researchLink.textContent='Research';
  const before=navLinks.querySelector('a[href="org-chart.html"]');
  navLinks.insertBefore(researchLink,before||null);
}
if(menuBtn&&navLinks){menuBtn.onclick=()=>{const o=navLinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',o);menuBtn.textContent=o?'✕':'☰';};
navLinks.addEventListener('click',e=>{if(e.target.tagName==='A'){navLinks.classList.remove('open');menuBtn.textContent='☰';}});}
// Counters (Home stats)
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);
  const end=+e.target.dataset.count,t0=performance.now(),dur=1300;
  (function tick(t){const p=Math.min((t-t0)/dur,1),ease=1-Math.pow(1-p,3);e.target.textContent=Math.round(end*ease).toLocaleString();if(p<1)requestAnimationFrame(tick);})(t0);
}),{threshold:.6});
$$('[data-count]').forEach(el=>cio.observe(el));
// Org-chart personnel search/filter
(function(){const search=$('#facultySearch');if(!search)return;let f='all';
  function apply(){const q=search.value.trim().toLowerCase();let vis=0;
    $$('.person-card').forEach(c=>{const ok=(f==='all'||(c.dataset.category||'').includes(f))&&(!q||(c.dataset.search||'').includes(q)||c.textContent.toLowerCase().includes(q));c.style.display=ok?'':'none';if(ok)vis++;});
    const empty=$('#facultyEmpty');if(empty)empty.style.display=vis?'none':'block';}
  search.addEventListener('input',apply);
  $$('.filter-chip').forEach(ch=>ch.onclick=()=>{$$('.filter-chip').forEach(c=>c.classList.remove('active'));ch.classList.add('active');f=ch.dataset.filter;apply();});
})();
// Gallery lightbox
(function(){const dlg=$('#lightbox');if(!dlg)return;const img=$('#lightboxImg'),cap=$('#lightboxCap');
  $$('.g-item').forEach(b=>b.addEventListener('click',()=>{const i=b.querySelector('img');img.src=i.src;img.alt=i.alt;cap.textContent=b.dataset.caption||i.alt;dlg.showModal();}));
  $('#lightboxClose')?.addEventListener('click',()=>dlg.close());
  dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});
})();
const yr=$('#year'); if(yr)yr.textContent=new Date().getFullYear();

// Congratulatory carousel — slow (6.5s), pauses on hover/focus, manual controls, off if reduced-motion
(function(){const track=$('#carouselTrack');if(!track)return;const slides=$$('.slide'),dots=$$('.dots button');let i=0,timer=null;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function go(n){i=(n+slides.length)%slides.length;track.style.transform=`translateX(-${i*100}%)`;dots.forEach((d,k)=>d.classList.toggle('active',k===i));}
 function start(){if(reduce||timer)return;timer=setInterval(()=>go(i+1),6500);}
 function stop(){clearInterval(timer);timer=null;}
 $('#carouselPrev')?.addEventListener('click',()=>{go(i-1);stop();start();});
 $('#carouselNext')?.addEventListener('click',()=>{go(i+1);stop();start();});
 dots.forEach((d,k)=>d.addEventListener('click',()=>{go(k);stop();start();}));
 const card=$('.congrats-card');card?.addEventListener('mouseenter',stop);card?.addEventListener('mouseleave',start);
 card?.addEventListener('focusin',stop);card?.addEventListener('focusout',start);
 go(0);start();
})();

// V7 motion engine — BrewedOps-style patterns matched per page (standard top-nav site)
(function(){
  const body=document.body;
  const assign=(sel,type,rotate=false)=>$$(sel).forEach((el,k)=>{
    el.dataset.motion=type; el.style.setProperty('--d',((k%4)*0.08)+'s');
    if(rotate)el.style.setProperty('--r',((k%2?1:-1)*(1.2+(k%3)*0.5))+'deg');
  });
  if(body.classList.contains('page-programs')) assign('main .card','fan',true);
  else if(body.classList.contains('page-campus-life')) assign('main .g-item','collage',true);
  else if(body.classList.contains('page-org-chart')){assign('main .org-node','pop');assign('main .org-connector','line');assign('main .person-card','up');}
  else if(body.classList.contains('page-about')){assign('main .vm-card','left');assign('main .cv-card','up');assign('main .card','right');}
  else if(body.classList.contains('page-contact')){assign('main .fb-card','left');assign('main .qr-card','pop');assign('main .card','up');}
  else if(body.classList.contains('page-admissions')) assign('main .step, main .card, main .notice','up');
  else if(body.classList.contains('page-news')||body.classList.contains('page-news-article')) assign('main .news-card, main .card','up');
  else {assign('main .card, main .stat-card','up');assign('main .congrats-card','pop');}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.1,rootMargin:'0px 0px -5% 0px'});
  $$('[data-motion]').forEach(el=>io.observe(el));
})();
