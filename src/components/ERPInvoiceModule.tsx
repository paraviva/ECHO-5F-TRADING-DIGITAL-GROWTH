import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Globe2, 
  DollarSign, 
  FileText, 
  Trash2, 
  Eye, 
  X,
  Edit,
  Send
} from 'lucide-react';
import { ProformaInvoice, InvoiceItem, CRMCustomer } from '../types';

interface ERPInvoiceModuleProps {
  invoices: ProformaInvoice[];
  customers: CRMCustomer[];
  onSaveInvoice: (invoice: ProformaInvoice) => void;
  onDeleteInvoice: (invoiceId: string) => void;
}

export const ERPInvoiceModule: React.FC<ERPInvoiceModuleProps> = ({
  invoices,
  customers,
  onSaveInvoice,
  onDeleteInvoice
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部状态');
  
  // Modals
  const [editingInvoice, setEditingInvoice] = useState<ProformaInvoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<ProformaInvoice | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State for creating/editing PI
  const [formCustomer, setFormCustomer] = useState(customers[0]?.companyName || '');
  const [formPiNumber, setFormPiNumber] = useState(`PI-${new Date().toISOString().split('T')[0]}-0${invoices.length + 1}`);
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formValidUntil, setFormValidUntil] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [formIncoterm, setFormIncoterm] = useState<ProformaInvoice['incoterm']>('FOB');
  const [formLoadingPort, setFormLoadingPort] = useState('Ningbo Port / Shanghai Port, China');
  const [formDestinationPort, setFormDestinationPort] = useState('Port of Los Angeles (USLAX)');
  const [formCurrency, setFormCurrency] = useState<ProformaInvoice['currency']>('USD');
  const [formPaymentTerms, setFormPaymentTerms] = useState('30% T/T Deposit upon confirmation, 70% Balance against B/L copy');
  const [formLeadTime, setFormLeadTime] = useState(25);
  const [formSellerCompany, setFormSellerCompany] = useState('Sino-Global Industrial Precision Manufacturing Co., Ltd.');
  const [formSellerBank, setFormSellerBank] = useState('Bank of China, Shanghai Branch | SWIFT: BKCHCNBJ300 | A/C: 4528 9201 8492 0192 (USD)');
  const [formNotes, setFormNotes] = useState('Prices include export standard fumigated wooden pallets and laser engraving OEM logo.');
  
  const [formItems, setFormItems] = useState<InvoiceItem[]>([
    {
      id: 'item-1',
      productName: 'High Precision Gearbox Unit / Hub Bearing',
      itemModel: 'MODEL-PRO-2026',
      hsCode: '8483.40.50',
      specs: 'Standard Export Grade, ISO 9001 Tested, Anti-rust oil coated',
      quantity: 2000,
      unit: 'SETS',
      unitPrice: 32.50,
      totalPrice: 65000.00
    }
  ]);
  const [formFreight, setFormFreight] = useState(0);
  const [formInsurance, setFormInsurance] = useState(0);

  const openCreateModal = () => {
    setFormPiNumber(`PI-${new Date().toISOString().split('T')[0]}-0${invoices.length + 1}`);
    setFormDate(new Date().toISOString().split('T')[0]);
    setIsCreateOpen(true);
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      productName: 'New Product Item',
      itemModel: 'SPEC-001',
      hsCode: '8482.10.00',
      specs: 'Export Standard Specification',
      quantity: 1000,
      unit: 'PCS',
      unitPrice: 10.00,
      totalPrice: 10000.00
    };
    setFormItems([...formItems, newItem]);
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, val: any) => {
    setFormItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: val };
        if (field === 'quantity' || field === 'unitPrice') {
          const q = field === 'quantity' ? Number(val) : item.quantity;
          const p = field === 'unitPrice' ? Number(val) : item.unitPrice;
          updated.totalPrice = Math.round(q * p * 100) / 100;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (formItems.length <= 1) return;
    setFormItems(formItems.filter(i => i.id !== id));
  };

  const subtotal = formItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const totalAmount = subtotal + Number(formFreight || 0) + Number(formInsurance || 0);

  const handleSaveInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedCust = customers.find(c => c.companyName === formCustomer) || customers[0];
    const newInvoice: ProformaInvoice = {
      id: editingInvoice ? editingInvoice.id : `pi-${Date.now()}`,
      piNumber: formPiNumber,
      date: formDate,
      validUntil: formValidUntil,
      customerId: matchedCust?.id || 'cust-generic',
      customerName: matchedCust?.companyName || formCustomer,
      country: matchedCust?.country || 'United States',
      buyerAddress: `${matchedCust?.country || 'USA'} Commercial District`,
      buyerContact: matchedCust?.contacts[0]?.name || 'Purchasing Director',
      buyerEmail: matchedCust?.contacts[0]?.email || 'sourcing@buyer.com',
      sellerCompany: formSellerCompany,
      sellerBankDetails: formSellerBank,
      incoterm: formIncoterm,
      portOfLoading: formLoadingPort,
      portOfDestination: formDestinationPort,
      currency: formCurrency,
      items: formItems,
      subtotal,
      freightCost: Number(formFreight || 0),
      insuranceCost: Number(formInsurance || 0),
      totalAmount,
      paymentTerms: formPaymentTerms,
      leadTimeDays: Number(formLeadTime || 25),
      status: editingInvoice ? editingInvoice.status : 'Sent to Buyer',
      notes: formNotes
    };

    onSaveInvoice(newInvoice);
    setIsCreateOpen(false);
    setEditingInvoice(null);
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchPi = inv.piNumber.toLowerCase().includes(term);
      const matchCust = inv.customerName.toLowerCase().includes(term);
      const matchCountry = inv.country.toLowerCase().includes(term);
      if (!matchPi && !matchCust && !matchCountry) return false;
    }
    if (statusFilter !== '全部状态' && inv.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Control Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              <span>外贸 ERP 单证中心：形式发票 (PI) & 销售合同管理</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              自动核算 FOB/CIF/DDP 离岸总价、多币种转换、外汇收款账户核对、支持一键打印/导出标准商业 PI
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>新建形式发票 (Create PI)</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索 PI 单号、客户名称、目的国..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="全部状态">单证状态：全部 (All Status)</option>
              <option value="Draft">Draft 草稿</option>
              <option value="Sent to Buyer">Sent to Buyer 已发客户</option>
              <option value="Confirmed">Confirmed 客户已确认</option>
              <option value="Deposit Received">Deposit Received 已收定金</option>
              <option value="In Production">In Production 工厂排产中</option>
              <option value="Shipped">Shipped 已装船出运</option>
              <option value="Completed">Completed 结案归档</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {filteredInvoices.map((inv) => (
          <div
            key={inv.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between space-y-4 hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <span className="font-mono font-extrabold text-xs text-blue-700">{inv.piNumber}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">签约日期: {inv.date}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  inv.status === 'Deposit Received' || inv.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {inv.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 truncate" title={inv.customerName}>
                  {inv.customerName}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{inv.country}</span>
                  <span>•</span>
                  <span className="font-bold text-blue-600">{inv.incoterm}</span>
                  <span>•</span>
                  <span>{inv.portOfDestination}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>订单商品总项:</span>
                  <strong className="text-slate-900">{inv.items.length} 种品类</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>发票总金额 ({inv.currency}):</span>
                  <strong className="text-emerald-600 font-extrabold text-sm">
                    ${inv.totalAmount.toLocaleString()} {inv.currency}
                  </strong>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 truncate">
                  条款: {inv.paymentTerms}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setViewingInvoice(inv)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>预览/打印 PI</span>
              </button>

              <button
                onClick={() => onDeleteInvoice(inv.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="删除 PI"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Proforma Invoice Preview Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-sm">PROFORMA INVOICE (形式发票标准打印预览)</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印 / 另存为 PDF</span>
                </button>
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Paper */}
            <div className="p-8 overflow-y-auto space-y-6 text-xs text-slate-800 font-sans print:p-0">
              
              {/* Top Seller Banner */}
              <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    {viewingInvoice.sellerCompany}
                  </h1>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Direct Manufacturer & International Trade Exporter
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Headquarters: Free Trade Zone, Shanghai / Ningbo Port Industrial Zone, China
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-blue-700 tracking-wider">PROFORMA INVOICE</div>
                  <div className="font-mono font-bold text-slate-900 mt-1">NO: {viewingInvoice.piNumber}</div>
                  <div className="text-slate-500 text-[11px]">DATE: {viewingInvoice.date}</div>
                  <div className="text-slate-500 text-[11px]">VALID UNTIL: {viewingInvoice.validUntil}</div>
                </div>
              </div>

              {/* Buyer & Delivery Info */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 uppercase text-[10px] text-slate-400 mb-1">
                    BILL TO / BUYER:
                  </div>
                  <div className="font-bold text-sm text-slate-900">{viewingInvoice.customerName}</div>
                  <div className="text-slate-600 text-[11px] mt-0.5">{viewingInvoice.buyerAddress}</div>
                  <div className="text-slate-600 text-[11px]">
                    Attn: {viewingInvoice.buyerContact} ({viewingInvoice.buyerEmail})
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-900 uppercase text-[10px] text-slate-400 mb-1">
                    SHIPPING & TRADE TERMS:
                  </div>
                  <div className="text-slate-700">
                    <strong>Trade Incoterm:</strong> {viewingInvoice.incoterm}
                  </div>
                  <div className="text-slate-700">
                    <strong>Port of Loading:</strong> {viewingInvoice.portOfLoading}
                  </div>
                  <div className="text-slate-700">
                    <strong>Port of Destination:</strong> {viewingInvoice.portOfDestination}
                  </div>
                  <div className="text-slate-700">
                    <strong>Production Lead Time:</strong> {viewingInvoice.leadTimeDays} Days
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white font-bold">
                    <tr>
                      <th className="p-2.5 text-center w-10">NO.</th>
                      <th className="p-2.5">PRODUCT & SPECIFICATION</th>
                      <th className="p-2.5">HS CODE</th>
                      <th className="p-2.5 text-right">QTY</th>
                      <th className="p-2.5 text-center">UNIT</th>
                      <th className="p-2.5 text-right">UNIT PRICE ({viewingInvoice.currency})</th>
                      <th className="p-2.5 text-right">TOTAL AMOUNT ({viewingInvoice.currency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {viewingInvoice.items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-2.5">
                          <div className="font-bold text-slate-900">{item.productName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">Model: {item.itemModel} | {item.specs}</div>
                        </td>
                        <td className="p-2.5 font-mono text-slate-700">{item.hsCode}</td>
                        <td className="p-2.5 text-right font-bold">{item.quantity.toLocaleString()}</td>
                        <td className="p-2.5 text-center">{item.unit}</td>
                        <td className="p-2.5 text-right">${item.unitPrice.toFixed(2)}</td>
                        <td className="p-2.5 text-right font-bold text-slate-900">
                          ${item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold">
                    <tr>
                      <td colSpan={6} className="p-2.5 text-right text-slate-700">SUBTOTAL:</td>
                      <td className="p-2.5 text-right font-bold text-slate-900">
                        ${viewingInvoice.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    {viewingInvoice.freightCost > 0 && (
                      <tr>
                        <td colSpan={6} className="p-2 text-right text-slate-700">FREIGHT CHARGES:</td>
                        <td className="p-2 text-right text-slate-900">${viewingInvoice.freightCost.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr className="bg-blue-50 text-blue-950 text-sm">
                      <td colSpan={6} className="p-3 text-right font-extrabold">TOTAL AMOUNT ({viewingInvoice.currency}):</td>
                      <td className="p-3 text-right font-extrabold text-emerald-700">
                        ${viewingInvoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {viewingInvoice.currency}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Payment Terms & Bank Instructions */}
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 uppercase text-[11px]">PAYMENT TERMS:</div>
                  <p className="text-slate-700 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium">
                    {viewingInvoice.paymentTerms}
                  </p>

                  <div className="font-bold text-slate-900 uppercase text-[11px] pt-1">REMARKS & PACKING:</div>
                  <p className="text-slate-600 text-[11px]">{viewingInvoice.notes}</p>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-slate-900 uppercase text-[11px]">BENEFICIARY BANK ACCOUNT:</div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] font-mono space-y-1 text-slate-700">
                    <div>{viewingInvoice.sellerBankDetails}</div>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="font-bold text-slate-900">ACCEPTED & CONFIRMED BY BUYER:</div>
                  <div className="border-b border-slate-400 w-48" />
                  <div className="text-[11px] text-slate-400">Authorized Signature & Company Stamp</div>
                </div>
                <div className="space-y-8 text-right">
                  <div className="font-bold text-slate-900">FOR AND ON BEHALF OF SELLER:</div>
                  <div className="border-b border-slate-400 w-48 ml-auto" />
                  <div className="text-[11px] text-slate-400">Authorized Signature & Company Seal</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Create / Edit PI Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-base">新建形式发票 (Create Proforma Invoice)</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInvoiceSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">形式发票号 (PI No.):</label>
                  <input
                    type="text"
                    value={formPiNumber}
                    onChange={(e) => setFormPiNumber(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">关联客户 (Customer):</label>
                  <select
                    value={formCustomer}
                    onChange={(e) => setFormCustomer(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.companyName}>{c.companyName} ({c.country})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">贸易条款 (Incoterm):</label>
                  <select
                    value={formIncoterm}
                    onChange={(e) => setFormIncoterm(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="FOB">FOB 离岸价</option>
                    <option value="CIF">CIF 到岸价</option>
                    <option value="CFR">CFR 成本加运费</option>
                    <option value="DDP">DDP 完税后交货</option>
                    <option value="EXW">EXW 工厂交货</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">起运港 (Port of Loading):</label>
                  <input
                    type="text"
                    value={formLoadingPort}
                    onChange={(e) => setFormLoadingPort(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">目的港 (Port of Destination):</label>
                  <input
                    type="text"
                    value={formDestinationPort}
                    onChange={(e) => setFormDestinationPort(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Items Table in Form */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">发票明细行 (Invoice Line Items):</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加一行商品</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formItems.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={item.productName}
                          onChange={(e) => handleItemChange(item.id, 'productName', e.target.value)}
                          placeholder="商品名称"
                          className="w-full p-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={item.hsCode}
                          onChange={(e) => handleItemChange(item.id, 'hsCode', e.target.value)}
                          placeholder="HS 编码"
                          className="w-full p-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                          placeholder="数量"
                          className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-right font-bold"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                          placeholder="单价"
                          className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-right font-bold text-emerald-700"
                        />
                      </div>
                      <div className="col-span-2 text-right font-extrabold text-slate-900">
                        ${item.totalPrice.toFixed(2)}
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 p-3 rounded-xl flex justify-between items-center text-sm font-extrabold text-blue-950">
                  <span>总计 (Grand Total):</span>
                  <span className="text-emerald-700">${totalAmount.toFixed(2)} USD</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">付款条款 (Payment Terms):</label>
                <input
                  type="text"
                  value={formPaymentTerms}
                  onChange={(e) => setFormPaymentTerms(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  保存并生成发票
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
