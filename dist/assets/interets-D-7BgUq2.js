import{F as I,V as l,C as V,t as k,u as P,D as j,b as u,T as w,a as m,M as h,W as O,P as U,d as X,S as Y,e as K,A as N,f as Q,R as Z,i as $,j as ee,c as L,p as ne,r as te,o as oe,s as se}from"./TextGeometry-BWGeakaV.js";const R=new I;let A=null;R.load("fonts/optimer_bold.typeface.json",e=>{A=e,B()});let x=null;R.load("fonts/optimer_regular.typeface.json",e=>{x=e,z(),D(),_(),J()});let p,i,d,y,q,T,g=16770032,b=6037302,ae=6375504,v,S,E=[];const ie=[new l(-160,-90,10),new l(-40,20,10),new l(-30,-100,10),new l(120,-170,10),new l(150,60,10),new l(250,-20,10)],W=new V(ie),G=W.computeFrenetFrames(100,!0);le();function C(e,s,o){const n=-e/2,t=-s/2,a=new ne;return a.moveTo(n+o,t),a.lineTo(n+e-o,t),a.quadraticCurveTo(n+e,t,n+e,t+o),a.lineTo(n+e,t+s-o),a.quadraticCurveTo(n+e,t+s,n+e-o,t+s),a.lineTo(n+o,t+s),a.quadraticCurveTo(n,t+s,n,t+s-o),a.lineTo(n,t+o),a.quadraticCurveTo(n,t,n+o,t),a}function M(e,s,o,n,t,a,c){if(!e)return;const r=new ee(s,{font:e,size:o,depth:n,curveSegments:t});r.center();const f=new L({color:a}),F=new u(r,f);F.position.set(c.x,c.y,c.z),i.add(F)}function B(){M(A,"Intérêts",20,2,8,g,new l(0,100,10))}function re(){const e=new w().load("textures/pictures/cv_picture_house.jpg"),s=new m(30,32),o=new h({map:e,transparent:!1});v=new u(s,o),v.position.set(-320,130,10),i.add(v);const n=new m(32,32),t=new L({color:b});S=new u(n,t),S.position.set(-320,130,9.9),i.add(S)}function J(){const e=C(200,180,10),s=new k(e),o=new P({color:b,side:j}),n=new u(s,o);n.position.set(-250,-60,9.9),i.add(n);const t=new w().load("textures/pictures/hobbies/music.JPG"),a=new m(30,32),c=new h({map:t,transparent:!1}),r=new u(a,c);r.position.set(-300,40,10),i.add(r),M(x,`La majorité de mon temps libre 
est consacré à la musique : 
chant, guitare, piano, 
composition, production, etc. 
Jouer avec des amis ou seule, 
sur scène ou dans ma chambre, 
tout ce qui y est attrait 
me fais vibrer.`,8,1,8,g,new l(-250,-65,10))}function z(){const e=C(200,80,10),s=new k(e),o=new P({color:b,side:j}),n=new u(s,o);n.position.set(0,-12,9.9),i.add(n);const t=new w().load("textures/pictures/hobbies/books.jpg"),a=new m(15,32),c=new h({map:t,transparent:!1}),r=new u(a,c);r.position.set(70,-30,10),i.add(r),M(x,`Un autre de mes passe-temps 
favoris est la lecture, un temps 
d'attente ? J'ai toujours un 
livre dans mon sac à sortir 
pour le combler !`,7,1,8,g,new l(-10,-12,10))}function D(){const e=C(200,85,10),s=new k(e),o=new P({color:b,side:j}),n=new u(s,o);n.position.set(0,-112,9.9),i.add(n);const t=new w().load("textures/pictures/hobbies/asso.jpg"),a=new m(15,32),c=new h({map:t,transparent:!1}),r=new u(a,c);r.position.set(70,-130,10),i.add(r),M(x,`J'aime également m'impliquer dans la vie 
associative. En école d'ingénieur j'étais 
présidente de plusieurs assos/clubs. 
Et tout au long de mes études j'ai 
participé à plusieurs clubs 
sportifs et musicaux.`,6,1,8,g,new l(-10,-112,10))}function _(){const e=C(200,180,10),s=new k(e),o=new P({color:b,side:j}),n=new u(s,o);n.position.set(250,-60,9.9),i.add(n);const t=new w().load("textures/pictures/hobbies/spain.png"),a=new m(30,32),c=new h({map:t,transparent:!1}),r=new u(a,c);r.position.set(300,-140,10),i.add(r),M(x,`Puisque j'aime toujours 
apprendre, j'ai récemment décidé 
d'étudier l'espagnol. J'ai choisi 
cette langue pour deux raisons 
majeures : c'est une langue parlée 
dans beaucoup de pays (que j'aimerais 
visiter un jour), et la culture
hispanique m'intéresse de plus en plus, 
en particulier (vous l'aurez peut-être 
deviné) la musique 
hispanophone !`,7,1,8,g,new l(250,-60,10))}function ce(){const e=new w().load("textures/sprites/sparkle.png"),s=new te({map:e,color:16777130,transparent:!0,blending:oe,depthWrite:!1});for(let o=0;o<2e3;o++){const n=new se(s.clone());n.scale.set(1,1,1),i.add(n),E.push({sprite:n,offset:Math.random()})}}function le(){d=new O({antialias:!0}),d.setPixelRatio(window.devicePixelRatio),d.setSize(window.innerWidth,window.innerHeight),d.setAnimationLoop(H),document.body.appendChild(d.domElement),p=new U(45,window.innerWidth/window.innerHeight,1,1e3),p.position.set(0,0,500),y=new X(p,d.domElement),y.minDistance=200,y.maxDistance=500,i=new Y,i.background=new K(ae),i.add(new N(6710886));const e=new Q(16777215,3,0,0);e.position.copy(p.position),i.add(e),B(),re(),J(),z(),D(),_(),ce(),q=new Z,T=new $,window.addEventListener("click",ue)}function ue(e){T.x=e.clientX/window.innerWidth*2-1,T.y=-(e.clientY/window.innerHeight)*2+1,q.setFromCamera(T,p),q.intersectObjects([v]).length>0&&(window.location.href="index.html")}function de(e){E.forEach(s=>{const o=(e*.05+s.offset)%1,n=W.getPointAt(o),t=Math.floor(o*G.tangents.length),a=G.normals[t],c=G.binormals[t],r=a.clone().add(c.clone());s.sprite.position.copy(n.clone().add(r)),s.sprite.position.add(new l((Math.random()-.5)*2,(Math.random()-.5)*2,(Math.random()-.5)*2))})}function H(){y.update();const e=performance.now();de(e*.005),d.render(i,p)}d.setAnimationLoop(H);
