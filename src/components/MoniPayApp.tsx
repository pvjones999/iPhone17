import React, { useState, useEffect } from 'react';
import { 
  Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Settings, Plus, Check, ChevronRight, 
  CreditCard, Wallet, Send, User, Copy, Moon, Sun, Phone, Share2, ClipboardCheck, ArrowLeft, RefreshCw, X, Printer, Download
} from 'lucide-react';

interface MoniPayAppProps {
  systemTime: Date;
  onTriggerNotification: (title: string, body: string) => void;
  addLog: (msg: string) => void;
  pendingPayment?: any | null;
  setPendingPayment?: (payment: any | null) => void;
}

interface Transaction {
  id: string;
  type: 'inbound' | 'outbound';
  title: string;
  subtitle: string;
  amount: number;
  timeStr: string;
  txType?: 'Send' | 'Receive' | 'Deposit' | 'Withdrawal';
  refId?: string;
  fee?: number;
  senderName?: string;
  receiverName?: string;
  bankName?: string;
  accountNo?: string;
  processingStatus?: 'Successful' | 'Pending' | 'Failed';
}

export const MoniPayApp: React.FC<MoniPayAppProps> = ({
  systemTime,
  onTriggerNotification,
  addLog,
  pendingPayment,
  setPendingPayment
}) => {
  // Theme Selection: Dark (default) or Light inside MoniPay settings
  const [monipayTheme, setMonipayTheme] = useState<'dark' | 'light'>('dark');

  // Cascading Profile Names
  const [profileName, setProfileName] = useState<string>(() => {
    const fn = localStorage.getItem('ios_firstName') || 'Edward';
    const ln = localStorage.getItem('ios_lastName') || 'Azubuike';
    return `${fn} ${ln}`;
  });
  const [firstName, setFirstName] = useState<string>(() => {
    return localStorage.getItem('ios_firstName') || 'Edward';
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      const fn = localStorage.getItem('ios_firstName') || 'Edward';
      const ln = localStorage.getItem('ios_lastName') || 'Azubuike';
      setProfileName(`${fn} ${ln}`);
      setFirstName(fn);
    };
    window.addEventListener('monipay_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('monipay_profile_updated', handleProfileUpdate);
  }, []);

  // Screen layout: 'dashboard' | 'transfer' | 'add_money' | 'receipt' | 'settings' | 'cards' | 'history'
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'transfer' | 'add_money' | 'receipt' | 'settings' | 'cards' | 'history'>('dashboard');

  // Core Account States
  const [availableBalance, setAvailableBalance] = useState<number>(() => {
    const saved = localStorage.getItem('monipay_balance');
    return saved !== null ? parseFloat(saved) : 148500;
  });
  const [isBalanceMasked, setIsBalanceMasked] = useState<boolean>(false);
  const [userAccountNumber, setUserAccountNumber] = useState<string>(() => {
    return localStorage.getItem('monipay_account_number') || '2049583192';
  });

  // Requesting new account state (fee 1000, 10s wait)
  const [isGeneratingAccount, setIsGeneratingAccount] = useState<boolean>(false);
  const [accountCountdown, setAccountCountdown] = useState<number>(0);

  // Card details
  const [cardNo, setCardNo] = useState<string>(() => {
    return localStorage.getItem('monipay_card_no') || '4352 9012 3345 6178';
  });
  const [cardCvv, setCardCvv] = useState<string>(() => {
    return localStorage.getItem('monipay_card_cvv') || '419';
  });
  const [cardExpiry, setCardExpiry] = useState<string>(() => {
    return localStorage.getItem('monipay_card_expiry') || '09/31';
  });

  // Standard transactions list
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('monipay_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: 'tx_1', type: 'inbound', title: 'Ref: Sarah Jenkins', subtitle: 'Transfer from Sarah', amount: 5000, timeStr: 'Today, 1:45 PM' },
      { id: 'tx_2', type: 'outbound', title: 'Uber Technologies', subtitle: 'Mobility services', amount: 12500, timeStr: 'Yesterday, 8:12 PM' },
      { id: 'tx_3', type: 'outbound', title: 'Yonkers Groceries', subtitle: 'Shopping mart', amount: 30000, timeStr: 'May 22, 11:30 AM' }
    ];
  });

  // Persist MoniPay States to LocalStorage
  useEffect(() => {
    localStorage.setItem('monipay_balance', availableBalance.toString());
  }, [availableBalance]);

  useEffect(() => {
    localStorage.setItem('monipay_account_number', userAccountNumber);
  }, [userAccountNumber]);

  useEffect(() => {
    localStorage.setItem('monipay_card_no', cardNo);
    localStorage.setItem('monipay_card_cvv', cardCvv);
    localStorage.setItem('monipay_card_expiry', cardExpiry);
  }, [cardNo, cardCvv, cardExpiry]);

  useEffect(() => {
    localStorage.setItem('monipay_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Sync state dynamically if an external event modification happens
  useEffect(() => {
    const handleExternalUpdate = () => {
      const savedBalance = localStorage.getItem('monipay_balance');
      if (savedBalance !== null) {
        setAvailableBalance(parseFloat(savedBalance));
      }
      const savedTransactions = localStorage.getItem('monipay_transactions');
      if (savedTransactions) {
        try {
          setTransactions(JSON.parse(savedTransactions));
        } catch (e) {}
      }
    };

    window.addEventListener('monipay_external_update', handleExternalUpdate);
    return () => {
      window.removeEventListener('monipay_external_update', handleExternalUpdate);
    };
  }, []);

  // Outbound transfer states
  const [transferTargetAcct, setTransferTargetAcct] = useState<string>('');
  const [transferBank, setTransferBank] = useState<string>('MoniBank');
  const [customTransferBank, setCustomTransferBank] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [resolvedName, setResolvedName] = useState<string>('');
  const [isEditingResolvedName, setIsEditingResolvedName] = useState<boolean>(false);
  const [customRecipientName, setCustomRecipientName] = useState<string>('');
  const [isResolvingAccount, setIsResolvingAccount] = useState<boolean>(false);
  const [isProcessingTransaction, setIsProcessingTransaction] = useState<boolean>(false);

  useEffect(() => {
    if (pendingPayment && pendingPayment.bankType === 'monipay') {
      setTransferTargetAcct('9023456789'); // Demo OPay number
      setTransferBank('Other');
      setCustomTransferBank('OPay');
      setTransferAmount(String(pendingPayment.amount));
      setResolvedName(pendingPayment.recipient);
      setCustomRecipientName(pendingPayment.recipient);
      setCurrentScreen('transfer');
    }
  }, [pendingPayment]);

  // Receipt visual state
  const [activeReceipt, setActiveReceipt] = useState<{
    id: string;
    type: 'Send' | 'Receive' | 'Deposit' | 'Withdrawal';
    amount: number;
    timeStr: string;
    refId: string;
    fee: number;
    senderName: string;
    receiverName: string;
    bankName?: string;
    accountNo?: string;
    processingStatus: 'Successful' | 'Pending' | 'Failed';
  } | null>(null);

  // Inbound money states
  const [inboundSender, setInboundSender] = useState<string>('');
  const [inboundAcct, setInboundAcct] = useState<string>('');
  const [inboundBank, setInboundBank] = useState<string>('Zion Bank');
  const [customInboundBank, setCustomInboundBank] = useState<string>('');
  const [inboundAmount, setInboundAmount] = useState<string>('');

  // Clipboard toast (stores string of what was copied)
  const [copiedText, setCopiedText] = useState<string>('');

  // Keep countdown timer for account generation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGeneratingAccount && accountCountdown > 0) {
      timer = setInterval(() => {
        setAccountCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGeneratingAccount, accountCountdown]);

  // Handle countdown termination side effects safely
  useEffect(() => {
    if (isGeneratingAccount && accountCountdown === 0) {
      setIsGeneratingAccount(false);
      const newAcctNum = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setUserAccountNumber(newAcctNum);
      addLog(`MoniPay: Created new Account Number: ${newAcctNum}`);
      onTriggerNotification("MoniPay", "Your new Account Number has been successfully provisioned!");
    }
  }, [isGeneratingAccount, accountCountdown, addLog, onTriggerNotification]);

  // Instantly resolve mock account name when account number is 10 digits with a 3-second delay
  useEffect(() => {
    if (transferTargetAcct.trim().length === 10) {
      setIsResolvingAccount(true);
      setResolvedName('');
      const timer = setTimeout(() => {
        // Mock deterministic names
        const suffix = transferTargetAcct.slice(-3);
        let name = "Sarah Jenkins";
        if (suffix.includes('1') || suffix.includes('4')) name = "Alex Benson";
        if (suffix.includes('2') || suffix.includes('5')) name = "Monica Geller";
        if (suffix.includes('3') || suffix.includes('8')) name = "David Beckham";
        if (suffix.includes('0') || suffix.includes('7')) name = "Chioma Adebayo";
        if (suffix.includes('9') || suffix.includes('6')) name = "Olumide Awosika";
        
        setResolvedName(name);
        setCustomRecipientName(name);
        setIsResolvingAccount(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setResolvedName('');
      setIsResolvingAccount(false);
    }
  }, [transferTargetAcct]);

  // Helper to format naira
  const formatNaira = (amt: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amt);
  };

  const handleTxClick = (tx: Transaction) => {
    // Determine type: Send, Receive, Deposit, Withdrawal
    let txType: 'Send' | 'Receive' | 'Deposit' | 'Withdrawal' = 'Send';
    let senderName = profileName;
    let receiverName = '';
    let bankName = 'MoniBank';
    let accountNo = userAccountNumber;
    let fee = 0;
    let refId = tx.refId || '';

    if (!refId) {
      // Auto-generate random unique reference ID
      refId = 'MP-' + Math.floor(100000 + Math.random() * 900000) + '-' + Math.floor(100000000 + Math.random() * 900000000);
    }

    if (tx.txType) {
      txType = tx.txType;
      senderName = tx.senderName || profileName;
      receiverName = tx.receiverName || '';
      bankName = tx.bankName || 'MoniBank';
      accountNo = tx.accountNo || userAccountNumber;
      fee = tx.fee !== undefined ? tx.fee : 0;
    } else {
      // Parse dynamically
      if (tx.type === 'inbound') {
        txType = 'Receive';
        const parsedSender = tx.title.replace('Ref: ', '').replace('Funds from ', '').replace('Transfer from ', '');
        senderName = parsedSender;
        receiverName = profileName;
        bankName = tx.subtitle.split(' • ')[0] || 'Zion Bank';
        accountNo = '509' + Math.floor(1000000 + Math.random() * 9000000);
        fee = 0;
      } else {
        // outbound
        if (tx.title.startsWith('Transfer to ')) {
          txType = 'Send';
          senderName = profileName;
          receiverName = tx.title.replace('Transfer to ', '');
          const parts = tx.subtitle.split(' • ');
          bankName = parts[0] || 'Other Bank';
          accountNo = parts[1] || '204' + Math.floor(1000000 + Math.random() * 9000000);
          fee = tx.amount >= 10000 ? tx.amount * 0.02 : 0;
        } else if (tx.title.includes('Airtime') || tx.title.includes('Data') || tx.title.includes('Fee') || tx.title.includes('Replacement') || tx.title.includes('Migration')) {
          txType = 'Withdrawal';
          senderName = profileName;
          receiverName = tx.title;
          const parts = tx.subtitle.split(' • ');
          accountNo = parts[1] || userAccountNumber;
          bankName = 'MoniPay Network';
          fee = 0;
        } else {
          // generic outbound e.g. Uber Technologies, Yonkers Groceries
          txType = 'Withdrawal';
          senderName = profileName;
          receiverName = tx.title;
          bankName = 'MoniCard Terminal';
          accountNo = userAccountNumber;
          fee = 0;
        }
      }
    }

    const txDetails = {
      id: tx.id,
      type: txType,
      amount: tx.amount,
      timeStr: tx.timeStr === 'Just now' ? 'Today, 2:08 PM' : tx.timeStr,
      refId,
      fee,
      senderName,
      receiverName,
      bankName,
      accountNo,
      processingStatus: 'Successful' as const
    };

    setActiveReceipt(txDetails);
    setCurrentScreen('receipt');
  };

  // Switch Theme Specific styling colors
  const styleBg = monipayTheme === 'dark' ? 'bg-[#121212] text-white' : 'bg-[#FAFAFB] text-zinc-900';
  const styleCard = monipayTheme === 'dark' ? 'bg-[#1E1E1E] border border-zinc-800 text-white' : 'bg-white border border-zinc-150 text-zinc-900 shadow-xs';
  const styleSub = monipayTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-500';

  // Quick Action Handlers
  const handleProceedTransfer = () => {
    const amt = parseFloat(transferAmount);
    if (!transferTargetAcct || transferTargetAcct.length !== 10) {
      alert("Please enter a valid 10-digit account number.");
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid positive transfer amount.");
      return;
    }
    
    // Calculate 2% transaction fee on transfers of 10,000 naira and above only
    const fee = amt >= 10000 ? amt * 0.02 : 0;
    const totalDeduction = amt + fee;

    if (totalDeduction > availableBalance) {
      alert(`Insufficient balance to perform this transfer. Total deduction including 2% fee is ${formatNaira(totalDeduction)} (Fee: ${formatNaira(fee)}).`);
      return;
    }

    // Intercept with a 4-second processing timer
    setIsProcessingTransaction(true);

    setTimeout(() => {
      // Deduct transfer amount and transaction fee
      const finalRecipient = customRecipientName || resolvedName || "Beneficiary";
      setAvailableBalance(prev => prev - totalDeduction);

      // Random unique Reference ID
      const txNo = 'MP-' + Math.floor(100000 + Math.random() * 900000) + '-' + Math.floor(100000000 + Math.random() * 900000000);

      // Format current time
      const timeFormat = systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + systemTime.toLocaleDateString([], { month: 'short', day: 'numeric' });

      const resolvedBankName = transferBank === 'Other' ? (customTransferBank || 'Other Bank') : transferBank;

      const txDetails = {
        id: 'tx_out_' + Date.now(),
        type: 'Send' as const,
        amount: amt,
        timeStr: timeFormat,
        refId: txNo,
        fee,
        senderName: profileName,
        receiverName: finalRecipient,
        bankName: resolvedBankName,
        accountNo: transferTargetAcct,
        processingStatus: 'Successful' as const
      };

      // Log outbound transaction
      const newTx: Transaction = {
        id: txDetails.id,
        type: 'outbound',
        title: `Transfer to ${finalRecipient}`,
        subtitle: `${resolvedBankName} • ${transferTargetAcct}`,
        amount: amt,
        timeStr: 'Just now',
        txType: 'Send',
        refId: txNo,
        fee,
        senderName: profileName,
        receiverName: finalRecipient,
        bankName: resolvedBankName,
        accountNo: transferTargetAcct,
        processingStatus: 'Successful'
      };

      setTransactions(prev => [newTx, ...prev]);
      setActiveReceipt(txDetails);
      addLog(`MoniPay: Transferred ₦${amt} (Fee: ₦${fee}) to ${finalRecipient}`);

      // Dispatch mail notification for Transfer
      window.dispatchEvent(new CustomEvent('send_virtual_mail', {
        detail: {
          sender: 'MoniPay Alerts',
          subject: 'Debit Alert: Transfer Completed',
          preview: `₦${amt.toLocaleString()} successfully transferred to ${finalRecipient}.`,
          body: `Hello Edward,\n\nWe wish to inform you that a debit transaction occurred on your account.\n\nTransaction Details:\n- Ref ID: ${txNo}\n- Recipient Name: ${finalRecipient}\n- Recipient Account: ${transferTargetAcct} (${resolvedBankName})\n- Amount: ₦${amt.toLocaleString()}\n- Transaction Fee: ₦${fee.toLocaleString()}\n- Timestamp: ${timeFormat}\n\nIf you did not authorize this, please freeze your card instantly in Settings.\n\nThank you for choosing MoniPay,\nLedger Operations Centre`
        }
      }));

      // Handle custom Shopit checkout hook
      if (pendingPayment) {
        localStorage.setItem('shopit_cart', JSON.stringify([]));
        
        const existingInventoryStr = localStorage.getItem('storage_inventory') || '[]';
        let existingInventory: any[] = [];
        try {
          existingInventory = JSON.parse(existingInventoryStr);
        } catch (e) {}

        const boughtItems = pendingPayment.items.map((it: any) => {
          const itemPriceUSD = it.usdPrice !== undefined ? it.usdPrice : (it.price || 0);
          const unitPrice = itemPriceUSD * 1500;
          return {
            ...it,
            id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            purchaseDate: systemTime.toLocaleDateString() + ' ' + systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            paidPriceText: `₦${unitPrice.toLocaleString()}`,
            purchasePrice: unitPrice,
            purchaseCurrency: 'NGN',
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
      
      // Clear inputs
      setTransferTargetAcct('');
      setTransferAmount('');
      setTransferBank('MoniBank');
      setCustomTransferBank('');
      setResolvedName('');
      setIsProcessingTransaction(false);
      setCurrentScreen('receipt');
    }, 4000);
  };

  const handleProceedAddMoney = () => {
    const amt = parseFloat(inboundAmount);
    if (!inboundSender.trim()) {
      alert("Please enter a sender name.");
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    const sender = inboundSender;
    const resolvedAmt = amt;
    const acct = inboundAcct || "2000189482";
    const srcBank = inboundBank === 'Other' ? (customInboundBank || 'Other Bank') : inboundBank;

    // INVISIBLE DELAY ENGINE
    // Close modal / screen instantly, returning user to dashboard
    setCurrentScreen('dashboard');
    addLog(`MoniPay: Inbound transfer of ₦${resolvedAmt} scheduled from ${sender} in 8s`);

    // Complete values clear
    setInboundSender('');
    setInboundAcct('');
    setInboundAmount('');
    setCustomInboundBank('');
    setInboundBank('Zion Bank');

    // Trigger Timeout: exactly 8 seconds
    setTimeout(() => {
      // Add funds silenty
      setAvailableBalance(prev => prev + resolvedAmt);

      // Create ledger item
      const inboundTime = systemTime;
      const timeStr = inboundTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + inboundTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
      
      const txNo = 'MP-' + Math.floor(100000 + Math.random() * 900000) + '-' + Math.floor(100000000 + Math.random() * 900000000);

      const newTx: Transaction = {
        id: 'tx_in_' + Date.now(),
        type: 'inbound',
        title: `Funds from ${sender}`,
        subtitle: `${srcBank} • Ref Inbound`,
        amount: resolvedAmt,
        timeStr: 'Just now',
        txType: 'Receive',
        refId: txNo,
        fee: 0,
        senderName: sender,
        receiverName: profileName,
        bankName: srcBank,
        accountNo: acct,
        processingStatus: 'Successful'
      };

      setTransactions(prev => [newTx, ...prev]);
      addLog(`MoniPay: Silently received ₦${resolvedAmt} from ${sender}`);

      // Dispatch mail notification for Received Payment
      window.dispatchEvent(new CustomEvent('send_virtual_mail', {
        detail: {
          sender: 'MoniPay Alerts',
          subject: 'Credit Alert: Inbound Funds Received',
          preview: `You have successfully received ₦${resolvedAmt.toLocaleString()} from ${sender}.`,
          body: `Hello Edward,\n\nWe notify you that a credit ledger deposit occurred on your account.\n\nDescription:\n- Origin Name: ${sender}\n- Route: ${srcBank}\n- Amount: +₦${resolvedAmt.toLocaleString()}\n- Timestamp: ${timeStr}\n\nYour available funds have adjusted live inside MoniPay.\n\nThank you for choosing MoniPay,\nLedger Operations Centre`
        }
      }));

      // DRIVER FOR DYNAMIC ISLAND BANNER BLOCK NOTIFICATION
      onTriggerNotification("MoniPay", `${sender} sent you ₦${resolvedAmt.toLocaleString()}`);
    }, 8000);
  };

  // Advanced settings requests
  const handleRequestNewAccount = () => {
    if (availableBalance < 1000) {
      alert("Insufficient balance. Preparing a new account costs ₦1,000.");
      return;
    }
    // Deduct instant cost
    setAvailableBalance(prev => prev - 1000);
    
    // Add transaction log
    const refId = 'MP-' + Math.floor(100000 + Math.random() * 900000) + '-' + Math.floor(100000000 + Math.random() * 900000000);
    const feeTx: Transaction = {
      id: 'fee_acct_' + Date.now(),
      type: 'outbound',
      title: 'MoniPay Account Migration Fee',
      subtitle: 'System administrative charge',
      amount: 1000,
      timeStr: 'Just now',
      txType: 'Withdrawal',
      refId,
      fee: 0,
      senderName: profileName,
      receiverName: 'MoniPay Operations',
      bankName: 'MoniPay Network',
      accountNo: userAccountNumber,
      processingStatus: 'Successful'
    };
    setTransactions(prev => [feeTx, ...prev]);

    // Start strict 10-second silent countdown in UI
    setIsGeneratingAccount(true);
    setAccountCountdown(10);
    addLog(`MoniPay: Account change requested. Cost ₦1,000. Under validation...`);
  };

  const handleRequestNewCard = () => {
    if (availableBalance < 5000) {
      alert("Insufficient balance. Card replacement costs ₦5,000.");
      return;
    }
    // Deduct instantly
    setAvailableBalance(prev => prev - 5000);

    // Add transaction log
    const refId = 'MP-' + Math.floor(100000 + Math.random() * 900000) + '-' + Math.floor(100000000 + Math.random() * 900000000);
    const cardTx: Transaction = {
      id: 'fee_card_' + Date.now(),
      type: 'outbound',
      title: 'Virtual Card Replacement Fee',
      subtitle: 'New Visa card generation cost',
      amount: 5000,
      timeStr: 'Just now',
      txType: 'Withdrawal',
      refId,
      fee: 0,
      senderName: profileName,
      receiverName: 'Visa Card Issuer',
      bankName: 'MoniCard Terminal',
      accountNo: userAccountNumber,
      processingStatus: 'Successful'
    };
    setTransactions(prev => [cardTx, ...prev]);

    // Instantly generate new values
    let freshCard = '4352 ';
    for (let i = 0; i < 3; i++) {
      freshCard += Math.floor(1000 + Math.random() * 9000).toString() + (i < 2 ? ' ' : '');
    }
    const freshCvv = Math.floor(100 + Math.random() * 900).toString();
    
    setCardNo(freshCard);
    setCardCvv(freshCvv);
    addLog("MoniPay: Instant Virtual Visa renewal processed. Bill ₦5,000.");
    onTriggerNotification("MoniPay", "Your new virtual Visa Card has been generated instantly!");
    alert("New Virtual Mastercard/Visa generated successfully!");
  };

  // Mask helper for account numbers
  const maskAccountNumber = (acct: string) => {
    if (!acct) return "N/A";
    const clean = acct.replace(/\s+/g, '');
    if (clean.length >= 8) {
      return clean.slice(0, 4) + '****' + clean.slice(-4);
    }
    return clean;
  };

  // Canvas builder to draw high fidelity receipts and trigger immediate local download
  const downloadReceiptAsImage = (receipt: any) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background white (standard for receipt paper prints)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 600, 760);

    // Beautiful slate border
    ctx.strokeStyle = '#E4E4E7';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 580, 740);

    // Brand icon / symbol (₦ inside a green circle)
    ctx.fillStyle = '#00C37A';
    ctx.beginPath();
    ctx.arc(300, 60, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('₦', 300, 60);

    // App name brand label
    ctx.fillStyle = '#09090B';
    ctx.font = '900 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('MONIPAY', 300, 100);

    // Title label
    ctx.fillStyle = '#71717A';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('TRANSACTION RECEIPT', 300, 120);

    // Dotted divide line
    ctx.strokeStyle = '#D4D4D8';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(40, 140);
    ctx.lineTo(560, 140);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dashed state

    // Successful badge block
    ctx.fillStyle = '#ECFDF5';
    ctx.beginPath();
    const badgeW = 100;
    const badgeH = 22;
    const badgeX = 300 - badgeW / 2;
    const badgeY = 155;
    // Drawing a simple rounded rect manually
    ctx.roundRect ? ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 11) : ctx.rect(badgeX, badgeY, badgeW, badgeH);
    ctx.fill();

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('SUCCESSFUL', 300, 166);

    // Giant amount display
    ctx.fillStyle = '#00C37A';
    ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const amountVal = formatNaira(receipt.amount);
    ctx.fillText(amountVal, 300, 215);

    // Prepare table lines
    const rows = [
      { label: 'TRANSACTION TYPE', value: receipt.type },
      { label: 'AMOUNT', value: amountVal },
      { label: 'DATE & TIME', value: receipt.timeStr },
      { label: 'REFERENCE ID', value: receipt.refId },
      { label: 'TRANSACTION FEE', value: formatNaira(receipt.fee || 0) },
      { label: 'SENDER NAME', value: receipt.senderName || profileName },
      { label: 'RECEIVER NAME', value: receipt.receiverName || 'MoniPay User' },
      { label: 'BANK NAME', value: receipt.bankName || 'MoniBank' },
      { label: 'ACCOUNT NUMBER', value: maskAccountNumber(receipt.accountNo || '') }
    ];

    if (receipt.type === 'Send') {
      rows.push(
        { label: 'DESTINATION BANK', value: receipt.bankName || 'Other Bank' },
        { label: 'BENEFICIARY NAME', value: receipt.receiverName },
        { label: 'PROCESSING STATUS', value: receipt.processingStatus || 'Successful' }
      );
    }

    // Iterate and draw key-value pairs
    let currentY = 265;
    ctx.textAlign = 'left';
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

    rows.forEach(row => {
      // Draw label in soft slate
      ctx.fillStyle = '#71717A';
      ctx.fillText(row.label, 50, currentY);

      // Draw value in heavy charcoal
      ctx.fillStyle = '#09090B';
      ctx.textAlign = 'right';
      ctx.fillText(row.value, 550, currentY);
      ctx.textAlign = 'left'; // Reset back to left

      // Soft row divider line
      ctx.strokeStyle = '#F4F4F5';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, currentY + 10);
      ctx.lineTo(550, currentY + 10);
      ctx.stroke();

      currentY += 30;
    });

    // Disclaimer footer
    ctx.fillStyle = '#A1A1AA';
    ctx.font = '500 9px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Thank you for choosing MoniPay.', 300, 710);
    ctx.fillText('Secure Ledger Operations • support@monipay.network', 300, 725);

    // Instigate direct download trigger
    const link = document.createElement('a');
    link.download = `monipay-receipt-${receipt.refId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    addLog(`MoniPay: Downloaded receipt PNG for Ref ID ${receipt.refId}`);
  };

  // High fidelity printable PDF engine inside sandbox
  const printReceiptPDF = (receipt: any) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    const receiptHtml = `
      <html>
        <head>
          <title>MoniPay Receipt - ${receipt.refId}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              padding: 40px;
              color: #1f2937;
              background: #fff;
              font-size: 14px;
            }
            .receipt-card {
              max-width: 500px;
              margin: 0 auto;
              border: 1px solid #e5e7eb;
              border-radius: 20px;
              padding: 30px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 25px;
            }
            .logo-circle {
              width: 44px;
              height: 44px;
              background-color: #00C37A;
              color: white;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              font-size: 20px;
              margin: 0 auto 10px auto;
            }
            .brand {
              font-weight: 900;
              font-size: 18px;
              letter-spacing: -0.025em;
              margin: 0;
            }
            .title {
              font-size: 11px;
              font-weight: 700;
              color: #6b7280;
              letter-spacing: 0.15em;
              margin: 5px 0 0 0;
            }
            .success-badge {
              display: inline-block;
              background: #ecfdf5;
              color: #059669;
              font-weight: 800;
              font-size: 10px;
              padding: 4px 12px;
              border-radius: 12px;
              margin: 15px 0;
              letter-spacing: 0.05em;
            }
            .amount {
              font-size: 28px;
              font-weight: 900;
              color: #00C37A;
              margin: 5px 0 20px 0;
            }
            .divider {
              border-top: 1px dashed #d1d5db;
              margin: 20px 0;
            }
            .row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            .label {
              color: #6b7280;
              font-weight: 600;
              font-size: 11px;
            }
            .value {
              font-weight: 700;
              color: #111827;
              font-size: 12px;
            }
            .footer {
              text-align: center;
              color: #9ca3af;
              font-size: 10px;
              margin-top: 30px;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            <div class="header">
              <div class="logo-circle">₦</div>
              <h2 class="brand">MONIPAY</h2>
              <p class="title">TRANSACTION RECEIPT</p>
              <div class="success-badge">SUCCESSFUL</div>
              <div class="amount">${formatNaira(receipt.amount)}</div>
            </div>
            
            <div class="row">
              <span class="label">TRANSACTION TYPE</span>
              <span class="value">${receipt.type}</span>
            </div>
            <div class="row">
              <span class="label">DATE & TIME</span>
              <span class="value">${receipt.timeStr}</span>
            </div>
            <div class="row">
              <span class="label">REFERENCE ID</span>
              <span class="value">${receipt.refId}</span>
            </div>
            <div class="row">
              <span class="label">TRANSACTION FEE</span>
              <span class="value">${formatNaira(receipt.fee || 0)}</span>
            </div>
            <div class="row">
              <span class="label">SENDER NAME</span>
              <span class="value">${receipt.senderName || 'Edward Azubuike'}</span>
            </div>
            <div class="row">
              <span class="label">RECEIVER NAME</span>
              <span class="value">${receipt.receiverName || 'MoniPay User'}</span>
            </div>
            <div class="row">
              <span class="label">BANK NAME</span>
              <span class="value">${receipt.bankName || 'MoniBank'}</span>
            </div>
            <div class="row">
              <span class="label">ACCOUNT NUMBER</span>
              <span class="value">${maskAccountNumber(receipt.accountNo || '')}</span>
            </div>
            ${receipt.type === 'Send' ? `
            <div class="row">
              <span class="label">DESTINATION BANK</span>
              <span class="value">${receipt.bankName || 'Other Bank'}</span>
            </div>
            <div class="row">
              <span class="label">BENEFICIARY NAME</span>
              <span class="value">${receipt.receiverName}</span>
            </div>
            <div class="row">
              <span class="label">PROCESSING STATUS</span>
              <span class="value">${receipt.processingStatus || 'Successful'}</span>
            </div>
            ` : ''}

            <div class="divider"></div>

            <div class="footer">
              Thank you for choosing MoniPay.<br>
              Secure Ledger System • support@monipay.network
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.parent.postMessage('close_print_iframe', '*');
              }, 1000);
            }
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(receiptHtml);
    doc.close();

    const listener = (event: MessageEvent) => {
      if (event.data === 'close_print_iframe') {
        try {
          document.body.removeChild(iframe);
        } catch (e) {}
        window.removeEventListener('message', listener);
      }
    };
    window.addEventListener('message', listener);
    addLog(`MoniPay: Triggered print PDF for Ref ID ${receipt.refId}`);
  };

  // Share Receipt summary builder supporting file and text API with clipboard backups
  const handleShareReceipt = (receipt: any) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 600, 760);

    // Draw border
    ctx.strokeStyle = '#E4E4E7';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 580, 740);

    // Draw branding icon
    ctx.fillStyle = '#00C37A';
    ctx.beginPath();
    ctx.arc(300, 60, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('₦', 300, 60);

    ctx.fillStyle = '#09090B';
    ctx.font = '900 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('MONIPAY', 300, 100);

    ctx.fillStyle = '#71717A';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('TRANSACTION RECEIPT', 300, 120);

    // Dotted divide line
    ctx.strokeStyle = '#D4D4D8';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(40, 140);
    ctx.lineTo(560, 140);
    ctx.stroke();
    ctx.setLineDash([]);

    // Success badge
    ctx.fillStyle = '#ECFDF5';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(250, 155, 100, 22, 11) : ctx.rect(250, 155, 100, 22);
    ctx.fill();

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('SUCCESSFUL', 300, 166);

    // Amount
    ctx.fillStyle = '#00C37A';
    ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(formatNaira(receipt.amount), 300, 215);

    // Rows
    const rows = [
      { label: 'TRANSACTION TYPE', value: receipt.type },
      { label: 'DATE & TIME', value: receipt.timeStr },
      { label: 'REFERENCE ID', value: receipt.refId },
      { label: 'TRANSACTION FEE', value: formatNaira(receipt.fee || 0) },
      { label: 'SENDER NAME', value: receipt.senderName || profileName },
      { label: 'RECEIVER NAME', value: receipt.receiverName || 'MoniPay User' },
      { label: 'BANK NAME', value: receipt.bankName || 'MoniBank' },
      { label: 'ACCOUNT NUMBER', value: maskAccountNumber(receipt.accountNo || '') }
    ];

    let currentY = 265;
    ctx.textAlign = 'left';
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

    rows.forEach(row => {
      ctx.fillStyle = '#71717A';
      ctx.fillText(row.label, 50, currentY);
      ctx.fillStyle = '#09090B';
      ctx.textAlign = 'right';
      ctx.fillText(row.value, 550, currentY);
      ctx.textAlign = 'left';
      ctx.strokeStyle = '#F4F4F5';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, currentY + 10);
      ctx.lineTo(550, currentY + 10);
      ctx.stroke();
      currentY += 30;
    });

    ctx.fillStyle = '#A1A1AA';
    ctx.font = '500 9px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Thank you for choosing MoniPay.', 300, 710);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `monipay-receipt-${receipt.refId}.png`, { type: 'image/png' });

      // If sharing image file is supported natively
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'MoniPay Transaction Receipt',
            text: `Receipt for transaction ${receipt.refId} (${formatNaira(receipt.amount)})`
          });
          addLog(`MoniPay: Shared receipt PNG via system share sheet`);
          return;
        } catch (err) {
          console.log('Error sharing receipt file:', err);
        }
      }

      // If standard share text is supported natively
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'MoniPay Transaction Receipt',
            text: `🧾 MoniPay Transaction Receipt\nRef: ${receipt.refId}\nType: ${receipt.type}\nAmount: ${formatNaira(receipt.amount)}\nFee: ${formatNaira(receipt.fee || 0)}\nDate: ${receipt.timeStr}\nStatus: Successful`
          });
          addLog(`MoniPay: Shared receipt text via system share sheet`);
          return;
        } catch (err) {
          console.log('Error sharing receipt text:', err);
        }
      }

      // Clipboard fallback
      const summaryText = `🧾 MONIPAY TRANSACTION RECEIPT\n---------------------------\nStatus: Successful\nType: ${receipt.type}\nAmount: ${formatNaira(receipt.amount)}\nRef: ${receipt.refId}\nFee: ${formatNaira(receipt.fee || 0)}\nDate: ${receipt.timeStr}\nSender: ${receipt.senderName || profileName}\nReceiver: ${receipt.receiverName || 'MoniPay User'}\nAccount: ${maskAccountNumber(receipt.accountNo || '')}`;
      navigator.clipboard.writeText(summaryText);
      setCopiedText('Receipt Summary');
      setTimeout(() => setCopiedText(''), 2000);
      alert('System share sheet is not supported in this browser. We have copied a structured receipt summary to your clipboard and triggered a direct image download of the receipt card!');
      
      const link = document.createElement('a');
      link.download = `monipay-receipt-${receipt.refId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }, 'image/png');
  };

  // Copy helper
  const handleCopyClipboard = (text: string, label: string = 'Reference ID') => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <div id="monipay_main_wrapper" className={`flex flex-col h-full ${styleBg} font-sans relative select-none`}>
      {/* Toast popup */}
      {copiedText && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 text-white rounded-full py-1.5 text-center px-4 shadow-lg text-[9px] font-semibold z-50 flex items-center gap-1.5 animate-bounce">
          <Check className="w-3.5 h-3.5 text-[#00C37A]" /> {copiedText} Copied to Clipboard
        </div>
      )}

      {/* Top Banner Header context */}
      <div className="px-5 pt-4 pb-2 border-b border-zinc-500/10 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-[#00C37A] text-black font-black flex items-center justify-center text-[10px]">
            ₦
          </div>
          <div>
            <h2 className="text-xs font-black tracking-tight leading-none uppercase">MoniPay</h2>
            <p className="text-[7.5px] uppercase tracking-widest text-[#00C37A] font-bold mt-0.5">Fintech Ultra</p>
          </div>
        </div>

        {/* Header menu selector icons */}
        <div className="flex items-center gap-2">
          {/* Quick theme toggler in top header */}
          <button 
            id="monipay_theme_toggle_header"
            onClick={() => setMonipayTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className={`p-1 rounded-lg ${monipayTheme === 'dark' ? 'bg-[#1E1E1E] border border-zinc-800 hover:bg-zinc-800' : 'bg-white border border-zinc-200 hover:bg-zinc-100'} cursor-pointer text-[#00C37A]`}
            title="Toggle MoniPay Light/Dark mode"
          >
            {monipayTheme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          </button>
          
          <button 
            id="monipay_cards_screen_btn"
            onClick={() => setCurrentScreen('cards')} 
            className={`p-1 rounded-lg ${currentScreen === 'cards' ? 'bg-[#00C37A] text-black' : monipayTheme === 'dark' ? 'bg-[#1E1E1E]' : 'bg-white border border-zinc-200'} cursor-pointer`}
          >
            <CreditCard className="w-3.5 h-3.5" />
          </button>

          <button 
            id="monipay_settings_screen_btn"
            onClick={() => setCurrentScreen('settings')} 
            className={`p-1 rounded-lg ${currentScreen === 'settings' ? 'bg-[#00C37A] text-black' : monipayTheme === 'dark' ? 'bg-[#1E1E1E]' : 'bg-white border border-zinc-200'} cursor-pointer`}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Screen container body with scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-8">
        
        {/* VIEW 1: DASHBOARD */}
        {currentScreen === 'dashboard' && (
          <div className="space-y-4 animate-fadeIn" id="monipay_screen_dashboard">
            
            {/* Balance container card */}
            <div className={`p-4 rounded-[24px] ${styleCard} relative overflow-hidden flex flex-col justify-between shadow-xs`}>
              <div className="absolute top-[-30%] right-[-10%] w-24 h-24 bg-[#00C37A]/5 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-75">Available Balance</span>
                <button 
                  id="monipay_balance_toggle_eye"
                  onClick={() => setIsBalanceMasked(!isBalanceMasked)}
                  className="p-1 text-[#00C37A] hover:bg-zinc-800/10 rounded"
                >
                  {isBalanceMasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="my-2.5">
                <h1 className="text-2xl font-black tracking-tight leading-none text-[#00C37A]">
                  {isBalanceMasked ? "••••••" : formatNaira(availableBalance)}
                </h1>
              </div>

              <div className="flex justify-between items-center border-t pt-2 mt-1 border-zinc-500/10 text-[9.5px]">
                <span className="opacity-70">Acct No: <span className="font-mono font-bold">{userAccountNumber}</span></span>
                {isGeneratingAccount && (
                  <span className="font-semibold text-rose-500 flex items-center gap-1 animate-pulse">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Provisioning in {accountCountdown}s
                  </span>
                )}
              </div>
            </div>

            {/* QUICK ACTIONS UTILITY GRID */}
            <div className="space-y-1.5" id="monipay_actions_section">
              <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-70">Quick Actions</span>
              <div className="grid grid-cols-4 gap-2">
                <button 
                  id="action_transfer_funds"
                  onClick={() => setCurrentScreen('transfer')}
                  className={`p-3 rounded-2xl ${styleCard} flex flex-col items-center gap-1 hover:border-[#00C37A] hover:scale-102 transition duration-150`}
                >
                  <div className="w-7 h-7 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-black">Transfer</span>
                </button>

                <button 
                  id="action_add_funds"
                  onClick={() => setCurrentScreen('add_money')}
                  className={`p-3 rounded-2xl ${styleCard} flex flex-col items-center gap-1 hover:border-[#00C37A] hover:scale-102 transition duration-150`}
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-[#00C37A]">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-black">Add Money</span>
                </button>

                <button 
                  id="action_airtime"
                  onClick={() => {
                    const numberStr = prompt("Enter mobile phone number to top-up airtime:");
                    if (numberStr) {
                      const amountStr = prompt("Enter airtime amount (₦):", "500");
                      const amt = parseFloat(amountStr || '0');
                      if (amt > 0 && availableBalance >= amt) {
                        setAvailableBalance(prev => prev - amt);
                        setTransactions(prev => [{
                          id: 'airtime_' + Date.now(),
                          type: 'outbound',
                          title: 'Airtime Recharge',
                          subtitle: `Recharge to ${numberStr}`,
                          amount: amt,
                          timeStr: 'Just now'
                        }, ...prev]);
                        alert("Airtime recharge successful!");
                      } else {
                        alert("Insufficient balance or invalid amount.");
                      }
                    }
                  }}
                  className={`p-3 rounded-2xl ${styleCard} flex flex-col items-center gap-1 hover:border-[#00C37A] hover:scale-102 transition duration-150`}
                >
                  <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-black">Airtime</span>
                </button>

                <button 
                  id="action_data"
                  onClick={() => {
                    const numberStr = prompt("Enter mobile phone number to purchase internet data:");
                    if (numberStr) {
                      const cost = 1200;
                      if (availableBalance >= cost) {
                        setAvailableBalance(prev => prev - cost);
                        setTransactions(prev => [{
                          id: 'data_' + Date.now(),
                          type: 'outbound',
                          title: '1.5GB Data Plan',
                          subtitle: `Data purchase for ${numberStr}`,
                          amount: cost,
                          timeStr: 'Just now'
                        }, ...prev]);
                        alert("1.5GB Internet Data Plan activated successfully!");
                      } else {
                        alert("Insufficient available balance.");
                      }
                    }
                  }}
                  className={`p-3 rounded-2xl ${styleCard} flex flex-col items-center gap-1 hover:border-[#00C37A] hover:scale-102 transition duration-150`}
                >
                  <div className="w-7 h-7 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-black">Data bundle</span>
                </button>
              </div>
            </div>

            {/* CHRONOLOGICAL "RECENT TRANSACTIONS" LEDGER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-70">Recent Transactions</span>
                <span className="text-[8.5px] font-bold text-[#00C37A] opacity-90 font-mono">Real-time Tracker</span>
              </div>
              
              <div className="space-y-1.5" id="monipay_transactions_ledger">
                {transactions.slice(0, 5).map(tx => (
                  <div 
                    id={`ledger_item_${tx.id}`}
                    key={tx.id}
                    onClick={() => handleTxClick(tx)}
                    className={`p-3 rounded-2xl ${styleCard} flex justify-between items-center gap-3 cursor-pointer hover:border-[#00C37A]/30 hover:scale-[1.01] active:scale-[0.99] transition`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        tx.type === 'inbound' ? 'bg-emerald-500/10 text-[#00C37A]' : 'bg-rose-500/10 text-rose-500'
                       }`}>
                        {tx.type === 'inbound' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-black truncate">{tx.title}</h4>
                        <p className={`text-[9px] font-medium truncate ${styleSub}`}>{tx.subtitle}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[11px] font-black block leading-none ${
                        tx.type === 'inbound' ? 'text-[#00C37A]' : 'text-rose-500/90'
                      }`}>
                        {tx.type === 'inbound' ? '+' : '-'}{formatNaira(tx.amount)}
                      </span>
                      <span className="text-[8px] opacity-50 block mt-1 font-mono font-medium">{tx.timeStr}</span>
                    </div>
                  </div>
                ))}

                {transactions.length === 0 && (
                  <div className="text-center py-6 text-xs text-zinc-500 font-medium">
                    No transactions recorded yet.
                  </div>
                )}
              </div>

              {transactions.length > 5 && (
                <button
                  id="monipay_view_all_transactions_btn"
                  onClick={() => setCurrentScreen('history')}
                  className="w-full py-2.5 mt-1 bg-[#00C37A]/5 border border-dashed border-[#00C37A]/25 text-[#00C37A] text-[9.5px] font-black uppercase tracking-widest rounded-xl hover:bg-[#00C37A]/10 active:scale-95 transition cursor-pointer"
                >
                  View All Transactions ({transactions.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: OUTBOUND TRANSFER */}
        {currentScreen === 'transfer' && (
          <div className="space-y-4 animate-fadeIn" id="monipay_screen_transfer">
            {/* Header / Back */}
            <div className="flex items-center justify-between pb-1">
              <button 
                id="transfer_back_to_dashboard_btn"
                onClick={() => setCurrentScreen('dashboard')}
                className="text-xs font-bold text-[#00C37A] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <span className="text-[10px] font-black tracking-widest uppercase">Send Instant Funds</span>
              <div className="w-6"></div>
            </div>

            <div className={`p-4 rounded-[24px] ${styleCard} space-y-3`}>
              {/* Target Bank Input */}
              <div className="space-y-1">
                <label className="text-[9.5px] font-bold uppercase opacity-60">Recipient Bank</label>
                <select 
                  id="transfer_bank_select"
                  value={transferBank}
                  onChange={(e) => setTransferBank(e.target.value)}
                  className={`w-full p-2.5 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00C37A] ${
                    monipayTheme === 'dark' ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-zinc-50 border border-zinc-200 text-zinc-800'
                  }`}
                >
                  <option value="MoniBank">MoniBank Microfinance</option>
                  <option value="Guaranty Trust Bank">Guaranty Trust Bank (GTB)</option>
                  <option value="Access Bank">Access Bank Plc</option>
                  <option value="Zion Bank">Zion Bank Nigeria</option>
                  <option value="United Bank for Africa">United Bank for Africa (UBA)</option>
                  <option value="Zenith Bank">Zenith Bank Plc</option>
                  <option value="Other">Other</option>
                </select>

                {transferBank === 'Other' && (
                  <input
                    id="transfer_custom_bank_input"
                    type="text"
                    placeholder="Type unlisted bank name"
                    value={customTransferBank}
                    onChange={(e) => setCustomTransferBank(e.target.value)}
                    className={`w-full p-2.5 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00C37A] mt-1.5 ${
                      monipayTheme === 'dark' ? 'bg-zinc-900 border border-zinc-700 text-white' : 'bg-zinc-50 border border-zinc-205 text-zinc-800'
                    }`}
                  />
                )}
              </div>

              {/* 10-digit Account Number */}
              <div className="space-y-1">
                <label className="text-[9.5px] font-bold uppercase opacity-60">10-Digit Account Number</label>
                <input 
                  id="transfer_target_acct_input"
                  type="text" 
                  maxLength={10}
                  placeholder="e.g. 2049583192"
                  value={transferTargetAcct}
                  onChange={(e) => setTransferTargetAcct(e.target.value.replace(/\D/g, ''))}
                  className={`w-full p-2.5 text-xs text-left rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00C37A] font-mono ${
                    monipayTheme === 'dark' ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-zinc-50 border border-zinc-200 text-zinc-800'
                  }`}
                />
              </div>

              {/* Account Resolution Loading Spinner */}
              {isResolvingAccount && (
                <div className="p-3 bg-zinc-500/5 border border-zinc-500/20 rounded-2xl flex items-center justify-center gap-2 animate-pulse">
                  <span className="w-3.5 h-3.5 border-2 border-[#00C37A] border-t-transparent rounded-full animate-spin"></span>
                  <span className="text-[10px] font-bold text-zinc-400">Verifying account number...</span>
                </div>
              )}

              {/* Instantly Resolved Name Widget */}
              {resolvedName && !isResolvingAccount && (
                <div className="p-3 bg-[#00C37A]/5 border border-[#00C37A]/25 rounded-2xl flex items-center justify-between gap-2 animate-fadeIn">
                  <div className="min-w-0">
                    <span className="text-[8px] font-bold text-[#00C37A] uppercase tracking-wider block">Recipient Verification</span>
                    {isEditingResolvedName ? (
                      <input 
                        id="override_recipient_name_input"
                        type="text"
                        value={customRecipientName}
                        onChange={(e) => setCustomRecipientName(e.target.value)}
                        className={`text-xs font-black mt-0.5 border-b focus:outline-none bg-transparent w-full ${
                          monipayTheme === 'dark' ? 'text-white border-zinc-700' : 'text-zinc-800 border-zinc-350'
                        }`}
                        autoFocus
                      />
                    ) : (
                      <span className="text-xs font-extrabold truncate block">
                        {customRecipientName || resolvedName}
                      </span>
                    )}
                  </div>

                  <button 
                    id="toggle_edit_recipient_btn"
                    onClick={() => setIsEditingResolvedName(!isEditingResolvedName)}
                    className="text-[9.5px] bg-[#00C37A]/10 text-[#00C37A] font-semibold py-1 px-2.5 rounded-lg border border-[#00C37A]/20 active:scale-95 transition"
                  >
                    {isEditingResolvedName ? "Save" : "Edit"}
                  </button>
                </div>
              )}

              {/* Amount Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[9.5px] font-bold uppercase opacity-60">Amount (₦)</label>
                  <span className="text-[8.5px] font-bold text-[#00C37A]">Bal: {formatNaira(availableBalance)}</span>
                </div>
                <input 
                  id="transfer_amount_input"
                  type="number" 
                  placeholder="₦ Max Amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className={`w-full p-2.5 text-xs text-left rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00C37A] font-sans font-bold text-[#00C37A] ${
                    monipayTheme === 'dark' ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-zinc-50 border border-zinc-200 text-zinc-800'
                  }`}
                />
              </div>

              {/* Trigger Submit Action */}
              <button 
                id="transfer_proceed_submit_btn"
                onClick={handleProceedTransfer}
                disabled={transferTargetAcct.length !== 10 || !transferAmount}
                className="w-full py-3 mt-2 bg-[#00C37A] text-black font-extrabold text-xs rounded-xl shadow-xs hover:bg-emerald-450 disabled:opacity-45 select-none active:scale-98 transition duration-150"
              >
                Send Transfer Instantly
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: INBOUND FUNDING (ADD MONEY) */}
        {currentScreen === 'add_money' && (
          <div className="space-y-4 animate-fadeIn" id="monipay_screen_add_money">
            {/* Header */}
            <div className="flex items-center justify-between pb-1">
              <button 
                id="add_money_back_to_dashboard_btn"
                onClick={() => setCurrentScreen('dashboard')}
                className="text-xs font-bold text-[#00C37A] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <span className="text-[10px] font-black tracking-widest uppercase">Inbound Funding</span>
              <div className="w-6"></div>
            </div>

            <div className={`p-4 rounded-[24px] ${styleCard} space-y-3.5`}>
              <p className="text-[9.5px] text-zinc-400 text-center leading-normal">
                Simulate standard inbound financial transactions easily. Clicking "Proceed" closes the screen instantly and executes in the background. After **exactly 8 seconds**, fund adjustments apply along with dropping global UI alert banners.
              </p>

              {/* Sender Name */}
              <div className="space-y-1">
                <label className="text-[9.5px] font-bold uppercase opacity-60">Sender Full Name</label>
                <input 
                  id="inbound_sender_name_input"
                  type="text" 
                  placeholder="e.g. Aliko Dangote"
                  value={inboundSender}
                  onChange={(e) => setInboundSender(e.target.value)}
                  className={`w-full p-2.5 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00C37A] ${
                    monipayTheme === 'dark' ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-zinc-50 border border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              {/* Outbound acct */}
              <div className="space-y-1">
                <label className="text-[9.5px] font-bold uppercase opacity-60">Sender Account Number (10 digits)</label>
                <input 
                  id="inbound_sender_acct_input"
                  type="text" 
                  maxLength={10}
                  placeholder="e.g. 5092304859"
                  value={inboundAcct}
                  onChange={(e) => setInboundAcct(e.target.value.replace(/\D/g, ''))}
                  className={`w-full p-2.5 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00C37A] font-mono ${
                    monipayTheme === 'dark' ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-zinc-50 border border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              {/* Source Bank */}
              <div className="space-y-1">
                <label className="text-[9.5px] font-bold uppercase opacity-60">Source Bank</label>
                <select 
                  id="inbound_bank_select"
                  value={inboundBank}
                  onChange={(e) => setInboundBank(e.target.value)}
                  className={`w-full p-2.5 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00C37A] ${
                    monipayTheme === 'dark' ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-zinc-50 border border-zinc-200 text-zinc-900'
                  }`}
                >
                  <option value="Zion Bank">Zion Bank Nigeria</option>
                  <option value="United Bank for Africa">UBA Nigeria</option>
                  <option value="Guaranty Trust Bank">Guaranty Trust Bank</option>
                  <option value="Zenith Bank">Zenith Bank Plc</option>
                  <option value="Kuda Bank">Kuda Microfinance</option>
                  <option value="Other">Other</option>
                </select>

                {inboundBank === 'Other' && (
                  <input
                    id="inbound_custom_bank_input"
                    type="text"
                    placeholder="Type unlisted bank name"
                    value={customInboundBank}
                    onChange={(e) => setCustomInboundBank(e.target.value)}
                    className={`w-full p-2.5 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00C37A] mt-1.5 ${
                      monipayTheme === 'dark' ? 'bg-zinc-900 border border-zinc-700 text-white' : 'bg-zinc-50 border border-zinc-205 text-zinc-900'
                    }`}
                  />
                )}
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-[9.5px] font-bold uppercase opacity-60">Funding Amount (₦)</label>
                <input 
                  id="inbound_amount_input"
                  type="number" 
                  placeholder="e.g. 25000"
                  value={inboundAmount}
                  onChange={(e) => setInboundAmount(e.target.value)}
                  className={`w-full p-2.5 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00C37A] font-sans font-bold text-[#00C37A] ${
                    monipayTheme === 'dark' ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-zinc-50 border border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              {/* Proceed Trigger button */}
              <button 
                id="inbound_proceed_trigger_btn"
                onClick={handleProceedAddMoney}
                className="w-full py-3 bg-[#00C37A] text-black font-extrabold text-xs rounded-xl hover:bg-emerald-450 shadow-sm active:scale-98 transition duration-150"
              >
                Proceed & Exit
              </button>
            </div>
          </div>
        )}

        {/* VIEW 6: FULL TRANSACTION LEDGER HISTORY */}
        {currentScreen === 'history' && (
          <div className="space-y-4 animate-fadeIn" id="monipay_screen_history">
            {/* Header / Back */}
            <div className="flex items-center justify-between pb-1">
              <button 
                id="history_back_to_dashboard_btn"
                onClick={() => setCurrentScreen('dashboard')}
                className="text-xs font-bold text-[#00C37A] flex items-center gap-1 cursor-pointer animate-fadeIn"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <span className="text-[10px] font-black tracking-widest uppercase">Transaction History</span>
              <div className="w-6"></div>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              <div className="space-y-1.5">
                {transactions.map(tx => (
                  <div 
                    id={`history_item_${tx.id}`}
                    key={tx.id}
                    onClick={() => handleTxClick(tx)}
                    className={`p-3 rounded-2xl ${styleCard} flex justify-between items-center gap-3 cursor-pointer hover:border-[#00C37A]/30 hover:scale-[1.01] active:scale-[0.99] transition`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        tx.type === 'inbound' ? 'bg-emerald-500/10 text-[#00C37A]' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {tx.type === 'inbound' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-black truncate">{tx.title}</h4>
                        <p className={`text-[9px] font-medium truncate ${styleSub}`}>{tx.subtitle}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[11px] font-black block leading-none ${
                        tx.type === 'inbound' ? 'text-[#00C37A]' : 'text-rose-500/90'
                      }`}>
                        {tx.type === 'inbound' ? '+' : '-'}{formatNaira(tx.amount)}
                      </span>
                      <span className="text-[8px] opacity-50 block mt-1 font-mono font-medium">{tx.timeStr}</span>
                    </div>
                  </div>
                ))}

                {transactions.length === 0 && (
                  <div className="text-center py-12 text-xs text-zinc-500 font-medium">
                    No transactions recorded in your ledger.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: TRANSACTION RECEIPTS VIEW (FULL SCREEN) */}
        {currentScreen === 'receipt' && activeReceipt && (() => {
          const recType = activeReceipt.type || 'Send';
          const recAmount = activeReceipt.amount;
          const recTime = activeReceipt.timeStr;
          const recRef = activeReceipt.refId || (activeReceipt as any).transactionNo || 'MP-590218';
          const recFee = activeReceipt.fee !== undefined ? activeReceipt.fee : (recAmount >= 10000 && recType === 'Send' ? recAmount * 0.02 : 0);
          const recSender = activeReceipt.senderName || profileName;
          const recReceiver = activeReceipt.receiverName || (activeReceipt as any).recipientName || 'MoniPay User';
          const recBank = activeReceipt.bankName || 'MoniBank';
          const recAcct = activeReceipt.accountNo || (activeReceipt as any).recipientAcct || '';
          const recStatus = activeReceipt.processingStatus || 'Successful';

          const isBankTransfer = recType === 'Send';

          return (
            <div className="space-y-4 animate-fadeIn" id="monipay_screen_receipt">
              {/* Top Nav Control with Back & Close */}
              <div className="flex items-center justify-between">
                <button 
                  id="receipt_back_nav_btn"
                  onClick={() => setCurrentScreen('dashboard')}
                  className="text-xs font-bold text-[#00C37A] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <span className="text-[10px] font-black tracking-widest uppercase">E-Receipt</span>
                <button 
                  id="receipt_close_btn"
                  onClick={() => {
                    setActiveReceipt(null);
                    setCurrentScreen('dashboard');
                  }}
                  className={`p-1.5 rounded-full ${monipayTheme === 'dark' ? 'bg-zinc-850 text-white hover:bg-zinc-800' : 'bg-zinc-100 text-zinc-600'}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CARD CONTAINER */}
              <div className={`p-5 rounded-[28px] ${styleCard} relative overflow-hidden flex flex-col space-y-4 shadow-sm`}>
                
                {/* Branding & Status Header */}
                <div className="flex flex-col items-center text-center pb-2 border-b border-zinc-500/10">
                  <div className="w-10 h-10 rounded-full bg-[#00C37A] text-black font-black flex items-center justify-center text-sm shadow-xs mb-2">
                    ₦
                  </div>
                  <h3 className="text-xs font-black tracking-widest leading-none uppercase">Monipay</h3>
                  <p className="text-[8px] font-bold text-zinc-500 uppercase mt-0.5">Transaction Receipt</p>
                  
                  {/* Status Badge */}
                  <div className="mt-2.5 inline-flex items-center gap-1 bg-[#00C37A]/10 border border-[#00C37A]/25 text-[#00C37A] text-[8px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                    <Check className="w-3 h-3 stroke-[3]" /> {recStatus}
                  </div>
                </div>

                {/* Giant stylized Amount block */}
                <div className="text-center py-1">
                  <span className="text-[8px] font-bold uppercase opacity-50 tracking-wider">Amount Paid</span>
                  <h2 className="text-3xl font-black text-[#00C37A] tracking-tight leading-none mt-1">
                    {formatNaira(recAmount)}
                  </h2>
                </div>

                {/* SECTION 1: TRANSACTION DETAILS */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-1 px-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#00C37A]">💳 Transaction Details</span>
                  </div>
                  <div className="space-y-1.5 bg-zinc-500/5 p-3 rounded-2xl text-[9.5px]">
                    <div className="flex justify-between items-center py-0.5">
                      <span className="opacity-60 font-medium">Transaction Type</span>
                      <span className="font-extrabold text-zinc-400 uppercase">{recType}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="opacity-60 font-medium">Date & Time</span>
                      <span className="font-bold">{recTime}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="opacity-60 font-medium">Reference ID</span>
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="font-mono font-bold text-zinc-400 select-all truncate max-w-[120px]">{recRef}</span>
                        <button 
                          id="receipt_copy_ref_btn"
                          onClick={() => handleCopyClipboard(recRef, 'Reference ID')}
                          className="p-1 hover:bg-[#00C37A]/10 text-[#00C37A] rounded transition duration-150 cursor-pointer"
                          title="Copy reference number"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="opacity-60 font-medium">Transaction Fee</span>
                      <span className="font-bold text-[#00C37A]">{recFee > 0 ? formatNaira(recFee) : 'Free'}</span>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: PARTY DETAILS */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1 px-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#00C37A]">👤 Party Details</span>
                  </div>
                  <div className="space-y-1.5 bg-zinc-500/5 p-3 rounded-2xl text-[9.5px]">
                    <div className="flex justify-between items-center py-0.5">
                      <span className="opacity-60 font-medium">Sender Name</span>
                      <span className="font-extrabold truncate max-w-[60%]">{recSender}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="opacity-60 font-medium">Receiver Name</span>
                      <span className="font-extrabold truncate max-w-[60%]">{recReceiver}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="opacity-60 font-medium">Bank Name</span>
                      <span className="font-semibold">{recBank}</span>
                    </div>
                    {recAcct && (
                      <div className="flex justify-between items-center py-0.5">
                        <span className="opacity-60 font-medium">Account Number</span>
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="font-mono font-bold text-zinc-400 select-all">{maskAccountNumber(recAcct)}</span>
                          <button 
                            id="receipt_copy_acct_btn"
                            onClick={() => handleCopyClipboard(recAcct, 'Account Number')}
                            className="p-1 hover:bg-[#00C37A]/10 text-[#00C37A] rounded transition duration-150 cursor-pointer"
                            title="Copy masked account number"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION 3: EXTRA INFO (IF BANK TRANSFER) */}
                {isBankTransfer && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 px-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#00C37A]">🏦 Extra Transfer Info</span>
                    </div>
                    <div className="space-y-1.5 bg-zinc-500/5 p-3 rounded-2xl text-[9.5px]">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="opacity-60 font-medium">Destination Bank</span>
                        <span className="font-semibold">{recBank}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="opacity-60 font-medium">Beneficiary Name</span>
                        <span className="font-bold truncate max-w-[60%]">{recReceiver}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="opacity-60 font-medium">Processing Status</span>
                        <span className="font-extrabold text-[#00C37A] text-[8.5px] uppercase tracking-wider">{recStatus}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ACTION TRIGGER BUTTONS */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button 
                    id="receipt_download_img_btn"
                    onClick={() => downloadReceiptAsImage({
                      type: recType,
                      amount: recAmount,
                      timeStr: recTime,
                      refId: recRef,
                      fee: recFee,
                      senderName: recSender,
                      receiverName: recReceiver,
                      bankName: recBank,
                      accountNo: recAcct,
                      processingStatus: recStatus
                    })}
                    className="py-2 px-3 bg-zinc-500/10 hover:bg-zinc-500/15 text-[10px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer text-zinc-300 border border-zinc-700/40"
                    title="Download receipt directly as pixel-perfect PNG card"
                  >
                    <Download className="w-3.5 h-3.5 text-[#00C37A]" /> Save Image
                  </button>

                  <button 
                    id="receipt_print_pdf_btn"
                    onClick={() => printReceiptPDF({
                      type: recType,
                      amount: recAmount,
                      timeStr: recTime,
                      refId: recRef,
                      fee: recFee,
                      senderName: recSender,
                      receiverName: recReceiver,
                      bankName: recBank,
                      accountNo: recAcct,
                      processingStatus: recStatus
                    })}
                    className="py-2 px-3 bg-zinc-500/10 hover:bg-zinc-500/15 text-[10px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer text-zinc-300 border border-zinc-700/40"
                    title="Save receipt as PDF or send to print device"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#00C37A]" /> Save PDF
                  </button>
                </div>

                <button 
                  id="receipt_share_button"
                  onClick={() => handleShareReceipt({
                    type: recType,
                    amount: recAmount,
                    timeStr: recTime,
                    refId: recRef,
                    fee: recFee,
                    senderName: recSender,
                    receiverName: recReceiver,
                    bankName: recBank,
                    accountNo: recAcct,
                    processingStatus: recStatus
                  })}
                  className="w-full py-2.5 bg-[#00C37A] text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-emerald-450 active:scale-95 transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share Receipt Card
                </button>
              </div>
            </div>
          );
        })()}

        {/* VIEW 5: ADVANCED CARDS MANAGEMENT */}
        {currentScreen === 'cards' && (
          <div className="space-y-4 animate-fadeIn" id="monipay_screen_cards">
            {/* Header / Back */}
            <div className="flex items-center justify-between pb-1">
              <button 
                id="cards_back_to_dashboard_btn"
                onClick={() => setCurrentScreen('dashboard')}
                className="text-xs font-bold text-[#00C37A] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <span className="text-[10px] font-black tracking-widest uppercase font-mono">My Virtual Visa</span>
              <div className="w-6"></div>
            </div>

            {/* VISA CARD GRAPHIC CONTAINER */}
            <div className="relative w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 p-4 shadow-lg flex flex-col justify-between text-white overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[7.5px] uppercase tracking-widest text-[#00C37A] font-bold">MoniPay Premium Card</span>
                  <h3 className="text-xs font-black tracking-widest">VISA GOLD</h3>
                </div>
                {/* Chip graphic */}
                <div className="w-6.5 h-5 rounded bg-amber-400/80 flex items-center gap-0.5 p-1">
                  <span className="w-0.5 h-full bg-zinc-950/20"></span>
                  <span className="w-0.5 h-full bg-zinc-950/20"></span>
                </div>
              </div>


              <div className="space-y-3">
                <p className="text-sm font-bold tracking-widest font-mono select-all">
                  {cardNo}
                </p>
                
                <div className="flex justify-between items-end text-[8.5px] font-medium uppercase text-zinc-400">
                  <div>
                    <span className="block text-[6px] text-zinc-500 leading-none">Card Holder</span>
                    <span className="font-bold text-white tracking-wide mt-1 block h-3.5 uppercase">{profileName}</span>
                  </div>

                  <div>
                    <span className="block text-[6px] text-zinc-500 leading-none">Expires</span>
                    <span className="font-mono text-white mt-1 block">{cardExpiry}</span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[6px] text-zinc-500 leading-none">CVV</span>
                    <span className="font-mono text-white mt-1 block">{cardCvv}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Replace Actions */}
            <div className={`p-4 rounded-[24px] ${styleCard} space-y-3.5`}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold">Reissue Custom Card Fee</span>
                <span className="font-mono text-rose-500 font-bold">₦5,000.00</span>
              </div>
              
              <p className="text-[9px] text-zinc-400 leading-normal">
                Deduct ₦5,000 immediately from available funds. Visa replacement executes instantly, modifying numeric sequences and 3-digit security blocks visuals.
              </p>

              <button 
                id="cards_replace_visa_btn"
                onClick={handleRequestNewCard}
                className="w-full py-2.5 bg-[#00C37A] text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 shadow-sm active:scale-95 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reissue Visa Card
              </button>
            </div>
          </div>
        )}

        {/* VIEW 6: MONIPAY SETTINGS */}
        {currentScreen === 'settings' && (
          <div className="space-y-4 animate-fadeIn" id="monipay_screen_settings">
            {/* Header / Back */}
            <div className="flex items-center justify-between pb-1">
              <button 
                id="settings_back_to_dashboard_btn"
                onClick={() => setCurrentScreen('dashboard')}
                className="text-xs font-bold text-[#00C37A] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <span className="text-[10px] font-black tracking-widest uppercase">MoniPay Configuration</span>
              <div className="w-6"></div>
            </div>

            {/* SETTINGS CONTENT WRAPPERS */}
            <div className={`p-4 rounded-[24px] ${styleCard} space-y-3`}>
              <div className="flex justify-between items-center text-xs border-b pb-2.5 border-zinc-500/10">
                <span className="font-semibold">Account Number</span>
                <span className="font-mono select-all font-bold text-[#00C37A]">{userAccountNumber}</span>
              </div>

              {/* Theme switch in MoniPay Settings */}
              <div className="flex justify-between items-center text-xs py-1 border-b pb-2.5 border-zinc-500/10">
                <span className="font-semibold">Light/Dark Mode</span>
                <div className="flex gap-1.5" id="settings_theme_selectors">
                  <button 
                    id="monipay_set_theme_dark"
                    onClick={() => setMonipayTheme('dark')}
                    className={`py-1 px-2 text-[9px] font-bold rounded-lg transition-all ${
                      monipayTheme === 'dark' ? 'bg-[#00C37A] text-black' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    Dark
                  </button>
                  <button 
                    id="monipay_set_theme_light"
                    onClick={() => setMonipayTheme('light')}
                    className={`py-1 px-2 text-[9px] font-bold rounded-lg transition-all ${
                      monipayTheme === 'light' ? 'bg-[#00C37A] text-black shadow-xs' : 'bg-[#1E1E1E] text-zinc-400'
                    }`}
                  >
                    Light
                  </button>
                </div>
              </div>

              {/* Advanced Account upgrade */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold">Migrate Account Number</span>
                  <span className="font-mono text-rose-500 font-bold">₦1,000.00</span>
                </div>
                
                <p className="text-[8.5px] text-zinc-400 leading-normal">
                  Migrate and modify current 10-digit database sequences instantly. Costs 1,000 Naira, executing a strict **10-second validation timer** before update.
                </p>

                <button 
                  id="settings_request_new_account_btn"
                  onClick={handleRequestNewAccount}
                  disabled={isGeneratingAccount}
                  className="w-full py-2 bg-[#00C37A]/15 text-[#00C37A] border border-[#00C37A]/30 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50 transition"
                >
                  {isGeneratingAccount ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Provisioning ({accountCountdown}s)
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" /> Request New Account Number
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Profile Info block */}
            <div className={`p-4 rounded-[24px] ${styleCard} text-center space-y-1`}>
              <User className="w-6 h-6 text-[#00C37A] mx-auto" />
              <h4 className="text-[10px] font-bold uppercase tracking-wider">Verified Identity Profile</h4>
              <p className="text-[10px] font-extrabold text-blue-500 capitalize">{profileName}</p>
              <p className="text-[8.5px] text-zinc-400">Grade Tier 3 Premium Account Holder • GTB Partner Channel</p>
            </div>
          </div>
        )}

        {/* 4-Second Transaction Processing Loading Modal Overlay */}
        {isProcessingTransaction && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center space-y-4 z-[9999] animate-fadeIn">
            <div className="relative flex items-center justify-center">
              {/* Outer spinning ring */}
              <div className="w-14 h-14 rounded-full border-4 border-[#00C37A]/20 border-t-[#00C37A] animate-spin"></div>
              {/* Inner spinning ring */}
              <div className="absolute w-10 h-10 rounded-full border-4 border-[#00C37A]/10 border-b-[#00C37A] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
            <div className="text-center space-y-1 px-5">
              <h3 className="text-sm font-black text-white tracking-wide uppercase">Processing Transaction...</h3>
              <p className="text-[10px] text-zinc-450 text-zinc-400 font-medium leading-normal max-w-[220px] mx-auto">
                Authorizing secure ledger transfer. Please do not close MoniPay or turn off your device.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Shopit Naira Checkout Request Modal */}
        {pendingPayment && pendingPayment.bankType === 'monipay' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-end justify-center z-[9990] animate-fadeIn">
            <div className="w-full bg-zinc-950 border-t border-zinc-805 rounded-t-[32px] p-5 space-y-4 text-left animate-slideUp max-h-[85%] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-[#00C37A]/10 text-[#00C37A] border border-[#00C37A]/20 py-0.5 px-2.5 rounded-full text-[9px] font-bold font-mono">
                  <span>₦ NGN Checkout</span>
                </div>
                <button
                  onClick={() => {
                    if (setPendingPayment) setPendingPayment(null);
                  }}
                  className="text-zinc-400 hover:text-white font-extrabold text-sm"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-black text-white">Authorize Shopit Local NFC Payment</h3>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  You are checking out from <strong>Shopit Local Centre</strong>. Complete payment instantly with your saved MoniPay Naira wallet.
                </p>
              </div>

              {/* Items Summary Table */}
              <div className="bg-zinc-900/60 p-3 rounded-2xl border border-zinc-850 space-y-2">
                <span className="text-[8px] font-bold uppercase text-zinc-550 font-mono">Items In Order</span>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto divide-y divide-zinc-850">
                  {pendingPayment.items?.map((it: any) => (
                    <div key={it.id} className="flex justify-between text-[10px] py-1 text-left">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-bold text-zinc-200 truncate">{it.name}</p>
                        <p className="text-[8.5px] text-zinc-400">{it.category} &times; {it.quantity}</p>
                      </div>
                      <span className="text-zinc-350 font-mono font-bold">₦{(it.price * 1500 * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-800 pt-2 flex justify-between items-center text-[11px] font-bold font-mono">
                  <span className="text-zinc-450">Total Purchase</span>
                  <span className="text-[#00C37A]">₦{(pendingPayment.amount * 1500).toLocaleString()}</span>
                </div>
              </div>

              {/* Security confirmation with user balance check/auto-replenish */}
              <div className="bg-[#00C37A]/5 border border-[#00C37A]/15 rounded-xl p-3 flex justify-between items-center">
                <div className="text-left">
                  <span className="text-[8px] uppercase font-bold text-zinc-400 block leading-none">Your MoniPay Balance</span>
                  <strong className="text-white text-xs font-mono">₦{availableBalance.toLocaleString()}</strong>
                </div>
                {availableBalance < (pendingPayment.amount * 1500) && (
                  <span className="text-[8.5px] text-amber-500 font-bold bg-amber-500/10 px-2 py-1 rounded">
                    Wallet auto-replenished (+₦{((pendingPayment.amount * 1500) - availableBalance).toLocaleString()})
                  </span>
                )}
              </div>

              {/* Confirm submit button */}
              <button
                onClick={() => {
                  const paymentCost = pendingPayment.amount * 1500;
                  setIsProcessingTransaction(true);

                  // Auto top up balance if they are short to prevent transaction failures
                  if (availableBalance < paymentCost) {
                    setAvailableBalance(paymentCost + 50000); 
                  }

                  setTimeout(() => {
                    const finalBal = Math.max(0, availableBalance - paymentCost);
                    setAvailableBalance(finalBal);

                    // Add to transactions list of MoniPay
                    const newTx = {
                      id: 'moni_tx_shopit_' + Date.now(),
                      type: 'outbound',
                      title: `Shopit Local Centre Pay`,
                      subtitle: `Card Merchant Checkout`,
                      amount: paymentCost,
                      timeStr: 'Just now'
                    };
                    setTransactions(prev => [newTx, ...prev]);

                    // Add items directly to storage_inventory
                    const existingInventoryStr = localStorage.getItem('storage_inventory') || '[]';
                    let existingInventory: any[] = [];
                    try {
                      existingInventory = JSON.parse(existingInventoryStr);
                    } catch (e) {}

                    const boughtItems = pendingPayment.items.map((it: any) => {
                      const itemPriceUSD = it.usdPrice !== undefined ? it.usdPrice : (it.price || 0);
                      const unitPrice = itemPriceUSD * 1500;
                      return {
                        ...it,
                        id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                        purchaseDate: systemTime.toLocaleDateString() + ' ' + systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        paidPriceText: `₦${unitPrice.toLocaleString()}`,
                        purchasePrice: unitPrice,
                        purchaseCurrency: 'NGN',
                        quantity: it.quantity || 1
                      };
                    });

                    const updatedInventory = [...existingInventory, ...boughtItems];
                    localStorage.setItem('storage_inventory', JSON.stringify(updatedInventory));

                    // Clear cart
                    localStorage.setItem('shopit_cart', JSON.stringify([]));

                    onTriggerNotification("Shopit Local Centre", `Pay Approved! ₦${paymentCost.toLocaleString()} deducted. Items added to Storage Inventory!`);
                    addLog(`Shopit: Checkout complete inside MoniPay app for ₦${paymentCost.toLocaleString()}`);

                    // Reset payment
                    if (setPendingPayment) {
                      setPendingPayment(null);
                    }
                    localStorage.removeItem('ios_pending_payment');

                    // Dispatch events so components reload
                    window.dispatchEvent(new Event('shopit_cart_updated'));
                    window.dispatchEvent(new Event('storage_inventory_updated'));

                    setIsProcessingTransaction(false);
                    // Open transactions dashboard or alert success
                    alert(`✓ Payment Authorized Successfully!\n₦${paymentCost.toLocaleString()} paid to Shopit Local Centre.`);
                  }, 2000);
                }}
                className="w-full py-3.5 bg-[#00C37A] hover:bg-[#00B06F] text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg transition active:scale-97 cursor-pointer"
              >
                Confirm Naira Authorization
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
