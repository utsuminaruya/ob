'use client'

// app/onboarding/page.tsx
// v3.1（事業者用を削除／求職者のみ）
// 依存: React + TailwindCSS。shadcn不要。
// 送信先: /api/lead にPOST。未実装時はlocalStorageへフォールバック。
// 完了後: 候補者情報から おすすめ求人／日本語学習／生活情報 を自動提示。

import React, { useEffect, useMemo, useState } from 'react'

type Lang = 'ja' | 'vi'

type CandidateForm = {
  name: string
  lang: Lang
  country?: string
  jlpt?: 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | 'None'
  visa?: 'SSW' | 'Student' | 'TraineeGraduated' | 'Permanent' | 'Other'
  prefecture?: string
  desiredArea?: string
  contactMethod: 'LINE' | 'Messenger' | 'Email'
  contactId: string
}

type Job = {
  id: string
  title: string
  facility: string
  prefecture: string
  jlptMin: 'N1'|'N2'|'N3'|'N4'|'N5'|'None'
  visas: Array<CandidateForm['visa']>
  housing?: boolean
  nightShift?: boolean
  link?: string
}

const LINKS = {
  lineCandidate: 'https://lin.ee/xUocVyI',
  messenger: 'https://www.facebook.com/MediflowKK',
}

const JP_PREFS = [
  '北海道','青森','岩手','宮城','秋田','山形','福島','茨城','栃木','群馬','埼玉','千葉','東京','神奈川','新潟','富山','石川','福井','山梨','長野','岐阜','静岡','愛知','三重','滋賀','京都','大阪','兵庫','奈良','和歌山','鳥取','島根','岡山','広島','山口','徳島','香川','愛媛','高知','福岡','佐賀','長崎','熊本','大分','宮崎','鹿児島','沖縄'
]

// デモ用の簡易データセット（実運用ではAPIやDBに置換）
const JOBS: Job[] = [
  { id:'tokyo1', title:'介護職（特定技能）', facility:'特別養護老人ホーム・板橋', prefecture:'東京', jlptMin:'N4', visas:['SSW'], housing:true },
  { id:'tokyo2', title:'介護職（通所・日勤）', facility:'デイサービス・大田', prefecture:'東京', jlptMin:'N4', visas:['SSW','Student'] },
  { id:'kanagawa1', title:'介護職（老健・夜勤あり）', facility:'介護老人保健施設・横浜', prefecture:'神奈川', jlptMin:'N3', visas:['SSW','Student'], nightShift:true },
  { id:'saitama1', title:'介護職（グループホーム）', facility:'川口市内', prefecture:'埼玉', jlptMin:'N4', visas:['SSW'] },
  { id:'chiba1', title:'介護職（病院・病棟助手）', facility:'船橋市内病院', prefecture:'千葉', jlptMin:'N3', visas:['SSW','TraineeGraduated'] },
]

const i18n: Record<Lang, any> = {
  ja: {
    title: '30秒オンボーディング',
    subtitle: '最短30秒で必要情報だけ。すぐにマッチへ。',
    steps: {
      basics: '基本情報',
      detail: '詳細',
      location: 'エリア',
      contact: '連絡方法',
      review: '確認',
    },
    labels: {
      name: 'お名前',
      lang: '希望言語',
      country: '出身国（任意）',
      jlpt: '日本語レベル',
      visa: '在留資格',
      prefecture: '都道府県',
      desiredArea: '希望エリア（任意）',
      contactMethod: '連絡手段',
      contactId: '連絡先ID / メール',
    },
    options: {
      lang: { ja: '日本語', vi: 'ベトナム語' },
      jlpt: ['N1','N2','N3','N4','N5','None'],
      visa: {
        SSW: '特定技能',
        Student: '留学',
        TraineeGraduated: '技能実習修了',
        Permanent: '永住/定住',
        Other: 'その他'
      },
      contact: { LINE: 'LINE', Messenger: 'Messenger', Email: 'メール' }
    },
    cta: {
      candidateLine: '📲 LINEで登録（求職者）',
      messenger: '💬 Messengerで相談',
    },
    buttons: { next: '次へ', back: '戻る', submit: '送信', edit: '修正', start: 'はじめる' },
    meta: {
      timeHint: '目安: 30秒',
      privacy: '送信データは採用・紹介目的にのみ利用します。',
      sent: '送信しました。あなたに合わせたおすすめを表示します。',
      savedLocal: '（API未設定のため端末に一時保存しました）',
    },
    recs: {
      headerJobs: 'あなたへのおすすめ求人',
      headerStudy: 'おすすめ日本語学習',
      headerLife: '生活情報のヒント',
      apply: '応募・相談',
      seeMore: '詳細を見る',
      night: '夜勤あり',
      housing: '住居サポートあり',
    }
  },
  vi: {
    title: 'Onboarding 30 giây',
    subtitle: 'Chỉ ~30s thông tin cần thiết để kết nối việc nhanh.',
    steps: { basics:'Cơ bản', detail:'Chi tiết', location:'Khu vực', contact:'Liên hệ', review:'Xác nhận' },
    labels: {
      name: 'Họ tên', lang: 'Ngôn ngữ', country: 'Quốc tịch (tùy chọn)', jlpt: 'Trình độ tiếng Nhật', visa: 'Tư cách lưu trú',
      prefecture: 'Tỉnh/TP', desiredArea: 'Khu vực mong muốn (tùy chọn)', contactMethod: 'Cách liên hệ', contactId: 'ID liên hệ / Email'
    },
    options: {
      lang: { ja: 'Tiếng Nhật', vi: 'Tiếng Việt' },
      jlpt: ['N1','N2','N3','N4','N5','None'],
      visa: { SSW:'Kỹ năng đặc định', Student:'Du học', TraineeGraduated:'TTS đã tốt nghiệp', Permanent:'Vĩnh trú/Định trú', Other:'Khác' },
      contact: { LINE: 'LINE', Messenger: 'Messenger', Email: 'Email' }
    },
    cta: { candidateLine:'📲 Đăng ký LINE (Ứng viên)', messenger:'💬 Hỏi qua Messenger' },
    buttons: { next:'Tiếp', back:'Quay lại', submit:'Gửi', edit:'Sửa', start:'Bắt đầu' },
    meta: { timeHint:'~30s', privacy:'Chỉ dùng cho mục đích tuyển dụng/giới thiệu.', sent:'Đã gửi. Gợi ý phù hợp sẽ hiển thị.', savedLocal:'(Lưu tạm trên máy; chưa cấu hình API)' },
    recs: {
      headerJobs: 'Việc làm gợi ý cho bạn',
      headerStudy: 'Gợi ý học tiếng Nhật',
      headerLife: 'Mẹo cuộc sống tại Nhật',
      apply: 'Hỏi/Ứng tuyển',
      seeMore: 'Xem chi tiết',
      night: 'Có ca đêm',
      housing: 'Có hỗ trợ nhà ở',
    }
  }
}

function useCountdown(seconds: number) {
  const [remain, setRemain] = useState(seconds)
  useEffect(() => {
    setRemain(seconds)
    const t = setInterval(() => setRemain((r) => (r > 0 ? r - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [seconds])
  return remain
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full bg-blue-600 transition-all" style={{ width: `${value}%` }} />
    </div>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">{children}</span>
}

function jlptRank(level?: CandidateForm['jlpt']) {
  const order = { None:0, N5:1, N4:2, N3:3, N2:4, N1:5 } as const
  return level ? order[level] : 0
}

function matchJob(job: Job, f: CandidateForm) {
  const areaOk = f.prefecture ? job.prefecture === f.prefecture : true
  const wantAreaOk = f.desiredArea ? (job.prefecture.includes(f.desiredArea) || f.desiredArea.includes(job.prefecture)) : true
  const jlptOk = jlptRank(f.jlpt) >= jlptRank(job.jlptMin)
  const visaOk = f.visa ? job.visas.includes(f.visa) : true
  return areaOk && wantAreaOk && jlptOk && visaOk
}

function getJobRecs(f: CandidateForm): Job[] {
  const matched = JOBS.filter((j) => matchJob(j, f))
  if (matched.length > 0) return matched.slice(0, 3)
  // フォールバック: 首都圏から人気順に3件
  const metro = JOBS.filter((j) => ['東京','神奈川','埼玉','千葉'].includes(j.prefecture))
  return metro.slice(0, 3)
}

function getStudyRecs(f: CandidateForm, langPack: any) {
  const isLower = jlptRank(f.jlpt) <= jlptRank('N4')
  const isMid = jlptRank(f.jlpt) === jlptRank('N3')
  const isHigh = jlptRank(f.jlpt) >= jlptRank('N2')
  const JA = langPack === i18n.ja
  return [
    isLower && {
      title: JA ? '介護の日本語・基礎（敬語／声かけ）' : 'Tiếng Nhật trong chăm sóc cơ bản',
      tip: JA ? '毎日15分の音読＋シャドーイング。数字・時間・身体部位を固める。' : 'Đọc to + shadowing 15 phút/ngày. Ôn số, thời gian, bộ phận cơ thể.'
    },
    isMid && {
      title: JA ? 'JLPT N3 語彙＋聴解ブースト' : 'Tăng tốc từ vựng + nghe N3',
      tip: JA ? '通勤中に短いニュース音声→要約1文を書く習慣。' : 'Nghe tin ngắn khi di chuyển → viết 1 câu tóm tắt.'
    },
    isHigh && {
      title: JA ? '介護記録の表現テンプレ' : 'Mẫu câu viết hồ sơ chăm sóc',
      tip: JA ? 'SOAP/ADLの定型文を暗記→現場で置換。' : 'Ghi nhớ mẫu SOAP/ADL và thay nội dung tại chỗ.'
    }
  ].filter(Boolean) as Array<{title:string; tip:string}>
}

function getLifeRecs(f: CandidateForm, langPack: any) {
  const JA = langPack === i18n.ja
  const p = f.prefecture || '東京'
  return [
    { title: JA ? '初期手続きチェック' : 'Thủ tục ban đầu', tip: JA ? '住民登録→国民健康保険→マイナンバー→銀行→携帯SIM。' : 'Đăng ký cư trú→BHYT quốc dân→MyNumber→ngân hàng→SIM.' },
    { title: JA ? `${p}での交通ICカード` : `Thẻ IC giao thông tại ${p}`, tip: JA ? 'Suica/PASMO等をスマホに入れて通勤を時短。' : 'Nạp Suica/PASMO vào điện thoại để tiết kiệm thời gian.' },
    { title: JA ? '家計の安心' : 'An tâm tài chính', tip: JA ? '家賃は手取りの30%以下を目安。送金は手数料の低い方法を選ぶ。' : 'Tiền nhà ≤30% thu nhập. Chọn cách chuyển tiền phí thấp.' },
  ]
}

export default function OnboardingPage() {
  const [lang, setLang] = useState<Lang>('ja')
  const t = i18n[lang]
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<CandidateForm | null>({ name:'', lang, contactMethod:'LINE', contactId:'' })
  const remain = useCountdown(30)

  useEffect(() => {
    // 初期言語を推定（vi/jaのみ）
    const n = navigator?.language?.toLowerCase() || ''
    if (n.startsWith('vi')) setLang('vi')
    else setLang('ja')
  }, [])

  const totalSteps = 4 // 0..4: basics, detail, location, contact, review
  const progress = useMemo(() => Math.min(100, Math.round((step / totalSteps) * 100)), [step, totalSteps])

  function next() { setStep((s) => Math.min(totalSteps, s + 1)) }
  function back() { setStep((s) => Math.max(0, s - 1)) }

  function update<K extends keyof CandidateForm>(key: K, value: CandidateForm[K]) {
    setForm((prev) => ({ ...(prev || { name:'', lang, contactMethod:'LINE', contactId:'' }), [key]: value }))
  }

  async function submit() {
    if (!form) return
    const payload = { ...form, lang }
    try {
      const res = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Bad status')
      localStorage.removeItem('onboarding_v3_candidate')
      setStep(totalSteps + 1)
      return
    } catch (e) {
      localStorage.setItem('onboarding_v3_candidate', JSON.stringify(payload))
      setStep(totalSteps + 1)
    }
  }

  const StepHeader = (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">{t.title}</h1>
        <p className="text-sm text-gray-600 mt-1">{t.subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <select className="text-sm border rounded-lg px-2 py-1" value={lang} onChange={(e) => { const L = e.target.value as Lang; setLang(L); update('lang', L) }}>
          <option value="ja">{t.options.lang.ja}</option>
          <option value="vi">{t.options.lang.vi}</option>
        </select>
        <Pill>{t.meta.timeHint}</Pill>
        <div className="text-sm text-gray-500 w-14 text-right">{remain}s</div>
      </div>
    </div>
  )

  const langPack = i18n[lang]
  const jobRecs = form ? getJobRecs(form) : []
  const studyRecs = form ? getStudyRecs(form, langPack) : []
  const lifeRecs = form ? getLifeRecs(form, langPack) : []

  return (
    <div className="min-h-[100svh] flex items-center justify-center bg-gradient-to-b from-white to-slate-50">
      <div className="w-full max-w-2xl p-4 md:p-8">
        {StepHeader}
        <div className="mt-4"><ProgressBar value={progress} /></div>

        <div className="mt-6 bg-white rounded-2xl shadow-sm border p-4 md:p-6">
          {/* STEP 0: BASICS */}
          {step === 0 && form && (
            <div>
              <div className="text-sm text-gray-500 mb-2">STEP 1/5 · {t.steps.basics}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.labels.name}</label>
                  <input className="w-full border rounded-xl px-3 py-2" placeholder="山田 太郎 / Nguyen Van A" value={form.name}
                    onChange={(e) => update('name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.labels.lang}</label>
                  <select className="w-full border rounded-xl px-3 py-2" value={lang} onChange={(e) => { const L = e.target.value as Lang; setLang(L); update('lang', L) }}>
                    <option value="ja">{t.options.lang.ja}</option>
                    <option value="vi">{t.options.lang.vi}</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">{t.labels.country}</label>
                  <input className="w-full border rounded-xl px-3 py-2" placeholder="Vietnam / Philippines / Indonesia ..."
                    onChange={(e) => update('country', e.target.value)} />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={next} className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow hover:opacity-90">{t.buttons.next}</button>
              </div>
            </div>
          )}

          {/* STEP 1: DETAIL */}
          {step === 1 && form && (
            <div>
              <div className="text-sm text-gray-500 mb-2">STEP 2/5 · {t.steps.detail}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.labels.jlpt}</label>
                  <select className="w-full border rounded-xl px-3 py-2" value={form.jlpt || ''} onChange={(e) => update('jlpt', (e.target.value || undefined) as any)}>
                    <option value="">--</option>
                    {i18n[lang].options.jlpt.map((v: string) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.labels.visa}</label>
                  <select className="w-full border rounded-xl px-3 py-2" value={form.visa || ''} onChange={(e) => update('visa', (e.target.value || undefined) as any)}>
                    <option value="">--</option>
                    {Object.entries(i18n[lang].options.visa).map(([k,v]: any) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={back} className="px-4 py-2 rounded-xl border">{t.buttons.back}</button>
                <button onClick={next} className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow hover:opacity-90">{t.buttons.next}</button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && form && (
            <div>
              <div className="text-sm text-gray-500 mb-2">STEP 3/5 · {t.steps.location}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm text-gray-600 mb-1">{t.labels.prefecture}</label>
                   <select className="w-full border rounded-xl px-3 py-2" value={form.prefecture || ''}
                     onChange={(e) => update('prefecture', (e.target.value || undefined) as any)}>
                     <option value="">--</option>
                     {JP_PREFS.map((p) => <option key={p} value={p}>{p}</option>)}
                   </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.labels.desiredArea}</label>
                  <input className="w-full border rounded-xl px-3 py-2" placeholder="例: 東京・神奈川"
                    value={form.desiredArea || ''}
                    onChange={(e) => update('desiredArea', e.target.value)} />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={back} className="px-4 py-2 rounded-xl border">{t.buttons.back}</button>
                <button onClick={next} className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow hover:opacity-90">{t.buttons.next}</button>
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT */}
          {step === 3 && form && (
            <div>
              <div className="text-sm text-gray-500 mb-2">STEP 4/5 · {t.steps.contact}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.labels.contactMethod}</label>
                  <select className="w-full border rounded-xl px-3 py-2" value={form.contactMethod}
                    onChange={(e) => update('contactMethod', e.target.value as any)}>
                    {Object.entries(i18n[lang].options.contact).map(([k,v]: any) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.labels.contactId}</label>
                  <input className="w-full border rounded-xl px-3 py-2" placeholder="LINE ID / Facebook name / email"
                    value={form.contactId} onChange={(e) => update('contactId', e.target.value)} />
                </div>
              </div>

              {/* CTA */}
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={LINKS.lineCandidate} target="_blank" className="px-4 py-2 rounded-xl bg-green-600 text-white shadow hover:opacity-90">{t.cta.candidateLine}</a>
                <a href={LINKS.messenger} target="_blank" className="px-4 py-2 rounded-xl bg-blue-700 text-white shadow hover:opacity-90">{t.cta.messenger}</a>
              </div>

              <div className="mt-6 flex justify-between">
                <button onClick={back} className="px-4 py-2 rounded-xl border">{t.buttons.back}</button>
                <button onClick={next} className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow hover:opacity-90">{t.buttons.next}</button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {step === 4 && form && (
            <div>
              <div className="text-sm text-gray-500 mb-2">STEP 5/5 · {t.steps.review}</div>
              <div className="rounded-xl border p-4 bg-slate-50">
                <ul className="text-sm space-y-1">
                  <li><span className="text-gray-500">{t.labels.name}:</span> {form.name || '-'}</li>
                  <li><span className="text-gray-500">{t.labels.jlpt}:</span> {form.jlpt || '-'}</li>
                  <li><span className="text-gray-500">{t.labels.visa}:</span> {((k:any)=> i18n[lang].options.visa[k] || '-')(form.visa as any)}</li>
                  <li><span className="text-gray-500">{t.labels.prefecture}:</span> {form.prefecture || '-'}</li>
                  <li><span className="text-gray-500">{t.labels.desiredArea}:</span> {form.desiredArea || '-'}</li>
                  <li><span className="text-gray-500">{t.labels.contactMethod}:</span> {i18n[lang].options.contact[form.contactMethod]}</li>
                  <li><span className="text-gray-500">{t.labels.contactId}:</span> {form.contactId || '-'}</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500 mt-3">{t.meta.privacy}</p>

              <div className="mt-6 flex justify-between">
                <button onClick={back} className="px-4 py-2 rounded-xl border">{t.buttons.edit}</button>
                <button onClick={submit} className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow hover:opacity-90">{t.buttons.submit}</button>
              </div>
            </div>
          )}

          {/* DONE + RECOMMENDATIONS */}
          {step > totalSteps && form && (
            <div className="">
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-600"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
                </div>
                <h2 className="text-xl font-semibold">{t.meta.sent}</h2>
                <p className="text-sm text-gray-500 mt-1">{t.meta.savedLocal}</p>
              </div>

              {/* JOB RECS */}
              <h3 className="text-lg font-semibold mt-2 mb-2">{t.recs.headerJobs}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {jobRecs.map((j) => (
                  <div key={j.id} className="border rounded-xl p-3 bg-white">
                    <div className="font-medium">{j.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{j.facility} · {j.prefecture}</div>
                    <div className="flex flex-wrap gap-1 mt-2 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100">JLPT≥{j.jlptMin}</span>
                      {j.housing && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{t.recs.housing}</span>}
                      {j.nightShift && <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{t.recs.night}</span>}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <a href={LINKS.lineCandidate} target="_blank" className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white">{t.recs.apply}</a>
                      {j.link && <a href={j.link} target="_blank" className="text-xs px-3 py-1.5 rounded-lg border">{t.recs.seeMore}</a>}
                    </div>
                  </div>
                ))}
              </div>

              {/* STUDY RECS */}
              <h3 className="text-lg font-semibold mt-6 mb-2">{t.recs.headerStudy}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {studyRecs.map((s, idx) => (
                  <div key={idx} className="border rounded-xl p-3 bg-white">
                    <div className="font-medium">{s.title}</div>
                    <p className="text-sm text-gray-600 mt-1">{s.tip}</p>
                  </div>
                ))}
              </div>

              {/* LIFE RECS */}
              <h3 className="text-lg font-semibold mt-6 mb-2">{t.recs.headerLife}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {lifeRecs.map((s, idx) => (
                  <div key={idx} className="border rounded-xl p-3 bg-white">
                    <div className="font-medium">{s.title}</div>
                    <p className="text-sm text-gray-600 mt-1">{s.tip}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <a href={LINKS.lineCandidate} target="_blank" className="px-4 py-2 rounded-xl bg-green-600 text-white shadow hover:opacity-90">{t.cta.candidateLine}</a>
                <a href={LINKS.messenger} target="_blank" className="px-4 py-2 rounded-xl bg-blue-700 text-white shadow hover:opacity-90">{t.cta.messenger}</a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-4">
          <span className="font-medium">Mediflow</span> · Onboarding v3.1（Candidate‑only） · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  )
}
