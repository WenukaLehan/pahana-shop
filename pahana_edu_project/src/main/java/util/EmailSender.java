package util;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Properties;

import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.*;

import jakarta.servlet.http.HttpServletRequest;

import javax.activation.DataHandler;
import javax.activation.DataSource;




public class EmailSender {

   


	public static void sendEmail(String to, String subject, String body, HttpServletRequest request) throws Exception {
        final String fromEmail = "";
        final String password = "";

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(fromEmail));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
        message.setSubject(subject);

        MimeBodyPart messageBodyPart = new MimeBodyPart();
        String htmlContent = "<h3>[Pahana EDU pvt.ltd]</h3>"
                + "<img src=\"cid:logoImage\" width=100 height=100/><br/>"
                + "<p>" + body + "</p>";
        messageBodyPart.setContent(htmlContent, "text/html");

        MimeBodyPart logoPart = new MimeBodyPart();
        String path = request.getServletContext().getRealPath("./images/logo.png");
        DataSource fds = new FileDataSource(path);
        logoPart.setDataHandler(new DataHandler(fds));
        logoPart.setHeader("Content-ID", "<logoImage>");
        logoPart.setDisposition(MimeBodyPart.INLINE);

        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);
        multipart.addBodyPart(logoPart);

        message.setContent(multipart);

        Transport.send(message);
    }
	
	public static void sendEmailWithAttachment(String to, String subject, String body, String filePath,HttpServletRequest request) throws Exception {
        final String fromEmail = "";
        final String password = "";

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(fromEmail));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
        message.setSubject(subject);

        MimeBodyPart messageBodyPart = new MimeBodyPart();
        String htmlContent = "<h3>[Pahana EDU pvt.ltd]</h3>"
                + "<img src=\"cid:logoImage\" width=100 height=100/><br/>"
                + "<p>" + body + "</p>";
        messageBodyPart.setContent(htmlContent, "text/html");

        MimeBodyPart attachmentPart = new MimeBodyPart();
        DataSource source = new FileDataSource(filePath);
        attachmentPart.setDataHandler(new DataHandler(source));
        attachmentPart.setFileName(source.getName());

        MimeBodyPart logoPart = new MimeBodyPart();
        String path = request.getServletContext().getRealPath("./images/logo.png");
        DataSource fds = new FileDataSource(path);
        logoPart.setDataHandler(new DataHandler(fds));
        logoPart.setHeader("Content-ID", "<logoImage>");
        logoPart.setDisposition(MimeBodyPart.INLINE);

        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);
        multipart.addBodyPart(logoPart);
        multipart.addBodyPart(attachmentPart);

        message.setContent(multipart);

        Transport.send(message);
    }
	
    private static final String SMTP_USER = "";
    private static final String SMTP_PASS = ""; // This is an example App Password
    private static final String SMTP_HOST = "smtp.gmail.com";
    private static final String SMTP_PORT = "587"; // Standard TLS port for SMTP

    
    public static void sendEmailWithAttachment(String to, String subject, String body, byte[] pdfBytes, String pdfFileName, HttpServletRequest request) throws MessagingException, IOException {
        // Set up email properties for SMTP
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true"); // Enable TLS
        props.put("mail.smtp.host", SMTP_HOST);
        props.put("mail.smtp.port", SMTP_PORT);

        // Create a session with authentication
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SMTP_USER, SMTP_PASS);
            }
        });

        // Create a new email message
        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(SMTP_USER)); // Sender's email address
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to)); // Recipient's email address
        message.setSubject(subject); // Email subject

        // Create a multipart message to hold text, inline image, and attachment
        Multipart multipart = new MimeMultipart();

        // 1. Add the HTML text part
        MimeBodyPart messageBodyPart = new MimeBodyPart();
        // Combine HTML content from user's example with dynamic body text
        // Replace newlines in the plain text body with <br/> for proper HTML rendering
        String htmlContent = "<h3>[Pahana EDU pvt.ltd]</h3>"
            + "<img src=\"cid:logoImage\" width=100 height=100/><br/>"
            + "<p>" + body.replace("\n", "<br/>") + "</p>";
        messageBodyPart.setContent(htmlContent, "text/html");
        multipart.addBodyPart(messageBodyPart);

        // 2. Add the inline logo image part
        MimeBodyPart logoPart = new MimeBodyPart();
        // Get the real path to the logo image within the web application
        String logoPath = request.getServletContext().getRealPath("./images/logo.png");
        DataSource fds = new FileDataSource(logoPath);
        logoPart.setDataHandler(new DataHandler(fds));
        logoPart.setHeader("Content-ID", "<logoImage>"); // Content-ID for embedding in HTML
        logoPart.setDisposition(MimeBodyPart.INLINE); // Mark as inline attachment
        multipart.addBodyPart(logoPart);

        // 3. Add the PDF attachment part
        MimeBodyPart attachmentPart = new MimeBodyPart();
        // Use ByteArrayDataSource for the PDF data (which comes as bytes from the request)
        attachmentPart.setDataHandler(new DataHandler(new ByteArrayDataSource(pdfBytes, "application/pdf")));
        attachmentPart.setFileName(pdfFileName); // Set the file name for the attachment
        multipart.addBodyPart(attachmentPart);

        // Set the complete multipart content to the message
        message.setContent(multipart);

        // Send the email
        Transport.send(message);
    }

    /**
     * Inner class to provide a DataSource from a byte array.
     * This is useful for attaching data that is already in memory (e.g., decoded from base64).
     */
    private static class ByteArrayDataSource implements DataSource {
        private final byte[] data;
        private final String contentType;

        public ByteArrayDataSource(byte[] data, String contentType) {
            this.data = data;
            this.contentType = contentType;
        }

        @Override
        public InputStream getInputStream() throws IOException {
            return new ByteArrayInputStream(data);
        }

        @Override
        public OutputStream getOutputStream() throws IOException {
            throw new IOException("Not supported"); // Output stream not needed for reading data
        }

        @Override
        public String getContentType() {
            return contentType;
        }

        @Override
        public String getName() {
            return "ByteArrayDataSource";
        }
    }
	
	
}
