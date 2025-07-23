
package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DbCon {
    private static final String URL = "jdbc:mysql://localhost:3306/pahana_edu?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "Wenuka@2003";

    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        // Load MySQL JDBC Driver
        Class.forName("com.mysql.cj.jdbc.Driver");
        // Establish connection
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
