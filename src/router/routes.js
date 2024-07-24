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
      // Util Page
      {
        path: "/utils",
        name: "utility",
        component: () => import("pages/UtilPage.vue"),
      },
      // Brand Page
      {
        path: "/brand",
        name: "brand",
        component: () => import("pages/BrandListPage.vue"),
      },
      // Cart Page
      {
        path: "/cart",
        name: "cart",
        component: () => import("pages/CartPage.vue"),
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
