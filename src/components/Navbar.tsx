import React, { useState } from 'react';
import { 
  Globe2, 
  Ship, 
  Users2, 
  FileSpreadsheet, 
  Sparkles, 
  BarChart3, 
  Settings2, 
  UploadCloud, 
  DownloadCloud, 
  CheckCircle2, 
  Layers, 
  Search,
  ShieldCheck,
  User,
  QrCode,
  Smartphone,
  BookOpen,
  LogOut,
  ChevronDown,
  BrainCircuit,
  Calculator,
  Award
} from 'lucide-react';
import { CustomsAPIConfig, UserProfile } from '../types';
import { EchoLogo } from './EchoLogo';
import { RATIONAL_MINDSET_QUOTES } from '../data/auditAndMindsetData';

interface NavbarProps {
  activeModule: 'customs' | 'crm' | 'erp' | 'ai_workbench' | 'audit_matrix' | 'mindset_probability' | 'analytics' | 'api_settings';
  setActiveModule: (module: 'customs' | 'crm' | 'erp' | 'ai_workbench' | 'audit_matrix' | 'mindset_probability' | 'analytics' | 'api_settings') => void;
  apiConfig: CustomsAPIConfig;
  totalCustomsCount: number;
  totalCrmCount: number;
  totalPiCount: number;
  currentUser: UserProfile | null;
  onOpenImport: () => void;
  onOpenExport: () => void;
  onOpenAPISettings: () => void;
  onOpenAuthModal: () => void;
  onOpenGuideModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeModule,
  setActiveModule,
  apiConfig,
  totalCustomsCount,
  totalCrmCount,
  totalPiCount,
  currentUser,
  onOpenImport,
  onOpenExport,
  onOpenAPISettings,
  onOpenAuthModal,
  onOpenGuideModal,
  onLogout
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [randomQuoteIndex] = useState(() => Math.floor(Math.random() * RATIONAL_MINDSET_QUOTES.length));
  const currentQuote = RATIONAL_MINDSET_QUOTES[randomQuoteIndex] || RATIONAL_MINDSET_QUOTES[0];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      {/* Top Banner / Status Bar */}
      <div className="bg-slate-950 px-4 sm:px-6 py-1.5 border-b border-slate-800/80 text-[11px] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold">海关数据 API:</span>
            <span className="text-slate-300">{apiConfig.providerName.split(' ')[0]}</span>
          </div>

          <span className="text-slate-700 hidden md:inline">|</span>

          {/* Rational Mindset Dynamic Snippet */}
          <div 
            onClick={() => setActiveModule('mindset_probability')}
            className="hidden xl:flex items-center gap-1.5 text-cyan-300 hover:text-white cursor-pointer font-medium truncate max-w-md group transition-colors"
            title="点击进入外贸理性心法与赢单概率公式"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-400 font-mono text-[10px] uppercase font-bold shrink-0">ECHO 5F 理性心法:</span>
            <span className="truncate text-slate-300 group-hover:text-white text-[11px]">“{currentQuote.quote}”</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-slate-400">
          <button
            onClick={() => setActiveModule('mindset_probability')}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer transition-colors bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 text-[11px]"
          >
            <Calculator className="w-3 h-3" />
            <span>P(Win) 赢单概率测算</span>
          </button>

          <button
            onClick={() => setActiveModule('audit_matrix')}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer transition-colors text-[11px]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>验厂标准与资质自测</span>
          </button>

          <span className="text-slate-700">•</span>

          <button 
            onClick={onOpenGuideModal}
            className="hover:text-amber-300 text-amber-400/90 transition-colors flex items-center gap-1 font-bold cursor-pointer text-[11px]"
            title="查看海关数据 API 获取渠道与服务商指南"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">API 指南</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <EchoLogo size="md" showSubtitle={true} />
            <div className="hidden sm:block">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm md:text-base font-black tracking-tight text-white whitespace-nowrap">
                  ECHO 5F TRADING DIGITAL GROWTH
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500/20 text-cyan-300 border border-blue-500/30 whitespace-nowrap">
                  SEO • GEO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden xl:block whitespace-nowrap">
                外贸建站 SEO & GEO 数字增长 • 全球海关智搜 • 客户 CRM • ERP 单证
              </p>
            </div>
          </div>

          {/* Module Navigation Tabs (Desktop & Wide Screen) */}
          <nav className="hidden xl:flex items-center space-x-1 bg-slate-950/70 p-1 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveModule('customs')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeModule === 'customs'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Ship className="w-3.5 h-3.5" />
              <span>海关提单智搜</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {totalCustomsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveModule('crm')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeModule === 'crm'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users2 className="w-3.5 h-3.5" />
              <span>CRM 客户看板</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {totalCrmCount}
              </span>
            </button>

            <button
              onClick={() => setActiveModule('erp')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeModule === 'erp'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>ERP 单证</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {totalPiCount}
              </span>
            </button>

            <button
              onClick={() => setActiveModule('ai_workbench')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeModule === 'ai_workbench'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-black'
                  : 'text-cyan-300 hover:text-cyan-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>AI 工作台</span>
            </button>

            <button
              onClick={() => setActiveModule('audit_matrix')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeModule === 'audit_matrix'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-300 hover:text-emerald-200 hover:bg-slate-800/60'
              }`}
              title="全球全行业外贸验厂与检测标准自测"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>验厂与资质</span>
            </button>

            <button
              onClick={() => setActiveModule('mindset_probability')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeModule === 'mindset_probability'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md'
                  : 'text-amber-300 hover:text-amber-200 hover:bg-slate-800/60'
              }`}
              title="从0到1理性激励心法与赢单概率算法公式"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>理智心法&赢单</span>
            </button>

            <button
              onClick={() => setActiveModule('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeModule === 'analytics'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>大盘看板</span>
            </button>
          </nav>

          {/* Quick Action Buttons & User Profile */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onOpenImport}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
              title="支持批量导入真实 Excel/CSV 提单数据或自有客户线索"
            >
              <UploadCloud className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="hidden md:inline">导入数据</span>
            </button>

            <button
              onClick={onOpenExport}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
            >
              <DownloadCloud className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="hidden md:inline">导出 Excel</span>
            </button>

            {/* User Account Login / Profile Indicator */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-400"
                  />
                  <div className="text-left hidden xl:block">
                    <p className="text-[11px] font-extrabold leading-tight">{currentUser.name.split(' ')[0]}</p>
                    <p className="text-[9px] text-slate-400 leading-none">{currentUser.role.split('/')[0]}</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-fadeIn text-xs">
                    <div className="px-4 pb-3 border-b border-slate-100">
                      <p className="font-extrabold text-sm text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{currentUser.companyName}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        {currentUser.isWechatBound && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <QrCode className="w-2.5 h-2.5" />
                            <span>微信已绑定</span>
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                          <Smartphone className="w-2.5 h-2.5" />
                          <span>{currentUser.phone.substring(0, 7)}****</span>
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenAuthModal();
                        }}
                        className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2 font-bold cursor-pointer"
                      >
                        <User className="w-4 h-4 text-blue-600" />
                        <span>切换账号 / 重新登录</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenGuideModal();
                        }}
                        className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2 font-bold cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4 text-amber-500" />
                        <span>海关数据 API 获取指南</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 font-bold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>退出当前账号</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white rounded-xl text-xs font-extrabold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>登录 / 绑定</span>
              </button>
            )}

            <button
              onClick={onOpenAPISettings}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="海关数据源与 API 对接"
            >
              <Settings2 className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Responsive Navigation Row for Tablet & Mobile (< xl) */}
        <div className="xl:hidden flex items-center space-x-2 py-2 overflow-x-auto no-scrollbar border-t border-slate-800">
          <button
            onClick={() => setActiveModule('customs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer shrink-0 ${
              activeModule === 'customs' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            海关提单 ({totalCustomsCount})
          </button>
          <button
            onClick={() => setActiveModule('crm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer shrink-0 ${
              activeModule === 'crm' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            外贸 CRM ({totalCrmCount})
          </button>
          <button
            onClick={() => setActiveModule('erp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer shrink-0 ${
              activeModule === 'erp' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ERP 订单/PI ({totalPiCount})
          </button>
          <button
            onClick={() => setActiveModule('ai_workbench')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer shrink-0 ${
              activeModule === 'ai_workbench' ? 'bg-cyan-500 text-slate-950 font-black shadow-sm' : 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
            }`}
          >
            AI 增长工作台
          </button>
          <button
            onClick={() => setActiveModule('audit_matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer shrink-0 ${
              activeModule === 'audit_matrix' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
            }`}
          >
            验厂与资质测评
          </button>
          <button
            onClick={() => setActiveModule('mindset_probability')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer shrink-0 ${
              activeModule === 'mindset_probability' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
            }`}
          >
            理智心法&赢单公式
          </button>
          <button
            onClick={() => setActiveModule('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer shrink-0 ${
              activeModule === 'analytics' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            大盘看板
          </button>
        </div>
      </div>
    </header>
  );
};
