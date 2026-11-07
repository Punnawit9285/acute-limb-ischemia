/* Case 4: Acute limb ischemia. All slide content lives here.
   {{text}} = click-to-reveal cloze blank. [[text]] = tappable phrase, [[+text]] = tappable phrase that is correct.
   The case text is verbatim. The flowchart follows the lecture's mechanism.

   The talk is the slides before the first `bonus: true`, in order: cover, 6 numbered slides, references (course limit: 6 slides
   not counting cover and references, 6 minutes). `t` is the time budget in seconds.
   c('5 Ch13, 2') writes a citation. Numbers point at the reference list on the last talk slide, in order of first appearance.
   Bonus slides are "More practice": reachable from the last slide and the tab, never by pressing Next through the talk. */
window.ALI = (function () {

  /* The verbatim case with tappable phrases. */
  var CASE_TAP =
    'A [[68-year-old man]] with a [[history of atrial fibrillation]] [[+suddenly developed severe pain in his left leg]] [[3 hours ago]]. ' +
    'When he arrived at the emergency room, [[+his leg appeared pale]] compared to the right side. He complained of [[+numbness and tingling sensations]] along the left foot. ' +
    'On examination, [[+the left leg felt cold to touch]], and [[+pulses below the femoral artery were absent]]. The patient was [[+unable to move his toes properly]], showing some degree of weakness. ' +
    'A computed tomography angiogram was performed and revealed [[complete occlusion of the left femoral artery]]. He was diagnosed with acute limb ischemia due to arterial embolism.';

  var flow = {
    nodes: {
      occl:   { t: 'Arterial occlusion', col: '2 / 6' },
      flow:   { t: 'Suddenly decreased blood flow to distal part', col: '2 / 6', hot: true },
      pulse:  { t: 'Absence of pulse', col: '1 / 3' },
      hypox:  { t: 'Tissue hypoxia', col: '3 / 5' },
      skin:   { t: 'Cold and pale skin', col: '5 / 7' },
      atp:    { t: '&#8595; ATP', col: '3 / 5', chip: true },
      nerve:  { t: 'Nerve damage', col: '2 / 4' },
      muscle: { t: 'Muscle damage', col: '4 / 6' },
      sens:   { t: 'Abnormal sensation', sub: 'Abnormal depolarization', col: '1 / 3' },
      pain:   { t: 'Pain', col: '3 / 5' },
      para:   { t: 'Paralysis', sub: 'Abnormal crossbridge', col: '5 / 7' }
    },
    rows: [['occl'], ['flow'], ['pulse', 'hypox', 'skin'], ['atp'], ['nerve', 'muscle'], ['sens', 'pain', 'para']],
    edges: [
      ['occl', 'flow'], ['flow', 'pulse'], ['flow', 'hypox'], ['flow', 'skin'],
      ['hypox', 'atp'], ['atp', 'nerve'], ['atp', 'muscle'],
      ['nerve', 'sens'], ['nerve', 'pain'], ['nerve', 'para'], ['muscle', 'para']
    ],
    order: ['occl', 'flow', 'pulse', 'skin', 'hypox', 'atp', 'nerve', 'muscle', 'sens', 'pain', 'para']
  };

  var sections = [
    { k: 'A', name: 'Sources' },
    { k: 'B', name: 'The case' },
    { k: 'C', name: 'Clot source' },
    { k: 'D', name: 'Mechanism' },
    { k: 'E', name: 'References' },
    { k: '+', name: 'More practice' }
  ];
  var BONUS = 5;

  function c(s) { return '<sup class="cite">' + s + '</sup>'; }

  function fig(src, cap, source, cls) {
    return '<figure class="scan ' + (cls || '') + '"><div class="paperimg"><img src="img/' + src + '" alt="' + cap.replace(/<[^>]+>/g, '').replace(/"/g, '') + '"></div>' +
      '<figcaption>' + cap + ' <span class="src">' + source + '</span></figcaption></figure>';
  }

  /* Real chest film from AC81 with blank label boxes. Labels come from the labelled copy in AC80. */
  function cxr() {
    var box = function (x0, y0, x1, y1, html, cls) {
      return '<span class="cxrlab ' + (cls || '') + '" style="left:' + (x0 / 11.62).toFixed(2) + '%;top:' + (y0 / 11.37).toFixed(2) + '%;width:' + ((x1 - x0) / 11.62).toFixed(2) + '%;height:' + ((y1 - y0) / 11.37).toFixed(2) + '%">' + html + '</span>';
    };
    return '<figure class="scan cxr"><div class="cxrwrap">' +
      '<img src="img/cxr-ac81.jpg" alt="Normal PA chest film with the heart borders traced">' +
      box(800, 27, 1157, 97, 'Left subclavian a.') +
      box(864, 210, 1018, 332, 'Aortic arch') +
      box(894, 372, 1126, 492, 'Pulmonary trunk') +
      box(903, 562, 1157, 735, '<span class="whenrev">Left atrial appendage</span><span class="whenq">?</span>', 'laa') +
      box(903, 794, 1102, 915, 'Left ventricle') +
      box(245, 328, 364, 398, 'SVC') +
      box(31, 660, 273, 781, 'Right atrial border') +
      box(221, 907, 326, 977, 'IVC') +
      '</div><figcaption>Left heart border on a PA film. <span class="src">รูปจากไฟล์ทบทวน AC81, ป้ายจาก AC80 (ไม่ได้ตีพิมพ์)</span></figcaption></figure>';
  }

  var slides = [

    /* ========== THE 6-MINUTE TALK: cover, slides 1-6, references ========== */

    { id: 'start', kind: 'title', sec: -1, t: 10,
      say: 'QR up while people arrive. Scan, then tap any choice: the answer shows straight away.' },

    { id: 'method', kind: 'concept', sec: 0, t: 50, tag: 'Sources and search', title: 'แหล่งข้อมูลและวิธีสืบค้น',
      html: '<div class="tblwrap"><table class="tbl method"><thead><tr><th>สืบค้นเรื่อง</th><th>จากแหล่งใด</th><th>เข้าถึงอย่างไร</th></tr></thead><tbody>' +
        '<tr><td>Symptoms and signs, ตำแหน่ง embolus, เวลาที่เนื้อเยื่อทนได้</td><td>Review: Olinic 2019' + c('1') + ', Obara 2018' + c('2') + ', Shukuzawa 2026' + c('3') + ', Simon 2018' + c('4') + '</td><td>PubMed (A), full text ผ่าน PMC</td></tr>' +
        '<tr><td>AF ทำให้เกิด clot ที่ appendage</td><td>Chapter 13, 37 <i>Guyton and Hall Textbook of Medical Physiology</i>, 14th ed, 2021, Hall JE, Hall ME' + c('5') + '; Sulague 2023' + c('6') + '; Blackshear 1996' + c('7') + '</td><td>ไฟล์หนังสือ; PubMed (B), PMC; ตัวเลขต้นทาง: PubMed, abstract</td></tr>' +
        '<tr><td>Flow ลด: ไม่มี pulse, ซีด, เย็น</td><td>Chapter 15, 17, 74 Guyton' + c('5') + '; เอกสารปฏิบัติการสรีรวิทยา 16, จุไรพร สมบุญวงค์' + c('8') + '</td><td>ไฟล์หนังสือ; เอกสารรายวิชา</td></tr>' +
        '<tr><td>Hypoxia: ATP ลด</td><td>Chapter 68 Guyton' + c('5') + '; Costa 2024' + c('9') + '</td><td>ไฟล์หนังสือ; PubMed (A), PMC</td></tr>' +
        '<tr><td>Nerve: pump, tingling, numbness, pain</td><td>Chapter 5, 49 Guyton' + c('5') + '; Akimoto 2023' + c('10') + '; Mogyoros 2000' + c('11') + '</td><td>ไฟล์หนังสือ; web search, PMC; PubMed (C), abstract</td></tr>' +
        '<tr><td>Muscle: crossbridge, paralysis</td><td>Chapter 6 Guyton' + c('5') + '; Costa 2024' + c('9') + '; Obara 2018' + c('2') + '</td><td>ไฟล์หนังสือ; PubMed (A), PMC</td></tr>' +
        '</tbody></table></div>' +
        '<ul class="searches">' +
        '<li><b>A</b> <code>"acute limb ischemia"[Title] AND 2018:2026[dp]</code> 476 รายการ</li>' +
        '<li><b>B</b> <code>"left atrial appendage"[Title] AND "atrial fibrillation"[Title] AND review[pt] AND 2018:2026[dp]</code> 147 รายการ</li>' +
        '<li><b>C</b> <code>paresthesia[tiab] AND ischemia[tiab] AND axons[tiab]</code> 1 รายการ</li>' +
        '</ul>' +
        '<p class="note">ค้นวันที่ 7 พ.ย. 2569 ด้วย PubMed และ web search. เลือก review ภาษาอังกฤษที่เปิดอ่านได้ เทียบข้อมูลคลินิกระหว่างแหล่ง และระบุจุดที่ต่างกัน. งานก่อนปี 2018 ใช้เฉพาะตัวเลขต้นทาง' + c('7') + ' และกลไก paresthesia' + c('11') + '. ใช้ Claude (AI) ช่วยสืบค้นและร่างสไลด์ ทุกการอ้างอิงตรวจกับเนื้อหาในต้นฉบับ.</p>',
      say: 'Say this before the case. Textbook: Guyton and Hall, 14th edition, Hall and Hall, 2021, chapters as listed. Journals: PubMed title search on 7 November, then review articles I could open. Newest is Shukuzawa, Annals of Vascular Diseases, May 2026. Full details on the last slide. If asked: the 15th edition (2026) exists, this is the edition read; the ESVS 2020 guideline was not opened.' },

    { id: 'tap', kind: 'tap', sec: 1, t: 50, tag: 'Find them', src: 'Case',
      title: 'The case: tap the <span class="hl">6 symptoms and signs</span>',
      text: CASE_TAP,
      why: [
        'หกข้อตรงกับ classic signs: <b>pain, pallor, paresthesia, poikilothermia, pulse deficit, paralysis</b>' + c('1'),
        'แหล่งไม่ตรงกัน: บางแหล่งใช้ 5 Ps' + c('2,3') + ' หรือนับ <b>prostration</b> เป็นข้อที่ 6' + c('3,4') + ' แต่อาการเย็นในเคสนี้ตรงกับ poikilothermia' + c('1'),
        'อายุ ประวัติ AF เวลา และผล CT angiogram <b>ไม่ใช่</b> symptoms หรือ signs'
      ],
      say: 'Read the case fast and let them tap. Each tap marks right or wrong at once. Space shows all six. Point out that sources disagree on the sixth P.' },

    { id: 'q2', kind: 'poll', sec: 2, t: 45, tag: 'Case question', src: 'Case', layout: 'fig',
      q: 'He has <b>atrial fibrillation</b>. Where did this embolus most likely form?',
      o: ['Right atrial appendage', 'Femoral vein', 'Left atrial appendage', 'Left ventricular outflow tract'], a: 2,
      figHtml: cxr(),
      why: [
        'AF เป็นสาเหตุหลักของ cardiac embolism' + c('2,3') + ': atria บีบตัวลดลง เลือดคั่ง เกิด clot ใน <b>atrial appendage</b>' + c('5 Ch13'),
        'Nonrheumatic AF: left atrial thrombus ราว <b>90%</b> อยู่ที่ appendage' + c('6,7'),
        'ก้อนจากหัวใจซีกซ้ายไปตาม aorta จนอุดหลอดเลือดส่วนปลาย' + c('5 Ch37') + ' <b>femoral a.</b> พบบ่อยที่สุด' + c('2'),
        'ก้อนจาก vein หรือหัวใจซีกขวาไปที่ <b>pulmonary a.</b>' + c('5 Ch37')
      ],
      say: 'Route: left heart, aorta, iliac, femoral. The 91 percent is from Blackshear 1996, 23 studies, abstract read; Sulague 2023 repeats about 90 percent. The chest film is a course recall file, not a published source.' },

    { id: 'f2', kind: 'flowtap', sec: 3, t: 45, tag: 'Build the flowchart', src: 'Case', known: ['occl', 'flow'], reveals: ['pulse', 'hypox', 'skin'],
      q: 'Less flow <b>alone</b> explains which <b>3</b> findings, before any cell runs out of energy?',
      chips: [{ t: 'Absent pulse', ok: 1 }, { t: 'Numbness' }, { t: 'Pale skin', ok: 1 }, { t: 'Cold skin', ok: 1 }, { t: 'Pain' }, { t: 'Cannot move toes' }],
      why: [
        '<b>Pulse</b>: pressure pulse เป็นคลื่นที่วิ่งไปตาม artery' + c('5 Ch15') + ' ตันสนิทจึงผ่านไม่ได้',
        '<b>Pale</b>: เลือดเข้าผิวหนังน้อยลง สีผิวจึงซีด' + c('8'),
        '<b>Cold</b>: ผิวหนังรับความร้อนจากเลือดที่ไหลมาจาก core' + c('5 Ch74'),
        '<b>Sudden, severe</b>: embolus ตันทันที ไม่มี collateral' + c('1,2') + ' ซึ่งต้องใช้เวลาเปิดและเติบโต' + c('5 Ch17'),
        'Lab: cuff 200 mmHg คือการอุดเลือดแดงชั่วคราวแบบเดียวกัน' + c('8')
      ],
      say: 'Blocked artery, less flow. Three of the six come straight from that. The other three need the middle box.' },

    { id: 'f5', kind: 'flowpoll', sec: 3, t: 60, tag: 'Build the flowchart', src: 'Case', known: ['occl', 'flow', 'pulse', 'hypox', 'skin'], reveals: ['atp', 'nerve', 'sens', 'pain'],
      q: 'Which <b>ATP-dependent</b> protein maintains the Na<sup>+</sup>/K<sup>+</sup> gradients of a resting nerve?',
      o: ['SERCA', 'Funny channel', 'Na<sup>+</sup>/K<sup>+</sup>-ATPase', 'Nicotinic ACh receptor'], a: 2,
      why: [
        '<b>&#8595;ATP</b>: ไม่มี O<sub>2</sub> เหลือ anaerobic glycolysis ได้พลังงานราว 3% ของ glucose พร้อม lactic acid' + c('5 Ch68'),
        'Nerve ขาดเลือด: ATP และ pump ลดลง &#8594; membrane <b>depolarize</b>' + c('5 Ch5, 10'),
        '<b>Tingling</b>: threshold ลดก่อน เกิด ectopic impulses' + c('10,11'),
        '<b>Numbness</b>: threshold เพิ่มภายหลัง' + c('10') + ' Na<sup>+</sup> channel ที่ inactivate เปิดไม่ได้จนกว่าจะ repolarize' + c('5 Ch5') + ' จึงน่าจะส่งสัญญาณไม่ได้',
        '<b>Pain</b>: lactic acid, bradykinin, proteolytic enzymes กระตุ้น pain nerve endings' + c('5 Ch49')
      ],
      say: 'No oxygen, little ATP. Pump falls, membrane depolarizes: tingling first, then numbness. If asked: the numbness step is reasoned from Akimoto plus Guyton, neither states it outright. Guyton explains pain by chemicals on pain endings, so the chart box is a simplification.' },

    { id: 'f6', kind: 'flowpoll', sec: 3, t: 50, tag: 'Build the flowchart', src: 'Case', known: ['occl', 'flow', 'pulse', 'hypox', 'skin', 'atp', 'nerve', 'sens', 'pain'], reveals: ['muscle', 'para'],
      q: 'Why can&#8217;t muscle contract normally without ATP?',
      o: ['Troponin C is destroyed', 'Actin filaments dissolve', 'ACh blocks the motor end plate', 'Crossbridge cycling fails: myosin needs ATP to release actin'], a: 3,
      why: [
        'Hypoxia ทำให้ ATP ใน skeletal muscle ลดลง' + c('9') + ' ATP โมเลกุลใหม่ทำให้ myosin หลุดจาก actin ขาด ATP จึงเกิด <b>abnormal crossbridge</b>' + c('5 Ch6'),
        'Paralysis จึงมาได้ <b>2 ทาง</b>: muscle และ nerve' + c('2'),
        '<b>เวลา</b>: เสียหายถาวรที่ nerve 4&#8211;6 ชม., muscle 6&#8211;8 ชม., skin 8&#8211;12 ชม.' + c('2') + ' บางแหล่งให้ 4&#8211;6 ชม. ทั้ง nerve และ muscle' + c('4') + ' เคสนี้มาที่ 3 ชม. จึงต้องรีบเปิดหลอดเลือด'
      ],
      say: 'Take-home in one breath: AF makes the clot, the block cuts flow, flow explains pulse, pale and cold; hypoxia and low ATP explain sensation, pain and weakness. At 3 hours the nerve window is about to close.' },

    { id: 'refs', kind: 'end', sec: 4, t: 10, tag: 'Vancouver', title: 'References',
      html: '<ol class="reflist">' +
        '<li>Olinic DM, Stanek A, T&#259;taru DA, Homorodean C, Olinic M. Acute limb ischemia: an update on diagnosis and management. J Clin Med. 2019 Aug 14;8(8):1215. <a href="https://doi.org/10.3390/jcm8081215">doi:10.3390/jcm8081215</a></li>' +
        '<li>Obara H, Matsubara K, Kitagawa Y. Acute limb ischemia. Ann Vasc Dis. 2018 Dec 25;11(4):443-8. <a href="https://doi.org/10.3400/avd.ra.18-00074">doi:10.3400/avd.ra.18-00074</a></li>' +
        '<li>Shukuzawa K, Ozawa H, Ohki T. Revascularization for acute limb ischemia. Ann Vasc Dis. 2026 May 23;19(1):26-00066. <a href="https://doi.org/10.3400/avd.ra.26-00066">doi:10.3400/avd.ra.26-00066</a></li>' +
        '<li>Simon F, Oberhuber A, Floros N, Busch A, Wagenh&#228;user MU, Schelzig H, et al. Acute limb ischemia: much more than just a lack of oxygen. Int J Mol Sci. 2018 Jan 26;19(2):374. <a href="https://doi.org/10.3390/ijms19020374">doi:10.3390/ijms19020374</a></li>' +
        '<li>Hall JE, Hall ME. Guyton and Hall textbook of medical physiology. 14th ed. Philadelphia: Elsevier; 2021. Ch 5, p. 66, 68; Ch 6, p. 84, 91; Ch 13, p. 166; Ch 15, p. 185-6; Ch 17, p. 212-3; Ch 37, p. 486; Ch 49, p. 614; Ch 68, p. 850; Ch 74, p. 901-2.</li>' +
        '<li>Sulague RM, Whitham T, Danganan LML, Effiom V, Candelario K, Latif N, et al. The left atrial appendage and atrial fibrillation: a contemporary review. J Clin Med. 2023 Nov 2;12(21):6909. <a href="https://doi.org/10.3390/jcm12216909">doi:10.3390/jcm12216909</a></li>' +
        '<li>Blackshear JL, Odell JA. Appendage obliteration to reduce stroke in cardiac surgical patients with atrial fibrillation. Ann Thorac Surg. 1996 Feb;61(2):755-9. <a href="https://doi.org/10.1016/0003-4975(95)00887-X">doi:10.1016/0003-4975(95)00887-X</a> [abstract]</li>' +
        '<li>&#3592;&#3640;&#3652;&#3619;&#3614;&#3619; &#3626;&#3617;&#3610;&#3640;&#3597;&#3623;&#3591;&#3588;&#3660;. &#3611;&#3599;&#3636;&#3610;&#3633;&#3605;&#3636;&#3585;&#3634;&#3619;&#3626;&#3619;&#3637;&#3619;&#3623;&#3636;&#3607;&#3618;&#3634; 16: &#3619;&#3632;&#3610;&#3610;&#3652;&#3627;&#3621;&#3648;&#3623;&#3637;&#3618;&#3609;&#3648;&#3621;&#3639;&#3629;&#3604;&#3586;&#3609;&#3634;&#3604;&#3648;&#3621;&#3655;&#3585; [&#3648;&#3629;&#3585;&#3626;&#3634;&#3619;&#3611;&#3599;&#3636;&#3610;&#3633;&#3605;&#3636;&#3585;&#3634;&#3619;]. &#3585;&#3619;&#3640;&#3591;&#3648;&#3607;&#3614;&#3631;: &#3616;&#3634;&#3588;&#3623;&#3636;&#3594;&#3634;&#3626;&#3619;&#3637;&#3619;&#3623;&#3636;&#3607;&#3618;&#3634; &#3588;&#3603;&#3632;&#3649;&#3614;&#3607;&#3618;&#3624;&#3634;&#3626;&#3605;&#3619;&#3660; &#3592;&#3640;&#3628;&#3634;&#3621;&#3591;&#3585;&#3619;&#3603;&#3660;&#3617;&#3627;&#3634;&#3623;&#3636;&#3607;&#3618;&#3634;&#3621;&#3633;&#3618;; [&#3652;&#3617;&#3656;&#3619;&#3632;&#3610;&#3640;&#3611;&#3637;].</li>' +
        '<li>Costa D, Ielapi N, Perri P, Minici R, Faga T, Michael A, et al. Molecular insight into acute limb ischemia. Biomolecules. 2024 Jul 11;14(7):838. <a href="https://doi.org/10.3390/biom14070838">doi:10.3390/biom14070838</a></li>' +
        '<li>Akimoto T, Ogawa K, Hara M, Ninomiya S, Ishihara M, Morita A, et al. Clinical features of acute ischemic stroke patients with hypoesthesia as an initial symptom. Neurol Int. 2023 Mar 15;15(1):508-17. <a href="https://doi.org/10.3390/neurolint15010030">doi:10.3390/neurolint15010030</a></li>' +
        '<li>Mogyoros I, Bostock H, Burke D. Mechanisms of paresthesias arising from healthy axons. Muscle Nerve. 2000 Mar;23(3):310-20. <a href="https://doi.org/10.1002/(SICI)1097-4598(200003)23:3%3C310::AID-MUS2%3E3.0.CO;2-A">doi:10.1002/(SICI)1097-4598(200003)23:3&lt;310::AID-MUS2&gt;3.0.CO;2-A</a> [abstract]</li>' +
        '</ol>' +
        '<p class="srcline">Figure, slide 3: chest film from the CVS I recall file AC81 CVS MCQ, labels from AC80 CVS1 MCQ. Internal course files, not published.</p>',
      say: 'Ten seconds: everything is cited in Vancouver style, DOIs are links. Tell them More practice stays on their phones.' },

    /* ========== MORE PRACTICE: after the talk, on their own ========== */

    { id: 'take', kind: 'concept', sec: BONUS, bonus: true, tag: 'Take-home', title: 'Three things to keep',
      html: '<ol class="takehome">' +
        '<li><b>Source</b>: AF &#8594; stasis in the <b>left atrial appendage</b> &#8594; embolus &#8594; <b>femoral artery</b>.</li>' +
        '<li><b>Mechanism</b>: <b>less flow</b> directly gives no pulse, cold and pale skin. <b>Hypoxia and &#8595;ATP</b> damage nerve and muscle, giving abnormal sensation, pain and paralysis.</li>' +
        '<li><b>Lab link</b>: same as a 200 mmHg cuff, so <b>no edema</b>. Acute means no time for <b>collaterals</b>.</li>' +
        '</ol>',
      say: 'Three lines to keep.' },

    { id: 'f3', kind: 'flowpoll', sec: BONUS, bonus: true, tag: 'Past exam in the flowchart', src: 'AC80', known: ['occl', 'flow', 'pulse', 'hypox', 'skin'], reveals: ['atp'],
      q: 'A patient experiences chest pain due to cardiac ischemia. What happens in anaerobic respiration of cardiac muscle?',
      o: ['Lactic acid from glycolysis', 'Fatty acid oxidation', 'Pyruvate accumulation in mitochondria', 'Use ketone body as main energy source'], a: 0,
      why: [
        'ไม่มี O<sub>2</sub> &#8594; oxidative phosphorylation หยุด &#8594; เหลือ <b>glycolysis</b> &#8594; pyruvate &#8594; <b>lactate</b>',
        'ได้ ATP น้อยมาก hypoxia จึงนำไปสู่ <b>&#8595;ATP</b>',
        'ข้อสอบถามหัวใจ แต่กล้ามเนื้อขาใช้หลักเดียวกัน'
      ],
      say: 'The exam asked about the heart. Same logic in the leg: no oxygen, little ATP.' },

    { id: 'f7', kind: 'trace', sec: BONUS, bonus: true, tag: 'Trace it', title: 'Trace each finding back to the block',
      traces: [
        { k: 'pulse', t: 'Absent pulse', path: ['occl', 'flow', 'pulse'], note: 'มาจาก flow ลดลงโดยตรง' },
        { k: 'pale', t: 'Pale', path: ['occl', 'flow', 'skin'], note: 'มาจาก flow ลดลงโดยตรง' },
        { k: 'cold', t: 'Cold', path: ['occl', 'flow', 'skin'], note: 'มาจาก flow ลดลงโดยตรง' },
        { k: 'numb', t: 'Numbness, tingling', path: ['occl', 'flow', 'hypox', 'atp', 'nerve', 'sens'], note: '&#8595;ATP &#8594; abnormal depolarization' },
        { k: 'pain', t: 'Severe pain', path: ['occl', 'flow', 'hypox', 'atp', 'nerve', 'pain'], note: 'hypoxia &#8594; nerve damage' },
        { k: 'weak', t: 'Cannot move toes', path: ['occl', 'flow', 'hypox', 'atp', 'nerve', 'muscle', 'para'], note: 'มาจากทั้ง nerve damage และ abnormal crossbridge' }
      ],
      say: 'Short on time? Tap only Absent pulse, Numbness and Cannot move toes.' },

    { id: 'qjvp', kind: 'poll', sec: BONUS, bonus: true, tag: 'Past exam', src: 'AC80',
      q: 'A patient has been diagnosed with atrial fibrillation. Which wave on the jugular venous pulse waveform should be <b>absent</b>?',
      o: ['a', 'c', 'x', 'v', 'y'], a: 0,
      figHtml: '<div class="jvpcompare">' +
        fig('jvp-normal.png', '<b>Normal JVP</b>.', 'Stanford Medicine 25, via Wikimedia Commons, public domain', 'jvpn') +
        fig('jvp-ac80.png', '<b>รูปในข้อสอบ</b>: ลูกศรชี้ที่เชิงของ a wave.', 'AC80', 'onlyrev') +
        '</div>',
      why: [
        'a wave เกิดจาก <b>right atrial contraction</b> เป็นยอดแรกในรูป normal',
        'AF: atria สั่นพลิ้ว ไม่บีบตัวพร้อมกัน ยอดแรกนี้จึงหายไป = <b>no a wave</b>'
      ],
      say: 'First to skip if you are behind. Point at the a wave on the normal trace, then cover it: that is AF. Same reason the clot forms: the atrium no longer squeezes.' },

    { id: 'l1', kind: 'poll', sec: BONUS, bonus: true, tag: 'Past exam', src: 'AC80',
      q: 'A cuff with a pressure of <b>200 mmHg</b> is applied on a patient&#8217;s arm for 5 minutes. Which of the following should <b>not</b> be found?',
      o: ['Pain', 'Edema', 'Cold', 'Lack of pulse', 'Pallor'], a: 1,
      why: [
        'Cuff 200 mmHg สูงกว่า SBP &#8594; เลือดแดงเข้าไม่ได้ <b>เหมือน femoral a. ตัน</b> (Lab microcirculation)',
        'ไม่มีเลือดเข้า capillary hydrostatic pressure จึงไม่เพิ่ม &#8594; <b>ไม่เกิด edema</b>',
        'เคสนี้ก็ไม่มี swelling ในประวัติ อาการตรงกับแขนในแลป'
      ],
      say: 'You felt this patient&#8217;s leg on your own arm in the lab: minutes there, three hours here.' },

    { id: 'q1', kind: 'poll', sec: BONUS, bonus: true, tag: 'Case question', src: 'Case',
      q: 'Before any imaging: which problem best fits this <b>pale, cold, pulseless</b> leg?',
      o: ['Venous occlusion (blood cannot get out)', 'Arterial occlusion (blood cannot get in)', 'Capillary leak', 'Lymphatic obstruction'], a: 1,
      why: [
        'ซีด + เย็น + คลำ pulse ไม่ได้ = เลือดแดง<b>เข้าไม่ได้</b>',
        'Venous occlusion เลือดเข้าได้แต่ออกไม่ได้: หลอดเลือดดำโป่ง ผิวคล้ำ ปลายนิ้วตึง และ<b>ยังคลำ pulse ได้</b> (Lab microcirculation: cuff 30&#8211;40 และ 80&#8211;90 mmHg)',
        'Capillary leak และ lymphatic obstruction ทำให้บวม แต่ไม่ทำให้ pulse หาย'
      ],
      say: 'Contrast with the venous occlusion step of the microcirculation lab.' },

    { id: 'ss', kind: 'concept', sec: BONUS, bonus: true, tag: 'Concept', title: 'Six findings, one mnemonic',
      html: '<div class="tblwrap"><table class="tbl big"><thead><tr><th>Symptoms and signs in this case</th><th>The 6 Ps</th></tr></thead><tbody>' +
        '<tr><td>Suddenly developed severe pain in left leg</td><td>{{<b>P</b>ain}}</td></tr>' +
        '<tr><td>Pale</td><td>{{<b>P</b>allor}}</td></tr>' +
        '<tr><td>Numbness and tingling sensations</td><td>{{<b>P</b>aresthesia}}</td></tr>' +
        '<tr><td>Cold</td><td>{{<b>P</b>oikilothermia}}</td></tr>' +
        '<tr><td>Absent pulse below femoral artery</td><td>{{<b>P</b>ulselessness}}</td></tr>' +
        '<tr><td>Unable to move his toe</td><td>{{<b>P</b>aralysis}}</td></tr>' +
        '</tbody></table></div>' +
        '<p class="note">6 Ps เป็น mnemonic ทางคลินิกช่วยจำ ไม่ได้อยู่ในสไลด์บรรยาย</p>',
      say: 'The left column is the case; the right is a memory aid.' },

    { id: 'qekg', kind: 'poll', sec: BONUS, bonus: true, tag: 'Past exam', src: 'AC77',
      q: 'What is an EKG finding during atrial fibrillation?',
      o: ['Regular rhythm', 'Pulse deficit', 'Tall P wave', 'Narrow QRS complexes', 'Slow ventricular rate'], a: 3,
      figAfter: fig('ecg-fig10-1.png', 'P wave = atrial depolarization: AF ไม่มี P wave.', 'Lab direction ECG, Fig. 10-1', 'small'),
      why: [
        'ไม่มี P wave, RR ไม่สม่ำเสมอ แต่การนำไฟฟ้าผ่าน His&#8211;Purkinje ยังปกติ จึงเห็น <b>narrow QRS</b>',
        'Pulse deficit เป็นสิ่งที่ตรวจพบจากการคลำชีพจร ไม่ใช่ ECG'
      ],
      say: 'Trap: pulse deficit is true of AF, but it is an exam finding, not an EKG finding.' },

    { id: 'af', kind: 'concept', sec: BONUS, bonus: true, tag: 'Concept', title: 'AF on one page',
      html: '<div class="two">' +
        '<div class="stack">' + fig('af-doglab.png', 'AF in the dog lab: BP swings, HR 50 and irregular, PP widens.', 'Lab Disturbance of CVS II') + '</div>' +
        '<div class="tblwrap"><table class="tbl"><thead><tr><th>Look at</th><th>In AF</th></tr></thead><tbody>' +
        '<tr><td>ECG</td><td>{{no P wave}}, RR {{irregular}}, QRS {{narrow}}</td></tr>' +
        '<tr><td>JVP</td><td>no {{a wave}}</td></tr>' +
        '<tr><td>Radial pulse</td><td>irregular, {{pulse deficit}}</td></tr>' +
        '<tr><td>Starts in</td><td>{{left atrium}}, not the AV node</td></tr>' +
        '<tr><td>Clot forms in</td><td>{{left atrial appendage}}</td></tr>' +
        '</tbody></table></div></div>',
      say: 'The fibrillation starts in the left atrium; the AV node only passes some impulses down.' },

    { id: 'f5b', kind: 'concept', sec: BONUS, bonus: true, tag: 'Zoom in', title: 'Why tingling, then numbness?',
      html: '<div class="two">' +
        '<div class="stack">' + fig('fast-ap-labslide.png', 'Phase 4 ตั้งอยู่ที่ K<sup>+</sup> equilibrium potential. เป็นกราฟของ cardiac myocyte แต่หลักการเดียวกับ nerve membrane.', 'Lab slide: heart contraction') + '</div>' +
        '<ol class="steps">' +
        '<li>&#8595;ATP &#8594; {{Na<sup>+</sup>/K<sup>+</sup>-ATPase}} หยุด</li>' +
        '<li>Na<sup>+</sup> {{สะสมในเซลล์}} และ K<sup>+</sup> {{รั่วออกนอกเซลล์}}</li>' +
        '<li>Resting potential {{ไม่ลบเท่าเดิม (depolarized)}}</li>' +
        '<li>ช่วงแรก nerve ยิงเองผิดปกติ &#8594; {{tingling}}</li>' +
        '<li>Depolarized นานขึ้น Na<sup>+</sup> channel {{inactivate}} &#8594; ส่งสัญญาณไม่ได้ &#8594; {{numbness}}</li>' +
        '</ol></div>',
      say: 'Hold on to depolarization block; it comes back in a later question.' },

    { id: 'l2', kind: 'concept', sec: BONUS, bonus: true, tag: 'Lab link', title: 'You already did this in the microcirculation lab',
      html: '<div class="tblwrap"><table class="tbl"><caption>ตารางที่ 16-1 การตอบสนองที่บริเวณแขนขณะอุดกั้นการไหลเวียนเลือดแดง</caption>' +
        '<thead><tr><th>การทดสอบ</th><th>ผิวหนังแขนที่รัด</th><th>ความรู้สึก</th><th>Reactive hyperemia</th></tr></thead><tbody>' +
        '<tr><td>Cuff 200 mmHg, 1 นาที</td><td>{{ซีด}} เทียบกับแขนอีกข้าง</td><td>{{เริ่มชา เสียว}}</td><td>&#215;</td></tr>' +
        '<tr><td>ครบ 5 นาที</td><td>{{ซีด เย็น คลำ pulse ไม่ได้}}</td><td>{{ปวด ชา}}</td><td>&#215;</td></tr>' +
        '<tr><td>ลด cuff</td><td>{{แดงสด อุ่น}}</td><td>{{ค่อย ๆ ดีขึ้น}}</td><td>{{มี}}</td></tr>' +
        '</tbody></table></div>' +
        '<div class="cols2"><div class="mini"><h4>เหมือนกับเคส</h4><p>เลือดแดงเข้าไม่ได้ จึงซีด เย็น pulse หาย ปวด ชา และไม่บวม</p></div>' +
        '<div class="mini art"><h4>ต่างจากเคส</h4><p>แขนในแลปตัน {{5 นาที}} แล้วหาย ส่วนขาตัน {{3 ชั่วโมง}} จนมี {{weakness}}</p></div></div>' +
        '<p class="srcline">Table headings: Lab direction: Microcirculation. Expected results are filled in for teaching.</p>',
      say: 'Ask who remembers how their arm felt at five minutes.' },

    { id: 'l3', kind: 'poll', sec: BONUS, bonus: true, tag: 'Past exam', src: 'AC79',
      q: 'Which of the following describes a key physiological event occurring during this period of <b>reactive hyperemia</b> after release of tourniquet?',
      o: ['A sustained decrease in capillary permeability, preventing fluid extravasation', 'Significant accumulation of vasoconstrictive metabolites in the interstitial fluid', 'A rapid and marked decrease in deoxyhemoglobin levels in the affected tissues', 'Decreased nitric oxide production, leading to localized vasoconstriction', 'Enhanced oxygen extraction by tissues due to reduced metabolic demand'], a: 2,
      why: [
        'ระหว่างตัน vasodilator metabolites คั่งจน arteriole ขยาย',
        'พอเปิด เลือดแดงทะลักเข้า &#8594; <b>deoxyhemoglobin ลดลงเร็ว</b> ผิวแดงสดและอุ่น',
        'ถ้าเอา clot ของผู้ป่วยออก ขาก็ควรแดงขึ้นด้วยกลไกเดียวกัน'
      ],
      say: 'Imagine the surgeon removes the clot: same as your arm when the cuff came off.' },

    { id: 'l4', kind: 'poll', sec: BONUS, bonus: true, tag: 'Past exam', src: 'AC77',
      q: 'What is the most likely to develop if the patient has <b>chronic</b> vascular obstruction?',
      o: ['Collateral circulation', 'Decreased release of epinephrine', 'Increased production of nitric oxide', 'Increased sympathetic nerve activity', 'Reactive hyperemia'], a: 0,
      why: [
        'ตันเรื้อรัง หลอดเลือดแตกแขนงให้เลือดไปเลี้ยงส่วนถัดไปได้เพียงพอ = <b>collateral circulation</b> <span class="src">Lab direction: Microcirculation 1.2</span>',
        'เคสนี้ embolus ตัน<b>ทันที</b> ไม่มีเวลาสร้าง collateral อาการจึงรุนแรงและเกิดเร็ว'
      ],
      say: 'This is what acute means in the diagnosis: no time to build a detour.' },

    { id: 'x1', kind: 'poll', sec: BONUS, bonus: true, tag: 'Past exam', src: 'AC81',
      q: 'A patient is given digoxin, a cardiac glycoside. What is the effect?',
      o: ['Increase intracellular K level', 'Increase relaxation time', 'Increase intracellular Na level', 'Decrease SR calcium load', 'Decrease contractility'], a: 2,
      why: [
        'Digoxin ยับยั้ง <b>Na<sup>+</sup>/K<sup>+</sup>-ATPase</b> ตัวเดียวกับที่หยุดเมื่อ ATP หมด',
        'จึงมี <b>intracellular Na<sup>+</sup> เพิ่มขึ้น</b> และ intracellular K<sup>+</sup> ลดลง',
        'ต่างกันที่ digoxin ยับยั้งบางส่วนจนหัวใจบีบแรงขึ้น ส่วน ischemia คือพลังงานหมด'
      ],
      say: 'Same pump, different cause.' },

    { id: 'x2', kind: 'poll', sec: BONUS, bonus: true, tag: 'Past exam', src: 'AC78',
      q: 'Which of the following does <b>not</b> cause a depolarization block?',
      o: ['AV nodal block', 'Increased extracellular potassium concentration', 'RMP becoming less negative', 'High-dose nicotine at the ganglion', 'Increased stimulation at nicotinic acetylcholine (ACh) receptors'], a: 0,
      why: [
        'Depolarization block = membrane ค้าง depolarized จน Na<sup>+</sup> channel inactivate และยิงไม่ได้',
        '<b>AV nodal block</b> เป็นการนำไฟฟ้าผ่าน AV node ช้าลงหรือถูกกั้น คนละกลไก',
        'Nerve ที่ขาด ATP ก็ RMP ไม่ลบเช่นกัน นี่คือที่มาของ numbness'
      ],
      say: 'Less negative RMP is the same reason the foot goes numb.' },

    { id: 'recall', kind: 'recall', sec: BONUS, bonus: true, tag: 'Recall', title: 'Now without help: rebuild the whole flowchart',
      say: 'Say each box before it appears. One click per box.' }
  ];

  return { slides: slides, sections: sections, flow: flow };
})();
