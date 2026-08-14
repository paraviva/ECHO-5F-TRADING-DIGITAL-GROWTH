import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Globe2, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Sparkles, 
  FileSpreadsheet, 
  CheckCircle2, 
  User, 
  ShieldCheck, 
  TrendingUp, 
  Plus, 
  Send,
  Star,
  ExternalLink,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { CRMCustomer, CRMStage, FollowUpLog } from '../types';

interface CRMCustomerDrawerProps {
  customer: CRMCustomer | null;
  onClose: () => void;
  onUpdateStage: (customerId: string, newStage: CRMStage) => void;
  onAddFollowUp: (customerId: string, log: FollowUpLog) => void;
  onOpenDueDiligence: (customer: CRMCustomer) => void;
  onOpenAIPitch: (customer: CRMCustomer) => void;
  onOpenCreatePI: (customer: CRMCustomer) => void;
}

export const CRMCustomerDrawer: React.FC<CRMCustomerDrawerProps> = ({
  customer,
  onClose,
  onUpdateStage,
  onAddFollowUp,
  onOpenDueDiligence,
  onOpenAIPitch,
  onOpenCreatePI
}) => {
  if (!customer) return null;

  const [newLogType, setNewLogType] = useState<FollowUpLog['type']>('Email');
  const [newLogSummary, setNewLogSummary] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');

  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogSummary.trim()) return;

    const newLog: FollowUpLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: newLogType,
      author: customer.assignedSales || '外贸业务员',
      summary: newLogSummary.trim(),
      nextFollowUpDate: nextFollowUpDate || undefined
    };

    onAddFollowUp(customer.id, newLog);
    setNewLogSummary('');
    setNextFollowUpDate('');
  };

  const stageLabels: Record<CRMStage, { label: string; color: string }> = {
    lead: { label: '1. 潜在海关线索', color: 'bg-slate-100 text-slate-700' },
    contacted: { label: '2. 首次建联已触达', color: 'bg-blue-100 text-blue-800' },
    rfq_quoting: { label: '3. 询盘与报价谈判', color: 'bg-amber-100 text-amber-800' },
    sample: { label: '4. 样品寄送/测试', color: 'bg-purple-100 text-purple-800' },
    won_contract: { label: '5. 签约赢单/已付定金', color: 'bg-emerald-100 text-emerald-800' },
    vip_reorder: { label: '6. 长期翻单 VIP', color: 'bg-cyan-100 text-cyan-800' }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200 animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-6 sticky top-0 z-10 border-b border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${stageLabels[customer.stage].color}`}>
                  {stageLabels[customer.stage].label}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  优先级: {customer.priority} 级买家
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {customer.creditRating}
                </span>
              </div>
              <h2 className="text-lg font-black text-white">{customer.companyName}</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5" />
                  {customer.country} {customer.city ? `(${customer.city})` : ''}
                </span>
                <span>•</span>
                <span>行业: {customer.industry}</span>
                <span>•</span>
                <span>年进口量: {customer.annualImportValue}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stage Progression Bar */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs text-slate-400 font-medium">当前阶段流转:</span>
            <select
              value={customer.stage}
              onChange={(e) => onUpdateStage(customer.id, e.target.value as CRMStage)}
              className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="lead">1. 潜在海关线索 (Lead)</option>
              <option value="contacted">2. 首次建联触达 (Contacted)</option>
              <option value="rfq_quoting">3. 询盘与报价谈判 (Quoting)</option>
              <option value="sample">4. 样品寄送/测试 (Sample Stage)</option>
              <option value="won_contract">5. 签约赢单/已付定金 (Won)</option>
              <option value="vip_reorder">6. 长期翻单 VIP (Retention)</option>
            </select>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto text-xs text-slate-700">
          
          {/* Quick AI Action Toolbar */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => onOpenAIPitch(customer)}
              className="p-3 bg-gradient-to-tr from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-xl font-bold text-blue-700 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>AI 多语种开发信/报盘</span>
            </button>

            <button
              onClick={() => onOpenDueDiligence(customer)}
              className="p-3 bg-gradient-to-tr from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 rounded-xl font-bold text-amber-800 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-600" />
              <span>AI 360° 买家资信背调</span>
            </button>

            <button
              onClick={() => onOpenCreatePI(customer)}
              className="p-3 bg-gradient-to-tr from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 rounded-xl font-bold text-emerald-800 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>创建形式发票 PI</span>
            </button>
          </div>

          {/* Key Contacts List */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                已核验采购决策人与联系人档案 ({customer.contacts.length})
              </span>
              <span className="text-[11px] text-slate-500 font-normal">负责人: {customer.assignedSales}</span>
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              {customer.contacts.map((contact) => (
                <div key={contact.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">{contact.name}</span>
                      <span className="text-slate-500 text-[11px] ml-2">({contact.title})</span>
                    </div>
                    {contact.isPrimary && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">
                        主决策人
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{contact.email}</span>
                    </a>
                    {contact.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{contact.phone}</span>
                      </span>
                    )}
                    {contact.whatsApp && (
                      <a 
                        href={`https://wa.me/${contact.whatsApp.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1 text-emerald-600 hover:underline font-bold"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp 聊天</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sourcing Requirements & Customs Activity */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">主营采购产品:</span>
              <div className="flex flex-wrap gap-1">
                {customer.mainProducts.map((p, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700 font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">关注 HS 编码:</span>
              <div className="flex flex-wrap gap-1">
                {customer.hsCodes.map((hs, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 font-mono text-[11px] rounded font-bold">
                    {hs}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Latest Inquiry Specs (If any) */}
          {customer.latestInquiry && (
            <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>最新询盘需求 (RFQ Specification):</span>
                <span>{customer.latestInquiry.date}</span>
              </div>
              <div className="font-bold text-slate-900">{customer.latestInquiry.product}</div>
              <div className="text-slate-600 text-[11px]">{customer.latestInquiry.specs}</div>
              <div className="text-blue-700 font-semibold text-[11px]">
                采购量: {customer.latestInquiry.qty} • 目标报价: {customer.latestInquiry.targetPrice}
              </div>
            </div>
          )}

          {/* Follow-up Timeline Logs */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                客户全生命周期跟进动态 Timeline ({customer.followUpLogs.length})
              </span>
            </h3>

            {/* Add Follow-up Form */}
            <form onSubmit={handleAddLogSubmit} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 text-[11px]">沟通方式:</span>
                  <select
                    value={newLogType}
                    onChange={(e) => setNewLogType(e.target.value as any)}
                    className="bg-white border border-slate-200 text-xs px-2.5 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  >
                    <option value="Email">Email 邮件往来</option>
                    <option value="WhatsApp">WhatsApp 聊天</option>
                    <option value="Phone Call">电话沟通</option>
                    <option value="Quotation / PI">发送报盘 / 形式发票</option>
                    <option value="Sample Sent">寄出样品</option>
                    <option value="Video Conference">Zoom / Teams 视频会议</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px]">下次跟进:</span>
                  <input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    className="bg-white border border-slate-200 text-[11px] px-2 py-0.5 rounded-lg text-slate-700"
                  />
                </div>
              </div>

              <textarea
                rows={2}
                value={newLogSummary}
                onChange={(e) => setNewLogSummary(e.target.value)}
                placeholder="记录本次跟进内容（如：已发送 5000 套减速机 FOB 报价单，客户反馈下周开会评审...）"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>添加跟进记录</span>
                </button>
              </div>
            </form>

            {/* Timeline List */}
            <div className="space-y-3 pt-2">
              {customer.followUpLogs.map((log) => (
                <div key={log.id} className="relative pl-6 border-l-2 border-slate-200 space-y-1">
                  <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]">
                        {log.type}
                      </span>
                      <span>{log.author}</span>
                    </span>
                    <span className="text-slate-400">{log.date}</span>
                  </div>
                  <p className="text-slate-700 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {log.summary}
                  </p>
                  {log.nextFollowUpDate && (
                    <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>计划下次跟进时间: {log.nextFollowUpDate}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            客户编号: {customer.id} • 录入日期: {customer.createdAt}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            关闭档案
          </button>
        </div>
      </div>
    </div>
  );
};
