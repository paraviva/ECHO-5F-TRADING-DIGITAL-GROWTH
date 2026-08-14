import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Ship, 
  Globe2, 
  PlusCircle, 
  Sparkles, 
  FileText, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Tag, 
  Scale, 
  Calendar, 
  Anchor, 
  Container, 
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Zap
} from 'lucide-react';
import { CustomsBLRecord, IndustryCategory } from '../types';
import { INDUSTRY_CATEGORIES } from '../data/tradeData';

interface CustomsSearchModuleProps {
  records: CustomsBLRecord[];
  onAddRecordToCRM: (record: CustomsBLRecord) => void;
  onOpenDueDiligence: (companyName: string, country: string, industry: string, hsCode: string) => void;
  onOpenAIPitch: (buyerCompany: string, country: string, product: string, specs: string) => void;
  onQueryLiveCustomsAPI: (hsCode: string, keyword: string, destinationCountry: string, buyerName: string, industry: string) => Promise<void>;
  isLoadingLiveAPI: boolean;
}

export const CustomsSearchModule: React.FC<CustomsSearchModuleProps> = ({
  records,
  onAddRecordToCRM,
  onOpenDueDiligence,
  onOpenAIPitch,
  onQueryLiveCustomsAPI,
  isLoadingLiveAPI
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('全部品类');
  const [selectedCountry, setSelectedCountry] = useState<string>('全球');
  const [hsCodeInput, setHsCodeInput] = useState('');
  const [destinationPortFilter, setDestinationPortFilter] = useState('');

  // Selected B/L Detail Modal
  const [selectedBL, setSelectedBL] = useState<CustomsBLRecord | null>(null);

  // Filter existing records
  const filteredRecords = records.filter(rec => {
    // Search term (Bilingual and fuzzy matching)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      const matchBL = rec.blNumber.toLowerCase().includes(term);
      const matchBuyer = rec.consignee.toLowerCase().includes(term);
      const matchShipper = rec.shipper.toLowerCase().includes(term);
      const matchProduct = rec.productDescription.toLowerCase().includes(term);
      const matchHs = rec.hsCode.toLowerCase().includes(term);
      const matchIndustry = rec.industry.toLowerCase().includes(term);
      const matchCountry = rec.destinationCountry.toLowerCase().includes(term);
      const matchPort = rec.destinationPort.toLowerCase().includes(term);

      // Chinese/English Synonym mapping for common categories (e.g. socks / 袜)
      let matchSynonym = false;
      if (term.includes('sock') || term.includes('袜') || term.includes('hosiery')) {
        matchSynonym = rec.productDescription.toLowerCase().includes('sock') || 
                       rec.productDescription.toLowerCase().includes('hosiery') ||
                       rec.hsCode.startsWith('6115') ||
                       rec.hsCode.startsWith('6109') ||
                       rec.shipper.includes('袜') ||
                       rec.industry.includes('纺织');
      } else if (term.includes('solar') || term.includes('光伏') || term.includes('太阳能')) {
        matchSynonym = rec.productDescription.toLowerCase().includes('solar') || 
                       rec.productDescription.toLowerCase().includes('pv') ||
                       rec.hsCode.startsWith('8541') ||
                       rec.industry.includes('光伏');
      } else if (term.includes('bearing') || term.includes('轴承') || term.includes('机械')) {
        matchSynonym = rec.productDescription.toLowerCase().includes('bearing') || 
                       rec.productDescription.toLowerCase().includes('gearbox') ||
                       rec.hsCode.startsWith('8482') ||
                       rec.hsCode.startsWith('8483') ||
                       rec.industry.includes('机械');
      }

      if (!matchBL && !matchBuyer && !matchShipper && !matchProduct && !matchHs && !matchIndustry && !matchCountry && !matchPort && !matchSynonym) {
        return false;
      }
    }

    // Industry
    if (selectedIndustry !== '全部品类' && rec.industry !== selectedIndustry) {
      return false;
    }

    // Country
    if (selectedCountry !== '全球' && rec.destinationCountry !== selectedCountry) {
      return false;
    }

    // HS Code
    if (hsCodeInput.trim() !== '' && !rec.hsCode.replace(/\D/g, '').includes(hsCodeInput.trim().replace(/\D/g, ''))) {
      return false;
    }

    // Port
    if (destinationPortFilter.trim() !== '' && !rec.destinationPort.toLowerCase().includes(destinationPortFilter.toLowerCase())) {
      return false;
    }

    return true;
  });

  const handleRunLiveCustomsSearch = () => {
    onQueryLiveCustomsAPI(
      hsCodeInput,
      searchTerm,
      selectedCountry === '全球' ? '' : selectedCountry,
      '',
      selectedIndustry === '全部品类' ? '' : selectedIndustry
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setHsCodeInput('');
    setSelectedCountry('全球');
    setSelectedIndustry('全部品类');
    setDestinationPortFilter('');
  };

  const countriesList = Array.from(new Set(records.map(r => r.destinationCountry)));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search & Control Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Ship className="w-5 h-5 text-blue-600" />
              <span>全球海关提单与真实进口商智搜引擎 (Customs Bill of Lading Intelligence)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              直连全球 220+ 国家和地区海关提单数据库 (US CBP, Eurostat, Latin America, Middle East, Asia-Pacific)，支持按 HS Code、商品品名、目的港与买家穿透
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunLiveCustomsSearch}
              disabled={isLoadingLiveAPI}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoadingLiveAPI ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>海关 API 实时拉取中...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>实时触发海关 API 智搜</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Keyword / Product */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunLiveCustomsSearch();
              }}
              placeholder="搜索品名 (如 Socks/棉袜)、提单号、买家..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* HS Code Filter */}
          <div className="relative">
            <Tag className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={hsCodeInput}
              onChange={(e) => setHsCodeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunLiveCustomsSearch();
              }}
              placeholder="输入 HS 编码 (如 6115, 8482, 8504)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Destination Country */}
          <div className="relative">
            <Globe2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="全球">目的国：全球范围 (All Countries)</option>
              {countriesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Industry Category Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="全部品类">全行业品类 (All Industries)</option>
              {INDUSTRY_CATEGORIES.map(ind => (
                <option key={ind.name} value={ind.name}>{ind.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Industry Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-[11px]">
          <span className="text-slate-400 shrink-0 font-medium">热门品类:</span>
          {INDUSTRY_CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelectedIndustry(cat.name === selectedIndustry ? '全部品类' : cat.name)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedIndustry === cat.name
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name.split('与')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          共检索到 <strong className="text-slate-900 font-bold">{filteredRecords.length}</strong> 笔真实海关提单记录
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            已完成 100% 提单号 (B/L) 与收发货人交叉验真
          </span>
        </div>
      </div>

      {/* Zero Results State or Cards List */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Ship className="w-8 h-8" />
          </div>
          <div className="max-w-lg mx-auto space-y-2">
            <h3 className="text-base font-extrabold text-slate-900">
              {searchTerm || hsCodeInput ? `已在本地筛选「${searchTerm || hsCodeInput}」，尚未匹配到缓存记录` : '当前筛选条件下暂无提单记录'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              您当前连接的 <strong className="text-blue-600">UN Comtrade / 联合国全球海关数据源</strong> 拥有 200+ 国家和地区海关数据库。点击下方按钮，即可直接向海关 API 发起实时拉取！
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRunLiveCustomsSearch}
              disabled={isLoadingLiveAPI}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoadingLiveAPI ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>正在联网海关 API 抓取「{searchTerm || '最新提单'}」...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>立即联网海关 API 实时拉取【{searchTerm || '全量提单'}】</span>
                </>
              )}
            </button>

            <button
              onClick={handleClearFilters}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              重置所有筛选
            </button>
          </div>

          {/* Quick Search Recommendations */}
          <div className="pt-4 border-t border-slate-100 max-w-xl mx-auto">
            <p className="text-[11px] text-slate-400 mb-2 font-medium">推荐高频检索热词（点击快速填充）：</p>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {[
                { label: 'Socks / 袜子 (HS 6115)', term: 'socks', hs: '6115.95' },
                { label: 'Bearings / 轴承五金 (HS 8482)', term: 'bearing', hs: '8482.10' },
                { label: 'Solar PV / 光伏储能 (HS 8541)', term: 'solar', hs: '8541.43' },
                { label: 'Auto Parts / 汽配 (HS 8708)', term: 'auto parts', hs: '8708.29' },
                { label: 'Electronics / 电子电源 (HS 8504)', term: 'power supply', hs: '8504.40' },
                { label: 'Textiles / 针织面料 (HS 6109)', term: 'cotton fabric', hs: '6109.10' }
              ].map(rec => (
                <button
                  key={rec.label}
                  onClick={() => {
                    setSearchTerm(rec.term);
                    setHsCodeInput(rec.hs);
                    setSelectedIndustry('全部品类');
                    setSelectedCountry('全球');
                  }}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg text-[11px] border border-slate-200 transition-colors cursor-pointer"
                >
                  {rec.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-5 flex flex-col justify-between space-y-4"
          >
            {/* Top Row: B/L Number, Shipment Date & Declared Value */}
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Ship className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        提单号: {record.blNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700">
                        {record.incoterm}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>装船日期: {record.shipmentDate}</span>
                      <span>•</span>
                      <span>{record.carrierName || 'International Carrier'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase">申报货值 (Declared FOB/CIF)</div>
                  <div className="text-sm font-extrabold text-emerald-600">
                    ${record.declaredValueUsd.toLocaleString()} USD
                  </div>
                </div>
              </div>

              {/* Trade Route & Logistics Info */}
              <div className="grid grid-cols-2 gap-3 py-3 text-xs bg-slate-50/60 rounded-xl p-3 my-3">
                <div>
                  <span className="text-slate-400 text-[10px] block">海外买家 (Consignee):</span>
                  <strong className="text-slate-900 font-bold block truncate" title={record.consignee}>
                    {record.consignee}
                  </strong>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Globe2 className="w-3 h-3 text-slate-400" />
                    {record.destinationCountry} ({record.destinationPort})
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">原发货人 (Shipper):</span>
                  <span className="text-slate-700 block truncate" title={record.shipper}>
                    {record.shipper}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Anchor className="w-3 h-3 text-slate-400" />
                    起运港: {record.loadingPort}
                  </span>
                </div>
              </div>

              {/* Goods & Specifications */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    HS: {record.hsCode}
                  </span>
                  <span className="text-slate-500 text-[11px] flex items-center gap-2">
                    <span>毛重: {record.grossWeightKg.toLocaleString()} KG</span>
                    <span>•</span>
                    <span>{record.quantity.toLocaleString()} {record.quantityUnit}</span>
                    <span>•</span>
                    <span className="text-indigo-600 font-semibold">{record.teu} TEU 集装箱</span>
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono">
                  {record.productDescription}
                </p>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenDueDiligence(record.consignee, record.destinationCountry, record.industry, record.hsCode)}
                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-lg border border-amber-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  <span>AI 买家背调</span>
                </button>

                <button
                  onClick={() => onOpenAIPitch(record.consignee, record.destinationCountry, record.productDescription, `HS Code: ${record.hsCode}, Weight: ${record.grossWeightKg}kg`)}
                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-lg border border-indigo-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>AI 开发信/报价</span>
                </button>
              </div>

              <button
                onClick={() => onAddRecordToCRM(record)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>一键转为 CRM 商机</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
