package util;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

public class DatabaseBackupUtil {

    public static void backupDatabase(String savePath) {
        String dbName = "pahana_edu";
        String dbUser = "root";
        String dbPassword = "Wenuka@2003";

        // Path to mysqldump.exe
        String mysqldumpPath = "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe";

        // Output file
        String backupFile = savePath + "\\backup_" + System.currentTimeMillis() + ".sql";

        // Use array to handle spaces safely
        String[] command = {
            mysqldumpPath,
            "-u" + dbUser,
            "-p" + dbPassword,
            "--databases", dbName,
            "-r", backupFile
        };

        try {
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true); // Combine stdout + stderr
            Process process = pb.start();

            // Read output
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(">> " + line);
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("✅ Backup created at: " + backupFile);
            } else {
                System.out.println("❌ Backup failed with exit code: " + exitCode);
            }

        } catch (Exception e) {
            System.out.println("❌ Exception during backup:");
            e.printStackTrace();
        }
    }
}
