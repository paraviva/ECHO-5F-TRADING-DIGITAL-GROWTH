import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Globe2, 
  Mail, 
  Phone, 
  User, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  FileText, 
  Layers,
  Sparkles
} from 'lucide-react';
import { CRMCustomer, CRMStage, BuyerType, LeadPriority, IndustryCategory } from '../types';
import { INDUSTRY_CATEGORIES } from '../data/tradeData';

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomer: (customer: CRMCustomer) => void;
}

export const NewCustomerModal: React.FC<NewCustomerModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomer
}) => {
  if (!isOpen) return null;

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('United States');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState<'North America' | 'Europe' | 'Middle East' | 'Asia-Pacific' | 'Latin America' | 'Africa'>('North America');
  const [industry, setIndustry] = useState<IndustryCategory>('机械五金与工业设备');
  const [priority, setPriority] = useState<LeadPriority>('A');
  const [buyerType, setBuyerType] = useState<BuyerType>('Distributor (批发商/分销商)');
  const [creditRating, setCreditRating] = useState<'AAA (Top Tier)' | 'AA (Reliable)' | 'A (Standard)' | 'B (Monitor)'>('AA (Reliable)');
  const [annualImportValue, setAnnualImportValue] = useState('$1,000,000 - $3,000,000');
  const [mainProducts, setMainProducts] = useState('');
  const [hsCodes, setHsCodes] = useState('');
  const [assignedSales, setAssignedSales] = useState('外贸直营一组');
  const [source, setSource] = useState<'Manual Import' | 'Global Customs API' | 'Official Website RFQ' | 'Exhibition' | 'EDI Data Sync'>('Manual Import');
  const [website, setWebsite] = useState('');

  // Primary Contact state
  const [contactName, setContactName] = useState('');
  const [contactTitle, setContactTitle] = useState('Sourcing & Procurement Manager');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactWhatsApp, setContactWhatsApp] = useState('');

  // Initial Inquiry / Note
  const [initialInquiryProduct, setInitialInquiryProduct] = useState('');
  const [initialInquirySpecs, setInitialInquirySpecs] = useState('');
  const [initialNotes, setInitialNotes] = useState('线下展会/自主开发建联客户，已建档准备推进');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      alert('请填写客户公司名称！');
      return;
    }

    const newCustomer: CRMCustomer = {
      id: `crm-user-${Date.now()}`,
      companyName: companyName.trim(),
      country: country.trim(),
      countryCode: country.substring(0, 2).toUpperCase(),
      city: city.trim() || 'Headquarters',
      region: region,
      industry: industry,
      priority: priority,
      buyerType: buyerType,
      source: source,
      stage: 'lead',
      creditRating: creditRating,
      annualImportValue: annualImportValue || '$500,000 - $2,000,000',
      mainProducts: mainProducts ? mainProducts.split(/[,，]/).map(s => s.trim()).filter(Boolean) : ['Custom Industrial Products'],
      hsCodes: hsCodes ? hsCodes.split(/[,，]/).map(s => s.trim()).filter(Boolean) : ['8483.40'],
      assignedSales: assignedSales,
      website: website.trim() || undefined,
      customsShipmentsCount: 0,
      contacts: [
        {
          id: `ct-${Date.now()}`,
          name: contactName.trim() || 'Procurement Specialist',
          title: contactTitle.trim() || 'Procurement Manager',
          email: contactEmail.trim() || `info@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)}.com`,
          phone: contactPhone.trim() || '+1 (555) 019-2831',
          whatsApp: contactWhatsApp.trim() || contactPhone.trim() || '+15550192831',
          isPrimary: true
        }
      ],
      latestInquiry: initialInquiryProduct ? {
        date: new Date().toISOString().split('T')[0],
        product: initialInquiryProduct,
        specs: initialInquirySpecs || 'Standard Export Quality Specs',
        qty: '1,000 PCS',
        targetPrice: '$150.00 / PCS'
      } : undefined,
      followUpLogs: [
        {
          id: `log-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'Phone Call',
          author: assignedSales,
          summary: initialNotes || '自主录入新海外客户档案，开启全生命周期跟进'
        }
      ],
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSaveCustomer(newCustomer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">录入新客户档案 (New CRM Buyer)</h3>
              <p className="text-xs text-slate-300">手动录入海内外意向买家、展会线索、独立站询盘与采购决策人</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
          
          {/* Section 1: Company Profile */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>1. 客户企业基本信息 (Company Information)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  企业全称 (Company Name) <span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="例如: EuroTech Industrial Gearboxes GmbH"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">企业官方网址 (Website):</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.eurotech-gears.de"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">所属国家 (Country):</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="例如: Germany / United States"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">所在城市 / 港口 (City / Port):</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="例如: Hamburg / Frankfurt"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">所属大区 (Region):</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                >
                  <option value="North America">北美洲 (North America)</option>
                  <option value="Europe">欧洲 (Europe)</option>
                  <option value="Asia-Pacific">亚太地区 (Asia-Pacific)</option>
                  <option value="Middle East">中东与海湾 (Middle East)</option>
                  <option value="Latin America">拉丁美洲 (Latin America)</option>
                  <option value="Africa">非洲 (Africa)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">所属行业品类 (Industry):</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as IndustryCategory)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                >
                  {INDUSTRY_CATEGORIES.map(ind => (
                    <option key={ind.name} value={ind.name}>{ind.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">买家类型 (Buyer Type):</label>
                <select
                  value={buyerType}
                  onChange={(e) => setBuyerType(e.target.value as BuyerType)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                >
                  <option value="Distributor (批发商/分销商)">Distributor (批发商/分销商)</option>
                  <option value="OEM Manufacturer (品牌制造商)">OEM Manufacturer (品牌制造商)</option>
                  <option value="Importer / Wholesaler (进口总代)">Importer / Wholesaler (进口总代)</option>
                  <option value="Retail Chain / Supermarket (商超连锁)">Retail Chain / Supermarket (商超连锁)</option>
                  <option value="Engineering Contractor (工程采购商)">Engineering Contractor (工程采购商)</option>
                  <option value="Trading Company (国际贸易商)">Trading Company (国际贸易商)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">线索来源 (Lead Source):</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                >
                  <option value="Manual Import">自主开发 / 业务员录入</option>
                  <option value="Exhibition">国际线下展会 (广交会/汉诺威等)</option>
                  <option value="Official Website RFQ">官网询盘 / Google SEO</option>
                  <option value="Global Customs API">海关提单穿透</option>
                  <option value="EDI Data Sync">EDI 港口舱单数据</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">客户优先级与评级:</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as LeadPriority)}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                  >
                    <option value="S">S 级 (战略核心买家)</option>
                    <option value="A">A 级 (重点高潜客户)</option>
                    <option value="B">B 级 (标准采购商)</option>
                    <option value="C">C 级 (长尾观察户)</option>
                  </select>
                  <select
                    value={creditRating}
                    onChange={(e) => setCreditRating(e.target.value as any)}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                  >
                    <option value="AAA (Top Tier)">AAA (极佳信誉)</option>
                    <option value="AA (Reliable)">AA (可靠优质)</option>
                    <option value="A (Standard)">A (标准良好)</option>
                    <option value="B (Monitor)">B (需密切关注)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">预估年采购规模 (Annual Import):</label>
                <input
                  type="text"
                  value={annualImportValue}
                  onChange={(e) => setAnnualImportValue(e.target.value)}
                  placeholder="例如: $1,500,000 - $3,000,000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Primary Contact Person */}
          <div className="space-y-3 pt-2">
            <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>2. 采购决策人联系方式 (Key Procurement Contact)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">联系人姓名 (Name):</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="例如: Alexander Schmidt"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">职务职位 (Job Title):</label>
                <input
                  type="text"
                  value={contactTitle}
                  onChange={(e) => setContactTitle(e.target.value)}
                  placeholder="例如: VP of Global Sourcing"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">工作邮箱 (Work Email):</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="alexander@eurotech.de"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">办公电话 (Phone):</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+49 (30) 1234-5678"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp 账号 (带国码):</label>
                <input
                  type="text"
                  value={contactWhatsApp}
                  onChange={(e) => setContactWhatsApp(e.target.value)}
                  placeholder="+4917612345678"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">指定归属业务员 (Assigned Sales):</label>
                <input
                  type="text"
                  value={assignedSales}
                  onChange={(e) => setAssignedSales(e.target.value)}
                  placeholder="外贸直营一组 / 陈建国"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Products & Inquiry Specs */}
          <div className="space-y-3 pt-2">
            <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>3. 采购需求品类与首笔意向 (Inquiry & Products)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">主采购品类名称 (逗号分隔):</label>
                <input
                  type="text"
                  value={mainProducts}
                  onChange={(e) => setMainProducts(e.target.value)}
                  placeholder="例如: 行星减速机, 精密齿轮箱, 伺服马达"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">对应 HS 海关编码 (逗号分隔):</label>
                <input
                  type="text"
                  value={hsCodes}
                  onChange={(e) => setHsCodes(e.target.value)}
                  placeholder="例如: 8483.40, 8483.10"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">首条跟进沟通备注 (Initial Note):</label>
                <textarea
                  rows={2}
                  value={initialNotes}
                  onChange={(e) => setInitialNotes(e.target.value)}
                  placeholder="记录客户沟通背景、关键采购要求或下一步跟进计划..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>保存并建立客户档案</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
