var ctitle = " - Ding!"
var minutes=0;
var username;
var connected=false;
var socket = io()
.on('connect', function() {
document.title = location.pathname+ctitle;
connected=true;
socket.emit('join', location.pathname);
aUsrLogin.stop();
aUsrLogin.play();
})
.on('disconnect', function() {
connected=false;
log({u: "Info", m: "Disconnected."});
aUsrLogout.stop();
aUsrLogout.play();
})
.on('announce', log)
.on('join', join)
.on('leave', leave)
.on('welcome', welcome)
.on('newnick', newnick)
.on('inject', inject)
.on('message', function(data) {
if (username != data.u) {
aMsgRec.stop();
aMsgRec.play();
}
if(!window.document.hasFocus() && window.Notification && Notification.permission=="granted"){
var title="New message from "+data.u;
var options={
body:data.m
}
var nfm=new Notification(title,options);
}
log(data);
})
.on('count', function(count) {
document.title = '(' + count + ') ' + location.pathname+ctitle;
});
var input = document.getElementsByTagName('input')[0];
input.onkeydown = function (e) {
if ( e.keyCode === 13 || e.keyCode === 10) {
if (!connected) {
log({u: "Info", m: "You are not connected."});
this.value = '';
return;
}
this.value=this.value.trim();
if (this.value==="")
return;
socket.send(this.value);
this.value = '';
aMsgSend.stop();
aMsgSend.play();
}
};
function newnick(data) {
if (username==data.o) {
username=data.n;
log({u: "Info", m: "You are now known as "+data.n+"."})
} else {
log({u: "Info", m: data.o+" is now known as "+data.n+"."})
}
}
function welcome(data) {
username=data.u;
}
function join(data) {
aUsrLogin.stop()
aUsrLogin.play()
log(data)
}
function leave(data) {
aUsrLogout.stop()
aUsrLogout.play()
log(data)
}
function inject(html) {
var div = document.createElement('div');
div.innerHTML = html;
document.getElementById('links').insertBefore(div,document.getElementById('links').firstChild);
div.scrollIntoView();
}
function log(data) {
var historydiv = document.getElementById("history");
var hu = document.createElement('h3');
hu.innerHTML=data.u.bold();
var p = document.createElement('p');
if (data.link) {
var lnk=document.createElement('a');
lnk.href=data.m;
lnk.target="_blank";
lnk.innerHTML=data.m;
p.appendChild(lnk);
} else if (data.dictionary) {
document.createElement('div');
p.innerHTML=data.m.replace('\\n','<br />')
p.className="msg";
} else {
p.appendChild(document.createTextNode(data.m));
p.className="msg";
}
var d = new Date();
if (d.getMinutes() > minutes) {
minutes=d.getMinutes();
var h2 = document.createElement('h2');
h2.appendChild(document.createTextNode((d.getHours()<10?'0':'')+d.getHours()+":"+(d.getMinutes()<10?'0':'')+d.getMinutes()));
historydiv.appendChild(h2);
}
historydiv.appendChild(hu);
historydiv.appendChild(p);
p.scrollIntoView();
}
if(window.Notification && Notification.permission!=="granted"){
Notification.requestPermission(function(status){
if(Notification.permission!==status){
Notification.permission=status;
}
})
}
//add Private Links
var PrivLinks=document.getElementById("PrivateLinks");
var PrivID=generate(10)
var Link1=document.createElement('a');
Link1.href="/"+PrivID;
Link1.innerHTML=PrivID;
PrivID=generate(10);
var Link2=document.createElement('a');
Link2.href="/"+PrivID;
Link2.innerHTML=PrivID;
PrivLinks.appendChild(Link1);
PrivLinks.appendChild(Link2);
function generate(length) {
var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
result=""
for (var i = length; i > 0; --i)
result += chars[Math.round(Math.random() * (chars.length - 1))]
return result
}
