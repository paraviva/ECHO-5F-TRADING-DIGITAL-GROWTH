import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Filter, 
  Layers, 
  Building2, 
  FileText, 
  Award, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  Info,
  Sliders,
  DollarSign,
  Clock,
  Compass,
  Check
} from 'lucide-react';
import { GLOBAL_FACTORY_AUDIT_STANDARDS } from '../data/auditAndMindsetData';
import { FactoryAuditStandard, IndustryCategory, AuditCategory } from '../types';
import { INDUSTRY_CATEGORIES } from '../data/tradeData';
import { EchoLogo } from './EchoLogo';

export const FactoryAuditMatrixModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedStandard, setSelectedStandard] = useState<FactoryAuditStandard | null>(GLOBAL_FACTORY_AUDIT_STANDARDS[0]);

  // Evaluator State (工厂-买家匹配测评器)
  const [evalIndustry, setEvalIndustry] = useState<IndustryCategory>('机械五金与工业设备');
  const [evalTargetRegion, setEvalTargetRegion] = useState('欧洲 (EU)');
  const [evalBuyerType, setEvalBuyerType] = useState('Distributor (批发商/分销商)');
  const [ownedCertCodes, setOwnedCertCodes] = useState<string[]>(['ISO 9001:2015', 'CE 认证 (EU Conformity)']);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    mandatoryMissing: FactoryAuditStandard[];
    recommendedMissing: FactoryAuditStandard[];
    passed: FactoryAuditStandard[];
    status: 'Ready to Quote (完全匹配)' | 'Minor Gaps (整改可投)' | 'High Risk (资质受阻)';
  } | null>(null);

  // Filter standards
  const filteredStandards = GLOBAL_FACTORY_AUDIT_STANDARDS.filter(std => {
    const matchesSearch = std.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          std.coreAuditCheckpoints.some(cp => cp.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || std.category === selectedCategory;
    const matchesInd = selectedIndustry === 'all' || std.applicableIndustries.includes(selectedIndustry as any);
    return matchesSearch && matchesCat && matchesInd;
  });

  const toggleOwnedCert = (code: string) => {
    setOwnedCertCodes(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleRunEvaluation = () => {
    // Determine required standards for target industry & region
    const relevantStandards = GLOBAL_FACTORY_AUDIT_STANDARDS.filter(std => 
      std.applicableIndustries.includes(evalIndustry) || std.applicableIndustries.includes('通用外贸品类')
    );

    const mandatory = relevantStandards.filter(s => s.importanceLevel === 'Mandatory (准入红线)');
    const recommended = relevantStandards.filter(s => s.importanceLevel !== 'Mandatory (准入红线)');

    const passed = relevantStandards.filter(s => ownedCertCodes.includes(s.code));
    const mandatoryMissing = mandatory.filter(s => !ownedCertCodes.includes(s.code));
    const recommendedMissing = recommended.filter(s => !ownedCertCodes.includes(s.code));

    // Calculate score
    let score = 100;
    score -= mandatoryMissing.length * 35;
    score -= recommendedMissing.length * 10;
    score = Math.max(15, Math.min(100, score));

    let status: 'Ready to Quote (完全匹配)' | 'Minor Gaps (整改可投)' | 'High Risk (资质受阻)' = 'Ready to Quote (完全匹配)';
    if (mandatoryMissing.length > 0) {
      status = 'High Risk (资质受阻)';
    } else if (score < 80) {
      status = 'Minor Gaps (整改可投)';
    }

    setEvaluationResult({
      score,
      mandatoryMissing,
      recommendedMissing,
      passed,
      status
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wide">
                GLOBAL COMPLIANCE & AUDIT MATRIX
              </span>
              <span className="text-xs text-slate-400 font-mono">2026 全行业出海准入标准</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              <span>全球外贸验厂与国际检测标准库 & 工厂匹配度测评</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              解决外贸公司与工厂「资质是否匹配海外买家」的核心痛点。收录 BSCI、SEDEX、ISO9001、IATF16949、CE、UL、FDA、CBAM 碳足迹等全行业验厂标准，支持一键自测资质缺口与过审周期。
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700 p-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">已收录标准</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{GLOBAL_FACTORY_AUDIT_STANDARDS.length} 套</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700 p-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">覆盖行业</span>
              <span className="text-xl font-black text-cyan-400 font-mono">11 大品类</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part 1: 工厂-海外买家资质智能匹配测评器 (Factory-Buyer Fit Evaluator) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>工厂-海外买家资质匹配度自测 (Factory-Buyer Fit Evaluator)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              输入工厂现有资质证书，结合目标客户所在国家与行业，快速评估能否顺利过审接单
            </p>
          </div>
          <button
            onClick={handleRunEvaluation}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-lg shadow-indigo-600/20 text-xs flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>开始一键资质匹配测评</span>
          </button>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">1. 目标客户所属品类:</label>
            <select
              value={evalIndustry}
              onChange={(e) => setEvalIndustry(e.target.value as IndustryCategory)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
            >
              {INDUSTRY_CATEGORIES.map(ind => (
                <option key={ind.name} value={ind.name}>{ind.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">2. 目的国 / 目标关区:</label>
            <select
              value={evalTargetRegion}
              onChange={(e) => setEvalTargetRegion(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
            >
              <option value="欧洲 (EU)">欧洲 27 国 (EU / EEA) - 重视 CE/BSCI/CBAM</option>
              <option value="北美 (US/CA)">北美 (美国/加拿大) - 重视 UL/FDA/C-TPAT/Walmart</option>
              <option value="中东与海湾">中东海湾 (GCC) - 重视 SASO/G-Mark/ISO</option>
              <option value="亚太地区">亚太与东南亚 - 重视 ISO/PSE/KC</option>
              <option value="全球主要买家">跨国采购巨头体系 - 全套社会责任验厂</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">3. 买家类型:</label>
            <select
              value={evalBuyerType}
              onChange={(e) => setEvalBuyerType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
            >
              <option value="Distributor (批发商/分销商)">Distributor (批发商/分销商)</option>
              <option value="OEM Manufacturer (品牌制造商)">OEM Manufacturer (品牌制造商 - 严查制造体系)</option>
              <option value="Retail Chain / Supermarket (商超连锁)">Retail Chain (大型商超 - 严查社会责任人权)</option>
              <option value="Importer / Wholesaler (进口总代)">Importer / Wholesaler (进口总代)</option>
            </select>
          </div>
        </div>

        {/* Select Owned Certifications */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800">
              4. 勾选工厂目前已持有或通过的认证 / 验厂报告:
            </label>
            <span className="text-[11px] text-slate-500">已勾选 {ownedCertCodes.length} 项</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {GLOBAL_FACTORY_AUDIT_STANDARDS.map(std => {
              const isChecked = ownedCertCodes.includes(std.code);
              return (
                <button
                  key={std.code}
                  type="button"
                  onClick={() => toggleOwnedCert(std.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isChecked
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                    isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                  }`}>
                    {isChecked ? '✓' : ''}
                  </span>
                  <span>{std.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Evaluation Output Result */}
        {evaluationResult && (
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black font-mono ${
                  evaluationResult.score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  evaluationResult.score >= 60 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {evaluationResult.score}分
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white">工厂-买家资质匹配评定:</span>
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold ${
                      evaluationResult.status.includes('完全匹配') ? 'bg-emerald-500 text-slate-950' :
                      evaluationResult.status.includes('整改可投') ? 'bg-amber-500 text-slate-950' :
                      'bg-red-500 text-white'
                    }`}>
                      {evaluationResult.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    针对 {evalIndustry} 品类出口至 {evalTargetRegion} 的准入评估
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Mandatory Missing */}
              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-red-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-red-400 font-bold">
                  <XCircle className="w-4 h-4" />
                  <span>缺失的强制性准入红线 ({evaluationResult.mandatoryMissing.length} 项)</span>
                </div>
                {evaluationResult.mandatoryMissing.length === 0 ? (
                  <p className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 恭喜！当前品类核心强制准入资质已全部具备
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {evaluationResult.mandatoryMissing.map(m => (
                      <div key={m.code} className="p-2 bg-slate-900/90 rounded-lg border border-red-500/20">
                        <div className="flex items-center justify-between font-bold text-slate-200">
                          <span>{m.code} - {m.name}</span>
                          <span className="text-amber-400 font-mono text-[10px]">{m.typicalCostRangeUsd}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">过审周期: 约 {m.auditCycleMonths} 个月 | 机构: {m.authorityOrOrg}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended / Competitive Advantages */}
              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Award className="w-4 h-4" />
                  <span>已具备资质与建议补充加分项</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">已通过认证 ({evaluationResult.passed.length} 项):</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {evaluationResult.passed.map(p => (
                        <span key={p.code} className="px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-bold">
                          ✓ {p.code}
                        </span>
                      ))}
                    </div>
                  </div>

                  {evaluationResult.recommendedMissing.length > 0 && (
                    <div className="pt-2 border-t border-slate-700">
                      <span className="text-slate-400 block text-[10px]">建议择机升级的加分证书:</span>
                      <p className="text-slate-300 text-[10px] mt-0.5">
                        {evaluationResult.recommendedMissing.map(r => r.code).join('、')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Part 2: 全行业外贸验厂与检测标准全景百科 (Standards Directory) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
        
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>全行业外贸验厂与国际检测标准索引库</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              点击标准卡片查看详细过审红线、审核周期、典型费用与检查要点
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索标准代码/要点..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white w-44 sm:w-56"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium cursor-pointer"
            >
              <option value="all">全部分类</option>
              <option value="社会责任与人权验厂 (Social & Human Rights)">社会责任与人权</option>
              <option value="质量管理与制造体系 (Quality & Manufacturing)">质量管理体系</option>
              <option value="环境安全与碳足迹 (Environmental & ESG)">环保与碳足迹</option>
              <option value="行业专项与安全准入 (Industry Specific & Safety)">安全与行业准入</option>
              <option value="反恐与供应链安全 (C-TPAT / Security)">反恐与供应链安全</option>
            </select>
          </div>
        </div>

        {/* Standards Grid & Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Standard Cards List */}
          <div className="lg:col-span-6 space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredStandards.map(std => {
              const isSelected = selectedStandard?.code === std.code;
              return (
                <div
                  key={std.code}
                  onClick={() => setSelectedStandard(std)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{std.code}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          std.importanceLevel.includes('Mandatory') ? 'bg-red-100 text-red-700' :
                          std.importanceLevel.includes('High Priority') ? 'bg-indigo-100 text-indigo-700' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {std.importanceLevel.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 mt-1 line-clamp-1">{std.name}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{std.typicalCostRangeUsd}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-500">
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-medium truncate max-w-[200px]">
                      {std.category.split(' ')[0]}
                    </span>
                    <span>•</span>
                    <span className="text-slate-400">{std.keyRegions.join(', ')}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Standard Detail View */}
          <div className="lg:col-span-6 bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 space-y-4">
            {selectedStandard ? (
              <div className="space-y-4 text-xs animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-mono text-xs font-bold uppercase">{selectedStandard.category}</span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px]">
                      {selectedStandard.importanceLevel}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white mt-1">{selectedStandard.code}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{selectedStandard.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">审核/认证发证机构:</span>
                    <p className="font-bold text-slate-200 mt-0.5">{selectedStandard.authorityOrOrg}</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">典型费用与复审周期:</span>
                    <p className="font-bold text-amber-300 mt-0.5">{selectedStandard.typicalCostRangeUsd} (每 {selectedStandard.auditCycleMonths} 个月)</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">过审合格红线标准 (Pass Threshold):</span>
                  <p className="p-2.5 bg-slate-900 text-emerald-300 rounded-xl border border-slate-800 font-medium">
                    {selectedStandard.passThreshold}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">核心验厂现场检查要点 (Audit Checkpoints):</span>
                  <div className="space-y-1.5">
                    {selectedStandard.coreAuditCheckpoints.map((cp, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{cp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>适用行业: {selectedStandard.applicableIndustries.join('、')}</span>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">请在左侧选择一项验厂标准查看详情</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
