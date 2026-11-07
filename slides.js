/* Case 4: Acute limb ischemia. All slide content lives here.
   {{text}} = click-to-reveal cloze blank. [[text]] = tappable phrase, [[+text]] = tappable phrase that is correct.
   The case text is verbatim. The flowchart follows the lecture's mechanism. */
window.ALI = (function () {

  var CASE = [
    'A 68-year-old man with a history of atrial fibrillation suddenly developed severe pain in his left leg 3 hours ago.',
    'When he arrived at the emergency room, his leg appeared pale compared to the right side. He complained of numbness and tingling sensations along the left foot.',
    'On examination, the left leg felt cold to touch, and pulses below the femoral artery were absent. The patient was unable to move his toes properly, showing some degree of weakness.',
    'A computed tomography angiogram was performed and revealed complete occlusion of the left femoral artery. He was diagnosed with acute limb ischemia due to arterial embolism.'
  ];

  /* The same text with tappable phrases. */
  var CASE_TAP =
    'A [[68-year-old man]] with a [[history of atrial fibrillation]] [[+suddenly developed severe pain in his left leg]] [[3 hours ago]]. ' +
    'When he arrived at the emergency room, [[+his leg appeared pale]] compared to the right side. He complained of [[+numbness and tingling sensations]] along the left foot. ' +
    'On examination, [[+the left leg felt cold to touch]], and [[+pulses below the femoral artery were absent]]. The patient was [[+unable to move his toes properly]], showing some degree of weakness. ' +
    '<span class="newtxt">A computed tomography angiogram was performed and revealed [[complete occlusion of the left femoral artery]]. He was diagnosed with acute limb ischemia due to arterial embolism.</span>';

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
    { k: 'A', name: 'The case' },
    { k: 'B', name: 'Clot source' },
    { k: 'C', name: 'Mechanism' },
    { k: 'D', name: 'Lab link' },
    { k: 'E', name: 'Exam radar' },
    { k: 'F', name: 'Recap' }
  ];

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
      '</div><figcaption>Left heart border on a PA film. <span class="src">AC81 Imaging, labels from AC80</span></figcaption></figure>';
  }

  var slides = [

    /* ---------- title ---------- */
    { id: 'start', kind: 'title', sec: -1,
      say: 'Leave this up while people arrive. Everyone scans. Any page&#8217;s QR opens that same page on their phone, so late joiners land where you are.' },

    /* ---------- A. the case ---------- */
    { id: 'c1', kind: 'frag', sec: 0, tag: 'Case', title: 'A patient arrives at the ER',
      frags: [CASE[0], CASE[1], CASE[2]],
      prompt: 'ระหว่างฟัง ลองคิดว่า <b>หลอดเลือดแบบไหน</b> มีปัญหา',
      say: 'Read one sentence per click. After the exam sentence, stop and let them guess before the next slide.' },

    { id: 'q1', kind: 'poll', sec: 0, tag: 'Case question', src: 'Case',
      q: 'Before any imaging: which problem best fits this <b>pale, cold, pulseless</b> leg?',
      o: ['Venous occlusion (blood cannot get out)', 'Arterial occlusion (blood cannot get in)', 'Capillary leak', 'Lymphatic obstruction'], a: 1,
      why: [
        'ซีด + เย็น + คลำ pulse ไม่ได้ = เลือดแดง<b>เข้าไม่ได้</b>',
        'Venous occlusion เลือดเข้าได้แต่ออกไม่ได้: หลอดเลือดดำโป่ง ผิวคล้ำ ปลายนิ้วตึง และ<b>ยังคลำ pulse ได้</b> (Lab microcirculation: cuff 30&#8211;40 และ 80&#8211;90 mmHg)',
        'Capillary leak และ lymphatic obstruction ทำให้บวม แต่ไม่ทำให้ pulse หาย'
      ],
      say: 'Contrast with the venous occlusion step of the microcirculation lab: engorged and dusky versus pale and cold.' },

    { id: 'tap', kind: 'tap', sec: 0, tag: 'Find them', src: 'Case',
      title: 'The full case: tap every <span class="hl">symptom and sign</span>',
      text: CASE_TAP,
      why: [
        'อายุ ประวัติ AF และ &#8220;3 hours ago&#8221; เป็น<b>ปัจจัยเสี่ยงและเวลา</b> ไม่ใช่อาการ',
        'ผล CT angiogram เป็น <b>investigation</b> และเป็นตัวยืนยันการวินิจฉัย'
      ],
      say: 'The last two sentences are new: CT angiogram and the diagnosis. Give them 30 seconds to tap. Six phrases are correct.' },

    { id: 'ss', kind: 'concept', sec: 0, tag: 'Concept', title: 'Six findings, one mnemonic',
      html: '<div class="tblwrap"><table class="tbl big"><thead><tr><th>Symptoms and signs in this case</th><th>The 6 Ps</th></tr></thead><tbody>' +
        '<tr><td>Suddenly developed severe pain in left leg</td><td>{{<b>P</b>ain}}</td></tr>' +
        '<tr><td>Pale</td><td>{{<b>P</b>allor}}</td></tr>' +
        '<tr><td>Numbness and tingling sensations</td><td>{{<b>P</b>aresthesia}}</td></tr>' +
        '<tr><td>Cold</td><td>{{<b>P</b>oikilothermia}}</td></tr>' +
        '<tr><td>Absent pulse below femoral artery</td><td>{{<b>P</b>ulselessness}}</td></tr>' +
        '<tr><td>Unable to move his toe</td><td>{{<b>P</b>aralysis}}</td></tr>' +
        '</tbody></table></div>' +
        '<p class="note">6 Ps เป็น mnemonic ทางคลินิกช่วยจำ ไม่ได้อยู่ในสไลด์บรรยาย ส่วนหกข้อทางซ้ายคือสิ่งที่ต้องอธิบายให้ได้ด้วยกลไกเดียว</p>',
      say: 'Reveal one P per click. Then ask: can one mechanism explain all six? That sets up the flowchart.' },

    /* ---------- B. where the clot came from ---------- */
    { id: 'q2', kind: 'poll', sec: 1, tag: 'Case question', src: 'Case', layout: 'fig',
      q: 'He has <b>atrial fibrillation</b>. Where did this embolus most likely form?',
      o: ['Right atrial appendage', 'Femoral vein', 'Left atrial appendage', 'Left ventricular outflow tract'], a: 2,
      figHtml: cxr(),
      why: [
        'AF: atria สั่นพลิ้ว ไม่บีบตัวเป็นจังหวะ &#8594; เลือดคั่ง (stasis) ใน <b>left atrial appendage</b> &#8594; เกิด thrombus',
        'หลุดเป็น embolus: LA &#8594; LV &#8594; aorta &#8594; iliac &#8594; <b>femoral a.</b> แล้วติดตรงที่หลอดเลือดเล็กลง',
        'ก้อนจาก femoral vein หรือหัวใจซีกขวาไปติดที่ <b>pulmonary a.</b> ไม่ใช่ขา'
      ],
      say: 'Point to the orange arrow on the film. Then trace the route out loud: left heart, aorta, iliac, femoral.' },

    { id: 'qjvp', kind: 'poll', sec: 1, tag: 'Past exam', src: 'AC80',
      q: 'A patient has been diagnosed with atrial fibrillation. Which wave on the jugular venous pulse waveform should be <b>absent</b>?',
      o: ['a', 'c', 'x', 'v', 'y'], a: 0,
      figAfter: fig('jvp-ac80.png', 'a wave ใน JVP.', 'AC80', 'small'),
      why: [
        'a wave เกิดจาก <b>right atrial contraction</b>',
        'AF: atria สั่นพลิ้ว ไม่มีการบีบตัวที่พร้อมเพรียง จึงไม่มี a wave'
      ],
      say: 'Quick exam item. Same idea as the clot: in AF the atrium no longer squeezes.' },

    { id: 'qekg', kind: 'poll', sec: 1, tag: 'Past exam', src: 'AC77',
      q: 'What is an EKG finding during atrial fibrillation?',
      o: ['Regular rhythm', 'Pulse deficit', 'Tall P wave', 'Narrow QRS complexes', 'Slow ventricular rate'], a: 3,
      figAfter: fig('ecg-fig10-1.png', 'P wave = atrial depolarization: AF ไม่มี P wave.', 'Lab direction ECG, Fig. 10-1', 'small'),
      why: [
        'ไม่มี P wave, RR ไม่สม่ำเสมอ แต่การนำไฟฟ้าผ่าน His&#8211;Purkinje ยังปกติ จึงเห็น <b>narrow QRS</b>',
        'Pulse deficit เป็นสิ่งที่ตรวจพบจากการคลำชีพจร ไม่ใช่ ECG'
      ],
      say: 'Trap: pulse deficit is true of AF, but it is an exam finding, not an EKG finding.' },

    { id: 'af', kind: 'concept', sec: 1, tag: 'Concept', title: 'AF on one page',
      html: '<div class="two">' +
        '<div class="stack">' + fig('af-doglab.png', 'AF in the dog lab: BP swings, HR 50 and irregular, PP widens.', 'Lab Disturbance of CVS II') + '</div>' +
        '<div class="tblwrap"><table class="tbl"><thead><tr><th>Look at</th><th>In AF</th></tr></thead><tbody>' +
        '<tr><td>ECG</td><td>{{no P wave}}, RR {{irregular}}, QRS {{narrow}}</td></tr>' +
        '<tr><td>JVP</td><td>no {{a wave}}</td></tr>' +
        '<tr><td>Radial pulse</td><td>irregular, {{pulse deficit}}</td></tr>' +
        '<tr><td>Starts in</td><td>{{left atrium}}, not the AV node</td></tr>' +
        '<tr><td>Clot forms in</td><td>{{left atrial appendage}}</td></tr>' +
        '</tbody></table></div></div>',
      say: 'Trap to name: the fibrillation starts in the left atrium; the AV node only passes some impulses down.' },

    /* ---------- C. build the flowchart ---------- */
    { id: 'f1', kind: 'flowpoll', sec: 2, tag: 'Build the flowchart', src: 'Case', known: ['occl'], reveals: ['flow'],
      q: 'The femoral artery is completely blocked. What happens <b>first</b> below the block?',
      o: ['Reactive hyperemia', 'Increased capillary filtration and edema', 'Suddenly decreased blood flow to the distal part', 'Collateral circulation opens up'], a: 2,
      why: [
        'เลือดแดงผ่านไม่ได้ flow ส่วน distal จึง<b>ลดลงทันที</b> ทุกอาการเริ่มจากจุดนี้',
        'Collateral ต้องใช้เวลานาน ส่วน reactive hyperemia เกิดหลัง<b>เปิด</b>หลอดเลือด'
      ],
      say: 'Every box from here on is theirs to predict. Reveal one box at a time.' },

    { id: 'f2', kind: 'flowtap', sec: 2, tag: 'Build the flowchart', src: 'Case', known: ['occl', 'flow'], reveals: ['pulse', 'hypox', 'skin'],
      q: 'Less flow <b>alone</b> explains which findings, before any cell runs out of energy? <span class="muted">Tap all that apply.</span>',
      chips: [{ t: 'Absent pulse', ok: 1 }, { t: 'Numbness' }, { t: 'Pale skin', ok: 1 }, { t: 'Cold skin', ok: 1 }, { t: 'Pain' }, { t: 'Cannot move toes' }],
      why: [
        '<b>Pulse</b>: คลื่นความดันจาก stroke volume ผ่านจุดตันไม่ได้',
        '<b>Pale</b>: เลือดเข้าผิวหนังน้อยลง สีผิวจึงซีด',
        '<b>Cold</b>: เนื้อเยื่อนำความร้อนไม่ดี ต้องอาศัยเลือดพาความร้อน',
        'ชา ปวด อ่อนแรง ต้องผ่าน <b>tissue hypoxia</b> ก่อน <span class="src">Lab direction: Microcirculation 1.2&#8211;1.3</span>'
      ],
      say: 'Three of the six come straight from no flow. The other three need the middle box: tissue hypoxia.' },

    { id: 'f3', kind: 'flowpoll', sec: 2, tag: 'Past exam in the flowchart', src: 'AC80', known: ['occl', 'flow', 'pulse', 'hypox', 'skin'], reveals: ['atp'],
      q: 'A patient experiences chest pain due to cardiac ischemia. What happens in anaerobic respiration of cardiac muscle?',
      o: ['Lactic acid from glycolysis', 'Fatty acid oxidation', 'Pyruvate accumulation in mitochondria', 'Use ketone body as main energy source'], a: 0,
      why: [
        'ไม่มี O<sub>2</sub> &#8594; oxidative phosphorylation หยุด &#8594; เหลือ <b>glycolysis</b> &#8594; pyruvate &#8594; <b>lactate</b>',
        'ได้ ATP น้อยมาก hypoxia จึงนำไปสู่ <b>&#8595;ATP</b>',
        'ข้อสอบถามหัวใจ แต่กล้ามเนื้อขาใช้หลักเดียวกัน'
      ],
      say: 'The exam asked this about the heart. The logic is the same in the leg: no oxygen, little ATP.' },

    { id: 'f4', kind: 'flowpoll', sec: 2, tag: 'Build the flowchart', src: 'Case', known: ['occl', 'flow', 'pulse', 'hypox', 'skin', 'atp'], reveals: ['nerve', 'muscle'],
      q: 'Numbness, pain and weakness are left to explain. Which two tissues does <b>&#8595;ATP</b> damage to cause them?',
      o: ['Skin and bone', 'Nerve and muscle', 'Artery and vein', 'Fat and cartilage'], a: 1,
      why: [
        '<b>Nerve</b> ใช้ ATP รักษา membrane potential',
        '<b>Muscle</b> ใช้ ATP ในการหดตัว'
      ],
      say: 'Ask which tissues burn the most ATP. Nerve keeps its gradient; muscle cycles crossbridges.' },

    { id: 'f5', kind: 'flowpoll', sec: 2, tag: 'Build the flowchart', src: 'Case', known: ['occl', 'flow', 'pulse', 'hypox', 'skin', 'atp', 'nerve', 'muscle'], reveals: ['sens', 'pain'],
      q: 'Which <b>ATP-dependent</b> protein keeps a nerve&#8217;s resting membrane potential?',
      o: ['SERCA', 'Funny channel', 'Na<sup>+</sup>/K<sup>+</sup>-ATPase', 'Nicotinic ACh receptor'], a: 2,
      why: [
        'ATP หมด &#8594; Na<sup>+</sup>/K<sup>+</sup>-ATPase หยุด &#8594; <b>abnormal depolarization</b> &#8594; abnormal sensation',
        'Nerve damage ทำให้เกิด <b>pain</b> ด้วย'
      ],
      say: 'Two boxes appear: abnormal sensation and pain. Next slide zooms into why.' },

    { id: 'f5b', kind: 'concept', sec: 2, tag: 'Zoom in', title: 'Why tingling, then numbness?',
      html: '<div class="two">' +
        '<div class="stack">' + fig('fast-ap-labslide.png', 'Phase 4 ตั้งอยู่ที่ K<sup>+</sup> equilibrium potential. เป็นกราฟของ cardiac myocyte แต่หลักการเดียวกับ nerve membrane.', 'Lab slide: heart contraction') + '</div>' +
        '<ol class="steps">' +
        '<li>&#8595;ATP &#8594; {{Na<sup>+</sup>/K<sup>+</sup>-ATPase}} หยุด</li>' +
        '<li>Na<sup>+</sup> {{สะสมในเซลล์}} และ K<sup>+</sup> {{รั่วออกนอกเซลล์}}</li>' +
        '<li>Resting potential {{ไม่ลบเท่าเดิม (depolarized)}}</li>' +
        '<li>ช่วงแรก nerve ยิงเองผิดปกติ &#8594; {{tingling}}</li>' +
        '<li>Depolarized นานขึ้น Na<sup>+</sup> channel {{inactivate}} &#8594; ส่งสัญญาณไม่ได้ &#8594; {{numbness}}</li>' +
        '</ol></div>',
      say: 'This is why the patient says tingling and numbness together. Hold on to depolarization block; it comes back in Exam radar.' },

    { id: 'f6', kind: 'flowpoll', sec: 2, tag: 'Build the flowchart', src: 'Case', known: ['occl', 'flow', 'pulse', 'hypox', 'skin', 'atp', 'nerve', 'muscle', 'sens', 'pain'], reveals: ['para'],
      q: 'Why can&#8217;t muscle contract normally without ATP?',
      o: ['Troponin C is destroyed, so Ca<sup>2+</sup> can no longer start contraction', 'Actin filaments dissolve within minutes', 'ACh builds up and blocks the motor end plate', 'Myosin needs ATP to release actin and reset, so crossbridge cycling fails'], a: 3,
      why: [
        'ATP จับ myosin head &#8594; หลุดจาก actin และพร้อมทำ power stroke ครั้งต่อไป ไม่มี ATP จึงเกิด <b>abnormal crossbridge</b>',
        'Paralysis จึงมาได้ <b>2 ทาง</b>: nerve damage (สัญญาณไม่ถึงกล้ามเนื้อ) + muscle damage'
      ],
      say: 'The last box has two arrows into it. That is the point of this slide: weakness comes from both nerve and muscle.' },

    { id: 'f7', kind: 'trace', sec: 2, tag: 'Trace it', title: 'Trace each finding back to the block',
      traces: [
        { k: 'pulse', t: 'Absent pulse', path: ['occl', 'flow', 'pulse'], note: 'มาจาก flow ลดลงโดยตรง' },
        { k: 'pale', t: 'Pale', path: ['occl', 'flow', 'skin'], note: 'มาจาก flow ลดลงโดยตรง' },
        { k: 'cold', t: 'Cold', path: ['occl', 'flow', 'skin'], note: 'มาจาก flow ลดลงโดยตรง' },
        { k: 'numb', t: 'Numbness, tingling', path: ['occl', 'flow', 'hypox', 'atp', 'nerve', 'sens'], note: '&#8595;ATP &#8594; abnormal depolarization' },
        { k: 'pain', t: 'Severe pain', path: ['occl', 'flow', 'hypox', 'atp', 'nerve', 'pain'], note: 'hypoxia &#8594; nerve damage' },
        { k: 'weak', t: 'Cannot move toes', path: ['occl', 'flow', 'hypox', 'atp', 'nerve', 'muscle', 'para'], note: 'มาจากทั้ง nerve damage และ abnormal crossbridge' }
      ],
      say: 'Click through all six findings. Ask the room to say the path before you reveal it.' },

    /* ---------- D. lab link ---------- */
    { id: 'l1', kind: 'poll', sec: 3, tag: 'Past exam', src: 'AC80',
      q: 'A cuff with a pressure of <b>200 mmHg</b> is applied on a patient&#8217;s arm for 5 minutes. Which of the following should <b>not</b> be found?',
      o: ['Pain', 'Edema', 'Cold', 'Lack of pulse', 'Pallor'], a: 1,
      why: [
        'Cuff 200 mmHg สูงกว่า SBP &#8594; เลือดแดงเข้าไม่ได้ <b>เหมือน femoral a. ตัน</b>',
        'ไม่มีเลือดเข้า capillary hydrostatic pressure จึงไม่เพิ่ม &#8594; <b>ไม่เกิด edema</b>',
        'เคสนี้ก็ไม่มี swelling ในประวัติ: อาการตรงกับแขนในแลปเลย'
      ],
      say: 'You have already felt this patient&#8217;s leg on your own arm. Next slide puts the lab next to the case.' },

    { id: 'l2', kind: 'concept', sec: 3, tag: 'Lab link', title: 'You already did this in the microcirculation lab',
      html: '<div class="tblwrap"><table class="tbl"><caption>ตารางที่ 16-1 การตอบสนองที่บริเวณแขนขณะอุดกั้นการไหลเวียนเลือดแดง</caption>' +
        '<thead><tr><th>การทดสอบ</th><th>ผิวหนังแขนที่รัด</th><th>ความรู้สึก</th><th>Reactive hyperemia</th></tr></thead><tbody>' +
        '<tr><td>Cuff 200 mmHg, 1 นาที</td><td>{{ซีด}} เทียบกับแขนอีกข้าง</td><td>{{เริ่มชา เสียว}}</td><td>&#215;</td></tr>' +
        '<tr><td>ครบ 5 นาที</td><td>{{ซีด เย็น คลำ pulse ไม่ได้}}</td><td>{{ปวด ชา}}</td><td>&#215;</td></tr>' +
        '<tr><td>ลด cuff</td><td>{{แดงสด อุ่น}}</td><td>{{ค่อย ๆ ดีขึ้น}}</td><td>{{มี}}</td></tr>' +
        '</tbody></table></div>' +
        '<div class="cols2"><div class="mini"><h4>เหมือนกับเคส</h4><p>เลือดแดงเข้าไม่ได้ จึงซีด เย็น pulse หาย ปวด ชา และไม่บวม</p></div>' +
        '<div class="mini art"><h4>ต่างจากเคส</h4><p>แขนในแลปตัน {{5 นาที}} แล้วหาย ส่วนขาตัน {{3 ชั่วโมง}} จนมี {{weakness}}</p></div></div>' +
        '<p class="srcline">Table headings: Lab direction: Microcirculation. Expected results are filled in for teaching.</p>',
      say: 'Ask who remembers how their arm felt at five minutes. Then the difference: minutes versus hours.' },

    { id: 'l3', kind: 'poll', sec: 3, tag: 'Past exam', src: 'AC79',
      q: 'Which of the following describes a key physiological event occurring during this period of <b>reactive hyperemia</b> after release of tourniquet?',
      o: ['A sustained decrease in capillary permeability, preventing fluid extravasation', 'Significant accumulation of vasoconstrictive metabolites in the interstitial fluid', 'A rapid and marked decrease in deoxyhemoglobin levels in the affected tissues', 'Decreased nitric oxide production, leading to localized vasoconstriction', 'Enhanced oxygen extraction by tissues due to reduced metabolic demand'], a: 2,
      why: [
        'ระหว่างตัน vasodilator metabolites คั่งจน arteriole ขยาย',
        'พอเปิด เลือดแดงทะลักเข้า &#8594; <b>deoxyhemoglobin ลดลงเร็ว</b> ผิวแดงสดและอุ่น',
        'ถ้าเอา clot ของผู้ป่วยออก ขาก็ควรแดงขึ้นด้วยกลไกเดียวกัน'
      ],
      say: 'Imagine the surgeon removes the clot. What should the leg do? Same as your arm when the cuff came off.' },

    { id: 'l4', kind: 'poll', sec: 3, tag: 'Past exam', src: 'AC77',
      q: 'What is the most likely to develop if the patient has <b>chronic</b> vascular obstruction?',
      o: ['Collateral circulation', 'Decreased release of epinephrine', 'Increased production of nitric oxide', 'Increased sympathetic nerve activity', 'Reactive hyperemia'], a: 0,
      why: [
        'ตันเรื้อรัง หลอดเลือดแตกแขนงให้เลือดไปเลี้ยงส่วนถัดไปได้เพียงพอ = <b>collateral circulation</b> <span class="src">Lab direction: Microcirculation 1.2</span>',
        'เคสนี้ embolus ตัน<b>ทันที</b> ไม่มีเวลาสร้าง collateral อาการจึงรุนแรงและเกิดเร็ว'
      ],
      say: 'This is what &#8220;acute&#8221; means in the diagnosis: no time to build a detour.' },

    /* ---------- E. exam radar ---------- */
    { id: 'x1', kind: 'poll', sec: 4, tag: 'Past exam', src: 'AC81',
      q: 'A patient is given digoxin, a cardiac glycoside. What is the effect?',
      o: ['Increase intracellular K level', 'Increase relaxation time', 'Increase intracellular Na level', 'Decrease SR calcium load', 'Decrease contractility'], a: 2,
      why: [
        'Digoxin ยับยั้ง <b>Na<sup>+</sup>/K<sup>+</sup>-ATPase</b> ตัวเดียวกับที่หยุดเมื่อ ATP หมด',
        'จึงมี <b>intracellular Na<sup>+</sup> เพิ่มขึ้น</b> และ intracellular K<sup>+</sup> ลดลง',
        'ต่างกันที่ digoxin ยับยั้งบางส่วนจนหัวใจบีบแรงขึ้น ส่วน ischemia คือพลังงานหมด'
      ],
      say: 'Same pump, different cause. A drug inhibits it here; lack of ATP stops it in the leg.' },

    { id: 'x2', kind: 'poll', sec: 4, tag: 'Past exam', src: 'AC78',
      q: 'Which of the following does <b>not</b> cause a depolarization block?',
      o: ['AV nodal block', 'Increased extracellular potassium concentration', 'RMP becoming less negative', 'High-dose nicotine at the ganglion', 'Increased stimulation at nicotinic acetylcholine (ACh) receptors'], a: 0,
      why: [
        'Depolarization block = membrane ค้าง depolarized จน Na<sup>+</sup> channel inactivate และยิงไม่ได้',
        '<b>AV nodal block</b> เป็นการนำไฟฟ้าผ่าน AV node ช้าลงหรือถูกกั้น คนละกลไก',
        'Nerve ที่ขาด ATP ก็ RMP ไม่ลบเช่นกัน นี่คือที่มาของ numbness'
      ],
      say: 'Link back to the zoom-in slide. Less negative RMP is the same reason the foot goes numb.' },

    /* ---------- F. recap ---------- */
    { id: 'recall', kind: 'recall', sec: 5, tag: 'Recall', title: 'Now without help: rebuild the whole flowchart',
      say: 'Let them say each box before it appears. One click per box.' },

    { id: 'end', kind: 'end', sec: 5, tag: 'Take-home', title: 'Three things to keep',
      html: '<ol class="takehome">' +
        '<li><b>Source</b>: AF &#8594; stasis in the {{left atrial appendage}} &#8594; embolus &#8594; {{femoral artery}}.</li>' +
        '<li><b>Mechanism</b>: {{less flow}} directly gives no pulse, cold and pale skin. {{Hypoxia and &#8595;ATP}} damage nerve and muscle, giving abnormal sensation, pain and paralysis.</li>' +
        '<li><b>Lab link</b>: same as cuff 200 mmHg: {{no edema}}. {{Reactive hyperemia}} comes after opening. {{Collaterals}} need chronic obstruction.</li>' +
        '</ol>' +
        '<p class="note">Clinical pearl, นอกสไลด์บรรยาย: ยิ่งตันนาน nerve และ muscle ยิ่งเสียหายถาวร ผู้ป่วยรายนี้ตันมาแล้ว 3 ชั่วโมง จึงต้องรีบเปิดหลอดเลือด</p>',
      say: 'Close on the three lines, then let people check their score on their phones.' }
  ];

  return { slides: slides, sections: sections, flow: flow, caseText: CASE };
})();
