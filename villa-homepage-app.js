// ===== Homepage de utilitários — menu, dropdown e login root (hash) =====

const qs = (s,root=document)=> root.querySelector(s);

// Drawer (hambúrguer)
const hamburger = qs('#hamburger');
const drawer    = qs('#drawer');
const drawerClose = qs('#drawerClose');
const scrim     = qs('#scrim');

function openDrawer(){ drawer.classList.add('open'); scrim.classList.add('show'); hamburger.setAttribute('aria-expanded','true'); drawer.setAttribute('aria-hidden','false'); }
function closeDrawer(){ drawer.classList.remove('open'); scrim.classList.remove('show'); hamburger.setAttribute('aria-expanded','false'); drawer.setAttribute('aria-hidden','true'); }

hamburger.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
scrim.addEventListener('click', closeDrawer);
window.addEventListener('keydown', (e)=>{ if (e.key==='Escape') closeDrawer(); });

// Dropdown “Root”
const rootBtn = qs('#rootBtn');
const dropdown = rootBtn?.parentElement;
rootBtn?.addEventListener('click', ()=>{
  const open = dropdown.classList.toggle('open');
  rootBtn.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (e)=>{
  if (!dropdown.contains(e.target) && e.target !== rootBtn){
    dropdown.classList.remove('open');
    rootBtn.setAttribute('aria-expanded','false');
  }
});

// Modal de Login
const loginOpen  = qs('#loginOpen');
const loginModal = qs('#loginModal');
const loginClose = qs('#loginClose');
const loginForm  = qs('#loginForm');
const userField  = qs('#userField');
const passField  = qs('#passField');
const loginMsg   = qs('#loginMsg');

function openLogin(){
  loginModal.classList.add('show');
  loginModal.setAttribute('aria-hidden','false');
  userField.focus();
}
function closeLogin(){
  loginModal.classList.remove('show');
  loginModal.setAttribute('aria-hidden','true');
  loginMsg.textContent = '';
  loginForm.reset();
}
loginOpen.addEventListener('click', openLogin);
loginClose.addEventListener('click', closeLogin);
loginModal.addEventListener('click', (e)=>{ if (e.target===loginModal) closeLogin(); });
window.addEventListener('keydown', (e)=>{ if (e.key==='Escape' && loginModal.classList.contains('show')) closeLogin(); });

// ===== Validação com hash (sem expor texto puro) =====
// Salt fixo e hashes pré-computados (SHA-256 do salt + valor)
const SALT = 'villa-2025-09';
// username: MATHEUS
const USER_HASH_HEX = 'edae7d25196badfe2562198f7f3173abb74f67e83895a696a5fff907e67a8e8e';
// password: @MatheusSM18"
const PASS_HASH_HEX = 'a70e3ab14f8f8645cac864137de2cc80b8c6e68bf2f633d70c2cb67c2a82eb37';

async function sha256HexWithSalt(value){
  const enc = new TextEncoder();
  const buf = enc.encode(SALT + value);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('');
}

loginForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  loginMsg.textContent = '';
  const u = userField.value.trim();
  const p = passField.value;

  try{
    const [uh, ph] = await Promise.all([sha256HexWithSalt(u), sha256HexWithSalt(p)]);
    if (uh === USER_HASH_HEX && ph === PASS_HASH_HEX){
      loginMsg.style.color = '#16a34a';
      loginMsg.textContent = 'Acesso concedido.';
      setTimeout(()=>{ closeLogin(); alert('Login efetuado.'); }, 400);
    }else{
      loginMsg.style.color = '#8B0000';
      loginMsg.textContent = 'Usuário ou senha inválidos.';
    }
  }catch(err){
    loginMsg.style.color = '#8B0000';
    loginMsg.textContent = 'Erro ao validar.';
    console.error(err);
  }
});
