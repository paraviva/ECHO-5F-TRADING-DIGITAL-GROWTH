import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Flame, 
  HeartHandshake, 
  BrainCircuit, 
  Compass, 
  Target,
  Copy,
  Check,
  Ban,
  TreeDeciduous,
  Waves,
  ShieldAlert
} from 'lucide-react';
import { RATIONAL_MINDSET_QUOTES, STOP_LOSS_RED_FLAGS, calculateDealWinProbability } from '../data/auditAndMindsetData';
import { DealProbabilityFactors, RationalMindsetQuote } from '../types';
import { EchoLogo } from './EchoLogo';

export const DealProbabilityMindsetModule: React.FC = () => {
  // Mindset Filter State
  const [selectedContext, setSelectedContext] = useState<string>('all');
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  // Stop-Loss & Disqualification State
  const [checkedRedFlags, setCheckedRedFlags] = useState<string[]>([]);

  // Probability Calculator State
  const [factors, setFactors] = useState<DealProbabilityFactors>({
    customsDemandScore: 78,
    factoryAuditMatchScore: 82,
    commercialTermsScore: 70,
    interactionVelocityScore: 85,
    macroVariableAdjustment: 0
  });

  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);

  // Filtered quotes
  const filteredQuotes = useMemo(() => {
    if (selectedContext === 'all') return RATIONAL_MINDSET_QUOTES;
    return RATIONAL_MINDSET_QUOTES.filter(q => q.applicationContext === selectedContext);
  }, [selectedContext]);

  // Calculate Result
  const calcResult = useMemo(() => {
    return calculateDealWinProbability(factors);
  }, [factors]);

  const handleCopyQuote = (quote: RationalMindsetQuote) => {
    navigator.clipboard.writeText(`“${quote.quote}” —— ${quote.authorOrSchool}`);
    setCopiedQuoteId(quote.id);
    setTimeout(() => setCopiedQuoteId(null), 2000);
  };

  const handleResetFactors = () => {
    setFactors({
      customsDemandScore: 75,
      factoryAuditMatchScore: 80,
      commercialTermsScore: 70,
      interactionVelocityScore: 80,
      macroVariableAdjustment: 0
    });
  };

  const toggleRedFlag = (id: string) => {
    setCheckedRedFlags(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner: Rational Mindset & System Theory */}
      <div className="bg-black text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-4">
          <EchoLogo size="lg" showSubtitle={true} />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              ECHO 5F COGNITIVE MATRIX
            </span>
            <span className="text-xs text-neutral-400 font-mono">从 0 到 1 破局 • 系统论战胜盲目焦虑 • 道法自然</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <BrainCircuit className="w-7 h-7 text-cyan-400" />
            <span>外贸增长理智型心法 & 赢单确定性概率公式</span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            外贸从来不是靠运气的博弈，而是符合大数定律的工程系统。既要追求「海关需求 + 验厂资质 + 商务条款 + 响应时效」的数学收敛，也要懂得「放弃的勇气」与「道法自然」——莫为一棵不可为的歪脖树，耗尽了整片全球海关森林。
          </p>

          {/* Context Selector */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-neutral-400 mr-1">选择当前心境与瓶颈:</span>
            {[
              { key: 'all', label: '全部心法 (10则)' },
              { key: '放弃的勇气与及时止损', label: '🍂 放弃的勇气与及时止损' },
              { key: '道法自然与顺其自然', label: '🌊 道法自然与顺其自然' },
              { key: '0-1搭建期迷茫', label: '🌱 0-1搭建期迷茫' },
              { key: '频繁被拒/无回复', label: '📩 频繁被拒/无回复' },
              { key: '团队士气低迷', label: '⚡ 团队士气低迷' },
              { key: '大单谈判焦虑', label: '🤝 大单谈判焦虑' },
              { key: '交付与客诉危机', label: '🛡️ 交付与客诉危机' }
            ].map(ctx => (
              <button
                key={ctx.key}
                onClick={() => {
                  setSelectedContext(ctx.key);
                  setActiveQuoteIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedContext === ctx.key
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md scale-102'
                    : 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800'
                }`}
              >
                {ctx.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mindset Quotes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredQuotes.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-cyan-300 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                  q.applicationContext === '放弃的勇气与及时止损' 
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : q.applicationContext === '道法自然与顺其自然'
                    ? 'bg-teal-50 text-teal-700 border-teal-200'
                    : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                }`}>
                  {q.applicationContext}
                </span>
                <button
                  onClick={() => handleCopyQuote(q)}
                  className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="复制名言"
                >
                  {copiedQuoteId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px]">{copiedQuoteId === q.id ? '已复制' : '复制'}</span>
                </button>
              </div>

              <blockquote className="text-xs text-slate-800 font-medium leading-relaxed italic border-l-2 border-cyan-500 pl-3">
                “{q.quote}”
              </blockquote>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 space-y-1">
              <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>底层原则：{q.corePrinciple}</span>
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                —— {q.authorOrSchool}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Disqualification & Stop-Loss Diagnostic Matrix */}
      <div className="bg-gradient-to-br from-slate-900 via-neutral-900 to-rose-950 rounded-3xl p-6 sm:p-8 text-white border border-rose-900/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Ban className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-rose-200">
                外贸果断放弃与及时止损自检表 (Disqualification & Stop-Loss Matrix)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              很多外贸人陷入沉没成本陷阱，执念于单个无解客户。若客户命中以下任意 2 条红线，请鼓起勇气立即归档，把精力还给全球海关森林：
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-slate-400">
              已触发红线: <strong className={`text-sm font-bold ${checkedRedFlags.length >= 2 ? 'text-rose-400' : 'text-slate-200'}`}>{checkedRedFlags.length} / 5</strong>
            </span>
            {checkedRedFlags.length > 0 && (
              <button
                onClick={() => setCheckedRedFlags([])}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
              >
                重置红线
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {STOP_LOSS_RED_FLAGS.map((flag) => {
            const isChecked = checkedRedFlags.includes(flag.id);
            return (
              <div
                key={flag.id}
                onClick={() => toggleRedFlag(flag.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isChecked
                    ? 'bg-rose-950/70 border-rose-500 shadow-md ring-1 ring-rose-500'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black font-mono text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/60">
                      {flag.category}
                    </span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-700"
                    />
                  </div>

                  <p className="text-xs font-bold text-slate-200 leading-snug">
                    {flag.triggerCondition}
                  </p>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    💀 <strong className="text-rose-300">致命风险:</strong> {flag.fatalRiskReason}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">建议动作:</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    flag.recommendAction.includes('彻底归档')
                      ? 'bg-rose-900/60 text-rose-300 border border-rose-700/50'
                      : 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                  }`}>
                    {flag.recommendAction}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Diagnosis Outcome */}
        {checkedRedFlags.length >= 2 ? (
          <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-extrabold text-white">
                  🚨 诊断结论：触发多项致命红线，建议立即行使「放弃的勇气」！
                </h4>
                <p className="text-xs text-rose-200 mt-0.5">
                  该客户的成单期望值极低，继续投入只会造成严重的精力和资金内耗。请果断将其在 CRM 中标记为「已归档/放弃」，立即将精力转回海关数据智搜，开发真正匹配的高价值买家！
                </p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-black shrink-0">
              🛑 坚决止损，拥抱森林
            </span>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TreeDeciduous className="w-4 h-4 text-emerald-400" />
              <span>道法自然：全球有数以万计的海关活跃进口商，保持从容心态，顺势而为。</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">ECHO 5F RATIONAL MINDSET</span>
          </div>
        )}
      </div>

      {/* Part 2: ECHO 5F Mathematical Deal Win-Rate Engine */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-6 h-6 text-cyan-600" />
              <h3 className="font-extrabold text-lg text-slate-900">
                ECHO 5F 外贸赢单确定性概率测算引擎 (B2B Deal Probability Simulator)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              基于加权收敛公式 P(Win) = W₁·海关真实需求 + W₂·验厂资质 + W₃·商务条款 + W₄·响应速度 + ε宏观微调
            </p>
          </div>

          <button
            onClick={handleResetFactors}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors self-start md:self-auto shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置为行业基准值</span>
          </button>
        </div>

        {/* Core Formula Display Bar */}
        <div className="bg-slate-950 text-cyan-300 p-4 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto flex items-center justify-between">
          <span className="font-bold">
            P(Win) = (30% × W₁海关意图) + (30% × W₂验厂资质) + (25% × W₃商务价格) + (15% × W₄响应时效) + ε宏观扰动
          </span>
          <span className="text-[10px] text-slate-400 ml-4 shrink-0">
            ECHO 5F ALGORITHM v4.2
          </span>
        </div>

        {/* Sliders and Result Output Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: 4 Dimension Sliders */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* W1: Customs Demand */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>W₁: 买家提单需求与 HS 编码真实性匹配 (权重 30%)</span>
                </span>
                <span className="font-mono font-black text-blue-600 text-sm">{factors.customsDemandScore} 分</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={factors.customsDemandScore}
                onChange={(e) => setFactors({ ...factors, customsDemandScore: Number(e.target.value) })}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[11px] text-slate-500">
                评估标准：目标买家在海关有近 6 个月稳定进口记录、常购规格与我方 100% 契合。
              </p>
            </div>

            {/* W2: Factory Audit & Compliance */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>W₂: 工厂资质、验厂标准与国际检测契合度 (权重 30%)</span>
                </span>
                <span className="font-mono font-black text-emerald-600 text-sm">{factors.factoryAuditMatchScore} 分</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={factors.factoryAuditMatchScore}
                onChange={(e) => setFactors({ ...factors, factoryAuditMatchScore: Number(e.target.value) })}
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <p className="text-[11px] text-slate-500">
                评估标准：持有 BSCI/ISO9001/IATF/CE/FDA 等目标买家准入报告，现场生产体系无重大缺陷。
              </p>
            </div>

            {/* W3: Commercial Terms & Price */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <span>W₃: 报价竞争力、交期弹性与付款条件 (权重 25%)</span>
                </span>
                <span className="font-mono font-black text-amber-600 text-sm">{factors.commercialTermsScore} 分</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={factors.commercialTermsScore}
                onChange={(e) => setFactors({ ...factors, commercialTermsScore: Number(e.target.value) })}
                className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <p className="text-[11px] text-slate-500">
                评估标准：FOB/CIF 单价落在买家心理区间、定金比例适中、交期在 25 天以内。
              </p>
            </div>

            {/* W4: Interaction Velocity */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>W₄: 交互响应速度、双语专业度与样品打样 (权重 15%)</span>
                </span>
                <span className="font-mono font-black text-purple-600 text-sm">{factors.interactionVelocityScore} 分</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={factors.interactionVelocityScore}
                onChange={(e) => setFactors({ ...factors, interactionVelocityScore: Number(e.target.value) })}
                className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <p className="text-[11px] text-slate-500">
                评估标准：询盘 2 小时内专业多语种回复、WhatsApp 快速沟通、48 小时寄出金样。
              </p>
            </div>

            {/* Macro Adjustment */}
            <div className="p-3 bg-neutral-900 text-white rounded-2xl border border-neutral-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ε 宏观环境变量调节 (地缘政策/海运费/汇率利好或利空):</span>
                </span>
                <span className="font-mono font-bold text-cyan-400">
                  {factors.macroVariableAdjustment > 0 ? `+${factors.macroVariableAdjustment}` : factors.macroVariableAdjustment}%
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                value={factors.macroVariableAdjustment}
                onChange={(e) => setFactors({ ...factors, macroVariableAdjustment: Number(e.target.value) })}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

          </div>

          {/* Right: Realtime Prediction & Breakdown */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  PREDICTED DEAL PROBABILITY
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                  calcResult.grade.includes('S') ? 'bg-emerald-400 text-slate-950' :
                  calcResult.grade.includes('A') ? 'bg-cyan-400 text-slate-950' :
                  calcResult.grade.includes('B') ? 'bg-amber-400 text-slate-950' :
                  'bg-red-400 text-slate-950'
                }`}>
                  {calcResult.grade}
                </span>
              </div>

              {/* Main Probability Display */}
              <div className="text-center py-4 space-y-1">
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                  {calcResult.probabilityPercent}%
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  综合成单与赢单置信度
                </p>
              </div>

              {/* Formula Contribution Breakdown */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">各维度贡献明细:</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">W₁ 海关意图 (30%):</span>
                    <span className="font-bold text-blue-400 font-mono text-sm">+{calcResult.formulaBreakdown.w1_customs.contribution}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">W₂ 验厂资质 (30%):</span>
                    <span className="font-bold text-emerald-400 font-mono text-sm">+{calcResult.formulaBreakdown.w2_audit.contribution}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">W₃ 商务价格 (25%):</span>
                    <span className="font-bold text-amber-400 font-mono text-sm">+{calcResult.formulaBreakdown.w3_commercial.contribution}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">W₄ 响应时效 (15%):</span>
                    <span className="font-bold text-purple-400 font-mono text-sm">+{calcResult.formulaBreakdown.w4_velocity.contribution}%</span>
                  </div>
                </div>
              </div>

              {/* Bottlenecks */}
              {calcResult.keyBottlenecks.length > 0 && (
                <div className="p-3 bg-red-950/40 rounded-xl border border-red-500/30 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>主要失单风险 / 关键短板:</span>
                  </div>
                  <ul className="list-disc list-inside text-red-200 text-[11px] space-y-0.5">
                    {calcResult.keyBottlenecks.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actionable Steps */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  提升赢单胜率行动清单 (Action Plan):
                </span>
                <div className="space-y-1.5">
                  {calcResult.actionableStepsToIncreaseWinRate.map((step, idx) => (
                    <div key={idx} className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-2 text-slate-200 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center font-mono">
              ECHO 5F • FROM SIGNAL TO SYSTEM • B2B PROBABILITY CONVERGENCE
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
