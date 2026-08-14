import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  ShieldAlert, 
  Tag, 
  Swords, 
  Send, 
  Copy, 
  Check, 
  Globe2, 
  Building2, 
  MessageSquare, 
  Percent, 
  AlertTriangle, 
  TrendingUp, 
  FileText,
  DollarSign,
  Layers,
  Zap,
  Info,
  Search,
  Bot,
  Compass,
  ArrowRight,
  Code2,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { BuyerDueDiligence, AIPitchResult } from '../types';
import { EchoLogo } from './EchoLogo';

interface AIWorkbenchModuleProps {
  initialBuyerCompany?: string;
  initialCountry?: string;
  initialProduct?: string;
}

export const AIWorkbenchModule: React.FC<AIWorkbenchModuleProps> = ({
  initialBuyerCompany = 'Apex Industrial Dynamics Inc.',
  initialCountry = 'United States',
  initialProduct = 'Precision Reduction Gearbox Units & Bearings'
}) => {
  const [activeTab, setActiveTab] = useState<'pitch' | 'diligence' | 'hscode' | 'seogeo'>('seogeo');

  // ECHO 5F SEO & GEO State
  const [seogeoProduct, setSeogeoProduct] = useState(initialProduct);
  const [seogeoCountries, setSeogeoCountries] = useState('North America (US/CA), Western Europe (DE/IT/FR), Middle East (UAE/Saudi)');
  const [seogeoWebsite, setSeogeoWebsite] = useState('https://www.echo5f-precision.com');
  const [seogeoStrength, setSeogeoStrength] = useState('Direct ISO9001 Factory, 15-day Rapid Delivery, OEM/ODM Custom Logo, 100% Pre-shipment Testing, 24/7 Global Engineering Support');
  const [seogeoCompetitors, setSeogeoCompetitors] = useState('German High-End Brands, Japanese Exporters, Local Stocking Distributors');
  const [seogeoLoading, setSeogeoLoading] = useState(false);
  const [seogeoResult, setSeogeoResult] = useState<any | null>(null);

  // Pitch State
  const [pitchBuyer, setPitchBuyer] = useState(initialBuyerCompany);
  const [pitchContact, setPitchContact] = useState('Purchasing Director / Sourcing Lead');
  const [pitchCountry, setPitchCountry] = useState(initialCountry);
  const [pitchProduct, setPitchProduct] = useState(initialProduct);
  const [pitchSpecs, setPitchSpecs] = useState('Standard export specification, ISO 9001 certified, custom OEM laser logo');
  const [pitchQty, setPitchQty] = useState('1x 20GP Container (5,000 Sets)');
  const [pitchTargetPrice, setPitchTargetPrice] = useState('$28.20 / Set FOB Ningbo');
  const [pitchExporter, setPitchExporter] = useState('Sino-Global Precision Manufacturing Co., Ltd.');
  const [pitchAdvantage, setPitchAdvantage] = useState('Direct factory pricing, 25-day rapid delivery, 100% pre-shipment testing, free sample in 48 hours');
  const [pitchLanguage, setPitchLanguage] = useState('English');
  const [pitchLoading, setPitchLoading] = useState(false);
  const [pitchResult, setPitchResult] = useState<AIPitchResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Diligence State
  const [diligenceCompany, setDiligenceCompany] = useState(initialBuyerCompany);
  const [diligenceCountry, setDiligenceCountry] = useState(initialCountry);
  const [diligenceIndustry, setDiligenceIndustry] = useState('机械五金与工业设备');
  const [diligenceHs, setDiligenceHs] = useState('8483.40, 8482.10');
  const [diligenceLoading, setDiligenceLoading] = useState(false);
  const [diligenceResult, setDiligenceResult] = useState<BuyerDueDiligence | null>(null);

  // HS Code Classifier State
  const [hsProductDesc, setHsProductDesc] = useState('High precision ball bearing with rubber seals, GCr15 chrome steel');
  const [hsMaterial, setHsMaterial] = useState('GCr15 High Carbon Chrome Steel');
  const [hsTargetMarket, setHsTargetMarket] = useState('United States / European Union');
  const [hsLoading, setHsLoading] = useState(false);
  const [hsResult, setHsResult] = useState<any | null>(null);

  // Copy helper
  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Generate Pitch Call
  const handleRunPitch = async () => {
    setPitchLoading(true);
    setPitchResult(null);
    try {
      const res = await fetch('/api/gemini/generate-pitch-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerCompany: pitchBuyer,
          contactPerson: pitchContact,
          country: pitchCountry,
          productName: pitchProduct,
          specs: pitchSpecs,
          quantity: pitchQty,
          targetPrice: pitchTargetPrice,
          exporterName: pitchExporter,
          factoryAdvantage: pitchAdvantage,
          language: pitchLanguage
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPitchResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPitchLoading(false);
    }
  };

  // Run Due Diligence Call
  const handleRunDiligence = async () => {
    setDiligenceLoading(true);
    setDiligenceResult(null);
    try {
      const res = await fetch('/api/gemini/analyze-buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: diligenceCompany,
          country: diligenceCountry,
          industry: diligenceIndustry,
          hsCodes: [diligenceHs],
          shipmentHistoryDesc: 'Active importer with 18+ container bills of lading recorded in customs system'
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDiligenceResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDiligenceLoading(false);
    }
  };

  // Run HS Code Classifier Call
  const handleRunHsClassifier = async () => {
    setHsLoading(true);
    setHsResult(null);
    try {
      const res = await fetch('/api/gemini/classify-hscode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productDescription: hsProductDesc,
          material: hsMaterial,
          targetMarket: hsTargetMarket
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setHsResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setHsLoading(false);
    }
  };

  // Run ECHO 5F SEO & GEO Strategy Call
  const handleRunSeoGeo = async () => {
    setSeogeoLoading(true);
    setSeogeoResult(null);
    try {
      const res = await fetch('/api/gemini/generate-seogeo-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCategory: seogeoProduct,
          targetCountries: seogeoCountries,
          currentWebsite: seogeoWebsite,
          coreStrength: seogeoStrength,
          competitors: seogeoCompetitors
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSeogeoResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSeogeoLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Workbench Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-slate-700/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <EchoLogo size="md" showSubtitle={true} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  ECHO 5F • AI 数字外贸总监工作台
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wide">
                  FROM SIGNAL TO SYSTEM
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                外贸建站 SEO & GEO 增长引擎 • 多语种开发信报盘 • 360° 买家资信背调 • 智能 HS 编码与出口退税
              </p>
            </div>
          </div>

          {/* Sub-tool Switcher */}
          <div className="flex flex-wrap items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-700 shrink-0 gap-1">
            <button
              onClick={() => setActiveTab('seogeo')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'seogeo' ? 'bg-cyan-500 text-slate-950 font-black shadow-md' : 'text-cyan-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>ECHO 5F 建站 SEO/GEO</span>
            </button>

            <button
              onClick={() => setActiveTab('pitch')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pitch' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>多语种开发信/报盘</span>
            </button>

            <button
              onClick={() => setActiveTab('diligence')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'diligence' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>买家 360° 资信背调</span>
            </button>

            <button
              onClick={() => setActiveTab('hscode')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'hscode' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>HS Code 智能归类</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tool 1: Multilingual Pitch Generator */}
      {activeTab === 'pitch' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>配置发信与报盘参数</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">目标海外买家公司:</label>
                <input
                  type="text"
                  value={pitchBuyer}
                  onChange={(e) => setPitchBuyer(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">目的国/地区:</label>
                  <input
                    type="text"
                    value={pitchCountry}
                    onChange={(e) => setPitchCountry(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">对接联系人职务:</label>
                  <input
                    type="text"
                    value={pitchContact}
                    onChange={(e) => setPitchContact(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">推介商品品名与品类:</label>
                <input
                  type="text"
                  value={pitchProduct}
                  onChange={(e) => setPitchProduct(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">规格与材质认证亮点:</label>
                <input
                  type="text"
                  value={pitchSpecs}
                  onChange={(e) => setPitchSpecs(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">参考报价 (Target Price):</label>
                  <input
                    type="text"
                    value={pitchTargetPrice}
                    onChange={(e) => setPitchTargetPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">目标生成语种 (Language):</label>
                  <select
                    value={pitchLanguage}
                    onChange={(e) => setPitchLanguage(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="English">English 英语 (全球通用)</option>
                    <option value="Spanish">Español 西班牙语 (拉美/西欧)</option>
                    <option value="Russian">Русский 俄语 (俄罗斯/中亚)</option>
                    <option value="German">Deutsch 德语 (德国/中欧)</option>
                    <option value="Arabic">العربية 阿拉伯语 (中东海湾/北非)</option>
                    <option value="French">Français 法语 (法国/西非)</option>
                    <option value="Portuguese">Português 葡萄牙语 (巴西/葡)</option>
                    <option value="Japanese">日本語 日语</option>
                    <option value="Italian">Italiano 意大利语</option>
                    <option value="Vietnamese">Tiếng Việt 越南语</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">我方工厂核心竞争力:</label>
                <textarea
                  rows={2}
                  value={pitchAdvantage}
                  onChange={(e) => setPitchAdvantage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <button
                onClick={handleRunPitch}
                disabled={pitchLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {pitchLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>AI 正在生成 {pitchLanguage} 报盘与开发信...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>一键生成高转化开发信与 WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Result Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>AI 智能生成结果 ({pitchLanguage})</span>
              </span>
              {pitchResult && (
                <span className="text-emerald-600 font-bold text-xs">
                  行业匹配度 98.6%
                </span>
              )}
            </h3>

            {!pitchResult && !pitchLoading && (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <Mail className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs">
                  在左侧配置商品、价格及目标买家后，点击“一键生成”，AI 将自动撰写符合海外买家习惯的高开信率邮件与 WhatsApp 话术
                </p>
              </div>
            )}

            {pitchLoading && (
              <div className="p-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-600 font-bold">
                  Gemini 3.6 正在根据海关外贸习惯与当地商业礼仪起草报盘...
                </p>
              </div>
            )}

            {pitchResult && (
              <div className="space-y-4 text-xs">
                {/* Subject Line */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold">
                    <span>高打开率邮件主题 (Subject Line):</span>
                    <button
                      onClick={() => copyToClipboard(pitchResult.subjectLine, 'subject')}
                      className="text-blue-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      {copiedField === 'subject' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'subject' ? '已复制' : '复制主题'}</span>
                    </button>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{pitchResult.subjectLine}</div>
                </div>

                {/* Email Body */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold">
                    <span>开发信正文 ({pitchLanguage} Email Body):</span>
                    <button
                      onClick={() => copyToClipboard(pitchResult.emailBody, 'email')}
                      className="text-blue-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'email' ? '已复制全文' : '复制正文'}</span>
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap text-slate-800 font-sans leading-relaxed text-xs">
                    {pitchResult.emailBody}
                  </div>
                </div>

                {/* WhatsApp Message */}
                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-emerald-800 uppercase font-bold">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      WhatsApp / WeChat 3句即时触达短消息:
                    </span>
                    <button
                      onClick={() => copyToClipboard(pitchResult.whatsAppMessage, 'whatsapp')}
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-bold"
                    >
                      {copiedField === 'whatsapp' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'whatsapp' ? '已复制' : '复制'}</span>
                    </button>
                  </div>
                  <p className="text-slate-800 font-medium">{pitchResult.whatsAppMessage}</p>
                </div>

                {/* Selling Points & Objection Handling */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 space-y-1">
                    <span className="text-[10px] font-bold text-blue-900 uppercase block">核心破冰卖点:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                      {pitchResult.keySellingPoints?.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 space-y-1">
                    <span className="text-[10px] font-bold text-amber-900 uppercase block">客户异议化解策略:</span>
                    <p className="text-slate-700 text-[11px] leading-snug">{pitchResult.objectionHandlingTip}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tool 2: Buyer 360° Due Diligence */}
      {activeTab === 'diligence' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>输入海外买家信息进行背调</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">企业英文名称:</label>
                <input
                  type="text"
                  value={diligenceCompany}
                  onChange={(e) => setDiligenceCompany(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">所属国家/地区:</label>
                <input
                  type="text"
                  value={diligenceCountry}
                  onChange={(e) => setDiligenceCountry(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">主营行业品类:</label>
                <input
                  type="text"
                  value={diligenceIndustry}
                  onChange={(e) => setDiligenceIndustry(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">关注 HS 编码:</label>
                <input
                  type="text"
                  value={diligenceHs}
                  onChange={(e) => setDiligenceHs(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <button
                onClick={handleRunDiligence}
                disabled={diligenceLoading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {diligenceLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>AI 穿透背调中...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 fill-slate-950" />
                    <span>开始 360° 买家资信透视</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Result Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex justify-between items-center">
              <span>买家全景资信与风险穿透报告</span>
              {diligenceResult && (
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full">
                  信用评分: {diligenceResult.creditScore} / 100
                </span>
              )}
            </h3>

            {!diligenceResult && !diligenceLoading && (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Building2 className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs">
                  输入买家公司名称与海关背景后，AI 将自动分析其进口采购趋势、供应链替代空间、付款风控及决策人沟通习惯
                </p>
              </div>
            )}

            {diligenceLoading && (
              <div className="p-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-600 font-bold">
                  正在调取海关进出口记录并进行商业反欺诈与财务风险透视...
                </p>
              </div>
            )}

            {diligenceResult && (
              <div className="space-y-4 text-xs">
                {/* 3 Metric Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">财务履约风险:</span>
                    <strong className={`text-sm font-extrabold ${
                      diligenceResult.financialRiskLevel === 'Low' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {diligenceResult.financialRiskLevel} Risk (低风险)
                    </strong>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">预估年采购预算:</span>
                    <strong className="text-sm font-extrabold text-blue-700">
                      {diligenceResult.estimatedAnnualPurchasingBudget}
                    </strong>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">价格敏感度偏好:</span>
                    <strong className="text-xs font-bold text-slate-800">
                      {diligenceResult.priceSensitivity}
                    </strong>
                  </div>
                </div>

                {/* Import Trend & Supply Origins */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">海关进口趋势:</span>
                    <p className="text-slate-800 font-bold">{diligenceResult.customsImportTrend}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">原主力供货国分布:</span>
                    <div className="flex flex-wrap gap-1">
                      {diligenceResult.mainSupplyingCountries?.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 font-medium rounded text-[11px]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Safe Payment Terms Recommendation */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>推荐安全收汇付款条款:</span>
                  </div>
                  <p className="text-emerald-800 font-semibold">{diligenceResult.recommendedPaymentTerms}</p>
                </div>

                {/* Strategic Advice */}
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>撬动该买家及替代原供应商策略:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                    {diligenceResult.strategicPitchAdvice?.map((adv, i) => (
                      <li key={i}>{adv}</li>
                    ))}
                  </ul>
                </div>

                {/* Risk Notice */}
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>外贸避坑与合规风控提醒:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-rose-800 text-[11px]">
                    {diligenceResult.fraudWarningOrRiskPoints?.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tool 3: Smart HS Code Classifier */}
      {activeTab === 'hscode' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>输入商品信息智能归类 HS 编码</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">商品英文/中文描述 (Product Description):</label>
                <textarea
                  rows={3}
                  value={hsProductDesc}
                  onChange={(e) => setHsProductDesc(e.target.value)}
                  placeholder="例如：580W TOPCon 双面双玻太阳能光伏组件，带铝合金黑框..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">主要材质与结构:</label>
                <input
                  type="text"
                  value={hsMaterial}
                  onChange={(e) => setHsMaterial(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">主要目标出口市场:</label>
                <input
                  type="text"
                  value={hsTargetMarket}
                  onChange={(e) => setHsTargetMarket(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                onClick={handleRunHsClassifier}
                disabled={hsLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {hsLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>海关税则智能检索中...</span>
                  </>
                ) : (
                  <>
                    <Tag className="w-4 h-4" />
                    <span>智能测算 HS 编码与出口退税率</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Result Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
              HS 编码税则归类与报关要素测算
            </h3>

            {!hsResult && !hsLoading && (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Tag className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs">
                  输入任意商品品名与材质，AI 将基于世界海关组织 (WCO) 税则标准与中国海关申报要素进行精准归类
                </p>
              </div>
            )}

            {hsLoading && (
              <div className="p-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-600 font-bold">
                  正在检索最新 2026 海关税则表与退税率政策库...
                </p>
              </div>
            )}

            {hsResult && (
              <div className="space-y-4 text-xs">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-blue-700 font-bold uppercase block">推荐主归类 HS 编码:</span>
                    <span className="text-xl font-mono font-black text-blue-950">{hsResult.primaryHsCode}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-blue-700 font-bold uppercase block">出口退税率:</span>
                    <span className="text-lg font-black text-emerald-600">{hsResult.exportRebateRate}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">官方税目描述:</span>
                  <p className="text-slate-800 font-medium">{hsResult.hsCodeDescription}</p>
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                  <span className="text-[10px] text-amber-900 font-bold uppercase block">报关申报要素必备清单:</span>
                  <p className="text-slate-800 font-medium text-[11px] leading-relaxed">{hsResult.declarationNotice}</p>
                </div>

                {hsResult.alternativeHsCodes && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">备选关联 HS 编码:</span>
                    <div className="flex gap-2">
                      {hsResult.alternativeHsCodes.map((code: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-800">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tool 4: ECHO 5F SEO & GEO Foreign Trade Digital Growth Studio */}
      {activeTab === 'seogeo' && (
        <div className="space-y-6">
          
          {/* Signal to System Architecture Banner */}
          <div className="bg-black text-white rounded-3xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
              <EchoLogo size="lg" showSubtitle={true} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>ECHO 5F METHODOLOGY • FROM SIGNAL TO SYSTEM</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  外贸建站 SEO & GEO 全球数字增长引擎
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
                  以海外买家「搜索与提单行为信号 (Signals)」为输入，打通 Google B2B SEO 独立站与新一代 AI 搜索引擎 (GEO: ChatGPT/Perplexity/Gemini 实体与引用推荐)，直连 CRM 询盘漏斗与 ERP 订单履约系统。
                </p>
              </div>

              {/* 3-Step Signal to System Workflow */}
              <div className="grid grid-cols-3 gap-2 bg-neutral-900/90 p-3 rounded-2xl border border-neutral-800 text-center shrink-0">
                <div className="p-2 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold block">1. SIGNAL</span>
                  <p className="text-[11px] font-bold text-white">全球搜索与海关信号</p>
                </div>
                <div className="p-2 space-y-1 border-x border-neutral-800">
                  <span className="text-[10px] font-mono text-amber-400 font-bold block">2. SEO & GEO</span>
                  <p className="text-[11px] font-bold text-white">建站优化与实体权威</p>
                </div>
                <div className="p-2 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block">3. SYSTEM</span>
                  <p className="text-[11px] font-bold text-white">CRM客户与ERP转化</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Configuration Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Compass className="w-4 h-4 text-cyan-600" />
                <span>配置外贸独立站与产品出海参数</span>
              </h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    出口主打产品 / 细分工业品类 <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={seogeoProduct}
                    onChange={(e) => setSeogeoProduct(e.target.value)}
                    placeholder="例如: Precision Planetary Gearboxes & Speed Reducers"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    目标出口国 / 重点市场区域:
                  </label>
                  <input
                    type="text"
                    value={seogeoCountries}
                    onChange={(e) => setSeogeoCountries(e.target.value)}
                    placeholder="例如: USA, Germany, Netherlands, UAE, Vietnam"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    外贸独立站域名 / 品牌网址 (Website URL):
                  </label>
                  <input
                    type="text"
                    value={seogeoWebsite}
                    onChange={(e) => setSeogeoWebsite(e.target.value)}
                    placeholder="https://www.your-export-brand.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    工厂核心护城河与差异化卖点:
                  </label>
                  <textarea
                    rows={3}
                    value={seogeoStrength}
                    onChange={(e) => setSeogeoStrength(e.target.value)}
                    placeholder="源头实体工厂、ISO/CE认证、支持OEM打标定制、48小时出样、100%全检出厂..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    主要竞争对手 / 对标标杆品牌:
                  </label>
                  <input
                    type="text"
                    value={seogeoCompetitors}
                    onChange={(e) => setSeogeoCompetitors(e.target.value)}
                    placeholder="例如: Wittenstein, Bonfiglioli, SEW Eurodrive, 台湾某品牌"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRunSeoGeo}
                  disabled={seogeoLoading || !seogeoProduct}
                  className="w-full py-3 bg-gradient-to-r from-slate-900 via-neutral-900 to-blue-950 hover:from-black hover:to-blue-900 text-white rounded-xl font-black text-xs shadow-lg shadow-slate-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {seogeoLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span>ECHO 5F 增长矩阵规划中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>生成 SEO & GEO 全球数字增长方案 (AI 赋能)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Output View */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
              
              {!seogeoResult && !seogeoLoading && (
                <div className="p-10 text-center text-slate-400 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
                    <Compass className="w-8 h-8 text-cyan-600" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1.5">
                    <h4 className="font-extrabold text-slate-800 text-sm">
                      准备生成您的专属 SEO & GEO 外贸出海蓝图
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      ECHO 5F 算法将同时分析 Google 商业搜索词库与主流大模型生成式搜索引擎 (ChatGPT/Perplexity/Gemini) 的品牌推荐权重。
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono text-cyan-700 bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-200">
                    <span>ECHO 5F TRADING DIGITAL GROWTH • FROM SIGNAL TO SYSTEM</span>
                  </div>
                </div>
              )}

              {seogeoLoading && (
                <div className="p-16 text-center space-y-4">
                  <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm text-slate-800 font-black">
                      正在分析全球买家搜索意图与 AI 推荐实体知识图谱...
                    </p>
                    <p className="text-xs text-slate-500">
                      计算 Google TDK 架构 • 注入 Schema.org 结构化数据 • 构建 B2B 信号转化闭环
                    </p>
                  </div>
                </div>
              )}

              {seogeoResult && (
                <div className="space-y-5 text-xs animate-fadeIn">
                  
                  {/* Brand Tagline */}
                  <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider block">
                        GLOBAL BRAND SIGNAL TAGLINE
                      </span>
                      <p className="text-base font-black tracking-wide mt-0.5 text-white">
                        “{seogeoResult.brandSignalTagline}”
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(seogeoResult.brandSignalTagline, 'tagline')}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-bold text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'tagline' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'tagline' ? '已复制' : '复制'}</span>
                    </button>
                  </div>

                  {/* Section 1: Google B2B SEO Architecture */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-blue-600" />
                      <span>1. Google B2B SEO 独立站关键词与 TDK 架构</span>
                    </h4>

                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Recommended Page Title Tag:</span>
                        <p className="font-bold text-slate-800 bg-white p-2 rounded-xl border border-slate-200 font-mono text-[11px]">
                          {seogeoResult.googleSeoArchitecture?.pageTitleTag}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Meta Description (High CTR):</span>
                        <p className="text-slate-700 bg-white p-2 rounded-xl border border-slate-200 text-[11px] leading-relaxed">
                          {seogeoResult.googleSeoArchitecture?.metaDescription}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">High-Intent B2B Commercial Keywords (高询盘转化词):</span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {seogeoResult.googleSeoArchitecture?.highIntentKeywords?.map((kw: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg font-medium text-[11px]">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Site Silo / Pillar Structure (核心栏目架构):</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {seogeoResult.googleSeoArchitecture?.contentSiloStructure?.map((silo: string, i: number) => (
                            <div key={i} className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-1.5 font-bold text-slate-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                              <span>{silo}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: GEO (Generative Engine Optimization) */}
                  <div className="p-4 bg-cyan-950/10 rounded-2xl border border-cyan-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-cyan-950 flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-cyan-600" />
                        <span>2. GEO (AI 生成式搜索引擎推荐优化 - Perplexity / ChatGPT / Gemini)</span>
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-600 text-white font-mono text-[9px] font-bold">
                        AI ENGINE READY
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <span className="text-[10px] text-cyan-800 font-bold block uppercase">AI 实体与品牌权威图谱构建 (Entity Strategy):</span>
                        <p className="text-slate-800 bg-white p-2.5 rounded-xl border border-cyan-200/60 text-[11px] leading-relaxed">
                          {seogeoResult.geoAiSearchOptimization?.entityBuildingStrategy}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-cyan-800 font-bold uppercase">Schema.org 结构化微数据 (JSON-LD):</span>
                          <button
                            onClick={() => copyToClipboard(seogeoResult.geoAiSearchOptimization?.schemaOrgMarkupSample, 'schema')}
                            className="text-[10px] font-bold text-cyan-700 hover:text-cyan-900 flex items-center gap-1 cursor-pointer"
                          >
                            <Code2 className="w-3 h-3" />
                            <span>{copiedField === 'schema' ? '已复制 JSON-LD' : '复制 JSON-LD 代码'}</span>
                          </button>
                        </div>
                        <pre className="p-3 bg-slate-950 text-cyan-300 rounded-xl font-mono text-[10px] overflow-x-auto max-h-36 border border-slate-800">
                          {seogeoResult.geoAiSearchOptimization?.schemaOrgMarkupSample}
                        </pre>
                      </div>

                      <div>
                        <span className="text-[10px] text-cyan-800 font-bold block uppercase">权威外链与技术白皮书矩阵 (B2B AI Citations):</span>
                        <div className="space-y-1.5 pt-1">
                          {seogeoResult.geoAiSearchOptimization?.citationsAndPrStrategy?.map((pr: string, i: number) => (
                            <div key={i} className="p-2 bg-white rounded-lg border border-cyan-200/60 flex items-start gap-2 text-slate-800 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                              <span>{pr}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: From Signal to System (Funnel + Milestones) */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-extrabold text-xs text-amber-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      <span>3. ECHO 5F 闭环转化与 180 天增长里程碑 (From Signal to System)</span>
                    </h4>

                    <div className="space-y-2 text-[11px]">
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">转化流转链路:</span>
                        {seogeoResult.conversionFunnelPlan?.map((step: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-slate-800/80 rounded-xl border border-slate-700 text-slate-200">
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">
                              {i + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700 text-center">
                          <span className="text-[10px] font-mono text-slate-400 font-bold block">30 天启动期</span>
                          <p className="text-[11px] font-bold text-amber-300 mt-0.5">{seogeoResult.expectedRoiMilestones?.day30}</p>
                        </div>
                        <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700 text-center">
                          <span className="text-[10px] font-mono text-slate-400 font-bold block">90 天突破期</span>
                          <p className="text-[11px] font-bold text-cyan-300 mt-0.5">{seogeoResult.expectedRoiMilestones?.day90}</p>
                        </div>
                        <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700 text-center">
                          <span className="text-[10px] font-mono text-slate-400 font-bold block">180 天规模化</span>
                          <p className="text-[11px] font-bold text-emerald-300 mt-0.5">{seogeoResult.expectedRoiMilestones?.day180}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
