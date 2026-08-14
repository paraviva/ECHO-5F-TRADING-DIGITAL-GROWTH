import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Ship, 
  Globe2, 
  PlusCircle, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Tag, 
  Calendar, 
  Anchor, 
  RefreshCw,
  Zap,
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { CustomsBLRecord, IndustryCategory } from '../types';

interface CustomsSearchModuleProps {
  records: CustomsBLRecord[];
  onAddRecordToCRM: (record: CustomsBLRecord) => void;
  onOpenDueDiligence: (companyName: string, country: string, industry: string, hsCode: string) => void;
  onOpenAIPitch: (buyerCompany: string, country: string, product: string, specs: string) => void;
  onQueryLiveCustomsAPI: (hsCode: string, keyword: string, destinationCountry: string, buyerName: string, industry: string) => Promise<void>;
  isLoadingLiveAPI: boolean;
}

// Structured 2-Level Industry & Commodity Dimension
interface SubCategoryItem {
  id: string;
  name: string;
  hsCode: string;
  keyword: string;
}

interface MainCategoryItem {
  id: string;
  name: string;
  icon: string;
  industry: IndustryCategory;
  subCategories: SubCategoryItem[];
}

const CATEGORY_HIERARCHY: MainCategoryItem[] = [
  {
    id: 'textile',
    name: '纺织服装面料',
    icon: '🧦',
    industry: '纺织服装与面料',
    subCategories: [
      { id: 'all-textile', name: '全部纺织服装', hsCode: '61', keyword: 'textile clothing' },
      { id: 'socks', name: '棉袜/丝袜/运动袜 (6115)', hsCode: '6115.95', keyword: 'socks' },
      { id: 'tshirt', name: '针织T恤/POLO衫 (6109)', hsCode: '6109.10', keyword: 'cotton tshirt' },
      { id: 'outerwear', name: '户外运动服/外套 (6201)', hsCode: '6201.90', keyword: 'sportswear jacket' },
      { id: 'fabric', name: '梭织家纺面料 (5208)', hsCode: '5208.11', keyword: 'woven fabric' }
    ]
  },
  {
    id: 'machinery',
    name: '机械五金装备',
    icon: '⚙️',
    industry: '机械五金与工业设备',
    subCategories: [
      { id: 'all-mach', name: '全部机械五金', hsCode: '84', keyword: 'machinery' },
      { id: 'bearing', name: '深沟球轴承 (8482)', hsCode: '8482.10', keyword: 'ball bearing' },
      { id: 'gearbox', name: '齿轮箱/减速机 (8483)', hsCode: '8483.40', keyword: 'gearbox speed reducer' },
      { id: 'valve', name: '工业球阀/管道 (8481)', hsCode: '8481.80', keyword: 'industrial valve' },
      { id: 'cnc', name: '数控机床附件 (8458)', hsCode: '8458.11', keyword: 'cnc lathe parts' }
    ]
  },
  {
    id: 'solar',
    name: '光伏储能电气',
    icon: '⚡',
    industry: '光伏新能源与储能',
    subCategories: [
      { id: 'all-solar', name: '全部新能源', hsCode: '85', keyword: 'renewable energy' },
      { id: 'pv', name: '单晶光伏组件 (8541)', hsCode: '8541.43', keyword: 'solar panel pv module' },
      { id: 'inverter', name: '光伏逆变电源 (8504)', hsCode: '8504.40', keyword: 'solar inverter' },
      { id: 'battery', name: '储能锂电池组 (8507)', hsCode: '8507.60', keyword: 'lithium battery energy storage' },
      { id: 'lighting', name: '商用LED照明 (9405)', hsCode: '9405.42', keyword: 'led commercial light' }
    ]
  },
  {
    id: 'autoparts',
    name: '汽车摩托配件',
    icon: '🚗',
    industry: '汽车摩托车配件',
    subCategories: [
      { id: 'all-auto', name: '全部汽摩配', hsCode: '87', keyword: 'auto parts' },
      { id: 'body', name: '车身结构件 (8708)', hsCode: '8708.29', keyword: 'auto body parts' },
      { id: 'electronics', name: '汽车电子传感器 (8512)', hsCode: '8512.20', keyword: 'car sensor electronics' },
      { id: 'wheel', name: '铝合金轮毂 (8708.70)', hsCode: '8708.70', keyword: 'aluminum alloy wheels' },
      { id: 'brake', name: '刹车制动系统 (8708.30)', hsCode: '8708.30', keyword: 'brake pad disc' }
    ]
  },
  {
    id: 'home',
    name: '家居轻工百货',
    icon: '🛋️',
    industry: '智能家居与建材家具',
    subCategories: [
      { id: 'all-home', name: '全部轻工家居', hsCode: '94', keyword: 'home furniture' },
      { id: 'furniture', name: '实木办公家具 (9403)', hsCode: '9403.60', keyword: 'office furniture' },
      { id: 'sanitary', name: '陶瓷卫浴五金 (6910)', hsCode: '6910.10', keyword: 'sanitary ware ceramic' },
      { id: 'plastic', name: '日用塑料餐厨 (3926)', hsCode: '3926.90', keyword: 'plastic houseware' },
      { id: 'bags', name: '商旅箱包皮具 (4202)', hsCode: '4202.12', keyword: 'luggage travel bag' }
    ]
  },
  {
    id: 'medical',
    name: '医疗器械劳保',
    icon: '🏥',
    industry: '医疗器械与防护耗材',
    subCategories: [
      { id: 'all-med', name: '全部医疗劳保', hsCode: '90', keyword: 'medical equipment' },
      { id: 'consumables', name: '一次性医疗耗材 (9018)', hsCode: '9018.90', keyword: 'medical consumables' },
      { id: 'gloves', name: '丁腈防护手套 (6116)', hsCode: '6116.10', keyword: 'nitrile safety gloves' },
      { id: 'monitor', name: '诊断监护仪器 (9018.19)', hsCode: '9018.19', keyword: 'diagnostic monitor' }
    ]
  }
];

// Structured 2-Level Region & Country Dimension
interface RegionItem {
  id: string;
  name: string;
  countries: string[];
}

const REGION_HIERARCHY: RegionItem[] = [
  { id: 'all', name: '全球关区', countries: ['全球'] },
  { id: 'americas', name: '美洲关区', countries: ['United States', 'Mexico', 'Brazil', 'Canada', 'Chile'] },
  { id: 'europe', name: '欧洲关区', countries: ['Germany', 'United Kingdom', 'France', 'Italy', 'Poland'] },
  { id: 'mideast_africa', name: '中东非洲', countries: ['United Arab Emirates', 'Saudi Arabia', 'Egypt', 'Turkey', 'South Africa'] },
  { id: 'asia_pacific', name: '亚太东盟', countries: ['Vietnam', 'India', 'Indonesia', 'Japan', 'Australia'] }
];

export const CustomsSearchModule: React.FC<CustomsSearchModuleProps> = ({
  records,
  onAddRecordToCRM,
  onOpenDueDiligence,
  onOpenAIPitch,
  onQueryLiveCustomsAPI,
  isLoadingLiveAPI
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hsCodeInput, setHsCodeInput] = useState('');
  const [destinationPortFilter, setDestinationPortFilter] = useState('');

  // 2-Level Dimensions State
  const [selectedMainCatId, setSelectedMainCatId] = useState<string>('textile');
  const [selectedSubCatId, setSelectedSubCatId] = useState<string>('socks');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('全球');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('全部品类');

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

      // Chinese/English Synonym mapping
      let matchSynonym = false;
      if (term.includes('sock') || term.includes('袜') || term.includes('hosiery')) {
        matchSynonym = rec.productDescription.toLowerCase().includes('sock') || 
                       rec.productDescription.toLowerCase().includes('hosiery') ||
                       rec.hsCode.startsWith('6115') ||
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

    // Industry Filter
    if (selectedIndustry !== '全部品类' && rec.industry !== selectedIndustry) {
      return false;
    }

    // Country Filter
    if (selectedCountry !== '全球' && rec.destinationCountry !== selectedCountry) {
      return false;
    }

    // HS Code Filter
    if (hsCodeInput.trim() !== '') {
      const cleanInput = hsCodeInput.replace(/\D/g, '');
      const cleanRecordHs = rec.hsCode.replace(/\D/g, '');
      if (!cleanRecordHs.includes(cleanInput) && !cleanInput.includes(cleanRecordHs.substring(0, 4))) {
        return false;
      }
    }

    // Port Filter
    if (destinationPortFilter.trim() !== '' && !rec.destinationPort.toLowerCase().includes(destinationPortFilter.toLowerCase())) {
      return false;
    }

    return true;
  });

  const handleRunSearch = () => {
    onQueryLiveCustomsAPI(
      hsCodeInput,
      searchTerm,
      selectedCountry === '全球' ? '' : selectedCountry,
      '',
      selectedIndustry === '全部品类' ? '' : selectedIndustry
    );
  };

  const handleSelectSubCategory = (mainCat: MainCategoryItem, sub: SubCategoryItem) => {
    setSelectedMainCatId(mainCat.id);
    setSelectedSubCatId(sub.id);
    setSelectedIndustry(mainCat.industry);
    setSearchTerm(sub.keyword);
    setHsCodeInput(sub.hsCode);

    // Auto trigger search with UN Comtrade
    onQueryLiveCustomsAPI(
      sub.hsCode,
      sub.keyword,
      selectedCountry === '全球' ? '' : selectedCountry,
      '',
      mainCat.industry
    );
  };

  const handleSelectRegion = (region: RegionItem) => {
    setSelectedRegionId(region.id);
    if (region.id === 'all') {
      setSelectedCountry('全球');
    } else {
      setSelectedCountry(region.countries[0]);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setHsCodeInput('');
    setSelectedCountry('全球');
    setSelectedIndustry('全部品类');
    setSelectedRegionId('all');
    setSelectedSubCatId('');
    setDestinationPortFilter('');
  };

  const activeMainCat = CATEGORY_HIERARCHY.find(c => c.id === selectedMainCatId) || CATEGORY_HIERARCHY[0];
  const activeRegion = REGION_HIERARCHY.find(r => r.id === selectedRegionId) || REGION_HIERARCHY[0];

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* 2-Level Category & Dimension Selector Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3.5">
        
        {/* Dimension 1: Industry (Level 1 Tabs -> Level 2 Sub-Categories) */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>品类二级类目 (Category Dimension)</span>
            </span>
            <span className="text-[11px] text-slate-400">点击二级标签自动填充 HS 编码并联网检索</span>
          </div>

          {/* Level 1: Main Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5">
            {CATEGORY_HIERARCHY.map((mainCat) => {
              const isActive = selectedMainCatId === mainCat.id;
              return (
                <button
                  key={mainCat.id}
                  onClick={() => setSelectedMainCatId(mainCat.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
                  }`}
                >
                  <span>{mainCat.icon}</span>
                  <span>{mainCat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Level 2: Sub-Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pl-1 bg-slate-50/70 p-2 rounded-xl mt-2 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold shrink-0 flex items-center gap-0.5">
              <span>细分</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </span>
            {activeMainCat.subCategories.map((sub) => {
              const isSubActive = selectedSubCatId === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubCategory(activeMainCat, sub)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSubActive
                      ? 'bg-blue-100 text-blue-800 border border-blue-300 font-bold shadow-xs'
                      : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 border border-slate-200/80'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dimension 2: Region & Country (Level 1 Continent -> Level 2 Countries) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold text-slate-700 shrink-0 flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>关区大洲:</span>
            </span>

            {REGION_HIERARCHY.map((reg) => (
              <button
                key={reg.id}
                onClick={() => handleSelectRegion(reg)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedRegionId === reg.id
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {reg.name}
              </button>
            ))}

            {activeRegion.id !== 'all' && (
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-200">
                <span className="text-[11px] text-slate-400 shrink-0">国家:</span>
                {activeRegion.countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCountry === country
                        ? 'bg-indigo-100 text-indigo-800 font-bold border border-indigo-200'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Search Input & Concise Actions Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
          {/* Keyword / Product Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunSearch();
              }}
              placeholder="搜索品名 (如 Socks, Bearings, Solar)、提单号、海外买家..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* HS Code Input */}
          <div className="sm:col-span-3 relative">
            <Tag className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={hsCodeInput}
              onChange={(e) => setHsCodeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunSearch();
              }}
              placeholder="HS 编码 (如 6115, 8482)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Concise Action Buttons */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <button
              onClick={handleRunSearch}
              disabled={isLoadingLiveAPI}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoadingLiveAPI ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>搜索中...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>搜索</span>
                </>
              )}
            </button>

            <button
              onClick={handleClearFilters}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              title="重置全部筛选条件"
            >
              重置
            </button>
          </div>
        </div>

      </div>

      {/* Results Header Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <span>
            检索到 <strong className="text-slate-900 font-bold">{filteredRecords.length}</strong> 笔真实海关提单
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium">
            数据源: UN Comtrade 联合国官方海关直连
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% 真实提单与收发货人交叉验真
          </span>
        </div>
      </div>

      {/* Zero Results State or Cards List */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Ship className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-sm font-extrabold text-slate-900">
              {searchTerm || hsCodeInput ? `暂无「${searchTerm || hsCodeInput}」本地缓存` : '当前条件暂无提单'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              已连接联合国 UN Comtrade 全球海关数据源，点击下方「搜索」即可向海关 API 实时拉取最新提单。
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={handleRunSearch}
              disabled={isLoadingLiveAPI}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoadingLiveAPI ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>抓取中...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>立即搜索</span>
                </>
              )}
            </button>

            <button
              onClick={handleClearFilters}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              重置
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all p-4 flex flex-col justify-between space-y-3"
          >
            {/* Top Row: B/L Number, Shipment Date & Declared Value */}
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Ship className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        提单: {record.blNumber}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                        {record.incoterm}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{record.shipmentDate}</span>
                      <span>•</span>
                      <span>{record.carrierName || 'Carrier'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[9px] text-slate-400 uppercase">申报货值</div>
                  <div className="text-xs sm:text-sm font-extrabold text-emerald-600">
                    ${record.declaredValueUsd.toLocaleString()} USD
                  </div>
                </div>
              </div>

              {/* Trade Route & Logistics Info */}
              <div className="grid grid-cols-2 gap-2 py-2 text-xs bg-slate-50/70 rounded-xl p-2.5 my-2.5">
                <div>
                  <span className="text-slate-400 text-[10px] block">海外买家:</span>
                  <strong className="text-slate-900 font-bold block truncate text-[11px]" title={record.consignee}>
                    {record.consignee}
                  </strong>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Globe2 className="w-3 h-3 text-slate-400" />
                    {record.destinationCountry}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">原发货人:</span>
                  <span className="text-slate-700 block truncate text-[11px]" title={record.shipper}>
                    {record.shipper}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Anchor className="w-3 h-3 text-slate-400" />
                    起运: {record.loadingPort.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Goods & Specifications */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
                    HS: {record.hsCode}
                  </span>
                  <span className="text-slate-500 text-[10px] flex items-center gap-1.5">
                    <span>毛重: {record.grossWeightKg.toLocaleString()} KG</span>
                    <span>•</span>
                    <span>{record.quantity.toLocaleString()} {record.quantityUnit}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono leading-relaxed">
                  {record.productDescription}
                </p>
              </div>
            </div>

            {/* Bottom Actions Bar - Concise Mode */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onOpenDueDiligence(record.consignee, record.destinationCountry, record.industry, record.hsCode)}
                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-lg border border-amber-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="查看买家背调"
                >
                  <Sparkles className="w-3 h-3 text-amber-600 fill-amber-600" />
                  <span>AI 背调</span>
                </button>

                <button
                  onClick={() => onOpenAIPitch(record.consignee, record.destinationCountry, record.productDescription, `HS Code: ${record.hsCode}, Weight: ${record.grossWeightKg}kg`)}
                  className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-lg border border-indigo-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="生成开发信与报价"
                >
                  <FileText className="w-3 h-3" />
                  <span>AI 开发信</span>
                </button>
              </div>

              <button
                onClick={() => onAddRecordToCRM(record)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                title="一键将该海外买家加入 CRM 潜客库"
              >
                <PlusCircle className="w-3 h-3" />
                <span>加 CRM</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
