# Rajputmatches-gaurav_dev_new Application Flow and API Documentation

## Overview
Yeh file `rajputmatches-gaurav_dev_new` React app ka flow explain karti hai aur har API kaise kaam kar rahi hai bataati hai.

### Main structure
- `src/api/client.js` : central API client, axios-based, `BASE_URL` set karta hai, token header attach karta hai, aur 401 logout event handle karta hai.
- `src/api/*.api.js` : endpoint wrappers.
- `src/api/routeAdapter.js` : legacy route strings ko new API endpoints pe map karta hai.
- `src/component/Layout/AuthContext.jsx` : authentication aur user data fetch/update ka core flow.
- `src/App.js` : routes aur global providers (`AuthProvider`, `SiteSettingsProvider`) define karta hai.

---

## 1. API Client (`src/api/client.js`)

### Base URL
- `BASE_URL` dynamic hota hai.
- `process.env.REACT_APP_BASE_URL` ya `process.env.VITE_APP_BASE_URL` use karta hai agar defined ho.
- `localhost` par default `http://localhost:5000` banata hai.
- Final base path: `BASE_URL + /api/v1`.

### Axios configuration
- `withCredentials: true`
- Request interceptor: agar `localStorage.authToken` ho to `Authorization: Bearer <token>` header attach kare.
- Response interceptor: agar 401 aaye to token remove kare aur `unauthorized-logout` event dispatch kare.

### Helpers
- `extractData(response)` : `{ success, message, data }` response se `data` nikalta hai.
- `extractMessage(response)` : response message nikalta hai.
- `getTokenFromResponse(response)` : login/register response se token nikalta hai.
- `isSuccessResponse(response)` : response status check karta hai.

---

## 2. Authentication APIs (`src/api/auth.api.js`)

Yeh endpoints user auth flow ke liye hain.

### Endpoints
- `authApi.register(body)`
  - POST `/auth/register`
  - registration data bhejta hai.
- `authApi.login(body)`
  - POST `/auth/login`
  - login credentials bhejta hai.
- `authApi.logout()`
  - POST `/auth/logout`
  - server se logout karta hai.
- `authApi.forgotPassword(body)`
  - POST `/auth/forgot-password`
  - password reset request bhejta hai.
- `authApi.resetPassword(body)`
  - POST `/auth/reset-password`
  - naya password save karta hai.
- `authApi.sendVerification(body)`
  - POST `/auth/email/send-verification`
  - email verification OTP bhejta hai.
- `authApi.verifyOtp(body)`
  - POST `/auth/email/verify-otp`
  - OTP verify karta hai.
- `authApi.verifyEmail(token)`
  - GET `/auth/email/verify?token=...`
  - email token se email verify karta hai.

### App flow
- `AuthContext.register()` user ko register karta hai.
- Registration successful hone pe token save nahi hota; user ko manually login karna hota hai.
- `AuthContext.login()` login karke token store karta hai aur `isAuthenticated` true karta hai.
- `AuthContext.logout()` server ko logout request bhejta hai aur client-side token clear karta hai.
- 401 response ka effect: token clear aur app me global logout event.

---

## 3. User Profile APIs (`src/api/me.api.js`)

Logged-in user ke apne profile sections ke liye.

### Endpoints
- `meApi.getProfile()`
  - GET `/me`
  - logged-in user ka basic profile leta hai.
- `meApi.updateBasic(fields)`
  - PATCH `/me/basic`
  - basic profile fields update karta hai.
- `meApi.getProfessional()`
  - GET `/me/professional`
- `meApi.updateProfessional(fields)`
  - PATCH `/me/professional`
- `meApi.getHoroscope()`
  - GET `/me/horoscope`
- `meApi.updateHoroscope(fields)`
  - PATCH `/me/horoscope`
- `meApi.getFamily()`
  - GET `/me/family`
- `meApi.updateFamily(fields)`
  - PATCH `/me/family`
- `meApi.getExtendedFamily()`
  - GET `/me/extended-family`
- `meApi.updateExtendedFamily(fields)`
  - PATCH `/me/extended-family`

### App flow
- Profile edit pages aur forms me yeh APIs use hoti hain.
- User settings / details update karne par patch requests bheje jaate hain.

---

## 4. Public & CMS APIs (`src/api/public.api.js`)

Landing page aur public content ke liye.

### Endpoints
- `publicApi.submitContact(formData)`
  - POST `/public/contact`
  - contact form submit karta hai.
- `publicApi.getPage(slug)`
  - GET `/public/pages/${slug}`
  - CMS page content lata hai.
- `publicApi.getRecentProfiles()`
  - GET `/auth/public/recent-profiles`
  - latest profiles fetch karta hai.
- `publicApi.getAbout()`
  - GET `/auth/about`
- `publicApi.getHomeCMS()`
  - GET `/auth/home-cms`
- `publicApi.getContactCMS()`
  - GET `/auth/contact-cms`
- `publicApi.getStoriesCMS()`
  - GET `/auth/stories-cms`
- `publicApi.getSiteSettings()`
  - GET `/auth/site-settings`

### App flow
- Home page aur public layout components CMS content fetch karte hain.
- `SiteSettingsContext` app ke header/footer ya styling ke liye site settings leta hai.
- Contact page contact form submit karta hai.

---

## 5. Profile Search and Match APIs (`src/api/profile.api.js`)

Search aur profile view features ke liye.

### Endpoints
- `profileApi.search(filters)`
  - PUT `/auth/getprofiles`
  - filters bhej kar profiles search karta hai.
- `profileApi.getSummary(profileId)`
  - GET `/auth/profile/view/${profileId}`
- `profileApi.getDetails(profileId)`
  - GET `/auth/profile/view/${profileId}`
- `profileApi.getPhotos(profileId)`
  - GET `/auth/profile/view/images/${profileId}`
- `profileApi.recordView(profileId)`
  - PUT `/auth/profile/view`
  - profile view record karta hai.
- `profileApi.getShortlists()`
  - GET `/auth/profile/show-shortlisted`
- `profileApi.getVisited()`
  - GET `/auth/profile/viewed`
- `profileApi.getVisitors()`
  - GET `/auth/profile/visited`
- `profileApi.addShortlist(profileId)`
  - PUT `/auth/profile/shortlist`
- `profileApi.removeShortlist(profileId)`
  - PUT `/auth/profile/shortlisted/delete`
- `profileApi.toggleBookmark(profileId)`
  - PUT `/auth/profile/shortlisted/edit`

### App flow
- Search page filter apply karte hai aur matching profiles laati hai.
- Profile view open karne se view record ho sakta hai.
- Shortlist/bookmark actions yaha se hote hain.

---

## 6. Media / File APIs (`src/api/media.api.js`)

User photo/document upload aur profile picture ke liye.

### Endpoints
- `mediaApi.getAlbum()`
  - GET `/auth/files`
  - user ke uploaded files / photos lata hai.
- `mediaApi.getAvatar()`
  - GET `/auth/profile`
  - current user avatar profile details lata hai.
- `mediaApi.uploadPhotos(formData, config)`
  - POST `/auth/upload-files`
  - photos upload karta hai.
- `mediaApi.uploadDocuments(formData, config)`
  - POST `/auth/upload-documents`
  - documents upload karta hai.
- `mediaApi.setAvatar(photoId)`
  - PUT `/auth/set-profile-image`
  - selected photo ko profile avatar banata hai.
- `mediaApi.deleteFile(fileId)`
  - PUT `/auth/delete-image`
  - file/photo delete karta hai.
- `mediaApi.updatePrivacy(isPrivate)`
  - PUT `/auth/update-privacy`
  - privacy setting update karta hai.

### App flow
- Document/upload pages me files send ki jaati hain.
- User avatar set karne aur privacy change karne ke liye.

---

## 7. Chat APIs (`src/api/chat.api.js`)

Messaging aur chat status ke liye.

### Endpoints
- `chatApi.listChats()`
  - GET `/auth/message/chat`
  - existing chats list lata hai.
- `chatApi.listPending()`
  - GET `/auth/chat/status`
  - pending chat requests/status lata hai.
- `chatApi.getMessages(chatId)`
  - PUT `/auth/message`
  - specific chat ke messages fetch karta hai.
- `chatApi.sendMessage(chatId, message)`
  - POST `/auth/message/send`
  - normal text message bhejta hai.
- `chatApi.sendFileMessage(chatId, file, message)`
  - POST `/auth/message/send-file`
  - file + optional message bhejta hai.
- `chatApi.deleteMessages(chatId, deleteForAll)`
  - POST `/auth/delete/message`
  - chat ke messages delete karta hai.
- `chatApi.deleteSingleMessage(messageId, deleteForAll)`
  - POST `/auth/delete/single-message`
  - single message delete karta hai.
- `chatApi.updateStatus(chatId, status)`
  - PUT `/auth/chat/status/update`
  - chat status update karta hai.
- `chatApi.validateParticipant(profileId)`
  - PUT `/auth/profile/message`
  - chat participant validation ke liye `user2` bhejta hai.

### App flow
- `ChatApp.jsx` chat list aur message view load karta hai.
- `SearchPage` ya profile screen se `validateParticipant` call karke chat permission ensure karte hain.
- Send message aur send file actions yaha handle hote hain.

---

## 8. Connection Request APIs (`src/api/connectionRequest.api.js`)

Connection request / request management ke liye.

### Endpoints
- `connectionRequestApi.list()`
  - GET `/connection-requests`
  - current requests list lata hai.
- `connectionRequestApi.send(profileId)`
  - POST `/connection-requests`
  - naye connection request bhejta hai.
- `connectionRequestApi.withdraw(profileId)`
  - DELETE `/connection-requests/sent`
  - sent request withdraw karta hai.
- `connectionRequestApi.accept(profileId)`
  - POST `/connection-requests/accept`
  - request accept karta hai.
- `connectionRequestApi.reject(profileId)`
  - POST `/connection-requests/reject`
  - request reject karta hai.
- `connectionRequestApi.removeSent(profileId)`
  - DELETE `/connection-requests/sent/remove`
  - sent request list se remove karta hai.
- `connectionRequestApi.removeReceived(profileId)`
  - DELETE `/connection-requests/received/remove`
  - received request list se remove karta hai.

### App flow
- Requests dashboard, incoming/outgoing request management yaha se chalta hai.

---

## 9. Legacy Route Adapter (`src/api/routeAdapter.js`)

`AuthContext`, `Dashboard`, `Sidebar`, aur kuch components `fetchByRoute()` / `updateByRoute()` use karte hain.

### `fetchByRoute(route)`
- route strings ko old-style route names pe map karta hai.
- example: `profile/show-shortlisted` -> GET `/auth/profile/show-shortlisted`
- example: `profile/view/${profileId}` -> GET `/auth/profile/view/${profileId}`
- example: `profile/view/images/${profileId}` -> GET `/auth/profile/view/images/${profileId}`
- non-legacy routes le leta hai GET `/${route}` se.

### `updateByRoute(route, data)`
- route strings ko write endpoints pe map karta hai.
- example: `update-profile` -> PUT `/auth/update-profile`
- example: `set-profile-image` -> PUT `/auth/set-profile-image`
- example: `profile/message` -> PUT `/auth/profile/message`
- example: `chat/status/update` -> PUT `/chat/status`
- unknown routes phir bhi PUT `/${route}` se bhej deta hai.

### App flow
- `AuthContext.fetchUserData()` aur `AuthContext.updateData()` old route names se bhi kaam karte hain.
- `Dashboard` aur `Sidebar` counters / lists refresh karne ke liye legacy routes use karte hain.

---

## 10. App Routing and Providers (`src/App.js`)

### Providers
- `SiteSettingsProvider` : public site settings aur CMS data global state me store karta hai.
- `AuthProvider` : authentication state, token handling, login/register/logout logic, aur user data loading manage karta hai.

### Public routes
- `/`, `/home` : `Home`
- `/login` : `Login`
- `/signup` : `Register`
- `/forgot-password` : `ForgotPassword`
- `/set-new-password`, `/reset-password` : `NewPassword`
- `/verify-email` : `VerifyEmail`
- `/auth/emailverification` : `Verification`
- `/auth/otp-verify` : `EmailOtpVerify`
- `/about`, `/stories`, `/contact`, `/contact-us`, `/how-to-use`, `/privacy-policy`, `/terms-of-use` : respective public content pages.

### Protected routes
- `/dashboard` : `Dashboard`
- `/profile` / profile subpages : user profile management components.
- `/message` : `ChatApp`
- `/view/profile/:id` : profile detail / view page

### Other app behavior
- `FloatingSocial` component `/auth/social-links` se social links load karta hai.
- `ReportFeedbackWidget` admin feedback endpoint se kaam karta hai.
- `ScrollToTop` har route change par page top pe le aata hai.

---

## 11. How token / auth flow works

- Login se server token return karta hai.
- `AuthContext.login()` token `localStorage.authToken` me save karta hai.
- `client.js` request interceptor automatically `Authorization` header lagata hai.
- 401 response pe token clear ho jata hai aur app logout event fire hota hai.

---

## 12. Key components using APIs

- `src/component/Layout/Banner.jsx` : `publicApi.getHomeCMS()`
- `src/component/Layout/ContactUs.jsx` : `publicApi.getContactCMS()` aur `publicApi.submitContact()`
- `src/component/Layout/RecentAddedPage.jsx` : `publicApi.getRecentProfiles()`
- `src/component/Layout/Stories.jsx` : `publicApi.getStoriesCMS()`
- `src/component/Layout/Navbar.jsx` : `chatApi.listChats()`
- `src/component/Layout/ChatApp.jsx` : chat endpoints
- `src/component/Profile/Forms/DocumentForm.jsx` : `mediaApi.uploadPhotos()`, `mediaApi.uploadDocuments()`, `mediaApi.deleteFile()`, `mediaApi.setAvatar()`
- `src/component/Profile/ProfileComp/Settings.jsx` : `apiClient.post("/auth/reset-password")`
- `src/component/Profile/ProfileComp/Sidebar.jsx` : `fetchByRoute()` legacy data loads

---

## 13. Summary

Yeh app frontend hai jo `api/v1` ke endpoints se interact karta hai. Authentication, public CMS, profile search, chat, media uploads, aur connection requests sab major flows hain. `AuthContext` aur `routeAdapter` app state aur legacy route compatibility ko manage karte hain.
