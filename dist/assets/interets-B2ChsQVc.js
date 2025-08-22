import{V as d,C as J,W as B,P as D,T as I,S as V,a as _,A as O,b as U,R as X,e as Y,F as R,f as E,M as G,g as l,h,i as f,j as x,t as T,u as v,D as P,r as K,o as N,s as Q,p as Z}from"./TextGeometry-CdrQ54mS.js";let m,i,p,b,F,M,g=16770032,j=6037302,$=6375504,w,y,q,H=[];const ee=[new d(-160,-90,10),new d(-40,20,10),new d(-30,-100,10),new d(120,-170,10),new d(150,60,10),new d(250,-20,10)],W=new J(ee),S=W.computeFrenetFrames(100,!0);ce();function k(n,t,o){const e=-n/2,s=-t/2,a=new Z;return a.moveTo(e+o,s),a.lineTo(e+n-o,s),a.quadraticCurveTo(e+n,s,e+n,s+o),a.lineTo(e+n,s+t-o),a.quadraticCurveTo(e+n,s+t,e+n-o,s+t),a.lineTo(e+o,s+t),a.quadraticCurveTo(e,s+t,e,s+t-o),a.lineTo(e,s+o),a.quadraticCurveTo(e,s,e+o,s),a}function C(n,t,o,e,s,a,c){new R().load("fonts/optimer_regular.typeface.json",function(u){const L=new E(n,{font:u,size:t,depth:o,height:e,curveSegments:s});L.center();const z=new G({color:a});w=new l(L,z),w.position.set(c.x,c.y,c.z),i.add(w)},function(u){console.log(u.loaded/u.total*100+"% loaded")},function(u){console.log("An error happened")})}function ne(){new R().load("fonts/optimer_bold.typeface.json",function(t){const o=new E("Intérêts",{font:t,size:20,depth:2,height:0,curveSegments:8});o.center();const e=new G({color:g});w=new l(o,e),w.position.set(0,100,10),i.add(w)},function(t){console.log(t.loaded/t.total*100+"% loaded")},function(t){console.log("An error happened")})}function te(){const n=new h().load("textures/pictures/cv_picture.jpeg"),t=new f(30,32),o=new x({map:n,transparent:!1});y=new l(t,o),y.position.set(-320,130,10),i.add(y);const e=new f(32,32),s=new G({color:g});q=new l(e,s),q.position.set(-320,130,9.9),i.add(q)}function oe(){const n=k(200,180,10),t=new T(n),o=new v({color:j,side:P}),e=new l(t,o);e.position.set(-250,-60,9.9),i.add(e);const s=new h().load("textures/pictures/hobbies/music.JPG"),a=new f(30,32),c=new x({map:s,transparent:!1}),r=new l(a,c);r.position.set(-300,40,10),i.add(r),C(`La majorité de mon temps libre 
est consacrée à la musique : 
chant, guitare, piano, 
composition, production, etc. 
Jouer avec des amis ou seule, 
sur scène ou dans ma chambre, 
tout ce qui y est attrait 
me fais vibrer.`,8,1,0,8,g,new d(-250,-60,10))}function se(){const n=k(200,80,10),t=new T(n),o=new v({color:j,side:P}),e=new l(t,o);e.position.set(0,-12,9.9),i.add(e);const s=new h().load("textures/pictures/hobbies/books.jpg"),a=new f(15,32),c=new x({map:s,transparent:!1}),r=new l(a,c);r.position.set(70,-30,10),i.add(r),C(`Un autres de mes passe temps 
favoris est la lecture, un temps 
d'attente ? J'ai toujours un 
livre dans mon sac a sortir 
pour le remplir !`,7,1,0,8,g,new d(-10,-12,10))}function ae(){const n=k(200,85,10),t=new T(n),o=new v({color:j,side:P}),e=new l(t,o);e.position.set(0,-112,9.9),i.add(e);const s=new h().load("textures/pictures/hobbies/asso.jpg"),a=new f(15,32),c=new x({map:s,transparent:!1}),r=new l(a,c);r.position.set(70,-130,10),i.add(r),C(`J'aime egalement m'impliquer dans la vie 
associative. En ecole d'ingenieur j'etais 
presidente de plusieurs assos/club. 
Et tout au long de mes etudes j'ai 
participe dans plusieurs clubs 
sportifs et de musique.`,6,1,0,8,g,new d(-10,-112,10))}function ie(){const n=k(200,180,10),t=new T(n),o=new v({color:j,side:P}),e=new l(t,o);e.position.set(250,-60,9.9),i.add(e);const s=new h().load("textures/pictures/hobbies/spain.png"),a=new f(30,32),c=new x({map:s,transparent:!1}),r=new l(a,c);r.position.set(300,-140,10),i.add(r),C(`Puisque que j'aime toujours 
apprendre, j'ai récement décidé 
d'étudier l'espagnol. J'ai choisis 
cette langue pour deux raisons 
majeurs: c'est une langue parlée 
dans beaucoup de pays (que j'aimerais 
visiter un jour), et la culture
hispanique m'intéresse de plus en plus, 
en particulier (vous l'aurez peut-etre 
devine) la musique 
hispanophone !`,7,1,0,8,g,new d(250,-60,10))}function re(){const n=new h().load("textures/sprites/sparkle.png"),t=new K({map:n,color:9408399,transparent:!0,blending:N,depthWrite:!1});for(let o=0;o<2e3;o++){const e=new Q(t.clone());e.scale.set(1,1,1),i.add(e),H.push({sprite:e,offset:Math.random()})}}function ce(){p=new B({antialias:!0}),p.setPixelRatio(window.devicePixelRatio),p.setSize(window.innerWidth,window.innerHeight),p.setAnimationLoop(A),document.body.appendChild(p.domElement),m=new D(45,window.innerWidth/window.innerHeight,1,1e3),m.position.set(0,0,500),b=new I(m,p.domElement),b.minDistance=200,b.maxDistance=500,i=new V,i.background=new _($),i.add(new O(6710886));const n=new U(16777215,3,0,0);n.position.copy(m.position),i.add(n),ne(),te(),oe(),se(),ae(),ie(),re(),F=new X,M=new Y,window.addEventListener("click",le)}function le(n){M.x=n.clientX/window.innerWidth*2-1,M.y=-(n.clientY/window.innerHeight)*2+1,F.setFromCamera(M,m),F.intersectObjects([y]).length>0&&(window.location.href="index.html")}function de(n){H.forEach(t=>{const o=(n*.05+t.offset)%1,e=W.getPointAt(o),s=Math.floor(o*S.tangents.length),a=S.normals[s],c=S.binormals[s],r=a.clone().add(c.clone());t.sprite.position.copy(e.clone().add(r)),t.sprite.position.add(new d((Math.random()-.5)*2,(Math.random()-.5)*2,(Math.random()-.5)*2))})}function A(){requestAnimationFrame(A),b.update();const n=performance.now();de(n*.005),p.render(i,m)}p.setAnimationLoop(A);
