import React from 'react';
import { 
  X, 
  Globe2, 
  CheckCircle2, 
  ExternalLink, 
  BookOpen, 
  ShieldCheck, 
  Key, 
  Server, 
  Sparkles, 
  Layers, 
  HelpCircle,
  FileCode2,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

interface CustomsAPIGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConnector: () => void;
}

export const CustomsAPIGuideModal: React.FC<CustomsAPIGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenConnector
}) => {
  if (!isOpen) return null;

  const PROVIDERS = [
    {
      name: 'ImportYeti API (性价比之王 • 极低成本首选)',
      type: '全球外贸人公认最良心海关数据源 (以北美/全球水运提单为主)',
      coverage: '覆盖美国海关全量提单 (Sea Manifest) 及全球 100+ 万家进出口商真实上下游关系',
      features: [
        '按月订阅灵活无绑定，甚至提供大量免费基础查询额度',
        '真实提单 B/L 穿透、采购商-供应商网络图谱、品类 HS 解析',
        '标准 RESTful JSON API，开发者一分钟即可通过 Token 调通'
      ],
      pricing: '极具性价比：免费版可用基础功能；付费开发者 API 约 $49 ~ $199 / 月 (无需签署昂贵年约)',
      url: 'https://www.importyeti.com',
      applySteps: '直接在 ImportYeti 官网注册账号，在 Profile -> API 页面一键生成 API Key，即刻请求接口。',
      badge: '👑 性价比最高首选'
    },
    {
      name: 'UN Comtrade API (联合国官方免费全球贸易数据)',
      type: '联合国统计署官方进出口大数据 API (权威宏观品类流向)',
      coverage: '全球 200+ 国家与地区官方申报进出口宏观与 HS 6位编码统计',
      features: [
        '100% 官方权威真实数据，无商业中介溢价',
        '极适合分析目标国行业进口总量、价格均价走势与国别市场份额',
        '提供开放的 v1/v1.1 REST API 与 Python/R SDK'
      ],
      pricing: '完全免费 (提供基础免费 API 订阅密钥，每月数十万次免费调用额度)',
      url: 'https://comtradeplus.un.org',
      applySteps: '在 UN Comtrade 开发者门户 (UN Comtrade API Portal) 注册免费学术/商业开发者账号获取 Primary Key。',
      badge: '🆓 官方免费渠道'
    },
    {
      name: 'Trademo Global Trade API / ImportGenius',
      type: '中端商业级高频提单与合规数据源',
      coverage: '美洲、拉美 (巴西/阿根廷/智利/哥伦比亚)、印度、越南、俄罗斯等多国原始关单',
      features: ['海关提单实时解析与 HS 编码精准归类', '直接检索收发货人高管联系方式与邮箱域名', '标准 JSON REST API 接口，开箱即用'],
      pricing: '支持按月/按年订阅（API 开发者套餐约 $199 ~ $499 / 月）',
      url: 'https://www.trademo.com',
      applySteps: '在 Trademo 开发者门户申请 API Key，平台提供在线 Postman Collection 和即时测试控制台。',
      badge: '⚡ 灵活商用中端'
    },
    {
      name: '国内专业平台 (52wmb / 特易资讯 / 关务小二 / 易之家)',
      type: '国内主流关税/提单/企业社媒整合型服务商',
      coverage: '全球 80+ 国海关官方原始提单数据、企业穿透工商与社媒联系方式',
      features: ['适合国内制造业外贸工厂快速对接 ERP/CRM', '中文全字段支持、汇率自动换算与国内主流报关单转换', '提供易集成的 HTTP/JSON 接口规范'],
      pricing: '年费约 ¥6,000 ~ ¥30,000 不等（建议：可按单个特定关区/行业购买，或按 API 计次调用包谈判砍价 30%~50%）',
      url: 'https://www.52wmb.com',
      applySteps: '联系其商务经理开通 API 试用沙箱，建议以「分期/单关区按次」采购以最大化降低试错成本。',
      badge: '🇨🇳 国内本土化佳'
    },
    {
      name: '标普 S&P Global (Panjiva) / Descartes Datamyne',
      type: '跨国大集团与上市公司企业级旗舰数据源',
      coverage: '覆盖全球 190+ 国家与地区，深度覆盖美洲、欧洲、亚太海关提单与集装箱流向',
      features: ['提单 B/L 实时全要素 (Consignee, Shipper, HS, 重量, 货值)', '企业上下游供应链关系图谱穿透', 'RESTful API / Webhook 推送 / Snowflake 数据仓库同步'],
      pricing: '高昂企业级年费（通常为 $8,000 ~ $25,000 / 年，预算充足的大型工贸集团首选）',
      url: 'https://panjiva.com',
      applySteps: '在 S&P Global 官网申请 Enterprise Developer 试用账号，签署数据合规协议后获取 Client ID 与 Secret Key。',
      badge: '🏢 集团企业级'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">全球海关数据 API 获取渠道与对接指南</h3>
              <p className="text-xs text-slate-300">主流商业海关数据源、官方口岸接口、申请步骤与接入架构</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs">
          
          {/* Quick Overview Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-blue-900 font-extrabold text-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>什么是海关数据 API？如何为外贸企业赋能？</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              海关数据 (Customs Data / B/L Manifest Data) 源自各国海关、港务局及国际航运承运人的真实进出口提单与报关单据。
              通过标准 RESTful API 接入本系统后，您的外贸团队可以实现：
              <strong> 实时监控海外真实买家采购周期</strong>、<strong> 穿透买家的原供货商与离岸成交价</strong>、<strong> 自动化同步商机至 CRM 客户库</strong>。
            </p>
          </div>

          {/* Provider List */}
          <div className="space-y-4">
            <h4 className="font-black text-slate-900 text-sm flex items-center space-x-2">
              <Server className="w-4 h-4 text-blue-600" />
              <span>主流可接入的海关数据 API 服务商与渠道</span>
            </h4>

            <div className="space-y-4">
              {PROVIDERS.map((provider, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs hover:border-blue-400 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h5 className="font-black text-slate-900 text-sm">{provider.name}</h5>
                      {provider.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                          {provider.badge}
                        </span>
                      )}
                    </div>
                    <a
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 underline"
                    >
                      <span>访问服务官网</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-500 block mb-1">🌍 数据关区覆盖:</span>
                      <p className="text-slate-700 font-medium">{provider.coverage}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 block mb-1">🔑 申请与接入方式:</span>
                      <p className="text-slate-700 font-medium">{provider.applySteps}</p>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 block mb-1">✨ 核心接口能力:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {provider.features.map((f, fIdx) => (
                        <span key={fIdx} className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{f}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Steps in this System */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 font-black text-sm text-emerald-400">
              <Key className="w-4 h-4" />
              <span>在本系统中完成对接只需 3 步：</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-blue-400 font-black text-sm block mb-1">01. 获取凭证</span>
                <p className="text-slate-300">联系上述任意数据服务商，获取专属的 API Endpoint 网关与 API Key / Bearer Token。</p>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-blue-400 font-black text-sm block mb-1">02. 填写配置</span>
                <p className="text-slate-300">点击系统右上角「设置」图标或下方按钮，填入 Endpoint 与 Key 并选择环境。</p>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-blue-400 font-black text-sm block mb-1">03. 实时查询</span>
                <p className="text-slate-300">在海关提单智搜模块输入 HS 编码或货品关键词，系统自动调取实时提单并一键入库 CRM。</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>数据请求遵循国际海关公开数据标准与 GDPR/CCPA 贸易信息合规要求</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 transition-colors cursor-pointer text-xs"
            >
              关闭指南
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenConnector();
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer text-xs flex items-center space-x-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>打开 API 对接配置面板</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
