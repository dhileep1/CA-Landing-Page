/* ==========================================================================
   DOCUMENT CHECKLISTS & COMPLIANCE CALENDAR DATA & LOGIC
   ========================================================================== */

const CHECKLIST_DATA = {
  salaried: [
    "Form 16 / Form 16A from employer",
    "PAN Card & Aadhaar Card link status",
    "Annual Information Statement (AIS) & Form 26AS",
    "Bank statements (Savings accounts, FD interest certificates)",
    "Home Loan Interest Certificate (Section 24b)",
    "Section 80C Receipts (ELSS, LIC, PPF, Tuition Fee)",
    "Section 80D Health Insurance Receipts",
    "Capital Gains Statements from brokers (Equity / Mutual Funds)"
  ],
  business: [
    "Audited Balance Sheet & Profit & Loss Statement",
    "GST Returns Summary (GSTR-1, GSTR-3B & GSTR-9)",
    "Bank Account Statements for the entire Financial Year",
    "TDS Returns & TCS Challans",
    "Fixed Asset Register & Depreciation Schedule",
    "Closing Stock Valuation Certificate",
    "Director / Partner PAN, Aadhaar & DIN details",
    "Invoices & Vouchers for Expenses exceeding Rs 10,000"
  ],
  nri: [
    "Passport copy (all stamped pages showing stay duration in India)",
    "NRE & NRO Bank Account Statements",
    "Form 26AS & AIS from Income Tax portal",
    "Tax Residency Certificate (TRC) from foreign jurisdiction",
    "Form 10F for DTAA Tax Relief benefit",
    "Indian rental income receipts & property tax paid",
    "Capital gains statements for Indian investments",
    "Details of foreign assets & bank accounts (Schedule FA)"
  ],
  remittance: [
    "Form 15CA (Part A / B / C / D) Draft",
    "Form 15CB Charter Accountant Certificate Request",
    "Agreement / Invoice supporting foreign payment",
    "Bank Debit advice / Remittance request form",
    "Beneficiary Tax ID & Country details",
    "DTAA Rate justification document",
    "TRC (Tax Residency Certificate) of Non-Resident"
  ],
  incorporation: [
    "Proposed Company Name (2 choices)",
    "PAN & Aadhaar of all Directors / Shareholders",
    "Passport / Voter ID / Driving License (Identity Proof)",
    "Bank Statement / Utility Bill (Address Proof < 2 months old)",
    "Digital Signature Certificate (DSC) application",
    "Registered Office NOC from landlord & Electricity Bill",
    "Director Identification Number (DIN) details"
  ],
  visa: [
    "Valuation report of Immovable Properties (Land, Flat, Commercial)",
    "Bank Account balance certificates",
    "Fixed Deposit (FD) & Post Office Saving certificates",
    "Demat Account holding statement (Shares & Mutual Funds)",
    "Gold & Jewelry Valuation Certificate",
    "Vehicle RC books & valuation",
    "PF / PPF Account balance statement",
    "Outstanding loan balances summary"
  ]
};

const COMPLIANCE_DEADLINES = [
  {
    day: "11",
    month: "AUG",
    title: "GSTR-1 Filing",
    desc: "Monthly GST outward supply return for registered taxpayers with turnover > ₹5 Cr.",
    category: "gst"
  },
  {
    day: "15",
    month: "AUG",
    title: "PF & ESI Payment",
    desc: "Monthly Provident Fund & ESI contribution payment for July salaries.",
    category: "tds"
  },
  {
    day: "20",
    month: "AUG",
    title: "GSTR-3B Filing",
    desc: "Monthly GST summary return and tax payment for July.",
    category: "gst"
  },
  {
    day: "07",
    month: "SEP",
    title: "TDS / TCS Deposit",
    desc: "Monthly deposit of Tax Deducted at Source for August transactions.",
    category: "tds"
  },
  {
    day: "15",
    month: "SEP",
    title: "2nd Advance Tax Installment",
    desc: "Payment of 45% of estimated advance tax liability for FY 2024-25.",
    category: "income-tax"
  },
  {
    day: "30",
    month: "SEP",
    title: "Tax Audit Report (Form 3CA/3CB-3CD)",
    desc: "Filing of Tax Audit Report for corporate & business entities subject to audit.",
    category: "income-tax"
  },
  {
    day: "15",
    month: "OCT",
    title: "TDS Return Filing (Q2)",
    desc: "Quarterly TDS return filing for Q2 (July - Sept) in Form 24Q, 26Q & 27Q.",
    category: "tds"
  },
  {
    day: "31",
    month: "OCT",
    title: "ITR Filing (Audited Cases)",
    desc: "Income Tax Return filing deadline for companies & entities subject to Tax Audit.",
    category: "income-tax"
  },
  {
    day: "30",
    month: "NOV",
    title: "ROC AOC-4 Annual Financials",
    desc: "Filing of audited financial statements with ROC for Private Limited Companies.",
    category: "roc"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Document Checklist Chips Handler
  const checklistContainer = document.getElementById('doc-checklist-container');
  const chipBtns = document.querySelectorAll('.checklist-chip');

  function renderChecklist(categoryKey) {
    if (!checklistContainer) return;
    const items = CHECKLIST_DATA[categoryKey] || CHECKLIST_DATA.salaried;
    
    checklistContainer.innerHTML = items.map(item => `
      <li class="doc-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${item}</span>
      </li>
    `).join('');
  }

  chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chipBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-checklist');
      renderChecklist(cat);
    });
  });

  // Initial render
  renderChecklist('salaried');

  // Compliance Calendar Filter Handler
  const calendarGrid = document.getElementById('calendar-grid');
  const calFilterBtns = document.querySelectorAll('.cal-filter-btn');

  function renderCalendar(filterCategory = 'all') {
    if (!calendarGrid) return;
    
    const filtered = filterCategory === 'all' 
      ? COMPLIANCE_DEADLINES 
      : COMPLIANCE_DEADLINES.filter(d => d.category === filterCategory);

    calendarGrid.innerHTML = filtered.map(item => `
      <div class="cal-card">
        <div class="cal-date-badge">
          <div class="day">${item.day}</div>
          <div class="month">${item.month}</div>
        </div>
        <div class="cal-details">
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
          <span class="cal-tag">${item.category.replace('-', ' ').toUpperCase()}</span>
        </div>
      </div>
    `).join('');
  }

  calFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      calFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cal-filter');
      renderCalendar(cat);
    });
  });

  // Initial render calendar
  renderCalendar('all');
});
