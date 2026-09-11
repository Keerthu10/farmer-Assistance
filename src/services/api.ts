import { db, persistDb, nextId } from './localDb';
import { hashPassword, comparePassword } from './passwordUtils';
import { getWeatherForDistrict } from '../data/appSeedData';
import {
  User, Crop, WeatherData, MarketPrice, GovernmentScheme,
  AssistanceRequest, AssistanceResponse, KnowledgeArticle,
  AppNotification, AdminAnalytics, UserRole,
} from '../types';

// ==========================================
// Local "backend" for a fully client-side app.
// Mirrors the shape of the previous axios-based client (Promise<{ data }>
// on success, an error whose `.response.data.message` carries the message
// on failure) so every calling page keeps working unchanged.
// ==========================================

const TOKEN_KEY = 'agroassist_jwt_token';

class ApiError extends Error {
  response: { status: number; data: { success: false; message: string } };
  constructor(status: number, message: string) {
    super(message);
    this.response = { status, data: { success: false, message } };
  }
}

function generateToken(userId: number): string {
  return btoa(JSON.stringify({ userId, iat: Date.now() }));
}

function getCurrentUser(): (User & { password_hash: string }) | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  try {
    const { userId } = JSON.parse(atob(token));
    return db.users.find((u) => u.id === userId) || null;
  } catch {
    return null;
  }
}

function requireAuth(): User & { password_hash: string } {
  const user = getCurrentUser();
  if (!user) throw new ApiError(401, 'Authentication required. Please sign in again.');
  return user;
}

function requireRole(user: User, roles: UserRole[]) {
  if (!roles.includes(user.role)) {
    throw new ApiError(403, `Access denied. Role '${user.role}' is not authorized to access this resource.`);
  }
}

function withoutPassword(user: User & { password_hash: string }): User {
  const { password_hash, ...rest } = user;
  return rest;
}

function ok<T extends object>(data: T): Promise<{ data: T }> {
  return Promise.resolve({ data });
}

function fail(status: number, message: string): never {
  throw new ApiError(status, message);
}

// ==========================================
// 1. AUTH
// ==========================================

export const authApi = {
  login: ({ email, password }: { email: string; password: string }) => {
    if (!email || !password) fail(400, 'Email and password are required.');

    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) fail(401, 'Invalid email or password.');
    if (user.status === 'suspended') fail(403, 'Your account is suspended. Contact administration.');
    if (!comparePassword(password, user.password_hash)) fail(401, 'Invalid email or password.');

    const token = generateToken(user.id);
    return ok({ success: true, message: 'Sign in successful.', token, user: withoutPassword(user) });
  },

  register: (data: any) => {
    const { name, email, phone, password, role, district, state, village, land_area, designation, department } = data;

    if (!name || !email || !password || !phone) {
      fail(400, 'Name, email, phone, and password are required.');
    }
    if (db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      fail(400, 'An account with this email already exists.');
    }

    const assignedRole: UserRole = (role === 'officer' || role === 'admin') ? role : 'farmer';
    const newUserId = nextId(db.users);

    const newUser: User & { password_hash: string } = {
      id: newUserId,
      name,
      email: email.toLowerCase(),
      phone,
      password_hash: hashPassword(password),
      role: assignedRole,
      status: 'active',
      district: district || 'Ludhiana',
      state: state || 'Punjab',
      village: village || 'Rural Sector',
      created_at: new Date().toISOString(),
    };
    db.users.push(newUser);

    if (assignedRole === 'farmer') {
      db.farmers.push({
        id: nextId(db.farmers),
        user_id: newUserId,
        district: newUser.district!,
        state: newUser.state!,
        village: newUser.village!,
        land_area_total: Number(land_area) || 5.0,
        primary_soil_type: 'Alluvial Loam',
        water_source: 'Canal + Tube Well',
        aadhaar_number_masked: 'XXXX-XXXX-9901',
      });
    } else if (assignedRole === 'officer') {
      db.officers.push({
        id: nextId(db.officers),
        user_id: newUserId,
        department: department || 'Department of Agriculture & Farmers Welfare',
        designation: designation || 'Assistant Agricultural Officer',
        assigned_district: newUser.district!,
        office_contact: newUser.phone,
        specialization: 'Agronomy & Crop Protection',
        badge_number: `AGRI-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }

    persistDb();

    const token = generateToken(newUser.id);
    return ok({ success: true, message: 'Account registered successfully.', token, user: withoutPassword(newUser) });
  },

  forgotPassword: (email: string) => {
    if (!email) fail(400, 'Email is required.');
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return ok<{ success: boolean; message: string; recovery_token?: string }>({
        success: true,
        message: 'If an account exists with this email address, a password reset authorization link and OTP has been dispatched.',
      });
    }
    return ok<{ success: boolean; message: string; recovery_token?: string }>({
      success: true,
      message: `Password reset instructions sent to ${email}. Temporary recovery PIN: 849201.`,
      recovery_token: 'temp_pwd_reset_mock_valid_15m',
    });
  },

  getMe: () => {
    const current = requireAuth();
    const user = db.users.find((u) => u.id === current.id);
    if (!user) fail(404, 'User not found.');

    let profile: any = null;
    if (user!.role === 'farmer') profile = db.farmers.find((f) => f.user_id === user!.id) || null;
    else if (user!.role === 'officer') profile = db.officers.find((o) => o.user_id === user!.id) || null;

    return ok({ success: true, user: withoutPassword(user!), profile });
  },
};

// ==========================================
// 2. CROPS
// ==========================================

export const cropsApi = {
  getCrops: (params?: { status?: string; type?: string }) => {
    const current = requireAuth();
    let list = db.crops;
    if (current.role === 'farmer') list = list.filter((c) => c.farmer_id === current.id);
    if (params?.status) list = list.filter((c) => c.crop_status === params.status);
    if (params?.type) list = list.filter((c) => c.type === params.type);
    return ok({ success: true, count: list.length, crops: list });
  },

  addCrop: (cropData: Partial<Crop>) => {
    const current = requireAuth();
    const { name, type, sowing_date, expected_harvest_date, land_area, irrigation_type, crop_status, soil_type, estimated_yield_quintals, notes } = cropData;

    if (!name || !type || !sowing_date || !expected_harvest_date || !land_area || !irrigation_type) {
      fail(400, 'All mandatory crop fields must be provided.');
    }

    const newCrop: Crop = {
      id: nextId(db.crops),
      farmer_id: current.id,
      farmer_name: current.name,
      name: name!,
      type: type!,
      sowing_date: sowing_date!,
      expected_harvest_date: expected_harvest_date!,
      land_area: Number(land_area),
      irrigation_type: irrigation_type!,
      crop_status: crop_status || 'planted',
      soil_type: soil_type || 'Alluvial Loam',
      estimated_yield_quintals: estimated_yield_quintals ? Number(estimated_yield_quintals) : undefined,
      notes,
      created_at: new Date().toISOString(),
    };
    db.crops.push(newCrop);

    db.notifications.unshift({
      id: nextId(db.notifications),
      user_id: current.id,
      type: 'system',
      title: `Crop Added: ${newCrop.name}`,
      message: `Successfully logged ${newCrop.land_area} acres of ${newCrop.name}. Expected harvest date: ${newCrop.expected_harvest_date}.`,
      is_read: false,
      action_link: '/crops',
      created_at: new Date().toISOString(),
    });
    persistDb();

    return ok({ success: true, message: 'Crop entry created successfully.', crop: newCrop });
  },

  updateCrop: (id: number, cropData: Partial<Crop>) => {
    const current = requireAuth();
    const idx = db.crops.findIndex((c) => c.id === id);
    if (idx === -1) fail(404, 'Crop not found.');
    if (current.role === 'farmer' && db.crops[idx].farmer_id !== current.id) {
      fail(403, 'You cannot edit another farmer’s crop records.');
    }

    const updated: Crop = { ...db.crops[idx], ...cropData, id, farmer_id: db.crops[idx].farmer_id };
    db.crops[idx] = updated;
    persistDb();
    return ok({ success: true, message: 'Crop updated successfully.', crop: updated });
  },

  deleteCrop: (id: number) => {
    const current = requireAuth();
    const idx = db.crops.findIndex((c) => c.id === id);
    if (idx === -1) fail(404, 'Crop not found.');
    if (current.role === 'farmer' && db.crops[idx].farmer_id !== current.id) {
      fail(403, 'You are not authorized to delete this crop.');
    }
    db.crops.splice(idx, 1);
    persistDb();
    return ok({ success: true, message: 'Crop deleted successfully.' });
  },
};

// ==========================================
// 3. WEATHER
// ==========================================

export const weatherApi = {
  getWeather: (district?: string) =>
    ok({ success: true, weather: getWeatherForDistrict(district || 'Ludhiana') as WeatherData }),
};

// ==========================================
// 4. MARKET PRICES
// ==========================================

export const marketApi = {
  getPrices: (params?: { search?: string; district?: string }) => {
    let prices = db.marketPrices;
    if (params?.search) {
      const q = params.search.toLowerCase();
      prices = prices.filter((p) =>
        p.crop_name.toLowerCase().includes(q) ||
        p.variety.toLowerCase().includes(q) ||
        p.market_name.toLowerCase().includes(q));
    }
    if (params?.district && params.district !== 'All') {
      prices = prices.filter((p) => p.district.toLowerCase() === params.district!.toLowerCase());
    }
    return ok({ success: true, count: prices.length, prices });
  },

  getDistricts: () => {
    const districts = Array.from(new Set(db.marketPrices.map((p) => p.district)));
    return ok({ success: true, districts });
  },
};

// ==========================================
// 5. GOVERNMENT SCHEMES
// ==========================================

export const schemesApi = {
  getSchemes: (params?: { category?: string; sponsor?: string; search?: string }) => {
    let list = db.schemes;
    if (params?.category && params.category !== 'All') list = list.filter((s) => s.category === params.category);
    if (params?.sponsor && params.sponsor !== 'All') list = list.filter((s) => s.sponsor === params.sponsor);
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((s) =>
        s.title.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.sponsor && s.sponsor.toLowerCase().includes(q)));
    }
    return ok({ success: true, count: list.length, schemes: list });
  },

  createScheme: (schemeData: any) => {
    const current = requireAuth();
    requireRole(current, ['admin']);

    // The admin console form sends `name`/`ministry`/`eligibility` while the
    // public scheme model uses `title`/`sponsor`/`eligibility_criteria` -
    // accept either so a scheme created here works everywhere it's read.
    const title = schemeData.title || schemeData.name;
    const sponsor = schemeData.sponsor || schemeData.ministry || 'Central Government';
    const { category, description } = schemeData;

    if (!title || !category || !description) {
      fail(400, 'Title, category, and description are required.');
    }

    const eligibility_criteria = schemeData.eligibility_criteria || schemeData.eligibility || ['All registered landholder farmers'];
    const required_documents = schemeData.required_documents?.length ? schemeData.required_documents : ['Aadhaar card', 'Land passbook', 'Bank account details'];
    const benefits = schemeData.benefits ?? ['Direct financial assistance'];
    const is_active = schemeData.is_active ?? true;

    const newScheme: GovernmentScheme = {
      id: nextId(db.schemes),
      code: `SCHEME-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      name: title,
      category,
      description,
      sponsor,
      ministry: sponsor,
      subsidy_amount_or_percent: schemeData.subsidy_amount_or_percent || 'Up to 50% Subsidy',
      eligibility_criteria,
      eligibility: eligibility_criteria,
      benefits,
      application_guide: schemeData.application_guide || schemeData.application_process || ['Apply online with Aadhaar and land records'],
      important_dates: schemeData.important_dates || { start_date: '2026-01-01', end_date: '2026-12-31' },
      required_documents,
      status: is_active ? 'open' : 'closed',
      is_active,
    };

    db.schemes.unshift(newScheme);
    persistDb();
    return ok({ success: true, message: 'Government scheme published.', scheme: newScheme });
  },

  applyForScheme: (id: number, applicationData: any) => {
    const current = requireAuth();
    const scheme = db.schemes.find((s) => s.id === id);
    if (!scheme) fail(404, 'Scheme not found.');

    const { applicant_name, bank_account } = applicationData;
    if (!applicant_name || !bank_account) fail(400, 'Applicant name and bank account are required.');

    const referenceId = `DBT-${scheme!.code || scheme!.id}-${Math.floor(100000 + Math.random() * 900000)}`;

    db.notifications.unshift({
      id: nextId(db.notifications),
      user_id: current.id,
      type: 'scheme',
      title: `Application Submitted: ${scheme!.title}`,
      message: `Your beneficiary dossier for "${scheme!.title}" has been forwarded to the District Agriculture Officer for verification. Reference: ${referenceId}.`,
      is_read: false,
      action_link: '/schemes',
      created_at: new Date().toISOString(),
    });
    persistDb();

    return ok({ success: true, message: 'Scheme application submitted successfully.', reference_id: referenceId });
  },
};

// ==========================================
// 6. AGRICULTURAL ASSISTANCE
// ==========================================

export const assistanceApi = {
  getRequests: (params?: { status?: string; category?: string }) => {
    const current = requireAuth();
    let requests = db.assistanceRequests;
    if (current.role === 'farmer') {
      requests = requests.filter((r) => r.farmer_id === current.id);
    } else if (current.role === 'officer') {
      requests = requests.filter((r) => r.district === current.district || r.officer_id === current.id);
    }
    if (params?.status && params.status !== 'All') requests = requests.filter((r) => r.status === params.status);
    if (params?.category && params.category !== 'All') requests = requests.filter((r) => r.category === params.category);
    return ok({ success: true, count: requests.length, requests });
  },

  createRequest: (data: Partial<AssistanceRequest>) => {
    const current = requireAuth();
    const { crop_id, crop_name, title, category, description, photo_url, urgency } = data;
    if (!title || !category || !description) fail(400, 'Title, category, and problem description are required.');

    const newRequest: AssistanceRequest = {
      id: nextId(db.assistanceRequests, 101),
      farmer_id: current.id,
      farmer_name: current.name,
      farmer_phone: current.phone,
      district: current.district || 'Ludhiana',
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
      responses: [],
    };
    db.assistanceRequests.unshift(newRequest);

    const officersInDistrict = db.users.filter((u) => u.role === 'officer' && u.district === current.district);
    officersInDistrict.forEach((officer) => {
      db.notifications.unshift({
        id: nextId(db.notifications),
        user_id: officer.id,
        type: 'assistance',
        title: `New Assistance Request #${newRequest.id}`,
        message: `${current.name} reported ${category} in ${newRequest.crop_name} (${newRequest.urgency} urgency).`,
        is_read: false,
        action_link: '/assistance',
        created_at: new Date().toISOString(),
      });
    });
    persistDb();

    return ok({ success: true, message: 'Assistance ticket raised. Agriculture Officer has been notified.', request: newRequest });
  },

  updateStatus: (id: number, status: string, officer_name?: string) => {
    const current = requireAuth();
    requireRole(current, ['officer', 'admin']);

    const target = db.assistanceRequests.find((r) => r.id === id);
    if (!target) fail(404, 'Assistance request not found.');

    target!.status = status as AssistanceRequest['status'];
    target!.officer_id = current.id;
    target!.officer_name = officer_name || current.name;
    target!.updated_at = new Date().toISOString();

    db.notifications.unshift({
      id: nextId(db.notifications),
      user_id: target!.farmer_id,
      type: 'assistance',
      title: `Assistance Ticket #${target!.id} Status Updated`,
      message: `Your request has been marked as '${status}' by Officer ${target!.officer_name}.`,
      is_read: false,
      action_link: '/assistance',
      created_at: new Date().toISOString(),
    });
    persistDb();

    return ok({ success: true, message: `Request status updated to ${status}.`, request: target! });
  },

  addResponse: (id: number, responseData: {
    message: string;
    recommended_actions?: string[];
    chemical_biological_advice?: string;
    chemical_recommendation?: string;
    status?: string;
  }) => {
    const current = requireAuth();
    const { message, recommended_actions } = responseData;
    const chemical_biological_advice = responseData.chemical_recommendation || responseData.chemical_biological_advice;
    if (!message) fail(400, 'Response message cannot be empty.');

    const target = db.assistanceRequests.find((r) => r.id === id);
    if (!target) fail(404, 'Assistance request not found.');

    const newResponse: AssistanceResponse = {
      id: (target!.responses?.length || 0) + 1,
      request_id: id,
      responder_id: current.id,
      responder_name: current.name,
      responder_role: current.role,
      message,
      recommended_actions: recommended_actions || [],
      chemical_biological_advice: chemical_biological_advice || '',
      created_at: new Date().toISOString(),
    };
    if (!target!.responses) target!.responses = [];
    target!.responses.push(newResponse);

    if (current.role === 'officer' || current.role === 'admin') {
      if (responseData.status) {
        // Officer explicitly chose a new lifecycle status alongside their reply.
        target!.status = responseData.status as AssistanceRequest['status'];
      } else if (target!.status === 'Pending') {
        target!.status = 'In Progress';
      }
      target!.officer_id = current.id;
      target!.officer_name = current.name;
    }
    target!.updated_at = new Date().toISOString();

    const notifyUserId = current.role === 'farmer' ? (target!.officer_id || 2) : target!.farmer_id;
    db.notifications.unshift({
      id: nextId(db.notifications),
      user_id: notifyUserId,
      type: 'assistance',
      title: `New reply on Request #${target!.id}`,
      message: `${current.name} posted an update: "${message.slice(0, 60)}..."`,
      is_read: false,
      action_link: '/assistance',
      created_at: new Date().toISOString(),
    });
    persistDb();

    return ok({ success: true, message: 'Response posted.', response: newResponse, request: target! });
  },
};

// ==========================================
// 7. KNOWLEDGE CENTER
// ==========================================

export const knowledgeApi = {
  getArticles: (params?: { category?: string; season?: string; search?: string }) => {
    let articles = db.knowledgeArticles;
    if (params?.category && params.category !== 'All') articles = articles.filter((a) => a.category === params.category);
    if (params?.season && params.season !== 'All') articles = articles.filter((a) => a.season === params.season || a.season === 'All Seasons');
    if (params?.search) {
      const q = params.search.toLowerCase();
      articles = articles.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)));
    }
    return ok({ success: true, count: articles.length, articles });
  },
};

// ==========================================
// 8. NOTIFICATIONS
// ==========================================

export const notificationsApi = {
  getNotifications: () => {
    const current = requireAuth();
    const list = db.notifications.filter((n) => n.user_id === current.id);
    return ok({ success: true, notifications: list });
  },

  markAsRead: (id: number) => {
    const current = requireAuth();
    const notif = db.notifications.find((n) => n.id === id && n.user_id === current.id);
    if (notif) {
      notif.is_read = true;
      persistDb();
    }
    return ok({ success: true });
  },

  markAllAsRead: () => {
    const current = requireAuth();
    db.notifications.forEach((n) => {
      if (n.user_id === current.id) n.is_read = true;
    });
    persistDb();
    return ok({ success: true, message: 'All notifications marked as read.' });
  },
};

// ==========================================
// 9. ADMIN
// ==========================================

function computeAdminAnalytics() {
  const totalFarmers = db.users.filter((u) => u.role === 'farmer').length;
  const activeFarmers = db.users.filter((u) => u.role === 'farmer' && u.status === 'active').length;
  const totalOfficers = db.users.filter((u) => u.role === 'officer').length;
  const totalCrops = db.crops.length;
  const totalAcreage = db.crops.reduce((sum, c) => sum + c.land_area, 0);

  const pendingRequests = db.assistanceRequests.filter((r) => r.status === 'Pending').length;
  const inProgressRequests = db.assistanceRequests.filter((r) => r.status === 'In Progress').length;
  const resolvedRequests = db.assistanceRequests.filter((r) => r.status === 'Resolved' || r.status === 'Closed').length;
  const totalRequests = db.assistanceRequests.length;
  const resolutionRatePercent = totalRequests > 0 ? Math.round((resolvedRequests / totalRequests) * 100) : 0;

  const cropsByStatusMap: Record<string, number> = {};
  db.crops.forEach((c) => { cropsByStatusMap[c.crop_status] = (cropsByStatusMap[c.crop_status] || 0) + 1; });
  const crops_by_status = Object.keys(cropsByStatusMap).map((status) => ({ status, count: cropsByStatusMap[status] }));

  const requestsByCategoryMap: Record<string, number> = {};
  db.assistanceRequests.forEach((r) => { requestsByCategoryMap[r.category] = (requestsByCategoryMap[r.category] || 0) + 1; });
  const requests_by_category = Object.keys(requestsByCategoryMap).map((category) => ({ category, count: requestsByCategoryMap[category] }));

  const cropsByTypeMap: Record<string, number> = {};
  db.crops.forEach((c) => { cropsByTypeMap[c.type] = (cropsByTypeMap[c.type] || 0) + 1; });
  const crops_by_type = Object.keys(cropsByTypeMap).map((type) => ({ type, count: cropsByTypeMap[type] }));

  const analytics: AdminAnalytics = {
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
    crops_by_type,
  };

  // AdminPanelPage reads this alternate `stats` shape directly.
  const stats = {
    total_users: db.users.length,
    active_farmers: activeFarmers,
    total_officers: totalOfficers,
    total_crops: totalCrops,
    total_requests: totalRequests,
    pending_requests: pendingRequests,
    resolved_requests: resolvedRequests,
    resolution_rate: resolutionRatePercent,
    crop_breakdown: crops_by_type,
  };

  return { analytics, stats };
}

export const adminApi = {
  getAnalytics: () => {
    const current = requireAuth();
    requireRole(current, ['admin']);
    const { analytics, stats } = computeAdminAnalytics();
    return ok({ success: true, analytics, stats });
  },

  getStats: () => {
    const current = requireAuth();
    requireRole(current, ['admin']);
    const { analytics, stats } = computeAdminAnalytics();
    return ok({ success: true, stats, analytics });
  },

  getUsers: () => {
    const current = requireAuth();
    requireRole(current, ['admin']);
    const safeUsers = db.users.map((u) => ({ ...withoutPassword(u), is_active: u.status === 'active' }));
    return ok({ success: true, users: safeUsers as User[] });
  },

  updateUserStatus: (id: number, status: string | boolean) => {
    const current = requireAuth();
    requireRole(current, ['admin']);
    const target = db.users.find((u) => u.id === id);
    if (!target) fail(404, 'User not found.');

    const resolvedStatus = typeof status === 'boolean' ? (status ? 'active' : 'suspended') : status;
    target!.status = resolvedStatus as User['status'];
    persistDb();
    return ok({ success: true, message: `User status changed to ${resolvedStatus}.` });
  },

  broadcastNotification: (data: { title: string; message: string; type?: string; target_role?: string }) => {
    const current = requireAuth();
    requireRole(current, ['admin']);
    const { title, message, type, target_role } = data;
    if (!title || !message) fail(400, 'Title and message required.');

    let recipients = db.users;
    if (target_role === 'farmers') recipients = recipients.filter((u) => u.role === 'farmer');
    else if (target_role === 'officers') recipients = recipients.filter((u) => u.role === 'officer');

    recipients.forEach((u) => {
      db.notifications.unshift({
        id: nextId(db.notifications),
        user_id: u.id,
        type: (type as AppNotification['type']) || 'system',
        title: `[Announcement] ${title}`,
        message,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    });
    persistDb();

    return ok({ success: true, message: `Broadcast alert sent to ${recipients.length} registered users.` });
  },

  sendBroadcast: (data: { title: string; message: string; type?: string; target_role?: string }) => adminApi.broadcastNotification(data),
};
