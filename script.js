let leads = JSON.parse(localStorage.getItem('biz_crm_leads')) || [
    { name: "Aarav Patel", company: "Apex Tech Solutions", email: "aarav@apextech.in", phone: "+91 98211 44556", service: "Web Development", value: 75000, source: "Website Contact Form", status: "Proposal Sent", priority: "High", followUp: "2026-10-02", notes: "Requested full-stack custom portal with payment gateway." },
    { name: "Priya Menon", company: "Metro Retail Hub", email: "priya@metroretail.com", phone: "+91 97412 88990", service: "UI/UX Redesign", value: 45000, source: "LinkedIn Outreach", status: "Converted", priority: "Medium", followUp: "2026-09-30", notes: "Finalized agreement. Advance deposit paid." },
    { name: "Vikram Singh", company: "Singh Logistics", email: "vikram@singhlogistics.co", phone: "+91 99001 22334", service: "Custom CRM Solution", value: 120000, source: "Direct Referral", status: "Contacted", priority: "High", followUp: "2026-10-05", notes: "Needs custom logistics dispatch tracking built in." }
];

const servicesCatalog = [
    { name: "Web Development", price: "₹50,000 - ₹1,00,000+", desc: "Full-stack responsive websites built with React, Node.js, and secure databases." },
    { name: "UI/UX Redesign", price: "₹35,000 - ₹60,000", desc: "High-conversion user interfaces designed in Figma with optimized user experiences." },
    { name: "SEO & Marketing", price: "₹25,000 / month", desc: "Search engine optimization, Google Business profile growth, and keyword dominance." },
    { name: "Custom CRM Solution", price: "₹90,000 - ₹2,00,000+", desc: "Tailored business lead managers, automated follow-ups, and custom reporting pipelines." }
];

let statusChartInstance = null;
let serviceChartInstance = null;

function initCRM() {
    renderLeads(leads);
    updateStats();
    renderCharts();
    renderServicesCatalog();
}

// Tab Switching
function switchTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-menu li').forEach(el => el.classList.remove('active'));

    event.currentTarget.classList.add('active');

    if (tabName === 'dashboard') {
        document.getElementById('dashboardTab').classList.add('active');
        document.getElementById('pageTitle').innerText = 'Enterprise Pipeline';
    } else if (tabName === 'analytics') {
        document.getElementById('analyticsTab').classList.add('active');
        document.getElementById('pageTitle').innerText = 'Visual Business Analytics';
        renderCharts();
    } else if (tabName === 'services') {
        document.getElementById('servicesTab').classList.add('active');
        document.getElementById('pageTitle').innerText = 'Service Catalog & Packages';
        renderServicesCatalog();
    }
}

function renderServicesCatalog() {
    const grid = document.getElementById('servicesGrid');
    grid.innerHTML = '';
    servicesCatalog.forEach(srv => {
        grid.innerHTML += `
            <div class="service-card">
                <h3><i class="fa-solid fa-layer-group"></i> ${srv.name}</h3>
                <div class="price">${srv.price}</div>
                <p>${srv.desc}</p>
            </div>
        `;
    });
}

function renderLeads(dataToRender) {
    const tableBody = document.getElementById('leadTableBody');
    tableBody.innerHTML = '';

    if (dataToRender.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 40px;">No business leads found matching criteria.</td></tr>`;
        return;
    }

    dataToRender.forEach((lead, index) => {
        const badgeClass = lead.status.replace(/\s+/g, '');
        const priorityClass = lead.priority || 'Medium';
        tableBody.innerHTML += `
            <tr>
                <td><strong>${lead.name}</strong><br><small style="color:#64748b">${lead.company}</small></td>
                <td><span style="font-weight: 500; color: #2563eb;">${lead.service}</span></td>
                <td><strong>₹${Number(lead.value).toLocaleString('en-IN')}</strong></td>
                <td><span class="priority-badge priority-${priorityClass}">${lead.priority}</span></td>
                <td><span class="badge ${badgeClass}">${lead.status}</span></td>
                <td><i class="fa-regular fa-calendar-days" style="color: #64748b; margin-right: 5px;"></i> ${lead.followUp || 'Not Set'}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editLead(${index})" title="Edit Lead"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="action-btn delete-btn" onclick="deleteLead(${index})" title="Delete Lead"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function updateStats() {
    const totalCount = leads.length;
    const totalValue = leads.reduce((sum, l) => sum + Number(l.value), 0);
    const convertedCount = leads.filter(l => l.status === 'Converted').length;
    const conversionRate = totalCount > 0 ? ((convertedCount / totalCount) * 100).toFixed(1) : 0;

    document.getElementById('totalCount').innerText = totalCount;
    document.getElementById('totalValue').innerText = `₹${totalValue.toLocaleString('en-IN')}`;
    document.getElementById('convertedCount').innerText = convertedCount;
    document.getElementById('conversionRate').innerText = `${conversionRate}%`;
}

function openModal() {
    document.getElementById('leadModal').style.display = 'flex';
    document.getElementById('modalTitle').innerText = 'Register Business Lead';
    document.getElementById('leadForm').reset();
    document.getElementById('leadIndex').value = '';
    // Set default follow-up date to today
    document.getElementById('followUpDate').valueAsDate = new Date();
}

function closeModal() {
    document.getElementById('leadModal').style.display = 'none';
}

function saveLead(event) {
    event.preventDefault();
    const index = document.getElementById('leadIndex').value;
    const newLead = {
        name: document.getElementById('clientName').value,
        company: document.getElementById('companyName').value,
        email: document.getElementById('clientEmail').value,
        phone: document.getElementById('clientPhone').value,
        service: document.getElementById('clientService').value,
        value: Number(document.getElementById('dealValue').value),
        source: document.getElementById('clientSource').value,
        status: document.getElementById('clientStatus').value,
        priority: document.getElementById('clientPriority').value,
        followUp: document.getElementById('followUpDate').value,
        notes: document.getElementById('clientNotes').value
    };

    if (index === '') {
        leads.unshift(newLead);
    } else {
        leads[index] = newLead;
    }

    localStorage.setItem('biz_crm_leads', JSON.stringify(leads));
    closeModal();
    initCRM();
}

function editLead(index) {
    const lead = leads[index];
    document.getElementById('leadIndex').value = index;
    document.getElementById('clientName').value = lead.name;
    document.getElementById('companyName').value = lead.company;
    document.getElementById('clientEmail').value = lead.email;
    document.getElementById('clientPhone').value = lead.phone;
    document.getElementById('clientService').value = lead.service;
    document.getElementById('dealValue').value = lead.value;
    document.getElementById('clientSource').value = lead.source;
    document.getElementById('clientStatus').value = lead.status;
    document.getElementById('clientPriority').value = lead.priority || 'Medium';
    document.getElementById('followUpDate').value = lead.followUp || '';
    document.getElementById('clientNotes').value = lead.notes;

    document.getElementById('modalTitle').innerText = 'Update Business Lead';
    document.getElementById('leadModal').style.display = 'flex';
}

function deleteLead(index) {
    if (confirm('Are you sure you want to delete this lead?')) {
        leads.splice(index, 1);
        localStorage.setItem('biz_crm_leads', JSON.stringify(leads));
        initCRM();
    }
}

function filterLeads() {
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const statusVal = document.getElementById('statusFilter').value;
    const serviceVal = document.getElementById('serviceFilter').value;

    const filtered = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchVal) || 
                              lead.company.toLowerCase().includes(searchVal) || 
                              lead.email.toLowerCase().includes(searchVal);
        const matchesStatus = statusVal === 'ALL' || lead.status === statusVal;
        const matchesService = serviceVal === 'ALL' || lead.service === serviceVal;
        return matchesSearch && matchesStatus && matchesService;
    });

    renderLeads(filtered);
}

function renderCharts() {
    const statuses = ['New', 'Contacted', 'Proposal Sent', 'Converted', 'Lost'];
    const statusCounts = statuses.map(status => leads.filter(l => l.status === status).length);

    const ctxStatus = document.getElementById('statusChart').getContext('2d');
    if (statusChartInstance) statusChartInstance.destroy();
    statusChartInstance = new Chart(ctxStatus, {
        type: 'doughnut',
        data: {
            labels: statuses,
            datasets: [{
                data: statusCounts,
                backgroundColor: ['#ef4444', '#f59e0b', '#0284c7', '#10b981', '#64748b'],
                borderWidth: 0
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#475569' } } }
        }
    });

    const services = ['Web Development', 'UI/UX Redesign', 'SEO & Marketing', 'Custom CRM Solution'];
    const serviceCounts = services.map(service => leads.filter(l => l.service === service).length);

    const ctxService = document.getElementById('serviceChart').getContext('2d');
    if (serviceChartInstance) serviceChartInstance.destroy();
    serviceChartInstance = new Chart(ctxService, {
        type: 'bar',
        data: {
            labels: services,
            datasets: [{
                label: 'Leads count',
                data: serviceCounts,
                backgroundColor: '#2563eb',
                borderRadius: 6
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: { 
                y: { beginAtZero: true, ticks: { stepSize: 1, color: '#475569' }, grid: { color: '#f1f5f9' } },
                x: { ticks: { color: '#475569' }, grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function exportToCSV() {
    if (leads.length === 0) {
        alert("No data available to export.");
        return;
    }
    let csvContent = "data:text/csv;charset=utf-8,Client Name,Company,Email,Phone,Service,Deal Value,Priority,Status,Follow-Up Date,Notes\n";
    leads.forEach(l => {
        csvContent += `"${l.name}","${l.company}","${l.email}","${l.phone}","${l.service}",${l.value},"${l.priority}","${l.status}","${l.followUp}","${l.notes}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bizflow_leads_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

initCRM();