import express, { Request, Response } from 'express';
import { db } from './db';
import { 
  hashPassword, comparePassword, generateToken, 
  authenticateJWT, requireRole, AuthenticatedRequest 
} from './auth';
import { Crop, AssistanceRequest, AssistanceResponse, GovernmentScheme, User } from '../src/types';

const router = express.Router();

// ==========================================
// 1. AUTHENTICATION MODULE
// ==========================================

// Register
router.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role, district, state, village, land_area, designation, department } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, phone, and password are required.' });
    }

    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const assignedRole = (role === 'officer' || role === 'admin') ? role : 'farmer';
    const newUserId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;

    const newUser = {
      id: newUserId,
      name,
      email: email.toLowerCase(),
      phone,
      password_hash: hashPassword(password),
      role: assignedRole,
      status: 'active' as const,
      district: district || 'Ludhiana',
      state: state || 'Punjab',
      village: village || 'Rural Sector',
      created_at: new Date().toISOString(),
    };

    db.users.push(newUser);

    // Profile extension
    if (assignedRole === 'farmer') {
      db.farmers.push({
        id: db.farmers.length + 1,
        user_id: newUserId,
        district: newUser.district,
        state: newUser.state,
        village: newUser.village,
        land_area_total: Number(land_area) || 5.0,
        primary_soil_type: 'Alluvial Loam',
        water_source: 'Canal + Tube Well',
        aadhaar_number_masked: 'XXXX-XXXX-9901'
      });
    } else if (assignedRole === 'officer') {
      db.officers.push({
        id: db.officers.length + 1,
        user_id: newUserId,
        department: department || 'Department of Agriculture & Farmers Welfare',
        designation: designation || 'Assistant Agricultural Officer',
        assigned_district: newUser.district,
        office_contact: newUser.phone,
        specialization: 'Agronomy & Crop Protection',
        badge_number: `AGRI-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      district: newUser.district,
    });

    const { password_hash, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
  }
});

// Login
router.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account is suspended. Contact administration.' });
    }

    const isMatch = comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      district: user.district,
    });

    const { password_hash, ...userWithoutPassword } = user;
    return res.json({
      success: true,
      message: 'Sign in successful.',
      token,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
});

// Forgot Password
router.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    // Return friendly generic response for security
    return res.json({ 
      success: true, 
      message: 'If an account exists with this email address, a password reset authorization link and OTP has been dispatched.' 
    });
  }

  return res.json({
    success: true,
    message: `Password reset instructions sent to ${email}. Temporary recovery PIN: 849201.`,
    recovery_token: 'temp_pwd_reset_mock_valid_15m'
  });
});

// Get Current User Profile
router.get('/auth/me', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.find(u => u.id === req.user?.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const { password_hash, ...userWithoutPassword } = user;
  let profile = null;
  if (user.role === 'farmer') {
    profile = db.farmers.find(f => f.user_id === user.id) || null;
  } else if (user.role === 'officer') {
    profile = db.officers.find(o => o.user_id === user.id) || null;
  }

  return res.json({
    success: true,
    user: userWithoutPassword,
    profile,
  });
});

// ==========================================
// 2. CROP MANAGEMENT MODULE
// ==========================================

// Get Crops (Farmers get their own; Officers/Admins get all or filter by farmer)
router.get('/crops', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  let cropsList = db.crops;

  if (user.role === 'farmer') {
    cropsList = cropsList.filter(c => c.farmer_id === user.userId);
  }

  const { status, type } = req.query;
  if (status) {
    cropsList = cropsList.filter(c => c.crop_status === status);
  }
  if (type) {
    cropsList = cropsList.filter(c => c.type === type);
  }

  return res.json({ success: true, count: cropsList.length, crops: cropsList });
});

// Add Crop
router.post('/crops', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { name, type, sowing_date, expected_harvest_date, land_area, irrigation_type, crop_status, soil_type, estimated_yield_quintals, notes } = req.body;

    if (!name || !type || !sowing_date || !expected_harvest_date || !land_area || !irrigation_type) {
      return res.status(400).json({ success: false, message: 'All mandatory crop fields must be provided.' });
    }

    const newCrop: Crop = {
      id: db.crops.length > 0 ? Math.max(...db.crops.map(c => c.id)) + 1 : 1,
      farmer_id: user.userId,
      farmer_name: user.name,
      name,
      type,
      sowing_date,
      expected_harvest_date,
      land_area: Number(land_area),
      irrigation_type,
      crop_status: crop_status || 'planted',
      soil_type: soil_type || 'Alluvial Loam',
      estimated_yield_quintals: estimated_yield_quintals ? Number(estimated_yield_quintals) : undefined,
      notes,
      created_at: new Date().toISOString(),
    };

    db.crops.push(newCrop);

    // Create a notification for farmer
    db.notifications.unshift({
      id: db.notifications.length + 1,
      user_id: user.userId,
      type: 'system',
      title: `Crop Added: ${newCrop.name}`,
      message: `Successfully logged ${newCrop.land_area} acres of ${newCrop.name}. Expected harvest date: ${newCrop.expected_harvest_date}.`,
      is_read: false,
      action_link: '/crops',
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ success: true, message: 'Crop entry created successfully.', crop: newCrop });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Update Crop
router.put('/crops/:id', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const cropId = Number(req.params.id);
  const user = req.user!;

  const cropIndex = db.crops.findIndex(c => c.id === cropId);
  if (cropIndex === -1) {
    return res.status(404).json({ success: false, message: 'Crop not found.' });
  }

  // Authorization check: Only owner or admin can edit
  if (user.role === 'farmer' && db.crops[cropIndex].farmer_id !== user.userId) {
    return res.status(403).json({ success: false, message: 'You cannot edit another farmer’s crop records.' });
  }

  const updatedCrop: Crop = {
    ...db.crops[cropIndex],
    ...req.body,
    id: cropId, // prevent id change
    farmer_id: db.crops[cropIndex].farmer_id,
  };

  db.crops[cropIndex] = updatedCrop;
  return res.json({ success: true, message: 'Crop updated successfully.', crop: updatedCrop });
});

// Delete Crop
router.delete('/crops/:id', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const cropId = Number(req.params.id);
  const user = req.user!;

  const cropIndex = db.crops.findIndex(c => c.id === cropId);
  if (cropIndex === -1) {
    return res.status(404).json({ success: false, message: 'Crop not found.' });
  }

  if (user.role === 'farmer' && db.crops[cropIndex].farmer_id !== user.userId) {
    return res.status(403).json({ success: false, message: 'You are not authorized to delete this crop.' });
  }

  db.crops.splice(cropIndex, 1);
  return res.json({ success: true, message: 'Crop deleted successfully.' });
});

// ==========================================
// 3. WEATHER MODULE
// ==========================================

router.get('/weather', (req: Request, res: Response) => {
  const district = (req.query.district as string) || 'Ludhiana';
  const weather = db.getWeatherForDistrict(district);
  return res.json({ success: true, weather });
});

// ==========================================
// 4. MARKET PRICE MODULE
// ==========================================

router.get('/market-prices', (req: Request, res: Response) => {
  let prices = db.marketPrices;
  const { search, district } = req.query;

  if (search) {
    const q = (search as string).toLowerCase();
    prices = prices.filter(p => 
      p.crop_name.toLowerCase().includes(q) || 
      p.variety.toLowerCase().includes(q) ||
      p.market_name.toLowerCase().includes(q)
    );
  }

  if (district && district !== 'All') {
    prices = prices.filter(p => p.district.toLowerCase() === (district as string).toLowerCase());
  }

  return res.json({ success: true, count: prices.length, prices });
});

// Get unique districts for filter
router.get('/market-prices/districts', (req: Request, res: Response) => {
  const districts = Array.from(new Set(db.marketPrices.map(p => p.district)));
  return res.json({ success: true, districts });
});

// ==========================================
// 5. GOVERNMENT SCHEMES MODULE
// ==========================================

router.get('/schemes', (req: Request, res: Response) => {
  let list = db.schemes;
  const { category, sponsor, search } = req.query;

  if (category && category !== 'All') {
    list = list.filter(s => s.category === category);
  }
  if (sponsor && sponsor !== 'All') {
    list = list.filter(s => s.sponsor === sponsor);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(s =>
      s.title.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      (s.sponsor && s.sponsor.toLowerCase().includes(q))
    );
  }

  return res.json({ success: true, count: list.length, schemes: list });
});

router.post('/schemes', authenticateJWT, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { title, category, description, sponsor, subsidy_amount_or_percent, eligibility_criteria, benefits, application_guide, required_documents, important_dates } = req.body;

  if (!title || !category || !description) {
    return res.status(400).json({ success: false, message: 'Title, category, and description are required.' });
  }

  const newScheme: GovernmentScheme = {
    id: db.schemes.length + 1,
    code: `SCHEME-${Math.floor(1000 + Math.random() * 9000)}`,
    title,
    category,
    description,
    sponsor: sponsor || 'Central Government',
    subsidy_amount_or_percent: subsidy_amount_or_percent || 'Up to 50% Subsidy',
    eligibility_criteria: eligibility_criteria || ['All registered landholder farmers'],
    benefits: benefits || ['Direct financial assistance'],
    application_guide: application_guide || ['Apply online with Aadhaar and land records'],
    important_dates: important_dates || { start_date: '2026-01-01', end_date: '2026-12-31' },
    required_documents: required_documents || ['Aadhaar card', 'Land passbook', 'Bank account details'],
    status: 'open',
  };

  db.schemes.unshift(newScheme);
  return res.status(201).json({ success: true, message: 'Government scheme published.', scheme: newScheme });
});

// Apply for a scheme (authenticated farmers/customers)
router.post('/schemes/:id/apply', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const schemeId = Number(req.params.id);
  const scheme = db.schemes.find(s => s.id === schemeId);
  if (!scheme) {
    return res.status(404).json({ success: false, message: 'Scheme not found.' });
  }

  const user = req.user!;
  const { applicant_name, farmer_id, bank_account, routing_code, land_parcel } = req.body;

  if (!applicant_name || !bank_account) {
    return res.status(400).json({ success: false, message: 'Applicant name and bank account are required.' });
  }

  const referenceId = `DBT-${scheme.code || scheme.id}-${Math.floor(100000 + Math.random() * 900000)}`;

  // Notify the applicant
  db.notifications.unshift({
    id: db.notifications.length + 1,
    user_id: user.userId,
    type: 'scheme',
    title: `Application Submitted: ${scheme.title}`,
    message: `Your beneficiary dossier for "${scheme.title}" has been forwarded to the District Agriculture Officer for verification. Reference: ${referenceId}.`,
    is_read: false,
    action_link: '/schemes',
    created_at: new Date().toISOString(),
  });

  return res.status(201).json({
    success: true,
    message: 'Scheme application submitted successfully.',
    reference_id: referenceId,
  });
});

// ==========================================
// 6. AGRICULTURAL ASSISTANCE MODULE
// ==========================================

// List Requests
router.get('/assistance-requests', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  let requests = db.assistanceRequests;

  if (user.role === 'farmer') {
    requests = requests.filter(r => r.farmer_id === user.userId);
  } else if (user.role === 'officer') {
    // Officers see requests from their assigned district or assigned to them
    requests = requests.filter(r => r.district === user.district || r.officer_id === user.userId);
  }

  const { status, category } = req.query;
  if (status && status !== 'All') {
    requests = requests.filter(r => r.status === status);
  }
  if (category && category !== 'All') {
    requests = requests.filter(r => r.category === category);
  }

  return res.json({ success: true, count: requests.length, requests });
});

// Create Assistance Request (Farmers)
router.post('/assistance-requests', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { crop_id, crop_name, title, category, description, photo_url, urgency } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ success: false, message: 'Title, category, and problem description are required.' });
    }

    const newRequest: AssistanceRequest = {
      id: db.assistanceRequests.length > 0 ? Math.max(...db.assistanceRequests.map(r => r.id)) + 1 : 101,
      farmer_id: user.userId,
      farmer_name: user.name,
      farmer_phone: '+91 98765 43210',
      district: user.district || 'Ludhiana',
      crop_id: crop_id ? Number(crop_id) : undefined,
      crop_name: crop_name || 'General Agricultural Field',
      title,
      category,
      description,
      photo_url: photo_url || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
      urgency: urgency || 'Medium',
      status: 'Pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      responses: []
    };

    db.assistanceRequests.unshift(newRequest);

    // Notify all officers in that district
    const officersInDistrict = db.users.filter(u => u.role === 'officer' && u.district === user.district);
    officersInDistrict.forEach(officer => {
      db.notifications.unshift({
        id: db.notifications.length + 1,
        user_id: officer.id,
        type: 'assistance',
        title: `New Assistance Request #${newRequest.id}`,
        message: `${user.name} reported ${category} in ${newRequest.crop_name} (${urgency} urgency).`,
        is_read: false,
        action_link: '/assistance',
        created_at: new Date().toISOString()
      });
    });

    return res.status(201).json({ success: true, message: 'Assistance ticket raised. Agriculture Officer has been notified.', request: newRequest });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Update Request Status & Assign
router.put('/assistance-requests/:id/status', authenticateJWT, requireRole(['officer', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const reqId = Number(req.params.id);
  const { status, officer_name } = req.body;

  const target = db.assistanceRequests.find(r => r.id === reqId);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Assistance request not found.' });
  }

  target.status = status;
  target.officer_id = req.user!.userId;
  target.officer_name = officer_name || req.user!.name;
  target.updated_at = new Date().toISOString();

  // Notify farmer
  db.notifications.unshift({
    id: db.notifications.length + 1,
    user_id: target.farmer_id,
    type: 'assistance',
    title: `Assistance Ticket #${target.id} Status Updated`,
    message: `Your request has been marked as '${status}' by Officer ${target.officer_name}.`,
    is_read: false,
    action_link: '/assistance',
    created_at: new Date().toISOString()
  });

  return res.json({ success: true, message: `Request status updated to ${status}.`, request: target });
});

// Add Response to Request
router.post('/assistance-requests/:id/responses', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const reqId = Number(req.params.id);
  const user = req.user!;
  const { message, recommended_actions, chemical_biological_advice } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Response message cannot be empty.' });
  }

  const target = db.assistanceRequests.find(r => r.id === reqId);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Assistance request not found.' });
  }

  const newResponse: AssistanceResponse = {
    id: (target.responses?.length || 0) + 1,
    request_id: reqId,
    responder_id: user.userId,
    responder_name: user.name,
    responder_role: user.role,
    message,
    recommended_actions: recommended_actions || [],
    chemical_biological_advice: chemical_biological_advice || '',
    created_at: new Date().toISOString(),
  };

  if (!target.responses) {
    target.responses = [];
  }
  target.responses.push(newResponse);

  // If officer replied and ticket was pending, set to In Progress
  if (user.role === 'officer' && target.status === 'Pending') {
    target.status = 'In Progress';
    target.officer_id = user.userId;
    target.officer_name = user.name;
  }
  target.updated_at = new Date().toISOString();

  // Notify the other party
  const notifyUserId = user.role === 'farmer' ? (target.officer_id || 2) : target.farmer_id;
  db.notifications.unshift({
    id: db.notifications.length + 1,
    user_id: notifyUserId,
    type: 'assistance',
    title: `New reply on Request #${target.id}`,
    message: `${user.name} posted an update: "${message.slice(0, 60)}..."`,
    is_read: false,
    action_link: '/assistance',
    created_at: new Date().toISOString()
  });

  return res.status(201).json({ success: true, message: 'Response posted.', response: newResponse, request: target });
});

// ==========================================
// 7. KNOWLEDGE CENTER MODULE
// ==========================================

router.get('/knowledge-center', (req: Request, res: Response) => {
  const { category, season, search } = req.query;
  let articles = db.knowledgeArticles;

  if (category && category !== 'All') {
    articles = articles.filter(a => a.category === category);
  }
  if (season && season !== 'All') {
    articles = articles.filter(a => a.season === season || a.season === 'All Seasons');
  }
  if (search) {
    const q = (search as string).toLowerCase();
    articles = articles.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.summary.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  return res.json({ success: true, count: articles.length, articles });
});

// ==========================================
// 8. NOTIFICATIONS MODULE
// ==========================================

router.get('/notifications', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const userNotifications = db.notifications.filter(n => n.user_id === user.userId);
  return res.json({ success: true, notifications: userNotifications });
});

router.put('/notifications/:id/read', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const notifId = Number(req.params.id);
  const notif = db.notifications.find(n => n.id === notifId && n.user_id === req.user!.userId);
  if (notif) {
    notif.is_read = true;
  }
  return res.json({ success: true });
});

router.post('/notifications/mark-all-read', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  db.notifications.forEach(n => {
    if (n.user_id === user.userId) n.is_read = true;
  });
  return res.json({ success: true, message: 'All notifications marked as read.' });
});

// ==========================================
// 9. ADMIN PANEL & ANALYTICS
// ==========================================

router.get('/admin/analytics', authenticateJWT, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const totalFarmers = db.users.filter(u => u.role === 'farmer').length;
  const totalOfficers = db.users.filter(u => u.role === 'officer').length;
  const totalCrops = db.crops.length;
  const totalAcreage = db.crops.reduce((sum, c) => sum + c.land_area, 0);

  const pendingRequests = db.assistanceRequests.filter(r => r.status === 'Pending').length;
  const inProgressRequests = db.assistanceRequests.filter(r => r.status === 'In Progress').length;
  const resolvedRequests = db.assistanceRequests.filter(r => r.status === 'Resolved' || r.status === 'Closed').length;
  const totalRequests = db.assistanceRequests.length;
  const resolutionRatePercent = totalRequests > 0 ? Math.round((resolvedRequests / totalRequests) * 100) : 0;

  // Status distributions
  const cropsByStatusMap: { [key: string]: number } = {};
  db.crops.forEach(c => {
    cropsByStatusMap[c.crop_status] = (cropsByStatusMap[c.crop_status] || 0) + 1;
  });
  const crops_by_status = Object.keys(cropsByStatusMap).map(status => ({ status, count: cropsByStatusMap[status] }));

  const requestsByCategoryMap: { [key: string]: number } = {};
  db.assistanceRequests.forEach(r => {
    requestsByCategoryMap[r.category] = (requestsByCategoryMap[r.category] || 0) + 1;
  });
  const requests_by_category = Object.keys(requestsByCategoryMap).map(category => ({ category, count: requestsByCategoryMap[category] }));

  const cropsByTypeMap: { [key: string]: number } = {};
  db.crops.forEach(c => {
    cropsByTypeMap[c.type] = (cropsByTypeMap[c.type] || 0) + 1;
  });
  const crops_by_type = Object.keys(cropsByTypeMap).map(type => ({ type, count: cropsByTypeMap[type] }));

  return res.json({
    success: true,
    analytics: {
      total_farmers: totalFarmers,
      total_officers: totalOfficers,
      total_crops: totalCrops,
      total_acreage: Number(totalAcreage.toFixed(1)),
      pending_requests: pendingRequests,
      in_progress_requests: inProgressRequests,
      resolved_requests: resolvedRequests,
      resolution_rate_percent: resolutionRatePercent,
      crops_by_status,
      requests_by_category,
      crops_by_type
    }
  });
});

// Admin User Management
router.get('/admin/users', authenticateJWT, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const safeUsers = db.users.map(({ password_hash, ...u }) => u);
  return res.json({ success: true, users: safeUsers });
});

router.put('/admin/users/:id/status', authenticateJWT, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const userId = Number(req.params.id);
  const { status } = req.body;

  const target = db.users.find(u => u.id === userId);
  if (!target) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  target.status = status;
  return res.json({ success: true, message: `User status changed to ${status}.` });
});

// Admin Broadcast Notification
router.post('/admin/broadcast-notification', authenticateJWT, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { title, message, type } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message required.' });
  }

  db.users.forEach(u => {
    db.notifications.unshift({
      id: db.notifications.length + 1,
      user_id: u.id,
      type: type || 'system',
      title: `[Announcement] ${title}`,
      message,
      is_read: false,
      created_at: new Date().toISOString()
    });
  });

  return res.json({ success: true, message: `Broadcast alert sent to ${db.users.length} registered users.` });
});

// ==========================================
// 10. ARCHITECTURE & DELIVERABLES DOCS API
// ==========================================
router.get('/docs/architecture', (req: Request, res: Response) => {
  return res.json({
    success: true,
    project: 'Farmer Assistance Web Service (AgroAssist)',
    architecture: {
      client: 'React 19 + Vite + Tailwind CSS + Lucide Icons + Recharts + React Router DOM + Axios',
      backend: 'Node.js + Express + JWT Authentication + bcryptjs + REST API',
      database: 'MySQL Relational Schema (InnoDB) with Foreign Key constraints & in-memory emulation layer',
      er_diagram_entities: [
        'users (1) -> (1) farmers',
        'users (1) -> (1) officers',
        'users (1) -> (N) crops',
        'users (1) -> (N) assistance_requests',
        'assistance_requests (1) -> (N) assistance_responses',
        'crops (1) -> (N) assistance_requests',
        'users (1) -> (N) notifications'
      ]
    }
  });
});

export default router;
