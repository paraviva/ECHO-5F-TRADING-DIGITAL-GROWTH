import React, { useState } from 'react';
import { 
  UploadCloud, 
  X, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  FileText 
} from 'lucide-react';
import { CustomsBLRecord, CRMCustomer } from '../types';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportBLRecords: (records: CustomsBLRecord[]) => void;
  onImportCustomers: (customers: CRMCustomer[]) => void;
}

export const DataImportModal: React.FC<DataImportModalProps> = ({
  isOpen,
  onClose,
  onImportBLRecords,
  onImportCustomers
}) => {
  if (!isOpen) return null;

  const [importTarget, setImportTarget] = useState<'bl' | 'crm'>('bl');
  const [pastedCSV, setPastedCSV] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const sampleBLCSV = `B/L No.,Shipment Date,Consignee,Shipper,Loading Port,Destination Port,Country,HS Code,Description,Weight(KG),Value(USD)
MSCU83920199,2026-08-10,GLOBAL TECH IMPORTERS LLC,SHANGHAI ELECTRONICS CO.,Shanghai,Los Angeles,United States,8504.40,Industrial Inverters & Power Modules,14200,285000
HLCU20491038,2026-08-11,BAVARIA AGRO DYNAMICS GMBH,NINGBO INDUSTRIAL MFG,Ningbo,Hamburg,Germany,8483.40,Precision Helical Gearbox Reducers,9800,165000`;

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedCSV.trim()) return;

    try {
      const lines = pastedCSV.trim().split('\n');
      if (lines.length <= 1) {
        alert('请输入或上传至少包含一条数据记录的 CSV 内容');
        return;
      }

      if (importTarget === 'bl') {
        const parsedBL: CustomsBLRecord[] = lines.slice(1).map((line, idx) => {
          const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          return {
            id: `bl-import-${Date.now()}-${idx}`,
            blNumber: cols[0] || `BL-${Date.now()}-${idx}`,
            shipmentDate: cols[1] || new Date().toISOString().split('T')[0],
            consignee: cols[2] || 'Global Importer Corp',
            shipper: cols[3] || 'China Sourcing Co., Ltd.',
            loadingPort: cols[4] || 'Shanghai Port',
            destinationPort: cols[5] || 'Long Beach / Los Angeles',
            destinationCountry: cols[6] || 'United States',
            hsCode: cols[7] || '8483.40',
            productDescription: cols[8] || 'Industrial Mechanical Parts',
            grossWeightKg: Number(cols[9]) || 5000,
            quantity: 1000,
            quantityUnit: 'PCS',
            teu: 1,
            declaredValueUsd: Number(cols[10]) || 50000,
            incoterm: 'FOB',
            industry: '机械五金与工业设备',
            carrierName: 'MSC Mediterranean Shipping',
            isVerified: true
          };
        });

        onImportBLRecords(parsedBL);
        setSuccessMessage(`成功导入 ${parsedBL.length} 条海关提单真实记录！`);
      } else {
        const parsedCust: CRMCustomer[] = lines.slice(1).map((line, idx) => {
          const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          return {
            id: `crm-import-${Date.now()}-${idx}`,
            companyName: cols[2] || cols[0] || 'Imported Buyer Corp',
            country: cols[6] || cols[1] || 'United States',
            countryCode: (cols[6] || cols[1] || 'US').substring(0, 2).toUpperCase(),
            region: 'North America',
            industry: '机械五金与工业设备',
            priority: 'A',
            buyerType: 'Distributor (批发商/分销商)',
            source: 'Manual Import',
            stage: 'lead',
            creditRating: 'AAA (Top Tier)',
            annualImportValue: '$1,000,000 - $3,000,000',
            mainProducts: [cols[8] || 'Industrial Equipment'],
            hsCodes: [cols[7] || '8483.40'],
            customsShipmentsCount: 1,
            contacts: [
              {
                id: `ct-${Date.now()}-${idx}`,
                name: 'Purchasing Director',
                title: 'Procurement Lead',
                email: 'procurement@buyer.com',
                isPrimary: true
              }
            ],
            assignedSales: '外贸业务部',
            followUpLogs: [
              {
                id: `log-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                type: 'Email',
                author: 'System',
                summary: '通过海关数据批量导入建档'
              }
            ],
            createdAt: new Date().toISOString().split('T')[0]
          };
        });

        onImportCustomers(parsedCust);
        setSuccessMessage(`成功导入 ${parsedCust.length} 家新 CRM 买家档案！`);
      }

      setTimeout(() => {
        setSuccessMessage(null);
        setPastedCSV('');
        onClose();
      }, 1500);
    } catch (err) {
      alert('解析 CSV 数据失败，请检查格式');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UploadCloud className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-sm">批量导入海关提单 / CRM 客户数据 (CSV / Excel)</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleImportSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">导入目标数据模块:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setImportTarget('bl')}
                className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  importTarget === 'bl' ? 'bg-blue-50 border-blue-500 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                🚢 海关提单数据 (B/L Records)
              </button>

              <button
                type="button"
                onClick={() => setImportTarget('crm')}
                className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  importTarget === 'crm' ? 'bg-blue-50 border-blue-500 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                👥 外贸 CRM 客户档案 (Buyer Leads)
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-700">粘贴 CSV 文本或标准提单字段:</label>
              <button
                type="button"
                onClick={() => setPastedCSV(sampleBLCSV)}
                className="text-blue-600 hover:underline font-bold text-[11px]"
              >
                填入示例海关数据
              </button>
            </div>
            <textarea
              rows={6}
              value={pastedCSV}
              onChange={(e) => setPastedCSV(e.target.value)}
              placeholder="粘贴包含表头的 CSV 数据 (第一行为列名)..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
            >
              确认解析并导入
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
