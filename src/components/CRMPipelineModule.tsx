import React, { useState } from 'react';
import { 
  Users2, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Globe2, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Sparkles, 
  Building2, 
  ArrowRight, 
  ChevronRight, 
  Star,
  CheckCircle2,
  DollarSign,
  BrainCircuit,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { CRMCustomer, CRMStage } from '../types';
import { INDUSTRY_CATEGORIES } from '../data/tradeData';
import { RATIONAL_MINDSET_QUOTES } from '../data/auditAndMindsetData';

interface CRMPipelineModuleProps {
  customers: CRMCustomer[];
  onSelectCustomer: (customer: CRMCustomer) => void;
  onUpdateCustomerStage: (customerId: string, newStage: CRMStage) => void;
  onToggleStarCustomer: (customerId: string) => void;
  onAddNewCustomer: () => void;
}

export const CRMPipelineModule: React.FC<CRMPipelineModuleProps> = ({
  customers,
  onSelectCustomer,
  onUpdateCustomerStage,
  onToggleStarCustomer,
  onAddNewCustomer
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('全部品类');
  const [selectedPriority, setSelectedPriority] = useState('全部');

  const STAGES: { id: CRMStage; label: string; bg: string; border: string; badgeColor: string }[] = [
    { id: 'lead', label: '1. 潜在海关线索 (Leads)', bg: 'bg-slate-50', border: 'border-slate-200', badgeColor: 'bg-slate-200 text-slate-800' },
    { id: 'contacted', label: '2. 首次建联已触达 (Contacted)', bg: 'bg-blue-50/40', border: 'border-blue-200', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'rfq_quoting', label: '3. 询盘与报价谈判 (Quoting)', bg: 'bg-amber-50/40', border: 'border-amber-200', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'sample', label: '4. 样品寄送/打样 (Sample)', bg: 'bg-purple-50/40', border: 'border-purple-200', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'won_contract', label: '5. 签约赢单/定金 (Won)', bg: 'bg-emerald-50/40', border: 'border-emerald-200', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'vip_reorder', label: '6. 长期翻单 VIP (Retention)', bg: 'bg-cyan-50/40', border: 'border-cyan-200', badgeColor: 'bg-cyan-100 text-cyan-800' }
  ];

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchName = c.companyName.toLowerCase().includes(term);
      const matchCountry = c.country.toLowerCase().includes(term);
      const matchProduct = c.mainProducts.some(p => p.toLowerCase().includes(term));
      const matchContact = c.contacts.some(ct => ct.name.toLowerCase().includes(term) || ct.email.toLowerCase().includes(term));
      if (!matchName && !matchCountry && !matchProduct && !matchContact) {
        return false;
      }
    }

    if (selectedIndustry !== '全部品类' && c.industry !== selectedIndustry) {
      return false;
    }

    if (selectedPriority !== '全部' && c.priority !== selectedPriority) {
      return false;
    }

    return true;
  });

  const [quoteIndex, setQuoteIndex] = useState(0);
  const currentQuote = RATIONAL_MINDSET_QUOTES[quoteIndex] || RATIONAL_MINDSET_QUOTES[0];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % RATIONAL_MINDSET_QUOTES.length);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Rational Mindset & Engineering Confidence Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl border border-slate-700/80 p-4 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0 mt-0.5">
            <BrainCircuit className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                ECHO 5F 理智信心心法 • 场景: {currentQuote.applicationContext}
              </span>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">从信号到系统论</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-100 mt-1 leading-relaxed">
              “{currentQuote.quote}”
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              💡 破局心法: {currentQuote.corePrinciple}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
          <button
            onClick={handleNextQuote}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white rounded-lg text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>换一则箴言</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Control Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Users2 className="w-5 h-5 text-blue-600" />
              <span>外贸 CRM 客户全生命周期商机流转看板 (Enterprise B2B Trade CRM)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              海关线索精准导入、决策人档案、跟进日志追踪、样品测试与签约成单全链路数字化管理
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">商机看板</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">列表视图</span>
              </button>
            </div>

            <button
              onClick={onAddNewCustomer}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>录入新客户</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索客户名称、联系人、国家、采购品类..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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

          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="全部">客户优先级：全部 (All Priorities)</option>
              <option value="S">S 级核心战略买家 (年进口额 &gt; $3M)</option>
              <option value="A">A 级高意向采购商</option>
              <option value="B">B 级标准贸易商</option>
              <option value="C">C 级普通线索</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageCustomers = filteredCustomers.filter(c => c.stage === stage.id);
            return (
              <div
                key={stage.id}
                className={`${stage.bg} rounded-2xl border ${stage.border} p-3.5 flex flex-col justify-between min-h-[500px] space-y-3`}
              >
                {/* Column Header */}
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                    <span className="font-extrabold text-xs text-slate-900">{stage.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${stage.badgeColor}`}>
                      {stageCustomers.length}
                    </span>
                  </div>

                  {/* Customer Cards inside stage */}
                  <div className="space-y-3 pt-3">
                    {stageCustomers.map((cust) => {
                      const primaryContact = cust.contacts.find(c => c.isPrimary) || cust.contacts[0];
                      return (
                        <div
                          key={cust.id}
                          onClick={() => onSelectCustomer(cust)}
                          className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-1.5">
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                  cust.priority === 'S' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {cust.priority} 级
                                </span>
                                <span className="font-bold text-xs text-slate-900 line-clamp-1">
                                  {cust.companyName}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Globe2 className="w-3 h-3" />
                                {cust.country}
                              </span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleStarCustomer(cust.id);
                              }}
                              className="text-slate-300 hover:text-amber-400 p-0.5"
                            >
                              <Star className={`w-4 h-4 ${cust.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                          </div>

                          <div className="bg-slate-50 p-2 rounded-lg text-[11px] text-slate-600 space-y-1">
                            <div className="truncate font-medium text-slate-800">
                              {primaryContact ? `${primaryContact.name} (${primaryContact.title})` : '暂无联系人'}
                            </div>
                            <div className="text-slate-500 truncate">
                              年采购: {cust.annualImportValue}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                            <span>负责人: {cust.assignedSales.split(' ')[0]}</span>
                            <span className="text-blue-600 font-bold flex items-center">
                              详情 <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {stageCustomers.length === 0 && (
                      <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-300 rounded-xl">
                        暂无客户
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">客户公司名称</th>
                  <th className="p-3.5">国家/地区</th>
                  <th className="p-3.5">行业品类</th>
                  <th className="p-3.5">主联系人</th>
                  <th className="p-3.5">当前阶段</th>
                  <th className="p-3.5">优先级</th>
                  <th className="p-3.5">年采购额</th>
                  <th className="p-3.5">负责人</th>
                  <th className="p-3.5 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => {
                  const primaryContact = cust.contacts.find(c => c.isPrimary) || cust.contacts[0];
                  return (
                    <tr 
                      key={cust.id} 
                      onClick={() => onSelectCustomer(cust)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="p-3.5 font-bold text-slate-900">
                        <div className="flex items-center space-x-2">
                          <Star className={`w-3.5 h-3.5 ${cust.isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                          <span>{cust.companyName}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600">{cust.country}</td>
                      <td className="p-3.5 text-slate-600">{cust.industry}</td>
                      <td className="p-3.5 text-slate-700">
                        {primaryContact ? `${primaryContact.name} (${primaryContact.email})` : '-'}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded text-[11px]">
                          {cust.stage}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-amber-800">{cust.priority} 级</td>
                      <td className="p-3.5 text-emerald-600 font-bold">{cust.annualImportValue}</td>
                      <td className="p-3.5 text-slate-600">{cust.assignedSales}</td>
                      <td className="p-3.5 text-right">
                        <button className="text-blue-600 font-bold hover:underline">
                          打开档案
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
