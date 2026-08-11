# Rajputmatches-gaurav_dev_new Flow-2

## Overview
Yeh file user journey aur app flow ko ek simple sequence mein batati hai.

## 1. App startup
- `src/App.js` app ko render karta hai.
- `SiteSettingsProvider` site settings aur CMS data globally load karta hai.
- `AuthProvider` authentication state maintain karta hai.
- `ToastContainer` notifications dikhata hai.
- `FloatingSocial` social links `GET /auth/social-links` se fetch karta hai.
- `ReportFeedbackWidget` admin/feedback endpoints se related data use karta hai.
- Root routes define hoti hain: public pages, auth pages, protected pages.
- `BottomNav` app ke niche navigation dikhata hai.

## 2. Authentication flow

### Registration
- `src/features/Register.jsx` user input leta hai.
- `AuthContext.register()` call karta hai `authApi.register()`.
- Backend `POST /auth/register` request se user create hota hai.
- Registration successful hone par:
  - user ko success toast milta hai
  - token save nahi hota
  - user manually login page par ja sakta hai.

### Login
- `src/features/login.jsx` mein credentials enter karte hain.
- `AuthContext.login()` `authApi.login()` call karta hai.
- Backend `POST /auth/login` se response contain karta hai auth token.
- agar token milta hai:
  - `localStorage.authToken` mein store hota hai
  - `AuthProvider` `isAuthenticated` true set karta hai
  - `apiClient` har request ke saath `Authorization: Bearer <token>` bhejta hai
  - user `/profile` ya protected page par redirect ho sakta hai.

### Logout
- `AuthContext.logout()` `authApi.logout()` call karta hai.
- token remove hota hai aur `isAuthenticated` false ban jata hai.
- agar backend se 401 response aaye:
  - response interceptor token remove karta hai
  - `unauthorized-logout` event dispatch hota hai
  - `AuthProvider` user ko logout karta hai
  - user login page par chala jata hai.

## 3. Protected route flow
- `src/component/Layout/ProtectedRoute.jsx` check karta hai `isAuthenticated`.
- agar user authenticate nahi hai:
  - redirect `/login` par hota hai.
- protected routes:
  - `/dashboard`
  - `/profile`
  - `/search`
  - `/message`
  - `/settings`
  - `/profile/view/:profileId`
  - `/search/view/:profileId`
  - `/search/view/images/:profileId`
  - `/profile/view/images/:profileId`

## 4. User data and profile flow
- `AuthProvider` login ke baad user data load karta hai.
- `fetchByRoute('user')` `GET /auth/user` call karta hai.
- user profile previews aur header data update hota hai.
- `fetchByRoute('profile')` `GET /auth/profile` se current user ke profile details milte hain.

## 5. Dashboard flow
- `src/component/Layout/Dashboard.jsx` protected route par render hota hai.
- Dashboard bohot saare legacy route fetches karti hai:
  - `profile/myrequests`
  - `profile/viewed`
  - `profile/visited`
  - `profile/show-shortlisted`
  - `profile/photorequests`
  - `files`
  - `profile/contactrequests`
- `fetchByRoute(route)` map karta hai legacy strings ko actual API endpoints se.
- user cards, stats, aur recent activity display hota hai.

## 6. Search and profile view flow
- `/search` protected route pe `SearchPage` render hota hai.
- search filters apply karne par `profileApi.search(filters)` call hoti hai.
- backend `PUT /auth/getprofiles` se matching profiles milte hain.
- profile list cards user ko search results dikhate hain.
- `ViewPage` open karne ke liye `navigate('view/${profileId}')` use hota hai.
- profile detail page `ViewPage` protected route hai.
- `/view/images/:profileId` se profile images ke liye `ViewImages` show hota hai.

## 7. Profile interactions
- `profileApi.recordView(profileId)` `PUT /auth/profile/view` se profile view record karta hai.
- `profileApi.addShortlist(profileId)` `PUT /auth/profile/shortlist` se shortlist add hoti hai.
- `profileApi.removeShortlist(profileId)` `PUT /auth/profile/shortlisted/delete` se remove hoti hai.
- `profileApi.toggleBookmark(profileId)` `PUT /auth/profile/shortlisted/edit` se bookmark toggle hota hai.

## 8. Chat flow
- `/message` protected route pe `ChatApp` render hota hai.
- chat list load karne ke liye `chatApi.listChats()` call hoti hai.
- pending chat status ke liye `chatApi.listPending()` use hoti hai.
- messages load karne ke liye `chatApi.getMessages(chatId)` `PUT /auth/message` call karta hai.
- send message buttons `chatApi.sendMessage(chatId, message)` se text bhejte hain.
- file message send karne ke liye `chatApi.sendFileMessage(chatId, file, message)`, multipart form upload.
- chat participant validate karne ke liye `chatApi.validateParticipant(profileId)` use hota hai.
- chat delete actions `chatApi.deleteMessages` / `chatApi.deleteSingleMessage` se hoti hain.

## 9. Media and file upload flow
- profile file management pages use `mediaApi`.
- photos upload: `POST /auth/upload-files`
- documents upload: `POST /auth/upload-documents`
- avatar set: `PUT /auth/set-profile-image`
- delete file: `PUT /auth/delete-image`
- privacy update: `PUT /auth/update-privacy`

## 10. Public/CMS page flow
- home page aur layout components `publicApi.getHomeCMS()` se homepage content load karte hain.
- about page `publicApi.getAbout()` se content fetch karti hai.
- stories page `publicApi.getStoriesCMS()` se stories load hoti hain.
- contact page `publicApi.getContactCMS()` aur `publicApi.submitContact()` contact request bhejti hai.
- site settings `publicApi.getSiteSettings()` load karta hai global settings ke liye.

## 11. Email verification and password recovery flow
- `Verification` page `authApi.sendVerification()` call karti hai.
- `EmailOtpVerify` page `authApi.verifyOtp()` se OTP verify hota hai.
- `VerifyEmail` page `authApi.verifyEmail(token)` se email token verify hota hai.
- `ForgetPassword` page `authApi.forgotPassword()` password reset request bhejta hai.
- `NewPassword` page `authApi.resetPassword()` se naya password set hota hai.

## 12. Navigation flow
- home page se login/register/contact/story pages available hain.
- login ke baad protected routes access hoti hain.
- dashboard buttons search aur message par navigate karti hain.
- profile cards se profile detail and image viewers open hote hain.
- `ProtectedRoute` ensures unauthenticated users login page par redirect ho jate hain.

## 13. Important flow notes
- `AuthProvider` token state aur user data handle karta hai.
- `apiClient` automatically auth header attach karta hai.
- 401 response on any API request triggers global logout.
- `routeAdapter` backward compatibility ke liye old route strings ko map karta hai.
- Search / profile view / chat / dashboard sab `protected` routes hain.

## 14. Summary
Yeh `flow-2.md` app ka user journey aur request flow explain karti hai, page-by-page:
1. app load
2. register/login
3. protected routes
4. dashboard
5. search/view
6. chat
7. media uploads
8. public content
9. email/password recovery
10. navigation

Isse samajh aata hai ki app ka frontend kaise React routes, `AuthContext`, aur API wrappers se backend ke saath connect karta hai.