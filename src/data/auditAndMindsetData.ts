import { FactoryAuditStandard, RationalMindsetQuote, DealProbabilityCalculationResult, DealProbabilityFactors } from '../types';

// =====================================================================
// 1. 全球全行业外贸验厂与国际检测标准权威数据库 (Factory Audit & Compliance Standards)
// =====================================================================
export const GLOBAL_FACTORY_AUDIT_STANDARDS: FactoryAuditStandard[] = [
  // --- 社会责任与人权验厂 ---
  {
    code: 'BSCI (amfori)',
    name: '欧洲商界社会责任倡议验厂 (Business Social Compliance Initiative)',
    category: '社会责任与人权验厂 (Social & Human Rights)',
    applicableIndustries: ['纺织服装与面料', '智能家居与建材家具', '电子电器与数码', '机械五金与工业设备', '通用外贸品类', '包装印刷与办公用品'],
    keyRegions: ['欧洲 (EU)', '全球主要进口商'],
    authorityOrOrg: 'amfori (欧洲对外贸易协会) 授权第三方 (TUV / SGS / Intertek / BV)',
    passThreshold: '综合评级达到 A级 (Outstanding) 或 B/C级 (Acceptable)',
    auditCycleMonths: 24,
    coreAuditCheckpoints: [
      '工时与加班合规（禁止强迫超时劳动，考勤真实性）',
      '薪酬福利（最低工资标准、社会保险缴纳）',
      '职业健康与消防安全（消防栓、安全出口、劳保防护）',
      '禁止童工与未成年工保护',
      '环境保护与商业道德'
    ],
    importanceLevel: 'Mandatory (准入红线)',
    typicalCostRangeUsd: '$1,200 - $2,500'
  },
  {
    code: 'SEDEX (SMETA)',
    name: '供应商商业道德信息交流审核 (SEDEX Members Ethical Trade Audit)',
    category: '社会责任与人权验厂 (Social & Human Rights)',
    applicableIndustries: ['纺织服装与面料', '食品饮料与农产品', '智能家居与建材家具', '电子电器与数码', '通用外贸品类'],
    keyRegions: ['英国', '欧盟', '北美零售商'],
    authorityOrOrg: 'SEDEX 平台认可审核机构 (SMETA 2-Pillar / 4-Pillar)',
    passThreshold: '无严重不符合项 (Critical Issues)并在平台上完成整改闭环 (CAPR)',
    auditCycleMonths: 12,
    coreAuditCheckpoints: [
      '劳动标准 (Labor Standards)',
      '健康与安全 (Health & Safety)',
      '商业道德诚信 (Business Ethics, 4-Pillar适用)',
      '环境管理 (Environment, 4-Pillar适用)'
    ],
    importanceLevel: 'High Priority (核心加分项)',
    typicalCostRangeUsd: '$1,500 - $3,000'
  },
  {
    code: 'SA8000',
    name: '社会责任管理体系认证标准 (Social Accountability 8000)',
    category: '社会责任与人权验厂 (Social & Human Rights)',
    applicableIndustries: ['通用外贸品类', '机械五金与工业设备', '纺织服装与面料', '电子电器与数码'],
    keyRegions: ['全球跨国巨头采购商', '欧美政府招标采购'],
    authorityOrOrg: 'SAAS 认可认证机构',
    passThreshold: '现场审核无重大缺陷并获得正式证书',
    auditCycleMonths: 36,
    coreAuditCheckpoints: [
      '童工与强迫劳动控制机制',
      '健康与安全管理体系',
      '结社自由与集体谈判权',
      '歧视与惩戒措施规范',
      '管理体系持续改进'
    ],
    importanceLevel: 'High Priority (核心加分项)',
    typicalCostRangeUsd: '$3,500 - $6,000'
  },
  {
    code: 'Disney FAMA',
    name: '迪士尼生产授权许可验厂 (Facility and Merchandise Authorization)',
    category: '社会责任与人权验厂 (Social & Human Rights)',
    applicableIndustries: ['纺织服装与面料', '智能家居与建材家具', '包装印刷与办公用品', '通用外贸品类'],
    keyRegions: ['全球迪士尼授权商及衍生品买家'],
    authorityOrOrg: 'The Walt Disney Company 审核指定机构',
    passThreshold: '获得 FAMA 生产授权代码，无严重人权/安全红线违规',
    auditCycleMonths: 12,
    coreAuditCheckpoints: [
      '供应链人权标准 (ILS Minimum Compliance Standard)',
      '绝对禁止分包给未授权黑工厂',
      '完整消防演习记录与应急通道畅通'
    ],
    importanceLevel: 'Mandatory (准入红线)',
    typicalCostRangeUsd: '$1,800 - $3,200'
  },
  {
    code: 'Walmart SCS & RS',
    name: '沃尔玛供应链安全与人权双验厂 (Supply Chain Security & Responsible Sourcing)',
    category: '社会责任与人权验厂 (Social & Human Rights)',
    applicableIndustries: ['通用外贸品类', '智能家居与建材家具', '电子电器与数码', '食品饮料与农产品'],
    keyRegions: ['北美', '全球沃尔玛供应商体系'],
    authorityOrOrg: 'Walmart 供应商合规审核委员会',
    passThreshold: '绿灯 (Green) 或 黄灯 (Yellow) 准入，红灯直接拉黑',
    auditCycleMonths: 12,
    coreAuditCheckpoints: [
      '负责任采购 RS 人权标准与工资合规',
      'SCS 供应链反恐与物理仓储安防',
      '透明度政策（严禁双重考勤账本）'
    ],
    importanceLevel: 'Mandatory (准入红线)',
    typicalCostRangeUsd: '$2,000 - $4,000'
  },

  // --- 质量管理与制造体系 ---
  {
    code: 'ISO 9001:2015',
    name: '国际通用质量管理体系认证 (Quality Management System)',
    category: '质量管理与制造体系 (Quality & Manufacturing)',
    applicableIndustries: ['机械五金与工业设备', '电子电器与数码', '汽车摩托车配件', '光伏新能源与储能', '医疗器械与防护耗材', '化工原料与塑料橡胶', '包装印刷与办公用品', '智能家居与建材家具', '通用外贸品类'],
    keyRegions: ['全球所有国家与地区'],
    authorityOrOrg: 'IAF / CNAS 国际认可认证机构',
    passThreshold: '通过一阶段与二阶段审核，获得正式 ISO 认证注册号',
    auditCycleMonths: 36,
    coreAuditCheckpoints: [
      '来料检验 (IQC)、过程巡检 (IPQC) 与出货终检 (OQC) 标准化',
      '不良品隔离与追溯闭环 (CAPA)',
      '生产设备校准与维护保养台账',
      '客户满意度调查与客诉改进机制'
    ],
    importanceLevel: 'Mandatory (准入红线)',
    typicalCostRangeUsd: '$1,500 - $3,000'
  },
  {
    code: 'IATF 16949:2016',
    name: '国际汽车行业质量管理体系标准 (Automotive Quality Management)',
    category: '质量管理与制造体系 (Quality & Manufacturing)',
    applicableIndustries: ['汽车摩托车配件', '机械五金与工业设备', '电子电器与数码'],
    keyRegions: ['全球整车厂 (OEM) 及 Tier 1 一级零部件供应商'],
    authorityOrOrg: 'IATF 国际汽车工作组认可认证机构',
    passThreshold: '严苛现场体系审核，零重大不符合项',
    auditCycleMonths: 36,
    coreAuditCheckpoints: [
      '五大核心工具应用：APQP (先期质量策划), FMEA (潜在失效模式), MSA (测量系统), SPC (统计过程控制), PPAP (生产件批准)',
      '全生命周期防错设计 (Poka-Yoke)',
      '可追溯性与召回响应时效'
    ],
    importanceLevel: 'Mandatory (准入红线)',
    typicalCostRangeUsd: '$4,500 - $9,000'
  },
  {
    code: 'ISO 13485:2016',
    name: '医疗器械质量管理体系标准 (Medical Devices Quality Management)',
    category: '质量管理与制造体系 (Quality & Manufacturing)',
    applicableIndustries: ['医疗器械与防护耗材'],
    keyRegions: ['欧盟 (MDR/IVDR)', '美国 (FDA)', '日本 (PMDA)', '全球医疗监管局'],
    authorityOrOrg: '国际公告机构 (Notified Bodies: TUV, BSI, DNV等)',
    passThreshold: '无严重缺陷项，符合目标国医疗器械法规法规要求',
    auditCycleMonths: 36,
    coreAuditCheckpoints: [
      '医疗器械全生命周期风险管理 (ISO 14971)',
      '无尘净化车间环境监控与微粒控制',
      '灭菌过程验证与批次无缝追踪',
      '不良事件报告与上市后警戒系统'
    ],
    importanceLevel: 'Mandatory (准入红线)',
    typicalCostRangeUsd: '$5,000 - $12,000'
  },

  // --- 环保、碳足迹与 ESG 准入 ---
  {
    code: 'ISO 14001:2015',
    name: '国际环境管理体系认证 (Environmental Management System)',
    category: '环境安全与碳足迹 (Environmental & ESG)',
    applicableIndustries: ['机械五金与工业设备', '化工原料与塑料橡胶', '光伏新能源与储能', '电子电器与数码', '智能家居与建材家具'],
    keyRegions: ['全球'],
    authorityOrOrg: 'IAF / CNAS 认证机构',
    passThreshold: '环境因素识别与排污合规，无环保处罚记录',
    auditCycleMonths: 36,
    coreAuditCheckpoints: [
      '废气、废水、危废合规处置台账与资质交接',
      '厂界噪音与能耗监控',
      '环保合规性评价与应急预案演练'
    ],
    importanceLevel: 'High Priority (核心加分项)',
    typicalCostRangeUsd: '$1,500 - $3,500'
  },
  {
    code: 'OEKO-TEX Standard 100',
    name: '生态纺织品有害物质检测认证 (Confidence in Textiles)',
    category: '环境安全与碳足迹 (Environmental & ESG)',
    applicableIndustries: ['纺织服装与面料'],
    keyRegions: ['欧盟', '北美', '日本高端品牌'],
    authorityOrOrg: 'OEKO-TEX 国际环保纺织协会 (TESTEX / Hohenstein)',
    passThreshold: '全套样品送检通过有害化学物质检测并获附带标签证书',
    auditCycleMonths: 12,
    coreAuditCheckpoints: [
      '甲醛、重金属、偶氮染料禁用',
      'pH值亲肤性与色牢度检测',
      '婴幼儿用品最高等级 (Product Class I) 极限安全'
    ],
    importanceLevel: 'Mandatory (准入红线)',
    typicalCostRangeUsd: '$2,000 - $4,500'
  },
  {
    code: 'GRS (Global Recycled Standard)',
    name: '全球回收标准纺织品与塑料认证 (Recycled Content & Chain of Custody)',
    category: '环境安全与碳足迹 (Environmental & ESG)',
    applicableIndustries: ['纺织服装与面料', '化工原料与塑料橡胶', '智能家居与建材家具'],
    keyRegions: ['欧美跨国快时尚与户外高端品牌 (Nike, Zara, H&M, Patagonia)'],
    authorityOrOrg: 'Textile Exchange 授权认证机构 (CU, GCL, IDFL等)',
    passThreshold: '回收料占比不低于20%（若挂标签需≥50%），TC 交易证书闭环',
    auditCycleMonths: 12,
    coreAuditCheckpoints: [
      '回收原料追溯与进销存投入产出平衡计算 (Mass Balance)',
      '化学品管理规范 (ZDHC 合规清单)',
      '社会责任与废水处理达标'
    ],
    importanceLevel: 'High Priority (核心加分项)',
    typicalCostRangeUsd: '$2,500 - $4,800'
  },
  {
    code: 'CBAM & 碳足迹认证',
    name: '欧盟碳边境调节机制与产品碳足迹 (Carbon Border Adjustment Mechanism)',
    category: '环境安全与碳足迹 (Environmental & ESG)',
    applicableIndustries: ['机械五金与工业设备', '光伏新能源与储能', '化工原料与塑料橡胶'],
    keyRegions: ['欧盟 27 国海关'],
    authorityOrOrg: '欧盟认可碳核查机构 (TUV / SGS / BV)',
    passThreshold: '出具符合欧盟规范的单位产品直接与间接碳排放核算报告',
    auditCycleMonths: 12,
    coreAuditCheckpoints: [
      '产品生命周期评估 (LCA - ISO 14067)',
      '工厂电力消耗与原材料隐含碳数据穿透',
      '符合欧盟 CBAM 季度申报数据标准'
    ],
    importanceLevel: 'High Priority (核心加分项)',
    typicalCostRangeUsd: '$3,000 - $8,000'
  },

  // --- 行业专项与安全准入 ---
  {
    code: 'CE 认证 (EU Conformity)',
    name: '欧盟安全与合格评定标志 (CE Marking: LVD / EMC / MD / CPR)',
    category: '行业专项与安全准入 (Industry Specific & Safety)',
    applicableIndustries: ['机械五金与工业设备', '电子电器与数码', '光伏新能源与储能', '智能家居与建材家具', '医疗器械与防护耗材'],
    keyRegions: ['欧洲经济区 (EEA) 30国'],
    authorityOrOrg: '欧盟公告机构 (NB 机构) 或 符合性声明 (DoC)',
    passThreshold: '符合欧盟协调标准 (EN Standards)，完成技术文档 (TCF) 归档',
    auditCycleMonths: 60,
    coreAuditCheckpoints: [
      '低电压指令 LVD (安全防触电、绝缘距离)',
      '电磁兼容指令 EMC (辐射与抗扰度测试)',
      '机械指令 MD (防护罩、急停联锁、风险评估)',
      '完整技术文档、铭牌标识与多语种使用说明书'
    ],
    importanceLevel: 'Mandatory (准入红线)',
    typicalCostRangeUsd: '$1,000 - $6,000'
  },
  {
    code: 'UL / ETL (North America Safety)',
    name: '北美安全认证标准 (Underwriters Laboratories / Intertek ETL)',
    category: '行业专项与安全准入 (Industry Specific & Safety)',
    applicableIndustries: ['电子电器与数码', '光伏新能源与储能', '机械五金与工业设备', '智能家居与建材家具'],
    keyRegions: ['美国 (OSHA 认可)', '加拿大 (SCC 认可)'],
    authorityOrOrg: 'UL Solutions / Intertek NRTL 国家认可测试实验室',
    passThreshold: '通过极限破坏性测试，并接受每季度工厂突击复查 (Follow-up Service)',
    auditCycleMonths: 3,
    coreAuditCheckpoints: [
      '耐火阻燃等级 (94V-0)、耐高压抗击穿测试',
      '关键安全元器件 (UL Listed Components) 黄卡认证',
      '出厂 100% 高压打压与接地连续性测试'
    ],
    importanceLevel: 'Mandatory (准入红线)',
    typicalCostRangeUsd: '$4,000 - $15,000'
  },
  {
    code: 'FDA 认证与注册 (US FDA)',
    name: '美国食品药品监督管理局注册与合规 (Food and Drug Administration)',
    category: '行业专项与安全准入 (Industry Specific & Safety)',
    applicableIndustries: ['医疗器械与防护耗材', '食品饮料与农产品', '智能家居与建材家具', '通用外贸品类'],
    keyRegions: ['美国海关与各州市场'],
    authorityOrOrg: 'US Food and Drug Administration (FDA 官网注册系统及 510(k))',
    passThreshold: '获得 FDA 官方登记企业号 (FEI/Owner Operator Number) 或 510(k) 清单批准',
    auditCycleMonths: 12,
    coreAuditCheckpoints: [
      '医疗器械 Class I 登记/Class II 510(k) 临床实质等同证明',
      '食品接触材料 (Food Contact Substances) 迁移量达标',
      '美国法定代理人 (US Agent) 备案与年金缴交'
    ],
    importanceLevel: 'Mandatory (准入红线)',
    typicalCostRangeUsd: '$1,500 - $20,000'
  },
  {
    code: 'C-TPAT / GSV (供应链反恐)',
    name: '海关-商界反恐伙伴合作计划与全球安全验证 (Customs-Trade Partnership Against Terrorism)',
    category: '反恐与供应链安全 (C-TPAT / Security)',
    applicableIndustries: ['机械五金与工业设备', '电子电器与数码', '纺织服装与面料', '通用外贸品类'],
    keyRegions: ['美国海关与边境保护局 (CBP)', '北美主要进口商'],
    authorityOrOrg: 'US CBP 审核或第三方 GSV 认证机构 (Intertek)',
    passThreshold: '综合安全分值达到 85 分以上，无重大安防盲区',
    auditCycleMonths: 24,
    coreAuditCheckpoints: [
      '集装箱 7 点检查法与 ISO 17712 高保封条管理',
      '工厂实体安保（围墙、全天候高清监控、门禁刷卡）',
      '人事背景审查与关键岗位员工背调',
      '信息技术安全与密码策略'
    ],
    importanceLevel: 'High Priority (核心加分项)',
    typicalCostRangeUsd: '$1,200 - $2,800'
  }
];

// =====================================================================
// 2. 外贸从 0 到 1 破局：理性与系统论激励语录 (ECHO 5F Rational Mindset Quotes)
// =====================================================================
export const RATIONAL_MINDSET_QUOTES: RationalMindsetQuote[] = [
  {
    id: 'quote-1',
    quote: '外贸从来不是靠运气的灵感博弈，而是一套严格符合大数定律的信号捕获与工程交付系统。单次被拒绝只是局部信号衰减，只要底层的获客公式与履约质量在运转，赢单概率必将收敛于确定性。',
    authorOrSchool: 'ECHO 5F 增长系统论 (From Signal to System)',
    applicationContext: '0-1搭建期迷茫',
    corePrinciple: '系统论胜于运气：建立标准化获客流程（SOP），而非依赖单个业务员的偶然发挥。'
  },
  {
    id: 'quote-2',
    quote: '海外买家不回复开发信，绝大多数时候不是因为你的价格高，而是因为你发射的信息熵太高——没有精准对齐其海关常购 HS 编码、没有提供验厂资质过审证据。降低沟通熵增，信任自然建立。',
    authorOrSchool: '信息论与 B2B 决策心理学',
    applicationContext: '频繁被拒/无回复',
    corePrinciple: '信噪比法则：砍掉空洞的客套话，只提供海关匹配规格、现成验厂证书和精准报价。'
  },
  {
    id: 'quote-3',
    quote: '从 0 到 1 搭建外贸团队最忌讳「情绪性管理」。不要问业务员「今天跟进得怎么样」，而是看「有效触达买家决策人系数 W1」、「验厂资质匹配度 W2」和「打样交付速度 W3」。用公式管业务，团队才有底气。',
    authorOrSchool: '理性工程管理心法',
    applicationContext: '团队士气低迷',
    corePrinciple: '指标可量化性：将模糊的努力拆解为可被微调的权重参数。'
  },
  {
    id: 'quote-4',
    quote: '大客户的采购决策是一场严谨的风险厌恶防御战。与其在谈判桌上急躁让利，不如拿出 ISO/BSCI/IATF 完整测试报告与 3 个同类跨国客户的出口提单记录。消除买家内部过审的恐惧，才是最大的谈判筹码。',
    authorOrSchool: '跨国供应链博弈论',
    applicationContext: '大单谈判焦虑',
    corePrinciple: '买家风险置换：大买家看重的不是最便宜，而是最不会让他丢掉工作的供应商。'
  },
  {
    id: 'quote-5',
    quote: '外贸没有一劳永逸的护城河，唯有「快速迭代的反馈回路 (Feedback Loop)」。从一次客诉中建立一套防错夹具，从一次失单中补齐一项国际认证，这就是让工厂从 Tier 3 蜕变为全球 Tier 1 的唯一路径。',
    authorOrSchool: '精益制造与持续改进思想',
    applicationContext: '交付与客诉危机',
    corePrinciple: '反脆弱增长：把每一次危机转化为体系升级的制度资产。'
  },
  {
    id: 'quote-6',
    quote: '焦虑的本质是对因果关系的失控感。当你知道每一个成单等于：[海关意图 30%] + [资质验厂 30%] + [商务交期 25%] + [极速响应 15%] 时，你唯一要做的就是专注把每个因子的分数拉满，结果只是水到渠成。',
    authorOrSchool: 'ECHO 5F 概率收敛模型',
    applicationContext: '0-1搭建期迷茫',
    corePrinciple: '因果确定性：控制你能控制的输入，产出自然在预期之内。'
  },
  {
    id: 'quote-7',
    quote: '顶级外贸操盘手与平庸业务员的最大区别，不在于多会死缠烂打，而在于「放弃的勇气 (Courage to Disqualify)」。把 80% 的精力耗费在一个永远无法满足验厂红线或无休止索要免费打样的劣质客户身上，是最大的战略懒惰。不能为了一棵歪脖树，荒废了全球海关提单里的整片森林。',
    authorOrSchool: '现代商业决策学与机会成本论',
    applicationContext: '放弃的勇气与及时止损',
    corePrinciple: '及时止损法：沉没成本不是成本，未来的精力投入产出比 (ROI) 才是唯一的决策标尺。'
  },
  {
    id: 'quote-8',
    quote: '道法自然，顺应天道。外贸的买卖本质是供需两端的同频共振，而非单方面的强扭与执念。当产品定位、工厂资质、目标关区与买家采购生态自然契合时，成交如高山流水自然而然；若硬要在不匹配的土壤上强求，终究两败俱伤。顺其自然，借势而行。',
    authorOrSchool: '东方哲学与全球贸易生态观 (Tao of Global Trade)',
    applicationContext: '道法自然与顺其自然',
    corePrinciple: '顺应供需天道：不与不可为的摩擦硬碰，寻找与自身产能禀赋天然契合的市场生态位。'
  },
  {
    id: 'quote-9',
    quote: '偏执是把双刃剑：对产品打磨与验厂标准的偏执能造就全球顶级 Tier 1 工厂；但对单个不买单客户的情绪性偏执，则会彻底拖垮业务员的心智与现金流。当你敢于果断判定「此单不可为，立即归档」，你的大脑才会腾出带宽，去拥抱真正属于你的优质大买家。',
    authorOrSchool: '认知心理学与业务精力守恒定律',
    applicationContext: '放弃的勇气与及时止损',
    corePrinciple: '认知带宽释放：敢于说「No」的业务员，才有能力对真正的大客户说出最坚实的「Yes」。'
  },
  {
    id: 'quote-10',
    quote: '万物并作，吾以观复。全球贸易潮起潮落，运费、汇率、关税、地缘政治皆有其自然周期。做外贸切忌心浮气躁。保持内功深厚（合规资质备齐、海关数据常态化监控、敏捷打样能力在手），待到潮水涌起，大单自会水到渠成。',
    authorOrSchool: '周期论与道家心法',
    applicationContext: '道法自然与顺其自然',
    corePrinciple: '周期从容感：深挖洞、广积粮、备资质、顺周期，以静制动，功到自然成。'
  }
];

// =====================================================================
// 2.1 外贸果断放弃与及时止损自检标准 (Disqualification Red Flags)
// =====================================================================
export interface StopLossRedFlag {
  id: string;
  category: string;
  triggerCondition: string;
  fatalRiskReason: string;
  recommendAction: '立即彻底归档 (Drop & Archive)' | '转入低频冷库观察 (Cold Nurture)' | '设置硬性门槛筛选 (Set Hard Barrier)';
}

export const STOP_LOSS_RED_FLAGS: StopLossRedFlag[] = [
  {
    id: 'flag-1',
    category: '资质与红线硬伤 (Compliance Gap)',
    triggerCondition: '买家强制要求特定验厂认证 (如 BSCI A级 / IATF 16949 / FDA 510k)，我方工厂客观无法在6个月内取得且买家无任何妥协空间',
    fatalRiskReason: '即便前期谈妥价格和样品，最终在验厂 Audit 环节必死无疑，前面投入的全部业务沟通与打样费用全部沉没。',
    recommendAction: '立即彻底归档 (Drop & Archive)'
  },
  {
    id: 'flag-2',
    category: '白嫖与虚假意向 (Spam & Sample Abuse)',
    triggerCondition: '索要定制免费样品超过 2-3 次，每次寄样后均反馈「内部在评估」但无任何真实采购参数输入，且海关提单查无近期进口记录',
    fatalRiskReason: '典型的打样白嫖或转包套图，继续投入只会不断被消耗工程精力。',
    recommendAction: '设置硬性门槛筛选 (Set Hard Barrier)'
  },
  {
    id: 'flag-3',
    category: '极度不健康商业条款 (Toxic Terms)',
    triggerCondition: '买家坚持要求 100% OA 60~120 天账期，拒绝支付定金，且拒绝办理中国信保 (Sinosure) 承保与额度背书',
    fatalRiskReason: '将工厂完全暴露于海外买家破产、恶意拒付、货款蒸发的致命流动性断裂风险中。',
    recommendAction: '立即彻底归档 (Drop & Archive)'
  },
  {
    id: 'flag-4',
    category: '恶性压价与负毛利 (Sub-Cost Haggling)',
    triggerCondition: '还盘价格低于我方原材料 BOM 极限成本 15% 以上，且以「未来会有百万大单」持续画饼',
    fatalRiskReason: '做一单亏一单，严重扰乱正常产线节奏，伤害健康客户的交期与品质。',
    recommendAction: '立即彻底归档 (Drop & Archive)'
  },
  {
    id: 'flag-5',
    category: '沟通严重傲慢与信息不对称 (Zero Rapport)',
    triggerCondition: '业务员发出 5 次以上专业跟进方案（含技术图纸、视频验厂、针对性报价），买家连续 45 天无任何实质反馈或态度极度蛮横',
    fatalRiskReason: '买家已有极其稳固的既有供应商，当前仅把你作为比价工具人；业务员心力严重被内耗。',
    recommendAction: '转入低频冷库观察 (Cold Nurture)'
  }
];

// =====================================================================
// 3. ECHO 5F 赢单概率计算核心算法引擎 (Mathematical Win-Rate Engine)
// P(Win) = W1*Signal + W2*Audit + W3*Commercial + W4*Velocity + ε
// =====================================================================
export function calculateDealWinProbability(factors: DealProbabilityFactors): DealProbabilityCalculationResult {
  // 定义科学权重矩阵 (总和 1.0)
  const W1 = 0.30; // 海关提单与采购真实性权重 (30%)
  const W2 = 0.30; // 工厂资质与验厂过审权重 (30%)
  const W3 = 0.25; // 价格竞争力与交期弹性权重 (25%)
  const W4 = 0.15; // 交互沟通速度与专业度权重 (15%)

  const c1 = factors.customsDemandScore * W1;
  const c2 = factors.factoryAuditMatchScore * W2;
  const c3 = factors.commercialTermsScore * W3;
  const c4 = factors.interactionVelocityScore * W4;

  const rawSum = c1 + c2 + c3 + c4 + (factors.macroVariableAdjustment || 0);
  const clampedProbability = Math.max(5, Math.min(98, Math.round(rawSum)));

  let grade: DealProbabilityCalculationResult['grade'] = 'C (高风险/缺口大 <50%)';
  if (clampedProbability >= 85) grade = 'S (高确定性赢单 >85%)';
  else if (clampedProbability >= 70) grade = 'A (高胜率推进 70-84%)';
  else if (clampedProbability >= 50) grade = 'B (谈判博弈期 50-69%)';

  const bottlenecks: string[] = [];
  const actionSteps: string[] = [];

  if (factors.customsDemandScore < 60) {
    bottlenecks.push('买家常购品类与我方规格有偏差，或该买家近6个月提单进口频次较低');
    actionSteps.push('通过海关智搜拉取该买家近 1 年全量提单，提取其常合作供应商供货周期与目标价位');
  }

  if (factors.factoryAuditMatchScore < 70) {
    bottlenecks.push('工厂缺少目标买家或目的国关区准入的强制性验厂/检测认证（如 BSCI / ISO / CE / FDA）');
    actionSteps.push('立即启动验厂差距分析 (Gap Analysis)，提供同等替代性检测报告或提供 SGS/TUV 验厂排期证明以消除买家顾虑');
  }

  if (factors.commercialTermsScore < 65) {
    bottlenecks.push('付款方式或交期存在摩擦（如买家要求 OA/DP，我方坚持前 TT，或交期超过买家期望）');
    actionSteps.push('引入中信保 (Sinosure) 信用承保以放宽账期，或优化 BOM 备料将首单交期缩短至 20 天内');
  }

  if (factors.interactionVelocityScore < 60) {
    bottlenecks.push('询盘首响时间超 12 小时，或未配置 WhatsApp 快速即时沟通通道');
    actionSteps.push('将首次报价响应时效压缩至 2 小时以内，提供双语规格书 (Spec Sheet) 与 3D 拆解图以强化专业形象');
  }

  if (actionSteps.length === 0) {
    actionSteps.push('各项关键指标均达到行业极优水准，建议立即寄送金样或推进签约 PI 形式发票锁定定金');
  }

  return {
    probabilityPercent: clampedProbability,
    grade,
    formulaBreakdown: {
      w1_customs: { weight: W1, score: factors.customsDemandScore, contribution: Math.round(c1 * 10) / 10 },
      w2_audit: { weight: W2, score: factors.factoryAuditMatchScore, contribution: Math.round(c2 * 10) / 10 },
      w3_commercial: { weight: W3, score: factors.commercialTermsScore, contribution: Math.round(c3 * 10) / 10 },
      w4_velocity: { weight: W4, score: factors.interactionVelocityScore, contribution: Math.round(c4 * 10) / 10 },
      epsilon_variable: factors.macroVariableAdjustment || 0
    },
    keyBottlenecks: bottlenecks,
    actionableStepsToIncreaseWinRate: actionSteps
  };
}
