# Frontend - Elegant Women Clothing

Environment setup:
- Copy .env.example to .env
- Set REACT_APP_API_BASE to your backend base URL (preferred)
- Alternatively set REACT_APP_BACKEND_URL if API_BASE is not provided

API client:
- src/lib/apiClient.js resolves the base URL preferring REACT_APP_API_BASE then REACT_APP_BACKEND_URL
- No hardcoded URLs; ensure one of the env vars is set

Basic verification:
1) Ensure backend is running (see backend_express_js/README.md)
2) Set REACT_APP_API_BASE=http://localhost:3001 in .env
3) Start dev server (npm start)
4) Test a call in app code: apiFetch('/products')
