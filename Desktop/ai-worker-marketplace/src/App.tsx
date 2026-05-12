// @ts-nocheck
import { useMemo, useState } from "react";

const WORKERS = [
  { id: "chatgpt", name: "ChatGPT", website: "https://chatgpt.com", category: "writing", icon: "CG", job: { en: "Helps with writing, research, and ideas", ja: "文章作成、調査、アイデア出しを支援" }, price: { en: "Free plan / Plus plan available", ja: "無料あり / Plusプランあり" }, reviews: [] },
  { id: "claude", name: "Claude", website: "https://claude.ai", category: "writing", icon: "CL", job: { en: "Helps with long-form writing and analysis", ja: "長文作成や分析を支援" }, price: { en: "Free plan / Pro plan available", ja: "無料あり / Proプランあり" }, reviews: [] },
  { id: "gemini", name: "Gemini", website: "https://gemini.google.com", category: "writing", icon: "G", job: { en: "Google AI assistant for everyday tasks", ja: "日常作業向けのGoogle系AIアシスタント" }, price: { en: "Free plan / Paid plan available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "notion-ai", name: "Notion AI", website: "https://www.notion.so/product/ai", category: "writing", icon: "N", job: { en: "Helps with writing and summaries inside Notion", ja: "Notion内の文章作成や要約を支援" }, price: { en: "Paid plan available", ja: "有料プランあり" }, reviews: [] },
  { id: "jasper", name: "Jasper", website: "https://www.jasper.ai", category: "marketing", icon: "J", job: { en: "Helps create marketing content", ja: "マーケティング文章の作成を支援" }, price: { en: "Paid plans available", ja: "有料プランあり" }, reviews: [] },
  { id: "devin", name: "Devin", website: "https://devin.ai", category: "development", icon: "D", job: { en: "Helps with software development tasks", ja: "ソフトウェア開発作業を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "cursor", name: "Cursor", website: "https://cursor.com", category: "development", icon: "C", job: { en: "AI code editor for writing and editing code", ja: "コード作成や修正を支援するAIエディタ" }, price: { en: "Free plan / Pro plan available", ja: "無料あり / Proプランあり" }, reviews: [] },
  { id: "github-copilot", name: "GitHub Copilot", website: "https://github.com/features/copilot", category: "development", icon: "GH", job: { en: "Helps with code completion and generation", ja: "コード補完や生成を支援" }, price: { en: "Free plan / Pro plan available", ja: "無料あり / Proプランあり" }, reviews: [] },
  { id: "replit-agent", name: "Replit Agent", website: "https://replit.com", category: "development", icon: "R", job: { en: "Helps prototype and build apps", ja: "アプリの試作や開発を支援" }, price: { en: "Paid plan / Usage-based pricing", ja: "有料プランあり / 利用量により変動" }, reviews: [] },
  { id: "sierra", name: "Sierra", website: "https://sierra.ai", category: "support", icon: "S", job: { en: "Helps with customer support workflows", ja: "カスタマーサポート業務を支援" }, price: { en: "Contact sales / Enterprise", ja: "要問い合わせ / 企業向け" }, reviews: [] },
  { id: "lindy", name: "Lindy", website: "https://lindy.ai", category: "other", icon: "L", job: { en: "Helps with scheduling, email, and admin tasks", ja: "予定、メール、事務作業を支援" }, price: { en: "Public pricing available / Check official website", ja: "公開価格あり / 公式サイトを確認" }, reviews: [] },
  { id: "zapier-agents", name: "Zapier Agents", website: "https://zapier.com/agents", category: "data", icon: "Z", job: { en: "Helps automate workflows across apps", ja: "アプリ連携と業務自動化を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "perplexity", name: "Perplexity", website: "https://perplexity.ai", category: "writing", icon: "P", job: { en: "Helps with research and web search", ja: "調査やWeb検索を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "harvey", name: "Harvey", website: "https://harvey.ai", category: "writing", icon: "H", job: { en: "Helps with legal document workflows", ja: "法律文書関連の作業を支援" }, price: { en: "Contact sales / Enterprise", ja: "要問い合わせ / 企業向け" }, reviews: [] },
  { id: "elevenlabs", name: "ElevenLabs", website: "https://elevenlabs.io", category: "design", icon: "E", job: { en: "Helps create AI voice content", ja: "AI音声コンテンツ作成を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "midjourney", name: "Midjourney", website: "https://www.midjourney.com", category: "design", icon: "M", job: { en: "Helps generate images", ja: "画像生成を支援" }, price: { en: "Paid plans available", ja: "有料プランあり" }, reviews: [] },
  { id: "runway", name: "Runway", website: "https://runwayml.com", category: "design", icon: "RW", job: { en: "Helps generate and edit videos", ja: "動画生成や編集を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "heygen", name: "HeyGen", website: "https://www.heygen.com", category: "design", icon: "HG", job: { en: "Helps create AI avatar videos", ja: "AIアバター動画作成を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "suno", name: "Suno", website: "https://suno.com", category: "design", icon: "SU", job: { en: "Helps generate music", ja: "AI音楽生成を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "grok", name: "Grok", website: "https://x.ai", category: "writing", icon: "GR", job: { en: "Helps with conversations and research", ja: "対話や調査を支援" }, price: { en: "Paid plans available", ja: "有料プランあり" }, reviews: [] },
  { id: "deepseek", name: "DeepSeek", website: "https://www.deepseek.com", category: "development", icon: "DS", job: { en: "Helps with coding and reasoning", ja: "コード生成や推論を支援" }, price: { en: "Free plan available", ja: "無料あり" }, reviews: [] },
  { id: "v0", name: "v0", website: "https://v0.dev", category: "development", icon: "V0", job: { en: "Helps generate UI code", ja: "UIコード生成を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "bolt", name: "Bolt", website: "https://bolt.new", category: "development", icon: "B", job: { en: "Helps build web apps", ja: "Webアプリ開発を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "lovable", name: "Lovable", website: "https://lovable.dev", category: "development", icon: "LV", job: { en: "Helps generate app UI", ja: "アプリUI生成を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "gamma", name: "Gamma", website: "https://gamma.app", category: "design", icon: "GA", job: { en: "Helps create presentations", ja: "プレゼン資料作成を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "manus", name: "Manus", website: "https://manus.im", category: "other", icon: "MS", job: { en: "Helps with multi-step tasks", ja: "複数ステップの作業を支援" }, price: { en: "Check official website", ja: "公式サイトを確認" }, reviews: [] },
  { id: "genspark", name: "Genspark", website: "https://www.genspark.ai", category: "writing", icon: "GS", job: { en: "Helps with research and documents", ja: "調査や資料作成を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "phind", name: "Phind", website: "https://www.phind.com", category: "development", icon: "PH", job: { en: "Helps developers search faster", ja: "開発者向け検索を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "windsurf", name: "Windsurf", website: "https://windsurf.com", category: "development", icon: "WS", job: { en: "AI code editor", ja: "AIコードエディタ" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "cline", name: "Cline", website: "https://cline.bot", category: "development", icon: "CI", job: { en: "AI coding help for VS Code", ja: "VS Code上のAI開発支援" }, price: { en: "Open source / Depends on model usage", ja: "オープンソース / 利用モデルにより変動" }, reviews: [] },
  { id: "continue", name: "Continue", website: "https://www.continue.dev", category: "development", icon: "CN", job: { en: "AI coding assistant", ja: "AIコードアシスタント" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "openhands", name: "OpenHands", website: "https://www.all-hands.dev", category: "development", icon: "OH", job: { en: "AI agent for development tasks", ja: "開発タスクを支援するAIエージェント" }, price: { en: "Open source / Check official website", ja: "オープンソース / 公式サイトを確認" }, reviews: [] },
  { id: "open-interpreter", name: "Open Interpreter", website: "https://www.openinterpreter.com", category: "development", icon: "OI", job: { en: "Helps with PC tasks and code execution", ja: "PC操作やコード実行を支援" }, price: { en: "Open source / Check official website", ja: "オープンソース / 公式サイトを確認" }, reviews: [] },
  { id: "autogpt", name: "AutoGPT", website: "https://agpt.co", category: "development", icon: "AG", job: { en: "Helps build AI agents", ja: "AIエージェント構築を支援" }, price: { en: "Check official website", ja: "公式サイトを確認" }, reviews: [] },
  { id: "crewai", name: "CrewAI", website: "https://www.crewai.com", category: "development", icon: "CR", job: { en: "Helps build multi-agent systems", ja: "複数AIエージェントの構築を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "langchain", name: "LangChain", website: "https://www.langchain.com", category: "development", icon: "LC", job: { en: "Helps develop AI apps", ja: "AIアプリ開発を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "langgraph", name: "LangGraph", website: "https://www.langchain.com/langgraph", category: "development", icon: "LG", job: { en: "Builds AI agent workflows", ja: "AIエージェントワークフローを構築" }, price: { en: "Check official website", ja: "公式サイトを確認" }, reviews: [] },
  { id: "microsoft-autogen", name: "Microsoft AutoGen", website: "https://microsoft.github.io/autogen/", category: "development", icon: "AU", job: { en: "Helps with multi-agent development", ja: "マルチエージェント開発を支援" }, price: { en: "Open source", ja: "オープンソース" }, reviews: [] },
  { id: "flowise", name: "Flowise", website: "https://flowiseai.com", category: "development", icon: "FL", job: { en: "Builds AI flows without code", ja: "ノーコードでAIフローを構築" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "make", name: "Make", website: "https://www.make.com", category: "data", icon: "MK", job: { en: "Helps automate workflows", ja: "業務自動化を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "n8n", name: "n8n", website: "https://n8n.io", category: "data", icon: "N8", job: { en: "Helps automate workflows", ja: "ワークフロー自動化を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "clay", name: "Clay", website: "https://www.clay.com", category: "sales", icon: "CY", job: { en: "Helps with sales research", ja: "営業リサーチを支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "artisan", name: "Artisan", website: "https://www.artisan.co", category: "sales", icon: "AR", job: { en: "Helps with sales tasks", ja: "営業活動を支援" }, price: { en: "Contact sales / Paid plans available", ja: "要問い合わせ / 有料プランあり" }, reviews: [] },
  { id: "11x", name: "11x", website: "https://www.11x.ai", category: "sales", icon: "11", job: { en: "AI worker for sales", ja: "営業AIワーカー" }, price: { en: "Contact sales / Enterprise", ja: "要問い合わせ / 企業向け" }, reviews: [] },
  { id: "copy-ai", name: "Copy.ai", website: "https://www.copy.ai", category: "marketing", icon: "CP", job: { en: "Helps with sales and marketing writing", ja: "営業・マーケ文章を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "anyword", name: "Anyword", website: "https://www.anyword.com", category: "marketing", icon: "AW", job: { en: "Helps create ad copy", ja: "広告文作成を支援" }, price: { en: "Paid plans available", ja: "有料プランあり" }, reviews: [] },
  { id: "synthesia", name: "Synthesia", website: "https://www.synthesia.io", category: "design", icon: "SY", job: { en: "Helps create AI videos", ja: "AI動画制作を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "pika", name: "Pika", website: "https://pika.art", category: "design", icon: "PK", job: { en: "Helps generate AI videos", ja: "AI動画生成を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "canva-ai", name: "Canva AI", website: "https://www.canva.com/ai/", category: "design", icon: "CA", job: { en: "Helps create designs", ja: "デザイン作成を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "adobe-firefly", name: "Adobe Firefly", website: "https://www.adobe.com/products/firefly.html", category: "design", icon: "AF", job: { en: "Helps generate and edit images", ja: "画像生成や編集を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "descript", name: "Descript", website: "https://www.descript.com", category: "design", icon: "DE", job: { en: "Helps edit video and audio", ja: "動画・音声編集を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "otter", name: "Otter.ai", website: "https://otter.ai", category: "other", icon: "OT", job: { en: "Helps transcribe meetings", ja: "会議の文字起こしを支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "fireflies", name: "Fireflies.ai", website: "https://fireflies.ai", category: "other", icon: "FF", job: { en: "Helps record and summarize meetings", ja: "会議記録や要約を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "granola", name: "Granola", website: "https://www.granola.ai", category: "other", icon: "GN", job: { en: "Helps create meeting notes", ja: "会議メモ作成を支援" }, price: { en: "Check official website", ja: "公式サイトを確認" }, reviews: [] },
  { id: "notebooklm", name: "NotebookLM", website: "https://notebooklm.google.com", category: "writing", icon: "NB", job: { en: "Helps summarize documents", ja: "資料の整理や要約を支援" }, price: { en: "Free plan available / Check official website", ja: "無料あり / 公式サイトを確認" }, reviews: [] },
  { id: "tavily", name: "Tavily", website: "https://www.tavily.com", category: "development", icon: "TV", job: { en: "Helps AI web search", ja: "AI向けWeb検索を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "mem0", name: "Mem0", website: "https://mem0.ai", category: "development", icon: "M0", job: { en: "Helps AI memory systems", ja: "AIの記憶機能を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
  { id: "agentops", name: "AgentOps", website: "https://www.agentops.ai", category: "development", icon: "AO", job: { en: "Helps manage AI agents", ja: "AIエージェント運用を支援" }, price: { en: "Free plan / Paid plans available", ja: "無料あり / 有料プランあり" }, reviews: [] },
];

const CATEGORIES = {
  en: [
    { key: "all", label: "All" },
    { key: "development", label: "Development" },
    { key: "sales", label: "Sales" },
    { key: "marketing", label: "Marketing" },
    { key: "design", label: "Design" },
    { key: "writing", label: "Writing" },
    { key: "data", label: "Data" },
    { key: "support", label: "Customer Support" },
    { key: "other", label: "Other" },
  ],
  ja: [
    { key: "all", label: "すべて" },
    { key: "development", label: "開発" },
    { key: "sales", label: "営業" },
    { key: "marketing", label: "マーケティング" },
    { key: "design", label: "デザイン" },
    { key: "writing", label: "文章作成" },
    { key: "data", label: "データ分析" },
    { key: "support", label: "カスタマーサポート" },
    { key: "other", label: "その他" },
  ],
};

const CATEGORY_LABELS = {
  development: { en: "Development", ja: "開発" },
  sales: { en: "Sales", ja: "営業" },
  marketing: { en: "Marketing", ja: "マーケティング" },
  design: { en: "Design", ja: "デザイン" },
  writing: { en: "Writing", ja: "文章作成" },
  data: { en: "Data", ja: "データ分析" },
  support: { en: "Customer Support", ja: "カスタマーサポート" },
  other: { en: "Other", ja: "その他" },
};

function stars(value) {
  return "★".repeat(value) + "☆".repeat(5 - value);
}

function averageRating(worker) {
  if (!worker.reviews.length) return null;
  const total = worker.reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / worker.reviews.length).toFixed(1);
}

function textByLang(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || value?.ja || "";
}

function ReviewForm({ worker, onAddReview, language }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  function submitReview() {
    if (!text.trim()) return;
    onAddReview(worker.id, {
      name: name.trim() || (language === "en" ? "Anonymous" : "匿名ユーザー"),
      rating,
      text: text.trim(),
    });
    setName("");
    setText("");
    setRating(5);
    setIsOpen(false);
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen((current) => !current)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-50"
      >
        {isOpen
          ? language === "en" ? "Close Review" : "レビュー欄を閉じる"
          : language === "en" ? "Write Review" : "レビューを書く"}
      </button>

      {isOpen && (
        <div className="mt-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setRating(num)}
                className={`rounded-xl px-3 py-2 text-lg font-black ${rating >= num ? "bg-slate-950 text-white" : "bg-white text-slate-400"}`}
              >
                ★
              </button>
            ))}
            <span className="text-sm font-bold text-slate-500">{rating} / 5</span>
          </div>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={language === "en" ? "Name (optional)" : "名前 任意"}
            className="mb-3 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none ring-slate-900/10 transition focus:ring-4"
          />
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={language === "en" ? `Write your review about ${worker.name}` : `${worker.name}を使ってみた感想を書いてください`}
            className="mb-3 min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none ring-slate-900/10 transition focus:ring-4"
          />
          <button onClick={submitReview} className="h-11 w-full rounded-2xl bg-slate-950 text-sm font-black text-white transition hover:bg-slate-800">
            {language === "en" ? "Submit Review" : "レビューを投稿する"}
          </button>
        </div>
      )}
    </div>
  );
}

function LogoMark({ worker }) {
  const domain = new URL(worker.website).hostname.replace("www.", "");

  return (
    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <img
        src={`https://api.faviconkit.com/${domain}/128`}
        alt={worker.name}
        className="h-10 w-10 object-contain"
        onError={(event) => {
          event.currentTarget.style.display = "none";
          const parent = event.currentTarget.parentElement;
          if (parent) {
            parent.innerHTML = `<span class="text-sm font-black text-slate-700">${worker.icon}</span>`;
          }
        }}
      />
    </div>
  );
}

function WorkerCard({ worker, onAddReview, language }) {
  const avg = averageRating(worker);
  const hasReviews = worker.reviews.length > 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-4">
        <LogoMark worker={worker} />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-slate-400">
          <path d="M12 21s-6.716-4.35-9.193-8.296C.33 8.758 2.223 4 6.75 4c2.12 0 3.405 1.135 4.25 2.25C11.845 5.135 13.13 4 15.25 4 19.777 4 21.67 8.758 21.193 12.704 18.716 16.65 12 21 12 21z" />
        </svg>
      </div>

      <h3 className="text-xl font-black tracking-tight text-slate-950">{worker.name}</h3>
      <div className="mt-3 min-h-[52px] text-sm leading-6 text-slate-600">
        {textByLang(worker.job, language)}
      </div>

      <div className="mt-4 text-sm">
        {hasReviews ? (
          <div className="font-bold text-slate-700">
            <span className="text-amber-500">★</span> {avg} <span className="font-medium text-slate-500">({worker.reviews.length})</span>
          </div>
        ) : (
          <div className="font-medium text-slate-500">
            {language === "en" ? "No reviews" : "レビューなし"}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm font-semibold text-slate-700">
        {textByLang(worker.price, language)}
      </div>

      {hasReviews && (
        <div className="mt-4 space-y-2">
          {worker.reviews.slice(0, 2).map((review, index) => (
            <div key={index} className="rounded-2xl bg-slate-50 p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="text-xs font-black text-slate-900">{review.name}</div>
                <div className="text-xs font-black text-slate-900">{stars(review.rating)}</div>
              </div>
              <p className="text-xs leading-5 text-slate-600">{review.text}</p>
            </div>
          ))}
        </div>
      )}

      <ReviewForm worker={worker} onAddReview={onAddReview} language={language} />

      <a
        href={worker.website}
        target="_blank"
        rel="noreferrer"
        className="mt-3 flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
      >
        {language === "en" ? "Official Website" : "公式サイト"}
      </a>
    </div>
  );
}

export default function AIWorkerMarketplaceSimple() {
  const [workers, setWorkers] = useState(WORKERS);
  const [language, setLanguage] = useState("en");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("reviews");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = workers.filter((worker) => {
      const matchesCategory = category === "all" || worker.category === category;
      const text = [
        worker.name,
        CATEGORY_LABELS[worker.category]?.[language],
        textByLang(worker.job, language),
        textByLang(worker.price, language),
      ].join(" ").toLowerCase();
      return matchesCategory && text.includes(q);
    });

    return [...list].sort((a, b) => {
      if (sort === "rating") {
        const aRating = averageRating(a);
        const bRating = averageRating(b);
        if (aRating === null && bRating === null) return 0;
        if (aRating === null) return 1;
        if (bRating === null) return -1;
        return Number(bRating) - Number(aRating);
      }
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.reviews.length - a.reviews.length;
    });
  }, [workers, query, category, sort, language]);

  function addReview(workerId, review) {
    setWorkers((current) =>
      current.map((worker) =>
        worker.id === workerId ? { ...worker, reviews: [review, ...worker.reviews] } : worker
      )
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <main>
        <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="mb-8 flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setLanguage("en");
                setCategory("all");
              }}
              className={`rounded-2xl px-4 py-2 text-sm font-black transition ${language === "en" ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-700"}`}
            >
              EN
            </button>
            <button
              onClick={() => {
                setLanguage("ja");
                setCategory("all");
              }}
              className={`rounded-2xl px-4 py-2 text-sm font-black transition ${language === "ja" ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-700"}`}
            >
              JP
            </button>
          </div>

          <h1 className="max-w-5xl text-5xl font-black tracking-tight md:text-7xl">
            AI Worker Marketplace
          </h1>

          <div className="relative mt-9 max-w-3xl">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={language === "en" ? "Search AI Workers (ex: coding, marketing, video editing)" : "AI Workerを検索（例：メール作成、データ分析）"}
              className="h-16 w-full rounded-3xl border border-slate-200 bg-white pl-16 pr-6 text-base shadow-sm outline-none ring-slate-900/10 transition focus:ring-4"
            />
          </div>

          <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
            {CATEGORIES[language].map((item) => (
              <button
                key={item.key}
                onClick={() => setCategory(item.key)}
                className={`whitespace-nowrap rounded-2xl px-5 py-3 text-sm font-black transition ${category === item.key ? "bg-slate-950 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section id="workers" className="border-t border-slate-200 bg-white/40 px-6 py-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  {language === "en" ? "AI Workers" : "AI Worker一覧"}
                </h2>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  {language === "en" ? `${filtered.length} results` : `${filtered.length}件見つかりました`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none ring-slate-900/10 transition focus:ring-4"
                >
                  <option value="reviews">{language === "en" ? "Most Reviewed" : "レビュー数順"}</option>
                  <option value="rating">{language === "en" ? "Top Rated" : "レビュー評価順"}</option>
                  <option value="name">{language === "en" ? "Name" : "名前順"}</option>
                </select>
                <a href="#workers" className="hidden items-center gap-2 text-sm font-black text-blue-600 md:flex">
                  {language === "en" ? "Browse All →" : "すべて見る →"}
                </a>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {filtered.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} onAddReview={addReview} language={language} />
              ))}
            </div>
          </div>
        </section>

        <section id="submit" className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-black tracking-tight">
              {language === "en" ? "Submit AI" : "AIを登録する"}
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              {language === "en"
                ? "Submit AI tools or workers for future listing consideration."
                : "掲載したいAI Workerがあれば、候補として送れます。"}
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <input placeholder={language === "en" ? "AI Name" : "AI名"} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none ring-slate-900/10 transition focus:ring-4" />
              <input placeholder={language === "en" ? "Official URL" : "公式URL"} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none ring-slate-900/10 transition focus:ring-4" />
              <button className="h-12 rounded-2xl bg-slate-950 text-sm font-black text-white hover:bg-slate-800">
                {language === "en" ? "Submit" : "掲載候補にする"}
              </button>
            </div>
          </div>
        </section>
              <footer className="mx-auto max-w-7xl px-6 pb-10 text-center text-xs text-slate-500">
          {language === "en"
            ? "All product names, logos, and brands are property of their respective owners."
            : "各サービス名・ロゴ・商標は各権利所有者に帰属します。"}
        </footer>
      </main>
    </div>
  );
}      
