/* Case 4: Acute limb ischemia. All slide content lives here.
   {{text}} = click-to-reveal cloze blank. [[text]] = tappable phrase, [[+text]] = tappable phrase that is correct.
   The case text is verbatim. The flowchart follows the lecture's mechanism.

   The talk is the slides before the first `bonus: true`, in order: cover, sources and search, the case, references.
   `t` is its time budget in seconds (6 minutes in total). Sources are named on the first and last talk slides only.
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
    { k: 'E', name: 'Lab link' },
    { k: 'F', name: 'Take-home' },
    { k: 'G', name: 'References' },
    { k: '+', name: 'More practice' }
  ];
  var BONUS = 7;

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

    /* ========== THE 6-MINUTE TALK ========== */

    { id: 'start', kind: 'title', sec: -1, t: 10,
      say: 'QR up while people arrive. Scan, then tap any choice: the answer shows straight away.' },

    { id: 'method', kind: 'concept', sec: 0, t: 40, tag: 'Sources and search', title: 'แหล่งข้อมูลและวิธีสืบค้น',
      html: '<div class="tblwrap"><table class="tbl method"><thead><tr><th>สืบค้นเรื่อง</th><th>จากแหล่งใด</th></tr></thead><tbody>' +
        '<tr><td>Symptoms and signs, ตำแหน่ง embolus</td><td>Review: Obara et al. (2018), Olinic et al. (2019), Shukuzawa et al. (2026)</td></tr>' +
        '<tr><td>AF, clot ใน appendage, JVP</td><td>Chapter 9, 13, 37 <i>Guyton and Hall Textbook of Medical Physiology</i>, 14th ed., Hall &amp; Hall (2021); Sulague et al. (2023); Blackshear &amp; Odell (1996); Stanford Medicine 25</td></tr>' +
        '<tr><td>Flow ลด, cuff 200 mmHg</td><td>Chapter 15, 16, 17, 25, 74 Guyton and Hall; ปฏิบัติการสรีรวิทยา 16, จุไรพร สมบุญวงค์</td></tr>' +
        '<tr><td>Hypoxia, ATP, lactate</td><td>Chapter 21, 68 Guyton and Hall; Cardiac Biochemistry, Prapunwattana; Costa et al. (2024); Simon et al. (2018)</td></tr>' +
        '<tr><td>Nerve, pain, muscle</td><td>Chapter 5, 6, 49 Guyton and Hall; Akimoto et al. (2023); Mogyoros et al. (2000)</td></tr>' +
        '<tr><td>คำถามและรูปจากข้อสอบเก่า</td><td>ไฟล์รายวิชา AC80 และ tAChycardia 81 (ไม่ได้ตีพิมพ์)</td></tr>' +
        '</tbody></table></div>' +
        '<div class="searchbox"><b>สืบค้นวันที่ 7 พ.ย. 2569 ใน PubMed และ web search</b>' +
        '<ul class="searches">' +
        '<li><code>"acute limb ischemia"[Title] AND 2018:2026[dp]</code> 476 รายการ</li>' +
        '<li><code>"left atrial appendage"[Title] AND "atrial fibrillation"[Title] AND review[pt] AND 2018:2026[dp]</code> 147 รายการ</li>' +
        '<li><code>paresthesia[tiab] AND ischemia[tiab] AND axons[tiab]</code> 1 รายการ</li>' +
        '</ul>' +
        '<p>เลือก review ที่เปิดอ่านได้และเทียบข้อมูลระหว่างแหล่ง ใช้ Claude (AI) ช่วยสืบค้นและร่างสไลด์ แล้วตรวจการอ้างอิงกับต้นฉบับ</p></div>',
      say: 'Say this before the case. Textbook: Guyton and Hall, 14th edition, Hall and Hall, 2021. Journals: PubMed title search on 7 November, then review articles I could open. Newest is Shukuzawa, Annals of Vascular Diseases, 2026. If asked: older papers are kept only for the original 91 percent figure and the paresthesia mechanism; the 15th edition (2026) exists but this is the edition read; the ESVS 2020 guideline was not opened.' },

    { id: 'tap', kind: 'tap', sec: 1, t: 50, tag: 'Find them', src: 'Case',
      title: 'The case: tap the <span class="hl">6 symptoms and signs</span>',
      text: CASE_TAP,
      why: [
        'หกข้อนี้คือ <b>6 Ps</b>: pain, pallor, paresthesia, poikilothermia, pulselessness, paralysis <span class="src">mnemonic ทางคลินิก นอกสไลด์บรรยาย</span>',
        'อายุ ประวัติ AF เวลา และผล CT angiogram <b>ไม่ใช่</b> symptoms หรือ signs'
      ],
      say: 'Read the case fast and let them tap. Each tap marks right or wrong at once. Space shows all six.' },

    { id: 'q2', kind: 'poll', sec: 2, t: 30, tag: 'Case question', src: 'Case', layout: 'fig',
      q: 'He has <b>atrial fibrillation</b>. Where did this embolus most likely form?',
      o: ['Right atrial appendage', 'Femoral vein', 'Left atrial appendage', 'Left ventricular outflow tract'], a: 2,
      figHtml: cxr(),
      why: [
        'AF: atria สั่นพลิ้ว ไม่บีบตัวเป็นจังหวะ &#8594; เลือดคั่ง (stasis) ใน <b>left atrial appendage</b> &#8594; เกิด thrombus',
        'Embolus: LA &#8594; LV &#8594; aorta &#8594; iliac &#8594; <b>femoral a.</b>',
        'ก้อนจาก vein หรือหัวใจซีกขวาไปติดที่ <b>pulmonary a.</b> ไม่ใช่ขา'
      ],
      say: 'Point to the orange arrow. Route: left heart, aorta, iliac, femoral.' },

    { id: 'qjvp', kind: 'poll', sec: 2, t: 25, tag: 'Past exam', src: 'AC80',
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

    { id: 'f2', kind: 'flowtap', sec: 3, t: 30, tag: 'Build the flowchart', src: 'Case', known: ['occl', 'flow'], reveals: ['pulse', 'hypox', 'skin'],
      q: 'Less flow <b>alone</b> explains which <b>3</b> findings, before any cell runs out of energy?',
      chips: [{ t: 'Absent pulse', ok: 1 }, { t: 'Numbness' }, { t: 'Pale skin', ok: 1 }, { t: 'Cold skin', ok: 1 }, { t: 'Pain' }, { t: 'Cannot move toes' }],
      why: [
        '<b>Pulse</b>: คลื่นความดันจาก stroke volume ผ่านจุดตันไม่ได้',
        '<b>Pale</b>: เลือดเข้าผิวหนังน้อยลง สีผิวจึงซีด',
        '<b>Cold</b>: เนื้อเยื่อนำความร้อนไม่ดี ต้องอาศัยเลือดพาความร้อน',
        'ชา ปวด อ่อนแรง ต้องผ่าน <b>tissue hypoxia</b> ก่อน <span class="src">Lab direction: Microcirculation 1.2&#8211;1.3</span>'
      ],
      say: 'Blocked artery, less flow. Three of the six come straight from that. The other three need the middle box.' },

    { id: 'f3', kind: 'flowpoll', sec: 3, t: 35, tag: 'Past exam in the flowchart', src: 'AC80', known: ['occl', 'flow', 'pulse', 'hypox', 'skin'], reveals: ['atp'],
      afterChart: '<div class="mini art ldcard onlyrev">' +
        '<figure class="scan ldshot"><div class="paperimg"><img src="img/ld1-lecture-crop.png" data-full="img/ld1-lecture-slide62.png" alt="Lecture slide 62: LD-1 prefers the direction from lactate to pyruvate"></div></figure>' +
        '<p><b>Cardiac muscle</b>: LD1 มากที่สุด (60%) ปกติจึงใช้ lactate เป็นเชื้อเพลิง ขาด O<sub>2</sub>: pyruvate และ NADH คั่ง จึงเกิด <b>lactic acid</b> สะสมแทน</p>' +
        '<p class="srcline">Cardiac Biochemistry, slide 62<span class="zoomhint"> &#183; แตะรูปเพื่อดูทั้งสไลด์</span></p></div>',
      q: 'A patient experiences chest pain due to cardiac ischemia. What happens in anaerobic respiration of cardiac muscle?',
      o: ['Lactic acid from glycolysis', 'Fatty acid oxidation', 'Pyruvate accumulation in mitochondria', 'Use ketone body as main energy source'], a: 0,
      why: [
        'ไม่มี O<sub>2</sub> &#8594; oxidative phosphorylation หยุด &#8594; เหลือ <b>glycolysis</b> &#8594; pyruvate &#8594; <b>lactate</b>',
        'ได้ ATP น้อยมาก hypoxia จึงนำไปสู่ <b>&#8595;ATP</b>',
        'ข้อสอบถามหัวใจ แต่กล้ามเนื้อขาใช้หลักเดียวกัน'
      ],
      say: 'The exam asked about the heart. Normally the heart burns lactate, because LD1 favours lactate to pyruvate. With no oxygen, pyruvate and NADH pile up, so lactate builds instead. Same logic in the leg: no oxygen, little ATP.' },

    { id: 'f5', kind: 'flowpoll', sec: 3, t: 30, tag: 'Build the flowchart', src: 'Case', known: ['occl', 'flow', 'pulse', 'hypox', 'skin', 'atp'], reveals: ['nerve', 'sens', 'pain'],
      q: 'Which <b>ATP-dependent</b> protein keeps a nerve&#8217;s resting membrane potential?',
      o: ['SERCA', 'Funny channel', 'Na<sup>+</sup>/K<sup>+</sup>-ATPase', 'Nicotinic ACh receptor'], a: 2,
      why: [
        'ATP หมด &#8594; pump หยุด &#8594; RMP ไม่ลบเท่าเดิม = <b>abnormal depolarization</b>',
        'ช่วงแรก nerve ยิงผิดปกติ (<b>tingling</b>) นานขึ้น Na<sup>+</sup> channel inactivate (<b>numbness</b>)',
        'Nerve damage ทำให้เกิด <b>pain</b> ด้วย'
      ],
      say: 'Pump stops, membrane depolarizes: tingling first, then numbness.' },

    { id: 'f6', kind: 'flowpoll', sec: 3, t: 25, tag: 'Build the flowchart', src: 'Case', known: ['occl', 'flow', 'pulse', 'hypox', 'skin', 'atp', 'nerve', 'sens', 'pain'], reveals: ['muscle', 'para'],
      q: 'Why can&#8217;t muscle contract normally without ATP?',
      o: ['Troponin C is destroyed', 'Actin filaments dissolve', 'ACh blocks the motor end plate', 'Crossbridge cycling fails: myosin needs ATP to release actin'], a: 3,
      why: [
        'ATP ทำให้ myosin หลุดจาก actin ไม่มี ATP จึงเกิด <b>abnormal crossbridge</b>',
        'Paralysis จึงมาได้ <b>2 ทาง</b>: nerve damage + muscle damage'
      ],
      say: 'The last box has two arrows into it: weakness comes from both nerve and muscle.' },

    { id: 'f7', kind: 'trace', sec: 3, t: 30, tag: 'Trace it', title: 'Trace each finding back to the block',
      traces: [
        { k: 'pulse', t: 'Absent pulse', path: ['occl', 'flow', 'pulse'], line: 'Occlusion &#8594; less flow &#8594; absence of pulse', note: 'มาจาก flow ลดลงโดยตรง' },
        { k: 'pale', t: 'Pale', path: ['occl', 'flow', 'skin'], line: 'Occlusion &#8594; less flow &#8594; cold and pale skin', note: 'มาจาก flow ลดลงโดยตรง' },
        { k: 'cold', t: 'Cold', path: ['occl', 'flow', 'skin'], line: 'Occlusion &#8594; less flow &#8594; cold and pale skin', note: 'มาจาก flow ลดลงโดยตรง' },
        { k: 'numb', t: 'Numbness, tingling', path: ['occl', 'flow', 'hypox', 'atp', 'nerve', 'sens'], line: 'Occlusion &#8594; less flow &#8594; hypoxia &#8594; &#8595;ATP &#8594; nerve damage &#8594; abnormal sensation', note: '&#8595;ATP &#8594; abnormal depolarization' },
        { k: 'pain', t: 'Severe pain', path: ['occl', 'flow', 'hypox', 'atp', 'nerve', 'pain'], line: 'Occlusion &#8594; less flow &#8594; hypoxia &#8594; &#8595;ATP &#8594; nerve damage &#8594; pain', note: 'hypoxia &#8594; nerve damage' },
        { k: 'weak', t: 'Cannot move toes', path: ['occl', 'flow', 'hypox', 'atp', 'nerve', 'muscle', 'para'], line: 'Occlusion &#8594; less flow &#8594; hypoxia &#8594; &#8595;ATP &#8594; nerve damage + muscle damage &#8594; paralysis', note: 'มาจากทั้ง nerve damage และ abnormal crossbridge' }
      ],
      say: 'Short on time? Tap only Absent pulse, Numbness and Cannot move toes.' },

    { id: 'l1', kind: 'poll', sec: 4, t: 25, tag: 'Past exam', src: 'AC80',
      q: 'A cuff with a pressure of <b>200 mmHg</b> is applied on a patient&#8217;s arm for 5 minutes. Which of the following should <b>not</b> be found?',
      o: ['Pain', 'Edema', 'Cold', 'Lack of pulse', 'Pallor'], a: 1,
      why: [
        'Cuff 200 mmHg สูงกว่า SBP &#8594; เลือดแดงเข้าไม่ได้ <b>เหมือน femoral a. ตัน</b> (Lab microcirculation)',
        'ไม่มีเลือดเข้า capillary hydrostatic pressure จึงไม่เพิ่ม &#8594; <b>ไม่เกิด edema</b>',
        'เคสนี้ก็ไม่มี swelling ในประวัติ อาการตรงกับแขนในแลป'
      ],
      say: 'You felt this patient&#8217;s leg on your own arm in the lab: minutes there, three hours here.' },

    { id: 'end', kind: 'concept', sec: 5, t: 20, tag: 'Take-home', title: 'Three things to keep',
      html: '<ol class="takehome">' +
        '<li><b>Source</b>: AF &#8594; stasis in the <b>left atrial appendage</b> &#8594; embolus &#8594; <b>femoral artery</b>.</li>' +
        '<li><b>Mechanism</b>: <b>less flow</b> directly gives no pulse, cold and pale skin. <b>Hypoxia and &#8595;ATP</b> damage nerve and muscle, giving abnormal sensation, pain and paralysis.</li>' +
        '<li><b>Lab link</b>: same as a 200 mmHg cuff, so <b>no edema</b>. Acute means no time for <b>collaterals</b>.</li>' +
        '</ol>',
      say: 'Three lines, then the reference slide.' },

    { id: 'refs', kind: 'end', sec: 6, t: 5, tag: 'APA 7', title: 'References',
      html: '<ul class="reflist">' +
        '<li>จุไรพร สมบุญวงค์. (ม.ป.ป.). <i>ปฏิบัติการสรีรวิทยา 16: ระบบไหลเวียนเลือดขนาดเล็ก</i> [เอกสารปฏิบัติการ]. ภาควิชาสรีรวิทยา คณะแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย.</li>' +
        '<li>วสันต์ อุทัยเฉลิม และ วีรภัทร โฆษิตานุฤทธิ์. (ม.ป.ป.). <i>ปฏิบัติการสรีรวิทยา: คลื่นไฟฟ้าหัวใจ</i> [เอกสารปฏิบัติการ]. ภาควิชาสรีรวิทยา คณะแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย.</li>' +
        '<li><i>AC 75&#8211;79 CVS</i> [Unpublished MCQ recall file]. (n.d.).</li>' +
        '<li><i>AC 80: Cardiovascular System 1</i> [Unpublished MCQ recall file]. (n.d.).</li>' +
        '<li>Akimoto, T., Ogawa, K., Hara, M., Ninomiya, S., Ishihara, M., Morita, A., Kamei, S., &amp; Nakajima, H. (2023). Clinical features of acute ischemic stroke patients with hypoesthesia as an initial symptom. <i>Neurology International, 15</i>(1), 508&#8211;517. <a href="https://doi.org/10.3390/neurolint15010030">https://doi.org/10.3390/neurolint15010030</a></li>' +
        '<li>Blackshear, J. L., &amp; Odell, J. A. (1996). Appendage obliteration to reduce stroke in cardiac surgical patients with atrial fibrillation [Abstract]. <i>The Annals of Thoracic Surgery, 61</i>(2), 755&#8211;759. <a href="https://doi.org/10.1016/0003-4975(95)00887-X">https://doi.org/10.1016/0003-4975(95)00887-X</a></li>' +
        '<li>Costa, D., Ielapi, N., Perri, P., Minici, R., Faga, T., Michael, A., Bracale, U. M., Andreucci, M., &amp; Serra, R. (2024). Molecular insight into acute limb ischemia. <i>Biomolecules, 14</i>(7), Article 838. <a href="https://doi.org/10.3390/biom14070838">https://doi.org/10.3390/biom14070838</a></li>' +
        '<li>Hall, J. E., &amp; Hall, M. E. (2021). <i>Guyton and Hall textbook of medical physiology</i> (14th ed.). Elsevier.</li>' +
        '<li>Kositanurit, W. (n.d.). <i>Lab heart contraction and extrasystole</i> [Lab slides]. Department of Physiology, Faculty of Medicine, Chulalongkorn University.</li>' +
        '<li>Mogyoros, I., Bostock, H., &amp; Burke, D. (2000). Mechanisms of paresthesias arising from healthy axons [Abstract]. <i>Muscle &amp; Nerve, 23</i>(3), 310&#8211;320. <a href="https://doi.org/10.1002/(SICI)1097-4598(200003)23:3%3C310::AID-MUS2%3E3.0.CO;2-A">https://doi.org/10.1002/(SICI)1097-4598(200003)23:3&lt;310::AID-MUS2&gt;3.0.CO;2-A</a></li>' +
        '<li>Obara, H., Matsubara, K., &amp; Kitagawa, Y. (2018). Acute limb ischemia. <i>Annals of Vascular Diseases, 11</i>(4), 443&#8211;448. <a href="https://doi.org/10.3400/avd.ra.18-00074">https://doi.org/10.3400/avd.ra.18-00074</a></li>' +
        '<li>Olinic, D.-M., Stanek, A., T&#259;taru, D.-A., Homorodean, C., &amp; Olinic, M. (2019). Acute limb ischemia: An update on diagnosis and management. <i>Journal of Clinical Medicine, 8</i>(8), Article 1215. <a href="https://doi.org/10.3390/jcm8081215">https://doi.org/10.3390/jcm8081215</a></li>' +
        '<li>Peer Support 81. (n.d.). <i>tAChycardia 81: 3050116 Cardiovascular System I</i> [Unpublished MCQ recall file].</li>' +
        '<li>Prapunwattana, P. (n.d.). <i>Cardiac biochemistry</i> [Lecture slides]. Chulalongkorn University.</li>' +
        '<li>Shukuzawa, K., Ozawa, H., &amp; Ohki, T. (2026). Revascularization for acute limb ischemia. <i>Annals of Vascular Diseases, 19</i>(1), Article 26-00066. <a href="https://doi.org/10.3400/avd.ra.26-00066">https://doi.org/10.3400/avd.ra.26-00066</a></li>' +
        '<li>Simon, F., Oberhuber, A., Floros, N., Busch, A., Wagenh&#228;user, M. U., Schelzig, H., &amp; Duran, M. (2018). Acute limb ischemia&#8212;Much more than just a lack of oxygen. <i>International Journal of Molecular Sciences, 19</i>(2), Article 374. <a href="https://doi.org/10.3390/ijms19020374">https://doi.org/10.3390/ijms19020374</a></li>' +
        '<li>Stanford Medicine. (n.d.). <i>JVP waveform</i> [Image]. Wikimedia Commons. <a href="https://commons.wikimedia.org/wiki/File:JVP_waveform.png">https://commons.wikimedia.org/wiki/File:JVP_waveform.png</a></li>' +
        '<li>Stanford Medicine 25. (n.d.). <i>Neck vein exam: JVP measurement</i>. Stanford Medicine. <a href="https://stanfordmedicine25.stanford.edu/the25/neck-exam-jugular-venous-pressure-measurement.html">https://stanfordmedicine25.stanford.edu/the25/neck-exam-jugular-venous-pressure-measurement.html</a></li>' +
        '<li>Sulague, R. M., Whitham, T., Danganan, L. M. L., Effiom, V., Candelario, K., Latif, N., &amp; Hameed, I. (2023). The left atrial appendage and atrial fibrillation&#8212;A contemporary review. <i>Journal of Clinical Medicine, 12</i>(21), Article 6909. <a href="https://doi.org/10.3390/jcm12216909">https://doi.org/10.3390/jcm12216909</a></li>' +
        '</ul>',
      say: 'Five seconds: sources are in APA format, links work in the PDF. Tell them More practice stays on their phones.' },

    /* ========== MORE PRACTICE: after the talk, on their own ========== */

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
