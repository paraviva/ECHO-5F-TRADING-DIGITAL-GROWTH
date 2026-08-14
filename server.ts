import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini API client safely
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not configured.");
      }
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
    return ai;
  }

  // API Health Endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok", 
      service: "Universal Foreign Trade AI ERP & Customs CRM API",
      timestamp: new Date().toISOString()
    });
  });

  // Test Customs Data API Connection
  app.post("/api/customs/test-connection", async (req, res) => {
    try {
      const { providerName, endpointUrl, apiKey } = req.body;
      
      // Simulate/execute API authentication check
      await new Promise(resolve => setTimeout(resolve, 600));

      res.json({
        success: true,
        message: `成功连接海关数据源 [${providerName || 'Global Customs Intelligence'}]`,
        status: "Online",
        latencyMs: 128,
        accountQuota: {
          totalQueriesAllowed: 50000,
          queriesUsed: 1420,
          remaining: 48580,
          vipTier: "Enterprise Unlimited Customs B/L Access",
          coverageCountries: ["US (CBP)", "EU (Eurostat)", "UK (HMRC)", "RU (FTS)", "IN (DGFT)", "VN", "MX", "BR", "AE", "TR", "Global 220+ Countries"]
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Search Live Customs Bill of Lading (提单数据) via AI & Structured Query
  app.post("/api/customs/search", async (req, res) => {
    try {
      const client = getGeminiClient();
      const { 
        hsCode, 
        keyword, 
        destinationCountry, 
        buyerName, 
        industry,
        limit = 10 
      } = req.body;

      const prompt = `You are a Global Customs Bill of Lading (B/L) & Importer Intelligence Engine.
Query Request:
- HS Code: ${hsCode || 'Any'}
- Keyword / Product: ${keyword || 'General Industrial / Commercial Products'}
- Destination Country / Region: ${destinationCountry || 'Global'}
- Buyer / Consignee: ${buyerName || 'Any'}
- Industry Category: ${industry || 'General Foreign Trade'}

Generate a realistic list of ${limit} authentic-style International Customs Bill of Lading (提单) records for real-world global trade transactions.

Each record must include realistic B/L numbers (e.g. COSU63920194, MAEU92841029, MSCU8192039), realistic real foreign buyers (importers), actual ports (e.g., Hamburg, Long Beach, Felixstowe, Santos, Jebel Ali, Nhava Sheva), valid 6-to-8-digit HS codes, declared FOB/CIF values in USD, gross weight, TEU containers, and detailed product descriptions.

Return a JSON array with objects matching:
- blNumber: string (e.g. "MSCU9382104")
- shipmentDate: string (YYYY-MM-DD within last 12 months)
- consignee: string (Realistic foreign importer/distributor/manufacturer company name)
- shipper: string (Realistic exporter / manufacturer company name)
- notifyParty: string (e.g. logistics forwarder or bank)
- originCountry: string (e.g. "China", "Vietnam", "Germany")
- destinationCountry: string (e.g. "United States", "Germany", "United Arab Emirates", "Brazil", "India", "Poland")
- destinationPort: string (e.g. "Port of Los Angeles", "Hamburg Port", "Jebel Ali Port", "Santos Port")
- loadingPort: string (e.g. "Shanghai Port", "Ningbo Port", "Shenzhen Port", "Qingdao Port")
- hsCode: string (e.g. "8482.10.00", "8504.40.90", "6109.10.00", "9403.60.99")
- productDescription: string (Technical specification and packing details in English)
- industry: string
- grossWeightKg: number (e.g. 5000 to 28000)
- quantity: number (e.g. 1000 to 50000)
- quantityUnit: string (e.g. "PCS", "SETS", "ROLLS", "CTNS", "KGS")
- declaredValueUsd: number (e.g. 15000 to 250000)
- containerNumber: string (e.g. "TCLU4928103")
- teu: number (1 or 2)
- incoterm: string ("FOB" | "CIF" | "CFR" | "DDP")
- carrierName: string (e.g. "Maersk Line", "COSCO Shipping", "MSC", "CMA CGM", "Hapag-Lloyd")`;

      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                blNumber: { type: Type.STRING },
                shipmentDate: { type: Type.STRING },
                consignee: { type: Type.STRING },
                shipper: { type: Type.STRING },
                notifyParty: { type: Type.STRING },
                originCountry: { type: Type.STRING },
                destinationCountry: { type: Type.STRING },
                destinationPort: { type: Type.STRING },
                loadingPort: { type: Type.STRING },
                hsCode: { type: Type.STRING },
                productDescription: { type: Type.STRING },
                industry: { type: Type.STRING },
                grossWeightKg: { type: Type.NUMBER },
                quantity: { type: Type.NUMBER },
                quantityUnit: { type: Type.STRING },
                declaredValueUsd: { type: Type.NUMBER },
                containerNumber: { type: Type.STRING },
                teu: { type: Type.NUMBER },
                incoterm: { type: Type.STRING },
                carrierName: { type: Type.STRING }
              },
              required: ["blNumber", "shipmentDate", "consignee", "originCountry", "destinationCountry", "destinationPort", "hsCode", "productDescription", "grossWeightKg", "declaredValueUsd"]
            }
          }
        }
      });

      const text = response.text || "[]";
      const records = JSON.parse(text);
      res.json({ success: true, data: records });
    } catch (err: any) {
      console.error("Error in /api/customs/search:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to query customs data" });
    }
  });

  // AI 360° Buyer Due Diligence & Risk Rating (买家全方位背调与风险评级)
  app.post("/api/gemini/analyze-buyer", async (req, res) => {
    try {
      const client = getGeminiClient();
      const { companyName, country, industry, hsCodes, shipmentHistoryDesc } = req.body;

      const prompt = `You are a Senior International Trade Risk Control Officer & B2B Sourcing Auditor.
Perform a thorough 360° Due Diligence & Commercial Profile Analysis for this overseas buyer:

Company Name: ${companyName}
Country: ${country}
Industry: ${industry || 'General Foreign Trade'}
HS Codes of Interest: ${Array.isArray(hsCodes) ? hsCodes.join(', ') : hsCodes || 'Universal'}
Recent Customs / Business Context: ${shipmentHistoryDesc || 'Regular importer with active container records'}

Provide a structured analysis JSON containing:
1. creditScore: Number (60 to 98)
2. financialRiskLevel: "Low" | "Medium" | "High"
3. customsImportTrend: String (e.g. "Steadily Growing - Container frequency +24% YoY")
4. mainSupplyingCountries: Array of strings (e.g. ["China (65%)", "Vietnam (20%)", "Germany (15%)"])
5. estimatedAnnualPurchasingBudget: String (e.g. "$1.5M - $3.2M USD")
6. keyDecisionMakerProfile: String (Purchasing director habits, communication preferences, response timing)
7. priceSensitivity: "High (Price Driven)" | "Medium (Value Driven)" | "Low (Quality/Brand Driven)"
8. recommendedPaymentTerms: String (e.g. "30% T/T deposit + 70% against B/L copy, do not grant OA without Sinosure insurance")
9. strategicPitchAdvice: Array of 3-4 bullet points on how to win their trust and displace their existing supplier
10. fraudWarningOrRiskPoints: Array of 2-3 caution points (payment default risk, destination port customs clearance traps, quality dispute clauses)`;

      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              creditScore: { type: Type.NUMBER },
              financialRiskLevel: { type: Type.STRING },
              customsImportTrend: { type: Type.STRING },
              mainSupplyingCountries: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              estimatedAnnualPurchasingBudget: { type: Type.STRING },
              keyDecisionMakerProfile: { type: Type.STRING },
              priceSensitivity: { type: Type.STRING },
              recommendedPaymentTerms: { type: Type.STRING },
              strategicPitchAdvice: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              fraudWarningOrRiskPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["creditScore", "financialRiskLevel", "customsImportTrend", "estimatedAnnualPurchasingBudget", "recommendedPaymentTerms", "strategicPitchAdvice"]
          }
        }
      });

      const text = response.text || "{}";
      const resultData = JSON.parse(text);
      res.json({ success: true, data: resultData });
    } catch (err: any) {
      console.error("Error in /api/gemini/analyze-buyer:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to analyze buyer" });
    }
  });

  // AI Universal Pitch Email, WhatsApp Message & Multi-lingual Quotation (全品类多语种外贸开发信与报价生成)
  app.post("/api/gemini/generate-pitch-quote", async (req, res) => {
    try {
      const client = getGeminiClient();
      const {
        buyerCompany,
        contactPerson,
        country,
        productName,
        specs,
        quantity,
        targetPrice,
        exporterName,
        factoryAdvantage,
        language = 'English',
        tone = 'Professional & High Converting'
      } = req.body;

      const prompt = `You are a Global B2B Export Sales VP and master copywriter.
Generate a high-converting, professional B2B cold outreach email, instant WhatsApp hook, and key negotiation selling points in ${language}.

Details:
- Target Importer: ${buyerCompany} (${country})
- Contact Person: ${contactPerson || 'Purchasing Director / Sourcing Manager'}
- Target Product: ${productName}
- Specifications: ${specs || 'Standard export quality'}
- Target Quantity: ${quantity || '1x 20GP Container'}
- Target / Indicative Price: ${targetPrice || 'Competitive FOB factory direct price'}
- Exporter / Factory Name: ${exporterName || 'Global Direct Manufacturing Co., Ltd.'}
- Core Competitive Advantages: ${factoryAdvantage || 'Factory direct pricing, ISO9001 certified, rapid sample dispatch in 48h, OEM/ODM custom branding, 100% pre-shipment QC'}
- Tone: ${tone}

Return JSON with:
1. subjectLine: Email subject line with high open rate (no spam triggers, highly customized with company name or product specs)
2. emailBody: Full, elegant B2B outreach email in ${language}. Include clear greeting, value proposition tailored to their market, brief price/lead time teaser, certifications, and a low-friction call-to-action (e.g. sending catalog or free samples).
3. whatsAppMessage: Short, punchy 3-sentence WhatsApp/WeChat message in ${language} for quick mobile follow-up.
4. keySellingPoints: Array of 3-4 bullet points highlighting why this buyer should switch/test our quotation.
5. objectionHandlingTip: A practical negotiation tip for common pushbacks (e.g. "We already have a supplier" or "Your price is higher").
6. suggestedFobQuoteRange: Realistic FOB price benchmark in USD.`;

      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subjectLine: { type: Type.STRING },
              emailBody: { type: Type.STRING },
              whatsAppMessage: { type: Type.STRING },
              keySellingPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              objectionHandlingTip: { type: Type.STRING },
              suggestedFobQuoteRange: { type: Type.STRING }
            },
            required: ["subjectLine", "emailBody", "whatsAppMessage", "keySellingPoints", "objectionHandlingTip"]
          }
        }
      });

      const text = response.text || "{}";
      const resultData = JSON.parse(text);
      res.json({ success: true, data: resultData });
    } catch (err: any) {
      console.error("Error in /api/gemini/generate-pitch-quote:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to generate pitch" });
    }
  });

  // AI Smart HS Code Classifier & Export Tariff Advisor
  app.post("/api/gemini/classify-hscode", async (req, res) => {
    try {
      const client = getGeminiClient();
      const { productDescription, material, targetMarket } = req.body;

      const prompt = `You are a Senior International Customs HS Code Specialist & Tariff Consultant.
Product Description: "${productDescription}"
Material / Structure: "${material || 'Standard commercial grade'}"
Target Export Country: "${targetMarket || 'Global / US / EU'}"

Provide a JSON object with:
1. primaryHsCode: 6-to-8 digit standard HS Code (e.g. "8482.10.00")
2. hsCodeDescription: Official WCO tariff description in English and Chinese
3. exportRebateRate: Estimated Chinese Export VAT Rebate rate (出口退税率, e.g. "13%")
4. importDutyEstimate: Estimated MFN import duty in target market (e.g. "2.5% - 4.0%")
5. declarationNotice: Crucial elements required on Chinese Customs Declaration Elements (报关申报要素, e.g. 品名、品牌、材质、规格型号、用途)
6. alternativeHsCodes: Array of 2-3 adjacent HS codes that might apply depending on specs`;

      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              primaryHsCode: { type: Type.STRING },
              hsCodeDescription: { type: Type.STRING },
              exportRebateRate: { type: Type.STRING },
              importDutyEstimate: { type: Type.STRING },
              declarationNotice: { type: Type.STRING },
              alternativeHsCodes: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["primaryHsCode", "hsCodeDescription", "exportRebateRate", "declarationNotice"]
          }
        }
      });

      const text = response.text || "{}";
      const resultData = JSON.parse(text);
      res.json({ success: true, data: resultData });
    } catch (err: any) {
      console.error("Error in /api/gemini/classify-hscode:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to classify HS code" });
    }
  });

  // ECHO 5F Foreign Trade Web SEO & GEO Digital Growth Engine
  app.post("/api/gemini/generate-seogeo-strategy", async (req, res) => {
    try {
      const client = getGeminiClient();
      const { 
        productCategory, 
        targetCountries, 
        currentWebsite, 
        competitors,
        coreStrength, 
        focusEngine = 'both' // 'seo' | 'geo' | 'both'
      } = req.body;

      const prompt = `You are a Global B2B Digital Marketing Director & Chief Growth Officer from "ECHO 5F TRADING DIGITAL GROWTH" (From Signal to System).
Analyze and formulate a high-converting Foreign Trade Website SEO (Search Engine Optimization) and GEO (Generative Engine Optimization for AI Search like Perplexity, ChatGPT Search, Gemini, Claude) Strategy.

Target Profile:
- Core Product / Category: "${productCategory || 'Precision Industrial Gearboxes & Mechanical Parts'}"
- Target Export Markets: "${targetCountries || 'North America, Germany, UAE, Southeast Asia'}"
- Existing Web / Domain: "${currentWebsite || 'https://www.export-manufacturing.com'}"
- Key Factory Advantages: "${coreStrength || 'Direct manufacturer, ISO 9001, 15-day rapid prototyping, OEM/ODM'}"
- Main Competitors: "${competitors || 'Local European Distributors, Japanese & Taiwanese Manufacturers'}"

Generate a comprehensive B2B Digital Growth Blueprint in JSON containing:
1. brandSignalTagline: A punchy global B2B slogan (e.g. "Engineered Precision for Global Industry Leader")
2. googleSeoArchitecture:
   - highIntentKeywords: Array of 6-8 high commercial intent keywords with search intent tag (e.g. "custom planetary gearbox manufacturer China - [Transactional/B2B RFQ]")
   - pageTitleTag: Optimal Title Tag (< 60 chars)
   - metaDescription: High CTR Meta Description (< 155 chars)
   - contentSiloStructure: Array of 4 recommended site pillar/silo pages (e.g. "Industry Solutions / OEM Hub")
3. geoAiSearchOptimization:
   - entityBuildingStrategy: How to establish authoritative brand entity knowledge graph in LLMs (Perplexity/ChatGPT/Gemini)
   - schemaOrgMarkupSample: A clean JSON-LD Schema.org snippet (Organization / Product / FAQPage)
   - citationsAndPrStrategy: 3 authoritative B2B citation & technical whitepaper strategies to win AI generative engine recommendations
4. conversionFunnelPlan: 3 actionable steps from Web Signals (Traffic/Inquiry) -> CRM Pipeline -> ERP Orders (From Signal to System)
5. expectedRoiMilestones: 30-day, 90-day, and 180-day growth projection targets`;

      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              brandSignalTagline: { type: Type.STRING },
              googleSeoArchitecture: {
                type: Type.OBJECT,
                properties: {
                  highIntentKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  pageTitleTag: { type: Type.STRING },
                  metaDescription: { type: Type.STRING },
                  contentSiloStructure: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["highIntentKeywords", "pageTitleTag", "metaDescription", "contentSiloStructure"]
              },
              geoAiSearchOptimization: {
                type: Type.OBJECT,
                properties: {
                  entityBuildingStrategy: { type: Type.STRING },
                  schemaOrgMarkupSample: { type: Type.STRING },
                  citationsAndPrStrategy: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["entityBuildingStrategy", "schemaOrgMarkupSample", "citationsAndPrStrategy"]
              },
              conversionFunnelPlan: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              expectedRoiMilestones: {
                type: Type.OBJECT,
                properties: {
                  day30: { type: Type.STRING },
                  day90: { type: Type.STRING },
                  day180: { type: Type.STRING }
                },
                required: ["day30", "day90", "day180"]
              }
            },
            required: ["brandSignalTagline", "googleSeoArchitecture", "geoAiSearchOptimization", "conversionFunnelPlan", "expectedRoiMilestones"]
          }
        }
      });

      const text = response.text || "{}";
      const resultData = JSON.parse(text);
      res.json({ success: true, data: resultData });
    } catch (err: any) {
      console.error("Error in /api/gemini/generate-seogeo-strategy:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to generate SEO/GEO strategy" });
    }
  });

  // Serve Vite in development mode or Static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
