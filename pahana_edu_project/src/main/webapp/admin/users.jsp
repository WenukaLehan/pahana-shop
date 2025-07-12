<%-- This file contains the content for the User Management page. --%>

<%-- Page-specific styles --%>
<style>
    .stat-card .stat-number {
        color: #FFD700; /* Example: Make numbers gold */
        text-shadow: 0 0 5px rgba(0,0,0,0.5);
    }
</style>

<%-- HTML content --%>
<div class="welcome-message">
    <h3 style="color: white; margin-bottom: 10px;">Welcome to User Management</h3>
    <p>Manage your users, permissions, and access controls from this dashboard.</p>
</div>

<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-number">124</div>
        <div class="stat-label">Total Users</div>
    </div>
    <div class="stat-card">
        <div class="stat-number">18</div>
        <div class="stat-label">Active Sessions</div>
    </div>
    <div class="stat-card">
        <div class="stat-number">7</div>
        <div class="stat-label">New Today</div>
    </div>
    <div class="stat-card">
        <div class="stat-number">98%</div>
        <div class="stat-label">Satisfaction</div>
    </div>
</div>

<%-- Page-specific scripts --%>
<script>
    console.log("User Management content loaded and its script has executed.");
    // Example: Add an event listener to a new element
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            console.log('Hovering over a user stat card.');
        });
    });
</script>