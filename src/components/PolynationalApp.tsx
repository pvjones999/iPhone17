import React, { useState, useEffect } from 'react';
import { 
  Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Settings, Plus, Check, ChevronRight, 
  CreditCard, Wallet, Send, User, Copy, Moon, Sun, ArrowLeft, RefreshCw, X, HelpCircle,
  Globe, ShieldCheck, Download, Layers, CheckCircle, AlertCircle
} from 'lucide-react';

interface PolynationalAppProps {
  systemTime: Date;
  onTriggerNotification: (title: string, body: string) => void;
  addLog: (msg: string) => void;
  pendingPayment?: any | null;
  setPendingPayment?: (payment: any | null) => void;
}

interface WalletItem {
  id: 'usd' | 'eur' | 'gbp' | 'ngn';
  name: string;
  symbol: string;
  flag: string;
  balance: number;
}

interface PNTransaction {
  id: string;
  type: 'Credit' | 'Debit' | 'Exchange';
  source: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'NGN';
  timestamp: string;
}

export const PolynationalApp: React.FC<PolynationalAppProps> = ({
  systemTime,
  onTriggerNotification,
  addLog,
  pendingPayment,
  setPendingPayment
}) => {
  // Navigation layout: 'dashboard' | 'wire' | 'bridge' | 'cards' | 'settings' | 'receipt'
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'wire' | 'bridge' | 'cards' | 'settings' | 'receipt'>('dashboard');

  // Core wallets persistence
  const [wallets, setWallets] = useState<Record<'usd' | 'eur' | 'gbp' | 'ngn', number>>(() => {
    const saved = localStorage.getItem('polynational_wallets');
    return saved ? JSON.parse(saved) : { usd: 5000, eur: 4200, gbp: 3500, ngn: 1500000 };
  });

  // Save wallets to localstorage
  useEffect(() => {
    localStorage.setItem('polynational_wallets', JSON.stringify(wallets));
  }, [wallets]);

  // General settings persistence
  const [profile, setProfile] = useState<{ name: string; kycStatus: string; defaultCurrency: 'usd' | 'eur' | 'gbp' | 'ngn' }>(() => {
    const saved = localStorage.getItem('polynational_profile');
    return saved ? JSON.parse(saved) : { name: 'Edward Azubuike', kycStatus: 'Tier 3 Verified', defaultCurrency: 'usd' };
  });

  useEffect(() => {
    localStorage.setItem('polynational_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      const fn = localStorage.getItem('ios_firstName') || 'Edward';
      const ln = localStorage.getItem('ios_lastName') || 'Azubuike';
      setProfile(prev => ({ ...prev, name: `${fn} ${ln}` }));
    };
    handleProfileUpdate();
    window.addEventListener('monipay_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('monipay_profile_updated', handleProfileUpdate);
  }, []);

  // Card details persistence
  const [card, setCard] = useState<{ number: string; cvv: string; expiry: string }>(() => {
    const saved = localStorage.getItem('polynational_card');
    return saved ? JSON.parse(saved) : { number: '5543 9012 5543 1892', cvv: '707', expiry: '12/32' };
  });

  useEffect(() => {
    localStorage.setItem('polynational_card', JSON.stringify(card));
  }, [card]);

  // Global Ledger Transactions persistence
  const [transactions, setTransactions] = useState<PNTransaction[]>(() => {
    const saved = localStorage.getItem('polynational_transactions');
    return saved ? JSON.parse(saved) : [
      { id: 'pn_tx_1', type: 'Credit', source: 'Apple Pay Funding', amount: 1200, currency: 'USD', timestamp: 'May 23, 2:10 PM' },
      { id: 'pn_tx_2', type: 'Exchange', source: 'Converted USD to EUR', amount: 450, currency: 'EUR', timestamp: 'May 22, 11:30 AM' },
      { id: 'pn_tx_3', type: 'Exchange', source: 'Converted GBP to NGN', amount: 156000, currency: 'NGN', timestamp: 'May 19, 9:20 AM' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('polynational_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Sync state dynamically if an external event modification happens (e.g. from Shopit checkout deduction)
  useEffect(() => {
    const handleExternalUpdate = () => {
      const savedWallets = localStorage.getItem('polynational_wallets');
      if (savedWallets !== null) {
        setWallets(JSON.parse(savedWallets));
      }
      const savedTransactions = localStorage.getItem('polynational_transactions');
      if (savedTransactions) {
        try {
          setTransactions(JSON.parse(savedTransactions));
        } catch (e) {}
      }
    };

    window.addEventListener('polynational_external_update', handleExternalUpdate);
    return () => {
      window.removeEventListener('polynational_external_update', handleExternalUpdate);
    };
  }, []);

  // UI state
  const [isMasked, setIsMasked] = useState<boolean>(false);
  const [activeWalletIndex, setActiveWalletIndex] = useState<number>(0);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Modals / Overlays
  const [isProcessingOverlay, setIsProcessingOverlay] = useState<boolean>(false);
  const [processingText, setProcessingText] = useState<string>('');

  // Form Conversion details
  const [convertFrom, setConvertFrom] = useState<'usd' | 'eur' | 'gbp' | 'ngn'>('usd');
  const [convertTo, setConvertTo] = useState<'usd' | 'eur' | 'gbp' | 'ngn'>('ngn');
  const [convertAmount, setConvertAmount] = useState<string>('');
  const [isConvertOpen, setIsConvertOpen] = useState<boolean>(false);

  // Form Add money details
  const [addMoneyOpen, setAddMoneyOpen] = useState<boolean>(false);
  const [addWallet, setAddWallet] = useState<'usd' | 'eur' | 'gbp' | 'ngn'>('usd');
  const [addAmount, setAddAmount] = useState<string>('');
  const [addSource, setAddSource] = useState<'apple_pay' | 'debit_card' | 'bank_wire'>('apple_pay');
  const [addCardName, setAddCardName] = useState<string>('');
  const [addCardNum, setAddCardNum] = useState<string>('');
  const [addWireBank, setAddWireBank] = useState<string>('');
  const [addWireSender, setAddWireSender] = useState<string>('');
  const [addMoneyError, setAddMoneyError] = useState<string>('');

  // Form Send Globally details (International Wire)
  const [wireFrom, setWireFrom] = useState<'usd' | 'eur' | 'gbp'>('usd');
  const [wireCountry, setWireCountry] = useState<string>('United States 🇺🇸');
  const [wireCountryFlag, setWireCountryFlag] = useState<string>('🇺🇸');
  const [wireName, setWireName] = useState<string>('');
  const [wireIban, setWireIban] = useState<string>('');
  const [wireSwift, setWireSwift] = useState<string>('');
  const [wireAmount, setWireAmount] = useState<string>('');
  const [wireError, setWireError] = useState<string>('');

  useEffect(() => {
    if (pendingPayment && pendingPayment.bankType === 'polynational') {
      setWireFrom('usd');
      setWireCountry('Switzerland 🇨🇭');
      setWireCountryFlag('🇨🇭');
      setWireSwift('CHSWZZ44XXX');
      setWireName(pendingPayment.recipient);
      setWireIban(pendingPayment.iban || 'CH89 0000 1234 5678 9012 3');
      setWireAmount(String(pendingPayment.amount));
      setWireError('');
      setCurrentScreen('wire');
    }
  }, [pendingPayment]);

  // Form Fintech Bridge details (MoniPay transfer)
  const [bridgeAccount, setBridgeAccount] = useState<string>('');
  const [bridgeResolvedName, setBridgeResolvedName] = useState<string>('');
  const [isValidatingBridge, setIsValidatingBridge] = useState<boolean>(false);
  const [bridgeAmount, setBridgeAmount] = useState<string>('');
  const [bridgeError, setBridgeError] = useState<string>('');

  // Active success receipt reference
  const [activeReceipt, setActiveReceipt] = useState<{
    type: 'wire' | 'bridge';
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'NGN';
    recipientName: string;
    recipientDetails: string;
    rateApplied: string;
    refId: string;
    timeStr: string;
  } | null>(null);

  const handleOpenReceipt = (tx: PNTransaction) => {
    setActiveReceipt({
      type: tx.type === 'Exchange' ? 'bridge' : 'wire',
      amount: tx.amount,
      currency: tx.currency,
      recipientName: tx.type === 'Credit' ? 'Edward Azubuike' : tx.source.replace('Wire to ', '').replace('Bridge: ', ''),
      recipientDetails: tx.type === 'Credit' ? 'Deposited dynamically via Interbank SWIFT Network' : tx.type === 'Exchange' ? 'Account Swap / Convertible Portfolio operation' : `SWIFT International Interbank Remittance`,
      rateApplied: tx.type === 'Exchange' ? 'Dynamic Convertible exchange-rate index' : '1.0000 (Standard Settlement Value)',
      refId: `PLN-WT-${tx.id.replace('pn_wire_', '').replace('pn_bridge_', '').replace('pn_convert_', '').substring(0, 8)}-WT`,
      timeStr: tx.timestamp
    });
    setCurrentScreen('receipt');
  };

  const walletConfigs: Record<'usd' | 'eur' | 'gbp' | 'ngn', { name: string; symbol: string; flag: string }> = {
    usd: { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    eur: { name: 'Euro Wallet', symbol: '€', flag: '🇪🇺' },
    gbp: { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    ngn: { name: 'Naira Account', symbol: '₦', flag: '🇳🇬' }
  };

  const exchangeRates: Record<string, Record<string, number>> = {
    usd: { usd: 1, eur: 0.92, gbp: 0.78, ngn: 1550 },
    eur: { usd: 1 / 0.92, eur: 1, gbp: 0.85, ngn: 1680 },
    gbp: { usd: 1 / 0.78, eur: 1 / 0.85, gbp: 1, ngn: 1980 },
    ngn: { usd: 1 / 1550, eur: 1 / 1680, gbp: 1 / 1980, ngn: 1 }
  };

  // Convert funds handler
  const handleConvertFunds = () => {
    const amt = parseFloat(convertAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid conversion amount.');
      return;
    }
    if (wallets[convertFrom] < amt) {
      alert(`Insufficient balance in your high-end ${convertFrom.toUpperCase()} wallet.`);
      return;
    }

    const rate = exchangeRates[convertFrom][convertTo];
    const targetAmt = amt * rate;

    setWallets(prev => {
      const next = { ...prev };
      next[convertFrom] = parseFloat((next[convertFrom] - amt).toFixed(2));
      next[convertTo] = parseFloat((next[convertTo] + targetAmt).toFixed(2));
      return next;
    });

    const txTime = systemTime.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newTx: PNTransaction = {
      id: 'pn_exch_' + Date.now(),
      type: 'Exchange',
      source: `Swapped ${convertFrom.toUpperCase()} to ${convertTo.toUpperCase()}`,
      amount: targetAmt,
      currency: convertTo.toUpperCase() as any,
      timestamp: txTime
    };

    setTransactions(prev => [newTx, ...prev]);
    addLog(`Polynational: Swapped ${walletConfigs[convertFrom].symbol}${amt} to ${walletConfigs[convertTo].symbol}${targetAmt.toFixed(2)}`);

    // Dispatch mail notification for swap/conversion
    window.dispatchEvent(new CustomEvent('send_virtual_mail', {
      detail: {
        sender: 'Polynational Swiss Bank',
        subject: 'Currency Exchange Execution Advice',
        preview: `Swapped ${walletConfigs[convertFrom].symbol}${amt.toLocaleString()} to ${walletConfigs[convertTo].symbol}${targetAmt.toLocaleString(undefined, {minimumFractionDigits: 2})}.`,
        body: `Dear Edward Azubuike,\n\nWe are pleased to advise that your Currency Swap order has been executed successfully on our elite Swiss ledger network.\n\nExecution Details:\n- Exchange Ref: PN-EXCH-${Date.now()}\n- Sold Amount: ${walletConfigs[convertFrom].symbol}${amt.toLocaleString()} (${convertFrom.toUpperCase()})\n- Purchased Amount: ${walletConfigs[convertTo].symbol}${targetAmt.toLocaleString(undefined, {minimumFractionDigits: 2})} (${convertTo.toUpperCase()})\n- Execution Rate: 1 ${convertFrom.toUpperCase()} = ${rate} ${convertTo.toUpperCase()}\n- Value Date: ${txTime}\n\nYour portfolio state balances have updated live. Thank you for banking with Polynational Asset Management.`
      }
    }));

    onTriggerNotification("Polynational", `Exchange completed: ${walletConfigs[convertFrom].symbol}${amt} swapped for ${walletConfigs[convertTo].symbol}${targetAmt.toLocaleString(undefined, {minimumFractionDigits: 2})}`);

    // clear
    setConvertAmount('');
    setIsConvertOpen(false);
  };

  // Add Money handler
  const handleAddMoneySubmit = () => {
    setAddMoneyError('');
    const amt = parseFloat(addAmount);
    if (isNaN(amt) || amt <= 0) {
      setAddMoneyError('Please enter a valid deposit amount greater than zero.');
      return;
    }

    if (addSource === 'debit_card') {
      if (!addCardName.trim()) {
        setAddMoneyError('Please enter the Cardholder Name.');
        return;
      }
      if (addCardNum.trim().replace(/\s/g, '').length !== 16) {
        setAddMoneyError('Please enter a valid 16-digit Card Number.');
        return;
      }
    } else if (addSource === 'bank_wire') {
      if (!addWireSender.trim()) {
        setAddMoneyError('Please enter the Sender Full Name.');
        return;
      }
      if (!addWireBank.trim()) {
        setAddMoneyError('Please enter the Sender Bank Name.');
        return;
      }
    }

    // Processing starts (3-Seconds rule)
    setProcessingText('Processing Deposit...');
    setIsProcessingOverlay(true);

    setTimeout(() => {
      setIsProcessingOverlay(false);
      
      setWallets(prev => {
        const next = { ...prev };
        next[addWallet] = parseFloat((next[addWallet] + amt).toFixed(2));
        return next;
      });

      const txTime = systemTime.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newTx: PNTransaction = {
        id: 'pn_dep_' + Date.now(),
        type: 'Credit',
        source: addSource === 'apple_pay' ? 'Apple Pay' : addSource === 'debit_card' ? 'Visa / Mastercard' : 'Bank SWIFT Wire',
        amount: amt,
        currency: addWallet.toUpperCase() as any,
        timestamp: txTime
      };

      setTransactions(prev => [newTx, ...prev]);
      addLog(`Polynational: Deposited ${walletConfigs[addWallet].symbol}${amt}`);

      // Dispatch mail notification for Deposit
      window.dispatchEvent(new CustomEvent('send_virtual_mail', {
        detail: {
          sender: 'Polynational Swiss Bank',
          subject: 'Credit Notice: Inbound Capital Funding',
          preview: `Deposit of ${walletConfigs[addWallet].symbol}${amt.toLocaleString()} received on Swiss Vaults.`,
          body: `Dear Edward Azubuike,\n\nWe notify you of an incoming capital funding credit on your standard ledger Account.\n\nDescription:\n- Originating Channel: ${newTx.source}\n- Amount received: +${walletConfigs[addWallet].symbol}${amt.toLocaleString()} (${addWallet.toUpperCase()})\n- System Timestamp: ${txTime}\n\nYour portfolio balances have updated live. Log into your Polynational virtual gateway to view available assets.\n\nThank you for choosing Polynational Asset Management.`
        }
      }));

      onTriggerNotification("Polynational Success", `Deposit Successful: ${walletConfigs[addWallet].symbol}${amt.toLocaleString()} added to your wallet.`);

      // Reset
      setAddAmount('');
      setAddCardName('');
      setAddCardNum('');
      setAddWireBank('');
      setAddWireSender('');
      setAddMoneyOpen(false);
    }, 3000);
  };

  // Resolve country flag when selected
  const handleCountryChange = (c: string) => {
    setWireCountry(c);
    if (c.includes('USA')) setWireCountryFlag('🇺🇸');
    if (c.includes('Canada')) setWireCountryFlag('🇨🇦');
    if (c.includes('Germany')) setWireCountryFlag('🇩🇪');
    if (c.includes('France')) setWireCountryFlag('🇫🇷');
    if (c.includes('United Kingdom')) setWireCountryFlag('🇬🇧');
    if (c.includes('Australia')) setWireCountryFlag('🇦🇺');
  };

  // Send Globally Wire Transfer handler
  const handleAuthorizeWire = () => {
    setWireError('');
    const amt = parseFloat(wireAmount);
    if (isNaN(amt) || amt <= 0) {
      setWireError('Please enter a valid positive transfer amount.');
      return;
    }
    if (!wireName.trim()) {
      setWireError('Recipient Full Name is required.');
      return;
    }
    if (!wireIban.trim()) {
      setWireError('Recipient IBAN or Account Number is required.');
      return;
    }
    if (!wireSwift.trim()) {
      setWireError('Recipient SWIFT/BIC Code is required.');
      return;
    }

    if (wallets[wireFrom] < amt) {
      setWireError(`Insufficient available balance in your active ${wireFrom.toUpperCase()} wallet.`);
      return;
    }

    // 3-seconds spinner intercept
    setProcessingText('Authorizing International Transfer via SWIFT...');
    setIsProcessingOverlay(true);

    setTimeout(() => {
      setIsProcessingOverlay(false);

      // Deduct
      setWallets(prev => {
        const next = { ...prev };
        next[wireFrom] = parseFloat((next[wireFrom] - amt).toFixed(2));
        return next;
      });

      const txTime = systemTime.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newTx: PNTransaction = {
        id: 'pn_wire_' + Date.now(),
        type: 'Debit',
        source: `Wire to ${wireName}`,
        amount: amt,
        currency: wireFrom.toUpperCase() as any,
        timestamp: txTime
      };

      setTransactions(prev => [newTx, ...prev]);
      
      // Generate global receipt details
      const refId = 'PLN-WT-' + Math.floor(10000000 + Math.random() * 90000000) + '-WT';
      const receiptDetails = {
        type: 'wire' as const,
        amount: amt,
        currency: wireFrom.toUpperCase() as 'USD' | 'EUR' | 'GBP' | 'NGN',
        recipientName: wireName,
        recipientDetails: `${wireCountryFlag} ${wireCountry} • IBAN: ${wireIban}`,
        rateApplied: '1.0000 (No conversion premium)',
        refId,
        timeStr: txTime
      };

      setActiveReceipt(receiptDetails);
      addLog(`Polynational: Completed Wire to ${wireName} - ${walletConfigs[wireFrom].symbol}${amt}`);

      // Dispatch mail notification for outgoing Wire
      window.dispatchEvent(new CustomEvent('send_virtual_mail', {
        detail: {
          sender: 'Polynational Swiss Bank',
          subject: 'Outbound Remittance SWIFT Advice',
          preview: `Wire of ${walletConfigs[wireFrom].symbol}${amt.toLocaleString()} to ${wireName} initiated.`,
          body: `Dear Edward Azubuike,\n\nWe confirm the authorization and processing of your international SWIFT Outbound Wire Transfer.\n\nTransaction Specifications:\n- Remittance Reference: ${refId}\n- Source Portfolio: Swiss Core (${wireFrom.toUpperCase()})\n- Sent Amount: -${walletConfigs[wireFrom].symbol}${amt.toLocaleString()}\n- Recipient Full Name: ${wireName}\n- Recipient Registry IBAN: ${wireIban}\n- Destination: ${wireCountryFlag} ${wireCountry}\n- Value Timestamp: ${txTime}\n\nYour portfolio is debited instantly. Should you wish to dispute this wire, consult your bespoke Polynational Private Banker immediately.\n\nSincerely,\nPolynational Capital Remittances Division`
        }
      }));

      onTriggerNotification("Wire Successful", `Sent ${walletConfigs[wireFrom].symbol}${amt} to ${wireName}.`);

      // Handle custom Shopit checkout hook
      if (pendingPayment) {
        localStorage.setItem('shopit_cart', JSON.stringify([]));
        
        const existingInventoryStr = localStorage.getItem('storage_inventory') || '[]';
        let existingInventory: any[] = [];
        try {
          existingInventory = JSON.parse(existingInventoryStr);
        } catch (e) {}

        const boughtItems = pendingPayment.items.map((it: any) => {
          const itemPriceVal = it.usdPrice !== undefined ? it.usdPrice : (it.price || 0);
          return {
            ...it,
            id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            purchaseDate: systemTime.toLocaleDateString() + ' ' + systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            paidPriceText: `$${itemPriceVal}`,
            purchasePrice: itemPriceVal,
            purchaseCurrency: 'USD',
            quantity: it.quantity || 1
          };
        });

        const updatedInventory = [...existingInventory, ...boughtItems];
        localStorage.setItem('storage_inventory', JSON.stringify(updatedInventory));

        onTriggerNotification("Shopit Store", `Pay Complete! Checked out ${boughtItems.length} items. Added to Storage inventory!`);
        addLog(`Shopit: Checkout complete! Pushed items to Storage Inventory.`);

        if (setPendingPayment) {
          setPendingPayment(null);
        }
        localStorage.removeItem('ios_pending_payment');

        // Dispatch events so components reload
        window.dispatchEvent(new Event('shopit_cart_updated'));
        window.dispatchEvent(new Event('storage_inventory_updated'));
      }

      // Reset
      setWireAmount('');
      setWireName('');
      setWireIban('');
      setWireSwift('');
      setCurrentScreen('receipt');
    }, 3000);
  };

  // Instant MoniPay Account Lookup on enter account
  useEffect(() => {
    if (bridgeAccount.trim().length === 10) {
      setIsValidatingBridge(true);
      setBridgeError('');
      
      const waitTimer = setTimeout(() => {
        setIsValidatingBridge(false);
        // Check if account matches standard MoniPay users (Edward Azubuike) or contains numbers
        const suffix = bridgeAccount.slice(-3);
        setBridgeResolvedName('Edward Azubuike');
      }, 1000);

      return () => clearTimeout(waitTimer);
    } else {
      setBridgeResolvedName('');
    }
  }, [bridgeAccount]);

  // Fintech Bridge send handler
  const handleAuthorizeBridge = () => {
    setBridgeError('');
    const amt = parseFloat(bridgeAmount);
    if (isNaN(amt) || amt <= 0) {
      setBridgeError('Please enter a valid transfer amount.');
      return;
    }
    if (bridgeAccount.length !== 10) {
      setBridgeError('MoniPay account number must be exactly 10 digits.');
      return;
    }
    if (!bridgeResolvedName) {
      setBridgeError('Could not resolve account owner name.');
      return;
    }

    if (wallets.ngn < amt) {
      setBridgeError(`Insufficient funds in your NGN (Naira) Portfolio.`);
      return;
    }

    // 3-seconds spinner intercept
    setProcessingText('Establishing Cross-App Tunnel to MoniPay...');
    setIsProcessingOverlay(true);

    setTimeout(() => {
      setIsProcessingOverlay(false);

      // Deduct from Polynational
      setWallets(prev => {
        const next = { ...prev };
        next.ngn = parseFloat((next.ngn - amt).toFixed(2));
        return next;
      });

      const txTime = systemTime.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newTx: PNTransaction = {
        id: 'pn_bridge_' + Date.now(),
        type: 'Debit',
        source: 'Bridge: MoniPay Transfer',
        amount: amt,
        currency: 'NGN',
        timestamp: txTime
      };

      setTransactions(prev => [newTx, ...prev]);

      const refId = 'PLN-BRG-' + Math.floor(100000 + Math.random() * 900000);
      const receiptDetails = {
        type: 'bridge' as const,
        amount: amt,
        currency: 'NGN' as const,
        recipientName: bridgeResolvedName,
        recipientDetails: `MoniPay Wallet (NGN) • Acct: ${bridgeAccount}`,
        rateApplied: '1:1 Fintech instant sync',
        refId,
        timeStr: txTime
      };

      setActiveReceipt(receiptDetails);
      addLog(`Fintech Bridge: Initiated ₦${amt} transfer to MoniPay: ${bridgeAccount}`);
      setCurrentScreen('receipt');

      // NOW START EXTREMELY COOL 10-SECOND INVISIBLE BACKGROUND BRIDGE DEPOSIT LOGIC
      setTimeout(() => {
        // Read current MoniPay balance from localStorage
        const monipayBalanceStr = localStorage.getItem('monipay_balance');
        const currentMPB = monipayBalanceStr ? parseFloat(monipayBalanceStr) : 148500;
        const newMPB = currentMPB + amt;
        localStorage.setItem('monipay_balance', newMPB.toString());

        // Log in MoniPay Ledger
        const monipayLedgerStr = localStorage.getItem('monipay_transactions');
        let monipayLedger = [];
        if (monipayLedgerStr) {
          try {
            monipayLedger = JSON.parse(monipayLedgerStr);
          } catch (e) {}
        } else {
          monipayLedger = [
            { id: 'tx_1', type: 'inbound', title: 'Ref: Sarah Jenkins', subtitle: 'Transfer from Sarah', amount: 5000, timeStr: 'Today, 1:45 PM' },
            { id: 'tx_2', type: 'outbound', title: 'Uber Technologies', subtitle: 'Mobility services', amount: 12500, timeStr: 'Yesterday, 8:12 PM' },
            { id: 'tx_3', type: 'outbound', title: 'Yonkers Groceries', subtitle: 'Shopping mart', amount: 30000, timeStr: 'May 22, 11:30 AM' }
          ];
        }

        const systemTimeStr = systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + systemTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
        const inboundTx = {
          id: 'tx_pn_bridge_' + Date.now(),
          type: 'inbound',
          title: 'Polynational Bridge',
          subtitle: `Cross-App credit • Ref ${refId}`,
          amount: amt,
          timeStr: systemTimeStr
        };
        monipayLedger.unshift(inboundTx);
        localStorage.setItem('monipay_transactions', JSON.stringify(monipayLedger));

        // Trigger iOS Notification globally
        onTriggerNotification("MoniPay Inbound Credit", `Poly international sent you ₦${amt.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
        addLog(`Fintech Bridge: Silent setTimeout background cleared. credited MoniPay balance +₦${amt}`);

        // Fire custom window event to push real-time changes into active MoniPay render instantly
        window.dispatchEvent(new CustomEvent('monipay_external_update'));

      }, 10000);

      // Reset
      setBridgeAmount('');
      setBridgeAccount('');
      setBridgeResolvedName('');
    }, 3000);
  };

  // Card Destroy & Replacement ($50 USD Fee)
  const handleReplaceCard = () => {
    if (wallets.usd < 50) {
      alert('A $50 configuration fee is required from your USD Wallet to replace the World Elite card.');
      return;
    }

    if (confirm('Are you sure you want to destroy and issue a new Polynational World Elite Black Card? This incurs a non-refundable $50.00 fee.')) {
      setWallets(prev => {
        const next = { ...prev };
        next.usd = parseFloat((next.usd - 50).toFixed(2));
        return next;
      });

      // Generate pristine brand new 16 digit card & CVV
      let newCardNo = '5543';
      for (let i = 0; i < 3; i++) {
        newCardNo += ' ' + Math.floor(1000 + Math.random() * 9000).toString();
      }
      const newCvv = Math.floor(100 + Math.random() * 900).toString();
      
      setCard({
        number: newCardNo,
        cvv: newCvv,
        expiry: '05/33'
      });

      const txTime = systemTime.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const feeTx: PNTransaction = {
        id: 'pn_card_fee_' + Date.now(),
        type: 'Debit',
        source: 'Elite Card Replacement Fee',
        amount: 50,
        currency: 'USD',
        timestamp: txTime
      };

      setTransactions(prev => [feeTx, ...prev]);
      addLog(`Polynational: Replaced Master Black Card (Charged $50 Fee)`);
      onTriggerNotification("Card Replaced", "Your new World Elite Black Card is active. $50.00 fee deducted.");
    }
  };

  // Switch index of active card carousel
  const carouselActiveId = (['usd', 'eur', 'gbp', 'ngn'] as const)[activeWalletIndex];

  return (
    <div className="flex flex-col h-full bg-[#0A1128] text-[#E2E8F0] font-sans relative overflow-hidden" id="polynational_app_root">
      
      {/* Background ambient gold aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* TOP HEADER */}
      <div className="p-4 border-b border-white/5 bg-[#0A1128]/95 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-black text-slate-950 text-[10px]">
            🌐
          </div>
          <div>
            <h1 className="text-[14px] font-black tracking-tight text-white uppercase leading-none">Polynational</h1>
            <span className="text-[8px] font-bold text-amber-500 tracking-widest uppercase">World Elite</span>
          </div>
        </div>

        <span className="text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-black py-0.5 px-2 rounded-full uppercase tracking-wider">
          KYC Level 3
        </span>
      </div>

      {/* RENDER ACTIVE SCREEN */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 pb-20">
        
        {currentScreen === 'dashboard' && (
          <div className="space-y-4 animate-fadeIn" id="pn_screen_dashboard">
            
            {/* CAROUSEL HEADER - SWIPE CARD PREVIEW */}
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Multi-Currency Portfolios</span>
              <button 
                id="pn_dash_toggle_mask"
                onClick={() => setIsMasked(!isMasked)} 
                className="text-amber-505/80 text-amber-400 hover:text-amber-500 transition cursor-pointer"
                title={isMasked ? "Show balances" : "Hide balances"}
              >
                {isMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* HORIZONTAL SWIPE CAROUSEL */}
            <div className="relative overflow-visible" id="pn_portfolio_carousel">
              <div 
                id="pn_carousel_track" 
                className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory px-1 pb-2"
                onScroll={(e) => {
                  const scrollLeft = (e.target as HTMLDivElement).scrollLeft;
                  const itemWidth = 260 + 16; // Card size + gap
                  const index = Math.round(scrollLeft / itemWidth);
                  if (index >= 0 && index <= 3 && index !== activeWalletIndex) {
                    setActiveWalletIndex(index);
                  }
                }}
              >
                {(['usd', 'eur', 'gbp', 'ngn'] as const).map((wid, idx) => {
                  const conf = walletConfigs[wid];
                  const bal = wallets[wid];
                  const isActive = activeWalletIndex === idx;

                  return (
                    <div 
                      id={`pn_wallet_card_${wid}`}
                      key={wid}
                      className={`w-[260px] p-4.5 rounded-2xl shrink-0 snap-center select-none transition-all duration-300 transform border relative overflow-hidden flex flex-col justify-between h-[135px] cursor-pointer ${
                        isActive 
                        ? 'bg-gradient-to-br from-[#121E45] to-[#0D1530] border-amber-500/50 shadow-xl shadow-amber-500/5 scale-102' 
                        : 'bg-[#0E1736]/60 border-white/5 opacity-50 scale-95 hover:opacity-85'
                      }`}
                      onClick={() => {
                        setActiveWalletIndex(idx);
                        // Center automatically in code
                        const tracker = document.getElementById('pn_carousel_track');
                        if (tracker) {
                          tracker.scrollTo({ left: idx * (260 + 16), behavior: 'smooth' });
                        }
                      }}
                    >
                      {/* Premium gold card lines */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-xl"></div>
                      
                      {/* Logo, flag */}
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">{conf.name.toUpperCase()}</span>
                        <span className="text-lg">{conf.flag}</span>
                      </div>

                      {/* Balance section */}
                      <div className="my-2 mt-4">
                        <span className="text-[9px] text-amber-505/70 font-black tracking-widest block uppercase text-amber-400">Available Portfolio</span>
                        <h2 className="text-xl font-extrabold tracking-tight text-white mt-1">
                          {isMasked ? '••••••' : conf.symbol + bal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h2>
                      </div>

                      {/* Card Footer indicator dots */}
                      <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 mt-2">
                        <span>POLYNATION SWIFT DIRECT</span>
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map(dot => (
                            <div key={dot} className={`w-1.5 h-1.5 rounded-full ${activeWalletIndex === dot ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QUICK ACTIONS UTILITY GRID */}
            <div className="grid grid-cols-4 gap-2" id="pn_quick_actions">
              <button 
                id="pn_action_add_money"
                onClick={() => { setAddWallet(carouselActiveId); setAddMoneyOpen(true); }}
                className="py-2.5 px-1 bg-[#121E45] hover:bg-[#1A2C64] active:scale-95 transition border border-amber-500/15 rounded-xl flex flex-col items-center gap-1.5 text-center group cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                <span className="text-[8.5px] font-black uppercase text-slate-300">Add Money</span>
              </button>
              
              <button 
                id="pn_action_convert"
                onClick={() => { setConvertFrom(carouselActiveId); setIsConvertOpen(true); }}
                className="py-2.5 px-1 bg-[#121E45] hover:bg-[#1A2C64] active:scale-95 transition border border-amber-500/15 rounded-xl flex flex-col items-center gap-1.5 text-center group cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-amber-400 group-hover:rotate-180 transition duration-300" />
                <span className="text-[8.5px] font-black uppercase text-slate-300">Convert</span>
              </button>

              <button 
                id="pn_action_send_globally"
                onClick={() => { setWireFrom(carouselActiveId === 'ngn' ? 'usd' : carouselActiveId); setCurrentScreen('wire'); }}
                className="py-2.5 px-1 bg-[#121E45] hover:bg-[#1A2C64] active:scale-95 transition border border-amber-500/15 rounded-xl flex flex-col items-center gap-1.5 text-center group cursor-pointer"
              >
                <Globe className="w-4 h-4 text-amber-400" />
                <span className="text-[8.5px] font-black uppercase text-slate-300">Send Global</span>
              </button>

              <button 
                id="pn_action_local_bridge"
                onClick={() => { setCurrentScreen('bridge'); }}
                className="py-2.5 px-1 bg-[#121E45] hover:bg-[#1A2C64] active:scale-95 transition border border-amber-500/15 rounded-xl flex flex-col items-center gap-1.5 text-center group cursor-pointer"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="text-[8.5px] font-black uppercase text-slate-300">To MoniPay</span>
              </button>
            </div>

            {/* DYNAMIC EXCHANGE CONVERTER DROPDOWN BOX */}
            {isConvertOpen && (
              <div className="bg-[#0E1736] border border-amber-505/20 border-amber-500/20 rounded-2xl p-4 space-y-3.5 shadow-xl animate-scaleIn" id="pn_converter_widget">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Instant Portfolio Swap</span>
                  <button onClick={() => setIsConvertOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[8.5px] text-slate-400 block mb-1">From Currency</label>
                    <select 
                      id="pn_convert_from_selector"
                      value={convertFrom}
                      onChange={(e) => setConvertFrom(e.target.value as any)}
                      className="w-full bg-[#121E45] border border-white/10 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="usd">USD ($)</option>
                      <option value="eur">EUR (€)</option>
                      <option value="gbp">GBP (£)</option>
                      <option value="ngn">NGN (₦)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8.5px] text-slate-400 block mb-1">To Currency</label>
                    <select 
                      id="pn_convert_to_selector"
                      value={convertTo}
                      onChange={(e) => setConvertTo(e.target.value as any)}
                      className="w-full bg-[#121E45] border border-white/10 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="usd">USD ($)</option>
                      <option value="eur">EUR (€)</option>
                      <option value="gbp">GBP (£)</option>
                      <option value="ngn">NGN (₦)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[8.5px] text-slate-400 block mb-1">Exchange Rate Applied</label>
                  <p className="text-xs font-mono text-amber-400 px-3 py-1.5 bg-[#121E45] rounded-lg border border-white/5 flex justify-between items-center">
                    <span>1 {convertFrom.toUpperCase()} =</span>
                    <span className="font-extrabold">{exchangeRates[convertFrom][convertTo].toLocaleString(undefined, { maximumFractionDigits: 4 })} {convertTo.toUpperCase()}</span>
                  </p>
                </div>

                <div>
                  <label className="text-[8.5px] text-slate-400 block mb-1">Swap Weight / Amount</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">{walletConfigs[convertFrom].symbol}</span>
                    <input 
                      id="pn_convert_amount_input"
                      type="number"
                      placeholder="0.00"
                      value={convertAmount}
                      onChange={(e) => setConvertAmount(e.target.value)}
                      className="w-full bg-[#121E45] border border-white/10 focus:border-amber-500/50 outline-none rounded-xl py-2 pl-8 pr-12 text-xs text-white font-mono"
                    />
                    <button 
                      id="pn_convert_max_btn"
                      onClick={() => setConvertAmount(wallets[convertFrom].toString())}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 font-extrabold px-1.5 py-0.5 rounded uppercase cursor-pointer"
                    >
                      Max
                    </button>
                  </div>
                </div>

                {convertAmount && parseFloat(convertAmount) > 0 && (
                  <div className="bg-[#121E45] p-2 rounded-lg text-[9.5px] text-slate-400 text-center font-semibold">
                    You will receive:{' '}
                    <span className="text-white font-black">
                      {walletConfigs[convertTo].symbol}
                      {(parseFloat(convertAmount) * exchangeRates[convertFrom][convertTo]).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <button
                  id="pn_convert_auth_btn"
                  onClick={handleConvertFunds}
                  className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:from-amber-500 hover:to-amber-350 transition active:scale-98 cursor-pointer"
                >
                  Authorized Instant Swap
                </button>
              </div>
            )}

            {/* ADD MONEY COLLAPSED PANEL */}
            {addMoneyOpen && (
              <div className="bg-[#0E1736] border border-amber-500/20 rounded-2xl p-4 space-y-3.5 shadow-xl animate-scaleIn" id="pn_addmoney_widget">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Add Money from External Source</span>
                  <button onClick={() => setAddMoneyOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                </div>

                {addMoneyError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] p-2.5 rounded-xl flex items-center gap-1.5 leading-relaxed">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{addMoneyError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[8.5px] text-slate-400 block mb-1">Target Wallet</label>
                    <select 
                      id="pn_add_wallet_selector"
                      value={addWallet}
                      onChange={(e) => setAddWallet(e.target.value as any)}
                      className="w-full bg-[#121E45] border border-white/10 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="usd">USD ($)</option>
                      <option value="eur">EUR (€)</option>
                      <option value="gbp">GBP (£)</option>
                      <option value="ngn">NGN (₦)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8.5px] text-slate-400 block mb-1">Funding Method</label>
                    <select 
                      id="pn_add_source_selector"
                      value={addSource}
                      onChange={(e) => setAddSource(e.target.value as any)}
                      className="w-full bg-[#121E45] border border-white/10 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="apple_pay">Apple Pay</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="bank_wire">Bank Wire Transfer</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Fields based on Source */}
                {addSource === 'debit_card' && (
                  <div className="space-y-2 border-t border-white/5 pt-2">
                    <div>
                      <label className="text-[8px] text-slate-400 block mb-1 uppercase">Cardholder Name</label>
                      <input 
                        id="pn_add_cardname_input"
                        type="text"
                        placeholder="e.g. Edward Azubuike"
                        value={addCardName}
                        onChange={(e) => setAddCardName(e.target.value)}
                        className="w-full bg-[#121E45] border border-white/10 p-2 text-xs text-white rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-slate-400 block mb-1 uppercase">16-Digit Card Number</label>
                      <input 
                        id="pn_add_cardnum_input"
                        type="text"
                        maxLength={16}
                        placeholder="4111 2222 3333 4444"
                        value={addCardNum}
                        onChange={(e) => setAddCardNum(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-[#121E45] border border-white/10 p-2 text-xs text-white rounded-lg focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                )}

                {addSource === 'bank_wire' && (
                  <div className="space-y-2 border-t border-white/5 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] text-slate-400 block mb-1 uppercase">Sender Name</label>
                        <input 
                          id="pn_add_wiresender_input"
                          type="text"
                          placeholder="Edward A."
                          value={addWireSender}
                          onChange={(e) => setAddWireSender(e.target.value)}
                          className="w-full bg-[#121E45] border border-white/10 p-2 text-xs text-white rounded-lg focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] text-slate-400 block mb-1 uppercase">Origin Bank</label>
                        <input 
                          id="pn_add_wirebank_input"
                          type="text"
                          placeholder="Chase NY"
                          value={addWireBank}
                          onChange={(e) => setAddWireBank(e.target.value)}
                          className="w-full bg-[#121E45] border border-white/10 p-2 text-xs text-white rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[8.5px] text-slate-400 block mb-1">Deposit Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-xs">{walletConfigs[addWallet].symbol}</span>
                    <input 
                      id="pn_add_amount_input"
                      type="number"
                      placeholder="0.00"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="w-full bg-[#121E45] border border-white/10 rounded-xl py-2 pl-7 pr-4 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  id="pn_add_confirm_btn"
                  onClick={handleAddMoneySubmit}
                  className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:from-amber-500 hover:to-amber-305 transition active:scale-98 cursor-pointer"
                >
                  Confirm Inbound Funding
                </button>
              </div>
            )}

            {/* CHRONOLOGICAL TRANSACTION LEDGER LIST */}
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">System Ledgers</span>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto" id="pn_ledger_list">
                {transactions.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-[10px] bg-[#0E1736]/40 rounded-xl border border-white/5">
                    No transactions found in this account profile.
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div 
                      key={tx.id} 
                      onClick={() => handleOpenReceipt(tx)}
                      className="p-3 bg-[#0E1736]/40 border border-white/5 rounded-xl flex justify-between items-center cursor-pointer hover:bg-[#0E1736]/75 hover:border-amber-500/30 transition group text-left"
                      id={`pn_ledgertx_${tx.id}`}
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-white group-hover:text-amber-400 transition truncate">{tx.source}</p>
                        <span className="text-[8px] text-slate-500 font-mono mt-0.5 block">{tx.timestamp}</span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[11px] font-mono font-black ${tx.type === 'Credit' ? 'text-emerald-400' : tx.type === 'Exchange' ? 'text-amber-400' : 'text-rose-400'}`}>
                          {tx.type === 'Credit' ? '+' : tx.type === 'Exchange' ? '★' : '-'}
                          {walletConfigs[tx.currency.toLowerCase() as any]?.symbol || '$'}
                          {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <p className="text-[7.5px] uppercase tracking-widest text-slate-500 font-mono scale-95 origin-right mt-0.5">{tx.type}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* SCREEN: GLOBAL WIRE TRANSFER */}
        {currentScreen === 'wire' && (
          <div className="space-y-4 animate-fadeIn" id="pn_screen_wire">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setCurrentScreen('dashboard')} className="p-1 bg-[#121E45] rounded-lg text-amber-400 cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
              <h2 className="text-xs font-black uppercase tracking-wider text-white">Send Globally (SWIFT Wire)</h2>
            </div>

            {wireError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] p-2.5 rounded-xl flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{wireError}</span>
              </div>
            )}

            <div className="bg-[#0E1736]/60 border border-white/5 rounded-2xl p-4 space-y-3.5">
              
              <div>
                <label className="text-[8.5px] text-slate-400 block mb-1">Source Foreign Portfolio</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['usd', 'eur', 'gbp'] as const).map(w => (
                    <button
                      id={`pn_wire_src_${w}`}
                      key={w}
                      onClick={() => setWireFrom(w)}
                      className={`py-1.5 px-2 border rounded-lg text-[9px] font-black uppercase transition cursor-pointer flex justify-between items-center ${
                        wireFrom === w 
                        ? 'bg-[#121E45] text-amber-400 border-amber-500/50' 
                        : 'bg-transparent text-slate-400 border-white/5 hover:bg-white/5'
                      }`}
                    >
                      <span>{w.toUpperCase()}</span>
                      <span className="font-mono text-[8px] opacity-70">({walletConfigs[w].symbol}{wallets[w].toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[8.5px] text-slate-400 block mb-1">Select Country</label>
                  <select 
                    id="pn_wire_country_selector"
                    value={wireCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-[#121E45] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="United States 🇺🇸">United States 🇺🇸</option>
                    <option value="United Kingdom 🇬🇧">United Kingdom 🇬🇧</option>
                    <option value="Germany 🇩🇪">Germany 🇩🇪</option>
                    <option value="Canada 🇨🇦">Canada 🇨🇦</option>
                    <option value="France 🇫🇷">France 🇫🇷</option>
                    <option value="Australia 🇦🇺">Australia 🇦🇺</option>
                  </select>
                </div>

                <div>
                  <label className="text-[8.5px] text-slate-400 block mb-1">Beneficiary SWIFT / BIC</label>
                  <input 
                    id="pn_wire_swift_input"
                    type="text"
                    placeholder="e.g. PNATUS33XXX"
                    value={wireSwift}
                    onChange={(e) => setWireSwift(e.target.value.toUpperCase())}
                    className="w-full bg-[#121E45] border border-[#1A2C64] hover:border-white/10 outline-none rounded-lg p-2 text-xs text-white focus:border-amber-500/50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[8.5px] text-slate-400 block mb-1">Recipient Account Holder Full Name</label>
                <input 
                  id="pn_wire_name_input"
                  type="text"
                  placeholder="Recipient Full Name"
                  value={wireName}
                  onChange={(e) => setWireName(e.target.value)}
                  className="w-full bg-[#121E45] border border-[#1A2C64] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="text-[8.5px] text-slate-400 block mb-1">IBAN / Account Number</label>
                <input 
                  id="pn_wire_iban_input"
                  type="text"
                  placeholder="GB29 PNAT 9012 5543..."
                  value={wireIban}
                  onChange={(e) => setWireIban(e.target.value.toUpperCase())}
                  className="w-full bg-[#121E45] border border-[#1A2C64] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500/50 font-mono"
                />
              </div>

              <div className="border-t border-white/5 pt-3">
                <label className="text-[8.5px] text-slate-400 block mb-1">Transfer Volume</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-slate-355 text-xs text-amber-400">{walletConfigs[wireFrom].symbol}</span>
                  <input 
                    id="pn_wire_amount_input"
                    type="number"
                    placeholder="0.00"
                    value={wireAmount}
                    onChange={(e) => setWireAmount(e.target.value)}
                    className="w-full bg-[#121E45] border border-white/10 rounded-xl py-2.5 pl-8 pr-12 text-xs text-white font-mono"
                  />
                  <button 
                    id="pn_wire_max_btn"
                    onClick={() => setWireAmount(wallets[wireFrom].toString())}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] bg-red-400/10 hover:bg-red-400/20 text-amber-500 font-extrabold px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    Max
                  </button>
                </div>
              </div>

              <button
                id="pn_wire_submit_btn"
                onClick={handleAuthorizeWire}
                className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:from-amber-500 active:scale-95 transition cursor-pointer"
              >
                Authorize SWIFT Wire
              </button>
            </div>
          </div>
        )}

        {/* SCREEN: FINTECH BRIDGE TO MONIPAY */}
        {currentScreen === 'bridge' && (
          <div className="space-y-4 animate-fadeIn" id="pn_screen_bridge">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setCurrentScreen('dashboard')} className="p-1 bg-[#121E45] rounded-lg text-amber-400 cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
              <h2 className="text-xs font-black uppercase tracking-wider text-white">Send to Local Bank (MoniPay Bridge)</h2>
            </div>

            {bridgeError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] p-2.5 rounded-xl flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{bridgeError}</span>
              </div>
            )}

            <div className="bg-[#121E45]/40 border border-amber-500/10 rounded-2xl p-4 space-y-4">
              <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 mb-1">
                <p className="text-[10px] leading-normal text-amber-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  MoniPay Fintech tunnel is instant and strictly handles Naira (NGN) portfolios.
                </p>
              </div>

              <div>
                <label className="text-[8.5px] text-slate-400 block mb-1">Recipient MoniPay 10-Digit Account Number</label>
                <div className="relative">
                  <input 
                    id="pn_bridge_acct_input"
                    type="text"
                    maxLength={10}
                    placeholder="Enter MoniPay Account (e.g. 2049583192)"
                    value={bridgeAccount}
                    onChange={(e) => setBridgeAccount(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#0E1736] border border-[#1A2C64] focus:border-amber-500/50 outline-none rounded-xl p-2.5 text-xs text-white font-mono tracking-widest pl-4"
                  />
                  {isValidatingBridge && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[8px] text-amber-500 font-bold tracking-widest uppercase animate-pulse">
                      Resolving...
                    </span>
                  )}
                </div>
              </div>

              {/* Resolved Payee Box */}
              {bridgeAccount.length === 10 && (
                <div className="p-3 bg-[#0E1736] rounded-xl border border-white/5 flex justify-between items-center animate-fadeIn" id="pn_bridge_payee_box">
                  <div>
                    <span className="text-[7.5px] uppercase tracking-wider text-slate-500 font-mono block">Resolved Payee Name</span>
                    <p className="text-xs font-black text-amber-400">{bridgeResolvedName || 'Edward Azubuike'}</p>
                  </div>
                  <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full select-none">
                    Matched ✓
                  </span>
                </div>
              )}

              <div>
                <label className="text-[8.5px] text-slate-400 block mb-1">Naira Amount to Bridge</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-xs text-[#00C37A] font-black">₦</span>
                  <input 
                    id="pn_bridge_amount_input"
                    type="number"
                    placeholder="0.00"
                    value={bridgeAmount}
                    onChange={(e) => setBridgeAmount(e.target.value)}
                    className="w-full bg-[#0E1736] border border-[#1A2C64] focus:border-amber-500/50 outline-none rounded-xl py-2 pl-7 pr-4 text-xs text-white font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-slate-550 font-mono font-bold tracking-widest">
                    Available: ₦{wallets.ngn.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                id="pn_bridge_confirm_btn"
                onClick={handleAuthorizeBridge}
                className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:from-amber-500 active:scale-95 transition cursor-pointer"
              >
                Confirm Cross-App Transfer
              </button>
            </div>
          </div>
        )}

        {/* SCREEN: CARD MANAGEMENT (THE BLACK CARD) */}
        {currentScreen === 'cards' && (
          <div className="space-y-4 animate-fadeIn" id="pn_screen_cards">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">Polynational World Elite Black Card</h2>
            </div>

            {/* BLACK CARD DECK */}
            <div className="bg-gradient-to-br from-zinc-900 via-[#111116] to-[#0A0A0F] border border-amber-500/30 rounded-2.5xl rounded-3xl p-5 relative overflow-hidden shadow-2xl h-[160px] flex flex-col justify-between" id="pn_black_card_layer">
              {/* Abstract luxury textures */}
              <div className="absolute top-[-30%] right-[-20%] w-48 h-48 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-3 w-10 h-7 rounded bg-amber-500/20 border border-amber-500/40 opacity-70"></div> {/* Chip */}
              
              <div className="flex justify-between items-start z-10">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#D4AF37] block">WORLD ELITE</span>
                  <span className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-widest">Mastercard • Debit</span>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-5 h-5 rounded-full bg-red-500/80"></div>
                    <div className="w-5 h-5 rounded-full bg-amber-500/80 -ml-3"></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 z-10">
                <p className="text-md font-mono text-white tracking-widest leading-none bg-black/20 p-1.5 rounded inline-block backdrop-blur-xs select-text">
                  {card.number}
                </p>
                
                <div className="flex justify-between items-center mt-3 text-[8.5px] font-mono text-zinc-400">
                  <div>
                    <span className="text-[6.5px] text-zinc-500 block uppercase font-sans">Expiry</span>
                    <span>{card.expiry}</span>
                  </div>
                  <div>
                    <span className="text-[6.5px] text-zinc-500 block uppercase font-sans">CVV</span>
                    <span>{card.cvv}</span>
                  </div>
                  <div>
                    <span className="text-[6.5px] text-zinc-500 block uppercase font-sans">Cardholder</span>
                    <span className="font-sans font-extrabold uppercase text-[#D4AF37]">{profile.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* UPGRADE AND REPLACE OPTION */}
            <div className="bg-[#0E1736]/40 border border-white/5 p-4 rounded-2xl space-y-3.5">
              <h3 className="text-[10px] font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                Premium Card Issuing Engine
              </h3>
              
              <p className="text-[10px] leading-relaxed text-slate-400">
                Need to rotate credentials? Replace your virtual World Elite Card instantly. This destroys your old account details, updates the virtual chip, and deducts the **$50.00 issuing fee** securely from your USD portfolio.
              </p>

              <button
                id="pn_replace_card_btn"
                onClick={handleReplaceCard}
                className="w-full py-2 bg-gradient-to-r from-red-600/30 to-amber-600/30 border border-amber-500/40 text-amber-400 hover:text-white hover:bg-amber-500 hover:border-amber-550 rounded-xl text-xs font-black uppercase tracking-wider transition active:scale-95 cursor-pointer"
              >
                Destroy & Issuing Fresh Elite Card
              </button>
            </div>

          </div>
        )}

        {/* SCREEN: SETTINGS (ADMIN PANEL & KYC SUMMARY) */}
        {currentScreen === 'settings' && (
          <div className="space-y-4 animate-fadeIn" id="pn_screen_settings">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">Admin settings & KYC</h2>
            </div>

            <div className="bg-[#0E1736]/40 border border-white/5 rounded-2xl p-4 space-y-4">
              <div className="flex gap-3 items-center border-b border-white/5 pb-3.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-black text-slate-950 text-md uppercase">
                  {profile.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">{profile.name}</h3>
                  <span className="text-[9px] text-[#00C37A] font-bold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {profile.kycStatus}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Sim. Legal Entity Account</span>
                  <span className="font-extrabold text-white font-mono uppercase">Edward Azubuike (Local)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">SWIFT Routing Terminal</span>
                  <span className="font-extrabold text-amber-400 font-mono">PNAT_US_NYXX_01</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Default Carousel Focus</span>
                  <select
                    id="pn_settings_default_currency"
                    value={profile.defaultCurrency}
                    onChange={(e) => setProfile(prev => ({ ...prev, defaultCurrency: e.target.value as any }))}
                    className="bg-[#121E45] border border-white/10 rounded px-2 py-0.5 text-[10.5px] text-white"
                  >
                    <option value="usd">USD ($)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="gbp">GBP (£)</option>
                    <option value="ngn">NGN (₦)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-505/10 border-amber-500/10 text-[9.5px] leading-relaxed text-amber-500 font-mono text-center">
                KYC Tier 3 permits high-capacity international wire operations up to $500,000 equivalent per block. For adjustments, contact Swiss Admin.
              </div>
            </div>
          </div>
        )}

        {/* SCREEN: PREMIUM GLOWING RECEIPT VIEW */}
        {currentScreen === 'receipt' && activeReceipt && (
          <div className="space-y-4 animate-scaleIn text-center pt-2" id="pn_screen_receipt">
            
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/5">
              <CheckCircle className="w-8 h-8 text-amber-400" />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase text-[#00C37A] tracking-widest font-mono">Transfer Authorized</p>
              <h2 className="text-2xl font-black text-white mt-1">
                {walletConfigs[activeReceipt.currency.toLowerCase() as any]?.symbol}
                {activeReceipt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
              <span className="text-[9px] text-slate-400 block mt-0.5">Through SWIFT System Route</span>
            </div>

            <div className="bg-[#0E1736]/60 border border-white/5 rounded-2xl p-4 text-left space-y-3 max-w-[280px] mx-auto text-xs">
              
              <div className="flex justify-between items-start border-b border-white/5 pb-2">
                <span className="text-slate-400">Beneficiary Target</span>
                <div className="text-right">
                  <p className="font-extrabold text-white">{activeReceipt.recipientName}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5 leading-none font-mono">{activeReceipt.recipientDetails}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Interbank Conversion</span>
                <span className="font-mono text-amber-400">{activeReceipt.rateApplied}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Clearing Time</span>
                <span className="font-semibold text-[#00C37A]">Cleared ✓</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Global Reference ID</span>
                <span className="font-mono text-[9px] text-zinc-300 tracking-wider flex items-center gap-1">
                  {activeReceipt.refId}
                  <button 
                    id="pn_receipt_copy_ref"
                    onClick={() => {
                      navigator.clipboard.writeText(activeReceipt.refId);
                      setCopiedText(true);
                      setTimeout(() => setCopiedText(false), 2000);
                    }}
                    className="text-amber-400 hover:text-white cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </span>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono border-t border-white/5 pt-2">
                <span>TIMESTAMP</span>
                <span>{activeReceipt.timeStr}</span>
              </div>
            </div>

            {copiedText && (
              <span className="text-[8px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-mono uppercase inline-block">
                Reference ID copied to clipboard!
              </span>
            )}

            <div className="space-y-2 max-w-[280px] mx-auto pt-2">
              <button
                id="pn_btn_download_pdf"
                onClick={() => {
                  alert('Premium PDF statement generated! Check folder `/Simulated_Downloads/PDF_' + activeReceipt.refId + '.pdf`');
                }}
                className="w-full py-2 bg-[#121E45] border border-amber-500/10 text-amber-450 text-amber-400 text-xs font-black uppercase rounded-xl hover:bg-amber-500 hover:text-slate-950 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download Digital PDF Statement
              </button>

              <button
                id="pn_btn_receipt_close"
                onClick={() => { setCurrentScreen('dashboard'); setActiveReceipt(null); }}
                className="w-full py-1.5 text-slate-400 text-[10px] font-bold uppercase hover:text-white cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>

          </div>
        )}

      </div>

      {/* FULL-SCREEN PREMIUM PROCESSING OVERLAY */}
      {isProcessingOverlay && (
        <div className="absolute inset-0 bg-[#0A1128]/95 z-50 flex flex-col justify-center items-center text-center p-6 animate-fadeIn" id="pn_processing_overlay">
          <div className="relative mb-4">
            {/* Spinning gold rings */}
            <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-amber-500 animate-spin"></div>
            <div className="w-12 h-12 rounded-full border border-amber-500/10 absolute inset-0"></div>
          </div>
          
          <h3 className="text-xs uppercase font-extrabold text-amber-400 tracking-widest font-mono">Polynational Security Core</h3>
          <p className="text-[10px] text-slate-400 mt-1 max-w-[80%] leading-relaxed">
            {processingText}
          </p>
        </div>
      )}

      {/* Dynamic Shopit International USD Checkout Request Modal */}
      {pendingPayment && pendingPayment.bankType === 'polynational' && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-end justify-center z-[9990] animate-fadeIn">
          <div className="w-full bg-[#0E1530] border-t border-amber-500/30 rounded-t-[32px] p-5 space-y-4 text-left animate-slideUp max-h-[85%] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 py-0.5 px-2.5 rounded-full text-[9px] font-bold font-mono">
                <span>$ USD International Checkout</span>
              </div>
              <button
                onClick={() => {
                  if (setPendingPayment) setPendingPayment(null);
                }}
                className="text-slate-400 hover:text-white font-extrabold text-sm"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-black text-white">Confirm Swiss Elite World Wire</h3>
              <p className="text-[10px] text-slate-300 leading-normal">
                You are checking out from <strong>Shopit International</strong>. Confirm payment using your Swiss Elite Black Card.
              </p>
            </div>

            {/* Items Summary Table */}
            <div className="bg-[#121A3A] p-3 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[8px] font-bold uppercase text-slate-550 font-mono">Order Contents</span>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto divide-y divide-white/5">
                {pendingPayment.items?.map((it: any) => (
                  <div key={it.id} className="flex justify-between text-[10px] py-1 text-left">
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-bold text-slate-200 truncate">{it.name}</p>
                      <p className="text-[8.5px] text-slate-405">{it.category} &times; {it.quantity}</p>
                    </div>
                    <span className="text-slate-300 font-mono font-bold">${(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[11px] font-bold font-mono">
                <span className="text-slate-450">Total Purchase</span>
                <span className="text-amber-400 font-bold">${pendingPayment.amount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Swiss balance safety check / auto-replenish */}
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 flex justify-between items-center">
              <div className="text-left">
                <span className="text-[8px] uppercase font-bold text-slate-400 block leading-none">Your High-End USD Wallet</span>
                <strong className="text-white text-xs font-mono">${wallets.usd?.toLocaleString()}</strong>
              </div>
              {wallets.usd < pendingPayment.amount && (
                <span className="text-[8.5px] text-amber-500 font-bold bg-amber-500/10 px-2 py-1 rounded w-auto self-center">
                  Wallet auto-replenished (+${(pendingPayment.amount - wallets.usd).toLocaleString()})
                </span>
              )}
            </div>

            {/* Confirm wire button */}
            <button
              onClick={() => {
                const paymentCost = pendingPayment.amount;
                setIsProcessingOverlay(true);
                setProcessingText("Establishing encrypted Swiss payment tunnels...");

                // Ensure balance is sufficient
                if (wallets.usd < paymentCost) {
                  setWallets(prev => ({
                    ...prev,
                    usd: paymentCost + 10000 
                  }));
                }

                setTimeout(() => {
                  setWallets(prev => ({
                    ...prev,
                    usd: Math.max(0, prev.usd - paymentCost)
                  }));

                  // Add to ledger
                  const newTx: PNTransaction = {
                    id: 'pn_tx_shopit_' + Date.now(),
                    type: 'Debit',
                    source: `Shopit International Checkout`,
                    amount: paymentCost,
                    currency: 'USD',
                    timestamp: 'Just now'
                  };
                  setTransactions(prev => [newTx, ...prev]);

                  // Add items directly to storage_inventory
                  const existingInventoryStr = localStorage.getItem('storage_inventory') || '[]';
                  let existingInventory: any[] = [];
                  try {
                    existingInventory = JSON.parse(existingInventoryStr);
                  } catch (e) {}

                  const boughtItems = pendingPayment.items.map((it: any) => {
                    const itemPriceVal = it.usdPrice !== undefined ? it.usdPrice : (it.price || 0);
                    return {
                      ...it,
                      id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                      purchaseDate: systemTime.toLocaleDateString() + ' ' + systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      paidPriceText: `$${itemPriceVal}`,
                      purchasePrice: itemPriceVal,
                      purchaseCurrency: 'USD',
                      quantity: it.quantity || 1
                    };
                  });

                  const updatedInventory = [...existingInventory, ...boughtItems];
                  localStorage.setItem('storage_inventory', JSON.stringify(updatedInventory));

                  // Clear cart
                  localStorage.setItem('shopit_cart', JSON.stringify([]));

                  onTriggerNotification("Polynational Swiss Wire", `Authorized! Checked out ${boughtItems.length} items. Added to Storage Inventory!`);
                  addLog(`Shopit: Checkout complete inside Polynational elite wire for $${paymentCost}`);

                  // Reset payment
                  if (setPendingPayment) {
                    setPendingPayment(null);
                  }
                  localStorage.removeItem('ios_pending_payment');

                  // Dispatch events as well
                  window.dispatchEvent(new Event('shopit_cart_updated'));
                  window.dispatchEvent(new Event('storage_inventory_updated'));

                  setIsProcessingOverlay(false);
                  alert(`✓ Wire Transferred Successfully!\n$${paymentCost} authorized from World Elite Swiss Portfolios.`);
                }, 2000);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg transition active:scale-97 cursor-pointer text-center"
            >
              Confirm Swiss Elite Wire ($)
            </button>
          </div>
        </div>
      )}

      {/* NAVIGATION BAR BAR */}
      <div className="absolute bottom-0 inset-x-0 bg-[#0A1128]/95 border-t border-white/5 h-14 flex items-center justify-around z-30 shrink-0 text-slate-400 select-none pb-0.5" id="pn_nav_bar">
        <button 
          id="pn_nav_item_dashboard"
          onClick={() => setCurrentScreen('dashboard')} 
          className={`flex flex-col items-center gap-1 group cursor-pointer ${currentScreen === 'dashboard' || currentScreen === 'receipt' ? 'text-amber-400' : 'hover:text-slate-200'}`}
        >
          <Wallet className="w-4 h-4 group-hover:scale-105 transition" />
          <span className="text-[8px] font-black uppercase tracking-wider">Wallets</span>
        </button>

        <button 
          id="pn_nav_item_transfer"
          onClick={() => setCurrentScreen('wire')} 
          className={`flex flex-col items-center gap-1 group cursor-pointer ${currentScreen === 'wire' || currentScreen === 'bridge' ? 'text-amber-400' : 'hover:text-slate-200'}`}
        >
          <Send className="w-4 h-4 group-hover:scale-105 transition" />
          <span className="text-[8px] font-black uppercase tracking-wider">Transfer</span>
        </button>

        <button 
          id="pn_nav_item_cards"
          onClick={() => setCurrentScreen('cards')} 
          className={`flex flex-col items-center gap-1 group cursor-pointer ${currentScreen === 'cards' ? 'text-amber-400' : 'hover:text-slate-200'}`}
        >
          <CreditCard className="w-4 h-4 group-hover:scale-105 transition" />
          <span className="text-[8px] font-black uppercase tracking-wider font-sans">Black Card</span>
        </button>

        <button 
          id="pn_nav_item_settings"
          onClick={() => setCurrentScreen('settings')} 
          className={`flex flex-col items-center gap-1 group cursor-pointer ${currentScreen === 'settings' ? 'text-amber-400' : 'hover:text-slate-200'}`}
        >
          <Settings className="w-4 h-4 group-hover:scale-105 transition" />
          <span className="text-[8px] font-black uppercase tracking-wider font-sans">KYC</span>
        </button>
      </div>

    </div>
  );
};
