// OAuth2 Callback Handler for Zoho Authentication
// This API route handles the OAuth redirect from Zoho and exchanges the authorization code for tokens

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract authorization code and error from query parameters
  const { code, error, error_description } = req.query;

  // Handle OAuth errors from Zoho
  if (error) {
    console.error('Zoho OAuth error:', error, error_description);
    return res.redirect(`/login?error=${encodeURIComponent(error_description || error)}`);
  }

  // Validate authorization code presence
  if (!code) {
    return res.redirect('/login?error=No authorization code received');
  }

  try {
    // Prepare token exchange request
    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;
    const redirectUri = process.env.ZOHO_REDIRECT_URI;

    // Validate environment variables
    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing required OAuth configuration');
    }

    // Exchange authorization code for access token and refresh token
    const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    // Handle token exchange errors
    if (!tokenResponse.ok || tokenData.error) {
      console.error('Token exchange error:', tokenData);
      return res.redirect(`/login?error=${encodeURIComponent(tokenData.error || 'Failed to obtain access token')}`);
    }

    // Extract tokens from response
    const { access_token, refresh_token, expires_in } = tokenData;

    if (!access_token) {
      throw new Error('No access token received from Zoho');
    }

    // Store tokens securely
    // In production, you should:
    // 1. Store tokens in a secure database associated with the user
    // 2. Use HTTP-only cookies for session management
    // 3. Encrypt sensitive data
    // 4. Implement proper session handling
    
    // For this MVP, we'll use cookies (WARNING: Not production-ready)
    // Set access token cookie (expires in 1 hour as per Zoho's token lifetime)
    res.setHeader('Set-Cookie', [
      `zoho_access_token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${expires_in || 3600}`,
      refresh_token 
        ? `zoho_refresh_token=${refresh_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 365}` // 1 year
        : '',
    ].filter(Boolean));

    // Log success (remove in production)
    console.log('OAuth authentication successful');
    console.log('Access token expires in:', expires_in, 'seconds');

    // Redirect to dashboard or home page
    res.redirect('/dashboard');

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`);
  }
}
