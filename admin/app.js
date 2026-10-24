const root = document.getElementById('app');
const config = window.ADMIN_CONFIG || {};
const redirectUrl = config.redirectUrl || window.location.href.split('#')[0];
const iconPaths = {
  mark:'<path d="M12 2.5 20 6v5.6c0 5.1-3.2 8.2-8 9.9-4.8-1.7-8-4.8-8-9.9V6l8-3.5Z"/><path d="M5.5 12.4c2.2-1.4 4.1-1.4 6.3 0s4.1 1.4 6.7-.2M7 15.3c1.7-1 3.3-1 5 0s3.3 1 5.2 0"/>',
  grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',
  check:'<path d="m5 12 4.2 4.2L19.5 6"/>',
  file:'<path d="M13 3.5H6.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V10Z"/><path d="M13 3.5V10h6.5M8 14h8M8 17h6"/>',
  users:'<path d="M16 20v-1.7a3.3 3.3 0 0 0-3.3-3.3H7.3A3.3 3.3 0 0 0 4 18.3V20"/><circle cx="10" cy="7.3" r="3.3"/><path d="M20 20v-1.7a3.3 3.3 0 0 0-2.5-3.2M15.9 4.2a3.3 3.3 0 0 1 0 6.3"/>',
  history:'<path d="M3.5 12a8.5 8.5 0 1 0 2.4-5.9L3.5 8.5"/><path d="M3.5 3.7v4.8h4.8M12 7.2V12l3.1 1.8"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  bell:'<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  logout:'<path d="M10 17l5-5-5-5M15 12H3M21 4v16"/>',
  search:'<circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4.2 4.2"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  shield:'<path d="M12 2.5 20 6v5.6c0 5.1-3.2 8.2-8 9.9-4.8-1.7-8-4.8-8-9.9V6l8-3.5Z"/><path d="m8.7 12 2.1 2.1 4.6-4.6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  person:'<circle cx="12" cy="8" r="3.5"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  edit:'<path d="m14 5 5 5M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z"/>',
  alert:'<path d="M10.3 4.4 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>'
};
const icon=(name)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]||iconPaths.file}</svg>`;
const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state={client:null,session:null,user:null,profile:null,page:'overview',records:[],content:[],audit:[],profiles:[],modal:null,editing:null,flashTimer:null};
let passwordRecoveryPending=/type=recovery/i.test(window.location.hash+window.location.search);

function flash(message,type='success'){
  document.querySelector('.flash')?.remove();
  const el=document.createElement('div');el.className=`flash ${type}`;el.textContent=message;document.body.append(el);
  clearTimeout(state.flashTimer);state.flashTimer=setTimeout(()=>el.remove(),4200);
}
function roleTitle(){return state.profile?.role==='super_admin'?'Super Admin':'Admin';}
function badge(status){const map={draft:'Draft',pending_review:'Pending review',approved:'Approved',rejected:'Returned'};return `<span class="badge ${esc(status)}">${esc(map[status]||status)}</span>`;}
function initials(value=''){return String(value).split(/\s+/).slice(0,2).map(s=>s[0]||'').join('').toUpperCase()||'U';}
function slugify(value=''){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90);}
function isSuper(){return state.profile?.role==='super_admin';}
function navItems(){
  const items=[['overview','Overview','grid'],['approvals',isSuper()?'Approval queue':'My submissions','check'],['content','Website content','file'],['personnel','Personnel records','users']];
  if(isSuper())items.push(['activity','Edit history','history'],['accounts','Admin accounts','shield']);
  return items;
}
function showLoading(message='Loading your secure workspace…'){
  root.innerHTML=`<div class="boot">${esc(message)}</div>`;
}
function renderLogin(message='',mode='login'){
  const isReset=mode==='reset',isSet=mode==='set-password';
  root.innerHTML=`<div class="login-wrap"><section class="login-side"><div class="brand"><div class="brand-mark">${icon('mark')}</div><div><div class="brand-name">ParSU SAGÑAY</div><span class="brand-sub">CAMPUS ADMINISTRATION</span></div></div><div class="hero-copy"><div class="hero-kicker">Temporary campus website</div><h1>One secure place<br>to manage the work.</h1><p>Authorized staff can prepare website updates and personnel drafts. A Super Admin reviews public changes and can inspect the audit history.</p><div class="hero-chips"><span class="hero-chip">Invite-only accounts</span><span class="hero-chip">Super Admin approval</span><span class="hero-chip">Database audit trail</span></div></div><footer>Partido State University · Sagñay Campus<br>Temporary admin portal. Access is limited to invited accounts.</footer></section><section class="login-panel"><div class="login-card"><div class="eyebrow">${isReset?'Account recovery':isSet?'Set password':'Secure sign-in'}</div><h2>${isReset?'Reset your password':isSet?'Choose a password':'Welcome back'}</h2><p class="login-hint">${isReset?'We’ll send a password reset link to your cleared email.':isSet?'Choose a strong password to finish setting up your account.':'Sign in with the email address invited by your Super Admin.'}</p><div class="login-message" id="loginMessage">${esc(message)}</div>${isReset?`<form id="resetForm"><div class="field"><label for="resetEmail">Email address</label><input id="resetEmail" name="email" type="email" autocomplete="email" required></div><button class="btn primary wide" type="submit">Send reset link</button><button class="link-btn" type="button" data-action="show-login">Back to sign in</button></form>`:isSet?`<form id="setPasswordForm"><div class="field"><label for="newPassword">New password</label><input id="newPassword" name="password" type="password" minlength="10" autocomplete="new-password" required></div><div class="field"><label for="confirmPassword">Confirm password</label><input id="confirmPassword" name="confirm" type="password" minlength="10" autocomplete="new-password" required></div><button class="btn primary wide" type="submit">Set password</button><button class="link-btn" type="button" data-action="back-to-dashboard">Back to dashboard</button></form>`:`<form id="loginForm"><div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="username" required></div><div class="field"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required></div><div class="login-actions"><span style="font-size:9px;color:#8390a4">Access is invite-only</span><button class="link-btn" type="button" data-action="show-reset">Forgot password?</button></div><button class="btn primary wide" type="submit">Sign in</button></form>`}<div class="login-foot">If you are not cleared to use this portal, contact the Super Admin. Never share your password or sign-in link.</div></div></section></div>`;
}
async function ensureClient(){
  if(!config.supabaseUrl||!config.publishableKey||config.supabaseUrl.includes('YOUR_')||config.publishableKey.includes('YOUR_'))throw new Error('Supabase configuration is missing. Check config.js.');
  const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
  state.client=createClient(config.supabaseUrl,config.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
}
async function loadProfile(user){
  showLoading('Checking account clearance…');
  const {data,error}=await state.client.from('profiles').select('user_id,display_name,email,role,active').eq('user_id',user.id).maybeSingle();
  if(error||!data||!data.active||!['admin','super_admin'].includes(data.role)){
    await state.client.auth.signOut();state.profile=null;state.session=null;
    renderLogin('This email is not cleared for the admin portal. Ask the Super Admin to invite or reactivate it.');return;
  }
  state.user=user;state.profile=data;state.page='overview';
  await reloadData();renderPortal();
}
async function reloadData(){
  const [recordRes,contentRes]=await Promise.all([
    state.client.from('personnel_records').select('*').order('updated_at',{ascending:false}),
    state.client.from('content_items').select('*').order('updated_at',{ascending:false})
  ]);
  if(recordRes.error)throw recordRes.error;if(contentRes.error)throw contentRes.error;
  state.records=recordRes.data||[];state.content=contentRes.data||[];
  if(isSuper()){
    const [auditRes,profilesRes]=await Promise.all([
      state.client.from('audit_events').select('*').order('occurred_at',{ascending:false}).limit(200),
      state.client.from('profiles').select('user_id,display_name,email,role,active,created_at').order('created_at',{ascending:true})
    ]);
    if(auditRes.error)throw auditRes.error;if(profilesRes.error)throw profilesRes.error;
    state.audit=auditRes.data||[];state.profiles=profilesRes.data||[];
  }else{state.audit=[];state.profiles=[];}
}
function pageHead(kicker,title,subtitle,actions=''){
  return `<div class="page-head"><div><div class="eyebrow">${esc(kicker)}</div><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div><div class="actions">${actions}</div></div>`;
}
function metric(label,value,note,ico,cls=''){
  return `<div class="metric"><div class="metric-top"><span>${esc(label)}</span><span class="metric-icon ${cls}">${icon(ico)}</span></div><div class="metric-value">${esc(value)}</div><div class="metric-note">${esc(note)}</div></div>`;
}
function cardHeader(title,desc,action=''){
  return `<div class="card-head"><div><div class="card-title">${esc(title)}</div><div class="card-sub">${esc(desc)}</div></div>${action}</div>`;
}
function labelForUser(id){
  if(id===state.user?.id)return state.profile?.display_name||state.user.email;
  const p=state.profiles.find(x=>x.user_id===id);return p?.display_name||`Account ${String(id||'').slice(0,8)}`;
}
function contentTitle(row){return row.title||row.slug||row.id;}
function pendingRows(){
  const items=[...state.content.filter(x=>x.status==='pending_review').map(x=>({...x,kind:'Website content',display:contentTitle(x)})),...state.records.filter(x=>x.status==='pending_review').map(x=>({...x,kind:'Personnel record',display:x.full_name}))];
  if(!items.length)return `<div class="empty"><b>No changes waiting</b>Submitted drafts will appear here for Super Admin review.</div>`;
  return items.map(x=>`<div class="review-row"><div class="review-mark">${icon(x.kind==='Personnel record'?'users':'file')}</div><div class="review-copy"><div class="review-title">${esc(x.display)}</div><div class="review-meta">${esc(x.kind)} · submitted by ${esc(labelForUser(x.created_by))} · ${new Date(x.updated_at).toLocaleString()}</div></div><div class="row-actions"><button class="btn small approve" data-action="approve" data-kind="${x.kind==='Personnel record'?'personnel':'content'}" data-id="${x.id}">Approve</button><button class="btn small return" data-action="return" data-kind="${x.kind==='Personnel record'?'personnel':'content'}" data-id="${x.id}">Return</button></div></div>`).join('');
}
function activityRows(items){
  if(!items.length)return `<div class="empty"><b>No recorded edits yet</b>Database-triggered events will appear after staff make changes.</div>`;
  return `<div class="timeline">${items.map(e=>{const row=e.after_data||e.before_data||{};const name=row.title||row.full_name||row.display_name||e.record_id;return `<div class="timeline-item"><div class="timeline-ico">${icon(e.table_name==='personnel_records'?'users':e.table_name==='profiles'?'shield':'edit')}</div><div><div class="timeline-copy"><b>${esc(labelForUser(e.actor_id))}</b> ${esc(e.action.toLowerCase())} ${esc(e.table_name.replaceAll('_',' '))} · <b>${esc(name)}</b></div><div class="time">${new Date(e.occurred_at).toLocaleString()}</div></div></div>`;}).join('')}</div>`;
}
function overviewPage(){
  const pending=state.content.filter(x=>x.status==='pending_review').length+state.records.filter(x=>x.status==='pending_review').length;
  const draftCount=state.content.filter(x=>['draft','rejected'].includes(x.status)).length+state.records.filter(x=>['draft','rejected'].includes(x.status)).length;
  const actions=isSuper()?`<button class="btn" data-page="activity">${icon('history')}Edit history</button><button class="btn primary" data-page="approvals">${icon('check')}Review queue</button>`:`<button class="btn" data-action="new-personnel">${icon('plus')}Personnel draft</button><button class="btn primary" data-action="new-content">${icon('plus')}Website draft</button>`;
  const activityTitle=isSuper()?'Recent edit history':'My submissions';
  const activityContent=isSuper()?activityRows(state.audit.slice(0,4)):mySubmissions();
  return `${pageHead('Campus administration',`Welcome, ${state.profile.display_name||roleTitle()}`,'Draft updates, review personnel changes, and monitor the publication process.',actions)}
    <div class="callout">${icon('shield')}<span><strong>Invite-only access is active.</strong> Admins can prepare drafts; public changes require Super Admin approval. Personnel records stay private unless separately published.</span></div>
    <div class="metrics">${metric('Awaiting review',pending,'Content and personnel drafts','check','gold')}${metric('Personnel records',state.records.length,'Private staff workspace','users','teal')}${metric('Website drafts',draftCount,'News, FAQs, announcements','file')}${metric(isSuper()?'Audit events':'Your role',isSuper()?state.audit.length:'Admin','Database-recorded changes',isSuper()?'history':'person','gold')}</div>
    <div class="grid-2"><section class="card">${cardHeader(isSuper()?'Approval queue':'My recent drafts',isSuper()?'Review before changes reach the public site.':'Submit drafts for Super Admin approval.',`<button class="link-btn" data-page="${isSuper()?'approvals':'content'}">View all →</button>`)}${isSuper()?pendingRows():mySubmissions()}</section><section class="card">${cardHeader(activityTitle,isSuper()?'Only Super Admins can view the full audit history.':'Status of work you submitted.','')}${activityContent}</section></div>`;
}
function mySubmissions(){
  const rows=[...state.content.filter(x=>x.created_by===state.user.id).map(x=>({id:x.id,title:x.title,kind:x.content_type,updated:x.updated_at,status:x.status})),...state.records.filter(x=>x.created_by===state.user.id).map(x=>({id:x.id,title:x.full_name,kind:'Personnel',updated:x.updated_at,status:x.status}))].slice(0,5);
  if(!rows.length)return `<div class="empty"><b>No drafts yet</b>Create a draft to begin.</div>`;
  return `<div class="timeline">${rows.map(x=>`<div class="timeline-item"><div class="timeline-ico">${icon(x.kind==='Personnel'?'users':'file')}</div><div><div class="timeline-copy"><b>${esc(x.title)}</b> · ${badge(x.status)}</div><div class="time">Updated ${new Date(x.updated).toLocaleString()}</div></div></div>`).join('')}</div>`;
}
function approvalPage(){
  if(isSuper())return `${pageHead('Review workflow','Approval queue','Approve or return public-facing changes submitted by Admins.',`<button class="btn" data-page="activity">${icon('history')}Audit history</button>`)}<section class="card">${cardHeader('Items awaiting approval','Approval publishes website-content items; personnel records remain private unless separately exposed.','')}${pendingRows()}</section>`;
  return `${pageHead('Review workflow','My submissions','Track drafts and submit completed changes for Super Admin approval.',`<button class="btn" data-action="new-personnel">${icon('plus')}Personnel draft</button><button class="btn primary" data-action="new-content">${icon('plus')}Website draft</button>`)}<section class="card">${cardHeader('My drafts and submissions','You can edit drafts and returned items; pending items are locked for review.','')}${mySubmissionTable()}</section>`;
}
function mySubmissionTable(){
  const ownContent=state.content.filter(x=>x.created_by===state.user.id),ownRecords=state.records.filter(x=>x.created_by===state.user.id);
  const rows=[...ownContent.map(x=>({id:x.id,title:x.title,type:x.content_type,status:x.status,table:'content'})),...ownRecords.map(x=>({id:x.id,title:x.full_name,type:'Personnel',status:x.status,table:'personnel'}))];
  if(!rows.length)return `<div class="empty"><b>No submissions yet</b>Create a draft, then submit it for review.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Item</th><th>Type</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(x=>`<tr><td><div class="item-title">${esc(x.title)}</div><div class="item-meta">${esc(x.id)}</div></td><td>${esc(x.type)}</td><td>${badge(x.status)}</td><td><div class="row-actions">${['draft','rejected'].includes(x.status)?`<button class="btn small" data-action="edit" data-kind="${x.table}" data-id="${x.id}">${icon('edit')}Edit</button><button class="btn small primary" data-action="submit" data-kind="${x.table}" data-id="${x.id}">Submit</button>`:''}</div></td></tr>`).join('')}</tbody></table></div>`;
}
function contentPage(){
  const rows=state.content.map(x=>`<tr><td><div class="item-title">${esc(x.title)}</div><div class="item-meta">/${esc(x.slug)}</div></td><td>${esc(x.content_type)}</td><td>${badge(x.status)}</td><td>${esc(labelForUser(x.created_by))}</td><td>${new Date(x.updated_at).toLocaleDateString()}</td><td><div class="row-actions">${canEdit(x)?`<button class="btn small" data-action="edit" data-kind="content" data-id="${x.id}">${icon('edit')}Edit</button>`:''}${state.profile.role==='admin'&&x.created_by===state.user.id&&['draft','rejected'].includes(x.status)?`<button class="btn small primary" data-action="submit" data-kind="content" data-id="${x.id}">Submit</button>`:''}</div></td></tr>`).join('');
  return `${pageHead('Public website','Website content','Create drafts for news, FAQs, and announcements. Only approved content is public.',`<button class="btn primary" data-action="new-content">${icon('plus')}New content draft</button>`)}<div class="tool-row"><div class="search">${icon('search')}<input id="contentSearch" placeholder="Search content" aria-label="Search content"></div><select class="select" id="contentStatus"><option value="all">All statuses</option><option value="draft">Draft</option><option value="pending_review">Pending review</option><option value="approved">Approved</option><option value="rejected">Returned</option></select></div><section class="card"><div class="table-wrap"><table><thead><tr><th>Content</th><th>Type</th><th>Status</th><th>Created by</th><th>Updated</th><th></th></tr></thead><tbody id="contentRows">${rows||''}</tbody></table>${rows?'':`<div class="empty"><b>No website entries yet</b>Create the first draft to get started.</div>`}</div></section>`;
}
function personnelPage(){
  const rows=state.records.map(x=>`<tr><td><div class="item-title">${esc(x.full_name)}</div><div class="item-meta">ID ${esc(x.id.slice(0,8))}</div></td><td>${esc(x.position_title||'—')}</td><td>${esc(x.unit||'—')}</td><td>${badge(x.status)}</td><td>${esc(labelForUser(x.created_by))}</td><td>${new Date(x.updated_at).toLocaleDateString()}</td><td><div class="row-actions">${canEdit({...x,table:'personnel'})?`<button class="btn small" data-action="edit" data-kind="personnel" data-id="${x.id}">${icon('edit')}Edit</button>`:''}${state.profile.role==='admin'&&x.created_by===state.user.id&&['draft','rejected'].includes(x.status)?`<button class="btn small primary" data-action="submit" data-kind="personnel" data-id="${x.id}">Submit</button>`:''}</div></td></tr>`).join('');
  return `${pageHead('Private staff workspace','Personnel records','Drafts are visible only to authorized admins. Super Admin approval is required for changes.',`<button class="btn primary" data-action="new-personnel">${icon('plus')}Add personnel draft</button>`)}<div class="callout">${icon('alert')}<span><strong>Private by default.</strong> This table is not exposed to anonymous visitors. Only publish a separately reviewed subset if the campus approves it.</span></div><section class="card"><div class="table-wrap"><table><thead><tr><th>Name</th><th>Position</th><th>Unit</th><th>Status</th><th>Created by</th><th>Updated</th><th></th></tr></thead><tbody>${rows}</tbody></table>${rows?'':`<div class="empty"><b>No personnel records yet</b>Add a verified record as a draft.</div>`}</div></section>`;
}
function activityPage(){
  const rows=state.audit.map(e=>{
    const after=e.after_data||{},before=e.before_data||{},name=after.title||after.full_name||after.display_name||before.title||before.full_name||before.display_name||e.record_id||'Record';
    const changed=[];
    const keys=new Set([...Object.keys(before),...Object.keys(after)]);
    keys.forEach(k=>{if(['updated_at','created_at'].includes(k))return;if(JSON.stringify(before[k])!==JSON.stringify(after[k]))changed.push(k);});
    const summary=changed.length?changed.slice(0,4).join(', '):'Record event';
    return `<tr><td><div class="item-title">${esc(labelForUser(e.actor_id))}</div><div class="item-meta">${esc(e.actor_role||'staff')}</div></td><td><div class="item-title">${esc(e.action)}</div><div class="item-meta">${esc(e.table_name.replaceAll('_',' '))}</div></td><td><div class="item-title">${esc(name)}</div><div class="item-meta">Fields: ${esc(summary)}</div></td><td>${new Date(e.occurred_at).toLocaleString()}</td><td><button class="btn small" data-action="audit-detail" data-id="${e.id}">Details</button></td></tr>`;
  }).join('');
  return `${pageHead('Super Admin oversight','Edit history','Database-triggered history of changes, with actor, table, record, and time.',`<button class="btn" data-action="export-audit">${icon('history')}Export CSV</button>`)}<div class="callout">${icon('shield')}<span><strong>Restricted view.</strong> Only a Super Admin can query the audit table. Audit rows are written by database triggers and cannot be changed by portal users.</span></div><section class="card"><div class="table-wrap"><table><thead><tr><th>Actor</th><th>Action</th><th>Record / fields</th><th>Time</th><th></th></tr></thead><tbody>${rows}</tbody></table>${rows?'':`<div class="empty"><b>No edit events yet</b>Admin changes will be recorded after they occur.</div>`}</div></section>`;
}
function accountsPage(){
  const rows=state.profiles.map(p=>`<tr><td><div class="item-title">${esc(p.display_name)}</div><div class="item-meta">${esc(p.email||'Email not set')}</div></td><td><span class="badge ${p.role==='super_admin'?'pending_review':'draft'}">${p.role==='super_admin'?'Super Admin':'Admin'}</span></td><td><span class="badge ${p.active?'active':'inactive'}">${p.active?'Active':'Disabled'}</span></td><td>${p.user_id===state.user.id?'<span class="item-meta">Current account</span>':p.role==='admin'?`<button class="btn small ${p.active?'danger':'approve'}" data-action="${p.active?'deactivate':'activate'}" data-id="${p.user_id}">${p.active?'Disable':'Re-enable'}</button>`:'<span class="item-meta">Protected</span>'}</td></tr>`).join('');
  return `${pageHead('Super Admin controls','Admin accounts','Invite approved email accounts and disable access when staff roles change.',`<button class="btn primary" data-action="invite">${icon('plus')}Invite Admin</button>`)}<div class="callout">${icon('alert')}<span><strong>Email delivery note.</strong> Supabase’s default mailer only delivers to project organization members. Configure custom SMTP before inviting other campus email addresses.</span></div><section class="card">${cardHeader('Portal accounts','Only Super Admin can invite, disable, or reactivate Admin accounts.','')}<div class="table-wrap"><table><thead><tr><th>Account</th><th>Role</th><th>Access</th><th></th></tr></thead><tbody>${rows}</tbody></table>${rows?'':`<div class="empty"><b>No accounts yet</b>The initial Super Admin profile must be provisioned first.</div>`}</div></section>`;
}
function canEdit(item){return isSuper()||((item.created_by===state.user.id)&&['draft','rejected'].includes(item.status));}
function pageBody(){
  const pages={overview:overviewPage,approvals:approvalPage,content:contentPage,personnel:personnelPage,activity:activityPage,accounts:accountsPage};
  if(!isSuper()&&['activity','accounts'].includes(state.page))state.page='overview';
  return (pages[state.page]||overviewPage)();
}
function renderPortal(){
  const nav=navItems().map(([id,label,ico])=>`<button class="nav-btn ${state.page===id?'active':''}" data-page="${id}">${icon(ico)}<span>${esc(label)}</span>${id==='approvals'&&isSuper()&&pendingCount()?`<b class="nav-count">${pendingCount()}</b>`:''}</button>`).join('');
  root.innerHTML=`<div class="app-shell"><aside class="sidebar"><div class="brand"><div class="brand-mark">${icon('mark')}</div><div><div class="brand-name">ParSU SAGÑAY</div><span class="brand-sub">CAMPUS ADMIN</span></div></div><div class="section-label">Workspace</div><nav class="side-nav">${nav}</nav><div class="side-bottom"><div class="secure-note"><strong>Secure session</strong><span>Private records and audit access are enforced by Supabase policies.</span></div><div class="user-mini"><div class="avatar ${isSuper()?'':'teal'}">${initials(state.profile.display_name)}</div><div class="user-copy"><div class="mini-name">${esc(state.profile.display_name)}</div><div class="mini-role">${roleTitle()}</div></div></div></div></aside><main class="main"><header class="topbar"><div class="crumb">Temporary website <span style="padding:0 6px;color:#b2bbc8">/</span><strong>Administration</strong></div><div class="top-right"><span class="role-pill ${isSuper()?'':'admin'}">${icon(isSuper()?'shield':'person')}${roleTitle()}</span><button class="btn small" data-action="change-password">Set password</button><button class="btn small" data-action="logout">${icon('logout')}Sign out</button></div></header><div class="main-inner">${pageBody()}</div></main></div>${state.modal?modalHtml():''}`;
}
function pendingCount(){return state.content.filter(x=>x.status==='pending_review').length+state.records.filter(x=>x.status==='pending_review').length;}
function modalHtml(){
  if(state.modal==='personnel'){
    const x=state.editing||{};return `<div class="modal-backdrop" data-close="true"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><h2>${x.id?'Edit personnel draft':'New personnel draft'}</h2><p>Admins submit personnel updates to the Super Admin for review.</p></div><button class="btn small" data-action="close-modal">${icon('close')}</button></div><form id="personnelForm"><input type="hidden" name="id" value="${esc(x.id||'')}"><div class="form-grid"><div class="field full"><label>Full name</label><input name="full_name" required maxlength="160" value="${esc(x.full_name||'')}" placeholder="Enter the verified name"></div><div class="field"><label>Position title</label><input name="position_title" maxlength="160" value="${esc(x.position_title||'')}"></div><div class="field"><label>Unit / program</label><input name="unit" maxlength="160" value="${esc(x.unit||'')}"></div><div class="field full"><label>Official email (optional)</label><input name="official_email" type="email" maxlength="254" value="${esc(x.official_email||'')}"></div></div><div class="modal-note">Personnel records are private to authenticated staff. Add only verified information.</div><div class="form-actions"><button class="btn" type="button" data-action="close-modal">Cancel</button><button class="btn primary" type="submit">Save draft</button></div></form></section></div>`;
  }
  if(state.modal==='content'){
    const x=state.editing||{};return `<div class="modal-backdrop" data-close="true"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><h2>${x.id?'Edit website draft':'New website draft'}</h2><p>Public changes require Super Admin approval.</p></div><button class="btn small" data-action="close-modal">${icon('close')}</button></div><form id="contentForm"><input type="hidden" name="id" value="${esc(x.id||'')}"><div class="form-grid"><div class="field"><label>Type</label><select name="content_type"><option ${x.content_type==='news'?'selected':''} value="news">News</option><option ${x.content_type==='faq'?'selected':''} value="faq">FAQ</option><option ${x.content_type==='announcement'?'selected':''} value="announcement">Announcement</option></select></div><div class="field"><label>Title</label><input name="title" required maxlength="180" value="${esc(x.title||'')}" placeholder="Draft headline"></div><div class="field"><label>Slug</label><input name="slug" maxlength="120" value="${esc(x.slug||'')}" placeholder="generated-from-title"></div><div class="field"><label>Image path (optional)</label><input name="image_path" maxlength="500" value="${esc(x.image_path||'')}" placeholder="assets/news/example.jpg"></div><div class="field full"><label>Summary</label><textarea name="summary" maxlength="800">${esc(x.summary||'')}</textarea></div><div class="field full"><label>Body</label><textarea name="body" required>${esc(x.body||'')}</textarea></div></div><div class="modal-note">The current public pages are static. Approved entries are saved in Supabase; a later integration step is needed to display them automatically on the public site.</div><div class="form-actions"><button class="btn" type="button" data-action="close-modal">Cancel</button><button class="btn primary" type="submit">Save draft</button></div></form></section></div>`;
  }
  if(state.modal==='invite')return `<div class="modal-backdrop" data-close="true"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><h2>Invite an Admin</h2><p>Only a Super Admin can issue portal invitations.</p></div><button class="btn small" data-action="close-modal">${icon('close')}</button></div><form id="inviteForm"><div class="form-grid"><div class="field full"><label>Display name</label><input name="display_name" required maxlength="120" placeholder="Campus editor"></div><div class="field full"><label>Email address</label><input name="email" type="email" required maxlength="254" placeholder="editor@example.edu.ph"></div></div><div class="modal-note">The invite link lets the recipient verify their email and set a password. The project needs custom SMTP for addresses outside the Supabase organization.</div><div class="form-actions"><button class="btn" type="button" data-action="close-modal">Cancel</button><button class="btn primary" type="submit">Send invitation</button></div></form></section></div>`;
  if(state.modal==='audit'){
    const e=state.audit.find(x=>String(x.id)===String(state.editing));if(!e)return '';
    return `<div class="modal-backdrop" data-close="true"><section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><h2>Edit event details</h2><p>${esc(labelForUser(e.actor_id))} · ${new Date(e.occurred_at).toLocaleString()}</p></div><button class="btn small" data-action="close-modal">${icon('close')}</button></div><div class="form-grid"><div class="field full"><label>Before</label><textarea readonly>${esc(JSON.stringify(e.before_data,null,2)||'—')}</textarea></div><div class="field full"><label>After</label><textarea readonly>${esc(JSON.stringify(e.after_data,null,2)||'—')}</textarea></div></div><div class="modal-actions"><button class="btn" data-action="close-modal">Close</button></div></section></div>`;
  }
  return '';
}
function setBusy(form,busy){const button=form?.querySelector('button[type=submit]');if(button){button.disabled=busy;button.dataset.label??=button.textContent;button.textContent=busy?'Please wait…':button.dataset.label;}}
function localError(message){flash(message,'error');}
async function submitForReview(kind,id){
  const table=kind==='personnel'?'personnel_records':'content_items';
  const {error}=await state.client.from(table).update({status:'pending_review'}).eq('id',id);
  if(error)throw error;await reloadData();renderPortal();flash('Submitted for Super Admin review.');
}
async function reviewItem(kind,id,status){
  const table=kind==='personnel'?'personnel_records':'content_items';
  const {error}=await state.client.from(table).update({status}).eq('id',id);
  if(error)throw error;await reloadData();renderPortal();flash(status==='approved'?'Change approved.':'Returned to the Admin for revision.');
}
function getRecord(kind,id){return kind==='personnel'?state.records.find(x=>x.id===id):state.content.find(x=>x.id===id);}
async function savePersonnel(form){
  const fd=new FormData(form),id=String(fd.get('id')||'');
  const values={full_name:String(fd.get('full_name')||'').trim(),position_title:String(fd.get('position_title')||'').trim(),unit:String(fd.get('unit')||'').trim(),official_email:String(fd.get('official_email')||'').trim()||null};
  const result=id?await state.client.from('personnel_records').update(values).eq('id',id):await state.client.from('personnel_records').insert(values);
  if(result.error)throw result.error;state.modal=null;state.editing=null;await reloadData();state.page='personnel';renderPortal();flash(id?'Draft updated.':'Personnel draft saved.');
}
async function saveContent(form){
  const fd=new FormData(form),id=String(fd.get('id')||''),title=String(fd.get('title')||'').trim();
  const values={content_type:String(fd.get('content_type')),title,slug:slugify(String(fd.get('slug')||title)),summary:String(fd.get('summary')||'').trim(),body:String(fd.get('body')||'').trim(),image_path:String(fd.get('image_path')||'').trim()||null};
  const result=id?await state.client.from('content_items').update(values).eq('id',id):await state.client.from('content_items').insert(values);
  if(result.error)throw result.error;state.modal=null;state.editing=null;await reloadData();state.page='content';renderPortal();flash(id?'Draft updated.':'Website draft saved.');
}
async function inviteAdmin(form){
  const fd=new FormData(form);
  const {data,error}=await state.client.functions.invoke('manage-admins',{body:{action:'invite',email:String(fd.get('email')||'').trim(),display_name:String(fd.get('display_name')||'').trim()}});
  if(error)throw error;if(data?.error)throw new Error(data.error);
  state.modal=null;await reloadData();state.page='accounts';renderPortal();flash(data?.message||'Invitation sent.');
}
async function toggleAdmin(id,action){
  const {data,error}=await state.client.functions.invoke('manage-admins',{body:{action,user_id:id}});
  if(error)throw error;if(data?.error)throw new Error(data.error);await reloadData();renderPortal();flash(data?.message||'Account access updated.');
}
function filterRows(){
  const q=(document.getElementById('contentSearch')?.value||'').toLowerCase();const status=document.getElementById('contentStatus')?.value||'all';
  document.querySelectorAll('#contentRows tr').forEach(row=>{const statusEl=row.querySelector('.badge');const rowStatus=statusEl?.classList[1]||'';row.hidden=!row.textContent.toLowerCase().includes(q)||(status!=='all'&&rowStatus!==status);});
}
function downloadAuditCsv(){
  const rows=[['time','actor','action','table','record_id','before','after'],...state.audit.map(e=>[e.occurred_at,labelForUser(e.actor_id),e.action,e.table_name,e.record_id,JSON.stringify(e.before_data||{}),JSON.stringify(e.after_data||{})])];
  const csv=rows.map(r=>r.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='admin-audit-history.csv';a.click();URL.revokeObjectURL(a.href);
}
function bindGlobalHandlers(){
  document.addEventListener('click',async e=>{
    const actionEl=e.target.closest('[data-action]');const pageEl=e.target.closest('[data-page]');
    try{
      if(pageEl){state.page=pageEl.dataset.page;renderPortal();return;}
      if(!actionEl)return;const {action,id,kind}=actionEl.dataset;
      if(action==='change-password'){renderLogin('','set-password');return;}
      if(action==='back-to-dashboard'){
        passwordRecoveryPending=false;
        if(state.session?.user)await loadProfile(state.session.user);else renderLogin('','login');
        return;
      }
      if(action==='show-reset'){renderLogin('','reset');return;}
      if(action==='show-login'){renderLogin('','login');return;}
      if(action==='close-modal'){state.modal=null;state.editing=null;renderPortal();return;}
      if(action==='new-personnel'){state.editing=null;state.modal='personnel';renderPortal();return;}
      if(action==='new-content'){state.editing=null;state.modal='content';renderPortal();return;}
      if(action==='invite'){state.modal='invite';renderPortal();return;}
      if(action==='edit'){state.editing=getRecord(kind,id);state.modal=kind==='personnel'?'personnel':'content';renderPortal();return;}
      if(action==='submit'){await submitForReview(kind,id);return;}
      if(action==='approve'){await reviewItem(kind,id,'approved');return;}
      if(action==='return'){await reviewItem(kind,id,'rejected');return;}
      if(action==='logout'){await state.client.auth.signOut();state.profile=null;state.session=null;renderLogin('You have signed out.');return;}
      if(action==='audit-detail'){state.editing=id;state.modal='audit';renderPortal();return;}
      if(action==='export-audit'){downloadAuditCsv();return;}
      if(action==='deactivate'||action==='activate'){await toggleAdmin(id,action);return;}
    }catch(err){localError(err?.message||'Something went wrong. Please try again.');}
  });
  document.addEventListener('click',e=>{if(e.target.matches('.modal-backdrop[data-close="true"]')){state.modal=null;state.editing=null;renderPortal();}});
  document.addEventListener('input',e=>{if(e.target.id==='contentSearch')filterRows();});
  document.addEventListener('change',e=>{if(e.target.id==='contentStatus')filterRows();});
  document.addEventListener('submit',async e=>{
    const form=e.target;if(!form.matches('form'))return;e.preventDefault();setBusy(form,true);
    try{
      if(form.id==='loginForm'){
        const fd=new FormData(form);const {data,error}=await state.client.auth.signInWithPassword({email:String(fd.get('email')).trim(),password:String(fd.get('password'))});
        if(error)throw error;state.session=data.session;await loadProfile(data.user);
      }else if(form.id==='resetForm'){
        const fd=new FormData(form);const {error}=await state.client.auth.resetPasswordForEmail(String(fd.get('email')).trim(),{redirectTo:redirectUrl});
        if(error)throw error;renderLogin('If the email is cleared, a reset link will be sent. Check your inbox.','login');
      }else if(form.id==='setPasswordForm'){
        const fd=new FormData(form),password=String(fd.get('password')),confirm=String(fd.get('confirm'));
        if(password.length<10)throw new Error('Use a password with at least 10 characters.');if(password!==confirm)throw new Error('The passwords do not match.');
        const {error}=await state.client.auth.updateUser({password});if(error)throw error;passwordRecoveryPending=false;history.replaceState(null,'',window.location.pathname);const {data:{user}}=await state.client.auth.getUser();await loadProfile(user);flash('Password set. You are signed in.');
      }else if(form.id==='personnelForm')await savePersonnel(form);
      else if(form.id==='contentForm')await saveContent(form);
      else if(form.id==='inviteForm')await inviteAdmin(form);
    }catch(err){
      if(form.id==='loginForm')renderLogin(err?.message||'Sign-in failed. Check your email and password.');
      else{setBusy(form,false);localError(err?.message||'Request failed.');}
    }
  });
}
async function start(){
  bindGlobalHandlers();
  if(!config.supabaseUrl||!config.publishableKey){root.innerHTML=`<section class="error-box"><h1>Supabase configuration missing</h1><p>Set the project URL and publishable key in <code>config.js</code>. Do not put a service-role key in the browser.</p></section>`;return;}
  try{
    await ensureClient();
    state.client.auth.onAuthStateChange((event,session)=>{
      state.session=session;
      if(event==='SIGNED_OUT'){state.profile=null;renderLogin('You have signed out.');}
      if(event==='PASSWORD_RECOVERY'){passwordRecoveryPending=true;renderLogin('','set-password');}
    });
    const {data,error}=await state.client.auth.getSession();if(error)throw error;
    state.session=data.session;
    const authLink=window.location.hash+window.location.search;
    const hasInvite=/type=invite/i.test(authLink);
    const hasRecovery=/type=recovery/i.test(authLink)||passwordRecoveryPending||new URLSearchParams(window.location.search).get('set-password')==='1';
    if((hasInvite||hasRecovery)&&state.session){passwordRecoveryPending=hasRecovery;renderLogin('','set-password');return;}
    if(state.session)await loadProfile(state.session.user);else renderLogin();
  }catch(err){root.innerHTML=`<section class="error-box"><h1>Could not connect to Supabase</h1><p>${esc(err?.message||'Check the project URL, publishable key, and network connection.')}</p><p>The public site can remain online, but this portal requires the Supabase Auth and REST services.</p></section>`;}
}
start();
