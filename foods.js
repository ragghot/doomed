/* You're Døomed · unités à la pièce, aliments hors Ciqual, recherche tolérante.
   Partagé par l'appli (index.html) et Le Labo (macro.html). */
(function(){
const norm = s => String(s||'').toLowerCase().replace(/œ/g,'oe').replace(/æ/g,'ae').normalize('NFD').replace(/[̀-ͯ]/g,'');

/* [regex sur le nom normalisé, singulier, pluriel, grammes par unité, pas (1 = entiers, 0.5 = demis), entier par défaut dans le Labo] */
const U = [
  [/^oeuf (de )?caille/,'œuf de caille','œufs de caille',10,1,1],
  [/^oeuf de cane/,'œuf de cane','œufs de cane',70,1,1],
  [/^oeuf, blanc|^blancs? d'oeufs?/,'blanc d\'œuf','blancs d\'œufs',33,1,1],
  [/^oeuf, jaune|^jaunes? d'oeufs?/,'jaune d\'œuf','jaunes d\'œufs',17,1,1],
  [/^oeufs?(?! de )(?!, en poudre)(?![a-z])/,'œuf','œufs',50,1,1],
  [/^omelette/,'omelette (2 œufs)','omelettes',120,1,0],
  // fruits
  [/^banane(?! plantain)(?!.*seche)/,'banane','bananes',120,0.5,1],
  [/^pomme, (?!sech)/,'pomme','pommes',150,0.5,1],
  [/^poire(?!.*sech)/,'poire','poires',150,0.5,1],
  [/^orange(?!.*(jus|confit))/,'orange','oranges',140,0.5,1],
  [/^(clementine|mandarine)/,'clémentine','clémentines',55,1,1],
  [/^kiwi/,'kiwi','kiwis',75,1,1],
  [/^(peche|nectarine|brugnon)/,'pêche','pêches',130,0.5,1],
  [/^abricot(?!.*sec)/,'abricot','abricots',40,1,1],
  [/^abricot.*sec/,'abricot sec','abricots secs',8,1,1],
  [/^prune(?!au)/,'prune','prunes',30,1,1],
  [/^pruneau/,'pruneau','pruneaux',9,1,1],
  [/^figue(?!.*sech)/,'figue','figues',50,1,1],
  [/^figue.*sech/,'figue sèche','figues sèches',20,1,1],
  [/^datte/,'datte','dattes',8,1,1],
  [/^fraise(?!.*confit)/,'fraise','fraises',12,1,1],
  [/^cerise(?!.*sirop)/,'cerise','cerises',7,1,1],
  [/^litchi/,'litchi','litchis',15,1,1],
  [/^mangue/,'mangue','mangues',250,0.5,1],
  [/^avocat(?!.*huile)/,'avocat','avocats',150,0.5,1],
  [/^citron/,'citron','citrons',60,0.5,1],
  [/^pamplemousse/,'pamplemousse','pamplemousses',200,0.5,1],
  [/^ananas, chair/,'tranche','tranches',80,1,1],
  [/^melon/,'tranche','tranches',150,1,1],
  [/^pasteque/,'tranche','tranches',250,1,1],
  [/^compote/,'pot','pots',100,1,1],
  // légumes
  [/^tomate cerise/,'tomate cerise','tomates cerises',15,1,1],
  [/^tomate(,| ronde| grappe)?.*cru/,'tomate','tomates',120,0.5,1],
  [/^carotte(?!.*(pure|jus|apperti|rape))/,'carotte','carottes',80,0.5,1],
  [/^courgette/,'courgette','courgettes',200,0.5,1],
  [/^concombre/,'concombre','concombres',250,0.5,1],
  [/^poivron/,'poivron','poivrons',150,0.5,1],
  [/^oignon (nouveau|frais)/,'oignon nouveau','oignons nouveaux',30,1,1],
  [/^oignon(?!.*(frit|pure))/,'oignon','oignons',100,0.5,1],
  [/^echalote/,'échalote','échalotes',25,1,1],
  [/^ail,/,'gousse','gousses',5,1,1],
  [/^aubergine/,'aubergine','aubergines',250,0.5,1],
  [/^endive/,'endive','endives',120,1,1],
  [/^poireau/,'poireau','poireaux',150,1,1],
  [/^navet/,'navet','navets',100,1,1],
  [/^radis/,'radis','radis',8,1,1],
  [/^betterave/,'betterave','betteraves',120,1,1],
  [/^champignon de paris/,'champignon','champignons',20,1,1],
  [/^pomme de terre(?!.*(noisette|frite|pure|dauphin|duchesse|chips|gratin|flocon|sautee|poelee|rissole))/,'pomme de terre','pommes de terre',150,0.5,0],
  [/^patate douce/,'patate douce','patates douces',200,0.5,0],
  // pains, féculents
  [/^pain de mie/,'tranche','tranches',27,1,1],
  [/^pain (complet|aux cereales|de seigle|blanc|au levain|de tradition|bis|\(aliment)/,'tranche','tranches',30,1,1],
  [/^biscotte/,'biscotte','biscottes',9,1,1],
  [/^tortilla souple.*mais/,'tortilla','tortillas',30,1,1],
  [/^tortilla souple|^wrap de ble/,'wrap','wraps',60,1,1],
  [/^pain pita/,'pita','pitas',70,1,1],
  [/^pain bagel/,'bagel','bagels',90,1,1],
  [/^pain (burger|hamburger|pour hamburger)/,'pain burger','pains burger',60,1,1],
  [/^muffin anglais/,'muffin','muffins',60,1,1],
  [/^galette de (riz|mais)/,'galette','galettes',8,1,1],
  [/^croissant(?! au)/,'croissant','croissants',45,1,1],
  [/^pain au chocolat/,'pain au chocolat','pains au chocolat',60,1,1],
  [/^pancake/,'pancake','pancakes',40,1,1],
  [/^crepe(,| nature)/,'crêpe','crêpes',50,1,1],
  // produits laitiers
  [/^yaourt proteine/,'pot','pots',160,1,1],
  [/^skyr|^creme dessert proteine|^fromage blanc proteine/,'pot','pots',150,1,1],
  [/^cottage/,'pot','pots',200,0.5,0],
  [/^(yaourt|lait fermente|specialite laitiere|dessert lacte|creme dessert)/,'pot','pots',125,1,1],
  [/^fromage frais type petit.suisse|^petit.suisse/,'petit-suisse','petits-suisses',60,1,1],
  [/^fromage blanc/,'pot','pots',100,1,1],
  [/^mozzarella/,'boule','boules',125,0.5,0],
  [/^(camembert|brie|coulommiers|emmental|comte|gruyere|beaufort|cantal|tomme|raclette|edam|gouda|mimolette|reblochon|roquefort|bleu|fromage de chevre|chevre|feta|fromage type feta)/,'portion','portions',30,1,0],
  [/^parmesan/,'c. à soupe râpé','c. à soupe râpé',6,1,0],
  [/^lait(?! (de coco|concentre|en poudre))(?!.*poudre)/,'verre','verres',200,0.5,0],
  [/^boisson (vegetale|a l'amande|au soja|a l'avoine|au riz|soja|amande|avoine)|^lait d'(amande|avoine)|^lait de (soja|riz)/,'verre','verres',200,0.5,0],
  // matières grasses, sucres, sauces
  [/^huile/,'c. à soupe','c. à soupe',10,0.5,0],
  [/^(beurre de cacahuete|beurre d'amande|puree d'(amande|arachide|noisette|cajou)|pate a tartiner)/,'c. à soupe','c. à soupe',15,0.5,0],
  [/^beurre/,'noisette','noisettes',10,1,0],
  [/^margarine/,'noisette','noisettes',10,1,0],
  [/^creme (fraiche|liquide|epaisse|legere|de lait)/,'c. à soupe','c. à soupe',15,1,0],
  [/^(sucre|cassonade)/,'c. à café','c. à café',5,1,0],
  [/^(miel|sirop d'erable|sirop d'agave|confiture)/,'c. à café','c. à café',7,1,0],
  [/^(mayonnaise|ketchup|moutarde|vinaigrette|sauce soja|pesto|sauce barbecue)/,'c. à soupe','c. à soupe',15,1,0],
  [/^(whey|caseine|proteine (en poudre|vegetale))/,'dose','doses',30,0.5,1],
  [/^(amande|noisette|noix de cajou|noix,|noix du bresil|noix de pecan|pistache|cacahuete|noix de macadamia|melange de fruits a coque)/,'poignée','poignées',25,0.5,0],
  [/^chocolat (noir|au lait|blanc)/,'carré','carrés',5,1,0],
  [/^barre proteinee/,'barre','barres',55,1,1],
  [/^soda/,'canette','canettes',330,1,1],
  // viandes, poissons
  [/steak hache/,'steak','steaks',100,1,1],
  [/^(poulet, filet|escalope (de )?(poulet|dinde)|dinde, escalope)/,'filet','filets',130,0.5,0],
  [/^jambon de (dinde|poulet)|^(blanc de (dinde|poulet))|^jambon (de )?poulet/,'tranche','tranches',30,1,1],
  [/^jambon (cuit|blanc|de paris|sec|cru|serrano)/,'tranche','tranches',40,1,1],
  [/^filet de bacon|^bacon/,'tranche','tranches',12,1,1],
  [/^saucisse de strasbourg|^knack/,'saucisse','saucisses',35,1,1],
  [/^saucisse|^merguez|^chipolata/,'saucisse','saucisses',55,1,1],
  [/^thon, au naturel|^thon,.*apperti/,'boîte','boîtes',100,0.5,0],
  [/^saumon fume/,'tranche','tranches',25,1,1],
  [/^saumon/,'pavé','pavés',125,0.5,0],
  [/^(cabillaud|colin|lieu|merlu)/,'filet','filets',125,0.5,0],
  [/^sardine/,'sardine','sardines',25,1,1],
  [/^surimi/,'bâtonnet','bâtonnets',17,1,1],
  [/^nugget/,'nugget','nuggets',18,1,1],
];

/* Aliments absents de Ciqual : moyennes d'étiquettes du commerce, pour 100 g.
   [code, nom, prot., gluc., lip., portion (g)] */
const EXTRA = [
  ['x-oeuf','Œuf entier, cru',12.8,0.1,9.8,100],
  ['x-oeufdur','Œuf entier, dur',13.5,0.3,10,100],
  ['x-blancliq','Blancs d\'œufs liquides (brique)',10.9,0.7,0.2,100],
  ['x-cottage','Cottage cheese',11,3.4,4.3,200],
  ['x-cottagel','Cottage cheese allégé',12.5,3,1.5,200],
  ['skyr','Skyr nature 0 %',10,4,0.2,150],
  ['x-skyrf','Skyr vanille ou fruits',8,11,0.2,150],
  ['x-hipro','Yaourt protéiné nature (type HiPro)',10,3.5,0.2,160],
  ['x-hiprof','Yaourt protéiné aux fruits (type HiPro)',9,6.5,0.2,160],
  ['x-pudding','Crème dessert protéinée chocolat',10,6.5,1.5,200],
  ['x-quark','Fromage blanc protéiné 0 % (type quark)',12,4,0.2,150],
  ['whey','Whey protéine, poudre',78,8,6,30],
  ['x-iso','Whey isolate, poudre',88,3,1,30],
  ['x-caseine','Caséine, poudre',76,7,2,30],
  ['x-protveg','Protéine végétale pois/riz, poudre',78,4,7,30],
  ['x-mozzl','Mozzarella allégée',17,1.5,9,125],
  ['x-philly','Fromage frais à tartiner, léger',7.5,4.5,11,30],
  ['x-emmlight','Emmental râpé allégé',31,0,17,30],
  ['x-fetal','Feta allégée',18,1,11,30],
  ['x-amande','Lait d\'amande sans sucres',0.5,0.1,1.1,200],
  ['x-avoine','Lait d\'avoine',1,6.5,1.5,200],
  ['x-soja','Lait de soja nature',3.3,1.5,1.9,200],
  ['x-cf30','Crème fraîche épaisse 30 %',2.4,3,30,15],
  ['x-cf15','Crème fraîche légère 15 %',2.8,4,15,15],
  ['x-cl12','Crème liquide légère 12 % (cuisine)',2.7,4,12,15],
  ['x-escpoulet','Escalope / blanc de poulet, crue',23,0,1.5,130],
  ['x-escdinde','Escalope de dinde, crue',22.5,0,1.6,130],
  ['x-bhache5','Steak haché 5 % MG, cru',21,0,5,100],
  ['x-bhache15','Steak haché 15 % MG, cru',18,0,15,100],
  ['x-tofu','Tofu nature',12,2,7,100],
  ['x-edamame','Edamame (fèves de soja), cuits',11.9,6,5.2,100],
  ['x-cremeriz','Crème de riz, poudre',7,79,1,60],
  ['x-granola','Granola',9,62,17,45],
  ['x-galmais','Galette de maïs soufflé',8,80,3,8],
  ['x-wrap','Wrap de blé (tortilla)',8,53,7.5,60],
  ['x-bun','Pain burger (bun)',9,49,5,60],
  ['x-pates','Pâtes cuites (spaghetti, penne…)',5,30,0.9,250],
  ['x-patescr','Pâtes crues (spaghetti, penne…)',12.5,70,1.5,80],
  ['x-rizcru','Riz blanc, cru',7,78,0.7,70],
  ['x-rizbasm','Riz basmati, cru',8,77,0.6,70],
  ['x-flocons','Flocons d\'avoine (porridge)',13.5,58,7,50],
  ['x-pdtcuite','Pomme de terre cuite (vapeur ou à l\'eau)',1.9,17,0.2,200],
  ['x-beurream','Beurre d\'amande (purée 100 %)',21,9,55,15],
  ['x-barre','Barre protéinée (moyenne)',33,33,12,55],
  ['x-cola','Soda au cola, sucré',0,10.6,0,330],
  ['x-colaz','Soda au cola zéro / light',0,0,0,330],
  ['x-chocnoir70','Chocolat noir 70 %',9,33,42,20],
  ['x-chocnoir85','Chocolat noir 85 %',11,19,50,20],
  ['x-houmous','Houmous',7.5,13,17,50],
  ['x-guaca','Guacamole',1.8,4,14,50],
  ['x-saumonfume','Saumon fumé',22,0.5,10,50],
  ['x-crevettes','Crevettes cuites décortiquées',22,0.5,1.5,100],
  ['x-jambonbl','Jambon blanc (tranche)',21,0.8,3,40],
  ['x-dindetr','Blanc de dinde (tranche)',22,1,1.5,30],
  ['x-sauceso','Sauce soja salée',8,5,0,15],
  ['x-mayolight','Mayonnaise allégée',1,6,30,15],
  ['x-ketchup','Ketchup',1.2,24,0.2,15],
];

/* synonymes de recherche (après normalisation et passage au singulier) */
const SYN = {coca:'cola', steack:'steak', steaks:'steak', yogourt:'yaourt', yoghourt:'yaourt', yogurt:'yaourt', proteine:'protein', patate:'patate', escalopes:'escalope', wraps:'wrap', oeuf:'oeuf', oeufs:'oeuf'};
const sing = t => t.length>3 && /[sx]$/.test(t) && !/(ss|is|us|riz|noix|radis|ananas|pois)$/.test(t) ? t.slice(0,-1) : t;
function tokens(q){
  return norm(q).replace(/[’']/g,' ').split(/[\s,;/()]+/).filter(t=>t && !['de','du','des','la','le','les','a','au','aux','en','d','l','et'].includes(t))
    .map(t=>SYN[t]||sing(t)).map(t=>t==='protein'?'protei':t);
}

const cache = new Map();
function unit(name){
  const n = norm(name);
  if(cache.has(n)) return cache.get(n);
  let r = null;
  for(const [re,u,pl,g,st,w] of U){ if(re.test(n)){ r={u,pl,g,st,w:!!w}; break; } }
  cache.set(n,r); return r;
}
const fmt = v => String(Math.round(v*10)/10).replace('.',',');
function qtyText(n, un){ return `${fmt(n)} ${n>1?un.pl:un.u}`; }

window.YD_FOODS = {norm, unit, qtyText, tokens, EXTRA: EXTRA.map(([code,name,p,g,l,portion])=>({code,name,p,g,l,portion}))};
})();
