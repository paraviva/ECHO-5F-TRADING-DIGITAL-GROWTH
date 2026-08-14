import React, { useState } from 'react';
import { 
  DownloadCloud, 
  X, 
  FileSpreadsheet, 
  CheckCircle2, 
  Layers, 
  Ship, 
  Users2 
} from 'lucide-react';
import { CustomsBLRecord, CRMCustomer, ProformaInvoice } from '../types';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: CustomsBLRecord[];
  customers: CRMCustomer[];
  invoices: ProformaInvoice[];
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
  isOpen,
  onClose,
  records,
  customers,
  invoices
}) => {
  if (!isOpen) return null;

  const [exportType, setExportType] = useState<'bl' | 'crm' | 'erp'>('bl');
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel Chinese characters

    if (exportType === 'bl') {
      const headers = ['B/L提单号', '装船日期', '海外买家(Consignee)', '原发货人(Shipper)', '起运港', '目的港', '目的国', 'HS编码', '商品品名描述', '毛重(KG)', '数量', '申报货值(USD)', '贸易条款', '所属行业'];
      csvContent += headers.join(',') + '\n';
      records.forEach(r => {
        const row = [
          `"${r.blNumber}"`,
          `"${r.shipmentDate}"`,
          `"${r.consignee.replace(/"/g, '""')}"`,
          `"${r.shipper.replace(/"/g, '""')}"`,
          `"${r.loadingPort}"`,
          `"${r.destinationPort}"`,
          `"${r.destinationCountry}"`,
          `"${r.hsCode}"`,
          `"${r.productDescription.replace(/"/g, '""')}"`,
          r.grossWeightKg,
          r.quantity,
          r.declaredValueUsd,
          `"${r.incoterm}"`,
          `"${r.industry}"`
        ];
        csvContent += row.join(',') + '\n';
      });
    } else if (exportType === 'crm') {
      const headers = ['客户公司名称', '国家/地区', '所属行业', '商机阶段', '客户评级', '年进口额', '主联系人', '联系人邮箱', 'WhatsApp', '负责人', '创建日期'];
      csvContent += headers.join(',') + '\n';
      customers.forEach(c => {
        const primary = c.contacts[0];
        const row = [
          `"${c.companyName.replace(/"/g, '""')}"`,
          `"${c.country}"`,
          `"${c.industry}"`,
          `"${c.stage}"`,
          `"${c.priority}"`,
          `"${c.annualImportValue}"`,
          `"${primary?.name || ''}"`,
          `"${primary?.email || ''}"`,
          `"${primary?.whatsApp || ''}"`,
          `"${c.assignedSales}"`,
          `"${c.createdAt}"`
        ];
        csvContent += row.join(',') + '\n';
      });
    } else {
      const headers = ['形式发票号(PI)', '发票日期', '客户名称', '目的国', '贸易条款', '目的港', '总金额', '币种', '付款条款', '单证状态'];
      csvContent += headers.join(',') + '\n';
      invoices.forEach(inv => {
        const row = [
          `"${inv.piNumber}"`,
          `"${inv.date}"`,
          `"${inv.customerName.replace(/"/g, '""')}"`,
          `"${inv.country}"`,
          `"${inv.incoterm}"`,
          `"${inv.portOfDestination}"`,
          inv.totalAmount,
          `"${inv.currency}"`,
          `"${inv.paymentTerms.replace(/"/g, '""')}"`,
          `"${inv.status}"`
        ];
        csvContent += row.join(',') + '\n';
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TradeAI_${exportType.toUpperCase()}_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DownloadCloud className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-sm">导出外贸数据报表 (Excel / CSV)</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <label className="block font-bold text-slate-700">选择要导出的数据类型:</label>
          <div className="space-y-2">
            <button
              onClick={() => setExportType('bl')}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                exportType === 'bl' ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Ship className="w-4 h-4 text-blue-600" />
                <span>海关提单明细库 (Customs B/L)</span>
              </div>
              <span className="text-[11px] font-bold">{records.length} 条</span>
            </button>

            <button
              onClick={() => setExportType('crm')}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                exportType === 'crm' ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users2 className="w-4 h-4 text-indigo-600" />
                <span>CRM 买家与联系人名录 (CRM Buyers)</span>
              </div>
              <span className="text-[11px] font-bold">{customers.length} 家</span>
            </button>

            <button
              onClick={() => setExportType('erp')}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                exportType === 'erp' ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>ERP 形式发票与销售合同 (Proforma Invoices)</span>
              </div>
              <span className="text-[11px] font-bold">{invoices.length} 份</span>
            </button>
          </div>

          {downloaded && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>数据导出已开始下载 (UTF-8 Excel 兼容格式)！</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>立即下载 CSV/Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
