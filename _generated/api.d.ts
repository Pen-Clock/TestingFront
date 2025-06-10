/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as courses from "../courses.js";
import type * as http from "../http.js";
import type * as lessons from "../lessons.js";
import type * as notifications from "../notifications.js";
import type * as reviews from "../reviews.js";
import type * as router from "../router.js";
import type * as storage from "../storage.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  categories: typeof categories;
  courses: typeof courses;
  http: typeof http;
  lessons: typeof lessons;
  notifications: typeof notifications;
  reviews: typeof reviews;
  router: typeof router;
  storage: typeof storage;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
