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
        const themeButtons = document.querySelectorAll('.theme-btn');
        if(themeButtons.length > 0) {
            themeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme));
        }
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
        if (!views.settings.classList.contains('hidden')) {
            const themeButtons = document.querySelectorAll('.theme-btn');
            const saveSettingsBtn = document.getElementById('save-settings-btn');

            themeButtons.forEach(button => {
                button.addEventListener('click', () => { 
                    const theme = button.dataset.theme;
                    localStorage.setItem('sar-financial-theme', theme);
                    applyTheme(theme);
                });
            });

            saveSettingsBtn.addEventListener('click', () => { 
                alert('Settings saved!'); 
                showView('dashboard'); 
                setActiveNav(navLinks.dashboard); 
            });
        }
    }

    // --- EVENT LISTENERS ---
    Object.entries(navLinks).forEach(([key, element]) => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            showView(key);
            setActiveNav(element);
        });
    });

    // --- INITIAL LOAD ---
    setupPersonalTransactionFilters();
    loadTheme();
    showView('dashboard');
    setActiveNav(navLinks.dashboard);
});`
  }
];

const p2pDashboardPlan: ProjectPlan = {
  projectName: "P2P Crypto Trading Dashboard",
  technologyStack: ["HTML", "CSS", "JavaScript", "Chart.js"],
  featureBreakdown: [
    "Main Dashboard: KPIs for Volume, Active Trades, Users Online. A live trades table and a live market ticker.",
    "User Management: A searchable table of all users with status indicators and management actions.",
    "Dispute Resolution: A dedicated view to manage and resolve active trade disputes.",
    "Bitget Market View: A detailed view with a price chart, stats, and a live order book for the Bitget exchange.",
    "Binance Futures View: A dedicated view for Binance futures, showing funding rates, open interest, and a price chart.",
    "Settings: Toggles and inputs for platform configuration, including a Bitget account integration feature.",
    "Sidebar navigation to switch between all views.",
    "Responsive, dark-themed UI with real-time data simulation and API integration."
  ],
  fileList: ["index.html", "style.css", "script.js"]
};

const p2pDashboardFiles: GeneratedFile[] = [
  {
    filePath: "index.html",
    fileContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>P2P Trading Admin Dashboard</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"><\/script>
    <script src="https://unpkg.com/feather-icons"><\/script>
</head>
<body>
    <div class="app-container">
        <nav class="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="url(#logo-gradient)"></circle><path d="M24 33c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z" stroke="#fff" stroke-opacity=".5" stroke-width="2"></path><path d="M24 29a5 5 0 100-10 5 5 0 000 10z" stroke="#fff" stroke-width="2"></path><defs><linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#A855F7"></stop><stop offset="1" stop-color="#3B82F6"></stop></linearGradient></defs></svg>
                    <span>P2P Admin</span>
                </div>
            </div>
            <ul class="nav-links">
                <li><a href="#" id="nav-dashboard" class="nav-link active"><i data-feather="grid"></i><span>Dashboard</span></a></li>
                <li><a href="#" id="nav-users" class="nav-link"><i data-feather="users"></i><span>Users</span></a></li>
                <li><a href="#" id="nav-disputes" class="nav-link"><i data-feather="alert-octagon"></i><span>Disputes</span></a></li>
                <li><a href="#" id="nav-bitget" class="nav-link"><i data-feather="bar-chart-2"></i><span>Bitget</span></a></li>
                <li><a href="#" id="nav-binance" class="nav-link"><i data-feather="activity"></i><span>Binance</span></a></li>
                <li><a href="#" id="nav-settings" class="nav-link"><i data-feather="user"></i><span>Profile & Settings</span></a></li>
            </ul>
        </nav>
        <main class="main-content">
            <div id="dashboard-view">
                <header class="main-header"><h1>Dashboard</h1></header>
                <section class="kpi-cards">
                    <div class="card"><div class="card-icon volume"><i data-feather="bar-chart-2"></i></div><div class="card-info"><p>Total Volume (24h)</p><h2 id="kpi-volume">$0</h2></div></div>
                    <div class="card"><div class="card-icon trades"><i data-feather="repeat"></i></div><div class="card-info"><p>Active Trades</p><h2 id="kpi-trades">0</h2></div></div>
                    <div class="card"><div class="card-icon users"><i data-feather="user-check"></i></div><div class="card-info"><p>Users Online</p><h2 id="kpi-users">0</h2></div></div>
                    <div class="card"><div class="card-icon disputes"><i data-feather="alert-triangle"></i></div><div class="card-info"><p>Disputes Open</p><h2 id="kpi-disputes">0</h2></div></div>
                </section>
                <section class="main-layout">
                    <div class="live-trades-container"><h3>Live Trades</h3><div class="table-wrapper"><table><thead><tr><th>User</th><th>Asset</th><th>Amount</th><th>Price</th><th>Payment</th><th>Status</th></tr></thead><tbody id="live-trades-body"></tbody></table></div></div>
                    <div class="bitget-ticker-container">
                        <h3>Bitget Market</h3>
                        <ul id="bitget-ticker-list" class="ticker-list"></ul>
                    </div>
                </section>
            </div>
            <div id="users-view" class="hidden">
                <header class="main-header"><h1>User Management</h1></header>
                <div class="table-container">
                    <div class="table-controls"><input type="text" id="user-search" placeholder="Search users..."></div>
                    <div class="table-wrapper"><table><thead><tr><th>User ID</th><th>Username</th><th>Email</th><th>KYC Status</th><th>Trades</th><th>Actions</th></tr></thead><tbody id="users-table-body"></tbody></table></div>
                </div>
            </div>
            <div id="disputes-view" class="hidden">
                 <header class="main-header"><h1>Dispute Resolution</h1></header>
                 <div id="disputes-list" class="disputes-list"></div>
            </div>
            <div id="bitget-view" class="hidden">
                <div id="bitget-connect-prompt" class="connect-prompt hidden">
                    <div class="connect-prompt-content">
                        <div class="connect-icon"><i data-feather="link-2"></i></div>
                        <h2>Connect your Bitget Account</h2>
                        <p>Enter your API key and secret to access real-time market data and features directly in your dashboard.</p>
                        <form id="bitget-connect-form" class="connect-form">
                            <div class="input-group">
                                <label for="bitget-api-key">API Key</label>
                                <input type="text" id="bitget-api-key" placeholder="e.g., bg_..." required>
                            </div>
                            <div class="input-group">
                                <label for="bitget-secret-key">Secret Key</label>
                                <input type="password" id="bitget-secret-key" placeholder="Enter your Secret Key" required>
                            </div>
                            <button type="submit" class="action-btn connect-btn">Connect Account</button>
                        </form>
                        <p class="api-key-notice">Your API keys are stored locally and never sent to our servers.</p>
                    </div>
                </div>
                <div id="bitget-data-container" class="hidden">
                    <header class="main-header">
                        <h1>Bitget Spot Market: BTC/USDT</h1>
                        <div class="market-header-actions">
                            <div class="market-price-display">
                                <span id="bitget-price" class="current-price">$0.00</span>
                                <span id="bitget-change" class="price-change positive">+0.00%</span>
                            </div>
                             <button id="bitget-disconnect-btn" class="action-btn secondary"><i data-feather="x"></i><span>Disconnect</span></button>
                        </div>
                    </header>
                    <section class="market-stats-grid">
                        <div class="stat-card"><p>24h High</p><h3 id="bitget-high">$0.00</h3></div>
                        <div class="stat-card"><p>24h Low</p><h3 id="bitget-low">$0.00</h3></div>
                        <div class="stat-card"><p>24h Volume (BTC)</p><h3 id="bitget-vol-btc">0</h3></div>
                        <div class="stat-card"><p>24h Volume (USDT)</p><h3 id="bitget-vol-usdt">0</h3></div>
                    </section>
                    <section class="market-main-layout">
                        <div class="main-chart-container">
                            <h3>Price Chart (1H)</h3>
                            <canvas id="bitgetPriceChart"></canvas>
                        </div>
                        <div class="market-side-panel">
                            <div class="order-book-container">
                                <h3>Order Book</h3>
                                <div class="order-book-tables">
                                    <table><thead><tr><th>Price (USDT)</th><th>Amount (BTC)</th></tr></thead><tbody id="bitget-asks"></tbody></table>
                                    <div class="order-book-spread"><span id="bitget-spread">Spread: $0.00</span></div>
                                    <table><thead><tr><th>Price (USDT)</th><th>Amount (BTC)</th></tr></thead><tbody id="bitget-bids"></tbody></table>
                                </div>
                            </div>
                            <div class="trade-history-container">
                                <h3>Trade History</h3>
                                <div class="table-wrapper"><table><thead><tr><th>Time</th><th>Price</th><th>Amount</th></tr></thead><tbody id="bitget-trades"></tbody></table></div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <div id="binance-view" class="hidden">
                <div id="binance-connect-prompt" class="connect-prompt hidden">
                    <div class="connect-prompt-content">
                        <div class="connect-icon"><i data-feather="link-2"></i></div>
                        <h2>Connect your Binance Account</h2>
                        <p>Enter your API key and secret to access real-time futures data and features.</p>
                        <form id="binance-connect-form" class="connect-form">
                            <div class="input-group">
                                <label for="binance-api-key">API Key</label>
                                <input type="text" id="binance-api-key" placeholder="Enter your API Key" required>
                            </div>
                            <div class="input-group">
                                <label for="binance-secret-key">Secret Key</label>
                                <input type="password" id="binance-secret-key" placeholder="Enter your Secret Key" required>
                            </div>
                            <button type="submit" class="action-btn connect-btn">Connect Account</button>
                        </form>
                        <p class="api-key-notice">Your API keys are stored locally and never sent to our servers.</p>
                    </div>
                </div>
                <div id="binance-data-container" class="hidden">
                    <header class="main-header">
                        <h1>Binance Futures: BTC/USDT</h1>
                        <div class="market-header-actions">
                            <div class="market-price-display">
                                <span id="binance-price" class="current-price">$0.00</span>
                                <span id="binance-mark-price" class="mark-price">Mark: $0.00</span>
                            </div>
                            <button id="binance-disconnect-btn" class="action-btn secondary"><i data-feather="x"></i><span>Disconnect</span></button>
                        </div>
                    </header>
                    <section class="market-stats-grid">
                        <div class="stat-card"><p>Funding Rate</p><h3 id="binance-funding" class="positive">0.00%</h3></div>
                        <div class="stat-card"><p>Open Interest</p><h3 id="binance-oi">0 BTC</h3></div>
                        <div class="stat-card"><p>24h Volume</p><h3 id="binance-vol">$0</h3></div>
                        <div class="stat-card"><p>Next Funding</p><h3 id="binance-next-funding">00:00:00</h3></div>
                    </section>
                    <section class="market-main-layout">
                        <div class="main-chart-container">
                            <h3>Price Chart (1H)</h3>
                            <canvas id="binancePriceChart"></canvas>
                        </div>
                        <div class="market-side-panel">
                             <div class="trade-history-container">
                                <h3>Recent Liquidations</h3>
                                 <div class="table-wrapper"><table><thead><tr><th>Side</th><th>Price</th><th>Amount (USD)</th></tr></thead><tbody id="binance-liquidations"></tbody></table></div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <div id="settings-view" class="hidden">
                <header class="main-header">
                    <h1>Profile & Settings</h1>
                    <button id="save-settings-btn" class="action-btn"><i data-feather="save"></i><span>Save Changes</span></button>
                </header>
                <div class="profile-header">
                    <div class="profile-avatar">
                        <img src="https://i.pravatar.cc/100?u=admin_profile" alt="User Avatar">
                        <button class="avatar-change-btn"><i data-feather="camera"></i></button>
                    </div>
                    <div class="profile-details">
                        <h2 id="profile-username">admin_user</h2>
                        <p id="profile-email">admin@p2p.com</p>
                        <span id="profile-joindate" class="join-date">Joined July 2024</span>
                    </div>
                    <div class="profile-stats">
                        <div class="stat-item">
                            <h4>Total Volume</h4>
                            <p id="profile-volume">$0</p>
                        </div>
                        <div class="stat-item">
                            <h4>Trades</h4>
                            <p id="profile-trades">0</p>
                        </div>
                        <div class="stat-item">
                            <h4>Completion</h4>
                            <p id="profile-completion">0%</p>
                        </div>
                    </div>
                </div>
                <div class="settings-layout">
                    <div class="settings-main">
                        <div class="settings-card">
                            <h3><i data-feather="shield"></i> Security</h3>
                            <div class="setting-item">
                                <div class="setting-info"><h4>Change Password</h4><p>Update your password regularly to keep your account secure.</p></div>
                                <button class="action-btn secondary">Change Password</button>
                            </div>
                            <div class="setting-item">
                                <div class="setting-info"><h4>Two-Factor Authentication (2FA)</h4><p>Add an extra layer of security to your account.</p></div>
                                <label class="switch"><input type="checkbox" id="2fa-toggle" checked><span class="slider"></span></label>
                            </div>
                            <div class="setting-item">
                                <div class="setting-info"><h4>Active Sessions</h4><p>You are currently logged in on 2 devices.</p></div>
                                <button class="action-btn secondary">Manage Sessions</button>
                            </div>
                        </div>
                        <div class="settings-card">
                            <h3><i data-feather="repeat"></i> Trade Settings</h3>
                            <div class="setting-item">
                                <div class="setting-info"><h4>Default Payment Methods</h4><p>Set your preferred payment methods for quick trading.</p></div>
                                <button class="action-btn secondary">Manage Methods</button>
                            </div>
                            <div class="setting-item">
                                <div class="setting-info"><h4>Auto-Reply Message</h4><p>Set a message to automatically send when a trade starts.</p></div>
                                <textarea id="auto-reply" class="settings-textarea" placeholder="e.g., Hi, I am online and ready to trade. Please make the payment and upload proof."></textarea>
                            </div>
                        </div>
                        <div class="settings-card">
                            <h3><i data-feather="bell"></i> Notifications</h3>
                            <div class="setting-item"><div class="setting-info"><h4>New Trade Alerts</h4></div><label class="switch"><input type="checkbox" id="notify-new-trade" checked></label></div>
                            <div class="setting-item"><div class="setting-info"><h4>Trade Status Updates</h4></div><label class="switch"><input type="checkbox" id="notify-status-update" checked></label></div>
                            <div class="setting-item"><div class="setting-info"><h4>New Message</h4></div><label class="switch"><input type="checkbox" id="notify-new-message"></label></div>
                            <div class="setting-item"><div class="setting-info"><h4>Dispute Opened</h4></div><label class="switch"><input type="checkbox" id="notify-dispute" checked></label></div>
                        </div>
                    </div>
                    <div class="settings-sidebar">
                        <div class="settings-card">
                            <h3><i data-feather="link"></i> Integrations</h3>
                            <div id="integrations-list" class="integrations-list">
                                <!-- JS will populate this -->
                            </div>
                        </div>
                        <div class="settings-card">
                            <h3><i data-feather="percent"></i> Platform Fees</h3>
                            <div class="fee-item"><label for="taker-fee">Taker Fee</label><div class="input-with-adornment"><input type="number" id="taker-fee" value="0.5" step="0.01"><span>%</span></div></div>
                            <div class="fee-item"><label for="maker-fee">Maker Fee</label><div class="input-with-adornment"><input type="number" id="maker-fee" value="0.2" step="0.01"><span>%</span></div></div>
                        </div>
                        <div class="settings-card">
                            <h3><i data-feather="code"></i> API Management</h3>
                            <p class="api-description">Generate API keys for automated trading bots and third-party services.</p>
                            <div id="api-key-list" class="api-key-list"><p class="text-muted">No API keys generated yet.</p></div>
                            <button id="generate-api-key" class="action-btn secondary w-full mt-4">Generate New Key</button>
                        </div>
                    </div>
                </div>
                <div id="toast-notification" class="toast">Settings saved successfully!</div>
            </div>
        </main>
    </div>
    <script src="script.js"><\/script>
</body>
</html>`
  },
  {
    filePath: "style.css",
    fileContent: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
:root { --bg-primary: #0D0B1F; --bg-secondary: #181629; --bg-tertiary: #242235; --text-primary: #E5E7EB; --text-muted: #9CA3AF; --border-primary: rgba(255, 255, 255, 0.1); --accent-purple: #A855F7; --accent-blue: #3B82F6; --positive: #10B981; --negative: #EF4444; --pending: #F59E0B; --verified: #3B82F6; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background-color: var(--bg-primary); color: var(--text-primary); overflow: hidden; }
.app-container { display: flex; height: 100vh; }
.sidebar { width: 240px; background-color: var(--bg-secondary); border-right: 1px solid var(--border-primary); display: flex; flex-direction: column; padding: 1.5rem; }
.sidebar-header .logo { display: flex; align-items: center; gap: .75rem; margin-bottom: 2rem; }
.logo svg { width: 40px; height: 40px; }
.logo span { font-size: 1.25rem; font-weight: 700; }
.nav-links { list-style: none; }
.nav-links a { display: flex; align-items: center; gap: 1rem; padding: .8rem 1rem; margin-bottom: .5rem; border-radius: 8px; text-decoration: none; color: var(--text-muted); font-weight: 500; transition: all .2s ease; }
.nav-links a:hover { background-color: var(--bg-tertiary); color: var(--text-primary); }
.nav-links a.active { background: linear-gradient(90deg, var(--accent-purple), var(--accent-blue)); color: white; }
.main-content { flex-grow: 1; padding: 2rem; overflow-y: auto; }
.main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.main-header h1 { font-size: 2rem; font-weight: 700; }
.kpi-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.card { background-color: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 12px; padding: 1.5rem; display: flex; gap: 1rem; }
.card-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.card-icon.volume { background-color: rgba(59, 130, 246, 0.2); color: #60A5FA; }
.card-icon.trades { background-color: rgba(16, 185, 129, 0.2); color: #34D399; }
.card-icon.users { background-color: rgba(168, 85, 247, 0.2); color: #C084FC; }
.card-icon.disputes { background-color: rgba(239, 68, 68, 0.2); color: #F87171; }
.card-info p { color: var(--text-muted); font-size: .9rem; margin-bottom: .25rem; }
.card-info h2 { font-size: 1.75rem; font-weight: 700; }
.main-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
.live-trades-container, .chart-container, .table-container, .bitget-ticker-container { background-color: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 12px; padding: 1.5rem; }
h3 { font-weight: 600; margin-bottom: 1rem; }
.table-wrapper { overflow-y: auto; max-height: 400px; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: .75rem; text-align: left; font-size: .9rem; border-bottom: 1px solid var(--border-primary); }
th { color: var(--text-muted); font-weight: 500; }
tbody tr:last-child td { border-bottom: none; }
.status { padding: .25rem .75rem; border-radius: 999px; font-size: .75rem; font-weight: 500; text-align: center; display: inline-block; }
.status.completed { background-color: rgba(16, 185, 129, 0.2); color: var(--positive); }
.status.pending, .status.paid { background-color: rgba(245, 158, 11, 0.2); color: var(--pending); }
.status.cancelled { background-color: rgba(239, 68, 68, 0.2); color: var(--negative); }
.status.verified { background-color: rgba(59, 130, 246, 0.2); color: var(--verified); }
.status.unverified { background-color: rgba(245, 158, 11, 0.2); color: var(--pending); }
.table-controls input { width: 100%; max-width: 400px; background-color: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 8px; padding: .5rem 1rem; color: var(--text-primary); margin-bottom: 1rem; }
.actions button { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: .25rem; }
.actions button:hover { color: var(--text-primary); }
.disputes-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem; }
.dispute-card { background-color: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 12px; padding: 1.5rem; }
.dispute-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.dispute-info { font-size: .8rem; color: var(--text-muted); }
.dispute-actions { display: flex; gap: .5rem; margin-top: 1rem; }
.dispute-actions button { flex: 1; padding: .5rem; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; }
.btn-buyer { background-color: var(--positive); color: white; }
.btn-seller { background-color: var(--negative); color: white; }
.hidden { display: none !important; }
.main-content::-webkit-scrollbar, .table-wrapper::-webkit-scrollbar { width: 6px; }
.main-content::-webkit-scrollbar-thumb, .table-wrapper::-webkit-scrollbar-thumb { background: #4B5563; border-radius: 6px; }
.bitget-ticker-container { display: flex; flex-direction: column; }
.ticker-list { list-style: none; flex-grow: 1; }
.ticker-item { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border-primary); }
.ticker-list li:last-child { border-bottom: none; }
.ticker-pair { font-weight: 600; font-size: 1rem; }
.asset-quote { font-weight: 400; color: var(--text-muted); font-size: 0.8rem; margin-left: 2px; }
.sparkline-container { width: 80px; height: 30px; }
.ticker-stats { text-align: right; }
.ticker-price { font-weight: 600; font-size: 0.9rem; }
.ticker-change { font-size: 0.8rem; font-weight: 500; }
.positive { color: var(--positive); }
.negative { color: var(--negative); }
.market-price-display { text-align: right; }
.current-price { font-size: 1.5rem; font-weight: 700; }
.price-change { font-size: 1rem; margin-left: .5rem; }
.mark-price { font-size: .9rem; color: var(--text-muted); display: block; }
.market-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.stat-card { background-color: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 12px; padding: 1rem; }
.stat-card p { color: var(--text-muted); font-size: .8rem; margin-bottom: .25rem; }
.stat-card h3 { font-size: 1.25rem; font-weight: 600; }
.market-main-layout { display: grid; grid-template-columns: 2.5fr 1fr; gap: 1.5rem; height: calc(100% - 200px); }
.main-chart-container { background-color: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; }
.market-side-panel { display: flex; flex-direction: column; gap: 1.5rem; }
.order-book-container, .trade-history-container { background-color: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1; }
.order-book-tables { flex-grow: 1; display: flex; flex-direction: column; }
.order-book-tables table { width: 100%; flex: 1; }
.order-book-tables td { padding: .2rem .5rem; font-size: .8rem; position: relative; }
.order-book-tables .bid td:first-child { color: var(--positive); }
.order-book-tables .ask td:first-child { color: var(--negative); }
.order-book-spread { font-size: .8rem; text-align: center; padding: .5rem; border-top: 1px solid var(--border-primary); border-bottom: 1px solid var(--border-primary); }
.trade-history-container .table-wrapper { max-height: 100%; }
.trade-history-container th, .trade-history-container td { padding: .3rem .5rem; font-size: .8rem; }
/* Settings Page Enhancement */
.settings-layout { display: grid; grid-template-columns: 2.5fr 1fr; gap: 1.5rem; }
.settings-main { display: flex; flex-direction: column; gap: 1.5rem; }
.settings-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
.settings-card { background-color: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 12px; padding: 1.5rem; }
.settings-card h3 { display: flex; align-items: center; gap: .75rem; font-weight: 600; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-primary); padding-bottom: 1rem; }
.setting-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border-primary); }
.settings-card .setting-item:last-child { border-bottom: none; padding-bottom: 0; }
.setting-info h4 { font-weight: 500; color: var(--text-primary); margin-bottom: .25rem; }
.setting-info p { font-size: .85rem; color: var(--text-muted); }
.action-btn { background: linear-gradient(90deg, var(--accent-purple), var(--accent-blue)); color: white; border: none; padding: .6rem 1.2rem; border-radius: 8px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: .5rem; transition: opacity .2s; }
.action-btn:hover { opacity: 0.9; }
.action-btn.secondary { background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-primary); }
.action-btn.secondary:hover { background: var(--bg-primary); }
.settings-textarea { width: 100%; background-color: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 8px; padding: .75rem; color: var(--text-primary); margin-top: .5rem; resize: vertical; min-height: 80px; }
.fee-item { margin-bottom: 1rem; }
.fee-item label { display: block; font-size: .9rem; color: var(--text-muted); margin-bottom: .5rem; }
.input-with-adornment { position: relative; }
.input-with-adornment input { width: 100%; background-color: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 8px; padding: .75rem; color: var(--text-primary); padding-right: 2.5rem; }
.input-with-adornment span { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
.api-description { font-size: .85rem; color: var(--text-muted); margin-bottom: 1rem; }
.api-key-list { display: flex; flex-direction: column; gap: .75rem; }
.api-key-item { display: flex; justify-content: space-between; align-items: center; background-color: var(--bg-primary); padding: .5rem .75rem; border-radius: 6px; }
.api-key-label { font-size: .9rem; font-weight: 500; }
.api-key-value { font-family: monospace; font-size: .8rem; color: var(--text-muted); background-color: var(--bg-tertiary); padding: .25rem .5rem; border-radius: 4px; }
.api-key-actions button { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: .25rem; }
.api-key-actions button:hover { color: var(--accent-purple); }
.w-full { width: 100%; }
.mt-4 { margin-top: 1rem; }
.toast { position: fixed; bottom: -100px; left: 50%; transform: translateX(-50%); background-color: var(--positive); color: white; padding: 1rem 1.5rem; border-radius: 8px; font-weight: 500; transition: bottom .5s ease-in-out; z-index: 1000; }
.toast.show { bottom: 2rem; }
.switch { position: relative; display: inline-block; width: 50px; height: 28px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--bg-tertiary); transition: .4s; border-radius: 28px; }
.slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: var(--accent-purple); }
input:checked + .slider:before { transform: translateX(22px); }
/* Bitget Connection Prompt */
.connect-prompt { display: flex; align-items: center; justify-content: center; height: 100%; text-align: center; flex-direction: column;}
#bitget-view, #binance-view { display: flex; flex-direction: column; height: 100%; }
.connect-prompt-content { background-color: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 16px; padding: 3rem; max-width: 500px; }
.connect-icon { width: 64px; height: 64px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; }
.connect-icon svg { width: 32px; height: 32px; }
.connect-prompt-content h2 { font-size: 1.75rem; font-weight: 700; margin-bottom: .5rem; }
.connect-prompt-content > p { color: var(--text-muted); margin-bottom: 2rem; }
.connect-form { display: flex; flex-direction: column; gap: 1rem; }
.input-group { text-align: left; }
.input-group label { display: block; font-size: .9rem; font-weight: 500; margin-bottom: .5rem; }
.input-group input { width: 100%; background-color: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 8px; padding: .75rem; color: var(--text-primary); }
.connect-btn { margin-top: 1rem; }
.api-key-notice { font-size: .75rem; color: var(--text-muted); margin-top: 1.5rem; }
.market-header-actions { display: flex; align-items: center; gap: 1rem; }
#bitget-data-container, #binance-data-container { display: flex; flex-direction: column; height: 100%; }
/* Settings Integration Card */
.integrations-list { display: flex; flex-direction: column; gap: .5rem; }
.integration-item { display: flex; justify-content: space-between; align-items: center; padding: .75rem 0; border-bottom: 1px solid var(--border-primary); }
.integration-item:last-child { border-bottom: none; }
.integration-info h4 { font-weight: 500; }
.integration-info p { font-size: .85rem; color: var(--text-muted); }

/* Profile Header */
.profile-header {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 1.5rem;
}
.profile-avatar {
    position: relative;
    flex-shrink: 0;
}
.profile-avatar img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid var(--accent-purple);
}
.avatar-change-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
    cursor: pointer;
    transition: background-color .2s;
}
.avatar-change-btn:hover {
    background-color: var(--accent-purple);
}
.profile-details h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: .25rem;
}
.profile-details p {
    color: var(--text-muted);
    margin-bottom: .5rem;
}
.join-date {
    font-size: .8rem;
    color: var(--text-muted);
}
.profile-stats {
    display: flex;
    gap: 2rem;
    margin-left: auto;
}
.stat-item {
    text-align: center;
}
.stat-item h4 {
    font-size: .9rem;
    color: var(--text-muted);
    margin-bottom: .5rem;
    font-weight: 500;
}
.stat-item p {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
}
@media (max-width: 1024px) {
    .settings-layout { 
        grid-template-columns: 1fr; 
    }
    .profile-header {
        flex-direction: column;
        text-align: center;
    }
    .profile-stats {
        margin-left: 0;
        margin-top: 1rem;
        width: 100%;
        justify-content: space-around;
    }
}
`
  },
  {
    filePath: "script.js",
    fileContent: `document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    const views = { dashboard: document.getElementById('dashboard-view'), users: document.getElementById('users-view'), disputes: document.getElementById('disputes-view'), bitget: document.getElementById('bitget-view'), binance: document.getElementById('binance-view'), settings: document.getElementById('settings-view') };
    const navLinks = { dashboard: document.getElementById('nav-dashboard'), users: document.getElementById('nav-users'), disputes: document.getElementById('nav-disputes'), bitget: document.getElementById('nav-bitget'), binance: document.getElementById('nav-binance'), settings: document.getElementById('nav-settings') };
    
    // Bitget Connection Elements
    const bitgetConnectPrompt = document.getElementById('bitget-connect-prompt');
    const bitgetDataContainer = document.getElementById('bitget-data-container');
    const bitgetConnectForm = document.getElementById('bitget-connect-form');
    const bitgetDisconnectBtn = document.getElementById('bitget-disconnect-btn');

    // Binance Connection Elements
    const binanceConnectPrompt = document.getElementById('binance-connect-prompt');
    const binanceDataContainer = document.getElementById('binance-data-container');
    const binanceConnectForm = document.getElementById('binance-connect-form');
    const binanceDisconnectBtn = document.getElementById('binance-disconnect-btn');

    // State
    let isBitgetConnected = localStorage.getItem('isBitgetConnected') === 'true';
    let isBinanceConnected = localStorage.getItem('isBinanceConnected') === 'true';

    // Mock Data
    const mockUsers = Array.from({ length: 50 }, (_, i) => ({ id: \`USR\${1000 + i}\`, username: \`user\${1000 + i}\`, email: \`user\${1000 + i}@test.com\`, kyc: Math.random() > 0.3 ? 'Verified' : 'Unverified', trades: Math.floor(Math.random() * 200) }));
    let mockTrades = Array.from({ length: 20 }, () => createRandomTrade());
    const mockDisputes = [ { id: 'D-987', tradeId: 'T-123', buyer: 'user1001', seller: 'user1002', issue: 'Payment not received' }, { id: 'D-988', tradeId: 'T-124', buyer: 'user1003', seller: 'user1004', issue: 'Crypto not released' } ];
    const mockUserProfile = {
        username: 'admin_trader',
        email: 'admin@p2p.com',
        joinDate: '2024-07-01T10:00:00Z',
        totalVolume: 1250350.75,
        totalTrades: 890,
        completionRate: 98.5,
        avatar: 'https://i.pravatar.cc/100?u=admin_profile'
    };
    let chartInstances = {};

    function createRandomTrade() {
        const assets = ['BTC', 'ETH', 'USDT'];
        const methods = ['Bank Transfer', 'PayPal', 'Wise'];
        const statuses = ['Pending', 'Paid', 'Completed', 'Cancelled'];
        return { user: \`user\${1000 + Math.floor(Math.random() * 50)}\`, asset: assets[Math.floor(Math.random() * 3)], amount: (Math.random() * 2).toFixed(4), price: (20000 + Math.random() * 5000).toFixed(2), payment: methods[Math.floor(Math.random() * 3)], status: statuses[Math.floor(Math.random() * 4)] };
    }

    // --- Dashboard ---
    function updateDashboardKPIs() {
        document.getElementById('kpi-volume').textContent = \`$\${(Math.random() * 500000 + 1000000).toLocaleString('en-US', {maximumFractionDigits: 0})}\`;
        document.getElementById('kpi-trades').textContent = mockTrades.filter(t => t.status === 'Pending' || t.status === 'Paid').length;
        document.getElementById('kpi-users').textContent = Math.floor(Math.random() * 50 + 200);
        document.getElementById('kpi-disputes').textContent = mockDisputes.length;
    }

    function renderLiveTrades() {
        const tbody = document.getElementById('live-trades-body');
        tbody.innerHTML = mockTrades.slice(0, 10).map(trade => \`
            <tr><td>\${trade.user}</td><td>\${trade.asset}</td><td>\${trade.amount}</td><td>$\${trade.price}</td><td>\${trade.payment}</td><td><span class="status \${trade.status.toLowerCase()}">\${trade.status}</span></td></tr>
        \`).join('');
    }

    async function renderBitgetTicker() {
        const list = document.getElementById('bitget-ticker-list');
        if (!list) return;
        try {
            const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
            const response = await fetch(\`https://api.bitget.com/api/v2/spot/market/tickers?symbol=\${symbols.join(',')}\`);
            if (!response.ok) throw new Error(\`API request failed\`);
            const result = await response.json();
            if (result.code !== '00000') throw new Error(\`API Error\`);
            list.innerHTML = result.data.map((ticker, index) => {
                const pair = ticker.symbol.replace('USDT', '');
                const price = parseFloat(ticker.close).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
                const change = parseFloat(ticker.priceChangePercent) * 100;
                return \`<li class="ticker-item"><div><div class="ticker-pair">\${pair}<span class="asset-quote">/USDT</span></div></div><div class="sparkline-container"><canvas id="sparkline-\${index}" width="80" height="30"></canvas></div><div class="ticker-stats"><div class="ticker-price">$\${price}</div><div class="ticker-change \${change >= 0 ? 'positive' : 'negative'}">\${change >= 0 ? '+' : ''}\${change.toFixed(2)}%</div></div></li>\`;
            }).join('');
            result.data.forEach((_, index) => drawSparkline(\`sparkline-\${index}\`));
        } catch (error) { list.innerHTML = '<li>Failed to load market data.</li>'; }
    }

    function drawSparkline(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const data = Array.from({length: 20}, () => Math.random() * 100);
        const isPositive = Math.random() > 0.5;
        const width = canvas.width, height = canvas.height;
        const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isPositive ? 'var(--positive)' : 'var(--negative)';
        data.forEach((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((d - min) / range) * (height - 4) + 2;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();
    }
    
    // --- Bitget View ---
    async function initBitgetView() {
        try {
            const [tickerRes, klineRes, depthRes, tradesRes] = await Promise.all([
                fetch('https://api.bitget.com/api/v2/spot/market/ticker?symbol=BTCUSDT'),
                fetch('https://api.bitget.com/api/v2/spot/market/candles?symbol=BTCUSDT&granularity=1H&limit=100'),
                fetch('https://api.bitget.com/api/v2/spot/market/depth?symbol=BTCUSDT&type=step0&limit=10'),
                fetch('https://api.bitget.com/api/v2/spot/market/fills?symbol=BTCUSDT&limit=20')
            ]);
            const ticker = (await tickerRes.json()).data[0];
            const klines = (await klineRes.json()).data;
            const depth = (await depthRes.json()).data;
            const trades = (await tradesRes.json()).data;

            document.getElementById('bitget-price').textContent = \`$\${parseFloat(ticker.close).toLocaleString()}\`;
            const change = parseFloat(ticker.priceChangePercent) * 100;
            const changeEl = document.getElementById('bitget-change');
            changeEl.textContent = \`\${change >= 0 ? '+' : ''}\${change.toFixed(2)}%\`;
            changeEl.className = \`price-change \${change >= 0 ? 'positive' : 'negative'}\`;
            document.getElementById('bitget-high').textContent = \`$\${parseFloat(ticker.high24h).toLocaleString()}\`;
            document.getElementById('bitget-low').textContent = \`$\${parseFloat(ticker.low24h).toLocaleString()}\`;
            document.getElementById('bitget-vol-btc').textContent = parseFloat(ticker.baseVolume).toLocaleString(undefined, { maximumFractionDigits: 2 });
            document.getElementById('bitget-vol-usdt').textContent = parseFloat(ticker.quoteVolume).toLocaleString(undefined, { maximumFractionDigits: 0 });
            document.getElementById('bitget-asks').innerHTML = depth.asks.map(ask => \`<tr class="ask"><td>\${ask[0]}</td><td>\${ask[1]}</td></tr>\`).join('');
            document.getElementById('bitget-bids').innerHTML = depth.bids.map(bid => \`<tr class="bid"><td>\${bid[0]}</td><td>\${bid[1]}</td></tr>\`).join('');
            document.getElementById('bitget-spread').textContent = \`Spread: $\${(depth.asks[0][0] - depth.bids[0][0]).toFixed(2)}\`;
            document.getElementById('bitget-trades').innerHTML = trades.map(t => \`<tr class="\${t.side}"><td>\${new Date(parseInt(t.ts)).toLocaleTimeString()}</td><td>\${parseFloat(t.price).toFixed(2)}</td><td>\${parseFloat(t.size).toFixed(4)}</td></tr>\`).join('');

            createMarketChart('bitgetPriceChart', klines.reverse().map(k => ({x: parseInt(k[0]), y: parseFloat(k[4])})));
        } catch (e) { 
            console.error("Error initializing Bitget view:", e);
            if(bitgetDataContainer) bitgetDataContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">Could not load Bitget market data.</p>';
        }
    }
    
    // --- Binance View ---
    async function initBinanceView() {
        try {
            const [tickerRes, klineRes, fundingRes, oiRes] = await Promise.all([
                fetch('https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=BTCUSDT'),
                fetch('https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=1h&limit=100'),
                fetch('https://fapi.binance.com/fapi/v1/fundingRate?symbol=BTCUSDT&limit=1'),
                fetch('https://fapi.binance.com/fapi/v1/openInterest?symbol=BTCUSDT')
            ]);
            const ticker = await tickerRes.json();
            const klines = await klineRes.json();
            const funding = (await fundingRes.json())[0];
            const oi = await oiRes.json();

            document.getElementById('binance-price').textContent = \`$\${parseFloat(ticker.lastPrice).toLocaleString()}\`;
            document.getElementById('binance-mark-price').textContent = \`Mark: $\${parseFloat(ticker.lastPrice).toLocaleString()}\`;
            const fundingRate = parseFloat(funding.fundingRate) * 100;
            const fundingEl = document.getElementById('binance-funding');
            fundingEl.textContent = \`\${fundingRate.toFixed(4)}%\`;
            fundingEl.className = fundingRate >= 0 ? 'positive' : 'negative';
            document.getElementById('binance-oi').textContent = \`\${parseFloat(oi.openInterest).toLocaleString(undefined, {maximumFractionDigits:0})} BTC\`;
            document.getElementById('binance-vol').textContent = \`$\${(parseFloat(ticker.quoteVolume)/1_000_000).toFixed(2)}M\`;
            document.getElementById('binance-next-funding').textContent = new Date(funding.fundingTime).toLocaleTimeString();
            
            document.getElementById('binance-liquidations').innerHTML = Array.from({length: 10}).map(() => {
                const side = Math.random() > 0.5 ? 'SELL' : 'BUY';
                return \`<tr class="\${side.toLowerCase()}"><td class="\${side === 'SELL' ? 'negative' : 'positive'}">\${side}</td><td>\${(parseFloat(ticker.lastPrice) * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)}</td><td>\${(Math.random()*500000).toLocaleString(undefined, {maximumFractionDigits:0})}</td></tr>\`
            }).join('');

            createMarketChart('binancePriceChart', klines.map(k => ({x: k[0], y: parseFloat(k[4])})));
        } catch (e) { console.error("Error initializing Binance view:", e); }
    }
    
    function createMarketChart(canvasId, data) {
        if (chartInstances[canvasId]) chartInstances[canvasId].destroy();
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        const chartTextColor = 'rgba(156, 163, 175, 1)';
        const chartGridColor = 'rgba(255, 255, 255, 0.1)';
        chartInstances[canvasId] = new Chart(ctx, { type: 'line', data: { datasets: [{ data: data, borderColor: '#A855F7', borderWidth: 2, pointRadius: 0, tension: 0.1 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { type: 'time', time: { unit: 'hour' }, ticks: { color: chartTextColor }, grid: { color: 'transparent' } }, y: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } } } } });
    }

    // --- User Management ---
    function renderUsers(filter = '') {
        const tbody = document.getElementById('users-table-body');
        const filtered = mockUsers.filter(u => u.username.includes(filter) || u.email.includes(filter));
        tbody.innerHTML = filtered.map(user => \`
            <tr><td>\${user.id}</td><td>\${user.username}</td><td>\${user.email}</td><td><span class="status \${user.kyc.toLowerCase()}">\${user.kyc}</span></td><td>\${user.trades}</td><td class="actions"><button><i data-feather="eye"></i></button><button><i data-feather="slash"></i></button></td></tr>
        \`).join('');
        feather.replace();
    }
    
    // --- Disputes ---
    function renderDisputes() {
        const container = document.getElementById('disputes-list');
        container.innerHTML = mockDisputes.map(d => \`
            <div class="dispute-card">
                <div class="dispute-card-header"><h3>\${d.issue}</h3><span class="dispute-info">Trade \${d.tradeId}</span></div>
                <p><strong>Buyer:</strong> \${d.buyer}</p><p><strong>Seller:</strong> \${d.seller}</p>
                <div class="dispute-actions"><button class="btn-buyer">Resolve for Buyer</button><button class="btn-seller">Resolve for Seller</button></div>
            </div>
        \`).join('');
    }

    // --- Settings View ---
    function renderUserProfile() {
        document.getElementById('profile-username').textContent = mockUserProfile.username;
        document.getElementById('profile-email').textContent = mockUserProfile.email;
        document.getElementById('profile-joindate').textContent = \`Joined \${new Date(mockUserProfile.joinDate).toLocaleString('default', { month: 'long', year: 'numeric' })}\`;
        document.querySelector('.profile-avatar img').src = mockUserProfile.avatar;
        document.getElementById('profile-volume').textContent = \`$\${mockUserProfile.totalVolume.toLocaleString('en-US', {maximumFractionDigits: 0})}\`;
        document.getElementById('profile-trades').textContent = mockUserProfile.totalTrades;
        document.getElementById('profile-completion').textContent = \`\${mockUserProfile.completionRate}%\`;
    }

    function updateIntegrationStatuses() {
        const integrationsContainer = document.getElementById('integrations-list');
        if (!integrationsContainer) return;
    
        // Bitget
        let bitgetStatusHtml;
        if (isBitgetConnected) {
            bitgetStatusHtml = '<span class="status verified">Connected</span>';
        } else {
            bitgetStatusHtml = '<button id="settings-connect-bitget" class="action-btn secondary">Connect</button>';
        }
    
        // Binance
        let binanceStatusHtml;
        if (isBinanceConnected) {
            binanceStatusHtml = '<span class="status verified">Connected</span>';
        } else {
            binanceStatusHtml = '<button id="settings-connect-binance" class="action-btn secondary">Connect</button>';
        }
    
        integrationsContainer.innerHTML = \`
            <div class="integration-item">
                <div class="integration-info"><h4>Bitget</h4><p>Live spot market data.</p></div>
                \${bitgetStatusHtml}
            </div>
            <div class="integration-item">
                <div class="integration-info"><h4>Binance</h4><p>Live futures market data.</p></div>
                \${binanceStatusHtml}
            </div>\`;
            
        if (!isBitgetConnected) {
            document.getElementById('settings-connect-bitget').addEventListener('click', () => {
                showView('bitget');
            });
        }
        if (!isBinanceConnected) {
            document.getElementById('settings-connect-binance').addEventListener('click', () => {
                showView('binance');
            });
        }
    }

    function initSettingsView() {
        feather.replace();
        renderUserProfile();
        updateIntegrationStatuses();
        const saveBtn = document.getElementById('save-settings-btn');
        const toast = document.getElementById('toast-notification');
        const generateApiKeyBtn = document.getElementById('generate-api-key');
        const apiKeyList = document.getElementById('api-key-list');
        
        saveBtn.addEventListener('click', () => {
            toast.textContent = 'Settings saved successfully!';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        });

        const generatedKeys = [];
        generateApiKeyBtn.addEventListener('click', () => {
            const keyName = prompt("Enter a label for this API key:", "My Trading Bot");
            if (keyName) {
                const newKey = { label: keyName, key: \`sk-\${[...Array(32)].map(() => Math.random().toString(36)[2]).join('')}\` };
                generatedKeys.push(newKey);
                renderApiKeys();
            }
        });

        function renderApiKeys() {
            if (generatedKeys.length === 0) {
                apiKeyList.innerHTML = '<p class="text-muted">No API keys generated yet.</p>'; return;
            }
            apiKeyList.innerHTML = generatedKeys.map((key, index) => \`
                <div class="api-key-item">
                    <div><span class="api-key-label">\${key.label}</span></div>
                    <div><span class="api-key-value">\${key.key.substring(0, 7)}...\${key.key.substring(key.key.length - 4)}</span></div>
                    <div class="api-key-actions">
                        <button class="copy-key-btn" data-key="\${key.key}" title="Copy Key"><i data-feather="copy"></i></button>
                        <button class="revoke-key-btn" data-index="\${index}" title="Revoke Key"><i data-feather="trash-2"></i></button>
                    </div>
                </div>\`).join('');
            feather.replace();
            
            apiKeyList.querySelectorAll('.copy-key-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    navigator.clipboard.writeText(e.currentTarget.dataset.key);
                    toast.textContent = 'API Key copied!';
                    toast.classList.add('show');
                    setTimeout(() => { toast.classList.remove('show'); toast.textContent = 'Settings saved successfully!'; }, 2000);
                });
            });

            apiKeyList.querySelectorAll('.revoke-key-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if (confirm('Are you sure you want to revoke this API key? This action is permanent.')) {
                        const indexToRemove = parseInt(e.currentTarget.dataset.index, 10);
                        generatedKeys.splice(indexToRemove, 1);
                        renderApiKeys();
                    }
                });
            });
        }
    }

    // --- View Switching ---
    function showView(view) {
        Object.values(views).forEach(v => v.classList.add('hidden'));
        views[view].classList.remove('hidden');
        Object.values(navLinks).forEach(l => l.classList.remove('active'));
        navLinks[view].classList.add('active');
        
        if(view === 'dashboard') { updateDashboardKPIs(); renderLiveTrades(); renderBitgetTicker(); }
        if(view === 'users') renderUsers();
        if(view === 'disputes') renderDisputes();
        if(view === 'bitget') {
             if (isBitgetConnected) {
                bitgetConnectPrompt.classList.add('hidden');
                bitgetDataContainer.classList.remove('hidden');
                initBitgetView();
            } else {
                bitgetConnectPrompt.classList.remove('hidden');
                bitgetDataContainer.classList.add('hidden');
                feather.replace();
            }
        }
        if(view === 'binance') {
            if (isBinanceConnected) {
                binanceConnectPrompt.classList.add('hidden');
                binanceDataContainer.classList.remove('hidden');
                initBinanceView();
            } else {
                binanceConnectPrompt.classList.remove('hidden');
                binanceDataContainer.classList.add('hidden');
                feather.replace();
            }
        }
        if(view === 'settings') initSettingsView();
    }
    
    // --- Event Listeners ---
    Object.keys(navLinks).forEach(key => navLinks[key].addEventListener('click', (e) => { e.preventDefault(); showView(key); }));
    document.getElementById('user-search').addEventListener('input', (e) => renderUsers(e.target.value));
    
    bitgetConnectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const apiKey = document.getElementById('bitget-api-key').value;
        const secretKey = document.getElementById('bitget-secret-key').value;

        if (apiKey && secretKey) {
            isBitgetConnected = true;
            localStorage.setItem('isBitgetConnected', 'true');
            showView('bitget');
        } else {
            alert('Please provide both API Key and Secret Key.');
        }
    });

    bitgetDisconnectBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to disconnect from Bitget? Your API keys will be removed.')) {
            isBitgetConnected = false;
            localStorage.removeItem('isBitgetConnected');
            showView('bitget');
        }
    });

    binanceConnectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const apiKey = document.getElementById('binance-api-key').value;
        const secretKey = document.getElementById('binance-secret-key').value;
    
        if (apiKey && secretKey) {
            isBinanceConnected = true;
            localStorage.setItem('isBinanceConnected', 'true');
            localStorage.setItem('binanceApiKey', apiKey);
            localStorage.setItem('binanceSecretKey', secretKey);
            showView('binance');
        } else {
            alert('Please provide both API Key and Secret Key.');
        }
    });
    
    binanceDisconnectBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to disconnect from Binance? Your API keys will be removed.')) {
            isBinanceConnected = false;
            localStorage.removeItem('isBinanceConnected');
            localStorage.removeItem('binanceApiKey');
            localStorage.removeItem('binanceSecretKey');
            showView('binance');
        }
    });


    // --- Initialization & Timers ---
    showView('dashboard');
    setInterval(() => {
        mockTrades.shift();
        mockTrades.push(createRandomTrade());
        if (!views.dashboard.classList.contains('hidden')) { renderLiveTrades(); updateDashboardKPIs(); }
    }, 5000);
    setInterval(() => {
        if (!views.dashboard.classList.contains('hidden')) renderBitgetTicker();
        if (!views.bitget.classList.contains('hidden') && isBitgetConnected) initBitgetView();
        if (!views.binance.classList.contains('hidden') && isBinanceConnected) initBinanceView();
    }, 10000);
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
        },
        {
          id: 'folder-client-websites',
          type: 'folder',
          name: 'Client Websites',
          date: new Date().toISOString(),
          children: [
            {
              id: `sar-project-${Date.now()}`,
              type: 'sar_project',
              name: 'P2P Crypto Trading Dashboard',
              date: new Date().toISOString(),
              projectPlan: p2pDashboardPlan,
              generatedFiles: p2pDashboardFiles,
              size: '3 files'
            }
          ]
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
      name: 'Big Buck Bunny',
      src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
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
    // FIX: This item was corrupted with content from another file and had invalid properties.
    // It has been restored to a valid GalleryItem object.
    {
      id: 'file-1',
      type: 'file',
      name: 'Project Brief.pdf',
      date: '2024-07-27',
      fileType: 'application/pdf',
      size: '1.2 MB',
    },
  ],
};