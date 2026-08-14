import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Building2, 
  ArrowRight, 
  RefreshCw, 
  UserCheck, 
  Sparkles,
  PhoneCall,
  KeyRound,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout
}) => {
  const [authTab, setAuthTab] = useState<'wechat' | 'phone' | 'password'>('wechat');
  
  // Phone form state
  const [countryCode, setCountryCode] = useState('+86');
  const [phoneNumber, setPhoneNumber] = useState('13888886666');
  const [smsCode, setSmsCode] = useState('');
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // WeChat QR State
  const [qrStatus, setQrStatus] = useState<'ready' | 'scanned' | 'confirmed'>('ready');
  const [qrKey, setQrKey] = useState(Date.now());

  // Password login state
  const [accountEmail, setAccountEmail] = useState('director@globaltrade-ai.com');
  const [accountPassword, setAccountPassword] = useState('TradeAI2026!Pass');
  const [companyTenant, setCompanyTenant] = useState('Zhejiang Precision Machinery Co., Ltd.');

  // Countdown timer effect
  useEffect(() => {
    let timer: any;
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsCountingDown(false);
      setCountdown(60);
    }
    return () => clearTimeout(timer);
  }, [isCountingDown, countdown]);

  if (!isOpen) return null;

  // Send SMS Code
  const handleSendSms = () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      alert('请输入有效的手机号码！');
      return;
    }
    setIsCountingDown(true);
    setSmsCode('886622'); // Auto provide demo verification code
  };

  // Submit Phone Login
  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    if (!smsCode) {
      alert('请输入收到的6位短信验证码 (示例填入: 886622)');
      return;
    }

    const loggedUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: '陈建国 (外贸直营总监)',
      phone: `${countryCode} ${phoneNumber}`,
      email: 'chen.jianguo@precision-machinery.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: '高级外贸运营总监 / 资深外销操盘手',
      companyName: companyTenant || '浙江精工智造进出口实业有限公司',
      wechatNickname: 'TradeMaster_Jack',
      wechatAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isWechatBound: true,
      loginMethod: 'phone_sms',
      lastLoginTime: new Date().toLocaleString()
    };

    onLoginSuccess(loggedUser);
    onClose();
  };

  // Submit WeChat Login
  const handleSimulateWechatScan = () => {
    setQrStatus('scanned');
    setTimeout(() => {
      setQrStatus('confirmed');
      setTimeout(() => {
        const loggedUser: UserProfile = {
          id: `usr-wx-${Date.now()}`,
          name: '林雅婷 (海外业务主管)',
          phone: '+86 13912345678',
          email: 'yating.lin@globaltrade-ai.com',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          role: '海外大客户部业务主管',
          companyName: '浙江精工智造进出口实业有限公司',
          wechatNickname: 'Emily_Lin_Trade',
          wechatAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          isWechatBound: true,
          loginMethod: 'wechat',
          lastLoginTime: new Date().toLocaleString()
        };
        onLoginSuccess(loggedUser);
        onClose();
      }, 700);
    }, 800);
  };

  // Submit Password Login
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const loggedUser: UserProfile = {
      id: `usr-pwd-${Date.now()}`,
      name: '张立新 (外贸合伙人)',
      phone: '+86 13700009999',
      email: accountEmail,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: '跨境贸易合伙人 / 供应链风控总监',
      companyName: companyTenant,
      wechatNickname: 'Alex_Zhang_Global',
      isWechatBound: false,
      loginMethod: 'password',
      lastLoginTime: new Date().toLocaleString()
    };
    onLoginSuccess(loggedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 pb-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">企业用户安全登录</h3>
              <p className="text-xs text-slate-300">全球海关数据 CRM & 外贸智能 ERP 协同平台</p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/60 mt-4 text-xs font-bold">
            <button
              onClick={() => setAuthTab('wechat')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                authTab === 'wechat'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>微信扫码登录</span>
            </button>
            <button
              onClick={() => setAuthTab('phone')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                authTab === 'phone'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>手机号快捷登录</span>
            </button>
            <button
              onClick={() => setAuthTab('password')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                authTab === 'password'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>账号密码</span>
            </button>
          </div>
        </div>

        {/* Tab 1: WeChat Login */}
        {authTab === 'wechat' && (
          <div className="p-6 text-center space-y-5">
            <div className="relative inline-block bg-slate-50 p-4 rounded-3xl border border-slate-200 shadow-inner">
              {/* Simulated QR Code with WeChat Brand Colors */}
              <div className="w-48 h-48 bg-white p-3 rounded-2xl border-2 border-emerald-500/30 flex flex-col items-center justify-center relative overflow-hidden group">
                <svg className="w-40 h-40 text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                  {/* Stylized QR Code Pattern */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="#07C160" fillOpacity="0.15" stroke="#07C160" strokeWidth="3" />
                  <rect x="11" y="11" width="16" height="16" rx="2" fill="#07C160" />
                  
                  <rect x="67" y="5" width="28" height="28" rx="4" fill="#07C160" fillOpacity="0.15" stroke="#07C160" strokeWidth="3" />
                  <rect x="73" y="11" width="16" height="16" rx="2" fill="#07C160" />
                  
                  <rect x="5" y="67" width="28" height="28" rx="4" fill="#07C160" fillOpacity="0.15" stroke="#07C160" strokeWidth="3" />
                  <rect x="11" y="73" width="16" height="16" rx="2" fill="#07C160" />
                  
                  {/* Inner matrix data cells */}
                  <circle cx="45" cy="15" r="3" />
                  <circle cx="55" cy="15" r="3" />
                  <circle cx="40" cy="28" r="3" />
                  <circle cx="58" cy="28" r="3" />
                  <circle cx="15" cy="45" r="3" />
                  <circle cx="28" cy="45" r="3" />
                  <circle cx="85" cy="45" r="3" />
                  <circle cx="72" cy="45" r="3" />
                  
                  <rect x="42" y="42" width="16" height="16" rx="4" fill="#0f172a" />
                  <circle cx="50" cy="50" r="4" fill="#07C160" />
                  
                  <circle cx="40" cy="70" r="3" />
                  <circle cx="55" cy="70" r="3" />
                  <circle cx="70" cy="70" r="3" />
                  <circle cx="85" cy="70" r="3" />
                  <circle cx="48" cy="85" r="3" />
                  <circle cx="62" cy="85" r="3" />
                  <circle cx="78" cy="85" r="3" />
                </svg>

                {/* QR State Overlays */}
                {qrStatus === 'scanned' && (
                  <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 animate-fadeIn">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce mb-2" />
                    <p className="font-bold text-xs">已扫描，请在手机微信上确认</p>
                  </div>
                )}

                {qrStatus === 'confirmed' && (
                  <div className="absolute inset-0 bg-emerald-600/90 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 animate-fadeIn">
                    <Check className="w-12 h-12 text-white mb-2" />
                    <p className="font-black text-sm">授权成功，正在进入系统...</p>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-center space-x-2 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>微信开放平台安全扫码协议</span>
                <button 
                  onClick={() => { setQrKey(Date.now()); setQrStatus('ready'); }}
                  className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5 ml-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>刷新</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-medium">
                请打开手机 <span className="font-bold text-emerald-600">微信</span> 扫描二维码以绑定/登录企业外贸账号
              </p>

              {/* Quick Simulation One-Click Trigger */}
              <button
                type="button"
                onClick={handleSimulateWechatScan}
                disabled={qrStatus !== 'ready'}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/20 text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>微信一键模拟扫码授权进入</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Mobile Phone SMS Login */}
        {authTab === 'phone' && (
          <form onSubmit={handlePhoneLogin} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">手机号码 (Mobile Number):</label>
              <div className="flex rounded-xl shadow-xs border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-slate-100 text-slate-800 font-bold px-3 py-2.5 border-r border-slate-200 outline-hidden cursor-pointer"
                >
                  <option value="+86">中国大陆 +86</option>
                  <option value="+852">中国香港 +852</option>
                  <option value="+886">中国台湾 +886</option>
                  <option value="+1">美国/加拿大 +1</option>
                  <option value="+44">英国 +44</option>
                  <option value="+49">德国 +49</option>
                  <option value="+65">新加坡 +65</option>
                  <option value="+81">日本 +81</option>
                </select>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="请输入11位手机号"
                  className="flex-1 px-3.5 py-2.5 bg-white text-slate-900 font-bold outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">短信动态验证码 (SMS Code):</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    placeholder="输入6位验证码"
                    maxLength={6}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl font-mono text-sm tracking-wider font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendSms}
                  disabled={isCountingDown}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all text-xs shrink-0 cursor-pointer ${
                    isCountingDown
                      ? 'bg-slate-100 text-slate-400 border border-slate-200'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  {isCountingDown ? `${countdown}s 后重发` : '获取验证码'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span>提示: 点击获取验证码将自动填入免打扰测试码</span>
                <span className="font-mono font-bold text-blue-600">886622</span>
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">所属企业/机构全称 (Company Name):</label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={companyTenant}
                  onChange={(e) => setCompanyTenant(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Agreement */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-500 cursor-pointer">
                我已阅读并同意 <span className="text-blue-600 hover:underline">《企业外贸数据使用规范》</span> 与 <span className="text-blue-600 hover:underline">《隐私保护政策》</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!agreeTerms}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-600/20 text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Smartphone className="w-4 h-4" />
              <span>手机号验证并快捷登录</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 3: Enterprise Account & Password */}
        {authTab === 'password' && (
          <form onSubmit={handlePasswordLogin} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">企业工作邮箱 (Enterprise Email):</label>
              <input
                type="email"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">登录密码 (Password):</label>
              <input
                type="password"
                value={accountPassword}
                onChange={(e) => setAccountPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">关联企业主体 (Enterprise Tenant):</label>
              <input
                type="text"
                value={companyTenant}
                onChange={(e) => setCompanyTenant(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl shadow-lg shadow-slate-900/20 text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>企业账号安全登录</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer Security Badges */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-bit 银行级海关密钥传输加密</span>
          </div>
          <span>多端数据实时云同步</span>
        </div>
      </div>
    </div>
  );
};
