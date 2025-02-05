const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // Home Page
      {
        path: "/",
        name: "home",
        component: () => import("pages/HomePage.vue"),
      },

      // Brands Page
      {
        path: "/brand",
        name: "Brands",
        component: () => import("pages/BrandsListPage.vue"),
      },
      // Cart Page
      {
        path: "/cart",
        name: "Cart",
        component: () => import("pages/CartPage.vue"),
      },
      // Registration Page
      {
        path: "/register",
        name: "Register",
        component: () => import("pages/RegisterPage.vue"),
      },
      // Login Page
      {
        path: "/login",
        name: "Login",
        component: () => import("pages/LoginPage.vue"),
      },
      // Logout Page
      {
        path: "/logout",
        name: "Logout",
        component: () => import("pages/LogoutPage.vue"),
      },
      // History Page
      {
        path: "/history",
        name: "History",
        component: () => import("pages/OrderHistoryPage.vue"),
      },
      {
        path: "/branchlocator",
        name: "Branches",
        component: () => import("pages/BranchLocatorPage.vue"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];
export default routes;
