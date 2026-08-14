export type IndustryCategory = 
  | '机械五金与工业设备' 
  | '电子电器与数码' 
  | '汽车摩托车配件' 
  | '光伏新能源与储能' 
  | '纺织服装与面料' 
  | '智能家居与建材家具' 
  | '医疗器械与防护耗材' 
  | '化工原料与塑料橡胶' 
  | '食品饮料与农产品' 
  | '包装印刷与办公用品'
  | '通用外贸品类';

export type BuyerType = 
  | 'Distributor (批发商/分销商)' 
  | 'OEM Manufacturer (品牌制造商)' 
  | 'Importer / Wholesaler (进口总代)' 
  | 'Retail Chain / Supermarket (商超连锁)' 
  | 'Engineering Contractor (工程采购商)' 
  | 'Trading Company (国际贸易商)';

export type CRMStage = 
  | 'lead'           // 潜在海关线索
  | 'contacted'      // 首次建联触达
  | 'rfq_quoting'    // 询盘与报盘阶段
  | 'sample'         // 样品寄送/测试
  | 'won_contract'   // 签约与定金到账
  | 'vip_reorder';   // 长期翻单/VIP客群

export type LeadPriority = 'S' | 'A' | 'B' | 'C';

export interface FollowUpLog {
  id: string;
  date: string;
  type: 'Email' | 'WhatsApp' | 'Phone Call' | 'Quotation / PI' | 'Sample Sent' | 'Video Conference' | 'System Note';
  author: string;
  summary: string;
  nextFollowUpDate?: string;
}

export interface CustomerContact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  whatsApp?: string;
  isPrimary?: boolean;
}

export interface CRMCustomer {
  id: string;
  companyName: string;
  country: string;
  countryCode: string;
  city?: string;
  region: 'Europe' | 'North America' | 'Middle East' | 'Asia-Pacific' | 'Latin America' | 'Africa';
  industry: IndustryCategory;
  hsCodes: string[];
  mainProducts: string[];
  stage: CRMStage;
  priority: LeadPriority;
  buyerType: BuyerType;
  annualImportValue: string;
  assignedSales: string;
  source: 'Global Customs API' | 'B/L Intelligence' | 'Official Website RFQ' | 'Exhibition' | 'Manual Import' | 'EDI Data Sync';
  website?: string;
  emailDomain?: string;
  contacts: CustomerContact[];
  latestInquiry?: {
    date: string;
    product: string;
    qty: string;
    targetPrice: string;
    specs: string;
  };
  customsShipmentsCount: number;
  lastShipmentDate?: string;
  creditRating: 'AAA (Top Tier)' | 'AA (Reliable)' | 'A (Standard)' | 'B (Monitor)';
  followUpLogs: FollowUpLog[];
  isStarred?: boolean;
  notes?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  role: string;
  companyName: string;
  wechatNickname?: string;
  wechatAvatar?: string;
  isWechatBound: boolean;
  loginMethod: 'wechat' | 'phone_sms' | 'password';
  lastLoginTime: string;
}

export interface CustomsBLRecord {
  id: string;
  blNumber: string; // 提单号 (Bill of Lading No.)
  shipmentDate: string;
  consignee: string; // 买家/收货人
  shipper: string; // 原供货商/发货人
  notifyParty?: string;
  originCountry: string;
  destinationCountry: string;
  destinationPort: string;
  loadingPort: string;
  hsCode: string;
  productDescription: string;
  industry: IndustryCategory;
  grossWeightKg: number;
  quantity: number;
  quantityUnit: string;
  declaredValueUsd: number;
  containerNumber?: string;
  teu: number; // 集装箱标准箱量
  incoterm: 'FOB' | 'CIF' | 'CFR' | 'DDP' | 'EXW';
  carrierName?: string;
  isMatchedToCRM?: boolean;
}

export interface InvoiceItem {
  id: string;
  productName: string;
  itemModel: string;
  hsCode: string;
  specs: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface ProformaInvoice {
  id: string;
  piNumber: string; // e.g. PI-2026-0814
  date: string;
  validUntil: string;
  customerId: string;
  customerName: string;
  country: string;
  buyerAddress: string;
  buyerContact: string;
  buyerEmail: string;
  sellerCompany: string;
  sellerBankDetails: string;
  incoterm: 'FOB' | 'CIF' | 'CFR' | 'DDP' | 'EXW';
  portOfLoading: string;
  portOfDestination: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'CNY';
  items: InvoiceItem[];
  subtotal: number;
  freightCost: number;
  insuranceCost: number;
  totalAmount: number;
  paymentTerms: string;
  leadTimeDays: number;
  status: 'Draft' | 'Sent to Buyer' | 'Confirmed' | 'Deposit Received' | 'In Production' | 'Shipped' | 'Completed';
  notes: string;
}

export interface CustomsAPIConfig {
  providerName: string;
  endpointUrl: string;
  apiKey: string;
  environment: 'Live Production' | 'Sandbox';
  isConnected: boolean;
  lastSyncTime: string;
  totalQueriesRemaining: number;
  autoSyncInterval: string;
  syncHSCodeFilters: string[];
}

export interface BuyerDueDiligence {
  companyName: string;
  country: string;
  creditScore: number;
  financialRiskLevel: 'Low' | 'Medium' | 'High';
  customsImportTrend: string;
  mainSupplyingCountries: string[];
  estimatedAnnualPurchasingBudget: string;
  keyDecisionMakerProfile: string;
  priceSensitivity: 'High (Price Driven)' | 'Medium (Value Driven)' | 'Low (Quality/Brand Driven)';
  recommendedPaymentTerms: string;
  strategicPitchAdvice: string[];
  fraudWarningOrRiskPoints: string[];
}

export interface AIPitchResult {
  subjectLine: string;
  emailBody: string;
  whatsAppMessage: string;
  keySellingPoints: string[];
  objectionHandlingTip: string;
  suggestedFobQuoteRange: string;
}

// ----------------------------------------------------
// ECHO 5F Rational Mindset & Deal Probability Algorithm Types
// ----------------------------------------------------

export interface RationalMindsetQuote {
  id: string;
  quote: string;
  authorOrSchool: string;
  applicationContext: '0-1搭建期迷茫' | '频繁被拒/无回复' | '团队士气低迷' | '大单谈判焦虑' | '交付与客诉危机' | '放弃的勇气与及时止损' | '道法自然与顺其自然';
  corePrinciple: string;
}

export type AuditCategory = 
  | '社会责任与人权验厂 (Social & Human Rights)'
  | '质量管理与制造体系 (Quality & Manufacturing)'
  | '环境安全与碳足迹 (Environmental & ESG)'
  | '行业专项与安全准入 (Industry Specific & Safety)'
  | '反恐与供应链安全 (C-TPAT / Security)';

export interface FactoryAuditStandard {
  code: string; // e.g. BSCI, IATF 16949, FDA, CE
  name: string;
  category: AuditCategory;
  applicableIndustries: IndustryCategory[];
  keyRegions: string[]; // e.g. 'EU', 'North America', 'Global'
  authorityOrOrg: string;
  passThreshold: string;
  auditCycleMonths: number;
  coreAuditCheckpoints: string[];
  importanceLevel: 'Mandatory (准入红线)' | 'High Priority (核心加分项)' | 'Recommended (增信备选)';
  typicalCostRangeUsd: string;
}

export interface DealProbabilityFactors {
  // W1: 海关与需求真实性 (Customs & Signal Match)
  customsDemandScore: number; // 0-100
  // W2: 工厂资质与验厂准入契合度 (Audit & Factory Match)
  factoryAuditMatchScore: number; // 0-100
  // W3: 商业条款、价格与交期竞争力 (Commercial & Price Match)
  commercialTermsScore: number; // 0-100
  // W4: 交互响应速度与专业度 (Response Velocity)
  interactionVelocityScore: number; // 0-100
  // Dynamic Variables (政策、汇率、运费波动、样品认可)
  macroVariableAdjustment: number; // -20 to +20
}

export interface DealProbabilityCalculationResult {
  probabilityPercent: number; // 0-100%
  grade: 'S (高确定性赢单 >85%)' | 'A (高胜率推进 70-84%)' | 'B (谈判博弈期 50-69%)' | 'C (高风险/缺口大 <50%)';
  formulaBreakdown: {
    w1_customs: { weight: number; score: number; contribution: number };
    w2_audit: { weight: number; score: number; contribution: number };
    w3_commercial: { weight: number; score: number; contribution: number };
    w4_velocity: { weight: number; score: number; contribution: number };
    epsilon_variable: number;
  };
  keyBottlenecks: string[];
  actionableStepsToIncreaseWinRate: string[];
}

export interface FactoryBuyerMatchReport {
  overallMatchScore: number; // 0-100
  status: 'Ready to Quote (完全匹配)' | 'Minor Gaps (整改可投)' | 'High Risk (资质受阻)';
  matchedAudits: string[];
  missingMandatoryAudits: string[];
  recommendedImprovements: string[];
  factoryReadinessLevel: 'Tier 1 Top Exporter' | 'Tier 2 Qualified OEM' | 'Tier 3 Basic Domestic';
}

