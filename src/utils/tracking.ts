// Tracking service for Google Simulation analytics

export interface TrackingEvent {
  eventType: 'click' | 'search' | 'page_view' | 'tab_change' | 'pagination';
  elementType: string; // 'result_card' | 'image' | 'pagination' | 'tab' | 'search' | etc.
  elementId?: string;
  elementText?: string;
  url?: string;
  platform?: string;
  persona: string; // 'greg' | 'meredith' | 'tremayne' | 'tanisha'
  timestamp: string | Date; // ISO string when sending, Date when receiving
  sessionId?: string;
  page?: number;
  tab?: string;
  searchQuery?: string;
}

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('google_sim_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('google_sim_session_id', sessionId);
  }
  return sessionId;
};

// Track an event
export const trackEvent = async (event: Omit<TrackingEvent, 'timestamp' | 'sessionId'>): Promise<void> => {
  const trackingEvent = {
    ...event,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  };

  try {
    const apiUrl = '/api/track';
    
    console.log('Sending tracking event:', trackingEvent);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackingEvent),
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (!response.ok) {
      console.error('❌ Failed to track event:', {
        status: response.status,
        statusText: response.statusText,
        response: responseData,
        event: trackingEvent,
        url: apiUrl
      });
    } else {
      console.log('✅ Event tracked successfully:', responseData);
    }
  } catch (error: any) {
    console.error('❌ Tracking error:', {
      error: error.message,
      stack: error.stack,
      event: trackingEvent,
      note: import.meta.env.DEV 
        ? 'API endpoint only works when deployed to Vercel. Use "vercel dev" to test locally.'
        : 'Check Vercel function logs for details'
    });
  }
};

// Helper functions for common tracking scenarios
export const trackResultClick = (resultId: string, platform: string, title: string, persona: string) => {
  trackEvent({
    eventType: 'click',
    elementType: 'result_card',
    elementId: resultId,
    elementText: title,
    platform,
    persona,
  });
};

export const trackImageClick = (imageId: string, imageTitle: string, persona: string) => {
  trackEvent({
    eventType: 'click',
    elementType: 'image',
    elementId: imageId,
    elementText: imageTitle,
    persona,
  });
};

export const trackTabChange = (tab: string, persona: string) => {
  trackEvent({
    eventType: 'tab_change',
    elementType: 'tab',
    elementText: tab,
    persona,
    tab,
  });
};

export const trackPagination = (page: number, persona: string) => {
  trackEvent({
    eventType: 'pagination',
    elementType: 'pagination',
    persona,
    page,
  });
};

export const trackSearch = (query: string, persona: string) => {
  trackEvent({
    eventType: 'search',
    elementType: 'search',
    searchQuery: query,
    persona,
  });
};

export const trackPageView = (persona: string, page?: number, tab?: string) => {
  trackEvent({
    eventType: 'page_view',
    elementType: 'page',
    persona,
    page,
    tab,
  });
};
