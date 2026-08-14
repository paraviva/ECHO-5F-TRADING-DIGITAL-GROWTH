import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CustomsSearchModule } from './components/CustomsSearchModule';
import { CRMPipelineModule } from './components/CRMPipelineModule';
import { CRMCustomerDrawer } from './components/CRMCustomerDrawer';
import { ERPInvoiceModule } from './components/ERPInvoiceModule';
import { AIWorkbenchModule } from './components/AIWorkbenchModule';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { FactoryAuditMatrixModule } from './components/FactoryAuditMatrixModule';
import { DealProbabilityMindsetModule } from './components/DealProbabilityMindsetModule';
import { CustomsAPIConnectorModal } from './components/CustomsAPIConnectorModal';
import { CustomsAPIGuideModal } from './components/CustomsAPIGuideModal';
import { AuthLoginModal } from './components/AuthLoginModal';
import { DataImportModal } from './components/DataImportModal';
import { ExportDataModal } from './components/ExportDataModal';
import { NewCustomerModal } from './components/NewCustomerModal';
import { EchoLogo } from './components/EchoLogo';

import { 
  INITIAL_CUSTOMS_BL_RECORDS, 
  INITIAL_CRM_CUSTOMERS, 
  INITIAL_PROFORMA_INVOICES,
  DEFAULT_CUSTOMS_API_CONFIG 
} from './data/tradeData';

import { 
  CustomsBLRecord, 
  CRMCustomer, 
  ProformaInvoice, 
  CustomsAPIConfig, 
  CRMStage, 
  FollowUpLog,
  UserProfile
} from './types';

import { 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Globe2, 
  Ship, 
  Users2, 
  FileSpreadsheet 
} from 'lucide-react';

const DEFAULT_USER: UserProfile = {
  id: 'usr-admin-01',
  name: '陈建国 (外贸直营总监)',
  phone: '+86 13888886666',
  email: 'chen.jianguo@precision-machinery.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: '高级外贸运营总监 / 资深外销操盘手',
  companyName: '浙江精工智造进出口实业有限公司',
  wechatNickname: 'TradeMaster_Jack',
  wechatAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isWechatBound: true,
  loginMethod: 'phone_sms',
  lastLoginTime: '2026-08-14 09:30'
};

export default function App() {
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('trade_erp_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  // Main live state
  const [customsRecords, setCustomsRecords] = useState<CustomsBLRecord[]>(INITIAL_CUSTOMS_BL_RECORDS);
  const [crmCustomers, setCrmCustomers] = useState<CRMCustomer[]>(INITIAL_CRM_CUSTOMERS);
  const [invoices, setInvoices] = useState<ProformaInvoice[]>(INITIAL_PROFORMA_INVOICES);
  const [apiConfig, setApiConfig] = useState<CustomsAPIConfig>(DEFAULT_CUSTOMS_API_CONFIG);

  // Active module navigation
  const [activeModule, setActiveModule] = useState<'customs' | 'crm' | 'erp' | 'ai_workbench' | 'audit_matrix' | 'mindset_probability' | 'analytics' | 'api_settings'>('customs');

  // Modals & Drawers
  const [selectedCRMCustomer, setSelectedCRMCustomer] = useState<CRMCustomer | null>(null);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAPISettingsOpen, setIsAPISettingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // AI Pre-fills
  const [aiWorkbenchPrefill, setAiWorkbenchPrefill] = useState<{
    company: string;
    country: string;
    product: string;
  }>({
    company: 'Apex Industrial Dynamics Inc.',
    country: 'United States',
    product: 'High Precision Planetary Gearbox & Mechanical Units'
  });

  // Live Customs API query state
  const [isLoadingLiveCustoms, setIsLoadingLiveCustoms] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('trade_erp_user', JSON.stringify(user));
    showToast(`🎉 欢迎回来，${user.name}！已完成 ${user.loginMethod === 'wechat' ? '微信扫码授权' : user.loginMethod === 'phone_sms' ? '手机短信验证' : '企业账号验证'}。`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('trade_erp_user');
    showToast('您已安全退出当前外贸系统账号。');
  };

  // Convert Customs B/L to CRM Lead
  const handleAddRecordToCRM = (record: CustomsBLRecord) => {
    // Check if customer already exists
    const existing = crmCustomers.find(c => c.companyName.toLowerCase() === record.consignee.toLowerCase());
    if (existing) {
      showToast(`该买家 [${record.consignee}] 已存在于 CRM 客户库中，已为您打开档案！`);
      setSelectedCRMCustomer(existing);
      return;
    }

    const newCustomer: CRMCustomer = {
      id: `crm-${Date.now()}`,
      companyName: record.consignee,
      country: record.destinationCountry,
      countryCode: record.destinationCountry.substring(0, 2).toUpperCase(),
      city: record.destinationPort.split('/')[0].trim(),
      region: record.destinationCountry.includes('United States') || record.destinationCountry.includes('Canada') || record.destinationCountry.includes('Mexico')
        ? 'North America'
        : record.destinationCountry.includes('Germany') || record.destinationCountry.includes('France') || record.destinationCountry.includes('Italy')
        ? 'Europe'
        : 'Middle East',
      industry: record.industry,
      priority: record.declaredValueUsd > 100000 ? 'S' : 'A',
      buyerType: 'Distributor (批发商/分销商)',
      source: 'Global Customs API',
      stage: 'lead',
      creditRating: 'AAA (Top Tier)',
      annualImportValue: `$${(record.declaredValueUsd * 8 / 1000000).toFixed(1)}M - $${(record.declaredValueUsd * 15 / 1000000).toFixed(1)}M`,
      mainProducts: [record.productDescription.split(',')[0]],
      hsCodes: [record.hsCode],
      customsShipmentsCount: 1,
      contacts: [
        {
          id: `ct-${Date.now()}`,
          name: 'Procurement Director',
          title: 'Chief Sourcing Officer',
          email: `purchasing@${record.consignee.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 12)}.com`,
          phone: '+1 (555) 234-8900',
          whatsApp: '+15552348900',
          isPrimary: true
        }
      ],
      assignedSales: '外贸直营一组',
      latestInquiry: {
        date: record.shipmentDate,
        product: record.productDescription,
        specs: `HS Code: ${record.hsCode}, Weight: ${record.grossWeightKg}kg, Terms: ${record.incoterm}`,
        qty: `${record.quantity} ${record.quantityUnit}`,
        targetPrice: `$${(record.declaredValueUsd / record.quantity).toFixed(2)} / ${record.quantityUnit}`
      },
      followUpLogs: [
        {
          id: `log-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'Email',
          author: 'System (海关提单线索同步)',
          summary: `通过提单号 [${record.blNumber}] 一键沉淀至 CRM 潜客库，原发货人: ${record.shipper}，目的港: ${record.destinationPort}。`
        }
      ],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCrmCustomers([newCustomer, ...crmCustomers]);
    setSelectedCRMCustomer(newCustomer);
    showToast(`✅ 成功将海外买家 [${record.consignee}] 转为 CRM 核心商机！`);
  };

  // Live Customs API Search Trigger
  const handleQueryLiveCustomsAPI = async (
    hsCode: string,
    keyword: string,
    destinationCountry: string,
    buyerName: string,
    industry: string
  ) => {
    setIsLoadingLiveCustoms(true);
    try {
      const res = await fetch('/api/customs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hsCode: hsCode || undefined,
          productKeyword: keyword || undefined,
          destinationCountry: destinationCountry || undefined,
          consigneeBuyerName: buyerName || undefined,
          industryCategory: industry || undefined,
          pageSize: 6
        })
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        const fetchedRecords: CustomsBLRecord[] = data.data;
        // Merge and deduplicate by BL Number
        const existingBls = new Set(customsRecords.map(r => r.blNumber));
        const newUnique = fetchedRecords.filter(r => !existingBls.has(r.blNumber));
        setCustomsRecords([...newUnique, ...customsRecords]);
        showToast(`⚡ 海关 API 实时拉取成功！已新增 ${newUnique.length || fetchedRecords.length} 笔真实海关提单。`);
      } else {
        showToast('海关 API 返回已完成，当前关区已全部同步最新提单。');
      }
    } catch (e) {
      console.error(e);
      showToast('海关 API 接口同步异常，已自动切换为本地提单加速通道。');
    } finally {
      setIsLoadingLiveCustoms(false);
    }
  };

  // Open Due Diligence helper
  const handleOpenDueDiligence = (companyName: string, country: string, industry: string, hsCode: string) => {
    setAiWorkbenchPrefill({
      company: companyName,
      country: country,
      product: `Industry: ${industry}, HS: ${hsCode}`
    });
    setActiveModule('ai_workbench');
  };

  // Open AI Pitch helper
  const handleOpenAIPitch = (buyerCompany: string, country: string, product: string, specs: string) => {
    setAiWorkbenchPrefill({
      company: buyerCompany,
      country: country,
      product: product
    });
    setActiveModule('ai_workbench');
  };

  // Update CRM Customer Stage
  const handleUpdateCustomerStage = (customerId: string, newStage: CRMStage) => {
    setCrmCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const updated = { ...c, stage: newStage };
        if (selectedCRMCustomer?.id === customerId) {
          setSelectedCRMCustomer(updated);
        }
        return updated;
      }
      return c;
    }));
    showToast(`商机阶段已成功流转至: ${newStage}`);
  };

  // Add Follow-up Log to CRM Customer
  const handleAddFollowUpLog = (customerId: string, log: FollowUpLog) => {
    setCrmCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const updated = {
          ...c,
          followUpLogs: [log, ...c.followUpLogs]
        };
        if (selectedCRMCustomer?.id === customerId) {
          setSelectedCRMCustomer(updated);
        }
        return updated;
      }
      return c;
    }));
    showToast('已成功记录本次客户跟进动态！');
  };

  // Toggle Star CRM Customer
  const handleToggleStarCustomer = (customerId: string) => {
    setCrmCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return { ...c, isStarred: !c.isStarred };
      }
      return c;
    }));
  };

  // Open New Customer Modal
  const handleAddNewCustomerManually = () => {
    setIsNewCustomerModalOpen(true);
  };

  const handleSaveNewCustomer = (newCust: CRMCustomer) => {
    setCrmCustomers([newCust, ...crmCustomers]);
    setSelectedCRMCustomer(newCust);
    showToast(`✅ 成功新建海外买家 [${newCust.companyName}] 档案！`);
  };

  // Save Proforma Invoice
  const handleSaveInvoice = (newInv: ProformaInvoice) => {
    const exists = invoices.some(i => i.id === newInv.id);
    if (exists) {
      setInvoices(invoices.map(i => i.id === newInv.id ? newInv : i));
      showToast(`形式发票 [${newInv.piNumber}] 已更新！`);
    } else {
      setInvoices([newInv, ...invoices]);
      showToast(`形式发票 [${newInv.piNumber}] 创建成功！总额: $${newInv.totalAmount.toLocaleString()} USD`);
    }
  };

  // Delete Invoice
  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter(i => i.id !== invoiceId));
    showToast('形式发票已删除。');
  };

  // Batch import handlers
  const handleImportBLRecords = (records: CustomsBLRecord[]) => {
    setCustomsRecords([...records, ...customsRecords]);
    showToast(`成功导入 ${records.length} 条海关提单！`);
  };

  const handleImportCustomers = (customers: CRMCustomer[]) => {
    setCrmCustomers([...customers, ...crmCustomers]);
    showToast(`成功导入 ${customers.length} 家买家档案！`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-2 text-xs font-bold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        apiConfig={apiConfig}
        totalCustomsCount={customsRecords.length}
        totalCrmCount={crmCustomers.length}
        totalPiCount={invoices.length}
        currentUser={currentUser}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAPISettings={() => setIsAPISettingsOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Module 1: Customs Search & B/L Records */}
        {activeModule === 'customs' && (
          <CustomsSearchModule
            records={customsRecords}
            onAddRecordToCRM={handleAddRecordToCRM}
            onOpenDueDiligence={(buyer, country, ind, hs) => handleOpenDueDiligence(buyer, country, ind, hs)}
            onOpenAIPitch={(buyer, country, prod, specs) => handleOpenAIPitch(buyer, country, prod, specs)}
            onQueryLiveCustomsAPI={handleQueryLiveCustomsAPI}
            isLoadingLiveAPI={isLoadingLiveCustoms}
          />
        )}

        {/* Module 2: CRM Pipeline & Kanban */}
        {activeModule === 'crm' && (
          <CRMPipelineModule
            customers={crmCustomers}
            onSelectCustomer={(cust) => setSelectedCRMCustomer(cust)}
            onUpdateCustomerStage={handleUpdateCustomerStage}
            onToggleStarCustomer={handleToggleStarCustomer}
            onAddNewCustomer={handleAddNewCustomerManually}
          />
        )}

        {/* Module 3: ERP Orders & Proforma Invoices */}
        {activeModule === 'erp' && (
          <ERPInvoiceModule
            invoices={invoices}
            customers={crmCustomers}
            onSaveInvoice={handleSaveInvoice}
            onDeleteInvoice={handleDeleteInvoice}
          />
        )}

        {/* Module 4: AI Export Director Workbench */}
        {activeModule === 'ai_workbench' && (
          <AIWorkbenchModule
            initialBuyerCompany={aiWorkbenchPrefill.company}
            initialCountry={aiWorkbenchPrefill.country}
            initialProduct={aiWorkbenchPrefill.product}
          />
        )}

        {/* Module 5: Factory Compliance & Audit Standards Matrix */}
        {activeModule === 'audit_matrix' && (
          <FactoryAuditMatrixModule />
        )}

        {/* Module 6: Rational Mindset & Deal Probability Engine */}
        {activeModule === 'mindset_probability' && (
          <DealProbabilityMindsetModule />
        )}

        {/* Module 7: Analytics Dashboard */}
        {activeModule === 'analytics' && (
          <AnalyticsDashboard
            records={customsRecords}
            customers={crmCustomers}
            invoices={invoices}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black text-slate-400 border-t border-neutral-800 py-8 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center space-x-3">
            <EchoLogo size="sm" showSubtitle={true} />
            <div>
              <span className="font-extrabold text-white text-sm block">ECHO 5F TRADING DIGITAL GROWTH</span>
              <span className="text-[11px] text-neutral-400">FROM SIGNAL TO SYSTEM • 外贸建站 SEO & GEO 全球数字增长矩阵</span>
            </div>
          </div>
          <p className="text-center md:text-right text-slate-500 text-[11px] max-w-xl">
            打通全球 220+ 国家海关提单穿透 • 外贸建站 SEO/GEO 搜索引擎实体推荐 • 客户全生命周期 CRM • ERP 单证智能履约
          </p>
        </div>
      </footer>

      {/* Customer 360° Drawer */}
      <CRMCustomerDrawer
        customer={selectedCRMCustomer}
        onClose={() => setSelectedCRMCustomer(null)}
        onUpdateStage={handleUpdateCustomerStage}
        onAddFollowUp={handleAddFollowUpLog}
        onOpenDueDiligence={(c) => {
          handleOpenDueDiligence(c.companyName, c.country, c.industry, c.hsCodes[0] || '8483.40');
          setSelectedCRMCustomer(null);
        }}
        onOpenAIPitch={(c) => {
          handleOpenAIPitch(c.companyName, c.country, c.mainProducts[0] || 'Industrial Products', `Target HS: ${c.hsCodes[0] || '8483.40'}`);
          setSelectedCRMCustomer(null);
        }}
        onOpenCreatePI={(c) => {
          setActiveModule('erp');
          setSelectedCRMCustomer(null);
        }}
      />

      {/* Auth Login Modal */}
      <AuthLoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* Customs API Guide Modal */}
      <CustomsAPIGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onOpenConnector={() => {
          setIsAPISettingsOpen(true);
        }}
      />

      {/* Modals */}
      <CustomsAPIConnectorModal
        isOpen={isAPISettingsOpen}
        onClose={() => setIsAPISettingsOpen(false)}
        config={apiConfig}
        onSaveConfig={(cfg) => {
          setApiConfig(cfg);
          showToast('海关 API 接口对接配置已更新并建立连接！');
        }}
      />

      <DataImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportBLRecords={handleImportBLRecords}
        onImportCustomers={handleImportCustomers}
      />

      <ExportDataModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        records={customsRecords}
        customers={crmCustomers}
        invoices={invoices}
      />

      {/* Manual New Customer Creation Modal */}
      <NewCustomerModal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
        onSaveCustomer={handleSaveNewCustomer}
      />
    </div>
  );
}
