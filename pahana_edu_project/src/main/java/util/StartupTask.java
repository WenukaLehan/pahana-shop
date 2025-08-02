package util;

import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.servlet.annotation.WebListener;

@WebListener
public class StartupTask implements HttpSessionListener {
	
	public static final Set<jakarta.servlet.http.HttpSession> sessions = ConcurrentHashMap.newKeySet();

    @Override
    public void sessionCreated(HttpSessionEvent se) {
    	sessions.add(se.getSession());
        System.out.println("Session created: " + se.getSession().getId());
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
    	sessions.remove(se.getSession());
        System.out.println("Session destroyed: " + se.getSession().getId());
    }
}
