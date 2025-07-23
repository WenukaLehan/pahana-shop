package util;

import java.util.Properties;

import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.*;

import jakarta.servlet.http.HttpServletRequest;

import javax.activation.DataHandler;
import javax.activation.DataSource;




public class EmailSender {

   


	public static void sendEmail(String to, String subject, String body, HttpServletRequest request) throws Exception {
        final String fromEmail = "wmwenuka@gmail.com";
        final String password = "pikg qmat srqe mcpp";

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
        String path = request.getServletContext().getRealPath("/images/logo.png");
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
        final String fromEmail = "wmwenuka@gmail.com";
        final String password = "pikg qmat srqe mcpp";

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
        String path = request.getServletContext().getRealPath("/images/logo.png");
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
	
}
