document.addEventListener('DOMContentLoaded',()=>{
  const navToggle=document.getElementById('navToggle');
  const menu=document.getElementById('menu');
  const year=document.getElementById('year');
  if(year){year.textContent=new Date().getFullYear();}
  if(navToggle&&menu){
    navToggle.addEventListener('click',()=>{
      const opened=getComputedStyle(menu).display!=='none';
      menu.style.display=opened?'none':'flex';
    });
    // cerrar al navegar (móvil)
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      if(window.innerWidth<920){menu.style.display='none';}
    }));
  }

  // Scrollspy básico
  const sections=['features','how','requirements','faq','privacy','support'];
  const links=sections.map(id=>({id,el:document.querySelector(`nav a[href="#${id}"]`),sec:document.getElementById(id)}));

  function onScroll(){
    const y=window.scrollY + 120; // offset header
    let current=null;
    for(const item of links){
      if(item.sec && item.sec.offsetTop<=y){current=item;}
    }
    links.forEach(item=>{
      if(item.el){item.el.classList.toggle('active', current && item.id===current.id);}    
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
});
