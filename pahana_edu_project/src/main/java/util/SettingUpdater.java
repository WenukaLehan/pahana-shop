package util;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import jakarta.servlet.http.HttpSession;

import java.io.File;
import java.sql.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.*;

@WebListener
public class SettingUpdater implements ServletContextListener {

    private ScheduledExecutorService scheduler;
    
    String basePath = "D:\\backups\\";
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd");
    

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        scheduler = Executors.newSingleThreadScheduledExecutor();

        scheduler.scheduleAtFixedRate(() -> {
            try {
                Map<String, Boolean> settings = loadSettingsFromDB();

                // Loop through all active sessions and update them
                for (HttpSession session : StartupTask.sessions) {
                    if (session != null) {
                        for (Map.Entry<String, Boolean> entry : settings.entrySet()) {
                            session.setAttribute(entry.getKey(), entry.getValue());
                        }
                        System.out.println("Updated session: " + session.getId());
                    }
                    
                 // 🟡 Check 'backup' session attribute
                    Object backupAttr = session.getAttribute("backup");
                    boolean backupEnabled = backupAttr instanceof Boolean && (Boolean) backupAttr;

                    if (backupEnabled) {
                    	LocalDate today = LocalDate.now();
                    	String datePart = today.format(formatter);
                        // Save backup for this session
                        String sessionBackupPath = basePath + "backup_" + datePart + "\\"  ;
                        new File(sessionBackupPath).mkdirs(); // Create folder if not exists

                        DatabaseBackupUtil.backupDatabase(sessionBackupPath);
                        System.out.println("🔁 Backup triggered for session: " + session.getId());
                    } else {
                        System.out.println("⏭️  Skipping backup for session: " + session.getId());
                    }

                }
                
                
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, 0, 1, TimeUnit.MINUTES);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        if (scheduler != null && !scheduler.isShutdown()) {
            scheduler.shutdown();
        }
    }

    private Map<String, Boolean> loadSettingsFromDB() throws SQLException, ClassNotFoundException {
        Map<String, Boolean> settings = new HashMap<>();

        try (Connection conn = DbCon.getConnection()) {
            if (conn != null) {
                String query = "SELECT * FROM settings";
                try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(query)) {
                    while (rs.next()) {
                        settings.put(rs.getString("name"), rs.getBoolean("value"));
                    }
                }
            }
        }

        return settings;
    }
}
