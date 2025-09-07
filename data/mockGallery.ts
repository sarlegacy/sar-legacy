import { GalleryItem, ProjectPlan, GeneratedFile } from '../types.ts';

const financialDashboardPlan: ProjectPlan = {
  projectName: "Sar Financial Management Dashboard",
  technologyStack: ["HTML", "CSS", "JavaScript", "Chart.js"],
  featureBreakdown: [
    "Responsive layout with a sidebar and main content area.",
    "Dark/Light theme UI with purple and blue accents, with persistence.",
    "Main Dashboard: Four key metric cards (Revenue, Profit, Expenses), a line chart for Revenue vs. Expenses, and a recent transactions table.",
    "Personal Finance View: A refined two-column layout. KPIs for Net Worth, Savings, Credit Score. A budget tracker, expense pie chart, cash flow analysis, and personal transactions table.",
    "Business Finance View: KPIs for Accounts Receivable/Payable, Cash Flow. An invoice management table with status indicators. A quarterly Profit & Loss bar chart.",
    "Settings View: Theme switcher and notification toggles.",
    "Sidebar with clickable navigation links and icons to switch between all views.",
    "Mock data for all metrics, charts, and tables to simulate a real application."
  ],
  fileList: ["index.html", "style.css", "script.js"]
};

const financialDashboardFiles: GeneratedFile[] = [
  {
    filePath: "index.html",
    fileContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sar Financial Management Dashboard</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>
    <script src="https://unpkg.com/feather-icons"><\/script>
</head>
<body>
    <div class="dashboard-container">
        <nav class="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="24" fill="url(#logo-gradient)"></circle>
                        <path d="M24 33C28.9706 33 33 28.9706 33 24C33 19.0294 28.9706 15 24 15C19.0294 15 15 19.0294 15 24C15 28.9706 19.0294 33 24 33Z" stroke="white" stroke-opacity="0.5" stroke-width="2"></path>
                        <path d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z" stroke="white" stroke-width="2"></path>
                        <defs><linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#A855F7"></stop><stop offset="1" stop-color="#3B82F6"></stop></linearGradient></defs>
                    </svg>
                    <span>SAR Financial</span>
                </div>
            </div>
            <ul class="nav-links">
                <li><a href="#" id="nav-dashboard" class="nav-link active"><i data-feather="home"></i><span>Dashboard</span></a></li>
                <li><a href="#" id="nav-personal" class="nav-link"><i data-feather="user"></i><span>Personal Finance</span></a></li>
                <li><a href="#" id="nav-business" class="nav-link"><i data-feather="briefcase"></i><span>Business Finance</span></a></li>
                <li><a href="#" class="nav-link"><i data-feather="bar-chart-2"></i><span>Reports</span></a></li>
            </ul>
            <div class="sidebar-footer">
                 <a href="#" id="nav-settings" class="nav-link"><i data-feather="settings"></i><span>Settings</span></a>
            </div>
        </nav>

        <main class="main-content">
            <!-- Dashboard View -->
            <div id="dashboard-view">
                <header class="main-header">
                    <h1>Dashboard</h1>
                    <div class="user-profile"><i data-feather="search" class="header-icon"></i><i data-feather="bell" class="header-icon"></i><img src="https://i.pravatar.cc/40?u=admin" alt="User Avatar"></div>
                </header>
                <section class="kpi-cards">
                    <div class="card"><div class="card-icon revenue"><i data-feather="dollar-sign"></i></div><div class="card-info"><p>Total Revenue</p><h2 id="total-revenue" aria-live="polite">$0</h2><span class="positive">+12.5%</span></div></div>
                    <div class="card"><div class="card-icon profit"><i data-feather="trending-up"></i></div><div class="card-info"><p>Profit</p><h2 id="total-profit" aria-live="polite">$0</h2><span class="positive">+8.2%</span></div></div>
                    <div class="card"><div class="card-icon expenses"><i data-feather="trending-down"></i></div><div class="card-info"><p>Expenses</p><h2 id="total-expenses" aria-live="polite">$0</h2><span class="negative">-3.1%</span></div></div>
                    <div class="card"><div class="card-icon customers"><i data-feather="users"></i></div><div class="card-info"><p>New Customers</p><h2 id="new-customers" aria-live="polite">0</h2><span class="positive">+25</span></div></div>
                </section>
                <section class="main-data"><div class="chart-container"><h3>Revenue vs Expenses</h3><canvas id="revenueChart"></canvas></div><div class="transactions-container"><h3>Recent Transactions</h3><div class="table-wrapper"><table><thead><tr><th scope="col">ID</th><th scope="col">Date</th><th scope="col">Customer</th><th scope="col">Amount</th><th scope="col">Status</th></tr></thead><tbody id="transactions-table-body"></tbody></table></div></div></section>
            </div>
            
            <!-- Personal Finance View -->
            <div id="personal-finance-view" class="hidden">
                <header class="main-header"><h1>Personal Finance</h1></header>
                <section class="kpi-cards">
                    <div class="card"><div class="card-icon net-worth"><i data-feather="bar-chart"></i></div><div class="card-info"><p>Net Worth</p><h2 id="personal-net-worth" aria-live="polite">$0</h2></div></div>
                    <div class="card"><div class="card-icon savings"><i data-feather="percent"></i></div><div class="card-info"><p>Monthly Savings</p><h2 id="personal-savings" aria-live="polite">0%</h2></div></div>
                    <div class="card"><div class="card-icon credit-score"><i data-feather="activity"></i></div><div class="card-info"><p>Credit Score</p><h2 id="personal-credit-score" aria-live="polite">0</h2></div></div>
                    <div class="card"><div class="card-icon health"><i data-feather="heart"></i></div><div class="card-info"><p>Financial Health</p><h2 id="financial-health-score" aria-live="polite">Excellent</h2></div></div>
                </section>
                <section class="personal-finance-grid">
                    <div class="main-col">
                         <div class="chart-container">
                            <h3>Cash Flow (Last 6 Months)</h3>
                            <canvas id="cashFlowChart"></canvas>
                        </div>
                        <div class="transactions-container">
                            <div class="container-header">
                                <h3>Recent Transactions</h3>
                                <div class="filter-buttons">
                                    <button class="filter-btn active" data-filter="all">All</button>
                                    <button class="filter-btn" data-filter="income">Income</button>
                                    <button class="filter-btn" data-filter="expense">Expense</button>
                                </div>
                            </div>
                            <div class="table-wrapper">
                                <table>
                                    <thead><tr><th scope="col">Date</th><th scope="col">Description</th><th scope="col">Category</th><th scope="col">Amount</th></tr></thead>
                                    <tbody id="personal-transactions-table-body"></tbody>
                                </table>
                            </div>
                        </div>
                         <div class="transactions-container portfolio-container">
                            <div class="container-header"><h3>Investment Portfolio</h3></div>
                            <div class="portfolio-content">
                                <div class="chart-container portfolio-chart"><canvas id="portfolioDonutChart"></canvas></div>
                                <div class="table-wrapper"><table class="holdings-table"><thead><tr><th scope="col">Asset</th><th scope="col">Value</th><th scope="col">Day %</th></tr></thead><tbody id="holdings-table-body"></tbody></table></div>
                            </div>
                        </div>
                    </div>
                    <div class="side-col">
                        <div class="chart-container">
                            <h3>Expense Breakdown</h3>
                            <canvas id="expensePieChart"></canvas>
                        </div>
                        <div class="budget-tracker">
                            <h3>Budget Tracker</h3>
                            <div id="budget-items" class="budget-items"></div>
                        </div>
                        <div class="savings-goals-container">
                            <h3>Savings Goals</h3>
                            <div id="savings-goals-items" class="savings-goals-items"></div>
                        </div>
                        <div class="upcoming-bills-container">
                            <h3>Upcoming Bills</h3>
                            <div class="table-wrapper">
                                <table>
                                    <thead><tr><th scope="col">Bill</th><th scope="col">Due Date</th><th scope="col">Amount</th></tr></thead>
                                    <tbody id="upcoming-bills-body"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            
            <!-- Business Finance View -->
            <div id="business-finance-view" class="hidden">
                 <header class="main-header"><h1>Business Finance</h1></header>
                 <section class="kpi-cards">
                    <div class="card"><div class="card-icon receivable"><i data-feather="arrow-down-circle"></i></div><div class="card-info"><p>Accounts Receivable</p><h2 id="business-receivable" aria-live="polite">$0</h2></div></div>
                    <div class="card"><div class="card-icon payable"><i data-feather="arrow-up-circle"></i></div><div class="card-info"><p>Accounts Payable</p><h2 id="business-payable" aria-live="polite">$0</h2></div></div>
                    <div class="card"><div class="card-icon cash-flow"><i data-feather="wind"></i></div><div class="card-info"><p>Cash Flow</p><h2 id="business-cash-flow" aria-live="polite">$0</h2></div></div>
                 </section>
                 <section class="main-data business">
                     <div class="transactions-container">
                        <div class="container-header"><h3>Invoice Management</h3><div class="quick-actions"><button><i data-feather="plus-circle"></i>New Invoice</button><button><i data-feather="minus-circle"></i>Add Expense</button></div></div>
                        <div class="table-wrapper">
                            <table class="invoice-table">
                                <thead><tr><th scope="col">Invoice #</th><th scope="col">Client</th><th scope="col">Priority</th><th scope="col">Date</th><th scope="col">Amount</th><th scope="col">Status</th></tr></thead>
                                <tbody id="invoices-table-body"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="chart-container"><h3>Quarterly P&L</h3><canvas id="pnlBarChart"></canvas></div>
                 </section>
            </div>

            <!-- Settings View -->
            <div id="settings-view" class="hidden">
                <header class="main-header"><h1>Settings</h1></header>
                <div class="settings-page">
                    <div class="settings-section"><h3 class="section-title">Theme</h3><div class="theme-switcher"><button class="theme-btn" data-theme="dark"><i data-feather="moon"></i> Dark</button><button class="theme-btn" data-theme="light"><i data-feather="sun"></i> Light</button></div></div>
                    <div class="settings-section"><h3 class="section-title">Notifications</h3><div class="notification-toggles"><div class="toggle-item"><p>Email Notifications</p><label class="switch"><input type="checkbox" id="email-notifications" checked><span class="slider round"></span></label></div><div class="toggle-item"><p>Push Notifications</p><label class="switch"><input type="checkbox" id="push-notifications"><span class="slider round"></span></label></div></div></div>
                    <div class="settings-section"><h3 class="section-title">Profile</h3><div class="profile-info"><p><strong>Name:</strong> Admin User</p><p><strong>Email:</strong> admin@sarlegacy.com</p><p><strong>Plan:</strong> Premium</p></div></div>
                    <div class="settings-footer"><button id="save-settings-btn" class="save-btn">Save Changes</button></div>
                </div>
            </div>
        </main>
    </div>

    <script src="script.js"><\/script>
</body>
</html>`
  },
  {
    filePath: "style.css",
    fileContent: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
    --bg-primary: #0D0B1F; --bg-secondary: #181629; --bg-tertiary: #242235;
    --text-primary: #E5E7EB; --text-muted: #9CA3AF; --border-primary: rgba(255, 255, 255, 0.1);
    --accent-purple: #A855F7; --accent-blue: #3B82F6;
    --positive: #10B981; --negative: #EF4444; --pending: #F59E0B;
}

body.light {
    --bg-primary: #F9FAFB; --bg-secondary: #FFFFFF; --bg-tertiary: #F3F4F6;
    --text-primary: #1F2937; --text-muted: #6B7280; --border-primary: #E5E7EB;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background-color: var(--bg-primary); color: var(--text-primary); overflow: hidden; transition: background-color 0.3s, color 0.3s; }
.dashboard-container { display: flex; height: 100vh; }
.sidebar { width: 260px; background-color: var(--bg-secondary); border-right: 1px solid var(--border-primary); display: flex; flex-direction: column; padding: 1.5rem; transition: all 0.3s ease; }
.sidebar-header { margin-bottom: 2rem; }
.logo { display: flex; align-items: center; gap: 0.75rem; }
.logo svg { width: 40px; height: 40px; }
.logo span { font-size: 1.25rem; font-weight: 700; }
.nav-links { list-style: none; flex-grow: 1; }
.nav-links a, .sidebar-footer a { display: flex; align-items: center; gap: 1rem; padding: 0.8rem 1rem; border-radius: 8px; text-decoration: none; color: var(--text-muted); font-weight: 500; transition: all 0.2s ease; }
.nav-links a:hover, .sidebar-footer a:hover { background-color: var(--bg-tertiary); color: var(--text-primary); }
.nav-links a.active { background: linear-gradient(90deg, var(--accent-purple), var(--accent-blue)); color: white; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.2); }
.sidebar-footer { border-top: 1px solid var(--border-primary); padding-top: 1.5rem; }
.main-content { flex-grow: 1; padding: 2rem; overflow-y: auto; display: flex; flex-direction: column; transition: background-color 0.3s; }
.main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.main-header h1 { font-size: 2rem; font-weight: 800; }
.user-profile { display: flex; align-items: center; gap: 1.5rem; }
.header-icon { color: var(--text-muted); cursor: pointer; transition: color 0.2s ease; }
.header-icon:hover { color: var(--text-primary); }
.user-profile img { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--border-primary); }
.kpi-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.card { background-color: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 12px; padding: 1.5rem; display: flex; gap: 1rem; transition: transform 0.2s ease, box-shadow 0.2s ease; opacity: 0; animation: card-fade-in 0.5s ease-out forwards; }
.kpi-cards .card:nth-child(1) { animation-delay: 0.1s; }
.kpi-cards .card:nth-child(2) { animation-delay: 0.2s; }
.kpi-cards .card:nth-child(3) { animation-delay: 0.3s; }
.kpi-cards .card:nth-child(4) { animation-delay: 0.4s; }
@keyframes card-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); }
.card-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.card-icon.revenue { background-color: rgba(59, 130, 246, 0.2); color: #60A5FA; }
.card-icon.profit { background-color: rgba(16, 185, 129, 0.2); color: #34D399; }
.card-icon.expenses { background-color: rgba(239, 68, 68, 0.2); color: #F87171; }
.card-icon.customers { background-color: rgba(245, 158, 11, 0.2); color: #FBBF24; }
.card-icon.net-worth, .card-icon.receivable { background-color: rgba(99, 102, 241, 0.2); color: #818CF8; }
.card-icon.savings, .card-icon.payable { background-color: rgba(236, 72, 153, 0.2); color: #F472B6; }
.card-icon.credit-score, .card-icon.cash-flow { background-color: rgba(6, 182, 212, 0.2); color: #22D3EE; }
.card-icon.portfolio { background-color: rgba(217, 70, 239, 0.2); color: #F0ABFC; }
.card-icon.health { background-color: rgba(236, 72, 153, 0.2); color: #F472B6; }
.card-info p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.25rem; }
.card-info h2 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
.card-info span { font-size: 0.8rem; font-weight: 500; }
.positive { color: var(--positive); } .negative { color: var(--negative); }
.main-data { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; flex-grow: 1; min-height: 0; }
.main-data.business { grid-template-columns: 3fr 2fr; }
.personal-finance-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
.personal-finance-grid .main-col, .personal-finance-grid .side-col { display: flex; flex-direction: column; gap: 1.5rem; }
.filter-buttons { display: flex; gap: 0.5rem; }
.filter-btn { background-color: var(--bg-tertiary); border: 1px solid var(--border-primary); color: var(--text-muted); padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease; }
.filter-btn:hover { background-color: var(--bg-primary); color: var(--text-primary); }
.filter-btn.active { background-color: var(--accent-purple); color: white; border-color: var(--accent-purple); }
.chart-container, .transactions-container, .budget-tracker, .savings-goals-container, .upcoming-bills-container { background-color: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; }
.container-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.chart-container h3, .transactions-container h3, .budget-tracker h3, .savings-goals-container h3, .upcoming-bills-container h3 { font-weight: 600; }
#revenueChart, #pnlBarChart, #expensePieChart, #cashFlowChart { max-height: 350px; }
.transactions-container { overflow: hidden; }
.table-wrapper { overflow-y: auto; flex-grow: 1; }
table { width: 100%; border-collapse: collapse; }
thead { position: sticky; top: 0; background-color: var(--bg-secondary); }
th, td { padding: 0.75rem; text-align: left; font-size: 0.9rem; }
th { color: var(--text-muted); font-weight: 500; border-bottom: 1px solid var(--border-primary); }
tbody tr { border-bottom: 1px solid var(--border-primary); transition: background-color 0.2s; }
tbody tr:last-child { border-bottom: none; }
tbody tr:nth-child(even) { background-color: rgba(0,0,0,0.15); }
body.light tbody tr:nth-child(even) { background-color: rgba(0,0,0,0.03); }
.status { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 500; }
.status.completed, .status.paid { background-color: rgba(16, 185, 129, 0.2); color: var(--positive); }
.status.pending, .status.due { background-color: rgba(245, 158, 11, 0.2); color: var(--pending); }
.status.failed, .status.overdue { background-color: rgba(239, 68, 68, 0.2); color: var(--negative); }
.priority { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 500; }
.priority.high { background-color: rgba(239, 68, 68, 0.2); color: var(--negative); }
.priority.medium { background-color: rgba(245, 158, 11, 0.2); color: var(--pending); }
.priority.low { background-color: rgba(59, 130, 246, 0.2); color: #60A5FA; }
.budget-items, .savings-goals-items { display: flex; flex-direction: column; gap: 1rem; }
.budget-item, .savings-goal-item { display: flex; flex-direction: column; gap: 0.5rem; }
.budget-item-header, .savings-goal-item-header { display: flex; justify-content: space-between; font-size: 0.9rem; }
.progress-bar-container { width: 100%; background-color: var(--bg-tertiary); border-radius: 8px; overflow: hidden; height: 12px; }
.progress-bar { height: 100%; background: linear-gradient(90deg, var(--accent-purple), var(--accent-blue)); border-radius: 8px; transition: width 0.5s ease-out; }
.quick-actions { display: flex; gap: 0.5rem; }
.quick-actions button { background: var(--bg-tertiary); border: 1px solid var(--border-primary); color: var(--text-primary); padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: background-color 0.2s; }
.quick-actions button:hover { background-color: var(--bg-primary); }
.main-content::-webkit-scrollbar, .table-wrapper::-webkit-scrollbar { width: 6px; }
.main-content::-webkit-scrollbar-track, .table-wrapper::-webkit-scrollbar-track { background: transparent; }
.main-content::-webkit-scrollbar-thumb, .table-wrapper::-webkit-scrollbar-thumb { background: #4B5563; border-radius: 6px; }
.main-content::-webkit-scrollbar-thumb:hover, .table-wrapper::-webkit-scrollbar-thumb:hover { background: #6B7280; }
.hidden { display: none !important; }
.settings-page { max-width: 800px; display: flex; flex-direction: column; gap: 2rem; }
.settings-section { background-color: var(--bg-secondary); border: 1px solid var(--border-primary); padding: 1.5rem; border-radius: 12px; }
.section-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; }
.theme-switcher { display: flex; gap: 1rem; }
.theme-btn { flex: 1; padding: 0.75rem; border-radius: 8px; border: 2px solid var(--border-primary); background-color: var(--bg-tertiary); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 500; color: var(--text-primary); transition: all 0.2s ease; }
.theme-btn:hover { border-color: var(--accent-purple); }
.theme-btn.active { border-color: var(--accent-purple); background-color: rgba(168, 85, 247, 0.1); }
.notification-toggles, .profile-info { display: flex; flex-direction: column; gap: 1rem; }
.toggle-item { display: flex; justify-content: space-between; align-items: center; }
.switch { position: relative; display: inline-block; width: 50px; height: 28px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--bg-tertiary); transition: .4s; border-radius: 28px; }
.slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: var(--accent-purple); }
input:checked + .slider:before { transform: translateX(22px); }
.profile-info p { line-height: 1.6; }
.settings-footer { margin-top: 1rem; display: flex; justify-content: flex-end; }
.save-btn { padding: 0.75rem 1.5rem; background: linear-gradient(90deg, var(--accent-purple), var(--accent-blue)); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: opacity 0.2s ease; }
.save-btn:hover { opacity: 0.9; }
.portfolio-container .container-header { margin-bottom: 1rem; }
.portfolio-content { display: flex; align-items: center; gap: 1.5rem; }
.portfolio-chart { flex: 1 1 40%; padding: 0; border: none; }
.portfolio-content .table-wrapper { flex: 1 1 60%; max-height: 200px; }
#portfolioDonutChart { max-height: 200px; }
.holdings-table th, .holdings-table td { padding: 0.5rem; }
.holdings-table .day-change { font-weight: 500; }
.upcoming-bills-container .table-wrapper { max-height: 250px; }
.bill-due-soon { color: var(--pending); font-weight: 500; }
@media (max-width: 1400px) { .personal-finance-grid { grid-template-columns: 1fr; } }
@media (max-width: 1200px) { .main-data, .main-data.business { grid-template-columns: 1fr; } }
@media (max-width: 768px) { .sidebar { width: 78px; } .sidebar span { display: none; } .main-content { padding: 1.5rem; } .kpi-cards { grid-template-columns: 1fr; } }
`
  },
  {
    filePath: "script.js",
    fileContent: `document.addEventListener('DOMContentLoaded', () => {
    feather.replace();

    // --- UTILITIES ---
    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    // --- ELEMENTS ---
    const views = {
        dashboard: document.getElementById('dashboard-view'),
        personal: document.getElementById('personal-finance-view'),
        business: document.getElementById('business-finance-view'),
        settings: document.getElementById('settings-view'),
    };
    const navLinks = {
        dashboard: document.getElementById('nav-dashboard'),
        personal: document.getElementById('nav-personal'),
        business: document.getElementById('nav-business'),
        settings: document.getElementById('nav-settings'),
    };
    const themeButtons = document.querySelectorAll('.theme-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // --- MOCK DATA ---
    const mockData = {
        dashboard: {
            kpis: { totalRevenue: 54232, totalProfit: 12620, totalExpenses: 41612, newCustomers: 351 },
            chart: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], revenue: [3000, 2800, 3500, 4200, 5000, 4800, 5500, 5200, 6000, 5800, 6500, 7200], expenses: [2200, 2100, 2400, 2800, 3200, 3100, 3500, 3300, 3800, 3600, 4000, 4200] },
            transactions: [{ id: '#1024', date: '2024-07-28', customer: 'Stripe', amount: 2500, status: 'Completed' }, { id: '#1023', date: '2024-07-27', customer: 'Shopify', amount: 1200, status: 'Completed' }, { id: '#1022', date: '2024-07-27', customer: 'AWS', amount: 850.50, status: 'Pending' }, { id: '#1021', date: '2024-07-26', customer: 'Google Ads', amount: 500, status: 'Failed' }]
        },
        personal: {
            kpis: { netWorth: 125400, savingsRate: 18, creditScore: 780, portfolioValue: 75230, financialHealth: 'Excellent' },
            budget: [ { category: 'Housing', spent: 1500, total: 2000 }, { category: 'Food', spent: 450, total: 600 }, { category: 'Transport', spent: 250, total: 300 }, { category: 'Entertainment', spent: 300, total: 400 }],
            expensesChart: { labels: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment'], data: [450, 250, 320, 500, 300] },
            portfolioAllocation: { labels: ['Stocks', 'Crypto', 'Real Estate', 'Bonds'], data: [45, 20, 25, 10] },
            holdings: [ { asset: 'SAR-AI', value: 15200, change: 1.2 }, { asset: 'BTC', value: 8300, change: -0.5 }, { asset: 'ETH', value: 4150, change: 2.3 }, { asset: 'RE-US', value: 35000, change: 0.2 }],
            savingsGoals: [ { name: 'Dream Vacation', saved: 6500, total: 10000 }, { name: 'New Car', saved: 18200, total: 30000 }, { name: 'Home Downpayment', saved: 45000, total: 75000 } ],
            upcomingBills: [ { name: 'Rent', dueDate: '2024-08-01', amount: 2000, dueSoon: true }, { name: 'Internet', dueDate: '2024-08-05', amount: 80, dueSoon: false }, { name: 'Electricity', dueDate: '2024-08-10', amount: 150, dueSoon: false }, { name: 'Car Insurance', dueDate: '2024-08-15', amount: 120, dueSoon: false } ],
            cashFlow: { labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], income: [5500, 5600, 5800, 6200, 6100, 6500], expenses: [4200, 4100, 4500, 4800, 4700, 5100] },
            transactions: [ { date: '2024-07-28', description: 'Paycheck', category: 'Income', amount: 3250, type: 'income' }, { date: '2024-07-28', description: 'Grocery Store', category: 'Food', amount: -124.50, type: 'expense' }, { date: '2024-07-27', description: 'Stock Dividend', category: 'Income', amount: 85.20, type: 'income' }, { date: '2024-07-26', description: 'Gas Station', category: 'Transport', amount: -55.70, type: 'expense' }, { date: '2024-07-25', description: 'Dinner with friends', category: 'Entertainment', amount: -78.00, type: 'expense' }, { date: '2024-07-25', description: 'Online Shopping', category: 'Shopping', amount: -210.00, type: 'expense' }, { date: '2024-07-24', description: 'Freelance Work', category: 'Income', amount: 500.00, type: 'income' }, ]
        },
        business: {
            kpis: { receivable: 15200, payable: 8300, cashFlow: 6900 },
            invoices: [ { id: '#INV-001', client: 'TechCorp', date: '2024-07-25', amount: 5000, status: 'Paid', priority: 'Low' }, { id: '#INV-002', client: 'Innovate LLC', date: '2024-07-28', amount: 8000, status: 'Due', priority: 'Medium' }, { id: '#INV-003', client: 'Data Solutions', date: '2024-06-15', amount: 2200, status: 'Overdue', priority: 'High' } ],
            pnlChart: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], profit: [15000, 18000, 22000, 25000], loss: [8000, 9500, 11000, 12000] }
        }
    };

    // --- CHART MANAGEMENT ---
    let chartInstances = {};
    const destroyChart = (name) => {
        if (chartInstances[name]) {
            chartInstances[name].destroy();
            delete chartInstances[name];
        }
    };

    // --- DASHBOARD VIEW FUNCTIONS ---
    function populateDashboardKPIs() {
        const data = mockData.dashboard.kpis;
        document.getElementById('total-revenue').textContent = formatCurrency(data.totalRevenue);
        document.getElementById('total-profit').textContent = formatCurrency(data.totalProfit);
        document.getElementById('total-expenses').textContent = formatCurrency(data.totalExpenses);
        document.getElementById('new-customers').textContent = data.newCustomers;
    }

    function renderDashboardTransactions() {
        const tableBody = document.getElementById('transactions-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = mockData.dashboard.transactions.map(tx => \`<tr><td>\${tx.id}</td><td>\${tx.date}</td><td>\${tx.customer}</td><td>\${formatCurrency(tx.amount)}</td><td><span class="status \${tx.status.toLowerCase()}">\${tx.status}</span></td></tr>\`).join('');
    }
    
    function createRevenueChart() {
        destroyChart('revenue');
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;
        const data = mockData.dashboard.chart;
        const chartTextColor = getComputedStyle(document.body).getPropertyValue('--text-muted');
        const chartGridColor = getComputedStyle(document.body).getPropertyValue('--border-primary');
        chartInstances.revenue = new Chart(ctx, { type: 'line', data: { labels: data.labels, datasets: [ { label: 'Revenue', data: data.revenue, borderColor: '#A855F7', backgroundColor: 'rgba(168, 85, 247, 0.1)', fill: true, tension: 0.4 }, { label: 'Expenses', data: data.expenses, borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4 } ]}, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: chartTextColor } } }, scales: { x: { ticks: { color: chartTextColor }, grid: { color: 'transparent' } }, y: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } } } } });
    }

    // --- PERSONAL FINANCE VIEW FUNCTIONS ---
    function populatePersonalKPIs() {
        const data = mockData.personal.kpis;
        document.getElementById('personal-net-worth').textContent = formatCurrency(data.netWorth);
        document.getElementById('personal-savings').textContent = \`\${data.savingsRate}%\`;
        document.getElementById('personal-credit-score').textContent = data.creditScore;
        const healthScoreEl = document.getElementById('financial-health-score');
        if(healthScoreEl) healthScoreEl.textContent = data.financialHealth;
    }

    function renderBudgetTracker() {
        const container = document.getElementById('budget-items');
        container.innerHTML = mockData.personal.budget.map(item => {
            const percentage = (item.spent / item.total) * 100;
            return \`
                <div class="budget-item">
                    <div class="budget-item-header"><span>\${item.category}</span><span>\${formatCurrency(item.spent)} / \${formatCurrency(item.total)}</span></div>
                    <div class="progress-bar-container"><div class="progress-bar" style="width: \${percentage}%"></div></div>
                </div>
            \`;
        }).join('');
    }
    
    function createExpensePieChart() {
        destroyChart('expensePie');
        const ctx = document.getElementById('expensePieChart');
        if (!ctx) return;
        const data = mockData.personal.expensesChart;
        const chartTextColor = getComputedStyle(document.body).getPropertyValue('--text-muted');
        chartInstances.expensePie = new Chart(ctx, { type: 'pie', data: { labels: data.labels, datasets: [{ data: data.data, backgroundColor: ['#A855F7', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: chartTextColor } } } } });
    }

    function renderHoldings() {
        const tableBody = document.getElementById('holdings-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = mockData.personal.holdings.map(h => \`<tr><td>\${h.asset}</td><td>\${formatCurrency(h.value)}</td><td><span class="day-change \${h.change >= 0 ? 'positive' : 'negative'}">\${h.change > 0 ? '+' : ''}\${h.change}%</span></td></tr>\`).join('');
    }

    function createPortfolioDonutChart() {
        destroyChart('portfolioDonut');
        const ctx = document.getElementById('portfolioDonutChart');
        if (!ctx) return;
        const data = mockData.personal.portfolioAllocation;
        const chartTextColor = getComputedStyle(document.body).getPropertyValue('--text-muted');
        chartInstances.portfolioDonut = new Chart(ctx, { type: 'doughnut', data: { labels: data.labels, datasets: [{ data: data.data, backgroundColor: ['#A855F7', '#3B82F6', '#10B981', '#F59E0B'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right', labels: { color: chartTextColor, boxWidth: 10 } } } } });
    }

    function renderSavingsGoals() {
        const container = document.getElementById('savings-goals-items');
        if (!container) return;
        container.innerHTML = mockData.personal.savingsGoals.map(goal => {
            const percentage = (goal.saved / goal.total) * 100;
            return \`
                <div class="savings-goal-item">
                    <div class="savings-goal-item-header">
                        <span>\${goal.name}</span>
                        <span style="font-weight: 500;">\${formatCurrency(goal.saved)} / \${formatCurrency(goal.total)}</span>
                    </div>
                    <div class="progress-bar-container"><div class="progress-bar" style="width: \${percentage}%"></div></div>
                </div>
            \`;
        }).join('');
    }

    function renderUpcomingBills() {
        const tableBody = document.getElementById('upcoming-bills-body');
        if (!tableBody) return;
        tableBody.innerHTML = mockData.personal.upcomingBills.map(bill => \`
            <tr>
                <td>\${bill.name}</td>
                <td class="\${bill.dueSoon ? 'bill-due-soon' : ''}">\${bill.dueDate}</td>
                <td>\${formatCurrency(bill.amount)}</td>
            </tr>
        \`).join('');
    }
    
    function createCashFlowChart() {
        destroyChart('cashFlow');
        const ctx = document.getElementById('cashFlowChart');
        if (!ctx) return;
        const data = mockData.personal.cashFlow;
        const chartTextColor = getComputedStyle(document.body).getPropertyValue('--text-muted');
        const chartGridColor = getComputedStyle(document.body).getPropertyValue('--border-primary');
        chartInstances.cashFlow = new Chart(ctx, { type: 'bar', data: { labels: data.labels, datasets: [ { label: 'Income', data: data.income, backgroundColor: '#10B981', borderRadius: 4 }, { label: 'Expenses', data: data.expenses, backgroundColor: '#EF4444', borderRadius: 4 } ] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: chartTextColor } } }, scales: { x: { ticks: { color: chartTextColor }, grid: { color: 'transparent' } }, y: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } } } } });
    }

    function renderPersonalTransactions(filter = 'all') {
        const tableBody = document.getElementById('personal-transactions-table-body');
        if (!tableBody) return;
        const filteredData = mockData.personal.transactions.filter(tx => filter === 'all' || tx.type === filter);
        tableBody.innerHTML = filteredData.map(tx => {
            const amountClass = tx.type === 'income' ? 'positive' : 'negative';
            return \`<tr><td>\${tx.date}</td><td>\${tx.description}</td><td>\${tx.category}</td><td><span class="\${amountClass}">\${formatCurrency(tx.amount)}</span></td></tr>\`;
        }).join('');
    }

    function setupPersonalTransactionFilters() {
        const filterButtons = document.querySelectorAll('#personal-finance-view .filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                renderPersonalTransactions(button.dataset.filter);
            });
        });
    }

    // --- BUSINESS FINANCE VIEW FUNCTIONS ---
    function populateBusinessKPIs() {
        const data = mockData.business.kpis;
        document.getElementById('business-receivable').textContent = formatCurrency(data.receivable);
        document.getElementById('business-payable').textContent = formatCurrency(data.payable);
        document.getElementById('business-cash-flow').textContent = formatCurrency(data.cashFlow);
    }

    function renderInvoices() {
        const tableBody = document.getElementById('invoices-table-body');
        tableBody.innerHTML = mockData.business.invoices.map(inv => \`<tr><td>\${inv.id}</td><td>\${inv.client}</td><td><span class="priority \${inv.priority.toLowerCase()}">\${inv.priority}</span></td><td>\${inv.date}</td><td>\${formatCurrency(inv.amount)}</td><td><span class="status \${inv.status.toLowerCase()}">\${inv.status}</span></td></tr>\`).join('');
    }

    function createPnLBarChart() {
        destroyChart('pnlBar');
        const ctx = document.getElementById('pnlBarChart');
        if (!ctx) return;
        const data = mockData.business.pnlChart;
        const chartTextColor = getComputedStyle(document.body).getPropertyValue('--text-muted');
        const chartGridColor = getComputedStyle(document.body).getPropertyValue('--border-primary');
        chartInstances.pnlBar = new Chart(ctx, { type: 'bar', data: { labels: data.labels, datasets: [ { label: 'Profit', data: data.profit, backgroundColor: '#10B981' }, { label: 'Loss', data: data.loss, backgroundColor: '#EF4444' } ]}, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: chartTextColor } } }, scales: { x: { stacked: true, ticks: { color: chartTextColor }, grid: { color: 'transparent' } }, y: { stacked: true, ticks: { color: chartTextColor }, grid: { color: chartGridColor } } } } });
    }
    
    // --- APP LOGIC ---
    function applyTheme(theme) {
        document.body.classList.remove('light', 'dark'); document.body.classList.add(theme);
        themeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme));
        setTimeout(() => { Object.values(chartInstances).forEach(chart => chart.destroy()); initActiveView(); }, 50);
    }
    
    function loadTheme() {
        const savedTheme = localStorage.getItem('sar-financial-theme') || 'dark';
        applyTheme(savedTheme);
    }
    
    function showView(viewKey) {
        Object.values(views).forEach(view => view.classList.add('hidden'));
        views[viewKey].classList.remove('hidden');
        initActiveView();
    }

    function setActiveNav(navElement) {
        allNavLinks.forEach(link => link.classList.remove('active'));
        navElement.classList.add('active');
    }

    function initActiveView() {
        if (!views.dashboard.classList.contains('hidden')) { populateDashboardKPIs(); renderDashboardTransactions(); createRevenueChart(); }
        if (!views.personal.classList.contains('hidden')) { 
            populatePersonalKPIs(); 
            renderBudgetTracker(); 
            createExpensePieChart();
            renderHoldings();
            createPortfolioDonutChart();
            renderSavingsGoals();
            renderUpcomingBills();
            createCashFlowChart();
            renderPersonalTransactions();
        }
        if (!views.business.classList.contains('hidden')) { populateBusinessKPIs(); renderInvoices(); createPnLBarChart(); }
    }

    // --- EVENT LISTENERS ---
    Object.entries(navLinks).forEach(([key, element]) => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            showView(key);
            setActiveNav(element);
        });
    });

    themeButtons.forEach(button => {
        button.addEventListener('click', () => { const theme = button.dataset.theme; localStorage.setItem('sar-financial-theme', theme); applyTheme(theme); });
    });

    saveSettingsBtn.addEventListener('click', () => { alert('Settings saved!'); showView('dashboard'); setActiveNav(navLinks.dashboard); });

    // --- INITIAL LOAD ---
    setupPersonalTransactionFilters();
    loadTheme();
    showView('dashboard');
    setActiveNav(navLinks.dashboard);
});`
  }
];

export const rootFolder: GalleryItem = {
  id: 'root',
  type: 'folder',
  name: 'Home',
  date: '2024-08-01',
  children: [
    {
      id: 'sar-projects-folder',
      type: 'folder',
      name: 'SAR Projects',
      date: '2024-08-02',
      children: [
        {
          id: 'sar-project-financial-dashboard',
          type: 'sar_project',
          name: 'Sar Financial Management Dashboard',
          date: new Date().toISOString(),
          projectPlan: financialDashboardPlan,
          generatedFiles: financialDashboardFiles,
          size: '3 files'
        }
      ]
    },
    {
      id: 'folder-1',
      type: 'folder',
      name: 'AI Avatars',
      date: '2024-08-01',
      children: [
        {
          id: 'image-1',
          type: 'image',
          name: 'Abstract Robot',
          src: 'https://images.unsplash.com/photo-1620712943543-285f726a9a52?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600',
          alt: 'Abstract colorful robot illustration',
          prompt: 'A vibrant and chaotic explosion of colors in the shape of a friendly robot, digital painting, 4k',
          date: '2024-07-29',
        },
        {
          id: 'image-4',
          type: 'image',
          name: 'Astronaut Portrait',
          src: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600',
          alt: 'A portrait of an astronaut',
          prompt: 'Photorealistic portrait of a female astronaut looking out a spaceship window at Earth, detailed reflection in helmet',
          date: '2024-07-26',
        },
      ],
    },
    {
      id: 'video-1',
      type: 'video',
      name: 'Ink Drop',
      src: 'https://assets.mixkit.co/videos/preview/mixkit-black-ink-drop-in-a-white-fluid-2114-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1588595404172-4d7353388a8f?q=80&w=1600',
      date: '2024-07-30',
    },
    {
      id: 'image-2',
      type: 'image',
      name: 'Cyberpunk City',
      src: 'https://images.unsplash.com/photo-1581093450021-4a7360dde4a7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600',
      alt: 'Futuristic cityscape at night',
      prompt: 'Cyberpunk city skyline at night with neon lights reflecting on wet streets, synthwave aesthetic',
      date: '2024-07-28',
    },
    {
      id: 'file-1',
      type: 'file',
      name: 'Project Brief.pdf',
      fileType: 'PDF',
      size: '2.1 MB',
      date: '2024-07-29',
    },
    {
      id: 'folder-2',
      type: 'folder',
      name: 'Vacation Photos',
      date: '2024-07-25',
      children: [
        {
          id: 'image-6',
          type: 'image',
          name: 'Coral Reef',
          src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600',
          alt: 'An underwater coral reef',
          prompt: 'Vibrant underwater coral reef teeming with life, schools of fish, sunlight filtering through the water, National Geographic style',
          date: '2024-07-24',
        },
        {
          id: 'video-2',
          type: 'video',
          name: 'Ocean Waves',
          src: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-near-the-shore-22653-large.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1502691879153-2e4a83680482?q=80&w=1600',
          date: '2024-07-25',
        },
      ],
    },
    {
      id: 'file-2',
      type: 'file',
      name: 'Presentation.pptx',
      fileType: 'PPTX',
      size: '5.8 MB',
      date: '2024-07-26',
    },
    {
      id: 'image-5',
      type: 'image',
      name: 'Coding Cat',
      src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600',
      alt: 'A cat typing on a laptop',
      prompt: 'A fluffy cat wearing glasses, seriously typing on a laptop, cozy dimly lit room, whimsical',
      date: '2024-07-25',
    },
     {
      id: 'image-3',
      type: 'image',
      name: 'Fantasy Landscape',
      src: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600',
      alt: 'A serene fantasy landscape',
      prompt: 'A serene fantasy landscape with floating islands and waterfalls, Studio Ghibli inspired, watercolor',
      date: '2024-07-27',
    },
  ],
};