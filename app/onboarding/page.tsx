'use client';

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Check, ChevronLeft, ChevronRight, Clipboard, Loader2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// ========================
// 30秒オンボーディングBOT（VI/JA） - 単一ファイルMVP
// ========================

// ---- 言語辞書 ----
const L = {
  ja: {
    heroTitle: "日本で “働く” と “暮らす” を同時に。",
    heroSub: "30秒であなたに合う進路と求人・学習・生活プランを提案します。",
    start: "30秒で開始",
    next: "次へ",
    back: "戻る",
    submit: "プランを作成",
    copied: "コピーしました",
    download: "JSONをコピー",
    saveAndSend: "送信（/api/lead）",
    planTitle: "あなた専用の進路プラン",
    planSub: "不足要件の見える化 → 今すぐ埋めるアクション",
    step1: "目的",
    step2: "在留資格",
    step3: "勤務地",
    step4: "日本語レベル",
    step5: "介護経験",
    step6: "住まい・希望",
    step7: "連絡先",
    purposeLabel: "何を一番したいですか？",
    purposeJob: "仕事を探す",
    purposeStudy: "日本語を学ぶ",
    purposeLife: "生活サポート",
    visaLabel: "現在の在留資格",
    visaSSW: "特定技能",
    visaStudent: "留学",
    visaLT: "定住者/家族滞在など",
    visaNA: "なし/海外",
    jlptLabel: "日本語レベル (JLPT)",
    none: "未取得",
    expLabel: "介護の経験（月）",
    nightLabel: "夜勤は可能ですか？",
    yes: "はい",
    no: "いいえ",
    locationLabel: "働きたいエリア（市区/都道府県可）",
    salaryLabel: "希望月給（万円）",
    housingLabel: "住まい",
    housingDorm: "会社寮希望",
    housingSelf: "自分で探す",
    housingFamily: "家族と同居",
    startLabel: "いつから働けますか？",
    startNow: "すぐに",
    start1to3: "1〜3ヶ月以内",
    start3plus: "3ヶ月以降",
    contactLabel: "連絡先",
    name: "氏名",
    email: "メール",
    phone: "電話/WhatsApp",
    line: "LINE ID",
    messenger: "Messenger",
    zalo: "Zalo",
    comment: "補足（任意）",
    planBlocks: {
      fit: "適合度",
      visa: "ビザ/要件",
      study: "学習プラン",
      life: "生活セット",
      actions: "今すぐのアクション"
    },
    sampleJobsTitle: "おすすめ求人（サンプル）",
    sampleLifeTitle: "生活情報（横浜の例）",
    clipboardJSON: "候補者データ(JSON)をコピー",
    langToggle: "言語：日本語 / Tiếng Việt",
    progress: "進捗",
  },
  vi: {
    heroTitle: "Vừa LÀM VIỆC vừa SỐNG TỐT tại Nhật.",
    heroSub: "Trong 30 giây, nhận lộ trình phù hợp cùng việc làm, học tập và đời sống.",
    start: "Bắt đầu trong 30 giây",
    next: "Tiếp tục",
    back: "Quay lại",
    submit: "Tạo kế hoạch",
    copied: "Đã sao chép",
    download: "Sao chép JSON",
    saveAndSend: "Gửi (/api/lead)",
    planTitle: "Kế hoạch dành riêng cho bạn",
    planSub: "Hiển thị thiếu sót → Hành động bù ngay",
    step1: "Mục tiêu",
    step2: "Tư cách lưu trú",
    step3: "Khu vực làm việc",
    step4: "Trình độ tiếng Nhật",
    step5: "Kinh nghiệm điều dưỡng",
    step6: "Nhà ở & Nguyện vọng",
    step7: "Liên hệ",
    purposeLabel: "Bạn ưu tiên điều gì?",
    purposeJob: "Tìm việc",
    purposeStudy: "Học tiếng Nhật",
    purposeLife: "Hỗ trợ đời sống",
    visaLabel: "Tư cách hiện tại",
    visaSSW: "Kỹ năng đặc định (SSW)",
    visaStudent: "Du học",
    visaLT: "Định trú/Gia đình v.v.",
    visaNA: "Chưa có/Ở nước ngoài",
    jlptLabel: "Trình độ JLPT",
    none: "Chưa có",
    expLabel: "Kinh nghiệm chăm sóc (tháng)",
    nightLabel: "Có thể trực đêm?",
    yes: "Có",
    no: "Không",
    locationLabel: "Khu vực muốn làm (TP/Quận)",
    salaryLabel: "Lương mong muốn (vạn yên/tháng)",
    housingLabel: "Nhà ở",
    housingDorm: "Muốn ký túc xá công ty",
    housingSelf: "Tự tìm nhà",
    housingFamily: "Ở cùng gia đình",
    startLabel: "Khi nào có thể bắt đầu?",
    startNow: "Ngay lập tức",
    start1to3: "Trong 1–3 tháng",
    start3plus: "Sau 3 tháng",
    contactLabel: "Liên hệ",
    name: "Họ tên",
    email: "Email",
    phone: "Điện thoại/WhatsApp",
    line: "LINE ID",
    messenger: "Messenger",
    zalo: "Zalo",
    comment: "Ghi chú (tuỳ chọn)",
    planBlocks: {
      fit: "Mức độ phù hợp",
      visa: "Visa/Yêu cầu",
      study: "Kế hoạch học",
      life: "Gói đời sống",
      actions: "Hành động ngay"
    },
    sampleJobsTitle: "Việc làm gợi ý (mẫu)",
    sampleLifeTitle: "Thông tin đời sống (ví dụ Yokohama)",
    clipboardJSON: "Sao chép dữ liệu ứng viên (JSON)",
    langToggle: "Ngôn ngữ: 日本語 / Tiếng Việt",
    progress: "Tiến độ",
  },
} as const;

// ---- 型 ----
interface Lead {
  purpose: "job" | "study" | "life" | "multi";
  visa: "ssw" | "student" | "lt" | "na";
  jlpt: "N1" | "N2" | "N3" | "N4" | "N5" | "none";
  expMonths: number;
  nightShift: boolean;
  location: string;
  salaryManYen: number | null;
  housing: "dorm" | "self" | "family";
  startWhen: "now" | "1-3" | "3+";
  contact: {
    name: string;
    email?: string;
    phone?: string;
    line?: string;
    messenger?: string;
    zalo?: string;
    comment?: string;
  };
  meta: {
    lang: "ja" | "vi";
    createdAt: string;
    utm?: Record<string, string | undefined>;
  };
}

const defaultLead: Lead = {
  purpose: "job",
  visa: "na",
  jlpt: "none",
  expMonths: 0,
  nightShift: false,
  location: "",
  salaryManYen: null,
  housing: "dorm",
  startWhen: "now",
  contact: { name: "" },
  meta: { lang: "ja", createdAt: new Date().toISOString() },
};

// ---- ユーティリティ ----
function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }

function computeFitScore(lead: Lead) {
  let score = 0;
  const jlptMap: Record<Lead["jlpt"], number> = { N1: 100, N2: 85, N3: 70, N4: 50, N5: 30, none: 10 };
  score += jlptMap[lead.jlpt] * 0.45;
  score += clamp(lead.expMonths / 24, 0, 1) * 100 * 0.35; // 2年で満点
  score += (lead.nightShift ? 1 : 0) * 100 * 0.1;
  score += (lead.location ? 1 : 0) * 100 * 0.1;
  return Math.round(score);
}

function requirementsGap(lead: Lead) {
  const gaps: string[] = [];
  if (lead.jlpt === "none" || lead.jlpt === "N5") gaps.push("JLPT N4 取得を目指す（語彙・読解・聴解を毎日5分）");
  if (lead.jlpt === "N4") gaps.push("N3に向けた敬語・医療用語を強化（面接想定Q&A付き）");
  if (lead.expMonths < 6) gaps.push("介護現場のOJTまたはボランティア経験を6ヶ月目安で確保");
  if (!lead.location) gaps.push("勤務希望エリアを1つ以上選択（通勤60分内）");
  return gaps;
}

function studyPlan(lead: Lead, lang: "ja"|"vi") {
  const ja = [
    "毎日5分：介護の敬語フレーズ（声かけ/報告）",
    "用語ブースター：バイタル・体位変換・食事介助",
    "録音スピーキング→AIフィードバック（週2回）",
  ];
  const vi = [
    "5 phút mỗi ngày: kính ngữ trong chăm sóc (gọi hỏi/báo cáo)",
    "Từ vựng: dấu hiệu sinh tồn, đổi tư thế, hỗ trợ ăn uống",
    "Ghi âm nói → phản hồi AI (2 lần/tuần)",
  ];
  const base = lang === "ja" ? ja : vi;
  if (lead.jlpt === "none" || lead.jlpt === "N5") base.unshift(lang === "ja" ? "ひらがな/かたかな＋基本文型（各5分）" : "Hiragana/Katakana + mẫu câu cơ bản (mỗi ngày 5 phút)");
  return base;
}

function actionList(lead: Lead, lang: "ja"|"vi") {
  const list_ja = [
    "面談を予約（履歴書・在留カードの写真を用意）",
    "LINEで質問：夜勤可否・寮の希望を伝える",
    "学習ハブに参加して今日の5分課題を完了",
  ];
  const list_vi = [
    "Đặt lịch phỏng vấn (chuẩn bị ảnh thẻ cư trú & sơ yếu lý lịch)",
    "Hỏi trên LINE: ca đêm có thể/không & mong muốn ký túc xá",
    "Vào học liệu và hoàn thành nhiệm vụ 5 phút hôm nay",
  ];
  return (lang === "ja" ? list_ja : list_vi);
}

function sampleJobs(lang: "ja"|"vi") {
  const ja = [
    { name: "特養（横浜市港北区）", salary: "月給23–28万円", visa: "SSW可", house: "寮あり", note: "夜勤2回/月から相談" },
    { name: "老健（川崎市中原区）", salary: "月給24–30万円", visa: "SSW/留学切替可", house: "住宅手当", note: "日本語サポート有" },
    { name: "有料（町田市）", salary: "月給22–27万円", visa: "SSW可", house: "寮/社宅", note: "駅徒歩8分" },
  ];
  const vi = [
    { name: "Viện dưỡng lão (Kohoku, Yokohama)", salary: "23–28 man/tháng", visa: "Hỗ trợ SSW", house: "Ký túc xá", note: "Có thể trực đêm 2 lần/tháng" },
    { name: "Cơ sở phục hồi (Nakahara, Kawasaki)", salary: "24–30 man/tháng", visa: "SSW/Chuyển từ du học", house: "Trợ cấp nhà ở", note: "Có hỗ trợ tiếng Nhật" },
    { name: "Viện chăm sóc (Machida)", salary: "22–27 man/tháng", visa: "SSW", house: "KTX/nhà công ty", note: "8 phút đi bộ từ ga" },
  ];
  return (lang === "ja" ? ja : vi);
}

function sampleLife(lang: "ja"|"vi") {
  const ja = [
    { title: "家賃相場", body: "ワンルーム相場：6.0–7.5万円/月（港北区例）" },
    { title: "通勤例", body: "日吉→現場：東急線20分＋徒歩5分" },
    { title: "ベトナム食材", body: "ベトナムスーパー（綱島/菊名周辺）" },
    { title: "医療・役所", body: "日本語×ベトナム語可の病院/区役所の案内リンク" },
  ];
  const vi = [
    { title: "Giá thuê", body: "Phòng 1 người: 6.0–7.5 man/tháng (ví dụ Kohoku)" },
    { title: "Đi lại", body: "Hiyoshi → cơ sở: 20 phút tàu + 5 phút đi bộ" },
    { title: "Thực phẩm VN", body: "Siêu thị VN (khu Tsurumai/Kikuna)" },
    { title: "Y tế & Hành chính", body: "Bệnh viện/UBND hỗ trợ tiếng Nhật–Việt (link)" },
  ];
  return (lang === "ja" ? ja : vi);
}

// ---- CTA（同一ファイル内）----
function CTA() {
  return (
    <div className="mt-8 rounded-2xl border p-6 bg-gradient-to-br from-sky-50 to-blue-50 shadow">
      <h2 className="text-xl font-bold text-blue-800">無料相談・求人紹介を希望しますか？</h2>
      <p className="text-sm text-blue-700/80 mt-1">
        LINEやMessengerで、ビザ相談から学習プランまで担当者がすぐに返信します。
      </p>
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <a
          href="https://lin.ee/"
          target="_blank"
          className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          LINEで相談する
        </a>
        <a
          href="https://m.me/"
          target="_blank"
          className="inline-flex items-center justify-center rounded-xl px-5 py-3 border hover:bg-white/60"
        >
          Messengerで相談する
        </a>
      </div>
    </div>
  );
}

// ---- ページ本体（唯一の default export）----
export default function OnboardingPage() {
  const [lang, setLang] = useState<"ja"|"vi">("ja");
  const T = L[lang];
  const [step, setStep] = useState(0); // 0: hero, 1..7: form, 8: plan
  const [lead, setLead] = useState<Lead>(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("_onb_lead") : null;
    if (saved) {
      try { return JSON.parse(saved) as Lead; } catch (_) {}
    }
    return defaultLead;
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("_onb_lead", JSON.stringify(lead));
    }
  }, [lead]);

  const progress = useMemo(() => Math.round((clamp(step, 0, 8) / 8) * 100), [step]);
  const fit = useMemo(() => computeFitScore(lead), [lead]);
  const gaps = useMemo(() => requirementsGap(lead), [lead]);

  async function submitLead() {
    setLoading(true);
    try {
      const payload = { ...lead, meta: { ...lead.meta, lang, createdAt: new Date().toISOString() } };
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.warn("/api/lead post failed", e);
    } finally {
      setLoading(false);
      setStep(8);
    }
  }

  const SwitchLang = (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>{T.langToggle}</span>
      <Switch checked={lang === "vi"} onCheckedChange={(v) => setLang(v ? "vi" : "ja")} />
      <span className="font-medium">{lang === "ja" ? "VI" : "JA"}</span>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue-700">🏥 Mediflow Onboarding</h1>
          {SwitchLang}
        </div>

        <Card className="shadow-xl rounded-2xl">
          {step === 0 ? (
            <Hero lang={lang} T={T} onStart={() => setStep(1)} />
          ) : step <= 7 ? (
            <>
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{T.progress}: {progress}%</CardTitle>
                  <Progress value={progress} className="w-40" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {step === 1 && <StepPurpose lang={lang} T={T} lead={lead} setLead={setLead} />}
                {step === 2 && <StepVisa lang={lang} T={T} lead={lead} setLead={setLead} />}
                {step === 3 && <StepLocationSalary lang={lang} T={T} lead={lead} setLead={setLead} />}
                {step === 4 && <StepJLPT lang={lang} T={T} lead={lead} setLead={setLead} />}
                {step === 5 && <StepExperience lang={lang} T={T} lead={lead} setLead={setLead} />}
                {step === 6 && <StepHousingStart lang={lang} T={T} lead={lead} setLead={setLead} />}
                {step === 7 && <StepContact lang={lang} T={T} lead={lead} setLead={setLead} />}

                {/* Nav */}
                <div className="flex items-center justify-between pt-2">
                  <Button variant="ghost" onClick={() => setStep((s) => clamp(s - 1, 0, 8))}>
                    <ChevronLeft className="mr-1 h-4 w-4" /> {T.back}
                  </Button>

                  {step < 7 ? (
                    <Button onClick={() => setStep((s) => clamp(s + 1, 0, 8))}>
                      {T.next} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={submitLead} disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {T.submit}
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" /> {T.submit}
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Button variant="outline" size="sm" >
                    <Clipboard className="mr-1 h-3 w-3" /> {T.clipboardJSON}
                  </Button>
                  {copied && <span className="text-emerald-600">{T.copied}</span>}
                </div>
              </CardContent>
            </>
          ) : (
            <PlanView lang={lang} T={T} lead={lead} fit={fit} gaps={gaps} onBack={() => setStep(3)} />
          )}
        </Card>

        {/* CTA をページ下部に表示 */}
        <CTA />
      </div>
    </div>
  );
}

// ---- Hero ----
function Hero({ lang, T, onStart }: { lang: "ja"|"vi"; T: typeof L["ja"]; onStart: () => void; }) {
  return (
    <>
      <CardHeader className="text-center space-y-2 pt-8">
        <CardTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {T.heroTitle}
        </CardTitle>
        <p className="text-muted-foreground">{T.heroSub}</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 pb-8">
        <Button className="bg-green-600 hover:bg-green-700 text-white text-base px-6 py-6 rounded-2xl shadow-md" onClick={onStart}>
          {T.start}
        </Button>
        <p className="text-xs text-muted-foreground">{T.langToggle}</p>
      </CardContent>
    </>
  );
}

// ---- Step 1: Purpose ----
function StepPurpose({ lang, T, lead, setLead }: any) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{T.purposeLabel}</Label>
      <RadioGroup
        value={lead.purpose}
        onValueChange={(v) => setLead((d: Lead) => ({ ...d, purpose: v }))}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        <RadioOption value="job" label={T.purposeJob} />
        <RadioOption value="study" label={T.purposeStudy} />
        <RadioOption value="life" label={T.purposeLife} />
      </RadioGroup>
    </div>
  );
}

// ---- Step 2: Visa ----
function StepVisa({ lang, T, lead, setLead }: any) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{T.visaLabel}</Label>
      <Select value={lead.visa} onValueChange={(v) => setLead((d: Lead) => ({ ...d, visa: v }))}>
        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ssw">{T.visaSSW}</SelectItem>
          <SelectItem value="student">{T.visaStudent}</SelectItem>
          <SelectItem value="lt">{T.visaLT}</SelectItem>
          <SelectItem value="na">{T.visaNA}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// ---- Step 3: Location & Salary ----
function StepLocationSalary({ lang, T, lead, setLead }: any) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>{T.locationLabel}</Label>
        <Input
          value={lead.location}
          onChange={(e) => setLead((d: Lead) => ({ ...d, location: e.target.value }))}
          placeholder={lang === "ja" ? "例：横浜市 港北区" : "VD: Yokohama, Kohoku"}
        />
      </div>
      <div className="grid gap-2">
        <Label>{T.salaryLabel}</Label>
        <Input
          type="number" min={0} step={0.5}
          value={lead.salaryManYen ?? ""}
          onChange={(e) => setLead((d: Lead) => ({ ...d, salaryManYen: e.target.value ? Number(e.target.value) : null }))}
          placeholder={lang === "ja" ? "例：24（万円）" : "VD: 24 (man/tháng)"}
        />
      </div>
    </div>
  );
}

// ---- Step 4: JLPT ----
function StepJLPT({ lang, T, lead, setLead }: any) {
  return (
    <div className="grid gap-2">
      <Label>{T.jlptLabel}</Label>
      <Select value={lead.jlpt} onValueChange={(v) => setLead((d: Lead) => ({ ...d, jlpt: v }))}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="N1">N1</SelectItem>
          <SelectItem value="N2">N2</SelectItem>
          <SelectItem value="N3">N3</SelectItem>
          <SelectItem value="N4">N4</SelectItem>
          <SelectItem value="N5">N5</SelectItem>
          <SelectItem value="none">{T.none}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// ---- Step 5: Experience ----
function StepExperience({ lang, T, lead, setLead }: any) {
  return (
    <div className="grid gap-2">
      <Label>{T.expLabel}</Label>
      <Input
        type="number" min={0} step={1}
        value={lead.expMonths}
        onChange={(e) => setLead((d: Lead) => ({ ...d, expMonths: Number(e.target.value || 0) }))}
      />
      <div className="flex items-center gap-2 pt-1">
        <Label className="text-sm">{T.nightLabel}</Label>
        <Switch checked={lead.nightShift} onCheckedChange={(v) => setLead((d: Lead) => ({ ...d, nightShift: v }))} />
        <span className="text-xs text-muted-foreground">{lead.nightShift ? T.yes : T.no}</span>
      </div>
    </div>
  );
}

// ---- Step 6: Housing & Start ----
function StepHousingStart({ lang, T, lead, setLead }: any) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>{T.housingLabel}</Label>
        <RadioGroup
          value={lead.housing}
          onValueChange={(v) => setLead((d: Lead) => ({ ...d, housing: v }))}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <RadioOption value="dorm" label={T.housingDorm} />
          <RadioOption value="self" label={T.housingSelf} />
          <RadioOption value="family" label={T.housingFamily} />
        </RadioGroup>
      </div>
      <div className="grid gap-2">
        <Label>{T.startLabel}</Label>
        <RadioGroup
          value={lead.startWhen}
          onValueChange={(v) => setLead((d: Lead) => ({ ...d, startWhen: v }))}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <RadioOption value="now" label={T.startNow} />
          <RadioOption value="1-3" label={T.start1to3} />
          <RadioOption value="3+" label={T.start3plus} />
        </RadioGroup>
      </div>
    </div>
  );
}

// ---- Step 7: Contact ----
function StepContact({ lang, T, lead, setLead }: any) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>{T.name}</Label>
        <Input
          value={lead.contact.name}
          onChange={(e) => setLead((d: Lead) => ({ ...d, contact: { ...d.contact, name: e.target.value } }))}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>{T.email}</Label>
          <Input
            type="email"
            value={lead.contact.email || ""}
            onChange={(e) => setLead((d: Lead) => ({ ...d, contact: { ...d.contact, email: e.target.value } }))}
          />
        </div>
        <div className="grid gap-2">
          <Label>{T.phone}</Label>
          <Input
            value={lead.contact.phone || ""}
            onChange={(e) => setLead((d: Lead) => ({ ...d, contact: { ...d.contact, phone: e.target.value } }))}
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label>{T.line}</Label>
          <Input
            value={lead.contact.line || ""}
            onChange={(e) => setLead((d: Lead) => ({ ...d, contact: { ...d.contact, line: e.target.value } }))}
          />
        </div>
        <div className="grid gap-2">
          <Label>{T.messenger}</Label>
          <Input
            value={lead.contact.messenger || ""}
            onChange={(e) => setLead((d: Lead) => ({ ...d, contact: { ...d.contact, messenger: e.target.value } }))}
          />
        </div>
        <div className="grid gap-2">
          <Label>{T.zalo}</Label>
          <Input
            value={lead.contact.zalo || ""}
            onChange={(e) => setLead((d: Lead) => ({ ...d, contact: { ...d.contact, zalo: e.target.value } }))}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>{T.comment}</Label>
        <Textarea
          value={lead.contact.comment || ""}
          onChange={(e) => setLead((d: Lead) => ({ ...d, contact: { ...d.contact, comment: e.target.value } }))}
        />
      </div>
    </div>
  );
}

// ---- Plan View ----
function PlanView({ lang, T, lead, fit, gaps, onBack }: any) {
  const jobs = sampleJobs(lang);
  const life = sampleLife(lang);
  const study = studyPlan(lead, lang);
  const actions = actionList(lead, lang);

  return (
    <>
      <CardHeader className="space-y-2 pt-8">
        <CardTitle className="text-2xl font-bold">{T.planTitle}</CardTitle>
        <p className="text-muted-foreground">{T.planSub}</p>
      </CardHeader>
      <CardContent className="grid gap-6 pb-8">
        {/* Fit */}
        <section className="grid gap-2">
          <h3 className="font-semibold">{T.planBlocks.fit}</h3>
          <div className="flex items-center gap-3">
            <Progress value={fit} className="w-56" />
            <span className="text-sm text-muted-foreground">{fit}/100</span>
          </div>
        </section>

        {/* Visa/Gaps */}
        <section className="grid gap-2">
          <h3 className="font-semibold">{T.planBlocks.visa}</h3>
          {gaps.length === 0 ? (
            <p className="text-sm text-emerald-600">✅ OK</p>
          ) : (
            <ul className="list-disc ml-5 text-sm space-y-1">
              {gaps.map((g: string, i: number) => <li key={i}>{g}</li>)}
            </ul>
          )}
        </section>

        {/* Study */}
        <section className="grid gap-2">
          <h3 className="font-semibold">{T.planBlocks.study}</h3>
          <ul className="list-disc ml-5 text-sm space-y-1">
            {study.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ul>
        </section>

        {/* Jobs */}
        <section className="grid gap-3">
          <h3 className="font-semibold">{T.sampleJobsTitle}</h3>
          <div className="grid gap-3">
            {jobs.map((j: any, idx: number) => (
              <div key={idx} className="grid sm:grid-cols-5 gap-2 rounded-xl border p-3">
                <div className="font-medium sm:col-span-2">{j.name}</div>
                <div className="text-sm">{j.salary}</div>
                <div className="text-sm">{j.visa}</div>
                <div className="text-sm">{j.house}・{j.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Life */}
        <section className="grid gap-3">
          <h3 className="font-semibold">{T.sampleLifeTitle}</h3>
          <div className="grid gap-3">
            {life.map((l: any, idx: number) => (
              <div key={idx} className="rounded-xl border p-3">
                <div className="font-medium">{l.title}</div>
                <div className="text-sm text-muted-foreground">{l.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <section className="grid gap-2">
          <h3 className="font-semibold">{T.planBlocks.actions}</h3>
          <ul className="list-disc ml-5 text-sm space-y-1">
            {actions.map((a: string, i: number) => <li key={i}>{a}</li>)}
          </ul>
        </section>

        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" onClick={onBack}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            {T.back}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={async () => {
              try { await navigator.clipboard.writeText(JSON.stringify(lead, null, 2)); } catch (_) {}
            }}>
              <Clipboard className="mr-1 h-4 w-4" /> {T.download}
            </Button>
            <Button onClick={async () => {
              try {
                const res = await fetch("/api/lead", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(lead)
                });
                console.log("posted:", await res.text());
              } catch (e) { console.warn(e); }
            }}>{T.saveAndSend}</Button>
          </div>
        </div>
      </CardContent>
    </>
  );
}

// ---- 共通: RadioOption ----
function RadioOption({ value, label }: { value: string; label: string; }) {
  return (
    <Label className="flex items-center gap-2 border rounded-xl px-4 py-3 cursor-pointer hover:bg-slate-50">
      <RadioGroupItem value={value} />
      <span>{label}</span>
    </Label>
  );
}

return (
  <div className="min-h-dvh bg-gradient-to-b from-sky-50 to-white">
    {/* 追加 */}
    <SiteHeader />

    <main className="mx-auto max-w-5xl px-4 py-10">
      {/* ここに既存のオンボーディングUI */}
      {/* ...フォーム... */}
      {/* ...結果(上記のコピー削除版)... */}

      {/* CTA */}
      <CTA />
    </main>

    {/* 追加 */}
    <SiteFooter />
  </div>
);
