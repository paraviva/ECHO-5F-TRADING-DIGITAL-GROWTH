import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Globe2, 
  Users2, 
  FileSpreadsheet, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  Ship,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { CustomsBLRecord, CRMCustomer, ProformaInvoice } from '../types';

interface AnalyticsDashboardProps {
  records: CustomsBLRecord[];
  customers: CRMCustomer[];
  invoices: ProformaInvoice[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  records,
  customers,
  invoices
}) => {
  // Total customs declared value
  const totalCustomsValue = records.reduce((sum, r) => sum + r.declaredValueUsd, 0);

  // Invoices total amount
  const totalInvoiceValue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  // Group by Country
  const countryCounts: Record<string, number> = {};
  records.forEach(r => {
    countryCounts[r.destinationCountry] = (countryCounts[r.destinationCountry] || 0) + 1;
  });
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Group by Industry
  const industryCounts: Record<string, number> = {};
  customers.forEach(c => {
    industryCounts[c.industry] = (industryCounts[c.industry] || 0) + 1;
  });
  const topIndustries = Object.entries(industryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>全球海关提单库总存量</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Ship className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{records.length.toLocaleString()} 笔</div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>覆盖全球 220+ 主要通商港口</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>CRM 客户管线在跟商机</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{customers.length} 家海外买家</div>
          <div className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
            <span>S/A 级高价值核心买家占比 65%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>ERP 订单与形式发票 (PI) 总额</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            ${totalInvoiceValue.toLocaleString()} USD
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            共 {invoices.length} 份标准外贸销售 PI 单证
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>AI 外贸开发信打开预估转化</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700">38.6% 回盘率</div>
          <div className="text-[11px] text-slate-500 font-medium">
            多语种当地化及痛点攻防赋能
          </div>
        </div>
      </div>

      {/* Charts / Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Destination Countries */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-blue-600" />
            <span>全球主要出口目的国分布 Top 5</span>
          </h3>

          <div className="space-y-3 pt-2">
            {topCountries.map(([country, count], idx) => {
              const pct = Math.round((count / records.length) * 100);
              return (
                <div key={country} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>{idx + 1}. {country}</span>
                    <span className="text-slate-900 font-extrabold">{count} 笔提单 ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Industry Categories */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>客户行业分布 Top 5</span>
          </h3>

          <div className="space-y-3 pt-2">
            {topIndustries.map(([industry, count], idx) => {
              const pct = Math.round((count / customers.length) * 100);
              return (
                <div key={industry} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>{idx + 1}. {industry}</span>
                    <span className="text-slate-900 font-extrabold">{count} 家客户 ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
