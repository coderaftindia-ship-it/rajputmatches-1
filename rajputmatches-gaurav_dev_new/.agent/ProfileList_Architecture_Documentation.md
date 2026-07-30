# ProfileList Folder - Complete Architecture Documentation

## 📁 Folder Overview
**Location**: `src/component/Profile/ProfileList`

This folder manages all profile listing features in the matrimonial application. It handles different types of profile interactions: interests, photo requests, shortlisted profiles, and viewed profiles.

---

## 🗂️ File Structure

```
ProfileList/
├── MyInterest.jsx              # Main page for sent/received interest requests
├── MyInterestCard.jsx          # Card component for interest requests
├── PhotoRequest.jsx            # Main page for photo requests
├── RequestCard.jsx             # Reusable card component for various request types
├── ShortlistedProfile.jsx      # Page showing shortlisted profiles
├── ViewedProfile.jsx           # Page showing profiles user has viewed
├── PeopleVisited.jsx           # Page showing who visited user's profile
├── ProfileCard.jsx             # Basic profile card component
├── ProfileBoxCard.jsx          # Box-style profile card component
├── RequestCard.module.css      # Styles for request cards
└── ShortListedProfile.css      # Styles for shortlisted profiles
```

---

## 🎯 Core Components Explained

### 1. **RequestCard.jsx** - The Reusable Card Component

**Purpose**: A flexible, reusable component that displays profile information with dynamic action buttons based on status.

#### Key Features:
- **Profile Display**: Shows matrimonial ID, age, location, education, occupation, class, clan
- **Dynamic Actions**: Buttons change based on profile status (pending/accepted/rejected/new)
- **Status-based UI**: Different button configurations for different tabs (requestSent vs requestReceived)

#### Props:
```javascript
{
  profile: Object,              // Profile data
  status: String,               // "pending" | "accepted" | "rejected" | "new"
  handlecheck: Function,        // Callback for handling checks
  activeTab: String,            // "requestSent" | "requestReceived"
  ProfileImagerender: Component,// Custom image renderer component
  fetchData: Function          // Refresh data callback
}
```

#### Action Button Logic:
The component has **TWO** button configurations based on `activeTab`:

**For "requestReceived" tab:**
- **Pending**: Delete, View, Reminder, Message
- **Rejected**: View only
- **Accepted**: View, Message
- **New**: View, Shortlist, Send Request

**For "requestSent" tab:**
- **Pending**: Delete, View, Reminder, Message
- **Rejected**: View only
- **Accepted**: View, Message
- **New**: View, Shortlist, Send Request

#### Sub-components:
1. **ActionButtons**: Renders dynamic buttons based on status
2. **StatusTag**: Colored badge showing request status
   - Pending: Orange (#f8a35b)
   - Rejected: Red (#ff4d4d)
   - Accepted: Green (#4caf50)

---

### 2. **MyInterest.jsx** - Interest Requests Manager

**Purpose**: Main page for managing matrimonial interest requests (sent and received).

#### Key Features:
- **Dual Tabs**: Switch between "Request Sent" and "Request Received"
- **Filtering**: Filter by status (all/pending/accepted/rejected)
- **Sorting**: Sort by age or height (ascending/descending)
- **Pagination**: 4 profiles per page

#### State Management:
```javascript
{
  activeTab: "requestSent" | "requestReceived",
  profiles: Array,              // Current displayed profiles
  data: {
    reqSent: Array,            // All sent requests
    reqReceived: Array         // All received requests
  },
  sortCriteria: String,         // "age" | "height"
  sortDirection: Object,        // { criteria, direction }
  statusFilter: String,         // "all" | "pending" | "accepted" | "rejected"
  currentPage: Number,
  refreshKey: Number           // Triggers re-fetch when incremented
}
```

#### API Endpoint:
- **Route**: `profile/myrequests`
- **Returns**: `{ reqSent: [], reqReceived: [] }`

#### Custom Image Component:
`RequestImageContainer` - Handles image display with action buttons:
- **No Photos**: Shows placeholder with "Withdraw Request" (sent) or "Accept/Reject" (received)
- **Has Photos**: Shows profile photos with photo count badge

---

### 3. **MyInterestCard.jsx** - Interest Card Component

**Purpose**: Similar to RequestCard but specifically for interest requests with different action routes.

#### Key Differences from RequestCard:
- Uses different API routes for actions:
  - `profile/req/delete` for deletion
  - `profile/reqsent/reject` for rejection
  - `profile/reqsent/accept` for acceptance
- Has Accept/Reject buttons for received requests in pending status

---

### 4. **PhotoRequest.jsx** - Photo Request Manager

**Purpose**: Manages photo access requests between users.

#### Key Features:
- **Dual Tabs**: "Request Sent" vs "Request Received"
- **Filtering & Sorting**: Same as MyInterest
- **Pagination**: 4 profiles per page

#### State Management:
```javascript
{
  activeTab: "requestSent" | "requestReceived",
  data: {
    photoReqSent: Array,
    photoReqReceived: Array
  },
  profiles: Array,
  sortCriteria: String,
  sortDirection: Object,
  statusFilter: String,
  currentPage: Number,
  refreshKey: Number
}
```

#### API Endpoint:
- **Route**: `profile/photorequests`
- **Returns**: `{ photoReqSent: [], photoReqReceived: [] }`

#### Photo Request Actions:
- **Sent Tab**: "Withdraw Request" button
- **Received Tab**: "Accept" and "Reject" buttons

---

### 5. **ShortlistedProfile.jsx** - Shortlisted Profiles

**Purpose**: Display and manage profiles the user has shortlisted.

#### Key Features:
- **Sorting**: By age or height
- **Actions**: Delete from shortlist, Toggle bookmark
- **Simple Layout**: No tabs, just a single list

#### State Management:
```javascript
{
  profiles: Array,              // Shortlisted profiles
  ageSortOrder: String,         // "asc" | "desc" | ""
  heightSortOrder: String,      // "asc" | "desc" | ""
  loading: Boolean,
  error: String
}
```

#### API Endpoints:
- **Fetch**: `profile/show-shortlisted`
- **Delete**: `profile/shortlisted/delete`
- **Edit**: `profile/shortlisted/edit`

---

### 6. **ViewedProfile.jsx** - Viewed Profiles History

**Purpose**: Shows profiles that the user has viewed.

#### Key Features:
- **Sorting**: By age or height (toggle ascending/descending)
- **Pagination**: 4 profiles per page
- **Photo Request**: Can send photo requests from viewed profiles

#### State Management:
```javascript
{
  profiles: Array,              // Viewed profiles
  sortCriteria: String,         // "age" | "height"
  sortDirection: String,        // "asc" | "desc"
  currentPage: Number,
  loading: Boolean
}
```

#### API Endpoint:
- **Route**: `profile/viewed`
- **Returns**: `{ visitedAt: [] }`

---

## 🔄 Common Patterns

### 1. **Data Fetching Pattern**
All components follow this pattern:
```javascript
const fetchData = async () => {
  try {
    setLoading(true);
    const route = "profile/[endpoint]";
    const data = await fetchUserData(route);
    setProfiles(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, [refreshKey]);
```

### 2. **Pagination Pattern**
```javascript
const profilesPerPage = 4;
const totalPages = Math.ceil(profiles.length / profilesPerPage);

const getProfilesForCurrentPage = () => {
  const startIdx = (currentPage - 1) * profilesPerPage;
  return profiles.slice(startIdx, startIdx + profilesPerPage);
};
```

### 3. **Sorting Pattern**
```javascript
const sortProfiles = (criteria) => {
  const sorted = [...profiles].sort((a, b) => {
    if (criteria === "age") {
      return direction === "asc" 
        ? calculateAge(a.dateOfBirth) - calculateAge(b.dateOfBirth)
        : calculateAge(b.dateOfBirth) - calculateAge(a.dateOfBirth);
    }
    // Similar for height
  });
  setProfiles(sorted);
};
```

### 4. **Age Calculation**
```javascript
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
```

---

## 🎨 Image Rendering Pattern

Each page has a custom `RequestImageContainer` or `ProfileImagerender` component:

```javascript
function RequestImageContainer({ profile, activeButton }) {
  // If no photos
  if (!profile?.filesId?.photos?.length) {
    return (
      <div>
        <img src={placeholderImage} />
        <ActionButtons /> // Context-specific buttons
      </div>
    );
  }
  
  // If has photos
  return photos.map(photo => (
    <img src={photo.url} />
  ));
}
```

---

## 🔗 API Routes Summary

| Component | Fetch Route | Action Routes |
|-----------|------------|---------------|
| MyInterest | `profile/myrequests` | `profile/view`, `profile/shortlist`, `profile/request`, `profile/delete/delete`, `profile/reqsent/accept`, `profile/reqsent/reject` |
| PhotoRequest | `profile/photorequests` | `profile/withdrawal`, `profile/accept`, `profile/reject` |
| ShortlistedProfile | `profile/show-shortlisted` | `profile/shortlisted/delete`, `profile/shortlisted/edit` |
| ViewedProfile | `profile/viewed` | `profile/photoRequest` |

---

## 🎯 User Flow Examples

### Example 1: Viewing Received Interest Requests
1. User clicks "My Interests" in profile menu
2. `MyInterest.jsx` loads and fetches data from `profile/myrequests`
3. User clicks "Request Received" tab
4. `switchTab()` updates `activeTab` and displays `data.reqReceived`
5. Each profile shows as `MyInterestCard` with status-based buttons
6. User can: View, Accept, Reject, or Delete requests

### Example 2: Managing Photo Requests
1. User navigates to "Photo Requests"
2. `PhotoRequest.jsx` fetches from `profile/photorequests`
3. Displays sent/received photo requests
4. For received requests: User can Accept or Reject
5. For sent requests: User can Withdraw
6. On action, `refreshData()` increments `refreshKey` to trigger re-fetch

---

## 🐛 Common Issues & Solutions

### Issue 1: Duplicate Button Configs
**Problem**: `RequestCard` and `MyInterestCard` have nearly identical button configurations.

**Solution**: Extract button config to a shared constant or utility function.

### Issue 2: Inconsistent Sorting
**Problem**: Different components use different sorting state structures.

**Solution**: Standardize to `{ criteria: String, direction: String }` across all components.

### Issue 3: Refresh Logic
**Problem**: Using `refreshKey` increment to trigger re-fetch is indirect.

**Solution**: Consider using a more explicit `refetch()` function or React Query for better cache management.

---

## 💡 Improvement Suggestions

1. **Extract Common Logic**: Create a custom hook `useProfileList` for shared pagination, sorting, filtering logic
2. **Unify Card Components**: Merge `RequestCard` and `MyInterestCard` with a config prop
3. **Type Safety**: Add PropTypes or TypeScript for better type checking
4. **Error Handling**: Add user-friendly error messages and retry mechanisms
5. **Loading States**: Add skeleton loaders instead of simple "Loading..." text
6. **Optimize Re-renders**: Use `useMemo` for filtered/sorted profiles
7. **API Abstraction**: Create a service layer for all profile-related API calls

---

## 📊 Component Hierarchy

```
Profile Page
├── MyInterest
│   └── MyInterestCard (multiple)
│       ├── RequestImageContainer
│       ├── ActionButtons
│       └── StatusTag
├── PhotoRequest
│   └── RequestCard (multiple)
│       ├── RequestImageContainer
│       ├── ActionButtons
│       └── StatusTag
├── ShortlistedProfile
│   └── ProfileCard (multiple)
│       └── RequestImageContainer
└── ViewedProfile
    └── ProfileBoxCard (multiple)
        └── RequestImageContainer
```

---

## 🎓 Key Takeaways

1. **Reusability**: `RequestCard` is designed to be reusable across different contexts
2. **State Management**: Each page manages its own state independently
3. **Dynamic UI**: Buttons and actions change based on `status` and `activeTab`
4. **Pagination**: Consistent 4-profiles-per-page across all list views
5. **Dual Tabs**: Most pages have "Sent" vs "Received" views
6. **Image Handling**: Custom image renderers handle empty states with action buttons

---

## 📝 Notes

- All components use the `useAuth` context for API calls
- Profile images default to `blurimage.png` placeholder when unavailable
- Status colors are consistent: Orange (pending), Red (rejected), Green (accepted)
- All API calls use the `updateData` or `fetchUserData` methods from AuthContext
